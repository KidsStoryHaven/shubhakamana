import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Check
} from 'lucide-react';
import { DivineDeitySlide } from '../data/divineGodsData';
import { resolveDirectImageUrl, getGoogleDriveFallbackUrls } from '../utils/googleDriveHelper';

interface FestivalImageSliderProps {
  slides: DivineDeitySlide[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  festivalName: string;
}

export const FestivalImageSlider: React.FC<FestivalImageSliderProps> = ({
  slides,
  currentIndex,
  onSelectIndex,
  festivalName
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);

  const SLIDE_INTERVAL_MS = 6000; // 6 seconds auto-slide
  const TICK_MS = 100;

  // Auto-advance slide on timer
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setInterval(() => {
      onSelectIndex((currentIndex + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, slides.length, onSelectIndex]);

  // Progress bar tracking based on elapsed time
  useEffect(() => {
    setProgress(0);
    if (!isPlaying || slides.length <= 1) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / SLIDE_INTERVAL_MS) * 100);
      setProgress(pct);
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying, slides.length]);

  // Auto-scroll thumbnail container to keep active thumbnail centered
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeEl = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const safeIndex = (currentIndex >= 0 && currentIndex < slides.length) ? currentIndex : 0;

  const handlePrev = () => {
    const nextIdx = (safeIndex - 1 + slides.length) % slides.length;
    onSelectIndex(nextIdx);
    setProgress(0);
  };

  const handleNext = () => {
    const nextIdx = (safeIndex + 1) % slides.length;
    onSelectIndex(nextIdx);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[safeIndex] || slides[0];

  return (
    <div className="w-full space-y-2.5">
      {/* 🖼️ Main Photo Frame (100% CLEAN - No Text Obstructing Deity Face/Darshan) */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-black group select-none">
        
        {/* Active Deity Image / Divine Artwork - Completely unobstructed */}
        <img
          key={currentSlide.id}
          src={resolveDirectImageUrl(currentSlide.imageUrl)}
          alt={currentSlide.title}
          onError={(e) => {
            const fallbacks = getGoogleDriveFallbackUrls(currentSlide.imageUrl);
            const target = e.currentTarget;
            const currentSrc = target.src;
            const next = fallbacks.find(url => url !== currentSrc);
            if (next) {
              target.src = next;
            }
          }}
          className="w-full h-full object-cover transition duration-700 ease-out animate-fade-in"
        />

        {/* Minimal Thin Auto-slide Progress Indicator at top edge */}
        {isPlaying && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/40 z-20 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 transition-all duration-100 ease-linear shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Left & Right Subtle Navigation Arrows */}
        <button
          onClick={handlePrev}
          title="पिछली फ़ोटो / स्वरूप"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 border border-amber-400/50 text-amber-300 hover:text-white flex items-center justify-center transition backdrop-blur-sm cursor-pointer z-10 shadow-lg opacity-80 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={handleNext}
          title="अगली फ़ोटो / स्वरूप"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 border border-amber-400/50 text-amber-300 hover:text-white flex items-center justify-center transition backdrop-blur-sm cursor-pointer z-10 shadow-lg opacity-80 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* 🌸 Dedicated Info & Jhanki Bar (Positioned Completely BELOW the Photo) */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/30 p-3 sm:p-3.5 shadow-lg flex flex-col gap-1.5 text-left">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          
          {/* Deity Name & Jhanki Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[11px] font-extrabold border border-amber-400/40 shadow-sm shrink-0">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>{currentSlide.badge}</span>
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-amber-200 font-serif truncate">
              {currentSlide.title}
            </h4>
          </div>

          {/* Controls: Counter & Play/Pause */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">कार्ड पर सेट है</span>
            </span>

            <button
              onClick={togglePlay}
              title={isPlaying ? 'ऑटो-स्लाइड रोकें' : 'ऑटो-स्लाइड चलाएँ'}
              className="p-1 rounded-lg bg-black/60 border border-amber-500/40 text-amber-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1 px-2"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="text-[10px]">{isPlaying ? 'रोकें' : 'चलाएँ'}</span>
            </button>

            <span className="px-2 py-0.5 rounded-lg bg-black/60 border border-stone-700 text-[11px] text-amber-400 font-mono font-bold">
              {safeIndex + 1} / {slides.length}
            </span>
          </div>

        </div>

        {/* Tagline / Significance under photo */}
        {currentSlide.tagline && (
          <p className="text-xs text-stone-300 leading-snug">
            {currentSlide.tagline}
          </p>
        )}
      </div>

      {/* 🧭 Horizontal Deity Selector Tabs (All Gods of this Festival) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs text-stone-300 px-1 font-medium">
          <span className="text-amber-300 font-semibold">
            👇 अपने इष्टदेव का स्वरूप चुनें ({slides.length} पावन दर्शन):
          </span>
          <span className="text-[10px] text-stone-400">
            {isPlaying ? '⚡ 6s ऑटो-स्लाइड चालू' : '⏸️ स्लाइडर रुका हुआ'}
          </span>
        </div>

        <div 
          ref={thumbnailsRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800"
        >
          {slides.map((slide, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  onSelectIndex(idx);
                  setProgress(0);
                }}
                className={`relative shrink-0 px-3 py-2 rounded-2xl border-2 transition cursor-pointer text-left flex items-center gap-2 max-w-[200px] ${
                  isSelected 
                    ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400' 
                    : 'border-stone-800 bg-stone-900/80 hover:border-stone-600 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
                  <img
                    src={resolveDirectImageUrl(slide.imageUrl)}
                    alt={slide.godName}
                    onError={(e) => {
                      const fallbacks = getGoogleDriveFallbackUrls(slide.imageUrl);
                      const target = e.currentTarget;
                      const next = fallbacks.find(url => url !== target.src);
                      if (next) target.src = next;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 pr-1">
                  <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-stone-200'}`}>
                    {slide.godName}
                  </p>
                  <p className="text-[10px] text-stone-400 truncate">
                    {slide.badge}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
