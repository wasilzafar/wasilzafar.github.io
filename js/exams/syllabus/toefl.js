// ============================================================
// TOEFL iBT — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['toefl'] = {
    examName: 'TOEFL iBT',
    version: '2026',
    sections: [
        {
            id: 'toefl-reading',
            name: 'Reading',
            type: 'compulsory',
            topics: [
                { id: 'read-vocab', title: 'Vocabulary in Context & Rhetorical Purpose', difficulty: 3, estimatedHours: 10, tags: ['reading'] },
                { id: 'read-inference', title: 'Inference & Factual Information Questions', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['reading'] },
                { id: 'read-insert', title: 'Sentence Insertion & Reference Questions', difficulty: 3, estimatedHours: 8, tags: ['reading'] },
                { id: 'read-summary', title: 'Prose Summary & Table Completion', difficulty: 4, estimatedHours: 10, weight: 1.2, tags: ['reading'] },
                { id: 'read-academic', title: 'Academic Passage Strategies & Time Management', difficulty: 3, estimatedHours: 10, tags: ['reading'] }
            ]
        },
        {
            id: 'toefl-listening',
            name: 'Listening',
            type: 'compulsory',
            topics: [
                { id: 'listen-lectures', title: 'Academic Lectures (Main Idea, Detail, Organization)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['listening'] },
                { id: 'listen-conversations', title: 'Campus Conversations & Service Encounters', difficulty: 2, estimatedHours: 8, tags: ['listening'] },
                { id: 'listen-inference', title: 'Inference & Speaker Attitude Questions', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['listening'] },
                { id: 'listen-notetaking', title: 'Note-Taking Strategies & Connecting Content', difficulty: 3, estimatedHours: 10, tags: ['listening'] }
            ]
        },
        {
            id: 'toefl-speaking',
            name: 'Speaking',
            type: 'compulsory',
            topics: [
                { id: 'speak-independent', title: 'Task 1: Independent Speaking (Personal Opinion)', difficulty: 3, estimatedHours: 12, weight: 1.3, tags: ['speaking'] },
                { id: 'speak-integrated-read', title: 'Task 2: Integrated (Reading + Listening + Speaking)', difficulty: 4, estimatedHours: 14, weight: 1.3, tags: ['speaking'] },
                { id: 'speak-integrated-listen', title: 'Task 3: Integrated (Listening + Speaking — Academic)', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['speaking'] },
                { id: 'speak-integrated-lecture', title: 'Task 4: Integrated (Lecture Summary)', difficulty: 4, estimatedHours: 12, weight: 1.2, tags: ['speaking'] }
            ]
        },
        {
            id: 'toefl-writing',
            name: 'Writing',
            type: 'compulsory',
            topics: [
                { id: 'write-integrated', title: 'Integrated Writing (Reading + Lecture → Essay)', difficulty: 3, estimatedHours: 14, weight: 1.3, tags: ['writing'] },
                { id: 'write-discussion', title: 'Writing for an Academic Discussion', difficulty: 3, estimatedHours: 12, weight: 1.3, tags: ['writing'] },
                { id: 'write-grammar', title: 'Grammar Accuracy & Vocabulary Range', difficulty: 3, estimatedHours: 10, tags: ['writing'] },
                { id: 'write-organization', title: 'Essay Structure & Coherence', difficulty: 3, estimatedHours: 10, tags: ['writing'] }
            ]
        }
    ]
};
