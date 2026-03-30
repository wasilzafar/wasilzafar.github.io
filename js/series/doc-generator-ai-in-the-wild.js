/**
 * Doc Generator – AI in the Wild Series
 * Extends DocGenerator with 8 AI / ML document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * DocTypes (8):
 *  1. AILandscapeAssessment  – AI Strategy Canvas
 *  2. MLProjectPlan          – Machine Learning Project Plan
 *  3. NLPPipelineSpec        – NLP Pipeline Specification
 *  4. ModelCard              – AI Model Documentation Card
 *  5. IndustryAIDeployment   – Industry AI Deployment Assessment
 *  6. AIEthicsAssessment     – AI Ethics Impact Assessment
 *  7. MLOpsPipeline          – MLOps Pipeline Design
 *  8. AIGovernanceFramework  – AI Governance Framework
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. AI LANDSCAPE ASSESSMENT (AI Strategy Canvas)
  // ============================================================

  generateAILandscapeAssessmentWord: async function(filename, data) {
    var sections = [
      { heading: 'AI Strategy Canvas', content: [
        'Organisation: ' + (data.orgName || 'N/A'),
        'Industry: ' + (data.industry || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Current AI State', content: (data.currentAIState || 'Not specified').split('\n') },
      { heading: '2. Target Capabilities', content: (data.targetCapabilities || 'Not specified').split('\n') },
      { heading: '3. Priority Use Cases', content: (data.priorityUseCases || 'Not specified').split('\n') },
      { heading: '4. Data Assets', content: (data.dataAssets || 'Not specified').split('\n') },
      { heading: '5. Constraints', content: (data.constraints || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'AI Strategy Canvas – ' + (data.orgName || ''), author: data.orgName || '', sections: sections });
  },

  generateAILandscapeAssessmentExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['AI STRATEGY CANVAS'],
      ['Organisation', data.orgName || ''],
      ['Industry', data.industry || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CURRENT AI STATE'],
      [data.currentAIState || ''],
      [],
      ['TARGET CAPABILITIES'],
      [data.targetCapabilities || ''],
      [],
      ['PRIORITY USE CASES'],
      [data.priorityUseCases || ''],
      [],
      ['DATA ASSETS'],
      [data.dataAssets || ''],
      [],
      ['CONSTRAINTS'],
      [data.constraints || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Use Case Breakdown sheet
    var ucRows = [['Use Case', 'Priority', 'Data Required', 'Feasibility', 'Expected Value']];
    (data.priorityUseCases || '').split('\n').forEach(function(uc) {
      if (uc.trim()) ucRows.push([uc.trim(), '', '', '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(ucRows);
    ws2['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 25 }, { wch: 14 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Use Case Breakdown');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAILandscapeAssessmentPDF: function(filename, data) {
    var lines = [
      { text: 'AI STRATEGY CANVAS', size: 18, bold: true },
      { text: (data.orgName || '') + '  |  ' + (data.industry || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CURRENT AI STATE ──', size: 14, bold: true },
      { text: data.currentAIState || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TARGET CAPABILITIES ──', size: 14, bold: true },
      { text: data.targetCapabilities || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PRIORITY USE CASES ──', size: 14, bold: true },
      { text: data.priorityUseCases || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DATA ASSETS ──', size: 14, bold: true },
      { text: data.dataAssets || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONSTRAINTS ──', size: 14, bold: true },
      { text: data.constraints || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI Strategy Canvas', lines: lines });
  },

  generateAILandscapeAssessmentPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.orgName || 'Organisation',
      title: 'AI Strategy Canvas',
      subtitle: (data.industry || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Current AI State', content: data.currentAIState || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Target Capabilities', content: data.targetCapabilities || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Priority Use Cases', content: data.priorityUseCases || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Data Assets', content: data.dataAssets || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Constraints', content: data.constraints || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 2. MACHINE LEARNING PROJECT PLAN
  // ============================================================

  generateMLProjectPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'Machine Learning Project Plan', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Problem Type: ' + (data.problemType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Problem Statement', content: (data.problemStatement || 'Not specified').split('\n') },
      { heading: '2. Success Metric', content: ['Metric: ' + (data.successMetric || 'N/A')] },
      { heading: '3. Data Description', content: (data.dataDescription || 'Not specified').split('\n') },
      { heading: '4. Baseline Approach', content: (data.baselineApproach || 'Not specified').split('\n') },
      { heading: '5. Model Candidates', content: (data.modelCandidates || 'Not specified').split('\n') },
      { heading: '6. Evaluation Strategy', content: (data.evaluationStrategy || 'Not specified').split('\n') },
      { heading: '7. Deployment Context', content: (data.deploymentContext || 'Not specified').split('\n') },
      { heading: '8. Team & Constraints', content: (data.teamConstraints || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'ML Project Plan – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateMLProjectPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['MACHINE LEARNING PROJECT PLAN'],
      ['Project', data.projectName || ''],
      ['Problem Type', data.problemType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PROBLEM STATEMENT'],
      [data.problemStatement || ''],
      [],
      ['SUCCESS METRIC'],
      [data.successMetric || ''],
      [],
      ['DATA DESCRIPTION'],
      [data.dataDescription || ''],
      [],
      ['BASELINE APPROACH'],
      [data.baselineApproach || ''],
      [],
      ['DEPLOYMENT CONTEXT'],
      [data.deploymentContext || ''],
      [],
      ['TEAM & CONSTRAINTS'],
      [data.teamConstraints || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 28 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Model Comparison sheet
    var modelRows = [['Model Candidate', 'Type', 'Pros', 'Cons', 'Evaluation Score']];
    (data.modelCandidates || '').split('\n').forEach(function(m) {
      if (m.trim()) modelRows.push([m.trim(), '', '', '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(modelRows);
    ws2['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 25 }, { wch: 25 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Model Comparison');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMLProjectPlanPDF: function(filename, data) {
    var lines = [
      { text: 'MACHINE LEARNING PROJECT PLAN', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.problemType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PROBLEM STATEMENT ──', size: 14, bold: true },
      { text: data.problemStatement || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SUCCESS METRIC ──', size: 14, bold: true },
      { text: data.successMetric || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DATA DESCRIPTION ──', size: 14, bold: true },
      { text: data.dataDescription || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BASELINE APPROACH ──', size: 14, bold: true },
      { text: data.baselineApproach || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MODEL CANDIDATES ──', size: 14, bold: true },
      { text: data.modelCandidates || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVALUATION STRATEGY ──', size: 14, bold: true },
      { text: data.evaluationStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEPLOYMENT CONTEXT ──', size: 14, bold: true },
      { text: data.deploymentContext || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TEAM & CONSTRAINTS ──', size: 14, bold: true },
      { text: data.teamConstraints || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Machine Learning Project Plan', lines: lines });
  },

  generateMLProjectPlanPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Machine Learning Project Plan',
      subtitle: 'Problem Type: ' + (data.problemType || 'N/A') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Problem Statement', content: data.problemStatement || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Success Metric', content: data.successMetric || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Data Description', content: data.dataDescription || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Baseline Approach', content: data.baselineApproach || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Model Candidates', content: data.modelCandidates || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Evaluation Strategy', content: data.evaluationStrategy || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Deployment Context', content: data.deploymentContext || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Team & Constraints', content: data.teamConstraints || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 3. NLP PIPELINE SPECIFICATION
  // ============================================================

  generateNLPPipelineSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'NLP Pipeline Specification', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Text Domain: ' + (data.textDomain || 'N/A'),
        'Primary Task: ' + (data.primaryTask || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Language Requirements', content: (data.languageRequirements || 'Not specified').split('\n') },
      { heading: '2. Input Volume & Latency', content: [
        'Input Volume: ' + (data.inputVolume || 'N/A'),
        'Latency Requirement: ' + (data.latencyRequirement || 'N/A')
      ]},
      { heading: '3. Model Choice', content: (data.modelChoice || 'Not specified').split('\n') },
      { heading: '4. Fine-Tuning Data', content: (data.fineTuningData || 'Not specified').split('\n') },
      { heading: '5. Output Format', content: (data.outputFormat || 'Not specified').split('\n') },
      { heading: '6. Quality Metrics', content: (data.qualityMetrics || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'NLP Pipeline Spec – ' + (data.systemName || ''), author: data.systemName || '', sections: sections });
  },

  generateNLPPipelineSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['NLP PIPELINE SPECIFICATION'],
      ['System', data.systemName || ''],
      ['Text Domain', data.textDomain || ''],
      ['Primary Task', data.primaryTask || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CONFIGURATION'],
      ['Parameter', 'Value'],
      ['Language Requirements', data.languageRequirements || ''],
      ['Input Volume', data.inputVolume || ''],
      ['Latency Requirement', data.latencyRequirement || ''],
      ['Model Choice', data.modelChoice || ''],
      ['Output Format', data.outputFormat || ''],
      [],
      ['FINE-TUNING DATA'],
      [data.fineTuningData || ''],
      [],
      ['QUALITY METRICS'],
      [data.qualityMetrics || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 28 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Pipeline Stages sheet
    var stageRows = [['Stage', 'Tool / Model', 'Input', 'Output', 'Latency Budget', 'Notes']];
    stageRows.push(['Preprocessing', '', 'Raw Text', 'Cleaned Text', '', '']);
    stageRows.push(['Tokenisation', '', 'Cleaned Text', 'Tokens', '', '']);
    stageRows.push(['Inference (' + (data.primaryTask || 'task') + ')', data.modelChoice || '', 'Tokens', data.outputFormat || '', '', '']);
    stageRows.push(['Post-processing', '', 'Model Output', 'Final Response', '', '']);
    var ws2 = XLSX.utils.aoa_to_sheet(stageRows);
    ws2['!cols'] = [{ wch: 25 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Pipeline Stages');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateNLPPipelineSpecPDF: function(filename, data) {
    var lines = [
      { text: 'NLP PIPELINE SPECIFICATION', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  Task: ' + (data.primaryTask || 'N/A'), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TEXT DOMAIN & LANGUAGES ──', size: 14, bold: true },
      { text: 'Domain: ' + (data.textDomain || 'N/A'), size: 10 },
      { text: 'Languages: ' + (data.languageRequirements || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── SCALE & LATENCY ──', size: 14, bold: true },
      { text: 'Input Volume: ' + (data.inputVolume || 'N/A'), size: 10 },
      { text: 'Latency Requirement: ' + (data.latencyRequirement || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── MODEL CHOICE ──', size: 14, bold: true },
      { text: data.modelChoice || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FINE-TUNING DATA ──', size: 14, bold: true },
      { text: data.fineTuningData || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OUTPUT FORMAT ──', size: 14, bold: true },
      { text: data.outputFormat || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── QUALITY METRICS ──', size: 14, bold: true },
      { text: data.qualityMetrics || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'NLP Pipeline Specification', lines: lines });
  },

  generateNLPPipelineSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'NLP Pipeline Specification',
      subtitle: 'Task: ' + (data.primaryTask || 'N/A') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Text Domain & Languages', content: 'Domain: ' + (data.textDomain || 'N/A') + '\nLanguages: ' + (data.languageRequirements || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Scale & Latency', content: 'Input Volume: ' + (data.inputVolume || 'N/A') + '\nLatency: ' + (data.latencyRequirement || 'N/A'), color: DocStyles.colors.blue },
        { heading: 'Model Choice', content: data.modelChoice || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Fine-Tuning Data', content: data.fineTuningData || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Output Format', content: data.outputFormat || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Quality Metrics', content: data.qualityMetrics || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },


  // ============================================================
  // 4. MODEL CARD (AI Model Documentation Card)
  // ============================================================

  generateModelCardWord: async function(filename, data) {
    var sections = [
      { heading: 'AI Model Documentation Card', content: [
        'Model: ' + (data.modelName || 'N/A') + '  v' + (data.modelVersion || 'N/A'),
        'Model Type: ' + (data.modelType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Intended Use', content: (data.intendedUse || 'Not specified').split('\n') },
      { heading: '2. Training Data', content: (data.trainingDataDescription || 'Not specified').split('\n') },
      { heading: '3. Performance Metrics', content: (data.performanceMetrics || 'Not specified').split('\n') },
      { heading: '4. Known Limitations', content: (data.knownLimitations || 'Not specified').split('\n') },
      { heading: '5. Ethics Considerations', content: (data.ethicsConsiderations || 'Not specified').split('\n') },
      { heading: '6. Maintenance Plan', content: (data.maintenancePlan || 'Not specified').split('\n') },
      { heading: '7. Contact & Ownership', content: ['Owner: ' + (data.contactOwner || 'N/A')] }
    ];
    return this.generateWord(filename, { title: 'Model Card – ' + (data.modelName || ''), author: data.contactOwner || '', sections: sections });
  },

  generateModelCardExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['AI MODEL DOCUMENTATION CARD'],
      ['Model Name', data.modelName || ''],
      ['Version', data.modelVersion || ''],
      ['Model Type', data.modelType || ''],
      ['Contact / Owner', data.contactOwner || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['INTENDED USE'],
      [data.intendedUse || ''],
      [],
      ['TRAINING DATA'],
      [data.trainingDataDescription || ''],
      [],
      ['PERFORMANCE METRICS'],
      [data.performanceMetrics || ''],
      [],
      ['KNOWN LIMITATIONS'],
      [data.knownLimitations || ''],
      [],
      ['ETHICS CONSIDERATIONS'],
      [data.ethicsConsiderations || ''],
      [],
      ['MAINTENANCE PLAN'],
      [data.maintenancePlan || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Metrics Detail sheet
    var metricsRows = [['Metric Name', 'Value', 'Dataset / Split', 'Notes']];
    (data.performanceMetrics || '').split('\n').forEach(function(m) {
      if (m.trim()) metricsRows.push([m.trim(), '', '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(metricsRows);
    ws2['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 22 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Performance Metrics');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateModelCardPDF: function(filename, data) {
    var lines = [
      { text: 'AI MODEL DOCUMENTATION CARD', size: 18, bold: true },
      { text: (data.modelName || '') + '  v' + (data.modelVersion || 'N/A') + '  |  ' + (data.modelType || ''), size: 12 },
      { text: 'Owner: ' + (data.contactOwner || 'N/A') + '  |  Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── INTENDED USE ──', size: 14, bold: true },
      { text: data.intendedUse || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRAINING DATA ──', size: 14, bold: true },
      { text: data.trainingDataDescription || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERFORMANCE METRICS ──', size: 14, bold: true },
      { text: data.performanceMetrics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KNOWN LIMITATIONS ──', size: 14, bold: true },
      { text: data.knownLimitations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ETHICS CONSIDERATIONS ──', size: 14, bold: true },
      { text: data.ethicsConsiderations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MAINTENANCE PLAN ──', size: 14, bold: true },
      { text: data.maintenancePlan || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI Model Card', lines: lines });
  },

  generateModelCardPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: (data.modelName || 'Model') + ' v' + (data.modelVersion || 'N/A'),
      title: 'AI Model Documentation Card',
      subtitle: 'Type: ' + (data.modelType || 'N/A') + '  |  Owner: ' + (data.contactOwner || 'N/A'),
      perSlide: 2,
      sections: [
        { heading: 'Intended Use', content: data.intendedUse || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Training Data', content: data.trainingDataDescription || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Performance Metrics', content: data.performanceMetrics || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Known Limitations', content: data.knownLimitations || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Ethics Considerations', content: data.ethicsConsiderations || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Maintenance Plan', content: data.maintenancePlan || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },


  // ============================================================
  // 5. INDUSTRY AI DEPLOYMENT ASSESSMENT
  // ============================================================

  generateIndustryAIDeploymentWord: async function(filename, data) {
    var sections = [
      { heading: 'Industry AI Deployment Assessment', content: [
        'Organisation: ' + (data.orgName || 'N/A'),
        'Industry: ' + (data.industry || 'N/A'),
        'Use Case: ' + (data.useCase || 'N/A'),
        'Risk Level: ' + (data.riskLevel || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Data Types', content: (data.dataTypes || 'Not specified').split('\n') },
      { heading: '2. Regulatory Constraints', content: (data.regulatoryConstraints || 'Not specified').split('\n') },
      { heading: '3. Stakeholders', content: (data.stakeholders || 'Not specified').split('\n') },
      { heading: '4. Success Metrics', content: (data.successMetrics || 'Not specified').split('\n') },
      { heading: '5. Pilot Plan', content: (data.pilotPlan || 'Not specified').split('\n') },
      { heading: '6. Governance Owner', content: ['Owner: ' + (data.governanceOwner || 'N/A')] }
    ];
    return this.generateWord(filename, { title: 'AI Deployment – ' + (data.orgName || ''), author: data.governanceOwner || '', sections: sections });
  },

  generateIndustryAIDeploymentExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['INDUSTRY AI DEPLOYMENT ASSESSMENT'],
      ['Organisation', data.orgName || ''],
      ['Industry', data.industry || ''],
      ['Use Case', data.useCase || ''],
      ['Risk Level', data.riskLevel || ''],
      ['Governance Owner', data.governanceOwner || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['DATA TYPES'],
      [data.dataTypes || ''],
      [],
      ['REGULATORY CONSTRAINTS'],
      [data.regulatoryConstraints || ''],
      [],
      ['SUCCESS METRICS'],
      [data.successMetrics || ''],
      [],
      ['PILOT PLAN'],
      [data.pilotPlan || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 28 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Stakeholder Map sheet
    var stRows = [['Stakeholder / Team', 'Role', 'Impact', 'Engagement Required']];
    (data.stakeholders || '').split('\n').forEach(function(s) {
      if (s.trim()) stRows.push([s.trim(), '', '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(stRows);
    ws2['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 18 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Stakeholder Map');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateIndustryAIDeploymentPDF: function(filename, data) {
    var lines = [
      { text: 'INDUSTRY AI DEPLOYMENT ASSESSMENT', size: 18, bold: true },
      { text: (data.orgName || '') + '  |  ' + (data.industry || ''), size: 12 },
      { text: 'Use Case: ' + (data.useCase || 'N/A') + '  |  Risk: ' + (data.riskLevel || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DATA TYPES ──', size: 14, bold: true },
      { text: data.dataTypes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REGULATORY CONSTRAINTS ──', size: 14, bold: true },
      { text: data.regulatoryConstraints || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STAKEHOLDERS ──', size: 14, bold: true },
      { text: data.stakeholders || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SUCCESS METRICS ──', size: 14, bold: true },
      { text: data.successMetrics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PILOT PLAN ──', size: 14, bold: true },
      { text: data.pilotPlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GOVERNANCE ──', size: 14, bold: true },
      { text: 'Owner: ' + (data.governanceOwner || 'N/A'), size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Industry AI Deployment Assessment', lines: lines });
  },

  generateIndustryAIDeploymentPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.orgName || 'Organisation',
      title: 'Industry AI Deployment Assessment',
      subtitle: (data.industry || '') + '  |  Risk: ' + (data.riskLevel || 'N/A') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Use Case', content: data.useCase || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Data Types', content: data.dataTypes || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Regulatory Constraints', content: data.regulatoryConstraints || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Stakeholders', content: data.stakeholders || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Success Metrics', content: data.successMetrics || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Pilot Plan', content: data.pilotPlan || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Governance', content: 'Owner: ' + (data.governanceOwner || 'N/A'), color: DocStyles.colors.navy }
      ]
    });
  },


  // ============================================================
  // 6. AI ETHICS IMPACT ASSESSMENT
  // ============================================================

  generateAIEthicsAssessmentWord: async function(filename, data) {
    var sections = [
      { heading: 'AI Ethics Impact Assessment', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Purpose: ' + (data.purpose || 'N/A'),
        'Target Population: ' + (data.targetPopulation || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Potential Harms', content: (data.potentialHarms || 'Not specified').split('\n') },
      { heading: '2. Mitigation Measures', content: (data.mitigationMeasures || 'Not specified').split('\n') },
      { heading: '3. Fairness Metrics', content: (data.fairnessMetrics || 'Not specified').split('\n') },
      { heading: '4. Bias Audit Plan', content: (data.biasAuditPlan || 'Not specified').split('\n') },
      { heading: '5. Human Oversight Mechanism', content: (data.humanOversightMechanism || 'Not specified').split('\n') },
      { heading: '6. Redress Process', content: (data.redressProcess || 'Not specified').split('\n') },
      { heading: '7. Review Cycle', content: ['Cycle: ' + (data.reviewCycle || 'N/A')] }
    ];
    return this.generateWord(filename, { title: 'Ethics Assessment – ' + (data.systemName || ''), author: data.systemName || '', sections: sections });
  },

  generateAIEthicsAssessmentExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['AI ETHICS IMPACT ASSESSMENT'],
      ['System', data.systemName || ''],
      ['Purpose', data.purpose || ''],
      ['Target Population', data.targetPopulation || ''],
      ['Review Cycle', data.reviewCycle || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['POTENTIAL HARMS'],
      [data.potentialHarms || ''],
      [],
      ['MITIGATION MEASURES'],
      [data.mitigationMeasures || ''],
      [],
      ['FAIRNESS METRICS'],
      [data.fairnessMetrics || ''],
      [],
      ['BIAS AUDIT PLAN'],
      [data.biasAuditPlan || ''],
      [],
      ['HUMAN OVERSIGHT MECHANISM'],
      [data.humanOversightMechanism || ''],
      [],
      ['REDRESS PROCESS'],
      [data.redressProcess || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Risk Register sheet
    var riskRows = [['Harm / Risk', 'Affected Group', 'Likelihood', 'Severity', 'Mitigation', 'Status']];
    (data.potentialHarms || '').split('\n').forEach(function(h) {
      if (h.trim()) riskRows.push([h.trim(), '', '', '', '', 'Open']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(riskRows);
    ws2['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 28 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Ethics Risk Register');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAIEthicsAssessmentPDF: function(filename, data) {
    var lines = [
      { text: 'AI ETHICS IMPACT ASSESSMENT', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.purpose || ''), size: 12 },
      { text: 'Target Population: ' + (data.targetPopulation || 'N/A') + '  |  Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── POTENTIAL HARMS ──', size: 14, bold: true },
      { text: data.potentialHarms || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MITIGATION MEASURES ──', size: 14, bold: true },
      { text: data.mitigationMeasures || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FAIRNESS METRICS ──', size: 14, bold: true },
      { text: data.fairnessMetrics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BIAS AUDIT PLAN ──', size: 14, bold: true },
      { text: data.biasAuditPlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HUMAN OVERSIGHT ──', size: 14, bold: true },
      { text: data.humanOversightMechanism || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REDRESS PROCESS ──', size: 14, bold: true },
      { text: data.redressProcess || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REVIEW CYCLE ──', size: 14, bold: true },
      { text: data.reviewCycle || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI Ethics Impact Assessment', lines: lines });
  },

  generateAIEthicsAssessmentPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'AI Ethics Impact Assessment',
      subtitle: 'Population: ' + (data.targetPopulation || 'N/A') + '  |  Review: ' + (data.reviewCycle || 'N/A'),
      perSlide: 2,
      sections: [
        { heading: 'Purpose & Scope', content: 'Purpose: ' + (data.purpose || 'N/A') + '\nTarget Population: ' + (data.targetPopulation || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Potential Harms', content: data.potentialHarms || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Mitigation Measures', content: data.mitigationMeasures || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Fairness & Bias', content: 'Fairness Metrics: ' + (data.fairnessMetrics || 'N/A') + '\nBias Audit Plan: ' + (data.biasAuditPlan || 'N/A'), color: DocStyles.colors.teal },
        { heading: 'Human Oversight', content: data.humanOversightMechanism || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Redress & Review', content: 'Redress: ' + (data.redressProcess || 'N/A') + '\nReview Cycle: ' + (data.reviewCycle || 'N/A'), color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 7. MLOPS PIPELINE DESIGN
  // ============================================================

  generateMLOpsPipelineWord: async function(filename, data) {
    var sections = [
      { heading: 'MLOps Pipeline Design', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Model Type: ' + (data.modelType || 'N/A'),
        'Training Frequency: ' + (data.trainingFrequency || 'N/A'),
        'Infrastructure Target: ' + (data.infrastructureTarget || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Data Pipeline Tools', content: (data.dataPipelineTools || 'Not specified').split('\n') },
      { heading: '2. Monitoring Metrics', content: (data.monitoringMetrics || 'Not specified').split('\n') },
      { heading: '3. Alerting Thresholds', content: (data.alertingThresholds || 'Not specified').split('\n') },
      { heading: '4. Retrain Triggers', content: (data.retrainTriggers || 'Not specified').split('\n') },
      { heading: '5. Rollback Strategy', content: (data.rollbackStrategy || 'Not specified').split('\n') },
      { heading: '6. CI/CD Approach', content: (data.cicdApproach || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'MLOps Pipeline – ' + (data.systemName || ''), author: data.systemName || '', sections: sections });
  },

  generateMLOpsPipelineExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['MLOPS PIPELINE DESIGN'],
      ['System', data.systemName || ''],
      ['Model Type', data.modelType || ''],
      ['Training Frequency', data.trainingFrequency || ''],
      ['Infrastructure Target', data.infrastructureTarget || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['DATA PIPELINE TOOLS'],
      [data.dataPipelineTools || ''],
      [],
      ['CI/CD APPROACH'],
      [data.cicdApproach || ''],
      [],
      ['ROLLBACK STRATEGY'],
      [data.rollbackStrategy || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 28 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Monitoring & Alerts sheet
    var monRows = [['Metric', 'Threshold', 'Alert Level', 'Retrain Trigger', 'Owner']];
    (data.monitoringMetrics || '').split('\n').forEach(function(m) {
      if (m.trim()) monRows.push([m.trim(), '', 'Warning', '', '']);
    });
    (data.alertingThresholds || '').split('\n').forEach(function(a) {
      if (a.trim()) monRows.push(['', a.trim(), 'Critical', '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(monRows);
    ws2['!cols'] = [{ wch: 28 }, { wch: 22 }, { wch: 14 }, { wch: 20 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Monitoring & Alerts');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMLOpsPipelinePDF: function(filename, data) {
    var lines = [
      { text: 'MLOPS PIPELINE DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  Model: ' + (data.modelType || 'N/A'), size: 12 },
      { text: 'Training: ' + (data.trainingFrequency || 'N/A') + '  |  Infra: ' + (data.infrastructureTarget || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DATA PIPELINE TOOLS ──', size: 14, bold: true },
      { text: data.dataPipelineTools || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MONITORING METRICS ──', size: 14, bold: true },
      { text: data.monitoringMetrics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ALERTING THRESHOLDS ──', size: 14, bold: true },
      { text: data.alertingThresholds || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RETRAIN TRIGGERS ──', size: 14, bold: true },
      { text: data.retrainTriggers || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ROLLBACK STRATEGY ──', size: 14, bold: true },
      { text: data.rollbackStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CI/CD APPROACH ──', size: 14, bold: true },
      { text: data.cicdApproach || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'MLOps Pipeline Design', lines: lines });
  },

  generateMLOpsPipelinePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'MLOps Pipeline Design',
      subtitle: 'Model: ' + (data.modelType || 'N/A') + '  |  Training: ' + (data.trainingFrequency || 'N/A') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Data Pipeline Tools', content: data.dataPipelineTools || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Monitoring Metrics', content: data.monitoringMetrics || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Alerting Thresholds', content: data.alertingThresholds || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Retrain Triggers', content: data.retrainTriggers || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Rollback Strategy', content: data.rollbackStrategy || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'CI/CD & Infrastructure', content: 'CI/CD: ' + (data.cicdApproach || 'N/A') + '\nInfrastructure: ' + (data.infrastructureTarget || 'N/A'), color: DocStyles.colors.teal }
      ]
    });
  },


  // ============================================================
  // 8. AI GOVERNANCE FRAMEWORK
  // ============================================================

  generateAIGovernanceFrameworkWord: async function(filename, data) {
    var sections = [
      { heading: 'AI Governance Framework', content: [
        'Organisation: ' + (data.orgName || 'N/A'),
        'Risk Tier: ' + (data.riskTier || 'N/A'),
        'Governance Owner: ' + (data.governanceOwner || 'N/A'),
        'Review Cycle: ' + (data.reviewCycle || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Applicable Regulations', content: (data.applicableRegulations || 'Not specified').split('\n') },
      { heading: '2. Model Inventory Approach', content: (data.modelInventoryApproach || 'Not specified').split('\n') },
      { heading: '3. Incident Response Plan', content: (data.incidentResponsePlan || 'Not specified').split('\n') },
      { heading: '4. Compliance Evidence', content: (data.complianceEvidence || 'Not specified').split('\n') },
      { heading: '5. Training Requirements', content: (data.trainingRequirements || 'Not specified').split('\n') },
      { heading: '6. Reporting Obligations', content: (data.reportingObligations || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'AI Governance – ' + (data.orgName || ''), author: data.governanceOwner || '', sections: sections });
  },

  generateAIGovernanceFrameworkExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['AI GOVERNANCE FRAMEWORK'],
      ['Organisation', data.orgName || ''],
      ['Risk Tier', data.riskTier || ''],
      ['Governance Owner', data.governanceOwner || ''],
      ['Review Cycle', data.reviewCycle || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['APPLICABLE REGULATIONS'],
      [data.applicableRegulations || ''],
      [],
      ['MODEL INVENTORY APPROACH'],
      [data.modelInventoryApproach || ''],
      [],
      ['INCIDENT RESPONSE PLAN'],
      [data.incidentResponsePlan || ''],
      [],
      ['COMPLIANCE EVIDENCE'],
      [data.complianceEvidence || ''],
      [],
      ['TRAINING REQUIREMENTS'],
      [data.trainingRequirements || ''],
      [],
      ['REPORTING OBLIGATIONS'],
      [data.reportingObligations || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Governance Controls sheet
    var ctrlRows = [['Control Area', 'Requirement', 'Evidence Type', 'Owner', 'Review Frequency', 'Status']];
    ctrlRows.push(['Risk Assessment', data.riskTier || '', 'Risk Register', data.governanceOwner || '', data.reviewCycle || '', '']);
    ctrlRows.push(['Regulatory Compliance', data.applicableRegulations || '', 'Audit Report', '', data.reviewCycle || '', '']);
    ctrlRows.push(['Model Inventory', data.modelInventoryApproach || '', 'Model Registry', '', 'Continuous', '']);
    ctrlRows.push(['Incident Response', data.incidentResponsePlan || '', 'Incident Log', '', 'As needed', '']);
    ctrlRows.push(['Staff Training', data.trainingRequirements || '', 'Training Records', '', 'Annual', '']);
    ctrlRows.push(['Reporting', data.reportingObligations || '', 'Board Reports', '', data.reviewCycle || '', '']);
    var ws2 = XLSX.utils.aoa_to_sheet(ctrlRows);
    ws2['!cols'] = [{ wch: 22 }, { wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Governance Controls');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAIGovernanceFrameworkPDF: function(filename, data) {
    var lines = [
      { text: 'AI GOVERNANCE FRAMEWORK', size: 18, bold: true },
      { text: (data.orgName || '') + '  |  Risk Tier: ' + (data.riskTier || 'N/A'), size: 12 },
      { text: 'Owner: ' + (data.governanceOwner || 'N/A') + '  |  Review: ' + (data.reviewCycle || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── APPLICABLE REGULATIONS ──', size: 14, bold: true },
      { text: data.applicableRegulations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MODEL INVENTORY APPROACH ──', size: 14, bold: true },
      { text: data.modelInventoryApproach || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INCIDENT RESPONSE PLAN ──', size: 14, bold: true },
      { text: data.incidentResponsePlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPLIANCE EVIDENCE ──', size: 14, bold: true },
      { text: data.complianceEvidence || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRAINING REQUIREMENTS ──', size: 14, bold: true },
      { text: data.trainingRequirements || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REPORTING OBLIGATIONS ──', size: 14, bold: true },
      { text: data.reportingObligations || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI Governance Framework', lines: lines });
  },

  generateAIGovernanceFrameworkPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.orgName || 'Organisation',
      title: 'AI Governance Framework',
      subtitle: 'Risk Tier: ' + (data.riskTier || 'N/A') + '  |  Owner: ' + (data.governanceOwner || 'N/A') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Applicable Regulations', content: data.applicableRegulations || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Model Inventory Approach', content: data.modelInventoryApproach || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Incident Response Plan', content: data.incidentResponsePlan || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Compliance Evidence', content: data.complianceEvidence || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Training Requirements', content: data.trainingRequirements || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Reporting Obligations', content: data.reportingObligations || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  }

});
