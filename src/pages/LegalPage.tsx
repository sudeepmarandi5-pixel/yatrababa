import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, FileText, Info } from 'lucide-react';

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' | 'affiliate-disclosure' }> = ({ type }) => {
  const { siteSettings, setCurrentRoute } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Navigation Sub-Tabs for Legal Docs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setCurrentRoute('affiliate-disclosure')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            type === 'affiliate-disclosure'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Affiliate Disclosure</span>
        </button>

        <button
          onClick={() => setCurrentRoute('privacy')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            type === 'privacy'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setCurrentRoute('terms')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            type === 'terms'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms and Conditions</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-xs space-y-8">
        {type === 'affiliate-disclosure' && (
          <div className="space-y-6 text-stone-700 text-sm leading-relaxed">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 block mb-1">
                Transparency Notice
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Amazon Affiliate Disclosure
              </h1>
              <p className="text-xs text-stone-400 mt-1">Last updated: 2026</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-medium">
              <p className="text-base font-serif italic mb-1">
                "As an Amazon Associate I earn from qualifying purchases."
              </p>
              <p className="text-xs text-amber-800">
                Official Amazon Associates Program compliance statement.
              </p>
            </div>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              1. What is an Affiliate Link?
            </h2>
            <p>
              Yatrababa.com is an independent women’s fashion discovery and editorial curation website. Some of the outbound links on this website are affiliate links, primarily through the Amazon Associates Program. If you click on one of these links and purchase an item on Amazon, Yatrababa.com may earn a modest referral commission at no additional cost to you.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              2. No Direct Sales or Fulfillment
            </h2>
            <p>
              Yatrababa.com is not an online store, seller, or retailer. We do not store inventory, process credit card payments, or ship products. All orders, payments, shipping, warranties, and returns are handled entirely by Amazon and its authorized merchants.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              3. Pricing and Availability Disclaimer
            </h2>
            <p>
              Product prices, customer reviews, stock availability, and shipping times are subject to frequent change on Amazon. Any prices displayed on Yatrababa.com are accurate at the time of publication but may differ from the actual price on Amazon. The price and availability displayed on the Amazon website at the time of your purchase will apply.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              4. Editorial Integrity
            </h2>
            <p>
              Our styling suggestions and fashion curations are chosen based on aesthetics, design quality, and customer popularity. We do not accept payment to promote inferior merchandise. If you have questions regarding our affiliate disclosures, please contact us at{' '}
              <a href={`mailto:${siteSettings.contactEmail}`} className="text-rose-700 underline font-medium">
                {siteSettings.contactEmail}
              </a>.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-6 text-stone-700 text-sm leading-relaxed">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 block mb-1">
                User Privacy
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Privacy Policy
              </h1>
              <p className="text-xs text-stone-400 mt-1">Effective Date: 2026</p>
            </div>

            <p>
              At Yatrababa.com, accessible from {siteSettings.websiteTitle}, one of our primary priorities is the privacy of our visitors. This Privacy Policy document describes the types of information that is collected and recorded by Yatrababa.com and how we use it.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              1. Information We Collect
            </h2>
            <p>
              We do not require public visitors to register an account or provide payment card numbers to browse our fashion curations. When you contact us through our contact form or newsletter form, we collect your name and email address to respond to your inquiry.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              2. Cookies and Tracking Technologies
            </h2>
            <p>
              Like any other website, Yatrababa.com may utilize standard cookies and analytical telemetry strictly to understand navigation patterns and improve site responsiveness. Outbound links to Amazon may place an affiliate tracking cookie on your browser in accordance with Amazon’s privacy policy.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              3. Third-Party Privacy Policies
            </h2>
            <p>
              Yatrababa.com’s Privacy Policy does not apply to other advertisers or third-party websites such as Amazon, Pinterest, or Instagram. We advise you to consult the respective Privacy Policies of these third-party platforms for more detailed information.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              4. Contact Us
            </h2>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at {siteSettings.contactEmail}.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-6 text-stone-700 text-sm leading-relaxed">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 block mb-1">
                Website Usage
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Terms and Conditions
              </h1>
              <p className="text-xs text-stone-400 mt-1">Effective Date: 2026</p>
            </div>

            <p>
              Welcome to Yatrababa.com! These terms and conditions outline the rules and regulations for the use of the Yatrababa.com website.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              1. Informational & Curation Purpose
            </h2>
            <p>
              The content provided on Yatrababa.com is for general fashion discovery, aesthetic inspiration, and affiliate referral purposes only. We make every reasonable effort to keep images, descriptions, and styling advice current.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              2. Outbound Links and Third Parties
            </h2>
            <p>
              This website contains links to external websites, specifically Amazon.com. We have no control over the content, terms of service, customer support, or privacy practices of these third-party sites and assume no responsibility for them.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              3. Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, Yatrababa.com owns the intellectual property rights for all material on Yatrababa.com. All intellectual property rights are reserved. You may view and print pages from Yatrababa.com for personal, non-commercial use only.
            </p>

            <h2 className="font-serif text-xl font-bold text-stone-900 pt-2">
              4. Limitation of Liability
            </h2>
            <p>
              In no event shall Yatrababa.com, nor any of its contributors or administrators, be liable for anything arising out of or in any way connected with your use of this website or purchases made on third-party affiliate platforms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
