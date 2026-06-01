#!/usr/bin/env python3
"""
Fetch the GTM implementation for GTM-PBS8M2JR via the Tag Manager API v2.

Usage:
    python fetch-gtm.py [--output OUTPUT] [--account-id ACCOUNT_ID]

Authentication:
    1. Go to https://console.cloud.google.com/
    2. Create a project, enable the "Tag Manager API"
    3. Create OAuth 2.0 credentials (Desktop app type)
    4. Download as credentials.json and place it alongside this script
    5. On first run a browser window opens for consent; token.json is saved for reuse

Output:
    Saves a timestamped JSON report to --output (default: gtm-report.json)
    and prints a summary table to stdout.

Dependencies:
    pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

TARGET_CONTAINER_PUBLIC_ID = "GTM-PBS8M2JR"

# Read-only scope – sufficient to inspect the implementation
SCOPES = ["https://www.googleapis.com/auth/tagmanager.readonly"]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_FILE = os.path.join(SCRIPT_DIR, "credentials.json")
TOKEN_FILE = os.path.join(SCRIPT_DIR, "token.json")

# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------


def get_service():
    """Authenticate and return a Tag Manager API service object."""
    creds = None

    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                sys.exit(
                    f"ERROR: {CREDENTIALS_FILE} not found.\n"
                    "Download OAuth 2.0 credentials from Google Cloud Console and "
                    "save them as credentials.json in the .tools/ folder."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
        print(f"Token saved to {TOKEN_FILE}")

    return build("tagmanager", "v2", credentials=creds)


# ---------------------------------------------------------------------------
# API helpers
# ---------------------------------------------------------------------------


def list_all(request_fn, key):
    """Paginate through all results for a GTM list endpoint."""
    results = []
    req = request_fn()
    while req is not None:
        resp = req.execute()
        results.extend(resp.get(key, []))
        req = request_fn.__self__.list_next(req, resp) if hasattr(request_fn, "__self__") else None
    return results


def safe_list(callable_obj, result_key):
    """Execute a list call and return items, returning [] on 404."""
    try:
        resp = callable_obj.execute()
        return resp.get(result_key, [])
    except HttpError as e:
        if e.resp.status == 404:
            return []
        raise


# ---------------------------------------------------------------------------
# Fetch functions
# ---------------------------------------------------------------------------


def find_container(service, account_id=None):
    """
    Locate the container matching TARGET_CONTAINER_PUBLIC_ID.
    If account_id is provided only that account is searched; otherwise all
    accounts accessible to the authenticated user are scanned.
    """
    accounts_resp = service.accounts().list().execute()
    accounts = accounts_resp.get("account", [])

    if not accounts:
        sys.exit("ERROR: No GTM accounts accessible with this credential.")

    if account_id:
        accounts = [a for a in accounts if a.get("accountId") == str(account_id)]
        if not accounts:
            sys.exit(f"ERROR: Account {account_id} not found or not accessible.")

    for account in accounts:
        acct_path = account["path"]
        containers_resp = service.accounts().containers().list(parent=acct_path).execute()
        for container in containers_resp.get("container", []):
            if container.get("publicId") == TARGET_CONTAINER_PUBLIC_ID:
                return account, container

    sys.exit(
        f"ERROR: Container {TARGET_CONTAINER_PUBLIC_ID} not found in any accessible account.\n"
        "Make sure the authenticated user has at least Read access to the container."
    )


def fetch_workspaces(service, container_path):
    return safe_list(
        service.accounts().containers().workspaces().list(parent=container_path),
        "workspace",
    )


def fetch_workspace_entities(service, workspace_path):
    """Fetch tags, triggers, and variables for a single workspace."""
    tags = safe_list(
        service.accounts().containers().workspaces().tags().list(parent=workspace_path),
        "tag",
    )
    triggers = safe_list(
        service.accounts().containers().workspaces().triggers().list(parent=workspace_path),
        "trigger",
    )
    variables = safe_list(
        service.accounts().containers().workspaces().variables().list(parent=workspace_path),
        "variable",
    )
    built_ins = safe_list(
        service.accounts().containers().workspaces().built_in_variables().list(parent=workspace_path),
        "builtInVariable",
    )
    return {
        "tags": tags,
        "triggers": triggers,
        "variables": variables,
        "builtInVariables": built_ins,
    }


def fetch_published_version(service, container_path):
    """Fetch the latest published container version (may not exist)."""
    try:
        resp = (
            service.accounts()
            .containers()
            .versions()
            .live(parent=container_path)
            .execute()
        )
        return resp
    except HttpError as e:
        if e.resp.status == 404:
            return None
        raise


# ---------------------------------------------------------------------------
# Reporting helpers
# ---------------------------------------------------------------------------


def summarise_tag(tag):
    return {
        "tagId": tag.get("tagId"),
        "name": tag.get("name"),
        "type": tag.get("type"),
        "firingTriggerIds": tag.get("firingTriggerIds", []),
        "blockingTriggerIds": tag.get("blockingTriggerIds", []),
        "paused": tag.get("paused", False),
        "parameters": tag.get("parameter", []),
    }


def summarise_trigger(trigger):
    return {
        "triggerId": trigger.get("triggerId"),
        "name": trigger.get("name"),
        "type": trigger.get("type"),
        "filter": trigger.get("filter", []),
        "autoEventFilter": trigger.get("autoEventFilter", []),
    }


def summarise_variable(var):
    return {
        "variableId": var.get("variableId"),
        "name": var.get("name"),
        "type": var.get("type"),
        "parameters": var.get("parameter", []),
    }


def print_summary(report):
    """Print a compact human-readable summary to stdout."""
    acct = report["account"]
    ctr = report["container"]

    print("\n" + "=" * 60)
    print(f"  GTM Implementation Report — {TARGET_CONTAINER_PUBLIC_ID}")
    print("=" * 60)
    print(f"  Account : {acct['name']}  (ID: {acct['accountId']})")
    print(f"  Container: {ctr['name']}  (ID: {ctr['containerId']})")
    print(f"  Fetched  : {report['fetchedAt']}")
    print()

    for ws in report["workspaces"]:
        entities = ws["entities"]
        print(f"  Workspace: \"{ws['name']}\"  (ID: {ws['workspaceId']})")
        print(f"    Tags          : {len(entities['tags'])}")
        print(f"    Triggers      : {len(entities['triggers'])}")
        print(f"    Variables     : {len(entities['variables'])}")
        print(f"    Built-ins     : {len(entities['builtInVariables'])}")

        if entities["tags"]:
            print()
            print("    --- Tags ---")
            for t in entities["tags"]:
                paused = " [PAUSED]" if t.get("paused") else ""
                print(f"      [{t['tagId']:>4}] {t['name']!r}  type={t['type']}{paused}")

        if entities["triggers"]:
            print()
            print("    --- Triggers ---")
            for t in entities["triggers"]:
                print(f"      [{t['triggerId']:>4}] {t['name']!r}  type={t['type']}")

        if entities["variables"]:
            print()
            print("    --- Variables ---")
            for v in entities["variables"]:
                print(f"      [{v['variableId']:>4}] {v['name']!r}  type={v['type']}")

        print()

    if report.get("publishedVersion"):
        pv = report["publishedVersion"]
        print(f"  Published version: {pv.get('containerVersionId')}  —  {pv.get('name', '(unnamed)')}")
        tags_count = len(pv.get("tag", []))
        trig_count = len(pv.get("trigger", []))
        var_count  = len(pv.get("variable", []))
        print(f"    Tags={tags_count}  Triggers={trig_count}  Variables={var_count}")

    print("=" * 60)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description=f"Fetch GTM implementation for {TARGET_CONTAINER_PUBLIC_ID}.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--account-id",
        help="GTM numeric account ID (optional; auto-discovers if omitted)",
    )
    parser.add_argument(
        "--output",
        default=os.path.join(SCRIPT_DIR, "gtm-report.json"),
        help="Path to save the JSON report (default: .tools/gtm-report.json)",
    )
    parser.add_argument(
        "--no-published",
        action="store_true",
        help="Skip fetching the published (live) container version",
    )
    args = parser.parse_args()

    print(f"Authenticating with Google Tag Manager API…")
    service = get_service()

    print(f"Locating container {TARGET_CONTAINER_PUBLIC_ID}…")
    account, container = find_container(service, account_id=args.account_id)
    container_path = container["path"]

    print(f"Found: {account['name']} / {container['name']}  ({container_path})")

    # Workspaces
    print("Fetching workspaces…")
    workspaces = fetch_workspaces(service, container_path)

    workspace_reports = []
    for ws in workspaces:
        ws_path = ws["path"]
        print(f"  Workspace: {ws['name']} ({ws_path})")
        entities = fetch_workspace_entities(service, ws_path)
        workspace_reports.append(
            {
                "workspaceId": ws.get("workspaceId"),
                "name": ws.get("name"),
                "description": ws.get("description", ""),
                "path": ws_path,
                "entities": {
                    "tags": [summarise_tag(t) for t in entities["tags"]],
                    "triggers": [summarise_trigger(t) for t in entities["triggers"]],
                    "variables": [summarise_variable(v) for v in entities["variables"]],
                    "builtInVariables": entities["builtInVariables"],
                },
            }
        )

    # Published version
    published_version = None
    if not args.no_published:
        print("Fetching published (live) version…")
        published_version = fetch_published_version(service, container_path)
        if published_version:
            print(f"  Live version: {published_version.get('containerVersionId')}")
        else:
            print("  No published version found.")

    # Build report
    report = {
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "containerId": TARGET_CONTAINER_PUBLIC_ID,
        "account": {
            "accountId": account.get("accountId"),
            "name": account.get("name"),
            "path": account.get("path"),
        },
        "container": {
            "containerId": container.get("containerId"),
            "publicId": container.get("publicId"),
            "name": container.get("name"),
            "usageContext": container.get("usageContext", []),
            "path": container_path,
        },
        "workspaces": workspace_reports,
        "publishedVersion": published_version,
    }

    # Save
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"\nReport saved to: {args.output}")

    # Summary
    print_summary(report)


if __name__ == "__main__":
    main()
