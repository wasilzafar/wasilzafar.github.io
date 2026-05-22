// ============================================================
// IPhO (International Physics Olympiad) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['ipho'] = {
    examName: 'IPhO (International Physics Olympiad)',
    version: '2026',
    sections: [
        {
            id: 'ipho-mechanics',
            name: 'Mechanics',
            type: 'compulsory',
            topics: [
                { id: 'mech-kinematics', title: 'Kinematics & Dynamics (Newton\'s Laws, Frames of Reference)', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['mechanics'] },
                { id: 'mech-energy', title: 'Energy, Work & Momentum Conservation', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['mechanics'] },
                { id: 'mech-rotation', title: 'Rotational Mechanics (Moment of Inertia, Angular Momentum)', difficulty: 5, estimatedHours: 22, weight: 1.3, tags: ['mechanics'] },
                { id: 'mech-oscillations', title: 'Oscillations & Waves (Coupled, Damped, Standing)', difficulty: 4, estimatedHours: 18, tags: ['mechanics'] },
                { id: 'mech-fluids', title: 'Fluid Mechanics (Bernoulli, Viscosity, Surface Tension)', difficulty: 4, estimatedHours: 14, tags: ['mechanics'] },
                { id: 'mech-celestial', title: 'Celestial Mechanics & Gravitation', difficulty: 4, estimatedHours: 14, tags: ['mechanics'] }
            ]
        },
        {
            id: 'ipho-thermo',
            name: 'Thermodynamics & Statistical Physics',
            type: 'compulsory',
            topics: [
                { id: 'thermo-laws', title: 'Laws of Thermodynamics & Cycles', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['thermodynamics'] },
                { id: 'thermo-kinetic', title: 'Kinetic Theory of Gases', difficulty: 3, estimatedHours: 12, tags: ['thermodynamics'] },
                { id: 'thermo-phase', title: 'Phase Transitions & Heat Transfer', difficulty: 3, estimatedHours: 10, tags: ['thermodynamics'] },
                { id: 'thermo-statistical', title: 'Statistical Physics (Boltzmann, Entropy, Equipartition)', difficulty: 5, estimatedHours: 14, tags: ['thermodynamics'] }
            ]
        },
        {
            id: 'ipho-em',
            name: 'Electromagnetism',
            type: 'compulsory',
            topics: [
                { id: 'em-electrostatics', title: 'Electrostatics (Gauss\'s Law, Potential, Capacitance)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['electromagnetism'] },
                { id: 'em-circuits', title: 'DC & AC Circuits (Kirchhoff, RC/RL/RLC, Impedance)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['electromagnetism'] },
                { id: 'em-magnetism', title: 'Magnetism (Biot-Savart, Ampere, Lorentz Force)', difficulty: 4, estimatedHours: 16, tags: ['electromagnetism'] },
                { id: 'em-induction', title: 'Electromagnetic Induction (Faraday, Lenz, Self/Mutual)', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['electromagnetism'] },
                { id: 'em-maxwell', title: 'Maxwell\'s Equations & EM Waves', difficulty: 5, estimatedHours: 16, weight: 1.3, tags: ['electromagnetism'] }
            ]
        },
        {
            id: 'ipho-optics',
            name: 'Optics',
            type: 'compulsory',
            topics: [
                { id: 'opt-geometric', title: 'Geometric Optics (Mirrors, Lenses, Optical Instruments)', difficulty: 3, estimatedHours: 12, tags: ['optics'] },
                { id: 'opt-wave', title: 'Wave Optics (Interference, Diffraction, Polarization)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['optics'] }
            ]
        },
        {
            id: 'ipho-modern',
            name: 'Modern & Quantum Physics',
            type: 'compulsory',
            topics: [
                { id: 'mod-quantum', title: 'Quantum Mechanics (Wave-Particle Duality, Bohr Model, Uncertainty)', difficulty: 5, estimatedHours: 16, weight: 1.2, tags: ['modern'] },
                { id: 'mod-nuclear', title: 'Nuclear Physics (Radioactivity, Binding Energy, Fission/Fusion)', difficulty: 3, estimatedHours: 12, tags: ['modern'] },
                { id: 'mod-relativity', title: 'Special Relativity (Lorentz, Time Dilation, Energy-Momentum)', difficulty: 5, estimatedHours: 16, weight: 1.3, tags: ['modern'] }
            ]
        },
        {
            id: 'ipho-experimental',
            name: 'Experimental Physics',
            type: 'compulsory',
            topics: [
                { id: 'exp-measurement', title: 'Measurement, Uncertainties & Error Analysis', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['experimental'] },
                { id: 'exp-techniques', title: 'Experimental Techniques (Oscilloscope, Optics Bench, Sensors)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['experimental'] },
                { id: 'exp-graphing', title: 'Data Analysis, Graphing & Curve Fitting', difficulty: 3, estimatedHours: 10, tags: ['experimental'] }
            ]
        }
    ]
};
