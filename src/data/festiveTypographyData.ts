/**
 * 10 Distinctive Festive Typography & Font Calligraphy Styles
 * Directly crafted from the user's festive greeting collage:
 * 1. Happy Diwali - Royal Gold Serif with Diya flourish
 * 2. Happy Holi - Multicolor Dry-Brush Splash
 * 3. Happy Navratri - Divine Crimson with Trishul & Lotus
 * 4. Happy Raksha Bandhan - Flowing Blue Ribbon Cursive
 * 5. Happy Makar Sankranti - Sunshine Kite & Caramel Script
 * 6. Happy Eid - Crescent Moon Emerald Swash
 * 7. Happy Ganesh Chaturthi - Sacred Saffron Calligraphy
 * 8. Happy Janmashtami - Peacock Blue Cursive with Flute
 * 9. Happy Christmas - Festive Holly Berry Brush
 * 10. Happy New Year - 24K Gold Sparkle on Midnight
 */

export interface FestiveTypographyStyle {
  id: string;
  numberBadge: string;
  name: string;
  nameHi: string;
  categoryInspiration: string;
  fontFamily: string;
  canvasFont: string;
  titleClassName: string;
  gradientTextClass: string;
  glowColor: string;
  primaryColor: string;
  accentMotif: string;
  previewSample: string;
  description: string;
}

export const FESTIVE_TYPOGRAPHY_STYLES: FestiveTypographyStyle[] = [
  {
    id: 'diwali_royal_gold',
    numberBadge: '①',
    name: 'Diwali Royal Gold Serif',
    nameHi: 'दिवाली रॉयल गोल्ड (Flourish Serif)',
    categoryInspiration: 'दीपावली व धनतेरस',
    fontFamily: "'Playfair Display', 'Rozha One', Georgia, serif",
    canvasFont: "bold 64px 'Playfair Display', 'Rozha One', serif",
    titleClassName: "font-serif tracking-wide italic font-bold",
    gradientTextClass: "bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(245,158,11,0.7)]",
    glowColor: 'rgba(245, 158, 11, 0.75)',
    primaryColor: '#f59e0b',
    accentMotif: '🪔',
    previewSample: 'Happy Diwali',
    description: 'स्वर्णिम दीप, शाही वक्र कर्व्स और अलौकिक तेज'
  },
  {
    id: 'holi_color_splash',
    numberBadge: '②',
    name: 'Holi Vibrant Color Splash',
    nameHi: 'होली कलर स्प्लैश (Multicolor Brush)',
    categoryInspiration: 'होली व रंगोत्सव',
    fontFamily: "'Pacifico', 'Modak', 'Poppins', cursive",
    canvasFont: "bold 68px 'Pacifico', cursive",
    titleClassName: "tracking-normal font-normal",
    gradientTextClass: "bg-gradient-to-r from-fuchsia-500 via-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(236,72,153,0.8)]",
    glowColor: 'rgba(236, 72, 153, 0.8)',
    primaryColor: '#ec4899',
    accentMotif: '🎨',
    previewSample: 'Happy Holi',
    description: 'सतरंगी गुलाल, ड्राई-ब्रुश टेक्सचर और उत्सव की उमंग'
  },
  {
    id: 'navratri_divine_crimson',
    numberBadge: '③',
    name: 'Navratri Divine Crimson',
    nameHi: 'नवरात्रि डिवाइन क्रिमसन (Sacred Script)',
    categoryInspiration: 'नवरात्रि व दुर्गा पूजा',
    fontFamily: "'Rozha One', 'Cinzel Decorative', serif",
    canvasFont: "900 66px 'Rozha One', serif",
    titleClassName: "font-serif font-black tracking-wide",
    gradientTextClass: "bg-gradient-to-r from-rose-500 via-red-600 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(220,38,38,0.8)]",
    glowColor: 'rgba(220, 38, 38, 0.8)',
    primaryColor: '#dc2626',
    accentMotif: '🔱',
    previewSample: 'Happy Navratri',
    description: 'माँ जगदम्बा का पावन सिंदूरी लाल, त्रिशूल व कमल सुलेख'
  },
  {
    id: 'raksha_bandhan_ribbon',
    numberBadge: '④',
    name: 'Raksha Bandhan Ribbon Cursive',
    nameHi: 'रक्षाबंधन कर्सिव रिबन (Royal Blue)',
    categoryInspiration: 'रक्षाबंधन व भाई दूज',
    fontFamily: "'Dancing Script', 'Great Vibes', cursive",
    canvasFont: "bold 72px 'Dancing Script', cursive",
    titleClassName: "font-serif italic font-bold",
    gradientTextClass: "bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(59,130,246,0.7)]",
    glowColor: 'rgba(59, 130, 246, 0.75)',
    primaryColor: '#3b82f6',
    accentMotif: '🪢',
    previewSample: 'Happy Raksha Bandhan',
    description: 'रेशम का पवित्र धागा व आधुनिक रॉयल ब्लू कर्सिव'
  },
  {
    id: 'makar_sankranti_sunshine',
    numberBadge: '⑤',
    name: 'Makar Sankranti Sunshine Kite',
    nameHi: 'मकर संक्रांति सनशाइन (Playful Serif)',
    categoryInspiration: 'मकर संक्रांति व पोंगल',
    fontFamily: "'Poppins', 'Playfair Display', sans-serif",
    canvasFont: "800 62px 'Poppins', sans-serif",
    titleClassName: "font-sans font-extrabold tracking-tight",
    gradientTextClass: "bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.6)]",
    glowColor: 'rgba(245, 158, 11, 0.65)',
    primaryColor: '#f59e0b',
    accentMotif: '🪁',
    previewSample: 'Happy Makar Sankranti',
    description: 'स्वर्णिम धूप, नीले गगन में रंगीन पतंग और गुड़-तिल की मिठास'
  },
  {
    id: 'eid_crescent_emerald',
    numberBadge: '⑥',
    name: 'Eid Crescent Emerald Swash',
    nameHi: 'ईद क्रेसेंट एमराल्ड (Islamic Swash)',
    categoryInspiration: 'ईद व रमजान मुबारक',
    fontFamily: "'Playfair Display', 'Cinzel Decorative', serif",
    canvasFont: "bold 66px 'Playfair Display', serif",
    titleClassName: "font-serif italic font-extrabold",
    gradientTextClass: "bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(16,185,129,0.75)]",
    glowColor: 'rgba(16, 185, 129, 0.8)',
    primaryColor: '#10b981',
    accentMotif: '🌙',
    previewSample: 'Happy Eid',
    description: 'पावन दूज का चाँद, पन्ना हरा रंग व अलौकिक कर्व्स'
  },
  {
    id: 'ganesh_sacred_art',
    numberBadge: '⑦',
    name: 'Ganesh Sacred Calligraphy',
    nameHi: 'गणेश चतुर्थी सैक्रिड आर्ट (Devotional Saffron)',
    categoryInspiration: 'गणेश चतुर्थी',
    fontFamily: "'Rozha One', 'Yatra One', 'Cinzel', serif",
    canvasFont: "bold 64px 'Rozha One', serif",
    titleClassName: "font-serif font-bold tracking-wide",
    gradientTextClass: "bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(234,88,12,0.7)]",
    glowColor: 'rgba(234, 88, 12, 0.75)',
    primaryColor: '#ea580c',
    accentMotif: '🐘',
    previewSample: 'Happy Ganesh Chaturthi',
    description: 'प्रथम पूज्य गणपति की पावन सिंदूरी आभा व वैदिक सुलेख'
  },
  {
    id: 'janmashtami_peacock_blue',
    numberBadge: '⑧',
    name: 'Janmashtami Peacock Flute',
    nameHi: 'जन्माष्टमी पीकॉक ब्लू (Flute & Feather)',
    categoryInspiration: 'श्री कृष्ण जन्माष्टमी',
    fontFamily: "'Dancing Script', 'Great Vibes', cursive",
    canvasFont: "bold 72px 'Dancing Script', cursive",
    titleClassName: "font-serif italic font-bold",
    gradientTextClass: "bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(14,165,233,0.8)]",
    glowColor: 'rgba(14, 165, 233, 0.8)',
    primaryColor: '#0ea5e9',
    accentMotif: '🪈',
    previewSample: 'Happy Janmashtami',
    description: 'श्याम रंग, मोरपंख की छटा और कान्हा की बंसी का जादू'
  },
  {
    id: 'christmas_holly_berry',
    numberBadge: '⑨',
    name: 'Christmas Holly Berry Brush',
    nameHi: 'क्रिसमस हॉली बेरी (Holiday Brush)',
    categoryInspiration: 'क्रिसमस व गुड फ्राइडे',
    fontFamily: "'Pacifico', 'Playfair Display', cursive",
    canvasFont: "normal 68px 'Pacifico', cursive",
    titleClassName: "tracking-normal font-normal",
    gradientTextClass: "bg-gradient-to-r from-rose-500 via-red-500 to-rose-300 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(244,63,94,0.7)]",
    glowColor: 'rgba(244, 63, 94, 0.75)',
    primaryColor: '#f43f5e',
    accentMotif: '🎄',
    previewSample: 'Happy Christmas',
    description: 'सफेद हिमपात, पाइन की पत्तियाँ व हॉली बेरी ब्रश सुलेख'
  },
  {
    id: 'new_year_gold_sparkle',
    numberBadge: '⑩',
    name: 'New Year Golden Sparkle',
    nameHi: 'न्यू ईयर 24K गोल्डन स्पार्कल (Midnight Luxe)',
    categoryInspiration: 'नव वर्ष 2027',
    fontFamily: "'Great Vibes', 'Cinzel Decorative', cursive",
    canvasFont: "bold 76px 'Great Vibes', cursive",
    titleClassName: "font-serif italic font-bold tracking-wider",
    gradientTextClass: "bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(250,204,21,0.85)]",
    glowColor: 'rgba(250, 204, 21, 0.85)',
    primaryColor: '#facc15',
    accentMotif: '✨',
    previewSample: 'Happy New Year',
    description: '24K गोल्ड फॉयल कैलीग्राफी व मध्यरात्रि आतिशबाजी'
  }
];

export function getTypographyStyleById(id: string): FestiveTypographyStyle {
  return FESTIVE_TYPOGRAPHY_STYLES.find(s => s.id === id) || FESTIVE_TYPOGRAPHY_STYLES[0];
}

export function getDefaultTypographyForFestival(festivalId: string, slug: string = ''): FestiveTypographyStyle {
  const key = `${festivalId} ${slug}`.toLowerCase();
  if (key.includes('diwali') || key.includes('deepawali') || key.includes('dhanteras') || key.includes('kuber')) {
    return FESTIVE_TYPOGRAPHY_STYLES[0]; // Diwali
  }
  if (key.includes('holi')) {
    return FESTIVE_TYPOGRAPHY_STYLES[1]; // Holi
  }
  if (key.includes('navratri') || key.includes('durga') || key.includes('chandi')) {
    return FESTIVE_TYPOGRAPHY_STYLES[2]; // Navratri
  }
  if (key.includes('raksha') || key.includes('rakhi') || key.includes('bhai_dooj') || key.includes('bhaidooj')) {
    return FESTIVE_TYPOGRAPHY_STYLES[3]; // Rakhi
  }
  if (key.includes('sankranti') || key.includes('pongal') || key.includes('lohri')) {
    return FESTIVE_TYPOGRAPHY_STYLES[4]; // Makar Sankranti
  }
  if (key.includes('eid') || key.includes('ramadan') || key.includes('bakrid') || key.includes('muharram')) {
    return FESTIVE_TYPOGRAPHY_STYLES[5]; // Eid
  }
  if (key.includes('ganesh') || key.includes('ganpati') || key.includes('vinayaka')) {
    return FESTIVE_TYPOGRAPHY_STYLES[6]; // Ganesh
  }
  if (key.includes('krishna') || key.includes('janmashtami')) {
    return FESTIVE_TYPOGRAPHY_STYLES[7]; // Janmashtami
  }
  if (key.includes('christmas') || key.includes('good_friday') || key.includes('easter')) {
    return FESTIVE_TYPOGRAPHY_STYLES[8]; // Christmas
  }
  if (key.includes('newyear') || key.includes('new_year') || key.includes('anniversary') || key.includes('birthday')) {
    return FESTIVE_TYPOGRAPHY_STYLES[9]; // New Year
  }
  return FESTIVE_TYPOGRAPHY_STYLES[0];
}
