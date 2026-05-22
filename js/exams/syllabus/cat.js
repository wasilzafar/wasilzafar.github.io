// ============================================================
// CAT (Common Admission Test) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['cat'] = {
    examName: 'CAT (Common Admission Test)',
    version: '2026',
    sections: [
        {
            id: 'cat-varc',
            name: 'Verbal Ability & Reading Comprehension (VARC)',
            type: 'compulsory',
            topics: [
                { id: 'varc-rc', title: 'Reading Comprehension (5–6 passages, inference-based)', difficulty: 4, estimatedHours: 30, weight: 1.3, tags: ['verbal'] },
                { id: 'varc-parajumbles', title: 'Para-Jumbles (sentence rearrangement)', difficulty: 3, estimatedHours: 12, tags: ['verbal'] },
                { id: 'varc-parasummary', title: 'Para-Summary (identify best summary)', difficulty: 3, estimatedHours: 10, tags: ['verbal'] },
                { id: 'varc-oddsentence', title: 'Odd Sentence Out', difficulty: 2, estimatedHours: 8, tags: ['verbal'] },
                { id: 'varc-critical', title: 'Critical Reasoning & Strengthening/Weakening Arguments', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['verbal'] }
            ]
        },
        {
            id: 'cat-dilr',
            name: 'Data Interpretation & Logical Reasoning (DILR)',
            type: 'compulsory',
            topics: [
                { id: 'di-tables', title: 'Tables, Bar/Pie Charts & Data Sufficiency', difficulty: 3, estimatedHours: 16, tags: ['data-interpretation'] },
                { id: 'di-caselets', title: 'Caselets & Multi-level DI', difficulty: 4, estimatedHours: 18, weight: 1.3, tags: ['data-interpretation'] },
                { id: 'lr-arrangements', title: 'Arrangements (Linear, Circular, Matrix)', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['logical-reasoning'] },
                { id: 'lr-puzzles', title: 'Puzzles (Grouping, Sequencing, Scheduling)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['logical-reasoning'] },
                { id: 'lr-games', title: 'Games & Tournaments', difficulty: 4, estimatedHours: 14, tags: ['logical-reasoning'] },
                { id: 'lr-networks', title: 'Networks, Routes & Binary Logic', difficulty: 3, estimatedHours: 12, tags: ['logical-reasoning'] },
                { id: 'lr-venn', title: 'Venn Diagrams & Set Theory', difficulty: 2, estimatedHours: 8, tags: ['logical-reasoning'] }
            ]
        },
        {
            id: 'cat-quant',
            name: 'Quantitative Ability (QA)',
            type: 'compulsory',
            topics: [
                { id: 'qa-arithmetic', title: 'Arithmetic (Percentages, Profit/Loss, TSD, CI/SI)', difficulty: 3, estimatedHours: 24, weight: 1.3, tags: ['quant'] },
                { id: 'qa-algebra', title: 'Algebra (Equations, Inequalities, Functions, Logs)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['quant'] },
                { id: 'qa-number', title: 'Number Systems (Divisibility, Remainders, HCF/LCM)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['quant'] },
                { id: 'qa-geometry', title: 'Geometry (Triangles, Circles, Coordinate Geometry)', difficulty: 4, estimatedHours: 22, weight: 1.2, tags: ['quant'] },
                { id: 'qa-modern-math', title: 'Modern Math (P&C, Probability, Set Theory)', difficulty: 4, estimatedHours: 18, tags: ['quant'] },
                { id: 'qa-mensuration', title: 'Mensuration (Areas, Volumes, Surface Areas)', difficulty: 2, estimatedHours: 10, tags: ['quant'] }
            ]
        }
    ]
};
