"""
Add KaTeX CDN + convert inline math notation to KaTeX in DSA articles.
- Adds KaTeX CSS/JS to <head>
- Converts plain-text math (O(n²), Θ(n), etc.) to \(...\) in prose only
- Skips content inside <pre>, <code>, and attribute values
"""
import os
import re

TARGET = 'pages/series/data-structures'
SKIP = {'assessment.html'}

# KaTeX snippet to insert after prism-toolbar.min.css line
KATEX_BLOCK = """
    <!-- KaTeX Math Rendering -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '\\\\(', right: '\\\\)', display: false}]});"></script>
"""

# Math replacements: (plain text pattern -> KaTeX notation)
# Only applied OUTSIDE <pre>/<code> blocks
MATH_REPLACEMENTS = [
    # Greek letters used as notation names
    (r'Θ\(', r'\\(\\Theta('),   # Theta
    (r'Ω\(', r'\\(\\Omega('),   # Omega
    # Common Big-O expressions (standalone, not inside code)
    # These need careful regex to avoid matching inside code blocks
]

def add_katex_cdn(html):
    """Add KaTeX CDN to <head> if not already present."""
    if 'katex' in html:
        return html, False
    
    # Insert after prism-toolbar.min.css
    marker = 'prism-toolbar.min.css" />'
    idx = html.find(marker)
    if idx == -1:
        # Try after main.css
        marker = 'main.css"'
        idx = html.find(marker)
        if idx == -1:
            return html, False
    
    insert_pos = html.find('\n', idx) + 1
    html = html[:insert_pos] + KATEX_BLOCK + html[insert_pos:]
    return html, True


def convert_math_in_prose(html):
    """Convert plain-text math notation to KaTeX in prose content only.
    
    Strategy: Split HTML into "safe" zones (prose) and "skip" zones (code/pre/attributes).
    Only transform text in safe zones.
    """
    changes = 0
    
    # Split into segments: inside <pre>...</pre> or <code>...</code> vs outside
    # We'll process only text nodes outside these elements
    
    # Pattern to split on code/pre blocks (including their content)
    code_pattern = re.compile(r'(<(?:pre|code)[^>]*>.*?</(?:pre|code)>)', re.DOTALL | re.IGNORECASE)
    
    parts = code_pattern.split(html)
    
    new_parts = []
    for i, part in enumerate(parts):
        # Odd indices are code/pre blocks - skip them
        if i % 2 == 1:
            new_parts.append(part)
            continue
        
        # Also skip content inside HTML attributes (alt="...", title="...", content="...")
        # We'll be more careful: only replace in text content between > and <
        
        original = part
        
        # Convert complexity notations in prose text
        # O(n²) -> \(O(n^2)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(n²\)(?![^<]*</code)', r'\\(O(n^2)\\)', part)
        # O(n³) -> \(O(n^3)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(n³\)(?![^<]*</code)', r'\\(O(n^3)\\)', part)
        # O(n log n) -> \(O(n \log n)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(n log n\)(?![^<]*</code)', r'\\(O(n \\log n)\\)', part)
        part = re.sub(r'(?<![<"\'/=\w])O\(n\s*log\s*n\)(?![^<]*</code)', r'\\(O(n \\log n)\\)', part)
        # O(log n) -> \(O(\log n)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(log n\)(?![^<]*</code)', r'\\(O(\\log n)\\)', part)
        part = re.sub(r'(?<![<"\'/=\w])O\(log₂ n\)(?![^<]*</code)', r'\\(O(\\log_2 n)\\)', part)
        # O(1) -> \(O(1)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(1\)(?![^<]*</code)', r'\\(O(1)\\)', part)
        # O(n) -> \(O(n)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(n\)(?![^<]*</code)', r'\\(O(n)\\)', part)
        # O(V + E) -> \(O(V + E)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(V \+ E\)(?![^<]*</code)', r'\\(O(V + E)\\)', part)
        part = re.sub(r'(?<![<"\'/=\w])O\(V\+E\)(?![^<]*</code)', r'\\(O(V + E)\\)', part)
        # O(E log V) -> \(O(E \log V)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(E log V\)(?![^<]*</code)', r'\\(O(E \\log V)\\)', part)
        # O(2^n) / O(2ⁿ) -> \(O(2^n)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(2\^n\)(?![^<]*</code)', r'\\(O(2^n)\\)', part)
        part = re.sub(r'(?<![<"\'/=\w])O\(2ⁿ\)(?![^<]*</code)', r'\\(O(2^n)\\)', part)
        # O(n!) -> \(O(n!)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(n!\)(?![^<]*</code)', r'\\(O(n!)\\)', part)
        # O(mn) -> \(O(mn)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(mn\)(?![^<]*</code)', r'\\(O(mn)\\)', part)
        # O(n + m) -> \(O(n + m)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(n \+ m\)(?![^<]*</code)', r'\\(O(n + m)\\)', part)
        # O(n × m) -> \(O(n \times m)\)
        part = re.sub(r'(?<![<"\'/=\w])O\(n × m\)(?![^<]*</code)', r'\\(O(n \\times m)\\)', part)
        # O(√n) -> \(O(\sqrt{n})\)
        part = re.sub(r'(?<![<"\'/=\w])O\(√n\)(?![^<]*</code)', r'\\(O(\\sqrt{n})\\)', part)
        # O(n^k) for any digit k
        part = re.sub(r'(?<![<"\'/=\w])O\(n\^(\d+)\)(?![^<]*</code)', r'\\(O(n^{\1})\\)', part)
        # O(k) standalone
        part = re.sub(r'(?<![<"\'/=\w])O\(k\)(?![^<]*</code)', r'\\(O(k)\\)', part)
        # O(n/k) 
        part = re.sub(r'(?<![<"\'/=\w])O\(n/k\)(?![^<]*</code)', r'\\(O(n/k)\\)', part)
        
        # Theta notation: Θ(n) -> \(\Theta(n)\)
        part = re.sub(r'Θ\(([^)]+)\)', lambda m: f'\\(\\Theta({m.group(1)})\\)', part)
        # Omega notation: Ω(n) -> \(\Omega(n)\)
        part = re.sub(r'Ω\(([^)]+)\)', lambda m: f'\\(\\Omega({m.group(1)})\\)', part)
        
        # T(n) recurrence: T(n) -> \(T(n)\) (only in prose context)
        part = re.sub(r'(?<![<"\'/=\w])T\(n\)(?![^<]*</code)', r'\\(T(n)\\)', part)
        part = re.sub(r'(?<![<"\'/=\w])T\(n/2\)(?![^<]*</code)', r'\\(T(n/2)\\)', part)
        
        # α(n) inverse ackermann
        part = re.sub(r'α\(n\)', r'\\(\\alpha(n)\\)', part)
        
        # log₂ -> \(\log_2\)  (standalone)
        part = re.sub(r'(?<![<"\'/=\w])log₂\s*n(?![^<]*</code)', r'\\(\\log_2 n\\)', part)
        
        # n² standalone (not inside O())
        # Only if it appears as a standalone term in text
        
        if part != original:
            changes += part.count('\\(') - original.count('\\(')
        
        new_parts.append(part)
    
    return ''.join(new_parts), changes


def process_file(fpath):
    """Process a single file: add KaTeX CDN and convert math notation."""
    html = open(fpath, encoding='utf-8').read()
    fname = os.path.basename(fpath)
    
    # Step 1: Add KaTeX CDN
    html, cdn_added = add_katex_cdn(html)
    
    # Step 2: Convert math in prose
    html, math_changes = convert_math_in_prose(html)
    
    if cdn_added or math_changes > 0:
        open(fpath, 'w', encoding='utf-8').write(html)
        status = []
        if cdn_added:
            status.append("KaTeX CDN added")
        if math_changes > 0:
            status.append(f"{math_changes} math expressions converted")
        print(f"  UPDATED {fname}: {', '.join(status)}")
    else:
        print(f"  SKIP    {fname}: no changes needed")
    
    return cdn_added, math_changes


def main():
    total_cdn = 0
    total_math = 0
    
    print("=" * 60)
    print("  Adding KaTeX to DSA Series")
    print("=" * 60)
    print()
    
    for fname in sorted(os.listdir(TARGET)):
        if not fname.endswith('.html') or fname in SKIP:
            continue
        fpath = os.path.join(TARGET, fname)
        cdn, math = process_file(fpath)
        total_cdn += cdn
        total_math += math
    
    print()
    print(f"  Summary: {total_cdn} files got KaTeX CDN, {total_math} total math conversions")


if __name__ == '__main__':
    main()
