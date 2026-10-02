import React from 'react';
import { CheckCircle2, Share2, Sparkles, X, Download, Smartphone } from 'lucide-react';

interface StatusShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  captionText: string;
}

export const StatusShareModal: React.FC<StatusShareModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  captionText
}) => {
  if (!isOpen) return null;

  const handleOpenWhatsApp = () => {
    const waUrl = `whatsapp://send?text=${encodeURIComponent(captionText)}`;
    const webWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(captionText)}`;

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = waUrl;
    } else {
      window.open(webWaUrl, '_blank');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-stone-900 border-2 border-amber-500/40 p-5 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full bg-stone-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white font-serif">
          8K स्टेटस फोटो कार्ड तैयार!
        </h3>
        <p className="text-xs text-amber-300 font-medium mt-0.5">
          ✅ आपकी गैलरी / डाउनलोड में सेव हो गया है
        </p>

        {/* Image Preview thumbnail if available */}
        {imageUrl && (
          <div className="my-3.5 max-h-48 overflow-hidden rounded-xl border border-amber-500/30 shadow-lg mx-auto w-32 aspect-[9/16] bg-black">
            <img src={imageUrl} alt="8K Status Card" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Quick Instructions */}
        <div className="my-3 p-3 rounded-2xl bg-black/60 border border-stone-800 text-left text-xs space-y-1.5 text-stone-300">
          <p className="font-semibold text-amber-200 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>WhatsApp स्टेटस पर लगाने का तरीका:</span>
          </p>
          <p>1. नीचे दिए गए हरे बटन से <strong className="text-white">WhatsApp</strong> खोलें।</p>
          <p>2. <strong className="text-white">"Status"</strong> में जाकर गैलरी से यह 8K फोटो सेलेक्ट करें।</p>
          <p>3. कैप्शन पहले ही कॉपी हो चुका है, बस पेस्ट करके लगा दें!</p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenWhatsApp}
          className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>WhatsApp स्टेटस खोलें 🚀</span>
        </button>

      </div>
    </div>
  );
};
