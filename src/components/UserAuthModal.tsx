import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Upload, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  AlertCircle,
  Gift
} from 'lucide-react';
import { registerUser, loginUser, UserProfile, getStoredPointRules } from '../data/userStore';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [rules] = useState(() => getStoredPointRules());

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [upiId, setUpiId] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('फ़ोटो का आकार 2MB से कम होना चाहिए!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('कृपया अपना पूरा नाम लिखें!');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('कृपया मान्य ईमेल पता लिखें!');
        return;
      }
      if (!password.trim() || password.length < 4) {
        setError('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए!');
        return;
      }
      if (!upiId.trim() || !upiId.includes('@')) {
        setError('कृपया सही UPI ID लिखें (उदा. 9876543210@paytm या name@oksbi) ताकि मासिक नकद पुरस्कार सीधे आपके खाते में भेजा जा सके!');
        return;
      }

      setLoading(true);
      const res = registerUser({
        name,
        email,
        password,
        upiId,
        photoUrl
      });
      setLoading(false);

      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.message);
      }
    } else {
      // Login
      if (!email.trim()) {
        setError('कृपया ईमेल पता दर्ज करें!');
        return;
      }
      if (!password.trim()) {
        setError('कृपया पासवर्ड दर्ज करें!');
        return;
      }

      setLoading(true);
      const res = loginUser(email, password);
      setLoading(false);

      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl border-2 border-amber-500/40 bg-stone-950 p-6 shadow-2xl relative my-auto space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Reward Badge */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-white font-serif">
            {mode === 'signup' ? '🎉 शुभचिंतक क्लब में जुड़ें' : '🔐 शुभचिंतक खाता लॉग इन'}
          </h3>
          <p className="text-xs text-amber-300/90 font-medium">
            {mode === 'signup' 
              ? `साइन अप करते ही पाएँ +${rules.signupBonus} बोनस पॉइंट्स! 💰` 
              : 'लॉग इन करके शेयर करें और हर शेयर पर पॉइंट्स कमाएँ!'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-900 border border-stone-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              mode === 'signup' 
                ? 'bg-amber-500 text-stone-950 shadow-md' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            नया खाता (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              mode === 'login' 
                ? 'bg-amber-500 text-stone-950 shadow-md' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            लॉग इन (Login)
          </button>
        </div>

        {/* Reward Highlight Notice */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/20 text-xs text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>{rules.monthlyRewardTitle}</span>
          </div>
          <p className="text-[11px] text-stone-300">
            हर महीने के शीर्ष 3 पॉइंट्स विजेताओं को सीधा उनके UPI खाते में <strong>{rules.monthlyRewardAmount}</strong> भेजा जाएगा!
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <>
              {/* Profile Photo Uploader */}
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-stone-900/60 border border-stone-800">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-800 border-2 border-amber-500/40 shrink-0 flex items-center justify-center text-stone-400">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-stone-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-bold text-stone-200">
                    प्रोफ़ाइल फोटो (Profile Photo)
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-0.5 text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{photoUrl ? 'फ़ोटो बदलें' : 'फ़ोटो अपलोड करें'}</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  आपका पूरा नाम (Full Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा: राहुल शर्मा / प्रिया वर्मा"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-stone-300 font-bold mb-1">
              ईमेल पता (Email Address) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="उदा: rahul@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-stone-300 font-bold mb-1">
              पासवर्ड (Password) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="पासवर्ड लिखें..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* UPI ID (Only on Signup) */}
          {mode === 'signup' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-amber-300 font-bold flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>UPI ID (नकद पुरस्कार पाने के लिए) *</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-semibold">100% सुरक्षित</span>
              </div>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="उदा: 9876543210@paytm / name@oksbi"
                className="w-full p-2.5 rounded-xl bg-stone-900 border border-amber-500/40 text-amber-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                required
              />
              <p className="text-[10px] text-stone-400 mt-1">
                जीतने पर पुरस्कार राशि सीधे इसी UPI खाते (PhonePe/GPay/Paytm) में भेजी जाएगी।
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer mt-4"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>
              {mode === 'signup' 
                ? `खाता बनाएँ व +${rules.signupBonus} बोनस अंक पाएँ →` 
                : 'लॉग इन करें →'}
            </span>
          </button>
        </form>

        {/* Security Assurance */}
        <div className="pt-2 border-t border-stone-800/80 text-center">
          <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>आपकी जानकारी व UPI ID पूर्णतः सुरक्षित हैं।</span>
          </p>
        </div>

      </div>
    </div>
  );
};
