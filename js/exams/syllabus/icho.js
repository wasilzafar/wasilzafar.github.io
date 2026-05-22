// ============================================================
// IChO (International Chemistry Olympiad) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['icho'] = {
    examName: 'IChO (International Chemistry Olympiad)',
    version: '2026',
    sections: [
        {
            id: 'icho-physical',
            name: 'Physical Chemistry',
            type: 'compulsory',
            topics: [
                { id: 'phys-thermo', title: 'Thermodynamics (Enthalpy, Entropy, Gibbs Energy, Phase Diagrams)', difficulty: 5, estimatedHours: 22, weight: 1.3, tags: ['physical'] },
                { id: 'phys-kinetics', title: 'Chemical Kinetics (Rate Laws, Mechanisms, Catalysis)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['physical'] },
                { id: 'phys-equilibrium', title: 'Equilibrium (Acid-Base, Solubility, Redox, Nernst)', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['physical'] },
                { id: 'phys-quantum', title: 'Quantum Chemistry & Spectroscopy (MO Theory, UV-Vis, IR, NMR)', difficulty: 5, estimatedHours: 18, weight: 1.2, tags: ['physical'] },
                { id: 'phys-electrochem', title: 'Electrochemistry (Galvanic, Electrolytic, Pourbaix)', difficulty: 4, estimatedHours: 14, tags: ['physical'] }
            ]
        },
        {
            id: 'icho-inorganic',
            name: 'Inorganic Chemistry',
            type: 'compulsory',
            topics: [
                { id: 'inorg-structure', title: 'Atomic Structure, Periodicity & Bonding (VSEPR, Hybridization)', difficulty: 3, estimatedHours: 14, tags: ['inorganic'] },
                { id: 'inorg-main-group', title: 'Main Group Chemistry (s, p-block, Descriptive)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['inorganic'] },
                { id: 'inorg-transition', title: 'Transition Metal Chemistry (Crystal Field, Ligand Field)', difficulty: 5, estimatedHours: 20, weight: 1.3, tags: ['inorganic'] },
                { id: 'inorg-coordination', title: 'Coordination Chemistry (Isomerism, Stability, Spectra)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['inorganic'] },
                { id: 'inorg-solid', title: 'Solid State Chemistry (Crystal Structures, Band Theory)', difficulty: 4, estimatedHours: 12, tags: ['inorganic'] }
            ]
        },
        {
            id: 'icho-organic',
            name: 'Organic Chemistry',
            type: 'compulsory',
            topics: [
                { id: 'org-mechanisms', title: 'Reaction Mechanisms (SN1/SN2, E1/E2, Addition, Radical)', difficulty: 5, estimatedHours: 24, weight: 1.3, tags: ['organic'] },
                { id: 'org-synthesis', title: 'Organic Synthesis & Retrosynthesis', difficulty: 5, estimatedHours: 22, weight: 1.3, tags: ['organic'] },
                { id: 'org-stereochem', title: 'Stereochemistry (Chirality, Optical Activity, Conformations)', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['organic'] },
                { id: 'org-spectroscopy', title: 'Spectroscopic Identification (NMR, MS, IR)', difficulty: 4, estimatedHours: 16, tags: ['organic'] },
                { id: 'org-natural', title: 'Natural Products & Biomolecules', difficulty: 3, estimatedHours: 12, tags: ['organic'] }
            ]
        },
        {
            id: 'icho-analytical',
            name: 'Analytical Chemistry',
            type: 'compulsory',
            topics: [
                { id: 'anal-titrations', title: 'Titrations (Acid-Base, Redox, Complexometric, Precipitation)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['analytical'] },
                { id: 'anal-separation', title: 'Separation Techniques (Chromatography, Extraction)', difficulty: 3, estimatedHours: 12, tags: ['analytical'] },
                { id: 'anal-instrumental', title: 'Instrumental Methods (Spectrophotometry, Electroanalytical)', difficulty: 4, estimatedHours: 14, tags: ['analytical'] }
            ]
        },
        {
            id: 'icho-practical',
            name: 'Practical / Laboratory Skills',
            type: 'compulsory',
            topics: [
                { id: 'prac-synthesis', title: 'Preparative Chemistry (Synthesis, Purification, Characterization)', difficulty: 4, estimatedHours: 16, weight: 1.3, tags: ['practical'] },
                { id: 'prac-analysis', title: 'Quantitative Analysis (Gravimetric, Volumetric)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['practical'] },
                { id: 'prac-safety', title: 'Lab Safety & Technique (Glassware, Filtration, Distillation)', difficulty: 2, estimatedHours: 6, tags: ['practical'] }
            ]
        }
    ]
};
