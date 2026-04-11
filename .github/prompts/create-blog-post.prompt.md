---
description: "Create a standalone blog post following all wasilzafar.com conventions"
mode: "agent"
---

# Create a Standalone Blog Post

You are creating a **standalone blog post** for wasilzafar.com — a static HTML/CSS/JS GitHub Pages site with no build system.

## User Input Required

Ask the user for the following (if not already provided):
1. **Article title** — the main heading
2. **Topic/subject** — what the article covers
3. **Category** — one of: Technology, Business, Engineering, Philosophy, Psychology, Science, Mathematics, Gaming, Poetry, Faith, Life Sciences
4. **Target audience level** — beginner, intermediate, advanced, or progressive (beginner → advanced)
5. **Publish date** — in YYYY-MM-DD format (default: today)
6. **Whether code snippets are needed** — determines PrismJS inclusion
7. **Whether mermaid diagrams are needed** — determines Mermaid.js inclusion
8. **Whether interactive doc-generator tools are needed** — determines doc-gen library inclusion
9. **Key topics/sections to cover** — outline of main H2 sections

## File Location

Standalone articles go in `/pages/YYYY/MM/article-slug.html` where YYYY and MM come from the publish date.

**Slug convention**: lowercase, hyphenated, descriptive (e.g., `git-version-control-mastery.html`)

## Content Philosophy

Generate content that is:
- **Beginner-friendly** building concepts from foundational basics to professionally advanced level
- Rich with **real-world examples**, several **case studies**, **analogies**, and **applications**
- Includes **exercises** wherever appropriate for hands-on learning
- Uses **progressive disclosure** — introduce concepts simply, then build complexity

## Complete HTML Structure

Use this exact structure. All paths are relative from `/pages/YYYY/MM/`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{{META_DESCRIPTION — 155-160 chars with primary keyword}}" />
    <meta name="author" content="Wasil Zafar" />
    <meta name="keywords" content="{{KEYWORD1}}, {{KEYWORD2}}, {{KEYWORD3}}, {{KEYWORD4}}, {{KEYWORD5}}" />
    <meta property="og:title" content="{{ARTICLE_TITLE}}" />
    <meta property="og:description" content="{{OG_DESCRIPTION — shorter than meta}}" />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content="{{YYYY-MM-DD}}" />
    <meta property="article:author" content="Wasil Zafar" />
    <meta property="article:section" content="{{CATEGORY}}" />
    
    <title>{{ARTICLE_TITLE}} - Wasil Zafar</title>
    <link rel="canonical" href="https://www.wasilzafar.com/pages/{{YYYY}}/{{MM}}/{{ARTICLE-SLUG}}.html" />

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
    <!-- Custom Styles -->
    <link rel="stylesheet" href="../../../css/main.css" type="text/css" />

    <!-- [IF CODE SNIPPETS] Prism.js Syntax Highlighting — 6 themes -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" id="prism-theme" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" id="prism-default" disabled />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-dark.min.css" id="prism-dark" disabled />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-twilight.min.css" id="prism-twilight" disabled />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css" id="prism-okaidia" disabled />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-solarizedlight.min.css" id="prism-solarizedlight" disabled />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.css" />

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="../../../images/favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../../../images/favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../../images/favicon_io/favicon-16x16.png">
    <link rel="manifest" href="../../../images/favicon_io/site.webmanifest">

    <!-- [IF DOC GENERATOR TOOLS] Document Generation Libraries -->
    <script src="https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    <script src="https://unpkg.com/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>

    <!-- Google Consent Mode v2 -->
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
            'ad_storage': 'denied', 'ad_user_data': 'denied',
            'ad_personalization': 'denied', 'analytics_storage': 'denied',
            'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE']
        });
        gtag('consent', 'default', {
            'ad_storage': 'granted', 'ad_user_data': 'granted',
            'ad_personalization': 'granted', 'analytics_storage': 'granted'
        });
        gtag('set', 'url_passthrough', true);
    </script>
    <!-- Google Tag Manager -->
    <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PBS8M2JR');
    </script>
</head>
```

### Body Structure

```html
<body>
    <!-- GTM noscript -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBS8M2JR" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

    <!-- Cookie Banner — copy exact HTML from .template-blog-post.html -->

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="/"><span class="gradient-text">Wasil Zafar</span></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="/#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="/#skills">Skills</a></li>
                    <li class="nav-item"><a class="nav-link" href="/#certifications">Certifications</a></li>
                    <li class="nav-item"><a class="nav-link" href="/#interests">Interests</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="blog-hero">
        <div class="container py-5">
            <div class="blog-header">
                <a href="/pages/categories/{{CATEGORY_SLUG}}.html" class="back-link">
                    <i class="fas fa-arrow-left me-2"></i>Back to {{CATEGORY_NAME}}</a>
                <h1 class="display-4 fw-bold mb-3">{{ARTICLE_TITLE}}</h1>
                <div class="blog-meta">
                    <span><i class="fas fa-calendar me-2"></i>{{MONTH DD, YYYY}}</span>
                    <span><i class="fas fa-user me-2"></i>Wasil Zafar</span>
                    <span class="reading-time"><i class="fas fa-clock me-1"></i>{{X}} min read</span>
                    <button onclick="window.print()" class="print-btn" title="Print this article">
                        <i class="fas fa-print"></i> Print</button>
                </div>
                <p class="lead">{{SUBTITLE — 1-2 engaging sentences}}</p>
            </div>
        </div>
    </section>

    <!-- TOC Toggle + Side Nav + Overlay -->
    <!-- (include for articles >1000 words — see TOC section below) -->

    <!-- Main Content -->
    <section class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="blog-content">
                        <!-- All article content here -->
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer — copy exact HTML from .template-blog-post.html -->

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Scroll-to-Top + Category Indicator -->
    <button id="scrollToTop" class="scroll-to-top" title="Back to Top"><i class="fas fa-arrow-up"></i></button>
    <div id="categoryIndicator" class="category-indicator"></div>
    <!-- Core JS -->
    <script src="../../../js/cookie-consent.js"></script>
    <script src="../../../js/main.js"></script>

    <!-- [IF DOC GENERATOR] -->
    <script src="../../../js/doc-generator-core.js"></script>

    <!-- [IF CODE SNIPPETS] Prism.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <!-- Add language components as needed: prism-python, prism-bash, prism-javascript, prism-json, prism-java, prism-sql, etc. -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>

    <!-- [IF MERMAID DIAGRAMS] -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({
            startOnLoad: true, theme: 'base',
            themeVariables: {
                primaryColor: '#e8f4f4', primaryTextColor: '#132440', primaryBorderColor: '#3B9797',
                lineColor: '#3B9797', secondaryColor: '#f0f4f8', tertiaryColor: '#fff5f5',
                fontFamily: 'DM Sans, sans-serif', fontSize: '14px', nodeBorder: '#3B9797',
                mainBkg: '#e8f4f4', clusterBkg: '#f0f4f8', clusterBorder: '#16476A', edgeLabelBackground: '#ffffff'
            },
            flowchart: { curve: 'basis', padding: 15 }
        });
    </script>
</body>
</html>
```

## Side Navigation TOC

Include for articles with >1000 words. Place BEFORE the main content `<section>`.

**Numbering is automatic via CSS counters** — do NOT add manual numbers.

```html
<button class="toc-toggle-btn" onclick="openNav()" title="Table of Contents" aria-label="Open Table of Contents">
    <i class="fas fa-list"></i>
</button>
<div id="tocSidenav" class="sidenav-toc">
    <div class="toc-header">
        <h3><i class="fas fa-list me-2"></i>Table of Contents</h3>
        <button class="closebtn" onclick="closeNav()" aria-label="Close Table of Contents">&times;</button>
    </div>
    <ol>
        <li>
            <a href="#section-id" onclick="closeNav()">Section Group Title</a>
            <ul>
                <li><a href="#section-id" onclick="closeNav()">Subsection Title</a></li>
                <li><a href="#subsection-id" onclick="closeNav()">Another Subsection</a></li>
            </ul>
        </li>
        <!-- Repeat for each major section group -->
        <li><a href="#conclusion" onclick="closeNav()">Conclusion & Next Steps</a></li>
    </ol>
</div>
<div id="tocOverlay" class="sidenav-overlay" onclick="closeNav()"></div>
```

## Content Components

### Highlight Box (Key Insights)

```html
<div class="highlight-box">
    <i class="fas fa-lightbulb me-2"></i>
    <strong>Key Insight:</strong> Important takeaway text here.
</div>
```

**Variants**: `.highlight-crimson` (warnings/important), `.highlight-navy` (definitions/formal)

### Experiment Card (Case Studies)

```html
<div class="experiment-card">
    <div class="experiment-meta">
        <span class="badge bg-teal"><i class="fas fa-flask me-1"></i>Case Study</span>
    </div>
    <h4>Case Study Title</h4>
    <p>Description of the real-world case study...</p>
    <div class="bias-tags">
        <span class="bias-tag">Tag 1</span>
        <span class="bias-tag">Tag 2</span>
    </div>
</div>
```

### Mermaid Diagram

```html
<div class="mermaid-container">
    <span class="mermaid-label"><i class="fas fa-project-diagram me-1"></i>Diagram Title</span>
    <pre class="mermaid">
flowchart TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[Result A]
    C -->|No| E[Result B]

    style A fill:#3B9797,stroke:#3B9797,color:#fff
    style D fill:#e8f4f4,stroke:#3B9797,color:#132440
    style E fill:#fff5f5,stroke:#BF092F,color:#132440
    </pre>
</div>
```

**Node color palette**: START=teal(`#3B9797`), END=navy(`#132440`), Primary=`#e8f4f4`/teal, Secondary=`#f0f4f8`/blue(`#16476A`), Alert=`#fff5f5`/crimson(`#BF092F`)

### Code Snippets (PrismJS)

**CRITICAL**: Every code block MUST be independently copy-paste executable.

```html
<pre><code class="language-python">import numpy as np

# Create sample data
data = np.array([1, 2, 3, 4, 5])

# Calculate mean
mean = data.mean()
print("Mean:", mean)  # 3.0
</code></pre>
```

**Rules**:
- Always include imports at the start of each block
- Include data initialization within each block (no external dependencies)
- Split combined examples into separate focused blocks
- Add output statements (`print()`, `plt.show()`)
- Use correct `language-*` class: `language-python`, `language-javascript`, `language-bash`, `language-json`, `language-java`, `language-sql`, etc.

### Doc Generator Form

```html
<div class="canvas-form" id="{{formId}}">
    <h4 class="canvas-form-title"><i class="fas fa-{{icon}} me-2"></i>{{Tool Name}}</h4>
    <p class="form-help-text">Brief description. Download as Word, Excel, PDF, or PowerPoint.</p>
    <div id="{{badgeId}}" class="form-autosave-badge">Draft auto-saved</div>
    <p class="form-privacy-notice"><i class="fas fa-shield-alt"></i> All data stays in your browser. Nothing is sent to or stored on any server.</p>
    <div class="form-row">
        <div class="form-group">
            <label for="{{fieldId}}">Field Label *</label>
            <input type="text" id="{{fieldId}}" placeholder="Helpful placeholder">
        </div>
        <div class="form-group">
            <label for="{{fieldId2}}">Field Label</label>
            <textarea id="{{fieldId2}}" rows="3" placeholder="Multi-line&#10;placeholder"></textarea>
        </div>
    </div>
    <!-- Author name field -->
    <div class="form-row">
        <div class="form-group" style="grid-column: 1 / -1;">
            <label><i class="fas fa-user me-1"></i>Author Name</label>
            <input type="text" data-author placeholder="Your name (appears on document cover page)" style="max-width: 400px;">
        </div>
    </div>
    <div class="form-actions">
        <button class="btn-generate" onclick="{{handler}}.generateWord()"><i class="fas fa-file-word me-1"></i>Word</button>
        <button class="btn-generate" onclick="{{handler}}.generateExcel()"><i class="fas fa-file-excel me-1"></i>Excel</button>
        <button class="btn-generate" onclick="{{handler}}.generatePDF()"><i class="fas fa-file-pdf me-1"></i>PDF</button>
        <button class="btn-generate" onclick="{{handler}}.generatePPTX()"><i class="fas fa-file-powerpoint me-1"></i>PPTX</button>
        <button class="btn-reset" onclick="{{handler}}.reset()"><i class="fas fa-undo me-1"></i>Reset</button>
    </div>
    <div id="{{successId}}" class="form-success-message"><i class="fas fa-check-circle me-2"></i><span id="{{successTextId}}"></span></div>
</div>
```

**Button colors are automatic** via CSS `:has()` selectors — NEVER use inline styles on `.btn-generate`.

**Initialization script** (place before `</body>` after doc-generator-core.js):

```html
<script>
    var {{prefix}}Persistence = new FormPersistence('{{storage-key}}', {
        '{{fieldId}}': 'dataKey',
        '{{fieldId2}}': 'dataKey2'
    }, '{{badgeId}}');

    var {{handler}} = new CanvasFormHandler({
        formId: '{{formId}}',
        successId: '{{successId}}',
        successTextId: '{{successTextId}}',
        persistence: {{prefix}}Persistence,
        filenameField: 'dataKey',
        filenameSuffix: '-{{suffix}}',
        requiredFields: ['{{fieldId}}'],
        requiredMessage: 'Please fill in required fields.',
        docType: '{{DocTypeName}}'
    });

    document.addEventListener('DOMContentLoaded', function() { {{prefix}}Persistence.init(); });
</script>
```

### Related Reading (for standalone articles)

```html
<div class="related-posts">
    <h3><i class="fas fa-link me-2"></i>Related Reading</h3>
    <div class="related-post-item">
        <h5>Related Article Title</h5>
        <p>Brief description of the related content.</p>
        <a href="/pages/categories/{{category}}.html">Explore More {{Category}} Articles <i class="fas fa-arrow-right ms-1"></i></a>
    </div>
</div>
```

## Category Page Update

After creating the article, update the corresponding category page at `/pages/categories/{{CATEGORY_SLUG}}.html` by adding an article card:

```html
<div class="col-md-6">
    <div class="card h-100 shadow-sm border-0 series-card">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge bg-teal text-white">Standalone</span>
                <span class="badge bg-light text-dark">{{X}} min read</span>
            </div>
            <h4 class="card-title fw-bold mb-3">{{ARTICLE_TITLE}}</h4>
            <p class="card-text text-secondary small mb-3">{{Short description}}</p>
            <div class="mb-3">
                <span class="badge bg-light text-dark me-1">Tag1</span>
                <span class="badge bg-light text-dark me-1">Tag2</span>
            </div>
            <a href="../{{YYYY}}/{{MM}}/{{ARTICLE-SLUG}}.html" target="_blank" class="btn btn-primary"
               data-tracking-id="cta_read_article_{{category}}_{{index}}">
                Read Article <i class="fas fa-arrow-right ms-2"></i>
            </a>
        </div>
    </div>
</div>
```

## Reading Time Calculation

Divide total word count by 200 words/minute. Round to nearest whole number.

## Critical Rules

1. **Layout**: ALWAYS use `col-lg-8 mx-auto` wrapper for content — never `col-lg-10` or `col-lg-12`
2. **No inline styles**: Use CSS classes from `main.css`, never `style=""` for colors/borders/spacing
3. **No `<style>` blocks**: All CSS belongs in `main.css`
4. **CSS variables**: Use `var(--color-teal)` not `#3B9797` in any new CSS
5. **Relative paths**: From `/pages/YYYY/MM/` use `../../../` to reach root
6. **Code independence**: Every code block must be self-contained and executable
7. **Cookie banner**: Copy the exact HTML from `.template-blog-post.html`
8. **Footer**: Copy the exact HTML from `.template-blog-post.html`
9. **Heading hierarchy**: H2 for main sections, H3 for subsections, H4 for sub-subsections
10. **PptxGenJS CDN**: MUST use `unpkg.com/pptxgenjs@3.12.0/dist/pptxgen.bundle.js` — NOT jsdelivr
