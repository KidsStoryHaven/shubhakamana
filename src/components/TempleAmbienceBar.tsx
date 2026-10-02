import React, { useState } from 'react';
import { Bell, Flame, Sparkles, Volume2, Shield } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const TempleAmbienceBar: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [diyaLit, setDiyaLit] = useState(false);

  const handleRingBell = () => {
    setActiveSound('bell');
    soundEngine.playTempleBell();
    setTimeout(() => setActiveSound(null), 3000);
  };

  const handleBlowShankh = () => {
    setActiveSound('shankh');
    soundEngine.playShankh();
    setTimeout(() => setActiveSound(null), 4200);
  };

  const handleChantOm = () => {
    setActiveSound('om');
    soundEngine.playOmSound();
    setTimeout(() => setActiveSound(null), 5200);
  };

  const handleToggleDiya = () => {
    setDiyaLit(!diyaLit);
    soundEngine.playTempleBell();
  };

  return (
    <div className="space-y-8 py-2">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
          दिव्य मंदिर ध्वनि व पावन वातावरण
        </h2>
        <p className="text-xs sm:text-sm text-stone-300">
          अपने मन को शांत और एकाग्र करने के लिए मंदिर की पवित्र ध्वनियों का अनुभव करें
        </p>
      </div>

      {/* Main Interactive Sanctum Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Temple Bell */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/70 p-6 text-center backdrop-blur-sm hover:border-amber-500/40 transition-all">
          <div className="space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bell className={`h-7 w-7 ${activeSound === 'bell' ? 'animate-bounce text-amber-300' : ''}`} />
            </div>
            <h3 className="text-base font-bold font-display text-white">मंदिर की घंटी</h3>
            <p className="text-xs text-stone-400">
              पीतल की घंटी की सकारात्मक तरंगे नकारात्मक ऊर्जा को शांत करती हैं
            </p>
          </div>
          <button
            onClick={handleRingBell}
            className={`mt-4 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
              activeSound === 'bell'
                ? 'bg-amber-500 text-stone-950 font-bold scale-95'
                : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
            }`}
          >
            {activeSound === 'bell' ? '🔔 गूंज रही है...' : 'घंटी बजाएँ'}
          </button>
        </div>

        {/* 2. Conch Shell / Shankh */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/70 p-6 text-center backdrop-blur-sm hover:border-amber-500/40 transition-all">
          <div className="space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <span className="text-3xl">🐚</span>
            </div>
            <h3 className="text-base font-bold font-display text-white">शंख नाद</h3>
            <p className="text-xs text-stone-400">
              शुभ कार्यों के आरंभ और वायुमंडल को शुद्ध करने वाला वैदिक घोष
            </p>
          </div>
          <button
            onClick={handleBlowShankh}
            className={`mt-4 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
              activeSound === 'shankh'
                ? 'bg-sky-500 text-stone-950 font-bold scale-95'
                : 'bg-stone-800 text-sky-300 hover:bg-stone-700'
            }`}
          >
            {activeSound === 'shankh' ? '🐚 शंख गूंज रहा है...' : 'शंख नाद करें'}
          </button>
        </div>

        {/* 3. 432Hz Om Chant */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/70 p-6 text-center backdrop-blur-sm hover:border-amber-500/40 transition-all">
          <div className="space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <span className="text-3xl font-bold font-sans">ॐ</span>
            </div>
            <h3 className="text-base font-bold font-display text-white">432Hz ॐ नाद</h3>
            <p className="text-xs text-stone-400">
              ब्रह्मांडीय मूल ध्वनि जो ध्यान, विश्राम और आत्मिक शांति प्रदान करती है
            </p>
          </div>
          <button
            onClick={handleChantOm}
            className={`mt-4 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
              activeSound === 'om'
                ? 'bg-purple-500 text-stone-950 font-bold scale-95'
                : 'bg-stone-800 text-purple-300 hover:bg-stone-700'
            }`}
          >
            {activeSound === 'om' ? 'ॐ ध्यान जारी है...' : 'ॐ नाद सुनें'}
          </button>
        </div>

        {/* 4. Virtual Diya / Akhand Jyoti */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/70 p-6 text-center backdrop-blur-sm hover:border-amber-500/40 transition-all">
          <div className="space-y-2">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
              diyaLit ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-2 ring-amber-500/30' : 'bg-stone-800/80 border-stone-700 text-stone-400'
            }`}>
              <Flame className={`h-7 w-7 ${diyaLit ? 'flame-glow text-orange-400' : ''}`} />
            </div>
            <h3 className="text-base font-bold font-display text-white">अखण्ड ज्योति दीपक</h3>
            <p className="text-xs text-stone-400">
              {diyaLit ? 'पावन ज्योति प्रज्वलित है। भगवान आपकी मनोकामना पूर्ण करें।' : 'दीपक प्रज्वलित कर प्रार्थना व श्रद्धा अर्पण करें'}
            </p>
          </div>
          <button
            onClick={handleToggleDiya}
            className={`mt-4 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
              diyaLit
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            {diyaLit ? '🪔 ज्योति प्रज्वलित है' : 'दीया प्रज्वलित करें'}
          </button>
        </div>
      </div>

      {/* Daily Vedic Guidance card */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Shield className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">दैनिक संध्या व प्रातः वंदना</h4>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xl">
              सवेरे उठते ही कराग्रे वसते लक्ष्मीः और संकटमोचन हनुमान जी अथवा भगवान शिव के नाम का ११ बार स्मरण करने से दिन भर मन में सकारात्मक ऊर्जा और आत्मविश्वास बना रहता है।
            </p>
          </div>
        </div>

        <button
          onClick={handleRingBell}
          className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-amber-500/30 bg-amber-950/40 px-4 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/50 transition-colors"
        >
          <Volume2 className="h-4 w-4" />
          <span>आरती घंटानाद</span>
        </button>
      </div>
    </div>
  );
};
