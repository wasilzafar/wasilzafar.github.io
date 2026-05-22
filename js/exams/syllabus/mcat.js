// ============================================================
// MCAT (Medical College Admission Test) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['mcat'] = {
    examName: 'MCAT (Medical College Admission Test)',
    version: '2026',
    sections: [
        {
            id: 'mcat-cp',
            name: 'Chemical & Physical Foundations of Biological Systems',
            type: 'compulsory',
            topics: [
                { id: 'cp-gen-chem', title: 'General Chemistry (Stoichiometry, Bonding, Thermodynamics)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['chemistry'] },
                { id: 'cp-organic', title: 'Organic Chemistry (Reactions, Mechanisms, Spectroscopy)', difficulty: 4, estimatedHours: 24, weight: 1.2, tags: ['chemistry'] },
                { id: 'cp-physics', title: 'Physics (Mechanics, Fluids, Circuits, Optics)', difficulty: 3, estimatedHours: 22, tags: ['physics'] },
                { id: 'cp-biochem', title: 'Biochemistry (Amino Acids, Enzymes, Metabolism)', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['biochemistry'] }
            ]
        },
        {
            id: 'mcat-cars',
            name: 'Critical Analysis & Reasoning Skills (CARS)',
            type: 'compulsory',
            topics: [
                { id: 'cars-comprehension', title: 'Passage Comprehension & Main Idea', difficulty: 3, estimatedHours: 14, tags: ['reading'] },
                { id: 'cars-reasoning', title: 'Reasoning Within Text (Inference, Assumption)', difficulty: 4, estimatedHours: 18, weight: 1.3, tags: ['reading'] },
                { id: 'cars-beyond', title: 'Reasoning Beyond Text (Apply, Extrapolate)', difficulty: 4, estimatedHours: 16, weight: 1.3, tags: ['reading'] },
                { id: 'cars-practice', title: 'CARS Timing Strategy & Practice', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['reading'] }
            ]
        },
        {
            id: 'mcat-bb',
            name: 'Biological & Biochemical Foundations of Living Systems',
            type: 'compulsory',
            topics: [
                { id: 'bb-cell', title: 'Cell Biology & Molecular Biology', difficulty: 4, estimatedHours: 22, weight: 1.2, tags: ['biology'] },
                { id: 'bb-genetics', title: 'Genetics & Evolution', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['biology'] },
                { id: 'bb-organ-systems', title: 'Organ Systems (Cardiovascular, Respiratory, Renal, GI)', difficulty: 4, estimatedHours: 28, weight: 1.3, tags: ['biology'] },
                { id: 'bb-biochem', title: 'Biochemistry (Metabolism, Enzymes, DNA/RNA)', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['biochemistry'] },
                { id: 'bb-microbiology', title: 'Microbiology & Immunology', difficulty: 3, estimatedHours: 14, tags: ['biology'] }
            ]
        },
        {
            id: 'mcat-ps',
            name: 'Psychological, Social & Biological Foundations of Behavior',
            type: 'compulsory',
            topics: [
                { id: 'ps-psychology', title: 'Psychology (Learning, Memory, Cognition, Development)', difficulty: 3, estimatedHours: 22, weight: 1.2, tags: ['psychology'] },
                { id: 'ps-sociology', title: 'Sociology (Social Structure, Stratification, Demographics)', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['sociology'] },
                { id: 'ps-biology', title: 'Biological Bases of Behavior (Nervous System, Endocrine)', difficulty: 3, estimatedHours: 14, tags: ['biology'] },
                { id: 'ps-identity', title: 'Self-Identity, Social Interaction & Group Processes', difficulty: 3, estimatedHours: 12, tags: ['sociology'] }
            ]
        }
    ]
};
