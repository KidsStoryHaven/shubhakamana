/**
 * Audio Storage Manager using IndexedDB & LocalStorage fallback
 * Allows storing full MP3 / WAV / OGG / M4A / AAC audio files up to 50MB+ without localStorage quota limits.
 */

const DB_NAME = 'shubhakamna_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'audio_files';

// In-memory cache for fast synchronous access during playback
const memoryAudioCache = new Map<string, string>();
const memoryFileNameCache = new Map<string, string>();

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export interface StoredAudioRecord {
  id: string; // e.g. "fest_diwali" or "wish_birthday-wishes"
  fileName: string;
  dataUrl: string; // base64 data URL
  fileSize: number;
  mimeType: string;
  updatedAt: string;
}

/**
 * Save an uploaded audio file (MP3/WAV/etc.) to IndexedDB
 */
export async function saveUploadedAudioFile(
  key: string,
  dataUrl: string,
  fileName: string = 'custom_audio.mp3',
  mimeType: string = 'audio/mpeg'
): Promise<string> {
  // Update in-memory cache immediately
  memoryAudioCache.set(key, dataUrl);
  memoryFileNameCache.set(key, fileName);

  try {
    localStorage.setItem(`shubhakamna_audio_meta_${key}`, JSON.stringify({
      fileName,
      mimeType,
      updatedAt: new Date().toISOString()
    }));
  } catch {}

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record: StoredAudioRecord = {
        id: key,
        fileName,
        dataUrl,
        fileSize: dataUrl.length,
        mimeType,
        updatedAt: new Date().toISOString()
      };

      const putRequest = store.put(record);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    });

    return dataUrl;
  } catch (err) {
    console.warn('Failed to save to IndexedDB, fallback stored in memory:', err);
    return dataUrl;
  }
}

/**
 * Retrieve uploaded audio file from memory or IndexedDB
 */
export async function getUploadedAudioFile(key: string): Promise<string | null> {
  // Check memory cache first
  if (memoryAudioCache.has(key)) {
    return memoryAudioCache.get(key) || null;
  }

  try {
    const db = await openDatabase();
    return await new Promise<string | null>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        const record = getRequest.result as StoredAudioRecord | undefined;
        if (record?.dataUrl) {
          memoryAudioCache.set(key, record.dataUrl);
          if (record.fileName) memoryFileNameCache.set(key, record.fileName);
          resolve(record.dataUrl);
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

/**
 * Get the stored file name for displaying in Admin UI
 */
export function getUploadedAudioFileName(key: string): string | null {
  if (memoryFileNameCache.has(key)) {
    return memoryFileNameCache.get(key) || null;
  }
  try {
    const raw = localStorage.getItem(`shubhakamna_audio_meta_${key}`);
    if (raw) {
      const meta = JSON.parse(raw);
      if (meta?.fileName) {
        memoryFileNameCache.set(key, meta.fileName);
        return meta.fileName;
      }
    }
  } catch {}
  return null;
}

/**
 * Remove an uploaded audio file
 */
export async function deleteUploadedAudioFile(key: string): Promise<void> {
  memoryAudioCache.delete(key);
  memoryFileNameCache.delete(key);

  try {
    localStorage.removeItem(`shubhakamna_audio_meta_${key}`);
  } catch {}

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const delRequest = store.delete(key);
      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => resolve();
    });
  } catch {}
}
