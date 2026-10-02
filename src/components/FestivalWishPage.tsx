import React, { useState, useEffect, useRef } from 'react';
import { Festival } from '../data/festivals';
import { FestiveCanvas } from './FestiveCanvas';
import { festiveAudio } from '../utils/festiveAudio';
import { 
  Share2, 
  Copy, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Check, 
  Calendar, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Music, 
  Award,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  X,
  Download
} from 'lucide-react';

interface FestivalWishPageProps {
  festival: Festival;
  initialSenderName?: string;
  onBackToPortal: () => void;
  onSelectAnotherFestival: (f: Festival) => void;
  allFestivals: Festival[];
}

export const FestivalWishPage: React.FC<FestivalWishPageProps> = ({
  festival,
  initialSenderName = '',
  onBackToPortal,
  onSelectAnotherFestival,
  allFestivals
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [senderName, setSenderName] = useState(() => {
    if (initialSenderName) return initialSenderName;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const fromParam = urlParams.get('from') || urlParams.get('name');
      if (fromParam) return fromParam;
      return localStorage.getItem('shubhakamna_my_name') || 'आपका शुभचिंतक';
    } catch {
      return 'आपका शुभचिंतक';
    }
  });

  const [userPhoto, setUserPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('shubhakamna_my_photo') || null;
    } catch {
      return null;
    }
  });

  const [inputName, setInputName] = useState(senderName);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copiedWishIndex, setCopiedWishIndex] = useState<number | null>(null);

  useEffect(() => {
    festiveAudio.setMuted(isSoundMuted);
  }, [isSoundMuted]);

  // Dynamic SEO Title & Meta tags for Google ranking
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${festival.nameHi} - नाम व फोटो वाली विशिंग लिंक बनाएँ | Shubhakamna.in`;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', `${festival.nameHi} की पावन शुभकामनाएँ। ${festival.defaultPoem} अपने नाम और फोटो के साथ 1-क्लिक में WhatsApp पर शेयर करें।`);
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, [festival]);

  const handleSoundToggle = () => {
    const nextMuted = !isSoundMuted;
    setIsSoundMuted(nextMuted);
    festiveAudio.setMuted(nextMuted);
    if (!nextMuted) {
      festiveAudio.playSoundForFestival(festival.soundType);
    }
  };

  const handleApplyName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputName.trim();
    if (clean) {
      setSenderName(clean);
      try {
        localStorage.setItem('shubhakamna_my_name', clean);
      } catch {
        // Ignored
      }
      festiveAudio.playSoundForFestival(festival.soundType);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUserPhoto(dataUrl);
      try {
        localStorage.setItem('shubhakamna_my_photo', dataUrl);
      } catch {
        // Ignored if quota exceeded
      }
      festiveAudio.playSoundForFestival('aarti');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUserPhoto(null);
    try {
      localStorage.removeItem('shubhakamna_my_photo');
    } catch {
      // Ignored
    }
  };

  // Generate the viral share link
  const getShareUrl = () => {
    const origin = window.location.origin;
    const nameEnc = encodeURIComponent(senderName || 'मित्र');
    return `${origin}/?f=${festival.id}&from=${nameEnc}`;
  };

  const handleWhatsAppShare = () => {
    festiveAudio.playSoundForFestival(festival.soundType);
    const url = getShareUrl();
    const photoNote = userPhoto ? " और फोटो" : "";
    const text = `🎁 *${senderName}* ने आपके और आपके पूरे परिवार के लिए एक खास जादुई शुभकामना${photoNote} भेजी है! 🪔✨\n\nनीचे नीले रंग के लिंक पर टच करके अपना सरप्राइज देखें 👇\n${url}`;
    
    const waUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    const webWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = waUrl;
    } else {
      window.open(webWaUrl, '_blank');
    }
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleCopyTextWish = (text: string, index: number) => {
    navigator.clipboard.writeText(`${text}\n\n— Shubhakamna.in`).then(() => {
      setCopiedWishIndex(index);
      setTimeout(() => setCopiedWishIndex(null), 2000);
    });
  };

  // 1-Click Generate and Download Combined Photo Card for WhatsApp Status
  const handleDownloadPhotoCard = () => {
    setIsDownloadingCard(true);
    festiveAudio.playSoundForFestival(festival.soundType);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920; // 9:16 vertical full HD
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsDownloadingCard(false);
      return;
    }

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#1c1917');
    bgGrad.addColorStop(0.3, '#292524');
    bgGrad.addColorStop(0.7, '#1c1917');
    bgGrad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Golden ornate borders
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1020, 1860);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 980, 1820);

    // Header branding
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Shubhakamna.in • पावन शुभकामना ✨', 540, 110);

    // Festival Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 58px serif';
    ctx.fillText(festival.nameHi, 540, 190);

    // Festival Tagline
    ctx.fillStyle = '#fde68a';
    ctx.font = '32px sans-serif';
    ctx.fillText(festival.taglineHi, 540, 245);

    // Load festival image
    const festImg = new Image();
    festImg.crossOrigin = 'anonymous';
    festImg.onload = () => {
      // Draw festival image inside ornate box
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(100, 300, 880, 560, 30);
      ctx.clip();
      ctx.drawImage(festImg, 100, 300, 880, 560);
      ctx.restore();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(100, 300, 880, 560, 30);
      ctx.stroke();

      // Poem / Blessing Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(100, 900, 880, 300, 24);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#fef3c7';
      ctx.font = 'italic 34px serif';
      ctx.textAlign = 'center';
      
      // Multi-line wrap poem
      const words = festival.defaultPoem.split(' ');
      let line = '';
      let y = 980;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 800 && n > 0) {
          ctx.fillText(line, 540, y);
          line = words[n] + ' ';
          y += 50;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 540, y);

      // Draw User Photo if present
      if (userPhoto) {
        const userImg = new Image();
        userImg.onload = () => {
          // Circular user photo
          ctx.save();
          ctx.beginPath();
          ctx.arc(540, 1370, 120, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(userImg, 420, 1250, 240, 240);
          ctx.restore();

          // Golden circle border
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.arc(540, 1370, 120, 0, Math.PI * 2);
          ctx.stroke();

          finishCanvasAndDownload();
        };
        userImg.src = userPhoto;
      } else {
        finishCanvasAndDownload();
      }
    };

    const finishCanvasAndDownload = () => {
      // Sender Name plate at bottom
      const nameY = userPhoto ? 1560 : 1380;
      ctx.fillStyle = '#fef08a';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ स्नेह एवं सम्मान सहित प्रेषित ✨', 540, nameY);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px serif';
      ctx.fillText(senderName, 540, nameY + 65);

      ctx.fillStyle = '#fde68a';
      ctx.font = '30px sans-serif';
      ctx.fillText('की ओर से आपको एवं आपके परिवार को हार्दिक शुभकामनाएँ', 540, nameY + 120);

      // Watermark
      ctx.fillStyle = '#a8a29e';
      ctx.font = '24px sans-serif';
      ctx.fillText('Create your own wish link free at: https://shubhakamna.in', 540, 1830);

      // Trigger download
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.download = `Shubhakamna-${festival.id}-${senderName}.jpg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Canvas export error:', err);
      }
      setIsDownloadingCard(false);
    };

    festImg.src = festival.heroImage;
  };

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100 pb-24 overflow-hidden">
      {/* Hidden File Input for User Photo */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Top Banner & Navigation */}
      <div className="sticky top-0 z-30 bg-stone-950/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToPortal}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>सभी त्योहार देखें</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              <span>Shubhakamna.in</span>
            </span>

            <button
              onClick={handleSoundToggle}
              className={`p-2 rounded-full border text-xs flex items-center gap-1 transition cursor-pointer ${
                isSoundMuted 
                  ? 'border-stone-800 bg-stone-900 text-stone-400' 
                  : 'border-amber-500/40 bg-amber-500/20 text-amber-300'
              }`}
              title={isSoundMuted ? 'संगीत चालू करें' : 'संगीत बंद करें'}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* AdSense Top Slot (728x90 / Responsive) */}
      <div className="max-w-3xl mx-auto px-4 pt-3">
        <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-2 text-center text-stone-500 text-[10px] tracking-widest uppercase">
          <div className="flex items-center justify-between text-[9px] text-stone-500 mb-1 px-1">
            <span>विज्ञापन • ADVERTISEMENT</span>
            <span>Google AdSense Safe</span>
          </div>
          <div className="h-14 sm:h-20 bg-stone-950/70 border border-dashed border-stone-800 rounded flex items-center justify-center text-stone-400 text-xs sm:text-sm">
            <span>✨ यहाँ आपका Google AdSense बैनर विज्ञापन प्रदर्शित होगा ✨</span>
          </div>
        </div>
      </div>

      {/* Main Magical Greeting Card with Festive Canvas */}
      <div className="relative max-w-xl mx-auto px-4 pt-4 pb-6">
        <div className={`relative overflow-hidden rounded-3xl border-2 ${festival.themeColor.border} bg-gradient-to-b ${festival.themeColor.gradient} p-5 sm:p-7 shadow-2xl ${festival.themeColor.glow} text-center`}>
          
          {/* Interactive Festive Canvas Overlay */}
          <FestiveCanvas 
            type={festival.particlesType} 
            interactive={true} 
            onTap={() => festiveAudio.playSoundForFestival(festival.soundType)} 
          />

          <div className="relative z-20 pointer-events-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{festival.badge}</span>
            </div>

            {/* Tap for sound prompt */}
            <div className="mb-2">
              <button
                onClick={() => festiveAudio.playSoundForFestival(festival.soundType)}
                className="text-[11px] text-amber-200/80 hover:text-amber-200 bg-black/40 hover:bg-black/60 px-3 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <Music className="w-3 h-3 text-amber-400" />
                <span>स्क्रीन पर टच करें या ध्वनि सुनें</span>
              </button>
            </div>

            {/* 1. Grand Festival Darshan Artwork Image (त्योहार की मुख्य दिव्य छवि) */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border-2 border-amber-400/50 shadow-2xl my-3 group">
              <img
                src={festival.heroImage}
                alt={festival.nameHi}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-center p-3">
                <span className="text-xs text-amber-200 font-serif tracking-wide bg-black/60 px-3 py-1 rounded-full border border-amber-500/30">
                  {festival.taglineHi}
                </span>
              </div>
            </div>

            {/* 2. Sender Photo Frame (अगर यूज़र ने फोटो लगाई है) */}
            {userPhoto ? (
              <div className="flex flex-col items-center justify-center my-3">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-xl shadow-amber-500/30 animate-pulse">
                  <img
                    src={userPhoto}
                    alt={senderName}
                    className="w-full h-full rounded-full object-cover border-2 border-stone-950"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    title="फोटो हटाएँ"
                    className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 text-[10px] shadow-md cursor-pointer transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[11px] text-amber-300 font-semibold bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    ✨ {senderName} की पावन छवि ✨
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    बदलें
                  </button>
                </div>
              </div>
            ) : (
              /* Quick Photo Upload Trigger inside card */
              <div className="my-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-medium transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>अपनी फोटो लगाएँ (Upload Photo)</span>
                </button>
              </div>
            )}

            {/* Sender Royal Plate */}
            <div className="my-2 py-3 px-4 rounded-2xl bg-black/50 border border-amber-500/30 backdrop-blur-sm shadow-inner">
              <p className="text-xs text-amber-200/80 tracking-wide font-medium">✨ स्नेह एवं सम्मान सहित प्रेषित ✨</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-serif tracking-tight drop-shadow-md mt-1">
                {senderName}
              </h2>
              <p className="text-[11px] text-amber-300/70 mt-0.5">की ओर से आपको एवं आपके पूरे परिवार को</p>
            </div>

            {/* Festival Grand Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 font-serif leading-tight drop-shadow-lg">
              {festival.greetingTitle}
            </h1>

            {/* Poetic Message */}
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-100 text-sm sm:text-base leading-relaxed font-sans text-center">
              "{festival.defaultPoem}"
            </div>

            {/* Sacred Mantra / Shloka if available */}
            {festival.mantraOrShloka && (
              <div className="mt-3 p-3 rounded-lg bg-black/40 border border-yellow-500/20 text-yellow-300/90 text-xs sm:text-sm font-serif italic">
                {festival.mantraOrShloka}
              </div>
            )}

            {/* Real-time Countdown Box */}
            <div className="mt-5 pt-3 border-t border-amber-500/20 flex items-center justify-center gap-3 text-xs text-amber-200">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{festival.dateLabel}</span>
              <span>•</span>
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-amber-300">
                {festival.countdownDays > 0 ? `${festival.countdownDays} दिन शेष` : 'आज ही का पावन दिवस'}
              </span>
            </div>

            {/* Name & Photo Customizer Form */}
            <div className="mt-6 p-4 rounded-2xl bg-black/75 border border-amber-400/40 shadow-xl text-left space-y-3">
              <label className="block text-xs font-semibold text-amber-300">
                ✍️ अपना नाम और फोटो जोड़कर विश तैयार करें:
              </label>

              {/* Name input */}
              <form onSubmit={handleApplyName} className="flex gap-2">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="अपना नाम यहाँ लिखें (उदा. राहुल, सुधा)..."
                  maxLength={40}
                  className="flex-1 bg-stone-900 border border-amber-500/40 rounded-xl px-3.5 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition flex items-center gap-1 shadow-md cursor-pointer shrink-0"
                >
                  <span>नाम बदलें</span>
                </button>
              </form>

              {/* Photo Upload Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition cursor-pointer font-medium"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{userPhoto ? 'फोटो बदलें' : 'अपनी फोटो जोड़ें 📷'}</span>
                  </button>

                  {userPhoto && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-stone-400 hover:text-red-400 transition text-[11px]"
                    >
                      हटाएँ
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-stone-400">
                  {userPhoto ? '✅ फोटो लगी है' : 'फोटो लगाना वैकल्पिक है'}
                </span>
              </div>
            </div>

            {/* Mega Action Buttons: WhatsApp Viral Share, Download Photo Card, Copy Link */}
            <div className="mt-5 space-y-2.5">
              {/* WhatsApp Share Button */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white font-bold py-3.5 px-6 rounded-2xl text-base sm:text-lg shadow-xl shadow-green-900/40 flex items-center justify-center gap-2 transform active:scale-98 transition cursor-pointer animate-bounce"
              >
                <Share2 className="w-5 h-5 text-white" />
                <span>WhatsApp पर सबको भेजें 🚀</span>
              </button>

              {/* Download Combined Photo Card Button */}
              <button
                onClick={handleDownloadPhotoCard}
                disabled={isDownloadingCard}
                className="w-full bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloadingCard ? 'फोटो कार्ड तैयार हो रहा है...' : '🖼️ फोटो स्टेटस कार्ड डाउनलोड करें (.JPG)'}
                </span>
              </button>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="w-full bg-stone-900/80 hover:bg-stone-800 border border-amber-500/30 text-amber-200 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">लिंक कॉपी हो गया! अब कहीं भी पेस्ट करें</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>अपनी जादुई विशिंग लिंक कॉपी करें</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* AdSense Mid-Content Slot */}
      <div className="max-w-3xl mx-auto px-4 my-6">
        <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-2 text-center text-stone-500 text-[10px] tracking-widest uppercase">
          <div className="flex items-center justify-between text-[9px] text-stone-500 mb-1 px-1">
            <span>विज्ञापन • SPONSORED</span>
            <span>AdSense Responsive Unit</span>
          </div>
          <div className="h-20 sm:h-24 bg-stone-950/70 border border-dashed border-stone-800 rounded flex items-center justify-center text-stone-400 text-xs sm:text-sm">
            <span>यहाँ आपका 300x250 या Responsive इन-आर्टिकल विज्ञापन दिखेगा</span>
          </div>
        </div>
      </div>

      {/* Rich SEO Content Section (Guarantees Google Rank #1 and AdSense Approval) */}
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        
        {/* Shubh Muhurat Card */}
        <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3>शुभ मुहूर्त व पूजन समय (Shubh Muhurat)</h3>
          </div>
          <p className="text-stone-300 text-sm leading-relaxed">
            {festival.shubhMuhurat}
          </p>
        </div>

        {/* Significance & History */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3>{festival.nameHi} का पावन महत्व व इतिहास</h3>
          </div>
          <p className="text-stone-300 text-sm leading-relaxed">
            {festival.significance}
          </p>
        </div>

        {/* Top 5 Copy-Paste Wishes */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-amber-400 font-bold text-base mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>शीर्ष 5 शुभकामना संदेश (Copy & Paste Wishes)</span>
          </h3>
          <div className="space-y-3">
            {festival.seoTopWishes.map((wish, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 flex items-center justify-between gap-3 text-stone-200 text-xs sm:text-sm"
              >
                <p className="flex-1">"{wish}"</p>
                <button
                  onClick={() => handleCopyTextWish(wish, idx)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs flex items-center gap-1 shrink-0 transition cursor-pointer"
                  title="कॉपी करें"
                >
                  {copiedWishIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">कॉपी</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>कॉपी</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion for FAQPage Schema */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-amber-400 font-bold text-base mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>अक्सर पूछे जाने वाले प्रश्न (FAQs)</span>
          </h3>
          <div className="space-y-2">
            {festival.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-stone-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-3.5 bg-stone-950/60 hover:bg-stone-950 flex items-center justify-between text-xs sm:text-sm text-stone-200 font-medium transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 bg-stone-900/50 text-stone-300 text-xs sm:text-sm leading-relaxed border-t border-stone-800">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Browse Other Upcoming Festivals */}
        <div className="pt-4">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">
            अन्य आगामी त्योहारों की विशेज बनाएँ:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {allFestivals
              .filter(f => f.id !== festival.id)
              .slice(0, 6)
              .map(f => (
                <button
                  key={f.id}
                  onClick={() => onSelectAnotherFestival(f)}
                  className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-left transition cursor-pointer group"
                >
                  <span className="text-xs text-amber-400 font-semibold block group-hover:text-amber-300">
                    {f.nameHi}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    {f.dateLabel}
                  </span>
                </button>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
};
