import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart, Compass, ShoppingBag } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteSettings, setCurrentRoute } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Editorial Fashion Mission</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900">
          About Yatrababa.com
        </h1>
        <p className="text-stone-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Your online haven for discovering inspiring women's fashion, curated from trusted collections across the world.
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-xs space-y-8">
        <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {siteSettings.aboutContent}
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">Curated Discovery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We sift through thousands of styles so you can easily discover handpicked sarees, dresses, and jewellery that reflect genuine craftsmanship.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">Feminine & Inclusive</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              From Western power suits to regal Indian festive wear, our edits celebrate diverse silhouettes, traditions, and style expressions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">Affiliate Shopping</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We connect you seamlessly to Amazon with verified links, giving you dependable fulfillment, Prime shipping, and easy returns.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 text-center">
          <button
            onClick={() => setCurrentRoute('category')}
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          >
            Explore Fashion Catalogue
          </button>
        </div>
      </div>
    </div>
  );
};
