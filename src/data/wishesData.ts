import { FestiveSoundType } from '../utils/festiveAudio';

export interface HindiWish {
  id: string;
  hindiText: string;
  englishTranslation?: string;
  authorOrTone?: string; // e.g. "धार्मिक", "भावुक", "प्रेरणादायक", "मजेदार", "शायरी"
  tags?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface WishCategory {
  slug: string; // e.g. "birthday-wishes", "birthday-wishes-for-mother"
  nameHi: string; // e.g. "जन्मदिन की शुभकामनाएं"
  nameEn: string; // e.g. "Birthday Wishes"
  parentSlug?: string; // for hierarchical breadcrumbs, e.g. "birthday-wishes"
  seoTitle: string; // 50-60 chars title
  metaDescription: string; // 130-155 chars description
  keywords: string[];
  h1: string; // Main page heading
  intro: string; // Rich unique introductory content in Hindi
  theme: {
    primaryColor: string;
    gradient: string;
    accentEmoji: string;
  };
  heroImageUrl: string;
  soundType?: FestiveSoundType;
  customAudioUrl?: string;
  wishes: HindiWish[];
  faqs: FAQItem[];
  relatedSlugs: string[]; // Slugs for strong internal linking
  updatedAt: string;
}

export const WISH_CATEGORIES: WishCategory[] = [
  // 1. Core Pillar: Birthday Wishes (Main Hub)
  {
    slug: 'birthday-wishes',
    nameHi: 'जन्मदिन की शुभकामनाएं',
    nameEn: 'Birthday Wishes in Hindi',
    seoTitle: 'जन्मदिन की शुभकामनाएं 2026 | Happy Birthday Wishes in Hindi',
    metaDescription: 'अपनों के जन्मदिन को खास बनाएं सर्वश्रेष्ठ जन्मदिन शुभकामना संदेश, शायरी व कोट्स के साथ। अपने नाम का जादुई कार्ड बनाएं और 1-क्लिक में WhatsApp पर भेजें।',
    keywords: ['birthday wishes in hindi', 'janamdin ki shubhkamnaye', 'happy birthday shayari', 'birthday status hindi', 'जन्मदिन शायरी'],
    h1: 'जन्मदिन की हार्दिक शुभकामनाएं एवं बधाई संदेश (Birthday Wishes in Hindi)',
    intro: 'जन्मदिन हर व्यक्ति के जीवन का अत्यंत अनूठा और पावन अवसर होता है। जब हम अपने माता-पिता, भाई-बहन, जीवनसाथी या मित्रों को उनके इस विशेष दिन पर स्नेहिल शब्दों से संजोए शुभकामना संदेश भेजते हैं, तो उनके चेहरे पर अनायास ही मुस्कान तैर जाती है। यहाँ हमने आपके प्रियजनों के लिए सबसे सुंदर, भावपूर्ण और प्रेरक जन्मदिन शुभकामनाएँ व शायरी संकलित की हैं।',
    theme: {
      primaryColor: '#e11d48',
      gradient: 'from-rose-600 via-pink-600 to-amber-500',
      accentEmoji: '🎂'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'bday_1',
        hindiText: 'खुशियों की सौगात मिले आपको, खुशियों से भरी हर रात मिले आपको। गम का कभी साया भी न पड़े आप पर, ज़िंदगी में इतना प्यार और सम्मान मिले आपको। जन्मदिन की ढेरों बधाई!',
        authorOrTone: 'भावुक व स्नेहपूर्ण',
        tags: ['लोकप्रिय', 'परिवार', 'मित्र']
      },
      {
        id: 'bday_2',
        hindiText: 'सूरज अपनी रोशनी से आपका जीवन जगमगाए, हर नया दिन आपके लिए नई कामयाबी लेकर आए। ईश्वर आपको स्वास्थ्य, लंबी उम्र और खुशहाली प्रदान करें। हैप्पी बर्थडे!',
        authorOrTone: 'आशीर्वाद रूपी',
        tags: ['आशीर्वाद', 'ईश्वर कृपा']
      },
      {
        id: 'bday_3',
        hindiText: 'हजारों महफिलें हों और लाखों मेले हों, पर जहाँ आप न हों वहाँ हम बिल्कुल अकेले हों। आपके जन्मदिन पर यही दुआ है रब से, आपकी जिंदगी में सदा खुशियों के रेले हों।',
        authorOrTone: 'खूबसूरत शायरी',
        tags: ['शायरी', 'दोस्ती']
      },
      {
        id: 'bday_4',
        hindiText: 'हर राह आसान हो, हर राह पे खुशियां हों, हर दिन खूबसूरत हो, ऐसा ही पूरा जीवन हो। यही हर दिन मेरी दुआ हो, ऐसा ही आपका हर जन्मदिन हो!',
        authorOrTone: 'शुभकामना शायरी',
        tags: ['स्टेटस', 'कोट्स']
      },
      {
        id: 'bday_5',
        hindiText: 'आपकी आँखों में सजे हों जो भी सपने, और दिल में छुपी हों जो भी अभिलाषाएं, यह जन्मदिन उन्हें सच कर जाए। जन्मदिन की अनंत शुभकामनाएं!',
        authorOrTone: 'प्रेरणादायक',
        tags: ['सफलता', 'दुआ']
      }
    ],
    faqs: [
      {
        question: 'क्या मैं अपने नाम और फोटो के साथ जन्मदिन का ग्रीटिंग कार्ड बना सकता हूँ?',
        answer: 'हाँ, हमारे निःशुल्क विशिंग कार्ड जनरेटर में आप अपना नाम, संदेश और वैकल्पिक फोटो जोड़कर 9:16 मोबाइल साइज का आकर्षक एचडी कार्ड बना सकते हैं और सीधा WhatsApp पर शेयर कर सकते हैं।'
      },
      {
        question: 'सबसे अच्छा जन्मदिन संदेश कैसे चुनें?',
        answer: 'रिश्ते के आधार पर संदेश चुनें; माता-पिता के लिए आदर व कृतज्ञता भरे शब्द, दोस्तों के लिए हल्की-फुल्की शायरी, और जीवनसाथी के लिए प्रेम व समर्पण से सराबोर संदेश सबसे प्रभावशाली होते हैं।'
      }
    ],
    relatedSlugs: [
      'birthday-wishes-for-mother',
      'birthday-wishes-for-father',
      'birthday-wishes-for-brother',
      'birthday-wishes-for-sister',
      'anniversary-wishes',
      'good-morning-wishes'
    ],
    updatedAt: '2026-10-03'
  },

  // 2. Child SEO Page: Birthday Wishes for Mother
  {
    slug: 'birthday-wishes-for-mother',
    nameHi: 'माँ के लिए जन्मदिन की शुभकामनाएं',
    nameEn: 'Birthday Wishes for Mother in Hindi',
    parentSlug: 'birthday-wishes',
    seoTitle: 'माँ के जन्मदिन की शुभकामनाएं | Birthday Wishes for Mother in Hindi',
    metaDescription: 'अपनी प्यारी माँ के जन्मदिन पर भेजें दिल छू लेने वाले शुभकामना संदेश व शायरी। मातृत्व को नमन करते प्रेरक व भावुक कोट्स अपने नाम सहित WhatsApp पर शेयर करें।',
    keywords: ['birthday wishes for mother in hindi', 'maa ke janamdin par shayari', 'mom birthday status hindi', 'माँ का जन्मदिन बधाई संदेश'],
    h1: 'माँ के जन्मदिन पर दिल छू लेने वाले शुभकामना संदेश व शायरी',
    intro: 'माँ ईश्वर का साक्षात स्वरूप होती हैं, जिनका निस्वार्थ प्यार और त्याग हमारी जिंदगी की सबसे बड़ी पूंजी है। उनके जन्मदिन पर कृतज्ञता और असीम आदर प्रकट करने के लिए यहाँ हमने मातृत्व को समर्पित सर्वश्रेष्ठ हिंदी संदेश संजोए हैं।',
    theme: {
      primaryColor: '#db2777',
      gradient: 'from-pink-600 via-rose-500 to-purple-600',
      accentEmoji: '🤱'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'mom_1',
        hindiText: 'जिसके होने से मेरा हर दिन खास होता है, वो कोई और नहीं मेरी प्यारी माँ है। रब से बस यही प्रार्थना है कि आपकी झोली सदा खुशियों से भरी रहे। माँ, आपको जन्मदिन की हार्दिक शुभकामनाएं!',
        authorOrTone: 'भावुक व आदरपूर्ण',
        tags: ['माँ', 'भावुक']
      },
      {
        id: 'mom_2',
        hindiText: 'माँ, आपने खुद को भूलकर हमें संवारा है। आपकी हर दुआ ने हमें हर मुश्किल से उबारा है। आपके चरणों में सारा जहान है, ईश्वर आपको लंबी उम्र और उत्तम स्वास्थ्य प्रदान करें। हैप्पी बर्थडे माँ!',
        authorOrTone: 'कृतज्ञता पूर्ण',
        tags: ['आशीर्वाद', 'स्वास्थ्य']
      },
      {
        id: 'mom_3',
        hindiText: 'सीधा-साधा, भोला-भाला सबसे अलग है माँ का रूप। बच्चों के लिए घनी छाँव है, और ममता की मीठी धूप। मेरी सबसे प्यारी माँ को जन्मदिन की ढेर सारी बधाइयाँ!',
        authorOrTone: 'सुंदर कविता',
        tags: ['ममता', 'शायरी']
      },
      {
        id: 'mom_4',
        hindiText: 'मेरी तकदीर में एक भी गम न होता, अगर तकदीर लिखने का हक मेरी माँ को मिला होता। दुनिया की सबसे प्यारी और दयालु माँ को जन्मदिन मुबारक!',
        authorOrTone: 'दिल को छूने वाली शायरी',
        tags: ['शायरी', 'प्यार']
      }
    ],
    faqs: [
      {
        question: 'माँ के जन्मदिन पर कौन सा संदेश सबसे उपयुक्त रहेगा?',
        answer: 'माँ के त्याग, मातृत्व और आशीर्वाद को नमन करने वाले संदेश सबसे श्रेष्ठ होते हैं, जिनमें उनकी लंबी उम्र और निरोगी काया की प्रार्थना हो।'
      }
    ],
    relatedSlugs: [
      'birthday-wishes',
      'birthday-wishes-for-father',
      'birthday-wishes-for-sister',
      'good-morning-wishes'
    ],
    updatedAt: '2026-10-03'
  },

  // 3. Child SEO Page: Birthday Wishes for Father
  {
    slug: 'birthday-wishes-for-father',
    nameHi: 'पिताजी के लिए जन्मदिन की शुभकामनाएं',
    nameEn: 'Birthday Wishes for Father in Hindi',
    parentSlug: 'birthday-wishes',
    seoTitle: 'पिताजी के जन्मदिन की शुभकामनाएं | Birthday Wishes for Father in Hindi',
    metaDescription: 'पापा के जन्मदिन पर आदर और सम्मान से भरे श्रेष्ठ बधाई संदेश व शायरी। अपने आदर्श पिता के लिए सुंदर शुभकामना कोट्स अपने नाम सहित WhatsApp पर भेजें।',
    keywords: ['birthday wishes for father in hindi', 'papa ke birthday par shayari', 'pitaji ke janamdin ki shubhkamnaye', 'father birthday status'],
    h1: 'पिताजी (पापा) के जन्मदिन पर आदरपूर्ण शुभकामना संदेश व अनमोल विचार',
    intro: 'पिता एक वटवृक्ष के समान होते हैं, जो स्वयं धूप सहकर अपनी संतानों को शीतल छाया देते हैं। परिवार की नींव और मार्गदर्शक पिता के जन्मदिन पर अपने दिल की भावनाएँ व्यक्त करने के लिए यहाँ विशेष आदरयुक्त संदेश प्रस्तुत हैं।',
    theme: {
      primaryColor: '#0284c7',
      gradient: 'from-sky-600 via-blue-600 to-indigo-700',
      accentEmoji: '👨'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'dad_1',
        hindiText: 'जिसने मेरी उंगली थामकर चलना सिखाया, जिसने हर मुश्किल में मेरा हौसला बढ़ाया। ऐसे आदर्श और महान पिता को उनके जन्मदिन पर कोटि-कोटि नमन व अनंत शुभकामनाएं!',
        authorOrTone: 'आदरपूर्ण व प्रेरक',
        tags: ['पापा', 'सम्मान']
      },
      {
        id: 'dad_2',
        hindiText: 'पापा, आपकी डांट में भी प्यार छुपा था, आपकी सीख ने ही मुझे इंसान बनाया। आपके जन्मदिन पर ईश्वर से प्रार्थना है कि आप सदा मुस्कुराते रहें और स्वस्थ रहें। हैप्पी बर्थडे पापा!',
        authorOrTone: 'भावुक व कृतज्ञ',
        tags: ['आशीर्वाद', 'पिता']
      },
      {
        id: 'dad_3',
        hindiText: 'खुशियां मिले आपको इतनी कि कभी गम न आए, उम्र हो आपकी इतनी कि सावन भी कम पड़ जाए। आदरणीय पिताजी को जन्मदिन की हार्दिक बधाई!',
        authorOrTone: 'शायरी रूपी',
        tags: ['शायरी', 'दुआ']
      }
    ],
    faqs: [
      {
        question: 'पिताजी के लिए जन्मदिन संदेश में क्या लिखना चाहिए?',
        answer: 'उनके द्वारा दिए गए संस्कारों, मार्गदर्शन और परिवार के प्रति उनके त्याग के लिए कृतज्ञता व्यक्त करते हुए उत्तम स्वास्थ्य की कामना करनी चाहिए।'
      }
    ],
    relatedSlugs: [
      'birthday-wishes',
      'birthday-wishes-for-mother',
      'birthday-wishes-for-brother',
      'good-morning-wishes'
    ],
    updatedAt: '2026-10-03'
  },

  // 4. Pillar: Diwali Wishes
  {
    slug: 'diwali-wishes',
    nameHi: 'दीपावली की शुभकामनाएं',
    nameEn: 'Diwali Wishes in Hindi',
    seoTitle: 'दीपावली की हार्दिक शुभकामनाएं 2026 | Happy Diwali Wishes in Hindi',
    metaDescription: 'दीपावली (दिवाली) के पावन पर्व पर माँ लक्ष्मी और गणेश जी की कृपा हेतु श्रेष्ठ शुभकामना संदेश, मंगल श्लोक व शायरी। नाम व फोटो का दीपोत्सव कार्ड बनाएं।',
    keywords: ['diwali wishes in hindi', 'deepawali ki shubhkamnaye', 'happy diwali shayari', 'laxmi pujan status', 'दीपावली बधाई संदेश'],
    h1: 'दीपावली (दिवाली) 2026 की हार्दिक शुभकामनाएं एवं मंगलकामनाएं',
    intro: 'दीपावली अंधकार पर प्रकाश, अज्ञान पर ज्ञान और बुराई पर अच्छाई की विजय का महापर्व है। इस पावन अवसर पर दीपों की रोशनी आपके घर-आँगन में सुख, शांति, समृद्धि और माँ महालक्ष्मी का अखंड वास लेकर आए। अपने परिवार, मित्रों और व्यापारिक सहयोगियों को भेजने हेतु यहाँ सुंदर दीपोत्सव शुभकामनाएँ उपलब्ध हैं।',
    theme: {
      primaryColor: '#f59e0b',
      gradient: 'from-amber-600 via-orange-500 to-yellow-500',
      accentEmoji: '🪔'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'diwali_1',
        hindiText: 'दीयों की रोशनी से झिलमिलाता आँगन हो, पटाखों की गूँज से आसमाँ रोशन हो। ऐसी आए झूम के यह दीवाली, हर तरफ खुशियों का ही मौसम हो। शुभ दीपावली!',
        authorOrTone: 'पारंपरिक व आनंदमय',
        tags: ['दीपावली', 'दीपोत्सव']
      },
      {
        id: 'diwali_2',
        hindiText: 'माँ लक्ष्मी का हाथ हो, सरस्वती का साथ हो, गणेश जी का निवास हो, और माँ दुर्गा के आशीर्वाद से आपके जीवन में प्रकाश ही प्रकाश हो। आपको व सपरिवार दीपावली की हार्दिक शुभकामनाएं!',
        authorOrTone: 'धार्मिक व कल्याणकारी',
        tags: ['लक्ष्मी पूजन', 'गणेश कृपा']
      },
      {
        id: 'diwali_3',
        hindiText: 'कुमकुम भरे कदमों से आए लक्ष्मी जी आपके द्वार, सुख-संपत्ति मिले आपको अपार। इस पावन दीपोत्सव पर पूरी हो आपकी हर पुकार। शुभ दीपावली!',
        authorOrTone: 'समृद्धिदायक शायरी',
        tags: ['शायरी', 'समृद्धि']
      },
      {
        id: 'diwali_4',
        hindiText: 'दीप जलते जगमगाते रहें, हम आपको आप हमें याद आते रहें। जब तक जिंदगी है दुआ है हमारी, आप चाँद की तरह जगमगाते रहें। दीपावली मुबारक!',
        authorOrTone: 'स्नेहिल शायरी',
        tags: ['मित्रता', 'स्नेह']
      }
    ],
    faqs: [
      {
        question: 'दीपावली पर नाम और फोटो वाला दीप कार्ड कैसे बनाएं?',
        answer: 'हमारे 1-क्लिक विश कार्ड जनरेटर में अपना नाम लिखें, इच्छा हो तो अपनी फोटो चुनें और तुरंत सुनहरे बॉर्डर वाला 9:16 दीपोत्सव इमेज कार्ड डाउनलोड या शेयर करें।'
      },
      {
        question: 'दीपावली की शुभकामनाओं में किन बातों का ध्यान रखें?',
        answer: 'माँ लक्ष्मी, गणेश जी के आशीर्वाद और सुख-शांति व समृद्धि की मंगलकामनाओं वाले संदेश सबसे अधिक पसंद किए जाते हैं।'
      }
    ],
    relatedSlugs: [
      'holi-wishes',
      'new-year-wishes',
      'good-morning-wishes',
      'birthday-wishes'
    ],
    updatedAt: '2026-10-03'
  },

  // 5. Pillar: Holi Wishes
  {
    slug: 'holi-wishes',
    nameHi: 'होली की शुभकामनाएं',
    nameEn: 'Holi Wishes in Hindi',
    seoTitle: 'होली की हार्दिक शुभकामनाएं 2026 | Happy Holi Wishes & Shayari in Hindi',
    metaDescription: 'रंगों के पावन पर्व होली पर भेजें प्यार, उमंग और उल्लास से भरे शुभकामना संदेश व शायरी। अपनों के जीवन में खुशियों के रंग घोलें और नाम सहित WhatsApp पर शेयर करें।',
    keywords: ['holi wishes in hindi', 'holi ki shubhkamnaye', 'happy holi shayari', 'rangwali holi quotes hindi', 'होली बधाई संदेश'],
    h1: 'होली 2026 की हार्दिक शुभकामनाएं, बधाई संदेश व रंगोत्सव शायरी',
    intro: 'होली आपसी सौहार्द, प्रेम और भाईचारे का उल्लासमय उत्सव है। जब गुलाल और अबीर की खुशबू हवाओं में घुलती है, तो सारे गिले-शिकवे मिट जाते हैं। इस पावन रंगोत्सव पर अपने मित्रों, रिश्तेदारों और परिजनों के साथ साझा करने हेतु यहाँ सबसे मनभावन और रंगीन संदेश संकलित हैं।',
    theme: {
      primaryColor: '#8b5cf6',
      gradient: 'from-violet-600 via-pink-500 to-amber-400',
      accentEmoji: '🎨'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'holi_1',
        hindiText: 'राधा का रंग और कान्हा की पिचकारी, प्यार के रंग से रंग दो दुनिया सारी। ये रंग न जाने कोई जात न कोई बोली, मुबारक हो आपको रंगों भरी होली!',
        authorOrTone: 'ब्रज की पावन मिठास',
        tags: ['राधा-कृष्ण', 'गुलाल']
      },
      {
        id: 'holi_2',
        hindiText: 'गुलाल का रंग, गुझिया की मिठास, भांग की मस्ती और अपनों का अटूट विश्वास। मुबारक हो आपको यह पावन रंगोत्सव का उल्लास! होली की हार्दिक शुभकामनाएं।',
        authorOrTone: 'उत्साहवर्धक',
        tags: ['त्योहार', 'मिठास']
      },
      {
        id: 'holi_3',
        hindiText: 'प्यार के रंगों से भरो अपनी पिचकारी, स्नेह के रंग से रंग दो दुनिया सारी। न रहे कोई रंजिश, न रहे कोई दूरी, ऐसी मनाओ इस बार होली हमारी। शुभ होली!',
        authorOrTone: 'सौहार्दपूर्ण शायरी',
        tags: ['शायरी', 'भाईचारा']
      }
    ],
    faqs: [
      {
        question: 'होली की शुभकामनाओं के साथ रंगीन स्टेटस कैसे बनाएं?',
        answer: 'हमारे जनरेटर से आप अपने नाम और फोटो के साथ रंगों से सजा 9:16 स्टेटस कार्ड 1-क्लिक में डाउनलोड कर सकते हैं।'
      }
    ],
    relatedSlugs: [
      'diwali-wishes',
      'good-morning-wishes',
      'birthday-wishes',
      'congratulations-wishes'
    ],
    updatedAt: '2026-10-03'
  },

  // 6. Pillar: Good Morning Wishes
  {
    slug: 'good-morning-wishes',
    nameHi: 'सुप्रभात (गुड मॉर्निंग) संदेश',
    nameEn: 'Good Morning Wishes in Hindi',
    seoTitle: 'सुप्रभात सुविचार व शुभकामनाएं | Good Morning Wishes & Quotes in Hindi',
    metaDescription: 'हर सुबह की शुरुआत करें सकारात्मक ऊर्जा और प्रेरणा से भरे सुप्रभात संदेशों के साथ। ईश्वर वंदना, प्रेरक सुविचार और खूबसूरत गुड मॉर्निंग शायरी WhatsApp पर भेजें।',
    keywords: ['good morning wishes in hindi', 'suprabhat suvichar', 'shubh prabhat shayari', 'morning quotes hindi', 'सुप्रभात सुविचार'],
    h1: 'सुप्रभात (Good Morning) प्रेरक सुविचार, अनमोल वचन एवं भक्ति संदेश',
    intro: 'एक खूबसूरत और सकारात्मक सुबह पूरे दिन को ऊर्जावान और सफल बना देती है। जब सुबह उठकर हम अपनों को मंगलकारी और प्रेरणादायक विचार भेजते हैं, तो यह उनके दिन में नई उम्मीद और उमंग भर देता है। यहाँ दैनिक रूप से WhatsApp पर शेयर करने योग्य सर्वश्रेष्ठ सुप्रभात सुविचार उपलब्ध हैं।',
    theme: {
      primaryColor: '#059669',
      gradient: 'from-emerald-600 via-teal-500 to-amber-400',
      accentEmoji: '🌅'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'gm_1',
        hindiText: 'उठकर देखिए सुबह का नजारा, हवा भी है ठंडी और मौसम भी है प्यारा। सो गया चाँद और छिप गया हर एक सितारा, कुबूल कीजिए आप हमारा सुप्रभात का यह पैगाम प्यारा। शुभ प्रभात!',
        authorOrTone: 'प्रकृति व स्नेह',
        tags: ['सुप्रभात', 'शायरी']
      },
      {
        id: 'gm_2',
        hindiText: 'सफलता की शुरुआत हमेशा सकारात्मक सोच और ईश्वर पर भरोसे से होती है। आपका आज का दिन नई उपलब्धियों और खुशियों से परिपूर्ण हो। ॐ सूर्याय नमः! सुप्रभात।',
        authorOrTone: 'प्रेरणा व भक्ति',
        tags: ['भक्ति', 'सुविचार']
      },
      {
        id: 'gm_3',
        hindiText: 'पानी की बूंदें फूलों को भीगा रही हैं, ठंडी हवाएं एक ताज़गी जगा रही हैं। हो जाइए आप भी इस नई सुबह में शामिल, एक प्यारी सी सुबह आपको जगा रही है। गुड मॉर्निंग!',
        authorOrTone: 'मधुर शायरी',
        tags: ['सुबह', 'ताजगी']
      }
    ],
    faqs: [
      {
        question: 'दैनिक सुप्रभात संदेश शेयर करने का क्या लाभ है?',
        answer: 'यह अपनों के साथ संबंधों में मधुरता बनाए रखता है और दिन की शुरुआत सकारात्मक ऊर्जा व शुभकामनाओं से होती है।'
      }
    ],
    relatedSlugs: [
      'good-night-wishes',
      'birthday-wishes',
      'anniversary-wishes',
      'diwali-wishes'
    ],
    updatedAt: '2026-10-03'
  },

  // 7. Pillar: Good Night Wishes
  {
    slug: 'good-night-wishes',
    nameHi: 'शुभ रात्रि (गुड नाईट) संदेश',
    nameEn: 'Good Night Wishes in Hindi',
    seoTitle: 'शुभ रात्रि संदेश व शायरी | Good Night Wishes & Shayari in Hindi',
    metaDescription: 'अपनों को भेजें सुकून भरी नींद और मीठे सपनों की दुआओं से सजे शुभ रात्रि (Good Night) संदेश व शायरी। सुंदर रात्रि कोट्स अपने नाम सहित WhatsApp पर शेयर करें।',
    keywords: ['good night wishes in hindi', 'shubh ratri shayari', 'good night quotes hindi', 'raat ki shayari', 'शुभ रात्रि संदेश'],
    h1: 'शुभ रात्रि (Good Night) संदेश, मीठे सपनों की शायरी व दुआएं',
    intro: 'दिनभर की भागदौड़ और थकान के बाद रात्रि का समय मानसिक शांति और विश्राम का होता है। सोने से पहले जब अपनों का स्नेहपूर्ण "शुभ रात्रि" संदेश मिलता है, तो मन को असीम सुकून मिलता है। यहाँ आपके प्रियजनों के लिए सबसे शांत और मधुर रात्रि संदेश संकलित हैं।',
    theme: {
      primaryColor: '#312e81',
      gradient: 'from-slate-900 via-indigo-950 to-purple-900',
      accentEmoji: '🌙'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'gn_1',
        hindiText: 'चाँद ने अपनी चांदनी बिखेरी है, तारों ने भी आसमान में महफिल सजाई है। आपको मीठे सपनों की दुनिया में ले जाने, यह प्यारी सी रात आई है। शुभ रात्रि!',
        authorOrTone: 'शांति व सुकून',
        tags: ['चाँद-तारे', 'सुकून']
      },
      {
        id: 'gn_2',
        hindiText: 'बीता हुआ कल बदल नहीं सकते, लेकिन आने वाला कल आपके हाथ में है। दिनभर की चिंताओं को छोड़िए और सुकून की नींद लीजिए। शुभ रात्रि, मधुर सपने!',
        authorOrTone: 'सकारात्मक सोच',
        tags: ['प्रेरणा', 'नींद']
      },
      {
        id: 'gn_3',
        hindiText: 'रात को जब आपकी याद आती है, सितारों में आपकी तस्वीर नजर आती है। खोजती है निगाहें उस चेहरे को, जो हर पल हमें मुस्कुराना सिखाता है। गुड नाईट!',
        authorOrTone: 'स्नेहिल शायरी',
        tags: ['शायरी', 'यादें']
      }
    ],
    faqs: [
      {
        question: 'शुभ रात्रि संदेश में क्या विशेष होना चाहिए?',
        answer: 'दिनभर के तनाव को दूर करने वाले शांतिप्रिय, सुकूनदायक और मीठे सपनों की कामना वाले संदेश सबसे अच्छे होते हैं।'
      }
    ],
    relatedSlugs: [
      'good-morning-wishes',
      'birthday-wishes',
      'anniversary-wishes'
    ],
    updatedAt: '2026-10-03'
  },

  // 8. Pillar: Wedding Anniversary Wishes
  {
    slug: 'anniversary-wishes',
    nameHi: 'शादी की सालगिरह की शुभकामनाएं',
    nameEn: 'Wedding Anniversary Wishes in Hindi',
    seoTitle: 'शादी की सालगिरह की शुभकामनाएं | Marriage Anniversary Wishes in Hindi',
    metaDescription: 'विवाह की वर्षगांठ (शादी की सालगिरह) पर पति, पत्नी, माता-पिता या मित्रों को भेजें प्रेम व आशीर्वाद से सजे बधाई संदेश व शायरी। नाम सहित विशिंग कार्ड बनाएं।',
    keywords: ['anniversary wishes in hindi', 'shadi ki salgirah ki shubhkamnaye', 'marriage anniversary shayari', 'happy anniversary status', 'सालगिरह बधाई'],
    h1: 'शादी की सालगिरह (Marriage Anniversary) की हार्दिक बधाई व प्रेम संदेश',
    intro: 'विवाह दो आत्माओं, दो परिवारों और सात फेरों के पवित्र वचनों का अटूट बंधन है। सालगिरह का दिन इसी प्रेम, विश्वास और सह-अस्तित्व के उत्सव का दिन है। यहाँ हमने जीवनसाथी, माता-पिता और मित्रों की वर्षगांठ को अविस्मरणीय बनाने हेतु मधुरतम शुभकामनाएँ प्रस्तुत की हैं।',
    theme: {
      primaryColor: '#b91c1c',
      gradient: 'from-red-600 via-rose-600 to-amber-500',
      accentEmoji: '💍'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'anni_1',
        hindiText: 'दीपक और बाती सा पवित्र रहे आपका नाता, खुशियों से भर जाए आपकी जीवन गाथा। जन्म-जन्मांतर तक बना रहे यह प्रेम और विश्वास, मुबारक हो आपको शादी की वर्षगांठ का यह पावन अहसास!',
        authorOrTone: 'मंगलकारी व पावन',
        tags: ['विवाह', 'आशीर्वाद']
      },
      {
        id: 'anni_2',
        hindiText: 'आप दोनों की जोड़ी कभी न छूटे, ईश्वर करे आप कभी एक-दूसरे से न रूठें। यूं ही एक होकर आप ये जिंदगी बिताएं, खुशियों के पल कभी आपके कम न हों। शादी की सालगिरह की लख-लख बधाइयाँ!',
        authorOrTone: 'जोड़ी की सलामती',
        tags: ['जोड़ी', 'शुभकामना']
      },
      {
        id: 'anni_3',
        hindiText: 'हर मुश्किल में कदम से कदम मिलाकर चले हैं आप, प्रेम और त्याग की अनुपम मिसाल बने हैं आप। इस खूबसूरत जोड़ी को शादी की सालगिरह की अनंत शुभकामनाएं!',
        authorOrTone: 'सम्मान व प्रेम',
        tags: ['माता-पिता', 'प्रेरणा']
      }
    ],
    faqs: [
      {
        question: 'माता-पिता की सालगिरह पर कौन सा संदेश सबसे उपयुक्त है?',
        answer: 'उनके दशकों पुराने त्याग, सामंजस्य और परिवार को बांधकर रखने वाले प्रेम की प्रशंसा करते हुए ईश्वर से उनकी लंबी उम्र की प्रार्थना करने वाले संदेश सर्वोत्तम हैं।'
      }
    ],
    relatedSlugs: [
      'birthday-wishes',
      'congratulations-wishes',
      'good-morning-wishes'
    ],
    updatedAt: '2026-10-03'
  },

  // 9. Pillar: Congratulations Wishes
  {
    slug: 'congratulations-wishes',
    nameHi: 'बधाई संदेश (Congratulations)',
    nameEn: 'Congratulations Wishes in Hindi',
    seoTitle: 'सफलता व उपलब्धि पर हार्दिक बधाई संदेश | Congratulations Wishes in Hindi',
    metaDescription: 'नई नौकरी, परीक्षा में सफलता, नए घर (गृह प्रवेश) या किसी भी शुभ अवसर पर भेजें श्रेष्ठ बधाई संदेश व प्रेरक कोट्स। अपने नाम का बधाई कार्ड बनाएं।',
    keywords: ['congratulations wishes in hindi', 'safalta ki badhai sandesh', 'shubhakamnaye in hindi', 'success quotes hindi', 'बधाई संदेश'],
    h1: 'सफलता, उपलब्धि व शुभ अवसरों पर हार्दिक बधाई संदेश (Congratulations in Hindi)',
    intro: 'कड़ी मेहनत, समर्पण और निष्ठा से जब कोई नई मंजिल हासिल होती है, तो उस क्षण को बधाइयों और मंगलकामनाओं के साथ मनाना चाहिए। परीक्षा परिणाम, पदोन्नति, गृह प्रवेश या व्यापारिक सफलता पर अपनों का हौसला बढ़ाने के लिए यहाँ प्रेरक बधाई संदेश प्रस्तुत हैं।',
    theme: {
      primaryColor: '#d97706',
      gradient: 'from-amber-600 via-yellow-600 to-emerald-600',
      accentEmoji: '🎉'
    },
    heroImageUrl: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&q=80',
    wishes: [
      {
        id: 'cong_1',
        hindiText: 'आपकी कड़ी मेहनत और अटूट लगन रंग लाई है। यह शानदार सफलता तो बस शुरुआत है, आगे आपके लिए पूरा आकाश खुला है। आपकी इस ऐतिहासिक उपलब्धि पर हार्दिक बधाई व अनंत शुभकामनाएं!',
        authorOrTone: 'उत्साहवर्धक व प्रेरक',
        tags: ['सफलता', 'मेहनत']
      },
      {
        id: 'cong_2',
        hindiText: 'मंजिलें उन्हीं को मिलती हैं जिनके सपनों में जान होती है, पंखों से कुछ नहीं होता हौसलों से उड़ान होती है। आपकी इस शानदार कामयाबी पर पूरे परिवार को गर्व है। लख-लख बधाइयाँ!',
        authorOrTone: 'प्रेरक शायरी',
        tags: ['हौसला', 'शायरी']
      },
      {
        id: 'cong_3',
        hindiText: 'ईश्वर आपको जीवन के हर क्षेत्र में इसी प्रकार नित नई ऊंचाइयों पर पहुंचाए। आपकी इस नई शुरुआत और सफलता पर दिल की गहराइयों से बहुत-बहुत बधाई!',
        authorOrTone: 'कल्याणकारी दुआ',
        tags: ['आशीर्वाद', 'दुआ']
      }
    ],
    faqs: [
      {
        question: 'सफलता पर बधाई संदेश लिखते समय किन बातों का ध्यान रखें?',
        answer: 'व्यक्ति की मेहनत और संघर्ष की सराहना करें और भविष्य में और बड़ी उपलब्धियों के लिए शुभकामनाएं दें।'
      }
    ],
    relatedSlugs: [
      'birthday-wishes',
      'anniversary-wishes',
      'good-morning-wishes'
    ],
    updatedAt: '2026-10-03'
  }
];

const STORAGE_KEY_CUSTOM_WISH_CATEGORIES = 'shubhakamna_stored_wish_categories_v1';

export function getStoredWishCategories(): WishCategory[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_WISH_CATEGORIES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch {}
  return WISH_CATEGORIES;
}

export function saveStoredWishCategories(categories: WishCategory[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CUSTOM_WISH_CATEGORIES, JSON.stringify(categories));
      window.dispatchEvent(new Event('shubhakamna_wish_categories_changed'));
    }
  } catch (e) {
    console.error('Failed to save wish categories:', e);
  }
}

export function getCategoryBySlug(slug: string): WishCategory | undefined {
  if (!slug) return undefined;
  const clean = slug.replace(/^\/+|\/+$/g, '').toLowerCase();
  const all = getStoredWishCategories();
  return all.find(c => c.slug.toLowerCase() === clean);
}

export function getAllCategories(): WishCategory[] {
  return getStoredWishCategories();
}

export function getChildCategories(parentSlug: string): WishCategory[] {
  const all = getStoredWishCategories();
  return all.filter(c => c.parentSlug === parentSlug);
}

/**
 * Saves or updates a category. If oldSlug is passed and slug was modified, renames it cleanly.
 */
export function saveOrUpdateWishCategory(category: WishCategory, oldSlug?: string): boolean {
  const list = getStoredWishCategories();
  const targetSlug = (oldSlug || category.slug).toLowerCase();
  const exists = list.some(c => c.slug.toLowerCase() === targetSlug);

  let updatedList: WishCategory[];
  if (exists) {
    updatedList = list.map(c => c.slug.toLowerCase() === targetSlug ? category : c);
  } else {
    updatedList = [category, ...list];
  }

  saveStoredWishCategories(updatedList);
  return true;
}

export function deleteWishCategory(slug: string): boolean {
  const list = getStoredWishCategories();
  const updatedList = list.filter(c => c.slug.toLowerCase() !== slug.toLowerCase());
  saveStoredWishCategories(updatedList);
  return true;
}

export function resetWishCategoriesToDefault(): void {
  saveStoredWishCategories(WISH_CATEGORIES);
}

export function getBreadcrumbTrail(category: WishCategory): { name: string; url: string }[] {
  const trail = [{ name: 'होम', url: '/' }];
  if (category.parentSlug) {
    const parent = getCategoryBySlug(category.parentSlug);
    if (parent) {
      trail.push({ name: parent.nameHi, url: `/${parent.slug}/` });
    }
  }
  trail.push({ name: category.nameHi, url: `/${category.slug}/` });
  return trail;
}
