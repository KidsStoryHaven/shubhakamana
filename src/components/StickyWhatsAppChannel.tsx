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

  if (isDismissed) return null;

  return (
    <aside 
      aria-label="WhatsApp Channel"
      className={`fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 animate-slide-up ${className}`}
    >
      <div className="flex items-center gap-2 bg-[#0c2419]/95 hover:bg-[#0c2419] border border-[#25D366]/60 hover:border-[#25D366] rounded-full pl-2 pr-3 py-1.5 shadow-[0_6px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(37,211,102,0.25)] backdrop-blur-md transition-all group">
        
        {/* WhatsApp Icon with Live Ping Badge */}
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white font-extrabold text-xs transition cursor-pointer"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
              <WhatsAppIcon className="w-4 h-4 fill-current" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>

          <div className="flex flex-col text-left leading-tight">
            <span className="text-[11px] font-black text-white group-hover:text-emerald-300 transition flex items-center gap-1">
              <span>चैनल जॉइन करें</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            </span>
            <span className="text-[9px] text-emerald-300/80 font-medium">
              रोज़ नई शुभकामनाएँ
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
        </a>

        {/* Small Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer ml-1"
          title="हटाएँ"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.678.15-.2.301-.777.979-.953 1.179-.176.201-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.897-.798-1.503-1.784-1.679-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.201.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.235-.245-.589-.494-.509-.678-.518-.176-.01-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.229 3.111c.15.201 2.124 3.243 5.146 4.549.719.311 1.28.497 1.718.636.723.23 1.38.197 1.9.12.579-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352z"/>
    <path d="M12.004 0C5.385 0 0 5.385 0 12.004c0 2.112.551 4.17 1.597 5.986L.071 23.931l6.09-1.598a11.968 11.968 0 005.843 1.517h.005c6.619 0 12.004-5.385 12.004-12.004A11.936 11.936 0 0012.004 0zm0 21.848h-.004a9.924 9.924 0 01-5.06-1.387l-.363-.215-3.763.987.995-3.669-.236-.375a9.923 9.923 0 01-1.521-5.185c0-5.485 4.463-9.948 9.952-9.948a9.907 9.907 0 017.039 2.916 9.909 9.909 0 012.912 7.036c0 5.486-4.463 9.95-9.952 9.95z"/>
  </svg>
);
