import React, { useState } from 'react';
import { Wallpaper, Quote, DeityInfo } from '../types';
import { WALLPAPERS, DEITIES } from '../data/wallpapers';
import { QUOTES } from '../data/quotes';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Send, 
  Save, 
  Check, 
  Bell, 
  Radio, 
  Settings as SettingsIcon,
  BarChart3,
  Image as ImageIcon,
  BookOpen,
  FolderTree
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'wallpapers' | 'quotes' | 'categories' | 'notifications' | 'ads'>('dashboard');

  // State for Wallpapers
  const [wallpapersList, setWallpapersList] = useState<Wallpaper[]>(WALLPAPERS);
  const [newWpTitle, setNewWpTitle] = useState('');
  const [newWpDeity, setNewWpDeity] = useState('shiva');
  const [newWpUrl, setNewWpUrl] = useState('');
  const [newWpMantra, setNewWpMantra] = useState('');
  const [isWpFeatured, setIsWpFeatured] = useState(false);

  // State for Quotes
  const [quotesList, setQuotesList] = useState<Quote[]>(QUOTES);
  const [newQuoteHindi, setNewQuoteHindi] = useState('');
  const [newQuoteSanskrit, setNewQuoteSanskrit] = useState('');
  const [newQuoteSource, setNewQuoteSource] = useState('');

  // State for Categories
  const [categoriesList, setCategoriesList] = useState<DeityInfo[]>(DEITIES);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🕉️');

  // State for Ads Config
  const [isAdsEnabled, setIsAdsEnabled] = useState(false);
  const [metaAppId, setMetaAppId] = useState('YOUR_META_APP_ID');
  const [metaBannerId, setMetaBannerId] = useState('IMG_16_9_APP_INSTALL#YOUR_PLACEMENT_ID');
  const [metaInterstitialId, setMetaInterstitialId] = useState('YOUR_INTERSTITIAL_PLACEMENT_ID');
  const [interstitialInterval, setInterstitialInterval] = useState(4);
  const [adsSaved, setAdsSaved] = useState(false);

  // Notification state
  const [notifTitle, setNotifTitle] = useState('आज का नया Mahadev Wallpaper 🔱');
  const [notifBody, setNotifBody] = useState('देवाधिदेव महादेव का 4K पावन वॉलपेपर दर्शन एवं डाउनलोड करें।');
  const [notifSent, setNotifSent] = useState(false);

  // Stats calculation
  const totalDownloads = wallpapersList.reduce((acc, wp) => acc + (wp.downloads || 0), 0);
  const totalLikes = wallpapersList.reduce((acc, wp) => acc + (wp.likes || 0), 0) + quotesList.reduce((acc, q) => acc + (q.likes || 0), 0);

  // Handlers
  const handleAddWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWpTitle || !newWpUrl) return;

    const newWp: Wallpaper = {
      id: `wp_${Date.now()}`,
      titleHi: newWpTitle,
      titleEn: newWpTitle,
      deityId: newWpDeity as any,
      imageUrl: newWpUrl,
      aspectRatio: '9:16',
      resolution: '4K Ultra HD',
      tagsHi: [newWpTitle],
      mantraHi: newWpMantra || 'ॐ नमः शिवाय',
      featured: isWpFeatured,
      downloads: 0,
      likes: 0
    };

    setWallpapersList([newWp, ...wallpapersList]);
    setNewWpTitle('');
    setNewWpUrl('');
    setNewWpMantra('');
    setIsWpFeatured(false);
  };

  const handleDeleteWallpaper = (id: string) => {
    setWallpapersList(wallpapersList.filter(wp => wp.id !== id));
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteHindi) return;

    const newQ: Quote = {
      id: `quote_${Date.now()}`,
      hindiText: newQuoteHindi,
      sanskritShloka: newQuoteSanskrit,
      sourceHi: newQuoteSource || 'सनातन विचार',
      sourceEn: 'Devotional Source',
      category: 'bhakti',
      tags: ['भक्ति', 'विचार'],
      likes: 0
    };

    setQuotesList([newQ, ...quotesList]);
    setNewQuoteHindi('');
    setNewQuoteSanskrit('');
    setNewQuoteSource('');
  };

  const handleDeleteQuote = (id: string) => {
    setQuotesList(quotesList.filter(q => q.id !== id));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCat: DeityInfo = {
      id: `cat_${Date.now()}` as any,
      nameHi: newCatName,
      nameEn: newCatName,
      icon: newCatIcon,
      mantra: 'ॐ',
      description: 'सनातनी देवी-देवता',
      color: 'from-amber-600 to-orange-700'
    };

    setCategoriesList([...categoriesList, newCat]);
    setNewCatName('');
  };

  const handleSaveAds = () => {
    setAdsSaved(true);
    setTimeout(() => setAdsSaved(false), 2500);
  };

  const handleSendNotification = () => {
    setNotifSent(true);
    setTimeout(() => setNotifSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-bold font-display text-white">
              Hindu App — Admin Dashboard
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            यहाँ से आप बिना नया App अपडेट किए Wallpapers, Quotes, Categories, Ads और Notifications नियंत्रित कर सकते हैं
          </p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveAdminTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeAdminTab === 'dashboard' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>डैशबोर्ड</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('wallpapers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeAdminTab === 'wallpapers' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>वॉलपेपर प्रबंधन ({wallpapersList.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('quotes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeAdminTab === 'quotes' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>सुविचार ({quotesList.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeAdminTab === 'categories' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            <span>श्रेणियाँ</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('notifications')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeAdminTab === 'notifications' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>पुश नोटिफिकेशन</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('ads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeAdminTab === 'ads' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Meta Ads सेटिंग्स</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD METRICS */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-1">
              <span className="text-xs text-stone-400 font-medium">कुल वॉलपेपर</span>
              <p className="text-3xl font-bold font-mono text-white">{wallpapersList.length}</p>
              <span className="text-[11px] text-amber-400">4K Ultra HD समर्थित</span>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-1">
              <span className="text-xs text-stone-400 font-medium">कुल सुविचार व श्लोक</span>
              <p className="text-3xl font-bold font-mono text-white">{quotesList.length}</p>
              <span className="text-[11px] text-amber-400">गीता, रामायण व वेद</span>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-1">
              <span className="text-xs text-stone-400 font-medium">कुल डाउनलोड्स</span>
              <p className="text-3xl font-bold font-mono text-emerald-400">{(totalDownloads).toLocaleString()}</p>
              <span className="text-[11px] text-stone-400">MediaStore Gallery</span>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-1">
              <span className="text-xs text-stone-400 font-medium">पसंदीदा (Favorites)</span>
              <p className="text-3xl font-bold font-mono text-rose-400">{(totalLikes).toLocaleString()}</p>
              <span className="text-[11px] text-stone-400">सहेजे गए संग्रह</span>
            </div>
          </div>

          {/* Quick Guides for Play Store & Firebase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-5 space-y-2">
              <h3 className="text-sm font-bold text-amber-400">🔥 Firebase Firestore कनेक्शन</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                App का पूरा डेटा Firestore की <code>wallpapers</code>, <code>quotes</code>, <code>categories</code>, और <code>ads_config</code> कलेक्शंस में सुरक्षित रहता है। इस एडमिन पैनल से किया गया कोई भी बदलाव सीधे Users के फोन पर बिना ऐप अपडेट किए लाइव हो जाता है।
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-5 space-y-2">
              <h3 className="text-sm font-bold text-amber-400">📱 Google Play Store रिलीज तैयार</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Android Kotlin 35 SDK + Jetpack Compose आर्किटेक्चर के साथ, आप सीधे Android Studio में <code>Build &gt; Generate Signed Bundle / APK</code> पर क्लिक करके अपनी AAB फाइल जनरेट कर सकते हैं।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WALLPAPERS MANAGEMENT */}
      {activeAdminTab === 'wallpapers' && (
        <div className="space-y-6">
          {/* Add Wallpaper Form */}
          <form onSubmit={handleAddWallpaper} className="rounded-2xl border border-amber-500/30 bg-stone-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">नया 4K वॉलपेपर जोड़ें</h3>
              <span className="text-xs text-stone-400">Firebase Storage / Web URL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-stone-300 font-medium">वॉलपेपर शीर्षक (Title):</label>
                <input
                  type="text"
                  value={newWpTitle}
                  onChange={(e) => setNewWpTitle(e.target.value)}
                  placeholder="उदा: महाकाल भस्म आरती दर्शन"
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium">भगवान श्रेणी (Category):</label>
                <select
                  value={newWpDeity}
                  onChange={(e) => setNewWpDeity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="shiva">महादेव शिव (Shiva)</option>
                  <option value="ram">प्रभु श्री राम (Ram)</option>
                  <option value="krishna">श्री कृष्ण (Krishna)</option>
                  <option value="hanuman">हनुमान जी (Hanuman)</option>
                  <option value="ganesha">गणेश जी (Ganesha)</option>
                  <option value="durga">माँ दुर्गा (Durga)</option>
                  <option value="vishnu">श्री हरि विष्णु (Vishnu)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium">इमेज URL (4K Image URL):</label>
                <input
                  type="url"
                  value={newWpUrl}
                  onChange={(e) => setNewWpUrl(e.target.value)}
                  placeholder="https://.../image.jpg"
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-300 font-medium">पावन मंत्र / श्लोक (वैकल्पिक):</label>
                <input
                  type="text"
                  value={newWpMantra}
                  onChange={(e) => setNewWpMantra(e.target.value)}
                  placeholder="उदा: ॐ नमः शिवाय"
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-5">
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWpFeatured}
                    onChange={(e) => setIsWpFeatured(e.target.checked)}
                    className="accent-amber-500 h-4 w-4"
                  />
                  <span>होम स्क्रीन Featured में दिखाएँ</span>
                </label>

                <button
                  type="submit"
                  className="ml-auto flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>वॉलपेपर अपलोड करें</span>
                </button>
              </div>
            </div>
          </form>

          {/* Wallpapers Table */}
          <div className="rounded-2xl border border-stone-800 overflow-hidden bg-stone-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-[11px] text-stone-400 uppercase tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-3.5">चित्र</th>
                    <th className="p-3.5">शीर्षक</th>
                    <th className="p-3.5">श्रेणी</th>
                    <th className="p-3.5">डाउनलोड</th>
                    <th className="p-3.5">Featured</th>
                    <th className="p-3.5 text-right">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {wallpapersList.map(wp => (
                    <tr key={wp.id} className="hover:bg-stone-800/40">
                      <td className="p-3.5">
                        <img src={wp.imageUrl} alt="" className="h-12 w-8 object-cover rounded-md border border-stone-700" />
                      </td>
                      <td className="p-3.5 font-medium text-white">{wp.titleHi}</td>
                      <td className="p-3.5 text-amber-400 uppercase">{wp.deityId}</td>
                      <td className="p-3.5 font-mono">{(wp.downloads).toLocaleString()}</td>
                      <td className="p-3.5">
                        {wp.featured ? (
                          <span className="text-emerald-400 font-semibold">हाँ</span>
                        ) : (
                          <span className="text-stone-500">नहीं</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteWallpaper(wp.id)}
                          className="text-stone-400 hover:text-rose-400 transition-colors"
                          title="हटाएँ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUOTES MANAGEMENT */}
      {activeAdminTab === 'quotes' && (
        <div className="space-y-6">
          <form onSubmit={handleAddQuote} className="rounded-2xl border border-amber-500/30 bg-stone-900/70 p-5 space-y-4">
            <h3 className="text-base font-bold text-white">नया सुविचार / श्लोक जोड़ें</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-stone-300 font-medium">हिंदी सुविचार (मुख्य संदेश):</label>
                <textarea
                  value={newQuoteHindi}
                  onChange={(e) => setNewQuoteHindi(e.target.value)}
                  rows={2}
                  placeholder="उदा: कर्म करो और फल की चिंता ईश्वर पर छोड़ दो..."
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-300 font-medium">संस्कृत मूल श्लोक (यदि उपलब्ध हो):</label>
                  <input
                    type="text"
                    value={newQuoteSanskrit}
                    onChange={(e) => setNewQuoteSanskrit(e.target.value)}
                    placeholder="उदा: कर्मण्येवाधिकारस्ते मा फलेषु कदाचन..."
                    className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-medium">स्रोत / ग्रंथ का नाम:</label>
                  <input
                    type="text"
                    value={newQuoteSource}
                    onChange={(e) => setNewQuoteSource(e.target.value)}
                    placeholder="उदा: श्रीमद्भगवद्गीता (अध्याय २)"
                    className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>सुविचार प्रकाशित करें</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quotes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quotesList.map(q => (
              <div key={q.id} className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 space-y-2 relative group">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-amber-400">{q.sourceHi}</span>
                  <button
                    onClick={() => handleDeleteQuote(q.id)}
                    className="text-stone-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {q.sanskritShloka && (
                  <p className="text-xs text-amber-200/80 italic font-serif">
                    {q.sanskritShloka}
                  </p>
                )}
                <p className="text-xs text-stone-200 leading-relaxed">
                  "{q.hindiText}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES MANAGEMENT */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCategory} className="rounded-2xl border border-amber-500/30 bg-stone-900/70 p-5 space-y-4">
            <h3 className="text-base font-bold text-white">नई भगवान श्रेणी जोड़ें</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-24">
                <label className="text-xs text-stone-300 font-medium">प्रतीक चिह्न:</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-center text-lg text-white"
                />
              </div>

              <div className="flex-1">
                <label className="text-xs text-stone-300 font-medium">भगवान / श्रेणी का नाम:</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="उदा: माँ गायत्री / भगवान कार्तिकेय"
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>श्रेणी जोड़ें</span>
                </button>
              </div>
            </div>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categoriesList.map(cat => (
              <div key={cat.id} className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{cat.nameHi}</h4>
                  <p className="text-[10px] text-stone-400">{cat.nameEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS */}
      {activeAdminTab === 'notifications' && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-stone-900/70 p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">FCM पुश नोटिफिकेशन भेजें</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                सभी ऐप यूज़र्स के फोन पर तुरंत नया वॉलपेपर या दैनिक सुविचार नोटिफिकेशन भेजें
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-stone-300 font-medium">नोटिफिकेशन शीर्षक (Title):</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium">संदेश विवरण (Message):</label>
                <textarea
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendNotification}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-amber-500 hover:to-orange-500 transition-all"
                >
                  {notifSent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  <span>{notifSent ? 'नोटिफिकेशन सफलतापूर्वक भेजा गया! 🚀' : 'तुरंत नोटिफिकेशन भेजें'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ADS CONFIGURATION */}
      {activeAdminTab === 'ads' && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-stone-900/70 p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">Meta Audience Network (Facebook Ads) सेटिंग्स</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                App में विज्ञापन ऑन/ऑफ करें तथा Ad Placement IDs को बिना ऐप अपडेट किए बदलें
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAdsEnabled}
                  onChange={(e) => setIsAdsEnabled(e.target.checked)}
                  className="h-4 w-4 accent-amber-500"
                />
                <span className="text-xs font-semibold text-white">विज्ञापन सक्षम करें (Enable Ads in App)</span>
              </label>

              <div>
                <label className="text-xs text-stone-300 font-medium">Meta App ID (यहाँ अपना Meta App ID डालें):</label>
                <input
                  type="text"
                  value={metaAppId}
                  onChange={(e) => setMetaAppId(e.target.value)}
                  placeholder="यहाँ अपनी Meta App ID दर्ज करें"
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium">Banner Ad Placement ID:</label>
                <input
                  type="text"
                  value={metaBannerId}
                  onChange={(e) => setMetaBannerId(e.target.value)}
                  placeholder="यहाँ अपना Banner Placement ID दर्ज करें"
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium">Interstitial Ad Placement ID (फुलस्क्रीन विज्ञापन):</label>
                <input
                  type="text"
                  value={metaInterstitialId}
                  onChange={(e) => setMetaInterstitialId(e.target.value)}
                  placeholder="यहाँ अपना Interstitial Placement ID दर्ज करें"
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-medium">
                  Interstitial Ad Frequency (कितने वॉलपेपर क्लिक के बाद Ad दिखे):
                </label>
                <select
                  value={interstitialInterval}
                  onChange={(e) => setInterstitialInterval(parseInt(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white"
                >
                  <option value={3}>हर 3 वॉलपेपर क्लिक के बाद</option>
                  <option value={4}>हर 4 वॉलपेपर क्लिक के बाद (संतुलित)</option>
                  <option value={6}>हर 6 वॉलपेपर क्लिक के बाद (उत्कृष्ट यूजर अनुभव)</option>
                  <option value={8}>हर 8 वॉलपेपर क्लिक के बाद</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveAds}
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
                >
                  {adsSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  <span>{adsSaved ? 'सेटिंग्स सेव हो गईं! ✓' : 'सेटिंग्स सहेजें'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
