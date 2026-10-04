import React, { useState } from 'react';
import { Sparkles, Volume2, Share2, Check, Flame, BookOpen, SunMedium } from 'lucide-react';
import { festiveAudio } from '../utils/festiveAudio';

interface DailyShloka {
  id: string;
  sanskrit: string;
  hindiMeaning: string;
  source: string;
  deity: string;
  benefit: string;
  emoji: string;
}

const VEDIC_SHLOKAS: DailyShloka[] = [
  {
    id: 'shloka_1',
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    hindiMeaning: 'उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापरहित, दिव्य परमात्मा को हम अपनी अंतरात्मा में धारण करें। वह परमात्मा हमारी बुद्धि को सन्मार्ग की ओर प्रेरित करे।',
    source: 'ऋग्वेद (गायत्री महामंत्र)',
    deity: 'सविता (सूर्य देव) व माँ गायत्री',
    benefit: 'बुद्धि, एकाग्रता और सकारात्मक ऊर्जा की वृद्धि।',
    emoji: '☀️'
  },
  {
    id: 'shloka_2',
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
    hindiMeaning: 'हम त्रिनेत्रधारी भगवान शिव की आराधना करते हैं, जो सुगंधित और समस्त प्राणियों का पोषण करने वाले हैं। जिस प्रकार पका हुआ खरबूजा बेल के बंधन से मुक्त हो जाता है, उसी प्रकार हम मृत्यु के भय से मुक्त होकर अमरता प्राप्त करें।',
    source: 'ऋग्वेद (महामृत्युंजय मंत्र)',
    deity: 'देवाधिदेव महादेव शिव',
    benefit: 'आरोग्य, अकाल मृत्यु से रक्षा और मानसिक शांति।',
    emoji: '🔱'
  },
  {
    id: 'shloka_3',
    sanskrit: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
    hindiMeaning: 'हे घुमावदार सूंड वाले, विशाल शरीर वाले और करोड़ों सूर्यों के समान तेजस्वी भगवान श्री गणेश! आप कृपा करके मेरे समस्त कार्यों को सदा बिना किसी विघ्न-बाधा के पूर्ण करें।',
    source: 'गणेश पुराण',
    deity: 'प्रथम पूज्य भगवान श्री गणेश',
    benefit: 'समस्त विघ्नों का नाश और नए कार्यों में सफलता।',
    emoji: '🐘'
  },
  {
    id: 'shloka_4',
    sanskrit: 'ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ ॥',
    hindiMeaning: 'तीनों लोकों की अधिष्ठात्री माता महालक्ष्मी हमारे समस्त दारिद्र्य का नाश करें और हमें सुख, शांति, समृद्धि व अपार धन-धान्य का आशीर्वाद प्रदान करें।',
    source: 'श्री सूक्तम्',
    deity: 'माता महालक्ष्मी',
    benefit: 'धन, समृद्धि, ऐश्वर्य और घर में सुख-शांति।',
    emoji: '🪔'
  },
  {
    id: 'shloka_5',
    sanskrit: 'सरस्वति नमस्तुभ्यं वरदे कामरूपिणि । विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥',
    hindiMeaning: 'हे वरदायिनी और सर्व मनोकामना पूर्ण करने वाली माता सरस्वती, आपको मेरा सादर प्रणाम। मैं अपनी विद्या और ज्ञान का शुभारंभ कर रहा हूँ, मुझे सदा सफलता व सिद्धि प्राप्त हो।',
    source: 'सरस्वती स्तोत्र',
    deity: 'विद्या दायिनी माँ सरस्वती',
    benefit: 'ज्ञान, विवेक, स्मरण शक्ति और वाणी में मधुरता।',
    emoji: '🪕'
  },
  {
    id: 'shloka_6',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    hindiMeaning: 'हे भारत (अर्जुन)! जब-जब धर्म की हानि होती है और अधर्म में वृद्धि होती है, तब-तब मैं धर्म की रक्षा और सत्य की स्थापना के लिए स्वयं को प्रकट करता हूँ।',
    source: 'श्रीमद्भगवद्गीता (अध्याय 4, श्लोक 7)',
    deity: 'भगवान श्री कृष्ण',
    benefit: 'सत्य के मार्ग पर चलने का आत्मबल और धैर्य।',
    emoji: '🪈'
  },
  {
    id: 'shloka_7',
    sanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
    hindiMeaning: 'संसार में सभी सुखी हों, सभी रोगमुक्त और स्वस्थ रहें। सभी का कल्याण हो और किसी को भी कभी किसी प्रकार का दुःख न सहना पड़े। ॐ शान्तिः शान्तिः शान्तिः।',
    source: 'बृहदारण्यक उपनिषद् (शान्ति मंत्र)',
    deity: 'परमपिता परमात्मा',
    benefit: 'विश्व शांति, परिवार में प्रेम और सर्व मंगल।',
    emoji: '🌸'
  }
];

export const DailyMantraWidget: React.FC = () => {
  // Rotate every 24 hours based on calendar day epoch
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % VEDIC_SHLOKAS.length;
  const todayMantra = VEDIC_SHLOKAS[dayIndex] || VEDIC_SHLOKAS[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePlayChime = () => {
    setIsPlaying(true);
    try {
      festiveAudio.playTempleBell();
    } catch {}
    setTimeout(() => setIsPlaying(false), 2500);
  };

  const handleShareMantra = async () => {
    const text = `🪔 *आज का पावन दैनिक मंत्र व सुविचार* 🪔\n\n"${todayMantra.sanskrit}"\n\n📖 *भावार्थ:* ${todayMantra.hindiMeaning}\n\n✨ *स्रोत:* ${todayMantra.source} (${todayMantra.deity})\n\n👇 अपने नाम का पावन विशिंग कार्ड यहाँ बनाएं:\nhttps://shubhakamna.in/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'आज का पावन दैनिक मंत्र',
          text
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <section 
      aria-label="दैनिक मंत्र व सुविचार"
      className="relative rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-stone-950 via-amber-950/40 to-stone-950 p-5 sm:p-7 shadow-2xl shadow-amber-500/15 text-stone-100 overflow-hidden"
    >
      {/* Background Mandala & Rays */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-bold text-lg shadow-md shadow-amber-500/30">
            {todayMantra.emoji}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                <span>आज का पावन दैनिक मंत्र (Daily Shloka)</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                24h दैनिक अपडेट
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              {todayMantra.source} • {todayMantra.deity}
            </p>
          </div>
        </div>

        {/* Audio Chime & Share Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handlePlayChime}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border ${
              isPlaying
                ? 'bg-amber-500 text-stone-950 border-amber-400 animate-pulse'
                : 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-amber-500/30'
            }`}
            title="पावन मंदिर घंटी बजाएं"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'घंटी बज रही है...' : '🔔 घंटी नाद'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareMantra}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/30 active:scale-95"
            title="WhatsApp पर शेयर करें"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'कॉपी हो गया!' : 'शेयर करें'}</span>
          </button>
        </div>
      </div>

      {/* Sanskrit Shloka Box */}
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-black/60 border border-amber-500/30 text-center shadow-inner relative group">
        <div className="text-stone-400 text-xs font-serif uppercase tracking-widest mb-1.5">
          ॥ पावन संस्कृत श्लोक ॥
        </div>
        <p className="text-base sm:text-lg lg:text-xl font-bold text-amber-200 font-serif leading-relaxed tracking-wide drop-shadow">
          {todayMantra.sanskrit}
        </p>
      </div>

      {/* Hindi Meaning & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="md:col-span-2 p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>हिंदी सरल भावार्थ (Meaning):</span>
          </span>
          <p className="text-stone-200 leading-relaxed">
            {todayMantra.hindiMeaning}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>आध्यात्मिक लाभ (Benefit):</span>
          </span>
          <p className="text-stone-300 leading-relaxed">
            {todayMantra.benefit}
          </p>
        </div>
      </div>

    </section>
  );
};
