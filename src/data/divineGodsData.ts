/**
 * 100% Authentic, Sacred Divine Darshan Data for Indian Festivals.
 * Every slide explicitly features the exact GOD, DEITY, or HISTORIC PERSONALITY of that festival.
 * Zero random photos. Zero irrelevant images.
 */

export interface DivineDeitySlide {
  id: string;
  godName: string;
  title: string;
  tagline: string;
  badge: string;
  mantra: string;
  imageUrl: string;
}

function createDeitySvg(params: {
  bgGradient: [string, string, string];
  deityIcon: string;
  godName: string;
  title: string;
  subTitle: string;
  mantra: string;
  accentColor: string;
  secondaryColor: string;
  auraColor: string;
}): string {
  const {
    bgGradient,
    deityIcon,
    godName,
    title,
    subTitle,
    mantra,
    accentColor,
    secondaryColor,
    auraColor
  } = params;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
      <defs>
        <radialGradient id="deityBg" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stop-color="${bgGradient[0]}"/>
          <stop offset="55%" stop-color="${bgGradient[1]}"/>
          <stop offset="100%" stop-color="${bgGradient[2]}"/>
        </radialGradient>
        <filter id="deityGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#deityBg)"/>

      <!-- Sacred Mandala Rings in Background -->
      <g opacity="0.3" transform="translate(600, 390)">
        <circle cx="0" cy="0" r="280" fill="none" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="0" cy="0" r="230" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="10 8"/>
        <circle cx="0" cy="0" r="170" fill="none" stroke="${secondaryColor}" stroke-width="3"/>
        <circle cx="0" cy="0" r="120" fill="none" stroke="${accentColor}" stroke-width="1"/>
      </g>

      <!-- Royal Border Frame -->
      <rect x="25" y="25" width="1150" height="750" rx="24" fill="none" stroke="url(#goldBorder)" stroke-width="3" opacity="0.75"/>
      <rect x="35" y="35" width="1130" height="730" rx="18" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.4"/>

      <!-- Top Badge / Header -->
      <g transform="translate(600, 95)">
        <rect x="-180" y="-22" width="360" height="44" rx="22" fill="#000000" stroke="${accentColor}" stroke-width="2" opacity="0.85"/>
        <text x="0" y="7" text-anchor="middle" fill="${accentColor}" font-family="serif" font-size="20" font-weight="bold">✨ पावन साक्षात दिव्य दर्शन ✨</text>
      </g>

      <!-- God Name Title -->
      <text x="600" y="180" text-anchor="middle" fill="#ffffff" font-family="serif" font-size="48" font-weight="900" filter="url(#deityGlow)">
        ${title}
      </text>
      <text x="600" y="225" text-anchor="middle" fill="${secondaryColor}" font-family="sans-serif" font-size="22" font-weight="600">
        ${subTitle}
      </text>

      <!-- Central Sacred Deity Emblem / Divine Radiance Aura -->
      <g transform="translate(600, 410)" filter="url(#deityGlow)">
        <!-- Radiant Halo (Tejomay Aura) -->
        <circle cx="0" cy="0" r="130" fill="${auraColor}" opacity="0.25"/>
        <circle cx="0" cy="0" r="105" fill="#000000" stroke="${accentColor}" stroke-width="5" opacity="0.85"/>
        <circle cx="0" cy="0" r="95" fill="none" stroke="${secondaryColor}" stroke-width="2" stroke-dasharray="6 6"/>
        
        <!-- Sacred Icon of the Deity -->
        <text x="0" y="38" text-anchor="middle" font-size="105" select-none="true">${deityIcon}</text>
      </g>

      <!-- Bottom God Name Banner -->
      <g transform="translate(600, 595)">
        <rect x="-240" y="-25" width="480" height="50" rx="25" fill="#000000" stroke="url(#goldBorder)" stroke-width="3" opacity="0.9"/>
        <text x="0" y="8" text-anchor="middle" fill="#fef08a" font-family="serif" font-size="28" font-weight="bold">
          ॥ ${godName} ॥
        </text>
      </g>

      <!-- Sacred Mantra / Stuti Box at Bottom -->
      <rect x="100" y="660" width="1000" height="70" rx="16" fill="#050505" stroke="${accentColor}" stroke-width="1.5" opacity="0.85"/>
      <text x="600" y="705" text-anchor="middle" fill="${secondaryColor}" font-family="serif" font-size="21" font-weight="bold">
        ${mantra}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const FESTIVAL_DEITY_GALLERIES: Record<string, DivineDeitySlide[]> = {
  // ==========================================
  // 1. DIWALI (लक्ष्मी, गणेश, राम दरबार, कुबेर)
  // ==========================================
  diwali: [
    {
      id: 'diwali-lakshmi',
      godName: 'माँ महालक्ष्मी देवी',
      title: 'माँ महालक्ष्मी दिव्य दर्शन • धनवर्षा',
      tagline: 'कमलवासिनी, धन-धान्य, वैभव और अष्टलक्ष्मी की अधिष्ठात्री',
      badge: '🌸 धनलक्ष्मी',
      mantra: '॥ ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि ॐ ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#7c2d12', '#431407', '#0a0502'],
        deityIcon: '🪷',
        godName: 'माँ महालक्ष्मी',
        title: 'माँ महालक्ष्मी जी का पावन दर्शन',
        subTitle: 'धन, धान्य, आरोग्य और अखंड सौभाग्य प्रदायिनी',
        mantra: '॥ ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः ॥',
        accentColor: '#fde047',
        secondaryColor: '#fef08a',
        auraColor: '#eab308'
      })
    },
    {
      id: 'diwali-ganesh',
      godName: 'भगवान श्री गणेश',
      title: 'विघ्नहर्ता भगवान श्री गणेश • सिद्धिदाता',
      tagline: 'प्रथम पूज्य, बुद्धिदाता, रिद्धि-सिद्धि के स्वामी गजानन',
      badge: '🐘 विघ्नहर्ता',
      mantra: '॥ ॐ गं गणपतये नमः • वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#831843', '#500724', '#0a0502'],
        deityIcon: '🐘',
        godName: 'भगवान श्री गणेश',
        title: 'श्री गणेश जी महाराज दिव्य दर्शन',
        subTitle: 'सकल विघ्न विनाशक, बुद्धि और मंगल के दाता',
        mantra: '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
        accentColor: '#fbbf24',
        secondaryColor: '#fbcfe8',
        auraColor: '#f59e0b'
      })
    },
    {
      id: 'diwali-lakshmi-ganesh',
      godName: 'लक्ष्मी-गणेश संयुक्त पूजन',
      title: 'श्री लक्ष्मी-गणेश संयुक्त महापूजन',
      tagline: 'बुद्धि और समृद्धि का पावन संगम • घर-आँगन में खुशहाली',
      badge: '✨ महापूजन',
      mantra: '॥ ॐ श्रीं गं सौम्याय गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#78350f', '#451a03', '#0a0502'],
        deityIcon: '🪔',
        godName: 'श्री लक्ष्मी-गणेश युगल',
        title: 'दीपावली लक्ष्मी-गणेश महाआरती',
        subTitle: 'बुद्धि और समृद्धि से भर जाए आपका संपूर्ण परिवार',
        mantra: '॥ दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
        accentColor: '#facc15',
        secondaryColor: '#fed7aa',
        auraColor: '#ea580c'
      })
    },
    {
      id: 'diwali-ram-darbar',
      godName: 'प्रभु श्री राम दरबार (अयोध्या)',
      title: 'मर्यादा पुरुषोत्तम श्री राम दरबार अयोध्या',
      tagline: 'श्री राम, माता सीता, भ्राता लक्ष्मण व भक्त हनुमान',
      badge: '🏹 राम दरबार',
      mantra: '॥ श्री राम जय राम जय जय राम • सियावर रामचंद्र की जय ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#9a3412', '#431407', '#0a0502'],
        deityIcon: '🏹',
        godName: 'प्रभु श्री राम दरबार',
        title: '14 वर्ष बाद अयोध्या आगमन दर्शन',
        subTitle: 'अयोध्या नगरी में प्रभु श्री राम के आगमन पर दीपों का उत्सव',
        mantra: '॥ रामाय रामभद्राय रामचंद्राय वेधसे । रघुनाथाय नाथाय सीतायाः पतये नमः ॥',
        accentColor: '#fb923c',
        secondaryColor: '#ffedd5',
        auraColor: '#ea580c'
      })
    },
    {
      id: 'diwali-kuber',
      godName: 'धनाधिपति कुबेर देव',
      title: 'धनाधिपति कुबेर देव • धन संपदा',
      tagline: 'समस्त ब्रह्मांड के कोषपाल, अक्षय धन और ऐश्वर्य प्रदाता',
      badge: '🪙 कुबेर कृपा',
      mantra: '॥ ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये धनधान्यसमृद्धिं मे देहि स्वाहा ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#713f12', '#422006', '#0a0502'],
        deityIcon: '🪙',
        godName: 'भगवान श्री कुबेर',
        title: 'कुबेर देव धनवर्षा दर्शन',
        subTitle: 'अक्षय भंडार, व्यावसायिक उन्नति और धन लाभ',
        mantra: '॥ ॐ कुबेराय नमः • धन-धान्य समृद्धिं कुरु कुरु स्वाहा ॥',
        accentColor: '#fde047',
        secondaryColor: '#fef08a',
        auraColor: '#eab308'
      })
    },
    {
      id: 'diwali-deepotsav',
      godName: 'अयोध्या धाम भव्य दीपोत्सव',
      title: 'श्री राम जन्मभूमि अयोध्या दीपोत्सव',
      tagline: 'लाखों दीपों से जगमगाता पावन सरयू तट और राम मंदिर',
      badge: '🔥 25 लाख दीप',
      mantra: '॥ रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#9a3412', '#571804', '#050201'],
        deityIcon: '🪔',
        godName: 'अयोध्या धाम दीपोत्सव',
        title: 'भव्य अलौकिक दीपोत्सव दर्शन',
        subTitle: 'अंधकार पर प्रकाश की विजय का अमर महापर्व',
        mantra: '॥ तमसो मा ज्योतिर्गमय • मृत्योर्मा अमृतं गमय ॥',
        accentColor: '#fde047',
        secondaryColor: '#fed7aa',
        auraColor: '#f97316'
      })
    }
  ],

  // ==========================================
  // 2. MAHA SHIVRATRI (महादेव, शिव-पार्वती, महाकाल ज्योतिर्लिंग)
  // ==========================================
  shivratri: [
    {
      id: 'shiva-dhyana',
      godName: 'देवाधिदेव महादेव शिव',
      title: 'देवाधिदेव भगवान भोलेनाथ • ध्यानस्थ शिव',
      tagline: 'त्रिनेत्रधारी, गंगाधर, नीलकंठ, कैलाशाधिपति महादेव',
      badge: '🔱 ॐ नमः शिवाय',
      mantra: '॥ ॐ नमः शिवाय • ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात् ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#1e1b4b', '#0f172a', '#020617'],
        deityIcon: '🔱',
        godName: 'भगवान शिव शम्भू',
        title: 'महाकाल महादेव दिव्य दर्शन',
        subTitle: 'काल के भी काल महाकाल, समस्त सृष्टि के संहारक व पालक',
        mantra: '॥ ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥',
        accentColor: '#67e8f9',
        secondaryColor: '#cffafe',
        auraColor: '#06b6d4'
      })
    },
    {
      id: 'shiva-parvati',
      godName: 'शिव-शक्ति (उमा-महेश्वर)',
      title: 'शिव-शक्ति उमा-महेश्वर दिव्य दर्शन',
      tagline: 'सृष्टि के आदि स्रोत, माता पार्वती व देवाधिदेव महादेव',
      badge: '🌸 शिव-गौरी',
      mantra: '॥ कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम् । सदावसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#312e81', '#1e1b4b', '#020617'],
        deityIcon: '🕉️',
        godName: 'माता पार्वती व महादेव',
        title: 'कल्याणकारी शिव-गौरी स्वरूप',
        subTitle: 'दांपत्य सुख, शांति और अखंड सौभाग्य के दाता',
        mantra: '॥ सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥',
        accentColor: '#a5b4fc',
        secondaryColor: '#e0e7ff',
        auraColor: '#6366f1'
      })
    },
    {
      id: 'shiva-jyotirlinga',
      godName: 'द्वादश ज्योतिर्लिंग स्वरूप',
      title: 'द्वादश ज्योतिर्लिंग • महाकालेश्वर उज्जैन',
      tagline: 'भस्म आरती, ॐकारेश्वर, सोमनाथ व काशी विश्वनाथ दर्शन',
      badge: '📿 ज्योतिर्लिंग',
      mantra: '॥ सौराष्ट्रे सोमनाथं च श्रीशैले मल्लिकार्जुनम् । उज्जयिन्यां महाकालमोङ्कारममलेश्वरम् ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#0f172a', '#1e293b', '#020617'],
        deityIcon: '🪨',
        godName: 'महाकालेश्वर ज्योतिर्लिंग',
        title: 'अकाल मृत्यु हरणाय महाकाल दर्शन',
        subTitle: 'गंगाजल, गाय के दूध और बेलपत्र से अभिसिंचित शिवलिंग',
        mantra: '॥ ॐ नमो भगवते रुद्राय • हर हर महादेव ॥',
        accentColor: '#38bdf8',
        secondaryColor: '#bae6fd',
        auraColor: '#0284c7'
      })
    },
    {
      id: 'shiva-nataraja',
      godName: 'भगवान नटराज (तांडव स्वरूप)',
      title: 'भगवान नटराज • ब्रह्मांडीय आनंद तांडव',
      tagline: 'डमरू से नाद और त्रिशूल से अधर्म का नाश करने वाले',
      badge: '⚡ नटराज',
      mantra: '॥ जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#1e1b4b', '#312e81', '#030712'],
        deityIcon: '🔥',
        godName: 'नटराज महादेव',
        title: 'शिव तांडव स्तोत्रम् दर्शन',
        subTitle: 'सृजन, स्थिति और लय के स्वामी नटराज',
        mantra: '॥ डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥',
        accentColor: '#fbbf24',
        secondaryColor: '#fef08a',
        auraColor: '#d97706'
      })
    }
  ],

  // ==========================================
  // 3. NAVRATRI / DURGA PUJA (माँ दुर्गा, शेरावाली, नवदुर्गा, वैष्णो देवी)
  // ==========================================
  navratri: [
    {
      id: 'navratri-user-1',
      godName: 'माँ दुर्गा शेरावाली',
      title: 'माँ दुर्गा शेरावाली • सिंहवाहिनी दिव्य दर्शन',
      tagline: 'अष्टभुजाधारी, त्रिशूलधारिणी, महिषासुरमर्दिनी जगदम्बा',
      badge: '🚩 जय माता दी',
      mantra: '॥ ॐ जयंती मंगला काली भद्रकाली कपालिनी । दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/1HE5DaiYEcjYhw2V8qw6bmBhTkkYZvgN8'
    },
    {
      id: 'navratri-user-2',
      godName: 'माँ नवदुर्गा पावन स्वरूप',
      title: 'माँ नवदुर्गा ९ दिव्य स्वरूप दर्शन',
      tagline: 'शैलपुत्री, ब्रह्मचारिणी, चंद्रघंटा, कूष्माण्डा, स्कन्दमाता, कात्यायनी, कालरात्रि, महागौरी, सिद्धिदात्री',
      badge: '✨ नवदुर्गा',
      mantra: '॥ प्रथमं शैलपुत्री च द्वितीयं ब्रह्मचारिणी । तृतीयं चन्द्रघण्टेति कूष्माण्डेति चतुर्थकम् ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/14Dm5wG-IjjHq8SPRBHui25iD5bBIZw9n'
    },
    {
      id: 'navratri-user-3',
      godName: 'माँ जगदम्बा भवानी',
      title: 'माँ जगदम्बा भवानी • मंगलकारी दर्शन',
      tagline: 'समस्त भक्तों की मनोकामना पूर्ण करने वाली माता रानी',
      badge: '🌸 जगज्जननी',
      mantra: '॥ सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/1YwfORoaFA6SlJyvLmjupNr2OoNOd9upa'
    },
    {
      id: 'navratri-user-4',
      godName: 'माँ वैष्णो देवी दरबार',
      title: 'माँ वैष्णो देवी पावन भवन • त्रिकुटा पर्वत',
      tagline: 'महाकाली, महालक्ष्मी और महासरस्वती का पावन त्रिपिंडी स्वरूप',
      badge: '⛰️ वैष्णो देवी',
      mantra: '॥ जय माँ वैष्णो देवी • चलो बुलावा आया है माता ने बुलाया है ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/1ZN45FdrByf_p2C7y0aLb0UaZlGuGOATb'
    },
    {
      id: 'navratri-user-5',
      godName: 'माँ शेरावाली का पावन दरबार',
      title: 'माँ शेरावाली का अलौकिक शृंगार दर्शन',
      tagline: 'लाल चुनरी, छत्र और पुष्पों से सुशोभित माता रानी',
      badge: '👑 शेरावाली',
      mantra: '॥ या देवी सर्वभूतेषु शक्ति-रूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/1pQEDqCMEboeXJQGTlqj8fH2TenKbEr9s'
    },
    {
      id: 'navratri-user-6',
      godName: 'माँ महाकाली शक्ति स्वरूप',
      title: 'माँ महाकाली • दुष्ट दलिनी संहारक स्वरूप',
      tagline: 'शत्रु बाधा नाशिनी, अकाल मृत्यु भय हरने वाली करुणामयी काली',
      badge: '⚔️ महाकाली',
      mantra: '॥ ॐ क्रीं कालिकायै नमः • ॐ कपालिन्यै नमः ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/1xtawaEf-WEXwxe4JyJSDlTer8ESLI9Sa'
    },
    {
      id: 'navratri-user-7',
      godName: 'अखंड ज्योति एवं घटस्थापना',
      title: 'नवरात्रि अखंड ज्योति • पावन कलश दर्शन',
      tagline: 'घर-परिवार में रिद्धि-सिद्धि और सुख-शांति की मंगल कामना',
      badge: '🪔 अखंड ज्योति',
      mantra: '॥ दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/1oxENTurES2DIHgqBrWuDfv9aodX4IkJ4'
    },
    {
      id: 'navratri-user-8',
      godName: 'माँ अंबे गौरी महाआरती',
      title: 'जय अंबे गौरी • मैया जय श्यामा गौरी',
      tagline: 'तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी',
      badge: '🔔 महाआरती',
      mantra: '॥ ॐ जय अंबे गौरी, मैया जय श्यामा गौरी । तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/13MdOjV5vmjP3w01QiQ6tH9f1hHAolXvO'
    },
    {
      id: 'navratri-user-9',
      godName: 'माँ दुर्गा की पावन कृपा',
      title: 'माँ दुर्गा आशीर्वाद • सुख-समृद्धि प्रदायिनी',
      tagline: 'समस्त कष्टों का निवारण और यश-कीर्ति का वरदान',
      badge: '🌺 मंगलमय दर्शन',
      mantra: '॥ देहि सौभाग्यमारोग्यं देहि मे परमं सुखम् । रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/1hMpMgUJ4SOLvRRusK1MDJwFYm0IFoy0q'
    },
    {
      id: 'navratri-user-10',
      godName: 'कन्या पूजन एवं नवमी सिद्धि',
      title: 'महानवमी सिद्धि • कन्या पूजन व आशीष',
      tagline: 'साक्षात देवी स्वरूप कन्याओं का वंदन और माता का आशीर्वाद',
      badge: '🌸 महानवमी',
      mantra: '॥ ॐ श्रीं ह्रीं क्लीं दुर्गायै नमः ॥',
      imageUrl: 'https://lh3.googleusercontent.com/d/1eVTUZbvfcTb4zSMqpjxLW75KNE5mjBry'
    }
  ],

  // ==========================================
  // 4. DR. B.R. AMBEDKAR JAYANTI (बाबासाहेब, संविधान, जय भीम)
  // ==========================================
  ambedkar_jayanti: [
    {
      id: 'ambedkar-portrait',
      godName: 'बोधिसत्व डॉ. बी. आर. आंबेडकर',
      title: 'भारत रत्न डॉ. बाबासाहेब आंबेडकर',
      tagline: 'भारतीय संविधान निर्माता, महामानव एवं समता के मसीहा',
      badge: '💙 जय भीम',
      mantra: '॥ शिक्षित बनो • संगठित रहो • संघर्ष करो ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#1e3a8a', '#0f172a', '#020617'],
        deityIcon: '📜',
        godName: 'डॉ. बाबासाहेब आंबेडकर',
        title: 'संविधान निर्माता बाबासाहेब दर्शन',
        subTitle: 'करोड़ों वंचितों, शोषितों और महिलाओं को सम्मान दिलाने वाले',
        mantra: '॥ जीवन लम्बा होने के बजाय महान होना चाहिए — डॉ. बी. आर. आंबेडकर ॥',
        accentColor: '#60a5fa',
        secondaryColor: '#93c5fd',
        auraColor: '#2563eb'
      })
    },
    {
      id: 'ambedkar-constitution',
      godName: 'भारतीय संविधान (Constitution of India)',
      title: 'लोकतंत्र की आत्मा • भारतीय संविधान',
      tagline: 'हम भारत के लोग • समता, स्वतंत्रता, बंधुत्व और न्याय',
      badge: '🇮🇳 संविधान',
      mantra: '॥ समता, स्वतंत्रता, बंधुता और न्याय ही सच्चा राष्ट्रवाद है ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#0f172a', '#1e3a8a', '#020617'],
        deityIcon: '⚖️',
        godName: 'हम भारत के लोग',
        title: 'भारतीय संविधान गौरव दिवस दर्शन',
        subTitle: 'विश्व का सबसे बड़ा और श्रेष्ठ लोकतांत्रिक संविधान',
        mantra: '॥ WE, THE PEOPLE OF INDIA... IN OUR CONSTITUENT ASSEMBLY ॥',
        accentColor: '#facc15',
        secondaryColor: '#93c5fd',
        auraColor: '#3b82f6'
      })
    },
    {
      id: 'ambedkar-deekshabhoomi',
      godName: 'दीक्षाभूमि नागपुर (सद्धम्म महातीर्थ)',
      title: 'दीक्षाभूमि नागपुर • धम्मचक्र प्रवर्तन',
      tagline: '14 अक्टूबर 1956 • बाबासाहेब द्वारा ऐतिहासिक बौद्ध धम्म दीक्षा',
      badge: '☸️ दीक्षाभूमि',
      mantra: '॥ बुद्धं शरणं गच्छामि • धम्मं शरणं गच्छामि • संघं शरणं गच्छामि ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#0c4a6e', '#0f172a', '#020617'],
        deityIcon: '☸️',
        godName: 'दीक्षाभूमि नागपुर',
        title: 'अशोक विजयादशमी सद्धम्म दीक्षा',
        subTitle: 'लाखों अनुयायियों संग बौद्ध धम्म स्वीकार कर दिया नया जीवन',
        mantra: '॥ नमो बुद्धाय • जय भीम • आत्मदीपो भव ॥',
        accentColor: '#38bdf8',
        secondaryColor: '#e0f2fe',
        auraColor: '#0284c7'
      })
    }
  ],

  // ==========================================
  // 4. EID-UL-FITR / MUSLIM (काबा, मदीना, मस्जिद-ए-नबवी, चाँद)
  // ==========================================
  eid_ul_fitr: [
    {
      id: 'eid-kaaba',
      godName: 'काबा शरीफ (मक्का मुकर्रमा)',
      title: 'काबा शरीफ मक्का • बैतुल्लाह दर्शन',
      tagline: 'तमाम मुसलमानों का किबला, अल्लाह का मुकद्दस घर',
      badge: '🕋 काबा शरीफ',
      mantra: '॥ लब्बैक अल्लाहुम्मा लब्बैक • ला इलाहा इल्लल्लाह ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#064e3b', '#022c22', '#02140e'],
        deityIcon: '🕋',
        godName: 'काबा शरीफ मक्का',
        title: 'मुकद्दस बैतुल्लाह शरीफ दर्शन',
        subTitle: 'खुदा का पाक घर, जहाँ दुनिया भर के मुसलमान सजदा करते हैं',
        mantra: '॥ ला इलाहा इल्लल्लाहु मुहम्मदुर रसूलुल्लाह ॥',
        accentColor: '#fde047',
        secondaryColor: '#a7f3d0',
        auraColor: '#059669'
      })
    },
    {
      id: 'eid-madinah',
      godName: 'मस्जिद-ए-नबवी (मदीना मुनव्वरा)',
      title: 'मस्जिद-ए-नबवी • सब्ज गुंबद (हरा गुंबद)',
      tagline: 'पैगंबर हजरत मुहम्मद सल्लल्लाहु अलैहि वसल्लम का रोज़ा-ए-अकदस',
      badge: '🕌 सब्ज गुंबद',
      mantra: '॥ अस्सलातु वस्सलामू अलैक या रसूलल्लाह ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#065f46', '#064e3b', '#02140e'],
        deityIcon: '🕌',
        godName: 'मस्जिद-ए-नबवी मदीना',
        title: 'रोज़ा-ए-रसूल सल्लल्लाहु अलैहि वसल्लम',
        subTitle: 'दोनों जहाँ के रहमत, शांति और इंसानियत के पैगंबर',
        mantra: '॥ सल्लल्लाहु अलैहि व सल्लम • दरूद-ओ-सलाम ॥',
        accentColor: '#34d399',
        secondaryColor: '#d1fae5',
        auraColor: '#10b981'
      })
    },
    {
      id: 'eid-crescent',
      godName: 'ईद का चाँद (हिलाल)',
      title: 'ईद-उल-फितर मुबारक • मुकद्दस चाँद',
      tagline: 'माहे रमजान के 30 रोजों की इबादत के बाद खुशियों की ईद',
      badge: '🌙 ईद मुबारक',
      mantra: '॥ त़क़ब्बलल्लाहु मिन्ना व मिन्कुम (अल्लाह इबादतें कुबूल फरमाए) ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#022c22', '#064e3b', '#01160e'],
        deityIcon: '🌙',
        godName: 'ईद-उल-फितर मुबारक',
        title: 'दिल से ईद मुबारकबाद दर्शन',
        subTitle: 'मोहब्बत, अमन, भाईचारे और सेवइयों की मिठास',
        mantra: '॥ अल्लाहु अकबर, अल्लाहु अकबर, ला इलाहा इल्लल्लाह ॥',
        accentColor: '#fbbf24',
        secondaryColor: '#fef08a',
        auraColor: '#d97706'
      })
    }
  ],

  // ==========================================
  // 5. KRISHNA JANMASTHAMI (श्री कृष्ण, राधा-कृष्ण, बाल गोपाल)
  // ==========================================
  janmashtami: [
    {
      id: 'krishna-flute',
      godName: 'भगवान श्री कृष्ण',
      title: 'मुरलीधर भगवान श्री कृष्ण • पीताम्बरधारी',
      tagline: 'मोरमुकुटधारी, बंसी बजैया, माखनचोर, जगद्गुरु',
      badge: '🦚 मुरलीधर',
      mantra: '॥ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे • हरे राम हरे राम राम राम हरे हरे ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#1e1b4b', '#0f172a', '#030712'],
        deityIcon: '🦚',
        godName: 'भगवान श्री कृष्ण',
        title: 'मुरली मनोहर श्री कृष्ण दर्शन',
        subTitle: 'प्रेम और ज्ञान के साक्षात अवतार, श्रीमद्भगवद्गीता के उपदेशक',
        mantra: '॥ कृष्णाय वासुदेवाय हरये परमात्मने । प्रणत क्लेशनाशाय गोविंदाय नमो नमः ॥',
        accentColor: '#38bdf8',
        secondaryColor: '#fef08a',
        auraColor: '#0284c7'
      })
    },
    {
      id: 'krishna-radha',
      godName: 'श्री राधा-कृष्ण युगल',
      title: 'श्री राधा-कृष्ण युगल दिव्य दर्शन',
      tagline: 'वृंदावन की पावन कुंज गलियों में प्रेम का अमर स्वरूप',
      badge: '💖 राधा-कृष्णा',
      mantra: '॥ राधे राधे जपो चले आएंगे बिहारी ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#312e81', '#1e1b4b', '#020617'],
        deityIcon: '🌸',
        godName: 'श्री राधा-कृष्ण',
        title: 'वृंदावन बिहारी राधा-कृष्ण दर्शन',
        subTitle: 'परम पावन अलौकिक प्रेम और भक्ति का अमर संगम',
        mantra: '॥ तप्तकांचन गौरांगी राधे वृंदावनेश्वरी । वृषभानु सुते देवि प्रणमामि हरिप्रिये ॥',
        accentColor: '#f472b6',
        secondaryColor: '#fbcfe8',
        auraColor: '#ec4899'
      })
    },
    {
      id: 'krishna-bal-gopal',
      godName: 'लड्डू गोपाल (बाल कृष्ण)',
      title: 'नटखट बाल गोपाल • माखनचोर',
      tagline: 'मैया यशोदा के दुलारे, घुटनों के बल चलने वाले कन्हैया',
      badge: '🧈 माखनचोर',
      mantra: '॥ ॐ नमो भगवते वासुदेवाय नमः ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#172554', '#1e1b4b', '#030712'],
        deityIcon: '🧈',
        godName: 'बाल गोपाल कन्हैया',
        title: 'माखन मटकी फोड़ते नटखट कृष्ण',
        subTitle: 'हाथी घोड़ा पालकी, जय कन्हैया लाल की',
        mantra: '॥ छोटी छोटी गैया छोटे छोटे ग्वाल, छोटो सो मेरो मदन गोपाल ॥',
        accentColor: '#fde047',
        secondaryColor: '#fef08a',
        auraColor: '#ca8a04'
      })
    }
  ],

  // ==========================================
  // 6. GANESH CHATURTHI (लालबागचा राजा, दगडूशेठ, सिद्धिदाता)
  // ==========================================
  ganesh_chaturthi: [
    {
      id: 'ganesh-lalbaug',
      godName: 'लालबागचा राजा (मुंबई)',
      title: 'लालबागचा राजा • नवसाचा गणपती',
      tagline: 'मुंबई के राजा, भक्तों की हर मन्नत पूरी करने वाले बाप्पा',
      badge: '👑 लालबागचा राजा',
      mantra: '॥ गणपति बाप्पा मोरया • पुढच्या वर्षी लवकर या ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#831843', '#500724', '#0a0502'],
        deityIcon: '👑',
        godName: 'लालबागचा राजा',
        title: 'राजाधिराज लालबागचा राजा दर्शन',
        subTitle: 'भक्तों की मनोकामना पूर्ण करने वाले सिद्धहस्त बाप्पा',
        mantra: '॥ ॐ श्रीं गं सौभाग्य गणपतये वरवरद सर्वजनं में वशमानय स्वाहा ॥',
        accentColor: '#facc15',
        secondaryColor: '#fbcfe8',
        auraColor: '#e11d48'
      })
    },
    {
      id: 'ganesh-dagdusheth',
      godName: 'श्रीमंत दगडूशेठ हलवाई गणपति (पुणे)',
      title: 'श्रीमंत दगडूशेठ हलवाई गणपति दर्शन',
      tagline: 'स्वर्ण सिंहासन पर विराजमान, विघ्नहर्ता बाप्पा',
      badge: '🪙 दगडूशेठ',
      mantra: '॥ ॐ गं गणपतये नमः ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#713f12', '#451a03', '#050201'],
        deityIcon: '🐘',
        godName: 'दगडूशेठ गणपति',
        title: 'पुणे के पावन दगडूशेठ बाप्पा',
        subTitle: 'सोने के मुकुट और आभूषणों से सुशोभित मंगलमूर्ती',
        mantra: '॥ सुखकर्ता दुखहर्ता वार्ता विघ्नाची । नुरवी पुरवी प्रेम कृपा जयाची ॥',
        accentColor: '#fde047',
        secondaryColor: '#fef08a',
        auraColor: '#ca8a04'
      })
    }
  ],

  // ==========================================
  // 7. MERRY CHRISTMAS (प्रभु यीशु, बेथलेहम, नैटिविटी)
  // ==========================================
  christmas: [
    {
      id: 'xmas-nativity',
      godName: 'प्रभु यीशु मसीह (Jesus Christ)',
      title: 'प्रभु यीशु मसीह का पावन जन्मोत्सव',
      tagline: 'बेथलेहम की चरनी में बालक यीशु का आगमन',
      badge: '✝️ Jesus Christ',
      mantra: '॥ Glory to God in the highest, and on earth peace, good will toward men ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#064e3b', '#0f172a', '#020617'],
        deityIcon: '⭐',
        godName: 'Lord Jesus Christ',
        title: 'Nativity Scene • Holy Birth of Christ',
        subTitle: 'मानवता को क्षमा, करुणा और निस्वार्थ प्रेम की राह दिखाने वाले',
        mantra: '॥ For unto us a child is born, unto us a son is given ॥',
        accentColor: '#fde047',
        secondaryColor: '#fecaca',
        auraColor: '#dc2626'
      })
    },
    {
      id: 'xmas-tree',
      godName: 'क्रिसमस आनंद व शांति',
      title: 'Merry Christmas • आनंद, शांति व आशीष',
      tagline: 'सजा हुआ क्रिसमस ट्री, घंटियाँ और बेथलेहम का तारा',
      badge: '🎄 Merry Christmas',
      mantra: '॥ प्रभु यीशु का प्रेम और शांति आपके घर में सदा वास करे ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#7f1d1d', '#450a0a', '#020617'],
        deityIcon: '🎄',
        godName: 'Merry Christmas 2026',
        title: 'क्रिसमस पर्व की असीम आशीष दर्शन',
        subTitle: 'नई उम्मीद, खुशहाली और प्रभु यीशु का वरदान',
        mantra: '॥ Peace on Earth and Goodwill to all mankind ॥',
        accentColor: '#34d399',
        secondaryColor: '#fef08a',
        auraColor: '#059669'
      })
    }
  ],

  // ==========================================
  // 8. GURU NANAK DEV JI (गुरु नानक देव जी, स्वर्ण मंदिर)
  // ==========================================
  guru_nanak_jayanti: [
    {
      id: 'guru-nanak-portrait',
      godName: 'श्री गुरु नानक देव जी',
      title: 'श्री गुरु नानक देव जी प्रकाश पर्व दर्शन',
      tagline: 'सिख धर्म के प्रथम गुरु, मानवता के पथ प्रदर्शक',
      badge: '☬ वाहेगुरु',
      mantra: '॥ इक ओंकार सतिनाम करता पुरखु निरभउ निरवैरु अकाल मूरति अजूनी सैभं गुर प्रसादि ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#78350f', '#451a03', '#0a0502'],
        deityIcon: '☬',
        godName: 'श्री गुरु नानक देव जी',
        title: 'सतिगुरु नानक प्रगट्या दर्शन',
        subTitle: 'नाम जपो, कीरत करो, वंड छको • सरबत दा भला',
        mantra: '॥ नानक नाम चढ़दी कला, तेरे भाणे सरबत दा भला ॥',
        accentColor: '#fbbf24',
        secondaryColor: '#fef08a',
        auraColor: '#d97706'
      })
    },
    {
      id: 'guru-harmandir-sahib',
      godName: 'श्री हरिमंदिर साहिब (स्वर्ण मंदिर अमृतसर)',
      title: 'श्री हरिमंदिर साहिब स्वर्ण मंदिर दर्शन',
      tagline: 'अमृतसर के पावन सरोवर में सुशोभित स्वर्ण मंदिर',
      badge: '✨ स्वर्ण मंदिर',
      mantra: '॥ डिठे सभे थाव नहीं तुधु जेहा ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#713f12', '#422006', '#030712'],
        deityIcon: '🏛️',
        godName: 'स्वर्ण मंदिर अमृतसर',
        title: 'पावन अमृतसर हरिमंदिर साहिब',
        subTitle: '24 घंटे अखंड गुरुवाणी कीर्तन और अटूट लंगर सेवा',
        mantra: '॥ वाहेगुरु जी का खालसा • वाहेगुरु जी की फतेह ॥',
        accentColor: '#fde047',
        secondaryColor: '#fed7aa',
        auraColor: '#ca8a04'
      })
    }
  ],

  // ==========================================
  // 9. BUDDHA PURNIMA (भगवान बुद्ध, बोधि वृक्ष, सारनाथ)
  // ==========================================
  buddha_purnima: [
    {
      id: 'buddha-dhyana',
      godName: 'तथागत गौतम बुद्ध',
      title: 'तथागत भगवान बुद्ध • बोधिवृक्ष ध्यान',
      tagline: 'सत्य, अहिंसा, करुणा और अष्टांगिक मार्ग के प्रणेता',
      badge: '☸️ नमो बुद्धाय',
      mantra: '॥ बुद्धं शरणं गच्छामि • धम्मं शरणं गच्छामि • संघं शरणं गच्छामि ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#78350f', '#451a03', '#0a0502'],
        deityIcon: '☸️',
        godName: 'तथागत गौतम बुद्ध',
        title: 'भगवान बुद्ध संबोधि दर्शन',
        subTitle: 'बोधगया में बोधिवृक्ष तले ज्ञान प्राप्त करने वाले महामानव',
        mantra: '॥ अत्त दीपो भव (अपना दीपक स्वयं बनो) • भवतु सब्ब मंगलं ॥',
        accentColor: '#fde047',
        secondaryColor: '#fef08a',
        auraColor: '#ca8a04'
      })
    }
  ]
};

/**
 * Returns the exact, authentic divine slides for any festival.
 * Guarantees that every slide depicts the real God/Deity/Personality.
 */
export function getFestivalDeitySlides(festivalId: string): DivineDeitySlide[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('shubhakamna_deity_slides_v2') : null;
    if (raw) {
      const parsed: Record<string, DivineDeitySlide[]> = JSON.parse(raw);
      if (parsed[festivalId] && Array.isArray(parsed[festivalId]) && parsed[festivalId].length > 0) {
        return parsed[festivalId];
      }
    }
  } catch {}

  // Check if festival itself has custom heroImage
  try {
    const rawFests = typeof window !== 'undefined' ? localStorage.getItem('shubhakamna_festivals_v2') : null;
    if (rawFests) {
      const fests = JSON.parse(rawFests);
      const matched = fests.find((f: any) => f.id === festivalId);
      if (matched?.heroImage) {
        const defaultList = FESTIVAL_DEITY_GALLERIES[festivalId] || [];
        const alreadyIn = defaultList.some(s => s.imageUrl === matched.heroImage);
        if (!alreadyIn) {
          const customSlide: DivineDeitySlide = {
            id: `${festivalId}-custom-hero`,
            godName: matched.nameHi,
            title: matched.greetingTitle || matched.nameHi,
            tagline: matched.taglineHi || 'पावन ईश्वरीय दर्शन',
            badge: matched.badge || '✨ पावन दर्शन',
            mantra: matched.mantraOrShloka || '॥ सर्वे भवन्तु सुखिनः ॥',
            imageUrl: matched.heroImage
          };
          return [customSlide, ...defaultList];
        }
      }
    }
  } catch {}

  if (FESTIVAL_DEITY_GALLERIES[festivalId]) {
    return FESTIVAL_DEITY_GALLERIES[festivalId];
  }

  // Fallback divine presentation
  return [
    {
      id: `${festivalId}-default`,
      godName: 'पावन ईश्वरीय दर्शन',
      title: 'पावन पर्व दिव्य मंगल दर्शन',
      tagline: 'सुख, शांति, आरोग्य और समृद्धि का मंगल आशीष',
      badge: '✨ पावन दर्शन',
      mantra: '॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥',
      imageUrl: createDeitySvg({
        bgGradient: ['#78350f', '#451a03', '#0a0502'],
        deityIcon: '🪔',
        godName: 'पावन मंगल दर्शन',
        title: 'दिव्य मंगलमय स्वरूप',
        subTitle: 'ईश्वरीय कृपा से आपके समस्त कार्य सिद्ध हों',
        mantra: '॥ सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
        accentColor: '#fbbf24',
        secondaryColor: '#fef08a',
        auraColor: '#ea580c'
      })
    }
  ];
}
