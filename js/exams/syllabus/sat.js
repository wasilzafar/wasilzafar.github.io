// ============================================================
// SAT Syllabus Data — Digital SAT (2024+ format)
// Version: 2026.1 | Updated: 2026-05-22
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['sat'] = {
    version: '2026.1',
    updatedAt: '2026-05-22',
    examName: 'SAT (Digital)',
    totalMarks: 1600,
    sections: [
        {
            id: 'sat-rw',
            name: 'Reading & Writing',
            type: 'compulsory',
            topics: [
                { id: 'rw-craft-structure', title: 'Craft & Structure — Word meaning in context', difficulty: 2, estimatedHours: 8, tags: ['reading'] },
                { id: 'rw-text-structure', title: 'Craft & Structure — Text structure & purpose', difficulty: 2, estimatedHours: 6, tags: ['reading'] },
                { id: 'rw-cross-text', title: 'Craft & Structure — Cross-text connections', difficulty: 3, estimatedHours: 6, tags: ['reading'] },
                { id: 'rw-central-ideas', title: 'Information & Ideas — Central ideas & details', difficulty: 2, estimatedHours: 8, tags: ['reading'] },
                { id: 'rw-command-evidence', title: 'Information & Ideas — Command of textual evidence', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['reading'] },
                { id: 'rw-inferences', title: 'Information & Ideas — Inferences', difficulty: 3, estimatedHours: 8, weight: 1.2, tags: ['reading'] },
                { id: 'rw-rhetoric', title: 'Expression of Ideas — Rhetorical synthesis', difficulty: 3, estimatedHours: 8, tags: ['writing'] },
                { id: 'rw-transitions', title: 'Expression of Ideas — Transitions', difficulty: 2, estimatedHours: 5, tags: ['writing'] },
                { id: 'rw-boundaries', title: 'Standard English — Boundaries (punctuation)', difficulty: 2, estimatedHours: 6, tags: ['grammar'] },
                { id: 'rw-form-structure', title: 'Standard English — Form, structure & sense', difficulty: 2, estimatedHours: 6, tags: ['grammar'] },
                { id: 'rw-subject-verb', title: 'Standard English — Subject-verb agreement', difficulty: 1, estimatedHours: 4, weight: 0.8, tags: ['grammar'] },
                { id: 'rw-pronoun-clarity', title: 'Standard English — Pronoun-antecedent clarity', difficulty: 2, estimatedHours: 4, weight: 0.8, tags: ['grammar'] }
            ]
        },
        {
            id: 'sat-math',
            name: 'Math',
            type: 'compulsory',
            topics: [
                { id: 'math-linear-eq', title: 'Algebra — Linear equations in 1 variable', difficulty: 1, estimatedHours: 4, tags: ['algebra'] },
                { id: 'math-linear-ineq', title: 'Algebra — Linear inequalities', difficulty: 2, estimatedHours: 4, tags: ['algebra'] },
                { id: 'math-linear-sys', title: 'Algebra — Systems of linear equations', difficulty: 2, estimatedHours: 6, tags: ['algebra'] },
                { id: 'math-linear-func', title: 'Algebra — Linear functions & graphs', difficulty: 2, estimatedHours: 6, tags: ['algebra'] },
                { id: 'math-quadratic', title: 'Advanced Math — Quadratic equations & expressions', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['advanced-math'] },
                { id: 'math-polynomial', title: 'Advanced Math — Polynomial & rational expressions', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['advanced-math'] },
                { id: 'math-nonlinear', title: 'Advanced Math — Nonlinear equations & systems', difficulty: 4, estimatedHours: 10, weight: 1.3, tags: ['advanced-math'] },
                { id: 'math-exponential', title: 'Advanced Math — Exponential & radical functions', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['advanced-math'] },
                { id: 'math-ratios', title: 'Problem Solving — Ratios, rates & proportions', difficulty: 2, estimatedHours: 5, tags: ['problem-solving'] },
                { id: 'math-percentages', title: 'Problem Solving — Percentages & unit conversion', difficulty: 2, estimatedHours: 4, tags: ['problem-solving'] },
                { id: 'math-statistics', title: 'Problem Solving — Statistics & probability', difficulty: 3, estimatedHours: 8, tags: ['data-analysis'] },
                { id: 'math-data-dist', title: 'Problem Solving — Data distributions & scatter plots', difficulty: 3, estimatedHours: 6, tags: ['data-analysis'] },
                { id: 'math-geometry-area', title: 'Geometry & Trig — Area & volume', difficulty: 2, estimatedHours: 5, tags: ['geometry'] },
                { id: 'math-geometry-lines', title: 'Geometry & Trig — Lines, angles & triangles', difficulty: 2, estimatedHours: 5, tags: ['geometry'] },
                { id: 'math-geometry-circles', title: 'Geometry & Trig — Circles & coordinate geometry', difficulty: 3, estimatedHours: 6, tags: ['geometry'] },
                { id: 'math-trig', title: 'Geometry & Trig — Trigonometry basics', difficulty: 3, estimatedHours: 6, tags: ['geometry'] }
            ]
        }
    ]
};
