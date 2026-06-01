# ------------------------------------------------------------------
# SEO-GSC-Manager  ·  Configuration
# ------------------------------------------------------------------
# Reads SITE_URL and JSON_KEY_PATH from  .env  (or env vars).
# ------------------------------------------------------------------

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Load .env from the tool directory (same folder as this file)
_TOOL_DIR = Path(__file__).resolve().parent
_ENV_PATH = _TOOL_DIR / ".env"
load_dotenv(_ENV_PATH)

# ---- Required settings ------------------------------------------------

SITE_URL: str = os.getenv("SITE_URL", "")
JSON_KEY_PATH: str = os.getenv("JSON_KEY_PATH", "")

if not SITE_URL:
    sys.exit(
        "ERROR: SITE_URL is not set.\n"
        "Add it to .env  (e.g.  SITE_URL=sc-domain:wasilzafar.com  or\n"
        "SITE_URL=https://www.wasilzafar.com/).\n\n"
        "GOTCHA: The value MUST match your GSC property exactly.\n"
        "  • Domain property   → sc-domain:example.com\n"
        "  • URL-prefix property → https://example.com/  (trailing slash!)"
    )

if not JSON_KEY_PATH:
    sys.exit(
        "ERROR: JSON_KEY_PATH is not set.\n"
        "Add it to .env  (e.g.  JSON_KEY_PATH=/path/to/service_account.json)."
    )

_key_file = Path(JSON_KEY_PATH)
if not _key_file.is_file():
    sys.exit(f"ERROR: Service-account key file not found: {JSON_KEY_PATH}")

# ---- Quota constants ---------------------------------------------------

INDEXING_API_DAILY_QUOTA = 200   # Google default
BATCH_CHUNK_SIZE = 100           # max URLs per batch HTTP request
