/**
 * High-Definition (1080p / 4K) Suvichar Card Image Generator
 * Generates BADE BADE (Large, Prominent) text that fills the entire card space.
 * Features 8 Distinct WhatsApp Status Styles with 3D Calligraphy, colorful virtue badges,
 * large user photo, and zero bottom cut-off.
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
  styleId?: string; // 1 to 8 style IDs
  headlineOverride?: string; // e.g. "आयुष्यांत" or "शुभ प्रभात"
  customBadge1?: string;
  customBadge2?: string;
  fontSizeMultiplier?: number; // Default 1.5x font size multiplier
  photoScale?: number; // User custom photo size multiplier (0.8, 1.0, 1.25, 1.5, 1.8)
}

function loadImg(src: string): Promise<HTMLImageElement | null> {
  if (!src || typeof src !== 'string') return Promise.resolve(null);
  const cleanSrc = src.trim();
  if (!cleanSrc) return Promise.resolve(null);

  // If it's a data URL (base64) or blob URL, load directly (no crossOrigin needed)
  if (cleanSrc.startsWith('data:') || cleanSrc.startsWith('blob:')) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        console.warn('Failed to load inline data photo:', e);
        resolve(null);
      };
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
        // Fallback: try direct image without crossOrigin
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

/**
 * Draws 3D Pop / Extruded Devanagari Headline text
 */
function draw3DHeadline(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string,
  theme: SuvicharStyleOption['headlineTheme']
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px ${fontFamily}`;

  // Gradients according to theme
  let faceGrad = ctx.createLinearGradient(x, y - fontSize * 0.45, x, y + fontSize * 0.45);
  let bevelColor = '#b91c1c';
  let outerOutline = '#78350f';

  if (theme === 'gold_red') {
    faceGrad.addColorStop(0, '#fffbeb');
    faceGrad.addColorStop(0.3, '#fde047');
    faceGrad.addColorStop(0.7, '#f59e0b');
    faceGrad.addColorStop(1, '#d97706');
    bevelColor = '#991b1b';
    outerOutline = '#450a0a';
  } else if (theme === 'neon_gold') {
    faceGrad.addColorStop(0, '#ffffff');
    faceGrad.addColorStop(0.3, '#fef08a');
    faceGrad.addColorStop(0.7, '#fbbf24');
    faceGrad.addColorStop(1, '#f59e0b');
    bevelColor = '#78350f';
    outerOutline = '#000000';
  } else if (theme === 'magenta_3d') {
    faceGrad.addColorStop(0, '#ffffff');
    faceGrad.addColorStop(0.3, '#f472b6');
    faceGrad.addColorStop(0.7, '#db2777');
    faceGrad.addColorStop(1, '#9d174d');
    bevelColor = '#4a044e';
    outerOutline = '#2e0854';
  } else if (theme === 'candy_rose') {
    faceGrad.addColorStop(0, '#fff1f2');
    faceGrad.addColorStop(0.3, '#fb7185');
    faceGrad.addColorStop(0.7, '#e11d48');
    faceGrad.addColorStop(1, '#9f1239');
    bevelColor = '#4c0519';
    outerOutline = '#fbbf24';
  } else if (theme === 'sunrise_emboss') {
    faceGrad.addColorStop(0, '#ffffff');
    faceGrad.addColorStop(0.3, '#fed7aa');
    faceGrad.addColorStop(0.7, '#f97316');
    faceGrad.addColorStop(1, '#c2410c');
    bevelColor = '#431407';
    outerOutline = '#000000';
  } else if (theme === 'festive_splash') {
    faceGrad.addColorStop(0, '#fef08a');
    faceGrad.addColorStop(0.4, '#38bdf8');
    faceGrad.addColorStop(0.7, '#f43f5e');
    faceGrad.addColorStop(1, '#8b5cf6');
    bevelColor = '#0f172a';
    outerOutline = '#0369a1';
  } else if (theme === 'emerald_gold') {
    faceGrad.addColorStop(0, '#ecfdf5');
    faceGrad.addColorStop(0.3, '#34d399');
    faceGrad.addColorStop(0.7, '#059669');
    faceGrad.addColorStop(1, '#064e3b');
    bevelColor = '#78350f';
    outerOutline = '#fbbf24';
  } else {
    // cosmic_gold
    faceGrad.addColorStop(0, '#ffffff');
    faceGrad.addColorStop(0.3, '#fef08a');
    faceGrad.addColorStop(0.7, '#fbbf24');
    faceGrad.addColorStop(1, '#d97706');
    bevelColor = '#78350f';
    outerOutline = '#000000';
  }

  // Deep Drop Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.lineWidth = 14;
  ctx.strokeStyle = outerOutline;
  ctx.strokeText(text, x, y + 8);
  ctx.restore();

  // Extruded 3D bevel passes
  for (let d = 8; d >= 3; d--) {
    ctx.lineWidth = 10;
    ctx.strokeStyle = bevelColor;
    ctx.strokeText(text, x, y + d);
  }

  // Outer border stroke
  ctx.lineWidth = 8;
  ctx.strokeStyle = outerOutline;
  ctx.strokeText(text, x, y);

  // Core fill
  ctx.fillStyle = faceGrad;
  ctx.fillText(text, x, y);

  // Top highlight gleam
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeText(text, x, y - 1);
  ctx.restore();

  ctx.restore();
}

/**
 * Draws a colorful brush/pill virtue badge (like 'आत्मविश्वास' or 'प्रामाणिकपणा')
 */
function drawVirtueBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  h: number,
  bgGradColors: [string, string],
  borderColor: string,
  textColor: string,
  shadowColor: string,
  fontFamily: string
): number {
  ctx.save();
  ctx.font = `bold ${Math.round(h * 0.62)}px ${fontFamily}`;
  const textW = ctx.measureText(text).width;
  const paddingX = Math.round(h * 0.55);
  const badgeW = textW + paddingX * 2;
  const badgeX = cx - badgeW / 2;
  const badgeY = cy - h / 2;

  // Shadow
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;

  // Background
  const grad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + h);
  grad.addColorStop(0, bgGradColors[0]);
  grad.addColorStop(1, bgGradColors[1]);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, h, [h / 2]);
  ctx.fill();

  // Border
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Inner glossy gleam
  const gleamGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + h * 0.45);
  gleamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  gleamGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
  ctx.fillStyle = gleamGrad;
  ctx.beginPath();
  ctx.roundRect(badgeX + 2, badgeY + 2, badgeW - 4, h * 0.45, [h / 2, h / 2, 0, 0]);
  ctx.fill();

  // Text
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 4;
  ctx.fillText(text, cx, cy + 1);

  ctx.restore();
  return badgeW;
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
    photoScale = 1.25
  } = options;

  const style = getSuvicharStyleById(styleId);
  const isStory = aspectRatio === 'story';
  const width = 1080;
  const height = isStory ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');

  // Load user photo & custom bg in parallel
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

    // Adaptive Vignette over photo so text pops with 100% clarity
    const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (style.isDarkTheme) {
      overlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      overlayGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.75)');
      overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    } else {
      overlayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
      overlayGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.88)');
      overlayGrad.addColorStop(1, 'rgba(255, 255, 255, 0.96)');
    }
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Style-specific Signature Canvas Backdrop
    const bgGrad = ctx.createRadialGradient(
      width / 2, 
      height * 0.35, 
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

    // Style-specific Ornamental Background Elements
    if (style.id === 'cosmic_gold' || style.id === 'royal_dark') {
      // Cosmic Arc / Golden Aura
      ctx.save();
      const auraGrad = ctx.createRadialGradient(width / 2, 340, 20, width / 2, 340, 480);
      auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
      auraGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.1)');
      auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, 800);

      // Golden Ring Arch
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width / 2, 360, 320, Math.PI * 0.95, Math.PI * 2.05);
      ctx.stroke();
      ctx.restore();
    } else if (style.id === 'sunrise_wood') {
      // Warm Sunrise Rays
      ctx.save();
      const sunGrad = ctx.createRadialGradient(width / 2, 200, 20, width / 2, 200, 600);
      sunGrad.addColorStop(0, 'rgba(251, 146, 60, 0.4)');
      sunGrad.addColorStop(0.6, 'rgba(234, 88, 12, 0.15)');
      sunGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, 800);
      ctx.restore();
    } else if (style.id === 'gold_floral' || style.id === 'golden_frame') {
      // Soft Floral Vines in Corners
      ctx.save();
      ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
      ctx.beginPath();
      ctx.arc(80, 80, 200, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width - 80, 80, 200, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 2. Ornate Border Frame
  const borderMargin = 24;
  ctx.save();
  ctx.strokeStyle = style.isDarkTheme ? '#f59e0b' : '#d97706';
  ctx.lineWidth = 5;
  ctx.strokeRect(borderMargin, borderMargin, width - borderMargin * 2, height - borderMargin * 2);

  ctx.strokeStyle = style.isDarkTheme ? 'rgba(254, 240, 138, 0.35)' : 'rgba(217, 119, 6, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(borderMargin + 10, borderMargin + 10, width - (borderMargin + 10) * 2, height - (borderMargin + 10) * 2);

  // Corner Ornaments
  ctx.fillStyle = style.isDarkTheme ? '#fde047' : '#d97706';
  ctx.font = '24px serif';
  ctx.fillText('❖', borderMargin + 18, borderMargin + 32);
  ctx.fillText('❖', width - borderMargin - 36, borderMargin + 32);
  ctx.fillText('❖', borderMargin + 18, height - borderMargin - 18);
  ctx.fillText('❖', width - borderMargin - 36, height - borderMargin - 18);
  ctx.restore();

  // 3. Top Sub-Branding: Shubh Prabhat Capsule & Live Day/Time
  ctx.save();
  ctx.textAlign = 'center';
  const topPillY = isStory ? 54 : 38;
  const pillW = isStory ? 440 : 380;
  const pillH = isStory ? 44 : 38;
  const pillX = (width - pillW) / 2;

  ctx.fillStyle = style.isDarkTheme ? 'rgba(20, 14, 8, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.roundRect(pillX, topPillY, pillW, pillH, [22]);
  ctx.fill();

  ctx.strokeStyle = style.isDarkTheme ? '#fbbf24' : '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = style.isDarkTheme ? '#fde047' : '#b45309';
  ctx.font = `bold ${isStory ? 20 : 17}px ${style.canvasFontFamily}`;
  ctx.fillText('✨ ॐ सूर्याय नमः • शुभ प्रभात ✨', width / 2, topPillY + (isStory ? 28 : 24));

  if (showDayAndTime) {
    const { badgeText } = getDayAndTimeFormatted(language);
    ctx.fillStyle = style.isDarkTheme ? '#fde68a' : '#78350f';
    ctx.font = `bold ${isStory ? 16 : 13}px sans-serif`;
    ctx.fillText(`📅 ${badgeText}`, width / 2, topPillY + (isStory ? 68 : 56));
  }
  ctx.restore();

  // 4. PARSE SUVICHAR INTO ITS ANATOMY (Lead, Badges, Body)
  let rawText = suvichar.hindiText;
  if (language === 'english') rawText = suvichar.englishText;
  else if (language === 'marathi' && suvichar.marathiText) rawText = suvichar.marathiText;
  else if (language === 'gujarati' && suvichar.gujaratiText) rawText = suvichar.gujaratiText;

  const parsed = parseSuvicharContent(rawText, customBadge1, customBadge2);
  const badge1Text = customBadge1 || parsed.badge1;
  const badge2Text = customBadge2 || parsed.badge2;
  const headlineText = headlineOverride ? headlineOverride.trim() : '';

  // 5. SAFE BOTTOM AREA CALCULATION (User photo, sender plate, short link)
  const hasUserPhoto = !!(userImg && ((userImg.width > 0) || (userImg.naturalWidth > 0) || userImg.complete));
  const basePhotoR = isStory ? 110 : 78;
  const photoR = hasUserPhoto ? Math.round(basePhotoR * photoScale) : 0;
  const plateH = isStory ? 76 : 58;
  const plateW = isStory ? 660 : 540;
  const plateX = (width - plateW) / 2;

  const bottomLinkH = isStory ? 38 : 32;
  const bottomLinkY = height - (isStory ? 72 : 56);
  const plateY = bottomLinkY - plateH - (isStory ? 14 : 10);
  const photoX = width / 2;
  const photoY = hasUserPhoto ? plateY - 16 - photoR : 0;

  // 6. AUSPICIOUS VIRTUE TAGS RIGHT ABOVE USER PHOTO IN SMALL REFINED TEXT
  // ("satywachan and sakaratmak jo text likha o sab user ka photo rahega na round me uske upper karna and chote text em karna")
  const tagY = hasUserPhoto ? (photoY - photoR - (isStory ? 24 : 18)) : (plateY - (isStory ? 24 : 18));
  const safeContentBottom = tagY - (isStory ? 30 : 20);

  // 7. AVAILABLE VERTICAL SPACE FOR BADE BADE TEXT ("hona text or bade karo size uska bohot jagaha hai")
  let currentY = topPillY + (isStory ? 72 : 58);
  if (showDayAndTime) {
    currentY += isStory ? 36 : 28;
  }

  // A. 🌟 SUPER 3D POP HEADLINE WORD (e.g. "शुभ प्रभात" / "आयुष्यांत" / "सत्य वचन")
  if (headlineText && headlineText.trim().length > 0) {
    const headlineFontSize = Math.round((isStory ? 94 : 70) * (fontSizeMultiplier >= 1.5 ? 1.28 : 1.0));
    currentY += headlineFontSize * 0.55;

    draw3DHeadline(
      ctx, 
      headlineText.trim(), 
      width / 2, 
      currentY, 
      headlineFontSize, 
      style.canvasFontFamily, 
      style.headlineTheme
    );

    // Decorative emblem next to headline
    ctx.save();
    ctx.font = `${isStory ? 42 : 30}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(
      style.id === 'magenta_bird' || style.id === 'gold_floral' ? '🐦' : '💛', 
      width / 2 + (headlineText.length * headlineFontSize * 0.32), 
      currentY - headlineFontSize * 0.35
    );
    ctx.restore();

    currentY += headlineFontSize * 0.65;
  }

  // B. 📖 MAIN BOLD WISDOM QUOTE — MAXIMUM SIZE & SPACE UTILIZATION (1.5x BADE BADE TEXT)
  // Clean, massive, royal typography filling the wide open canvas!
  const availableH = Math.max(200, safeContentBottom - currentY);
  const suvicharQuote = rawText.trim();
  const maxBodyW = width - (isStory ? 140 : 110);

  // Dynamic Auto-scaling algorithm with 1.5× FONT SIZE BOOST:
  let chosenFontSize = Math.round((isStory ? 72 : 50) * fontSizeMultiplier);
  if (suvicharQuote.length > 140) {
    chosenFontSize = Math.round((isStory ? 54 : 38) * fontSizeMultiplier);
  } else if (suvicharQuote.length > 80) {
    chosenFontSize = Math.round((isStory ? 62 : 44) * fontSizeMultiplier);
  }

  const minFontSize = Math.round((isStory ? 42 : 30) * Math.min(1.4, fontSizeMultiplier));
  let bodyLines: string[] = [];
  let bodyLineH = Math.round(chosenFontSize * 1.55);

  while (chosenFontSize >= minFontSize) {
    ctx.font = `bold ${chosenFontSize}px ${style.canvasFontFamily}`;
    bodyLines = wrapTextToLines(ctx, suvicharQuote, maxBodyW);
    const totalLinesH = bodyLines.length * bodyLineH;
    if (totalLinesH <= availableH - (isStory ? 35 : 20)) {
      break;
    }
    chosenFontSize -= 2;
    bodyLineH = Math.round(chosenFontSize * 1.55);
  }

  // Center text block vertically within the available space
  const totalBlockH = bodyLines.length * bodyLineH;
  let textY = currentY + Math.max(0, (availableH - totalBlockH) / 2) + Math.round(bodyLineH * 0.45);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  bodyLines.forEach((line) => {
    ctx.save();
    // Ambient drop shadow for 100% crystal legibility
    if (style.isDarkTheme) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = style.textColor;
    } else {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = style.textColor;
    }

    // Outer subtle contrast stroke
    ctx.lineWidth = chosenFontSize > 50 ? 4 : 3;
    ctx.strokeStyle = style.isDarkTheme ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)';
    ctx.font = `bold ${chosenFontSize}px ${style.canvasFontFamily}`;
    ctx.strokeText(line, width / 2, textY);

    // Core fill text
    ctx.fillText(line, width / 2, textY);
    ctx.restore();

    textY += bodyLineH;
  });
  ctx.restore();

  // Subtle ornamental icon beneath the big text
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `${isStory ? 30 : 22}px sans-serif`;
  ctx.fillText(style.ornament, width / 2, textY + (isStory ? 10 : 4));
  ctx.restore();

  // 8. 🏷️ VIRTUE BADGE TEXT DIRECTLY ABOVE THE ROUND USER PHOTO IN SMALL REFINED TEXT
  // ("and satywachan and sakaratmak jo text likha o sab user ka photo rahega na round me uske upper karna and chote text em karna")
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const badgeFontSize = isStory ? 20 : 15;
  ctx.font = `bold ${badgeFontSize}px ${style.canvasFontFamily}`;
  const virtueDisplayText = `✨ ${badge1Text}  •  ${badge2Text} ✨`;
  const textW = ctx.measureText(virtueDisplayText).width;
  const vPillW = textW + (isStory ? 44 : 32);
  const vPillH = isStory ? 36 : 28;
  const vPillX = (width - vPillW) / 2;
  const vPillY = tagY - vPillH / 2;

  // Sleek subtle pill background
  ctx.fillStyle = style.isDarkTheme ? 'rgba(15, 10, 5, 0.85)' : 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.roundRect(vPillX, vPillY, vPillW, vPillH, [vPillH / 2]);
  ctx.fill();

  ctx.strokeStyle = style.isDarkTheme ? '#f59e0b' : '#d97706';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Small elegant text
  ctx.fillStyle = style.isDarkTheme ? '#fde047' : '#92400e';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 4;
  ctx.fillText(virtueDisplayText, width / 2, tagY + 1);
  ctx.restore();

  // 9. 👑 LARGE PROMINENT ROUND USER PHOTO (if uploaded)
  if (hasUserPhoto && userImg) {
    ctx.save();
    // Radiant Golden Halo behind User Photo
    const haloGrad = ctx.createRadialGradient(photoX, photoY, photoR, photoX, photoY, photoR + 28);
    haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
    haloGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 28, 0, Math.PI * 2);
    ctx.fill();

    // Outer Golden Ring
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoR + 4, 0, Math.PI * 2);
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
    ctx.arc(starX, starY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', starX, starY + 5);
    ctx.restore();
  }

  // 8. 🏷️ SENDER ROYAL PLATE
  ctx.save();
  ctx.textAlign = 'center';
  const pGrad = ctx.createLinearGradient(plateX, plateY, plateX + plateW, plateY + plateH);
  if (style.isDarkTheme) {
    pGrad.addColorStop(0, 'rgba(28, 16, 8, 0.96)');
    pGrad.addColorStop(0.5, 'rgba(65, 26, 10, 0.98)');
    pGrad.addColorStop(1, 'rgba(28, 16, 8, 0.96)');
  } else {
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    pGrad.addColorStop(0.5, 'rgba(254, 243, 199, 0.98)');
    pGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
  }

  ctx.fillStyle = pGrad;
  ctx.beginPath();
  ctx.roundRect(plateX, plateY, plateW, plateH, [20]);
  ctx.fill();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = style.isDarkTheme ? '#fde68a' : '#92400e';
  ctx.font = `bold ${isStory ? 16 : 13}px "Noto Sans Devanagari", sans-serif`;
  ctx.fillText('✨ सप्रेम शुभकामना प्रेषक ✨', width / 2, plateY + (isStory ? 24 : 19));

  ctx.fillStyle = style.isDarkTheme ? '#ffffff' : '#1c1917';
  ctx.font = `bold ${isStory ? 32 : 24}px ${style.canvasFontFamily}`;
  if (style.isDarkTheme) {
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 10;
  }
  ctx.fillText(senderName || 'आपका शुभचिंतक', width / 2, plateY + (isStory ? 58 : 45));
  ctx.restore();

  // 9. 🌐 SHORT LINK & WATERMARK BADGE (shubhakamna.in/shubh-prabhat)
  ctx.save();
  ctx.textAlign = 'center';
  const linkW = isStory ? 440 : 360;
  const linkX = (width - linkW) / 2;

  ctx.fillStyle = style.isDarkTheme ? 'rgba(20, 14, 8, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.roundRect(linkX, bottomLinkY, linkW, bottomLinkH, [18]);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = style.isDarkTheme ? '#fde047' : '#b45309';
  ctx.font = `bold ${isStory ? 18 : 15}px sans-serif`;
  ctx.fillText('🌐 shubhakamna.in/shubh-prabhat', width / 2, bottomLinkY + (isStory ? 24 : 20));

  ctx.fillStyle = style.isDarkTheme ? '#94a3b8' : '#64748b';
  ctx.font = `600 ${isStory ? 15 : 12}px "Noto Sans Devanagari", sans-serif`;
  ctx.fillText('दैनिक १०० शुभ प्रभात सुविचार • मुफ़्त फ़ोटो स्टेटस', width / 2, height - (isStory ? 26 : 20));
  ctx.restore();

  // 10. Export as Blob
  return new Promise<{ blob: Blob; fileName: string }>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas blob generation failed'));
          return;
        }
        const safeName = (senderName || 'Suvichar').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '-');
        const fileName = `Shubh-Prabhat-Suvichar-${suvichar.number}-${style.id}-${safeName}.jpg`;
        resolve({ blob, fileName });
      },
      'image/jpeg',
      0.96
    );
  });
}
