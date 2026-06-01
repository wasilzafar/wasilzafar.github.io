#!/usr/bin/env python3
"""
check-content-quality.py — Comprehensive content quality & SEO audit for HTML pages.

Usage:
    python check-content-quality.py                              # Audit all pages/
    python check-content-quality.py --path pages/series/digital-transformation
    python check-content-quality.py --path pages/series/digital-transformation --filter capstone
    python check-content-quality.py --fix                        # Auto-fix what's possible

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
"""
import argparse
import os
import re
import sys
from pathlib import Path


# ============================================================
# CONFIGURATION
# ============================================================

META_DESC_MIN = 120
META_DESC_MAX = 160
THIN_CONTENT_THRESHOLD = 1500  # words
WPM_READING_SPEED = 200

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
    
    # --- 8. INTERNAL LINK CHECK ---
    file_dir = os.path.dirname(filepath)
    local_links = re.findall(r'href="(digital-transformation-[^"#]+\.html)"', content)
    broken_links = []
    for link in local_links:
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
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    repo_root = script_dir.parent

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
