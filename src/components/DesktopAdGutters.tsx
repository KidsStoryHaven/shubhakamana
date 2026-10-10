import React, { useEffect, useRef, useState } from 'react';
import { getStoredAdSettings, AdSettings } from '../data/adStore';
import { X } from 'lucide-react';

export const DesktopAdGutters: React.FC = () => {
  const [adSettings, setAdSettings] = useState<AdSettings>(() => getStoredAdSettings());
  const [leftDismissed, setLeftDismissed] = useState(false);
  const [rightDismissed, setRightDismissed] = useState(false);

  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleAdsChanged = () => {
      setAdSettings(getStoredAdSettings());
    };
    window.addEventListener('shubhakamna_ads_changed', handleAdsChanged);
    return () => window.removeEventListener('shubhakamna_ads_changed', handleAdsChanged);
  }, []);

  const skyscraperSlot = adSettings.slots?.desktop_skyscraper;
  const sideSlot = adSettings.slots?.desktop_side;

  const showLeft = adSettings.adsEnabled && 
    skyscraperSlot?.enabled && 
    skyscraperSlot?.code?.trim().length > 0 && 
    !leftDismissed;

  const showRight = adSettings.adsEnabled && 
    sideSlot?.enabled && 
    sideSlot?.code?.trim().length > 0 && 
    !rightDismissed;

  const executeAdCode = (container: HTMLDivElement | null, code: string) => {
    if (!container || !code) return;
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = code;

    const scripts = wrapper.querySelectorAll('script');
    const scriptsToExecute: HTMLScriptElement[] = [];

    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }
      scriptsToExecute.push(newScript);
      oldScript.parentNode?.removeChild(oldScript);
    });

    while (wrapper.firstChild) {
      container.appendChild(wrapper.firstChild);
    }

    scriptsToExecute.forEach((scriptEl) => {
      container.appendChild(scriptEl);
    });
  };

  useEffect(() => {
    if (showLeft && leftRef.current && skyscraperSlot?.code) {
      executeAdCode(leftRef.current, skyscraperSlot.code);
    }
    return () => {
      if (leftRef.current) leftRef.current.innerHTML = '';
    };
  }, [showLeft, skyscraperSlot?.code]);

  useEffect(() => {
    if (showRight && rightRef.current && sideSlot?.code) {
      executeAdCode(rightRef.current, sideSlot.code);
    }
    return () => {
      if (rightRef.current) rightRef.current.innerHTML = '';
    };
  }, [showRight, sideSlot?.code]);

  const isAdmin = typeof window !== 'undefined' && (
    window.location.pathname.toLowerCase().includes('admin') ||
    window.location.search.toLowerCase().includes('admin')
  );

  if ((!showLeft && !showRight) || isAdmin) {
    return null;
  }

  return (
    <div className="hidden 2xl:block pointer-events-none z-30 select-none">
      {/* Left PC Skyscraper Gutter */}
      {showLeft && (
        <aside 
          aria-label="PC Skyscraper Ad"
          className="fixed left-2 top-24 pointer-events-auto w-[164px] bg-stone-950/90 backdrop-blur border border-stone-800 rounded-2xl p-1 shadow-2xl flex flex-col items-center animate-fade-in"
        >
          <div className="w-full flex items-center justify-between pb-1 px-1 text-[9px] text-stone-500 font-mono">
            <span>विज्ञापन · AD</span>
            <button
              onClick={() => setLeftDismissed(true)}
              className="p-0.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
              title="विज्ञापन बंद करें"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div 
            ref={leftRef}
            className="w-[160px] min-h-[600px] flex items-center justify-center overflow-hidden"
          />
        </aside>
      )}

      {/* Right PC Skyscraper Gutter */}
      {showRight && (
        <aside 
          aria-label="PC Side Ad"
          className="fixed right-2 top-24 pointer-events-auto w-[164px] bg-stone-950/90 backdrop-blur border border-stone-800 rounded-2xl p-1 shadow-2xl flex flex-col items-center animate-fade-in"
        >
          <div className="w-full flex items-center justify-between pb-1 px-1 text-[9px] text-stone-500 font-mono">
            <span>विज्ञापन · AD</span>
            <button
              onClick={() => setRightDismissed(true)}
              className="p-0.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
              title="विज्ञापन बंद करें"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div 
            ref={rightRef}
            className="w-[160px] min-h-[300px] flex items-center justify-center overflow-hidden"
          />
        </aside>
      )}
    </div>
  );
};
