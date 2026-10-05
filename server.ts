import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  app.post('/api/gdrive/fetch-folder-photos', async (req, res) => {
    try {
      const { folderUrlOrId, festivalName = 'पावन उत्सव' } = req.body || {};
      if (!folderUrlOrId || typeof folderUrlOrId !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: 'कृपया Google Drive फ़ोल्डर का लिंक दर्ज करें।' 
        });
      }

      // Extract folder ID
      const trimmed = folderUrlOrId.trim();
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
        return res.status(400).json({ 
          success: false, 
          message: 'अमान्य Google Drive लिंक! कृपया सही फ़ोल्डर URL या ID दर्ज करें।' 
        });
      }

      const fileIds = new Set<string>();

      // Fetch targets: embedded view & standard folder view
      const targetUrls = [
        `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
        `https://drive.google.com/drive/folders/${folderId}`
      ];

      for (const targetUrl of targetUrls) {
        try {
          const fetchRes = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'hi,en-US,en;q=0.9'
            }
          });

          if (fetchRes.ok) {
            const html = await fetchRes.text();

            // Extract pattern 1: lh3.googleusercontent.com/d/FILE_ID
            const lh3Matches = html.matchAll(/googleusercontent\.com\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]{20,50})/g);
            for (const m of lh3Matches) {
              if (m[1] && m[1] !== folderId) fileIds.add(m[1]);
            }

            // Extract pattern 2: drive.google.com/thumbnail?id=FILE_ID
            const thumbMatches = html.matchAll(/thumbnail\?(?:[^"'\s]*&)*id=([a-zA-Z0-9_-]{20,50})/g);
            for (const m of thumbMatches) {
              if (m[1] && m[1] !== folderId) fileIds.add(m[1]);
            }

            // Extract pattern 3: data-id="FILE_ID"
            const dataIdMatches = html.matchAll(/data-id="([a-zA-Z0-9_-]{20,50})"/g);
            for (const m of dataIdMatches) {
              if (m[1] && m[1] !== folderId) fileIds.add(m[1]);
            }

            // Extract pattern 4: /file/d/FILE_ID
            const fileDMatches = html.matchAll(/\/file\/d\/([a-zA-Z0-9_-]{20,50})/g);
            for (const m of fileDMatches) {
              if (m[1] && m[1] !== folderId) fileIds.add(m[1]);
            }

            // Extract pattern 5: JSON array entries like ["FILE_ID", ["image/...
            const jsonImgMatches = html.matchAll(/\[["']([a-zA-Z0-9_-]{25,50})["'],\[["']image\//g);
            for (const m of jsonImgMatches) {
              if (m[1] && m[1] !== folderId) fileIds.add(m[1]);
            }

            // Extract pattern 6: Standard Drive ID patterns in JS arrays
            const jsIdMatches = html.matchAll(/["']([a-zA-Z0-9_-]{28,45})["']/g);
            for (const m of jsIdMatches) {
              const id = m[1];
              if (id !== folderId && !id.includes('http') && !id.includes('googleapis') && !id.includes('gstatic') && !id.includes('drive_') && !id.includes('viewer')) {
                // Keep only valid Google Drive file ID lengths
                if (/^[a-zA-Z0-9_-]{28,40}$/.test(id)) {
                  fileIds.add(id);
                }
              }
            }
          }
        } catch (fetchErr) {
          console.warn(`Error fetching ${targetUrl}:`, fetchErr);
        }
      }

      const uniqueIds = Array.from(fileIds);

      if (uniqueIds.length === 0) {
        return res.json({
          success: false,
          folderId,
          count: 0,
          photos: [],
          message: 'फ़ोल्डर में कोई फ़ोटो नहीं मिली या फ़ोल्डर प्राइवेट है। कृपया Google Drive में फ़ोल्डर शेयरिंग "Anyone with the link can view" (कोई भी देख सकता है) पर सेट करें।'
        });
      }

      const photos = uniqueIds.map((fileId, idx) => ({
        id: `gdrive_${fileId}_${idx + 1}`,
        fileId,
        imageUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`,
        title: `${festivalName} • पावन दर्शन #${idx + 1}`,
        godName: festivalName ? `${festivalName} पावन दर्शन` : 'दिव्य स्वरूप',
        tagline: 'भक्तों की सभी मनोकामना पूर्ण करने वाले पावन स्वरूप',
        badge: idx === 0 ? '✨ मुख्य दर्शन' : '🌸 पावन दर्शन',
        mantra: '॥ ॐ श्री गणेशाय नमः ॥'
      }));

      console.log(`[Google Drive Folder] Successfully extracted ${photos.length} photos for ${festivalName} (Folder: ${folderId})`);

      return res.json({
        success: true,
        folderId,
        count: photos.length,
        photos,
        message: `सफलता! Google Drive फ़ोल्डर से ${photos.length} फ़ोटो लोड हो गईं! 📸`
      });
    } catch (err: any) {
      console.error('Error fetching Google Drive folder photos:', err);
      return res.status(500).json({ 
        success: false, 
        message: `फ़ोल्डर लोड करने में त्रुटि: ${err.message || 'Unknown error'}` 
      });
    }
  });

  // ==========================================
  // VITE DEV MIDDLEWARE / STATIC ASSETS
  // ==========================================
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (!isProduction && !hasDist) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      const targetFile = path.join(distPath, 'index.html');
      if (fs.existsSync(targetFile)) {
        res.sendFile(targetFile);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>Shubhakamna</title></head><body><div id="root"></div></body></html>');
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`✨ Shubhakamna Server running at http://localhost:${PORT} (${isProduction ? 'Production' : 'Development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
