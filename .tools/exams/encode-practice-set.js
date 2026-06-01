#!/usr/bin/env node
/**
 * Encode Practice Set — Transforms source questions (plaintext answers) into
 * assessment-ready JSON with XOR+Base64 encoded answers.
 *
 * Usage:
 *   node encode-practice-set.js <source-file> <salt> [output-file]
 *
 * Example:
 *   node encode-practice-set.js source/set-a.questions.json cca-f-set-a-2026 ../../practice-set-a.json
 *
 * Source file format:
 *   Same as quiz.json but with "answer" as plaintext (integer index for MCQ/scenario).
 *   The script encodes each answer using XOR cipher + Base64.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function encode(answer, salt) {
    const json = JSON.stringify(answer);
    let shifted = '';
    for (let i = 0; i < json.length; i++) {
        shifted += String.fromCharCode(json.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
    }
    return Buffer.from(shifted, 'binary').toString('base64');
}

function decode(encoded, salt) {
    const shifted = Buffer.from(encoded, 'base64').toString('binary');
    let json = '';
    for (let i = 0; i < shifted.length; i++) {
        json += String.fromCharCode(shifted.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
    }
    return JSON.parse(json);
}

// --- Main ---

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Usage: node encode-practice-set.js <source-file> <salt> [output-file]');
    console.error('  --verify  Verify an already-encoded file decodes correctly');
    process.exit(1);
}

const sourceFile = path.resolve(args[0]);
const salt = args[1];
const outputFile = args[2] ? path.resolve(args[2]) : null;
const verifyMode = args.includes('--verify');

if (!fs.existsSync(sourceFile)) {
    console.error('Error: Source file not found:', sourceFile);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

if (verifyMode) {
    // Verify mode: decode all answers and print them
    console.log(`Verifying ${data.questions.length} questions with salt "${salt}"...\n`);
    let errors = 0;
    data.questions.forEach((q, i) => {
        try {
            const decoded = decode(q.answer, salt);
            console.log(`  ${q.id}: answer = ${JSON.stringify(decoded)}`);
        } catch (e) {
            console.error(`  ${q.id}: DECODE ERROR - ${e.message}`);
            errors++;
        }
    });
    console.log(`\n${errors === 0 ? '✓ All answers decode successfully.' : `✗ ${errors} errors found.`}`);
    process.exit(errors > 0 ? 1 : 0);
}

// Encode mode: transform plaintext answers to encoded
console.log(`Encoding ${data.questions.length} questions with salt "${salt}"...`);

// Update salt in security section
if (!data.security) data.security = {};
data.security.method = 'xor-b64';
data.security.salt = salt;

let encoded = 0;
data.questions.forEach((q) => {
    if (typeof q.answer === 'string' && q.answer.length > 0) {
        // Check if already encoded (try to decode)
        try {
            decode(q.answer, salt);
            // Already encoded, skip
            return;
        } catch (e) {
            // Not encoded, treat as raw string answer for fill-blank
            q.answer = encode(q.answer, salt);
            encoded++;
        }
    } else {
        // Plaintext answer (number, boolean, array, etc.)
        q.answer = encode(q.answer, salt);
        encoded++;
    }
});

console.log(`  Encoded ${encoded} answers.`);

const output = JSON.stringify(data, null, 2);

if (outputFile) {
    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outputFile, output, 'utf8');
    console.log(`  Written to: ${outputFile}`);
} else {
    process.stdout.write(output);
}

console.log('✓ Done.');
