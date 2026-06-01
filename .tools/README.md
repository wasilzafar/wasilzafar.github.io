# .tools — Build & Maintenance Scripts

Local tooling for wasilzafar.com. This folder is `.gitignore`d — nothing here is deployed.

## Local Setup (one-time)

```bash
uv tool install pre-commit   # or: pipx install pre-commit
pre-commit install
```

Pre-commit hooks run automatically on `git commit` when HTML files are staged.
To skip hooks temporarily (CI will still catch issues):

```bash
git commit --no-verify
```

## Regenerate Generated Files

After adding/changing articles, rebuild before committing:

```bash
node .tools/feeds/build-feeds.js          # Rebuild RSS/Atom feeds
node .tools/search/build-search-index.js  # Rebuild search index
```

CI validates these are up-to-date using `--deterministic` mode for feeds.

## Structure

```
.tools/
├── assessment/         Assessment page generator
├── exams/              Exam practice-set encoding & option shuffling
├── feeds/              RSS & Atom feed generation
├── gtm/                Google Tag Manager API scripts
├── images/gemini/      Gemini batch image generation (JSONL prompts + runner)
├── og/                 Open Graph image generation & compression
├── paths/              Learning Paths page generator
├── quiz/               Quiz data generation (quiz.json per series)
├── search/             Site search index builder
├── seo/                Link checker, sitemap validator, IndexNow, GSC manager
├── analyze_pages.py    Page content analysis
├── check-content-quality.py  Content quality checks
├── check-encoding.py   UTF-8 encoding validation & repair
├── pyproject.toml      Python dependencies (uv)
└── README.md
```

## Quick Reference

### Feeds (`feeds/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `build-feeds.js` | `node .tools/feeds/build-feeds.js` | Generate /feed.xml, /atom.xml + per-category feeds |
| `add-rss-discovery.js` | `node .tools/feeds/add-rss-discovery.js` | Add `<link rel="alternate">` tags to all pages |

### Search (`search/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `build-search-index.js` | `node .tools/search/build-search-index.js` | Rebuild /search-index.json |
| `add-search-all-pages.js` | `node .tools/search/add-search-all-pages.js` | Add search modal HTML to all pages |

### Learning Paths (`paths/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `generate-paths.js` | `node .tools/paths/generate-paths.js` | Regenerate /pages/paths/ hub + path pages |
| `add-path-progress.js` | `node .tools/paths/add-path-progress.js` | Add path-progress.js script to series articles |

### Open Graph Images (`og/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `build.js` | `cd .tools/og && node build.js` | Generate OG + Twitter images (JPEG, incremental) |
| `build.js --force` | `cd .tools/og && node build.js --force` | Regenerate all images |
| `compress.js` | `cd .tools/og && node compress.js` | PNG palette compression |
| `convert-jpeg.js` | `cd .tools/og && node convert-jpeg.js` | Convert PNGs to JPEG |
| `update-og-meta.js` | `node .tools/og/update-og-meta.js` | Update og:image meta tags in all pages |
| `update-og-ext.js` | `node .tools/og/update-og-ext.js` | Switch meta refs from .png to .jpg |

**Dependencies:** `cd .tools/og && npm install` (@napi-rs/canvas, sharp)

### SEO (`seo/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `check_links.py` | `uv run python .tools/seo/check_links.py` | Check for broken internal links |
| `check_sitemap.py` | `uv run python .tools/seo/check_sitemap.py` | Validate sitemap.xml coverage |
| `indexnow_submit.py` | `uv run python .tools/seo/indexnow_submit.py` | Submit URLs to IndexNow (Bing + others) |
| `gsc-manager/cli.py` | `cd .tools/seo/gsc-manager && uv run cli.py` | Google Search Console manager |

**GSC Manager commands:**
- `uv run cli.py sitemaps` — List sitemaps and error counts
- `uv run cli.py submit <url>` — Submit URL to Indexing API
- `uv run cli.py batch <file>` — Batch-submit URLs from file
- `uv run cli.py inspect <url>` — Inspect URL index/mobile health
- `uv run cli.py audit-sitemap <sitemap.xml>` — Full crawl audit

### GTM (`gtm/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `fetch-gtm.py` | `uv run python .tools/gtm/fetch-gtm.py` | Fetch GTM container config |
| `update-gtm.py` | `uv run python .tools/gtm/update-gtm.py` | Update GTM tags/triggers |

### Images (`images/gemini/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `generate_batch_jsonl.py` | `uv run python .tools/images/gemini/generate_batch_jsonl.py` | Create batch image request JSONL files |
| `generate_batch_images.py` | `uv run python .tools/images/gemini/generate_batch_images.py` | Process batch image generation via Gemini |

The `*-batch-image-requests.jsonl` files contain the Gemini prompts for each series' images.

### Exams (`exams/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `encode-practice-set.js` | `node .tools/exams/encode-practice-set.js` | XOR-encode exam practice set answers |
| `shuffle-options.js` | `node .tools/exams/shuffle-options.js` | Randomize option order in exam questions |

### Quiz (`quiz/`)

Quiz data generation for the floating quiz widget (`js/quiz-widget.js`). Each series gets a `quiz.json` with encoded answers (XOR + Base64).

| Script | Command | Purpose |
|--------|---------|---------|
| `build-all-quizzes.js` | `node .tools/quiz/build-all-quizzes.js` | Master script — builds quiz.json for all series |
| `build-arm-quiz.js` | `node .tools/quiz/build-arm-quiz.js` | Initial ARM Assembly quiz (reference impl) |
| `build-quizzes-batch2.js` | `node .tools/quiz/build-quizzes-batch2.js` | Batch 2 quiz generation |
| `build-quizzes-batch3.js` | `node .tools/quiz/build-quizzes-batch3.js` | Batch 3 quiz generation |
| `build-quizzes-batch4.js` | `node .tools/quiz/build-quizzes-batch4.js` | Batch 4 quiz generation |
| `build-quizzes-batch5.js` | `node .tools/quiz/build-quizzes-batch5.js` | Batch 5 quiz generation |
| `generate-quiz-skeletons.js` | `node .tools/quiz/generate-quiz-skeletons.js` | Generate empty quiz.json scaffolds for new series |

**Output:** `pages/series/[name]/quiz.json` (52 series, 468 total questions)

**Quiz JSON Schema:**
```json
{
  "series": "arm-assembly",
  "title": "ARM Assembly",
  "version": 2,
  "totalParts": 28,
  "security": { "method": "xor-b64", "salt": "arm-asm-2026" },
  "questions": [
    {
      "id": "arm-q001",
      "part": 1,
      "difficulty": "beginner|intermediate|advanced",
      "type": "mcq|true-false|fill-blank|code-output|ordering|matching|scenario|diagnosis|debug|architecture|calculation|ethical",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "<xor-b64-encoded>",
      "explanation": "...",
      "articleSlug": "arm-assembly-01-architecture-history",
      "tags": ["history", "architecture"]
    }
  ]
}
```

**Encoding answers:** Use `QuizEncode(answer, salt)` in browser console (exposed by `quiz-widget.js`).

### Assessment (`assessment/`)

Full-page assessment generator. Creates `assessment.html` for every series with a `quiz.json`.

| Script | Command | Purpose |
|--------|---------|---------|
| `build-assessments.js` | `node .tools/assessment/build-assessments.js` | Generate assessment.html for all 52 series |

**Output:** `pages/series/[name]/assessment.html`

**Runtime files (deployed):**
- `js/assessment.js` — Assessment engine (loads quiz.json, presents all questions, tracks results)
- `js/quiz-widget.js` — Floating quiz teaser (3 random questions, links to full assessment)

**Features:**
- All questions from quiz.json in randomized order
- Progress bar + running timer
- Instant feedback with explanations
- Results breakdown by difficulty level and question type
- Score saved to localStorage (last 10 attempts per series)
- Retry button to re-shuffle and restart

## Common Workflows

### After adding new articles
```bash
node .tools/feeds/build-feeds.js          # Update RSS feeds
node .tools/search/build-search-index.js  # Update search index
cd .tools/og && node build.js             # Generate OG images (incremental)
node .tools/og/update-og-meta.js          # Update meta tags for new articles
python .tools/seo/check_links.py          # Verify no broken links
python .tools/seo/indexnow_submit.py      # Notify Bing/Yandex of new URLs
```

### After adding/updating quiz questions
```bash
node .tools/quiz/build-all-quizzes.js     # Rebuild quiz.json files
node .tools/assessment/build-assessments.js  # Regenerate assessment pages
```

### Full rebuild
```bash
cd .tools/og && node build.js --force     # Regenerate all OG images
node .tools/feeds/build-feeds.js          # Rebuild all feeds
node .tools/search/build-search-index.js  # Rebuild search index
node .tools/paths/generate-paths.js       # Rebuild learning paths
node .tools/quiz/build-all-quizzes.js     # Rebuild all quizzes
node .tools/assessment/build-assessments.js  # Rebuild all assessments
python .tools/seo/check_links.py          # Validate all internal links
```

### SEO submission (after deploy)
```bash
python .tools/seo/indexnow_submit.py                  # Submit all sitemap URLs to IndexNow
cd .tools/seo/gsc-manager && uv run cli.py sitemaps   # Check GSC sitemap status
cd .tools/seo/gsc-manager && uv run cli.py submit <url>  # Submit priority URL to Google
```

## Environment

- **Node.js** ≥ 18 (for JS scripts)
- **Python** 3.12+ via `uv` (for Python scripts)
- **OG images** require `npm install` in `.tools/og/` first
