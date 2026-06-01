import re, json, os

def extract_images(series_dir, series_name):
    """Extract unique image filename and alt text from all HTML files in a series."""
    images = {}
    for fname in sorted(os.listdir(series_dir)):
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(series_dir, fname)
        with open(fpath) as f:
            content = f.read()
        pattern = r'<img\s+src="[^"]*images/series/' + re.escape(series_name) + r'/([^"]+\.webp)"\s+alt="([^"]*)"'
        for match in re.finditer(pattern, content):
            img_file = match.group(1)
            alt_text = match.group(2)
            key = img_file.replace('.webp', '')
            if key not in images:
                images[key] = alt_text
    return images

ANTI_COLOR_SUFFIX = " Do not include any standalone color swatches, color legends, color palette strips, or decorative color bars anywhere in the image."

SERIES_STYLE = {
    'assembly-mastery': "Use a clean white background with soft professional colors (muted blues, grays, and greens) for the blocks. Render as a polished infographic-style technical illustration suitable for an educational blog.",
    'gnu-make': "Use a clean white background with soft professional colors (muted blues, grays, and warm amber tones) for the blocks. Render as a polished infographic-style technical illustration suitable for an educational blog.",
    'system-design': "Use a clean white background with soft professional colors (muted blues, teals, and grays) for the blocks. Render as a polished infographic-style technical illustration suitable for an educational blog."
}

def build_prompt(alt_text, series):
    return f"Generate a clean, professional technical diagram: {alt_text}. {SERIES_STYLE[series]}{ANTI_COLOR_SUFFIX}"

def generate_jsonl(series):
    series_dir = f'pages/series/{series}'
    images = extract_images(series_dir, series)
    output_file = f'{series}-batch-image-requests.jsonl'
    
    with open(output_file, 'w') as f:
        for key, alt_text in sorted(images.items()):
            entry = {
                "key": key,
                "request": {
                    "contents": [
                        {
                            "parts": [
                                {"text": build_prompt(alt_text, series)}
                            ]
                        }
                    ],
                    "generation_config": {
                        "responseModalities": ["TEXT", "IMAGE"]
                    }
                }
            }
            f.write(json.dumps(entry) + '\n')
    
    print(f"{series}: {len(images)} images -> {output_file}")
    return len(images)

if __name__ == '__main__':
    total = 0
    for series in ['assembly-mastery', 'gnu-make', 'system-design']:
        total += generate_jsonl(series)
    print(f"\nTotal: {total} image prompts across 3 series")
