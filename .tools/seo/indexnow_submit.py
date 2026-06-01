#!/usr/bin/env python3
"""Submit changed site URLs to IndexNow.

Default behavior reads sitemap.xml and submits URLs in batches to api.indexnow.org.
Use --dry-run for pre-deploy validation, then run again after the key file is live.
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
HOST = "www.wasilzafar.com"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
KEY = "57540ac53495664b6fb18e4f1ff41035"
KEY_FILE = f"{KEY}.txt"
KEY_LOCATION = f"https://{HOST}/{KEY_FILE}"
SITEMAP_PATH = REPO_ROOT / "sitemap.xml"


def verify_key_location() -> None:
    request = urllib.request.Request(KEY_LOCATION, method="GET")
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            content = response.read().decode("utf-8", errors="replace").strip()
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Unable to reach key location {KEY_LOCATION}: {exc}") from exc

    if content != KEY:
        raise RuntimeError(
            f"Key location is reachable but returned unexpected content. Expected {KEY!r}, got {content!r}."
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Submit sitemap URLs to IndexNow.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the payload summary without making a network request.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Only submit the first N URLs from the sitemap.",
    )
    parser.add_argument(
        "--url",
        action="append",
        default=[],
        help="Submit one or more explicit URLs instead of the sitemap contents.",
    )
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=1000,
        help="Batch size per IndexNow request. Keep it comfortably below the protocol max.",
    )
    return parser.parse_args()


def load_sitemap_urls() -> list[str]:
    tree = ET.parse(SITEMAP_PATH)
    root = tree.getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [node.text.strip() for node in root.findall("sm:url/sm:loc", namespace) if node.text]
    if not urls:
        raise ValueError(f"No <loc> entries found in {SITEMAP_PATH}")
    return urls


def chunked(items: list[str], size: int) -> list[list[str]]:
    return [items[index:index + size] for index in range(0, len(items), size)]


def build_payload(urls: list[str]) -> bytes:
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    return json.dumps(payload).encode("utf-8")


def submit_batch(urls: list[str], dry_run: bool) -> None:
    if dry_run:
        print(f"DRY RUN: would submit {len(urls)} URLs")
        print(f"First URL: {urls[0]}")
        print(f"Key location: {KEY_LOCATION}")
        return

    request = urllib.request.Request(
        INDEXNOW_ENDPOINT,
        data=build_payload(urls),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            print(f"Submitted {len(urls)} URLs: HTTP {response.status}")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(detail) if detail else {}
        except json.JSONDecodeError:
            payload = {}

        error_code = payload.get("errorCode")
        if exc.code == 403 and error_code == "SiteVerificationNotCompleted":
            raise RuntimeError(
                "IndexNow key file is live, but Bing has not completed host verification for "
                f"{HOST}. Confirm the exact property is verified in Bing Webmaster Tools and retry later. "
                f"Raw response: {detail}"
            ) from exc

        raise RuntimeError(f"IndexNow rejected the batch with HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Failed to reach IndexNow endpoint: {exc}") from exc


def main() -> int:
    args = parse_args()
    if not (REPO_ROOT / KEY_FILE).exists():
        print(f"Missing key file at {(REPO_ROOT / KEY_FILE)}", file=sys.stderr)
        return 2

    verify_key_location()
    print(f"Verified live key file: {KEY_LOCATION}")

    urls = args.url or load_sitemap_urls()
    if args.limit > 0:
        urls = urls[:args.limit]

    if not urls:
        print("No URLs to submit.", file=sys.stderr)
        return 2

    batches = chunked(urls, args.chunk_size)
    print(f"Preparing {len(urls)} URLs in {len(batches)} batch(es)")
    print(f"Sitemap: {SITEMAP_PATH}")
    print(f"Host: {HOST}")

    for index, batch in enumerate(batches, start=1):
        print(f"Batch {index}/{len(batches)}")
        submit_batch(batch, dry_run=args.dry_run)

    if args.dry_run:
        print("Dry run completed. Deploy the key file before sending live IndexNow requests.")
    else:
        print("IndexNow submission completed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())