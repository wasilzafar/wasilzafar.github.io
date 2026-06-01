#!/usr/bin/env node
/**
 * Shuffle Practice Set Options — Randomizes the position of correct answers
 * across A/B/C/D so they're not all in position 0.
 *
 * Usage:
 *   node shuffle-options.js <source-file> [--dry-run]
 *
 * Reads source file with answer as integer index (pointing to correct option),
 * shuffles options randomly, and updates the answer index to match.
 * Writes back to the same file unless --dry-run is used.
 *
 * Target distribution: ~25% each position (A/B/C/D) across the set.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function seededRandom(seed) {
    // Simple seeded PRNG for reproducible shuffles
    let s = seed;
    return function() {
        s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
        return (s >>> 0) / 0xFFFFFFFF;
    };
}

function shuffleWithSeed(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// --- Main ---

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Usage: node shuffle-options.js <source-file> [--dry-run]');
    process.exit(1);
}

const sourceFile = path.resolve(args[0]);
const dryRun = args.includes('--dry-run');

if (!fs.existsSync(sourceFile)) {
    console.error('Error: Source file not found:', sourceFile);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const questions = data.questions;

// Use a seed based on the series name for reproducibility
const seedStr = data.series || 'default';
let seedNum = 0;
for (let i = 0; i < seedStr.length; i++) seedNum += seedStr.charCodeAt(i) * (i + 1);
const rng = seededRandom(seedNum);

const positionCounts = [0, 0, 0, 0];

questions.forEach((q, idx) => {
    if (q.type === 'mcq' || q.type === 'scenario' || q.type === 'diagnosis' ||
        q.type === 'debug' || q.type === 'architecture') {
        
        if (!q.options || q.options.length !== 4) return;
        if (typeof q.answer !== 'number') return;

        const correctOption = q.options[q.answer];
        
        // Create indices and shuffle them
        const indices = [0, 1, 2, 3];
        const shuffled = shuffleWithSeed(indices, rng);
        
        // Reorder options
        const newOptions = shuffled.map(i => q.options[i]);
        
        // Find where the correct answer ended up
        const newAnswer = newOptions.indexOf(correctOption);
        
        q.options = newOptions;
        q.answer = newAnswer;
        positionCounts[newAnswer]++;
    }
});

console.log(`Shuffled ${questions.length} questions.`);
console.log(`Answer distribution: A=${positionCounts[0]}, B=${positionCounts[1]}, C=${positionCounts[2]}, D=${positionCounts[3]}`);

if (!dryRun) {
    fs.writeFileSync(sourceFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Written to: ${sourceFile}`);
} else {
    console.log('(dry run — no changes written)');
}
