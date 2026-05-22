// ============================================================
// LSAT (Law School Admission Test) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['lsat'] = {
    examName: 'LSAT (Law School Admission Test)',
    version: '2026',
    sections: [
        {
            id: 'lsat-lr',
            name: 'Logical Reasoning',
            type: 'compulsory',
            topics: [
                { id: 'lr-strengthen-weaken', title: 'Strengthen & Weaken Arguments', difficulty: 3, estimatedHours: 14, weight: 1.3, tags: ['logical-reasoning'] },
                { id: 'lr-assumption', title: 'Sufficient & Necessary Assumptions', difficulty: 4, estimatedHours: 16, weight: 1.3, tags: ['logical-reasoning'] },
                { id: 'lr-flaw', title: 'Flaw in Reasoning & Parallel Flaw', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['logical-reasoning'] },
                { id: 'lr-inference', title: 'Must Be True / Inference Questions', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['logical-reasoning'] },
                { id: 'lr-method', title: 'Method of Reasoning & Role of Statement', difficulty: 3, estimatedHours: 10, tags: ['logical-reasoning'] },
                { id: 'lr-paradox', title: 'Paradox / Resolve Questions', difficulty: 3, estimatedHours: 8, tags: ['logical-reasoning'] },
                { id: 'lr-principle', title: 'Principle Questions (Match & Apply)', difficulty: 3, estimatedHours: 10, tags: ['logical-reasoning'] },
                { id: 'lr-point', title: 'Main Point & Point at Issue', difficulty: 2, estimatedHours: 6, tags: ['logical-reasoning'] }
            ]
        },
        {
            id: 'lsat-ag',
            name: 'Analytical Reasoning (Logic Games)',
            type: 'compulsory',
            topics: [
                { id: 'ag-sequencing', title: 'Sequencing Games (Strict & Loose Ordering)', difficulty: 3, estimatedHours: 16, weight: 1.3, tags: ['logic-games'] },
                { id: 'ag-grouping', title: 'Grouping Games (In/Out, Classification)', difficulty: 4, estimatedHours: 18, weight: 1.3, tags: ['logic-games'] },
                { id: 'ag-hybrid', title: 'Hybrid Games (Sequencing + Grouping)', difficulty: 5, estimatedHours: 16, weight: 1.2, tags: ['logic-games'] },
                { id: 'ag-misc', title: 'Miscellaneous Games (Matching, Mapping, Pattern)', difficulty: 4, estimatedHours: 12, tags: ['logic-games'] },
                { id: 'ag-conditional', title: 'Conditional Logic & Contrapositives', difficulty: 3, estimatedHours: 10, tags: ['logic-games'] }
            ]
        },
        {
            id: 'lsat-rc',
            name: 'Reading Comprehension',
            type: 'compulsory',
            topics: [
                { id: 'rc-law', title: 'Law Passages (Legal Reasoning & Precedent)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['reading'] },
                { id: 'rc-science', title: 'Science & Social Science Passages', difficulty: 3, estimatedHours: 12, tags: ['reading'] },
                { id: 'rc-humanities', title: 'Humanities & Arts Passages', difficulty: 3, estimatedHours: 10, tags: ['reading'] },
                { id: 'rc-comparative', title: 'Comparative Reading (Dual Passages)', difficulty: 4, estimatedHours: 14, weight: 1.3, tags: ['reading'] },
                { id: 'rc-structure', title: 'Passage Structure & Author\'s Viewpoint', difficulty: 3, estimatedHours: 10, tags: ['reading'] }
            ]
        }
    ]
};
