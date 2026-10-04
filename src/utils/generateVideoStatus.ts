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
  onProgress?: (percent: number, statusText: string) => void;
  durationSeconds?: number;
}

export interface VideoStatusResult {
  blob: Blob;
  url: string;
  mimeType: string;
  extension: string;
  fileName: string;
}

/**
 * Loads an image URL into an HTMLImageElement safely with CORS.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback: create placeholder canvas
      const fb = document.createElement('canvas');
      fb.width = 1000;
      fb.height = 1000;
      const ctx = fb.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, 1000, 1000);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ पावन मंगल दर्शन ✨', 500, 500);
      }
      const fbImg = new Image();
      fbImg.src = fb.toDataURL();
      fbImg.onload = () => resolve(fbImg);
      fbImg.onerror = () => reject(new Error('Image load failed'));
    };
    img.src = src;
  });
}

/**
 * Helper to synthesize rich festive audio track for the video.
 */
function createFestiveAudioStream(durationSec: number, isBirthday: boolean): { stream: MediaStreamTrack | null; cleanup: () => void } {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return { stream: null, cleanup: () => {} };

    const audioCtx = new AudioContextClass();
    const dest = audioCtx.createMediaStreamDestination();

    // Create festive ambient music oscillators
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    masterGain.connect(dest);

    if (isBirthday) {
      // Synthesize Happy Birthday melody notes: C4, C4, D4, C4, F4, E4 ...
      const notes = [
        { f: 261.63, d: 0.35, p: 0.1 }, // Hap-
        { f: 261.63, d: 0.35, p: 0.5 }, // py
        { f: 293.66, d: 0.6, p: 0.9 },  // Birth-
        { f: 261.63, d: 0.6, p: 1.6 },  // day
        { f: 349.23, d: 0.6, p: 2.3 },  // to
        { f: 329.63, d: 1.0, p: 3.0 },  // you
        // Repeat phrase 2
        { f: 261.63, d: 0.35, p: 4.2 },
        { f: 261.63, d: 0.35, p: 4.6 },
        { f: 293.66, d: 0.6, p: 5.0 },
        { f: 261.63, d: 0.6, p: 5.7 },
        { f: 392.00, d: 0.6, p: 6.4 },
        { f: 349.23, d: 1.0, p: 7.1 },
      ];

      notes.forEach(n => {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, audioCtx.currentTime + n.p);
        
        noteGain.gain.setValueAtTime(0, audioCtx.currentTime + n.p);
        noteGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + n.p + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + n.p + n.d);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(audioCtx.currentTime + n.p);
        osc.stop(audioCtx.currentTime + n.p + n.d + 0.1);
      });
    } else {
      // Synthesize auspicious temple bells + tanpura drone + shehnai chime
      // 1. Tanpura Root Drones (Sa-Pa, C3 & G3)
      [130.81, 196.00, 261.63].forEach(freq => {
        const droneOsc = audioCtx.createOscillator();
        const droneGain = audioCtx.createGain();
        droneOsc.type = 'sawtooth';
        droneOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        droneGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

        // Lowpass filter for warm acoustic resonance
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);

        droneOsc.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(masterGain);
        droneOsc.start();
        droneOsc.stop(audioCtx.currentTime + durationSec);
      });

      // 2. Temple Bell Chimes periodically (at 0s, 3s, 6s, 9s)
      [0.2, 3.2, 6.4, 9.6].forEach(time => {
        [523.25, 659.25, 783.99, 1046.50].forEach((bellFreq, idx) => {
          const bellOsc = audioCtx.createOscillator();
          const bellGain = audioCtx.createGain();
          bellOsc.type = 'sine';
          bellOsc.frequency.setValueAtTime(bellFreq * (1 + idx * 0.02), audioCtx.currentTime + time);
          
          bellGain.gain.setValueAtTime(0, audioCtx.currentTime + time);
          bellGain.gain.linearRampToValueAtTime(0.3 / (idx + 1), audioCtx.currentTime + time + 0.02);
          bellGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + time + 2.2);

          bellOsc.connect(bellGain);
          bellGain.connect(masterGain);
          bellOsc.start(audioCtx.currentTime + time);
          bellOsc.stop(audioCtx.currentTime + time + 2.3);
        });
      });
    }

    const audioTrack = dest.stream.getAudioTracks()[0] || null;
    return {
      stream: audioTrack,
      cleanup: () => {
        try {
          audioCtx.close();
        } catch {}
      }
    };
  } catch {
    return { stream: null, cleanup: () => {} };
  }
}

/**
 * Generates an animated WhatsApp 8K/HD (1080 x 1920) Video Status (.MP4 / .WEBM).
 */
export async function generateVideoStatusBlob(options: VideoStatusOptions): Promise<VideoStatusResult> {
  const {
    festival,
    senderName,
    userPhoto,
    birthdayPerson,
    birthdayPhoto,
    poem,
    greetingTitle,
    heroImageOverride,
    onProgress,
    durationSeconds = 10
  } = options;

  const isBirthday = festival.id === 'birthday' || festival.soundType === 'birthday' || !!birthdayPerson;
  const effectivePhoto = birthdayPhoto || userPhoto;

  onProgress?.(5, 'फ़ोटो और फ़ॉन्ट लोड हो रहे हैं...');

  // Setup 9:16 Vertical Video Canvas (1080 x 1920)
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Load Hero and User Images
  const heroSrc = heroImageOverride || festival.heroImage;
  const heroImg = await loadImage(heroSrc);
  let userImg: HTMLImageElement | null = null;
  if (effectivePhoto) {
    try {
      userImg = await loadImage(effectivePhoto);
    } catch {
      userImg = null;
    }
  }

  onProgress?.(15, 'एनिमेशन व ऑडियो तैयार हो रहे हैं...');

  // Setup MediaRecorder from Canvas Stream
  const fps = 30;
  const totalFrames = Math.floor(durationSeconds * fps);
  const stream = canvas.captureStream(fps);

  // Setup Audio Track
  const audioSetup = createFestiveAudioStream(durationSeconds, isBirthday);
  if (audioSetup.stream) {
    stream.addTrack(audioSetup.stream);
  }

  // Determine best supported MIME type
  let mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  let extension = 'mp4';

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
      extension = 'mp4';
    } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9,opus')) {
      mimeType = 'video/webm; codecs=vp9,opus';
      extension = 'webm';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
      extension = 'webm';
    } else {
      mimeType = '';
      extension = 'webm';
    }
  }

  const chunks: Blob[] = [];
  const recorder = mimeType 
    ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 })
    : new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.start();

  // Particle System
  const particles: Array<{ x: number; y: number; size: number; speedY: number; speedX: number; alpha: number; type: string }> = [];
  for (let i = 0; i < 45; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 4,
      speedY: -(Math.random() * 1.5 + 0.6),
      speedX: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.7 + 0.3,
      type: isBirthday ? (i % 3 === 0 ? 'confetti' : 'sparkle') : (i % 2 === 0 ? 'diya' : 'sparkle')
    });
  }

  // Pre-calculate full text for typewriter / handwriting animation
  const fullPoemText = poem || festival.defaultPoem;
  const poemLength = fullPoemText.length;

  // Marquee / Ticker text scrolling from Right to Left
  const tickerText = isBirthday
    ? `🎉 HAPPY BIRTHDAY ${birthdayPerson || 'आकाश'} 🎉 • Wishing you boundless happiness, divine health & immense success • ${senderName} की ओर से ढेर सारी शुभकामनाएँ 🎂🎈✨ • `
    : `🪔 ${festival.nameHi} की हार्दिक शुभकामनाएँ 🪔 • ${festival.taglineHi} • ${festival.mantraOrShloka || '॥ ॐ श्रीं महालक्ष्म्यै नमः ॥'} • ${senderName} की ओर से सपरिवार मंगलकामनाएँ 🌸✨ • `;

  // Render loop using frame-by-frame interpolation
  return new Promise<VideoStatusResult>((resolve, reject) => {
    let currentFrame = 0;

    const renderFrame = () => {
      const time = currentFrame / fps; // current time in seconds
      const progressRatio = currentFrame / totalFrames;

      // ==========================================
      // 1. Background Fill & Hero Image (Ken-Burns)
      // ==========================================
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, width, height);

      // Subtle breathing scale (1.0 to 1.06)
      const scale = 1.0 + Math.sin(time * 0.6) * 0.03;
      const zoomW = width * scale;
      const zoomH = (width * scale * heroImg.height) / heroImg.width;
      const posX = (width - zoomW) / 2;
      const posY = 180 + Math.sin(time * 0.4) * 15;

      ctx.save();
      // Rounded Card for Hero image
      ctx.beginPath();
      ctx.roundRect(40, 180, 1000, 780, [32]);
      ctx.clip();
      ctx.drawImage(heroImg, posX, posY, zoomW, Math.max(zoomH, 780));

      // Vignette inside image
      const imgVignette = ctx.createLinearGradient(0, 180, 0, 960);
      imgVignette.addColorStop(0, 'rgba(0,0,0,0.15)');
      imgVignette.addColorStop(0.7, 'rgba(0,0,0,0.1)');
      imgVignette.addColorStop(1, 'rgba(12,10,9,0.95)');
      ctx.fillStyle = imgVignette;
      ctx.fillRect(40, 180, 1000, 780);
      ctx.restore();

      // Hero Image Golden Frame
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(40, 180, 1000, 780, [32]);
      ctx.stroke();

      // ==========================================
      // 2. Slow Blinking Website Branding (Top)
      // ==========================================
      // Slowly oscillates between 0.65 and 1.0 alpha with golden glow
      const blinkAlpha = 0.75 + Math.sin(time * 2.2) * 0.25;

      ctx.save();
      ctx.globalAlpha = blinkAlpha;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 24 * blinkAlpha;

      // Header Golden Banner Capsule
      ctx.fillStyle = 'rgba(28, 25, 23, 0.85)';
      ctx.beginPath();
      ctx.roundRect(240, 50, 600, 90, [45]);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Glowing Diya Icon & Text
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🪔 Shubhakamna.in 🪔', 540, 108);
      ctx.restore();

      // Top Tagline
      ctx.fillStyle = 'rgba(253, 230, 138, 0.8)';
      ctx.font = '600 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ भारत का आधिकारिक 8K शुभकामना स्टेटस ✨', 540, 160);

      // ==========================================
      // 3. User Photo Overlay if provided
      // ==========================================
      if (userImg) {
        ctx.save();
        const photoX = 120;
        const photoY = 880;
        const photoR = 75;

        // Circular glow
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(photoX, photoY, photoR + 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImg, photoX - photoR, photoY - photoR, photoR * 2, photoR * 2);
        ctx.restore();
      }

      // ==========================================
      // 4. Sender Name Royal Card
      // ==========================================
      const senderCardY = userImg ? 840 : 880;
      const senderCardX = userImg ? 220 : 60;
      const senderCardW = userImg ? 800 : 960;

      ctx.save();
      ctx.fillStyle = 'rgba(24, 24, 27, 0.85)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(senderCardX, senderCardY, senderCardW, 130, [24]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde68a';
      ctx.font = '500 22px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('✨ स्नेह एवं सम्मान सहित प्रेषित ✨', senderCardX + 28, senderCardY + 40);

      // Sender Name in Golden Gradient
      const senderGrad = ctx.createLinearGradient(senderCardX + 28, 0, senderCardX + 500, 0);
      senderGrad.addColorStop(0, '#fef08a');
      senderGrad.addColorStop(0.5, '#f59e0b');
      senderGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = senderGrad;
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(senderName, senderCardX + 28, senderCardY + 95);
      ctx.restore();

      // ==========================================
      // 5. Festival Title
      // ==========================================
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      const displayTitle = isBirthday && birthdayPerson
        ? `🎉 Happy Birthday ${birthdayPerson}! 🎉`
        : greetingTitle;
      ctx.fillText(displayTitle, 540, 1050);
      ctx.restore();

      // ==========================================
      // 6. Handwriting / Typewriter Animation Text
      // ==========================================
      // Calculate how many characters are revealed based on time (starts typing after 0.8s)
      const typingStartTime = 0.8;
      const typingDuration = 6.0; // completes typing in 6s
      const typingProgress = Math.min(Math.max((time - typingStartTime) / typingDuration, 0), 1);
      const charsToShow = Math.floor(typingProgress * poemLength);
      const currentPoemSlice = fullPoemText.slice(0, charsToShow);

      // Card for Handwriting Text
      ctx.save();
      ctx.fillStyle = 'rgba(20, 18, 16, 0.9)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(60, 1100, 960, 360, [28]);
      ctx.fill();
      ctx.stroke();

      // Multiline text wrapping
      ctx.fillStyle = '#fef3c7';
      ctx.font = '500 32px sans-serif';
      ctx.textAlign = 'center';
      
      const words = currentPoemSlice.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      const maxLineWidth = 880;

      for (let w = 0; w < words.length; w++) {
        const testLine = currentLine ? `${currentLine} ${words[w]}` : words[w];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxLineWidth && currentLine) {
          lines.push(currentLine);
          currentLine = words[w];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const lineHeight = 46;
      const startY = 1180;
      lines.slice(0, 5).forEach((line, idx) => {
        ctx.fillText(line, 540, startY + idx * lineHeight);
      });

      // Animated Golden Quill Cursor Sparkle at the end of typing
      if (typingProgress < 1.0 && typingProgress > 0) {
        const cursorAlpha = (Math.sin(time * 12) + 1) / 2;
        ctx.fillStyle = `rgba(251, 191, 36, ${cursorAlpha})`;
        ctx.font = 'bold 32px sans-serif';
        const lastLine = lines[lines.length - 1] || '';
        const lastLineWidth = ctx.measureText(lastLine).width;
        ctx.fillText(' ✍️✨', 540 + lastLineWidth / 2 + 10, startY + (lines.length - 1) * lineHeight);
      }
      ctx.restore();

      // Mantra / Sacred Blessing Plate
      if (festival.mantraOrShloka && !isBirthday) {
        ctx.save();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(60, 1490, 960, 110, [20]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.font = 'italic 500 24px serif';
        ctx.textAlign = 'center';
        ctx.fillText(festival.mantraOrShloka.slice(0, 65) + '...', 540, 1555);
        ctx.restore();
      }

      // ==========================================
      // 7. Right-to-Left Scrolling Wish Ticker Ribbon
      // ==========================================
      const tickerY = 1640;
      const tickerH = 110;

      ctx.save();
      // Ribbon Background
      const ribbonGrad = ctx.createLinearGradient(0, tickerY, 0, tickerY + tickerH);
      ribbonGrad.addColorStop(0, '#78350f');
      ribbonGrad.addColorStop(0.5, '#b45309');
      ribbonGrad.addColorStop(1, '#451a03');
      ctx.fillStyle = ribbonGrad;
      ctx.fillRect(0, tickerY, width, tickerH);

      // Gold Borders
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, tickerY);
      ctx.lineTo(width, tickerY);
      ctx.moveTo(0, tickerY + tickerH);
      ctx.lineTo(width, tickerY + tickerH);
      ctx.stroke();

      // Marquee Text moving from Right to Left
      const scrollSpeed = 160; // pixels per second
      const textMetrics = ctx.measureText(tickerText);
      const totalTextWidth = textMetrics.width * 2.2;
      const tickerOffset = (time * scrollSpeed) % totalTextWidth;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'left';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;

      const repeatedTicker = tickerText + tickerText + tickerText;
      ctx.fillText(repeatedTicker, width - tickerOffset, tickerY + 68);
      ctx.restore();

      // ==========================================
      // 8. Animated Particles (Diyas & Sparkles)
      // ==========================================
      ctx.save();
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = height + 10;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.globalAlpha = p.alpha * (0.8 + Math.sin(time * 3 + p.x) * 0.2);

        if (p.type === 'diya') {
          // Draw small glowing Diya
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Diya flame
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x, p.y - p.size, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'confetti') {
          // Colorful birthday confetti
          const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
          ctx.fillStyle = colors[Math.floor(p.x) % colors.length];
          ctx.fillRect(p.x, p.y, p.size * 1.2, p.size * 0.6);
        } else {
          // 4-point golden sparkle
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      // ==========================================
      // 9. Bottom Footer Badge & WhatsApp Status Stamp
      // ==========================================
      ctx.save();
      ctx.fillStyle = 'rgba(12, 10, 9, 0.95)';
      ctx.fillRect(0, 1780, width, 140);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🟢 WhatsApp Status • 8K Ultra HD Animated Video 🟢', 540, 1835);

      ctx.fillStyle = '#a8a29e';
      ctx.font = '500 20px sans-serif';
      ctx.fillText(`Created with ❤️ on Shubhakamna.in • ${festival.nameHi}`, 540, 1875);
      ctx.restore();

      // Advance Frame
      currentFrame++;
      const percent = Math.min(Math.floor((currentFrame / totalFrames) * 80) + 15, 95);
      onProgress?.(percent, `8K वीडियो रेंडर हो रहा है... ${percent}%`);

      if (currentFrame < totalFrames) {
        requestAnimationFrame(renderFrame);
      } else {
        onProgress?.(98, 'वीडियो फ़ाइल एन्कोड की जा रही है...');
        recorder.stop();
        audioSetup.cleanup();

        recorder.onstop = () => {
          const finalBlob = new Blob(chunks, { type: mimeType || 'video/mp4' });
          const videoUrl = URL.createObjectURL(finalBlob);
          const safeName = (senderName || 'Wishes').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '-');
          const fileName = isBirthday
            ? `Happy-Birthday-${birthdayPerson || 'Akash'}-8K-Status.${extension}`
            : `Shubhakamna-8K-Video-Status-${festival.id}-${safeName}.${extension}`;

          onProgress?.(100, 'वीडियो स्टेटस तैयार है! 🎉');
          resolve({
            blob: finalBlob,
            url: videoUrl,
            mimeType: mimeType || 'video/mp4',
            extension,
            fileName
          });
        };
      }
    };

    renderFrame();
  });
}
