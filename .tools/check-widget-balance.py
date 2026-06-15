"""Check code-widget div balance in DSA articles."""
import os

target = 'pages/series/data-structures'
for fname in sorted(os.listdir(target)):
    if not fname.endswith('.html') or fname == 'assessment.html':
        continue
    fpath = os.path.join(target, fname)
    html = open(fpath, encoding='utf-8').read()
    opens = html.count('<div class="code-widget">')
    closes = html.count('</div><!-- /.code-widget -->')
    panels_open = html.count('<div class="panels-stack">')
    panels_close = html.count('</div><!-- /.panels-stack -->')
    lang_panel_open = html.count('<div class="lang-panel')
    # Each lang-panel closes with </div> before panels-stack close
    # Check total div balance
    total_divs_open = html.count('<div')
    total_divs_close = html.count('</div>')
    div_diff = total_divs_open - total_divs_close
    status = 'OK' if (opens == closes and panels_open == panels_close and div_diff == 0) else 'ISSUE'
    if status == 'ISSUE':
        print(f'  {status} {fname}: widgets={opens}/{closes} panels={panels_open}/{panels_close} divs={total_divs_open}/{total_divs_close} (diff={div_diff})')
    else:
        print(f'  {status} {fname}: {opens} widgets, divs balanced')
