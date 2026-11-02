import { Product } from '../types';

const STORAGE_KEY = 'yatrababa_custom_products_v1';

export function getLocalCustomProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse local product backup:', e);
    return [];
  }
}

export function saveLocalProductBackup(product: Product): void {
  try {
    const list = getLocalCustomProducts();
    const filtered = list.filter((p) => p.id !== product.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([product, ...filtered]));
  } catch (e) {
    console.warn('Failed to save product to local backup:', e);
  }
}

export function removeLocalProductBackup(productId: string): void {
  try {
    const list = getLocalCustomProducts();
    const filtered = list.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to remove product from local backup:', e);
  }
}
