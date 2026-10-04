import React, { useState, useEffect } from 'react';
import { Gift, X, Sparkles, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { getCurrentUser, UserProfile } from '../data/userStore';

interface LoginPromptPopupProps {
  onOpenAuth: () => void;
}

export const LoginPromptPopup: React.FC<LoginPromptPopupProps> = ({ onOpenAuth }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('shubhakamna_login_prompt_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleSessionChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('shubhakamna_user_session_changed', handleSessionChange);
    return () => window.removeEventListener('shubhakamna_user_session_changed', handleSessionChange);
  }, []);

  // Show after a gentle 3-second delay if not logged in and not dismissed
  useEffect(() => {
    if (!currentUser && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [currentUser, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem('shubhakamna_login_prompt_dismissed', 'true');
    } catch {}
  };

  if (currentUser) return null;

  // Collapsed mini badge if dismissed
  if (isDismissed && !isVisible) {
    return (
      <button
        onClick={() => {
          setIsDismissed(false);
          setIsVisible(true);
        }}
        className="fixed bottom-4 left-4 z-40 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs shadow-xl shadow-amber-500/30 flex items-center gap-2 hover:scale-105 transition active:scale-95 cursor-pointer animate-bounce"
      >
        <Trophy className="w-4 h-4 text-stone-950" />
        <span>🎁 ₹100 नकद इनाम जीतें</span>
      </button>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 animate-slide-up">
      <div className="relative rounded-3xl border-2 border-amber-400/80 bg-stone-950/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-amber-500/20 text-stone-100 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
          title="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          {/* Trophy Icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 shrink-0 shadow-lg shadow-amber-500/30 mt-0.5">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>मासिक नकद प्रतियोगिता</span>
            </div>
            
            <h4 className="text-sm font-extrabold text-white mt-0.5 leading-snug">
              लॉग इन करें & जीतें ₹100, ₹50, ₹20 नकद! 🏆
            </h4>
            
            <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
              विशेज शेयर व डाउनलोड करके पॉइंट्स कमाएँ और हर महीने सीधा अपने UPI में इनाम पाएं।
            </p>
          </div>
        </div>

        {/* Prize breakdown badges */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
          <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            🥇 1st: ₹100
          </div>
          <div className="p-1.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-300">
            🥈 2nd: ₹50
          </div>
          <div className="p-1.5 rounded-xl bg-amber-900/30 border border-amber-700/30 text-amber-400">
            🥉 3rd: ₹20
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              handleDismiss();
              onOpenAuth();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 transition cursor-pointer active:scale-95"
          >
            <span>✨ तुरंत लॉग इन करें (+50 बोनस अंक)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-2 text-center flex items-center justify-center gap-1 text-[10px] text-stone-400 font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>100% मुफ़्त & सुरक्षित UPI भुगतान</span>
        </div>

      </div>
    </div>
  );
};
