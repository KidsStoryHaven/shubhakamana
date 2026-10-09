/**
 * Navratri & Maa Durga 10 Hit 30-Second Ringtone Audio Tracks
 * Each track has a dedicated, real, high-quality 30-second MP3 audio in /audio/
 * with customizable Start Time and Trimmer support for 9:16 Video Status.
 */

export interface NavratriAudioTrack {
  id: string;
  nameHi: string;
  nameEn: string;
  singerOrStyle: string;
  icon: string;
  category: 'aarti' | 'bhajan' | 'garba' | 'stuti' | 'temple';
  audioUrl: string; // Guaranteed real 30s MP3 audio file
  defaultStartSec: number;
  durationSec: number;
  recommendedPartHi: string;
  synthType?: string;
}

export const NAVRATRI_AUDIO_PRESETS: NavratriAudioTrack[] = [
  {
    id: 'navratri_aarti',
    nameHi: '१. जय अम्बे गौरी मैया की आरती',
    nameEn: 'Jai Ambe Gauri Maha Aarti',
    singerOrStyle: 'पारंपरिक संपूर्ण महाआरती (30s रिंगटोन)',
    icon: '🪔',
    category: 'aarti',
    audioUrl: '/audio/navratri-aarti.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'आरती आरंभ • 00:00'
  },
  {
    id: 'chalo_bulawa',
    nameHi: '२. चलो बुलावा आया है माता ने बुलाया है',
    nameEn: 'Chalo Bulawa Aaya Hai',
    singerOrStyle: 'सुपरहिट वैष्णो देवी भेंट (30s रिंगटोन)',
    icon: '🚩',
    category: 'bhajan',
    audioUrl: '/audio/chalo-bulawa-aaya-hai.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'जय माता दी जयघोष • 00:00'
  },
  {
    id: 'aigiri_nandini',
    nameHi: '३. अयि गिरिनंदिनी - महिषासुरमर्दिनी',
    nameEn: 'Aigiri Nandini Rock Trance',
    singerOrStyle: 'शक्ति रॉक / दिव्य स्तोत्र नाद (30s रिंगटोन)',
    icon: '🔱',
    category: 'stuti',
    audioUrl: '/audio/aigiri-nandini-trance.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'चंडी रणभेरी नाद • 00:00'
  },
  {
    id: 'dholida_garba',
    nameHi: '४. ढोलीड़ा ढोल रे वगाड़ - गरबा बीट्स',
    nameEn: 'Dholida Dhol Re Vagaad Garba',
    singerOrStyle: 'गुजराती डांडिया रास (30s रिंगटोन)',
    icon: '🥁',
    category: 'garba',
    audioUrl: '/audio/dholida-garba-beats.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'गरबा ताल व थाप • 00:00'
  },
  {
    id: 'o_sheronwali',
    nameHi: '५. ओ शेरोंवाली बिगड़ी बना दे',
    nameEn: 'O Sheronwali Bigdi Bana De',
    singerOrStyle: 'माँ शेरावाली सुपरहिट भेंट (30s रिंगटोन)',
    icon: '🦁',
    category: 'bhajan',
    audioUrl: '/audio/o-sheronwali.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'शेरावाली पुकार • 00:00'
  },
  {
    id: 'durga_stuti',
    nameHi: '६. या देवी सर्वभूतेषु - चंडी पाठ स्तुति',
    nameEn: 'Ya Devi Sarvabhuteshu Chandi Stuti',
    singerOrStyle: 'वैदिक संस्कृत मंत्र व तानपुरा (30s रिंगटोन)',
    icon: '🕉️',
    category: 'stuti',
    audioUrl: '/audio/durga-stuti-mantra.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'सर्वमंगल मांगल्ये • 00:00'
  },
  {
    id: 'meri_maa_ke_barabar',
    nameHi: '७. मेरी माँ के बराबर कोई नहीं',
    nameEn: 'Meri Maa Ke Barabar Koi Nahi',
    singerOrStyle: 'भावपूर्ण मधुर बांसुरी व संतूर (30s रिंगटोन)',
    icon: '🌸',
    category: 'bhajan',
    audioUrl: '/audio/meri-maa-ke-barabar.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'मधुर बांसुरी धुन • 00:00'
  },
  {
    id: 'nagada_sang_dhol',
    nameHi: '८. नगाड़ा संग ढोल बाजे - रास गरबा',
    nameEn: 'Nagada Sang Dhol Baje',
    singerOrStyle: 'हाई-एनर्जी ढोल ताशा व शहनाई (30s रिंगटोन)',
    icon: '🪘',
    category: 'garba',
    audioUrl: '/audio/nagada-sang-dhol.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'नगाड़ा धमाकेदार थाप • 00:00'
  },
  {
    id: 'shankh_108_bells',
    nameHi: '९. महा शंखनाद व 108 पावन मंदिर घंटियां',
    nameEn: 'Holy Shankh & 108 Temple Bells',
    singerOrStyle: 'अलौकिक मंदिर महाआरती नाद (30s रिंगटोन)',
    icon: '🐚',
    category: 'temple',
    audioUrl: '/audio/shankh-108-bells.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'दिव्य शंखनाद गूंज • 00:00'
  },
  {
    id: 'dhak_dhunuchi',
    nameHi: '१०. बंगाली ढाक, कांसी व धुनुची उत्सव',
    nameEn: 'Bengali Dhak & Dhunuchi Dance Beats',
    singerOrStyle: 'कोलकाता दुर्गा पूजा ढाक (30s रिंगटोन)',
    icon: '🔔',
    category: 'temple',
    audioUrl: '/audio/dhak-dhunuchi-beats.mp3',
    defaultStartSec: 0,
    durationSec: 30,
    recommendedPartHi: 'धुनुची उत्सव ताल • 00:00'
  }
];
