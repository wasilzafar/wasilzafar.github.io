// ============================================================
// Gaokao (高考) — National College Entrance Examination (China)
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['gaokao'] = {
    examName: 'Gaokao (National College Entrance Examination)',
    version: '2026',
    sections: [
        {
            id: 'gaokao-chinese',
            name: 'Chinese Language & Literature (语文)',
            type: 'compulsory',
            topics: [
                { id: 'cn-modern-reading', title: 'Modern Text Reading & Information Extraction', difficulty: 3, estimatedHours: 18, tags: ['chinese'] },
                { id: 'cn-classical', title: 'Classical Chinese (文言文) Reading & Translation', difficulty: 4, estimatedHours: 22, weight: 1.2, tags: ['chinese'] },
                { id: 'cn-poetry', title: 'Poetry Appreciation & Analysis', difficulty: 3, estimatedHours: 14, tags: ['chinese'] },
                { id: 'cn-composition', title: 'Composition (议论文/记叙文, 800+ characters)', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['chinese'] },
                { id: 'cn-grammar', title: 'Language Knowledge & Expression', difficulty: 2, estimatedHours: 10, tags: ['chinese'] }
            ]
        },
        {
            id: 'gaokao-maths',
            name: 'Mathematics (数学)',
            type: 'compulsory',
            topics: [
                { id: 'math-functions', title: 'Functions & Derivatives', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['maths'] },
                { id: 'math-trig', title: 'Trigonometry & Trigonometric Functions', difficulty: 3, estimatedHours: 16, tags: ['maths'] },
                { id: 'math-sequences', title: 'Sequences & Series (Arithmetic, Geometric)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['maths'] },
                { id: 'math-geometry', title: 'Solid Geometry (3D reasoning & calculations)', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['maths'] },
                { id: 'math-analytic', title: 'Analytic Geometry (Conics: Ellipse, Hyperbola, Parabola)', difficulty: 5, estimatedHours: 24, weight: 1.3, tags: ['maths'] },
                { id: 'math-probability', title: 'Probability & Statistics', difficulty: 3, estimatedHours: 14, tags: ['maths'] },
                { id: 'math-inequalities', title: 'Inequalities & Proofs', difficulty: 4, estimatedHours: 14, tags: ['maths'] }
            ]
        },
        {
            id: 'gaokao-english',
            name: 'English (英语)',
            type: 'compulsory',
            topics: [
                { id: 'eng-listening', title: 'Listening Comprehension', difficulty: 2, estimatedHours: 12, weight: 0.9, tags: ['english'] },
                { id: 'eng-reading', title: 'Reading Comprehension (4 passages)', difficulty: 3, estimatedHours: 18, weight: 1.3, tags: ['english'] },
                { id: 'eng-cloze', title: 'Cloze Test & Grammar Fill-in', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['english'] },
                { id: 'eng-writing', title: 'Writing (Application letter, Continuation writing)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['english'] }
            ]
        },
        {
            id: 'gaokao-physics',
            name: 'Physics (物理) — Elective',
            type: 'optional',
            topics: [
                { id: 'phys-mechanics', title: 'Mechanics (Newton\'s Laws, Energy, Momentum)', difficulty: 4, estimatedHours: 28, weight: 1.3, tags: ['physics'] },
                { id: 'phys-electricity', title: 'Electricity & Magnetism', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['physics'] },
                { id: 'phys-waves', title: 'Waves, Optics & Thermodynamics', difficulty: 3, estimatedHours: 14, tags: ['physics'] },
                { id: 'phys-modern', title: 'Modern Physics (Atomic, Nuclear)', difficulty: 3, estimatedHours: 10, tags: ['physics'] }
            ]
        },
        {
            id: 'gaokao-chemistry',
            name: 'Chemistry (化学) — Elective',
            type: 'optional',
            topics: [
                { id: 'chem-structure', title: 'Atomic Structure & Periodicity', difficulty: 3, estimatedHours: 14, tags: ['chemistry'] },
                { id: 'chem-reactions', title: 'Chemical Reactions & Equilibrium', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['chemistry'] },
                { id: 'chem-organic', title: 'Organic Chemistry (Synthesis & Mechanisms)', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['chemistry'] },
                { id: 'chem-inorganic', title: 'Inorganic & Industrial Chemistry', difficulty: 3, estimatedHours: 14, tags: ['chemistry'] }
            ]
        }
    ]
};
