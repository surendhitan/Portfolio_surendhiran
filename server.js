/**
 * ─────────────────────────────────────────
 *  Local HTTP Server  →  Public via Tunnel
 *  Port : 3000
 * ─────────────────────────────────────────
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT       = process.env.PORT || 3000;
const STATIC_DIR = __dirname;

const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.css'  : 'text/css',
  '.js'   : 'application/javascript',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.png'  : 'image/png',
  '.svg'  : 'image/svg+xml',
  '.ico'  : 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff' : 'font/woff',
  '.ttf'  : 'font/ttf',
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(STATIC_DIR, urlPath);
  const ext      = path.extname(filePath).toLowerCase();
  const mimeType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(STATIC_DIR, 'index.html'), (e2, html) => {
        if (e2) { res.writeHead(404); res.end('404 Not Found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      });
      return;
    }
    res.writeHead(200, {
      'Content-Type'              : mimeType,
      'X-Content-Type-Options'    : 'nosniff',
      'X-Frame-Options'           : 'DENY',
      'Bypass-Tunnel-Reminder'    : '1',
      'Cache-Control'             : ext === '.html' ? 'no-cache' : 'public, max-age=2592000',
    });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`✅ Local server running → http://localhost:${PORT}`);
  console.log(`   Waiting for tunnel URL...`);
});
