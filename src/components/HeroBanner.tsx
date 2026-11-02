import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { siteSettings, setCurrentRoute, setSelectedCategorySlug } = useApp();
  const [imageError, setImageError] = useState(false);

  const hero = siteSettings.heroBanner;
  if (!hero || hero.isEnabled === false) {
    return null;
  }

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

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white min-h-[520px] lg:min-h-[580px] flex items-center">
      {/* Background Image / SVG Presentation */}
      <div className="absolute inset-0 z-0">
        {!imageError && hero.imageUrl ? (
          <img
            src={hero.imageUrl}
            alt="Yatrababa.com Women's Fashion"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center opacity-45 scale-102"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-stone-950 via-stone-900 to-rose-950/70" />
        )}

        {/* Cinematic Scrim for high text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-stone-950/60" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          {/* Subtle editorial kicker */}
          <div className="flex items-center gap-2 text-rose-300 text-xs sm:text-sm font-medium tracking-widest uppercase mb-4">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Curated Women's Fashion & Amazon Affiliate Boutique</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 [text-wrap:balance]">
            {hero.heading || 'Discover Your Style'}
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-stone-200/90 leading-relaxed font-light mb-8 max-w-xl">
            {hero.subtext ||
              'Explore Western Glamour, Timeless Sarees, and Effortless Desi Elegance with handpicked Amazon discoveries.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleExploreCollections}
              className="px-6 py-3.5 text-sm font-semibold text-stone-900 bg-white hover:bg-rose-50 rounded-xl transition-all shadow-md flex items-center gap-2 group cursor-pointer"
            >
              <span>{hero.buttonText || 'Explore Collections'}</span>
              <ArrowRight className="w-4 h-4 text-stone-900 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleShopTrending}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/30 rounded-xl transition-all cursor-pointer"
            >
              {hero.secondaryButtonText || 'Shop Trending'}
            </button>
          </div>

          {/* Quiet Trust Bar */}
          <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-stone-300">
            <div>
              <span className="font-semibold text-white block">Handpicked Quality</span>
              <span>Top-rated styles</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div>
              <span className="font-semibold text-white block">Trusted Amazon Checkout</span>
              <span>Fast & secure purchase</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div>
              <span className="font-semibold text-white block">Curated Curation</span>
              <span>Ethnic & Western looks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
