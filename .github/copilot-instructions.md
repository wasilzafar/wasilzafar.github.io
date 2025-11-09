# Wasil Zafar Portfolio Website - AI Coding Instructions

## Project Overview

**wasilzafar.github.io** is a GitHub Pages-hosted portfolio and blog website showcasing professional background, skills, and technical interests. It's a **static HTML/CSS/JavaScript** project with no build system or package manager—files are served directly from the repository.

## Architecture

### Core Structure

```
/
├── index.html                 # Homepage (hero, about, skills, certifications)
├── css/main.css              # Consolidated styles (1551 lines, single file)
├── js/main.js                # Consolidated scripts (446 lines, single file)
├── pages/
│   ├── categories/           # Blog category pages (psychology, philosophy, etc.)
│   ├── 2024/03/             # Archived articles by year/month
│   ├── 2025/10/             # Current articles organized chronologically
│   ├── contact.html         # Contact form page
│   └── location.html        # Location/map page
├── images/                   # Static assets
├── BLOG-INFRASTRUCTURE.md   # Blog standards & conventions
└── .template-blog-post.html  # Reusable blog post template
```

### Key Design Decisions

1. **No Build System**: Static HTML serves directly—no compilation, bundling, or transpilation needed
2. **Consolidated CSS/JS**: Single `main.css` and `main.js` files manage all styling and functionality across the entire site
3. **CDN Dependencies**: Bootstrap 5, Font Awesome, Google Fonts, Leaflet maps loaded via CDN
4. **Chronological Blog Organization**: Articles in `/pages/YYYY/MM/` folders for easy archiving and SEO
5. **Reusable Components**: Card-based layouts (experiment-card, highlight-box, toc-box, bias-tag) used across blog articles

## Critical Patterns & Conventions

### Blog Post Structure (Mandatory)

All blog articles follow strict conventions documented in `BLOG-INFRASTRUCTURE.md`. The `.template-blog-post.html` exemplifies this:

- **File Path**: `/pages/YYYY/MM/article-slug.html` (e.g., `/pages/2025/11/psychology-experiments-cognitive-biases.html`)
- **Metadata**: Always include `<meta>` tags for description, keywords, Open Graph (og:*), and article-specific metadata (publish_time, author, section)
- **Content Structure**:
  1. Navigation bar with links to Home, About, Interests, and current category
  2. Hero section with back link, title (display-4), date, author, reading time, subtitle
  3. Table of Contents (toc-box) with anchor links
  4. H2 for main sections, H3 for subsections
  5. Key insights in `<div class="highlight-box">` with icon
  6. Case studies/examples in `<div class="experiment-card">` with meta, content, tags
  7. Related Posts section with 2-3 internal links
  8. Consistent footer with social links

- **Relative Paths** (critical):
  - From `/pages/YYYY/MM/article.html` → root: `../../../`
  - Example: `<link rel="stylesheet" href="../../../css/main.css">`

### CSS Architecture

All styles in `/css/main.css` using **CSS custom properties** (variables):

```css
:root {
    --color-crimson: #BF092F;      /* Primary accent, highlights */
    --color-navy: #132440;          /* Dark text, headings */
    --color-blue: #16476A;          /* Secondary accent */
    --color-teal: #3B9797;          /* Links, highlights, borders */
    --color-light: #f8f9fa;         /* Light backgrounds */
    --color-white: #ffffff;         /* White */
}
```

**Reusable Component Classes** (use these, don't create alternatives):
- `.highlight-box`: Key insights with teal left border, light background
- `.experiment-card`: Card for studies/examples with hover animation
- `.bias-tag`: Inline tag with teal background, white text
- `.toc-box`: Table of contents container with border and link styles
- `.blog-content`: Main article text with justified alignment, 1.05rem font, 1.8 line-height
- `.blog-hero`: Gradient background (navy to blue) with white text

**No Inline Styles**: All styling goes in `main.css`. Avoid `style=""` attributes except for dynamic positioning (background-image, etc.).

### JavaScript Organization

`/js/main.js` is 446 lines of consolidated code. Key sections:

1. **Leaflet Map Initialization** (`initLeafletMaps()`)
   - Three map instances with markers, layers, and WMS services
   - Called on pages with `<div id="map">`, `<div id="map2">`, `<div id="map3">`

2. **Scroll Animations** (called on page load)
   - `.fade-in`, `.scroll-animate-left`, `.scroll-animate-right` classes
   - Intersection Observer for visible element triggers

3. **Navigation & Smooth Scrolling**
   - Anchor link handling
   - Active nav link highlighting

4. **Analytics & Tag Manager**
   - GTM initialization (GTM-PBS8M2JR)
   - Google Ads hooks (currently commented)

**Always Defer Initialization**: Scripts run on `DOMContentLoaded` or when elements are detected. Don't require manual initialization.

### Navigation & Links

**Consistent Navigation Bar** appears on all pages:
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <!-- Links: Home, About, Interests, Category (varies by page) -->
</nav>
```

**Link Conventions**:
- Root → `/` (e.g., `<a href="/">Home</a>`)
- From homepage → `pages/categories/psychology.html`
- From category → `../../2025/11/article.html`
- From article → `../../../css/main.css`

## Development Workflow

### Adding a New Blog Article

1. **Create file** at `/pages/YYYY/MM/article-slug.html`
2. **Copy template** from `.template-blog-post.html`
3. **Replace placeholders**:
   - `[ADD ARTICLE TITLE]` → actual title
   - `[YYYY-MM-DD format]` → publication date
   - `[X] min read` → reading time (divide word count by 200)
   - `[Category]` → back link category (psychology, philosophy, etc.)
4. **Fill content** using required structure (toc-box, highlight-box, experiment-card, related posts)
5. **Update category page** (`/pages/categories/[category].html`):
   - Add article card in "Latest Articles" section
   - Include title link, date, reading time, description, 2-4 tags
   - Use `btn btn-outline-primary` for "Read Article" button

### Editing Existing Content

**Homepage** (`index.html`):
- Hero section: Update `<h1>`, `<p>`, buttons
- About section: Update credentials, description
- Scroll-animate classes auto-trigger on load

**Category Pages** (e.g., `pages/categories/psychology.html`):
- Copy from category pages when adding new category
- Maintain icon consistency (e.g., `<i class="fas fa-brain"></i>` for psychology)
- Update description in hero section

**Footer** (consistent across all pages):
- Social links, publication date—update the `<time>` element
- Links never change; only content inside varies

### CSS/JS Modifications

**Adding Styles**:
1. Add to appropriate section in `main.css` (organized by feature)
2. Use CSS variables for colors
3. Include media queries for responsive design
4. Add comments marking new additions

**Adding Scripts**:
1. Add function to `main.js`
2. Call during `DOMContentLoaded` or when element is detected
3. Use `document.getElementById()` for existence checks (don't throw errors)
4. Comment complex logic

## Testing & Quality Checks

**Before publishing**:
- Verify all relative paths correct (especially for blog articles)
- Check links work (internal `/` roots, external `target="_blank"`)
- Confirm images exist and load
- Test on mobile (Bootstrap's responsive classes should handle it)
- Validate HTML (no missing closing tags, proper nesting)
- Check reading time accuracy (1,200 words ≈ 6 min; 2,000 words ≈ 10 min)

**SEO Checklist** (critical for blog):
- Meta description: 155-160 characters, includes keyword
- Keywords: 5-8 relevant terms
- og:title, og:description, article:published_time set
- H1 (article title) is unique, includes keyword naturally
- Internal links to related content

## Common Tasks

### Task: Add new blog article
→ Copy `.template-blog-post.html`, fill placeholders, update category page with article card

### Task: Create new category page
→ Copy existing category (e.g., psychology.html), update icon, description, back link path

### Task: Fix broken internal link
→ Verify relative path from current file. From `/pages/2025/11/article.html`, use `../../../pages/categories/psychology.html` (three `../` to reach root)

### Task: Update color scheme
→ Modify CSS variables in `:root` block in `main.css` (line ~29). All color-dependent styles will update automatically.

### Task: Update social links
→ Footer appears on every page. Update `<a href="">` in footer once, applies everywhere.

## Important Files to Know

| File | Purpose | Size | Edit Frequency |
|------|---------|------|---|
| `index.html` | Homepage | 539 lines | Rarely (annual updates) |
| `css/main.css` | All styling | 1551 lines | Moderate (new blog article styles) |
| `js/main.js` | All scripts | 446 lines | Low (maps, analytics mostly stable) |
| `BLOG-INFRASTRUCTURE.md` | Blog standards | 298 lines | Low (reference, updated when standards change) |
| `.template-blog-post.html` | Blog template | Full example | Never (keep as reference) |
| `pages/categories/*.html` | Category landing pages | ~280 lines each | High (new articles added frequently) |
| `pages/YYYY/MM/*.html` | Individual articles | ~400 lines each | New articles monthly |

## Critical Gotchas

1. **Path Confusion**: Blog articles are 3 directories deep (`pages/YYYY/MM/`). Always triple-check relative paths (`../../../` to reach root).
2. **No Build System**: Changes to CSS/JS take effect immediately—no compilation step. Files must be valid HTML/CSS/JavaScript as written.
3. **Consolidation Philosophy**: Don't create new CSS or JS files. Add to `main.css` and `main.js` instead (site-wide performance benefit).
4. **Tag Manager**: GTM ID is **GTM-PBS8M2JR** (hardcoded in pages). Analytics track all page views automatically.
5. **Mobile Responsiveness**: Bootstrap's grid system (col-lg-6, col-md-12, etc.) handles breakpoints. Test on mobile before publishing.

## Resources

- **Blog Standards**: Read `BLOG-INFRASTRUCTURE.md` before creating articles
- **Template**: Copy `.template-blog-post.html` for article structure
- **Bootstrap 5**: Classes like `container`, `row`, `card`, `btn`, `shadow-sm` used throughout
- **Font Awesome 6.4**: Icons via `<i class="fas fa-icon-name"></i>`
- **Color Palette**: Use CSS variables (--color-crimson, --color-navy, etc.)

---

**Last Updated**: November 9, 2025  
**Maintained By**: Wasil Zafar
