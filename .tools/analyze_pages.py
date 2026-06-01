from pathlib import Path
import re

def analyze(path, label):
    html = Path(path).read_text(encoding="utf-8", errors="ignore")
    text = re.sub("<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text).strip()
    words = len(text.split())
    title = re.search(r"<title>([^<]+)</title>", html)
    desc = re.search(r'name="description"\s+content="([^"]+)"', html, re.I)
    canonical = re.search(r'rel="canonical"\s+href="([^"]+)"', html, re.I)
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.DOTALL)
    h1t = re.sub("<[^>]+>","",h1.group(1)).strip()[:80] if h1 else "MISSING"
    print(label)
    print("  Title:", title.group(1)[:80] if title else "MISSING")
    print("  H1:", h1t)
    print("  Desc:", desc.group(1)[:100] if desc else "MISSING")
    print("  Canonical:", canonical.group(1) if canonical else "MISSING")
    print("  Words:", words)
    print()

base = r"c:\Users\zafar\code\wasilzafar.github.io\wasilzafar.github.io"
analyze(base + r"\pages\2025\10\poetry-article.html", "poetry-article.html")
analyze(base + r"\pages\2025\11\business-sales-marketing-systems-glossary.html", "glossary.html")
