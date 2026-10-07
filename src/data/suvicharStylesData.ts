/**
 * Distinct Ultra-Luxury Shubh Prabhat & Suvichar Typography & Card Design Styles
 * Curated styles: Numbers 3, 5, 6, 7
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
  headlineTheme: string;
  cardTheme: string;
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
  textShadow3D?: string;
}

export const SUVICHAR_STYLES: SuvicharStyleOption[] = [
  // 3. कॉस्मिक नियॉन 3D
  {
    id: 'neon_galaxy_3d',
    number: 3,
    name: 'कॉस्मिक नियॉन 3D',
    hindiName: '३. गैलेक्सी नियॉन (चमकता 3D मैजेंटा व सियान)',
    tag: '✨ वाइब्रेंट नियॉन',
    previewGradient: 'linear-gradient(135deg, #0f172a, #831843, #06b6d4)',
    fontFamily: "'Rozha One', 'Yatra One', sans-serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", sans-serif',
    headlineTheme: 'neon_magenta_cyan',
    cardTheme: 'neon_galaxy_3d',
    defaultHeadline: 'सुविचार',
    badge1: {
      bgGrad: ['#831843', '#500724'],
      borderColor: '#f472b6',
      textColor: '#fdf2f8',
      shadowColor: 'rgba(236, 72, 153, 0.8)'
    },
    badge2: {
      bgGrad: ['#0e7490', '#155e75'],
      borderColor: '#38bdf8',
      textColor: '#f0fdfa',
      shadowColor: 'rgba(6, 182, 212, 0.8)'
    },
    textColor: '#ffffff',
    leadTextColor: '#38bdf8',
    highlightColor: '#f472b6',
    ornament: '✨ 🌌 🪐 ✨',
    bgGrad: ['#1e0b36', '#09090b', '#030008'],
    isDarkTheme: true
  },

  // 5. राजसी विंटेज ताम्रपत्र
  {
    id: 'vintage_parchment_3d',
    number: 5,
    name: 'राजसी विंटेज ताम्रपत्र',
    hindiName: '५. विंटेज ताम्रपत्र (शाही प्राचीन नक्काशी)',
    tag: '📜 प्राचीन विरासत',
    previewGradient: 'linear-gradient(135deg, #451a03, #291003, #92400e)',
    fontFamily: "'Rozha One', 'Tiro Devanagari Hindi', serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", serif',
    headlineTheme: 'gold_red',
    cardTheme: 'royal_dark',
    defaultHeadline: 'सुविचार',
    badge1: {
      bgGrad: ['#78350f', '#451a03'],
      borderColor: '#fde047',
      textColor: '#fef08a',
      shadowColor: 'rgba(120, 53, 15, 0.8)'
    },
    badge2: {
      bgGrad: ['#831843', '#500724'],
      borderColor: '#fde047',
      textColor: '#fef08a',
      shadowColor: 'rgba(131, 24, 67, 0.8)'
    },
    textColor: '#fef08a',
    leadTextColor: '#ffffff',
    highlightColor: '#fb7185',
    ornament: '⚜️ 👑 ⚜️',
    bgGrad: ['#451a03', '#291003', '#150601'],
    isDarkTheme: true
  },

  // 6. क्रिस्टल ग्लास व पर्ल 3D
  {
    id: 'crystal_glass_3d',
    number: 6,
    name: 'क्रिस्टल ग्लास व पर्ल 3D',
    hindiName: '६. क्रिस्टल पर्ल (डायमंड स्पार्कल व ऑरा)',
    tag: '💎 अल्ट्रा प्रीमियम',
    previewGradient: 'linear-gradient(135deg, #0f172a, #3b82f6, #ec4899)',
    fontFamily: "'Rozha One', 'Yatra One', serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", serif',
    headlineTheme: 'neon_magenta_cyan',
    cardTheme: 'neon_galaxy_3d',
    defaultHeadline: 'सुविचार',
    badge1: {
      bgGrad: ['#1e3a8a', '#172554'],
      borderColor: '#38bdf8',
      textColor: '#f0fdfa',
      shadowColor: 'rgba(30, 58, 138, 0.8)'
    },
    badge2: {
      bgGrad: ['#701a75', '#4a044e'],
      borderColor: '#f472b6',
      textColor: '#fdf2f8',
      shadowColor: 'rgba(112, 26, 117, 0.8)'
    },
    textColor: '#ffffff',
    leadTextColor: '#38bdf8',
    highlightColor: '#f472b6',
    ornament: '💎 ✨ 🔮 💎',
    bgGrad: ['#1e1b4b', '#0f172a', '#020617'],
    isDarkTheme: true
  },

  // 7. पावन भगवा तेज 3D
  {
    id: 'saffron_blessing_3d',
    number: 7,
    name: 'पावन भगवा तेज 3D',
    hindiName: '७. पावन भगवा तेज (सनातन ऊर्जा व ज्योति)',
    tag: '🪔 आध्यात्मिक',
    previewGradient: 'linear-gradient(135deg, #7c2d12, #c2410c, #431407)',
    fontFamily: "'Rozha One', 'Gotu', serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", serif',
    headlineTheme: 'sunrise_emboss',
    cardTheme: 'royal_dark',
    defaultHeadline: 'सुविचार',
    badge1: {
      bgGrad: ['#c2410c', '#9a3412'],
      borderColor: '#fde047',
      textColor: '#fef08a',
      shadowColor: 'rgba(194, 65, 12, 0.8)'
    },
    badge2: {
      bgGrad: ['#7c2d12', '#431407'],
      borderColor: '#fde047',
      textColor: '#fef08a',
      shadowColor: 'rgba(124, 45, 18, 0.8)'
    },
    textColor: '#fef08a',
    leadTextColor: '#ffffff',
    highlightColor: '#fdba74',
    ornament: '🪔 🕉️ 🪔',
    bgGrad: ['#9a3412', '#7c2d12', '#290a03'],
    isDarkTheme: true
  }
];

export function getSuvicharStyleById(id: string): SuvicharStyleOption {
  return SUVICHAR_STYLES.find(s => s.id === id) || SUVICHAR_STYLES[0];
}

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
  const clean = (text || '').trim();

  // Look for quotes
  const singleQuoteRegex = /['‘]([^'’]+)['’]/g;
  const quotesFound: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = singleQuoteRegex.exec(clean)) !== null) {
    if (m[1].trim()) quotesFound.push(m[1].trim());
  }

  if (quotesFound.length < 2) {
    const doubleQuoteRegex = /["“]([^"”]+)["”]/g;
    while ((m = doubleQuoteRegex.exec(clean)) !== null) {
      if (m[1].trim()) quotesFound.push(m[1].trim());
    }
  }

  if (quotesFound.length >= 2) {
    return {
      leadLine: '',
      badge1: defaultBadge1 || quotesFound[0],
      conjunction: 'व',
      badge2: defaultBadge2 || quotesFound[1],
      bodyText: clean,
      fullThought: clean,
      highlightWord: quotesFound[0]
    };
  }

  return {
    leadLine: '',
    badge1: defaultBadge1 || 'सत्य वचन',
    conjunction: '•',
    badge2: defaultBadge2 || 'सकारात्मक विचार',
    bodyText: clean,
    fullThought: clean
  };
}
