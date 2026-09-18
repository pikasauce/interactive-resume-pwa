const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml' };
http.createServer((req, res) => { const requestPath = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]); const filePath = path.resolve(root, `.${requestPath}`); if (!filePath.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); } fs.readFile(filePath, (error, data) => { if (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' }); return res.end(error.code === 'ENOENT' ? 'Not found' : 'Server error'); } res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); return res.end(data); }); }).listen(PORT, () => console.log(`Resume PWA running at http://localhost:${PORT}`));
