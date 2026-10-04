/**
 * Google Drive Image & Media URL Direct Resolver
 * Converts any Google Drive sharing link, view link, or file ID into an instant high-speed CDN image URL.
 * Bypasses Google Drive HTML wrapper pages, preview interstitials, and CORS blocking.
 */

export function extractGoogleDriveFileId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();

  // Pattern 1: /file/d/FILE_ID/view or /d/FILE_ID/
  const matchFileD = trimmed.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]{15,})/i);
  if (matchFileD && matchFileD[1]) {
    return matchFileD[1];
  }

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID (uc?id=, open?id=)
  const matchParamId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{15,})/i);
  if (matchParamId && matchParamId[1]) {
    return matchParamId[1];
  }

  // Pattern 3: google.com/drive/folders/ or docs.google.com/uc?id=
  const matchDocs = trimmed.match(/\/uc\?(?:[^&]*&)*id=([a-zA-Z0-9_-]{15,})/i);
  if (matchDocs && matchDocs[1]) {
    return matchDocs[1];
  }

  // Pattern 4: Raw file ID directly pasted (starts with alphanumeric, 25+ chars)
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Resolves any image URL to a high-speed direct CDN URL.
 * If a Google Drive URL is provided, returns Google's ultra-fast `lh3.googleusercontent.com/d/{id}` direct image stream.
 */
export function resolveDirectImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  const gDriveId = extractGoogleDriveFileId(trimmed);
  if (gDriveId) {
    // lh3.googleusercontent.com is Google's official direct high-speed CDN that allows CORS, full-res, and instant loading
    return `https://lh3.googleusercontent.com/d/${gDriveId}`;
  }

  return trimmed;
}

/**
 * Resolves any audio URL (including Google Drive MP3 sharing links) into a direct streaming audio URL.
 */
export function resolveDirectAudioUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  const gDriveId = extractGoogleDriveFileId(trimmed);
  if (gDriveId) {
    // Google Drive direct MP3 stream URL
    return `https://docs.google.com/uc?export=download&id=${gDriveId}`;
  }

  return trimmed;
}

/**
 * Returns alternative CDN URLs for a Google Drive file in case of rate limiting or domain blocks
 */
export function getGoogleDriveFallbackUrls(urlOrId: string): string[] {
  const gDriveId = extractGoogleDriveFileId(urlOrId);
  if (!gDriveId) return [];
  return [
    `https://lh3.googleusercontent.com/d/${gDriveId}`,
    `https://drive.google.com/thumbnail?id=${gDriveId}&sz=w1600`,
    `https://drive.google.com/uc?export=view&id=${gDriveId}`
  ];
}

/**
 * Checks if a URL is a Google Drive link
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com/uc') || url.includes('googleusercontent.com/d/');
}
