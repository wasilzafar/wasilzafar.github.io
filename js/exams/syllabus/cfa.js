// ============================================================
// CFA Level I Syllabus Data (with Level II & III as electives)
// Version: 2026.1 | Updated: 2026-05-22
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['cfa'] = {
    version: '2026.1',
    updatedAt: '2026-05-22',
    examName: 'CFA Program',
    totalMarks: 180,
    sections: [
        // ── Level I (default compulsory) ──────────────────────────
        {
            id: 'cfa-l1-ethics',
            name: 'Level I — Ethical & Professional Standards',
            type: 'compulsory',
            topics: [
                { id: 'l1-ethics-code', title: 'Code of Ethics & Standards of Professional Conduct', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['ethics'] },
                { id: 'l1-ethics-gips', title: 'GIPS (Global Investment Performance Standards)', difficulty: 2, estimatedHours: 4, weight: 1.3, tags: ['ethics'] },
                { id: 'l1-ethics-cases', title: 'Ethics case analysis & scenario application', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['ethics'] }
            ]
        },
        {
            id: 'cfa-l1-quant',
            name: 'Level I — Quantitative Methods',
            type: 'compulsory',
            topics: [
                { id: 'l1-quant-tvm', title: 'Time Value of Money & Discounting', difficulty: 2, estimatedHours: 8, tags: ['quant'] },
                { id: 'l1-quant-stats', title: 'Statistical Concepts & Market Returns', difficulty: 2, estimatedHours: 8, tags: ['quant'] },
                { id: 'l1-quant-probability', title: 'Probability Distributions', difficulty: 3, estimatedHours: 10, tags: ['quant'] },
                { id: 'l1-quant-hypothesis', title: 'Hypothesis Testing', difficulty: 3, estimatedHours: 8, tags: ['quant'] },
                { id: 'l1-quant-regression', title: 'Linear Regression', difficulty: 3, estimatedHours: 6, tags: ['quant'] }
            ]
        },
        {
            id: 'cfa-l1-economics',
            name: 'Level I — Economics',
            type: 'compulsory',
            topics: [
                { id: 'l1-econ-micro', title: 'Microeconomics (supply, demand, market structures)', difficulty: 2, estimatedHours: 10, tags: ['economics'] },
                { id: 'l1-econ-macro', title: 'Macroeconomics (GDP, fiscal/monetary policy, cycles)', difficulty: 2, estimatedHours: 10, tags: ['economics'] },
                { id: 'l1-econ-intl', title: 'International Trade & Capital Flows', difficulty: 2, estimatedHours: 6, tags: ['economics'] },
                { id: 'l1-econ-currency', title: 'Currency Exchange Rates', difficulty: 3, estimatedHours: 8, tags: ['economics'] }
            ]
        },
        {
            id: 'cfa-l1-fra',
            name: 'Level I — Financial Reporting & Analysis',
            type: 'compulsory',
            topics: [
                { id: 'l1-fra-framework', title: 'Financial Reporting Standards (IFRS/GAAP)', difficulty: 2, estimatedHours: 6, weight: 1.3, tags: ['fra'] },
                { id: 'l1-fra-income', title: 'Income Statement Analysis', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['fra'] },
                { id: 'l1-fra-balance', title: 'Balance Sheet Analysis', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['fra'] },
                { id: 'l1-fra-cashflow', title: 'Cash Flow Statement Analysis', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['fra'] },
                { id: 'l1-fra-inventories', title: 'Inventories & Long-lived Assets', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['fra'] },
                { id: 'l1-fra-taxes', title: 'Income Taxes & Deferred Tax', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['fra'] },
                { id: 'l1-fra-ratios', title: 'Financial Ratios & Company Analysis', difficulty: 2, estimatedHours: 8, weight: 1.3, tags: ['fra'] }
            ]
        },
        {
            id: 'cfa-l1-corporate',
            name: 'Level I — Corporate Issuers',
            type: 'compulsory',
            topics: [
                { id: 'l1-corp-governance', title: 'Corporate Governance & ESG', difficulty: 2, estimatedHours: 6, tags: ['corporate'] },
                { id: 'l1-corp-capital', title: 'Capital Budgeting & NPV/IRR', difficulty: 3, estimatedHours: 10, tags: ['corporate'] },
                { id: 'l1-corp-structure', title: 'Cost of Capital & Capital Structure', difficulty: 3, estimatedHours: 8, tags: ['corporate'] }
            ]
        },
        {
            id: 'cfa-l1-equity',
            name: 'Level I — Equity Investments',
            type: 'compulsory',
            topics: [
                { id: 'l1-eq-markets', title: 'Market Organization & Structure', difficulty: 2, estimatedHours: 6, tags: ['equity'] },
                { id: 'l1-eq-indices', title: 'Security Market Indices', difficulty: 1, estimatedHours: 4, tags: ['equity'] },
                { id: 'l1-eq-valuation', title: 'Equity Valuation (DDM, P/E, P/B)', difficulty: 3, estimatedHours: 12, tags: ['equity'] },
                { id: 'l1-eq-industry', title: 'Industry & Company Analysis', difficulty: 2, estimatedHours: 6, tags: ['equity'] }
            ]
        },
        {
            id: 'cfa-l1-fi',
            name: 'Level I — Fixed Income',
            type: 'compulsory',
            topics: [
                { id: 'l1-fi-features', title: 'Fixed Income Securities — Features & Risks', difficulty: 2, estimatedHours: 8, tags: ['fixed-income'] },
                { id: 'l1-fi-pricing', title: 'Bond Pricing & Yield Measures', difficulty: 3, estimatedHours: 10, tags: ['fixed-income'] },
                { id: 'l1-fi-duration', title: 'Duration & Convexity', difficulty: 4, estimatedHours: 12, tags: ['fixed-income'] },
                { id: 'l1-fi-credit', title: 'Credit Analysis & Spreads', difficulty: 3, estimatedHours: 8, tags: ['fixed-income'] }
            ]
        },
        {
            id: 'cfa-l1-derivatives',
            name: 'Level I — Derivatives',
            type: 'compulsory',
            topics: [
                { id: 'l1-deriv-intro', title: 'Derivative Markets & Instruments', difficulty: 2, estimatedHours: 6, tags: ['derivatives'] },
                { id: 'l1-deriv-pricing', title: 'Forward & Futures Pricing', difficulty: 3, estimatedHours: 8, tags: ['derivatives'] },
                { id: 'l1-deriv-options', title: 'Options Valuation (Binomial, Put-Call Parity)', difficulty: 4, estimatedHours: 10, tags: ['derivatives'] },
                { id: 'l1-deriv-swaps', title: 'Swap Contracts', difficulty: 3, estimatedHours: 6, tags: ['derivatives'] }
            ]
        },
        {
            id: 'cfa-l1-alts',
            name: 'Level I — Alternative Investments',
            type: 'compulsory',
            topics: [
                { id: 'l1-alts-re', title: 'Real Estate Investments', difficulty: 2, estimatedHours: 5, weight: 0.6, tags: ['alternatives'] },
                { id: 'l1-alts-pe', title: 'Private Equity & Venture Capital', difficulty: 2, estimatedHours: 5, weight: 0.6, tags: ['alternatives'] },
                { id: 'l1-alts-hedge', title: 'Hedge Funds & Commodities', difficulty: 2, estimatedHours: 5, weight: 0.6, tags: ['alternatives'] }
            ]
        },
        {
            id: 'cfa-l1-pm',
            name: 'Level I — Portfolio Management',
            type: 'compulsory',
            topics: [
                { id: 'l1-pm-ips', title: 'Investment Policy Statement & Process', difficulty: 2, estimatedHours: 6, tags: ['portfolio'] },
                { id: 'l1-pm-modern', title: 'Modern Portfolio Theory (risk, return, diversification)', difficulty: 3, estimatedHours: 10, tags: ['portfolio'] },
                { id: 'l1-pm-capm', title: 'CAPM & Factor Models', difficulty: 3, estimatedHours: 8, tags: ['portfolio'] },
                { id: 'l1-pm-performance', title: 'Performance Evaluation & Attribution', difficulty: 2, estimatedHours: 6, tags: ['portfolio'] }
            ]
        }
    ]
};
