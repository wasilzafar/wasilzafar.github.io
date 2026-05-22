// ============================================================
// AP (Advanced Placement) — Multi-Subject Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['ap'] = {
    examName: 'AP Examinations (Core Subjects)',
    version: '2026',
    sections: [
        {
            id: 'ap-calculus',
            name: 'AP Calculus AB/BC',
            type: 'optional',
            topics: [
                { id: 'calc-limits', title: 'Limits & Continuity', difficulty: 3, estimatedHours: 12, tags: ['calculus'] },
                { id: 'calc-differentiation', title: 'Differentiation (Rules, Applications, Related Rates)', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['calculus'] },
                { id: 'calc-integration', title: 'Integration (Techniques, Applications, FTC)', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['calculus'] },
                { id: 'calc-series', title: 'Infinite Series & Taylor Polynomials (BC only)', difficulty: 4, estimatedHours: 16, tags: ['calculus'] },
                { id: 'calc-diffeq', title: 'Differential Equations & Slope Fields', difficulty: 3, estimatedHours: 10, tags: ['calculus'] }
            ]
        },
        {
            id: 'ap-physics',
            name: 'AP Physics (Mechanics + E&M)',
            type: 'optional',
            topics: [
                { id: 'phys-kinematics', title: 'Kinematics & Newton\'s Laws', difficulty: 3, estimatedHours: 14, tags: ['physics'] },
                { id: 'phys-energy', title: 'Work, Energy & Momentum', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['physics'] },
                { id: 'phys-rotation', title: 'Rotation & Gravitation', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['physics'] },
                { id: 'phys-electrostatics', title: 'Electrostatics & Electric Fields', difficulty: 3, estimatedHours: 14, tags: ['physics'] },
                { id: 'phys-circuits', title: 'Circuits & Magnetism', difficulty: 3, estimatedHours: 14, tags: ['physics'] }
            ]
        },
        {
            id: 'ap-chemistry',
            name: 'AP Chemistry',
            type: 'optional',
            topics: [
                { id: 'chem-atomic', title: 'Atomic Structure & Periodicity', difficulty: 2, estimatedHours: 10, tags: ['chemistry'] },
                { id: 'chem-bonding', title: 'Bonding & Intermolecular Forces', difficulty: 3, estimatedHours: 12, tags: ['chemistry'] },
                { id: 'chem-kinetics', title: 'Kinetics & Equilibrium', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['chemistry'] },
                { id: 'chem-thermo', title: 'Thermodynamics & Electrochemistry', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['chemistry'] },
                { id: 'chem-acid-base', title: 'Acid-Base Chemistry & Solutions', difficulty: 3, estimatedHours: 12, tags: ['chemistry'] }
            ]
        },
        {
            id: 'ap-biology',
            name: 'AP Biology',
            type: 'optional',
            topics: [
                { id: 'bio-cell', title: 'Cell Biology & Molecular Biology', difficulty: 3, estimatedHours: 14, tags: ['biology'] },
                { id: 'bio-genetics', title: 'Genetics, Gene Expression & Heredity', difficulty: 3, estimatedHours: 16, weight: 1.3, tags: ['biology'] },
                { id: 'bio-evolution', title: 'Evolution & Natural Selection', difficulty: 3, estimatedHours: 12, tags: ['biology'] },
                { id: 'bio-ecology', title: 'Ecology & Interactions', difficulty: 2, estimatedHours: 10, tags: ['biology'] },
                { id: 'bio-physiology', title: 'Plant & Animal Physiology', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['biology'] }
            ]
        },
        {
            id: 'ap-cs',
            name: 'AP Computer Science A',
            type: 'optional',
            topics: [
                { id: 'cs-java-basics', title: 'Java Basics (Variables, Control Flow, Methods)', difficulty: 2, estimatedHours: 10, tags: ['cs'] },
                { id: 'cs-oop', title: 'Object-Oriented Programming (Classes, Inheritance, Polymorphism)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['cs'] },
                { id: 'cs-arrays', title: 'Arrays, ArrayLists & 2D Arrays', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['cs'] },
                { id: 'cs-recursion', title: 'Recursion & Searching/Sorting', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['cs'] }
            ]
        }
    ]
};
