#!/usr/bin/env python3
"""
check-content-quality.py — Comprehensive content quality & SEO audit for HTML pages.

Usage:
    python check-content-quality.py                              # Audit all pages/
    python check-content-quality.py --path pages/series/digital-transformation
    python check-content-quality.py --path pages/series/digital-transformation --filter capstone
    python check-content-quality.py --fix                        # Auto-fix what's possible
    python check-content-quality.py --gsc urls.txt               # Investigate GSC indexing issues
    python check-content-quality.py --gsc -                      # Read URLs from stdin

Checks performed:
    1. Encoding issues (mojibake, BOM, broken arrows)
    2. Meta description length (target: 120-160 chars)
    3. Missing standard features (TOC, scroll-to-top, categoryIndicator, quiz, path-progress)
    4. Reading time accuracy (word count / 200 wpm)
    5. GTM script integrity (ternary operator not corrupted)
    6. Canonical URL presence
    7. Missing OG/Twitter meta tags
    8. Broken internal links (file references that don't exist)
    9. Thin content detection (< 1500 content words)

GSC Indexability checks (--gsc mode):
    10. Text-to-HTML ratio (target: >15%)
    11. Inbound internal link count (orphan detection)
    12. Duplicate title/description detection
    13. Content uniqueness / boilerplate ratio
    14. Heading structure (H1 count, H2 hierarchy)
    15. File size analysis
    16. Canonical consistency
    17. Structured data (schema.org) presence
"""
import argparse
import os
import re
import sys
from pathlib import Path
from collections import defaultdict, Counter


# ============================================================
# CONFIGURATION
# ============================================================

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent

META_DESC_MIN = 120
META_DESC_MAX = 160
THIN_CONTENT_THRESHOLD = 1500  # words
WPM_READING_SPEED = 200
TEXT_HTML_RATIO_MIN = 15  # percent
SITE_BASE_URL = 'https://www.wasilzafar.com/'

REQUIRED_FEATURES_BLOG = {
    'canonical': ('rel="canonical"', 'Missing canonical URL'),
    'scroll_to_top': ('scrollToTop', 'Missing scroll-to-top button'),
    'category_indicator': ('categoryIndicator', 'Missing category indicator'),
    'main_js': ('main.js', 'Missing main.js script'),
    'search': ('search.js', 'Missing search.js'),
}

OPTIONAL_FEATURES_BLOG = {
    'toc': ('sidenav-toc', 'No side navigation TOC'),
    'quiz_widget': ('quiz-widget.js', 'No quiz widget'),
    'path_progress': ('path-progress.js', 'No path-progress tracking'),
    'print_btn': ('print-btn', 'No print button'),
    'prism': ('prism', 'No Prism.js syntax highlighting'),
    'mermaid': ('mermaid', 'No Mermaid diagrams'),
}

# Mojibake patterns (from check-encoding.py)
def make_garbled(char):
    try:
        return char.encode('utf-8').decode('cp1252')
    except (UnicodeDecodeError, UnicodeEncodeError):
        return None

TARGET_CHARS = [
    '\u2014', '\u2013', '\u2019', '\u2018', '\u201c', '\u201d', '\u2026',
    '\u2022', '\u00a0', '\u2192', '\u2190', '\u2264', '\u2265', '\u2260',
    '\u00d7', '\u00b1', '\u221e', '\u00b2', '\u00b3',
]

MOJIBAKE_MAP = {}
for c in TARGET_CHARS:
    g = make_garbled(c)
    if g and g != c:
        MOJIBAKE_MAP[g] = c


# ============================================================
# AUDIT FUNCTIONS
# ============================================================

def get_word_count(content):
    """Extract text content words (excluding HTML tags, scripts, styles)."""
    # Remove script and style blocks
    text = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
    # Remove nav, footer (boilerplate)
    text = re.sub(r'<nav[^>]*>.*?</nav>', '', text, flags=re.DOTALL)
    text = re.sub(r'<footer[^>]*>.*?</footer>', '', text, flags=re.DOTALL)
    # Remove all HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return len(text.split())


def get_content_word_count(content):
    """Extract word count from main content area only."""
    # Try to find blog-content area
    match = re.search(r'class="blog-content">(.*?)(?:<div class="related-posts|<footer|</section>\s*$)', 
                      content, re.DOTALL)
    if match:
        text = match.group(1)
    else:
        # Fallback: everything between hero and footer
        match = re.search(r'</section>\s*.*?<section class="py-5">(.*?)<footer', content, re.DOTALL)
        text = match.group(1) if match else content
    
    # Strip tags
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return len(text.split())


def audit_file(filepath, repo_root):
    """Run all quality checks on a single file. Returns dict of issues."""
    issues = []
    warnings = []
    info = {}
    
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        content = f.read()
    
    rel_path = os.path.relpath(filepath, repo_root)
    
    # Skip non-article pages (index, assessment, contact)
    basename = os.path.basename(filepath)
    if basename in ('index.html', 'assessment.html', 'contact.html'):
        return {'path': rel_path, 'type': 'skip', 'reason': 'Non-article page'}
    
    # --- 1. META DESCRIPTION ---
    meta_match = re.search(r'<meta name="description" content="([^"]*)"', content)
    if meta_match:
        meta_desc = meta_match.group(1)
        info['meta_len'] = len(meta_desc)
        if len(meta_desc) > META_DESC_MAX:
            issues.append(f'Meta description too long: {len(meta_desc)} chars (max {META_DESC_MAX})')
        elif len(meta_desc) < META_DESC_MIN:
            warnings.append(f'Meta description short: {len(meta_desc)} chars (min {META_DESC_MIN})')
    else:
        issues.append('Missing meta description')
        info['meta_len'] = 0
    
    # --- 2. ENCODING / MOJIBAKE ---
    mojibake_count = 0
    for garbled, correct in MOJIBAKE_MAP.items():
        count = content.count(garbled)
        if count > 0:
            mojibake_count += count
    if mojibake_count > 0:
        issues.append(f'Encoding: {mojibake_count} mojibake characters detected')
    
    # --- 3. BROKEN ARROWS (? used as →) ---
    # Only check in content, not in script/meta tags
    content_area = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    content_area = re.sub(r'<meta[^>]*>', '', content_area)
    arrow_q = len(re.findall(r'(?<=[\w$%\)\]]) \? (?=[\w$\(\[])', content_area))
    if arrow_q > 5:  # A few legitimate ? between words is OK
        issues.append(f'Broken arrows: {arrow_q} instances of "?" likely should be "→"')
    
    # --- 4. GTM TERNARY CHECK ---
    if "dataLayer' →" in content or "dataLayer'→" in content:
        issues.append('GTM script corrupted: ternary ? replaced with → arrow')
    
    # --- 5. WORD COUNT & READING TIME ---
    word_count = get_content_word_count(content)
    info['word_count'] = word_count
    
    reading_time_match = re.search(r'(\d+)\s*min read', content)
    if reading_time_match:
        claimed_time = int(reading_time_match.group(1))
        actual_time = word_count // WPM_READING_SPEED
        info['claimed_read_time'] = claimed_time
        info['actual_read_time'] = actual_time
        # Flag if claimed time is >2x actual (thin content) or <0.5x actual
        if claimed_time > actual_time * 2.5 and word_count < THIN_CONTENT_THRESHOLD:
            issues.append(f'Thin content: {word_count} words claims {claimed_time} min read (actual ~{actual_time} min)')
        elif claimed_time > actual_time * 2:
            warnings.append(f'Reading time inflated: {word_count} words, claims {claimed_time} min (actual ~{actual_time} min)')
    
    # --- 6. MISSING FEATURES ---
    for key, (pattern, msg) in REQUIRED_FEATURES_BLOG.items():
        if pattern not in content:
            issues.append(f'Missing required: {msg}')
    
    missing_optional = []
    for key, (pattern, msg) in OPTIONAL_FEATURES_BLOG.items():
        if pattern not in content:
            missing_optional.append(key)
    if missing_optional:
        warnings.append(f'Missing optional features: {", ".join(missing_optional)}')
    
    # --- 7. OG / TWITTER TAGS ---
    if 'og:title' not in content:
        warnings.append('Missing og:title meta tag')
    if 'og:image' not in content:
        warnings.append('Missing og:image meta tag')
    if 'twitter:card' not in content:
        warnings.append('Missing twitter:card meta tag')
    
    # --- 8. INTERNAL LINK CHECK (all same-directory links) ---
    file_dir = os.path.dirname(filepath)
    local_links = re.findall(r'href="([^"#/][^"#]*?\.html)"', content)
    broken_links = []
    for link in local_links:
        if link.startswith('http') or link.startswith('../'):
            continue
        target = os.path.join(file_dir, link)
        if not os.path.exists(target):
            broken_links.append(link)
    if broken_links:
        issues.append(f'Broken internal links: {", ".join(broken_links[:5])}')
    
    # --- 9. BOM CHECK ---
    with open(filepath, 'rb') as f:
        raw = f.read(3)
    if raw == b'\xef\xbb\xbf':
        issues.append('Has UTF-8 BOM (unnecessary for web files)')
    
    return {
        'path': rel_path,
        'type': 'article',
        'word_count': info.get('word_count', 0),
        'meta_len': info.get('meta_len', 0),
        'claimed_read_time': info.get('claimed_read_time'),
        'actual_read_time': info.get('actual_read_time'),
        'issues': issues,
        'warnings': warnings,
    }


# ============================================================
# FIXING
# ============================================================

def fix_file(filepath, repo_root):
    """Auto-fix fixable issues. Returns list of fixes applied."""
    fixes = []
    
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        content = f.read()
    
    original = content
    
    # Fix mojibake
    for garbled, correct in MOJIBAKE_MAP.items():
        count = content.count(garbled)
        if count > 0:
            content = content.replace(garbled, correct)
            fixes.append(f'Fixed {count} mojibake characters')
    
    # Fix GTM ternary
    if "dataLayer' →" in content:
        content = content.replace("dataLayer' →", "dataLayer' ?")
        fixes.append('Restored GTM ternary operator')
    
    # Fix missing categoryIndicator (add after scrollToTop if present)
    if 'scrollToTop' in content and 'categoryIndicator' not in content:
        content = re.sub(
            r'(<button id="scrollToTop"[^>]*>.*?</button>)',
            r'\1\n\n    <!-- Category Indicator -->\n    <div id="categoryIndicator" class="category-indicator"></div>',
            content, flags=re.DOTALL
        )
        fixes.append('Added missing categoryIndicator div')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
    
    return fixes


# ============================================================
# GSC INDEXABILITY ANALYSIS
# ============================================================

def url_to_filepath(url):
    """Convert a site URL to a local file path relative to REPO_ROOT."""
    path = url.replace(SITE_BASE_URL, '').strip('/')
    if not path or path == '':
        path = 'index.html'
    return REPO_ROOT / path


def get_text_content(html):
    """Extract visible text, stripping scripts/styles/nav/footer."""
    text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
    text = re.sub(r'<nav[^>]*>.*?</nav>', '', text, flags=re.DOTALL)
    text = re.sub(r'<footer[^>]*>.*?</footer>', '', text, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'&\w+;', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def compute_text_html_ratio(html):
    """Compute text-to-HTML ratio as percentage."""
    text = get_text_content(html)
    html_size = len(html.encode('utf-8'))
    text_size = len(text.encode('utf-8'))
    if html_size == 0:
        return 0
    return round(text_size / html_size * 100, 1)


def get_title(html):
    """Extract <title> content."""
    m = re.search(r'<title[^>]*>(.*?)</title>', html, re.DOTALL)
    return re.sub(r'\s+', ' ', m.group(1)).strip() if m else ''


def get_meta_description(html):
    """Extract meta description content."""
    m = re.search(r'<meta name="description" content="([^"]*)"', html)
    return m.group(1) if m else ''


def get_canonical(html):
    """Extract canonical URL."""
    m = re.search(r'<link rel="canonical" href="([^"]*)"', html)
    return m.group(1) if m else ''


def get_h1(html):
    """Extract H1 text content."""
    matches = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
    return [re.sub(r'<[^>]+>', '', h).strip() for h in matches]


def get_h2_count(html):
    """Count H2 headings."""
    return len(re.findall(r'<h2[^>]*>', html))


def has_structured_data(html):
    """Check for schema.org / JSON-LD structured data."""
    return 'application/ld+json' in html or 'schema.org' in html


def build_inbound_link_map():
    """Scan all HTML files and build a map: target_path -> set of source files linking to it."""
    inbound = defaultdict(set)
    pages_dir = REPO_ROOT / 'pages'
    
    for html_file in pages_dir.rglob('*.html'):
        try:
            content = html_file.read_text(encoding='utf-8', errors='replace')
        except OSError:
            continue
        
        # Find all href links
        links = re.findall(r'href="([^"#]*)"', content)
        source_rel = str(html_file.relative_to(REPO_ROOT))
        
        for link in links:
            if not link or link.startswith('http') or link.startswith('mailto:') or link.startswith('javascript:'):
                continue
            
            # Resolve relative link to absolute path from repo root
            if link.startswith('/'):
                target_path = link.lstrip('/')
            else:
                target_path = str((html_file.parent / link).resolve().relative_to(REPO_ROOT))
            
            # Normalize path separators
            target_path = target_path.replace('\\', '/')
            inbound[target_path].add(source_rel.replace('\\', '/'))
    
    # Also scan category pages and index.html
    for html_file in [REPO_ROOT / 'index.html']:
        if not html_file.exists():
            continue
        content = html_file.read_text(encoding='utf-8', errors='replace')
        links = re.findall(r'href="([^"#]*)"', content)
        for link in links:
            if not link or link.startswith('http') or link.startswith('mailto:'):
                continue
            target_path = link.lstrip('/').replace('\\', '/')
            inbound[target_path].add('index.html')
    
    return inbound


def gsc_audit(urls):
    """Run GSC indexability analysis on a list of URLs."""
    print(f"\n{'='*72}")
    print(f"  GSC INDEXABILITY ANALYSIS — {len(urls)} pages")
    print(f"{'='*72}\n")
    
    # Build inbound link map (expensive but needed for orphan detection)
    print("  Building inbound link map...")
    inbound_map = build_inbound_link_map()
    print(f"  Tracked links to {len(inbound_map)} unique targets.\n")
    
    # Collect all titles and descriptions for duplicate detection
    all_titles = Counter()
    all_descs = Counter()
    pages_dir = REPO_ROOT / 'pages'
    for html_file in pages_dir.rglob('*.html'):
        try:
            content = html_file.read_text(encoding='utf-8', errors='replace')
            t = get_title(content)
            d = get_meta_description(content)
            if t:
                all_titles[t] += 1
            if d:
                all_descs[d] += 1
        except OSError:
            continue
    
    # Analyze each URL
    results = []
    for url in urls:
        filepath = url_to_filepath(url)
        rel_path = str(filepath.relative_to(REPO_ROOT)).replace('\\', '/')
        
        if not filepath.exists():
            results.append({'url': url, 'path': rel_path, 'error': 'FILE NOT FOUND'})
            continue
        
        html = filepath.read_text(encoding='utf-8', errors='replace')
        file_size = filepath.stat().st_size
        
        # Metrics
        text_html_ratio = compute_text_html_ratio(html)
        title = get_title(html)
        description = get_meta_description(html)
        canonical = get_canonical(html)
        h1_list = get_h1(html)
        h2_count = get_h2_count(html)
        word_count = get_content_word_count(html)
        total_words = get_word_count(html)
        inbound_count = len(inbound_map.get(rel_path, set()))
        has_schema = has_structured_data(html)
        
        # Canonical consistency
        expected_canonical = SITE_BASE_URL + rel_path
        canonical_ok = canonical == expected_canonical
        
        # Duplicate checks
        title_dupes = all_titles.get(title, 0)
        desc_dupes = all_descs.get(description, 0) if description else 0
        
        # Boilerplate ratio (unique content vs total text)
        # Approximate: content words / total text words
        uniqueness = round(word_count / total_words * 100, 1) if total_words > 0 else 0
        
        # Issues and signals
        signals = []
        if text_html_ratio < TEXT_HTML_RATIO_MIN:
            signals.append(f'⚠️  Low text/HTML ratio: {text_html_ratio}% (min {TEXT_HTML_RATIO_MIN}%)')
        if inbound_count < 2:
            signals.append(f'🔴 Low inbound links: {inbound_count} (orphan risk!)')
        elif inbound_count < 5:
            signals.append(f'⚠️  Few inbound links: {inbound_count}')
        if title_dupes > 1:
            signals.append(f'🔴 Duplicate title ({title_dupes} pages share this title)')
        if desc_dupes > 1:
            signals.append(f'⚠️  Duplicate meta description ({desc_dupes} pages)')
        if not canonical_ok:
            signals.append(f'⚠️  Canonical mismatch: {canonical[:60]}')
        if len(h1_list) == 0:
            signals.append('🔴 Missing H1 heading')
        elif len(h1_list) > 1:
            signals.append(f'⚠️  Multiple H1 headings: {len(h1_list)}')
        if h2_count < 3:
            signals.append(f'⚠️  Few H2 sections: {h2_count} (thin structure)')
        if word_count < THIN_CONTENT_THRESHOLD:
            signals.append(f'🔴 Thin content: {word_count} words (threshold {THIN_CONTENT_THRESHOLD})')
        if uniqueness < 30:
            signals.append(f'⚠️  Low content uniqueness: {uniqueness}%')
        if file_size > 200_000:
            signals.append(f'⚠️  Large file: {file_size // 1024}KB')
        if not has_schema:
            signals.append('ℹ️  No structured data (schema.org)')
        if not description:
            signals.append('🔴 Missing meta description')
        elif len(description) < META_DESC_MIN:
            signals.append(f'⚠️  Short meta description: {len(description)} chars')
        
        results.append({
            'url': url,
            'path': rel_path,
            'title': title,
            'word_count': word_count,
            'total_words': total_words,
            'text_html_ratio': text_html_ratio,
            'inbound_links': inbound_count,
            'h1_count': len(h1_list),
            'h2_count': h2_count,
            'file_size_kb': file_size // 1024,
            'uniqueness': uniqueness,
            'canonical_ok': canonical_ok,
            'title_dupes': title_dupes,
            'desc_dupes': desc_dupes,
            'has_schema': has_schema,
            'signals': signals,
        })
    
    # Print results
    print(f"{'─'*72}")
    print(f"  {'Page':<50} {'Words':>6} {'T/H%':>5} {'Links':>5} {'H2s':>4} {'Size':>5}")
    print(f"{'─'*72}")
    
    for r in results:
        if 'error' in r:
            print(f"  ❌ {r['path']:<50} {r['error']}")
            continue
        
        short_path = r['path'].replace('pages/series/', '').replace('pages/', '')
        if len(short_path) > 48:
            short_path = '...' + short_path[-45:]
        
        print(f"  {short_path:<50} {r['word_count']:>6} {r['text_html_ratio']:>5} {r['inbound_links']:>5} {r['h2_count']:>4} {r['file_size_kb']:>4}K")
        
        for signal in r['signals']:
            print(f"     {signal}")
        if r['signals']:
            print()
    
    # Summary statistics
    valid = [r for r in results if 'error' not in r]
    if valid:
        avg_words = sum(r['word_count'] for r in valid) // len(valid)
        avg_ratio = sum(r['text_html_ratio'] for r in valid) / len(valid)
        avg_links = sum(r['inbound_links'] for r in valid) / len(valid)
        low_links = sum(1 for r in valid if r['inbound_links'] < 2)
        thin = sum(1 for r in valid if r['word_count'] < THIN_CONTENT_THRESHOLD)
        low_ratio = sum(1 for r in valid if r['text_html_ratio'] < TEXT_HTML_RATIO_MIN)
        dupe_titles = sum(1 for r in valid if r['title_dupes'] > 1)
        
        print(f"\n{'='*72}")
        print(f"  GSC ANALYSIS SUMMARY")
        print(f"{'='*72}")
        print(f"  Pages analyzed:       {len(valid)}")
        print(f"  Avg content words:    {avg_words}")
        print(f"  Avg text/HTML ratio:  {avg_ratio:.1f}%")
        print(f"  Avg inbound links:    {avg_links:.1f}")
        print(f"{'─'*72}")
        print(f"  🔴 Orphan pages (<2 inbound links):   {low_links}")
        print(f"  🔴 Thin content (<{THIN_CONTENT_THRESHOLD} words):       {thin}")
        print(f"  ⚠️  Low text/HTML ratio (<{TEXT_HTML_RATIO_MIN}%):     {low_ratio}")
        print(f"  ⚠️  Duplicate titles:                  {dupe_titles}")
        print(f"{'='*72}")
        
        if low_links > 0:
            print(f"\n  RECOMMENDATION: Add internal links to orphan pages from category")
            print(f"  pages, related-posts sections, or the homepage.")
        if thin > 0:
            print(f"\n  RECOMMENDATION: Expand thin content pages to 2000+ words with")
            print(f"  additional sections, examples, diagrams, or code snippets.")
        if low_ratio > 0:
            print(f"\n  RECOMMENDATION: Pages with low text/HTML ratio have too much")
            print(f"  boilerplate. Consider reducing nav/footer size or adding content.")
    
    print()


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description='Comprehensive content quality & SEO audit for HTML pages.',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument('--fix', action='store_true', help='Auto-fix fixable issues')
    parser.add_argument('--path', type=str, default=None, help='Relative path to scan')
    parser.add_argument('--filter', type=str, default=None, help='Only audit files matching this substring')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show warnings too')
    parser.add_argument('--gsc', type=str, default=None, metavar='FILE',
                        help='GSC indexability mode: file with URLs (one per line), or "-" for stdin')
    args = parser.parse_args()

    # --- GSC MODE ---
    if args.gsc is not None:
        if args.gsc == '-':
            raw = sys.stdin.read()
        else:
            raw = Path(args.gsc).read_text(encoding='utf-8')
        
        # Parse URLs (handle tab-separated date columns, blank lines)
        urls = []
        for line in raw.strip().splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            # Split on tab/whitespace to handle "URL\tdate" format
            parts = line.split()
            url = parts[0]
            if url.startswith('http'):
                urls.append(url)
        
        if not urls:
            print("ERROR: No valid URLs found in input.")
            sys.exit(1)
        
        gsc_audit(urls)
        sys.exit(0)

    # --- STANDARD AUDIT MODE ---
    repo_root = REPO_ROOT

    # Determine scan targets
    if args.path:
        scan_root = repo_root / args.path
    else:
        scan_root = repo_root / 'pages'

    if not scan_root.exists():
        print(f"ERROR: Path not found: {scan_root}")
        sys.exit(1)

    # Collect HTML files
    html_files = sorted(scan_root.rglob('*.html'))
    if args.filter:
        html_files = [f for f in html_files if args.filter in f.name]

    print(f"Auditing {len(html_files)} HTML files...\n")

    # Run audits
    results = []
    total_issues = 0
    total_warnings = 0

    for filepath in html_files:
        result = audit_file(str(filepath), str(repo_root))
        
        if result.get('type') == 'skip':
            continue
        
        results.append(result)
        issues = result.get('issues', [])
        warnings = result.get('warnings', [])
        total_issues += len(issues)
        total_warnings += len(warnings)

        if issues or (args.verbose and warnings):
            status = '❌' if issues else '⚠️'
            print(f"{status} {result['path']}")
            print(f"   Words: {result.get('word_count', '?')} | Meta: {result.get('meta_len', '?')}ch", end='')
            if result.get('claimed_read_time'):
                print(f" | Read: claims {result['claimed_read_time']}min, actual ~{result['actual_read_time']}min", end='')
            print()
            for issue in issues:
                print(f"   🔴 {issue}")
            if args.verbose:
                for warning in warnings:
                    print(f"   🟡 {warning}")
            print()

    # Apply fixes if requested
    if args.fix and total_issues > 0:
        print("\n--- APPLYING FIXES ---\n")
        for filepath in html_files:
            basename = os.path.basename(str(filepath))
            if basename in ('index.html', 'assessment.html', 'contact.html'):
                continue
            fixes = fix_file(str(filepath), str(repo_root))
            if fixes:
                rel = os.path.relpath(str(filepath), str(repo_root))
                print(f"✅ {rel}")
                for fix in fixes:
                    print(f"   → {fix}")
        print()

    # Summary
    clean = len(results) - len([r for r in results if r.get('issues')])
    print(f"\n{'='*60}")
    print(f"SUMMARY: {len(results)} articles audited")
    print(f"  ✅ Clean: {clean}")
    print(f"  🔴 Issues: {total_issues} across {len(results) - clean} files")
    print(f"  🟡 Warnings: {total_warnings}")
    if total_issues > 0 and not args.fix:
        print(f"\nRun with --fix to auto-fix encoding, GTM, and categoryIndicator issues.")
    print()


if __name__ == '__main__':
    main()
