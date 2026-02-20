/**
 * Doc Generator – ARM Assembly Mastery Series
 * Extends DocGenerator with ARM assembly document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * DocTypes (10):
 *  1. ArmIsaReference        – ARM ISA Quick Reference Card
 *  2. ArmRegisterMap         – Register Map & Layout Worksheet
 *  3. ArmMemoryLayout        – Memory Layout & Stack Frame Planner
 *  4. ArmExceptionPlan       – Exception & Interrupt Handler Plan
 *  5. ArmPageTableConfig     – Page Table Configuration Worksheet
 *  6. ArmEmbeddedProject     – Embedded Project Planner (Cortex-M)
 *  7. ArmBootSequence        – Boot Sequence & Initialization Plan
 *  8. ArmPerfProfile         – Performance Profiling Worksheet
 *  9. ArmReverseEngWorksheet – Reverse Engineering Analysis Worksheet
 * 10. ArmSecurityAudit       – ARM Security Assessment & Audit
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. ARM ISA QUICK REFERENCE CARD
  // ============================================================

  generateArmIsaReferenceWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM ISA Quick Reference Card', content: [
        'Architecture: ' + (data.architecture || 'N/A'),
        'Profile: ' + (data.profile || 'N/A'),
        'Author: ' + (data.authorName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Target Architecture Details', content: [
        'ISA Version: ' + (data.architecture || 'N/A'),
        'Execution State: ' + (data.execState || 'N/A'),
        'Profile: ' + (data.profile || 'N/A')
      ]},
      { heading: '2. Key Instructions', content: (data.keyInstructions || 'Not specified').split('\n') },
      { heading: '3. Register Summary', content: (data.registers || 'Not specified').split('\n') },
      { heading: '4. Addressing Modes', content: (data.addressingModes || 'Not specified').split('\n') },
      { heading: '5. Condition Codes', content: (data.conditionCodes || 'Not specified').split('\n') },
      { heading: '6. Common Patterns & Idioms', content: (data.patterns || 'Not specified').split('\n') },
      { heading: '7. Notes & Gotchas', content: (data.notes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'ARM ISA Reference – ' + (data.architecture || ''), author: data.authorName || '', sections: sections });
  },

  generateArmIsaReferenceExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['ARM ISA QUICK REFERENCE CARD'],
      ['Architecture', data.architecture || ''],
      ['Execution State', data.execState || ''],
      ['Profile', data.profile || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['KEY INSTRUCTIONS'],
      [data.keyInstructions || ''],
      [],
      ['REGISTER SUMMARY'],
      [data.registers || ''],
      [],
      ['ADDRESSING MODES'],
      [data.addressingModes || ''],
      [],
      ['CONDITION CODES'],
      [data.conditionCodes || ''],
      [],
      ['COMMON PATTERNS'],
      [data.patterns || ''],
      [],
      ['NOTES & GOTCHAS'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(overview);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'ISA Reference');
    // Instruction matrix
    var instRows = [['Category', 'Mnemonic', 'Syntax', 'Description']];
    (data.keyInstructions || '').split('\n').forEach(function(line) {
      if (line.trim()) instRows.push([line.trim(), '', '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(instRows);
    ws2['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Instructions');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmIsaReferencePDF: function(filename, data) {
    var lines = [
      { text: 'ARM ISA QUICK REFERENCE CARD', size: 18, bold: true },
      { text: (data.architecture || '') + '  |  ' + (data.profile || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TARGET ARCHITECTURE ──', size: 14, bold: true },
      { text: 'ISA: ' + (data.architecture || 'N/A') + '  |  State: ' + (data.execState || 'N/A'), size: 10 },
      { text: 'Profile: ' + (data.profile || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY INSTRUCTIONS ──', size: 14, bold: true },
      { text: data.keyInstructions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REGISTER SUMMARY ──', size: 14, bold: true },
      { text: data.registers || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADDRESSING MODES ──', size: 14, bold: true },
      { text: data.addressingModes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONDITION CODES ──', size: 14, bold: true },
      { text: data.conditionCodes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMMON PATTERNS ──', size: 14, bold: true },
      { text: data.patterns || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES & GOTCHAS ──', size: 14, bold: true },
      { text: data.notes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'ARM ISA Reference Card', lines: lines });
  },


  // ============================================================
  // 2. REGISTER MAP & LAYOUT WORKSHEET
  // ============================================================

  generateArmRegisterMapWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Register Map & Layout Worksheet', content: [
        'Architecture: ' + (data.architecture || 'N/A'),
        'Author: ' + (data.authorName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. General-Purpose Registers', content: (data.gpRegisters || 'Not specified').split('\n') },
      { heading: '2. Special-Purpose Registers', content: (data.spRegisters || 'Not specified').split('\n') },
      { heading: '3. System Registers', content: (data.sysRegisters || 'Not specified').split('\n') },
      { heading: '4. SIMD/FP Registers', content: (data.simdRegisters || 'Not specified').split('\n') },
      { heading: '5. Register Allocation Plan', content: (data.allocPlan || 'Not specified').split('\n') },
      { heading: '6. Calling Convention Notes', content: (data.callingConv || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Register Map – ' + (data.architecture || ''), author: data.authorName || '', sections: sections });
  },

  generateArmRegisterMapExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var gp = [
      ['ARM REGISTER MAP'],
      ['Architecture', data.architecture || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['GENERAL-PURPOSE REGISTERS'],
      ['Register', 'AArch64 Name', 'Width', 'Role/Convention'],
    ];
    for (var i = 0; i <= 30; i++) {
      gp.push(['X' + i, i < 8 ? 'Argument / Result' : (i < 18 ? 'Temporary / Saved' : 'Platform'), '64-bit', '']);
    }
    gp.push(['SP', 'Stack Pointer', '64-bit', 'Stack operations']);
    gp.push(['XZR', 'Zero Register', '64-bit', 'Hardwired zero']);
    var ws1 = XLSX.utils.aoa_to_sheet(gp);
    ws1['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 12 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'GP Registers');
    // Special regs
    var sp = [
      ['SPECIAL-PURPOSE REGISTERS'],
      ['Register', 'Purpose', 'Access Level'],
      ['PC', 'Program Counter', 'Read-only (implicit)'],
      ['SP_EL0', 'User Stack Pointer', 'EL0'],
      ['SP_EL1', 'Kernel Stack Pointer', 'EL1'],
      ['SPSR_EL1', 'Saved Program Status', 'EL1'],
      ['ELR_EL1', 'Exception Link Register', 'EL1'],
      ['VBAR_EL1', 'Vector Base Address', 'EL1'],
      ['SCTLR_EL1', 'System Control', 'EL1'],
      ['TTBR0_EL1', 'Translation Table Base 0', 'EL1'],
      ['TTBR1_EL1', 'Translation Table Base 1', 'EL1'],
      [],
      ['ALLOCATION PLAN'],
      [data.allocPlan || ''],
      [],
      ['CALLING CONVENTION'],
      [data.callingConv || '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(sp);
    ws2['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Special Registers');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmRegisterMapPDF: function(filename, data) {
    var lines = [
      { text: 'ARM REGISTER MAP & LAYOUT', size: 18, bold: true },
      { text: 'Architecture: ' + (data.architecture || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── GENERAL-PURPOSE REGISTERS ──', size: 14, bold: true },
      { text: data.gpRegisters || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SPECIAL-PURPOSE REGISTERS ──', size: 14, bold: true },
      { text: data.spRegisters || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SYSTEM REGISTERS ──', size: 14, bold: true },
      { text: data.sysRegisters || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SIMD/FP REGISTERS ──', size: 14, bold: true },
      { text: data.simdRegisters || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REGISTER ALLOCATION PLAN ──', size: 14, bold: true },
      { text: data.allocPlan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CALLING CONVENTION NOTES ──', size: 14, bold: true },
      { text: data.callingConv || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'ARM Register Map', lines: lines });
  },


  // ============================================================
  // 3. MEMORY LAYOUT & STACK FRAME PLANNER
  // ============================================================

  generateArmMemoryLayoutWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Memory Layout & Stack Frame Planner', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Target: ' + (data.target || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Memory Map', content: (data.memoryMap || 'Not specified').split('\n') },
      { heading: '2. Stack Configuration', content: [
        'Stack Size: ' + (data.stackSize || 'N/A'),
        'Stack Growth: ' + (data.stackGrowth || 'Descending (Full)'),
        'Alignment: ' + (data.alignment || '16-byte')
      ]},
      { heading: '3. Heap Configuration', content: (data.heapConfig || 'Not specified').split('\n') },
      { heading: '4. Stack Frame Layout', content: (data.frameLayout || 'Not specified').split('\n') },
      { heading: '5. DMA Regions', content: (data.dmaRegions || 'Not specified').split('\n') },
      { heading: '6. Linker Script Notes', content: (data.linkerNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Memory Layout – ' + (data.projectName || ''), author: data.authorName || '', sections: sections });
  },

  generateArmMemoryLayoutExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var mem = [
      ['ARM MEMORY LAYOUT PLANNER'],
      ['Project', data.projectName || ''],
      ['Target', data.target || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['MEMORY MAP'],
      ['Region', 'Start Address', 'End Address', 'Size', 'Attributes'],
      ['Flash/ROM', '', '', '', 'RX'],
      ['SRAM', '', '', '', 'RWX'],
      ['Peripheral', '', '', '', 'Device'],
      ['Stack', '', '', '', 'RW'],
      ['Heap', '', '', '', 'RW'],
      [],
      ['STACK CONFIGURATION'],
      ['Stack Size', data.stackSize || ''],
      ['Growth Direction', data.stackGrowth || 'Descending'],
      ['Alignment', data.alignment || '16-byte'],
      [],
      ['FRAME LAYOUT'],
      [data.frameLayout || ''],
      [],
      ['DMA REGIONS'],
      [data.dmaRegions || ''],
      [],
      ['LINKER SCRIPT NOTES'],
      [data.linkerNotes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(mem);
    ws['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Memory Layout');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmMemoryLayoutPDF: function(filename, data) {
    var lines = [
      { text: 'ARM MEMORY LAYOUT & STACK FRAME PLANNER', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.target || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── MEMORY MAP ──', size: 14, bold: true },
      { text: data.memoryMap || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STACK CONFIGURATION ──', size: 14, bold: true },
      { text: 'Size: ' + (data.stackSize || 'N/A') + '  |  Growth: ' + (data.stackGrowth || 'Descending'), size: 10 },
      { text: 'Alignment: ' + (data.alignment || '16-byte'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── STACK FRAME LAYOUT ──', size: 14, bold: true },
      { text: data.frameLayout || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DMA REGIONS ──', size: 14, bold: true },
      { text: data.dmaRegions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LINKER SCRIPT NOTES ──', size: 14, bold: true },
      { text: data.linkerNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Memory Layout Planner', lines: lines });
  },


  // ============================================================
  // 4. EXCEPTION & INTERRUPT HANDLER PLAN
  // ============================================================

  generateArmExceptionPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Exception & Interrupt Handler Plan', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Target Core: ' + (data.targetCore || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Exception Levels Used', content: (data.exceptionLevels || 'Not specified').split('\n') },
      { heading: '2. Vector Table Layout', content: (data.vectorTable || 'Not specified').split('\n') },
      { heading: '3. Interrupt Sources', content: (data.interruptSources || 'Not specified').split('\n') },
      { heading: '4. Priority Configuration', content: (data.priorities || 'Not specified').split('\n') },
      { heading: '5. Handler Implementation Notes', content: (data.handlerNotes || 'Not specified').split('\n') },
      { heading: '6. Context Save/Restore Strategy', content: (data.contextStrategy || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Exception Plan – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateArmExceptionPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ARM EXCEPTION & INTERRUPT HANDLER PLAN'],
      ['System', data.systemName || ''],
      ['Target Core', data.targetCore || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['EXCEPTION LEVELS'],
      [data.exceptionLevels || ''],
      [],
      ['VECTOR TABLE LAYOUT'],
      ['Offset', 'Exception Type', 'Handler Label', 'Notes'],
      ['0x000', 'Synchronous (Current EL, SP0)', '', ''],
      ['0x080', 'IRQ (Current EL, SP0)', '', ''],
      ['0x100', 'FIQ (Current EL, SP0)', '', ''],
      ['0x180', 'SError (Current EL, SP0)', '', ''],
      ['0x200', 'Synchronous (Current EL, SPx)', '', ''],
      ['0x280', 'IRQ (Current EL, SPx)', '', ''],
      ['0x300', 'FIQ (Current EL, SPx)', '', ''],
      ['0x380', 'SError (Current EL, SPx)', '', ''],
      ['0x400', 'Synchronous (Lower EL, AArch64)', '', ''],
      ['0x480', 'IRQ (Lower EL, AArch64)', '', ''],
      [],
      ['INTERRUPT SOURCES'],
      [data.interruptSources || ''],
      [],
      ['PRIORITY CONFIGURATION'],
      [data.priorities || ''],
      [],
      ['CONTEXT SAVE/RESTORE'],
      [data.contextStrategy || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 12 }, { wch: 35 }, { wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Exception Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmExceptionPlanPDF: function(filename, data) {
    var lines = [
      { text: 'ARM EXCEPTION & INTERRUPT HANDLER PLAN', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.targetCore || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── EXCEPTION LEVELS ──', size: 14, bold: true },
      { text: data.exceptionLevels || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── VECTOR TABLE LAYOUT ──', size: 14, bold: true },
      { text: data.vectorTable || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERRUPT SOURCES ──', size: 14, bold: true },
      { text: data.interruptSources || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PRIORITY CONFIGURATION ──', size: 14, bold: true },
      { text: data.priorities || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HANDLER NOTES ──', size: 14, bold: true },
      { text: data.handlerNotes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONTEXT SAVE/RESTORE ──', size: 14, bold: true },
      { text: data.contextStrategy || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Exception & Interrupt Plan', lines: lines });
  },


  // ============================================================
  // 5. PAGE TABLE CONFIGURATION WORKSHEET
  // ============================================================

  generateArmPageTableConfigWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Page Table Configuration Worksheet', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Granule Size: ' + (data.granuleSize || '4KB'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Translation Scheme', content: [
        'Granule: ' + (data.granuleSize || '4KB'),
        'VA Size: ' + (data.vaSize || '48-bit'),
        'PA Size: ' + (data.paSize || '48-bit'),
        'Levels: ' + (data.levels || '4')
      ]},
      { heading: '2. Address Space Layout', content: (data.addressLayout || 'Not specified').split('\n') },
      { heading: '3. Memory Attributes', content: (data.memoryAttrs || 'Not specified').split('\n') },
      { heading: '4. Permission Model', content: (data.permissions || 'Not specified').split('\n') },
      { heading: '5. MAIR Configuration', content: (data.mairConfig || 'Not specified').split('\n') },
      { heading: '6. TLB Strategy', content: (data.tlbStrategy || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Page Table Config – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateArmPageTableConfigExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ARM PAGE TABLE CONFIGURATION'],
      ['System', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['TRANSLATION SCHEME'],
      ['Parameter', 'Value'],
      ['Granule Size', data.granuleSize || '4KB'],
      ['VA Size', data.vaSize || '48-bit'],
      ['PA Size', data.paSize || '48-bit'],
      ['Translation Levels', data.levels || '4'],
      [],
      ['ADDRESS SPACE LAYOUT'],
      [data.addressLayout || ''],
      [],
      ['MEMORY ATTRIBUTES'],
      [data.memoryAttrs || ''],
      [],
      ['PERMISSION MODEL'],
      [data.permissions || ''],
      [],
      ['MAIR CONFIGURATION'],
      [data.mairConfig || ''],
      [],
      ['TLB STRATEGY'],
      [data.tlbStrategy || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Page Table Config');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmPageTableConfigPDF: function(filename, data) {
    var lines = [
      { text: 'ARM PAGE TABLE CONFIGURATION', size: 18, bold: true },
      { text: (data.systemName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TRANSLATION SCHEME ──', size: 14, bold: true },
      { text: 'Granule: ' + (data.granuleSize || '4KB') + '  |  VA: ' + (data.vaSize || '48-bit') + '  |  PA: ' + (data.paSize || '48-bit'), size: 10 },
      { text: 'Levels: ' + (data.levels || '4'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADDRESS SPACE LAYOUT ──', size: 14, bold: true },
      { text: data.addressLayout || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MEMORY ATTRIBUTES ──', size: 14, bold: true },
      { text: data.memoryAttrs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERMISSION MODEL ──', size: 14, bold: true },
      { text: data.permissions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MAIR CONFIGURATION ──', size: 14, bold: true },
      { text: data.mairConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TLB STRATEGY ──', size: 14, bold: true },
      { text: data.tlbStrategy || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Page Table Configuration', lines: lines });
  },


  // ============================================================
  // 6. EMBEDDED PROJECT PLANNER (CORTEX-M)
  // ============================================================

  generateArmEmbeddedProjectWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Embedded Project Planner', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Target MCU: ' + (data.targetMcu || 'N/A'),
        'Author: ' + (data.authorName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. MCU Specifications', content: [
        'MCU: ' + (data.targetMcu || 'N/A'),
        'Core: ' + (data.coreType || 'N/A'),
        'Flash: ' + (data.flashSize || 'N/A'),
        'SRAM: ' + (data.sramSize || 'N/A'),
        'Clock: ' + (data.clockSpeed || 'N/A')
      ]},
      { heading: '2. Peripherals Used', content: (data.peripherals || 'Not specified').split('\n') },
      { heading: '3. Interrupt Configuration', content: (data.interrupts || 'Not specified').split('\n') },
      { heading: '4. Power Budget', content: (data.powerBudget || 'Not specified').split('\n') },
      { heading: '5. Firmware Architecture', content: (data.fwArchitecture || 'Not specified').split('\n') },
      { heading: '6. Pin Mapping', content: (data.pinMapping || 'Not specified').split('\n') },
      { heading: '7. Build & Flash Configuration', content: (data.buildConfig || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Embedded Project – ' + (data.projectName || ''), author: data.authorName || '', sections: sections });
  },

  generateArmEmbeddedProjectExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var spec = [
      ['ARM EMBEDDED PROJECT PLANNER'],
      ['Project', data.projectName || ''],
      ['Target MCU', data.targetMcu || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['MCU SPECIFICATIONS'],
      ['Parameter', 'Value'],
      ['Core', data.coreType || ''],
      ['Flash', data.flashSize || ''],
      ['SRAM', data.sramSize || ''],
      ['Clock Speed', data.clockSpeed || ''],
      [],
      ['PERIPHERALS'],
      [data.peripherals || ''],
      [],
      ['INTERRUPTS'],
      [data.interrupts || ''],
      [],
      ['POWER BUDGET'],
      [data.powerBudget || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(spec);
    ws1['!cols'] = [{ wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Specifications');
    var fw = [
      ['FIRMWARE ARCHITECTURE'],
      [data.fwArchitecture || ''],
      [],
      ['PIN MAPPING'],
      ['Pin', 'Function', 'Peripheral', 'Notes'],
      [data.pinMapping || ''],
      [],
      ['BUILD CONFIGURATION'],
      [data.buildConfig || '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(fw);
    ws2['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Architecture');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmEmbeddedProjectPDF: function(filename, data) {
    var lines = [
      { text: 'ARM EMBEDDED PROJECT PLANNER', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.targetMcu || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── MCU SPECIFICATIONS ──', size: 14, bold: true },
      { text: 'Core: ' + (data.coreType || 'N/A') + '  |  Flash: ' + (data.flashSize || 'N/A'), size: 10 },
      { text: 'SRAM: ' + (data.sramSize || 'N/A') + '  |  Clock: ' + (data.clockSpeed || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERIPHERALS ──', size: 14, bold: true },
      { text: data.peripherals || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERRUPTS ──', size: 14, bold: true },
      { text: data.interrupts || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── POWER BUDGET ──', size: 14, bold: true },
      { text: data.powerBudget || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FIRMWARE ARCHITECTURE ──', size: 14, bold: true },
      { text: data.fwArchitecture || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PIN MAPPING ──', size: 14, bold: true },
      { text: data.pinMapping || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BUILD CONFIGURATION ──', size: 14, bold: true },
      { text: data.buildConfig || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Embedded Project Planner', lines: lines });
  },


  // ============================================================
  // 7. BOOT SEQUENCE & INITIALIZATION PLAN
  // ============================================================

  generateArmBootSequenceWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Boot Sequence & Initialization Plan', content: [
        'Platform: ' + (data.platform || 'N/A'),
        'Target: ' + (data.target || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Boot Flow Stages', content: (data.bootStages || 'Not specified').split('\n') },
      { heading: '2. EL Transitions', content: (data.elTransitions || 'Not specified').split('\n') },
      { heading: '3. Early Hardware Init', content: (data.hwInit || 'Not specified').split('\n') },
      { heading: '4. MMU Setup', content: (data.mmuSetup || 'Not specified').split('\n') },
      { heading: '5. Device Tree / ACPI', content: (data.deviceTree || 'Not specified').split('\n') },
      { heading: '6. SMP Bring-up', content: (data.smpBringup || 'Not specified').split('\n') },
      { heading: '7. Firmware Components', content: (data.fwComponents || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Boot Sequence – ' + (data.platform || ''), author: data.authorName || '', sections: sections });
  },

  generateArmBootSequenceExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ARM BOOT SEQUENCE & INITIALIZATION PLAN'],
      ['Platform', data.platform || ''],
      ['Target', data.target || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['BOOT FLOW STAGES'],
      ['Stage', 'EL', 'Component', 'Action', 'Notes'],
      ['1. ROM', 'EL3', 'Boot ROM', 'Load BL1', ''],
      ['2. BL1', 'EL3', 'Trusted FW', 'Init security', ''],
      ['3. BL2', 'EL3→EL1', 'Trusted FW', 'Load images', ''],
      ['4. BL31', 'EL3', 'Runtime FW', 'PSCI services', ''],
      ['5. BL33', 'EL2/EL1', 'U-Boot/UEFI', 'Load kernel', ''],
      ['6. Kernel', 'EL1', 'Linux/RTOS', 'System init', ''],
      [],
      ['EL TRANSITIONS'],
      [data.elTransitions || ''],
      [],
      ['HARDWARE INIT'],
      [data.hwInit || ''],
      [],
      ['MMU SETUP'],
      [data.mmuSetup || ''],
      [],
      ['SMP BRING-UP'],
      [data.smpBringup || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 18 }, { wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Boot Sequence');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmBootSequencePDF: function(filename, data) {
    var lines = [
      { text: 'ARM BOOT SEQUENCE & INITIALIZATION PLAN', size: 18, bold: true },
      { text: (data.platform || '') + '  |  ' + (data.target || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BOOT FLOW STAGES ──', size: 14, bold: true },
      { text: data.bootStages || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EL TRANSITIONS ──', size: 14, bold: true },
      { text: data.elTransitions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EARLY HARDWARE INIT ──', size: 14, bold: true },
      { text: data.hwInit || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MMU SETUP ──', size: 14, bold: true },
      { text: data.mmuSetup || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEVICE TREE / ACPI ──', size: 14, bold: true },
      { text: data.deviceTree || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SMP BRING-UP ──', size: 14, bold: true },
      { text: data.smpBringup || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FIRMWARE COMPONENTS ──', size: 14, bold: true },
      { text: data.fwComponents || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Boot Sequence Plan', lines: lines });
  },


  // ============================================================
  // 8. PERFORMANCE PROFILING WORKSHEET
  // ============================================================

  generateArmPerfProfileWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Performance Profiling Worksheet', content: [
        'Application: ' + (data.appName || 'N/A'),
        'Target: ' + (data.target || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Hotspot Functions', content: (data.hotspots || 'Not specified').split('\n') },
      { heading: '2. PMU Counter Configuration', content: (data.pmuCounters || 'Not specified').split('\n') },
      { heading: '3. Cache Performance', content: [
        'L1D Hit Rate: ' + (data.l1dHitRate || 'N/A'),
        'L1I Hit Rate: ' + (data.l1iHitRate || 'N/A'),
        'L2 Hit Rate: ' + (data.l2HitRate || 'N/A'),
        'TLB Miss Rate: ' + (data.tlbMissRate || 'N/A')
      ]},
      { heading: '4. Branch Prediction Analysis', content: (data.branchAnalysis || 'Not specified').split('\n') },
      { heading: '5. Pipeline Stalls', content: (data.pipelineStalls || 'Not specified').split('\n') },
      { heading: '6. Optimization Plan', content: (data.optimizationPlan || 'Not specified').split('\n') },
      { heading: '7. Before/After Metrics', content: (data.metrics || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Perf Profile – ' + (data.appName || ''), author: data.authorName || '', sections: sections });
  },

  generateArmPerfProfileExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ARM PERFORMANCE PROFILING WORKSHEET'],
      ['Application', data.appName || ''],
      ['Target', data.target || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['HOTSPOT FUNCTIONS'],
      ['Function', '% CPU', 'IPC', 'Cache Miss Rate', 'Notes'],
      [data.hotspots || '', '', '', '', ''],
      [],
      ['CACHE PERFORMANCE'],
      ['Cache Level', 'Hit Rate', 'Miss Rate', 'Misses/1K Insn'],
      ['L1 Data', data.l1dHitRate || '', '', ''],
      ['L1 Instruction', data.l1iHitRate || '', '', ''],
      ['L2 Unified', data.l2HitRate || '', '', ''],
      ['TLB', '', data.tlbMissRate || '', ''],
      [],
      ['PMU COUNTERS'],
      [data.pmuCounters || ''],
      [],
      ['BRANCH PREDICTION'],
      [data.branchAnalysis || ''],
      [],
      ['PIPELINE STALLS'],
      [data.pipelineStalls || ''],
      [],
      ['OPTIMIZATION PLAN'],
      [data.optimizationPlan || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Perf Profile');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmPerfProfilePDF: function(filename, data) {
    var lines = [
      { text: 'ARM PERFORMANCE PROFILING WORKSHEET', size: 18, bold: true },
      { text: (data.appName || '') + '  |  ' + (data.target || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── HOTSPOT FUNCTIONS ──', size: 14, bold: true },
      { text: data.hotspots || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CACHE PERFORMANCE ──', size: 14, bold: true },
      { text: 'L1D: ' + (data.l1dHitRate || 'N/A') + '  |  L1I: ' + (data.l1iHitRate || 'N/A'), size: 10 },
      { text: 'L2: ' + (data.l2HitRate || 'N/A') + '  |  TLB Miss: ' + (data.tlbMissRate || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PMU COUNTERS ──', size: 14, bold: true },
      { text: data.pmuCounters || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BRANCH PREDICTION ──', size: 14, bold: true },
      { text: data.branchAnalysis || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PIPELINE STALLS ──', size: 14, bold: true },
      { text: data.pipelineStalls || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OPTIMIZATION PLAN ──', size: 14, bold: true },
      { text: data.optimizationPlan || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Performance Profiling Worksheet', lines: lines });
  },


  // ============================================================
  // 9. REVERSE ENGINEERING ANALYSIS WORKSHEET
  // ============================================================

  generateArmReverseEngWorksheetWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Reverse Engineering Analysis Worksheet', content: [
        'Binary: ' + (data.binaryName || 'N/A'),
        'Platform: ' + (data.platform || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Binary Overview', content: [
        'File Format: ' + (data.fileFormat || 'N/A'),
        'Architecture: ' + (data.architecture || 'N/A'),
        'Entry Point: ' + (data.entryPoint || 'N/A'),
        'Protections: ' + (data.protections || 'N/A')
      ]},
      { heading: '2. Section Analysis', content: (data.sections || 'Not specified').split('\n') },
      { heading: '3. Symbol Table', content: (data.symbols || 'Not specified').split('\n') },
      { heading: '4. Key Functions Identified', content: (data.keyFunctions || 'Not specified').split('\n') },
      { heading: '5. Control Flow Notes', content: (data.controlFlow || 'Not specified').split('\n') },
      { heading: '6. Strings of Interest', content: (data.strings || 'Not specified').split('\n') },
      { heading: '7. Findings & Observations', content: (data.findings || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'RE Analysis – ' + (data.binaryName || ''), author: data.authorName || '', sections: sections });
  },

  generateArmReverseEngWorksheetExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ARM REVERSE ENGINEERING ANALYSIS'],
      ['Binary', data.binaryName || ''],
      ['Platform', data.platform || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['BINARY OVERVIEW'],
      ['Parameter', 'Value'],
      ['File Format', data.fileFormat || ''],
      ['Architecture', data.architecture || ''],
      ['Entry Point', data.entryPoint || ''],
      ['Protections', data.protections || ''],
      [],
      ['SECTION ANALYSIS'],
      [data.sections || ''],
      [],
      ['KEY FUNCTIONS'],
      [data.keyFunctions || ''],
      [],
      ['CONTROL FLOW'],
      [data.controlFlow || ''],
      [],
      ['STRINGS OF INTEREST'],
      [data.strings || ''],
      [],
      ['FINDINGS'],
      [data.findings || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'RE Analysis');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmReverseEngWorksheetPDF: function(filename, data) {
    var lines = [
      { text: 'ARM REVERSE ENGINEERING ANALYSIS', size: 18, bold: true },
      { text: (data.binaryName || '') + '  |  ' + (data.platform || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BINARY OVERVIEW ──', size: 14, bold: true },
      { text: 'Format: ' + (data.fileFormat || 'N/A') + '  |  Arch: ' + (data.architecture || 'N/A'), size: 10 },
      { text: 'Entry: ' + (data.entryPoint || 'N/A') + '  |  Protections: ' + (data.protections || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── SECTION ANALYSIS ──', size: 14, bold: true },
      { text: data.sections || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY FUNCTIONS ──', size: 14, bold: true },
      { text: data.keyFunctions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONTROL FLOW ──', size: 14, bold: true },
      { text: data.controlFlow || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STRINGS OF INTEREST ──', size: 14, bold: true },
      { text: data.strings || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FINDINGS ──', size: 14, bold: true },
      { text: data.findings || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'RE Analysis Worksheet', lines: lines });
  },


  // ============================================================
  // 10. ARM SECURITY ASSESSMENT & AUDIT
  // ============================================================

  generateArmSecurityAuditWord: async function(filename, data) {
    var sections = [
      { heading: 'ARM Security Assessment & Audit', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Platform: ' + (data.platform || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Attack Surface', content: (data.attackSurface || 'Not specified').split('\n') },
      { heading: '2. Memory Protections', content: [
        'ASLR: ' + (data.aslr || 'N/A'),
        'Stack Canaries: ' + (data.stackCanaries || 'N/A'),
        'NX/XN: ' + (data.nxBit || 'N/A'),
        'PAC: ' + (data.pac || 'N/A'),
        'MTE: ' + (data.mte || 'N/A')
      ]},
      { heading: '3. TrustZone Configuration', content: (data.trustzone || 'Not specified').split('\n') },
      { heading: '4. Secure Boot Chain', content: (data.secureBoot || 'Not specified').split('\n') },
      { heading: '5. Known Vulnerabilities', content: (data.vulnerabilities || 'Not specified').split('\n') },
      { heading: '6. Mitigation Recommendations', content: (data.mitigations || 'Not specified').split('\n') },
      { heading: '7. Compliance Notes', content: (data.compliance || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Security Audit – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateArmSecurityAuditExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ARM SECURITY ASSESSMENT & AUDIT'],
      ['System', data.systemName || ''],
      ['Platform', data.platform || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['MEMORY PROTECTIONS'],
      ['Protection', 'Status', 'Configuration'],
      ['ASLR', data.aslr || '', ''],
      ['Stack Canaries', data.stackCanaries || '', ''],
      ['NX/XN Bit', data.nxBit || '', ''],
      ['Pointer Auth (PAC)', data.pac || '', ''],
      ['Memory Tagging (MTE)', data.mte || '', ''],
      [],
      ['ATTACK SURFACE'],
      [data.attackSurface || ''],
      [],
      ['TRUSTZONE CONFIGURATION'],
      [data.trustzone || ''],
      [],
      ['SECURE BOOT CHAIN'],
      [data.secureBoot || ''],
      [],
      ['KNOWN VULNERABILITIES'],
      [data.vulnerabilities || ''],
      [],
      ['MITIGATIONS'],
      [data.mitigations || ''],
      [],
      ['COMPLIANCE'],
      [data.compliance || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Security Audit');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArmSecurityAuditPDF: function(filename, data) {
    var lines = [
      { text: 'ARM SECURITY ASSESSMENT & AUDIT', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.platform || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ATTACK SURFACE ──', size: 14, bold: true },
      { text: data.attackSurface || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MEMORY PROTECTIONS ──', size: 14, bold: true },
      { text: 'ASLR: ' + (data.aslr || 'N/A') + '  |  Canaries: ' + (data.stackCanaries || 'N/A'), size: 10 },
      { text: 'NX/XN: ' + (data.nxBit || 'N/A') + '  |  PAC: ' + (data.pac || 'N/A') + '  |  MTE: ' + (data.mte || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRUSTZONE ──', size: 14, bold: true },
      { text: data.trustzone || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SECURE BOOT CHAIN ──', size: 14, bold: true },
      { text: data.secureBoot || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── VULNERABILITIES ──', size: 14, bold: true },
      { text: data.vulnerabilities || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MITIGATIONS ──', size: 14, bold: true },
      { text: data.mitigations || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPLIANCE ──', size: 14, bold: true },
      { text: data.compliance || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Security Assessment', lines: lines });
  }

});
