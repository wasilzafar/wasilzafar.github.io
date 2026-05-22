// ============================================================
// SQE (Solicitors Qualifying Examination) — England & Wales
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['sqe'] = {
    examName: 'SQE (Solicitors Qualifying Examination)',
    version: '2026',
    sections: [
        {
            id: 'sqe1-flk1',
            name: 'SQE1 — Functioning Legal Knowledge 1',
            type: 'compulsory',
            topics: [
                { id: 'flk1-business', title: 'Business Law & Practice', difficulty: 3, estimatedHours: 22, weight: 1.2, tags: ['sqe1'] },
                { id: 'flk1-dispute', title: 'Dispute Resolution (Civil Litigation)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['sqe1'] },
                { id: 'flk1-contract', title: 'Contract Law', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['sqe1'] },
                { id: 'flk1-tort', title: 'Tort Law (Negligence, Nuisance, Defamation)', difficulty: 3, estimatedHours: 16, tags: ['sqe1'] },
                { id: 'flk1-constitutional', title: 'Constitutional & Administrative Law / EU Law', difficulty: 3, estimatedHours: 14, tags: ['sqe1'] },
                { id: 'flk1-legal-system', title: 'Legal System & Legal Services', difficulty: 2, estimatedHours: 10, tags: ['sqe1'] }
            ]
        },
        {
            id: 'sqe1-flk2',
            name: 'SQE1 — Functioning Legal Knowledge 2',
            type: 'compulsory',
            topics: [
                { id: 'flk2-property', title: 'Property Practice (Conveyancing, Land Law)', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['sqe1'] },
                { id: 'flk2-wills', title: 'Wills & Administration of Estates', difficulty: 3, estimatedHours: 16, tags: ['sqe1'] },
                { id: 'flk2-trusts', title: 'Trusts (Express, Implied, Constructive)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['sqe1'] },
                { id: 'flk2-criminal', title: 'Criminal Law & Practice', difficulty: 3, estimatedHours: 18, tags: ['sqe1'] },
                { id: 'flk2-ethics', title: 'Ethics & Professional Conduct (SRA)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['sqe1'] },
                { id: 'flk2-tax', title: 'Tax Law (Income Tax, CGT, IHT)', difficulty: 3, estimatedHours: 14, tags: ['sqe1'] }
            ]
        },
        {
            id: 'sqe2-skills',
            name: 'SQE2 — Practical Legal Skills',
            type: 'compulsory',
            topics: [
                { id: 'sqe2-advocacy', title: 'Advocacy & Oral Presentation', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['sqe2'] },
                { id: 'sqe2-interviewing', title: 'Client Interviewing & Attendance Notes', difficulty: 3, estimatedHours: 12, tags: ['sqe2'] },
                { id: 'sqe2-writing', title: 'Legal Writing & Drafting', difficulty: 3, estimatedHours: 16, weight: 1.3, tags: ['sqe2'] },
                { id: 'sqe2-research', title: 'Legal Research & Case Analysis', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['sqe2'] }
            ]
        }
    ]
};
