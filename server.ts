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
  // VITE DEV MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`✨ Shubhakamna Server running at http://localhost:${PORT} (${isProduction ? 'Production' : 'Development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
