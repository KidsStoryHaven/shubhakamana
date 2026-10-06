import React, { useState } from 'react';
import { getDaily100Suvichar, SUVICHAR_BACKGROUNDS, SuvicharItem } from '../data/dailySuvicharData';
import { generateSuvicharCardBlob } from '../utils/generateSuvicharCard';
import { SUVICHAR_STYLES } from '../data/suvicharStylesData';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Settings, 
  Key, 
  FolderPlus, 
  Play, 
  Pause, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Globe,
  FileText,
  ShieldCheck
} from 'lucide-react';

interface PinterestLogItem {
  id: number;
  suvicharNumber: number;
  title: string;
  status: 'pending' | 'publishing' | 'success' | 'error';
  pinId?: string;
  pinLink?: string;
  errorMsg?: string;
  isPureUrlPin?: boolean;
}

export const PinterestAutoPublisher: React.FC = () => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('shubhakamna_pinterest_token') || '4ff1fb45b5fabaabdccdbaed60a5772a77de7188');
  const [boardId, setBoardId] = useState(() => localStorage.getItem('shubhakamna_pinterest_board') || 'https://pin.it/2deDHysm8');
  const [delaySeconds, setDelaySeconds] = useState(2);
  const [pureUrlRatio, setPureUrlRatio] = useState(15); // 15 out of 100 pins have pure website URL
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logs, setLogs] = useState<PinterestLogItem[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  const saveSettings = () => {
    localStorage.setItem('shubhakamna_pinterest_token', accessToken.trim());
    localStorage.setItem('shubhakamna_pinterest_board', boardId.trim());
    setStatusMessage('✅ Pinterest API सेटिंग्स सुरक्षित कर ली गईं!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const publishSinglePin = async (
    suvichar: SuvicharItem,
    isPureUrl: boolean,
    token: string,
    bId: string
  ): Promise<{ pinId: string; link: string }> => {
    // 1. Generate 8K Card Image Blob / Base64
    const bg = SUVICHAR_BACKGROUNDS[suvichar.number % SUVICHAR_BACKGROUNDS.length] || SUVICHAR_BACKGROUNDS[0];
    const style = SUVICHAR_STYLES[suvichar.number % SUVICHAR_STYLES.length] || SUVICHAR_STYLES[0];

    const cardResult = await generateSuvicharCardBlob({
      suvichar,
      background: bg,
      senderName: 'Shubhakamna.in',
      aspectRatio: 'story',
      language: 'hindi',
      styleId: style.id,
      showDayAndTime: false
    });

    // Convert Blob to Base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(cardResult.blob);
    });

    // 2. Prepare Pinterest Title & Description with Keywords & Hashtags
    const websiteUrl = 'https://www.shubhakamna.in/';
    const suvicharWishUrl = `https://www.shubhakamna.in/shubh-prabhat?w=${suvichar.number}`;

    let title = `🌅 शुभ प्रभात विचार #${suvichar.number} • Shubhakamna.in`;
    let description = `आज का पावन सुविचार #${suvichar.number}: "${suvichar.hindiText}". अपने नाम व फोटो का 3D सुविचार कार्ड मुफ़्त बनाएँ ➔ ${websiteUrl} #shubhprabhat #suvichar #goodmorning #shubhakamna #hindi #quotes #positivity`;
    let destinationLink = suvicharWishUrl;

    if (isPureUrl) {
      // 15 Pins out of 100 will have pure direct website homepage URL
      destinationLink = websiteUrl;
      title = `✨ Shubhakamna.in - भारत का पावन शुभकामना पोर्टल`;
      description = `👉 यहाँ से अपने नाम व फोटो की जादुई विशिंग लिंक और 3D सुविचार कार्ड मुफ़्त बनाएँ ➔ ${websiteUrl}`;
    }

    // 3. Post to Server Pinterest Endpoint
    const res = await fetch('/api/pinterest/publish-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: token,
        boardId: bId,
        title,
        description,
        link: destinationLink,
        imageBase64: base64Data
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Pinterest API Error');
    }

    return { pinId: data.pinId, link: data.link };
  };

  const startBulkPublishing = async () => {
    if (!accessToken.trim() || !boardId.trim()) {
      alert('कृपया Pinterest Access Token (API Key) और Board ID दर्ज करें!');
      return;
    }

    saveSettings();
    setIsPublishing(true);
    setIsPaused(false);

    const todaysItems = getDaily100Suvichar();

    // Identify indices that will be pure URL pins (e.g. 15 pins evenly spaced)
    const pureIndices = new Set<number>();
    const step = Math.floor(100 / pureUrlRatio);
    for (let i = 0; i < pureUrlRatio; i++) {
      pureIndices.add((i * step) % 100);
    }

    // Initial log state
    const initialLogs: PinterestLogItem[] = todaysItems.map((s: SuvicharItem, idx: number) => ({
      id: s.id,
      suvicharNumber: s.number,
      title: `सुविचार #${s.number}: ${s.hindiText.substring(0, 30)}...`,
      status: 'pending',
      isPureUrlPin: pureIndices.has(idx)
    }));

    setLogs(initialLogs);

    const token = accessToken.trim();
    const bId = boardId.trim();

    for (let i = currentIndex; i < todaysItems.length; i++) {
      if (isPaused) {
        setCurrentIndex(i);
        break;
      }

      const suvichar = todaysItems[i];
      const isPure = pureIndices.has(i);

      // Update log to publishing
      setLogs(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'publishing' } : item));

      try {
        const result = await publishSinglePin(suvichar, isPure, token, bId);
        setLogs(prev => prev.map((item, idx) => idx === i ? { 
          ...item, 
          status: 'success', 
          pinId: result.pinId, 
          pinLink: result.link 
        } : item));
      } catch (err: any) {
        setLogs(prev => prev.map((item, idx) => idx === i ? { 
          ...item, 
          status: 'error', 
          errorMsg: err.message || 'Publishing failed' 
        } : item));
      }

      // Delay between pins to avoid API rate limits
      await new Promise(r => setTimeout(r, delaySeconds * 1000));
    }

    setIsPublishing(false);
  };

  const completedCount = logs.filter(l => l.status === 'success').length;
  const errorCount = logs.filter(l => l.status === 'error').length;
  const progressPercent = Math.round((logs.filter(l => l.status === 'success' || l.status === 'error').length / 100) * 100);

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-stone-900 to-red-950/80 border-2 border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/40">
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          <span>📌 Pinterest Automatic Daily 100 Suvichar Publisher Engine</span>
        </div>

        <h2 className="text-2xl font-black text-white font-serif">
          📌 दैनिक १०० सुविचार - ऑटोमैटिक पिन पब्लिशर
        </h2>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
          आपकी वेबसाइट `Shubhakamna.in` के दैनिक 100 सुविचारों को <strong>1-क्लिक में आपके Pinterest बोर्ड पर HD फ़ोटो कार्ड</strong>, वॉटरमार्क (`www.shubhakamna.in`), टाइटल्स, डिस्क्रिप्शन और कीवर्ड्स के साथ ऑटोमैटिक पब्लिश करें।
        </p>

        {statusMessage && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl animate-fadeIn">
            {statusMessage}
          </div>
        )}
      </div>

      {/* API Credentials Configuration Panel */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-amber-300 font-serif flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <span>Pinterest API Credentials & Options</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Pinterest Access Token (API Key / Bearer Token):
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="p.A0123456789abcdef..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Pinterest Board ID या Board Link (e.g. pin.it/2deDHysm8):
            </label>
            <input
              type="text"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              placeholder="https://pin.it/2deDHysm8 या 123456789012345678"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-amber-400/80 mt-1">
              ✓ आप सीधे अपने Board का लिंक (`https://pin.it/2deDHysm8`) भी यहाँ डाल सकते हैं!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              डायरेक्ट वेबसाइट URL पिन्स का अनुपात (100 में से):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="30"
                value={pureUrlRatio}
                onChange={(e) => setPureUrlRatio(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-black text-amber-400 shrink-0">
                {pureUrlRatio} / 100 Pins
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-1">
              {pureUrlRatio} पिन्स पर सीधे वेबसाइट का होमपेज URL (`https://www.shubhakamna.in/`) सेट होगा।
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              पिन्स के बीच अंतराल समय (Delay Seconds):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={delaySeconds}
                onChange={(e) => setDelaySeconds(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-black text-amber-400 shrink-0">
                {delaySeconds} सेकेंड
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={saveSettings}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl border border-stone-700 cursor-pointer transition"
          >
            सेटिंग्स सेव करें
          </button>

          <button
            onClick={startBulkPublishing}
            disabled={isPublishing}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-900/40 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>100 पिन्स पब्लिश हो रहे हैं ({progressPercent}%)...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>🚀 100 सुविचार अभी पब्लिश करें</span>
              </>
            )}
          </button>

          <button
            onClick={async () => {
              if (!accessToken || !boardId) {
                alert('कृपया Access Token और Board ID दर्ज करें!');
                return;
              }
              try {
                const res = await fetch('/api/pinterest/start-schedule', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    accessToken,
                    boardId,
                    intervalMinutes: 10,
                    promotionalPercentage: pureUrlRatio
                  })
                });
                const data = await res.json();
                if (data.success) {
                  setStatusMessage('⚡ सर्वर-साइड ऑटोमैटिक बैकग्राउंड शेड्यूलर चालू हो गया!');
                } else {
                  alert(data.message || 'Error starting scheduler');
                }
              } catch (err: any) {
                alert(err.message);
              }
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>⚡ बैकएंड सर्वर ऑटो-शेड्यूलर स्टार्ट करें (24x7)</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Logs */}
      {logs.length > 0 && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>पब्लिशिंग प्रोग्रेस (Live Ticker)</span>
            </h3>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-emerald-400">✓ {completedCount} सफल</span>
              {errorCount > 0 && <span className="text-rose-400">✕ {errorCount} त्रुटि</span>}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-950 rounded-full h-3 overflow-hidden border border-stone-800">
            <div 
              className="bg-gradient-to-r from-amber-500 via-red-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Log List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                  log.status === 'success' 
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
                    : log.status === 'error'
                      ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                      : log.status === 'publishing'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200 animate-pulse'
                        : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono font-bold text-amber-400">#{log.suvicharNumber}</span>
                  <span className="truncate">{log.title}</span>
                  {log.isPureUrlPin && (
                    <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded border border-purple-500/30 shrink-0">
                      Direct Website URL
                    </span>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {log.status === 'success' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {log.pinLink && (
                        <a 
                          href={log.pinLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:underline text-amber-300 flex items-center gap-1 font-bold text-[11px]"
                        >
                          <span>Pin देखें</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </>
                  )}

                  {log.status === 'error' && (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{log.errorMsg}</span>
                    </span>
                  )}

                  {log.status === 'publishing' && (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>पब्लिश हो रहा है...</span>
                    </span>
                  )}

                  {log.status === 'pending' && (
                    <span className="text-stone-500">प्रतीक्षारत...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
