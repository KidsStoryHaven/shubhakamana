import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Flame, 
  Download, 
  Globe, 
  MessageCircle, 
  Send, 
  Loader2 
} from 'lucide-react';

interface ThreeDSharePreviewCardProps {
  festivalName: string;
  senderName: string;
  userPhoto?: string | null;
  heroImage?: string;
  shareUrl: string;
  type?: 'festival' | 'subhaprabhat' | 'general';
  onShareWhatsApp: () => void;
  onCopyLink: () => void;
  isCopied: boolean;
  showButtons?: boolean;
}

export const ThreeDSharePreviewCard: React.FC<ThreeDSharePreviewCardProps> = ({
  festivalName,
  senderName,
  userPhoto,
  heroImage,
  shareUrl,
  type = 'festival',
  onShareWhatsApp,
  onCopyLink,
  isCopied,
  showButtons = true
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [showMoreSocials, setShowMoreSocials] = useState(false);

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max tilt: 10 degrees
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const displayName = senderName?.trim() || 'आपके किसी अपने';
  const isMorning = type === 'subhaprabhat';

  const previewTitle = isMorning
    ? `🌅 ${displayName} ने आपके लिए आज का सुंदर 3D शुभ विचार भेजा है! ✨`
    : `✨ ${displayName} ने आपके लिए भेजा है ${festivalName} का 3D जादुई सरप्राइज! 🎁`;

  const previewDescription = isMorning
    ? `👉 तुरंत टच करके देखें और अपने नाम व फोटो का 3D सुविचार स्टेटस बनाएँ ➔ www.shubhakamna.in`
    : `👉 इस नीले लिंक को तुरंत टच करके देखें आपके लिए क्या खास संदेश आया है! ➔ www.shubhakamna.in`;

  // Universal Native Web Share (WhatsApp, Facebook, Instagram, Telegram, etc.)
  const handleUniversalShare = async () => {
    const fullText = `${previewTitle}\n\n${previewDescription}\n\n👇 3D लिंक खोलें:\n${shareUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: previewTitle,
          text: fullText,
          url: shareUrl
        });
        return;
      } catch {
        // Fallback to social list if cancelled or failed
      }
    }
    // If Web Share not supported or cancelled, toggle social menu
    setShowMoreSocials(true);
  };

  const handleSocialShare = (platform: 'facebook' | 'telegram' | 'twitter') => {
    let url = '';
    const text = encodeURIComponent(`${previewTitle}\n\n${previewDescription}`);
    const encodedShareUrl = encodeURIComponent(shareUrl);

    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${encodedShareUrl}&text=${text}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${text}`;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Download 3D Card Image as High-Resolution JPG
  const handleDownloadCardImage = async () => {
    try {
      setIsDownloadingImage(true);
      const scaleFactor = 2; // 2x 2400x1800 Ultra-HD resolution
      const canvas = document.createElement('canvas');
      canvas.width = 1200 * scaleFactor;
      canvas.height = 900 * scaleFactor;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.scale(scaleFactor, scaleFactor);

      // Dark Luxury Background
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, 1200, 900);

      // Gold Outer Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.strokeRect(16, 16, 1168, 868);

      // Card Header
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(40, 40, 1120, 90);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 1120, 90);

      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`✨ प्रेषक: ${displayName}`, 70, 98);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('3D जादुई विशिंग कार्ड 🎁', 1130, 96);

      // Hero Image
      const imgUrl = heroImage || userPhoto || 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&h=630&q=85';
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve) => {
        img.onload = () => {
          try {
            ctx.drawImage(img, 40, 150, 1120, 520);
          } catch {}
          resolve();
        };
        img.onerror = () => resolve();
        img.src = imgUrl;
      });

      // Overlay on image bottom
      const grad = ctx.createLinearGradient(0, 500, 0, 670);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.92)');
      ctx.fillStyle = grad;
      ctx.fillRect(40, 500, 1120, 170);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(festivalName, 70, 630);

      // Bottom 3D CTA Box
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(40, 690, 1120, 170);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 690, 1120, 170);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(previewTitle.slice(0, 55), 600, 745);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 28px monospace';
      ctx.fillText(`👉 ${shareUrl}`, 600, 810);

      // Trigger Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `3D-${festivalName.replace(/\s+/g, '-')}-card.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsDownloadingImage(false);
      }, 'image/jpeg', 0.98);
    } catch {
      setIsDownloadingImage(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-amber-500/20 text-left space-y-4">
      
      {/* Header Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 flex items-center justify-center font-black text-sm shadow-lg shadow-amber-500/30 shrink-0">
            3D
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300 font-serif flex items-center gap-1.5">
              <span>WhatsApp व सोशल मीडिया 3D लिंक कार्ड</span>
              <span className="text-[10px] bg-red-500 text-white font-sans px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider">
                Viral
              </span>
            </h4>
            <p className="text-[11px] text-stone-400">
              जब आप यह लिंक किसी को भेजेंगे, तो WhatsApp व Facebook पर यह 3D कार्ड ऐसा दिखेगा:
            </p>
          </div>
        </div>

        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 self-start sm:self-auto bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <Flame className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
          <span>100% क्लिक गारंटी</span>
        </span>
      </div>

      {/* 3D Perspective Interactive Box */}
      <div 
        className="perspective-[1000px] w-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/40 shadow-2xl transition-all duration-200 ease-out overflow-hidden group"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
            transformStyle: 'preserve-3d',
            boxShadow: isHovered 
              ? '0 25px 50px -12px rgba(245, 158, 11, 0.35), 0 0 30px rgba(245, 158, 11, 0.2)' 
              : '0 20px 25px -5px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Animated Gold Shimmer Light */}
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-400/10 to-transparent rotate-45 pointer-events-none group-hover:translate-x-full transition-transform duration-1000" />

          {/* WhatsApp / Chat Message Simulation Box */}
          <div className="relative z-10 bg-[#0b141a] rounded-xl p-3 sm:p-4 border border-[#202c33] shadow-inner space-y-3">
            
            {/* Sender Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-[#202c33] pb-2">
              <div className="flex items-center gap-2">
                {userPhoto ? (
                  <img 
                    src={userPhoto} 
                    alt={displayName} 
                    className="w-7 h-7 rounded-full object-cover border border-amber-400 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {displayName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-[#e9edef] flex items-center gap-1">
                    <span>{displayName}</span>
                    <span className="text-[10px] text-[#8696a0] font-normal">• अभी-अभी</span>
                  </div>
                  <div className="text-[10px] text-[#00a884] font-medium flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>3D पावन शुभकामना लिंक</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-[#8696a0] bg-[#111b21] px-2 py-0.5 rounded">
                WhatsApp Preview
              </span>
            </div>

            {/* Rich Embed Card */}
            <div className="rounded-xl overflow-hidden bg-[#111b21] border border-[#222e35] shadow-lg">
              {/* Image Banner */}
              <div className="relative aspect-[16/9] w-full bg-stone-950 overflow-hidden">
                <img 
                  src={heroImage || userPhoto || 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80'} 
                  alt="3D Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* 3D Floating Glass Badge */}
                <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  <span>3D SPECIAL WISH</span>
                </div>

                {/* Festival & Sender overlay */}
                <div className="absolute bottom-2 inset-x-3 text-white">
                  <div className="text-[11px] font-extrabold text-amber-300 font-serif drop-shadow-md">
                    {festivalName}
                  </div>
                  <div className="text-xs font-black text-white drop-shadow truncate">
                    प्रेषक: {displayName}
                  </div>
                </div>
              </div>

              {/* Title & Description under image */}
              <div className="p-3 space-y-1">
                <div className="text-xs sm:text-sm font-bold text-[#e9edef] leading-snug">
                  {previewTitle}
                </div>
                <div className="text-[11px] text-[#8696a0] line-clamp-2 leading-relaxed">
                  {previewDescription}
                </div>
                <div className="pt-1.5 flex items-center gap-1.5 text-[10px] text-[#00a884] font-mono truncate">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{shareUrl}</span>
                </div>
              </div>
            </div>

            {/* Clickable Action Banner */}
            <button
              onClick={onShareWhatsApp}
              className="w-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 p-2.5 rounded-xl text-center transition cursor-pointer active:scale-98"
            >
              <span className="text-xs font-black text-amber-300 flex items-center justify-center gap-1.5">
                <span>👉 इस 3D कार्ड को WhatsApp व सोशल मीडिया पर तुरंत भेजें ➔</span>
                <span className="text-base animate-bounce">🎁</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 100% Working Direct Sharing Action Buttons 🚀 */}
      {showButtons && (
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Main WhatsApp Share Button */}
            <button
              onClick={onShareWhatsApp}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-green-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp पर 3D लिंक भेजें 🚀</span>
            </button>

            {/* 2. Universal Social Media Share (All Apps) */}
            <button
              onClick={handleUniversalShare}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>सोशल मीडिया पर शेयर करें (All Apps) 🌐</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 3. Copy Link Button */}
            <button
              onClick={onCopyLink}
              className="w-full bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/40 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">लिंक कॉपी हो गया! ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>3D पेज लिंक कॉपी करें (Copy Link)</span>
                </>
              )}
            </button>

            {/* 4. Download 3D Card Image Button */}
            <button
              onClick={handleDownloadCardImage}
              disabled={isDownloadingImage}
              className="w-full bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition disabled:opacity-50"
            >
              {isDownloadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>3D कार्ड इमेज बन रही है...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>3D कार्ड फ़ोटो डाउनलोड करें (.JPG)</span>
                </>
              )}
            </button>
          </div>

          {/* Expanded 1-Click Social Platforms Dropdown */}
          {showMoreSocials && (
            <div className="p-3 rounded-xl bg-black/80 border border-purple-500/40 animate-fadeIn space-y-2">
              <p className="text-[11px] font-bold text-stone-300">
                ⚡ 1-क्लिक में सोशल मीडिया पर भेजें:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="py-2 px-3 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                >
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleSocialShare('telegram')}
                  className="py-2 px-3 rounded-lg bg-[#229ED9] hover:bg-[#1e8cc0] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </button>
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition"
                >
                  <span>X (Twitter)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
