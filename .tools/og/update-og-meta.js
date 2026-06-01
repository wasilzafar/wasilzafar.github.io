/**
 * Update og:image and add twitter:image meta tags to all article pages
 * to point to their unique OG images.
 * 
 * Run: node .tools/update-og-meta.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OG_DIR = path.join(ROOT, 'images', 'og');
const SITE_URL = 'https://www.wasilzafar.com';

let updated = 0;
let skipped = 0;

function getOgSubpath(filePath) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    return rel.replace(/^pages\//, '').replace(/\.html$/, '');
}

function processFile(filePath) {
    const subpath = getOgSubpath(filePath);
    const ogFile = path.join(OG_DIR, subpath + '-og.png');
    const twFile = path.join(OG_DIR, subpath + '-tw.png');

    // Only update if OG image exists
    if (!fs.existsSync(ogFile)) {
        skipped++;
        return;
    }

    let html = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    const ogImageUrl = `${SITE_URL}/images/og/${subpath}-og.png`;
    const twImageUrl = `${SITE_URL}/images/og/${subpath}-tw.png`;

    // Update og:image
    const ogImagePattern = /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i;
    if (ogImagePattern.test(html)) {
        html = html.replace(ogImagePattern, `<meta property="og:image" content="${ogImageUrl}" />`);
        changed = true;
    }

    // Add twitter:card and twitter:image if not present
    if (!html.includes('twitter:card')) {
        const ogImageTag = `<meta property="og:image" content="${ogImageUrl}" />`;
        const twitterTags = `${ogImageTag}\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:image" content="${twImageUrl}" />`;
        html = html.replace(ogImageTag, twitterTags);
        changed = true;
    } else if (html.includes('twitter:image')) {
        // Update existing twitter:image
        const twPattern = /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i;
        html = html.replace(twPattern, `<meta name="twitter:image" content="${twImageUrl}" />`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, html);
        updated++;
    } else {
        skipped++;
    }
}

function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            scan(fullPath);
        } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
            processFile(fullPath);
        }
    }
}

console.log('Updating og:image meta tags...\n');

scan(path.join(ROOT, 'pages', 'series'));
scan(path.join(ROOT, 'pages', '2025'));
scan(path.join(ROOT, 'pages', '2026'));

console.log(`\n✓ Updated: ${updated} pages`);
console.log(`  Skipped: ${skipped} pages`);
