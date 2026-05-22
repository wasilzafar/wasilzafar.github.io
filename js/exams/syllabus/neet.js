// ============================================================
// NEET (National Eligibility cum Entrance Test) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['neet'] = {
    examName: 'NEET (National Eligibility cum Entrance Test)',
    version: '2026',
    sections: [
        {
            id: 'neet-physics',
            name: 'Physics',
            type: 'compulsory',
            topics: [
                { id: 'phy-mechanics', title: 'Mechanics (Laws of Motion, Work/Energy, Rotational)', difficulty: 4, estimatedHours: 40, weight: 1.2, tags: ['physics'] },
                { id: 'phy-thermodynamics', title: 'Thermodynamics & Kinetic Theory', difficulty: 3, estimatedHours: 18, tags: ['physics'] },
                { id: 'phy-waves', title: 'Waves & Oscillations', difficulty: 3, estimatedHours: 16, tags: ['physics'] },
                { id: 'phy-optics', title: 'Optics (Ray & Wave)', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['physics'] },
                { id: 'phy-electrostatics', title: 'Electrostatics & Capacitance', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['physics'] },
                { id: 'phy-current', title: 'Current Electricity', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['physics'] },
                { id: 'phy-magnetism', title: 'Magnetism & Electromagnetic Induction', difficulty: 4, estimatedHours: 18, tags: ['physics'] },
                { id: 'phy-modern', title: 'Modern Physics (Atoms, Nuclei, Semiconductors)', difficulty: 3, estimatedHours: 16, weight: 1.3, tags: ['physics'] },
                { id: 'phy-gravitation', title: 'Gravitation', difficulty: 2, estimatedHours: 10, tags: ['physics'] },
                { id: 'phy-fluids', title: 'Properties of Matter & Fluid Mechanics', difficulty: 3, estimatedHours: 12, tags: ['physics'] }
            ]
        },
        {
            id: 'neet-chemistry',
            name: 'Chemistry',
            type: 'compulsory',
            topics: [
                { id: 'chem-organic-basics', title: 'Organic Chemistry — GOC, Isomerism, Hydrocarbons', difficulty: 4, estimatedHours: 30, weight: 1.3, tags: ['chemistry', 'organic'] },
                { id: 'chem-organic-named', title: 'Organic Chemistry — Named Reactions & Biomolecules', difficulty: 3, estimatedHours: 20, weight: 1.3, tags: ['chemistry', 'organic'] },
                { id: 'chem-inorganic-periodic', title: 'Inorganic — Periodic Table & Chemical Bonding', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['chemistry', 'inorganic'] },
                { id: 'chem-inorganic-coord', title: 'Inorganic — Coordination Compounds & Metallurgy', difficulty: 3, estimatedHours: 16, tags: ['chemistry', 'inorganic'] },
                { id: 'chem-inorganic-blocks', title: 'Inorganic — s, p, d, f Block Elements', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['chemistry', 'inorganic'] },
                { id: 'chem-physical-thermo', title: 'Physical Chemistry — Thermodynamics & Equilibrium', difficulty: 3, estimatedHours: 18, tags: ['chemistry', 'physical'] },
                { id: 'chem-physical-electro', title: 'Physical Chemistry — Electrochemistry & Kinetics', difficulty: 3, estimatedHours: 16, tags: ['chemistry', 'physical'] },
                { id: 'chem-physical-solutions', title: 'Physical Chemistry — Solutions & Solid State', difficulty: 3, estimatedHours: 14, tags: ['chemistry', 'physical'] },
                { id: 'chem-physical-atomic', title: 'Physical Chemistry — Atomic Structure & Stoichiometry', difficulty: 2, estimatedHours: 12, tags: ['chemistry', 'physical'] }
            ]
        },
        {
            id: 'neet-botany',
            name: 'Biology — Botany',
            type: 'compulsory',
            topics: [
                { id: 'bot-diversity', title: 'Plant Diversity (Classification, Morphology, Anatomy)', difficulty: 2, estimatedHours: 20, weight: 1.2, tags: ['biology', 'botany'] },
                { id: 'bot-physiology', title: 'Plant Physiology (Photosynthesis, Respiration, Growth)', difficulty: 3, estimatedHours: 22, weight: 1.3, tags: ['biology', 'botany'] },
                { id: 'bot-reproduction', title: 'Plant Reproduction & Sexual Reproduction in Plants', difficulty: 2, estimatedHours: 14, weight: 1.2, tags: ['biology', 'botany'] },
                { id: 'bot-genetics', title: 'Genetics & Molecular Biology', difficulty: 4, estimatedHours: 28, weight: 1.3, tags: ['biology', 'botany'] },
                { id: 'bot-ecology', title: 'Ecology & Environment', difficulty: 2, estimatedHours: 16, weight: 1.2, tags: ['biology', 'botany'] },
                { id: 'bot-biotech', title: 'Biotechnology — Principles & Applications', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['biology', 'botany'] },
                { id: 'bot-cell-biology', title: 'Cell Biology & Biomolecules', difficulty: 3, estimatedHours: 16, tags: ['biology', 'botany'] }
            ]
        },
        {
            id: 'neet-zoology',
            name: 'Biology — Zoology',
            type: 'compulsory',
            topics: [
                { id: 'zoo-diversity', title: 'Animal Diversity (Classification & Structural Organisation)', difficulty: 2, estimatedHours: 18, tags: ['biology', 'zoology'] },
                { id: 'zoo-human-physio', title: 'Human Physiology (Digestion, Respiration, Circulation)', difficulty: 3, estimatedHours: 28, weight: 1.3, tags: ['biology', 'zoology'] },
                { id: 'zoo-human-physio2', title: 'Human Physiology (Excretion, Nervous, Endocrine, Locomotion)', difficulty: 3, estimatedHours: 24, weight: 1.3, tags: ['biology', 'zoology'] },
                { id: 'zoo-reproduction', title: 'Human Reproduction & Reproductive Health', difficulty: 2, estimatedHours: 14, weight: 1.2, tags: ['biology', 'zoology'] },
                { id: 'zoo-evolution', title: 'Evolution & Origin of Life', difficulty: 2, estimatedHours: 10, tags: ['biology', 'zoology'] },
                { id: 'zoo-health', title: 'Human Health & Disease', difficulty: 2, estimatedHours: 12, weight: 1.2, tags: ['biology', 'zoology'] },
                { id: 'zoo-microbes', title: 'Microbes in Human Welfare', difficulty: 2, estimatedHours: 8, tags: ['biology', 'zoology'] }
            ]
        }
    ]
};
