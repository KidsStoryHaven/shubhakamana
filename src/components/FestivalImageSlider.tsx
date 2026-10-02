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

  // Auto-slide effect with progress tracking
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onSelectIndex((currentIndex + 1) % slides.length);
          return 0;
        }
        return prev + (TICK_MS / SLIDE_INTERVAL_MS) * 100;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, slides.length, onSelectIndex]);

  // Reset progress when index changes manually
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Auto-scroll thumbnail container to keep active thumbnail centered
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeEl = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + slides.length) % slides.length;
    onSelectIndex(nextIdx);
    setProgress(0);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % slides.length;
    onSelectIndex(nextIdx);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="w-full space-y-3">
      {/* Main Slideshow Frame */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-black group select-none">
        
        {/* Active Deity Image / Divine Artwork with smooth transition */}
        <img
          key={currentSlide.id}
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          className="w-full h-full object-cover transition duration-700 ease-out animate-fade-in"
        />

        {/* Subtle Vignette Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none" />

        {/* Top Header Overlay: Deity Badge & Slide Counter */}
        <div className="absolute top-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-amber-400/50 text-xs font-bold text-amber-300 backdrop-blur-md shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>{currentSlide.badge} • साक्षात दर्शन</span>
          </div>

          {/* Controls: Play/Pause & Counter */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              title={isPlaying ? 'ऑटो-स्लाइड रोकें' : 'ऑटो-स्लाइड चलाएँ'}
              className="p-1.5 rounded-full bg-black/80 border border-amber-400/50 text-amber-300 hover:text-white backdrop-blur-md transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <span className="px-2.5 py-1 rounded-full bg-black/80 border border-stone-700 text-xs text-stone-200 backdrop-blur-md font-mono font-bold">
              {currentIndex + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Progress Bar (6s Auto-slide indicator) */}
        {isPlaying && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/50 z-20 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 transition-all duration-100 ease-linear shadow-lg shadow-amber-400/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Left & Right Navigation Arrows */}
        <button
          onClick={handlePrev}
          title="पिछले भगवान/स्वरूप"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 border border-amber-400/60 text-amber-300 hover:text-white flex items-center justify-center transition backdrop-blur-sm cursor-pointer z-10 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          title="अगले भगवान/स्वरूप"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 border border-amber-400/60 text-amber-300 hover:text-white flex items-center justify-center transition backdrop-blur-sm cursor-pointer z-10 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Deity Title & Mantra Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-left z-10 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-extrabold text-amber-200 font-serif truncate drop-shadow-md">
              {currentSlide.title}
            </h4>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 font-semibold">
              <Check className="w-3 h-3" />
              <span>कार्ड पर सेट है</span>
            </span>
          </div>
          <p className="text-[11px] text-stone-300 truncate">
            {currentSlide.tagline}
          </p>
        </div>

      </div>

      {/* Horizontal Deity Selector Tabs (All Gods of this Festival) */}
      <div className="space-y-1.5">
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
                    src={slide.imageUrl}
                    alt={slide.godName}
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
