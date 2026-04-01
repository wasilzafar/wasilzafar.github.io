/**
 * Doc Generator – AI App Development Series
 * Extends DocGenerator with 18 AI app development document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * DocTypes (18):
 *  1. AIAppAnalysis            – AI Application Analysis
 *  2. LLMConfig                – LLM Configuration Document
 *  3. PromptTemplate           – Prompt Template Specification
 *  4. ChainDesign              – Chain Design Document
 *  5. RAGPipeline              – RAG Pipeline Specification
 *  6. MemoryDesign             – Memory System Design
 *  7. AgentSpec                – Agent Specification
 *  8. LangGraphWorkflow        – LangGraph Workflow Design
 *  9. DeepAgentDesign          – Deep Agent Design Document
 * 10. MultiAgentSystem         – Multi-Agent System Design
 * 11. AIPatternDoc             – AI Pattern Documentation
 * 12. FrameworkComparison      – Framework Comparison Analysis
 * 13. LLMOpsConfig             – LLMOps Configuration Document
 * 14. ProductionArchDoc        – Production Architecture Document
 * 15. SafetySpec               – Safety Specification
 * 16. FineTuningPlan           – Fine-Tuning Plan
 * 17. AIAppProject             – AI App Project Document
 * 18. AIFutureAnalysis         – AI Future Analysis
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. AI APPLICATION ANALYSIS
  // ============================================================

  generateAIAppAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'AI Application Analysis', content: [
        'App Name: ' + (data.appName || 'N/A'),
        'App Type: ' + (data.appType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. LLM Provider', content: ['Provider: ' + (data.llmProvider || 'N/A')] },
      { heading: '2. Framework', content: (data.framework || 'Not specified').split('\n') },
      { heading: '3. Architecture', content: (data.architecture || 'Not specified').split('\n') },
      { heading: '4. Data Flow', content: (data.dataFlow || 'Not specified').split('\n') },
      { heading: '5. Challenges', content: (data.challenges || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'AI App Analysis – ' + (data.appName || ''), author: data.authorName || '', sections: sections });
  },

  generateAIAppAnalysisExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['AI APPLICATION ANALYSIS'],
      ['App Name', data.appName || ''],
      ['App Type', data.appType || ''],
      ['LLM Provider', data.llmProvider || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['FRAMEWORK'], [data.framework || ''],
      [], ['ARCHITECTURE'], [data.architecture || ''],
      [], ['DATA FLOW'], [data.dataFlow || ''],
      [], ['CHALLENGES'], [data.challenges || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'AI App Analysis');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAIAppAnalysisPDF: function(filename, data) {
    var lines = [
      { text: 'AI APPLICATION ANALYSIS', size: 18, bold: true },
      { text: (data.appName || '') + '  |  ' + (data.appType || ''), size: 12 },
      { text: 'LLM Provider: ' + (data.llmProvider || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FRAMEWORK ──', size: 14, bold: true },
      { text: data.framework || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ARCHITECTURE ──', size: 14, bold: true },
      { text: data.architecture || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DATA FLOW ──', size: 14, bold: true },
      { text: data.dataFlow || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CHALLENGES ──', size: 14, bold: true },
      { text: data.challenges || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI App Analysis', lines: lines });
  },

  generateAIAppAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.appName || 'AI App',
      title: 'AI Application Analysis',
      subtitle: (data.appType || '') + '  |  ' + (data.llmProvider || ''),
      perSlide: 2,
      sections: [
        { heading: 'Framework', content: data.framework || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Architecture', content: data.architecture || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Data Flow', content: data.dataFlow || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Challenges', content: data.challenges || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 2. LLM CONFIGURATION DOCUMENT
  // ============================================================

  generateLLMConfigWord: async function(filename, data) {
    var sections = [
      { heading: 'LLM Configuration Document', content: [
        'Model Name: ' + (data.modelName || 'N/A'),
        'Provider: ' + (data.provider || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Context Window', content: ['Context Window: ' + (data.contextWindow || 'N/A')] },
      { heading: '2. Temperature', content: ['Temperature: ' + (data.temperature || 'N/A')] },
      { heading: '3. Top P', content: ['Top P: ' + (data.topP || 'N/A')] },
      { heading: '4. Max Tokens', content: ['Max Tokens: ' + (data.maxTokens || 'N/A')] },
      { heading: '5. System Prompt', content: (data.systemPrompt || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'LLM Config – ' + (data.modelName || ''), author: data.authorName || '', sections: sections });
  },

  generateLLMConfigExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['LLM CONFIGURATION DOCUMENT'],
      ['Model Name', data.modelName || ''],
      ['Provider', data.provider || ''],
      ['Context Window', data.contextWindow || ''],
      ['Temperature', data.temperature || ''],
      ['Top P', data.topP || ''],
      ['Max Tokens', data.maxTokens || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['SYSTEM PROMPT'], [data.systemPrompt || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'LLM Config');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateLLMConfigPDF: function(filename, data) {
    var lines = [
      { text: 'LLM CONFIGURATION DOCUMENT', size: 18, bold: true },
      { text: (data.modelName || '') + '  |  ' + (data.provider || ''), size: 12 },
      { text: 'Context Window: ' + (data.contextWindow || '') + '  |  Temperature: ' + (data.temperature || ''), size: 10 },
      { text: 'Top P: ' + (data.topP || '') + '  |  Max Tokens: ' + (data.maxTokens || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SYSTEM PROMPT ──', size: 14, bold: true },
      { text: data.systemPrompt || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'LLM Configuration', lines: lines });
  },

  generateLLMConfigPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.modelName || 'LLM',
      title: 'LLM Configuration Document',
      subtitle: (data.provider || '') + '  |  Context: ' + (data.contextWindow || ''),
      perSlide: 2,
      sections: [
        { heading: 'Temperature: ' + (data.temperature || 'N/A'), content: 'Top P: ' + (data.topP || 'N/A') + '\nMax Tokens: ' + (data.maxTokens || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'System Prompt', content: data.systemPrompt || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 3. PROMPT TEMPLATE SPECIFICATION
  // ============================================================

  generatePromptTemplateWord: async function(filename, data) {
    var sections = [
      { heading: 'Prompt Template Specification', content: [
        'Prompt Name: ' + (data.promptName || 'N/A'),
        'Technique: ' + (data.technique || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Role Prompt', content: (data.rolePrompt || 'Not specified').split('\n') },
      { heading: '2. Few-Shot Examples', content: (data.fewShotExamples || 'Not specified').split('\n') },
      { heading: '3. Output Format', content: (data.outputFormat || 'Not specified').split('\n') },
      { heading: '4. Constraints', content: (data.constraints || 'Not specified').split('\n') },
      { heading: '5. Test Cases', content: (data.testCases || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Prompt Template – ' + (data.promptName || ''), author: data.authorName || '', sections: sections });
  },

  generatePromptTemplateExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PROMPT TEMPLATE SPECIFICATION'],
      ['Prompt Name', data.promptName || ''],
      ['Technique', data.technique || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['ROLE PROMPT'], [data.rolePrompt || ''],
      [], ['FEW-SHOT EXAMPLES'], [data.fewShotExamples || ''],
      [], ['OUTPUT FORMAT'], [data.outputFormat || ''],
      [], ['CONSTRAINTS'], [data.constraints || ''],
      [], ['TEST CASES'], [data.testCases || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Prompt Template');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePromptTemplatePDF: function(filename, data) {
    var lines = [
      { text: 'PROMPT TEMPLATE SPECIFICATION', size: 18, bold: true },
      { text: (data.promptName || '') + '  |  ' + (data.technique || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ROLE PROMPT ──', size: 14, bold: true },
      { text: data.rolePrompt || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FEW-SHOT EXAMPLES ──', size: 14, bold: true },
      { text: data.fewShotExamples || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OUTPUT FORMAT ──', size: 14, bold: true },
      { text: data.outputFormat || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONSTRAINTS ──', size: 14, bold: true },
      { text: data.constraints || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TEST CASES ──', size: 14, bold: true },
      { text: data.testCases || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Prompt Template', lines: lines });
  },

  generatePromptTemplatePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.promptName || 'Prompt',
      title: 'Prompt Template Specification',
      subtitle: (data.technique || ''),
      perSlide: 2,
      sections: [
        { heading: 'Role Prompt', content: data.rolePrompt || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Few-Shot Examples', content: data.fewShotExamples || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Output Format', content: data.outputFormat || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Constraints', content: data.constraints || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Test Cases', content: data.testCases || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 4. CHAIN DESIGN DOCUMENT
  // ============================================================

  generateChainDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Chain Design Document', content: [
        'Chain Name: ' + (data.chainName || 'N/A'),
        'Chain Type: ' + (data.chainType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Steps', content: (data.steps || 'Not specified').split('\n') },
      { heading: '2. Input Schema', content: (data.inputSchema || 'Not specified').split('\n') },
      { heading: '3. Output Schema', content: (data.outputSchema || 'Not specified').split('\n') },
      { heading: '4. Error Handling', content: (data.errorHandling || 'Not specified').split('\n') },
      { heading: '5. Testing', content: (data.testing || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Chain Design – ' + (data.chainName || ''), author: data.authorName || '', sections: sections });
  },

  generateChainDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['CHAIN DESIGN DOCUMENT'],
      ['Chain Name', data.chainName || ''],
      ['Chain Type', data.chainType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['STEPS'], [data.steps || ''],
      [], ['INPUT SCHEMA'], [data.inputSchema || ''],
      [], ['OUTPUT SCHEMA'], [data.outputSchema || ''],
      [], ['ERROR HANDLING'], [data.errorHandling || ''],
      [], ['TESTING'], [data.testing || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Chain Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateChainDesignPDF: function(filename, data) {
    var lines = [
      { text: 'CHAIN DESIGN DOCUMENT', size: 18, bold: true },
      { text: (data.chainName || '') + '  |  ' + (data.chainType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── STEPS ──', size: 14, bold: true },
      { text: data.steps || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INPUT SCHEMA ──', size: 14, bold: true },
      { text: data.inputSchema || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OUTPUT SCHEMA ──', size: 14, bold: true },
      { text: data.outputSchema || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ERROR HANDLING ──', size: 14, bold: true },
      { text: data.errorHandling || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TESTING ──', size: 14, bold: true },
      { text: data.testing || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Chain Design', lines: lines });
  },

  generateChainDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.chainName || 'Chain',
      title: 'Chain Design Document',
      subtitle: (data.chainType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Steps', content: data.steps || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Input Schema', content: data.inputSchema || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Output Schema', content: data.outputSchema || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Error Handling', content: data.errorHandling || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Testing', content: data.testing || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 5. RAG PIPELINE SPECIFICATION
  // ============================================================

  generateRAGPipelineWord: async function(filename, data) {
    var sections = [
      { heading: 'RAG Pipeline Specification', content: [
        'Pipeline Name: ' + (data.pipelineName || 'N/A'),
        'Embedding Model: ' + (data.embeddingModel || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Vector DB', content: ['Vector DB: ' + (data.vectorDB || 'N/A')] },
      { heading: '2. Chunk Strategy', content: (data.chunkStrategy || 'Not specified').split('\n') },
      { heading: '3. Retriever Config', content: (data.retrieverConfig || 'Not specified').split('\n') },
      { heading: '4. Generator Config', content: (data.generatorConfig || 'Not specified').split('\n') },
      { heading: '5. Eval Metrics', content: (data.evalMetrics || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'RAG Pipeline – ' + (data.pipelineName || ''), author: data.authorName || '', sections: sections });
  },

  generateRAGPipelineExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['RAG PIPELINE SPECIFICATION'],
      ['Pipeline Name', data.pipelineName || ''],
      ['Embedding Model', data.embeddingModel || ''],
      ['Vector DB', data.vectorDB || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CHUNK STRATEGY'], [data.chunkStrategy || ''],
      [], ['RETRIEVER CONFIG'], [data.retrieverConfig || ''],
      [], ['GENERATOR CONFIG'], [data.generatorConfig || ''],
      [], ['EVAL METRICS'], [data.evalMetrics || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'RAG Pipeline');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateRAGPipelinePDF: function(filename, data) {
    var lines = [
      { text: 'RAG PIPELINE SPECIFICATION', size: 18, bold: true },
      { text: (data.pipelineName || '') + '  |  ' + (data.embeddingModel || ''), size: 12 },
      { text: 'Vector DB: ' + (data.vectorDB || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CHUNK STRATEGY ──', size: 14, bold: true },
      { text: data.chunkStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RETRIEVER CONFIG ──', size: 14, bold: true },
      { text: data.retrieverConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GENERATOR CONFIG ──', size: 14, bold: true },
      { text: data.generatorConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVAL METRICS ──', size: 14, bold: true },
      { text: data.evalMetrics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'RAG Pipeline', lines: lines });
  },

  generateRAGPipelinePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.pipelineName || 'RAG Pipeline',
      title: 'RAG Pipeline Specification',
      subtitle: (data.embeddingModel || '') + '  |  ' + (data.vectorDB || ''),
      perSlide: 2,
      sections: [
        { heading: 'Chunk Strategy', content: data.chunkStrategy || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Retriever Config', content: data.retrieverConfig || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Generator Config', content: data.generatorConfig || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Eval Metrics', content: data.evalMetrics || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 6. MEMORY SYSTEM DESIGN
  // ============================================================

  generateMemoryDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Memory System Design', content: [
        'System Name: ' + (data.systemName || 'N/A'),
        'Memory Type: ' + (data.memoryType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Storage Backend', content: (data.storageBackend || 'Not specified').split('\n') },
      { heading: '2. Context Window', content: (data.contextWindow || 'Not specified').split('\n') },
      { heading: '3. Compression Strategy', content: (data.compressionStrategy || 'Not specified').split('\n') },
      { heading: '4. Persistence Config', content: (data.persistenceConfig || 'Not specified').split('\n') },
      { heading: '5. Scalability', content: (data.scalability || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Memory Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateMemoryDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['MEMORY SYSTEM DESIGN'],
      ['System Name', data.systemName || ''],
      ['Memory Type', data.memoryType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['STORAGE BACKEND'], [data.storageBackend || ''],
      [], ['CONTEXT WINDOW'], [data.contextWindow || ''],
      [], ['COMPRESSION STRATEGY'], [data.compressionStrategy || ''],
      [], ['PERSISTENCE CONFIG'], [data.persistenceConfig || ''],
      [], ['SCALABILITY'], [data.scalability || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Memory Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMemoryDesignPDF: function(filename, data) {
    var lines = [
      { text: 'MEMORY SYSTEM DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.memoryType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── STORAGE BACKEND ──', size: 14, bold: true },
      { text: data.storageBackend || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONTEXT WINDOW ──', size: 14, bold: true },
      { text: data.contextWindow || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPRESSION STRATEGY ──', size: 14, bold: true },
      { text: data.compressionStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERSISTENCE CONFIG ──', size: 14, bold: true },
      { text: data.persistenceConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SCALABILITY ──', size: 14, bold: true },
      { text: data.scalability || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Memory System Design', lines: lines });
  },

  generateMemoryDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'Memory System',
      title: 'Memory System Design',
      subtitle: (data.memoryType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Storage Backend', content: data.storageBackend || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Context Window', content: data.contextWindow || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Compression Strategy', content: data.compressionStrategy || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Persistence Config', content: data.persistenceConfig || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Scalability', content: data.scalability || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 7. AGENT SPECIFICATION
  // ============================================================

  generateAgentSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'Agent Specification', content: [
        'Agent Name: ' + (data.agentName || 'N/A'),
        'Agent Type: ' + (data.agentType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Tools', content: (data.tools || 'Not specified').split('\n') },
      { heading: '2. Decision Logic', content: (data.decisionLogic || 'Not specified').split('\n') },
      { heading: '3. Fallback Strategy', content: (data.fallbackStrategy || 'Not specified').split('\n') },
      { heading: '4. Max Iterations', content: ['Max Iterations: ' + (data.maxIterations || 'N/A')] },
      { heading: '5. Safety Guards', content: (data.safetyGuards || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Agent Spec – ' + (data.agentName || ''), author: data.authorName || '', sections: sections });
  },

  generateAgentSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['AGENT SPECIFICATION'],
      ['Agent Name', data.agentName || ''],
      ['Agent Type', data.agentType || ''],
      ['Max Iterations', data.maxIterations || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['TOOLS'], [data.tools || ''],
      [], ['DECISION LOGIC'], [data.decisionLogic || ''],
      [], ['FALLBACK STRATEGY'], [data.fallbackStrategy || ''],
      [], ['SAFETY GUARDS'], [data.safetyGuards || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Agent Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAgentSpecPDF: function(filename, data) {
    var lines = [
      { text: 'AGENT SPECIFICATION', size: 18, bold: true },
      { text: (data.agentName || '') + '  |  ' + (data.agentType || ''), size: 12 },
      { text: 'Max Iterations: ' + (data.maxIterations || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TOOLS ──', size: 14, bold: true },
      { text: data.tools || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DECISION LOGIC ──', size: 14, bold: true },
      { text: data.decisionLogic || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FALLBACK STRATEGY ──', size: 14, bold: true },
      { text: data.fallbackStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SAFETY GUARDS ──', size: 14, bold: true },
      { text: data.safetyGuards || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Agent Specification', lines: lines });
  },

  generateAgentSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.agentName || 'Agent',
      title: 'Agent Specification',
      subtitle: (data.agentType || '') + '  |  Max Iterations: ' + (data.maxIterations || ''),
      perSlide: 2,
      sections: [
        { heading: 'Tools', content: data.tools || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Decision Logic', content: data.decisionLogic || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Fallback Strategy', content: data.fallbackStrategy || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Safety Guards', content: data.safetyGuards || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 8. LANGGRAPH WORKFLOW DESIGN
  // ============================================================

  generateLangGraphWorkflowWord: async function(filename, data) {
    var sections = [
      { heading: 'LangGraph Workflow Design', content: [
        'Workflow Name: ' + (data.workflowName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Nodes', content: (data.nodes || 'Not specified').split('\n') },
      { heading: '2. Edges', content: (data.edges || 'Not specified').split('\n') },
      { heading: '3. State Schema', content: (data.stateSchema || 'Not specified').split('\n') },
      { heading: '4. Checkpointing', content: (data.checkpointing || 'Not specified').split('\n') },
      { heading: '5. Human-in-the-Loop', content: (data.humanInLoop || 'Not specified').split('\n') },
      { heading: '6. Error Recovery', content: (data.errorRecovery || 'Not specified').split('\n') },
      { heading: '7. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'LangGraph Workflow – ' + (data.workflowName || ''), author: data.authorName || '', sections: sections });
  },

  generateLangGraphWorkflowExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['LANGGRAPH WORKFLOW DESIGN'],
      ['Workflow Name', data.workflowName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['NODES'], [data.nodes || ''],
      [], ['EDGES'], [data.edges || ''],
      [], ['STATE SCHEMA'], [data.stateSchema || ''],
      [], ['CHECKPOINTING'], [data.checkpointing || ''],
      [], ['HUMAN-IN-THE-LOOP'], [data.humanInLoop || ''],
      [], ['ERROR RECOVERY'], [data.errorRecovery || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'LangGraph Workflow');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateLangGraphWorkflowPDF: function(filename, data) {
    var lines = [
      { text: 'LANGGRAPH WORKFLOW DESIGN', size: 18, bold: true },
      { text: (data.workflowName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── NODES ──', size: 14, bold: true },
      { text: data.nodes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EDGES ──', size: 14, bold: true },
      { text: data.edges || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STATE SCHEMA ──', size: 14, bold: true },
      { text: data.stateSchema || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CHECKPOINTING ──', size: 14, bold: true },
      { text: data.checkpointing || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HUMAN-IN-THE-LOOP ──', size: 14, bold: true },
      { text: data.humanInLoop || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ERROR RECOVERY ──', size: 14, bold: true },
      { text: data.errorRecovery || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'LangGraph Workflow', lines: lines });
  },

  generateLangGraphWorkflowPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.workflowName || 'Workflow',
      title: 'LangGraph Workflow Design',
      subtitle: '',
      perSlide: 2,
      sections: [
        { heading: 'Nodes', content: data.nodes || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Edges', content: data.edges || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'State Schema', content: data.stateSchema || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Checkpointing', content: data.checkpointing || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Human-in-the-Loop', content: data.humanInLoop || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Error Recovery', content: data.errorRecovery || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 9. DEEP AGENT DESIGN DOCUMENT
  // ============================================================

  generateDeepAgentDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Deep Agent Design Document', content: [
        'Agent Name: ' + (data.agentName || 'N/A'),
        'Planning Strategy: ' + (data.planningStrategy || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Reflection Loop', content: (data.reflectionLoop || 'Not specified').split('\n') },
      { heading: '2. Tool Orchestration', content: (data.toolOrchestration || 'Not specified').split('\n') },
      { heading: '3. Memory Integration', content: (data.memoryIntegration || 'Not specified').split('\n') },
      { heading: '4. Autonomy Level', content: (data.autonomyLevel || 'Not specified').split('\n') },
      { heading: '5. Safety Bounds', content: (data.safetyBounds || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Deep Agent Design – ' + (data.agentName || ''), author: data.authorName || '', sections: sections });
  },

  generateDeepAgentDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['DEEP AGENT DESIGN DOCUMENT'],
      ['Agent Name', data.agentName || ''],
      ['Planning Strategy', data.planningStrategy || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['REFLECTION LOOP'], [data.reflectionLoop || ''],
      [], ['TOOL ORCHESTRATION'], [data.toolOrchestration || ''],
      [], ['MEMORY INTEGRATION'], [data.memoryIntegration || ''],
      [], ['AUTONOMY LEVEL'], [data.autonomyLevel || ''],
      [], ['SAFETY BOUNDS'], [data.safetyBounds || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Deep Agent Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDeepAgentDesignPDF: function(filename, data) {
    var lines = [
      { text: 'DEEP AGENT DESIGN DOCUMENT', size: 18, bold: true },
      { text: (data.agentName || '') + '  |  ' + (data.planningStrategy || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── REFLECTION LOOP ──', size: 14, bold: true },
      { text: data.reflectionLoop || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TOOL ORCHESTRATION ──', size: 14, bold: true },
      { text: data.toolOrchestration || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MEMORY INTEGRATION ──', size: 14, bold: true },
      { text: data.memoryIntegration || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── AUTONOMY LEVEL ──', size: 14, bold: true },
      { text: data.autonomyLevel || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SAFETY BOUNDS ──', size: 14, bold: true },
      { text: data.safetyBounds || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Deep Agent Design', lines: lines });
  },

  generateDeepAgentDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.agentName || 'Deep Agent',
      title: 'Deep Agent Design Document',
      subtitle: (data.planningStrategy || ''),
      perSlide: 2,
      sections: [
        { heading: 'Reflection Loop', content: data.reflectionLoop || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Tool Orchestration', content: data.toolOrchestration || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Memory Integration', content: data.memoryIntegration || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Autonomy Level', content: data.autonomyLevel || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Safety Bounds', content: data.safetyBounds || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 10. MULTI-AGENT SYSTEM DESIGN
  // ============================================================

  generateMultiAgentSystemWord: async function(filename, data) {
    var sections = [
      { heading: 'Multi-Agent System Design', content: [
        'System Name: ' + (data.systemName || 'N/A'),
        'Orchestration Type: ' + (data.orchestrationType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Agents', content: (data.agents || 'Not specified').split('\n') },
      { heading: '2. Communication Protocol', content: (data.communicationProtocol || 'Not specified').split('\n') },
      { heading: '3. Task Delegation', content: (data.taskDelegation || 'Not specified').split('\n') },
      { heading: '4. Conflict Resolution', content: (data.conflictResolution || 'Not specified').split('\n') },
      { heading: '5. Scalability', content: (data.scalability || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Multi-Agent System – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateMultiAgentSystemExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['MULTI-AGENT SYSTEM DESIGN'],
      ['System Name', data.systemName || ''],
      ['Orchestration Type', data.orchestrationType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['AGENTS'], [data.agents || ''],
      [], ['COMMUNICATION PROTOCOL'], [data.communicationProtocol || ''],
      [], ['TASK DELEGATION'], [data.taskDelegation || ''],
      [], ['CONFLICT RESOLUTION'], [data.conflictResolution || ''],
      [], ['SCALABILITY'], [data.scalability || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Multi-Agent System');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMultiAgentSystemPDF: function(filename, data) {
    var lines = [
      { text: 'MULTI-AGENT SYSTEM DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.orchestrationType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── AGENTS ──', size: 14, bold: true },
      { text: data.agents || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMMUNICATION PROTOCOL ──', size: 14, bold: true },
      { text: data.communicationProtocol || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TASK DELEGATION ──', size: 14, bold: true },
      { text: data.taskDelegation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONFLICT RESOLUTION ──', size: 14, bold: true },
      { text: data.conflictResolution || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SCALABILITY ──', size: 14, bold: true },
      { text: data.scalability || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Multi-Agent System', lines: lines });
  },

  generateMultiAgentSystemPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'Multi-Agent',
      title: 'Multi-Agent System Design',
      subtitle: (data.orchestrationType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Agents', content: data.agents || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Communication Protocol', content: data.communicationProtocol || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Task Delegation', content: data.taskDelegation || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Conflict Resolution', content: data.conflictResolution || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Scalability', content: data.scalability || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 11. AI PATTERN DOCUMENTATION
  // ============================================================

  generateAIPatternDocWord: async function(filename, data) {
    var sections = [
      { heading: 'AI Pattern Documentation', content: [
        'Pattern Name: ' + (data.patternName || 'N/A'),
        'Pattern Type: ' + (data.patternType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Use Cases', content: (data.useCases || 'Not specified').split('\n') },
      { heading: '2. Components', content: (data.components || 'Not specified').split('\n') },
      { heading: '3. Data Flow', content: (data.dataFlow || 'Not specified').split('\n') },
      { heading: '4. Tradeoffs', content: (data.tradeoffs || 'Not specified').split('\n') },
      { heading: '5. Implementation', content: (data.implementation || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'AI Pattern – ' + (data.patternName || ''), author: data.authorName || '', sections: sections });
  },

  generateAIPatternDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['AI PATTERN DOCUMENTATION'],
      ['Pattern Name', data.patternName || ''],
      ['Pattern Type', data.patternType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['USE CASES'], [data.useCases || ''],
      [], ['COMPONENTS'], [data.components || ''],
      [], ['DATA FLOW'], [data.dataFlow || ''],
      [], ['TRADEOFFS'], [data.tradeoffs || ''],
      [], ['IMPLEMENTATION'], [data.implementation || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'AI Pattern');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAIPatternDocPDF: function(filename, data) {
    var lines = [
      { text: 'AI PATTERN DOCUMENTATION', size: 18, bold: true },
      { text: (data.patternName || '') + '  |  ' + (data.patternType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── USE CASES ──', size: 14, bold: true },
      { text: data.useCases || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPONENTS ──', size: 14, bold: true },
      { text: data.components || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DATA FLOW ──', size: 14, bold: true },
      { text: data.dataFlow || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRADEOFFS ──', size: 14, bold: true },
      { text: data.tradeoffs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── IMPLEMENTATION ──', size: 14, bold: true },
      { text: data.implementation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI Pattern Documentation', lines: lines });
  },

  generateAIPatternDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.patternName || 'AI Pattern',
      title: 'AI Pattern Documentation',
      subtitle: (data.patternType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Use Cases', content: data.useCases || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Components', content: data.components || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Data Flow', content: data.dataFlow || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Tradeoffs', content: data.tradeoffs || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Implementation', content: data.implementation || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 12. FRAMEWORK COMPARISON ANALYSIS
  // ============================================================

  generateFrameworkComparisonWord: async function(filename, data) {
    var sections = [
      { heading: 'Framework Comparison Analysis', content: [
        'Comparison Name: ' + (data.comparisonName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Frameworks', content: (data.frameworks || 'Not specified').split('\n') },
      { heading: '2. Criteria', content: (data.criteria || 'Not specified').split('\n') },
      { heading: '3. Strengths', content: (data.strengths || 'Not specified').split('\n') },
      { heading: '4. Weaknesses', content: (data.weaknesses || 'Not specified').split('\n') },
      { heading: '5. Use Case', content: (data.useCase || 'Not specified').split('\n') },
      { heading: '6. Recommendation', content: (data.recommendation || 'Not specified').split('\n') },
      { heading: '7. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Framework Comparison – ' + (data.comparisonName || ''), author: data.authorName || '', sections: sections });
  },

  generateFrameworkComparisonExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['FRAMEWORK COMPARISON ANALYSIS'],
      ['Comparison Name', data.comparisonName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['FRAMEWORKS'], [data.frameworks || ''],
      [], ['CRITERIA'], [data.criteria || ''],
      [], ['STRENGTHS'], [data.strengths || ''],
      [], ['WEAKNESSES'], [data.weaknesses || ''],
      [], ['USE CASE'], [data.useCase || ''],
      [], ['RECOMMENDATION'], [data.recommendation || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Framework Comparison');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateFrameworkComparisonPDF: function(filename, data) {
    var lines = [
      { text: 'FRAMEWORK COMPARISON ANALYSIS', size: 18, bold: true },
      { text: (data.comparisonName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FRAMEWORKS ──', size: 14, bold: true },
      { text: data.frameworks || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CRITERIA ──', size: 14, bold: true },
      { text: data.criteria || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STRENGTHS ──', size: 14, bold: true },
      { text: data.strengths || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── WEAKNESSES ──', size: 14, bold: true },
      { text: data.weaknesses || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── USE CASE ──', size: 14, bold: true },
      { text: data.useCase || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RECOMMENDATION ──', size: 14, bold: true },
      { text: data.recommendation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Framework Comparison', lines: lines });
  },

  generateFrameworkComparisonPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.comparisonName || 'Comparison',
      title: 'Framework Comparison Analysis',
      subtitle: '',
      perSlide: 2,
      sections: [
        { heading: 'Frameworks', content: data.frameworks || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Criteria', content: data.criteria || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Strengths', content: data.strengths || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Weaknesses', content: data.weaknesses || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Use Case', content: data.useCase || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Recommendation', content: data.recommendation || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 13. LLMOPS CONFIGURATION DOCUMENT
  // ============================================================

  generateLLMOpsConfigWord: async function(filename, data) {
    var sections = [
      { heading: 'LLMOps Configuration Document', content: [
        'System Name: ' + (data.systemName || 'N/A'),
        'Eval Framework: ' + (data.evalFramework || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Tracing Tool', content: (data.tracingTool || 'Not specified').split('\n') },
      { heading: '2. Metrics', content: (data.metrics || 'Not specified').split('\n') },
      { heading: '3. Alerting', content: (data.alerting || 'Not specified').split('\n') },
      { heading: '4. Experiment Tracking', content: (data.experimentTracking || 'Not specified').split('\n') },
      { heading: '5. CI/CD', content: (data.cicd || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'LLMOps Config – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateLLMOpsConfigExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['LLMOPS CONFIGURATION DOCUMENT'],
      ['System Name', data.systemName || ''],
      ['Eval Framework', data.evalFramework || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['TRACING TOOL'], [data.tracingTool || ''],
      [], ['METRICS'], [data.metrics || ''],
      [], ['ALERTING'], [data.alerting || ''],
      [], ['EXPERIMENT TRACKING'], [data.experimentTracking || ''],
      [], ['CI/CD'], [data.cicd || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'LLMOps Config');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateLLMOpsConfigPDF: function(filename, data) {
    var lines = [
      { text: 'LLMOPS CONFIGURATION DOCUMENT', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.evalFramework || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TRACING TOOL ──', size: 14, bold: true },
      { text: data.tracingTool || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── METRICS ──', size: 14, bold: true },
      { text: data.metrics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ALERTING ──', size: 14, bold: true },
      { text: data.alerting || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EXPERIMENT TRACKING ──', size: 14, bold: true },
      { text: data.experimentTracking || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CI/CD ──', size: 14, bold: true },
      { text: data.cicd || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'LLMOps Configuration', lines: lines });
  },

  generateLLMOpsConfigPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'LLMOps',
      title: 'LLMOps Configuration Document',
      subtitle: (data.evalFramework || ''),
      perSlide: 2,
      sections: [
        { heading: 'Tracing Tool', content: data.tracingTool || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Metrics', content: data.metrics || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Alerting', content: data.alerting || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Experiment Tracking', content: data.experimentTracking || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'CI/CD', content: data.cicd || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 14. PRODUCTION ARCHITECTURE DOCUMENT
  // ============================================================

  generateProductionArchDocWord: async function(filename, data) {
    var sections = [
      { heading: 'Production Architecture Document', content: [
        'System Name: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. API Design', content: (data.apiDesign || 'Not specified').split('\n') },
      { heading: '2. Queue Config', content: (data.queueConfig || 'Not specified').split('\n') },
      { heading: '3. Caching Strategy', content: (data.cachingStrategy || 'Not specified').split('\n') },
      { heading: '4. Scaling Plan', content: (data.scalingPlan || 'Not specified').split('\n') },
      { heading: '5. Cost Optimization', content: (data.costOptimization || 'Not specified').split('\n') },
      { heading: '6. Monitoring', content: (data.monitoring || 'Not specified').split('\n') },
      { heading: '7. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Production Arch – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateProductionArchDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PRODUCTION ARCHITECTURE DOCUMENT'],
      ['System Name', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['API DESIGN'], [data.apiDesign || ''],
      [], ['QUEUE CONFIG'], [data.queueConfig || ''],
      [], ['CACHING STRATEGY'], [data.cachingStrategy || ''],
      [], ['SCALING PLAN'], [data.scalingPlan || ''],
      [], ['COST OPTIMIZATION'], [data.costOptimization || ''],
      [], ['MONITORING'], [data.monitoring || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Production Arch');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateProductionArchDocPDF: function(filename, data) {
    var lines = [
      { text: 'PRODUCTION ARCHITECTURE DOCUMENT', size: 18, bold: true },
      { text: (data.systemName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── API DESIGN ──', size: 14, bold: true },
      { text: data.apiDesign || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── QUEUE CONFIG ──', size: 14, bold: true },
      { text: data.queueConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CACHING STRATEGY ──', size: 14, bold: true },
      { text: data.cachingStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SCALING PLAN ──', size: 14, bold: true },
      { text: data.scalingPlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COST OPTIMIZATION ──', size: 14, bold: true },
      { text: data.costOptimization || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MONITORING ──', size: 14, bold: true },
      { text: data.monitoring || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Production Architecture', lines: lines });
  },

  generateProductionArchDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Production Architecture Document',
      subtitle: '',
      perSlide: 2,
      sections: [
        { heading: 'API Design', content: data.apiDesign || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Queue Config', content: data.queueConfig || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Caching Strategy', content: data.cachingStrategy || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Scaling Plan', content: data.scalingPlan || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Cost Optimization', content: data.costOptimization || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Monitoring', content: data.monitoring || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 15. SAFETY SPECIFICATION
  // ============================================================

  generateSafetySpecWord: async function(filename, data) {
    var sections = [
      { heading: 'Safety Specification', content: [
        'System Name: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Guardrails', content: (data.guardrails || 'Not specified').split('\n') },
      { heading: '2. Input Filters', content: (data.inputFilters || 'Not specified').split('\n') },
      { heading: '3. Output Validation', content: (data.outputValidation || 'Not specified').split('\n') },
      { heading: '4. Hallucination Mitigation', content: (data.hallucinationMitigation || 'Not specified').split('\n') },
      { heading: '5. Prompt Injection Defense', content: (data.promptInjectionDefense || 'Not specified').split('\n') },
      { heading: '6. Privacy Policy', content: (data.privacyPolicy || 'Not specified').split('\n') },
      { heading: '7. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Safety Spec – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateSafetySpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['SAFETY SPECIFICATION'],
      ['System Name', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['GUARDRAILS'], [data.guardrails || ''],
      [], ['INPUT FILTERS'], [data.inputFilters || ''],
      [], ['OUTPUT VALIDATION'], [data.outputValidation || ''],
      [], ['HALLUCINATION MITIGATION'], [data.hallucinationMitigation || ''],
      [], ['PROMPT INJECTION DEFENSE'], [data.promptInjectionDefense || ''],
      [], ['PRIVACY POLICY'], [data.privacyPolicy || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Safety Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSafetySpecPDF: function(filename, data) {
    var lines = [
      { text: 'SAFETY SPECIFICATION', size: 18, bold: true },
      { text: (data.systemName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── GUARDRAILS ──', size: 14, bold: true },
      { text: data.guardrails || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INPUT FILTERS ──', size: 14, bold: true },
      { text: data.inputFilters || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OUTPUT VALIDATION ──', size: 14, bold: true },
      { text: data.outputValidation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HALLUCINATION MITIGATION ──', size: 14, bold: true },
      { text: data.hallucinationMitigation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROMPT INJECTION DEFENSE ──', size: 14, bold: true },
      { text: data.promptInjectionDefense || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PRIVACY POLICY ──', size: 14, bold: true },
      { text: data.privacyPolicy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Safety Specification', lines: lines });
  },

  generateSafetySpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Safety Specification',
      subtitle: '',
      perSlide: 2,
      sections: [
        { heading: 'Guardrails', content: data.guardrails || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Input Filters', content: data.inputFilters || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Output Validation', content: data.outputValidation || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Hallucination Mitigation', content: data.hallucinationMitigation || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Prompt Injection Defense', content: data.promptInjectionDefense || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Privacy Policy', content: data.privacyPolicy || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 16. FINE-TUNING PLAN
  // ============================================================

  generateFineTuningPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'Fine-Tuning Plan', content: [
        'Model Name: ' + (data.modelName || 'N/A'),
        'Base Model: ' + (data.baseModel || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Dataset', content: (data.dataset || 'Not specified').split('\n') },
      { heading: '2. Training Config', content: (data.trainingConfig || 'Not specified').split('\n') },
      { heading: '3. Eval Strategy', content: (data.evalStrategy || 'Not specified').split('\n') },
      { heading: '4. Deployment Plan', content: (data.deploymentPlan || 'Not specified').split('\n') },
      { heading: '5. Cost Estimate', content: (data.costEstimate || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Fine-Tuning Plan – ' + (data.modelName || ''), author: data.authorName || '', sections: sections });
  },

  generateFineTuningPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['FINE-TUNING PLAN'],
      ['Model Name', data.modelName || ''],
      ['Base Model', data.baseModel || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['DATASET'], [data.dataset || ''],
      [], ['TRAINING CONFIG'], [data.trainingConfig || ''],
      [], ['EVAL STRATEGY'], [data.evalStrategy || ''],
      [], ['DEPLOYMENT PLAN'], [data.deploymentPlan || ''],
      [], ['COST ESTIMATE'], [data.costEstimate || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Fine-Tuning Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateFineTuningPlanPDF: function(filename, data) {
    var lines = [
      { text: 'FINE-TUNING PLAN', size: 18, bold: true },
      { text: (data.modelName || '') + '  |  Base: ' + (data.baseModel || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DATASET ──', size: 14, bold: true },
      { text: data.dataset || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRAINING CONFIG ──', size: 14, bold: true },
      { text: data.trainingConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVAL STRATEGY ──', size: 14, bold: true },
      { text: data.evalStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEPLOYMENT PLAN ──', size: 14, bold: true },
      { text: data.deploymentPlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COST ESTIMATE ──', size: 14, bold: true },
      { text: data.costEstimate || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Fine-Tuning Plan', lines: lines });
  },

  generateFineTuningPlanPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.modelName || 'Model',
      title: 'Fine-Tuning Plan',
      subtitle: 'Base: ' + (data.baseModel || ''),
      perSlide: 2,
      sections: [
        { heading: 'Dataset', content: data.dataset || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Training Config', content: data.trainingConfig || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Eval Strategy', content: data.evalStrategy || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Deployment Plan', content: data.deploymentPlan || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Cost Estimate', content: data.costEstimate || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 17. AI APP PROJECT DOCUMENT
  // ============================================================

  generateAIAppProjectWord: async function(filename, data) {
    var sections = [
      { heading: 'AI App Project Document', content: [
        'Project Name: ' + (data.projectName || 'N/A'),
        'Project Type: ' + (data.projectType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Tech Stack', content: (data.techStack || 'Not specified').split('\n') },
      { heading: '2. LLM Orchestration', content: (data.llmOrchestration || 'Not specified').split('\n') },
      { heading: '3. Frontend', content: (data.frontend || 'Not specified').split('\n') },
      { heading: '4. Backend', content: (data.backend || 'Not specified').split('\n') },
      { heading: '5. Deployment', content: (data.deployment || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'AI App Project – ' + (data.projectName || ''), author: data.authorName || '', sections: sections });
  },

  generateAIAppProjectExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['AI APP PROJECT DOCUMENT'],
      ['Project Name', data.projectName || ''],
      ['Project Type', data.projectType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['TECH STACK'], [data.techStack || ''],
      [], ['LLM ORCHESTRATION'], [data.llmOrchestration || ''],
      [], ['FRONTEND'], [data.frontend || ''],
      [], ['BACKEND'], [data.backend || ''],
      [], ['DEPLOYMENT'], [data.deployment || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'AI App Project');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAIAppProjectPDF: function(filename, data) {
    var lines = [
      { text: 'AI APP PROJECT DOCUMENT', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.projectType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TECH STACK ──', size: 14, bold: true },
      { text: data.techStack || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LLM ORCHESTRATION ──', size: 14, bold: true },
      { text: data.llmOrchestration || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FRONTEND ──', size: 14, bold: true },
      { text: data.frontend || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BACKEND ──', size: 14, bold: true },
      { text: data.backend || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEPLOYMENT ──', size: 14, bold: true },
      { text: data.deployment || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI App Project', lines: lines });
  },

  generateAIAppProjectPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'AI App Project Document',
      subtitle: (data.projectType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Tech Stack', content: data.techStack || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'LLM Orchestration', content: data.llmOrchestration || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Frontend', content: data.frontend || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Backend', content: data.backend || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Deployment', content: data.deployment || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 18. AI FUTURE ANALYSIS
  // ============================================================

  generateAIFutureAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'AI Future Analysis', content: [
        'Trend Name: ' + (data.trendName || 'N/A'),
        'Trend Category: ' + (data.trendCategory || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Current State', content: (data.currentState || 'Not specified').split('\n') },
      { heading: '2. Projected Impact', content: (data.projectedImpact || 'Not specified').split('\n') },
      { heading: '3. Key Players', content: (data.keyPlayers || 'Not specified').split('\n') },
      { heading: '4. Timeline', content: (data.timeline || 'Not specified').split('\n') },
      { heading: '5. Risks', content: (data.risks || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'AI Future Analysis – ' + (data.trendName || ''), author: data.authorName || '', sections: sections });
  },

  generateAIFutureAnalysisExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['AI FUTURE ANALYSIS'],
      ['Trend Name', data.trendName || ''],
      ['Trend Category', data.trendCategory || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CURRENT STATE'], [data.currentState || ''],
      [], ['PROJECTED IMPACT'], [data.projectedImpact || ''],
      [], ['KEY PLAYERS'], [data.keyPlayers || ''],
      [], ['TIMELINE'], [data.timeline || ''],
      [], ['RISKS'], [data.risks || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'AI Future Analysis');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAIFutureAnalysisPDF: function(filename, data) {
    var lines = [
      { text: 'AI FUTURE ANALYSIS', size: 18, bold: true },
      { text: (data.trendName || '') + '  |  ' + (data.trendCategory || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CURRENT STATE ──', size: 14, bold: true },
      { text: data.currentState || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROJECTED IMPACT ──', size: 14, bold: true },
      { text: data.projectedImpact || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY PLAYERS ──', size: 14, bold: true },
      { text: data.keyPlayers || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TIMELINE ──', size: 14, bold: true },
      { text: data.timeline || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RISKS ──', size: 14, bold: true },
      { text: data.risks || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI Future Analysis', lines: lines });
  },

  generateAIFutureAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.trendName || 'Trend',
      title: 'AI Future Analysis',
      subtitle: (data.trendCategory || ''),
      perSlide: 2,
      sections: [
        { heading: 'Current State', content: data.currentState || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Projected Impact', content: data.projectedImpact || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Key Players', content: data.keyPlayers || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Timeline', content: data.timeline || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Risks', content: data.risks || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  }

});
