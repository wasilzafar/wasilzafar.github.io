/**
 * Quiz JSON Skeleton Generator
 * 
 * Scans all series folders and creates quiz.json skeletons
 * with proper metadata and placeholder questions.
 * 
 * Run: node .tools/generate-quiz-skeletons.js
 * Options:
 *   --force    Overwrite existing quiz.json files
 *   --series=X Only generate for specific series slug
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SERIES_DIR = path.join(ROOT, 'pages', 'series');
const FORCE = process.argv.includes('--force');
const SERIES_FILTER = process.argv.find(a => a.startsWith('--series='));
const TARGET_SERIES = SERIES_FILTER ? SERIES_FILTER.split('=')[1] : null;

// XOR + Base64 encode (matches quiz-widget.js decode)
function encode(answer, salt) {
    const json = JSON.stringify(answer);
    let shifted = '';
    for (let i = 0; i < json.length; i++) {
        shifted += String.fromCharCode(json.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
    }
    return Buffer.from(shifted, 'binary').toString('base64');
}

// Extract title from HTML file
function getTitle(html) {
    const match = html.match(/<title>(.+?)\s*-\s*Wasil Zafar<\/title>/i);
    return match ? match[1].trim() : null;
}

// Get article slug from filename
function getSlug(filename) {
    return filename.replace('.html', '');
}

// Determine series title from category page or first article
function getSeriesTitle(seriesSlug, articles) {
    // Try to extract from first article's content
    const firstArticle = articles[0];
    if (firstArticle) {
        const html = fs.readFileSync(firstArticle, 'utf-8');
        // Look for series nav path title
        const match = html.match(/class="sn-header"[\s\S]*?<h4>(.+?)<\/h4>/);
        if (match) return match[1].trim();
    }
    // Fallback: prettify slug
    return seriesSlug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

// Generate salt from series slug
function generateSalt(seriesSlug) {
    return seriesSlug + '-2026';
}

// Scan a series folder
function processSeriesFolder(seriesPath, seriesSlug) {
    const quizPath = path.join(seriesPath, 'quiz.json');

    // Skip if exists and not forcing
    if (!FORCE && fs.existsSync(quizPath)) {
        return { slug: seriesSlug, status: 'skipped' };
    }

    // Get all HTML articles (exclude index.html, assessment.html)
    const files = fs.readdirSync(seriesPath)
        .filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'assessment.html')
        .sort();

    if (files.length === 0) {
        return { slug: seriesSlug, status: 'empty' };
    }

    const articles = files.map(f => path.join(seriesPath, f));
    const title = getSeriesTitle(seriesSlug, articles);
    const salt = generateSalt(seriesSlug);

    // Generate skeleton with 1 placeholder question per article (first 15)
    const questions = [];
    const partFiles = files.slice(0, Math.min(files.length, 20));

    partFiles.forEach((file, index) => {
        const slug = getSlug(file);
        const html = fs.readFileSync(path.join(seriesPath, file), 'utf-8');
        const articleTitle = getTitle(html) || slug;

        // Extract part number from filename or index
        const partMatch = file.match(/part(\d+)|(\d{2})-/);
        const partNum = partMatch ? parseInt(partMatch[1] || partMatch[2]) : index + 1;

        questions.push({
            id: seriesSlug.substring(0, 4) + '-q' + String(index + 1).padStart(3, '0'),
            part: partNum,
            difficulty: index < 5 ? 'beginner' : index < 12 ? 'intermediate' : 'advanced',
            type: 'mcq',
            question: '[TODO] Question about ' + articleTitle + '?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            answer: encode(0, salt),
            explanation: '[TODO] Explanation for the correct answer.',
            articleSlug: slug,
            tags: ['[TODO]']
        });
    });

    const quizData = {
        series: seriesSlug,
        title: title,
        version: 1,
        totalParts: files.length,
        security: {
            method: 'xor-b64',
            salt: salt
        },
        questions: questions
    };

    fs.writeFileSync(quizPath, JSON.stringify(quizData, null, 2));
    return { slug: seriesSlug, status: 'created', questions: questions.length, parts: files.length };
}

// Main
function main() {
    console.log('Quiz JSON Skeleton Generator\n');

    if (TARGET_SERIES) {
        console.log(`Target: ${TARGET_SERIES}\n`);
    }

    const seriesFolders = fs.readdirSync(SERIES_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .filter(name => !TARGET_SERIES || name === TARGET_SERIES)
        .sort();

    let created = 0, skipped = 0, empty = 0;

    seriesFolders.forEach(slug => {
        const seriesPath = path.join(SERIES_DIR, slug);
        const result = processSeriesFolder(seriesPath, slug);

        if (result.status === 'created') {
            created++;
            console.log(`  ✓ ${slug} (${result.questions} questions, ${result.parts} parts)`);
        } else if (result.status === 'skipped') {
            skipped++;
        } else if (result.status === 'empty') {
            empty++;
        }
    });

    console.log(`\n✓ Created: ${created} | Skipped: ${skipped} | Empty: ${empty}`);
    console.log(`\nNext: Edit quiz.json files to replace [TODO] placeholders with real questions.`);
    if (!FORCE && skipped > 0) {
        console.log(`Tip: Use --force to overwrite existing quiz.json files.`);
    }
}

main();
