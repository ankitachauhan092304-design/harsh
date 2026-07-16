const fs = require('fs');
let html = fs.readFileSync('out/calculators/credit-score.html', 'utf8');
const orig = html;
// Regex that safely matches ONLY the self.__next_f script tag without swallowing other tags
html = html.replace(/<script[^>]*>(?:(?!<\/script>)[\s\S])*?self\.__next_f(?:(?!<\/script>)[\s\S])*?<\/script>/g, '');
console.log('Original length:', orig.length);
console.log('New length:', html.length);
console.log('Match count of credit-score:', (html.match(/Credit Score Estimator/g) || []).length);
