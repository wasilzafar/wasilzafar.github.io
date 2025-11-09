# Wasil Zafar - Portfolio Website

Welcome to my modernised portfolio website built with **Bootstrap 5**, featuring a responsive design, smooth animations, and professional styling.

I'm a technology enthusiast with a passion for creating innovative solutions. This website showcases my projects, skills, and experiences in the tech industry.

Want to know more? Visit [Wasil Zafar](https://www.linkedin.com/in/wasilzafar/) to explore!

---

## Blog Infrastructure Documentation

This section outlines the standardized blog post structure and guidelines for maintaining consistency across the wasilzafar.github.io blog. All new articles should follow these conventions.

### File Structure

Blog posts are organized by year and month:

```
/pages/
├── 2024/
│   └── 03/
│       └── article-slug.html
└── 2025/
    ├── 10/
    │   ├── philosophy-glossary.html
    │   └── poetry-article.html
    └── 11/
        └── psychology-experiments-cognitive-biases.html
```

**Path Convention:** `/pages/YYYY/MM/article-slug.html`

### HTML Structure

#### Essential Sections (in order)

1. **Head Metadata**
   - UTF-8 charset
   - Viewport meta tag
   - SEO meta tags (description, keywords)
   - Open Graph tags for social sharing
   - Article-specific metadata (publish_time, author, section)

2. **Navigation Bar**
   - Consistent navbar with links to Home, About, Interests, and current category

3. **Blog Hero Section**
   - Back link to category page
   - Article title (display-4)
   - Blog metadata (date, author, reading time)
   - Brief article subtitle/description

4. **Main Content Section**
   - Table of Contents (toc-box)
   - Article body with h2 and h3 headings
   - Key insights in highlight-box divs
   - Case studies/examples in experiment-card divs
   - Tags using bias-tag class

5. **Related Posts Section**
   - Links to 2-3 related articles
   - Brief descriptions

6. **Footer**
   - Social media links
   - Publication info and last update

### CSS Classes & Styling

#### Box Components

**Highlight Box** - For key insights and important takeaways:
```html
<div class="highlight-box">
    <strong><i class="fas fa-lightbulb me-2"></i>Key Insight:</strong> [Content]
</div>
```

**Experiment Card** - For case studies, research findings, or detailed examples:
```html
<div class="experiment-card">
    <h4><i class="fas fa-book me-2"></i>[Title]</h4>
    <div class="meta">[Author, Date, Location]</div>
    <p>[Content]</p>
    <span class="bias-tag">[Tag]</span>
</div>
```

**Table of Contents Box** - Always include at top of content:
```html
<div class="toc-box">
    <h4><i class="fas fa-list me-2"></i>Table of Contents</h4>
    <ul>
        <li><a href="#section-id">Section Name</a></li>
    </ul>
</div>
```

#### Tag Classes

**Bias/Topic Tags** - For categorizing content:
```html
<span class="bias-tag">Cognitive Bias Name</span>
```

### Color Palette

All colors are defined in `/css/main.css` and should be referenced as CSS variables:

- `--color-crimson: #BF092F` - Primary accent, highlights
- `--color-navy: #132440` - Dark text, headings
- `--color-blue: #16476A` - Secondary accent
- `--color-teal: #3B9797` - Links, highlights, borders
- `--color-light: #f8f9fa` - Light backgrounds
- `--color-white: #ffffff` - White

### Metadata Guidelines

#### Title Tag
- 50-60 characters
- Include primary keyword
- Format: "Article Title | Wasil Zafar" (optional)

#### Meta Description
- 155-160 characters
- Include primary keyword
- Call to action preferred

#### Keywords
- 5-8 relevant keywords
- Comma-separated
- Include variations and long-tail keywords

#### Open Graph Tags
```html
<meta property="og:title" content="[Article Title]" />
<meta property="og:description" content="[Description]" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="YYYY-MM-DD" />
<meta property="article:author" content="Wasil Zafar" />
<meta property="article:section" content="Psychology" />
```

### Content Guidelines

#### Article Structure

1. **Introduction** (100-150 words)
   - Hook the reader
   - Establish relevance
   - Preview main points

2. **Main Sections** (3-5 sections)
   - Use h2 for section headings
   - Use h3 for subsections
   - 200-400 words per section
   - Include 1-2 supporting elements (cards, highlights, examples)

3. **Conclusion** (100-150 words)
   - Summarize key takeaways
   - Call to action or reflection
   - Link to related topics

#### Writing Standards

- **Tone:** Professional but conversational
- **Readability:**
  - Max 3-4 sentences per paragraph
  - Short sentences preferred
  - Active voice
  - Justified text alignment in blog-content class

- **Word Count:**
  - Minimum: 1,200 words
  - Target: 1,500-2,000 words
  - Reading time: 12-15 minutes

- **Links:**
  - Internal links to related articles
  - External links with `target="_blank"`
  - No more than 3-4 external links per 1000 words

### Reading Time Calculation

Reading time is estimated based on average reading speed of 200 words per minute:

- 1,200 words ≈ 6 min
- 1,500 words ≈ 7-8 min
- 2,000 words ≈ 10 min
- 2,400 words ≈ 12 min

### Relative Paths

From blog article location (`/pages/YYYY/MM/article.html`):

- To root: `../../../`
- To CSS: `../../../css/main.css`
- To JS: `../../../js/main.js`
- To images: `../../../images/...`
- To category page: `../../categories/[category].html`

### Updating Category Pages

When adding a new article, update the corresponding category page with:

1. Article card in the "Latest Articles" section
2. Card includes:
   - Title (linked to article)
   - Publication date
   - Reading time
   - Brief description (2-3 sentences)
   - 2-4 topic tags
   - "Read Article" button

Example (from psychology.html):
```html
<div class="card mb-4 shadow-sm border-0">
    <div class="card-body">
        <h3 class="card-title h5">
            <a href="../../2025/11/article-slug.html">Article Title</a>
        </h3>
        <div class="small text-muted mb-3">
            <i class="fas fa-calendar me-1"></i>November 9, 2025
            <span class="ms-3"><i class="fas fa-clock me-1"></i>12 min read</span>
        </div>
        <p class="card-text">Description...</p>
        <div class="mb-3">
            <span class="badge bg-light text-dark">Tag 1</span>
            <span class="badge bg-light text-dark">Tag 2</span>
        </div>
        <a href="../../2025/11/article-slug.html" class="btn btn-sm btn-outline-primary">
            Read Article <i class="fas fa-arrow-right ms-2"></i>
        </a>
    </div>
</div>
```

### SEO Best Practices

1. **Headings:**
   - One h1 per page (the article title)
   - Logical h2/h3 hierarchy
   - Include keywords in headings naturally

2. **Images:**
   - Add alt text to all images
   - Use descriptive filenames
   - Optimize for web (compress)

3. **Links:**
   - Use descriptive anchor text
   - Link to related content
   - Internal linking improves SEO

4. **Accessibility:**
   - Semantic HTML
   - ARIA labels where needed
   - Color contrast ratios met

### Using the Blog Template

Use `.template-blog-post.html` as a starting point. Replace placeholders:

- `[ADD ARTICLE TITLE]` - Article title (all caps sections)
- `[CATEGORY]` - Back link category
- `[Month Day, Year]` - Publication date
- `[X] min read` - Reading time estimate
- `[Your content here]` - Main article content

### Quality Checklist

Before publishing, verify:

- [ ] All meta tags are properly filled
- [ ] Table of contents links work correctly
- [ ] Reading time is accurate
- [ ] Images have alt text
- [ ] External links open in new tab
- [ ] Internal links use correct relative paths
- [ ] All text is justified in blog-content
- [ ] At least 2-3 highlight or card elements
- [ ] Related posts are relevant
- [ ] No typos or grammatical errors
- [ ] Category page updated with article card
- [ ] File placed in correct YYYY/MM/ folder

### Future Enhancements

Planned improvements to blog infrastructure:

1. Dynamic category page generation
2. Search functionality
3. Comment system
4. Article archives/chronological listing
5. Author bio section
6. Newsletter signup integration
7. Social sharing buttons
8. Reading progress indicator
9. "Share this article" feature
10. Tag-based filtering
