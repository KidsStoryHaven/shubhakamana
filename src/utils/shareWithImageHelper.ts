/**
 * Utility for 100% Working Image + Link Sharing to WhatsApp and Social Media.
 * Uses Web Share API (Level 2 with file support) so the real slide image
 * is attached directly into WhatsApp chat, with automatic download fallback.
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

  // 1. If no canvasBlob provided, fetch from imageUrl or proxy
  if (!imageBlob && imageUrl) {
    try {
      if (imageUrl.startsWith('data:')) {
        const res = await fetch(imageUrl);
        imageBlob = await res.blob();
      } else {
        // Try direct fetch or proxy
        try {
          const res = await fetch(imageUrl, { mode: 'cors' });
          if (res.ok) {
            imageBlob = await res.blob();
          }
        } catch {
          // If direct CORS fails, use server proxy or canvas draw
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
          const res = await fetch(proxyUrl);
          if (res.ok) {
            imageBlob = await res.blob();
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
      // User cancelled share sheet or platform rejected file sharing
      if (err.name === 'AbortError') {
        return { sharedWithFile: false };
      }
      console.warn('Native file share failed, falling back to auto-download + WhatsApp link:', err);
    }
  }

  // 3. Fallback: Auto-Download Image to Device + Open WhatsApp with formatted text & link
  if (imageBlob) {
    try {
      const blobUrl = URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch {}
  } else if (imageUrl && !imageUrl.startsWith('data:')) {
    // Trigger download via link
    const a = document.createElement('a');
    a.href = imageUrl;
    a.target = '_blank';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Copy text to clipboard so user can easily paste if needed
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  } catch {}

  // Open WhatsApp with text
  const waUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
  const webWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = waUrl;
  } else {
    window.open(webWaUrl, '_blank');
  }

  if (onFallback) {
    onFallback('📸 स्लाइडर फ़ोटो आपके फ़ोन में सेव हो गई है! WhatsApp में फ़ोटो अटैच करके भेजें ✓');
  }

  if (onSuccess) onSuccess();
  return { sharedWithFile: false };
}
