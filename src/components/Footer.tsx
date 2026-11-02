import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Instagram, Facebook, Youtube, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings, categories, setCurrentRoute, setSelectedCategorySlug } = useApp();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentRoute('category');
  };

  const handleRouteClick = (route: Parameters<typeof setCurrentRoute>[0]) => {
    setSelectedCategorySlug(null);
    setCurrentRoute(route);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Description (2 cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => handleRouteClick('home')}
              className="text-left font-serif text-2xl font-bold text-white tracking-tight flex items-baseline gap-1"
            >
              <span>{siteSettings.websiteTitle || 'Yatrababa.com'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mb-1"></span>
            </button>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              {siteSettings.footerText ||
                'Yatrababa.com is your premier fashion discovery portal for women’s fashion — showcasing Western wear, timeless handloom sarees, vibrant desi style, indo-western couture, party glamour, and artisanal accessories.'}
            </p>

            {/* Contact Email Link */}
            <div className="pt-2">
              <a
                href={`mailto:${siteSettings.contactEmail || 'digitalauraverse@gmail.com'}`}
                className="inline-flex items-center gap-2 text-xs text-rose-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-rose-400" />
                <span>{siteSettings.contactEmail || 'digitalauraverse@gmail.com'}</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* Pinterest */}
                <a
                  href={siteSettings.socialLinks.pinterest || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-rose-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Pinterest"
                  title="Pinterest"
                >
                  <Share2 className="w-4 h-4" />
                </a>

                {/* Instagram */}
                <a
                  href={siteSettings.socialLinks.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-rose-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href={siteSettings.socialLinks.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-rose-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* YouTube */}
                <a
                  href={siteSettings.socialLinks.youtube || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-rose-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Categories Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Fashion Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories
                .filter((c) => c.isEnabled)
                .map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="hover:text-rose-400 transition-colors text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleRouteClick('home')}
                  className="hover:text-rose-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('category')}
                  className="hover:text-rose-400 transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('about')}
                  className="hover:text-rose-400 transition-colors"
                >
                  About Me
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('contact')}
                  className="hover:text-rose-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('admin')}
                  className="hover:text-rose-400 transition-colors"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Affiliate Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Legal & Disclosures
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleRouteClick('affiliate-disclosure')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('privacy')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('terms')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Amazon Associate Notice Banner */}
        <div className="mt-12 pt-6 border-t border-stone-800 text-xs text-stone-400 leading-relaxed">
          <p className="font-medium text-stone-300 mb-1">
            Amazon Associates Program Disclaimer:
          </p>
          <p className="text-[11px] text-stone-400">
            "As an Amazon Associate I earn from qualifying purchases." Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply to the purchase of this product. Yatrababa.com does not sell products directly or process transactions; all purchases are fulfilled externally by Amazon and its sellers.
          </p>
        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 Yatrababa.com. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Curated with editorial passion</span>
            <span>·</span>
            <span>Independent Fashion Discovery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
