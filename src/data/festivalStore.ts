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

const STORAGE_KEYS = {
  FESTIVALS: 'shubhakamna_festivals_v2',
  CATEGORIES: 'shubhakamna_categories_v2',
  DEITY_SLIDES: 'shubhakamna_deity_slides_v2',
  ADMIN_USER: 'shubhakamna_admin_user_v2',
  ADMIN_PASS: 'shubhakamna_admin_pass_v2',
  ADMIN_SESSION: 'shubhakamna_admin_session_v2'
};

const DEFAULT_USERNAME = 'maahi32';
const DEFAULT_PASSWORD = 'Sk951951';

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
    localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivals));
    // Trigger custom event so any listener updates automatically
    window.dispatchEvent(new Event('shubhakamna_data_changed'));
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
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('shubhakamna_data_changed'));
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
 * Saves deity slides for a specific festival
 */
export function saveStoredDeitySlides(festivalId: string, slides: DivineDeitySlide[]): void {
  try {
    let allSlides: Record<string, DivineDeitySlide[]> = {};
    const raw = localStorage.getItem(STORAGE_KEYS.DEITY_SLIDES);
    if (raw) {
      allSlides = JSON.parse(raw);
    } else {
      allSlides = { ...DEFAULT_DEITY_GALLERIES };
    }

    allSlides[festivalId] = slides;
    localStorage.setItem(STORAGE_KEYS.DEITY_SLIDES, JSON.stringify(allSlides));
    window.dispatchEvent(new Event('shubhakamna_data_changed'));
  } catch (e) {
    console.error('Failed to save deity slides:', e);
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
    deitySlides: (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.DEITY_SLIDES);
        return raw ? JSON.parse(raw) : DEFAULT_DEITY_GALLERIES;
      } catch {
        return DEFAULT_DEITY_GALLERIES;
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
    window.dispatchEvent(new Event('shubhakamna_data_changed'));
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
  localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_PASS);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  window.dispatchEvent(new Event('shubhakamna_data_changed'));
}
