# ------------------------------------------------------------------
# SEO-GSC-Manager  ·  Crawl Error Auditor  (Search Console API)
# ------------------------------------------------------------------
# fetch_sitemaps()     — list sitemaps + error/warning counts
# fetch_crawl_errors() — URL-inspect pages from the sitemap that
#                        have crawl issues and export to CSV
# start_validation()   — placeholder for triggering validation
#                        (GSC does not expose a public API for this;
#                         guidance is provided via the CLI).
# ------------------------------------------------------------------

from __future__ import annotations

import csv
import os
from datetime import datetime
from pathlib import Path

from auth import get_search_console_service, retry_api_call
from config import SITE_URL

_OUTPUT_DIR = Path(__file__).resolve().parent / "reports"


# ---- Sitemaps ----------------------------------------------------------

def fetch_sitemaps() -> list[dict]:
    """Return sitemap metadata for the configured GSC property."""
    service = get_search_console_service()
    resp = retry_api_call(
        service.sitemaps().list(siteUrl=SITE_URL).execute
    )
    sitemaps = resp.get("sitemap", [])

    print(f"\n  📑  {len(sitemaps)} sitemap(s) found for {SITE_URL}\n")
    for sm in sitemaps:
        status = "pending" if sm.get("isPending") else "processed"
        print(f"    • {sm['path']}")
        print(f"      Status: {status}  |  "
              f"Errors: {sm.get('errors', 0)}  |  "
              f"Warnings: {sm.get('warnings', 0)}")
        for c in sm.get("contents", []):
            print(f"      Content {c.get('type', '?')}: "
                  f"{c.get('submitted', '?')} submitted")
    print()
    return sitemaps


# ---- Crawl error audit via URL Inspection ------------------------------

def fetch_crawl_errors(urls: list[str] | None = None) -> str:
    """Inspect *urls* (or a default set) and export any with crawl
    issues to a CSV file.

    Returns the path to the CSV file.
    """
    from inspection import inspect_url_health  # local import to avoid circular

    if urls is None:
        print("  ℹ️   No URL list provided. Pass URLs via --urls or a file.")
        return ""

    _OUTPUT_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_path = _OUTPUT_DIR / f"crawl_errors_{timestamp}.csv"

    rows: list[dict] = []
    for url in urls:
        try:
            result = inspect_url_health(url)
        except Exception as exc:
            result = {
                "url": url,
                "verdict": "ERROR",
                "coverageState": str(exc),
                "pageFetchState": "",
                "robotsTxtState": "",
                "lastCrawlTime": "",
                "googleCanonical": "",
                "issues": [str(exc)],
            }

        if result.get("issues"):
            rows.append({
                "url": result["url"],
                "verdict": result.get("verdict", ""),
                "coverage": result.get("coverageState", ""),
                "page_fetch": result.get("pageFetchState", ""),
                "robots_txt": result.get("robotsTxtState", ""),
                "last_crawl": result.get("lastCrawlTime", ""),
                "google_canonical": result.get("googleCanonical", ""),
                "issues": " | ".join(result.get("issues", [])),
            })

    if rows:
        fieldnames = list(rows[0].keys())
        with open(csv_path, "w", newline="", encoding="utf-8") as fh:
            writer = csv.DictWriter(fh, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"\n  📄  {len(rows)} URL(s) with issues exported to:\n"
              f"      {csv_path}\n")
    else:
        print("\n  ✅  No crawl issues found for the provided URLs.\n")
        csv_path = ""

    return str(csv_path)


# ---- Validation trigger ------------------------------------------------

def start_validation(error_type: str | None = None) -> None:
    """Print guidance for starting validation in GSC.

    The Search Console API does not expose a programmatic
    "Start Validation" endpoint.  This function logs the manual
    steps so developers know what to do after deploying fixes.
    """
    print("\n" + "=" * 70)
    print("  VALIDATION TRIGGER — Manual Steps Required")
    print("=" * 70)
    if error_type:
        print(f"\n  Error type to validate: {error_type}\n")
    print(
        "  Google Search Console does not expose a public API for\n"
        "  'Start Validation'.  After deploying your fixes:\n\n"
        "  1. Open Google Search Console:\n"
        "     https://search.google.com/search-console\n\n"
        "  2. Navigate to  Pages → select the issue category.\n\n"
        "  3. Click  'VALIDATE FIX'  next to the specific error type.\n\n"
        "  4. Google will re-crawl affected URLs over the next few days\n"
        "     and update the validation status.\n\n"
        "  TIP: Use the  'inspect'  command of this tool to verify\n"
        "  individual URLs are now returning the expected status before\n"
        "  triggering bulk validation in the GSC UI.\n"
    )
    print("=" * 70 + "\n")
