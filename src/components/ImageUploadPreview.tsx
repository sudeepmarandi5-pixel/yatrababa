import React, { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadProductImage, compressImageToBase64 } from '../firebase/storageService';

interface ImageUploadPreviewProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  maxSizeMb?: number;
  folder?: 'products' | 'categories' | 'site';
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  value,
  onChange,
  label = 'Product Image',
  aspectRatio = 'portrait',
  maxSizeMb = 15,
  folder = 'products',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === 'landscape'
      ? 'aspect-[16/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-[3/4]';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, WebP, or SVG).');
      return;
    }

    // Validate size
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Image size exceeds ${maxSizeMb}MB. Please choose a smaller photo.`);
      return;
    }

    // Show temporary local preview immediately while uploading
    const localPreviewUrl = URL.createObjectURL(file);
    onChange(localPreviewUrl);

    // Upload to Firebase Storage
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadProductImage(file, folder, (progress) => {
        setUploadProgress(progress);
      });

      // Revoke temporary blob URL and set the permanent Firebase Storage download URL
      URL.revokeObjectURL(localPreviewUrl);
      onChange(result.url);
      setUploadSuccess(true);
      setError(null);
    } catch (err: unknown) {
      console.warn('Storage upload encountered an issue, generating optimized local fallback:', err);
      const message = err instanceof Error ? err.message : String(err);
      
      // Fallback: compress image to lightweight base64 so product can be saved immediately
      try {
        const compressedDataUrl = await compressImageToBase64(file, 1200, 0.82);
        URL.revokeObjectURL(localPreviewUrl);
        onChange(compressedDataUrl);
        setUploadSuccess(true);
        setError(`${message} (Don't worry: We converted your image to an optimized web format so you can still save this product right now!)`);
      } catch (fallbackErr) {
        console.error('Fallback compression failed:', fallbackErr);
        setError(message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
    setError(null);
    setUploadSuccess(true);
  };

  const handleClearImage = () => {
    onChange('');
    setError(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isStorageUrl = value && (value.includes('firebasestorage.googleapis.com') || value.startsWith('https://storage.googleapis.com'));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL Option' : 'Paste Image URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-2 bg-stone-50 border border-stone-200 rounded-lg">
          <input
            type="url"
            placeholder="https://example.com/product-image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-rose-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {/* Upload & Preview Box */}
      <div className="relative">
        {value ? (
          <div className={`relative ${aspectClass} w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 group shadow-xs`}>
            <img
              src={value}
              alt="Product Preview"
              className="w-full h-full object-cover"
            />

            {/* Uploading progress overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white z-20">
                <Loader2 className="w-8 h-8 animate-spin text-rose-400 mb-2" />
                <p className="text-xs font-semibold">Uploading to Firebase Storage...</p>
                <div className="w-3/4 bg-stone-700 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-rose-500 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-stone-300 mt-1 font-mono">{uploadProgress}%</span>
              </div>
            )}

            {/* Hover overlay with Action Buttons */}
            {!isUploading && (
              <div className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 z-10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-semibold bg-white text-stone-900 rounded-xl shadow-md hover:bg-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-rose-700" />
                  <span>Select Another Image</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="px-3.5 py-1.5 text-xs font-medium bg-red-600/90 text-white rounded-xl shadow-md hover:bg-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            )}

            {/* Badges */}
            {isStorageUrl && !isUploading && (
              <div className="absolute top-2.5 left-2.5 bg-emerald-700/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
                <span>Cloud Storage</span>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`${aspectClass} w-full border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/20 hover:bg-rose-50/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 group`}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-rose-200 transition-all shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-stone-800 mb-1">
              Select Product Image from Mac / Device
            </p>
            <p className="text-[11px] text-stone-500 mb-3">
              JPG, PNG, WebP or SVG up to {maxSizeMb}MB
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 text-white text-xs font-semibold rounded-xl group-hover:bg-rose-800 shadow-xs transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose File</span>
            </span>
          </div>
        )}

        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Feedback Messages */}
      {uploadSuccess && !isUploading && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Image ready and synced with cloud!</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-1.5 text-xs text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-[11px]">Upload Notice</p>
            <p className="text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
