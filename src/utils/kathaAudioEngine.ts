import { festiveAudio } from './festiveAudio';

export interface KathaParagraph {
  id: number;
  title: string;
  icon: string;
  text: string;
}

export const KATHA_SECTIONS: KathaParagraph[] = [
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

type KathaStateListener = (state: {
  isPlaying: boolean;
  activeParaIndex: number;
  elapsedSeconds: number;
  speed: number;
}) => void;

class KathaAudioEngine {
  private isPlaying = false;
  private activeParaIndex = 0;
  private speed = 0.92;
  private isMuted = false;
  private elapsedSeconds = 0;
  private listeners: Set<KathaStateListener> = new Set();
  private timer: NodeJS.Timeout | null = null;
  private droneCtx: AudioContext | null = null;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: KathaStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      activeParaIndex: this.activeParaIndex,
      elapsedSeconds: this.elapsedSeconds,
      speed: this.speed
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(s);
      } catch {}
    });
  }

  private getFemaleVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    const preferred = voices.find(v => 
      (v.lang.includes('hi') || v.lang.includes('HI')) && 
      (v.name.toLowerCase().includes('female') || 
       v.name.toLowerCase().includes('swara') || 
       v.name.toLowerCase().includes('lekha') || 
       v.name.toLowerCase().includes('kalpana') ||
       v.name.toLowerCase().includes('google') ||
       v.name.toLowerCase().includes('natural'))
    );
    if (preferred) return preferred;
    const anyHi = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    if (anyHi) return anyHi;
    return voices.find(v => v.lang.includes('IN')) || voices[0] || null;
  }

  private startTanpura() {
    if (this.isMuted || this.droneCtx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      this.droneCtx = ctx;

      [138.59, 207.65, 277.18].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.012, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(360, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      });
    } catch {}
  }

  private stopTanpura() {
    try {
      if (this.droneCtx) {
        this.droneCtx.close();
        this.droneCtx = null;
      }
    } catch {}
  }

  private startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.elapsedSeconds += 1;
      this.notify();
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public play(fromIndex?: number) {
    if (fromIndex !== undefined) {
      this.activeParaIndex = fromIndex;
    }

    // 🛑 1. AUTOMATICALLY PAUSE BACKGROUND FESTIVE MUSIC / DHUN
    festiveAudio.stopAll();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shubhakamna_katha_started'));
    }

    this.isPlaying = true;
    this.startTimer();
    this.startTanpura();
    this.speakCurrent();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    this.stopTimer();
    this.stopTanpura();
    if (this.synth) {
      this.synth.cancel();
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shubhakamna_katha_paused'));
    }
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public restart() {
    this.activeParaIndex = 0;
    this.elapsedSeconds = 0;
    this.play(0);
  }

  public next() {
    if (this.activeParaIndex < KATHA_SECTIONS.length - 1) {
      this.activeParaIndex++;
      if (this.isPlaying) {
        this.speakCurrent();
      } else {
        this.notify();
      }
    }
  }

  public previous() {
    if (this.activeParaIndex > 0) {
      this.activeParaIndex--;
      if (this.isPlaying) {
        this.speakCurrent();
      } else {
        this.notify();
      }
    }
  }

  public setSpeed(newSpeed: number) {
    this.speed = newSpeed;
    if (this.isPlaying) {
      this.speakCurrent();
    }
    this.notify();
  }

  public setPara(index: number) {
    this.activeParaIndex = Math.max(0, Math.min(index, KATHA_SECTIONS.length - 1));
    if (this.isPlaying) {
      this.speakCurrent();
    } else {
      this.notify();
    }
  }

  private speakCurrent() {
    if (!this.synth || this.activeParaIndex >= KATHA_SECTIONS.length) {
      this.pause();
      return;
    }

    this.synth.cancel();

    const para = KATHA_SECTIONS[this.activeParaIndex];
    const text = `${para.title}। ${para.text}`;
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 1.18;
    u.rate = this.speed;
    u.volume = this.isMuted ? 0 : 1.0;

    const voice = this.getFemaleVoice();
    if (voice) u.voice = voice;

    u.onend = () => {
      if (this.activeParaIndex + 1 < KATHA_SECTIONS.length) {
        this.activeParaIndex++;
        this.notify();
        this.speakCurrent();
      } else {
        this.pause();
      }
    };

    u.onerror = () => {
      this.pause();
    };

    this.currentUtterance = u;
    this.synth.speak(u);
    this.notify();
  }
}

export const kathaAudio = new KathaAudioEngine();
