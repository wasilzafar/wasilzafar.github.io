---
description: "Create an ever-expanding blog series with a dedicated listing page instead of series-nav-path"
mode: "agent"
---

# Create an Ever-Expanding Blog Series

You are creating an **ever-expanding blog series** for wasilzafar.com — a static HTML/CSS/JS GitHub Pages site with no build system. Unlike fixed series, this type of series **grows continuously** with new parts added over time. It uses a **dedicated listing/index page** instead of the `series-nav-path` step-card navigation (which would become unwieldy as parts grow).

## Key Difference from Fixed Series

| Aspect | Fixed Series | Ever-Expanding Series |
|--------|-------------|----------------------|
| Part count | Predetermined (e.g., 15 parts) | Open-ended, grows over time |
| Top navigation | `series-nav-path` with all steps | **No series-nav-path** |
| Part discovery | Step cards show all parts | **Dedicated listing page** with article cards |
| Back link | Points to category page | Points to **listing page** |
| Bottom navigation | Related posts (2-3 items) | Previous/Next nav + link to listing page |

## User Input Required

Ask the user for the following (if not already provided):
1. **Series title** — the overarching series name
2. **Series slug** — folder name (e.g., `web-security`, `devops-practices`)
3. **Category** — one of: Technology, Business, Engineering, Philosophy, Psychology, Science, Mathematics, Gaming, Poetry, Faith, Life Sciences
4. **Series icon** — Font Awesome icon class (e.g., `fa-shield-alt`, `fa-cogs`)
5. **Series description** — 2-3 sentences for the listing page hero
6. **Initial parts to create** — titles, descriptions, and content outlines
7. **Whether code snippets are needed** — determines PrismJS inclusion
8. **Whether mermaid diagrams are needed** — determines Mermaid.js inclusion
9. **Whether interactive doc-generator tools are needed** — determines doc-gen library inclusion

## File Structure

```
/pages/series/{{SERIES-SLUG}}/
├── index.html                              ← Dedicated listing page
├── {{series-slug}}-part01-{{topic}}.html    ← Article parts
├── {{series-slug}}-part02-{{topic}}.html
├── {{series-slug}}-part03-{{topic}}.html
└── ... (grows over time)
```

All paths from series articles and listing page: `../../../` to reach root, `../../categories/` for category pages.

## Content Philosophy

Generate content that is:
- **Beginner-friendly** building concepts from foundational basics to professionally advanced level
- Rich with **real-world examples**, several **case studies**, **analogies**, and **applications**
- Includes **exercises** wherever appropriate for hands-on learning
- Uses **progressive disclosure** — introduce concepts simply, then build complexity
- Each part should be **fully self-contained** — even more important than fixed series since readers may discover any part first

---

## Part 1: The Listing Page (`index.html`)

This is the hub page where readers discover all parts. It uses the **category page pattern** adapted for a single series.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{{SERIES DESCRIPTION — 155-160 chars}}" />
    <meta name="author" content="Wasil Zafar" />
    <meta name="keywords" content="{{series keywords}}" />
    <meta property="og:title" content="{{SERIES TITLE}} — Complete Series" />
    <meta property="og:description" content="{{OG description}}" />
    <meta property="og:type" content="website" />
    <meta property="article:author" content="Wasil Zafar" />
    <meta property="article:section" content="{{CATEGORY}}" />
    
    <title>{{SERIES TITLE}} - Wasil Zafar</title>
    <link rel="canonical" href="https://www.wasilzafar.com/pages/series/{{SERIES-SLUG}}/index.html" />

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

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="../../../images/favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../../../images/favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../../images/favicon_io/favicon-16x16.png">
    <link rel="manifest" href="../../../images/favicon_io/site.webmanifest">

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

    <!-- Series Hero (uses category-hero style) -->
    <section class="category-hero">
        <div class="container py-5">
            <div class="text-center">
                <div class="category-icon"><i class="fas fa-{{SERIES_ICON}}"></i></div>
                <h1 class="display-4 fw-bold mb-3">{{SERIES TITLE}}</h1>
                <p class="lead">{{Series description — 2-3 engaging sentences about what readers will learn}}</p>
                <div class="mt-3">
                    <a href="../../categories/{{CATEGORY_SLUG}}.html" class="btn btn-outline-light me-2">
                        <i class="fas fa-arrow-left me-1"></i>Back to {{CATEGORY_NAME}}
                    </a>
                    <span class="badge bg-crimson text-white px-3 py-2 ms-2">
                        <i class="fas fa-layer-group me-1"></i>{{N}} Parts &amp; Growing
                    </span>
                </div>
            </div>
        </div>
    </section>

    <!-- Articles Listing -->
    <section class="py-5">
        <div class="container">
            <h2 class="section-category-header">All Articles in This Series</h2>
            <div class="row g-4 mb-5">

                <!-- Published Article Card (repeat for each part) -->
                <div class="col-md-6">
                    <div class="card h-100 shadow-sm border-0 series-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span class="badge bg-teal text-white">Part {{N}}</span>
                                <span class="badge bg-light text-dark">{{X}} min read</span>
                            </div>
                            <h4 class="card-title fw-bold mb-3">{{Part Title}}</h4>
                            <p class="card-text text-secondary small mb-3">{{Description — 1-2 sentences}}</p>
                            <div class="mb-3">
                                <span class="badge bg-light text-dark me-1">Tag1</span>
                                <span class="badge bg-light text-dark me-1">Tag2</span>
                            </div>
                            <a href="{{article-slug}}.html" target="_blank" class="btn btn-primary"
                               data-article-slug="{{article-slug}}"
                               data-category="{{category}}"
                               data-tracking-id="cta_series_{{category}}_{{series}}_part{{N}}">
                                Read Part {{N}} <i class="fas fa-arrow-right ms-2"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Upcoming/Coming Soon Card (optional, for planned parts) -->
                <div class="col-md-6">
                    <div class="card h-100 shadow-sm border-0 upcoming-card border-teal">
                        <div class="card-body d-flex flex-column">
                            <div class="mb-3">
                                <span class="badge bg-warning text-dark"><i class="fas fa-hourglass-half me-1"></i>Coming Soon</span>
                            </div>
                            <h5 class="card-title fw-bold mb-3">
                                <i class="fas fa-{{SERIES_ICON}} me-2 text-teal"></i>Part {{N}}: {{Planned Title}}
                            </h5>
                            <p class="card-text text-secondary small mb-3 flex-grow-1">{{Description of planned content}}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Footer — copy exact HTML from .template-blog-post.html -->

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Core JS -->
    <script src="../../../js/cookie-consent.js"></script>
    <script src="../../../js/main.js"></script>
</body>
</html>
```

### Updating the Listing Page When Adding New Parts

When a new part is published:
1. Add a new published article card in the listing grid
2. Remove or convert the corresponding "Coming Soon" card
3. Update the badge count in the hero section (`{{N}} Parts & Growing`)

---

## Part 2: Individual Article Pages

Each article is similar to a fixed series article but with these key differences:

1. **NO `series-nav-path`** — the top navigation roadmap is omitted
2. **Back link points to the listing page** — not the category page
3. **Bottom navigation** uses `series-nav` (Prev/Next) AND a link back to the listing page

### Hero Section (Different Back Link)

```html
<section class="blog-hero">
    <div class="container py-5">
        <div class="blog-header">
            <a href="index.html" class="back-link">
                <i class="fas fa-arrow-left me-2"></i>Back to {{SERIES TITLE}}</a>
            <h1 class="display-4 fw-bold mb-3">Part {{N}}: {{PART TITLE}}</h1>
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
```

### Bottom Navigation (Previous/Next + Listing Page Link)

Place inside `.blog-content`, after the conclusion:

```html
<!-- Series Previous/Next Navigation -->
<div class="series-nav">
    <!-- Previous (omit for Part 1) -->
    <a href="{{prev-slug}}.html" class="series-nav-item prev">
        <span class="nav-label"><i class="fas fa-arrow-left me-1"></i>Previous</span>
        <span class="nav-title">Part {{N-1}}: {{Previous Title}}</span>
    </a>
    <!-- Next (omit for latest part) -->
    <a href="{{next-slug}}.html" class="series-nav-item next">
        <span class="nav-label">Next <i class="fas fa-arrow-right ms-1"></i></span>
        <span class="nav-title">Part {{N+1}}: {{Next Title}}</span>
    </a>
</div>

<!-- Link Back to Full Series Listing -->
<div class="related-posts">
    <h3><i class="fas fa-book-reader me-2"></i>Explore the Full Series</h3>
    <div class="related-post-item">
        <h5 class="mb-2">{{SERIES TITLE}}</h5>
        <p class="text-muted small mb-2">Browse all published parts and see what's coming next in this ever-growing series.</p>
        <a href="index.html" class="text-decoration-none">View All Parts <i class="fas fa-arrow-right ms-1"></i></a>
    </div>
    <!-- Optionally add 1-2 specific related parts -->
    <div class="related-post-item">
        <h5 class="mb-2">Part {{X}}: {{Related Title}}</h5>
        <p class="text-muted small mb-2">{{Brief description}}</p>
        <a href="{{slug}}.html" class="text-decoration-none">Read Article <i class="fas fa-arrow-right ms-1"></i></a>
    </div>
</div>
```

**Navigation rules for edge cases**:
- **Part 1**: Only show "Next" link (no Previous)
- **Latest published part**: Only show "Previous" link (no Next)
- **Single part published**: Show only the listing page link

### Complete Article HTML Template

Use the same `<head>` and body structure as the fixed series template (see `create-series.prompt.md`) with these modifications:

1. **Remove** the entire `series-nav-path` section from inside `.blog-content`
2. **Change the back link** in the hero from `../../categories/{{CATEGORY_SLUG}}.html` to `index.html`
3. **Replace** the related-posts section with the Previous/Next nav + listing page link shown above
4. **Canonical URL**: `https://www.wasilzafar.com/pages/series/{{SERIES-SLUG}}/{{ARTICLE-SLUG}}.html`

Everything else is identical: head CDNs, TOC, content components (highlight-box, experiment-card, mermaid, code blocks, doc generator forms), footer, script loading order.

---

## Content Components

All content components use identical patterns to the fixed series and standalone blog post prompts. Refer to `.github/prompts/create-blog-post.prompt.md` for detailed HTML snippets for:
- Highlight boxes (`.highlight-box`, `.highlight-crimson`, `.highlight-navy`)
- Experiment cards (`.experiment-card`) with case studies
- Mermaid diagrams (`.mermaid-container`) with site color palette
- PrismJS code blocks (independently executable)
- Doc generator forms (`.canvas-form`) with FormPersistence + CanvasFormHandler

## Category Page Update

Add the series to `/pages/categories/{{CATEGORY_SLUG}}.html` with a link to the listing page:

```html
<div class="d-flex align-items-center justify-content-between mb-2">
    <h2 class="fw-bold mb-0">
        <i class="fas fa-{{SERIES_ICON}} me-2 text-teal"></i>
        {{SERIES TITLE}}
    </h2>
    <a href="../series/{{SERIES-SLUG}}/index.html" class="btn btn-outline-teal btn-sm">
        <i class="fas fa-external-link-alt me-2"></i>View Series
    </a>
</div>
<p class="text-secondary mb-3">{{Series description — 1-2 sentences}}</p>
<div class="mb-4">
    <span class="badge bg-crimson text-white px-3 py-2">
        <i class="fas fa-layer-group me-1"></i>{{N}} Parts &amp; Growing
    </span>
</div>
```

**Why link to listing page instead of inline cards**: Since the series grows over time, maintaining duplicate card listings on both the category page and the listing page becomes error-prone. The category page links to the listing page which serves as the single source of truth.

## Doc Generator JS File

Same pattern as fixed series. See `create-series.prompt.md` for the doc generator JS file template.

## Workflow: Adding a New Part to an Existing Expanding Series

When adding a new part to an existing ever-expanding series:

1. **Create the article file** at `/pages/series/{{SERIES-SLUG}}/{{new-article-slug}}.html`
2. **Update the listing page** (`index.html`):
   - Add a new published article card
   - Remove or convert any "Coming Soon" card for this part
   - Update the parts count badge
3. **Update the previous latest article**:
   - Add "Next" link in the `series-nav` pointing to the new part
4. **Update the new article**:
   - Add "Previous" link pointing to the former latest part
   - No "Next" link (it's now the latest)
5. **Verify** all Prev/Next links across affected articles

## Checklist

### For the Listing Page
- [ ] File at `/pages/series/{{SLUG}}/index.html`
- [ ] Hero with series icon, title, description, category back link, parts count badge
- [ ] Article cards for all published parts with tracking IDs
- [ ] Optional "Coming Soon" cards for planned parts
- [ ] Category page updated with link to listing page
- [ ] Cookie banner and footer from template

### For Each Article
- [ ] File at `/pages/series/{{SLUG}}/{{article-slug}}.html`
- [ ] **No `series-nav-path`** at top
- [ ] Back link points to `index.html` (listing page)
- [ ] Meta tags complete
- [ ] TOC matches all H2/H3 sections
- [ ] Content includes components as appropriate
- [ ] Code blocks independently executable
- [ ] Previous/Next nav at bottom
- [ ] Link to listing page in related posts
- [ ] Reading time calculated
- [ ] HTML validates

## Critical Rules

1. **No `series-nav-path`**: Ever-expanding series NEVER use the step-card navigation
2. **Listing page is the hub**: All articles link back to `index.html`, not the category page
3. **Layout**: ALWAYS use `col-lg-8 mx-auto` for article content
4. **No inline styles**: Use CSS classes from `main.css`
5. **No `<style>` blocks**: All CSS in `main.css`
6. **Category page**: Links to listing page, doesn't duplicate article cards
7. **Cookie banner + Footer**: Copy exact HTML from `.template-blog-post.html`
8. **PptxGenJS**: Use `unpkg.com/pptxgenjs@3.12.0/dist/pptxgen.bundle.js` — NOT jsdelivr
9. **Code independence**: Every code block self-contained and executable
10. **Update chain**: When adding a new part, update listing page + previous part's Next link
