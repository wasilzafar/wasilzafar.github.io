/**
 * Update og:image and twitter:image meta tags from .png to .jpg
 * Run: node .tools/update-og-ext.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let count = 0;

function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            scan(fullPath);
        } else if (entry.name.endsWith('.html')) {
            let html = fs.readFileSync(fullPath, 'utf-8');
            if (html.includes('/images/og/') && html.includes('.png')) {
                html = html.replace(/(\/images\/og\/[^"]*)-og\.png/g, '$1-og.jpg');
                html = html.replace(/(\/images\/og\/[^"]*)-tw\.png/g, '$1-tw.jpg');
                fs.writeFileSync(fullPath, html);
                count++;
            }
        }
    }
}

console.log('Updating meta tags from .png to .jpg...\n');
scan(path.join(ROOT, 'pages'));
console.log(`✓ Updated ${count} pages`);
