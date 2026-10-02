import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Flame,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface DomainSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainSetupGuideModal: React.FC<DomainSetupGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeHostingTab, setActiveHostingTab] = useState<'cloudflare' | 'vercel'>('cloudflare');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-stone-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                Shubhakamna.in को Cloudflare पर Live करें
              </h2>
              <p className="text-xs text-amber-300/80">
                100% मुफ़्त • Unlimited Traffic • ₹0 आजीवन खर्च
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-stone-950 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveHostingTab('cloudflare')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeHostingTab === 'cloudflare'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Cloudflare Pages (अनुशंसित - Unlimited Free)</span>
          </button>
          <button
            onClick={() => setActiveHostingTab('vercel')}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeHostingTab === 'vercel'
                ? 'bg-stone-800 text-white'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Vercel (वैकल्पिक)
          </button>
        </div>

        <div className="space-y-5 pt-4 text-xs sm:text-sm">
          
          {activeHostingTab === 'cloudflare' ? (
            <>
              {/* Cloudflare Highlight */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <strong className="text-amber-300">Cloudflare Pages क्यों?</strong> इसमें <strong>अनलिमिटेड ट्रैफिक (Unlimited Bandwidth)</strong> हमेशा के लिए ₹0 मुफ़्त है। चाहे दिवाली पर 1 करोड़ लोग आ जाएँ, ₹1 का बिल नहीं आएगा!
                </div>
              </div>

              {/* Step 1: Sign up on Cloudflare */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">1</span>
                  <span>चरण 1: Cloudflare पर मुफ़्त खाता बनाएँ</span>
                </div>
                <p className="text-stone-300 text-xs leading-relaxed pl-8">
                  ब्राउज़र में खोलें: <a href="https://dash.cloudflare.com/sign-up" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">dash.cloudflare.com/sign-up</a> और अपनी ईमेल आईडी डालकर ₹0 में साइनअप कर लें। (कोई क्रेडिट कार्ड नहीं चाहिए!)
                </p>
              </div>

              {/* Step 2: Workers & Pages */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">2</span>
                  <span>चरण 2: Pages पर जाकर GitHub जोड़ें</span>
                </div>
                <div className="text-stone-300 text-xs leading-relaxed pl-8 space-y-2">
                  <p>1. बाएँ मेन्यू में <strong>"Workers & Pages"</strong> पर क्लिक करें।</p>
                  <p>2. नीले बटन <strong>"Create application"</strong> ➔ <strong>"Pages"</strong> ➔ <strong>"Connect to Git"</strong> पर क्लिक करें।</p>
                  <p>3. अपने GitHub से इस प्रोजेक्ट को चुन लें।</p>
                </div>

                {/* Build Settings Box */}
                <div className="ml-8 p-3 rounded-xl bg-black/60 border border-stone-800 space-y-2">
                  <div className="text-[11px] font-bold text-amber-300">⚙️ Build Settings (यह भरें):</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px]">Framework preset:</span>
                      <div className="font-mono text-white bg-stone-900 px-2 py-1 rounded">Vite</div>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px]">Build output directory:</span>
                      <div className="font-mono text-white bg-stone-900 px-2 py-1 rounded">dist</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400">नीचे <strong>"Save and Deploy"</strong> दबा दें। 30 सेकंड में वेबसाइट लाइव हो जाएगी!</p>
                </div>
              </div>

              {/* Step 3: Connect GoDaddy Domain */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">3</span>
                  <span>चरण 3: GoDaddy से Shubhakamna.in जोड़ें</span>
                </div>
                <div className="text-stone-300 text-xs leading-relaxed pl-8 space-y-2">
                  <p>1. Cloudflare प्रोजेक्ट में ऊपर <strong>"Custom domains"</strong> टैब पर क्लिक करें।</p>
                  <p>2. <strong>"Set up a custom domain"</strong> पर क्लिक करके अपना डोमेन डालें: <strong className="text-amber-300">Shubhakamna.in</strong></p>
                  <p>3. GoDaddy में DNS रिकॉर्ड्स डालें:</p>

                  <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400">Type: CNAME | Name: @ या www</div>
                      <div className="font-mono text-amber-300 text-xs">your-project.pages.dev</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard('CNAME', 'cname_val')}
                      className="px-2 py-1 rounded bg-stone-800 text-stone-200 text-xs hover:bg-stone-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'cname_val' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>कॉपी</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Vercel Guide */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">1</span>
                  <span>Vercel में डोमेन जोड़ें</span>
                </div>
                <p className="text-stone-300 text-xs leading-relaxed pl-8">
                  Vercel प्रोजेक्ट की <strong>Settings ➔ Domains</strong> में जाकर <code className="text-amber-300">Shubhakamna.in</code> जोड़ें।
                </p>
                <div className="ml-8 p-3 rounded-xl bg-black/60 border border-stone-800 space-y-2 text-xs">
                  <div className="text-stone-400">GoDaddy DNS में A Record:</div>
                  <div className="flex items-center justify-between">
                    <code className="text-amber-300 font-mono">76.76.21.21</code>
                    <button
                      onClick={() => copyToClipboard('76.76.21.21', 'v_ip')}
                      className="px-2 py-1 rounded bg-stone-800 text-xs hover:bg-stone-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'v_ip' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>कॉपी</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom Success note */}
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>डोमेन जुड़ने के 10-15 मिनट में आपकी वेबसाइट पूरी दुनिया में लाइव हो जाएगी!</span>
          </div>

        </div>
      </div>
    </div>
  );
};
