import React, { useEffect, useState } from 'react';
import { 
  X, 
  Trophy, 
  Medal, 
  Sparkles, 
  Gift, 
  Share2, 
  User, 
  CreditCard,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { 
  getLeaderboard, 
  getCurrentUser, 
  UserProfile, 
  getStoredPointRules,
  PointRules 
} from '../data/userStore';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [rules, setRules] = useState<PointRules>(() => getStoredPointRules());

  useEffect(() => {
    if (isOpen) {
      setUsers(getLeaderboard());
      setCurrentUser(getCurrentUser());
      setRules(getStoredPointRules());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const top3 = users.slice(0, 3);
  const remaining = users.slice(3);

  // Find current user's rank
  const myIndex = currentUser ? users.findIndex(u => u.id === currentUser.id) : -1;
  const myRank = myIndex !== -1 ? myIndex + 1 : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border-2 border-amber-500/40 bg-stone-950 shadow-2xl relative my-auto overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-800 bg-gradient-to-r from-amber-950/60 via-stone-900 to-yellow-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
                <span>🏆 मासिक महा-लीडरबोर्ड</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-sans font-bold">
                  अक्टूबर 2026
                </span>
              </h3>
              <p className="text-xs text-amber-200/80">
                शीर्ष 3 विजेताओं को सीधा उनके <strong>UPI पर नकद पुरस्कार</strong> भेजा जाएगा! 💰
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Reward Prize Banner */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>{rules.monthlyRewardTitle}</span>
              </div>
              <p className="text-sm font-extrabold text-white">
                प्रथम, द्वितीय व तृतीय स्थान के लिए: <span className="text-amber-300 font-serif">{rules.monthlyRewardAmount}</span>
              </p>
              <p className="text-[11px] text-stone-400">
                हर महीने की पहली तारीख को विजेताओं की लिस्ट घोषित होती है और UPI पर इनाम ट्रांसफर किया जाता है।
              </p>
            </div>

            {!currentUser && (
              <button
                type="button"
                onClick={() => { onClose(); onOpenAuth(); }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-xs shadow-md shrink-0 cursor-pointer"
              >
                + हिस्सा लें (लॉग इन करें)
              </button>
            )}
          </div>

          {/* Current User Standing Bar (If logged in) */}
          {currentUser && (
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-800 border-2 border-emerald-400 shrink-0 flex items-center justify-center">
                  {currentUser.photoUrl ? (
                    <img src={currentUser.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{currentUser.name} (आप)</span>
                    {myRank && (
                      <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                        रैंक #{myRank}
                      </span>
                    )}
                  </span>
                  <p className="text-[11px] text-stone-400">
                    कुल शेयर्स: {currentUser.sharesCount} · UPI: {currentUser.upiId}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-amber-400 font-serif">
                  {currentUser.points} अंक
                </span>
                <span className="block text-[10px] text-emerald-300 font-semibold">
                  {myRank && myRank <= 3 ? '🎉 आप विजेता ज़ोन में हैं!' : 'और शेयर करके टॉप 3 में आएँ!'}
                </span>
              </div>
            </div>
          )}

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {top3.map((u, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              const borders = ['border-yellow-400/60 bg-yellow-950/20', 'border-stone-400/40 bg-stone-900/60', 'border-amber-700/50 bg-amber-950/20'];
              const rankLabels = ['प्रथम विजेता (1st)', 'द्वितीय विजेता (2nd)', 'तृतीय विजेता (3rd)'];

              return (
                <div
                  key={u.id}
                  className={`rounded-2xl border-2 ${borders[idx]} p-4 text-center space-y-2 relative shadow-lg`}
                >
                  <div className="text-2xl">{medals[idx]}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    {rankLabels[idx]}
                  </span>

                  <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-amber-400/50 bg-stone-900 shadow-inner flex items-center justify-center">
                    {u.photoUrl ? (
                      <img src={u.photoUrl} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-stone-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white truncate px-1">
                      {u.name}
                    </h4>
                    <span className="text-sm font-extrabold text-amber-400 font-serif mt-0.5 block">
                      {u.points} अंक
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      {u.sharesCount} शेयर्स
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remaining Rank Table */}
          {remaining.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                अन्य शीर्ष प्रतिभागी (Rank 4+)
              </h4>
              <div className="rounded-2xl border border-stone-800 bg-stone-900/50 divide-y divide-stone-800/80 overflow-hidden">
                {remaining.map((u, i) => (
                  <div
                    key={u.id}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-stone-900/80 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-bold text-stone-500 font-mono">
                        #{i + 4}
                      </span>
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-800 border border-stone-700 shrink-0 flex items-center justify-center">
                        {u.photoUrl ? (
                          <img src={u.photoUrl} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-stone-200">
                          {u.name}
                        </span>
                        <span className="block text-[10px] text-stone-400">
                          {u.sharesCount} शेयर्स
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {u.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Earn Points Guide */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 space-y-2 text-xs">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>पॉइंट्स कैसे कमाएँ और विजेता बनें:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300 pt-1">
              <div className="p-2 rounded-xl bg-black/40 border border-stone-800/80 flex items-center gap-2">
                <span className="text-lg">🟢</span>
                <div>
                  <strong className="text-white">WhatsApp पर शेयर करें:</strong>
                  <span className="text-emerald-400 block font-bold">+{rules.whatsappShare} अंक प्रति शेयर</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-stone-800/80 flex items-center gap-2">
                <span className="text-lg">📸</span>
                <div>
                  <strong className="text-white">8K WhatsApp Status लगाएँ:</strong>
                  <span className="text-emerald-400 block font-bold">+{rules.statusShare} अंक प्रति स्टेटस</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-stone-800/80 flex items-center gap-2">
                <span className="text-lg">🔗</span>
                <div>
                  <strong className="text-white">विशिंग लिंक कॉपी करें:</strong>
                  <span className="text-emerald-400 block font-bold">+{rules.copyLink} अंक प्रति कॉपी</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-stone-800/80 flex items-center gap-2">
                <span className="text-lg">🎁</span>
                <div>
                  <strong className="text-white">नया खाता बनाएँ (साइनअप):</strong>
                  <span className="text-emerald-400 block font-bold">+{rules.signupBonus} मुफ़्त बोनस अंक</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-stone-400">
            विजेताओं को इनाम वितरण हर माह की 1 तारीख को
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-semibold cursor-pointer"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
