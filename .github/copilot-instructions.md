# Wasil Zafar Portfolio Website - AI Coding Instructions

## Project Overview

**wasilzafar.com** is a GitHub Pages-hosted portfolio and blog website showcasing professional background, skills, and technical interests. It's a **static HTML/CSS/JavaScript** project with no build system or package manager—files are served directly from the repository.

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

### Code Snippet Independence (Critical for Technical Articles)

**All code snippets in blog articles MUST be copy-paste executable** in notebooks/terminals without dependencies on previous code blocks. This pattern is established in all data science blog posts (`python-data-science-*.html`).

**Mandatory Pattern for Every Code Block**:
```html
<pre><code class="language-python">import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Create sample data
data = np.array([1, 2, 3, 4, 5])

# Perform operation
result = data * 2
print("Result:", result)

# Show visualization (if applicable)
plt.show()
</code></pre>
```

**Requirements**:
1. **Always include imports** at the start of each code block
   - Python: `import numpy as np`, `import pandas as pd`, `import matplotlib.pyplot as plt`
   - JavaScript: Full context including variable declarations
   - Shell: Complete commands with necessary context

2. **Include data initialization** within each block
   - Don't reference variables from previous code blocks
   - Create arrays, DataFrames, objects fresh in each snippet
   - Use small, representative sample data

3. **Split combined examples** into separate code blocks
   - Don't combine 3+ methods in one `<pre><code>` block
   - Each code block should demonstrate one focused concept
   - Better to have 3 short independent blocks than 1 long dependent block

4. **Add output statements** to show results
   - Include `print()` statements for key results
   - Add `plt.show()` for matplotlib visualizations
   - Show expected output in comments when helpful

**Examples**:

✅ **GOOD - Independent snippet**:
```python
import numpy as np

# Create array
arr = np.array([1, 2, 3, 4, 5])

# Calculate mean
mean = arr.mean()
print("Mean:", mean)  # 3.0
```

❌ **BAD - Depends on previous code**:
```python
# Calculate standard deviation (assumes arr exists from previous block)
std = arr.std()
print("Std:", std)
```

✅ **GOOD - Split examples**:
```python
import pandas as pd

# Example 1: Read CSV
df = pd.read_csv('data.csv')
print(df.head())
```

```python
import pandas as pd

# Example 2: Read Excel  
df = pd.read_excel('data.xlsx')
print(df.head())
```

❌ **BAD - Combined examples**:
```python
# Read from different sources (assumes pandas imported elsewhere)
df1 = pd.read_csv('data.csv')
df2 = pd.read_excel('data.xlsx')
df3 = pd.read_json('data.json')
```

**When to Apply**:
- **Always** for Python/data science tutorials
- **Always** for code-heavy technical articles
- **Always** for any article with 5+ code blocks
- Optional for single illustrative examples in non-technical content

**Reference Examples**:
- See `/pages/2025/12/python-data-science-numpy-foundations.html` (~55 independent blocks)
- See `/pages/2025/12/python-data-science-pandas-analysis.html` (~25 independent blocks)
- See `/pages/2025/12/python-data-science-visualization.html` (~30 independent blocks)
- See `/pages/2025/12/python-data-science-machine-learning.html` (~12 independent blocks)

### JavaScript Organization

`/js/main.js` is 500+ lines of consolidated code. Key sections:

1. **Leaflet Map Initialization** (`initLeafletMaps()`)
   - Three map instances with markers, layers, and WMS services
   - Called on pages with `<div id="map">`, `<div id="map2">`, `<div id="map3">`

2. **Scroll Animations** (called on page load)
   - `.fade-in`, `.scroll-animate-left`, `.scroll-animate-right` classes
   - Intersection Observer for visible element triggers

3. **Analytics Event Tracking** (`initAnalyticsTracking()`)
   - Tracks "Read Article" CTA clicks on category pages
   - Pushes structured events to Google Tag Manager data layer
   - Semantic naming convention: `cta_[action]_[category]_[index]`
   - Event structure: `engagement_cta_click` with article_slug, category, tracking_id, timestamp, source_page

4. **Navigation & Smooth Scrolling**
   - Anchor link handling
   - Active nav link highlighting

5. **Consent Mode v2 & Tag Manager**
   - GTM initialization (GTM-PBS8M2JR)
   - Google Consent Mode v2 default state set before GTM loads
   - EEA region defaults to 'denied', non-EEA to 'granted'
   - Cookie consent banner integration via `/js/cookie-consent.js`

**Always Defer Initialization**: Scripts run on `DOMContentLoaded` or when elements are detected. Don't require manual initialization.

### Scroll-to-Top Button (Standard Feature)

**All long-form blog articles include a Scroll-to-Top button** for improved user experience. This is a fixed circular button that appears after scrolling down 300px.

**Implementation Pattern** (3 parts):

**1. CSS Styles** (add before `</style>` closing tag):
```css
/* Scroll-to-Top Button */
.scroll-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: var(--color-teal);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(59, 151, 151, 0.3);
    z-index: 999;
}

.scroll-to-top.show {
    opacity: 1;
    visibility: visible;
}

.scroll-to-top:hover {
    background: var(--color-crimson);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(191, 9, 47, 0.4);
}

.scroll-to-top:active {
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .scroll-to-top {
        bottom: 1rem;
        right: 1rem;
        width: 45px;
        height: 45px;
        font-size: 1rem;
    }
}
```

**2. HTML Button** (add after footer, before scripts):
```html
<!-- Scroll-to-Top Button -->
<button id="scrollToTop" class="scroll-to-top" title="Back to Top">
    <i class="fas fa-arrow-up"></i>
</button>
```

**3. JavaScript** (add before `</body>` closing tag):
```html
<!-- Scroll-to-Top Script -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Smooth scroll to top on click
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
</script>
```

**When to Include**:
- ✅ All blog articles with >1000 words
- ✅ Long-form technical tutorials (e.g., data science series)
- ✅ Glossary pages with extensive content
- ❌ Homepage (already at top, short content)
- ❌ Category landing pages (moderate length)
- ❌ Contact/location pages (single-screen content)

**Reference Examples**:
- See `/pages/2025/12/python-data-science-*.html` (all data science tutorials)
- See `/pages/2025/11/business-sales-marketing-systems-glossary.html` (glossary with category indicator)

**Advanced Variant** (for glossaries with multiple sections):
- Add category indicator showing current section
- Button scrolls to Table of Contents instead of top
- See business-sales-marketing-systems-glossary.html for implementation

### PrismJS Code Snippets with Copy and Theme Switcher (Standard Feature)

**All blog articles with code snippets MUST include PrismJS with toolbar, copy button, and theme switcher** for optimal developer experience. The theme switcher allows readers to choose their preferred syntax highlighting theme, and the selection persists across all pages via localStorage.

**Implementation Pattern** (3 parts required):

**1. HEAD Section - Multiple Theme CSS Files**:
```html
<!-- Prism.js Syntax Highlighting -->
<!-- Multiple themes for dynamic switching -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" id="prism-theme" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" id="prism-default" disabled />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-dark.min.css" id="prism-dark" disabled />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-twilight.min.css" id="prism-twilight" disabled />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css" id="prism-okaidia" disabled />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-solarizedlight.min.css" id="prism-solarizedlight" disabled />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.css" />
```

**2. STYLE Section - Toolbar and Dropdown Styling**:
```css
/* Toolbar styling */
div.code-toolbar > .toolbar {
    opacity: 1;
    display: flex;
    gap: 0.5rem;
}

div.code-toolbar > .toolbar > .toolbar-item > button {
    background: var(--color-teal);
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

div.code-toolbar > .toolbar > .toolbar-item > button:hover {
    background: var(--color-blue);
    transform: translateY(-1px);
}

div.code-toolbar > .toolbar > .toolbar-item > button:focus {
    outline: 2px solid var(--color-teal);
    outline-offset: 2px;
}

/* Theme switcher dropdown */
div.code-toolbar > .toolbar > .toolbar-item > select {
    background: var(--color-navy);
    color: white;
    border: 1px solid var(--color-teal);
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
}

div.code-toolbar > .toolbar > .toolbar-item > select:hover {
    background: var(--color-blue);
    border-color: var(--color-crimson);
}

div.code-toolbar > .toolbar > .toolbar-item > select:focus {
    outline: 2px solid var(--color-teal);
    outline-offset: 2px;
}

/* Style select options */
div.code-toolbar > .toolbar > .toolbar-item > select option {
    background: var(--color-navy);
    color: white;
}
```

**3. Before `</body>` - Prism Scripts and Theme Switcher JavaScript**:
```html
<!-- Prism.js for Syntax Highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
<!-- Add other language components as needed -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>

<!-- Prism Theme Switcher -->
<script>
    // Available themes with display names
    const themes = {
        'prism-theme': 'Tomorrow Night',
        'prism-default': 'Default',
        'prism-dark': 'Dark',
        'prism-twilight': 'Twilight',
        'prism-okaidia': 'Okaidia',
        'prism-solarizedlight': 'Solarized Light'
    };

    // Load saved theme from localStorage or use default
    const savedTheme = localStorage.getItem('prism-theme') || 'prism-theme';

    // Function to switch theme
    function switchTheme(themeId) {
        // Disable all themes
        Object.keys(themes).forEach(id => {
            const link = document.getElementById(id);
            if (link) {
                link.disabled = true;
            }
        });
        
        // Enable selected theme
        const selectedLink = document.getElementById(themeId);
        if (selectedLink) {
            selectedLink.disabled = false;
            localStorage.setItem('prism-theme', themeId);
        }

        // Update all dropdowns on the page to match selected theme
        document.querySelectorAll('div.code-toolbar select').forEach(dropdown => {
            dropdown.value = themeId;
        });

        // Re-apply syntax highlighting with new theme
        setTimeout(() => {
            Prism.highlightAll();
        }, 10);
    }

    // Apply saved theme on page load
    document.addEventListener('DOMContentLoaded', function() {
        switchTheme(savedTheme);
    });

    // Add theme switcher to Prism toolbar
    Prism.plugins.toolbar.registerButton('theme-switcher', function(env) {
        const select = document.createElement('select');
        select.setAttribute('aria-label', 'Select code theme');
        select.className = 'prism-theme-selector';
        
        // Populate dropdown with themes
        Object.keys(themes).forEach(themeId => {
            const option = document.createElement('option');
            option.value = themeId;
            option.textContent = themes[themeId];
            if (themeId === savedTheme) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        // Handle theme change
        select.addEventListener('change', function(e) {
            switchTheme(e.target.value);
        });
        
        return select;
    });
</script>
```

**Available Themes**:
1. **Tomorrow Night** (default) - Dark theme with muted colors
2. **Default** - Light theme with standard syntax colors
3. **Dark** - Pure dark theme with high contrast
4. **Twilight** - Dark theme with purple/blue tones
5. **Okaidia** - Dark theme inspired by Monokai
6. **Solarized Light** - Light theme with the Solarized color palette

**Code Block HTML Pattern**:
```html
<pre><code class="language-python">import numpy as np
import pandas as pd

# Your code here
data = np.array([1, 2, 3, 4, 5])
print(data.mean())
</code></pre>
```

**Language Support** (add language components as needed):
- `prism-python.min.js` - Python syntax
- `prism-bash.min.js` - Bash/Shell scripts
- `prism-javascript.min.js` - JavaScript
- `prism-json.min.js` - JSON
- `prism-java.min.js` - Java
- `prism-sql.min.js` - SQL
- See full list: https://prismjs.com/#supported-languages

**When to Include**:
- ✅ All blog articles with code snippets (5+ code blocks)
- ✅ Technical tutorials and data science articles
- ✅ Any article demonstrating programming concepts
- ❌ Articles with only inline code (use `<code>` tags with existing CSS)

**Key Features**:
- **Copy Button**: One-click copy to clipboard for all code blocks
- **Theme Persistence**: User's theme selection saved in localStorage across all pages
- **Toolbar Positioning**: Dropdown appears alongside copy button in top-right of code blocks
- **Accessibility**: Proper ARIA labels and keyboard navigation support

**Reference Examples**:
- See `/pages/2025/12/python-data-science-machine-learning.html`
- See `/pages/2025/12/python-data-science-numpy-foundations.html`
- See `/pages/2025/12/python-data-science-pandas-analysis.html`
- See `/pages/2025/12/python-data-science-visualization.html`
- See `/pages/2025/12/python-setup-notebooks-guide.html`
- See `/pages/2025/12/data-and-science-evolution.html`

**Implementation Notes**:
- Theme CSS files MUST have unique IDs matching the themes object keys
- Default theme (`prism-theme`) is enabled by default, others have `disabled` attribute
- Theme switcher uses `Prism.plugins.toolbar.registerButton()` API
- localStorage key is `'prism-theme'` for consistency across all pages
- Dropdown styling matches site color scheme (navy, teal, blue, crimson)
- **CRITICAL**: Do NOT set `background` property on `pre[class*="language-"]` - this overrides theme backgrounds. Only set `border-radius`, `margin`, and `box-shadow`
- Theme switcher syncs all dropdowns on page and re-applies highlighting with `Prism.highlightAll()`

### Analytics Tracking Convention

**Semantic Naming for Extensibility**:
```
Format: cta_[action]_[category]_[index]
Example: cta_read_article_psychology_001
```

**Data Attributes on Category Page Article Cards**:
```html
<a href="article-link.html" 
   class="btn btn-primary cta-read-article"
   data-article-slug="psychology-experiments-cognitive-biases"
   data-category="psychology"
   data-tracking-id="cta_read_article_psychology_001">
   Read Article
</a>
```

**GTM Event Structure Pushed to Data Layer**:
```javascript
{
  event: 'engagement_cta_click',
  engagement_type: 'article_cta',
  action: 'read_article',
  category: 'psychology',
  article_slug: 'psychology-experiments-cognitive-biases',
  element_id: 'cta_read_article_psychology_001',
  timestamp: '2025-11-17T14:30:00Z',
  source_page: '/pages/categories/psychology.html'
}
```

**Future Extensibility**:
- New CTA types: `cta_subscribe_[category]_001`, `cta_share_[category]_001`, `cta_download_[category]_001`
- All follow same pattern for consistent GTM tracking
- Add new action types by extending `initAnalyticsTracking()` in `main.js`

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
- **Verify code snippet independence**: Every code block should run standalone in a notebook/terminal

**SEO Checklist** (critical for blog):
- Meta description: 155-160 characters, includes keyword
- Keywords: 5-8 relevant terms
- og:title, og:description, article:published_time set
- H1 (article title) is unique, includes keyword naturally
- Internal links to related content

**Code Quality Checklist** (for technical articles):
- ✅ Every code block includes necessary imports
- ✅ Data/variables created within each block (no external dependencies)
- ✅ Combined examples split into separate focused blocks
- ✅ Output statements included (print, plt.show(), etc.)
- ✅ Code blocks are in proper order (logical flow maintained)
- ✅ Syntax highlighting set correctly (language-python, language-javascript, etc.)

## Common Tasks

### Task: Add new blog article
→ Copy `.template-blog-post.html`, fill placeholders, update category page with article card

### Task: Add Scroll-to-Top button to existing article
→ Add CSS (before `</style>`), HTML button (after footer), and JavaScript (before `</body>`). See "Scroll-to-Top Button" section for complete code snippets.

### Task: Add PrismJS with theme switcher to article with code snippets
→ Add (1) Multiple theme CSS files in HEAD, (2) Toolbar/dropdown styling in STYLE section, (3) Prism scripts and theme switcher JavaScript before `</body>`. See "PrismJS Code Snippets with Copy and Theme Switcher" section for complete implementation.

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

**Last Updated**: December 30, 2025  
**Maintained By**: Wasil Zafar
