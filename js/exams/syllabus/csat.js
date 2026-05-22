// ============================================================
// CSAT (College Scholastic Ability Test / 수능) — South Korea
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['csat'] = {
    examName: 'CSAT (수능 — College Scholastic Ability Test)',
    version: '2026',
    sections: [
        {
            id: 'csat-korean',
            name: 'Korean Language (국어)',
            type: 'compulsory',
            topics: [
                { id: 'kr-reading', title: 'Reading (Humanities, Social Science, Science, Technology passages)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['korean'] },
                { id: 'kr-literature', title: 'Literature (Modern Poetry, Classical Poetry, Novels, Essays)', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['korean'] },
                { id: 'kr-grammar', title: 'Grammar & Language (Phonology, Morphology, Syntax)', difficulty: 3, estimatedHours: 14, tags: ['korean'] },
                { id: 'kr-speech', title: 'Speech & Writing (Argumentation, Logic, Expression)', difficulty: 3, estimatedHours: 12, tags: ['korean'] }
            ]
        },
        {
            id: 'csat-maths',
            name: 'Mathematics (수학)',
            type: 'compulsory',
            topics: [
                { id: 'math-calculus', title: 'Calculus (Limits, Differentiation, Integration)', difficulty: 5, estimatedHours: 30, weight: 1.3, tags: ['maths'] },
                { id: 'math-prob-stats', title: 'Probability & Statistics', difficulty: 3, estimatedHours: 16, tags: ['maths'] },
                { id: 'math-geometry', title: 'Geometry & Vectors', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['maths'] },
                { id: 'math-exponential', title: 'Exponential, Logarithmic & Trigonometric Functions', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['maths'] },
                { id: 'math-sequences', title: 'Sequences & Series', difficulty: 3, estimatedHours: 14, tags: ['maths'] }
            ]
        },
        {
            id: 'csat-english',
            name: 'English (영어)',
            type: 'compulsory',
            topics: [
                { id: 'eng-listening', title: 'Listening Comprehension (17 questions)', difficulty: 2, estimatedHours: 14, weight: 0.9, tags: ['english'] },
                { id: 'eng-main-idea', title: 'Main Idea & Purpose Identification', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['english'] },
                { id: 'eng-ordering', title: 'Sentence Ordering & Insertion', difficulty: 3, estimatedHours: 14, weight: 1.3, tags: ['english'] },
                { id: 'eng-blank', title: 'Blank-Filling & Vocabulary-in-Context', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['english'] },
                { id: 'eng-long-passage', title: 'Long Passage Comprehension (Complex Reading)', difficulty: 4, estimatedHours: 12, tags: ['english'] }
            ]
        },
        {
            id: 'csat-science',
            name: 'Science Inquiry (탐구) — Select 2',
            type: 'optional',
            topics: [
                { id: 'sci-physics1', title: 'Physics I (Mechanics, Waves, Electromagnetism)', difficulty: 4, estimatedHours: 22, weight: 1.2, tags: ['science'] },
                { id: 'sci-chemistry1', title: 'Chemistry I (Atomic Structure, Chemical Reactions)', difficulty: 3, estimatedHours: 20, tags: ['science'] },
                { id: 'sci-biology1', title: 'Biology I (Cell, Genetics, Ecology)', difficulty: 3, estimatedHours: 18, tags: ['science'] },
                { id: 'sci-earth1', title: 'Earth Science I (Geology, Astronomy, Atmosphere)', difficulty: 3, estimatedHours: 18, tags: ['science'] }
            ]
        },
        {
            id: 'csat-social',
            name: 'Social Studies (탐구) — Select 2',
            type: 'optional',
            topics: [
                { id: 'soc-ethics', title: 'Life & Ethics / Ethics & Thought', difficulty: 3, estimatedHours: 16, tags: ['social'] },
                { id: 'soc-society', title: 'Society & Culture', difficulty: 3, estimatedHours: 16, tags: ['social'] },
                { id: 'soc-korean-history', title: 'Korean History (compulsory section)', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['social'] },
                { id: 'soc-politics', title: 'Politics & Law / Economics', difficulty: 3, estimatedHours: 16, tags: ['social'] }
            ]
        }
    ]
};
