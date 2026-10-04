import { Festival } from '../data/festivals';
import { resolveDirectImageUrl } from './googleDriveHelper';

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
  rot: number;
  rotSpeed: number;
  type: 'diya' | 'sparkle' | 'confetti' | 'ember' | 'bokeh';
}

/**
 * Loads an image URL safely with CORS and instant Google Drive support.
 */
export function loadStatusImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const directSrc = resolveDirectImageUrl(src);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback elegant 3D divine artwork canvas
      const fb = document.createElement('canvas');
      fb.width = 720;
      fb.height = 720;
      const ctx = fb.getContext('2d');
      if (ctx) {
        const bgGrad = ctx.createRadialGradient(360, 360, 50, 360, 360, 360);
        bgGrad.addColorStop(0, '#78350f');
        bgGrad.addColorStop(0.6, '#451a03');
        bgGrad.addColorStop(1, '#0c0a09');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 720, 720);

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.strokeRect(20, 20, 680, 680);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ पावन मंगल दर्शन ✨', 360, 340);
        ctx.font = '500 24px sans-serif';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('॥ दिव्य ईश्वरीय कृपा एवं आशीर्वाद ॥', 360, 400);
      }
      const fbImg = new Image();
      fbImg.src = fb.toDataURL();
      fbImg.onload = () => resolve(fbImg);
      fbImg.onerror = () => resolve(fbImg);
    };
    img.src = directSrc;
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
    masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    masterGain.connect(dest);

    // If a custom MP3 audio URL / uploaded dataUrl is provided, connect real audio element!
    if (customAudioUrl && customAudioUrl.length > 5) {
      try {
        const directAudioUrl = resolveDirectImageUrl(customAudioUrl);
        const audioEl = new Audio();
        audioEl.crossOrigin = 'anonymous';
        audioEl.src = directAudioUrl;
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
 * Initializes multi-depth 3D particles for the 9:16 canvas.
 */
export function initParticles(width: number, height: number, isBirthday: boolean): ParticleItem[] {
  const particles: ParticleItem[] = [];
  for (let i = 0; i < 40; i++) {
    const pType: ParticleItem['type'] = isBirthday 
      ? (i % 3 === 0 ? 'confetti' : (i % 2 === 0 ? 'sparkle' : 'bokeh'))
      : (i % 3 === 0 ? 'diya' : (i % 2 === 0 ? 'sparkle' : 'ember'));

    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 3,
      speedY: -(Math.random() * 1.8 + 0.6),
      speedX: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.7 + 0.3,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      type: pType
    });
  }
  return particles;
}

/**
 * Pre-computes wrapped lines of text.
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
 * 3D Glowing Text Renderer (Layered Extrusion + Dual Metallic Gradient + Specular Highlights)
 */
function draw3DGlowText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  options?: {
    align?: CanvasTextAlign;
    goldShimmerTime?: number;
    depth?: number;
    isSerif?: boolean;
    glowColor?: string;
  }
) {
  const align = options?.align || 'center';
  const depth = options?.depth || 4;
  const time = options?.goldShimmerTime || 0;
  const fontFamily = options?.isSerif ? 'serif' : 'sans-serif';
  const glow = options?.glowColor || '#f59e0b';

  ctx.save();
  ctx.textAlign = align;
  ctx.font = `900 ${fontSize}px ${fontFamily}`;

  // 1. Deep 3D Dark Extrusion Shadows
  for (let d = depth; d >= 1; d--) {
    ctx.fillStyle = '#261204';
    ctx.fillText(text, x + d * 0.8, y + d * 1.2);
  }

  // 2. Neon Ambient Glow Stroke
  ctx.strokeStyle = glow;
  ctx.lineWidth = 4;
  ctx.strokeText(text, x, y);

  // 3. Dynamic Metallic Liquid Gold Face Gradient
  const shimmerShift = Math.sin(time * 2.5) * 120;
  const textMetrics = ctx.measureText(text);
  const startX = align === 'center' ? x - textMetrics.width / 2 : x;
  const goldGrad = ctx.createLinearGradient(startX + shimmerShift, y - fontSize, startX + textMetrics.width + shimmerShift, y);
  goldGrad.addColorStop(0, '#fef08a');
  goldGrad.addColorStop(0.3, '#f59e0b');
  goldGrad.addColorStop(0.6, '#ffffff');
  goldGrad.addColorStop(0.8, '#d97706');
  goldGrad.addColorStop(1, '#fef08a');

  ctx.fillStyle = goldGrad;
  ctx.fillText(text, x, y);

  // 4. Ultra-Crisp Top Bevel Stroke
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeText(text, x, y);

  ctx.restore();
}

/**
 * Rotating Sacred Celestial Mandala / Aureole (Behind Deity Photo)
 */
function drawCelestialMandala(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.25);

  const rays = 16;
  for (let r = 0; r < rays; r++) {
    const angle = (r * Math.PI * 2) / rays;
    ctx.rotate(angle);

    const rayGrad = ctx.createLinearGradient(0, 0, 0, radius);
    rayGrad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
    rayGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.12)');
    rayGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(0, radius);
    ctx.lineTo(12, 0);
    ctx.closePath();
    ctx.fill();

    ctx.rotate(-angle);
  }

  // Golden Ring of Stardust
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Master 3D Video Status Frame Renderer.
 * High-definition 720 x 1280 (9:16 WhatsApp Status, Instagram Reel & YouTube Shorts).
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

  // 1. Deep Cosmic Nebula Background with Ambient Pulsating Glow
  const bgGrad = ctx.createRadialGradient(
    width / 2, 
    height / 2, 
    100, 
    width / 2, 
    height / 2, 
    height * 0.75
  );
  bgGrad.addColorStop(0, '#1c1005');
  bgGrad.addColorStop(0.5, '#0e0a07');
  bgGrad.addColorStop(1, '#050302');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Background Ambient Light Beam
  const beamGrad = ctx.createRadialGradient(
    width / 2, 
    260, 
    20, 
    width / 2, 
    260, 
    380
  );
  beamGrad.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
  beamGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.10)');
  beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, 50, width, 550);

  // 2. Rotating Celestial Sacred Mandala (Behind Main Hero Photo)
  drawCelestialMandala(ctx, width / 2, 330, 290, time);

  // 3. Hero Image with 3D Cinematic Float & Holographic Golden Bevel
  if (heroImg && heroImg.complete) {
    const scale = 1.0 + Math.sin(time * 1.4) * 0.028;
    const cardW = width - 44; // 676
    const cardH = 460;
    const cardX = 22;
    const cardY = 110;

    const zoomW = cardW * scale;
    const zoomH = (cardW * scale * (heroImg.height || 1)) / (heroImg.width || 1);
    const posX = cardX + (cardW - zoomW) / 2;
    const posY = cardY + Math.sin(time * 0.9) * 7;

    ctx.save();

    // 3D Drop Shadow behind photo card
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, [28]);
    ctx.clip();
    ctx.drawImage(heroImg, posX, posY, zoomW, Math.max(zoomH, cardH));

    // Dark cinematic vignette gradient
    const vig = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
    vig.addColorStop(0, 'rgba(0,0,0,0.06)');
    vig.addColorStop(0.65, 'rgba(0,0,0,0.15)');
    vig.addColorStop(1, 'rgba(8, 6, 5, 0.94)');
    ctx.fillStyle = vig;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.restore();

    // 3D Metallic Golden Frame with Multi-Bevel
    ctx.save();
    const frameGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    frameGrad.addColorStop(0, '#fef08a');
    frameGrad.addColorStop(0.3, '#f59e0b');
    frameGrad.addColorStop(0.7, '#d97706');
    frameGrad.addColorStop(1, '#fef08a');

    ctx.strokeStyle = frameGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, [28]);
    ctx.stroke();

    // Corner Ruby / Gold Accent Jewels
    const corners = [
      { x: cardX + 16, y: cardY + 16 },
      { x: cardX + cardW - 16, y: cardY + 16 },
      { x: cardX + 16, y: cardY + cardH - 16 },
      { x: cardX + cardW - 16, y: cardY + cardH - 16 }
    ];
    corners.forEach(c => {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    ctx.restore();
  }

  // 4. Top Official 3D Glowing Brand Capsule
  const blinkAlpha = 0.85 + Math.sin(time * 3.2) * 0.15;
  ctx.save();
  ctx.globalAlpha = blinkAlpha;

  const topCardX = width / 2 - 200;
  const topCardY = 28;
  const topCardW = 400;
  const topCardH = 58;

  ctx.fillStyle = 'rgba(20, 15, 12, 0.94)';
  ctx.beginPath();
  ctx.roundRect(topCardX, topCardY, topCardW, topCardH, [29]);
  ctx.fill();

  const topBorderGrad = ctx.createLinearGradient(topCardX, 0, topCardX + topCardW, 0);
  topBorderGrad.addColorStop(0, '#f59e0b');
  topBorderGrad.addColorStop(0.5, '#fef08a');
  topBorderGrad.addColorStop(1, '#f59e0b');
  ctx.strokeStyle = topBorderGrad;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  draw3DGlowText(ctx, '🪔 Shubhakamna.in 🪔', width / 2, topCardY + 40, 25, {
    goldShimmerTime: time,
    depth: 2
  });
  ctx.restore();

  // Top subline
  ctx.fillStyle = 'rgba(253, 230, 138, 0.92)';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ भारत का आधिकारिक 8K शुभकामना स्टेटस ✨', width / 2, 98);

  // 5. User / Celebrant Photo if available (3D Round Gold Medallion)
  if (userImg && userImg.complete) {
    ctx.save();
    const photoX = 82;
    const photoY = 600;
    const photoR = 50;

    // Glowing Gold Ring
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(userImg, photoX - photoR, photoY - photoR, photoR * 2, photoR * 2);
    ctx.restore();
  }

  // 6. Sender Name 3D Royal Crystal Plate
  const sCardX = userImg ? 152 : 22;
  const sCardY = 565;
  const sCardW = userImg ? width - 174 : width - 44;
  const sCardH = 92;

  ctx.save();
  ctx.fillStyle = 'rgba(22, 18, 15, 0.94)';
  ctx.beginPath();
  ctx.roundRect(sCardX, sCardY, sCardW, sCardH, [20]);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fde68a';
  ctx.font = '600 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('✨ स्नेह एवं सम्मान सहित प्रेषित ✨', sCardX + 18, sCardY + 28);

  draw3DGlowText(ctx, senderName || 'आपका शुभचिंतक', sCardX + 18, sCardY + 70, 30, {
    align: 'left',
    goldShimmerTime: time + 1.0,
    depth: 3
  });
  ctx.restore();

  // 7. 3D Grand Greeting Title Headline
  const displayTitle = isBirthday && birthdayPerson
    ? `🎉 Happy Birthday ${birthdayPerson}! 🎉`
    : greetingTitle;

  draw3DGlowText(ctx, displayTitle, width / 2, 695, 34, {
    goldShimmerTime: time,
    depth: 4,
    glowColor: '#fbbf24'
  });

  // 8. 3D Glowing Wishes Card (बड़े स्पष्ट 3D सुनहरे अक्षर & लिखवाट इफ़ेक्ट)
  const typingDuration = Math.min(Math.max(time * 0.6, 3.5), 8.0);
  const typingProgress = Math.min(Math.max((time - 0.2) / typingDuration, 0), 1);
  const charsToShow = Math.floor(typingProgress * fullPoem.length);
  const poemSlice = fullPoem.slice(0, charsToShow);

  ctx.save();
  const textBoxX = 20;
  const textBoxY = 730;
  const textBoxW = width - 40;
  const textBoxH = 260;

  // Frosted dark glass container with glowing border
  ctx.fillStyle = 'rgba(18, 14, 11, 0.96)';
  ctx.beginPath();
  ctx.roundRect(textBoxX, textBoxY, textBoxW, textBoxH, [22]);
  ctx.fill();

  const boxBorderGrad = ctx.createLinearGradient(textBoxX, textBoxY, textBoxX + textBoxW, textBoxY + textBoxH);
  boxBorderGrad.addColorStop(0, '#f59e0b');
  boxBorderGrad.addColorStop(0.5, '#fef08a');
  boxBorderGrad.addColorStop(1, '#d97706');
  ctx.strokeStyle = boxBorderGrad;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Bada Akshar 3D Typography (26px Extra Bold readable Hindi text)
  const maxLineW = textBoxW - 36;
  ctx.font = '900 26px sans-serif';
  const lines = wrapTextLines(ctx, poemSlice, maxLineW);
  const lineH = 40;
  const startTextY = textBoxY + 52;

  lines.slice(0, 5).forEach((l, idx) => {
    const lineY = startTextY + idx * lineH;
    // 3D text shadow for each line
    ctx.fillStyle = '#3a1a05';
    ctx.fillText(l, width / 2 + 1.5, lineY + 2);
    // Main glowing gold text
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(l, width / 2, lineY);
  });

  // Glowing animated writing quill cursor
  if (typingProgress < 1.0 && typingProgress > 0) {
    const cursorAlpha = (Math.sin(time * 14) + 1) / 2;
    ctx.fillStyle = `rgba(251, 191, 36, ${cursorAlpha})`;
    ctx.font = 'bold 24px sans-serif';
    const lastLine = lines[lines.length - 1] || '';
    const lastLineW = ctx.measureText(lastLine).width;
    ctx.fillText(' ✍️✨', width / 2 + lastLineW / 2 + 8, startTextY + (lines.length - 1) * lineH);
  }
  ctx.restore();

  // 9. Sacred Mantra Plate in Glowing Gold (Big Sacred Sanskrit Shloka)
  if (festival.mantraOrShloka && !isBirthday) {
    ctx.save();
    const mantraX = 20;
    const mantraY = 1000;
    const mantraW = width - 40;
    const mantraH = 75;

    ctx.fillStyle = 'rgba(28, 20, 14, 0.95)';
    ctx.beginPath();
    ctx.roundRect(mantraX, mantraY, mantraW, mantraH, [18]);
    ctx.fill();

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
    ctx.lineWidth = 2;
    ctx.stroke();

    draw3DGlowText(
      ctx, 
      `🌸 ${festival.mantraOrShloka.slice(0, 44)}${festival.mantraOrShloka.length > 44 ? '...' : ''} 🌸`, 
      width / 2, 
      mantraY + 46, 
      22, 
      {
        goldShimmerTime: time + 0.5,
        depth: 2,
        isSerif: true
      }
    );
    ctx.restore();
  }

  // 10. Trending 3D Scrolling Marquee Ribbon (Right-to-Left Fast Smooth Ticker)
  const tickerY = 1085;
  const tickerH = 80;
  const tickerText = isBirthday
    ? `🎉 HAPPY BIRTHDAY ${birthdayPerson || 'आकाश'} 🎉 • Wishing you boundless happiness & divine health • ${senderName} की ओर से ढेर सारी शुभकामनाएँ 🎂🎈✨ • `
    : `🪔 ${festival.nameHi} की हार्दिक शुभकामनाएँ 🪔 • ${festival.taglineHi} • ${festival.mantraOrShloka || '॥ ॐ श्रीं महालक्ष्म्यै नमः ॥'} • ${senderName} की ओर से सपरिवार मंगलकामनाएँ 🌸✨ • `;

  ctx.save();
  const ribGrad = ctx.createLinearGradient(0, tickerY, 0, tickerY + tickerH);
  ribGrad.addColorStop(0, '#5c2205');
  ribGrad.addColorStop(0.5, '#9a3412');
  ribGrad.addColorStop(1, '#3b1002');
  ctx.fillStyle = ribGrad;
  ctx.fillRect(0, tickerY, width, tickerH);

  // Dual Golden Top & Bottom Border Rails
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, tickerY);
  ctx.lineTo(width, tickerY);
  ctx.moveTo(0, tickerY + tickerH);
  ctx.lineTo(width, tickerY + tickerH);
  ctx.stroke();

  // Fast smooth text movement from right to left
  const speed = 145; // px/sec
  ctx.font = '900 22px sans-serif';
  ctx.textAlign = 'left';
  const textWidth = ctx.measureText(tickerText).width;
  const offset = (time * speed) % (textWidth || 1);

  const fullRepeated = tickerText + tickerText + tickerText;
  // 3D text shadow
  ctx.fillStyle = '#261204';
  ctx.fillText(fullRepeated, width - offset + 1.5, tickerY + 50);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(fullRepeated, width - offset, tickerY + 48);
  ctx.restore();

  // 11. Multi-Depth Floating Particles (Diyas, Sparks, Embers, Confetti)
  ctx.save();
  particles.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rot += p.rotSpeed;

    if (p.y < 0) p.y = height + 10;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;

    const flicker = 0.8 + Math.sin(time * 4 + p.x) * 0.2;
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * flicker));

    if (p.type === 'diya') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // Diya clay base
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Glowing flame
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -p.size * 0.9, p.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (p.type === 'confetti') {
      const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
      ctx.fillStyle = colors[Math.floor(p.x) % colors.length];
      ctx.fillRect(p.x, p.y, p.size * 1.4, p.size * 0.7);
    } else if (p.type === 'bokeh') {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();

  // 12. Bottom Official Footer Stamp
  ctx.save();
  ctx.fillStyle = 'rgba(10, 8, 6, 0.98)';
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
  durationSeconds: number = 30,
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
