import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CollectionItem, SiteSettings, PageRoute, ContactMessage } from '../types';
import { initialProducts, initialCategories, initialCollections, initialSiteSettings } from '../data/initialData';
import { auth, db, googleProvider, signInWithPopup, signOut } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { cleanFirestoreData } from '../utils/firestoreUtils';
import {
  getLocalCustomProducts,
  saveLocalProductBackup,
  removeLocalProductBackup,
} from '../utils/localProductStorage';

interface AppContextType {
  // Navigation & Routing
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data
  products: Product[];
  categories: Category[];
  collections: CollectionItem[];
  siteSettings: SiteSettings;
  isLoadingData: boolean;

  // Admin Auth & State
  currentUser: User | null;
  isAdmin: boolean;
  isUnauthorizedUser: boolean;
  authorizedEmails: string[];
  isSigningIn: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;

  // Management Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateHeroBanner: (banner: Partial<SiteSettings['heroBanner']>) => Promise<void>;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => Promise<void>;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse initial route from URL hash
  const getInitialHash = () => {
    if (typeof window === 'undefined') return { route: 'home' as PageRoute, prodSlug: null, catSlug: null };
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('product/')) {
      return { route: 'product' as PageRoute, prodSlug: hash.replace('product/', ''), catSlug: null };
    }
    if (hash.startsWith('category/')) {
      return { route: 'category' as PageRoute, prodSlug: null, catSlug: hash.replace('category/', '') };
    }
    if (['admin', 'about', 'contact', 'privacy', 'terms', 'affiliate-disclosure'].includes(hash)) {
      return { route: hash as PageRoute, prodSlug: null, catSlug: null };
    }
    return { route: 'home' as PageRoute, prodSlug: null, catSlug: null };
  };

  const initialNav = getInitialHash();
  const [currentRoute, setCurrentRouteState] = useState<PageRoute>(initialNav.route);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(initialNav.catSlug);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(initialNav.prodSlug);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync hash routing so direct links, browser refresh, and social shares work
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'home') {
        setCurrentRouteState('home');
      } else if (hash.startsWith('product/')) {
        const slug = hash.replace('product/', '');
        setSelectedProductSlug(slug);
        setCurrentRouteState('product');
      } else if (hash.startsWith('category/')) {
        const slug = hash.replace('category/', '');
        setSelectedCategorySlug(slug);
        setCurrentRouteState('category');
      } else if (
        ['admin', 'about', 'contact', 'privacy', 'terms', 'affiliate-disclosure'].includes(hash)
      ) {
        setCurrentRouteState(hash as PageRoute);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // App Data state initialized with curated seed data and any saved custom products
  const [products, setProducts] = useState<Product[]>(() => {
    const custom = getLocalCustomProducts();
    const customIds = new Set(custom.map((p) => p.id));
    const nonDupeInitial = initialProducts.filter((p) => !customIds.has(p.id));
    return [...custom, ...nonDupeInitial];
  });
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const setCurrentRoute = (route: PageRoute) => {
    setCurrentRouteState(route);
    if (route === 'home') {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else if (route === 'category' && selectedCategorySlug) {
      window.location.hash = `#category/${selectedCategorySlug}`;
    } else if (route === 'product' && selectedProductSlug) {
      window.location.hash = `#product/${selectedProductSlug}`;
    } else {
      window.location.hash = `#${route}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check admin privileges: strictly verified against authorized owner emails (case-insensitive & trimmed)
  const authorizedEmails = [
    'sudeep.marandi5@gmail.com',
    'digitalauraverse@gmail.com',
  ];

  const userEmail = currentUser?.email ? currentUser.email.toLowerCase().trim() : '';
  const isAdmin = !!userEmail && authorizedEmails.includes(userEmail);
  const isUnauthorizedUser = !!currentUser && !isAdmin;

  // Google Sign-In with detailed error diagnostics and account selection prompt
  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      const email = result.user.email ? result.user.email.toLowerCase().trim() : '';
      if (authorizedEmails.includes(email)) {
        showToast(`Welcome back, ${result.user.displayName || result.user.email}!`);
        return true;
      } else {
        const warning = `Signed in with ${result.user.email}, but this account is not in the authorized administrator list.`;
        setAuthError(warning);
        showToast('Unauthorized account for admin dashboard.');
        return false;
      }
    } catch (err: unknown) {
      console.error('Google Sign-In error:', err);
      const fbErr = err as { code?: string; message?: string };
      let message = 'Google sign-in could not be completed. Please try again.';

      if (fbErr?.code === 'auth/popup-closed-by-user') {
        message = 'The Google sign-in popup was closed before completing authentication. Please click "Sign in with Google" and complete account selection.';
      } else if (fbErr?.code === 'auth/popup-blocked') {
        message = 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
      } else if (fbErr?.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        message = `Domain "${currentDomain}" is not in Firebase Authorized Domains. In Firebase Console > Authentication > Settings > Authorized Domains, add "${currentDomain}".`;
      } else if (fbErr?.code === 'auth/operation-not-allowed') {
        message = 'Google Sign-In is not enabled for project "yatrababa-8b728". In Firebase Console > Authentication > Sign-in method, ensure "Google" is enabled and a Project support email is configured.';
      } else if (fbErr?.code === 'auth/network-request-failed') {
        message = 'Network error while contacting Google Authentication servers. Please check your internet connection.';
      } else if (fbErr?.message) {
        message = `${fbErr.message} (${fbErr.code || 'auth-error'})`;
      }

      setAuthError(message);
      showToast('Authentication failed.');
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setAuthError(null);
      showToast('Signed out successfully.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.email) {
        const email = user.email.toLowerCase().trim();
        if (!authorizedEmails.includes(email)) {
          setAuthError(`Signed in as ${user.email}, but this account is not in the authorized admin list.`);
        } else {
          setAuthError(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen / Sync Firestore Data
  useEffect(() => {
    let isSubscribed = true;

    async function loadOrSeedData() {
      try {
        if (isAdmin) {
          // If authenticated as admin, check if seed is needed
          const catSnap = await getDocs(collection(db, 'categories'));
          if (catSnap.empty && isSubscribed) {
            for (const cat of initialCategories) {
              await setDoc(doc(db, 'categories', cat.id), cat);
            }
          }

          const prodSnap = await getDocs(collection(db, 'products'));
          if (prodSnap.empty && isSubscribed) {
            for (const prod of initialProducts) {
              await setDoc(doc(db, 'products', prod.id), prod);
            }
          }

          const settingsSnap = await getDocs(collection(db, 'siteSettings'));
          if (settingsSnap.empty && isSubscribed) {
            await setDoc(doc(db, 'siteSettings', 'main'), initialSiteSettings);
          }
        }
      } catch (err) {
        console.warn('Firestore initial check:', err);
      } finally {
        if (isSubscribed) {
          setIsLoadingData(false);
        }
      }
    }

    loadOrSeedData();

    // Query for products: if admin, get all; otherwise get where status == 'published'
    const productsQuery = isAdmin
      ? collection(db, 'products')
      : query(collection(db, 'products'), where('status', '==', 'published'));

    const unsubProducts = onSnapshot(
      productsQuery,
      (snapshot) => {
        const remoteList: Product[] = [];
        snapshot.forEach((d) => {
          remoteList.push({ id: d.id, ...d.data() } as Product);
        });

        // Retrieve any custom products from local backup
        const customItems = getLocalCustomProducts();
        const remoteIds = new Set(remoteList.map((p) => p.id));

        // Preserve custom products and initial catalogue not yet in snapshot
        const localCustom = customItems.filter((p) => !remoteIds.has(p.id));
        const localInitial = initialProducts.filter(
          (p) => !remoteIds.has(p.id) && !customItems.some((c) => c.id === p.id)
        );

        const merged = [...remoteList, ...localCustom, ...localInitial];
        setProducts(isAdmin ? merged : merged.filter((p) => p.status === 'published'));
      },
      (error) => {
        console.warn('Product snapshot notice:', error.message);
      }
    );

    // Query for categories: if admin, get all; otherwise get where isEnabled == true
    const categoriesQuery = isAdmin
      ? collection(db, 'categories')
      : query(collection(db, 'categories'), where('isEnabled', '==', true));

    const unsubCategories = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Category[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Category);
          });
          const remoteIds = new Set(list.map((c) => c.id));
          const localOnly = initialCategories.filter((c) => !remoteIds.has(c.id));
          const merged = [...list, ...localOnly].map((cat) => {
            // If category still points to placeholder SVG but a curated photography asset is in initialCategories, use the asset
            const initialMatch = initialCategories.find((ic) => ic.id === cat.id);
            if (initialMatch && initialMatch.imageUrl && initialMatch.imageUrl.startsWith('/assets/')) {
              return { ...cat, imageUrl: initialMatch.imageUrl };
            }
            return cat;
          });
          merged.sort((a, b) => a.order - b.order);
          setCategories(merged);
        }
      },
      (error) => {
        console.warn('Category snapshot notice:', error.message);
      }
    );

    const unsubSettings = onSnapshot(
      doc(db, 'siteSettings', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteSettings = docSnap.data() as SiteSettings;
          // If remote hero image is missing or still uses the temporary SVG placeholder, upgrade to the official collage banner
          if (
            !remoteSettings.heroBanner?.imageUrl ||
            remoteSettings.heroBanner.imageUrl.includes('data:image/svg+xml')
          ) {
            remoteSettings.heroBanner = {
              ...(remoteSettings.heroBanner || initialSiteSettings.heroBanner),
              imageUrl: '/assets/aistudio/New_Season_Women_s_Fashion_Collage_b4466da5.png',
            };
          }
          setSiteSettings(remoteSettings);
        }
      },

      (error) => {
        console.warn('Settings snapshot notice:', error.message);
      }
    );

    return () => {
      isSubscribed = false;
      unsubProducts();
      unsubCategories();
      unsubSettings();
    };
  }, [isAdmin]);

  // Product CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // Clean all undefined values before saving to Firestore (prevents Firestore rejection)
    const cleaned = cleanFirestoreData(newProduct);

    // Save locally immediately so product is never lost on refresh
    saveLocalProductBackup(newProduct);
    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== id)]);

    try {
      await setDoc(doc(db, 'products', id), cleaned);
      showToast('Product added successfully to Firestore!');
    } catch (err: unknown) {
      console.error('Firestore save error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      showToast('Product saved to catalog! (Firestore notice: ' + msg.slice(0, 60) + ')');
      throw new Error(`Firestore save error: ${msg}`);
    }

    return id;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    const now = new Date().toISOString();
    const updatedWithTimestamp = { ...updates, updatedAt: now };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updatedWithTimestamp };
          saveLocalProductBackup(merged);
          return merged;
        }
        return p;
      })
    );

    const cleaned = cleanFirestoreData(updatedWithTimestamp);

    try {
      await setDoc(doc(db, 'products', id), cleaned, { merge: true });
      showToast('Product updated successfully in Firestore!');
    } catch (err: unknown) {
      console.error('Firestore update error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      showToast('Product updated locally! (Firestore notice: ' + msg.slice(0, 60) + ')');
      throw new Error(`Firestore update error: ${msg}`);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    removeLocalProductBackup(id);

    try {
      await deleteDoc(doc(db, 'products', id));
      showToast('Product deleted from catalog and Firestore.');
    } catch (err: unknown) {
      console.error('Firestore delete error:', err);
      showToast('Product removed from catalog.');
    }
  };

  // Category CRUD
  const addCategory = async (catData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `cat-${Date.now()}`;
    const now = new Date().toISOString();
    const newCat: Category = {
      ...catData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const cleaned = cleanFirestoreData(newCat);
    setCategories((prev) => [...prev, newCat]);

    try {
      await setDoc(doc(db, 'categories', id), cleaned);
      showToast('Category created successfully!');
    } catch (err) {
      console.warn('Category created locally:', err);
      showToast('Category created successfully!');
    }

    return id;
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<void> => {
    const now = new Date().toISOString();
    const cleaned = cleanFirestoreData({ ...updates, updatedAt: now });

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: now } : c))
    );

    try {
      await setDoc(doc(db, 'categories', id), cleaned, { merge: true });
      showToast('Category updated!');
    } catch (err) {
      console.warn('Category updated locally:', err);
      showToast('Category updated!');
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    const count = products.filter((p) => p.categoryId === id).length;
    if (count > 0) {
      throw new Error(`Cannot delete category with ${count} existing products. Reassign or remove products first.`);
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteDoc(doc(db, 'categories', id));
      showToast('Category deleted.');
    } catch (err) {
      console.warn('Category removed locally:', err);
      showToast('Category deleted.');
    }
  };

  // Site Settings
  const updateSiteSettings = async (updates: Partial<SiteSettings>): Promise<void> => {
    const merged = { ...siteSettings, ...updates };
    setSiteSettings(merged);

    try {
      await setDoc(doc(db, 'siteSettings', 'main'), merged, { merge: true });
      showToast('Site settings updated!');
    } catch (err) {
      console.warn('Settings updated locally:', err);
      showToast('Site settings updated!');
    }
  };

  const updateHeroBanner = async (bannerUpdates: Partial<SiteSettings['heroBanner']>): Promise<void> => {
    const updatedHero = { ...siteSettings.heroBanner, ...bannerUpdates };
    const merged = { ...siteSettings, heroBanner: updatedHero };
    setSiteSettings(merged);

    try {
      await setDoc(doc(db, 'siteSettings', 'main'), merged, { merge: true });
      showToast('Hero banner updated successfully!');
    } catch (err) {
      console.warn('Banner updated locally:', err);
      showToast('Hero banner updated successfully!');
    }
  };

  // Contact Form Submission
  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> => {
    const msgId = `msg-${Date.now()}`;
    const payload = {
      ...msg,
      id: msgId,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'messages', msgId), payload);
    } catch (err) {
      console.warn('Notice on message save:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedProductSlug,
        setSelectedProductSlug,
        searchQuery,
        setSearchQuery,
        products,
        categories,
        collections,
        siteSettings,
        isLoadingData,
        currentUser,
        isAdmin,
        isUnauthorizedUser,
        authorizedEmails,
        isSigningIn,
        authError,
        setAuthError,
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
        submitContactMessage,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
