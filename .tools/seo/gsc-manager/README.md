# SEO-GSC-Manager

CLI utility for automating SEO tasks via the **Google Search Console** and **Indexing** APIs.

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Python | 3.10+ |
| Google Cloud project | With **Indexing API** and **Search Console API** enabled |
| Service Account | JSON key file downloaded |

## Setup

### 1. Create a Google Cloud Service Account

1. Go to [Google Cloud Console → IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. Create a service account (any name).
3. Click **Keys → Add Key → Create new key → JSON**. Save the file securely.
4. Enable these APIs in your project:
   - **Web Search Indexing API** (for `submit` / `batch` / `status`)
   - **Google Search Console API** (for `inspect` / `sitemaps` / `audit`)

### 2. Add the Service Account to Google Search Console

> **⚠️  GOTCHA — "Owner" Requirement**
>
> The Indexing API requires the service account to be an **Owner**, not just a "Full User".

1. Open [Google Search Console](https://search.google.com/search-console).
2. Select your property.
3. Go to **Settings → Users and permissions → Add user**.
4. Paste the service account email (e.g. `my-sa@my-project.iam.gserviceaccount.com`).
5. Set permission to **Owner** and confirm.

### 3. Configure Environment

```bash
cp .env.example ../../.env   # copies to repo root (already in .gitignore)
```

Edit `.env`:

```env
# GOTCHA — Property URL must match GSC exactly:
#   Domain property:      sc-domain:wasilzafar.com
#   URL-prefix property:  https://www.wasilzafar.com/   (trailing slash!)
SITE_URL=sc-domain:wasilzafar.com

JSON_KEY_PATH=/absolute/path/to/service_account.json
```

### 4. Install Dependencies

```bash
cd .tools/seo-gsc-manager
pip install -r requirements.txt
```

## Usage

All commands run from `.tools/seo-gsc-manager/`:

```bash
cd .tools/seo-gsc-manager
```

### Submit a single URL (Indexing API)

```bash
python cli.py submit https://www.wasilzafar.com/pages/series/system-design/system-design-introduction.html
python cli.py submit https://www.wasilzafar.com/old-page.html --action URL_DELETED
```

### Batch-submit URLs

Create a text file with one URL per line:

```text
# urls.txt
https://www.wasilzafar.com/pages/series/ai-data-science/python-data-science-numpy-foundations.html
https://www.wasilzafar.com/pages/series/ai-data-science/artificial-neural-networks-guide.html
```

```bash
python cli.py batch urls.txt
python cli.py batch urls.txt --action URL_DELETED
```

Respects the 200 URL/day quota automatically.

### Check notification status

```bash
python cli.py status https://www.wasilzafar.com/index.html
```

### Inspect URL health (index status + mobile + rich results)

```bash
python cli.py inspect https://www.wasilzafar.com/index.html
python cli.py inspect https://www.wasilzafar.com/page1.html https://www.wasilzafar.com/page2.html
```

### List sitemaps

```bash
python cli.py sitemaps
```

### Audit URLs for crawl errors (exports CSV)

```bash
python cli.py audit urls.txt
```

CSV output is saved to `reports/crawl_errors_<timestamp>.csv`.

### Trigger validation guidance

```bash
python cli.py validate
python cli.py validate --error-type "Server error (5xx)"
```

## Module Structure

```
seo-gsc-manager/
├── cli.py            # CLI entry point (argparse)
├── config.py         # Loads .env, validates settings
├── auth.py           # Service-account auth + retry logic
├── indexing.py       # Indexing API: submit, batch, status
├── inspection.py     # URL Inspection API: health checks
├── crawl_errors.py   # Sitemaps listing, crawl audit, validation
├── requirements.txt
├── .env.example
├── README.md
└── reports/          # Auto-created CSV output directory
```
