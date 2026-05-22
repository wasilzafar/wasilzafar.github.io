// ============================================================
// FRM (Financial Risk Manager) — GARP Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['frm'] = {
    examName: 'FRM (Financial Risk Manager)',
    version: '2026',
    sections: [
        {
            id: 'frm-foundations',
            name: 'Part I — Foundations of Risk Management',
            type: 'compulsory',
            topics: [
                { id: 'found-risk-types', title: 'Risk Types & Risk Management Process', difficulty: 2, estimatedHours: 10, tags: ['foundations'] },
                { id: 'found-governance', title: 'Risk Governance & Enterprise Risk Management', difficulty: 3, estimatedHours: 12, tags: ['foundations'] },
                { id: 'found-cases', title: 'Case Studies (LTCM, Barings, GFC, SVB)', difficulty: 3, estimatedHours: 10, weight: 1.2, tags: ['foundations'] }
            ]
        },
        {
            id: 'frm-quant',
            name: 'Part I — Quantitative Analysis',
            type: 'compulsory',
            topics: [
                { id: 'quant-probability', title: 'Probability Distributions & Statistics', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['quant'] },
                { id: 'quant-regression', title: 'Linear Regression & Econometrics', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['quant'] },
                { id: 'quant-simulation', title: 'Monte Carlo Simulation & Time Series', difficulty: 4, estimatedHours: 14, tags: ['quant'] },
                { id: 'quant-ml', title: 'Machine Learning Methods for Risk', difficulty: 3, estimatedHours: 10, tags: ['quant'] }
            ]
        },
        {
            id: 'frm-markets',
            name: 'Part I — Financial Markets & Products',
            type: 'compulsory',
            topics: [
                { id: 'mkts-bonds', title: 'Bonds, Interest Rates & Duration/Convexity', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['markets'] },
                { id: 'mkts-derivatives', title: 'Derivatives (Forwards, Futures, Swaps, Options)', difficulty: 4, estimatedHours: 22, weight: 1.3, tags: ['markets'] },
                { id: 'mkts-exotic', title: 'Exotic Options & Structured Products', difficulty: 4, estimatedHours: 12, tags: ['markets'] },
                { id: 'mkts-central', title: 'Central Clearing & Exchanges', difficulty: 2, estimatedHours: 8, tags: ['markets'] }
            ]
        },
        {
            id: 'frm-var',
            name: 'Part I — Valuation & Risk Models',
            type: 'compulsory',
            topics: [
                { id: 'var-measures', title: 'VaR (Parametric, Historical, Monte Carlo)', difficulty: 4, estimatedHours: 18, weight: 1.3, tags: ['valuation'] },
                { id: 'var-volatility', title: 'Volatility Models (EWMA, GARCH)', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['valuation'] },
                { id: 'var-stress', title: 'Stress Testing & Backtesting', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['valuation'] },
                { id: 'var-bsm', title: 'Black-Scholes-Merton & Option Greeks', difficulty: 4, estimatedHours: 16, tags: ['valuation'] }
            ]
        },
        {
            id: 'frm-market-risk',
            name: 'Part II — Market Risk',
            type: 'compulsory',
            topics: [
                { id: 'mr-parametric', title: 'Parametric & Non-Parametric VaR Approaches', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['market-risk'] },
                { id: 'mr-regulatory', title: 'Regulatory Capital (Basel FRTB, IMA vs SA)', difficulty: 4, estimatedHours: 16, weight: 1.3, tags: ['market-risk'] },
                { id: 'mr-correlation', title: 'Correlation Risk & Copulas', difficulty: 4, estimatedHours: 12, tags: ['market-risk'] }
            ]
        },
        {
            id: 'frm-credit-risk',
            name: 'Part II — Credit Risk',
            type: 'compulsory',
            topics: [
                { id: 'cr-models', title: 'Credit Risk Models (Merton, CreditMetrics, KMV)', difficulty: 4, estimatedHours: 18, weight: 1.3, tags: ['credit-risk'] },
                { id: 'cr-cva', title: 'CVA, DVA & Counterparty Risk', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['credit-risk'] },
                { id: 'cr-securitization', title: 'Securitization & Credit Derivatives', difficulty: 4, estimatedHours: 14, tags: ['credit-risk'] },
                { id: 'cr-default', title: 'Default Probability & Loss Given Default', difficulty: 3, estimatedHours: 12, tags: ['credit-risk'] }
            ]
        },
        {
            id: 'frm-operational',
            name: 'Part II — Operational & Liquidity Risk',
            type: 'compulsory',
            topics: [
                { id: 'op-framework', title: 'Operational Risk Framework & Measurement', difficulty: 3, estimatedHours: 14, tags: ['operational'] },
                { id: 'op-liquidity', title: 'Liquidity Risk (LCR, NSFR, Funding)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['operational'] },
                { id: 'op-regulation', title: 'Basel III/IV Capital Requirements', difficulty: 4, estimatedHours: 16, weight: 1.3, tags: ['operational'] }
            ]
        }
    ]
};
