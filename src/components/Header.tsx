import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Menu, X, Shield, ShoppingBag } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    siteSettings,
    currentRoute,
    setCurrentRoute,
    categories,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
    isAdmin,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (route: typeof currentRoute, categorySlug: string | null = null) => {
    setSelectedCategorySlug(categorySlug);
    setCurrentRoute(route);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentRoute('category');
      setSelectedCategorySlug(null);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const isHome = currentRoute === 'home';

  return (
    <header
      className={`z-40 transition-all duration-200 ${
        isHome
          ? 'absolute top-0 left-0 right-0 bg-transparent border-transparent shadow-none'
          : 'sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs'
      }`}
    >
      {/* Top micro-bar for quick Amazon affiliate transparency */}
      <div
        className={`text-[11px] py-1.5 px-4 text-center tracking-wide transition-colors flex items-center justify-center gap-2 ${
          isHome
            ? 'bg-transparent text-stone-900 border-b border-stone-900/10 font-medium'
            : 'bg-stone-900 text-stone-200 font-light'
        }`}
      >
        <span>Yatrababa.com · Curated Women's Fashion & Amazon Affiliate Boutique</span>
        <span className={isHome ? 'hidden sm:inline text-stone-500' : 'hidden sm:inline text-stone-400'}>|</span>
        <span className={isHome ? 'hidden sm:inline text-stone-700 text-[10px]' : 'hidden sm:inline text-stone-400 text-[10px]'}>
          As an Amazon Associate I earn from qualifying purchases
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row adhering to 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group flex items-baseline gap-1"
              aria-label="Yatrababa.com Home"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 group-hover:text-rose-700 transition-colors">
                {siteSettings.websiteTitle || 'Yatrababa.com'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mb-1"></span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            className={`hidden lg:flex items-center gap-6 text-[13px] tracking-wide font-medium ${
              isHome ? 'text-stone-800' : 'text-stone-700'
            }`}
          >
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap py-1 border-b-2 ${
                currentRoute === 'home' ? 'border-rose-600 text-stone-950 font-bold' : 'border-transparent'
              }`}
            >
              Home
            </button>

            {categories
              .filter((c) => c.isEnabled)
              .slice(0, 6)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick('category', cat.slug)}
                  className="hover:text-rose-700 transition-colors whitespace-nowrap py-1 border-b-2 border-transparent hover:border-rose-400"
                >
                  {cat.name}
                </button>
              ))}

            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap py-1 border-b-2 ${
                currentRoute === 'about' ? 'border-rose-600 text-stone-950 font-bold' : 'border-transparent'
              }`}
            >
              About Me
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap py-1 border-b-2 ${
                currentRoute === 'contact' ? 'border-rose-600 text-stone-950 font-bold' : 'border-transparent'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Zone 3: Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isHome
                  ? 'text-stone-800 hover:text-stone-950 hover:bg-stone-900/5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Featured Shopping Link */}
            <button
              onClick={() => handleNavClick('category', null)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isHome
                  ? 'text-stone-900 bg-white/70 hover:bg-white/90 border border-stone-300/80 shadow-xs backdrop-blur-xs'
                  : 'text-rose-800 bg-rose-50 border border-rose-200/80 hover:bg-rose-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Catalogue</span>
            </button>

            {/* Admin Portal Access Button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                isAdmin
                  ? 'bg-rose-700 text-white shadow-sm hover:bg-rose-800'
                  : isHome
                  ? 'text-stone-900 hover:text-stone-950 bg-white/70 hover:bg-white/90 border border-stone-300/80 shadow-xs backdrop-blur-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
              }`}
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAdmin ? 'Admin Dashboard' : 'Admin'}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isHome
                  ? 'text-stone-800 hover:text-stone-950 hover:bg-stone-900/5'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[2]" /> : <Menu className="w-6 h-6 stroke-[2]" />}
            </button>
          </div>
        </div>

        {/* Search Bar Flyout */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className={`py-3 ${
              isHome
                ? 'bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-xl px-4 my-2'
                : 'border-t border-stone-200/80'
            }`}
          >
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search sarees, dresses, jewellery, indo-western styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-stone-900 placeholder-stone-400"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 shadow-xl px-4 py-6 max-h-[85vh] overflow-y-auto">
          {/* Quick Search on mobile */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fashion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-100 border border-stone-200 rounded-lg text-stone-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </form>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 mb-1">
              Navigation
            </p>
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg ${
                currentRoute === 'home' ? 'bg-rose-50 text-rose-800 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              Home
            </button>

            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 pt-3 mb-1">
              Categories
            </p>
            {categories
              .filter((c) => c.isEnabled)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick('category', cat.slug)}
                  className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-stone-400">→</span>
                </button>
              ))}

            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 pt-3 mb-1">
              Company & Legal
            </p>
            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg"
            >
              About Me
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg"
            >
              Contact Us
            </button>
            <button
              onClick={() => handleNavClick('affiliate-disclosure')}
              className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg"
            >
              Affiliate Disclosure
            </button>
            <button
              onClick={() => handleNavClick('privacy')}
              className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavClick('terms')}
              className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg"
            >
              Terms & Conditions
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-200">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
