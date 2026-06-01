/**
 * Convert OG Images from PNG to JPEG
 * 
 * Converts all PNG files in /images/og/ to JPEG at quality 80.
 * Expected savings: ~60-70% (182MB → ~55MB)
 * 
 * Run from .tools/og/:
 *   node convert-jpeg.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const OG_DIR = path.join(ROOT, 'images', 'og');

let processed = 0;
let totalBefore = 0;
let totalAfter = 0;

function findAllPngs(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findAllPngs(fullPath));
        } else if (entry.name.endsWith('.png')) {
            results.push(fullPath);
        }
    }
    return results;
}

async function convertFile(filePath) {
    const originalSize = fs.statSync(filePath).size;
    totalBefore += originalSize;

    const jpgPath = filePath.replace('.png', '.jpg');

    const buffer = await sharp(filePath)
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();

    fs.writeFileSync(jpgPath, buffer);
    fs.unlinkSync(filePath); // Remove original PNG
    totalAfter += buffer.length;
    processed++;
}

async function main() {
    console.log('Converting OG images to JPEG...\n');

    const files = findAllPngs(OG_DIR);
    console.log(`Found ${files.length} PNG files\n`);

    const batchSize = 20;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        await Promise.all(batch.map(f => convertFile(f)));

        if ((i + batchSize) % 200 === 0 || i + batchSize >= files.length) {
            const pct = Math.min(processed, files.length);
            console.log(`  Progress: ${pct}/${files.length}`);
        }
    }

    const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
    const beforeMB = (totalBefore / 1024 / 1024).toFixed(1);
    const afterMB = (totalAfter / 1024 / 1024).toFixed(1);
    const reduction = ((1 - totalAfter / totalBefore) * 100).toFixed(0);

    console.log(`\n✓ Converted ${processed} images to JPEG`);
    console.log(`  Before: ${beforeMB} MB (PNG)`);
    console.log(`  After:  ${afterMB} MB (JPEG q80)`);
    console.log(`  Saved:  ${savedMB} MB (${reduction}% reduction)`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
