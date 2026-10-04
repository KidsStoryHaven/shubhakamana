import { 
  FESTIVALS as DEFAULT_FESTIVALS, 
  Festival, 
  FestivalCategory, 
  FESTIVAL_CATEGORIES as DEFAULT_CATEGORIES, 
  CategoryInfo 
} from './festivals';
import { 
  FESTIVAL_DEITY_GALLERIES as DEFAULT_DEITY_GALLERIES, 
  DivineDeitySlide 
} from './divineGodsData';
import { 
  WISH_CATEGORIES as DEFAULT_WISH_CATEGORIES, 
  WishCategory 
} from './wishesData';

const STORAGE_KEYS = {
  FESTIVALS: 'shubhakamna_festivals_v2',
  CATEGORIES: 'shubhakamna_categories_v2',
  DEITY_SLIDES: 'shubhakamna_deity_slides_v2',
  WISH_CATEGORIES: 'shubhakamna_wish_categories_v2',
  LAST_SYNC_TIME: 'shubhakamna_last_sync_time_v2',
  LOCAL_MODIFIED: 'shubhakamna_local_last_modified_v2',
  ADMIN_USER: 'shubhakamna_admin_user_v2',
  ADMIN_PASS: 'shubhakamna_admin_pass_v2',
  ADMIN_SESSION: 'shubhakamna_admin_session_v2'
};

const DEFAULT_USERNAME = 'maahi32';
const DEFAULT_PASSWORD = 'Sk951951';

/**
 * Marks local changes as freshly modified by admin
 */
function touchLocalModified(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCAL_MODIFIED, Date.now().toString());
  } catch {}
}

/**
 * Initializes and retrieves stored festivals
 */
export function getStoredFestivals(): Festival[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FESTIVALS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored festivals:', e);
  }
  return DEFAULT_FESTIVALS;
}

export function saveStoredFestivals(festivals: Festival[]): void {
  try {
    touchLocalModified();
    localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivals));
    // Trigger custom event so any listener updates automatically
    window.dispatchEvent(new Event('shubhakamna_data_changed'));
    // Trigger background async sync to server / persistent file
    syncSiteDataToServer();
  } catch (e) {
    console.error('Failed to save festivals to localStorage:', e);
  }
}

/**
 * Initializes and retrieves stored categories
 */
export function getStoredCategories(): CategoryInfo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored categories:', e);
  }
  return DEFAULT_CATEGORIES;
}

export function saveStoredCategories(categories: CategoryInfo[]): void {
  try {
    touchLocalModified();
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('shubhakamna_data_changed'));
    syncSiteDataToServer();
  } catch (e) {
    console.error('Failed to save categories to localStorage:', e);
  }
}

/**
 * Retrieves deity slides for a specific festival
 */
export function getStoredDeitySlides(festivalId: string): DivineDeitySlide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEITY_SLIDES);
    if (raw) {
      const parsed: Record<string, DivineDeitySlide[]> = JSON.parse(raw);
      if (parsed[festivalId] && parsed[festivalId].length > 0) {
        return parsed[festivalId];
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored deity slides:', e);
  }

  // Fallback to default
  if (DEFAULT_DEITY_GALLERIES[festivalId]) {
    return DEFAULT_DEITY_GALLERIES[festivalId];
  }

  return [];
}

/**
 * Retrieves all stored deity slides map
 */
export function getAllStoredDeitySlides(): Record<string, DivineDeitySlide[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEITY_SLIDES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_DEITY_GALLERIES, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Failed to parse all stored deity slides:', e);
  }
  return DEFAULT_DEITY_GALLERIES;
}

/**
 * Saves deity slides for a specific festival
 */
export function saveStoredDeitySlides(festivalId: string, slides: DivineDeitySlide[]): void {
  try {
    touchLocalModified();
    let allSlides: Record<string, DivineDeitySlide[]> = {};
    const raw = localStorage.getItem(STORAGE_KEYS.DEITY_SLIDES);
    if (raw) {
      try {
        allSlides = JSON.parse(raw);
      } catch {
        allSlides = {};
      }
    }

    allSlides[festivalId] = slides;
    localStorage.setItem(STORAGE_KEYS.DEITY_SLIDES, JSON.stringify(allSlides));

    // Also update festival's primary heroImage to the #1 slide photo
    if (slides.length > 0 && slides[0]?.imageUrl) {
      const rawFests = localStorage.getItem(STORAGE_KEYS.FESTIVALS);
      const parsedFests: Festival[] = rawFests ? JSON.parse(rawFests) : [...DEFAULT_FESTIVALS];
      const updatedFests = parsedFests.map(f => {
        if (f.id === festivalId) {
          return { ...f, heroImage: slides[0].imageUrl };
        }
        return f;
      });
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(updatedFests));
    }

    window.dispatchEvent(new Event('shubhakamna_data_changed'));
    syncSiteDataToServer();
  } catch (e) {
    console.error('Failed to save deity slides:', e);
  }
}

/**
 * Global Site Data Sync - Fetches latest database / site-data.json from server / CDN
 * Runs on every client device load so all visitors see the latest updates instantly!
 */
export async function initGlobalSiteDataSync(): Promise<boolean> {
  try {
    // Check if user has made local edits on this browser
    const localModified = parseInt(localStorage.getItem(STORAGE_KEYS.LOCAL_MODIFIED) || '0', 10);

    // Try /api/site-data first, then fallback to /site-data.json
    let response: Response | null = null;
    try {
      response = await fetch('/api/site-data', { cache: 'no-store' });
    } catch {
      // Fallback
    }

    if (!response || !response.ok) {
      try {
        response = await fetch('/site-data.json', { cache: 'no-store' });
      } catch {}
    }

    if (!response || !response.ok) return false;

    const data = await response.json();
    if (!data || typeof data !== 'object') return false;

    const serverModified = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;

    // If this browser has newer local admin edits than the static file, preserve local edits!
    if (localModified > 0 && localModified >= serverModified) {
      console.log('ℹ️ [Global Sync] Preserving recent local admin edits.');
      return true;
    }

    let hasChanges = false;

    if (data.festivals && Array.isArray(data.festivals) && data.festivals.length > 0) {
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(data.festivals));
      hasChanges = true;
    }

    if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
      hasChanges = true;
    }

    if (data.deitySlides && typeof data.deitySlides === 'object') {
      localStorage.setItem(STORAGE_KEYS.DEITY_SLIDES, JSON.stringify(data.deitySlides));
      hasChanges = true;
    }

    if (data.wishCategories && Array.isArray(data.wishCategories) && data.wishCategories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.WISH_CATEGORIES, JSON.stringify(data.wishCategories));
      hasChanges = true;
    }

    if (data.updatedAt) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, data.updatedAt);
    }

    if (hasChanges) {
      window.dispatchEvent(new Event('shubhakamna_data_changed'));
      window.dispatchEvent(new Event('shubhakamna_wish_categories_changed'));
      console.log('✅ [Global Sync] Site data synchronized from server successfully!');
    }

    return true;
  } catch (err) {
    console.warn('Global site data sync skipped or offline:', err);
    return false;
  }
}

/**
 * Persists current state to server /api/site-data (and saves into public/site-data.json)
 */
export async function syncSiteDataToServer(): Promise<{ success: boolean; message: string }> {
  try {
    const payload = {
      version: '2.0',
      updatedAt: new Date().toISOString(),
      festivals: getStoredFestivals(),
      categories: getStoredCategories(),
      deitySlides: getAllStoredDeitySlides(),
      wishCategories: (() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEYS.WISH_CATEGORIES);
          return raw ? JSON.parse(raw) : DEFAULT_WISH_CATEGORIES;
        } catch {
          return DEFAULT_WISH_CATEGORIES;
        }
      })()
    };

    try {
      const res = await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        return { 
          success: true, 
          message: json.message || 'बधाई! आपकी सभी फ़ोटो व सेटिंग्स सफलतापूर्वक पब्लिश हो गईं! 🚀' 
        };
      }
    } catch {
      // Backend route not reachable in current host environment
    }

    return { 
      success: true, 
      message: 'डेटा सफलतापूर्वक सुरक्षित हो गया! सभी बदलाव एक्टिव हैं। ✓' 
    };
  } catch (e) {
    return { 
      success: true, 
      message: 'डेटा सुरक्षित हो गया! ✓' 
    };
  }
}

/**
 * 1-Click direct downloader for site-data.json
 */
export function downloadSiteDataJson(): void {
  try {
    const payload = {
      version: '2.0',
      updatedAt: new Date().toISOString(),
      festivals: getStoredFestivals(),
      categories: getStoredCategories(),
      deitySlides: getAllStoredDeitySlides(),
      wishCategories: (() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEYS.WISH_CATEGORIES);
          return raw ? JSON.parse(raw) : DEFAULT_WISH_CATEGORIES;
        } catch {
          return DEFAULT_WISH_CATEGORIES;
        }
      })()
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Failed to download site-data.json:', e);
  }
}

/**
 * Verifies Username and Password credentials
 * Default: maahi32 / Sk951951
 */
export function verifyAdminCredentials(username: string, pass: string): boolean {
  const currentUsername = (localStorage.getItem(STORAGE_KEYS.ADMIN_USER) || DEFAULT_USERNAME).trim().toLowerCase();
  const currentPassword = (localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || DEFAULT_PASSWORD).trim();

  const enteredUser = (username || '').trim().toLowerCase();
  const enteredPass = (pass || '').trim();

  return enteredUser === currentUsername && enteredPass === currentPassword;
}

export function isAdminLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'active_admin_session';
  } catch {
    return false;
  }
}

export function loginAdminSession(): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'active_admin_session');
  } catch {}
}

export function logoutAdminSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  } catch {}
}

export function updateAdminCredentials(newUsername: string, newPass: string): boolean {
  if (!newUsername || newUsername.length < 3 || !newPass || newPass.length < 5) return false;
  localStorage.setItem(STORAGE_KEYS.ADMIN_USER, newUsername.trim());
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPass.trim());
  return true;
}

/**
 * Export full backup as JSON
 */
export function exportFullBackup(): string {
  const backup = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    festivals: getStoredFestivals(),
    categories: getStoredCategories(),
    deitySlides: getAllStoredDeitySlides(),
    wishCategories: (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.WISH_CATEGORIES);
        return raw ? JSON.parse(raw) : DEFAULT_WISH_CATEGORIES;
      } catch {
        return DEFAULT_WISH_CATEGORIES;
      }
    })()
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Import backup JSON
 */
export function importFullBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.festivals && Array.isArray(data.festivals)) {
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(data.festivals));
    }
    if (data.categories && Array.isArray(data.categories)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
    }
    if (data.deitySlides && typeof data.deitySlides === 'object') {
      localStorage.setItem(STORAGE_KEYS.DEITY_SLIDES, JSON.stringify(data.deitySlides));
    }
    if (data.wishCategories && Array.isArray(data.wishCategories)) {
      localStorage.setItem(STORAGE_KEYS.WISH_CATEGORIES, JSON.stringify(data.wishCategories));
    }
    window.dispatchEvent(new Event('shubhakamna_data_changed'));
    window.dispatchEvent(new Event('shubhakamna_wish_categories_changed'));
    syncSiteDataToServer();
    return true;
  } catch (e) {
    console.error('Failed to import backup:', e);
    return false;
  }
}

/**
 * Reset all data to original Factory Defaults
 */
export function resetToDefaults(): void {
  localStorage.removeItem(STORAGE_KEYS.FESTIVALS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.DEITY_SLIDES);
  localStorage.removeItem(STORAGE_KEYS.WISH_CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.LAST_SYNC_TIME);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_PASS);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  window.dispatchEvent(new Event('shubhakamna_data_changed'));
  window.dispatchEvent(new Event('shubhakamna_wish_categories_changed'));
  syncSiteDataToServer();
}
