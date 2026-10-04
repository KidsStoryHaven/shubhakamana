import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Play, 
  Pause, 
  Sparkles, 
  Loader2, 
  Check, 
  Music, 
  Volume2, 
  VolumeX, 
  Film, 
  Smartphone,
  Copy
} from 'lucide-react';
import { Festival } from '../data/festivals';
import { generateVideoStatusBlob, VideoStatusResult } from '../utils/generateVideoStatus';
import { awardUserPoints } from '../data/userStore';

interface VideoStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  festival: Festival;
  senderName: string;
  userPhoto?: string | null;
  birthdayPerson?: string;
  birthdayPhoto?: string | null;
  poem: string;
  greetingTitle: string;
  heroImageOverride?: string;
  shareUrl: string;
}

export const VideoStatusModal: React.FC<VideoStatusModalProps> = ({
  isOpen,
  onClose,
  festival,
  senderName,
  userPhoto,
  birthdayPerson,
  birthdayPhoto,
  poem,
  greetingTitle,
  heroImageOverride,
  shareUrl
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('शुरू हो रहा है...');
  const [videoResult, setVideoResult] = useState<VideoStatusResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isBirthday = festival.id === 'birthday' || festival.soundType === 'birthday' || !!birthdayPerson;

  // Start generation whenever modal opens
  useEffect(() => {
    if (!isOpen) {
      setVideoResult(null);
      setProgress(0);
      setIsGenerating(false);
      return;
    }

    let isMounted = true;
    setIsGenerating(true);
    setProgress(5);
    setStatusText('8K वीडियो स्टेटस तैयार किया जा रहा है...');

    generateVideoStatusBlob({
      festival,
      senderName,
      userPhoto,
      birthdayPerson,
      birthdayPhoto,
      poem,
      greetingTitle,
      heroImageOverride,
      durationSeconds: 10,
      onProgress: (pct, text) => {
        if (isMounted) {
          setProgress(pct);
          setStatusText(text);
        }
      }
    })
      .then((res) => {
        if (isMounted) {
          setVideoResult(res);
          setIsGenerating(false);
          awardUserPoints('download_card', `${festival.nameHi} Video Status`);
        }
      })
      .catch((err) => {
        console.error('Video generation error:', err);
        if (isMounted) {
          setIsGenerating(false);
          setStatusText('वीडियो रेंडर करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, festival.id, senderName, userPhoto, birthdayPerson, birthdayPhoto, poem, greetingTitle, heroImageOverride]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!videoResult) return;
    const link = document.createElement('a');
    link.href = videoResult.url;
    link.download = videoResult.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setHasDownloaded(true);
  };

  const handleWhatsAppShare = () => {
    const text = isBirthday
      ? `🎂 ${birthdayPerson || 'आकाश'} के लिए 8K वीडियो स्टेटस देखें व अपने नाम से बनाएं:\n👉 ${shareUrl}\n\n— ${senderName}`
      : `🪔 ${festival.nameHi} का 8K वीडियो स्टेटस देखें व अपने नाम का स्टेटस बनाएं:\n👉 ${shareUrl}\n\n— ${senderName}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-500/20 overflow-hidden text-stone-100 my-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-500/20 bg-stone-950/80">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif flex items-center gap-1.5">
                <span>8K WhatsApp Video Status</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-sans">
                  MP4/WebM
                </span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Video Player / Rendering Viewport */}
          <div className="relative mx-auto w-[240px] sm:w-[270px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-amber-950/50 flex items-center justify-center">
            
            {isGenerating ? (
              /* Generation Progress State */
              <div className="p-4 text-center space-y-3 w-full animate-pulse">
                <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                    🎬 8K स्टेटस रेंडर हो रहा है...
                  </h4>
                  <p className="text-[11px] text-stone-400 font-mono">
                    {statusText}
                  </p>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden border border-stone-700">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {progress}% Complete
                </span>
              </div>
            ) : videoResult ? (
              /* Video Element */
              <>
                <video
                  ref={videoRef}
                  src={videoResult.url}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Floating Video Controls */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-xs text-stone-400">तैयार हो रहा है...</div>
            )}
          </div>

          {/* Feature Badges Highlight */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] sm:text-[11px]">
            <div className="p-2 rounded-xl bg-stone-950/70 border border-stone-800 text-amber-300">
              <span className="block font-bold">✍️ लिखवाट इफ़ेक्ट</span>
              <span className="text-stone-400 text-[9px]">Handwriting Animation</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-950/70 border border-stone-800 text-yellow-300">
              <span className="block font-bold">🪔 स्लो ब्लिंक लोगो</span>
              <span className="text-stone-400 text-[9px]">Soft Glowing Branding</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-950/70 border border-stone-800 text-emerald-300">
              <span className="block font-bold">📜 मूविंग टिकर</span>
              <span className="text-stone-400 text-[9px]">Right-to-Left Scroll</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            
            {/* Primary Download Video Button */}
            <button
              onClick={handleDownload}
              disabled={isGenerating || !videoResult}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <Download className="w-5 h-5" />
              <span>
                {hasDownloaded ? '✓ 8K वीडियो स्टेटस डाउनलोड हो गया' : '📥 8K वीडियो स्टेटस डाउनलोड करें (.MP4)'}
              </span>
            </button>

            {/* Direct WhatsApp Status Share */}
            <button
              onClick={handleWhatsAppShare}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/30 transition cursor-pointer disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span>🟢 WhatsApp Status पर लगाएँ 🚀</span>
            </button>

            {/* Copy Share Link */}
            <button
              onClick={handleCopyText}
              className="w-full py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">लिंक कॉपी हो गया!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>विशिंग लिंक कॉपी करें</span>
                </>
              )}
            </button>

          </div>

          <p className="text-[10px] text-stone-500 text-center leading-relaxed">
            यह 9:16 वीडियो स्टेटस WhatsApp Status, Instagram Reels, Facebook Stories और YouTube Shorts के लिए 100% अनुकूलित है।
          </p>

        </div>
      </div>
    </div>
  );
};
