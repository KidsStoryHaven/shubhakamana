/**
 * Comprehensive Festive & Personalized Birthday Audio Engine
 * Supports Web Audio Synthesizer, Web Speech Vocal Melodies with Custom Name,
 * and External MP3 / Audio Stream playback.
 */

export type FestiveSoundType = 
  | 'aarti' 
  | 'fireworks' 
  | 'flute' 
  | 'birthday' 
  | 'damru' 
  | 'shankh' 
  | 'shehnai' 
  | 'dhol'
  | 'custom_url';

class FestiveAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isPlayingBirthdaySong: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private songStatusListeners: Set<(isPlaying: boolean) => void> = new Set();

  public onBirthdaySongStatusChange(cb: (isPlaying: boolean) => void): () => void {
    this.songStatusListeners.add(cb);
    return () => {
      this.songStatusListeners.delete(cb);
    };
  }

  private notifySongStatus(isPlaying: boolean) {
    this.isPlayingBirthdaySong = isPlaying;
    this.songStatusListeners.forEach(cb => {
      try {
        cb(isPlaying);
      } catch {}
    });
  }

  public isSongPlaying(): boolean {
    return this.isPlayingBirthdaySong;
  }

  public stopBirthdaySong(): void {
    this.stopAll();
  }

  public stopAll() {
    this.notifySongStatus(false);
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Temple Bell / Pooja Chime
   */
  public playTempleBell() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [587.33, 880, 1174.66, 1760];
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        const decay = 2.2 - idx * 0.3;
        const initialVol = 0.25 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {}
  }

  /**
   * Fireworks Pop and Sparkle
   */
  public playFirework() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);

      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const burstTime = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, burstTime);
        const burstGain = this.ctx.createGain();
        burstGain.gain.setValueAtTime(0.3, burstTime);
        burstGain.gain.exponentialRampToValueAtTime(0.0001, burstTime + 0.4);
        noise.connect(filter);
        filter.connect(burstGain);
        burstGain.connect(this.ctx.destination);
        noise.start(burstTime);
      }, 250);
    } catch {}
  }

  /**
   * Divine Flute Melody
   */
  public playFlute() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const ragaNotes = [440, 493.88, 554.37, 659.25, 739.99, 880];
      let delay = 0;
      ragaNotes.forEach((freq) => {
        if (!this.ctx) return;
        const noteStart = now + delay;
        const dur = 0.35;
        delay += 0.28;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.01, noteStart);
        gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + dur + 0.05);
      });
    } catch {}
  }

  /**
   * Shiva Damru Beat
   */
  public playDamru() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const tapTimes = [0, 0.12, 0.26, 0.38];
      tapTimes.forEach((t) => {
        if (!this.ctx) return;
        const start = now + t;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, start);
        osc.frequency.exponentialRampToValueAtTime(60, start + 0.08);
        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.09);
      });
    } catch {}
  }

  /**
   * Holy Shankh (Conch Shell) Sound
   */
  public playShankh() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(185, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(160, now + 2.2);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.35);
    } catch {}
  }

  /**
   * Mangal Shehnai Melody
   */
  public playShehnai() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [587.33, 659.25, 739.99, 880, 987.77, 880];
      let delay = 0;
      notes.forEach((freq) => {
        if (!this.ctx) return;
        const noteStart = now + delay;
        const dur = 0.38;
        delay += 0.32;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.01, noteStart);
        gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + dur + 0.05);
      });
    } catch {}
  }

  /**
   * Festive Dhol Beats
   */
  public playDhol() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const beats = [0, 0.2, 0.4, 0.55, 0.75, 0.95];
      beats.forEach((bTime, idx) => {
        if (!this.ctx) return;
        const start = now + bTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(idx % 2 === 0 ? 110 : 220, start);
        osc.frequency.exponentialRampToValueAtTime(50, start + 0.15);
        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.16);
      });
    } catch {}
  }

  /**
   * Personalized Birthday Song with Name:
   * Sings: "Happy birthday to you, happy birthday to you, happy birthday to Akash, happy birthday to you!"
   */
  public playPersonalizedBirthdaySong(
    personName: string = 'आप',
    onComplete?: () => void
  ) {
    if (this.isMuted) return;
    this.stopAll();
    this.initContext();
    this.notifySongStatus(true);

    const displayName = personName.trim() || 'आप';

    // 1. Synthesize the Full 4-Line Classic Birthday Melody on Web Audio
    if (this.ctx) {
      const now = this.ctx.currentTime + 0.1;

      const melody = [
        // Phrase 1: Happy birthday to you
        { freq: 392.00, dur: 0.35 }, { freq: 392.00, dur: 0.35 },
        { freq: 440.00, dur: 0.70 }, { freq: 392.00, dur: 0.70 },
        { freq: 523.25, dur: 0.70 }, { freq: 493.88, dur: 1.30 },
        // Phrase 2: Happy birthday to you
        { freq: 392.00, dur: 0.35 }, { freq: 392.00, dur: 0.35 },
        { freq: 440.00, dur: 0.70 }, { freq: 392.00, dur: 0.70 },
        { freq: 587.33, dur: 0.70 }, { freq: 523.25, dur: 1.30 },
        // Phrase 3: Happy birthday to [NAME]
        { freq: 392.00, dur: 0.35 }, { freq: 392.00, dur: 0.35 },
        { freq: 783.99, dur: 0.70 }, { freq: 659.25, dur: 0.70 },
        { freq: 523.25, dur: 0.70 }, { freq: 493.88, dur: 0.70 },
        { freq: 440.00, dur: 1.30 },
        // Phrase 4: Happy birthday to you!
        { freq: 698.46, dur: 0.35 }, { freq: 698.46, dur: 0.35 },
        { freq: 659.25, dur: 0.70 }, { freq: 523.25, dur: 0.70 },
        { freq: 587.33, dur: 0.70 }, { freq: 523.25, dur: 1.60 }
      ];

      let elapsed = 0;
      melody.forEach((note) => {
        if (!this.ctx) return;
        const start = now + elapsed;
        const dur = note.dur;
        elapsed += dur * 0.95;

        // Lead synth note (warm bell/piano harmonic)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, start);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);

        // Sub bass tone for warmth
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(note.freq / 2, start);
        subGain.gain.setValueAtTime(0.08, start);
        subGain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(start);
        subOsc.stop(start + dur + 0.05);
      });
    }

    // 2. Vocalization with the exact name requested:
    // "Happy birthday to you, happy birthday to you, happy birthday to Akash, happy birthday to you!"
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const phrases = [
        'Happy birthday to you,',
        'Happy birthday to you,',
        `Happy birthday to ${displayName},`,
        'Happy birthday to you!'
      ];

      let phraseDelay = 300;
      phrases.forEach((phrase, idx) => {
        setTimeout(() => {
          if (!this.isPlayingBirthdaySong || this.isMuted) return;
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.rate = 0.90; // Singing rhythmic cadence
          utterance.pitch = idx === 2 ? 1.25 : 1.1; // Higher celebratory pitch for name
          utterance.volume = 1.0;

          // Attempt Hindi or Indian English voice for natural pronunciation
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN')) || voices[0];
          if (preferredVoice) utterance.voice = preferredVoice;

          window.speechSynthesis.speak(utterance);

          // On last phrase finish
          if (idx === phrases.length - 1) {
            utterance.onend = () => {
              this.notifySongStatus(false);
              this.playPartyCheer();
              if (onComplete) onComplete();
            };
          }
        }, phraseDelay);

        // Advance rhythm timing to match music bars
        phraseDelay += (idx === 0 || idx === 1) ? 2900 : 3400;
      });
    } else {
      // Fallback timer if speech synthesis is not supported
      setTimeout(() => {
        this.notifySongStatus(false);
        this.playPartyCheer();
        if (onComplete) onComplete();
      }, 12500);
    }
  }

  /**
   * Cheering and party popper burst for birthday celebration
   */
  public playPartyCheer() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Party Horn Arpeggio
      const hornNotes = [523.25, 659.25, 783.99, 1046.50];
      hornNotes.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.42);
      });
    } catch {}
  }

  /**
   * Play any custom MP3 / Web audio URL configured by Admin
   */
  public playAudioUrl(url: string) {
    if (this.isMuted || !url?.trim()) return;
    this.stopAll();

    try {
      const audio = new Audio(url.trim());
      audio.volume = 0.85;
      audio.play().catch((err) => {
        console.warn('Audio play restricted or URL unreachable, falling back to synthesizer:', err);
        this.playTempleBell();
      });
      this.currentAudioElement = audio;
    } catch {
      this.playTempleBell();
    }
  }

  /**
   * Play configured festival or category sound
   */
  public playSoundForFestival(
    soundType: FestiveSoundType,
    customUrl?: string,
    personName?: string
  ) {
    if (this.isMuted) return;

    if (soundType === 'custom_url' && customUrl) {
      this.playAudioUrl(customUrl);
      return;
    }

    switch (soundType) {
      case 'birthday':
        this.playPersonalizedBirthdaySong(personName || 'आप');
        break;
      case 'fireworks':
        this.playFirework();
        break;
      case 'aarti':
        this.playTempleBell();
        break;
      case 'flute':
        this.playFlute();
        break;
      case 'damru':
        this.playDamru();
        break;
      case 'shankh':
        this.playShankh();
        break;
      case 'shehnai':
        this.playShehnai();
        break;
      case 'dhol':
        this.playDhol();
        break;
      default:
        this.playTempleBell();
    }
  }

  /**
   * Preview a sound option for Admin testing
   */
  public previewSound(soundType: FestiveSoundType, customUrl?: string, sampleName: string = 'आकाश') {
    this.stopAll();
    this.playSoundForFestival(soundType, customUrl, sampleName);
  }
}

export const festiveAudio = new FestiveAudioEngine();

export interface FestiveSoundOption {
  id: FestiveSoundType;
  labelHi: string;
  labelEn: string;
  icon: string;
  description: string;
}

export const FESTIVE_SOUND_OPTIONS: FestiveSoundOption[] = [
  { id: 'birthday', labelHi: 'हैप्पी बर्थडे सॉन्ग (नाम के साथ)', labelEn: 'Birthday Song (with Name)', icon: '🎂', description: 'पर्सनलाइज़्ड बर्थडे धुन व नाम का गायन' },
  { id: 'aarti', labelHi: 'मंदिर की पावन घंटी व आरती (Temple Bell)', labelEn: 'Temple Bell / Aarti Chime', icon: '🪔', description: 'दिव्य मंदिर घंटा व घंटियाँ' },
  { id: 'fireworks', labelHi: 'दिवाली आतिशबाजी व पटाखे (Fireworks)', labelEn: 'Celebration Fireworks', icon: '🎆', description: 'रोमांचक पटाखों की गूंज' },
  { id: 'flute', labelHi: 'श्री कृष्ण बांसुरी धुन (Divine Flute)', labelEn: 'Divine Flute Raga', icon: '🪈', description: 'मधुर शास्त्रीय बांसुरी राग' },
  { id: 'shehnai', labelHi: 'मंगल शहनाई (Mangal Shehnai)', labelEn: 'Mangal Shehnai', icon: '🎺', description: 'शुभ विवाह व उत्सव शहनाई' },
  { id: 'shankh', labelHi: 'पावन शंख ध्वनि (Holy Shankh)', labelEn: 'Holy Shankh', icon: '🐚', description: 'शुभ शुभारंभ शंखनाद' },
  { id: 'damru', labelHi: 'महादेव डमरू नाद (Shiva Damru)', labelEn: 'Shiva Damru Beats', icon: '🔱', description: 'भोलेनाथ का डमरू' },
  { id: 'dhol', labelHi: 'पंजाबी व उत्सव ढोल (Festive Dhol)', labelEn: 'Festive Dhol Beats', icon: '🥁', description: 'उमंग भरा ढोल बीट्स' },
  { id: 'custom_url', labelHi: 'कस्टम ऑडियो (MP3 / Audio URL)', labelEn: 'Custom MP3 / Audio URL', icon: '🌐', description: 'अपनी पसंद का कोई भी MP3 या ऑडियो लिंक' }
];
