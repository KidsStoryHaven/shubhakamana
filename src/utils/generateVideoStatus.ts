import { Festival } from '../data/festivals';
import { resolveDirectImageUrl, resolveDirectAudioUrl, getGoogleDriveFallbackUrls, extractGoogleDriveFileId } from './googleDriveHelper';

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
    const fallbacks = getGoogleDriveFallbackUrls(src);
    let fallbackIndex = 0;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const tryNext = () => {
      if (fallbackIndex < fallbacks.length) {
        const nextUrl = fallbacks[fallbackIndex++];
        img.src = nextUrl;
      } else {
        // Fallback elegant divine artwork canvas
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
          ctx.font = 'bold 44px "Noto Sans Devanagari", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('✨ पावन मंगल दर्शन ✨', 360, 340);
          ctx.font = '500 24px "Noto Sans Devanagari", sans-serif';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('॥ दिव्य ईश्वरीय कृपा एवं आशीर्वाद ॥', 360, 400);
        }
        const fbImg = new Image();
        fbImg.src = fb.toDataURL();
        fbImg.onload = () => resolve(fbImg);
        fbImg.onerror = () => resolve(fbImg);
      }
    };

    img.onload = () => resolve(img);
    img.onerror = () => {
      tryNext();
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
        const directAudioUrl = resolveDirectAudioUrl(customAudioUrl);
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
  for (let i = 0; i < 35; i++) {
    const pType: ParticleItem['type'] = isBirthday 
      ? (i % 3 === 0 ? 'confetti' : (i % 2 === 0 ? 'sparkle' : 'bokeh'))
      : (i % 3 === 0 ? 'diya' : (i % 2 === 0 ? 'sparkle' : 'ember'));

    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 7 + 3,
      speedY: -(Math.random() * 1.6 + 0.5),
      speedX: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.7 + 0.3,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
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
 * Ultra-Impact 3D Pop-Out Extruded Text (Mega Sale / Trending 3D Style)
 * Renders bold 3D extruded lettering with vibrant gradient faces, 3D bottom bevels,
 * and deep royal navy outline block shadows (Exactly matching reference design).
 */
export function drawMega3DPopText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  theme: 'gold' | 'white' | 'ruby' = 'gold'
): void {
  if (!text) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Extra-Bold Punchy Font
  ctx.font = `900 ${fontSize}px "Noto Sans Devanagari", "Montserrat", "Arial Black", sans-serif`;

  const faceGradient = ctx.createLinearGradient(x, y - fontSize * 0.45, x, y + fontSize * 0.45);
  if (theme === 'gold') {
    faceGradient.addColorStop(0, '#fff59d'); // Bright yellow highlight
    faceGradient.addColorStop(0.3, '#ffca28'); // Amber
    faceGradient.addColorStop(0.7, '#ff9800'); // Orange
    faceGradient.addColorStop(1, '#f57c00'); // Deep warm orange
  } else if (theme === 'ruby') {
    faceGradient.addColorStop(0, '#ff8a80');
    faceGradient.addColorStop(0.4, '#ff1744');
    faceGradient.addColorStop(1, '#b71c1c');
  } else {
    faceGradient.addColorStop(0, '#ffffff'); // Pure glossy white
    faceGradient.addColorStop(0.5, '#f8fafc');
    faceGradient.addColorStop(1, '#cbd5e1');
  }

  const bevelColor = theme === 'gold' ? '#c23300' : '#b91c1c';
  const outerBorderColor = '#00257a'; // Royal Navy Blue outer contour
  const deepShadowColor = '#000d33'; // Deepest base shadow

  // 1. Soft Ambient Drop Shadow underneath the entire 3D block
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.lineWidth = 14;
  ctx.strokeStyle = deepShadowColor;
  ctx.strokeText(text, x, y + 6);
  ctx.restore();

  // 2. Layered Royal Navy Blue Outer 3D Block Extrusion
  for (let d = 8; d >= 4; d--) {
    ctx.lineWidth = 12;
    ctx.strokeStyle = deepShadowColor;
    ctx.strokeText(text, x, y + d);
  }
  for (let d = 3; d >= 1; d--) {
    ctx.lineWidth = 12;
    ctx.strokeStyle = outerBorderColor;
    ctx.strokeText(text, x, y + d);
  }

  // 3. Thick Outer Border Contour
  ctx.lineWidth = 10;
  ctx.strokeStyle = outerBorderColor;
  ctx.strokeText(text, x, y);

  // 4. Vibrant Orange-Red 3D Bevel Side-Wall
  for (let d = 4; d >= 1; d--) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = bevelColor;
    ctx.strokeText(text, x, y + d);
    ctx.fillStyle = bevelColor;
    ctx.fillText(text, x, y + d);
  }

  // 5. Crisp Inner Contour
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#5a0d00';
  ctx.strokeText(text, x, y);

  // 6. Main Face Gradient Fill
  ctx.fillStyle = faceGradient;
  ctx.fillText(text, x, y);

  // 7. Top Specular Glaze
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.strokeText(text, x, y - 0.5);
  ctx.restore();

  ctx.restore();
}

/**
 * Razor-Sharp Crystal Clear Devanagari & Hindi Text Renderer.
 */
function drawCrispShiningText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  options?: {
    align?: CanvasTextAlign;
    textColor?: string;
    shadowColor?: string;
    isSerif?: boolean;
    fontWeight?: string;
  }
) {
  const align = options?.align || 'center';
  const color = options?.textColor || '#ffffff';
  const shadow = options?.shadowColor || 'rgba(0, 0, 0, 0.95)';
  const weight = options?.fontWeight || 'bold';
  const fontFamily = options?.isSerif
    ? '"Noto Serif Devanagari", "Georgia", serif'
    : '"Noto Sans Devanagari", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  ctx.save();
  ctx.textAlign = align;
  ctx.font = `${weight} ${fontSize}px ${fontFamily}`;

  // Crisp Drop Shadow for 100% Contrast against any background
  ctx.shadowColor = shadow;
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  // Solid High-Contrast Pure Text Fill
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);

  ctx.restore();
}

/**
 * Rotating Sacred Celestial Mandala / Aureole (Behind Deity Photo)
 */
function drawCelestialMandala(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.2);

  const rays = 16;
  for (let r = 0; r < rays; r++) {
    const angle = (r * Math.PI * 2) / rays;
    ctx.rotate(angle);

    const rayGrad = ctx.createLinearGradient(0, 0, 0, radius);
    rayGrad.addColorStop(0, 'rgba(251, 191, 36, 0.30)');
    rayGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.10)');
    rayGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(0, radius);
    ctx.lineTo(10, 0);
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
 * Master Video Status Frame Renderer.
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

  // 1. Deep Dark Background with Ambient Warm Radial Light
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
  beamGrad.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
  beamGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.08)');
  beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, 50, width, 550);

  // 2. Rotating Celestial Sacred Mandala (Behind Main Hero Photo)
  drawCelestialMandala(ctx, width / 2, 330, 280, time);

  // 3. Hero Image Card
  if (heroImg && heroImg.complete) {
    const scale = 1.0 + Math.sin(time * 1.2) * 0.022;
    const cardW = width - 44; // 676
    const cardH = 430;
    const cardX = 22;
    const cardY = 95;

    const zoomW = cardW * scale;
    const zoomH = (cardW * scale * (heroImg.height || 1)) / (heroImg.width || 1);
    const posX = cardX + (cardW - zoomW) / 2;
    const posY = cardY + Math.sin(time * 0.8) * 6;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, [24]);
    ctx.clip();
    ctx.drawImage(heroImg, posX, posY, zoomW, Math.max(zoomH, cardH));

    // Dark gradient vignette
    const vig = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
    vig.addColorStop(0, 'rgba(0,0,0,0.05)');
    vig.addColorStop(0.65, 'rgba(0,0,0,0.15)');
    vig.addColorStop(1, 'rgba(8, 6, 5, 0.92)');
    ctx.fillStyle = vig;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.restore();

    // Golden frame border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, [24]);
    ctx.stroke();
  }

  // 4. Top Official Brand Capsule
  const topCardX = width / 2 - 180;
  const topCardY = 20;
  const topCardW = 360;
  const topCardH = 50;

  ctx.save();
  ctx.fillStyle = 'rgba(22, 16, 12, 0.95)';
  ctx.beginPath();
  ctx.roundRect(topCardX, topCardY, topCardW, topCardH, [25]);
  ctx.fill();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  drawCrispShiningText(ctx, '🪔 Shubhakamna.in 🪔', width / 2, topCardY + 34, 22, {
    textColor: '#fde047'
  });
  ctx.restore();

  // Top subline
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 12px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ भारत का आधिकारिक 8K शुभकामना स्टेटस ✨', width / 2, 85);

  // 5. User / Celebrant Photo if available
  if (userImg && userImg.complete) {
    ctx.save();
    const photoX = 82;
    const photoY = 575;
    const photoR = 46;

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(userImg, photoX - photoR, photoY - photoR, photoR * 2, photoR * 2);
    ctx.restore();
  }

  // 6. Sender Name 3D Royal Plate
  const sCardX = userImg ? 150 : 20;
  const sCardY = 545;
  const sCardW = userImg ? width - 170 : width - 40;
  const sCardH = 88;

  ctx.save();
  const sBoxGrad = ctx.createLinearGradient(sCardX, sCardY, sCardX + sCardW, sCardY + sCardH);
  sBoxGrad.addColorStop(0, 'rgba(42, 20, 8, 0.98)');
  sBoxGrad.addColorStop(0.5, 'rgba(60, 28, 10, 0.98)');
  sBoxGrad.addColorStop(1, 'rgba(32, 15, 6, 0.98)');
  ctx.fillStyle = sBoxGrad;
  ctx.beginPath();
  ctx.roundRect(sCardX, sCardY, sCardW, sCardH, [18]);
  ctx.fill();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 12px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('✨ 👑 सप्रेम एवं मंगलमय प्रेषक 👑 ✨', sCardX + 18, sCardY + 26);

  // 3D Mega Pop Sender Name
  drawMega3DPopText(
    ctx, 
    senderName || 'आपका शुभचिंतक', 
    sCardX + (sCardW / 2), 
    sCardY + 58, 
    26, 
    'gold'
  );
  ctx.restore();

  // 7. 🔥 MAIN WISHES 3D MEGA POP-OUT HEADLINE (Exact Style of Reference Image)
  // Splits into Top Line (3D Gold) and Bottom Line (3D White) for Maximum Impact!
  const wishHeadlineY = 665;
  
  if (isBirthday) {
    drawMega3DPopText(ctx, 'HAPPY', width / 2, wishHeadlineY, 36, 'gold');
    drawMega3DPopText(ctx, `BIRTHDAY ${birthdayPerson || 'AKASH'}`, width / 2, wishHeadlineY + 44, 30, 'white');
  } else {
    // Festival headline: e.g. "शुभ धनतेरस" on top, "की मंगलमय शुभकामनाएँ" on bottom
    const festTitle = festival.nameHi || 'शुभ दीपावली';
    drawMega3DPopText(ctx, `✨ ${festTitle} ✨`, width / 2, wishHeadlineY, 34, 'gold');
    drawMega3DPopText(ctx, 'की मंगलमय शुभकामनाएँ', width / 2, wishHeadlineY + 44, 28, 'white');
  }

  // 8. Glowing Wishes Poetry Box (बड़े, साफ़, स्पष्ट अक्षर)
  const typingDuration = Math.min(Math.max(time * 0.6, 3.5), 8.0);
  const typingProgress = Math.min(Math.max((time - 0.2) / typingDuration, 0), 1);
  const charsToShow = Math.floor(typingProgress * fullPoem.length);
  const poemSlice = fullPoem.slice(0, charsToShow);

  ctx.save();
  const textBoxX = 20;
  const textBoxY = 750;
  const textBoxW = width - 40;
  const textBoxH = 235;

  // Dark frosted container
  ctx.fillStyle = 'rgba(20, 15, 12, 0.97)';
  ctx.beginPath();
  ctx.roundRect(textBoxX, textBoxY, textBoxW, textBoxH, [20]);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Crisp, clean Devanagari typography
  const maxLineW = textBoxW - 36;
  ctx.font = 'bold 23px "Noto Sans Devanagari", -apple-system, sans-serif';
  const lines = wrapTextLines(ctx, poemSlice, maxLineW);
  const lineH = 38;
  const startTextY = textBoxY + 46;

  lines.slice(0, 5).forEach((l, idx) => {
    const lineY = startTextY + idx * lineH;
    drawCrispShiningText(ctx, l, width / 2, lineY, 23, {
      textColor: '#ffffff'
    });
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

  // 9. Sacred Mantra Plate in Clear Gold
  if (festival.mantraOrShloka && !isBirthday) {
    ctx.save();
    const mantraX = 20;
    const mantraY = 998;
    const mantraW = width - 40;
    const mantraH = 72;

    ctx.fillStyle = 'rgba(28, 18, 12, 0.97)';
    ctx.beginPath();
    ctx.roundRect(mantraX, mantraY, mantraW, mantraH, [16]);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    drawCrispShiningText(
      ctx, 
      `🌸 ${festival.mantraOrShloka.slice(0, 46)}${festival.mantraOrShloka.length > 46 ? '...' : ''} 🌸`, 
      width / 2, 
      mantraY + 44, 
      20, 
      {
        textColor: '#fde047',
        isSerif: true
      }
    );
    ctx.restore();
  }

  // 10. Scrolling Marquee Ribbon
  const tickerY = 1082;
  const tickerH = 80;
  const tickerText = isBirthday
    ? `🎉 HAPPY BIRTHDAY ${birthdayPerson || 'आकाश'} 🎉 • Wishing you boundless happiness & divine health • ${senderName} की ओर से ढेर सारी शुभकामनाएँ 🎂🎈✨ • `
    : `🪔 ${festival.nameHi} की हार्दिक शुभकामनाएँ 🪔 • ${festival.taglineHi} • ${festival.mantraOrShloka || '॥ ॐ श्रीं महालक्ष्म्यै नमः ॥'} • ${senderName} की ओर से सपरिवार मंगलकामनाएँ 🌸✨ • `;

  ctx.save();
  const ribGrad = ctx.createLinearGradient(0, tickerY, 0, tickerY + tickerH);
  ribGrad.addColorStop(0, '#651c04');
  ribGrad.addColorStop(0.5, '#a2300b');
  ribGrad.addColorStop(1, '#451002');
  ctx.fillStyle = ribGrad;
  ctx.fillRect(0, tickerY, width, tickerH);

  // Dual Golden Top & Bottom Border Rails
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, tickerY);
  ctx.lineTo(width, tickerY);
  ctx.moveTo(0, tickerY + tickerH);
  ctx.lineTo(width, tickerY + tickerH);
  ctx.stroke();

  // Fast smooth text movement from right to left
  const speed = 140; // px/sec
  ctx.font = 'bold 21px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'left';
  const textWidth = ctx.measureText(tickerText).width;
  const offset = (time * speed) % (textWidth || 1);

  const fullRepeated = tickerText + tickerText + tickerText;
  drawCrispShiningText(ctx, fullRepeated, width - offset, tickerY + 48, 21, {
    align: 'left',
    textColor: '#ffffff'
  });
  ctx.restore();

  // 11. Multi-Depth Floating Particles (3D Gold Confetti Ribbons matching reference image)
  ctx.save();
  particles.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rot += p.rotSpeed;

    if (p.y < 0) p.y = height + 10;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;

    const flicker = 0.8 + Math.sin(time * 3 + p.x) * 0.2;
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * flicker));

    if (p.type === 'diya') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // Diya clay base
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Glowing flame
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -p.size * 0.8, p.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (p.type === 'confetti') {
      // 3D Metallic Golden Confetti Ribbon (like reference image)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const confGrad = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
      confGrad.addColorStop(0, '#fef08a');
      confGrad.addColorStop(0.5, '#f59e0b');
      confGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = confGrad;
      ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
      ctx.restore();
    } else if (p.type === 'bokeh') {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
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
