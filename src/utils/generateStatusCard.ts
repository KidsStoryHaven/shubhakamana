import { Festival } from '../data/festivals';
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
}

/**
 * Generates an Ultra-HD (2160 x 3840, 4K/8K resolution) vertical status card.
 */
export async function generateStatusCardBlob(options: StatusCardOptions): Promise<Blob> {
  const { festival, senderName, userPhoto, birthdayPerson, birthdayPhoto, poem, greetingTitle, heroImageOverride } = options;
  const isBirthday = festival.id === 'birthday' || festival.soundType === 'birthday' || !!birthdayPerson;
  const effectivePhoto = birthdayPhoto || userPhoto;

  const canvas = document.createElement('canvas');
  canvas.width = 2160;
  canvas.height = 3840; // 9:16 vertical 4K UHD
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Festive Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 3840);
  bgGrad.addColorStop(0, '#1c1917');
  bgGrad.addColorStop(0.25, '#292524');
  bgGrad.addColorStop(0.5, '#1c1917');
  bgGrad.addColorStop(0.85, '#0c0a09');
  bgGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2160, 3840);

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

  // 5. Festival Title & Tagline
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 104px serif';
  ctx.fillText(
    isBirthday && birthdayPerson
      ? `🎉 Happy Birthday ${birthdayPerson}! 🎉`
      : (greetingTitle || festival.nameHi),
    1080,
    400
  );

  ctx.fillStyle = '#fde68a';
  ctx.font = '54px sans-serif';
  ctx.fillText(
    isBirthday && birthdayPerson
      ? `ईश्वर आपको दीर्घायु, उत्तम स्वास्थ्य और अपार खुशियाँ प्रदान करें`
      : festival.taglineHi,
    1080,
    500
  );

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

  // 7. Blessing / Poetic Box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.beginPath();
  ctx.roundRect(200, 1820, 1760, 600, 40);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Draw Poem Text (wrapped)
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'italic 58px serif';
  ctx.textAlign = 'center';

  const words = (poem || festival.defaultPoem).split(' ');
  let line = '';
  let y = 1960;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 1600 && n > 0) {
      ctx.fillText(line, 1080, y);
      line = words[n] + ' ';
      y += 90;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 1080, y);

  // 8. Photo (Celebrant Photo or User Photo)
  if (effectivePhoto) {
    await new Promise<void>((resolve) => {
      const userImg = new Image();
      userImg.onload = () => {
        // Draw circular photo
        ctx.save();
        ctx.beginPath();
        ctx.arc(1080, 2720, 230, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImg, 850, 2490, 460, 460);
        ctx.restore();

        // Dual golden outer ring
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(1080, 2720, 230, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(1080, 2720, 252, 0, Math.PI * 2);
        ctx.stroke();

        // If birthday celebrant, draw a cute crown symbol
        if (isBirthday) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '72px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('👑', 1080, 2480);
        }

        resolve();
      };
      userImg.onerror = () => resolve();
      userImg.src = effectivePhoto;
    });
  }

  // 9. Sender Royal Plate
  const nameY = effectivePhoto ? 3120 : 2750;

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 50px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    isBirthday && birthdayPerson
      ? `🎂 ${birthdayPerson} को जन्मदिन की हार्दिक बधाई • प्रेषक 🎂`
      : '✨ सप्रेम एवं आदर सहित प्रेषित ✨',
    1080,
    nameY
  );

  // Big Sender Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 112px serif';
  ctx.fillText(senderName, 1080, nameY + 130);

  ctx.fillStyle = '#fde68a';
  ctx.font = '54px sans-serif';
  ctx.fillText(
    isBirthday && birthdayPerson
      ? `की ओर से आपको जन्मदिन की अनंत शुभकामनाएँ व मंगल आशीष`
      : 'की ओर से आपको एवं आपके परिवार को हार्दिक शुभकामनाएँ',
    1080,
    nameY + 230
  );

  // 10. Watermark & Creation Link
  ctx.fillStyle = '#d6d3d1';
  ctx.font = '42px sans-serif';
  ctx.fillText('📲 अपना नाम व फोटो वाला 8K कार्ड बनाएँ: https://shubhakamna.in', 1080, 3620);

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
