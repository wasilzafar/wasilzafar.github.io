// ============================================================
// Cambridge IGCSE — Syllabus (Core Subjects)
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['cambridge-igcse'] = {
    examName: 'Cambridge IGCSE',
    version: '2026',
    sections: [
        {
            id: 'igcse-maths',
            name: 'Mathematics (0580)',
            type: 'optional',
            topics: [
                { id: 'maths-number', title: 'Number (Fractions, Ratios, Percentages, Standard Form)', difficulty: 2, estimatedHours: 14, tags: ['maths'] },
                { id: 'maths-algebra', title: 'Algebra (Expressions, Equations, Sequences, Functions)', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['maths'] },
                { id: 'maths-geometry', title: 'Geometry (Angles, Polygons, Transformations, Vectors)', difficulty: 3, estimatedHours: 16, tags: ['maths'] },
                { id: 'maths-statistics', title: 'Statistics & Probability', difficulty: 2, estimatedHours: 12, tags: ['maths'] },
                { id: 'maths-mensuration', title: 'Mensuration (Areas, Volumes, Trigonometry)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['maths'] }
            ]
        },
        {
            id: 'igcse-english',
            name: 'English Language (0500)',
            type: 'optional',
            topics: [
                { id: 'eng-reading', title: 'Reading Comprehension & Writer\'s Effects', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['english'] },
                { id: 'eng-summary', title: 'Summary & Note-Making', difficulty: 3, estimatedHours: 10, tags: ['english'] },
                { id: 'eng-directed', title: 'Directed Writing (Letters, Reports, Articles)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['english'] },
                { id: 'eng-composition', title: 'Composition (Narrative & Descriptive)', difficulty: 3, estimatedHours: 14, tags: ['english'] }
            ]
        },
        {
            id: 'igcse-physics',
            name: 'Physics (0625)',
            type: 'optional',
            topics: [
                { id: 'phys-motion', title: 'Motion, Forces & Energy', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['physics'] },
                { id: 'phys-thermal', title: 'Thermal Physics', difficulty: 2, estimatedHours: 10, tags: ['physics'] },
                { id: 'phys-waves', title: 'Waves (Sound, Light, EM Spectrum)', difficulty: 3, estimatedHours: 12, tags: ['physics'] },
                { id: 'phys-electricity', title: 'Electricity & Magnetism', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['physics'] },
                { id: 'phys-nuclear', title: 'Nuclear Physics & Radioactivity', difficulty: 3, estimatedHours: 10, tags: ['physics'] }
            ]
        },
        {
            id: 'igcse-chemistry',
            name: 'Chemistry (0620)',
            type: 'optional',
            topics: [
                { id: 'chem-states', title: 'States of Matter & Atomic Structure', difficulty: 2, estimatedHours: 10, tags: ['chemistry'] },
                { id: 'chem-bonding', title: 'Bonding & Stoichiometry', difficulty: 3, estimatedHours: 14, tags: ['chemistry'] },
                { id: 'chem-acids', title: 'Acids, Bases & Salts', difficulty: 2, estimatedHours: 10, tags: ['chemistry'] },
                { id: 'chem-reactions', title: 'Reactivity, Redox & Electrochemistry', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['chemistry'] },
                { id: 'chem-organic', title: 'Organic Chemistry (Hydrocarbons, Polymers)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['chemistry'] }
            ]
        },
        {
            id: 'igcse-biology',
            name: 'Biology (0610)',
            type: 'optional',
            topics: [
                { id: 'bio-cells', title: 'Cells, Enzymes & Biological Molecules', difficulty: 2, estimatedHours: 12, tags: ['biology'] },
                { id: 'bio-plant', title: 'Plant Biology (Nutrition, Transport, Reproduction)', difficulty: 2, estimatedHours: 14, tags: ['biology'] },
                { id: 'bio-human', title: 'Human Biology (Nutrition, Gas Exchange, Circulation)', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['biology'] },
                { id: 'bio-homeostasis', title: 'Homeostasis, Coordination & Response', difficulty: 3, estimatedHours: 14, tags: ['biology'] },
                { id: 'bio-genetics', title: 'Genetics, Variation & Evolution', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['biology'] },
                { id: 'bio-ecology', title: 'Ecology & Environment', difficulty: 2, estimatedHours: 10, tags: ['biology'] }
            ]
        }
    ]
};
