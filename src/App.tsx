import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Check } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRoute, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-900 selection:bg-rose-200 selection:text-rose-900">
      <Header />

      <main className="flex-1">
        {currentRoute === 'home' && <HomePage />}
        {currentRoute === 'category' && <CategoryPage />}
        {currentRoute === 'product' && <ProductDetailPage />}
        {currentRoute === 'about' && <AboutPage />}
        {currentRoute === 'contact' && <ContactPage />}
        {currentRoute === 'privacy' && <LegalPage type="privacy" />}
        {currentRoute === 'terms' && <LegalPage type="terms" />}
        {currentRoute === 'affiliate-disclosure' && <LegalPage type="affiliate-disclosure" />}
        {currentRoute === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className="bg-stone-900 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-stone-700">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-2" />
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
