import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition cursor-pointer shadow-sm"
        title="Shubhakamna ऐप फोन में इंस्टॉल करें"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">ऐप इंस्टॉल करें</span>
        <span className="sm:hidden">ऐप</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition cursor-pointer shadow-sm"
          title="iPhone पर ऐप इंस्टॉल करें"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">ऐप इंस्टॉल करें</span>
          <span className="sm:hidden">ऐप</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-stone-900 border border-amber-500/40 p-5 shadow-2xl text-left">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>iPhone पर ऐप इंस्टॉल करें</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed space-y-2">
                1. Safari ब्राउज़र के नीचे <strong className="text-amber-300">Share (शेयर)</strong> बटन दबाएँ।<br />
                2. नीचे स्क्रॉल करके <strong className="text-amber-300">"Add to Home Screen"</strong> चुनें।<br />
                3. ऊपर दाईं ओर <strong className="text-amber-300">"Add"</strong> पर क्लिक करें।
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 text-xs transition cursor-pointer"
              >
                समझ गया (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button if user wants to know how to install or add to screen
  return (
    <button
      onClick={() => {
        alert("ब्राउज़र के 3 डॉट्स (Menu) पर क्लिक करके 'Add to Home Screen' या 'Install App' चुनें!");
      }}
      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition cursor-pointer"
      title="मोबाइल ऐप की तरह इस्तेमाल करें"
    >
      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
      <span>ऐप इंस्टॉल करें</span>
    </button>
  );
};
