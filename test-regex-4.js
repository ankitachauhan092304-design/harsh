const fs = require('fs');
let html = fs.readFileSync('out/calculators/credit-score.html', 'utf8');

// Inject the script like finalize-all-pages.js does
if (!html.includes('wf-credit-score.js')) {
  html = html.replace('</body>', '<script src="../_next/static/chunks/wf-credit-score.js"></script>\n</body>');
}

// Strip Next.js React chunks (excluding wf- chunks)
html = html.replace(/<script src="[^"]+\/_next\/static\/chunks\/(?!wf-)[^"]+\.js"[^>]*><\/script>/g, '');
html = html.replace(/<link[^>]*rel="preload"[^>]*href="[^"]+\/_next\/static\/chunks\/(?!wf-)[^"]+\.js"[^>]*>/g, '');
html = html.replace(/<script[^>]*>(?:(?!<\/script>)[\s\S])*?self\.__next_f(?:(?!<\/script>)[\s\S])*?<\/script>/g, '');

console.log('Result length:', html.length);
console.log('Has wf-credit-score.js:', html.includes('wf-credit-score.js'));
console.log('Has self.__next_f:', html.includes('self.__next_f'));
console.log('Has other script tag count:', (html.match(/<script/g) || []).length);
