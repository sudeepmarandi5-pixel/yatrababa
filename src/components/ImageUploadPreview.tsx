import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import {
  uploadProductImage,
  compressImageToBase64,
  isImageFile,
  getDataUrlSize,
  formatBytes,
} from '../firebase/storageService';

// Built-in curated media library presets for rapid selection
const MEDIA_PRESETS = [
  {
    title: 'Elegant White Saree with Sage Green Blouse',
    url: '/assets/aistudio/Elegant_White_Saree_with_Sage_Green_Blouse_____Ethnic_Fashion_f023b3b4.jpeg',
    category: 'Saree Collection',
  },
  {
    title: 'New Season Women’s Fashion Collage',
    url: '/assets/aistudio/New_Season_Women_s_Fashion_Collage_b4466da5.png',
    category: 'Homepage Banner',
  },
  {
    title: 'Royal Crimson Silk Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    category: 'Saree Collection',
  },
  {
    title: 'Pastel Floral Georgette Anarkali',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    category: 'Ethnic Wear',
  },
  {
    title: 'Emerald Green Chanderi Kurta',
    url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
    category: 'Kurtas & Tunics',
  },
  {
    title: 'Lavender Tiered Midi Dress',
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
    category: 'Western Wear',
  },
  {
    title: 'Blush Pink Boho Wrap Maxi',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80',
    category: 'Western Wear',
  },
  {
    title: 'Ivory Chikankari Embroidered Kurti',
    url: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1000&q=80',
    category: 'Kurtas & Tunics',
  },
];

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
  maxSizeMb = 25,
  folder = 'products',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === 'landscape'
      ? 'aspect-[16/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-[3/4]';

  // Process selected or dropped file with fast client-side compression
  const processFile = async (file: File) => {
    setError(null);
    setStatusNote(null);

    // Validate image format
    if (!isImageFile(file)) {
      setError('Please select a valid image (JPG, PNG, WebP, SVG, GIF, or HEIC).');
      return;
    }

    // Validate size limit (up to 25MB raw file)
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Image size exceeds ${maxSizeMb}MB. Please choose a smaller photo.`);
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Compress instantly to an ultra-lightweight WebP/JPEG data URL (<250KB)
      // This guarantees an immediate, permanent, high-definition image that survives page reloads
      // and fits safely in Firestore without hitting document size limits.
      const compressedDataUrl = await compressImageToBase64(file, 1200, 0.82);
      onChange(compressedDataUrl);

      const byteSize = getDataUrlSize(compressedDataUrl);
      const sizeNote = byteSize > 0 ? ` (${formatBytes(byteSize)})` : '';
      setStatusNote(`Image optimized for fast web catalog${sizeNote}`);

      // Step 2: Attempt background sync to Firebase Storage if available
      try {
        const uploadResult = await uploadProductImage(file, folder);
        if (uploadResult?.url) {
          onChange(uploadResult.url);
          setStatusNote('Image synced directly with Firebase Cloud Storage!');
        }
      } catch (storageErr) {
        // Quiet fallback: If Firebase Storage is uninitialized or unprovisioned,
        // we smoothly keep the optimized data URL so the user can save without interruption.
        console.info('Firebase Storage note (using web-optimized image):', storageErr);
      }
    } catch (err: unknown) {
      console.error('Image processing failed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to process image. Please try another file.';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input value so re-selecting same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
    setActiveTab('upload');
    setError(null);
    setStatusNote('Custom image URL applied.');
  };

  const handleSelectPreset = (presetUrl: string) => {
    onChange(presetUrl);
    setActiveTab('upload');
    setError(null);
    setStatusNote('Selected from Yatrababa Media Library.');
  };

  const handleClearImage = () => {
    onChange('');
    setError(null);
    setStatusNote(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isStorageUrl =
    value &&
    (value.includes('firebasestorage.googleapis.com') ||
      value.startsWith('https://storage.googleapis.com'));
  const isDataUrl = value && value.startsWith('data:image/');
  const currentSize = isDataUrl ? getDataUrlSize(value) : 0;

  return (
    <div className="space-y-2.5">
      {/* Header with Option Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="block text-xs font-semibold text-stone-700">{label}</label>

        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-rose-100 text-rose-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-2 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-rose-100 text-rose-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3 h-3 text-rose-600" />
            <span>Library</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'bg-rose-100 text-rose-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {/* URL Input Form */}
      {activeTab === 'url' && (
        <form onSubmit={handleApplyUrl} className="flex gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
          <input
            type="url"
            placeholder="https://example.com/fashion-dress.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 text-xs px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Apply
          </button>
        </form>
      )}

      {/* Media Library / Presets Selector */}
      {activeTab === 'presets' && (
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-700">Choose from Media Library</span>
            <span className="text-[10px] text-stone-500">1-click select</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
            {MEDIA_PRESETS.map((preset) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`group relative text-left rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected ? 'border-rose-600 ring-2 ring-rose-200' : 'border-stone-200 hover:border-rose-300'
                  }`}
                >
                  <div className="aspect-[3/4] bg-stone-100 overflow-hidden">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-1.5 bg-white text-[10px] truncate">
                    <p className="font-semibold text-stone-800 truncate">{preset.title}</p>
                    <p className="text-[9px] text-rose-700 truncate">{preset.category}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-700 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Upload Dropzone & Preview Box */}
      <div className="relative">
        {value ? (
          <div
            className={`relative ${aspectClass} w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-900/5 group shadow-xs`}
          >
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              onError={() => setError('Image failed to load. Please verify the URL or upload another image.')}
            />

            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white z-20">
                <Loader2 className="w-7 h-7 animate-spin text-rose-400 mb-2" />
                <p className="text-xs font-semibold">Optimizing Image...</p>
                <p className="text-[10px] text-stone-300 mt-0.5">Formatting for ultra-fast loading</p>
              </div>
            )}

            {/* Hover Actions Bar */}
            {!isProcessing && (
              <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 z-10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-semibold bg-white text-stone-900 rounded-xl shadow-md hover:bg-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-rose-700" />
                  <span>Choose Another Image</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="px-3.5 py-1.5 text-xs font-medium bg-red-600/90 text-white rounded-xl shadow-md hover:bg-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            )}

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
              {isStorageUrl && (
                <div className="bg-emerald-700/95 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Cloud Storage</span>
                </div>
              )}
              {isDataUrl && (
                <div className="bg-rose-800/95 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Web Optimized {currentSize > 0 ? `(${formatBytes(currentSize)})` : ''}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`${aspectClass} w-full border-2 border-dashed ${
              isDragging
                ? 'border-rose-600 bg-rose-100/50 scale-[0.99]'
                : 'border-rose-300 hover:border-rose-500 bg-rose-50/25 hover:bg-rose-50/60'
            } rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 group`}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-rose-200 transition-all shadow-xs">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin text-rose-700" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <p className="text-xs font-bold text-stone-900 mb-1">
              Select or Drag Image from Mac / Device
            </p>
            <p className="text-[11px] text-stone-500 mb-3 max-w-xs">
              Drop any photo here (JPG, PNG, WebP, GIF) — automatically compressed & prepared for your catalog
            </p>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-700 text-white text-xs font-semibold rounded-xl group-hover:bg-rose-800 shadow-xs transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Browse File</span>
            </span>
          </div>
        )}

        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg,.avif,.bmp,.heic"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Success / Status Note */}
      {statusNote && !isProcessing && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-200/90 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-medium">{statusNote}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2 text-xs text-rose-900 bg-rose-50 p-3 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-[11px]">Upload Notice</p>
            <p className="text-[11px] mt-0.5 leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-stone-400 hover:text-stone-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
