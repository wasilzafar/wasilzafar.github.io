"""Check for remaining plain-text math notation outside code blocks."""
import os, re

target = 'pages/series/data-structures'
issues = []

for fname in sorted(os.listdir(target)):
    if not fname.endswith('.html') or fname == 'assessment.html':
        continue
    html = open(os.path.join(target, fname), encoding='utf-8').read()
    
    # Split by <pre> blocks to avoid code
    parts = re.split(r'<pre[^>]*>.*?</pre>', html, flags=re.DOTALL)
    
    for part in parts:
        # Also skip <code> inline and <script> blocks
        clean = re.sub(r'<code[^>]*>.*?</code>', '', part, flags=re.DOTALL)
        clean = re.sub(r'<script[^>]*>.*?</script>', '', clean, flags=re.DOTALL)
        
        # Find O() with unicode superscripts (²³)
        for m in re.finditer(r'O\([^)]*[\u00b2\u00b3\u2074\u2075][^)]*\)', clean):
            ctx = clean[max(0, m.start()-30):m.end()+10].replace('\n', ' ').strip()
            issues.append((fname, 'unicode-sup', ctx[:100]))
        
        # Find bare Θ() with unicode superscripts
        for m in re.finditer(r'\u0398\([^)]*[\u00b2\u00b3][^)]*\)', clean):
            ctx = clean[max(0, m.start()-30):m.end()+10].replace('\n', ' ').strip()
            issues.append((fname, 'theta-unicode', ctx[:100]))
        
        # Find O(n log n) not wrapped in \(
        for m in re.finditer(r'(?<!\\)O\(n\s*log\s*n\)', clean):
            ctx = clean[max(0, m.start()-30):m.end()+10].replace('\n', ' ').strip()
            if 'Math.log' not in ctx and 'label:' not in ctx:
                issues.append((fname, 'O(n log n)', ctx[:100]))

if issues:
    print(f'Found {len(issues)} remaining issues:\n')
    for fname, kind, ctx in issues:
        print(f'  [{kind}] {fname}')
        print(f'    {ctx}')
        print()
else:
    print('No remaining plain-text math issues found outside code blocks!')
