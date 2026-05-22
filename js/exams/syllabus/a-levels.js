// ============================================================
// A-Levels — Syllabus (Core Subjects)
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['a-levels'] = {
    examName: 'A-Levels (GCE Advanced Level)',
    version: '2026',
    sections: [
        {
            id: 'al-maths',
            name: 'Mathematics',
            type: 'optional',
            topics: [
                { id: 'maths-pure1', title: 'Pure Mathematics 1 (Algebra, Quadratics, Coordinate Geometry)', difficulty: 3, estimatedHours: 20, tags: ['maths'] },
                { id: 'maths-pure2', title: 'Pure Mathematics 2 (Trigonometry, Sequences, Differentiation)', difficulty: 3, estimatedHours: 22, weight: 1.2, tags: ['maths'] },
                { id: 'maths-pure3', title: 'Pure Mathematics 3 (Integration, Vectors, Differential Equations)', difficulty: 4, estimatedHours: 24, weight: 1.2, tags: ['maths'] },
                { id: 'maths-stats', title: 'Statistics (Probability, Distributions, Hypothesis Testing)', difficulty: 3, estimatedHours: 18, tags: ['maths'] },
                { id: 'maths-mechanics', title: 'Mechanics (Forces, Kinematics, Moments, Energy)', difficulty: 3, estimatedHours: 18, tags: ['maths'] }
            ]
        },
        {
            id: 'al-physics',
            name: 'Physics',
            type: 'optional',
            topics: [
                { id: 'phys-mechanics', title: 'Mechanics & Materials (Forces, Motion, Stress/Strain)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['physics'] },
                { id: 'phys-waves', title: 'Waves & Optics (Interference, Diffraction, Standing Waves)', difficulty: 3, estimatedHours: 16, tags: ['physics'] },
                { id: 'phys-electricity', title: 'Electricity (Circuits, EMF, Internal Resistance)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['physics'] },
                { id: 'phys-fields', title: 'Fields (Gravitational, Electric, Magnetic)', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['physics'] },
                { id: 'phys-nuclear', title: 'Nuclear & Particle Physics', difficulty: 3, estimatedHours: 14, tags: ['physics'] },
                { id: 'phys-thermal', title: 'Thermal Physics & Ideal Gases', difficulty: 3, estimatedHours: 12, tags: ['physics'] }
            ]
        },
        {
            id: 'al-chemistry',
            name: 'Chemistry',
            type: 'optional',
            topics: [
                { id: 'chem-physical', title: 'Physical Chemistry (Energetics, Kinetics, Equilibria)', difficulty: 3, estimatedHours: 22, weight: 1.2, tags: ['chemistry'] },
                { id: 'chem-inorganic', title: 'Inorganic Chemistry (Periodicity, Groups, Transition Metals)', difficulty: 3, estimatedHours: 18, tags: ['chemistry'] },
                { id: 'chem-organic', title: 'Organic Chemistry (Mechanisms, Synthesis, Analysis)', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['chemistry'] },
                { id: 'chem-analytical', title: 'Analytical Techniques (Mass Spec, IR, NMR)', difficulty: 3, estimatedHours: 12, tags: ['chemistry'] }
            ]
        },
        {
            id: 'al-biology',
            name: 'Biology',
            type: 'optional',
            topics: [
                { id: 'bio-cells', title: 'Cell Biology & Biological Molecules', difficulty: 3, estimatedHours: 16, tags: ['biology'] },
                { id: 'bio-genetics', title: 'Genetics, DNA Technology & Gene Expression', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['biology'] },
                { id: 'bio-physiology', title: 'Human Physiology (Gas Exchange, Transport, Homeostasis)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['biology'] },
                { id: 'bio-ecology', title: 'Ecology, Energy Transfer & Populations', difficulty: 2, estimatedHours: 14, tags: ['biology'] },
                { id: 'bio-evolution', title: 'Evolution, Classification & Biodiversity', difficulty: 2, estimatedHours: 12, tags: ['biology'] }
            ]
        }
    ]
};
