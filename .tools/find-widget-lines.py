"""Find widget open/close line numbers in heaps file."""
html = open('pages/series/data-structures/dsa-heaps-sorting-hashing.html', encoding='utf-8').read()
lines = html.split('\n')

for i, line in enumerate(lines, 1):
    if '<!-- /.code-widget -->' in line:
        print(f'  Close widget at line {i}')
    if '<div class="code-widget">' in line:
        print(f'  Open widget at line {i}')
    if '<!-- /.panels-stack -->' in line:
        print(f'  Close panels at line {i}')
    if '<div class="panels-stack">' in line:
        print(f'  Open panels at line {i}')
