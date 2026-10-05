/**
 * Font Options for Festival Wishes & Greeting Cards
 * Allows users to choose their preferred font style with instant visual feedback.
 */

export interface WishFontOption {
  id: string;
  name: string;
  fontFamily: string;
  canvasFontFamily: string;
  tag: string;
  icon: string;
  sampleText: string;
  description: string;
}

export const WISH_FONTS: WishFontOption[] = [
  {
    id: 'rozha',
    name: 'राजसी देवनागरी',
    fontFamily: "'Rozha One', 'Yatra One', serif",
    canvasFontFamily: '"Rozha One", "Noto Sans Devanagari", serif',
    tag: '👑 शाही व भव्य',
    icon: '👑',
    sampleText: 'शुभ दीपावली व मंगलकामनाएं',
    description: 'महापर्वों और दिव्य संदेशों के लिए सर्वाधिक लोकप्रिय व राजसी'
  },
  {
    id: 'yatra',
    name: 'पारंपरिक यात्रा',
    fontFamily: "'Yatra One', 'Rozha One', cursive, serif",
    canvasFontFamily: '"Yatra One", "Noto Sans Devanagari", cursive',
    tag: '🚩 पारंपरिक व पावन',
    icon: '🚩',
    sampleText: 'ॐ नमः शिवाय हर हर महादेव',
    description: 'धार्मिक मंत्रों, श्लोकों और वैदिक भाव के लिए अत्यंत मनमोहक'
  },
  {
    id: 'kalam',
    name: 'कलम हस्तलेखन',
    fontFamily: "'Kalam', cursive",
    canvasFontFamily: '"Kalam", "Noto Sans Devanagari", cursive',
    tag: '✍️ व्यक्तिगत स्पर्श',
    icon: '✍️',
    sampleText: 'सदा मुस्कुराते रहो, जन्मदिन मुबारक',
    description: 'दिल से लिखी हुई डायरी जैसा आत्मीय व सुंदर हैंडराइटिंग लुक'
  },
  {
    id: 'modak',
    name: 'मोदक उत्सव बोल्ड',
    fontFamily: "'Modak', cursive",
    canvasFontFamily: '"Modak", "Noto Sans Devanagari", cursive',
    tag: '🎈 उत्सव व उमंग',
    icon: '🎈',
    sampleText: 'हैप्पी होली व रंगोत्सव 2026',
    description: 'होली, जन्मदिन और खुशियों के रंगीन पर्वों के लिए बोल्ड व चुलबुला'
  },
  {
    id: 'cinzel',
    name: 'गोल्डन सिंजल',
    fontFamily: "'Cinzel', serif",
    canvasFontFamily: '"Cinzel", "Rozha One", serif',
    tag: '⚜️ लक्ज़री गोल्ड',
    icon: '⚜️',
    sampleText: 'Happy Festive Greetings',
    description: 'शाही सुनहरे अक्षरों वाला अंतरराष्ट्रीय क्लासिक लुक'
  },
  {
    id: 'playfair',
    name: 'प्लेफेयर एलिगेंट',
    fontFamily: "'Playfair Display', serif",
    canvasFontFamily: '"Playfair Display", serif',
    tag: '💎 हाई-क्लास सेरिफ़',
    icon: '💎',
    sampleText: 'Warm Wishes & Blessings',
    description: 'एलीट मैगज़ीन व प्रीमियम ग्रीटिंग कार्ड जैसा सुरुचिपूर्ण फ़ॉन्ट'
  },
  {
    id: 'gotu',
    name: 'गोतु सुविचार',
    fontFamily: "'Gotu', 'Noto Sans Devanagari', sans-serif",
    canvasFontFamily: '"Gotu", "Noto Sans Devanagari", sans-serif',
    tag: '🌅 प्रभात सुविचार',
    icon: '🌅',
    sampleText: 'शुभ प्रभात, आपका दिन मंगलमय हो',
    description: 'दैनिक सुप्रभात, सुविचार और सकारात्मक संदेशों के लिए मनमोहक'
  },
  {
    id: 'noto_serif',
    name: 'वैदिक देवनागरी',
    fontFamily: "'Noto Serif Devanagari', serif",
    canvasFontFamily: '"Noto Serif Devanagari", serif',
    tag: '📖 वैदिक व पावन',
    icon: '📖',
    sampleText: '॥ ॐ नमो भगवते वासुदेवाय ॥',
    description: 'धार्मिक ग्रंथों, गीता श्लोकों और मंत्रों के लिए पारंपरिक व भव्य'
  },
  {
    id: 'dancing',
    name: 'डांसिंग कैलिग्राफी',
    fontFamily: "'Dancing Script', cursive",
    canvasFontFamily: '"Dancing Script", cursive',
    tag: '💖 स्टाइलिश करसिव',
    icon: '💖',
    sampleText: 'With Love and Warmth',
    description: 'प्यार भरे शुभकामना संदेशों व शादी-सालगिरह के लिए दिलकश'
  },
  {
    id: 'poppins',
    name: 'मॉडर्न पॉपिन्स',
    fontFamily: "'Poppins', sans-serif",
    canvasFontFamily: '"Poppins", "Noto Sans Devanagari", sans-serif',
    tag: '✨ स्वच्छ व मॉडर्न',
    icon: '✨',
    sampleText: 'आपको हार्दिक शुभकामनाएं',
    description: 'पढ़ने में सबसे आसान, क्रिस्टल क्लियर और मॉडर्न लुक'
  }
];

export interface FontColorTheme {
  id: string;
  name: string;
  gradientColors: [string, string, string];
  strokeColor: string;
  shadowColor: string;
  badge: string;
}

export const STATUS_COLOR_THEMES: FontColorTheme[] = [
  {
    id: 'gold_sunrise',
    name: 'स्वर्णिम प्रभात',
    gradientColors: ['#fffbeb', '#fde047', '#f59e0b'],
    strokeColor: '#78350f',
    shadowColor: 'rgba(245, 158, 11, 0.85)',
    badge: '🌅 प्रभात स्पेशल'
  },
  {
    id: 'saffron_ruby',
    name: 'केसरिया कुमकुम',
    gradientColors: ['#fef08a', '#f97316', '#dc2626'],
    strokeColor: '#450a0a',
    shadowColor: 'rgba(220, 38, 38, 0.85)',
    badge: '🪔 पावन मंगल'
  },
  {
    id: 'peacock_teal',
    name: 'मयूर पंखी',
    gradientColors: ['#ccfbf1', '#06b6d4', '#0284c7'],
    strokeColor: '#083344',
    shadowColor: 'rgba(6, 182, 212, 0.8)',
    badge: '🦚 दिव्य मयूर'
  },
  {
    id: 'rose_petal',
    name: 'गुलाब सिंदूर',
    gradientColors: ['#ffe4e6', '#f43f5e', '#be123c'],
    strokeColor: '#4c0519',
    shadowColor: 'rgba(244, 63, 94, 0.8)',
    badge: '🌸 स्नेह व प्रेम'
  },
  {
    id: 'pure_diamond',
    name: 'शुभ्र श्वेत',
    gradientColors: ['#ffffff', '#f1f5f9', '#cbd5e1'],
    strokeColor: '#0f172a',
    shadowColor: 'rgba(255, 255, 255, 0.75)',
    badge: '🤍 पावन शांति'
  }
];

export function getWishFontById(id: string): WishFontOption {
  return WISH_FONTS.find(f => f.id === id) || WISH_FONTS[0];
}

export function getColorThemeById(id: string): FontColorTheme {
  return STATUS_COLOR_THEMES.find(t => t.id === id) || STATUS_COLOR_THEMES[0];
}
