import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings, submitContactMessage } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'General Inquiry',
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. You can reach out directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoLink = `mailto:${siteSettings.contactEmail}?subject=${encodeURIComponent(
    formData.subject || 'Fashion Inquiry - Yatrababa.com'
  )}&body=${encodeURIComponent(formData.message)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-rose-700 block">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900">
          Contact Yatrababa.com
        </h1>
        <p className="text-stone-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Have questions about a curated piece, affiliate collaboration, or styling recommendation? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info */}
        <div className="md:col-span-5 bg-stone-900 text-white rounded-3xl p-8 space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">
              Direct Contact
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Reach our curation editorial team directly for questions, partnerships, or styling feedback.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-800 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-rose-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                  Official Email
                </span>
                <a
                  href={`mailto:${siteSettings.contactEmail || 'digitalauraverse@gmail.com'}`}
                  className="text-xs sm:text-sm font-medium text-white hover:text-rose-300 transition-colors underline break-all"
                >
                  {siteSettings.contactEmail || 'digitalauraverse@gmail.com'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-rose-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                  Inquiry Response Time
                </span>
                <span className="text-xs text-stone-300">
                  Typically responds within 24–48 hours
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 text-xs text-stone-400 leading-relaxed">
            <p className="font-medium text-stone-300 mb-1">Affiliate Order Note:</p>
            <p className="text-[11px]">
              For questions regarding existing Amazon orders, shipping times, or returns, please log into your official Amazon account, as transactions and fulfillment are handled entirely by Amazon.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Message Received!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
                Thank you for reaching out to Yatrababa.com. Your message has been logged in our inquiries queue, and we will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                Send Us a Message
              </h3>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saree styling inquiry / Collaboration"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white text-stone-900"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>

                <a
                  href={mailtoLink}
                  className="text-xs text-stone-500 hover:text-stone-800 underline text-center"
                >
                  Or open default email client (mailto)
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
