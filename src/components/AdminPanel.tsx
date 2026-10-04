import React, { useState, useEffect, useRef } from 'react';
import { 
  getStoredFestivals, 
  saveStoredFestivals, 
  getStoredCategories, 
  saveStoredCategories, 
  getStoredDeitySlides, 
  saveStoredDeitySlides, 
  verifyAdminCredentials,
  isAdminLoggedIn,
  loginAdminSession,
  logoutAdminSession,
  updateAdminCredentials,
  exportFullBackup, 
  importFullBackup, 
  resetToDefaults 
} from '../data/festivalStore';
import { 
  getStoredAdSettings, 
  saveStoredAdSettings, 
  AdSettings, 
  AdSlotId, 
  DEFAULT_AD_SETTINGS 
} from '../data/adStore';
import { Festival, CategoryInfo, FestivalCategory } from '../data/festivals';
import { DivineDeitySlide } from '../data/divineGodsData';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Download, 
  RefreshCw, 
  Check, 
  X, 
  Eye, 
  Image as ImageIcon, 
  FolderPlus, 
  Search, 
  ArrowLeft,
  Sparkles,
  Layers,
  Calendar,
  Save,
  AlertCircle,
  LogOut,
  User,
  Megaphone,
  Code,
  ToggleLeft,
  ToggleRight,
  Sliders,
  HelpCircle,
  CheckCircle2,
  Copy,
  Users,
  Trophy,
  CreditCard,
  Gift,
  Globe,
  FileText,
  ExternalLink,
  Link,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { 
  festiveAudio, 
  FESTIVE_SOUND_OPTIONS, 
  FestiveSoundType 
} from '../utils/festiveAudio';
import {
  saveUploadedAudioFile,
  getUploadedAudioFileName,
  deleteUploadedAudioFile
} from '../utils/audioStorage';
import { optimizeImageForWeb } from '../utils/imageOptimizer';
import { 
  WishCategory, 
  HindiWish, 
  FAQItem, 
  getStoredWishCategories, 
  saveStoredWishCategories, 
  saveOrUpdateWishCategory, 
  deleteWishCategory, 
  resetWishCategoriesToDefault 
} from '../data/wishesData';
import { 
  getStoredUsers, 
  saveStoredUsers, 
  UserProfile, 
  updateUserByAdmin, 
  deleteUserByAdmin, 
  getStoredPointRules, 
  saveStoredPointRules, 
  PointRules, 
  exportPayoutsCSV 
} from '../data/userStore';

interface AdminPanelProps {
  onClose?: () => void;
  onPreviewFestival?: (festival: Festival) => void;
  standalone?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  onPreviewFestival,
  standalone = false
}) => {
  const handleCloseOrExit = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.href = '/';
    }
  };
  // Authentication State: ALWAYS start unauthenticated so password is required every time
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminCredentials(usernameInput, passwordInput)) {
      setIsAuthenticated(true);
      loginAdminSession();
      setAuthError('');
      showToast('लॉग इन सफल! स्वागत है maahi32 👋');
    } else {
      setAuthError('गलत यूज़रनेम या पासवर्ड! कृपया सही विवरण दर्ज करें।');
    }
  };

  const handleLogout = () => {
    logoutAdminSession();
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    handleCloseOrExit();
  };

  // Active Tab: 'festivals' | 'seo_pages' | 'audio' | 'users' | 'photos' | 'categories' | 'ads' | 'backup'
  const [activeTab, setActiveTab] = useState<'festivals' | 'seo_pages' | 'audio' | 'users' | 'photos' | 'categories' | 'ads' | 'backup'>('festivals');

  // Audio Testing & Upload State
  const [testingAudioKey, setTestingAudioKey] = useState<string | null>(null);
  const [uploadingAudioKey, setUploadingAudioKey] = useState<string | null>(null);
  const [audioSectionFilter, setAudioSectionFilter] = useState<'all' | 'festivals' | 'categories' | 'seo_pages'>('all');
  const [audioSearchQuery, setAudioSearchQuery] = useState('');

  // SEO Wishing Pages & Categories State
  const [wishCategories, setWishCategories] = useState<WishCategory[]>(() => getStoredWishCategories());
  const [wishCategorySearch, setWishCategorySearch] = useState('');
  const [editingWishCategory, setEditingWishCategory] = useState<WishCategory | null>(null);
  const [originalSlugForEdit, setOriginalSlugForEdit] = useState<string | null>(null);
  const [isAddingWishCategory, setIsAddingWishCategory] = useState(false);

  // Ad Settings State (Google AdSense, Ad Networks, Custom Banners)
  const [adSettings, setAdSettings] = useState<AdSettings>(() => getStoredAdSettings());
  const [activePreviewSlot, setActivePreviewSlot] = useState<AdSlotId | null>(null);

  // Stored Data State
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  // Users & Loyalty Points State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pointRules, setPointRules] = useState<PointRules>(() => getStoredPointRules());
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userSearch, setUserSearch] = useState('');

  // Search & Filter State
  const [festivalSearch, setFestivalSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Festival Edit / Add Modal State
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [isAddingFestival, setIsAddingFestival] = useState(false);

  // Photos / Deity Slide Manager State
  const [selectedFestivalForPhotos, setSelectedFestivalForPhotos] = useState<string>('diwali');
  const [deitySlides, setDeitySlides] = useState<DivineDeitySlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<DivineDeitySlide | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Success Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const backupFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load data on mount & subscribe to changes
  useEffect(() => {
    loadAllData();
    const handleDataChange = () => loadAllData();
    window.addEventListener('shubhakamna_data_changed', handleDataChange);
    window.addEventListener('shubhakamna_users_changed', handleDataChange);
    window.addEventListener('shubhakamna_wish_categories_changed', handleDataChange);
    return () => {
      window.removeEventListener('shubhakamna_data_changed', handleDataChange);
      window.removeEventListener('shubhakamna_users_changed', handleDataChange);
      window.removeEventListener('shubhakamna_wish_categories_changed', handleDataChange);
    };
  }, []);

  const loadAllData = () => {
    const fests = getStoredFestivals();
    const cats = getStoredCategories();
    setFestivals(fests);
    setCategories(cats);
    setAdSettings(getStoredAdSettings());
    setUsers(getStoredUsers());
    setPointRules(getStoredPointRules());
    setWishCategories(getStoredWishCategories());
    if (fests.length > 0 && !selectedFestivalForPhotos) {
      setSelectedFestivalForPhotos(fests[0].id);
    }
  };

  // Stop preview sound on tab change
  useEffect(() => {
    festiveAudio.stopAll();
    setTestingAudioKey(null);
  }, [activeTab]);

  const handleToggleTestAudio = (
    key: string,
    soundType: FestiveSoundType,
    customUrl?: string,
    sampleName: string = 'आकाश'
  ) => {
    if (testingAudioKey === key) {
      festiveAudio.stopAll();
      setTestingAudioKey(null);
    } else {
      setTestingAudioKey(key);
      festiveAudio.previewSound(soundType, customUrl, sampleName);
    }
  };

  const handleQuickUpdateFestivalSound = (festivalId: string, soundType: FestiveSoundType, customUrl?: string) => {
    const updated = festivals.map(f => {
      if (f.id === festivalId) {
        return { 
          ...f, 
          soundType, 
          customAudioUrl: customUrl !== undefined ? customUrl : f.customAudioUrl 
        };
      }
      return f;
    });
    setFestivals(updated);
    saveStoredFestivals(updated);
    showToast(`त्योहार का ऑडियो '${FESTIVE_SOUND_OPTIONS.find(o => o.id === soundType)?.labelHi || soundType}' सेट हो गया! 🎵`);
  };

  const handleQuickUpdateCategorySound = (categoryId: string, soundType: FestiveSoundType, customUrl?: string) => {
    const updated = categories.map(c => {
      if (c.id === categoryId) {
        return { 
          ...c, 
          defaultSoundType: soundType, 
          customAudioUrl: customUrl !== undefined ? customUrl : c.customAudioUrl 
        };
      }
      return c;
    });
    setCategories(updated);
    saveStoredCategories(updated);
    showToast(`श्रेणी का डिफ़ॉल्ट ऑडियो सेट हो गया! 🎵`);
  };

  const handleQuickUpdateWishCategorySound = (slug: string, soundType: FestiveSoundType, customUrl?: string) => {
    const target = wishCategories.find(w => w.slug === slug);
    if (!target) return;
    const updated = { 
      ...target, 
      soundType, 
      customAudioUrl: customUrl !== undefined ? customUrl : target.customAudioUrl 
    };
    saveOrUpdateWishCategory(updated);
    setWishCategories(getStoredWishCategories());
    showToast(`विशिंग पेज का ऑडियो सेट हो गया! 🎵`);
  };

  // ==========================================
  // USER & REWARD MANAGEMENT HANDLERS
  // ==========================================
  const handleSaveUser = (updatedUser: UserProfile) => {
    updateUserByAdmin(updatedUser.id, updatedUser);
    setEditingUser(null);
    loadAllData();
    showToast(`यूज़र '${updatedUser.name}' की जानकारी अपडेट हो गई! ✨`);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`क्या आप सचमुच '${userName}' को हटाना चाहते हैं?`)) {
      deleteUserByAdmin(userId);
      loadAllData();
      showToast(`यूज़र '${userName}' को सफलतापूर्वक हटा दिया गया!`);
    }
  };

  const handleQuickAddPoints = (userId: string, pointsToAdd: number) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const newPoints = Math.max(0, target.points + pointsToAdd);
    updateUserByAdmin(userId, { points: newPoints });
    loadAllData();
    showToast(`'${target.name}' को ${pointsToAdd > 0 ? `+${pointsToAdd}` : pointsToAdd} अंक दिए गए! नया बैलेंस: ${newPoints} pts`);
  };

  const handleSavePointRules = (rulesToSave: PointRules) => {
    saveStoredPointRules(rulesToSave);
    setPointRules(rulesToSave);
    showToast('पॉइंट्स नियम व इनाम विवरण सहेज लिए गए! 🎉');
  };

  const handleExportPayouts = () => {
    const csvContent = exportPayoutsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Shubhakamna-Monthly-Winners-Payouts-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('विजेताओं की UPI लिस्ट CSV में डाउनलोड हो गई! 📥');
  };

  // ==========================================
  // AD MANAGEMENT HANDLERS (Google AdSense & Ad Networks)
  // ==========================================
  const handleSaveAdSettings = (newSettings?: AdSettings) => {
    const toSave = newSettings || adSettings;
    saveStoredAdSettings(toSave);
    showToast('विज्ञापन कोड व सेटिंग्स सफलतापूर्वक सहेज ली गईं! 🎉');
  };

  const handleToggleMasterAds = () => {
    const nextState = !adSettings.adsEnabled;
    const updated = { ...adSettings, adsEnabled: nextState };
    setAdSettings(updated);
    saveStoredAdSettings(updated);
    showToast(nextState ? '🟢 सभी विज्ञापन चालू कर दिए गए!' : '⏸️ सभी विज्ञापन रोक (Pause) दिए गए!');
  };

  const handleUpdateAdSlot = (slotId: AdSlotId, updates: Partial<typeof adSettings.slots[AdSlotId]>) => {
    setAdSettings(prev => ({
      ...prev,
      slots: {
        ...prev.slots,
        [slotId]: {
          ...prev.slots[slotId],
          ...updates
        }
      }
    }));
  };

  const handleInsertSampleSlot = (slotId: AdSlotId) => {
    const sampleAdCode = `<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
    handleUpdateAdSlot(slotId, { code: sampleAdCode, enabled: true });
    showToast(`'${adSettings.slots[slotId].name}' में सैंपल AdSense कोड भर दिया गया!`);
  };

  const handleClearSlotCode = (slotId: AdSlotId) => {
    handleUpdateAdSlot(slotId, { code: '', enabled: false });
    showToast(`'${adSettings.slots[slotId].name}' का कोड हटा दिया गया!`);
  };

  const handleInsertSampleHeaderScript = () => {
    const sampleScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>`;
    setAdSettings(prev => ({ ...prev, headerScript: sampleScript }));
    showToast('सैंपल AdSense Auto-Ads स्क्रिप्ट कोड भर दिया गया!');
  };

  const handleClearAllAds = () => {
    if (window.confirm('क्या आप सचमुच सभी विज्ञापन कोड हटाना चाहते हैं?')) {
      const resetAds: AdSettings = {
        adsEnabled: false,
        headerScript: '',
        slots: {
          header: { ...adSettings.slots.header, code: '', enabled: false },
          in_content: { ...adSettings.slots.in_content, code: '', enabled: false },
          below_generator: { ...adSettings.slots.below_generator, code: '', enabled: false },
          sticky_bottom: { ...adSettings.slots.sticky_bottom, code: '', enabled: false }
        }
      };
      setAdSettings(resetAds);
      saveStoredAdSettings(resetAds);
      showToast('सभी विज्ञापन कोड सफलतापूर्वक साफ़ कर दिए गए!');
    }
  };

  // Load deity slides whenever selected festival for photos changes
  useEffect(() => {
    if (selectedFestivalForPhotos) {
      const slides = getStoredDeitySlides(selectedFestivalForPhotos);
      setDeitySlides(slides);
    }
  }, [selectedFestivalForPhotos]);

  // ==========================================
  // FESTIVAL CRUD OPERATIONS
  // ==========================================
  const handleSaveFestival = (fest: Festival) => {
    let updated: Festival[];
    const exists = festivals.some(f => f.id === fest.id);
    if (exists) {
      updated = festivals.map(f => f.id === fest.id ? fest : f);
      showToast(`'${fest.nameHi}' अपडेट हो गया!`);
    } else {
      updated = [fest, ...festivals];
      showToast(`नया त्योहार '${fest.nameHi}' जुड़ गया!`);
    }
    setFestivals(updated);
    saveStoredFestivals(updated);
    setEditingFestival(null);
    setIsAddingFestival(false);
  };

  const handleDeleteFestival = (id: string, name: string) => {
    if (window.confirm(`क्या आप सचमुच '${name}' त्योहार को डिलीट करना चाहते हैं?`)) {
      const updated = festivals.filter(f => f.id !== id);
      setFestivals(updated);
      saveStoredFestivals(updated);
      showToast(`'${name}' डिलीट कर दिया गया!`);
    }
  };

  const handleImageUploadForFestival = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'heroImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('फ़ोटो ऑप्टिमाइज़ हो रही है... ⏳');
      const optimizedBase64 = await optimizeImageForWeb(file, 1200, 0.82);
      if (editingFestival) {
        setEditingFestival({ ...editingFestival, [targetField]: optimizedBase64 });
      }
      showToast('फ़ोटो लोड हो गई! "सेव करें" दबाकर पक्का करें।');
    } catch (err) {
      console.error('Image optimization failed:', err);
      showToast('फ़ोटो अपलोड करने में समस्या आई!');
    }
  };

  // ==========================================
  // AUDIO TESTING & QUICK CONFIGURATION
  // ==========================================
  const handleTestAudio = (key: string, soundType: FestiveSoundType, customUrl?: string) => {
    if (testingAudioKey === key) {
      festiveAudio.stopAll();
      setTestingAudioKey(null);
    } else {
      setTestingAudioKey(key);
      festiveAudio.previewSound(soundType, customUrl, 'आकाश');
    }
  };

  const handleUpdateFestivalAudio = (festId: string, soundType: FestiveSoundType, customAudioUrl?: string) => {
    const updated = festivals.map(f => {
      if (f.id === festId) {
        return { ...f, soundType, customAudioUrl: customAudioUrl ?? f.customAudioUrl };
      }
      return f;
    });
    setFestivals(updated);
    saveStoredFestivals(updated);
    showToast('त्योहार का ऑडियो अपडेट हो गया!');
  };

  const handleUpdateWishCategoryAudio = (slug: string, soundType: FestiveSoundType, customAudioUrl?: string) => {
    const updated = wishCategories.map(c => {
      if (c.slug === slug) {
        return { ...c, soundType, customAudioUrl: customAudioUrl ?? c.customAudioUrl };
      }
      return c;
    });
    setWishCategories(updated);
    saveStoredWishCategories(updated);
    showToast('SEO विशिंग पेज का ऑडियो अपडेट हो गया!');
  };

  const handleUpdateCategoryAudio = (catId: FestivalCategory, defaultSoundType: FestiveSoundType, customAudioUrl?: string) => {
    const updated = categories.map(c => {
      if (c.id === catId) {
        return { ...c, defaultSoundType, customAudioUrl: customAudioUrl ?? c.customAudioUrl };
      }
      return c;
    });
    setCategories(updated);
    saveStoredCategories(updated);
    showToast('नेविगेशन श्रेणी का ऑडियो अपडेट हो गया!');
  };

  const handleAudioFileUploadForFestival = (festId: string, file: File) => {
    setUploadingAudioKey(`fest_${festId}`);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;
        await saveUploadedAudioFile(`fest_${festId}`, dataUrl, file.name, file.type);
        handleUpdateFestivalAudio(festId, 'custom_url', dataUrl);
        setUploadingAudioKey(null);
        showToast(`'${file.name}' ऑडियो फ़ाइल सफलतापूर्वक अपलोड हो गई! 🎵`);
      } catch (err) {
        setUploadingAudioKey(null);
        showToast('ऑडियो अपलोड में समस्या आई।');
      }
    };
    reader.onerror = () => {
      setUploadingAudioKey(null);
      showToast('फ़ाइल पढ़ने में त्रुटि!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedAudioForFestival = async (festId: string) => {
    await deleteUploadedAudioFile(`fest_${festId}`);
    const updated = festivals.map(f => {
      if (f.id === festId) {
        return { ...f, soundType: 'aarti' as FestiveSoundType, customAudioUrl: undefined };
      }
      return f;
    });
    setFestivals(updated);
    saveStoredFestivals(updated);
    showToast('कस्टम ऑडियो हटा दिया गया, डिफ़ॉल्ट आरती धुन सेट हो गई!');
  };

  const handleAudioFileUploadForWishCategory = (slug: string, file: File) => {
    setUploadingAudioKey(`wish_${slug}`);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;
        await saveUploadedAudioFile(`wish_${slug}`, dataUrl, file.name, file.type);
        handleUpdateWishCategoryAudio(slug, 'custom_url', dataUrl);
        setUploadingAudioKey(null);
        showToast(`'${file.name}' ऑडियो फ़ाइल सफलतापूर्वक अपलोड हो गई! 🎵`);
      } catch (err) {
        setUploadingAudioKey(null);
        showToast('ऑडियो अपलोड में समस्या आई।');
      }
    };
    reader.onerror = () => {
      setUploadingAudioKey(null);
      showToast('फ़ाइल पढ़ने में त्रुटि!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedAudioForWishCategory = async (slug: string) => {
    await deleteUploadedAudioFile(`wish_${slug}`);
    const defaultSound: FestiveSoundType = slug.includes('birthday') ? 'birthday' : 'flute';
    const updated = wishCategories.map(c => {
      if (c.slug === slug) {
        return { ...c, soundType: defaultSound, customAudioUrl: undefined };
      }
      return c;
    });
    setWishCategories(updated);
    saveStoredWishCategories(updated);
    showToast('कस्टम ऑडियो हटा दिया गया!');
  };

  const handleModalFestivalAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingFestival) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;
      await saveUploadedAudioFile(`fest_${editingFestival.id}`, dataUrl, file.name, file.type);
      setEditingFestival({
        ...editingFestival,
        soundType: 'custom_url',
        customAudioUrl: dataUrl
      });
      showToast(`'${file.name}' ऑडियो लोड हो गया! सहेजने के लिए "सेव करें" दबाएँ।`);
    };
    reader.readAsDataURL(file);
  };

  const handleModalWishCategoryAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingWishCategory) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;
      await saveUploadedAudioFile(`wish_${editingWishCategory.slug}`, dataUrl, file.name, file.type);
      setEditingWishCategory({
        ...editingWishCategory,
        soundType: 'custom_url',
        customAudioUrl: dataUrl
      });
      showToast(`'${file.name}' ऑडियो लोड हो गया! सहेजने के लिए "पेज सहेजें" दबाएँ।`);
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // PHOTOS / DEITY SLIDES REORDER & CRUD
  // ==========================================
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= deitySlides.length) return;

    const updated = [...deitySlides];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    setDeitySlides(updated);
    saveStoredDeitySlides(selectedFestivalForPhotos, updated);
    showToast('फ़ोटो का क्रम बदल गया!');
  };

  const handleDeleteSlide = (slideId: string) => {
    if (window.confirm('क्या आप इस भगवान/फ़ोटो को हटाना चाहते हैं?')) {
      const updated = deitySlides.filter(s => s.id !== slideId);
      setDeitySlides(updated);
      saveStoredDeitySlides(selectedFestivalForPhotos, updated);
      showToast('फ़ोटो हटा दी गई!');
    }
  };

  const handleSaveSlide = (slide: DivineDeitySlide) => {
    let updated: DivineDeitySlide[];
    const exists = deitySlides.some(s => s.id === slide.id);
    if (exists) {
      updated = deitySlides.map(s => s.id === slide.id ? slide : s);
      showToast(`'${slide.godName}' अपडेट हो गया!`);
    } else {
      updated = [...deitySlides, slide];
      showToast(`'${slide.godName}' नया दर्शन जुड़ गया!`);
    }
    setDeitySlides(updated);
    saveStoredDeitySlides(selectedFestivalForPhotos, updated);
    setEditingSlide(null);
    setIsAddingSlide(false);
  };

  const handleUploadSlideImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('फ़ोटो ऑप्टिमाइज़ हो रही है... ⏳');
      const optimizedBase64 = await optimizeImageForWeb(file, 1200, 0.82);
      if (editingSlide) {
        setEditingSlide({ ...editingSlide, imageUrl: optimizedBase64 });
      }
      showToast('फ़ोटो लोड हो गई! "सेव करें" दबाएँ।');
    } catch (err) {
      console.error('Slide image optimization failed:', err);
      showToast('फ़ोटो अपलोड करने में समस्या आई!');
    }
  };

  // ==========================================
  // CATEGORIES REORDER & CRUD
  // ==========================================
  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    setCategories(updated);
    saveStoredCategories(updated);
    showToast('श्रेणियों का क्रम बदल गया!');
  };

  const handleSaveCategory = (cat: CategoryInfo) => {
    let updated: CategoryInfo[];
    const exists = categories.some(c => c.id === cat.id);
    if (exists) {
      updated = categories.map(c => c.id === cat.id ? cat : c);
      showToast(`'${cat.nameHi}' श्रेणी अपडेट हो गई!`);
    } else {
      updated = [...categories, cat];
      showToast(`नई श्रेणी '${cat.nameHi}' जुड़ गई!`);
    }
    setCategories(updated);
    saveStoredCategories(updated);
    setEditingCategory(null);
    setIsAddingCategory(false);
  };

  // ==========================================
  // BACKUP, RESTORE & RESET
  // ==========================================
  const handleDownloadBackup = () => {
    const json = exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shubhakamna-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('पूरा बैकअप JSON फ़ाइल में डाउनलोड हो गया!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (importFullBackup(content)) {
        showToast('बैकअप सफलतापूर्वक रिस्टोर हो गया!');
        loadAllData();
      } else {
        alert('गलत JSON बैकअप फ़ाइल!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('चेतावनी: क्या आप सचमुच सब कुछ रीसेट करके ओरिजिनल डेटा वापस लाना चाहते हैं?')) {
      resetToDefaults();
      loadAllData();
      showToast('फ़ैक्टरी डिफ़ॉल्ट डेटा रिस्टोर हो गया!');
    }
  };

  // Filtered festivals for festivals tab
  const filteredFestivals = festivals.filter(f => {
    const matchesCat = selectedCategoryFilter === 'all' || f.category === selectedCategoryFilter;
    const matchesQuery = 
      f.nameHi.toLowerCase().includes(festivalSearch.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(festivalSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // ==========================================
  // LOGIN SCREEN (Protected: maahi32 / Sk951951)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-fade-in overflow-y-auto">
        <div className="w-full max-w-md rounded-3xl border-2 border-amber-500/40 bg-stone-950 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30 text-stone-950">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white font-serif">
              🔐 Shubhakamna Admin Login
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              एडमिन पोर्टल केवल अधिकृत व्यवस्थापक के लिए है
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                यूज़रनेम (Username)
              </label>
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="यूज़रनेम दर्ज करें..."
                className="w-full py-2.5 px-3.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 font-mono text-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="पासवर्ड दर्ज करें..."
                className="w-full py-2.5 px-3.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 font-mono text-sm"
              />
            </div>

            {authError && (
              <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseOrExit}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-semibold text-xs transition cursor-pointer"
              >
                ← वापस लौटें
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                लॉग इन करें →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-950 text-stone-100 overflow-hidden animate-fade-in">
      
      {/* Top Header Navbar */}
      <header className="border-b border-amber-500/30 bg-stone-900/95 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-stone-950 font-bold">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white font-serif">
                शुभकामना एडमिन पोर्टल
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                100% मुफ़्त & सुरक्षित
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70 hidden sm:block">
              त्योहार, भगवान की फ़ोटो, स्लाइडर और श्रेणियाँ ड्रैग व 1-क्लिक से मैनेज करें
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCloseOrExit}
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center gap-1.5 border border-stone-700 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>लाइव साइट देखें</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="border-b border-stone-800 bg-stone-900/50 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
        <button
          onClick={() => setActiveTab('festivals')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'festivals'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>🪔</span>
          <span>त्योहार प्रबंधन ({festivals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('seo_pages')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'seo_pages'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>📄</span>
          <span>SEO विशिंग पेज व URL ({wishCategories.length})</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
            Clean URL
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'audio'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>🎵</span>
          <span>ऑडियो व संगीत प्रबंधक</span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
            Songs 🎶
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'users'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>👥</span>
          <span>यूज़र्स व रिवॉर्ड्स ({users.length})</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-mono font-bold">
            UPI 🏆
          </span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'photos'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>📸</span>
          <span>भगवान व फ़ोटो स्लाइडर (क्रम बदलें)</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'categories'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>🏷️</span>
          <span>श्रेणी प्रबंधन ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'ads'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>📢</span>
          <span>विज्ञापन प्रबंधक (Google AdSense & Banners)</span>
          {adSettings.adsEnabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'backup'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span>💾</span>
          <span>बैकअप, रिस्टोर व पिन</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Body Content Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl w-full mx-auto">
        
        {/* ========================================================= */}
        {/* TAB 1: FESTIVALS MANAGEMENT                               */}
        {/* ========================================================= */}
        {activeTab === 'festivals' && (
          <div className="space-y-6">
            
            {/* Top Toolbar: Search, Category Filter & Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={festivalSearch}
                    onChange={(e) => setFestivalSearch(e.target.value)}
                    placeholder="त्योहार खोजें..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-amber-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">सभी श्रेणियाँ</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.nameHi}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingFestival({
                    id: `festival_${Date.now()}`,
                    slug: `new-festival-wishes-${Date.now()}`,
                    nameHi: 'नया पावन पर्व',
                    nameEn: 'New Festival Wishes',
                    taglineHi: 'पावन त्योहार की हार्दिक शुभकामनाएँ',
                    category: 'hindu',
                    dateLabel: 'शुभ तिथि',
                    countdownDays: 0,
                    badge: '✨ पावन पर्व',
                    heroImage: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?auto=format&fit=crop&w=1200&q=80',
                    themeColor: {
                      gradient: 'from-amber-950 via-yellow-900 to-stone-950',
                      border: 'border-amber-500/40',
                      accent: 'text-amber-400',
                      glow: 'shadow-amber-500/20'
                    },
                    particlesType: 'diyas',
                    soundType: 'aarti',
                    greetingTitle: 'पावन पर्व की हार्दिक बधाई',
                    defaultPoem: 'सुख, शांति और समृद्धि से परिपूर्ण हो आपका जीवन।',
                    significance: 'यह पावन पर्व सत्य, धर्म और खुशियों का प्रतीक है।',
                    shubhMuhurat: 'प्रातः काल से सायं काल तक शुभ मुहूर्त।',
                    seoTopWishes: ['हार्दिक शुभकामनाएँ!'],
                    faqs: [{ question: 'शुभ मुहूर्त क्या है?', answer: 'पूरे दिन शुभ मुहूर्त है।' }]
                  });
                  setIsAddingFestival(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ नया त्योहार जोड़ें</span>
              </button>
            </div>

            {/* Festivals Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFestivals.map((fest) => {
                const catObj = categories.find(c => c.id === fest.category);
                return (
                  <div
                    key={fest.id}
                    className="rounded-2xl border border-stone-800 bg-stone-900/60 overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-500/30 bg-black">
                        <img
                          src={fest.heroImage}
                          alt={fest.nameHi}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{catObj?.icon || '🪔'}</span>
                          <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {catObj?.nameHi || fest.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-serif mt-1 truncate">
                          {fest.nameHi}
                        </h4>
                        <p className="text-[11px] text-stone-400 truncate">
                          {fest.dateLabel}
                        </p>
                      </div>
                    </div>

                    {/* Audio Preview Bar */}
                    <div className="flex items-center justify-between text-[11px] bg-stone-950/80 px-2.5 py-1.5 rounded-xl border border-stone-800">
                      <span className="text-stone-300 flex items-center gap-1 font-mono text-[10px] truncate max-w-[140px]">
                        <Music className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{FESTIVE_SOUND_OPTIONS.find(o => o.id === fest.soundType)?.labelHi.slice(0, 14) || fest.soundType}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleTestAudio(fest.id, fest.soundType, fest.customAudioUrl, 'आकाश')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                          testingAudioKey === fest.id
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        }`}
                      >
                        {testingAudioKey === fest.id ? (
                          <>
                            <Pause className="w-2.5 h-2.5" />
                            <span>रोकें</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>सुनें 🎵</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedFestivalForPhotos(fest.id);
                            setActiveTab('photos');
                          }}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                        >
                          <span>📸 फ़ोटो</span>
                        </button>
                        <span className="text-stone-700">·</span>
                        <button
                          onClick={() => {
                            setAudioSearchQuery(fest.nameHi);
                            setActiveTab('audio');
                          }}
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                        >
                          <span>🎵 ऑडियो</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingFestival(fest);
                            setIsAddingFestival(false);
                          }}
                          title="एडिट करें"
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFestival(fest.id, fest.nameHi)}
                          title="डिलीट करें"
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SEO WISHING PAGES & CATEGORY URL MANAGER           */}
        {/* ========================================================= */}
        {activeTab === 'seo_pages' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={wishCategorySearch}
                  onChange={(e) => setWishCategorySearch(e.target.value)}
                  placeholder="पेज का नाम या URL स्लॉग खोजें (उदा. diwali, mother, birthday)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newSlug = `new-wishes-${Date.now()}`;
                    setEditingWishCategory({
                      slug: newSlug,
                      nameHi: 'नया विशिंग पेज',
                      nameEn: 'New Wishing Page',
                      seoTitle: 'नया विशिंग पेज 2026 | New Wishes in Hindi - Shubhakamna.in',
                      metaDescription: 'इस पावन अवसर पर अपनों को भेजें सुंदर शुभकामना संदेश व शायरी। नाम व फोटो का 9:16 कार्ड बनाएं।',
                      keywords: ['wishes in hindi', 'shubhakamna'],
                      h1: 'नए अवसर पर हार्दिक शुभकामनाएं व बधाई संदेश',
                      intro: 'इस शुभ अवसर पर अपने प्रियजनों को भेजने हेतु यहाँ सुंदर, भावपूर्ण व प्रेरक शुभकामना संदेश संकलित हैं।',
                      theme: {
                        primaryColor: '#f59e0b',
                        gradient: 'from-amber-600 via-orange-500 to-yellow-500',
                        accentEmoji: '✨'
                      },
                      heroImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
                      wishes: [
                        {
                          id: `wish_${Date.now()}_1`,
                          hindiText: 'आपके जीवन में सदा सुख, शांति और समृद्धि की नई किरणें जगमगाती रहें। हार्दिक शुभकामनाएं!',
                          authorOrTone: 'शुभकामना'
                        }
                      ],
                      faqs: [
                        {
                          question: 'क्या इस पेज से नाम वाला कार्ड बना सकते हैं?',
                          answer: 'हाँ, हमारे 1-क्लिक विश कार्ड जनरेटर में अपना नाम व फोटो जोड़कर 9:16 साइज का एचडी कार्ड मुफ़्त में बनाएं।'
                        }
                      ],
                      relatedSlugs: ['birthday-wishes', 'diwali-wishes'],
                      updatedAt: new Date().toISOString().slice(0, 10)
                    });
                    setOriginalSlugForEdit(null);
                    setIsAddingWishCategory(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ नया SEO पेज जोड़ें</span>
                </button>
              </div>
            </div>

            {/* Explanatory Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-300">
                  Google SEO लैंडिंग पेज व Clean URL नियंत्रण केंद्र:
                </p>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  यहाँ आप किसी भी विशिंग पेज का <strong>नाम (Page Title/H1)</strong>, <strong>URL Slug (जैसे: /birthday-wishes-for-mother/)</strong>, <strong>SEO Meta Tags</strong>, और उसके <strong>शुभकामना संदेश</strong> सीधे बदल सकते हैं। URL बदलने पर भी पेज लाइव साइट पर तुरंत सही लोड होगा।
                </p>
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {wishCategories
                .filter(cat => {
                  const q = wishCategorySearch.toLowerCase();
                  return (
                    cat.nameHi.toLowerCase().includes(q) ||
                    cat.nameEn.toLowerCase().includes(q) ||
                    cat.slug.toLowerCase().includes(q)
                  );
                })
                .map(cat => {
                  return (
                    <div
                      key={cat.slug}
                      className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{cat.theme.accentEmoji}</span>
                          <span className="text-[10px] font-mono bg-stone-950 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                            {cat.wishes.length} संदेश
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white font-serif truncate">
                            {cat.nameHi}
                          </h4>
                          <p className="text-[11px] text-stone-400 truncate">
                            {cat.nameEn}
                          </p>
                        </div>

                        {/* Clean URL Box */}
                        <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-amber-400/80 font-bold block">
                            URL Slug (Web Path):
                          </span>
                          <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-stone-300">
                            <span className="text-amber-300 font-bold truncate">/{cat.slug}/</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  const fullUrl = `${window.location.origin}/${cat.slug}/`;
                                  navigator.clipboard.writeText(fullUrl);
                                  showToast('URL कॉपी हो गया!');
                                }}
                                title="URL कॉपी करें"
                                className="p-1 hover:text-amber-400 text-stone-400 cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`/${cat.slug}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="लाइव पेज देखें"
                                className="p-1 hover:text-amber-400 text-stone-400 cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                          {cat.metaDescription}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWishCategory({ ...cat, wishes: [...cat.wishes], faqs: [...(cat.faqs || [])] });
                            setOriginalSlugForEdit(cat.slug);
                            setIsAddingWishCategory(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>नाम व URL एडिट करें</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`क्या आप सचमुच '${cat.nameHi}' (/${cat.slug}/) पेज को हटाना चाहते हैं?`)) {
                              deleteWishCategory(cat.slug);
                              setWishCategories(getStoredWishCategories());
                              showToast(`'${cat.nameHi}' डिलीट कर दिया गया!`);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 transition cursor-pointer"
                          title="डिलीट करें"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: AUDIO & SONGS MANAGEMENT (FESTIVALS & WISHES AUDIO)*/}
        {/* ========================================================= */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            
            {/* Top Info Banner */}
            <div className="rounded-3xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-stone-900 to-amber-950/30 p-5 sm:p-6 shadow-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 font-bold text-xl shrink-0">
                    🎵
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
                      <span>ऑडियो व संगीत प्रबंधक (Audio & Songs Control)</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-sans font-bold">
                        9+ साउंड मोड्स
                      </span>
                    </h3>
                    <p className="text-xs text-stone-300">
                      हर त्योहार व विशिंग पेज में बजने वाला ऑडियो यहीं से तय करें। हैप्पी बर्थडे सॉन्ग, आरती, बांसुरी, शहनाई, शंख, डमरू, आतिशबाजी या अपना कोई भी MP3 गाना जोड़ें।
                    </p>
                  </div>
                </div>

                {/* Quick Stop Audio Button */}
                <button
                  type="button"
                  onClick={() => {
                    festiveAudio.stopAll();
                    setTestingAudioKey(null);
                    showToast('सभी ऑडियो बंद कर दिए गए!');
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <VolumeX className="w-4 h-4 text-red-400" />
                  <span>सभी ध्वनि बंद करें (Stop All)</span>
                </button>
              </div>

              {/* Sound Presets Quick Audition Strip */}
              <div className="pt-3 border-t border-stone-800/80">
                <span className="text-[11px] font-bold text-amber-300 block mb-2">
                  🎧 किसी भी साउंड का तुरंत डेमो सुनें (Click to Sample):
                </span>
                <div className="flex flex-wrap gap-2">
                  {FESTIVE_SOUND_OPTIONS.map((opt) => {
                    const isPlayingThis = testingAudioKey === `sample_${opt.id}`;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleTestAudio(`sample_${opt.id}`, opt.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          isPlayingThis
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md animate-pulse'
                            : 'bg-stone-900/90 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.labelHi.split('(')[0].trim()}</span>
                        {isPlayingThis ? <Pause className="w-3 h-3 text-yellow-300" /> : <Play className="w-3 h-3 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setAudioSectionFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    audioSectionFilter === 'all'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  सभी ({festivals.length + wishCategories.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAudioSectionFilter('festivals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    audioSectionFilter === 'festivals'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  🪔 त्योहार ({festivals.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAudioSectionFilter('seo_pages')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    audioSectionFilter === 'seo_pages'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  📄 विशिंग पेज ({wishCategories.length})
                </button>
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={audioSearchQuery}
                  onChange={(e) => setAudioSearchQuery(e.target.value)}
                  placeholder="खोजें (उदा: birthday, diwali, holi)..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* 1. FESTIVALS AUDIO SECTION */}
            {(audioSectionFilter === 'all' || audioSectionFilter === 'festivals') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-300 font-serif flex items-center gap-2">
                    <span>🪔 त्योहारों का ऑडियो नियंत्रण (Festivals Sound Settings)</span>
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {festivals.length} त्योहार
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {festivals
                    .filter(f => {
                      const q = audioSearchQuery.toLowerCase();
                      return !q || f.nameHi.toLowerCase().includes(q) || f.nameEn.toLowerCase().includes(q) || f.id.toLowerCase().includes(q);
                    })
                    .map((fest) => {
                      const currentSound = fest.soundType || 'aarti';
                      const isPlaying = testingAudioKey === `fest_${fest.id}`;

                      return (
                        <div
                          key={fest.id}
                          className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xl">
                                  {FESTIVE_SOUND_OPTIONS.find(o => o.id === currentSound)?.icon || '🪔'}
                                </span>
                                <div className="truncate">
                                  <h5 className="text-sm font-bold text-white font-serif truncate">
                                    {fest.nameHi}
                                  </h5>
                                  <p className="text-[10px] text-stone-400 font-mono truncate">
                                    id: {fest.id} • {fest.dateLabel}
                                  </p>
                                </div>
                              </div>

                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30 shrink-0">
                                {FESTIVE_SOUND_OPTIONS.find(o => o.id === currentSound)?.labelHi.split('(')[0] || currentSound}
                              </span>
                            </div>

                            {/* Sound Type Selector Dropdown */}
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-stone-300">
                                कौन सा ऑडियो बजेगा (Select Sound Type):
                              </label>
                              <select
                                value={currentSound}
                                onChange={(e) => {
                                  const newSound = e.target.value as FestiveSoundType;
                                  handleUpdateFestivalAudio(fest.id, newSound);
                                }}
                                className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                              >
                                {FESTIVE_SOUND_OPTIONS.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.icon} {opt.labelHi}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Direct Audio File Upload Button (MP3 / Audio) */}
                            <div className="pt-2 border-t border-stone-800/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                                  <span>अपना गाना / ऑडियो अपलोड करें (Upload MP3):</span>
                                </span>
                                {fest.customAudioUrl && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveUploadedAudioForFestival(fest.id)}
                                    className="text-[10px] text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                                  >
                                    हटाएं
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <label className="flex-1 px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md">
                                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                                  <span>
                                    {uploadingAudioKey === `fest_${fest.id}`
                                      ? 'ऑडियो अपलोड हो रहा है...'
                                      : '📂 फोन/कंप्यूटर से गाना चुनें (Upload Audio File)'}
                                  </span>
                                  <input
                                    type="file"
                                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                                    className="hidden"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleAudioFileUploadForFestival(fest.id, f);
                                    }}
                                  />
                                </label>
                              </div>

                              {/* Display if audio file is loaded */}
                              {fest.customAudioUrl && (
                                <div className="p-2 rounded-xl bg-black/60 border border-emerald-500/40 flex items-center justify-between gap-1 text-[11px]">
                                  <span className="text-emerald-300 font-mono truncate flex items-center gap-1.5">
                                    <span className="text-sm">🎵</span>
                                    <span className="font-bold truncate">
                                      {getUploadedAudioFileName(`fest_${fest.id}`) || 'कस्टम ऑडियो संलग्न है'}
                                    </span>
                                  </span>
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30 shrink-0">
                                    सक्रिय
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Optional Custom Audio URL Input */}
                            <div className="mt-2 space-y-1">
                              <label className="block text-[10px] font-bold text-stone-400">
                                या ऑनलाइन MP3 लिंक डालें (Optional Audio URL):
                              </label>
                              <input
                                type="url"
                                value={fest.customAudioUrl || ''}
                                onChange={(e) => handleUpdateFestivalAudio(fest.id, 'custom_url', e.target.value)}
                                placeholder="https://.../song.mp3"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>

                          {/* Action Buttons: Test Sound & Save */}
                          <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleTestAudio(`fest_${fest.id}`, currentSound, fest.customAudioUrl)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                isPlaying
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                              }`}
                            >
                              {isPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 text-yellow-300" />
                                  <span>रोकें (Playing...)</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  <span>बजाकर देखें (Preview)</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingFestival(fest);
                                setIsAddingFestival(false);
                              }}
                              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                            >
                              पूरा त्योहार एडिट करें →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 2. SEO WISHES PAGES AUDIO SECTION */}
            {(audioSectionFilter === 'all' || audioSectionFilter === 'seo_pages') && (
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-300 font-serif flex items-center gap-2">
                    <span>📄 SEO विशिंग पेज ऑडियो नियंत्रण (Wishes Pages Sound Settings)</span>
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {wishCategories.length} पेज
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {wishCategories
                    .filter(c => {
                      const q = audioSearchQuery.toLowerCase();
                      return !q || c.nameHi.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
                    })
                    .map((cat) => {
                      const isBday = cat.slug.includes('birthday');
                      const currentSound: FestiveSoundType = cat.soundType || (isBday ? 'birthday' : 'flute');
                      const isPlaying = testingAudioKey === `wish_${cat.slug}`;

                      return (
                        <div
                          key={cat.slug}
                          className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xl">
                                  {cat.theme.accentEmoji || '✨'}
                                </span>
                                <div className="truncate">
                                  <h5 className="text-sm font-bold text-white font-serif truncate">
                                    {cat.nameHi}
                                  </h5>
                                  <p className="text-[10px] text-stone-400 font-mono truncate">
                                    /{cat.slug}/
                                  </p>
                                </div>
                              </div>

                              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/30 shrink-0">
                                {FESTIVE_SOUND_OPTIONS.find(o => o.id === currentSound)?.labelHi.split('(')[0] || currentSound}
                              </span>
                            </div>

                            {/* Sound Type Selector Dropdown */}
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-stone-300">
                                कौन सा ऑडियो बजेगा (Select Sound Type):
                              </label>
                              <select
                                value={currentSound}
                                onChange={(e) => {
                                  const newSound = e.target.value as FestiveSoundType;
                                  handleUpdateWishCategoryAudio(cat.slug, newSound);
                                }}
                                className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                              >
                                {FESTIVE_SOUND_OPTIONS.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.icon} {opt.labelHi}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Direct Audio File Upload Button (MP3 / Audio) */}
                            <div className="pt-2 border-t border-stone-800/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                                  <span>अपना गाना / ऑडियो अपलोड करें (Upload MP3):</span>
                                </span>
                                {cat.customAudioUrl && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveUploadedAudioForWishCategory(cat.slug)}
                                    className="text-[10px] text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                                  >
                                    हटाएं
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <label className="flex-1 px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md">
                                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                                  <span>
                                    {uploadingAudioKey === `wish_${cat.slug}`
                                      ? 'ऑडियो अपलोड हो रहा है...'
                                      : '📂 फोन/कंप्यूटर से गाना चुनें (Upload Audio File)'}
                                  </span>
                                  <input
                                    type="file"
                                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                                    className="hidden"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleAudioFileUploadForWishCategory(cat.slug, f);
                                    }}
                                  />
                                </label>
                              </div>

                              {/* Display if audio file is loaded */}
                              {cat.customAudioUrl && (
                                <div className="p-2 rounded-xl bg-black/60 border border-emerald-500/40 flex items-center justify-between gap-1 text-[11px]">
                                  <span className="text-emerald-300 font-mono truncate flex items-center gap-1.5">
                                    <span className="text-sm">🎵</span>
                                    <span className="font-bold truncate">
                                      {getUploadedAudioFileName(`wish_${cat.slug}`) || 'कस्टम ऑडियो संलग्न है'}
                                    </span>
                                  </span>
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30 shrink-0">
                                    सक्रिय
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Optional Custom Audio URL Input */}
                            <div className="mt-2 space-y-1">
                              <label className="block text-[10px] font-bold text-stone-400">
                                या ऑनलाइन MP3 लिंक डालें (Optional Audio URL):
                              </label>
                              <input
                                type="url"
                                value={cat.customAudioUrl || ''}
                                onChange={(e) => handleUpdateWishCategoryAudio(cat.slug, 'custom_url', e.target.value)}
                                placeholder="https://.../song.mp3"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>

                          {/* Action Buttons: Test Sound & Edit */}
                          <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleTestAudio(`wish_${cat.slug}`, currentSound, cat.customAudioUrl)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                isPlaying
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                              }`}
                            >
                              {isPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 text-yellow-300" />
                                  <span>रोकें (Playing...)</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  <span>बजाकर देखें (Preview)</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingWishCategory(cat);
                                setOriginalSlugForEdit(cat.slug);
                                setIsAddingWishCategory(false);
                              }}
                              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                            >
                              पूरा पेज एडिट करें →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: USERS & REWARDS MANAGEMENT (LEADERBOARD & UPI PAYOUTS) */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Header & Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 font-semibold block">कुल पंजीकृत यूज़र्स</span>
                <span className="text-2xl font-extrabold text-white font-serif">{users.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 font-semibold block">कुल बांटे गए पॉइंट्स</span>
                <span className="text-2xl font-extrabold text-amber-400 font-serif">
                  {users.reduce((acc, u) => acc + u.points, 0).toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 font-semibold block">कुल शेयर्स (Viral Count)</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-serif">
                  {users.reduce((acc, u) => acc + u.sharesCount, 0)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 space-y-1">
                <span className="text-[11px] text-amber-300 font-semibold block">वर्तमान #1 विजेता</span>
                <span className="text-lg font-bold text-white truncate block">
                  {users.slice().sort((a,b) => b.points - a.points)[0]?.name || 'N/A'}
                </span>
              </div>
            </div>

            {/* Monthly Winners & UPI Payouts Box */}
            <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-stone-900 to-yellow-950/40 p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center font-bold shadow-md shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                      <span>🏆 इस महीने के शीर्ष 3 नकद पुरस्कार विजेता</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-sans font-bold">
                        सीधा UPI भुगतान
                      </span>
                    </h3>
                    <p className="text-xs text-stone-300">
                      नीचे दिए गए विजेताओं के UPI ID कॉपी करें और PhonePe / Google Pay / Paytm से सीधा इनाम ट्रांसफर करें:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportPayouts}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>पूरी UPI लिस्ट डाउनलोड करें (.CSV)</span>
                </button>
              </div>

              {/* Top 3 Winners Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {users.slice().sort((a,b) => b.points - a.points).slice(0, 3).map((w, idx) => {
                  const medals = ['🥇 1st Rank', '🥈 2nd Rank', '🥉 3rd Rank'];
                  const borders = ['border-yellow-400/50 bg-black/40', 'border-stone-400/40 bg-black/40', 'border-amber-600/40 bg-black/40'];
                  
                  return (
                    <div key={w.id} className={`p-4 rounded-2xl border-2 ${borders[idx]} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-300">{medals[idx]}</span>
                        <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                          {idx === 0 ? `₹${pointRules.firstPrize || 100} नकद` : idx === 1 ? `₹${pointRules.secondPrize || 50} नकद` : `₹${pointRules.thirdPrize || 20} नकद`}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-stone-800 border border-amber-400/50 shrink-0 flex items-center justify-center">
                          {w.photoUrl ? (
                            <img src={w.photoUrl} alt={w.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-stone-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">{w.name}</h4>
                          <p className="text-[10px] text-stone-400 truncate">{w.email}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-1">
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 truncate max-w-[150px]">
                          <CreditCard className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="font-mono text-emerald-300 font-bold">{w.upiId || 'UPI दर्ज नहीं'}</span>
                        </span>
                        {w.upiId && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(w.upiId);
                              showToast(`'${w.name}' की UPI ID (${w.upiId}) कॉपी हो गई!`);
                            }}
                            className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold transition cursor-pointer"
                          >
                            कॉपी
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Point Rules Configuration Box */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5 space-y-4">
              <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>पॉइंट्स नियम व मासिक पुरस्कार राशि सेटिंग्स (Rules Configuration)</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">WhatsApp शेयर अंक</label>
                  <input
                    type="number"
                    value={pointRules.whatsappShare}
                    onChange={(e) => setPointRules({ ...pointRules, whatsappShare: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">WhatsApp स्टेटस शेयर</label>
                  <input
                    type="number"
                    value={pointRules.statusShare}
                    onChange={(e) => setPointRules({ ...pointRules, statusShare: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">लिंक कॉपी करने पर अंक</label>
                  <input
                    type="number"
                    value={pointRules.copyLink}
                    onChange={(e) => setPointRules({ ...pointRules, copyLink: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">साइनअप वेलकम बोनस</label>
                  <input
                    type="number"
                    value={pointRules.signupBonus}
                    onChange={(e) => setPointRules({ ...pointRules, signupBonus: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">🥇 1st पुरस्कार (₹)</label>
                  <input
                    type="number"
                    value={pointRules.firstPrize ?? 100}
                    onChange={(e) => setPointRules({ ...pointRules, firstPrize: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">🥈 2nd पुरस्कार (₹)</label>
                  <input
                    type="number"
                    value={pointRules.secondPrize ?? 50}
                    onChange={(e) => setPointRules({ ...pointRules, secondPrize: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">🥉 3rd पुरस्कार (₹)</label>
                  <input
                    type="number"
                    value={pointRules.thirdPrize ?? 20}
                    onChange={(e) => setPointRules({ ...pointRules, thirdPrize: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-bold mb-1">मासिक पुरस्कार शीर्षक</label>
                  <input
                    type="text"
                    value={pointRules.monthlyRewardTitle}
                    onChange={(e) => setPointRules({ ...pointRules, monthlyRewardTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-bold mb-1">मासिक पुरस्कार राशि विवरण</label>
                  <input
                    type="text"
                    value={pointRules.monthlyRewardAmount}
                    onChange={(e) => setPointRules({ ...pointRules, monthlyRewardAmount: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSavePointRules(pointRules)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  💾 पॉइंट्स सेटिंग्स सहेजें
                </button>
              </div>
            </div>

            {/* All Users Table & Search */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>सभी पंजीकृत सदस्य (All Registered Users)</span>
                </h4>

                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="नाम, ईमेल या UPI ID खोजें..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Users List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-3">रैंक / यूज़र</th>
                      <th className="py-3 px-3">ईमेल पता</th>
                      <th className="py-3 px-3">इनाम UPI ID</th>
                      <th className="py-3 px-3 text-center">अंक (Points)</th>
                      <th className="py-3 px-3 text-center">शेयर्स</th>
                      <th className="py-3 px-3 text-right">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80">
                    {users
                      .slice()
                      .sort((a,b) => b.points - a.points)
                      .filter(u => {
                        const q = userSearch.toLowerCase();
                        return (
                          u.name.toLowerCase().includes(q) ||
                          u.email.toLowerCase().includes(q) ||
                          u.upiId.toLowerCase().includes(q)
                        );
                      })
                      .map((u, idx) => (
                        <tr key={u.id} className="hover:bg-stone-900/80 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs font-bold text-amber-400 w-5">
                                #{idx + 1}
                              </span>
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-800 border border-stone-700 shrink-0 flex items-center justify-center">
                                {u.photoUrl ? (
                                  <img src={u.photoUrl} alt={u.name} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-4 h-4 text-stone-400" />
                                )}
                              </div>
                              <span className="font-semibold text-white truncate max-w-[130px]">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-stone-400 font-mono text-[11px] truncate max-w-[150px]">
                            {u.email}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-emerald-300 text-[11px] font-semibold truncate max-w-[130px]" title={u.upiId}>
                                {u.upiId || '—'}
                              </span>
                              {u.upiId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(u.upiId);
                                    showToast(`${u.upiId} कॉपी हो गया!`);
                                  }}
                                  className="text-stone-400 hover:text-amber-300 cursor-pointer"
                                  title="UPI ID कॉपी करें"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-bold text-amber-400 font-mono text-sm">{u.points}</span>
                              <div className="flex flex-col gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddPoints(u.id, 50)}
                                  className="text-[9px] bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-1 rounded font-bold cursor-pointer"
                                  title="+50 अंक जोड़ें"
                                >
                                  +50
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddPoints(u.id, -50)}
                                  className="text-[9px] bg-red-950/40 hover:bg-red-900/60 text-red-300 px-1 rounded font-bold cursor-pointer"
                                  title="-50 अंक घटाएँ"
                                >
                                  -50
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-stone-300 font-semibold">
                            {u.sharesCount}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingUser(u)}
                                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer"
                                title="यूज़र विवरण एडिट करें"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 transition cursor-pointer"
                                title="यूज़र हटाएँ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PHOTOS & DEITY SLIDER MANAGEMENT (REORDER & UPLOAD) */}
        {/* ========================================================= */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            
            {/* Festival Selector Bar */}
            <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  1. किस त्योहार के भगवान / फ़ोटो मैनेज करने हैं?
                </label>
                <select
                  value={selectedFestivalForPhotos}
                  onChange={(e) => setSelectedFestivalForPhotos(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-stone-950 border border-amber-500/40 text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {festivals.map(f => (
                    <option key={f.id} value={f.id}>{f.nameHi} ({f.dateLabel})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingSlide({
                    id: `slide_${Date.now()}`,
                    godName: 'नया भगवान / दिव्य स्वरूप',
                    title: 'दिव्य स्वरूप पावन दर्शन',
                    tagline: 'भक्तों की मनोकामना पूर्ण करने वाले',
                    badge: '✨ पावन दर्शन',
                    mantra: '॥ ॐ नमो भगवते वासुदेवाय नमः ॥',
                    imageUrl: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?auto=format&fit=crop&w=1200&q=80'
                  });
                  setIsAddingSlide(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ नई फ़ोटो / भगवान जोड़ें</span>
              </button>
            </div>

            {/* Reorder / Manage Instructions */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center justify-between">
              <span>
                💡 <strong>फ़ोटो का क्रम बदलें:</strong> जिस फ़ोटो को पहले दिखाना चाहते हैं, उसके <strong>⬆️ (ऊपर)</strong> बटन पर क्लिक करें। यह 6 सेकंड के ऑटो-स्लाइडर में उसी क्रम में दिखेगी!
              </span>
              <span className="font-bold shrink-0 ml-2">कुल: {deitySlides.length} फ़ोटो</span>
            </div>

            {/* List of Deity Slides for this festival */}
            <div className="space-y-3">
              {deitySlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="rounded-2xl border border-stone-800 bg-stone-900/70 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Position Badge */}
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                      #{idx + 1}
                    </div>

                    {/* Image Preview Thumbnail */}
                    <div className="w-20 sm:w-28 aspect-video rounded-xl overflow-hidden shrink-0 border border-amber-500/40 bg-black">
                      <img
                        src={slide.imageUrl}
                        alt={slide.godName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white font-serif truncate">
                          {slide.godName}
                        </h4>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                          {slide.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300 truncate">
                        {slide.title}
                      </p>
                      <p className="text-[10px] text-amber-200/70 font-mono truncate">
                        {slide.mantra}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Reorder (Up/Down), Edit, Delete */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleMoveSlide(idx, 'up')}
                      disabled={idx === 0}
                      title="ऊपर ले जाएँ (Move Up)"
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 cursor-pointer transition"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSlide(idx, 'down')}
                      disabled={idx === deitySlides.length - 1}
                      title="नीचे ले जाएँ (Move Down)"
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 cursor-pointer transition"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingSlide(slide);
                        setIsAddingSlide(false);
                      }}
                      title="फ़ोटो बदलें / एडिट"
                      className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 cursor-pointer transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      title="डिलीट करें"
                      className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 cursor-pointer transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {deitySlides.length === 0 && (
                <div className="text-center py-12 bg-stone-900/40 rounded-2xl border border-stone-800">
                  <p className="text-sm text-stone-400">इस त्योहार के लिए अभी कोई फ़ोटो नहीं है।</p>
                  <button
                    onClick={() => setIsAddingSlide(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                  >
                    + पहली फ़ोटो जोड़ें
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CATEGORIES REORDER & MANAGEMENT                    */}
        {/* ========================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
              <div>
                <h3 className="text-sm font-bold text-white">नेविगेशन श्रेणियाँ (Categories)</h3>
                <p className="text-xs text-stone-400">ड्रॉपडाउन मेनू में कौन सी श्रेणी पहले दिखेगी, यहाँ से 1-क्लिक में बदलें</p>
              </div>

              <button
                onClick={() => {
                  setEditingCategory({
                    id: `cat_${Date.now()}` as FestivalCategory,
                    nameHi: 'नई श्रेणी',
                    nameEn: 'New Category',
                    icon: '✨',
                    badge: 'उत्सव',
                    description: 'विवरण...'
                  });
                  setIsAddingCategory(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ नई श्रेणी</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-stone-800 bg-stone-900/70 p-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs text-stone-500 font-mono">#{idx + 1}</span>
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{cat.nameHi} ({cat.nameEn})</p>
                      <p className="text-xs text-stone-400">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveCategory(idx, 'up')}
                      disabled={idx === 0}
                      title="ऊपर ले जाएँ"
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-stone-300" />
                    </button>
                    <button
                      onClick={() => handleMoveCategory(idx, 'down')}
                      disabled={idx === categories.length - 1}
                      title="नीचे ले जाएँ"
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-stone-300" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsAddingCategory(false);
                      }}
                      className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: AD MANAGEMENT (Google AdSense & Ad Networks)       */}
        {/* ========================================================= */}
        {activeTab === 'ads' && (
          <div className="space-y-6 max-w-5xl">
            {/* Top Info Banner */}
            <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-stone-900/90 to-yellow-950/40 p-5 sm:p-6 shadow-xl space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
                    📢 विज्ञापन प्रबंधन (Google AdSense & Ad Networks)
                  </h3>
                  <p className="text-xs text-stone-300">
                    Google AdSense, Adsterra, Media.net या किसी भी विज्ञापन नेटवर्क के कोड यहाँ जोड़ें, जब चाहें रोकें या हटाएँ।
                  </p>
                </div>
              </div>
            </div>

            {/* Global Master Switch */}
            <div className={`rounded-3xl border-2 p-5 sm:p-6 transition-all shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              adSettings.adsEnabled 
                ? 'border-emerald-500/50 bg-emerald-950/20 shadow-emerald-500/10' 
                : 'border-stone-800 bg-stone-900/60'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white font-serif">
                    सभी विज्ञापनों का मास्टर स्विच (Global Master Switch)
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    adSettings.adsEnabled 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-stone-800 text-stone-400 border border-stone-700'
                  }`}>
                    {adSettings.adsEnabled ? '🟢 चालू (Active)' : '⏸️ बंद (Paused)'}
                  </span>
                </div>
                <p className="text-xs text-stone-300 max-w-xl">
                  {adSettings.adsEnabled 
                    ? 'आपकी वेबसाइट पर सभी सक्षम विज्ञापन स्लॉट्स लाइव दिखाए जा रहे हैं।' 
                    : 'वेबसाइट पर सभी विज्ञापन अभी बंद हैं। यूज़र्स को एक भी विज्ञापन नहीं दिखेगा।'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleMasterAds}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg ${
                    adSettings.adsEnabled
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600'
                  }`}
                >
                  {adSettings.adsEnabled ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-stone-950" />
                      <span>विज्ञापन चालू हैं (चालू रखें)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-stone-400" />
                      <span>विज्ञापन अभी बंद हैं (चालू करें)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 1. Global Head Script (Google AdSense Auto-Ads / Verification) */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/80 p-5 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-amber-300 font-serif">
                    1. Google AdSense ग्लोबल स्क्रिप्ट / Auto-Ads / Verification Code
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleInsertSampleHeaderScript}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>📋 सैंपल कोड भरें</span>
                  </button>
                  {adSettings.headerScript && (
                    <button
                      type="button"
                      onClick={() => {
                        setAdSettings(prev => ({ ...prev, headerScript: '' }));
                        showToast('ग्लोबल स्क्रिप्ट हटा दी गई!');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>हटाएँ</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-stone-300">
                Google AdSense में वेबसाइट जोड़ने पर मिलने वाला मुख्य पब्लिशर स्क्रिप्ट कोड (उदा. <code className="text-amber-300 font-mono text-[11px]">&lt;script async src="https://pagead2.googlesyndication.com/..."&gt;&lt;/script&gt;</code>) यहाँ पेस्ट करें। यह आपकी पूरी वेबसाइट के <code className="text-amber-300 font-mono text-[11px]">&lt;head&gt;</code> में जुड़ जाएगा।
              </p>

              <textarea
                value={adSettings.headerScript}
                onChange={(e) => setAdSettings({ ...adSettings, headerScript: e.target.value })}
                placeholder={`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>`}
                rows={4}
                className="w-full p-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
              />
            </div>

            {/* 2. Banner Slots Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>2. विशेष बैनर विज्ञापन स्लॉट्स (Banner Ad Slots)</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    प्रत्येक स्थान के लिए अलग कोड डालें या जब चाहें उस विशेष स्लॉट को बंद या चालू करें:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(adSettings.slots) as AdSlotId[]).map((slotId) => {
                  const slot = adSettings.slots[slotId];
                  const hasCode = slot.code.trim().length > 0;
                  const isPreview = activePreviewSlot === slotId;

                  return (
                    <div
                      key={slotId}
                      className={`rounded-3xl border p-5 space-y-3.5 transition-all flex flex-col justify-between ${
                        slot.enabled && hasCode
                          ? 'border-amber-500/40 bg-stone-900/90 shadow-lg'
                          : 'border-stone-800 bg-stone-900/40'
                      }`}
                    >
                      {/* Slot Header */}
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-white font-serif">
                                {slot.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                              अनुशंसित साइज़: {slot.recommendedSize}
                            </span>
                          </div>

                          {/* Enable/Disable Toggle */}
                          <button
                            type="button"
                            onClick={() => handleUpdateAdSlot(slotId, { enabled: !slot.enabled })}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                              slot.enabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-stone-800 text-stone-400 border border-stone-700'
                            }`}
                          >
                            {slot.enabled ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>सक्रिय</span>
                              </>
                            ) : (
                              <span>निष्क्रिय (Off)</span>
                            )}
                          </button>
                        </div>

                        <p className="text-[11px] text-stone-300">
                          {slot.description}
                        </p>
                      </div>

                      {/* Code Textarea */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-400 font-semibold">विज्ञापन कोड (HTML / JS):</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleInsertSampleSlot(slotId)}
                              className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                            >
                              सैंपल AdSense कोड
                            </button>
                            {hasCode && (
                              <>
                                <span className="text-stone-600">·</span>
                                <button
                                  type="button"
                                  onClick={() => handleClearSlotCode(slotId)}
                                  className="text-red-400 hover:text-red-300 underline font-medium cursor-pointer"
                                >
                                  कोड हटाएं
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <textarea
                          value={slot.code}
                          onChange={(e) => handleUpdateAdSlot(slotId, { code: e.target.value })}
                          placeholder={`यहाँ AdSense / Adsterra बैनर कोड पेस्ट करें...
उदा: <ins class="adsbygoogle" ...></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`}
                          rows={4}
                          className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* Preview toggle & quick helper */}
                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                        <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                          hasCode ? 'text-emerald-400' : 'text-stone-500'
                        }`}>
                          {hasCode ? '✓ कोड मौजूद है' : '○ कोई कोड नहीं डाला गया'}
                        </span>

                        <button
                          type="button"
                          onClick={() => setActivePreviewSlot(isPreview ? null : slotId)}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>{isPreview ? 'प्रिव्यू छिपाएँ' : 'प्रिव्यू देखें'}</span>
                        </button>
                      </div>

                      {/* Live Slot Preview Box */}
                      {isPreview && (
                        <div className="p-3 rounded-2xl bg-black border border-dashed border-amber-500/40 text-center space-y-1.5 animate-fade-in">
                          <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                            विज्ञापन पूर्वावलोकन (Preview)
                          </span>
                          {hasCode ? (
                            <div className="p-2 bg-stone-950 rounded border border-stone-800 text-[11px] text-stone-400 font-mono overflow-x-auto text-left max-h-24">
                              {slot.code}
                            </div>
                          ) : (
                            <p className="text-[11px] text-stone-500 italic py-2">
                              पूर्वावलोकन देखने के लिए कृपया ऊपर कोई कोड पेस्ट करें या "सैंपल AdSense कोड" पर क्लिक करें।
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="sticky bottom-0 z-20 rounded-3xl border border-amber-500/40 bg-stone-950/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>बदलाव करने के बाद "सेव करें" दबाएँ ताकि पूरी वेबसाइट पर तुरंत विज्ञापन अपडेट हो जाएँ।</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClearAllAds}
                  className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>सभी कोड हटाएं</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveAdSettings()}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>💾 विज्ञापन सेटिंग्स सहेजें (Save All)</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BACKUP, RESTORE & SECURITY PIN                     */}
        {/* ========================================================= */}
        {activeTab === 'backup' && (
          <div className="space-y-6 max-w-3xl">
            
            {/* Backup & Restore Box */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-5 space-y-4">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                <span>1-क्लिक बैकअप डाउनलोड व रिस्टोर</span>
              </h3>
              <p className="text-xs text-stone-300">
                आपकी सभी जोड़ी गई फ़ोटो, नए त्योहार और सेटिंग्स सुरक्षित रखने के लिए JSON बैकअप डाउनलोड कर सकते हैं:
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownloadBackup}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>पूरा बैकअप डाउनलोड करें (JSON)</span>
                </button>

                <input
                  type="file"
                  ref={backupFileInputRef}
                  onChange={handleImportBackup}
                  accept=".json"
                  className="hidden"
                />

                <button
                  onClick={() => backupFileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>बैकअप फ़ाइल अपलोड करें</span>
                </button>
              </div>
            </div>

            {/* Factory Reset */}
            <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-5 space-y-3">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>फ़ैक्टरी रीसेट (Restore Original Defaults)</span>
              </h3>
              <p className="text-xs text-stone-400">
                अगर कुछ गड़बड़ हो जाए और आप सब कुछ हटाकर दोबारा ओरिजिनल पोर्टल जैसा बनाना चाहते हैं:
              </p>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-900 border border-red-500/40 text-red-200 font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ओरिजिनल डिफ़ॉल्ट डेटा रीसेट करें</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* EDIT / ADD FESTIVAL MODAL                                 */}
      {/* ========================================================= */}
      {(editingFestival || isAddingFestival) && editingFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-amber-500/40 bg-stone-950 p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-bold text-amber-300 font-serif">
                {isAddingFestival ? '✨ नया त्योहार जोड़ें' : `✏️ '${editingFestival.nameHi}' एडिट करें`}
              </h3>
              <button
                onClick={() => {
                  setEditingFestival(null);
                  setIsAddingFestival(false);
                }}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">त्योहार का नाम (हिंदी)</label>
                <input
                  type="text"
                  value={editingFestival.nameHi}
                  onChange={(e) => setEditingFestival({ ...editingFestival, nameHi: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Name (English)</label>
                <input
                  type="text"
                  value={editingFestival.nameEn}
                  onChange={(e) => setEditingFestival({ ...editingFestival, nameEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">श्रेणी (Category)</label>
                <select
                  value={editingFestival.category}
                  onChange={(e) => setEditingFestival({ ...editingFestival, category: e.target.value as FestivalCategory })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-300"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.nameHi}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">तारीख / तिथि (Date Label)</label>
                <input
                  type="text"
                  value={editingFestival.dateLabel}
                  onChange={(e) => setEditingFestival({ ...editingFestival, dateLabel: e.target.value })}
                  placeholder="उदा: कार्तिक अमावस्या / 14 अप्रैल"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-bold mb-1">टैगलाइन / उपशीर्षक</label>
                <input
                  type="text"
                  value={editingFestival.taglineHi}
                  onChange={(e) => setEditingFestival({ ...editingFestival, taglineHi: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-bold mb-1">मुख्य हीरो फ़ोटो (Hero Image)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingFestival.heroImage}
                    onChange={(e) => setEditingFestival({ ...editingFestival, heroImage: e.target.value })}
                    placeholder="फ़ोटो URL पेस्ट करें..."
                    className="flex-1 p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUploadForFestival(e, 'heroImage')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold shrink-0 flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>अपलोड</span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-bold mb-1">डिफ़ॉल्ट कविता / शुभकामना संदेश</label>
                <textarea
                  rows={3}
                  value={editingFestival.defaultPoem}
                  onChange={(e) => setEditingFestival({ ...editingFestival, defaultPoem: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-bold mb-1">पवित्र मंत्र / श्लोक</label>
                <input
                  type="text"
                  value={editingFestival.mantraOrShloka || ''}
                  onChange={(e) => setEditingFestival({ ...editingFestival, mantraOrShloka: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-bold mb-1">
                  ✨ विज़ुअल एनीमेशन इफ़ेक्ट (Festive Animation FX)
                </label>
                <select
                  value={editingFestival.particlesType || 'diyas'}
                  onChange={(e) => setEditingFestival({ ...editingFestival, particlesType: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-300 font-bold"
                >
                  <option value="fireworks">🎆 आतिशबाजी व पटाखे (Diwali Fireworks & Crackers)</option>
                  <option value="colors">🎨 रंग व गुलाल ब्लास्ट (Holi Color Blast & Pichkari)</option>
                  <option value="diyas">🪔 पावन दीये व दिव्य ज्योति (Holy Diyas & Embers)</option>
                  <option value="flowers">🌸 फूलों की वर्षा व पंखुड़ियाँ (Flower Petals)</option>
                  <option value="stars">✨ दिव्य सितारे व चाँदनी (Twinkling Stars)</option>
                  <option value="confetti">🎉 रंग-बिरंगी कन्फेटी व रिबन (Confetti Celebration)</option>
                </select>
              </div>

              {/* FESTIVE AUDIO & SOUND CONFIGURATION */}
              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-black/50 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <span>🎵 बैकग्राउंड संगीत / ध्वनि (Background Audio)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTestAudio(
                      `modal_${editingFestival.id}`,
                      editingFestival.soundType || 'aarti',
                      editingFestival.customAudioUrl
                    )}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    {testingAudioKey === `modal_${editingFestival.id}` ? (
                      <>
                        <Pause className="w-3 h-3 text-yellow-300" />
                        <span>रोकें (Playing...)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-purple-300 fill-purple-300" />
                        <span>▶️ टेस्ट ऑडियो सुनें</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      ध्वनि का प्रकार (Sound Type):
                    </label>
                    <select
                      value={editingFestival.soundType || 'aarti'}
                      onChange={(e) => setEditingFestival({ ...editingFestival, soundType: e.target.value as FestiveSoundType })}
                      className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-amber-300 font-bold focus:outline-none focus:border-purple-400 cursor-pointer"
                    >
                      {FESTIVE_SOUND_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.icon} {opt.labelHi}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      कस्टम MP3 URL (वैकल्पिक):
                    </label>
                    <input
                      type="url"
                      value={editingFestival.customAudioUrl || ''}
                      onChange={(e) => setEditingFestival({ ...editingFestival, customAudioUrl: e.target.value })}
                      placeholder="https://.../audio.mp3"
                      className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 font-mono focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Direct Audio File Upload Control */}
                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>फोन या कंप्यूटर से गाना अपलोड करें (Upload MP3 File):</span>
                    </span>
                    {editingFestival.customAudioUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingFestival({ ...editingFestival, customAudioUrl: undefined, soundType: 'aarti' })}
                        className="text-[10px] text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                      >
                        हटाएं
                      </button>
                    )}
                  </div>

                  <label className="w-full px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md">
                    <Upload className="w-3.5 h-3.5 text-purple-400" />
                    <span>📂 डिवाइस से ऑडियो फ़ाइल चुनें (Choose MP3 / Audio File)</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                      className="hidden"
                      onChange={handleModalFestivalAudioUpload}
                    />
                  </label>

                  {editingFestival.customAudioUrl && (
                    <div className="p-2 rounded-xl bg-black/60 border border-emerald-500/40 flex items-center justify-between gap-1 text-[11px]">
                      <span className="text-emerald-300 font-mono truncate flex items-center gap-1.5">
                        <span className="text-sm">🎵</span>
                        <span className="font-bold truncate">
                          {getUploadedAudioFileName(`fest_${editingFestival.id}`) || 'कस्टम ऑडियो फ़ाइल लोड है'}
                        </span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30 shrink-0">
                        सक्रिय
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingFestival(null);
                  setIsAddingFestival(false);
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 text-xs font-semibold"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => handleSaveFestival(editingFestival)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md"
              >
                सेव करें ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT / ADD DEITY SLIDE MODAL                              */}
      {/* ========================================================= */}
      {(editingSlide || isAddingSlide) && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border-2 border-amber-500/40 bg-stone-950 p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-bold text-amber-300 font-serif">
                {isAddingSlide ? '✨ नए भगवान / फ़ोटो जोड़ें' : `✏️ '${editingSlide.godName}' एडिट करें`}
              </h3>
              <button
                onClick={() => {
                  setEditingSlide(null);
                  setIsAddingSlide(false);
                }}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">भगवान / महापुरुष का नाम</label>
                <input
                  type="text"
                  value={editingSlide.godName}
                  onChange={(e) => setEditingSlide({ ...editingSlide, godName: e.target.value })}
                  placeholder="उदा: माँ महालक्ष्मी / भगवान श्री गणेश"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">शीर्षक (Title on Slide)</label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="उदा: माँ महालक्ष्मी दिव्य दर्शन • धनवर्षा"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">बैज (Badge)</label>
                <input
                  type="text"
                  value={editingSlide.badge}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                  placeholder="उदा: 🌸 धनलक्ष्मी / 🐘 विघ्नहर्ता"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-300"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">पवित्र मंत्र / संदेश</label>
                <input
                  type="text"
                  value={editingSlide.mantra}
                  onChange={(e) => setEditingSlide({ ...editingSlide, mantra: e.target.value })}
                  placeholder="उदा: ॥ ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः ॥"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-300"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">फ़ोटो (Image File or URL)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingSlide.imageUrl}
                    onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                    placeholder="फ़ोटो URL या नीचे से अपलोड करें..."
                    className="flex-1 p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                  />
                  <input
                    type="file"
                    id="slideFileInput"
                    onChange={handleUploadSlideImage}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('slideFileInput')?.click()}
                    className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold shrink-0 flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>गैलरी से चुनें</span>
                  </button>
                </div>
              </div>

              {/* Preview Thumbnail */}
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-3">
                <div className="w-20 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-amber-500/30">
                  <img src={editingSlide.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] text-stone-400">फ़ोटो का लाइव प्रीव्यू</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingSlide(null);
                  setIsAddingSlide(false);
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 text-xs font-semibold"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => handleSaveSlide(editingSlide)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md"
              >
                सेव करें ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT / ADD CATEGORY MODAL                                 */}
      {/* ========================================================= */}
      {(editingCategory || isAddingCategory) && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border-2 border-amber-500/40 bg-stone-950 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-amber-300 font-serif">
              {isAddingCategory ? '✨ नई श्रेणी जोड़ें' : `✏️ '${editingCategory.nameHi}' एडिट करें`}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">श्रेणी का नाम (हिंदी)</label>
                <input
                  type="text"
                  value={editingCategory.nameHi}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameHi: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Category Name (English)</label>
                <input
                  type="text"
                  value={editingCategory.nameEn}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">आइकन (Emoji Icon)</label>
                <input
                  type="text"
                  value={editingCategory.icon}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  placeholder="उदा: 🪔 / 🌙 / ✝️ / ☬ / 🇮🇳"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-2xl text-center"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">विवरण</label>
                <input
                  type="text"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setIsAddingCategory(false);
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 text-xs font-semibold"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => handleSaveCategory(editingCategory)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md"
              >
                सेव करें ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT / ADD SEO WISH CATEGORY & URL MODAL                  */}
      {/* ========================================================= */}
      {(editingWishCategory || isAddingWishCategory) && editingWishCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-amber-500/40 bg-stone-950 p-5 sm:p-7 shadow-2xl space-y-5 my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{editingWishCategory.theme?.accentEmoji || '📄'}</span>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">
                    {isAddingWishCategory 
                      ? '✨ नया SEO विशिंग पेज बनाएं' 
                      : `✏️ '${editingWishCategory.nameHi}' का नाम, URL व कंटेंट एडिट करें`}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono">
                    /{editingWishCategory.slug}/
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingWishCategory(null);
                  setIsAddingWishCategory(false);
                  setOriginalSlugForEdit(null);
                }}
                className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              
              {/* 1. Hindi Page Name */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  पेज का नाम (हिंदी - Page Name) *
                </label>
                <input
                  type="text"
                  required
                  value={editingWishCategory.nameHi}
                  onChange={(e) => setEditingWishCategory({ ...editingWishCategory, nameHi: e.target.value })}
                  placeholder="उदा. माँ के लिए जन्मदिन की शुभकामनाएं"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 2. English Page Name */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Page Name (English)
                </label>
                <input
                  type="text"
                  value={editingWishCategory.nameEn}
                  onChange={(e) => setEditingWishCategory({ ...editingWishCategory, nameEn: e.target.value })}
                  placeholder="उदा. Birthday Wishes for Mother"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 3. Customizable URL SLUG (THE MAIN USER REQUIREMENT) */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-amber-300">
                  🔗 पेज का URL Slug (वेब एड्रेस / Link) *
                </label>
                <div className="flex items-center">
                  <span className="bg-stone-900 border border-r-0 border-stone-700 px-3 py-2.5 text-stone-400 font-mono text-xs rounded-l-xl select-none">
                    https://shubhakamna.in/
                  </span>
                  <input
                    type="text"
                    required
                    value={editingWishCategory.slug}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
                      setEditingWishCategory({ ...editingWishCategory, slug: clean });
                    }}
                    placeholder="birthday-wishes-for-mother"
                    className="flex-1 bg-stone-950 border border-stone-700 py-2.5 px-3 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                  <span className="bg-stone-900 border border-l-0 border-stone-700 px-3 py-2.5 text-stone-400 font-mono text-xs rounded-r-xl select-none">
                    /
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  👉 आप अपनी पसंद के अनुसार कोई भी URL रख सकते हैं (उदा: <span className="font-mono text-amber-300">maa-ke-janamdin-ki-shubhakamnaye</span> या <span className="font-mono text-amber-300">diwali-wishes-2026</span>)।
                </p>
              </div>

              {/* 4. Parent Category (Breadcrumb Hierarchy) */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  पैरेंट पेज (ब्रेडक्रम्ब्स हेतु)
                </label>
                <select
                  value={editingWishCategory.parentSlug || ''}
                  onChange={(e) => setEditingWishCategory({ ...editingWishCategory, parentSlug: e.target.value || undefined })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="">कोई नहीं (Top Level Hub)</option>
                  {wishCategories
                    .filter(c => c.slug !== editingWishCategory.slug)
                    .map(c => (
                      <option key={c.slug} value={c.slug}>
                        {c.nameHi} (/{c.slug}/)
                      </option>
                    ))}
                </select>
              </div>

              {/* 5. Emoji & Icon */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  इमोजी / आइकॉन (Emoji Motif)
                </label>
                <input
                  type="text"
                  value={editingWishCategory.theme?.accentEmoji || '✨'}
                  onChange={(e) => setEditingWishCategory({
                    ...editingWishCategory,
                    theme: {
                      ...editingWishCategory.theme,
                      accentEmoji: e.target.value || '✨'
                    }
                  })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white text-base focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 6. SEO Title */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-300 font-bold">
                    SEO Meta Title (&lt;title&gt;) *
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {editingWishCategory.seoTitle?.length || 0} / 60 अक्षर
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={editingWishCategory.seoTitle}
                  onChange={(e) => setEditingWishCategory({ ...editingWishCategory, seoTitle: e.target.value })}
                  placeholder="उदा. माँ के जन्मदिन की शुभकामनाएं | Birthday Wishes for Mother in Hindi"
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 7. SEO Meta Description */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-300 font-bold">
                    SEO Meta Description (&lt;meta name="description"&gt;) *
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {editingWishCategory.metaDescription?.length || 0} / 155 अक्षर
                  </span>
                </div>
                <textarea
                  rows={2}
                  required
                  value={editingWishCategory.metaDescription}
                  onChange={(e) => setEditingWishCategory({ ...editingWishCategory, metaDescription: e.target.value })}
                  placeholder="पेज का आकर्षक विवरण जो Google सर्च व WhatsApp शेयर में दिखेगा..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 8. Main H1 Heading */}
              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-bold mb-1">
                  मुख्य H1 Heading (Page Heading) *
                </label>
                <input
                  type="text"
                  required
                  value={editingWishCategory.h1}
                  onChange={(e) => setEditingWishCategory({ ...editingWishCategory, h1: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 9. Intro Paragraph (Crawlable Content) */}
              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-bold mb-1">
                  परिचय पैराग्राफ (Introductory Crawlable Content) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingWishCategory.intro}
                  onChange={(e) => setEditingWishCategory({ ...editingWishCategory, intro: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 10. Hero Image URL */}
              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-bold mb-1">
                  हेरो बैनर इमेज URL (Hero Banner Image)
                </label>
                <input
                  type="url"
                  value={editingWishCategory.heroImageUrl}
                  onChange={(e) => setEditingWishCategory({ ...editingWishCategory, heroImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 10.1 Category Audio / Song Configuration */}
              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-black/50 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <span>🎵 बैकग्राउंड संगीत / ध्वनि (Background Audio)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTestAudio(
                      `modal_wish_${editingWishCategory.slug}`,
                      editingWishCategory.soundType || (editingWishCategory.slug.includes('birthday') ? 'birthday' : 'flute'),
                      editingWishCategory.customAudioUrl
                    )}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    {testingAudioKey === `modal_wish_${editingWishCategory.slug}` ? (
                      <>
                        <Pause className="w-3 h-3 text-yellow-300" />
                        <span>रोकें (Playing...)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-purple-300 fill-purple-300" />
                        <span>▶️ टेस्ट ऑडियो सुनें</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      ध्वनि का प्रकार (Sound Type):
                    </label>
                    <select
                      value={editingWishCategory.soundType || (editingWishCategory.slug.includes('birthday') ? 'birthday' : 'flute')}
                      onChange={(e) => setEditingWishCategory({ ...editingWishCategory, soundType: e.target.value as FestiveSoundType })}
                      className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-amber-300 font-bold focus:outline-none focus:border-purple-400 cursor-pointer"
                    >
                      {FESTIVE_SOUND_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.icon} {opt.labelHi}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      कस्टम MP3 URL (वैकल्पिक):
                    </label>
                    <input
                      type="url"
                      value={editingWishCategory.customAudioUrl || ''}
                      onChange={(e) => setEditingWishCategory({ ...editingWishCategory, customAudioUrl: e.target.value })}
                      placeholder="https://.../song.mp3"
                      className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 font-mono focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Direct Audio File Upload Control */}
                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>फोन या कंप्यूटर से गाना अपलोड करें (Upload MP3 File):</span>
                    </span>
                    {editingWishCategory.customAudioUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const defaultSound: FestiveSoundType = editingWishCategory.slug.includes('birthday') ? 'birthday' : 'flute';
                          setEditingWishCategory({ ...editingWishCategory, customAudioUrl: undefined, soundType: defaultSound });
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                      >
                        हटाएं
                      </button>
                    )}
                  </div>

                  <label className="w-full px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md">
                    <Upload className="w-3.5 h-3.5 text-purple-400" />
                    <span>📂 डिवाइस से ऑडियो फ़ाइल चुनें (Choose MP3 / Audio File)</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                      className="hidden"
                      onChange={handleModalWishCategoryAudioUpload}
                    />
                  </label>

                  {editingWishCategory.customAudioUrl && (
                    <div className="p-2 rounded-xl bg-black/60 border border-emerald-500/40 flex items-center justify-between gap-1 text-[11px]">
                      <span className="text-emerald-300 font-mono truncate flex items-center gap-1.5">
                        <span className="text-sm">🎵</span>
                        <span className="font-bold truncate">
                          {getUploadedAudioFileName(`wish_${editingWishCategory.slug}`) || 'कस्टम ऑडियो फ़ाइल लोड है'}
                        </span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30 shrink-0">
                        सक्रिय
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* 11. Wishes & Shayari Manager */}
            <div className="space-y-3 pt-3 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>शुभकामना संदेश व शायरी संग्रह ({editingWishCategory.wishes.length})</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const newWish: HindiWish = {
                      id: `wish_${Date.now()}_${editingWishCategory.wishes.length + 1}`,
                      hindiText: 'आपके जीवन में सदा खुशियां और सफलता बनी रहे। हार्दिक शुभकामनाएं!',
                      authorOrTone: 'शुभकामना'
                    };
                    setEditingWishCategory({
                      ...editingWishCategory,
                      wishes: [...editingWishCategory.wishes, newWish]
                    });
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> + नया संदेश जोड़ें
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {editingWishCategory.wishes.map((w, idx) => (
                  <div key={w.id || idx} className="p-3 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-amber-400 font-bold">संदेश #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={w.authorOrTone || ''}
                          onChange={(e) => {
                            const updated = [...editingWishCategory.wishes];
                            updated[idx] = { ...updated[idx], authorOrTone: e.target.value };
                            setEditingWishCategory({ ...editingWishCategory, wishes: updated });
                          }}
                          placeholder="टोन: उदा. भावुक, शायरी..."
                          className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-[10px] text-stone-300 w-28"
                        />
                        {editingWishCategory.wishes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingWishCategory.wishes.filter((_, i) => i !== idx);
                              setEditingWishCategory({ ...editingWishCategory, wishes: updated });
                            }}
                            className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                            title="संदेश हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={w.hindiText}
                      onChange={(e) => {
                        const updated = [...editingWishCategory.wishes];
                        updated[idx] = { ...updated[idx], hindiText: e.target.value };
                        setEditingWishCategory({ ...editingWishCategory, wishes: updated });
                      }}
                      className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditingWishCategory(null);
                  setIsAddingWishCategory(false);
                  setOriginalSlugForEdit(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                रद्द करें
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!editingWishCategory.nameHi.trim() || !editingWishCategory.slug.trim()) {
                    alert('कृपया पेज का नाम और URL Slug अवश्य भरें!');
                    return;
                  }

                  const cleanSlug = editingWishCategory.slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
                  const toSave: WishCategory = {
                    ...editingWishCategory,
                    slug: cleanSlug,
                    nameHi: editingWishCategory.nameHi.trim(),
                    updatedAt: new Date().toISOString().slice(0, 10)
                  };

                  saveOrUpdateWishCategory(toSave, originalSlugForEdit || undefined);
                  setWishCategories(getStoredWishCategories());
                  setEditingWishCategory(null);
                  setIsAddingWishCategory(false);
                  setOriginalSlugForEdit(null);
                  showToast(`'${toSave.nameHi}' (/${toSave.slug}/) सफलतापूर्वक सहेजा गया! ✓`);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>💾 पेज व URL सहेजें (Save & Publish)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
