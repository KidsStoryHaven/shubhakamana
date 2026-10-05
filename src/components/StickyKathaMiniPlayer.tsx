import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Headphones, 
  ChevronDown, 
  X, 
  Sparkles 
} from 'lucide-react';
import { kathaAudio } from '../utils/kathaAudioEngine';

interface StickyKathaMiniPlayerProps {
  festivalId: string;
  festivalTitle?: string;
}

export const StickyKathaMiniPlayer: React.FC<StickyKathaMiniPlayerProps> = ({ 
  festivalId, 
  festivalTitle = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeParaIndex, setActiveParaIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [totalChapters, setTotalChapters] = useState<number>(4);

  // Clean title for display in the mini sticky card
  const displayTitle = (festivalTitle || 'पावन कथा')
    .split('•')[0]
    .replace('शुभ', '')
    .replace('की हार्दिक शुभकामनाएँ', '')
    .trim();

  useEffect(() => {
    // Reset dismissed state when festival changes so user can hear the new festival's story
    setIsDismissed(false);
    setIsMinimized(false);

    const unsubscribe = kathaAudio.subscribe((state) => {
      if (state.activeFestivalId === festivalId) {
        setIsPlaying(state.isPlaying);
        setActiveParaIndex(state.activeParaIndex);
        setTotalChapters(state.totalChapters || 4);
      } else {
        setIsPlaying(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [festivalId]);

  if (isDismissed) return null;

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    kathaAudio.toggle();
  };

  const handleScrollToKatha = () => {
    const el = document.getElementById('festival-katha-section') || document.getElementById('navratri-katha-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSections = kathaAudio.getCurrentSections();
  const currentChapter = currentSections[activeParaIndex];

  // Minimized Floating Pill Mode
  if (isMinimized) {
    return (
      <div className="fixed top-18 right-3 sm:top-20 sm:right-6 z-40 animate-fadeIn">
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-md transition-all cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 text-stone-950 font-black border-amber-300 animate-pulse'
              : 'bg-stone-900/90 hover:bg-stone-800 text-amber-300 border-amber-500/50'
          }`}
          title={`${displayTitle} कथा प्लेयर खोलें`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">
            {isPlaying ? 'कथा बज रही है...' : `${displayTitle} कथा`}
          </span>
        </button>
      </div>
    );
  }

  // Sticky Note Style Upper Mini-Player (Unobtrusive & Elegant for all festivals)
  return (
    <aside 
      aria-label={`${displayTitle} Katha Mini Player`}
      className="fixed top-18 right-3 sm:top-20 sm:right-6 z-40 max-w-[280px] animate-fadeIn"
    >
      <div 
        onClick={handleScrollToKatha}
        className={`relative overflow-hidden rounded-2xl border-2 shadow-2xl p-2.5 transition-all cursor-pointer backdrop-blur-md group ${
          isPlaying
            ? 'bg-gradient-to-r from-amber-950/95 via-stone-900/95 to-amber-950/95 border-amber-400 shadow-amber-500/30 ring-1 ring-amber-400/50'
            : 'bg-stone-950/90 hover:bg-stone-900/95 border-amber-500/50 hover:border-amber-400 shadow-black/80'
        }`}
      >
        {/* Glow corner light */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2">
          
          {/* Left: Play/Pause Big Round Button directly on the sticky note */}
          <button
            onClick={handleTogglePlay}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-md cursor-pointer shrink-0 ${
              isPlaying
                ? 'bg-gradient-to-tr from-red-600 to-amber-500 text-white animate-pulse'
                : 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 hover:scale-105 active:scale-95'
            }`}
            title={isPlaying ? 'कथा रोकें (Pause)' : 'कथा सुनें (Play Audio)'}
            aria-label={isPlaying ? 'Pause Katha' : 'Play Katha'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Middle: Title & Live Chapter Status */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-red-600/90 text-white font-black px-1.5 py-0.2 rounded-md uppercase">
                {isPlaying ? 'लाइव' : 'कथा'}
              </span>
              <p className="text-xs font-black text-amber-200 truncate group-hover:text-amber-100">
                {displayTitle} पावन कथा
              </p>
            </div>
            <p className="text-[10px] text-stone-300 truncate mt-0.5">
              {isPlaying && currentChapter
                ? `अध्याय ${activeParaIndex + 1}/${totalChapters}: ${currentChapter.title.replace(/^[०-९1-9IVXLCDM]+\.\s*/, '').slice(0, 18)}...`
                : '🎧 मधुर स्वर में कथा सुनें'}
            </p>
          </div>

          {/* Right: Down arrow to jump to story + Minimize & Close */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800 transition text-[10px]"
              title="छोटा करें"
              aria-label="Minimize"
            >
              _
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800 transition"
              title="बंद करें"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Bottom subtle indicator line */}
        <div className="mt-1.5 pt-1 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-amber-300/80">
          <span className="flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
            <span>पूरी कथा व नियम नीचे पढ़ें</span>
          </span>
          <ChevronDown className="w-3 h-3 text-amber-400 group-hover:translate-y-0.5 transition" />
        </div>

      </div>
    </aside>
  );
};
