#!/usr/bin/env python3
"""Validate <link rel="canonical"> on every sitemap page.

For each URL listed in sitemap.xml, verify that the corresponding HTML file:
  1. Contains a <link rel="canonical" href="..."> tag, AND
  2. That tag's href exactly equals the file's own site URL.

Rationale: a canonical pointing at a different URL tells Google to drop this
page from the index in favor of another. That is a legitimate pattern for true
duplicates, but on this site every URL in sitemap.xml is intended to be
independently indexed. Mismatches historically shipped undetected (see
ai-app-dev-xtreme/{assessment,part07,part18}.html) and caused GSC to report
"Duplicate, Google chose different canonical" / "Alternate page with proper
canonical tag" coverage states.
"""

from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent.parent  # .github/scripts/seo/ -> repo root
SITEMAP_PATH = REPO_ROOT / "sitemap.xml"
BASE_URL = "https://www.wasilzafar.com/"
NAMESPACE = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

CANONICAL_RE = re.compile(
    r'<link\s+rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\'][^>]*/?>',
    re.IGNORECASE,
)


def load_sitemap_urls() -> list[str]:
    root = ET.parse(SITEMAP_PATH).getroot()
    return [
        loc.text.strip()
        for loc in root.findall("sm:url/sm:loc", NAMESPACE)
        if loc.text and loc.text.strip()
    ]


def url_to_path(url: str) -> Path:
    rel = url.removeprefix(BASE_URL).lstrip("/")
    if not rel:
        rel = "index.html"
    return REPO_ROOT / rel


def main() -> int:
    urls = load_sitemap_urls()
    missing: list[str] = []
    mismatched: list[tuple[str, str]] = []  # (expected_url, actual_canonical)
    duplicates: list[tuple[str, int]] = []  # (url, count)

    for url in urls:
        path = url_to_path(url)
        if not path.is_file():
            # check_sitemap.py already reports this; skip here to avoid duplicate noise.
            continue
        html = path.read_text(encoding="utf-8", errors="replace")
        matches = CANONICAL_RE.findall(html)
        if not matches:
            missing.append(url)
            continue
        if len(matches) > 1:
            duplicates.append((url, len(matches)))
        actual = matches[0].strip()
        if actual != url:
            mismatched.append((url, actual))

    print(f"Sitemap URLs checked:  {len(urls)}")
    print(f"Missing canonical:     {len(missing)}")
    print(f"Mismatched canonical:  {len(mismatched)}")
    print(f"Duplicate canonical:   {len(duplicates)}")

    if missing:
        print("\nPages missing (or with malformed) <link rel=\"canonical\">:")
        for url in missing:
            print(f"  {url}")

    if mismatched:
        print("\nPages whose canonical points elsewhere:")
        for expected, actual in mismatched:
            print(f"  {expected}")
            print(f"    canonical: {actual}")

    if duplicates:
        print("\nPages with more than one <link rel=\"canonical\"> tag:")
        for url, count in duplicates:
            print(f"  {url}  ({count} tags)")

    return 1 if (missing or mismatched or duplicates) else 0


if __name__ == "__main__":
    sys.exit(main())
