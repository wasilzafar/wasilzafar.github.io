"""Dry-run: show which DSA articles need series-next callouts."""
import os, re

target = 'pages/series/data-structures'
skip = {'assessment.html', 'dsa-advanced-structures-trie-unionfind-segment.html',
        'dsa-amortized-analysis-dynamic-growth.html', 'dsa-interview-pattern-recognition.html'}

print('=== Files WITH series-next ===')
for fname in sorted(os.listdir(target)):
    if not fname.endswith('.html') or fname in skip:
        continue
    html = open(os.path.join(target, fname), encoding='utf-8').read()
    if 'series-next' in html:
        m = re.search(r'<div class="series-next">(.*?)</div>', html, re.DOTALL)
        snippet = m.group(1).strip()[:120] if m else '(found but no regex match)'
        print(f'  HAS: {fname}')
        print(f'       {snippet}...')
        print()

print()
print('=== Files WITHOUT series-next (main parts only) ===')
for fname in sorted(os.listdir(target)):
    if not fname.endswith('.html') or fname in skip:
        continue
    html = open(os.path.join(target, fname), encoding='utf-8').read()
    if 'series-next' not in html:
        print(f'  MISSING: {fname}')
