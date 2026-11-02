import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { AffiliateNotice } from '../components/AffiliateNotice';
import { filterProducts } from '../utils/productUtils';
import { Search, SlidersHorizontal, PackageOpen, ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
    setCurrentRoute,
  } = useApp();

  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Selected category info
  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug);

  // Filter products: published only + active category + search query + sort
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      status: 'published',
      categoryId: activeCategory ? activeCategory.id : undefined,
      searchQuery: searchQuery,
      sortBy: sortBy,
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(0, currentPage * pageSize);

  const handleSelectCategory = (slug: string | null) => {
    setSelectedCategorySlug(slug);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Category Header & Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[220px] sm:min-h-[260px] flex items-center p-6 sm:p-10">
        {activeCategory?.imageUrl && (
          <img
            src={activeCategory.imageUrl}
            alt={activeCategory.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <button
            onClick={() => setCurrentRoute('home')}
            className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {activeCategory ? activeCategory.name : searchQuery ? `Search Results: "${searchQuery}"` : 'All Fashion Collections'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            {activeCategory?.description ||
              'Discover our complete editorial selection of women’s fashion, sarees, contemporary fusion, and Amazon affiliate essentials.'}
          </p>
        </div>
      </div>

      <AffiliateNotice compact />

      {/* Category Tabs & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        {/* Category Pills / Tabs (Interactive functional buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => handleSelectCategory(null)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategorySlug === null
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Categories ({products.filter((p) => p.status === 'published').length})
          </button>

          {categories
            .filter((c) => c.isEnabled)
            .map((cat) => {
              const count = products.filter(
                (p) => p.status === 'published' && p.categoryId === cat.id
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
        </div>

        {/* Filter Controls: Sort & Keyword Filter */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Keyword Search */}
          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              placeholder="Filter products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent focus:outline-none text-xs text-stone-800 font-medium cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Status */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          Showing <strong className="text-stone-900">{paginatedProducts.length}</strong> of{' '}
          <strong className="text-stone-900">{filteredProducts.length}</strong> styles
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-rose-700 hover:text-rose-900 font-medium underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Product Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8 stroke-1" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">No Products Found</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {searchQuery
              ? `No styles matched your search "${searchQuery}". Try different keywords or browse other categories.`
              : 'There are currently no published products in this category. Check back soon for new curated discoveries.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategorySlug(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {paginatedProducts.length < filteredProducts.length && (
        <div className="text-center pt-8">
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-8 py-3 text-xs sm:text-sm font-semibold text-stone-900 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Load More Styles ({filteredProducts.length - paginatedProducts.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
