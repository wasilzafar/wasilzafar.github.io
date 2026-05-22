// ============================================================
// FSOT (Foreign Service Officer Test) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['fsot'] = {
    examName: 'FSOT (Foreign Service Officer Test)',
    version: '2026',
    sections: [
        {
            id: 'fsot-job-knowledge',
            name: 'Job Knowledge',
            type: 'compulsory',
            topics: [
                { id: 'jk-us-govt', title: 'U.S. Government & Constitution', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['job-knowledge'] },
                { id: 'jk-us-history', title: 'U.S. History & Society', difficulty: 3, estimatedHours: 14, tags: ['job-knowledge'] },
                { id: 'jk-world-history', title: 'World History & Geography', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['job-knowledge'] },
                { id: 'jk-economics', title: 'Economics (Micro, Macro, International Trade)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['job-knowledge'] },
                { id: 'jk-management', title: 'Management & Administration Principles', difficulty: 2, estimatedHours: 10, tags: ['job-knowledge'] },
                { id: 'jk-communications', title: 'Communications & Information Technology', difficulty: 2, estimatedHours: 8, tags: ['job-knowledge'] },
                { id: 'jk-math-stats', title: 'Mathematics & Statistics', difficulty: 2, estimatedHours: 8, tags: ['job-knowledge'] }
            ]
        },
        {
            id: 'fsot-english',
            name: 'English Expression',
            type: 'compulsory',
            topics: [
                { id: 'eng-grammar', title: 'Grammar & Usage', difficulty: 2, estimatedHours: 8, tags: ['english'] },
                { id: 'eng-organization', title: 'Organization & Sentence Structure', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['english'] },
                { id: 'eng-rhetoric', title: 'Rhetorical Skills & Style', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['english'] }
            ]
        },
        {
            id: 'fsot-situational',
            name: 'Situational Judgment',
            type: 'compulsory',
            topics: [
                { id: 'sj-interpersonal', title: 'Interpersonal Skills & Diplomacy', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['situational'] },
                { id: 'sj-leadership', title: 'Leadership & Management Scenarios', difficulty: 3, estimatedHours: 10, tags: ['situational'] },
                { id: 'sj-cultural', title: 'Cultural Awareness & Adaptability', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['situational'] },
                { id: 'sj-resourcefulness', title: 'Resourcefulness & Problem-Solving', difficulty: 3, estimatedHours: 8, tags: ['situational'] }
            ]
        },
        {
            id: 'fsot-essay',
            name: 'Essay (Written)',
            type: 'compulsory',
            topics: [
                { id: 'essay-argument', title: 'Argumentative Essay Construction', difficulty: 3, estimatedHours: 12, weight: 1.3, tags: ['essay'] },
                { id: 'essay-policy', title: 'Policy Analysis & Position Defense', difficulty: 4, estimatedHours: 14, weight: 1.3, tags: ['essay'] },
                { id: 'essay-practice', title: 'Timed Essay Practice (30 minutes)', difficulty: 3, estimatedHours: 10, tags: ['essay'] }
            ]
        }
    ]
};
