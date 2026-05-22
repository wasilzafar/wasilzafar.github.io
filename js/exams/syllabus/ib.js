// ============================================================
// IB Diploma Programme — Syllabus (Core Subjects)
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['ib'] = {
    examName: 'IB Diploma Programme',
    version: '2026',
    sections: [
        {
            id: 'ib-tok',
            name: 'Theory of Knowledge (TOK)',
            type: 'compulsory',
            topics: [
                { id: 'tok-essay', title: 'TOK Essay (1600 words, prescribed title)', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['tok'] },
                { id: 'tok-exhibition', title: 'TOK Exhibition (Three Objects, Real-World Connection)', difficulty: 3, estimatedHours: 12, tags: ['tok'] },
                { id: 'tok-ways', title: 'Ways of Knowing & Areas of Knowledge', difficulty: 3, estimatedHours: 10, tags: ['tok'] }
            ]
        },
        {
            id: 'ib-ee',
            name: 'Extended Essay (EE)',
            type: 'compulsory',
            topics: [
                { id: 'ee-research', title: 'Research Question & Methodology', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['extended-essay'] },
                { id: 'ee-writing', title: 'Academic Writing & Argument Structure (4000 words)', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['extended-essay'] },
                { id: 'ee-reflection', title: 'Researcher\'s Reflection Space (RPPF)', difficulty: 2, estimatedHours: 6, tags: ['extended-essay'] }
            ]
        },
        {
            id: 'ib-maths-aa',
            name: 'Mathematics: Analysis & Approaches (HL)',
            type: 'optional',
            topics: [
                { id: 'maa-algebra', title: 'Algebra (Sequences, Binomial, Complex Numbers, Proof)', difficulty: 3, estimatedHours: 18, tags: ['maths'] },
                { id: 'maa-functions', title: 'Functions (Transformations, Composite, Inverse)', difficulty: 3, estimatedHours: 16, tags: ['maths'] },
                { id: 'maa-trig', title: 'Trigonometry & Circular Functions', difficulty: 3, estimatedHours: 14, tags: ['maths'] },
                { id: 'maa-calculus', title: 'Calculus (Differentiation, Integration, Differential Equations)', difficulty: 4, estimatedHours: 28, weight: 1.3, tags: ['maths'] },
                { id: 'maa-stats', title: 'Statistics & Probability', difficulty: 3, estimatedHours: 16, tags: ['maths'] },
                { id: 'maa-vectors', title: 'Vectors & 3D Space', difficulty: 3, estimatedHours: 12, tags: ['maths'] }
            ]
        },
        {
            id: 'ib-physics',
            name: 'Physics (HL)',
            type: 'optional',
            topics: [
                { id: 'phys-mechanics', title: 'Mechanics (Kinematics, Forces, Momentum, Energy)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['physics'] },
                { id: 'phys-thermal', title: 'Thermal Physics & Ideal Gas Law', difficulty: 3, estimatedHours: 12, tags: ['physics'] },
                { id: 'phys-waves', title: 'Waves & Oscillations', difficulty: 3, estimatedHours: 14, tags: ['physics'] },
                { id: 'phys-electricity', title: 'Electricity & Magnetism', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['physics'] },
                { id: 'phys-nuclear', title: 'Atomic, Nuclear & Particle Physics', difficulty: 3, estimatedHours: 14, tags: ['physics'] },
                { id: 'phys-fields', title: 'Fields (HL: Gravitational, Electric, Magnetic)', difficulty: 4, estimatedHours: 18, weight: 1.3, tags: ['physics'] }
            ]
        },
        {
            id: 'ib-english',
            name: 'English A: Language & Literature (HL)',
            type: 'optional',
            topics: [
                { id: 'eng-text-analysis', title: 'Textual Analysis & Commentary', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['english'] },
                { id: 'eng-comparative', title: 'Comparative Essay (Paper 2)', difficulty: 4, estimatedHours: 16, weight: 1.3, tags: ['english'] },
                { id: 'eng-hl-essay', title: 'HL Essay (1200-1500 words, literary focus)', difficulty: 4, estimatedHours: 18, tags: ['english'] },
                { id: 'eng-io', title: 'Individual Oral (15 min, global issue + 2 texts)', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['english'] }
            ]
        }
    ]
};
