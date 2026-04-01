/**
 * Doc Generator – Mechanical Movements Series
 * Extends DocGenerator with 24 mechanical movements document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * DocTypes (24):
 *  1. MovementAnalysis          – Movement Analysis Report
 *  2. PulleySystemDesign        – Pulley System Design Document
 *  3. GearSpecification         – Gear Specification Sheet
 *  4. SpurGearDesign            – Spur Gear Design Document
 *  5. HelicalGearDesign         – Helical Gear Design Document
 *  6. BevelGearDesign           – Bevel Gear Design Document
 *  7. WormGearDesign            – Worm Gear Design Document
 *  8. PlanetaryGearDesign       – Planetary Gear Design Document
 *  9. RackPinionDesign          – Rack & Pinion Design Document
 * 10. GearTrainAnalysis         – Gear Train Analysis Report
 * 11. CamDesign                 – Cam Design Document
 * 12. LinkageDesign             – Linkage Design Document
 * 13. RatchetDesign             – Ratchet Design Document
 * 14. ScrewMechDesign           – Screw Mechanism Design Document
 * 15. EscapementDesign          – Escapement Design Document
 * 16. GovernorDesign            – Governor Design Document
 * 17. StraightLineDesign        – Straight-Line Mechanism Design Document
 * 18. HydraulicDesign           – Hydraulic System Design Document
 * 19. TurbineDesign             – Turbine Design Document
 * 20. SteamEngineDoc            – Steam Engine Documentation
 * 21. GearmotorSpec             – Gearmotor Specification Sheet
 * 22. EfficiencyAnalysis        – Efficiency Analysis Report
 * 23. VibrationAnalysis         – Vibration Analysis Report
 * 24. MaterialSpec              – Material Specification Sheet
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. MOVEMENT ANALYSIS
  // ============================================================

  generateMovementAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Movement Analysis Report', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Movement Type: ' + (data.movementType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Input Motion', content: (data.inputMotion || 'Not specified').split('\n') },
      { heading: '2. Output Motion', content: (data.outputMotion || 'Not specified').split('\n') },
      { heading: '3. Components', content: (data.components || 'Not specified').split('\n') },
      { heading: '4. Mechanical Advantage', content: (data.mechanicalAdvantage || 'Not specified').split('\n') },
      { heading: '5. Applications', content: (data.applications || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Movement Analysis – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateMovementAnalysisExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['MOVEMENT ANALYSIS REPORT'],
      ['System Name', data.systemName || ''],
      ['Movement Type', data.movementType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['INPUT MOTION'], [data.inputMotion || ''],
      [], ['OUTPUT MOTION'], [data.outputMotion || ''],
      [], ['COMPONENTS'], [data.components || ''],
      [], ['MECHANICAL ADVANTAGE'], [data.mechanicalAdvantage || ''],
      [], ['APPLICATIONS'], [data.applications || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Movement Analysis');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMovementAnalysisPDF: function(filename, data) {
    var lines = [
      { text: 'MOVEMENT ANALYSIS REPORT', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.movementType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── INPUT MOTION ──', size: 14, bold: true },
      { text: data.inputMotion || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OUTPUT MOTION ──', size: 14, bold: true },
      { text: data.outputMotion || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPONENTS ──', size: 14, bold: true },
      { text: data.components || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MECHANICAL ADVANTAGE ──', size: 14, bold: true },
      { text: data.mechanicalAdvantage || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── APPLICATIONS ──', size: 14, bold: true },
      { text: data.applications || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Movement Analysis', lines: lines });
  },

  generateMovementAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Movement Analysis Report',
      subtitle: (data.movementType || '') + '  |  ' + (data.inputMotion || ''),
      perSlide: 2,
      sections: [
        { heading: 'Input Motion', content: data.inputMotion || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Output Motion', content: data.outputMotion || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Components', content: data.components || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Mechanical Advantage', content: data.mechanicalAdvantage || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Applications', content: data.applications || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 2. PULLEY SYSTEM DESIGN
  // ============================================================

  generatePulleySystemDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Pulley System Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Pulley Type: ' + (data.pulleyType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Number of Pulleys', content: ['Count: ' + (data.numberOfPulleys || 'N/A')] },
      { heading: '2. Belt Type', content: (data.beltType || 'Not specified').split('\n') },
      { heading: '3. Load Capacity', content: (data.loadCapacity || 'Not specified').split('\n') },
      { heading: '4. Speed Ratio', content: (data.speedRatio || 'Not specified').split('\n') },
      { heading: '5. Tension Calculation', content: (data.tensionCalc || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Pulley System – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generatePulleySystemDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PULLEY SYSTEM DESIGN'],
      ['System Name', data.systemName || ''],
      ['Pulley Type', data.pulleyType || ''],
      ['Number of Pulleys', data.numberOfPulleys || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['BELT TYPE'], [data.beltType || ''],
      [], ['LOAD CAPACITY'], [data.loadCapacity || ''],
      [], ['SPEED RATIO'], [data.speedRatio || ''],
      [], ['TENSION CALCULATION'], [data.tensionCalc || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Pulley Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePulleySystemDesignPDF: function(filename, data) {
    var lines = [
      { text: 'PULLEY SYSTEM DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.pulleyType || ''), size: 12 },
      { text: 'Pulleys: ' + (data.numberOfPulleys || '') + '  |  Belt: ' + (data.beltType || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── LOAD CAPACITY ──', size: 14, bold: true },
      { text: data.loadCapacity || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SPEED RATIO ──', size: 14, bold: true },
      { text: data.speedRatio || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TENSION CALCULATION ──', size: 14, bold: true },
      { text: data.tensionCalc || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Pulley System Design', lines: lines });
  },

  generatePulleySystemDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Pulley System Design',
      subtitle: (data.pulleyType || '') + '  |  Pulleys: ' + (data.numberOfPulleys || ''),
      perSlide: 2,
      sections: [
        { heading: 'Belt Type', content: data.beltType || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Load Capacity', content: data.loadCapacity || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Speed Ratio', content: data.speedRatio || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Tension Calculation', content: data.tensionCalc || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 3. GEAR SPECIFICATION
  // ============================================================

  generateGearSpecificationWord: async function(filename, data) {
    var sections = [
      { heading: 'Gear Specification Sheet', content: [
        'Gear: ' + (data.gearName || 'N/A'),
        'Gear Type: ' + (data.gearType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Module', content: ['Module: ' + (data.module || 'N/A')] },
      { heading: '2. Pressure Angle', content: (data.pressureAngle || 'Not specified').split('\n') },
      { heading: '3. Tooth Count', content: (data.toothCount || 'Not specified').split('\n') },
      { heading: '4. Pitch Diameter', content: (data.pitchDiameter || 'Not specified').split('\n') },
      { heading: '5. Face Width', content: (data.faceWidth || 'Not specified').split('\n') },
      { heading: '6. Material', content: (data.material || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Gear Spec – ' + (data.gearName || ''), author: data.authorName || '', sections: sections });
  },

  generateGearSpecificationExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['GEAR SPECIFICATION SHEET'],
      ['Gear Name', data.gearName || ''],
      ['Gear Type', data.gearType || ''],
      ['Module', data.module || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PRESSURE ANGLE'], [data.pressureAngle || ''],
      [], ['TOOTH COUNT'], [data.toothCount || ''],
      [], ['PITCH DIAMETER'], [data.pitchDiameter || ''],
      [], ['FACE WIDTH'], [data.faceWidth || ''],
      [], ['MATERIAL'], [data.material || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Gear Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateGearSpecificationPDF: function(filename, data) {
    var lines = [
      { text: 'GEAR SPECIFICATION SHEET', size: 18, bold: true },
      { text: (data.gearName || '') + '  |  ' + (data.gearType || ''), size: 12 },
      { text: 'Module: ' + (data.module || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PRESSURE ANGLE ──', size: 14, bold: true },
      { text: data.pressureAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TOOTH COUNT ──', size: 14, bold: true },
      { text: data.toothCount || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PITCH DIAMETER ──', size: 14, bold: true },
      { text: data.pitchDiameter || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FACE WIDTH ──', size: 14, bold: true },
      { text: data.faceWidth || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MATERIAL ──', size: 14, bold: true },
      { text: data.material || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Gear Specification', lines: lines });
  },

  generateGearSpecificationPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.gearName || 'Gear',
      title: 'Gear Specification Sheet',
      subtitle: (data.gearType || '') + '  |  Module: ' + (data.module || ''),
      perSlide: 2,
      sections: [
        { heading: 'Pressure Angle', content: data.pressureAngle || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Tooth Count', content: data.toothCount || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Pitch Diameter', content: data.pitchDiameter || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Face Width', content: data.faceWidth || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Material', content: data.material || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 4. SPUR GEAR DESIGN
  // ============================================================

  generateSpurGearDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Spur Gear Design Document', content: [
        'Gear Pair: ' + (data.gearPairName || 'N/A'),
        'Module: ' + (data.module || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Driver Teeth', content: ['Teeth: ' + (data.driverTeeth || 'N/A')] },
      { heading: '2. Driven Teeth', content: ['Teeth: ' + (data.drivenTeeth || 'N/A')] },
      { heading: '3. Center Distance', content: (data.centerDistance || 'Not specified').split('\n') },
      { heading: '4. Contact Ratio', content: (data.contactRatio || 'Not specified').split('\n') },
      { heading: '5. Load Capacity', content: (data.loadCapacity || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Spur Gear Design – ' + (data.gearPairName || ''), author: data.authorName || '', sections: sections });
  },

  generateSpurGearDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['SPUR GEAR DESIGN'],
      ['Gear Pair', data.gearPairName || ''],
      ['Driver Teeth', data.driverTeeth || ''],
      ['Driven Teeth', data.drivenTeeth || ''],
      ['Module', data.module || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CENTER DISTANCE'], [data.centerDistance || ''],
      [], ['CONTACT RATIO'], [data.contactRatio || ''],
      [], ['LOAD CAPACITY'], [data.loadCapacity || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Spur Gear');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSpurGearDesignPDF: function(filename, data) {
    var lines = [
      { text: 'SPUR GEAR DESIGN', size: 18, bold: true },
      { text: (data.gearPairName || '') + '  |  Module: ' + (data.module || ''), size: 12 },
      { text: 'Driver: ' + (data.driverTeeth || '') + '  |  Driven: ' + (data.drivenTeeth || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CENTER DISTANCE ──', size: 14, bold: true },
      { text: data.centerDistance || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONTACT RATIO ──', size: 14, bold: true },
      { text: data.contactRatio || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LOAD CAPACITY ──', size: 14, bold: true },
      { text: data.loadCapacity || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Spur Gear Design', lines: lines });
  },

  generateSpurGearDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.gearPairName || 'Gear Pair',
      title: 'Spur Gear Design',
      subtitle: 'Driver: ' + (data.driverTeeth || '') + '  |  Driven: ' + (data.drivenTeeth || ''),
      perSlide: 2,
      sections: [
        { heading: 'Center Distance', content: data.centerDistance || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Contact Ratio', content: data.contactRatio || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Load Capacity', content: data.loadCapacity || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 5. HELICAL GEAR DESIGN
  // ============================================================

  generateHelicalGearDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Helical Gear Design Document', content: [
        'Gear Pair: ' + (data.gearPairName || 'N/A'),
        'Helix Angle: ' + (data.helixAngle || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Normal Module', content: ['Module: ' + (data.normalModule || 'N/A')] },
      { heading: '2. Thrust Force', content: (data.thrustForce || 'Not specified').split('\n') },
      { heading: '3. Efficiency', content: (data.efficiency || 'Not specified').split('\n') },
      { heading: '4. Equivalent Teeth', content: (data.equivalentTeeth || 'Not specified').split('\n') },
      { heading: '5. Advantages', content: (data.advantages || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Helical Gear Design – ' + (data.gearPairName || ''), author: data.authorName || '', sections: sections });
  },

  generateHelicalGearDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['HELICAL GEAR DESIGN'],
      ['Gear Pair', data.gearPairName || ''],
      ['Helix Angle', data.helixAngle || ''],
      ['Normal Module', data.normalModule || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['THRUST FORCE'], [data.thrustForce || ''],
      [], ['EFFICIENCY'], [data.efficiency || ''],
      [], ['EQUIVALENT TEETH'], [data.equivalentTeeth || ''],
      [], ['ADVANTAGES'], [data.advantages || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Helical Gear');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateHelicalGearDesignPDF: function(filename, data) {
    var lines = [
      { text: 'HELICAL GEAR DESIGN', size: 18, bold: true },
      { text: (data.gearPairName || '') + '  |  Helix Angle: ' + (data.helixAngle || ''), size: 12 },
      { text: 'Normal Module: ' + (data.normalModule || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── THRUST FORCE ──', size: 14, bold: true },
      { text: data.thrustForce || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EFFICIENCY ──', size: 14, bold: true },
      { text: data.efficiency || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EQUIVALENT TEETH ──', size: 14, bold: true },
      { text: data.equivalentTeeth || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADVANTAGES ──', size: 14, bold: true },
      { text: data.advantages || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Helical Gear Design', lines: lines });
  },

  generateHelicalGearDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.gearPairName || 'Gear Pair',
      title: 'Helical Gear Design',
      subtitle: 'Helix Angle: ' + (data.helixAngle || '') + '  |  Module: ' + (data.normalModule || ''),
      perSlide: 2,
      sections: [
        { heading: 'Thrust Force', content: data.thrustForce || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Efficiency', content: data.efficiency || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Equivalent Teeth', content: data.equivalentTeeth || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Advantages', content: data.advantages || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 6. BEVEL GEAR DESIGN
  // ============================================================

  generateBevelGearDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Bevel Gear Design Document', content: [
        'Gear Pair: ' + (data.gearPairName || 'N/A'),
        'Cone Angle: ' + (data.coneAngle || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Pitch Angle', content: (data.pitchAngle || 'Not specified').split('\n') },
      { heading: '2. Spiral Angle', content: (data.spiralAngle || 'Not specified').split('\n') },
      { heading: '3. Mounting Distance', content: (data.mountingDistance || 'Not specified').split('\n') },
      { heading: '4. Bearing Loads', content: (data.bearingLoads || 'Not specified').split('\n') },
      { heading: '5. Application', content: (data.application || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Bevel Gear Design – ' + (data.gearPairName || ''), author: data.authorName || '', sections: sections });
  },

  generateBevelGearDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['BEVEL GEAR DESIGN'],
      ['Gear Pair', data.gearPairName || ''],
      ['Cone Angle', data.coneAngle || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PITCH ANGLE'], [data.pitchAngle || ''],
      [], ['SPIRAL ANGLE'], [data.spiralAngle || ''],
      [], ['MOUNTING DISTANCE'], [data.mountingDistance || ''],
      [], ['BEARING LOADS'], [data.bearingLoads || ''],
      [], ['APPLICATION'], [data.application || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Bevel Gear');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateBevelGearDesignPDF: function(filename, data) {
    var lines = [
      { text: 'BEVEL GEAR DESIGN', size: 18, bold: true },
      { text: (data.gearPairName || '') + '  |  Cone Angle: ' + (data.coneAngle || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PITCH ANGLE ──', size: 14, bold: true },
      { text: data.pitchAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SPIRAL ANGLE ──', size: 14, bold: true },
      { text: data.spiralAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MOUNTING DISTANCE ──', size: 14, bold: true },
      { text: data.mountingDistance || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BEARING LOADS ──', size: 14, bold: true },
      { text: data.bearingLoads || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── APPLICATION ──', size: 14, bold: true },
      { text: data.application || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Bevel Gear Design', lines: lines });
  },

  generateBevelGearDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.gearPairName || 'Gear Pair',
      title: 'Bevel Gear Design',
      subtitle: 'Cone Angle: ' + (data.coneAngle || '') + '  |  Pitch Angle: ' + (data.pitchAngle || ''),
      perSlide: 2,
      sections: [
        { heading: 'Spiral Angle', content: data.spiralAngle || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Mounting Distance', content: data.mountingDistance || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Bearing Loads', content: data.bearingLoads || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Application', content: data.application || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 7. WORM GEAR DESIGN
  // ============================================================

  generateWormGearDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Worm Gear Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Worm Starts: ' + (data.wormStarts || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Gear Teeth', content: ['Teeth: ' + (data.gearTeeth || 'N/A')] },
      { heading: '2. Lead Angle', content: (data.leadAngle || 'Not specified').split('\n') },
      { heading: '3. Efficiency', content: (data.efficiency || 'Not specified').split('\n') },
      { heading: '4. Self-Locking', content: (data.selfLocking || 'Not specified').split('\n') },
      { heading: '5. Thermal Rating', content: (data.thermalRating || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Worm Gear Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateWormGearDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['WORM GEAR DESIGN'],
      ['System Name', data.systemName || ''],
      ['Worm Starts', data.wormStarts || ''],
      ['Gear Teeth', data.gearTeeth || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['LEAD ANGLE'], [data.leadAngle || ''],
      [], ['EFFICIENCY'], [data.efficiency || ''],
      [], ['SELF-LOCKING'], [data.selfLocking || ''],
      [], ['THERMAL RATING'], [data.thermalRating || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Worm Gear');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateWormGearDesignPDF: function(filename, data) {
    var lines = [
      { text: 'WORM GEAR DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  Starts: ' + (data.wormStarts || ''), size: 12 },
      { text: 'Gear Teeth: ' + (data.gearTeeth || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── LEAD ANGLE ──', size: 14, bold: true },
      { text: data.leadAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EFFICIENCY ──', size: 14, bold: true },
      { text: data.efficiency || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SELF-LOCKING ──', size: 14, bold: true },
      { text: data.selfLocking || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── THERMAL RATING ──', size: 14, bold: true },
      { text: data.thermalRating || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Worm Gear Design', lines: lines });
  },

  generateWormGearDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Worm Gear Design',
      subtitle: 'Starts: ' + (data.wormStarts || '') + '  |  Teeth: ' + (data.gearTeeth || ''),
      perSlide: 2,
      sections: [
        { heading: 'Lead Angle', content: data.leadAngle || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Efficiency', content: data.efficiency || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Self-Locking', content: data.selfLocking || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Thermal Rating', content: data.thermalRating || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 8. PLANETARY GEAR DESIGN
  // ============================================================

  generatePlanetaryGearDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Planetary Gear Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Stages: ' + (data.stages || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Sun Teeth', content: ['Teeth: ' + (data.sunTeeth || 'N/A')] },
      { heading: '2. Planet Teeth', content: ['Teeth: ' + (data.planetTeeth || 'N/A')] },
      { heading: '3. Ring Teeth', content: ['Teeth: ' + (data.ringTeeth || 'N/A')] },
      { heading: '4. Ratio Calculation', content: (data.ratioCalc || 'Not specified').split('\n') },
      { heading: '5. Torque Split', content: (data.torqueSplit || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Planetary Gear Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generatePlanetaryGearDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['PLANETARY GEAR DESIGN'],
      ['System Name', data.systemName || ''],
      ['Sun Teeth', data.sunTeeth || ''],
      ['Planet Teeth', data.planetTeeth || ''],
      ['Ring Teeth', data.ringTeeth || ''],
      ['Stages', data.stages || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['RATIO CALCULATION'], [data.ratioCalc || ''],
      [], ['TORQUE SPLIT'], [data.torqueSplit || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Planetary Gear');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePlanetaryGearDesignPDF: function(filename, data) {
    var lines = [
      { text: 'PLANETARY GEAR DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  Stages: ' + (data.stages || ''), size: 12 },
      { text: 'Sun: ' + (data.sunTeeth || '') + '  |  Planet: ' + (data.planetTeeth || '') + '  |  Ring: ' + (data.ringTeeth || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── RATIO CALCULATION ──', size: 14, bold: true },
      { text: data.ratioCalc || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TORQUE SPLIT ──', size: 14, bold: true },
      { text: data.torqueSplit || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Planetary Gear Design', lines: lines });
  },

  generatePlanetaryGearDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Planetary Gear Design',
      subtitle: 'Sun: ' + (data.sunTeeth || '') + '  |  Planet: ' + (data.planetTeeth || '') + '  |  Ring: ' + (data.ringTeeth || ''),
      perSlide: 2,
      sections: [
        { heading: 'Ratio Calculation', content: data.ratioCalc || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Torque Split', content: data.torqueSplit || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.teal }
      ]
    });
  },

  // ============================================================
  // 9. RACK & PINION DESIGN
  // ============================================================

  generateRackPinionDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Rack & Pinion Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Module: ' + (data.module || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Pinion Teeth', content: ['Teeth: ' + (data.pinionTeeth || 'N/A')] },
      { heading: '2. Rack Length', content: (data.rackLength || 'Not specified').split('\n') },
      { heading: '3. Travel Speed', content: (data.travelSpeed || 'Not specified').split('\n') },
      { heading: '4. Load Capacity', content: (data.loadCapacity || 'Not specified').split('\n') },
      { heading: '5. Backlash', content: (data.backlash || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Rack & Pinion Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateRackPinionDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['RACK & PINION DESIGN'],
      ['System Name', data.systemName || ''],
      ['Pinion Teeth', data.pinionTeeth || ''],
      ['Rack Length', data.rackLength || ''],
      ['Module', data.module || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['TRAVEL SPEED'], [data.travelSpeed || ''],
      [], ['LOAD CAPACITY'], [data.loadCapacity || ''],
      [], ['BACKLASH'], [data.backlash || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Rack Pinion');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateRackPinionDesignPDF: function(filename, data) {
    var lines = [
      { text: 'RACK & PINION DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  Module: ' + (data.module || ''), size: 12 },
      { text: 'Pinion Teeth: ' + (data.pinionTeeth || '') + '  |  Rack Length: ' + (data.rackLength || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TRAVEL SPEED ──', size: 14, bold: true },
      { text: data.travelSpeed || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LOAD CAPACITY ──', size: 14, bold: true },
      { text: data.loadCapacity || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BACKLASH ──', size: 14, bold: true },
      { text: data.backlash || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Rack & Pinion Design', lines: lines });
  },

  generateRackPinionDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Rack & Pinion Design',
      subtitle: 'Pinion: ' + (data.pinionTeeth || '') + ' teeth  |  Module: ' + (data.module || ''),
      perSlide: 2,
      sections: [
        { heading: 'Rack Length', content: data.rackLength || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Travel Speed', content: data.travelSpeed || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Load Capacity', content: data.loadCapacity || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Backlash', content: data.backlash || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 10. GEAR TRAIN ANALYSIS
  // ============================================================

  generateGearTrainAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Gear Train Analysis Report', content: [
        'Train: ' + (data.trainName || 'N/A'),
        'Stages: ' + (data.stages || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Input Speed', content: ['Speed: ' + (data.inputSpeed || 'N/A')] },
      { heading: '2. Output Speed', content: ['Speed: ' + (data.outputSpeed || 'N/A')] },
      { heading: '3. Overall Ratio', content: (data.overallRatio || 'Not specified').split('\n') },
      { heading: '4. Efficiency', content: (data.efficiency || 'Not specified').split('\n') },
      { heading: '5. Differential Type', content: (data.differentialType || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Gear Train Analysis – ' + (data.trainName || ''), author: data.authorName || '', sections: sections });
  },

  generateGearTrainAnalysisExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['GEAR TRAIN ANALYSIS'],
      ['Train Name', data.trainName || ''],
      ['Stages', data.stages || ''],
      ['Input Speed', data.inputSpeed || ''],
      ['Output Speed', data.outputSpeed || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['OVERALL RATIO'], [data.overallRatio || ''],
      [], ['EFFICIENCY'], [data.efficiency || ''],
      [], ['DIFFERENTIAL TYPE'], [data.differentialType || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Gear Train');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateGearTrainAnalysisPDF: function(filename, data) {
    var lines = [
      { text: 'GEAR TRAIN ANALYSIS', size: 18, bold: true },
      { text: (data.trainName || '') + '  |  Stages: ' + (data.stages || ''), size: 12 },
      { text: 'Input: ' + (data.inputSpeed || '') + '  |  Output: ' + (data.outputSpeed || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── OVERALL RATIO ──', size: 14, bold: true },
      { text: data.overallRatio || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EFFICIENCY ──', size: 14, bold: true },
      { text: data.efficiency || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DIFFERENTIAL TYPE ──', size: 14, bold: true },
      { text: data.differentialType || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Gear Train Analysis', lines: lines });
  },

  generateGearTrainAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.trainName || 'Train',
      title: 'Gear Train Analysis',
      subtitle: 'Input: ' + (data.inputSpeed || '') + '  |  Output: ' + (data.outputSpeed || ''),
      perSlide: 2,
      sections: [
        { heading: 'Overall Ratio', content: data.overallRatio || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Efficiency', content: data.efficiency || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Differential Type', content: data.differentialType || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 11. CAM DESIGN
  // ============================================================

  generateCamDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Cam Design Document', content: [
        'Cam: ' + (data.camName || 'N/A'),
        'Cam Type: ' + (data.camType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Follower Type', content: ['Type: ' + (data.followerType || 'N/A')] },
      { heading: '2. Rise Angle', content: (data.riseAngle || 'Not specified').split('\n') },
      { heading: '3. Dwell Angle', content: (data.dwellAngle || 'Not specified').split('\n') },
      { heading: '4. Return Angle', content: (data.returnAngle || 'Not specified').split('\n') },
      { heading: '5. Displacement', content: (data.displacement || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Cam Design – ' + (data.camName || ''), author: data.authorName || '', sections: sections });
  },

  generateCamDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['CAM DESIGN'],
      ['Cam Name', data.camName || ''],
      ['Cam Type', data.camType || ''],
      ['Follower Type', data.followerType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['RISE ANGLE'], [data.riseAngle || ''],
      [], ['DWELL ANGLE'], [data.dwellAngle || ''],
      [], ['RETURN ANGLE'], [data.returnAngle || ''],
      [], ['DISPLACEMENT'], [data.displacement || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Cam Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCamDesignPDF: function(filename, data) {
    var lines = [
      { text: 'CAM DESIGN', size: 18, bold: true },
      { text: (data.camName || '') + '  |  ' + (data.camType || ''), size: 12 },
      { text: 'Follower: ' + (data.followerType || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── RISE ANGLE ──', size: 14, bold: true },
      { text: data.riseAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DWELL ANGLE ──', size: 14, bold: true },
      { text: data.dwellAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RETURN ANGLE ──', size: 14, bold: true },
      { text: data.returnAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DISPLACEMENT ──', size: 14, bold: true },
      { text: data.displacement || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Cam Design', lines: lines });
  },

  generateCamDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.camName || 'Cam',
      title: 'Cam Design',
      subtitle: (data.camType || '') + '  |  Follower: ' + (data.followerType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Rise Angle', content: data.riseAngle || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Dwell Angle', content: data.dwellAngle || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Return Angle', content: data.returnAngle || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Displacement', content: data.displacement || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 12. LINKAGE DESIGN
  // ============================================================

  generateLinkageDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Linkage Design Document', content: [
        'Linkage: ' + (data.linkageName || 'N/A'),
        'Linkage Type: ' + (data.linkageType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Link Lengths', content: (data.linkLengths || 'Not specified').split('\n') },
      { heading: '2. Grashof Check', content: (data.grashofCheck || 'Not specified').split('\n') },
      { heading: '3. Transmission Angle', content: (data.transmissionAngle || 'Not specified').split('\n') },
      { heading: '4. Dead Points', content: (data.deadPoints || 'Not specified').split('\n') },
      { heading: '5. Application', content: (data.application || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Linkage Design – ' + (data.linkageName || ''), author: data.authorName || '', sections: sections });
  },

  generateLinkageDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['LINKAGE DESIGN'],
      ['Linkage Name', data.linkageName || ''],
      ['Linkage Type', data.linkageType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['LINK LENGTHS'], [data.linkLengths || ''],
      [], ['GRASHOF CHECK'], [data.grashofCheck || ''],
      [], ['TRANSMISSION ANGLE'], [data.transmissionAngle || ''],
      [], ['DEAD POINTS'], [data.deadPoints || ''],
      [], ['APPLICATION'], [data.application || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Linkage Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateLinkageDesignPDF: function(filename, data) {
    var lines = [
      { text: 'LINKAGE DESIGN', size: 18, bold: true },
      { text: (data.linkageName || '') + '  |  ' + (data.linkageType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── LINK LENGTHS ──', size: 14, bold: true },
      { text: data.linkLengths || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GRASHOF CHECK ──', size: 14, bold: true },
      { text: data.grashofCheck || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRANSMISSION ANGLE ──', size: 14, bold: true },
      { text: data.transmissionAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEAD POINTS ──', size: 14, bold: true },
      { text: data.deadPoints || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── APPLICATION ──', size: 14, bold: true },
      { text: data.application || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Linkage Design', lines: lines });
  },

  generateLinkageDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.linkageName || 'Linkage',
      title: 'Linkage Design',
      subtitle: (data.linkageType || '') + '  |  ' + (data.linkLengths || ''),
      perSlide: 2,
      sections: [
        { heading: 'Grashof Check', content: data.grashofCheck || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Transmission Angle', content: data.transmissionAngle || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Dead Points', content: data.deadPoints || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Application', content: data.application || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 13. RATCHET DESIGN
  // ============================================================

  generateRatchetDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Ratchet Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Ratchet Type: ' + (data.ratchetType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Tooth Count', content: ['Teeth: ' + (data.toothCount || 'N/A')] },
      { heading: '2. Pawl Design', content: (data.pawlDesign || 'Not specified').split('\n') },
      { heading: '3. Load Capacity', content: (data.loadCapacity || 'Not specified').split('\n') },
      { heading: '4. Index Angle', content: (data.indexAngle || 'Not specified').split('\n') },
      { heading: '5. Reversibility', content: (data.reversibility || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Ratchet Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateRatchetDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['RATCHET DESIGN'],
      ['System Name', data.systemName || ''],
      ['Ratchet Type', data.ratchetType || ''],
      ['Tooth Count', data.toothCount || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PAWL DESIGN'], [data.pawlDesign || ''],
      [], ['LOAD CAPACITY'], [data.loadCapacity || ''],
      [], ['INDEX ANGLE'], [data.indexAngle || ''],
      [], ['REVERSIBILITY'], [data.reversibility || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Ratchet Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateRatchetDesignPDF: function(filename, data) {
    var lines = [
      { text: 'RATCHET DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.ratchetType || ''), size: 12 },
      { text: 'Teeth: ' + (data.toothCount || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PAWL DESIGN ──', size: 14, bold: true },
      { text: data.pawlDesign || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LOAD CAPACITY ──', size: 14, bold: true },
      { text: data.loadCapacity || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INDEX ANGLE ──', size: 14, bold: true },
      { text: data.indexAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REVERSIBILITY ──', size: 14, bold: true },
      { text: data.reversibility || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Ratchet Design', lines: lines });
  },

  generateRatchetDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Ratchet Design',
      subtitle: (data.ratchetType || '') + '  |  Teeth: ' + (data.toothCount || ''),
      perSlide: 2,
      sections: [
        { heading: 'Pawl Design', content: data.pawlDesign || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Load Capacity', content: data.loadCapacity || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Index Angle', content: data.indexAngle || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Reversibility', content: data.reversibility || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 14. SCREW MECHANISM DESIGN
  // ============================================================

  generateScrewMechDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Screw Mechanism Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Screw Type: ' + (data.screwType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Lead', content: ['Lead: ' + (data.lead || 'N/A')] },
      { heading: '2. Pitch', content: ['Pitch: ' + (data.pitch || 'N/A')] },
      { heading: '3. Thread Angle', content: (data.threadAngle || 'Not specified').split('\n') },
      { heading: '4. Efficiency', content: (data.efficiency || 'Not specified').split('\n') },
      { heading: '5. Mechanical Advantage', content: (data.mechanicalAdvantage || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Screw Mechanism – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateScrewMechDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['SCREW MECHANISM DESIGN'],
      ['System Name', data.systemName || ''],
      ['Screw Type', data.screwType || ''],
      ['Lead', data.lead || ''],
      ['Pitch', data.pitch || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['THREAD ANGLE'], [data.threadAngle || ''],
      [], ['EFFICIENCY'], [data.efficiency || ''],
      [], ['MECHANICAL ADVANTAGE'], [data.mechanicalAdvantage || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Screw Mechanism');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateScrewMechDesignPDF: function(filename, data) {
    var lines = [
      { text: 'SCREW MECHANISM DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.screwType || ''), size: 12 },
      { text: 'Lead: ' + (data.lead || '') + '  |  Pitch: ' + (data.pitch || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── THREAD ANGLE ──', size: 14, bold: true },
      { text: data.threadAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EFFICIENCY ──', size: 14, bold: true },
      { text: data.efficiency || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MECHANICAL ADVANTAGE ──', size: 14, bold: true },
      { text: data.mechanicalAdvantage || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Screw Mechanism Design', lines: lines });
  },

  generateScrewMechDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Screw Mechanism Design',
      subtitle: (data.screwType || '') + '  |  Lead: ' + (data.lead || '') + '  |  Pitch: ' + (data.pitch || ''),
      perSlide: 2,
      sections: [
        { heading: 'Thread Angle', content: data.threadAngle || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Efficiency', content: data.efficiency || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Mechanical Advantage', content: data.mechanicalAdvantage || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 15. ESCAPEMENT DESIGN
  // ============================================================

  generateEscapementDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Escapement Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Escapement Type: ' + (data.escapementType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Beat Rate', content: ['Rate: ' + (data.beatRate || 'N/A')] },
      { heading: '2. Amplitude', content: (data.amplitude || 'Not specified').split('\n') },
      { heading: '3. Impulse Face', content: (data.impulseFace || 'Not specified').split('\n') },
      { heading: '4. Locking Angle', content: (data.lockingAngle || 'Not specified').split('\n') },
      { heading: '5. Efficiency', content: (data.efficiency || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Escapement Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateEscapementDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ESCAPEMENT DESIGN'],
      ['System Name', data.systemName || ''],
      ['Escapement Type', data.escapementType || ''],
      ['Beat Rate', data.beatRate || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['AMPLITUDE'], [data.amplitude || ''],
      [], ['IMPULSE FACE'], [data.impulseFace || ''],
      [], ['LOCKING ANGLE'], [data.lockingAngle || ''],
      [], ['EFFICIENCY'], [data.efficiency || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Escapement');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEscapementDesignPDF: function(filename, data) {
    var lines = [
      { text: 'ESCAPEMENT DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.escapementType || ''), size: 12 },
      { text: 'Beat Rate: ' + (data.beatRate || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── AMPLITUDE ──', size: 14, bold: true },
      { text: data.amplitude || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── IMPULSE FACE ──', size: 14, bold: true },
      { text: data.impulseFace || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LOCKING ANGLE ──', size: 14, bold: true },
      { text: data.lockingAngle || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EFFICIENCY ──', size: 14, bold: true },
      { text: data.efficiency || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Escapement Design', lines: lines });
  },

  generateEscapementDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Escapement Design',
      subtitle: (data.escapementType || '') + '  |  Beat Rate: ' + (data.beatRate || ''),
      perSlide: 2,
      sections: [
        { heading: 'Amplitude', content: data.amplitude || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Impulse Face', content: data.impulseFace || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Locking Angle', content: data.lockingAngle || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Efficiency', content: data.efficiency || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 16. GOVERNOR DESIGN
  // ============================================================

  generateGovernorDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Governor Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Governor Type: ' + (data.governorType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Speed Range', content: (data.speedRange || 'Not specified').split('\n') },
      { heading: '2. Sensitivity', content: (data.sensitivity || 'Not specified').split('\n') },
      { heading: '3. Stability', content: (data.stability || 'Not specified').split('\n') },
      { heading: '4. Response Time', content: (data.responseTime || 'Not specified').split('\n') },
      { heading: '5. Application', content: (data.application || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Governor Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateGovernorDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['GOVERNOR DESIGN'],
      ['System Name', data.systemName || ''],
      ['Governor Type', data.governorType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['SPEED RANGE'], [data.speedRange || ''],
      [], ['SENSITIVITY'], [data.sensitivity || ''],
      [], ['STABILITY'], [data.stability || ''],
      [], ['RESPONSE TIME'], [data.responseTime || ''],
      [], ['APPLICATION'], [data.application || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Governor Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateGovernorDesignPDF: function(filename, data) {
    var lines = [
      { text: 'GOVERNOR DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.governorType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SPEED RANGE ──', size: 14, bold: true },
      { text: data.speedRange || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SENSITIVITY ──', size: 14, bold: true },
      { text: data.sensitivity || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STABILITY ──', size: 14, bold: true },
      { text: data.stability || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RESPONSE TIME ──', size: 14, bold: true },
      { text: data.responseTime || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── APPLICATION ──', size: 14, bold: true },
      { text: data.application || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Governor Design', lines: lines });
  },

  generateGovernorDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Governor Design',
      subtitle: (data.governorType || '') + '  |  Speed Range: ' + (data.speedRange || ''),
      perSlide: 2,
      sections: [
        { heading: 'Sensitivity', content: data.sensitivity || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Stability', content: data.stability || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Response Time', content: data.responseTime || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Application', content: data.application || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 17. STRAIGHT-LINE MECHANISM DESIGN
  // ============================================================

  generateStraightLineDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Straight-Line Mechanism Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Linkage Type: ' + (data.linkageType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Link Dimensions', content: (data.linkDimensions || 'Not specified').split('\n') },
      { heading: '2. Accuracy', content: (data.accuracy || 'Not specified').split('\n') },
      { heading: '3. Stroke Length', content: (data.strokeLength || 'Not specified').split('\n') },
      { heading: '4. Deviation Error', content: (data.deviationError || 'Not specified').split('\n') },
      { heading: '5. Application', content: (data.application || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Straight-Line Mechanism – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateStraightLineDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['STRAIGHT-LINE MECHANISM DESIGN'],
      ['System Name', data.systemName || ''],
      ['Linkage Type', data.linkageType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['LINK DIMENSIONS'], [data.linkDimensions || ''],
      [], ['ACCURACY'], [data.accuracy || ''],
      [], ['STROKE LENGTH'], [data.strokeLength || ''],
      [], ['DEVIATION ERROR'], [data.deviationError || ''],
      [], ['APPLICATION'], [data.application || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Straight-Line');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateStraightLineDesignPDF: function(filename, data) {
    var lines = [
      { text: 'STRAIGHT-LINE MECHANISM DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.linkageType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── LINK DIMENSIONS ──', size: 14, bold: true },
      { text: data.linkDimensions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ACCURACY ──', size: 14, bold: true },
      { text: data.accuracy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STROKE LENGTH ──', size: 14, bold: true },
      { text: data.strokeLength || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEVIATION ERROR ──', size: 14, bold: true },
      { text: data.deviationError || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── APPLICATION ──', size: 14, bold: true },
      { text: data.application || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Straight-Line Mechanism Design', lines: lines });
  },

  generateStraightLineDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Straight-Line Mechanism Design',
      subtitle: (data.linkageType || '') + '  |  Stroke: ' + (data.strokeLength || ''),
      perSlide: 2,
      sections: [
        { heading: 'Link Dimensions', content: data.linkDimensions || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Accuracy', content: data.accuracy || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Deviation Error', content: data.deviationError || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Application', content: data.application || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 18. HYDRAULIC SYSTEM DESIGN
  // ============================================================

  generateHydraulicDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Hydraulic System Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Fluid Type: ' + (data.fluidType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Pressure', content: ['Pressure: ' + (data.pressure || 'N/A')] },
      { heading: '2. Cylinder Bore', content: (data.cylinderBore || 'Not specified').split('\n') },
      { heading: '3. Stroke Length', content: (data.strokeLength || 'Not specified').split('\n') },
      { heading: '4. Flow Rate', content: (data.flowRate || 'Not specified').split('\n') },
      { heading: '5. Valve Configuration', content: (data.valveConfig || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Hydraulic Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateHydraulicDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['HYDRAULIC SYSTEM DESIGN'],
      ['System Name', data.systemName || ''],
      ['Fluid Type', data.fluidType || ''],
      ['Pressure', data.pressure || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CYLINDER BORE'], [data.cylinderBore || ''],
      [], ['STROKE LENGTH'], [data.strokeLength || ''],
      [], ['FLOW RATE'], [data.flowRate || ''],
      [], ['VALVE CONFIGURATION'], [data.valveConfig || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Hydraulic Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateHydraulicDesignPDF: function(filename, data) {
    var lines = [
      { text: 'HYDRAULIC SYSTEM DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  Fluid: ' + (data.fluidType || ''), size: 12 },
      { text: 'Pressure: ' + (data.pressure || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CYLINDER BORE ──', size: 14, bold: true },
      { text: data.cylinderBore || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STROKE LENGTH ──', size: 14, bold: true },
      { text: data.strokeLength || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FLOW RATE ──', size: 14, bold: true },
      { text: data.flowRate || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── VALVE CONFIGURATION ──', size: 14, bold: true },
      { text: data.valveConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Hydraulic System Design', lines: lines });
  },

  generateHydraulicDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Hydraulic System Design',
      subtitle: 'Fluid: ' + (data.fluidType || '') + '  |  Pressure: ' + (data.pressure || ''),
      perSlide: 2,
      sections: [
        { heading: 'Cylinder Bore', content: data.cylinderBore || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Stroke Length', content: data.strokeLength || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Flow Rate', content: data.flowRate || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Valve Configuration', content: data.valveConfig || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 19. TURBINE DESIGN
  // ============================================================

  generateTurbineDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Turbine Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Turbine Type: ' + (data.turbineType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Head Height', content: ['Height: ' + (data.headHeight || 'N/A')] },
      { heading: '2. Flow Rate', content: (data.flowRate || 'Not specified').split('\n') },
      { heading: '3. RPM', content: (data.rpm || 'Not specified').split('\n') },
      { heading: '4. Efficiency', content: (data.efficiency || 'Not specified').split('\n') },
      { heading: '5. Power Output', content: (data.powerOutput || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Turbine Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateTurbineDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['TURBINE DESIGN'],
      ['System Name', data.systemName || ''],
      ['Turbine Type', data.turbineType || ''],
      ['Head Height', data.headHeight || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['FLOW RATE'], [data.flowRate || ''],
      [], ['RPM'], [data.rpm || ''],
      [], ['EFFICIENCY'], [data.efficiency || ''],
      [], ['POWER OUTPUT'], [data.powerOutput || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Turbine Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateTurbineDesignPDF: function(filename, data) {
    var lines = [
      { text: 'TURBINE DESIGN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.turbineType || ''), size: 12 },
      { text: 'Head: ' + (data.headHeight || '') + '  |  RPM: ' + (data.rpm || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FLOW RATE ──', size: 14, bold: true },
      { text: data.flowRate || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EFFICIENCY ──', size: 14, bold: true },
      { text: data.efficiency || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── POWER OUTPUT ──', size: 14, bold: true },
      { text: data.powerOutput || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Turbine Design', lines: lines });
  },

  generateTurbineDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Turbine Design',
      subtitle: (data.turbineType || '') + '  |  Head: ' + (data.headHeight || ''),
      perSlide: 2,
      sections: [
        { heading: 'Flow Rate', content: data.flowRate || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'RPM', content: data.rpm || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Efficiency', content: data.efficiency || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Power Output', content: data.powerOutput || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 20. STEAM ENGINE DOCUMENTATION
  // ============================================================

  generateSteamEngineDocWord: async function(filename, data) {
    var sections = [
      { heading: 'Steam Engine Documentation', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Engine Type: ' + (data.engineType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Bore', content: ['Bore: ' + (data.bore || 'N/A')] },
      { heading: '2. Stroke', content: ['Stroke: ' + (data.stroke || 'N/A')] },
      { heading: '3. Valve Gear', content: (data.valveGear || 'Not specified').split('\n') },
      { heading: '4. Cutoff', content: (data.cutoff || 'Not specified').split('\n') },
      { heading: '5. Mean Effective Pressure', content: (data.mep || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Steam Engine – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateSteamEngineDocExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['STEAM ENGINE DOCUMENTATION'],
      ['System Name', data.systemName || ''],
      ['Engine Type', data.engineType || ''],
      ['Bore', data.bore || ''],
      ['Stroke', data.stroke || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['VALVE GEAR'], [data.valveGear || ''],
      [], ['CUTOFF'], [data.cutoff || ''],
      [], ['MEAN EFFECTIVE PRESSURE'], [data.mep || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Steam Engine');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSteamEngineDocPDF: function(filename, data) {
    var lines = [
      { text: 'STEAM ENGINE DOCUMENTATION', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.engineType || ''), size: 12 },
      { text: 'Bore: ' + (data.bore || '') + '  |  Stroke: ' + (data.stroke || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── VALVE GEAR ──', size: 14, bold: true },
      { text: data.valveGear || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CUTOFF ──', size: 14, bold: true },
      { text: data.cutoff || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MEAN EFFECTIVE PRESSURE ──', size: 14, bold: true },
      { text: data.mep || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Steam Engine Documentation', lines: lines });
  },

  generateSteamEngineDocPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Steam Engine Documentation',
      subtitle: (data.engineType || '') + '  |  Bore: ' + (data.bore || '') + '  |  Stroke: ' + (data.stroke || ''),
      perSlide: 2,
      sections: [
        { heading: 'Valve Gear', content: data.valveGear || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Cutoff', content: data.cutoff || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Mean Effective Pressure', content: data.mep || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.navy }
      ]
    });
  },

  // ============================================================
  // 21. GEARMOTOR SPECIFICATION
  // ============================================================

  generateGearmotorSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'Gearmotor Specification Sheet', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Motor Type: ' + (data.motorType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Gear Type', content: ['Type: ' + (data.gearType || 'N/A')] },
      { heading: '2. Rated Torque', content: (data.ratedTorque || 'Not specified').split('\n') },
      { heading: '3. Rated Speed', content: (data.ratedSpeed || 'Not specified').split('\n') },
      { heading: '4. Voltage', content: (data.voltage || 'Not specified').split('\n') },
      { heading: '5. Encoder Type', content: (data.encoderType || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Gearmotor Spec – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateGearmotorSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['GEARMOTOR SPECIFICATION'],
      ['System Name', data.systemName || ''],
      ['Motor Type', data.motorType || ''],
      ['Gear Type', data.gearType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['RATED TORQUE'], [data.ratedTorque || ''],
      [], ['RATED SPEED'], [data.ratedSpeed || ''],
      [], ['VOLTAGE'], [data.voltage || ''],
      [], ['ENCODER TYPE'], [data.encoderType || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Gearmotor Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateGearmotorSpecPDF: function(filename, data) {
    var lines = [
      { text: 'GEARMOTOR SPECIFICATION', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.motorType || ''), size: 12 },
      { text: 'Gear Type: ' + (data.gearType || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── RATED TORQUE ──', size: 14, bold: true },
      { text: data.ratedTorque || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RATED SPEED ──', size: 14, bold: true },
      { text: data.ratedSpeed || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── VOLTAGE ──', size: 14, bold: true },
      { text: data.voltage || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ENCODER TYPE ──', size: 14, bold: true },
      { text: data.encoderType || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Gearmotor Specification', lines: lines });
  },

  generateGearmotorSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Gearmotor Specification',
      subtitle: (data.motorType || '') + '  |  ' + (data.gearType || ''),
      perSlide: 2,
      sections: [
        { heading: 'Rated Torque', content: data.ratedTorque || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Rated Speed', content: data.ratedSpeed || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Voltage', content: data.voltage || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Encoder Type', content: data.encoderType || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 22. EFFICIENCY ANALYSIS
  // ============================================================

  generateEfficiencyAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Efficiency Analysis Report', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Input Power: ' + (data.inputPower || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Output Power', content: ['Power: ' + (data.outputPower || 'N/A')] },
      { heading: '2. Losses', content: (data.losses || 'Not specified').split('\n') },
      { heading: '3. Backlash Specification', content: (data.backlashSpec || 'Not specified').split('\n') },
      { heading: '4. Contact Ratio', content: (data.contactRatio || 'Not specified').split('\n') },
      { heading: '5. Recommendations', content: (data.recommendations || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Efficiency Analysis – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateEfficiencyAnalysisExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['EFFICIENCY ANALYSIS REPORT'],
      ['System Name', data.systemName || ''],
      ['Input Power', data.inputPower || ''],
      ['Output Power', data.outputPower || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['LOSSES'], [data.losses || ''],
      [], ['BACKLASH SPECIFICATION'], [data.backlashSpec || ''],
      [], ['CONTACT RATIO'], [data.contactRatio || ''],
      [], ['RECOMMENDATIONS'], [data.recommendations || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Efficiency');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEfficiencyAnalysisPDF: function(filename, data) {
    var lines = [
      { text: 'EFFICIENCY ANALYSIS REPORT', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  Input: ' + (data.inputPower || ''), size: 12 },
      { text: 'Output: ' + (data.outputPower || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── LOSSES ──', size: 14, bold: true },
      { text: data.losses || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BACKLASH SPECIFICATION ──', size: 14, bold: true },
      { text: data.backlashSpec || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONTACT RATIO ──', size: 14, bold: true },
      { text: data.contactRatio || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RECOMMENDATIONS ──', size: 14, bold: true },
      { text: data.recommendations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Efficiency Analysis', lines: lines });
  },

  generateEfficiencyAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Efficiency Analysis Report',
      subtitle: 'Input: ' + (data.inputPower || '') + '  |  Output: ' + (data.outputPower || ''),
      perSlide: 2,
      sections: [
        { heading: 'Losses', content: data.losses || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Backlash Specification', content: data.backlashSpec || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Contact Ratio', content: data.contactRatio || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Recommendations', content: data.recommendations || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 23. VIBRATION ANALYSIS
  // ============================================================

  generateVibrationAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Vibration Analysis Report', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Frequency: ' + (data.frequency || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Amplitude', content: ['Amplitude: ' + (data.amplitude || 'N/A')] },
      { heading: '2. Source', content: (data.source || 'Not specified').split('\n') },
      { heading: '3. Natural Frequency', content: (data.naturalFreq || 'Not specified').split('\n') },
      { heading: '4. Damping', content: (data.damping || 'Not specified').split('\n') },
      { heading: '5. Remediation', content: (data.remediation || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Vibration Analysis – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateVibrationAnalysisExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['VIBRATION ANALYSIS REPORT'],
      ['System Name', data.systemName || ''],
      ['Frequency', data.frequency || ''],
      ['Amplitude', data.amplitude || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['SOURCE'], [data.source || ''],
      [], ['NATURAL FREQUENCY'], [data.naturalFreq || ''],
      [], ['DAMPING'], [data.damping || ''],
      [], ['REMEDIATION'], [data.remediation || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Vibration');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateVibrationAnalysisPDF: function(filename, data) {
    var lines = [
      { text: 'VIBRATION ANALYSIS REPORT', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  Freq: ' + (data.frequency || ''), size: 12 },
      { text: 'Amplitude: ' + (data.amplitude || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SOURCE ──', size: 14, bold: true },
      { text: data.source || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NATURAL FREQUENCY ──', size: 14, bold: true },
      { text: data.naturalFreq || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DAMPING ──', size: 14, bold: true },
      { text: data.damping || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REMEDIATION ──', size: 14, bold: true },
      { text: data.remediation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Vibration Analysis', lines: lines });
  },

  generateVibrationAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Vibration Analysis Report',
      subtitle: 'Frequency: ' + (data.frequency || '') + '  |  Amplitude: ' + (data.amplitude || ''),
      perSlide: 2,
      sections: [
        { heading: 'Source', content: data.source || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Natural Frequency', content: data.naturalFreq || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Damping', content: data.damping || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Remediation', content: data.remediation || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  },

  // ============================================================
  // 24. MATERIAL SPECIFICATION
  // ============================================================

  generateMaterialSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'Material Specification Sheet', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Gear Material: ' + (data.gearMaterial || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Hardness', content: ['Hardness: ' + (data.hardness || 'N/A')] },
      { heading: '2. Heat Treatment', content: (data.heatTreatment || 'Not specified').split('\n') },
      { heading: '3. Lubricant', content: (data.lubricant || 'Not specified').split('\n') },
      { heading: '4. Standard', content: (data.standard || 'Not specified').split('\n') },
      { heading: '5. Surface Finish', content: (data.surfaceFinish || 'Not specified').split('\n') },
      { heading: '6. Notes', content: (data.notes || 'None').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Material Spec – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateMaterialSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['MATERIAL SPECIFICATION SHEET'],
      ['System Name', data.systemName || ''],
      ['Gear Material', data.gearMaterial || ''],
      ['Hardness', data.hardness || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['HEAT TREATMENT'], [data.heatTreatment || ''],
      [], ['LUBRICANT'], [data.lubricant || ''],
      [], ['STANDARD'], [data.standard || ''],
      [], ['SURFACE FINISH'], [data.surfaceFinish || ''],
      [], ['NOTES'], [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Material Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMaterialSpecPDF: function(filename, data) {
    var lines = [
      { text: 'MATERIAL SPECIFICATION SHEET', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.gearMaterial || ''), size: 12 },
      { text: 'Hardness: ' + (data.hardness || ''), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── HEAT TREATMENT ──', size: 14, bold: true },
      { text: data.heatTreatment || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LUBRICANT ──', size: 14, bold: true },
      { text: data.lubricant || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STANDARD ──', size: 14, bold: true },
      { text: data.standard || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SURFACE FINISH ──', size: 14, bold: true },
      { text: data.surfaceFinish || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Material Specification', lines: lines });
  },

  generateMaterialSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Material Specification Sheet',
      subtitle: (data.gearMaterial || '') + '  |  Hardness: ' + (data.hardness || ''),
      perSlide: 2,
      sections: [
        { heading: 'Heat Treatment', content: data.heatTreatment || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Lubricant', content: data.lubricant || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Standard', content: data.standard || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Surface Finish', content: data.surfaceFinish || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Notes', content: data.notes || 'None', color: DocStyles.colors.blue }
      ]
    });
  }

});
