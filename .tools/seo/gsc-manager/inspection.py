# ------------------------------------------------------------------
# SEO-GSC-Manager  ·  Health Inspector  (URL Inspection API)
# ------------------------------------------------------------------
# inspect_url_health()  — check index status, mobile usability,
#                         and rich-result validity for a single URL.
# inspect_urls_health() — batch-inspect a list of URLs and print
#                         an issue summary report.
# ------------------------------------------------------------------

from __future__ import annotations

from auth import get_search_console_service, retry_api_call
from config import SITE_URL


def inspect_url_health(url: str) -> dict:
    """Inspect *url* via the URL Inspection API.

    Returns a dict with keys:
      verdict, coverageState, indexingState, crawledAs,
      pageFetchState, robotsTxtState, lastCrawlTime,
      googleCanonical, userCanonical, referringUrls, sitemaps,
      mobileUsability, richResults, issues
    """
    service = get_search_console_service()
    body = {
        "inspectionUrl": url,
        "siteUrl": SITE_URL,
    }
    raw = retry_api_call(
        service.urlInspection().index().inspect(body=body).execute
    )
    return _parse_inspection(url, raw)


def inspect_urls_health(urls: list[str]) -> list[dict]:
    """Inspect multiple URLs and print a summary report.

    Returns a list of parsed result dicts (one per URL).
    """
    results = []
    for url in urls:
        try:
            result = inspect_url_health(url)
            results.append(result)
        except Exception as exc:
            print(f"  ❌  {url}: {exc}")
            results.append({"url": url, "error": str(exc)})

    _print_report(results)
    return results


# ---- Internal helpers --------------------------------------------------

def _parse_inspection(url: str, raw: dict) -> dict:
    ir = raw.get("inspectionResult", {})
    idx = ir.get("indexStatusResult", {})
    mob = ir.get("mobileUsabilityResult", {})
    rich = ir.get("richResultsResult", {})

    issues: list[str] = []

    # Index status
    verdict = idx.get("verdict", "UNKNOWN")
    if verdict not in ("PASS", "NEUTRAL"):
        issues.append(f"Index verdict: {verdict}")

    coverage = idx.get("coverageState", "")
    if coverage and "Submitted and indexed" not in coverage:
        issues.append(f"Coverage: {coverage}")

    if idx.get("robotsTxtState") == "BLOCKED":
        issues.append("Blocked by robots.txt")

    if idx.get("pageFetchState") not in (None, "SUCCESSFUL"):
        issues.append(f"Page fetch: {idx.get('pageFetchState')}")

    # Mobile usability
    mob_verdict = mob.get("verdict", "")
    if mob_verdict and mob_verdict not in ("PASS", "VERDICT_UNSPECIFIED"):
        issues.append(f"Mobile usability: {mob_verdict}")
    for mi in mob.get("issues", []):
        issues.append(f"Mobile issue: {mi.get('issueType', mi.get('message', ''))}")

    # Rich results
    rich_verdict = rich.get("verdict", "")
    if rich_verdict and rich_verdict not in ("PASS", "VERDICT_UNSPECIFIED"):
        issues.append(f"Rich results: {rich_verdict}")
    for det in rich.get("detectedItems", []):
        for item in det.get("items", []):
            for ri in item.get("issues", []):
                issues.append(
                    f"Rich result ({det.get('richResultType', '?')}): "
                    f"{ri.get('issueMessage', '')} [{ri.get('severity', '')}]"
                )

    return {
        "url": url,
        "verdict": verdict,
        "coverageState": coverage,
        "indexingState": idx.get("indexingState", ""),
        "crawledAs": idx.get("crawledAs", ""),
        "pageFetchState": idx.get("pageFetchState", ""),
        "robotsTxtState": idx.get("robotsTxtState", ""),
        "lastCrawlTime": idx.get("lastCrawlTime", ""),
        "googleCanonical": idx.get("googleCanonical", ""),
        "userCanonical": idx.get("userCanonical", ""),
        "referringUrls": idx.get("referringUrls", []),
        "sitemaps": idx.get("sitemap", []),
        "mobileUsability": mob_verdict,
        "richResults": rich_verdict,
        "issues": issues,
        "inspectionLink": ir.get("inspectionResultLink", ""),
    }


def _print_report(results: list[dict]) -> None:
    print("\n" + "=" * 70)
    print("  URL HEALTH INSPECTION REPORT")
    print("=" * 70)

    healthy = 0
    unhealthy = 0

    for r in results:
        if "error" in r:
            unhealthy += 1
            print(f"\n  ❌  {r['url']}")
            print(f"      Error: {r['error']}")
            continue

        if r["issues"]:
            unhealthy += 1
            print(f"\n  ⚠️   {r['url']}")
            print(f"      Verdict : {r['verdict']}")
            print(f"      Coverage: {r['coverageState']}")
            print(f"      Issues ({len(r['issues'])}):")
            for issue in r["issues"]:
                print(f"        • {issue}")
        else:
            healthy += 1
            print(f"\n  ✅  {r['url']}")
            print(f"      Verdict: {r['verdict']}  |  "
                  f"Mobile: {r['mobileUsability'] or 'N/A'}  |  "
                  f"Rich: {r['richResults'] or 'N/A'}")

    print("\n" + "-" * 70)
    print(f"  Summary: {healthy} healthy, {unhealthy} with issues, "
          f"{len(results)} total")
    print("=" * 70 + "\n")
