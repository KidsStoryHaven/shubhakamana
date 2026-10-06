import React, { useState } from 'react';
import { Type, Sparkles, Check, ChevronDown, ChevronUp, Palette, X } from 'lucide-react';
import { 
  WISH_FONTS, 
  WishFontOption, 
  getWishFontById, 
  STATUS_COLOR_THEMES, 
  FontColorTheme, 
  getColorThemeById 
} from '../data/wishFontsData';

interface WishFontSelectorProps {
  selectedFontId: string;
  onSelectFont: (font: WishFontOption) => void;
  selectedColorThemeId?: string;
  onSelectColorTheme?: (theme: FontColorTheme) => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const WishFontSelector: React.FC<WishFontSelectorProps> = ({
  selectedFontId,
  onSelectFont,
  selectedColorThemeId,
  onSelectColorTheme,
  title = '🔤 फॉन्ट व रंगीन स्टाइल चुनें (Choose Font & Color Style)',
  subtitle = 'दैनिक सुप्रभात, सुविचार व त्योहारों के लिए रंगीन देवनागरी फॉन्ट',
  compact = true,
  onClose,
  showCloseButton = false
}) => {
  // Always default to minimized (false) unless explicitly expanded
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'font' | 'color'>('font');
  const currentFont = getWishFontById(selectedFontId);
  const currentColorTheme = selectedColorThemeId ? getColorThemeById(selectedColorThemeId) : null;

  return (
    <div className="rounded-2xl bg-stone-950/90 border border-amber-500/40 p-3 sm:p-4 shadow-xl space-y-3">
      {/* Header with currently active font badge & accordion toggle button */}
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        className="flex items-center justify-between gap-2 flex-wrap cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 group-hover:scale-105 transition">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-amber-300 group-hover:text-yellow-200 transition">
                {title}
              </h3>
              <span 
                className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold"
                style={{ fontFamily: currentFont.fontFamily }}
              >
                {currentFont.icon} {currentFont.name}
              </span>
              {currentColorTheme && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-yellow-300 border border-yellow-500/30 font-semibold">
                  {currentColorTheme.badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-stone-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Prominent Arrow Toggle Button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(prev => !prev);
            }}
            className="text-xs text-amber-300 hover:text-white px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer font-bold shadow-md active:scale-95"
          >
            <span>{isExpanded ? 'फॉन्ट छुपाएँ' : 'फॉन्ट बदलें'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-amber-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
            )}
          </button>

          {showCloseButton && onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition cursor-pointer"
              title="सेक्शन बंद करें"
              aria-label="Close font selector"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs: Font vs Colorful Styles (when color support is enabled) */}
      {isExpanded && onSelectColorTheme && (
        <div className="flex items-center gap-1.5 border-b border-stone-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('font')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'font'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>🔤 देवनागरी फॉन्ट ({WISH_FONTS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('color')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'color'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>🎨 रंगीन प्रभात स्टाइल</span>
          </button>
        </div>
      )}

      {/* Font Options Grid */}
      {isExpanded && activeTab === 'font' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 animate-fadeIn">
          {WISH_FONTS.map(font => {
            const isSelected = font.id === selectedFontId;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onSelectFont(font)}
                className={`p-2.5 rounded-xl text-left transition flex flex-col justify-between border cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-950/60 to-stone-950 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                    : 'bg-stone-900/90 hover:bg-stone-900 border-stone-800 hover:border-amber-500/40 text-stone-300'
                }`}
              >
                {/* Active golden indicator */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-bold shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-sans font-semibold">
                    <span>{font.icon}</span>
                    <span className="truncate">{font.name}</span>
                  </div>

                  {/* Sample text preview rendered in the exact font */}
                  <div 
                    className="text-sm sm:text-base text-stone-100 font-medium py-1 line-clamp-1"
                    style={{ fontFamily: font.fontFamily }}
                  >
                    शुभ प्रभात
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-stone-400 truncate">{font.tag}</span>
                  {isSelected && (
                    <span className="text-amber-300 flex items-center gap-0.5 shrink-0 font-sans">
                      <Sparkles className="w-2.5 h-2.5" /> सक्रिय
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Colorful Presets Grid (Daily Subhprabhat & Suvichar Styles) */}
      {isExpanded && activeTab === 'color' && onSelectColorTheme && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 animate-fadeIn">
          {STATUS_COLOR_THEMES.map(theme => {
            const isSelected = selectedColorThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectColorTheme(theme)}
                className={`p-2.5 rounded-xl text-left transition flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/60 border-amber-400 shadow-md ring-1 ring-amber-400'
                    : 'bg-stone-900 border-stone-800 hover:border-amber-500/40 text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border border-stone-600 shadow-sm shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${theme.gradientColors[0]}, ${theme.gradientColors[1]}, ${theme.gradientColors[2]})`
                    }}
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-200">{theme.name}</div>
                    <div className="text-[10px] text-amber-400">{theme.badge}</div>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Close Button if requested */}
      {isExpanded && onClose && (
        <div className="pt-2 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer border border-stone-700"
          >
            <span>✓ फॉन्ट सेट करें (बंद करें)</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
