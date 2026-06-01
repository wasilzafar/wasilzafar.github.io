#!/usr/bin/env python3
# ------------------------------------------------------------------
# SEO-GSC-Manager  ·  CLI entry point
# ------------------------------------------------------------------
# Usage:
#   python cli.py submit        <url> [--action UPDATED|DELETED]
#   python cli.py batch         <file>  [--action UPDATED|DELETED]
#   python cli.py status        <url>
#   python cli.py inspect       <url> [<url> ...]
#   python cli.py sitemaps
#   python cli.py audit         <file>
#   python cli.py audit-sitemap <sitemap.xml> [--resume N] [--limit N]
#   python cli.py validate      [--error-type <type>]
# ------------------------------------------------------------------

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def _read_url_file(path: str) -> list[str]:
    """Read a newline-delimited file of URLs, skipping blanks/comments."""
    p = Path(path)
    if not p.is_file():
        sys.exit(f"ERROR: File not found: {path}")
    lines = p.read_text(encoding="utf-8").splitlines()
    return [l.strip() for l in lines if l.strip() and not l.strip().startswith("#")]


def cmd_submit(args: argparse.Namespace) -> None:
    from indexing import submit_url
    submit_url(args.url, args.action)


def cmd_batch(args: argparse.Namespace) -> None:
    from indexing import submit_urls_batch
    urls = _read_url_file(args.file)
    if not urls:
        sys.exit("ERROR: URL file is empty.")
    submit_urls_batch(urls, args.action)


def cmd_status(args: argparse.Namespace) -> None:
    from indexing import get_notification_status
    import json
    result = get_notification_status(args.url)
    print(json.dumps(result, indent=2))


def cmd_inspect(args: argparse.Namespace) -> None:
    from inspection import inspect_urls_health
    inspect_urls_health(args.urls)


def cmd_sitemaps(_args: argparse.Namespace) -> None:
    from crawl_errors import fetch_sitemaps
    fetch_sitemaps()


def cmd_audit(args: argparse.Namespace) -> None:
    from crawl_errors import fetch_crawl_errors
    urls = _read_url_file(args.file)
    if not urls:
        sys.exit("ERROR: URL file is empty.")
    fetch_crawl_errors(urls)


def cmd_validate(args: argparse.Namespace) -> None:
    from crawl_errors import start_validation
    start_validation(args.error_type)


def cmd_audit_sitemap(args: argparse.Namespace) -> None:
    from sitemap_audit import audit_sitemap
    audit_sitemap(args.sitemap, resume_from=args.resume, limit=args.limit)


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="seo-gsc-manager",
        description="CLI utility for Google Search Console SEO automation.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # ---- submit --------------------------------------------------------
    p_submit = sub.add_parser(
        "submit", help="Submit a single URL to the Indexing API."
    )
    p_submit.add_argument("url", help="Fully-qualified URL to submit.")
    p_submit.add_argument(
        "--action", default="URL_UPDATED",
        choices=["URL_UPDATED", "URL_DELETED"],
        help="Notification type (default: URL_UPDATED).",
    )
    p_submit.set_defaults(func=cmd_submit)

    # ---- batch ---------------------------------------------------------
    p_batch = sub.add_parser(
        "batch",
        help="Batch-submit URLs from a newline-delimited file.",
    )
    p_batch.add_argument(
        "file", help="Path to a text file with one URL per line."
    )
    p_batch.add_argument(
        "--action", default="URL_UPDATED",
        choices=["URL_UPDATED", "URL_DELETED"],
        help="Notification type (default: URL_UPDATED).",
    )
    p_batch.set_defaults(func=cmd_batch)

    # ---- status --------------------------------------------------------
    p_status = sub.add_parser(
        "status",
        help="Get the last notification status for a URL.",
    )
    p_status.add_argument("url", help="URL-encoded URL to check.")
    p_status.set_defaults(func=cmd_status)

    # ---- inspect -------------------------------------------------------
    p_inspect = sub.add_parser(
        "inspect",
        help="Inspect one or more URLs for index/mobile/rich-result health.",
    )
    p_inspect.add_argument(
        "urls", nargs="+", help="One or more fully-qualified URLs."
    )
    p_inspect.set_defaults(func=cmd_inspect)

    # ---- sitemaps ------------------------------------------------------
    p_sitemaps = sub.add_parser(
        "sitemaps", help="List sitemaps and their error/warning counts."
    )
    p_sitemaps.set_defaults(func=cmd_sitemaps)

    # ---- audit ---------------------------------------------------------
    p_audit = sub.add_parser(
        "audit",
        help="Audit URLs from a file and export crawl issues to CSV.",
    )
    p_audit.add_argument(
        "file", help="Path to a text file with one URL per line."
    )
    p_audit.set_defaults(func=cmd_audit)

    # ---- validate ------------------------------------------------------
    p_validate = sub.add_parser(
        "validate",
        help="Show steps to trigger validation in GSC after fixes.",
    )
    p_validate.add_argument(
        "--error-type", default=None,
        help="Optional error category to validate (e.g. 'Server error (5xx)').",
    )
    p_validate.set_defaults(func=cmd_validate)

    # ---- audit-sitemap -------------------------------------------------
    p_sitemap_audit = sub.add_parser(
        "audit-sitemap",
        help="Full audit: parse sitemap.xml, inspect every URL, group by coverage state.",
    )
    p_sitemap_audit.add_argument(
        "sitemap", help="Path to local sitemap.xml file.",
    )
    p_sitemap_audit.add_argument(
        "--resume", type=int, default=0,
        help="Skip the first N URLs (resume after interruption).",
    )
    p_sitemap_audit.add_argument(
        "--limit", type=int, default=None,
        help="Only inspect the first N URLs (for testing).",
    )
    p_sitemap_audit.set_defaults(func=cmd_audit_sitemap)

    # ---- dispatch ------------------------------------------------------
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
