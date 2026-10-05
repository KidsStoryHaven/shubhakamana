/**
 * High-Definition (1080p) Suvichar Card Image Generator
 * Renders large, crystal-clear text, custom background photo, a VERY LARGE prominent user photo,
 * and page short link without any bottom cut-off.
 */

import { SuvicharItem, SuvicharBackground, getDayAndTimeFormatted } from '../data/dailySuvicharData';
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
}

function loadImg(src: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const directSrc = resolveDirectImageUrl(src);
    const fallbacks = getGoogleDriveFallbackUrls(src);
    let fallbackIdx = 0;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const tryNext = () => {
      if (fallbackIdx < fallbacks.length) {
        img.src = fallbacks[fallbackIdx++];
      } else {
        resolve(null);
      }
    };

    img.onload = () => resolve(img);
    img.onerror = () => tryNext();
    img.src = directSrc;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
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

export async function generateSuvicharCardBlob(options: SuvicharCardOptions): Promise<{ blob: Blob; fileName: string }> {
  const { suvichar, background, customBackgroundUrl, senderName, senderPhoto, aspectRatio, language, showDayAndTime = true } = options;

  const isStory = aspectRatio === 'story';
  const width = 1080;
  const height = isStory ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');

  // Load background image & user photo in parallel
  const bgToLoad = customBackgroundUrl || (background.type === 'image' ? background.url : '');
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
  } else {
    // Rich morning radiant gradient fallback
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#451a03'); // Deep amber
    grad.addColorStop(0.4, '#78350f'); // Golden warm
    grad.addColorStop(0.8, '#1e1b4b'); // Deep celestial indigo
    grad.addColorStop(1, '#0c0a09'); // Midnight base
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Dark Frosted Vignette for 100% Contrast & Legibility
  const darkVignette = ctx.createLinearGradient(0, 0, 0, height);
  darkVignette.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
  darkVignette.addColorStop(0.4, 'rgba(0, 0, 0, 0.68)');
  darkVignette.addColorStop(0.8, 'rgba(0, 0, 0, 0.85)');
  darkVignette.addColorStop(1, 'rgba(0, 0, 0, 0.96)');
  ctx.fillStyle = darkVignette;
  ctx.fillRect(0, 0, width, height);

  // 3. Decorative Ornate Golden Border Rails
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Corner ornaments
  ctx.fillStyle = '#fbbf24';
  ctx.font = '22px sans-serif';
  ctx.fillText('❖', 36, 52);
  ctx.fillText('❖', width - 58, 52);
  ctx.fillText('❖', 36, height - 38);
  ctx.fillText('❖', width - 58, height - 38);

  // 4. Header: Shubh Prabhat Branding Capsule
  const headerY = isStory ? 54 : 36;
  ctx.save();
  ctx.textAlign = 'center';

  // Pill Background
  const pillW = isStory ? 480 : 430;
  const pillH = isStory ? 58 : 48;
  const pillX = (width - pillW) / 2;
  ctx.fillStyle = 'rgba(24, 16, 10, 0.94)';
  ctx.beginPath();
  ctx.roundRect(pillX, headerY, pillW, pillH, [28]);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = `bold ${isStory ? 26 : 22}px "Noto Sans Devanagari", sans-serif`;
  ctx.fillText('✨ ॐ सूर्याय नमः • शुभ प्रभात ✨', width / 2, headerY + (isStory ? 38 : 32));

  ctx.fillStyle = '#fef08a';
  ctx.font = `bold ${isStory ? 18 : 15}px "Noto Sans Devanagari", sans-serif`;
  const subY = headerY + (isStory ? 88 : 72);
  ctx.fillText(`दैनिक पावन सुविचार #${suvichar.number} • ${suvichar.categoryLabel}`, width / 2, subY);

  // 🕒 Small Day & Time Capsule Badge on Image (जैसे: 📅 सोमवार • 07:15 AM)
  let headerBottom = subY + 8;
  if (showDayAndTime) {
    const { badgeText: dayTimeStr } = getDayAndTimeFormatted(language);
    const timeBadgeY = subY + 10;

    ctx.font = `bold ${isStory ? 17 : 14}px "Noto Sans Devanagari", sans-serif`;
    const textW = ctx.measureText(`📅 ${dayTimeStr}`).width;
    const dtPillW = Math.max(240, textW + 40);
    const dtPillH = isStory ? 36 : 30;
    const dtPillX = (width - dtPillW) / 2;

    ctx.fillStyle = 'rgba(20, 14, 8, 0.94)';
    ctx.beginPath();
    ctx.roundRect(dtPillX, timeBadgeY, dtPillW, dtPillH, [18]);
    ctx.fill();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.fillText(`📅 ${dayTimeStr}`, width / 2, timeBadgeY + (isStory ? 24 : 20));
    headerBottom = timeBadgeY + dtPillH;
  }
  ctx.restore();

  // 5. 🛡️ BOTTOM SAFE BOUNDARY CALCULATION - ZERO BOTTOM CUT-OFF GUARANTEED!
  // Sub-tagline sits safely inside inner border:
  const subTaglineY = height - (isStory ? 60 : 48);
  // Short Link Badge sits right above sub-tagline:
  const bottomLinkH = isStory ? 44 : 36;
  const bottomLinkY = subTaglineY - bottomLinkH - (isStory ? 14 : 10);
  const senderAreaBottom = bottomLinkY - (isStory ? 18 : 12);

  // 6. 👑 VERY LARGE PROMINENT USER PHOTO & SENDER NAME POSITIONING
  const hasUserPhoto = !!(userImg && userImg.complete && userImg.width > 0);
  // User photo radius: Extra large! (Story: 350px diameter, Square: 270px diameter!)
  const photoR = hasUserPhoto ? (isStory ? 175 : 135) : 0;
  const nCardH = isStory ? 78 : 62;
  const nCardW = isStory ? 640 : 540;
  const nCardX = (width - nCardW) / 2;
  const nameY = senderAreaBottom - nCardH;

  const photoX = width / 2;
  const photoY = hasUserPhoto ? nameY - 18 - photoR : 0;
  const senderAreaTop = hasUserPhoto ? photoY - photoR : nameY;

  // 7. Dynamic Frosted Glass Container for Suvichar Text
  const boxMargin = isStory ? 55 : 50;
  const boxW = width - boxMargin * 2;
  const boxY = headerBottom + (isStory ? 26 : 14);
  const boxH = Math.max(isStory ? 520 : 310, senderAreaTop - 20 - boxY);

  ctx.save();
  // Deep dark frosted backing with subtle warm glow
  ctx.fillStyle = 'rgba(12, 10, 8, 0.93)';
  ctx.beginPath();
  ctx.roundRect(boxMargin, boxY, boxW, boxH, [34]);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3.2;
  ctx.stroke();

  // Corner decorative flourishes inside box
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('🌸', boxMargin + 22, boxY + 40);
  ctx.fillText('🌸', boxMargin + boxW - 46, boxY + 40);
  ctx.fillText('🪔', boxMargin + 22, boxY + boxH - 22);
  ctx.fillText('🪔', boxMargin + boxW - 46, boxY + boxH - 22);

  // Big Watermark Quotes Graphic in Background
  ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
  ctx.font = 'bold 130px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('“', boxMargin + 30, boxY + 115);
  ctx.restore();

  // 8. 🔥 RENDER THE HUGE, BOLD, RAZOR-SHARP SUVICHAR TEXT
  let activeText = suvichar.hindiText;
  if (language === 'english') activeText = suvichar.englishText;
  else if (language === 'marathi' && suvichar.marathiText) activeText = suvichar.marathiText;
  else if (language === 'gujarati' && suvichar.gujaratiText) activeText = suvichar.gujaratiText;

  const textLen = activeText.length;
  let fontSize = isStory ? 48 : (hasUserPhoto ? 34 : 40);
  let lineH = isStory ? 74 : (hasUserPhoto ? 52 : 62);

  if (textLen < 85) {
    fontSize = isStory ? 54 : (hasUserPhoto ? 38 : 46);
    lineH = isStory ? 82 : (hasUserPhoto ? 58 : 70);
  } else if (textLen > 140) {
    fontSize = isStory ? 42 : (hasUserPhoto ? 30 : 34);
    lineH = isStory ? 66 : (hasUserPhoto ? 46 : 52);
  }

  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `bold ${fontSize}px "Noto Serif Devanagari", "Georgia", serif`;

  const textMaxW = boxW - 110;
  const lines = wrapText(ctx, activeText, textMaxW);

  // Center text vertically inside the frosted box
  const totalTextH = lines.length * lineH;
  const startTextY = boxY + (boxH - totalTextH) / 2 + fontSize * 0.75;

  // Razor-sharp Ambient Drop Shadow for readability on any background
  ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  lines.forEach((l, idx) => {
    const curY = startTextY + idx * lineH;
    const textGrad = ctx.createLinearGradient(0, curY - fontSize, 0, curY);
    textGrad.addColorStop(0, '#ffffff');
    textGrad.addColorStop(0.6, '#fffbeb');
    textGrad.addColorStop(1, '#fde68a');

    ctx.fillStyle = textGrad;
    ctx.fillText(l, width / 2, curY);
  });
  ctx.restore();

  // 9. 👑 DRAW VERY LARGE USER PHOTO (Diameter 350px in story, 270px in square!)
  if (hasUserPhoto && userImg) {
    ctx.save();
    // Multi-tier Radiant Golden Halo behind User Photo
    const haloGrad = ctx.createRadialGradient(photoX, photoY, photoR, photoX, photoY, photoR + 36);
    haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
    haloGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.55)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 36, 0, Math.PI * 2);
    ctx.fill();

    // Outer Thick Golden Frame Ring
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 5, 0, Math.PI * 2);
    ctx.fill();

    // Clip & Draw User Photo with crisp aspect-fit cover
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
    ctx.clip();

    const uScale = Math.max((photoR * 2) / userImg.width, (photoR * 2) / userImg.height);
    const uW = userImg.width * uScale;
    const uH = userImg.height * uScale;
    const uX = photoX - uW / 2;
    const uY = photoY - uH / 2;
    ctx.drawImage(userImg, uX, uY, uW, uH);
    ctx.restore();

    // Golden Star Badge in bottom right corner of photo
    ctx.save();
    const badgeX = photoX + photoR * 0.72;
    const badgeY = photoY + photoR * 0.72;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', badgeX, badgeY + 7);
    ctx.restore();

    // Ornate Sender Name Plate directly below the large photo
    ctx.save();
    ctx.textAlign = 'center';

    const nGrad = ctx.createLinearGradient(nCardX, nameY, nCardX + nCardW, nameY + nCardH);
    nGrad.addColorStop(0, 'rgba(30, 16, 8, 0.96)');
    nGrad.addColorStop(0.5, 'rgba(65, 26, 10, 0.98)');
    nGrad.addColorStop(1, 'rgba(30, 16, 8, 0.96)');
    ctx.fillStyle = nGrad;
    ctx.beginPath();
    ctx.roundRect(nCardX, nameY, nCardW, nCardH, [20]);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.8;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = `bold ${isStory ? 17 : 14}px "Noto Sans Devanagari", sans-serif`;
    ctx.fillText('✨ सप्रेम शुभकामना प्रेषक ✨', width / 2, nameY + (isStory ? 26 : 22));

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isStory ? 34 : 26}px "Noto Sans Devanagari", sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(senderName || 'आपका शुभचिंतक', width / 2, nameY + (isStory ? 60 : 49));
    ctx.restore();
  } else {
    // Sender Name Plate (when no user photo uploaded)
    ctx.save();
    ctx.textAlign = 'center';

    const nGrad = ctx.createLinearGradient(nCardX, nameY, nCardX + nCardW, nameY + nCardH);
    nGrad.addColorStop(0, 'rgba(28, 16, 8, 0.95)');
    nGrad.addColorStop(0.5, 'rgba(55, 24, 10, 0.96)');
    nGrad.addColorStop(1, 'rgba(28, 16, 8, 0.95)');
    ctx.fillStyle = nGrad;
    ctx.beginPath();
    ctx.roundRect(nCardX, nameY, nCardW, nCardH, [22]);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.8;
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.font = `bold ${isStory ? 19 : 16}px "Noto Sans Devanagari", sans-serif`;
    ctx.fillText('✨ सप्रेम शुभकामना प्रेषक ✨', width / 2, nameY + (isStory ? 29 : 24));

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isStory ? 36 : 28}px "Noto Sans Devanagari", sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(senderName || 'आपका शुभचिंतक', width / 2, nameY + (isStory ? 66 : 52));
    ctx.restore();
  }

  // 10. 🌐 Official Main Website URL Badge & Safe Tagline at Bottom (ZERO Bottom Cut-off!)
  ctx.save();
  ctx.textAlign = 'center';

  const linkW = isStory ? 400 : 340;
  const linkX = (width - linkW) / 2;

  ctx.fillStyle = 'rgba(20, 14, 8, 0.95)';
  ctx.beginPath();
  ctx.roundRect(linkX, bottomLinkY, linkW, bottomLinkH, [20]);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = `bold ${isStory ? 20 : 17}px sans-serif`;
  ctx.fillText('🌐 shubhakamna.in', width / 2, bottomLinkY + (isStory ? 28 : 23));

  // Sub-tagline safely placed well inside the border rails
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `600 ${isStory ? 16 : 13}px "Noto Sans Devanagari", sans-serif`;
  ctx.fillText('दैनिक १०० शुभ प्रभात सुविचार • मुफ़्त कार्ड', width / 2, subTaglineY);
  ctx.restore();

  // 11. Export to High-Quality Blob
  return new Promise<{ blob: Blob; fileName: string }>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas blob generation failed'));
          return;
        }
        const safeName = (senderName || 'Suvichar').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '-');
        const fileName = `Shubh-Prabhat-Suvichar-${suvichar.number}-${safeName}.jpg`;
        resolve({ blob, fileName });
      },
      'image/jpeg',
      0.96
    );
  });
}
