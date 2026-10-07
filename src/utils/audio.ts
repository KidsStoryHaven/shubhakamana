/**
 * High-fidelity Web Audio API sound synthesizers for Temple Bell, Conch (Shankh), and Om Chants.
 * Pure client-side synthesis ensures zero network latency and 100% offline reliability.
 */

import { universalSpeech } from './universalSpeechPlayer';

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Temple brass bell with realistic harmonic spectrum and metallic decay
   */
  playTempleBell() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Realistic temple bell modal frequencies (ratio to fundamental ~ 800Hz)
      const partials = [
        { freqRatio: 1.0, gain: 0.6, decay: 3.5 },
        { freqRatio: 1.5, gain: 0.4, decay: 2.8 },
        { freqRatio: 2.0, gain: 0.35, decay: 2.2 },
        { freqRatio: 2.76, gain: 0.25, decay: 1.5 },
        { freqRatio: 4.07, gain: 0.15, decay: 1.0 },
        { freqRatio: 5.43, gain: 0.08, decay: 0.7 }
      ];

      const fundamental = 780; // High resonant brass tone

      // Master gain for the strike
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.connect(ctx.destination);

      partials.forEach(p => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * p.freqRatio, now);

        gain.gain.setValueAtTime(p.gain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + p.decay);
      });

      // Subtle metallic strike noise
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2400, now);
      noiseFilter.Q.setValueAtTime(3, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noise.start(now);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  /**
   * Divine Conch Shell (Shankh Naad) with rich brassy harmonics and breathy attack
   */
  playShankh() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 4.0;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      // Gentle swell in volume
      masterGain.gain.exponentialRampToValueAtTime(0.5, now + 0.8);
      masterGain.gain.setValueAtTime(0.5, now + duration - 1.2);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      // Low brass fundamental with slight pitch inflection (like blowing into a conch)
      const baseFreq = 220; // A3
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(baseFreq * 0.95, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.6);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.98, now + duration);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 2, now);

      // Filter to simulate conch acoustic chamber
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 1.0);
      filter.frequency.linearRampToValueAtTime(600, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  /**
   * Meditative Om (ॐ) resonant harmonic drone at 432Hz
   */
  playOmSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 5.0;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.4, now + 1.0);
      masterGain.gain.setValueAtTime(0.4, now + duration - 1.5);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      // 432Hz sacred pitch + binaural beat (+2Hz)
      const freqs = [432, 216, 108, 648];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.3 / (idx + 1), now);

        osc.connect(subGain);
        subGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Speak Hindi text with universal robust speech engine
   */
  speakHindi(text: string) {
    universalSpeech.speak(text, { speed: 0.90 });
  }

  stopSpeech() {
    universalSpeech.stopAll();
  }
}

export const soundEngine = new SoundEngine();
