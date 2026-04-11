---
description: "Create a fixed multi-part blog series with series-nav-path navigation"
mode: "agent"
---

# Create a Fixed Multi-Part Blog Series

You are creating a **fixed multi-part blog series** for wasilzafar.com — a static HTML/CSS/JS GitHub Pages site with no build system. A fixed series has a predetermined number of parts, all planned upfront, with a `series-nav-path` step-card navigation at the top of each article.

## User Input Required

Ask the user for the following (if not already provided):
1. **Series title** — the overarching series name
2. **Series slug** — folder name (e.g., `system-design`, `ai-in-the-wild`)
3. **Category** — one of: Technology, Business, Engineering, Philosophy, Psychology, Science, Mathematics, Gaming, Poetry, Faith, Life Sciences
4. **Number of parts** — total planned parts in the series
5. **Part titles & descriptions** — title and short description for each part
6. **Series icon** — Font Awesome icon class (e.g., `fa-rocket`, `fa-robot`, `fa-brain`)
7. **Which part(s) to create now** — may create all or a subset
8. **Whether code snippets are needed** — determines PrismJS inclusion
9. **Whether mermaid diagrams are needed** — determines Mermaid.js inclusion
10. **Whether interactive doc-generator tools are needed** — determines doc-gen library inclusion
11. **Content outline for each part** — key H2 sections per article

## File Structure

```
/pages/series/{{SERIES-SLUG}}/
├── {{series-slug}}-part01-{{topic}}.html
├── {{series-slug}}-part02-{{topic}}.html
├── {{series-slug}}-part03-{{topic}}.html
└── ... (one file per part)
```

All paths from series articles: `../../../` to reach root, `../../categories/` for category pages.

## Content Philosophy

Generate content that is:
- **Beginner-friendly** building concepts from foundational basics to professionally advanced level
- Rich with **real-world examples**, several **case studies**, **analogies**, and **applications**
- Includes **exercises** wherever appropriate for hands-on learning
- Uses **progressive disclosure** — introduce concepts simply, then build complexity
- Each part should be **self-contained** enough to be valuable alone, while building on previous parts

## Series Navigation Path (Top of Each Article)

This is the signature visual roadmap that appears at the top of every series article, showing completed/current/upcoming steps. Place it INSIDE the `<div class="blog-content">` wrapper, BEFORE the first H2.

```html
<div class="series-nav-path">
    <div class="sn-header">
        <div class="path-icon"><i class="fas fa-{{SERIES_ICON}}"></i></div>
        <h4>{{SERIES TITLE}}</h4>
        <div class="path-subtitle">Your {{N}}-step learning path &bull; Currently on Step {{CURRENT}}</div>
    </div>
    <div class="path-steps">
        <!-- COMPLETED steps: linked <a>, checkmark icon -->
        <a href="{{slug}}.html" class="step-card">
            <div class="step-num completed"><i class="fas fa-check"></i></div>
            <div class="step-info">
                <h6>Part Title</h6>
                <small>Short description</small>
            </div>
        </a>

        <!-- CURRENT step: <div> (not linked), has step-badge -->
        <div class="step-card current">
            <div class="step-num active">{{N}}</div>
            <div class="step-info">
                <h6>Current Part Title</h6>
                <small>Short description</small>
            </div>
            <span class="step-badge you-are-here"><i class="fas fa-map-marker-alt me-1"></i>You Are Here</span>
        </div>

        <!-- UPCOMING steps: linked <a>, shows number -->
        <a href="{{slug}}.html" class="step-card">
            <div class="step-num upcoming">{{N}}</div>
            <div class="step-info">
                <h6>Upcoming Part Title</h6>
                <small>Short description</small>
            </div>
        </a>
    </div>
</div>
```

**Step type rules**:
| State | HTML Element | `.step-num` class | Content | Badge |
|-------|-------------|------------------|---------|-------|
| Completed | `<a href="...">` | `.completed` | `<i class="fas fa-check"></i>` | None |
| Current | `<div>` (NOT linked) | `.active` | Step number | `<span class="step-badge you-are-here">` |
| Upcoming | `<a href="...">` | `.upcoming` | Step number | None |

**Important**: For Part 1, all other steps are upcoming. For Part 5 of 10, steps 1-4 are completed, step 5 is current, steps 6-10 are upcoming.

## Complete HTML Template for Each Part

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{{META_DESCRIPTION — 155-160 chars}}" />
    <meta name="author" content="Wasil Zafar" />
    <meta name="keywords" content="{{5-8 keywords}}" />
    <meta property="og:title" content="{{PART TITLE}}" />
    <meta property="og:description" content="{{OG description}}" />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content="{{YYYY-MM-DD}}" />
    <meta property="article:author" content="Wasil Zafar" />
    <meta property="article:section" content="{{CATEGORY}}" />
    
    <title>{{PART TITLE}} - Wasil Zafar</title>
    <link rel="canonical" href="https://www.wasilzafar.com/pages/series/{{SERIES-SLUG}}/{{ARTICLE-SLUG}}.html" />

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

    <!-- [IF CODE SNIPPETS] Prism.js — 6 themes -->
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

    <!-- [IF DOC GENERATOR] Document Generation Libraries -->
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

    <!-- Navbar (same as template) -->
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
                <a href="../../categories/{{CATEGORY_SLUG}}.html" class="back-link">
                    <i class="fas fa-arrow-left me-2"></i>Back to {{CATEGORY_NAME}}</a>
                <h1 class="display-4 fw-bold mb-3">{{PART_TITLE}}</h1>
                <div class="blog-meta">
                    <span><i class="fas fa-calendar me-2"></i>{{MONTH DD, YYYY}}</span>
                    <span><i class="fas fa-user me-2"></i>Wasil Zafar</span>
                    <span class="reading-time"><i class="fas fa-clock me-1"></i>{{X}} min read</span>
                    <button onclick="window.print()" class="print-btn" title="Print this article">
                        <i class="fas fa-print"></i> Print</button>
                </div>
                <p class="lead">{{SUBTITLE}}</p>
            </div>
        </div>
    </section>

    <!-- TOC Toggle + Side Nav + Overlay (include for articles >1000 words) -->
    <button class="toc-toggle-btn" onclick="openNav()" title="Table of Contents" aria-label="Open Table of Contents">
        <i class="fas fa-list"></i>
    </button>
    <div id="tocSidenav" class="sidenav-toc">
        <div class="toc-header">
            <h3><i class="fas fa-list me-2"></i>Table of Contents</h3>
            <button class="closebtn" onclick="closeNav()" aria-label="Close Table of Contents">&times;</button>
        </div>
        <ol>
            <!-- TOC entries matching the article's H2/H3 sections -->
            <!-- Numbering is automatic via CSS counters -->
        </ol>
    </div>
    <div id="tocOverlay" class="sidenav-overlay" onclick="closeNav()"></div>

    <!-- Main Content -->
    <section class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="blog-content">

                        <!-- Series Navigation Path (FIRST element inside blog-content) -->
                        <!-- See series-nav-path section above -->

                        <!-- H2 Sections with content -->
                        <h2 id="section-id">Section Title</h2>
                        <p>Content...</p>

                        <!-- ... more sections ... -->

                        <!-- Conclusion -->
                        <h2 id="conclusion">Conclusion & Next Steps</h2>
                        <p>Summary...</p>

                        <!-- Next in Series Callout (except last part) -->
                        <div class="series-next">
                            <h4><i class="fas fa-arrow-right me-2"></i>Next in the Series</h4>
                            <p>In <a href="{{next-article-slug}}.html"><strong>Part {{N+1}}: {{Next Title}}</strong></a>, we'll explore {{topic description}}.</p>
                        </div>

                        <!-- Related Posts -->
                        <div class="related-posts">
                            <h3><i class="fas fa-book-reader me-2"></i>Continue the Series</h3>
                            <div class="related-post-item">
                                <h5 class="mb-2">Part {{X}}: {{Title}}</h5>
                                <p class="text-muted small mb-2">Brief description.</p>
                                <a href="{{slug}}.html" class="text-decoration-none">Read Article <i class="fas fa-arrow-right ms-1"></i></a>
                            </div>
                            <!-- 2-3 related post items -->
                        </div>

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
    <script src="../../../js/series/doc-generator-{{SERIES-SLUG}}.js"></script>

    <!-- [IF CODE SNIPPETS] Prism.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <!-- Add language components as needed -->
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

    <!-- [IF DOC GENERATOR] FormPersistence + CanvasFormHandler init -->
</body>
</html>
```

## Content Components

All content components (highlight-box, experiment-card, mermaid-container, code snippets, doc-generator forms) use identical patterns to the standalone blog post prompt. Refer to `.github/prompts/create-blog-post.prompt.md` for detailed HTML snippets.

### Icon Conventions for Related Posts

- `fa-book-reader` — "Continue the Series" (narrative/technical series)
- `fa-book` — "Related Articles in This Series" (reference-style series)
- `fa-arrow-right` — "Next in the Series" (callout boxes)

## Category Page Update

After creating the series, add a collapsible series section to `/pages/categories/{{CATEGORY_SLUG}}.html`:

```html
<!-- Series Section Header -->
<div class="d-flex align-items-center justify-content-between mb-2">
    <h2 class="fw-bold mb-0">
        <i class="fas fa-{{SERIES_ICON}} me-2 text-teal"></i>
        {{SERIES TITLE}}
    </h2>
    <button class="btn btn-outline-teal btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#{{seriesId}}Collapse">
        <i class="fas fa-chevron-down me-2"></i>Show Series
    </button>
</div>
<p class="text-secondary mb-3">{{Series description — 1-2 sentences}}</p>
<div class="mb-2">
    <span class="badge bg-crimson text-white px-3 py-2">{{N}}-Part {{Topic}} Series</span>
</div>

<!-- Collapsible Card Grid -->
<div class="collapse" id="{{seriesId}}Collapse">
    <div class="row g-4 mb-5">
        <!-- One card per published part -->
        <div class="col-md-6">
            <div class="card h-100 shadow-sm border-0 series-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge bg-teal text-white">Part {{N}}: {{Short Title}}</span>
                        <span class="badge bg-light text-dark">{{X}} min read</span>
                    </div>
                    <h4 class="card-title fw-bold mb-3">{{Full Part Title}}</h4>
                    <p class="card-text text-secondary small mb-3">{{Description}}</p>
                    <div class="mb-3">
                        <span class="badge bg-light text-dark me-1">Tag1</span>
                        <span class="badge bg-light text-dark me-1">Tag2</span>
                    </div>
                    <a href="../series/{{SERIES-SLUG}}/{{article-slug}}.html" target="_blank" class="btn btn-primary"
                       data-tracking-id="cta_series_{{category}}_{{series}}_part{{N}}">
                        Read Part {{N}} <i class="fas fa-arrow-right ms-2"></i>
                    </a>
                </div>
            </div>
        </div>
        <!-- Repeat for each part -->
    </div>
</div>
```

## Doc Generator JS File (If Needed)

If the series includes interactive tools, create `/js/series/doc-generator-{{SERIES-SLUG}}.js`:

```javascript
/**
 * Doc Generator — {{SERIES TITLE}}
 * Series-specific generators extending DocGenerator base.
 */
Object.assign(DocGenerator, {

    // ============================================================
    // {{Tool Name}} — Word
    // ============================================================
    generate{{DocType}}Word: function() {
        var data = this._getFormData();
        // Use window.docx — Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell
        var doc = new (window.docx.default || window.docx).Document({ ... });
        (window.docx.default || window.docx).Packer.toBlob(doc).then(function(blob) {
            DocGenerator._downloadFile(blob, data.filename + '.docx');
        });
    },

    // ============================================================
    // {{Tool Name}} — Excel
    // ============================================================
    generate{{DocType}}Excel: function() {
        var data = this._getFormData();
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet([/* rows */]);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, data.filename + '.xlsx');
    },

    // ============================================================
    // {{Tool Name}} — PDF
    // ============================================================
    generate{{DocType}}PDF: function() {
        var data = this._getFormData();
        var pdf = new jspdf.jsPDF();
        // pdf.setFontSize(), pdf.text(), pdf.rect(), pdf.save()
        pdf.save(data.filename + '.pdf');
    },

    // ============================================================
    // {{Tool Name}} — PPTX (optional)
    // ============================================================
    generate{{DocType}}PPTX: function() {
        var data = this._getFormData();
        var pptx = new PptxGenJS();
        // Color palette: { navy:'132440', crimson:'BF092F', teal:'3B9797', blue:'16476A', light:'F8F9FA' }
        // Use fit:'shrink' (NEVER autoFit:true), wrap:true, margin:[4,4,4,4]
        pptx.writeFile({ fileName: data.filename + '.pptx' });
    }
});
```

**Verify syntax**: Run `node -c js/series/doc-generator-{{SERIES-SLUG}}.js` after creating.

## Checklist for Each Part

- [ ] File created at correct path: `/pages/series/{{SLUG}}/{{article-slug}}.html`
- [ ] Meta tags complete (description, keywords, OG, article metadata)
- [ ] Canonical URL correct
- [ ] Relative paths verified (`../../../` to root)
- [ ] series-nav-path has correct completed/current/upcoming states
- [ ] TOC matches all H2/H3 section IDs
- [ ] Content includes highlight-boxes, experiment-cards, code blocks, mermaid diagrams as appropriate
- [ ] Code blocks are independently executable
- [ ] "Next in Series" callout present (except last part)
- [ ] Related posts link to 2-3 other parts in the series
- [ ] Reading time calculated (word count / 200)
- [ ] Category page updated with series section
- [ ] HTML validates (balanced tags, proper nesting)

## Critical Rules

1. **Layout**: ALWAYS use `col-lg-8 mx-auto` — never wider
2. **No inline styles**: Use CSS classes from `main.css`
3. **No `<style>` blocks**: All CSS in `main.css`
4. **series-nav-path**: MUST be first element inside `.blog-content`, before any H2
5. **Step links**: Completed and upcoming steps are `<a>` elements; current step is `<div>`
6. **Relative paths**: Same-series links are just `filename.html` (no folder prefix)
7. **Cookie banner + Footer**: Copy exact HTML from `.template-blog-post.html`
8. **PptxGenJS**: Use `unpkg.com/pptxgenjs@3.12.0/dist/pptxgen.bundle.js` — NOT jsdelivr
9. **Heading hierarchy**: H2 for main sections, H3 for sub, H4 for sub-sub
10. **Code independence**: Every code block self-contained and executable
