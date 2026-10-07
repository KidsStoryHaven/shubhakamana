/**
 * Utility for 100% Working Image + Link Sharing to WhatsApp and Social Media.
 * Uses Web Share API (Level 2 with file support) so the real slide image
 * is attached directly into WhatsApp chat, with direct WhatsApp link fallback.
 */

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

export async function shareToWhatsAppWithPhoto(options: SharePhotoOptions): Promise<{ sharedWithFile: boolean }> {
  const { imageUrl, canvasBlob, text, title, url, fileName = 'shubhakamna-wish.jpg', onSuccess, onFallback } = options;

  let imageBlob: Blob | null = canvasBlob || null;

  // 1. If no canvasBlob provided, try to fetch from imageUrl or proxy
  if (!imageBlob && imageUrl) {
    try {
      if (imageUrl.startsWith('data:')) {
        const res = await fetch(imageUrl);
        imageBlob = await res.blob();
      } else {
        // Try direct fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        try {
          const res = await fetch(imageUrl, { mode: 'cors', signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            imageBlob = await res.blob();
          }
        } catch {
          // If direct CORS fails, try server proxy
          try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
            const proxyRes = await fetch(proxyUrl);
            if (proxyRes.ok) {
              imageBlob = await proxyRes.blob();
            }
          } catch {
            // Ignored
          }
        }
      }
    } catch {
      imageBlob = null;
    }
  }

  // 2. Try Native Mobile Web Share API with File Attachment
  if (imageBlob && typeof navigator !== 'undefined' && navigator.share) {
    try {
      const file = new File([imageBlob], fileName, { type: imageBlob.type || 'image/jpeg' });
      
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
      // User cancelled share sheet
      if (err.name === 'AbortError') {
        return { sharedWithFile: false };
      }
      console.warn('Native file share failed, proceeding to direct WhatsApp link:', err);
    }
  }

  // 3. Copy text to clipboard so user has it ready
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  } catch {}

  // 4. Open WhatsApp directly with the magic wishing message and link
  // (NEVER open remote image URLs with target="_blank" as that causes Google 400 errors)
  const waUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
  const webWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  if (isMobile) {
    // Direct mobile WhatsApp app launch
    window.location.href = waUrl;
  } else {
    // Desktop WhatsApp Web
    window.open(webWaUrl, '_blank');
  }

  if (onSuccess) onSuccess();
  return { sharedWithFile: false };
}
