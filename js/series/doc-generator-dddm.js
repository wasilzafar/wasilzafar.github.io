/**
 * Doc Generator - Data-Driven Decision Making Series
 * Extends DocGenerator with data-driven decision making series document generators.
 * Requires: doc-generator-core.js loaded first.
 */
Object.assign(DocGenerator, {
  // ============================================================
  // DDDM — KPI Definition Worksheet
  // ============================================================
  generateKpiWorksheetWord: async function(filename, data) {
    var sections = [
      { heading: 'KPI Definition Worksheet', content: ['Department: ' + (data.department || 'N/A'), 'Owner: ' + (data.ownerName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }
    ];
    for (var i = 1; i <= 4; i++) {
      var name = data['kpi' + i + 'Name'];
      if (name && name.trim()) {
        sections.push({ heading: 'KPI: ' + name, content: 'Definition: ' + (data['kpi' + i + 'Definition'] || 'N/A') + '\nTarget: ' + (data['kpi' + i + 'Target'] || 'N/A') + '\nData Source: ' + (data['kpi' + i + 'Source'] || 'N/A') + '\nFrequency: ' + (data['kpi' + i + 'Frequency'] || 'N/A') });
      }
    }
    if (data.notes) sections.push({ heading: 'Notes', content: data.notes });
    return this.generateWord(filename, { title: 'KPI Definition Worksheet', author: data.authorName || '', sections: sections });
  },
  generateKpiWorksheetExcel: function(filename, data) {
    var rows = [['Department', data.department || ''], ['Owner', data.ownerName || ''], ['Date', new Date().toLocaleDateString()], ['', '']];
    for (var i = 1; i <= 4; i++) {
      var name = data['kpi' + i + 'Name'];
      if (name && name.trim()) {
        rows.push([name, 'Def: ' + (data['kpi' + i + 'Definition'] || '') + ' | Target: ' + (data['kpi' + i + 'Target'] || '') + ' | Source: ' + (data['kpi' + i + 'Source'] || '') + ' | Freq: ' + (data['kpi' + i + 'Frequency'] || '')]);
      }
    }
    if (data.notes) { rows.push(['', '']); rows.push(['Notes', data.notes]); }
    return this.generateExcel(filename, { sheetName: 'KPI Worksheet', headers: ['KPI Name', 'Definition / Target / Source / Frequency'], data: rows });
  },
  generateKpiWorksheetPDF: function(filename, data) {
    var lines = [{ text: 'KPI DEFINITION WORKSHEET', size: 18, bold: true }, { text: 'Department: ' + (data.department || 'N/A') + '  |  Owner: ' + (data.ownerName || 'N/A'), size: 11 }, { text: 'Date: ' + new Date().toLocaleDateString(), size: 11 }, { text: '', size: 6 }];
    for (var i = 1; i <= 4; i++) {
      var name = data['kpi' + i + 'Name'];
      if (name && name.trim()) {
        lines.push({ text: name, size: 13, bold: true });
        lines.push({ text: 'Definition: ' + (data['kpi' + i + 'Definition'] || 'N/A'), size: 11 });
        lines.push({ text: 'Target: ' + (data['kpi' + i + 'Target'] || 'N/A') + '  |  Source: ' + (data['kpi' + i + 'Source'] || 'N/A') + '  |  Frequency: ' + (data['kpi' + i + 'Frequency'] || 'N/A'), size: 11 });
        lines.push({ text: '', size: 6 });
      }
    }
    if (data.notes) { lines.push({ text: 'Notes', size: 13, bold: true }); lines.push({ text: data.notes, size: 11 }); }
    return this.generatePDF(filename, { title: 'KPI Definition Worksheet', lines: lines });
  },

  // ============================================================
  // DDDM — Balanced Scorecard Generator
  // ============================================================
  generateBalancedScorecardWord: async function(filename, data) {
    var perspectives = [
      { key: 'financial', label: 'Financial Perspective' },
      { key: 'customer', label: 'Customer Perspective' },
      { key: 'internal', label: 'Internal Process Perspective' },
      { key: 'learning', label: 'Learning & Growth Perspective' }
    ];
    var sections = [{ heading: 'Balanced Scorecard', content: ['Organization: ' + (data.orgName || 'N/A'), 'Period: ' + (data.period || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    perspectives.forEach(function(p) {
      sections.push({ heading: p.label, content: 'Objective: ' + (data[p.key + 'Objective'] || 'N/A') + '\nMeasure: ' + (data[p.key + 'Measure'] || 'N/A') + '\nTarget: ' + (data[p.key + 'Target'] || 'N/A') + '\nInitiative: ' + (data[p.key + 'Initiative'] || 'N/A') });
    });
    if (data.strategicTheme) sections.push({ heading: 'Strategic Theme', content: data.strategicTheme });
    return this.generateWord(filename, { title: 'Balanced Scorecard', author: data.authorName || '', sections: sections });
  },
  generateBalancedScorecardExcel: function(filename, data) {
    var rows = [['Organization', data.orgName || ''], ['Period', data.period || ''], ['Date', new Date().toLocaleDateString()], ['', '', '', '', '']];
    var perspectives = ['Financial', 'Customer', 'Internal Process', 'Learning & Growth'];
    var keys = ['financial', 'customer', 'internal', 'learning'];
    perspectives.forEach(function(p, i) {
      rows.push([p, data[keys[i] + 'Objective'] || '', data[keys[i] + 'Measure'] || '', data[keys[i] + 'Target'] || '', data[keys[i] + 'Initiative'] || '']);
    });
    if (data.strategicTheme) { rows.push(['', '', '', '', '']); rows.push(['Strategic Theme', data.strategicTheme, '', '', '']); }
    return this.generateExcel(filename, { sheetName: 'Balanced Scorecard', headers: ['Perspective', 'Objective', 'Measure', 'Target', 'Initiative'], data: rows });
  },
  generateBalancedScorecardPDF: function(filename, data) {
    var perspectives = ['Financial', 'Customer', 'Internal Process', 'Learning & Growth'];
    var keys = ['financial', 'customer', 'internal', 'learning'];
    var sections = [{ heading: 'BALANCED SCORECARD', content: 'Organization: ' + (data.orgName || 'N/A') + '\nPeriod: ' + (data.period || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    perspectives.forEach(function(p, i) {
      sections.push({ heading: p + ' Perspective', content: 'Objective: ' + (data[keys[i] + 'Objective'] || 'N/A') + '\nMeasure: ' + (data[keys[i] + 'Measure'] || 'N/A') + '\nTarget: ' + (data[keys[i] + 'Target'] || 'N/A') + '\nInitiative: ' + (data[keys[i] + 'Initiative'] || 'N/A') });
    });
    if (data.strategicTheme) sections.push({ heading: 'Strategic Theme', content: data.strategicTheme });
    return this.generatePDF(filename, { title: 'Balanced Scorecard', sections: sections });
  },

  // ============================================================
  // DDDM — Decision Matrix Generator
  // ============================================================
  generateDecisionMatrixExcel: function(filename, data) {
    var rows = [['Decision', data.decisionName || ''], ['Owner', data.ownerName || ''], ['Date', new Date().toLocaleDateString()], ['', '', '', '']];
    for (var i = 1; i <= 5; i++) {
      var name = data['option' + i + 'Name'];
      if (name && name.trim()) {
        rows.push([name, data['option' + i + 'Pros'] || '', data['option' + i + 'Cons'] || '', data['option' + i + 'Score'] || '']);
      }
    }
    if (data.recommendation) { rows.push(['', '', '', '']); rows.push(['Recommendation', data.recommendation, '', '']); }
    return this.generateExcel(filename, { sheetName: 'Decision Matrix', headers: ['Option', 'Pros', 'Cons', 'Score (1-10)'], data: rows });
  },
  generateDecisionMatrixPDF: function(filename, data) {
    var lines = [{ text: 'DECISION MATRIX', size: 18, bold: true }, { text: 'Decision: ' + (data.decisionName || 'N/A') + '  |  Owner: ' + (data.ownerName || 'N/A'), size: 11 }, { text: '', size: 6 }];
    for (var i = 1; i <= 5; i++) {
      var name = data['option' + i + 'Name'];
      if (name && name.trim()) {
        lines.push({ text: name + ' (Score: ' + (data['option' + i + 'Score'] || 'N/A') + '/10)', size: 13, bold: true });
        lines.push({ text: 'Pros: ' + (data['option' + i + 'Pros'] || 'N/A'), size: 11 });
        lines.push({ text: 'Cons: ' + (data['option' + i + 'Cons'] || 'N/A'), size: 11 });
        lines.push({ text: '', size: 6 });
      }
    }
    if (data.recommendation) { lines.push({ text: 'Recommendation', size: 13, bold: true }); lines.push({ text: data.recommendation, size: 11 }); }
    return this.generatePDF(filename, { title: 'Decision Matrix', lines: lines });
  },

  // ============================================================
  // DDDM — RACI Matrix Generator
  // ============================================================
  generateRaciMatrixWord: async function(filename, data) {
    var sections = [{ heading: 'RACI Matrix', content: ['Project: ' + (data.projectName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    for (var i = 1; i <= 5; i++) {
      var task = data['task' + i + 'Name'];
      if (task && task.trim()) {
        sections.push({ heading: task, content: 'Responsible: ' + (data['task' + i + 'R'] || 'N/A') + '\nAccountable: ' + (data['task' + i + 'A'] || 'N/A') + '\nConsulted: ' + (data['task' + i + 'C'] || 'N/A') + '\nInformed: ' + (data['task' + i + 'I'] || 'N/A') });
      }
    }
    return this.generateWord(filename, { title: 'RACI Matrix', author: data.authorName || '', sections: sections });
  },
  generateRaciMatrixExcel: function(filename, data) {
    var rows = [['Project', data.projectName || ''], ['Date', new Date().toLocaleDateString()], ['', '', '', '', '']];
    for (var i = 1; i <= 5; i++) {
      var task = data['task' + i + 'Name'];
      if (task && task.trim()) {
        rows.push([task, data['task' + i + 'R'] || '', data['task' + i + 'A'] || '', data['task' + i + 'C'] || '', data['task' + i + 'I'] || '']);
      }
    }
    return this.generateExcel(filename, { sheetName: 'RACI Matrix', headers: ['Task / Activity', 'Responsible', 'Accountable', 'Consulted', 'Informed'], data: rows });
  },
  generateRaciMatrixPDF: function(filename, data) {
    var lines = [{ text: 'RACI MATRIX', size: 18, bold: true }, { text: 'Project: ' + (data.projectName || 'N/A') + '  |  Date: ' + new Date().toLocaleDateString(), size: 11 }, { text: '', size: 6 }];
    for (var i = 1; i <= 5; i++) {
      var task = data['task' + i + 'Name'];
      if (task && task.trim()) {
        lines.push({ text: task, size: 13, bold: true });
        lines.push({ text: 'R: ' + (data['task' + i + 'R'] || 'N/A') + '  |  A: ' + (data['task' + i + 'A'] || 'N/A') + '  |  C: ' + (data['task' + i + 'C'] || 'N/A') + '  |  I: ' + (data['task' + i + 'I'] || 'N/A'), size: 11 });
        lines.push({ text: '', size: 6 });
      }
    }
    return this.generatePDF(filename, { title: 'RACI Matrix', lines: lines });
  },

  // ============================================================
  // DDDM — A/B Test Planner
  // ============================================================
  generateAbTestPlannerWord: async function(filename, data) {
    var sections = [
      { heading: 'A/B Test Plan', content: ['Test Name: ' + (data.testName || 'N/A'), 'Owner: ' + (data.ownerName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Hypothesis', content: data.hypothesis || 'Not specified' },
      { heading: 'Primary Metric', content: data.primaryMetric || 'Not specified' },
      { heading: 'Secondary Metrics', content: data.secondaryMetrics || 'Not specified' },
      { heading: 'Control (A)', content: data.controlDescription || 'Not specified' },
      { heading: 'Variant (B)', content: data.variantDescription || 'Not specified' },
      { heading: 'Target Audience', content: data.targetAudience || 'Not specified' },
      { heading: 'Sample Size & Duration', content: 'Sample Size: ' + (data.sampleSize || 'N/A') + '\nDuration: ' + (data.duration || 'N/A') },
      { heading: 'Success Criteria', content: data.successCriteria || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'A/B Test Plan', author: data.authorName || '', sections: sections });
  },
  generateAbTestPlannerExcel: function(filename, data) {
    var rows = [
      ['Test Name', data.testName || ''], ['Owner', data.ownerName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Hypothesis', data.hypothesis || ''], ['Primary Metric', data.primaryMetric || ''],
      ['Secondary Metrics', data.secondaryMetrics || ''], ['Control (A)', data.controlDescription || ''],
      ['Variant (B)', data.variantDescription || ''], ['Target Audience', data.targetAudience || ''],
      ['Sample Size', data.sampleSize || ''], ['Duration', data.duration || ''],
      ['Success Criteria', data.successCriteria || '']
    ];
    return this.generateExcel(filename, { sheetName: 'AB Test Plan', headers: ['Element', 'Details'], data: rows });
  },
  generateAbTestPlannerPDF: function(filename, data) {
    var sections = [
      { heading: 'A/B TEST PLAN', content: 'Test Name: ' + (data.testName || 'N/A') + '\nOwner: ' + (data.ownerName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Hypothesis', content: data.hypothesis || 'Not specified' },
      { heading: 'Primary Metric', content: data.primaryMetric || 'Not specified' },
      { heading: 'Secondary Metrics', content: data.secondaryMetrics || 'Not specified' },
      { heading: 'Control (A)', content: data.controlDescription || 'Not specified' },
      { heading: 'Variant (B)', content: data.variantDescription || 'Not specified' },
      { heading: 'Target Audience', content: data.targetAudience || 'Not specified' },
      { heading: 'Sample Size & Duration', content: 'Sample Size: ' + (data.sampleSize || 'N/A') + '\nDuration: ' + (data.duration || 'N/A') },
      { heading: 'Success Criteria', content: data.successCriteria || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'A/B Test Plan', sections: sections });
  },

  // ============================================================
  // DDDM — Sample Size Calculator
  // ============================================================
  generateSampleSizeExcel: function(filename, data) {
    var rows = [
      ['Calculator', 'Sample Size Calculator'], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Baseline Conversion Rate (%)', data.baselineRate || ''],
      ['Minimum Detectable Effect (%)', data.mde || ''],
      ['Statistical Significance (%)', data.significance || '95'],
      ['Statistical Power (%)', data.power || '80'],
      ['Tails', data.tails || 'Two-tailed'],
      ['', ''], ['Notes', data.notes || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Sample Size', headers: ['Parameter', 'Value'], data: rows });
  },
  generateSampleSizePDF: function(filename, data) {
    var sections = [
      { heading: 'SAMPLE SIZE CALCULATOR', content: 'Date: ' + new Date().toLocaleDateString() },
      { heading: 'Parameters', content: 'Baseline Conversion Rate: ' + (data.baselineRate || 'N/A') + '%\nMinimum Detectable Effect: ' + (data.mde || 'N/A') + '%\nStatistical Significance: ' + (data.significance || '95') + '%\nStatistical Power: ' + (data.power || '80') + '%\nTails: ' + (data.tails || 'Two-tailed') },
      { heading: 'Notes', content: data.notes || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Sample Size Calculator', sections: sections });
  },

  // ============================================================
  // DDDM — Data Quality Assessment
  // ============================================================
  generateDataQualityWord: async function(filename, data) {
    var dimensions = [
      { key: 'accuracy', label: 'Accuracy' }, { key: 'completeness', label: 'Completeness' },
      { key: 'consistency', label: 'Consistency' }, { key: 'timeliness', label: 'Timeliness' },
      { key: 'uniqueness', label: 'Uniqueness' }, { key: 'validity', label: 'Validity' }
    ];
    var sections = [{ heading: 'Data Quality Assessment', content: ['Dataset: ' + (data.datasetName || 'N/A'), 'Assessor: ' + (data.assessorName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    dimensions.forEach(function(d) { sections.push({ heading: d.label, content: (data[d.key] || 'Not specified') + '\nRating: ' + (data[d.key + 'Rating'] || 'N/A') + '/5' }); });
    if (data.remediationPlan) sections.push({ heading: 'Remediation Plan', content: data.remediationPlan });
    return this.generateWord(filename, { title: 'Data Quality Assessment', author: data.authorName || '', sections: sections });
  },
  generateDataQualityExcel: function(filename, data) {
    var rows = [
      ['Dataset', data.datasetName || ''], ['Assessor', data.assessorName || ''], ['Date', new Date().toLocaleDateString()], ['', '', ''],
      ['Accuracy', data.accuracy || '', data.accuracyRating || ''],
      ['Completeness', data.completeness || '', data.completenessRating || ''],
      ['Consistency', data.consistency || '', data.consistencyRating || ''],
      ['Timeliness', data.timeliness || '', data.timelinessRating || ''],
      ['Uniqueness', data.uniqueness || '', data.uniquenessRating || ''],
      ['Validity', data.validity || '', data.validityRating || ''],
      ['', '', ''], ['Remediation Plan', data.remediationPlan || '', '']
    ];
    return this.generateExcel(filename, { sheetName: 'Data Quality', headers: ['Dimension', 'Assessment', 'Rating (1-5)'], data: rows });
  },
  generateDataQualityPDF: function(filename, data) {
    var dims = ['Accuracy', 'Completeness', 'Consistency', 'Timeliness', 'Uniqueness', 'Validity'];
    var keys = ['accuracy', 'completeness', 'consistency', 'timeliness', 'uniqueness', 'validity'];
    var sections = [{ heading: 'DATA QUALITY ASSESSMENT', content: 'Dataset: ' + (data.datasetName || 'N/A') + '\nAssessor: ' + (data.assessorName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    dims.forEach(function(d, i) { sections.push({ heading: d + ' (Rating: ' + (data[keys[i] + 'Rating'] || 'N/A') + '/5)', content: data[keys[i]] || 'Not specified' }); });
    if (data.remediationPlan) sections.push({ heading: 'Remediation Plan', content: data.remediationPlan });
    return this.generatePDF(filename, { title: 'Data Quality Assessment', sections: sections });
  },

  // ============================================================
  // DDDM — Dashboard Requirements Document
  // ============================================================
  generateDashboardRequirementsWord: async function(filename, data) {
    var sections = [
      { heading: 'Dashboard Requirements Document', content: ['Dashboard Name: ' + (data.dashboardName || 'N/A'), 'Owner: ' + (data.ownerName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Purpose & Audience', content: data.purposeAudience || 'Not specified' },
      { heading: 'Key Metrics & KPIs', content: data.keyMetrics || 'Not specified' },
      { heading: 'Data Sources', content: data.dataSources || 'Not specified' },
      { heading: 'Visualizations Required', content: data.visualizations || 'Not specified' },
      { heading: 'Filters & Interactivity', content: data.filtersInteractivity || 'Not specified' },
      { heading: 'Refresh Frequency', content: data.refreshFrequency || 'Not specified' },
      { heading: 'Access & Permissions', content: data.accessPermissions || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Dashboard Requirements Document', author: data.authorName || '', sections: sections });
  },
  generateDashboardRequirementsPDF: function(filename, data) {
    var sections = [
      { heading: 'DASHBOARD REQUIREMENTS DOCUMENT', content: 'Dashboard Name: ' + (data.dashboardName || 'N/A') + '\nOwner: ' + (data.ownerName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Purpose & Audience', content: data.purposeAudience || 'Not specified' },
      { heading: 'Key Metrics & KPIs', content: data.keyMetrics || 'Not specified' },
      { heading: 'Data Sources', content: data.dataSources || 'Not specified' },
      { heading: 'Visualizations Required', content: data.visualizations || 'Not specified' },
      { heading: 'Filters & Interactivity', content: data.filtersInteractivity || 'Not specified' },
      { heading: 'Refresh Frequency', content: data.refreshFrequency || 'Not specified' },
      { heading: 'Access & Permissions', content: data.accessPermissions || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Dashboard Requirements Document', sections: sections });
  },

  // ============================================================
  // DDDM — Data Maturity Assessment
  // ============================================================
  generateDataMaturityWord: async function(filename, data) {
    var pillars = [
      { key: 'dataGovernance', label: 'Data Governance' },
      { key: 'dataQuality', label: 'Data Quality' },
      { key: 'analytics', label: 'Analytics Capability' },
      { key: 'dataCulture', label: 'Data Culture' },
      { key: 'technology', label: 'Technology & Tools' }
    ];
    var sections = [{ heading: 'Data Maturity Assessment', content: ['Organization: ' + (data.orgName || 'N/A'), 'Assessor: ' + (data.assessorName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    pillars.forEach(function(p) { sections.push({ heading: p.label, content: (data[p.key] || 'Not specified') + '\nMaturity Level: ' + (data[p.key + 'Level'] || 'N/A') + '/5' }); });
    if (data.roadmap) sections.push({ heading: 'Improvement Roadmap', content: data.roadmap });
    return this.generateWord(filename, { title: 'Data Maturity Assessment', author: data.authorName || '', sections: sections });
  },
  generateDataMaturityExcel: function(filename, data) {
    var rows = [
      ['Organization', data.orgName || ''], ['Assessor', data.assessorName || ''], ['Date', new Date().toLocaleDateString()], ['', '', ''],
      ['Data Governance', data.dataGovernance || '', data.dataGovernanceLevel || ''],
      ['Data Quality', data.dataQuality || '', data.dataQualityLevel || ''],
      ['Analytics Capability', data.analytics || '', data.analyticsLevel || ''],
      ['Data Culture', data.dataCulture || '', data.dataCultureLevel || ''],
      ['Technology & Tools', data.technology || '', data.technologyLevel || ''],
      ['', '', ''], ['Improvement Roadmap', data.roadmap || '', '']
    ];
    return this.generateExcel(filename, { sheetName: 'Data Maturity', headers: ['Pillar', 'Assessment', 'Level (1-5)'], data: rows });
  },
  generateDataMaturityPDF: function(filename, data) {
    var pillars = ['Data Governance', 'Data Quality', 'Analytics Capability', 'Data Culture', 'Technology & Tools'];
    var keys = ['dataGovernance', 'dataQuality', 'analytics', 'dataCulture', 'technology'];
    var sections = [{ heading: 'DATA MATURITY ASSESSMENT', content: 'Organization: ' + (data.orgName || 'N/A') + '\nAssessor: ' + (data.assessorName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    pillars.forEach(function(p, i) { sections.push({ heading: p + ' (Level: ' + (data[keys[i] + 'Level'] || 'N/A') + '/5)', content: data[keys[i]] || 'Not specified' }); });
    if (data.roadmap) sections.push({ heading: 'Improvement Roadmap', content: data.roadmap });
    return this.generatePDF(filename, { title: 'Data Maturity Assessment', sections: sections });
  },

  // ============================================================
  // DDDM — Data Story Outline
  // ============================================================
  generateDataStoryWord: async function(filename, data) {
    var sections = [
      { heading: 'Data Story Outline', content: ['Story Title: ' + (data.storyTitle || 'N/A'), 'Author: ' + (data.authorName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Audience', content: data.audience || 'Not specified' },
      { heading: 'Key Message / "So What?"', content: data.keyMessage || 'Not specified' },
      { heading: 'Context / Setup', content: data.context || 'Not specified' },
      { heading: 'Key Data Points', content: data.dataPoints || 'Not specified' },
      { heading: 'Visualization Plan', content: data.visualizationPlan || 'Not specified' },
      { heading: 'Call to Action', content: data.callToAction || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Data Story Outline', author: data.authorName || '', sections: sections });
  },
  generateDataStoryPDF: function(filename, data) {
    var sections = [
      { heading: 'DATA STORY OUTLINE', content: 'Story Title: ' + (data.storyTitle || 'N/A') + '\nAuthor: ' + (data.authorName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Audience', content: data.audience || 'Not specified' },
      { heading: 'Key Message / "So What?"', content: data.keyMessage || 'Not specified' },
      { heading: 'Context / Setup', content: data.context || 'Not specified' },
      { heading: 'Key Data Points', content: data.dataPoints || 'Not specified' },
      { heading: 'Visualization Plan', content: data.visualizationPlan || 'Not specified' },
      { heading: 'Call to Action', content: data.callToAction || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Data Story Outline', sections: sections });
  },


  // ============================================================
  // PPTX — DDDM (9 generators)
  // ============================================================
  generateKpiWorksheetPPTX: async function(filename, data) {
    var secs = []; for (var i = 1; i <= 4; i++) { var n = data['kpi' + i + 'Name']; if (n && n.trim()) secs.push({ heading: n, content: 'Definition: ' + (data['kpi' + i + 'Definition'] || 'N/A') + '\nTarget: ' + (data['kpi' + i + 'Target'] || 'N/A') + '\nSource: ' + (data['kpi' + i + 'Source'] || 'N/A') + '\nFrequency: ' + (data['kpi' + i + 'Frequency'] || 'N/A') }); }
    if (data.notes) secs.push({ heading: 'Notes', content: data.notes });
    return this._generateSectionsPPTX(filename, { title: 'KPI Definition Worksheet', entityName: data.department || 'Department', subtitle: 'Owner: ' + (data.ownerName || 'N/A'), perSlide: 2, sections: secs });
  },
  generateBalancedScorecardPPTX: async function(filename, data) {
    var ps = [{ k: 'financial', l: 'Financial' }, { k: 'customer', l: 'Customer' }, { k: 'internal', l: 'Internal Process' }, { k: 'learning', l: 'Learning & Growth' }];
    var secs = []; ps.forEach(function(p) { secs.push({ heading: p.l + ' Perspective', content: 'Objective: ' + (data[p.k + 'Objective'] || 'N/A') + '\nMeasure: ' + (data[p.k + 'Measure'] || 'N/A') + '\nTarget: ' + (data[p.k + 'Target'] || 'N/A') + '\nInitiative: ' + (data[p.k + 'Initiative'] || 'N/A') }); });
    if (data.strategicTheme) secs.push({ heading: 'Strategic Theme', content: data.strategicTheme });
    return this._generateSectionsPPTX(filename, { title: 'Balanced Scorecard', entityName: data.orgName || 'Organization', subtitle: 'Period: ' + (data.period || 'N/A'), perSlide: 2, sections: secs });
  },
  generateDecisionMatrixPPTX: async function(filename, data) {
    var secs = []; for (var i = 1; i <= 5; i++) { var n = data['option' + i + 'Name']; if (n && n.trim()) secs.push({ heading: n + ' (Score: ' + (data['option' + i + 'Score'] || 'N/A') + '/10)', content: 'Pros: ' + (data['option' + i + 'Pros'] || 'N/A') + '\nCons: ' + (data['option' + i + 'Cons'] || 'N/A') }); }
    if (data.recommendation) secs.push({ heading: 'Recommendation', content: data.recommendation });
    return this._generateSectionsPPTX(filename, { title: 'Decision Matrix', entityName: data.decisionName || 'Decision', subtitle: 'Owner: ' + (data.ownerName || 'N/A'), perSlide: 2, sections: secs });
  },
  generateRaciMatrixPPTX: async function(filename, data) {
    var secs = []; for (var i = 1; i <= 5; i++) { var t = data['task' + i + 'Name']; if (t && t.trim()) secs.push({ heading: t, content: 'Responsible: ' + (data['task' + i + 'R'] || 'N/A') + '\nAccountable: ' + (data['task' + i + 'A'] || 'N/A') + '\nConsulted: ' + (data['task' + i + 'C'] || 'N/A') + '\nInformed: ' + (data['task' + i + 'I'] || 'N/A') }); }
    return this._generateSectionsPPTX(filename, { title: 'RACI Matrix', entityName: data.projectName || 'Project', perSlide: 2, sections: secs });
  },
  generateAbTestPlannerPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'A/B Test Plan', entityName: data.testName || 'Test', subtitle: 'Owner: ' + (data.ownerName || 'N/A'), sections: [
      { heading: 'Hypothesis', content: data.hypothesis }, { heading: 'Primary Metric', content: data.primaryMetric },
      { heading: 'Secondary Metrics', content: data.secondaryMetrics }, { heading: 'Control (A)', content: data.controlDescription },
      { heading: 'Variant (B)', content: data.variantDescription }, { heading: 'Target Audience', content: data.targetAudience },
      { heading: 'Sample Size & Duration', content: 'Size: ' + (data.sampleSize || 'N/A') + ' | Duration: ' + (data.duration || 'N/A') },
      { heading: 'Success Criteria', content: data.successCriteria }
    ]});
  },
  generateDataQualityPPTX: async function(filename, data) {
    var dims = ['Accuracy', 'Completeness', 'Consistency', 'Timeliness', 'Uniqueness', 'Validity'];
    var keys = ['accuracy', 'completeness', 'consistency', 'timeliness', 'uniqueness', 'validity'];
    var secs = []; dims.forEach(function(d, i) { secs.push({ heading: d + ' (Rating: ' + (data[keys[i] + 'Rating'] || 'N/A') + '/5)', content: data[keys[i]] || 'Not specified' }); });
    if (data.remediationPlan) secs.push({ heading: 'Remediation Plan', content: data.remediationPlan });
    return this._generateSectionsPPTX(filename, { title: 'Data Quality Assessment', entityName: data.datasetName || 'Dataset', subtitle: 'Assessor: ' + (data.assessorName || 'N/A'), perSlide: 2, sections: secs });
  },
  generateDashboardRequirementsPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Dashboard Requirements', entityName: data.dashboardName || 'Dashboard', subtitle: 'Owner: ' + (data.ownerName || 'N/A'), sections: [
      { heading: 'Purpose & Audience', content: data.purposeAudience }, { heading: 'Key Metrics & KPIs', content: data.keyMetrics },
      { heading: 'Data Sources', content: data.dataSources }, { heading: 'Visualizations Required', content: data.visualizations },
      { heading: 'Filters & Interactivity', content: data.filtersInteractivity }, { heading: 'Refresh Frequency', content: data.refreshFrequency },
      { heading: 'Access & Permissions', content: data.accessPermissions }
    ]});
  },
  generateDataMaturityPPTX: async function(filename, data) {
    var ps = ['Data Governance', 'Data Quality', 'Analytics Capability', 'Data Culture', 'Technology & Tools'];
    var ks = ['dataGovernance', 'dataQuality', 'analytics', 'dataCulture', 'technology'];
    var secs = []; ps.forEach(function(p, i) { secs.push({ heading: p + ' (Level: ' + (data[ks[i] + 'Level'] || 'N/A') + '/5)', content: data[ks[i]] || 'Not specified' }); });
    if (data.roadmap) secs.push({ heading: 'Improvement Roadmap', content: data.roadmap });
    return this._generateSectionsPPTX(filename, { title: 'Data Maturity Assessment', entityName: data.orgName || 'Organization', subtitle: 'Assessor: ' + (data.assessorName || 'N/A'), perSlide: 2, sections: secs });
  },
  generateDataStoryPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Data Story Outline', entityName: data.storyTitle || 'Data Story', subtitle: 'Author: ' + (data.authorName || 'N/A'), sections: [
      { heading: 'Audience', content: data.audience }, { heading: 'Key Message / "So What?"', content: data.keyMessage },
      { heading: 'Context / Setup', content: data.context }, { heading: 'Key Data Points', content: data.dataPoints },
      { heading: 'Visualization Plan', content: data.visualizationPlan }, { heading: 'Call to Action', content: data.callToAction }
    ]});
  },

});
