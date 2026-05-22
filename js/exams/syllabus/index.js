// ============================================================
// Syllabus Registry — lists all available exam syllabi
// Not required at runtime (each page loads its own file)
// but useful for tools/scripts that need the full list.
// ============================================================

window.SyllabusRegistry = {
    // US
    'sat': { name: 'SAT (Digital)', file: 'sat.js' },
    'gre': { name: 'GRE General Test', file: 'gre.js' },
    'act': { name: 'ACT', file: 'act.js' },
    'gmat': { name: 'GMAT Focus Edition', file: 'gmat.js' },
    'toefl': { name: 'TOEFL iBT', file: 'toefl.js' },
    'lsat': { name: 'LSAT', file: 'lsat.js' },
    'mcat': { name: 'MCAT', file: 'mcat.js' },
    'ap': { name: 'AP Examinations', file: 'ap.js' },
    'bar-exam': { name: 'Bar Exam (UBE)', file: 'bar-exam.js' },
    'fsot': { name: 'FSOT', file: 'fsot.js' },
    // India
    'jee-main': { name: 'JEE Main', file: 'jee-main.js' },
    'jee-advanced': { name: 'JEE Advanced', file: 'jee-advanced.js' },
    'neet': { name: 'NEET', file: 'neet.js' },
    'gate': { name: 'GATE (CS/IT)', file: 'gate.js' },
    'cat': { name: 'CAT', file: 'cat.js' },
    'upsc': { name: 'UPSC Civil Services', file: 'upsc.js' },
    // GB
    'a-levels': { name: 'A-Levels', file: 'a-levels.js' },
    'cambridge-igcse': { name: 'Cambridge IGCSE', file: 'cambridge-igcse.js' },
    'sqe': { name: 'SQE', file: 'sqe.js' },
    // International
    'ielts': { name: 'IELTS', file: 'ielts.js' },
    'cfa': { name: 'CFA Program', file: 'cfa.js' },
    'acca': { name: 'ACCA', file: 'acca.js' },
    'frm': { name: 'FRM', file: 'frm.js' },
    'ib': { name: 'IB Diploma', file: 'ib.js' },
    'sa-pro': { name: 'AWS SA Professional', file: 'sa-pro.js' },
    'az-305': { name: 'AZ-305 Azure Architect', file: 'az-305.js' },
    'ccie': { name: 'CCIE Enterprise', file: 'ccie.js' },
    // Asia
    'gaokao': { name: 'Gaokao', file: 'gaokao.js' },
    'csat': { name: 'CSAT (수능)', file: 'csat.js' },
    'eju': { name: 'EJU', file: 'eju.js' },
    // Olympiads
    'imo': { name: 'IMO', file: 'imo.js' },
    'ioi': { name: 'IOI', file: 'ioi.js' },
    'ipho': { name: 'IPhO', file: 'ipho.js' },
    'icho': { name: 'IChO', file: 'icho.js' }
};
