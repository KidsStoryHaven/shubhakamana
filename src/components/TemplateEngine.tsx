import React, { useMemo } from 'react';
import { 
  Sparkles, 
  Crown, 
  Flame, 
  Sun, 
  Check, 
  Clock 
} from 'lucide-react';
import { SuvicharItem } from '../data/dailySuvicharData';

export type TemplateEngineId = 'royal_gold' | 'marble_temple' | 'cyber_neon' | 'rainbow_candy' | 'vintage_parchment' | 'crystal_glass';

export interface TemplateDefinition {
  id: TemplateEngineId;
  name: string;
  hindiName: string;
  badge: string;
  icon: string;
  description: string;
  previewGradient: string;
  fontFamily: string;
  defaultHeadline: string;
  isDark: boolean;
  emojis: {
    topCenter?: string;
    topLeft?: string;
    topRight?: string;
    midLeft?: string;
    midRight?: string;
    bottomRibbon?: string;
  };
}

export const THREE_D_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'royal_gold',
    name: 'Royal 24K Gold & Emerald',
    hindiName: '१. रॉयल 24K गोल्ड एम्बॉस्ड 3D',
    badge: '👑 3D रॉयल गोल्ड',
    icon: '👑',
    description: '24K स्वर्णिम 3D उभरे अक्षर, स्वर्ण कोने, चिड़िया व लाल 3D हार्ट्स',
    previewGradient: 'linear-gradient(135deg, #042f2e, #065f46, #fbbf24)',
    fontFamily: "'Rozha One', 'Yatra One', serif",
    defaultHeadline: '✨ सुविचार ✨',
    isDark: true,
    emojis: {
      topRight: '🐦🌿',
      midLeft: '💖',
      bottomRibbon: '🐦🌿 💖 ⚜️ 🌸 ⚜️'
    }
  },
  {
    id: 'marble_temple',
    name: 'Sacred Temple & Golden Diyas',
    hindiName: '२. स्वर्ण मंदिर व पावन ज्योति 3D',
    badge: '🪔 दिव्य मंदिर व दीये',
    icon: '🪔',
    description: 'मार्बल पैलेस, 3D झरोखा पट्टिका, 4 कोने कमल व जलते मंगल दीप',
    previewGradient: 'linear-gradient(135deg, #ffffff, #fef3c7, #ca8a04)',
    fontFamily: "'Rozha One', 'Gotu', serif",
    defaultHeadline: '🪷 सुविचार 🪷',
    isDark: false,
    emojis: {
      topLeft: '🪷',
      topRight: '🪷',
      midLeft: '🪔',
      midRight: '🪔',
      bottomRibbon: '🪔 🪷 ✦ शुभ दिन • मंगलमय प्रभात ✦ 🪷 🪔'
    }
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Neon & Cosmic Aurora',
    hindiName: '३. साइबर नियॉन व ऑरोरा 3D',
    badge: '🌌 चमकता 3D नियॉन',
    icon: '🌌',
    description: 'गैलेक्सी स्टारफील्ड, चमकते नियॉन ट्यूब्स (मैजेंटा, सियान व सोलर येलो)',
    previewGradient: 'linear-gradient(135deg, #09090b, #831843, #06b6d4)',
    fontFamily: "'Rozha One', 'Yatra One', sans-serif",
    defaultHeadline: '✦ HINDI SUVICHAR ✦',
    isDark: true,
    emojis: {
      topLeft: '✨',
      topRight: '🌌',
      midLeft: '⭐️',
      midRight: '🪐',
      bottomRibbon: '✨ 🌌 ✦ SHUBH PRABHAT ✦ 🪐 💫'
    }
  },
  {
    id: 'rainbow_candy',
    name: '3D Rainbow Candy & Sunshine',
    hindiName: '४. 3D इंद्रधनुषी सनशाइन',
    badge: '🌞 रंग-बिरंगा 3D',
    icon: '🌞',
    description: 'प्रातःकालीन आकाश, मुस्कुराता 3D सूरज, मल्टीकलर 3D लेटर्स व इमोजी',
    previewGradient: 'linear-gradient(135deg, #dbeafe, #fef3c7, #f472b6)',
    fontFamily: "'Rozha One', 'Yatra One', serif",
    defaultHeadline: '🌞 शुभ प्रभात 🌞',
    isDark: false,
    emojis: {
      topCenter: '🌞',
      topLeft: '😄',
      topRight: '🙏',
      bottomRibbon: '😄 🙏 🌞 ✨ 🌸 🦋'
    }
  },
  {
    id: 'vintage_parchment',
    name: 'Royal Heritage Parchment 3D',
    hindiName: '५. राजसी विंटेज शिलालेख 3D',
    badge: '📜 विंटेज शिलालेख',
    icon: '📜',
    description: 'शाही प्राचीन ताम्रपत्र, 3D रूबी-गोल्ड नक्काशी व प्राचीन स्वर्ण मोहर',
    previewGradient: 'linear-gradient(135deg, #2b1408, #451a03, #92400e)',
    fontFamily: "'Rozha One', 'Tiro Devanagari Hindi', serif",
    defaultHeadline: '⚜️ अनमोल वचन ⚜️',
    isDark: true,
    emojis: {
      topLeft: '⚜️',
      topRight: '⚜️',
      bottomRibbon: '⚜️ 👑 ✦ सनातन सुविचार ✦ 👑 ⚜️'
    }
  },
  {
    id: 'crystal_glass',
    name: 'Crystal Glass & Pearl 3D',
    hindiName: '६. क्रिस्टल ग्लास व पर्ल 3D',
    badge: '💎 3D क्रिस्टल पर्ल',
    icon: '💎',
    description: 'फ्रॉस्टेड ग्लास, डायमंड स्पार्कल, इंद्रधनुषी 3D पर्ल लेटर्स व ऑरा',
    previewGradient: 'linear-gradient(135deg, #0f172a, #3b82f6, #ec4899)',
    fontFamily: "'Rozha One', 'Yatra One', serif",
    defaultHeadline: '💎 शुभ प्रभात 💎',
    isDark: true,
    emojis: {
      topLeft: '💎',
      topRight: '✨',
      midLeft: '🔮',
      midRight: '💎',
      bottomRibbon: '💎 ✨ ✦ POSITIVE VIBES ✦ 🔮 💎'
    }
  }
];

export interface TemplateEngineProps {
  selectedTemplateId: TemplateEngineId;
  onSelectTemplate: (templateId: TemplateEngineId) => void;
  suvicharText: string;
  senderName: string;
  senderPhoto?: string | null;
  photoScale?: number;
  fontScale?: number;
  headlineWord?: string;
  showDayAndTime?: boolean;
  dayTimeBadgeText?: string;
  aspectRatio?: string;
  customBackgroundUrl?: string | null;
  previewCardRef?: React.RefObject<HTMLDivElement | null>;
  showTemplatePicker?: boolean;
}

export const TemplateEngine: React.FC<TemplateEngineProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  suvicharText,
  senderName,
  senderPhoto,
  photoScale = 1.25,
  fontScale = 1.5,
  headlineWord,
  showDayAndTime = true,
  dayTimeBadgeText,
  aspectRatio = '9:16',
  customBackgroundUrl,
  previewCardRef,
  showTemplatePicker = true
}) => {
  const activeTemplate = useMemo(() => {
    return THREE_D_TEMPLATES.find(t => t.id === selectedTemplateId) || THREE_D_TEMPLATES[0];
  }, [selectedTemplateId]);

  // Smart balanced line splitter for any Devanagari / English Suvichar
  const parsedLines = useMemo(() => {
    const rawClean = (suvicharText || 'सत्य और सकारात्मकता ही जीवन का मूल आधार है।')
      .replace(/["“”'‘’]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!rawClean) return ['शुभ प्रभात'];

    // If short (< 45 chars), keep as 1-2 balanced lines
    const words = rawClean.split(' ');
    if (words.length <= 5) {
      return [rawClean];
    }

    const lines: string[] = [];
    const targetWordsPerLine = Math.max(3, Math.ceil(words.length / (words.length > 14 ? 3 : 2)));
    let currentLine: string[] = [];

    for (let i = 0; i < words.length; i++) {
      currentLine.push(words[i]);
      const currentText = currentLine.join(' ');
      const isPunctuationEnd = /[।!?,\n]$/.test(words[i]);

      if (currentLine.length >= targetWordsPerLine || (isPunctuationEnd && currentLine.length >= 2)) {
        lines.push(currentText);
        currentLine = [];
      }
    }
    if (currentLine.length > 0) {
      if (lines.length > 0 && currentLine.length <= 2) {
        lines[lines.length - 1] += ' ' + currentLine.join(' ');
      } else {
        lines.push(currentLine.join(' '));
      }
    }

    return lines.length > 0 ? lines : [rawClean];
  }, [suvicharText]);

  // Rainbow Candy 3D Gradients (Template 3)
  const rainbowGradients = [
    'linear-gradient(180deg, #ffffff 0%, #38bdf8 30%, #fde047 70%, #f97316 100%)', // Cyan-Gold-Orange
    'linear-gradient(180deg, #fff1f2 0%, #f472b6 35%, #ec4899 70%, #be185d 100%)', // Rose-Magenta
    'linear-gradient(180deg, #f0fdf4 0%, #4ade80 30%, #22d3ee 70%, #0284c7 100%)', // Green-Cyan-Blue
    'linear-gradient(180deg, #fefce8 0%, #fde047 35%, #f59e0b 70%, #b45309 100%)', // Gold-Amber
    'linear-gradient(180deg, #faf5ff 0%, #c084fc 35%, #a855f7 70%, #6b21a8 100%)'  // Purple-Violet
  ];

  // Dynamic Aspect Ratio classes
  const aspectClass = useMemo(() => {
    switch (aspectRatio) {
      case '1:1':
      case 'square':
        return 'aspect-square w-full max-w-[360px] sm:max-w-[420px] p-3.5 sm:p-5';
      case '4:5':
        return 'aspect-[4/5] w-full max-w-[340px] sm:max-w-[390px] p-3.5 sm:p-5';
      case '16:9':
        return 'aspect-[16/9] w-full max-w-[460px] sm:max-w-[540px] p-3 sm:p-4';
      case '3:4':
        return 'aspect-[3/4] w-full max-w-[340px] sm:max-w-[390px] p-3.5 sm:p-5';
      case '9:16':
      default:
        return 'aspect-[9/16] w-full max-w-[340px] sm:max-w-[390px] p-4 sm:p-5';
    }
  }, [aspectRatio]);

  return (
    <div className="space-y-4 w-full">
      {/* 🎨 1. Top 3D Template Selection Gallery */}
      {showTemplatePicker && (
        <div className="space-y-2 p-3.5 rounded-2xl bg-black/60 border border-amber-500/40 text-left">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>३ स्पेशल 3D टेम्पलेट्स चुनें (Select 3D Visual Template):</span>
            </label>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
              {activeTemplate.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {THREE_D_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => onSelectTemplate(tmpl.id)}
                  className={`p-3 rounded-2xl text-left transition flex flex-col justify-between border cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-amber-950/90 border-amber-400 shadow-xl shadow-amber-500/30 ring-2 ring-amber-400 scale-[1.02]'
                      : 'bg-stone-900 hover:bg-stone-850 border-stone-800 hover:border-amber-500/40 text-stone-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs font-black shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{tmpl.icon}</span>
                      <span className="text-xs font-black text-white">
                        {tmpl.hindiName}
                      </span>
                    </div>

                    <p className="text-[10px] text-stone-400 leading-tight">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between">
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {tmpl.badge}
                    </span>
                    <span className="text-xs">{tmpl.emojis.bottomRibbon?.split(' ')[0] || '✨'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 🖼️ 2. Live High-Definition 3D Visual Card Preview */}
      <div className="flex justify-center w-full">
        <div
          ref={previewCardRef}
          className={`relative rounded-3xl overflow-hidden border-2 border-amber-400/90 shadow-2xl flex flex-col justify-between text-center select-none transition-all ${aspectClass}`}
          style={{
            backgroundImage: customBackgroundUrl
              ? `url(${customBackgroundUrl})`
              : activeTemplate.id === 'royal_gold'
                ? 'radial-gradient(circle at center, #065f46 0%, #042f2e 50%, #021a19 100%)'
                : activeTemplate.id === 'marble_temple'
                  ? 'radial-gradient(circle at center, #ffffff 0%, #faf5ea 50%, #fef3c7 100%)'
                  : activeTemplate.id === 'cyber_neon'
                    ? 'radial-gradient(circle at center, #1e0b36 0%, #09090b 60%, #030008 100%)'
                    : activeTemplate.id === 'vintage_parchment'
                      ? 'radial-gradient(circle at center, #451a03 0%, #291003 60%, #150601 100%)'
                      : activeTemplate.id === 'crystal_glass'
                        ? 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 50%, #020617 100%)'
                        : 'linear-gradient(180deg, #dbeafe 0%, #fef3c7 40%, #fce7f3 75%, #e0e7ff 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: activeTemplate.isDark ? '#0c0a09' : '#ffffff'
          }}
        >
          {/* Vignette Overlay for 100% Crisp Readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: activeTemplate.id === 'marble_temple'
                ? 'linear-gradient(to top, rgba(255,255,255,0.92), rgba(255,255,255,0.5), rgba(255,255,255,0.75))'
                : activeTemplate.id === 'rainbow_candy'
                  ? 'linear-gradient(to top, rgba(255,255,255,0.85), rgba(255,255,255,0.3), rgba(255,255,255,0.65))'
                  : 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.65), rgba(0,0,0,0.45))'
            }}
          />

          {/* Decorative Outer Frame Rail */}
          <div
            className="absolute inset-2 border-2 rounded-2xl pointer-events-none"
            style={{
              borderColor: activeTemplate.id === 'marble_temple'
                ? '#d97706'
                : activeTemplate.id === 'cyber_neon'
                  ? '#ec4899'
                  : activeTemplate.id === 'vintage_parchment'
                    ? '#ca8a04'
                    : activeTemplate.id === 'crystal_glass'
                      ? '#38bdf8'
                      : activeTemplate.id === 'rainbow_candy'
                        ? '#fb7185'
                        : 'rgba(251, 191, 36, 0.75)'
            }}
          />

          {/* 🌟 Cultural 3D Clipart & Hearts (Consolidated into One Top-Right Corner) 🌟 */}
          {activeTemplate.id === 'royal_gold' && (
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] select-none pointer-events-none">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🐦🌿</span>
              <span className="text-xl sm:text-2xl">💖</span>
              <span className="text-xs sm:text-sm text-yellow-300">✨</span>
            </div>
          )}

          {activeTemplate.id === 'marble_temple' && (
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] select-none pointer-events-none">
              <span className="text-xl">🪷</span>
              <span className="text-2xl animate-pulse">🪔</span>
              <span className="text-xs text-yellow-300">✨</span>
            </div>
          )}

          {activeTemplate.id === 'cyber_neon' && (
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_0_8px_#ec4899] select-none pointer-events-none">
              <span className="text-lg text-pink-400 animate-pulse">💖</span>
              <span className="text-lg text-cyan-300">🌌</span>
              <span className="text-base text-yellow-300">⭐️</span>
              <span className="text-xs text-pink-400">✨</span>
            </div>
          )}

          {activeTemplate.id === 'vintage_parchment' && (
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] select-none pointer-events-none">
              <span className="text-xl">⚜️</span>
              <span className="text-xl">👑</span>
              <span className="text-xs text-yellow-300">✨</span>
            </div>
          )}

          {activeTemplate.id === 'crystal_glass' && (
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_0_10px_#38bdf8] select-none pointer-events-none">
              <span className="text-xl animate-pulse">💎</span>
              <span className="text-lg">💖</span>
              <span className="text-sm">✨</span>
            </div>
          )}

          {activeTemplate.id === 'rainbow_candy' && (
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] select-none pointer-events-none">
              <span className="text-2xl animate-bounce-slow">🌞</span>
              <span className="text-lg">💖</span>
              <span className="text-lg">🌸</span>
            </div>
          )}

          {/* 🌟 Card Top: 3D Embossed Title & Day/Time Badge 🌟 */}
          <div className="relative z-10 space-y-1.5 shrink-0 pt-2">
            <div className="relative py-1 flex items-center justify-center">
              {activeTemplate.id === 'marble_temple' ? (
                <div className="px-6 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-2 border-amber-500 shadow-[0_4px_12px_rgba(180,83,9,0.3),inset_0_2px_4px_rgba(255,255,255,0.8)]">
                  <span
                    className="text-3xl sm:text-5xl font-black tracking-widest"
                    style={{
                      fontFamily: activeTemplate.fontFamily,
                      background: 'linear-gradient(180deg, #78350f 0%, #b45309 40%, #d97706 70%, #92400e 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                  >
                    {headlineWord?.trim() || activeTemplate.defaultHeadline}
                  </span>
                </div>
              ) : activeTemplate.id === 'cyber_neon' ? (
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-black tracking-widest text-pink-300 filter drop-shadow-[0_0_10px_#ec4899]">
                    {headlineWord?.trim() || activeTemplate.defaultHeadline}
                  </span>
                  <div className="h-0.5 w-28 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                </div>
              ) : activeTemplate.id === 'vintage_parchment' ? (
                <span
                  className="text-3xl sm:text-5xl font-black tracking-wide"
                  style={{
                    fontFamily: activeTemplate.fontFamily,
                    color: '#fef08a',
                    textShadow: '0 1px 0 #fde047, 0 2px 0 #d97706, 0 3px 0 #92400e, 0 4px 0 #451a03, 0 6px 14px rgba(0,0,0,0.9)'
                  }}
                >
                  {headlineWord?.trim() || activeTemplate.defaultHeadline}
                </span>
              ) : activeTemplate.id === 'crystal_glass' ? (
                <span
                  className="text-3xl sm:text-5xl font-black tracking-wide"
                  style={{
                    fontFamily: activeTemplate.fontFamily,
                    color: '#ffffff',
                    textShadow: '0 0 10px #38bdf8, 0 0 20px #818cf8, 0 2px 0 #4338ca, 0 4px 12px rgba(0,0,0,0.9)'
                  }}
                >
                  {headlineWord?.trim() || activeTemplate.defaultHeadline}
                </span>
              ) : activeTemplate.id === 'rainbow_candy' ? (
                <span
                  className="text-4xl sm:text-6xl font-black tracking-wide"
                  style={{
                    fontFamily: activeTemplate.fontFamily,
                    color: '#ffffff',
                    textShadow: '0 1px 0 #f472b6, 0 2px 0 #ec4899, 0 3px 0 #db2777, 0 4px 0 #9d174d, 0 6px 12px rgba(0,0,0,0.6)'
                  }}
                >
                  {headlineWord?.trim() || activeTemplate.defaultHeadline}
                </span>
              ) : (
                /* Royal 24K Gold Embossed Title */
                <span
                  className="text-4xl sm:text-6xl font-black tracking-wide"
                  style={{
                    fontFamily: activeTemplate.fontFamily,
                    color: '#fffbeb',
                    textShadow: '0 1px 0 #fde047, 0 2px 0 #f59e0b, 0 3px 0 #d97706, 0 4px 0 #b45309, 0 5px 0 #78350f, 0 6px 0 #451a03, 0 8px 18px rgba(0,0,0,0.95), 0 0 25px rgba(251,191,36,0.6)'
                  }}
                >
                  {headlineWord?.trim() || activeTemplate.defaultHeadline}
                </span>
              )}
            </div>

            {showDayAndTime && dayTimeBadgeText && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border"
                style={{
                  backgroundColor: activeTemplate.isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: activeTemplate.isDark ? '#f59e0b' : '#d97706',
                  color: activeTemplate.isDark ? '#fde047' : '#b45309'
                }}
              >
                <Clock className="w-3 h-3 text-yellow-500" />
                <span>{dayTimeBadgeText}</span>
              </div>
            )}
          </div>

          {/* 🌟 Card Center: DYNAMIC MULTI-LINE 3D COLORFUL TEXT (NO BACKGROUND BOXES, HUGE CRISP 3D FONT) 🌟 */}
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-3 px-2 space-y-3 my-auto w-full bg-transparent">
            {activeTemplate.id === 'cyber_neon' ? (
              <div className="w-full space-y-2.5 py-1 text-center bg-transparent">
                {parsedLines.map((ln, idx) => {
                  const neonColorList = [
                    { color: '#ffffff', shadow: '0 0 10px #f43f5e, 0 0 22px #e11d48, 0 2px 0 #be123c, 0 4px 0 #881337, 0 8px 18px rgba(0,0,0,0.95)' },
                    { color: '#f0fdfa', shadow: '0 0 10px #06b6d4, 0 0 22px #0891b2, 0 2px 0 #0e7490, 0 4px 0 #155e75, 0 8px 18px rgba(0,0,0,0.95)' },
                    { color: '#fefce8', shadow: '0 0 10px #facc15, 0 0 22px #eab308, 0 2px 0 #ca8a04, 0 4px 0 #a16207, 0 8px 18px rgba(0,0,0,0.95)' }
                  ];
                  const nStyle = neonColorList[idx % neonColorList.length];
                  return (
                    <p
                      key={idx}
                      className={`font-black tracking-wide leading-relaxed ${
                        fontScale >= 1.5
                          ? parsedLines.length <= 2 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
                          : parsedLines.length <= 2 ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl'
                      }`}
                      style={{
                        fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', sans-serif",
                        color: nStyle.color,
                        textShadow: nStyle.shadow
                      }}
                    >
                      {ln}
                    </p>
                  );
                })}
              </div>
            ) : activeTemplate.id === 'crystal_glass' ? (
              <div className="w-full space-y-2.5 py-1 text-center bg-transparent">
                {parsedLines.map((ln, idx) => {
                  const glassColors = [
                    { color: '#ffffff', shadow: '0 0 12px #38bdf8, 0 0 24px #0284c7, 0 2px 0 #0369a1, 0 4px 10px rgba(0,0,0,0.9)' },
                    { color: '#fdf4ff', shadow: '0 0 12px #f472b6, 0 0 24px #db2777, 0 2px 0 #9d174d, 0 4px 10px rgba(0,0,0,0.9)' },
                    { color: '#f5f3ff', shadow: '0 0 12px #c084fc, 0 0 24px #9333ea, 0 2px 0 #6b21a8, 0 4px 10px rgba(0,0,0,0.9)' }
                  ];
                  const gStyle = glassColors[idx % glassColors.length];
                  return (
                    <p
                      key={idx}
                      className={`font-black tracking-wide leading-relaxed ${
                        fontScale >= 1.5
                          ? parsedLines.length <= 2 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
                          : parsedLines.length <= 2 ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl'
                      }`}
                      style={{
                        fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', serif",
                        color: gStyle.color,
                        textShadow: gStyle.shadow
                      }}
                    >
                      {ln}
                    </p>
                  );
                })}
              </div>
            ) : activeTemplate.id === 'vintage_parchment' ? (
              <div className="w-full space-y-2.5 py-1 text-center bg-transparent">
                {parsedLines.map((ln, idx) => (
                  <p
                    key={idx}
                    className={`font-black tracking-wide leading-relaxed ${
                      fontScale >= 1.5
                        ? parsedLines.length <= 2 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
                        : parsedLines.length <= 2 ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl'
                    }`}
                    style={{
                      fontFamily: "'Rozha One', 'Tiro Devanagari Hindi', serif",
                      color: idx % 2 === 0 ? '#fef08a' : '#ffffff',
                      textShadow: idx % 2 === 0
                        ? '0 1px 0 #fde047, 0 2px 0 #d97706, 0 3px 0 #92400e, 0 4px 0 #451a03, 0 8px 18px rgba(0,0,0,0.95)'
                        : '0 1px 0 #fb7185, 0 2px 0 #e11d48, 0 3px 0 #9f1239, 0 4px 0 #4c0519, 0 8px 18px rgba(0,0,0,0.95)'
                    }}
                  >
                    {ln}
                  </p>
                ))}
              </div>
            ) : activeTemplate.id === 'rainbow_candy' ? (
              <div className="w-full space-y-2.5 py-1 text-center bg-transparent">
                {parsedLines.map((ln, idx) => {
                  const colors = [
                    {
                      color: '#fef08a',
                      shadow: '0 1px 0 #fde047, 0 2px 0 #eab308, 0 3px 0 #ca8a04, 0 4px 0 #a16207, 0 5px 0 #713f12, 0 8px 16px rgba(0,0,0,0.95)'
                    },
                    {
                      color: '#ffffff',
                      shadow: '0 1px 0 #f472b6, 0 2px 0 #ec4899, 0 3px 0 #db2777, 0 4px 0 #be185d, 0 5px 0 #831843, 0 8px 16px rgba(0,0,0,0.95)'
                    },
                    {
                      color: '#67e8f9',
                      shadow: '0 1px 0 #22d3ee, 0 2px 0 #06b6d4, 0 3px 0 #0891b2, 0 4px 0 #0e7490, 0 5px 0 #155e75, 0 8px 16px rgba(0,0,0,0.95)'
                    },
                    {
                      color: '#86efac',
                      shadow: '0 1px 0 #4ade80, 0 2px 0 #22c55e, 0 3px 0 #16a34a, 0 4px 0 #15803d, 0 5px 0 #14532d, 0 8px 16px rgba(0,0,0,0.95)'
                    }
                  ];
                  const cStyle = colors[idx % colors.length];

                  return (
                    <p
                      key={idx}
                      className={`font-black tracking-wide leading-tight sm:leading-snug transition-all ${
                        fontScale >= 1.5
                          ? parsedLines.length <= 2 ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'
                          : parsedLines.length <= 2 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
                      }`}
                      style={{
                        fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', serif",
                        color: cStyle.color,
                        textShadow: cStyle.shadow
                      }}
                    >
                      {ln}
                    </p>
                  );
                })}
              </div>
            ) : activeTemplate.id === 'marble_temple' ? (
              <div className="w-full space-y-2.5 py-1 text-center bg-transparent">
                {parsedLines.map((ln, idx) => (
                  <p
                    key={idx}
                    className={`font-black tracking-wide leading-relaxed ${
                      fontScale >= 1.5
                        ? parsedLines.length <= 2 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
                        : parsedLines.length <= 2 ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl'
                    }`}
                    style={{
                      fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', serif",
                      color: idx % 2 === 0 ? '#451a03' : '#78350f',
                      textShadow: '0 1px 0 #fef08a, 0 2px 0 #fde047, 0 3px 0 #ca8a04, 0 5px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    {ln}
                  </p>
                ))}
              </div>
            ) : (
              /* Royal 24K Gold Extrusion */
              <div className="w-full space-y-2.5 py-1 text-center bg-transparent">
                {parsedLines.map((ln, idx) => {
                  const isPink = idx % 2 === 1;
                  return (
                    <p
                      key={idx}
                      className={`font-black tracking-wide leading-relaxed ${
                        fontScale >= 1.5
                          ? parsedLines.length <= 2 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
                          : parsedLines.length <= 2 ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl'
                      }`}
                      style={{
                        fontFamily: "'Rozha One', 'Yatra One', 'Tiro Devanagari Hindi', serif",
                        color: isPink ? '#ffffff' : '#fef08a',
                        textShadow: isPink
                          ? '0 1px 0 #f472b6, 0 2px 0 #ec4899, 0 3px 0 #db2777, 0 4px 0 #9d174d, 0 5px 0 #500724, 0 8px 18px rgba(0,0,0,0.95)'
                          : '0 1px 0 #fde047, 0 2px 0 #f59e0b, 0 3px 0 #d97706, 0 4px 0 #b45309, 0 5px 0 #78350f, 0 6px 0 #451a03, 0 8px 18px rgba(0,0,0,0.95)'
                      }}
                    >
                      {ln}
                    </p>
                  );
                })}
              </div>
            )}

            {/* Bottom 3D Emoji Ribbon */}
            <div className="text-base sm:text-lg opacity-95 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {activeTemplate.emojis.bottomRibbon}
            </div>
          </div>

          {/* 🌟 Card Bottom: User Photo, Sender Plate & CTA 🌟 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 pt-1 shrink-0">
            {/* Virtue Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: activeTemplate.isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: activeTemplate.isDark ? '#f59e0b' : '#d97706',
                color: activeTemplate.isDark ? '#fde047' : '#92400e'
              }}
            >
              <span>✨ सत्य वचन • सकारात्मक विचार ✨</span>
            </div>

            {/* User Photo */}
            {senderPhoto ? (
              <div
                className={`relative rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-2xl border-2 border-yellow-300 ring-4 ring-amber-500/50 transition-all duration-300 ${
                  aspectRatio === '16:9'
                    ? 'w-12 h-12 sm:w-14 sm:h-14'
                    : aspectRatio === '1:1' || aspectRatio === 'square'
                      ? photoScale <= 1.0 ? 'w-16 h-16 sm:w-18 sm:h-18' : 'w-20 h-20 sm:w-22 sm:h-22'
                      : photoScale <= 0.85
                        ? 'w-16 h-16 sm:w-18 sm:h-18'
                        : photoScale <= 1.0
                          ? 'w-20 h-20 sm:w-22 sm:h-22'
                          : photoScale <= 1.3
                            ? 'w-24 h-24 sm:w-28 sm:h-28'
                            : 'w-28 h-28 sm:w-34 sm:h-34'
                }`}
              >
                <img
                  src={senderPhoto}
                  alt={senderName}
                  crossOrigin="anonymous"
                  className="w-full h-full rounded-full object-cover border-2 border-stone-950"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 text-[11px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-yellow-100 shadow-md flex items-center justify-center">
                  ★
                </span>
              </div>
            ) : null}

            {/* Sender Name Plate */}
            <div
              className={`rounded-xl backdrop-blur-md shadow-md border ${
                aspectRatio === '16:9' ? 'px-2.5 py-0.5 min-w-[150px]' : 'px-3.5 py-1 min-w-[180px]'
              }`}
              style={{
                backgroundColor: activeTemplate.isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: activeTemplate.isDark ? '#f59e0b' : '#d97706'
              }}
            >
              <p
                className="text-[8.5px] font-bold uppercase tracking-wider"
                style={{ color: activeTemplate.isDark ? '#fde68a' : '#92400e' }}
              >
                ✨ सप्रेम शुभकामना प्रेषक ✨
              </p>
              <p
                className={`font-black font-serif ${aspectRatio === '16:9' ? 'text-xs' : 'text-xs sm:text-sm'}`}
                style={{ color: activeTemplate.isDark ? '#ffffff' : '#1c1917' }}
              >
                {senderName || 'आपका शुभचिंतक'}
              </p>
            </div>

            {/* 3D CTA Badge */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border-2 font-black shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] tracking-wide ${
                aspectRatio === '16:9' ? 'px-2.5 py-0.5 text-[9.5px]' : 'px-3.5 py-1 text-[10.5px] sm:text-xs'
              }`}
              style={{
                background: activeTemplate.isDark
                  ? 'linear-gradient(180deg, #292524 0%, #1c1917 100%)'
                  : 'linear-gradient(180deg, #ffffff 0%, #fef3c7 100%)',
                borderColor: '#f59e0b',
                color: activeTemplate.isDark ? '#fef08a' : '#92400e'
              }}
            >
              <span>✨ अपना नाम लिखकर स्टेटस बनाएँ ➔ shubhakamna.in</span>
            </div>

            <p
              className="text-[9.5px] font-semibold tracking-tight"
              style={{ color: activeTemplate.isDark ? '#cbd5e1' : '#475569' }}
            >
              🌅 दैनिक १००+ शुभ प्रभात सुविचार • मुफ़्त कार्ड जनरेटर
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
