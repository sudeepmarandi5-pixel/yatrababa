import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category, SiteSettings } from '../types';
import { slugify, formatPrice, isValidAffiliateUrl } from '../utils/productUtils';
import { ImageUploadPreview } from '../components/ImageUploadPreview';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Search,
  Sliders,
  Settings,
  FolderTree,
  ShoppingBag,
  Layout,
  ExternalLink,
  LogOut,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    siteSettings,
    currentUser,
    isAdmin,
    isDemoAdmin,
    toggleDemoAdmin,
    loginWithGoogle,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSiteSettings,
    updateHeroBanner,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'homepage' | 'settings'>('products');

  // Product Manager State
  const [productSearch, setProductSearch] = useState('');
  const [productFilterCat, setProductFilterCat] = useState('all');
  const [productFilterStatus, setProductFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Category Manager State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  // Form state for Product Add / Edit
  const [productForm, setProductForm] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    categoryId: categories[0]?.id || 'western-wear',
    categoryName: categories[0]?.name || 'Western Wear',
    brand: '',
    price: '' as string | number,
    currency: siteSettings.currency || 'USD',
    imageUrl: '',
    affiliateUrl: '',
    availabilityNote: 'In Stock on Amazon',
    isFeatured: false,
    isEditorsPick: false,
    isTrending: false,
    status: 'published' as 'published' | 'draft',
  });

  // Form state for Category Add / Edit
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    order: 1,
    isEnabled: true,
  });

  // Form state for Site Settings
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  // Form state for Hero Banner
  const [heroForm, setHeroForm] = useState(siteSettings.heroBanner);

  // Overview Metrics
  const totalPublished = products.filter((p) => p.status === 'published').length;
  const totalDrafts = products.filter((p) => p.status === 'draft').length;
  const totalFeatured = products.filter((p) => p.isFeatured).length;
  const totalCategories = categories.length;

  // Filtered Products for Admin Table
  const filteredProducts = products.filter((p) => {
    if (productFilterStatus !== 'all' && p.status !== productFilterStatus) return false;
    if (productFilterCat !== 'all' && p.categoryId !== productFilterCat) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
    }
    return true;
  });

  // Open Product Editor
  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingProduct(false);
    setProductForm({
      name: prod.name,
      shortDescription: prod.shortDescription || '',
      fullDescription: prod.fullDescription || '',
      categoryId: prod.categoryId,
      categoryName: prod.categoryName,
      brand: prod.brand || '',
      price: prod.price !== undefined ? prod.price : '',
      currency: prod.currency || siteSettings.currency,
      imageUrl: prod.imageUrl,
      affiliateUrl: prod.affiliateUrl || '',
      availabilityNote: prod.availabilityNote || '',
      isFeatured: prod.isFeatured,
      isEditorsPick: prod.isEditorsPick || false,
      isTrending: prod.isTrending || false,
      status: prod.status,
    });
  };

  const handleStartCreateProduct = () => {
    setIsCreatingProduct(true);
    setEditingProduct(null);
    setProductForm({
      name: '',
      shortDescription: '',
      fullDescription: '',
      categoryId: categories[0]?.id || 'western-wear',
      categoryName: categories[0]?.name || 'Western Wear',
      brand: '',
      price: '',
      currency: siteSettings.currency || 'USD',
      imageUrl: categories[0]?.imageUrl || '',
      affiliateUrl: '',
      availabilityNote: 'In Stock on Amazon',
      isFeatured: false,
      isEditorsPick: false,
      isTrending: false,
      status: 'published',
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Product name is required.');
      return;
    }
    if (!productForm.imageUrl.trim()) {
      showToast('Product image is required.');
      return;
    }

    const selectedCat = categories.find((c) => c.id === productForm.categoryId);
    const catName = selectedCat ? selectedCat.name : productForm.categoryName;
    const priceNum = productForm.price !== '' ? Number(productForm.price) : undefined;
    const slug = slugify(productForm.name);

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: productForm.name.trim(),
        slug,
        shortDescription: productForm.shortDescription.trim(),
        fullDescription: productForm.fullDescription.trim(),
        categoryId: productForm.categoryId,
        categoryName: catName,
        brand: productForm.brand.trim() || undefined,
        price: priceNum,
        currency: productForm.currency,
        imageUrl: productForm.imageUrl,
        affiliateUrl: productForm.affiliateUrl.trim(),
        availabilityNote: productForm.availabilityNote.trim() || undefined,
        isFeatured: productForm.isFeatured,
        isEditorsPick: productForm.isEditorsPick,
        isTrending: productForm.isTrending,
        status: productForm.status,
      });
      setEditingProduct(null);
    } else {
      await addProduct({
        name: productForm.name.trim(),
        slug,
        shortDescription: productForm.shortDescription.trim(),
        fullDescription: productForm.fullDescription.trim(),
        categoryId: productForm.categoryId,
        categoryName: catName,
        brand: productForm.brand.trim() || undefined,
        price: priceNum,
        currency: productForm.currency,
        imageUrl: productForm.imageUrl,
        affiliateUrl: productForm.affiliateUrl.trim(),
        availabilityNote: productForm.availabilityNote.trim() || undefined,
        isFeatured: productForm.isFeatured,
        isEditorsPick: productForm.isEditorsPick,
        isTrending: productForm.isTrending,
        status: productForm.status,
      });
      setIsCreatingProduct(false);
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (deletingProductId) {
      await deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  // Category Editor Handlers
  const handleStartCreateCategory = () => {
    setIsCreatingCategory(true);
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      imageUrl: '',
      order: categories.length + 1,
      isEnabled: true,
    });
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setIsCreatingCategory(false);
    setCategoryForm({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl,
      order: cat.order,
      isEnabled: cat.isEnabled,
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Category name is required.');
      return;
    }
    const slug = slugify(categoryForm.name);

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: categoryForm.name.trim(),
        slug,
        description: categoryForm.description.trim(),
        imageUrl: categoryForm.imageUrl || editingCategory.imageUrl,
        order: Number(categoryForm.order),
        isEnabled: categoryForm.isEnabled,
      });
      setEditingCategory(null);
    } else {
      await addCategory({
        name: categoryForm.name.trim(),
        slug,
        description: categoryForm.description.trim(),
        imageUrl: categoryForm.imageUrl,
        order: Number(categoryForm.order),
        isEnabled: categoryForm.isEnabled,
      });
      setIsCreatingCategory(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (deletingCategoryId) {
      try {
        await deleteCategory(deletingCategoryId);
        setDeletingCategoryId(null);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Cannot delete category.');
      }
    }
  };

  // Hero Banner Save
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHeroBanner(heroForm);
  };

  // Site Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(settingsForm);
  };

  // If user is not admin, show secure sign-in / admin access gateway
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Admin Authentication
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              This dashboard is restricted to the owner of Yatrababa.com. Please authenticate to manage products, categories, banner, and settings.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={loginWithGoogle}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Sign in with Google</span>
            </button>

            {/* In-app Instant Evaluation Admin Mode */}
            <div className="pt-4 border-t border-stone-100">
              <p className="text-[11px] text-stone-400 mb-2">
                Testing or Previewing? Toggle Admin Demo Mode:
              </p>
              <button
                type="button"
                onClick={toggleDemoAdmin}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Enable Admin Demo Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-700 text-white flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-stone-900">
                Admin Control Center
              </h1>
              {isDemoAdmin && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Manage Yatrababa.com catalogue, affiliate destinations, categories, and settings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-stone-500 hidden sm:inline">
            Logged in: <strong className="text-stone-800">{currentUser?.email || 'Administrator'}</strong>
          </span>

          <button
            onClick={logout}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Published Products</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tabular-nums">
            {totalPublished}
          </p>
          <span className="text-[11px] text-emerald-600 block mt-1">Live in store</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Draft Products</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tabular-nums">
            {totalDrafts}
          </p>
          <span className="text-[11px] text-stone-400 block mt-1">Unpublished</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Categories</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tabular-nums">
            {totalCategories}
          </p>
          <span className="text-[11px] text-rose-600 block mt-1">Active sections</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Featured Styles</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tabular-nums">
            {totalFeatured}
          </p>
          <span className="text-[11px] text-amber-600 block mt-1">Homepage highlighted</span>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Product Catalogue ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Category Management ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('homepage')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'homepage'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Homepage & Hero Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Site Settings & Social Links</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PRODUCT MANAGEMENT
      ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Category Filter */}
              <select
                value={productFilterCat}
                onChange={(e) => setProductFilterCat(e.target.value)}
                className="text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-700"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={productFilterStatus}
                onChange={(e) => setProductFilterStatus(e.target.value as typeof productFilterStatus)}
                className="text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-700"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>

            <button
              onClick={handleStartCreateProduct}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Form Modal / Section */}
          {(isCreatingProduct || editingProduct) && (
            <div className="bg-white rounded-3xl border-2 border-rose-200 p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {editingProduct ? 'Edit Fashion Product' : 'Add New Fashion Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Image Column */}
                  <div className="md:col-span-4 space-y-3">
                    <ImageUploadPreview
                      value={productForm.imageUrl}
                      onChange={(url) => setProductForm({ ...productForm, imageUrl: url })}
                      label="Product Cover Image *"
                      aspectRatio="portrait"
                    />
                  </div>

                  {/* Fields Column */}
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Maroon Velvet Lehanga with Zari"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Category *
                        </label>
                        <select
                          value={productForm.categoryId}
                          onChange={(e) => {
                            const cat = categories.find((c) => c.id === e.target.value);
                            setProductForm({
                              ...productForm,
                              categoryId: e.target.value,
                              categoryName: cat?.name || '',
                            });
                          }}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Brand / Designer (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Varanasi Weaves"
                          value={productForm.brand}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Price (Optional)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="49.99"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Currency
                        </label>
                        <select
                          value={productForm.currency}
                          onChange={(e) => setProductForm({ ...productForm, currency: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="INR">INR (₹)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Availability Note
                        </label>
                        <input
                          type="text"
                          placeholder="In Stock on Amazon"
                          value={productForm.availabilityNote}
                          onChange={(e) => setProductForm({ ...productForm, availabilityNote: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Amazon Affiliate Destination URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.amazon.com/dp/B08XYZ?tag=yatrababa-20"
                        value={productForm.affiliateUrl}
                        onChange={(e) => setProductForm({ ...productForm, affiliateUrl: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                      />
                      <p className="text-[11px] text-stone-400 mt-1">
                        Ensure you include your verified Amazon affiliate tracking tag.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Short Highlight Description
                      </label>
                      <input
                        type="text"
                        placeholder="Brief summary visible on catalog cards"
                        value={productForm.shortDescription}
                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Full Product Details & Styling Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Detailed fabric information, weave, drape suggestions, occasion guidelines..."
                        value={productForm.fullDescription}
                        onChange={(e) => setProductForm({ ...productForm, fullDescription: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                      />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                          className="rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span>Featured on Homepage</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                        <input
                          type="checkbox"
                          checked={productForm.isTrending}
                          onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })}
                          className="rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span>Trending Section</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                        <input
                          type="checkbox"
                          checked={productForm.isEditorsPick}
                          onChange={(e) => setProductForm({ ...productForm, isEditorsPick: e.target.checked })}
                          className="rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span>Editor's Pick</span>
                      </label>

                      <div className="flex items-center gap-2 text-xs font-medium text-stone-700 ml-auto">
                        <span>Publication Status:</span>
                        <select
                          value={productForm.status}
                          onChange={(e) =>
                            setProductForm({ ...productForm, status: e.target.value as 'published' | 'draft' })
                          }
                          className="bg-stone-100 border border-stone-300 rounded px-2.5 py-1 text-xs"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft (Private)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {editingProduct ? 'Update Product' : 'Create & Save Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Data Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Affiliate Destination</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-12 rounded object-cover border border-stone-200 shrink-0"
                          />
                          <div className="max-w-xs">
                            <span className="font-semibold text-stone-900 block truncate">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-stone-400 block truncate">
                              {p.brand || 'Yatrababa Curation'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                        {p.categoryName}
                      </td>

                      <td className="py-3 px-4 font-medium text-stone-900 whitespace-nowrap tabular-nums">
                        {p.price !== undefined ? formatPrice(p.price, p.currency) : 'N/A'}
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate">
                        {isValidAffiliateUrl(p.affiliateUrl) ? (
                          <a
                            href={p.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <span className="truncate">{p.affiliateUrl}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">No link configured</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            updateProduct(p.id, {
                              status: p.status === 'published' ? 'draft' : 'published',
                            })
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {p.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.status === 'published' ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEditProduct(p)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingProductId(p.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CATEGORY MANAGEMENT
      ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Categories & Collections
              </h2>
              <p className="text-xs text-stone-500">
                Create, reorder, update images, or toggle visibility of fashion categories.
              </p>
            </div>

            <button
              onClick={handleStartCreateCategory}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          {(isCreatingCategory || editingCategory) && (
            <div className="bg-white rounded-3xl border-2 border-rose-200 p-6 sm:p-8 space-y-6 shadow-md">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4">
                    <ImageUploadPreview
                      value={categoryForm.imageUrl}
                      onChange={(url) => setCategoryForm({ ...categoryForm, imageUrl: url })}
                      label="Category Image *"
                      aspectRatio="landscape"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saree Collection"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Short summary displayed on category discovery cards"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={categoryForm.order}
                          onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={categoryForm.isEnabled}
                            onChange={(e) => setCategoryForm({ ...categoryForm, isEnabled: e.target.checked })}
                            className="rounded text-rose-600 focus:ring-rose-500"
                          />
                          <span>Visible to Public</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCategory(false);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
                  <div className="aspect-[16/9] bg-stone-100 relative">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-medium">
                      Order #{cat.order}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-serif text-base font-bold text-stone-900">{cat.name}</h3>
                      <span className="text-[11px] text-stone-500">{count} products</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-4 flex-1">
                      {cat.description}
                    </p>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => updateCategory(cat.id, { isEnabled: !cat.isEnabled })}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer ${
                          cat.isEnabled ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {cat.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(cat)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCategoryId(cat.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: HOMEPAGE & HERO BANNER
      ========================================================================= */}
      {activeTab === 'homepage' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Hero Banner & Homepage Settings
            </h2>
            <p className="text-xs text-stone-500">
              Customize the front page headline, supporting text, CTA buttons, and high-fashion background.
            </p>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={heroForm.isEnabled}
                onChange={(e) => setHeroForm({ ...heroForm, isEnabled: e.target.checked })}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Enable Hero Banner on Homepage</span>
            </label>

            <div>
              <ImageUploadPreview
                value={heroForm.imageUrl}
                onChange={(url) => setHeroForm({ ...heroForm, imageUrl: url })}
                label="Hero Banner Image / Artwork"
                aspectRatio="landscape"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Headline Text
              </label>
              <input
                type="text"
                value={heroForm.heading}
                onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Supporting Text
              </label>
              <textarea
                rows={2}
                value={heroForm.subtext}
                onChange={(e) => setHeroForm({ ...heroForm, subtext: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={heroForm.buttonText}
                  onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Secondary Button Label
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryButtonText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Hero Banner Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SITE SETTINGS & SOCIAL LINKS
      ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Site Identity, Disclosures & Social Links
            </h2>
            <p className="text-xs text-stone-500">
              Manage website metadata, contact email, default currency, and social media channels.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Website Brand Title
                </label>
                <input
                  type="text"
                  value={settingsForm.websiteTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, websiteTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settingsForm.contactEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Default Currency Display
                </label>
                <select
                  value={settingsForm.currency}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="USD">USD ($ - United States)</option>
                  <option value="INR">INR (₹ - India)</option>
                  <option value="GBP">GBP (£ - United Kingdom)</option>
                  <option value="EUR">EUR (€ - Europe)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Default Locale
                </label>
                <input
                  type="text"
                  value={settingsForm.locale}
                  onChange={(e) => setSettingsForm({ ...settingsForm, locale: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Social Media Channels
              </label>
              <div className="space-y-2.5">
                <div>
                  <span className="text-[11px] text-stone-500 block mb-0.5">Pinterest Profile URL</span>
                  <input
                    type="url"
                    value={settingsForm.socialLinks.pinterest}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, pinterest: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-0.5">Instagram Profile URL</span>
                  <input
                    type="url"
                    value={settingsForm.socialLinks.instagram}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-0.5">Facebook Profile URL</span>
                  <input
                    type="url"
                    value={settingsForm.socialLinks.facebook}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-0.5">YouTube Channel URL</span>
                  <input
                    type="url"
                    value={settingsForm.socialLinks.youtube}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, youtube: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Amazon Affiliate Disclosure Text
              </label>
              <textarea
                rows={3}
                value={settingsForm.affiliateDisclosure}
                onChange={(e) => setSettingsForm({ ...settingsForm, affiliateDisclosure: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                About Mission Content
              </label>
              <textarea
                rows={4}
                value={settingsForm.aboutContent}
                onChange={(e) => setSettingsForm({ ...settingsForm, aboutContent: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg leading-relaxed"
              />
            </div>

            <div className="pt-4 border-t border-stone-200">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Site Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {(deletingProductId || deletingCategoryId) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete this {deletingProductId ? 'product' : 'category'}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setDeletingProductId(null);
                  setDeletingCategoryId(null);
                }}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deletingProductId ? handleConfirmDeleteProduct : handleConfirmDeleteCategory}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
