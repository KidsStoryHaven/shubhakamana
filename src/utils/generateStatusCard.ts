import { Festival } from '../data/festivals';
import { CardBackground } from '../data/cardBackgroundsData';
import { WishFontOption } from '../data/wishFontsData';
import { resolveDirectImageUrl } from './googleDriveHelper';

export interface StatusCardOptions {
  festival: Festival;
  senderName: string;
  userPhoto: string | null;
  birthdayPerson?: string;
  birthdayPhoto?: string | null;
  poem: string;
  greetingTitle: string;
  heroImageOverride?: string;
  background?: CardBackground;
  customBackgroundUrl?: string | null;
  font?: WishFontOption;
}

/**
 * Helper to load an image safely with crossOrigin
 */
function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Safely splits and wraps text by both newlines (\n) and words,
 * breaking overly long words if necessary, ensuring no text overflows maxWidth.
 */
function wrapTextToLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];
  const rawParagraphs = text.split(/\r?\n/);
  const allLines: string[] = [];

  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // If a single word itself exceeds maxWidth, split it character-by-character
      if (ctx.measureText(word).width > maxWidth) {
        if (currentLine) {
          allLines.push(currentLine);
          currentLine = '';
        }
        let chunk = '';
        for (const char of word) {
          if (ctx.measureText(chunk + char).width > maxWidth) {
            allLines.push(chunk);
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
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        allLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      allLines.push(currentLine);
    }
  }
  return allLines;
}

/**
 * Draws image to fill/cover the canvas dimensions
 */
function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) {
  const imgRatio = img.width / img.height;
  const canvasRatio = width / height;
  let renderWidth = width;
  let renderHeight = height;
  let x = 0;
  let y = 0;

  if (imgRatio > canvasRatio) {
    renderWidth = height * imgRatio;
    x = (width - renderWidth) / 2;
  } else {
    renderHeight = width / imgRatio;
    y = (height - renderHeight) / 2;
  }

  ctx.drawImage(img, x, y, renderWidth, renderHeight);
}

/**
 * Generates an Ultra-HD (2160 x 3840, 4K/8K resolution) vertical status card.
 */
// Helper to draw ultra-crisp, crystal-clear 3D Golden Website Text with 100% legibility
function draw3DGoldExtrudedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string = '"Arial Black", "Poppins", "Inter", system-ui, sans-serif',
  maxW: number = 1800
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let size = fontSize;
  ctx.font = `900 ${size}px ${fontFamily}`;
  while (ctx.measureText(text).width > maxW && size > 36) {
    size -= 2;
    ctx.font = `900 ${size}px ${fontFamily}`;
  }

  // 1. Deep 3D Drop Cast Shadow (Bottom-right)
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#000000';
  ctx.fillText(text, x, y + 8);
  ctx.restore();

  // 2. Extrusion Slices for real 3D Depth
  for (let d = 6; d >= 1; d--) {
    ctx.fillStyle = d > 3 ? '#451a03' : '#78350f';
    ctx.fillText(text, x, y + d);
  }

  // 3. Crisp High-Contrast Dark Outline for Separation
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1c1917';
  ctx.strokeText(text, x, y);
  ctx.restore();

  // 4. Ultra-Bright Shining Gold Metallic Face (100% High-Contrast & Legible)
  const faceGrad = ctx.createLinearGradient(x, y - size * 0.45, x, y + size * 0.45);
  faceGrad.addColorStop(0, '#ffffff');
  faceGrad.addColorStop(0.2, '#fffbeb');
  faceGrad.addColorStop(0.5, '#fef08a');
  faceGrad.addColorStop(0.85, '#f59e0b');
  faceGrad.addColorStop(1, '#d97706');

  ctx.fillStyle = faceGrad;
  ctx.fillText(text, x, y);

  // 5. Crisp Gold Bevel Stroke
  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#fef08a';
  ctx.strokeText(text, x, y);
  ctx.restore();

  ctx.restore();
}

export async function generateStatusCardBlob(options: StatusCardOptions): Promise<Blob> {
  const { 
    festival, 
    senderName, 
    userPhoto, 
    birthdayPerson, 
    birthdayPhoto, 
    poem, 
    greetingTitle, 
    heroImageOverride,
    background,
    customBackgroundUrl,
    font
  } = options;
  const isBirthday = festival.id === 'birthday' || festival.soundType === 'birthday' || !!birthdayPerson;
  const effectivePhoto = birthdayPhoto || userPhoto;

  const width = 2160;
  const height = 3840; // 9:16 vertical 4K UHD

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const chosenFontFamily = font?.canvasFontFamily || '"Rozha One", "Noto Sans Devanagari", serif';

  // 1. Background (Image, Gradient or Default Festive Theme)
  const bgImageUrl = customBackgroundUrl || (background?.type === 'image' ? background.url : null);
  let bgRendered = false;

  if (bgImageUrl) {
    try {
      const bgImg = await loadImageSafe(bgImageUrl);
      if (bgImg) {
        drawImageCover(ctx, bgImg, width, height);

        // Apply cinematic overlay for great text contrast
        const overlay = ctx.createLinearGradient(0, 0, 0, height);
        const style = background?.overlayStyle || 'dark';

        if (style === 'amber') {
          overlay.addColorStop(0, 'rgba(28, 12, 2, 0.82)');
          overlay.addColorStop(0.35, 'rgba(15, 6, 2, 0.70)');
          overlay.addColorStop(0.7, 'rgba(10, 4, 1, 0.86)');
          overlay.addColorStop(1, 'rgba(5, 2, 0, 0.95)');
        } else if (style === 'royal') {
          overlay.addColorStop(0, 'rgba(26, 5, 21, 0.84)');
          overlay.addColorStop(0.4, 'rgba(20, 4, 16, 0.72)');
          overlay.addColorStop(0.75, 'rgba(15, 3, 12, 0.88)');
          overlay.addColorStop(1, 'rgba(8, 1, 6, 0.96)');
        } else if (style === 'mystic') {
          overlay.addColorStop(0, 'rgba(3, 10, 23, 0.84)');
          overlay.addColorStop(0.4, 'rgba(6, 16, 36, 0.72)');
          overlay.addColorStop(0.75, 'rgba(2, 7, 18, 0.90)');
          overlay.addColorStop(1, 'rgba(1, 4, 10, 0.96)');
        } else {
          overlay.addColorStop(0, 'rgba(12, 10, 9, 0.84)');
          overlay.addColorStop(0.35, 'rgba(12, 10, 9, 0.70)');
          overlay.addColorStop(0.7, 'rgba(12, 10, 9, 0.88)');
          overlay.addColorStop(1, 'rgba(8, 7, 6, 0.96)');
        }

        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, width, height);
        bgRendered = true;
      }
    } catch {}
  }

  if (!bgRendered) {
    // Festive Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 3840);
    bgGrad.addColorStop(0, '#1c1917');
    bgGrad.addColorStop(0.25, '#292524');
    bgGrad.addColorStop(0.5, '#1c1917');
    bgGrad.addColorStop(0.85, '#0c0a09');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2160, 3840);
  }

  // Radial golden aura in the center
  const auraGrad = ctx.createRadialGradient(1080, 1500, 100, 1080, 1500, 1400);
  auraGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
  auraGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.06)');
  auraGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = auraGrad;
  ctx.fillRect(0, 0, 2160, 3840);

  // 2. Festive Sparkles & Stardust
  ctx.fillStyle = '#fef08a';
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 2160;
    const y = Math.random() * 3840;
    const r = Math.random() * 4 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Ornate Double Golden Borders
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 26;
  ctx.strokeRect(60, 60, 2040, 3720);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 8;
  ctx.strokeRect(100, 100, 1960, 3640);

  // Ornate Corner Accents
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(40, 40, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(100, 100, 0);
  drawCorner(2060, 100, Math.PI / 2);
  drawCorner(2060, 3740, Math.PI);
  drawCorner(100, 3740, -Math.PI / 2);

  // 4. Header Branding
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    isBirthday && birthdayPerson
      ? `👑 HAPPY BIRTHDAY ${birthdayPerson.toUpperCase()} • 8K STATUS 👑`
      : '✨ SHUBHAKAMNA.IN • पावन शुभकामना ✨',
    1080,
    240
  );

  // 5. Festival Title & Tagline (Auto-scale so it NEVER goes outside the image)
  const rawTitle = isBirthday && birthdayPerson
    ? `🎉 Happy Birthday ${birthdayPerson}! 🎉`
    : (greetingTitle || festival.nameHi);

  let titleFontSize = 104;
  ctx.font = `bold ${titleFontSize}px ${chosenFontFamily}`;
  while (ctx.measureText(rawTitle).width > 1820 && titleFontSize > 44) {
    titleFontSize -= 4;
    ctx.font = `bold ${titleFontSize}px ${chosenFontFamily}`;
  }

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(rawTitle, 1080, 400);

  const rawTagline = isBirthday && birthdayPerson
    ? 'ईश्वर आपको दीर्घायु, उत्तम स्वास्थ्य और अपार खुशियाँ प्रदान करें'
    : (festival.taglineHi || 'पावन ईश्वरीय दर्शन व मंगलकामनाएं');

  let tagFontSize = 75;
  ctx.font = `${tagFontSize}px ${chosenFontFamily}`;
  while (ctx.measureText(rawTagline).width > 1820 && tagFontSize > 36) {
    tagFontSize -= 2;
    ctx.font = `${tagFontSize}px ${chosenFontFamily}`;
  }

  ctx.fillStyle = '#fde68a';
  ctx.fillText(rawTagline, 1080, 500);

  // 6. Draw Festival Hero Image
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Rounded image box
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(200, 590, 1760, 1150, 50);
      ctx.clip();
      ctx.drawImage(img, 200, 590, 1760, 1150);
      ctx.restore();

      // Golden frame around image
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.roundRect(200, 590, 1760, 1150, 50);
      ctx.stroke();

      resolve();
    };
    img.onerror = () => resolve(); // Proceed even if image fails
    img.src = resolveDirectImageUrl(heroImageOverride || festival.heroImage);
  });

  // 7. Blessing / Poetic Wish Box (Full Height Space Utilization - Large, Vibrant & Prominent)
  const boxX = 160;
  const boxW = 1840;
  const boxY = 1780;
  // Calculate maximum available box height so no empty awkward space is left at the bottom
  const maxPoemBoxH = effectivePhoto ? 920 : 1280;
  const maxTextW = boxW - 140; // 1700px usable text width

  const fullPoemText = poem || festival.defaultPoem || '';
  // 1.5x Boosted prominent font size for 2160x3840 4K status cards
  let poemFontSize = effectivePhoto ? 92 : 110;
  let poemLineHeight = Math.round(poemFontSize * 1.50);

  ctx.font = `bold italic ${poemFontSize}px ${chosenFontFamily}`;
  let poemLines = wrapTextToLines(ctx, fullPoemText, maxTextW);

  // Auto-scale font down until all lines comfortably fit within the box
  while ((poemLines.length * poemLineHeight + 140 > maxPoemBoxH || poemLines.some(l => ctx.measureText(l).width > maxTextW)) && poemFontSize > 48) {
    poemFontSize -= 2;
    poemLineHeight = Math.round(poemFontSize * 1.48);
    ctx.font = `bold italic ${poemFontSize}px ${chosenFontFamily}`;
    poemLines = wrapTextToLines(ctx, fullPoemText, maxTextW);
  }

  // If still more lines than box capacity, cap safely
  const maxPossibleLines = Math.floor((maxPoemBoxH - 120) / poemLineHeight);
  if (poemLines.length > maxPossibleLines) {
    poemLines = poemLines.slice(0, maxPossibleLines);
  }

  // Actual box height based on actual lines (utilizing available height generously)
  const calculatedH = poemLines.length * poemLineHeight + 140;
  const actualBoxH = Math.min(maxPoemBoxH, Math.max(calculatedH, effectivePhoto ? 480 : 640));

  // Rich Dark Translucent Wish Container with Golden Gradient Glow
  ctx.save();
  const wishBoxGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + actualBoxH);
  wishBoxGrad.addColorStop(0, 'rgba(18, 12, 8, 0.94)');
  wishBoxGrad.addColorStop(0.5, 'rgba(38, 20, 10, 0.94)');
  wishBoxGrad.addColorStop(1, 'rgba(18, 12, 8, 0.94)');

  ctx.fillStyle = wishBoxGrad;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, actualBoxH, 44);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 7;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX + 16, boxY + 16, boxW - 32, actualBoxH - 32);

  // Ornamental Quotation Marks
  ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.font = 'bold 120px serif';
  ctx.textAlign = 'left';
  ctx.fillText('“', boxX + 36, boxY + 110);
  ctx.textAlign = 'right';
  ctx.fillText('”', boxX + boxW - 36, boxY + actualBoxH - 30);

  // Draw Poem Text inside clipped area so it NEVER goes outside the box
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(boxX + 24, boxY + 24, boxW - 48, actualBoxH - 48, 36);
  ctx.clip();

  // Vibrant Golden-Cream Gradient for the Message
  const textGrad = ctx.createLinearGradient(0, boxY + 40, 0, boxY + actualBoxH - 40);
  textGrad.addColorStop(0, '#ffffff');
  textGrad.addColorStop(0.4, '#fffbeb');
  textGrad.addColorStop(1, '#fde68a');

  ctx.fillStyle = textGrad;
  ctx.font = `bold italic ${poemFontSize}px ${chosenFontFamily}`;
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 18;

  const totalTextBlockH = (poemLines.length - 1) * poemLineHeight;
  const startTextY = boxY + (actualBoxH - totalTextBlockH) / 2 + 10;

  poemLines.forEach((l, idx) => {
    ctx.fillText(l, 1080, startTextY + idx * poemLineHeight);
  });
  ctx.restore();
  ctx.restore();

  // 8. Photo (Celebrant Photo or User Photo) - Dynamically placed below Poetic Box
  const photoCenterY = boxY + actualBoxH + 240;

  if (effectivePhoto) {
    await new Promise<void>((resolve) => {
      const userImg = new Image();
      userImg.onload = () => {
        // Draw circular photo
        ctx.save();
        ctx.beginPath();
        ctx.arc(1080, photoCenterY, 200, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImg, 880, photoCenterY - 200, 400, 400);
        ctx.restore();

        // Dual golden outer ring
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(1080, photoCenterY, 200, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(1080, photoCenterY, 218, 0, Math.PI * 2);
        ctx.stroke();

        // If birthday celebrant, draw crown
        if (isBirthday) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '72px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('👑', 1080, photoCenterY - 215);
        }

        resolve();
      };
      userImg.onerror = () => resolve();
      userImg.src = effectivePhoto;
    });
  }

  // 9. Sender Royal Plate (Utilizing bottom area harmoniously - ZERO empty void)
  const plateY = effectivePhoto ? photoCenterY + 270 : Math.max(boxY + actualBoxH + 110, 2750);
  const plateW = 1840;
  const plateH = 340;
  const plateX = 160;

  ctx.save();
  const plateGrad = ctx.createLinearGradient(plateX, plateY, plateX + plateW, plateY + plateH);
  plateGrad.addColorStop(0, 'rgba(30, 16, 8, 0.96)');
  plateGrad.addColorStop(0.5, 'rgba(60, 26, 10, 0.96)');
  plateGrad.addColorStop(1, 'rgba(30, 16, 8, 0.96)');

  ctx.fillStyle = plateGrad;
  ctx.beginPath();
  ctx.roundRect(plateX, plateY, plateW, plateH, 36);
  ctx.fill();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    isBirthday && birthdayPerson
      ? `🎂 ${birthdayPerson} को जन्मदिन की हार्दिक बधाई • प्रेषक 🎂`
      : '✨ 👑 सप्रेम एवं आदर सहित प्रेषित 👑 ✨',
    1080,
    plateY + 70
  );

  // Big Sender Name in Shining Gold 3D style
  let senderFontSize = 104;
  const rawSender = senderName || 'आपका शुभचिंतक';
  ctx.font = `bold ${senderFontSize}px ${chosenFontFamily}`;
  while (ctx.measureText(rawSender).width > plateW - 120 && senderFontSize > 44) {
    senderFontSize -= 4;
    ctx.font = `bold ${senderFontSize}px ${chosenFontFamily}`;
  }

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
  ctx.shadowBlur = 24;
  ctx.fillText(rawSender, 1080, plateY + 185);

  ctx.fillStyle = '#fde68a';
  ctx.font = '46px sans-serif';
  ctx.shadowBlur = 0;
  ctx.fillText(
    isBirthday && birthdayPerson
      ? 'की ओर से आपको जन्मदिन की अनंत शुभकामनाएँ व मंगल आशीष'
      : 'की ओर से आपको एवं आपके परिवार को हार्दिक शुभकामनाएँ',
    1080,
    plateY + 275
  );
  ctx.restore();

  // 10. 🌐 MASSIVE 3D EMBOSSED ROYAL WEBSITE CTA PLATE (High-Impact 3D Pop)
  ctx.save();
  const ctaPillW = 1940;
  const ctaPillH = 220;
  const ctaPillX = 110;
  const ctaPillY = 3470;

  // Deep Multi-layer 3D Extruded Drop Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 16;

  // 3D Metallic Dark Onyx & Gold Gradient Fill
  const ctaGrad = ctx.createLinearGradient(ctaPillX, ctaPillY, ctaPillX, ctaPillY + ctaPillH);
  ctaGrad.addColorStop(0, '#292524');
  ctaGrad.addColorStop(0.25, '#1c1917');
  ctaGrad.addColorStop(0.65, '#0c0a09');
  ctaGrad.addColorStop(1, '#000000');
  ctx.fillStyle = ctaGrad;
  ctx.beginPath();
  ctx.roundRect(ctaPillX, ctaPillY, ctaPillW, ctaPillH, 44);
  ctx.fill();

  // Outer Golden Glow Border
  ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Inner Golden Glow Bevel Ring
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(ctaPillX + 8, ctaPillY + 8, ctaPillW - 16, ctaPillH - 16, 38);
  ctx.stroke();

  // Top Line: Action Invitation Badge (Hindi Callout)
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 44px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('✨ 👉 अपने नाम व फोटो का 4K स्टेटस यहाँ बनाएँ ➔ मुफ़्त 👈 ✨', 1080, ctaPillY + 68);

  // Bottom Centerpiece: BIG 3D POP-OUT WEBSITE DOMAIN (BADA & 3D LOOK)
  draw3DGoldExtrudedText(
    ctx,
    '🌐 WWW.SHUBHAKAMNA.IN 🌐',
    1080,
    ctaPillY + 152,
    78,
    '"Poppins", "Inter", system-ui, sans-serif',
    ctaPillW - 80
  );

  ctx.restore();

  // 11. Export as High-Quality JPEG Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas export failed'));
        }
      },
      'image/jpeg',
      0.96
    );
  });
}
