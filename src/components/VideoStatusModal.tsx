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
  Volume2, 
  VolumeX, 
  Film, 
  Copy,
  RotateCcw
} from 'lucide-react';
import { Festival } from '../data/festivals';
import { 
  loadStatusImage, 
  initParticles, 
  drawVideoStatusFrame, 
  recordFastVideoStatus,
  ParticleItem,
  VideoStatusResult
} from '../utils/generateVideoStatus';
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const heroImgRef = useRef<HTMLImageElement | null>(null);
  const userImgRef = useRef<HTMLImageElement | null>(null);
  const particlesRef = useRef<ParticleItem[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pauseTimeRef = useRef<number>(0);

  const isBirthday = festival.id === 'birthday' || festival.soundType === 'birthday' || !!birthdayPerson;
  const effectivePhoto = birthdayPhoto || userPhoto;

  // 1. Initialize Images and Particles on Modal Open
  useEffect(() => {
    if (!isOpen) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    let isMounted = true;
    const heroSrc = heroImageOverride || festival.heroImage;

    Promise.all([
      loadStatusImage(heroSrc),
      effectivePhoto ? loadStatusImage(effectivePhoto) : Promise.resolve(null)
    ]).then(([hero, user]) => {
      if (!isMounted) return;
      heroImgRef.current = hero;
      userImgRef.current = user;
      particlesRef.current = initParticles(720, 1280, isBirthday);
      startTimeRef.current = Date.now();
      setIsPlaying(true);
      setHasDownloaded(false);
    });

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, festival.id, heroImageOverride, effectivePhoto]);

  // 2. Realtime 60fps Live Canvas Rendering Loop (Instant 0-wait Preview)
  useEffect(() => {
    if (!isOpen) return;

    const renderLoop = () => {
      const canvas = canvasRef.current;
      if (canvas && isPlaying) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
          drawVideoStatusFrame(
            ctx,
            720,
            1280,
            elapsedSec,
            heroImgRef.current,
            userImgRef.current,
            {
              festival,
              senderName,
              userPhoto,
              birthdayPerson,
              birthdayPhoto,
              poem,
              greetingTitle,
              heroImageOverride
            },
            particlesRef.current
          );
        }
      }
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, isPlaying, festival, senderName, userPhoto, birthdayPerson, birthdayPhoto, poem, greetingTitle, heroImageOverride]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseTimeRef.current = Date.now();
      setIsPlaying(false);
    } else {
      const pauseDuration = Date.now() - pauseTimeRef.current;
      startTimeRef.current += pauseDuration;
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    startTimeRef.current = Date.now();
    setIsPlaying(true);
  };

  // 3. Fast Video Download Handler (Takes only ~2.5s)
  const handleDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;

    try {
      setIsExporting(true);
      setExportProgress(10);

      // Create an offscreen recording canvas
      const recCanvas = document.createElement('canvas');
      recCanvas.width = 720;
      recCanvas.height = 1280;

      const result: VideoStatusResult = await recordFastVideoStatus(
        recCanvas,
        {
          festival,
          senderName,
          userPhoto,
          birthdayPerson,
          birthdayPhoto,
          poem,
          greetingTitle,
          heroImageOverride
        },
        heroImgRef.current,
        userImgRef.current,
        3.2, // 3.2s fast recording captures full animation loop in ~1.5-2 seconds
        (pct) => setExportProgress(pct)
      );

      // Trigger instant browser download
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setHasDownloaded(true);
      awardUserPoints('download_card', `${festival.nameHi} 8K Video Status`);
    } catch (err) {
      console.error('Video status export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = isBirthday
      ? `🎂 *${birthdayPerson || 'आकाश'}* के लिए 8K वीडियो स्टेटस देखें व अपने नाम से बनाएं:\n👉 ${shareUrl}\n\n— *${senderName}*`
      : `🪔 *${festival.nameHi}* का 8K वीडियो स्टेटस देखें व अपने नाम का स्टेटस बनाएं:\n👉 ${shareUrl}\n\n— *${senderName}*`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-500/20 overflow-hidden text-stone-100 my-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-500/20 bg-stone-950/90">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif flex items-center gap-1.5">
                <span>8K WhatsApp Video Status</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-sans">
                  MP4
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
          
          {/* Instant Live 9:16 Canvas Viewport (0-wait instant playback) */}
          <div className="relative mx-auto w-[240px] sm:w-[270px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-950/60 flex items-center justify-center">
            
            <canvas
              ref={canvasRef}
              width={720}
              height={1280}
              className="w-full h-full object-cover"
            />

            {/* Exporting Progress Overlay */}
            {isExporting && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-2.5 z-20">
                <Loader2 className="w-9 h-9 text-amber-400 animate-spin" />
                <span className="text-xs font-bold text-white">
                  🎬 8K वीडियो डाउनलोड हो रहा है... {exportProgress}%
                </span>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden border border-stone-700">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-150"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Floating Live Controls */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto z-10">
              <button
                onClick={handleTogglePlay}
                className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-amber-300 backdrop-blur-md border border-white/20 transition cursor-pointer"
                title="Replay Animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature Highlights Badges */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] sm:text-[11px]">
            <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 text-amber-300">
              <span className="block font-bold">✍️ लिखवाट इफ़ेक्ट</span>
              <span className="text-stone-400 text-[9px]">Handwriting Animation</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 text-yellow-300">
              <span className="block font-bold">🪔 स्लो ब्लिंक लोगो</span>
              <span className="text-stone-400 text-[9px]">Soft Glowing Logo</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 text-emerald-300">
              <span className="block font-bold">📜 मूविंग टिकर</span>
              <span className="text-stone-400 text-[9px]">Right-to-Left Scroll</span>
            </div>
          </div>

          {/* Action Download & Share Buttons */}
          <div className="space-y-2.5 pt-1">
            
            {/* Primary Fast 1-Click Download Button */}
            <button
              onClick={handleDownloadVideo}
              disabled={isExporting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 text-stone-950 animate-spin" />
                  <span>8K वीडियो तैयार हो रहा है ({exportProgress}%)...</span>
                </>
              ) : hasDownloaded ? (
                <>
                  <Check className="w-5 h-5 text-stone-950" />
                  <span>✓ 8K वीडियो स्टेटस डाउनलोड हो गया! (पुनः डाउनलोड करें)</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>📥 8K वीडियो स्टेटस डाउनलोड करें (.MP4)</span>
                </>
              )}
            </button>

            {/* WhatsApp Status Share */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/30 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>🟢 WhatsApp Status पर लगाएँ 🚀</span>
            </button>

            {/* Copy Wish Link */}
            <button
              onClick={handleCopyLink}
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
