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
  RotateCcw,
  Layers
} from 'lucide-react';
import { Festival } from '../data/festivals';
import { DivineDeitySlide } from '../data/divineGodsData';
import { 
  loadStatusImage, 
  loadAllSlideImages,
  LoadedDeitySlide,
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
  customAudioUrl?: string;
  shareUrl: string;
  slides?: DivineDeitySlide[];
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
  customAudioUrl,
  shareUrl,
  slides = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // 30s, 45s, 59s
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const heroImgRef = useRef<HTMLImageElement | null>(null);
  const userImgRef = useRef<HTMLImageElement | null>(null);
  const loadedSlidesRef = useRef<LoadedDeitySlide[]>([]);
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
      effectivePhoto ? loadStatusImage(effectivePhoto) : Promise.resolve(null),
      loadAllSlideImages(slides)
    ]).then(([hero, user, loadedSlides]) => {
      if (!isMounted) return;
      heroImgRef.current = hero;
      userImgRef.current = user;
      loadedSlidesRef.current = loadedSlides;
      particlesRef.current = initParticles(720, 1280, isBirthday);
      startTimeRef.current = Date.now();
      setIsPlaying(true);
      setHasDownloaded(false);
    });

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, festival.id, heroImageOverride, effectivePhoto, slides]);

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
              heroImageOverride,
              customAudioUrl,
              slides,
              totalDuration: selectedDuration
            },
            particlesRef.current,
            loadedSlidesRef.current
          );
        }
      }
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, isPlaying, festival, senderName, userPhoto, birthdayPerson, birthdayPhoto, poem, greetingTitle, heroImageOverride, customAudioUrl, slides, selectedDuration]);

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

  // 3. Fast Video Download Handler (User-selected 30s to 59s with real MP3 audio)
  const handleDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;

    try {
      setIsExporting(true);
      setExportProgress(5);

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
          heroImageOverride,
          customAudioUrl,
          slides,
          totalDuration: selectedDuration
        },
        heroImgRef.current,
        userImgRef.current,
        selectedDuration, // 30s, 45s, 59s
        (pct) => setExportProgress(pct),
        loadedSlidesRef.current
      );

      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setHasDownloaded(true);
      awardUserPoints('download_card', `${festival.nameHi} ${selectedDuration}s 8K Video Status`);
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
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-stone-950 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-500/20 overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-b border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-black shadow-md">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-amber-400 leading-tight flex items-center gap-1.5">
                8K WhatsApp Video Status Generator
                <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">
                {slides.length > 0 ? `✨ ${slides.length} फ़ोटो स्लाइडशो (3s ऑटो रोटेशन) • HD ऑडियो` : '3D मोशन • बैकग्राउंड संगीत • HD डाउनलोड'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-900/80 hover:bg-stone-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Canvas Viewport (9:16 aspect ratio scaled) */}
        <div className="relative flex-1 bg-black flex items-center justify-center p-2 sm:p-3 overflow-hidden">
          <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 bg-stone-950 group">
            <canvas
              ref={canvasRef}
              width={720}
              height={1280}
              className="w-full h-full object-contain block"
            />

            {/* Play/Pause Overlay Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700/60 opacity-90 group-hover:opacity-100 transition">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="p-1.5 text-amber-400 hover:text-amber-300 rounded-lg bg-stone-900/80 transition cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleRestart}
                  className="p-1.5 text-stone-300 hover:text-white rounded-lg bg-stone-900/80 transition cursor-pointer"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Counter Badge */}
              {slides.length > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/30">
                  <Layers className="w-3 h-3 text-amber-400" />
                  <span>{slides.length} Photos</span>
                </div>
              )}

              <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>8K MP4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Duration Selector (30s, 45s, 59s WhatsApp Status Length) */}
        <div className="px-5 py-2.5 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
            ⏱️ वीडियो लंबाई:
          </span>
          <div className="flex gap-2">
            {[30, 45, 59].map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer border ${
                  selectedDuration === dur
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-stone-950 text-stone-300 border-stone-700 hover:border-stone-500'
                }`}
              >
                {dur}s {dur === 30 ? '• 10 Photos' : dur === 45 ? '• 15 Photos' : '• 20 Photos'}
              </button>
            ))}
          </div>
        </div>

        {/* Download & Actions Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-stone-950 to-stone-900 border-t border-amber-500/30 flex flex-col gap-3">
          
          {/* Main Download Button */}
          <button
            onClick={handleDownloadVideo}
            disabled={isExporting}
            className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition shadow-xl cursor-pointer ${
              hasDownloaded
                ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 shadow-amber-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>वीडियो रेंडर हो रहा है... {exportProgress}%</span>
              </>
            ) : hasDownloaded ? (
              <>
                <Check className="w-5 h-5" />
                <span>डाउनलोड पूर्ण! पुनः डाउनलोड करें</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>WhatsApp स्टेटस वीडियो डाउनलोड करें ({selectedDuration}s HD)</span>
              </>
            )}
          </button>

          {/* Social Share & Copy Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp पर भेजें</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'लिंक कॉपी हुआ!' : 'विश लिंक कॉपी करें'}</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-stone-400 leading-tight">
            💡 हर 3 सेकंड में फ़ोटो अपने नाम और पावन झांकी के साथ बदलेगी • Shubhakamna.in
          </p>
        </div>

      </div>
    </div>
  );
};
