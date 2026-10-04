import { Festival } from '../data/festivals';

export interface VideoStatusOptions {
  festival: Festival;
  senderName: string;
  userPhoto?: string | null;
  birthdayPerson?: string;
  birthdayPhoto?: string | null;
  poem: string;
  greetingTitle: string;
  heroImageOverride?: string;
  customAudioUrl?: string;
}

export interface VideoStatusResult {
  blob: Blob;
  url: string;
  mimeType: string;
  extension: string;
  fileName: string;
}

export interface ParticleItem {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  type: 'diya' | 'sparkle' | 'confetti';
}

/**
 * Loads an image URL safely with CORS.
 */
export function loadStatusImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fb = document.createElement('canvas');
      fb.width = 720;
      fb.height = 720;
      const ctx = fb.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, 720, 720);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ पावन मंगल दर्शन ✨', 360, 360);
      }
      const fbImg = new Image();
      fbImg.src = fb.toDataURL();
      fbImg.onload = () => resolve(fbImg);
      fbImg.onerror = () => resolve(fbImg);
    };
    img.src = src;
  });
}

/**
 * Creates audio stream and synthesis or MP3 stream for video.
 */
export function createFestiveAudioStream(
  durationSec: number, 
  isBirthday: boolean,
  customAudioUrl?: string
): { 
  streamTrack: MediaStreamTrack | null; 
  cleanup: () => void;
  audioContext: AudioContext | null;
} {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return { streamTrack: null, cleanup: () => {}, audioContext: null };

    const audioCtx = new AudioContextClass();
    const dest = audioCtx.createMediaStreamDestination();
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
    masterGain.connect(dest);

    // If a custom MP3 audio URL / uploaded dataUrl is provided, connect real audio element!
    if (customAudioUrl && customAudioUrl.length > 5) {
      try {
        const audioEl = new Audio();
        audioEl.crossOrigin = 'anonymous';
        audioEl.src = customAudioUrl;
        audioEl.loop = true;
        audioEl.volume = 1.0;

        const source = audioCtx.createMediaElementSource(audioEl);
        source.connect(masterGain);
        audioEl.play().catch(() => {});

        const streamTrack = dest.stream.getAudioTracks()[0] || null;
        return {
          streamTrack,
          audioContext: audioCtx,
          cleanup: () => {
            try {
              audioEl.pause();
              audioEl.src = '';
              audioCtx.close();
            } catch {}
          }
        };
      } catch (err) {
        console.warn('Could not pipe custom audio element, falling back to synthesis:', err);
      }
    }

    // Synthesized festive melody looping across duration
    if (isBirthday) {
      const notes = [
        { f: 261.63, d: 0.35, p: 0.1 },
        { f: 261.63, d: 0.35, p: 0.45 },
        { f: 293.66, d: 0.6, p: 0.8 },
        { f: 261.63, d: 0.6, p: 1.4 },
        { f: 349.23, d: 0.6, p: 2.0 },
        { f: 329.63, d: 1.0, p: 2.6 },
        { f: 261.63, d: 0.35, p: 3.8 },
        { f: 261.63, d: 0.35, p: 4.15 },
        { f: 293.66, d: 0.6, p: 4.5 },
        { f: 261.63, d: 0.6, p: 5.1 },
        { f: 392.00, d: 0.6, p: 5.7 },
        { f: 349.23, d: 1.0, p: 6.3 }
      ];

      const loopLength = 7.5;
      const totalLoops = Math.ceil(durationSec / loopLength) + 1;

      for (let l = 0; l < totalLoops; l++) {
        const loopOffset = l * loopLength;
        if (loopOffset > durationSec) break;

        notes.forEach(n => {
          const startTime = audioCtx.currentTime + loopOffset + n.p;
          if (startTime > audioCtx.currentTime + durationSec) return;

          const osc = audioCtx.createOscillator();
          const noteGain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, startTime);
          
          noteGain.gain.setValueAtTime(0, startTime);
          noteGain.gain.linearRampToValueAtTime(0.35, startTime + 0.04);
          noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d);

          osc.connect(noteGain);
          noteGain.connect(masterGain);
          osc.start(startTime);
          osc.stop(startTime + n.d + 0.1);
        });
      }
    } else {
      // Tanpura Root Drones
      [130.81, 196.00, 261.63].forEach(freq => {
        const droneOsc = audioCtx.createOscillator();
        const droneGain = audioCtx.createGain();
        droneOsc.type = 'sawtooth';
        droneOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        droneGain.gain.setValueAtTime(0.07, audioCtx.currentTime);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);

        droneOsc.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(masterGain);
        droneOsc.start();
        droneOsc.stop(audioCtx.currentTime + durationSec + 1);
      });

      // Temple Bell Chimes repeating every 3 seconds
      const chimeInterval = 3.0;
      const totalChimes = Math.ceil(durationSec / chimeInterval) + 1;

      for (let c = 0; c < totalChimes; c++) {
        const chimeTime = c * chimeInterval + 0.2;
        if (chimeTime > durationSec) break;

        [523.25, 659.25, 783.99, 1046.50].forEach((bellFreq, idx) => {
          const bellOsc = audioCtx.createOscillator();
          const bellGain = audioCtx.createGain();
          bellOsc.type = 'sine';
          bellOsc.frequency.setValueAtTime(bellFreq * (1 + idx * 0.02), audioCtx.currentTime + chimeTime);
          
          bellGain.gain.setValueAtTime(0, audioCtx.currentTime + chimeTime);
          bellGain.gain.linearRampToValueAtTime(0.25 / (idx + 1), audioCtx.currentTime + chimeTime + 0.02);
          bellGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + chimeTime + 2.2);

          bellOsc.connect(bellGain);
          bellGain.connect(masterGain);
          bellOsc.start(audioCtx.currentTime + chimeTime);
          bellOsc.stop(audioCtx.currentTime + chimeTime + 2.3);
        });
      }
    }

    const streamTrack = dest.stream.getAudioTracks()[0] || null;
    return {
      streamTrack,
      audioContext: audioCtx,
      cleanup: () => {
        try {
          audioCtx.close();
        } catch {}
      }
    };
  } catch {
    return { streamTrack: null, audioContext: null, cleanup: () => {} };
  }
}

/**
 * Initializes particles for the 9:16 canvas.
 */
export function initParticles(width: number, height: number, isBirthday: boolean): ParticleItem[] {
  const particles: ParticleItem[] = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 3,
      speedY: -(Math.random() * 1.5 + 0.7),
      speedX: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.7 + 0.3,
      type: isBirthday ? (i % 3 === 0 ? 'confetti' : 'sparkle') : (i % 2 === 0 ? 'diya' : 'sparkle')
    });
  }
  return particles;
}

/**
 * Pre-computes wrapped lines of text to avoid recalculating measureText on every single animation frame.
 */
function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let w = 0; w < words.length; w++) {
    const testLine = currentLine ? `${currentLine} ${words[w]}` : words[w];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[w];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Single Frame Renderer for both Live Preview Canvas and Video Export.
 * Blazing fast 60fps / 30fps rendering optimized for 720 x 1280 (HD 9:16 vertical WhatsApp Story).
 */
export function drawVideoStatusFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  heroImg: HTMLImageElement | null,
  userImg: HTMLImageElement | null,
  options: VideoStatusOptions,
  particles: ParticleItem[]
): void {
  const { festival, senderName, birthdayPerson, poem, greetingTitle } = options;
  const isBirthday = festival.id === 'birthday' || festival.soundType === 'birthday' || !!birthdayPerson;
  const fullPoem = poem || festival.defaultPoem;

  // 1. Background Fill
  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(0, 0, width, height);

  // 2. Hero Image with Cinematic Zoom / Float (Ken-Burns)
  if (heroImg && heroImg.complete) {
    const scale = 1.0 + Math.sin(time * 1.2) * 0.025;
    const cardW = width - 48; // 672
    const cardH = 500;
    const cardX = 24;
    const cardY = 120;

    const zoomW = cardW * scale;
    const zoomH = (cardW * scale * (heroImg.height || 1)) / (heroImg.width || 1);
    const posX = cardX + (cardW - zoomW) / 2;
    const posY = cardY + Math.sin(time * 0.8) * 6;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, [24]);
    ctx.clip();
    ctx.drawImage(heroImg, posX, posY, zoomW, Math.max(zoomH, cardH));

    // Dark gradient vignette overlay at the bottom of the photo
    const vig = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
    vig.addColorStop(0, 'rgba(0,0,0,0.08)');
    vig.addColorStop(0.7, 'rgba(0,0,0,0.18)');
    vig.addColorStop(1, 'rgba(12,10,9,0.92)');
    ctx.fillStyle = vig;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.restore();

    // Golden frame border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, [24]);
    ctx.stroke();
  }

  // 3. Top Website Branding with Slow Breathing Blink
  const blinkAlpha = 0.82 + Math.sin(time * 3.0) * 0.18;
  ctx.save();
  ctx.globalAlpha = blinkAlpha;

  ctx.fillStyle = 'rgba(28, 25, 23, 0.9)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 190, 32, 380, 58, [29]);
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🪔 Shubhakamna.in 🪔', width / 2, 70);
  ctx.restore();

  // Top subline
  ctx.fillStyle = 'rgba(253, 230, 138, 0.9)';
  ctx.font = '600 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ भारत का आधिकारिक 8K शुभकामना स्टेटस ✨', width / 2, 106);

  // 4. User / Celebrant Photo if available
  if (userImg && userImg.complete) {
    ctx.save();
    const photoX = 80;
    const photoY = 580;
    const photoR = 48;

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(userImg, photoX - photoR, photoY - photoR, photoR * 2, photoR * 2);
    ctx.restore();
  }

  // 5. Sender Name Royal Card
  const sCardX = userImg ? 146 : 24;
  const sCardY = 550;
  const sCardW = userImg ? width - 170 : width - 48;
  const sCardH = 88;

  ctx.save();
  ctx.fillStyle = 'rgba(24, 24, 27, 0.92)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(sCardX, sCardY, sCardW, sCardH, [18]);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fde68a';
  ctx.font = '500 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('✨ स्नेह एवं सम्मान सहित प्रेषित ✨', sCardX + 18, sCardY + 28);

  const sGrad = ctx.createLinearGradient(sCardX + 18, 0, sCardX + 300, 0);
  sGrad.addColorStop(0, '#fef08a');
  sGrad.addColorStop(0.5, '#f59e0b');
  sGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = sGrad;
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(senderName, sCardX + 18, sCardY + 68);
  ctx.restore();

  // 6. Festival Grand Greeting Title
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  const displayTitle = isBirthday && birthdayPerson
    ? `🎉 Happy Birthday ${birthdayPerson}! 🎉`
    : greetingTitle;
  ctx.fillText(displayTitle, width / 2, 680);
  ctx.restore();

  // 7. Handwriting / Typewriter Animation Box (Bigger readable fonts)
  const typingDuration = Math.min(Math.max(time * 0.5, 4.0), 8.0);
  const typingProgress = Math.min(Math.max((time - 0.2) / typingDuration, 0), 1);
  const charsToShow = Math.floor(typingProgress * fullPoem.length);
  const poemSlice = fullPoem.slice(0, charsToShow);

  ctx.save();
  const textBoxX = 20;
  const textBoxY = 715;
  const textBoxW = width - 40;
  const textBoxH = 265;

  ctx.fillStyle = 'rgba(18, 16, 14, 0.95)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(textBoxX, textBoxY, textBoxW, textBoxH, [20]);
  ctx.fill();
  ctx.stroke();

  // Bada Akshar Typography (25px Bold text)
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 25px sans-serif';
  ctx.textAlign = 'center';

  const maxLineW = textBoxW - 40;
  const lines = wrapTextLines(ctx, poemSlice, maxLineW);
  const lineH = 38;
  const startTextY = textBoxY + 50;
  lines.slice(0, 6).forEach((l, idx) => {
    ctx.fillText(l, width / 2, startTextY + idx * lineH);
  });

  // Animated writing quill cursor
  if (typingProgress < 1.0 && typingProgress > 0) {
    const cursorAlpha = (Math.sin(time * 12) + 1) / 2;
    ctx.fillStyle = `rgba(251, 191, 36, ${cursorAlpha})`;
    ctx.font = 'bold 22px sans-serif';
    const lastLine = lines[lines.length - 1] || '';
    const lastLineW = ctx.measureText(lastLine).width;
    ctx.fillText(' ✍️✨', width / 2 + lastLineW / 2 + 8, startTextY + (lines.length - 1) * lineH);
  }
  ctx.restore();

  // Sacred Mantra Plate if present (Big Sacred Gold Shloka)
  if (festival.mantraOrShloka && !isBirthday) {
    ctx.save();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(20, 990, width - 40, 78, [16]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 21px serif';
    ctx.textAlign = 'center';
    ctx.fillText(festival.mantraOrShloka.slice(0, 48) + (festival.mantraOrShloka.length > 48 ? '...' : ''), width / 2, 1036);
    ctx.restore();
  }

  // 8. Right-to-Left Scrolling Festive Wish Ribbon (Marquee)
  const tickerY = 1080;
  const tickerH = 75;
  const tickerText = isBirthday
    ? `🎉 HAPPY BIRTHDAY ${birthdayPerson || 'आकाश'} 🎉 • Wishing you boundless happiness & divine health • ${senderName} की ओर से ढेर सारी शुभकामनाएँ 🎂🎈✨ • `
    : `🪔 ${festival.nameHi} की हार्दिक शुभकामनाएँ 🪔 • ${festival.taglineHi} • ${festival.mantraOrShloka || '॥ ॐ श्रीं महालक्ष्म्यै नमः ॥'} • ${senderName} की ओर से सपरिवार मंगलकामनाएँ 🌸✨ • `;

  ctx.save();
  const ribGrad = ctx.createLinearGradient(0, tickerY, 0, tickerY + tickerH);
  ribGrad.addColorStop(0, '#78350f');
  ribGrad.addColorStop(0.5, '#b45309');
  ribGrad.addColorStop(1, '#451a03');
  ctx.fillStyle = ribGrad;
  ctx.fillRect(0, tickerY, width, tickerH);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, tickerY);
  ctx.lineTo(width, tickerY);
  ctx.moveTo(0, tickerY + tickerH);
  ctx.lineTo(width, tickerY + tickerH);
  ctx.stroke();

  // Fast smooth text movement from right to left
  const speed = 140; // px/sec
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  const textWidth = ctx.measureText(tickerText).width;
  const offset = (time * speed) % (textWidth || 1);

  const fullRepeated = tickerText + tickerText + tickerText;
  ctx.fillText(fullRepeated, width - offset, tickerY + 46);
  ctx.restore();

  // 9. Floating Animated Particles
  ctx.save();
  particles.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    if (p.y < 0) p.y = height + 10;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;

    ctx.globalAlpha = p.alpha * (0.8 + Math.sin(time * 3 + p.x) * 0.2);

    if (p.type === 'diya') {
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(p.x, p.y - p.size, p.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'confetti') {
      const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
      ctx.fillStyle = colors[Math.floor(p.x) % colors.length];
      ctx.fillRect(p.x, p.y, p.size * 1.2, p.size * 0.6);
    } else {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();

  // 10. Bottom Footer Stamp
  ctx.save();
  ctx.fillStyle = 'rgba(12, 10, 9, 0.95)';
  ctx.fillRect(0, height - 90, width, 90);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🟢 WhatsApp Status • 8K Ultra HD Animated Video 🟢', width / 2, height - 50);

  ctx.fillStyle = '#a8a29e';
  ctx.font = '500 13px sans-serif';
  ctx.fillText(`Created with ❤️ on Shubhakamna.in • ${festival.nameHi}`, width / 2, height - 22);
  ctx.restore();
}

/**
 * Fast Video Recorder: Records the canvas and audio into an MP4/WebM in ~1.5 to 2.5 seconds.
 */
export async function recordFastVideoStatus(
  canvas: HTMLCanvasElement,
  options: VideoStatusOptions,
  heroImg: HTMLImageElement | null,
  userImg: HTMLImageElement | null,
  durationSeconds: number = 3.2,
  onProgress?: (pct: number) => void
): Promise<VideoStatusResult> {
  const { festival, senderName, birthdayPerson } = options;
  const isBirthday = festival.id === 'birthday' || festival.soundType === 'birthday' || !!birthdayPerson;

  const fps = 30;
  const totalFrames = Math.floor(durationSeconds * fps);
  const stream = canvas.captureStream(fps);

  // Audio setup with custom MP3 or synthesized melody
  const audio = createFestiveAudioStream(durationSeconds, isBirthday, options.customAudioUrl);
  if (audio.streamTrack) {
    stream.addTrack(audio.streamTrack);
  }

  let mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  let extension = 'mp4';

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
      extension = 'mp4';
    } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9,opus')) {
      mimeType = 'video/webm; codecs=vp9,opus';
      extension = 'webm';
    } else {
      mimeType = 'video/webm';
      extension = 'webm';
    }
  }

  const chunks: Blob[] = [];
  const recorder = mimeType 
    ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 })
    : new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const particles = initParticles(canvas.width, canvas.height, isBirthday);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  return new Promise<VideoStatusResult>((resolve) => {
    recorder.start();
    let frame = 0;

    const recordStep = () => {
      frame++;
      const time = frame / fps;
      drawVideoStatusFrame(ctx, canvas.width, canvas.height, time, heroImg, userImg, options, particles);

      const pct = Math.min(Math.floor((frame / totalFrames) * 100), 100);
      onProgress?.(pct);

      if (frame < totalFrames) {
        requestAnimationFrame(recordStep);
      } else {
        recorder.stop();
        audio.cleanup();

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const safeName = (senderName || 'Wishes').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '-');
          const fileName = isBirthday
            ? `Happy-Birthday-${birthdayPerson || 'Akash'}-8K-Status.${extension}`
            : `Shubhakamna-8K-Video-Status-${festival.id}-${safeName}.${extension}`;

          resolve({
            blob,
            url,
            mimeType,
            extension,
            fileName
          });
        };
      }
    };

    recordStep();
  });
}
