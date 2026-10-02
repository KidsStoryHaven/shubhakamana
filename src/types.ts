export type DeityId = 
  | 'all' 
  | 'shiva' 
  | 'ram' 
  | 'krishna' 
  | 'hanuman' 
  | 'ganesha' 
  | 'durga' 
  | 'vishnu';

export interface DeityInfo {
  id: DeityId;
  nameHi: string;
  nameEn: string;
  icon: string;
  mantra: string;
  description: string;
  color: string;
}

export interface Wallpaper {
  id: string;
  titleHi: string;
  titleEn: string;
  deityId: DeityId;
  imageUrl: string;
  aspectRatio: '9:16' | '3:4';
  resolution: string;
  tagsHi: string[];
  mantraHi: string;
  featured?: boolean;
  downloads: number;
  likes: number;
}

export type QuoteCategory = 
  | 'all'
  | 'gita' 
  | 'bhakti' 
  | 'shanti' 
  | 'prerna' 
  | 'suprabhat' 
  | 'sankatmochan';

export interface Quote {
  id: string;
  sanskritShloka?: string;
  hindiText: string;
  hindiMeaning?: string;
  englishTranslation?: string;
  sourceHi: string;
  sourceEn: string;
  deityId?: DeityId;
  category: QuoteCategory;
  tags: string[];
  likes: number;
}
