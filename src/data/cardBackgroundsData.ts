/**
 * 108+ Ultra HD Professional Backgrounds for Wishing Card Generation
 * Curated for Divine Devotional, Royal Luxury, Festive Lights, Birthday Celebrations,
 * Nature Sunrises, Holi Colors, Cosmic Auras, and Elegant Gradients.
 */

export interface CardBackground {
  id: string;
  name: string;
  category: 
    | 'devotional'
    | 'sunrise_nature'
    | 'celebration_birthday'
    | 'festive_lights'
    | 'holi_colors'
    | 'royal_luxury'
    | 'cosmic_spiritual'
    | 'flowers_spring'
    | 'luxury_gradient';
  categoryLabel: string;
  url: string;
  type: 'image' | 'gradient';
  cssGradient?: string;
  overlayStyle?: 'dark' | 'amber' | 'royal' | 'mystic';
}

export const BACKGROUND_CATEGORIES = [
  { id: 'all', label: '⭐ सभी (130+ बैकग्राउंड्स)', icon: '✨' },
  { id: 'devotional', label: '🪔 पावन मंदिर व ईश्वरीय', icon: '🪔' },
  { id: 'royal_luxury', label: '👑 शाही व मखमली लक्ज़री', icon: '👑' },
  { id: 'festive_lights', label: '🎆 दीप व स्वर्णिम रोशनी', icon: '🎆' },
  { id: 'celebration_birthday', label: '🎂 बर्थडे व उत्सव', icon: '🎂' },
  { id: 'sunrise_nature', label: '🌅 स्वर्णिम भोर व प्रकृति', icon: '🌅' },
  { id: 'flowers_spring', label: '🌸 पावन पुष्प व बसंत', icon: '🌸' },
  { id: 'holi_colors', label: '🎨 रंग, गुलाल व उमंग', icon: '🎨' },
  { id: 'cosmic_spiritual', label: '🌌 दिव्य आभा व ब्रह्मांड', icon: '🌌' },
  { id: 'luxury_gradient', label: '🎨 प्रीमियम ग्रेडिएंट्स', icon: '🎨' },
];

export const CARD_BACKGROUNDS: CardBackground[] = [
  // ==========================================
  // 1. 🪔 DEVOTIONAL & SACRED TEMPLE (14 BACKGROUNDS)
  // ==========================================
  {
    id: 'dev_sacred_diya',
    name: '🪔 पावन मंगल दीपक',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1609137144822-263a5639b71e?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_ganga_ghat',
    name: '🌊 पावन गंगा आरती घाट',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'dev_temple_bells',
    name: '🔔 पावन घंटियाँ व धूप',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_lotus_sacred',
    name: '🪷 दिव्य कमल व जल',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'dev_golden_temple_glow',
    name: '🏛️ स्वर्णिम मंदिर शिखर',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_brass_lamps',
    name: '🕯️ पीतल के पावन दीप',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_kailash_aura',
    name: '🏔️ शिव धाम कैलाश आभा',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1567591414240-e9a1170e4548?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'dev_incense_smoke',
    name: '💨 पावन धूप व सुगंध',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'dev_ancient_stone_temple',
    name: '🛕 प्राचीन नक्काशी मंदिर',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'dev_holy_fire',
    name: '🔥 पावन वैदिक यज्ञ अग्नि',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_puja_thali',
    name: '🪙 पावन पूजन थाली',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_temple_corridor',
    name: '🏛️ भव्य मंदिर गलियारा',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'dev_floating_diyas',
    name: '✨ गंगा जल में तैरते दीप',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_sandhya_aarti',
    name: '🌅 पावन संध्या आरती',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },

  // ==========================================
  // 2. 👑 ROYAL LUXURY & VELVET ELEGANCE (13 BACKGROUNDS)
  // ==========================================
  {
    id: 'royal_gold_mandala',
    name: '👑 शाही स्वर्ण मंडला',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_velvet_crimson',
    name: '🍷 मखमली गहरा लाल',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_black_gold',
    name: '🖤 लक्ज़री ब्लैक एंड गोल्ड',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'royal_emerald_silk',
    name: '💚 शाही पन्ना सिल्क',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_sapphire_night',
    name: '💙 शाही नीलम रेशम',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_golden_curtains',
    name: '✨ राजसी स्वर्णिम आभा',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'royal_brocade_pattern',
    name: '⚜️ बनारसी ब्रोकेड स्वर्ण',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_palace_lights',
    name: '🏰 राजमहल दीपमाला',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'royal_maroon_elegance',
    name: '🌹 गहरा मैरून व ज़री',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_golden_frame',
    name: '🖼️ प्राचीन स्वर्ण फ्रेम',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_rich_purple',
    name: '💜 मखमली बैंगनी राजसी',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_champagne_sparkle',
    name: '🥂 शैम्पेन गोल्ड स्पार्कल',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'royal_dark_ebony',
    name: '💎 डार्क एबोनी लक्ज़री',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },

  // ==========================================
  // 3. 🎆 FESTIVE LIGHTS & SPARKLING CELEBRATION (12 BACKGROUNDS)
  // ==========================================
  {
    id: 'fest_sparkler_bokeh',
    name: '✨ फुलझड़ी व स्वर्णिम बोकेह',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'fest_fireworks_grand',
    name: '🎆 भव्य आतिशबाजी आसमान',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'fest_fairy_lights_cozy',
    name: '💡 फेयरी लाइट्स जगमगाहट',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'fest_rangoli_colors',
    name: '🎨 रंगोली व दीप उत्सव',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'fest_lantern_sky',
    name: '🏮 आकाश दीप (लालटेन)',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'fest_glitter_gold_shower',
    name: '🌟 गोल्डन ग्लिटर शावर',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'fest_diya_rows',
    name: '🪔 दीपमाला पंक्तिबद्ध',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1576333917897-4c4cf4c1eb38?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'fest_golden_stars',
    name: '⭐ स्वर्णिम सितारे व चमक',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'fest_warm_candlelight',
    name: '🕯️ सौम्य मोमबत्ती प्रकाश',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'fest_midnight_fireworks',
    name: '🎇 आधी रात का दीपोत्सव',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'fest_golden_dust_burst',
    name: '✨ स्वर्ण कणों की फुहार',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'fest_night_city_lights',
    name: '🌃 रोशनी से जगमगाता शहर',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },

  // ==========================================
  // 4. 🎂 BIRTHDAY & PARTY CELEBRATION (12 BACKGROUNDS)
  // ==========================================
  {
    id: 'bday_golden_balloons',
    name: '🎈 स्वर्णिम बर्थडे गुब्बारे',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'bday_confetti_party',
    name: '🎉 रंगीन कंफेटी ब्लास्ट',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'bday_rose_gold_glam',
    name: '💖 रोज़ गोल्ड पार्टी ग्लैम',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'bday_silver_sparkle',
    name: '✨ सिल्वर शिमर स्पार्कल',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'bday_cake_candles',
    name: '🎂 बर्थडे मोमबत्तियां',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'bday_pastel_ribbons',
    name: '🎀 पेस्टल रिबन व गिफ्ट',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'bday_disco_lights',
    name: '🪩 डिस्को लाइट्स उल्लास',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'bday_gold_foil_fringe',
    name: '🎊 गोल्ड फ्रिंज पार्टी वॉल',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'bday_champagne_cheers',
    name: '🍾 जश्न व चीयर्स',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'bday_pink_bokeh',
    name: '🌸 गुलाबी बोकेह लाइट्स',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'bday_midnight_glitz',
    name: '🌙 मिडनाइट ग्लिट्ज़ पार्टी',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'bday_starry_celebration',
    name: '🌟 तारों भरी पार्टी रात',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },

  // ==========================================
  // 5. 🌅 SUNRISE & NATURE TRANQUILITY (12 BACKGROUNDS)
  // ==========================================
  {
    id: 'sun_golden_dawn',
    name: '🌅 स्वर्णिम सूर्योदय क्षितिज',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'sun_himalaya_snow',
    name: '🏔️ शांत हिमालय की पहली किरण',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'sun_ocean_calm',
    name: '🌊 शांत सागर तट प्रभात',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'sun_golden_fields',
    name: '🌾 सुनहरी फसलें व धूप',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'sun_forest_beams',
    name: '🌲 सघन वन में दिव्य किरणें',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'sun_misty_mountains',
    name: '⛰️ कोहरे से ढकी शांत पहाड़ियाँ',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'sun_lake_reflection',
    name: '🏞️ झील में सूर्य का प्रतिबिम्ब',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1439853949127-fa647821eea0?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'sun_green_meadows',
    name: '🌿 हरी-भरी घाटी व भोर',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'sun_clouds_golden',
    name: '☁️ बादलों में सुनहरी रोशनी',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'sun_waterfall_mist',
    name: '💦 शांत पावन जलप्रपात',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'sun_tranquil_river',
    name: '⛵ शांत नदी तट प्रभात',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'sun_lavender_field',
    name: '🪻 लैवेंडर के फूल व भोर',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },

  // ==========================================
  // 6. 🌸 SACRED FLOWERS & BOTANICALS (12 BACKGROUNDS)
  // ==========================================
  {
    id: 'flw_marigold_pooja',
    name: '🌼 पावन गेंदा व पुष्पमाला',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'flw_red_roses_royal',
    name: '🌹 शाही लाल गुलाब दल',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'flw_pink_lotus_pond',
    name: '🪷 गुलाबी कमल सरोवर',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'flw_jasmine_white',
    name: '🤍 सुगंधित श्वेत चमेली',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'flw_cherry_blossom',
    name: '🌸 चेरी ब्लॉसम वसंत',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'flw_sunflower_bright',
    name: '🌻 खिले हुए सूर्यमुखी',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'flw_golden_petals',
    name: '✨ स्वर्ण पंखुड़ियों की वृष्टि',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'flw_spring_garden',
    name: '🌷 सुरम्य वसंत वाटिका',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'flw_purple_orchids',
    name: '🪻 शाही ऑर्किड पुष्प',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'flw_dewdrop_rose',
    name: '💧 ओस की बूँदों संग गुलाब',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'flw_hibiscus_sacred',
    name: '🌺 देवी को प्रिय लाल गुड़हल',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'flw_wildflower_meadow',
    name: '🌼 वन पुष्पों की सुगंध',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },

  // ==========================================
  // 7. 🎨 HOLI & VIBRANT POWDER COLORS (11 BACKGROUNDS)
  // ==========================================
  {
    id: 'holi_gulal_explosion',
    name: '🎨 सतरंगी गुलाल धमाका',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1576333917897-4c4cf4c1eb38?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'holi_radha_krishna',
    name: '🦚 ब्रज की लट्ठमार होली',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1545232979-fbf526365f6f?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'holi_pink_powder_cloud',
    name: '💖 गुलाबी अबीर का बादल',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'holi_yellow_turmeric',
    name: '💛 पीताम्बरी हल्दी व चंदन',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'holi_rainbow_hands',
    name: '🌈 रंगों से सने पावन हाथ',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'holi_blue_krishna_hue',
    name: '💙 श्याम रंग नील गुलाल',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'holi_green_spring',
    name: '💚 फागुनी हरा रंग व उमंग',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'holi_orange_sindoor',
    name: '🧡 सिंदूरी नारंगी रंगोत्सव',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'holi_powder_splash',
    name: '💥 हवा में बिखरते दिव्य रंग',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'holi_festive_dance',
    name: '💃 फाग व उल्लास नृत्य',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'holi_dry_gulal_thali',
    name: '✨ सुगंधित गुलाल थाल',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },

  // ==========================================
  // 8. 🌌 COSMIC & SPIRITUAL AURA (11 BACKGROUNDS)
  // ==========================================
  {
    id: 'cos_divine_galaxy',
    name: '🌌 अनंत दिव्य आकाशगंगा',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'cos_om_spiritual_light',
    name: '🕉️ ॐ नाद व दिव्य प्रकाश',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'cos_nebula_violet',
    name: '🔮 बैंगनी नेबुला रहस्य',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'cos_northern_lights',
    name: '✨ ऑरोरा दिव्य तरंगें',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'cos_supernova_glow',
    name: '🌟 ब्रह्मांडीय ऊर्जा प्रवाह',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'cos_full_moon_divine',
    name: '🌕 पूर्णिमा का पावन चाँद',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'cos_starry_zen',
    name: '🌠 ध्रुव तारा व शांत गगन',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'cos_golden_portal',
    name: '🚪 स्वर्ण प्रकाश द्वार',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'cos_deep_meditation_blue',
    name: '🧘 ध्यानमग्न नीला सागर',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'cos_crystal_shimmer',
    name: '💎 स्फटिक ज्योति पुंज',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'cos_solar_eclipse',
    name: '☀️ सूर्य आभा व तेज चक्र',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },

  // ==========================================
  // 9. 🎨 LUXURY GRADIENTS & METALLIC SHIMMER (13 BACKGROUNDS)
  // ==========================================
  {
    id: 'grad_royal_gold_black',
    name: '⚜️ गहरा काला व स्वर्ण चमक',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1f1404 40%, #3d2600 70%, #0d0800 100%)',
    overlayStyle: 'amber'
  },
  {
    id: 'grad_velvet_ruby',
    name: '🍷 शाही रूबी रेड ग्रेडिएंट',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #1f0309 0%, #4a0614 45%, #7a0c20 70%, #1f0309 100%)',
    overlayStyle: 'royal'
  },
  {
    id: 'grad_emerald_forest',
    name: '🌲 पन्ना हरा व स्वर्ण आभा',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #02140d 0%, #063321 40%, #0c4d32 75%, #02140d 100%)',
    overlayStyle: 'dark'
  },
  {
    id: 'grad_midnight_sapphire',
    name: '🌌 गहरा नीलम व रजत चमक',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #030a17 0%, #091a38 45%, #13336e 75%, #030a17 100%)',
    overlayStyle: 'mystic'
  },
  {
    id: 'grad_festive_sunset',
    name: '🌅 सांध्य नारंगी व कत्थई',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #2b0b00 0%, #591900 40%, #872e04 70%, #2b0b00 100%)',
    overlayStyle: 'amber'
  },
  {
    id: 'grad_mystic_amethyst',
    name: '🔮 जामुनी अमेथिस्ट लक्ज़री',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #170424 0%, #350b52 45%, #591687 75%, #170424 100%)',
    overlayStyle: 'royal'
  },
  {
    id: 'grad_champagne_silk',
    name: '🥂 शैम्पेन सिल्क व मूनलाइट',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #1c1811 0%, #383020 45%, #54482f 75%, #1c1811 100%)',
    overlayStyle: 'amber'
  },
  {
    id: 'grad_crimson_gold_duo',
    name: '🔥 रक्तवर्ण व स्वर्ण किनारी',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #240505 0%, #4f0b0b 45%, #421e06 75%, #140303 100%)',
    overlayStyle: 'royal'
  },
  {
    id: 'grad_peacock_feather',
    name: '🦚 मोरपंखी नीला-हरा',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #021a1f 0%, #053b47 40%, #0d5e54 75%, #021a1f 100%)',
    overlayStyle: 'mystic'
  },
  {
    id: 'grad_deep_obsidian',
    name: '🖤 गहरा ऑब्सिडियन मार्बल',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #080808 0%, #171717 50%, #262626 75%, #080808 100%)',
    overlayStyle: 'dark'
  },
  {
    id: 'grad_rose_quartz',
    name: '🌸 रोज़ क्वार्ट्ज मखमली',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #210312 0%, #450827 45%, #66123e 75%, #210312 100%)',
    overlayStyle: 'royal'
  },
  {
    id: 'grad_vedic_saffron',
    name: '🚩 पावन भगवा व स्वर्ण तेज',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #2e0d02 0%, #5e1c05 40%, #913108 70%, #2e0d02 100%)',
    overlayStyle: 'amber'
  },
  {
    id: 'grad_royal_midnight',
    name: '🌌 राजसी मध्यरात्रि नीला',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #02050f 0%, #08112e 45%, #101c4a 75%, #02050f 100%)',
    overlayStyle: 'mystic'
  },
  // ==========================================
  // ADDITIONAL ULTRA-HD MESMERIZING BACKGROUNDS
  // ==========================================
  {
    id: 'dev_kashi_evening_aarti',
    name: '🪔 काशी दशाश्वमेध महाआरती',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1561361066-6f212217c050?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_golden_amritsar_temple',
    name: '✨ श्री हरमंदिर साहिब स्वर्ण आभा',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'dev_sacred_temple_bells',
    name: '🔔 देवालय की पावन घंटियां व धूप',
    category: 'devotional',
    categoryLabel: 'पावन मंदिर व ईश्वरीय',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'royal_rajputana_jharokha',
    name: '🏰 राजपूताना स्वर्ण झरोखा व महल',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'royal_amber_fort_palace',
    name: '👑 आमेर दुर्ग स्वर्णिम दीपमाला',
    category: 'royal_luxury',
    categoryLabel: 'शाही व मखमली लक्ज़री',
    url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'bday_golden_sparkle_champagne',
    name: '🍾 गोल्डन स्पार्कल सेलिब्रेशन',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'bday_confetti_party_lights',
    name: '🎉 रंगीन कॉनफेटी व डिस्को लाइट्स',
    category: 'celebration_birthday',
    categoryLabel: 'बर्थडे व उत्सव',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'sun_himalayan_sunrise_gold',
    name: '🏔️ हिमालय की चोटियों पर स्वर्णिम सूर्योदय',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'sun_morning_lotus_mist',
    name: '🪷 ब्रह्मकमल सरोवर व सुबह का कोहरा',
    category: 'sunrise_nature',
    categoryLabel: 'स्वर्णिम भोर व प्रकृति',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'lights_floating_lanterns_sky',
    name: '🏮 आकाशदीप व स्वर्णिम लालटेन',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'lights_deepotsav_ayodhya',
    name: '🪔 अयोध्या दीपोत्सव महासरयू तट',
    category: 'festive_lights',
    categoryLabel: 'दीप व स्वर्णिम रोशनी',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'flowers_marigold_genda_festive',
    name: '🌼 पावन गेंदा व आम्र पल्लव बंदनवार',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'amber'
  },
  {
    id: 'flowers_pink_rose_velvet',
    name: '🌹 गुलाबी गुलाब पंखुड़ियों की चादर',
    category: 'flowers_spring',
    categoryLabel: 'पावन पुष्प व बसंत',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'royal'
  },
  {
    id: 'cosmic_divine_galaxy_portal',
    name: '🌌 अनंत ब्रह्मांडीय तेज व आकाशगंगा',
    category: 'cosmic_spiritual',
    categoryLabel: 'दिव्य आभा व ब्रह्मांड',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'mystic'
  },
  {
    id: 'holi_vrindavan_gulal_sky',
    name: '🌈 बरसाना लट्ठमार होली व गुलाल फुहार',
    category: 'holi_colors',
    categoryLabel: 'रंग, गुलाल व उमंग',
    url: 'https://images.unsplash.com/photo-1551972251-12070d63502a?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    overlayStyle: 'dark'
  },
  {
    id: 'grad_celestial_aurora_emerald',
    name: '💚 दिव्य ऑरोरा पन्ना व स्वर्ण',
    category: 'luxury_gradient',
    categoryLabel: 'प्रीमियम ग्रेडिएंट्स',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #03140c 0%, #063d27 45%, #0f6643 75%, #03140c 100%)',
    overlayStyle: 'amber'
  }
];

export function getBackgroundById(id: string): CardBackground {
  return CARD_BACKGROUNDS.find(b => b.id === id) || CARD_BACKGROUNDS[0];
}

export function getDefaultBackgroundForCategory(slug: string): CardBackground {
  const clean = slug.toLowerCase();
  if (clean.includes('birthday') || clean.includes('bday')) {
    return CARD_BACKGROUNDS.find(b => b.id === 'bday_golden_balloons') || CARD_BACKGROUNDS[0];
  }
  if (clean.includes('diwali') || clean.includes('deepawali') || clean.includes('laxmi')) {
    return CARD_BACKGROUNDS.find(b => b.id === 'dev_sacred_diya') || CARD_BACKGROUNDS[0];
  }
  if (clean.includes('holi')) {
    return CARD_BACKGROUNDS.find(b => b.id === 'holi_gulal_explosion') || CARD_BACKGROUNDS[0];
  }
  if (clean.includes('morning') || clean.includes('suprabhat')) {
    return CARD_BACKGROUNDS.find(b => b.id === 'sun_golden_dawn') || CARD_BACKGROUNDS[0];
  }
  if (clean.includes('anniversary') || clean.includes('love') || clean.includes('wedding')) {
    return CARD_BACKGROUNDS.find(b => b.id === 'royal_velvet_crimson') || CARD_BACKGROUNDS[0];
  }
  if (clean.includes('shiv') || clean.includes('navratri') || clean.includes('durga')) {
    return CARD_BACKGROUNDS.find(b => b.id === 'dev_kailash_aura') || CARD_BACKGROUNDS[0];
  }
  return CARD_BACKGROUNDS[0];
}
