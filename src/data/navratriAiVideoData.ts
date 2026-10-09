/**
 * Google Drive Navratri Video Status Data
 * Linked to user folder: https://drive.google.com/drive/folders/1dL-DIerxdYCohbD4L9V6I2hY8dOymgys
 */

export interface NavratriAiVideoItem {
  id: string;
  number: number;
  title: string;
  titleEn: string;
  avatarOrScene: string;
  dayBadge: string;
  aiPromptConcept: string;
  imageUrl: string;
  videoDriveUrl?: string;
  defaultShloka: string;
  defaultBlessing: string;
  motionStyle: 'blessing_descent' | 'trishul_energy' | 'lion_prowl' | 'halo_spin' | 'temple_3d' | 'akhand_flame' | 'lotus_shower' | 'garba_glow' | 'cosmic_rays' | 'sindoor_divine';
  cameraMovement: string;
  defaultMusicTrack: 'navratri_aarti' | 'shankh_bells' | 'dhak_dhol' | 'chandi_stuti' | 'divine_flute';
  themeColor: {
    from: string;
    via: string;
    to: string;
    border: string;
    glow: string;
    accent: string;
  };
}

export type VideoCategoryType = 'navratri';

export interface VideoCategoryMeta {
  id: VideoCategoryType;
  nameHi: string;
  nameEn: string;
  icon: string;
  badge: string;
  description: string;
  count: number;
}

export const VIDEO_STATUS_CATEGORIES: VideoCategoryMeta[] = [
  {
    id: 'navratri',
    nameHi: 'गूगल ड्राइव नवरात्रि वीडियो स्टेटस',
    nameEn: 'Google Drive Navratri Statuses',
    icon: '🌺',
    badge: 'Google Drive 1dL-DIerxdYCohbD4L9V6I2hY8dOymgys',
    description: 'गूगल ड्राइव से सीधे फेच किए गए 9:16 नवरात्रि WhatsApp वीडियो स्टेटस (अपना नाम, फोटो व शुभकामनाएं जोड़ें)',
    count: 10
  }
];

export const GOOGLE_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1dL-DIerxdYCohbD4L9V6I2hY8dOymgys';

export const NAVRATRI_GOOGLE_DRIVE_VIDEOS: NavratriAiVideoItem[] = [
  {
    id: 'gdrive-navratri-1',
    number: 1,
    title: 'गूगल ड्राइव नवरात्रि वीडियो स्टेटस #1 • माँ दुर्गा का पावन आगमन व आशीर्वाद',
    titleEn: 'Google Drive Navratri Status #1 - Maa Durga Divine Blessing',
    avatarOrScene: 'माँ दुर्गा आगमन',
    dayBadge: 'ड्राइव 9:16 HD',
    aiPromptConcept: 'Google Drive folder 1dL-DIerxdYCohbD4L9V6I2hY8dOymgys video #1 with custom devotee name and photo upload.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1HE5DaiYEcjYhw2V8qw6bmBhTkkYZvgN8',
    videoDriveUrl: GOOGLE_DRIVE_FOLDER_URL,
    defaultShloka: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥',
    defaultBlessing: 'माँ जगदम्बा की असीम अनुकंपा से आपके घर-आँगन में सुख, शांति, समृद्धि और सुरक्षा का वास हो।',
    motionStyle: 'blessing_descent',
    cameraMovement: 'Slow Majestic Zoom',
    defaultMusicTrack: 'navratri_aarti',
    themeColor: {
      from: 'from-amber-950',
      via: 'via-red-900',
      to: 'to-stone-950',
      border: 'border-amber-500/50',
      glow: 'shadow-amber-500/30',
      accent: 'text-amber-300'
    }
  },
  {
    id: 'gdrive-navratri-2',
    number: 2,
    title: 'गूगल ड्राइव नवरात्रि वीडियो स्टेटस #2 • माँ शेरावाली दरबार व सिंह सवारी',
    titleEn: 'Google Drive Navratri Status #2 - Maa Sherawali Darbar',
    avatarOrScene: 'सिंहवाहिनी शेरावाली',
    dayBadge: 'ड्राइव 9:16 HD',
    aiPromptConcept: 'Google Drive folder 1dL-DIerxdYCohbD4L9V6I2hY8dOymgys video #2 with customized name, photo and greeting.',
    imageUrl: 'https://lh3.googleusercontent.com/d/14Dm5wG-IjjHq8SPRBHui25iD5bBIZw9n',
    videoDriveUrl: GOOGLE_DRIVE_FOLDER_URL,
    defaultShloka: 'या देवी सर्वभूतेषु शक्ति-रूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥',
    defaultBlessing: 'माँ शेरावाली का अभय वरदान सदा आपके सिर पर रहे। जय माता दी!',
    motionStyle: 'lion_prowl',
    cameraMovement: 'Dynamic Orbiting',
    defaultMusicTrack: 'shankh_bells',
    themeColor: {
      from: 'from-red-950',
      via: 'via-rose-900',
      to: 'to-stone-950',
      border: 'border-red-500/50',
      glow: 'shadow-red-500/30',
      accent: 'text-red-300'
    }
  },
  {
    id: 'gdrive-navratri-3',
    number: 3,
    title: 'गूगल ड्राइव नवरात्रि वीडियो स्टेटस #3 • महिषासुर मर्दिनी त्रिशूल गर्जना',
    titleEn: 'Google Drive Navratri Status #3 - Trishul Energy Roar',
    avatarOrScene: 'त्रिशूल गर्जना',
    dayBadge: 'ड्राइव 9:16 HD',
    aiPromptConcept: 'Google Drive folder 1dL-DIerxdYCohbD4L9V6I2hY8dOymgys video #3 with personalized devotee badge and Wish.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1YwfORoaFA6SlJyvLmjupNr2OoNOd9upa',
    videoDriveUrl: GOOGLE_DRIVE_FOLDER_URL,
    defaultShloka: 'अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दनुते । गिरिवरविन्ध्यशिरोधिनिवासिनि विष्णुविलासिनि जिष्णुनुते ॥',
    defaultBlessing: 'माँ महिषासुरमर्दिनी आपके जीवन के समस्त शत्रुओं और बाधाओं का नाश करें।',
    motionStyle: 'trishul_energy',
    cameraMovement: 'Fast Flare Zoom',
    defaultMusicTrack: 'chandi_stuti',
    themeColor: {
      from: 'from-orange-950',
      via: 'via-amber-900',
      to: 'to-stone-950',
      border: 'border-yellow-500/50',
      glow: 'shadow-yellow-500/30',
      accent: 'text-yellow-300'
    }
  },
  {
    id: 'gdrive-navratri-4',
    number: 4,
    title: 'गूगल ड्राइव नवरात्रि वीडियो स्टेटस #4 • माँ शैलपुत्री प्रथम स्वरूप',
    titleEn: 'Google Drive Navratri Status #4 - Maa Shailputri',
    avatarOrScene: '१. माँ शैलपुत्री',
    dayBadge: 'ड्राइव 9:16 HD',
    aiPromptConcept: 'Google Drive folder 1dL-DIerxdYCohbD4L9V6I2hY8dOymgys video #4.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1ZN45FdrByf_p2C7y0aLb0UaZlGuGOATb',
    videoDriveUrl: GOOGLE_DRIVE_FOLDER_URL,
    defaultShloka: 'वन्दे वाञ्छितलाभाय चन्द्रार्धकृतशेखराम् । वृषारूढां शूलधरां शैलपुत्रीं यशस्विनीम् ॥',
    defaultBlessing: 'नवरात्रि के प्रथम दिन माँ शैलपुत्री आपके जीवन में स्थिरता, आरोग्य और असीम आत्मबल प्रदान करें।',
    motionStyle: 'blessing_descent',
    cameraMovement: 'Gentle Floating Sunrise Zoom',
    defaultMusicTrack: 'shankh_bells',
    themeColor: {
      from: 'from-amber-950',
      via: 'via-yellow-900',
      to: 'to-stone-950',
      border: 'border-amber-400/50',
      glow: 'shadow-amber-400/25',
      accent: 'text-amber-200'
    }
  },
  {
    id: 'gdrive-navratri-5',
    number: 5,
    title: 'गूगल ड्राइव नवरात्रि वीडियो स्टेटस #5 • माँ स्कंदमाता वात्सल्य आशीष',
    titleEn: 'Google Drive Navratri Status #5 - Maa Skandamata',
    avatarOrScene: '५. माँ स्कंदमाता',
    dayBadge: 'ड्राइव 9:16 HD',
    aiPromptConcept: 'Google Drive folder 1dL-DIerxdYCohbD4L9V6I2hY8dOymgys video #5.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1pQEDqCMEboeXJQGTlqj8fH2TenKbEr9s',
    videoDriveUrl: GOOGLE_DRIVE_FOLDER_URL,
    defaultShloka: 'सिंहासनगता नित्यं पद्माश्रितकरद्वया । शुभदास्तु सदा देवी स्कन्दमाता यशस्विनी ॥',
    defaultBlessing: 'माँ स्कंदमाता की ममतामयी गोद आपके पूरे परिवार को समस्त रोगों और संकटों से सुरक्षित रखे।',
    motionStyle: 'lotus_shower',
    cameraMovement: 'Gentle Motherly Cradle Zoom',
    defaultMusicTrack: 'divine_flute',
    themeColor: {
      from: 'from-blue-950',
      via: 'via-sky-900',
      to: 'to-stone-950',
      border: 'border-sky-400/50',
      glow: 'shadow-sky-500/25',
      accent: 'text-sky-200'
    }
  },
  {
    id: 'gdrive-navratri-6',
    number: 6,
    title: 'गूगल ड्राइव नवरात्रि वीडियो स्टेटस #6 • महाआरती व स्वर्ण गर्भगृह',
    titleEn: 'Google Drive Navratri Status #6 - Grand Aarti Darshan',
    avatarOrScene: 'स्वर्ण गर्भगृह महाआरती',
    dayBadge: 'ड्राइव 9:16 HD',
    aiPromptConcept: 'Google Drive folder 1dL-DIerxdYCohbD4L9V6I2hY8dOymgys video #6.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1xtawaEf-WEXwxe4JyJSDlTer8ESLI9Sa',
    videoDriveUrl: GOOGLE_DRIVE_FOLDER_URL,
    defaultShloka: 'कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम् । सदावसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥',
    defaultBlessing: 'माँ दुर्गा की पावन महाआरती का पावन प्रकाश आपके घर-परिवार के प्रत्येक कोने को आलोकित करे।',
    motionStyle: 'temple_3d',
    cameraMovement: 'Gliding Through Floating Diyas to Sanctum',
    defaultMusicTrack: 'navratri_aarti',
    themeColor: {
      from: 'from-amber-950',
      via: 'via-stone-900',
      to: 'to-stone-950',
      border: 'border-yellow-500/60',
      glow: 'shadow-yellow-500/35',
      accent: 'text-yellow-300'
    }
  },
  {
    id: 'gdrive-navratri-7',
    number: 7,
    title: 'गूगल ड्राइव नवरात्रि वीडियो स्टेटस #7 • अखंड ज्योति एवं घटस्थापना',
    titleEn: 'Google Drive Navratri Status #7 - Akhand Jyoti',
    avatarOrScene: 'अखंड ज्योति कलश',
    dayBadge: 'ड्राइव 9:16 HD',
    aiPromptConcept: 'Google Drive folder 1dL-DIerxdYCohbD4L9V6I2hY8dOymgys video #7.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1oxENTurES2DIHgqBrWuDfv9aodX4IkJ4',
    videoDriveUrl: GOOGLE_DRIVE_FOLDER_URL,
    defaultShloka: 'दीपो ज्योतिः परं ब्रह्म दीपो ज्योतिर्जनार्दनः । दीपो हरतु मे पापं संध्यादीप नमोऽस्तु ते ॥',
    defaultBlessing: 'नवरात्रि की अखंड ज्योति आपके जीवन के समस्त अंधेरे को मिटाकर आशा और सफलता का प्रकाश फैलाए।',
    motionStyle: 'akhand_flame',
    cameraMovement: 'Macro Zoom into Pulsing Divine Flame Heart',
    defaultMusicTrack: 'navratri_aarti',
    themeColor: {
      from: 'from-amber-950',
      via: 'via-red-950',
      to: 'to-stone-950',
      border: 'border-amber-500/50',
      glow: 'shadow-amber-500/30',
      accent: 'text-amber-300'
    }
  }
];
