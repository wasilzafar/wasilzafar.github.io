// ============================================================
// ACT — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['act'] = {
    examName: 'ACT (American College Testing)',
    version: '2026',
    sections: [
        {
            id: 'act-english',
            name: 'English',
            type: 'compulsory',
            topics: [
                { id: 'eng-grammar', title: 'Grammar & Usage (Subject-Verb Agreement, Pronouns, Modifiers)', difficulty: 2, estimatedHours: 10, tags: ['english'] },
                { id: 'eng-punctuation', title: 'Punctuation (Commas, Colons, Semicolons, Apostrophes)', difficulty: 2, estimatedHours: 8, tags: ['english'] },
                { id: 'eng-sentence-structure', title: 'Sentence Structure & Formation', difficulty: 3, estimatedHours: 10, tags: ['english'] },
                { id: 'eng-rhetorical', title: 'Rhetorical Skills (Strategy, Organization, Style)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['english'] },
                { id: 'eng-transitions', title: 'Transitions & Logical Connectors', difficulty: 2, estimatedHours: 6, tags: ['english'] }
            ]
        },
        {
            id: 'act-math',
            name: 'Mathematics',
            type: 'compulsory',
            topics: [
                { id: 'math-pre-algebra', title: 'Pre-Algebra & Elementary Algebra', difficulty: 2, estimatedHours: 10, tags: ['math'] },
                { id: 'math-intermediate', title: 'Intermediate Algebra (Quadratics, Functions, Logs)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['math'] },
                { id: 'math-coordinate', title: 'Coordinate Geometry (Lines, Parabolas, Circles)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['math'] },
                { id: 'math-geometry', title: 'Plane Geometry (Triangles, Circles, Polygons, Area)', difficulty: 3, estimatedHours: 14, tags: ['math'] },
                { id: 'math-trig', title: 'Trigonometry (Identities, Unit Circle, Graphs)', difficulty: 3, estimatedHours: 10, tags: ['math'] },
                { id: 'math-statistics', title: 'Statistics & Probability', difficulty: 2, estimatedHours: 8, tags: ['math'] }
            ]
        },
        {
            id: 'act-reading',
            name: 'Reading',
            type: 'compulsory',
            topics: [
                { id: 'read-literary', title: 'Literary Narrative / Prose Fiction', difficulty: 3, estimatedHours: 10, tags: ['reading'] },
                { id: 'read-social', title: 'Social Science Passages', difficulty: 3, estimatedHours: 10, tags: ['reading'] },
                { id: 'read-humanities', title: 'Humanities Passages', difficulty: 3, estimatedHours: 10, tags: ['reading'] },
                { id: 'read-natural', title: 'Natural Science Passages', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['reading'] },
                { id: 'read-paired', title: 'Paired Passages & Comparative Analysis', difficulty: 4, estimatedHours: 12, weight: 1.2, tags: ['reading'] }
            ]
        },
        {
            id: 'act-science',
            name: 'Science',
            type: 'compulsory',
            topics: [
                { id: 'sci-data', title: 'Data Representation (Tables, Graphs, Scatterplots)', difficulty: 2, estimatedHours: 10, tags: ['science'] },
                { id: 'sci-research', title: 'Research Summaries (Experimental Design & Analysis)', difficulty: 3, estimatedHours: 14, weight: 1.3, tags: ['science'] },
                { id: 'sci-conflicting', title: 'Conflicting Viewpoints (Compare/Contrast Hypotheses)', difficulty: 4, estimatedHours: 12, weight: 1.2, tags: ['science'] }
            ]
        },
        {
            id: 'act-writing',
            name: 'Writing (Optional)',
            type: 'compulsory',
            topics: [
                { id: 'write-essay', title: 'Argumentative Essay (Analyze Three Perspectives)', difficulty: 3, estimatedHours: 14, weight: 0.7, tags: ['writing'] }
            ]
        }
    ]
};
