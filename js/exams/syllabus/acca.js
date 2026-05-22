// ============================================================
// ACCA (Association of Chartered Certified Accountants) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['acca'] = {
    examName: 'ACCA Qualification',
    version: '2026',
    sections: [
        {
            id: 'acca-applied-knowledge',
            name: 'Applied Knowledge (BT, MA, FA)',
            type: 'compulsory',
            topics: [
                { id: 'ak-bt', title: 'Business & Technology (BT) — Governance, IT, HR, Ethics', difficulty: 2, estimatedHours: 18, tags: ['applied-knowledge'] },
                { id: 'ak-ma', title: 'Management Accounting (MA) — Costing, Budgeting, Variance', difficulty: 3, estimatedHours: 22, weight: 1.2, tags: ['applied-knowledge'] },
                { id: 'ak-fa', title: 'Financial Accounting (FA) — Double Entry, Financial Statements', difficulty: 3, estimatedHours: 22, weight: 1.2, tags: ['applied-knowledge'] }
            ]
        },
        {
            id: 'acca-applied-skills',
            name: 'Applied Skills (PM, TX, FR, AA, FM, LW)',
            type: 'compulsory',
            topics: [
                { id: 'as-pm', title: 'Performance Management (PM) — CVP, Decision Making, Transfer Pricing', difficulty: 3, estimatedHours: 24, weight: 1.2, tags: ['applied-skills'] },
                { id: 'as-tx', title: 'Taxation (TX) — Income Tax, Corporation Tax, CGT, VAT', difficulty: 3, estimatedHours: 24, tags: ['applied-skills'] },
                { id: 'as-fr', title: 'Financial Reporting (FR) — IFRS, Consolidation, Interpretation', difficulty: 4, estimatedHours: 28, weight: 1.3, tags: ['applied-skills'] },
                { id: 'as-aa', title: 'Audit & Assurance (AA) — Planning, Risk, Evidence, Reporting', difficulty: 3, estimatedHours: 22, tags: ['applied-skills'] },
                { id: 'as-fm', title: 'Financial Management (FM) — NPV, WACC, Working Capital, Risk', difficulty: 4, estimatedHours: 26, weight: 1.3, tags: ['applied-skills'] },
                { id: 'as-lw', title: 'Corporate & Business Law (LW) — Company Law, Contract, Employment', difficulty: 2, estimatedHours: 18, tags: ['applied-skills'] }
            ]
        },
        {
            id: 'acca-strategic',
            name: 'Strategic Professional (SBL, SBR + Options)',
            type: 'compulsory',
            topics: [
                { id: 'sp-sbl', title: 'Strategic Business Leader (SBL) — Case Study, Governance, Strategy', difficulty: 5, estimatedHours: 34, weight: 1.3, tags: ['strategic'] },
                { id: 'sp-sbr', title: 'Strategic Business Reporting (SBR) — Complex IFRS, Current Issues', difficulty: 5, estimatedHours: 30, weight: 1.3, tags: ['strategic'] },
                { id: 'sp-afm', title: 'Advanced Financial Management (AFM) — Option', difficulty: 4, estimatedHours: 28, tags: ['strategic'] },
                { id: 'sp-apm', title: 'Advanced Performance Management (APM) — Option', difficulty: 4, estimatedHours: 26, tags: ['strategic'] },
                { id: 'sp-atx', title: 'Advanced Taxation (ATX) — Option', difficulty: 4, estimatedHours: 28, tags: ['strategic'] },
                { id: 'sp-aaa', title: 'Advanced Audit & Assurance (AAA) — Option', difficulty: 4, estimatedHours: 26, tags: ['strategic'] }
            ]
        }
    ]
};
