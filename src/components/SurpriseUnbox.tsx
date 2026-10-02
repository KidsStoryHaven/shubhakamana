import React, { useState } from 'react';
import { Sparkles, Gift, Flame, Heart, Music } from 'lucide-react';
import { festiveAudio } from '../utils/festiveAudio';

interface SurpriseUnboxProps {
  senderName: string;
  festivalName: string;
  onOpen: () => void;
  isOpen: boolean;
}

export const SurpriseUnbox: React.FC<SurpriseUnboxProps> = ({
  senderName,
  festivalName,
  onOpen,
  isOpen
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  const handleBoxClick = () => {
    setIsAnimating(true);
    festiveAudio.playSoundForFestival('fireworks');
    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in">
      {/* Decorative ambient rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-yellow-950/20 to-black pointer-events-none"></div>

      <div className={`relative max-w-sm w-full text-center transition-all duration-700 transform ${isAnimating ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Divine Greeting Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>विशेष पावन सरप्राइज संदेश</span>
        </div>

        {/* Sender Attribution */}
        <div className="space-y-1 mb-6">
          <h2 className="text-xl sm:text-2xl font-serif text-white font-extrabold tracking-tight">
            <span className="text-amber-300 drop-shadow-md">{senderName}</span>
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm">
            ने आपके और आपके पूरे परिवार के लिए एक खास जादुई शुभकामना भेजी है!
          </p>
        </div>

        {/* Interactive Glowing Gift Box / Diya */}
        <div className="relative my-8 flex items-center justify-center">
          {/* Pulsating golden aura rings */}
          <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 animate-ping pointer-events-none"></div>
          <div className="absolute w-56 h-56 rounded-full bg-yellow-500/10 blur-xl pointer-events-none"></div>

          <button
            onClick={handleBoxClick}
            className="group relative w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 p-1 shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer flex items-center justify-center"
            title="गिफ्ट बॉक्स खोलें"
          >
            {/* Box Body */}
            <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-stone-900 to-amber-950 flex flex-col items-center justify-center border border-amber-300/40 relative overflow-hidden">
              {/* Ribbon */}
              <div className="absolute inset-x-0 h-4 bg-gradient-to-r from-amber-400 to-yellow-300 top-1/2 -translate-y-1/2 shadow"></div>
              <div className="absolute inset-y-0 w-4 bg-gradient-to-b from-amber-400 to-yellow-300 left-1/2 -translate-x-1/2 shadow"></div>

              {/* Big Gift Emoji / Icon */}
              <div className="relative z-10 text-5xl sm:text-6xl drop-shadow-lg group-hover:scale-110 transition-transform">
                🎁
              </div>

              <div className="absolute bottom-2 text-[10px] text-amber-200 font-bold tracking-wider uppercase z-10 bg-black/70 px-2 py-0.5 rounded-full border border-amber-500/30">
                टच करें
              </div>
            </div>
          </button>
        </div>

        {/* Call to action instruction */}
        <div className="space-y-3">
          <p className="text-amber-200/90 text-sm font-semibold animate-bounce flex items-center justify-center gap-1.5">
            <span>👇 उपहार खोलने के लिए बॉक्स को छुएँ 👇</span>
          </p>

          <button
            onClick={handleBoxClick}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold py-3.5 px-6 rounded-2xl text-base shadow-xl shadow-amber-950/50 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-stone-950" />
            <span>सरप्राइज खोलें (Open Wish) ✨</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-400 mt-4">
          आतिशबाजी, पावन संगीत एवं जादुई शुभकामना
        </p>

      </div>
    </div>
  );
};
