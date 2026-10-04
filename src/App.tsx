/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FestivalsPortal } from './components/FestivalsPortal';
import { FestivalWishPage } from './components/FestivalWishPage';
import { AdminPanel } from './components/AdminPanel';
import { AdBanner } from './components/AdBanner';
import { LeaderboardModal } from './components/LeaderboardModal';
import { UserAuthModal } from './components/UserAuthModal';
import { LoginPromptPopup } from './components/LoginPromptPopup';
import { LivePointsTickerBanner } from './components/LivePointsTickerBanner';
import { Festival, FestivalCategory, CategoryInfo } from './data/festivals';
import { getStoredFestivals, getStoredCategories } from './data/festivalStore';
import { getStoredAdSettings } from './data/adStore';
import { parseWishUrl } from './utils/shortUrl';
import { updatePageSEO, getFestivalSEOMetadata, resetPortalSEO } from './utils/seoManager';
import { SEOPage } from './components/SEOPage';
import { AboutPage } from './components/AboutPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { ContactPage } from './components/ContactPage';
import { SiteFooter } from './components/SiteFooter';
import { StickyWhatsAppChannel } from './components/StickyWhatsAppChannel';
import { WishCategory, getCategoryBySlug, getAllCategories } from './data/wishesData';

export default function App() {
  const [urlData] = useState(() => {
    try {
      return parseWishUrl(window.location.search, window.location.pathname);
    } catch {
      return {};
    }
  });

  const [festivals, setFestivals] = useState<Festival[]>(() => getStoredFestivals());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => getStoredCategories());
  
  const resolveStaticRoute = (pathStr: string): 'about' | 'privacy-policy' | 'contact' | null => {
    const clean = pathStr.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (clean === 'about' || clean === 'about-us') return 'about';
    if (clean === 'privacy-policy' || clean === 'privacy') return 'privacy-policy';
    if (clean === 'contact' || clean === 'contact-us') return 'contact';
    return null;
  };

  const [staticPageRoute, setStaticPageRoute] = useState<'about' | 'privacy-policy' | 'contact' | null>(() => {
    try {
      return resolveStaticRoute(window.location.pathname || '');
    } catch {
      return null;
    }
  });

  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(() => {
    try {
      const clean = (window.location.pathname || '').replace(/^\/+|\/+$/g, '').toLowerCase();
      if (clean && (clean === 'admin' || resolveStaticRoute(clean) || getCategoryBySlug(clean))) {
        return null;
      }

      const parsed = parseWishUrl(window.location.search, window.location.pathname);
      const allFests = getStoredFestivals();
      if (parsed.festivalId) {
        const match = allFests.find(f => f.id === parsed.festivalId || f.slug === parsed.festivalId);
        if (match) return match;
      }
      if (parsed.senderName && allFests.length > 0) {
        return allFests[0];
      }
    } catch {
      // Ignored
    }
    return null;
  });

  const [selectedWishCategory, setSelectedWishCategory] = useState<WishCategory | null>(() => {
    try {
      const clean = (window.location.pathname || '').replace(/^\/+|\/+$/g, '').toLowerCase();
      if (clean && clean !== 'admin' && !resolveStaticRoute(clean)) {
        const cat = getCategoryBySlug(clean);
        if (cat) return cat;
      }
    } catch {}
    return null;
  });

  const checkIsAdminRoute = () => {
    try {
      const hostname = (window.location.hostname || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();

      // Dedicated admin subdomain: e.g. admin.shubhakamna.in
      const isSubdomainAdmin = (
        hostname.startsWith('admin.') ||
        hostname.startsWith('panel.') ||
        hostname.startsWith('manage.')
      );

      // Strict dedicated path: /admin or /admin/
      const isPathAdmin = path === '/admin' || path === '/admin/' || path.startsWith('/admin/');

      return isSubdomainAdmin || isPathAdmin;
    } catch {
      return false;
    }
  };

  const [isAdminOpen, setIsAdminOpen] = useState(() => checkIsAdminRoute());

  // Listen to popstate so changing the URL bar to /admin immediately opens admin
  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsAdminRoute()) {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const handleDataChanged = () => {
      const storedFests = getStoredFestivals();
      setFestivals(storedFests);
      setCategories(getStoredCategories());
      setSelectedFestival(prev => {
        if (!prev) return null;
        const updated = storedFests.find(f => f.id === prev.id || f.slug === prev.slug);
        return updated || prev;
      });
      setSelectedWishCategory(prevCat => {
        if (!prevCat) return null;
        const updatedCat = getCategoryBySlug(prevCat.slug);
        return updatedCat || prevCat;
      });
    };
    window.addEventListener('shubhakamna_data_changed', handleDataChanged);
    window.addEventListener('shubhakamna_wish_categories_changed', handleDataChanged);
    return () => {
      window.removeEventListener('shubhakamna_data_changed', handleDataChanged);
      window.removeEventListener('shubhakamna_wish_categories_changed', handleDataChanged);
    };
  }, []);

  // Dynamically inject Google AdSense Auto Ads / Global Header Script into <head>
  useEffect(() => {
    const applyHeaderScript = () => {
      const settings = getStoredAdSettings();
      const existingScript = document.getElementById('shubhakamna-ad-header-script');
      if (existingScript) {
        existingScript.remove();
      }

      if (settings.adsEnabled && settings.headerScript?.trim()) {
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = settings.headerScript.trim();
        const scriptTags = tempContainer.querySelectorAll('script');
        
        scriptTags.forEach((s) => {
          const newScript = document.createElement('script');
          newScript.id = 'shubhakamna-ad-header-script';
          Array.from(s.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          if (s.innerHTML) {
            newScript.innerHTML = s.innerHTML;
          }
          document.head.appendChild(newScript);
        });
      }
    };

    applyHeaderScript();
    window.addEventListener('shubhakamna_ads_changed', applyHeaderScript);
    return () => {
      window.removeEventListener('shubhakamna_ads_changed', applyHeaderScript);
    };
  }, []);

  const [activeCategory, setActiveCategory] = useState<FestivalCategory | 'all'>('all');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Subscribe to category changes from Admin Panel
  useEffect(() => {
    const handleCategoryChange = () => {
      if (selectedWishCategory) {
        const updated = getCategoryBySlug(selectedWishCategory.slug);
        if (updated) setSelectedWishCategory(updated);
      }
    };
    window.addEventListener('shubhakamna_wish_categories_changed', handleCategoryChange);
    return () => window.removeEventListener('shubhakamna_wish_categories_changed', handleCategoryChange);
  }, [selectedWishCategory]);

  // 1. Initial Load & Direct Link SEO Injection
  useEffect(() => {
    if (selectedWishCategory) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
      updatePageSEO({
        title: selectedWishCategory.seoTitle,
        description: selectedWishCategory.metaDescription,
        keywords: selectedWishCategory.keywords.join(', '),
        canonicalUrl: `${origin}/${selectedWishCategory.slug}/`,
        ogImage: selectedWishCategory.heroImageUrl,
        ogType: 'article'
      });
    } else if (selectedFestival) {
      updatePageSEO(getFestivalSEOMetadata(selectedFestival, urlData.senderName, urlData.lang));
    } else if (!isAdminOpen) {
      resetPortalSEO();
    }
  }, []);

  // 2. Browser Back / Forward Sync (popstate)
  useEffect(() => {
    const handlePopState = () => {
      // Check admin route first
      if (checkIsAdminRoute()) {
        setIsAdminOpen(true);
        return;
      }
      setIsAdminOpen(false);

      const pathClean = (window.location.pathname || '').replace(/^\/+|\/+$/g, '').toLowerCase();
      
      const staticMatch = resolveStaticRoute(pathClean);
      if (staticMatch) {
        setStaticPageRoute(staticMatch);
        setSelectedWishCategory(null);
        setSelectedFestival(null);
        return;
      }
      setStaticPageRoute(null);

      if (pathClean && pathClean !== 'admin') {
        const catMatch = getCategoryBySlug(pathClean);
        if (catMatch) {
          setSelectedWishCategory(catMatch);
          setSelectedFestival(null);
          return;
        }
      }

      const parsed = parseWishUrl(window.location.search, window.location.pathname);
      const allFests = getStoredFestivals();

      if (parsed.festivalId) {
        const match = allFests.find(f => f.id === parsed.festivalId || f.slug === parsed.festivalId);
        if (match) {
          setSelectedWishCategory(null);
          setSelectedFestival(match);
          updatePageSEO(getFestivalSEOMetadata(match, parsed.senderName, parsed.lang));
          return;
        }
      }

      // If at root or no festival in URL, return to home portal
      setSelectedWishCategory(null);
      setSelectedFestival(null);
      resetPortalSEO();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Centralized Navigation Handler: Updates View, URL (via pushState) & Dynamic SEO
  const handleSelectFestival = (fest: Festival, senderName?: string, lang?: string, updateUrl: boolean = true) => {
    setStaticPageRoute(null);
    setSelectedWishCategory(null);
    setSelectedFestival(fest);
    
    // Update Dynamic SEO & Social Tags (Title, Description, OG, Twitter, JSON-LD)
    updatePageSEO(getFestivalSEOMetadata(fest, senderName, lang));

    if (updateUrl) {
      const cleanPath = `/${fest.slug || fest.id}`;
      try {
        window.history.pushState({ festivalId: fest.id }, '', cleanPath);
      } catch {
        // Fallback for restricted iframe environments
        window.history.pushState({ festivalId: fest.id }, '', `/?festival=${fest.slug || fest.id}`);
      }
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Centralized Go Home Handler
  const handleGoHome = (updateUrl: boolean = true) => {
    setStaticPageRoute(null);
    setSelectedWishCategory(null);
    setSelectedFestival(null);
    setActiveCategory('all');
    resetPortalSEO();

    if (updateUrl) {
      try {
        window.history.pushState({}, '', '/');
      } catch {}
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. Universal Path Navigator (for clean URLs like /about/ or /birthday-wishes-for-mother/)
  const handleNavigateToPath = (url: string) => {
    const clean = url.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (!clean) {
      handleGoHome(true);
      return;
    }

    try {
      const targetUrl = url.startsWith('/') ? url : `/${url}/`;
      window.history.pushState({}, '', targetUrl);
    } catch {}

    const staticMatch = resolveStaticRoute(clean);
    if (staticMatch) {
      setStaticPageRoute(staticMatch);
      setSelectedWishCategory(null);
      setSelectedFestival(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setStaticPageRoute(null);

    const cat = getCategoryBySlug(clean);
    if (cat) {
      setSelectedWishCategory(cat);
      setSelectedFestival(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const allFests = getStoredFestivals();
    const fest = allFests.find(f => f.slug === clean || f.id === clean);
    if (fest) {
      setSelectedWishCategory(null);
      handleSelectFestival(fest, undefined, undefined, false);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminOpen) {
    return (
      <AdminPanel
        onClose={() => {
          setIsAdminOpen(false);
          try {
            if (window.location.pathname.toLowerCase().includes('admin') || window.location.search.includes('admin')) {
              window.history.pushState({}, '', '/');
            }
          } catch {}
        }}
        onPreviewFestival={(f) => {
          setIsAdminOpen(false);
          handleSelectFestival(f);
        }}
      />
    );
  }

  // 1. Static Informational Pages (About Us, Privacy Policy, Contact Us)
  if (staticPageRoute) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
        {/* Top Navbar */}
        <Navbar
          onSelectCategory={(cat) => {
            setStaticPageRoute(null);
            setSelectedWishCategory(null);
            setActiveCategory(cat);
          }}
          onSelectFestival={(fest) => {
            setStaticPageRoute(null);
            handleSelectFestival(fest);
          }}
          onGoHome={() => handleGoHome()}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Top Header Ad Banner */}
        <div className="max-w-4xl mx-auto w-full px-4 pt-2">
          <AdBanner slotId="header" />
        </div>

        {/* Static Page Body */}
        <main className="flex-1 w-full">
          {staticPageRoute === 'about' && (
            <AboutPage onGoHome={() => handleGoHome()} onNavigateTo={handleNavigateToPath} />
          )}
          {staticPageRoute === 'privacy-policy' && (
            <PrivacyPolicyPage onGoHome={() => handleGoHome()} onNavigateTo={handleNavigateToPath} />
          )}
          {staticPageRoute === 'contact' && (
            <ContactPage onGoHome={() => handleGoHome()} onNavigateTo={handleNavigateToPath} />
          )}
        </main>

        {/* Sticky Bottom Ad Banner */}
        <AdBanner slotId="sticky_bottom" />

        {/* Sticky WhatsApp Channel Button */}
        <StickyWhatsAppChannel channelUrl="https://whatsapp.com/channel/0029VbCzmQCHrDZfjZlBGR3U" />

        {/* Unified Site Footer */}
        <SiteFooter onNavigateToPath={handleNavigateToPath} />

        {/* Monthly Rewards Leaderboard Modal */}
        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* User Login & Signup Modal */}
        <UserAuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {
            setIsAuthOpen(false);
          }}
        />
      </div>
    );
  }

  if (selectedWishCategory) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
        {/* Top Navbar */}
        <Navbar
          onSelectCategory={(cat) => {
            setSelectedWishCategory(null);
            setActiveCategory(cat);
          }}
          onSelectFestival={(fest) => handleSelectFestival(fest)}
          onGoHome={() => handleGoHome()}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Top Header Ad Banner */}
        <div className="max-w-4xl mx-auto w-full px-4 pt-2">
          <AdBanner slotId="header" />
        </div>

        {/* SEO Landing Page Component */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SEOPage category={selectedWishCategory} onNavigate={handleNavigateToPath} />
        </main>

        {/* Sticky Bottom Ad Banner */}
        <AdBanner slotId="sticky_bottom" />

        {/* Sticky WhatsApp Channel Button */}
        <StickyWhatsAppChannel channelUrl="https://whatsapp.com/channel/0029VbCzmQCHrDZfjZlBGR3U" />

        {/* Unified Site Footer */}
        <SiteFooter onNavigateToPath={handleNavigateToPath} />

        {/* Monthly Rewards Leaderboard Modal */}
        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* User Login & Signup Modal */}
        <UserAuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {
            setIsAuthOpen(false);
          }}
        />
      </div>
    );
  }

  if (selectedFestival) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
        {/* Top Header Ad Banner */}
        <div className="max-w-4xl mx-auto w-full px-4 pt-2">
          <AdBanner slotId="header" />
        </div>

        <FestivalWishPage
          festival={selectedFestival}
          initialSenderName={urlData.senderName}
          initialLang={urlData.lang}
          onBackToPortal={() => handleGoHome()}
          onSelectAnotherFestival={(f) => handleSelectFestival(f)}
          allFestivals={festivals}
        />

        {/* Sticky Bottom Ad Banner */}
        <AdBanner slotId="sticky_bottom" />

        {/* Sticky WhatsApp Channel Button */}
        <StickyWhatsAppChannel channelUrl="https://whatsapp.com/channel/0029VbCzmQCHrDZfjZlBGR3U" />

        {/* Unified Site Footer */}
        <SiteFooter onNavigateToPath={handleNavigateToPath} />

        {/* Monthly Rewards Leaderboard Modal */}
        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* User Login & Signup Modal */}
        <UserAuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {
            setIsAuthOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
      {/* Top Navbar with Dropdown Menus */}
      <Navbar
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onSelectFestival={(fest) => handleSelectFestival(fest)}
        onGoHome={() => handleGoHome()}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Top Header Ad Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-2">
        <AdBanner slotId="header" />
      </div>

      {/* Main Festive Portal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        {/* Popular SEO Wishing Hubs (Pillars for Google Crawlers & Users) */}
        <section className="bg-gradient-to-r from-stone-900/90 via-amber-950/20 to-stone-900/90 p-4 sm:p-5 rounded-3xl border border-amber-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-amber-300 font-serif flex items-center gap-2">
              <span>⭐ प्रमुख विशिंग श्रेणियां (Popular Wishing Categories)</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 font-sans">
                Clean URLs
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {getAllCategories().map(cat => (
              <a
                key={cat.slug}
                href={`/${cat.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigateToPath(`/${cat.slug}/`);
                }}
                className="p-2.5 rounded-xl bg-stone-950/80 hover:bg-stone-900 border border-stone-800 hover:border-amber-400/50 text-left transition group block"
              >
                <span className="text-base block mb-0.5">{cat.theme.accentEmoji}</span>
                <span className="text-xs font-bold text-stone-200 group-hover:text-amber-300 truncate block">
                  {cat.nameHi}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  /{cat.slug}/
                </span>
              </a>
            ))}
          </div>
        </section>

        <FestivalsPortal
          onSelectFestival={(fest) => handleSelectFestival(fest)}
          currentCategory={activeCategory}
          onCategoryChange={(cat) => setActiveCategory(cat)}
          onNavigateToPath={handleNavigateToPath}
        />
      </main>

      {/* Sticky Bottom Mobile/Desktop Ad Banner */}
      <AdBanner slotId="sticky_bottom" />

      {/* Sticky WhatsApp Channel Button */}
      <StickyWhatsAppChannel channelUrl="https://whatsapp.com/channel/0029VbCzmQCHrDZfjZlBGR3U" />

      {/* Unified Professional Site Footer */}
      <SiteFooter onNavigateToPath={handleNavigateToPath} />

      {/* Monthly Rewards Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* User Login & Signup Modal */}
      <UserAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
