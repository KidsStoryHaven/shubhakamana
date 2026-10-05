import React, { useState, useRef, useEffect, useMemo } from 'react';
import { WishCategory, HindiWish } from '../data/wishesData';
import { generateWishCardBlob } from '../utils/canvasCardGenerator';
import { 
  CARD_BACKGROUNDS, 
  BACKGROUND_CATEGORIES, 
  CardBackground, 
  getDefaultBackgroundForCategory 
} from '../data/cardBackgroundsData';
import { WishFontSelector } from './WishFontSelector';
import { getWishFontById } from '../data/wishFontsData';
import { festiveAudio } from '../utils/festiveAudio';
import { getUploadedAudioFile } from '../utils/audioStorage';
import { awardUserPoints } from '../data/userStore';
import { 
  Sparkles, 
  Download, 
  Share2, 
  Copy, 
  Upload, 
  X, 
  Check, 
  Smartphone,
  MessageCircle,
  RefreshCw,
  Volume2,
  Square,
  Cake,
  PartyPopper,
  Image as ImageIcon,
  Palette,
  Shuffle,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface WishCardGeneratorProps {
  category: WishCategory;
  selectedWish: HindiWish;
  onSelectWish?: (wish: HindiWish) => void;
}

export const WishCardGenerator: React.FC<WishCardGeneratorProps> = ({
  category,
  selectedWish,
  onSelectWish
}) => {
  const isBirthday = category.slug.includes('birthday');

  // Birthday Person details (if on a birthday page)
  const [birthdayPersonName, setBirthdayPersonName] = useState(() => {
    try {
      return localStorage.getItem('shubhakamna_bday_person_name') || 'आकाश';
    } catch {
      return 'आकाश';
    }
  });

  const [birthdayPersonPhoto, setBirthdayPersonPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('shubhakamna_bday_person_photo') || null;
    } catch {
      return null;
    }
  });

  const [isPlayingSong, setIsPlayingSong] = useState(false);

  // Sender Name (प्रेषक)
  const [senderName, setSenderName] = useState(() => {
    try {
      return localStorage.getItem('shubhakamna_my_name') || '';
    } catch {
      return '';
    }
  });

  // User / General Photo (for non-birthday categories)
  const [userPhoto, setUserPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('shubhakamna_my_photo') || null;
    } catch {
      return null;
    }
  });

  // Background selection state (130+ Professional Backgrounds)
  const [selectedBackground, setSelectedBackground] = useState<CardBackground>(() => 
    getDefaultBackgroundForCategory(category.slug)
  );
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [bgCategoryFilter, setBgCategoryFilter] = useState<string>('all');
  const [bgSearchQuery, setBgSearchQuery] = useState<string>('');
  const [isBgPickerExpanded, setIsBgPickerExpanded] = useState<boolean>(true);

  // Font Selection State
  const [selectedFontId, setSelectedFontId] = useState<string>('rozha');

  // Update background when category changes
  useEffect(() => {
    setSelectedBackground(getDefaultBackgroundForCategory(category.slug));
    setCustomBgUrl(null);
  }, [category.slug]);

  const [customText, setCustomText] = useState(selectedWish.hindiText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const bdayPhotoInputRef = useRef<HTMLInputElement>(null);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Sync customText when selectedWish prop changes
  useEffect(() => {
    setCustomText(selectedWish.hindiText);
  }, [selectedWish]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      festiveAudio.stopAll();
    };
  }, []);

  // Filtered backgrounds based on active category & search query
  const filteredBackgrounds = useMemo(() => {
    let list = CARD_BACKGROUNDS;
    if (bgCategoryFilter !== 'all') {
      list = list.filter(b => b.category === bgCategoryFilter);
    }
    if (bgSearchQuery.trim()) {
      const q = bgSearchQuery.toLowerCase().trim();
      list = list.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.categoryLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bgCategoryFilter, bgSearchQuery]);

  // Generate card preview whenever inputs or background changes
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        setIsGenerating(true);
        const blob = await generateWishCardBlob({
          category,
          selectedWish,
          senderName: senderName || 'आपका शुभचिंतक',
          userPhotoUrl: userPhoto,
          customMessage: customText,
          birthdayPersonName: isBirthday ? birthdayPersonName : undefined,
          birthdayPersonPhotoUrl: isBirthday ? birthdayPersonPhoto : undefined,
          background: selectedBackground,
          customBackgroundUrl: customBgUrl,
          font: getWishFontById(selectedFontId)
        });
        if (active) {
          const url = URL.createObjectURL(blob);
          setPreviewBlobUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
        }
      } catch (err) {
        console.error('Failed to generate preview blob:', err);
      } finally {
        if (active) setIsGenerating(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    category, 
    selectedWish, 
    senderName, 
    userPhoto, 
    customText, 
    birthdayPersonName, 
    birthdayPersonPhoto, 
    isBirthday,
    selectedBackground,
    customBgUrl,
    selectedFontId
  ]);

  // Birthday Song Toggle
  const handleToggleBirthdaySong = () => {
    if (isPlayingSong) {
      festiveAudio.stopAll();
      setIsPlayingSong(false);
    } else {
      setIsPlayingSong(true);
      const nameToSing = birthdayPersonName.trim() || 'आप';
      festiveAudio.playPersonalizedBirthdaySong(nameToSing, () => {
        setIsPlayingSong(false);
      });
    }
  };

  const [effectiveCategoryAudio, setEffectiveCategoryAudio] = useState<string | undefined>(category.customAudioUrl);

  useEffect(() => {
    let active = true;
    if (category.customAudioUrl) {
      setEffectiveCategoryAudio(category.customAudioUrl);
    } else {
      getUploadedAudioFile(`wish_${category.slug}`).then((stored) => {
        if (active && stored) {
          setEffectiveCategoryAudio(stored);
        }
      });
    }
    return () => { active = false; };
  }, [category.slug, category.customAudioUrl]);

  // General Festive Audio Toggle (Flute, Shehnai, Aarti, Fireworks, Colors, Custom MP3)
  const handleToggleCategorySound = () => {
    if (isPlayingSong) {
      festiveAudio.stopAll();
      setIsPlayingSong(false);
    } else {
      setIsPlayingSong(true);
      const isHoli = category.slug.includes('holi');
      const isDiwali = category.slug.includes('diwali');
      const isNewYear = category.slug.includes('newyear') || category.slug.includes('new-year');
      const soundType = category.soundType || (isHoli ? 'colors' : (isDiwali || isNewYear) ? 'fireworks' : isBirthday ? 'birthday' : 'flute');
      festiveAudio.playSoundForFestival(soundType, effectiveCategoryAudio || category.customAudioUrl, senderName || 'आप');
    }
  };

  const handleBdayPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setBirthdayPersonPhoto(dataUrl);
      try {
        localStorage.setItem('shubhakamna_bday_person_photo', dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBdayPhoto = () => {
    setBirthdayPersonPhoto(null);
    try {
      localStorage.removeItem('shubhakamna_bday_person_photo');
    } catch {}
    if (bdayPhotoInputRef.current) bdayPhotoInputRef.current.value = '';
  };

  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setUserPhoto(dataUrl);
      try {
        localStorage.setItem('shubhakamna_my_photo', dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUserPhoto = () => {
    setUserPhoto(null);
    try {
      localStorage.removeItem('shubhakamna_my_photo');
    } catch {}
    if (userPhotoInputRef.current) userPhotoInputRef.current.value = '';
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setCustomBgUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * CARD_BACKGROUNDS.length);
    setSelectedBackground(CARD_BACKGROUNDS[randomIndex]);
    setCustomBgUrl(null);
  };

  const handleBdayNameChange = (val: string) => {
    setBirthdayPersonName(val);
    try {
      localStorage.setItem('shubhakamna_bday_person_name', val);
    } catch {}
  };

  const handleSenderNameChange = (val: string) => {
    setSenderName(val);
    try {
      localStorage.setItem('shubhakamna_my_name', val);
    } catch {}
  };

  const handleDownloadImage = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateWishCardBlob({
        category,
        selectedWish,
        senderName: senderName || 'आपका शुभचिंतक',
        userPhotoUrl: userPhoto,
        customMessage: customText,
        birthdayPersonName: isBirthday ? birthdayPersonName : undefined,
        birthdayPersonPhotoUrl: isBirthday ? birthdayPersonPhoto : undefined,
        background: selectedBackground,
        customBackgroundUrl: customBgUrl
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = (isBirthday ? birthdayPersonName : senderName || 'Shubhakamna').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `${category.slug}-${safeName}-card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      awardUserPoints('download_card', category.nameHi);
    } catch (err) {
      alert('इमेज डाउनलोड करने में समस्या आई, कृपया पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = async () => {
    awardUserPoints('whatsapp_share', category.nameHi);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
    const pageUrl = `${origin}/${category.slug}/`;
    const fromDisplayName = senderName.trim() || 'आपके शुभचिंतक';

    let caption = '';
    if (isBirthday) {
      const bdayName = birthdayPersonName.trim() || 'दोस्त';
      caption = `🎂 *Happy Birthday ${bdayName}!* 🎈\n\n"${customText}"\n\n— *${fromDisplayName}* की ओर से जन्मदिन की अनंत शुभकामनाएं! ✨\n\n👇 ${bdayName} के नाम का स्पेशल बर्थडे गाना व कार्ड यहाँ देखें:\n${pageUrl}`;
    } else {
      caption = `🪔 *${category.nameHi}* 🪔\n\n"${customText}"\n\n— *${fromDisplayName}* की ओर से हार्दिक शुभकामनाएं ✨\n\n👇 अपने नाम का सुंदर कार्ड यहाँ बनाएं:\n${pageUrl}`;
    }

    if (navigator.share && previewBlobUrl) {
      try {
        const file = new File(
          [await (await fetch(previewBlobUrl)).blob()],
          `${category.slug}-card.png`,
          { type: 'image/png' }
        );
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: category.seoTitle,
            text: caption,
            files: [file]
          });
          return;
        }
      } catch {}
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(caption)}`;
    window.open(waUrl, '_blank');
  };

  const handleFacebookShare = () => {
    awardUserPoints('whatsapp_share', category.nameHi);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
    const pageUrl = `${origin}/${category.slug}/`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    awardUserPoints('link_copy', category.nameHi);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
    const pageUrl = `${origin}/${category.slug}/`;
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    });
  };

  return (
    <div id="card-generator" className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 border-b border-stone-800 pb-4">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xl shadow-inner">
          {isBirthday ? <Cake className="w-5 h-5 text-amber-400 animate-bounce" /> : <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>{isBirthday ? 'बर्थडे स्पेशल: नाम व फोटो वाला 9:16 विशिंग कार्ड' : 'अपने नाम, फोटो व पसंदीदा बैकग्राउंड का 9:16 विशिंग कार्ड बनाएं'}</span>
            <span className="text-[11px] font-sans font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              100% मुफ़्त
            </span>
          </h2>
          <p className="text-xs text-stone-400">
            {isBirthday 
              ? 'जिसका जन्मदिन है उसका नाम लिखें, 108+ लक्ज़री बैकग्राउंड्स में से चुनें, फोटो लगाएं और गाना बजाएं!'
              : '108+ प्रोफ़ेशनल बैकग्राउंड्स में से अपना पसंदीदा चुनें और WhatsApp स्टेटस के लिए 1-क्लिक HD कार्ड बनाएं'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* SPECIAL BIRTHDAY SECTION */}
          {isBirthday && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-amber-950/30 border border-pink-500/30 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <PartyPopper className="w-4 h-4 text-pink-400" />
                  <span>जिसका जन्मदिन है उसकी जानकारी (Birthday Boy/Girl):</span>
                </span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold">
                  स्पेशल
                </span>
              </div>

              {/* 1. Birthday Person's Name */}
              <div>
                <label className="block text-xs font-bold text-stone-200 mb-1">
                  1. जिसका जन्मदिन है उसका नाम (Birthday Person's Name) *
                </label>
                <input
                  type="text"
                  value={birthdayPersonName}
                  onChange={e => handleBdayNameChange(e.target.value)}
                  placeholder="उदा. आकाश, पूजा, राहुल, रिया..."
                  maxLength={40}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-pink-500/40 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-pink-400 text-sm font-bold transition shadow-inner"
                />
              </div>

              {/* 2. Birthday Person's Photo Upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-300">
                    2. जिसका जन्मदिन है उसकी फ़ोटो (Birthday Photo):
                  </label>
                  {birthdayPersonPhoto && (
                    <button
                      type="button"
                      onClick={handleRemoveBdayPhoto}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> फ़ोटो हटाएं
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    ref={bdayPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBdayPhotoUpload}
                    className="hidden"
                    id="bday-photo-upload"
                  />
                  <label
                    htmlFor="bday-photo-upload"
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-pink-500/40 text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0"
                  >
                    <Upload className="w-4 h-4 text-pink-400" />
                    <span>{birthdayPersonPhoto ? 'दूसरी फ़ोटो चुनें' : 'बर्थडे वाले की फ़ोटो चुनें'}</span>
                  </label>

                  {birthdayPersonPhoto && (
                    <div className="flex items-center gap-2">
                      <img
                        src={birthdayPersonPhoto}
                        alt="Birthday Person"
                        className="w-10 h-10 rounded-full object-cover border-2 border-pink-400 shadow-md"
                      />
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> फ़ोटो लग गई
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Personalized Birthday Song Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleToggleBirthdaySong}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-lg active:scale-98 ${
                    isPlayingSong
                      ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white'
                  }`}
                >
                  {isPlayingSong ? (
                    <>
                      <Square className="w-4 h-4 fill-white" />
                      <span>⏹ गाना बंद करें ({birthdayPersonName || 'आकाश'})</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4.5 h-4.5 animate-bounce" />
                      <span>
                        🎵 {birthdayPersonName || 'आकाश'} के नाम का स्पेशल बर्थडे गाना बजाएं (Play Song)
                      </span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-pink-300/80 text-center mt-1">
                  🔊 गाना: <em>"Happy Birthday to you, Happy Birthday to {birthdayPersonName || 'आकाश'}..."</em>
                </p>
              </div>
            </div>
          )}

          {/* SENDER'S NAME (प्रेषक) */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
              {isBirthday ? '3. भेजने वाले का नाम (प्रेषक - Your Name):' : '1. अपना नाम लिखें (Your Name):'}
            </label>
            <input
              type="text"
              value={senderName}
              onChange={e => handleSenderNameChange(e.target.value)}
              placeholder="उदा. राहुल शर्मा, अमित, पूजा..."
              maxLength={40}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm font-medium transition"
            />
          </div>

          {/* PHOTO UPLOAD FOR NON-BIRTHDAY CARDS */}
          {!isBirthday && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  2. अपनी फोटो लगाएं (वैकल्पिक):
                </label>
                {userPhoto && (
                  <button
                    type="button"
                    onClick={handleRemoveUserPhoto}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> फोटो हटाएं
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  ref={userPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUserPhotoUpload}
                  className="hidden"
                  id="photo-upload-input"
                />
                <label
                  htmlFor="photo-upload-input"
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shrink-0"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>{userPhoto ? 'दूसरी फोटो चुनें' : 'गैलरी से फोटो चुनें'}</span>
                </label>

                {userPhoto && (
                  <div className="flex items-center gap-2">
                    <img
                      src={userPhoto}
                      alt="Preview"
                      className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
                    />
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> फोटो जोड़ी गई
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 🌟 108+ PROFESSIONAL BACKGROUND SELECTOR (THE CORE USER REQUIREMENT) 🌟 */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border-2 border-amber-500/40 space-y-3.5 shadow-xl relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <span>{isBirthday ? '4. कार्ड बैकग्राउंड चुनें' : '3. कार्ड बैकग्राउंड चुनें'}</span>
                    <span className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black px-2 py-0.5 rounded-full shadow-sm">
                      108+ प्रोफ़ेशनल बैकग्राउंड्स
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    मनमोहक और प्रोफ़ेशनल डिज़ाइन्स में से अपनी पसंद का बैकग्राउंड चुनें
                  </p>
                </div>
              </div>

              {/* Action buttons: Random Surprise & Upload Custom */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectRandomBackground}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="रैंडम बैकग्राउंड बदलें"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">रैंडम चुनें</span>
                </button>

                <input
                  ref={customBgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomBgUpload}
                  className="hidden"
                  id="custom-bg-upload-input"
                />
                <button
                  type="button"
                  onClick={() => customBgInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  title="अपनी फ़ोटो बैकग्राउंड में लगाएँ"
                >
                  <Upload className="w-3.5 h-3.5 text-stone-950" />
                  <span>अपना बैकग्राउंड</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBgPickerExpanded(!isBgPickerExpanded)}
                  className="text-stone-400 hover:text-white p-1"
                  title={isBgPickerExpanded ? 'संक्षिप्त करें' : 'पूरा खोलें'}
                >
                  {isBgPickerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Custom Background Active Notification */}
            {customBgUrl && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <strong>आपकी कस्टम फ़ोटो बैकग्राउंड में सक्रिय है</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setCustomBgUrl(null)}
                  className="text-stone-400 hover:text-rose-400 text-xs underline cursor-pointer"
                >
                  डिफ़ॉल्ट पर लौटें
                </button>
              </div>
            )}

            {isBgPickerExpanded && (
              <div className="space-y-3 pt-1">
                {/* Search bar inside background picker */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={bgSearchQuery}
                    onChange={(e) => setBgSearchQuery(e.target.value)}
                    placeholder="बैकग्राउंड खोजें (उदा. मंदिर, दीप, गुलाब, गोल्ड, रंग, भोर, पार्टी)..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                  {bgSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setBgSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Categories Filter Tabs (9 Categories) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
                  {BACKGROUND_CATEGORIES.map(cat => {
                    const isSelected = bgCategoryFilter === cat.id;
                    const count = cat.id === 'all' 
                      ? CARD_BACKGROUNDS.length 
                      : CARD_BACKGROUNDS.filter(b => b.category === cat.id).length;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setBgCategoryFilter(cat.id)}
                        className={`px-3 py-1 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 font-medium ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-amber-500/40'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[10px] px-1.5 rounded-full ${
                          isSelected ? 'bg-black/25 text-stone-950' : 'bg-stone-800 text-stone-400'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Grid of Background Thumbnails (108+ Choices) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-700">
                  {filteredBackgrounds.map(bg => {
                    const isSelected = !customBgUrl && selectedBackground.id === bg.id;

                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => {
                          setSelectedBackground(bg);
                          setCustomBgUrl(null);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-[9/14] border-2 transition-all cursor-pointer group text-left ${
                          isSelected
                            ? 'border-amber-400 shadow-lg shadow-amber-500/30 scale-102 ring-2 ring-amber-400/50'
                            : 'border-stone-800 hover:border-amber-400/60 opacity-85 hover:opacity-100'
                        }`}
                      >
                        {/* Background Thumbnail Image or Gradient */}
                        {bg.type === 'image' ? (
                          <img
                            src={bg.url}
                            alt={bg.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div 
                            className="w-full h-full" 
                            style={{ background: bg.cssGradient }} 
                          />
                        )}

                        {/* Subtle dark gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-1.5">
                          <p className="text-[10px] text-white font-bold leading-tight truncate">
                            {bg.name}
                          </p>
                        </div>

                        {/* Active Selection Badge */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-md animate-scale-in">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {filteredBackgrounds.length === 0 && (
                  <div className="text-center py-6 text-stone-400 text-xs">
                    कोई बैकग्राउंड नहीं मिला। दूसरा कीवर्ड खोजें।
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 🔤 WISH FONT SELECTOR (USER REQUIREMENT FOR FONT OPTIONS) 🔤 */}
          {/* ========================================================================= */}
          <WishFontSelector
            selectedFontId={selectedFontId}
            onSelectFont={(font) => setSelectedFontId(font.id)}
            title={isBirthday ? '5. फॉन्ट स्टाइल चुनें (Choose Font Style)' : '4. फॉन्ट स्टाइल चुनें (Choose Font Style)'}
            subtitle="विश कार्ड के अक्षरों को अपने मनपसंद स्टाइल में सजाएं"
          />

          {/* FESTIVE SOUND PLAYER FOR NON-BIRTHDAY CARDS */}
          {!isBirthday && (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={handleToggleCategorySound}
                className={`w-full py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                  isPlayingSong
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-500/30 hover:border-amber-400'
                }`}
              >
                {isPlayingSong ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>⏹️ संगीत बंद करें (Playing...)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>
                      {category.slug.includes('diwali')
                        ? '🎆 आतिशबाजी व पटाखे फोड़ें (Diwali Fireworks & Crackers)'
                        : category.slug.includes('holi')
                        ? '🎨 रंग व गुलाल ब्लास्ट करें (Holi Color Blast & Pichkari)'
                        : `🎵 ${category.nameHi} की पावन धुन / संगीत सुनें`}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* WISH / MESSAGE SELECTOR OR CUSTOM EDIT */}
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
              {isBirthday ? '6. शुभकामना संदेश चुनें या संपादित करें:' : '5. शुभकामना संदेश चुनें या संपादित करें:'}
            </label>
            <textarea
              rows={3}
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="शुभकामना संदेश..."
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-400 text-xs leading-relaxed transition"
            />

            {/* Quick Pills from category wishes */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {category.wishes.map((w, idx) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setCustomText(w.hindiText);
                    if (onSelectWish) onSelectWish(w);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    customText === w.hindiText
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  संदेश #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex-1 min-w-[160px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp पर भेजें</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'कार्ड बन रहा है...' : 'डाउनलोड (HD)'}</span>
            </button>

            <button
              type="button"
              onClick={handleFacebookShare}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
              title="फेसबुक पर शेयर करें"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition cursor-pointer"
              title="लिंक कॉपी करें"
            >
              {copyFeedback ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copyFeedback && (
            <p className="text-xs text-emerald-400 font-semibold animate-fade-in">
              ✓ लिंक क्लिपबोर्ड पर कॉपी हो गया!
            </p>
          )}
        </div>

        {/* Right Column: Live 9:16 Mobile Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl relative bg-stone-950 flex items-center justify-center group">
            {previewBlobUrl ? (
              <img
                src={previewBlobUrl}
                alt={`${category.nameHi} कार्ड प्रीव्यू`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-4 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                <span>कार्ड तैयार हो रहा है...</span>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              </div>
            )}

            <div className="absolute bottom-2 left-2 bg-stone-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> 9:16 HD
            </div>

            {/* Current Active Background Badge */}
            <div className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] text-amber-300 font-semibold flex items-center gap-1 border border-amber-500/30">
              <ImageIcon className="w-3 h-3 text-amber-400" />
              <span>{customBgUrl ? 'कस्टम बैकग्राउंड' : selectedBackground.name}</span>
            </div>

            {isBirthday && (
              <div className="absolute top-2 right-2 bg-pink-600/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] text-white font-bold flex items-center gap-1 shadow">
                <Cake className="w-3 h-3" /> Birthday
              </div>
            )}
          </div>

          <span className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>लाइव 9:16 मोबाइल स्टेटस कार्ड प्रीव्यू</span>
          </span>
        </div>
      </div>
    </div>
  );
};
