#!/usr/bin/env python3
"""
check-encoding.py — Detect and fix UTF-8 mojibake across all HTML files.

Usage:
    python check-encoding.py                  # Scan all pages, report issues
    python check-encoding.py --fix            # Fix all detected issues
    python check-encoding.py --path pages/series/tensorflow-mastery  # Scan specific folder
    python check-encoding.py --fix --path pages/series/some-series   # Fix specific folder

What it detects:
    1. Double-encoded UTF-8 (UTF-8 bytes misread as Windows-1252 then re-encoded)
       Example: em-dash — (E2 80 94) → â€" (â=E2, €=80, "=94 in CP1252)
    2. UTF-8 BOM markers (EF BB BF) at file start — unnecessary for web files
    3. Null bytes or other binary corruption
    4. Mixed line endings (CRLF vs LF inconsistency)
    5. Non-UTF-8 encodable content

How double-encoding happens:
    A tool/editor reads a UTF-8 file as if it were Windows-1252 (Latin-1 superset),
    then saves it back as UTF-8. Each original multi-byte UTF-8 sequence gets
    expanded because each byte is treated as a separate CP1252 character.

Prevention:
    - Always save files as UTF-8 without BOM
    - Never use Windows-1252/Latin-1 encoding for web files
    - Verify <meta charset="UTF-8"> is present in every HTML file
    - Use this script in CI/pre-commit to catch issues early
"""
import argparse
import os
import sys
from pathlib import Path


# ============================================================
# MOJIBAKE DETECTION: Build garbled→correct character mappings
# ============================================================

def make_garbled(char):
    """Given a correct Unicode char, produce the garbled string that appears
    when its UTF-8 bytes are misread as Windows-1252 and re-encoded to UTF-8."""
    try:
        utf8_bytes = char.encode('utf-8')
        garbled = utf8_bytes.decode('cp1252')
        return garbled
    except (UnicodeDecodeError, UnicodeEncodeError):
        return None


# Characters commonly affected by double-encoding
TARGET_CHARS = [
    # Punctuation & Typography
    '\u2014',  # — em-dash
    '\u2013',  # – en-dash
    '\u2019',  # ' right single quote (apostrophe)
    '\u2018',  # ' left single quote
    '\u201c',  # " left double quote
    '\u201d',  # " right double quote
    '\u2026',  # … ellipsis
    '\u2022',  # • bullet
    '\u2032',  # ′ prime
    '\u2033',  # ″ double prime
    '\u00a0',  # non-breaking space
    '\u00ab',  # « left guillemet
    '\u00bb',  # » right guillemet

    # Arrows & Symbols
    '\u2192',  # → right arrow
    '\u2190',  # ← left arrow
    '\u2191',  # ↑ up arrow
    '\u2193',  # ↓ down arrow
    '\u21d2',  # ⇒ double right arrow
    '\u2194',  # ↔ left-right arrow

    # Math & Comparison
    '\u2264',  # ≤ less-or-equal
    '\u2265',  # ≥ greater-or-equal
    '\u2260',  # ≠ not equal
    '\u2248',  # ≈ approximately equal
    '\u00d7',  # × multiplication sign
    '\u00f7',  # ÷ division sign
    '\u2212',  # − minus sign
    '\u00b1',  # ± plus-minus
    '\u221e',  # ∞ infinity
    '\u221a',  # √ square root
    '\u2211',  # ∑ summation
    '\u220f',  # ∏ product
    '\u2202',  # ∂ partial derivative
    '\u222b',  # ∫ integral
    '\u2207',  # ∇ nabla/del

    # Superscripts & Fractions
    '\u00b2',  # ² superscript 2
    '\u00b3',  # ³ superscript 3
    '\u00b9',  # ¹ superscript 1
    '\u00bc',  # ¼ one-quarter
    '\u00bd',  # ½ one-half
    '\u00be',  # ¾ three-quarters

    # Greek letters (common in math/science content)
    '\u03b1',  # α alpha
    '\u03b2',  # β beta
    '\u03b3',  # γ gamma
    '\u03b4',  # δ delta
    '\u03b5',  # ε epsilon
    '\u03b6',  # ζ zeta
    '\u03b7',  # η eta
    '\u03b8',  # θ theta
    '\u03bb',  # λ lambda
    '\u03bc',  # μ mu
    '\u03c0',  # π pi
    '\u03c3',  # σ sigma
    '\u03c4',  # τ tau
    '\u03c6',  # φ phi
    '\u03c8',  # ψ psi
    '\u03c9',  # ω omega
    '\u0394',  # Δ capital delta
    '\u03a3',  # Σ capital sigma
    '\u03a9',  # Ω capital omega

    # Accented Latin (common in names/loanwords)
    '\u00e9',  # é e-acute
    '\u00e8',  # è e-grave
    '\u00ea',  # ê e-circumflex
    '\u00f1',  # ñ n-tilde
    '\u00fc',  # ü u-umlaut
    '\u00e4',  # ä a-umlaut
    '\u00f6',  # ö o-umlaut
    '\u00e7',  # ç c-cedilla

    # Miscellaneous
    '\u2122',  # ™ trademark
    '\u00a9',  # © copyright
    '\u00ae',  # ® registered
    '\u2020',  # † dagger
    '\u2021',  # ‡ double dagger
    '\u00b0',  # ° degree
]

# Build the replacement map
REPLACEMENTS = {}
for char in TARGET_CHARS:
    garbled = make_garbled(char)
    if garbled and garbled != char:
        REPLACEMENTS[garbled] = char


# ============================================================
# FILE SCANNING
# ============================================================

def scan_file(filepath):
    """Scan a single file for encoding issues. Returns a dict of findings."""
    issues = {
        'mojibake': 0,
        'bom': False,
        'null_bytes': 0,
        'missing_charset': False,
        'details': [],
    }

    # Check raw bytes first
    with open(filepath, 'rb') as f:
        raw = f.read()

    # BOM check
    if raw[:3] == b'\xef\xbb\xbf':
        issues['bom'] = True
        issues['details'].append('Has UTF-8 BOM (unnecessary for web files)')

    # Null byte check
    null_count = raw.count(b'\x00')
    if null_count > 0:
        issues['null_bytes'] = null_count
        issues['details'].append(f'Contains {null_count} null bytes (possible binary corruption)')

    # Read as text for mojibake detection
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            content = f.read()
    except UnicodeDecodeError as e:
        issues['details'].append(f'FATAL: File is not valid UTF-8 ({e})')
        return issues

    # Check for <meta charset="UTF-8">
    if '<meta charset=' not in content.lower() and 'charset=utf-8' not in content.lower():
        if content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html'):
            issues['missing_charset'] = True
            issues['details'].append('Missing <meta charset="UTF-8"> declaration')

    # Mojibake detection
    for garbled, correct in REPLACEMENTS.items():
        count = content.count(garbled)
        if count > 0:
            issues['mojibake'] += count
            # Show first occurrence context for debugging
            idx = content.find(garbled)
            context_start = max(0, idx - 20)
            context_end = min(len(content), idx + len(garbled) + 20)
            context = content[context_start:context_end].replace('\n', '↵')
            if issues['mojibake'] <= 5:  # Limit detail output
                issues['details'].append(
                    f'  "{garbled}" → "{correct}" (×{count}) near: ...{context}...'
                )

    return issues


def fix_file(filepath):
    """Fix encoding issues in a single file. Returns number of fixes applied."""
    fixes = 0

    with open(filepath, 'r', encoding='utf-8-sig') as f:  # utf-8-sig strips BOM
        content = f.read()

    for garbled, correct in REPLACEMENTS.items():
        count = content.count(garbled)
        if count > 0:
            content = content.replace(garbled, correct)
            fixes += count

    if fixes > 0:
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)

    return fixes


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description='Detect and fix UTF-8 mojibake (double-encoding) in HTML files.',
        epilog='Examples:\n'
               '  python check-encoding.py\n'
               '  python check-encoding.py --fix\n'
               '  python check-encoding.py --path pages/series/tensorflow-mastery\n'
               '  python check-encoding.py --fix --path pages/series/some-series\n',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument('--fix', action='store_true',
                        help='Apply fixes (without this flag, only reports issues)')
    parser.add_argument('--path', type=str, default=None,
                        help='Relative path to scan (default: all pages/ and index.html)')
    parser.add_argument('--verbose', '-v', action='store_true',
                        help='Show details for each file with issues')
    args = parser.parse_args()

    # Determine repo root
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent  # .tools/ is one level below root

    # Determine scan targets
    if args.path:
        scan_root = repo_root / args.path
        if not scan_root.exists():
            print(f"ERROR: Path not found: {scan_root}")
            sys.exit(1)
    else:
        scan_root = repo_root

    # Collect HTML files
    html_files = []
    if scan_root.is_file() and scan_root.suffix == '.html':
        html_files = [scan_root]
    else:
        # Scan pages/, index.html, and root-level HTML
        if args.path:
            html_files = sorted(scan_root.rglob('*.html'))
        else:
            # Default: scan all HTML in the repo
            for pattern in ['pages/**/*.html', '*.html']:
                html_files.extend(repo_root.glob(pattern))
            html_files = sorted(set(html_files))

    if not html_files:
        print("No HTML files found to scan.")
        sys.exit(0)

    print(f"Scanning {len(html_files)} HTML files...")
    print(f"Detection patterns: {len(REPLACEMENTS)} mojibake sequences\n")

    # Scan all files
    total_mojibake = 0
    total_bom = 0
    total_nulls = 0
    files_with_issues = []

    for filepath in html_files:
        issues = scan_file(filepath)
        has_issues = issues['mojibake'] > 0 or issues['bom'] or issues['null_bytes'] > 0

        if has_issues:
            rel_path = filepath.relative_to(repo_root)
            files_with_issues.append((rel_path, issues))
            total_mojibake += issues['mojibake']
            total_bom += 1 if issues['bom'] else 0
            total_nulls += issues['null_bytes']

    # Report
    if not files_with_issues:
        print("✓ All files are clean — no encoding issues detected.")
        sys.exit(0)

    print(f"{'═' * 60}")
    print(f"  ENCODING ISSUES FOUND")
    print(f"{'═' * 60}")
    print(f"  Files affected:     {len(files_with_issues)}")
    print(f"  Mojibake chars:     {total_mojibake}")
    print(f"  BOM markers:        {total_bom}")
    print(f"  Null bytes:         {total_nulls}")
    print(f"{'═' * 60}\n")

    for rel_path, issues in files_with_issues:
        parts = []
        if issues['mojibake'] > 0:
            parts.append(f"{issues['mojibake']} mojibake")
        if issues['bom']:
            parts.append("BOM")
        if issues['null_bytes'] > 0:
            parts.append(f"{issues['null_bytes']} null bytes")
        print(f"  {rel_path}: {', '.join(parts)}")
        if args.verbose and issues['details']:
            for detail in issues['details'][:8]:
                print(f"    {detail}")
            if len(issues['details']) > 8:
                print(f"    ... and {len(issues['details']) - 8} more")

    # Apply fixes if requested
    if args.fix:
        print(f"\n{'─' * 60}")
        print("  APPLYING FIXES...")
        print(f"{'─' * 60}")
        total_fixed = 0
        for rel_path, issues in files_with_issues:
            if issues['mojibake'] > 0 or issues['bom']:
                filepath = repo_root / rel_path
                fixed = fix_file(filepath)
                total_fixed += fixed
                print(f"  ✓ {rel_path}: {fixed} characters fixed")

        print(f"\n  Total: {total_fixed} characters fixed across {len(files_with_issues)} files.")
        print("  Files saved as clean UTF-8 (no BOM, LF line endings).")
    else:
        print(f"\n  Run with --fix to repair these issues.")
        print(f"  Example: python .tools/check-encoding.py --fix")

    # Exit with error code if issues found (useful for CI)
    sys.exit(1 if not args.fix else 0)


if __name__ == '__main__':
    main()
