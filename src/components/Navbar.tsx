import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  ChevronDown, 
  Flame, 
  Calendar, 
  Gift, 
  Sun, 
  Menu, 
  X, 
  ArrowRight,
  Heart,
  Lock
} from 'lucide-react';
import { festiveAudio } from '../utils/festiveAudio';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Festival, 
  FestivalCategory, 
  CategoryInfo 
} from '../data/festivals';
import { getStoredFestivals, getStoredCategories } from '../data/festivalStore';

interface NavbarProps {
  onSelectCategory?: (category: FestivalCategory | 'all') => void;
  onSelectFestival?: (festival: Festival) => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  onSelectFestival,
  onGoHome
}) => {
  const [activeDropdown, setActiveDropdown] = useState<FestivalCategory | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<FestivalCategory | null>('hindu');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [festivals, setFestivals] = useState<Festival[]>(() => getStoredFestivals());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => getStoredCategories());

  useEffect(() => {
    const handleDataChanged = () => {
      setFestivals(getStoredFestivals());
      setCategories(getStoredCategories());
    };
    window.addEventListener('shubhakamna_data_changed', handleDataChanged);
    return () => window.removeEventListener('shubhakamna_data_changed', handleDataChanged);
  }, []);

  const handleBellRing = () => {
    festiveAudio.playTempleBell();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category: FestivalCategory) => {
    onGoHome();
    onSelectCategory?.(category);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleFestivalClick = (festival: Festival) => {
    if (onSelectFestival) {
      onSelectFestival(festival);
    } else {
      window.location.search = `?w=${festival.id}`;
    }
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-stone-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <button
          onClick={() => {
            onGoHome();
            onSelectCategory?.('all');
            setActiveDropdown(null);
          }}
          className="group flex items-center gap-2.5 text-left focus-visible:outline-none cursor-pointer shrink-0"
        >
          <div 
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300 active:scale-95 transition-transform"
          >
            <span className="text-xl">🪔</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-serif transition-colors group-hover:text-amber-300">
                Shubhakamna.in
              </span>
              <span className="hidden sm:inline text-[10px] bg-amber-500/20 text-amber-300 font-sans font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                शुभकामना
              </span>
            </div>
            <span className="text-[10px] text-amber-200/70 font-sans truncate max-w-[170px] sm:max-w-none">
              भारत का पावन शुभकामना पोर्टल
            </span>
          </div>
        </button>

        {/* Desktop Categorized Dropdowns */}
        <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          
          {/* Home Button */}
          <button
            onClick={() => {
              onGoHome();
              onSelectCategory?.('all');
              setActiveDropdown(null);
            }}
            className="px-2.5 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition cursor-pointer"
          >
            होम
          </button>

          {/* Dynamic Categories with Floating Dropdown */}
          {categories.map((cat) => {
            const catFestivals = festivals.filter(f => f.category === cat.id);
            const isOpen = activeDropdown === cat.id;

            return (
              <div 
                key={cat.id} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(cat.id)}
              >
                {/* Dropdown Header Button */}
                <button
                  onClick={() => {
                    if (activeDropdown === cat.id) {
                      handleCategoryClick(cat.id);
                    } else {
                      setActiveDropdown(cat.id);
                    }
                  }}
                  className={`px-2.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    isOpen 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900 border border-transparent'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameHi}</span>
                  <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Menu Card */}
                {isOpen && (
                  <div 
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-1 w-72 rounded-2xl bg-stone-900/98 border border-amber-500/40 p-2 shadow-2xl backdrop-blur-2xl animate-fade-in z-50 text-left"
                  >
                    {/* Header info */}
                    <div className="px-3 py-2 border-b border-stone-800 mb-1 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <span>{cat.icon}</span>
                        <span>{cat.nameHi}</span>
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {catFestivals.length} पर्व उपलब्ध
                      </span>
                    </div>

                    {/* Festival list */}
                    <div className="max-h-80 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-stone-700">
                      {catFestivals.map((fest) => (
                        <button
                          key={fest.id}
                          onClick={() => handleFestivalClick(fest)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-500/15 hover:border-amber-500/30 border border-transparent transition flex items-center justify-between group cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-semibold text-white group-hover:text-amber-300 truncate">
                              {fest.nameHi}
                            </p>
                            <p className="text-[10px] text-stone-400 truncate">
                              {fest.dateLabel}
                            </p>
                          </div>
                          <span className="text-xs opacity-0 group-hover:opacity-100 text-amber-400 transition-opacity">
                            →
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* View All under this Category */}
                    <div className="pt-1.5 mt-1 border-t border-stone-800">
                      <button
                        onClick={() => handleCategoryClick(cat.id)}
                        className="w-full py-1.5 px-3 rounded-lg bg-stone-800/80 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold flex items-center justify-between transition cursor-pointer"
                      >
                        <span>सभी {cat.nameHi} देखें</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}

        </nav>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* PWA App Install Button */}
          <PWAInstallButton />

          {/* Temple Bell */}
          <button
            onClick={handleBellRing}
            title="पावन मंदिर की घंटी बजाएँ"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-transform cursor-pointer"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-stone-700 bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer"
            title="त्योहार मेनू खोलें"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Quick Bar */}
      <div className="flex lg:hidden border-t border-stone-800/80 overflow-x-auto px-3 py-2 gap-1.5 text-xs font-medium text-stone-300 scrollbar-none">
        <button
          onClick={() => {
            onGoHome();
            onSelectCategory?.('all');
          }}
          className="shrink-0 px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-200"
        >
          सभी
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              onGoHome();
              onSelectCategory?.(cat.id);
            }}
            className="shrink-0 px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 hover:border-amber-500/30 text-amber-300 flex items-center gap-1"
          >
            <span>{cat.icon}</span>
            <span>{cat.nameHi}</span>
          </button>
        ))}
      </div>

      {/* Full Mobile Categorized Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-500/30 bg-stone-950 p-4 max-h-[85vh] overflow-y-auto animate-fade-in shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs font-bold text-amber-400 font-serif">
                🪔 सभी त्योहार व उत्सव श्रेणियाँ (Select Festival)
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-stone-400 hover:text-white text-xs"
              >
                बंद करें ✕
              </button>
            </div>

            {categories.map(cat => {
              const catFestivals = festivals.filter(f => f.category === cat.id);
              const isExpanded = mobileExpandedCat === cat.id;

              return (
                <div key={cat.id} className="rounded-2xl border border-stone-800 bg-stone-900/60 overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer bg-stone-900"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{cat.nameHi}</p>
                        <p className="text-[10px] text-amber-200/70">{cat.badge} • {catFestivals.length} पर्व</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Festivals under this category */}
                  {isExpanded && (
                    <div className="p-2 space-y-1 bg-black/40 border-t border-stone-800">
                      {catFestivals.map(fest => (
                        <button
                          key={fest.id}
                          onClick={() => handleFestivalClick(fest)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-amber-500/15 text-stone-200 hover:text-amber-300 text-xs flex items-center justify-between transition cursor-pointer"
                        >
                          <span className="font-medium truncate">{fest.nameHi}</span>
                          <span className="text-[10px] text-stone-400 shrink-0 ml-2">{fest.dateLabel}</span>
                        </button>
                      ))}

                      <button
                        onClick={() => handleCategoryClick(cat.id)}
                        className="w-full mt-2 py-2 text-center rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30"
                      >
                        सभी {cat.nameHi} देखें →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
};
