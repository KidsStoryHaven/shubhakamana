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
      <div className="fixed top-16 right-2 sm:top-18 sm:right-4 z-40 animate-fadeIn">
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border shadow-lg backdrop-blur-md transition-all cursor-pointer text-[10px] ${
            isPlaying
              ? 'bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 text-stone-950 font-black border-amber-300 animate-pulse'
              : 'bg-stone-900/90 hover:bg-stone-800 text-amber-300 border-amber-500/40'
          }`}
          title={`${displayTitle} कथा खोलें`}
        >
          <Headphones className="w-3 h-3" />
          <span className="font-bold">
            {isPlaying ? 'कथा चालू...' : '🎧 कथा'}
          </span>
        </button>
      </div>
    );
  }

  // Super-Compact Sleek Katha Mini Player (Bohot Chota & Elegant)
  return (
    <aside 
      aria-label={`${displayTitle} Katha Mini Player`}
      className="fixed top-16 right-2 sm:top-18 sm:right-4 z-40 max-w-[200px] sm:max-w-[220px] animate-fadeIn"
    >
      <div 
        onClick={handleScrollToKatha}
        className={`relative overflow-hidden rounded-xl border shadow-xl px-2 py-1.5 transition-all cursor-pointer backdrop-blur-md group ${
          isPlaying
            ? 'bg-gradient-to-r from-amber-950/95 via-stone-900/95 to-amber-950/95 border-amber-400/80 shadow-amber-500/20 ring-1 ring-amber-400/40'
            : 'bg-stone-950/90 hover:bg-stone-900/95 border-amber-500/40 hover:border-amber-400 shadow-black/80'
        }`}
      >
        <div className="flex items-center justify-between gap-1.5">
          {/* Play/Pause Small Round Button */}
          <button
            onClick={handleTogglePlay}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition shadow cursor-pointer shrink-0 ${
              isPlaying
                ? 'bg-gradient-to-tr from-red-600 to-amber-500 text-white animate-pulse'
                : 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 hover:scale-105 active:scale-95'
            }`}
            title={isPlaying ? 'रोकें' : 'कथा सुनें'}
            aria-label={isPlaying ? 'Pause Katha' : 'Play Katha'}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current ml-0.5" />
            )}
          </button>

          {/* Title & Live Status (Compact) */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1">
              <span className="text-[8px] bg-red-600/90 text-white font-black px-1 py-0.1 rounded uppercase">
                {isPlaying ? 'लाइव' : 'कथा'}
              </span>
              <p className="text-[10px] font-black text-amber-200 truncate group-hover:text-amber-100">
                {displayTitle} कथा
              </p>
            </div>
            <p className="text-[9px] text-stone-300 truncate">
              {isPlaying && currentChapter
                ? `अध्याय ${activeParaIndex + 1}/${totalChapters}`
                : '🎧 ऑडियो सुनें'}
            </p>
          </div>

          {/* Minimize & Close */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="text-stone-400 hover:text-white p-0.5 rounded transition text-[10px]"
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
              className="text-stone-400 hover:text-white p-0.5 rounded transition"
              title="बंद करें"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
