import React, { useState, useEffect, useRef } from 'react';
import { Wallpaper, Quote } from '../types';
import { WALLPAPERS } from '../data/wallpapers';
import { QUOTES } from '../data/quotes';
import { X, Download, RefreshCw, Check } from 'lucide-react';

interface PosterMakerModalProps {
  initialWallpaper?: Wallpaper | null;
  initialQuoteText?: string;
  isOpen: boolean;
  onClose: () => void;
}

const GRADIENT_BACKGROUNDS = [
  { id: 'grad-saffron', name: 'भगवा स्वर्ण', style: 'linear-gradient(135deg, #7c2d12, #c2410c, #b45309)' },
  { id: 'grad-kailash', name: 'कैलाश नीला', style: 'linear-gradient(135deg, #082f49, #0f172a, #1e1b4b)' },
  { id: 'grad-mandir', name: 'मंदिर सिन्दूरी', style: 'linear-gradient(135deg, #881337, #4c0519, #2e1065)' },
  { id: 'grad-marigold', name: 'गेंदा पीतांबर', style: 'linear-gradient(135deg, #78350f, #a16207, #ca8a04)' }
];

const SACRED_SYMBOLS = ['ॐ', '卐', '🔱', '🪷', '🪔', '🚩'];

export const PosterMakerModal: React.FC<PosterMakerModalProps> = ({
  initialWallpaper,
  initialQuoteText,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [selectedBgType, setSelectedBgType] = useState<'wallpaper' | 'gradient'>(
    initialWallpaper ? 'wallpaper' : 'wallpaper'
  );
  const [selectedWallpaperId, setSelectedWallpaperId] = useState<string>(
    initialWallpaper?.id || WALLPAPERS[0].id
  );
  const [selectedGradient, setSelectedGradient] = useState<string>(GRADIENT_BACKGROUNDS[0].id);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1'>('9:16');
  
  const [quoteText, setQuoteText] = useState<string>(
    initialQuoteText || QUOTES[0].hindiText
  );
  const [authorText, setAuthorText] = useState<string>('शुभकामनाएँ सहित');
  const [fontSize, setFontSize] = useState<number>(28);
  const [fontFamily, setFontFamily] = useState<'Rozha One' | 'Poppins' | 'Cinzel'>('Rozha One');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('ॐ');
  const [showGoldenBorder, setShowGoldenBorder] = useState<boolean>(true);
  const [textDimOpacity, setTextDimOpacity] = useState<number>(0.65);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Re-draw canvas whenever properties change
  useEffect(() => {
    drawCanvas();
  }, [
    selectedBgType,
    selectedWallpaperId,
    selectedGradient,
    aspectRatio,
    quoteText,
    authorText,
    fontSize,
    fontFamily,
    selectedSymbol,
    showGoldenBorder,
    textDimOpacity
  ]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas dimensions
    const width = 1080;
    const height = aspectRatio === '9:16' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    const renderForeground = () => {
      // Background overlay scrim for legibility
      ctx.fillStyle = `rgba(10, 8, 6, ${textDimOpacity})`;
      ctx.fillRect(0, 0, width, height);

      // Golden ornate frame if enabled
      if (showGoldenBorder) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.strokeRect(36, 36, width - 72, height - 72);

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(48, 48, width - 96, height - 96);

        // Corner ornaments
        const cornerSize = 40;
        ctx.fillStyle = '#f59e0b';
        // Top-left
        ctx.fillRect(30, 30, cornerSize, 6);
        ctx.fillRect(30, 30, 6, cornerSize);
        // Top-right
        ctx.fillRect(width - 30 - cornerSize, 30, cornerSize, 6);
        ctx.fillRect(width - 36, 30, 6, cornerSize);
        // Bottom-left
        ctx.fillRect(30, height - 36, cornerSize, 6);
        ctx.fillRect(30, height - 30 - cornerSize, 6, cornerSize);
        // Bottom-right
        ctx.fillRect(width - 30 - cornerSize, height - 36, cornerSize, 6);
        ctx.fillRect(width - 36, height - 30 - cornerSize, 6, cornerSize);
      }

      // Sacred top symbol
      if (selectedSymbol) {
        ctx.font = '72px "Poppins", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fbbf24';
        const symbolY = aspectRatio === '9:16' ? 240 : 180;
        ctx.fillText(selectedSymbol, width / 2, symbolY);
      }

      // Main Quote Text Wrapping
      const effectiveFontSize = fontSize * (width / 450);
      ctx.font = `600 ${effectiveFontSize}px "${fontFamily}", "Poppins", sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';

      const maxWidth = width - 240;
      const lineHeight = effectiveFontSize * 1.5;
      const words = quoteText.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      // Calculate vertical start
      const totalTextHeight = lines.length * lineHeight;
      const startY = (height - totalTextHeight) / 2 + (aspectRatio === '9:16' ? 40 : 20);

      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineHeight);
      });

      // Subtle divider line
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      const divY = startY + totalTextHeight + 40;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 80, divY);
      ctx.lineTo(width / 2 + 80, divY);
      ctx.stroke();

      // Author / Sender Tag
      if (authorText) {
        ctx.font = '500 32px "Poppins", sans-serif';
        ctx.fillStyle = '#fde68a';
        ctx.fillText(authorText, width / 2, divY + 50);
      }

      // Branding watermark
      ctx.font = '400 24px "Poppins", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('दिव्य दर्शन · सनातन वॉलपेपर व सुविचार', width / 2, height - (showGoldenBorder ? 70 : 50));
    };

    if (selectedBgType === 'wallpaper') {
      const activeWp = WALLPAPERS.find(w => w.id === selectedWallpaperId) || WALLPAPERS[0];
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activeWp.imageUrl;
      img.onload = () => {
        // Draw image cover
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width / 2) - (img.width / 2) * scale;
        const y = (height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        renderForeground();
      };
      img.onerror = () => {
        // Fallback gradient if image fails
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, width, height);
        renderForeground();
      };
    } else {
      // Draw selected gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (selectedGradient === 'grad-saffron') {
        grad.addColorStop(0, '#7c2d12');
        grad.addColorStop(0.5, '#c2410c');
        grad.addColorStop(1, '#78350f');
      } else if (selectedGradient === 'grad-kailash') {
        grad.addColorStop(0, '#082f49');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#1e1b4b');
      } else if (selectedGradient === 'grad-mandir') {
        grad.addColorStop(0, '#881337');
        grad.addColorStop(0.5, '#4c0519');
        grad.addColorStop(1, '#2e1065');
      } else {
        grad.addColorStop(0, '#78350f');
        grad.addColorStop(0.5, '#a16207');
        grad.addColorStop(1, '#ca8a04');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      renderForeground();
    }
  };

  const handleDownloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `DivyaDarshan_Status_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleRandomQuote = () => {
    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuoteText(random.hindiText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl my-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="बंद करें"
          className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-stone-950/70 border border-white/10 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Canvas Preview Area */}
        <div className="flex flex-1 items-center justify-center bg-stone-950 p-6 overflow-hidden">
          <div className="relative flex items-center justify-center max-h-[70vh] w-full">
            <canvas
              ref={canvasRef}
              className="max-h-[65vh] max-w-full rounded-2xl shadow-2xl border border-stone-800 object-contain"
            />
          </div>
        </div>

        {/* Right Editor Controls Form */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:w-[420px] border-t lg:border-t-0 lg:border-l border-stone-800 overflow-y-auto space-y-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                सुविचार स्टेटस व पोस्टर मेकर
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                वॉलपेपर और विचारों से अपना मनपसंद स्टेटस कार्ड तैयार करें
              </p>
            </div>

            {/* Ratio Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-300">आकार (Format):</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    aspectRatio === '9:16'
                      ? 'border-amber-500 bg-amber-600/20 text-amber-300'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white'
                  }`}
                >
                  9:16 (WhatsApp स्टेटस / स्टोरी)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    aspectRatio === '1:1'
                      ? 'border-amber-500 bg-amber-600/20 text-amber-300'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white'
                  }`}
                >
                  1:1 (WhatsApp DP / स्क्वायर)
                </button>
              </div>
            </div>

            {/* Background Source Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-stone-300">पृष्ठभूमि (Background):</label>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setSelectedBgType('wallpaper')}
                    className={`font-medium ${selectedBgType === 'wallpaper' ? 'text-amber-400 underline' : 'text-stone-500'}`}
                  >
                    भगवान वॉलपेपर
                  </button>
                  <button
                    onClick={() => setSelectedBgType('gradient')}
                    className={`font-medium ${selectedBgType === 'gradient' ? 'text-amber-400 underline' : 'text-stone-500'}`}
                  >
                    पावन रंग
                  </button>
                </div>
              </div>

              {selectedBgType === 'wallpaper' ? (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {WALLPAPERS.map(wp => (
                    <button
                      key={wp.id}
                      onClick={() => setSelectedWallpaperId(wp.id)}
                      className={`relative aspect-[9/16] w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        selectedWallpaperId === wp.id ? 'border-amber-400 scale-105' : 'border-stone-800 opacity-60'
                      }`}
                    >
                      <img src={wp.imageUrl} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_BACKGROUNDS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGradient(g.id)}
                      style={{ background: g.style }}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        selectedGradient === g.id ? 'border-amber-400 scale-105' : 'border-stone-800'
                      }`}
                      title={g.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quote Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-stone-300">सुविचार / संदेश:</label>
                <button
                  type="button"
                  onClick={handleRandomQuote}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>दूसरा सुविचार</span>
                </button>
              </div>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Author / Sender */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-300">प्रेषक / नाम (हस्ताक्षर):</label>
              <input
                type="text"
                value={authorText}
                onChange={(e) => setAuthorText(e.target.value)}
                placeholder="जैसे: आपका नाम / जय श्री राम"
                className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Symbol & Border Toggles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">पवित्र प्रतीक:</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {SACRED_SYMBOLS.map(sym => (
                    <button
                      key={sym}
                      onClick={() => setSelectedSymbol(selectedSymbol === sym ? '' : sym)}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm transition-all ${
                        selectedSymbol === sym
                          ? 'border-amber-500 bg-amber-600/30 text-amber-300'
                          : 'border-stone-800 bg-stone-950 text-stone-400'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">स्वर्ण फ्रेम:</label>
                <button
                  type="button"
                  onClick={() => setShowGoldenBorder(!showGoldenBorder)}
                  className={`w-full py-2 text-xs font-semibold rounded-lg border transition-all ${
                    showGoldenBorder
                      ? 'border-amber-500 bg-amber-600/20 text-amber-300'
                      : 'border-stone-800 bg-stone-950 text-stone-400'
                  }`}
                >
                  {showGoldenBorder ? 'स्वर्ण बॉर्डर चालू' : 'बिना बॉर्डर'}
                </button>
              </div>
            </div>

            {/* Text Contrast Dimmer slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-stone-400">
                <span>पृष्ठभूमि छाया (Contrast):</span>
                <span>{Math.round(textDimOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.9"
                step="0.05"
                value={textDimOpacity}
                onChange={(e) => setTextDimOpacity(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Download Button */}
          <div className="pt-2">
            <button
              onClick={handleDownloadPoster}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>पोस्टर डाउनलोड हो गया!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>HD स्टेटस डाउनलोड करें</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
