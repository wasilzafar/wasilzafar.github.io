/**
 * Add path-progress.js to all series article pages
 * Run: node .tools/add-path-progress.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const seriesDir = path.join(ROOT, 'pages', 'series');
let count = 0;

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(e => {
        const fullPath = path.join(dir, e.name);
        if (e.isDirectory()) {
            processDir(fullPath);
        } else if (e.name.endsWith('.html')) {
            let html = fs.readFileSync(fullPath, 'utf-8');
            if (!html.includes('path-progress.js') && html.includes('main.js')) {
                html = html.replace(
                    '</body>',
                    '    <script src="../../../js/path-progress.js"></script>\n</body>'
                );
                fs.writeFileSync(fullPath, html);
                count++;
            }
        }
    });
}

processDir(seriesDir);
console.log('Added path-progress.js to ' + count + ' series articles');
