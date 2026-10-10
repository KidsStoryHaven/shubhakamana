import React, { useEffect, useRef, useState } from 'react';
import { getStoredAdSettings, AdSlotId, AdSettings } from '../data/adStore';
import { X } from 'lucide-react';

interface AdBannerProps {
  slotId: AdSlotId;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotId, className = '' }) => {
  const [adSettings, setAdSettings] = useState<AdSettings>(() => getStoredAdSettings());
  const [isDismissed, setIsDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleAdsChanged = () => {
      setAdSettings(getStoredAdSettings());
    };
    window.addEventListener('shubhakamna_ads_changed', handleAdsChanged);
    return () => window.removeEventListener('shubhakamna_ads_changed', handleAdsChanged);
  }, []);

  const slot = adSettings.slots[slotId];
  const isVisible = adSettings.adsEnabled && slot?.enabled && slot?.code?.trim().length > 0 && !isDismissed;

  useEffect(() => {
    if (!isVisible || !containerRef.current || !slot?.code) return;

    const container = containerRef.current;
    container.innerHTML = ''; // Clear previous content

    // Create a shadow wrapper or fragment
    const wrapper = document.createElement('div');
    wrapper.innerHTML = slot.code;

    // Standard HTML injection doesn't execute <script> tags.
    // We recreate <script> tags so Adsterra and other ad networks can execute their initialization:
    const scripts = wrapper.querySelectorAll('script');
    const scriptsToExecute: HTMLScriptElement[] = [];

    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      // Copy all attributes (src, async, crossorigin, etc.)
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      // Copy inline script content
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }
      scriptsToExecute.push(newScript);
      oldScript.parentNode?.removeChild(oldScript);
    });

    // Append non-script HTML elements first
    while (wrapper.firstChild) {
      container.appendChild(wrapper.firstChild);
    }

    // Append script elements so they execute in order
    scriptsToExecute.forEach((scriptEl) => {
      container.appendChild(scriptEl);
    });

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isVisible, slot?.code]);

  const isAdmin = typeof window !== 'undefined' && (
    window.location.pathname.toLowerCase().includes('admin') ||
    window.location.search.toLowerCase().includes('admin')
  );

  if (!isVisible || isAdmin) {
    return null;
  }

  // Device-specific visibility classes
  const deviceClass = 
    slot?.deviceTarget === 'desktop_only' 
      ? 'hidden md:flex' 
      : slot?.deviceTarget === 'mobile_only' 
        ? 'flex md:hidden' 
        : 'flex';

  // Sticky bottom banner layout
  if (slotId === 'sticky_bottom') {
    return (
      <aside 
        aria-label="प्रायोजित विज्ञापन"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-amber-500/30 p-2 shadow-2xl flex-col items-center justify-center animate-slide-up ${deviceClass}`}
      >
        <div className="relative w-full max-w-3xl flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between pb-1 px-2 text-[10px] text-stone-400">
            <span className="font-semibold uppercase tracking-wider text-amber-400/80">विज्ञापन · Sponsored (Mobile)</span>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
              title="विज्ञापन बंद करें"
              aria-label="विज्ञापन बंद करें"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div 
            ref={containerRef} 
            className="w-full min-h-[50px] flex items-center justify-center overflow-hidden" 
          />
        </div>
      </aside>
    );
  }

  // Standard in-page banner layout
  return (
    <aside 
      aria-label="प्रायोजित विज्ञापन"
      className={`w-full my-4 flex-col items-center justify-center ${deviceClass} ${className}`}
    >
      <div className="w-full max-w-4xl rounded-2xl border border-stone-800 bg-stone-900/40 p-2 sm:p-3 text-center transition-all hover:border-amber-500/30">
        <div className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
          <span className="w-6 h-[1px] bg-stone-800"></span>
          <span>विज्ञापन · Advertisement</span>
          <span className="w-6 h-[1px] bg-stone-800"></span>
        </div>
        <div 
          ref={containerRef} 
          className="w-full min-h-[60px] flex items-center justify-center overflow-x-auto overflow-y-hidden"
        />
      </div>
    </aside>
  );
};
