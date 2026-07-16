const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://127.0.0.1:8080/calculators/eligibility.html', { waitUntil: 'networkidle2' });
  
  // Try clicking Business
  try {
    const btns = await page.$$('button');
    for (let b of btns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text.trim() === 'Business') {
        console.log('Clicking Business button');
        await b.click();
        break;
      }
    }
    await page.waitForTimeout(500);
  } catch (e) {
    console.log('Error clicking:', e.message);
  }

  await browser.close();
})();
