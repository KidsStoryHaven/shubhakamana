import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, AlertCircle, HelpCircle, CheckCircle2, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { updatePageSEO } from '../utils/seoManager';

interface ContactPageProps {
  onGoHome: () => void;
  onNavigateTo: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onGoHome, onNavigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    updatePageSEO({
      title: 'Contact Us | Shubhakamna.in - Official Support & Feedback',
      description: 'Contact the Shubhakamna.in team for questions regarding website content, corrections, feedback, technical assistance, privacy, or advertising inquiries.',
      keywords: 'contact shubhakamna, contact us, feedback, support, email shubhakamna',
      canonicalUrl: 'https://shubhakamna.in/contact/',
      ogType: 'website'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    // Construct mailto link with encoded subject and body
    const subjectMap: Record<string, string> = {
      general: 'General Question / Feedback',
      correction: 'Content Correction / Factual Error',
      technical: 'Technical Issue / Bug Report',
      privacy: 'Privacy Related Question',
      advertising: 'Advertising / Partner Inquiry'
    };

    const subjectText = encodeURIComponent(`[Shubhakamna.in] ${subjectMap[formData.subject] || 'Inquiry'} - ${formData.name || 'Visitor'}`);
    const bodyText = encodeURIComponent(`Sender Name: ${formData.name}\nSender Email: ${formData.email}\nTopic: ${subjectMap[formData.subject] || 'General'}\n\nMessage:\n${formData.message}`);

    // Trigger user's email client
    window.location.href = `mailto:mthawkar72@gmail.com?subject=${subjectText}&body=${bodyText}`;
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-400 font-medium">
        <button 
          onClick={onGoHome}
          className="hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="text-amber-300 font-semibold" aria-current="page">Contact Us</span>
      </nav>

      {/* Header */}
      <header className="space-y-3 border-b border-amber-500/20 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>Get in Touch with Us</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-3xl">
          We welcome questions, suggestions, feedback, and inquiries from our readers and partners. Please reach out to our team using the contact details or form below.
        </p>
      </header>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Official Contact Card & Reason List */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Direct Email Card */}
          <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Official Contact Email
            </span>
            <div>
              <a 
                href="mailto:mthawkar72@gmail.com"
                className="text-lg sm:text-xl font-bold text-white hover:text-amber-300 font-mono transition break-all underline"
              >
                mthawkar72@gmail.com
              </a>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Click the email address above to launch your email client directly. We aim to review and reply to legitimate inquiries within 24–48 hours.
            </p>
          </div>

          {/* Topics We Assist With */}
          <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>You Can Contact Us For:</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Content Questions:</strong> Inquiries about festival dates, greetings, or articles.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Corrections:</strong> Pointing out typographical, date, or factual inaccuracies.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Suggestions:</strong> Recommending new wishing categories, quotes, or features.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Technical Support:</strong> Reporting bugs, broken links, or mobile display issues.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Privacy Queries:</strong> Inquiries regarding our data and privacy practices.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Advertising & Partnerships:</strong> Questions related to third-party ads.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column: Contact & Message Helper Form */}
        <div className="lg:col-span-7 bg-stone-900/70 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-400" />
            <span>Send a Direct Message</span>
          </h2>

          {isSubmitted ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-5 text-center space-y-2 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm sm:text-base font-bold text-white">Email Client Triggered</h3>
              <p className="text-xs text-stone-300">
                Your message details have been passed to your email client addressed to <strong>mthawkar72@gmail.com</strong>.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs text-amber-400 hover:underline font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-stone-300">
                    Your Name (Optional)
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-stone-300">
                    Your Email (Optional)
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-stone-300">
                  Topic of Inquiry
                </label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="general">General Question & Feedback</option>
                  <option value="correction">Content Correction or Factual Error</option>
                  <option value="technical">Technical Issue or Bug</option>
                  <option value="privacy">Privacy Policy Question</option>
                  <option value="advertising">Advertising & Third-Party Ads Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-stone-300">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your question, feedback, or suggestion in detail..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Mail className="w-4 h-4" />
                <span>Send via Email to mthawkar72@gmail.com</span>
              </button>
            </form>
          )}

          <p className="text-[11px] text-stone-500 text-center">
            We value your privacy. We do not sell or share contact emails with external marketing lists.
          </p>
        </div>

      </div>
    </div>
  );
};
