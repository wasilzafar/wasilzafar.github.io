#!/usr/bin/env python3
"""
Local link checker for wasilzafar.github.io
Crawls all HTML files on disk and reports broken internal links.

Usage:
    python check_links.py                  # Check all links (a, link, script src, img src)
    python check_links.py --pages-only     # Only check <a href> page links
    python check_links.py --fix-report     # Output a machine-readable fix report (JSON)

Exit codes:
    0 = No broken links
    1 = Broken links found
"""

import os
import sys
import json
import argparse
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from collections import defaultdict

# ── Config ────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).parent.resolve()

SKIP_DIRS = {'.git', '.github', 'node_modules', '__pycache__'}

EXTERNAL_SCHEMES = ('http://', 'https://', 'mailto:', 'tel:', 'javascript:', 'data:', '//')

# CDN / well-known external absolute paths to skip (won't resolve to local files)
SKIP_PATH_PATTERNS = ('/cdn-cgi/', '/.well-known/')

# Files to skip entirely (templates with intentional placeholder hrefs)
SKIP_FILES = {'.template-blog-post.html'}

# ── HTML Parser ───────────────────────────────────────────────────────────────

class LinkExtractor(HTMLParser):
    """Extracts internal href/src attributes and their line numbers."""

    LINK_ATTRS = {
        'a':      ['href'],
        'link':   ['href'],
        'script': ['src'],
        'img':    ['src'],
        'source': ['src', 'srcset'],
    }

    def __init__(self, pages_only=False):
        super().__init__()
        self.pages_only = pages_only
        self.links = []  # list of (attr_value, lineno, tag)

    def handle_starttag(self, tag, attrs):
        if self.pages_only and tag != 'a':
            return
        attr_names = self.LINK_ATTRS.get(tag, [])
        attr_dict = dict(attrs)
        for attr in attr_names:
            val = attr_dict.get(attr, '').strip()
            if val:
                self.links.append((val, self.getpos()[0], tag))


# ── Link Resolution ───────────────────────────────────────────────────────────

def is_external(href: str) -> bool:
    """True if href is external, a placeholder, a pure anchor, or should be skipped."""
    if not href or href.startswith('#'):
        return True
    # Template placeholders like [article-slug].html or [CATEGORY].html
    if '[' in href or ']' in href:
        return True
    if any(href.startswith(p) for p in EXTERNAL_SCHEMES):
        return True
    if any(p in href for p in SKIP_PATH_PATTERNS):
        return True
    return False


def resolve_href(source_file: Path, href: str) -> Path | None:
    """
    Resolve href to an absolute filesystem path.
    Returns None if it's external or can't be resolved.
    """
    # Strip fragment anchor
    href_clean = href.split('#')[0].split('?')[0]
    if not href_clean:
        return None

    parsed = urlparse(href_clean)
    if parsed.scheme or parsed.netloc:
        return None  # external

    if href_clean.startswith('/'):
        # Absolute from site root → map to REPO_ROOT
        target = REPO_ROOT / href_clean.lstrip('/')
    else:
        # Relative from source file's directory
        target = (source_file.parent / href_clean).resolve()

    return target


# ── Checker ───────────────────────────────────────────────────────────────────

def check_all_links(pages_only: bool = False) -> list[dict]:
    """Walk all HTML files and collect broken links."""
    broken = []
    stats = {'files': 0, 'links_checked': 0}

    for root, dirs, files in os.walk(REPO_ROOT):
        # Prune skip dirs in-place
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)

        for filename in sorted(files):
            if not filename.endswith('.html') or filename in SKIP_FILES:
                continue

            filepath = Path(root) / filename
            stats['files'] += 1

            try:
                content = filepath.read_text(encoding='utf-8', errors='replace')
            except OSError as exc:
                print(f'  [ERROR] Cannot read {filepath}: {exc}', file=sys.stderr)
                continue

            parser = LinkExtractor(pages_only=pages_only)
            parser.feed(content)

            for href, lineno, tag in parser.links:
                if is_external(href):
                    continue

                stats['links_checked'] += 1
                target = resolve_href(filepath, href)

                if target is None:
                    continue

                if not target.exists():
                    # Make paths relative to repo root for display
                    try:
                        source_rel = str(filepath.relative_to(REPO_ROOT))
                        target_rel = str(target.relative_to(REPO_ROOT))
                    except ValueError:
                        source_rel = str(filepath)
                        target_rel = str(target)

                    broken.append({
                        'source':     source_rel,
                        'line':       lineno,
                        'tag':        tag,
                        'href':       href,
                        'target':     target_rel,
                    })

    print(f'\nScanned {stats["files"]} HTML files, '
          f'{stats["links_checked"]} internal links checked.\n')
    return broken


# ── Reporting ─────────────────────────────────────────────────────────────────

def print_report(broken: list[dict]) -> None:
    """Print a human-readable grouped report."""
    if not broken:
        print('✓  No broken links found!\n')
        return

    width = 72
    print('=' * width)
    print(f'  BROKEN LINKS: {len(broken)} found')
    print('=' * width)

    by_source = defaultdict(list)
    for b in broken:
        by_source[b['source']].append(b)

    for source, issues in sorted(by_source.items()):
        count = len(issues)
        print(f'\n  [{count} broken]  {source}')
        print(f'  {"─" * (width - 2)}')
        for b in sorted(issues, key=lambda x: x['line']):
            tag_label = f'<{b["tag"]}>'
            print(f'    Line {b["line"]:5d}  {tag_label:8s}  {b["href"]}')
            print(f'           {"↳":8s}  Target: {b["target"]}')

    print(f'\n{"=" * width}')
    print(f'  Total: {len(broken)} broken link(s) in {len(by_source)} file(s)')
    print(f'{"=" * width}\n')


def write_json_report(broken: list[dict], output_path: Path) -> None:
    """Write a JSON report for machine consumption or scripted fixing."""
    report = {
        'broken_count': len(broken),
        'broken_links': broken,
    }
    output_path.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f'JSON report written to: {output_path}')


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description='Check internal links in all HTML files of the site.'
    )
    parser.add_argument(
        '--pages-only', action='store_true',
        help='Only check <a href> page links (skip CSS/JS/img src)'
    )
    parser.add_argument(
        '--fix-report', action='store_true',
        help='Also write broken_links.json to repo root'
    )
    args = parser.parse_args()

    print(f'\nLink Checker — wasilzafar.github.io')
    print(f'Root: {REPO_ROOT}')
    print(f'Mode: {"pages only (<a> tags)" if args.pages_only else "all resources (a, link, script, img)"}')
    print()

    broken = check_all_links(pages_only=args.pages_only)
    print_report(broken)

    if args.fix_report:
        write_json_report(broken, REPO_ROOT / 'broken_links.json')

    return 1 if broken else 0


if __name__ == '__main__':
    sys.exit(main())
