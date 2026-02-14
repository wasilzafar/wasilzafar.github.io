/**
 * Doc Generator - Consulting Frameworks Series
 * Extends DocGenerator with consulting frameworks series document generators.
 * Requires: doc-generator-core.js loaded first.
 */
Object.assign(DocGenerator, {


  // ============================================================
  // CONSULTING FRAMEWORKS â€” Porter's Five Forces
  // ============================================================
  generatePorterFiveForcesWord: async function(filename, data) {
    var forces = [
      { key: 'threatNewEntrants', label: 'Threat of New Entrants' },
      { key: 'bargainingBuyers', label: 'Bargaining Power of Buyers' },
      { key: 'bargainingSuppliers', label: 'Bargaining Power of Suppliers' },
      { key: 'threatSubstitutes', label: 'Threat of Substitutes' },
      { key: 'competitiveRivalry', label: 'Competitive Rivalry' }
    ];
    var sections = [{ heading: "Porter's Five Forces Analysis", content: ['Industry: ' + (data.industryName || 'N/A'), 'Analyst: ' + (data.analystName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    forces.forEach(function(f) { sections.push({ heading: f.label, content: (data[f.key] || 'Not specified') + '\nRating: ' + (data[f.key + 'Rating'] || 'N/A') + '/5' }); });
    if (data.overallAssessment) sections.push({ heading: 'Overall Assessment', content: data.overallAssessment });
    if (data.strategicImplications) sections.push({ heading: 'Strategic Implications', content: data.strategicImplications });
    return this.generateWord(filename, { title: "Porter's Five Forces Analysis", author: 'Generated from wasilzafar.com', sections: sections });
  },
  generatePorterFiveForcesExcel: function(filename, data) {
    var rows = [
      ['Industry', data.industryName || ''], ['Analyst', data.analystName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Threat of New Entrants', data.threatNewEntrants || ''], ['  Rating (1-5)', data.threatNewEntrantsRating || ''],
      ['Bargaining Power of Buyers', data.bargainingBuyers || ''], ['  Rating (1-5)', data.bargainingBuyersRating || ''],
      ['Bargaining Power of Suppliers', data.bargainingSuppliers || ''], ['  Rating (1-5)', data.bargainingSuppliersRating || ''],
      ['Threat of Substitutes', data.threatSubstitutes || ''], ['  Rating (1-5)', data.threatSubstitutesRating || ''],
      ['Competitive Rivalry', data.competitiveRivalry || ''], ['  Rating (1-5)', data.competitiveRivalryRating || ''],
      ['', ''], ['Overall Assessment', data.overallAssessment || ''], ['Strategic Implications', data.strategicImplications || '']
    ];
    return this.generateExcel(filename, { sheetName: "Porter's Five Forces", headers: ['Force / Element', 'Analysis'], data: rows });
  },
  generatePorterFiveForcesPDF: function(filename, data) {
    var forces = [
      { key: 'threatNewEntrants', label: 'Threat of New Entrants' },
      { key: 'bargainingBuyers', label: 'Bargaining Power of Buyers' },
      { key: 'bargainingSuppliers', label: 'Bargaining Power of Suppliers' },
      { key: 'threatSubstitutes', label: 'Threat of Substitutes' },
      { key: 'competitiveRivalry', label: 'Competitive Rivalry' }
    ];
    var sections = [{ heading: "PORTER'S FIVE FORCES ANALYSIS", content: 'Industry: ' + (data.industryName || 'N/A') + '\nAnalyst: ' + (data.analystName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    forces.forEach(function(f) { sections.push({ heading: f.label + ' (Rating: ' + (data[f.key + 'Rating'] || 'N/A') + '/5)', content: data[f.key] || 'Not specified' }); });
    if (data.overallAssessment) sections.push({ heading: 'Overall Assessment', content: data.overallAssessment });
    if (data.strategicImplications) sections.push({ heading: 'Strategic Implications', content: data.strategicImplications });
    return this.generatePDF(filename, { title: "Porter's Five Forces Analysis", sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” BCG Growth-Share Matrix
  // ============================================================
  generateBcgMatrixWord: async function(filename, data) {
    var sections = [{ heading: 'BCG Growth-Share Matrix', content: ['Company: ' + (data.companyName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    var quads = [
      { key: 'stars', label: 'Stars (High Growth, High Share)' },
      { key: 'cashCows', label: 'Cash Cows (Low Growth, High Share)' },
      { key: 'questionMarks', label: 'Question Marks (High Growth, Low Share)' },
      { key: 'dogs', label: 'Dogs (Low Growth, Low Share)' }
    ];
    quads.forEach(function(q) { sections.push({ heading: q.label, content: data[q.key] || 'Not specified' }); });
    if (data.portfolioStrategy) sections.push({ heading: 'Portfolio Strategy', content: data.portfolioStrategy });
    return this.generateWord(filename, { title: 'BCG Growth-Share Matrix', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateBcgMatrixExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Stars (High Growth, High Share)', data.stars || ''],
      ['Cash Cows (Low Growth, High Share)', data.cashCows || ''],
      ['Question Marks (High Growth, Low Share)', data.questionMarks || ''],
      ['Dogs (Low Growth, Low Share)', data.dogs || ''],
      ['', ''], ['Portfolio Strategy', data.portfolioStrategy || '']
    ];
    return this.generateExcel(filename, { sheetName: 'BCG Matrix', headers: ['Quadrant', 'Products / Analysis'], data: rows });
  },
  generateBcgMatrixPDF: function(filename, data) {
    var sections = [
      { heading: 'BCG GROWTH-SHARE MATRIX', content: 'Company: ' + (data.companyName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Stars (High Growth, High Share)', content: data.stars || 'Not specified' },
      { heading: 'Cash Cows (Low Growth, High Share)', content: data.cashCows || 'Not specified' },
      { heading: 'Question Marks (High Growth, Low Share)', content: data.questionMarks || 'Not specified' },
      { heading: 'Dogs (Low Growth, Low Share)', content: data.dogs || 'Not specified' },
      { heading: 'Portfolio Strategy', content: data.portfolioStrategy || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'BCG Growth-Share Matrix', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Market Entry Assessment
  // ============================================================
  generateMarketEntryWord: async function(filename, data) {
    var sections = [
      { heading: 'Market Entry Assessment', content: ['Company: ' + (data.companyName || 'N/A'), 'Target Market: ' + (data.targetMarket || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Market Attractiveness', content: data.marketAttractiveness || 'Not specified' },
      { heading: 'Competitive Landscape', content: data.competitiveLandscape || 'Not specified' },
      { heading: 'Entry Mode', content: data.entryMode || 'Not specified' },
      { heading: 'Key Success Factors', content: data.keySuccessFactors || 'Not specified' },
      { heading: 'Risks & Barriers', content: data.risksBarriers || 'Not specified' },
      { heading: 'Financial Projections', content: data.financialProjections || 'Not specified' },
      { heading: 'Go/No-Go Recommendation', content: data.recommendation || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Market Entry Assessment', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateMarketEntryExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Target Market', data.targetMarket || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Market Attractiveness', data.marketAttractiveness || ''],
      ['Competitive Landscape', data.competitiveLandscape || ''],
      ['Entry Mode', data.entryMode || ''],
      ['Key Success Factors', data.keySuccessFactors || ''],
      ['Risks & Barriers', data.risksBarriers || ''],
      ['Financial Projections', data.financialProjections || ''],
      ['Go/No-Go Recommendation', data.recommendation || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Market Entry', headers: ['Element', 'Analysis'], data: rows });
  },
  generateMarketEntryPDF: function(filename, data) {
    var sections = [
      { heading: 'MARKET ENTRY ASSESSMENT', content: 'Company: ' + (data.companyName || 'N/A') + '\nTarget Market: ' + (data.targetMarket || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Market Attractiveness', content: data.marketAttractiveness || 'Not specified' },
      { heading: 'Competitive Landscape', content: data.competitiveLandscape || 'Not specified' },
      { heading: 'Entry Mode', content: data.entryMode || 'Not specified' },
      { heading: 'Key Success Factors', content: data.keySuccessFactors || 'Not specified' },
      { heading: 'Risks & Barriers', content: data.risksBarriers || 'Not specified' },
      { heading: 'Financial Projections', content: data.financialProjections || 'Not specified' },
      { heading: 'Go/No-Go Recommendation', content: data.recommendation || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Market Entry Assessment', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” McKinsey 7S Assessment
  // ============================================================
  generateMcKinsey7SWord: async function(filename, data) {
    var elements = [
      { key: 'strategy', label: 'Strategy' }, { key: 'structure', label: 'Structure' },
      { key: 'systems', label: 'Systems' }, { key: 'sharedValues', label: 'Shared Values' },
      { key: 'style', label: 'Style' }, { key: 'staff', label: 'Staff' }, { key: 'skills', label: 'Skills' }
    ];
    var sections = [{ heading: 'McKinsey 7S Assessment', content: ['Organization: ' + (data.orgName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    elements.forEach(function(e) { sections.push({ heading: e.label, content: data[e.key] || 'Not specified' }); });
    if (data.alignmentGaps) sections.push({ heading: 'Alignment Gaps', content: data.alignmentGaps });
    return this.generateWord(filename, { title: 'McKinsey 7S Assessment', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateMcKinsey7SExcel: function(filename, data) {
    var rows = [
      ['Organization', data.orgName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Strategy', data.strategy || ''], ['Structure', data.structure || ''], ['Systems', data.systems || ''],
      ['Shared Values', data.sharedValues || ''], ['Style', data.style || ''], ['Staff', data.staff || ''], ['Skills', data.skills || ''],
      ['', ''], ['Alignment Gaps', data.alignmentGaps || '']
    ];
    return this.generateExcel(filename, { sheetName: 'McKinsey 7S', headers: ['Element', 'Assessment'], data: rows });
  },
  generateMcKinsey7SPDF: function(filename, data) {
    var elements = ['Strategy', 'Structure', 'Systems', 'Shared Values', 'Style', 'Staff', 'Skills'];
    var keys = ['strategy', 'structure', 'systems', 'sharedValues', 'style', 'staff', 'skills'];
    var sections = [{ heading: 'McKINSEY 7S ASSESSMENT', content: 'Organization: ' + (data.orgName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    elements.forEach(function(e, i) { sections.push({ heading: e, content: data[keys[i]] || 'Not specified' }); });
    if (data.alignmentGaps) sections.push({ heading: 'Alignment Gaps', content: data.alignmentGaps });
    return this.generatePDF(filename, { title: 'McKinsey 7S Assessment', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Change Readiness / ADKAR
  // ============================================================
  generateChangeReadinessWord: async function(filename, data) {
    var adkar = ['awareness', 'desire', 'knowledge', 'ability', 'reinforcement'];
    var labels = ['Awareness', 'Desire', 'Knowledge', 'Ability', 'Reinforcement'];
    var sections = [{ heading: 'Change Readiness Assessment (ADKAR)', content: ['Organization: ' + (data.orgName || 'N/A'), 'Change Initiative: ' + (data.changeInitiative || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    adkar.forEach(function(a, i) { sections.push({ heading: labels[i], content: (data[a] || 'Not specified') + '\nRating: ' + (data[a + 'Rating'] || 'N/A') + '/5' }); });
    if (data.stakeholderImpact) sections.push({ heading: 'Stakeholder Impact', content: data.stakeholderImpact });
    if (data.actionPlan) sections.push({ heading: 'Action Plan', content: data.actionPlan });
    return this.generateWord(filename, { title: 'Change Readiness Assessment', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateChangeReadinessExcel: function(filename, data) {
    var rows = [
      ['Organization', data.orgName || ''], ['Change Initiative', data.changeInitiative || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Awareness', data.awareness || ''], ['  Rating (1-5)', data.awarenessRating || ''],
      ['Desire', data.desire || ''], ['  Rating (1-5)', data.desireRating || ''],
      ['Knowledge', data.knowledge || ''], ['  Rating (1-5)', data.knowledgeRating || ''],
      ['Ability', data.ability || ''], ['  Rating (1-5)', data.abilityRating || ''],
      ['Reinforcement', data.reinforcement || ''], ['  Rating (1-5)', data.reinforcementRating || ''],
      ['', ''], ['Stakeholder Impact', data.stakeholderImpact || ''], ['Action Plan', data.actionPlan || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Change Readiness', headers: ['ADKAR Element', 'Assessment'], data: rows });
  },
  generateChangeReadinessPDF: function(filename, data) {
    var adkar = ['awareness', 'desire', 'knowledge', 'ability', 'reinforcement'];
    var labels = ['Awareness', 'Desire', 'Knowledge', 'Ability', 'Reinforcement'];
    var sections = [{ heading: 'CHANGE READINESS ASSESSMENT (ADKAR)', content: 'Organization: ' + (data.orgName || 'N/A') + '\nChange Initiative: ' + (data.changeInitiative || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    adkar.forEach(function(a, i) { sections.push({ heading: labels[i] + ' (Rating: ' + (data[a + 'Rating'] || 'N/A') + '/5)', content: data[a] || 'Not specified' }); });
    if (data.stakeholderImpact) sections.push({ heading: 'Stakeholder Impact', content: data.stakeholderImpact });
    if (data.actionPlan) sections.push({ heading: 'Action Plan', content: data.actionPlan });
    return this.generatePDF(filename, { title: 'Change Readiness Assessment', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” DCF Valuation Calculator
  // ============================================================
  generateDcfValuationExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Analyst', data.analystName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Revenue Year 1', data.revenueY1 || ''], ['Revenue Year 2', data.revenueY2 || ''], ['Revenue Year 3', data.revenueY3 || ''],
      ['Revenue Year 4', data.revenueY4 || ''], ['Revenue Year 5', data.revenueY5 || ''],
      ['Operating Margin (%)', data.operatingMargin || ''], ['Tax Rate (%)', data.taxRate || ''],
      ['Discount Rate / WACC (%)', data.discountRate || ''], ['Terminal Growth Rate (%)', data.terminalGrowth || ''],
      ['', ''], ['Assumptions & Notes', data.assumptions || '']
    ];
    return this.generateExcel(filename, { sheetName: 'DCF Valuation', headers: ['Parameter', 'Value'], data: rows });
  },
  generateDcfValuationPDF: function(filename, data) {
    var sections = [
      { heading: 'DCF VALUATION MODEL', content: 'Company: ' + (data.companyName || 'N/A') + '\nAnalyst: ' + (data.analystName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Revenue Projections', content: 'Year 1: ' + (data.revenueY1 || 'N/A') + '\nYear 2: ' + (data.revenueY2 || 'N/A') + '\nYear 3: ' + (data.revenueY3 || 'N/A') + '\nYear 4: ' + (data.revenueY4 || 'N/A') + '\nYear 5: ' + (data.revenueY5 || 'N/A') },
      { heading: 'Key Assumptions', content: 'Operating Margin: ' + (data.operatingMargin || 'N/A') + '%\nTax Rate: ' + (data.taxRate || 'N/A') + '%\nDiscount Rate (WACC): ' + (data.discountRate || 'N/A') + '%\nTerminal Growth Rate: ' + (data.terminalGrowth || 'N/A') + '%' },
      { heading: 'Assumptions & Notes', content: data.assumptions || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'DCF Valuation Model', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Due Diligence Checklist
  // ============================================================
  generateDueDiligenceChecklistWord: async function(filename, data) {
    var sections = [
      { heading: 'Due Diligence Checklist', content: ['Target Company: ' + (data.targetCompany || 'N/A'), 'Deal Type: ' + (data.dealType || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Financial Items', content: data.financialItems || 'Not specified' },
      { heading: 'Legal Items', content: data.legalItems || 'Not specified' },
      { heading: 'Operational Items', content: data.operationalItems || 'Not specified' },
      { heading: 'Commercial Items', content: data.commercialItems || 'Not specified' },
      { heading: 'HR Items', content: data.hrItems || 'Not specified' },
      { heading: 'Red Flags', content: data.redFlags || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Due Diligence Checklist', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateDueDiligenceChecklistExcel: function(filename, data) {
    var rows = [
      ['Target Company', data.targetCompany || ''], ['Deal Type', data.dealType || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Financial Items', data.financialItems || ''], ['Legal Items', data.legalItems || ''],
      ['Operational Items', data.operationalItems || ''], ['Commercial Items', data.commercialItems || ''],
      ['HR Items', data.hrItems || ''], ['', ''], ['Red Flags', data.redFlags || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Due Diligence', headers: ['Category', 'Checklist / Notes'], data: rows });
  },
  generateDueDiligenceChecklistPDF: function(filename, data) {
    var sections = [
      { heading: 'DUE DILIGENCE CHECKLIST', content: 'Target Company: ' + (data.targetCompany || 'N/A') + '\nDeal Type: ' + (data.dealType || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Financial Items', content: data.financialItems || 'Not specified' },
      { heading: 'Legal Items', content: data.legalItems || 'Not specified' },
      { heading: 'Operational Items', content: data.operationalItems || 'Not specified' },
      { heading: 'Commercial Items', content: data.commercialItems || 'Not specified' },
      { heading: 'HR Items', content: data.hrItems || 'Not specified' },
      { heading: 'Red Flags', content: data.redFlags || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Due Diligence Checklist', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Problem Definition Canvas
  // ============================================================
  generateProblemDefinitionWord: async function(filename, data) {
    var sections = [
      { heading: 'Problem Definition Canvas', content: ['Problem: ' + (data.problemTitle || 'N/A'), 'Client: ' + (data.clientName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Problem Statement', content: data.problemStatement || 'Not specified' },
      { heading: 'Context & Background', content: data.context || 'Not specified' },
      { heading: 'Scope & Boundaries', content: data.scope || 'Not specified' },
      { heading: 'Stakeholders Affected', content: data.stakeholders || 'Not specified' },
      { heading: 'Constraints', content: data.constraints || 'Not specified' },
      { heading: 'Success Criteria', content: data.successCriteria || 'Not specified' },
      { heading: 'Initial Hypotheses', content: data.initialHypotheses || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Problem Definition Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateProblemDefinitionExcel: function(filename, data) {
    var rows = [
      ['Problem Title', data.problemTitle || ''], ['Client', data.clientName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Problem Statement', data.problemStatement || ''], ['Context & Background', data.context || ''],
      ['Scope & Boundaries', data.scope || ''], ['Stakeholders Affected', data.stakeholders || ''],
      ['Constraints', data.constraints || ''], ['Success Criteria', data.successCriteria || ''],
      ['Initial Hypotheses', data.initialHypotheses || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Problem Definition', headers: ['Element', 'Description'], data: rows });
  },
  generateProblemDefinitionPDF: function(filename, data) {
    var sections = [
      { heading: 'PROBLEM DEFINITION CANVAS', content: 'Problem: ' + (data.problemTitle || 'N/A') + '\nClient: ' + (data.clientName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Problem Statement', content: data.problemStatement || 'Not specified' },
      { heading: 'Context & Background', content: data.context || 'Not specified' },
      { heading: 'Scope & Boundaries', content: data.scope || 'Not specified' },
      { heading: 'Stakeholders Affected', content: data.stakeholders || 'Not specified' },
      { heading: 'Constraints', content: data.constraints || 'Not specified' },
      { heading: 'Success Criteria', content: data.successCriteria || 'Not specified' },
      { heading: 'Initial Hypotheses', content: data.initialHypotheses || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Problem Definition Canvas', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Prioritization Matrix
  // ============================================================
  generatePrioritizationMatrixExcel: function(filename, data) {
    var rows = [
      ['Project', data.projectName || ''], ['Date', new Date().toLocaleDateString()], ['', '']
    ];
    for (var i = 1; i <= 5; i++) {
      var name = data['item' + i + 'Name'];
      if (name && name.trim()) {
        rows.push([name, 'Impact: ' + (data['item' + i + 'Impact'] || '') + ' | Effort: ' + (data['item' + i + 'Effort'] || '')]);
      }
    }
    if (data.notes) { rows.push(['', '']); rows.push(['Notes', data.notes]); }
    return this.generateExcel(filename, { sheetName: 'Prioritization Matrix', headers: ['Initiative', 'Impact & Effort'], data: rows });
  },
  generatePrioritizationMatrixPDF: function(filename, data) {
    var lines = [{ text: 'PRIORITIZATION MATRIX', size: 16, bold: true }, { text: 'Project: ' + (data.projectName || 'N/A') + '  |  Date: ' + new Date().toLocaleDateString(), size: 11 }, { text: '', size: 8 }];
    for (var i = 1; i <= 5; i++) {
      var name = data['item' + i + 'Name'];
      if (name && name.trim()) {
        lines.push({ text: name, size: 13, bold: true });
        lines.push({ text: 'Impact: ' + (data['item' + i + 'Impact'] || 'N/A') + '/5  |  Effort: ' + (data['item' + i + 'Effort'] || 'N/A') + '/5', size: 11 });
        lines.push({ text: '', size: 6 });
      }
    }
    if (data.notes) { lines.push({ text: 'Notes', size: 13, bold: true }); lines.push({ text: data.notes, size: 11 }); }
    return this.generatePDF(filename, { title: 'Prioritization Matrix', lines: lines });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Value Chain Analysis
  // ============================================================
  generateValueChainAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Value Chain Analysis', content: ['Company: ' + (data.companyName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Inbound Logistics', content: data.inboundLogistics || 'Not specified' },
      { heading: 'Operations', content: data.operations || 'Not specified' },
      { heading: 'Outbound Logistics', content: data.outboundLogistics || 'Not specified' },
      { heading: 'Marketing & Sales', content: data.marketingSales || 'Not specified' },
      { heading: 'Service', content: data.service || 'Not specified' },
      { heading: 'Firm Infrastructure (Support)', content: data.firmInfrastructure || 'Not specified' },
      { heading: 'Human Resources (Support)', content: data.humanResources || 'Not specified' },
      { heading: 'Technology Development (Support)', content: data.technologyDev || 'Not specified' },
      { heading: 'Procurement (Support)', content: data.procurement || 'Not specified' },
      { heading: 'Competitive Advantage Sources', content: data.competitiveAdvantage || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Value Chain Analysis', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateValueChainAnalysisExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['--- PRIMARY ACTIVITIES ---', ''],
      ['Inbound Logistics', data.inboundLogistics || ''], ['Operations', data.operations || ''],
      ['Outbound Logistics', data.outboundLogistics || ''], ['Marketing & Sales', data.marketingSales || ''], ['Service', data.service || ''],
      ['', ''], ['--- SUPPORT ACTIVITIES ---', ''],
      ['Firm Infrastructure', data.firmInfrastructure || ''], ['Human Resources', data.humanResources || ''],
      ['Technology Development', data.technologyDev || ''], ['Procurement', data.procurement || ''],
      ['', ''], ['Competitive Advantage Sources', data.competitiveAdvantage || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Value Chain', headers: ['Activity', 'Analysis'], data: rows });
  },
  generateValueChainAnalysisPDF: function(filename, data) {
    var sections = [
      { heading: 'VALUE CHAIN ANALYSIS', content: 'Company: ' + (data.companyName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'PRIMARY ACTIVITIES', content: '' },
      { heading: 'Inbound Logistics', content: data.inboundLogistics || 'Not specified' },
      { heading: 'Operations', content: data.operations || 'Not specified' },
      { heading: 'Outbound Logistics', content: data.outboundLogistics || 'Not specified' },
      { heading: 'Marketing & Sales', content: data.marketingSales || 'Not specified' },
      { heading: 'Service', content: data.service || 'Not specified' },
      { heading: 'SUPPORT ACTIVITIES', content: '' },
      { heading: 'Firm Infrastructure', content: data.firmInfrastructure || 'Not specified' },
      { heading: 'Human Resources', content: data.humanResources || 'Not specified' },
      { heading: 'Technology Development', content: data.technologyDev || 'Not specified' },
      { heading: 'Procurement', content: data.procurement || 'Not specified' },
      { heading: 'Competitive Advantage Sources', content: data.competitiveAdvantage || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Value Chain Analysis', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Blue Ocean Strategy Canvas
  // ============================================================
  generateBlueOceanStrategyWord: async function(filename, data) {
    var sections = [
      { heading: 'Blue Ocean Strategy Canvas', content: ['Company: ' + (data.companyName || 'N/A'), 'Industry: ' + (data.industryName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Eliminate', content: data.eliminate || 'Not specified' },
      { heading: 'Reduce', content: data.reduce || 'Not specified' },
      { heading: 'Raise', content: data.raise || 'Not specified' },
      { heading: 'Create', content: data.create || 'Not specified' },
      { heading: 'New Value Curve', content: data.newValueCurve || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Blue Ocean Strategy Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateBlueOceanStrategyExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Industry', data.industryName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Eliminate', data.eliminate || ''], ['Reduce', data.reduce || ''],
      ['Raise', data.raise || ''], ['Create', data.create || ''],
      ['', ''], ['New Value Curve', data.newValueCurve || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Blue Ocean', headers: ['ERRC Grid', 'Details'], data: rows });
  },
  generateBlueOceanStrategyPDF: function(filename, data) {
    var sections = [
      { heading: 'BLUE OCEAN STRATEGY CANVAS', content: 'Company: ' + (data.companyName || 'N/A') + '\nIndustry: ' + (data.industryName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Eliminate', content: data.eliminate || 'Not specified' },
      { heading: 'Reduce', content: data.reduce || 'Not specified' },
      { heading: 'Raise', content: data.raise || 'Not specified' },
      { heading: 'Create', content: data.create || 'Not specified' },
      { heading: 'New Value Curve', content: data.newValueCurve || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Blue Ocean Strategy Canvas', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Stakeholder Map
  // ============================================================
  generateStakeholderMapWord: async function(filename, data) {
    var sections = [
      { heading: 'Stakeholder Map', content: ['Project: ' + (data.projectName || 'N/A'), 'Analyst: ' + (data.analystName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Manage Closely (High Power, High Interest)', content: data.manageClosely || 'Not specified' },
      { heading: '  Strategy', content: data.manageCloselyStrategy || 'Not specified' },
      { heading: 'Keep Satisfied (High Power, Low Interest)', content: data.keepSatisfied || 'Not specified' },
      { heading: '  Strategy', content: data.keepSatisfiedStrategy || 'Not specified' },
      { heading: 'Keep Informed (Low Power, High Interest)', content: data.keepInformed || 'Not specified' },
      { heading: '  Strategy', content: data.keepInformedStrategy || 'Not specified' },
      { heading: 'Monitor (Low Power, Low Interest)', content: data.monitor || 'Not specified' },
      { heading: '  Strategy', content: data.monitorStrategy || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Stakeholder Map', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateStakeholderMapExcel: function(filename, data) {
    var rows = [
      ['Project', data.projectName || ''], ['Analyst', data.analystName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['--- MANAGE CLOSELY (High Power, High Interest) ---', ''],
      ['Stakeholders', data.manageClosely || ''], ['Strategy', data.manageCloselyStrategy || ''], ['', ''],
      ['--- KEEP SATISFIED (High Power, Low Interest) ---', ''],
      ['Stakeholders', data.keepSatisfied || ''], ['Strategy', data.keepSatisfiedStrategy || ''], ['', ''],
      ['--- KEEP INFORMED (Low Power, High Interest) ---', ''],
      ['Stakeholders', data.keepInformed || ''], ['Strategy', data.keepInformedStrategy || ''], ['', ''],
      ['--- MONITOR (Low Power, Low Interest) ---', ''],
      ['Stakeholders', data.monitor || ''], ['Strategy', data.monitorStrategy || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Stakeholder Map', headers: ['Quadrant / Element', 'Details'], data: rows });
  },
  generateStakeholderMapPDF: function(filename, data) {
    var sections = [
      { heading: 'STAKEHOLDER MAP', content: 'Project: ' + (data.projectName || 'N/A') + '\nAnalyst: ' + (data.analystName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Manage Closely (High Power, High Interest)', content: (data.manageClosely || 'Not specified') + '\nStrategy: ' + (data.manageCloselyStrategy || 'Not specified') },
      { heading: 'Keep Satisfied (High Power, Low Interest)', content: (data.keepSatisfied || 'Not specified') + '\nStrategy: ' + (data.keepSatisfiedStrategy || 'Not specified') },
      { heading: 'Keep Informed (Low Power, High Interest)', content: (data.keepInformed || 'Not specified') + '\nStrategy: ' + (data.keepInformedStrategy || 'Not specified') },
      { heading: 'Monitor (Low Power, Low Interest)', content: (data.monitor || 'Not specified') + '\nStrategy: ' + (data.monitorStrategy || 'Not specified') }
    ];
    return this.generatePDF(filename, { title: 'Stakeholder Map', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Case Interview Framework Builder
  // ============================================================
  generateCaseInterviewFrameworkWord: async function(filename, data) {
    var sections = [
      { heading: 'Case Interview Framework', content: ['Case: ' + (data.caseTitle || 'N/A'), 'Type: ' + (data.caseType || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Client Situation', content: data.clientSituation || 'Not specified' },
      { heading: 'Key Question', content: data.keyQuestion || 'Not specified' }
    ];
    for (var i = 1; i <= 4; i++) { var b = data['frameworkBranch' + i]; if (b && b.trim()) sections.push({ heading: 'Framework Branch ' + i, content: b }); }
    sections.push({ heading: 'Hypothesis', content: data.hypothesis || 'Not specified' });
    sections.push({ heading: 'Recommendation', content: data.recommendation || 'Not specified' });
    return this.generateWord(filename, { title: 'Case Interview Framework', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateCaseInterviewFrameworkExcel: function(filename, data) {
    var rows = [
      ['Case Title', data.caseTitle || ''], ['Case Type', data.caseType || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Client Situation', data.clientSituation || ''], ['Key Question', data.keyQuestion || '']
    ];
    for (var i = 1; i <= 4; i++) { var b = data['frameworkBranch' + i]; if (b && b.trim()) rows.push(['Framework Branch ' + i, b]); }
    rows.push(['', '']); rows.push(['Hypothesis', data.hypothesis || '']); rows.push(['Recommendation', data.recommendation || '']);
    return this.generateExcel(filename, { sheetName: 'Case Framework', headers: ['Element', 'Details'], data: rows });
  },
  generateCaseInterviewFrameworkPDF: function(filename, data) {
    var sections = [
      { heading: 'CASE INTERVIEW FRAMEWORK', content: 'Case: ' + (data.caseTitle || 'N/A') + '\nType: ' + (data.caseType || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Client Situation', content: data.clientSituation || 'Not specified' },
      { heading: 'Key Question', content: data.keyQuestion || 'Not specified' }
    ];
    for (var i = 1; i <= 4; i++) { var b = data['frameworkBranch' + i]; if (b && b.trim()) sections.push({ heading: 'Framework Branch ' + i, content: b }); }
    sections.push({ heading: 'Hypothesis', content: data.hypothesis || 'Not specified' });
    sections.push({ heading: 'Recommendation', content: data.recommendation || 'Not specified' });
    return this.generatePDF(filename, { title: 'Case Interview Framework', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS â€” Jobs-to-be-Done (JTBD)
  // ============================================================
  generateJobsToBeDoneWord: async function(filename, data) {
    var sections = [
      { heading: 'Jobs-to-be-Done Analysis', content: ['Product: ' + (data.productName || 'N/A'), 'Target Customer: ' + (data.targetCustomer || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Functional Job', content: data.functionalJob || 'Not specified' },
      { heading: 'Emotional Job', content: data.emotionalJob || 'Not specified' },
      { heading: 'Social Job', content: data.socialJob || 'Not specified' },
      { heading: 'Current Solutions', content: data.currentSolutions || 'Not specified' },
      { heading: 'Pain Points', content: data.pains || 'Not specified' },
      { heading: 'Desired Outcomes', content: data.desiredOutcomes || 'Not specified' },
      { heading: 'Innovation Opportunities', content: data.innovationOpp || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Jobs-to-be-Done Analysis', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateJobsToBeDoneExcel: function(filename, data) {
    var rows = [
      ['Product / Service', data.productName || ''], ['Target Customer', data.targetCustomer || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Functional Job', data.functionalJob || ''], ['Emotional Job', data.emotionalJob || ''], ['Social Job', data.socialJob || ''],
      ['', ''], ['Current Solutions', data.currentSolutions || ''], ['Pain Points', data.pains || ''],
      ['Desired Outcomes', data.desiredOutcomes || ''], ['Innovation Opportunities', data.innovationOpp || '']
    ];
    return this.generateExcel(filename, { sheetName: 'JTBD', headers: ['Job Element', 'Description'], data: rows });
  },
  generateJobsToBeDonePDF: function(filename, data) {
    var sections = [
      { heading: 'JOBS-TO-BE-DONE ANALYSIS', content: 'Product: ' + (data.productName || 'N/A') + '\nTarget Customer: ' + (data.targetCustomer || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Functional Job', content: data.functionalJob || 'Not specified' },
      { heading: 'Emotional Job', content: data.emotionalJob || 'Not specified' },
      { heading: 'Social Job', content: data.socialJob || 'Not specified' },
      { heading: 'Current Solutions', content: data.currentSolutions || 'Not specified' },
      { heading: 'Pain Points', content: data.pains || 'Not specified' },
      { heading: 'Desired Outcomes', content: data.desiredOutcomes || 'Not specified' },
      { heading: 'Innovation Opportunities', content: data.innovationOpp || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Jobs-to-be-Done Analysis', sections: sections });
  },


  // ============================================================
  // PPTX â€” Consulting Frameworks (12 generators)
  // ============================================================
  generatePorterFiveForcesPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: "Porter's Five Forces Analysis", entityName: data.companyName || 'Company', sections: [
      { heading: 'Competitive Rivalry', content: data.rivalry }, { heading: 'Threat of New Entrants', content: data.newEntrants },
      { heading: 'Threat of Substitutes', content: data.substitutes }, { heading: 'Buyer Power', content: data.buyerPower },
      { heading: 'Supplier Power', content: data.supplierPower }, { heading: 'Overall Assessment', content: data.overallAssessment }
    ]});
  },
  generateBcgMatrixPPTX: async function(filename, data) {
    var secs = []; for (var i = 1; i <= 5; i++) { var n = data['product' + i + 'Name']; if (n && n.trim()) secs.push({ heading: n, content: 'Revenue: ' + (data['product' + i + 'Revenue'] || 'N/A') + '\nGrowth: ' + (data['product' + i + 'Growth'] || 'N/A') + '%\nMarket Share: ' + (data['product' + i + 'MarketShare'] || 'N/A') + '%' }); }
    return this._generateSectionsPPTX(filename, { title: 'BCG Growth-Share Matrix', entityName: data.companyName || 'Company', perSlide: 2, sections: secs });
  },
  generateMarketEntryPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Market Entry Strategy', entityName: data.companyName || 'Company', sections: [
      { heading: 'Target Market', content: data.targetMarket }, { heading: 'Entry Mode', content: data.entryMode },
      { heading: 'Market Size', content: data.marketSize }, { heading: 'Competitive Landscape', content: data.competitiveLandscape },
      { heading: 'Regulatory Environment', content: data.regulatoryEnv }, { heading: 'Risks', content: data.risks },
      { heading: 'Timeline', content: data.timeline }
    ]});
  },
  generateMcKinsey7SPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'McKinsey 7-S Framework', entityName: data.orgName || 'Organization', sections: [
      { heading: 'Strategy', content: data.strategy }, { heading: 'Structure', content: data.structure },
      { heading: 'Systems', content: data.systems }, { heading: 'Shared Values', content: data.sharedValues },
      { heading: 'Style', content: data.style }, { heading: 'Staff', content: data.staff },
      { heading: 'Skills', content: data.skills }
    ]});
  },
  generateChangeReadinessPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'ADKAR Change Readiness Assessment', entityName: data.changeInitiative || 'Change Initiative', subtitle: data.orgName || '', sections: [
      { heading: 'Awareness (Rating: ' + (data.awarenessRating || 'N/A') + '/5)', content: 'Understanding of why change is needed' },
      { heading: 'Desire (Rating: ' + (data.desireRating || 'N/A') + '/5)', content: 'Willingness to support and participate' },
      { heading: 'Knowledge (Rating: ' + (data.knowledgeRating || 'N/A') + '/5)', content: 'Information on how to change' },
      { heading: 'Ability (Rating: ' + (data.abilityRating || 'N/A') + '/5)', content: 'Capability to implement required skills' },
      { heading: 'Reinforcement (Rating: ' + (data.reinforcementRating || 'N/A') + '/5)', content: 'Sustaining the change long-term' },
      { heading: 'Key Actions', content: data.keyActions }
    ]});
  },
  generateDueDiligenceChecklistPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Due Diligence Checklist', entityName: data.companyName || 'Company', subtitle: 'Deal Type: ' + (data.dealType || 'N/A'), sections: [
      { heading: 'Financial Items', content: data.financialItems }, { heading: 'Legal Items', content: data.legalItems },
      { heading: 'Operational Items', content: data.operationalItems }, { heading: 'Commercial Items', content: data.commercialItems },
      { heading: 'HR & People Items', content: data.hrItems }, { heading: 'Red Flags / Concerns', content: data.redFlags }
    ]});
  },
  generateProblemDefinitionPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Problem Definition Worksheet', entityName: data.problemTitle || 'Problem', subtitle: 'Client: ' + (data.clientName || 'N/A'), sections: [
      { heading: 'Context', content: data.context }, { heading: 'Scope & Boundaries', content: data.scope },
      { heading: 'Initial Hypotheses', content: data.initialHypotheses }
    ]});
  },
  generateValueChainAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Value Chain Analysis', entityName: data.companyName || 'Company', perSlide: 2, sections: [
      { heading: 'Inbound Logistics', content: data.inboundLogistics }, { heading: 'Operations', content: data.operations },
      { heading: 'Outbound Logistics', content: data.outboundLogistics }, { heading: 'Marketing & Sales', content: data.marketingSales },
      { heading: 'Service', content: data.service }, { heading: 'Firm Infrastructure (Support)', content: data.firmInfrastructure },
      { heading: 'Human Resources (Support)', content: data.humanResources }, { heading: 'Technology Development (Support)', content: data.technologyDev },
      { heading: 'Procurement (Support)', content: data.procurement }, { heading: 'Competitive Advantage Sources', content: data.competitiveAdvantage }
    ]});
  },
  generateBlueOceanStrategyPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Blue Ocean Strategy Canvas', entityName: data.companyName || 'Company', subtitle: 'Industry: ' + (data.industryName || 'N/A'), perSlide: 2, sections: [
      { heading: 'Eliminate', content: data.eliminate }, { heading: 'Reduce', content: data.reduce },
      { heading: 'Raise', content: data.raise }, { heading: 'Create', content: data.create },
      { heading: 'New Value Curve', content: data.newValueCurve }
    ]});
  },
  generateJobsToBeDonePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Jobs-to-be-Done Analysis', entityName: data.productName || 'Product', subtitle: 'Target Customer: ' + (data.targetCustomer || 'N/A'), sections: [
      { heading: 'Functional Job', content: data.functionalJob }, { heading: 'Emotional Job', content: data.emotionalJob },
      { heading: 'Social Job', content: data.socialJob }, { heading: 'Current Solutions', content: data.currentSolutions },
      { heading: 'Pain Points', content: data.pains }, { heading: 'Desired Outcomes', content: data.desiredOutcomes },
      { heading: 'Innovation Opportunities', content: data.innovationOpp }
    ]});
  },
  generateStakeholderMapPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Stakeholder Map', entityName: data.projectName || 'Project', subtitle: 'Analyst: ' + (data.analystName || 'N/A'), perSlide: 2, sections: [
      { heading: 'Manage Closely (High Power, High Interest)', content: (data.manageClosely || 'Not specified') + '\nStrategy: ' + (data.manageCloselyStrategy || 'Not specified') },
      { heading: 'Keep Satisfied (High Power, Low Interest)', content: (data.keepSatisfied || 'Not specified') + '\nStrategy: ' + (data.keepSatisfiedStrategy || 'Not specified') },
      { heading: 'Keep Informed (Low Power, High Interest)', content: (data.keepInformed || 'Not specified') + '\nStrategy: ' + (data.keepInformedStrategy || 'Not specified') },
      { heading: 'Monitor (Low Power, Low Interest)', content: (data.monitor || 'Not specified') + '\nStrategy: ' + (data.monitorStrategy || 'Not specified') }
    ]});
  },
  generateCaseInterviewFrameworkPPTX: async function(filename, data) {
    var secs = [{ heading: 'Client Situation', content: data.clientSituation }, { heading: 'Key Question', content: data.keyQuestion }];
    for (var i = 1; i <= 4; i++) { var b = data['frameworkBranch' + i]; if (b && b.trim()) secs.push({ heading: 'Framework Branch ' + i, content: b }); }
    secs.push({ heading: 'Hypothesis', content: data.hypothesis }); secs.push({ heading: 'Recommendation', content: data.recommendation });
    return this._generateSectionsPPTX(filename, { title: 'Case Interview Framework', entityName: data.caseTitle || 'Case', subtitle: 'Type: ' + (data.caseType || 'N/A'), sections: secs });
  },

});
