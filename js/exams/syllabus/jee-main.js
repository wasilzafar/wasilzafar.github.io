// ============================================================
// JEE Main Syllabus Data
// Version: 2026.1 | Updated: 2026-05-22
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['jee-main'] = {
    version: '2026.1',
    updatedAt: '2026-05-22',
    examName: 'JEE Main',
    totalMarks: 300,
    sections: [
        {
            id: 'jee-physics',
            name: 'Physics',
            type: 'compulsory',
            topics: [
                { id: 'phy-units', title: 'Units, Measurements & Dimensional Analysis', difficulty: 1, estimatedHours: 6, tags: ['general'] },
                { id: 'phy-mechanics-kinematics', title: 'Kinematics (1D & 2D)', difficulty: 2, estimatedHours: 12, weight: 1.3, tags: ['mechanics'] },
                { id: 'phy-mechanics-laws', title: 'Laws of Motion & Friction', difficulty: 3, estimatedHours: 14, weight: 1.3, tags: ['mechanics'] },
                { id: 'phy-mechanics-work', title: 'Work, Energy & Power', difficulty: 2, estimatedHours: 10, weight: 1.3, tags: ['mechanics'] },
                { id: 'phy-mechanics-com', title: 'Centre of Mass & Collisions', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['mechanics'] },
                { id: 'phy-rotation', title: 'Rotational Motion', difficulty: 4, estimatedHours: 16, weight: 1.3, tags: ['mechanics'] },
                { id: 'phy-gravitation', title: 'Gravitation', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['mechanics'] },
                { id: 'phy-shm', title: 'Simple Harmonic Motion', difficulty: 3, estimatedHours: 10, tags: ['waves'] },
                { id: 'phy-waves', title: 'Waves & Sound', difficulty: 3, estimatedHours: 12, tags: ['waves'] },
                { id: 'phy-thermo', title: 'Thermodynamics & KTG', difficulty: 3, estimatedHours: 14, tags: ['thermo'] },
                { id: 'phy-fluids', title: 'Properties of Matter & Fluid Mechanics', difficulty: 2, estimatedHours: 8, tags: ['mechanics'] },
                { id: 'phy-electrostatics', title: 'Electrostatics', difficulty: 3, estimatedHours: 14, tags: ['electromagnetism'] },
                { id: 'phy-current', title: 'Current Electricity', difficulty: 3, estimatedHours: 12, tags: ['electromagnetism'] },
                { id: 'phy-magnetism', title: 'Magnetism & Magnetic Effects of Current', difficulty: 3, estimatedHours: 14, tags: ['electromagnetism'] },
                { id: 'phy-emi', title: 'Electromagnetic Induction & AC', difficulty: 3, estimatedHours: 12, tags: ['electromagnetism'] },
                { id: 'phy-emwaves', title: 'EM Waves', difficulty: 1, estimatedHours: 4, tags: ['waves'] },
                { id: 'phy-optics', title: 'Ray & Wave Optics', difficulty: 3, estimatedHours: 14, tags: ['optics'] },
                { id: 'phy-modern', title: 'Modern Physics (Dual Nature, Atoms, Nuclei)', difficulty: 3, estimatedHours: 12, tags: ['modern'] },
                { id: 'phy-semiconductor', title: 'Semiconductor Electronics', difficulty: 2, estimatedHours: 6, tags: ['modern'] },
                { id: 'phy-experimental', title: 'Experimental Skills & Error Analysis', difficulty: 2, estimatedHours: 8, tags: ['practical'] }
            ]
        },
        {
            id: 'jee-chemistry',
            name: 'Chemistry',
            type: 'compulsory',
            topics: [
                { id: 'chem-basic', title: 'Mole Concept, Stoichiometry & Basic Concepts', difficulty: 2, estimatedHours: 10, weight: 1.2, tags: ['physical'] },
                { id: 'chem-atomic', title: 'Atomic Structure & Chemical Bonding', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['physical'] },
                { id: 'chem-states', title: 'States of Matter & Solutions', difficulty: 2, estimatedHours: 10, weight: 1.2, tags: ['physical'] },
                { id: 'chem-thermo', title: 'Chemical Thermodynamics', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['physical'] },
                { id: 'chem-equilibrium', title: 'Chemical & Ionic Equilibrium', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['physical'] },
                { id: 'chem-kinetics', title: 'Chemical Kinetics', difficulty: 2, estimatedHours: 8, weight: 1.2, tags: ['physical'] },
                { id: 'chem-electrochem', title: 'Electrochemistry', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['physical'] },
                { id: 'chem-surface', title: 'Surface Chemistry & Colloids', difficulty: 1, estimatedHours: 5, weight: 1.2, tags: ['physical'] },
                { id: 'chem-periodic', title: 'Periodic Table & Properties', difficulty: 2, estimatedHours: 8, tags: ['inorganic'] },
                { id: 'chem-sblock', title: 's-Block Elements', difficulty: 1, estimatedHours: 6, weight: 0.8, tags: ['inorganic'] },
                { id: 'chem-pblock', title: 'p-Block Elements', difficulty: 3, estimatedHours: 16, tags: ['inorganic'] },
                { id: 'chem-dblock', title: 'd & f-Block Elements & Coordination Chemistry', difficulty: 3, estimatedHours: 14, tags: ['inorganic'] },
                { id: 'chem-salt-analysis', title: 'Qualitative Analysis & Salt Identification', difficulty: 2, estimatedHours: 6, tags: ['inorganic'] },
                { id: 'chem-goc', title: 'General Organic Chemistry (GOC) & IUPAC', difficulty: 3, estimatedHours: 14, weight: 1.3, tags: ['organic'] },
                { id: 'chem-hydrocarbons', title: 'Hydrocarbons (Alkanes, Alkenes, Alkynes, Aromatics)', difficulty: 3, estimatedHours: 12, weight: 1.3, tags: ['organic'] },
                { id: 'chem-haloalkanes', title: 'Haloalkanes & Haloarenes', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['organic'] },
                { id: 'chem-alcohols', title: 'Alcohols, Phenols & Ethers', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['organic'] },
                { id: 'chem-carbonyl', title: 'Aldehydes, Ketones & Carboxylic Acids', difficulty: 3, estimatedHours: 12, weight: 1.3, tags: ['organic'] },
                { id: 'chem-nitrogen', title: 'Amines & Nitrogen Compounds', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['organic'] },
                { id: 'chem-biomolecules', title: 'Biomolecules & Polymers', difficulty: 1, estimatedHours: 5, weight: 1.3, tags: ['organic'] },
                { id: 'chem-practical', title: 'Practical Chemistry (Titrations, Salt Analysis, Preparations)', difficulty: 2, estimatedHours: 6, tags: ['practical'] }
            ]
        },
        {
            id: 'jee-maths',
            name: 'Mathematics',
            type: 'compulsory',
            topics: [
                { id: 'math-sets', title: 'Sets, Relations & Functions', difficulty: 2, estimatedHours: 8, weight: 0.8, tags: ['algebra'] },
                { id: 'math-complex', title: 'Complex Numbers', difficulty: 3, estimatedHours: 10, tags: ['algebra'] },
                { id: 'math-quadratic-jee', title: 'Quadratic Equations & Inequalities', difficulty: 3, estimatedHours: 10, tags: ['algebra'] },
                { id: 'math-pnc', title: 'Permutations & Combinations', difficulty: 3, estimatedHours: 10, tags: ['algebra'] },
                { id: 'math-binomial', title: 'Binomial Theorem', difficulty: 2, estimatedHours: 6, tags: ['algebra'] },
                { id: 'math-sequences', title: 'Sequences & Series (AP, GP, HP)', difficulty: 3, estimatedHours: 10, tags: ['algebra'] },
                { id: 'math-matrices', title: 'Matrices & Determinants', difficulty: 3, estimatedHours: 12, tags: ['algebra'] },
                { id: 'math-trig-jee', title: 'Trigonometry (Identities, Equations, Properties)', difficulty: 3, estimatedHours: 14, tags: ['trigonometry'] },
                { id: 'math-coord-straight', title: 'Coordinate Geometry — Straight Lines', difficulty: 2, estimatedHours: 8, weight: 1.2, tags: ['coordinate'] },
                { id: 'math-coord-circles', title: 'Coordinate Geometry — Circles', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['coordinate'] },
                { id: 'math-coord-conics', title: 'Coordinate Geometry — Parabola, Ellipse, Hyperbola', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['coordinate'] },
                { id: 'math-limits', title: 'Limits, Continuity & Differentiability', difficulty: 3, estimatedHours: 12, tags: ['calculus'] },
                { id: 'math-differentiation', title: 'Differentiation & Applications', difficulty: 3, estimatedHours: 14, tags: ['calculus'] },
                { id: 'math-integration', title: 'Indefinite & Definite Integration', difficulty: 4, estimatedHours: 18, tags: ['calculus'] },
                { id: 'math-diffequations', title: 'Differential Equations', difficulty: 3, estimatedHours: 10, tags: ['calculus'] },
                { id: 'math-vectors', title: 'Vectors & 3D Geometry', difficulty: 3, estimatedHours: 12, tags: ['geometry'] },
                { id: 'math-probability-jee', title: 'Probability & Statistics', difficulty: 3, estimatedHours: 10, tags: ['probability'] }
            ]
        }
    ]
};
