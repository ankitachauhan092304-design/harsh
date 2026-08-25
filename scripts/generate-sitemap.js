const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.whitestonefincorp.com';
const TODAY = new Date().toISOString().split('T')[0];

const PAGES = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/services', priority: '0.9', changefreq: 'weekly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/calculators/emi', priority: '0.9', changefreq: 'weekly' },
  { url: '/calculators/eligibility', priority: '0.9', changefreq: 'weekly' },
  { url: '/calculators/credit-score', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/personal-loan', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/business-loan', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/home-loan', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/loan-against-property', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/project-loan', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/top-up-loan', priority: '0.9', changefreq: 'weekly' },
  { url: '/services/credit-card', priority: '0.9', changefreq: 'weekly' },
  { url: '/blog/boost-credit-score-fast', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/home-loan-eligibility-guide', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/unsecured-business-loans-msme', priority: '0.7', changefreq: 'monthly' },
  { url: '/legal/privacy-policy', priority: '0.4', changefreq: 'yearly' },
  { url: '/legal/terms-and-conditions', priority: '0.4', changefreq: 'yearly' },
  { url: '/legal/disclaimer', priority: '0.4', changefreq: 'yearly' },
  { url: '/legal/refund-policy', priority: '0.4', changefreq: 'yearly' },
  { url: '/legal/cookie-policy', priority: '0.4', changefreq: 'yearly' },
];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

PAGES.forEach(page => {
  sitemapXml += `  <url>\n`;
  sitemapXml += `    <loc>${DOMAIN}${page.url}</loc>\n`;
  sitemapXml += `    <lastmod>${TODAY}</lastmod>\n`;
  sitemapXml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  sitemapXml += `    <priority>${page.priority}</priority>\n`;
  sitemapXml += `  </url>\n`;

  if (page.url !== '') {
    sitemapXml += `  <url>\n`;
    sitemapXml += `    <loc>${DOMAIN}${page.url}.html</loc>\n`;
    sitemapXml += `    <lastmod>${TODAY}</lastmod>\n`;
    sitemapXml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemapXml += `    <priority>${page.priority}</priority>\n`;
    sitemapXml += `  </url>\n`;
  }
});

sitemapXml += `</urlset>\n`;

const publicDir = path.join(__dirname, '..', 'public');
const outDir = path.join(__dirname, '..', 'out');
const websiteDir = path.join(__dirname, '..', 'website');

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);

if (fs.existsSync(outDir)) {
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml);
}
if (fs.existsSync(websiteDir)) {
  fs.writeFileSync(path.join(websiteDir, 'sitemap.xml'), sitemapXml);
}

console.log('✅ Generated sitemap.xml with ' + PAGES.length * 2 + ' URLs!');
