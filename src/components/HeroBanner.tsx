import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Flame } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { siteSettings, setCurrentRoute, setSelectedCategorySlug } = useApp();
  const [imageError, setImageError] = useState(false);

  const hero = siteSettings.heroBanner;
  if (!hero || hero.isEnabled === false) {
    return null;
  }

  const bannerImageUrl =
    hero.imageUrl && !hero.imageUrl.includes('data:image/svg+xml')
      ? hero.imageUrl
      : '/assets/aistudio/New_Season_Women_s_Fashion_Collage_b4466da5.png';

  const handleExploreCollections = () => {
    const el = document.getElementById('shop-by-category');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentRoute('category');
    }
  };

  const handleShopTrending = () => {
    const el = document.getElementById('trending-fashion');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentRoute('category');
    }
  };

  const handleOpenCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentRoute('category');
  };

  return (
    <section className="relative w-full pt-0">
      {/* Editorial Collage Banner Frame - starts at top 0 edge-to-edge behind the transparent overlay header */}
      <div className="relative w-full overflow-hidden bg-stone-950">
        {!imageError ? (
          <div className="relative w-full aspect-[2/1] sm:aspect-[2.1/1] lg:aspect-[2.3/1] min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] overflow-hidden bg-stone-950">
            <img
              src={bannerImageUrl}
              alt="Yatrababa.com New Season Women's Fashion"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              loading="eager"
            />
            {/* Subtle soft gradient overlay ensuring clear dark text/icon contrast at top while keeping header transparent */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-950/20 pointer-events-none" />
          </div>
        ) : (
          <div className="min-h-[440px] sm:min-h-[520px] flex items-center justify-center p-8 bg-gradient-to-r from-stone-950 via-stone-900 to-rose-950 text-white text-center pt-32">
            <div>
              <Sparkles className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-3">
                {hero.heading || 'New Season Women’s Fashion'}
              </h1>
              <p className="text-stone-300 max-w-xl mx-auto text-sm sm:text-base">
                {hero.subtext || 'Trendy • Elegant • Stylish — Handpicked Amazon Discoveries.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Interactive Quick-Access Action Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-4 sm:mt-5 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Nav Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExploreCollections}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenCategory('saree-collection')}
              className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 hover:text-stone-950 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-rose-700" />
              <span>Saree Collection</span>
            </button>

            <button
              onClick={() => handleOpenCategory('western-wear')}
              className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 hover:text-stone-950 rounded-xl transition-colors cursor-pointer"
            >
              Western Wear
            </button>

            <button
              onClick={handleShopTrending}
              className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 hover:text-stone-950 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Trending Outfits</span>
            </button>
          </div>

          {/* Quiet Verified Trust Badge */}
          <div className="flex items-center gap-2 text-xs text-stone-500 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs text-stone-600">
              Handpicked Curation • Verified Amazon Affiliate Links
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

