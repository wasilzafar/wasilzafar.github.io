/**
 * Add RSS Auto-Discovery Tags to All Pages
 * 
 * Adds <link rel="alternate" type="application/rss+xml"> and Atom tags
 * to the <head> of all HTML pages.
 * 
 * Run: node .tools/add-rss-discovery.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let count = 0;

const RSS_TAG = '<link rel="alternate" type="application/rss+xml" title="Wasil Zafar RSS Feed" href="/feed.xml" />';
const ATOM_TAG = '<link rel="alternate" type="application/atom+xml" title="Wasil Zafar Atom Feed" href="/atom.xml" />';

function findAllHtml(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            results.push(...findAllHtml(fullPath));
        } else if (entry.name.endsWith('.html') && !entry.name.startsWith('.')) {
            results.push(fullPath);
        }
    }
    return results;
}

function addDiscoveryTags(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');

    // Skip if already has feed discovery
    if (html.includes('application/rss+xml')) return;

    // Insert after <meta name="viewport" ...> or after first <meta charset>
    const insertPoints = [
        /(<meta[^>]*viewport[^>]*>)/i,
        /(<meta[^>]*charset[^>]*>)/i,
        /(<title[^>]*>.*?<\/title>)/i
    ];

    let inserted = false;
    for (const pattern of insertPoints) {
        const match = html.match(pattern);
        if (match) {
            const insertAfter = match[0];
            const replacement = insertAfter + '\n    ' + RSS_TAG + '\n    ' + ATOM_TAG;
            html = html.replace(insertAfter, replacement);
            inserted = true;
            break;
        }
    }

    if (inserted) {
        fs.writeFileSync(filePath, html);
        count++;
    }
}

console.log('Adding RSS auto-discovery tags...\n');

const allHtml = findAllHtml(ROOT);
console.log(`Found ${allHtml.length} HTML files\n`);

allHtml.forEach(addDiscoveryTags);

console.log(`✓ Added discovery tags to ${count} pages`);
