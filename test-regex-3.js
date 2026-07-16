const fs = require('fs');
let html = '<html><body><script src="./_next/static/chunks/wf-calculators.js"></script><script src="./_next/static/chunks/main.js"></script></body></html>';
const orig = html;
html = html.replace(/<script src="[^"]+\/_next\/static\/chunks\/(?!wf-)[^"]+\.js"[^>]*><\/script>/g, '');
console.log('Result:', html);
// Result should have wf-calculators.js but NOT main.js
