import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface StickyWhatsAppChannelProps {
  channelUrl?: string;
  className?: string;
}

export const StickyWhatsAppChannel: React.FC<StickyWhatsAppChannelProps> = ({
  channelUrl = 'https://whatsapp.com/channel/0029VbCzmQCHrDZfjZlBGR3U',
  className = ''
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-full shadow-2xl shadow-emerald-950/60 border-2 border-white/40 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer group"
        title="WhatsApp चैनल जॉइन करें"
      >
        <WhatsAppIcon className="w-6 h-6 fill-current" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 ${className}`}>
        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/95 via-stone-900/95 to-emerald-950/95 border border-emerald-500/50 rounded-full px-3 py-2 shadow-2xl backdrop-blur-md">
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white font-bold text-xs hover:text-emerald-300 transition"
          >
            <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md">
              <WhatsAppIcon className="w-4 h-4 fill-current" />
            </div>
            <span>WhatsApp चैनल</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
          </a>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-stone-400 hover:text-white p-1"
            title="विस्तार करें"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 max-w-[340px] animate-slide-up ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c2419] via-[#121c17] to-[#0a1510] border-2 border-[#25D366]/60 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(37,211,102,0.25)] backdrop-blur-xl p-3 sm:p-3.5">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-[#25D366]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top bar with close/minimize */}
        <div className="flex items-start justify-between gap-2 mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-lg shadow-emerald-950/60 border border-white/20">
                <WhatsAppIcon className="w-5 h-5 fill-current" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-white text-xs sm:text-sm font-extrabold tracking-tight">
                  Shubhakamna Channel
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[10px] text-emerald-300/90 font-medium">
                🟢 रोज़ नए स्टेटस, शायरी व शुभकामना
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-lg hover:bg-white/5 transition"
              title="छोटा करें"
            >
              <span className="text-xs">_</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-lg hover:bg-white/5 transition"
              title="बंद करें"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-full mt-1 bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer group"
        >
          <WhatsAppIcon className="w-4 h-4 fill-stone-950" />
          <span className="text-stone-950">चैनल जॉइन करें (Free) 🚀</span>
          <ChevronRight className="w-4 h-4 text-stone-950 group-hover:translate-x-0.5 transition-transform" />
        </a>

      </div>
    </div>
  );
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}
