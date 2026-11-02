import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { formatPrice, isValidAffiliateUrl, isAmazonUrl } from '../utils/productUtils';
import { ArrowLeft, ExternalLink, ShieldCheck, Share2, AlertCircle, Sparkles } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductSlug,
    setSelectedProductSlug,
    setCurrentRoute,
    setSelectedCategorySlug,
    siteSettings,
    showToast,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Find product by slug or fallback to first
  const product =
    products.find((p) => p.slug === selectedProductSlug) ||
    products.find((p) => p.status === 'published') ||
    products[0];

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">Product Not Found</h2>
        <button
          onClick={() => setCurrentRoute('home')}
          className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const galleryImages = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean);
  const currentImage = galleryImages[activeImageIndex] || product.imageUrl;

  const hasAffiliate = isValidAffiliateUrl(product.affiliateUrl);
  const isAmazon = isAmazonUrl(product.affiliateUrl);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.status === 'published' && p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentRoute('home')}
            className="hover:text-stone-900 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => {
              setSelectedCategorySlug(product.categoryId);
              setCurrentRoute('category');
            }}
            className="hover:text-stone-900 transition-colors"
          >
            {product.categoryName}
          </button>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main PDP Grid (Contiguous purchase module per guidelines) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Showcase (7 cols on LG) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/90 relative shadow-xs">
            <img
              src={currentImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Thumbnail Strip if additional images exist */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-rose-600 shadow-xs'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Module (5 cols on LG) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-700 font-semibold uppercase tracking-wider mb-2">
              <span>{product.categoryName}</span>
              {product.brand && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-500">{product.brand}</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight [text-wrap:balance]">
              {product.name}
            </h1>
          </div>

          {/* Price & Availability Notice */}
          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2">
            <div className="flex items-baseline justify-between">
              {product.price !== undefined && product.price !== null ? (
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
                    {formatPrice(product.price, product.currency || siteSettings.currency, siteSettings.locale)}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    *Amazon price & availability may change. Check live price below.
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-semibold text-stone-700">Price available on Amazon</span>
                  <span className="text-[11px] text-stone-500 block">Click below to view live current pricing</span>
                </div>
              )}

              {product.availabilityNote && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {product.availabilityNote}
                </span>
              )}
            </div>
          </div>

          {/* Short Highlight */}
          {product.shortDescription && (
            <p className="text-sm text-stone-700 leading-relaxed font-normal">
              {product.shortDescription}
            </p>
          )}

          {/* Amazon Affiliate Primary Action Button */}
          <div className="space-y-3 pt-2">
            {hasAffiliate ? (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 text-sm sm:text-base font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group text-center cursor-pointer"
              >
                <span>{isAmazon ? 'Shop Now on Amazon' : 'View on Affiliate Store'}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl text-center text-xs text-stone-500">
                Affiliate shopping link will be configured soon by the site administrator.
              </div>
            )}

            {/* Mandatory Amazon Affiliate Transparency Disclosure */}
            <div className="p-3 bg-stone-50/80 border border-stone-200/70 rounded-lg text-[11px] text-stone-500 leading-relaxed">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Affiliate Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. Clicking this link redirects directly to the official product page on Amazon. Yatrababa.com does not collect payment or handle shipping.
                </span>
              </div>
            </div>
          </div>

          {/* Full Description & Style Notes */}
          <div className="pt-6 border-t border-stone-200 space-y-3">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Style Notes & Specifications
            </h3>
            <div className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {product.fullDescription || product.shortDescription}
            </div>
          </div>

          {/* Metadata details */}
          <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400 space-y-1">
            <p>Product ID: <span className="font-mono text-stone-600">{product.id}</span></p>
            <p>Curated on Yatrababa.com · Updated {new Date(product.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-rose-700 block mb-1">
                More from {product.categoryName}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                You May Also Admire
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedCategorySlug(product.categoryId);
                setCurrentRoute('category');
              }}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900"
            >
              View Category →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(selected) => {
                  setSelectedProductSlug(selected.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
