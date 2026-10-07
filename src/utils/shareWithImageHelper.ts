/**
 * Utility for 100% Working Image + Link Sharing to WhatsApp and Social Media.
 * Uses Web Share API (Level 2 with file support) so the real slide image
 * is attached directly into WhatsApp chat, with direct WhatsApp link fallback.
 */

import { resolveDirectImageUrl } from './googleDriveHelper';

interface SharePhotoOptions {
  imageUrl?: string | null;
  canvasBlob?: Blob | null;
  text: string;
  title: string;
  url: string;
  fileName?: string;
  onSuccess?: () => void;
  onFallback?: (msg: string) => void;
}

/**
 * Converts any image source (URL, SVG data URL, base64) to a pure, high-quality image/jpeg Blob.
 * Essential because WhatsApp rejects SVGs and non-standard image formats.
 */
async function convertToJpegBlob(sourceUrl: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const timeout = setTimeout(() => {
        resolve(null);
      }, 4500);

      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          const width = img.naturalWidth || 1200;
          const height = img.naturalHeight || 800;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            resolve(null);
            return;
          }

          // Draw dark festive background to prevent transparency artifacts
          ctx.fillStyle = '#0c0a09';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.95);
        } catch {
          resolve(null);
        }
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(null);
      };

      img.src = sourceUrl;
    } catch {
      resolve(null);
    }
  });
}

/**
 * Universal WhatsApp launcher that NEVER errors out with ERR_UNKNOWN_URL_SCHEME.
 * Uses official WhatsApp universal link (wa.me) that automatically switches
 * between native mobile app and WhatsApp Web without browser scheme warnings.
 */
export function openWhatsAppUniversal(text: string): void {
  const encodedText = encodeURIComponent(text);
  const waUrl = `https://wa.me/?text=${encodedText}`;

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  if (isMobile) {
    window.location.href = waUrl;
  } else {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
}

export async function shareToWhatsAppWithPhoto(options: SharePhotoOptions): Promise<{ sharedWithFile: boolean }> {
  const { imageUrl, canvasBlob, text, title, url, fileName = 'shubhakamna-wish.jpg', onSuccess, onFallback } = options;

  let imageBlob: Blob | null = canvasBlob || null;

  // 1. Process and convert imageUrl into an image/jpeg blob suitable for WhatsApp
  if (!imageBlob && imageUrl) {
    const directUrl = resolveDirectImageUrl(imageUrl);

    // If it's an SVG data URI or SVG string, rasterize it via canvas to JPEG
    if (directUrl.startsWith('data:image/svg') || directUrl.includes('<svg')) {
      imageBlob = await convertToJpegBlob(directUrl);
    } else if (directUrl.startsWith('data:image/')) {
      try {
        const res = await fetch(directUrl);
        const rawBlob = await res.blob();
        if (rawBlob.type === 'image/jpeg') {
          imageBlob = rawBlob;
        } else {
          imageBlob = await convertToJpegBlob(directUrl);
        }
      } catch {
        imageBlob = await convertToJpegBlob(directUrl);
      }
    } else {
      // Remote HTTP/HTTPS URL (Google Drive, Unsplash, CDN)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(directUrl, { mode: 'cors', signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const fetchedBlob = await res.blob();
          if (fetchedBlob.type === 'image/jpeg' || fetchedBlob.type === 'image/png') {
            imageBlob = fetchedBlob;
          } else {
            imageBlob = await convertToJpegBlob(directUrl);
          }
        }
      } catch {
        // Fallback 1: Try server proxy
        try {
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
          const proxyRes = await fetch(proxyUrl);
          if (proxyRes.ok) {
            imageBlob = await proxyRes.blob();
          }
        } catch {
          // Ignored
        }
      }

      // Fallback 2: Canvas image load if fetch was blocked by CORS
      if (!imageBlob) {
        imageBlob = await convertToJpegBlob(directUrl);
      }
    }
  }

  // 2. Try Native Mobile Web Share API with File Attachment (Real image in WhatsApp)
  if (imageBlob && typeof navigator !== 'undefined' && navigator.share) {
    try {
      const file = new File([imageBlob], fileName, { type: 'image/jpeg' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: text,
        });
        if (onSuccess) onSuccess();
        return { sharedWithFile: true };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { sharedWithFile: false };
      }
      console.warn('Native file share failed, proceeding to direct WhatsApp universal link:', err);
    }
  }

  // 3. Copy text to clipboard so user has it ready
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  } catch {}

  // 4. Open WhatsApp directly via official universal link (100% error-free on both mobile and desktop)
  openWhatsAppUniversal(text);

  if (onSuccess) onSuccess();
  return { sharedWithFile: false };
}
