const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const { getDb } = require('./db');
const { createApiRouter } = require('./routes');
const os = require('os');

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());
  app.use(express.json({ limit: '15mb' })); // Support base64 signatures
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // WebSocket Server
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Set();

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Connected to KAJURIN Realtime Hub' }));

    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('error', (err) => {
      console.error('WebSocket client error:', err);
      clients.delete(ws);
    });
  });

  const broadcast = (data) => {
    const payload = JSON.stringify(data);
    for (const client of clients) {
      if (client.readyState === 1) { // OPEN
        client.send(payload);
      }
    }
  };

  // Database initialization
  const db = await getDb();

  // API Routes
  app.use('/api', createApiRouter(db, broadcast));

  // Serve static assets from frontend build if it exists
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));

  // Client-side routing fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
      return next();
    }
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head><title>KAJURIN Server</title><meta charset="utf-8"></head>
            <body style="font-family:sans-serif; text-align:center; padding:50px;">
              <h2>Sistem KAJURIN Sedang Dipersiapkan</h2>
              <p>Frontend sedang dikompilasi atau dapat dijalankan via <code>npm run dev</code>.</p>
              <p>API Endpoint aktif di <a href="/api/items">/api/items</a></p>
            </body>
          </html>
        `);
      }
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 KAJURIN - Sistem Peminjaman Inventaris Ruang Kajur`);
    console.log(`====================================================`);
    console.log(`💻 Desktop PC Kajur: http://localhost:${PORT}`);

    // Print Wi-Fi addresses
    const interfaces = os.networkInterfaces();
    let hasWifi = false;
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          console.log(`📱 HP / Wi-Fi Lokal (${name}): http://${iface.address}:${PORT}`);
          hasWifi = true;
        }
      }
    }
    if (!hasWifi) {
      console.log(`📱 HP / Wi-Fi Lokal: Akses IP komputer ini pada port ${PORT}`);
    }
    console.log(`====================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start KAJURIN server:', err);
  process.exit(1);
});

