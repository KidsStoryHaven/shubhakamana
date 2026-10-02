import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { 
  X, 
  Download, 
  Sparkles, 
  Heart, 
  Lock, 
  Smartphone, 
  Share2, 
  Check, 
  Volume2, 
  MessageCircle,
  Phone,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface WallpaperPreviewModalProps {
  wallpaper: Wallpaper | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onOpenInStudio: (wallpaper: Wallpaper) => void;
}

type PreviewMode = 'clean' | 'lockscreen' | 'homescreen';

export const WallpaperPreviewModal: React.FC<WallpaperPreviewModalProps> = ({
  wallpaper,
  isFavorite,
  onToggleFavorite,
  onClose,
  onOpenInStudio
}) => {
  if (!wallpaper) return null;

  const [previewMode, setPreviewMode] = useState<PreviewMode>('lockscreen');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Time & Date for lockscreen
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const dateStr = `${daysHi[now.getDay()]}, ${now.getDate()} ${monthsHi[now.getMonth()]}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = wallpaper.imageUrl;
    link.download = `DivyaDarshan_${wallpaper.id}_4K.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${wallpaper.titleHi} - दिव्य दर्शन`,
        text: `${wallpaper.titleHi} - ${wallpaper.mantraHi}\nडाउनलोड करें दिव्य दर्शन सनातन वॉलपेपर:`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${wallpaper.titleHi}\n${wallpaper.mantraHi}\n${window.location.href}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleChant = () => {
    soundEngine.speakHindi(wallpaper.mantraHi);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      {/* Container */}
      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="बंद करें"
          className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-stone-950/70 border border-white/10 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left / Center Phone Mockup Showcase */}
        <div className="relative flex flex-1 items-center justify-center bg-stone-950 p-6 sm:p-10">
          {/* Smartphone Frame Container */}
          <div className="relative aspect-[9/18] w-full max-w-[320px] overflow-hidden rounded-[2.5rem] border-[6px] border-stone-800 bg-stone-900 shadow-2xl shadow-black/80">
            {/* Top speaker notch */}
            <div className="absolute top-2 left-1/2 z-20 h-4 w-28 -translate-x-1/2 rounded-full bg-stone-900 border border-stone-800" />

            {/* Background Wallpaper Image */}
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.titleHi}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />

            {/* LOCK SCREEN OVERLAY */}
            {previewMode === 'lockscreen' && (
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-gradient-to-b from-black/40 via-transparent to-black/60 text-white select-none">
                {/* Top Lock and Clock */}
                <div className="pt-6 text-center space-y-1">
                  <div className="flex justify-center">
                    <Lock className="h-4 w-4 text-stone-200" />
                  </div>
                  <p className="text-xs font-medium tracking-wide text-stone-200">
                    {dateStr}
                  </p>
                  <h1 className="text-5xl font-light tracking-tight font-sans text-white drop-shadow-md">
                    {timeStr}
                  </h1>
                </div>

                {/* Lockscreen Notification Widget */}
                <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-3.5 shadow-lg space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-200">
                    <span className="font-semibold text-amber-300">दिव्य संदेश</span>
                    <span className="text-[10px] text-stone-300">अभी</span>
                  </div>
                  <p className="text-xs font-medium text-white line-clamp-2">
                    {wallpaper.mantraHi}
                  </p>
                </div>

                {/* Bottom lockscreen affordances */}
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <span className="text-xs">🔦</span>
                  </div>
                  <span className="text-[10px] text-stone-300 tracking-wider">
                    अनलॉक करने के लिए ऊपर स्वाइप करें
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* HOME SCREEN OVERLAY */}
            {previewMode === 'homescreen' && (
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-black/20 text-white select-none">
                {/* Top Status & Date Widget */}
                <div className="pt-8 space-y-3">
                  <div className="rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 p-4 text-center">
                    <span className="text-3xl font-light">{timeStr}</span>
                    <p className="text-[11px] text-stone-300 mt-0.5">{dateStr}</p>
                  </div>

                  {/* App Grid Mockup */}
                  <div className="grid grid-cols-4 gap-3 pt-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 shadow-md">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[9px] text-white font-medium">फ़ोन</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-md">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[9px] text-white font-medium">संदेश</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 shadow-md">
                        <ImageIcon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[9px] text-white font-medium">गैलरी</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600 shadow-md">
                        <span className="text-base">🕉️</span>
                      </div>
                      <span className="text-[9px] text-white font-medium">दर्शन</span>
                    </div>
                  </div>
                </div>

                {/* Dock apps */}
                <div className="grid grid-cols-4 gap-3 rounded-2xl bg-black/40 backdrop-blur-md p-2.5 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 mx-auto">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 mx-auto">
                    <span className="text-sm">🪔</span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 mx-auto">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-700 mx-auto">
                    <span className="text-sm">⚙️</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Details & Controls Sidebar */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:w-96 border-t lg:border-t-0 lg:border-l border-stone-800 space-y-6">
          <div className="space-y-5">
            {/* Title & Mantra */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">
                  {wallpaper.resolution}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(wallpaper.id)}
                  className={`flex items-center gap-1 text-xs font-medium ${
                    isFavorite ? 'text-rose-500' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                  <span>{isFavorite ? 'पसंदीदा में है' : 'पसंदीदा'}</span>
                </button>
              </div>

              <h2 className="text-2xl font-bold font-display text-white">
                {wallpaper.titleHi}
              </h2>
              <p className="text-xs text-stone-400">
                {wallpaper.titleEn}
              </p>
            </div>

            {/* Sacred Mantra Box */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-400">पावन मंत्र व श्लोक</span>
                <button
                  onClick={handleChant}
                  title="मंत्र का उच्चारण सुनें"
                  className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>उच्चारण</span>
                </button>
              </div>
              <p className="text-xs leading-relaxed text-stone-200 italic">
                {wallpaper.mantraHi}
              </p>
            </div>

            {/* Mode Switcher Segmented Control */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-300">
                प्रिव्यू का प्रकार चुनें:
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-stone-950 rounded-xl border border-stone-800">
                <button
                  onClick={() => setPreviewMode('lockscreen')}
                  className={`flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                    previewMode === 'lockscreen'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>लॉक स्क्रीन</span>
                </button>

                <button
                  onClick={() => setPreviewMode('homescreen')}
                  className={`flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                    previewMode === 'homescreen'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>होम स्क्रीन</span>
                </button>

                <button
                  onClick={() => setPreviewMode('clean')}
                  className={`flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                    previewMode === 'clean'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>शुद्ध कला</span>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-stone-400">
              {wallpaper.tagsHi.map((tag, idx) => (
                <span key={idx}>
                  #{tag}{idx < wallpaper.tagsHi.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5 pt-4">
            <button
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-4 w-4 text-white" />
                  <span>सफलतापूर्वक डाउनलोड हुआ!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>4K HD वॉलपेपर डाउनलोड करें</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenInStudio(wallpaper);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-stone-950 py-2.5 text-xs font-semibold text-amber-300 hover:bg-stone-800 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>स्टेटस पोस्टर बनाएँ</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-800 bg-stone-950 py-2.5 text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              >
                {copiedShare ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>लिंक कॉपी हुआ!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>शेयर करें</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
