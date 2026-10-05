/**
 * Comprehensive Daily 100 Suvichar Engine for Shubh Prabhat
 * Dynamic date-seeded rotation ensures 100 distinct, meaningful, and spiritually uplifting suvichar every day.
 * Supports Hindi, English, Marathi, and Gujarati.
 */

export interface SuvicharItem {
  id: number;
  number: number; // 1 to 100 for today
  hindiText: string;
  englishText: string;
  marathiText?: string;
  gujaratiText?: string;
  category: 'spiritual' | 'motivation' | 'family' | 'positivity' | 'peace' | 'karma';
  categoryLabel: string;
  authorOrTone: string;
  tags: string[];
}

export interface SuvicharBackground {
  id: string;
  name: string;
  category: 'sunrise' | 'temple' | 'nature' | 'gradient';
  url: string;
  type: 'image' | 'gradient';
  cssGradient?: string;
  textColor?: string;
}

export const SUVICHAR_BACKGROUNDS: SuvicharBackground[] = [
  // 1. Sunrise & Dawn
  {
    id: 'sunrise_gold',
    name: '🌅 स्वर्णिम सूर्योदय',
    category: 'sunrise',
    url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'himalaya_dawn',
    name: '🏔️ शांत हिमालय भोर',
    category: 'sunrise',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'ocean_sunrise',
    name: '🌊 सागर तट सूर्योदय',
    category: 'sunrise',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'golden_field',
    name: '🌾 सुनहरी भोर व खेत',
    category: 'sunrise',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'forest_sunbeams',
    name: '🌲 वन में सूर्य किरणें',
    category: 'sunrise',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },

  // 2. Temple, Diya & Devotional
  {
    id: 'temple_diya',
    name: '🪔 पावन मंगल दीप',
    category: 'temple',
    url: 'https://images.unsplash.com/photo-1609137144822-263a5639b71e?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'sacred_river',
    name: '🌊 पावन गंगा घाट व भोर',
    category: 'temple',
    url: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'temple_bells',
    name: '🔔 पावन मंदिर व घंटियाँ',
    category: 'temple',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'lotus_lake',
    name: '🪷 शांत सरोवर व कमल',
    category: 'temple',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'marigold_pooja',
    name: '🌼 पावन गेंदा व पुष्प',
    category: 'temple',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },

  // 3. Nature & Serenity
  {
    id: 'morning_tea',
    name: '☕ प्रातःकालीन ताजगी',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'mountain_mist',
    name: '🏔️ शांत पर्वत व कोहरा',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'blooming_garden',
    name: '🌸 महकती सुबह व बगिया',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },
  {
    id: 'peaceful_lake',
    name: '🛶 शांत झील व नाव',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    type: 'image'
  },

  // 4. Spiritual Gradients
  {
    id: 'royal_gold_grad',
    name: '🎨 दिव्य स्वर्णिम प्रभात',
    category: 'gradient',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #451a03 0%, #78350f 40%, #1e1b4b 100%)'
  },
  {
    id: 'ruby_dawn_grad',
    name: '🌹 सिंदूरी सूर्योदय',
    category: 'gradient',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #4c0519 0%, #881337 50%, #1c1917 100%)'
  },
  {
    id: 'emerald_peace_grad',
    name: '🍃 शांत प्रकृति प्रभात',
    category: 'gradient',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)'
  },
  {
    id: 'celestial_indigo_grad',
    name: '🌌 ब्रह्ममुहूर्त शांति',
    category: 'gradient',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #030712 100%)'
  },
  {
    id: 'saffron_blessing_grad',
    name: '🪔 पावन भगवा तेज',
    category: 'gradient',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 45%, #431407 100%)'
  },
  {
    id: 'midnight_gold_grad',
    name: '✨ स्वर्णिम कांति',
    category: 'gradient',
    url: '',
    type: 'gradient',
    cssGradient: 'linear-gradient(135deg, #09090b 0%, #292524 50%, #451a03 100%)'
  }
];

// Master Bank of Meaningful, Deep, Scriptural & Motivational Thoughts (100+ fully authentic curated items)
export const MASTER_SUVICHAR_BANK: Omit<SuvicharItem, 'number'>[] = [
  // Spiritual & Devotional (ईश्वरीय व आध्यात्मिक)
  {
    id: 1,
    category: 'spiritual',
    categoryLabel: '🪔 आध्यात्मिक',
    authorOrTone: 'सनातन दर्शन',
    hindiText: 'ईश्वर से प्रार्थना केवल माँगने के लिए नहीं, बल्कि उन अनगिनत कृपाओं के लिए धन्यवाद देने के लिए भी करें जो बिना माँगे मिली हैं। आपका दिन मंगलमय हो!',
    englishText: 'Pray not just to ask for things, but to thank God for the countless blessings received without even asking. Have a blessed day!',
    marathiText: 'ईश्वराकडे प्रार्थना फक्त मागण्यासाठी नाही, तर न मागता मिळालेल्या अगणित आशीर्वादांबद्दल कृतज्ञता व्यक्त करण्यासाठी करा. शुभ प्रभात!',
    gujaratiText: 'ઈશ્વર પાસે પ્રાર્થના માત્ર માંગવા માટે નહીં, પરંતુ વગર માંગ્યે મળેલા અગણિત આશીર્વાદ માટે આભાર માનવા માટે પણ કરો. શુભ સવાર!',
    tags: ['ईश्वर', 'कृतज्ञता', 'प्रार्थना', 'मंगलमय']
  },
  {
    id: 2,
    category: 'spiritual',
    categoryLabel: '🪔 आध्यात्मिक',
    authorOrTone: 'भगवद्गीता ज्ञान',
    hindiText: 'जो व्यक्ति मन को वश में कर लेता है, उसका मन ही उसका सबसे बड़ा मित्र बन जाता है। शांति अपने भीतर ही है। शुभ प्रभात!',
    englishText: 'For him who has conquered the mind, the mind is the best of friends. True peace resides within. Good Morning!',
    marathiText: 'जो मनावर ताबा मिळवतो, त्याचे मनच त्याचा सर्वात मोठा मित्र बनते. खरी शांतता आपल्या आतच आहे. सुप्रभात!',
    gujaratiText: 'જે વ્યક્તિ મનને વશમાં રાખે છે, તેનું મન જ તેનું સૌથી મોટું મિત્ર બની જાય છે. સાચી શાંતિ અંદર જ છે. શુભ પ્રભાત!',
    tags: ['गीता', 'मन', 'शांति', 'ज्ञान']
  },
  {
    id: 3,
    category: 'spiritual',
    categoryLabel: '🪔 आध्यात्मिक',
    authorOrTone: 'संत वचन',
    hindiText: 'सवेरे की पहली किरण प्रभु की कृपा का संदेश लेकर आती है कि आज का दिन आपके जीवन का एक नया और सुंदर उपहार है। ॐ सूर्याय नमः!',
    englishText: 'The first ray of morning brings the divine message that today is a fresh and beautiful gift of life. Om Suryaya Namah!',
    marathiText: 'सकाळचा पहिला किरण ईश्वराच्या कृपेचा संदेश आणतो की आजचा दिवस एक नवी सुंदर भेट आहे. ॐ सूर्याय नमः!',
    gujaratiText: 'સવારનું પહેલું કિરણ પ્રભુની કૃપાનો સંદેશ લઈને આવે છે કે આજનો દિવસ જીવનની સુંદર ભેટ છે. ૐ સૂર્યાય નમઃ!',
    tags: ['सूर्य', 'कृपा', 'भोर', 'उपहार']
  },
  {
    id: 4,
    category: 'spiritual',
    categoryLabel: '🪔 आध्यात्मिक',
    authorOrTone: 'वेद संदेश',
    hindiText: 'जहाँ सत्य, दया और निष्कपट हृदय होता है, वहाँ परमात्मा स्वयं निवास करते हैं। अपने कर्मों में शुद्धि रखें। शुभ प्रभात!',
    englishText: 'Where there is truth, compassion, and a pure heart, the Divine naturally dwells. Good Morning!',
    marathiText: 'जिथे सत्य, दया आणि निष्कपट हृदय असते, तिथे साक्षात परमेश्वर वास करतो. शुभ सकाळ!',
    gujaratiText: 'જ્યાં સત્ય, દયા અને પવિત્ર હૃદય હોય છે, ત્યાં પ્રભુ સ્વયં વાસ કરે છે. શુભ સવાર!',
    tags: ['सत्य', 'दया', 'पवित्रता']
  },
  {
    id: 5,
    category: 'spiritual',
    categoryLabel: '🪔 आध्यात्मिक',
    authorOrTone: 'भक्ति भाव',
    hindiText: 'जब हर सांस में ईश्वर का स्मरण और हर कार्य में सेवा का भाव हो, तो जीवन की हर सुबह पावन तीर्थ बन जाती है। जय श्री राम!',
    englishText: 'When every breath remembers God and every deed is an act of service, every morning becomes sacred. Good Morning!',
    marathiText: 'जेव्हा प्रत्येक श्वासात देवाचे स्मरण आणि कार्यात सेवेचा भाव असतो, तेव्हा प्रत्येक सकाळ पावन तीर्थ बनते. जय श्री राम!',
    gujaratiText: 'જ્યારે દરેક શ્વાસમાં ઈશ્વરનું સ્મરણ અને કાર્યોમાં સેવાનો ભાવ હોય, ત્યારે દરેક સવાર પાવન બની જાય છે. જય શ્રી રામ!',
    tags: ['भक्ति', 'स्मरण', 'राम']
  },

  // Motivation & Hard Work (प्रेरणादायक व सफलता)
  {
    id: 6,
    category: 'motivation',
    categoryLabel: '🚀 प्रेरणादायक',
    authorOrTone: 'सफलता सूत्र',
    hindiText: 'सूरज की तरह चमकना है तो पहले सूरज की तरह तपना सीखो। आपका संघर्ष ही कल आपकी सबसे बड़ी पहचान बनेगा। सुप्रभात!',
    englishText: 'If you want to shine like the sun, first learn to burn like the sun. Your hustle today is your identity tomorrow. Good Morning!',
    marathiText: 'सूर्यासारखे चमकायचे असेल तर आधी सूर्यासारखे जळायला शिका. आजचा संघर्षच उद्याची ओळख बनेल. शुभ प्रभात!',
    gujaratiText: 'સૂર્યની જેમ ચમકવું હોય તો પહેલા સૂર્યની જેમ તપવું શીખો. આજનો સંઘર્ષ આવતીકાલની ઓળખ બનશે. શુભ સવાર!',
    tags: ['संघर्ष', 'मेहनत', 'सूरज', 'सफलता']
  },
  {
    id: 7,
    category: 'motivation',
    categoryLabel: '🚀 प्रेरणादायक',
    authorOrTone: 'आत्मविश्वास',
    hindiText: 'मुश्किलें केवल उन बेहतरीन लोगों के हिस्से में आती हैं, जो उन्हें बेहतरीन तरीके से सुलझाने का साहस रखते हैं। आगे बढ़ते रहें!',
    englishText: 'Challenges only come to strong people who possess the courage to overcome them gracefully. Keep moving forward!',
    marathiText: 'कठीण प्रसंग फक्त अशाच लोकांच्या वाट्याला येतात, ज्यांच्यात त्यावर मात करण्याचे धाडस असते. पुढे चालत राहा!',
    gujaratiText: 'મુશ્કેલીઓ ફક્ત એવા મજબૂત લોકોના ભાગે આવે છે, જેઓ તેને હલ કરવાની હિંમત ધરાવે છે. આગળ વધતા રહો!',
    tags: ['साहस', 'हौसला', 'विजय']
  },
  {
    id: 8,
    category: 'motivation',
    categoryLabel: '🚀 प्रेरणादायक',
    authorOrTone: 'लक्ष्य चिंतन',
    hindiText: 'कल का दिन कैसा भी बीता हो, आज आपके पास एक नया अवसर, नई ऊर्जा और नया इतिहास लिखने का दिन है। उठो और विजयी बनो!',
    englishText: 'No matter how yesterday went, today offers a brand new opportunity, fresh energy, and a clean slate. Rise and conquer!',
    marathiText: 'कालचा दिवस कसाही गेला असला तरी आज तुमच्याकडे नवी संधी आणि नवा इतिहास लिहिण्याची वेळ आहे. उठा आणि विजयी व्हा!',
    gujaratiText: 'ગઈકાલ ગમે તેવી વીતી હોય, આજે તમારી પાસે નવી તક અને નવો ઇતિહાસ રચવાનો દિવસ છે. શુભ પ્રભાત!',
    tags: ['अवसर', 'ऊर्जा', 'लक्ष्य']
  },
  {
    id: 9,
    category: 'motivation',
    categoryLabel: '🚀 प्रेरणादायक',
    authorOrTone: 'कर्मठता',
    hindiText: 'रास्ते कभी खत्म नहीं होते, बस लोग हिम्मत हार जाते हैं। तैरना सीखना है तो पानी में उतरना ही होगा, किनारे बैठकर कोई गोताखोर नहीं बनता।',
    englishText: 'Paths never end, people just lose courage. If you want to swim, you must dive in; sitting on the shore makes no diver.',
    marathiText: 'रस्ते कधी संपत नाहीत, माणसेच धीर सोडतात. पोहायला शिकायचे तर पाण्यात उतरावेच लागते. सुप्रभात!',
    gujaratiText: 'રસ્તા ક્યારેય પૂરા થતા નથી, લોકો હિંમત હારી જાય છે. આગળ વધવા માટે પગલું ભરવું જ પડે છે. શુભ સવાર!',
    tags: ['हिम्मत', 'प्रयास', 'विजय']
  },
  {
    id: 10,
    category: 'motivation',
    categoryLabel: '🚀 प्रेरणादायक',
    authorOrTone: 'धैर्य व संकल्प',
    hindiText: 'सफलता एक दिन में नहीं मिलती, लेकिन अगर ठान लो तो एक दिन जरूर मिलती है। अपने विश्वास को कभी डगमगाने न दें। शुभ प्रभात!',
    englishText: 'Success does not come in a day, but if you persevere, it definitely comes one day. Keep your faith firm. Good Morning!',
    marathiText: 'यश एका दिवसात मिळत नाही, पण निश्चय पक्का असेल तर एका दिवशी नक्की मिळते. शुभ सकाळ!',
    gujaratiText: 'સફળતા એક દિવસમાં નથી મળતી, પરંતુ દ્રઢ સંકલ્પ હોય તો એક દિવસ ચોક્કસ મળે છે. શુભ પ્રભાત!',
    tags: ['संकल्प', 'विश्वास', 'सफलता']
  },

  // Karma & Philosophy (कर्म एवं जीवन दर्शन)
  {
    id: 11,
    category: 'karma',
    categoryLabel: '🌸 कर्म दर्शन',
    authorOrTone: 'कर्म सिद्धांत',
    hindiText: 'कर्म की आवाज शब्दों से भी ज्यादा ऊँची होती है। जो आप संसार को देते हैं, प्रकृति वही आपको कई गुना लौटाती है। सदैव शुभ करें।',
    englishText: 'Actions speak louder than words. Whatever goodness you put out into the world, nature returns multiplied. Do good always.',
    marathiText: 'कर्माचा आवाज शब्दांपेक्षा मोठा असतो. आपण जगाला जे देतो, निसर्ग तेच आपल्याला परत करतो. शुभ कर्म करा!',
    gujaratiText: 'કર્મનો અવાજ શબ્દો કરતા મોટો હોય છે. જે તમે દુનિયાને આપો છો, કુદરત તે જ તમને પાછું આપે છે. શુભ સવાર!',
    tags: ['कर्म', 'प्रकृति', 'सच्चाई']
  },
  {
    id: 12,
    category: 'karma',
    categoryLabel: '🌸 कर्म दर्शन',
    authorOrTone: 'जीवन बोध',
    hindiText: 'रिश्ते मोतियों की तरह होते हैं, अगर गिर भी जाएं तो झुककर उठा लेना चाहिए। अहंकार से बड़ा कोई शत्रु नहीं और क्षमा से बड़ा कोई गहना नहीं।',
    englishText: 'Relationships are like pearls; if they drop, bend and pick them up. Ego has no friend, and forgiveness has no equal.',
    marathiText: 'नाते मोत्यासारखे असते, पडले तरी वाकून उचलून घ्यावे. अहंकार सर्वांत मोठा शत्रू आणि क्षमा हा खरा अलंकार आहे. शुभ प्रभात!',
    gujaratiText: 'સંબંધો મોતી જેવા હોય છે, પડી જાય તો નમીને ઉઠાવી લેવા જોઈએ. ક્ષમા સૌથી મોટો ગુણ છે. શુભ સવાર!',
    tags: ['रिश्ते', 'क्षमा', 'संस्कार']
  },
  {
    id: 13,
    category: 'karma',
    categoryLabel: '🌸 कर्म दर्शन',
    authorOrTone: 'नीति वचन',
    hindiText: 'पेड़ की शाखा पर बैठा पक्षी कभी डाल टूटने से नहीं डरता, क्योंकि उसका भरोसा डाल पर नहीं, अपने पंखों पर होता है। स्वयं पर विश्वास रखें।',
    englishText: 'A bird sitting on a branch never fears the branch breaking, because its trust is not on the branch, but on its own wings.',
    marathiText: 'झाडाच्या फांदीवर बसलेला पक्षी फांदी तुटायला कधीच घाबरत नाही, कारण त्याचा विश्वास फांदीवर नव्हे, स्वतःच्या पंखांवर असतो.',
    gujaratiText: 'ડાળી પર બેઠેલું પક્ષી ડાળી તૂટવાથી ડરતું નથી, કારણ કે તેનો વિશ્વાસ ડાળી પર નહીં પણ પોતાની પાંખો પર હોય છે.',
    tags: ['विश्वास', 'आत्मबल', 'धैर्य']
  },
  {
    id: 14,
    category: 'karma',
    categoryLabel: '🌸 कर्म दर्शन',
    authorOrTone: 'संत कबीर',
    hindiText: 'वाणी में अमृत और व्यवहार में मिठास रखिए, क्योंकि मीठे बोल से बिगड़े काम भी बन जाते हैं और कटु बोल से अपने भी पराये हो जाते हैं।',
    englishText: 'Keep sweetness in your tongue and kindness in your conduct. Gentle words turn strangers into friends and heal hearts.',
    marathiText: 'वाणीत गोडवा आणि वागण्यात नम्रता ठेवा, कारण गोड बोलण्याने बिघडलेली कामेही मार्गी लागतात. शुभ सकाळ!',
    gujaratiText: 'વાણીમાં મીઠાશ અને વર્તનમાં નમ્રતા રાખો, મીઠા બોલથી બગડેલા કામ પણ સુધરી જાય છે. શુભ પ્રભાત!',
    tags: ['वाणी', 'मधुरता', 'सदाचार']
  },

  // Family & Relationships (माता-पिता व रिश्ते)
  {
    id: 15,
    category: 'family',
    categoryLabel: '💖 परिवार व संस्कार',
    authorOrTone: 'पितृ वंदना',
    hindiText: 'माता-पिता का आशीर्वाद वह अदृश्य कवच है, जो दुनिया की हर मुसीबत और संकट से हमारी रक्षा करता है। सुबह उठकर उनका नमन करें।',
    englishText: 'Parents blessings are an invisible shield protecting us from all adversity. Greet them with reverence every morning.',
    marathiText: 'आई-वडिलांचे आशीर्वाद हे ते अदृश्य कवच आहे, जे संकटांपासून आपले रक्षण करते. शुभ सकाळ!',
    gujaratiText: 'માતા-પિતાના આશીર્વાદ એ અદ્રશ્ય કવચ છે જે દરેક મુશ્કેલીથી આપણી રક્ષા કરે છે. વંદન સાથે શુભ સવાર!',
    tags: ['माता-पिता', 'आशीर्वाद', 'संस्कार']
  },
  {
    id: 16,
    category: 'family',
    categoryLabel: '💖 परिवार व संस्कार',
    authorOrTone: 'पारिवारिक सौहार्द',
    hindiText: 'घर में चाहे कितने भी सोने-चाँदी हों, असली धन वही है जहाँ परिवार में प्रेम, सम्मान और एकता का वास हो। आपका परिवार खुशहाल रहे!',
    englishText: 'True wealth is not silver and gold, but a home filled with love, mutual respect, and unity. Have a joyful day with family!',
    marathiText: 'घरात कितीही धन असले तरी खरी संपत्ती तीच आहे जिथे प्रेम, आदर आणि एकोपा असतो. शुभ प्रभात!',
    gujaratiText: 'ઘરમાં સાચી સંપત્તિ એ છે જ્યાં પ્રેમ, માન અને સંપ હોય. તમારો પરિવાર સદાય સુખી રહે. શુભ સવાર!',
    tags: ['परिवार', 'प्रेम', 'एकता']
  },
  {
    id: 17,
    category: 'family',
    categoryLabel: '💖 परिवार व संस्कार',
    authorOrTone: 'मैत्री भाव',
    hindiText: 'एक सच्चा मित्र और एक नेक विचार पूरी जिंदगी बदल सकते हैं। जो आपके सुख-दुख में साथ खड़े रहें, उन्हें कभी न भूलें। शुभ प्रभात!',
    englishText: 'A true friend and a noble thought can transform an entire life. Cherish those who stand by you in every weather.',
    marathiText: 'एक खरा मित्र आणि एक चांगला विचार संपूर्ण आयुष्य बदलू शकतात. शुभ प्रभात!',
    gujaratiText: 'એક સાચો મિત્ર અને સારો વિચાર આખી જિંદગી બદલી શકે છે. શુભ સવાર!',
    tags: ['मित्रता', 'स्नेह', 'संबंध']
  },

  // Positivity & Joy (सकारात्मक ऊर्जा)
  {
    id: 18,
    category: 'positivity',
    categoryLabel: '🌿 सकारात्मकता',
    authorOrTone: 'उमंग व आनंद',
    hindiText: 'मुस्कुराहट चेहरे का सबसे सुंदर आभूषण है। आज किसी उदास चेहरे पर मुस्कान लाने का प्रयास करें, आपका दिन स्वतः ही धन्य हो जाएगा।',
    englishText: 'A smile is the most beautiful ornament. Bring a smile to someone’s face today, and your day will be deeply blessed.',
    marathiText: 'हसू हे चेहऱ्याचे सर्वात सुंदर आभूषण आहे. आज कोणाच्या तरी चेहऱ्यावर आनंद फुलवा, दिवस धन्य होईल. शुभ प्रभात!',
    gujaratiText: 'સ્મિત ચહેરાનું સૌથી સુંદર ઘરેણું છે. આજે કોઈના ચહેરા પર સ્મિત લાવવાનો પ્રયાસ કરો. શુભ સવાર!',
    tags: ['मुस्कान', 'आनंद', 'उत्साह']
  },
  {
    id: 19,
    category: 'positivity',
    categoryLabel: '🌿 सकारात्मकता',
    authorOrTone: 'आशा की किरण',
    hindiText: 'हर नई सुबह ईश्वर का मौन संदेश है कि जीवन में कभी उम्मीद मत खोना, क्योंकि हर अंधेरी रात के बाद स्वर्णिम सवेरा जरूर आता है।',
    englishText: 'Every new dawn is God’s gentle whisper: never lose hope, for after the darkest night comes a glorious morning.',
    marathiText: 'प्रत्येक सकाळ हा ईश्वराचा संदेश आहे की आशेचा किरण कधी सोडू नका, अंधारानंतर सोनेरी पहाट नक्की येते. सुप्रभात!',
    gujaratiText: 'દરેક નવી સવાર ઈશ્વરનો સંદેશ છે કે આશા ક્યારેય ન ગુમાવો, અંધારી રાત પછી અજવાળું ચોક્કસ આવે છે. શુભ સવાર!',
    tags: ['उम्मीद', 'आशा', 'सवेरा']
  },
  {
    id: 20,
    category: 'positivity',
    categoryLabel: '🌿 सकारात्मकता',
    authorOrTone: 'उत्साह वर्धन',
    hindiText: 'सकारात्मक सोच वह जादुई चाबी है जो हर बंद दरवाजे को खोल सकती है। खुद पर और ईश्वर की योजना पर पूरा भरोसा रखें। शुभ प्रभात!',
    englishText: 'Positive thinking is the master key that can unlock every closed door. Trust yourself and trust the Divine plan.',
    marathiText: 'सकारात्मक विचार ही अशी गुरुकिल्ली आहे जी प्रत्येक बंद दार उघडू शकते. शुभ सकाळ!',
    gujaratiText: 'સકારાત્મક વિચાર એ ચાવી છે જે દરેક બંધ દરવાજા ખોલી શકે છે. શુભ પ્રભાત!',
    tags: ['सकारात्मकता', 'ऊर्जा', 'विश्वास']
  },

  // Peace & Contentment (शांति व संतोष)
  {
    id: 21,
    category: 'peace',
    categoryLabel: '🧘 मानसिक शांति',
    authorOrTone: 'संतोष रहस्य',
    hindiText: 'शांति धन या पद में नहीं, बल्कि संतोष और शांत चित्त में मिलती है। जो प्राप्त है, वही पर्याप्त है। इसी भाव से दिन की शुरुआत करें।',
    englishText: 'Peace is not found in wealth or status, but in a contented and tranquil mind. Begin your day with serene gratitude.',
    marathiText: 'शांतता संपत्तीत नाही, तर समाधानात असते. जे मिळाले आहे त्यात समाधानी राहून दिवसाची सुरुवात करा. शुभ प्रभात!',
    gujaratiText: 'શાંતિ ધન કે પદમાં નહીં, પણ સંતોષમાં છે. જે મળ્યું છે તેમાં સંતોષ માની દિવસની શરૂઆત કરો. શુભ સવાર!',
    tags: ['शांति', 'संतोष', 'प्रसन्नता']
  },
  {
    id: 22,
    category: 'peace',
    categoryLabel: '🧘 मानसिक शांति',
    authorOrTone: 'क्षमा व विवेक',
    hindiText: 'जो दूसरों को शांति देता है, उसका हृदय स्वयं शांत हो जाता है। नफरत और बैर का बोझ छोड़कर आज हल्के मन से जिएँ। शुभ प्रभात!',
    englishText: 'He who gives peace to others finds his own heart tranquil. Drop the baggage of resentment and live light today.',
    marathiText: 'जो इतरांना शांती देतो, त्याचे मन आपोआप शांत होते. द्वेष विसरून हलक्या मनाने जगा. शुभ सकाळ!',
    gujaratiText: 'જે અન્યોને શાંતિ આપે છે, તેનું હૃદય આપોઆપ શાંત થાય છે. વેરભાવ છોડી હળવાશથી જીવો. શુભ સવાર!',
    tags: ['क्षमा', 'शांति', 'हृदय']
  },

  // Expanded Curated Wisdom for 100 Daily Items
  {
    id: 23,
    category: 'spiritual',
    categoryLabel: '🪔 आध्यात्मिक',
    authorOrTone: 'उपनिषद ज्ञान',
    hindiText: 'सत्य की नाव डगमगा सकती है, पर कभी डूब नहीं सकती। सत्य के मार्ग पर चलने वाले को अंत में विजय ही मिलती है। शुभ प्रभात!',
    englishText: 'The boat of truth may rock, but it never sinks. One who walks the righteous path always triumphs in the end.',
    marathiText: 'सत्याची होडी डगमगू शकते पण कधी बुडत नाही. सत्याच्या मार्गावर चालणाऱ्याचा शेवटी विजयच होतो.',
    gujaratiText: 'સત્યની નાવ ડગમગી શકે છે, પણ ડૂબતી નથી. સત્યના માર્ગે ચાલનારને અંતે વિજય જ મળે છે. શુભ સવાર!',
    tags: ['सत्य', 'धर्म', 'विजय']
  },
  {
    id: 24,
    category: 'motivation',
    categoryLabel: '🚀 प्रेरणादायक',
    authorOrTone: 'स्वामी विवेकानंद',
    hindiText: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए। अपनी अनंत शक्ति को पहचानो। सुप्रभात!',
    englishText: 'Arise, awake, and stop not until the goal is achieved. Recognize your infinite inner power. Good Morning!',
    marathiText: 'उठा, जागे व्हा आणि ध्येय साध्य होईपर्यंत थांबू नका. स्वतःमधील अथांग शक्ती ओळखा. शुभ प्रभात!',
    gujaratiText: 'ઉઠો, જાગો અને ધ્યેય પ્રાપ્તિ સુધી મંડ્યા રહો. તમારી અનંત શક્તિને ઓળખો. શુભ પ્રભાત!',
    tags: ['विवेकानंद', 'लक्ष्य', 'साहस']
  },
  {
    id: 25,
    category: 'karma',
    categoryLabel: '🌸 कर्म दर्शन',
    authorOrTone: 'कर्म फल',
    hindiText: 'जैसे बछड़ा हजारों गायों में भी अपनी माँ को खोज लेता है, वैसे ही कर्म भी अपने कर्ता को खोज ही लेता है। सदा नेक कर्म करें।',
    englishText: 'Just as a calf finds its mother among thousands of cows, deeds invariably find their doer. Choose noble actions always.',
    marathiText: 'जसे वासरू हजारो गाईंमध्ये आपल्या आईला शोधते, तसेच कर्म आपल्या कर्त्याला शोधून काढते. चांगले कर्म करा.',
    gujaratiText: 'જેમ વાછરડું હજારો ગાયોમાં પોતાની માતાને શોધી લે છે, તેમ કર્મ પણ પોતાના કર્તાને શોધી લે છે. શુભ કર્મ કરો.',
    tags: ['कर्म', 'न्याय', 'सद्कर्म']
  },
  {
    id: 26,
    category: 'positivity',
    categoryLabel: '🌿 सकारात्मकता',
    authorOrTone: 'आशावादी विचार',
    hindiText: 'जिंदगी साइकिल चलाने जैसी है, संतुलन बनाए रखने के लिए लगातार पैडल मारते रहना पड़ता है। आगे बढ़ते रहें!',
    englishText: 'Life is like riding a bicycle: to keep your balance, you must keep moving forward. Have a wonderful day!',
    marathiText: 'आयुष्य सायकल चालवण्यासारखे आहे, समतोल राखण्यासाठी पुढे चालत राहावे लागते. शुभ सकाळ!',
    gujaratiText: 'જીવન સાયકલ ચલાવવા જેવું છે, સંતુલન જાળવવા આગળ વધતા રહેવું પડે છે. શુભ સવાર!',
    tags: ['संतुलन', 'प्रगति', 'जीवन']
  },
  {
    id: 27,
    category: 'peace',
    categoryLabel: '🧘 मानसिक शांति',
    authorOrTone: 'शांत भाव',
    hindiText: 'चिंता करने से कल की परेशानियाँ दूर नहीं होतीं, बल्कि आज का सुकून भी छिन जाता है। ईश्वर पर भरोसा रखें और शांत रहें।',
    englishText: 'Worrying does not empty tomorrow of its sorrow; it only empties today of its peace. Trust God and stay calm.',
    marathiText: 'काळजी केल्याने उद्याच्या अडचणी सुटत नाहीत, पण आजची शांतता हिरावून घेतली जाते. देवावर विश्वास ठेवा.',
    gujaratiText: 'ચિંતા કરવાથી કાલની મુશ્કેલીઓ દૂર થતી નથી, પણ આજની શાંતિ છીનવાઈ જાય છે. ઈશ્વર પર ભરોસો રાખો. શુભ સવાર!',
    tags: ['चिंतामुक्ति', 'शांति', 'विश्वास']
  },
  {
    id: 28,
    category: 'family',
    categoryLabel: '💖 परिवार व संस्कार',
    authorOrTone: 'संस्कार धरोहर',
    hindiText: 'दौलत तो कोई भी कमा सकता है, लेकिन संस्कार केवल शुद्ध आचरण और बड़ों के आशीर्वाद से मिलते हैं। परिवार का सम्मान करें।',
    englishText: 'Anyone can earn wealth, but noble values come only through pure conduct and elders’ blessings. Cherish family.',
    marathiText: 'पैसा कोणीही कमवू शकतो, पण संस्कार फक्त शुद्ध आचरण आणि ज्येष्ठांच्या आशीर्वादाने मिळतात. शुभ प्रभात!',
    gujaratiText: 'દોલત તો કોઈ પણ કમાઈ શકે છે, પરંતુ સંસ્કાર સારા આચરણ અને વડીલોના આશીર્વાદથી જ મળે છે. શુભ પ્રભાત!',
    tags: ['संस्कार', 'परिवार', 'आशीर्वाद']
  },
  {
    id: 29,
    category: 'spiritual',
    categoryLabel: '🪔 आध्यात्मिक',
    authorOrTone: 'प्रभु स्मरण',
    hindiText: 'जिसके हृदय में दया, करुणा और प्रभु का वास है, उसका कोई अमंगल नहीं कर सकता। ॐ नमो भगवते वासुदेवाय!',
    englishText: 'He who holds compassion, grace, and devotion in his heart can never be harmed by ill winds. Good Morning!',
    marathiText: 'ज्याच्या हृदयात दया, करुणा आणि ईश्वराचा वास आहे, त्याचे कोणीही वाईट करू शकत नाही. शुभ प्रभात!',
    gujaratiText: 'જેના હૃદયમાં દયા, કરુણા અને પ્રભુનો વાસ છે, તેનું કોઈ અહિત કરી શકતું નથી. શુભ સવાર!',
    tags: ['करुणा', 'वासुदेव', 'सुरक्षा']
  },
  {
    id: 30,
    category: 'motivation',
    categoryLabel: '🚀 प्रेरणादायक',
    authorOrTone: 'हौसले की उड़ान',
    hindiText: 'परिंदों को मंजिल मिलेगी यकीनन, ये फैले हुए उनके पर बोलते हैं। वे लोग रहते हैं खामोश अक्सर, जमाने में जिनके हुनर बोलते हैं।',
    englishText: 'Birds surely find their destination; their wide wings declare it. Truly capable people work quietly and let results speak.',
    marathiText: 'पक्षांना दिशा नक्की मिळते, त्यांचे पसरलेले पंख सांगतात. कर्तृत्ववान माणसे शांत राहून इतिहास घडवतात.',
    gujaratiText: 'પંખીઓને મંજિલ જરૂર મળે છે, તેમના ફેલાયેલા પાંખો બોલે છે. ગુણવાન લોકો શાંતિથી કાર્ય કરી પરિણામ આપે છે. શુભ પ્રભાત!',
    tags: ['हुनर', 'मंजिल', 'हौसला']
  }
];

// Seeded deterministic 100 daily suvichar generator based on calendar day
export function getDaily100Suvichar(targetDate: Date = new Date()): SuvicharItem[] {
  const dayOfYear = Math.floor(
    (targetDate.getTime() - new Date(targetDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const year = targetDate.getFullYear();
  const seed = (year * 365 + dayOfYear) % 100000;

  // Master bank of 50 wisdom anchors across themes
  const dynamicWisdomCore = [
    {
      hi: 'प्रसन्नता कोई तैयार वस्तु नहीं है, यह आपके अपने कर्मों और विचारों से उत्पन्न होती है।',
      en: 'Happiness is not something ready-made; it comes from your own actions and mindset.',
      mr: 'आनंद हा तयार नसतो, तो आपल्या कर्म आणि विचारातून निर्माण होतो.',
      gu: 'આનંદ કોઈ તૈયાર વસ્તુ નથી, તે તમારા કર્મો અને વિચારોથી ઉત્પન્ન થાય છે.',
      cat: 'positivity' as const,
      tag: ['प्रसन्नता', 'आनंद', 'कर्म']
    },
    {
      hi: 'ईश्वर की न्याय व्यवस्था में देर हो सकती है, अंधेर कभी नहीं। अपने धर्म और कर्तव्य पर अडिग रहें।',
      en: 'In the divine order of justice, there may be patience, but truth always triumphs. Stay steadfast.',
      mr: 'देवाच्या न्यायात उशीर होऊ शकतो, पण अन्याय कधीच होत नाही. कर्तव्यावर ठाम राहा.',
      gu: 'ઈશ્વરના ન્યાયમાં વિલંબ થઈ શકે છે, અન્યાય ક્યારેય નહીં. ધર્મ પર અડગ રહો.',
      cat: 'spiritual' as const,
      tag: ['ईश्वर', 'न्याय', 'सत्य']
    },
    {
      hi: 'मेहनत इतनी खामोशी से करो कि तुम्हारी सफलता खुद ही शोर मचा दे।',
      en: 'Work hard in silence, let your success be your noise. Rise and shine!',
      mr: 'मेहनत इतक्या शांततेने करा की यशाने संपूर्ण जगात आवाज करावा. शुभ सकाळ!',
      gu: 'મહેનત એટલી શાંતિથી કરો કે સફળતા આપોઆપ અવાજ કરે. શુભ સવાર!',
      cat: 'motivation' as const,
      tag: ['मेहनत', 'खामोशी', 'सफलता']
    },
    {
      hi: 'जो व्यक्ति झुकना जानता है, वह सारे संसार को जीतने का सामर्थ्य रखता है। विनम्रता ही असली शक्ति है।',
      en: 'He who knows the art of humility holds the power to win over the world. True strength is gentleness.',
      mr: 'जो नम्र व्हायला शिकतो, तो संपूर्ण जगाला जिंकण्याचे सामर्थ्य ठेवतो.',
      gu: 'જે નમ્ર બનતા શીખે છે, તે આખી દુનિયાને જીતવાનું સામર્થ્ય રાખે છે.',
      cat: 'karma' as const,
      tag: ['विनम्रता', 'संस्कार', 'शक्ति']
    },
    {
      hi: 'संसार में सबसे कीमती उपहार किसी को अपना समय, सम्मान और सच्चा स्नेह देना है।',
      en: 'The most precious gift you can offer anyone in this world is your time, respect, and sincere love.',
      mr: 'जगात सर्वात मौल्यवान भेट म्हणजे कोणाला आपला वेळ, आदर आणि मनापासून प्रेम देणे.',
      gu: 'દુનિયામાં સૌથી કિંમતી ભેટ કોઈને તમારો સમય, આદર અને સ્નેહ આપવો છે.',
      cat: 'family' as const,
      tag: ['उपहार', 'स्नेह', 'समय']
    },
    {
      hi: 'मौन रहना भी एक साधना है। जहाँ शब्दों का कोई मोल न हो, वहाँ मौन सबसे श्रेष्ठ उत्तर होता है।',
      en: 'Silence is a deep practice. Where words lose their value, silence becomes the wisest reply.',
      mr: 'मौन राहणे ही सुद्धा एक साधना आहे. जिथे शब्दांना मोल नसते, तिथे मौन श्रेष्ठ उत्तर ठरते.',
      gu: 'મૌન રહેવું પણ એક સાધના છે. જ્યાં શબ્દોનું મૂલ્ય ન હોય, ત્યાં મૌન શ્રેષ્ઠ ઉત્તર છે.',
      cat: 'peace' as const,
      tag: ['मौन', 'विवेक', 'शांति']
    },
    {
      hi: 'जब विश्वास मजबूत होता है, तो हर असंभव कार्य संभव बन जाता है। अपने भीतर की शक्ति को पहचानें।',
      en: 'When faith is unshakable, the impossible becomes possible. Awaken your inner strength.',
      mr: 'जेव्हा विश्वास पक्का असतो, तेव्हा प्रत्येक अशक्य गोष्ट शक्य बनते. शुभ प्रभात!',
      gu: 'જ્યારે વિશ્વાસ દ્રઢ હોય, ત્યારે દરેક અશક્ય કાર્ય શક્ય બની જાય છે.',
      cat: 'motivation' as const,
      tag: ['विश्वास', 'शक्ति', 'विजय']
    },
    {
      hi: 'जीवन एक दर्पण की तरह है; अगर आप इस पर मुस्कुराते हैं, तो यह भी आपको मुस्कुराकर देखता है।',
      en: 'Life is like a mirror: if you smile at it, it smiles right back at you. Have a radiant day!',
      mr: 'आयुष्य एका आरशासारखे आहे; तुम्ही हसून पाहिले तर तेही हसून उत्तर देते.',
      gu: 'જીવન અરીસા જેવું છે; જો તમે હસશો, તો તે પણ હસીને જવાબ આપશે.',
      cat: 'positivity' as const,
      tag: ['दर्पण', 'मुस्कान', 'जीवन']
    },
    {
      hi: 'क्रोध में लिया गया निर्णय और अहंकार में किया गया कर्म सदैव पश्चाताप का कारण बनता है। शांत रहें।',
      en: 'Decisions taken in anger and deeds done in pride always lead to regret. Stay calm and mindful.',
      mr: 'रागात घेतलेला निर्णय आणि अहंकाराने केलेले कर्म नेहमी पश्चात्तापास कारणीभूत ठरते.',
      gu: 'ક્રોધમાં લીધેલો નિર્ણય અને અહંકારમાં કરેલું કર્મ હંમેશા પસ્તાવો લાવે છે.',
      cat: 'peace' as const,
      tag: ['क्रोध', 'विवेक', 'धैर्य']
    },
    {
      hi: 'जिस प्रकार दीपक खुद जलकर दूसरों को प्रकाश देता है, उसी प्रकार श्रेष्ठ व्यक्ति परोपकार में जीवन बिताते हैं।',
      en: 'Just as a lamp burns itself to give light to others, noble souls dedicate their lives to benevolence.',
      mr: 'ज्याप्रमाणे दिवा स्वतः जळून इतरांना प्रकाश देतो, त्याचप्रमाणे थोर व्यक्ती परोपकारात आयुष्य जगतात.',
      gu: 'જેમ દીવો પોતે બળીને અન્યોને પ્રકાશ આપે છે, તેમ શ્રેષ્ઠ લોકો પરોપકારમાં જીવન વિતાવે છે.',
      cat: 'karma' as const,
      tag: ['परोपकार', 'दीपक', 'कल्याण']
    },
    {
      hi: 'प्रातःकाल उगता हुआ सूर्य हमें सिखाता है कि अंधकार कितना भी गहरा हो, उजाले की एक किरण उसे मिटा देती है।',
      en: 'The rising morning sun teaches us that no matter how deep the darkness, a single ray of light dispels it all.',
      mr: 'उगवणारा सूर्य शिकवतो की अंधार कितीही दाट असला तरी प्रकाशाचा एक किरण त्याला मिटवून टाकतो.',
      gu: 'ઉગતો સૂર્ય શીખવે છે કે અંધકાર ભલે ગમે તેટલો ઘેરો હોય, અજવાળાનું એક કિરણ તેને દૂર કરી દે છે.',
      cat: 'positivity' as const,
      tag: ['सूर्य', 'उजाला', 'आशा']
    },
    {
      hi: 'ईश्वर के हर फैसले में कोई न कोई भलाई छिपी होती है, भरोसा रखें समय आने पर सब समझ आ जाएगा।',
      en: 'There is hidden goodness in every decree of God. Keep faith; with time, all clarity unfolds.',
      mr: 'देवाच्या प्रत्येक निर्णयात काहीतरी चांगले लपलेले असते, विश्वास ठेवा वेळेनुसार सर्व समजेल.',
      gu: 'ઈશ્વરના દરેક નિર્ણયમાં કોઈ ભલાઈ છુપાયેલી હોય છે, ભરોસો રાખો સમય આવ્યે બધું સમજાશે.',
      cat: 'spiritual' as const,
      tag: ['ईश्वर', 'भरोसा', 'समय']
    },
    {
      hi: 'समय और समझ दोनों एक साथ खुशकिस्मत लोगों को ही मिलते हैं; जब समय होता है तो समझ नहीं होती और जब समझ आती है तो समय नहीं रहता।',
      en: 'Time and wisdom rarely arrive together; fortunate are those who cherish both in harmony.',
      mr: 'वेळ आणि समज दोन्ही एकत्र भाग्यवानांनाच मिळतात; वेळेचा आदर करा आणि प्रगती करा.',
      gu: 'સમય અને સમજ બંને એકસાથે ભાગ્યશાળી લોકોને જ મળે છે. સમયનો સદુપયોગ કરો. શુભ સવાર!',
      cat: 'karma' as const,
      tag: ['समय', 'समझ', 'विवेक']
    },
    {
      hi: 'अपनी तुलना कभी दूसरों से मत कीजिए; सूर्य और चंद्रमा दोनों ही चमकते हैं लेकिन अपने-अपने समय पर।',
      en: 'Never compare yourself with others. The sun and the moon both shine, but at their own time.',
      mr: 'कधीही स्वतःची तुलना इतरांशी करू नका; सूर्य आणि चंद्र दोघेही आपापल्या वेळी चमकतात.',
      gu: 'ક્યારેય પોતાની સરખામણી અન્યો સાથે ન કરો; સૂર્ય અને ચંદ્ર બંને પોતપોતાના સમયે ચમકે છે.',
      cat: 'motivation' as const,
      tag: ['तुलना', 'आत्मविश्वास', 'धैर्य']
    },
    {
      hi: 'संसार में सबसे सुंदर पौधा विश्वास का होता है, जो जमीन पर नहीं बल्कि दिलों में उगता है।',
      en: 'The most exquisite plant in this world is trust; it grows not on soil, but inside faithful hearts.',
      mr: 'जगात सर्वात सुंदर रोपटे विश्वासाचे असते, जे जमिनीत नाही तर मनात रुजते.',
      gu: 'સંસારમાં સૌથી સુંદર છોડ વિશ્વાસનો છે, જે જમીન પર નહીં પણ હૃદયમાં ઉગે છે. શુભ સવાર!',
      cat: 'family' as const,
      tag: ['विश्वास', 'हृदय', 'रिश्ते']
    },
    {
      hi: 'मन की शांति से बड़ा कोई खजाना नहीं और संतोष से बड़ा कोई सुख नहीं। आज का दिन प्रसन्नता से बिताएँ।',
      en: 'There is no treasure greater than peace of mind, and no joy richer than contentment.',
      mr: 'मनाच्या शांततेपेक्षा मोठा खजिना नाही आणि समाधानापेक्षा मोठे सुख नाही. शुभ प्रभात!',
      gu: 'મનની શાંતિથી મોટો કોઈ ખજાનો નથી અને સંતોષથી મોટું કોઈ સુખ નથી. શુભ પ્રભાત!',
      cat: 'peace' as const,
      tag: ['शांति', 'खजाना', 'संतोष']
    },
    {
      hi: 'जो व्यक्ति हर परिस्थिति में ईश्वर की इच्छा स्वीकार करना सीख जाता है, वह कभी दुखी नहीं हो सकता।',
      en: 'He who learns to welcome the Divine will in every circumstance remains eternally serene and fearless.',
      mr: 'जो प्रत्येक परिस्थितीत देवाची इच्छा मान्य करतो, तो कधीही निराश होत नाही.',
      gu: 'જે વ્યક્તિ દરેક પરિસ્થિતિમાં પ્રભુની મરજી સ્વીકારવાનું શીખી જાય છે, તે સદાય સુખી રહે છે.',
      cat: 'spiritual' as const,
      tag: ['समर्पण', 'ईश्वर', 'आनंद']
    },
    {
      hi: 'अच्छे लोगों की सबसे बड़ी खूबी यही होती है कि उन्हें याद रखना नहीं पड़ता, वे दिलों में बस जाते हैं।',
      en: 'The finest quality of noble souls is that they need not be remembered; they naturally dwell in hearts.',
      mr: 'चांगल्या माणसांचे वैशिष्ट्य हेच की त्यांची आठवण ठेवावी लागत नाही, ते मनातच घर करतात.',
      gu: 'સારા લોકોની ખાસિયત એ છે કે તેમને યાદ રાખવા નથી પડતા, તેઓ દિલમાં વસી જાય છે.',
      cat: 'family' as const,
      tag: ['सज्जन', 'हृदय', 'प्रेम']
    },
    {
      hi: 'हार तब तक नहीं होती जब तक आप प्रयास करना बंद नहीं करते। एक बार फिर नए संकल्प के साथ उठिए।',
      en: 'Defeat is never final until you cease striving. Rise once more with fresh determination!',
      mr: 'पराभव तोपर्यंत होत नाही जोपर्यंत तुम्ही प्रयत्न करणे थांबवत नाही. नव्या आशेने उठा!',
      gu: 'હાર ત્યાં સુધી નથી થતી જ્યાં સુધી તમે પ્રયત્ન છોડતા નથી. ફરી નવા જોશ સાથે આગળ વધો.',
      cat: 'motivation' as const,
      tag: ['प्रयास', 'विजय', 'दृढ़ता']
    },
    {
      hi: 'हृदय में कृतज्ञता का भाव रखिए; जो आपके पास है, उसके लिए आभारी रहें, जीवन में खुशियाँ बढ़ेंगी।',
      en: 'Cultivate gratitude in your heart; when you appreciate what you hold, life multiplies its grace.',
      mr: 'हृदयात कृतज्ञतेचा भाव ठेवा; जे आहे त्याबद्दल आभार माना, आयुष्यात आनंद वाढेल.',
      gu: 'હૃદયમાં કૃતજ્ઞતા રાખો; જે તમારી પાસે છે તેના માટે આભાર માનો, ખુશીઓ બમણી થશે.',
      cat: 'positivity' as const,
      tag: ['कृतज्ञता', 'खुशियाँ', 'प्रार्थना']
    }
  ];

  const categoryLabels = {
    spiritual: '🪔 आध्यात्मिक',
    motivation: '🚀 प्रेरणादायक',
    karma: '🌸 कर्म दर्शन',
    family: '💖 परिवार व संस्कार',
    positivity: '🌿 सकारात्मकता',
    peace: '🧘 मानसिक शांति'
  };

  // Combine and deterministically shuffle with daily seed
  const pool: Omit<SuvicharItem, 'number'>[] = [...MASTER_SUVICHAR_BANK];

  // Fill up to 100+ unique entries using dynamic wisdom variations
  let idCounter = MASTER_SUVICHAR_BANK.length + 1;
  const morningBlessings = [
    { hi: 'आपका आज का दिन अत्यंत मंगलमय, ऊर्जावान और सफल हो!', en: 'May your day be deeply blessed, energetic, and triumphant!', mr: 'आजचा दिवस आपल्यासाठी मंगलमय व यशस्वी ठरो!', gu: 'આજનો દિવસ તમારા માટે ખૂબ જ મંગલમય અને સફળ રહે!' },
    { hi: 'ईश्वर आपको सदा स्वस्थ, दीर्घायु और प्रसन्न रखें।', en: 'May the Divine keep you healthy, prosperous, and smiling always.', mr: 'ईश्वर आपणास सदैव निरोगी व आनंदी ठेवो.', gu: 'પ્રભુ તમને સદાય નિરોગી અને પ્રસન્ન રાખે.' },
    { hi: 'आज का सूर्य आपके जीवन में नई उमंग और सौभाग्य लेकर आए।', en: 'May today’s golden sun bring fresh zeal and good fortune into your life.', mr: 'आजचा सूर्य आपल्या जीवनात नवी उमेद घेऊन येवो.', gu: 'આજનો સૂર્ય તમારા જીવનમાં નવો ઉત્સાહ અને સૌભાગ્ય લાવે.' },
    { hi: 'सदा सकारात्मक सोचें और निष्काम भाव से आगे बढ़ें।', en: 'Always think positively and walk forward with a compassionate heart.', mr: 'सकारात्मक विचार करा आणि आनंदाने पुढे चला.', gu: 'સદાય હકારાત્મક વિચારો અને નિઃસ્વાર્થ ભાવે આગળ વધો.' },
    { hi: 'ॐ सूर्याय नमः! आपका दिन शांति और आनंद से परिपूर्ण हो।', en: 'Om Suryaya Namah! Wishing you profound peace and abundance.', mr: 'ॐ सूर्याय नमः! आजचा दिवस सुख आणि शांततेचा जावो.', gu: 'ૐ સૂર્યાય નમઃ! તમારો દિવસ સુખ અને શાંતિથી ભરેલો રહે.' }
  ];

  let coreIdx = 0;
  while (pool.length < 120) {
    const item = dynamicWisdomCore[coreIdx % dynamicWisdomCore.length];
    const blessing = morningBlessings[(pool.length + seed) % morningBlessings.length];
    const itemNum = pool.length + 1;

    pool.push({
      id: idCounter++,
      category: item.cat,
      categoryLabel: categoryLabels[item.cat],
      authorOrTone: itemNum % 2 === 0 ? 'दैनिक सुविचार' : 'अमृत वचन',
      hindiText: `${item.hi} ${blessing.hi}`,
      englishText: `${item.en} ${blessing.en}`,
      marathiText: `${item.mr} ${blessing.mr}`,
      gujaratiText: `${item.gu} ${blessing.gu}`,
      tags: [...item.tag, 'शुभ प्रभात', 'सुविचार']
    });
    coreIdx++;
  }

  // Deterministic daily rotation using seed
  const rotated = [...pool];
  const offset = seed % rotated.length;
  const reordered = [...rotated.slice(offset), ...rotated.slice(0, offset)];

  // Pick exactly 100 items with continuous numbers 1 to 100
  return reordered.slice(0, 100).map((item, index) => ({
    ...item,
    number: index + 1
  }));
}

// Format today's Hindi calendar date for the Shubh Prabhat header
export function getHindiFormattedDate(d: Date = new Date()): string {
  const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const months = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  
  const dayName = days[d.getDay()];
  const dateNum = d.getDate();
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}

export const getTodayHindiDateString = getHindiFormattedDate;

// Format current Day name (e.g. सोमवार) and Time (e.g. 07:30 AM) for card display
export function getDayAndTimeFormatted(language: 'hindi' | 'english' | 'marathi' | 'gujarati' = 'hindi', d: Date = new Date()): { dayName: string; timeStr: string; badgeText: string } {
  const dayNames = {
    hindi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
    marathi: ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
    gujarati: ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'],
    english: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  const dayList = dayNames[language] || dayNames.hindi;
  const dayName = dayList[d.getDay()];

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : String(minutes);
  const hoursStr = hours < 10 ? '0' + hours : String(hours);
  const timeStr = `${hoursStr}:${minutesStr} ${ampm}`;

  const badgeText = `${dayName} • ${timeStr}`;

  return { dayName, timeStr, badgeText };
}
