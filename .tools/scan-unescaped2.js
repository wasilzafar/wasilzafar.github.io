#!/usr/bin/env node
// Scans HTML pages for unescaped dangerous tags inside <pre><code> blocks
// and meta refresh anywhere in the page.
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

// Always dangerous - meta refresh anywhere in the document
const ALWAYS_PATTERNS = [
    { re: /http-equiv\s*=\s*['"]?refresh/i, label: 'meta refresh' },
];

// Dangerous only inside <pre> blocks (unescaped tags break the page)
const CODE_PATTERNS = [
    { re: /<\/body>/i,    label: '</body> in code block' },
    { re: /<\/html>/i,    label: '</html> in code block' },
    { re: /<script[\s>]/i, label: '<script> in code block' },
];

const root = process.cwd();
const files = walk(path.join(root, 'pages'));
const issues = [];

for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const lines = raw.split('\n');
    let depth = 0; // >0 means inside a <pre> block

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const alreadyEscaped = line.includes('&lt;') || line.includes('&gt;');

        // Count <pre> depth
        const opens  = (line.match(/<pre[\s>]/gi) || []).length;
        const closes = (line.match(/<\/pre>/gi)  || []).length;

        // Check ALWAYS patterns (skip if already escaped)
        if (!alreadyEscaped) {
            for (const { re, label } of ALWAYS_PATTERNS) {
                if (re.test(line)) {
                    issues.push({ file: file.replace(root + path.sep, ''), line: i + 1, label, content: trimmed.slice(0, 130) });
                }
            }
        }

        // Update depth after opens (line with opening <pre> counts as inside)
        depth += opens;

        // Check CODE_BLOCK patterns
        if (depth > 0 && !alreadyEscaped) {
            for (const { re, label } of CODE_PATTERNS) {
                if (re.test(line)) {
                    issues.push({ file: file.replace(root + path.sep, ''), line: i + 1, label, content: trimmed.slice(0, 130) });
                }
            }
        }

        depth -= closes;
        if (depth < 0) depth = 0;
    }
}

if (issues.length === 0) {
    console.log('No issues found across ' + files.length + ' HTML files. All clear.');
} else {
    console.log(issues.length + ' issues found:\n');
    for (const { file, line, label, content } of issues) {
        console.log('[' + label + '] ' + file + ':' + line);
        console.log('  ' + content);
    }
}
