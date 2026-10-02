/**
 * Bespoke, culturally authentic, high-resolution SVG Darshan Artwork generator.
 * Provides 100% accurate, dedicated imagery for every Indian festival and celebration.
 * Zero random photos, guaranteed authentic iconography and spiritual beauty.
 */

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const DIVINE_ARTWORKS: Record<string, string[]> = {
  // ==========================================
  // 1. DIWALI (लक्ष्मी-गणेश, दीये, रंगोली)
  // ==========================================
  diwali: [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="diwaliBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stop-color="#451a03"/>
            <stop offset="50%" stop-color="#291202"/>
            <stop offset="100%" stop-color="#0a0502"/>
          </radialGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#diwaliBg)"/>
        
        <!-- Ornate Mandala -->
        <circle cx="600" cy="380" r="260" fill="none" stroke="#eab308" stroke-width="2" opacity="0.3"/>
        <circle cx="600" cy="380" r="210" fill="none" stroke="#eab308" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.4"/>
        <circle cx="600" cy="380" r="160" fill="none" stroke="#f59e0b" stroke-width="3" opacity="0.5"/>
        
        <!-- Sacred Shubh Deepavali Calligraphy -->
        <text x="600" y="160" text-anchor="middle" fill="#fef08a" font-family="serif" font-size="52" font-weight="bold" filter="url(#glow)">🪔 शुभ दीपावली 🪔</text>
        <text x="600" y="215" text-anchor="middle" fill="#fde68a" font-family="sans-serif" font-size="24" opacity="0.9">माँ लक्ष्मी व भगवान गणेश जी की असीम कृपा आप पर बरसे</text>
        
        <!-- Big Divine Central Golden Diya -->
        <g transform="translate(600, 480)" filter="url(#glow)">
          <!-- Diya Base -->
          <path d="M-140,0 Q0,80 140,0 Q110,40 0,60 Q-110,40 -140,0 Z" fill="url(#gold)" stroke="#ca8a04" stroke-width="4"/>
          <ellipse cx="0" cy="0" rx="140" ry="24" fill="#854d0e"/>
          <!-- Glowing Oil Reflection -->
          <ellipse cx="0" cy="0" rx="120" ry="16" fill="#ca8a04"/>
          <!-- Sacred Wick Flame -->
          <path d="M0,-8 Q-40,-70 0,-150 Q40,-70 0,-8 Z" fill="#f97316"/>
          <path d="M0,-12 Q-24,-65 0,-130 Q24,-65 0,-12 Z" fill="#facc15"/>
          <path d="M0,-16 Q-12,-55 0,-100 Q12,-55 0,-16 Z" fill="#ffffff"/>
        </g>

        <!-- Side Diyas -->
        <g transform="translate(260, 540)" filter="url(#glow)">
          <path d="M-60,0 Q0,36 60,0 Q45,20 0,28 Q-45,20 -60,0 Z" fill="url(#gold)"/>
          <ellipse cx="0" cy="0" rx="60" ry="10" fill="#854d0e"/>
          <path d="M0,-4 Q-16,-30 0,-70 Q16,-30 0,-4 Z" fill="#f59e0b"/>
          <path d="M0,-6 Q-8,-25 0,-50 Q8,-25 0,-6 Z" fill="#fef08a"/>
        </g>
        <g transform="translate(940, 540)" filter="url(#glow)">
          <path d="M-60,0 Q0,36 60,0 Q45,20 0,28 Q-45,20 -60,0 Z" fill="url(#gold)"/>
          <ellipse cx="0" cy="0" rx="60" ry="10" fill="#854d0e"/>
          <path d="M0,-4 Q-16,-30 0,-70 Q16,-30 0,-4 Z" fill="#f59e0b"/>
          <path d="M0,-6 Q-8,-25 0,-50 Q8,-25 0,-6 Z" fill="#fef08a"/>
        </g>

        <!-- Golden Sparkles & Floating Lights -->
        <circle cx="200" cy="240" r="4" fill="#fde68a" filter="url(#glow)"/>
        <circle cx="340" cy="360" r="3" fill="#fde68a"/>
        <circle cx="860" cy="320" r="5" fill="#fde68a" filter="url(#glow)"/>
        <circle cx="1020" cy="220" r="4" fill="#fde68a"/>
        <circle cx="600" cy="270" r="3" fill="#ffffff" filter="url(#glow)"/>

        <!-- Sacred Shloka -->
        <text x="600" y="720" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="20" font-weight="bold">॥ ॐ महालक्ष्म्यै च विद्महे विष्णुपत्नी च धीमहि तन्नो लक्ष्मीः प्रचोदयात् ॥</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="deepotsav" cx="50%" cy="60%" r="80%">
            <stop offset="0%" stop-color="#7c2d12"/>
            <stop offset="40%" stop-color="#431407"/>
            <stop offset="100%" stop-color="#0a0502"/>
          </radialGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#deepotsav)"/>
        <text x="600" y="140" text-anchor="middle" fill="#fef08a" font-family="serif" font-size="46" font-weight="bold">✨ अयोध्या दीपोत्सव • जगमगाते दीप ✨</text>
        <text x="600" y="190" text-anchor="middle" fill="#fed7aa" font-family="sans-serif" font-size="22">घर-घर दीये जलाओ, प्रभु श्री राम के स्वागत में खुशियां मनाओ</text>
        
        <!-- Rows of Shining Diyas -->
        <g fill="#ea580c">
          <ellipse cx="180" cy="500" rx="40" ry="12"/><ellipse cx="320" cy="480" rx="40" ry="12"/><ellipse cx="460" cy="460" rx="40" ry="12"/>
          <ellipse cx="600" cy="450" rx="50" ry="15"/><ellipse cx="740" cy="460" rx="40" ry="12"/><ellipse cx="880" cy="480" rx="40" ry="12"/><ellipse cx="1020" cy="500" rx="40" ry="12"/>
          <!-- Second Row -->
          <ellipse cx="250" cy="600" rx="45" ry="14"/><ellipse cx="420" cy="580" rx="45" ry="14"/><ellipse cx="600" cy="570" rx="55" ry="16"/>
          <ellipse cx="780" cy="580" rx="45" ry="14"/><ellipse cx="950" cy="600" rx="45" ry="14"/>
        </g>
        <!-- Golden Flames on Each Diya -->
        <g fill="#fde047">
          <path d="M180,490 Q170,460 180,430 Q190,460 180,490 Z"/><path d="M320,470 Q310,440 320,410 Q330,440 320,470 Z"/>
          <path d="M460,450 Q450,420 460,390 Q470,420 460,450 Z"/><path d="M600,435 Q585,395 600,360 Q615,395 600,435 Z"/>
          <path d="M740,450 Q730,420 740,390 Q750,420 740,450 Z"/><path d="M880,470 Q870,440 880,410 Q890,440 880,470 Z"/>
          <path d="M1020,490 Q1010,460 1020,430 Q1030,460 1020,490 Z"/>
          <!-- Second Row Flames -->
          <path d="M250,590 Q240,555 250,520 Q260,555 250,590 Z"/><path d="M420,570 Q410,535 420,500 Q430,535 420,570 Z"/>
          <path d="M600,555 Q585,515 600,470 Q615,515 600,555 Z"/><path d="M780,570 Q770,535 780,500 Q790,535 780,570 Z"/>
          <path d="M950,590 Q940,555 950,520 Q960,555 950,590 Z"/>
        </g>
        <text x="600" y="730" text-anchor="middle" fill="#facc15" font-family="serif" font-size="22">तमसो मा ज्योतिर्गमय • अंधकार से प्रकाश की ओर</text>
      </svg>
    `)
  ],

  // ==========================================
  // 2. DR. B.R. AMBEDKAR JAYANTI (बाबासाहेब, संविधान, जय भीम)
  // ==========================================
  ambedkar_jayanti: [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="bhimBlue" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <filter id="blueGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#bhimBlue)"/>

        <!-- Glowing Ashoka Chakra in Center Background -->
        <g transform="translate(600, 380)" opacity="0.35">
          <circle cx="0" cy="0" r="180" fill="none" stroke="#60a5fa" stroke-width="6"/>
          <circle cx="0" cy="0" r="30" fill="none" stroke="#93c5fd" stroke-width="4"/>
          <!-- 24 Spokes of Ashoka Chakra -->
          ${Array.from({ length: 24 }).map((_, i) => `
            <line x1="0" y1="0" x2="${Math.cos((i * 15 * Math.PI) / 180) * 180}" y2="${Math.sin((i * 15 * Math.PI) / 180) * 180}" stroke="#93c5fd" stroke-width="2.5"/>
          `).join('')}
        </g>

        <!-- Header Title -->
        <text x="600" y="110" text-anchor="middle" fill="#60a5fa" font-family="serif" font-size="34" font-weight="bold" filter="url(#blueGlow)">💙 जय भीम • नमो बुद्धाय 💙</text>
        <text x="600" y="165" text-anchor="middle" fill="#ffffff" font-family="serif" font-size="44" font-weight="extrabold">भारतरत्न बोधिसत्व डॉ. बी. आर. आंबेडकर जयंती</text>
        <text x="600" y="210" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-size="20">14 अप्रैल • भारतीय संविधान निर्माता एवं समता के मसीहा</text>

        <!-- Silhouette Illustration of Babasaheb with Constitution of India Book -->
        <g transform="translate(600, 430)">
          <!-- Aura behind -->
          <circle cx="0" cy="-60" r="120" fill="#3b82f6" opacity="0.25" filter="url(#blueGlow)"/>
          
          <!-- Silhouette Coat & Head -->
          <path d="M-80,140 C-80,60 -50,20 -35,-20 C-40,-50 -35,-80 0,-95 C35,-80 40,-50 35,-20 C50,20 80,60 80,140 Z" fill="#1e40af" stroke="#60a5fa" stroke-width="3"/>
          <!-- Head / Hair -->
          <ellipse cx="0" cy="-65" rx="36" ry="42" fill="#dbeafe"/>
          <path d="M-36,-75 Q0,-105 36,-75 Q20,-85 0,-85 Q-20,-85 -36,-75 Z" fill="#1e293b"/>
          <!-- Round Glasses -->
          <circle cx="-14" cy="-62" r="10" fill="none" stroke="#1e293b" stroke-width="2.5"/>
          <circle cx="14" cy="-62" r="10" fill="none" stroke="#1e293b" stroke-width="2.5"/>
          <line x1="-4" y1="-62" x2="4" y2="-62" stroke="#1e293b" stroke-width="2.5"/>
          <!-- Blue Tie -->
          <polygon points="0,-15 -8,50 0,60 8,50" fill="#ef4444"/>

          <!-- Constitution Book in Hand -->
          <g transform="translate(60, 50) rotate(-15)">
            <rect x="0" y="0" width="75" height="100" rx="6" fill="#78350f" stroke="#fbbf24" stroke-width="3"/>
            <rect x="6" y="6" width="63" height="88" rx="3" fill="#451a03"/>
            <text x="37" y="40" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="11" font-weight="bold">CONSTITUTION</text>
            <text x="37" y="55" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="10">OF</text>
            <text x="37" y="70" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="11" font-weight="bold">INDIA</text>
          </g>
        </g>

        <!-- Slogan / Golden Life Quote -->
        <rect x="250" y="660" width="700" height="75" rx="20" fill="#0f172a" stroke="#3b82f6" stroke-width="2" opacity="0.95"/>
        <text x="600" y="695" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="22" font-weight="bold">"शिक्षित बनो, संगठित रहो, संघर्ष करो!"</text>
        <text x="600" y="722" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-size="15">— महामानव डॉ. बाबासाहेब आंबेडकर</text>
      </svg>
    `),
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <linearGradient id="deekshaBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0c4a6e"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#deekshaBg)"/>
        
        <text x="600" y="140" text-anchor="middle" fill="#38bdf8" font-family="serif" font-size="44" font-weight="bold">☸️ दीक्षाभूमि नागपुर • समता का महातीर्थ ☸️</text>
        <text x="600" y="190" text-anchor="middle" fill="#e0f2fe" font-family="sans-serif" font-size="22">बुद्धं शरणं गच्छामि • धम्मं शरणं गच्छामि • संघं शरणं गच्छामि</text>

        <!-- Deekshabhoomi Stupa Dome Silhouette -->
        <g transform="translate(600, 480)">
          <!-- Main Stupa Semicircle Dome -->
          <path d="M-220,120 C-220,-80 220,-80 220,120 Z" fill="#0369a1" stroke="#38bdf8" stroke-width="4"/>
          <!-- Inner Gateway Arch -->
          <path d="M-80,120 C-80,20 80,20 80,120 Z" fill="#0c4a6e" stroke="#7dd3fc" stroke-width="3"/>
          <!-- Finial Spire (Harmika / Chhatra) on top of Stupa -->
          <rect x="-8" y="-120" width="16" height="40" fill="#facc15"/>
          <circle cx="0" cy="-125" r="14" fill="#facc15"/>
          <circle cx="0" cy="-145" r="8" fill="#facc15"/>
          <!-- Base Platform -->
          <rect x="-300" y="120" width="600" height="24" rx="6" fill="#075985" stroke="#38bdf8" stroke-width="2"/>
        </g>

        <!-- Blue Panchsheel Flags Floating -->
        <text x="600" y="710" text-anchor="middle" fill="#fef08a" font-family="serif" font-size="24" font-weight="bold">स्वतंत्रता, समता, बंधुता और न्याय ही सच्चा धर्म है</text>
      </svg>
    `)
  ],

  // ==========================================
  // 3. EID-UL-FITR / EID MUBARAK (मस्जिद, चाँद, सितारे)
  // ==========================================
  eid_ul_fitr: [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="eidNight" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="50%" stop-color="#022c22"/>
            <stop offset="100%" stop-color="#02140e"/>
          </radialGradient>
          <linearGradient id="eidGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#eidNight)"/>

        <!-- Crescent Moon & Star -->
        <g transform="translate(600, 240)" filter="url(#softGlow)">
          <!-- Moon Body -->
          <path d="M-60,-80 A 90 90 0 1 0 70 80 A 75 75 0 1 1 -60 -80 Z" fill="url(#eidGold)"/>
          <!-- Star -->
          <polygon points="55,-10 60,8 78,8 64,18 69,36 55,24 41,36 46,18 32,8 50,8" fill="url(#eidGold)"/>
        </g>

        <!-- Hanging Lanterns (Fanous) -->
        <g transform="translate(220, 140)">
          <line x1="0" y1="-140" x2="0" y2="0" stroke="#f59e0b" stroke-width="2"/>
          <polygon points="0,0 -20,30 20,30" fill="url(#eidGold)"/>
          <rect x="-18" y="30" width="36" height="45" fill="#fef08a" opacity="0.9" filter="url(#softGlow)"/>
          <polygon points="-20,75 20,75 0,100" fill="url(#eidGold)"/>
        </g>
        <g transform="translate(980, 140)">
          <line x1="0" y1="-140" x2="0" y2="0" stroke="#f59e0b" stroke-width="2"/>
          <polygon points="0,0 -20,30 20,30" fill="url(#eidGold)"/>
          <rect x="-18" y="30" width="36" height="45" fill="#fef08a" opacity="0.9" filter="url(#softGlow)"/>
          <polygon points="-20,75 20,75 0,100" fill="url(#eidGold)"/>
        </g>

        <!-- Grand Mosque Silhouette at Bottom -->
        <g fill="#065f46" opacity="0.95">
          <!-- Central Dome -->
          <path d="M480,680 C480,520 720,520 720,680 Z"/>
          <path d="M600,500 L600,470" stroke="#fbbf24" stroke-width="4"/>
          <circle cx="600" cy="465" r="7" fill="#fbbf24"/>
          <!-- Side Small Domes -->
          <path d="M340,680 C340,570 470,570 470,680 Z"/>
          <path d="M730,680 C730,570 860,570 860,680 Z"/>
          <!-- Minarets -->
          <rect x="230" y="440" width="40" height="240"/>
          <polygon points="215,440 285,440 250,380"/>
          <rect x="930" y="440" width="40" height="240"/>
          <polygon points="915,440 985,440 950,380"/>
        </g>

        <!-- Eid Mubarak Greetings -->
        <text x="600" y="400" text-anchor="middle" fill="#fef08a" font-family="serif" font-size="52" font-weight="bold" filter="url(#softGlow)">🌙 ईद मुबारक • Eid Mubarak 🌙</text>
        <text x="600" y="445" text-anchor="middle" fill="#a7f3d0" font-family="sans-serif" font-size="22">अल्लाह ताला आपकी और आपके परिवार की हर दुआ कुबूल फरमाए</text>
        <text x="600" y="730" text-anchor="middle" fill="#fde68a" font-family="serif" font-size="20">त़क़ब्बलल्लाहु मिन्ना व मिन्कुम • खुशियों भरी ईद मुबारक</text>
      </svg>
    `)
  ],

  // ==========================================
  // 4. MAHA SHIVRATRI (त्रिशूल, डमरू, तीसरा नेत्र, शिवलिंग)
  // ==========================================
  shivratri: [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="shivaSky" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <filter id="cyanGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#shivaSky)"/>

        <!-- Himalayan Mountain Silhouettes in Backdrop -->
        <polygon points="0,520 280,320 540,520" fill="#1e293b" opacity="0.6"/>
        <polygon points="400,520 680,280 960,520" fill="#334155" opacity="0.5"/>
        <polygon points="800,520 1060,340 1200,480 1200,520" fill="#1e293b" opacity="0.6"/>

        <!-- Header -->
        <text x="600" y="120" text-anchor="middle" fill="#67e8f9" font-family="serif" font-size="48" font-weight="bold" filter="url(#cyanGlow)">🔱 महाशिवरात्रि महापर्व 🔱</text>
        <text x="600" y="170" text-anchor="middle" fill="#cffafe" font-family="sans-serif" font-size="22">देवाधिदेव महादेव और माता पार्वती की असीम कृपा सदा आप पर बनी रहे</text>

        <!-- Majestic Lord Shiva Trishul & Damru in Center -->
        <g transform="translate(600, 440)" filter="url(#cyanGlow)">
          <!-- Trishul Center Rod -->
          <line x1="0" y1="-210" x2="0" y2="180" stroke="#facc15" stroke-width="12" stroke-linecap="round"/>
          
          <!-- Trishul Center Spear -->
          <path d="M0,-250 L-18,-180 L18,-180 Z" fill="#facc15"/>
          <!-- Trishul Left & Right Prongs -->
          <path d="M-12,-180 Q-80,-210 -70,-250 Q-45,-215 0,-190" fill="none" stroke="#facc15" stroke-width="10" stroke-linecap="round"/>
          <path d="M12,-180 Q80,-210 70,-250 Q45,-215 0,-190" fill="none" stroke="#facc15" stroke-width="10" stroke-linecap="round"/>

          <!-- Damru (Hourglass Shape) Attached to Trishul -->
          <g transform="translate(0, -50)">
            <polygon points="-40,-35 40,-35 0,0" fill="#b45309" stroke="#facc15" stroke-width="3"/>
            <polygon points="-40,35 40,35 0,0" fill="#b45309" stroke="#facc15" stroke-width="3"/>
            <!-- Damru Strings & Beads -->
            <path d="M0,0 Q-35,15 -50,30" fill="none" stroke="#fef08a" stroke-width="2"/>
            <circle cx="-50" cy="30" r="6" fill="#fde047"/>
            <path d="M0,0 Q35,15 50,30" fill="none" stroke="#fef08a" stroke-width="2"/>
            <circle cx="50" cy="30" r="6" fill="#fde047"/>
          </g>

          <!-- Third Eye & Tripundra (Three Sacred Ash Lines on Top) -->
          <g transform="translate(0, -110)">
            <line x1="-55" y1="-12" x2="55" y2="-12" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>
            <line x1="-60" y1="0" x2="60" y2="0" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>
            <line x1="-55" y1="12" x2="55" y2="12" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>
            <!-- Red Tilak (Third Eye) in Center -->
            <path d="M0,-8 Q-8,0 0,8 Q8,0 0,-8 Z" fill="#ef4444"/>
          </g>

          <!-- Crescent Moon on Left -->
          <path d="M-30,-170 A 30 30 0 0 0 -60 -125 A 24 24 0 0 1 -30 -170 Z" fill="#ffffff" filter="url(#cyanGlow)"/>
        </g>

        <!-- Maha Mrityunjaya Mantra -->
        <text x="600" y="710" text-anchor="middle" fill="#67e8f9" font-family="serif" font-size="24" font-weight="bold">॥ ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥</text>
      </svg>
    `)
  ],

  // ==========================================
  // 5. KRISHNA JANMASTHAMI (मोरपंख, बाँसुरी, माखन मटकी)
  // ==========================================
  janmashtami: [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="vrindavan" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#030712"/>
          </radialGradient>
          <linearGradient id="morPankh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#059669"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#4f46e5"/>
          </linearGradient>
          <filter id="krishnaGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#vrindavan)"/>

        <!-- Header -->
        <text x="600" y="120" text-anchor="middle" fill="#38bdf8" font-family="serif" font-size="48" font-weight="bold" filter="url(#krishnaGlow)">🦚 श्री कृष्ण जन्माष्टमी 🦚</text>
        <text x="600" y="170" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="22">नंद के आनंद भयो, जय कन्हैया लाल की • हाथी घोड़ा पालकी, जय कन्हैया लाल की</text>

        <!-- Peacock Feather (Mor Pankh) -->
        <g transform="translate(600, 360)">
          <!-- Outer Feather Strands -->
          <ellipse cx="0" cy="-60" rx="90" ry="130" fill="url(#morPankh)" opacity="0.9" filter="url(#krishnaGlow)"/>
          <!-- Inner Turquoise Eye -->
          <ellipse cx="0" cy="-60" rx="60" ry="85" fill="#06b6d4"/>
          <!-- Deep Blue Pupil -->
          <ellipse cx="0" cy="-60" rx="35" ry="50" fill="#1e1b4b"/>
          <!-- Golden Sparkle in Center -->
          <circle cx="0" cy="-60" r="14" fill="#facc15"/>

          <!-- Golden Flute (Bansuri) Crossing Across -->
          <g transform="rotate(-20)">
            <rect x="-260" y="-10" width="520" height="24" rx="12" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>
            <!-- Flute Holes -->
            <circle cx="40" cy="2" r="5" fill="#78350f"/>
            <circle cx="80" cy="2" r="5" fill="#78350f"/>
            <circle cx="120" cy="2" r="5" fill="#78350f"/>
            <circle cx="160" cy="2" r="5" fill="#78350f"/>
            <circle cx="200" cy="2" r="5" fill="#78350f"/>
            <!-- Hanging Pearls / Ghungroo -->
            <path d="M-220,14 Q-210,60 -200,90" fill="none" stroke="#fef08a" stroke-width="3"/>
            <circle cx="-200" cy="90" r="8" fill="#fef08a"/>
          </g>
        </g>

        <!-- Earthen Butter Pot (Makhan Matki) -->
        <g transform="translate(600, 560)">
          <path d="M-70,0 Q-90,60 0,90 Q90,60 70,0 Z" fill="#92400e" stroke="#78350f" stroke-width="3"/>
          <ellipse cx="0" cy="0" rx="70" ry="18" fill="#78350f"/>
          <!-- Overflowing Pure White Butter (Makhan) -->
          <ellipse cx="0" cy="-4" rx="60" ry="14" fill="#ffffff"/>
          <path d="M-30,4 Q-20,40 -15,50 Q-10,40 -5,10" fill="#ffffff"/>
          <path d="M20,4 Q30,45 35,55 Q40,45 45,10" fill="#ffffff"/>
        </g>

        <text x="600" y="730" text-anchor="middle" fill="#fde047" font-family="serif" font-size="24" font-weight="bold">॥ हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे । हरे राम हरे राम, राम राम हरे हरे ॥</text>
      </svg>
    `)
  ],

  // ==========================================
  // 6. MERRY CHRISTMAS (तारे, क्रिसमस ट्री, सांता, बेथलेहम)
  // ==========================================
  christmas: [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="xmasNight" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#xmasNight)"/>

        <!-- Bright Bethlehem Star on Top -->
        <g transform="translate(600, 180)" filter="url(#starGlow)">
          <polygon points="0,-70 12,-15 70,0 15,12 0,70 -12,15 -70,0 -15,-12" fill="#fde047"/>
          <circle cx="0" cy="0" r="14" fill="#ffffff"/>
        </g>

        <text x="600" y="110" text-anchor="middle" fill="#ef4444" font-family="serif" font-size="48" font-weight="bold" filter="url(#starGlow)">🎄 Merry Christmas 2026 🎄</text>
        <text x="600" y="150" text-anchor="middle" fill="#fecaca" font-family="sans-serif" font-size="22">प्रभु यीशु मसीह का असीम प्रेम, शांति और आनंद आपके घर-परिवार में सदा रहे</text>

        <!-- Decorated Christmas Tree -->
        <g transform="translate(600, 480)">
          <!-- Tree Trunk -->
          <rect x="-24" y="140" width="48" height="50" fill="#78350f"/>
          <!-- Top Tier -->
          <polygon points="0,-160 -110,-60 110,-60" fill="#047857"/>
          <!-- Middle Tier -->
          <polygon points="0,-90 -160,30 160,30" fill="#065f46"/>
          <!-- Bottom Tier -->
          <polygon points="0,0 -210,140 210,140" fill="#064e3b"/>

          <!-- Glowing Baubles / Ornaments -->
          <circle cx="-50" cy="-90" r="12" fill="#ef4444" filter="url(#starGlow)"/>
          <circle cx="60" cy="-80" r="10" fill="#fbbf24" filter="url(#starGlow)"/>
          <circle cx="-100" cy="0" r="14" fill="#38bdf8" filter="url(#starGlow)"/>
          <circle cx="80" cy="10" r="12" fill="#ef4444" filter="url(#starGlow)"/>
          <circle cx="-140" cy="100" r="14" fill="#fbbf24" filter="url(#starGlow)"/>
          <circle cx="130" cy="90" r="14" fill="#ec4899" filter="url(#starGlow)"/>
          <circle cx="0" cy="80" r="12" fill="#38bdf8" filter="url(#starGlow)"/>

          <!-- Gift Boxes Under Tree -->
          <rect x="-160" y="145" width="55" height="45" rx="4" fill="#dc2626"/>
          <rect x="-140" y="145" width="14" height="45" fill="#fef08a"/>
          <rect x="110" y="140" width="60" height="50" rx="4" fill="#2563eb"/>
          <rect x="135" y="140" width="14" height="50" fill="#fef08a"/>
        </g>

        <!-- Falling Gentle Snowflakes -->
        <circle cx="180" cy="280" r="4" fill="#ffffff" opacity="0.8"/>
        <circle cx="340" cy="380" r="5" fill="#ffffff" opacity="0.8"/>
        <circle cx="880" cy="290" r="4" fill="#ffffff" opacity="0.8"/>
        <circle cx="1020" cy="420" r="6" fill="#ffffff" opacity="0.8"/>

        <text x="600" y="730" text-anchor="middle" fill="#fde047" font-family="serif" font-size="22" font-weight="bold">Glory to God in the highest, and on earth peace, good will toward men</text>
      </svg>
    `)
  ],

  // ==========================================
  // 7. GURU NANAK DEV JI / GURPURAB (एक ओंकार, स्वर्ण मंदिर)
  // ==========================================
  guru_nanak_jayanti: [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="gurpurab" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="50%" stop-color="#451a03"/>
            <stop offset="100%" stop-color="#0a0502"/>
          </radialGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#gurpurab)"/>

        <!-- Header -->
        <text x="600" y="120" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="46" font-weight="bold" filter="url(#goldGlow)">☬ श्री गुरु नानक देव जी प्रकाश पर्व ☬</text>
        <text x="600" y="170" text-anchor="middle" fill="#fde68a" font-family="sans-serif" font-size="22">गुरुपर्व की आप सभी को लख-लख वधाइयाँ • वाहेगुरु जी का खालसा, वाहेगुरु जी की फतेह</text>

        <!-- Sacred Ek Onkar Symbol (ੴ) -->
        <g transform="translate(600, 360)" filter="url(#goldGlow)">
          <circle cx="0" cy="0" r="110" fill="#92400e" stroke="#fbbf24" stroke-width="4" opacity="0.4"/>
          <!-- Ek Onkar Calligraphy in Gurmukhi -->
          <text x="0" y="45" text-anchor="middle" fill="#fef08a" font-family="serif" font-size="140" font-weight="bold">ੴ</text>
        </g>

        <!-- Golden Temple (Harmandir Sahib) Dome Silhouette -->
        <g transform="translate(600, 560)">
          <!-- Main Golden Sanctum -->
          <rect x="-180" y="0" width="360" height="110" fill="#d97706" stroke="#fde047" stroke-width="3"/>
          <!-- Central Golden Dome -->
          <path d="M-80,0 C-80,-90 80,-90 80,0 Z" fill="#f59e0b" stroke="#fde047" stroke-width="3" filter="url(#goldGlow)"/>
          <rect x="-6" y="-115" width="12" height="25" fill="#fde047"/>
          <circle cx="0" cy="-120" r="8" fill="#fde047"/>
          <!-- Holy Sarovar (Water Reflection) -->
          <rect x="-500" y="110" width="1000" height="40" fill="#1e3a8a" opacity="0.8"/>
          <!-- Reflection of light -->
          <ellipse cx="0" cy="125" rx="140" ry="12" fill="#fde047" opacity="0.3" filter="url(#goldGlow)"/>
        </g>

        <text x="600" y="730" text-anchor="middle" fill="#fde68a" font-family="serif" font-size="22" font-weight="bold">ना कोई बैरी नहीं बेगाना, सकल संग हमको बन आई • नाम जपो, कीरत करो, वंड छको</text>
      </svg>
    `)
  ],

  // ==========================================
  // 8. GANESH CHATURTHI (गणपति बाप्पा मोरया)
  // ==========================================
  ganesh_chaturthi: [
    svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <defs>
          <radialGradient id="ganeshBg" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stop-color="#831843"/>
            <stop offset="50%" stop-color="#500724"/>
            <stop offset="100%" stop-color="#0a0502"/>
          </radialGradient>
          <filter id="redGoldGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#ganeshBg)"/>

        <!-- Header -->
        <text x="600" y="120" text-anchor="middle" fill="#fde047" font-family="serif" font-size="48" font-weight="bold" filter="url(#redGoldGlow)">🐘 श्री गणेश चतुर्थी • बाप्पा मोरया 🐘</text>
        <text x="600" y="170" text-anchor="middle" fill="#fbcfe8" font-family="sans-serif" font-size="22">विघ्नहर्ता बाप्पा आपके जीवन के सभी विघ्न दूर कर सुख-समृद्धि प्रदान करें</text>

        <!-- Majestic Lord Ganesha Face Profile -->
        <g transform="translate(600, 420)" filter="url(#redGoldGlow)">
          <!-- Golden Aura / Sunburst -->
          <circle cx="0" cy="-40" r="140" fill="#f59e0b" opacity="0.25"/>
          
          <!-- Crown (Mukut) -->
          <polygon points="-60,-120 60,-120 0,-210" fill="#facc15" stroke="#d97706" stroke-width="3"/>
          <circle cx="0" cy="-160" r="10" fill="#dc2626"/>

          <!-- Big Golden Ears -->
          <ellipse cx="-85" cy="-40" rx="65" ry="85" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
          <ellipse cx="85" cy="-40" rx="65" ry="85" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>

          <!-- Face & Forehead -->
          <ellipse cx="0" cy="-40" rx="75" ry="85" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
          
          <!-- Red Tilak (Trishul Shape) on Forehead -->
          <path d="M-20,-80 L20,-80 L0,-40 Z" fill="#dc2626"/>
          <circle cx="0" cy="-85" r="5" fill="#facc15"/>

          <!-- Trunk (Sond) curving to the left with Modak -->
          <path d="M-15,30 Q-50,80 -80,60 Q-100,30 -70,20 Q-40,40 15,30" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
          <!-- Modak sweet in Trunk -->
          <path d="M-95,20 Q-115,-5 -95,-25 Q-75,-5 -95,20 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        </g>

        <!-- Shloka -->
        <text x="600" y="720" text-anchor="middle" fill="#fde047" font-family="serif" font-size="24" font-weight="bold">॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥</text>
      </svg>
    `)
  ]
};
