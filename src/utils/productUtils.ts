import { Product } from '../types';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function formatPrice(price?: number, currency: string = 'USD', locale: string = 'en-US'): string {
  if (price === undefined || price === null || isNaN(price)) {
    return '';
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
}

export function isValidAffiliateUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isAmazonUrl(url?: string): boolean {
  if (!isValidAffiliateUrl(url)) return false;
  try {
    const parsed = new URL(url!);
    return parsed.hostname.includes('amazon.') || parsed.hostname.includes('amzn.to');
  } catch {
    return false;
  }
}

export interface FilterOptions {
  categoryId?: string;
  searchQuery?: string;
  status?: 'draft' | 'published' | 'all';
  featuredOnly?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name';
}

export function filterProducts(products: Product[], options: FilterOptions): Product[] {
  return products
    .filter((product) => {
      // Status filter
      if (options.status && options.status !== 'all') {
        if (product.status !== options.status) return false;
      }

      // Category filter
      if (options.categoryId && options.categoryId !== 'all') {
        if (product.categoryId !== options.categoryId && product.categoryName?.toLowerCase() !== options.categoryId.toLowerCase()) {
          return false;
        }
      }

      // Featured filter
      if (options.featuredOnly && !product.isFeatured) {
        return false;
      }

      // Search query filter
      if (options.searchQuery && options.searchQuery.trim().length > 0) {
        const query = options.searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchShortDesc = product.shortDescription?.toLowerCase().includes(query) ?? false;
        const matchBrand = product.brand?.toLowerCase().includes(query) ?? false;
        const matchCategory = product.categoryName?.toLowerCase().includes(query) ?? false;
        if (!matchName && !matchShortDesc && !matchBrand && !matchCategory) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (options.sortBy) {
        case 'price-asc':
          return (a.price ?? 0) - (b.price ?? 0);
        case 'price-desc':
          return (b.price ?? 0) - (a.price ?? 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });
}
