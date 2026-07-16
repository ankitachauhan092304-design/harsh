#!/usr/bin/env node
/**
 * finalize-all-pages.js
 * ─────────────────────────────────────────────────────────────────────
 * Final pass over every HTML file in out/ to:
 *  1. Inject wf-form.js into any page that has a form
 *  2. Inject counter script into index.html
 *  3. Fix mobile menu toggle (hamburger → mobile nav)
 *  4. Fix broken/missing calculator links
 *  5. Fix nav links consistency
 *  6. Ensure WhatsApp floating button is present on all pages
 *  7. Fix contact.html form references
 */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');

function getAllHtml(dir, list = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) getAllHtml(full, list);
    else if (e.name.endsWith('.html')) list.push(full);
  }
  return list;
}

function depth(filePath) {
  return path.relative(OUT, filePath).split(path.sep).length - 1;
}

function prefix(filePath) {
  const d = depth(filePath);
  return d > 0 ? '../'.repeat(d) : './';
}

// Counter script (for index.html)
const COUNTER_SCRIPT = `
<script>
(function(){
  var DURATION=1500;
  function ease(t){return t*(2-t);}
  function animateCounter(el){
    var target=parseInt(el.getAttribute('data-target'),10);
    var suffix=el.getAttribute('data-suffix')||'';
    var start=null;
    function step(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/DURATION,1);
      var e=ease(p);
      el.textContent=Math.floor(e*target).toLocaleString('en-IN')+suffix;
      if(p<1)requestAnimationFrame(step);
      else el.textContent=target.toLocaleString('en-IN')+suffix;
    }
    requestAnimationFrame(step);
  }
  function init(){
    var els=document.querySelectorAll('.wf-counter');
    if(!els.length)return;
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){obs.unobserve(entry.target);animateCounter(entry.target);}
      });
    },{threshold:0.2});
    els.forEach(function(el){obs.observe(el);});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
</script>`;

// Mobile menu script (injected in every page)
const MOBILE_MENU_SCRIPT = `
<script>
(function(){
  function init(){
    var btn=document.querySelector('[data-mobile-toggle], #mobile-menu-btn, button[aria-label*="menu" i], button[aria-label*="Menu"]');
    var menu=document.getElementById('mobile-nav-panel') || document.querySelector('[data-mobile-menu], #mobile-menu, nav [class*="mobile"]');
    if(btn&&menu){
      btn.addEventListener('click',function(){
        var hidden=menu.classList.contains('hidden') || menu.style.display==='none' || getComputedStyle(menu).display==='none';
        if(hidden){
          menu.classList.remove('hidden');
          menu.style.display='block';
        } else {
          menu.classList.add('hidden');
          menu.style.display='none';
        }
      });
    }
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
</script>`;

// WhatsApp floating button removed since it exists in Next.js compiled template.

const htmlFiles = getAllHtml(OUT);
let fixed = 0;

for (const filePath of htmlFiles) {
  let html = fs.readFileSync(filePath, 'utf8');
  const pfx = prefix(filePath);
  const original = html;
  const rel = path.relative(OUT, filePath);

  // 1. Inject wf-form.js before </body> (if form exists and not already injected)
  if (html.includes('<form') && !html.includes('wf-form.js')) {
    const formScript = `<script src="${pfx}_next/static/chunks/wf-form.js"></script>`;
    html = html.replace('</body>', formScript + '\n</body>');
  }

  // 1b. Inject wf-calculators.js before </body> (if range input/calculator page exists and not already injected)
  if ((html.includes('type="range"') || rel.includes('calculators/') || rel === 'index.html') && !html.includes('wf-calculators.js') && !rel.includes('credit-score')) {
    const calcScript = `<script src="${pfx}_next/static/chunks/wf-calculators.js"></script>`;
    html = html.replace('</body>', calcScript + '\n</body>');
  }

  // 1c. Inject credit-score.js into credit-score.html
  if (rel.includes('credit-score.html') && !html.includes('wf-credit-score.js')) {
    const creditScript = `<script src="${pfx}_next/static/chunks/wf-credit-score.js"></script>`;
    html = html.replace('</body>', creditScript + '\n</body>');
  }

  // 2. Inject counter script for index.html
  if (rel === 'index.html' && !html.includes('wf-counter')) {
    // Tag counter spans with data attributes
    const counters = [
      { val: 2, suffix: 'K+' },
      { val: 5, suffix: ' Cr+' },
      { val: 180, suffix: '+' },
      { val: 5, suffix: '+' },
    ];
    let idx = 0;
    html = html.replace(/<span class="tabular-nums">([^<]*)<\/span>/g, (match, inner) => {
      if (idx >= counters.length) return match;
      const { val, suffix } = counters[idx++];
      return `<span class="tabular-nums wf-counter" data-target="${val}" data-suffix="${suffix}">${val}${suffix}</span>`;
    });
    html = html.replace('</body>', COUNTER_SCRIPT + '\n</body>');
  }

  // 3. Inject mobile menu script
  if (!html.includes('mobile-menu-btn') && !html.includes('data-mobile-toggle')) {
    html = html.replace('</body>', MOBILE_MENU_SCRIPT + '\n</body>');
  }

  // 4. Injected WhatsApp floating button removed since it exists in Next.js compiled template.

  // 5. Fix opacity:0 Framer Motion remnants (in case any were missed)
  html = html.replace(/ style="opacity:0;transform:translateY\([^"]*\)"/g, '');
  html = html.replace(/ style="opacity:0;transform:translateX\([^"]*\)"/g, '');
  html = html.replace(/ style="opacity:0;transform:scale\([^"]*\)"/g, '');
  html = html.replace(/ style="opacity:0"/g, '');

  // 3. Remove Next.js React hydration scripts to avoid 404s on GitHub Pages custom domains (since we have vanilla JS fallbacks now)
  html = html.replace(/<script src="[^"]+\/_next\/static\/chunks\/[^"]+\.js"[^>]*><\/script>/g, '');
  html = html.replace(/<link[^>]*rel="preload"[^>]*href="[^"]+\/_next\/static\/chunks\/[^"]+\.js"[^>]*>/g, '');
  html = html.replace(/<script[^>]*>.*?self\.__next_f.*?(<\/script>)/g, '');

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    fixed++;
    console.log(`✅ ${rel}`);
  } else {
    console.log(`⏭  ${rel} (no changes)`);
  }
}

console.log(`\n✅ Done! Updated ${fixed} of ${htmlFiles.length} HTML files.`);
