/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FestivalsPortal } from './components/FestivalsPortal';
import { FestivalWishPage } from './components/FestivalWishPage';
import { AdminPanel } from './components/AdminPanel';
import { Festival, FestivalCategory, CategoryInfo } from './data/festivals';
import { getStoredFestivals, getStoredCategories } from './data/festivalStore';
import { parseWishUrl } from './utils/shortUrl';

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
      const path = (window.location.pathname || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      return (
        path.includes('wp-admin') ||
        path.includes('admin') ||
        search.includes('admin') ||
        search.includes('wp-admin') ||
        hash.includes('admin') ||
        hash.includes('wp-admin')
      );
    } catch {
      return false;
    }
  };

  const [isAdminOpen, setIsAdminOpen] = useState(() => checkIsAdminRoute());

  // Listen to popstate and hashchange so changing the URL bar immediately opens admin
  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsAdminRoute()) {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Secret shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to toggle Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleDataChanged = () => {
      setFestivals(getStoredFestivals());
      setCategories(getStoredCategories());
    };
    window.addEventListener('shubhakamna_data_changed', handleDataChanged);
    return () => window.removeEventListener('shubhakamna_data_changed', handleDataChanged);
  }, []);

  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(() => {
    try {
      const parsed = parseWishUrl(window.location.search, window.location.pathname);
      const allFests = getStoredFestivals();
      if (parsed.festivalId) {
        const match = allFests.find(f => f.id === parsed.festivalId || f.slug === parsed.festivalId);
        if (match) return match;
      }
      // If a sender shared a short wish link without festivalId (e.g. ?w=Sudha), default to first festival
      if (parsed.senderName && allFests.length > 0) {
        return allFests[0];
      }
    } catch {
      // Ignored
    }
    return null;
  });

  const [activeCategory, setActiveCategory] = useState<FestivalCategory | 'all'>('all');

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
          setSelectedFestival(f);
          setIsAdminOpen(false);
          try {
            window.history.pushState({}, '', `/?festival=${f.slug}`);
          } catch {}
        }}
      />
    );
  }

  if (selectedFestival) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
        <FestivalWishPage
          festival={selectedFestival}
          initialSenderName={urlData.senderName}
          initialLang={urlData.lang}
          onBackToPortal={() => setSelectedFestival(null)}
          onSelectAnotherFestival={(f) => setSelectedFestival(f)}
          allFestivals={festivals}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
      {/* Top Navbar with Dropdown Menus */}
      <Navbar
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onSelectFestival={(fest) => setSelectedFestival(fest)}
        onGoHome={() => {
          setSelectedFestival(null);
          setActiveCategory('all');
        }}
        onSecretAdminTrigger={() => setIsAdminOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Festive Portal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FestivalsPortal
          onSelectFestival={(fest) => setSelectedFestival(fest)}
          currentCategory={activeCategory}
          onCategoryChange={(cat) => setActiveCategory(cat)}
        />
      </main>

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
            {/* Direct Easy Admin Login Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1.5 cursor-pointer bg-stone-900 hover:bg-stone-800 px-3 py-1.5 rounded-xl border border-amber-500/40 text-xs transition active:scale-95 shadow-sm"
            >
              <span>🔐 एडमिन लॉगिन</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400/90 font-medium">
              © 2026 Shubhakamna.in
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
