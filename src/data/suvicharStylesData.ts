/**
 * 8 Special Shubh Prabhat & Suvichar Typography & Card Design Styles
 * Directly inspired by traditional high-engagement WhatsApp Suvichar status cards.
 * Features 3D extruded Devanagari calligraphy, colorful virtue badges, and massive prominent text.
 */

export interface SuvicharStyleOption {
  id: string;
  number: number;
  name: string;
  hindiName: string;
  tag: string;
  previewGradient: string;
  fontFamily: string;
  canvasFontFamily: string;
  headlineTheme: 'gold_red' | 'neon_gold' | 'magenta_3d' | 'candy_rose' | 'sunrise_emboss' | 'festive_splash' | 'emerald_gold' | 'cosmic_gold';
  cardTheme: 'gold_floral' | 'royal_dark' | 'magenta_bird' | 'rose_hearts' | 'sunrise_wood' | 'festive_splash' | 'golden_frame' | 'cosmic_gold';
  defaultHeadline: string;
  badge1: {
    bgGrad: [string, string];
    borderColor: string;
    textColor: string;
    shadowColor: string;
  };
  badge2: {
    bgGrad: [string, string];
    borderColor: string;
    textColor: string;
    shadowColor: string;
  };
  textColor: string;
  leadTextColor: string;
  highlightColor: string;
  ornament: string;
  bgGrad: [string, string, string];
  isDarkTheme: boolean;
}

export const SUVICHAR_STYLES: SuvicharStyleOption[] = [
  // 1. स्वर्णिम प्रभात व पुष्प (Golden 3D + Birds & Flowers)
  {
    id: 'gold_floral',
    number: 1,
    name: 'स्वर्णिम प्रभात व पुष्प',
    hindiName: '१. स्वर्णिम प्रभात (फ्लोरल व चिड़िया)',
    tag: '🌸 सबसे लोकप्रिय',
    previewGradient: 'linear-gradient(135deg, #fffbeb, #fed7aa, #f59e0b)',
    fontFamily: "'Rozha One', 'Yatra One', serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", serif',
    headlineTheme: 'gold_red',
    cardTheme: 'gold_floral',
    defaultHeadline: 'आयुष्यांत',
    badge1: {
      bgGrad: ['#dc2626', '#b91c1c'],
      borderColor: '#fef08a',
      textColor: '#ffffff',
      shadowColor: 'rgba(220, 38, 38, 0.6)'
    },
    badge2: {
      bgGrad: ['#15803d', '#166534'],
      borderColor: '#fef08a',
      textColor: '#ffffff',
      shadowColor: 'rgba(22, 101, 52, 0.6)'
    },
    textColor: '#1c1917',
    leadTextColor: '#0c0a09',
    highlightColor: '#dc2626',
    ornament: '🌸 💖 🌸',
    bgGrad: ['#ffffff', '#fffbeb', '#fef3c7'],
    isDarkTheme: false
  },

  // 2. रॉयल डार्क गोल्ड (Royal Dark Midnight & Neon Gold 3D)
  {
    id: 'royal_dark',
    number: 2,
    name: 'रॉयल डार्क गोल्ड',
    hindiName: '२. रॉयल डार्क गोल्ड (नियॉन व ब्लैक)',
    tag: '👑 शाही व भव्य',
    previewGradient: 'linear-gradient(135deg, #1c1917, #451a03, #fbbf24)',
    fontFamily: "'Rozha One', 'Gotu', serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", serif',
    headlineTheme: 'neon_gold',
    cardTheme: 'royal_dark',
    defaultHeadline: 'आयुष्यांत',
    badge1: {
      bgGrad: ['#ea580c', '#c2410c'],
      borderColor: '#fde047',
      textColor: '#ffffff',
      shadowColor: 'rgba(234, 88, 12, 0.8)'
    },
    badge2: {
      bgGrad: ['#1d4ed8', '#1e40af'],
      borderColor: '#fde047',
      textColor: '#ffffff',
      shadowColor: 'rgba(29, 78, 216, 0.8)'
    },
    textColor: '#f8fafc',
    leadTextColor: '#ffffff',
    highlightColor: '#fde047',
    ornament: '⚜️ 💛 ⚜️',
    bgGrad: ['#0f0b08', '#1c1005', '#080503'],
    isDarkTheme: true
  },

  // 3. बर्ड्स व मैजेंटा कैलिग्राफी (Watercolor Bird & Vivid Magenta 3D)
  {
    id: 'magenta_bird',
    number: 3,
    name: 'मैजेंटा कैलिग्राफी',
    hindiName: '३. मैजेंटा कैलिग्राफी (बर्ड व स्प्रिंग)',
    tag: '🐦 पावन प्रभात',
    previewGradient: 'linear-gradient(135deg, #fdf4ff, #fbcfe8, #d946ef)',
    fontFamily: "'Kalam', 'Rozha One', cursive",
    canvasFontFamily: '"Kalam", "Noto Sans Devanagari", cursive',
    headlineTheme: 'magenta_3d',
    cardTheme: 'magenta_bird',
    defaultHeadline: 'आयुष्यांत',
    badge1: {
      bgGrad: ['#f97316', '#ea580c'],
      borderColor: '#ffffff',
      textColor: '#ffffff',
      shadowColor: 'rgba(249, 115, 22, 0.6)'
    },
    badge2: {
      bgGrad: ['#0284c7', '#0369a1'],
      borderColor: '#ffffff',
      textColor: '#ffffff',
      shadowColor: 'rgba(2, 132, 199, 0.6)'
    },
    textColor: '#1e1b4b',
    leadTextColor: '#0f172a',
    highlightColor: '#d946ef',
    ornament: '🐦 🌸 🐦',
    bgGrad: ['#ffffff', '#fdf2f8', '#fce7f3'],
    isDarkTheme: false
  },

  // 4. कुमकुम रोज व 3D हार्ट्स (Kumkum Rose & Candy Hearts)
  {
    id: 'rose_hearts',
    number: 4,
    name: 'कुमकुम रोज व हार्ट्स',
    hindiName: '४. कुमकुम रोज (3D हार्ट्स व गुलाब)',
    tag: '💖 स्नेह व आत्मीय',
    previewGradient: 'linear-gradient(135deg, #fff1f2, #fecdd3, #e11d48)',
    fontFamily: "'Modak', 'Rozha One', cursive",
    canvasFontFamily: '"Modak", "Noto Sans Devanagari", cursive',
    headlineTheme: 'candy_rose',
    cardTheme: 'rose_hearts',
    defaultHeadline: 'आयुष्यांत',
    badge1: {
      bgGrad: ['#4c1d95', '#3b0764'],
      borderColor: '#fde047',
      textColor: '#ffffff',
      shadowColor: 'rgba(76, 29, 149, 0.7)'
    },
    badge2: {
      bgGrad: ['#14532d', '#052e16'],
      borderColor: '#fde047',
      textColor: '#ffffff',
      shadowColor: 'rgba(20, 83, 45, 0.7)'
    },
    textColor: '#1c1917',
    leadTextColor: '#0c0a09',
    highlightColor: '#e11d48',
    ornament: '🌹 💖 🌹',
    bgGrad: ['#ffffff', '#fff1f2', '#ffe4e6'],
    isDarkTheme: false
  },

  // 5. सूर्योदय व वुडन साइनेज (Sunrise Nature & Wooden Signs)
  {
    id: 'sunrise_wood',
    number: 5,
    name: 'सूर्योदय व वुडन साइनेज',
    hindiName: '५. सूर्योदय व वुडन (नेचर व लकड़ी)',
    tag: '🌄 दिव्य सूर्योदय',
    previewGradient: 'linear-gradient(135deg, #451a03, #78350f, #f59e0b)',
    fontFamily: "'Rozha One', 'Yatra One', serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", serif',
    headlineTheme: 'sunrise_emboss',
    cardTheme: 'sunrise_wood',
    defaultHeadline: 'आयुष्यांत',
    badge1: {
      bgGrad: ['#9a3412', '#7c2d12'],
      borderColor: '#fde047',
      textColor: '#ffffff',
      shadowColor: 'rgba(154, 52, 18, 0.8)'
    },
    badge2: {
      bgGrad: ['#166534', '#14532d'],
      borderColor: '#fde047',
      textColor: '#ffffff',
      shadowColor: 'rgba(22, 101, 52, 0.8)'
    },
    textColor: '#f8fafc',
    leadTextColor: '#ffffff',
    highlightColor: '#fbbf24',
    ornament: '🌄 💛 🌄',
    bgGrad: ['#1c1005', '#381604', '#0f0802'],
    isDarkTheme: true
  },

  // 6. रंगोत्सव स्प्लैश (Vibrant Color Splash & 3D)
  {
    id: 'festive_splash',
    number: 6,
    name: 'रंगोत्सव स्प्लैश',
    hindiName: '६. रंगोत्सव स्प्लैश (वाइब्रेंट रंग)',
    tag: '🎨 उमंग व खुशियाँ',
    previewGradient: 'linear-gradient(135deg, #eff6ff, #fbcfe8, #06b6d4)',
    fontFamily: "'Modak', 'Rozha One', cursive",
    canvasFontFamily: '"Modak", "Noto Sans Devanagari", cursive',
    headlineTheme: 'festive_splash',
    cardTheme: 'festive_splash',
    defaultHeadline: 'आयुष्यांत',
    badge1: {
      bgGrad: ['#c026d3', '#a21caf'],
      borderColor: '#ffffff',
      textColor: '#ffffff',
      shadowColor: 'rgba(192, 38, 211, 0.7)'
    },
    badge2: {
      bgGrad: ['#0284c7', '#0369a1'],
      borderColor: '#ffffff',
      textColor: '#ffffff',
      shadowColor: 'rgba(2, 132, 199, 0.7)'
    },
    textColor: '#0f172a',
    leadTextColor: '#020617',
    highlightColor: '#c026d3',
    ornament: '🎨 ✨ 🎨',
    bgGrad: ['#ffffff', '#f8fafc', '#f1f5f9'],
    isDarkTheme: false
  },

  // 7. रॉयल फ्लोरल फ्रेम (Royal Golden Floral Frame)
  {
    id: 'golden_frame',
    number: 7,
    name: 'रॉयल फ्लोरल फ्रेम',
    hindiName: '७. रॉयल फ्लोरल फ्रेम (गोल्डन बॉर्डर)',
    tag: '⚜️ क्लासिक रॉयल',
    previewGradient: 'linear-gradient(135deg, #fefce8, #fef08a, #ca8a04)',
    fontFamily: "'Noto Serif Devanagari', 'Rozha One', serif",
    canvasFontFamily: '"Noto Serif Devanagari", serif',
    headlineTheme: 'emerald_gold',
    cardTheme: 'golden_frame',
    defaultHeadline: 'आयुष्यांत',
    badge1: {
      bgGrad: ['#be123c', '#9f1239'],
      borderColor: '#fef08a',
      textColor: '#ffffff',
      shadowColor: 'rgba(190, 18, 60, 0.6)'
    },
    badge2: {
      bgGrad: ['#047857', '#065f46'],
      borderColor: '#fef08a',
      textColor: '#ffffff',
      shadowColor: 'rgba(4, 120, 87, 0.6)'
    },
    textColor: '#1c1917',
    leadTextColor: '#0c0a09',
    highlightColor: '#be123c',
    ornament: '🕊️ 🌿 🕊️',
    bgGrad: ['#ffffff', '#fffef0', '#fef9c3'],
    isDarkTheme: false
  },

  // 8. दिव्य ब्रह्मांड व स्वर्णिम चक्र (Cosmic Golden Halo & Orb)
  {
    id: 'cosmic_gold',
    number: 8,
    name: 'दिव्य ब्रह्मांड चक्र',
    hindiName: '८. दिव्य ब्रह्मांड (स्वर्णिम चक्र व आभा)',
    tag: '🌟 दिव्य व आध्यात्मिक',
    previewGradient: 'linear-gradient(135deg, #020617, #1e1b4b, #fbbf24)',
    fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", serif',
    headlineTheme: 'cosmic_gold',
    cardTheme: 'cosmic_gold',
    defaultHeadline: 'आयुष्यांत',
    badge1: {
      bgGrad: ['#c2410c', '#9a3412'],
      borderColor: '#fde047',
      textColor: '#ffffff',
      shadowColor: 'rgba(194, 65, 12, 0.85)'
    },
    badge2: {
      bgGrad: ['#1e40af', '#1e3a8a'],
      borderColor: '#fde047',
      textColor: '#ffffff',
      shadowColor: 'rgba(30, 64, 175, 0.85)'
    },
    textColor: '#f8fafc',
    leadTextColor: '#ffffff',
    highlightColor: '#fde047',
    ornament: '🌟 💛 🌟',
    bgGrad: ['#050208', '#0c0414', '#030105'],
    isDarkTheme: true
  }
];

export function getSuvicharStyleById(id: string): SuvicharStyleOption {
  return SUVICHAR_STYLES.find(s => s.id === id) || SUVICHAR_STYLES[0];
}

/**
 * Parses any Suvichar text to extract the lead line, two key virtues (badges),
 * conjunction word, and body text.
 */
export interface ParsedSuvicharContent {
  leadLine: string;
  badge1: string;
  conjunction: string;
  badge2: string;
  bodyText: string;
  fullThought: string;
  highlightWord?: string;
}

export function parseSuvicharContent(text: string, defaultBadge1?: string, defaultBadge2?: string): ParsedSuvicharContent {
  const clean = text.trim();

  // 1. Look for explicit quotes like 'आत्मविश्वास' आणि 'प्रामाणिकपणा' or '...'
  const singleQuoteRegex = /['‘]([^'’]+)['’]/g;
  const quotesFound: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = singleQuoteRegex.exec(clean)) !== null) {
    if (m[1].trim()) quotesFound.push(m[1].trim());
  }

  // Also check double quotes
  if (quotesFound.length < 2) {
    const doubleQuoteRegex = /["“]([^"”]+)["”]/g;
    while ((m = doubleQuoteRegex.exec(clean)) !== null) {
      if (m[1].trim()) quotesFound.push(m[1].trim());
    }
  }

  if (quotesFound.length >= 2) {
    const b1 = quotesFound[0];
    const b2 = quotesFound[1];
    return {
      leadLine: '',
      badge1: defaultBadge1 || b1,
      conjunction: 'व',
      badge2: defaultBadge2 || b2,
      bodyText: clean,
      fullThought: clean,
      highlightWord: b1
    };
  }

  // Default badges:
  return {
    leadLine: '',
    badge1: defaultBadge1 || 'सत्य वचन',
    conjunction: '•',
    badge2: defaultBadge2 || 'सकारात्मक विचार',
    bodyText: clean,
    fullThought: clean,
    highlightWord: 'सत्य'
  };
}
