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
  Link as LinkIcon
} from 'lucide-react';
import { 
  SuvicharItem, 
  SuvicharBackground,
  SUVICHAR_BACKGROUNDS, 
  getDaily100Suvichar, 
  getDayAndTimeFormatted,
  getTodayHindiDateString 
} from '../data/dailySuvicharData';
import { generateSuvicharCardBlob } from '../utils/generateSuvicharCard';
import { awardUserPoints } from '../data/userStore';

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
        showDayAndTime
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
            showDayAndTime
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
                className={`relative w-full max-w-[340px] sm:max-w-[390px] rounded-3xl overflow-hidden border-2 border-amber-400/90 shadow-2xl bg-black flex flex-col justify-between text-center select-none transition-all ${
                  aspectRatio === 'story' 
                    ? 'aspect-[9/16] p-4 sm:p-5' 
                    : 'min-h-[460px] sm:min-h-[500px] p-4 sm:p-5'
                }`}
                style={{
                  backgroundImage: customBgUrl
                    ? `url(${customBgUrl})`
                    : selectedBackground.type === 'image'
                      ? `url(${selectedBackground.url})`
                      : selectedBackground.cssGradient,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Dark Vignette Overlay for 100% Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/60 pointer-events-none" />

                {/* Decorative border rail */}
                <div className="absolute inset-2 border border-amber-400/35 rounded-2xl pointer-events-none" />

                {/* Card Top Branding */}
                <div className="relative z-10 space-y-1 shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-amber-400/60 text-[11px] font-extrabold text-amber-300 backdrop-blur-md shadow-md">
                    <span>✨ ॐ सूर्याय नमः • शुभ प्रभात ✨</span>
                  </div>
                  <p className="text-[10px] text-amber-200/90 font-mono font-bold">
                    दैनिक सुविचार #{selectedSuvichar.number} • {selectedSuvichar.categoryLabel}
                  </p>

                  {/* 🕒 Small Day & Time Badge on Card (जैसे: 📅 सोमवार • 07:15 AM) */}
                  {showDayAndTime && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/90 border border-amber-500/50 text-[10px] font-bold text-amber-300 backdrop-blur-md shadow-sm">
                      <Clock className="w-3 h-3 text-yellow-400" />
                      <span>{currentDayTime.badgeText}</span>
                    </div>
                  )}
                </div>

                {/* Card Center: BIG, BOLD, RAZOR-SHARP SUVICHAR TEXT */}
                <div className="relative z-10 p-3 sm:p-4 rounded-2xl bg-black/80 border-2 border-amber-400/50 backdrop-blur-md shadow-2xl my-auto">
                  <div className="text-amber-400/50 text-3xl sm:text-4xl font-serif -mb-2 leading-none">“</div>
                  <p className="text-sm sm:text-base font-black text-amber-50 font-serif leading-relaxed drop-shadow-lg">
                    {getSuvicharText(selectedSuvichar)}
                  </p>
                  <div className="text-amber-400/50 text-3xl sm:text-4xl font-serif -mt-2 text-right leading-none">”</div>
                </div>

                {/* Card Bottom: VERY LARGE USER PHOTO, NAME & MAIN WEBSITE URL (NEVER CUT OFF) */}
                <div className="relative z-10 flex flex-col items-center gap-2 pt-1 shrink-0">
                  
                  {/* 👑 Large User Photo */}
                  {senderPhoto ? (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-2xl border-2 border-yellow-300 ring-4 ring-amber-500/50">
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
                  <div className="px-3.5 py-1 rounded-xl bg-black/90 border border-amber-500/60 backdrop-blur-md shadow-md min-w-[190px]">
                    <p className="text-[9px] text-amber-300 font-bold uppercase tracking-wider">
                      ✨ सप्रेम शुभकामना प्रेषक ✨
                    </p>
                    <p className="text-xs sm:text-sm font-black text-white font-serif">
                      {senderName || 'आपका शुभचिंतक'}
                    </p>
                  </div>

                  {/* 🌐 Main Website URL Badge on Card (Zero Cut-Off!) */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/90 border border-amber-500/50 text-[10px] font-bold text-amber-300 shadow-sm">
                    <span>🌐 shubhakamna.in</span>
                  </div>

                  <p className="text-[9px] text-stone-400 font-medium">
                    🌅 दैनिक १०० शुभ प्रभात सुविचार • मुफ़्त कार्ड
                  </p>
                </div>

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
                  <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-md shrink-0">
                        <img src={senderPhoto} alt="User" className="w-full h-full rounded-full object-cover" />
                        <span className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-stone-950 text-[9px] font-black w-4 h-4 rounded-full border border-yellow-100 flex items-center justify-center">
                          ★
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-black text-amber-300">
                          ✅ आपकी बड़ी फ़ोटो कार्ड पर सेट है!
                        </p>
                        <p className="text-[10px] text-stone-300">
                          डाउनलोड व शेयर करने पर कार्ड पर यह बड़ी व स्पष्ट दिखेगी
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

              {/* 3. Language Selector for Suvichar */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                  <span>३. सुविचार की भाषा चुनें (Select Language):</span>
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

              {/* 4. Unlimited Backgrounds Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>४. बैकग्राउंड चुनें (Unlimited Backgrounds):</span>
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
