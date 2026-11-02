import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from './config';

export interface UploadProgressCallback {
  (percent: number, bytesTransferred: number, totalBytes: number): void;
}

export interface UploadResult {
  url: string;
  fullPath: string;
  fileName: string;
}

/**
 * Check if a file is an image by MIME type or file extension
 */
export function isImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp|gif|svg|avif|bmp|heic|heif)$/i.test(file.name);
}

/**
 * Helper to format bytes to human-readable string (e.g., "145 KB", "1.2 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Helper to calculate byte size of a data URL or base64 string
 */
export function getDataUrlSize(dataUrl: string): number {
  if (!dataUrl) return 0;
  if (!dataUrl.startsWith('data:')) return 0;
  const base64Str = dataUrl.split(',')[1] || '';
  return Math.round((base64Str.length * 3) / 4);
}

/**
 * Compress an image file to an ultra-lightweight WebP/JPEG data URL (<250 KB)
 * for instant preview, offline persistence, and safe Firestore storage (well below 1MB limit).
 */
export async function compressImageToBase64(file: File, maxDim = 1200, quality = 0.82): Promise<string> {
  // If SVG, read directly as data URL without canvas rasterization
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target?.result as string;
      if (!rawData) {
        reject(new Error('Unable to read selected image file.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(rawData);
          return;
        }

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawData);
          return;
        }

        // Fill white background for transparent images converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal compression, fallback to JPEG
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // If the resulting data URL is still large (>350KB), re-compress at 850px / 0.75 quality
        // to guarantee it fits safely in Firestore without degrading visual beauty
        if (dataUrl.length > 450000) {
          const smallCanvas = document.createElement('canvas');
          const scale = 850 / Math.max(width, height);
          smallCanvas.width = Math.round(width * scale);
          smallCanvas.height = Math.round(height * scale);
          const smallCtx = smallCanvas.getContext('2d');
          if (smallCtx) {
            smallCtx.fillStyle = '#FFFFFF';
            smallCtx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
            smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            try {
              dataUrl = smallCanvas.toDataURL('image/jpeg', 0.76);
            } catch {
              // keep previous dataUrl
            }
          }
        }

        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback: If image cannot be decoded by browser canvas (e.g., raw HEIC), return raw data
        console.warn('Image canvas decoding failed, using raw data fallback.');
        resolve(rawData);
      };

      img.src = rawData;
    };

    reader.onerror = () => reject(new Error('Failed to read image file. Please check file permissions.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file from user's machine (Mac/PC) to Firebase Storage under /products/
 * Includes a 6-second timeout to avoid 2-minute hangs when the storage bucket is not activated.
 */
export async function uploadProductImage(
  file: File,
  folder: 'products' | 'categories' | 'site' = 'products',
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  // Validate file is an image
  if (!isImageFile(file)) {
    throw new Error('Invalid file format. Please upload JPG, PNG, WebP, SVG, or GIF.');
  }

  const maxBytes = 25 * 1024 * 1024; // 25MB max input before local optimization
  if (file.size > maxBytes) {
    throw new Error('Image size exceeds 25MB limit. Please choose a smaller photo.');
  }

  // Ensure current user is signed in
  if (!auth.currentUser) {
    throw new Error('Firebase Auth: Sign in with your admin Google account to sync directly to Cloud Storage.');
  }

  // Generate safe filename with timestamp
  const timestamp = Date.now();
  const cleanName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
  const filePath = `${folder}/${timestamp}_${cleanName}`;
  const storageRef = ref(storage, filePath);

  const metadata = {
    contentType: file.type || 'image/jpeg',
    customMetadata: {
      uploadedBy: auth.currentUser.email || 'admin',
      uploadedAt: new Date().toISOString(),
      originalName: file.name,
    },
  };

  return new Promise((resolve, reject) => {
    let isSettled = false;
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Timeout: If Storage bucket is unprovisioned or network hangs, fail fast after 6 seconds
    const timeoutTimer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        try {
          uploadTask.cancel();
        } catch {
          // ignore cancel error
        }
        reject(
          new Error('Firebase Storage timeout: Storage bucket may not be initialized in Firebase Console.')
        );
      }
    }, 6000);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.totalBytes > 0 ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100 : 0;
        if (onProgress) {
          onProgress(Math.round(progress), snapshot.bytesTransferred, snapshot.totalBytes);
        }
      },
      (error) => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timeoutTimer);
        console.warn('Firebase Storage upload response:', error);
        let userMessage = error.message;

        if (error.code === 'storage/unauthorized') {
          userMessage = 'Storage permission denied: Admin authorization required.';
        } else if (error.code === 'storage/canceled') {
          userMessage = 'Image upload was canceled.';
        } else if (
          error.code === 'storage/unknown' ||
          error.message.includes('bucket') ||
          error.code === 'storage/bucket-not-found' ||
          error.code === 'storage/project-not-found'
        ) {
          userMessage = 'Firebase Storage bucket not initialized in Firebase Console.';
        } else if (error.code === 'storage/retry-limit-exceeded') {
          userMessage = 'Upload timed out. Storage bucket may not be active.';
        }

        reject(new Error(userMessage));
      },
      async () => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timeoutTimer);
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadUrl,
            fullPath: filePath,
            fileName: cleanName,
          });
        } catch (urlErr) {
          console.error('Error getting download URL:', urlErr);
          reject(new Error('Failed to retrieve uploaded image public URL.'));
        }
      }
    );
  });
}


