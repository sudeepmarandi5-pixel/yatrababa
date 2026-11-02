export interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  additionalImages?: string[];
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  categoryName: string;
  brand?: string;
  price?: number;
  currency?: string;
  affiliateUrl: string;
  availabilityNote?: string;
  isFeatured: boolean;
  isEditorsPick?: boolean;
  isTrending?: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  order: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  isEnabled: boolean;
  order: number;
}

export interface SiteSettings {
  websiteTitle: string;
  contactEmail: string;
  currency: string;
  locale: string;
  socialLinks: {
    pinterest: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
  affiliateDisclosure: string;
  footerText: string;
  aboutContent: string;
  heroBanner: {
    isEnabled: boolean;
    heading: string;
    subtext: string;
    buttonText: string;
    buttonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    imageUrl: string;
  };
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export type PageRoute =
  | 'home'
  | 'category'
  | 'product'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'affiliate-disclosure'
  | 'admin';
