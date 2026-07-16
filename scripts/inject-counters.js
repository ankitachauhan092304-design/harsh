#!/usr/bin/env node
/**
 * inject-counters.js
 * Injects data-counter, data-suffix attributes into the 4 stat counter spans
 * in out/index.html so the vanilla JS counter can animate them.
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'out', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// The 4 counters in order of appearance (from STATS array in page.tsx):
// { rawVal: 2,   suffix: 'K+' }      → Happy Customers
// { rawVal: 5,   suffix: ' Cr+' }    → Loans Facilitated
// { rawVal: 180, suffix: '+' }       → Partner Banks
// { rawVal: 5,   suffix: '+' }       → Years of Experience
const counters = [
  { val: 2,   suffix: 'K+' },
  { val: 5,   suffix: ' Cr+' },
  { val: 180, suffix: '+' },
  { val: 5,   suffix: '+' },
];

let idx = 0;
// Replace each "tabular-nums" span (which has 0 from SSR) with data attributes
html = html.replace(/<span class="tabular-nums">0<!-- -->[^<]*<\/span>/g, (match) => {
  if (idx >= counters.length) return match;
  const { val, suffix } = counters[idx++];
  return `<span class="tabular-nums wf-counter" data-target="${val}" data-suffix="${suffix}">0${suffix}</span>`;
});

if (idx !== counters.length) {
  console.error(`❌ Expected to replace ${counters.length} spans but replaced ${idx}`);
  process.exit(1);
}

// Inject the counter script just before </body>
const counterScript = `
<script>
(function() {
  var DURATION = 1500;
  function easeOutQuad(t) { return t * (2 - t); }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / DURATION, 1);
      var eased = easeOutQuad(progress);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('en-IN') + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN') + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function init() {
    var counters = document.querySelectorAll('.wf-counter');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
`;

html = html.replace('</body>', counterScript + '\n</body>');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`✅ Injected counter data attributes and script into out/index.html`);
console.log(`   Counters: ${counters.map(c => c.val + c.suffix).join(', ')}`);
