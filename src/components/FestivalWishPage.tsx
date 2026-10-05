import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Festival } from '../data/festivals';
import { FestiveCanvas } from './FestiveCanvas';
import { festiveAudio } from '../utils/festiveAudio';
import { SurpriseUnbox } from './SurpriseUnbox';
import { StickyViralBar } from './StickyViralBar';
import { StatusShareModal } from './StatusShareModal';
import { VideoStatusModal } from './VideoStatusModal';
import { FestivalImageSlider } from './FestivalImageSlider';
import { FestivalKathaAudioSection } from './FestivalKathaAudioSection';
import { StickyKathaMiniPlayer } from './StickyKathaMiniPlayer';
import { WishFontSelector } from './WishFontSelector';
import { getWishFontById } from '../data/wishFontsData';
import { 
  CARD_BACKGROUNDS, 
  BACKGROUND_CATEGORIES, 
  CardBackground, 
  getDefaultBackgroundForCategory 
} from '../data/cardBackgroundsData';
import { DivineDeitySlide } from '../data/divineGodsData';
import { getStoredFestivals, getStoredDeitySlides, saveStoredDeitySlides } from '../data/festivalStore';
import { resolveDirectImageUrl, resolveDirectAudioUrl, fetchPhotosFromGoogleDriveFolder } from '../utils/googleDriveHelper';
import { AdBanner } from './AdBanner';
import { YouTubeStatsBar } from './YouTubeStatsBar';
import { awardUserPoints } from '../data/userStore';
import { recordFestivalView, recordFestivalShare } from '../data/festivalEngagementStore';
import { createShortWishUrl, parseWishUrl, isDefaultSenderName } from '../utils/shortUrl';
import { generateStatusCardBlob } from '../utils/generateStatusCard';
import { updatePageSEO, getFestivalSEOMetadata } from '../utils/seoManager';
import { 
  SUPPORTED_LANGUAGES, 
  LanguageCode, 
  getFestivalTranslation 
} from '../data/translations';
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
  Download,
  Languages,
  Globe,
  Eye,
  Gift,
  Loader2,
  Trophy,
  Play,
  Pause,
  PartyPopper,
  Film,
  Edit3,
  Palette,
  Shuffle,
  Search
} from 'lucide-react';
import { getUploadedAudioFile } from '../utils/audioStorage';

interface FestivalWishPageProps {
  festival: Festival;
  initialSenderName?: string;
  initialLang?: string;
  onBackToPortal: () => void;
  onSelectAnotherFestival: (f: Festival) => void;
  allFestivals: Festival[];
}

export const FestivalWishPage: React.FC<FestivalWishPageProps> = ({
  festival: initialFestival,
  initialSenderName = '',
  initialLang = '',
  onBackToPortal,
  onSelectAnotherFestival,
  allFestivals
}) => {
  const [festival, setFestival] = useState<Festival>(() => {
    const all = getStoredFestivals();
    return all.find(f => f.id === initialFestival.id || f.slug === initialFestival.slug) || initialFestival;
  });

  useEffect(() => {
    const all = getStoredFestivals();
    const updated = all.find(f => f.id === initialFestival.id || f.slug === initialFestival.slug);
    if (updated) setFestival(updated);
    else setFestival(initialFestival);
    // Record YouTube-style view for this festival
    recordFestivalView(initialFestival.id);
  }, [initialFestival]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const birthdayFileInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const isBirthday = festival.id === 'birthday' || festival.soundType === 'birthday' || festival.slug.includes('birthday');

  // Surprise Unbox Overlay (Auto-triggers if opened from shared WhatsApp link ?from=...)
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return !!(urlParams.get('from') || urlParams.get('name') || urlParams.get('surprise'));
    } catch {
      return false;
    }
  });

  const [senderName, setSenderName] = useState(() => {
    if (initialSenderName) return initialSenderName;
    try {
      const parsed = parseWishUrl(window.location.search);
      if (parsed.senderName) return parsed.senderName;
      return localStorage.getItem('shubhakamna_my_name') || 'आपका शुभचिंतक';
    } catch {
      return 'आपका शुभचिंतक';
    }
  });

  // Birthday Person State (जिसका जन्मदिन है उसका नाम - e.g. आकाश)
  const [birthdayPerson, setBirthdayPerson] = useState<string>(() => {
    try {
      const parsed = parseWishUrl(window.location.search);
      if (parsed.birthdayPerson) return parsed.birthdayPerson;
      return localStorage.getItem('shubhakamna_birthday_person') || 'आकाश';
    } catch {
      return 'आकाश';
    }
  });

  const [inputBirthdayPerson, setInputBirthdayPerson] = useState(birthdayPerson);

  // Birthday Person Photo (जिसका जन्मदिन है उसकी फोटो)
  const [birthdayPhoto, setBirthdayPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('shubhakamna_birthday_photo') || null;
    } catch {
      return null;
    }
  });

  const [isPlayingBirthdaySong, setIsPlayingBirthdaySong] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);

  // Subscribe to song playback changes
  useEffect(() => {
    const unsub = festiveAudio.onBirthdaySongStatusChange((playing) => {
      setIsPlayingBirthdaySong(playing);
    });
    return unsub;
  }, []);

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
  const [isGenerating8K, setIsGenerating8K] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [statusModalImage, setStatusModalImage] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Font Style state (User requirement for font selection options)
  const [selectedFontId, setSelectedFontId] = useState<string>('rozha');
  const currentFont = getWishFontById(selectedFontId);

  // Background state (User requirement for 130+ professional backgrounds)
  const [selectedBg, setSelectedBg] = useState<CardBackground>(() => 
    getDefaultBackgroundForCategory(festival.slug || festival.id)
  );
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [bgCategoryFilter, setBgCategoryFilter] = useState<string>('all');
  const [bgSearchQuery, setBgSearchQuery] = useState<string>('');
  const [isBgPickerExpanded, setIsBgPickerExpanded] = useState<boolean>(false);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Filtered backgrounds for festival card
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

  const handleSelectRandomBackground = () => {
    const rand = CARD_BACKGROUNDS[Math.floor(Math.random() * CARD_BACKGROUNDS.length)];
    setSelectedBg(rand);
    setCustomBgUrl(null);
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomBgUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getResolvedDeitySlides = (fest: Festival): DivineDeitySlide[] => {
    const rawSlides = getStoredDeitySlides(fest.id);
    const resolvedHero = resolveDirectImageUrl(fest.heroImage);

    if (rawSlides && rawSlides.length > 0) {
      const validSlides = rawSlides
        .filter(s => s && s.imageUrl && typeof s.imageUrl === 'string' && s.imageUrl.trim().length > 0)
        .map(s => ({
          ...s,
          imageUrl: resolveDirectImageUrl(s.imageUrl)
        }));

      if (validSlides.length > 0) {
        return validSlides;
      }
    }

    if (resolvedHero) {
      return [
        {
          id: `${fest.id}-hero-custom`,
          godName: fest.nameHi,
          title: fest.greetingTitle || fest.nameHi,
          tagline: fest.taglineHi || 'पावन ईश्वरीय दर्शन',
          badge: fest.badge || '✨ पावन दर्शन',
          mantra: fest.mantraOrShloka || '॥ ॐ श्रीं ह्रीं क्लीं ॥',
          imageUrl: resolvedHero
        }
      ];
    }
    return [];
  };

  const [deitySlides, setDeitySlides] = useState<DivineDeitySlide[]>(() => getResolvedDeitySlides(festival));

  // 🔄 Automatic Google Drive Folder Live-Sync (Fetches latest photos whenever folder is updated)
  useEffect(() => {
    const festGdriveUrl = festival.gdriveFolderUrl || (festival.id === 'dhammachakra_pravartan' ? 'https://drive.google.com/drive/folders/1gU8In8_FP6pbh7HTCvtr8tM8mAIqbZpo' : undefined);
    
    if (festGdriveUrl) {
      let isMounted = true;
      fetchPhotosFromGoogleDriveFolder(festGdriveUrl, festival.nameHi)
        .then(res => {
          if (isMounted && res.success && res.photos.length > 0) {
            const driveSlides: DivineDeitySlide[] = res.photos.map((p, idx) => ({
              id: p.id,
              godName: festival.nameHi,
              title: p.title || `${festival.nameHi} • पावन दर्शन #${idx + 1}`,
              tagline: p.tagline || festival.taglineHi || 'पावन दर्शन',
              badge: idx === 0 ? '✨ मुख्य दर्शन' : '☸️ पावन दर्शन',
              mantra: festival.mantraOrShloka || '॥ नमो बुद्धाय जय भीम ॥',
              imageUrl: p.imageUrl
            }));
            
            setDeitySlides(driveSlides);
            saveStoredDeitySlides(festival.id, driveSlides);
          }
        })
        .catch(err => {
          console.warn('Auto GDrive live sync error:', err);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [festival.id, festival.gdriveFolderUrl, festival.nameHi, festival.taglineHi, festival.mantraOrShloka]);

  useEffect(() => {
    const handleDataChanged = () => {
      const all = getStoredFestivals();
      const updated = all.find(f => f.id === initialFestival.id || f.slug === initialFestival.slug);
      const currentFest = updated || initialFestival;
      if (updated) setFestival(updated);
      setDeitySlides(getResolvedDeitySlides(currentFest));
    };
    handleDataChanged();
    window.addEventListener('shubhakamna_data_changed', handleDataChanged);
    return () => window.removeEventListener('shubhakamna_data_changed', handleDataChanged);
  }, [initialFestival.id, initialFestival.slug]);

  const safeActiveIndex = (activeImageIndex >= 0 && activeImageIndex < deitySlides.length) ? activeImageIndex : 0;
  const activeHeroImage = deitySlides[safeActiveIndex]?.imageUrl || festival.heroImage;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [festival.id]);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copiedWishIndex, setCopiedWishIndex] = useState<number | null>(null);
  const [pointToast, setPointToast] = useState<{ message: string; points: number } | null>(null);

  // Multilingual Wish Language State
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(() => {
    if (initialLang && SUPPORTED_LANGUAGES.some(l => l.code === initialLang)) {
      return initialLang as LanguageCode;
    }
    try {
      const parsed = parseWishUrl(window.location.search);
      if (parsed.lang && SUPPORTED_LANGUAGES.some(l => l.code === parsed.lang)) {
        return parsed.lang as LanguageCode;
      }
      return (localStorage.getItem('shubhakamna_wish_lang') as LanguageCode) || 'hi';
    } catch {
      return 'hi';
    }
  });

  const activeTranslation = getFestivalTranslation(festival.id, selectedLanguage);

  const [effectiveAudioUrl, setEffectiveAudioUrl] = useState<string | undefined>(festival.customAudioUrl);

  useEffect(() => {
    let active = true;
    if (festival.customAudioUrl) {
      setEffectiveAudioUrl(festival.customAudioUrl);
    } else {
      getUploadedAudioFile(`fest_${festival.id}`).then((stored) => {
        if (active && stored) {
          setEffectiveAudioUrl(stored);
        }
      });
    }
    return () => { active = false; };
  }, [festival.id, festival.customAudioUrl]);

  const getFestiveSoundButtonLabel = () => {
    if (isBirthday) {
      return `🎵 ${birthdayPerson} का स्पेशल बर्थडे गाना सुनें`;
    }
    if (festival.soundType === 'fireworks' || festival.particlesType === 'fireworks' || festival.id.includes('diwali')) {
      return '🎆 आतिशबाजी व पटाखे फोड़ें (Fireworks & Sound)';
    }
    if (festival.soundType === 'colors' || festival.particlesType === 'colors' || festival.id.includes('holi')) {
      return '🎨 रंग व गुलाल ब्लास्ट करें (Holi Color Blast & Sound)';
    }
    if (festival.soundType === 'damru') {
      return '🔱 महादेव का डमरू व ॐ नाद (Tap for Damru Beats)';
    }
    if (festival.soundType === 'flute') {
      return '🪈 कान्हा की पावन बांसुरी (Divine Flute)';
    }
    if (festival.soundType === 'dhol') {
      return '🥁 उत्सव ढोल-ताशा व नगाड़ा (Festive Dhol)';
    }
    if (festival.soundType === 'shehnai') {
      return '🎺 मंगल शहनाई की मधुर धुन (Mangal Shehnai)';
    }
    if (festival.soundType === 'shankh') {
      return '🐚 पावन शंखनाद (Holy Shankh)';
    }
    return '🪔 पावन घंटी व आरती की गूंज (Temple Bells)';
  };

  const triggerFestivalSound = (sampleName?: string) => {
    if (isBirthday) {
      festiveAudio.playPersonalizedBirthdaySong(sampleName || birthdayPerson);
    } else {
      festiveAudio.playSoundForFestival(
        festival.soundType, 
        effectiveAudioUrl || festival.customAudioUrl, 
        sampleName || senderName
      );
    }
  };

  const handleLanguageChange = (code: LanguageCode) => {
    setSelectedLanguage(code);
    try {
      localStorage.setItem('shubhakamna_wish_lang', code);
    } catch {
      // Ignored
    }
    triggerFestivalSound();
    updatePageSEO(getFestivalSEOMetadata(festival, senderName, code));
  };

  useEffect(() => {
    festiveAudio.setMuted(isSoundMuted);
  }, [isSoundMuted]);

  // Automatically pause background dhun when Navratri Katha starts playing
  useEffect(() => {
    const handleKathaStart = () => {
      setIsSoundMuted(true);
      festiveAudio.setMuted(true);
      festiveAudio.stopAll();
    };

    window.addEventListener('shubhakamna_katha_started', handleKathaStart);
    return () => {
      window.removeEventListener('shubhakamna_katha_started', handleKathaStart);
    };
  }, []);

  // Full Dynamic SEO, OpenGraph, Twitter Cards & JSON-LD
  useEffect(() => {
    updatePageSEO(getFestivalSEOMetadata(festival, senderName, selectedLanguage));
  }, [festival, senderName, selectedLanguage]);

  const handleSoundToggle = () => {
    const nextMuted = !isSoundMuted;
    setIsSoundMuted(nextMuted);
    festiveAudio.setMuted(nextMuted);
    if (!nextMuted) {
      triggerFestivalSound();
    }
  };

  const handleToggleBirthdaySong = () => {
    if (isPlayingBirthdaySong) {
      festiveAudio.stopBirthdaySong();
    } else {
      festiveAudio.playPersonalizedBirthdaySong(birthdayPerson);
    }
  };

  const handleBlowCandles = () => {
    const nextState = !candlesLit;
    setCandlesLit(nextState);
    if (candlesLit) {
      festiveAudio.playPartyCheer();
    } else {
      festiveAudio.playTempleBell();
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
      triggerFestivalSound();
      
      // Update dynamic SEO & URL with new sender name
      updatePageSEO(getFestivalSEOMetadata(festival, clean, selectedLanguage));
      const cleanUrl = createShortWishUrl(clean, festival.id, selectedLanguage, isBirthday ? birthdayPerson : undefined);
      try {
        window.history.replaceState({ festivalId: festival.id, senderName: clean, birthdayPerson: isBirthday ? birthdayPerson : undefined }, '', cleanUrl);
      } catch {}
    }
  };

  const handleApplyBirthdayDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBday = inputBirthdayPerson.trim() || 'आकाश';
    const cleanSender = inputName.trim() || senderName;
    setBirthdayPerson(cleanBday);
    setSenderName(cleanSender);
    try {
      localStorage.setItem('shubhakamna_birthday_person', cleanBday);
      localStorage.setItem('shubhakamna_my_name', cleanSender);
    } catch {}

    // Immediately play the personalized birthday song with their name!
    festiveAudio.playPersonalizedBirthdaySong(cleanBday);

    // Update dynamic SEO & URL
    updatePageSEO(getFestivalSEOMetadata(festival, cleanSender, selectedLanguage));
    const cleanUrl = createShortWishUrl(cleanSender, festival.id, selectedLanguage, cleanBday);
    try {
      window.history.replaceState({ festivalId: festival.id, senderName: cleanSender, birthdayPerson: cleanBday }, '', cleanUrl);
    } catch {}
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

  const handleBirthdayPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setBirthdayPhoto(dataUrl);
      try {
        localStorage.setItem('shubhakamna_birthday_photo', dataUrl);
      } catch {}
      festiveAudio.playPartyCheer();
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

  const handleRemoveBirthdayPhoto = () => {
    setBirthdayPhoto(null);
    try {
      localStorage.removeItem('shubhakamna_birthday_photo');
    } catch {}
  };

  // Generate the clean, short viral share link
  const getShareUrl = () => {
    return createShortWishUrl(senderName, festival.id, selectedLanguage, isBirthday ? birthdayPerson : undefined);
  };

  const handleWhatsAppShare = () => {
    triggerFestivalSound();
    const url = getShareUrl();
    const displayName = isDefaultSenderName(senderName) ? 'शुभचिंतक' : senderName;
    const text = isBirthday
      ? `🎂 *Happy Birthday ${birthdayPerson}!* 🎈🎉\n\n"${activeTranslation.greetingPoem || festival.defaultPoem}"\n\n— *${displayName}* की ओर से जन्मदिन की हार्दिक शुभकामनाएँ ✨\n\n👇 आपके नाम का बर्थडे स्पेशल सॉन्ग व कार्ड यहाँ देखें:\n${url}`
      : activeTranslation.whatsappMessage(displayName, url, !!userPhoto);
    
    // Award loyalty reward points
    const res = awardUserPoints('whatsapp_share', festival.nameHi);
    if (res.awarded) {
      setPointToast({ message: `+${res.points} पॉइंट्स मिले! कुल अंक: ${res.newTotal} 🎉`, points: res.points });
      setTimeout(() => setPointToast(null), 4000);
    }

    const waUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    const webWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = waUrl;
    } else {
      window.open(webWaUrl, '_blank');
    }
  };

  // Direct WhatsApp Status Share with 8K Ultra-HD Photo Card
  const handleWhatsAppStatusShare = async () => {
    setIsGenerating8K(true);
    triggerFestivalSound();

    // Award loyalty reward points for status
    const res = awardUserPoints('status_share', festival.nameHi);
    if (res.awarded) {
      setPointToast({ message: `📸 स्टेटस शेयर पर +${res.points} अंक मिले! कुल: ${res.newTotal} pts 🎉`, points: res.points });
      setTimeout(() => setPointToast(null), 4000);
    }

    const url = getShareUrl();
    const displayName = isDefaultSenderName(senderName) ? 'शुभचिंतक' : senderName;
    const caption = isBirthday
      ? `🎂 *Happy Birthday ${birthdayPerson}!* 🎈🎉\n\n"${activeTranslation.greetingPoem || festival.defaultPoem}"\n\n— *${displayName}* की ओर से जन्मदिन की हार्दिक शुभकामनाएँ ✨\n\n👇 आपके नाम का बर्थडे स्पेशल सॉन्ग व कार्ड यहाँ देखें:\n${url}`
      : `🪔 *${activeTranslation.greetingTitle}* 🪔\n\n"${activeTranslation.greetingPoem}"\n\n— *${displayName}* की ओर से हार्दिक शुभकामनाएँ ✨\n\n👇 अपने नाम का जादुई कार्ड यहाँ बनाएँ:\n${url}`;

    try {
      // 1. Generate 8K / 4K Ultra-HD status card
      const blob = await generateStatusCardBlob({
        festival,
        senderName,
        userPhoto,
        birthdayPerson: isBirthday ? birthdayPerson : undefined,
        birthdayPhoto: isBirthday ? birthdayPhoto : undefined,
        poem: activeTranslation.greetingPoem || festival.defaultPoem,
        greetingTitle: activeTranslation.greetingTitle || festival.nameHi,
        heroImageOverride: activeHeroImage,
        background: selectedBg,
        customBackgroundUrl: customBgUrl,
        font: currentFont
      });

      const fileName = isBirthday ? `Happy-Birthday-${birthdayPerson}-8K.jpg` : `Shubhakamna-8K-Status-${senderName}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      // 2. Direct Mobile Web Share (Native WhatsApp Status attachment)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: isBirthday ? `Happy Birthday ${birthdayPerson}` : activeTranslation.greetingTitle,
          text: caption
        });
        setIsGenerating8K(false);
        return;
      }

      // 3. Fallback for Desktop / non-file WebShare: Auto download & show Status modal
      const dataUrl = URL.createObjectURL(blob);
      setStatusModalImage(dataUrl);

      const downloadLink = document.createElement('a');
      downloadLink.download = fileName;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      try {
        await navigator.clipboard.writeText(caption);
      } catch {}

      setIsStatusModalOpen(true);
    } catch (err) {
      console.warn('Status card generation notice:', err);
    } finally {
      setIsGenerating8K(false);
    }
  };

  const handleScrollToNameInput = () => {
    nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nameInputRef.current?.focus();
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);

      const res = awardUserPoints('link_copy', festival.nameHi);
      if (res.awarded) {
        setPointToast({ message: `🔗 लिंक कॉपी पर +${res.points} अंक मिले! कुल: ${res.newTotal} pts 🎉`, points: res.points });
        setTimeout(() => setPointToast(null), 4000);
      }
    });
  };

  const handleCopyTextWish = (text: string, index: number) => {
    navigator.clipboard.writeText(`${text}\n\n— Shubhakamna.in`).then(() => {
      setCopiedWishIndex(index);
      setTimeout(() => setCopiedWishIndex(null), 2000);
    });
  };

  // 1-Click Generate and Download Combined 8K Photo Card
  const handleDownloadPhotoCard = async () => {
    setIsDownloadingCard(true);
    triggerFestivalSound();

    try {
      const blob = await generateStatusCardBlob({
        festival,
        senderName,
        userPhoto,
        birthdayPerson: isBirthday ? birthdayPerson : undefined,
        birthdayPhoto: isBirthday ? birthdayPhoto : undefined,
        poem: activeTranslation.greetingPoem || festival.defaultPoem,
        greetingTitle: activeTranslation.greetingTitle || festival.nameHi,
        heroImageOverride: activeHeroImage,
        background: selectedBg,
        customBackgroundUrl: customBgUrl,
        font: currentFont
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = isBirthday ? `Happy-Birthday-${birthdayPerson}-8K.jpg` : `Shubhakamna-8K-Card-${festival.id}-${senderName}.jpg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      awardUserPoints('download_card', festival.nameHi);
    } catch (err) {
      console.error('Canvas export error:', err);
    } finally {
      setIsDownloadingCard(false);
    }
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

      {/* Hidden File Input for Birthday Celebrant Photo */}
      <input
        type="file"
        ref={birthdayFileInputRef}
        accept="image/*"
        onChange={handleBirthdayPhotoUpload}
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
            {/* Surprise Gift Unbox Replay Button */}
            <button
              onClick={() => {
                setIsSurpriseOpen(true);
                festiveAudio.playTempleBell();
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="जादुई गिफ्ट बॉक्स देखें"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">गिफ्ट बॉक्स</span>
            </button>

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

      {/* 🎧 Upper Sticky / Floating Festival Katha Mini Player Shortcut */}
      <StickyKathaMiniPlayer festivalId={festival.id} festivalTitle={festival.nameHi} />

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
        
        {/* YouTube-Style Live Video Engagement Stats Bar (Views, Likes, Shares) */}
        <YouTubeStatsBar
          festivalId={festival.id}
          festivalTitle={festival.nameHi}
          variant="page"
          onShareClick={() => {
            recordFestivalShare(festival.id);
            handleWhatsAppShare();
          }}
        />

        <div className={`relative overflow-hidden rounded-3xl border-2 ${festival.themeColor.border} bg-gradient-to-b ${festival.themeColor.gradient} p-5 sm:p-7 shadow-2xl ${festival.themeColor.glow} text-center`}>
          
          {/* Dynamic Professional Background Image Layer */}
          {(customBgUrl || (selectedBg?.type === 'image' && selectedBg.url)) && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none z-0 opacity-45 scale-105 blur-[0.5px]"
                style={{ backgroundImage: `url(${customBgUrl || selectedBg.url})` }}
              />
              <div 
                className={`absolute inset-0 pointer-events-none z-0 ${
                  selectedBg.overlayStyle === 'amber'
                    ? 'bg-gradient-to-b from-stone-950/80 via-amber-950/65 to-stone-950/95'
                    : selectedBg.overlayStyle === 'royal'
                    ? 'bg-gradient-to-b from-stone-950/80 via-purple-950/70 to-stone-950/95'
                    : selectedBg.overlayStyle === 'mystic'
                    ? 'bg-gradient-to-b from-stone-950/80 via-blue-950/70 to-stone-950/95'
                    : 'bg-gradient-to-b from-stone-950/80 via-stone-900/70 to-stone-950/95'
                }`} 
              />
            </>
          )}

          {/* Dynamic Professional Gradient Layer */}
          {selectedBg?.type === 'gradient' && selectedBg.cssGradient && !customBgUrl && (
            <div 
              className="absolute inset-0 transition-all duration-700 pointer-events-none z-0 opacity-70"
              style={{ background: selectedBg.cssGradient }}
            />
          )}

          {/* Interactive Festive Canvas Overlay */}
          <FestiveCanvas 
            type={festival.particlesType} 
            interactive={true} 
            onTap={() => triggerFestivalSound()} 
          />

          <div className="relative z-20 pointer-events-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBirthday ? `🎂 Happy Birthday ${birthdayPerson}` : festival.badge}</span>
            </div>

            {/* Tap for sound prompt */}
            <div className="mb-2">
              <button
                type="button"
                onClick={() => triggerFestivalSound()}
                className="text-xs text-amber-200 hover:text-white bg-black/60 hover:bg-black/80 px-4 py-1.5 rounded-full border border-amber-500/40 hover:border-amber-400 inline-flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-bold">{getFestiveSoundButtonLabel()}</span>
              </button>
            </div>

            {/* 1. If BIRTHDAY: Dedicated Celebrant Photo Frame with Golden Crown */}
            {isBirthday ? (
              <div className="my-4 flex flex-col items-center justify-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 flex-wrap">
                  
                  {/* Celebrant Photo (बड़ा व स्पष्ट) */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {/* Golden Birthday Crown */}
                      <div className="text-4xl sm:text-5xl text-center -mb-3 select-none animate-bounce">
                        👑
                      </div>
                      <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl p-2 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-2xl shadow-amber-500/40 border-2 border-yellow-300">
                        {birthdayPhoto ? (
                          <img
                            src={birthdayPhoto}
                            alt={birthdayPerson}
                            className="w-full h-full rounded-2xl object-cover border-4 border-stone-950 shadow-inner"
                          />
                        ) : (
                          <div className="w-full h-full rounded-2xl bg-stone-900 border-4 border-stone-950 flex flex-col items-center justify-center text-amber-300 p-3 text-center">
                            <span className="text-4xl sm:text-5xl mb-1">🎂</span>
                            <span className="text-xs sm:text-sm text-stone-200 font-bold">जन्मदिन वाले की फोटो</span>
                            <span className="text-[10px] text-stone-400 mt-1">नीचे बटन से फोटो लगाएँ</span>
                          </div>
                        )}

                        {birthdayPhoto && (
                          <button
                            onClick={handleRemoveBirthdayPhoto}
                            title="फोटो हटाएँ"
                            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-2 text-xs shadow-lg cursor-pointer transition border border-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Celebrant Name Ribbon */}
                    <div className="mt-3 flex flex-col items-center gap-1.5">
                      <span className="text-sm sm:text-base text-yellow-300 font-black bg-black/80 px-5 py-1.5 rounded-full border border-yellow-400/50 shadow-xl">
                        🎂 {birthdayPerson} (जन्मदिन)
                      </span>
                      <button
                        type="button"
                        onClick={() => birthdayFileInputRef.current?.click()}
                        className="text-xs text-amber-300 hover:text-white underline flex items-center gap-1.5 cursor-pointer font-bold mt-0.5 bg-stone-900/80 px-3 py-1 rounded-xl border border-stone-800"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>{birthdayPhoto ? 'फोटो बदलें' : 'जन्मदिन वाले की फोटो लगाएँ 📷'}</span>
                      </button>
                    </div>
                  </div>

                  {/* If Sender also added their photo in Birthday mode, show sender photo */}
                  {userPhoto && (
                    <div className="flex flex-col items-center">
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-3xl p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-2xl shadow-amber-500/30">
                        <img
                          src={userPhoto}
                          alt={senderName}
                          className="w-full h-full rounded-2xl object-cover border-4 border-stone-950"
                        />
                        <button
                          onClick={handleRemovePhoto}
                          title="फोटो हटाएँ"
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 text-xs shadow-md cursor-pointer transition border border-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-2.5 flex flex-col items-center gap-1">
                        <span className="text-xs sm:text-sm text-amber-300 font-bold bg-black/80 px-3.5 py-1 rounded-full border border-amber-500/40">
                          💐 प्रेषक: {senderName}
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] text-amber-300 hover:text-white underline cursor-pointer"
                        >
                          प्रेषक फोटो बदलें
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              /* Regular Festival Artwork Slideshow & Photo */
              <>
                <div className="my-3">
                  <FestivalImageSlider
                    slides={deitySlides}
                    currentIndex={safeActiveIndex}
                    onSelectIndex={(idx) => setActiveImageIndex(idx)}
                    festivalName={festival.nameHi}
                  />
                </div>

                {/* Sender Photo Card - Big, Clean, Elegant Portrait */}
                {userPhoto ? (
                  <div className="flex flex-col items-center justify-center my-4">
                    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl p-2 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-2xl shadow-amber-500/40 border-2 border-yellow-300 animate-pulse">
                      <img
                        src={userPhoto}
                        alt={senderName}
                        className="w-full h-full rounded-2xl object-cover border-4 border-stone-950 shadow-inner"
                      />
                      <button
                        onClick={handleRemovePhoto}
                        title="फोटो हटाएँ"
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-2 text-xs shadow-lg cursor-pointer transition border border-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-amber-200 font-extrabold bg-stone-900/90 px-4 py-1.5 rounded-full border border-amber-400/50 shadow-lg">
                        ✨ {senderName} (शुभकामना प्रेषक) ✨
                      </span>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-amber-300 hover:text-white underline font-bold bg-stone-900/80 px-3 py-1 rounded-xl border border-stone-700 cursor-pointer"
                      >
                        फोटो बदलें
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="my-3 flex justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-400/50 text-amber-200 text-xs sm:text-sm font-bold transition cursor-pointer shadow-md"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>अपनी बड़ी फोटो जोड़ें (Upload Your Photo) 📷</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 2. Birthday Interactive Cake & Candle Blowing (Only on Birthday) */}
            {isBirthday && (
              <div className="my-3 p-3 rounded-2xl bg-black/60 border border-pink-500/30 backdrop-blur-md shadow-xl text-center space-y-1.5">
                <div className="flex items-center justify-center gap-4 text-xl sm:text-2xl animate-pulse">
                  <span>{candlesLit ? '🔥' : '💨'}</span>
                  <span>{candlesLit ? '🔥' : '💨'}</span>
                  <span>{candlesLit ? '🔥' : '💨'}</span>
                </div>
                <div className="text-4xl sm:text-5xl drop-shadow-md select-none">
                  🎂
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleBlowCandles}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <PartyPopper className="w-3.5 h-3.5 text-stone-950" />
                    <span>{candlesLit ? '🎂 मोमबत्तियाँ बुझाएँ व केक काटें (Blow Candles)' : '🕯️ पुनः मोमबत्तियाँ जलाएँ'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. Birthday Personalized Song Player (Singing name: Happy Birthday to Akash!) */}
            {isBirthday && (
              <div className="my-3 space-y-2">
                <button
                  type="button"
                  onClick={handleToggleBirthdaySong}
                  className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl transition cursor-pointer ${
                    isPlayingBirthdaySong
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white shadow-pink-900/50 animate-pulse'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/50 hover:scale-[1.02] active:scale-98'
                  }`}
                >
                  {isPlayingBirthdaySong ? (
                    <>
                      <Pause className="w-5 h-5 text-yellow-300 animate-spin" />
                      <span>🛑 गाना बंद करें (बज रहा है: Happy Birthday to {birthdayPerson}...)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 text-yellow-300 fill-current animate-bounce" />
                      <span>🎂 {birthdayPerson} के नाम का बर्थडे सॉन्ग बजाएँ 🎵</span>
                    </>
                  )}
                </button>
                
                {/* Animated Equalizer Wave when playing */}
                {isPlayingBirthdaySong && (
                  <div className="flex items-center justify-center gap-1 py-1">
                    <span className="w-1.5 h-6 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-8 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-10 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="w-1.5 h-7 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></span>
                    <span className="w-1.5 h-5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></span>
                  </div>
                )}
                <p className="text-[11px] text-pink-200 font-mono text-center">
                  🎶 "Happy birthday to you, happy birthday to you, happy birthday to {birthdayPerson}, happy birthday to you!"
                </p>
              </div>
            )}

            {/* Multilingual Language Switcher Bar */}
            <div className="my-3 p-2.5 rounded-2xl bg-black/60 border border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-1 mb-2 px-1 text-xs text-amber-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                  <span>अपनी भाषा में विश भेजें (Select Language):</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">9 भाषाएँ</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-2.5 py-1 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold shadow-md shadow-amber-500/30 scale-105'
                          : 'bg-stone-900/90 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sender Royal Plate */}
            <div className="my-2 py-3 px-4 rounded-2xl bg-black/50 border border-amber-500/30 backdrop-blur-sm shadow-inner">
              <p className="text-xs text-amber-200/80 tracking-wide font-medium">✨ स्नेह एवं सम्मान सहित प्रेषित ✨</p>
              <h2 
                className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-tight drop-shadow-md mt-1 transition-all"
                style={{ fontFamily: currentFont.fontFamily }}
              >
                {senderName}
              </h2>
              <p className="text-[11px] text-amber-300/70 mt-0.5">
                {isBirthday ? `की ओर से ${birthdayPerson} को जन्मदिन की लख-लख बधाई` : 'की ओर से आपको एवं आपके पूरे परिवार को'}
              </p>
            </div>

            {/* 📢 Mobile-First Quick "Change Name" Button directly below Sender Name Plate */}
            <div className="mt-2.5 mb-2">
              <button
                type="button"
                onClick={handleScrollToNameInput}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition transform active:scale-95 cursor-pointer border-2 border-yellow-200 animate-pulse"
              >
                <Edit3 className="w-4 h-4 text-stone-950" />
                <span>👇 आप भी अपने नाम से ऐसी विश भेजें (यहाँ नाम बदलें) ✨</span>
              </button>
            </div>

            {/* Festival Grand Title */}
            <h1 
              className="text-2xl sm:text-4xl font-extrabold text-white mt-3 leading-tight drop-shadow-lg transition-all"
              style={{ fontFamily: currentFont.fontFamily }}
            >
              {isBirthday ? `🎉 Happy Birthday ${birthdayPerson}! 🎉` : activeTranslation.greetingTitle}
            </h1>

            {/* Poetic Message */}
            <div 
              className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-stone-100 text-sm sm:text-base leading-relaxed text-center transition-all"
              style={{ fontFamily: currentFont.fontFamily }}
            >
              "{activeTranslation.greetingPoem}"
            </div>

            {/* Sacred Mantra / Shloka if available */}
            {festival.mantraOrShloka && (
              <div 
                className="mt-3 p-3 rounded-lg bg-black/40 border border-yellow-500/20 text-yellow-300/90 text-xs sm:text-sm italic transition-all"
                style={{ fontFamily: currentFont.fontFamily }}
              >
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

            {/* Hidden Input for Custom Festival Background Upload */}
            <input
              ref={customBgInputRef}
              type="file"
              accept="image/*"
              onChange={handleCustomBgUpload}
              className="hidden"
            />

            {/* 🔤 1. WISH FONT SELECTOR (Choose Font Style) */}
            <div className="mt-5 text-left">
              <WishFontSelector
                selectedFontId={selectedFontId}
                onSelectFont={(font) => setSelectedFontId(font.id)}
                title="🔤 फॉन्ट स्टाइल चुनें (Choose Font Style)"
                subtitle="विश व बधाई के अक्षरों को अपने पसंदीदा स्टाइल में सजाएँ"
              />
            </div>

            {/* 🎨 2. 130+ PROFESSIONAL FESTIVAL BACKGROUNDS SELECTOR */}
            <div className="mt-4 p-4 rounded-2xl bg-black/85 border-2 border-amber-500/40 text-left space-y-3.5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-amber-300">
                        🎨 मनमोहक बैकग्राउंड चुनें
                      </h3>
                      <span className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black px-2 py-0.5 rounded-full shadow-sm">
                        130+ HD विकल्प
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      {customBgUrl ? '✅ आपकी कस्टम फोटो बैकग्राउंड में लगी है' : `सक्रिय: ${selectedBg.name}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSelectRandomBackground}
                    className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="रैंडम बैकग्राउंड बदलें"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">रैंडम</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => customBgInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-sm"
                    title="गैलरी से फोटो बैकग्राउंड में लगाएं"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-stone-950" />
                    <span>कस्टम फोटो</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsBgPickerExpanded(!isBgPickerExpanded)}
                    className="text-stone-400 hover:text-white p-1 cursor-pointer"
                    title={isBgPickerExpanded ? 'कम विकल्प' : 'सभी 130+ बैकग्राउंड्स देखें'}
                  >
                    {isBgPickerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Custom background active notice */}
              {customBgUrl && (
                <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300">
                  <span>✅ आपकी फ़ोटो कार्ड बैकग्राउंड में सक्रिय है</span>
                  <button
                    type="button"
                    onClick={() => setCustomBgUrl(null)}
                    className="text-stone-400 hover:text-rose-400 underline cursor-pointer text-[11px]"
                  >
                    डिफ़ॉल्ट पर लौटें
                  </button>
                </div>
              )}

              {/* Background Picker Collapsible Panel */}
              {isBgPickerExpanded && (
                <div className="space-y-3 pt-1">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="text"
                      value={bgSearchQuery}
                      onChange={(e) => setBgSearchQuery(e.target.value)}
                      placeholder="बैकग्राउंड खोजें (उदा. मंदिर, गंगा, दीप, महल, गुलाब, भोर, रंग)..."
                      className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-400"
                    />
                    {bgSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setBgSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
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

                  {/* Thumbnails Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-700">
                    {filteredBackgrounds.map(bg => {
                      const isSelected = !customBgUrl && selectedBg.id === bg.id;

                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => {
                            setSelectedBg(bg);
                            setCustomBgUrl(null);
                          }}
                          className={`relative rounded-xl overflow-hidden aspect-[9/14] border-2 transition-all cursor-pointer group text-left ${
                            isSelected
                              ? 'border-amber-400 shadow-lg shadow-amber-500/40 scale-102 ring-2 ring-amber-400/50'
                              : 'border-stone-800 hover:border-amber-400/60 opacity-80 hover:opacity-100'
                          }`}
                        >
                          {bg.type === 'image' ? (
                            <img
                              src={bg.url}
                              alt={bg.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center text-xs font-bold text-white/90 p-1 text-center"
                              style={{ background: bg.cssGradient || '#1a1a1a' }}
                            >
                              <span>{bg.name.split(' ')[0]}</span>
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-1.5 text-[10px] text-white font-medium truncate">
                            {bg.name}
                          </div>

                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-md">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {filteredBackgrounds.length === 0 && (
                    <div className="text-center py-5 text-stone-400 text-xs">
                      कोई बैकग्राउंड नहीं मिला। दूसरा कीवर्ड खोजें।
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Name & Photo Customizer Form */}
            {isBirthday ? (
              /* Dedicated Birthday Customizer Form */
              <div className="mt-6 p-4 rounded-2xl bg-black/80 border border-pink-500/40 shadow-2xl text-left space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-800">
                  <span className="text-xl">🎂</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-pink-300">
                      जिसका बर्थडे है उसका नाम व फोटो जोड़ें:
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      नाम बदलते ही "Happy Birthday to {inputBirthdayPerson || '...'}" गाना बजेगा!
                    </p>
                  </div>
                </div>

                <form onSubmit={handleApplyBirthdayDetails} className="space-y-3">
                  {/* 1. Birthday Person Name */}
                  <div>
                    <label className="block text-xs font-bold text-pink-200 mb-1">
                      1. जिसका जन्मदिन है उनका नाम (Birthday Person Name) *
                    </label>
                    <input
                      type="text"
                      value={inputBirthdayPerson}
                      onChange={(e) => setInputBirthdayPerson(e.target.value)}
                      placeholder="उदा. आकाश, राहुल, प्रिया..."
                      maxLength={40}
                      className="w-full bg-stone-900 border border-pink-500/50 rounded-xl px-3.5 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-pink-400 font-bold"
                    />
                  </div>

                  {/* 2. Birthday Person Photo */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      2. जन्मदिन वाले की फोटो (Birthday Photo)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => birthdayFileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-700 text-xs font-semibold cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{birthdayPhoto ? 'फोटो बदलें' : 'जन्मदिन की फोटो लगाएँ 📷'}</span>
                      </button>
                      {birthdayPhoto && (
                        <button
                          type="button"
                          onClick={handleRemoveBirthdayPhoto}
                          className="text-stone-400 hover:text-red-400 text-xs cursor-pointer"
                        >
                          हटाएँ
                        </button>
                      )}
                      <span className="text-[10px] text-stone-400 ml-auto">
                        {birthdayPhoto ? '✅ फोटो लगी है' : 'वैकल्पिक'}
                      </span>
                    </div>
                  </div>

                  {/* 3. Sender Name */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      3. आपकी ओर से (विश भेजने वाले का नाम / प्रेषक)
                    </label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="उदा. राहुल, बेस्ट फ्रेंड..."
                      maxLength={40}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>✨ {inputBirthdayPerson || 'आकाश'} के नाम का बर्थडे गाना व कार्ड तैयार करें ✓</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Regular Festival Customizer Form */
              <div className="mt-6 p-4 rounded-2xl bg-black/75 border border-amber-400/40 shadow-xl text-left space-y-3">
                <label className="block text-xs font-semibold text-amber-300">
                  ✍️ अपना नाम और फोटो जोड़कर विश तैयार करें:
                </label>

                {/* Name input - Full Width Input with Button Directly Underneath on Mobile */}
                <form onSubmit={handleApplyName} className="flex flex-col gap-2.5">
                  <div className="relative">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="अपना नाम यहाँ लिखें (उदा. राहुल, सुधा, शर्मा परिवार)..."
                      maxLength={40}
                      className="w-full bg-stone-900 border-2 border-amber-500/50 rounded-2xl px-4 py-3 text-sm sm:text-base text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black py-3 px-5 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 cursor-pointer active:scale-98 border border-yellow-200"
                  >
                    <Check className="w-4 h-4 text-stone-950" />
                    <span>✨ अपना नाम सेट करें / नाम बदलें (Save Name) ✨</span>
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
            )}

            {/* Mega Action Buttons: WhatsApp Viral Share, Download Photo Card, Copy Link */}
            <div className="mt-5 space-y-2.5">
              {/* WhatsApp Share Button */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white font-bold py-3.5 px-6 rounded-2xl text-base sm:text-lg shadow-xl shadow-green-900/40 flex items-center justify-center gap-2 transform active:scale-98 transition cursor-pointer animate-bounce"
              >
                <Share2 className="w-5 h-5 text-white" />
                <span>WhatsApp चैट पर सबको भेजें 🚀</span>
              </button>

              {/* Direct WhatsApp Status Share Button with 8K Photo */}
              <button
                onClick={handleWhatsAppStatusShare}
                disabled={isGenerating8K}
                className="w-full bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-700 hover:from-teal-600 hover:to-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isGenerating8K ? (
                  <>
                    <Loader2 className="w-4 h-4 text-emerald-300 animate-spin" />
                    <span>8K फोटो स्टेटस तैयार हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>🟢 WhatsApp Status लगाएँ (8K HD फोटो कार्ड) 📸</span>
                  </>
                )}
              </button>

              {/* Download Combined Photo Card Button */}
              <button
                onClick={handleDownloadPhotoCard}
                disabled={isDownloadingCard}
                className="w-full bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloadingCard ? '8K फोटो कार्ड डाउनलोड हो रहा है...' : '🖼️ 8K फोटो स्टेटस कार्ड डाउनलोड करें (.JPG)'}
                </span>
              </button>

              {/* 🎬 Download 8K Video Status (.MP4) Button with Handwriting & Marquee */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-xl shadow-purple-950/50 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 border border-purple-400/40"
              >
                <Film className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span>🎬 WhatsApp 8K Video Status बनाएं व डाउनलोड करें (.MP4) ✨</span>
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

      {/* Dynamic Ad Banner Slot (AdSense / Custom) */}
      <AdBanner slotId="below_generator" />

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

        {/* 🌸 Universal Mythological Katha Audio Player & Do's and Don'ts (क्या करें और क्या न करें) 🌸 */}
        <FestivalKathaAudioSection festival={festival} />

        {/* Top Copy-Paste Wishes */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-amber-400 font-bold text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>शीर्ष शुभकामना संदेश (Copy & Paste Wishes)</span>
            </h3>
            <span className="text-xs bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-medium">
              {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeLabel || 'हिंदी'}
            </span>
          </div>
          <div className="space-y-3">
            {(activeTranslation.wishes && activeTranslation.wishes.length > 0 ? activeTranslation.wishes : festival.seoTopWishes).map((wish, idx) => (
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

      {/* Surprise Gift Box Unboxing Overlay */}
      <SurpriseUnbox
        senderName={senderName}
        festivalName={festival.nameHi}
        isOpen={isSurpriseOpen}
        onOpen={() => setIsSurpriseOpen(false)}
      />

      {/* Sticky Bottom Viral Loop Action Bar */}
      <StickyViralBar
        senderName={senderName}
        onFocusInput={handleScrollToNameInput}
        onDirectShare={handleWhatsAppShare}
      />

      {/* WhatsApp Status Guide Modal */}
      <StatusShareModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        imageUrl={statusModalImage}
        captionText={`🪔 *${activeTranslation.greetingTitle}* 🪔\n\n"${activeTranslation.greetingPoem}"\n\n— *${senderName}* की ओर से हार्दिक शुभकामनाएँ ✨\n\n👇 अपने नाम का जादुई कार्ड यहाँ बनाएँ:\n${getShareUrl()}`}
      />

      {/* 🎬 Ultra HD 8K WhatsApp Video Status Generator Modal */}
      <VideoStatusModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        festival={festival}
        senderName={senderName}
        userPhoto={userPhoto}
        birthdayPerson={isBirthday ? birthdayPerson : undefined}
        birthdayPhoto={isBirthday ? birthdayPhoto : undefined}
        poem={activeTranslation.greetingPoem || festival.defaultPoem}
        greetingTitle={isBirthday ? `Happy Birthday ${birthdayPerson}` : (activeTranslation.greetingTitle || festival.nameHi)}
        heroImageOverride={activeHeroImage}
        customAudioUrl={effectiveAudioUrl}
        shareUrl={getShareUrl()}
        slides={deitySlides}
        font={currentFont}
        selectedFontId={selectedFontId}
        onFontChange={(newFontId) => setSelectedFontId(newFontId)}
      />

      {/* Floating Loyalty Reward Points Celebration Toast */}
      {pointToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl shadow-amber-500/40 border-2 border-white flex items-center gap-2.5 animate-bounce">
          <Trophy className="w-5 h-5 text-stone-950 shrink-0" />
          <span>{pointToast.message}</span>
        </div>
      )}

    </div>
  );
};
