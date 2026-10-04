import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Headphones, 
  FastForward, 
  Rewind,
  Flame,
  Flower2,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface KathaParagraph {
  id: number;
  title: string;
  icon: string;
  text: string;
}

const KATHA_SECTIONS: KathaParagraph[] = [
  {
    id: 1,
    title: '१. नवरात्रि का पावन अर्थ और महत्व',
    icon: '🌸',
    text: 'नवरात्रि का अर्थ है नौ विशेष और अलौकिक रातें। सनातन धर्म में नवरात्रि केवल एक पर्व नहीं, बल्कि प्रकृति और पराशक्ति माँ जगदम्बा की आराधना का महापर्व है। वर्ष में ऋतु परिवर्तन के समय यह पर्व मनाया जाता है। इन नौ पवित्र रातों में ब्रह्मांड की समस्त सकारात्मक ऊर्जा जागृत होती है। जो भक्त सच्चे मन से माँ की शरण में जाते हैं, उनके जीवन के समस्त कष्ट, भय और नकारात्मकता समाप्त होकर सुख, शांति और समृद्धि की प्राप्ति होती है।'
  },
  {
    id: 2,
    title: '२. महिषासुर मर्दन की अमर पौराणिक कथा',
    icon: '🦁',
    text: 'प्राचीन काल में महिषासुर नामक एक अत्यंत शक्तिशाली असुर था। उसने भगवान ब्रह्मा की घोर तपस्या करके यह वरदान पा लिया कि त्रिलोकी में कोई भी देवता, दानव या पुरुष उसका वध नहीं कर सकेगा। इस वरदान के अहंकार में चूर होकर महिषासुर ने स्वर्ग लोक पर आक्रमण कर दिया और सभी देवताओं को स्वर्ग से निष्कासित कर दिया। तब भयभीत होकर सभी देवता ब्रह्मा, विष्णु और महादेव की शरण में पहुँचे। महिषासुर के अत्याचार को समाप्त करने के लिए त्रिदेवों सहित समस्त देवताओं के तेज से एक अलौकिक दिव्य शक्ति का प्राकट्य हुआ, जिसे आदिशक्ति माँ दुर्गा कहा गया।'
  },
  {
    id: 3,
    title: '३. नौ दिनों का भीषण महासंग्राम और विजय',
    icon: '⚔️',
    text: 'देवताओं ने माँ दुर्गा को अपने श्रेष्ठ दिव्यास्त्र समर्पित किए। भगवान शिव ने त्रिशूल, विष्णु जी ने सुदर्शन चक्र, वरुण देव ने शंख, अग्नि देव ने शक्ति, पवन देव ने धनुष-बाण और इंद्र देव ने वज्र दिया। इसके बाद माँ दुर्गा सिंह पर सवार होकर रणभूमि में पहुँचीं। महिषासुर और माँ दुर्गा के बीच लगातार नौ दिनों तक रोंगटे खड़े कर देने वाला भीषण युद्ध चला। अंततः आश्विन मास की शुक्ल पक्ष की नवमी-दशमी तिथि को माँ भगवती ने त्रिशूल से महिषासुर की छाती चीरकर उसका वध कर दिया। इसी कारण माँ को "महिषासुर मर्दिनी" कहा जाता है और बुराई पर अच्छाई की इस विजय को नवरात्रि के रूप में मनाया जाता है।'
  },
  {
    id: 4,
    title: '४. प्रभु श्री राम और शारदीय नवरात्रि का संबंध',
    icon: '🏹',
    text: 'रामायण काल में जब मर्यादा पुरुषोत्तम भगवान श्री राम रावण से युद्ध कर रहे थे, तब लंका विजय और माता सीता की मुक्ति के लिए उन्होंने समुद्र तट पर शारदीय नवरात्रि के नौ दिनों तक माँ चंडी की अखंड आराधना की थी। श्री राम ने माँ की पूजा में १०८ दुर्लभ नीलकमल अर्पित करने का संकल्प लिया था। परीक्षा लेने के लिए माँ ने एक कमल छिपा दिया। तब प्रभु श्री राम ने अपना एक नेत्र माँ के चरणों में अर्पित करने का निर्णय लिया। श्री राम की अटूट भक्ति देखकर माँ दुर्गा साक्षात प्रकट हुईं और उन्हें विजयश्री का वरदान दिया। दसवें दिन प्रभु श्री राम ने रावण का वध किया, जिसे विजयादशमी या दशहरा कहा जाता है।'
  },
  {
    id: 5,
    title: '५. माँ नवदुर्गा के ९ दिव्य स्वरूपों की महिमा',
    icon: '🪔',
    text: 'नवरात्रि में माँ भगवती के नौ दिव्य स्वरूपों की पूजा होती है: प्रथम दिन माँ शैलपुत्री, द्वितीय माँ ब्रह्मचारिणी, तृतीय माँ चंद्रघंटा, चतुर्थ माँ कूष्माण्डा, पंचम माँ स्कंदमाता, षष्ठ माँ कात्यायनी, सप्तम माँ कालरात्रि, अष्टम माँ महागौरी और नवम दिन माँ सिद्धिदात्री की आराधना की जाती है। माँ के ये नौ स्वरूप जीवन में बल, बुद्धि, आरोग्य, साहस, विद्या और समस्त सिद्धियाँ प्रदान करते हैं।'
  }
];

export const NavratriKathaAudioSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeParaIndex, setActiveParaIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.92);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalEstimatedSeconds] = useState<number>(240); // ~4 minutes total reading
  const [isExpandedStory, setIsExpandedStory] = useState<boolean>(true);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const droneAudioRef = useRef<AudioContext | null>(null);

  // Initialize Speech Synthesis and find natural female Indian voice
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopNarrator();
    };
  }, []);

  // Timer for elapsed seconds
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => Math.min(prev + 1, totalEstimatedSeconds));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalEstimatedSeconds]);

  // Ambient temple tanpura drone audio synthesis
  const startDrone = () => {
    try {
      if (isAudioMuted || droneAudioRef.current) return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      droneAudioRef.current = ctx;

      // Soft Tanpura Frequencies (C# Root 138.59Hz & G# 207.65Hz)
      [138.59, 207.65, 277.18].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      });
    } catch {}
  };

  const stopDrone = () => {
    try {
      if (droneAudioRef.current) {
        droneAudioRef.current.close();
        droneAudioRef.current = null;
      }
    } catch {}
  };

  // Find best Natural Female Hindi voice
  const getFemaleHindiVoice = (): SpeechSynthesisVoice | null => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    
    // Priority: Indian Female Hindi voices (Google हिन्दी, Swara, Lekha, etc.)
    const preferred = voices.find(v => 
      (v.lang.includes('hi') || v.lang.includes('HI')) && 
      (v.name.toLowerCase().includes('female') || 
       v.name.toLowerCase().includes('swara') || 
       v.name.toLowerCase().includes('lekha') || 
       v.name.toLowerCase().includes('kalpana') ||
       v.name.toLowerCase().includes('heera') ||
       v.name.toLowerCase().includes('google') ||
       v.name.toLowerCase().includes('natural'))
    );

    if (preferred) return preferred;

    // Fallback: Any Hindi voice
    const anyHindi = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    if (anyHindi) return anyHindi;

    // Fallback: Indian English female voice (pronounces Devanagari reasonably)
    const indianEn = voices.find(v => v.lang.includes('IN') && v.name.toLowerCase().includes('female'));
    if (indianEn) return indianEn;

    return voices[0] || null;
  };

  const speakParagraph = (index: number) => {
    if (!synthRef.current || index >= KATHA_SECTIONS.length) {
      setIsPlaying(false);
      stopDrone();
      return;
    }

    synthRef.current.cancel();

    const para = KATHA_SECTIONS[index];
    const textToRead = `${para.title}। ${para.text}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Natural Female Pitch & Sweet Melodic Cadence (like a real girl narrating sacred katha)
    utterance.pitch = 1.18; // Sweet, natural feminine pitch (avoids robotic drone)
    utterance.rate = playbackSpeed; // Slightly measured, respectful storytelling speed
    utterance.volume = isAudioMuted ? 0 : 1.0;

    const voice = getFemaleHindiVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (index + 1 < KATHA_SECTIONS.length) {
        setActiveParaIndex(index + 1);
        speakParagraph(index + 1);
      } else {
        setIsPlaying(false);
        stopDrone();
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      stopDrone();
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    startDrone();
  };

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      speakParagraph(activeParaIndex);
    } else {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsPlaying(false);
      stopDrone();
    }
  };

  const handleRewind = () => {
    const nextIdx = Math.max(0, activeParaIndex - 1);
    setActiveParaIndex(nextIdx);
    setElapsedSeconds(Math.max(0, elapsedSeconds - 30));
    if (isPlaying) {
      speakParagraph(nextIdx);
    }
  };

  const handleForward = () => {
    const nextIdx = Math.min(KATHA_SECTIONS.length - 1, activeParaIndex + 1);
    setActiveParaIndex(nextIdx);
    setElapsedSeconds(Math.min(totalEstimatedSeconds, elapsedSeconds + 30));
    if (isPlaying) {
      speakParagraph(nextIdx);
    }
  };

  const handleRestart = () => {
    setActiveParaIndex(0);
    setElapsedSeconds(0);
    if (isPlaying) {
      speakParagraph(0);
    }
  };

  const handleSelectParagraph = (idx: number) => {
    setActiveParaIndex(idx);
    if (isPlaying) {
      speakParagraph(idx);
    }
  };

  const toggleMute = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    if (nextMute) {
      if (utteranceRef.current) utteranceRef.current.volume = 0;
      stopDrone();
    } else {
      if (utteranceRef.current) utteranceRef.current.volume = 1.0;
      startDrone();
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      speakParagraph(activeParaIndex);
    }
  };

  const stopNarrator = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    stopDrone();
    setIsPlaying(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full space-y-6 my-6 animate-fadeIn">
      
      {/* 🌸 MAIN KATHA AUDIO PLAYER CARD 🌸 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/50 shadow-2xl p-4 sm:p-6 text-left">
        
        {/* Glow ambient background aura */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/90 to-amber-600/90 text-white text-xs font-black shadow-md border border-amber-400/40 mb-2">
              <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>श्री दुर्गा सप्तशती • पावन पौराणिक आख्यान</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-200 font-serif leading-tight">
              माँ दुर्गा एवं नवरात्रि की संपूर्ण पौराणिक कथा
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              नवरात्रि क्यों मनाई जाती है? महिषासुर वध एवं श्री राम दुर्गा पूजा का अलौकिक इतिहास
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-300 bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 font-bold">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>मधुर कथावाचन</span>
            </span>
          </div>
        </div>

        {/* 🎧 Interactive Audio Player Control Bar ("User ke hath me") */}
        <div className="relative z-10 my-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border border-amber-500/40 shadow-inner flex flex-col gap-3">
          
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {isPlaying && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-emerald-500' : 'bg-stone-600'}`}></span>
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-amber-200">
                {isPlaying ? '🎙️ कथा का मधुर पाठ जारी है (सुनते रहें)...' : '🎧 "नवरात्रि की कथा सुनें" (प्ले बटन दबाएँ)'}
              </span>
            </div>

            {/* Audio Speed Options */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-stone-400 font-bold hidden sm:inline">गति:</span>
              {[0.88, 1.0, 1.15].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer border ${
                    playbackSpeed === speed
                      ? 'bg-amber-500 text-stone-950 border-amber-400'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-600'
                  }`}
                >
                  {speed === 0.88 ? 'शांत' : speed === 1.0 ? '1x' : '1.15x'}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar & Seek */}
          <div className="space-y-1">
            <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden border border-stone-800">
              <div 
                className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 h-full transition-all duration-300 ease-linear rounded-full shadow-md"
                style={{ width: `${(elapsedSeconds / totalEstimatedSeconds) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span>{formatTime(elapsedSeconds)}</span>
              <span className="text-amber-300/80">अध्याय {activeParaIndex + 1} / {KATHA_SECTIONS.length}</span>
              <span>~{formatTime(totalEstimatedSeconds)}</span>
            </div>
          </div>

          {/* Main Playback Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRewind}
                title="पिछला अध्याय"
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition cursor-pointer border border-stone-700"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlay}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-stone-950" />
                    <span>कथा रोकें (Pause)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-stone-950" />
                    <span>कथा सुनें (Play Audio)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleForward}
                title="अगला अध्याय"
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition cursor-pointer border border-stone-700"
              >
                <FastForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                title="शुरुआत से सुनें"
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition cursor-pointer border border-stone-700"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={toggleMute}
              title={isAudioMuted ? 'अनम्यूट करें' : 'म्यूट करें'}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-amber-300 transition cursor-pointer border border-stone-700"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 📖 Complete Katha Paragraphs with Realtime Highlighting */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-300/80 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>कथा प्रसंग (क्लिक करके सीधे सुनें):</span>
            </h3>
            <button
              onClick={() => setIsExpandedStory(!isExpandedStory)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>{isExpandedStory ? 'संक्षिप्त करें' : 'पूरी कथा पढ़ें'}</span>
              {isExpandedStory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-3">
            {KATHA_SECTIONS.map((para, idx) => {
              const isActive = activeParaIndex === idx;
              if (!isExpandedStory && !isActive && idx > 1) return null;

              return (
                <div
                  key={para.id}
                  onClick={() => handleSelectParagraph(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-950/90 border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/50'
                      : 'bg-stone-950/80 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isActive ? 'text-amber-300 font-serif' : 'text-stone-200'}`}>
                      <span>{para.icon}</span>
                      <span>{para.title}</span>
                    </h4>
                    {isActive && isPlaying && (
                      <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shrink-0">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        <span>वाचन जारी</span>
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isActive ? 'text-amber-50 font-medium' : 'text-stone-300'}`}>
                    {para.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ⚖️ NAVRATRI DO'S & DON'TS (क्या करें और क्या न करें) ⚖️ */}
      <div className="rounded-3xl bg-stone-950 border-2 border-stone-800 shadow-2xl p-5 sm:p-7 text-left space-y-5">
        
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>नवरात्रि व्रत एवं साधना नियमावली</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-200 font-serif">
            नवरात्रि में क्या करें और क्या न करें? (Do's & Don'ts)
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            शास्त्रसम्मत नियमों का पालन करने से माँ भगवती की असीम कृपा और मनोवांछित फल की प्राप्ति होती है
          </p>
        </div>

        {/* 2-Column Grid: Do's (Green) and Don'ts (Red) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ✅ क्या करें (DO'S) */}
          <div className="rounded-2xl bg-gradient-to-b from-emerald-950/40 via-stone-900 to-emerald-950/20 border-2 border-emerald-500/40 p-4 sm:p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/30">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-emerald-300">
                  क्या अवश्य करें? (Do's)
                </h4>
                <p className="text-[11px] text-emerald-200/70">पुण्य और आशीर्वाद प्रदाता नियम</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">१.</span>
                <span><strong>घटस्थापना (कलश स्थापना):</strong> प्रतिपदा तिथि के दिन शुभ मुहूर्त में घर के ईशान कोण (उत्तर-पूर्व) में कलश स्थापना करें।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">२.</span>
                <span><strong>अखंड ज्योति प्रज्ज्वलन:</strong> यदि संभव हो तो नौ दिनों तक अखंड दीपक प्रज्वलित रखें, इससे घर का वास्तु दोष और दरिद्रता दूर होती है।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">३.</span>
                <span><strong>सात्विक फलाहार:</strong> व्रत के दौरान कुट्टू का आटा, सिंघाड़ा, सेंधा नमक, फल और दूध जैसे शुद्ध सात्विक पदार्थों का सेवन करें।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">४.</span>
                <span><strong>दुर्गा सप्तशती व मंत्र जप:</strong> प्रतिदिन माँ दुर्गा के नवार्ण मंत्र <em>'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे'</em> अथवा दुर्गा चालीसा का पाठ करें।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">५.</span>
                <span><strong>कन्या पूजन (कंजक):</strong> अष्टमी या नवमी को नौ छोटी कन्याओं को साक्षात नवदुर्गा मानकर चरण स्पर्श कर हलवा-चना-पूरी का भोग लगाएँ।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">६.</span>
                <span><strong>स्वच्छता व लाल वस्त्र:</strong> पूजा के समय स्वच्छ लाल, पीले अथवा चमकीले वस्त्र धारण करें जो शक्ति और उमंग का प्रतीक हैं।</span>
              </li>
            </ul>
          </div>

          {/* ❌ क्या न करें (DON'TS) */}
          <div className="rounded-2xl bg-gradient-to-b from-rose-950/40 via-stone-900 to-rose-950/20 border-2 border-rose-500/40 p-4 sm:p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-rose-500/30">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-black">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-rose-300">
                  क्या भूलकर भी न करें? (Don'ts)
                </h4>
                <p className="text-[11px] text-rose-200/70">साधना भंग करने वाले वर्जित कर्म</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">१.</span>
                <span><strong>तामसिक भोजन वर्जित:</strong> पूरे घर में लहसुन, प्याज, मांसाहार और मदिरा का पूर्णतः त्याग रखें। सादा भोजन ही बनाएँ।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">२.</span>
                <span><strong>बाल व नाखून न काटें:</strong> नवरात्रि के नौ दिनों तक बाल कटवाना, शेविंग (दाढ़ी) बनवाना और नाखून काटना शास्त्रों में वर्जित है।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">३.</span>
                <span><strong>चमड़े (Leather) की वस्तुएँ:</strong> पूजा स्थल पर या मंदिर में बेल्ट, चमड़े का पर्स या जूते-चप्पल लेकर प्रवेश न करें।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">४.</span>
                <span><strong>क्रोध, कलह और अपशब्द:</strong> किसी पर क्रोध न करें, झूठ न बोलें और घर में शांति व सौहार्द का वातावरण बनाए रखें।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">५.</span>
                <span><strong>घर को खाली न छोड़ें:</strong> यदि आपने घर में अखंड ज्योति जलाई है या घटस्थापना की है, तो घर को कभी भी ताला लगाकर पूरी तरह सूना न छोड़ें।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">६.</span>
                <span><strong>दिन में सोने से बचें:</strong> व्रत रखने वाले साधकों को दिन के समय सोने से बचना चाहिए और अपना मन देवी के स्मरण में लगाना चाहिए।</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Shloka Capsule */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center">
          <p className="text-xs sm:text-sm font-serif font-bold text-amber-200">
            ॥ सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            माँ दुर्गा आप सभी के घर-परिवार में सुख, आरोग्य, समृद्धि और ऐश्वर्य का वास करें। जय माता दी! 🚩
          </p>
        </div>

      </div>

    </div>
  );
};
