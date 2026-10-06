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

export interface SuvicharCardOptions {
  suvichar: SuvicharItem;
  background: SuvicharBackground;
  customBackgroundUrl?: string | null;
  senderName: string;
  senderPhoto?: string | null;
  aspectRatio: 'square' | 'story'; // 'square' (1:1 1080x1080) or 'story' (9:16 1080x1920)
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
    styleId = 'gold_floral',
    headlineOverride,
    customBadge1,
    customBadge2,
    fontSizeMultiplier = 1.5,
    photoScale = 1.25,
    targetElement
  } = options;

  // 1. Direct 1-to-1 Pixel Perfect Capture from Live Screen Preview Element if available
  if (targetElement) {
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const capturedCanvas = await html2canvas(targetElement, {
        scale: 4, // 4x Super Retina 8K Resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      return new Promise<{ blob: Blob; fileName: string }>((resolve, reject) => {
        capturedCanvas.toBlob(
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
    } catch (domCaptureErr) {
      console.warn('DOM html2canvas capture failed, using canvas fallback:', domCaptureErr);
    }
  }

  const style = getSuvicharStyleById(styleId);
  const isStory = aspectRatio === 'story';
  const logicalWidth = 1080;
  const logicalHeight = isStory ? 1920 : 1080;
  const scaleFactor = 2; // 2x Super Retina 4K/8K (2160 x 3840 for Story, 2160 x 2160 for Square)
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

  // Draw 🐦 Bird on top right
  ctx.font = `${isStory ? 48 : 38}px sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('🐦🌿', width - 40, borderMargin + 25);

  // Draw 💖 Hearts on left
  ctx.textAlign = 'left';
  ctx.fillText('💖', borderMargin + 25, height * 0.35);

  ctx.restore();

  // 3. Card Top Branding removed for clean reference style
  let headerBottomY = isStory ? 70 : 50;

  // 4. PARSE SUVICHAR & PREPARE TEXT
  let rawText = suvichar.hindiText;
  if (language === 'english') rawText = suvichar.englishText;
  else if (language === 'marathi' && suvichar.marathiText) rawText = suvichar.marathiText;
  else if (language === 'gujarati' && suvichar.gujaratiText) rawText = suvichar.gujaratiText;

  const parsed = parseSuvicharContent(rawText, customBadge1, customBadge2);
  const badge1Text = customBadge1 || parsed.badge1;
  const badge2Text = customBadge2 || parsed.badge2;
  const headlineText = headlineOverride ? headlineOverride.trim() : '';

  // 5. CALCULATE BOTTOM ELEMENTS DIMENSIONS & POSITIONS
  const hasUserPhoto = !!(userImg && ((userImg.width > 0) || (userImg.naturalWidth > 0) || userImg.complete));
  const basePhotoR = isStory ? 95 : 70;
  const photoR = hasUserPhoto ? Math.round(basePhotoR * photoScale) : 0;
  const plateH = isStory ? 68 : 52;
  const plateW = isStory ? 580 : 460;
  const plateX = (width - plateW) / 2;

  const footerTextH = isStory ? 28 : 22;
  const footerTextY = height - (isStory ? 34 : 26);

  const bottomLinkH = isStory ? 44 : 36;
  const bottomLinkY = footerTextY - bottomLinkH - (isStory ? 18 : 12);

  const plateY = bottomLinkY - plateH - (isStory ? 16 : 10);
  const photoX = width / 2;
  const photoY = hasUserPhoto ? plateY - 14 - photoR : 0;

  // Virtue Tag Position directly above user photo
  const tagY = hasUserPhoto ? (photoY - photoR - (isStory ? 26 : 18)) : (plateY - (isStory ? 26 : 18));
  const contentBottomBoundary = tagY - (isStory ? 36 : 24);

  // 6. MIDDLE CONTENT AREA (Headline + Quote + Ornament)
  const availableContentH = Math.max(220, contentBottomBoundary - headerBottomY);
  let middleY = headerBottomY;

  // Headline if specified
  if (headlineText && headlineText.length > 0) {
    const hSize = isStory ? 56 : 42;
    ctx.save();
    ctx.font = `900 ${hSize}px ${style.canvasFontFamily}`;
    ctx.fillStyle = style.highlightColor || (style.isDarkTheme ? '#fde047' : '#b45309');
    ctx.textAlign = 'center';
    ctx.shadowColor = style.isDarkTheme ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    ctx.fillText(headlineText, width / 2, middleY + hSize * 0.8);
    ctx.restore();
    middleY += hSize * 1.2;
  }

  // 📖 MAIN BOLD QUOTE WITH CURLY QUOTES “ ... ”
  const formattedQuote = `“${rawText.trim()}”`;
  const maxQuoteW = width - (isStory ? 140 : 110);

  let quoteFontSize = Math.round((isStory ? 54 : 38) * fontSizeMultiplier);
  if (formattedQuote.length > 130) {
    quoteFontSize = Math.round((isStory ? 44 : 30) * fontSizeMultiplier);
  } else if (formattedQuote.length > 80) {
    quoteFontSize = Math.round((isStory ? 48 : 34) * fontSizeMultiplier);
  }

  const minQuoteSize = Math.round((isStory ? 34 : 24) * Math.min(1.3, fontSizeMultiplier));
  let quoteLines: string[] = [];
  let quoteLineH = Math.round(quoteFontSize * 1.55);

  while (quoteFontSize >= minQuoteSize) {
    ctx.font = `bold ${quoteFontSize}px ${style.canvasFontFamily}`;
    quoteLines = wrapTextToLines(ctx, formattedQuote, maxQuoteW);
    const totalLinesHeight = quoteLines.length * quoteLineH;
    if (totalLinesHeight <= availableContentH - (isStory ? 60 : 40)) {
      break;
    }
    quoteFontSize -= 2;
    quoteLineH = Math.round(quoteFontSize * 1.55);
  }

  const quoteTotalBlockH = quoteLines.length * quoteLineH;
  let quoteStartY = middleY + Math.max(0, (availableContentH - quoteTotalBlockH) / 2) + Math.round(quoteLineH * 0.4);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  quoteLines.forEach((line) => {
    ctx.save();
    ctx.font = `bold ${quoteFontSize}px ${style.canvasFontFamily}`;
    
    // Drop shadow
    if (style.isDarkTheme) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = style.textColor;
    } else {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.98)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = style.textColor;
    }

    // Outer subtle contrast stroke
    ctx.lineWidth = 3;
    ctx.strokeStyle = style.isDarkTheme ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.92)';
    ctx.strokeText(line, width / 2, quoteStartY);
    ctx.fillText(line, width / 2, quoteStartY);
    ctx.restore();

    quoteStartY += quoteLineH;
  });
  ctx.restore();

  // Decorative Ornament below text
  ctx.save();
  ctx.font = `${isStory ? 32 : 24}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(style.ornament || '🌸 💖 🌸', width / 2, quoteStartY + (isStory ? 16 : 8));
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
