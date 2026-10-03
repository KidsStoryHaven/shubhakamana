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
  User
} from 'lucide-react';

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

  // Active Tab: 'festivals' | 'photos' | 'categories' | 'backup'
  const [activeTab, setActiveTab] = useState<'festivals' | 'photos' | 'categories' | 'backup'>('festivals');

  // Stored Data State
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

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
    return () => window.removeEventListener('shubhakamna_data_changed', handleDataChange);
  }, []);

  const loadAllData = () => {
    const fests = getStoredFestivals();
    const cats = getStoredCategories();
    setFestivals(fests);
    setCategories(cats);
    if (fests.length > 0 && !selectedFestivalForPhotos) {
      setSelectedFestivalForPhotos(fests[0].id);
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

  const handleImageUploadForFestival = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'heroImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (editingFestival) {
        setEditingFestival({ ...editingFestival, [targetField]: base64 });
      }
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

  const handleUploadSlideImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (editingSlide) {
        setEditingSlide({ ...editingSlide, imageUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
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

                    <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setSelectedFestivalForPhotos(fest.id);
                          setActiveTab('photos');
                        }}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <span>📸 फ़ोटो मैनेज करें</span>
                      </button>

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
        {/* TAB 2: PHOTOS & DEITY SLIDER MANAGEMENT (REORDER & UPLOAD) */}
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
        {/* TAB 4: BACKUP, RESTORE & SECURITY PIN                     */}
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

    </div>
  );
};
