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
import { generateSuvicharCardBlob, SuvicharAspectRatio } from '../utils/generateSuvicharCard';
import { awardUserPoints } from '../data/userStore';
import { openWhatsAppUniversal } from '../utils/shareWithImageHelper';
import { ThreeDSharePreviewCard } from './ThreeDSharePreviewCard';
import { TemplateEngine, TemplateEngineId, THREE_D_TEMPLATES } from './TemplateEngine';

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
  const [aspectRatio, setAspectRatio] = useState<SuvicharAspectRatio>('9:16');
  const [selectedLang, setSelectedLang] = useState<'hindi' | 'english' | 'marathi' | 'gujarati'>('hindi');
  const [showDayAndTime, setShowDayAndTime] = useState<boolean>(true);

  // 🎨 3D Template Engine State
  const [selected3DTemplate, setSelected3DTemplate] = useState<TemplateEngineId>('royal_gold');

  // 🎨 Curated WhatsApp & Insta Suvichar Font Styles (3, 5, 6, 7)
  const [selectedStyleId, setSelectedStyleId] = useState<string>('neon_galaxy_3d');
  const [headlineWord, setHeadlineWord] = useState<string>('सुविचार');
  const [customBadge1, setCustomBadge1] = useState<string>('');
  const [customBadge2, setCustomBadge2] = useState<string>('');
  const [fontScale, setFontScale] = useState<number>(1.5);
  const [photoSizeOption, setPhotoSizeOption] = useState<number>(1.25);

  const activeStyle = useMemo(() => getSuvicharStyleById(selectedStyleId), [selectedStyleId]);

  // Handle 3D Template Selection (Curated 3D Styles)
  const handleSelect3DTemplate = (templateId: TemplateEngineId) => {
    setSelected3DTemplate(templateId);
    if (templateId === 'royal_gold' || templateId === 'cyber_neon') {
      setSelectedStyleId('neon_galaxy_3d');
    } else if (templateId === 'marble_temple') {
      setSelectedStyleId('saffron_blessing_3d');
    } else if (templateId === 'rainbow_candy' || templateId === 'crystal_glass') {
      setSelectedStyleId('crystal_glass_3d');
    } else if (templateId === 'vintage_parchment') {
      setSelectedStyleId('vintage_parchment_3d');
    }
  };

  // Background category filter
  const [bgCategoryFilter, setBgCategoryFilter] = useState<'all' | 'sunrise' | 'temple' | 'royal' | 'nature' | 'gradient'>('all');

  // List search & category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<boolean>(false);

  // Collapsible Font & Background Customizer Options (Open by default)
  const [showCustomizerOptions, setShowCustomizerOptions] = useState<boolean>(true);

  // Live Day & Time String (auto-updates every minute)
  const [currentDayTime, setCurrentDayTime] = useState(() => getDayAndTimeFormatted(selectedLang));

  // Parse Shared Link URL Parameters on Load
  const [sharedSenderName, setSharedSenderName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('n') || urlParams.get('sender') || urlParams.get('from');
      const wishNum = urlParams.get('w');
      if (name) {
        setSharedSenderName(name.trim());
        setSenderName(name.trim());
      }
      if (wishNum && !isNaN(Number(wishNum))) {
        const idx = Math.max(0, Math.min(dailySuvichars.length - 1, Number(wishNum) - 1));
        setSelectedSuvichar(dailySuvichars[idx]);
      }
    } catch {}
  }, [dailySuvichars]);

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

  // Universal WhatsApp & Native Share (Auto-downloads preview image + Shares with clean short page URL)
  const handleWhatsAppShare = async (itemToShare: SuvicharItem = selectedSuvichar) => {
    try {
      setIsSharing(true);
      const shareUrl = getShortUrl();

      // 1. Generate HD Card Image Blob
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

      // 2. ALWAYS Auto-Download Image to Device (Gallery/Downloads)
      try {
        const fileUrl = URL.createObjectURL(blob);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = fileUrl;
        downloadAnchor.download = fileName;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
        setTimeout(() => URL.revokeObjectURL(fileUrl), 4000);
      } catch (dlErr) {
        console.warn('Auto-download failed:', dlErr);
      }

      // 3. Check if Web Share API with files is supported (Android / iOS Chrome / Safari)
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: '🌅 शुभ प्रभात सुविचार',
            text: `🌅 शुभ प्रभात!\n${shareUrl}`,
            files: [file]
          });
          awardUserPoints('whatsapp_share', 'Shubh Prabhat Suvichar');
          setDownloadSuccessNotice(true);
          setTimeout(() => setDownloadSuccessNotice(false), 7000);
          return;
        } catch (shareErr: any) {
          if (shareErr?.name === 'AbortError') {
            // User just dismissed the native share sheet
            setDownloadSuccessNotice(true);
            setTimeout(() => setDownloadSuccessNotice(false), 7000);
            return;
          }
          console.warn('Native file share failed, falling back to WhatsApp link:', shareErr);
        }
      }

      // 4. Fallback: Copy clean short URL & Open WhatsApp Web / App
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {}

      const waText = `🌅 शुभ प्रभात! आज का पावन सुविचार कार्ड देखें:\n${shareUrl}`;
      openWhatsAppUniversal(waText);
      awardUserPoints('whatsapp_share', 'Shubh Prabhat Suvichar');
      setDownloadSuccessNotice(true);
      setTimeout(() => setDownloadSuccessNotice(false), 7000);
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
        
        {/* Shared Recipient Greeting Banner */}
        {sharedSenderName && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-amber-400 text-center space-y-1 shadow-xl animate-pulse my-2">
            <p className="text-xs sm:text-sm font-black text-amber-300">
              🌅 {sharedSenderName} ने आपके लिए आज का सुंदर शुभ प्रभात सुविचार कार्ड भेजा है! ✨
            </p>
            <p className="text-[11px] text-stone-200 font-medium">
              नीचे बना हुआ कार्ड देखें और 1-क्लिक में अपना नाम लिखकर जवाब भेजें ➔
            </p>
          </div>
        )}

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

            {/* 9:16 Full Screen WhatsApp Status & Story Badge */}
            <div className="flex items-center gap-1.5 bg-amber-500/20 px-3.5 py-1.5 rounded-xl border border-amber-400/50 text-amber-300 text-xs font-black shadow-md">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>📱 9:16 स्टेटस व स्टोरी (8K Ultra HD)</span>
            </div>
          </div>

          {/* 🌟 6 SPECIAL 3D MASTER VISUAL TEMPLATES SELECTOR 🌟 */}
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-black to-stone-900 border border-amber-500/40 text-left space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-extrabold text-amber-300">
                  ६ स्पेशल 3D विज़ुअल टेम्पलेट्स (Choose 3D Master Style):
                </span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
                {THREE_D_TEMPLATES.find(t => t.id === selected3DTemplate)?.badge || '✨ 3D टेम्पलेट'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
              {THREE_D_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selected3DTemplate;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelect3DTemplate(tmpl.id)}
                    className={`p-2.5 rounded-2xl text-left transition flex flex-col justify-between border cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-950/90 to-black border-amber-400 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400 scale-[1.02]'
                        : 'bg-stone-900/90 hover:bg-stone-850 border-stone-800 hover:border-amber-500/40 text-stone-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-black shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{tmpl.icon}</span>
                        <span className="text-[11px] font-black text-white leading-tight">
                          {tmpl.hindiName}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-stone-400 leading-tight line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="mt-1.5 pt-1 border-t border-stone-800/80 flex items-center justify-between text-[8.5px]">
                      <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                        {tmpl.badge}
                      </span>
                      <span className="text-xs">{tmpl.emojis.bottomRibbon?.split(' ')[0] || '✨'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Live Visual Card Preview (Zero Cut-Off Guarantee) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div 
                ref={previewCardRef}
                className="relative rounded-3xl overflow-hidden border-2 border-amber-400/90 shadow-2xl flex flex-col justify-between text-center select-none transition-all aspect-[9/16] w-full max-w-[340px] sm:max-w-[380px] p-3.5 sm:p-4 pb-2.5 sm:pb-3 mx-auto"
                style={{
                  backgroundImage: customBgUrl
                    ? `url(${customBgUrl})`
                    : selectedBackground.type === 'image' && selectedBackground.id !== 'default_plain'
                      ? `url(${selectedBackground.url})`
                      : activeStyle.cardTheme === 'royal_emerald_plates'
                        ? 'radial-gradient(circle at center, #065f46 0%, #042f2e 50%, #021a19 100%)'
                        : activeStyle.cardTheme === 'marble_temple_gold'
                          ? 'radial-gradient(circle at center, #ffffff 0%, #faf5ea 50%, #fef3c7 100%)'
                          : activeStyle.cardTheme === 'neon_galaxy_3d'
                            ? 'radial-gradient(circle at center, #1e0b36 0%, #09090b 60%, #030008 100%)'
                            : activeStyle.cardTheme === 'rainbow_candy_sunshine'
                              ? 'linear-gradient(180deg, #dbeafe 0%, #fef3c7 40%, #fce7f3 75%, #e0e7ff 100%)'
                              : activeStyle.cardTheme === 'royal_dark' || activeStyle.cardTheme === 'cosmic_gold' || activeStyle.cardTheme === 'sunrise_wood'
                                ? `radial-gradient(circle at center, ${activeStyle.bgGrad[0]}, ${activeStyle.bgGrad[1]}, ${activeStyle.bgGrad[2]})`
                                : `linear-gradient(135deg, ${activeStyle.bgGrad[0]}, ${activeStyle.bgGrad[1]}, ${activeStyle.bgGrad[2]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: activeStyle.isDarkTheme ? '#0c0a09' : '#ffffff'
                }}
              >
                {/* Vignette Overlay for Crisp Readability */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: activeStyle.cardTheme === 'marble_temple_gold'
                      ? 'linear-gradient(to top, rgba(255,255,255,0.92), rgba(255,255,255,0.5), rgba(255,255,255,0.75))'
                      : activeStyle.cardTheme === 'rainbow_candy_sunshine'
                        ? 'linear-gradient(to top, rgba(255,255,255,0.85), rgba(255,255,255,0.3), rgba(255,255,255,0.65))'
                        : activeStyle.isDarkTheme
                          ? 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.65), rgba(0,0,0,0.45))'
                          : 'linear-gradient(to top, rgba(255,255,255,0.92), rgba(255,255,255,0.7), rgba(255,255,255,0.8))'
                  }}
                />

                {/* Decorative Luxury Border Frame */}
                <div 
                  className="absolute inset-2 border-2 rounded-2xl pointer-events-none" 
                  style={{ 
                    borderColor: activeStyle.cardTheme === 'marble_temple_gold' 
                      ? '#d97706' 
                      : activeStyle.cardTheme === 'neon_galaxy_3d'
                        ? '#db2777'
                        : activeStyle.cardTheme === 'rainbow_candy_sunshine'
                          ? '#fb7185'
                          : activeStyle.isDarkTheme ? 'rgba(251, 191, 36, 0.55)' : 'rgba(217, 119, 6, 0.45)' 
                  }}
                />

                {/* 🌟 ALL CLIPARTS & HEARTS CONSOLIDATED INTO ONE TOP-RIGHT CORNER 🌟 */}
                
                {/* 1. Royal Dark / Vintage / Saffron (Styles 5 & 7): Bird + Heart + Sparkle all together in ONE corner */}
                {(activeStyle.cardTheme === 'royal_emerald_plates' || activeStyle.cardTheme === 'royal_dark') && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] select-none pointer-events-none">
                    <span className="text-2xl sm:text-3xl animate-bounce-slow">🐦🌿</span>
                    <span className="text-xl sm:text-2xl">💖</span>
                    <span className="text-xs sm:text-sm text-yellow-300">✨</span>
                  </div>
                )}

                {/* 2. Marble Temple: Lotus + Diya in ONE corner */}
                {activeStyle.cardTheme === 'marble_temple_gold' && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] select-none pointer-events-none">
                    <span className="text-xl">🪷</span>
                    <span className="text-2xl animate-pulse">🪔</span>
                    <span className="text-xs text-yellow-300">✨</span>
                  </div>
                )}

                {/* 3. Neon Galaxy 3D (Styles 3 & 6): Neon Heart + Galaxy Stars in ONE corner */}
                {activeStyle.cardTheme === 'neon_galaxy_3d' && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_0_8px_#ec4899] select-none pointer-events-none">
                    <span className="text-lg text-pink-300 animate-pulse">💖</span>
                    <span className="text-lg text-cyan-300">🌌</span>
                    <span className="text-base text-yellow-300">⭐️</span>
                    <span className="text-xs text-pink-300">✨</span>
                  </div>
                )}

                {/* 4. Rainbow / Sunshine Theme in ONE corner */}
                {activeStyle.cardTheme === 'rainbow_candy_sunshine' && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] select-none pointer-events-none">
                    <span className="text-2xl animate-bounce-slow">🌞</span>
                    <span className="text-lg">💖</span>
                    <span className="text-lg">🌸</span>
                  </div>
                )}

                {/* Card Top: 3D EMBOSSED CALLIGRAPHIC TITLE / PLAQUE */}
                <div className="relative z-10 space-y-1.5 shrink-0 pt-2">
                  <div className="relative py-1 flex items-center justify-center">
                    {activeStyle.cardTheme === 'marble_temple_gold' ? (
                      /* Marble Jharokha 3D Gold Plaque (Image 2) */
                      <div className="px-6 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-2 border-amber-500 shadow-[0_4px_12px_rgba(180,83,9,0.3),inset_0_2px_4px_rgba(255,255,255,0.8)]">
                        <span 
                          className="text-3xl sm:text-5xl font-black tracking-widest"
                          style={{
                            fontFamily: activeStyle.fontFamily,
                            background: 'linear-gradient(180deg, #78350f 0%, #b45309 40%, #d97706 70%, #92400e 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                          }}
                        >
                          {headlineWord?.trim() || activeStyle.defaultHeadline || 'सुविचार'}
                        </span>
                      </div>
                    ) : activeStyle.cardTheme === 'neon_galaxy_3d' ? (
                      /* Cosmic Neon Chalk Plaque (Image 3) */
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-mono tracking-widest text-pink-300/90 filter drop-shadow-[0_0_6px_#f472b6]">
                          ✦ {headlineWord?.trim() || activeStyle.defaultHeadline || 'HINDI SUVICHAR'} ✦
                        </span>
                        <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
                      </div>
                    ) : activeStyle.cardTheme === 'rainbow_candy_sunshine' ? (
                      /* 3D Rainbow Sunshine Heading (Image 4) */
                      <span 
                        className="text-4xl sm:text-6xl font-black tracking-wide"
                        style={{
                          fontFamily: activeStyle.fontFamily,
                          color: '#ffffff',
                          textShadow: '0 1px 0 #f472b6, 0 2px 0 #ec4899, 0 3px 0 #db2777, 0 4px 0 #be185d, 0 5px 0 #831843, 0 8px 16px rgba(0,0,0,0.95)'
                        }}
                      >
                        {headlineWord?.trim() || activeStyle.defaultHeadline || 'सुविचार'}
                      </span>
                    ) : (
                      /* Giant 24K 3D Gold Embossed Title */
                      <span 
                        className="text-4xl sm:text-6xl font-black tracking-wide"
                        style={{
                          fontFamily: activeStyle.fontFamily,
                          color: '#fef08a',
                          textShadow: '0 1px 0 #fde047, 0 2px 0 #f59e0b, 0 3px 0 #d97706, 0 4px 0 #b45309, 0 5px 0 #78350f, 0 6px 0 #451a03, 0 8px 18px rgba(0,0,0,0.95)'
                        }}
                      >
                        {headlineWord?.trim() || activeStyle.defaultHeadline || 'सुविचार'}
                      </span>
                    )}
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

                {/* Card Center: BADE BADE 3D TEXT & COLORFUL BADGES */}
                {(() => {
                  const activeText = getSuvicharText(selectedSuvichar);
                  const parsed = parseSuvicharContent(activeText, customBadge1, customBadge2);
                  const b1 = customBadge1 || parsed.badge1;
                  const b2 = customBadge2 || parsed.badge2;
                  const hWord = headlineWord ? headlineWord.trim() : '';

                  return (
                    <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-1.5 px-1 space-y-2 my-auto">
                      {/* 🌟 DYNAMIC MULTI-LINE 3D COLORFUL TEXT RENDERING (AUTO-ADJUSTED, CRISP 3D) 🌟 */}
                      {(() => {
                        const rawClean = activeText
                          .replace(/["“”'‘’]/g, '')
                          .replace(/\s+/g, ' ')
                          .trim();

                        if (!rawClean) return null;

                        const words = rawClean.split(' ');
                        const lines: string[] = [];
                        const targetWordsPerLine = Math.max(3, Math.ceil(words.length / (words.length > 14 ? 3 : 2)));
                        let currentLine: string[] = [];

                        for (let i = 0; i < words.length; i++) {
                          currentLine.push(words[i]);
                          const isPunctuationEnd = /[।!?,\n]$/.test(words[i]);

                          if (currentLine.length >= targetWordsPerLine || (isPunctuationEnd && currentLine.length >= 2)) {
                            lines.push(currentLine.join(' '));
                            currentLine = [];
                          }
                        }
                        if (currentLine.length > 0) {
                          if (lines.length > 0 && currentLine.length <= 2) {
                            lines[lines.length - 1] += ' ' + currentLine.join(' ');
                          } else {
                            lines.push(currentLine.join(' '));
                          }
                        }

                        const finalLines = lines.length > 0 ? lines : [rawClean];

                        // Neon glow styles (Image 3 style)
                        const neonStyles = [
                          { color: '#ffffff', shadow: '0 0 10px #f472b6, 0 0 22px #ec4899, 0 0 35px #be185d, 0 2px 4px #000' },
                          { color: '#f0fdfa', shadow: '0 0 10px #38bdf8, 0 0 20px #06b6d4, 0 0 30px #0891b2, 0 2px 4px #000' },
                          { color: '#fefce8', shadow: '0 0 10px #fde047, 0 0 20px #f59e0b, 0 0 30px #d97706, 0 2px 4px #000' },
                          { color: '#fdf2f8', shadow: '0 0 10px #fb7185, 0 0 20px #e11d48, 0 0 30px #9f1239, 0 2px 4px #000' }
                        ];

                        // Smart auto font size calibrated strictly for 9:16 card width (340-380px)
                        const charCount = rawClean.length;
                        let baseFontSize = 21;
                        if (charCount <= 40) {
                          baseFontSize = 23;
                        } else if (charCount <= 75) {
                          baseFontSize = 20.5;
                        } else if (charCount <= 120) {
                          baseFontSize = 17.5;
                        } else {
                          baseFontSize = 15;
                        }
                        const finalFontSizePx = Math.round(baseFontSize * (fontScale ? fontScale / 1.3 : 1.15));

                        if (activeStyle.cardTheme === 'rainbow_candy_sunshine') {
                          const rainbowColors = [
                            {
                              color: '#fef08a',
                              shadow: '0 1px 0 #fde047, 0 2px 0 #eab308, 0 3px 0 #ca8a04, 0 4px 0 #a16207, 0 5px 0 #713f12, 0 8px 16px rgba(0,0,0,0.95)'
                            },
                            {
                              color: '#ffffff',
                              shadow: '0 1px 0 #f472b6, 0 2px 0 #ec4899, 0 3px 0 #db2777, 0 4px 0 #be185d, 0 5px 0 #831843, 0 8px 16px rgba(0,0,0,0.95)'
                            },
                            {
                              color: '#67e8f9',
                              shadow: '0 1px 0 #22d3ee, 0 2px 0 #06b6d4, 0 3px 0 #0891b2, 0 4px 0 #0e7490, 0 5px 0 #155e75, 0 8px 16px rgba(0,0,0,0.95)'
                            },
                            {
                              color: '#86efac',
                              shadow: '0 1px 0 #4ade80, 0 2px 0 #22c55e, 0 3px 0 #16a34a, 0 4px 0 #15803d, 0 5px 0 #14532d, 0 8px 16px rgba(0,0,0,0.95)'
                            }
                          ];

                          return (
                            <div className="w-full space-y-2 py-1 text-center bg-transparent">
                              {finalLines.map((ln, idx) => {
                                const cStyle = rainbowColors[idx % rainbowColors.length];
                                return (
                                  <p
                                    key={idx}
                                    className="font-black tracking-wide"
                                    style={{
                                      fontSize: `${finalFontSizePx}px`,
                                      lineHeight: 1.45,
                                      fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', serif",
                                      color: cStyle.color,
                                      textShadow: cStyle.shadow
                                    }}
                                  >
                                    {ln}
                                  </p>
                                );
                              })}
                            </div>
                          );
                        }

                        if (activeStyle.cardTheme === 'neon_galaxy_3d') {
                          return (
                            <div className="w-full space-y-2 py-1 text-center bg-transparent">
                              {finalLines.map((ln, idx) => {
                                const nStyle = neonStyles[idx % neonStyles.length];
                                return (
                                  <p
                                    key={idx}
                                    className="font-black tracking-wide"
                                    style={{
                                      fontSize: `${finalFontSizePx}px`,
                                      lineHeight: 1.45,
                                      fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', sans-serif",
                                      color: nStyle.color,
                                      textShadow: nStyle.shadow
                                    }}
                                  >
                                    {ln}
                                  </p>
                                );
                              })}
                            </div>
                          );
                        }

                        if (activeStyle.cardTheme === 'marble_temple_gold') {
                          return (
                            <div className="w-full space-y-2 py-1 text-center bg-transparent">
                              {finalLines.map((ln, idx) => (
                                <p
                                  key={idx}
                                  className="font-black tracking-wide"
                                  style={{
                                    fontSize: `${finalFontSizePx}px`,
                                    lineHeight: 1.45,
                                    fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', serif",
                                    color: idx % 2 === 0 ? '#451a03' : '#78350f',
                                    textShadow: '0 1px 0 #fef08a, 0 2px 0 #fde047, 0 3px 0 #ca8a04, 0 5px 10px rgba(0,0,0,0.2)'
                                  }}
                                >
                                  {ln}
                                </p>
                              ))}
                            </div>
                          );
                        }

                        if (activeStyle.cardTheme === 'royal_emerald_plates') {
                          // Clean, pure 3D Gold & Rose multi-layer typography for user's actual suvichar
                          return (
                            <div className="w-full space-y-2 py-1 text-center bg-transparent">
                              {finalLines.map((ln, idx) => {
                                const isPink = idx % 3 === 1;
                                const isWhite = idx % 3 === 2;
                                return (
                                  <p
                                    key={idx}
                                    className="font-black tracking-wide"
                                    style={{
                                      fontSize: `${finalFontSizePx}px`,
                                      lineHeight: 1.45,
                                      fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', serif",
                                      color: isPink ? '#f472b6' : isWhite ? '#ffffff' : '#fef08a',
                                      textShadow: isPink
                                        ? '0 1px 0 #db2777, 0 2px 0 #be185d, 0 3px 0 #9d174d, 0 4px 0 #500724, 0 8px 16px rgba(0,0,0,0.95)'
                                        : isWhite
                                          ? '0 1px 0 #000000, 0 2px 4px rgba(0,0,0,0.95), 0 4px 10px rgba(0,0,0,0.85)'
                                          : '0 1px 0 #fde047, 0 2px 0 #f59e0b, 0 3px 0 #d97706, 0 4px 0 #b45309, 0 5px 0 #78350f, 0 6px 0 #451a03, 0 8px 18px rgba(0,0,0,0.95)'
                                    }}
                                  >
                                    {ln}
                                  </p>
                                );
                              })}

                              {/* Bottom Center Gold Flourish */}
                              <div className="pt-1 text-amber-400 text-sm filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none">
                                ⚜️ 💛 ⚜️
                              </div>
                            </div>
                          );
                        }

                        // Default 3D High Contrast
                        return (
                          <div className="w-full space-y-2 py-1 text-center bg-transparent">
                            {finalLines.map((ln, idx) => (
                              <p
                                key={idx}
                                className="font-black tracking-wide"
                                style={{
                                  fontSize: `${finalFontSizePx}px`,
                                  lineHeight: 1.45,
                                  fontFamily: activeStyle.fontFamily,
                                  color: activeStyle.textColor,
                                  textShadow: activeStyle.isDarkTheme
                                    ? '0 4px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)'
                                    : '0 2px 10px rgba(255,255,255,0.98), 0 1px 3px rgba(0,0,0,0.35)'
                                }}
                              >
                                {ln}
                              </p>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Bottom Ornament / Emoji Bar (e.g. 😄 🙏 🌞 ✨ 🌸 🦋) */}
                      <div className="text-base sm:text-lg opacity-95 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                        {activeStyle.ornament}
                      </div>

                    </div>
                  );
                })()}

                {/* Card Bottom: VIRTUE TAGS, ROUND USER PHOTO, SENDER PLATE & WEBSITE NAME (Never Cut Off) */}
                {(() => {
                  const activeText = getSuvicharText(selectedSuvichar);
                  const parsed = parseSuvicharContent(activeText, customBadge1, customBadge2);
                  const b1 = customBadge1 || parsed.badge1;
                  const b2 = customBadge2 || parsed.badge2;

                  return (
                    <div className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5 pt-0.5 pb-1 shrink-0 w-full">
                      
                      {/* 🏷️ Virtue Badge Pill */}
                      <div 
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] sm:text-[9.5px] font-bold shadow-sm backdrop-blur-md"
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
                          className="relative rounded-full p-0.5 sm:p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-xl border-2 border-yellow-300 ring-2 ring-amber-500/50 transition-all duration-300 shrink-0"
                          style={{
                            width: photoSizeOption <= 0.85 ? '44px' : photoSizeOption <= 1.0 ? '52px' : photoSizeOption <= 1.25 ? '62px' : '72px',
                            height: photoSizeOption <= 0.85 ? '44px' : photoSizeOption <= 1.0 ? '52px' : photoSizeOption <= 1.25 ? '62px' : '72px'
                          }}
                        >
                          <img
                            src={senderPhoto}
                            alt={senderName}
                            crossOrigin="anonymous"
                            className="w-full h-full rounded-full object-cover border-2 border-stone-950"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 bg-amber-500 text-stone-950 text-[9px] font-black w-4 h-4 rounded-full border border-yellow-100 shadow-md flex items-center justify-center">
                            ★
                          </span>
                        </div>
                      ) : null}

                      {/* Sender Name Plate */}
                      <div 
                        className="rounded-xl backdrop-blur-md shadow-md border px-3 py-1 min-w-[150px] max-w-[85%] text-center"
                        style={{
                          backgroundColor: activeStyle.isDarkTheme ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                          borderColor: activeStyle.isDarkTheme ? '#f59e0b' : '#d97706'
                        }}
                      >
                        <p 
                          className="text-[8px] font-bold uppercase tracking-wider"
                          style={{ color: activeStyle.isDarkTheme ? '#fde68a' : '#92400e' }}
                        >
                          ✨ सप्रेम शुभकामना प्रेषक ✨
                        </p>
                        <p 
                          className="font-black font-serif text-xs sm:text-sm truncate"
                          style={{ color: activeStyle.isDarkTheme ? '#ffffff' : '#1c1917' }}
                        >
                          {senderName || 'आपका शुभचिंतक'}
                        </p>
                      </div>

                      {/* 🌐 Website & Brand Name on Card (Auto-Adjusted, Zero Cut-Off Guarantee) */}
                      <div 
                        className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border shadow-md font-black tracking-wide text-[9.5px] sm:text-[10px] max-w-[90%]"
                        style={{
                          background: activeStyle.isDarkTheme 
                            ? 'linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)' 
                            : 'linear-gradient(180deg, #ffffff 0%, #fef3c7 100%)',
                          borderColor: '#f59e0b',
                          color: activeStyle.isDarkTheme ? '#fef08a' : '#92400e'
                        }}
                      >
                        <span className="truncate">🌐 shubhakamna.in • दैनिक सुविचार</span>
                      </div>
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

              {/* 🎨 Collapsible Accordion Toggle for Extra Font Styles & Background Options (Minimized by default for 1-second ultra-fast loading) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomizerOptions(!showCustomizerOptions)}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 hover:from-amber-900/90 hover:to-amber-900/90 border-2 border-amber-500/50 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-between transition cursor-pointer shadow-lg active:scale-98"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>🎨 फ़ॉन्ट स्टाइल बदलें (स्टाइल ३, ५, ६, ७)</span>
                  </span>
                  <span className="text-[11px] bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded-full font-black shadow">
                    {showCustomizerOptions ? '▲ छिपाएँ' : '▼ खोलें'}
                  </span>
                </button>
              </div>

              {showCustomizerOptions && (
                <div className="space-y-4 pt-1 animate-fadeIn">
                  {/* 🎨 3. CURATED SUVICHAR CARD & FONT STYLES (3, 5, 6, 7) */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-black/60 border border-amber-500/40">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>३. फ़ॉन्ट व स्टेटस स्टाइल चुनें (स्टाइल ३, ५, ६, ७):</span>
                  </label>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold">
                    {activeStyle.hindiName}
                  </span>
                </div>

                <p className="text-[11px] text-stone-400">
                  पसंदीदा 3D फ़ॉन्ट स्टाइल चुनें (नंबर ३, ५, ६, ७):
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
            </div>
          )}

              {/* 3. 3D Soft & Royal Gradients Selector (Directly Open & Accessible) */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-black/60 border border-amber-500/40">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>३. 3D सॉफ्ट व रॉयल ग्रेडिएंट चुनें (Select 3D Gradient):</span>
                  </label>
                  <button
                    onClick={() => customBgInputRef.current?.click()}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ अपनी गैलरी से फ़ोटो</span>
                  </button>
                </div>

                <p className="text-[11px] text-stone-400">
                  हल्के, रॉयल व 3D ग्रेडिएंट्स (जिससे टेक्स्ट एकदम साफ़ और चमकदार 3D दिखे):
                </p>

                {customBgUrl && (
                  <div className="flex items-center justify-between bg-amber-950/40 border border-amber-500/30 rounded-xl p-2 text-xs">
                    <span className="text-amber-300 flex items-center gap-1.5 font-bold">
                      <span>🖼️</span>
                      <span>आपकी कस्टम बैकग्राउंड फ़ोटो एक्टिव है!</span>
                    </span>
                    <button
                      onClick={() => setCustomBgUrl(null)}
                      className="text-red-400 hover:text-red-300 underline text-[11px] font-bold"
                    >
                      हटाएँ ✕
                    </button>
                  </div>
                )}

                {/* Horizontal Scrollable 3D Gradients Grid */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-stone-800">
                  {SUVICHAR_BACKGROUNDS.map((bg) => {
                    const isSel = !customBgUrl && selectedBackground.id === bg.id;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => {
                          setCustomBgUrl(null);
                          setSelectedBackground(bg);
                        }}
                        className={`shrink-0 w-28 h-16 rounded-2xl overflow-hidden border-2 transition cursor-pointer relative shadow-md group ${
                          isSel ? 'border-amber-400 ring-2 ring-amber-400 scale-105 shadow-amber-500/30' : 'border-stone-800 opacity-80 hover:opacity-100 hover:border-amber-500/40'
                        }`}
                        title={bg.name}
                      >
                        <div className="w-full h-full" style={{ background: bg.cssGradient }} />
                        <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[8.5px] font-black text-amber-300 truncate px-1 py-0.5 text-center">
                          {bg.name}
                        </span>
                        {isSel && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-black shadow">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
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
                showButtons={false}
              />

              {/* 5. Main Clean 2 Action Buttons: 1. WhatsApp & Social Share with Image + Magic Link, 2. HD Card Download */}
              <div className="pt-2 space-y-3">
                {/* 1. Share on WhatsApp / Social with Image & Magic Link Message */}
                <button
                  onClick={() => handleWhatsAppShare()}
                  disabled={isSharing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-green-900/40 transform active:scale-98 transition cursor-pointer disabled:opacity-50 border border-green-400/40"
                >
                  {isSharing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>जादुई स्टेटस व लिंक शेयर हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5 text-white animate-bounce" />
                      <span>🚀 WhatsApp व सोशल मीडिया पर शेयर करें (फ़ोटो व जादुई लिंक)</span>
                    </>
                  )}
                </button>

                {/* 2. Download HD Card Image */}
                <button
                  onClick={handleDownloadCard}
                  disabled={isDownloading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/30 transition cursor-pointer disabled:opacity-50 border border-yellow-200"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-stone-950" />
                      <span>HD सुविचार फ़ोटो कार्ड बन रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 text-stone-950" />
                      <span>🖼️ HD सुविचार फ़ोटो कार्ड डाउनलोड करें (Free)</span>
                    </>
                  )}
                </button>
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
