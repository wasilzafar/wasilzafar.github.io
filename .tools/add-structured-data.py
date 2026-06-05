#!/usr/bin/env python3
"""
add-structured-data.js — Inject JSON-LD Article structured data into all blog articles.

Adds a <script type="application/ld+json"> block before </head> with:
- @type: Article (or TechArticle for series pages)
- headline, description, datePublished, author, publisher
- image (from og:image)
- mainEntityOfPage (canonical URL)

Usage: python add-structured-data.py
       python add-structured-data.py --path pages/series/cmake-mastery
       python add-structured-data.py --dry-run
"""
import os
import re
import sys
import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent

SITE_NAME = "Wasil Zafar"
SITE_URL = "https://www.wasilzafar.com"
AUTHOR_NAME = "Wasil Zafar"
AUTHOR_URL = "https://www.wasilzafar.com"
LOGO_URL = "https://www.wasilzafar.com/images/favicon_io/apple-touch-icon.png"

# Pages to skip (non-articles)
SKIP_BASENAMES = {'index.html', 'assessment.html', 'contact.html', '404.html',
                  'cookie-banner.html', 'disclaimer.html', 'privacy-policy.html'}

# Tech-related series get TechArticle type
TECH_SERIES = {
    'ai-app-dev', 'ai-app-dev-xtreme', 'ai-data-science', 'ai-in-the-wild',
    'api-development', 'arm-assembly', 'assembly-mastery', 'cloud-computing',
    'cmake-mastery', 'cmsis', 'computer-architecture', 'containers-docker',
    'data-structures', 'database-mastery', 'devops-platform-engineering',
    'distributed-systems-k8s', 'embedded-hardware', 'embedded-systems',
    'game-development', 'gnu-make', 'infrastructure-cloud-automation',
    'kernel-development', 'math-for-ai', 'monitoring-observability',
    'neural-networks', 'nlp', 'protocols-master', 'pytorch-mastery',
    'robotics-automation', 'sensors-actuators', 'software-engineering',
    'stm32-hal', 'system-design', 'systems-thinking-architecture',
    'tensorflow-mastery', 'unity-game-engine', 'usb-dev',
    'computing-systems-foundations', 'digital-transformation',
}


def extract_meta(html, attr, value):
    """Extract meta tag content by attribute."""
    pattern = rf'<meta\s+(?:[^>]*?)?{attr}="{value}"(?:[^>]*?)content="([^"]*)"'
    m = re.search(pattern, html, re.IGNORECASE)
    if m:
        return m.group(1)
    # Try reversed order
    pattern2 = rf'<meta\s+(?:[^>]*?)content="([^"]*)"(?:[^>]*?){attr}="{value}"'
    m2 = re.search(pattern2, html, re.IGNORECASE)
    return m2.group(1) if m2 else ''


def get_title(html):
    """Get clean article title (without site name suffix)."""
    m = re.search(r'<title[^>]*>(.*?)</title>', html, re.DOTALL)
    if not m:
        return ''
    title = re.sub(r'\s+', ' ', m.group(1)).strip()
    # Remove " - Wasil Zafar" suffix
    title = re.sub(r'\s*[-|]\s*Wasil Zafar$', '', title).strip()
    return title


def get_article_type(filepath):
    """Determine if article is TechArticle or Article."""
    rel = str(filepath.relative_to(REPO_ROOT)).replace('\\', '/')
    parts = rel.split('/')
    # pages/series/[series-name]/article.html
    if 'series' in parts:
        idx = parts.index('series')
        if idx + 1 < len(parts):
            series_name = parts[idx + 1]
            if series_name in TECH_SERIES:
                return 'TechArticle'
    # Standalone tech articles in 2026/04
    if '/2026/04/' in rel:
        return 'TechArticle'
    return 'Article'


def get_word_count(html):
    """Approximate word count for wordCount property."""
    text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
    text = re.sub(r'<nav[^>]*>.*?</nav>', '', text, flags=re.DOTALL)
    text = re.sub(r'<footer[^>]*>.*?</footer>', '', text, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return len(text.split())


def build_jsonld(html, filepath):
    """Build JSON-LD structured data for an article."""
    title = get_title(html)
    description = extract_meta(html, 'name', 'description')
    published = extract_meta(html, 'property', 'article:published_time')
    og_image = extract_meta(html, 'property', 'og:image')
    canonical = ''
    m = re.search(r'<link rel="canonical" href="([^"]*)"', html)
    if m:
        canonical = m.group(1)
    
    article_type = get_article_type(filepath)
    word_count = get_word_count(html)
    
    jsonld = {
        "@context": "https://schema.org",
        "@type": article_type,
        "headline": title[:110],  # Google limits to 110 chars
        "description": description[:300],
        "author": {
            "@type": "Person",
            "name": AUTHOR_NAME,
            "url": AUTHOR_URL
        },
        "publisher": {
            "@type": "Person",
            "name": SITE_NAME,
            "url": SITE_URL
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical or SITE_URL
        },
        "wordCount": word_count,
        "inLanguage": "en"
    }
    
    if published:
        jsonld["datePublished"] = published
        jsonld["dateModified"] = published  # Same as published for now
    
    if og_image:
        jsonld["image"] = {
            "@type": "ImageObject",
            "url": og_image,
            "width": 1200,
            "height": 630
        }
    
    return jsonld


def inject_jsonld(html, jsonld):
    """Inject JSON-LD script tag before </head>."""
    script = f'    <script type="application/ld+json">\n    {json.dumps(jsonld, ensure_ascii=False)}\n    </script>\n'
    # Insert before </head>
    return html.replace('</head>', script + '</head>', 1)


def process_file(filepath, dry_run=False):
    """Process a single file. Returns True if modified."""
    html = filepath.read_text(encoding='utf-8', errors='replace')
    
    # Skip if already has structured data
    if 'application/ld+json' in html:
        return False
    
    # Skip non-article pages
    if filepath.name in SKIP_BASENAMES:
        return False
    
    # Must have a title and description to be a proper article
    if '<title' not in html or 'name="description"' not in html:
        return False
    
    jsonld = build_jsonld(html, filepath)
    
    if not jsonld['headline']:
        return False
    
    if dry_run:
        return True
    
    new_html = inject_jsonld(html, jsonld)
    filepath.write_text(new_html, encoding='utf-8', newline='\n')
    return True


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Add JSON-LD Article structured data to all blog pages.')
    parser.add_argument('--path', type=str, default=None, help='Relative path to process')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be changed without modifying files')
    args = parser.parse_args()
    
    if args.path:
        scan_root = REPO_ROOT / args.path
    else:
        scan_root = REPO_ROOT / 'pages'
    
    if not scan_root.exists():
        print(f"ERROR: Path not found: {scan_root}")
        sys.exit(1)
    
    html_files = sorted(scan_root.rglob('*.html'))
    
    modified = 0
    skipped = 0
    already_has = 0
    
    for filepath in html_files:
        html = filepath.read_text(encoding='utf-8', errors='replace')
        if 'application/ld+json' in html:
            already_has += 1
            continue
        if filepath.name in SKIP_BASENAMES:
            skipped += 1
            continue
        
        result = process_file(filepath, dry_run=args.dry_run)
        if result:
            modified += 1
            if args.dry_run:
                rel = filepath.relative_to(REPO_ROOT)
                print(f"  Would add: {rel}")
        else:
            skipped += 1
    
    action = "Would modify" if args.dry_run else "Modified"
    print(f"\n{'='*60}")
    print(f"  {action}: {modified} files")
    print(f"  Already has schema: {already_has}")
    print(f"  Skipped: {skipped}")
    print(f"  Total scanned: {len(html_files)}")
    print(f"{'='*60}")
    
    if args.dry_run and modified > 0:
        print(f"\n  Run without --dry-run to apply changes.")


if __name__ == '__main__':
    main()
