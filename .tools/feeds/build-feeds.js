/**
 * Build RSS + Atom Feeds
 * 
 * Generates:
 * - /feed.xml (RSS 2.0, all articles, latest 50)
 * - /atom.xml (Atom, all articles, latest 50)
 * - /feeds/[category].xml (RSS 2.0 per category)
 * - /feeds/[category]-atom.xml (Atom per category)
 * 
 * Run: node .tools/build-feeds.js
 */
const fs = require('fs');
const path = require('path');

// CLI flags
const DETERMINISTIC = process.argv.includes('--deterministic');

const ROOT = path.resolve(__dirname, '../..');
const FEEDS_DIR = path.join(ROOT, 'feeds');
const SITE_URL = 'https://www.wasilzafar.com';
const SITE_TITLE = 'Wasil Zafar';
const SITE_DESC = 'Technical articles on embedded systems, AI, software architecture, business strategy, philosophy, and life sciences.';
const AUTHOR = 'Wasil Zafar';
const MAX_ITEMS = 50;

// Category → series folder mapping
const CATEGORY_MAP = {
    'technology': ['ai-app-dev','ai-data-science','ai-in-the-wild','api-development','arm-assembly','assembly-mastery','cloud-computing','cmsis','computer-architecture','data-structures','database-mastery','digital-transformation','embedded-systems','embedded-hardware','gnu-make','kernel-development','math-for-ai','neural-networks','nlp','protocols-master','pytorch-mastery','stm32-hal','system-design','tensorflow-mastery','usb-dev'],
    'business': ['consulting-frameworks','dddm','economics','entrepreneurship','marketing-strategy','sales-mastery'],
    'engineering': ['manufacturing-engineering','materials-science','mech-movements','robotics-automation','sensors-actuators'],
    'philosophy': ['eastern-philosophy','ethics-moral-philosophy','existentialism','logic-critical-thinking','philosophy-of-mind','political-philosophy'],
    'psychology': ['behavioral-psychology','cognitive-psych','social-psychology'],
    'life-sciences': ['biochemistry','evolutionary-biology','human-anatomy','physiology'],
    'gaming': ['game-development','unity-game-engine'],
    'physical-sciences': ['theory-of-relativity'],
    'mathematics': ['math-for-ai'],
    'faith': [],
    'poetry': [],
    'history': []
};

// XML escape
function esc(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// Decode HTML entities to plain Unicode — must run BEFORE esc() to avoid double-encoding
function decodeHtmlEntities(str) {
    if (!str) return '';
    return str
        // Common named entities
        .replace(/&mdash;/g, '\u2014')
        .replace(/&ndash;/g, '\u2013')
        .replace(/&ldquo;/g, '\u201C')
        .replace(/&rdquo;/g, '\u201D')
        .replace(/&lsquo;/g, '\u2018')
        .replace(/&rsquo;/g, '\u2019')
        .replace(/&apos;/g, "'")
        .replace(/&hellip;/g, '\u2026')
        .replace(/&times;/g, '\u00D7')
        .replace(/&copy;/g, '\u00A9')
        .replace(/&reg;/g, '\u00AE')
        .replace(/&trade;/g, '\u2122')
        .replace(/&deg;/g, '\u00B0')
        .replace(/&plusmn;/g, '\u00B1')
        .replace(/&frac12;/g, '\u00BD')
        .replace(/&frac14;/g, '\u00BC')
        .replace(/&frac34;/g, '\u00BE')
        .replace(/&alpha;/g, '\u03B1')
        .replace(/&beta;/g, '\u03B2')
        .replace(/&gamma;/g, '\u03B3')
        .replace(/&delta;/g, '\u03B4')
        .replace(/&pi;/g, '\u03C0')
        .replace(/&sigma;/g, '\u03C3')
        .replace(/&omega;/g, '\u03C9')
        .replace(/&mu;/g, '\u03BC')
        .replace(/&nbsp;/g, ' ')
        // Standard XML entities (these are safe; decode last so they don't re-trigger named-entity replacements above)
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        // Numeric decimal &#NNN;
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
        // Numeric hex &#xHH;
        .replace(/&#x([0-9a-fA-F]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

// Strip HTML tags then decode entities to plain text
function stripHtml(html) {
    return decodeHtmlEntities(
        html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
    );
}

// Extract meta content
function getMeta(html, attr, value) {
    const regex = new RegExp(`<meta\\s+(?:[^>]*?)?(?:${attr}=["']${value}["'])(?:[^>]*?)?content=["']([^"']*?)["']`, 'i');
    const match = html.match(regex);
    if (match) return match[1];
    const regex2 = new RegExp(`<meta\\s+(?:[^>]*?)?content=["']([^"']*?)["'](?:[^>]*?)?(?:${attr}=["']${value}["'])`, 'i');
    const match2 = html.match(regex2);
    return match2 ? match2[1] : '';
}

// Get title
function getTitle(html) {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return match ? stripHtml(match[1]).replace(/\s*[-|]\s*Wasil Zafar$/, '').trim() : '';
}

// Words that indicate a paragraph is boilerplate (cookie banner, nav, etc.) not article content
const BOILERPLATE_PATTERNS = /cookie consent|privacy policy|we use cookies|accept cookies|our privacy|manage cookies/i;

// Get excerpt (first 300 chars of meaningful article content)
function getExcerpt(html, maxLen = 300) {
    // Try to scope to blog-content div; allow any closing-div depth
    const contentMatch = html.match(/<div class="blog-content">([\s\S]*?)<\/div>\s*<\/div>/i);
    const content = contentMatch ? contentMatch[1] : html;
    const paragraphs = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (!paragraphs) return '';
    let text = '';
    for (const p of paragraphs) {
        const stripped = stripHtml(p);   // already decodes HTML entities
        // Skip boilerplate and very short fragments
        if (stripped.length < 40 || BOILERPLATE_PATTERNS.test(stripped)) continue;
        text += (text ? ' ' : '') + stripped;
        if (text.length >= maxLen) break;
    }
    // Truncate at word boundary to avoid cutting mid-word or mid-sentence
    if (text.length > maxLen) {
        text = text.substring(0, maxLen);
        const lastSpace = text.lastIndexOf(' ');
        if (lastSpace > maxLen - 40) text = text.substring(0, lastSpace);
    }
    return text;
}

// Get URL path relative to site root
function getUrl(filePath) {
    return '/' + path.relative(ROOT, filePath).replace(/\\/g, '/');
}

// Determine category from series folder
function getSeriesCategory(folder) {
    for (const [cat, series] of Object.entries(CATEGORY_MAP)) {
        if (series.includes(folder)) return cat;
    }
    return null;
}

// Find all HTML articles
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
                try {
                    const html = fs.readFileSync(fullPath, 'utf-8');
                    const title = getTitle(html);
                    if (!title) continue;

                    const description = getMeta(html, 'name', 'description');
                    const date = getMeta(html, 'property', 'article:published_time');
                    const excerpt = getExcerpt(html);
                    const url = getUrl(fullPath);

                    // Determine category
                    const rel = path.relative(ROOT, fullPath).replace(/\\/g, '/');
                    let category = null;
                    const seriesMatch = rel.match(/pages\/series\/([^/]+)\//);
                    if (seriesMatch) {
                        category = getSeriesCategory(seriesMatch[1]);
                    }

                    articles.push({
                        title,
                        description: description || excerpt,
                        excerpt,
                        date: date || '2026-01-01',
                        url,
                        category,
                        guid: SITE_URL + url
                    });
                } catch (e) { /* skip */ }
            }
        }
    }

    scanDirs.forEach(scan);

    // Sort by date descending
    articles.sort((a, b) => b.date.localeCompare(a.date));
    return articles;
}

// Generate RSS 2.0 XML
function generateRSS(articles, title, description, feedUrl, link) {
    const items = articles.slice(0, MAX_ITEMS);
    const mostRecentDate = items.length > 0 ? new Date(items[0].date) : new Date();
    // In deterministic mode, use most-recent article date instead of wall clock
    const refTime = DETERMINISTIC ? mostRecentDate : new Date();
    const buildDate = refTime.toUTCString();
    const lastPubDate = new Date(Math.min(mostRecentDate.getTime(), refTime.getTime())).toUTCString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(title)}</title>
    <description>${esc(description)}</description>
    <link>${esc(link)}</link>
    <atom:link href="${esc(feedUrl)}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${lastPubDate}</pubDate>
    <managingEditor>wasil.zafar@gmail.com (${AUTHOR})</managingEditor>
    <webMaster>wasil.zafar@gmail.com (${AUTHOR})</webMaster>
    <image>
      <url>${SITE_URL}/images/favicon_io/android-chrome-512x512.png</url>
      <title>${esc(title)}</title>
      <link>${esc(link)}</link>
    </image>
`;

    items.forEach(item => {
        // Cap item pubDate to reference time — future-scheduled articles must not produce implausible dates
        const rawDate = new Date(item.date);
        const capTime = DETERMINISTIC ? mostRecentDate.getTime() : Date.now();
        const pubDate = new Date(Math.min(rawDate.getTime(), capTime)).toUTCString();
        xml += `    <item>
      <title>${esc(item.title)}</title>
      <link>${esc(SITE_URL + item.url)}</link>
      <guid isPermaLink="true">${esc(item.guid)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(item.excerpt || item.description)}</description>
      <author>wasil.zafar@gmail.com (${AUTHOR})</author>
    </item>
`;
    });

    xml += `  </channel>
</rss>`;
    return xml;
}

// Generate Atom XML
function generateAtom(articles, title, description, feedUrl, link) {
    const items = articles.slice(0, MAX_ITEMS);
    const updated = items.length > 0 ? items[0].date + 'T00:00:00Z' : '1970-01-01T00:00:00Z';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(title)}</title>
  <subtitle>${esc(description)}</subtitle>
  <link href="${esc(feedUrl)}" rel="self" type="application/atom+xml"/>
  <link href="${esc(link)}" rel="alternate" type="text/html"/>
  <id>${esc(link)}</id>
  <updated>${updated}</updated>
  <author>
    <name>${AUTHOR}</name>
    <email>wasil.zafar@gmail.com</email>
    <uri>${SITE_URL}</uri>
  </author>
  <icon>${SITE_URL}/images/favicon_io/favicon-32x32.png</icon>
  <logo>${SITE_URL}/images/favicon_io/android-chrome-512x512.png</logo>
`;

    items.forEach(item => {
        const itemUpdated = item.date + 'T00:00:00Z';
        xml += `  <entry>
    <title>${esc(item.title)}</title>
    <link href="${esc(SITE_URL + item.url)}" rel="alternate" type="text/html"/>
    <id>${esc(item.guid)}</id>
    <updated>${itemUpdated}</updated>
    <summary>${esc(item.excerpt || item.description)}</summary>
    <author><name>${AUTHOR}</name></author>
  </entry>
`;
    });

    xml += `</feed>`;
    return xml;
}

// Main
console.log('Building RSS + Atom feeds...\n');

// Ensure feeds directory exists
if (!fs.existsSync(FEEDS_DIR)) {
    fs.mkdirSync(FEEDS_DIR, { recursive: true });
}

// Get all articles
const allArticles = findArticles();
console.log(`Found ${allArticles.length} articles total\n`);

// Main feeds (all articles)
const mainRSS = generateRSS(allArticles, SITE_TITLE, SITE_DESC, SITE_URL + '/feed.xml', SITE_URL);
fs.writeFileSync(path.join(ROOT, 'feed.xml'), mainRSS);
console.log('  ✓ /feed.xml (RSS 2.0)');

const mainAtom = generateAtom(allArticles, SITE_TITLE, SITE_DESC, SITE_URL + '/atom.xml', SITE_URL);
fs.writeFileSync(path.join(ROOT, 'atom.xml'), mainAtom);
console.log('  ✓ /atom.xml (Atom)');

// Per-category feeds
let catCount = 0;
for (const [category, seriesList] of Object.entries(CATEGORY_MAP)) {
    // Filter articles for this category
    const catArticles = allArticles.filter(a => a.category === category);
    if (catArticles.length === 0) continue;

    const catTitle = `${SITE_TITLE} — ${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}`;
    const catDesc = `Latest ${category.replace(/-/g, ' ')} articles from ${SITE_TITLE}`;
    const catLink = `${SITE_URL}/pages/categories/${category}.html`;

    // RSS
    const catRSS = generateRSS(catArticles, catTitle, catDesc, `${SITE_URL}/feeds/${category}.xml`, catLink);
    fs.writeFileSync(path.join(FEEDS_DIR, `${category}.xml`), catRSS);

    // Atom
    const catAtom = generateAtom(catArticles, catTitle, catDesc, `${SITE_URL}/feeds/${category}-atom.xml`, catLink);
    fs.writeFileSync(path.join(FEEDS_DIR, `${category}-atom.xml`), catAtom);

    console.log(`  ✓ /feeds/${category}.xml + ${category}-atom.xml (${catArticles.length} articles)`);
    catCount++;
}

console.log(`\n✓ Generated ${2 + catCount * 2} feed files (${catCount} categories)`);
