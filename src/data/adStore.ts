export type AdSlotId = 
  | 'header' 
  | 'in_content' 
  | 'below_generator' 
  | 'sticky_bottom'
  | 'desktop_skyscraper'
  | 'desktop_side'
  | 'banner_468'
  | 'native_widget';

export type DeviceTarget = 'all' | 'mobile_only' | 'desktop_only';

export interface AdSlotConfig {
  id: AdSlotId;
  name: string;
  nameEn: string;
  description: string;
  recommendedSize: string;
  deviceTarget: DeviceTarget;
  enabled: boolean;
  code: string;
}

export interface MonetagConfig {
  enabled: boolean;
  tagUrl: string;
  inPagePushScript: string;
}

export interface AdsterraConfig {
  enabled: boolean; // Master toggle for Adsterra
  popunderEnabled: boolean;
  popunderScript: string;
  nativeEnabled: boolean;
  nativeSocialBarScript: string;
}

export interface AdSettings {
  adsEnabled: boolean; // Global Master toggle (सभी विज्ञापन चालू/बंद)
  monetag: MonetagConfig;
  adsterra: AdsterraConfig;
  headerScript: string; // Custom global head script
  slots: Record<AdSlotId, AdSlotConfig>;
}

const STORAGE_KEY_ADS = 'shubhakamna_ad_settings_v5';

export const DEFAULT_AD_SETTINGS: AdSettings = {
  adsEnabled: true,
  monetag: {
    enabled: true,
    tagUrl: 'https://5gvci.com/act/files/tag.min.js?z=11988485',
    inPagePushScript: `<script>(function(s){s.dataset.zone='11988535',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>`
  },
  adsterra: {
    enabled: true,
    popunderEnabled: true,
    popunderScript: `<script src="https://pl31735163.profitableratecpmnetwork.com/2d/e3/4f/2de34fcc8f2bca313b407b570e087f42.js"></script>`,
    nativeEnabled: true,
    nativeSocialBarScript: `<script async="async" data-cfasync="false" src="https://pl31735164.profitableratecpmnetwork.com/c4f15575f9df841804b1e0e3a8015e25/invoke.js"></script>\n<div id="container-c4f15575f9df841804b1e0e3a8015e25"></div>`
  },
  headerScript: '',
  slots: {
    header: {
      id: 'header',
      name: 'Adsterra 728x90 शीर्ष लीडरबोर्ड (PC / डेस्कटॉप स्पेशल)',
      nameEn: 'Desktop 728x90 Header',
      description: 'केवल PC/कंप्यूटर व बड़ी स्क्रीन पर दिखाई देगा। मोबाइल यूज़र्स पर स्वतः छुपा रहेगा ताकि स्क्रीन ब्लॉक न हो।',
      recommendedSize: '728x90 Leaderboard',
      deviceTarget: 'desktop_only',
      enabled: true,
      code: `<script>\n  atOptions = {\n    'key' : 'c336329cb5fa7c03182ccaae3168a25e',\n    'format' : 'iframe',\n    'height' : 90,\n    'width' : 728,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/c336329cb5fa7c03182ccaae3168a25e/invoke.js"></script>`
    },
    sticky_bottom: {
      id: 'sticky_bottom',
      name: 'Adsterra 320x50 मोबाइल स्टिकी बैनर (Mobile Only Special)',
      nameEn: 'Mobile 320x50 Sticky Bottom',
      description: 'केवल मोबाइल यूज़र्स की स्क्रीन के नीचे हल्का स्टिकी बैनर (क्लोज X बटन के साथ)। हाई CPM व सुरक्षित।',
      recommendedSize: '320x50 Mobile Banner',
      deviceTarget: 'mobile_only',
      enabled: true,
      code: `<script>\n  atOptions = {\n    'key' : '657f41b6633a50a0a440bb251d9656ad',\n    'format' : 'iframe',\n    'height' : 50,\n    'width' : 320,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/657f41b6633a50a0a440bb251d9656ad/invoke.js"></script>`
    },
    in_content: {
      id: 'in_content',
      name: 'Adsterra 300x250 कार्ड इन-कंटेंट रेक्टेंगल (Mobile & PC Both)',
      nameEn: 'In-Content 300x250 Rectangle',
      description: 'त्योहारों की गैलरी और कार्ड्स के बीच में स्वाभाविक रूप से दिखता है। मोबाइल और PC दोनों के लिए सर्वोत्तम।',
      recommendedSize: '300x250 Medium Rectangle',
      deviceTarget: 'all',
      enabled: true,
      code: `<script>\n  atOptions = {\n    'key' : 'c44f92f5e0658af923e66437f93c1a8b',\n    'format' : 'iframe',\n    'height' : 250,\n    'width' : 300,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/c44f92f5e0658af923e66437f93c1a8b/invoke.js"></script>`
    },
    below_generator: {
      id: 'below_generator',
      name: 'Adsterra 300x250 विश जनरेटर के नीचे (Highest CTR Spot)',
      nameEn: 'Below Wish Generator Ad',
      description: 'जहाँ यूज़र अपना नाम लिखकर "जादुई शुभकामना लिंक बनाएँ" बटन दबाता है उसके ठीक नीचे। 100% सेफ व हाई रेवेन्यू।',
      recommendedSize: '300x250 Rectangle',
      deviceTarget: 'all',
      enabled: true,
      code: `<script>\n  atOptions = {\n    'key' : 'c44f92f5e0658af923e66437f93c1a8b',\n    'format' : 'iframe',\n    'height' : 250,\n    'width' : 300,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/c44f92f5e0658af923e66437f93c1a8b/invoke.js"></script>`
    },
    desktop_skyscraper: {
      id: 'desktop_skyscraper',
      name: 'Adsterra 160x600 PC साइडबार स्काईस्क्रेपर (Desktop Side Gutter)',
      nameEn: 'PC 160x600 Skyscraper',
      description: 'बड़ी कंप्यूटर/लैपटॉप स्क्रीन के साइड मार्जिन (खाली जगह) में बिना रुकावट दिखेगा। सबसे अधिक CPM देने वाला फॉर्मेट।',
      recommendedSize: '160x600 Wide Skyscraper',
      deviceTarget: 'desktop_only',
      enabled: true,
      code: `<script>\n  atOptions = {\n    'key' : 'ae5a2301cb7787fb9d829c52e76ccf93',\n    'format' : 'iframe',\n    'height' : 600,\n    'width' : 160,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/ae5a2301cb7787fb9d829c52e76ccf93/invoke.js"></script>`
    },
    desktop_side: {
      id: 'desktop_side',
      name: 'Adsterra 160x300 PC साइड हाफ-स्काईस्क्रेपर (Desktop Side Rail)',
      nameEn: 'PC 160x300 Side Banner',
      description: 'कंप्यूटर स्क्रीन की दाईं/बाईं साइड में सुंदर हाफ-बैनर। मोबाइल पर बिल्कुल नहीं दिखेगा।',
      recommendedSize: '160x300 Half Skyscraper',
      deviceTarget: 'desktop_only',
      enabled: true,
      code: `<script>\n  atOptions = {\n    'key' : '36ae6f55376033d6413faa61a268318d',\n    'format' : 'iframe',\n    'height' : 300,\n    'width' : 160,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/36ae6f55376033d6413faa61a268318d/invoke.js"></script>`
    },
    banner_468: {
      id: 'banner_468',
      name: 'Adsterra 468x60 टैबलेट व पीसी क्लासिक बैनर (Tablet / PC Banner)',
      nameEn: '468x60 Classic Banner',
      description: 'मध्यम व बड़ी स्क्रीन के लिए आदर्श बैनर। मोबाइल पर सामग्री को कभी नहीं दबाएगा।',
      recommendedSize: '468x60 Banner',
      deviceTarget: 'desktop_only',
      enabled: true,
      code: `<script>\n  atOptions = {\n    'key' : '1dc32741abd6df8d3e4caf8d8e2de2c1',\n    'format' : 'iframe',\n    'height' : 60,\n    'width' : 468,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/1dc32741abd6df8d3e4caf8d8e2de2c1/invoke.js"></script>`
    },
    native_widget: {
      id: 'native_widget',
      name: 'Adsterra नेटिव विजेट (Multi-Device Native Bar)',
      nameEn: 'Adsterra Native Widget',
      description: 'पेज के अंत में स्वाभाविक रूप से दिखता है। मोबाइल और PC दोनों पर सुंदर और सहज।',
      recommendedSize: 'Native Responsive Container',
      deviceTarget: 'all',
      enabled: true,
      code: `<script async="async" data-cfasync="false" src="https://pl31735164.profitableratecpmnetwork.com/c4f15575f9df841804b1e0e3a8015e25/invoke.js"></script>\n<div id="container-c4f15575f9df841804b1e0e3a8015e25"></div>`
    }
  }
};

/**
 * Retrieve current ad configuration
 */
export function getStoredAdSettings(): AdSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADS) || localStorage.getItem('shubhakamna_ad_settings_v3') || localStorage.getItem('shubhakamna_ad_settings_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_AD_SETTINGS,
        ...parsed,
        monetag: {
          ...DEFAULT_AD_SETTINGS.monetag,
          ...(parsed.monetag || {})
        },
        adsterra: {
          ...DEFAULT_AD_SETTINGS.adsterra,
          ...(parsed.adsterra || {})
        },
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

/**
 * Reset all ad settings to clean factory defaults with all Monetag & Adsterra codes
 */
export function resetAdSettingsToDefaults(): AdSettings {
  saveStoredAdSettings(DEFAULT_AD_SETTINGS);
  return DEFAULT_AD_SETTINGS;
}
