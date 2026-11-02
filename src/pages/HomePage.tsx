import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { AffiliateNotice } from '../components/AffiliateNotice';
import { ArrowRight, Sparkles, Heart, CheckCircle2, Share2, Instagram, Facebook, Youtube, Mail } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, collections, siteSettings, setCurrentRoute, setSelectedCategorySlug } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Filter published products only for public visitors
  const publishedProducts = products.filter((p) => p.status === 'published');

  // Trending products
  const trendingProducts = publishedProducts.filter((p) => p.isTrending).slice(0, 4);
  const displayTrending = trendingProducts.length > 0 ? trendingProducts : publishedProducts.slice(0, 4);

  // Editor's Picks
  const editorsPicks = publishedProducts.filter((p) => p.isEditorsPick).slice(0, 3);
  const displayEditorsPicks = editorsPicks.length > 0 ? editorsPicks : publishedProducts.slice(0, 3);

  // Latest Additions
  const latestAdditions = [...publishedProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* SECTION A: Hero Banner */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Amazon Affiliate Notice Banner */}
        <AffiliateNotice />

        {/* SECTION B: Shop by Category */}
        <section id="shop-by-category" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-rose-700 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Curations</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
                Shop By Category
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mt-2 md:mt-0">
              Browse our hand-selected wardrobes spanning western silhouettes, regal sarees, and traditional celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories
              .filter((c) => c.isEnabled)
              .map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
          </div>
        </section>

        {/* SECTION C: Trending Fashion */}
        <section id="trending-fashion" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-rose-700 mb-1.5 block">
                Popular Discoveries
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Trending Fashion
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setCurrentRoute('category');
              }}
              className="text-xs sm:text-sm font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 mt-2 sm:mt-0 group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTrending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION D: Featured Collections */}
        <section className="bg-stone-50 border border-stone-200/80 rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-700 mb-2 block">
              Curated Edit
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
              Featured Collections
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Handpicked thematic edits bringing together the finest festive looks, everyday wardrobe essentials, and evening statements.
            </p>
          </div>

          <div className="space-y-12">
            {collections
              .filter((col) => col.isEnabled)
              .map((col) => {
                const colProducts = publishedProducts
                  .filter((p) => col.productIds.includes(p.id))
                  .slice(0, 3);

                if (colProducts.length === 0) return null;

                return (
                  <div key={col.id} className="pt-6 first:pt-0 border-t first:border-t-0 border-stone-200">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6">
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-stone-900">{col.title}</h3>
                        <p className="text-xs text-stone-500 mt-1">{col.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategorySlug(null);
                          setCurrentRoute('category');
                        }}
                        className="text-xs font-medium text-stone-700 hover:text-rose-700 flex items-center gap-1 mt-2 sm:mt-0"
                      >
                        Explore Edit <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {colProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* SECTION E: Editor's Picks (Editorial Magazine Layout) */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-rose-700 mb-1.5 block">
              Stylist's Selection
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Editor’s Picks
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Standout couture designs and handcrafted jewelry chosen for craftsmanship and exceptional quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayEditorsPicks.map((pick) => (
              <div
                key={pick.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col hover:border-rose-300 transition-all shadow-xs"
              >
                <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={pick.imageUrl}
                    alt={pick.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <span>{pick.categoryName}</span>
                    <span>·</span>
                    <span>Editor's Choice</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                    {pick.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                    {pick.shortDescription}
                  </p>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        useApp().setSelectedProductSlug(pick.slug);
                        setCurrentRoute('product');
                      }}
                      className="text-xs font-semibold text-stone-800 hover:text-rose-700 transition-colors"
                    >
                      Read Feature →
                    </button>
                    {pick.affiliateUrl && (
                      <a
                        href={pick.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        Shop on Amazon
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION F: Latest Additions */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-rose-700 mb-1.5 block">
                Fresh Drops
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Latest Additions
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setCurrentRoute('category');
              }}
              className="text-xs sm:text-sm font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 group"
            >
              <span>See All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestAdditions.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* SECTION G: Social Media "Follow Us" */}
        <section className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-400">
              Stay Inspired
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Follow Yatrababa.com
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Explore daily lookbooks, styling tips, saree draping ideas, and Amazon shopping deals on our official social channels.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <a
                href={siteSettings.socialLinks.pinterest || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-rose-700 rounded-xl text-xs font-medium transition-colors"
                title="Pinterest"
              >
                <Share2 className="w-4 h-4 text-rose-400" />
                <span>Pinterest</span>
              </a>

              <a
                href={siteSettings.socialLinks.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-rose-700 rounded-xl text-xs font-medium transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4 text-rose-400" />
                <span>Instagram</span>
              </a>

              <a
                href={siteSettings.socialLinks.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-rose-700 rounded-xl text-xs font-medium transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4 text-rose-400" />
                <span>Facebook</span>
              </a>

              <a
                href={siteSettings.socialLinks.youtube || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-rose-700 rounded-xl text-xs font-medium transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4 text-rose-400" />
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION H: Newsletter & Fashion Alert Interest */}
        <section className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-8 sm:p-12 text-center">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Get Weekly Fashion Discovery Alerts
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Be the first to receive updates on hand-picked sarees, festive lehengas, Western style trends, and verified Amazon deals.
            </p>

            {newsletterSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! You are subscribed to Yatrababa.com fashion alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-stone-900"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="text-[11px] text-stone-400">
              We respect your privacy. No spam. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
