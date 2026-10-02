import { FESTIVALS } from '../data/festivals';

/**
 * Creates a sleek, ultra-clean short URL for WhatsApp sharing.
 * Example: https://shubhakamna.in/?w=Sudha_diwali
 * Or with language: https://shubhakamna.in/?w=Sudha_diwali_mr
 */
export function createShortWishUrl(senderName: string, festivalId: string, lang: string = 'hi'): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
  
  // Clean the sender name: replace spaces with underscores, remove unsafe characters
  const cleanName = (senderName || 'मित्र')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[&?#=%]/g, '');

  let shortParam = `${cleanName}_${festivalId}`;
  if (lang && lang !== 'hi') {
    shortParam += `_${lang}`;
  }

  return `${origin}/?w=${encodeURIComponent(shortParam)}`;
}

export interface ParsedWishData {
  festivalId?: string;
  senderName?: string;
  lang?: string;
}

/**
 * Parses wish parameters from search query or pathname with complete backwards compatibility.
 */
export function parseWishUrl(search: string = '', pathname: string = ''): ParsedWishData {
  const params = new URLSearchParams(search);

  // 1. Check short parameter ?w= or ?wish= or ?to=
  const shortParam = params.get('w') || params.get('wish') || params.get('to');
  if (shortParam) {
    // Can be separated by underscore _ or hyphen -
    const delimiter = shortParam.includes('_') ? '_' : '-';
    const parts = shortParam.split(delimiter);

    if (parts.length >= 2) {
      // Check if last part is a language code (2 chars: hi, mr, en, gu, bn, te, ta, kn, pa)
      const possibleLang = parts[parts.length - 1].toLowerCase();
      const isLang = ['hi', 'mr', 'en', 'gu', 'bn', 'te', 'ta', 'kn', 'pa'].includes(possibleLang);
      
      const lang = isLang ? possibleLang : undefined;
      const festivalPart = isLang ? parts[parts.length - 2] : parts[parts.length - 1];

      // Find festival matching festivalPart
      const festMatch = FESTIVALS.find(f => f.id === festivalPart || f.slug === festivalPart);
      const festivalId = festMatch ? festMatch.id : festivalPart;

      // Everything before festival is sender name
      const nameParts = isLang ? parts.slice(0, parts.length - 2) : parts.slice(0, parts.length - 1);
      const senderName = nameParts.join(' ').replace(/_/g, ' ').trim() || undefined;

      return { festivalId, senderName, lang };
    } else {
      // Single token in ?w=Name
      return { senderName: shortParam.replace(/_/g, ' ').trim() };
    }
  }

  // 2. Check path /w/Sudha_diwali or /diwali-wishes
  if (pathname && pathname.startsWith('/w/')) {
    const slug = pathname.substring(3);
    const parts = slug.split('-');
    if (parts.length >= 2) {
      return {
        senderName: parts[0].replace(/_/g, ' ').trim(),
        festivalId: parts[1]
      };
    }
  }

  // 3. Fallback to standard params (?f=diwali&from=Rahul&lang=hi)
  const festivalId = params.get('f') || params.get('festival') || undefined;
  const senderName = (params.get('from') || params.get('name') || params.get('n') || '').replace(/_/g, ' ').trim() || undefined;
  const lang = params.get('lang') || params.get('l') || undefined;

  return { festivalId, senderName, lang };
}
