# ------------------------------------------------------------------
# SEO-GSC-Manager  ·  Authentication
# ------------------------------------------------------------------
# Builds authenticated Google API service objects using a
# service-account JSON key.
#
# GOTCHA — Indexing API:
#   The service-account email MUST be added as an **Owner** (not just
#   "Full User") inside  GSC → Settings → Users and permissions.
# ------------------------------------------------------------------

import time
import functools

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from config import JSON_KEY_PATH

# ---- Scopes -----------------------------------------------------------

_SCOPES_WEBMASTERS = ["https://www.googleapis.com/auth/webmasters"]
_SCOPES_INDEXING = ["https://www.googleapis.com/auth/indexing"]

# ---- Service builders --------------------------------------------------


def _build_credentials(scopes: list[str]) -> service_account.Credentials:
    return service_account.Credentials.from_service_account_file(
        JSON_KEY_PATH, scopes=scopes
    )


@functools.lru_cache(maxsize=1)
def get_search_console_service():
    """Return an authenticated Search Console (webmasters v1) service."""
    creds = _build_credentials(_SCOPES_WEBMASTERS)
    return build("searchconsole", "v1", credentials=creds)


@functools.lru_cache(maxsize=1)
def get_indexing_service():
    """Return an authenticated Indexing API v3 service."""
    creds = _build_credentials(_SCOPES_INDEXING)
    return build("indexing", "v3", credentials=creds)


# ---- Retry helper (exponential back-off for 429 / 5xx) ----------------

MAX_RETRIES = 5


def retry_api_call(callable_fn, *args, **kwargs):
    """Execute *callable_fn* with exponential back-off on transient errors."""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return callable_fn(*args, **kwargs)
        except HttpError as exc:
            status = exc.resp.status
            if status == 429 or status >= 500:
                wait = 2 ** attempt
                print(f"  ⏳  HTTP {status} — retrying in {wait}s "
                      f"(attempt {attempt}/{MAX_RETRIES})")
                time.sleep(wait)
            else:
                raise
    raise RuntimeError(
        f"API call failed after {MAX_RETRIES} retries."
    )
