export type LanguageCode = 'hi' | 'en' | 'mr' | 'gu' | 'bn' | 'te' | 'ta' | 'kn' | 'pa';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🚩' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', flag: '🌟' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🌸' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🌺' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🪔' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🦚' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', flag: '🌾' },
];

export interface FestivalLanguageContent {
  greetingTitle: string;
  greetingPoem: string;
  whatsappMessage: (senderName: string, url: string, hasPhoto: boolean) => string;
  wishes: string[];
}

export const FESTIVAL_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, FestivalLanguageContent>>> = {
  diwali: {
    hi: {
      greetingTitle: 'शुभ दीपावली की हार्दिक शुभकामनाएँ',
      greetingPoem: 'दीयों की रोशनी से जगमगाए आपका संसार, सुख, समृद्धि और आरोग्य मिले अपार। माँ लक्ष्मी और भगवान गणेश जी की कृपा आप पर सदा बनी रहे।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* ने आपके और आपके पूरे परिवार के लिए एक खास जादुई दीपावली शुभकामना${hasPhoto ? ' और फोटो' : ''} भेजी है! 🪔✨\n\nनीचे नीले लिंक पर टच करके अपना सरप्राइज देखें 👇\n${url}`,
      wishes: [
        'दीपक का प्रकाश आपके जीवन के हर अंधेरे को दूर करे। शुभ दीपावली!',
        'माँ लक्ष्मी आपके घर में सदा वास करें और धन-धान्य की वर्षा करें।',
        'सुख, शांति और समृद्धि से परिपूर्ण हो आपका हर दिन। सपरिवार दीपावली की बधाई!'
      ]
    },
    mr: {
      greetingTitle: 'दिवाळीच्या मनःपूर्वक हार्दिक शुभेच्छा!',
      greetingPoem: 'लक्ष लक्ष दिव्यांनी उजळून निघो ही दिवाळी, सुख, शांती, समृद्धी आणि आरोग्याची लाभो नवी पहाट! माता लक्ष्मी व विघ्नहर्ता गणरायाची कृपा तुमच्या कुटुंबावर सदैव राहो.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* यांनी तुमच्यासाठी व तुमच्या संपूर्ण कुटुंबासाठी एक खास जादुई दिवाळी शुभेच्छा${hasPhoto ? ' व फोटो' : ''} पाठवली आहे! 🪔✨\n\nखाली दिलेल्या लिंकवर क्लिक करून आपले सरप्राईज पहा 👇\n${url}`,
      wishes: [
        'दीपावलीच्या या मंगलमयी दिनी आपल्या सर्व मनोकामना पूर्ण होवोत. शुभ दीपावली!',
        'धनाची आणि आरोग्याची बरसात होवो, ही दिवाळी आपल्या आयुष्यात आनंदाचे रंग भरो.',
        'आनंदाचे तोरण, सुखाची रांगोळी, उजळो तुमचे घर हीच दिवाळी!'
      ]
    },
    en: {
      greetingTitle: 'Wishing You a Very Happy & Prosperous Diwali!',
      greetingPoem: 'May the divine light of Diwali illuminate your life with peace, prosperity, happiness, and good health. May Goddess Lakshmi and Lord Ganesha bless you and your family abundantly.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* has sent a magical Diwali surprise greeting${hasPhoto ? ' with photo' : ''} for you and your family! 🪔✨\n\nTap the blue link below to open your festive surprise 👇\n${url}`,
      wishes: [
        'May this Diwali illuminate your life with eternal joy, wealth, and wellness. Happy Diwali!',
        'Wishing you and your family a festival full of lights, laughter, and grand blessings.',
        'May Goddess Lakshmi bless your home with boundless prosperity!'
      ]
    },
    gu: {
      greetingTitle: 'દિવાળી ની હાર્દિક શુભકામનાઓ!',
      greetingPoem: 'દીવાઓનો આ પાવન પ્રકાશ તમારા જીવનમાં સુખ, શાંતિ અને સમૃદ્ધિ લાવે. માં લક્ષ્મી અને ગણેશજી ના આશીર્વાદ સદાય તમારા પરિવાર પર બની રહે.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* તરફથી તમારા અને તમારા પરિવાર માટે એક ખાસ દિવાળી શુભકામના સંદેશ${hasPhoto ? ' અને ફોટો' : ''} મોકલ્યો છે! 🪔✨\n\nનીચે આપેલ લિંક પર ક્લિક કરી તમારું સરપ્રાઈઝ જુઓ 👇\n${url}`,
      wishes: [
        'દિવાળીના આ શુભ પર્વ પર તમને અને તમારા પરિવારને ખૂબ ખૂબ શુભકામનાઓ!',
        'ધન, વૈભવ અને સારા સ્વાસ્થ્ય ની પ્રાપ્તિ થાય એવી પ્રભુ ચરણે પ્રાર્થના.',
        'નવા વર્ષમાં તમારી દરેક મનોકામના પૂર્ણ થાય. હેપી દિવાળી!'
      ]
    },
    bn: {
      greetingTitle: 'শুভ দীপাবলির আন্তরিক প্রীতি ও শুভেচ্ছা!',
      greetingPoem: 'প্রদীপের আলোয় উজ্জ্বল হয়ে উঠুক আপনার সমগ্র জীবন। সুখ, সমৃদ্ধি ও আনন্দে ভরে উঠুক প্রতিটি দিন। মা লক্ষ্মী ও গণেশের আশীর্বাদ সর্বদা আপনার সাথে থাকুক।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* আপনার ও আপনার পরিবারের জন্য একটি বিশেষ দীপাবলি শুভেচ্ছা${hasPhoto ? ' ও ফটো' : ''} পাঠিয়েছেন! 🪔✨\n\nনিচের লিংকে ক্লিক করে দেখুন 👇\n${url}`,
      wishes: [
        'আলোর উৎসবে আপনার জীবন আলোকময় ও সুখময় হয়ে উঠুক। শুভ দীপাবলি!',
        'মা লক্ষ্মীর কৃপায় আপনার গৃহে সদা সুখ ও শান্তির বসবাস হোক।',
        'শুভ দীপাবলির প্রীতি, শুভেচ্ছা ও অনেক অনেক ভালোবাসা।'
      ]
    },
    te: {
      greetingTitle: 'దీపావళి పండుగ శుభాకాంక్షలు!',
      greetingPoem: 'దివ్యమైన దీపాల కాంతులు మీ జీవితంలో సుఖశాంతులు, సమృద్ధి మరియు ఆనందాన్ని నింపాలని ఆకాంక్షిస్తూ.. లక్ష్మీ గణపతి ఆశీస్సులు మీకు ఎల్లప్పుడూ ఉండాలని కోరుకుంటున్నాము.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* మీ కోసం మరియు మీ కుటుంబం కోసం ఒక అద్భుతమైన దీపావళి శుభాకాంక్షలు${hasPhoto ? ' మరియు ఫోటో' : ''} పంపారు! 🪔✨\n\nఈ లింక్ తాకి మీ సర్ ప్రైజ్ చూడండి 👇\n${url}`,
      wishes: [
        'మీకు మరియు మీ కుటుంబ సభ్యులకు దీపావళి శుభాకాంక్షలు!',
        'ఈ దీపాల పండుగ మీ ఇంట సిరిసంపదలు తీసుకురావాలని ఆశిస్తున్నాము.'
      ]
    },
    ta: {
      greetingTitle: 'இனிய தீபாவளி நல்வாழ்த்துகள்!',
      greetingPoem: 'தீபங்களின் ஒளி உங்கள் இல்லத்திலும் உள்ளத்திலும் மகிழ்ச்சியையும் அமைதியையும் பிரகாசிக்கச் செய்யட்டும். லட்சுமி தேவியின் அருள் என்றும் உங்களுடன் நிலைத்திருக்கட்டும்.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* உங்களுக்கும் உங்கள் குடும்பத்திற்கும் சிறப்பான தீபாவளி வாழ்த்து${hasPhoto ? ' மற்றும் புகைப்படம்' : ''} அனுப்பியுள்ளார்! 🪔✨\n\nகீழே உள்ள இணைப்பை தொட்டு உங்கள் சர்ப்ரைஸை பாருங்கள் 👇\n${url}`,
      wishes: [
        'அனைவருக்கும் மனமார்ந்த இனிய தீபாவளி நல்வாழ்த்துகள்!',
        'செல்வமும் மகிழ்ச்சியும் பெருகிட இனிய தீபத் திருநாள் வாழ்த்துகள்.'
      ]
    },
    kn: {
      greetingTitle: 'ದೀಪಾವಳಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು!',
      greetingPoem: 'ದೀಪಗಳ ಬೆಳಕು ನಿಮ್ಮ ಬಾಳಿನಲ್ಲಿ ಸುಖ, ಶಾಂತಿ, ಸಮೃದ್ಧಿ ಮತ್ತು ಯಶಸ್ಸನ್ನು ತರಲಿ. ಲಕ್ಷ್ಮೀ ದೇವಿಯ ಕೃಪೆ ನಿಮ್ಮ ಕುಟುಂಬದ ಮೇಲೆ ಸದಾ ಇರಲಿ.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* ಅವರು ನಿಮಗಾಗಿ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕಾಗಿ ವಿಶೇಷ ದೀಪಾವಳಿ ಶುಭಾಶಯಗಳನ್ನು${hasPhoto ? ' ಮತ್ತು ಫೋಟೋ' : ''} ಕಳುಹಿಸಿದ್ದಾರೆ! 🪔✨\n\nಲಿಂಕ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ನೋಡಿ 👇\n${url}`,
      wishes: [
        'ನಿಮಗೆ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬದವರಿಗೆ ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು!',
        'ಬೆಳಕಿನ ಹಬ್ಬ ನಿಮ್ಮ ಬಾಳಲ್ಲಿ ಹೊಸ ಬೆಳಕನ್ನು ಮೂಡಿಸಲಿ.'
      ]
    },
    pa: {
      greetingTitle: 'ਦੀਵਾਲੀ ਦੀਆਂ ਲੱਖ ਲੱਖ ਵਧਾਈਆਂ!',
      greetingPoem: 'ਦੀਵਿਆਂ ਦੀ ਰੌਸ਼ਨੀ ਨਾਲ ਤੁਹਾਡਾ ਜੀਵਨ ਖੁਸ਼ੀਆਂ, ਸੁੱਖ, ਸ਼ਾਂਤੀ ਅਤੇ ਤਰੱਕੀ ਨਾਲ ਭਰ ਜਾਵੇ। ਵਾਹਿਗੁਰੂ ਦੀ ਮਿਹਰ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਤੇ ਹਮੇਸ਼ਾ ਬਣੀ ਰਹੇ।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* ਨੇ ਤੁਹਾਡੇ ਅਤੇ ਤੁਹਾਡੇ ਪੂਰੇ ਪਰਿਵਾਰ ਲਈ ਖਾਸ ਦੀਵਾਲੀ ਦੀ ਮੁਬਾਰਕਬਾਦ${hasPhoto ? ' ਤੇ ਫੋਟੋ' : ''} ਭੇਜੀ ਹੈ! 🪔✨\n\nਹੇਠਾਂ ਦਿੱਤੇ ਲਿੰਕ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਆਪਣਾ ਸਰਪ੍ਰਾਈਜ਼ ਦੇਖੋ 👇\n${url}`,
      wishes: [
        'ਤੁਹਾਨੂੰ ਅਤੇ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਨੂੰ ਦੀਵਾਲੀ ਦੀਆਂ ਬਹੁਤ ਬਹੁਤ ਮੁਬਾਰਕਾਂ!',
        'ਦੀਵਾਲੀ ਦਾ ਤਿਉਹਾਰ ਤੁਹਾਡੇ ਘਰ ਵਿੱਚ ਬਰਕਤਾਂ ਅਤੇ ਖੁਸ਼ੀਆਂ ਲੈ ਕੇ ਆਵੇ।'
      ]
    }
  },
  newyear: {
    hi: {
      greetingTitle: 'नव वर्ष 2026 की मंगलमय शुभकामनाएँ',
      greetingPoem: 'नया सवेरा, नई किरण के साथ, नया साल आए खुशियों की सौगात के साथ। हर ख्वाहिश पूरी हो, हर सपना सच हो, यही दुआ है हमारी आपके लिए इस वर्ष के साथ।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* ने आपके लिए नव वर्ष 2026 की खूबसूरत विशिंग लिंक${hasPhoto ? ' और फोटो' : ''} भेजी है! 🎆✨\n\nयहाँ क्लिक करके अपना स्पेशल न्यू ईयर कार्ड देखें 👇\n${url}`,
      wishes: [
        'नव वर्ष 2026 आपके जीवन में अपार खुशियाँ और सफलता लेकर आए!',
        'हर दिन नया जोश, हर पल नई उमंग, यही है नए साल का रंग। हैप्पी न्यू ईयर!',
        'ईश्वर से प्रार्थना है कि नया साल आपकी हर मनोकामना पूरी करे।'
      ]
    },
    mr: {
      greetingTitle: 'नवीन वर्ष 2026 च्या हार्दिक शुभेच्छा!',
      greetingPoem: 'नव्या वर्षात नवे संकल्प, नव्या आशा आणि नवी भरारी! येणारे 2026 हे वर्ष आपल्या आयुष्यात भरभराट, उत्तम आरोग्य आणि निखळ आनंद घेऊन येवो हीच ईश्वरचरणी प्रार्थना.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* यांनी तुमच्यासाठी नवीन वर्ष 2026 ची खास शुभेच्छा लिंक${hasPhoto ? ' व फोटो' : ''} पाठवली आहे! 🎆✨\n\nखालील लिंकवर क्लिक करून पहा 👇\n${url}`,
      wishes: [
        'नवीन वर्ष 2026 आपल्या आयुष्यात सुख, समृद्धी आणि यश घेऊन येवो. हॅप्पी न्यू इयर!',
        'नवे क्षितीज, नवी आशा, समृद्धीची नवी दिशा! नवीन वर्षाच्या मनःपूर्वक शुभेच्छा.'
      ]
    },
    en: {
      greetingTitle: 'Wishing You a Happy & Prosperous New Year 2026!',
      greetingPoem: 'May the New Year bring you warmth, love, light, and boundless success to guide your path to a positive destination. Cheers to a brilliant 2026!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* has created an exclusive New Year 2026 surprise card${hasPhoto ? ' with photo' : ''} for you! 🎆✨\n\nTap the link to open your card 👇\n${url}`,
      wishes: [
        'Wishing you 365 days of good health, happiness, and incredible accomplishments in 2026!',
        'May this New Year be the start of your greatest chapter yet. Happy New Year 2026!'
      ]
    },
    gu: {
      greetingTitle: 'નૂતન વર્ષ 2026 ની હાર્દિક શુભકામનાઓ!',
      greetingPoem: 'નવું વર્ષ તમારા જીવનમાં સુખ, શાંતિ, સારા સ્વાસ્થ્ય અને અપાર સફળતા લઈને આવે. સાલ મુબારક!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* તરફથી તમને નવા વર્ષ 2026 ની ખાસ શુભેચ્છા${hasPhoto ? ' અને ફોટો' : ''} મોકલાઈ છે! 🎆✨\n\nલિંક ખોલીને તમારું કાર્ડ જુઓ 👇\n${url}`,
      wishes: [
        'નૂતન વર્ષાભિનંદન! આવનારું વર્ષ તમારા માટે ખૂબ જ મંગલમય રહે એવી પ્રભુને પ્રાર્થના.',
        'હેપી ન્યુ યર 2026! તમારું દરેક સ્વપ્ન સાકાર થાય.'
      ]
    }
  },
  holi: {
    hi: {
      greetingTitle: 'होली के पावन पर्व की सतरंगी शुभकामनाएँ',
      greetingPoem: 'गुलाल का लाल, पिचकारी की धार, अपनों का प्यार, यही है होली का त्योहार। राधा-कृष्ण के प्रेम के रंग में रंग जाए आपका हर पल।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* ने आपके लिए होली की रंगबिरंगी बधाई${hasPhoto ? ' और फोटो' : ''} भेजी है! 🎨💦\n\nरंगों का जादुई जादू देखने के लिए लिंक टच करें 👇\n${url}`,
      wishes: [
        'रंगों के इस पावन त्योहार में आपकी ज़िंदगी खुशियों के रंगों से भर जाए। हैप्पी होली!',
        'राधा-कृष्ण के पावन प्रेम का रंग आप पर सदा चढ़ा रहे। शुभ होली!'
      ]
    },
    mr: {
      greetingTitle: 'रंगोत्सव होळी व धुळिवंदनाच्या हार्दिक शुभेच्छा!',
      greetingPoem: 'रंग प्रेमाचा, रंग स्नेहाचा, रंग आनंदाचा आणि उत्साहाचा! होळीच्या पवित्र अग्नीत सर्व संकटांचे दहन होवो आणि आपल्या जीवनात सुखसमृद्धीचे रंग उधळोत.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* यांनी आपल्यासाठी होळी व धुळिवंदनाची रंगीबेरंगी शुभेच्छा${hasPhoto ? ' व फोटो' : ''} पाठवली आहे! 🎨✨\n\nजादू पाहण्यासाठी लिंक उघडा 👇\n${url}`,
      wishes: [
        'होळी आणि धुळिवंदनाच्या सप्तरंगी शुभेच्छा! आपले आयुष्य आनंदाने भरून जावो.',
        'वाईट विचारांचे होळीत दहन होवो आणि चांगल्या विचारांचे रोपण होवो.'
      ]
    },
    en: {
      greetingTitle: 'Wishing You a Vibrant & Joyful Holi 2026!',
      greetingPoem: 'May the cheerful colors of Holi paint your canvas of life with bliss, peace, warmth, and enduring companionship. Have a safe and vibrant Holi celebration!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* has sent you a colorful Holi greeting card${hasPhoto ? ' with photo' : ''}! 🎨✨\n\nTap to splash festive colors online 👇\n${url}`,
      wishes: [
        'May your life be as colorful and joyful as the festival of Holi. Happy Holi 2026!',
        'Wishing you peace, prosperity, and playful moments with your loved ones.'
      ]
    },
    gu: {
      greetingTitle: 'રંગોના પર્વ હોળી ની હાર્દિક શુભકામનાઓ!',
      greetingPoem: 'પ્રેમ, ઉમંગ અને ભાઈચારા ના રંગો થી રંગાઈ જાય તમારું જીવન. હોળી અને ધૂળેટી ની ખૂબ ખૂબ શુભેચ્છાઓ!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎁 *${sender}* તરફથી તમને હોળી નો મંગલમય રંગબેરંગી સંદેશ મોકલ્યો છે! 🎨✨\n\nઅહીં ક્લિક કરીને જુઓ 👇\n${url}`,
      wishes: [
        'હોળી ની પવિત્ર અગ્નિમાં દરેક કષ્ટોનું દહન થાય અને જીવનમાં ખુશીઓ ફેલાય. શુભ હોળી!'
      ]
    }
  },
  birthday: {
    hi: {
      greetingTitle: 'जन्मदिन की अनंत कोटि शुभकामनाएँ!',
      greetingPoem: 'सूरज रोशनी लेकर आए, चिड़ियाँ गाना गाएँ, फूलों ने हँसकर बोला, मुबारक हो जन्मदिन आपका! ईश्वर आपको दीर्घायु, उत्तम स्वास्थ्य और अपार यश प्रदान करें।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎂 *${sender}* ने आपके लिए एक स्पेशल बर्थडे विशिंग म्यूजिकल कार्ड${hasPhoto ? ' और फोटो' : ''} भेजा है! 🎁🎈\n\nअपना बर्थडे सरप्राइज देखने के लिए नीचे टच करें 👇\n${url}`,
      wishes: [
        'जन्मदिन की हार्दिक शुभकामनाएँ! ईश्वर आपकी हर मनोकामना पूर्ण करें।',
        'बार-बार यह दिन आए, बार-बार यह दिल गाए, तुम जियो हज़ारों साल!',
        'आप सदा मुस्कुराते रहें, सफलता आपके कदम चूमे। हैप्पी बर्थडे!'
      ]
    },
    mr: {
      greetingTitle: 'वाढदिवसाच्या हार्दिक शुभेच्छा!',
      greetingPoem: 'सुख, समृद्धी, समाधान आणि दीर्घायुष्य लाभो आपल्याला! आपल्या भावी आयुष्यातील सर्व स्वप्ने साकार होवोत, हीच ईश्वरचरणी प्रार्थना. वाढदिवसाच्या लाख लाख शुभेच्छा!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎂 *${sender}* यांनी आपल्यासाठी वाढदिवसाचे एक खास संगीतमय सरप्राईज कार्ड पाठवले आहे! 🎁🎈\n\nखालील लिंक उघडून पहा 👇\n${url}`,
      wishes: [
        'वाढदिवसाच्या अनंत शुभेच्छा! परमेश्वर आपणास उदंड व निरोगी आयुष्य देवो.',
        'आपल्या चेहऱ्यावरील हास्य असेच कायम राहो, हीच सदिच्छा. हॅप्पी बर्थडे!'
      ]
    },
    en: {
      greetingTitle: 'Wishing You a Very Happy Birthday!',
      greetingPoem: 'Count your life by smiles, not tears. Count your age by friends, not years. May your special day bring you as much joy and happiness as you bring to everyone around you!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎂 *${sender}* has sent you a personalized musical Birthday greeting${hasPhoto ? ' with photo' : ''}! 🎁🎈\n\nTap the link to unwrap your birthday surprise 👇\n${url}`,
      wishes: [
        'May all your dreams turn into reality this year. Have a phenomenal Birthday!',
        'Wishing you another year of great adventures, good health, and immense happiness!'
      ]
    },
    gu: {
      greetingTitle: 'જન્મદિવસ ની હાર્દિક શુભકામનાઓ!',
      greetingPoem: 'પ્રભુ તમને દીર્ઘાયુ, ઉત્તમ સ્વાસ્થ્ય અને જીવનમાં સર્વોચ્ચ સફળતા આપે એવી અંતઃકરણપૂર્વક પ્રાર્થના. જન્મદિવસ ની ખૂબ ખૂબ વધાઈ!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🎂 *${sender}* એ તમારા માટે જન્મદિવસનું મ્યુઝિકલ કાર્ડ મોકલ્યું છે! 🎁🎈\n\nઅહીં ક્લિક કરી તમારું સરપ્રાઈઝ જુઓ 👇\n${url}`,
      wishes: [
        'જન્મદિવસ મુબારક! તમારું આવનારું વર્ષ આનંદ અને ઉમંગ થી ભરેલું રહે.'
      ]
    }
  },
  shivratri: {
    hi: {
      greetingTitle: 'महाशिवरात्रि महापर्व की मंगलमय शुभकामनाएँ',
      greetingPoem: 'शिव की शक्ति, शिव की भक्ति, खुशियों की बहार मिले, महाशिवरात्रि के पावन अवसर पर आपको ज़िन्दगी की नई शुरुआत मिले। हर हर महादेव!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🔱 *${sender}* ने आपके लिए महाशिवरात्रि की पावन शुभकामना${hasPhoto ? ' और फोटो' : ''} भेजी है! हर हर महादेव 🕉️\n\nमहादेव का आशीर्वाद पाने के लिए टच करें 👇\n${url}`,
      wishes: [
        'हर हर महादेव! भोलेनाथ की कृपा आप और आपके परिवार पर सदा बनी रहे।',
        'काल भी तुम, महाकाल भी तुम। महाशिवरात्रि की पावन बधाई!'
      ]
    },
    mr: {
      greetingTitle: 'महाशिवरात्रीच्या मनःपूर्वक मंगलमय शुभेच्छा!',
      greetingPoem: 'देवाधिदेव महादेव आणि माता पार्वतीचे शुभाशीर्वाद सदैव आपल्या पाठीशी राहोत. आपल्या जीवनातील सर्व चिंतांचे हरण होवो. हर हर महादेव!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🔱 *${sender}* यांनी आपल्यासाठी महाशिवरात्रीची पावन शुभेच्छा लिंक पाठवली आहे! हर हर महादेव 🕉️\n\nदर्शन घेण्यासाठी लिंकवर क्लिक करा 👇\n${url}`,
      wishes: [
        'महाशिवरात्रीच्या पावन पर्वावर भोळ्या शंकराची कृपा आपल्यावर सदैव राहो. हर हर महादेव!'
      ]
    },
    en: {
      greetingTitle: 'Happy Maha Shivratri! Har Har Mahadev',
      greetingPoem: 'May the divine glory of Lord Shiva remind us of our capabilities and help us attain success. May Mahadev bless you with strength, peace, and eternal bliss.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🔱 *${sender}* has shared a divine Maha Shivratri greeting${hasPhoto ? ' with photo' : ''}! Har Har Mahadev 🕉️\n\nTap to receive Lord Shiva blessings 👇\n${url}`,
      wishes: [
        'May Lord Shiva shower his divine blessings upon you and your family. Happy Maha Shivratri!'
      ]
    }
  },
  ramnavami: {
    hi: {
      greetingTitle: 'श्री रामनवमी महापर्व की पावन शुभकामनाएँ',
      greetingPoem: 'जिनके मन में श्री राम हैं, भाग्य में उनके बैकुंठ धाम है। उनके चरणों में जिसने जीवन वार दिया, संसार में उसका कल्याण है। जय श्री राम!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🚩 *${sender}* ने आपके लिए श्री रामनवमी की पावन बधाई भेजी है! जय श्री राम 🪔\n\nप्रभु श्री राम के दर्शन व शुभकामना के लिए टच करें 👇\n${url}`,
      wishes: [
        'जय श्री राम! प्रभु राम का आशीर्वाद आपके जीवन में सुख, शांति और समृद्धि लाए।',
        'रामनवमी के पावन अवसर पर आपके घर में मंगल ही मंगल हो।'
      ]
    },
    mr: {
      greetingTitle: 'श्रीरामनवमीच्या हार्दिक मंगलमय शुभेच्छा!',
      greetingPoem: 'दशरथनंदन, जानकीवल्लभ, मर्यादापुरुषोत्तम प्रभू श्रीरामचंद्रांच्या पावन जन्मदिनानिमित्त आपणास व आपल्या परिवारास मनःपूर्वक शुभेच्छा! जय श्री राम!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🚩 *${sender}* यांनी रामनवमीच्या पावन दिनी आपल्यासाठी एक विशेष शुभेच्छा संदेश पाठवला आहे! जय श्री राम 👇\n${url}`,
      wishes: [
        'मर्यादा पुरुषोत्तम प्रभू श्रीरामांचा आशीर्वाद आपल्या परिवारावर सदैव राहो. जय श्री राम!'
      ]
    },
    en: {
      greetingTitle: 'Shri Ram Navami Greetings! Jai Shree Ram',
      greetingPoem: 'May Lord Rama bless you with righteousness, supreme strength, courage, and tranquility in your life. Wishing you and your loved ones a blessed Ram Navami!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🚩 *${sender}* has sent you a divine Shri Ram Navami greeting card! Jai Shree Ram 🪔\n\nTap the link to view 👇\n${url}`,
      wishes: [
        'May the blessings of Lord Rama illuminate your path to prosperity and peace. Jai Shree Ram!'
      ]
    }
  },
  janmashtami: {
    hi: {
      greetingTitle: 'श्री कृष्ण जन्माष्टमी की हार्दिक बधाई',
      greetingPoem: 'माखन का कटोरा, मिश्री की थाल, मिट्टी की खुशबू, बारिश की फुहार। राधा की उम्मीद, कन्हैया का प्यार, मुबारक हो आपको जन्माष्टमी का त्योहार।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🦚 *${sender}* ने आपके लिए कृष्ण जन्माष्टमी की मधुर बधाई भेजी है! राधे-कृष्णा 🪈\n\nकाली कमली वाले का आशीर्वाद देखने के लिए टच करें 👇\n${url}`,
      wishes: [
        'हाथी घोड़ा पालकी, जय कन्हैया लाल की! जन्माष्टमी की हार्दिक शुभकामनाएँ।',
        'मुरली की धुन से सजे आपका जीवन, राधा-कृष्ण की कृपा आप पर सदा रहे।'
      ]
    },
    mr: {
      greetingTitle: 'गोकुळाष्टमी व दहीहंडीच्या मनःपूर्वक शुभेच्छा!',
      greetingPoem: 'नंदघरी आनंद झाला, गोपाळांचा कान्हा आला! बाळकृष्णाच्या आगमनाने आपल्या जीवनातील सर्व चिंता दूर होवोत आणि सुख-शांतीचा वर्षाव होवो.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🦚 *${sender}* यांनी आपल्यासाठी श्रीकृष्ण जन्माष्टमीची सुंदर शुभेच्छा पाठवली आहे! राधे-कृष्णा 👇\n${url}`,
      wishes: [
        'हाथी घोडा पालखी, जय कन्हैया लाल की! गोकुळाष्टमीच्या हार्दिक शुभेच्छा.'
      ]
    },
    en: {
      greetingTitle: 'Happy Krishna Janmashtami Greetings!',
      greetingPoem: 'May the joyful melodies of Krishna flute resonate in your heart and fill your home with immense harmony, positivity, and boundless love.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🦚 *${sender}* has sent you an enchanting Krishna Janmashtami wish! Radhe Radhe 🪈\n\nOpen your festive wish here 👇\n${url}`,
      wishes: [
        'May Lord Krishna steal all your worries and bless you with happiness and health. Happy Janmashtami!'
      ]
    }
  },
  rakshabandhan: {
    hi: {
      greetingTitle: 'रक्षाबंधन की असीम शुभकामनाएँ',
      greetingPoem: 'कच्चे धागों से बनी पक्की डोर है राखी, प्यार और मीठी शरारतों की होड़ है राखी। भाई की लम्बी उम्र की दुआ है राखी, बहन के पवित्र प्यार की पहचान है राखी।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🪢 *${sender}* ने आपके लिए रक्षाबंधन का प्यारा स्नेह भरा संदेश भेजा है! 💖\n\nअपना राखी सरप्राइज देखने के लिए नीचे टच करें 👇\n${url}`,
      wishes: [
        'मेरी प्यारी बहना, तुम सदा मुस्कुराती रहो। हैप्पी रक्षाबंधन!',
        'संसार के सबसे प्यारे भाई को रक्षाबंधन की ढ़ेरों शुभकामनाएँ।'
      ]
    },
    mr: {
      greetingTitle: 'रक्षाबंधनाच्या मनःपूर्वक प्रेमळ शुभेच्छा!',
      greetingPoem: 'भाऊ-बहिणीच्या अतूट, पवित्र प्रेमाचे प्रतीक असणाऱ्या रक्षाबंधनानिमित्त सर्व भावा-बहिणींना मनःपूर्वक शुभेच्छा! नात्यातील हा गोडवा असाच चिरंतर राहो.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🪢 *${sender}* यांनी आपल्यासाठी रक्षाबंधनाचा एक गोड शुभेच्छा संदेश पाठवला आहे! 💖\n\nपाहण्यासाठी खाली क्लिक करा 👇\n${url}`,
      wishes: [
        'नाते प्रेमाचे, नाते विश्वासाचे! रक्षाबंधनाच्या हार्दिक शुभेच्छा.'
      ]
    },
    en: {
      greetingTitle: 'Happy Raksha Bandhan Greetings!',
      greetingPoem: 'A bond of pure love, laughter, shared memories, and unspoken care. May the sacred thread of Rakhi strengthen the beautiful bond of sibling love forever!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `🪢 *${sender}* has shared a heartwarming Raksha Bandhan greeting with you! 💖\n\nTap to open your Rakhi card 👇\n${url}`,
      wishes: [
        'To the best sibling in the world, wishing you endless smiles and prosperity on Raksha Bandhan!'
      ]
    }
  },
  suprabhat: {
    hi: {
      greetingTitle: 'शुभ प्रभात • आज का दिन मंगलमय हो',
      greetingPoem: 'प्रातः काल का यह पावन सवेरा, आपके जीवन में नई रोशनी, नई उम्मीद और नया आनंद लेकर आए। ईश्वर की कृपा से आपके सभी कार्य निर्विघ्न संपन्न हों।',
      whatsappMessage: (sender, url, hasPhoto) =>
        `☀️ *${sender}* ने आपको आज की सुबह का पावन सुप्रभात व सुविचार भेजा है! 🌸\n\nआज का मंगलमय दिन शुरू करने के लिए टच करें 👇\n${url}`,
      wishes: [
        'शुभ प्रभात! आपका आज का दिन सुखद, शांत और मंगलमय हो।',
        'ईश्वर का आशीर्वाद आपके साथ रहे, हर कदम पर सफलता मिले।'
      ]
    },
    mr: {
      greetingTitle: 'शुभ सकाळ • आपला आजचा दिवस आनंददायी जावो!',
      greetingPoem: 'नवी सकाळ, नव्या आशा, नव्या उमेदीने सुरू होवो तुमचा प्रत्येक क्षण! परमेश्वराच्या कृपेने आपल्या सर्व कार्यात यश मिळो हीच सदिच्छा.',
      whatsappMessage: (sender, url, hasPhoto) =>
        `☀️ *${sender}* यांनी आपल्याला आजच्या पावन सकाळचे सुंदर सुप्रभात व सुविचार पाठवले आहेत! 🌸\n\nपाहण्यासाठी खाली टच करा 👇\n${url}`,
      wishes: [
        'शुभ सकाळ! आपला दिवस सुख, समाधान आणि सकारात्मकतेने भरलेला जावो.'
      ]
    },
    en: {
      greetingTitle: 'Good Morning • Have a Blessed & Productive Day!',
      greetingPoem: 'Every morning brings fresh potential and new opportunities. Wake up with determination, embrace positive thoughts, and make today wonderful!',
      whatsappMessage: (sender, url, hasPhoto) =>
        `☀️ *${sender}* has sent you a refreshing morning wish and positive vibes! 🌸\n\nTap here to start your day with blessings 👇\n${url}`,
      wishes: [
        'Good Morning! May your day be filled with warm smiles and delightful moments.'
      ]
    }
  }
};

/**
 * Helper to get the translated festival content with fallback to Hindi
 */
export function getFestivalTranslation(festivalId: string, lang: LanguageCode): FestivalLanguageContent {
  const fest = FESTIVAL_TRANSLATIONS[festivalId];
  if (fest && fest[lang]) {
    return fest[lang]!;
  }
  // Fallback to Hindi if available
  if (fest && fest['hi']) {
    return fest['hi']!;
  }
  // Generic fallback
  return {
    greetingTitle: 'पावन शुभकामनाएँ',
    greetingPoem: 'सुख, शांति और समृद्धि से परिपूर्ण हो आपका हर दिन।',
    whatsappMessage: (sender, url) => `🎁 *${sender}* ने आपके लिए एक खास शुभकामना भेजी है!\n\n${url}`,
    wishes: ['शुभकामनाएँ!']
  };
}
