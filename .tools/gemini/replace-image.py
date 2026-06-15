#!/usr/bin/env python3
"""
Replace Site Image — Convert & Update HTML dimensions
=====================================================
Downloads or converts a source image (PNG/JPG) to WebP format,
replaces an existing site image, and updates width/height in HTML.

Usage:
    # Replace with a local file (auto-converts to WebP):
    python .tools/gemini/replace-image.py --source "C:/Users/zafar/Downloads/image.png" \
        --target "images/series/data-structures/recursion-types.webp"

    # Replace and auto-update HTML dimensions:
    python .tools/gemini/replace-image.py --source "C:/Downloads/new.png" \
        --target "images/series/data-structures/my-image.webp" \
        --update-html

    # Custom quality (default 80):
    python .tools/gemini/replace-image.py --source input.jpg --target output.webp -q 90

    # Resize to max width (preserves aspect ratio):
    python .tools/gemini/replace-image.py --source input.png --target output.webp --max-width 1920

Requirements:
    pip install Pillow
"""

import argparse
import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)


def convert_to_webp(source: str, target: str, quality: int = 80, max_width: int = None) -> tuple:
    """Convert source image to WebP format at target path.
    
    Returns (width, height) of the saved image.
    """
    img = Image.open(source)
    
    # Resize if max_width specified
    if max_width and img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)
        print(f"  Resized: {img.width}x{img.height}")
    
    # Ensure target directory exists
    Path(target).parent.mkdir(parents=True, exist_ok=True)
    
    # Convert RGBA to RGB if saving as WebP (handles transparency)
    if img.mode == 'RGBA':
        # Keep RGBA for WebP (it supports transparency)
        pass
    elif img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')
    
    img.save(target, 'webp', quality=quality)
    
    file_size = os.path.getsize(target) / 1024
    print(f"  Saved: {target} ({img.width}x{img.height}, {file_size:.1f} KB, q={quality})")
    
    return img.width, img.height


def update_html_dimensions(target_path: str, width: int, height: int, repo_root: str = '.'):
    """Find HTML files referencing this image and update width/height attributes."""
    # Get relative image path from repo root
    rel_target = os.path.relpath(target_path, repo_root).replace('\\', '/')
    # Also try the ../../../ relative form
    filename = os.path.basename(target_path)
    
    updated_files = []
    
    # Search all HTML files for references to this image
    for root, dirs, files in os.walk(os.path.join(repo_root, 'pages')):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for fname in files:
            if not fname.endswith('.html'):
                continue
            fpath = os.path.join(root, fname)
            html = open(fpath, encoding='utf-8').read()
            
            if filename not in html:
                continue
            
            # Pattern: width="N" height="N" near this filename
            # Match img tags containing this filename
            pattern = re.compile(
                r'(<img[^>]*' + re.escape(filename) + r'[^>]*)'
                r'width="(\d+)"([^>]*?)height="(\d+)"',
                re.DOTALL
            )
            
            new_html, count = pattern.subn(
                lambda m: m.group(1) + f'width="{width}"' + m.group(3) + f'height="{height}"',
                html
            )
            
            if count == 0:
                # Try reverse order: height before width
                pattern2 = re.compile(
                    r'(<img[^>]*' + re.escape(filename) + r'[^>]*)'
                    r'height="(\d+)"([^>]*?)width="(\d+)"',
                    re.DOTALL
                )
                new_html, count = pattern2.subn(
                    lambda m: m.group(1) + f'height="{height}"' + m.group(3) + f'width="{width}"',
                    html
                )
            
            if count > 0:
                open(fpath, 'w', encoding='utf-8').write(new_html)
                rel_fpath = os.path.relpath(fpath, repo_root).replace('\\', '/')
                updated_files.append(rel_fpath)
                print(f"  Updated HTML: {rel_fpath} (width={width}, height={height})")
    
    if not updated_files:
        print(f"  No HTML files reference {filename} with width/height attributes")
    
    return updated_files


def main():
    parser = argparse.ArgumentParser(
        description='Convert image to WebP and replace existing site image',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python .tools/gemini/replace-image.py \\
    --source "C:/Users/zafar/Downloads/new-diagram.png" \\
    --target "images/series/data-structures/my-diagram.webp" \\
    --update-html

  python .tools/gemini/replace-image.py \\
    -s input.jpg -t images/series/cloud/arch.webp -q 85 --max-width 1920
        """
    )
    parser.add_argument('-s', '--source', required=True,
                        help='Source image path (PNG, JPG, JPEG, etc.)')
    parser.add_argument('-t', '--target', required=True,
                        help='Target WebP path relative to repo root (e.g., images/series/...)')
    parser.add_argument('-q', '--quality', type=int, default=80,
                        help='WebP quality 1-100 (default: 80)')
    parser.add_argument('--max-width', type=int, default=None,
                        help='Maximum width in px; resizes preserving aspect ratio')
    parser.add_argument('--update-html', action='store_true',
                        help='Auto-update width/height in HTML files referencing this image')
    parser.add_argument('--repo-root', default='.',
                        help='Repository root directory (default: current directory)')

    args = parser.parse_args()

    # Validate source exists
    if not os.path.isfile(args.source):
        print(f"ERROR: Source file not found: {args.source}")
        sys.exit(1)

    # Resolve target path
    target = os.path.join(args.repo_root, args.target)

    print(f"\n{'='*60}")
    print(f"  Replace Image")
    print(f"{'='*60}")
    print(f"  Source:  {args.source}")
    print(f"  Target:  {args.target}")
    print(f"  Quality: {args.quality}")
    if args.max_width:
        print(f"  Max Width: {args.max_width}px")
    print()

    # Check if target exists
    if os.path.isfile(target):
        old_size = os.path.getsize(target) / 1024
        print(f"  Replacing existing file ({old_size:.1f} KB)")
    else:
        print(f"  Creating new file")

    # Convert
    width, height = convert_to_webp(args.source, target, args.quality, args.max_width)

    # Update HTML if requested
    if args.update_html:
        print()
        update_html_dimensions(target, width, height, args.repo_root)

    print(f"\n  Done!\n")


if __name__ == '__main__':
    main()
