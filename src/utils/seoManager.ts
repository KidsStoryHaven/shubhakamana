import { Festival } from '../data/festivals';
import { isDefaultSenderName } from './shortUrl';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  robots?: string;
  festival?: Festival;
  senderName?: string;
}

const DEFAULT_SEO: SEOMetadata = {
  title: 'Shubhakamna.in - भारत का आधिकारिक शुभकामना पोर्टल | नाम व फोटो सहित विशेज',
  description: 'Shubhakamna.in - सभी भारतीय महापर्वों (दीपावली, नव वर्ष, होली, रक्षाबंधन) व व्यक्तिगत उत्सवों पर अपने नाम और फोटो की जादुई विशिंग लिंक बनाएँ और 1-क्लिक में WhatsApp पर भेजें।',
  keywords: 'Shubhakamna, shubhakamna.in, diwali wishes with name, new year 2026 wishes generator, happy birthday wish with name and song, holi wishes online, hindu god wallpapers 4k, shivratri wishes, ram navami greeting, whatsapp viral wish link, deepawali status maker',
  canonicalUrl: 'https://shubhakamna.in/',
  ogImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&h=630&q=85',
  ogType: 'website',
  robots: 'index, follow, max-image-preview:large'
};

/**
 * Helper to update or create a <meta> tag by name or property
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string): void {
  if (typeof document === 'undefined') return;
  
  let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attributeName, attributeValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Helper to update or create a <link rel="..."> tag
 */
function setLinkTag(rel: string, href: string): void {
  if (typeof document === 'undefined') return;

  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Dynamically updates all Document Title, Meta tags, OpenGraph, Twitter Cards, Canonical URL, and JSON-LD schema
 */
export function updatePageSEO(meta: Partial<SEOMetadata>): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const title = meta.title || DEFAULT_SEO.title;
  const description = meta.description || DEFAULT_SEO.description;
  const keywords = meta.keywords || DEFAULT_SEO.keywords || '';
  const canonicalUrl = meta.canonicalUrl || window.location.href;
  const ogImage = meta.ogImage || DEFAULT_SEO.ogImage || '';
  const ogType = meta.ogType || DEFAULT_SEO.ogType || 'website';
  const robots = meta.robots || DEFAULT_SEO.robots || 'index, follow, max-image-preview:large';
  const isNoIndex = robots.toLowerCase().includes('noindex');

  // 1. Browser Window & Tab Title
  document.title = title;

  // 2. Standard Search Engine Meta Tags
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', keywords);
  setMetaTag('name', 'robots', isNoIndex ? 'noindex, nofollow, noarchive' : robots);
  setMetaTag(
    'name', 
    'googlebot', 
    isNoIndex 
      ? 'noindex, nofollow, noarchive' 
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  );
  setMetaTag('name', 'bingbot', isNoIndex ? 'noindex, nofollow, noarchive' : 'index, follow');
  
  // 3. Canonical URL
  setLinkTag('canonical', canonicalUrl);

  // 4. OpenGraph Meta Tags (WhatsApp, Facebook, LinkedIn, iMessage preview)
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:site_name', 'Shubhakamna.in');
  if (ogImage) {
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:alt', title);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
  }

  // 5. Twitter / X Card Meta Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  if (ogImage) {
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:image:alt', title);
  }

  // 6. Schema.org JSON-LD Structured Data
  updateJsonLdSchema(meta);
}

/**
 * Updates Schema.org Structured Data in <head>
 */
function updateJsonLdSchema(meta: Partial<SEOMetadata>): void {
  if (typeof document === 'undefined') return;

  let script = document.getElementById('dynamic-seo-ld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'dynamic-seo-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const festival = meta.festival;
  const canonicalUrl = meta.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://shubhakamna.in');

  if (festival) {
    // Event + CreativeWork Schema for Festival
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': `${festival.nameHi} (${festival.nameEn}) - शुभकामनाएँ व बधाई`,
      'description': meta.description || festival.significance || festival.taglineHi,
      'startDate': festival.dateLabel || '2026',
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
      'location': {
        '@type': 'VirtualLocation',
        'url': canonicalUrl
      },
      'image': [meta.ogImage || festival.heroImage],
      'organizer': {
        '@type': 'Organization',
        'name': 'Shubhakamna.in',
        'url': 'https://shubhakamna.in'
      },
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock',
        'url': canonicalUrl
      }
    };
    script.textContent = JSON.stringify(schema, null, 2);
  } else {
    // Portal Root WebApplication Schema
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Shubhakamna.in',
      'url': 'https://shubhakamna.in/',
      'applicationCategory': 'LifestyleApplication',
      'operatingSystem': 'All',
      'description': 'भारत का आधिकारिक शुभकामना द्वार - सभी त्योहारों व उत्सवों पर अपने नाम व फोटो सहित जादुई विशिंग ग्रीटिंग्स बनाएँ।',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'INR'
      }
    };
    script.textContent = JSON.stringify(schema, null, 2);
  }
}

/**
 * Generates tailored SEO metadata for a specific Festival
 */
export function getFestivalSEOMetadata(
  festival: Festival, 
  senderName?: string,
  lang: string = 'hi'
): SEOMetadata {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
  const cleanPath = `/${festival.slug || festival.id}`;
  const canonicalUrl = `${origin}${cleanPath}`;
  const isCustomSender = senderName && !isDefaultSenderName(senderName);

  let title = '';
  let description = '';

  if (isCustomSender) {
    title = `${senderName} ने आपके लिए भेजा है ${festival.nameHi} का जादुई शुभकामना संदेश! ✨ | Shubhakamna.in`;
    description = `${senderName} की ओर से ${festival.nameHi} (${festival.dateLabel}) की हार्दिक शुभकामनाएँ। इस जादुई लिंक पर क्लिक करें और अपने नाम का पावन ग्रीटिंग कार्ड बनाएँ।`;
  } else {
    title = `${festival.nameHi} 2026 की हार्दिक शुभकामनाएँ | ${festival.nameEn} Wishes with Name & Photo - Shubhakamna.in`;
    description = `${festival.nameHi} (${festival.dateLabel}) पर अपने नाम और फोटो की जादुई विशिंग लिंक बनाएँ। सुंदर बधाई शायरी, 4K वॉलपेपर और 1-क्लिक WhatsApp स्टेटस।`;
  }

  const keywords = `${festival.nameHi} wishes, ${festival.nameEn} 2026, ${festival.nameHi} ki shubhakamnaye, ${festival.nameHi} status with my photo, ${festival.nameEn} greeting card maker, Shubhakamna.in`;

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage: festival.heroImage || DEFAULT_SEO.ogImage,
    ogType: 'article',
    robots: 'index, follow, max-image-preview:large',
    festival,
    senderName
  };
}

/**
 * Resets SEO back to default home portal values
 */
export function resetPortalSEO(): void {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
  updatePageSEO({
    ...DEFAULT_SEO,
    canonicalUrl: `${origin}/`
  });
}
