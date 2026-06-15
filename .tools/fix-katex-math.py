"""
Fix KaTeX math formatting in DSA series HTML files.
Handles:
1. Double-wrapped: \\(\\(O(n^{2})\\)\\) → \\(O(n^2)\\)
2. Mixed plain/KaTeX in single expression: \\(T(n)\\) = 2T(n/2) + \\(O(n)\\) → \\(T(n) = 2T(n/2) + O(n)\\)
3. Plain text Big-O in headings/paragraphs with <sup>: O(2<sup>n</sup>) → \\(O(2^n)\\)
4. Plain O(n²), O(n³) unicode superscripts → \\(O(n^2)\\), \\(O(n^3)\\)
5. Plain O(log⁡n) with invisible operator → \\(O(\\log n)\\)
6. T(n) = T(n<sup>k</sup>) patterns in list items
Only modifies content OUTSIDE <pre>/<code> blocks.
"""
import os
import re

target = 'pages/series/data-structures'

# Unicode superscript map
SUPERSCRIPTS = {'²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁰': '0', '¹': '1'}

def is_in_code_block(html, pos):
    """Check if position is inside a <pre> or <code> block."""
    # Find the most recent opening/closing pre or code tag before pos
    before = html[:pos]
    last_pre_open = before.rfind('<pre')
    last_pre_close = before.rfind('</pre>')
    last_code_open = before.rfind('<code')
    last_code_close = before.rfind('</code>')
    
    if last_pre_open > last_pre_close:
        return True
    if last_code_open > last_code_close:
        return True
    return False


def fix_double_wrapped(html):
    """Fix \\(\\(O(n^{2})\\)\\) → \\(O(n^2)\\)"""
    # Pattern: \(\( ... \)\)
    pattern = re.compile(r'\\\(\\\((.+?)\\\)\\\)')
    
    def replacer(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        return '\\(' + m.group(1) + '\\)'
    
    return pattern.sub(replacer, html)


def fix_fragmented_expressions(html):
    """Fix \\(T(n)\\) = 2T(n/2) + \\(O(n)\\) → \\(T(n) = 2T(n/2) + O(n)\\)
    
    Only in headings and <strong> tags where the whole thing is one expression.
    """
    # Pattern: \(T(n)\) = ... + \(O(...)\) in headings
    # Match: \(expr\) [=<>≤≥~] plaintext \(expr\)
    pattern = re.compile(
        r'\\\(T\(n\)\\\)\s*=\s*(\d+)?T\(n/(\d+)\)\s*\+\s*\\\(O\(([^)]+)\)\\\)'
    )
    
    def replacer(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        a = m.group(1) or ''
        b = m.group(2)
        f = m.group(3)
        return f'\\(T(n) = {a}T(n/{b}) + O({f})\\)'
    
    html = pattern.sub(replacer, html)
    
    # Also fix: \(T(n)\) = T(n/2) + \(O(1)\)  (a=1, implicit)
    pattern2 = re.compile(
        r'\\\(T\(n\)\\\)\s*=\s*T\(n/(\d+)\)\s*\+\s*\\\(O\(([^)]+)\)\\\)'
    )
    
    def replacer2(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        b = m.group(1)
        f = m.group(2)
        return f'\\(T(n) = T(n/{b}) + O({f})\\)'
    
    html = pattern2.sub(replacer2, html)
    
    # Fix: Result: \(T(n)\) = T(n log n) → Result: \(T(n) = \Theta(n \log n)\)
    pattern3 = re.compile(r'\\\(T\(n\)\\\)\s*=\s*T\(n\s*log\s*n\)')
    html = pattern3.sub(r'\\(T(n) = \\Theta(n \\log n)\\)', html)
    
    # Fix: Result: \(T(n)\) = T(log n)
    pattern4 = re.compile(r'\\\(T\(n\)\\\)\s*=\s*T\(log\s*n\)')
    html = pattern4.sub(r'\\(T(n) = \\Theta(\\log n)\\)', html)
    
    # Fix: Result: \(T(n)\) = T(n<sup>X</sup>) patterns
    pattern5 = re.compile(r'\\\(T\(n\)\\\)\s*=\s*T\(n<sup>([^<]+)</sup>\)')
    def replacer5(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        exp = m.group(1)
        return f'\\(T(n) = \\Theta(n^{{{exp}}})\\)'
    html = pattern5.sub(replacer5, html)
    
    return html


def fix_plain_big_o_sup(html):
    """Fix O(2<sup>n</sup>) → \\(O(2^n)\\) and O(n<sup>2</sup>) → \\(O(n^2)\\)"""
    # O(...<sup>...</sup>...) outside KaTeX
    pattern = re.compile(r'(?<!\\\()O\(([^<)]*)<sup>([^<]+)</sup>([^)]*)\)')
    
    def replacer(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        before = m.group(1)
        exp = m.group(2)
        after = m.group(3)
        # Build the KaTeX expression
        inner = before + '^{' + exp + '}' + after
        return '\\(O(' + inner + ')\\)'
    
    return pattern.sub(replacer, html)


def fix_plain_big_o_unicode(html):
    """Fix O(n²) → \\(O(n^2)\\), O(n³) → \\(O(n^3)\\)"""
    # Match O(...) with unicode superscripts, not already in \(...)
    pattern = re.compile(r'(?<!\\\()O\(([^)]*[²³⁴⁵⁰¹][^)]*)\)')
    
    def replacer(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        inner = m.group(1)
        # Replace unicode superscripts with ^{n}
        for uni, digit in SUPERSCRIPTS.items():
            inner = inner.replace(uni, '^{' + digit + '}')
        return '\\(O(' + inner + ')\\)'
    
    return pattern.sub(replacer, html)


def fix_plain_theta_unicode(html):
    """Fix Θ(n²) → \\(\\Theta(n^2)\\) etc."""
    pattern = re.compile(r'(?<!\\\()Θ\(([^)]*[²³⁴⁵⁰¹][^)]*)\)')
    
    def replacer(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        inner = m.group(1)
        for uni, digit in SUPERSCRIPTS.items():
            inner = inner.replace(uni, '^{' + digit + '}')
        return '\\(\\Theta(' + inner + ')\\)'
    
    return pattern.sub(replacer, html)


def fix_plain_log_operator(html):
    """Fix O(log⁡n) (with invisible U+2061 operator) → \\(O(\\log n)\\)"""
    # U+2061 is FUNCTION APPLICATION (invisible)
    pattern = re.compile(r'(?<!\\\()O\(log[\u2061\s]*n\)')
    
    def replacer(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        return '\\(O(\\log n)\\)'
    
    return pattern.sub(replacer, html)


def fix_n_sup_in_text(html):
    """Fix n<sup>k</sup> in text (not headings) to \\(n^k\\) when clearly math."""
    # Only target patterns like "= T(n<sup>k</sup>)" or "O(n<sup>..."
    # This is handled by fix_plain_big_o_sup already for O() patterns
    # Handle T(n<sup>...</sup>) patterns
    pattern = re.compile(r'(?<!\\\()T\(n<sup>([^<]+)</sup>\)')
    
    def replacer(m):
        if is_in_code_block(html, m.start()):
            return m.group(0)
        exp = m.group(1)
        return '\\(\\Theta(n^{' + exp + '})\\)'
    
    return pattern.sub(replacer, html)


def fix_standalone_plain_o(html):
    """Fix remaining plain O(n log n), O(n), O(1) etc. in headings (h3/h4)."""
    # Only in heading lines - find O(...) that aren't already KaTeX-wrapped
    lines = html.split('\n')
    result = []
    
    for line in lines:
        # Only process heading lines and <strong>Result lines
        if re.search(r'<h[34]|<strong>Result', line) and 'O(' in line and '\\(O(' not in line:
            # Don't touch if in code block context (check for pre/code in recent lines)
            # Replace O(n log n), O(n), O(1), O(log n), O(n²) etc.
            # But only if not already inside \(...\)
            
            def replace_plain_o(m):
                return '\\(' + m.group(0) + '\\)'
            
            # Match O(...) not preceded by \(
            line = re.sub(r'(?<!\\\()(?<!\\)O\(([^)<]+)\)', replace_plain_o, line)
        
        result.append(line)
    
    return '\n'.join(result)


def process_file(fpath):
    """Apply all KaTeX fixes to a file."""
    html = open(fpath, encoding='utf-8').read()
    original = html
    
    # Apply fixes in order
    html = fix_double_wrapped(html)
    html = fix_fragmented_expressions(html)
    html = fix_plain_big_o_sup(html)
    html = fix_plain_big_o_unicode(html)
    html = fix_plain_theta_unicode(html)
    html = fix_plain_log_operator(html)
    html = fix_n_sup_in_text(html)
    
    if html != original:
        open(fpath, 'w', encoding='utf-8').write(html)
        # Count changes
        changes = sum(1 for a, b in zip(original.split('\n'), html.split('\n')) if a != b)
        return changes
    return 0


# Process all DSA files
total_changes = 0
for fname in sorted(os.listdir(target)):
    if not fname.endswith('.html') or fname == 'assessment.html':
        continue
    fpath = os.path.join(target, fname)
    changes = process_file(fpath)
    if changes:
        print(f'  FIXED {fname}: {changes} lines updated')
        total_changes += changes

print(f'\nTotal: {total_changes} lines updated across all files.')
