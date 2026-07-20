#!/usr/bin/env node
/**
 * fix-paths.js
 * Rewrites all absolute /_next/ paths in HTML files to relative paths,
 * so the site works when opened directly from a file:// URL or any subfolder.
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');

function getAllHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(full, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

// Calculate relative prefix based on depth from OUT_DIR
function getPrefix(filePath) {
  const rel = path.relative(OUT_DIR, filePath);
  const depth = rel.split(path.sep).length - 1;
  return depth > 0 ? '../'.repeat(depth) : './';
}

const htmlFiles = getAllHtmlFiles(OUT_DIR);
let fixed = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  const prefix = getPrefix(filePath);

  // Replace absolute /_next/ paths with relative equivalents
  const original = content;

  // href="/_next/... → href="PREFIX_next/...
  content = content.replace(/href="\/_next\//g, `href="${prefix}_next/`);
  // src="/_next/... → src="PREFIX_next/...
  content = content.replace(/src="\/_next\//g, `src="${prefix}_next/`);
  // url(/_next/... → url(PREFIX_next/...
  content = content.replace(/url\(\/_next\//g, `url(${prefix}_next/`);

  // Also fix internal page links: href="/about" → href="PREFIX/about.html"
  // But only for top-level known pages (not external URLs)
  const pageMap = {
    '"/about"': `"${prefix}about.html"`,
    '"/services"': `"${prefix}services.html"`,
    '"/blog"': `"${prefix}blog.html"`,
    '"/contact"': `"${prefix}contact.html"`,
    '"/calculators/emi"': `"${prefix}calculators/emi.html"`,
    '"/calculators/eligibility"': `"${prefix}calculators/eligibility.html"`,
    '"/calculators/credit-score"': `"${prefix}calculators/credit-score.html"`,
    '"/services/personal-loan"': `"${prefix}services/personal-loan.html"`,
    '"/services/business-loan"': `"${prefix}services/business-loan.html"`,
    '"/services/home-loan"': `"${prefix}services/home-loan.html"`,
    '"/services/loan-against-property"': `"${prefix}services/loan-against-property.html"`,
    '"/services/loan-against-property.html"': `"${prefix}services/loan-against-property.html"`,
    '"/services/credit-card"': `"${prefix}services/credit-card.html"`,
    '"/services/project-loan"': `"${prefix}services/project-loan.html"`,
    '"/services/top-up-loan"': `"${prefix}services/top-up-loan.html"`,
    '"/blog/boost-credit-score-fast"': `"${prefix}blog/boost-credit-score-fast.html"`,
    '"/blog/home-loan-eligibility-guide"': `"${prefix}blog/home-loan-eligibility-guide.html"`,
    '"/blog/unsecured-business-loans-msme"': `"${prefix}blog/unsecured-business-loans-msme.html"`,
    '"/legal/privacy-policy"': `"${prefix}legal/privacy-policy.html"`,
    '"/legal/terms-and-conditions"': `"${prefix}legal/terms-and-conditions.html"`,
    '"/legal/disclaimer"': `"${prefix}legal/disclaimer.html"`,
    '"/legal/cookie-policy"': `"${prefix}legal/cookie-policy.html"`,
    '"/legal/refund-policy"': `"${prefix}legal/refund-policy.html"`,
    '"/"': `"${prefix}index.html"`,
    '"/favicon.ico"': `"${prefix}favicon.ico"`,
    '"/logo.svg"': `"${prefix}logo.svg"`,
    '"/grid.svg"': `"${prefix}grid.svg"`,
    '"/contact?type=apply"': `"${prefix}contact.html?type=apply"`,
    '"/contact?type=eligibility"': `"${prefix}contact.html?type=eligibility"`,
  };

  for (const [from, to] of Object.entries(pageMap)) {
    content = content.replaceAll(`href=${from}`, `href=${to}`);
    content = content.replaceAll(`src=${from}`, `src=${to}`);
  }

  // Fix absolute favicon URLs with query strings
  content = content.replace(/href="\/favicon\.ico\?[^"]*"/g, `href="${prefix}favicon.ico"`);

  // Fix contact?type=apply link
  content = content.replace(/href="\.\/contact\?type=apply\.html"/g, `href="${prefix}contact.html"`);
  content = content.replace(/href="\.\.\/contact\?type=apply\.html"/g, `href="${prefix}contact.html"`);

  // Remove opacity:0 and transform inline styles (from Framer Motion initial state)
  content = content.replace(/ style="opacity:0;transform:translateY\([^"]*\)"/g, '');
  content = content.replace(/ style="opacity:0;transform:translateX\([^"]*\)"/g, '');
  content = content.replace(/ style="opacity:0"/g, '');
  content = content.replace(/ style="opacity:0;transform:scale\([^"]*\)"/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixed++;
    console.log(`Fixed: ${path.relative(OUT_DIR, filePath)}`);
  } else {
    console.log(`Skipped (no changes): ${path.relative(OUT_DIR, filePath)}`);
  }
}

console.log(`\n✅ Done! Fixed ${fixed} of ${htmlFiles.length} HTML files.`);
