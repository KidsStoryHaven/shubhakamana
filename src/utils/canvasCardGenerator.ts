import { WishCategory, HindiWish } from '../data/wishesData';
import { CardBackground } from '../data/cardBackgroundsData';
import { WishFontOption } from '../data/wishFontsData';
import { resolveDirectImageUrl } from './googleDriveHelper';

export interface CardGenerationOptions {
  category: WishCategory;
  selectedWish: HindiWish;
  senderName: string;
  userPhotoUrl?: string | null;
  customMessage?: string;
  birthdayPersonName?: string;
  birthdayPersonPhotoUrl?: string | null;
  background?: CardBackground;
  customBackgroundUrl?: string | null;
  font?: WishFontOption;
}

/**
 * Renders a 1080x1920 (9:16) ultra HD mobile wishing card onto an offscreen canvas
 * with support for 108+ professional photographic and gradient backgrounds.
 */
export async function generateWishCardBlob(options: CardGenerationOptions): Promise<Blob> {
  const { 
    category, 
    selectedWish, 
    senderName, 
    userPhotoUrl, 
    customMessage,
    birthdayPersonName,
    birthdayPersonPhotoUrl,
    background,
    customBackgroundUrl,
    font
  } = options;

  const chosenFontFamily = font?.canvasFontFamily || '"Noto Sans Devanagari", "Rozha One", sans-serif';

  const isBirthday = category.slug.includes('birthday') || !!birthdayPersonName;
  const activePhotoUrl = birthdayPersonPhotoUrl || userPhotoUrl;

  const width = 1080;
  const height = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context is not available');
  }

  // 1. Render Background (Image, Gradient or Default Festive Theme)
  const bgImageUrl = customBackgroundUrl || (background?.type === 'image' ? background.url : null);
  let bgRendered = false;

  if (bgImageUrl) {
    try {
      const bgImg = await loadImage(bgImageUrl);
      if (bgImg) {
        drawImageCover(ctx, bgImg, width, height);

        // Apply professional cinematic dark & vignette overlay for 100% text readability
        const overlay = ctx.createLinearGradient(0, 0, 0, height);
        const style = background?.overlayStyle || 'dark';

        if (style === 'amber') {
          overlay.addColorStop(0, 'rgba(28, 12, 2, 0.78)');
          overlay.addColorStop(0.35, 'rgba(15, 6, 2, 0.65)');
          overlay.addColorStop(0.7, 'rgba(10, 4, 1, 0.82)');
          overlay.addColorStop(1, 'rgba(5, 2, 0, 0.94)');
        } else if (style === 'royal') {
          overlay.addColorStop(0, 'rgba(26, 5, 21, 0.82)');
          overlay.addColorStop(0.4, 'rgba(20, 4, 16, 0.68)');
          overlay.addColorStop(0.75, 'rgba(15, 3, 12, 0.86)');
          overlay.addColorStop(1, 'rgba(8, 1, 6, 0.96)');
        } else if (style === 'mystic') {
          overlay.addColorStop(0, 'rgba(3, 10, 23, 0.82)');
          overlay.addColorStop(0.4, 'rgba(6, 16, 36, 0.68)');
          overlay.addColorStop(0.75, 'rgba(2, 7, 18, 0.88)');
          overlay.addColorStop(1, 'rgba(1, 4, 10, 0.96)');
        } else {
          // Standard dark cinematic overlay
          overlay.addColorStop(0, 'rgba(12, 10, 9, 0.82)');
          overlay.addColorStop(0.35, 'rgba(12, 10, 9, 0.65)');
          overlay.addColorStop(0.7, 'rgba(12, 10, 9, 0.85)');
          overlay.addColorStop(1, 'rgba(8, 7, 6, 0.95)');
        }

        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, width, height);
        bgRendered = true;
      }
    } catch (e) {
      console.warn('Could not load custom background image, falling back to gradient', e);
    }
  }

  if (!bgRendered) {
    // Render Gradient (custom gradient or default category linear gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (background?.type === 'gradient' && background.cssGradient) {
      if (background.id.includes('ruby')) {
        bgGrad.addColorStop(0, '#1f0309');
        bgGrad.addColorStop(0.45, '#4a0614');
        bgGrad.addColorStop(0.7, '#7a0c20');
        bgGrad.addColorStop(1, '#1f0309');
      } else if (background.id.includes('emerald')) {
        bgGrad.addColorStop(0, '#02140d');
        bgGrad.addColorStop(0.4, '#063321');
        bgGrad.addColorStop(0.75, '#0c4d32');
        bgGrad.addColorStop(1, '#02140d');
      } else if (background.id.includes('sapphire') || background.id.includes('midnight')) {
        bgGrad.addColorStop(0, '#030a17');
        bgGrad.addColorStop(0.45, '#091a38');
        bgGrad.addColorStop(0.75, '#13336e');
        bgGrad.addColorStop(1, '#030a17');
      } else if (background.id.includes('amethyst')) {
        bgGrad.addColorStop(0, '#170424');
        bgGrad.addColorStop(0.45, '#350b52');
        bgGrad.addColorStop(0.75, '#591687');
        bgGrad.addColorStop(1, '#170424');
      } else {
        bgGrad.addColorStop(0, '#0a0a0a');
        bgGrad.addColorStop(0.4, '#1f1404');
        bgGrad.addColorStop(0.7, '#3d2600');
        bgGrad.addColorStop(1, '#0d0800');
      }
    } else if (category.slug.includes('diwali')) {
      bgGrad.addColorStop(0, '#1c0c02');
      bgGrad.addColorStop(0.3, '#3d1600');
      bgGrad.addColorStop(0.7, '#240801');
      bgGrad.addColorStop(1, '#0f0502');
    } else if (category.slug.includes('birthday')) {
      bgGrad.addColorStop(0, '#1a0515');
      bgGrad.addColorStop(0.35, '#3b0d2d');
      bgGrad.addColorStop(0.7, '#23071b');
      bgGrad.addColorStop(1, '#0f030d');
    } else if (category.slug.includes('holi')) {
      bgGrad.addColorStop(0, '#1b052e');
      bgGrad.addColorStop(0.35, '#2c0847');
      bgGrad.addColorStop(0.7, '#1b0333');
      bgGrad.addColorStop(1, '#090112');
    } else if (category.slug.includes('morning')) {
      bgGrad.addColorStop(0, '#021815');
      bgGrad.addColorStop(0.4, '#063028');
      bgGrad.addColorStop(0.75, '#031c17');
      bgGrad.addColorStop(1, '#010c0a');
    } else {
      bgGrad.addColorStop(0, '#0c0a09');
      bgGrad.addColorStop(0.5, '#1c1917');
      bgGrad.addColorStop(1, '#0c0a09');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Decorative Golden Outer Borders & Ornate Corners
  ctx.save();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // Ornate Corner Accents
  const corners = [
    [40, 40],
    [width - 40, 40],
    [40, height - 40],
    [width - 40, height - 40]
  ];
  ctx.fillStyle = '#fbbf24';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 3. Category Emoji / Header Badge
  ctx.save();
  ctx.font = '80px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isBirthday ? '🎂' : (category.theme.accentEmoji || '✨'), width / 2, 190);

  // Category Title or Personalized Birthday Greeting (Auto-scales to prevent overflowing)
  ctx.fillStyle = '#fbbf24';
  const rawTitle = (isBirthday && birthdayPersonName?.trim()) 
    ? `Happy Birthday ${birthdayPersonName.trim()}! 🎉` 
    : category.nameHi;

  let titleFontSize = 52;
  ctx.font = `bold ${titleFontSize}px ${chosenFontFamily}`;
  while (ctx.measureText(rawTitle).width > width - 160 && titleFontSize > 28) {
    titleFontSize -= 2;
    ctx.font = `bold ${titleFontSize}px ${chosenFontFamily}`;
  }

  ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
  ctx.shadowBlur = 22;
  ctx.fillText(rawTitle, width / 2, 270);
  ctx.restore();

  // 4. Birthday Person's Photo or User Photo (Optional Circular Frame)
  let currentY = 340;
  if (activePhotoUrl) {
    try {
      const img = await loadImage(activePhotoUrl);
      if (img) {
        const photoSize = 340;
        const photoX = width / 2 - photoSize / 2;
        const photoY = currentY;

        ctx.save();
        // Outer Glow Ring
        ctx.beginPath();
        ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2 + 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 25;
        ctx.fill();

        // Clip circle for user image
        ctx.beginPath();
        ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        ctx.restore();

        currentY += photoSize + 80;
      } else {
        currentY += 50;
      }
    } catch {
      currentY += 50;
    }
  } else {
    currentY += 60;
  }

  // 5. Main Hindi Wish / Poetry Box with Ambient Frosted Panel (Auto-scaling height & prominent text)
  const wishText = customMessage?.trim() || selectedWish.hindiText;
  ctx.save();
  const boxX = 70;
  const boxWidth = width - 140;
  const boxY = currentY;
  const boxPadding = 40;
  const maxAvailableBoxHeight = (height - 320) - currentY; // Space before sender plate

  let textFontSize = 68;
  let lineHeight = 100;
  ctx.font = `600 ${textFontSize}px ${chosenFontFamily}`;
  let lines = wrapText(ctx, wishText, boxWidth - boxPadding * 2);

  // Auto-scale font down if lines exceed available height
  while ((lines.length * lineHeight + boxPadding * 2 > maxAvailableBoxHeight || lines.some(l => ctx.measureText(l).width > boxWidth - boxPadding * 2)) && textFontSize > 32) {
    textFontSize -= 2;
    lineHeight = Math.round(textFontSize * 1.48);
    ctx.font = `600 ${textFontSize}px ${chosenFontFamily}`;
    lines = wrapText(ctx, wishText, boxWidth - boxPadding * 2);
  }

  // Cap lines to prevent overflow if message is extremely long
  const maxPossibleLines = Math.floor((maxAvailableBoxHeight - boxPadding * 2) / lineHeight);
  if (lines.length > maxPossibleLines) {
    lines = lines.slice(0, Math.max(1, maxPossibleLines));
  }

  const totalTextHeight = lines.length * lineHeight;
  const boxHeight = Math.min(totalTextHeight + boxPadding * 2, maxAvailableBoxHeight);

  // Background panel for text
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 30;

  // Rounded rectangle
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 30);
  ctx.fill();
  ctx.stroke();

  // Quotation mark icon
  ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.font = 'bold 90px serif';
  ctx.fillText('“', boxX + 30, boxY + 70);

  // Render text lines safely clipped to the inside of the box
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, boxX + 6, boxY + 6, boxWidth - 12, boxHeight - 12, 24);
  ctx.clip();

  // Rich radiant gradient for status wish text
  const wishGrad = ctx.createLinearGradient(0, boxY + 20, 0, boxY + boxHeight - 20);
  wishGrad.addColorStop(0, '#ffffff');
  wishGrad.addColorStop(0.5, '#fffbeb');
  wishGrad.addColorStop(1, '#fde68a');

  ctx.fillStyle = wishGrad;
  ctx.font = `600 ${textFontSize}px ${chosenFontFamily}`;
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 14;

  const startLineY = boxY + (boxHeight - (lines.length - 1) * lineHeight) / 2 + 8;
  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, startLineY + idx * lineHeight);
  });
  ctx.restore();
  ctx.restore();

  // 6. Sender Attribution ("स्नेहिल प्रेषक: [नाम]")
  const displaySender = senderName?.trim() || 'आपका शुभचिंतक';
  const senderY = height - 320;

  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 36px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ स्नेहिल प्रेषक ✨', width / 2, senderY);

  ctx.fillStyle = '#ffffff';
  ctx.font = `extrabold 52px ${chosenFontFamily}`;
  ctx.shadowColor = 'rgba(245, 158, 11, 0.85)';
  ctx.shadowBlur = 20;
  ctx.fillText(displaySender, width / 2, senderY + 65);
  ctx.restore();

  // 7. Footer Branding & Shubhakamna Portal Tag
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(180, height - 190);
  ctx.lineTo(width - 180, height - 190);
  ctx.stroke();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText('🪔 Shubhakamna.in · भारत का पावन शुभकामना द्वार', width / 2, height - 130);
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create card image blob'));
    }, 'image/png');
  });
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let renderW, renderH, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    renderH = h;
    renderW = h * imgRatio;
    offsetX = (w - renderW) / 2;
    offsetY = 0;
  } else {
    renderW = w;
    renderH = w / imgRatio;
    offsetX = 0;
    offsetY = (h - renderH) / 2;
  }
  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const directSrc = resolveDirectImageUrl(src);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Retry once with direct source
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = () => resolve(null);
      img2.src = directSrc;
    };
    img.src = directSrc;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];
  const rawParagraphs = text.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // If a single word itself exceeds maxWidth, split character-by-character
      if (ctx.measureText(word).width > maxWidth) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }
        let chunk = '';
        for (const char of word) {
          if (ctx.measureText(chunk + char).width > maxWidth) {
            lines.push(chunk);
            chunk = char;
          } else {
            chunk += char;
          }
        }
        if (chunk) {
          currentLine = chunk;
        }
        continue;
      }

      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
