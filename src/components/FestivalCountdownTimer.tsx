import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Flame, ArrowRight, Calendar, Heart } from 'lucide-react';
import { Festival } from '../data/festivals';

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

// Exact 2026 Festival Muhurat Target Dates (ISO 8601)
const FESTIVAL_TARGET_DATES_2026: Record<string, string> = {
  diwali: '2026-11-08T18:15:00', // 8 November 2026 सायं 06:15 (कार्तिक अमावस्या - महालक्ष्मी पूजन)
  dhanteras: '2026-11-06T17:45:00', // 6 November 2026 सायं 05:45 (धनतेरस व कुबेर पूजा)
  govardhan: '2026-11-09T06:30:00', // 9 November 2026 (गोवर्धन पूजा व अन्नकूट)
  bhai_dooj: '2026-11-10T13:15:00', // 10 November 2026 (भाई दूज)
  chhath_puja: '2026-11-15T17:30:00', // 15 November 2026 (छठ महापर्व संध्या अर्घ्य)
  karwa_chauth: '2026-10-29T20:15:00', // 29 October 2026 (करवा चौथ चंद्र दर्शन)
  sharad_purnima: '2026-10-25T19:00:00', // 25 October 2026 (शरद पूर्णिमा)
};

export const FestivalCountdownTimer: React.FC<FestivalCountdownTimerProps> = ({
  festivals,
  onSelectFestival
}) => {
  // Top upcoming major festivals for quick switching
  const majorFestivals = festivals.filter(f => 
    ['diwali', 'dhanteras', 'chhath_puja', 'karwa_chauth'].includes(f.id) || f.category === 'hindu'
  ).slice(0, 4);

  const [selectedId, setSelectedId] = useState<string>('diwali');

  const targetFestival = festivals.find(f => f.id === selectedId) || 
    festivals.find(f => f.id === 'diwali') || 
    festivals[0];

  const calculateTimeLeft = (): TimeRemaining => {
    if (!targetFestival) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false };
    }

    const now = new Date();
    let targetDate: Date;

    if (FESTIVAL_TARGET_DATES_2026[targetFestival.id]) {
      targetDate = new Date(FESTIVAL_TARGET_DATES_2026[targetFestival.id]);
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
            <span>काउंटडाउन देखें:</span>
          </span>
          {majorFestivals.map(fest => (
            <button
              key={fest.id}
              type="button"
              onClick={() => setSelectedId(fest.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                targetFestival.id === fest.id
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-stone-900/80 text-stone-300 border border-stone-800 hover:border-amber-500/40'
              }`}
            >
              <span>{fest.id === 'diwali' ? '🪔' : fest.id === 'dhanteras' ? '🪙' : '☀️'}</span>
              <span>{fest.nameHi.split('•')[0].trim()}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Festival Name & Urgency Message */}
        <div className="space-y-2 text-center lg:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>आगामी पावन महापर्व • उलटी गिनती शुरू</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-serif tracking-tight drop-shadow-md">
            {targetFestival.nameHi}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl line-clamp-2">
            {targetFestival.taglineHi}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-amber-200/90 font-medium">
            <span className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{targetFestival.dateLabel}</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-300 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{targetFestival.shubhMuhurat}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Live Countdown Digital Flip Boxes & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          
          {/* 4 Time Digit Cards */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            {/* Days */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-black/70 border border-amber-500/40 min-w-[62px] sm:min-w-[72px] shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-amber-300 font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider">
                दिन (Days)
              </span>
            </div>

            {/* Hours */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-black/70 border border-amber-500/40 min-w-[62px] sm:min-w-[72px] shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-amber-300 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider">
                घंटे (Hrs)
              </span>
            </div>

            {/* Minutes */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-black/70 border border-amber-500/40 min-w-[62px] sm:min-w-[72px] shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-amber-300 font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider">
                मिनट (Min)
              </span>
            </div>

            {/* Seconds (Pulsing) */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-black/70 border border-amber-500/60 min-w-[62px] sm:min-w-[72px] shadow-lg shadow-amber-500/20 backdrop-blur-md ring-1 ring-amber-400/40">
              <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-yellow-300 font-mono animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-amber-400 font-bold uppercase tracking-wider">
                सेकंड (Sec)
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={() => onSelectFestival(targetFestival)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition cursor-pointer active:scale-95 group shrink-0"
          >
            <span>विशिंग कार्ड बनाएँ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>

        </div>

      </div>
    </section>
  );
};
