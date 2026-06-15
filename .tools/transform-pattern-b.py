#!/usr/bin/env python3
"""
Transform code triplets (Python + C++ + Java) into multi-language code widgets.

Handles TWO patterns found in DSA articles:

Pattern A (icon headings on all three):
    <h4><i class="fab fa-python ..."></i>Python</h4>
    <pre><code class="language-python">...</code></pre>
    <h4><i class="fab fa-cuttlefish ..."></i>C++</h4>
    <pre><code class="language-cpp">...</code></pre>
    <h4><i class="fab fa-java ..."></i>Java</h4>
    <pre><code class="language-java">...</code></pre>

Pattern B (Python block has NO icon heading, C++ and Java do):
    <pre><code class="language-python">...</code></pre>
    <h4><i class="fab fa-cuttlefish ..."></i>C++</h4>
    <pre><code class="language-cpp">...</code></pre>
    <h4><i class="fab fa-java ..."></i>Java</h4>
    <pre><code class="language-java">...</code></pre>

Both patterns produce the same widget output.
"""
import re
import sys
import os

# ─── Pattern B: bare Python code block followed by C++ h-tag + code + Java h-tag + code ───
# This is the harder pattern. We look for:
#   <pre><code class="language-python">...CODE...</code></pre>
#   [optional whitespace]
#   <h[3-6]><i class="fab fa-cuttlefish..."></i>...</h[3-6]>
#   <pre><code class="language-cpp">...CODE...</code></pre>
#   [optional whitespace]
#   <h[3-6]><i class="fab fa-java..."></i>...</h[3-6]>
#   <pre><code class="language-java">...CODE...</code></pre>
#
# But we must NOT match if there's already a code-widget wrapping it, or if there's
# a Python icon heading before the python <pre> (that's Pattern A, handled separately).

PATTERN_B = re.compile(
    r'(?<!</div>\n)'  # Negative lookbehind: not already inside a widget panel
    r'(<pre><code class="language-python">(.*?)</code></pre>)'
    r'\s*\n\s*'
    r'<h[3-6][^>]*>\s*<i\s+class="fab fa-cuttlefish[^"]*"></i>[^<]*</h[3-6]>\s*\n'
    r'(<pre><code class="language-cpp">(.*?)</code></pre>)'
    r'\s*\n\s*'
    r'<h[3-6][^>]*>\s*<i\s+class="fab fa-java[^"]*"></i>[^<]*</h[3-6]>\s*\n'
    r'(<pre><code class="language-java">(.*?)</code></pre>)',
    re.DOTALL
)


def build_widget(python_block, cpp_block, java_block):
    """Build a code-widget from three pre>code blocks."""
    return (
        '<div class="code-widget">\n'
        '    <div class="lang-tabs">\n'
        '        <button class="lang-tab active" data-lang="python">Python</button>\n'
        '        <button class="lang-tab" data-lang="cpp">C++</button>\n'
        '        <button class="lang-tab" data-lang="java">Java</button>\n'
        '    </div>\n'
        '    <div class="panels-stack">\n'
        '\n'
        '    <div class="lang-panel active" data-panel="python">\n'
        f'{python_block}\n'
        '    </div>\n'
        '\n'
        '    <div class="lang-panel" data-panel="cpp">\n'
        f'{cpp_block}\n'
        '    </div>\n'
        '\n'
        '    <div class="lang-panel" data-panel="java">\n'
        f'{java_block}\n'
        '    </div>\n'
        '\n'
        '    </div><!-- /.panels-stack -->\n'
        '</div><!-- /.code-widget -->'
    )


def is_inside_widget(html, match_start):
    """Check if this match position is already inside a code-widget."""
    # Look backward for the nearest code-widget open/close
    before = html[:match_start]
    last_open = before.rfind('<div class="code-widget">')
    last_close = before.rfind('</div><!-- /.code-widget -->')
    if last_open > last_close:
        return True  # We're inside an unclosed widget
    return False


def has_python_icon_before(html, match_start):
    """Check if there's a Python icon heading within 200 chars before the match."""
    before = html[max(0, match_start - 200):match_start]
    return 'fab fa-python' in before


def transform_pattern_b(html):
    """Transform Pattern B triplets (bare Python + C++/Java with icons)."""
    count = 0
    offset = 0

    while True:
        m = PATTERN_B.search(html, offset)
        if not m:
            break

        # Skip if already inside a widget or if Python has its own icon heading
        if is_inside_widget(html, m.start()) or has_python_icon_before(html, m.start()):
            offset = m.end()
            continue

        python_block = m.group(1)
        cpp_block = m.group(3)
        java_block = m.group(5)

        widget = build_widget(python_block, cpp_block, java_block)
        html = html[:m.start()] + widget + html[m.end():]
        offset = m.start() + len(widget)
        count += 1

    return html, count


def process_file(filepath, dry_run=False):
    """Process a single file."""
    html = open(filepath, encoding='utf-8').read()

    # Only transform Pattern B (Pattern A was already handled by the previous script)
    new_html, count = transform_pattern_b(html)

    if count > 0:
        if dry_run:
            print(f'  [DRY-RUN] {count} triplet(s) in {filepath}')
        else:
            open(filepath, 'w', encoding='utf-8').write(new_html)
            print(f'  Transformed {count} triplet(s) in {filepath}')
    return count


def main():
    dry_run = '--dry-run' in sys.argv

    target_dir = 'pages/series/data-structures'
    if not os.path.isdir(target_dir):
        print(f'ERROR: Directory not found: {target_dir}')
        sys.exit(1)

    total = 0
    files_changed = 0
    for fname in sorted(os.listdir(target_dir)):
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(target_dir, fname)
        count = process_file(fpath, dry_run=dry_run)
        if count > 0:
            total += count
            files_changed += 1

    print(f'\nDone: {total} widget(s) created across {files_changed} file(s).')


if __name__ == '__main__':
    main()
