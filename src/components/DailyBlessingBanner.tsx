import React, { useState } from 'react';
import { Sparkles, Flame, Share2, Check, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DailyBlessingProps {
  onOpenStudioWithText: (text: string) => void;
}

export const DailyBlessingBanner: React.FC<DailyBlessingProps> = ({ onOpenStudioWithText }) => {
  const [aartiActive, setAartiActive] = useState(false);
  const [copied, setCopied] = useState(false);

  // Today's day name calculation
  const today = new Date();
  const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const dayNameHi = daysHi[today.getDay()];
  
  const deityByDay: Record<number, { title: string; deity: string; blessing: string }> = {
    0: { title: 'रविवार', deity: 'सूर्य देव', blessing: 'तेज, स्वास्थ्य और आरोग्य की प्राप्ति' },
    1: { title: 'सोमवार', deity: 'देवाधिदेव महादेव शिव', blessing: 'मन की शांति और समस्त संकटों का निवारण' },
    2: { title: 'मंगलवार', deity: 'पवनपुत्र हनुमान जी', blessing: 'साहस, शक्ति और भय से मुक्ति' },
    3: { title: 'बुधवार', deity: 'प्रथम पूज्य श्री गणेश', blessing: 'बुद्धि, विवेक और कार्य सिद्धि' },
    4: { title: 'गुरुवार', deity: 'भगवान श्री हरि विष्णु', blessing: 'समृद्धि, ज्ञान और परिवार में सौहार्द' },
    5: { title: 'शुक्रवार', deity: 'माँ भगवती एवं माँ लक्ष्मी', blessing: 'वैभव, यश और आध्यात्मिक आनंद' },
    6: { title: 'शनिवार', deity: 'शनिदेव एवं महाबली हनुमान', blessing: 'कर्म शुद्धि और न्याय की विजय' }
  };

  const currentDeity = deityByDay[today.getDay()];
  const dailyThought = "शुभ प्रभात! जिस हृदय में ईश्वर का वास और वाणी में सत्य की मिठास होती है, वहां सुख और शांति स्वतः खिंचे चले आते हैं।";

  const handlePerformAarti = () => {
    setAartiActive(true);
    soundEngine.playTempleBell();
    setTimeout(() => {
      soundEngine.playTempleBell();
    }, 600);
    setTimeout(() => {
      setAartiActive(false);
    }, 3500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${dailyThought}\n\n- दैनिक सुविचार · दिव्य दर्शन`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    soundEngine.speakHindi(dailyThought);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-600/30 bg-gradient-to-br from-amber-950/40 via-stone-900/60 to-stone-950 p-6 md:p-8 backdrop-blur-sm">
      {/* Decorative divine glow circle */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-400">
            <span className="font-semibold">{dayNameHi} का पावन दिन</span>
            <span aria-hidden="true">·</span>
            <span>इष्टदेव: {currentDeity.deity}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400">{currentDeity.blessing}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-relaxed">
            "{dailyThought}"
          </h2>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? 'कॉपी हो गया' : 'सुविचार कॉपी करें'}</span>
            </button>
            <span className="text-stone-600" aria-hidden="true">·</span>
            <button
              onClick={handleSpeak}
              className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white transition-colors"
            >
              <Volume2 className="h-3.5 w-3.5 text-amber-400" />
              <span>सुविचार सुनें</span>
            </button>
            <span className="text-stone-600" aria-hidden="true">·</span>
            <button
              onClick={() => onOpenStudioWithText(dailyThought)}
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>इस विचार से स्टेटस बनाएँ</span>
            </button>
          </div>
        </div>

        {/* Interactive Virtual Diya & Aarti Offering */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 sm:p-5 text-center min-w-[200px]">
          <div className="relative mb-2 flex items-center justify-center">
            <button
              onClick={handlePerformAarti}
              aria-label="आरती व दीया प्रज्वलित करें"
              className={`group relative flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-b from-amber-500/30 to-amber-700/20 transition-all ${
                aartiActive ? 'ring-4 ring-amber-400/50 scale-105' : 'hover:scale-105'
              }`}
            >
              <Flame className={`h-7 w-7 text-amber-400 transition-all ${aartiActive ? 'flame-glow text-orange-400 scale-110' : 'group-hover:text-amber-300'}`} />
              {aartiActive && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                </span>
              )}
            </button>
          </div>
          
          <span className="text-xs font-semibold text-amber-300">
            {aartiActive ? 'ॐ जय जगदीश हरे...' : 'आरती अर्पण करें'}
          </span>
          <span className="mt-1 text-[11px] text-stone-400">
            दीपक स्पर्श कर घंटी बजाएँ
          </span>
        </div>
      </div>
    </div>
  );
};
