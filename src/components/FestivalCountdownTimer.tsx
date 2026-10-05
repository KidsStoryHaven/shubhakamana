import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Flame, ArrowRight, Calendar, Heart } from 'lucide-react';
import { Festival } from '../data/festivals';
import { YouTubeStatsBar } from './YouTubeStatsBar';

interface FestivalCountdownTimerProps {
  festivals: Festival[];
  onSelectFestival: (festival: Festival) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
}

// Exact Muhurat Target Dates for Upcoming Festivals (2026 & 2027)
const FESTIVAL_TARGET_DATES: Record<string, string> = {
  navratri: '2026-10-11T06:18:00', // 11 October 2026 (शारदीय नवरात्रि 2026 घटस्थापना)
  dhammachakra_pravartan: '2026-10-14T09:00:00', // 14 October 2026 (धम्मचक्र प्रवर्तन दिवस)
  dussehra: '2026-10-20T17:45:00', // 20 October 2026 (विजयादशमी - दशहरा 2026)
  karwa_chauth: '2026-10-29T20:15:00', // 29 October 2026 (करवा चौथ चंद्र दर्शन)
  dhanteras: '2026-11-06T17:45:00', // 6 November 2026 सायं 05:45 (धनतेरस व कुबेर पूजा)
  diwali: '2026-11-08T18:15:00', // 8 November 2026 सायं 06:15 (कार्तिक अमावस्या - महालक्ष्मी पूजन)
  bhai_dooj: '2026-11-10T13:15:00', // 10 November 2026 (भाई दूज)
  chhath_puja: '2026-11-15T17:30:00', // 15 November 2026 (छठ महापर्व संध्या अर्घ्य)
  guru_nanak_jayanti: '2026-11-24T06:00:00', // 24 November 2026 (गुरु नानक जयंती)
  samvidhan_diwas: '2026-11-26T09:00:00', // 26 November 2026 (संविधान दिवस)
  christmas: '2026-12-25T00:00:00', // 25 December 2026 (क्रिसमस)
  newyear: '2027-01-01T00:00:00', // 1 January 2027 (नव वर्ष 2027)
  makar_sankranti: '2027-01-14T07:15:00', // 14 January 2027 (मकर संक्रांति 2027)
  republic_day: '2027-01-26T08:00:00', // 26 January 2027 (गणतंत्र दिवस 2027)
  shivratri: '2027-03-06T23:45:00', // 6 March 2027 (महाशिवरात्रि 2027)
  holi: '2027-03-22T08:00:00', // 22 March 2027 (होली 2027)
};

export const FestivalCountdownTimer: React.FC<FestivalCountdownTimerProps> = ({
  festivals,
  onSelectFestival
}) => {
  // Top upcoming major festivals in ascending order
  const majorFestivals = festivals.filter(f => f.countdownDays > 0).slice(0, 5);

  const [selectedId, setSelectedId] = useState<string>(() => festivals[0]?.id || 'navratri');

  const targetFestival = festivals.find(f => f.id === selectedId) || 
    festivals[0];

  const calculateTimeLeft = (): TimeRemaining => {
    if (!targetFestival) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false };
    }

    const now = new Date();
    let targetDate: Date;

    if (FESTIVAL_TARGET_DATES[targetFestival.id]) {
      targetDate = new Date(FESTIVAL_TARGET_DATES[targetFestival.id]);
    } else {
      const daysFromData = targetFestival.countdownDays ?? 0;
      targetDate = new Date();
      targetDate.setDate(now.getDate() + daysFromData);
      targetDate.setHours(18, 0, 0, 0);
    }

    const diffMs = targetDate.getTime() - now.getTime();
    if (diffMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true };
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isToday: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetFestival?.id]);

  if (!targetFestival) return null;

  return (
    <section 
      aria-label="महापर्व काउंटडाउन टाइमर"
      className="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/80 via-stone-950 to-orange-950/80 p-5 sm:p-7 shadow-2xl shadow-amber-500/20 text-stone-100"
    >
      {/* Background Ambient Glow & Decorative Elements */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Quick Festival Selector Pills */}
      {majorFestivals.length > 1 && (
        <div className="relative z-10 flex flex-wrap items-center gap-1.5 pb-4 mb-4 border-b border-amber-500/20">
          <span className="text-[11px] font-bold text-amber-400 mr-1 flex items-center gap-1">
            <span>⏱️</span>
            <span>आगामी महापर्व काउंटडाउन:</span>
          </span>
          {majorFestivals.map((fest) => {
            const isSelected = targetFestival.id === fest.id;
            return (
              <button
                key={fest.id}
                onClick={() => setSelectedId(fest.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-md shadow-amber-500/30 scale-105'
                    : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800 hover:border-amber-500/40'
                }`}
              >
                <span>{fest.nameHi.split('•')[0].trim()}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-ping" />}
              </button>
            );
          })}
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Festival Title, Date & Description */}
        <div className="lg:col-span-6 space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{targetFestival.badge} • लाइव काउंटडाउन</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            {targetFestival.nameHi}
          </h2>

          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-amber-200/90 font-medium">
            <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{targetFestival.dateLabel}</span>
            </span>
            <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>शुभ मुहूर्त व पूजन विधि</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed pt-1">
            {targetFestival.shubhMuhurat || targetFestival.taglineHi}
          </p>

          {/* YouTube-Style Live Metrics */}
          <div className="pt-1">
            <YouTubeStatsBar
              festivalId={targetFestival.id}
              festivalTitle={targetFestival.nameHi}
              variant="card"
              className="border-t-0 py-0"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectFestival(targetFestival)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
            >
              <span>{targetFestival.nameHi.split('•')[0].trim()} का जादुई कार्ड बनाएँ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: High-Impact Digital Flip-Style Countdown Clock */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-end">
          {timeLeft.isToday ? (
            <div className="p-6 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-center space-y-2 animate-bounce">
              <span className="text-4xl">🎉 🪔 🌸</span>
              <h3 className="text-xl sm:text-2xl font-black text-amber-300 font-serif">
                आज ही है {targetFestival.nameHi}!
              </h3>
              <p className="text-xs text-stone-200">
                आप सभी को यह पावन महापर्व अत्यंत मंगलमय व कल्याणकारी हो!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {/* Days Box */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-stone-900/90 border-2 border-amber-500/60 shadow-xl flex items-center justify-center backdrop-blur-md">
                  <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-yellow-400 font-mono tracking-wider">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-amber-300/90 uppercase tracking-widest mt-1.5">
                  दिन (Days)
                </span>
              </div>

              <span className="text-2xl sm:text-3xl font-black text-amber-400/80 -mt-6">:</span>

              {/* Hours Box */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-stone-900/90 border-2 border-amber-500/60 shadow-xl flex items-center justify-center backdrop-blur-md">
                  <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-yellow-400 font-mono tracking-wider">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-amber-300/90 uppercase tracking-widest mt-1.5">
                  घंटे (Hours)
                </span>
              </div>

              <span className="text-2xl sm:text-3xl font-black text-amber-400/80 -mt-6">:</span>

              {/* Minutes Box */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-stone-900/90 border-2 border-amber-500/60 shadow-xl flex items-center justify-center backdrop-blur-md">
                  <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-yellow-400 font-mono tracking-wider">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-amber-300/90 uppercase tracking-widest mt-1.5">
                  मिनट (Mins)
                </span>
              </div>

              <span className="text-2xl sm:text-3xl font-black text-amber-400/80 -mt-6">:</span>

              {/* Seconds Box */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-stone-900/90 border-2 border-amber-500/60 shadow-xl flex items-center justify-center backdrop-blur-md">
                  <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-yellow-400 font-mono tracking-wider">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-amber-300/90 uppercase tracking-widest mt-1.5">
                  सेकंड (Secs)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
