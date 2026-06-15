/**
 * Build Search Index
 * 
 * Scans all HTML article pages and generates a search-index.json file
 * for client-side search using Fuse.js.
 * 
 * Usage: node build-search-index.js
 * 
 * Run this before pushing to regenerate the search index when articles change.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const OUTPUT = path.join(ROOT, 'search-index.json');

// Directories to scan for articles
const SCAN_DIRS = [
    path.join(ROOT, 'pages', 'series'),
    path.join(ROOT, 'pages', 'exams'),
    path.join(ROOT, 'pages', '2025'),
    path.join(ROOT, 'pages', '2026'),
    path.join(ROOT, 'pages', 'paths')
];

// Extract text content from HTML (strip tags)
function stripHtml(html) {
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

// Extract meta content by name or property
function getMeta(html, attr, value) {
    const regex = new RegExp(`<meta\\s+(?:[^>]*?)?(?:${attr}=["']${value}["'])(?:[^>]*?)?content=["']([^"']*?)["']`, 'i');
    const match = html.match(regex);
    if (match) return match[1];

    // Try reversed attribute order
    const regex2 = new RegExp(`<meta\\s+(?:[^>]*?)?content=["']([^"']*?)["'](?:[^>]*?)?(?:${attr}=["']${value}["'])`, 'i');
    const match2 = html.match(regex2);
    return match2 ? match2[1] : '';
}

// Extract title from <title> tag
function getTitle(html) {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return match ? stripHtml(match[1]) : '';
}

// Extract first meaningful paragraph from blog-content
function getExcerpt(html, maxLen = 200) {
    // Look for content within blog-content div
    const contentMatch = html.match(/<div class="blog-content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/i);
    const content = contentMatch ? contentMatch[1] : html;

    // Get first few paragraphs
    const paragraphs = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (!paragraphs) return '';

    let text = '';
    for (const p of paragraphs) {
        const stripped = stripHtml(p);
        if (stripped.length > 40) { // Skip very short paragraphs
            text = stripped;
            break;
        }
    }
    return text.substring(0, maxLen);
}

// Extract H2 headings as section keywords
function getHeadings(html) {
    const headings = [];
    const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const text = stripHtml(match[1]);
        if (text && text.length < 100) {
            headings.push(text);
        }
    }
    return headings;
}

// Determine category from file path
function getCategory(filePath) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    if (rel.includes('pages/series/')) {
        const parts = rel.split('/');
        // pages/series/[series-name]/article.html
        return parts[2]; // series folder name
    }
    return 'standalone';
}

// Get URL path relative to site root
function getUrl(filePath) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    return '/' + rel;
}

// Recursively find all .html files
function findHtmlFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...findHtmlFiles(fullPath));
        } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
            files.push(fullPath);
        }
    }
    return files;
}

// Also include index.html files from series folders (listing pages)
function findIndexFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const indexPath = path.join(fullPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                files.push(indexPath);
            }
            files.push(...findIndexFiles(fullPath));
        }
    }
    return files;
}

// Main build function
function buildIndex() {
    console.log('Building search index...\n');
    const articles = [];
    let totalFiles = 0;

    for (const dir of SCAN_DIRS) {
        const htmlFiles = findHtmlFiles(dir);
        totalFiles += htmlFiles.length;

        for (const filePath of htmlFiles) {
            try {
                const html = fs.readFileSync(filePath, 'utf-8');

                const title = getTitle(html);
                if (!title) continue; // Skip files without titles

                const description = getMeta(html, 'name', 'description');
                const keywords = getMeta(html, 'name', 'keywords');
                const publishDate = getMeta(html, 'property', 'article:published_time');
                const section = getMeta(html, 'property', 'article:section');
                const excerpt = getExcerpt(html);
                const headings = getHeadings(html);
                const category = getCategory(filePath);
                const url = getUrl(filePath);

                articles.push({
                    title: title.replace(/\s*[-|]\s*Wasil Zafar$/, '').trim(),
                    description,
                    keywords,
                    excerpt,
                    headings: headings.join(' | '),
                    category,
                    section: section || category,
                    date: publishDate,
                    url
                });
            } catch (err) {
                console.error(`Error processing ${filePath}: ${err.message}`);
            }
        }
    }

    // Sort by date (newest first)
    articles.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
    });

    // Write index
    fs.writeFileSync(OUTPUT, JSON.stringify(articles, null, 0));

    console.log(`✓ Indexed ${articles.length} articles from ${totalFiles} HTML files`);
    console.log(`✓ Output: ${OUTPUT} (${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB)`);
    console.log('\nCategories found:');
    const cats = {};
    articles.forEach(a => { cats[a.category] = (cats[a.category] || 0) + 1; });
    Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} articles`);
    });
}

buildIndex();
