"""Add series-next callouts to DSA articles that are missing them."""
import os

target = 'pages/series/data-structures'

# (part, filename, next_part, next_file, next_title, callout_text)
insertions = [
    (1, 'dsa-foundations-memory-complexity.html', 2, 'dsa-recursion-complete-guide.html', 'Recursion Complete Guide',
     "we\u2019ll master recursion patterns \u2014 the foundation for divide-and-conquer, tree traversals, and dynamic programming that powers the rest of this series."),
    (2, 'dsa-recursion-complete-guide.html', 3, 'dsa-arrays-adt-operations.html', 'Arrays &amp; Array ADT',
     "we\u2019ll apply our recursion skills to arrays \u2014 the most fundamental data structure \u2014 covering static/dynamic arrays, ADT operations, and the two-pointer/sliding-window patterns essential for interviews."),
    (3, 'dsa-arrays-adt-operations.html', 4, 'dsa-strings-manipulation.html', 'Strings',
     "we\u2019ll explore string algorithms \u2014 pattern matching (KMP, Rabin-Karp), manipulation techniques, and encoding \u2014 building on the array foundations from this part."),
    (4, 'dsa-strings-manipulation.html', 5, 'dsa-matrices-special-sparse.html', 'Matrices',
     "we\u2019ll extend arrays into two dimensions with matrices \u2014 covering sparse representations, special matrices, and the traversal patterns that appear in graph and DP problems."),
    (5, 'dsa-matrices-special-sparse.html', 6, 'dsa-linked-lists-guide.html', 'Linked Lists',
     "we\u2019ll move from contiguous memory to pointer-based structures with linked lists \u2014 singly, doubly, and circular variants plus the manipulation techniques interviewers love."),
    (6, 'dsa-linked-lists-guide.html', 7, 'dsa-stack-applications.html', 'Stack',
     "we\u2019ll use linked-list nodes to build stacks \u2014 the LIFO structure behind expression evaluation, parenthesis matching, and backtracking algorithms."),
    (7, 'dsa-stack-applications.html', 8, 'dsa-queue-implementations.html', 'Queue',
     "we\u2019ll complement the stack with queues \u2014 FIFO, circular, deque, and priority queue implementations that power BFS, scheduling, and sliding-window problems."),
]

for part, fname, next_part, next_file, next_title, text in insertions:
    fpath = os.path.join(target, fname)
    html = open(fpath, encoding='utf-8').read()

    marker = 'class="related-posts"'
    idx = html.find(marker)
    if idx == -1:
        print(f'  ERROR: {fname} - no related-posts found')
        continue

    # Find the opening <div of related-posts
    div_start = html.rfind('<div', 0, idx)

    # Find the start of the line with that <div
    line_start = html.rfind('\n', 0, div_start) + 1

    # Check if there's a comment line above (like <!-- Related Posts -->)
    prev_newline = html.rfind('\n', 0, line_start - 1)
    prev_line = html[prev_newline + 1:line_start - 1].strip()
    if prev_line.startswith('<!--'):
        # Insert before the comment
        insert_pos = prev_newline + 1
    else:
        insert_pos = line_start

    callout = (
        '                        <!-- Next in Series -->\n'
        '                        <div class="series-next">\n'
        '                            <h4><i class="fas fa-arrow-right me-2"></i>Next in the Series</h4>\n'
        f'                            <p>In <a href="{next_file}"><strong>Part {next_part}: {next_title}</strong></a>, {text}</p>\n'
        '                        </div>\n'
        '\n'
    )

    html = html[:insert_pos] + callout + html[insert_pos:]
    open(fpath, 'w', encoding='utf-8').write(html)
    print(f'  DONE: Part {part} ({fname}) -> Next: Part {next_part}: {next_title}')

print(f'\nAll {len(insertions)} insertions complete.')
