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
  Lock,
  Trophy,
  User,
  LogOut,
  CreditCard
} from 'lucide-react';
import { festiveAudio } from '../utils/festiveAudio';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Festival, 
  FestivalCategory, 
  CategoryInfo 
} from '../data/festivals';
import { getStoredFestivals, getStoredCategories } from '../data/festivalStore';
import { getCurrentUser, logoutUser, UserProfile } from '../data/userStore';

interface NavbarProps {
  onSelectCategory?: (category: FestivalCategory | 'all') => void;
  onSelectFestival?: (festival: Festival) => void;
  onGoHome: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAuth?: () => void;
  onNavigateToPath?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  onSelectFestival,
  onGoHome,
  onOpenLeaderboard,
  onOpenAuth,
  onNavigateToPath
}) => {
  const [activeDropdown, setActiveDropdown] = useState<FestivalCategory | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<FestivalCategory | null>('hindu');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const [festivals, setFestivals] = useState<Festival[]>(() => getStoredFestivals());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => getStoredCategories());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());

  useEffect(() => {
    const handleDataChanged = () => {
      setFestivals(getStoredFestivals());
      setCategories(getStoredCategories());
    };
    const handleUserChanged = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('shubhakamna_data_changed', handleDataChanged);
    window.addEventListener('shubhakamna_user_session_changed', handleUserChanged);
    window.addEventListener('shubhakamna_users_changed', handleUserChanged);

    return () => {
      window.removeEventListener('shubhakamna_data_changed', handleDataChanged);
      window.removeEventListener('shubhakamna_user_session_changed', handleUserChanged);
      window.removeEventListener('shubhakamna_users_changed', handleUserChanged);
    };
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
        
        {/* Official Brand Logo */}
        <button
          onClick={() => {
            onGoHome();
            onSelectCategory?.('all');
            setActiveDropdown(null);
          }}
          className="group flex items-center gap-2 focus-visible:outline-none cursor-pointer shrink-0 py-1"
          title="Shubhakamna.in - भारत का पावन शुभकामना पोर्टल"
        >
          <img 
            src="/logo.svg" 
            alt="Shubhakamna - Festival Wishes" 
            className="h-11 sm:h-13 w-auto max-w-[210px] sm:max-w-[270px] object-contain drop-shadow-[0_2px_12px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform"
          />
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

          {/* Shubh Prabhat 100 Daily Suvichar Button */}
          <button
            onClick={() => {
              setActiveDropdown(null);
              setIsMobileMenuOpen(false);
              if (onNavigateToPath) {
                onNavigateToPath('/shubh-prabhat/');
              } else {
                window.location.pathname = '/shubh-prabhat/';
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-500/25 hover:from-amber-500/35 hover:to-yellow-500/35 text-amber-300 font-bold border border-amber-500/40 hover:border-amber-400 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="दैनिक १०० शुभ प्रभात सुविचार व फोटो कार्ड"
          >
            <Sun className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            <span>शुभ प्रभात</span>
            <span className="text-[9px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded-full">
              100
            </span>
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
          {/* Leaderboard Button */}
          <button
            onClick={() => onOpenLeaderboard?.()}
            title="मासिक लीडरबोर्ड व विजेता देखें"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 text-amber-300 hover:text-white hover:border-amber-400 active:scale-95 transition cursor-pointer text-xs font-bold shadow-sm"
          >
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">लीडरबोर्ड</span>
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-white hover:border-emerald-400 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-800 border border-emerald-400 shrink-0 flex items-center justify-center">
                  {currentUser.photoUrl ? (
                    <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-white truncate max-w-[90px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    {currentUser.points} pts
                  </span>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border-2 border-emerald-500/40 bg-stone-950 p-3 shadow-2xl z-50 space-y-2.5 text-xs animate-fade-in">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-stone-800">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-800 border border-emerald-400 shrink-0 flex items-center justify-center">
                      {currentUser.photoUrl ? (
                        <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white truncate">{currentUser.name}</h4>
                      <p className="text-[10px] text-stone-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-[11px]">कुल अंक (Points):</span>
                      <span className="font-extrabold text-amber-400 font-mono text-sm">{currentUser.points} pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 text-[11px]">कुल शेयर्स:</span>
                      <span className="font-bold text-white">{currentUser.sharesCount} बार</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                      <span className="text-stone-400 text-[10px] flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-emerald-400" />
                        <span>इनाम UPI:</span>
                      </span>
                      <span className="font-mono text-emerald-300 text-[10px] truncate max-w-[130px]" title={currentUser.upiId}>
                        {currentUser.upiId}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenLeaderboard?.();
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-left font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>🏆 लीडरबोर्ड व अपनी रैंक देखें</span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-left font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>खाता लॉग आउट करें</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth?.()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 active:scale-95 transition cursor-pointer text-xs font-extrabold shadow-md shadow-amber-500/20"
            >
              <User className="h-3.5 w-3.5" />
              <span>लॉग इन / रिवॉर्ड्स 🎁</span>
            </button>
          )}

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
      <div className="flex lg:hidden border-t border-stone-800/80 overflow-x-auto px-3 py-2 gap-1.5 text-xs font-medium text-stone-300 scrollbar-none items-center">
        {/* Mobile Shubh Prabhat Button */}
        <button
          onClick={() => {
            if (onNavigateToPath) {
              onNavigateToPath('/shubh-prabhat/');
            } else {
              window.location.pathname = '/shubh-prabhat/';
            }
          }}
          className="shrink-0 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-500/25 border border-amber-400/60 text-amber-300 font-bold flex items-center gap-1 shadow-sm"
        >
          <Sun className="w-3.5 h-3.5 text-yellow-400" />
          <span>शुभ प्रभात (100)</span>
        </button>

        {/* Mobile Leaderboard Quick Link */}
        <button
          onClick={() => onOpenLeaderboard?.()}
          className="shrink-0 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>लीडरबोर्ड</span>
        </button>

        {/* Mobile User Status / Login */}
        {currentUser ? (
          <button
            onClick={() => onOpenLeaderboard?.()}
            className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{currentUser.name} ({currentUser.points} pts)</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenAuth?.()}
            className="shrink-0 px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center gap-1"
          >
            <span>लॉग इन 🎁</span>
          </button>
        )}

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

            {/* Featured Shubh Prabhat Link */}
            <div 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onNavigateToPath) {
                  onNavigateToPath('/shubh-prabhat/');
                } else {
                  window.location.pathname = '/shubh-prabhat/';
                }
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/80 via-yellow-950/60 to-amber-950/80 border border-amber-500/40 cursor-pointer flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
                  <Sun className="w-4 h-4 text-yellow-400 animate-spin" />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-200">🌅 शुभ प्रभात • आज के १०० सुविचार</p>
                  <p className="text-[10px] text-stone-300">अपनी बड़ी फ़ोटो के साथ आज का स्टेटस बनाएँ</p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2 py-1 rounded-lg border border-amber-500/30">
                खोलें →
              </span>
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
