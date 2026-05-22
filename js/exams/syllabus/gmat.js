// ============================================================
// GMAT Focus Edition — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['gmat'] = {
    examName: 'GMAT Focus Edition',
    version: '2026',
    sections: [
        {
            id: 'gmat-quant',
            name: 'Quantitative Reasoning',
            type: 'compulsory',
            topics: [
                { id: 'quant-arithmetic', title: 'Arithmetic (Fractions, Percentages, Ratios, Number Properties)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['quant'] },
                { id: 'quant-algebra', title: 'Algebra (Equations, Inequalities, Functions)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['quant'] },
                { id: 'quant-word', title: 'Word Problems (Rate, Work, Mixture, Profit)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['quant'] },
                { id: 'quant-geometry', title: 'Geometry (Triangles, Circles, Coordinate, 3D Shapes)', difficulty: 3, estimatedHours: 12, tags: ['quant'] },
                { id: 'quant-statistics', title: 'Statistics (Mean, Median, Standard Deviation, Probability)', difficulty: 3, estimatedHours: 12, tags: ['quant'] }
            ]
        },
        {
            id: 'gmat-verbal',
            name: 'Verbal Reasoning',
            type: 'compulsory',
            topics: [
                { id: 'verbal-rc', title: 'Reading Comprehension (Main Idea, Inference, Detail)', difficulty: 3, estimatedHours: 18, weight: 1.3, tags: ['verbal'] },
                { id: 'verbal-cr', title: 'Critical Reasoning (Strengthen, Weaken, Assumption, Evaluate)', difficulty: 4, estimatedHours: 22, weight: 1.3, tags: ['verbal'] },
                { id: 'verbal-cr-advanced', title: 'Critical Reasoning — Advanced (Boldface, Paradox, Flaw)', difficulty: 4, estimatedHours: 14, tags: ['verbal'] }
            ]
        },
        {
            id: 'gmat-di',
            name: 'Data Insights',
            type: 'compulsory',
            topics: [
                { id: 'di-data-sufficiency', title: 'Data Sufficiency', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['data-insights'] },
                { id: 'di-multi-source', title: 'Multi-Source Reasoning', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['data-insights'] },
                { id: 'di-graphics', title: 'Graphics Interpretation', difficulty: 3, estimatedHours: 10, tags: ['data-insights'] },
                { id: 'di-two-part', title: 'Two-Part Analysis', difficulty: 4, estimatedHours: 12, weight: 1.2, tags: ['data-insights'] },
                { id: 'di-table', title: 'Table Analysis', difficulty: 3, estimatedHours: 10, tags: ['data-insights'] }
            ]
        }
    ]
};
