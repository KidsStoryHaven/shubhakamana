/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FestivalsPortal } from './components/FestivalsPortal';
import { FestivalWishPage } from './components/FestivalWishPage';
import { FESTIVALS, Festival } from './data/festivals';
import { parseWishUrl } from './utils/shortUrl';

export default function App() {
  const [urlData] = useState(() => {
    try {
      return parseWishUrl(window.location.search, window.location.pathname);
    } catch {
      return {};
    }
  });

  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(() => {
    try {
      const parsed = parseWishUrl(window.location.search, window.location.pathname);
      if (parsed.festivalId) {
        const match = FESTIVALS.find(f => f.id === parsed.festivalId || f.slug === parsed.festivalId);
        if (match) return match;
      }
      // If a sender shared a short wish link without festivalId (e.g. ?w=Sudha), default to Diwali
      if (parsed.senderName) {
        return FESTIVALS[0];
      }
    } catch {
      // Ignored
    }
    return null;
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'festival' | 'god' | 'celebration' | 'daily'>('all');

  if (selectedFestival) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
        <FestivalWishPage
          festival={selectedFestival}
          initialSenderName={urlData.senderName}
          initialLang={urlData.lang}
          onBackToPortal={() => setSelectedFestival(null)}
          onSelectAnotherFestival={(f) => setSelectedFestival(f)}
          allFestivals={FESTIVALS}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onGoHome={() => {
          setSelectedFestival(null);
          setActiveCategory('all');
        }}
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
              सभी भारतीय त्योहारों, पावन जयंतियों एवं जन्मदिन पर अपने नाम व फोटो की जादुई विशिंग लिंक बनाएँ और 1-क्लिक में WhatsApp पर भेजें।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-stone-400">
            <button
              onClick={() => setActiveCategory('festival')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              महापर्व
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveCategory('celebration')}
              className="hover:text-purple-300 transition-colors cursor-pointer"
            >
              जन्मदिन विशेज
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveCategory('daily')}
              className="hover:text-yellow-300 transition-colors cursor-pointer"
            >
              दैनिक सुप्रभात
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
