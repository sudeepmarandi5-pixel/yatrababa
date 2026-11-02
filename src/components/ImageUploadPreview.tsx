import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface ImageUploadPreviewProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  maxSizeMb?: number;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  value,
  onChange,
  label = 'Product Image',
  aspectRatio = 'portrait',
  maxSizeMb = 5,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === 'landscape'
      ? 'aspect-[16/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-[3/4]';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, WebP, or SVG).');
      return;
    }

    // Validate size
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Image size exceeds ${maxSizeMb}MB. Please choose a smaller image.`);
      return;
    }

    // Read to Data URL for instant preview and database storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setError('Failed to process image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleClearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL Option' : 'Paste Image URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-2 bg-stone-50 border border-stone-200 rounded-lg">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-rose-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded"
          >
            Apply
          </button>
        </div>
      )}

      {/* Upload & Preview Box */}
      <div className="relative">
        {value ? (
          <div className={`relative ${aspectClass} max-w-sm rounded-xl overflow-hidden border border-stone-200 bg-stone-50 group`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-semibold bg-white text-stone-900 rounded-lg shadow-sm hover:bg-stone-100"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1.5 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`${aspectClass} max-w-sm border-2 border-dashed border-stone-300 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/20 rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors`}
          >
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-xs font-medium text-stone-800 mb-1">
              Click to upload an image from your device
            </p>
            <p className="text-[11px] text-stone-500">
              JPG, PNG, WebP or SVG up to {maxSizeMb}MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
