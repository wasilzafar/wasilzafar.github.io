/**
 * Doc Generator – CMSIS Embedded Systems Series
 * Extends DocGenerator with CMSIS document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * DocTypes (10):
 *  1. CmsisEcosystem      – CMSIS Ecosystem Assessment (Part 1)
 *  2. CmsisCoreConfig     – CMSIS-Core Register & Startup Configuration (Parts 2-3)
 *  3. CmsisRtosDesign     – CMSIS-RTOS2 Thread & IPC Design (Parts 4-5)
 *  4. CmsisDspPipeline    – CMSIS-DSP Signal Processing Spec (Part 6)
 *  5. CmsisDriverSpec     – CMSIS-Driver Peripheral Specification (Part 7)
 *  6. CmsisFirmwareDesign – Embedded Firmware Design Document (Parts 8-16)
 *  7. CmsisDebugPlan      – CMSIS Debug & Trace Session Plan (Part 9)
 *  8. CmsisTesting        – Embedded Test Plan (Part 17)
 *  9. CmsisArchitecture   – Embedded Software Architecture (Parts 18-19)
 * 10. CmsisWorkflow       – Professional Embedded Workflow (Part 20)
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. CMSIS ECOSYSTEM ASSESSMENT
  // ============================================================

  generateCmsisEcosystemWord: async function(filename, data) {
    var sections = [
      { heading: 'CMSIS Ecosystem Assessment', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'MCU: ' + (data.mcu || 'N/A'),
        'Cortex Core: ' + (data.cortexCore || 'N/A'),
        'Compiler: ' + (data.compiler || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. CMSIS Components', content: (data.components || 'Not specified').split('\n') },
      { heading: '2. Memory Configuration', content: (data.memoryConfig || 'Not specified').split('\n') },
      { heading: '3. Project Goals', content: (data.projectGoals || 'Not specified').split('\n') },
      { heading: '4. Challenges & Risks', content: (data.challenges || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'CMSIS Ecosystem – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisEcosystemExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['CMSIS ECOSYSTEM ASSESSMENT'],
      ['Project', data.projectName || ''],
      ['MCU', data.mcu || ''],
      ['Cortex Core', data.cortexCore || ''],
      ['Compiler', data.compiler || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PROJECT GOALS'],
      [data.projectGoals || ''],
      [],
      ['CHALLENGES & RISKS'],
      [data.challenges || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var detail = [
      ['CMSIS COMPONENTS'],
      ['Component', 'Version', 'Purpose', 'Notes'],
      [data.components || '', '', '', ''],
      [],
      ['MEMORY CONFIGURATION'],
      ['Region', 'Origin', 'Size', 'Attributes'],
      [data.memoryConfig || '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(detail);
    ws2['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Components');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisEcosystemPDF: function(filename, data) {
    var lines = [
      { text: 'CMSIS ECOSYSTEM ASSESSMENT', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.mcu || ''), size: 12 },
      { text: 'Core: ' + (data.cortexCore || 'N/A') + '  |  Compiler: ' + (data.compiler || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CMSIS COMPONENTS ──', size: 14, bold: true },
      { text: data.components || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MEMORY CONFIGURATION ──', size: 14, bold: true },
      { text: data.memoryConfig || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROJECT GOALS ──', size: 14, bold: true },
      { text: data.projectGoals || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CHALLENGES & RISKS ──', size: 14, bold: true },
      { text: data.challenges || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'CMSIS Ecosystem Assessment', lines: lines });
  },

  generateCmsisEcosystemPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'CMSIS Ecosystem Assessment',
      subtitle: (data.mcu || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Project Overview', content: 'MCU: ' + (data.mcu || 'N/A') + '\nCore: ' + (data.cortexCore || 'N/A') + '\nCompiler: ' + (data.compiler || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'CMSIS Components', content: data.components || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Memory Configuration', content: data.memoryConfig || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Project Goals', content: data.projectGoals || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Challenges & Risks', content: data.challenges || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },


  // ============================================================
  // 2. CMSIS-CORE REGISTER & STARTUP CONFIGURATION
  // ============================================================

  generateCmsisCoreConfigWord: async function(filename, data) {
    var sections = [
      { heading: 'CMSIS-Core Register & Startup Configuration', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'MCU: ' + (data.mcu || 'N/A'),
        'Cortex Core: ' + (data.cortexCore || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. NVIC Configuration', content: [
        'Priority Bits: ' + (data.nvicPriorityBits || 'N/A'),
        'Priority Grouping: ' + (data.priorityGrouping || 'N/A')
      ]},
      { heading: '2. Interrupt List', content: (data.interruptList || 'Not specified').split('\n') },
      { heading: '3. SysTick Configuration', content: [
        'SysTick Frequency: ' + (data.sysTickFreq || 'N/A')
      ]},
      { heading: '4. Memory Map', content: [
        'Flash Origin: ' + (data.flashOrigin || 'N/A'),
        'Flash Size: ' + (data.flashSize || 'N/A'),
        'SRAM Origin: ' + (data.sramOrigin || 'N/A'),
        'SRAM Size: ' + (data.sramSize || 'N/A')
      ]},
      { heading: '5. Stack & Heap', content: [
        'Stack Size: ' + (data.stackSize || 'N/A'),
        'Heap Size: ' + (data.heapSize || 'N/A')
      ]},
      { heading: '6. Custom Sections', content: (data.customSections || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'CMSIS-Core Config – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisCoreConfigExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['CMSIS-CORE REGISTER & STARTUP CONFIGURATION'],
      ['Project', data.projectName || ''],
      ['MCU', data.mcu || ''],
      ['Cortex Core', data.cortexCore || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['NVIC CONFIGURATION'],
      ['Parameter', 'Value'],
      ['Priority Bits', data.nvicPriorityBits || ''],
      ['Priority Grouping', data.priorityGrouping || ''],
      ['SysTick Frequency', data.sysTickFreq || ''],
      [],
      ['MEMORY MAP'],
      ['Region', 'Origin', 'Size'],
      ['Flash', data.flashOrigin || '', data.flashSize || ''],
      ['SRAM', data.sramOrigin || '', data.sramSize || ''],
      [],
      ['STACK & HEAP'],
      ['Stack Size', data.stackSize || ''],
      ['Heap Size', data.heapSize || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var detail = [
      ['INTERRUPT LIST'],
      ['IRQ Name', 'IRQ Number', 'Priority', 'Handler', 'Notes'],
      [data.interruptList || '', '', '', '', ''],
      [],
      ['CUSTOM SECTIONS'],
      ['Section Name', 'Origin', 'Size', 'Notes'],
      [data.customSections || '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(detail);
    ws2['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 12 }, { wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Interrupts & Sections');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisCoreConfigPDF: function(filename, data) {
    var lines = [
      { text: 'CMSIS-CORE REGISTER & STARTUP CONFIGURATION', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.mcu || ''), size: 12 },
      { text: 'Core: ' + (data.cortexCore || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── NVIC CONFIGURATION ──', size: 14, bold: true },
      { text: 'Priority Bits: ' + (data.nvicPriorityBits || 'N/A') + '  |  Grouping: ' + (data.priorityGrouping || 'N/A'), size: 10 },
      { text: 'SysTick Freq: ' + (data.sysTickFreq || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERRUPT LIST ──', size: 14, bold: true },
      { text: data.interruptList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MEMORY MAP ──', size: 14, bold: true },
      { text: 'Flash: ' + (data.flashOrigin || 'N/A') + '  Size: ' + (data.flashSize || 'N/A'), size: 10 },
      { text: 'SRAM: ' + (data.sramOrigin || 'N/A') + '  Size: ' + (data.sramSize || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── STACK & HEAP ──', size: 14, bold: true },
      { text: 'Stack: ' + (data.stackSize || 'N/A') + '  |  Heap: ' + (data.heapSize || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CUSTOM SECTIONS ──', size: 14, bold: true },
      { text: data.customSections || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'CMSIS-Core Configuration', lines: lines });
  },

  generateCmsisCoreConfigPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'CMSIS-Core Register & Startup Configuration',
      subtitle: (data.mcu || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'MCU & Core', content: 'MCU: ' + (data.mcu || 'N/A') + '\nCore: ' + (data.cortexCore || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'NVIC Configuration', content: 'Priority Bits: ' + (data.nvicPriorityBits || 'N/A') + '\nGrouping: ' + (data.priorityGrouping || 'N/A') + '\nSysTick: ' + (data.sysTickFreq || 'N/A'), color: DocStyles.colors.teal },
        { heading: 'Interrupt List', content: data.interruptList || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Memory Map', content: 'Flash: ' + (data.flashOrigin || 'N/A') + ' / ' + (data.flashSize || 'N/A') + '\nSRAM: ' + (data.sramOrigin || 'N/A') + ' / ' + (data.sramSize || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Stack & Heap', content: 'Stack: ' + (data.stackSize || 'N/A') + '\nHeap: ' + (data.heapSize || 'N/A'), color: DocStyles.colors.teal },
        { heading: 'Custom Sections', content: data.customSections || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 3. CMSIS-RTOS2 THREAD & IPC DESIGN
  // ============================================================

  generateCmsisRtosDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'CMSIS-RTOS2 Thread & IPC Design', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'RTOS Kernel: ' + (data.rtosKernel || 'N/A'),
        'Tick Rate: ' + (data.tickRate || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Task / Thread List', content: (data.taskList || 'Not specified').split('\n') },
      { heading: '2. Mutex List', content: (data.mutexList || 'Not specified').split('\n') },
      { heading: '3. Semaphore List', content: (data.semaphoreList || 'Not specified').split('\n') },
      { heading: '4. Message Queues', content: (data.messageQueues || 'Not specified').split('\n') },
      { heading: '5. Event Flag Groups', content: (data.eventFlagGroups || 'Not specified').split('\n') },
      { heading: '6. ISR-to-Thread Communications', content: (data.isrToThreadComms || 'Not specified').split('\n') },
      { heading: '7. Design Pattern', content: (data.designPattern || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'RTOS Design – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisRtosDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['CMSIS-RTOS2 THREAD & IPC DESIGN'],
      ['Project', data.projectName || ''],
      ['RTOS Kernel', data.rtosKernel || ''],
      ['Tick Rate', data.tickRate || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['ISR-TO-THREAD COMMUNICATIONS'],
      [data.isrToThreadComms || ''],
      [],
      ['DESIGN PATTERN'],
      [data.designPattern || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var ipc = [
      ['THREAD LIST'],
      ['Thread Name', 'Priority', 'Stack Size', 'Period / Event', 'Notes'],
      [data.taskList || '', '', '', '', ''],
      [],
      ['MUTEX LIST'],
      ['Mutex Name', 'Owner Thread', 'Protected Resource', 'Notes'],
      [data.mutexList || '', '', '', ''],
      [],
      ['SEMAPHORE LIST'],
      ['Semaphore Name', 'Initial Count', 'Max Count', 'Notes'],
      [data.semaphoreList || '', '', '', ''],
      [],
      ['MESSAGE QUEUES'],
      ['Queue Name', 'Message Type', 'Depth', 'Producer', 'Consumer'],
      [data.messageQueues || '', '', '', '', ''],
      [],
      ['EVENT FLAG GROUPS'],
      ['Group Name', 'Flags', 'Waiting Threads', 'Notes'],
      [data.eventFlagGroups || '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(ipc);
    ws2['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'IPC Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisRtosDesignPDF: function(filename, data) {
    var lines = [
      { text: 'CMSIS-RTOS2 THREAD & IPC DESIGN', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.rtosKernel || ''), size: 12 },
      { text: 'Tick Rate: ' + (data.tickRate || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TASK / THREAD LIST ──', size: 14, bold: true },
      { text: data.taskList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MUTEXES ──', size: 14, bold: true },
      { text: data.mutexList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SEMAPHORES ──', size: 14, bold: true },
      { text: data.semaphoreList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MESSAGE QUEUES ──', size: 14, bold: true },
      { text: data.messageQueues || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVENT FLAG GROUPS ──', size: 14, bold: true },
      { text: data.eventFlagGroups || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ISR-TO-THREAD COMMS ──', size: 14, bold: true },
      { text: data.isrToThreadComms || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DESIGN PATTERN ──', size: 14, bold: true },
      { text: data.designPattern || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'CMSIS-RTOS2 Thread & IPC Design', lines: lines });
  },

  generateCmsisRtosDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'CMSIS-RTOS2 Thread & IPC Design',
      subtitle: (data.rtosKernel || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'RTOS Overview', content: 'Kernel: ' + (data.rtosKernel || 'N/A') + '\nTick Rate: ' + (data.tickRate || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Task / Thread List', content: data.taskList || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Mutexes & Semaphores', content: 'Mutexes:\n' + (data.mutexList || 'N/A') + '\n\nSemaphores:\n' + (data.semaphoreList || 'N/A'), color: DocStyles.colors.blue },
        { heading: 'Message Queues', content: data.messageQueues || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Event Flag Groups', content: data.eventFlagGroups || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'ISR-to-Thread Comms', content: data.isrToThreadComms || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Design Pattern', content: data.designPattern || 'Not specified', color: DocStyles.colors.navy }
      ]
    });
  },


  // ============================================================
  // 4. CMSIS-DSP SIGNAL PROCESSING SPEC
  // ============================================================

  generateCmsisDspPipelineWord: async function(filename, data) {
    var sections = [
      { heading: 'CMSIS-DSP Signal Processing Specification', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Signal Source: ' + (data.signalSource || 'N/A'),
        'Sample Rate: ' + (data.sampleRate || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Data Format', content: [
        'Format: ' + (data.dataFormat || 'N/A')
      ]},
      { heading: '2. Filter Specification', content: [
        'Filter Type: ' + (data.filterType || 'N/A'),
        'Filter Taps: ' + (data.filterTaps || 'N/A')
      ]},
      { heading: '3. FFT Configuration', content: [
        'FFT Size: ' + (data.fftSize || 'N/A'),
        'Window Function: ' + (data.windowFunction || 'N/A')
      ]},
      { heading: '4. Output Format', content: (data.outputFormat || 'Not specified').split('\n') },
      { heading: '5. Performance Target', content: (data.performanceTarget || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'DSP Pipeline – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisDspPipelineExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['CMSIS-DSP SIGNAL PROCESSING SPECIFICATION'],
      ['Project', data.projectName || ''],
      ['Signal Source', data.signalSource || ''],
      ['Sample Rate', data.sampleRate || ''],
      ['Data Format', data.dataFormat || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['OUTPUT FORMAT'],
      [data.outputFormat || ''],
      [],
      ['PERFORMANCE TARGET'],
      [data.performanceTarget || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var pipeline = [
      ['DSP PIPELINE DETAIL'],
      ['Stage', 'Parameter', 'Value', 'Notes'],
      ['Filter', 'Type', data.filterType || '', ''],
      ['Filter', 'Taps', data.filterTaps || '', ''],
      ['FFT', 'Size', data.fftSize || '', ''],
      ['FFT', 'Window Function', data.windowFunction || '', ''],
      [],
      ['BENCHMARK TARGETS'],
      ['Metric', 'Target', 'Actual', 'Status'],
      [data.performanceTarget || '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(pipeline);
    ws2['!cols'] = [{ wch: 16 }, { wch: 22 }, { wch: 22 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Pipeline');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisDspPipelinePDF: function(filename, data) {
    var lines = [
      { text: 'CMSIS-DSP SIGNAL PROCESSING SPECIFICATION', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.signalSource || ''), size: 12 },
      { text: 'Sample Rate: ' + (data.sampleRate || 'N/A') + '  |  Format: ' + (data.dataFormat || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FILTER SPECIFICATION ──', size: 14, bold: true },
      { text: 'Type: ' + (data.filterType || 'N/A') + '  |  Taps: ' + (data.filterTaps || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── FFT CONFIGURATION ──', size: 14, bold: true },
      { text: 'FFT Size: ' + (data.fftSize || 'N/A') + '  |  Window: ' + (data.windowFunction || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── OUTPUT FORMAT ──', size: 14, bold: true },
      { text: data.outputFormat || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERFORMANCE TARGET ──', size: 14, bold: true },
      { text: data.performanceTarget || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'CMSIS-DSP Signal Processing Spec', lines: lines });
  },

  generateCmsisDspPipelinePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'CMSIS-DSP Signal Processing Specification',
      subtitle: (data.signalSource || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Signal Overview', content: 'Source: ' + (data.signalSource || 'N/A') + '\nSample Rate: ' + (data.sampleRate || 'N/A') + '\nFormat: ' + (data.dataFormat || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Filter Specification', content: 'Type: ' + (data.filterType || 'N/A') + '\nTaps: ' + (data.filterTaps || 'N/A'), color: DocStyles.colors.teal },
        { heading: 'FFT Configuration', content: 'Size: ' + (data.fftSize || 'N/A') + '\nWindow: ' + (data.windowFunction || 'N/A'), color: DocStyles.colors.blue },
        { heading: 'Output Format', content: data.outputFormat || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Performance Target', content: data.performanceTarget || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },


  // ============================================================
  // 5. CMSIS-DRIVER PERIPHERAL SPECIFICATION
  // ============================================================

  generateCmsisDriverSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'CMSIS-Driver Peripheral Specification', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Interface: ' + (data.interface || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Interface Parameters', content: [
        'Baud Rate / Speed: ' + (data.baudRate || 'N/A'),
        'DMA Enabled: ' + (data.dmaEnabled || 'N/A'),
        'Transfer Mode: ' + (data.transferMode || 'N/A')
      ]},
      { heading: '2. Callback Events', content: (data.callbackEvents || 'Not specified').split('\n') },
      { heading: '3. RTOS Blocking Mode', content: (data.rtosBlocking || 'Not specified').split('\n') },
      { heading: '4. Error Handling', content: (data.errorHandling || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Driver Spec – ' + (data.interface || '') + ' – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisDriverSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['CMSIS-DRIVER PERIPHERAL SPECIFICATION'],
      ['Project', data.projectName || ''],
      ['Interface', data.interface || ''],
      ['Baud Rate / Speed', data.baudRate || ''],
      ['DMA Enabled', data.dmaEnabled || ''],
      ['Transfer Mode', data.transferMode || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['RTOS BLOCKING MODE'],
      [data.rtosBlocking || ''],
      [],
      ['ERROR HANDLING'],
      [data.errorHandling || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var events = [
      ['CALLBACK EVENTS'],
      ['Event Name', 'Trigger Condition', 'Handler Action', 'Notes'],
      [data.callbackEvents || '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(events);
    ws2['!cols'] = [{ wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Callback Events');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisDriverSpecPDF: function(filename, data) {
    var lines = [
      { text: 'CMSIS-DRIVER PERIPHERAL SPECIFICATION', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.interface || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── INTERFACE PARAMETERS ──', size: 14, bold: true },
      { text: 'Baud Rate: ' + (data.baudRate || 'N/A') + '  |  DMA: ' + (data.dmaEnabled || 'N/A'), size: 10 },
      { text: 'Transfer Mode: ' + (data.transferMode || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CALLBACK EVENTS ──', size: 14, bold: true },
      { text: data.callbackEvents || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RTOS BLOCKING MODE ──', size: 14, bold: true },
      { text: data.rtosBlocking || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ERROR HANDLING ──', size: 14, bold: true },
      { text: data.errorHandling || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'CMSIS-Driver Peripheral Spec', lines: lines });
  },

  generateCmsisDriverSpecPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'CMSIS-Driver Peripheral Specification',
      subtitle: (data.interface || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Interface Parameters', content: 'Interface: ' + (data.interface || 'N/A') + '\nBaud Rate: ' + (data.baudRate || 'N/A') + '\nDMA: ' + (data.dmaEnabled || 'N/A') + '\nMode: ' + (data.transferMode || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Callback Events', content: data.callbackEvents || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'RTOS Blocking Mode', content: data.rtosBlocking || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Error Handling', content: data.errorHandling || 'Not specified', color: DocStyles.colors.navy }
      ]
    });
  },


  // ============================================================
  // 6. EMBEDDED FIRMWARE DESIGN DOCUMENT
  // ============================================================

  generateCmsisFirmwareDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Embedded Firmware Design Document', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'MCU: ' + (data.mcu || 'N/A'),
        'Design Area: ' + (data.designArea || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Requirements', content: (data.requirements || 'Not specified').split('\n') },
      { heading: '2. Constraints', content: (data.constraints || 'Not specified').split('\n') },
      { heading: '3. Approach', content: (data.approach || 'Not specified').split('\n') },
      { heading: '4. Tradeoffs', content: (data.tradeoffs || 'Not specified').split('\n') },
      { heading: '5. Test Criteria', content: (data.testCriteria || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Firmware Design – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisFirmwareDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['EMBEDDED FIRMWARE DESIGN DOCUMENT'],
      ['Project', data.projectName || ''],
      ['MCU', data.mcu || ''],
      ['Design Area', data.designArea || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['REQUIREMENTS'],
      [data.requirements || ''],
      [],
      ['CONSTRAINTS'],
      [data.constraints || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var design = [
      ['DESIGN APPROACH'],
      [data.approach || ''],
      [],
      ['TRADEOFFS'],
      ['Option', 'Pros', 'Cons', 'Decision'],
      [data.tradeoffs || '', '', '', ''],
      [],
      ['TEST CRITERIA'],
      ['Criterion', 'Method', 'Pass Condition', 'Notes'],
      [data.testCriteria || '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(design);
    ws2['!cols'] = [{ wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Design Detail');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisFirmwareDesignPDF: function(filename, data) {
    var lines = [
      { text: 'EMBEDDED FIRMWARE DESIGN DOCUMENT', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.mcu || ''), size: 12 },
      { text: 'Design Area: ' + (data.designArea || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── REQUIREMENTS ──', size: 14, bold: true },
      { text: data.requirements || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONSTRAINTS ──', size: 14, bold: true },
      { text: data.constraints || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── APPROACH ──', size: 14, bold: true },
      { text: data.approach || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRADEOFFS ──', size: 14, bold: true },
      { text: data.tradeoffs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TEST CRITERIA ──', size: 14, bold: true },
      { text: data.testCriteria || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Embedded Firmware Design Document', lines: lines });
  },

  generateCmsisFirmwareDesignPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Embedded Firmware Design Document',
      subtitle: (data.mcu || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Project Context', content: 'MCU: ' + (data.mcu || 'N/A') + '\nDesign Area: ' + (data.designArea || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Requirements', content: data.requirements || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Constraints', content: data.constraints || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Approach', content: data.approach || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Tradeoffs', content: data.tradeoffs || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Test Criteria', content: data.testCriteria || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 7. CMSIS DEBUG & TRACE SESSION PLAN
  // ============================================================

  generateCmsisDebugPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'CMSIS Debug & Trace Session Plan', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Debug Probe: ' + (data.debugProbe || 'N/A'),
        'Interface: ' + (data.interface || 'N/A'),
        'Target MCU: ' + (data.targetMcu || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Breakpoint List', content: (data.breakpointList || 'Not specified').split('\n') },
      { heading: '2. Watchpoints', content: (data.watchpoints || 'Not specified').split('\n') },
      { heading: '3. ITM Ports', content: (data.itmPorts || 'Not specified').split('\n') },
      { heading: '4. Fault Log Strategy', content: (data.faultLog || 'Not specified').split('\n') },
      { heading: '5. Trace Goals', content: (data.traceGoals || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Debug Plan – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisDebugPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['CMSIS DEBUG & TRACE SESSION PLAN'],
      ['Project', data.projectName || ''],
      ['Debug Probe', data.debugProbe || ''],
      ['Interface', data.interface || ''],
      ['Target MCU', data.targetMcu || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['FAULT LOG STRATEGY'],
      [data.faultLog || ''],
      [],
      ['TRACE GOALS'],
      [data.traceGoals || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var debug = [
      ['BREAKPOINTS'],
      ['Location', 'Condition', 'Action', 'Notes'],
      [data.breakpointList || '', '', '', ''],
      [],
      ['WATCHPOINTS'],
      ['Address / Variable', 'Access Type', 'Condition', 'Notes'],
      [data.watchpoints || '', '', '', ''],
      [],
      ['ITM PORTS'],
      ['Port', 'Usage', 'Stimulus Register', 'Notes'],
      [data.itmPorts || '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(debug);
    ws2['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Debug Detail');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisDebugPlanPDF: function(filename, data) {
    var lines = [
      { text: 'CMSIS DEBUG & TRACE SESSION PLAN', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.targetMcu || ''), size: 12 },
      { text: 'Probe: ' + (data.debugProbe || 'N/A') + '  |  Interface: ' + (data.interface || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BREAKPOINT LIST ──', size: 14, bold: true },
      { text: data.breakpointList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── WATCHPOINTS ──', size: 14, bold: true },
      { text: data.watchpoints || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ITM PORTS ──', size: 14, bold: true },
      { text: data.itmPorts || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FAULT LOG STRATEGY ──', size: 14, bold: true },
      { text: data.faultLog || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRACE GOALS ──', size: 14, bold: true },
      { text: data.traceGoals || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'CMSIS Debug & Trace Plan', lines: lines });
  },

  generateCmsisDebugPlanPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'CMSIS Debug & Trace Session Plan',
      subtitle: (data.targetMcu || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Debug Setup', content: 'Probe: ' + (data.debugProbe || 'N/A') + '\nInterface: ' + (data.interface || 'N/A') + '\nTarget: ' + (data.targetMcu || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Breakpoints', content: data.breakpointList || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Watchpoints', content: data.watchpoints || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'ITM Ports', content: data.itmPorts || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Fault Log Strategy', content: data.faultLog || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Trace Goals', content: data.traceGoals || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 8. EMBEDDED TEST PLAN
  // ============================================================

  generateCmsisTestingWord: async function(filename, data) {
    var sections = [
      { heading: 'Embedded Test Plan', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Test Framework: ' + (data.testFramework || 'N/A'),
        'Coverage Target: ' + (data.coverageTarget || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Unit Test List', content: (data.unitTestList || 'Not specified').split('\n') },
      { heading: '2. HIL (Hardware-in-the-Loop) Setup', content: (data.hilSetup || 'Not specified').split('\n') },
      { heading: '3. Integration Tests', content: (data.integrationTests || 'Not specified').split('\n') },
      { heading: '4. Pass / Fail Criteria', content: (data.passFailCriteria || 'Not specified').split('\n') },
      { heading: '5. CI Pipeline', content: (data.ciPipeline || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Test Plan – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisTestingExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['EMBEDDED TEST PLAN'],
      ['Project', data.projectName || ''],
      ['Test Framework', data.testFramework || ''],
      ['Coverage Target', data.coverageTarget || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['HIL SETUP'],
      [data.hilSetup || ''],
      [],
      ['CI PIPELINE'],
      [data.ciPipeline || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var tests = [
      ['UNIT TESTS'],
      ['Test Name', 'Module Under Test', 'Input', 'Expected Output', 'Status'],
      [data.unitTestList || '', '', '', '', ''],
      [],
      ['INTEGRATION TESTS'],
      ['Test Name', 'Components', 'Description', 'Pass Condition', 'Status'],
      [data.integrationTests || '', '', '', '', ''],
      [],
      ['PASS / FAIL CRITERIA'],
      [data.passFailCriteria || '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(tests);
    ws2['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Test Cases');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisTestingPDF: function(filename, data) {
    var lines = [
      { text: 'EMBEDDED TEST PLAN', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  Framework: ' + (data.testFramework || 'N/A'), size: 12 },
      { text: 'Coverage Target: ' + (data.coverageTarget || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── UNIT TEST LIST ──', size: 14, bold: true },
      { text: data.unitTestList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HIL SETUP ──', size: 14, bold: true },
      { text: data.hilSetup || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTEGRATION TESTS ──', size: 14, bold: true },
      { text: data.integrationTests || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PASS / FAIL CRITERIA ──', size: 14, bold: true },
      { text: data.passFailCriteria || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CI PIPELINE ──', size: 14, bold: true },
      { text: data.ciPipeline || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Embedded Test Plan', lines: lines });
  },

  generateCmsisTestingPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Embedded Test Plan',
      subtitle: (data.testFramework || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Test Strategy', content: 'Framework: ' + (data.testFramework || 'N/A') + '\nCoverage Target: ' + (data.coverageTarget || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Unit Tests', content: data.unitTestList || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'HIL Setup', content: data.hilSetup || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Integration Tests', content: data.integrationTests || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Pass / Fail Criteria', content: data.passFailCriteria || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'CI Pipeline', content: data.ciPipeline || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 9. EMBEDDED SOFTWARE ARCHITECTURE
  // ============================================================

  generateCmsisArchitectureWord: async function(filename, data) {
    var sections = [
      { heading: 'Embedded Software Architecture', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'Architecture Pattern: ' + (data.architecturePattern || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Architecture Layers', content: (data.layers || 'Not specified').split('\n') },
      { heading: '2. Event Sources', content: (data.eventSources || 'Not specified').split('\n') },
      { heading: '3. State Machines', content: (data.stateMachines || 'Not specified').split('\n') },
      { heading: '4. Components', content: (data.components || 'Not specified').split('\n') },
      { heading: '5. Interface Contracts', content: (data.interfaceContracts || 'Not specified').split('\n') },
      { heading: '6. Performance Targets', content: (data.performanceTargets || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Architecture – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisArchitectureExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['EMBEDDED SOFTWARE ARCHITECTURE'],
      ['Project', data.projectName || ''],
      ['Architecture Pattern', data.architecturePattern || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PERFORMANCE TARGETS'],
      [data.performanceTargets || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var arch = [
      ['ARCHITECTURE LAYERS'],
      ['Layer', 'Responsibility', 'Components', 'Notes'],
      [data.layers || '', '', '', ''],
      [],
      ['EVENT SOURCES'],
      ['Source', 'Type', 'Handler', 'Priority'],
      [data.eventSources || '', '', '', ''],
      [],
      ['STATE MACHINES'],
      ['Name', 'States', 'Transitions', 'Notes'],
      [data.stateMachines || '', '', '', ''],
      [],
      ['INTERFACE CONTRACTS'],
      ['Interface', 'Provider', 'Consumer', 'Protocol / Type'],
      [data.interfaceContracts || '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(arch);
    ws2['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Architecture Detail');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisArchitecturePDF: function(filename, data) {
    var lines = [
      { text: 'EMBEDDED SOFTWARE ARCHITECTURE', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  ' + (data.architecturePattern || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ARCHITECTURE LAYERS ──', size: 14, bold: true },
      { text: data.layers || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVENT SOURCES ──', size: 14, bold: true },
      { text: data.eventSources || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STATE MACHINES ──', size: 14, bold: true },
      { text: data.stateMachines || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPONENTS ──', size: 14, bold: true },
      { text: data.components || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERFACE CONTRACTS ──', size: 14, bold: true },
      { text: data.interfaceContracts || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERFORMANCE TARGETS ──', size: 14, bold: true },
      { text: data.performanceTargets || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Embedded Software Architecture', lines: lines });
  },

  generateCmsisArchitecturePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Embedded Software Architecture',
      subtitle: (data.architecturePattern || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Architecture Pattern', content: data.architecturePattern || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Layers', content: data.layers || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Event Sources', content: data.eventSources || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'State Machines', content: data.stateMachines || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Components', content: data.components || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Interface Contracts', content: data.interfaceContracts || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Performance Targets', content: data.performanceTargets || 'Not specified', color: DocStyles.colors.navy }
      ]
    });
  },


  // ============================================================
  // 10. PROFESSIONAL EMBEDDED WORKFLOW
  // ============================================================

  generateCmsisWorkflowWord: async function(filename, data) {
    var sections = [
      { heading: 'Professional Embedded Workflow', content: [
        'Project: ' + (data.projectName || 'N/A'),
        'CI Platform: ' + (data.ciPlatform || 'N/A'),
        'Code Standard: ' + (data.codeStandard || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Static Analysis Tools', content: (data.staticAnalysisTools || 'Not specified').split('\n') },
      { heading: '2. Coverage Threshold', content: [
        'Coverage Threshold: ' + (data.coverageThreshold || 'N/A')
      ]},
      { heading: '3. Documentation Generator', content: [
        'Tool: ' + (data.docGenTool || 'N/A')
      ]},
      { heading: '4. Pipeline Stages', content: (data.pipelineStages || 'Not specified').split('\n') },
      { heading: '5. Deploy Target', content: (data.deployTarget || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Embedded Workflow – ' + (data.projectName || ''), author: data.projectName || '', sections: sections });
  },

  generateCmsisWorkflowExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['PROFESSIONAL EMBEDDED WORKFLOW'],
      ['Project', data.projectName || ''],
      ['CI Platform', data.ciPlatform || ''],
      ['Code Standard', data.codeStandard || ''],
      ['Coverage Threshold', data.coverageThreshold || ''],
      ['Doc Gen Tool', data.docGenTool || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['STATIC ANALYSIS TOOLS'],
      [data.staticAnalysisTools || ''],
      [],
      ['DEPLOY TARGET'],
      [data.deployTarget || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 25 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    var pipeline = [
      ['CI/CD PIPELINE STAGES'],
      ['Stage', 'Trigger', 'Tool / Action', 'Gate Condition', 'Notes'],
      [data.pipelineStages || '', '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(pipeline);
    ws2['!cols'] = [{ wch: 20 }, { wch: 18 }, { wch: 22 }, { wch: 22 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Pipeline');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCmsisWorkflowPDF: function(filename, data) {
    var lines = [
      { text: 'PROFESSIONAL EMBEDDED WORKFLOW', size: 18, bold: true },
      { text: (data.projectName || '') + '  |  CI: ' + (data.ciPlatform || 'N/A'), size: 12 },
      { text: 'Standard: ' + (data.codeStandard || 'N/A') + '  |  Coverage: ' + (data.coverageThreshold || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── STATIC ANALYSIS TOOLS ──', size: 14, bold: true },
      { text: data.staticAnalysisTools || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DOCUMENTATION GENERATOR ──', size: 14, bold: true },
      { text: 'Tool: ' + (data.docGenTool || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PIPELINE STAGES ──', size: 14, bold: true },
      { text: data.pipelineStages || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEPLOY TARGET ──', size: 14, bold: true },
      { text: data.deployTarget || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Professional Embedded Workflow', lines: lines });
  },

  generateCmsisWorkflowPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.projectName || 'Project',
      title: 'Professional Embedded Workflow',
      subtitle: (data.ciPlatform || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Workflow Overview', content: 'CI Platform: ' + (data.ciPlatform || 'N/A') + '\nCode Standard: ' + (data.codeStandard || 'N/A') + '\nCoverage: ' + (data.coverageThreshold || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Static Analysis Tools', content: data.staticAnalysisTools || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Documentation Generator', content: 'Tool: ' + (data.docGenTool || 'N/A'), color: DocStyles.colors.blue },
        { heading: 'Pipeline Stages', content: data.pipelineStages || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Deploy Target', content: data.deployTarget || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  }

});
