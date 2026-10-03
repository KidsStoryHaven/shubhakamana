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
import { Festival, FestivalCategory, CategoryInfo } from './data/festivals';
import { getStoredFestivals, getStoredCategories } from './data/festivalStore';
import { getStoredAdSettings } from './data/adStore';
import { parseWishUrl } from './utils/shortUrl';
import { updatePageSEO, getFestivalSEOMetadata, resetPortalSEO } from './utils/seoManager';

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
      setFestivals(getStoredFestivals());
      setCategories(getStoredCategories());
    };
    window.addEventListener('shubhakamna_data_changed', handleDataChanged);
    return () => window.removeEventListener('shubhakamna_data_changed', handleDataChanged);
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

  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(() => {
    try {
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

  const [activeCategory, setActiveCategory] = useState<FestivalCategory | 'all'>('all');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 1. Initial Load & Direct Link SEO Injection
  useEffect(() => {
    if (selectedFestival) {
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

      const parsed = parseWishUrl(window.location.search, window.location.pathname);
      const allFests = getStoredFestivals();

      if (parsed.festivalId) {
        const match = allFests.find(f => f.id === parsed.festivalId || f.slug === parsed.festivalId);
        if (match) {
          setSelectedFestival(match);
          updatePageSEO(getFestivalSEOMetadata(match, parsed.senderName, parsed.lang));
          return;
        }
      }

      // If at root or no festival in URL, return to home portal
      setSelectedFestival(null);
      resetPortalSEO();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Centralized Navigation Handler: Updates View, URL (via pushState) & Dynamic SEO
  const handleSelectFestival = (fest: Festival, senderName?: string, lang?: string, updateUrl: boolean = true) => {
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

  if (selectedFestival) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white pb-14">
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white pb-14">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <FestivalsPortal
          onSelectFestival={(fest) => handleSelectFestival(fest)}
          currentCategory={activeCategory}
          onCategoryChange={(cat) => setActiveCategory(cat)}
        />
      </main>

      {/* Sticky Bottom Mobile/Desktop Ad Banner */}
      <AdBanner slotId="sticky_bottom" />

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

      {/* Editorial Festive Footer */}
      <footer className="mt-12 border-t border-amber-500/20 bg-stone-950/90 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-base font-bold text-amber-400 font-serif flex items-center justify-center md:justify-start gap-1.5">
              <span>🪔 Shubhakamna.in</span>
              <span className="text-xs text-stone-400 font-sans">· भारत का आधिकारिक शुभकामना द्वार</span>
            </span>
            <p className="text-xs text-stone-400 max-w-xl">
              सभी धर्मों, समुदायों के पावन त्योहारों, जयंतियों एवं व्यक्तिगत उत्सवों पर अपने नाम व फोटो की जादुई विशिंग लिंक बनाएँ और 1-क्लिक में WhatsApp पर भेजें।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-stone-400">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                {cat.nameHi}
              </button>
            ))}
            <span aria-hidden="true">·</span>
            <span
              className="text-stone-400 select-none"
            >
              © 2026 Shubhakamna.in
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
