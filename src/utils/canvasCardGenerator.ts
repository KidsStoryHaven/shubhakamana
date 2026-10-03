import { WishCategory, HindiWish } from '../data/wishesData';

export interface CardGenerationOptions {
  category: WishCategory;
  selectedWish: HindiWish;
  senderName: string;
  userPhotoUrl?: string | null;
  customMessage?: string;
  birthdayPersonName?: string;
  birthdayPersonPhotoUrl?: string | null;
}

/**
 * Renders a 1080x1920 (9:16) ultra HD mobile wishing card onto an offscreen canvas
 * and returns it as a PNG blob.
 */
export async function generateWishCardBlob(options: CardGenerationOptions): Promise<Blob> {
  const { 
    category, 
    selectedWish, 
    senderName, 
    userPhotoUrl, 
    customMessage,
    birthdayPersonName,
    birthdayPersonPhotoUrl
  } = options;

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

  // 1. Festive Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (category.slug.includes('diwali')) {
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

  // 2. Decorative Golden / Festive Outer Borders
  ctx.save();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // Corner Accents
  const cornerSize = 70;
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

  // Category Title or Personalized Birthday Greeting
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 52px "Noto Sans Devanagari", "Rozha One", sans-serif';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
  ctx.shadowBlur = 20;

  if (isBirthday && birthdayPersonName?.trim()) {
    ctx.fillText(`Happy Birthday ${birthdayPersonName.trim()}! 🎉`, width / 2, 270);
  } else {
    ctx.fillText(category.nameHi, width / 2, 270);
  }
  ctx.restore();

  // 4. Birthday Person's Photo or User Photo (Optional Circular Frame)
  let currentY = 340;
  if (activePhotoUrl) {
    try {
      const img = await loadImage(activePhotoUrl);
      const photoSize = 340;
      const photoX = width / 2 - photoSize / 2;
      const photoY = currentY;

      ctx.save();
      // Outer Glow Ring
      ctx.beginPath();
      ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2 + 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
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
    } catch {
      // If photo failed to load, proceed without it
      currentY += 40;
    }
  } else {
    currentY += 60;
  }

  // 5. Main Hindi Wish / Poetry Box
  const wishText = customMessage?.trim() || selectedWish.hindiText;
  ctx.save();
  const boxX = 90;
  const boxWidth = width - 180;
  const boxY = currentY;
  const boxPadding = 50;

  // Background panel for text
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 3;
  
  // Measure multi-line text
  ctx.font = '500 42px "Noto Sans Devanagari", sans-serif';
  const lines = wrapText(ctx, wishText, boxWidth - boxPadding * 2);
  const lineHeight = 66;
  const totalTextHeight = lines.length * lineHeight;
  const boxHeight = totalTextHeight + boxPadding * 2;

  // Rounded rectangle
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.fill();
  ctx.stroke();

  // Quotation mark icon
  ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.font = 'bold 90px serif';
  ctx.fillText('“', boxX + 30, boxY + 70);

  // Render text lines
  ctx.fillStyle = '#f8fafc';
  ctx.font = '500 40px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';

  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, boxY + boxPadding + 44 + idx * lineHeight);
  });
  ctx.restore();

  // 6. Sender Attribution ("प्रेषक: [नाम]")
  const displaySender = senderName?.trim() || 'आपका शुभचिंतक';
  const senderY = height - 320;

  ctx.save();
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 36px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ स्नेहिल प्रेषक ✨', width / 2, senderY);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'extrabold 52px "Noto Sans Devanagari", sans-serif';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
  ctx.shadowBlur = 18;
  ctx.fillText(displaySender, width / 2, senderY + 65);
  ctx.restore();

  // 7. Footer Branding & Shubhakamna Portal Tag
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(180, height - 190);
  ctx.lineTo(width - 180, height - 190);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🪔 Shubhakamna.in · भारत का पावन शुभकामना द्वार', width / 2, height - 130);
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create card image blob'));
    }, 'image/png');
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = e => reject(e);
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
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
