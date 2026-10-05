import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sun, 
  Sparkles, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Camera, 
  X, 
  Search, 
  ArrowLeft, 
  Languages, 
  Image as ImageIcon,
  Clock,
  Calendar,
  Smartphone,
  Square,
  Upload,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  Type
} from 'lucide-react';
import { 
  SuvicharItem, 
  SuvicharBackground,
  SUVICHAR_BACKGROUNDS, 
  getDaily100Suvichar, 
  getDayAndTimeFormatted,
  getTodayHindiDateString 
} from '../data/dailySuvicharData';
import { 
  SUVICHAR_STYLES, 
  SuvicharStyleOption, 
  getSuvicharStyleById, 
  parseSuvicharContent 
} from '../data/suvicharStylesData';
import { generateSuvicharCardBlob } from '../utils/generateSuvicharCard';
import { awardUserPoints } from '../data/userStore';
import { ThreeDSharePreviewCard } from './ThreeDSharePreviewCard';

interface ShubhPrabhatPageProps {
  onBackToPortal: () => void;
}

export const ShubhPrabhatPage: React.FC<ShubhPrabhatPageProps> = ({ onBackToPortal }) => {
  // 100 Daily Suvichar items calculated automatically for today's date
  const dailySuvichars = useMemo(() => getDaily100Suvichar(), []);
  const todayHindiDate = useMemo(() => getTodayHindiDateString(), []);

  // Studio State
  const [selectedSuvichar, setSelectedSuvichar] = useState<SuvicharItem>(dailySuvichars[0]);
  const [selectedBackground, setSelectedBackground] = useState<SuvicharBackground>(SUVICHAR_BACKGROUNDS[0]);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [senderName, setSenderName] = useState<string>(() => {
    return localStorage.getItem('shubhakamna_my_name') || 'दिनेश शर्मा';
  });
  const [senderPhoto, setSenderPhoto] = useState<string | null>(() => {
    return localStorage.getItem('shubhakamna_my_photo') || null;
  });
  const [aspectRatio, setAspectRatio] = useState<'story' | 'square'>('story');
  const [selectedLang, setSelectedLang] = useState<'hindi' | 'english' | 'marathi' | 'gujarati'>('hindi');
  const [showDayAndTime, setShowDayAndTime] = useState<boolean>(true);

  // 🎨 8 WhatsApp Status Font & Card Styles
  const [selectedStyleId, setSelectedStyleId] = useState<string>('gold_floral');
  const [headlineWord, setHeadlineWord] = useState<string>('');
  const [customBadge1, setCustomBadge1] = useState<string>('');
  const [customBadge2, setCustomBadge2] = useState<string>('');
  const [fontScale, setFontScale] = useState<number>(1.5);
  const [photoSizeOption, setPhotoSizeOption] = useState<number>(1.25);

  const activeStyle = useMemo(() => getSuvicharStyleById(selectedStyleId), [selectedStyleId]);

  // Background category filter
  const [bgCategoryFilter, setBgCategoryFilter] = useState<'all' | 'sunrise' | 'temple' | 'nature' | 'gradient'>('all');

  // List search & category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<boolean>(false);

  // Live Day & Time String (auto-updates every minute)
  const [currentDayTime, setCurrentDayTime] = useState(() => getDayAndTimeFormatted(selectedLang));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDayTime(getDayAndTimeFormatted(selectedLang));
    }, 30000);
    return () => clearInterval(timer);
  }, [selectedLang]);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);
  const editorCardRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);

  // Filtered Suvichar List
  const filteredSuvicharList = useMemo(() => {
    return dailySuvichars.filter(item => {
      const matchCat = filterCategory === 'all' || item.category === filterCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery = !q || 
        item.hindiText.toLowerCase().includes(q) || 
        item.englishText.toLowerCase().includes(q) || 
        (item.marathiText && item.marathiText.toLowerCase().includes(q)) ||
        (item.gujaratiText && item.gujaratiText.toLowerCase().includes(q)) ||
        item.tags.some(t => t.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });
  }, [dailySuvichars, filterCategory, searchQuery]);

  // Filtered Backgrounds
  const filteredBackgrounds = useMemo(() => {
    if (bgCategoryFilter === 'all') return SUVICHAR_BACKGROUNDS;
    return SUVICHAR_BACKGROUNDS.filter(b => b.category === bgCategoryFilter);
  }, [bgCategoryFilter]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setSenderPhoto(url);
      try {
        localStorage.setItem('shubhakamna_my_photo', url);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  // Handle Custom Background Upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setCustomBgUrl(url);
    };
    reader.readAsDataURL(file);
  };

  const handleNameChange = (val: string) => {
    setSenderName(val);
    try {
      localStorage.setItem('shubhakamna_my_name', val);
    } catch {}
  };

  // Get active text based on selected language
  const getSuvicharText = (item: SuvicharItem) => {
    if (selectedLang === 'english') return item.englishText;
    if (selectedLang === 'marathi' && item.marathiText) return item.marathiText;
    if (selectedLang === 'gujarati' && item.gujaratiText) return item.gujaratiText;
    return item.hindiText;
  };

  // Get Short Page URL
  const getShortUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
    return `${origin}/shubh-prabhat`;
  };

  // Download HD Card
  const handleDownloadCard = async () => {
    try {
      setIsDownloading(true);
      const { blob, fileName } = await generateSuvicharCardBlob({
        suvichar: selectedSuvichar,
        background: selectedBackground,
        customBackgroundUrl: customBgUrl,
        senderName,
        senderPhoto,
        aspectRatio,
        language: selectedLang,
        showDayAndTime,
        styleId: selectedStyleId,
        headlineOverride: headlineWord,
        customBadge1: customBadge1.trim() || undefined,
        customBadge2: customBadge2.trim() || undefined,
        fontSizeMultiplier: fontScale,
        photoScale: photoSizeOption,
        targetElement: previewCardRef.current
      });

      // 1. Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 2. Automatically copy short link to clipboard for effortless sharing (strictly page link only)
      const shareUrl = getShortUrl();
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {}

      // 3. Show notification
      setDownloadSuccessNotice(true);
      setTimeout(() => setDownloadSuccessNotice(false), 8000);

      awardUserPoints('download_card', 'Shubh Prabhat Suvichar HD Card');
    } catch (err) {
      console.error('Suvichar download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Universal WhatsApp & Native Share (Image + Short Page Link ONLY, no extra message text)
  const handleWhatsAppShare = async (itemToShare: SuvicharItem = selectedSuvichar) => {
    try {
      setIsSharing(true);
      const shareUrl = getShortUrl();

      // Check if Web Share API with files is supported (works on Android / iOS Chrome / Safari)
      if (typeof navigator !== 'undefined' && navigator.canShare) {
        try {
          const { blob, fileName } = await generateSuvicharCardBlob({
            suvichar: itemToShare,
            background: selectedBackground,
            customBackgroundUrl: customBgUrl,
            senderName,
            senderPhoto,
            aspectRatio,
            language: selectedLang,
            showDayAndTime,
            styleId: selectedStyleId,
            headlineOverride: headlineWord,
            customBadge1: customBadge1.trim() || undefined,
            customBadge2: customBadge2.trim() || undefined,
            fontSizeMultiplier: fontScale,
            photoScale: photoSizeOption,
            targetElement: previewCardRef.current
          });

          const file = new File([blob], fileName, { type: 'image/jpeg' });
          if (navigator.canShare({ files: [file] })) {
            // Share image along with ONLY the short page link
            await navigator.share({
              files: [file],
              text: shareUrl
            });
            awardUserPoints('whatsapp_share', 'Shubh Prabhat Suvichar');
            return;
          }
        } catch (shareErr) {
          console.warn('Native file share failed or was cancelled, falling back to WhatsApp link:', shareErr);
        }
      }

      // Fallback: Direct WhatsApp Web / App share link (strictly page link only)
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`;
      window.open(waUrl, '_blank');
      awardUserPoints('whatsapp_share', 'Shubh Prabhat Suvichar');
    } catch (err) {
      console.error('WhatsApp share error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  // Copy Page Short Link (No extra text, clean URL only)
  const handleCopyLink = (id?: number) => {
    const shareUrl = getShortUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      if (id !== undefined) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      } else {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2500);
      }
    });
  };

  // Select Suvichar into Studio & Scroll
  const handleSelectIntoStudio = (item: SuvicharItem) => {
    setSelectedSuvichar(item);
    if (editorCardRef.current) {
      editorCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={customBgInputRef}
        accept="image/*"
        onChange={handleCustomBgUpload}
        className="hidden"
      />

      {/* Top Header & Breadcrumb Navigation */}
      <div className="sticky top-0 z-30 bg-stone-950/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToPortal}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>सभी त्योहार देखें (Home)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyLink()}
              className="text-xs bg-stone-900 hover:bg-stone-800 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 transition cursor-pointer"
              title="पेज का शॉर्ट लिंक कॉपी करें"
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">लिंक कॉपी हुआ!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>शॉर्ट लिंक कॉपी करें</span>
                </>
              )}
            </button>

            <span className="text-xs bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/40 font-mono font-bold hidden sm:flex items-center gap-1.5 shadow-sm">
              <Sun className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
              <span>दैनिक १०० पावन विचार</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 pb-12 space-y-8">
        
        {/* Page Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 via-yellow-900/60 to-amber-950/80 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-extrabold shadow-lg">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{todayHindiDate}</span>
            <span>•</span>
            <span>प्रातःकालीन अमृत विचार</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-serif tracking-tight drop-shadow-md">
            🌅 शुभ प्रभात • आज के १०० पावन सुविचार
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
            हर सुबह जीवन का एक नया उपहार है। यहाँ प्रतिदिन स्वतः बदलने वाले १०० दिव्य सुविचारों को अपनी <strong>बड़ी फ़ोटो</strong> व <strong>नाम</strong> के साथ जोड़कर WhatsApp स्टेटस व फ़ोटो कार्ड बनाएँ!
          </p>
        </div>

        {/* Download & Share Success Banner Alert */}
        {downloadSuccessNotice && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-stone-900 to-emerald-950/90 border-2 border-emerald-500/80 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-black text-emerald-300">
                  🎉 HD सुविचार फ़ोटो कार्ड डाउनलोड हो गया!
                </p>
                <p className="text-xs text-stone-300">
                  साथ ही WhatsApp पर शेयर करने हेतु पेज का शॉर्ट लिंक (<strong>shubhakamna.in/shubh-prabhat</strong>) कॉपी हो चुका है।
                </p>
              </div>
            </div>
            <button
              onClick={() => handleWhatsAppShare()}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp पर भेजें</span>
            </button>
          </div>
        )}

        {/* 🎨 INTERACTIVE PHOTO CARD STUDIO / LIVE PREVIEW CARD 🎨 */}
        <div ref={editorCardRef} className="rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/50 shadow-2xl p-4 sm:p-6 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-black shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-amber-200">
                सुविचार फ़ोटो कार्ड स्टूडियो (Live Preview)
              </h2>
            </div>

            {/* Aspect Ratio Switcher (9:16 WhatsApp Status vs 1:1 Square) */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => setAspectRatio('story')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  aspectRatio === 'story'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>स्टेटस (9:16)</span>
              </button>
              <button
                onClick={() => setAspectRatio('square')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  aspectRatio === 'square'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>चौकोर (1:1)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Live Visual Card Preview (Zero Cut-Off Guarantee) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div 
                ref={previewCardRef}
                className={`relative w-full max-w-[340px] sm:max-w-[390px] rounded-3xl overflow-hidden border-2 border-amber-400/90 shadow-2xl flex flex-col justify-between text-center select-none transition-all ${
                  aspectRatio === 'story' 
                    ? 'aspect-[9/16] p-4 sm:p-5' 
                    : 'min-h-[460px] sm:min-h-[500px] p-4 sm:p-5'
                }`}
                style={{
                  backgroundImage: customBgUrl
                    ? `url(${customBgUrl})`
                    : selectedBackground.type === 'image' && selectedBackground.id !== 'default_plain'
                      ? `url(${selectedBackground.url})`
                      : activeStyle.cardTheme === 'royal_dark' || activeStyle.cardTheme === 'cosmic_gold' || activeStyle.cardTheme === 'sunrise_wood'
                        ? `radial-gradient(circle at center, ${activeStyle.bgGrad[0]}, ${activeStyle.bgGrad[1]}, ${activeStyle.bgGrad[2]})`
                        : `linear-gradient(135deg, ${activeStyle.bgGrad[0]}, ${activeStyle.bgGrad[1]}, ${activeStyle.bgGrad[2]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: activeStyle.isDarkTheme ? '#0c0a09' : '#ffffff'
                }}
              >
                {/* Dark Vignette Overlay for 100% Readability */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: activeStyle.isDarkTheme
                      ? 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.65), rgba(0,0,0,0.5))'
                      : 'linear-gradient(to top, rgba(255,255,255,0.92), rgba(255,255,255,0.7), rgba(255,255,255,0.8))'
                  }}
                />

                {/* Decorative border rail */}
                <div 
                  className="absolute inset-2 border rounded-2xl pointer-events-none" 
                  style={{ borderColor: activeStyle.isDarkTheme ? 'rgba(251, 191, 36, 0.4)' : 'rgba(217, 119, 6, 0.35)' }}
                />

                {/* 🐦 Top Right Bird & Golden Branch Decoration (Like Reference Image) */}
                <div className="absolute top-3 right-3 z-20 text-3xl sm:text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none pointer-events-none animate-bounce-slow">
                  🐦🌿
                </div>

                {/* 💖 Left Side Glossy 3D Hearts Decoration */}
                <div className="absolute top-1/3 left-2.5 z-20 text-2xl sm:text-3xl filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] select-none pointer-events-none space-y-1">
                  <div>💖</div>
                  <div className="text-xs sm:text-sm pl-1">✨</div>
                </div>

                {/* Card Top: MASSIVE 3D EMBOSSED CALLIGRAPHIC TITLE (Like reference styles 1-8) */}
                <div className="relative z-10 space-y-1.5 shrink-0 pt-2">
                  {/* MASSIVE 3D EMBOSSED TITLE (आयुष्यांत / शुभ प्रभात) */}

                  {/* MASSIVE 3D EMBOSSED TITLE (आयुष्यांत / शुभ प्रभात) */}
                  <div className="relative py-1 flex items-center justify-center">
                    <span 
                      className="text-4xl sm:text-6xl font-black tracking-wide drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]"
                      style={{
                        fontFamily: activeStyle.fontFamily,
                        background: activeStyle.headlineTheme === 'magenta_3d' 
                          ? 'linear-gradient(180deg, #ffffff 0%, #f472b6 40%, #db2777 80%, #9d174d 100%)'
                          : activeStyle.headlineTheme === 'candy_rose'
                            ? 'linear-gradient(180deg, #fff1f2 0%, #fb7185 40%, #e11d48 80%, #9f1239 100%)'
                            : 'linear-gradient(180deg, #ffffff 0%, #fde047 35%, #f59e0b 75%, #d97706 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
                        WebkitTextStroke: '2px #78350f'
                      }}
                    >
                      {headlineWord?.trim() || activeStyle.defaultHeadline || 'शुभ प्रभात'}
                    </span>
                    {/* Floating decorative elements around title */}
                    <span className="absolute -top-1 right-12 sm:right-16 text-xl sm:text-2xl animate-pulse">💛</span>
                    <span className="absolute -bottom-2 left-12 sm:left-16 text-lg sm:text-xl">🕊️</span>
                  </div>

                  {/* 🕒 Small Day & Time Badge on Card */}
                  {showDayAndTime && (
                    <div 
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border"
                      style={{
                        backgroundColor: activeStyle.isDarkTheme ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        borderColor: activeStyle.isDarkTheme ? '#f59e0b' : '#d97706',
                        color: activeStyle.isDarkTheme ? '#fde047' : '#b45309'
                      }}
                    >
                      <Clock className="w-3 h-3 text-yellow-500" />
                      <span>{currentDayTime.badgeText}</span>
                    </div>
                  )}
                </div>

                {/* Card Center: BADE BADE TEXT (Full Space Utilization, No Awkward Dabbas) */}
                {(() => {
                  const activeText = getSuvicharText(selectedSuvichar);
                  const parsed = parseSuvicharContent(activeText, customBadge1, customBadge2);
                  const b1 = customBadge1 || parsed.badge1;
                  const b2 = customBadge2 || parsed.badge2;
                  const hWord = headlineWord ? headlineWord.trim() : '';

                  return (
                    <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-2 px-1 space-y-2.5 my-auto">
                      
                      {/* Optional Headline Word if chosen by user (Clean styled text, zero background container) */}
                      {hWord ? (
                        <div className="text-center py-0.5">
                          <span 
                            className="inline-block text-2xl sm:text-3xl font-black tracking-wide"
                            style={{
                              fontFamily: activeStyle.fontFamily,
                              color: activeStyle.highlightColor || (activeStyle.isDarkTheme ? '#fde047' : '#b45309'),
                              textShadow: activeStyle.isDarkTheme 
                                ? '0 2px 10px rgba(0,0,0,0.9), 0 0 16px rgba(251,191,36,0.45)' 
                                : '0 1px 4px rgba(0,0,0,0.2)'
                            }}
                          >
                            {hWord}
                          </span>
                        </div>
                      ) : null}

                      {/* 📖 MAIN BOLD SUVICHAR QUOTE — 1.5X BADE BADE TEXT FILLING THE CARD! */}
                      <div className="w-full px-2 py-1 text-center">
                        <p 
                          className={`font-black tracking-wide leading-snug sm:leading-relaxed ${
                            fontScale >= 1.5
                              ? activeText.length > 120 
                                ? 'text-lg sm:text-xl md:text-2xl' 
                                : activeText.length > 70 
                                  ? 'text-xl sm:text-2xl md:text-3xl' 
                                  : 'text-2xl sm:text-3xl md:text-4xl'
                              : fontScale >= 1.25
                                ? activeText.length > 120 
                                  ? 'text-base sm:text-lg md:text-xl' 
                                  : activeText.length > 70 
                                    ? 'text-lg sm:text-xl md:text-2xl' 
                                    : 'text-xl sm:text-2xl md:text-3xl'
                                : activeText.length > 120 
                                  ? 'text-sm sm:text-base' 
                                  : activeText.length > 70 
                                    ? 'text-base sm:text-lg' 
                                    : 'text-lg sm:text-xl'
                          }`}
                          style={{ 
                            color: activeStyle.textColor, 
                            fontFamily: activeStyle.fontFamily,
                            textShadow: activeStyle.isDarkTheme 
                              ? '0 4px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)' 
                              : '0 2px 10px rgba(255,255,255,0.98), 0 1px 3px rgba(0,0,0,0.35)'
                          }}
                        >
                          “{activeText}”
                        </p>
                      </div>

                      {/* Ornament */}
                      <div className="text-sm opacity-90">
                        {activeStyle.ornament}
                      </div>

                    </div>
                  );
                })()}

                {/* Card Bottom: VIRTUE TAGS ABOVE PHOTO, ROUND USER PHOTO, SENDER PLATE */}
                {(() => {
                  const activeText = getSuvicharText(selectedSuvichar);
                  const parsed = parseSuvicharContent(activeText, customBadge1, customBadge2);
                  const b1 = customBadge1 || parsed.badge1;
                  const b2 = customBadge2 || parsed.badge2;

                  return (
                    <div className="relative z-10 flex flex-col items-center gap-1.5 pt-1 shrink-0">
                      
                      {/* 🏷️ सत्यवचन व सकारात्मकता: User photo ke round ke theek upar, chote text me */}
                      <div 
                        className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold shadow-sm backdrop-blur-md"
                        style={{
                          backgroundColor: activeStyle.isDarkTheme ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                          borderColor: activeStyle.isDarkTheme ? '#f59e0b' : '#d97706',
                          color: activeStyle.isDarkTheme ? '#fde047' : '#92400e'
                        }}
                      >
                        <span>✨ {b1} • {b2} ✨</span>
                      </div>

                      {/* 👑 Dynamic Round User Photo */}
                      {senderPhoto ? (
                        <div 
                          className={`relative rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-2xl border-2 border-yellow-300 ring-4 ring-amber-500/50 transition-all duration-300 ${
                            photoSizeOption <= 0.85
                              ? 'w-16 h-16 sm:w-18 sm:h-18'
                              : photoSizeOption <= 1.0
                                ? 'w-20 h-20 sm:w-22 sm:h-22'
                                : photoSizeOption <= 1.3
                                  ? 'w-24 h-24 sm:w-28 sm:h-28'
                                  : 'w-28 h-28 sm:w-34 sm:h-34'
                          }`}
                        >
                          <img
                            src={senderPhoto}
                            alt={senderName}
                            className="w-full h-full rounded-full object-cover border-2 border-stone-950"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 text-[11px] font-black w-6 h-6 rounded-full border-2 border-yellow-100 shadow-md flex items-center justify-center">
                            ★
                          </span>
                        </div>
                      ) : null}

                      {/* Sender Name Plate */}
                      <div 
                        className="px-3.5 py-1 rounded-xl backdrop-blur-md shadow-md min-w-[190px] border"
                        style={{
                          backgroundColor: activeStyle.isDarkTheme ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                          borderColor: activeStyle.isDarkTheme ? '#f59e0b' : '#d97706'
                        }}
                      >
                        <p 
                          className="text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: activeStyle.isDarkTheme ? '#fde68a' : '#92400e' }}
                        >
                          ✨ सप्रेम शुभकामना प्रेषक ✨
                        </p>
                        <p 
                          className="text-xs sm:text-sm font-black font-serif"
                          style={{ color: activeStyle.isDarkTheme ? '#ffffff' : '#1c1917' }}
                        >
                          {senderName || 'आपका शुभचिंतक'}
                        </p>
                      </div>

                      {/* 🌐 3D Embossed Website CTA Button on Card (Zero Cut-Off!) */}
                      <div 
                        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border-2 text-[10.5px] sm:text-xs font-black shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] tracking-wide transform hover:scale-105 transition"
                        style={{
                          background: activeStyle.isDarkTheme 
                            ? 'linear-gradient(180deg, #292524 0%, #1c1917 100%)' 
                            : 'linear-gradient(180deg, #ffffff 0%, #fef3c7 100%)',
                          borderColor: '#f59e0b',
                          color: activeStyle.isDarkTheme ? '#fef08a' : '#92400e'
                        }}
                      >
                        <span>✨ अपना नाम लिखकर स्टेटस बनाएँ ➔ shubhakamna.in</span>
                      </div>

                      <p 
                        className="text-[9.5px] font-semibold tracking-tight"
                        style={{ color: activeStyle.isDarkTheme ? '#cbd5e1' : '#475569' }}
                      >
                        🌅 दैनिक १००+ शुभ प्रभात सुविचार • मुफ़्त कार्ड जनरेटर
                      </p>
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* Right: Studio Customizer Controls */}
            <div className="lg:col-span-6 space-y-4 text-left">
              
              {/* 1. Sender Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-amber-300">
                  १. अपना नाम लिखें (Sender Name):
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="अपना नाम यहाँ लिखें..."
                  maxLength={40}
                  className="w-full bg-stone-900 border-2 border-amber-500/50 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              {/* 2. Very Big User Photo Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-amber-300">
                  २. अपनी बड़ी फ़ोटो जोड़ें (Very Big Photo on Card):
                </label>

                {senderPhoto ? (
                  <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-md shrink-0">
                          <img src={senderPhoto} alt="User" className="w-full h-full rounded-full object-cover" />
                          <span className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-stone-950 text-[9px] font-black w-4 h-4 rounded-full border border-yellow-100 flex items-center justify-center">
                            ★
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-amber-300">
                            ✅ आपकी फ़ोटो कार्ड पर सेट है!
                          </p>
                          <p className="text-[10px] text-stone-300">
                            डाउनलोड व शेयर करने पर कार्ड पर यह स्पष्ट दिखेगी
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold transition cursor-pointer"
                        >
                          बदलें
                        </button>
                        <button
                          onClick={() => {
                            setSenderPhoto(null);
                            localStorage.removeItem('shubhakamna_my_photo');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-red-900/60 text-stone-300 hover:text-red-300 text-xs font-bold transition cursor-pointer"
                        >
                          हटाएँ
                        </button>
                      </div>
                    </div>

                    {/* 📐 User Photo Size Controller */}
                    <div className="pt-2 border-t border-amber-500/20 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300">
                          फ़ोटो का साइज़ (Photo Size on Card):
                        </span>
                        <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                          {photoSizeOption === 0.85 && 'छोटा (Small)'}
                          {photoSizeOption === 1.0 && 'मध्यम (Medium)'}
                          {photoSizeOption === 1.25 && 'बड़ा (Large - डिफ़ॉल्ट)'}
                          {photoSizeOption === 1.55 && 'बहुत बड़ा (Extra Large)'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { scale: 0.85, label: 'छोटा' },
                          { scale: 1.0, label: 'मध्यम' },
                          { scale: 1.25, label: 'बड़ा' },
                          { scale: 1.55, label: 'बहुत बड़ा' }
                        ].map((item) => (
                          <button
                            key={item.scale}
                            type="button"
                            onClick={() => setPhotoSizeOption(item.scale)}
                            className={`px-2 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                              photoSizeOption === item.scale
                                ? 'bg-amber-500 text-stone-950 border-amber-400 font-black shadow-md'
                                : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <Camera className="w-4 h-4 text-stone-950" />
                      <span>अपनी बड़ी फ़ोटो लगाएँ 📷</span>
                    </button>
                    <span className="text-[11px] text-amber-300/90 font-medium">
                      वैकल्पिक (Optional)
                    </span>
                  </div>
                )}
              </div>

              {/* 🎨 3. 8 SPECIAL SUVICHAR CARD & FONT STYLES (MATCHING USER REFERENCE IMAGE) */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-black/60 border border-amber-500/40">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>३. फ़ॉन्ट व स्टेटस स्टाइल चुनें (८ स्पेशल प्रभात डिज़ाइन्स):</span>
                  </label>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold">
                    {activeStyle.hindiName}
                  </span>
                </div>

                <p className="text-[11px] text-stone-400">
                  नीचे दिए गए ८ डिज़ाइनों में से अपनी पसंद चुनें, जिसमें बड़े-बड़े 3D अक्षर और रंगीन बैच हैं:
                </p>

                {/* 8 Styles Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {SUVICHAR_STYLES.map((st) => {
                    const isSelected = st.id === selectedStyleId;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStyleId(st.id)}
                        className={`p-2.5 rounded-2xl text-left transition flex flex-col justify-between border cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? 'bg-amber-950/80 border-amber-400 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400 scale-[1.02]'
                            : 'bg-stone-900 hover:bg-stone-850 border-stone-800 hover:border-amber-500/40 text-stone-300'
                        }`}
                      >
                        {/* Active Check Badge */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-bold shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-black border border-amber-500/40 shrink-0">
                              {st.number}
                            </span>
                            <span className="text-[11px] font-bold text-stone-200 truncate">
                              {st.name}
                            </span>
                          </div>

                          {/* Text Font Preview (Clean Text Only - No background box) */}
                          <div className="h-8 flex items-center justify-center text-center">
                            <span 
                              className="text-sm sm:text-base font-black tracking-wide"
                              style={{
                                fontFamily: st.fontFamily,
                                background: st.previewGradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))'
                              }}
                            >
                              {st.defaultHeadline}
                            </span>
                          </div>
                        </div>

                        <div className="mt-1 pt-1 border-t border-stone-800 flex items-center justify-between text-[9px] text-stone-400">
                          <span className="truncate">{st.tag}</span>
                          <span>{st.ornament.split(' ')[0]}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Headline Word Selector & Custom Input (Optional) */}
                <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300">
                      शीर्षक शब्द (वैकल्पिक / Optional Title):
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {headlineWord ? 'सक्रिय है' : 'साफ़ (कोई शीर्षक नहीं)'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHeadlineWord('')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        !headlineWord
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm font-black'
                          : 'bg-stone-950 text-stone-300 border-stone-700 hover:border-stone-500'
                      }`}
                    >
                      ✓ बिना शीर्षक (साफ़)
                    </button>
                    {['शुभ प्रभात', 'सुविचार', 'सत्य वचन', 'सकारात्मकता'].map((word) => (
                      <button
                        key={word}
                        type="button"
                        onClick={() => setHeadlineWord(headlineWord === word ? '' : word)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          headlineWord === word
                            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm font-black'
                            : 'bg-stone-950 text-stone-300 border-stone-700 hover:border-stone-500'
                        }`}
                      >
                        {word}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={headlineWord}
                    onChange={(e) => setHeadlineWord(e.target.value)}
                    placeholder="या अपना शीर्षक लिखें (खाली रखने पर सिर्फ सुविचार दिखेगा)..."
                    maxLength={25}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Photo ke upar wale chote pavitra shabda (Tags above photo) */}
                <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300">
                      फ़ोटो के ऊपर के शब्द (Tags above photo):
                    </span>
                    <span className="text-[10px] text-stone-400">
                      फ़ोटो के ठीक ऊपर छोटे अक्षरों में दिखेंगे
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={customBadge1}
                      onChange={(e) => setCustomBadge1(e.target.value)}
                      placeholder="शब्द १ (जैसे: सत्य वचन)"
                      maxLength={18}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={customBadge2}
                      onChange={(e) => setCustomBadge2(e.target.value)}
                      placeholder="शब्द २ (जैसे: सकारात्मक विचार)"
                      maxLength={18}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* 🔤 Font Size Scale (1.5x Default Boost) */}
                <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-amber-400" />
                      <span>फ़ॉन्ट का साइज़ (Font Size 1.5×):</span>
                    </span>
                    <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold">
                      ⚡ {fontScale}× बड़ा सेट है
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { scale: 1.0, label: '1.0× सामान्य' },
                      { scale: 1.25, label: '1.25× बड़ा' },
                      { scale: 1.5, label: '1.5× बहुत बड़ा' },
                      { scale: 1.75, label: '1.75× विशाल' }
                    ].map(item => (
                      <button
                        key={item.scale}
                        type="button"
                        onClick={() => setFontScale(item.scale)}
                        className={`px-2 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                          fontScale === item.scale
                            ? 'bg-amber-500 text-stone-950 border-amber-400 font-black shadow-md'
                            : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Language Selector for Suvichar */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                  <span>४. सुविचार की भाषा चुनें (Select Language):</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { code: 'hindi' as const, label: 'हिंदी' },
                    { code: 'english' as const, label: 'English' },
                    { code: 'marathi' as const, label: 'मराठी' },
                    { code: 'gujarati' as const, label: 'ગુજરાતી' }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => setSelectedLang(l.code)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                        selectedLang === l.code
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-black'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-600'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day & Time Display Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-900/90 border border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-200">
                      इमेज पर आज का दिन व समय (Day & Time)
                    </p>
                    <p className="text-[10px] text-stone-400">
                      जैसे: <span className="text-amber-300 font-mono font-bold">{currentDayTime.badgeText}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDayAndTime(!showDayAndTime)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    showDayAndTime
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-black shadow-sm'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                >
                  {showDayAndTime ? '✓ चालू है' : 'बंद'}
                </button>
              </div>

              {/* 5. Unlimited Backgrounds Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>५. बैकग्राउंड चुनें (Unlimited Backgrounds):</span>
                  </label>
                  <button
                    onClick={() => customBgInputRef.current?.click()}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>+ अपनी गैलरी से फ़ोटो लगाएँ</span>
                  </button>
                </div>

                {/* Background Categories Filter */}
                <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all' as const, label: 'सभी' },
                    { id: 'sunrise' as const, label: '🌅 सूर्योदय' },
                    { id: 'temple' as const, label: '🪔 मंदिर व देव' },
                    { id: 'nature' as const, label: '🌿 प्रकृति' },
                    { id: 'gradient' as const, label: '🎨 ग्रेडिएंट्स' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setBgCategoryFilter(c.id)}
                      className={`shrink-0 px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                        bgCategoryFilter === c.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                          : 'text-stone-400 hover:text-white border-transparent'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {customBgUrl && (
                  <div className="flex items-center justify-between bg-amber-950/40 border border-amber-500/30 rounded-xl p-2 text-xs">
                    <span className="text-amber-300 flex items-center gap-1 font-bold">
                      <span>🖼️</span>
                      <span>आपकी कस्टम बैकग्राउंड फ़ोटो एक्टिव है</span>
                    </span>
                    <button
                      onClick={() => setCustomBgUrl(null)}
                      className="text-red-400 hover:text-red-300 underline text-[11px]"
                    >
                      हटाएँ
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800">
                  {filteredBackgrounds.map((bg) => {
                    const isSel = !customBgUrl && selectedBackground.id === bg.id;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => {
                          setCustomBgUrl(null);
                          setSelectedBackground(bg);
                        }}
                        className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer relative ${
                          isSel ? 'border-amber-400 ring-2 ring-amber-400 scale-105 shadow-md' : 'border-stone-800 opacity-70 hover:opacity-100'
                        }`}
                        title={bg.name}
                      >
                        {bg.type === 'image' ? (
                          <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ background: bg.cssGradient }} />
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-bold text-amber-200 truncate px-1 py-0.5">
                          {bg.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ✨ 3D WhatsApp & Social Media Embed Preview Card (Placed Above Action Buttons) */}
              <ThreeDSharePreviewCard
                festivalName="दैनिक शुभ प्रभात"
                senderName={senderName}
                userPhoto={senderPhoto}
                heroImage={customBgUrl || selectedBackground.url || 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&h=630&q=85'}
                shareUrl={getShortUrl()}
                type="subhaprabhat"
                onShareWhatsApp={() => handleWhatsAppShare()}
                onCopyLink={() => handleCopyLink(selectedSuvichar.id)}
                isCopied={copiedId === selectedSuvichar.id}
              />

              {/* 5. Main Action Buttons: Download HD Card & Direct WhatsApp Share */}
              <div className="pt-2 space-y-2.5">
                <button
                  onClick={handleDownloadCard}
                  disabled={isDownloading}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/30 transition cursor-pointer disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>HD सुविचार फ़ोटो तैयार हो रही है...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>HD सुविचार फ़ोटो कार्ड डाउनलोड करें (Free)</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleWhatsAppShare()}
                    disabled={isSharing}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSharing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>शेयर हो रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>WhatsApp पर भेजें (शॉर्ट लिंक सहित)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCopyLink(selectedSuvichar.id)}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {copiedId === selectedSuvichar.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">लिंक कॉपी हुआ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>पेज का शॉर्ट लिंक कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 📋 ALL 100 DAILY SUVICHAR LIST WITH SEARCH & CATEGORY FILTERS 📋 */}
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-amber-200 font-serif flex items-center gap-2">
                <span>📜 आज के १०० सुविचार संग्रह</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono">
                  {filteredSuvicharList.length} सुविचार
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                किसी भी सुविचार पर क्लिक करके उसका तुरंत HD कार्ड बनाएँ और शॉर्ट लिंक सहित शेयर करें
              </p>
            </div>

            {/* Keyword Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="सुविचार खोजें (उदा. सफलता, ईश्वर)..."
                className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800">
            {[
              { id: 'all', label: '🌟 सभी १०० सुविचार' },
              { id: 'spiritual', label: '🪔 आध्यात्मिक' },
              { id: 'motivation', label: '🚀 प्रेरणादायक' },
              { id: 'karma', label: '🌸 कर्म दर्शन' },
              { id: 'family', label: '💖 परिवार व रिश्ते' },
              { id: 'positivity', label: '🌿 सकारात्मकता' },
              { id: 'peace', label: '🧘 मानसिक शांति' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  filterCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 100 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
            {filteredSuvicharList.map((item) => {
              const isSelected = selectedSuvichar.id === item.id;
              const textToDisplay = getSuvicharText(item);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-amber-400 shadow-xl shadow-amber-500/15 ring-1 ring-amber-400/50'
                      : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-black text-amber-400 bg-black/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                        #{item.number}
                      </span>
                      <span className="text-[11px] text-stone-300 bg-stone-800/80 px-2.5 py-0.5 rounded-full border border-stone-700 font-semibold">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-100 font-serif leading-relaxed">
                      "{textToDisplay}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800/60">
                    <button
                      onClick={() => handleSelectIntoStudio(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSelected ? '✓ कार्ड पर लोड है' : 'फ़ोटो कार्ड बनाएँ'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyLink(item.id)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
                        title="पेज का शॉर्ट लिंक कॉपी करें"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSuvichar(item);
                          handleWhatsAppShare(item);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-sm"
                        title="WhatsApp पर शॉर्ट लिंक सहित भेजें"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>भेजें</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
