// ============================================================
// Bar Exam (Uniform Bar Examination - UBE) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['bar-exam'] = {
    examName: 'Bar Exam (Uniform Bar Examination)',
    version: '2026',
    sections: [
        {
            id: 'bar-mbe',
            name: 'Multistate Bar Examination (MBE)',
            type: 'compulsory',
            topics: [
                { id: 'mbe-con-law', title: 'Constitutional Law (Individual Rights, Federal Powers, 1st/14th Amendment)', difficulty: 4, estimatedHours: 24, weight: 1.2, tags: ['mbe'] },
                { id: 'mbe-contracts', title: 'Contracts & UCC Article 2 (Formation, Performance, Remedies)', difficulty: 4, estimatedHours: 26, weight: 1.3, tags: ['mbe'] },
                { id: 'mbe-criminal', title: 'Criminal Law & Procedure (Elements, Defenses, 4th/5th/6th Amendments)', difficulty: 3, estimatedHours: 22, weight: 1.2, tags: ['mbe'] },
                { id: 'mbe-evidence', title: 'Evidence (Relevance, Hearsay, Privileges, Character)', difficulty: 4, estimatedHours: 24, weight: 1.3, tags: ['mbe'] },
                { id: 'mbe-property', title: 'Real Property (Estates, Landlord-Tenant, Recording Acts)', difficulty: 4, estimatedHours: 22, weight: 1.2, tags: ['mbe'] },
                { id: 'mbe-torts', title: 'Torts (Negligence, Strict Liability, Intentional Torts)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['mbe'] },
                { id: 'mbe-civil-pro', title: 'Civil Procedure (Jurisdiction, Joinder, Discovery, Res Judicata)', difficulty: 4, estimatedHours: 22, tags: ['mbe'] }
            ]
        },
        {
            id: 'bar-mee',
            name: 'Multistate Essay Examination (MEE)',
            type: 'compulsory',
            topics: [
                { id: 'mee-business', title: 'Business Associations (Corporations, Partnerships, LLCs)', difficulty: 3, estimatedHours: 16, tags: ['mee'] },
                { id: 'mee-family', title: 'Family Law (Marriage, Divorce, Child Custody, Adoption)', difficulty: 3, estimatedHours: 12, tags: ['mee'] },
                { id: 'mee-trusts', title: 'Trusts & Estates (Wills, Intestacy, Trust Administration)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['mee'] },
                { id: 'mee-secured', title: 'Secured Transactions (UCC Article 9)', difficulty: 3, estimatedHours: 12, tags: ['mee'] },
                { id: 'mee-conflict', title: 'Conflict of Laws', difficulty: 3, estimatedHours: 10, tags: ['mee'] },
                { id: 'mee-essay-skills', title: 'Essay Writing Skills (IRAC Method, Issue Spotting)', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['mee'] }
            ]
        },
        {
            id: 'bar-mpt',
            name: 'Multistate Performance Test (MPT)',
            type: 'compulsory',
            topics: [
                { id: 'mpt-memo', title: 'Objective Memorandum & Client Letters', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['mpt'] },
                { id: 'mpt-brief', title: 'Persuasive Brief & Motion Writing', difficulty: 4, estimatedHours: 14, weight: 1.3, tags: ['mpt'] },
                { id: 'mpt-planning', title: 'Discovery Plans, Settlement Proposals, Contracts', difficulty: 3, estimatedHours: 10, tags: ['mpt'] },
                { id: 'mpt-time', title: 'Time Management & File Organization', difficulty: 2, estimatedHours: 8, tags: ['mpt'] }
            ]
        }
    ]
};
