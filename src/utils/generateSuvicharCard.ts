/**
 * High-Definition (1080p / 4K) Suvichar Card Image Generator
 * Exact 100% Visual Replica of the Live Studio Preview Card.
 */

import { SuvicharItem, SuvicharBackground, getDayAndTimeFormatted } from '../data/dailySuvicharData';
import { 
  SuvicharStyleOption, 
  getSuvicharStyleById, 
  parseSuvicharContent 
} from '../data/suvicharStylesData';
import { resolveDirectImageUrl, getGoogleDriveFallbackUrls } from './googleDriveHelper';

export type SuvicharAspectRatio = '1:1' | '9:16' | '4:5' | '16:9' | '3:4' | 'square' | 'story';

export interface SuvicharCardOptions {
  suvichar: SuvicharItem;
  background: SuvicharBackground;
  customBackgroundUrl?: string | null;
  senderName: string;
  senderPhoto?: string | null;
  aspectRatio: SuvicharAspectRatio; // 1:1, 9:16, 4:5, 16:9, 3:4
  language: 'hindi' | 'english' | 'marathi' | 'gujarati';
  showDayAndTime?: boolean;
  styleId?: string;
  headlineOverride?: string;
  customBadge1?: string;
  customBadge2?: string;
  fontSizeMultiplier?: number;
  photoScale?: number;
  targetElement?: HTMLElement | null; // Direct live preview DOM element for 100% pixel-perfect capture
}

function loadImg(src: string): Promise<HTMLImageElement | null> {
  if (!src || typeof src !== 'string') return Promise.resolve(null);
  const cleanSrc = src.trim();
  if (!cleanSrc) return Promise.resolve(null);

  if (cleanSrc.startsWith('data:') || cleanSrc.startsWith('blob:')) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = cleanSrc;
    });
  }

  return new Promise((resolve) => {
    const directSrc = resolveDirectImageUrl(cleanSrc);
    const fallbacks = getGoogleDriveFallbackUrls(cleanSrc);
    let fallbackIdx = 0;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const tryNext = () => {
      if (fallbackIdx < fallbacks.length) {
        img.src = fallbacks[fallbackIdx++];
      } else {
        const plainImg = new Image();
        plainImg.onload = () => resolve(plainImg);
        plainImg.onerror = () => resolve(null);
        plainImg.src = cleanSrc;
      }
    };

    img.onload = () => resolve(img);
    img.onerror = () => tryNext();
    img.src = directSrc;
  });
}

function wrapTextToLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function generateSuvicharCardBlob(options: SuvicharCardOptions): Promise<{ blob: Blob; fileName: string }> {
  const { 
    suvichar, 
    background, 
    customBackgroundUrl, 
    senderName, 
    senderPhoto, 
    aspectRatio, 
    language, 
    showDayAndTime = true,
    styleId = 'neon_galaxy_3d',
    headlineOverride,
    customBadge1,
    customBadge2,
    fontSizeMultiplier = 1.5,
    photoScale = 1.25,
    targetElement
  } = options;

  // 1. Direct 1-to-1 Pixel Perfect Capture from Live Screen Preview Element (8K Ultra HD)
  if (targetElement) {
    try {
      // Ensure all custom fonts (Rozha One, Yatra One, Tiro Devanagari Hindi) are 100% loaded
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const htmlToImage = await import('html-to-image');
      // Capture exact DOM with 4x pixelRatio for true 8K Ultra-HD crisp quality
      // skipFonts: true and fontEmbedCSS: '' prevents SecurityError on cross-origin Google Fonts stylesheets
      const blob = await htmlToImage.toBlob(targetElement, {
        pixelRatio: 4,
        quality: 0.98,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: ''
      });

      if (blob) {
        const safeName = (senderName || 'Suvichar').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '-');
        const fileName = `Shubh-Prabhat-Suvichar-${suvichar.number}-${safeName}-8K.jpg`;
        return { blob, fileName };
      }
    } catch (htiErr) {
      console.warn('html-to-image capture fallback to html2canvas:', htiErr);
      try {
        const html2canvasModule = await import('html2canvas');
        const html2canvas = html2canvasModule.default;
        const capturedCanvas = await html2canvas(targetElement, {
          scale: 4, // 8K Ultra-HD
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: false,
          imageTimeout: 12000
        });

        return await new Promise<{ blob: Blob; fileName: string }>((resolve, reject) => {
          capturedCanvas.toBlob(
            (b) => {
              if (!b) {
                reject(new Error('Canvas blob generation failed'));
                return;
              }
              const safeName = (senderName || 'Suvichar').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '-');
              const fileName = `Shubh-Prabhat-Suvichar-${suvichar.number}-${safeName}-8K.jpg`;
              resolve({ blob: b, fileName });
            },
            'image/jpeg',
            0.98
          );
        });
      } catch (h2cErr) {
        console.warn('html2canvas capture also failed, using canvas fallback:', h2cErr);
      }
    }
  }

  const style = getSuvicharStyleById(styleId);
  let logicalWidth = 1080;
  let logicalHeight = 1920;

  if (aspectRatio === '1:1' || aspectRatio === 'square') {
    logicalWidth = 1080;
    logicalHeight = 1080;
  } else if (aspectRatio === '9:16' || aspectRatio === 'story') {
    logicalWidth = 1080;
    logicalHeight = 1920;
  } else if (aspectRatio === '4:5') {
    logicalWidth = 1080;
    logicalHeight = 1350;
  } else if (aspectRatio === '16:9') {
    logicalWidth = 1920;
    logicalHeight = 1080;
  } else if (aspectRatio === '3:4') {
    logicalWidth = 1080;
    logicalHeight = 1440;
  }

  const isStory = logicalHeight >= 1400;
  const scaleFactor = 2; // 2x Super Retina 4K/8K
  const width = logicalWidth;
  const height = logicalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = logicalWidth * scaleFactor;
  canvas.height = logicalHeight * scaleFactor;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('2D context not available');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.scale(scaleFactor, scaleFactor);

  // Load images
  const bgToLoad = customBackgroundUrl || (background.type === 'image' && background.id !== 'default_plain' ? background.url : '');
  const [bgImg, userImg] = await Promise.all([
    bgToLoad ? loadImg(bgToLoad) : Promise.resolve(null),
    senderPhoto ? loadImg(senderPhoto) : Promise.resolve(null)
  ]);

  // 1. Render Background
  if (bgImg && bgImg.complete && bgImg.width > 0) {
    const scale = Math.max(width / bgImg.width, height / bgImg.height);
    const scaledW = bgImg.width * scale;
    const scaledH = bgImg.height * scale;
    const posX = (width - scaledW) / 2;
    const posY = (height - scaledH) / 2;
    ctx.drawImage(bgImg, posX, posY, scaledW, scaledH);

    // Exact match vignette overlay from Live Studio Preview
    const overlayGrad = ctx.createLinearGradient(0, height, 0, 0);
    if (style.isDarkTheme) {
      overlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
      overlayGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.65)');
      overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.50)');
    } else {
      overlayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      overlayGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.70)');
      overlayGrad.addColorStop(1, 'rgba(255, 255, 255, 0.80)');
    }
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Canvas Backdrop
    const bgGrad = ctx.createRadialGradient(
      width / 2, 
      height * 0.4, 
      80, 
      width / 2, 
      height * 0.5, 
      height * 0.8
    );
    bgGrad.addColorStop(0, style.bgGrad[0]);
    bgGrad.addColorStop(0.5, style.bgGrad[1]);
    bgGrad.addColorStop(1, style.bgGrad[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Outer Rounded Border Frame (Matching live preview rounded-3xl)
  const borderMargin = 20;
  const cornerRadius = 44;
  ctx.save();
  ctx.strokeStyle = style.isDarkTheme ? 'rgba(251, 191, 36, 0.9)' : '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(borderMargin, borderMargin, width - borderMargin * 2, height - borderMargin * 2, [cornerRadius]);
  ctx.stroke();

  // Inner subtle decorative border rail
  ctx.strokeStyle = style.isDarkTheme ? 'rgba(251, 191, 36, 0.35)' : 'rgba(217, 119, 6, 0.35)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(borderMargin + 10, borderMargin + 10, width - (borderMargin + 10) * 2, height - (borderMargin + 10) * 2, [cornerRadius - 8]);
  ctx.stroke();

  // Draw cliparts (Bird 🐦🌿 + Heart 💖 + Sparkle ✨) together in ONE corner (Top Right)
  ctx.font = `${isStory ? 40 : 30}px sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('🐦🌿 💖 ✨', width - 40, borderMargin + 25);

  ctx.restore();

  // 3. Card Top: Always render 3D Gold Headline & Day/Time Badge (Matching Live Preview)
  const headlineToDraw = headlineOverride?.trim() || style.defaultHeadline || 'सुविचार';
  const hSize = isStory ? 72 : 54;
  let currentY = borderMargin + (isStory ? 45 : 30);

  // Top Filigree with Golden Heart
  ctx.save();
  ctx.font = `${isStory ? 24 : 18}px sans-serif`;
  ctx.fillStyle = '#fde047';
  ctx.textAlign = 'center';
  ctx.fillText('⚜️ 💛 ⚜️', width / 2, currentY);
  ctx.restore();
  currentY += isStory ? 35 : 25;

  // 3D Gold Embossed Headline Title
  ctx.save();
  ctx.font = `900 ${hSize}px ${style.canvasFontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // Multi-layer 3D gold extrusion shadows
  const goldShadows = [
    { color: '#451a03', y: 8, x: 0 },
    { color: '#78350f', y: 6, x: 0 },
    { color: '#b45309', y: 5, x: 0 },
    { color: '#d97706', y: 4, x: 0 },
    { color: '#f59e0b', y: 3, x: 0 },
    { color: '#fde047', y: 1, x: 0 }
  ];
  goldShadows.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.fillText(headlineToDraw, width / 2 + s.x, currentY + s.y);
  });
  ctx.fillStyle = '#fffbeb';
  ctx.fillText(headlineToDraw, width / 2, currentY);
  ctx.restore();
  currentY += hSize + (isStory ? 16 : 10);

  // Live Day & Time Badge
  if (showDayAndTime) {
    const dtInfo = getDayAndTimeFormatted(language);
    const dtText = `🕒 ${dtInfo.badgeText}`;
    ctx.save();
    const dtFontSize = isStory ? 20 : 15;
    ctx.font = `bold ${dtFontSize}px ${style.canvasFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const dtW = ctx.measureText(dtText).width + (isStory ? 36 : 24);
    const dtH = isStory ? 34 : 26;
    const dtX = (width - dtW) / 2;

    ctx.fillStyle = style.isDarkTheme ? 'rgba(0, 0, 0, 0.88)' : 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.roundRect(dtX, currentY, dtW, dtH, [dtH / 2]);
    ctx.fill();

    ctx.strokeStyle = style.isDarkTheme ? '#f59e0b' : '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = style.isDarkTheme ? '#fde047' : '#b45309';
    ctx.fillText(dtText, width / 2, currentY + dtH / 2);
    ctx.restore();
    currentY += dtH + (isStory ? 25 : 16);
  }

  const headerBottomY = currentY;

  // 4. PARSE SUVICHAR & PREPARE TEXT
  let rawText = suvichar.hindiText;
  if (language === 'english') rawText = suvichar.englishText;
  else if (language === 'marathi' && suvichar.marathiText) rawText = suvichar.marathiText;
  else if (language === 'gujarati' && suvichar.gujaratiText) rawText = suvichar.gujaratiText;

  const parsed = parseSuvicharContent(rawText, customBadge1, customBadge2);
  const badge1Text = customBadge1 || parsed.badge1;
  const badge2Text = customBadge2 || parsed.badge2;

  // 5. CALCULATE BOTTOM ELEMENTS DIMENSIONS & POSITIONS
  const hasUserPhoto = !!(userImg && ((userImg.width > 0) || (userImg.naturalWidth > 0) || userImg.complete));
  const basePhotoR = isStory ? 90 : 68;
  const photoR = hasUserPhoto ? Math.round(basePhotoR * photoScale) : 0;
  const plateH = isStory ? 64 : 48;
  const plateW = isStory ? 560 : 440;
  const plateX = (width - plateW) / 2;

  const footerTextH = isStory ? 26 : 20;
  const footerTextY = height - borderMargin - (isStory ? 28 : 20);

  const bottomLinkH = isStory ? 40 : 32;
  const bottomLinkY = footerTextY - bottomLinkH - (isStory ? 14 : 10);

  const plateY = bottomLinkY - plateH - (isStory ? 14 : 8);
  const photoX = width / 2;
  const photoY = hasUserPhoto ? plateY - 12 - photoR : 0;

  // Virtue Tag Position directly above user photo
  const tagY = hasUserPhoto ? (photoY - photoR - (isStory ? 24 : 16)) : (plateY - (isStory ? 24 : 16));
  const contentBottomBoundary = tagY - (isStory ? 28 : 18);

  // 6. MIDDLE CONTENT AREA (Balanced vertical distribution - ZERO dead gaps)
  const availableContentH = Math.max(260, contentBottomBoundary - headerBottomY);
  const cleanThought = rawText
    .replace(/["“”'‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Smart Balanced Devanagari Line Splitting
  const words = cleanThought.split(' ');
  const targetWordsPerLine = Math.max(3, Math.ceil(words.length / (words.length > 14 ? 3 : 2)));
  const calculatedLines: string[] = [];
  let curLineWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    curLineWords.push(words[i]);
    const isPunct = /[।!?,\n]$/.test(words[i]);
    if (curLineWords.length >= targetWordsPerLine || (isPunct && curLineWords.length >= 2)) {
      calculatedLines.push(curLineWords.join(' '));
      curLineWords = [];
    }
  }
  if (curLineWords.length > 0) {
    if (calculatedLines.length > 0 && curLineWords.length <= 2) {
      calculatedLines[calculatedLines.length - 1] += ' ' + curLineWords.join(' ');
    } else {
      calculatedLines.push(curLineWords.join(' '));
    }
  }

  const quoteLines = calculatedLines.length > 0 ? calculatedLines : [cleanThought];

  // Dynamically calculate font size and line height to fill the available space naturally
  let quoteFontSize = isStory ? 52 : 38;
  if (quoteLines.length <= 2) {
    quoteFontSize = isStory ? 64 : 46;
  } else if (quoteLines.length >= 4) {
    quoteFontSize = isStory ? 44 : 32;
  }
  quoteFontSize = Math.round(quoteFontSize * fontSizeMultiplier);

  let quoteLineH = Math.round(quoteFontSize * 1.55);
  while (quoteLines.length * quoteLineH > availableContentH - (isStory ? 60 : 40) && quoteFontSize > 22) {
    quoteFontSize -= 2;
    quoteLineH = Math.round(quoteFontSize * 1.55);
  }

  const totalLinesH = quoteLines.length * quoteLineH;
  let quoteStartY = headerBottomY + Math.max(10, (availableContentH - totalLinesH) / 2) + Math.round(quoteLineH * 0.4);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  quoteLines.forEach((line, idx) => {
    ctx.save();
    ctx.font = `900 ${quoteFontSize}px ${style.canvasFontFamily}`;

    const isPink = idx % 3 === 1;
    const isWhite = idx % 3 === 2;

    if (style.cardTheme === 'royal_emerald_plates' || style.isDarkTheme) {
      if (isPink) {
        // 3D Rose/Magenta Highlight
        ctx.fillStyle = '#db2777';
        ctx.fillText(line, width / 2, quoteStartY + 3);
        ctx.fillStyle = '#be185d';
        ctx.fillText(line, width / 2, quoteStartY + 2);
        ctx.fillStyle = '#f472b6';
        ctx.fillText(line, width / 2, quoteStartY);
      } else if (isWhite) {
        // 3D Crisp White
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(line, width / 2, quoteStartY);
      } else {
        // 3D 24K Gold Extrusion
        const goldSh = [
          { color: '#451a03', y: 5 },
          { color: '#78350f', y: 4 },
          { color: '#b45309', y: 3 },
          { color: '#d97706', y: 2 },
          { color: '#f59e0b', y: 1 }
        ];
        goldSh.forEach(gs => {
          ctx.fillStyle = gs.color;
          ctx.fillText(line, width / 2, quoteStartY + gs.y);
        });
        ctx.fillStyle = '#fef08a';
        ctx.fillText(line, width / 2, quoteStartY);
      }
    } else {
      ctx.fillStyle = style.textColor;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 8;
      ctx.fillText(line, width / 2, quoteStartY);
    }
    ctx.restore();

    quoteStartY += quoteLineH;
  });
  ctx.restore();

  // Decorative Golden Heart Flourish directly below quote
  ctx.save();
  ctx.font = `${isStory ? 26 : 20}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde047';
  ctx.fillText('⚜️ 💛 ⚜️', width / 2, quoteStartY + (isStory ? 14 : 8));
  ctx.restore();

  // 7. 🏷️ VIRTUE BADGE PILL (e.g. ✨ सत्य वचन • सकारात्मक विचार ✨)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const badgeFontSize = isStory ? 20 : 15;
  ctx.font = `bold ${badgeFontSize}px ${style.canvasFontFamily}`;
  const virtueDisplayText = `✨ ${badge1Text}  •  ${badge2Text} ✨`;
  const textW = ctx.measureText(virtueDisplayText).width;
  const vPillW = textW + (isStory ? 48 : 36);
  const vPillH = isStory ? 38 : 30;
  const vPillX = (width - vPillW) / 2;
  const vPillY = tagY - vPillH / 2;

  ctx.fillStyle = style.isDarkTheme ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.roundRect(vPillX, vPillY, vPillW, vPillH, [vPillH / 2]);
  ctx.fill();

  ctx.strokeStyle = style.isDarkTheme ? '#f59e0b' : '#d97706';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = style.isDarkTheme ? '#fde047' : '#92400e';
  ctx.fillText(virtueDisplayText, width / 2, tagY + 1);
  ctx.restore();

  // 8. 👑 ROUND USER PHOTO WITH GOLDEN HALO & STAR BADGE
  if (hasUserPhoto && userImg) {
    ctx.save();
    // Halo Glow
    const haloGrad = ctx.createRadialGradient(photoX, photoY, photoR, photoX, photoY, photoR + 24);
    haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
    haloGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 24, 0, Math.PI * 2);
    ctx.fill();

    // Outer Golden Ring
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 3, 0, Math.PI * 2);
    ctx.fill();

    // Clip & Draw Photo
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    ctx.clip();

    const naturalW = userImg.naturalWidth || userImg.width || 1;
    const naturalH = userImg.naturalHeight || userImg.height || 1;
    const uScale = Math.max((photoR * 2) / naturalW, (photoR * 2) / naturalH);
    const uW = naturalW * uScale;
    const uH = naturalH * uScale;
    const uX = photoX - uW / 2;
    const uY = photoY - uH / 2;
    ctx.drawImage(userImg, uX, uY, uW, uH);
    ctx.restore();

    // Star Emblem Badge
    ctx.save();
    const starX = photoX + photoR * 0.72;
    const starY = photoY + photoR * 0.72;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(starX, starY, isStory ? 18 : 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#1c1917';
    ctx.font = `bold ${isStory ? 16 : 12}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', starX, starY);
    ctx.restore();
  }

  // 9. 🏷️ SENDER NAME PLATE (Glass with gold border)
  ctx.save();
  ctx.textAlign = 'center';
  const pGrad = ctx.createLinearGradient(plateX, plateY, plateX + plateW, plateY + plateH);
  if (style.isDarkTheme) {
    pGrad.addColorStop(0, 'rgba(0, 0, 0, 0.90)');
    pGrad.addColorStop(1, 'rgba(20, 10, 5, 0.95)');
  } else {
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    pGrad.addColorStop(1, 'rgba(254, 243, 199, 0.95)');
  }

  ctx.fillStyle = pGrad;
  ctx.beginPath();
  ctx.roundRect(plateX, plateY, plateW, plateH, [18]);
  ctx.fill();

  ctx.strokeStyle = style.isDarkTheme ? '#f59e0b' : '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = style.isDarkTheme ? '#fde68a' : '#92400e';
  ctx.font = `bold ${isStory ? 15 : 12}px sans-serif`;
  ctx.fillText('✨ सप्रेम शुभकामना प्रेषक ✨', width / 2, plateY + (isStory ? 22 : 18));

  ctx.fillStyle = style.isDarkTheme ? '#ffffff' : '#1c1917';
  ctx.font = `900 ${isStory ? 28 : 22}px ${style.canvasFontFamily}`;
  if (style.isDarkTheme) {
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 8;
  }
  ctx.fillText(senderName || 'आपका शुभचिंतक', width / 2, plateY + (isStory ? 52 : 40));
  ctx.restore();

  // 10. 🌐 3D EMBOSSED WEBSITE CTA PILL (✨ अपना नाम लिखकर स्टेटस बनाएँ ➔ shubhakamna.in)
  ctx.save();
  ctx.textAlign = 'center';
  const linkW = isStory ? 580 : 460;
  const linkX = (width - linkW) / 2;

  // 3D Drop Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = isStory ? 14 : 9;
  ctx.shadowOffsetY = isStory ? 5 : 3;

  const linkGrad = ctx.createLinearGradient(linkX, bottomLinkY, linkX, bottomLinkY + bottomLinkH);
  if (style.isDarkTheme) {
    linkGrad.addColorStop(0, '#292524');
    linkGrad.addColorStop(1, '#1c1917');
  } else {
    linkGrad.addColorStop(0, '#ffffff');
    linkGrad.addColorStop(1, '#fef3c7');
  }

  ctx.fillStyle = linkGrad;
  ctx.beginPath();
  ctx.roundRect(linkX, bottomLinkY, linkW, bottomLinkH, [bottomLinkH / 2]);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = style.isDarkTheme ? '#fef08a' : '#92400e';
  ctx.font = `bold ${isStory ? 19 : 15}px ${style.canvasFontFamily}`;
  ctx.fillText('✨ अपना नाम लिखकर स्टेटस बनाएँ ➔ shubhakamna.in', width / 2, bottomLinkY + (isStory ? 28 : 23));

  // Footer Subtitle
  ctx.fillStyle = style.isDarkTheme ? '#cbd5e1' : '#475569';
  ctx.font = `600 ${isStory ? 14 : 11}px sans-serif`;
  ctx.fillText('🌅 दैनिक १००+ शुभ प्रभात सुविचार • मुफ़्त कार्ड जनरेटर', width / 2, footerTextY);
  ctx.restore();

  // 11. Export as Ultra-HD 4K/8K JPEG Blob
  return new Promise<{ blob: Blob; fileName: string }>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas blob generation failed'));
          return;
        }
        const safeName = (senderName || 'Suvichar').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '-');
        const fileName = `Shubh-Prabhat-Suvichar-${suvichar.number}-${safeName}-8K.jpg`;
        resolve({ blob, fileName });
      },
      'image/jpeg',
      0.98
    );
  });
}
