#!/usr/bin/env python3
"""Check sitemap.xml coverage against local HTML files."""

from __future__ import annotations

import sys
import xml.etree.ElementTree as ET
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
SITEMAP_PATH = REPO_ROOT / "sitemap.xml"
BASE_URL = "https://www.wasilzafar.com/"
EXCLUDED_HTML = {".template-blog-post.html", "cookie-banner.html", "404.html"}
NAMESPACE = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def load_sitemap_urls() -> set[str]:
    root = ET.parse(SITEMAP_PATH).getroot()
    return {
        loc.text.strip()
        for loc in root.findall("sm:url/sm:loc", NAMESPACE)
        if loc.text and loc.text.strip()
    }


def build_expected_urls() -> set[str]:
    urls = {BASE_URL}
    for html_file in REPO_ROOT.rglob("*.html"):
        rel = html_file.relative_to(REPO_ROOT).as_posix()
        if rel in EXCLUDED_HTML:
            continue
        if rel == "index.html":
            continue
        urls.add(BASE_URL + rel)
    return urls


def main() -> int:
    sitemap_urls = load_sitemap_urls()
    expected_urls = build_expected_urls()

    missing = sorted(expected_urls - sitemap_urls)
    extra = sorted(sitemap_urls - expected_urls)

    print(f"Expected URLs: {len(expected_urls)}")
    print(f"Sitemap URLs:  {len(sitemap_urls)}")
    print(f"Missing:       {len(missing)}")
    print(f"Extra:         {len(extra)}")

    if missing:
        print("\nMissing URLs:")
        for url in missing:
            print(url)

    if extra:
        print("\nExtra URLs:")
        for url in extra:
            print(url)

    return 1 if missing or extra else 0


if __name__ == "__main__":
    sys.exit(main())