/**
 * Build Unique Open Graph Images for All Articles
 * 
 * Generates:
 * - /images/og/[slug]-og.png   (1200x630 for og:image)
 * - /images/og/[slug]-tw.png   (1200x675 for twitter:image)
 * 
 * Run from .tools/og/:
 *   npm run build              (full rebuild)
 *   npm run build:incremental  (skip existing)
 * 
 * Design: Navy→Blue→Teal gradient, category badge, title, author, brand
 */
const fs = require('fs');
const path = require('path');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const OUTPUT_DIR = path.join(ROOT, 'images', 'og');
const FORCE_REBUILD = process.argv.includes('--force');

// Ensure output dir
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Colors
const COLORS = {
    navy: '#132440',
    blue: '#16476A',
    teal: '#3B9797',
    crimson: '#BF092F',
    white: '#FFFFFF',
    lightGray: '#B8C5D0',
    accentLine: '#5CC5C5'
};

// Category config (icon text + color)
const CATEGORY_CONFIG = {
    'technology': { label: 'TECHNOLOGY', color: COLORS.teal },
    'business': { label: 'BUSINESS', color: '#E8A838' },
    'engineering': { label: 'ENGINEERING', color: '#D4763A' },
    'philosophy': { label: 'PHILOSOPHY', color: '#A78BFA' },
    'psychology': { label: 'PSYCHOLOGY', color: '#EC4899' },
    'life-sciences': { label: 'LIFE SCIENCES', color: '#34D399' },
    'gaming': { label: 'GAMING', color: '#06B6D4' },
    'physical-sciences': { label: 'PHYSICAL SCIENCES', color: '#F59E0B' },
    'mathematics': { label: 'MATHEMATICS', color: '#8B5CF6' },
    'faith': { label: 'FAITH', color: '#F9A825' },
    'poetry': { label: 'POETRY', color: '#4ADE80' },
    'history': { label: 'HISTORY', color: '#D97706' },
    'standalone': { label: 'ARTICLE', color: COLORS.teal }
};

// Category → series mapping
const SERIES_TO_CATEGORY = {};
const categoryMap = {
    'technology': ['ai-app-dev','ai-data-science','ai-in-the-wild','api-development','arm-assembly','assembly-mastery','cloud-computing','cmsis','computer-architecture','computing-systems-foundations','containers-docker','data-structures','database-mastery','devops-platform-engineering','digital-transformation','distributed-systems-k8s','embedded-systems','embedded-hardware','gnu-make','infrastructure-cloud-automation','kernel-development','math-for-ai','monitoring-observability','neural-networks','nlp','protocols-master','pytorch-mastery','software-engineering','stm32-hal','system-design','systems-thinking-architecture','tensorflow-mastery','usb-dev'],
    'business': ['consulting-frameworks','dddm','economics','entrepreneurship','marketing-strategy','sales-mastery'],
    'engineering': ['manufacturing-engineering','materials-science','mech-movements','robotics-automation','sensors-actuators'],
    'philosophy': ['eastern-philosophy','ethics-moral-philosophy','existentialism','logic-critical-thinking','philosophy-of-mind','political-philosophy'],
    'psychology': ['behavioral-psychology','cognitive-psych','social-psychology'],
    'life-sciences': ['biochemistry','evolutionary-biology','human-anatomy','physiology'],
    'gaming': ['game-development','unity-game-engine'],
    'physical-sciences': ['theory-of-relativity'],
    'mathematics': ['math-for-ai']
};
for (const [cat, folders] of Object.entries(categoryMap)) {
    for (const folder of folders) {
        SERIES_TO_CATEGORY[folder] = cat;
    }
}

// Get title from HTML
function getTitle(html) {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (!match) return '';
    return match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s*[-|–]\s*Wasil Zafar$/, '')
        .trim();
}

// Get output path mirroring the pages folder structure
// e.g. pages/series/arm-assembly/article.html → series/arm-assembly/article
function getOutputSubpath(filePath) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    return rel
        .replace(/^pages\//, '')
        .replace(/\.html$/, '');
}

// Get category from file path
function getCategory(filePath) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    const seriesMatch = rel.match(/pages\/series\/([^/]+)\//);
    if (seriesMatch) {
        return SERIES_TO_CATEGORY[seriesMatch[1]] || 'technology';
    }
    return 'standalone';
}

// Word wrap text to fit width
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

// Draw gradient background
function drawBackground(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, COLORS.navy);
    gradient.addColorStop(0.5, COLORS.blue);
    gradient.addColorStop(1, '#2A7A7A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle pattern overlay (diagonal lines)
    ctx.globalAlpha = 0.03;
    ctx.strokeStyle = COLORS.white;
    ctx.lineWidth = 1;
    for (let i = -height; i < width + height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
}

// Draw category badge
function drawCategoryBadge(ctx, category, x, y) {
    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['standalone'];
    
    ctx.font = 'bold 20px "DM Sans", Arial, sans-serif';
    const textWidth = ctx.measureText(config.label).width;
    const badgeWidth = textWidth + 24;
    const badgeHeight = 34;

    // Badge background
    ctx.fillStyle = config.color;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.roundRect(x, y, badgeWidth, badgeHeight, 6);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Badge border
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, badgeWidth, badgeHeight, 6);
    ctx.stroke();

    // Badge text
    ctx.fillStyle = config.color;
    ctx.fillText(config.label, x + 12, y + 23);
}

// Draw the full OG image
function drawOGImage(title, category, width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    drawBackground(ctx, width, height);

    // Content padding
    const px = 72;
    const py = 60;

    // Category badge
    drawCategoryBadge(ctx, category, px, py);

    // Title
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 52px "DM Sans", Arial, sans-serif';
    const titleLines = wrapText(ctx, title, width - px * 2);
    const maxLines = 3;
    const displayLines = titleLines.slice(0, maxLines);
    if (titleLines.length > maxLines) {
        displayLines[maxLines - 1] = displayLines[maxLines - 1].replace(/\s+\S*$/, '...');
    }

    const titleY = py + 80;
    const lineHeight = 66;
    displayLines.forEach((line, i) => {
        ctx.fillText(line, px, titleY + i * lineHeight);
    });

    // Accent line
    const accentY = titleY + displayLines.length * lineHeight + 20;
    ctx.fillStyle = COLORS.accentLine;
    ctx.fillRect(px, accentY, 80, 4);

    // Bottom bar
    const bottomY = height - py - 10;

    // Author
    ctx.fillStyle = COLORS.lightGray;
    ctx.font = '500 22px "DM Sans", Arial, sans-serif';
    ctx.fillText('Wasil Zafar', px, bottomY);

    // Site URL (right-aligned)
    ctx.font = '400 20px "DM Sans", Arial, sans-serif';
    ctx.fillStyle = COLORS.accentLine;
    const urlText = 'wasilzafar.com';
    const urlWidth = ctx.measureText(urlText).width;
    ctx.fillText(urlText, width - px - urlWidth, bottomY);

    // Brand mark (3 bars)
    const barX = px;
    const barY = bottomY - 35;
    ctx.fillStyle = COLORS.teal;
    ctx.fillRect(barX, barY, 24, 3);
    ctx.fillRect(barX, barY + 6, 18, 3);
    ctx.fillRect(barX, barY + 12, 12, 3);

    return canvas;
}

// Find all articles
function findArticles() {
    const articles = [];
    const scanDirs = [
        path.join(ROOT, 'pages', 'series'),
        path.join(ROOT, 'pages', '2025'),
        path.join(ROOT, 'pages', '2026')
    ];

    function scan(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                scan(fullPath);
            } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
                articles.push(fullPath);
            }
        }
    }

    scanDirs.forEach(scan);
    return articles;
}

// Main
async function main() {
    console.log('Building Open Graph images...\n');

    const articles = findArticles();
    console.log(`Found ${articles.length} articles\n`);

    let generated = 0;
    let skipped = 0;
    let errors = 0;

    for (const filePath of articles) {
        const subpath = getOutputSubpath(filePath);
        const ogPath = path.join(OUTPUT_DIR, subpath + '-og.jpg');
        const twPath = path.join(OUTPUT_DIR, subpath + '-tw.jpg');

        // Ensure subdirectory exists
        const outDir = path.dirname(ogPath);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        // Skip if both files already exist (unless --force)
        if (!FORCE_REBUILD && fs.existsSync(ogPath) && fs.existsSync(twPath)) {
            skipped++;
            continue;
        }

        try {
            const html = fs.readFileSync(filePath, 'utf-8');
            const title = getTitle(html);
            if (!title) {
                skipped++;
                continue;
            }

            const category = getCategory(filePath);

            // Generate OG (1200x630)
            const ogCanvas = drawOGImage(title, category, 1200, 630);
            const ogBuffer = ogCanvas.toBuffer('image/png');
            await sharp(ogBuffer)
                .jpeg({ quality: 80, mozjpeg: true })
                .toFile(ogPath);

            // Generate Twitter (1200x675)
            const twCanvas = drawOGImage(title, category, 1200, 675);
            const twBuffer = twCanvas.toBuffer('image/png');
            await sharp(twBuffer)
                .jpeg({ quality: 80, mozjpeg: true })
                .toFile(twPath);

            generated++;
            if (generated % 50 === 0) {
                console.log(`  Progress: ${generated}/${articles.length} generated`);
            }
        } catch (e) {
            errors++;
            console.error(`  Error: ${slug} — ${e.message}`);
        }
    }

    console.log(`\n✓ Generated: ${generated * 2} images (${generated} articles × 2 sizes)`);
    if (skipped > 0) console.log(`  Skipped: ${skipped} (incremental/no title)`);
    if (errors > 0) console.log(`  Errors: ${errors}`);

    // Report size
    const files = fs.readdirSync(OUTPUT_DIR);
    let totalSize = 0;
    files.forEach(f => {
        totalSize += fs.statSync(path.join(OUTPUT_DIR, f)).size;
    });
    console.log(`  Total size: ${(totalSize / 1024 / 1024).toFixed(1)} MB (${files.length} files)`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
