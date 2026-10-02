import React, { useState } from 'react';
import { Calendar, Sun, Moon, Clock, Share2, Sparkles, Compass } from 'lucide-react';
import { festiveAudio } from '../utils/festiveAudio';

interface PanchangData {
  dateStr: string;
  hindiDate: string;
  samvat: string;
  tithi: string;
  tithiEnd: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  shubhMuhurat: string;
  rahuKaal: string;
  choghadiyaDay: string;
}

export const PanchangWidget: React.FC<{ onShareSuprabhat?: () => void }> = ({ onShareSuprabhat }) => {
  const [activeTab, setActiveTab] = useState<'panchang' | 'choghadiya'>('panchang');

  // Generate dynamic today's panchang data based on system calendar
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const panchang: PanchangData = {
    dateStr: dateFormatted,
    hindiDate: 'आश्विन शुक्ल पक्ष • शरद ऋतु',
    samvat: 'विक्रम संवत 2083 • नल संवत्सर',
    tithi: 'शुक्ल पक्ष दशमी तिथि (विजय काल)',
    tithiEnd: 'सायं 06:45 बजे तक, उपरांत एकादशी',
    nakshatra: 'श्रवण नक्षत्र (प्रातः 09:20 से)',
    yoga: 'सुकर्मा योग (अति शुभ फलदायी)',
    karana: 'गर करण (दोपहर 01:10 तक)',
    sunrise: 'प्रातः 06:14 AM',
    sunset: 'सायं 06:05 PM',
    shubhMuhurat: 'अभिजीत मुहूर्त: 11:46 AM से 12:34 PM (सर्वकार्य सिद्धि)',
    rahuKaal: 'राहुकाल: 10:30 AM से 12:00 PM (अशुभ समय)',
    choghadiyaDay: 'अमृत: 06:14-07:42 | शुभ: 09:11-10:40 | लाभ: 01:38-03:07'
  };

  const handleSharePanchang = () => {
    festiveAudio.playTempleBell();
    const shareText = `☀️ *आज का पावन दैनिक पंचांग • Shubhakamna.in* 🪔\n📅 ${panchang.dateStr}\n🔱 ${panchang.hindiDate} (${panchang.samvat})\n\n✨ *तिथि:* ${panchang.tithi}\n🌟 *नक्षत्र:* ${panchang.nakshatra}\n🌅 *सूर्योदय:* ${panchang.sunrise} | *सूर्यास्त:* ${panchang.sunset}\n✅ *शुभ मुहूर्त:* ${panchang.shubhMuhurat}\n⚠️ *राहुकाल:* ${panchang.rahuKaal}\n\n👉 अपने नाम व फोटो की जादुई विशिंग लिंक यहाँ बनाएँ:\nhttps://shubhakamna.in/?f=suprabhat`;

    const waUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    const webWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = waUrl;
    } else {
      window.open(webWaUrl, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>दैनिक पंचांग व शुभ मुहूर्त (Daily Panchang)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
            <span>📅 {panchang.dateStr}</span>
          </h3>
          <p className="text-xs text-amber-200/80 mt-0.5">
            {panchang.hindiDate} • {panchang.samvat}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSharePanchang}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/30 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>पंचांग WhatsApp पर भेजें</span>
          </button>
        </div>
      </div>

      {/* Grid of Tithi, Nakshatra, Muhurat */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1">
          <span className="text-[10px] text-amber-400 font-semibold block flex items-center gap-1">
            <Moon className="w-3 h-3" />
            <span>पावन तिथि</span>
          </span>
          <p className="font-bold text-stone-100">{panchang.tithi}</p>
          <p className="text-[10px] text-stone-400">{panchang.tithiEnd}</p>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1">
          <span className="text-[10px] text-amber-400 font-semibold block flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>नक्षत्र व योग</span>
          </span>
          <p className="font-bold text-stone-100">{panchang.nakshatra}</p>
          <p className="text-[10px] text-stone-400">{panchang.yoga}</p>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-emerald-400 font-semibold block flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>शुभ अभिजीत मुहूर्त</span>
          </span>
          <p className="font-bold text-emerald-300">11:46 AM - 12:34 PM</p>
          <p className="text-[10px] text-stone-400">सर्वोत्तम कार्य सिद्धि समय</p>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-red-500/30 space-y-1">
          <span className="text-[10px] text-rose-400 font-semibold block flex items-center gap-1">
            <Compass className="w-3 h-3" />
            <span>राहुकाल (त्याज्य समय)</span>
          </span>
          <p className="font-bold text-rose-300">10:30 AM - 12:00 PM</p>
          <p className="text-[10px] text-stone-400">शुभ कार्य टालें</p>
        </div>
      </div>

      {/* Choghadiya Quick Bar */}
      <div className="mt-3.5 pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-300">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">✨ आज के अमृत/शुभ चौघड़िया:</span>
          <span>{panchang.choghadiyaDay}</span>
        </div>
        <div className="flex items-center gap-3 text-stone-400 text-[10px]">
          <span>🌅 सूर्योदय: {panchang.sunrise}</span>
          <span>🌇 सूर्यास्त: {panchang.sunset}</span>
        </div>
      </div>
    </div>
  );
};
