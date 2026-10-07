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
export interface ParsedWishData {
  festivalId?: string;
  senderName?: string;
  birthdayPerson?: string;
  birthdayPhoto?: string;
  lang?: string;
  customImage?: string;
}

/**
 * Creates a 100% clean, short, aesthetic URL with ZERO percent-encoding.
 * - Default: https://shubhakamna.in/?w=diwali
 * - Named (English): https://shubhakamna.in/?w=Rahul_diwali
 * - Birthday with Name: https://shubhakamna.in/?w=birthday&bname=Akash&from=Rahul
 */
export function createShortWishUrl(
  senderName: string, 
  festivalId: string, 
  lang: string = 'hi',
  birthdayPerson?: string,
  slideImageUrl?: string
): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
  const fest = festivalId || 'diwali';

  // If this is a birthday wish and a birthday person name is provided
  if ((fest === 'birthday' || fest.includes('birthday')) && birthdayPerson?.trim()) {
    const cleanBday = devanagariToLatin(birthdayPerson) || birthdayPerson.trim();
    let url = `${origin}/?w=birthday&bname=${encodeURIComponent(cleanBday)}`;
    if (!isDefaultSenderName(senderName)) {
      const cleanSender = devanagariToLatin(senderName) || senderName.trim();
      url += `&from=${encodeURIComponent(cleanSender)}`;
    }
    if (lang && lang !== 'hi') {
      url += `&lang=${lang}`;
    }
    if (slideImageUrl && slideImageUrl.startsWith('http')) {
      url += `&img=${encodeURIComponent(slideImageUrl)}`;
    }
    return url;
  }

  // 1. If default name: no sender name in URL, keeping it ultra-short!
  if (isDefaultSenderName(senderName)) {
    let url = `${origin}/?w=${fest}`;
    if (lang && lang !== 'hi') {
      url = `${origin}/?w=${fest}_${lang}`;
    }
    if (slideImageUrl && slideImageUrl.startsWith('http')) {
      url += `&img=${encodeURIComponent(slideImageUrl)}`;
    }
    return url;
  }

  // 2. Convert name to clean ASCII (transliterating Hindi if needed)
  const cleanName = devanagariToLatin(senderName) || 'Shubh';

  let shortParam = `${cleanName}_${fest}`;
  if (lang && lang !== 'hi') {
    shortParam += `_${lang}`;
  }

  let url = `${origin}/?w=${shortParam}`;
  if (slideImageUrl && slideImageUrl.startsWith('http')) {
    url += `&img=${encodeURIComponent(slideImageUrl)}`;
  }

  return url;
}

/**
 * Parses wish parameters from search query or pathname.
 * Supports:
 * - Clean paths: /diwali, /holi, /karwa_chauth, /dhammachakra_pravartan
 * - Short query: ?w=diwali, ?w=karwa_chauth, ?w=Rahul_diwali, ?w=Rahul_karwa_chauth_en
 * - Birthday queries: ?w=birthday&bname=Akash&from=Rahul
 * - Standard query: ?festival=diwali&from=Rahul&lang=hi
 */
export function parseWishUrl(search: string = '', pathname: string = ''): ParsedWishData {
  let decodedSearch = search;
  try {
    decodedSearch = decodeURIComponent(search);
  } catch {}

  const params = new URLSearchParams(decodedSearch);

  // Extract birthday celebrant name if present (?bname=Akash or ?birthday=Akash or ?for=Akash)
  const rawBirthdayPerson = (
    params.get('bname') || 
    params.get('birthday') || 
    params.get('celebrant') || 
    params.get('for') || 
    ''
  ).replace(/_/g, ' ').trim();
  const birthdayPerson = rawBirthdayPerson || undefined;

  // Custom slide image if provided in query
  const customImg = params.get('img') || params.get('image') || undefined;

  // 0. Check clean pathname (e.g. /diwali, /holi, /new-year, /festival/diwali, /karwa_chauth)
  let cleanPath = (pathname || '').replace(/^\/+|\/+$/g, '').trim().toLowerCase();
  if (cleanPath && cleanPath !== 'admin') {
    if (cleanPath.startsWith('festival/')) cleanPath = cleanPath.replace('festival/', '');
    if (cleanPath.startsWith('w/')) cleanPath = cleanPath.replace('w/', '');
    if (cleanPath.startsWith('wish/')) cleanPath = cleanPath.replace('wish/', '');

    const normalizedPath = cleanPath.replace(/-/g, '_');
    const festMatch = FESTIVALS.find(
      f => f.id.toLowerCase() === cleanPath || 
           f.slug.toLowerCase() === cleanPath ||
           f.id.toLowerCase() === normalizedPath ||
           f.slug.toLowerCase().replace(/-/g, '_') === normalizedPath
    );
    if (festMatch) {
      const rawSender = (params.get('from') || params.get('name') || params.get('n') || '').replace(/_/g, ' ').trim();
      const senderName = rawSender ? (isDefaultSenderName(rawSender) ? 'आपका शुभचिंतक' : rawSender) : undefined;
      const lang = params.get('lang') || params.get('l') || undefined;
      return { festivalId: festMatch.id, senderName, birthdayPerson, lang, customImage: customImg };
    }
  }

  // 1. Check short parameter ?w= or ?wish= or ?to=
  let shortParam = params.get('w') || params.get('wish') || params.get('to');
  if (shortParam) {
    try {
      shortParam = decodeURIComponent(shortParam);
    } catch {}

    const trimmed = shortParam.trim();

    // Check for trailing language code (_hi, _mr, _en, _gu, etc.)
    const supportedLangs = ['hi', 'mr', 'en', 'gu', 'bn', 'te', 'ta', 'kn', 'pa'];
    let detectedLang: string | undefined = undefined;
    let mainToken = trimmed;

    for (const l of supportedLangs) {
      if (mainToken.toLowerCase().endsWith(`_${l}`) || mainToken.toLowerCase().endsWith(`-${l}`)) {
        detectedLang = l;
        mainToken = mainToken.slice(0, -(l.length + 1));
        break;
      }
    }

    // Sort festivals by ID/slug length descending so compound IDs match first
    const sortedFestivals = [...FESTIVALS].sort((a, b) => b.id.length - a.id.length);

    // Case A: Entire mainToken matches a festival (e.g. ?w=karwa_chauth, ?w=diwali, ?w=dhammachakra_pravartan)
    const exactMatch = sortedFestivals.find(
      f => f.id.toLowerCase() === mainToken.toLowerCase() ||
           f.slug.toLowerCase() === mainToken.toLowerCase() ||
           f.id.toLowerCase().replace(/_/g, '-') === mainToken.toLowerCase().replace(/_/g, '-')
    );

    if (exactMatch) {
      return {
        festivalId: exactMatch.id,
        senderName: 'आपका शुभचिंतक',
        birthdayPerson,
        lang: detectedLang || params.get('lang') || undefined,
        customImage: customImg
      };
    }

    // Case B: mainToken has sender prefix + festival (e.g. Rahul_karwa_chauth, Rahul_diwali)
    let matchedFest: typeof FESTIVALS[0] | undefined;
    let senderPart = '';

    for (const f of sortedFestivals) {
      const fId = f.id.toLowerCase();
      const fSlug = f.slug.toLowerCase();
      const fHyphen = fId.replace(/_/g, '-');
      const fUnderscore = fSlug.replace(/-/g, '_');

      const patterns = [`_${fId}`, `-${fId}`, `_${fSlug}`, `-${fSlug}`, `_${fHyphen}`, `-${fHyphen}`, `_${fUnderscore}`, `-${fUnderscore}`];
      for (const p of patterns) {
        if (mainToken.toLowerCase().endsWith(p)) {
          matchedFest = f;
          senderPart = mainToken.slice(0, -p.length);
          break;
        }
      }
      if (matchedFest) break;
    }

    if (matchedFest) {
      const rawName = senderPart.replace(/_/g, ' ').replace(/-/g, ' ').trim();
      const senderName = isDefaultSenderName(rawName) ? 'आपका शुभचिंतक' : rawName;
      return {
        festivalId: matchedFest.id,
        senderName,
        birthdayPerson,
        lang: detectedLang || params.get('lang') || undefined,
        customImage: customImg
      };
    }

    // Fallback: If no known festival matched, try splitting by the last separator
    const lastUnderscore = mainToken.lastIndexOf('_');
    const lastHyphen = mainToken.lastIndexOf('-');
    const splitIdx = Math.max(lastUnderscore, lastHyphen);

    if (splitIdx > 0) {
      const festCandidate = mainToken.slice(splitIdx + 1);
      const nameCandidate = mainToken.slice(0, splitIdx).replace(/[_ -]+/g, ' ').trim();
      const festMatch = FESTIVALS.find(f => f.id.toLowerCase() === festCandidate.toLowerCase());
      return {
        festivalId: festMatch ? festMatch.id : festCandidate,
        senderName: isDefaultSenderName(nameCandidate) ? 'आपका शुभचिंतक' : nameCandidate,
        birthdayPerson,
        lang: detectedLang,
        customImage: customImg
      };
    }

    return {
      senderName: mainToken.replace(/[_ -]+/g, ' ').trim(),
      birthdayPerson,
      lang: detectedLang,
      customImage: customImg
    };
  }

  // 2. Fallback to standard params (?f=diwali&from=Rahul&lang=hi)
  const festivalId = params.get('f') || params.get('festival') || undefined;
  const rawSender = (params.get('from') || params.get('name') || params.get('n') || '').replace(/_/g, ' ').trim();
  const senderName = rawSender ? (isDefaultSenderName(rawSender) ? 'आपका शुभचिंतक' : rawSender) : undefined;
  const lang = params.get('lang') || params.get('l') || undefined;

  return { festivalId, senderName, birthdayPerson, lang, customImage: customImg };
}
