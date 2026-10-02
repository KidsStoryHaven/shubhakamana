import React from 'react';
import { Bell, Sparkles, Globe, Flame, Calendar, Gift, Sun } from 'lucide-react';
import { festiveAudio } from '../utils/festiveAudio';

interface NavbarProps {
  onSelectCategory?: (category: 'all' | 'festival' | 'god' | 'celebration' | 'daily') => void;
  onOpenDomainGuide: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  onOpenDomainGuide,
  onGoHome
}) => {
  const handleBellRing = () => {
    festiveAudio.playTempleBell();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-stone-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <button
          onClick={onGoHome}
          className="group flex items-center gap-2.5 text-left focus-visible:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300">
            <span className="text-xl">🪔</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-serif transition-colors group-hover:text-amber-300">
                Shubhakamna.in
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-sans font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                शुभकामना
              </span>
            </div>
            <span className="text-[10px] text-amber-200/70 font-sans">
              पावन त्योहार एवं उत्सव विशिंग पोर्टल
            </span>
          </div>
        </button>

        {/* Desktop Festival Category Filters */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => {
              onGoHome();
              onSelectCategory?.('all');
            }}
            className="px-3 py-1.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-900 border border-transparent hover:border-stone-800 transition cursor-pointer"
          >
            सभी त्योहार
          </button>
          <button
            onClick={() => {
              onGoHome();
              onSelectCategory?.('festival');
            }}
            className="px-3 py-1.5 rounded-full text-stone-300 hover:text-amber-300 hover:bg-stone-900 border border-transparent hover:border-amber-500/20 transition cursor-pointer flex items-center gap-1"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>महापर्व (दिवाली/होली)</span>
          </button>
          <button
            onClick={() => {
              onGoHome();
              onSelectCategory?.('celebration');
            }}
            className="px-3 py-1.5 rounded-full text-stone-300 hover:text-purple-300 hover:bg-stone-900 border border-transparent hover:border-purple-500/20 transition cursor-pointer flex items-center gap-1"
          >
            <Gift className="w-3.5 h-3.5 text-purple-400" />
            <span>जन्मदिन व न्यू ईयर</span>
          </button>
          <button
            onClick={() => {
              onGoHome();
              onSelectCategory?.('god');
            }}
            className="px-3 py-1.5 rounded-full text-stone-300 hover:text-amber-300 hover:bg-stone-900 border border-transparent hover:border-amber-500/20 transition cursor-pointer flex items-center gap-1"
          >
            <span>🕉️ देव आराधना</span>
          </button>
          <button
            onClick={() => {
              onGoHome();
              onSelectCategory?.('daily');
            }}
            className="px-3 py-1.5 rounded-full text-stone-300 hover:text-yellow-300 hover:bg-stone-900 border border-transparent hover:border-yellow-500/20 transition cursor-pointer flex items-center gap-1"
          >
            <Sun className="w-3.5 h-3.5 text-yellow-400" />
            <span>दैनिक सुप्रभात</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* GoDaddy Setup Guide Link */}
          <button
            onClick={onOpenDomainGuide}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GoDaddy सेटअप</span>
          </button>

          {/* Temple Bell */}
          <button
            onClick={handleBellRing}
            title="पावन मंदिर की घंटी बजाएँ"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-transform cursor-pointer"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Category Quick Bar */}
      <div className="flex md:hidden border-t border-stone-800/80 overflow-x-auto px-4 py-2 gap-2 text-xs font-medium text-stone-300 scrollbar-none">
        <button
          onClick={() => {
            onGoHome();
            onSelectCategory?.('all');
          }}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-200"
        >
          सभी पर्व
        </button>
        <button
          onClick={() => {
            onGoHome();
            onSelectCategory?.('festival');
          }}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-300"
        >
          🪔 महापर्व
        </button>
        <button
          onClick={() => {
            onGoHome();
            onSelectCategory?.('celebration');
          }}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-purple-300"
        >
          🎂 जन्मदिन
        </button>
        <button
          onClick={() => {
            onGoHome();
            onSelectCategory?.('god');
          }}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-cyan-300"
        >
          🕉️ शिव/राम
        </button>
        <button
          onClick={onOpenDomainGuide}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold"
        >
          🌐 GoDaddy
        </button>
      </div>
    </header>
  );
};
