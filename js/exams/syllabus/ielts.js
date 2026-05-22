// ============================================================
// IELTS Syllabus Data — Academic & General Training
// Version: 2026.1 | Updated: 2026-05-22
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['ielts'] = {
    version: '2026.1',
    updatedAt: '2026-05-22',
    examName: 'IELTS',
    totalMarks: 9,
    sections: [
        {
            id: 'ielts-listening',
            name: 'Listening',
            type: 'compulsory',
            topics: [
                { id: 'l-form-completion', title: 'Form/Note/Table Completion', difficulty: 2, estimatedHours: 6, weight: 0.9, tags: ['listening'] },
                { id: 'l-mcq', title: 'Multiple Choice Questions', difficulty: 2, estimatedHours: 6, weight: 0.9, tags: ['listening'] },
                { id: 'l-matching', title: 'Matching (information, features, headings)', difficulty: 3, estimatedHours: 6, weight: 0.9, tags: ['listening'] },
                { id: 'l-map-labelling', title: 'Map/Plan/Diagram Labelling', difficulty: 3, estimatedHours: 5, weight: 0.9, tags: ['listening'] },
                { id: 'l-sentence-completion', title: 'Sentence Completion & Short Answer', difficulty: 2, estimatedHours: 5, weight: 0.9, tags: ['listening'] },
                { id: 'l-spelling', title: 'Spelling & number accuracy', difficulty: 1, estimatedHours: 3, weight: 0.9, tags: ['listening'] },
                { id: 'l-section4', title: 'Section 4 — Academic lecture monologue', difficulty: 4, estimatedHours: 8, weight: 0.9, tags: ['listening'] }
            ]
        },
        {
            id: 'ielts-speaking',
            name: 'Speaking',
            type: 'compulsory',
            topics: [
                { id: 's-part1', title: 'Part 1 — Introduction & familiar topics (4–5 min)', difficulty: 1, estimatedHours: 5, weight: 1.3, tags: ['speaking'] },
                { id: 's-part2', title: 'Part 2 — Long turn / Cue card (3–4 min)', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['speaking'] },
                { id: 's-part3', title: 'Part 3 — Discussion & abstract reasoning (4–5 min)', difficulty: 4, estimatedHours: 10, weight: 1.3, tags: ['speaking'] },
                { id: 's-fluency', title: 'Fluency & coherence strategies', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['speaking'] },
                { id: 's-vocabulary', title: 'Lexical resource — topic vocabulary & collocations', difficulty: 3, estimatedHours: 12, weight: 1.3, tags: ['speaking'] },
                { id: 's-grammar', title: 'Grammatical range & accuracy', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['speaking'] },
                { id: 's-pronunciation', title: 'Pronunciation — stress, intonation, connected speech', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['speaking'] }
            ]
        },
        {
            id: 'ielts-reading-academic',
            name: 'Reading (Academic)',
            type: 'elective',
            group: 'reading-module',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'ra-heading-matching', title: 'Heading Matching', difficulty: 4, estimatedHours: 8, tags: ['reading'] },
                { id: 'ra-tfng', title: 'True/False/Not Given & Yes/No/Not Given', difficulty: 3, estimatedHours: 10, tags: ['reading'] },
                { id: 'ra-summary', title: 'Summary/Note Completion', difficulty: 3, estimatedHours: 6, tags: ['reading'] },
                { id: 'ra-matching-info', title: 'Matching Information to Paragraphs', difficulty: 3, estimatedHours: 6, tags: ['reading'] },
                { id: 'ra-matching-features', title: 'Matching Features (names, dates, theories)', difficulty: 3, estimatedHours: 5, tags: ['reading'] },
                { id: 'ra-mcq', title: 'Multiple Choice Questions', difficulty: 2, estimatedHours: 5, tags: ['reading'] },
                { id: 'ra-sentence-completion', title: 'Sentence Completion', difficulty: 2, estimatedHours: 5, tags: ['reading'] },
                { id: 'ra-skimming', title: 'Skimming & scanning under time pressure (60 min/3 passages)', difficulty: 3, estimatedHours: 10, tags: ['strategy'] }
            ]
        },
        {
            id: 'ielts-reading-general',
            name: 'Reading (General Training)',
            type: 'elective',
            group: 'reading-module',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'rg-section1', title: 'Section 1 — Short functional texts (ads, notices)', difficulty: 1, estimatedHours: 4, tags: ['reading'] },
                { id: 'rg-section2', title: 'Section 2 — Workplace texts (job descriptions, policies)', difficulty: 2, estimatedHours: 5, tags: ['reading'] },
                { id: 'rg-section3', title: 'Section 3 — Longer general text', difficulty: 3, estimatedHours: 6, tags: ['reading'] },
                { id: 'rg-tfng', title: 'True/False/Not Given', difficulty: 3, estimatedHours: 6, tags: ['reading'] },
                { id: 'rg-matching', title: 'Matching & labelling', difficulty: 2, estimatedHours: 5, tags: ['reading'] },
                { id: 'rg-completion', title: 'Sentence/Summary completion', difficulty: 2, estimatedHours: 5, tags: ['reading'] }
            ]
        },
        {
            id: 'ielts-writing-academic',
            name: 'Writing (Academic)',
            type: 'elective',
            group: 'writing-module',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'wa-task1-line', title: 'Task 1 — Line/bar/pie charts (describe trends)', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['writing'] },
                { id: 'wa-task1-table', title: 'Task 1 — Tables & mixed data', difficulty: 3, estimatedHours: 6, weight: 1.3, tags: ['writing'] },
                { id: 'wa-task1-process', title: 'Task 1 — Process diagrams & maps', difficulty: 3, estimatedHours: 6, weight: 1.3, tags: ['writing'] },
                { id: 'wa-task1-compare', title: 'Task 1 — Making comparisons & summarizing key features', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['writing'] },
                { id: 'wa-task2-essay', title: 'Task 2 — Essay types (agree/disagree, discuss, problem/solution)', difficulty: 4, estimatedHours: 16, weight: 1.3, tags: ['writing'] },
                { id: 'wa-task2-structure', title: 'Task 2 — Paragraph structure & coherence', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['writing'] },
                { id: 'wa-task2-grammar', title: 'Task 2 — Complex sentences & range', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['writing'] },
                { id: 'wa-task2-vocab', title: 'Task 2 — Academic vocabulary & register', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['writing'] }
            ]
        },
        {
            id: 'ielts-writing-general',
            name: 'Writing (General Training)',
            type: 'elective',
            group: 'writing-module',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'wg-task1-formal', title: 'Task 1 — Formal letter (complaint, request, application)', difficulty: 2, estimatedHours: 6, weight: 1.3, tags: ['writing'] },
                { id: 'wg-task1-semi', title: 'Task 1 — Semi-formal letter (to acquaintance)', difficulty: 2, estimatedHours: 5, weight: 1.3, tags: ['writing'] },
                { id: 'wg-task1-informal', title: 'Task 1 — Informal letter (to friend/family)', difficulty: 1, estimatedHours: 4, weight: 1.3, tags: ['writing'] },
                { id: 'wg-task1-tone', title: 'Task 1 — Tone & register switching', difficulty: 3, estimatedHours: 6, weight: 1.3, tags: ['writing'] },
                { id: 'wg-task2-essay', title: 'Task 2 — Essay (same as Academic Task 2)', difficulty: 4, estimatedHours: 14, weight: 1.3, tags: ['writing'] },
                { id: 'wg-task2-structure', title: 'Task 2 — Planning & paragraph structure', difficulty: 3, estimatedHours: 6, weight: 1.3, tags: ['writing'] }
            ]
        }
    ]
};
