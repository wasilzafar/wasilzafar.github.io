#!/usr/bin/env node
// Scans all HTML pages for unescaped HTML tags inside code/string literals
// that the browser would execute as live HTML.
const fs = require('fs');
const path = require('path');

function walk(dir) {
    let files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files = files.concat(walk(full));
        else if (entry.name.endsWith('.html')) files.push(full);
    }
    return files;
}

// Dangerous patterns that browsers execute even inside <pre><code>
// We skip lines that already use &lt;/&gt; escaping
const DANGEROUS = [
    { re: /http-equiv\s*=\s*['"]?refresh/i,  label: 'meta refresh' },
    { re: /<script[\s>]/i,                    label: '<script> tag' },
    { re: /location\.reload\s*\(/,            label: 'location.reload()' },
];

// Structural tags that can prematurely close the document when unescaped
// Only flag if they appear to be inside a string literal (surrounded by quotes)
const STRUCTURAL = [
    { re: /<\/body>/i,  label: '</body> tag' },
    { re: /<\/html>/i,  label: '</html> tag' },
];

const root = process.cwd();
const files = walk(path.join(root, 'pages'));
const issues = [];

for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const lines = raw.split('\n');
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Track whether we're inside a <pre><code> block
        if (/<pre[^>]*>/.test(line)) inCodeBlock = true;
        if (/<\/pre>/.test(line)) inCodeBlock = false;

        // Skip lines that are already properly HTML-escaped
        if (line.includes('&lt;') || line.includes('&gt;')) continue;

        // Check dangerous patterns everywhere (meta refresh can appear outside code too)
        for (const { re, label } of DANGEROUS) {
            if (re.test(line)) {
                issues.push({
                    file: file.replace(root + path.sep, ''),
                    line: i + 1,
                    label,
                    inCode: inCodeBlock,
                    content: trimmed.slice(0, 130)
                });
            }
        }

        // Check structural tags only inside code blocks (they're fine as real HTML outside)
        if (inCodeBlock) {
            for (const { re, label } of STRUCTURAL) {
                if (re.test(line)) {
                    issues.push({
                        file: file.replace(root + path.sep, ''),
                        line: i + 1,
                        label,
                        inCode: true,
                        content: trimmed.slice(0, 130)
                    });
                }
            }
        }
    }
}

if (issues.length === 0) {
    console.log('No issues found across ' + files.length + ' HTML files.');
} else {
    console.log(issues.length + ' issues found across ' + files.length + ' HTML files:\n');
    for (const { file, line, label, inCode, content } of issues) {
        console.log('  [' + label + ']' + (inCode ? ' (in code block)' : ' (outside code block)'));
        console.log('  ' + file + ':' + line);
        console.log('  ' + content);
        console.log();
    }
}
