/**
 * Doc Generator – Cognitive Psychology Series
 * Extends DocGenerator with 14 cognitive psychology document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * DocTypes (14):
 *  1. MemoryStudyGuide            – Memory Systems & Encoding Study Guide
 *  2. AttentionWorksheet          – Attention & Focus Analysis Worksheet
 *  3. PerceptionLab               – Perception & Interpretation Lab Report
 *  4. ProblemSolvingToolkit       – Problem-Solving & Creativity Toolkit
 *  5. LanguageAnalysis            – Language & Communication Analysis
 *  6. LearningPlan                – Learning & Knowledge Acquisition Plan
 *  7. NeuroscienceMap             – Cognitive Neuroscience Brain Map
 *  8. DevelopmentProfile          – Cognitive Development Profile
 *  9. IntelligenceAssessment      – Intelligence & Individual Differences Assessment
 * 10. EmotionCognitionLog         – Emotion & Cognition Interaction Log
 * 11. SocialCognitionCase         – Social Cognition Case Analysis
 * 12. AppliedCogDesign            – Applied Cognitive Psychology Design Brief
 * 13. ResearchMethodsPlan         – Research Methods Experiment Plan
 * 14. ComputationalModelSpec      – Computational & AI Model Specification
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. MEMORY STUDY GUIDE
  // ============================================================

  generateMemoryStudyGuideWord: async function(filename, data) {
    var sections = [
      { heading: 'Memory Systems Study Guide', content: [
        'Student: ' + (data.studentName || 'N/A'),
        'Course: ' + (data.course || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Topic Focus', content: ['Focus Area: ' + (data.topicFocus || 'N/A')] },
      { heading: '2. Study Level', content: ['Level: ' + (data.level || 'N/A')] },
      { heading: '3. Key Theories', content: (data.keyTheories || 'Not specified').split('\n') },
      { heading: '4. Case Studies & Experiments', content: (data.caseStudies || 'Not specified').split('\n') },
      { heading: '5. Real-World Applications', content: (data.applications || 'Not specified').split('\n') },
      { heading: '6. Study Goals', content: (data.studyGoals || 'Not specified').split('\n') },
      { heading: '7. Additional Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Memory Study Guide – ' + (data.studentName || ''), author: data.authorName || '', sections: sections });
  },

  generateMemoryStudyGuideExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['MEMORY SYSTEMS STUDY GUIDE'],
      ['Student', data.studentName || ''],
      ['Course', data.course || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Study Level', data.level || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['KEY THEORIES'],
      [data.keyTheories || ''],
      [],
      ['CASE STUDIES & EXPERIMENTS'],
      [data.caseStudies || ''],
      [],
      ['REAL-WORLD APPLICATIONS'],
      [data.applications || ''],
      [],
      ['STUDY GOALS'],
      [data.studyGoals || ''],
      [],
      ['ADDITIONAL NOTES'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Study Guide');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMemoryStudyGuidePDF: function(filename, data) {
    var lines = [
      { text: 'MEMORY SYSTEMS STUDY GUIDE', size: 18, bold: true },
      { text: (data.studentName || '') + '  |  ' + (data.course || ''), size: 12 },
      { text: 'Focus: ' + (data.topicFocus || '') + '  |  Level: ' + (data.level || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── KEY THEORIES ──', size: 14, bold: true },
      { text: data.keyTheories || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CASE STUDIES & EXPERIMENTS ──', size: 14, bold: true },
      { text: data.caseStudies || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REAL-WORLD APPLICATIONS ──', size: 14, bold: true },
      { text: data.applications || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STUDY GOALS ──', size: 14, bold: true },
      { text: data.studyGoals || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADDITIONAL NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Memory Study Guide', lines: lines });
  },

  generateMemoryStudyGuidePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.studentName || 'Student',
      title: 'Memory Systems Study Guide',
      subtitle: (data.course || '') + '  |  ' + (data.topicFocus || ''),
      perSlide: 2,
      sections: [
        { heading: 'Key Theories', content: data.keyTheories || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Case Studies & Experiments', content: data.caseStudies || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Real-World Applications', content: data.applications || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Study Goals', content: data.studyGoals || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Additional Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 2. ATTENTION & FOCUS ANALYSIS WORKSHEET
  // ============================================================

  generateAttentionWorksheetWord: async function(filename, data) {
    var sections = [
      { heading: 'Attention & Focus Analysis Worksheet', content: [
        'Participant: ' + (data.participantName || 'N/A'),
        'Context: ' + (data.context || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Attention Type Assessed', content: ['Type: ' + (data.attentionType || 'N/A')] },
      { heading: '2. Task Environment', content: (data.taskEnvironment || 'Not specified').split('\n') },
      { heading: '3. Distraction Factors', content: (data.distractionFactors || 'Not specified').split('\n') },
      { heading: '4. Attention Models Applied', content: (data.modelsApplied || 'Not specified').split('\n') },
      { heading: '5. Performance Observations', content: (data.observations || 'Not specified').split('\n') },
      { heading: '6. Strategies & Recommendations', content: (data.strategies || 'Not specified').split('\n') },
      { heading: '7. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Attention Analysis – ' + (data.participantName || ''), author: data.authorName || '', sections: sections });
  },

  generateAttentionWorksheetExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ATTENTION & FOCUS ANALYSIS WORKSHEET'],
      ['Participant', data.participantName || ''],
      ['Context', data.context || ''],
      ['Attention Type', data.attentionType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['TASK ENVIRONMENT'], [data.taskEnvironment || ''],
      [], ['DISTRACTION FACTORS'], [data.distractionFactors || ''],
      [], ['ATTENTION MODELS APPLIED'], [data.modelsApplied || ''],
      [], ['PERFORMANCE OBSERVATIONS'], [data.observations || ''],
      [], ['STRATEGIES & RECOMMENDATIONS'], [data.strategies || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Attention Analysis');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAttentionWorksheetPDF: function(filename, data) {
    var lines = [
      { text: 'ATTENTION & FOCUS ANALYSIS WORKSHEET', size: 18, bold: true },
      { text: (data.participantName || '') + '  |  ' + (data.context || ''), size: 12 },
      { text: 'Attention Type: ' + (data.attentionType || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TASK ENVIRONMENT ──', size: 14, bold: true },
      { text: data.taskEnvironment || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DISTRACTION FACTORS ──', size: 14, bold: true },
      { text: data.distractionFactors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MODELS APPLIED ──', size: 14, bold: true },
      { text: data.modelsApplied || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OBSERVATIONS ──', size: 14, bold: true },
      { text: data.observations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STRATEGIES & RECOMMENDATIONS ──', size: 14, bold: true },
      { text: data.strategies || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Attention & Focus Analysis', lines: lines });
  },

  generateAttentionWorksheetPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.participantName || 'Participant',
      title: 'Attention & Focus Analysis',
      subtitle: (data.context || '') + '  |  ' + (data.attentionType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Task Environment', content: data.taskEnvironment || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Distraction Factors', content: data.distractionFactors || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Attention Models Applied', content: data.modelsApplied || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Performance Observations', content: data.observations || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Strategies & Recommendations', content: data.strategies || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 3. PERCEPTION & INTERPRETATION LAB REPORT
  // ============================================================

  generatePerceptionLabWord: async function(filename, data) {
    var sections = [
      { heading: 'Perception & Interpretation Lab Report', content: [
        'Researcher: ' + (data.researcherName || 'N/A'),
        'Experiment: ' + (data.experimentTitle || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Perceptual Modality', content: ['Modality: ' + (data.modality || 'N/A')] },
      { heading: '2. Hypothesis', content: (data.hypothesis || 'Not specified').split('\n') },
      { heading: '3. Stimuli & Conditions', content: (data.stimuli || 'Not specified').split('\n') },
      { heading: '4. Gestalt Principles Observed', content: (data.gestaltPrinciples || 'Not specified').split('\n') },
      { heading: '5. Results & Observations', content: (data.results || 'Not specified').split('\n') },
      { heading: '6. Perceptual Biases Identified', content: (data.biases || 'Not specified').split('\n') },
      { heading: '7. Conclusions', content: (data.conclusions || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Perception Lab – ' + (data.experimentTitle || ''), author: data.authorName || '', sections: sections });
  },

  generatePerceptionLabExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PERCEPTION & INTERPRETATION LAB REPORT'],
      ['Researcher', data.researcherName || ''],
      ['Experiment', data.experimentTitle || ''],
      ['Modality', data.modality || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['HYPOTHESIS'], [data.hypothesis || ''],
      [], ['STIMULI & CONDITIONS'], [data.stimuli || ''],
      [], ['GESTALT PRINCIPLES OBSERVED'], [data.gestaltPrinciples || ''],
      [], ['RESULTS & OBSERVATIONS'], [data.results || ''],
      [], ['PERCEPTUAL BIASES'], [data.biases || ''],
      [], ['CONCLUSIONS'], [data.conclusions || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Lab Report');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePerceptionLabPDF: function(filename, data) {
    var lines = [
      { text: 'PERCEPTION & INTERPRETATION LAB REPORT', size: 18, bold: true },
      { text: (data.researcherName || '') + '  |  ' + (data.experimentTitle || ''), size: 12 },
      { text: 'Modality: ' + (data.modality || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── HYPOTHESIS ──', size: 14, bold: true },
      { text: data.hypothesis || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STIMULI & CONDITIONS ──', size: 14, bold: true },
      { text: data.stimuli || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GESTALT PRINCIPLES ──', size: 14, bold: true },
      { text: data.gestaltPrinciples || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RESULTS & OBSERVATIONS ──', size: 14, bold: true },
      { text: data.results || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERCEPTUAL BIASES ──', size: 14, bold: true },
      { text: data.biases || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONCLUSIONS ──', size: 14, bold: true },
      { text: data.conclusions || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Perception Lab Report', lines: lines });
  },

  generatePerceptionLabPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.researcherName || 'Researcher',
      title: 'Perception & Interpretation Lab Report',
      subtitle: (data.experimentTitle || '') + '  |  ' + (data.modality || ''),
      perSlide: 2,
      sections: [
        { heading: 'Hypothesis', content: data.hypothesis || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Stimuli & Conditions', content: data.stimuli || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Gestalt Principles', content: data.gestaltPrinciples || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Results & Observations', content: data.results || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Perceptual Biases', content: data.biases || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Conclusions', content: data.conclusions || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 4. PROBLEM-SOLVING & CREATIVITY TOOLKIT
  // ============================================================

  generateProblemSolvingToolkitWord: async function(filename, data) {
    var sections = [
      { heading: 'Problem-Solving & Creativity Toolkit', content: [
        'Author: ' + (data.userName || 'N/A'),
        'Problem Domain: ' + (data.problemDomain || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Problem Statement', content: (data.problemStatement || 'Not specified').split('\n') },
      { heading: '2. Approach / Heuristic', content: ['Approach: ' + (data.approach || 'N/A')] },
      { heading: '3. Cognitive Biases to Watch', content: (data.biasesWatch || 'Not specified').split('\n') },
      { heading: '4. Divergent Thinking Ideas', content: (data.divergentIdeas || 'Not specified').split('\n') },
      { heading: '5. Convergent Analysis', content: (data.convergentAnalysis || 'Not specified').split('\n') },
      { heading: '6. Decision Framework', content: (data.decisionFramework || 'Not specified').split('\n') },
      { heading: '7. Solution & Evaluation', content: (data.solution || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Problem-Solving Toolkit – ' + (data.problemDomain || ''), author: data.authorName || '', sections: sections });
  },

  generateProblemSolvingToolkitExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PROBLEM-SOLVING & CREATIVITY TOOLKIT'],
      ['Author', data.userName || ''],
      ['Problem Domain', data.problemDomain || ''],
      ['Approach', data.approach || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PROBLEM STATEMENT'], [data.problemStatement || ''],
      [], ['COGNITIVE BIASES TO WATCH'], [data.biasesWatch || ''],
      [], ['DIVERGENT THINKING IDEAS'], [data.divergentIdeas || ''],
      [], ['CONVERGENT ANALYSIS'], [data.convergentAnalysis || ''],
      [], ['DECISION FRAMEWORK'], [data.decisionFramework || ''],
      [], ['SOLUTION & EVALUATION'], [data.solution || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Toolkit');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateProblemSolvingToolkitPDF: function(filename, data) {
    var lines = [
      { text: 'PROBLEM-SOLVING & CREATIVITY TOOLKIT', size: 18, bold: true },
      { text: (data.userName || '') + '  |  ' + (data.problemDomain || ''), size: 12 },
      { text: 'Approach: ' + (data.approach || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PROBLEM STATEMENT ──', size: 14, bold: true },
      { text: data.problemStatement || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE BIASES TO WATCH ──', size: 14, bold: true },
      { text: data.biasesWatch || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DIVERGENT THINKING IDEAS ──', size: 14, bold: true },
      { text: data.divergentIdeas || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONVERGENT ANALYSIS ──', size: 14, bold: true },
      { text: data.convergentAnalysis || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DECISION FRAMEWORK ──', size: 14, bold: true },
      { text: data.decisionFramework || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SOLUTION & EVALUATION ──', size: 14, bold: true },
      { text: data.solution || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Problem-Solving Toolkit', lines: lines });
  },

  generateProblemSolvingToolkitPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.userName || 'Author',
      title: 'Problem-Solving & Creativity Toolkit',
      subtitle: (data.problemDomain || '') + '  |  ' + (data.approach || ''),
      perSlide: 2,
      sections: [
        { heading: 'Problem Statement', content: data.problemStatement || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Cognitive Biases to Watch', content: data.biasesWatch || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Divergent Thinking Ideas', content: data.divergentIdeas || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Convergent Analysis', content: data.convergentAnalysis || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Decision Framework', content: data.decisionFramework || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Solution & Evaluation', content: data.solution || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 5. LANGUAGE & COMMUNICATION ANALYSIS
  // ============================================================

  generateLanguageAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Language & Communication Analysis', content: [
        'Analyst: ' + (data.analystName || 'N/A'),
        'Language/Corpus: ' + (data.languageCorpus || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Linguistic Level Analyzed', content: ['Level: ' + (data.linguisticLevel || 'N/A')] },
      { heading: '2. Sample Text / Corpus', content: (data.sampleText || 'Not specified').split('\n') },
      { heading: '3. Phonological / Syntactic Features', content: (data.features || 'Not specified').split('\n') },
      { heading: '4. Semantic Analysis', content: (data.semanticAnalysis || 'Not specified').split('\n') },
      { heading: '5. Pragmatic / Contextual Factors', content: (data.pragmaticFactors || 'Not specified').split('\n') },
      { heading: '6. Theoretical Framework', content: (data.theoreticalFramework || 'Not specified').split('\n') },
      { heading: '7. Findings & Interpretation', content: (data.findings || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Language Analysis – ' + (data.languageCorpus || ''), author: data.authorName || '', sections: sections });
  },

  generateLanguageAnalysisExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['LANGUAGE & COMMUNICATION ANALYSIS'],
      ['Analyst', data.analystName || ''],
      ['Language/Corpus', data.languageCorpus || ''],
      ['Linguistic Level', data.linguisticLevel || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['SAMPLE TEXT / CORPUS'], [data.sampleText || ''],
      [], ['PHONOLOGICAL / SYNTACTIC FEATURES'], [data.features || ''],
      [], ['SEMANTIC ANALYSIS'], [data.semanticAnalysis || ''],
      [], ['PRAGMATIC / CONTEXTUAL FACTORS'], [data.pragmaticFactors || ''],
      [], ['THEORETICAL FRAMEWORK'], [data.theoreticalFramework || ''],
      [], ['FINDINGS & INTERPRETATION'], [data.findings || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Language Analysis');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateLanguageAnalysisPDF: function(filename, data) {
    var lines = [
      { text: 'LANGUAGE & COMMUNICATION ANALYSIS', size: 18, bold: true },
      { text: (data.analystName || '') + '  |  ' + (data.languageCorpus || ''), size: 12 },
      { text: 'Level: ' + (data.linguisticLevel || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SAMPLE TEXT / CORPUS ──', size: 14, bold: true },
      { text: data.sampleText || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FEATURES ──', size: 14, bold: true },
      { text: data.features || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SEMANTIC ANALYSIS ──', size: 14, bold: true },
      { text: data.semanticAnalysis || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PRAGMATIC FACTORS ──', size: 14, bold: true },
      { text: data.pragmaticFactors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── THEORETICAL FRAMEWORK ──', size: 14, bold: true },
      { text: data.theoreticalFramework || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FINDINGS ──', size: 14, bold: true },
      { text: data.findings || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Language Analysis', lines: lines });
  },

  generateLanguageAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.analystName || 'Analyst',
      title: 'Language & Communication Analysis',
      subtitle: (data.languageCorpus || '') + '  |  ' + (data.linguisticLevel || ''),
      perSlide: 2,
      sections: [
        { heading: 'Sample Text / Corpus', content: data.sampleText || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Phonological / Syntactic Features', content: data.features || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Semantic Analysis', content: data.semanticAnalysis || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Pragmatic / Contextual Factors', content: data.pragmaticFactors || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Theoretical Framework', content: data.theoreticalFramework || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Findings & Interpretation', content: data.findings || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 6. LEARNING & KNOWLEDGE ACQUISITION PLAN
  // ============================================================

  generateLearningPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'Learning & Knowledge Acquisition Plan', content: [
        'Learner: ' + (data.learnerName || 'N/A'),
        'Subject: ' + (data.subject || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Learning Type', content: ['Type: ' + (data.learningType || 'N/A')] },
      { heading: '2. Current Knowledge Level', content: (data.currentLevel || 'Not specified').split('\n') },
      { heading: '3. Learning Objectives', content: (data.objectives || 'Not specified').split('\n') },
      { heading: '4. Knowledge Representation Strategy', content: (data.knowledgeStrategy || 'Not specified').split('\n') },
      { heading: '5. Practice & Transfer Plan', content: (data.practicePlan || 'Not specified').split('\n') },
      { heading: '6. Metacognitive Strategies', content: (data.metacogStrategies || 'Not specified').split('\n') },
      { heading: '7. Assessment Criteria', content: (data.assessmentCriteria || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Learning Plan – ' + (data.subject || ''), author: data.authorName || '', sections: sections });
  },

  generateLearningPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['LEARNING & KNOWLEDGE ACQUISITION PLAN'],
      ['Learner', data.learnerName || ''],
      ['Subject', data.subject || ''],
      ['Learning Type', data.learningType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CURRENT KNOWLEDGE LEVEL'], [data.currentLevel || ''],
      [], ['LEARNING OBJECTIVES'], [data.objectives || ''],
      [], ['KNOWLEDGE REPRESENTATION'], [data.knowledgeStrategy || ''],
      [], ['PRACTICE & TRANSFER PLAN'], [data.practicePlan || ''],
      [], ['METACOGNITIVE STRATEGIES'], [data.metacogStrategies || ''],
      [], ['ASSESSMENT CRITERIA'], [data.assessmentCriteria || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Learning Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateLearningPlanPDF: function(filename, data) {
    var lines = [
      { text: 'LEARNING & KNOWLEDGE ACQUISITION PLAN', size: 18, bold: true },
      { text: (data.learnerName || '') + '  |  ' + (data.subject || ''), size: 12 },
      { text: 'Type: ' + (data.learningType || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CURRENT KNOWLEDGE LEVEL ──', size: 14, bold: true },
      { text: data.currentLevel || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LEARNING OBJECTIVES ──', size: 14, bold: true },
      { text: data.objectives || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KNOWLEDGE REPRESENTATION ──', size: 14, bold: true },
      { text: data.knowledgeStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PRACTICE & TRANSFER ──', size: 14, bold: true },
      { text: data.practicePlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── METACOGNITIVE STRATEGIES ──', size: 14, bold: true },
      { text: data.metacogStrategies || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ASSESSMENT CRITERIA ──', size: 14, bold: true },
      { text: data.assessmentCriteria || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Learning Plan', lines: lines });
  },

  generateLearningPlanPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.learnerName || 'Learner',
      title: 'Learning & Knowledge Acquisition Plan',
      subtitle: (data.subject || '') + '  |  ' + (data.learningType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Current Knowledge Level', content: data.currentLevel || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Learning Objectives', content: data.objectives || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Knowledge Representation', content: data.knowledgeStrategy || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Practice & Transfer Plan', content: data.practicePlan || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Metacognitive Strategies', content: data.metacogStrategies || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Assessment Criteria', content: data.assessmentCriteria || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 7. COGNITIVE NEUROSCIENCE BRAIN MAP
  // ============================================================

  generateNeuroscienceMapWord: async function(filename, data) {
    var sections = [
      { heading: 'Cognitive Neuroscience Brain Map', content: [
        'Researcher: ' + (data.researcherName || 'N/A'),
        'Focus Area: ' + (data.focusArea || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Brain Regions of Interest', content: (data.brainRegions || 'Not specified').split('\n') },
      { heading: '2. Neural Networks & Connectivity', content: (data.neuralNetworks || 'Not specified').split('\n') },
      { heading: '3. Imaging Methods', content: ['Method: ' + (data.imagingMethod || 'N/A')] },
      { heading: '4. Cognitive Functions Mapped', content: (data.cognitiveFunctions || 'Not specified').split('\n') },
      { heading: '5. Neuroplasticity Observations', content: (data.neuroplasticity || 'Not specified').split('\n') },
      { heading: '6. Clinical Implications', content: (data.clinicalImplications || 'Not specified').split('\n') },
      { heading: '7. Research Questions', content: (data.researchQuestions || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Brain Map – ' + (data.focusArea || ''), author: data.authorName || '', sections: sections });
  },

  generateNeuroscienceMapExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['COGNITIVE NEUROSCIENCE BRAIN MAP'],
      ['Researcher', data.researcherName || ''],
      ['Focus Area', data.focusArea || ''],
      ['Imaging Method', data.imagingMethod || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['BRAIN REGIONS OF INTEREST'], [data.brainRegions || ''],
      [], ['NEURAL NETWORKS & CONNECTIVITY'], [data.neuralNetworks || ''],
      [], ['COGNITIVE FUNCTIONS MAPPED'], [data.cognitiveFunctions || ''],
      [], ['NEUROPLASTICITY OBSERVATIONS'], [data.neuroplasticity || ''],
      [], ['CLINICAL IMPLICATIONS'], [data.clinicalImplications || ''],
      [], ['RESEARCH QUESTIONS'], [data.researchQuestions || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Brain Map');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateNeuroscienceMapPDF: function(filename, data) {
    var lines = [
      { text: 'COGNITIVE NEUROSCIENCE BRAIN MAP', size: 18, bold: true },
      { text: (data.researcherName || '') + '  |  ' + (data.focusArea || ''), size: 12 },
      { text: 'Imaging: ' + (data.imagingMethod || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BRAIN REGIONS ──', size: 14, bold: true },
      { text: data.brainRegions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NEURAL NETWORKS ──', size: 14, bold: true },
      { text: data.neuralNetworks || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE FUNCTIONS ──', size: 14, bold: true },
      { text: data.cognitiveFunctions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NEUROPLASTICITY ──', size: 14, bold: true },
      { text: data.neuroplasticity || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL IMPLICATIONS ──', size: 14, bold: true },
      { text: data.clinicalImplications || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RESEARCH QUESTIONS ──', size: 14, bold: true },
      { text: data.researchQuestions || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Cognitive Neuroscience Brain Map', lines: lines });
  },

  generateNeuroscienceMapPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.researcherName || 'Researcher',
      title: 'Cognitive Neuroscience Brain Map',
      subtitle: (data.focusArea || '') + '  |  ' + (data.imagingMethod || ''),
      perSlide: 2,
      sections: [
        { heading: 'Brain Regions of Interest', content: data.brainRegions || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Neural Networks & Connectivity', content: data.neuralNetworks || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Cognitive Functions Mapped', content: data.cognitiveFunctions || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Neuroplasticity Observations', content: data.neuroplasticity || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Clinical Implications', content: data.clinicalImplications || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Research Questions', content: data.researchQuestions || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 8. COGNITIVE DEVELOPMENT PROFILE
  // ============================================================

  generateDevelopmentProfileWord: async function(filename, data) {
    var sections = [
      { heading: 'Cognitive Development Profile', content: [
        'Subject: ' + (data.subjectName || 'N/A'),
        'Age Group: ' + (data.ageGroup || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Developmental Stage', content: ['Stage: ' + (data.devStage || 'N/A')] },
      { heading: '2. Cognitive Milestones', content: (data.milestones || 'Not specified').split('\n') },
      { heading: '3. Theoretical Framework', content: (data.framework || 'Not specified').split('\n') },
      { heading: '4. Language Development', content: (data.languageDev || 'Not specified').split('\n') },
      { heading: '5. Memory & Reasoning Abilities', content: (data.memoryReasoning || 'Not specified').split('\n') },
      { heading: '6. Social-Cognitive Development', content: (data.socialCognitive || 'Not specified').split('\n') },
      { heading: '7. Recommendations', content: (data.recommendations || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Development Profile – ' + (data.subjectName || ''), author: data.authorName || '', sections: sections });
  },

  generateDevelopmentProfileExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['COGNITIVE DEVELOPMENT PROFILE'],
      ['Subject', data.subjectName || ''],
      ['Age Group', data.ageGroup || ''],
      ['Stage', data.devStage || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['COGNITIVE MILESTONES'], [data.milestones || ''],
      [], ['THEORETICAL FRAMEWORK'], [data.framework || ''],
      [], ['LANGUAGE DEVELOPMENT'], [data.languageDev || ''],
      [], ['MEMORY & REASONING'], [data.memoryReasoning || ''],
      [], ['SOCIAL-COGNITIVE DEVELOPMENT'], [data.socialCognitive || ''],
      [], ['RECOMMENDATIONS'], [data.recommendations || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Development Profile');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDevelopmentProfilePDF: function(filename, data) {
    var lines = [
      { text: 'COGNITIVE DEVELOPMENT PROFILE', size: 18, bold: true },
      { text: (data.subjectName || '') + '  |  Age: ' + (data.ageGroup || ''), size: 12 },
      { text: 'Stage: ' + (data.devStage || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE MILESTONES ──', size: 14, bold: true },
      { text: data.milestones || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── THEORETICAL FRAMEWORK ──', size: 14, bold: true },
      { text: data.framework || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LANGUAGE DEVELOPMENT ──', size: 14, bold: true },
      { text: data.languageDev || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MEMORY & REASONING ──', size: 14, bold: true },
      { text: data.memoryReasoning || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SOCIAL-COGNITIVE ──', size: 14, bold: true },
      { text: data.socialCognitive || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RECOMMENDATIONS ──', size: 14, bold: true },
      { text: data.recommendations || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Cognitive Development Profile', lines: lines });
  },

  generateDevelopmentProfilePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.subjectName || 'Subject',
      title: 'Cognitive Development Profile',
      subtitle: 'Age: ' + (data.ageGroup || '') + '  |  Stage: ' + (data.devStage || ''),
      perSlide: 2,
      sections: [
        { heading: 'Cognitive Milestones', content: data.milestones || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Theoretical Framework', content: data.framework || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Language Development', content: data.languageDev || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Memory & Reasoning', content: data.memoryReasoning || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Social-Cognitive Development', content: data.socialCognitive || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Recommendations', content: data.recommendations || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 9. INTELLIGENCE & INDIVIDUAL DIFFERENCES ASSESSMENT
  // ============================================================

  generateIntelligenceAssessmentWord: async function(filename, data) {
    var sections = [
      { heading: 'Intelligence & Individual Differences Assessment', content: [
        'Subject: ' + (data.subjectName || 'N/A'),
        'Assessor: ' + (data.assessor || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Intelligence Theory Applied', content: ['Theory: ' + (data.intelligenceTheory || 'N/A')] },
      { heading: '2. Cognitive Strengths', content: (data.strengths || 'Not specified').split('\n') },
      { heading: '3. Cognitive Challenges', content: (data.challenges || 'Not specified').split('\n') },
      { heading: '4. Emotional Intelligence Indicators', content: (data.emotionalIntel || 'Not specified').split('\n') },
      { heading: '5. Cognitive Style Profile', content: (data.cognitiveStyle || 'Not specified').split('\n') },
      { heading: '6. Environmental Factors', content: (data.environmentalFactors || 'Not specified').split('\n') },
      { heading: '7. Development Recommendations', content: (data.devRecommendations || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Intelligence Assessment – ' + (data.subjectName || ''), author: data.authorName || '', sections: sections });
  },

  generateIntelligenceAssessmentExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['INTELLIGENCE & INDIVIDUAL DIFFERENCES ASSESSMENT'],
      ['Subject', data.subjectName || ''],
      ['Assessor', data.assessor || ''],
      ['Theory', data.intelligenceTheory || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['COGNITIVE STRENGTHS'], [data.strengths || ''],
      [], ['COGNITIVE CHALLENGES'], [data.challenges || ''],
      [], ['EMOTIONAL INTELLIGENCE'], [data.emotionalIntel || ''],
      [], ['COGNITIVE STYLE PROFILE'], [data.cognitiveStyle || ''],
      [], ['ENVIRONMENTAL FACTORS'], [data.environmentalFactors || ''],
      [], ['DEVELOPMENT RECOMMENDATIONS'], [data.devRecommendations || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Assessment');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateIntelligenceAssessmentPDF: function(filename, data) {
    var lines = [
      { text: 'INTELLIGENCE & INDIVIDUAL DIFFERENCES ASSESSMENT', size: 16, bold: true },
      { text: (data.subjectName || '') + '  |  Assessor: ' + (data.assessor || ''), size: 12 },
      { text: 'Theory: ' + (data.intelligenceTheory || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE STRENGTHS ──', size: 14, bold: true },
      { text: data.strengths || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE CHALLENGES ──', size: 14, bold: true },
      { text: data.challenges || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EMOTIONAL INTELLIGENCE ──', size: 14, bold: true },
      { text: data.emotionalIntel || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE STYLE ──', size: 14, bold: true },
      { text: data.cognitiveStyle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ENVIRONMENTAL FACTORS ──', size: 14, bold: true },
      { text: data.environmentalFactors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RECOMMENDATIONS ──', size: 14, bold: true },
      { text: data.devRecommendations || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Intelligence Assessment', lines: lines });
  },

  generateIntelligenceAssessmentPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.subjectName || 'Subject',
      title: 'Intelligence & Individual Differences',
      subtitle: 'Assessor: ' + (data.assessor || '') + '  |  ' + (data.intelligenceTheory || ''),
      perSlide: 2,
      sections: [
        { heading: 'Cognitive Strengths', content: data.strengths || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Cognitive Challenges', content: data.challenges || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Emotional Intelligence', content: data.emotionalIntel || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Cognitive Style Profile', content: data.cognitiveStyle || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Environmental Factors', content: data.environmentalFactors || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Recommendations', content: data.devRecommendations || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 10. EMOTION & COGNITION INTERACTION LOG
  // ============================================================

  generateEmotionCognitionLogWord: async function(filename, data) {
    var sections = [
      { heading: 'Emotion & Cognition Interaction Log', content: [
        'Participant: ' + (data.participantName || 'N/A'),
        'Context: ' + (data.context || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Emotional State', content: ['State: ' + (data.emotionalState || 'N/A')] },
      { heading: '2. Cognitive Task Description', content: (data.taskDescription || 'Not specified').split('\n') },
      { heading: '3. Emotion-Cognition Interaction Observed', content: (data.interaction || 'Not specified').split('\n') },
      { heading: '4. Decision-Making Under Emotion', content: (data.decisionMaking || 'Not specified').split('\n') },
      { heading: '5. Stress & Performance Impact', content: (data.stressImpact || 'Not specified').split('\n') },
      { heading: '6. Motivation Factors', content: (data.motivationFactors || 'Not specified').split('\n') },
      { heading: '7. Regulation Strategies Used', content: (data.regulationStrategies || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Emotion-Cognition Log – ' + (data.participantName || ''), author: data.authorName || '', sections: sections });
  },

  generateEmotionCognitionLogExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['EMOTION & COGNITION INTERACTION LOG'],
      ['Participant', data.participantName || ''],
      ['Context', data.context || ''],
      ['Emotional State', data.emotionalState || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['COGNITIVE TASK DESCRIPTION'], [data.taskDescription || ''],
      [], ['INTERACTION OBSERVED'], [data.interaction || ''],
      [], ['DECISION-MAKING UNDER EMOTION'], [data.decisionMaking || ''],
      [], ['STRESS & PERFORMANCE IMPACT'], [data.stressImpact || ''],
      [], ['MOTIVATION FACTORS'], [data.motivationFactors || ''],
      [], ['REGULATION STRATEGIES'], [data.regulationStrategies || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Emotion-Cognition Log');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEmotionCognitionLogPDF: function(filename, data) {
    var lines = [
      { text: 'EMOTION & COGNITION INTERACTION LOG', size: 18, bold: true },
      { text: (data.participantName || '') + '  |  ' + (data.context || ''), size: 12 },
      { text: 'Emotional State: ' + (data.emotionalState || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE TASK ──', size: 14, bold: true },
      { text: data.taskDescription || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERACTION OBSERVED ──', size: 14, bold: true },
      { text: data.interaction || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DECISION-MAKING ──', size: 14, bold: true },
      { text: data.decisionMaking || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STRESS & PERFORMANCE ──', size: 14, bold: true },
      { text: data.stressImpact || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MOTIVATION FACTORS ──', size: 14, bold: true },
      { text: data.motivationFactors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REGULATION STRATEGIES ──', size: 14, bold: true },
      { text: data.regulationStrategies || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Emotion & Cognition Log', lines: lines });
  },

  generateEmotionCognitionLogPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.participantName || 'Participant',
      title: 'Emotion & Cognition Interaction Log',
      subtitle: (data.context || '') + '  |  ' + (data.emotionalState || ''),
      perSlide: 2,
      sections: [
        { heading: 'Cognitive Task', content: data.taskDescription || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Interaction Observed', content: data.interaction || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Decision-Making Under Emotion', content: data.decisionMaking || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Stress & Performance Impact', content: data.stressImpact || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Motivation Factors', content: data.motivationFactors || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Regulation Strategies', content: data.regulationStrategies || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 11. SOCIAL COGNITION CASE ANALYSIS
  // ============================================================

  generateSocialCognitionCaseWord: async function(filename, data) {
    var sections = [
      { heading: 'Social Cognition Case Analysis', content: [
        'Analyst: ' + (data.analystName || 'N/A'),
        'Case Title: ' + (data.caseTitle || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Social Context', content: (data.socialContext || 'Not specified').split('\n') },
      { heading: '2. Theory of Mind Analysis', content: (data.theoryOfMind || 'Not specified').split('\n') },
      { heading: '3. Attribution Patterns', content: (data.attributionPatterns || 'Not specified').split('\n') },
      { heading: '4. Stereotypes & Biases Identified', content: (data.stereotypesBiases || 'Not specified').split('\n') },
      { heading: '5. Group Dynamics', content: (data.groupDynamics || 'Not specified').split('\n') },
      { heading: '6. Decision Outcomes', content: (data.decisionOutcomes || 'Not specified').split('\n') },
      { heading: '7. Intervention Recommendations', content: (data.interventions || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Social Cognition – ' + (data.caseTitle || ''), author: data.authorName || '', sections: sections });
  },

  generateSocialCognitionCaseExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['SOCIAL COGNITION CASE ANALYSIS'],
      ['Analyst', data.analystName || ''],
      ['Case Title', data.caseTitle || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['SOCIAL CONTEXT'], [data.socialContext || ''],
      [], ['THEORY OF MIND ANALYSIS'], [data.theoryOfMind || ''],
      [], ['ATTRIBUTION PATTERNS'], [data.attributionPatterns || ''],
      [], ['STEREOTYPES & BIASES'], [data.stereotypesBiases || ''],
      [], ['GROUP DYNAMICS'], [data.groupDynamics || ''],
      [], ['DECISION OUTCOMES'], [data.decisionOutcomes || ''],
      [], ['INTERVENTION RECOMMENDATIONS'], [data.interventions || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Social Cognition');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSocialCognitionCasePDF: function(filename, data) {
    var lines = [
      { text: 'SOCIAL COGNITION CASE ANALYSIS', size: 18, bold: true },
      { text: (data.analystName || '') + '  |  ' + (data.caseTitle || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SOCIAL CONTEXT ──', size: 14, bold: true },
      { text: data.socialContext || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── THEORY OF MIND ──', size: 14, bold: true },
      { text: data.theoryOfMind || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ATTRIBUTION PATTERNS ──', size: 14, bold: true },
      { text: data.attributionPatterns || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STEREOTYPES & BIASES ──', size: 14, bold: true },
      { text: data.stereotypesBiases || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GROUP DYNAMICS ──', size: 14, bold: true },
      { text: data.groupDynamics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DECISION OUTCOMES ──', size: 14, bold: true },
      { text: data.decisionOutcomes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERVENTIONS ──', size: 14, bold: true },
      { text: data.interventions || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Social Cognition Case Analysis', lines: lines });
  },

  generateSocialCognitionCasePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.analystName || 'Analyst',
      title: 'Social Cognition Case Analysis',
      subtitle: data.caseTitle || '',
      perSlide: 2,
      sections: [
        { heading: 'Social Context', content: data.socialContext || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Theory of Mind', content: data.theoryOfMind || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Attribution Patterns', content: data.attributionPatterns || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Stereotypes & Biases', content: data.stereotypesBiases || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Group Dynamics', content: data.groupDynamics || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Decision Outcomes', content: data.decisionOutcomes || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Interventions', content: data.interventions || 'Not specified', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 12. APPLIED COGNITIVE PSYCHOLOGY DESIGN BRIEF
  // ============================================================

  generateAppliedCogDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Applied Cognitive Psychology Design Brief', content: [
        'Designer: ' + (data.designerName || 'N/A'),
        'Project: ' + (data.projectName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Application Domain', content: ['Domain: ' + (data.domain || 'N/A')] },
      { heading: '2. User / Population Profile', content: (data.userProfile || 'Not specified').split('\n') },
      { heading: '3. Cognitive Principles Applied', content: (data.cogPrinciples || 'Not specified').split('\n') },
      { heading: '4. Design Requirements', content: (data.designRequirements || 'Not specified').split('\n') },
      { heading: '5. Cognitive Load Considerations', content: (data.cogLoadConsiderations || 'Not specified').split('\n') },
      { heading: '6. Usability & Accessibility', content: (data.usability || 'Not specified').split('\n') },
      { heading: '7. Evaluation Metrics', content: (data.evaluationMetrics || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Applied CogPsych Brief – ' + (data.projectName || ''), author: data.authorName || '', sections: sections });
  },

  generateAppliedCogDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['APPLIED COGNITIVE PSYCHOLOGY DESIGN BRIEF'],
      ['Designer', data.designerName || ''],
      ['Project', data.projectName || ''],
      ['Domain', data.domain || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['USER / POPULATION PROFILE'], [data.userProfile || ''],
      [], ['COGNITIVE PRINCIPLES APPLIED'], [data.cogPrinciples || ''],
      [], ['DESIGN REQUIREMENTS'], [data.designRequirements || ''],
      [], ['COGNITIVE LOAD CONSIDERATIONS'], [data.cogLoadConsiderations || ''],
      [], ['USABILITY & ACCESSIBILITY'], [data.usability || ''],
      [], ['EVALUATION METRICS'], [data.evaluationMetrics || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Design Brief');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAppliedCogDesignPDF: function(filename, data) {
    var lines = [
      { text: 'APPLIED COGNITIVE PSYCHOLOGY DESIGN BRIEF', size: 16, bold: true },
      { text: (data.designerName || '') + '  |  ' + (data.projectName || ''), size: 12 },
      { text: 'Domain: ' + (data.domain || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── USER PROFILE ──', size: 14, bold: true },
      { text: data.userProfile || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE PRINCIPLES ──', size: 14, bold: true },
      { text: data.cogPrinciples || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DESIGN REQUIREMENTS ──', size: 14, bold: true },
      { text: data.designRequirements || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COGNITIVE LOAD ──', size: 14, bold: true },
      { text: data.cogLoadConsiderations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── USABILITY & ACCESSIBILITY ──', size: 14, bold: true },
      { text: data.usability || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVALUATION METRICS ──', size: 14, bold: true },
      { text: data.evaluationMetrics || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Applied Cognitive Design Brief', lines: lines });
  },

  generateAppliedCogDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.designerName || 'Designer',
      title: 'Applied Cognitive Psychology Design Brief',
      subtitle: (data.projectName || '') + '  |  ' + (data.domain || ''),
      perSlide: 2,
      sections: [
        { heading: 'User / Population Profile', content: data.userProfile || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Cognitive Principles Applied', content: data.cogPrinciples || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Design Requirements', content: data.designRequirements || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Cognitive Load Considerations', content: data.cogLoadConsiderations || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Usability & Accessibility', content: data.usability || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Evaluation Metrics', content: data.evaluationMetrics || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 13. RESEARCH METHODS EXPERIMENT PLAN
  // ============================================================

  generateResearchMethodsPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'Research Methods Experiment Plan', content: [
        'Researcher: ' + (data.researcherName || 'N/A'),
        'Study Title: ' + (data.studyTitle || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Research Question', content: (data.researchQuestion || 'Not specified').split('\n') },
      { heading: '2. Hypothesis', content: (data.hypothesis || 'Not specified').split('\n') },
      { heading: '3. Experimental Design', content: ['Design: ' + (data.experimentalDesign || 'N/A')] },
      { heading: '4. Variables', content: (data.variables || 'Not specified').split('\n') },
      { heading: '5. Participants & Sampling', content: (data.participants || 'Not specified').split('\n') },
      { heading: '6. Procedure', content: (data.procedure || 'Not specified').split('\n') },
      { heading: '7. Statistical Analysis Plan', content: (data.statisticalPlan || 'Not specified').split('\n') },
      { heading: '8. Ethical Considerations', content: (data.ethics || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Experiment Plan – ' + (data.studyTitle || ''), author: data.authorName || '', sections: sections });
  },

  generateResearchMethodsPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['RESEARCH METHODS EXPERIMENT PLAN'],
      ['Researcher', data.researcherName || ''],
      ['Study Title', data.studyTitle || ''],
      ['Design', data.experimentalDesign || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['RESEARCH QUESTION'], [data.researchQuestion || ''],
      [], ['HYPOTHESIS'], [data.hypothesis || ''],
      [], ['VARIABLES'], [data.variables || ''],
      [], ['PARTICIPANTS & SAMPLING'], [data.participants || ''],
      [], ['PROCEDURE'], [data.procedure || ''],
      [], ['STATISTICAL ANALYSIS PLAN'], [data.statisticalPlan || ''],
      [], ['ETHICAL CONSIDERATIONS'], [data.ethics || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Experiment Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateResearchMethodsPlanPDF: function(filename, data) {
    var lines = [
      { text: 'RESEARCH METHODS EXPERIMENT PLAN', size: 18, bold: true },
      { text: (data.researcherName || '') + '  |  ' + (data.studyTitle || ''), size: 12 },
      { text: 'Design: ' + (data.experimentalDesign || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── RESEARCH QUESTION ──', size: 14, bold: true },
      { text: data.researchQuestion || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HYPOTHESIS ──', size: 14, bold: true },
      { text: data.hypothesis || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── VARIABLES ──', size: 14, bold: true },
      { text: data.variables || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PARTICIPANTS ──', size: 14, bold: true },
      { text: data.participants || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROCEDURE ──', size: 14, bold: true },
      { text: data.procedure || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STATISTICAL ANALYSIS ──', size: 14, bold: true },
      { text: data.statisticalPlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ETHICAL CONSIDERATIONS ──', size: 14, bold: true },
      { text: data.ethics || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Experiment Plan', lines: lines });
  },

  generateResearchMethodsPlanPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.researcherName || 'Researcher',
      title: 'Research Methods Experiment Plan',
      subtitle: data.studyTitle || '',
      perSlide: 2,
      sections: [
        { heading: 'Research Question', content: data.researchQuestion || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Hypothesis', content: data.hypothesis || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Variables', content: data.variables || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Participants & Sampling', content: data.participants || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Procedure', content: data.procedure || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Statistical Analysis Plan', content: data.statisticalPlan || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Ethical Considerations', content: data.ethics || 'Not specified', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 14. COMPUTATIONAL & AI MODEL SPECIFICATION
  // ============================================================

  generateComputationalModelSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'Computational & AI Model Specification', content: [
        'Researcher: ' + (data.researcherName || 'N/A'),
        'Model Name: ' + (data.modelName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Cognitive Architecture', content: ['Architecture: ' + (data.architecture || 'N/A')] },
      { heading: '2. Cognitive Phenomena Modeled', content: (data.phenomenaModeled || 'Not specified').split('\n') },
      { heading: '3. Model Components', content: (data.modelComponents || 'Not specified').split('\n') },
      { heading: '4. Input / Output Specification', content: (data.ioSpec || 'Not specified').split('\n') },
      { heading: '5. Parameters & Constraints', content: (data.parameters || 'Not specified').split('\n') },
      { heading: '6. Validation Against Human Data', content: (data.validation || 'Not specified').split('\n') },
      { heading: '7. Limitations & Future Work', content: (data.limitations || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Computational Model – ' + (data.modelName || ''), author: data.authorName || '', sections: sections });
  },

  generateComputationalModelSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['COMPUTATIONAL & AI MODEL SPECIFICATION'],
      ['Researcher', data.researcherName || ''],
      ['Model Name', data.modelName || ''],
      ['Architecture', data.architecture || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['COGNITIVE PHENOMENA MODELED'], [data.phenomenaModeled || ''],
      [], ['MODEL COMPONENTS'], [data.modelComponents || ''],
      [], ['INPUT / OUTPUT SPECIFICATION'], [data.ioSpec || ''],
      [], ['PARAMETERS & CONSTRAINTS'], [data.parameters || ''],
      [], ['VALIDATION AGAINST HUMAN DATA'], [data.validation || ''],
      [], ['LIMITATIONS & FUTURE WORK'], [data.limitations || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Model Specification');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateComputationalModelSpecPDF: function(filename, data) {
    var lines = [
      { text: 'COMPUTATIONAL & AI MODEL SPECIFICATION', size: 18, bold: true },
      { text: (data.researcherName || '') + '  |  ' + (data.modelName || ''), size: 12 },
      { text: 'Architecture: ' + (data.architecture || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PHENOMENA MODELED ──', size: 14, bold: true },
      { text: data.phenomenaModeled || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MODEL COMPONENTS ──', size: 14, bold: true },
      { text: data.modelComponents || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INPUT / OUTPUT ──', size: 14, bold: true },
      { text: data.ioSpec || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PARAMETERS & CONSTRAINTS ──', size: 14, bold: true },
      { text: data.parameters || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── VALIDATION ──', size: 14, bold: true },
      { text: data.validation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LIMITATIONS & FUTURE WORK ──', size: 14, bold: true },
      { text: data.limitations || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Computational Model Spec', lines: lines });
  },

  generateComputationalModelSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.researcherName || 'Researcher',
      title: 'Computational & AI Model Specification',
      subtitle: (data.modelName || '') + '  |  ' + (data.architecture || ''),
      perSlide: 2,
      sections: [
        { heading: 'Cognitive Phenomena Modeled', content: data.phenomenaModeled || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Model Components', content: data.modelComponents || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Input / Output Specification', content: data.ioSpec || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Parameters & Constraints', content: data.parameters || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Validation Against Human Data', content: data.validation || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Limitations & Future Work', content: data.limitations || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  }

});
