import React, { useEffect } from 'react';
import { Sparkles, Heart, Globe, ShieldCheck, Mail, ArrowLeft, BookOpen, Compass, CheckCircle2 } from 'lucide-react';
import { updatePageSEO } from '../utils/seoManager';

interface AboutPageProps {
  onGoHome: () => void;
  onNavigateTo: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onGoHome, onNavigateTo }) => {
  useEffect(() => {
    updatePageSEO({
      title: 'About Us | Shubhakamna.in - Independent Festive & Greeting Platform',
      description: 'Learn about Shubhakamna.in, an independent online platform dedicated to providing easy-to-understand festival greetings, cultural guides, and helpful content.',
      keywords: 'about shubhakamna, about us, festival greetings portal, independent greetings platform',
      canonicalUrl: 'https://shubhakamna.in/about/',
      ogType: 'website'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
        <span className="text-amber-300 font-semibold" aria-current="page">About Us</span>
      </nav>

      {/* Hero Header */}
      <header className="space-y-3 border-b border-amber-500/20 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Independent Online Platform</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
          About Shubhakamna.in
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-3xl">
          Welcome to Shubhakamna.in. We are an independent, digital platform dedicated to making festive greetings, cultural traditions, shubh muhurats, and meaningful messages simple, accessible, and enjoyable for everyone.
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="space-y-8 text-stone-200 text-sm sm:text-base leading-relaxed">
        
        {/* Mission & Purpose */}
        <section className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-serif flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Our Mission and Purpose</span>
          </h2>
          <p className="text-stone-300">
            Shubhakamna.in was created with a clear objective: to offer a clean, reliable, and user-friendly destination where visitors can find thoughtfully written festival wishes, heartfelt greeting messages for personal milestones (birthdays, anniversaries, congratulations), and accurate cultural insights.
          </p>
          <p className="text-stone-300">
            In our fast-paced digital world, expressing warm sentiments to family, friends, and colleagues should be quick, meaningful, and heartfelt. We aim to help people connect across distances through words of positivity, blessing, and joy.
          </p>
        </section>

        {/* What We Provide */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>What You Will Find on Our Platform</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Curated Festive Wishes & Poetry</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                Original and thoughtfully collected Hindi & English greetings, shayari, and meaningful quotes for major Indian festivals including Diwali, Holi, Raksha Bandhan, Eid, Christmas, Gurpurab, and more.
              </p>
            </div>

            <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Personal Occasion Collections</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                Categorized relationship-specific wishes for mothers, fathers, sisters, brothers, friends, spouses, and colleagues for birthdays, anniversaries, and success celebrations.
              </p>
            </div>

            <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Daily Panchang & Shubh Muhurat</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                Daily Vedic calendar insights including Tithi, Nakshatra, Rahukaal, and auspicious festival timings to help you observe traditional practices with clarity.
              </p>
            </div>

            <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click Sharing Tools</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                Interactive web utilities that allow visitors to personalize greetings with their own name and share directly to WhatsApp and social channels effortlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Commitment to Quality */}
        <section className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-serif flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <span>Our Commitment to Quality & Reader Experience</span>
          </h2>
          <p className="text-stone-300">
            We continuously work to improve the content, readability, and mobile responsiveness of Shubhakamna.in. We believe in keeping web pages fast-loading, clean, and free of deceptive patterns or intrusive overlays.
          </p>
          <p className="text-stone-300">
            Our editorial approach prioritizes clarity, cultural authenticity, and respectful expression. We update our festival dates and content regularly to ensure accuracy for upcoming events.
          </p>
        </section>

        {/* Independence & Transparency Disclaimer */}
        <section className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-amber-200 font-serif flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Independence & Third-Party Disclosure</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            <strong>Shubhakamna.in</strong> is an independently created and operated informational website. We are <strong>not affiliated with, endorsed by, or partnered with Google LLC, Meta (Facebook/WhatsApp), or any other corporation</strong> unless explicitly mentioned.
          </p>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            All trademarks, logos, and service marks displayed on the website belong to their respective owners and are referenced solely for descriptive and informational identification purposes.
          </p>
        </section>

        {/* Contact & Feedback */}
        <section className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">Have feedback or suggestions?</h3>
            <p className="text-xs text-stone-400">
              We welcome corrections, suggestions, and queries from our readers.
            </p>
          </div>
          <button
            onClick={() => onNavigateTo('/contact/')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Our Team</span>
          </button>
        </section>

      </div>
    </div>
  );
};
