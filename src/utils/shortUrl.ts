import { FESTIVALS } from '../data/festivals';

/**
 * Phonetically transliterates Devanagari Hindi characters to clean ASCII/Latin characters.
 * Example: 'राहुल' -> 'Rahul', 'सुधा' -> 'Sudha', 'अमित' -> 'Amit'
 */
export function devanagariToLatin(text: string): string {
  if (!text) return '';

  // If already ASCII/Latin letters, format cleanly
  if (/^[a-zA-Z0-9\s_-]+$/.test(text)) {
    return text.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
  }

  const charMap: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gy',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h',
    '्': '', '़': ''
  };

  let result = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const ch = text[i];
    if (ch === ' ' || ch === '_') {
      result += '_';
      continue;
    }

    if (charMap[ch] !== undefined) {
      result += charMap[ch];
      const isConsonant = /[\u0915-\u0939]/.test(ch);
      const nextChar = i + 1 < len ? text[i + 1] : '';
      const nextIsMatraOrHalant = /[\u093E-\u094D\u0902\u0903]/.test(nextChar);
      if (isConsonant && !nextIsMatraOrHalant && i + 1 < len && nextChar !== ' ' && nextChar !== '_') {
        result += 'a';
      }
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      result += ch;
    }
  }

  // Capitalize nicely
  return result
    .split('_')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('_');
}

/**
 * Checks if the name is a default placeholder.
 */
export function isDefaultSenderName(name: string): boolean {
  if (!name) return true;
  const n = name.trim().toLowerCase();
  return (
    n === 'आपका शुभचिंतक' ||
    n === 'शुभचिंतक' ||
    n === 'मित्र' ||
    n === 'shubh' ||
    n === 'your well-wisher' ||
    n.includes('शुभचिंतक')
  );
}

/**
 * Creates a 100% clean, short, aesthetic URL with ZERO percent-encoding.
 * - Default: https://shubhakamna.in/?w=diwali
 * - Named (English): https://shubhakamna.in/?w=Rahul_diwali
 * - Named (Hindi): https://shubhakamna.in/?w=Sudha_diwali
 */
export function createShortWishUrl(senderName: string, festivalId: string, lang: string = 'hi'): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
  const fest = festivalId || 'diwali';

  // 1. If default name: no sender name in URL, keeping it ultra-short!
  if (isDefaultSenderName(senderName)) {
    if (lang && lang !== 'hi') {
      return `${origin}/?w=${fest}_${lang}`;
    }
    return `${origin}/?w=${fest}`;
  }

  // 2. Convert name to clean ASCII (transliterating Hindi if needed)
  const cleanName = devanagariToLatin(senderName) || 'Shubh';

  let shortParam = `${cleanName}_${fest}`;
  if (lang && lang !== 'hi') {
    shortParam += `_${lang}`;
  }

  return `${origin}/?w=${shortParam}`;
}

export interface ParsedWishData {
  festivalId?: string;
  senderName?: string;
  lang?: string;
}

/**
 * Parses wish parameters from search query or pathname.
 */
export function parseWishUrl(search: string = '', pathname: string = ''): ParsedWishData {
  let decodedSearch = search;
  try {
    decodedSearch = decodeURIComponent(search);
  } catch {}

  const params = new URLSearchParams(decodedSearch);

  // 1. Check short parameter ?w= or ?wish= or ?to=
  let shortParam = params.get('w') || params.get('wish') || params.get('to');
  if (shortParam) {
    try {
      shortParam = decodeURIComponent(shortParam);
    } catch {}

    const delimiter = shortParam.includes('_') ? '_' : '-';
    const parts = shortParam.split(delimiter);

    if (parts.length >= 2) {
      const possibleLang = parts[parts.length - 1].toLowerCase();
      const isLang = ['hi', 'mr', 'en', 'gu', 'bn', 'te', 'ta', 'kn', 'pa'].includes(possibleLang);
      
      const lang = isLang ? possibleLang : undefined;
      const festivalPart = isLang ? parts[parts.length - 2] : parts[parts.length - 1];

      const festMatch = FESTIVALS.find(f => f.id === festivalPart || f.slug === festivalPart);
      const festivalId = festMatch ? festMatch.id : festivalPart;

      const nameParts = isLang ? parts.slice(0, parts.length - 2) : parts.slice(0, parts.length - 1);
      const rawName = nameParts.join(' ').replace(/_/g, ' ').trim();
      const senderName = isDefaultSenderName(rawName) ? 'आपका शुभचिंतक' : rawName;

      return { festivalId, senderName, lang };
    } else {
      // Single token: could be a festival id like ?w=diwali
      const festMatch = FESTIVALS.find(f => f.id === shortParam || f.slug === shortParam);
      if (festMatch) {
        return { festivalId: festMatch.id, senderName: 'आपका शुभचिंतक' };
      }
      return { senderName: shortParam.replace(/_/g, ' ').trim() };
    }
  }

  // 2. Fallback to standard params (?f=diwali&from=Rahul&lang=hi)
  const festivalId = params.get('f') || params.get('festival') || undefined;
  const rawSender = (params.get('from') || params.get('name') || params.get('n') || '').replace(/_/g, ' ').trim();
  const senderName = rawSender ? (isDefaultSenderName(rawSender) ? 'आपका शुभचिंतक' : rawSender) : undefined;
  const lang = params.get('lang') || params.get('l') || undefined;

  return { festivalId, senderName, lang };
}
