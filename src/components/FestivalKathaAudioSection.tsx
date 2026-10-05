import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Headphones, 
  FastForward, 
  Rewind,
  Flame,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Festival } from '../data/festivals';
import { kathaAudio } from '../utils/kathaAudioEngine';
import { getFestivalStoryData } from '../data/festivalStoriesData';

interface FestivalKathaAudioSectionProps {
  festival: Festival;
}

export const FestivalKathaAudioSection: React.FC<FestivalKathaAudioSectionProps> = ({ festival }) => {
  const storyData = getFestivalStoryData(festival);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeParaIndex, setActiveParaIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.92);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isExpandedStory, setIsExpandedStory] = useState<boolean>(true);

  // Sync chapters with kathaAudio engine when festival changes
  useEffect(() => {
    kathaAudio.loadFestival(festival.id, storyData.chapters);
    const unsubscribe = kathaAudio.subscribe((state) => {
      if (state.activeFestivalId === festival.id) {
        setIsPlaying(state.isPlaying);
        setActiveParaIndex(state.activeParaIndex);
        setElapsedSeconds(state.elapsedSeconds);
        setPlaybackSpeed(state.speed);
      } else {
        setIsPlaying(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [festival.id]);

  const handleTogglePlay = () => {
    kathaAudio.toggle();
  };

  const handleRewind = () => {
    kathaAudio.previous();
  };

  const handleForward = () => {
    kathaAudio.next();
  };

  const handleRestart = () => {
    kathaAudio.restart();
  };

  const handleSelectParagraph = (idx: number) => {
    kathaAudio.play(idx);
  };

  const handleSpeedChange = (speed: number) => {
    kathaAudio.setSpeed(speed);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const estimatedTotalSeconds = storyData.chapters.length * 45; // ~45s per paragraph

  return (
    <div id="festival-katha-section" className="w-full space-y-6 my-6 scroll-mt-24 animate-fadeIn">
      
      {/* 🌸 MAIN KATHA AUDIO PLAYER CARD 🌸 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/50 shadow-2xl p-4 sm:p-6 text-left">
        
        {/* Glow ambient background aura */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/90 to-amber-600/90 text-white text-xs font-black shadow-md border border-amber-400/40 mb-2">
              <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>{storyData.badge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-200 font-serif leading-tight">
              {storyData.storyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
              {storyData.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-300 bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 font-bold shadow-sm">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>मधुर कथावाचन (Audio Story)</span>
            </span>
          </div>
        </div>

        {/* 🎧 Interactive Audio Player Control Bar */}
        <div className="relative z-10 my-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border border-amber-500/40 shadow-inner flex flex-col gap-3">
          
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-emerald-500' : 'bg-stone-600'}`}></span>
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-amber-200">
                {isPlaying 
                  ? `🎙️ ${festival.nameHi} की पावन कथा का मधुर वाचन जारी है...` 
                  : `🎧 "${festival.nameHi} की कथा सुनें" (प्ले बटन दबाएँ)`
                }
              </span>
            </div>

            {/* Audio Speed Options */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-stone-400 font-bold hidden sm:inline">गति:</span>
              {[0.88, 1.0, 1.15].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer border ${
                    playbackSpeed === speed
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-600'
                  }`}
                >
                  {speed === 0.88 ? 'शांत' : speed === 1.0 ? '1x' : '1.15x'}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar & Chapter Indicator */}
          <div className="space-y-1">
            <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden border border-stone-800">
              <div 
                className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 h-full transition-all duration-300 ease-linear rounded-full shadow-md"
                style={{ width: `${Math.min(100, (elapsedSeconds / Math.max(1, estimatedTotalSeconds)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span>{formatTime(elapsedSeconds)}</span>
              <span className="text-amber-300 font-bold">
                अध्याय {activeParaIndex + 1} / {storyData.chapters.length}
              </span>
              <span>~{formatTime(estimatedTotalSeconds)}</span>
            </div>
          </div>

          {/* Main Playback Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRewind}
                title="पिछला अध्याय"
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition cursor-pointer border border-stone-700 active:scale-95"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition cursor-pointer active:scale-95 border border-yellow-200"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-stone-950" />
                    <span>कथा रोकें (Pause)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-stone-950" />
                    <span>कथा सुनें (Play Audio)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleForward}
                title="अगला अध्याय"
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition cursor-pointer border border-stone-700 active:scale-95"
              >
                <FastForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                title="शुरुआत से सुनें"
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition cursor-pointer border border-stone-700 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[11px] text-amber-300/80 font-bold hidden sm:block">
              ✨ मधुर स्वर में कथावाचन
            </div>
          </div>
        </div>

        {/* 📖 Complete Katha Paragraphs with Realtime Highlighting */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-300/80 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>कथा प्रसंग (क्लिक करके सीधे सुनें):</span>
            </h3>
            <button
              onClick={() => setIsExpandedStory(!isExpandedStory)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>{isExpandedStory ? 'संक्षिप्त करें' : 'पूरी कथा पढ़ें'}</span>
              {isExpandedStory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-3">
            {storyData.chapters.map((para, idx) => {
              const isActive = activeParaIndex === idx;
              if (!isExpandedStory && !isActive && idx > 1) return null;

              return (
                <div
                  key={para.id}
                  onClick={() => handleSelectParagraph(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-950/90 border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/50'
                      : 'bg-stone-950/80 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isActive ? 'text-amber-300 font-serif' : 'text-stone-200'}`}>
                      <span>{para.icon}</span>
                      <span>{para.title}</span>
                    </h4>
                    {isActive && isPlaying && (
                      <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shrink-0">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        <span>वाचन जारी</span>
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isActive ? 'text-amber-50 font-medium' : 'text-stone-300'}`}>
                    {para.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ⚖️ DO'S & DON'TS (क्या करें और क्या न करें) ⚖️ */}
      <div className="rounded-3xl bg-stone-950 border-2 border-stone-800 shadow-2xl p-5 sm:p-7 text-left space-y-5">
        
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{festival.nameHi} • पावन साधना व व्रत नियमावली</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-200 font-serif">
            {festival.nameHi} में क्या करें और क्या न करें? (Do's & Don'ts)
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            शास्त्रसम्मत और परंपरा के अनुसार इन नियमों का पालन करने से समस्त शुभ फल और ईश्वरीय आशीर्वाद प्राप्त होता है
          </p>
        </div>

        {/* 2-Column Grid: Do's (Green) and Don'ts (Red) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ✅ क्या अवश्य करें (DO'S) */}
          <div className="rounded-2xl bg-gradient-to-b from-emerald-950/40 via-stone-900 to-emerald-950/20 border-2 border-emerald-500/40 p-4 sm:p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/30">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-emerald-300">
                  क्या अवश्य करें? (Do's)
                </h4>
                <p className="text-[11px] text-emerald-200/70">पुण्य और आशीर्वाद प्रदाता शास्त्रसम्मत नियम</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200">
              {storyData.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span><strong>{item.title}</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ❌ क्या भूलकर भी न करें (DON'TS) */}
          <div className="rounded-2xl bg-gradient-to-b from-rose-950/40 via-stone-900 to-rose-950/20 border-2 border-rose-500/40 p-4 sm:p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-rose-500/30">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-black">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-rose-300">
                  क्या भूलकर भी न करें? (Don'ts)
                </h4>
                <p className="text-[11px] text-rose-200/70">साधना व शुभता भंग करने वाले वर्जित कर्म</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200">
              {storyData.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span><strong>{item.title}</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Shloka Capsule */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center">
          <p className="text-xs sm:text-sm font-serif font-bold text-amber-200">
            {storyData.blessingShloka}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {storyData.blessingMessage}
          </p>
        </div>

      </div>

    </div>
  );
};

/**
 * Backward compatibility alias for any existing imports
 */
export const NavratriKathaAudioSection: React.FC = () => {
  const dummyNavratriFest: Festival = {
    id: 'navratri',
    slug: 'navratri-durga-puja-wishes',
    nameHi: 'शारदीय नवरात्रि • माँ दुर्गा पूजा',
    nameEn: 'Shardiya Navratri & Durga Puja Wishes',
    taglineHi: 'माँ जगदम्बा के नौ दिव्य स्वरूपों की पावन आराधना',
    category: 'hindu',
    dateLabel: '11 अक्टूबर 2026',
    countdownDays: 6,
    badge: '🚩 चालू महापर्व',
    heroImage: '',
    themeColor: {
      gradient: 'from-rose-950 via-red-900 to-stone-950',
      border: 'border-red-500/40',
      accent: 'text-rose-300',
      glow: 'shadow-red-500/20'
    },
    particlesType: 'flowers',
    soundType: 'custom_url',
    greetingTitle: 'शारदीय नवरात्रि की पावन शुभकामनाएँ',
    defaultPoem: '',
    significance: '',
    shubhMuhurat: '',
    seoTopWishes: [],
    faqs: []
  };
  return <FestivalKathaAudioSection festival={dummyNavratriFest} />;
};
