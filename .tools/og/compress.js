/**
 * Compress OG Images
 * 
 * Optimizes all PNG files in /images/og/ using sharp.
 * Reduces ~100KB/file to ~30-40KB with minimal quality loss.
 * 
 * Run from .tools/og/:
 *   node compress.js
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

async function compressFile(filePath) {
    const originalSize = fs.statSync(filePath).size;
    totalBefore += originalSize;

    const buffer = await sharp(filePath)
        .png({
            quality: 80,
            compressionLevel: 9,
            palette: true,
            colours: 128,
            dither: 0.5
        })
        .toBuffer();

    // Only write if smaller
    if (buffer.length < originalSize) {
        fs.writeFileSync(filePath, buffer);
        totalAfter += buffer.length;
    } else {
        totalAfter += originalSize;
    }

    processed++;
}

async function main() {
    console.log('Compressing OG images...\n');

    const files = findAllPngs(OG_DIR);
    console.log(`Found ${files.length} PNG files\n`);

    // Process in batches of 20 for memory efficiency
    const batchSize = 20;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        await Promise.all(batch.map(f => compressFile(f)));

        if ((i + batchSize) % 200 === 0 || i + batchSize >= files.length) {
            const pct = Math.min(processed, files.length);
            console.log(`  Progress: ${pct}/${files.length}`);
        }
    }

    const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
    const beforeMB = (totalBefore / 1024 / 1024).toFixed(1);
    const afterMB = (totalAfter / 1024 / 1024).toFixed(1);
    const reduction = ((1 - totalAfter / totalBefore) * 100).toFixed(0);

    console.log(`\n✓ Compressed ${processed} images`);
    console.log(`  Before: ${beforeMB} MB`);
    console.log(`  After:  ${afterMB} MB`);
    console.log(`  Saved:  ${savedMB} MB (${reduction}% reduction)`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
