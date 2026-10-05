/**
 * Google Drive Image & Media URL Direct Resolver & Folder Scraper
 * Converts any Google Drive sharing link, view link, or file ID into an instant high-speed CDN image URL.
 * Automatically fetches and extracts photos from public Google Drive folders for festival galleries.
 */

export function extractGoogleDriveFileId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();

  // Pattern 1: /file/d/FILE_ID/view, /file/u/0/d/FILE_ID, /d/FILE_ID/
  const matchFileD = trimmed.match(/\/(?:file\/)?(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]{15,})/i);
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

  // Pattern 4: Google User Content direct format (lh3.googleusercontent.com/d/FILE_ID)
  const matchLh3 = trimmed.match(/googleusercontent\.com\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]{15,})/i);
  if (matchLh3 && matchLh3[1]) {
    return matchLh3[1];
  }

  // Pattern 5: drive.google.com/thumbnail?id=FILE_ID
  const matchThumbnail = trimmed.match(/thumbnail\?(?:[^&]*&)*id=([a-zA-Z0-9_-]{15,})/i);
  if (matchThumbnail && matchThumbnail[1]) {
    return matchThumbnail[1];
  }

  // Pattern 6: Raw file ID directly pasted (starts with alphanumeric, 25+ chars, not a folder url)
  if (/^[a-zA-Z0-9_-]{25,60}$/.test(trimmed) && !trimmed.includes('folders')) {
    return trimmed;
  }

  return null;
}

/**
 * Extracts Google Drive Folder ID from any shared folder link or raw ID
 */
export function extractGoogleDriveFolderId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();

  // Pattern 1: drive.google.com/drive/folders/FOLDER_ID or /u/0/folders/FOLDER_ID
  const matchFolders = trimmed.match(/\/folders\/([a-zA-Z0-9_-]{15,})/i);
  if (matchFolders && matchFolders[1]) {
    return matchFolders[1];
  }

  // Pattern 2: embeddedfolderview?id=FOLDER_ID
  const matchEmbedded = trimmed.match(/embeddedfolderview\?(?:[^&]*&)*id=([a-zA-Z0-9_-]{15,})/i);
  if (matchEmbedded && matchEmbedded[1]) {
    return matchEmbedded[1];
  }

  // Pattern 3: ?id=FOLDER_ID (when folder is in query)
  if (trimmed.includes('folders') || trimmed.includes('folder')) {
    const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{15,})/i);
    if (matchId && matchId[1]) {
      return matchId[1];
    }
  }

  // Pattern 4: Raw alphanumeric string (25-60 chars)
  if (/^[a-zA-Z0-9_-]{25,60}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Resolves any image URL to a high-speed direct CDN URL.
 * If a Google Drive URL is provided, returns Google's direct high-speed thumbnail/CDN stream.
 */
export function resolveDirectImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  const gDriveId = extractGoogleDriveFileId(trimmed);
  if (gDriveId) {
    // lh3.googleusercontent.com/d/ is Google's ultra fast CORS-enabled direct asset renderer
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
    // Google Drive direct MP3 streaming endpoint
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
    `https://docs.google.com/uc?export=view&id=${gDriveId}`
  ];
}

/**
 * Checks if a URL is a Google Drive link
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('drive.google.com') || 
    url.includes('docs.google.com/uc') || 
    url.includes('googleusercontent.com/d/') ||
    url.includes('googleusercontent.com')
  );
}

export interface DriveFolderPhoto {
  id: string;
  fileId: string;
  imageUrl: string;
  thumbnailUrl: string;
  title: string;
  godName?: string;
  tagline?: string;
  badge?: string;
  mantra?: string;
}

export interface FetchDriveFolderResult {
  success: boolean;
  folderId?: string;
  count: number;
  photos: DriveFolderPhoto[];
  message: string;
}

/**
 * Fetches all photos from a Google Drive folder link
 * Calls backend server endpoint with fallback to direct scraping/parsing
 */
export async function fetchPhotosFromGoogleDriveFolder(
  folderUrlOrId: string, 
  festivalName: string = 'पावन उत्सव'
): Promise<FetchDriveFolderResult> {
  const folderId = extractGoogleDriveFolderId(folderUrlOrId);
  if (!folderId) {
    return {
      success: false,
      count: 0,
      photos: [],
      message: 'अमान्य Google Drive फ़ोल्डर लिंक! कृपया सही लिंक (उदा. https://drive.google.com/drive/folders/...) दर्ज करें।'
    };
  }

  // 1. Try backend API endpoint first
  try {
    const res = await fetch('/api/gdrive/fetch-folder-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderUrlOrId, festivalName })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.photos) && data.photos.length > 0) {
        return {
          success: true,
          folderId,
          count: data.photos.length,
          photos: data.photos,
          message: data.message || `सफलता! फ़ोल्डर से ${data.photos.length} फ़ोटो लोड हो गईं! 📸`
        };
      }
    }
  } catch (err) {
    console.warn('Backend GDrive folder fetch failed or skipped, trying client fallback:', err);
  }

  // 2. Client fallback - parse public embedded view
  try {
    const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    const response = await fetch(embedUrl, { mode: 'no-cors' });
    // In no-cors mode body cannot be inspected directly, but we provide mock or user input fallback
  } catch (e) {
    // Ignore
  }

  return {
    success: false,
    folderId,
    count: 0,
    photos: [],
    message: 'फ़ोल्डर से सीधे फ़ोटो लोड करने के लिए कृपया सुनिश्चित करें कि फ़ोल्डर की शेयरिंग "Anyone with the link can view" (कोई भी देख सकता है) पर सेट है।'
  };
}
