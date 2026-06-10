/**
 * Add Search to All Pages
 * 
 * Ensures every HTML page has:
 * 1. Search button in the navigation bar
 * 2. Fuse.js CDN script
 * 3. search.js script with correct relative path
 * 
 * Run: node .tools/add-search-all-pages.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SEARCH_BTN = '<button class="nav-search-btn" onclick="openSearch()" aria-label="Search articles"><i class="fas fa-search"></i> Search <span class="search-shortcut">Ctrl+K</span></button>';

let stats = { navAdded: 0, scriptsAdded: 0, skipped: 0, errors: 0 };

function getBasePath(filePath) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    const depth = rel.split('/').length - 1; // subtract the filename
    if (depth === 0) return '';           // root: index.html
    if (depth === 1) return '../';         // pages/contact.html
    if (depth === 2) return '../../';      // pages/categories/tech.html
    if (depth === 3) return '../../../';   // pages/series/name/article.html, pages/2025/10/article.html
    return '../'.repeat(depth);
}

function processFile(filePath) {
    let html;
    try {
        html = fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
        stats.errors++;
        return;
    }

    // Skip non-page files (no nav)
    if (!html.includes('nav-v16')) {
        stats.skipped++;
        return;
    }

    let changed = false;
    const basePath = getBasePath(filePath);

    // 1. Add search button to nav if missing
    if (!html.includes('nav-search-btn')) {
        // Match the Interests link followed by closing </div> of .links
        const navPattern = /(<a href="[^"]*#interests"[^>]*class="link-3d[^"]*"[^>]*>.*?<\/a>)\s*\n(\s*)<\/div>/;
        const match = html.match(navPattern);
        if (match) {
            const indent = match[2] || '            ';
            const replacement = match[1] + '\n' + indent + '    ' + SEARCH_BTN + '\n' + indent + '</div>';
            html = html.replace(match[0], replacement);
            changed = true;
            stats.navAdded++;
        }
    }

    // 2. Add Fuse.js + search.js scripts if missing
    if (!html.includes('search.js')) {
        const fuseScript = `\n    <!-- Fuse.js Search Library -->\n    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js"></script>\n    <script src="${basePath}js/search.js"></script>\n`;

        // Strategy A: Insert after main.js
        const mainJsPattern = new RegExp(`(<script src="${escapeRegex(basePath)}js/main\\.js"><\\/script>)`);
        const mainJsMatch = html.match(mainJsPattern);
        if (mainJsMatch) {
            html = html.replace(mainJsMatch[0], mainJsMatch[0] + fuseScript);
            changed = true;
            stats.scriptsAdded++;
        } else {
            // Strategy B: Insert before </body>
            const bodyClose = html.lastIndexOf('</body>');
            if (bodyClose > -1) {
                html = html.substring(0, bodyClose) + fuseScript + '\n' + html.substring(bodyClose);
                changed = true;
                stats.scriptsAdded++;
            }
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, html);
    }
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findAllHtml(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
            results.push(...findAllHtml(fullPath));
        } else if (entry.name.endsWith('.html') && !entry.name.startsWith('.')) {
            results.push(fullPath);
        }
    }
    return results;
}

// Main
console.log('Adding search to all pages...\n');

const allHtml = findAllHtml(ROOT);
console.log(`Found ${allHtml.length} HTML files\n`);

allHtml.forEach(processFile);

console.log('Results:');
console.log(`  Nav button added: ${stats.navAdded} pages`);
console.log(`  Scripts added:    ${stats.scriptsAdded} pages`);
console.log(`  Skipped (no nav): ${stats.skipped} pages`);
console.log(`  Errors:           ${stats.errors} pages`);
console.log(`\n✓ Done`);
