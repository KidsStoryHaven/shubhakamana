/**
 * Web Audio API synthesizer for Festive Wishing Sounds
 * Zero external mp3 dependencies, 100% reliable, zero latency!
 */

class FestiveAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
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
  }

  public getMuted(): boolean {
    return this.isMuted;
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

      const freqs = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 harmonics
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
    } catch {
      // Audio not supported or blocked by user gesture
    }
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

      // Whistle up
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);

      // Explosion crackle noise
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
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, burstTime);
        filter.frequency.exponentialRampToValueAtTime(100, burstTime + 0.4);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, burstTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, burstTime + 0.4);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(burstTime);
        noise.stop(burstTime + 0.45);
      }, 250);
    } catch {
      // Ignored
    }
  }

  /**
   * Sacred Shankh (Conch) Sound
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
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.6);
      osc.frequency.linearRampToValueAtTime(215, now + 2.5);

      // Lowpass to give warm conch horn body
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.5);
      gain.gain.linearRampToValueAtTime(0.2, now + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.1);
    } catch {
      // Ignored
    }
  }

  /**
   * Festive Flute melody (Krishna Bansuri phrase)
   */
  public playFlute() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Notes: E5, G5, A5, B5, A5
      const notes = [659.25, 783.99, 880.00, 987.77, 880.00];
      const durations = [0.35, 0.35, 0.45, 0.6, 0.8];
      let offset = 0;

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteStart = now + offset;
        const dur = durations[i];
        offset += dur * 0.85;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        // Slight vibrato
        osc.frequency.linearRampToValueAtTime(freq + 4, noteStart + dur * 0.5);
        osc.frequency.linearRampToValueAtTime(freq, noteStart + dur);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + dur + 0.05);
      });
    } catch {
      // Ignored
    }
  }

  /**
   * Birthday Melody ("Happy Birthday To You" motif)
   */
  public playBirthdayMelody() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // G4, G4, A4, G4, C5, B4
      const notes = [392, 392, 440, 392, 523.25, 493.88];
      const durs = [0.25, 0.25, 0.5, 0.5, 0.5, 0.9];
      let offset = 0;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const start = now + offset;
        const dur = durs[idx];
        offset += dur * 0.95;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch {
      // Ignored
    }
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

      // 4 quick rapid taps
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
    } catch {
      // Ignored
    }
  }

  public playSoundForFestival(soundType: 'aarti' | 'fireworks' | 'flute' | 'birthday' | 'damru' | 'shankh') {
    switch (soundType) {
      case 'fireworks':
        this.playFirework();
        break;
      case 'aarti':
        this.playTempleBell();
        break;
      case 'flute':
        this.playFlute();
        break;
      case 'birthday':
        this.playBirthdayMelody();
        break;
      case 'damru':
        this.playDamru();
        break;
      case 'shankh':
        this.playShankh();
        break;
      default:
        this.playTempleBell();
    }
  }
}

export const festiveAudio = new FestiveAudioEngine();
