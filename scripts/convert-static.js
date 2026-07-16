const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../out');
const WEBSITE_DIR = path.join(__dirname, '../website');

// Clean and recreate website directory
if (fs.existsSync(WEBSITE_DIR)) {
  fs.rmSync(WEBSITE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(WEBSITE_DIR, { recursive: true });

// Copy all files from out/ to website/ except _next/ for now
function copyDir(src, dest, ignoreRegex) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    if (ignoreRegex && ignoreRegex.test(entry.name)) continue;
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, ignoreRegex);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying static assets...');
copyDir(OUT_DIR, WEBSITE_DIR, /^_next$/);

// Move _next/static/css to website/css
const cssDir = path.join(WEBSITE_DIR, 'css');
fs.mkdirSync(cssDir, { recursive: true });
const nextCssDir = path.join(OUT_DIR, '_next', 'static', 'css');
let mainCssFile = '';

if (fs.existsSync(nextCssDir)) {
  const files = fs.readdirSync(nextCssDir);
  for (let file of files) {
    if (file.endsWith('.css')) {
      const content = fs.readFileSync(path.join(nextCssDir, file), 'utf8');
      mainCssFile += content + '\n';
    }
  }
}
fs.writeFileSync(path.join(cssDir, 'style.css'), mainCssFile);

// Move images to assets/images
const assetsDir = path.join(WEBSITE_DIR, 'assets', 'images');
fs.mkdirSync(assetsDir, { recursive: true });

// Next.js static exports sometimes output images to out/_next/static/media
const nextMediaDir = path.join(OUT_DIR, '_next', 'static', 'media');
if (fs.existsSync(nextMediaDir)) {
  copyDir(nextMediaDir, assetsDir);
}

// Copy public folder to assets/images
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, assetsDir);
}

// Create JS directory and copy JS files
const jsDir = path.join(WEBSITE_DIR, 'js');
fs.mkdirSync(jsDir, { recursive: true });

const scriptDir = path.join(__dirname);
if (fs.existsSync(path.join(scriptDir, 'script.js'))) {
  fs.copyFileSync(path.join(scriptDir, 'script.js'), path.join(jsDir, 'script.js'));
}
if (fs.existsSync(path.join(scriptDir, 'calculators.js'))) {
  fs.copyFileSync(path.join(scriptDir, 'calculators.js'), path.join(jsDir, 'calculators.js'));
}
if (fs.existsSync(path.join(scriptDir, 'form.js'))) {
  fs.copyFileSync(path.join(scriptDir, 'form.js'), path.join(jsDir, 'form.js'));
}
if (fs.existsSync(path.join(scriptDir, 'whatsapp.js'))) {
  fs.copyFileSync(path.join(scriptDir, 'whatsapp.js'), path.join(jsDir, 'whatsapp.js'));
}

// Function to calculate relative prefix based on file depth
function getRelativePrefix(filePath) {
  const relativePath = path.relative(WEBSITE_DIR, filePath);
  const depth = relativePath.split(path.sep).length - 1;
  return depth === 0 ? './' : '../'.repeat(depth);
}

// Process all HTML files
function processHtmlFiles(dir) {
  let entries = fs.readdirSync(dir, { withFileTypes: true });

  for (let entry of entries) {
    let fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processHtmlFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let rel = getRelativePrefix(fullPath);

      // Remove Next.js script tags
      content = content.replace(/<script[^>]*src="[^"]*\/_next\/[^"]*"[^>]*><\/script>/g, '');
      content = content.replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*><\/script>/g, '');
      content = content.replace(/<link[^>]*rel="preload"[^>]*as="script"[^>]*>/g, '');
      content = content.replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]*\/_next\/[^"]*"[^>]*>/g, '');
      content = content.replace(/<script[^>]*>self\.__next_f.*?(<\/script>|(?=<script))/gs, '');
      content = content.replace(/<script[^>]*>window\.__NEXT_DATA__.*?<\/script>/gs, '');

      // Add our static CSS and JS
      const headInjection = `
    <link rel="stylesheet" href="${rel}css/style.css">
      `;
      const bodyInjection = `
    <script src="${rel}js/script.js"></script>
    <script src="${rel}js/calculators.js"></script>
    <script src="${rel}js/form.js"></script>
    <script src="${rel}js/whatsapp.js"></script>
      `;

      content = content.replace('</head>', headInjection + '</head>');
      content = content.replace('</body>', bodyInjection + '</body>');

      // Convert absolute root paths to relative paths
      content = content.replace(/(href|src)="\/([^"]*)"/g, (match, p1, p2) => {
        let newPath = p2;
        
        if (newPath === '') {
          newPath = 'index.html';
        } else if (!newPath.includes('.') && !newPath.startsWith('#')) {
          newPath = newPath + '.html';
        }
        
        // Handle images/svgs from public root
        if (newPath.endsWith('.svg') || newPath.endsWith('.jpg') || newPath.endsWith('.png') || newPath.endsWith('.webp')) {
          // Check if it's already in assets/images/
          if (!newPath.startsWith('assets/images/')) {
            newPath = 'assets/images/' + newPath;
          }
        }
        
        // Handle _next/static/media images
        if (newPath.startsWith('_next/static/media/')) {
          newPath = newPath.replace('_next/static/media/', 'assets/images/');
        }

        return `${p1}="${rel}${newPath}"`;
      });

      fs.writeFileSync(fullPath, content);
      console.log(`Processed: ${fullPath}`);
    }
  }
}

processHtmlFiles(WEBSITE_DIR);
console.log('Static conversion complete!');
