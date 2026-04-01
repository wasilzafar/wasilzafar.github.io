/**
 * Doc Generator – Unity Game Engine Series
 * Extends DocGenerator with 16 Unity game engine document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * DocTypes (16):
 *  1. UnityProjectSetup     – Project Setup Document
 *  2. CSharpScriptDoc       – C# Script Documentation
 *  3. GameObjectSpec         – GameObject Specification
 *  4. PhysicsConfig          – Physics Configuration Document
 *  5. UIDesignSpec           – UI Design Specification
 *  6. AnimationDoc           – Animation Documentation
 *  7. AudioDesignDoc         – Audio Design Document
 *  8. BuildChecklist         – Build & Publish Checklist
 *  9. RenderPipelineDoc      – Render Pipeline Documentation
 * 10. DOTSArchDoc            – DOTS Architecture Document
 * 11. AIDesignDoc            – AI Design Document
 * 12. NetworkingSpec         – Networking Specification
 * 13. EditorToolSpec         – Editor Tool Specification
 * 14. ArchitectureDoc        – Architecture Document
 * 15. PerfOptReport          – Performance Optimization Report
 * 16. ProductionPlan         – Production Plan
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. UNITY PROJECT SETUP
  // ============================================================

  generateUnityProjectSetupWord: async function(filename, data) {
    var sections = [
      { heading: 'Unity Project Setup Document', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Team: ' + (data.teamName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Game Genre', content: ['Genre: ' + (data.gameGenre || 'N/A')] },
      { heading: '2. Target Platform', content: ['Platform: ' + (data.targetPlatform || 'N/A')] },
      { heading: '3. Render Pipeline', content: ['Pipeline: ' + (data.renderPipeline || 'N/A')] },
      { heading: '4. Unity Version', content: ['Version: ' + (data.unityVersion || 'N/A')] },
      { heading: '5. Folder Structure', content: (data.folderStructure || 'Not specified').split('\n') },
      { heading: '6. Scene List', content: (data.sceneList || 'Not specified').split('\n') },
      { heading: '7. Plugins', content: (data.plugins || 'Not specified').split('\n') },
      { heading: '8. Coding Conventions', content: (data.codingConventions || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Unity Project Setup – ' + (data.projectName || ''), author: data.teamName || '', sections: sections });
  },

  generateUnityProjectSetupExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['UNITY PROJECT SETUP DOCUMENT'],
      ['Project', data.projectName || ''],
      ['Team', data.teamName || ''],
      ['Game Genre', data.gameGenre || ''],
      ['Target Platform', data.targetPlatform || ''],
      ['Render Pipeline', data.renderPipeline || ''],
      ['Unity Version', data.unityVersion || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['FOLDER STRUCTURE'],
      [data.folderStructure || ''],
      [],
      ['SCENE LIST'],
      [data.sceneList || ''],
      [],
      ['PLUGINS'],
      [data.plugins || ''],
      [],
      ['CODING CONVENTIONS'],
      [data.codingConventions || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Project Setup');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateUnityProjectSetupPDF: function(filename, data) {
    var lines = [
      { text: 'UNITY PROJECT SETUP DOCUMENT', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.teamName || ''), size: 12 },
      { text: 'Genre: ' + (data.gameGenre || '') + '  |  Platform: ' + (data.targetPlatform || ''), size: 10 },
      { text: 'Pipeline: ' + (data.renderPipeline || '') + '  |  Version: ' + (data.unityVersion || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FOLDER STRUCTURE ──', size: 14, bold: true },
      { text: data.folderStructure || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SCENE LIST ──', size: 14, bold: true },
      { text: data.sceneList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PLUGINS ──', size: 14, bold: true },
      { text: data.plugins || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CODING CONVENTIONS ──', size: 14, bold: true },
      { text: data.codingConventions || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Unity Project Setup', lines: lines });
  },

  generateUnityProjectSetupPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Unity Project Setup',
      subtitle: (data.teamName || '') + '  |  ' + (data.gameGenre || ''),
      perSlide: 2,
      sections: [
        { heading: 'Target Platform', content: data.targetPlatform || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Render Pipeline & Version', content: (data.renderPipeline || '') + '\n' + (data.unityVersion || ''), color: DocStyles.colors.blue },
        { heading: 'Folder Structure', content: data.folderStructure || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Scene List', content: data.sceneList || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Plugins', content: data.plugins || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Coding Conventions', content: data.codingConventions || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 2. C# SCRIPT DOCUMENTATION
  // ============================================================

  generateCSharpScriptDocWord: async function(filename, data) {
    var sections = [
      { heading: 'C# Script Documentation', content: [
        'Script: ' + (data.scriptName || 'N/A'),
        'Class: ' + (data.className || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Purpose', content: (data.purpose || 'Not specified').split('\n') },
      { heading: '2. Dependencies', content: (data.dependencies || 'Not specified').split('\n') },
      { heading: '3. Public Methods', content: (data.publicMethods || 'Not specified').split('\n') },
      { heading: '4. Events', content: (data.events || 'Not specified').split('\n') },
      { heading: '5. Usage Notes', content: (data.usageNotes || 'Not specified').split('\n') },
      { heading: '6. Test Cases', content: (data.testCases || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'C# Script Doc – ' + (data.scriptName || ''), author: data.className || '', sections: sections });
  },

  generateCSharpScriptDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['C# SCRIPT DOCUMENTATION'],
      ['Script Name', data.scriptName || ''],
      ['Class Name', data.className || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PURPOSE'],
      [data.purpose || ''],
      [],
      ['DEPENDENCIES'],
      [data.dependencies || ''],
      [],
      ['PUBLIC METHODS'],
      [data.publicMethods || ''],
      [],
      ['EVENTS'],
      [data.events || ''],
      [],
      ['USAGE NOTES'],
      [data.usageNotes || ''],
      [],
      ['TEST CASES'],
      [data.testCases || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Script Doc');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCSharpScriptDocPDF: function(filename, data) {
    var lines = [
      { text: 'C# SCRIPT DOCUMENTATION', size: 18, bold: true },
      { text: (data.scriptName || '') + '  |  ' + (data.className || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PURPOSE ──', size: 14, bold: true },
      { text: data.purpose || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEPENDENCIES ──', size: 14, bold: true },
      { text: data.dependencies || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PUBLIC METHODS ──', size: 14, bold: true },
      { text: data.publicMethods || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVENTS ──', size: 14, bold: true },
      { text: data.events || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── USAGE NOTES ──', size: 14, bold: true },
      { text: data.usageNotes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TEST CASES ──', size: 14, bold: true },
      { text: data.testCases || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'C# Script Documentation', lines: lines });
  },

  generateCSharpScriptDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.scriptName || 'Script',
      title: 'C# Script Documentation',
      subtitle: (data.className || '') + '  |  ' + (data.purpose || ''),
      perSlide: 2,
      sections: [
        { heading: 'Purpose', content: data.purpose || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Dependencies', content: data.dependencies || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Public Methods', content: data.publicMethods || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Events', content: data.events || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Usage Notes', content: data.usageNotes || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Test Cases', content: data.testCases || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 3. GAMEOBJECT SPECIFICATION
  // ============================================================

  generateGameObjectSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'GameObject Specification', content: [
        'Object: ' + (data.objectName || 'N/A'),
        'Type: ' + (data.objectType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Components', content: (data.components || 'Not specified').split('\n') },
      { heading: '2. Child Objects', content: (data.childObjects || 'Not specified').split('\n') },
      { heading: '3. Tags', content: (data.tags || 'Not specified').split('\n') },
      { heading: '4. Layers', content: (data.layers || 'Not specified').split('\n') },
      { heading: '5. Interactions', content: (data.interactions || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'GameObject Spec – ' + (data.objectName || ''), author: data.objectType || '', sections: sections });
  },

  generateGameObjectSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['GAMEOBJECT SPECIFICATION'],
      ['Object Name', data.objectName || ''],
      ['Object Type', data.objectType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['COMPONENTS'],
      [data.components || ''],
      [],
      ['CHILD OBJECTS'],
      [data.childObjects || ''],
      [],
      ['TAGS'],
      [data.tags || ''],
      [],
      ['LAYERS'],
      [data.layers || ''],
      [],
      ['INTERACTIONS'],
      [data.interactions || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'GameObject Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateGameObjectSpecPDF: function(filename, data) {
    var lines = [
      { text: 'GAMEOBJECT SPECIFICATION', size: 18, bold: true },
      { text: (data.objectName || '') + '  |  ' + (data.objectType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── COMPONENTS ──', size: 14, bold: true },
      { text: data.components || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CHILD OBJECTS ──', size: 14, bold: true },
      { text: data.childObjects || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TAGS ──', size: 14, bold: true },
      { text: data.tags || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LAYERS ──', size: 14, bold: true },
      { text: data.layers || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERACTIONS ──', size: 14, bold: true },
      { text: data.interactions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'GameObject Specification', lines: lines });
  },

  generateGameObjectSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.objectName || 'GameObject',
      title: 'GameObject Specification',
      subtitle: (data.objectType || '') + '  |  ' + (data.objectName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Components', content: data.components || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Child Objects', content: data.childObjects || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Tags & Layers', content: (data.tags || '') + '\n' + (data.layers || ''), color: DocStyles.colors.teal },
        { heading: 'Interactions', content: data.interactions || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 4. PHYSICS CONFIGURATION DOCUMENT
  // ============================================================

  generatePhysicsConfigWord: async function(filename, data) {
    var sections = [
      { heading: 'Physics Configuration Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Physics Type: ' + (data.physicsType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Colliders', content: (data.colliders || 'Not specified').split('\n') },
      { heading: '2. Forces', content: (data.forces || 'Not specified').split('\n') },
      { heading: '3. Raycasts', content: (data.raycasts || 'Not specified').split('\n') },
      { heading: '4. Constraints', content: (data.constraints || 'Not specified').split('\n') },
      { heading: '5. Performance Notes', content: (data.performanceNotes || 'Not specified').split('\n') },
      { heading: '6. Test Scenarios', content: (data.testScenarios || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Physics Config – ' + (data.systemName || ''), author: data.physicsType || '', sections: sections });
  },

  generatePhysicsConfigExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PHYSICS CONFIGURATION DOCUMENT'],
      ['System Name', data.systemName || ''],
      ['Physics Type', data.physicsType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['COLLIDERS'],
      [data.colliders || ''],
      [],
      ['FORCES'],
      [data.forces || ''],
      [],
      ['RAYCASTS'],
      [data.raycasts || ''],
      [],
      ['CONSTRAINTS'],
      [data.constraints || ''],
      [],
      ['PERFORMANCE NOTES'],
      [data.performanceNotes || ''],
      [],
      ['TEST SCENARIOS'],
      [data.testScenarios || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Physics Config');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePhysicsConfigPDF: function(filename, data) {
    var lines = [
      { text: 'PHYSICS CONFIGURATION DOCUMENT', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.physicsType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── COLLIDERS ──', size: 14, bold: true },
      { text: data.colliders || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FORCES ──', size: 14, bold: true },
      { text: data.forces || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RAYCASTS ──', size: 14, bold: true },
      { text: data.raycasts || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONSTRAINTS ──', size: 14, bold: true },
      { text: data.constraints || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERFORMANCE NOTES ──', size: 14, bold: true },
      { text: data.performanceNotes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TEST SCENARIOS ──', size: 14, bold: true },
      { text: data.testScenarios || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Physics Configuration', lines: lines });
  },

  generatePhysicsConfigPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'Physics System',
      title: 'Physics Configuration',
      subtitle: (data.physicsType || '') + '  |  ' + (data.systemName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Colliders', content: data.colliders || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Forces', content: data.forces || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Raycasts', content: data.raycasts || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Constraints', content: data.constraints || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Performance Notes', content: data.performanceNotes || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Test Scenarios', content: data.testScenarios || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 5. UI DESIGN SPECIFICATION
  // ============================================================

  generateUIDesignSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'UI Design Specification', content: [
        'Screen: ' + (data.screenName || 'N/A'),
        'UI System: ' + (data.uiSystem || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Canvas Settings', content: (data.canvasSettings || 'Not specified').split('\n') },
      { heading: '2. Elements', content: (data.elements || 'Not specified').split('\n') },
      { heading: '3. Navigation', content: (data.navigation || 'Not specified').split('\n') },
      { heading: '4. Responsive Rules', content: (data.responsiveRules || 'Not specified').split('\n') },
      { heading: '5. Accessibility', content: (data.accessibility || 'Not specified').split('\n') },
      { heading: '6. Mockup Notes', content: (data.mockupNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'UI Design Spec – ' + (data.screenName || ''), author: data.uiSystem || '', sections: sections });
  },

  generateUIDesignSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['UI DESIGN SPECIFICATION'],
      ['Screen Name', data.screenName || ''],
      ['UI System', data.uiSystem || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CANVAS SETTINGS'],
      [data.canvasSettings || ''],
      [],
      ['ELEMENTS'],
      [data.elements || ''],
      [],
      ['NAVIGATION'],
      [data.navigation || ''],
      [],
      ['RESPONSIVE RULES'],
      [data.responsiveRules || ''],
      [],
      ['ACCESSIBILITY'],
      [data.accessibility || ''],
      [],
      ['MOCKUP NOTES'],
      [data.mockupNotes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'UI Design Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateUIDesignSpecPDF: function(filename, data) {
    var lines = [
      { text: 'UI DESIGN SPECIFICATION', size: 18, bold: true },
      { text: (data.screenName || '') + '  |  ' + (data.uiSystem || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CANVAS SETTINGS ──', size: 14, bold: true },
      { text: data.canvasSettings || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ELEMENTS ──', size: 14, bold: true },
      { text: data.elements || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NAVIGATION ──', size: 14, bold: true },
      { text: data.navigation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RESPONSIVE RULES ──', size: 14, bold: true },
      { text: data.responsiveRules || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ACCESSIBILITY ──', size: 14, bold: true },
      { text: data.accessibility || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MOCKUP NOTES ──', size: 14, bold: true },
      { text: data.mockupNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'UI Design Specification', lines: lines });
  },

  generateUIDesignSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.screenName || 'Screen',
      title: 'UI Design Specification',
      subtitle: (data.uiSystem || '') + '  |  ' + (data.screenName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Canvas Settings', content: data.canvasSettings || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Elements', content: data.elements || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Navigation', content: data.navigation || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Responsive Rules', content: data.responsiveRules || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Accessibility', content: data.accessibility || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Mockup Notes', content: data.mockupNotes || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 6. ANIMATION DOCUMENTATION
  // ============================================================

  generateAnimationDocWord: async function(filename, data) {
    var sections = [
      { heading: 'Animation Documentation', content: [
        'Character: ' + (data.characterName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Animation Clips', content: (data.animClips || 'Not specified').split('\n') },
      { heading: '2. Animator Parameters', content: (data.animatorParams || 'Not specified').split('\n') },
      { heading: '3. Transitions', content: (data.transitions || 'Not specified').split('\n') },
      { heading: '4. Blend Trees', content: (data.blendTrees || 'Not specified').split('\n') },
      { heading: '5. State Machine', content: (data.stateMachine || 'Not specified').split('\n') },
      { heading: '6. IK Setup', content: (data.ikSetup || 'Not specified').split('\n') },
      { heading: '7. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Animation Doc – ' + (data.characterName || ''), author: data.characterName || '', sections: sections });
  },

  generateAnimationDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ANIMATION DOCUMENTATION'],
      ['Character', data.characterName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['ANIMATION CLIPS'],
      [data.animClips || ''],
      [],
      ['ANIMATOR PARAMETERS'],
      [data.animatorParams || ''],
      [],
      ['TRANSITIONS'],
      [data.transitions || ''],
      [],
      ['BLEND TREES'],
      [data.blendTrees || ''],
      [],
      ['STATE MACHINE'],
      [data.stateMachine || ''],
      [],
      ['IK SETUP'],
      [data.ikSetup || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Animation Doc');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAnimationDocPDF: function(filename, data) {
    var lines = [
      { text: 'ANIMATION DOCUMENTATION', size: 18, bold: true },
      { text: 'Character: ' + (data.characterName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ANIMATION CLIPS ──', size: 14, bold: true },
      { text: data.animClips || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ANIMATOR PARAMETERS ──', size: 14, bold: true },
      { text: data.animatorParams || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRANSITIONS ──', size: 14, bold: true },
      { text: data.transitions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BLEND TREES ──', size: 14, bold: true },
      { text: data.blendTrees || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STATE MACHINE ──', size: 14, bold: true },
      { text: data.stateMachine || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── IK SETUP ──', size: 14, bold: true },
      { text: data.ikSetup || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Animation Documentation', lines: lines });
  },

  generateAnimationDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.characterName || 'Character',
      title: 'Animation Documentation',
      subtitle: 'Character: ' + (data.characterName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Animation Clips', content: data.animClips || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Animator Parameters', content: data.animatorParams || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Transitions', content: data.transitions || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Blend Trees', content: data.blendTrees || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'State Machine', content: data.stateMachine || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'IK Setup', content: data.ikSetup || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 7. AUDIO DESIGN DOCUMENT
  // ============================================================

  generateAudioDesignDocWord: async function(filename, data) {
    var sections = [
      { heading: 'Audio Design Document', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Audio Sources', content: (data.audioSources || 'Not specified').split('\n') },
      { heading: '2. Music Tracks', content: (data.musicTracks || 'Not specified').split('\n') },
      { heading: '3. SFX List', content: (data.sfxList || 'Not specified').split('\n') },
      { heading: '4. Mixer Groups', content: (data.mixerGroups || 'Not specified').split('\n') },
      { heading: '5. Spatial Settings', content: (data.spatialSettings || 'Not specified').split('\n') },
      { heading: '6. Trigger Conditions', content: (data.triggerConditions || 'Not specified').split('\n') },
      { heading: '7. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Audio Design – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateAudioDesignDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['AUDIO DESIGN DOCUMENT'],
      ['Project', data.projectName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['AUDIO SOURCES'],
      [data.audioSources || ''],
      [],
      ['MUSIC TRACKS'],
      [data.musicTracks || ''],
      [],
      ['SFX LIST'],
      [data.sfxList || ''],
      [],
      ['MIXER GROUPS'],
      [data.mixerGroups || ''],
      [],
      ['SPATIAL SETTINGS'],
      [data.spatialSettings || ''],
      [],
      ['TRIGGER CONDITIONS'],
      [data.triggerConditions || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Audio Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAudioDesignDocPDF: function(filename, data) {
    var lines = [
      { text: 'AUDIO DESIGN DOCUMENT', size: 18, bold: true },
      { text: 'Project: ' + (data.projectName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── AUDIO SOURCES ──', size: 14, bold: true },
      { text: data.audioSources || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MUSIC TRACKS ──', size: 14, bold: true },
      { text: data.musicTracks || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SFX LIST ──', size: 14, bold: true },
      { text: data.sfxList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MIXER GROUPS ──', size: 14, bold: true },
      { text: data.mixerGroups || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SPATIAL SETTINGS ──', size: 14, bold: true },
      { text: data.spatialSettings || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRIGGER CONDITIONS ──', size: 14, bold: true },
      { text: data.triggerConditions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Audio Design Document', lines: lines });
  },

  generateAudioDesignDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Audio Design Document',
      subtitle: 'Project: ' + (data.projectName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Audio Sources', content: data.audioSources || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Music Tracks', content: data.musicTracks || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'SFX List', content: data.sfxList || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Mixer Groups', content: data.mixerGroups || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Spatial Settings', content: data.spatialSettings || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Trigger Conditions', content: data.triggerConditions || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 8. BUILD & PUBLISH CHECKLIST
  // ============================================================

  generateBuildChecklistWord: async function(filename, data) {
    var sections = [
      { heading: 'Build & Publish Checklist', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Platform: ' + (data.platform || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Build Settings', content: (data.buildSettings || 'Not specified').split('\n') },
      { heading: '2. Optimizations', content: (data.optimizations || 'Not specified').split('\n') },
      { heading: '3. Testing Plan', content: (data.testingPlan || 'Not specified').split('\n') },
      { heading: '4. Store Requirements', content: (data.storeRequirements || 'Not specified').split('\n') },
      { heading: '5. Monetization', content: (data.monetization || 'Not specified').split('\n') },
      { heading: '6. Release Notes', content: (data.releaseNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Build Checklist – ' + (data.projectName || ''), author: data.platform || '', sections: sections });
  },

  generateBuildChecklistExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['BUILD & PUBLISH CHECKLIST'],
      ['Project', data.projectName || ''],
      ['Platform', data.platform || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['BUILD SETTINGS'],
      [data.buildSettings || ''],
      [],
      ['OPTIMIZATIONS'],
      [data.optimizations || ''],
      [],
      ['TESTING PLAN'],
      [data.testingPlan || ''],
      [],
      ['STORE REQUIREMENTS'],
      [data.storeRequirements || ''],
      [],
      ['MONETIZATION'],
      [data.monetization || ''],
      [],
      ['RELEASE NOTES'],
      [data.releaseNotes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Build Checklist');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateBuildChecklistPDF: function(filename, data) {
    var lines = [
      { text: 'BUILD & PUBLISH CHECKLIST', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.platform || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BUILD SETTINGS ──', size: 14, bold: true },
      { text: data.buildSettings || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OPTIMIZATIONS ──', size: 14, bold: true },
      { text: data.optimizations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TESTING PLAN ──', size: 14, bold: true },
      { text: data.testingPlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STORE REQUIREMENTS ──', size: 14, bold: true },
      { text: data.storeRequirements || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MONETIZATION ──', size: 14, bold: true },
      { text: data.monetization || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RELEASE NOTES ──', size: 14, bold: true },
      { text: data.releaseNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Build & Publish Checklist', lines: lines });
  },

  generateBuildChecklistPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Build & Publish Checklist',
      subtitle: (data.platform || '') + '  |  ' + (data.projectName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Build Settings', content: data.buildSettings || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Optimizations', content: data.optimizations || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Testing Plan', content: data.testingPlan || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Store Requirements', content: data.storeRequirements || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Monetization', content: data.monetization || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Release Notes', content: data.releaseNotes || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 9. RENDER PIPELINE DOCUMENTATION
  // ============================================================

  generateRenderPipelineDocWord: async function(filename, data) {
    var sections = [
      { heading: 'Render Pipeline Documentation', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Pipeline: ' + (data.pipeline || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Shader List', content: (data.shaderList || 'Not specified').split('\n') },
      { heading: '2. Lighting Setup', content: (data.lightingSetup || 'Not specified').split('\n') },
      { heading: '3. Post-Processing', content: (data.postProcessing || 'Not specified').split('\n') },
      { heading: '4. Material Configuration', content: (data.materialConfig || 'Not specified').split('\n') },
      { heading: '5. Performance Targets', content: (data.performanceTargets || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Render Pipeline – ' + (data.projectName || ''), author: data.pipeline || '', sections: sections });
  },

  generateRenderPipelineDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['RENDER PIPELINE DOCUMENTATION'],
      ['Project', data.projectName || ''],
      ['Pipeline', data.pipeline || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['SHADER LIST'],
      [data.shaderList || ''],
      [],
      ['LIGHTING SETUP'],
      [data.lightingSetup || ''],
      [],
      ['POST-PROCESSING'],
      [data.postProcessing || ''],
      [],
      ['MATERIAL CONFIGURATION'],
      [data.materialConfig || ''],
      [],
      ['PERFORMANCE TARGETS'],
      [data.performanceTargets || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Render Pipeline');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateRenderPipelineDocPDF: function(filename, data) {
    var lines = [
      { text: 'RENDER PIPELINE DOCUMENTATION', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.pipeline || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SHADER LIST ──', size: 14, bold: true },
      { text: data.shaderList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LIGHTING SETUP ──', size: 14, bold: true },
      { text: data.lightingSetup || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── POST-PROCESSING ──', size: 14, bold: true },
      { text: data.postProcessing || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MATERIAL CONFIGURATION ──', size: 14, bold: true },
      { text: data.materialConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERFORMANCE TARGETS ──', size: 14, bold: true },
      { text: data.performanceTargets || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Render Pipeline Documentation', lines: lines });
  },

  generateRenderPipelineDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Render Pipeline Documentation',
      subtitle: (data.pipeline || '') + '  |  ' + (data.projectName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Shader List', content: data.shaderList || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Lighting Setup', content: data.lightingSetup || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Post-Processing', content: data.postProcessing || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Material Configuration', content: data.materialConfig || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Performance Targets', content: data.performanceTargets || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 10. DOTS ARCHITECTURE DOCUMENT
  // ============================================================

  generateDOTSArchDocWord: async function(filename, data) {
    var sections = [
      { heading: 'DOTS Architecture Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Entities', content: (data.entities || 'Not specified').split('\n') },
      { heading: '2. Components', content: (data.components || 'Not specified').split('\n') },
      { heading: '3. Systems', content: (data.systems || 'Not specified').split('\n') },
      { heading: '4. Job Schedule', content: (data.jobSchedule || 'Not specified').split('\n') },
      { heading: '5. Burst Configuration', content: (data.burstConfig || 'Not specified').split('\n') },
      { heading: '6. Performance Goals', content: (data.performanceGoals || 'Not specified').split('\n') },
      { heading: '7. Migration Notes', content: (data.migrationNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'DOTS Architecture – ' + (data.systemName || ''), author: data.systemName || '', sections: sections });
  },

  generateDOTSArchDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['DOTS ARCHITECTURE DOCUMENT'],
      ['System Name', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['ENTITIES'],
      [data.entities || ''],
      [],
      ['COMPONENTS'],
      [data.components || ''],
      [],
      ['SYSTEMS'],
      [data.systems || ''],
      [],
      ['JOB SCHEDULE'],
      [data.jobSchedule || ''],
      [],
      ['BURST CONFIGURATION'],
      [data.burstConfig || ''],
      [],
      ['PERFORMANCE GOALS'],
      [data.performanceGoals || ''],
      [],
      ['MIGRATION NOTES'],
      [data.migrationNotes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'DOTS Architecture');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDOTSArchDocPDF: function(filename, data) {
    var lines = [
      { text: 'DOTS ARCHITECTURE DOCUMENT', size: 18, bold: true },
      { text: 'System: ' + (data.systemName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ENTITIES ──', size: 14, bold: true },
      { text: data.entities || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPONENTS ──', size: 14, bold: true },
      { text: data.components || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SYSTEMS ──', size: 14, bold: true },
      { text: data.systems || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── JOB SCHEDULE ──', size: 14, bold: true },
      { text: data.jobSchedule || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BURST CONFIGURATION ──', size: 14, bold: true },
      { text: data.burstConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERFORMANCE GOALS ──', size: 14, bold: true },
      { text: data.performanceGoals || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MIGRATION NOTES ──', size: 14, bold: true },
      { text: data.migrationNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'DOTS Architecture Document', lines: lines });
  },

  generateDOTSArchDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'DOTS Architecture Document',
      subtitle: 'System: ' + (data.systemName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Entities', content: data.entities || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Components', content: data.components || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Systems', content: data.systems || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Job Schedule', content: data.jobSchedule || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Burst Configuration', content: data.burstConfig || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Performance Goals', content: data.performanceGoals || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Migration Notes', content: data.migrationNotes || 'Not specified', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 11. AI DESIGN DOCUMENT
  // ============================================================

  generateAIDesignDocWord: async function(filename, data) {
    var sections = [
      { heading: 'AI Design Document', content: [
        'Agent: ' + (data.agentName || 'N/A'),
        'AI Type: ' + (data.aiType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. NavMesh Configuration', content: (data.navMeshConfig || 'Not specified').split('\n') },
      { heading: '2. States', content: (data.states || 'Not specified').split('\n') },
      { heading: '3. Behavior Tree', content: (data.behaviorTree || 'Not specified').split('\n') },
      { heading: '4. Procedural Rules', content: (data.proceduralRules || 'Not specified').split('\n') },
      { heading: '5. Debug Tools', content: (data.debugTools || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'AI Design – ' + (data.agentName || ''), author: data.aiType || '', sections: sections });
  },

  generateAIDesignDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['AI DESIGN DOCUMENT'],
      ['Agent Name', data.agentName || ''],
      ['AI Type', data.aiType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['NAVMESH CONFIGURATION'],
      [data.navMeshConfig || ''],
      [],
      ['STATES'],
      [data.states || ''],
      [],
      ['BEHAVIOR TREE'],
      [data.behaviorTree || ''],
      [],
      ['PROCEDURAL RULES'],
      [data.proceduralRules || ''],
      [],
      ['DEBUG TOOLS'],
      [data.debugTools || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'AI Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAIDesignDocPDF: function(filename, data) {
    var lines = [
      { text: 'AI DESIGN DOCUMENT', size: 18, bold: true },
      { text: (data.agentName || '') + '  |  ' + (data.aiType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── NAVMESH CONFIGURATION ──', size: 14, bold: true },
      { text: data.navMeshConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STATES ──', size: 14, bold: true },
      { text: data.states || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BEHAVIOR TREE ──', size: 14, bold: true },
      { text: data.behaviorTree || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROCEDURAL RULES ──', size: 14, bold: true },
      { text: data.proceduralRules || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEBUG TOOLS ──', size: 14, bold: true },
      { text: data.debugTools || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'AI Design Document', lines: lines });
  },

  generateAIDesignDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.agentName || 'Agent',
      title: 'AI Design Document',
      subtitle: (data.aiType || '') + '  |  ' + (data.agentName || ''),
      perSlide: 2,
      sections: [
        { heading: 'NavMesh Configuration', content: data.navMeshConfig || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'States', content: data.states || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Behavior Tree', content: data.behaviorTree || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Procedural Rules', content: data.proceduralRules || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Debug Tools', content: data.debugTools || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 12. NETWORKING SPECIFICATION
  // ============================================================

  generateNetworkingSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'Networking Specification', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Network Model: ' + (data.networkModel || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Netcode Configuration', content: (data.netcodeConfig || 'Not specified').split('\n') },
      { heading: '2. RPC List', content: (data.rpcList || 'Not specified').split('\n') },
      { heading: '3. Sync Objects', content: (data.syncObjects || 'Not specified').split('\n') },
      { heading: '4. Latency Budget', content: (data.latencyBudget || 'Not specified').split('\n') },
      { heading: '5. Security Rules', content: (data.securityRules || 'Not specified').split('\n') },
      { heading: '6. Test Plan', content: (data.testPlan || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Networking Spec – ' + (data.projectName || ''), author: data.networkModel || '', sections: sections });
  },

  generateNetworkingSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['NETWORKING SPECIFICATION'],
      ['Project', data.projectName || ''],
      ['Network Model', data.networkModel || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['NETCODE CONFIGURATION'],
      [data.netcodeConfig || ''],
      [],
      ['RPC LIST'],
      [data.rpcList || ''],
      [],
      ['SYNC OBJECTS'],
      [data.syncObjects || ''],
      [],
      ['LATENCY BUDGET'],
      [data.latencyBudget || ''],
      [],
      ['SECURITY RULES'],
      [data.securityRules || ''],
      [],
      ['TEST PLAN'],
      [data.testPlan || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Networking Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateNetworkingSpecPDF: function(filename, data) {
    var lines = [
      { text: 'NETWORKING SPECIFICATION', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.networkModel || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── NETCODE CONFIGURATION ──', size: 14, bold: true },
      { text: data.netcodeConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RPC LIST ──', size: 14, bold: true },
      { text: data.rpcList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SYNC OBJECTS ──', size: 14, bold: true },
      { text: data.syncObjects || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LATENCY BUDGET ──', size: 14, bold: true },
      { text: data.latencyBudget || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SECURITY RULES ──', size: 14, bold: true },
      { text: data.securityRules || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TEST PLAN ──', size: 14, bold: true },
      { text: data.testPlan || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Networking Specification', lines: lines });
  },

  generateNetworkingSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Networking Specification',
      subtitle: (data.networkModel || '') + '  |  ' + (data.projectName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Netcode Configuration', content: data.netcodeConfig || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'RPC List', content: data.rpcList || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Sync Objects', content: data.syncObjects || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Latency Budget', content: data.latencyBudget || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Security Rules', content: data.securityRules || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Test Plan', content: data.testPlan || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 13. EDITOR TOOL SPECIFICATION
  // ============================================================

  generateEditorToolSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'Editor Tool Specification', content: [
        'Tool: ' + (data.toolName || 'N/A'),
        'Purpose: ' + (data.toolPurpose || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Inspector Customization', content: (data.inspectorCustom || 'Not specified').split('\n') },
      { heading: '2. Menu Items', content: (data.menuItems || 'Not specified').split('\n') },
      { heading: '3. Hotkeys', content: (data.hotkeys || 'Not specified').split('\n') },
      { heading: '4. Automation', content: (data.automation || 'Not specified').split('\n') },
      { heading: '5. CI/CD Configuration', content: (data.cicdConfig || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Editor Tool – ' + (data.toolName || ''), author: data.toolPurpose || '', sections: sections });
  },

  generateEditorToolSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['EDITOR TOOL SPECIFICATION'],
      ['Tool Name', data.toolName || ''],
      ['Tool Purpose', data.toolPurpose || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['INSPECTOR CUSTOMIZATION'],
      [data.inspectorCustom || ''],
      [],
      ['MENU ITEMS'],
      [data.menuItems || ''],
      [],
      ['HOTKEYS'],
      [data.hotkeys || ''],
      [],
      ['AUTOMATION'],
      [data.automation || ''],
      [],
      ['CI/CD CONFIGURATION'],
      [data.cicdConfig || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Editor Tool');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEditorToolSpecPDF: function(filename, data) {
    var lines = [
      { text: 'EDITOR TOOL SPECIFICATION', size: 18, bold: true },
      { text: (data.toolName || '') + '  |  ' + (data.toolPurpose || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── INSPECTOR CUSTOMIZATION ──', size: 14, bold: true },
      { text: data.inspectorCustom || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MENU ITEMS ──', size: 14, bold: true },
      { text: data.menuItems || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HOTKEYS ──', size: 14, bold: true },
      { text: data.hotkeys || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── AUTOMATION ──', size: 14, bold: true },
      { text: data.automation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CI/CD CONFIGURATION ──', size: 14, bold: true },
      { text: data.cicdConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Editor Tool Specification', lines: lines });
  },

  generateEditorToolSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.toolName || 'Tool',
      title: 'Editor Tool Specification',
      subtitle: (data.toolPurpose || '') + '  |  ' + (data.toolName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Inspector Customization', content: data.inspectorCustom || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Menu Items', content: data.menuItems || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Hotkeys', content: data.hotkeys || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Automation', content: data.automation || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'CI/CD Configuration', content: data.cicdConfig || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 14. ARCHITECTURE DOCUMENT
  // ============================================================

  generateArchitectureDocWord: async function(filename, data) {
    var sections = [
      { heading: 'Architecture Document', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Architecture Pattern: ' + (data.archPattern || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Service Locators', content: (data.servicLocators || 'Not specified').split('\n') },
      { heading: '2. DI Configuration', content: (data.diConfig || 'Not specified').split('\n') },
      { heading: '3. ScriptableObject Assets', content: (data.soAssets || 'Not specified').split('\n') },
      { heading: '4. Event Systems', content: (data.eventSystems || 'Not specified').split('\n') },
      { heading: '5. Module Boundaries', content: (data.moduleBoundaries || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Architecture – ' + (data.projectName || ''), author: data.archPattern || '', sections: sections });
  },

  generateArchitectureDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ARCHITECTURE DOCUMENT'],
      ['Project', data.projectName || ''],
      ['Architecture Pattern', data.archPattern || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['SERVICE LOCATORS'],
      [data.servicLocators || ''],
      [],
      ['DI CONFIGURATION'],
      [data.diConfig || ''],
      [],
      ['SCRIPTABLEOBJECT ASSETS'],
      [data.soAssets || ''],
      [],
      ['EVENT SYSTEMS'],
      [data.eventSystems || ''],
      [],
      ['MODULE BOUNDARIES'],
      [data.moduleBoundaries || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Architecture');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArchitectureDocPDF: function(filename, data) {
    var lines = [
      { text: 'ARCHITECTURE DOCUMENT', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.archPattern || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SERVICE LOCATORS ──', size: 14, bold: true },
      { text: data.servicLocators || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DI CONFIGURATION ──', size: 14, bold: true },
      { text: data.diConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SCRIPTABLEOBJECT ASSETS ──', size: 14, bold: true },
      { text: data.soAssets || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVENT SYSTEMS ──', size: 14, bold: true },
      { text: data.eventSystems || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MODULE BOUNDARIES ──', size: 14, bold: true },
      { text: data.moduleBoundaries || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Architecture Document', lines: lines });
  },

  generateArchitectureDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Architecture Document',
      subtitle: (data.archPattern || '') + '  |  ' + (data.projectName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Service Locators', content: data.servicLocators || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'DI Configuration', content: data.diConfig || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'ScriptableObject Assets', content: data.soAssets || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Event Systems', content: data.eventSystems || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Module Boundaries', content: data.moduleBoundaries || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 15. PERFORMANCE OPTIMIZATION REPORT
  // ============================================================

  generatePerfOptReportWord: async function(filename, data) {
    var sections = [
      { heading: 'Performance Optimization Report', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Target FPS: ' + (data.targetFPS || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. CPU Bottlenecks', content: (data.cpuBottlenecks || 'Not specified').split('\n') },
      { heading: '2. GPU Bottlenecks', content: (data.gpuBottlenecks || 'Not specified').split('\n') },
      { heading: '3. Memory Profile', content: (data.memoryProfile || 'Not specified').split('\n') },
      { heading: '4. Pooling Strategy', content: (data.poolingStrategy || 'Not specified').split('\n') },
      { heading: '5. Recommendations', content: (data.recommendations || 'Not specified').split('\n') },
      { heading: '6. Benchmarks', content: (data.benchmarks || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Perf Optimization – ' + (data.projectName || ''), author: data.targetFPS || '', sections: sections });
  },

  generatePerfOptReportExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PERFORMANCE OPTIMIZATION REPORT'],
      ['Project', data.projectName || ''],
      ['Target FPS', data.targetFPS || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CPU BOTTLENECKS'],
      [data.cpuBottlenecks || ''],
      [],
      ['GPU BOTTLENECKS'],
      [data.gpuBottlenecks || ''],
      [],
      ['MEMORY PROFILE'],
      [data.memoryProfile || ''],
      [],
      ['POOLING STRATEGY'],
      [data.poolingStrategy || ''],
      [],
      ['RECOMMENDATIONS'],
      [data.recommendations || ''],
      [],
      ['BENCHMARKS'],
      [data.benchmarks || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Perf Report');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePerfOptReportPDF: function(filename, data) {
    var lines = [
      { text: 'PERFORMANCE OPTIMIZATION REPORT', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  Target FPS: ' + (data.targetFPS || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CPU BOTTLENECKS ──', size: 14, bold: true },
      { text: data.cpuBottlenecks || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GPU BOTTLENECKS ──', size: 14, bold: true },
      { text: data.gpuBottlenecks || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MEMORY PROFILE ──', size: 14, bold: true },
      { text: data.memoryProfile || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── POOLING STRATEGY ──', size: 14, bold: true },
      { text: data.poolingStrategy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RECOMMENDATIONS ──', size: 14, bold: true },
      { text: data.recommendations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BENCHMARKS ──', size: 14, bold: true },
      { text: data.benchmarks || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Performance Optimization Report', lines: lines });
  },

  generatePerfOptReportPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Performance Optimization Report',
      subtitle: (data.projectName || '') + '  |  Target FPS: ' + (data.targetFPS || ''),
      perSlide: 2,
      sections: [
        { heading: 'CPU Bottlenecks', content: data.cpuBottlenecks || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'GPU Bottlenecks', content: data.gpuBottlenecks || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Memory Profile', content: data.memoryProfile || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Pooling Strategy', content: data.poolingStrategy || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Recommendations', content: data.recommendations || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Benchmarks', content: data.benchmarks || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 16. PRODUCTION PLAN
  // ============================================================

  generateProductionPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'Production Plan', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'VC Strategy: ' + (data.vcStrategy || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Branch Model', content: (data.branchModel || 'Not specified').split('\n') },
      { heading: '2. Workflow', content: (data.workflow || 'Not specified').split('\n') },
      { heading: '3. Task Tracking', content: (data.taskTracking || 'Not specified').split('\n') },
      { heading: '4. Asset Pipeline', content: (data.assetPipeline || 'Not specified').split('\n') },
      { heading: '5. Debugging Plan', content: (data.debuggingPlan || 'Not specified').split('\n') },
      { heading: '6. Milestones', content: (data.milestones || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Production Plan – ' + (data.projectName || ''), author: data.vcStrategy || '', sections: sections });
  },

  generateProductionPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PRODUCTION PLAN'],
      ['Project', data.projectName || ''],
      ['VC Strategy', data.vcStrategy || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['BRANCH MODEL'],
      [data.branchModel || ''],
      [],
      ['WORKFLOW'],
      [data.workflow || ''],
      [],
      ['TASK TRACKING'],
      [data.taskTracking || ''],
      [],
      ['ASSET PIPELINE'],
      [data.assetPipeline || ''],
      [],
      ['DEBUGGING PLAN'],
      [data.debuggingPlan || ''],
      [],
      ['MILESTONES'],
      [data.milestones || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Production Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateProductionPlanPDF: function(filename, data) {
    var lines = [
      { text: 'PRODUCTION PLAN', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.vcStrategy || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BRANCH MODEL ──', size: 14, bold: true },
      { text: data.branchModel || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── WORKFLOW ──', size: 14, bold: true },
      { text: data.workflow || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TASK TRACKING ──', size: 14, bold: true },
      { text: data.taskTracking || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ASSET PIPELINE ──', size: 14, bold: true },
      { text: data.assetPipeline || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEBUGGING PLAN ──', size: 14, bold: true },
      { text: data.debuggingPlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MILESTONES ──', size: 14, bold: true },
      { text: data.milestones || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Production Plan', lines: lines });
  },

  generateProductionPlanPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Production Plan',
      subtitle: (data.vcStrategy || '') + '  |  ' + (data.projectName || ''),
      perSlide: 2,
      sections: [
        { heading: 'Branch Model', content: data.branchModel || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Workflow', content: data.workflow || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Task Tracking', content: data.taskTracking || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Asset Pipeline', content: data.assetPipeline || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Debugging Plan', content: data.debuggingPlan || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Milestones', content: data.milestones || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  }

});
