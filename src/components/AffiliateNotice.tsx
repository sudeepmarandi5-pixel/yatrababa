import React from 'react';
import { useApp } from '../context/AppContext';

export const AffiliateNotice: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { siteSettings, setCurrentRoute } = useApp();

  if (compact) {
    return (
      <div className="text-[11px] text-stone-500 flex items-center gap-1.5 py-1">
        <span>As an Amazon Associate I earn from qualifying purchases.</span>
        <button
          onClick={() => setCurrentRoute('affiliate-disclosure')}
          className="text-stone-700 underline hover:text-rose-700 transition-colors ml-1 font-medium"
        >
          Disclosure
        </button>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-3 sm:p-4 text-xs text-stone-600 my-4 leading-relaxed">
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1">
          <strong className="text-stone-900 font-medium">Affiliate Disclosure:</strong>{' '}
          {siteSettings.affiliateDisclosure || 'As an Amazon Associate I earn from qualifying purchases.'}
        </p>
        <button
          onClick={() => setCurrentRoute('affiliate-disclosure')}
          className="shrink-0 text-rose-700 hover:text-rose-900 underline font-medium text-xs"
        >
          Read Policy
        </button>
      </div>
    </div>
  );
};
