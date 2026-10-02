import { Wallpaper, DeityInfo } from '../types';

export const DEITIES: DeityInfo[] = [
  {
    id: 'all',
    nameHi: 'समस्त देव',
    nameEn: 'All Deities',
    icon: '🕉️',
    mantra: 'ॐ नमः शिवाय',
    description: 'समस्त सनातनी देवी-देवताओं के दिव्य दर्शन',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'shiva',
    nameHi: 'महादेव शिव',
    nameEn: 'Lord Shiva',
    icon: '🔱',
    mantra: 'ॐ नमः शिवाय · हर हर महादेव',
    description: 'कैलाशपति, त्रिनेत्रधारी, देवाधिदेव महादेव',
    color: 'from-sky-700 to-indigo-900'
  },
  {
    id: 'ram',
    nameHi: 'प्रभु श्री राम',
    nameEn: 'Lord Rama',
    icon: '🏹',
    mantra: 'श्री राम जय राम जय जय राम',
    description: 'मर्यादा पुरुषोत्तम रघुकुल शिरोमणि श्री राम',
    color: 'from-amber-600 to-rose-800'
  },
  {
    id: 'krishna',
    nameHi: 'श्री कृष्ण',
    nameEn: 'Lord Krishna',
    icon: '🦚',
    mantra: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे',
    description: 'मुरलीधर, द्वारकाधीश, गीता उपदेशक कृष्ण',
    color: 'from-blue-600 to-emerald-800'
  },
  {
    id: 'hanuman',
    nameHi: 'पवनपुत्र हनुमान',
    nameEn: 'Lord Hanuman',
    icon: '🚩',
    mantra: 'ॐ हं हनुमते नमः · जय बजरंगबली',
    description: 'संकटमोचन, रामदूत, अतुलित बलधामा',
    color: 'from-orange-600 to-red-700'
  },
  {
    id: 'ganesha',
    nameHi: 'गणपति बाप्पा',
    nameEn: 'Lord Ganesha',
    icon: '🌸',
    mantra: 'ॐ गं गणपतये नमः · श्री गणेशाय नमः',
    description: 'विघ्नहर्ता, प्रथम पूज्य, रिद्धि-सिद्धि दाता',
    color: 'from-amber-500 to-red-800'
  },
  {
    id: 'durga',
    nameHi: 'माँ दुर्गा / शक्ति',
    nameEn: 'Maa Durga',
    icon: '🌺',
    mantra: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
    description: 'सिंहवाहिनी, महिषासुरमर्दिनी, जगज्जननी माँ',
    color: 'from-rose-600 to-red-900'
  },
  {
    id: 'vishnu',
    nameHi: 'श्री हरि विष्णु',
    nameEn: 'Lord Vishnu',
    icon: '🐚',
    mantra: 'ॐ नमो भगवते वासुदेवाय',
    description: 'जगत्पालक, चतुर्भुज, क्षीरसागर शयन भगवान',
    color: 'from-indigo-600 to-purple-900'
  }
];

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'shiva-kailash',
    titleHi: 'कैलाशपति महादेव समाधि',
    titleEn: 'Lord Shiva on Mount Kailash',
    deityId: 'shiva',
    imageUrl: '/src/assets/images/wallpaper_lord_shiva_1790928580459.jpg',
    aspectRatio: '9:16',
    resolution: '4K Ultra HD',
    tagsHi: ['महादेव', 'भोलेनाथ', 'कैलाश', 'त्रिशूल', 'डमरू'],
    mantraHi: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥',
    featured: true,
    downloads: 14280,
    likes: 3890
  },
  {
    id: 'ram-ayodhya',
    titleHi: 'मर्यादा पुरुषोत्तम श्री राम',
    titleEn: 'Lord Rama Kodanda Bow',
    deityId: 'ram',
    imageUrl: '/src/assets/images/wallpaper_lord_ram_1790928594861.jpg',
    aspectRatio: '9:16',
    resolution: '4K Ultra HD',
    tagsHi: ['श्रीराम', 'अयोध्या', 'रघुवर', 'धनुर्धर', 'कौशल्यानंदन'],
    mantraHi: 'मंगल भवन अमंगल हारी। द्रवहु सुदसरथ अजिर बिहारी॥',
    featured: true,
    downloads: 18450,
    likes: 5120
  },
  {
    id: 'krishna-muralidhar',
    titleHi: 'मुरलीधर श्री कृष्ण दर्शन',
    titleEn: 'Lord Krishna Playing Flute',
    deityId: 'krishna',
    imageUrl: '/src/assets/images/wallpaper_lord_krishna_1790928607274.jpg',
    aspectRatio: '9:16',
    resolution: '4K Ultra HD',
    tagsHi: ['श्रीकृष्ण', 'मुरलीधर', 'राधाकृष्ण', 'वृंदावन', 'मोरपंख'],
    mantraHi: 'वसुदेवसुतं देवं कंसचाणूरमर्दनम्। देवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम्॥',
    featured: true,
    downloads: 16720,
    likes: 4790
  },
  {
    id: 'hanuman-bhakti',
    titleHi: 'संकटमोचन महाबली हनुमान',
    titleEn: 'Lord Hanuman in Deep Devotion',
    deityId: 'hanuman',
    imageUrl: '/src/assets/images/wallpaper_lord_hanuman_1790928621298.jpg',
    aspectRatio: '9:16',
    resolution: '4K Ultra HD',
    tagsHi: ['बजरंगबली', 'हनुमान', 'संकटमोचन', 'पवनपुत्र', 'अंजनीसुत'],
    mantraHi: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्। वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥',
    featured: true,
    downloads: 21300,
    likes: 6410
  },
  {
    id: 'ganesha-vinayaka',
    titleHi: 'विघ्नहर्ता श्री गणेश कृपा',
    titleEn: 'Lord Ganesha Blessings',
    deityId: 'ganesha',
    imageUrl: '/src/assets/images/wallpaper_lord_ganesha_1790928633314.jpg',
    aspectRatio: '9:16',
    resolution: '4K Ultra HD',
    tagsHi: ['गणेश', 'गणपति', 'विनायक', 'मोदक', 'रिद्धि-सिद्धि'],
    mantraHi: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    featured: true,
    downloads: 12940,
    likes: 3450
  },
  {
    id: 'durga-singhavahini',
    titleHi: 'माँ सिंहवाहिनी जगदम्बा',
    titleEn: 'Maa Durga Riding Lion',
    deityId: 'durga',
    imageUrl: '/src/assets/images/wallpaper_maa_durga_1790928683746.jpg',
    aspectRatio: '9:16',
    resolution: '4K Ultra HD',
    tagsHi: ['माँदुर्गा', 'भवानी', 'नवरात्रि', 'सिंहवाहिनी', 'शक्ति'],
    mantraHi: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
    featured: true,
    downloads: 11800,
    likes: 3120
  },
  {
    id: 'vishnu-sheshshayi',
    titleHi: 'क्षीरसागर शयन श्री हरि विष्णु',
    titleEn: 'Lord Vishnu on Sheshnaag',
    deityId: 'vishnu',
    imageUrl: '/src/assets/images/wallpaper_lord_vishnu_1790928697209.jpg',
    aspectRatio: '9:16',
    resolution: '4K Ultra HD',
    tagsHi: ['विष्णु', 'नारायण', 'शेषनाग', 'चतुर्भुज', 'वैकुंठ'],
    mantraHi: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्। लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥',
    featured: false,
    downloads: 9400,
    likes: 2750
  },
  {
    id: 'ram-darbar-mandir',
    titleHi: 'दिव्य श्री राम दरबार',
    titleEn: 'Divine Shri Ram Darbar',
    deityId: 'ram',
    imageUrl: '/src/assets/images/wallpaper_ram_darbar_1790928710025.jpg',
    aspectRatio: '9:16',
    resolution: '4K Ultra HD',
    tagsHi: ['रामदरबार', 'सीताराम', 'अयोध्या', 'लक्ष्मण', 'हनुमान'],
    mantraHi: 'रामाय रामभद्राय रामचन्द्राय वेधसे। रघुनाथाय नाथाय सीतायाः पतये नमः॥',
    featured: false,
    downloads: 15300,
    likes: 4200
  }
];
