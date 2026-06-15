#!/usr/bin/env python3
"""
update-gtm.py — Apply all recommended GA4/GTM configuration fixes.

Usage:
    cd .tools
    uv run update-gtm.py [--dry-run] [--publish]

Options:
    --dry-run    Print planned changes without applying them
    --publish    Publish workspace after making changes (creates new version)

Requirements:
    uv add google-auth google-auth-oauthlib google-api-python-client

Auth:
    Uses credentials.json (OAuth client secret) in .tools/
    Stores write-scope token in .tools/token-write.json
    Scopes: tagmanager.edit.containers (+ tagmanager.readonly)
"""

# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "google-auth>=2.0",
#   "google-auth-oauthlib>=1.0",
#   "google-api-python-client>=2.0",
# ]
# ///

import sys
import json
import os
import argparse
from pathlib import Path

# Allow Google to return fewer scopes than requested without raising an error
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'

from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import google.oauth2.credentials

# ------------------------------------------------------------------ #
# Configuration
# ------------------------------------------------------------------ #
SCOPES = [
    'https://www.googleapis.com/auth/tagmanager.readonly',
    'https://www.googleapis.com/auth/tagmanager.edit.containers',
    'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
    'https://www.googleapis.com/auth/tagmanager.publish',
]

SCRIPT_DIR = Path(__file__).parent
CREDS_FILE = SCRIPT_DIR / 'credentials.json'
TOKEN_FILE = SCRIPT_DIR / 'token-write.json'  # separate from readonly token

ACCOUNT_ID = '6246435556'
CONTAINER_ID = '193619648'

ACCOUNT_PATH = f'accounts/{ACCOUNT_ID}'
CONTAINER_PATH = f'{ACCOUNT_PATH}/containers/{CONTAINER_ID}'

# WORKSPACE_PATH is resolved at runtime by get_or_create_workspace()
WORKSPACE_PATH = None  # set in main()

# Existing GTM IDs (from fetch report)
TRIGGER_CONTACT_ID = '6'        # pageview → should be customEvent
TRIGGER_READ_ARTICLE_ID = '14'  # linkClick → should be customEvent
TRIGGER_HP_ENGAGEMENT_ID = '8'  # fires for all engagement events

TAG_GA4_MAIN_ID = '4'           # WZ GA4 Tag (googtag)
TAG_LEAD_ID = '5'               # Lead Generation Event
TAG_HP_ENGAGEMENT_ID = '10'     # HP Engagement Tag
TAG_HP_INTEREST_ID = '13'       # Homepage Interest Card Tag
TAG_READ_ARTICLE_ID = '15'      # Read Article Tag

TRIGGER_YT_VIDEO_ID = '19'      # YouTube Video trigger (no tag yet)

VAR_MEASUREMENT_ID = '9'        # Measurement Variable (constant)
VAR_DL_SECTION = '11'
VAR_DL_INTEREST = '12'
VAR_DL_ARTICLE_SLUG = '16'
VAR_DL_CATEGORY = '17'
VAR_DL_ENGAGEMENT_TYPE = '18'

# ------------------------------------------------------------------ #
# Auth
# ------------------------------------------------------------------ #
def get_service(dry_run=False):
    creds = None

    if TOKEN_FILE.exists():
        with open(TOKEN_FILE) as f:
            token_data = json.load(f)
        creds = google.oauth2.credentials.Credentials(
            token=token_data.get('token'),
            refresh_token=token_data.get('refresh_token'),
            token_uri=token_data.get('token_uri'),
            client_id=token_data.get('client_id'),
            client_secret=token_data.get('client_secret'),
            scopes=token_data.get('scopes'),
        )

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDS_FILE.exists():
                print(f'ERROR: {CREDS_FILE} not found. Download from Google Cloud Console.')
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
            creds = flow.run_local_server(port=0, prompt='consent')

        # Save token
        with open(TOKEN_FILE, 'w') as f:
            json.dump({
                'token': creds.token,
                'refresh_token': creds.refresh_token,
                'token_uri': creds.token_uri,
                'client_id': creds.client_id,
                'client_secret': creds.client_secret,
                'scopes': list(creds.scopes),
            }, f, indent=2)
        print(f'Token saved to {TOKEN_FILE}')

    service = build('tagmanager', 'v2', credentials=creds)
    return service


def get_or_create_workspace(service, dry_run=False):
    """
    Find an editable workspace in the container. If none exists, create one.
    Returns the full workspace path string (e.g. accounts/.../workspaces/15).
    """
    resp = service.accounts().containers().workspaces().list(
        parent=CONTAINER_PATH
    ).execute()
    workspaces = resp.get('workspace', [])

    # Prefer "Default Workspace" or the first non-submitted workspace
    for ws in workspaces:
        ws_path = ws.get('path', '')
        ws_name = ws.get('name', '')
        # If it's listed, it's editable (submitted workspaces are auto-removed from list)
        print(f'  Found workspace: {ws_name} (ID={ws.get("workspaceId")})')
        return ws_path

    # No workspace found — create a new one
    if dry_run:
        print('  [DRY-RUN] Would create new workspace: "User Feedback Tracking"')
        return f'{CONTAINER_PATH}/workspaces/NEW'

    new_ws = service.accounts().containers().workspaces().create(
        parent=CONTAINER_PATH,
        body={'name': 'User Feedback Tracking', 'description': 'Add user_feedback event tracking'}
    ).execute()
    ws_path = new_ws.get('path', '')
    print(f'  ✓ Created workspace: {new_ws.get("name")} (ID={new_ws.get("workspaceId")})')
    return ws_path


# ------------------------------------------------------------------ #
# Helper: pretty print action
# ------------------------------------------------------------------ #
def action(verb, resource, name, dry_run):
    prefix = '[DRY-RUN]' if dry_run else '[APPLY]'
    print(f'  {prefix} {verb} {resource}: {name}')


# ------------------------------------------------------------------ #
# Changes
# ------------------------------------------------------------------ #

def fix_contact_trigger(service, dry_run):
    """
    Change Contact Trigger (ID:6) from pageview to customEvent
    matching event name 'contact_form_submit'.
    This fixes false leads (Lead tag was firing on every page view).
    """
    action('UPDATE', 'Trigger', 'Contact Trigger → customEvent:contact_form_submit', dry_run)
    if dry_run:
        return

    trigger_path = f'{WORKSPACE_PATH}/triggers/{TRIGGER_CONTACT_ID}'
    updated = {
        'name': 'Contact Form Submit Trigger',
        'type': 'customEvent',
        'customEventFilter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{_event}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'contact_form_submit'},
                ]
            }
        ]
    }
    result = service.accounts().containers().workspaces().triggers().update(
        path=trigger_path, body=updated
    ).execute()
    print(f'    ✓ Updated trigger {result.get("triggerId")}: {result.get("name")}')


def fix_read_article_trigger(service, dry_run):
    """
    Change Read Article Trigger (ID:14) from linkClick (DOM) to customEvent
    matching 'select_content' with engagement_type = article_cta.
    This eliminates timing race with dataLayer push and double-counting.
    """
    action('UPDATE', 'Trigger', 'Read Article Trigger → customEvent:select_content', dry_run)
    if dry_run:
        return

    trigger_path = f'{WORKSPACE_PATH}/triggers/{TRIGGER_READ_ARTICLE_ID}'
    updated = {
        'name': 'Read Article Trigger',
        'type': 'customEvent',
        'customEventFilter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{_event}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'select_content'},
                ]
            }
        ],
        'filter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{DL - Engagement Type Variable}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'article_cta'},
                ]
            }
        ]
    }
    result = service.accounts().containers().workspaces().triggers().update(
        path=trigger_path, body=updated
    ).execute()
    print(f'    ✓ Updated trigger {result.get("triggerId")}: {result.get("name")}')


def create_hp_hero_trigger(service, dry_run):
    """
    Create HP Hero CTA Trigger for cta_click events (hero_cta engagement_type).
    HP Engagement Tag (ID:10) will fire on this instead of the combined trigger.
    """
    action('CREATE', 'Trigger', 'HP Hero CTA Trigger (cta_click / hero_cta)', dry_run)
    if dry_run:
        return None

    trigger = {
        'name': 'HP Hero CTA Trigger',
        'type': 'customEvent',
        'customEventFilter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{_event}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'cta_click'},
                ]
            }
        ],
        'filter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{DL - Engagement Type Variable}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'hero_cta'},
                ]
            }
        ]
    }
    result = service.accounts().containers().workspaces().triggers().create(
        parent=WORKSPACE_PATH, body=trigger
    ).execute()
    trigger_id = result.get('triggerId')
    print(f'    ✓ Created trigger {trigger_id}: {result.get("name")}')
    return trigger_id


def create_hp_interest_trigger(service, dry_run):
    """
    Create HP Interest Card Trigger for select_content events with interest_cta.
    Homepage Interest Card Tag (ID:13) will fire on this instead of combined trigger.
    """
    action('CREATE', 'Trigger', 'HP Interest Card Trigger (select_content / interest_cta)', dry_run)
    if dry_run:
        return None

    trigger = {
        'name': 'HP Interest Card Trigger',
        'type': 'customEvent',
        'customEventFilter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{_event}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'select_content'},
                ]
            }
        ],
        'filter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{DL - Engagement Type Variable}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'interest_cta'},
                ]
            }
        ]
    }
    result = service.accounts().containers().workspaces().triggers().create(
        parent=WORKSPACE_PATH, body=trigger
    ).execute()
    trigger_id = result.get('triggerId')
    print(f'    ✓ Created trigger {trigger_id}: {result.get("name")}')
    return trigger_id


def update_hp_engagement_tag(service, hero_trigger_id, dry_run):
    """
    Update HP Engagement Tag (ID:10) to fire on the new hero CTA trigger only.
    Removes the shared Homepage Engagement Trigger (ID:8) to prevent double-counting.
    """
    action('UPDATE', 'Tag', f'HP Engagement Tag → fire on hero trigger {hero_trigger_id}', dry_run)
    if dry_run:
        return

    tag_path = f'{WORKSPACE_PATH}/tags/{TAG_HP_ENGAGEMENT_ID}'
    # Fetch current tag to preserve all parameters
    current = service.accounts().containers().workspaces().tags().get(
        path=tag_path
    ).execute()

    current['firingTriggerId'] = [hero_trigger_id]
    current.pop('blockingTriggerId', None)

    result = service.accounts().containers().workspaces().tags().update(
        path=tag_path, body=current
    ).execute()
    print(f'    ✓ Updated tag {result.get("tagId")}: {result.get("name")}')


def update_hp_interest_tag(service, interest_trigger_id, dry_run):
    """
    Update Homepage Interest Card Tag (ID:13) to fire on new interest trigger only.
    """
    action('UPDATE', 'Tag', f'Homepage Interest Card Tag → fire on interest trigger {interest_trigger_id}', dry_run)
    if dry_run:
        return

    tag_path = f'{WORKSPACE_PATH}/tags/{TAG_HP_INTEREST_ID}'
    current = service.accounts().containers().workspaces().tags().get(
        path=tag_path
    ).execute()

    current['firingTriggerId'] = [interest_trigger_id]
    current.pop('blockingTriggerId', None)

    result = service.accounts().containers().workspaces().tags().update(
        path=tag_path, body=current
    ).execute()
    print(f'    ✓ Updated tag {result.get("tagId")}: {result.get("name")}')


def enable_scroll_depth_builtin_vars(service, dry_run):
    """
    Enable GTM built-in variables for Scroll Depth:
    scrollDepthThreshold, scrollDepthUnits, scrollDepthDirection.
    These are required for the scroll depth tag event parameters.
    """
    action('ENABLE', 'Built-in Variables', 'Scroll Depth Threshold / Units / Direction', dry_run)
    if dry_run:
        return

    result = service.accounts().containers().workspaces().built_in_variables().create(
        parent=WORKSPACE_PATH,
        type=['scrollDepthThreshold', 'scrollDepthUnits', 'scrollDepthDirection']
    ).execute()
    for v in result.get('builtInVariable', []):
        print(f'    ✓ Enabled built-in var: {v.get("name")} ({v.get("type")})')


def enable_video_page_builtin_vars(service, dry_run):
    """
    Enable GTM built-in variables for YouTube Video tracking.
    Required by GA4 - YouTube Video tag.
    Note: 'pageTitle' is NOT in the API client enum — handled via JS variable instead.
    """
    action('ENABLE', 'Built-in Variables', 'Video Title / Video URL / Video Percent', dry_run)
    if dry_run:
        return

    result = service.accounts().containers().workspaces().built_in_variables().create(
        parent=WORKSPACE_PATH,
        type=['videoTitle', 'videoUrl', 'videoPercent']
    ).execute()
    for v in result.get('builtInVariable', []):
        print(f'    \u2713 Enabled built-in var: {v.get("name")} ({v.get("type")})')


def create_js_page_title_variable(service, dry_run):
    """
    Create a custom JavaScript variable 'JS - Page Title' that returns document.title.
    Used by GA4 - Print Article tag in place of the built-in {{Page Title}} which
    cannot be enabled via the API client (not in enum).
    """
    action('CREATE', 'Variable', 'JS - Page Title (document.title)', dry_run)
    if dry_run:
        return None

    variable = {
        'name': 'JS - Page Title',
        'type': 'jsm',  # Custom JavaScript variable
        'parameter': [
            {'type': 'template', 'key': 'javascript', 'value': 'function() { return document.title; }'},
        ]
    }
    try:
        result = service.accounts().containers().workspaces().variables().create(
            parent=WORKSPACE_PATH, body=variable
        ).execute()
        var_id = result.get('variableId')
        print(f'    ✓ Created variable {var_id}: {result.get("name")}')
    except Exception as e:
        if 'duplicate name' in str(e).lower():
            print(f'    ℹ Variable "JS - Page Title" already exists — skipping creation')
        else:
            raise


def update_print_tag_page_title(service, dry_run):
    """
    Update the existing 'GA4 - Print Article' tag to replace {{Page Title}}
    (unknown built-in) with {{JS - Page Title}} (custom JS variable).
    Uses JSON string replacement to catch the reference regardless of nesting depth.
    """
    action('UPDATE', 'Tag', 'GA4 - Print Article: replace {{Page Title}} → {{JS - Page Title}}', dry_run)
    if dry_run:
        return

    # Find the print article tag by name
    tags = service.accounts().containers().workspaces().tags().list(
        parent=WORKSPACE_PATH
    ).execute()
    print_tag = next(
        (t for t in tags.get('tag', []) if t.get('name') == 'GA4 - Print Article'),
        None
    )
    if not print_tag:
        print('    ⚠ Tag "GA4 - Print Article" not found — skipping')
        return

    # Deep replace via JSON serialization — catches {{Page Title}} at any nesting level
    import json
    tag_json = json.dumps(print_tag)
    if '{{Page Title}}' not in tag_json:
        print('    ℹ {{Page Title}} not found in tag JSON — already fixed or not present')
        print(f'    Tag parameters: {json.dumps(print_tag.get("parameter", []), indent=2)}')
        return

    tag_json_fixed = tag_json.replace('{{Page Title}}', '{{JS - Page Title}}')
    count = tag_json.count('{{Page Title}}')
    print_tag = json.loads(tag_json_fixed)
    print(f'    ✓ Replaced {count} occurrence(s) of {{{{Page Title}}}} → {{{{JS - Page Title}}}}')

    # Remove keys that cause update validation errors
    print_tag.pop('fingerprint', None)
    print_tag.pop('tagManagerUrl', None)
    print_tag.pop('workspaceId', None)

    tag_path = f'{WORKSPACE_PATH}/tags/{print_tag["tagId"]}'
    result = service.accounts().containers().workspaces().tags().update(
        path=tag_path, body=print_tag
    ).execute()
    print(f'    ✓ Updated tag {result.get("tagId")}: {result.get("name")}')
    # Confirm the fix is in the returned tag
    result_json = json.dumps(result)
    if '{{Page Title}}' in result_json:
        print('    ⚠ WARNING: {{Page Title}} still present in returned tag — manual fix needed')
    else:
        print('    ✓ Confirmed: {{Page Title}} no longer in tag')


def create_scroll_depth_trigger(service, dry_run):
    """
    Create a Scroll Depth trigger at 25, 50, 75, 90 percent (vertical).
    """
    action('CREATE', 'Trigger', 'Scroll Depth Trigger (25/50/75/90%)', dry_run)
    if dry_run:
        return None

    trigger = {
        'name': 'Scroll Depth Trigger',
        'type': 'scrollDepth',
        'verticalThresholdType': 'PERCENT',
        'verticalThresholdsPercent': '25,50,75,90',
    }
    result = service.accounts().containers().workspaces().triggers().create(
        parent=WORKSPACE_PATH, body=trigger
    ).execute()
    trigger_id = result.get('triggerId')
    print(f'    ✓ Created trigger {trigger_id}: {result.get("name")}')
    return trigger_id


def create_scroll_depth_tag(service, scroll_trigger_id, dry_run):
    """
    Create GA4 Event tag for scroll_depth, fires on Scroll Depth trigger.
    Passes percent_scrolled and scroll_units as event parameters.
    """
    action('CREATE', 'Tag', 'GA4 - Scroll Depth (gaawe)', dry_run)
    if dry_run:
        return

    tag = {
        'name': 'GA4 - Scroll Depth',
        'type': 'gaawe',
        'parameter': [
            {'type': 'template', 'key': 'measurementIdOverride', 'value': '{{Measurement Variable}}'},
            {'type': 'template', 'key': 'eventName', 'value': 'scroll_depth'},
            {
                'type': 'list',
                'key': 'eventParameters',
                'list': [
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'percent_scrolled'},
                            {'type': 'template', 'key': 'value', 'value': '{{Scroll Depth Threshold}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'scroll_units'},
                            {'type': 'template', 'key': 'value', 'value': '{{Scroll Depth Units}}'},
                        ]
                    },
                ]
            }
        ],
        'firingTriggerId': [scroll_trigger_id],
        'tagFiringOption': 'oncePerEvent',
    }
    result = service.accounts().containers().workspaces().tags().create(
        parent=WORKSPACE_PATH, body=tag
    ).execute()
    print(f'    ✓ Created tag {result.get("tagId")}: {result.get("name")}')


def create_youtube_video_tag(service, dry_run):
    """
    Create GA4 Event tag for video_progress, fires on YouTube Video Trigger (ID:19).
    Existing YT trigger was configured but had no tag.
    """
    action('CREATE', 'Tag', 'GA4 - YouTube Video Progress (gaawe)', dry_run)
    if dry_run:
        return

    tag = {
        'name': 'GA4 - YouTube Video',
        'type': 'gaawe',
        'parameter': [
            {'type': 'template', 'key': 'measurementIdOverride', 'value': '{{Measurement Variable}}'},
            {'type': 'template', 'key': 'eventName', 'value': 'video_progress'},
            {
                'type': 'list',
                'key': 'eventParameters',
                'list': [
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'video_title'},
                            {'type': 'template', 'key': 'value', 'value': '{{Video Title}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'video_percent'},
                            {'type': 'template', 'key': 'value', 'value': '{{Video Percent}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'video_url'},
                            {'type': 'template', 'key': 'value', 'value': '{{Video URL}}'},
                        ]
                    },
                ]
            }
        ],
        'firingTriggerId': [TRIGGER_YT_VIDEO_ID],
        'tagFiringOption': 'oncePerEvent',
    }
    result = service.accounts().containers().workspaces().tags().create(
        parent=WORKSPACE_PATH, body=tag
    ).execute()
    print(f'    ✓ Created tag {result.get("tagId")}: {result.get("name")}')


def create_file_download_trigger(service, dry_run):
    """
    Create customEvent trigger for 'file_download' events.
    These are pushed from doc-generator-core.js _downloadFile().
    """
    action('CREATE', 'Trigger', 'File Download Trigger (customEvent:file_download)', dry_run)
    if dry_run:
        return None

    trigger = {
        'name': 'File Download Trigger',
        'type': 'customEvent',
        'customEventFilter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{_event}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'file_download'},
                ]
            }
        ]
    }
    result = service.accounts().containers().workspaces().triggers().create(
        parent=WORKSPACE_PATH, body=trigger
    ).execute()
    trigger_id = result.get('triggerId')
    print(f'    ✓ Created trigger {trigger_id}: {result.get("name")}')
    return trigger_id


def create_file_download_variable(service, var_key, var_name, dry_run):
    """Create a dataLayer variable for file download parameters."""
    action('CREATE', 'Variable', f'DL - {var_name}', dry_run)
    if dry_run:
        return None

    variable = {
        'name': f'DL - {var_name}',
        'type': 'v',  # dataLayer variable
        'parameter': [
            {'type': 'integer', 'key': 'dataLayerVersion', 'value': '2'},
            {'type': 'boolean', 'key': 'setDefaultValue', 'value': 'false'},
            {'type': 'template', 'key': 'name', 'value': var_key},
        ]
    }
    result = service.accounts().containers().workspaces().variables().create(
        parent=WORKSPACE_PATH, body=variable
    ).execute()
    var_id = result.get('variableId')
    print(f'    ✓ Created variable {var_id}: {result.get("name")}')
    return var_id


def create_file_download_tag(service, download_trigger_id, dry_run):
    """
    Create GA4 Event tag for file_download, fires on File Download Trigger.
    Captures file_format and file_name from dataLayer.
    """
    action('CREATE', 'Tag', 'GA4 - File Download (gaawe)', dry_run)
    if dry_run:
        return

    tag = {
        'name': 'GA4 - File Download',
        'type': 'gaawe',
        'parameter': [
            {'type': 'template', 'key': 'measurementIdOverride', 'value': '{{Measurement Variable}}'},
            {'type': 'template', 'key': 'eventName', 'value': 'file_download'},
            {
                'type': 'list',
                'key': 'eventParameters',
                'list': [
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'file_format'},
                            {'type': 'template', 'key': 'value', 'value': '{{DL - File Format Variable}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'file_name'},
                            {'type': 'template', 'key': 'value', 'value': '{{DL - File Name Variable}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'page_path'},
                            {'type': 'template', 'key': 'value', 'value': '{{Page Path}}'},
                        ]
                    },
                ]
            }
        ],
        'firingTriggerId': [download_trigger_id],
        'tagFiringOption': 'oncePerEvent',
    }
    result = service.accounts().containers().workspaces().tags().create(
        parent=WORKSPACE_PATH, body=tag
    ).execute()
    print(f'    ✓ Created tag {result.get("tagId")}: {result.get("name")}')


def create_print_trigger(service, dry_run):
    """
    Create customEvent trigger for 'print_article'.
    Pushed from main.js initPrintTracking() via window.beforeprint listener.
    """
    action('CREATE', 'Trigger', 'Print Article Trigger (customEvent:print_article)', dry_run)
    if dry_run:
        return None

    trigger = {
        'name': 'Print Article Trigger',
        'type': 'customEvent',
        'customEventFilter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{_event}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'print_article'},
                ]
            }
        ]
    }
    result = service.accounts().containers().workspaces().triggers().create(
        parent=WORKSPACE_PATH, body=trigger
    ).execute()
    trigger_id = result.get('triggerId')
    print(f'    ✓ Created trigger {trigger_id}: {result.get("name")}')
    return trigger_id


def create_print_tag(service, print_trigger_id, dry_run):
    """GA4 Event tag for print_article event."""
    action('CREATE', 'Tag', 'GA4 - Print Article (gaawe)', dry_run)
    if dry_run:
        return

    tag = {
        'name': 'GA4 - Print Article',
        'type': 'gaawe',
        'parameter': [
            {'type': 'template', 'key': 'measurementIdOverride', 'value': '{{Measurement Variable}}'},
            {'type': 'template', 'key': 'eventName', 'value': 'print_article'},
            {
                'type': 'list',
                'key': 'eventParameters',
                'list': [
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'page_path'},
                            {'type': 'template', 'key': 'value', 'value': '{{Page Path}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'page_title'},
                            {'type': 'template', 'key': 'value', 'value': '{{Page Title}}'},
                        ]
                    },
                ]
            }
        ],
        'firingTriggerId': [print_trigger_id],
        'tagFiringOption': 'oncePerEvent',
    }
    result = service.accounts().containers().workspaces().tags().create(
        parent=WORKSPACE_PATH, body=tag
    ).execute()
    print(f'    ✓ Created tag {result.get("tagId")}: {result.get("name")}')


def create_content_group_variables(service, dry_run):
    """
    Create dataLayer variables for content grouping.
    Pushed by main.js initContentGrouping() on every page.
    """
    vars_to_create = [
        ('content_group1', 'Content Group 1'),
        ('content_group2', 'Content Group 2'),
        ('page_type', 'Page Type'),
    ]
    # Fetch existing variable names to skip duplicates
    existing_names = set()
    if not dry_run:
        existing = service.accounts().containers().workspaces().variables().list(
            parent=WORKSPACE_PATH
        ).execute()
        existing_names = {v.get('name') for v in existing.get('variable', [])}

    ids = {}
    for key, name in vars_to_create:
        var_name = f'DL - {name} Variable'
        if not dry_run and var_name in existing_names:
            print(f'    [SKIP] Variable already exists: {var_name}')
            continue
        action('CREATE', 'Variable', var_name, dry_run)
        if dry_run:
            continue
        variable = {
            'name': var_name,
            'type': 'v',
            'parameter': [
                {'type': 'integer', 'key': 'dataLayerVersion', 'value': '2'},
                {'type': 'boolean', 'key': 'setDefaultValue', 'value': 'false'},
                {'type': 'template', 'key': 'name', 'value': key},
            ]
        }
        result = service.accounts().containers().workspaces().variables().create(
            parent=WORKSPACE_PATH, body=variable
        ).execute()
        var_id = result.get('variableId')
        ids[key] = var_id
        print(f'    ✓ Created variable {var_id}: {result.get("name")}')
    return ids


def create_content_group_regex_variable(service, dry_run):
    """
    Create a GTM Regex Table variable 'Content Group - Category' that maps
    Page Path to a human-readable category name for GA4 content_group.
    This is the Google-recommended approach via GTM (regex table on {{Page Path}}).
    """
    action('CREATE', 'Variable', 'Content Group - Category (Regex Table)', dry_run)
    if dry_run:
        return None

    # Skip if already exists
    existing = service.accounts().containers().workspaces().variables().list(
        parent=WORKSPACE_PATH
    ).execute()
    for v in existing.get('variable', []):
        if v.get('name') == 'Content Group - Category':
            print(f"    [SKIP] Variable already exists: Content Group - Category (ID={v.get('variableId')})")
            return v.get('variableId')

    # Regex rows: (pattern, output)
    # Order matters — more specific patterns first
    rows = [
        # Homepage
        (r'^/$',                                          'Homepage'),
        (r'^/index\.html$',                               'Homepage'),
        # Category listing pages
        (r'/pages/categories/technology',                 'Technology'),
        (r'/pages/categories/psychology',                 'Psychology'),
        (r'/pages/categories/business',                   'Business'),
        (r'/pages/categories/engineering',                'Engineering'),
        (r'/pages/categories/gaming',                     'Gaming'),
        (r'/pages/categories/life-sciences',              'Life Sciences'),
        (r'/pages/categories/mathematics',                'Mathematics'),
        (r'/pages/categories/philosophy',                 'Philosophy'),
        (r'/pages/categories/science',                    'Science'),
        (r'/pages/categories/faith',                      'Faith'),
        (r'/pages/categories/poetry',                     'Poetry'),
        # Technology series
        (r'/pages/series/(ai-app-dev|ai-in-the-wild|ai-data-science|api-development|arm-assembly|assembly-mastery|cloud-computing|cmsis|computer-architecture|data-structures|database-mastery|embedded-systems|gnu-make|kernel-development|nlp|protocols-master|sensors-actuators|stm32-hal|system-design|usb-dev)/', 'Technology'),
        # Psychology series
        (r'/pages/series/(behavioral-psychology|cognitive-psych|social-psychology)/', 'Psychology'),
        # Business series
        (r'/pages/series/(consulting-frameworks|dddm|economics|entrepreneurship|marketing-strategy|sales-mastery)/', 'Business'),
        # Engineering series
        (r'/pages/series/(manufacturing-engineering|materials-science|mech-movements|robotics-automation)/', 'Engineering'),
        # Gaming series
        (r'/pages/series/(game-development|unity-game-engine)/', 'Gaming'),
        # Life Sciences series
        (r'/pages/series/(biochemistry|evolutionary-biology|human-anatomy|physiology)/', 'Life Sciences'),
        # Philosophy series
        (r'/pages/series/(ethics-moral-philosophy|logic-critical-thinking)/', 'Philosophy'),
        # Mathematics series
        (r'/pages/series/math-for-ai/',                   'Mathematics'),
        # Standalone articles by year/month — derive from path keyword matching
        (r'/pages/\d{4}/\d{2}/',                          'Standalone Article'),
        # Utility pages
        (r'/pages/contact',                               'Contact'),
        (r'/(privacy-policy|disclaimer)',                 'Legal'),
    ]

    # Build the GTM regex table map list
    map_list = []
    for pattern, output in rows:
        map_list.append({
            'type': 'map',
            'map': [
                {'type': 'template', 'key': 'key',   'value': pattern},
                {'type': 'template', 'key': 'value', 'value': output},
            ]
        })

    variable = {
        'name': 'Content Group - Category',
        'type': 'remm',  # Regex Table variable type
        'parameter': [
            {'type': 'template', 'key': 'input',         'value': '{{Page Path}}'},
            {'type': 'list',     'key': 'map',            'list': map_list},
            {'type': 'boolean',  'key': 'setDefaultValue','value': 'true'},
            {'type': 'template', 'key': 'defaultValue',   'value': 'Other'},
            {'type': 'boolean',  'key': 'fullMatch',      'value': 'false'},
            {'type': 'boolean',  'key': 'replaceAfterMatch', 'value': 'false'},
        ]
    }
    try:
        result = service.accounts().containers().workspaces().variables().create(
            parent=WORKSPACE_PATH, body=variable
        ).execute()
        var_id = result.get('variableId')
        print(f'    ✓ Created variable {var_id}: {result.get("name")}')
        return var_id
    except Exception as e:
        if 'duplicate name' in str(e).lower():
            print(f'    ℹ Variable "Content Group - Category" already exists — skipping')
            return None
        raise


def update_ga4_config_tag_content_group(service, dry_run):
    """
    Update the GA4 Configuration tag (ID: TAG_GA4_MAIN_ID) to add content_group
    from the Regex Table variable, plus content_group2 and page_type from dataLayer.
    These fields appear in GA4 as event parameters on every page view.
    """
    action('UPDATE', 'Tag', 'GA4 Config Tag → add content_group, content_group2, page_type fields', dry_run)
    if dry_run:
        return

    tag_path = f'{WORKSPACE_PATH}/tags/{TAG_GA4_MAIN_ID}'
    current = service.accounts().containers().workspaces().tags().get(
        path=tag_path
    ).execute()

    # Remove non-updatable metadata fields
    for field in ('fingerprint', 'tagManagerUrl', 'workspaceId', 'accountId', 'containerId'):
        current.pop(field, None)

    # Find existing fieldsToSet list or create it
    fields_param = next(
        (p for p in current.get('parameter', []) if p.get('key') == 'fieldsToSet'),
        None
    )

    new_fields = [
        {'name': 'content_group',  'value': '{{Content Group - Category}}'},
        {'name': 'content_group2', 'value': '{{DL - Content Group 2 Variable}}'},
        {'name': 'page_type',      'value': '{{DL - Page Type Variable}}'},
    ]

    if fields_param is None:
        # No fieldsToSet yet — create the parameter
        fields_param = {'type': 'list', 'key': 'fieldsToSet', 'list': []}
        current.setdefault('parameter', []).append(fields_param)

    # Build map entries, skipping any that already exist
    existing_names = {
        item['map'][0]['value']
        for item in fields_param.get('list', [])
        if item.get('type') == 'map' and item.get('map')
    }

    added = []
    for field in new_fields:
        if field['name'] not in existing_names:
            fields_param.setdefault('list', []).append({
                'type': 'map',
                'map': [
                    {'type': 'template', 'key': 'name',  'value': field['name']},
                    {'type': 'template', 'key': 'value', 'value': field['value']},
                ]
            })
            added.append(field['name'])

    if not added:
        print('    ℹ All content_group fields already present — skipping update')
        return

    result = service.accounts().containers().workspaces().tags().update(
        path=tag_path, body=current
    ).execute()
    print(f'    ✓ Updated tag {result.get("tagId")}: {result.get("name")}')
    print(f'    ✓ Added fields: {", ".join(added)}')


def publish_workspace(service, dry_run):
    """Create a new GTM version and publish it."""
    action('PUBLISH', 'Workspace', f'Publishing {WORKSPACE_PATH}', dry_run)
    if dry_run:
        return

    # Create a version
    version_body = {
        'name': 'GA4 Tracking Improvements',
        'notes': (
            'Applied all GA4/GTM recommendations: '
            'fixed contact trigger (pageview→customEvent), '
            'fixed read article trigger (linkClick→customEvent), '
            'added scroll depth + YT video + file download + print tracking, '
            'split HP engagement trigger to prevent double-counting, '
            'added content grouping (dataLayer vars + Regex Table variable), '
            'wired content_group / content_group2 / page_type into GA4 config tag.'
        )
    }
    version_result = service.accounts().containers().workspaces().create_version(
        path=WORKSPACE_PATH, body=version_body
    ).execute()

    container_version = version_result.get('containerVersion', {})
    version_id = container_version.get('containerVersionId')
    print(f'    ✓ Created container version {version_id}')

    if version_id:
        # Publish the version
        try:
            service.accounts().containers().versions().publish(
                path=f'{CONTAINER_PATH}/versions/{version_id}'
            ).execute()
            print(f'    ✓ Published version {version_id}')
        except Exception as publish_err:
            print(f'    ⚠ API publish failed: {publish_err}')
            print(f'')
            print(f'    Version {version_id} was created and is ready to publish.')
            print(f'    Publish manually in GTM UI:')
            print(f'      1. Go to: https://tagmanager.google.com/')
            print(f'      2. Open container GTM-PBS8M2JR → Versions tab')
            print(f'      3. Find Version {version_id} → click "Publish"')
        return version_id


# ------------------------------------------------------------------ #
# User Feedback Tracking
# ------------------------------------------------------------------ #

def _get_existing_variable_names(service):
    """Return a set of existing GTM variable names in the workspace."""
    resp = service.accounts().containers().workspaces().variables().list(
        parent=WORKSPACE_PATH
    ).execute()
    return {v.get('name') for v in resp.get('variable', [])}


def _get_existing_trigger_names(service):
    """Return a set of existing GTM trigger names in the workspace."""
    resp = service.accounts().containers().workspaces().triggers().list(
        parent=WORKSPACE_PATH
    ).execute()
    return {t.get('name') for t in resp.get('trigger', [])}


def _get_existing_tag_names(service):
    """Return a set of existing GTM tag names in the workspace."""
    resp = service.accounts().containers().workspaces().tags().list(
        parent=WORKSPACE_PATH
    ).execute()
    return {t.get('name') for t in resp.get('tag', [])}


def create_feedback_variables(service, dry_run):
    """
    Create dataLayer variables for user feedback event parameters.
    Idempotent — skips variables that already exist.
    """
    vars_to_create = [
        ('feedback_rating',   'Feedback Rating Variable'),
        ('feedback_reason',   'Feedback Reason Variable'),
        ('feedback_category', 'Feedback Category Variable'),
    ]

    existing_names = set()
    if not dry_run:
        existing_names = _get_existing_variable_names(service)

    for key, name in vars_to_create:
        var_name = f'DL - {name}'
        if not dry_run and var_name in existing_names:
            print(f'    [SKIP] Variable already exists: {var_name}')
            continue
        action('CREATE', 'Variable', var_name, dry_run)
        if dry_run:
            continue
        variable = {
            'name': var_name,
            'type': 'v',
            'parameter': [
                {'type': 'integer', 'key': 'dataLayerVersion', 'value': '2'},
                {'type': 'boolean', 'key': 'setDefaultValue', 'value': 'false'},
                {'type': 'template', 'key': 'name', 'value': key},
            ]
        }
        result = service.accounts().containers().workspaces().variables().create(
            parent=WORKSPACE_PATH, body=variable
        ).execute()
        print(f'    ✓ Created variable {result.get("variableId")}: {result.get("name")}')


def create_user_feedback_trigger(service, dry_run):
    """
    Create customEvent trigger for 'user_feedback' events.
    Idempotent — skips if trigger already exists, returns existing ID.
    """
    trigger_name = 'User Feedback Trigger'

    if not dry_run:
        existing = service.accounts().containers().workspaces().triggers().list(
            parent=WORKSPACE_PATH
        ).execute()
        for t in existing.get('trigger', []):
            if t.get('name') == trigger_name:
                tid = t.get('triggerId')
                print(f'    [SKIP] Trigger already exists: {trigger_name} (ID={tid})')
                return tid

    action('CREATE', 'Trigger', f'{trigger_name} (customEvent:user_feedback)', dry_run)
    if dry_run:
        return None

    trigger = {
        'name': trigger_name,
        'type': 'customEvent',
        'customEventFilter': [
            {
                'type': 'equals',
                'parameter': [
                    {'type': 'template', 'key': 'arg0', 'value': '{{_event}}'},
                    {'type': 'template', 'key': 'arg1', 'value': 'user_feedback'},
                ]
            }
        ]
    }
    result = service.accounts().containers().workspaces().triggers().create(
        parent=WORKSPACE_PATH, body=trigger
    ).execute()
    trigger_id = result.get('triggerId')
    print(f'    ✓ Created trigger {trigger_id}: {result.get("name")}')
    return trigger_id


def create_user_feedback_tag(service, feedback_trigger_id, dry_run):
    """
    Create GA4 Event tag for user_feedback, fires on User Feedback Trigger.
    Captures feedback_rating, feedback_reason, feedback_category, page_path.
    Idempotent — skips if tag already exists.
    """
    tag_name = 'GA4 - User Feedback'

    if not dry_run:
        existing = service.accounts().containers().workspaces().tags().list(
            parent=WORKSPACE_PATH
        ).execute()
        for t in existing.get('tag', []):
            if t.get('name') == tag_name:
                print(f'    [SKIP] Tag already exists: {tag_name} (ID={t.get("tagId")})')
                return

    action('CREATE', 'Tag', f'{tag_name} (gaawe)', dry_run)
    if dry_run:
        return

    tag = {
        'name': tag_name,
        'type': 'gaawe',
        'parameter': [
            {'type': 'template', 'key': 'measurementIdOverride', 'value': '{{Measurement Variable}}'},
            {'type': 'template', 'key': 'eventName', 'value': 'user_feedback'},
            {
                'type': 'list',
                'key': 'eventParameters',
                'list': [
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'feedback_rating'},
                            {'type': 'template', 'key': 'value', 'value': '{{DL - Feedback Rating Variable}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'feedback_reason'},
                            {'type': 'template', 'key': 'value', 'value': '{{DL - Feedback Reason Variable}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'feedback_category'},
                            {'type': 'template', 'key': 'value', 'value': '{{DL - Feedback Category Variable}}'},
                        ]
                    },
                    {
                        'type': 'map',
                        'map': [
                            {'type': 'template', 'key': 'name', 'value': 'page_path'},
                            {'type': 'template', 'key': 'value', 'value': '{{Page Path}}'},
                        ]
                    },
                ]
            }
        ],
        'firingTriggerId': [feedback_trigger_id],
        'tagFiringOption': 'oncePerEvent',
    }
    result = service.accounts().containers().workspaces().tags().create(
        parent=WORKSPACE_PATH, body=tag
    ).execute()
    print(f'    ✓ Created tag {result.get("tagId")}: {result.get("name")}')


# ------------------------------------------------------------------ #
# Main
# ------------------------------------------------------------------ #

def main():
    parser = argparse.ArgumentParser(description='Apply GTM GA4 tracking improvements')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without applying')
    parser.add_argument('--publish', action='store_true', help='Publish workspace after changes')
    parser.add_argument('--publish-only', action='store_true',
                        help='Skip all entity creation and only publish the current workspace')
    parser.add_argument('--fix-vars', action='store_true',
                        help='Enable missing built-in variables (videoTitle, videoUrl, videoPercent, pageTitle)')
    parser.add_argument('--content-group-only', action='store_true',
                        help='Run only content grouping steps (8 + 9): dataLayer vars + Regex Table + GA4 config wiring')
    parser.add_argument('--feedback-only', action='store_true',
                        help='Create user feedback tracking: 3 dataLayer variables + trigger + GA4 event tag')
    parser.add_argument('--resume', action='store_true',
                        help='Skip already-applied steps (critical fixes, HP triggers, scroll trigger) '
                             'and resume from scroll depth tag onwards. '
                             'Required IDs: --scroll-trigger-id, --hero-trigger-id, --interest-trigger-id')
    parser.add_argument('--scroll-trigger-id', default='22',
                        help='Existing scroll depth trigger ID (used with --resume, default: 22)')
    parser.add_argument('--hero-trigger-id', default='20',
                        help='Existing HP hero trigger ID (used with --resume, default: 20)')
    parser.add_argument('--interest-trigger-id', default='21',
                        help='Existing HP interest trigger ID (used with --resume, default: 21)')
    args = parser.parse_args()

    dry_run = args.dry_run

    if dry_run:
        print('=== DRY RUN MODE — no changes will be applied ===\n')
    elif getattr(args, 'publish_only', False):
        print('=== PUBLISH-ONLY MODE — publishing existing workspace changes ===\n')
    elif getattr(args, 'content_group_only', False):
        print('=== CONTENT GROUP ONLY MODE — applying content grouping steps ===\n')
    elif getattr(args, 'feedback_only', False):
        print('=== FEEDBACK ONLY MODE — creating user feedback tracking ===\n')
    elif args.resume:
        print('=== RESUME MODE — skipping already-applied steps ===\n')
    else:
        print('=== LIVE MODE — changes will be applied to GTM ===\n')

    service = get_service(dry_run)

    # Resolve editable workspace (replaces hardcoded WORKSPACE_ID)
    global WORKSPACE_PATH
    print('─' * 60)
    print('RESOLVING WORKSPACE')
    print('─' * 60)
    WORKSPACE_PATH = get_or_create_workspace(service, dry_run)
    print(f'  Using: {WORKSPACE_PATH}\n')

    # Fix-vars shortcut — enable missing built-in variables only
    if getattr(args, 'fix_vars', False):
        print('─' * 60)
        print('FIX VARS — enabling missing built-in variables')
        print('─' * 60)
        enable_video_page_builtin_vars(service, dry_run)
        create_js_page_title_variable(service, dry_run)
        update_print_tag_page_title(service, dry_run)
        print('\nDone. Now Submit/Publish the workspace in GTM UI.')
        return

    # Content-group-only shortcut — run only steps 8 + 9
    if getattr(args, 'content_group_only', False):
        print('─' * 60)
        print('CONTENT GROUPING (steps 8 + 9)')
        print('─' * 60)
        create_content_group_variables(service, dry_run)
        create_content_group_regex_variable(service, dry_run)
        update_ga4_config_tag_content_group(service, dry_run)
        print()
        if args.publish:
            print('─' * 60)
            print('PUBLISHING WORKSPACE')
            print('─' * 60)
            publish_workspace(service, dry_run)
        else:
            print('Skipping publish. Run with --publish to create and publish a new GTM version.')
        print('\nDone.')
        return

    if getattr(args, 'publish_only', False):
        print('─' * 60)
        print('PUBLISHING WORKSPACE')
        print('─' * 60)
        publish_workspace(service, dry_run)
        print('\nDone.')
        return

    # Feedback-only shortcut — create variables, trigger, and tag for user_feedback
    if getattr(args, 'feedback_only', False):
        print('─' * 60)
        print('USER FEEDBACK TRACKING')
        print('─' * 60)
        create_feedback_variables(service, dry_run)
        feedback_trigger_id = create_user_feedback_trigger(service, dry_run)
        if not dry_run and feedback_trigger_id:
            create_user_feedback_tag(service, feedback_trigger_id, dry_run)
        elif dry_run:
            action('CREATE', 'Tag', 'GA4 - User Feedback (gaawe)', dry_run)
        print()
        if args.publish:
            print('─' * 60)
            print('PUBLISHING WORKSPACE')
            print('─' * 60)
            publish_workspace(service, dry_run)
        else:
            print('Skipping publish. Run with --publish to create and publish a new GTM version.')
        print('\nDone.')
        return

    if not args.resume:
        print('─' * 60)
        print('CRITICAL FIXES (data corruption)')
        print('─' * 60)

        # 1. Fix Contact Trigger — pageview → customEvent
        fix_contact_trigger(service, dry_run)

        # 2. Fix Read Article Trigger — linkClick → customEvent
        fix_read_article_trigger(service, dry_run)

        print()
        print('─' * 60)
        print('HIGH PRIORITY (tracking gaps)')
        print('─' * 60)

        # 3. Create HP-specific triggers and update tags (prevent double-counting)
        hero_trigger_id = create_hp_hero_trigger(service, dry_run)
        interest_trigger_id = create_hp_interest_trigger(service, dry_run)
        if not dry_run:
            update_hp_engagement_tag(service, hero_trigger_id, dry_run)
            update_hp_interest_tag(service, interest_trigger_id, dry_run)

        # 4. Scroll Depth trigger + built-in vars
        enable_scroll_depth_builtin_vars(service, dry_run)
        enable_video_page_builtin_vars(service, dry_run)
        scroll_trigger_id = create_scroll_depth_trigger(service, dry_run)

    else:
        # Resume: use IDs from already-created resources
        scroll_trigger_id = args.scroll_trigger_id
        hero_trigger_id = args.hero_trigger_id
        interest_trigger_id = args.interest_trigger_id
        print('─' * 60)
        print(f'RESUMING from scroll depth tag (scroll trigger: {scroll_trigger_id})')
        print('─' * 60)

    # 4b. Scroll Depth tag
    if not dry_run:
        create_scroll_depth_tag(service, scroll_trigger_id, dry_run)
    else:
        action('CREATE', 'Tag', 'GA4 - Scroll Depth (gaawe)', dry_run)

    # 5. YouTube Video tag (trigger already exists)
    create_youtube_video_tag(service, dry_run)

    # 6. File Download tracking
    # First create dataLayer variables for file params
    create_file_download_variable(service, 'file_format', 'File Format Variable', dry_run)
    create_file_download_variable(service, 'file_name', 'File Name Variable', dry_run)
    download_trigger_id = create_file_download_trigger(service, dry_run)
    if not dry_run:
        create_file_download_tag(service, download_trigger_id, dry_run)

    print()
    print('─' * 60)
    print('MEDIUM PRIORITY (enrichment)')
    print('─' * 60)

    # 7. Print tracking
    print_trigger_id = create_print_trigger(service, dry_run)
    if not dry_run:
        create_print_tag(service, print_trigger_id, dry_run)

    # 8. Content Grouping variables (dataLayer)
    create_content_group_variables(service, dry_run)

    # 9. Content Group Regex Table variable + wire into GA4 config tag
    create_content_group_regex_variable(service, dry_run)
    update_ga4_config_tag_content_group(service, dry_run)

    print()
    print('─' * 60)

    # 9. Publish
    if args.publish:
        print('PUBLISHING WORKSPACE')
        print('─' * 60)
        publish_workspace(service, dry_run)
    else:
        print('Skipping publish. Run with --publish to create and publish a new GTM version.')

    print()
    print('Done.')
    if dry_run:
        print('\nRe-run without --dry-run to apply all changes.')
    elif not args.publish:
        print('\nRemember to review and publish the workspace in GTM UI, or re-run with --publish.')


if __name__ == '__main__':
    main()
