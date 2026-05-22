// ============================================================
// JEE Advanced — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['jee-advanced'] = {
    examName: 'JEE Advanced',
    version: '2026',
    sections: [
        {
            id: 'jee-adv-physics',
            name: 'Physics',
            type: 'compulsory',
            topics: [
                { id: 'adv-phy-mechanics', title: 'Mechanics (Newton\'s Laws, Rotation, SHM, Gravitation)', difficulty: 5, estimatedHours: 50, weight: 1.3, tags: ['physics'] },
                { id: 'adv-phy-fluids', title: 'Fluid Mechanics & Properties of Matter', difficulty: 4, estimatedHours: 16, tags: ['physics'] },
                { id: 'adv-phy-thermo', title: 'Thermodynamics & Kinetic Theory', difficulty: 4, estimatedHours: 22, weight: 1.2, tags: ['physics'] },
                { id: 'adv-phy-waves', title: 'Waves, Sound & Optics', difficulty: 4, estimatedHours: 24, weight: 1.2, tags: ['physics'] },
                { id: 'adv-phy-electrostatics', title: 'Electrostatics & Capacitance', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['physics'] },
                { id: 'adv-phy-current-mag', title: 'Current Electricity & Magnetism', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['physics'] },
                { id: 'adv-phy-emi', title: 'Electromagnetic Induction & AC Circuits', difficulty: 4, estimatedHours: 18, tags: ['physics'] },
                { id: 'adv-phy-modern', title: 'Modern Physics (Atomic, Nuclear, Photoelectric)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['physics'] }
            ]
        },
        {
            id: 'jee-adv-chemistry',
            name: 'Chemistry',
            type: 'compulsory',
            topics: [
                { id: 'adv-chem-physical-thermo', title: 'Physical Chemistry — Thermodynamics & Equilibrium', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['chemistry', 'physical'] },
                { id: 'adv-chem-physical-electro', title: 'Physical Chemistry — Electrochemistry & Kinetics', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['chemistry', 'physical'] },
                { id: 'adv-chem-physical-atomic', title: 'Physical Chemistry — Atomic Structure & Bonding', difficulty: 3, estimatedHours: 14, tags: ['chemistry', 'physical'] },
                { id: 'adv-chem-physical-solutions', title: 'Physical Chemistry — Solutions & Colligative Properties', difficulty: 3, estimatedHours: 12, tags: ['chemistry', 'physical'] },
                { id: 'adv-chem-organic-goc', title: 'Organic Chemistry — GOC & Reaction Mechanisms', difficulty: 5, estimatedHours: 30, weight: 1.3, tags: ['chemistry', 'organic'] },
                { id: 'adv-chem-organic-named', title: 'Organic Chemistry — Named Reactions & Synthesis', difficulty: 4, estimatedHours: 22, weight: 1.3, tags: ['chemistry', 'organic'] },
                { id: 'adv-chem-inorganic-periodic', title: 'Inorganic Chemistry — Periodicity & Bonding', difficulty: 3, estimatedHours: 14, tags: ['chemistry', 'inorganic'] },
                { id: 'adv-chem-inorganic-coord', title: 'Inorganic Chemistry — Coordination & Metallurgy', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['chemistry', 'inorganic'] },
                { id: 'adv-chem-inorganic-blocks', title: 'Inorganic Chemistry — s, p, d, f Block Elements', difficulty: 3, estimatedHours: 18, tags: ['chemistry', 'inorganic'] }
            ]
        },
        {
            id: 'jee-adv-maths',
            name: 'Mathematics',
            type: 'compulsory',
            topics: [
                { id: 'adv-math-calculus', title: 'Calculus (Limits, Continuity, Differentiation, Integration)', difficulty: 5, estimatedHours: 50, weight: 1.3, tags: ['maths'] },
                { id: 'adv-math-algebra', title: 'Algebra (Complex Numbers, Quadratics, Sequences, Binomial)', difficulty: 4, estimatedHours: 30, weight: 1.2, tags: ['maths'] },
                { id: 'adv-math-coordinate', title: 'Coordinate Geometry (Conics, Straight Lines, Circles)', difficulty: 4, estimatedHours: 28, weight: 1.2, tags: ['maths'] },
                { id: 'adv-math-trigonometry', title: 'Trigonometry (Identities, Equations, Properties of Triangles)', difficulty: 3, estimatedHours: 18, tags: ['maths'] },
                { id: 'adv-math-vectors-3d', title: 'Vectors & 3D Geometry', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['maths'] },
                { id: 'adv-math-probability', title: 'Probability & Permutations/Combinations', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['maths'] },
                { id: 'adv-math-matrices', title: 'Matrices & Determinants', difficulty: 3, estimatedHours: 14, tags: ['maths'] },
                { id: 'adv-math-diffeq', title: 'Differential Equations', difficulty: 4, estimatedHours: 16, tags: ['maths'] }
            ]
        }
    ]
};
