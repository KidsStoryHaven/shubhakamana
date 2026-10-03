export type AdSlotId = 'header' | 'in_content' | 'below_generator' | 'sticky_bottom';

export interface AdSlotConfig {
  id: AdSlotId;
  name: string;
  nameEn: string;
  description: string;
  recommendedSize: string;
  enabled: boolean;
  code: string;
}

export interface AdSettings {
  adsEnabled: boolean; // Master toggle
  headerScript: string; // e.g. Google AdSense verification or auto ads script
  slots: Record<AdSlotId, AdSlotConfig>;
}

const STORAGE_KEY_ADS = 'shubhakamna_ad_settings_v2';

export const DEFAULT_AD_SETTINGS: AdSettings = {
  adsEnabled: false,
  headerScript: '',
  slots: {
    header: {
      id: 'header',
      name: 'शीर्ष बैनर विज्ञापन (Top Header Ad)',
      nameEn: 'Header Banner',
      description: 'नेवबार के ठीक नीचे और मुख्य पेज पर सबसे ऊपर दिखाई देगा।',
      recommendedSize: '728x90 या Responsive Display Ad',
      enabled: false,
      code: ''
    },
    in_content: {
      id: 'in_content',
      name: 'सामग्री के बीच विज्ञापन (In-Content Feed Ad)',
      nameEn: 'In-Content Banner',
      description: 'त्योहारों की गैलरी और कार्ड्स के बीच में स्वाभाविक रूप से दिखेगा।',
      recommendedSize: '300x250 Medium Rectangle या In-feed Ad',
      enabled: false,
      code: ''
    },
    below_generator: {
      id: 'below_generator',
      name: 'विश जनरेटर के नीचे विज्ञापन (Below Wish Generator)',
      nameEn: 'Below Generator Ad',
      description: 'जहाँ यूज़र अपना नाम लिखकर "जादुई शुभकामना लिंक बनाएँ" बटन दबाता है, उसके ठीक नीचे (सबसे ज़्यादा क्लिक्स वाला स्थान)।',
      recommendedSize: '336x280 / 300x250 या Responsive Ad',
      enabled: false,
      code: ''
    },
    sticky_bottom: {
      id: 'sticky_bottom',
      name: 'निचला फ़्लोटिंग बैनर (Sticky Bottom Mobile Ad)',
      nameEn: 'Sticky Bottom Banner',
      description: 'मोबाइल स्क्रीन के नीचे हमेशा चिपका रहेगा (कट करने के बटन के साथ)।',
      recommendedSize: '320x50 Mobile Banner या 728x90 Leaderboard',
      enabled: false,
      code: ''
    }
  }
};

/**
 * Retrieve current ad configuration
 */
export function getStoredAdSettings(): AdSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_AD_SETTINGS,
        ...parsed,
        slots: {
          ...DEFAULT_AD_SETTINGS.slots,
          ...(parsed.slots || {})
        }
      };
    }
  } catch (e) {
    console.warn('Failed to parse ad settings:', e);
  }
  return DEFAULT_AD_SETTINGS;
}

/**
 * Save updated ad configuration and dispatch custom change event
 */
export function saveStoredAdSettings(settings: AdSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(settings));
    window.dispatchEvent(new Event('shubhakamna_ads_changed'));
  } catch (e) {
    console.error('Failed to save ad settings:', e);
  }
}
