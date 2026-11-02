import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify, formatPrice, isValidAffiliateUrl, isAmazonUrl, filterProducts } from './productUtils';
import { Product } from '../types';

test('slugify converts titles to URL-friendly strings', () => {
  assert.equal(slugify('Banarasi Silk Saree Elegance'), 'banarasi-silk-saree-elegance');
  assert.equal(slugify('Indo-Western Fusion! Top & Pants'), 'indo-western-fusion-top-pants');
  assert.equal(slugify('   Party Wear   2026   '), 'party-wear-2026');
});

test('formatPrice formats amounts according to currency and handles missing prices gracefully', () => {
  assert.equal(formatPrice(49.99, 'USD', 'en-US'), '$49.99');
  assert.equal(formatPrice(undefined, 'USD'), '');
  assert.equal(formatPrice(2999, 'INR', 'en-IN'), '₹2,999.00');
});

test('isValidAffiliateUrl validates http and https URLs', () => {
  assert.equal(isValidAffiliateUrl('https://amzn.to/3Xyz123'), true);
  assert.equal(isValidAffiliateUrl('http://amazon.com/dp/B08XYZ?tag=yatrababa-20'), true);
  assert.equal(isValidAffiliateUrl('javascript:alert(1)'), false);
  assert.equal(isValidAffiliateUrl(''), false);
  assert.equal(isValidAffiliateUrl(undefined), false);
});

test('isAmazonUrl accurately detects Amazon affiliate domains', () => {
  assert.equal(isAmazonUrl('https://amzn.to/3Xyz123'), true);
  assert.equal(isAmazonUrl('https://www.amazon.in/dp/B08XYZ?tag=yatrababa-21'), true);
  assert.equal(isAmazonUrl('https://example.com/item'), false);
});

test('filterProducts filters by category, search query, status, and sorts correctly', () => {
  const sampleProducts: Product[] = [
    {
      id: 'p1',
      name: 'Floral Chiffon Midi Dress',
      slug: 'floral-chiffon-midi-dress',
      imageUrl: '/images/floral.jpg',
      shortDescription: 'Airy summer dress',
      fullDescription: 'Detailed dress info',
      categoryId: 'western-wear',
      categoryName: 'Western Wear',
      price: 59.99,
      affiliateUrl: 'https://amzn.to/311',
      isFeatured: true,
      status: 'published',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'p2',
      name: 'Kanjeevaram Silk Saree',
      slug: 'kanjeevaram-silk-saree',
      imageUrl: '/images/saree.jpg',
      shortDescription: 'Golden zari border',
      fullDescription: 'Detailed saree info',
      categoryId: 'saree-collection',
      categoryName: 'Saree Collection',
      price: 189.0,
      affiliateUrl: 'https://amzn.to/322',
      isFeatured: false,
      status: 'published',
      createdAt: '2026-01-02T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
    },
    {
      id: 'p3',
      name: 'Draft Concept Jacket',
      slug: 'draft-concept-jacket',
      imageUrl: '/images/jacket.jpg',
      shortDescription: 'Draft only',
      fullDescription: 'Detailed jacket info',
      categoryId: 'western-wear',
      categoryName: 'Western Wear',
      price: 120.0,
      affiliateUrl: '',
      isFeatured: false,
      status: 'draft',
      createdAt: '2026-01-03T00:00:00Z',
      updatedAt: '2026-01-03T00:00:00Z',
    },
  ];

  // Category filter
  const sarees = filterProducts(sampleProducts, { categoryId: 'saree-collection', status: 'published' });
  assert.equal(sarees.length, 1);
  assert.equal(sarees[0].id, 'p2');

  // Search filter
  const searchResults = filterProducts(sampleProducts, { searchQuery: 'floral', status: 'published' });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, 'p1');

  // Draft exclusion
  const publishedOnly = filterProducts(sampleProducts, { status: 'published' });
  assert.equal(publishedOnly.length, 2);

  // Price sorting
  const sortedByPriceAsc = filterProducts(sampleProducts, { status: 'published', sortBy: 'price-asc' });
  assert.equal(sortedByPriceAsc[0].id, 'p1');
  assert.equal(sortedByPriceAsc[1].id, 'p2');
});
