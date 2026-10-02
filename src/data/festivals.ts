export interface FestivalFAQ {
  question: string;
  answer: string;
}

export type FestivalCategory = 'hindu' | 'muslim' | 'christian' | 'sikh_jain' | 'social_national' | 'personal';

export interface CategoryInfo {
  id: FestivalCategory;
  nameHi: string;
  nameEn: string;
  icon: string;
  badge: string;
  description: string;
}

export const FESTIVAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'hindu',
    nameHi: 'हिंदू महापर्व',
    nameEn: 'Hindu Festivals',
    icon: '🪔',
    badge: 'सनातन पर्व',
    description: 'दीपावली, धनतेरस, छठ, होली, शिवरात्रि, रामनवमी, जन्माष्टमी, गणेश चतुर्थी, नवरात्रि आदि'
  },
  {
    id: 'muslim',
    nameHi: 'मुस्लिम पर्व',
    nameEn: 'Muslim Festivals',
    icon: '🌙',
    badge: 'इस्लामी मुबारक पर्व',
    description: 'ईद-उल-फितर, बकरीद, मुहर्रम, ईद मिलाद-उन-नबी, रमज़ानुल मुबारक, शब-ए-बारात'
  },
  {
    id: 'christian',
    nameHi: 'ईसाई पर्व',
    nameEn: 'Christian Festivals',
    icon: '✝️',
    badge: 'क्रिश्चियन पर्व',
    description: 'मेरी क्रिसमस, ईस्टर संडे, गुड फ्राइडे, नव वर्ष 2026, पाम संडे'
  },
  {
    id: 'sikh_jain',
    nameHi: 'सिख व जैन पर्व',
    nameEn: 'Sikh & Jain Festivals',
    icon: '☬',
    badge: 'गुरुपर्व व अहिंसा',
    description: 'गुरु नानक जयंती, बैसाखी, बंदी छोड़ दिवस, महावीर जयंती, पर्युषण पर्व'
  },
  {
    id: 'social_national',
    nameHi: 'सामाजिक व राष्ट्रीय पर्व',
    nameEn: 'Social & National',
    icon: '🇮🇳',
    badge: 'जयंती व गौरव दिवस',
    description: 'डॉ. आंबेडकर जयंती (14 अप्रैल), संविधान दिवस, बुद्ध पूर्णिमा, संत रविदास जयंती, 15 अगस्त, 26 जनवरी'
  },
  {
    id: 'personal',
    nameHi: 'बधाई व उत्सव',
    nameEn: 'Personal Wishes',
    icon: '🎂',
    badge: 'शुभकामनाएँ',
    description: 'जन्मदिन, शादी की सालगिरह, विवाह बधाई, गृह प्रवेश, सुप्रभात, शुभ रात्रि'
  }
];

export interface Festival {
  id: string;
  slug: string;
  nameHi: string;
  nameEn: string;
  taglineHi: string;
  category: FestivalCategory;
  dateLabel: string;
  countdownDays: number;
  badge: string;
  heroImage: string;
  themeColor: {
    gradient: string;
    border: string;
    accent: string;
    glow: string;
  };
  particlesType: 'fireworks' | 'diyas' | 'confetti' | 'colors' | 'flowers' | 'stars';
  soundType: 'aarti' | 'fireworks' | 'flute' | 'birthday' | 'damru' | 'shankh';
  greetingTitle: string;
  defaultPoem: string;
  mantraOrShloka?: string;
  significance: string;
  shubhMuhurat: string;
  seoTopWishes: string[];
  faqs: FestivalFAQ[];
}

export const FESTIVALS: Festival[] = [
  // ==========================================
  // 1. हिंदू महापर्व (HINDU FESTIVALS)
  // ==========================================
  {
    id: 'diwali',
    slug: 'diwali-wishes',
    nameHi: 'शुभ दीपावली 2026',
    nameEn: 'Happy Diwali 2026',
    taglineHi: 'दीपों का पावन महापर्व • लक्ष्मी-गणेश कृपा',
    category: 'hindu',
    dateLabel: 'कार्तिक अमावस्या',
    countdownDays: 14,
    badge: '🔥 सबसे बड़ा महापर्व',
    heroImage: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-amber-950 via-yellow-900 to-stone-950',
      border: 'border-amber-500/40',
      accent: 'text-amber-400',
      glow: 'shadow-amber-500/20'
    },
    particlesType: 'fireworks',
    soundType: 'fireworks',
    greetingTitle: 'शुभ दीपावली की हार्दिक शुभकामनाएँ',
    defaultPoem: 'दीयों की रोशनी से जगमगाए आपका संसार, सुख, समृद्धि और आरोग्य मिले अपार। माँ लक्ष्मी और भगवान गणेश जी की कृपा आप पर सदा बनी रहे।',
    mantraOrShloka: 'ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ ॥',
    significance: 'दीपावली अंधकार पर प्रकाश और बुराई पर अच्छाई की विजय का प्रतीक है। भगवान श्री राम के अयोध्या आगमन पर दीपोत्सव मनाया जाता है।',
    shubhMuhurat: 'लक्ष्मी-गणेश पूजन का श्रेष्ठ प्रदोष काल: सायं 06:15 से 08:30 बजे तक।',
    seoTopWishes: ['दीपक का प्रकाश आपके जीवन के हर अंधेरे को दूर करे। शुभ दीपावली!', 'माँ लक्ष्मी आपके घर में सदा वास करें।'],
    faqs: [{ question: 'दीपावली पूजन मुहूर्त कब है?', answer: 'प्रदोष काल में सायं 06:15 से 08:30 बजे तक श्रेष्ठ है।' }]
  },
  {
    id: 'dhanteras',
    slug: 'dhanteras-kuber-pooja-wishes',
    nameHi: 'धनतेरस 2026 • धन्वंतरि जयंती',
    nameEn: 'Dhanteras & Kuber Pooja Wishes',
    taglineHi: 'आरोग्य, समृद्धि और कुबेर देव का पावन आशीर्वाद',
    category: 'hindu',
    dateLabel: 'कार्तिक कृष्ण त्रयोदशी',
    countdownDays: 12,
    badge: '🪙 कुबेर कृपा',
    heroImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-yellow-950 via-amber-900 to-stone-950',
      border: 'border-yellow-400/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'diyas',
    soundType: 'aarti',
    greetingTitle: 'शुभ धनतेरस की मंगलमय शुभकामनाएँ',
    defaultPoem: 'धन-धान्य से भर जाए घर-आँगन आपका, उत्तम स्वास्थ्य और अपार समृद्धि हो। कुबेर देव और धन्वंतरि भगवान की कृपा से हर दिन मंगलमय हो!',
    mantraOrShloka: 'ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये धनधान्यसमृद्धिं मे देहि दापय स्वाहा ॥',
    significance: 'समुद्र मंथन से अमृत कलश लेकर भगवान धन्वंतरि का प्राकट्य हुआ था। इस दिन बर्तन, सोना-चाँदी खरीदना अत्यंत शुभकारी है।',
    shubhMuhurat: 'धनतेरस खरीददारी का शुभ समय सायं 05:45 से रात्रि 08:20 तक।',
    seoTopWishes: ['धनतेरस पर कुबेर देव आपके भंडार भरे रखें। शुभ धनतेरस!', 'आरोग्य और समृद्धि आपके द्वार आए।'],
    faqs: [{ question: 'धनतेरस पर क्या खरीदना शुभ होता है?', answer: 'धातु के बर्तन, सोने-चाँदी के सिक्के, झाड़ू और धनिया खरीदना शुभ है।' }]
  },
  {
    id: 'chhath_puja',
    slug: 'chhath-puja-surya-arghya-wishes',
    nameHi: 'छठ महापर्व 2026 • सूर्य षष्ठी',
    nameEn: 'Chhath Puja Mahaparv Wishes',
    taglineHi: 'भगवान सूर्य और छठी मइया की पावन लोक आस्था का महापर्व',
    category: 'hindu',
    dateLabel: 'कार्तिक शुक्ल षष्ठी',
    countdownDays: 20,
    badge: '☀️ छठी मइया',
    heroImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-orange-950 via-amber-900 to-stone-950',
      border: 'border-orange-500/40',
      accent: 'text-orange-300',
      glow: 'shadow-orange-500/20'
    },
    particlesType: 'diyas',
    soundType: 'shankh',
    greetingTitle: 'छठ महापर्व की हार्दिक शुभकामनाएँ • जय छठी मइया',
    defaultPoem: 'उगते और ढलते सूर्य देव को अर्घ्य देकर, छठी मइया का आशीष पाएं। आपके घर-परिवार में संतान सुख, आरोग्य और ऐश्वर्य की बहार आए।',
    mantraOrShloka: 'ॐ सूर्याय नमः • ॐ घृणि सूर्याय नमः ॥',
    significance: 'छठ पर्व प्रकृति, जल और सूर्य देव की उपासना का सबसे पवित्र और कठोर व्रत है, जिसमें डूबते और उगते सूर्य दोनों को अर्घ्य दिया जाता है।',
    shubhMuhurat: 'सायंकालीन अर्घ्य: सूर्यास्त समय 05:32 बजे। प्रातःकालीन अर्घ्य: सूर्योदय 06:28 बजे।',
    seoTopWishes: ['छठी मइया आपके परिवार को हर संकट से बचाएं। छठ महापर्व की बधाई!', 'सूर्य देव का तेज आपके जीवन को आलोकित करे।'],
    faqs: [{ question: 'छठ पूजा में क्या विशेष प्रसाद बनता है?', answer: 'शुद्ध घी में बना ठेकुआ, चावल के लड्डू और मौसमी फल।' }]
  },
  {
    id: 'bhai_dooj',
    slug: 'bhai-dooj-wishes',
    nameHi: 'भाई दूज 2026 • यम द्वितीया',
    nameEn: 'Bhai Dooj Yam Dwitiya Wishes',
    taglineHi: 'बहन का स्नेह, भाई की दीर्घायु और अटूट रक्षा का संकल्प',
    category: 'hindu',
    dateLabel: 'कार्तिक शुक्ल द्वितीया',
    countdownDays: 16,
    badge: '💖 भाई-बहन का प्रेम',
    heroImage: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-rose-950 via-red-900 to-stone-950',
      border: 'border-rose-400/40',
      accent: 'text-rose-300',
      glow: 'shadow-rose-500/20'
    },
    particlesType: 'flowers',
    soundType: 'aarti',
    greetingTitle: 'भाई दूज की सप्रेम शुभकामनाएँ',
    defaultPoem: 'थाल सजाकर बैठी बहना, तिलक लगाए माथे पर भाई के। लंबी उम्र और खुशहाली की दुआ मांगे, सदा बनी रहे यह अनमोल प्रीति!',
    significance: 'यमुना जी ने अपने भाई यमराज को अपने घर भोजन कराया था। इस दिन बहन के हाथ से भोजन करने पर भाई को अकाल मृत्यु का भय नहीं रहता।',
    shubhMuhurat: 'भाई दूज पर तिलक का शुभ समय अपराह्न 01:15 से 03:25 बजे तक।',
    seoTopWishes: ['मेरी प्यारी बहना का प्यार और भाई का दुलार सदा बना रहे। भाई दूज मुबारक!'],
    faqs: [{ question: 'भाई दूज पर क्या परंपरा है?', answer: 'बहनें भाई के माथे पर तिलक लगाकर आरती उतारती हैं और भोजन कराती हैं।' }]
  },
  {
    id: 'holi',
    slug: 'holi-wishes',
    nameHi: 'होली 2026 • रंगों का महापर्व',
    nameEn: 'Happy Holi 2026',
    taglineHi: 'उमंग, उत्साह, गुलाल और राधा-कृष्ण की पावन प्रेम होली',
    category: 'hindu',
    dateLabel: 'फाल्गुन पूर्णिमा',
    countdownDays: 45,
    badge: '🎨 रंगों का त्योहार',
    heroImage: 'https://images.unsplash.com/photo-1576333917897-4c4cf4c1eb38?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-pink-950 via-rose-900 to-stone-950',
      border: 'border-pink-500/40',
      accent: 'text-pink-400',
      glow: 'shadow-pink-500/20'
    },
    particlesType: 'colors',
    soundType: 'fireworks',
    greetingTitle: 'होली के पावन रंगों की सप्रेम शुभकामनाएँ',
    defaultPoem: 'गुलाल का टीका, खुशियों की बौछार, अपनों का स्नेह और राधा-कृष्ण का दुलार। मुबारक हो आपको होली का पावन त्योहार!',
    mantraOrShloka: 'ॐ नमो भगवते वासुदेवाय नमः ॥',
    significance: 'भक्त प्रह्लाद की अटूट भक्ति और होलिका दहन का प्रतीक है। ब्रज की लट्ठमार होली विश्व प्रसिद्ध है।',
    shubhMuhurat: 'होलिका दहन का श्रेष्ठ मुहूर्त रात्रि 08:30 से 10:45 बजे तक।',
    seoTopWishes: ['रंगों के इस पावन त्योहार में आपके जीवन में सुख, शांति और समृद्धि के रंग भर जाएँ।'],
    faqs: [{ question: 'होली का क्या संदेश है?', answer: 'आपसी मनमुटाव भुलाकर प्रेम और भाईचारे का रंग लगाना।' }]
  },
  {
    id: 'shivratri',
    slug: 'maha-shivratri-wishes',
    nameHi: 'महाशिवरात्रि 2026',
    nameEn: 'Maha Shivratri Wishes',
    taglineHi: 'देवाधिदेव महादेव और माता पार्वती का पावन कल्याणकारी उत्सव',
    category: 'hindu',
    dateLabel: 'फाल्गुन कृष्ण चतुर्दशी',
    countdownDays: 60,
    badge: '🔱 ॐ नमः शिवाय',
    heroImage: 'https://images.unsplash.com/photo-1567591414240-e9a1170e4548?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-blue-950 via-cyan-950 to-stone-950',
      border: 'border-cyan-500/40',
      accent: 'text-cyan-300',
      glow: 'shadow-cyan-500/20'
    },
    particlesType: 'diyas',
    soundType: 'damru',
    greetingTitle: 'महाशिवरात्रि की मंगलमय शुभकामनाएँ',
    defaultPoem: 'भोले की भक्ति में लीन हो सारा संसार, हर कष्ट मिटे जब मिले शिव का दुलार। डमरू की धुन पर झूमे मन हमारा, हर-हर महादेव से गूंजे जग सारा।',
    mantraOrShloka: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥',
    significance: 'महाशिवरात्रि शिव और शक्ति के मिलन की महानिशा है। इस रात्रि रुद्राभिषेक से संपूर्ण मनोरथ सिद्ध होते हैं।',
    shubhMuhurat: 'निशिता काल पूजा: मध्यरात्रि 11:45 से 12:35 तक।',
    seoTopWishes: ['महादेव आपके जीवन से सभी कष्टों का नाश करें। हर-हर महादेव!'],
    faqs: [{ question: 'शिवलिंग पर क्या चढ़ाना चाहिए?', answer: 'जल, दूध, बेलपत्र, धतूरा और भस्म।' }]
  },
  {
    id: 'ramnavami',
    slug: 'ram-navami-wishes',
    nameHi: 'श्री राम नवमी 2026',
    nameEn: 'Shree Ram Navami Wishes',
    taglineHi: 'मर्यादा पुरुषोत्तम प्रभु श्री राम का पावन जन्मोत्सव',
    category: 'hindu',
    dateLabel: 'चैत्र शुक्ल नवमी',
    countdownDays: 85,
    badge: '🏹 जय श्री राम',
    heroImage: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-orange-950 via-amber-900 to-stone-950',
      border: 'border-orange-500/40',
      accent: 'text-orange-300',
      glow: 'shadow-orange-500/20'
    },
    particlesType: 'flowers',
    soundType: 'shankh',
    greetingTitle: 'श्री राम नवमी की हार्दिक बधाई',
    defaultPoem: 'राम जिनका नाम है, अयोध्या जिनका धाम है, ऐसे मर्यादा पुरुषोत्तम प्रभु श्री राम को हमारा शत-शत प्रणाम है।',
    mantraOrShloka: 'श्री राम राम रमेति रमे रामे मनोरमे। सहस्रनाम तत्तुल्यं रामनाम वरानने॥',
    significance: 'चैत्र शुक्ल नवमी को भगवान श्री हरि विष्णु ने धर्म की स्थापना हेतु श्री राम के रूप में अवतार लिया था।',
    shubhMuhurat: 'राम जन्मोत्सव दोपहर 11:05 से 01:30 बजे तक।',
    seoTopWishes: ['प्रभु श्री राम आपके जीवन में धर्म, शांति और आरोग्य प्रदान करें। जय श्री राम!'],
    faqs: [{ question: 'राम जन्मोत्सव कब मनाया जाता है?', answer: 'दोपहर 12:00 बजे ठीक अभिजीत काल में।' }]
  },
  {
    id: 'janmashtami',
    slug: 'krishna-janmashtami-wishes',
    nameHi: 'श्री कृष्ण जन्माष्टमी 2026',
    nameEn: 'Krishna Janmashtami Wishes',
    taglineHi: 'नंद के आनंद भयो, जय कन्हैया लाल की • माखनचोर जन्मोत्सव',
    category: 'hindu',
    dateLabel: 'भाद्रपद कृष्ण अष्टमी',
    countdownDays: 160,
    badge: '🦚 राधे-कृष्णा',
    heroImage: 'https://images.unsplash.com/photo-1545232979-fbf526365f6f?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-indigo-950 via-purple-950 to-stone-950',
      border: 'border-indigo-500/40',
      accent: 'text-indigo-300',
      glow: 'shadow-indigo-500/20'
    },
    particlesType: 'flowers',
    soundType: 'flute',
    greetingTitle: 'श्री कृष्ण जन्माष्टमी की अशेष बधाई',
    defaultPoem: 'माखन चुराकर जिसने खाया, बंसी बजाकर जिसने नचाया। खुशी मनाओ उनके जन्मदिन की, जिसने दुनिया को प्रेम का पाठ पढ़ाया।',
    mantraOrShloka: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥',
    significance: 'भगवान श्री कृष्ण का अवतार कारागार में अधर्म और कंस के अत्याचारों के अंत हेतु हुआ था।',
    shubhMuhurat: 'मध्यरात्रि 12:02 से 12:48 तक कृष्ण पूजन।',
    seoTopWishes: ['नटखट कान्हा आपके जीवन से सारे कष्ट हर लें। हैप्पी जन्माष्टमी!'],
    faqs: [{ question: 'विशेष भोग क्या है?', answer: 'माखन-मिश्री, धनिया की पंजीरी और पंचामृत।' }]
  },
  {
    id: 'ganesh_chaturthi',
    slug: 'ganesh-chaturthi-wishes',
    nameHi: 'गणेश चतुर्थी 2026',
    nameEn: 'Ganesh Chaturthi Wishes',
    taglineHi: 'विघ्नहर्ता श्री गणेश का आगमन • बाप्पा मोरया',
    category: 'hindu',
    dateLabel: 'भाद्रपद शुक्ल चतुर्थी',
    countdownDays: 175,
    badge: '🐘 गणपति बाप्पा मोरया',
    heroImage: 'https://images.unsplash.com/photo-1567591414240-e9a1170e4548?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-red-950 via-yellow-950 to-stone-950',
      border: 'border-yellow-500/40',
      accent: 'text-amber-300',
      glow: 'shadow-amber-500/20'
    },
    particlesType: 'flowers',
    soundType: 'shankh',
    greetingTitle: 'गणेश चतुर्थी की मंगलमय बधाई',
    defaultPoem: 'वक्रतुंड महाकाय, सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव, सर्वकार्येषु सर्वदा॥ बाप्पा आपके जीवन में सुख, समृद्धि और बुद्धि का वरदान दें।',
    mantraOrShloka: 'ॐ गं गणपतये नमः ॥',
    significance: 'भगवान श्री गणेश प्रथम पूज्य हैं और समस्त विघ्नों को हरने वाले हैं।',
    shubhMuhurat: 'गणपति स्थापना मध्याह्न: प्रातः 11:05 से दोपहर 01:30 बजे तक।',
    seoTopWishes: ['विघ्नहर्ता बाप्पा आपके घर के सभी संकट हर लें। गणेश चतुर्थी की बधाई!'],
    faqs: [{ question: 'बाप्पा को क्या प्रिय है?', answer: 'दूर्वा, मोदक और लाल पुष्प।' }]
  },
  {
    id: 'navratri',
    slug: 'navratri-durga-puja-wishes',
    nameHi: 'शारदीय व चैत्र नवरात्रि 2026',
    nameEn: 'Navratri Durga Puja Wishes',
    taglineHi: 'माँ जगदम्बा के नौ दिव्य स्वरूपों की पावन आराधना',
    category: 'hindu',
    dateLabel: 'प्रतिपदा से नवमी',
    countdownDays: 20,
    badge: '🚩 जय माता दी',
    heroImage: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-rose-950 via-red-900 to-stone-950',
      border: 'border-red-500/40',
      accent: 'text-rose-300',
      glow: 'shadow-red-500/20'
    },
    particlesType: 'flowers',
    soundType: 'aarti',
    greetingTitle: 'नवरात्रि की असीम शुभकामनाएँ • जय माता दी',
    defaultPoem: 'सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥ माँ दुर्गा आपके घर में सुख, शांति और शक्ति का वरदान दें।',
    mantraOrShloka: 'या देवी सर्वभूतेषु शक्ति-रूपेण संस्थिता। नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः॥',
    significance: 'शक्ति स्वरूपा माँ दुर्गा द्वारा महिषासुर के मर्दन का महापर्व है।',
    shubhMuhurat: 'घटस्थापना: प्रातः 06:18 से 10:15 बजे तक।',
    seoTopWishes: ['माँ शेरावाली आपके परिवार की रक्षा करें। जय माता दी!'],
    faqs: [{ question: 'कलश स्थापना की दिशा?', answer: 'उत्तर-पूर्व (ईशान कोण)।' }]
  },
  {
    id: 'rakshabandhan',
    slug: 'raksha-bandhan-wishes',
    nameHi: 'रक्षाबंधन 2026',
    nameEn: 'Raksha Bandhan Wishes',
    taglineHi: 'भाई-बहन के पवित्र प्रेम और अटूट विश्वास का धागा',
    category: 'hindu',
    dateLabel: 'श्रावण पूर्णिमा',
    countdownDays: 140,
    badge: '🪢 भाई-बहन का प्यार',
    heroImage: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-red-950 via-amber-950 to-stone-950',
      border: 'border-red-400/40',
      accent: 'text-amber-300',
      glow: 'shadow-red-500/20'
    },
    particlesType: 'confetti',
    soundType: 'aarti',
    greetingTitle: 'रक्षाबंधन की असीम शुभकामनाएँ',
    defaultPoem: 'कच्चे धागों से बनी पक्की डोर है राखी, प्यार और मीठी शरारतों की होड़ है राखी। भाई की लम्बी उम्र की दुआ है राखी, बहन के पवित्र प्यार की पहचान है राखी।',
    mantraOrShloka: 'येन बद्धो बली राजा दानवेन्द्रो महाबलः। तेन त्वामपि बध्नामि रक्षे मा चल मा चल॥',
    significance: 'रक्षा सूत्र भाई द्वारा बहन की हर परिस्थिति में रक्षा का पावन संकल्प है।',
    shubhMuhurat: 'राखी बांधने का शुभ समय अपराह्न 01:45 से सायं 04:20 तक।',
    seoTopWishes: ['मेरी प्यारी बहना सदा मुस्कुराती रहे। हैप्पी रक्षाबंधन!'],
    faqs: [{ question: 'मंत्र क्या है?', answer: 'येन बद्धो बली राजा...' }]
  },
  {
    id: 'makar_sankranti',
    slug: 'makar-sankranti-pongal-lohri-wishes',
    nameHi: 'मकर संक्रांति • पोंगल • लोहड़ी 2026',
    nameEn: 'Makar Sankranti Pongal Lohri Wishes',
    taglineHi: 'सूर्य देव का उत्तरायण प्रवेश • तिल-गुड़ की मिठास और पतंगों का उल्लास',
    category: 'hindu',
    dateLabel: '14/15 जनवरी',
    countdownDays: 95,
    badge: '🪁 उत्तरायण महापर्व',
    heroImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-yellow-950 via-orange-950 to-stone-950',
      border: 'border-yellow-400/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'confetti',
    soundType: 'shankh',
    greetingTitle: 'मकर संक्रांति की सप्रेम शुभकामनाएँ • तिल-गुड़ खाओ, मीठा-मीठा बोलो',
    defaultPoem: 'मीठी बोली, मीठी जुबान, मकर संक्रांति का यही है पैगाम। तिल-गुड़ की मिठास और पतंगों की उड़ान, आपके जीवन में लाए खुशियाँ तमाम!',
    significance: 'सूर्य का मकर राशि में प्रवेश उत्तरायण की शुरुआत कहलाता है, जो देवताओं का दिन माना जाता है।',
    shubhMuhurat: 'पुण्य काल स्नान व दान: प्रातः 07:15 से दोपहर 12:30 बजे तक।',
    seoTopWishes: ['तिल-गुड़ जैसी मिठास आपके रिश्तों में बनी रहे। मकर संक्रांति की बधाई!'],
    faqs: [{ question: 'दान का क्या महत्व है?', answer: 'तिल, गुड़, खिचड़ी और कंबल दान करना पुण्यकारी है।' }]
  },
  {
    id: 'karwa_chauth',
    slug: 'karwa-chauth-suhag-wishes',
    nameHi: 'करवा चौथ 2026',
    nameEn: 'Happy Karwa Chauth Wishes',
    taglineHi: 'अखंड सौभाग्य, पति की दीर्घायु और पावन दांपत्य प्रेम का निर्जला व्रत',
    category: 'hindu',
    dateLabel: 'कार्तिक कृष्ण चतुर्थी',
    countdownDays: 10,
    badge: '🌙 अखंड सुहाग',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-rose-950 via-red-950 to-stone-950',
      border: 'border-rose-400/40',
      accent: 'text-rose-300',
      glow: 'shadow-rose-500/20'
    },
    particlesType: 'flowers',
    soundType: 'aarti',
    greetingTitle: 'करवा चौथ की हार्दिक शुभकामनाएँ',
    defaultPoem: 'चाँद की चमक और छलनी का दीदार, अमर रहे आपका पावन सुहाग और प्यार। करवा चौथ का यह पावन व्रत, लाए आपके जीवन में खुशियाँ अपार!',
    significance: 'सुहागिन महिलाएं पति की लंबी उम्र, स्वास्थ्य और अटूट दांपत्य प्रेम हेतु निर्जला व्रत रखती हैं।',
    shubhMuhurat: 'चंद्रोदय अर्घ्य समय: रात्रि 08:15 बजे।',
    seoTopWishes: ['अखंड सुहाग का वरदान मिले और आपका दांपत्य जीवन सदा खुशहाल रहे।'],
    faqs: [{ question: 'व्रत कैसे खोला जाता है?', answer: 'छलनी से चाँद और पति का दर्शन कर जल ग्रहण करके।' }]
  },

  // ==========================================
  // 2. मुस्लिम पर्व (MUSLIM FESTIVALS)
  // ==========================================
  {
    id: 'eid_ul_fitr',
    slug: 'eid-ul-fitr-mubarak-wishes',
    nameHi: 'ईद-उल-फितर 2026 • मीठी ईद',
    nameEn: 'Eid-ul-Fitr Mubarak Wishes',
    taglineHi: 'खुशियों, नेकियों, इबादत और मोहब्बत का पावन पर्व • ईद मुबारक',
    category: 'muslim',
    dateLabel: 'शव्वाल की पहली तारीख',
    countdownDays: 32,
    badge: '🌙 ईद मुबारक',
    heroImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-emerald-950 via-teal-950 to-stone-950',
      border: 'border-emerald-500/40',
      accent: 'text-emerald-300',
      glow: 'shadow-emerald-500/20'
    },
    particlesType: 'stars',
    soundType: 'shankh',
    greetingTitle: 'ईद-उल-फितर मुबारक • दिल से मुबारकबाद',
    defaultPoem: 'दीपक में अगर नूर न होता, तन्हा दिल यूँ मजबूर न होता। हम आपको खुद ईद मुबारक कहने आते, अगर आपका आशियाना हमसे इतना दूर न होता। ईद मुबारक!',
    significance: 'माहे रमजान के 30 दिनों के रोजों और इबादत के मुकम्मल होने पर अल्लाह की तरफ से बंदों को तोहफा है।',
    shubhMuhurat: 'ईद की नमाज: प्रातः 07:15 से 09:30 बजे तक।',
    seoTopWishes: ['अल्लाह आपको और आपके अहले-खाना को सेहत और बेइंतहा खुशियाँ अता फरमाए।'],
    faqs: [{ question: 'फितरा क्या है?', answer: 'गरीबों को ईद से पहले दिया जाने वाला अनिवार्य दान।' }]
  },
  {
    id: 'eid_ul_adha',
    slug: 'eid-ul-adha-bakrid-wishes',
    nameHi: 'ईद-उल-अजहा 2026 • बकरीद',
    nameEn: 'Eid-ul-Adha Bakrid Wishes',
    taglineHi: 'त्याग, निष्ठा, समर्पण और ईसार का मुकद्दस पैगाम',
    category: 'muslim',
    dateLabel: '10 जिलहिज्जा',
    countdownDays: 100,
    badge: '🕌 बकरीद मुबारक',
    heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-teal-950 via-emerald-900 to-stone-950',
      border: 'border-teal-500/40',
      accent: 'text-teal-300',
      glow: 'shadow-teal-500/20'
    },
    particlesType: 'stars',
    soundType: 'shankh',
    greetingTitle: 'ईद-उल-अजहा (बकरीद) मुबारक',
    defaultPoem: 'अल्लाह की राह में कुर्बानी का जज़्बा सलामत रहे, हर दिल में मोहब्बत और अमन की इनायत रहे। मुबारक हो आपको ईद-उल-अजहा की ये पुरनूर घड़ी!',
    significance: 'हजरत इब्राहिम अलैहिस्सलाम की अल्लाह के हुक्म पर बेमिसाल कुर्बानी की याद में मनाया जाता है।',
    shubhMuhurat: 'ईद की नमाज के उपरांत कुर्बानी का समय।',
    seoTopWishes: ['आपकी हर दुआ कुबूल हो और जिंदगी में खुशहाली आए। ईद-उल-अजहा मुबारक!'],
    faqs: [{ question: 'कुर्बानी के हिस्से?', answer: 'गरीबों, रिश्तेदारों और स्वयं के लिए तीन हिस्से।' }]
  },
  {
    id: 'muharram',
    slug: 'muharram-ashura-wishes',
    nameHi: 'मुहर्रम 2026 • आशूरा',
    nameEn: 'Muharram Ashura Observance',
    taglineHi: 'हक, सच्चाई, सब्र और कर्बला के शहीदों की शहादत का पैगाम',
    category: 'muslim',
    dateLabel: '10 मुहर्रम (यौम-ए-आशूरा)',
    countdownDays: 130,
    badge: '🏴 या हुसैन',
    heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-stone-950 via-neutral-900 to-black',
      border: 'border-emerald-500/40',
      accent: 'text-emerald-300',
      glow: 'shadow-emerald-500/10'
    },
    particlesType: 'stars',
    soundType: 'shankh',
    greetingTitle: 'मुहर्रम • आशूरा का पावन संदेश',
    defaultPoem: 'इंसान को बेदार तो हो लेने दो, हर कौम पुकारेगी हमारे हैं हुसैन। हक और इंसाफ के लिए सब कुछ कुर्बान करने वाले कर्बला के शहीदों को सलाम।',
    significance: 'हजरत इमाम हुसैन रजि. और उनके साथियों द्वारा जालिम के आगे न झुकने की अमर शहादत।',
    shubhMuhurat: '9 व 10 मुहर्रम का रोजा रखना अत्यंत फजीलत का कार्य है।',
    seoTopWishes: ['सच्चाई और इंसाफ की राह पर चलने का संकल्प लें। मुहर्रम का सलाम!'],
    faqs: [{ question: 'आशूरा का रोजा?', answer: 'पिछले एक साल के गुनाहों की माफी का जरिया।' }]
  },
  {
    id: 'eid_milad',
    slug: 'eid-milad-un-nabi-wishes',
    nameHi: 'ईद-ए-मिलाद-उन-नबी 2026',
    nameEn: 'Eid Milad un Nabi Wishes',
    taglineHi: 'पैगंबर हजरत मुहम्मद मुस्तफा सल्ल. का यौम-ए-पैदाइश • जश्न-ए-विलादत',
    category: 'muslim',
    dateLabel: '12 रबी-उल-अव्वल',
    countdownDays: 190,
    badge: '🌸 सरकार की आमद मरहबा',
    heroImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-emerald-950 via-green-950 to-stone-950',
      border: 'border-green-500/40',
      accent: 'text-green-300',
      glow: 'shadow-green-500/20'
    },
    particlesType: 'flowers',
    soundType: 'shankh',
    greetingTitle: 'ईद-ए-मिलाद-उन-नबी मुबारक',
    defaultPoem: 'निसार तेरी चहल-पहल पर हजारों ईदें रबी-उल-अव्वल, सिवाए इब्लीस के जहाँ में सभी तो खुशियाँ मना रहे हैं। मिलाद मुबारक!',
    significance: 'रहमतुल लिल आलमीन हजरत मुहम्मद (सल्ल.) का इस दुनिया में आगमन का मुबारक दिन।',
    shubhMuhurat: 'दरूद-ओ-सलाम और नात की महफिलें।',
    seoTopWishes: ['हुजूर की आमद से महका दो जहाँ। मिलाद-उन-नबी मुबारक!'],
    faqs: [{ question: 'विशेष अमल?', answer: 'दरूद शरीफ और गरीबों में लंगर वितरण।' }]
  },
  {
    id: 'ramadan',
    slug: 'ramadan-mubarak-wishes',
    nameHi: 'माहे रमजानुल मुबारक 2026',
    nameEn: 'Ramadan Mubarak Wishes',
    taglineHi: 'बरकतों, रहमतों, मगफिरत और कुरान उतरने का मुकद्दस महीना',
    category: 'muslim',
    dateLabel: 'रमजानुल मुबारक (30 दिन)',
    countdownDays: 2,
    badge: '✨ रमजान मुबारक',
    heroImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-emerald-950 via-teal-900 to-stone-950',
      border: 'border-emerald-400/40',
      accent: 'text-emerald-300',
      glow: 'shadow-emerald-500/20'
    },
    particlesType: 'stars',
    soundType: 'shankh',
    greetingTitle: 'रमजान मुबारक • बरकतों का पावन महीना',
    defaultPoem: 'रहमतों की बारिश, मगफिरत का पैगाम, आ गया माहे रमजान मुकद्दस मुकाम। आपकी हर दुआ कुबूल हो, मुबारक हो आपको रमजान का पावन महीना!',
    significance: 'इस मुकद्दस महीने में पवित्र कुरान नाजिल हुआ और इसमें रोजा रखना हर बालिग पर फर्ज है।',
    shubhMuhurat: 'सहरी और इफ्तार का वक्त स्थानीय नमाज के कैलेंडर अनुसार।',
    seoTopWishes: ['अल्लाह आपकी इबादतें कुबूल फरमाए। रमजान मुबारक!'],
    faqs: [{ question: 'रोजे का उद्देश्य क्या है?', answer: 'अल्लाह का खौफ (तकवा) और सब्र सीखना।' }]
  },

  // ==========================================
  // 3. ईसाई पर्व (CHRISTIAN FESTIVALS)
  // ==========================================
  {
    id: 'christmas',
    slug: 'merry-christmas-wishes',
    nameHi: 'क्रिसमस 2026 • Merry Christmas',
    nameEn: 'Merry Christmas Wishes 2026',
    taglineHi: 'प्रभु यीशु मसीह का पावन जन्मोत्सव • प्रेम, शांति और आनंद',
    category: 'christian',
    dateLabel: '25 दिसंबर (Every Year)',
    countdownDays: 78,
    badge: '🎄 Merry Christmas',
    heroImage: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-red-950 via-emerald-950 to-stone-950',
      border: 'border-red-500/40',
      accent: 'text-red-400',
      glow: 'shadow-red-500/20'
    },
    particlesType: 'stars',
    soundType: 'birthday',
    greetingTitle: 'मेरी क्रिसमस की हार्दिक शुभकामनाएँ',
    defaultPoem: 'चाँद ने अपनी चाँदनी बिखेरी है, तारों ने आसमान को सजाया है। शांति और प्रेम का संदेश लेकर, प्रभु ईसा मसीह का पर्व आया है। Merry Christmas!',
    significance: 'प्रभु यीशु मसीह के जन्म का महापर्व, जिन्होंने दुनिया को क्षमा और प्रेम सिखाया।',
    shubhMuhurat: '24 दिसंबर मिडनाइट मास और 25 दिसंबर सुबह क्रिसमस प्रार्थना।',
    seoTopWishes: ['प्रभु यीशु का असीम प्रेम और आशीर्वाद आपके परिवार पर सदा रहे। Merry Christmas!'],
    faqs: [{ question: 'क्रिसमस ट्री का प्रतीक?', answer: 'शाश्वत जीवन और आशा।' }]
  },
  {
    id: 'easter',
    slug: 'happy-easter-sunday-wishes',
    nameHi: 'ईस्टर संडे 2026 • Happy Easter',
    nameEn: 'Happy Easter Sunday Wishes',
    taglineHi: 'प्रभु यीशु के पुनरुत्थान का पावन विजय दिवस • नई आशा और जीवन',
    category: 'christian',
    dateLabel: 'पहला रविवार (वसंत ऋतु)',
    countdownDays: 70,
    badge: '🕊️ प्रभु का पुनरुत्थान',
    heroImage: 'https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-purple-950 via-pink-950 to-stone-950',
      border: 'border-purple-400/40',
      accent: 'text-purple-300',
      glow: 'shadow-purple-500/20'
    },
    particlesType: 'flowers',
    soundType: 'shankh',
    greetingTitle: 'हैप्पी ईस्टर संडे • प्रभु का पुनरुत्थान',
    defaultPoem: 'मृत्यु पर जीवन की विजय हुई, अंधकार पर सत्य की जय हुई। ईस्टर का यह पावन सवेरा, आपके जीवन में नई रोशनी भर दे। Happy Easter!',
    significance: 'प्रभु यीशु मसीह के मृतकों में से जी उठने की विजय का महापर्व।',
    shubhMuhurat: 'सनराइज सर्विस और ईस्टर प्रार्थना।',
    seoTopWishes: ['प्रभु यीशु का पुनरुत्थान आपके जीवन में आनंद और आशा लाए।'],
    faqs: [{ question: 'ईस्टर एग का अर्थ?', answer: 'खाली कब्र और नए जीवन का प्रतीक।' }]
  },
  {
    id: 'good_friday',
    slug: 'good-friday-message',
    nameHi: 'गुड फ्राइडे 2026 • Good Friday',
    nameEn: 'Good Friday Observance',
    taglineHi: 'मानवता के उद्धार हेतु प्रभु यीशु का महान बलिदान और क्षमा',
    category: 'christian',
    dateLabel: 'ईस्टर से पूर्व का शुक्रवार',
    countdownDays: 68,
    badge: '✝️ सर्वोच्च बलिदान',
    heroImage: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-stone-950 via-zinc-900 to-black',
      border: 'border-stone-500/40',
      accent: 'text-stone-300',
      glow: 'shadow-stone-500/10'
    },
    particlesType: 'stars',
    soundType: 'shankh',
    greetingTitle: 'गुड फ्राइडे • प्रभु का पवित्र बलिदान',
    defaultPoem: '"हे पिता, इन्हें क्षमा कर, क्योंकि ये नहीं जानते कि ये क्या कर रहे हैं।" प्रभु यीशु का यह क्षमा भाव हमारे हृदय में सदा जीवित रहे।',
    significance: 'मानव जाति के पापों के निवारण हेतु प्रभु यीशु का क्रूस पर बलिदान।',
    shubhMuhurat: 'दोपहर 12:00 से 03:00 बजे तक मौन प्रार्थना।',
    seoTopWishes: ['प्रभु यीशु की दया और क्षमा आपके जीवन का मार्ग प्रशस्त करे।'],
    faqs: [{ question: '"गुड" फ्राइडे क्यों?', answer: 'क्योंकि इससे मानव मुक्ति का मार्ग प्रशस्त हुआ।' }]
  },
  {
    id: 'newyear',
    slug: 'happy-new-year-2026-wishes',
    nameHi: 'नव वर्ष 2026 • Happy New Year',
    nameEn: 'Happy New Year 2026',
    taglineHi: 'नई उमंग, नए संकल्प और 365 दिन नई सफलताओं का स्वर्णिम वर्ष',
    category: 'christian',
    dateLabel: '1 जनवरी 2026',
    countdownDays: 85,
    badge: '✨ नव वर्ष 2026',
    heroImage: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-amber-950 via-purple-950 to-stone-950',
      border: 'border-amber-400/40',
      accent: 'text-amber-300',
      glow: 'shadow-amber-500/20'
    },
    particlesType: 'fireworks',
    soundType: 'fireworks',
    greetingTitle: 'नव वर्ष 2026 की हार्दिक शुभकामनाएँ',
    defaultPoem: 'सदा दूर रहो तुम ग़म की परछाइयों से, सामना न हो कभी तन्हाइयों से। हर अरमान हर ख्वाब पूरा हो तुम्हारा, यही दुआ है दिल की गहराइयों से। नया साल मुबारक!',
    significance: 'नूतन वर्ष के आगमन पर नई आशाओं, सौहार्द और सफलता का संकल्प।',
    shubhMuhurat: '1 जनवरी का पूरा दिन शुभकामनाओं का पर्व है।',
    seoTopWishes: ['नया साल आपके जीवन में सफलता और खुशहाली लाए। हैप्पी न्यू ईयर 2026!'],
    faqs: [{ question: 'विशिंग कार्ड कैसे बनाएं?', answer: 'अपना नाम लिखें और 1-क्लिक में WhatsApp पर भेजें।' }]
  },

  // ==========================================
  // 4. सिख व जैन पर्व (SIKH & JAIN FESTIVALS)
  // ==========================================
  {
    id: 'guru_nanak_jayanti',
    slug: 'guru-nanak-jayanti-gurpurab',
    nameHi: 'श्री गुरु नानक देव जी प्रकाश पर्व • गुरुपर्व',
    nameEn: 'Guru Nanak Jayanti Gurpurab Wishes',
    taglineHi: 'इक ओंकार सतिनाम • नाम जपो, कीरत करो, वंड छको',
    category: 'sikh_jain',
    dateLabel: 'कार्तिक पूर्णिमा',
    countdownDays: 28,
    badge: '☬ वाहेगुरु जी का खालसा',
    heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-amber-950 via-yellow-900 to-stone-950',
      border: 'border-yellow-400/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'diyas',
    soundType: 'shankh',
    greetingTitle: 'गुरु नानक देव जी के प्रकाश पर्व की लख-लख वधाइयाँ',
    defaultPoem: 'नानक नाम चढ़दी कला, तेरे भाणे सरबत दा भला। वाहेगुरु जी का खालसा, वाहेगुरु जी की फतेह! गुरुपर्व की लख-लख वधाइयाँ!',
    mantraOrShloka: 'इक ओंकार सतिनाम करता पुरखु निरभउ निरवैरु अकाल मूरति अजूनी सैभं गुर प्रसादि ॥',
    significance: 'सिख धर्म के प्रथम गुरु, श्री गुरु नानक देव जी का प्रकाश पर्व, जिन्होंने समूची मानवता को प्रेम, समानता और सेवा का अमर उपदेश दिया।',
    shubhMuhurat: 'अमृत वेला में प्रभात फेरी, अखंड पाठ और गुरु का अटूट लंगर।',
    seoTopWishes: ['वाहेगुरु जी आप पर और आपके परिवार पर सदा मेहर रखें। गुरुपर्व की बधाई!'],
    faqs: [{ question: 'गुरु नानक देव जी की तीन मुख्य सीखें?', answer: 'नाम जपो (प्रभु स्मरण), कीरत करो (ईमानदारी से काम), वंड छको (बाँटकर खाओ)।' }]
  },
  {
    id: 'baisakhi',
    slug: 'happy-baisakhi-wishes',
    nameHi: 'बैसाखी 2026 • खालसा साजना दिवस',
    nameEn: 'Happy Baisakhi Wishes',
    taglineHi: 'फसलों की कटाई का पावन पर्व और खालसा पंथ की स्थापना का गौरव दिवस',
    category: 'sikh_jain',
    dateLabel: '13/14 अप्रैल',
    countdownDays: 194,
    badge: '🌾 हैप्पी बैसाखी',
    heroImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-yellow-950 via-amber-900 to-stone-950',
      border: 'border-yellow-400/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'confetti',
    soundType: 'shankh',
    greetingTitle: 'बैसाखी की लख-लख वधाइयाँ • Happy Baisakhi',
    defaultPoem: 'नाचो गाओ, खुशी मनाओ, आई है बैसाखी! फसलों की खुशहाली और खालसा साजना दिवस की आप सभी को ढ़ेरों शुभकामनाएँ!',
    significance: '1699 में आनंदपुर साहिब में श्री गुरु गोबिंद सिंह जी द्वारा खालसा पंथ की स्थापना और पंजाब में नई फसल का स्वागत।',
    shubhMuhurat: 'गुरुद्वारों में कीर्तन, नगर कीर्तन और भांगड़ा-गिद्दा का उल्लास।',
    seoTopWishes: ['बैसाखी का यह दिन आपके घर में सुख, शांति और समृद्धि लाए!'],
    faqs: [{ question: 'बैसाखी का ऐतिहासिक महत्व?', answer: 'खालसा पंथ की स्थापना दिवस।' }]
  },
  {
    id: 'mahavir_jayanti',
    slug: 'mahavir-jayanti-jain-wishes',
    nameHi: 'भगवान महावीर जयंती 2026',
    nameEn: 'Bhagwan Mahavir Jayanti Wishes',
    taglineHi: 'अहिंसा परमो धर्मः • जियो और जीने दो का अमर संदेश',
    category: 'sikh_jain',
    dateLabel: 'चैत्र शुक्ल त्रयोदशी',
    countdownDays: 89,
    badge: '🕊️ जियो और जीने दो',
    heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-amber-950 via-yellow-900 to-stone-950',
      border: 'border-yellow-500/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'flowers',
    soundType: 'shankh',
    greetingTitle: 'भगवान महावीर जयंती की पावन मंगलकामनाएँ',
    defaultPoem: 'सत्य, अहिंसा, अस्तेय, ब्रह्मचर्य और अपरिग्रह का दिया जिन्होंने ज्ञान, ऐसे 24वें तीर्थंकर भगवान महावीर स्वामी को शत-शत प्रणाम। जियो और जीने दो!',
    mantraOrShloka: 'णमो अरिहंताणं, णमो सिद्धाणं, णमो आयरियाणं, णमो उवज्झायाणं, णमो लोए सव्वसाहूणं ॥',
    significance: 'जैन धर्म के 24वें तीर्थंकर भगवान महावीर का जन्मोत्सव, जिन्होंने संसार को त्याग, दया और अहिंसा का मार्ग दिखाया।',
    shubhMuhurat: 'प्रातः काल रथयात्रा और महामस्तकाभिषेक।',
    seoTopWishes: ['भगवान महावीर का अहिंसा का संदेश आपके जीवन में शांति लाए। महावीर जयंती की बधाई!'],
    faqs: [{ question: 'महावीर स्वामी का मूल सिद्धांत?', answer: '"जियो और जीने दो" (अहिंसा)।' }]
  },

  // ==========================================
  // 5. सामाजिक, बहुजन, SC समाज व राष्ट्रीय पर्व (SOCIAL & NATIONAL)
  // ==========================================
  {
    id: 'ambedkar_jayanti',
    slug: 'ambedkar-jayanti-jai-bhim-wishes',
    nameHi: 'डॉ. बी. आर. आंबेडकर जयंती • 14 अप्रैल',
    nameEn: 'Dr. B.R. Ambedkar Jayanti (Jai Bhim)',
    taglineHi: 'भारतीय संविधान निर्माता, बोधिसत्व, भारत रत्न बाबासाहेब की पावन जयंती',
    category: 'social_national',
    dateLabel: '14 अप्रैल (Every Year)',
    countdownDays: 195,
    badge: '💙 जय भीम • 14 अप्रैल',
    heroImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-blue-950 via-indigo-950 to-stone-950',
      border: 'border-blue-500/40',
      accent: 'text-blue-300',
      glow: 'shadow-blue-500/20'
    },
    particlesType: 'flowers',
    soundType: 'shankh',
    greetingTitle: 'डॉ. आंबेडकर जयंती की कोटि-कोटि बधाई • जय भीम',
    defaultPoem: 'शिक्षित बनो, संगठित रहो, संघर्ष करो! जिसने हमें सिर उठाकर जीने का अधिकार दिया, ऐसे महामानव, संविधान निर्माता बोधिसत्व डॉ. बाबासाहेब आंबेडकर को कोटि-कोटि नमन। जय भीम!',
    mantraOrShloka: 'बुद्धं शरणं गच्छामि। धम्मं शरणं गच्छामि। संघं शरणं गच्छामि॥',
    significance: 'संविधान निर्माता डॉ. आंबेडकर ने समता, स्वतंत्रता और बंधुत्व की नींव रखकर करोड़ों शोषितों और महिलाओं को अधिकार दिलाए।',
    shubhMuhurat: '14 अप्रैल को पूरे देश में समता रैलियाँ और दीपोत्सव का आयोजन होता है।',
    seoTopWishes: ['बाबासाहेब की जयंती पर सभी देशवासियों को जय भीम और हार्दिक मंगलकामनाएँ!'],
    faqs: [{ question: 'बाबासाहेब का मूल मंत्र?', answer: '"शिक्षित बनो, संगठित रहो, संघर्ष करो"।' }]
  },
  {
    id: 'samvidhan_diwas',
    slug: 'constitution-day-samvidhan-diwas',
    nameHi: 'भारतीय संविधान दिवस • 26 नवंबर',
    nameEn: 'Indian Constitution Day (Samvidhan Diwas)',
    taglineHi: 'लोकतंत्र की आत्मा, हमारा गौरव, हमारा संविधान • हम भारत के लोग',
    category: 'social_national',
    dateLabel: '26 नवंबर (National Day)',
    countdownDays: 55,
    badge: '📜 संविधान दिवस',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-amber-950 via-stone-900 to-blue-950',
      border: 'border-amber-400/40',
      accent: 'text-amber-300',
      glow: 'shadow-amber-500/20'
    },
    particlesType: 'confetti',
    soundType: 'shankh',
    greetingTitle: 'भारतीय संविधान दिवस की हार्दिक बधाई',
    defaultPoem: 'हम भारत के लोग, भारत को एक संपूर्ण प्रभुत्व-संपन्न गणराज्य बनाने के लिए... भारतीय संविधान के गौरवशाली मूल्यों को शत-शत नमन!',
    significance: '26 नवंबर 1949 को भारतीय संविधान को संविधान सभा द्वारा अंगीकृत किया गया था।',
    shubhMuhurat: 'संविधान की प्रस्तावना (Preamble) का सामूहिक पठन।',
    seoTopWishes: ['संविधान दिवस पर अपने मौलिक अधिकारों और कर्तव्यों के प्रति निष्ठा का संकल्प लें।'],
    faqs: [{ question: 'संविधान दिवस कब शुरू हुआ?', answer: 'वर्ष 2015 में 26 नवंबर को संविधान दिवस घोषित किया गया था।' }]
  },
  {
    id: 'dhammachakra_pravartan',
    slug: 'dhammachakra-pravartan-din-deekshabhoomi',
    nameHi: 'धम्मचक्र प्रवर्तन दिवस • दीक्षाभूमि नागपुर',
    nameEn: 'Dhammachakra Pravartan Din Wishes',
    taglineHi: '14 अक्टूबर 1956 • बोधिसत्व डॉ. आंबेडकर द्वारा ऐतिहासिक बौद्ध धम्म दीक्षा',
    category: 'social_national',
    dateLabel: 'अशोक विजयादशमी / 14 अक्टूबर',
    countdownDays: 14,
    badge: '☸️ सद्धम्म विजय',
    heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-blue-950 via-yellow-950 to-stone-950',
      border: 'border-blue-400/40',
      accent: 'text-blue-300',
      glow: 'shadow-blue-500/20'
    },
    particlesType: 'diyas',
    soundType: 'shankh',
    greetingTitle: 'धम्मचक्र प्रवर्तन दिवस की मंगलकामनाएँ • नमो बुद्धाय जय भीम',
    defaultPoem: 'नागपुर की पावन दीक्षाभूमि से गूंजा था जो सद्धम्म का नाद, बाबासाहेब ने दिया हमें आत्मसम्मान और ज्ञान का वरदान। धम्मचक्र प्रवर्तन दिवस की हार्दिक बधाई!',
    significance: '14 अक्टूबर 1956 को बाबासाहेब आंबेडकर ने लाखों अनुयायियों के साथ बौद्ध धम्म की दीक्षा ली थी।',
    shubhMuhurat: 'दीक्षाभूमि नागपुर में लाखों अनुयायियों का महासंगम।',
    seoTopWishes: ['धम्मचक्र प्रवर्तन दिवस पर सभी को हार्दिक बधाई। जय भीम, नमो बुद्धाय!'],
    faqs: [{ question: 'दीक्षा कहाँ हुई थी?', answer: 'नागपुर की पावन दीक्षाभूमि पर।' }]
  },
  {
    id: 'buddha_purnima',
    slug: 'buddha-purnima-wishes',
    nameHi: 'बुद्ध पूर्णिमा 2026 • बुद्ध जयंती',
    nameEn: 'Buddha Purnima (Vesak Day)',
    taglineHi: 'तथागत गौतम बुद्ध का पावन जन्मोत्सव, संबोधि व महापरिनिर्वाण दिवस',
    category: 'social_national',
    dateLabel: 'वैशाख पूर्णिमा',
    countdownDays: 110,
    badge: '☸️ नमो बुद्धाय',
    heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-amber-950 via-yellow-950 to-stone-950',
      border: 'border-yellow-500/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'diyas',
    soundType: 'shankh',
    greetingTitle: 'बुद्ध पूर्णिमा की मंगलमय शुभकामनाएँ • नमो बुद्धाय',
    defaultPoem: 'सत्य, अहिंसा, करुणा और शांति का दिया जिन्होंने ज्ञान, ऐसे तथागत गौतम बुद्ध को शत-शत प्रणाम। बुद्ध पूर्णिमा की पावन मंगलकामनाएँ!',
    mantraOrShloka: 'अत्त दीपो भव (अपना दीपक स्वयं बनो) • बुद्धं शरणं गच्छामि ॥',
    significance: 'वैशाख पूर्णिमा को भगवान बुद्ध का जन्म, संबोधि और महापरिनिर्वाण हुआ था।',
    shubhMuhurat: 'पूर्णिमा के दिन पंचशील का आचरण और विपश्यना ध्यान।',
    seoTopWishes: ['तथागत बुद्ध की करुणा आपके जीवन को आलोकित करे। नमो बुद्धाय!'],
    faqs: [{ question: 'बुद्ध का संदेश?', answer: '"अत्त दीपो भव" - अपना दीपक स्वयं बनो।' }]
  },
  {
    id: 'ravidas_jayanti',
    slug: 'guru-ravidas-jayanti-wishes',
    nameHi: 'संत रविदास जयंती 2026',
    nameEn: 'Sant Shiromani Ravidas Jayanti',
    taglineHi: 'मन चंगा तो कठौती में गंगा • समता और सौहार्द के मसीहा',
    category: 'social_national',
    dateLabel: 'माघ पूर्णिमा',
    countdownDays: 35,
    badge: '✨ मन चंगा तो कठौती में गंगा',
    heroImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-yellow-950 via-amber-900 to-stone-950',
      border: 'border-yellow-400/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'flowers',
    soundType: 'shankh',
    greetingTitle: 'संत शिरोमणि रविदास जयंती की मंगलकामनाएँ',
    defaultPoem: 'जाति-पांति के फेर में उरझि रहई सब लोग। मानुषता को खात है रैदास जात कर रोग॥ मन चंगा तो कठौती में गंगा!',
    significance: 'संत रविदास जी ने समाज से भेदभाव मिटाकर समता, श्रम की गरिमा और प्रेम का अमर संदेश दिया।',
    shubhMuhurat: 'माघ पूर्णिमा पर अमृतवाणी का पाठ।',
    seoTopWishes: ['संत रविदास जयंती पर सभी को बधाई। मन चंगा तो कठौती में गंगा!'],
    faqs: [{ question: 'बेगमपुरा क्या है?', answer: 'एक ऐसा आदर्श समाज जहाँ कोई दुःख या असमानता न हो।' }]
  },
  {
    id: 'independence_day',
    slug: 'independence-day-15-august-wishes',
    nameHi: 'स्वतंत्रता दिवस • 15 अगस्त',
    nameEn: 'Indian Independence Day (15 August)',
    taglineHi: 'तिरंगा हमारी शान, भारत हमारा अभिमान • वन्दे मातरम्',
    category: 'social_national',
    dateLabel: '15 अगस्त (National Event)',
    countdownDays: 145,
    badge: '🇮🇳 स्वतंत्रता दिवस',
    heroImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-orange-950 via-stone-900 to-emerald-950',
      border: 'border-amber-400/40',
      accent: 'text-amber-300',
      glow: 'shadow-amber-500/20'
    },
    particlesType: 'confetti',
    soundType: 'shankh',
    greetingTitle: 'स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ • जय हिंद',
    defaultPoem: 'विजई विश्व तिरंगा प्यारा, झंडा ऊँचा रहे हमारा! शहीदों के बलिदान से मिली यह आज़ादी हमें जान से भी प्यारी है। भारत माता की जय!',
    significance: '15 अगस्त 1947 को भारत ब्रिटिश हुकूमत से स्वतंत्र हुआ था।',
    shubhMuhurat: 'प्रातः काल ध्वजारोहण और राष्ट्रगान।',
    seoTopWishes: ['सभी देशवासियों को स्वतंत्रता दिवस की बधाई! जय हिंद!'],
    faqs: [{ question: 'तिरंगे का संदेश?', answer: 'शौर्य, शांति और समृद्धि।' }]
  },
  {
    id: 'republic_day',
    slug: 'republic-day-26-january-wishes',
    nameHi: 'गणतंत्र दिवस • 26 जनवरी',
    nameEn: 'Indian Republic Day (26 January)',
    taglineHi: 'लोकतंत्र का महापर्व • भारतीय संविधान लागू होने का गौरवशाली दिवस',
    category: 'social_national',
    dateLabel: '26 जनवरी (National Day)',
    countdownDays: 110,
    badge: '🇮🇳 गणतंत्र दिवस',
    heroImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-orange-950 via-stone-900 to-blue-950',
      border: 'border-blue-400/40',
      accent: 'text-amber-300',
      glow: 'shadow-blue-500/20'
    },
    particlesType: 'confetti',
    soundType: 'shankh',
    greetingTitle: 'गणतंत्र दिवस की हार्दिक शुभकामनाएँ • जय हिंद',
    defaultPoem: 'ना पूछो ज़माने से क्या हमारी कहानी है, हमारी पहचान तो सिर्फ ये है कि हम सब हिंदुस्तानी हैं। गणतंत्र दिवस की ढ़ेरों शुभकामनाएँ!',
    significance: '26 जनवरी 1950 को स्वतंत्र भारत का संविधान पूरे देश में विधिवत लागू हुआ था।',
    shubhMuhurat: 'कर्तव्य पथ पर भव्य परेड और तिरंगा फहराना।',
    seoTopWishes: ['हमारा संविधान हमारी आन, बान और शान है। हैप्पी रिपब्लिक डे!'],
    faqs: [{ question: '26 जनवरी क्यों चुनी गई थी?', answer: '1930 में इसी दिन पूर्ण स्वराज की घोषणा की गई थी।' }]
  },

  // ==========================================
  // 6. बधाई, उत्सव व दैनिक विचार (PERSONAL CELEBRATIONS)
  // ==========================================
  {
    id: 'birthday',
    slug: 'happy-birthday-name-wishes',
    nameHi: 'जन्मदिन की हार्दिक बधाई • Happy Birthday',
    nameEn: 'Happy Birthday Personalized Wishes',
    taglineHi: 'आपका हर दिन उत्सव बने, उम्र का हर साल खुशियों से महके',
    category: 'personal',
    dateLabel: 'सदाबहार 365 दिन',
    countdownDays: 0,
    badge: '🎂 हैप्पी बर्थडे',
    heroImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-purple-950 via-pink-900 to-stone-950',
      border: 'border-pink-400/40',
      accent: 'text-pink-300',
      glow: 'shadow-pink-500/20'
    },
    particlesType: 'confetti',
    soundType: 'birthday',
    greetingTitle: 'जन्मदिन की अनंत शुभकामनाएँ',
    defaultPoem: 'बार-बार दिन ये आए, बार-बार दिल ये गाए, तुम जियो हजारों साल, ये मेरी है आरज़ू। हैप्पी बर्थडे टू यू!',
    mantraOrShloka: 'जीवेम शरदः शतम्। पश्येम शरदः शतम्। शृणुयाम शरदः शतम्॥',
    significance: 'जन्मदिन ईश्वर का धन्यवाद करने और सपनों को नई ऊर्जा देने का दिन है।',
    shubhMuhurat: 'बड़ों का चरण स्पर्श और दीपक जलाकर मंगलकामना।',
    seoTopWishes: ['ईश्वर आपको उत्तम स्वास्थ्य, दीर्घायु और अपार खुशियाँ प्रदान करें। हैप्पी बर्थडे!'],
    faqs: [{ question: 'फोटो कैसे लगाएं?', answer: '"अपनी फोटो लगाएं" बटन दबाकर गैलरी से चुनें।' }]
  },
  {
    id: 'anniversary',
    slug: 'marriage-anniversary-wishes',
    nameHi: 'शादी की सालगिरह • Marriage Anniversary',
    nameEn: 'Happy Marriage Anniversary Wishes',
    taglineHi: 'दो दिलों का पावन बंधन, जन्म-जन्मांतर का अटूट साथ',
    category: 'personal',
    dateLabel: 'सदाबहार 365 दिन',
    countdownDays: 0,
    badge: '💍 सालगिरह मुबारक',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-rose-950 via-pink-950 to-stone-950',
      border: 'border-rose-400/40',
      accent: 'text-rose-300',
      glow: 'shadow-rose-500/20'
    },
    particlesType: 'flowers',
    soundType: 'flute',
    greetingTitle: 'शादी की सालगिरह की लख-लख बधाई',
    defaultPoem: 'दीपक और बाती की तरह बना रहे आपका साथ, जन्म-जन्मांतर तक न छूटे कभी एक-दूजे का हाथ। सुख-दुःख में सदा महकता रहे आपका प्यार, मुबारक हो आपको सालगिरह का त्योहार!',
    significance: 'वैवाहिक वर्षगाँठ परस्पर विश्वास, समर्पण और प्रेम के सफर का उत्सव है।',
    shubhMuhurat: 'बड़ों का आशीर्वाद और दीप प्रज्वलन।',
    seoTopWishes: ['आप दोनों की जोड़ी सदा सलामत रहे। Happy Anniversary!'],
    faqs: [{ question: 'कपल फोटो कैसे लगाएं?', answer: 'युगल फोटो सेलेक्ट करके 8K कार्ड बनाएं।' }]
  },
  {
    id: 'wedding',
    slug: 'shubh-vivah-wedding-wishes',
    nameHi: 'शुभ विवाह • Wedding Wishes',
    nameEn: 'Happy Wedding Mubarak Wishes',
    taglineHi: 'सात फेरों का पवित्र बंधन • नव दंपति को मंगल आशीष',
    category: 'personal',
    dateLabel: 'विवाह लग्न मुहूर्त',
    countdownDays: 0,
    badge: '💐 शुभ विवाह',
    heroImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-amber-950 via-rose-950 to-stone-950',
      border: 'border-amber-500/40',
      accent: 'text-amber-300',
      glow: 'shadow-amber-500/20'
    },
    particlesType: 'flowers',
    soundType: 'shankh',
    greetingTitle: 'शुभ विवाह की हार्दिक शुभकामनाएँ',
    defaultPoem: 'मंगलयं तन्तुनानेन लोकधारणहेतुना। कंठे बध्नामि शुभगे त्वं जीव शरदः शतम्॥ नव दंपति को सुखी, संपन्न और प्रेमपूर्ण वैवाहिक जीवन का मंगल आशीष!',
    significance: 'विवाह दो आत्माओं का पवित्र मिलन और गृहस्थ आश्रम का पावन शुभारंभ है।',
    shubhMuhurat: 'पाणिग्रहण और सप्तपदी के वैदिक मंत्रों द्वारा।',
    seoTopWishes: ['नव दंपति को दांपत्य जीवन के इस नए सफर की हार्दिक बधाई।'],
    faqs: [{ question: 'डिजिटल कार्ड कैसे भेजें?', answer: 'दूल्हा-दुल्हन का नाम लिखकर 1-क्लिक में WhatsApp पर भेजें।' }]
  },
  {
    id: 'griha_pravesh',
    slug: 'griha-pravesh-housewarming-wishes',
    nameHi: 'शुभ गृह प्रवेश • Housewarming Wishes',
    nameEn: 'Happy Griha Pravesh Wishes',
    taglineHi: 'नए घर में सुख, शांति, समृद्धि और वास्तु देव का पावन वास',
    category: 'personal',
    dateLabel: 'गृह प्रवेश मुहूर्त',
    countdownDays: 0,
    badge: '🏡 गृह प्रवेश',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-yellow-950 via-amber-900 to-stone-950',
      border: 'border-yellow-400/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'diyas',
    soundType: 'shankh',
    greetingTitle: 'गृह प्रवेश की मंगलमय शुभकामनाएँ',
    defaultPoem: 'सदा खुशियों से महके घर का हर कोना, लक्ष्मी जी का वास हो, सुख-समृद्धि का डेरा हो। नए आशियाने में आपका हर दिन खुशहाल हो!',
    mantraOrShloka: 'ॐ वास्तुपुरुषाय नमः • ॐ कुलदेवतायै नमः ॥',
    significance: 'नए घर में प्रवेश से पूर्व वास्तु शांति और कुलदेवता का पूजन सुख-शांति लाता है।',
    shubhMuhurat: 'कलश यात्रा और मंगल प्रवेश।',
    seoTopWishes: ['नए घर में खुशियों और बरकतों की बारिश हो। शुभ गृह प्रवेश!'],
    faqs: [{ question: 'कलश स्थापना?', answer: 'दही, हल्दी और दूर्वा युक्त कलश लेकर प्रथम प्रवेश।' }]
  },
  {
    id: 'suprabhat',
    slug: 'daily-suprabhat-wishes',
    nameHi: 'दैनिक सुप्रभात व सुविचार',
    nameEn: 'Daily Good Morning Wishes',
    taglineHi: 'हर सुबह सकारात्मक विचार और प्रभु स्मरण के साथ शुरुआत',
    category: 'personal',
    dateLabel: 'प्रतिदिन प्रातः काल',
    countdownDays: 0,
    badge: '☀️ रोज़ाना 365 दिन',
    heroImage: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-amber-950 via-yellow-950 to-stone-950',
      border: 'border-yellow-500/40',
      accent: 'text-yellow-300',
      glow: 'shadow-yellow-500/20'
    },
    particlesType: 'diyas',
    soundType: 'aarti',
    greetingTitle: 'शुभ प्रभात • आज का दिन मंगलमय हो',
    defaultPoem: 'प्रातः काल का यह पावन सवेरा, आपके जीवन में नई रोशनी, नई उम्मीद और नया आनंद लेकर आए। ईश्वर की कृपा से आपके सभी कार्य निर्विघ्न संपन्न हों।',
    mantraOrShloka: 'कराग्रे वसते लक्ष्मीः करमध्ये सरस्वती। करमूले तु गोविन्दः प्रभाते करदर्शनम्॥',
    significance: 'प्रातः काल हथेलियों के दर्शन और प्रभु स्मरण से दिन भर सकारात्मकता बनी रहती है।',
    shubhMuhurat: 'ब्रह्म मुहूर्त (प्रातः 04:30 से 05:30) ध्यान के लिए सर्वोत्तम।',
    seoTopWishes: ['शुभ प्रभात! आपका आज का दिन सुखद, शांत और मंगलमय हो।'],
    faqs: [{ question: 'दैनिक स्टेटस?', answer: 'रोज सुबह अपना नाम जोड़कर WhatsApp स्टेटस लगा सकते हैं।' }]
  },
  {
    id: 'shubh_ratri',
    slug: 'shubh-ratri-good-night-wishes',
    nameHi: 'शुभ रात्रि व मधुर सपने • Good Night',
    nameEn: 'Good Night Peaceful Wishes',
    taglineHi: 'दिन भर की थकान दूर हो, शांत निद्रा और सुखद सपनों की रात आए',
    category: 'personal',
    dateLabel: 'प्रतिदिन रात्रि काल',
    countdownDays: 0,
    badge: '🌙 शुभ रात्रि',
    heroImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    themeColor: {
      gradient: 'from-indigo-950 via-slate-950 to-stone-950',
      border: 'border-indigo-400/40',
      accent: 'text-indigo-300',
      glow: 'shadow-indigo-500/20'
    },
    particlesType: 'stars',
    soundType: 'flute',
    greetingTitle: 'शुभ रात्रि • मधुर और सुखद सपने',
    defaultPoem: 'तारों की छांव में शांति की नींद आए, बीते दिन की सारी थकान मिट जाए। नई सुबह आपके लिए नई उम्मीद लेकर आए, शुभ रात्रि!',
    significance: 'शांत मन से दिन के कृत्यों के लिए ईश्वर को धन्यवाद देकर विश्राम करना।',
    shubhMuhurat: 'सोने से पूर्व प्रभु का ध्यान।',
    seoTopWishes: ['ईश्वर की छत्रछाया में आपकी रात शांत और सुखद हो। शुभ रात्रि!'],
    faqs: [{ question: 'गुड नाईट स्टेटस?', answer: '1-क्लिक में रात का शांत स्टेटस शेयर करें।' }]
  }
];
