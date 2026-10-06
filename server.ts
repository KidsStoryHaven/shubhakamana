import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { 
  startBackendSchedule, 
  stopBackendSchedule, 
  loadScheduleState, 
  generateWatermarkedCardSvg,
  processNextScheduledPin,
  resolvePinterestBoardId
} from './src/services/pinterestBackendService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();

  // JSON Body parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const dataFilePath = path.join(__dirname, 'public', 'site-data.json');
  const distDataFilePath = path.join(__dirname, 'dist', 'site-data.json');

  // ==========================================
  // REST API: GLOBAL SITE DATA SYNC
  // ==========================================

  // GET /api/site-data
  app.get('/api/site-data', (req, res) => {
    try {
      if (fs.existsSync(dataFilePath)) {
        const raw = fs.readFileSync(dataFilePath, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        return res.send(raw);
      }
      return res.json({ success: false, message: 'No custom site data found yet' });
    } catch (err) {
      console.error('Error reading site data:', err);
      return res.status(500).json({ error: 'Failed to read site data' });
    }
  });

  // POST /api/site-data
  app.post('/api/site-data', (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'Invalid payload' });
      }

      const timestamp = new Date().toISOString();
      const dataToSave = {
        ...payload,
        updatedAt: timestamp
      };

      // Ensure public directory exists
      const publicDir = path.join(__dirname, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // Write to public/site-data.json
      fs.writeFileSync(dataFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');

      // Also write to dist/site-data.json if dist exists
      const distDir = path.join(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(distDataFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      }

      console.log(`[Global Site Data] Successfully updated & persisted at ${timestamp}`);
      return res.json({ 
        success: true, 
        message: 'Global site data persisted successfully to server & public/site-data.json',
        updatedAt: timestamp 
      });
    } catch (err) {
      console.error('Error writing site data:', err);
      return res.status(500).json({ error: 'Failed to write site data' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // ==========================================
  // GOOGLE DRIVE PUBLIC FOLDER PHOTO FETCHER
  // ==========================================
  const handleFetchGdriveFolder = async (folderInput: string, festivalNameInput: string = 'पावन उत्सव') => {
    const trimmed = folderInput.trim();
    let folderId: string | null = null;
    const m1 = trimmed.match(/\/folders\/([a-zA-Z0-9_-]{15,})/i);
    if (m1 && m1[1]) folderId = m1[1];
    if (!folderId) {
      const m2 = trimmed.match(/embeddedfolderview\?(?:[^&]*&)*id=([a-zA-Z0-9_-]{15,})/i);
      if (m2 && m2[1]) folderId = m2[1];
    }
    if (!folderId && (trimmed.includes('folders') || trimmed.includes('folder'))) {
      const m3 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{15,})/i);
      if (m3 && m3[1]) folderId = m3[1];
    }
    if (!folderId && /^[a-zA-Z0-9_-]{25,60}$/.test(trimmed)) {
      folderId = trimmed;
    }

    if (!folderId) {
      return { 
        success: false, 
        count: 0,
        photos: [],
        message: 'अमान्य Google Drive लिंक! कृपया सही फ़ोल्डर URL या ID दर्ज करें।' 
      };
    }

    const itemsMap = new Map<string, string>(); // fileId -> title

    // 1. Fetch embedded view with no-cache (Primary, 100% accurate file listing)
    try {
      const embeddedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}&_t=${Date.now()}#grid`;
      const fetchRes = await fetch(embeddedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (fetchRes.ok) {
        const html = await fetchRes.text();

        // Extract pattern: entry-FILE_ID paired with title in embedded grid view
        const entryWithTitleMatches = html.matchAll(/id=["']entry-([a-zA-Z0-9_-]{20,50})["'][\s\S]*?<div[^>]*class=["']flip-entry-title["'][^>]*>([^<]+)<\/div>/g);
        for (const m of entryWithTitleMatches) {
          const fId = m[1];
          const title = m[2]?.trim();
          if (fId && fId !== folderId) {
            itemsMap.set(fId, title || '');
          }
        }

        // Secondary extract: all id="entry-FILE_ID"
        const entryMatches = html.matchAll(/id=["']entry-([a-zA-Z0-9_-]{20,50})["']/g);
        for (const m of entryMatches) {
          if (m[1] && m[1] !== folderId && !itemsMap.has(m[1])) {
            itemsMap.set(m[1], '');
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching embeddedfolderview:', err);
    }

    // 2. Fallback to standard drive folder url only if embedded view found 0 files
    if (itemsMap.size === 0) {
      try {
        const standardUrl = `https://drive.google.com/drive/folders/${folderId}?_t=${Date.now()}`;
        const fetchRes = await fetch(standardUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });

        if (fetchRes.ok) {
          const html = await fetchRes.text();

          const lh3Matches = html.matchAll(/googleusercontent\.com\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]{20,50})/g);
          for (const m of lh3Matches) {
            if (m[1] && m[1] !== folderId && !itemsMap.has(m[1])) itemsMap.set(m[1], '');
          }

          const fileDMatches = html.matchAll(/\/file\/d\/([a-zA-Z0-9_-]{20,50})/g);
          for (const m of fileDMatches) {
            if (m[1] && m[1] !== folderId && !itemsMap.has(m[1])) itemsMap.set(m[1], '');
          }
        }
      } catch (err) {
        console.warn('Error fetching standard drive folder:', err);
      }
    }

    const entries = Array.from(itemsMap.entries());

    if (entries.length === 0) {
      return {
        success: false,
        folderId,
        count: 0,
        photos: [],
        message: 'फ़ोल्डर में कोई फ़ोटो नहीं मिली या फ़ोल्डर प्राइवेट है। कृपया Google Drive में फ़ोल्डर शेयरिंग "Anyone with the link can view" (कोई भी देख सकता है) पर सेट करें।'
      };
    }

    const photos = entries.map(([fileId, customFileName], idx) => {
      let cleanTitle = customFileName ? customFileName.replace(/\.[a-zA-Z0-9]+$/, '').replace(/[_-]/g, ' ') : '';
      if (!cleanTitle || cleanTitle.length > 50) {
        cleanTitle = `${festivalNameInput} • पावन दर्शन #${idx + 1}`;
      }

      return {
        id: `gdrive_${fileId}_${idx + 1}`,
        fileId,
        imageUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`,
        title: cleanTitle,
        godName: festivalNameInput ? `${festivalNameInput} पावन दर्शन` : 'दिव्य स्वरूप',
        tagline: 'भक्तों की सभी मनोकामना पूर्ण करने वाले पावन स्वरूप',
        badge: idx === 0 ? '✨ मुख्य दर्शन' : '🌸 पावन दर्शन',
        mantra: '॥ ॐ श्रीं ह्रीं क्लीं ॥'
      };
    });

    console.log(`[Google Drive Folder] Successfully extracted ${photos.length} photos for ${festivalNameInput} (Folder: ${folderId})`);

    // Auto-update persistent cache in site-data.json for instant delivery
    try {
      const siteFiles = [path.join(__dirname, 'public', 'site-data.json'), path.join(__dirname, 'dist', 'site-data.json')];
      for (const sf of siteFiles) {
        if (fs.existsSync(sf)) {
          const raw = fs.readFileSync(sf, 'utf-8');
          const data = JSON.parse(raw);
          if (!data.deitySlides) data.deitySlides = {};
          // Find matching festival ID
          let matchedFestId = 'dhammachakra_pravartan';
          if (data.festivals && Array.isArray(data.festivals)) {
            const f = data.festivals.find((x: any) => x.gdriveFolderUrl && x.gdriveFolderUrl.includes(folderId!));
            if (f) {
              matchedFestId = f.id;
              f.heroImage = photos[0].imageUrl;
            }
          }
          data.deitySlides[matchedFestId] = photos;
          data.updatedAt = new Date().toISOString();
          fs.writeFileSync(sf, JSON.stringify(data, null, 2), 'utf-8');
        }
      }
    } catch (cacheErr) {
      console.warn('Error updating site-data.json cache:', cacheErr);
    }

    return {
      success: true,
      folderId,
      count: photos.length,
      photos,
      message: `सफलता! Google Drive फ़ोल्डर से ${photos.length} फ़ोटो लोड हो गईं! 📸`
    };
  };

  app.get('/api/gdrive/fetch-folder-photos', async (req, res) => {
    try {
      const folderUrlOrId = (req.query.folderUrlOrId || req.query.folderId || req.query.url) as string;
      const festivalName = (req.query.festivalName || 'पावन उत्सव') as string;
      if (!folderUrlOrId) {
        return res.status(400).json({ success: false, message: 'folderUrlOrId parameter is required' });
      }
      const result = await handleFetchGdriveFolder(folderUrlOrId, festivalName);
      return res.json(result);
    } catch (err: any) {
      console.error('Error fetching Google Drive folder photos (GET):', err);
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  });

  app.post('/api/gdrive/fetch-folder-photos', async (req, res) => {
    try {
      const { folderUrlOrId, festivalName = 'पावन उत्सव' } = req.body || {};
      if (!folderUrlOrId || typeof folderUrlOrId !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: 'कृपया Google Drive फ़ोल्डर का लिंक दर्ज करें।' 
        });
      }
      const result = await handleFetchGdriveFolder(folderUrlOrId, festivalName);
      return res.json(result);
    } catch (err: any) {
      console.error('Error fetching Google Drive folder photos (POST):', err);
      return res.status(500).json({ 
        success: false, 
        message: `फ़ोल्डर लोड करने में त्रुटि: ${err.message || 'Unknown error'}` 
      });
    }
  });

  // ==========================================
  // PINTEREST AUTO-PUBLISHER API (Pinterest API v5)
  // ==========================================
  app.post('/api/pinterest/publish-pin', async (req, res) => {
    try {
      const { accessToken, boardId, title, description, link, imageUrl, imageBase64 } = req.body || {};

      if (!accessToken || !boardId) {
        return res.status(400).json({
          success: false,
          message: 'Pinterest Access Token (API Key) और Board ID आवश्यक हैं।'
        });
      }

      let mediaSource: any = {};
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        mediaSource = {
          source_type: 'image_base64',
          content_type: 'image/jpeg',
          data: cleanBase64
        };
      } else if (imageUrl) {
        mediaSource = {
          source_type: 'image_url',
          url: imageUrl
        };
      } else {
        return res.status(400).json({
          success: false,
          message: 'Pin बनाने के लिए फ़ोटो की URL या Image Base64 होना आवश्यक है।'
        });
      }

      const targetBoardId = await resolvePinterestBoardId(accessToken, boardId);

      const pinPayload = {
        board_id: targetBoardId,
        title: title || 'Shubhakamna.in - 3D Wish',
        description: description || 'www.shubhakamna.in',
        link: link || 'https://www.shubhakamna.in/',
        media_source: mediaSource
      };

      const response = await fetch('https://api.pinterest.com/v5/pins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pinPayload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Pinterest API error:', responseData);
        return res.status(response.status).json({
          success: false,
          message: responseData.message || responseData.error || 'Pinterest API error',
          details: responseData
        });
      }

      return res.json({
        success: true,
        pinId: responseData.id,
        link: responseData.link || `https://pinterest.com/pin/${responseData.id}`,
        data: responseData
      });

    } catch (err: any) {
      console.error('Pinterest Publish Pin server error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Server error while publishing to Pinterest'
      });
    }
  });

  // GET /api/pinterest/schedule-status
  app.get('/api/pinterest/schedule-status', (req, res) => {
    try {
      const state = loadScheduleState();
      return res.json({ success: true, state });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/pinterest/start-schedule
  app.post('/api/pinterest/start-schedule', (req, res) => {
    try {
      const { accessToken, boardId, intervalMinutes, promotionalPercentage } = req.body || {};
      if (!accessToken || !boardId) {
        return res.status(400).json({ success: false, message: 'Access Token और Board ID आवश्यक हैं।' });
      }
      const newState = startBackendSchedule({
        accessToken,
        boardId,
        intervalMinutes: Number(intervalMinutes) || 10,
        promotionalPercentage: Number(promotionalPercentage) || 15
      });
      return res.json({ success: true, message: 'Backend automated Pinterest scheduler started!', state: newState });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/pinterest/stop-schedule
  app.post('/api/pinterest/stop-schedule', (req, res) => {
    try {
      const newState = stopBackendSchedule();
      return res.json({ success: true, message: 'Backend Pinterest scheduler paused.', state: newState });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // POST /api/pinterest/trigger-next-pin
  app.post('/api/pinterest/trigger-next-pin', async (req, res) => {
    try {
      const state = await processNextScheduledPin();
      return res.json({ success: true, message: 'Triggered next scheduled pin!', state });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ==========================================
  // VITE DEV MIDDLEWARE / STATIC ASSETS & 3D OG PREVIEW INJECTOR
  // ==========================================
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  // SEO Canonical Normalization: 301 Redirect non-www to www to prevent duplicate indexing in Google
  app.use((req, res, next) => {
    const host = req.headers.host || '';
    if (host === 'shubhakamna.in') {
      return res.redirect(301, `https://www.shubhakamna.in${req.originalUrl || req.url}`);
    }
    next();
  });

  const isSocialCrawler = (userAgent: string = '') => {
    return /whatsapp|facebookexternalhit|twitterbot|telegrambot|linkedinbot|pinterest|slackbot|applebot|discordbot|googlebot/i.test(userAgent);
  };

  const getDynamicOGHtml = (reqUrl: string, userAgent: string, rawHtml: string) => {
    try {
      const urlObj = new URL(reqUrl, 'https://www.shubhakamna.in');
      let sender = urlObj.searchParams.get('n') || urlObj.searchParams.get('sender') || urlObj.searchParams.get('from') || '';
      let festId = urlObj.searchParams.get('f') || urlObj.searchParams.get('festival') || '';
      const bname = urlObj.searchParams.get('bname') || '';
      const customImg = urlObj.searchParams.get('img') || '';
      const w = urlObj.searchParams.get('w') || '';

      // Parse short code pattern ?w=Rahul_diwali or ?w=diwali
      if (w) {
        const parts = w.split('_');
        if (parts.length >= 2) {
          if (!sender) sender = parts[0];
          if (!festId) festId = parts[1];
        } else if (parts.length === 1) {
          if (!festId) festId = parts[0];
        }
      }

      const isShubhPrabhat = urlObj.pathname.includes('shubh-prabhat') || festId.includes('prabhat') || w.includes('prabhat');
      const isBirthday = festId.includes('birthday') || urlObj.pathname.includes('birthday') || w.includes('birthday');

      let title = '✨ Shubhakamna.in - 3D पावन शुभकामना पोर्टल';
      let description = '👉 तुरंत टच करके देखें आपके लिए क्या खास संदेश आया है! अपने नाम व फोटो का 4K स्टेटस बनाएँ ➔';
      let ogImage = customImg || 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&h=630&q=85';

      if (isBirthday) {
        const celebrant = bname || 'मित्र';
        title = sender 
          ? `🎂 ${sender} ने ${celebrant} के लिए भेजा है खास 3D बर्थडे सरप्राइज! 🎉`
          : `🎂 Happy Birthday ${celebrant}! • 3D जादुई बर्थडे सॉन्ग व कार्ड`;
        description = `👉 तुरंत टच करके सुनें ${celebrant} के नाम का स्पेशल बर्थडे गाना व 3D कार्ड ➔ www.shubhakamna.in`;
        if (!customImg) {
          ogImage = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&h=630&q=85';
        }
      } else if (isShubhPrabhat) {
        title = sender 
          ? `🌅 ${sender} ने आपके लिए आज का सुंदर 3D शुभ प्रभात सुविचार भेजा है! ✨`
          : '🌅 आज का पावन शुभ विचार • 3D सुविचार कार्ड | Shubhakamna.in';
        description = '👉 अपने नाम व फोटो का सुंदर 3D सुविचार स्टेटस बनाएँ और 1-क्लिक में WhatsApp पर शेयर करें ➔';
        if (!customImg) {
          ogImage = 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&h=630&q=85';
        }
      } else {
        let festName = 'पावन पर्व';

        // Dynamic lookup from site-data.json if exists
        try {
          if (fs.existsSync(dataFilePath)) {
            const rawSiteData = fs.readFileSync(dataFilePath, 'utf-8');
            const parsed = JSON.parse(rawSiteData);
            if (parsed.festivals && Array.isArray(parsed.festivals)) {
              const matched = parsed.festivals.find((f: any) => 
                (festId && f.id === festId) || 
                (f.slug && urlObj.pathname.includes(f.slug)) ||
                (f.id && urlObj.pathname.includes(f.id)) ||
                (festId && f.slug && f.slug.includes(festId))
              );
              if (matched) {
                festName = matched.nameHi || festName;
                if (!customImg && matched.heroImage) {
                  ogImage = matched.heroImage;
                }
              }
            }
          }
        } catch {}

        if (festId.includes('dhammachakra') || urlObj.pathname.includes('dhammachakra')) {
          festName = 'धम्मचक्र प्रवर्तन दिवस';
          if (!customImg) ogImage = 'https://lh3.googleusercontent.com/d/1fFyb7kQ-lczPPYGvfC5xLYkOEVAIkWjX';
        } else if (festId.includes('diwali') || urlObj.pathname.includes('diwali')) {
          festName = 'शुभ दीपावली';
        }

        title = sender 
          ? `✨ ${sender} ने आपके लिए भेजा है ${festName} का खास 3D जादुई सरप्राइज! 🎁`
          : `✨ ${festName} की हार्दिक शुभकामनाएँ • 3D विशिंग कार्ड | Shubhakamna.in`;
        description = `👉 इस नीले लिंक को तुरंत टच करके देखें आपके लिए क्या खास 3D संदेश आया है! अपने नाम व फोटो का 4K स्टेटस बनाएँ ➔`;
      }

      // Replace or inject meta tags
      let modifiedHtml = rawHtml;
      modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      modifiedHtml = modifiedHtml.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${title}" />`);
      modifiedHtml = modifiedHtml.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${description}" />`);
      modifiedHtml = modifiedHtml.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${ogImage}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />`);
      modifiedHtml = modifiedHtml.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${title}" />`);
      modifiedHtml = modifiedHtml.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${description}" />`);

      const canonicalUrl = `https://www.shubhakamna.in${urlObj.pathname}`;
      if (/<link rel="canonical" href=".*?" \/>/i.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
      } else {
        modifiedHtml = modifiedHtml.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
      }

      return modifiedHtml;
    } catch {
      return rawHtml;
    }
  };

  // Middleware to handle Social Crawlers (WhatsApp, Facebook, Twitter, etc.) in both Dev and Prod
  app.use(async (req, res, next) => {
    const userAgent = (req.headers['user-agent'] || req.headers['x-forwarded-user-agent'] || '') as string;
    const isCrawler = isSocialCrawler(userAgent);
    const hasShareQuery = !!(req.query.w || req.query.n || req.query.f || req.query.festival || req.query.bname || req.query.from);

    if (isCrawler || (hasShareQuery && req.headers.accept?.includes('text/html'))) {
      const templatePath = hasDist 
        ? path.join(distPath, 'index.html') 
        : path.join(__dirname, 'index.html');

      if (fs.existsSync(templatePath)) {
        let rawHtml = fs.readFileSync(templatePath, 'utf-8');
        const dynamicHtml = getDynamicOGHtml(req.originalUrl || req.url, userAgent, rawHtml);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(dynamicHtml);
      }
    }
    next();
  });

  if (!isProduction && !hasDist) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static assets from dist with 1-year immutable caching
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }
      }
    }));

    app.get('*', (req, res) => {
      const targetFile = path.join(distPath, 'index.html');
      if (fs.existsSync(targetFile)) {
        const rawHtml = fs.readFileSync(targetFile, 'utf-8');
        const userAgent = (req.headers['user-agent'] || '') as string;
        const html = getDynamicOGHtml(req.originalUrl || req.url, userAgent, rawHtml);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>Shubhakamna</title></head><body><div id="root"></div></body></html>');
      }
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✨ Shubhakamna Server running at http://0.0.0.0:${PORT} (${isProduction ? 'Production' : 'Development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
