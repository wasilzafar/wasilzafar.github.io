# Wasil Zafar Portfolio Website - AI Coding Instructions

## Project Overview

**wasilzafar.com** is a GitHub Pages-hosted portfolio and blog website showcasing professional background, skills, and technical interests. It's a **static HTML/CSS/JavaScript** project with no build system or package manager—files are served directly from the repository.

## Architecture

### Core Structure

```
/
├── index.html                 # Homepage (hero, about, skills, certifications)
├── css/main.css              # Consolidated styles (single file)
├── js/main.js                # Consolidated scripts (single file)
├── pages/
│   ├── categories/           # Blog category pages (psychology, philosophy, etc.)
│   ├── series/               # Multi-part article series (5+ related articles)
│   │   ├── cloud-computing/          # 11 articles
│   │   ├── data-structures/          # 12 articles
│   │   ├── economics/                # 9 articles
│   │   ├── embedded-systems/         # 12 articles
│   │   ├── ethics-moral-philosophy/  # 6 articles
│   │   ├── logic-critical-thinking/  # 6 articles
│   │   ├── nlp/                      # 16 articles
│   │   ├── python-data-science/      # 5 articles
│   │   ├── artificial-intelligence/  # 6 articles
│   │   └── system-design/            # 15 articles
│   ├── 2025/                 # Standalone articles by year/month
│   │   ├── 10/
│   │   ├── 11/
│   │   └── 12/
│   ├── 2026/01/              # Standalone articles (non-series)
│   └── contact.html          # Contact form page
├── images/                   # Static assets
├── BLOG-INFRASTRUCTURE.md   # Blog standards & conventions
└── .template-blog-post.html  # Reusable blog post template
```

### Key Design Decisions

1. **No Build System**: Static HTML serves directly—no compilation, bundling, or transpilation needed
2. **Consolidated CSS/JS**: Single `main.css` and `main.js` files manage all styling and functionality across the entire site
3. **CDN Dependencies**: Bootstrap 5, Font Awesome, Google Fonts, Leaflet maps loaded via CDN
4. **Hybrid Blog Organization**: 
   - **Series articles** (5+ related) in `/pages/series/[series-name]/` for topical clustering
   - **Standalone articles** in `/pages/YYYY/MM/` for chronological archiving
5. **Reusable Components**: Card-based layouts (experiment-card, highlight-box, toc-box, bias-tag) used across blog articles

## Critical Patterns & Conventions

### Series Organization

**Multi-part series** (5+ related articles) are organized in `/pages/series/[series-name]/`:

| Series | Folder | Articles | Category Page |
|--------|--------|----------|---------------|
| Cloud Computing | `/pages/series/cloud-computing/` | 11 | technology.html |
| Data Structures & Algorithms | `/pages/series/data-structures/` | 12 | technology.html |
| System Design | `/pages/series/system-design/` | 15 | technology.html |
| NLP | `/pages/series/nlp/` | 16 | technology.html |
| Embedded Systems | `/pages/series/embedded-systems/` | 12 | technology.html |
| Artificial Intelligence | `/pages/series/artificial-intelligence/` | 6 | technology.html |
| Python Data Science | `/pages/series/python-data-science/` | 5 | technology.html |
| Economics | `/pages/series/economics/` | 9 | business.html |
| Ethics & Moral Philosophy | `/pages/series/ethics-moral-philosophy/` | 6 | philosophy.html |
| Logic & Critical Thinking | `/pages/series/logic-critical-thinking/` | 6 | philosophy.html |

**Standalone articles** (one-off guides, glossaries) remain in `/pages/YYYY/MM/`:
- `automotive-embedded-systems-guide.html`
- `money-markets-currencies-stocks-guide.html`
- `philosophy-famous-thought-experiments.html`

**When to create a new series folder**:
- 5+ related articles planned on the same topic
- Articles share common navigation/cross-references
- Topic warrants its own learning path

### Blog Post Structure (Mandatory)

All blog articles follow strict conventions documented in `BLOG-INFRASTRUCTURE.md`. The `.template-blog-post.html` exemplifies this:

- **File Path**: 
  - Series: `/pages/series/[series-name]/article-slug.html` (e.g., `/pages/series/cloud-computing/cloud-storage-services-guide.html`)
  - Standalone: `/pages/YYYY/MM/article-slug.html` (e.g., `/pages/2025/11/psychology-experiments-cognitive-biases.html`)
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

- **Standardized Layout (MANDATORY for all blog posts)**:
  ```html
  <!-- Main Content -->
  <section class="py-5">
      <div class="container">
          <div class="row">
              <div class="col-lg-8 mx-auto">
                  <div class="blog-content">
                      <!-- Article content here -->
                  </div>
              </div>
          </div>
      </div>
  </section>
  ```
  - **Always use `col-lg-8 mx-auto`** for centered content with consistent max width
  - Do NOT use `col-lg-10`, `col-lg-12`, or direct `<div class="container"><div class="blog-content">` without row/col wrapper
  - This ensures uniform, centered content across all 24+ blog posts for optimal readability

- **Relative Paths** (critical):
  - From `/pages/series/[name]/article.html` → root: `../../../` (3 levels)
  - From `/pages/YYYY/MM/article.html` → root: `../../../` (3 levels)
  - Example: `<link rel="stylesheet" href="../../../css/main.css">`
  - Series to category: `../../categories/technology.html`
  - Series to sibling series: `../python-data-science/article.html`
  - Same series articles: `cloud-storage-services-guide.html` (relative, same folder)

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
- `.sidenav-toc`: Side navigation overlay for Table of Contents (replaces old .toc-box)
- `.toc-toggle-btn`: Floating button to open/close TOC navigation
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

### Print Button (Standard Feature)

**All long-form blog articles include a Print button** in the blog-meta section for easy printing with optimized formatting and color preservation. This button triggers the browser's native print dialog and applies comprehensive print CSS to hide non-essential elements and preserve design colors.

**Implementation Pattern** (3 parts):

**1. HTML Button** (add to blog-meta section after reading-time):
```html
<div class="blog-meta">
    <span><i class="fas fa-calendar me-2"></i>Date</span>
    <span><i class="fas fa-user me-2"></i>Author</span>
    <span class="reading-time"><i class="fas fa-clock me-1"></i>X min read</span>
    <button onclick="window.print()" class="print-btn" title="Print this article">
        <i class="fas fa-print"></i> Print
    </button>
</div>
```

**2. Blog-Meta Flexbox and Print Button CSS** (update blog-meta styles):
```css
.blog-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.95rem;
    color: var(--color-teal);
    margin-bottom: 1rem;
}

.blog-meta span {
    margin-right: 0;  /* Remove since gap handles spacing */
}

.print-btn {
    background: var(--color-teal);
    color: white;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.print-btn:hover {
    background: var(--color-crimson);
    transform: translateY(-1px);
}

.print-btn:active {
    transform: translateY(0);
}
```

**3. Comprehensive Print CSS** (add before `</style>` closing tag - 120+ lines):
```css
/* Print Styles - Comprehensive print optimization with color preservation */
@media print {
    /* Force color printing - CRITICAL for preserving design elements */
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    /* Hide non-essential elements */
    nav,
    .navbar,
    footer,
    .back-link,
    .related-posts,
    .scroll-to-top,
    .print-btn,
    .toc-toggle-btn,
    .sidenav-toc,
    .sidenav-overlay {
        display: none !important;
    }

    /* Optimize page layout */
    body {
        font-size: 12pt;
        line-height: 1.6;
        color: #000;
    }

    .container {
        max-width: 100%;
        padding: 0;
    }

    /* Preserve heading colors and styles */
    h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        page-break-inside: avoid;
    }

    h2 {
        color: var(--color-navy) !important;
        border-bottom: 2px solid var(--color-teal) !important;
    }

    h3 {
        color: var(--color-blue) !important;
    }

    h4 {
        color: var(--color-crimson) !important;
    }

    /* Preserve link colors */
    a {
        color: var(--color-blue) !important;
        text-decoration: underline;
    }

    /* Preserve TOC box styling */
    .toc-box {
        border: 2px solid var(--color-teal) !important;
        background: rgba(59, 151, 151, 0.1) !important;
        page-break-inside: avoid;
    }

    .toc-box h4 {
        color: var(--color-navy) !important;
    }

    .toc-box a {
        color: var(--color-blue) !important;
    }

    /* Preserve highlight boxes */
    .highlight-box {
        background: rgba(59, 151, 151, 0.1) !important;
        border-left: 4px solid var(--color-teal) !important;
        page-break-inside: avoid;
    }

    /* Preserve experiment cards */
    .experiment-card {
        border: 1px solid #ddd !important;
        background: #f8f9fa !important;
        page-break-inside: avoid;
    }

    .experiment-card h4 {
        color: var(--color-crimson) !important;
    }

    /* Preserve tags and badges */
    .bias-tag,
    .badge {
        background: var(--color-teal) !important;
        color: white !important;
        border: 1px solid var(--color-teal) !important;
    }

    .reading-time {
        background: var(--color-crimson) !important;
        color: white !important;
    }

    /* Code blocks */
    pre {
        page-break-inside: avoid;
        border: 1px solid #ddd !important;
        background: #f5f5f5 !important;
    }

    code {
        background: #f5f5f5 !important;
    }

    /* Tables */
    table {
        page-break-inside: avoid;
    }

    /* Images */
    img {
        max-width: 100% !important;
        page-break-inside: avoid;
    }

    /* Prevent orphans and widows */
    p, li {
        orphans: 3;
        widows: 3;
    }
}
```

**When to Include**:
- ✅ All blog articles with >800 words
- ✅ Long-form technical tutorials
- ✅ Glossary pages
- ✅ Research articles
- ❌ Homepage
- ❌ Category landing pages
- ❌ Contact/location pages

**Key Features**:
- **Color Preservation**: Forces browser to print colors using `print-color-adjust: exact !important`
- **Element Hiding**: Removes nav, footer, related posts, scroll-to-top, and print button itself
- **Typography Optimization**: 12pt font, 1.6 line-height for readability
- **Page Break Control**: Prevents breaks inside code blocks, cards, headings, and images
- **Design Consistency**: Preserves all header colors (navy h2, blue h3, crimson h4), borders, and backgrounds

**Critical Implementation Notes**:
- **MUST use `!important` flag** on all `display: none` rules to override Bootstrap
- **MUST include both `nav` and `.navbar`** selectors for complete hiding
- **MUST set `-webkit-print-color-adjust: exact !important`** on `*` selector for Safari/Chrome
- **Update blog-meta to flexbox** with `gap: 1rem` for proper spacing
- **Remove `margin-right: 1.5rem`** from `.blog-meta span` (gap handles spacing)

**Troubleshooting**:

*Issue: Colors not printing*
- Solution: Ensure `print-color-adjust: exact !important` is on `*` selector
- Browser setting: Users must enable "Background graphics" in print dialog

*Issue: Navigation visible in print*
- Solution: Add `.navbar` selector alongside `nav` with `!important` flag
- Verify: `nav, .navbar { display: none !important; }`

*Issue: Page breaks in middle of code blocks*
- Solution: Add `page-break-inside: avoid` to `pre`, `.experiment-card`, `.highlight-box`

*Issue: Print button appears in print preview*
- Solution: Ensure `.print-btn { display: none !important; }` in @media print

**Reference Examples**:
- See `/pages/2026/01/python-artificial-neural-networks-guide.html`
- See `/pages/2025/12/python-data-science-machine-learning.html`
- See `/pages/2025/11/business-sales-marketing-systems-glossary.html`

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

### Side Navigation Table of Contents (Standard Feature)

**All long-form blog articles include a side navigation TOC** for improved navigation and readability. This is a sliding overlay panel from the left side with a floating toggle button, active section highlighting, and smooth scrolling.

**Implementation Pattern** (3 parts required):

**1. STYLE Section - CSS for Toggle Button, Side Panel, and Overlay**:
```css
/* Side Navigation Table of Contents (Modern Overlay Style) */
/* Toggle Button */
.toc-toggle-btn {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 60px;
    height: 60px;
    background: var(--color-teal);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 151, 151, 0.4);
    transition: all 0.3s ease;
    z-index: 1049;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toc-toggle-btn:hover {
    background: var(--color-crimson);
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(191, 9, 47, 0.5);
}

.toc-toggle-btn:active {
    transform: scale(0.95);
}

/* Side Navigation Overlay */
.sidenav-toc {
    height: calc(100% - 64px);
    width: 0;
    position: fixed;
    z-index: 1050;
    top: 64px;
    left: 0;
    background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-blue) 100%);
    overflow-x: hidden;
    overflow-y: auto;
    transition: width 0.4s ease;
    padding-top: 30px;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);
}

.sidenav-toc.open {
    width: 350px;
}

/* Header row with close button and title */
.sidenav-toc .toc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 30px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--color-teal);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.sidenav-toc.open .toc-header {
    opacity: 1;
    visibility: visible;
}

.sidenav-toc .closebtn {
    font-size: 32px;
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    line-height: 1;
    padding: 0;
    margin: 0;
}

.sidenav-toc .closebtn:hover {
    color: var(--color-crimson);
    transform: rotate(90deg);
}

.sidenav-toc h3 {
    color: white;
    margin: 0;
    padding: 0;
    font-weight: 700;
    font-size: 1.3rem;
    flex-grow: 1;
}

.sidenav-toc ol {
    list-style: decimal;
    padding: 0;
    padding-left: 30px;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
}

.sidenav-toc ol li {
    margin: 0;
    margin-bottom: 8px;
}

.sidenav-toc a {
    padding: 12px 30px;
    text-decoration: none;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.85);
    display: block;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
    position: relative;
}

.sidenav-toc a:hover {
    color: white;
    background: rgba(59, 151, 151, 0.2);
    border-left-color: var(--color-teal);
    padding-left: 35px;
}

.sidenav-toc a.active {
    color: white;
    background: rgba(191, 9, 47, 0.3);
    border-left-color: var(--color-crimson);
    font-weight: 600;
}

.sidenav-toc a.active::before {
    content: '▶';
    position: absolute;
    left: 15px;
    font-size: 0.7rem;
    color: var(--color-crimson);
}

/* Overlay backdrop */
.sidenav-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1049;
    transition: opacity 0.4s ease;
}

.sidenav-overlay.show {
    display: block;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .sidenav-toc.open {
        width: 280px;
    }
    
    .toc-toggle-btn {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        left: 1rem;
        bottom: 1rem;
    }
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}
```

**2. HTML - Toggle Button, Side Panel, and Overlay (before main content section)**:
```html
<!-- Table of Contents Toggle Button -->
<button class="toc-toggle-btn" onclick="openNav()" title="Table of Contents" aria-label="Open Table of Contents">
    <i class="fas fa-list"></i>
</button>

<!-- Side Navigation Overlay -->
<div id="tocSidenav" class="sidenav-toc">
    <div class="toc-header">
        <h3><i class="fas fa-list me-2"></i>Table of Contents</h3>
        <button class="closebtn" onclick="closeNav()" aria-label="Close Table of Contents">&times;</button>
    </div>
    <ol>
        <li>
            <a href="#introduction" onclick="closeNav()">Getting Started</a>
            <ul>
                <li><a href="#introduction" onclick="closeNav()">Introduction</a></li>
                <li><a href="#setup" onclick="closeNav()">Setup & Installation</a></li>
                <li><a href="#fundamentals" onclick="closeNav()">Core Fundamentals</a></li>
            </ul>
        </li>
        <li>
            <a href="#core-concepts" onclick="closeNav()">Core Concepts</a>
            <ul>
                <li><a href="#concept-1" onclick="closeNav()">Concept 1</a></li>
                <li><a href="#concept-2" onclick="closeNav()">Concept 2</a></li>
                <li><a href="#concept-3" onclick="closeNav()">Concept 3</a></li>
            </ul>
        </li>
        <li>
            <a href="#advanced-topics" onclick="closeNav()">Advanced Topics</a>
            <ul>
                <li><a href="#topic-1" onclick="closeNav()">Advanced Topic 1</a></li>
                <li><a href="#topic-2" onclick="closeNav()">Advanced Topic 2</a></li>
            </ul>
        </li>
        <li><a href="#conclusion" onclick="closeNav()">Conclusion & Next Steps</a></li>
    </ol>
</div>

<!-- Overlay Backdrop -->
<div id="tocOverlay" class="sidenav-overlay" onclick="closeNav()"></div>
```

**3. Before `</body>` - JavaScript for Navigation Control and Active Section Highlighting**:
```html
<!-- Side Navigation TOC Script -->
<script>
    // Open side navigation
    function openNav() {
        document.getElementById('tocSidenav').classList.add('open');
        document.getElementById('tocOverlay').classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    // Close side navigation
    function closeNav() {
        document.getElementById('tocSidenav').classList.remove('open');
        document.getElementById('tocOverlay').classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNav();
        }
    });

    // Highlight active section in TOC based on scroll position
    document.addEventListener('DOMContentLoaded', function() {
        const sections = document.querySelectorAll('[id]');
        const tocLinks = document.querySelectorAll('.sidenav-toc a');
        
        function highlightActiveSection() {
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 200) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSection) {
                    link.classList.add('active');
                }
            });
        }
        
        // Highlight on scroll
        window.addEventListener('scroll', highlightActiveSection);
        
        // Initial highlight
        highlightActiveSection();
        
        // Smooth scroll for TOC links
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close nav after clicking
                setTimeout(closeNav, 300);
            });
        });
    });
</script>
```

**When to Include**:
- ✅ All blog articles with >1000 words
- ✅ Long-form technical tutorials (e.g., data science series)
- ✅ Articles with 5+ main sections
- ❌ Short articles (<800 words)
- ❌ Category landing pages
- ❌ Contact/location pages

**Key Features**:
- **Bottom Left Position**: Fixed at bottom left corner (2rem from bottom and left edges) - opposite the scroll-to-top button
- **Slide from Left**: Panel slides in from left side below navbar (top: 64px)
- **Active Highlighting**: Current section highlighted with crimson background and arrow indicator
- **Smooth Scrolling**: Click TOC links for smooth scroll to section
- **Close Options**: Click × button, press ESC, or click backdrop to close
- **Background Lock**: Prevents page scroll when TOC is open
- **Mobile Responsive**: 280px width on mobile, 350px on desktop; 1rem spacing on mobile

**Critical Implementation Notes**:
- **MUST position below navbar**: Set `top: 64px` and `height: calc(100% - 64px)` to start below fixed navbar
- **Toggle button at bottom left**: Use `bottom: 2rem; left: 2rem` (opposite scroll-to-top button at bottom right)
- **No vertical centering transform**: Button uses fixed bottom positioning, no translateY needed
- **Close button visibility**: Set `opacity: 0; visibility: hidden` by default, show only when `.sidenav-toc.open`
- **Z-index layering**: Navbar (~1030) → Overlay backdrop (1049) → TOC toggle (1049) → TOC panel (1050)
- **Active section detection**: Scroll offset of 200px ensures proper section highlighting
- **Symmetrical layout**: TOC toggle (bottom left, teal) mirrors scroll-to-top (bottom right, teal)

**Reference Examples**:
- See [/pages/2025/12/python-data-science-numpy-foundations.html](/pages/2025/12/python-data-science-numpy-foundations.html)

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
- From category to series article → `../series/cloud-computing/cloud-storage-services-guide.html`
- From category to standalone article → `../2026/01/article.html`
- From series article to CSS/JS → `../../../css/main.css` (3 levels: pages/series/[name]/)
- From series article to category → `../../categories/technology.html`
- From series article to sibling series → `../python-data-science/python-setup-notebooks-guide.html`
- Inter-series article links (same series) → `cloud-storage-services-guide.html` (relative, same folder)

## Development Workflow

### Adding a New Blog Article

**For Series Articles** (part of multi-article series):
1. **Create file** at `/pages/series/[series-name]/article-slug.html`
2. **Copy template** from `.template-blog-post.html`
3. **Update relative paths**: `../../../css/main.css`, `../../../js/main.js`, `../../categories/[category].html`
4. **Add inter-article navigation** linking to other articles in the same series
5. **Update category page** with path: `../series/[series-name]/article.html`

**For Standalone Articles** (one-off guides, glossaries):
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

### Task: Add new series article
→ Create file in `/pages/series/[series-name]/`, update relative paths, add inter-series navigation, update category page with path `../series/[series-name]/article.html`

### Task: Create new series folder
→ Create folder at `/pages/series/[series-name]/`, add first article, update category page with new series section

### Task: Add Scroll-to-Top button to existing article
→ Add CSS (before `</style>`), HTML button (after footer), and JavaScript (before `</body>`). See "Scroll-to-Top Button" section for complete code snippets.

### Task: Add Print button to blog article
→ Update blog-meta to flexbox layout, add print button HTML after reading-time, add print-btn CSS, add comprehensive @media print rules before `</style>`. See "Print Button" section for complete implementation.

### Task: Add PrismJS with theme switcher to article with code snippets
→ Add (1) Multiple theme CSS files in HEAD, (2) Toolbar/dropdown styling in STYLE section, (3) Prism scripts and theme switcher JavaScript before `</body>`. See "PrismJS Code Snippets with Copy and Theme Switcher" section for complete implementation.

### Task: Add Side Navigation TOC to blog article
→ Add (1) CSS styles for `.toc-toggle-btn`, `.sidenav-toc`, and `.sidenav-overlay`, (2) HTML for toggle button, side nav, and overlay backdrop before main content, (3) JavaScript for open/close functions and active section highlighting before `</body>`. See "Side Navigation Table of Contents" section for complete implementation.

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
| `pages/series/[name]/*.html` | Series articles | ~400 lines each | New series articles regularly |
| `pages/YYYY/MM/*.html` | Standalone articles | ~400 lines each | Occasional standalone articles |

## Critical Gotchas

1. **Path Confusion**: Both series articles (`pages/series/[name]/`) and standalone articles (`pages/YYYY/MM/`) are 3 directories deep. Use `../../../` to reach root.
2. **Series vs Standalone**: Use `/pages/series/` for 5+ related articles with cross-references. Use `/pages/YYYY/MM/` for one-off guides.
3. **No Build System**: Changes to CSS/JS take effect immediately—no compilation step. Files must be valid HTML/CSS/JavaScript as written.
4. **Consolidation Philosophy**: Don't create new CSS or JS files. Add to `main.css` and `main.js` instead (site-wide performance benefit).
5. **Tag Manager**: GTM ID is **GTM-PBS8M2JR** (hardcoded in pages). Analytics track all page views automatically.
6. **Mobile Responsiveness**: Bootstrap's grid system (col-lg-6, col-md-12, etc.) handles breakpoints. Test on mobile before publishing.

## Resources

- **Blog Standards**: Read `BLOG-INFRASTRUCTURE.md` before creating articles
- **Template**: Copy `.template-blog-post.html` for article structure
- **Bootstrap 5**: Classes like `container`, `row`, `card`, `btn`, `shadow-sm` used throughout
- **Font Awesome 6.4**: Icons via `<i class="fas fa-icon-name"></i>`
- **Color Palette**: Use CSS variables (--color-crimson, --color-navy, etc.)

---

**Last Updated**: January 29, 2026  
**Maintained By**: Wasil Zafar
