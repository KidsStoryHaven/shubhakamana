import React from 'react';
import { Sparkles, Send, Flame, ArrowUp } from 'lucide-react';
import { festiveAudio } from '../utils/festiveAudio';

interface StickyViralBarProps {
  senderName: string;
  onFocusInput: () => void;
  onDirectShare: () => void;
}

export const StickyViralBar: React.FC<StickyViralBarProps> = ({
  senderName,
  onFocusInput,
  onDirectShare
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-stone-950/95 border-t border-amber-500/30 backdrop-blur-md shadow-2xl transition-transform animate-slide-up">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5">
        
        {/* Left text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
            <span className="text-amber-400">✨</span>
            <span className="truncate">{senderName} की विश पसंद आई?</span>
          </p>
          <p className="text-[11px] text-amber-200/80 truncate">
            अपने नाम का जादुई कार्ड 10 सेकंड में बनाएँ
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            festiveAudio.playTempleBell();
            onFocusInput();
          }}
          className="shrink-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-950/40 flex items-center gap-1.5 cursor-pointer transform active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-stone-950" />
          <span>अपना नाम लिखें ✍️</span>
        </button>

      </div>
    </div>
  );
};
