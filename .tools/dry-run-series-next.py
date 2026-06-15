"""Dry-run: show what series-next callouts will be added to DSA articles."""
import os

target = 'pages/series/data-structures'

# Series order: (part, filename, title, short_desc_for_callout)
series = [
    (1, 'dsa-foundations-memory-complexity.html', 'Foundations, Memory & Complexity',
     "we'll master recursion patterns \u2014 the foundation for divide-and-conquer, tree traversals, and dynamic programming that powers the rest of this series."),
    (2, 'dsa-recursion-complete-guide.html', 'Recursion Complete Guide',
     "we'll apply our recursion skills to arrays \u2014 the most fundamental data structure \u2014 covering static/dynamic arrays, ADT operations, and the two-pointer/sliding-window patterns essential for interviews."),
    (3, 'dsa-arrays-adt-operations.html', 'Arrays & Array ADT',
     "we'll explore string algorithms \u2014 pattern matching (KMP, Rabin-Karp), manipulation techniques, and encoding \u2014 building on the array foundations from this part."),
    (4, 'dsa-strings-manipulation.html', 'Strings',
     "we'll extend arrays into two dimensions with matrices \u2014 covering sparse representations, special matrices, and the traversal patterns that appear in graph and DP problems."),
    (5, 'dsa-matrices-special-sparse.html', 'Matrices',
     "we'll move from contiguous memory to pointer-based structures with linked lists \u2014 singly, doubly, and circular variants plus the manipulation techniques interviewers love."),
    (6, 'dsa-linked-lists-guide.html', 'Linked Lists',
     "we'll use linked-list nodes to build stacks \u2014 the LIFO structure behind expression evaluation, parenthesis matching, and backtracking algorithms."),
    (7, 'dsa-stack-applications.html', 'Stack',
     "we'll complement the stack with queues \u2014 FIFO, circular, deque, and priority queue implementations that power BFS, scheduling, and sliding-window problems."),
    (8, 'dsa-queue-implementations.html', 'Queue', ''),  # already has it
    (9, 'dsa-trees-fundamentals.html', 'Trees', ''),  # already has it
    (10, 'dsa-bst-avl-redblack.html', 'BST & Balanced Trees', ''),  # already has it
    (11, 'dsa-heaps-sorting-hashing.html', 'Heaps, Sorting & Hashing', ''),  # already has it
    (12, 'dsa-graphs-dp-greedy-backtracking.html', 'Graphs, DP, Greedy & Backtracking', ''),
]

print('=== DRY RUN: series-next callouts to add ===\n')
to_add = []

for i, (part, fname, title, callout_text) in enumerate(series):
    if part == 12:
        continue  # Last part, no next
    fpath = os.path.join(target, fname)
    html = open(fpath, encoding='utf-8').read()
    if 'series-next' in html:
        print(f'  SKIP Part {part:2d} ({fname}) -- already has series-next')
        continue

    # Next part info
    next_part, next_fname, next_title, _ = series[i + 1]

    # Find where related-posts starts
    rp_idx = html.find('class="related-posts"')
    if rp_idx == -1:
        print(f'  ERROR Part {part:2d} ({fname}) -- no related-posts found!')
        continue

    line_num = html[:rp_idx].count('\n') + 1
    print(f'  ADD  Part {part:2d} ({fname}) before line {line_num}')
    print(f'       \u2192 Next: Part {next_part}: {next_title}')
    print(f'       \u2192 File: {next_fname}')
    print(f'       \u2192 Text: {callout_text[:80]}...')
    print()
    to_add.append((fname, next_part, next_fname, next_title, callout_text))

print(f'\nSummary: {len(to_add)} callouts to add, 4 already exist, Part 12 is last (no next)')
