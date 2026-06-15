"""Second pass: fix remaining fragmented KaTeX expressions in DSA recursion article."""
import re, os

fpath = 'pages/series/data-structures/dsa-recursion-complete-guide.html'
html = open(fpath, encoding='utf-8').read()
original = html

# Fix: \(T(n)\) = \(T(n/2)\) + \(O(1)\) → \(T(n) = T(n/2) + O(1)\)
html = html.replace(
    r'\(T(n)\) = \(T(n/2)\) + \(O(1)\)',
    r'\(T(n) = T(n/2) + O(1)\)'
)

# Fix: \(T(n)\) = \(T(n/2)\) + T(n/3) + n
html = html.replace(
    r'\(T(n)\) = \(T(n/2)\) + T(n/3) + n',
    r'\(T(n) = T(n/2) + T(n/3) + n\)'
)

# Fix: \(T(n)\) = T(n-1) + n
html = html.replace(
    r'\(T(n)\) = T(n-1) + n (use substitution instead)',
    r'\(T(n) = T(n-1) + n\) (use substitution instead)'
)

# Fix: \(T(n)\) = 2T(n/2) + n log n
html = html.replace(
    r'\(T(n)\) = 2T(n/2) + n log n (special case, use extended theorem)',
    r'\(T(n) = 2T(n/2) + n \log n\) (special case, use extended theorem)'
)

if html != original:
    open(fpath, 'w', encoding='utf-8').write(html)
    changes = sum(1 for a, b in zip(original.split('\n'), html.split('\n')) if a != b)
    print(f'  Fixed {changes} remaining fragmented expressions in recursion article')
else:
    print('  No remaining issues found')
