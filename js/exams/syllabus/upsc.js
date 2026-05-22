// ============================================================
// UPSC Civil Services Syllabus Data
// Version: 2026.1 | Updated: 2026-05-22
// Includes: Prelims GS + CSAT, Mains GS I–IV, Essay, and
//           top 10 most popular optional subjects
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['upsc'] = {
    version: '2026.1',
    updatedAt: '2026-05-22',
    examName: 'UPSC Civil Services',
    totalMarks: 2025,
    sections: [
        // ── PRELIMS ──────────────────────────────────────────────
        {
            id: 'prelims-gs1',
            name: 'Prelims — General Studies Paper I',
            type: 'compulsory',
            topics: [
                { id: 'p-history-ancient', title: 'Indian History — Ancient India', difficulty: 2, estimatedHours: 15, tags: ['history'] },
                { id: 'p-history-medieval', title: 'Indian History — Medieval India', difficulty: 2, estimatedHours: 12, tags: ['history'] },
                { id: 'p-history-modern', title: 'Indian History — Modern India & Freedom Movement', difficulty: 3, estimatedHours: 20, tags: ['history'] },
                { id: 'p-history-world', title: 'World History — Key events (18th–20th century)', difficulty: 2, estimatedHours: 10, tags: ['history'] },
                { id: 'p-geography-india', title: 'Indian Geography — Physical, Economic, Social', difficulty: 3, estimatedHours: 18, tags: ['geography'] },
                { id: 'p-geography-world', title: 'World Geography — Physical geography fundamentals', difficulty: 2, estimatedHours: 12, tags: ['geography'] },
                { id: 'p-polity', title: 'Indian Polity & Governance — Constitution, Panchayati Raj', difficulty: 3, estimatedHours: 20, tags: ['polity'] },
                { id: 'p-economy', title: 'Indian Economy — Growth, Development, Banking, Fiscal', difficulty: 3, estimatedHours: 18, tags: ['economy'] },
                { id: 'p-environment', title: 'Environment & Ecology — Biodiversity, Climate Change', difficulty: 2, estimatedHours: 12, tags: ['environment'] },
                { id: 'p-science', title: 'General Science — Physics, Chemistry, Biology basics', difficulty: 2, estimatedHours: 10, tags: ['science'] },
                { id: 'p-current', title: 'Current Affairs — National & International (6 months)', difficulty: 3, estimatedHours: 30, tags: ['current-affairs'] },
                { id: 'p-art-culture', title: 'Indian Art & Culture', difficulty: 2, estimatedHours: 10, tags: ['culture'] }
            ]
        },
        {
            id: 'prelims-csat',
            name: 'Prelims — CSAT (Paper II, Qualifying)',
            type: 'compulsory',
            topics: [
                { id: 'csat-comprehension', title: 'Reading Comprehension', difficulty: 2, estimatedHours: 6, weight: 0.6, tags: ['aptitude'] },
                { id: 'csat-reasoning', title: 'Logical Reasoning & Analytical Ability', difficulty: 2, estimatedHours: 8, weight: 0.6, tags: ['aptitude'] },
                { id: 'csat-data', title: 'Data Interpretation & Sufficiency', difficulty: 2, estimatedHours: 6, weight: 0.6, tags: ['aptitude'] },
                { id: 'csat-numeracy', title: 'Basic Numeracy (Class X level)', difficulty: 1, estimatedHours: 5, weight: 0.6, tags: ['aptitude'] },
                { id: 'csat-decision', title: 'Decision Making & Problem Solving', difficulty: 2, estimatedHours: 5, weight: 0.6, tags: ['aptitude'] }
            ]
        },
        // ── MAINS ────────────────────────────────────────────────
        {
            id: 'mains-essay',
            name: 'Mains — Essay Paper (250 marks)',
            type: 'compulsory',
            topics: [
                { id: 'essay-philosophical', title: 'Philosophical/Abstract Topics', difficulty: 3, estimatedHours: 10, tags: ['essay'] },
                { id: 'essay-social', title: 'Socio-Economic Topics', difficulty: 3, estimatedHours: 10, tags: ['essay'] },
                { id: 'essay-political', title: 'Political/Governance Topics', difficulty: 3, estimatedHours: 8, tags: ['essay'] },
                { id: 'essay-science', title: 'Science & Technology Topics', difficulty: 3, estimatedHours: 6, tags: ['essay'] },
                { id: 'essay-structure', title: 'Essay Structure & Writing Practice', difficulty: 3, estimatedHours: 15, tags: ['essay'] }
            ]
        },
        {
            id: 'mains-gs1',
            name: 'Mains — GS I (History, Geography, Society)',
            type: 'compulsory',
            topics: [
                { id: 'gs1-indian-culture', title: 'Indian Culture — Art forms, Literature, Architecture', difficulty: 2, estimatedHours: 12, tags: ['culture'] },
                { id: 'gs1-modern-history', title: 'Modern Indian History — 18th century to present', difficulty: 3, estimatedHours: 18, tags: ['history'] },
                { id: 'gs1-freedom', title: 'Freedom Struggle — Stages, Movements, Personalities', difficulty: 3, estimatedHours: 15, tags: ['history'] },
                { id: 'gs1-post-independence', title: 'Post-Independence Consolidation — Integration, Reorganization', difficulty: 2, estimatedHours: 10, tags: ['history'] },
                { id: 'gs1-world-history', title: 'World History — Industrial Revolution, World Wars, Colonialism', difficulty: 2, estimatedHours: 12, tags: ['history'] },
                { id: 'gs1-society', title: 'Indian Society — Diversity, Social Empowerment, Communalism', difficulty: 3, estimatedHours: 12, tags: ['society'] },
                { id: 'gs1-women', title: 'Role of Women, Population & Development', difficulty: 2, estimatedHours: 8, tags: ['society'] },
                { id: 'gs1-physical-geo', title: 'Physical Geography — Geomorphology, Climatology, Oceanography', difficulty: 3, estimatedHours: 15, tags: ['geography'] },
                { id: 'gs1-human-geo', title: 'Human Geography — Resources, Industries, Settlements', difficulty: 2, estimatedHours: 10, tags: ['geography'] },
                { id: 'gs1-disaster', title: 'Disaster Management — Types, Mitigation, NDRF', difficulty: 2, estimatedHours: 8, tags: ['geography'] }
            ]
        },
        {
            id: 'mains-gs2',
            name: 'Mains — GS II (Governance, Constitution, IR)',
            type: 'compulsory',
            topics: [
                { id: 'gs2-constitution', title: 'Indian Constitution — Features, Amendments, Basic Structure', difficulty: 3, estimatedHours: 18, weight: 1.3, tags: ['polity'] },
                { id: 'gs2-parliament', title: 'Parliament & State Legislatures — Functions, Privileges', difficulty: 2, estimatedHours: 10, weight: 1.3, tags: ['polity'] },
                { id: 'gs2-executive', title: 'Executive & Judiciary — Structure, Appointments, Judicial Activism', difficulty: 3, estimatedHours: 12, weight: 1.3, tags: ['polity'] },
                { id: 'gs2-federalism', title: 'Federalism — Centre-State Relations, Local Bodies', difficulty: 3, estimatedHours: 10, weight: 1.3, tags: ['polity'] },
                { id: 'gs2-governance', title: 'Governance — Transparency, Accountability, e-Governance', difficulty: 2, estimatedHours: 10, tags: ['governance'] },
                { id: 'gs2-social-justice', title: 'Social Justice — Welfare Schemes, Vulnerable Sections', difficulty: 2, estimatedHours: 10, tags: ['governance'] },
                { id: 'gs2-international', title: 'International Relations — India & Neighbours, Bilateral', difficulty: 3, estimatedHours: 15, tags: ['ir'] },
                { id: 'gs2-intl-orgs', title: 'International Organizations — UN, WTO, IMF, WHO', difficulty: 2, estimatedHours: 8, tags: ['ir'] },
                { id: 'gs2-pressure-groups', title: 'Pressure Groups, NGOs & SHGs', difficulty: 2, estimatedHours: 5, tags: ['governance'] }
            ]
        },
        {
            id: 'mains-gs3',
            name: 'Mains — GS III (Economy, Environment, Security)',
            type: 'compulsory',
            topics: [
                { id: 'gs3-economy', title: 'Indian Economy — Planning, Mobilization of Resources', difficulty: 3, estimatedHours: 15, tags: ['economy'] },
                { id: 'gs3-growth', title: 'Inclusive Growth — Employment, Poverty, Social Sector', difficulty: 2, estimatedHours: 10, tags: ['economy'] },
                { id: 'gs3-agriculture', title: 'Agriculture — Food Processing, Land Reforms, MSP', difficulty: 3, estimatedHours: 12, tags: ['economy'] },
                { id: 'gs3-infra', title: 'Infrastructure — Energy, Ports, Roads, Investment Models', difficulty: 2, estimatedHours: 10, tags: ['economy'] },
                { id: 'gs3-science-tech', title: 'Science & Technology — Developments, Indigenization', difficulty: 2, estimatedHours: 12, tags: ['science'] },
                { id: 'gs3-environment', title: 'Environment — Conservation, Pollution, EIA', difficulty: 3, estimatedHours: 12, tags: ['environment'] },
                { id: 'gs3-biodiversity', title: 'Biodiversity — Threats, IUCN, Protected Areas', difficulty: 2, estimatedHours: 8, tags: ['environment'] },
                { id: 'gs3-disaster', title: 'Disaster Management — NDMA, Sendai Framework', difficulty: 2, estimatedHours: 8, tags: ['security'] },
                { id: 'gs3-security', title: 'Internal Security — Insurgency, Terrorism, Cyber', difficulty: 3, estimatedHours: 12, tags: ['security'] },
                { id: 'gs3-border', title: 'Border Management & Money Laundering', difficulty: 2, estimatedHours: 6, tags: ['security'] }
            ]
        },
        {
            id: 'mains-gs4',
            name: 'Mains — GS IV (Ethics, Integrity, Aptitude)',
            type: 'compulsory',
            topics: [
                { id: 'gs4-ethics-basics', title: 'Ethics — Determinants, Consequences, Dimensions', difficulty: 2, estimatedHours: 10, tags: ['ethics'] },
                { id: 'gs4-thinkers', title: 'Contributions of Moral Thinkers (India & World)', difficulty: 3, estimatedHours: 12, tags: ['ethics'] },
                { id: 'gs4-attitude', title: 'Attitude — Content, Structure, Formation, Influence', difficulty: 2, estimatedHours: 8, tags: ['ethics'] },
                { id: 'gs4-aptitude', title: 'Aptitude & Foundational Values for Civil Service', difficulty: 2, estimatedHours: 8, tags: ['ethics'] },
                { id: 'gs4-emotional', title: 'Emotional Intelligence — Concepts & Application', difficulty: 2, estimatedHours: 6, tags: ['ethics'] },
                { id: 'gs4-public-admin', title: 'Ethics in Public Administration — Accountability, Laws', difficulty: 2, estimatedHours: 8, tags: ['ethics'] },
                { id: 'gs4-governance-ethics', title: 'Governance & Probity — RTI, Codes of Conduct', difficulty: 2, estimatedHours: 8, tags: ['ethics'] },
                { id: 'gs4-case-studies', title: 'Case Studies — Ethical Dilemma Analysis (6 cases)', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['ethics'] }
            ]
        },
        // ── OPTIONAL SUBJECTS (top 10 most popular) ──────────────
        {
            id: 'optional-anthropology',
            name: 'Optional — Anthropology',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'anth-physical', title: 'Physical/Biological Anthropology — Evolution, Genetics', difficulty: 3, estimatedHours: 20, tags: ['anthropology'] },
                { id: 'anth-social', title: 'Social Anthropology — Marriage, Family, Kinship', difficulty: 2, estimatedHours: 15, tags: ['anthropology'] },
                { id: 'anth-archaeological', title: 'Archaeological Anthropology — Prehistoric cultures', difficulty: 2, estimatedHours: 12, tags: ['anthropology'] },
                { id: 'anth-theories', title: 'Theories — Functionalism, Structuralism, Marxist', difficulty: 3, estimatedHours: 15, tags: ['anthropology'] },
                { id: 'anth-economic', title: 'Economic Anthropology — Production, Exchange, Globalization', difficulty: 2, estimatedHours: 10, tags: ['anthropology'] },
                { id: 'anth-political', title: 'Political Anthropology — Power, Authority, Conflict', difficulty: 2, estimatedHours: 10, tags: ['anthropology'] },
                { id: 'anth-indian-tribes', title: 'Indian Tribes — Classification, Problems, Development', difficulty: 3, estimatedHours: 18, tags: ['anthropology'] },
                { id: 'anth-caste', title: 'Caste System — Varna, Jajmani, Dominant Caste', difficulty: 3, estimatedHours: 12, tags: ['anthropology'] },
                { id: 'anth-religion', title: 'Religion & Society in India', difficulty: 2, estimatedHours: 10, tags: ['anthropology'] },
                { id: 'anth-applied', title: 'Applied Anthropology — Development, Health, Forensic', difficulty: 2, estimatedHours: 10, tags: ['anthropology'] }
            ]
        },
        {
            id: 'optional-geography',
            name: 'Optional — Geography',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'geo-geomorphology', title: 'Geomorphology — Earth origin, Plate tectonics, Weathering', difficulty: 3, estimatedHours: 15, tags: ['geography'] },
                { id: 'geo-climatology', title: 'Climatology — Atmospheric circulation, Jet streams, Cyclones', difficulty: 3, estimatedHours: 14, tags: ['geography'] },
                { id: 'geo-oceanography', title: 'Oceanography — Currents, Tides, Marine resources', difficulty: 2, estimatedHours: 10, tags: ['geography'] },
                { id: 'geo-biogeography', title: 'Biogeography — Ecosystems, Biomes, Biodiversity', difficulty: 2, estimatedHours: 10, tags: ['geography'] },
                { id: 'geo-human', title: 'Human Geography — Population, Migration, Urbanization', difficulty: 2, estimatedHours: 14, tags: ['geography'] },
                { id: 'geo-economic', title: 'Economic Geography — Agriculture, Industry, Trade', difficulty: 3, estimatedHours: 14, tags: ['geography'] },
                { id: 'geo-regional', title: 'Regional Planning & Development', difficulty: 2, estimatedHours: 10, tags: ['geography'] },
                { id: 'geo-models', title: 'Models & Theories in Geography', difficulty: 3, estimatedHours: 12, tags: ['geography'] },
                { id: 'geo-india-physical', title: 'India — Physical Geography (physiography, climate, soils)', difficulty: 3, estimatedHours: 15, tags: ['geography'] },
                { id: 'geo-india-human', title: 'India — Human & Economic Geography', difficulty: 3, estimatedHours: 14, tags: ['geography'] },
                { id: 'geo-cartography', title: 'Cartography & Remote Sensing / GIS', difficulty: 3, estimatedHours: 10, tags: ['geography'] }
            ]
        },
        {
            id: 'optional-sociology',
            name: 'Optional — Sociology',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'soc-basics', title: 'Sociology as Science — Methods, Objectivity', difficulty: 2, estimatedHours: 8, tags: ['sociology'] },
                { id: 'soc-thinkers', title: 'Sociological Thinkers — Marx, Weber, Durkheim, Merton', difficulty: 3, estimatedHours: 18, tags: ['sociology'] },
                { id: 'soc-stratification', title: 'Social Stratification — Class, Caste, Gender', difficulty: 3, estimatedHours: 14, tags: ['sociology'] },
                { id: 'soc-economy', title: 'Work & Economic Life — Formal/Informal, Globalization', difficulty: 2, estimatedHours: 10, tags: ['sociology'] },
                { id: 'soc-politics', title: 'Politics & Society — Power, Authority, Legitimacy', difficulty: 2, estimatedHours: 10, tags: ['sociology'] },
                { id: 'soc-religion', title: 'Religion & Society — Secularization, Fundamentalism', difficulty: 2, estimatedHours: 8, tags: ['sociology'] },
                { id: 'soc-kinship', title: 'Systems of Kinship — Family, Marriage, Household', difficulty: 2, estimatedHours: 8, tags: ['sociology'] },
                { id: 'soc-social-change', title: 'Social Change — Theories, Modernization, Development', difficulty: 3, estimatedHours: 12, tags: ['sociology'] },
                { id: 'soc-indian-society', title: 'Indian Society — Structure, Colonial impact, Movements', difficulty: 3, estimatedHours: 15, tags: ['sociology'] },
                { id: 'soc-challenges', title: 'Challenges — Communalism, Regionalism, Reservation', difficulty: 3, estimatedHours: 12, tags: ['sociology'] }
            ]
        },
        {
            id: 'optional-pub-admin',
            name: 'Optional — Public Administration',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'pa-intro', title: 'Introduction — Evolution, New Public Management', difficulty: 2, estimatedHours: 10, tags: ['pub-admin'] },
                { id: 'pa-theories', title: 'Administrative Theories — Classical, Neo-Classical, Modern', difficulty: 3, estimatedHours: 15, tags: ['pub-admin'] },
                { id: 'pa-organisation', title: 'Organisation Theory — Hierarchy, Centralisation, Delegation', difficulty: 2, estimatedHours: 10, tags: ['pub-admin'] },
                { id: 'pa-accountability', title: 'Accountability & Control — Legislative, Judicial, RTI', difficulty: 3, estimatedHours: 12, tags: ['pub-admin'] },
                { id: 'pa-financial', title: 'Financial Administration — Budget, Audit, Finance Commission', difficulty: 3, estimatedHours: 12, tags: ['pub-admin'] },
                { id: 'pa-personnel', title: 'Personnel Administration — Recruitment, Training, Morale', difficulty: 2, estimatedHours: 10, tags: ['pub-admin'] },
                { id: 'pa-indian-admin', title: 'Indian Administration — Civil Services, District, State', difficulty: 3, estimatedHours: 15, tags: ['pub-admin'] },
                { id: 'pa-local-govt', title: 'Local Government — 73rd/74th Amendments, Panchayats', difficulty: 2, estimatedHours: 10, tags: ['pub-admin'] },
                { id: 'pa-plans-policies', title: 'Plans & Policies — NITI Aayog, Welfare Schemes', difficulty: 2, estimatedHours: 10, tags: ['pub-admin'] }
            ]
        },
        {
            id: 'optional-history',
            name: 'Optional — History',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'hist-ancient-india', title: 'Ancient India — Indus Valley to Gupta Empire', difficulty: 2, estimatedHours: 18, tags: ['history'] },
                { id: 'hist-medieval-india', title: 'Medieval India — Delhi Sultanate, Mughals, Bhakti', difficulty: 3, estimatedHours: 18, tags: ['history'] },
                { id: 'hist-modern-india', title: 'Modern India — British Rule, National Movement', difficulty: 3, estimatedHours: 22, tags: ['history'] },
                { id: 'hist-post-1947', title: 'Post-Independence India — Integration, Nehru Era', difficulty: 2, estimatedHours: 12, tags: ['history'] },
                { id: 'hist-world-ancient', title: 'World History — Ancient Civilizations, Classical Empires', difficulty: 2, estimatedHours: 12, tags: ['history'] },
                { id: 'hist-world-modern', title: 'World History — Enlightenment, Revolutions, World Wars', difficulty: 3, estimatedHours: 18, tags: ['history'] },
                { id: 'hist-world-cold', title: 'World History — Cold War, Decolonization, UN', difficulty: 2, estimatedHours: 12, tags: ['history'] }
            ]
        },
        {
            id: 'optional-polsci',
            name: 'Optional — Political Science & IR',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'polsci-theory', title: 'Political Theory — Liberty, Equality, Justice, Rights', difficulty: 3, estimatedHours: 15, tags: ['polsci'] },
                { id: 'polsci-thinkers', title: 'Western Political Thinkers — Plato to Rawls', difficulty: 3, estimatedHours: 18, tags: ['polsci'] },
                { id: 'polsci-indian-thought', title: 'Indian Political Thought — Kautilya to Ambedkar', difficulty: 3, estimatedHours: 14, tags: ['polsci'] },
                { id: 'polsci-comparative', title: 'Comparative Politics & Governance', difficulty: 2, estimatedHours: 12, tags: ['polsci'] },
                { id: 'polsci-indian-politics', title: 'Indian Politics — Party System, Elections, Movements', difficulty: 3, estimatedHours: 15, tags: ['polsci'] },
                { id: 'polsci-ir-theories', title: 'International Relations — Realism, Liberalism, Constructivism', difficulty: 3, estimatedHours: 14, tags: ['polsci'] },
                { id: 'polsci-ir-india', title: 'India\'s Foreign Policy — Non-Alignment to Multi-Alignment', difficulty: 3, estimatedHours: 14, tags: ['polsci'] },
                { id: 'polsci-global', title: 'Global Issues — WTO, UN Reform, Nuclear Politics', difficulty: 2, estimatedHours: 10, tags: ['polsci'] }
            ]
        },
        {
            id: 'optional-philosophy',
            name: 'Optional — Philosophy',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'phil-epistemology', title: 'Epistemology — Knowledge, Truth, Rationalism, Empiricism', difficulty: 3, estimatedHours: 14, tags: ['philosophy'] },
                { id: 'phil-metaphysics', title: 'Metaphysics — Substance, Causation, Free Will', difficulty: 3, estimatedHours: 12, tags: ['philosophy'] },
                { id: 'phil-ethics-western', title: 'Western Ethics — Kant, Mill, Virtue Ethics', difficulty: 3, estimatedHours: 14, tags: ['philosophy'] },
                { id: 'phil-indian', title: 'Indian Philosophy — Nyaya, Vaisheshika, Vedanta, Buddhism, Jainism', difficulty: 3, estimatedHours: 18, tags: ['philosophy'] },
                { id: 'phil-logic', title: 'Logic — Classical & Symbolic', difficulty: 3, estimatedHours: 10, tags: ['philosophy'] },
                { id: 'phil-social', title: 'Social & Political Philosophy — Justice, Rights, State', difficulty: 2, estimatedHours: 10, tags: ['philosophy'] },
                { id: 'phil-religion', title: 'Philosophy of Religion — God, Evil, Religious Language', difficulty: 2, estimatedHours: 8, tags: ['philosophy'] }
            ]
        },
        {
            id: 'optional-economics',
            name: 'Optional — Economics',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'econ-micro', title: 'Microeconomics — Consumer & Producer Theory, Markets', difficulty: 3, estimatedHours: 18, tags: ['economics'] },
                { id: 'econ-macro', title: 'Macroeconomics — National Income, Inflation, Monetary Policy', difficulty: 3, estimatedHours: 18, tags: ['economics'] },
                { id: 'econ-intl-trade', title: 'International Economics — Trade Theories, BOP, WTO', difficulty: 3, estimatedHours: 14, tags: ['economics'] },
                { id: 'econ-growth', title: 'Growth & Development — Theories, Human Development, Poverty', difficulty: 3, estimatedHours: 14, tags: ['economics'] },
                { id: 'econ-public-finance', title: 'Public Finance — Taxation, Fiscal Policy, Debt', difficulty: 3, estimatedHours: 12, tags: ['economics'] },
                { id: 'econ-indian', title: 'Indian Economy — Planning, Reforms, Agriculture, Industry', difficulty: 3, estimatedHours: 20, tags: ['economics'] },
                { id: 'econ-stats', title: 'Statistics & Econometrics — Methods, Regression', difficulty: 4, estimatedHours: 14, tags: ['economics'] }
            ]
        },
        {
            id: 'optional-mathematics',
            name: 'Optional — Mathematics',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'maths-linear-algebra', title: 'Linear Algebra — Matrices, Eigenvalues, Vector spaces', difficulty: 3, estimatedHours: 18, tags: ['maths'] },
                { id: 'maths-calculus', title: 'Calculus — Limits, Continuity, Multivariable Calculus', difficulty: 3, estimatedHours: 20, tags: ['maths'] },
                { id: 'maths-real-analysis', title: 'Real Analysis — Sequences, Series, Uniform convergence', difficulty: 4, estimatedHours: 20, tags: ['maths'] },
                { id: 'maths-ode', title: 'Ordinary Differential Equations', difficulty: 3, estimatedHours: 14, tags: ['maths'] },
                { id: 'maths-pde', title: 'Partial Differential Equations', difficulty: 4, estimatedHours: 14, tags: ['maths'] },
                { id: 'maths-abstract-algebra', title: 'Abstract Algebra — Groups, Rings, Fields', difficulty: 4, estimatedHours: 18, tags: ['maths'] },
                { id: 'maths-statics-dynamics', title: 'Statics & Dynamics', difficulty: 3, estimatedHours: 14, tags: ['maths'] },
                { id: 'maths-numerical', title: 'Numerical Analysis & Programming', difficulty: 3, estimatedHours: 10, tags: ['maths'] }
            ]
        },
        {
            id: 'optional-law',
            name: 'Optional — Law',
            type: 'elective',
            group: 'optional-subject',
            selection: { mode: 'single', min: 1, max: 1 },
            topics: [
                { id: 'law-constitutional', title: 'Constitutional Law — Fundamental Rights, DPSP, Amendments', difficulty: 3, estimatedHours: 18, tags: ['law'] },
                { id: 'law-administrative', title: 'Administrative Law — Delegated Legislation, Judicial Review', difficulty: 3, estimatedHours: 14, tags: ['law'] },
                { id: 'law-international', title: 'International Law — Sources, Treaties, UN, ICJ', difficulty: 3, estimatedHours: 14, tags: ['law'] },
                { id: 'law-criminal', title: 'Criminal Law — IPC, CrPC, Evidence Act', difficulty: 3, estimatedHours: 16, tags: ['law'] },
                { id: 'law-torts', title: 'Law of Torts — Negligence, Nuisance, Strict Liability', difficulty: 2, estimatedHours: 10, tags: ['law'] },
                { id: 'law-contract', title: 'Law of Contracts — Indian Contract Act, Sale of Goods', difficulty: 2, estimatedHours: 12, tags: ['law'] },
                { id: 'law-labour', title: 'Labour & Industrial Law', difficulty: 2, estimatedHours: 10, tags: ['law'] },
                { id: 'law-environmental', title: 'Environmental Law — EPA, Wildlife, NGT', difficulty: 2, estimatedHours: 8, tags: ['law'] }
            ]
        }
    ]
};
