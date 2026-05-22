// ============================================================
// GRE Syllabus Data — GRE General Test
// Version: 2026.1 | Updated: 2026-05-22
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['gre'] = {
    version: '2026.1',
    updatedAt: '2026-05-22',
    examName: 'GRE General Test',
    totalMarks: 340,
    sections: [
        {
            id: 'gre-verbal',
            name: 'Verbal Reasoning',
            type: 'compulsory',
            topics: [
                { id: 'v-text-completion', title: 'Text Completion (1–3 blanks)', difficulty: 3, estimatedHours: 12, tags: ['vocab'] },
                { id: 'v-sentence-equiv', title: 'Sentence Equivalence', difficulty: 3, estimatedHours: 10, tags: ['vocab'] },
                { id: 'v-rc-main-idea', title: 'Reading Comprehension — Main idea & purpose', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['reading'] },
                { id: 'v-rc-inference', title: 'Reading Comprehension — Inferences & assumptions', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['reading'] },
                { id: 'v-rc-strengthen', title: 'Reading Comprehension — Strengthen/Weaken arguments', difficulty: 4, estimatedHours: 10, weight: 1.3, tags: ['reading'] },
                { id: 'v-rc-structure', title: 'Reading Comprehension — Text structure & function', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['reading'] },
                { id: 'v-rc-select', title: 'Reading Comprehension — Select-in-Passage', difficulty: 3, estimatedHours: 6, weight: 1.3, tags: ['reading'] },
                { id: 'v-vocabulary', title: 'High-frequency GRE vocabulary (1000+ words)', difficulty: 3, estimatedHours: 30, tags: ['vocab'] }
            ]
        },
        {
            id: 'gre-quant',
            name: 'Quantitative Reasoning',
            type: 'compulsory',
            topics: [
                { id: 'q-arithmetic', title: 'Arithmetic — Number properties, factors, primes', difficulty: 2, estimatedHours: 8, tags: ['arithmetic'] },
                { id: 'q-fractions', title: 'Arithmetic — Fractions, decimals, percentages', difficulty: 1, estimatedHours: 5, tags: ['arithmetic'] },
                { id: 'q-ratios', title: 'Arithmetic — Ratios, rates & proportions', difficulty: 2, estimatedHours: 6, tags: ['arithmetic'] },
                { id: 'q-algebra-linear', title: 'Algebra — Linear equations & inequalities', difficulty: 2, estimatedHours: 6, tags: ['algebra'] },
                { id: 'q-algebra-quadratic', title: 'Algebra — Quadratic equations & functions', difficulty: 3, estimatedHours: 8, tags: ['algebra'] },
                { id: 'q-algebra-exponents', title: 'Algebra — Exponents & radicals', difficulty: 2, estimatedHours: 5, tags: ['algebra'] },
                { id: 'q-algebra-word', title: 'Algebra — Word problems (rate, mixture, work)', difficulty: 3, estimatedHours: 10, tags: ['algebra'] },
                { id: 'q-geometry-lines', title: 'Geometry — Lines, angles, triangles', difficulty: 2, estimatedHours: 8, tags: ['geometry'] },
                { id: 'q-geometry-circles', title: 'Geometry — Circles, polygons, 3D shapes', difficulty: 2, estimatedHours: 6, tags: ['geometry'] },
                { id: 'q-geometry-coord', title: 'Geometry — Coordinate geometry', difficulty: 2, estimatedHours: 6, tags: ['geometry'] },
                { id: 'q-data-stats', title: 'Data Analysis — Descriptive statistics', difficulty: 2, estimatedHours: 6, tags: ['data'] },
                { id: 'q-data-probability', title: 'Data Analysis — Probability & counting', difficulty: 3, estimatedHours: 8, tags: ['data'] },
                { id: 'q-data-interpret', title: 'Data Analysis — Data interpretation (graphs, tables)', difficulty: 2, estimatedHours: 8, tags: ['data'] },
                { id: 'q-comparison', title: 'Quantitative Comparison strategies', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['strategy'] }
            ]
        },
        {
            id: 'gre-awa',
            name: 'Analytical Writing',
            type: 'compulsory',
            topics: [
                { id: 'awa-issue', title: 'Analyze an Issue — essay structure & argumentation', difficulty: 3, estimatedHours: 12, weight: 0.6, tags: ['writing'] },
                { id: 'awa-templates', title: 'Essay templates & time management (30 min)', difficulty: 2, estimatedHours: 6, weight: 0.6, tags: ['writing'] },
                { id: 'awa-examples', title: 'Building examples & evidence bank', difficulty: 2, estimatedHours: 8, weight: 0.6, tags: ['writing'] },
                { id: 'awa-grammar', title: 'Grammar & sentence variety for score 5+', difficulty: 2, estimatedHours: 6, weight: 0.6, tags: ['writing'] }
            ]
        }
    ]
};
