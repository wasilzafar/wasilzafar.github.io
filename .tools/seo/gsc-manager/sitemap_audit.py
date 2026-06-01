# ------------------------------------------------------------------
# SEO-GSC-Manager  ·  Sitemap Audit  (Full Coverage Report)
# ------------------------------------------------------------------
# audit_sitemap()  — Parse local sitemap.xml, inspect every URL via
#                    the URL Inspection API, and group results by
#                    GSC coverage state. Exports full CSV + summary.
# ------------------------------------------------------------------

from __future__ import annotations

import csv
import json
import sys
import time
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from inspection import inspect_url_health

_OUTPUT_DIR = Path(__file__).resolve().parent / "reports"

# GSC coverage state categories (matches the GSC UI groupings)
_CATEGORY_ORDER = [
    "Submitted and indexed",
    "Indexed, not submitted in sitemap",
    "Crawled - currently not indexed",
    "Discovered - currently not indexed",
    "Page with redirect",
    "Not found (404)",
    "Soft 404",
    "Duplicate without user-selected canonical",
    "Duplicate, Google chose different canonical than user",
    "Alternative page with proper canonical tag",
    "Blocked by robots.txt",
    "Excluded by 'noindex' tag",
    "Server error (5xx)",
    "Page fetch error",
]


def _parse_sitemap(sitemap_path: str) -> list[str]:
    """Extract all <loc> URLs from a local sitemap.xml file."""
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    # Handle namespace
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []
    for url_el in root.findall("sm:url", ns):
        loc = url_el.find("sm:loc", ns)
        if loc is not None and loc.text:
            urls.append(loc.text.strip())
    return urls


def audit_sitemap(
    sitemap_path: str,
    resume_from: int = 0,
    limit: int | None = None,
) -> None:
    """Full sitemap audit: inspect every URL and group by coverage state.

    Args:
        sitemap_path: Path to local sitemap.xml
        resume_from:  Skip the first N URLs (for resuming after interruption)
        limit:        Only inspect the first N URLs (for testing)
    """
    print(f"\n  📂  Parsing sitemap: {sitemap_path}")
    urls = _parse_sitemap(sitemap_path)
    print(f"  📊  Found {len(urls)} URLs in sitemap\n")

    if resume_from > 0:
        urls = urls[resume_from:]
        print(f"  ⏩  Resuming from URL #{resume_from + 1} ({len(urls)} remaining)\n")

    if limit:
        urls = urls[:limit]
        print(f"  🔢  Limited to first {limit} URLs\n")

    _OUTPUT_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_path = _OUTPUT_DIR / f"sitemap_audit_{timestamp}.csv"
    json_path = _OUTPUT_DIR / f"sitemap_audit_{timestamp}.json"

    results: list[dict] = []
    groups: dict[str, list[str]] = defaultdict(list)
    errors: list[dict] = []
    total = len(urls)

    for i, url in enumerate(urls, 1):
        pct = (i / total) * 100
        sys.stdout.write(f"\r  🔍  [{i}/{total}] ({pct:.0f}%) Inspecting...")
        sys.stdout.flush()

        try:
            result = inspect_url_health(url)
            results.append(result)

            coverage = result.get("coverageState", "Unknown")
            groups[coverage].append(url)

            # Rate-limit: ~2 req/sec to stay well within quotas
            if i % 10 == 0:
                time.sleep(1)

        except Exception as exc:
            error_str = str(exc)
            errors.append({"url": url, "error": error_str})
            groups["API Error"].append(url)
            # Back off on errors
            if "429" in error_str or "quota" in error_str.lower():
                print(f"\n  ⏳  Rate limited at URL #{i}. Waiting 60s...")
                time.sleep(60)
            else:
                time.sleep(2)

    print(f"\r  ✅  Inspected {total} URLs" + " " * 30)

    # ---- Write CSV ----
    fieldnames = [
        "url", "verdict", "coverageState", "indexingState",
        "crawledAs", "pageFetchState", "robotsTxtState",
        "lastCrawlTime", "googleCanonical", "userCanonical",
        "mobileUsability", "richResults", "issues",
    ]
    with open(csv_path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for r in results:
            row = dict(r)
            row["issues"] = " | ".join(r.get("issues", []))
            row["referringUrls"] = ""  # skip list fields
            row["sitemaps"] = ""
            writer.writerow(row)
        for e in errors:
            writer.writerow({
                "url": e["url"], "verdict": "ERROR",
                "coverageState": e["error"], "issues": e["error"],
            })

    # ---- Write JSON summary ----
    summary = {
        "audit_date": datetime.now().isoformat(),
        "sitemap": sitemap_path,
        "total_urls": total + resume_from,
        "inspected": total,
        "resumed_from": resume_from,
        "categories": {},
    }
    for cat in _CATEGORY_ORDER:
        if cat in groups:
            summary["categories"][cat] = {
                "count": len(groups[cat]),
                "urls": groups[cat],
            }
    # Add any categories not in the predefined order
    for cat, url_list in sorted(groups.items()):
        if cat not in summary["categories"]:
            summary["categories"][cat] = {
                "count": len(url_list),
                "urls": url_list,
            }

    with open(json_path, "w", encoding="utf-8") as fh:
        json.dump(summary, fh, indent=2)

    # ---- Print report ----
    _print_summary(groups, total, errors, csv_path, json_path)


def _print_summary(
    groups: dict[str, list[str]],
    total: int,
    errors: list[dict],
    csv_path: Path,
    json_path: Path,
) -> None:
    """Print a categorized summary report to stdout."""
    print("\n" + "=" * 72)
    print("  SITEMAP AUDIT REPORT — Coverage State Summary")
    print("=" * 72)

    # Print in defined order first, then any extras
    printed = set()
    for cat in _CATEGORY_ORDER:
        if cat in groups:
            _print_category(cat, groups[cat])
            printed.add(cat)

    for cat in sorted(groups.keys()):
        if cat not in printed:
            _print_category(cat, groups[cat])

    # Totals
    print("\n" + "-" * 72)
    indexed = len(groups.get("Submitted and indexed", []))
    indexed += len(groups.get("Indexed, not submitted in sitemap", []))
    not_indexed = total - indexed - len(errors)
    print(f"  📊  TOTALS:")
    print(f"      Indexed:      {indexed}")
    print(f"      Not indexed:  {not_indexed}")
    print(f"      Errors:       {len(errors)}")
    print(f"      Total:        {total}")

    print(f"\n  📄  Full CSV:  {csv_path}")
    print(f"  📋  JSON:      {json_path}")
    print("=" * 72 + "\n")


def _print_category(cat: str, urls: list[str]) -> None:
    """Print one coverage category with count and sample URLs."""
    icon = "✅" if "indexed" in cat.lower() and "not" not in cat.lower() else "⚠️ "
    if "404" in cat or "error" in cat.lower():
        icon = "❌"
    elif "redirect" in cat.lower():
        icon = "↪️ "
    elif "duplicate" in cat.lower() or "canonical" in cat.lower():
        icon = "🔄"

    print(f"\n  {icon}  {cat}  ({len(urls)})")
    # Show first 5 URLs as samples
    for url in urls[:5]:
        short = url.replace("https://www.wasilzafar.com/", "/")
        print(f"        • {short}")
    if len(urls) > 5:
        print(f"        ... and {len(urls) - 5} more (see CSV/JSON)")
