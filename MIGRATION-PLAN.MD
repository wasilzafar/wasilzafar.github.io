## Plan: Static-to-Next.js Migration for wasilzafar.com

**TL;DR** — Migrate 1,493+ static HTML articles, 62 series, and 9,000+ URLs from a GitHub Pages static site to a production-grade Next.js App Router application using a **four-stage, zero-SEO-loss approach**. Framework migration is always separated from URL scheme changes: Stage 1 inventories content archetypes and captures baseline metrics; Stage 2 deploys Next.js serving identical existing URLs with the same metadata (no URL changes); Stage 3 migrates content to MDX archetype-by-archetype and ports interactive tooling to React; Stage 4 cleans up URLs to canonical clean paths and adds monetization and MCP. No `.html` URL is changed until full parity and Lighthouse benchmarks are verified in staging.

---

## Stage 1 — Discovery & Content-Class Inventory

**Goal:** Produce a complete, categorized map of all pages before touching any code. This is the input to every subsequent stage.

### 1. Content archetype audit

Run a scan of all HTML files and categorize every page by complexity class. The migration effort per page scales directly with archetype:

| Archetype | Definition | Est. count | Migration effort |
|---|---|---|---|
| **Simple article** | Prose + highlight-box + related posts only | ~400 | Low — auto-convert to MDX |
| **Code-heavy article** | Has PrismJS `<pre><code>` blocks | ~350 | Medium — rehype-pretty-code replaces Prism |
| **Mermaid article** | Contains `.mermaid-container` blocks | ~155 | Medium — `MermaidDiagram` client component |
| **Doc-generator article** | Has `.canvas-form` with generate buttons | ~88 | High — `DocGeneratorForm` React component |
| **Quiz/assessment article** | Has `quiz.json` + quiz widget + assessment page | ~62 series | High — `QuizWidget` + `AssessmentEngine` |
| **Expanding-series hub** | `index.html` listing page with hex tile sections | ~20 | Medium — `HexGrid` component |
| **Category hex page** | `/pages/categories/*.html` | 12 | Medium — `HexGrid` + `CategoryHero` |
| **Learning path page** | `/pages/paths/*.html` + progress tracking | 8+ | Medium — `usePathProgress` hook |
| **Exam page** | `/pages/exams/**` static content | ~50+ | Medium — in scope for Stage 2; tracker UI in Stage 3 |
| **Standalone article** | `/pages/YYYY/MM/*.html` | ~25 | Low–Medium |

Implement as `scripts/audit-archetypes.js` — outputs `content-audit.json` with each HTML file's archetype, complexity flags (`hasMermaid`, `hasDocGen`, `hasQuiz`, `hasPrism`), and counts per class. This JSON drives the Stage 3 migration script's per-pass scope.

### 2. Rollback trigger metrics (baseline)

Capture the production baseline before any code change. These numbers define the rollback trigger post-cutover:

- **Core Web Vitals** (10 representative pages): LCP, CLS, FCP, TTFB via Lighthouse CI
- **Crawl coverage**: Total indexed URL count from Google Search Console export
- **Sitemap URL count**: Current `sitemap.xml` entry count (~1,800+)
- **Search index size**: `search-index.json` article count
- **Weekly organic sessions**: GA4 export prior to any DNS change

Store as `scripts/baseline-metrics.json`. Rollback signals are split by response latency — organic traffic is far too lagging to drive a 5-minute decision:

**Immediate triggers** (act within the first hour post-cutover):
- 5xx error rate > 1% on Vercel dashboard
- `next build` or deployment pipeline failure
- Lighthouse LCP regression ≥20% vs. Stage 1 baseline on any smoke-test URL
- Smoke tests failing on >2 of the 10 representative verification URLs

**Trailing triggers** (monitored over 14 days — inform Stage 4 gate, do not trigger Stage 2 rollback):
- GSC indexed page count drops ≥10% vs. baseline
- Weekly organic sessions drop ≥10% vs. pre-cutover baseline
- GSC coverage error spike (e.g., redirect loops, soft 404s)

### 3. Rollback mechanism

Named switch and rollback window for each stage cutover:

- **Stage 2 cutover** (GitHub Pages → Vercel): Revert CNAME to `wasilzafar.github.io` within 5 minutes if any immediate trigger fires (see step 2). Set DNS TTL to 60s before cutover.
- **Stage 4 cutover** (URL scheme change — rewrites → redirects): Revert the `redirects()` block in `next.config.js` back to `rewrites()` and redeploy. Monitor GSC coverage report for 14 days.
- **Rollback window**: Keep the static GitHub Pages branch live on a `gh-pages-backup` branch for 90 days after final cutover.

### 3a. Legacy URL inventory

Every URL family below must return the **expected HTTP status code** from the Next.js deployment **before Stage 2 cutover**. Content pages must return HTTP 200. `/404.html` must return HTTP 404 — returning 200 there would weaken crawl signals and mislead Googlebot. No URL changes until Stage 4.

| Route family | Current URL pattern | App Router route | Expected status |
|---|---|---|---|
| Homepage | `/` | `app/page.tsx` | 200 |
| Series articles | `/pages/series/:series/:slug.html` | `app/pages/series/[series]/[slug]/page.tsx` | 200 |
| Series index / hub | `/pages/series/:series/` (`index.html`) | `app/pages/series/[series]/page.tsx` | 200 |
| Category pages | `/pages/categories/:cat.html` | `app/pages/categories/[category]/page.tsx` | 200 |
| Learning paths | `/pages/paths/:path.html` | `app/pages/paths/[path]/page.tsx` | 200 |
| Standalone articles | `/pages/:year/:month/:slug.html` | `app/pages/[year]/[month]/[slug]/page.tsx` | 200 |
| Exam pages | `/pages/exams/**` | `app/pages/exams/[[...path]]/page.tsx` | 200 |
| Contact | `/pages/contact.html` | `app/pages/contact/page.tsx` | 200 |
| Disclaimer | `/disclaimer.html` | `app/disclaimer/page.tsx` | 200 |
| Privacy policy | `/privacy-policy.html` | `app/privacy-policy/page.tsx` | 200 |
| 404 | `/404.html` | `app/not-found.tsx` (Next.js built-in) | **404** |
| Static feeds | `/feed.xml`, `/atom.xml`, `/feeds/**.xml` | Served from `/public/` | 200 |
| Search index | `/search-index.json` | Served from `/public/` | 200 |
| OG images | `/images/og/**` | Served from `/public/images/og/` | 200 |

Root-level legal pages (`/disclaimer.html`, `/privacy-policy.html`) need explicit `rewrites()` entries since they sit outside the `/pages/` prefix — see step 6.

---

## Stage 2 — Runtime Parity on Existing URLs

**Goal:** Deploy Next.js to Vercel serving all pages at their **exact existing URLs** — no `.html` paths change yet. The live site is identical to the current GitHub Pages version from a user and crawler perspective.

> **Why existing URLs first:** Changing framework and URL scheme simultaneously creates two orthogonal risk surfaces. Stage 2 isolates framework risk only. URL migration risk is deferred to Stage 4, after full parity verification.

### 4. Repository bootstrap

Init `next-app` branch in the same repo:

```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir
```

Deploy to **Vercel** from day one — do **not** use `output: 'export'`. Route Handlers, `next/script`, middleware, and ISR are all required across Stages 2–4. GitHub Pages compatibility is abandoned at Stage 2 cutover; Vercel is the host.

### 5. Hybrid HTML content loader

Before converting any content to MDX, implement `lib/content-loader.ts` — a TypeScript version of the existing `getMeta()`/`getExcerpt()`/`getHeadings()` pattern from `build-search-index.js` — that reads existing HTML files from `pages/` and returns structured content objects:

```ts
interface ArticleContent {
  frontmatter: { title, description, date, category, keywords, ogImage, ... };
  bodyHtml: string;     // raw .blog-content div innerHTML
  headings: string[];   // H2 headings for TOC
  excerpt: string;      // first meaningful paragraph
  archetype: ArticleArchetype;
  hasQuiz: boolean;
  hasMermaid: boolean;
  hasDocGen: boolean;
}
```

Next.js article pages use `content-loader.ts` to serve `bodyHtml` via `dangerouslySetInnerHTML` inside a React layout shell. This means:
- Zero MDX conversion needed before Stage 2 launch
- Content served from the same existing HTML source files
- React layouts (nav, footer, TOC, scroll-to-top) wrap static HTML bodies
- Interactive features (quiz widget, doc generators) still load as vanilla JS via `next/script` in Stage 2 — ported to React in Stage 3

### 6. Route structure (existing URL shape)

All routes in Stage 2 mirror the **current URL structure exactly**:

- `app/pages/series/[series]/[slug]/page.tsx` — individual articles
- `app/pages/categories/[category]/page.tsx` — 12 category pages
- `app/pages/series/[series]/page.tsx` — series index/hub pages
- `app/pages/paths/[path]/page.tsx` — learning path pages
- `app/pages/[year]/[month]/[slug]/page.tsx` — standalone articles
- `app/pages/exams/[[...path]]/page.tsx` — exam static pages (in scope; tracker UI deferred to Stage 3)
- `app/pages/contact/page.tsx` — contact page (current URL: `/pages/contact.html`)
- `app/disclaimer/page.tsx` — disclaimer (current URL: `/disclaimer.html`)
- `app/privacy-policy/page.tsx` — privacy policy (current URL: `/privacy-policy.html`)
- `app/not-found.tsx` — 404 page (rendered with HTTP 404 for all unmatched routes, including `/404.html`, which returns 404 because no app route matches it; **verify this explicitly before cutover — a misconfigured catch-all route would return 200 instead**)

Add Next.js `rewrites()` in `next.config.js` to strip the `.html` extension transparently, including the root-level legal and contact pages that sit outside `/pages/`:

```js
async rewrites() {
  return [
    { source: '/pages/series/:series/:slug.html', destination: '/pages/series/:series/:slug' },
    { source: '/pages/categories/:cat.html',      destination: '/pages/categories/:cat' },
    { source: '/pages/paths/:path.html',          destination: '/pages/paths/:path' },
    { source: '/pages/:year/:month/:slug.html',   destination: '/pages/:year/:month/:slug' },
    { source: '/pages/exams/:path*.html',         destination: '/pages/exams/:path*' },
    { source: '/pages/contact.html',              destination: '/pages/contact' },
    { source: '/disclaimer.html',                 destination: '/disclaimer' },
    { source: '/privacy-policy.html',             destination: '/privacy-policy' },
  ];
}
```

These are **rewrites, not redirects** — the browser URL stays as `.html`, preserving all existing backlinks, bookmarks, and canonical URLs with zero SEO signal change. The `redirects()` switch happens only in Stage 4.

### 7. SEO Metadata API

Replace every page's `<meta>` block with Next.js 14 `generateMetadata()` sourced from `content-loader.ts` frontmatter:
- Static `metadata` export on homepage, categories, paths
- Dynamic `generateMetadata({ params })` on article routes
- `metadataBase: new URL('https://www.wasilzafar.com')`
- Full OpenGraph, Twitter cards, `article:published_time`, canonical URL
- **Canonical must match existing `.html` paths in Stage 2** (e.g., `https://www.wasilzafar.com/pages/series/arm-assembly/arm-assembly-01-architecture-history.html`). Canonicals are updated to clean paths only in Stage 4 alongside the 301 redirects.
- RSS alternates: `/feed.xml`, `/atom.xml`

### 8. OG image strategy

Keep the 1,858 pre-generated JPEGs in `/public/images/og/` (copied from `images/og/`). Reference them in `generateMetadata` → `openGraph.images`. Migration to `next/og` edge-runtime generation deferred to Stage 4 as an optional improvement.

### 9. Static asset copy

Move `images/`, `feeds/`, `feed.xml`, `atom.xml`, `CNAME`, `BingSiteAuth.xml`, `humans.txt`, `llms.txt` into `/public/`. Do **not** copy `sitemap.xml` or `robots.txt` — `next-sitemap` is the sole owner of both and writes them to `public/` automatically via `postbuild` (step 18); copying stale static versions would be silently overwritten or create conflicts. Remove them from the repo or add them to `.gitignore`.

**Artifact deployment rule — feeds and search index:** `build-feeds.js` and `build-search-index.js` continue to write their outputs to the **repo root** (`feed.xml`, `atom.xml`, `feeds/`, `search-index.json`). This preserves the existing `validate.yml` diff checks (`git diff --exit-code -- search-index.json` and `git diff --exit-code -- feed.xml atom.xml feeds/`) without any changes. A `prebuild` npm script copies these root outputs into `public/` before `next build` runs; `next-sitemap` then generates `sitemap.xml` and `robots.txt` into `public/` in `postbuild`:

```json
"scripts": {
  "prebuild": "cp feed.xml atom.xml search-index.json public/ && cp -r feeds public/",
  "build": "next build",
  "postbuild": "next-sitemap"
}
```

Vercel runs `npm run build`, which triggers `prebuild` automatically before the build and `postbuild` (`next-sitemap`) automatically after. The `SearchModal` client fetches `/search-index.json` — this resolves to `public/search-index.json` at deploy time, so the `getBasePath()` logic in `search.js` (and its React port) continues to work unchanged.

### 10. GTM + Consent Mode v2

Remove inline `<script>` GTM blocks from every page. Add a `GoogleTagManager` client component using `next/script` with `strategy="afterInteractive"`. Keep `gtag('consent', 'default', {...})` initialization in a `ConsentInit` component with `strategy="beforeInteractive"`. Preserve GTM ID `GTM-PBS8M2JR`. The EEA denied/non-EEA granted default split from the current template is preserved exactly.

### 11. Cookie consent

Port `cookie-consent.js` to a `CookieConsentBanner` React client component using `useState`/`useEffect` with `localStorage`. Behavior is identical to current.

### 12. Design token migration

Extract CSS variables from `main.css` `:root` into `tailwind.config.ts` theme extensions: `colors.navy`, `colors.teal`, `colors.crimson`, `colors.blue`, `colors.light`. Keep `main.css` loaded globally in Stage 2 — Tailwind utilities are used for new React shell components only; existing CSS classes on `bodyHtml` content still work without change.

### 13. Stage 2 shell component extraction

Port structural shell components (layouts, nav, footer, TOC) to React. These wrap every page and are not inside `bodyHtml`. Content component classes inside `bodyHtml` (`.highlight-box`, `.experiment-card`, etc.) are already styled by `main.css` and do not need React porting in Stage 2.

Priority order for Stage 2 shell components:
- `NavV16` — the 3D flip navigation bar (`toggleNav16()` → component state)
- `FooterV2` — the footer wrapper
- `SidenavTOC` — sliding TOC panel (`openNav()`/`closeNav()` → component state)
- `ScrollToTop` + `CategoryIndicator` — blog utility buttons (`initBlogScrollFeatures()`)
- `CookieConsentBanner`
- `SearchModal` — Fuse.js search (see step 14)
- `GoogleTagManager` + `ConsentInit`
- `LeafletMap` — homepage only (`initLeafletMaps()`)

Content components (`BlogContent`, `HighlightBox`, `ExperimentCard`, `HexGrid`, `HexTile`, `MermaidContainer`) are deferred to Stage 3.

### 14. Search — preserve existing indexer and coverage

Keep `build-search-index.js` as a **Node.js build-time script** in Stage 2. Do not replace it with a frontmatter-only source. The existing indexer extracts multiple fields that drive Fuse.js relevance:
- `title`, `description`, `keywords` from meta tags
- `excerpt` from the first substantive paragraph in `.blog-content`
- `headings` from H2 elements
- `category`/`section` derived from file path and meta
- Scans series, exams, standalone yearly content, and paths — not just series

Port `search.js` to a `SearchModal` React client component. The `search-index.json` format, Fuse.js integration, and lazy-loading on modal open remain unchanged. In Stage 3, after content moves to MDX, update `build-search-index.js` to parse MDX files via `gray-matter` and reconstruct the same fields from the MDX AST — no change to the index format or search UX.

### 15. Feeds — keep as Node.js scripts

**Do not** port `build-feeds.js` to a Route Handler in Stage 2. The existing script-based model is working, CI-validated, and serves feeds correctly. Feed generators write to the **repo root** (same as today), and the `prebuild` npm script defined in step 9 copies them into `public/` before `next build` runs — exactly the same artifact flow as `search-index.json`. Route Handler feeds are an optional Stage 4 upgrade if on-demand ISR generation is needed.

### 16. CI — evolve `validate.yml`, do not create a new workflow

The existing `.github/workflows/validate.yml` already covers encoding, internal links, sitemap, content quality, search index freshness, and feed freshness. **Do not** create a parallel `ci.yml`. Add the Next.js checks to `validate.yml`:

```yaml
- name: TypeScript type check
  run: npx tsc --noEmit

- name: ESLint
  run: npx eslint . --max-warnings 0

- name: Next.js build
  run: npx next build

- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://staging.wasilzafar.com/
      https://staging.wasilzafar.com/pages/categories/technology.html
      https://staging.wasilzafar.com/pages/series/arm-assembly/arm-assembly-01-architecture-history.html
    budgetPath: ./lighthouse-budget.json
```

Lighthouse budget thresholds: LCP ≤ 2.5s, CLS ≤ 0.1, FCP ≤ 1.8s.

Also update the existing `Check sitemap coverage` step in `validate.yml`: `check_sitemap.py` currently reads the repo-root `sitemap.xml`. After Stage 2, `next-sitemap` owns this file and writes it to `public/` during `postbuild` — the repo-root file will be absent or stale. Update the step to validate `public/sitemap.xml`, or replace it with a count assertion on the `next-sitemap` output: `test $(grep -c '<loc>' public/sitemap.xml) -ge 1800`.

### 17. `next/image`

Replace `<img>` tags in React shell components (nav, footer, OG image references) with `<Image>` from `next/image`. Images inside `bodyHtml` (`dangerouslySetInnerHTML`) cannot be replaced until Stage 3 MDX migration.

### 18. `next-sitemap`

Install `next-sitemap`. Configure `next-sitemap.config.js` to generate `sitemap.xml` and `robots.txt` from all app routes. Priorities: homepage `1.0`, categories `0.9`, series index `0.8`, articles `0.7`. Exclude `/api/*`.

**Stage 2 `.html` sitemap mechanism:** `next-sitemap` infers URLs from App Router route paths, which are extensionless internal destinations (e.g. `/pages/series/arm-assembly/arm-assembly-01`). The legacy URL inventory has three distinct public-facing shapes that must be preserved exactly: `.html`-suffixed pages, trailing-slash directory-style URLs (series hubs at `/pages/series/:series/`), and extensionless URLs (exam pages). A single regex appending `.html` everywhere is wrong — it would incorrectly suffix series hub URLs and skip exam pages entirely. Use explicit per-family mappings:

```js
// next-sitemap.config.js (Stage 2) — explicit per-family URL shapes
module.exports = {
  siteUrl: 'https://www.wasilzafar.com',
  transform: async (config, path) => {
    // Series articles: /pages/series/:series/:slug  →  append .html
    if (/^\/pages\/series\/[^/]+\/[^/]+$/.test(path))
      return { loc: path + '.html', changefreq: 'weekly', priority: 0.7 };
    // Series hub / index: /pages/series/:series  →  trailing slash (directory-style legacy URL)
    if (/^\/pages\/series\/[^/]+$/.test(path))
      return { loc: path + '/', changefreq: 'weekly', priority: 0.8 };
    // Category pages: /pages/categories/:cat  →  append .html
    if (/^\/pages\/categories\/[^/]+$/.test(path))
      return { loc: path + '.html', changefreq: 'weekly', priority: 0.9 };
    // Learning paths: /pages/paths/:path  →  append .html
    if (/^\/pages\/paths\/[^/]+$/.test(path))
      return { loc: path + '.html', changefreq: 'monthly', priority: 0.7 };
    // Standalone articles: /pages/:year/:month/:slug  →  append .html
    if (/^\/pages\/\d{4}\/\d{2}\/[^/]+$/.test(path))
      return { loc: path + '.html', changefreq: 'monthly', priority: 0.7 };
    // Exam pages: extensionless (mixed .html / directory-style; no suffix added)
    if (/^\/pages\/exams\//.test(path))
      return { loc: path, changefreq: 'monthly', priority: 0.6 };
    // Root-level legal and contact pages  →  append .html
    if (/^\/(disclaimer|privacy-policy|pages\/contact)$/.test(path))
      return { loc: path + '.html', changefreq: 'yearly', priority: 0.3 };
    // Homepage and everything else — no transformation
    return { loc: path, changefreq: 'weekly', priority: config.priority };
  },
};
```

In Stage 4, remove the `transform` block so clean-path URLs are emitted directly.

### Stage 2 cutover

Once `next build` passes, Lighthouse benchmarks are met, and 10 representative URLs are manually verified:
1. Lower DNS TTL to 60s
2. Update CNAME from `wasilzafar.github.io` → Vercel deployment
3. Monitor Vercel dashboard error rate and smoke-test URLs for 1 hour — act only on **immediate triggers** (see step 2): 5xx rate > 1%, Lighthouse LCP regression ≥20%, smoke tests failing on >2 of 10 URLs
4. If any immediate trigger fires: revert CNAME to `wasilzafar.github.io` within 5 minutes
5. GSC indexed page count and organic sessions are **trailing signals** — monitor over 14 days to inform the Stage 4 gate; do not use as cutover rollback triggers

---

## Stage 3 — Content Model Migration & Interactive Feature Porting

**Goal:** Convert content from HTML source files to MDX progressively by archetype class. Port interactive JS tools (quiz, doc generator, assessment, learning paths) to React. All URLs remain unchanged throughout Stage 3.

### 19. MDX pipeline and content destination conventions

Install `@next/mdx`, `next-mdx-remote`, `gray-matter`, `rehype-pretty-code`, `remark-gfm`. Establish the following content destination conventions for all content families before the migration script runs:

| Content family | Source path | MDX destination | Approach |
|---|---|---|---|
| Series articles | `pages/series/[s]/[slug].html` | `content/series/[s]/[slug].mdx` | Passes A–E of migration script |
| Standalone articles | `pages/YYYY/MM/[slug].html` | `content/articles/YYYY/MM/[slug].mdx` | Pass A/B of migration script |
| Learning paths | `pages/paths/[path].html` | `content/paths/[path].mdx` | Pass A or React page if data-driven |
| Exam pages | `pages/exams/**` | HTML-backed via `content-loader.ts` | Not converted to MDX; tracker UI ported as React components in Stage 3 |
| Category hex pages | `pages/categories/*.html` | React pages (`app/pages/categories/`) | Pass F — hand-authored, not MDX |
| Expanding-series hubs | `pages/series/[s]/index.html` | React pages (`app/pages/series/[s]/`) | Pass F — hand-authored, not MDX |
| Legal / support | `disclaimer.html`, `privacy-policy.html`, `pages/contact.html` | React pages (`app/disclaimer/`, `app/privacy-policy/`, `app/pages/contact/`) | Short pages; direct React authoring is faster than MDX conversion |
| 404 | `404.html` | `app/not-found.tsx` | Next.js built-in; no MDX conversion |

Frontmatter for all MDX files: `title`, `description`, `date`, `category`, `keywords`, `readingTime`, `ogImage`. Add family-specific fields: `series`, `part` for series articles; `year`, `month` for standalone articles.

### 20. Content migration script — archetype-class passes

Write `scripts/migrate-html-to-mdx.js` driven by `content-audit.json` from Stage 1. Migration runs **archetype class by archetype class**, not all-at-once:

- **Pass A — Simple articles** (~400): Body HTML → clean MDX prose. Auto-convert.
- **Pass B — Code-heavy articles** (~350): Replace `<pre><code class="language-*">` with fenced code blocks. `rehype-pretty-code` handles highlighting at build time — eliminates 7 PrismJS CDN loads per page.
- **Pass C — Mermaid articles** (~155): Replace `.mermaid-container` HTML with `<MermaidDiagram>` MDX component calls.
- **Pass D — Doc-generator articles** (~88): Replace `.canvas-form` HTML with `<DocGeneratorForm docType="..." seriesFile="...">` MDX component.
- **Pass E — Quiz/assessment articles** (~62 series): Add `<QuizWidget />` to MDX. `quiz.json` files co-locate under `content/series/[s]/quiz.json`.
- **Pass F — Expanding-series hubs and category pages**: Hand-authored as React pages (not MDX) — these are data-driven layout pages, not prose.

For each pass, the script extracts frontmatter from `<meta>` tags (same `getMeta()` pattern from `build-search-index.js`), extracts `.blog-content` innerHTML, applies archetype-specific transformation, flags files it cannot automatically convert with `<!-- NEEDS_MANUAL_REVIEW -->`, writes the `.mdx` file, and outputs a migration report. Estimate: ~450 files across Passes C–E need manual review.

### 21. Content component extraction (deferred from Stage 2)

- `HighlightBox` (`.highlight-box` + `.highlight-crimson` + `.highlight-navy`) — used in MDX
- `ExperimentCard` (`.experiment-card`) — used in MDX
- `HexGrid` + `HexTile` system — used in category React pages
- `MermaidDiagram` client component — `useEffect` initialization, wraps CDN `mermaid@11`
- `BlogContent` wrapper — justified text, heading color cascade

### 22. Prism → rehype-pretty-code

Swap PrismJS CDN (7 script tags per article) for server-side syntax highlighting via `rehype-pretty-code`. Default theme: `github-dark` (matches current `prism-tomorrow`). Add a `ThemeSwitcher` client component for localStorage preference, equivalent to `initPrismThemeSwitcher()`.

### 23. Quiz system → React components

Port `quiz-widget.js` (530 lines) to a `QuizWidget` React client component. XOR decode stays client-side. Port `assessment.js` to an `AssessmentEngine` React client component at the existing assessment URL.

### 24. Doc generators → TypeScript client components

Port `doc-generator-core.js` + 21 series JS files to TypeScript. Each `generate[DocType]Word/Excel/PDF/PPTX` method remains a pure client-side function. Wrap in a `DocGeneratorForm` React component using `react-hook-form` (replaces `FormPersistence`/`CanvasFormHandler`). CDN libraries (`docx`, `xlsx`, `pptxgenjs`, `jspdf`) dynamically imported (`import()`) on button click only — ~2MB combined; lazy loading is essential to avoid LCP regression on doc-generator pages.

### 25. Learning path progress

Port `path-progress.js` to a `usePathProgress` custom hook using `localStorage`. Path pages become interactive React client components showing completion circles.

### 26. Search indexer update for MDX

Update `build-search-index.js` to read MDX files after each archetype pass completes. Parse MDX frontmatter via `gray-matter` and reconstruct `excerpt` and `headings` from the MDX AST using `remark`. The indexed fields and `search-index.json` format remain unchanged — no impact on `SearchModal` or Fuse.js.

### 27. ISR for high-traffic pages

Category pages and homepage: `revalidate: 3600`. New articles appear without full redeployment.

### 28. NextAuth.js integration

Install `next-auth@5`. Providers: Email magic link (AWS SES), GitHub OAuth, Google OAuth. Session: JWT.

### 29. User profile API routes

`app/api/user/profile/route.ts`, `app/api/user/bookmarks/route.ts`. DynamoDB single-table: PK=`USER#userId`, SK=`BOOKMARK#articleSlug`. AWS SDK v3 (`@aws-sdk/client-dynamodb`).

### 30. Bookmarking & reading history

Server-persisted data for logged-in users via Server Actions; `localStorage` fallback for guests.

### 31. Analytics migration

Move GTM event pushes from `initAnalyticsTracking()` to React event handlers in category page components. Same event schema: `engagement_cta_click` with `article_slug`, `category`, `tracking_id`.

---

## Stage 4 — URL Cleanup, Monetization & AI

**Goal:** Switch canonical URLs to clean paths (the SEO-risky step, done only after full parity verification), add premium monetization, and expose the MCP endpoint for AI agent integration.

> **Do not start Stage 4 until:** All Stage 3 archetype passes are complete, Lighthouse benchmarks pass in staging, and GSC coverage has been stable for ≥14 days post Stage 2 cutover.

### 32. URL scheme migration — switch rewrites to 301 redirects

Replace Stage 2's `rewrites()` with `redirects()` in `next.config.js`:

```js
async redirects() {
  return [
    // Article routes — match both .html (inbound links) and bare slug (bookmarks from Stage 2)
    { source: '/pages/series/:series/:slug.html', destination: '/series/:series/:slug', permanent: true },
    { source: '/pages/series/:series/:slug',      destination: '/series/:series/:slug', permanent: true },
    // Series hub / index pages (expanding-series landing pages)
    { source: '/pages/series/:series/index.html', destination: '/series/:series',       permanent: true },
    { source: '/pages/series/:series/',           destination: '/series/:series',       permanent: true },
    { source: '/pages/series/:series',            destination: '/series/:series',       permanent: true },
    { source: '/pages/categories/:cat.html',      destination: '/categories/:cat',      permanent: true },
    { source: '/pages/categories/:cat',           destination: '/categories/:cat',      permanent: true },
    { source: '/pages/paths/:path.html',          destination: '/paths/:path',          permanent: true },
    { source: '/pages/paths/:path',               destination: '/paths/:path',          permanent: true },
    { source: '/pages/:year/:month/:slug.html',   destination: '/:year/:month/:slug',   permanent: true },
    { source: '/pages/:year/:month/:slug',        destination: '/:year/:month/:slug',   permanent: true },
    // Contact (currently nested under /pages/)
    { source: '/pages/contact.html',              destination: '/contact',              permanent: true },
    { source: '/pages/contact',                   destination: '/contact',              permanent: true },
    // Root-level legal pages (no /pages/ prefix)
    { source: '/disclaimer.html',                 destination: '/disclaimer',           permanent: true },
    { source: '/privacy-policy.html',             destination: '/privacy-policy',       permanent: true },
  ];
}
```

Add new clean-path app routes:
- `app/series/[series]/[slug]/page.tsx`
- `app/categories/[category]/page.tsx`
- `app/series/[series]/page.tsx`
- `app/[year]/[month]/[slug]/page.tsx`
- `app/paths/[path]/page.tsx`
- `app/contact/page.tsx`
- `app/disclaimer/page.tsx`
- `app/privacy-policy/page.tsx`

Update canonicals in `generateMetadata` from `.html` paths to clean paths. Update `next-sitemap.config.js` to generate clean-path URLs only. Monitor GSC coverage for 14 days. Rollback: revert `redirects()` back to `rewrites()` and redeploy.

### 33. JSON-LD structured data

Add `Article`, `ProfilePage`, `BreadcrumbList`, and `WebSite` schemas via inline `<script type="application/ld+json">` in `generateMetadata`. Improves rich result eligibility in Google and Bing.

### 34. Stripe integration

Install `stripe` + `@stripe/stripe-js`:
- `app/api/stripe/create-checkout/route.ts` — Stripe Checkout session
- `app/api/stripe/webhook/route.ts` — processes `checkout.session.completed`, writes `SK: SUBSCRIPTION#userId` to DynamoDB
- `middleware.ts` — checks subscription via Edge-compatible JWT claim before rendering premium routes

### 35. Premium content gates

`PremiumGate` server component checks session subscription tier. Non-subscribers see teaser + CTA. `middleware.ts` for route-level protection at the Edge.

### 36. MCP server endpoint

`app/api/mcp/route.ts` — JSON-RPC 2.0 MCP server:
- `tools/search_articles` — returns `title`, `slug`, `description`, `category`
- `tools/get_article` — frontmatter + first 500 words by slug
- `tools/list_series` — all series with article counts
- `tools/book_consultation` — Cal.com booking webhook
- `/.well-known/mcp.json` manifest for agent discovery
- `zod` schema validation on all tool inputs (OWASP injection prevention)

### 37. `next/og` for OG images (optional)

Replace the 1,858 pre-generated JPEG OG images with Vercel Edge-runtime `app/api/og/route.tsx`. Eliminates the manual `build.js` step and ~53MB `/images/og/` directory. Implement only if the static JPEG maintenance cost becomes an issue.

### 38. Edge personalisation

Vercel Edge Middleware for A/B testing article recommendations and geo-based content targeting (e.g., exam content by region).

---

## Relevant Files

| File | Role in migration |
|---|---|
| `.template-blog-post.html` | Canonical article HTML structure — reference for content-loader extraction (Stage 2) |
| `css/main.css` | ~4,217 lines — color tokens → `tailwind.config.ts` (Stage 2); component classes → React (Stage 3) |
| `js/main.js` | ~875 lines — 9 functions → React hooks/components across Stages 2–3 |
| `js/doc-generator-core.js` | ~1,684 lines — TypeScript client utility in Stage 3 |
| `js/series/doc-generator-*.js` | 21 files — series generators ported in Stage 3 |
| `js/quiz-widget.js` | ~530 lines — `QuizWidget` React component in Stage 3 |
| `js/assessment.js` | ~400 lines — `AssessmentEngine` React component in Stage 3 |
| `js/search.js` | ~200 lines — `SearchModal` React component in Stage 2 |
| `js/path-progress.js` | ~100 lines — `usePathProgress` hook in Stage 3 |
| `.github/scripts/feeds/build-feeds.js` | Stays as Node.js script; optional Route Handler upgrade in Stage 4 |
| `.github/scripts/search/build-search-index.js` | Stays as Node.js script; updated in Stage 3 to read MDX files |
| `.github/workflows/validate.yml` | Extended in Stage 2 with TypeScript check, ESLint, `next build`, Lighthouse CI |
| `pages/series/[s]/quiz.json` | Co-locate under `content/series/[s]/quiz.json` in Stage 3 |
| `images/og/` | Copied to `public/images/og/` in Stage 2; optional `next/og` replacement in Stage 4 |
| `pages/exams/` | Static content in scope for Stage 2; exam tracker UI ported in Stage 3 |
| `pages/series/sensors-actuators/` | 101 files — canonical expanding-series example for content-loader design |

---

## Verification

**Stage 2 pre-cutover gate** (all must pass before DNS change):
1. **URL parity**: Manually verify 20 representative URLs render correctly with metadata identical to the current static site
2. **SEO snapshot**: Lighthouse CI on 10 pages — LCP ≤ 2.5s, CLS ≤ 0.1, FCP ≤ 1.8s — must not regress vs. Stage 1 baseline
3. **Sitemap coverage**: `next-sitemap` output URL count ≥ current count (~1,800+)
4. **Canonical URL audit**: All canonicals in `generateMetadata` match existing `.html` paths exactly
5. **Search**: Open modal, type "ARM Assembly", verify ≥5 results with correct slugs
6. **RSS**: Fetch `/feed.xml` via W3C Feed Validator — ≤50 items, `<pubDate>` parses correctly
7. **OG images**: 20 spot-checks — `og:image` URLs return HTTP 200
8. **TypeScript + ESLint CI gate**: `tsc --noEmit` and `eslint .` pass with zero errors
9. **`/404.html` status**: `curl -o /dev/null -s -w "%{http_code}" https://staging.wasilzafar.com/404.html` must return `404` — Next.js serves `not-found.tsx` for this path because no app route matches it; a `200` response indicates a catch-all route misconfiguration

**Stage 3 completion gate**:
10. **Quiz smoke test**: 5 representative assessment pages — widget mounts, answers submit, score updates correctly
11. **Doc generator smoke test**: `entrepreneurship-business-models` — trigger Word download, verify valid `.docx`
12. **Mermaid diagrams**: 5 articles — diagrams render, no console errors
13. **Search coverage**: Article count in rebuilt MDX-sourced index ≥ Stage 2 count

**Stage 4 pre-cutover gate** (before switching rewrites → redirects):
14. **GSC coverage stable**: ≥14 days of stable post Stage 2 coverage in Google Search Console
15. **Redirect smoke test**: `node scripts/check-redirects.js` — 100 `.html` URLs all return HTTP 301 to clean paths
16. **Canonical sync**: All article canonicals updated to clean paths, matching new `next-sitemap` entries

---

## Decisions & Scope

- **Deploy Next.js runtime from day one — no `output: 'export'`**: Route Handlers, `next/script`, middleware, and ISR are all required. GitHub Pages is abandoned at Stage 2 cutover. Vercel is the host from Stage 2 onward.
- **Rewrites before redirects**: Stage 2 uses `rewrites()` to preserve existing `.html` URLs with zero SEO impact. Stage 4 switches to `redirects()` only after full parity is verified. Framework and URL changes are never made in the same deployment.
- **Hybrid content ingestion**: Stage 2 serves HTML body via `dangerouslySetInnerHTML` from the existing `pages/` HTML files. Stage 3 converts to MDX archetype-by-archetype. No big-bang MDX conversion.
- **Feeds and search index stay as Node.js scripts**: `build-feeds.js` and `build-search-index.js` remain standalone scripts run in `validate.yml`. They are updated to read MDX in Stage 3 but not converted to Route Handlers. This resolves the original plan's contradiction between steps 14/15 and the "Content scripts remain Node.js" decision.
- **`validate.yml` is the single CI workflow**: All quality checks (encoding, links, sitemap, content quality, search, feeds, TypeScript, ESLint, Lighthouse) are added to the existing workflow. No new `ci.yml` is created.
- **Exam pages in scope for Stage 2**: Static exam content is served from Next.js in Stage 2. The exam tracker engine and interactive planning UI are ported to React in Stage 3.
- **MDX over CMS**: Content stays as files in the repo. No headless CMS.
- **Tailwind + Shadcn/ui replaces Bootstrap**: Gradual — new React shell components use Tailwind; `main.css` loaded globally until all content is on MDX.
- **Rollback window**: `gh-pages-backup` branch kept live for 90 days after final cutover.
- **Vercel as primary host**: AWS ECS/Amplify as fallback if Stage 4 compliance requirements demand full cloud control.

---

## Content-Class Migration Parallelism

```
Stage 1  ──── Archetype audit + baseline metrics
               └── content-audit.json
Stage 2  ──── Framework + shell components + existing URLs (rewrites)
               └── (Vercel cutover after pre-cutover gate)
Stage 3  ─┬── Pass A: Simple articles        ┐
           ├── Pass B: Code-heavy articles    │
           ├── Pass C: Mermaid articles       ├── Parallel per archetype class
           ├── Pass D: Doc-generator pages    │
           ├── Pass E: Quiz/assessment        ┘
           ├── Pass F: Hub/category pages
           └── Auth + bookmarking (NextAuth + DynamoDB)
Stage 4  ──── rewrites → 301 redirects + clean URLs
               └── Stripe + MCP + JSON-LD + optional next/og
```