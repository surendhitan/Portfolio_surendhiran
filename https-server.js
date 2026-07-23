/**
 * =====================================================
 * HTTPS Server — TLS/SSL Portfolio Server
 * Domain  : https://surendhiran.dev.com
 * Certs   : ./ssl/surendhiran.dev.com.crt / .key
 * =====================================================
 */

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');

// ── Config ────────────────────────────────────────────
const HTTPS_PORT  = 443;
const HTTP_PORT   = 80;
const DOMAIN      = 'surendhiran.dev.com';
const STATIC_DIR  = __dirname;

// ── SSL Certificate Paths ─────────────────────────────
const SSL_CERT = path.join(__dirname, 'ssl', 'surendhiran.dev.com.crt');
const SSL_KEY  = path.join(__dirname, 'ssl', 'surendhiran.dev.com.key');

// ── MIME Types ────────────────────────────────────────
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

// ── Static File Handler ───────────────────────────────
function serveStatic(req, res) {
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

    // ── Security Headers (TLS best-practice) ──
    res.writeHead(200, {
      'Content-Type'              : mimeType,
      'Strict-Transport-Security' : 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options'    : 'nosniff',
      'X-Frame-Options'           : 'DENY',
      'X-XSS-Protection'          : '1; mode=block',
      'Referrer-Policy'           : 'strict-origin-when-cross-origin',
      'Content-Security-Policy'   : "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'",
      'Cache-Control'             : ext === '.html' ? 'no-cache' : 'public, max-age=2592000',
    });
    res.end(data);
  });
}

// ── HTTP → HTTPS Redirect (ALL traffic → surendhiran.dev.com) ──
http.createServer((req, res) => {
  res.writeHead(301, {
    Location: `https://${DOMAIN}${req.url}`
  });
  res.end();
}).listen(HTTP_PORT, () => {
  console.log(`[HTTP ] :${HTTP_PORT} → redirects all traffic to https://${DOMAIN}/`);
});

// ── HTTPS Main Server ─────────────────────────────────
const tlsOptions = {
  cert: fs.readFileSync(SSL_CERT),
  key : fs.readFileSync(SSL_KEY),
  minVersion      : 'TLSv1.2',
  honorCipherOrder: true,
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256',
  ].join(':'),
};

https.createServer(tlsOptions, serveStatic).listen(HTTPS_PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   🔒  HTTPS SERVER — TLS/SSL ENABLED                 ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║                                                      ║');
  console.log(`║   🌐  https://surendhiran.dev.com/                   ║`);
  console.log('║                                                      ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║   Protocol : TLS 1.2 + TLS 1.3                      ║');
  console.log('║   HSTS     : max-age=31536000; preload               ║');
  console.log('║   Port 80  : HTTP  → redirects to HTTPS             ║');
  console.log('║   Port 443 : HTTPS → https://surendhiran.dev.com/   ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
});
