const fs = require('fs');
let html = fs.readFileSync('out/index.html', 'utf8');
const orig = html;
// Next.js chunks have hashes that can contain letters, numbers, hyphens, AND underscores.
// Also, some chunks might have paths like _next/static/chunks/app/page-xxx.js
html = html.replace(/<script src="[^"]+\/_next\/static\/chunks\/[^"]+\.js"[^>]*><\/script>/g, '');
html = html.replace(/<link[^>]*rel="preload"[^>]*href="[^"]+\/_next\/static\/chunks\/[^"]+\.js"[^>]*>/g, '');
html = html.replace(/<script[^>]*>.*?self\.__next_f.*?(<\/script>)/g, '');
console.log(orig === html ? 'No change' : 'Changed! Length diff: ' + (orig.length - html.length));
