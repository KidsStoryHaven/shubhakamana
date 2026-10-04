import React, { useState, useEffect } from 'react';
import { Festival, FestivalCategory, CategoryInfo } from '../data/festivals';
import { getStoredFestivals, getStoredCategories } from '../data/festivalStore';
import { resolveDirectImageUrl, getGoogleDriveFallbackUrls } from '../utils/googleDriveHelper';
import { PanchangWidget } from './PanchangWidget';
import { FestivalCountdownTimer } from './FestivalCountdownTimer';
import { DailyMantraWidget } from './DailyMantraWidget';
import { AdBanner } from './AdBanner';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Share2, 
  Flame, 
  Search, 
  ExternalLink, 
  Gift, 
  Globe, 
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface FestivalsPortalProps {
  onSelectFestival: (festival: Festival) => void;
  onOpenDomainGuide?: () => void;
  currentCategory?: FestivalCategory | 'all';
  onCategoryChange?: (category: FestivalCategory | 'all') => void;
  onNavigateToPath?: (path: string) => void;
}

export const FestivalsPortal: React.FC<FestivalsPortalProps> = ({
  onSelectFestival,
  currentCategory = 'all',
  onCategoryChange,
  onNavigateToPath
}) => {
  const [festivals, setFestivals] = useState<Festival[]>(() => getStoredFestivals());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => getStoredCategories());
  const [internalCategory, setInternalCategory] = useState<FestivalCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleDataChanged = () => {
      setFestivals(getStoredFestivals());
      setCategories(getStoredCategories());
    };
    window.addEventListener('shubhakamna_data_changed', handleDataChanged);
    return () => window.removeEventListener('shubhakamna_data_changed', handleDataChanged);
  }, []);

  const selectedCategory = currentCategory !== 'all' ? currentCategory : internalCategory;

  const handleSelectCategory = (cat: FestivalCategory | 'all') => {
    setInternalCategory(cat);
    onCategoryChange?.(cat);
  };

  const filteredFestivals = festivals.filter(f => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch = 
      f.nameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.taglineHi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredFestival = festivals[0]; // Top upcoming festival

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Dynamic Live Countdown Timer for Upcoming Mega Festival */}
      <FestivalCountdownTimer 
        festivals={festivals} 
        onSelectFestival={onSelectFestival} 
      />

      {/* 2. Daily Mantra Sanskrit Shloka Widget (24h daily refresh) */}
      <DailyMantraWidget />

      {/* 3. Daily Hindu Panchang & Shubh Muhurat Widget */}
      <PanchangWidget />

      {/* Domain Acquisition Celebration Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-yellow-950/60 to-stone-950 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>शुभकामना पोर्टल • आधिकारिक पोर्टल Live 🪔</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-serif">
              सभी भारतीय पर्वों एवं उत्सवों की जादुई विशिंग
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              यहाँ से कोई भी व्यक्ति अपने नाम व फोटो की जादुई विशिंग लिंक बनाकर 1-क्लिक में WhatsApp पर शेयर कर सकता है। हर त्योहार का अलग पेज, काउंटडाउन और मनमोहक आतिशबाजी तैयार है।
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-amber-500/20 text-xs">
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <span>🌐</span>
                <span>विश भाषाएँ (9 Languages):</span>
              </span>
              <span className="text-amber-200/80 text-[11px] font-medium">
                हिंदी • मराठी • English • ગુજરાતી • বাংলা • తెలుగు • தமிழ் • ಕನ್ನಡ • ਪੰਜਾਬੀ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Upcoming Grand Festival Spotlight */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 p-6 sm:p-8 shadow-2xl">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>अगला सबसे बड़ा महापर्व (Upcoming Mega Event)</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
              {featuredFestival.nameHi}
            </h3>
            <p className="text-amber-200/90 text-sm sm:text-base leading-relaxed">
              {featuredFestival.taglineHi}
            </p>

            {/* Countdown Badge */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{featuredFestival.dateLabel}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-xs text-amber-200 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{featuredFestival.countdownDays} दिन शेष (Live Countdown)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onSelectFestival(featuredFestival)}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold px-6 py-3 rounded-2xl text-sm sm:text-base transition flex items-center gap-2 shadow-lg shadow-amber-900/50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>अपने नाम की विशिंग लिंक बनाएँ 🚀</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-amber-500/30 shadow-2xl group cursor-pointer"
                 onClick={() => onSelectFestival(featuredFestival)}>
              <img
                src={resolveDirectImageUrl(featuredFestival.heroImage)}
                alt={featuredFestival.nameHi}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
                  <span>टच करके जादुई एनीमेशन देखें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-Content Ad Banner (Google AdSense / Custom) */}
      <AdBanner slotId="in_content" />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-amber-500/30'
            }`}
          >
            सभी त्योहार ({festivals.length})
          </button>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count = festivals.filter(f => f.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-amber-500/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameHi}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/30 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="त्योहार खोजें (उदा. होली, शिवरात्रि)..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Grid of All Festivals (Each is a dedicated page & viral tool) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFestivals.map((fest) => (
          <div
            key={fest.id}
            onClick={() => onSelectFestival(fest)}
            className="group relative rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/50 bg-stone-900/80 hover:bg-stone-900 transition-all duration-300 shadow-lg hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between"
          >
            {/* Image Header with Countdown Badge */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={resolveDirectImageUrl(fest.heroImage)}
                alt={fest.nameHi}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold">
                  {fest.badge}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-amber-200">
                <span className="bg-black/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{fest.dateLabel}</span>
                </span>
                {fest.countdownDays > 0 && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-medium">
                    {fest.countdownDays} दिन बाकी
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white font-serif group-hover:text-amber-300 transition">
                  {fest.nameHi}
                </h4>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {fest.defaultPoem}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-mono">
                  /{fest.slug}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-amber-400 group-hover:text-amber-300 font-semibold">
                  <span>नाम जोड़कर भेजें</span>
                  <Share2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Short About This Website Information Section */}
      <section className="bg-gradient-to-r from-stone-900/90 via-amber-950/20 to-stone-900/90 border border-amber-500/20 rounded-3xl p-5 sm:p-7 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm sm:text-base font-bold text-amber-300 font-serif">
            About This Website (वेबसाइट के बारे में)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Shubhakamna.in is an independent, user-friendly digital platform created to provide culturally authentic festival greetings, relationship wishing cards, daily Hindu Panchang, and auspicious muhurats for readers across India and worldwide. We focus on publishing simple, accessible, and regularly updated content to help you share joyous blessings with loved ones effortlessly.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <a
            href="/about/"
            onClick={(e) => {
              if (onNavigateToPath) {
                e.preventDefault();
                onNavigateToPath('/about/');
              }
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold underline inline-flex items-center gap-1"
          >
            <span>Learn more on our About Us page</span>
            <span>→</span>
          </a>
          <span className="text-stone-600">•</span>
          <a
            href="/privacy-policy/"
            onClick={(e) => {
              if (onNavigateToPath) {
                e.preventDefault();
                onNavigateToPath('/privacy-policy/');
              }
            }}
            className="text-stone-400 hover:text-amber-300 underline"
          >
            Read our Privacy Policy
          </a>
        </div>
      </section>

      {/* AdSense In-Portal Banner */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-3 text-center text-stone-500 text-xs">
        <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1.5 px-1">
          <span>विज्ञापन • ADVERTISEMENT</span>
          <span>Google AdSense Display Unit (728x90)</span>
        </div>
        <div className="h-16 bg-stone-950/70 border border-dashed border-stone-800 rounded-xl flex items-center justify-center text-stone-400 text-xs sm:text-sm">
          <span>यहाँ आपका Google AdSense बैनर विज्ञापन प्रदर्शित होगा (High RPM Spot)</span>
        </div>
      </div>
    </div>
  );
};
