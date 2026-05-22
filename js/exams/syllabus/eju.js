// ============================================================
// EJU (Examination for Japanese University Admission) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['eju'] = {
    examName: 'EJU (Examination for Japanese University Admission)',
    version: '2026',
    sections: [
        {
            id: 'eju-japanese',
            name: 'Japanese as a Foreign Language',
            type: 'compulsory',
            topics: [
                { id: 'jpn-reading', title: 'Reading Comprehension (Academic Passages)', difficulty: 3, estimatedHours: 20, weight: 1.3, tags: ['japanese'] },
                { id: 'jpn-listening', title: 'Listening & Listening-Reading Combined', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['japanese'] },
                { id: 'jpn-writing', title: 'Writing (Opinion Essay, 400-500 characters)', difficulty: 3, estimatedHours: 14, tags: ['japanese'] },
                { id: 'jpn-grammar', title: 'Grammar & Vocabulary (N2-N1 Level)', difficulty: 3, estimatedHours: 18, tags: ['japanese'] }
            ]
        },
        {
            id: 'eju-science',
            name: 'Science (理科) — Choose 2 of 3',
            type: 'optional',
            topics: [
                { id: 'sci-physics', title: 'Physics (Mechanics, Waves, Electricity, Atomic)', difficulty: 4, estimatedHours: 24, weight: 1.2, tags: ['science'] },
                { id: 'sci-chemistry', title: 'Chemistry (Atomic Structure, Reactions, Organic)', difficulty: 3, estimatedHours: 22, weight: 1.2, tags: ['science'] },
                { id: 'sci-biology', title: 'Biology (Cells, Genetics, Ecology, Evolution)', difficulty: 3, estimatedHours: 20, tags: ['science'] }
            ]
        },
        {
            id: 'eju-math',
            name: 'Mathematics (Course 2 — Science Track)',
            type: 'compulsory',
            topics: [
                { id: 'math-functions', title: 'Functions & Limits (Quadratic, Exponential, Trigonometric)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['maths'] },
                { id: 'math-calculus', title: 'Differential & Integral Calculus', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['maths'] },
                { id: 'math-vectors', title: 'Vectors & Matrices', difficulty: 3, estimatedHours: 14, tags: ['maths'] },
                { id: 'math-sequences', title: 'Sequences & Series', difficulty: 3, estimatedHours: 12, tags: ['maths'] },
                { id: 'math-probability', title: 'Probability & Statistics', difficulty: 3, estimatedHours: 12, tags: ['maths'] }
            ]
        },
        {
            id: 'eju-japan-world',
            name: 'Japan & the World (日本と世界)',
            type: 'optional',
            topics: [
                { id: 'jw-politics', title: 'Politics & Economy (Japanese Government, International Relations)', difficulty: 3, estimatedHours: 16, tags: ['social'] },
                { id: 'jw-society', title: 'Society & Culture (Demographics, Education, Social Issues)', difficulty: 2, estimatedHours: 12, tags: ['social'] },
                { id: 'jw-geography', title: 'Geography (Japan & World, Climate, Resources)', difficulty: 2, estimatedHours: 12, tags: ['social'] },
                { id: 'jw-history', title: 'Modern History (Meiji to Present, World History)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['social'] }
            ]
        }
    ]
};
