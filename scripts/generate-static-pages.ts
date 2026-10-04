import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WISH_CATEGORIES, WishCategory, getBreadcrumbTrail, getChildCategories, getCategoryBySlug } from '../src/data/wishesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

const SITE_ORIGIN = 'https://shubhakamna.in';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildCategoryCrawlableHtml(cat: WishCategory): string {
  const breadcrumbs = getBreadcrumbTrail(cat);
  const childCategories = getChildCategories(cat.slug);

  const breadcrumbsHtml = `
    <nav aria-label="Breadcrumb" class="py-3 px-1 text-xs text-stone-400 font-medium" itemscope itemtype="https://schema.org/BreadcrumbList">
      <ol class="flex items-center flex-wrap gap-1.5">
        ${breadcrumbs
          .map(
            (b, idx) => `
          <li class="flex items-center gap-1.5" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            ${
              idx === breadcrumbs.length - 1
                ? `<span class="text-amber-400 font-semibold" aria-current="page" itemprop="name">${escapeHtml(b.name)}</span>`
                : `<a href="${b.url}" class="hover:text-amber-400 transition-colors" itemprop="item"><span itemprop="name">${escapeHtml(b.name)}</span></a>`
            }
            <meta itemprop="position" content="${idx + 1}" />
            ${idx < breadcrumbs.length - 1 ? `<span class="text-stone-600">›</span>` : ''}
          </li>
        `
          )
          .join('')}
      </ol>
    </nav>
  `;

  const childLinksHtml =
    childCategories.length > 0
      ? `
    <section class="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-3 my-6">
      <h2 class="text-xs font-bold text-amber-400 uppercase tracking-wider">संबंध-वार विशेष पृष्ठ (Explore by Relationship):</h2>
      <div class="flex flex-wrap gap-2">
        ${childCategories
          .map(
            child => `
          <a href="/${child.slug}/" class="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold inline-flex items-center gap-1.5">
            <span>${child.theme.accentEmoji}</span>
            <span>${escapeHtml(child.nameHi)}</span>
            <span>→</span>
          </a>
        `
          )
          .join('')}
      </div>
    </section>
  `
      : '';

  const wishesHtml = cat.wishes
    .map(
      (w, idx) => `
    <div class="p-4 sm:p-5 rounded-2xl border bg-stone-900/80 border-stone-800 my-4 space-y-2">
      <div class="flex items-center justify-between text-xs font-bold text-amber-400 font-mono">
        <span>#${idx + 1} ${w.authorOrTone ? `· ${escapeHtml(w.authorOrTone)}` : ''}</span>
      </div>
      <p class="text-sm sm:text-base text-stone-100 leading-relaxed font-medium">
        "${escapeHtml(w.hindiText)}"
      </p>
    </div>
  `
    )
    .join('');

  const faqsHtml =
    cat.faqs && cat.faqs.length > 0
      ? `
    <section class="space-y-4 my-8" aria-labelledby="faq-heading">
      <h2 id="faq-heading" class="text-lg sm:text-xl font-bold text-white font-serif">
        अक्सर पूछे जाने वाले सवाल (FAQs)
      </h2>
      <div class="space-y-3">
        ${cat.faqs
          .map(
            faq => `
          <div class="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
            <h3 class="text-xs sm:text-sm font-bold text-stone-200 mb-1.5">${escapeHtml(faq.question)}</h3>
            <p class="text-xs sm:text-sm text-stone-400 leading-relaxed">${escapeHtml(faq.answer)}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </section>
  `
      : '';

  const relatedHtml = `
    <section class="space-y-3 pt-6 border-t border-stone-800 my-8">
      <h2 class="text-xs font-bold text-stone-400 uppercase tracking-wider">
        अन्य संबंधित शुभकामनाएं व पर्व (Related Wishes):
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        ${cat.relatedSlugs
          .map(rSlug => {
            const relCat = getCategoryBySlug(rSlug);
            if (!relCat) return '';
            return `
            <a href="/${relCat.slug}/" class="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-400/50 text-left block">
              <span class="text-xs font-semibold text-stone-200 block truncate">${relCat.theme.accentEmoji} ${escapeHtml(relCat.nameHi)}</span>
              <span class="text-[10px] text-stone-500 block truncate">${escapeHtml(relCat.nameEn)}</span>
            </a>
          `;
          })
          .join('')}
      </div>
    </section>
  `;

  return `
    <div class="min-h-screen bg-stone-950 text-stone-100 pb-16 selection:bg-amber-600 selection:text-white">
      <header class="border-b border-amber-500/20 bg-stone-950/95 sticky top-0 z-40 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" class="flex items-center gap-2 text-white font-bold font-serif text-lg">
            <span>🪔</span>
            <span class="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Shubhakamna.in</span>
          </a>
          <nav class="hidden sm:flex items-center gap-4 text-xs text-stone-300">
            <a href="/birthday-wishes/" class="hover:text-amber-400">जन्मदिन</a>
            <a href="/diwali-wishes/" class="hover:text-amber-400">दीपावली</a>
            <a href="/holi-wishes/" class="hover:text-amber-400">होली</a>
            <a href="/good-morning-wishes/" class="hover:text-amber-400">सुप्रभात</a>
          </nav>
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        ${breadcrumbsHtml}

        <article class="space-y-6">
          <header class="space-y-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <span>${cat.theme.accentEmoji}</span>
              <span>${escapeHtml(cat.nameEn)}</span>
            </span>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-serif">
              ${escapeHtml(cat.h1)}
            </h1>
            <p class="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              ${escapeHtml(cat.intro)}
            </p>
          </header>

          ${childLinksHtml}

          <section class="space-y-4 my-6">
            <h2 class="text-lg sm:text-xl font-bold text-white font-serif">
              सर्वश्रेष्ठ ${escapeHtml(cat.nameHi)} संदेश व शायरी
            </h2>
            ${wishesHtml}
          </section>

          ${faqsHtml}

          ${relatedHtml}
        </article>
      </main>

      <footer class="mt-16 border-t border-stone-800 bg-stone-950 py-8 px-4 text-center text-xs text-stone-500">
        <p>© 2026 Shubhakamna.in · भारत का आधिकारिक शुभकामना द्वार</p>
      </footer>
    </div>
  `;
}

function buildCategoryStructuredData(cat: WishCategory): string {
  const canonicalUrl = `${SITE_ORIGIN}/${cat.slug}/`;

  const breadcrumbsList = getBreadcrumbTrail(cat).map((b, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: b.name,
    item: `${SITE_ORIGIN}${b.url}`
  }));

  const schemaGraph: any[] = [
    {
      '@type': 'WebPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      name: cat.seoTitle,
      description: cat.metaDescription,
      inLanguage: 'hi',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        name: 'Shubhakamna.in',
        url: `${SITE_ORIGIN}/`
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbsList
      }
    }
  ];

  if (cat.faqs && cat.faqs.length > 0) {
    schemaGraph.push({
      '@type': 'FAQPage',
      mainEntity: cat.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph }, null, 2);
}

function run() {
  console.log('🚀 Starting Static Site Generation (SSG) for SEO Landing Pages...');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory does not exist! Please run "vite build" first.');
    process.exit(1);
  }

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ dist/index.html not found! Aborting.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // 1. Generate Static Landing Page for each category
  WISH_CATEGORIES.forEach(cat => {
    const pageDir = path.join(distDir, cat.slug);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    const canonicalUrl = `${SITE_ORIGIN}/${cat.slug}/`;
    const crawlableHtml = buildCategoryCrawlableHtml(cat);
    const jsonLd = buildCategoryStructuredData(cat);

    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(cat.seoTitle)}</title>`);

    // Replace or Inject Meta Description
    html = html.replace(
      /<meta\s+name=["']description["'][\s\S]*?>/i,
      `<meta name="description" content="${escapeHtml(cat.metaDescription)}" />`
    );

    // Replace or Inject Meta Keywords
    const keywordsStr = cat.keywords.join(', ');
    html = html.replace(
      /<meta\s+name=["']keywords["'][\s\S]*?>/i,
      `<meta name="keywords" content="${escapeHtml(keywordsStr)}" />`
    );

    // Replace Canonical
    html = html.replace(
      /<link\s+rel=["']canonical["'][\s\S]*?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );

    // Replace OpenGraph Title & Description
    html = html.replace(
      /<meta\s+property=["']og:title["'][\s\S]*?>/i,
      `<meta property="og:title" content="${escapeHtml(cat.seoTitle)}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["'][\s\S]*?>/i,
      `<meta property="og:description" content="${escapeHtml(cat.metaDescription)}" />`
    );

    // Inject og:url and og:image if present
    html = html.replace(
      /<meta\s+property=["']og:type["'][\s\S]*?>/i,
      `<meta property="og:type" content="article" />\n    <meta property="og:url" content="${canonicalUrl}" />\n    <meta property="og:image" content="${cat.heroImageUrl}" />`
    );

    // Inject JSON-LD Schema
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="seo-json-ld">\n${jsonLd}\n    </script>\n  </head>`
    );

    // Inject crawlable semantic HTML into #root
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${crawlableHtml}</div>`
    );

    const outPath = path.join(pageDir, 'index.html');
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`✅ Generated: /${cat.slug}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
  });

  // 1B. Generate Static Pages for About Us, Privacy Policy, Contact Us
  const staticPages = [
    {
      slug: 'about',
      title: 'About Us | Shubhakamna.in - Independent Festive & Greeting Platform',
      description: 'Learn about Shubhakamna.in, an independent online platform dedicated to providing easy-to-understand festival greetings, cultural guides, and helpful content.',
      h1: 'About Shubhakamna.in',
      body: `
        <article class="max-w-4xl mx-auto py-8 px-4 text-stone-200 space-y-6">
          <nav aria-label="Breadcrumb" class="text-xs text-stone-400 mb-4"><a href="/" class="hover:underline">Home</a> &gt; <span class="text-amber-300">About Us</span></nav>
          <h1 class="text-3xl font-bold text-white font-serif">About Shubhakamna.in</h1>
          <p class="text-stone-300 leading-relaxed">Shubhakamna.in is an independent, digital platform dedicated to making festive greetings, cultural traditions, shubh muhurats, and meaningful messages simple, accessible, and enjoyable for everyone.</p>
          <h2 class="text-xl font-bold text-amber-300 font-serif">Our Mission and Purpose</h2>
          <p class="text-stone-300 leading-relaxed">Shubhakamna.in was created with a clear objective: to offer a clean, reliable, and user-friendly destination where visitors can find thoughtfully written festival wishes, heartfelt greeting messages for personal milestones, and accurate cultural insights.</p>
          <h2 class="text-xl font-bold text-amber-300 font-serif">Independence & Third-Party Disclosure</h2>
          <p class="text-stone-300 leading-relaxed">Shubhakamna.in is an independently created and operated informational website. We are not affiliated with, endorsed by, or partnered with Google LLC, Meta, or any other corporation unless explicitly mentioned.</p>
          <p class="text-stone-300 leading-relaxed">Official Contact Email: <a href="mailto:mthawkar72@gmail.com" class="text-amber-400 underline">mthawkar72@gmail.com</a></p>
        </article>
      `
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy | Shubhakamna.in - Transparent Data & Cookie Policy',
      description: 'Read the official Privacy Policy for Shubhakamna.in. Learn how we handle visitor information, cookies, Google AdSense, analytics, and user privacy rights.',
      h1: 'Privacy Policy',
      body: `
        <article class="max-w-4xl mx-auto py-8 px-4 text-stone-200 space-y-6">
          <nav aria-label="Breadcrumb" class="text-xs text-stone-400 mb-4"><a href="/" class="hover:underline">Home</a> &gt; <span class="text-amber-300">Privacy Policy</span></nav>
          <h1 class="text-3xl font-bold text-white font-serif">Privacy Policy</h1>
          <p class="text-stone-300 leading-relaxed">At Shubhakamna.in, accessible from https://shubhakamna.in, protecting the privacy and personal data of our visitors is one of our primary priorities. This Privacy Policy document outlines the types of information that may be collected, recorded, and how we use it.</p>
          <h2 class="text-xl font-bold text-amber-300 font-serif">1. Information We May Collect</h2>
          <p class="text-stone-300 leading-relaxed">We may collect information provided voluntarily (such as names entered into greeting cards or emails sent to our contact address) and standard log file information including browser type, device type, approximate geographic location, IP address, and date/time stamps.</p>
          <h2 class="text-xl font-bold text-amber-300 font-serif">2. Google AdSense & Third-Party Advertising</h2>
          <p class="text-stone-300 leading-relaxed">Advertisements may be displayed on our website through third-party advertising partners, including Google AdSense. Google uses cookies, including DART cookies, to serve ads based upon visits to this and other websites on the internet. Visitors may manage ad preferences at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener" class="text-amber-400 underline">policies.google.com/technologies/ads</a>.</p>
          <h2 class="text-xl font-bold text-amber-300 font-serif">3. Contact Information</h2>
          <p class="text-stone-300 leading-relaxed">For questions regarding our Privacy Policy, contact us at: <a href="mailto:mthawkar72@gmail.com" class="text-amber-400 underline">mthawkar72@gmail.com</a></p>
        </article>
      `
    },
    {
      slug: 'contact',
      title: 'Contact Us | Shubhakamna.in - Official Support & Feedback',
      description: 'Contact the Shubhakamna.in team for questions regarding website content, corrections, feedback, technical assistance, privacy, or advertising inquiries.',
      h1: 'Contact Us',
      body: `
        <article class="max-w-4xl mx-auto py-8 px-4 text-stone-200 space-y-6">
          <nav aria-label="Breadcrumb" class="text-xs text-stone-400 mb-4"><a href="/" class="hover:underline">Home</a> &gt; <span class="text-amber-300">Contact Us</span></nav>
          <h1 class="text-3xl font-bold text-white font-serif">Contact Us</h1>
          <p class="text-stone-300 leading-relaxed">We welcome questions, suggestions, feedback, and inquiries from our readers and partners.</p>
          <div class="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-2">
            <h2 class="text-lg font-bold text-amber-300">Official Contact Email</h2>
            <p class="text-stone-200 text-lg font-mono"><a href="mailto:mthawkar72@gmail.com" class="text-amber-400 underline">mthawkar72@gmail.com</a></p>
            <p class="text-xs text-stone-400">Please email us for content questions, factual corrections, technical support, privacy inquiries, or advertising concerns.</p>
          </div>
        </article>
      `
    }
  ];

  staticPages.forEach(sp => {
    const pageDir = path.join(distDir, sp.slug);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    let html = baseHtml;
    const canonicalUrl = `${SITE_ORIGIN}/${sp.slug}/`;

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(sp.title)}</title>`);
    html = html.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${escapeHtml(sp.description)}" />`);
    html = html.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
    html = html.replace(/<meta\s+property=["']og:title["'][\s\S]*?>/i, `<meta property="og:title" content="${escapeHtml(sp.title)}" />`);
    html = html.replace(/<meta\s+property=["']og:description["'][\s\S]*?>/i, `<meta property="og:description" content="${escapeHtml(sp.description)}" />`);
    html = html.replace(/<div id="root"><\/div>/, `<div id="root">${sp.body}</div>`);

    const outPath = path.join(pageDir, 'index.html');
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`✅ Generated: /${sp.slug}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
  });

  // 2. Generate sitemap.xml
  console.log('📄 Generating sitemap.xml...');
  const today = new Date().toISOString().slice(0, 10);
  const sitemapUrls = [
    `  <url>\n    <loc>${SITE_ORIGIN}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    `  <url>\n    <loc>${SITE_ORIGIN}/about/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    `  <url>\n    <loc>${SITE_ORIGIN}/privacy-policy/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    `  <url>\n    <loc>${SITE_ORIGIN}/contact/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    ...WISH_CATEGORIES.map(
      cat => `  <url>\n    <loc>${SITE_ORIGIN}/${cat.slug}/</loc>\n    <lastmod>${cat.updatedAt || today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${cat.parentSlug ? '0.8' : '0.9'}</priority>\n  </url>`
    )
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`✅ Generated: sitemap.xml (${sitemapUrls.length} indexable URLs)`);

  // 3. Generate robots.txt
  console.log('🤖 Generating robots.txt...');
  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('✅ Generated: robots.txt');

  // 4. Generate Cloudflare Pages _headers
  console.log('⚡ Generating Cloudflare Pages _headers...');
  const headersContent = `# Cloudflare Pages Performance & Security Headers
/ads.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600
  Access-Control-Allow-Origin: *

/robots.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=86400

/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=86400

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
`;
  fs.writeFileSync(path.join(distDir, '_headers'), headersContent, 'utf-8');

  // If a legacy _redirects exists in dist, delete it to prevent Cloudflare redirect loop errors
  const legacyRedirectsPath = path.join(distDir, '_redirects');
  if (fs.existsSync(legacyRedirectsPath)) {
    fs.unlinkSync(legacyRedirectsPath);
  }

  console.log('🎉 Static Site Generation (SSG) Completed Successfully!');
}

run();
