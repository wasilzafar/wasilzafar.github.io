"""Move series-nav-path to top of blog-content (before introduction) in all DSA main parts."""
import os
import re

target = 'pages/series/data-structures'
skip = {'assessment.html', 'dsa-advanced-structures-trie-unionfind-segment.html',
        'dsa-amortized-analysis-dynamic-growth.html', 'dsa-interview-pattern-recognition.html'}

moved = 0

for fname in sorted(os.listdir(target)):
    if not fname.endswith('.html') or fname in skip:
        continue
    fpath = os.path.join(target, fname)
    html = open(fpath, encoding='utf-8').read()

    if 'series-nav-path' not in html:
        continue

    # Extract the series-nav-path block (including surrounding whitespace)
    # Pattern: starts with <div class="series-nav-path"> and ends with matching </div>
    # We need to find the outer div that contains path-steps
    nav_start = html.find('<div class="series-nav-path">')
    if nav_start == -1:
        print(f'  SKIP {fname}: no series-nav-path found')
        continue

    # Find the line start (for proper indentation extraction)
    line_start = html.rfind('\n', 0, nav_start) + 1

    # Find closing </div> — count nested divs
    depth = 0
    pos = nav_start
    nav_end = -1
    while pos < len(html):
        next_open = html.find('<div', pos)
        next_close = html.find('</div>', pos)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                nav_end = next_close + len('</div>')
                break
            pos = next_close + 6

    if nav_end == -1:
        print(f'  ERROR {fname}: could not find closing div for series-nav-path')
        continue

    # Include trailing newline(s)
    while nav_end < len(html) and html[nav_end] in '\r\n':
        nav_end += 1

    # Check if there's a blank line before the nav-path
    # Trim any blank line above it
    check_pos = line_start - 1
    while check_pos > 0 and html[check_pos - 1] in ' \t':
        check_pos -= 1
    if check_pos > 0 and html[check_pos - 1] == '\n':
        # There's a blank line before, include it in the removal
        line_start = check_pos

    # Extract the nav block
    nav_block = html[html.rfind('\n', 0, html.find('<div class="series-nav-path">')) + 1:nav_end]

    # Remove it from its current position
    html_without = html[:line_start] + html[nav_end:]

    # Find the insertion point: right after <div class="blog-content">
    blog_content_marker = '<div class="blog-content">'
    bc_idx = html_without.find(blog_content_marker)
    if bc_idx == -1:
        print(f'  ERROR {fname}: no blog-content found')
        continue

    insert_pos = bc_idx + len(blog_content_marker)
    # Skip past the newline after blog-content
    if html_without[insert_pos:insert_pos + 1] == '\n':
        insert_pos += 1
    elif html_without[insert_pos:insert_pos + 2] == '\r\n':
        insert_pos += 2

    # Build the insertion: blank line + nav block + blank line
    insertion = '\n' + nav_block.rstrip() + '\n\n'

    html_final = html_without[:insert_pos] + insertion + html_without[insert_pos:]

    open(fpath, 'w', encoding='utf-8').write(html_final)
    moved += 1

    # Report new position
    new_nav_line = html_final[:html_final.find('series-nav-path')].count('\n') + 1
    print(f'  MOVED {fname}: series-nav-path now at line {new_nav_line}')

print(f'\nDone: moved nav-path in {moved} file(s).')
