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
 * Compress an image file to a lightweight WebP/JPEG data URL for instant offline or fallback use
 */
export async function compressImageToBase64(file: File, maxDim = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
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
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve(dataUrl);
        } catch {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file from user's machine (Mac/PC) to Firebase Storage under /products/
 */
export async function uploadProductImage(
  file: File,
  folder: 'products' | 'categories' | 'site' = 'products',
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  // Validate file
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file format. Please upload JPG, PNG, WebP, SVG, or GIF.');
  }

  const maxBytes = 15 * 1024 * 1024; // 15MB max
  if (file.size > maxBytes) {
    throw new Error('Image size exceeds 15MB limit. Please choose a smaller photo or compress it.');
  }

  // Ensure current user is signed in
  if (!auth.currentUser) {
    throw new Error('Authentication required: Please sign in with your authorized admin Google account before uploading.');
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
    contentType: file.type,
    customMetadata: {
      uploadedBy: auth.currentUser.email || 'admin',
      uploadedAt: new Date().toISOString(),
      originalName: file.name,
    },
  };

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress), snapshot.bytesTransferred, snapshot.totalBytes);
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        let userMessage = error.message;

        if (error.code === 'storage/unauthorized') {
          userMessage = 'Permission denied: Your account is not authorized to write to Firebase Storage. Please ensure your admin email matches the storage rules.';
        } else if (error.code === 'storage/canceled') {
          userMessage = 'Image upload was canceled.';
        } else if (error.code === 'storage/unknown' || error.message.includes('bucket') || error.code === 'storage/bucket-not-found' || error.code === 'storage/project-not-found') {
          userMessage = `Storage bucket not initialized. Please open https://console.firebase.google.com/project/${storage.app.options.projectId}/storage and click "Get started".`;
        } else if (error.code === 'storage/retry-limit-exceeded') {
          userMessage = 'Upload timed out. Please check your internet connection and try again.';
        }

        reject(new Error(userMessage));
      },
      async () => {
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

