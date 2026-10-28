// Renders the résumé page with its print stylesheet into a shareable PDF.
// Usage: node scripts/pdf/generate-resume-pdf.js   (or: npm run build:pdf)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const root = path.resolve(__dirname, '../../apps/resume-ui');
const output = path.join(root, 'Enrique-Pujol-Resume.pdf');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

// Own static server on a free port so this never collides with `npm run dev`.
const server = http.createServer((req, res) => {
  const requestPath = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.resolve(root, `.${requestPath}`);
  if (!filePath.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(filePath, (error, data) => {
    if (error) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, resolve));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${server.address().port}/`);
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: output, format: 'Letter', printBackground: true, scale: 0.75, margin: { top: '0.5in', bottom: '0.5in', left: '0.6in', right: '0.6in' } });
    console.log(`Wrote ${path.relative(process.cwd(), output)}`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
