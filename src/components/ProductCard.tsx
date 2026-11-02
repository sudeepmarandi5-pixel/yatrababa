import React, { useState } from 'react';
import { Product } from '../types';
import { formatPrice, isValidAffiliateUrl, isAmazonUrl } from '../utils/productUtils';
import { useApp } from '../context/AppContext';
import { ExternalLink, Eye, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { siteSettings, setCurrentRoute, setSelectedProductSlug } = useApp();
  const [imageError, setImageError] = useState(false);

  const hasAffiliateUrl = isValidAffiliateUrl(product.affiliateUrl);
  const isAmazon = isAmazonUrl(product.affiliateUrl);

  const handleOpenDetails = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      setSelectedProductSlug(product.slug);
      setCurrentRoute('product');
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 hover:border-rose-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Product Image Area */}
      <div
        onClick={handleOpenDetails}
        className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer"
      >
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 text-stone-400">
            <ImageOff className="w-10 h-10 mb-2 stroke-1 text-stone-400" />
            <span className="text-xs font-serif text-stone-600">{product.name}</span>
          </div>
        )}

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 bg-white/95 text-stone-900 text-xs font-medium rounded-full shadow-md flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Unboxed Metadata (Zero-Pill discipline) */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5 font-medium tracking-wide">
          <span>{product.categoryName || 'Fashion'}</span>
          {product.brand && (
            <>
              <span aria-hidden="true">·</span>
              <span>{product.brand}</span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h3
          onClick={handleOpenDetails}
          className="font-serif text-base font-semibold text-stone-900 group-hover:text-rose-700 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
        >
          {product.name}
        </h3>

        {/* Short highlight / description */}
        {product.shortDescription && (
          <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed flex-1">
            {product.shortDescription}
          </p>
        )}

        {/* Price Baseline (Optional price in tabular numbers) */}
        <div className="pt-2 mt-auto border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            {product.price !== undefined && product.price !== null ? (
              <div>
                <span className="text-base font-bold text-stone-900 tabular-nums">
                  {formatPrice(product.price, product.currency || siteSettings.currency, siteSettings.locale)}
                </span>
                <span className="text-[10px] text-stone-400 block">Amazon price may vary</span>
              </div>
            ) : (
              <span className="text-xs text-stone-500 italic">Check price on Amazon</span>
            )}

            {product.availabilityNote && (
              <span className="text-[11px] text-emerald-700 font-medium truncate max-w-[120px]">
                {product.availabilityNote}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleOpenDetails}
              className="w-full py-2 px-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors text-center"
            >
              Details
            </button>

            {hasAffiliateUrl ? (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                title="Shop on Amazon with verified affiliate link"
              >
                <span>{isAmazon ? 'Amazon' : 'Shop'}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-2 px-2 text-[11px] font-medium text-stone-400 bg-stone-50 border border-stone-200 rounded-lg cursor-not-allowed text-center"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
