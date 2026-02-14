/**
 * Doc Generator - Robotics and Automation Series
 * Extends DocGenerator with robotics and automation series document generators.
 * Requires: doc-generator-core.js loaded first.
 */
Object.assign(DocGenerator, {

  // ============================================================
  // ROBOT SPECIFICATION SHEET
  // ============================================================

  generateRobotSpecWord: async function(filename, data) {
    var sections = [
      { heading: 'Robot Specification Sheet', content: [
          'Robot Name: ' + (data.robotName || 'N/A'),
          'Manufacturer: ' + (data.manufacturer || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'General Information', content: [
          'Robot Type: ' + (data.robotType || 'N/A'),
          'Degrees of Freedom: ' + (data.dof || 'N/A'),
          'Controller: ' + (data.controller || 'N/A'),
          'Power Supply: ' + (data.powerSupply || 'N/A')
      ]},
      { heading: 'Performance Specifications', content: [
          'Max Payload: ' + (data.payload ? data.payload + ' kg' : 'N/A'),
          'Max Reach: ' + (data.reach ? data.reach + ' mm' : 'N/A'),
          'Repeatability: ' + (data.repeatability ? data.repeatability + ' mm' : 'N/A'),
          'Max Speed: ' + (data.maxSpeed || 'N/A'),
          'Robot Weight: ' + (data.weight ? data.weight + ' kg' : 'N/A')
      ]},
      { heading: 'Environmental & Protection', content: [
          'IP Rating: ' + (data.protection || 'N/A')
      ]},
      { heading: 'Applications', content: (data.applications || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Robot Specification Sheet — ' + (data.robotName || ''), author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateRobotSpecExcel: function(filename, data) {
    var rows = [
      ['Robot Specification Sheet'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['GENERAL INFORMATION'],
      ['Robot Name / Model', data.robotName || ''],
      ['Manufacturer', data.manufacturer || ''],
      ['Robot Type', data.robotType || ''],
      ['Degrees of Freedom', data.dof || ''],
      ['Controller', data.controller || ''],
      ['Power Supply', data.powerSupply || ''],
      [],
      ['PERFORMANCE SPECIFICATIONS'],
      ['Max Payload (kg)', data.payload || ''],
      ['Max Reach (mm)', data.reach || ''],
      ['Repeatability (mm)', data.repeatability || ''],
      ['Max Speed', data.maxSpeed || ''],
      ['Robot Weight (kg)', data.weight || ''],
      ['IP Rating / Protection', data.protection || ''],
      [],
      ['APPLICATIONS'],
      [data.applications || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Robot Specification Sheet', rows: rows });
  },

  generateRobotSpecPDF: function(filename, data) {
    var lines = [
      { text: 'ROBOT SPECIFICATION SHEET', size: 18, bold: true },
      { text: (data.robotName || '') + '  |  ' + (data.manufacturer || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── GENERAL INFORMATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Robot Type: ' + (data.robotType || 'N/A'), size: 10 },
      { text: 'Degrees of Freedom: ' + (data.dof || 'N/A'), size: 10 },
      { text: 'Controller: ' + (data.controller || 'N/A'), size: 10 },
      { text: 'Power Supply: ' + (data.powerSupply || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERFORMANCE SPECIFICATIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Max Payload: ' + (data.payload ? data.payload + ' kg' : 'N/A'), size: 10 },
      { text: 'Max Reach: ' + (data.reach ? data.reach + ' mm' : 'N/A'), size: 10 },
      { text: 'Repeatability: ' + (data.repeatability ? data.repeatability + ' mm' : 'N/A'), size: 10 },
      { text: 'Max Speed: ' + (data.maxSpeed || 'N/A'), size: 10 },
      { text: 'Robot Weight: ' + (data.weight ? data.weight + ' kg' : 'N/A'), size: 10 },
      { text: 'IP Rating: ' + (data.protection || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── APPLICATIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.applications || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── ADDITIONAL NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Robot Specification Sheet', lines: lines });
  },

  generateRobotSpecPPTX: async function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    var colors = DocStyles.colors;

    // Slide 1 — Title
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('ROBOT SPECIFICATION SHEET', { x: 0.5, y: 1.0, w: 9, h: 0.8, fontSize: 28, color: colors.white, bold: true });
    slide1.addText(data.robotName || 'Robot', { x: 0.5, y: 1.9, w: 9, h: 0.6, fontSize: 20, color: colors.teal });
    slide1.addText(data.manufacturer || '', { x: 0.5, y: 2.6, w: 9, h: 0.5, fontSize: 16, color: colors.white });
    slide1.addText('Generated: ' + new Date().toLocaleDateString(), { x: 0.5, y: 4.5, w: 9, h: 0.4, fontSize: 11, color: colors.gray });

    // Slide 2 — Specifications
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Technical Specifications', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });

    var specsLeft = [
      'Robot Type: ' + (data.robotType || 'N/A'),
      'DOF: ' + (data.dof || 'N/A'),
      'Max Payload: ' + (data.payload ? data.payload + ' kg' : 'N/A'),
      'Max Reach: ' + (data.reach ? data.reach + ' mm' : 'N/A'),
      'Repeatability: ' + (data.repeatability || 'N/A'),
      'Max Speed: ' + (data.maxSpeed || 'N/A')
    ].join('\n');

    var specsRight = [
      'Weight: ' + (data.weight ? data.weight + ' kg' : 'N/A'),
      'IP Rating: ' + (data.protection || 'N/A'),
      'Controller: ' + (data.controller || 'N/A'),
      'Power: ' + (data.powerSupply || 'N/A')
    ].join('\n');

    slide2.addText('Core Specs', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(specsLeft, { x: 0.5, y: 1.4, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('System Info', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(specsRight, { x: 5.2, y: 1.4, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 3 — Applications & Notes
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Applications & Notes', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Primary Applications', { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.applications || 'Not specified', { x: 0.5, y: 1.4, w: 9, h: 1.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Additional Notes', { x: 0.5, y: 3.4, w: 9, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.notes || 'None', { x: 0.5, y: 3.8, w: 9, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // ROBOTICS CAPSTONE PROJECT PLANNER
  // ============================================================

  generateCapstonePlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Capstone Project Plan', bold: true, size: 48, color: DocStyles.colors.navy })], heading: docx_lib.HeadingLevel.TITLE }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'Untitled'), size: 28, color: DocStyles.colors.teal })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: DocStyles.colors.gray, italics: true })], spacing: { after: 400 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project Type', bold: true, size: 28, color: DocStyles.colors.navy })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { before: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.projectType || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Hardware & Components', bold: true, size: 28, color: DocStyles.colors.navy })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { before: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.hardware || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Software Stack & Algorithms', bold: true, size: 28, color: DocStyles.colors.navy })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { before: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.software || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Milestones & Timeline', bold: true, size: 28, color: DocStyles.colors.navy })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { before: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.milestones || 'Not specified', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateCapstonePlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['CAPSTONE PROJECT PLAN'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Project Name', data.projectName || ''],
      ['Project Type', data.projectType || ''],
      [],
      ['HARDWARE & COMPONENTS'],
      ['Details', data.hardware || ''],
      [],
      ['SOFTWARE STACK & ALGORITHMS'],
      ['Details', data.software || ''],
      [],
      ['MILESTONES & TIMELINE'],
      ['Details', data.milestones || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Capstone Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCapstonePlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(22); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Capstone Project Plan', 105, y, { align: 'center' }); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text(data.projectName || 'Untitled Project', 105, y, { align: 'center' }); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 105, y, { align: 'center' }); y += 15;

    var sections = [
      { title: 'Project Type', content: data.projectType },
      { title: 'Hardware & Components', content: data.hardware },
      { title: 'Software Stack & Algorithms', content: data.software },
      { title: 'Milestones & Timeline', content: data.milestones }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.navy);
      pdf.text(s.title, 14, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 180);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 14, y); y += 6;
      });
      y += 8;
    });

    pdf.save(filename + '.pdf');
  },


  // ============================================================
  // ROBOTICS BUSINESS STRATEGY PLANNER
  // ============================================================

  generateBusinessStrategyWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robotics Business Strategy', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics Business & Strategy', italics: true, size: 20, color: DocStyles.colors.teal })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Company / Product Name', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.companyName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Target Market & Segment', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.market || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Value Proposition', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.value || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Business Model & Pricing', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.model || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Go-To-Market Plan', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.gtm || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Funding & Milestones', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.funding || 'N/A', size: 24 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateBusinessStrategyExcel: function(filename, data) {
    var rows = [
      ['Robotics Business Strategy'],
      ['Generated from wasilzafar.com'],
      [],
      ['Field', 'Details'],
      ['Company / Product Name', data.companyName || 'N/A'],
      ['Target Market & Segment', data.market || 'N/A'],
      ['Value Proposition', data.value || 'N/A'],
      ['Business Model & Pricing', data.model || 'N/A'],
      ['Go-To-Market Plan', data.gtm || 'N/A'],
      ['Funding & Milestones', data.funding || 'N/A']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Business Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateBusinessStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Robotics Business Strategy', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Generated from wasilzafar.com — Robotics Business & Strategy', 20, 33);
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.line(20, 37, 190, 37);
    var y = 50;
    var fields = [
      ['Company / Product Name', data.companyName],
      ['Target Market & Segment', data.market],
      ['Value Proposition', data.value],
      ['Business Model & Pricing', data.model],
      ['Go-To-Market Plan', data.gtm],
      ['Funding & Milestones', data.funding]
    ];
    fields.forEach(function(f) {
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(f[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(f[1] || 'N/A', 160);
      lines.forEach(function(line) { pdf.text(line, 22, y); y += 6; });
      y += 6;
    });
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // SYSTEMS INTEGRATION PLANNER
  // ============================================================

  generateIntegrationPlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Systems Integration Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Systems Integration & Deployment', italics: true, size: 20, color: DocStyles.colors.teal })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'System / Project Name', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Architecture Pattern', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.architecture || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Subsystems & Interfaces', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.subsystems || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Testing Strategy', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.testing || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Deployment & Lifecycle Notes', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'N/A', size: 24 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateIntegrationPlanExcel: function(filename, data) {
    var rows = [
      ['Systems Integration Plan'],
      ['Generated from wasilzafar.com'],
      [],
      ['Field', 'Details'],
      ['System / Project Name', data.projectName || 'N/A'],
      ['Architecture Pattern', data.architecture || 'N/A'],
      ['Subsystems & Interfaces', data.subsystems || 'N/A'],
      ['Testing Strategy', data.testing || 'N/A'],
      ['Deployment & Lifecycle Notes', data.notes || 'N/A']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Integration Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateIntegrationPlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Systems Integration Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Generated from wasilzafar.com — Systems Integration & Deployment', 20, 33);
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.line(20, 37, 190, 37);
    var y = 50;
    var fields = [
      ['System / Project Name', data.projectName],
      ['Architecture Pattern', data.architecture],
      ['Subsystems & Interfaces', data.subsystems],
      ['Testing Strategy', data.testing],
      ['Deployment & Lifecycle Notes', data.notes]
    ];
    fields.forEach(function(f) {
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(f[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(f[1] || 'N/A', 160);
      lines.forEach(function(line) { pdf.text(line, 22, y); y += 6; });
      y += 6;
    });
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // EMERGING ROBOTICS RESEARCH PLANNER
  // ============================================================

  generateEmergingRobotPlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Emerging Robotics Research Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Advanced & Emerging Robotics', italics: true, size: 20, color: DocStyles.colors.teal })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project Title', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Focus Domain', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.domain || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Key Technologies', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.technologies || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Research Challenges', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.challenges || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'N/A', size: 24 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateEmergingRobotPlanExcel: function(filename, data) {
    var rows = [
      ['Emerging Robotics Research Plan'],
      ['Generated from wasilzafar.com'],
      [],
      ['Field', 'Details'],
      ['Project Title', data.projectName || 'N/A'],
      ['Focus Domain', data.domain || 'N/A'],
      ['Key Technologies', data.technologies || 'N/A'],
      ['Research Challenges', data.challenges || 'N/A'],
      ['Additional Notes', data.notes || 'N/A']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Emerging Research Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEmergingRobotPlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Emerging Robotics Research Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Generated from wasilzafar.com — Advanced & Emerging Robotics', 20, 33);
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.line(20, 37, 190, 37);
    var y = 50;
    var fields = [
      ['Project Title', data.projectName],
      ['Focus Domain', data.domain],
      ['Key Technologies', data.technologies],
      ['Research Challenges', data.challenges],
      ['Additional Notes', data.notes]
    ];
    fields.forEach(function(f) {
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(f[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(f[1] || 'N/A', 160);
      lines.forEach(function(line) { pdf.text(line, 22, y); y += 6; });
      y += 6;
    });
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // SAFETY ASSESSMENT PLANNER
  // ============================================================

  generateSafetyPlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Safety Assessment Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: DocStyles.colors.teal })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Target SIL / PL Level', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.silLevel || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Identified Hazards', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.hazards || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Applicable Standards', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.standards || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Safety Measures & Mitigations', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.measures || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateSafetyPlanExcel: function(filename, data) {
    var rows = [
      ['Robot Safety Assessment Plan'],
      ['Generated from wasilzafar.com'],
      [],
      ['Field', 'Value'],
      ['Project Name', data.projectName || 'N/A'],
      ['Target SIL / PL', data.silLevel || 'N/A'],
      ['Identified Hazards', data.hazards || 'N/A'],
      ['Applicable Standards', data.standards || 'N/A'],
      ['Safety Measures', data.measures || 'N/A'],
      ['Additional Notes', data.notes || 'N/A']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 24 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Safety Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSafetyPlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Robot Safety Assessment Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.line(20, 37, 190, 37);

    var y = 48;
    var fields = [
      ['Project Name', data.projectName],
      ['Target SIL / PL', data.silLevel],
      ['Identified Hazards', data.hazards],
      ['Applicable Standards', data.standards],
      ['Safety Measures', data.measures],
      ['Additional Notes', data.notes]
    ];

    fields.forEach(function(field) {
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(field[1] || 'N/A', 165);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 22, y);
        y += 6;
      });
      y += 4;
    });

    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // MOBILE ROBOT PLANNER
  // ============================================================

  generateMobileRobotPlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Mobile Robot Design Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: DocStyles.colors.teal })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Locomotion Type', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.locomotion || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Sensor Suite', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.sensors || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Navigation Strategy', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.navigation || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Environment & Notes', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateMobileRobotPlanExcel: function(filename, data) {
    var rows = [
      ['Mobile Robot Design Plan'],
      ['Generated from wasilzafar.com'],
      [],
      ['Field', 'Value'],
      ['Project Name', data.projectName || 'N/A'],
      ['Locomotion Type', data.locomotion || 'N/A'],
      ['Sensor Suite', data.sensors || 'N/A'],
      ['Navigation Strategy', data.navigation || 'N/A'],
      ['Environment & Notes', data.notes || 'N/A']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mobile Robot Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMobileRobotPlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Mobile Robot Design Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.line(20, 37, 190, 37);

    var y = 48;
    var fields = [
      ['Project Name', data.projectName],
      ['Locomotion Type', data.locomotion],
      ['Sensor Suite', data.sensors],
      ['Navigation Strategy', data.navigation],
      ['Environment & Notes', data.notes]
    ];

    fields.forEach(function(field) {
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(field[1] || 'N/A', 165);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 22, y);
        y += 6;
      });
      y += 4;
    });

    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // INDUSTRIAL AUTOMATION PLANNER
  // ============================================================

  generateIndustrialPlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Industrial Automation Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: DocStyles.colors.teal })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'PLC / Controller', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.plcType || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Communication Protocols', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.comms || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Workcell Design', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.workcell || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateIndustrialPlanExcel: function(filename, data) {
    var rows = [
      ['Industrial Automation Plan'],
      ['Generated from wasilzafar.com'],
      [],
      ['Field', 'Value'],
      ['Project Name', data.projectName || 'N/A'],
      ['PLC / Controller', data.plcType || 'N/A'],
      ['Communication Protocols', data.comms || 'N/A'],
      ['Workcell Design', data.workcell || 'N/A'],
      ['Additional Notes', data.notes || 'N/A']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 26 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Industrial Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateIndustrialPlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Industrial Automation Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.line(20, 37, 190, 37);

    var y = 48;
    var fields = [
      ['Project Name', data.projectName],
      ['PLC / Controller', data.plcType],
      ['Communication Protocols', data.comms],
      ['Workcell Design', data.workcell],
      ['Additional Notes', data.notes]
    ];

    fields.forEach(function(field) {
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(field[1] || 'N/A', 165);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 22, y);
        y += 6;
      });
      y += 4;
    });

    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // HRI DESIGN PLANNER
  // ============================================================

  generateHRIDesignPlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'HRI System Design Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: DocStyles.colors.teal })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Cobot/Robot Type: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.cobotType || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Interaction Modalities', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.interfaces || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Safety Requirements', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.safety || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Deployment Context & Notes', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateHRIDesignPlanExcel: function(filename, data) {
    var rows = [
      ['HRI System Design Plan'],
      ['Generated from wasilzafar.com'],
      [],
      ['Field', 'Value'],
      ['Project Name', data.projectName || 'N/A'],
      ['Cobot/Robot Type', data.cobotType || 'N/A'],
      ['Interaction Modalities', data.interfaces || 'N/A'],
      ['Safety Requirements', data.safety || 'N/A'],
      ['Deployment Context & Notes', data.notes || 'N/A']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 26 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HRI Design Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateHRIDesignPlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('HRI System Design Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.line(20, 37, 190, 37);

    var y = 48;
    var fields = [
      ['Project Name', data.projectName],
      ['Cobot/Robot Type', data.cobotType],
      ['Interaction Modalities', data.interfaces],
      ['Safety Requirements', data.safety],
      ['Deployment Context & Notes', data.notes]
    ];

    fields.forEach(function(field) {
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(field[1] || 'N/A', 165);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 22, y);
        y += 6;
      });
      y += 4;
    });

    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // AI SYSTEM PLANNER
  // ============================================================

  generateAISystemPlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'AI System Architecture Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: DocStyles.colors.teal })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Type: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.robotType || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Perception Stack', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.perception || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Planning Approach', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.planning || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Decision Architecture', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.decision || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Learning Method', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.learning || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateAISystemPlanExcel: function(filename, data) {
    var rows = [
      ['AI System Architecture Plan'],
      ['Generated from wasilzafar.com'],
      [],
      ['Field', 'Value'],
      ['Project Name', data.projectName || 'N/A'],
      ['Robot Type', data.robotType || 'N/A'],
      ['Perception Stack', data.perception || 'N/A'],
      ['Planning Approach', data.planning || 'N/A'],
      ['Decision Architecture', data.decision || 'N/A'],
      ['Learning Method', data.learning || 'N/A'],
      ['Additional Notes', data.notes || 'N/A']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AI System Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAISystemPlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('AI System Architecture Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.line(20, 37, 190, 37);

    var y = 48;
    var fields = [
      ['Project Name', data.projectName],
      ['Robot Type', data.robotType],
      ['Perception Stack', data.perception],
      ['Planning Approach', data.planning],
      ['Decision Architecture', data.decision],
      ['Learning Method', data.learning],
      ['Additional Notes', data.notes]
    ];

    fields.forEach(function(field) {
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(field[1] || 'N/A', 165);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 22, y);
        y += 6;
      });
      y += 4;
    });

    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // VISION PIPELINE PLANNER
  // ============================================================

  generateVisionPipelineWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Vision Pipeline Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 28, color: DocStyles.colors.blue })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: DocStyles.colors.gray })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Camera Type', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.camera || 'Not specified', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Algorithms', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.algorithms || 'Not specified', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Pipeline Steps', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.pipeline || 'Not specified', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Notes & Requirements', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'None', size: 24 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateVisionPipelineExcel: function(filename, data) {
    var rows = [
      ['Vision Pipeline Plan'],
      ['Project', data.projectName || 'N/A'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Field', 'Value'],
      ['Camera Type', data.camera || 'Not specified'],
      ['Algorithms', data.algorithms || 'Not specified'],
      ['Pipeline Steps', data.pipeline || 'Not specified'],
      ['Notes', data.notes || 'None']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 55 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vision Pipeline');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateVisionPipelinePDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Vision Pipeline Plan', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 20, 38);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 48);
    var y = 65;
    var fields = [['Camera Type', data.camera], ['Algorithms', data.algorithms], ['Pipeline Steps', data.pipeline], ['Notes', data.notes]];
    fields.forEach(function(f) {
      pdf.setFontSize(12); pdf.setTextColor(...DocStyles.rgb.teal); pdf.text(f[0], 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(f[1] || 'Not specified', 160);
      lines.forEach(function(line) { if (y > 275) { pdf.addPage(); y = 20; } pdf.text(line, 25, y); y += 6; });
      y += 6;
    });
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // ROS NODE ARCHITECTURE PLANNER
  // ============================================================

  generateROSNodePlanWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'ROS2 Node Architecture Plan', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 28, color: DocStyles.colors.blue, font: DocStyles.fonts.primary })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Distribution: ' + (data.distro || 'Not specified'), size: 24, color: DocStyles.colors.gray })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: DocStyles.colors.gray })], spacing: { after: 400 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Nodes', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.nodes || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Topics', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.topics || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Services & Actions', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.services || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Architecture Notes', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'None', size: 24 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateROSNodePlanExcel: function(filename, data) {
    var rows = [
      ['ROS2 Node Architecture Plan'],
      ['Project', data.projectName || 'N/A'],
      ['Distribution', data.distro || 'Not specified'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Nodes', data.nodes || 'Not specified'],
      ['Topics', data.topics || 'Not specified'],
      ['Services & Actions', data.services || 'Not specified'],
      ['Architecture Notes', data.notes || 'None']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 55 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ROS Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateROSNodePlanPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('ROS2 Node Architecture Plan', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 20, 38);
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Distribution: ' + (data.distro || 'Not specified'), 20, 47);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 55);

    var y = 72;
    var fields = [
      ['Nodes', data.nodes],
      ['Topics', data.topics],
      ['Services & Actions', data.services],
      ['Architecture Notes', data.notes]
    ];
    fields.forEach(function(f) {
      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.teal);
      pdf.text(f[0], 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(f[1] || 'Not specified', 160);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 25, y);
        y += 6;
      });
      y += 6;
    });
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // EMBEDDED SYSTEM SPEC SHEET
  // ============================================================

  generateEmbeddedSpecWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Embedded System Spec Sheet', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 28, color: DocStyles.colors.blue, font: DocStyles.fonts.primary })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: DocStyles.colors.gray })], spacing: { after: 400 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'MCU / Board', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.mcu || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Clock Speed', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.clock || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'RTOS / Scheduler', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.rtos || 'Bare-metal (no RTOS)', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Communication Protocols', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.comm || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Peripherals & Sensors', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.peripherals || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'None', size: 24 })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateEmbeddedSpecExcel: function(filename, data) {
    var rows = [
      ['Embedded System Spec Sheet'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Field', 'Value'],
      ['Project Name', data.projectName || 'N/A'],
      ['MCU / Board', data.mcu || 'Not specified'],
      ['Clock Speed', data.clock || 'Not specified'],
      ['RTOS / Scheduler', data.rtos || 'Bare-metal (no RTOS)'],
      ['Communication Protocols', data.comm || 'Not specified'],
      ['Peripherals & Sensors', data.peripherals || 'Not specified'],
      ['Additional Notes', data.notes || 'None']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 50 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Embedded Spec');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEmbeddedSpecPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Embedded System Spec Sheet', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 20, 38);
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 48);

    var y = 65;
    var fields = [
      ['MCU / Board', data.mcu],
      ['Clock Speed', data.clock],
      ['RTOS / Scheduler', data.rtos || 'Bare-metal (no RTOS)'],
      ['Communication Protocols', data.comm],
      ['Peripherals & Sensors', data.peripherals],
      ['Additional Notes', data.notes]
    ];
    fields.forEach(function(f) {
      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.teal);
      pdf.text(f[0], 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(f[1] || 'Not specified', 160);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 25, y);
        y += 6;
      });
      y += 6;
    });
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // PID TUNING WORKSHEET
  // ============================================================

  generatePIDTuningWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'PID Tuning Worksheet', bold: true, size: 48, color: DocStyles.colors.navy })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: DocStyles.colors.gray })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Controller Configuration', bold: true, size: 32, color: DocStyles.colors.blue })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Table({
            rows: [
              new docx_lib.TableRow({ children: ['Parameter', 'Value'].map(function(h) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: h, bold: true, color: DocStyles.colors.white, size: 20 })] })], shading: { fill: DocStyles.colors.navy }, width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['System Name', data.systemName || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Controller Type', data.controllerType || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['PID Gains', data.gains || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Tuning Method', data.tuningMethod || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Setpoint', data.setpoint || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Sample Time', data.sampleTime || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) })
            ]
          }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Performance Results', bold: true, size: 32, color: DocStyles.colors.blue })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.performance || 'No performance data recorded.' })] }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Notes', bold: true, size: 32, color: DocStyles.colors.blue })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'No additional notes.' })] })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generatePIDTuningExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var wsData = [
      ['PID Tuning Worksheet'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Controller Configuration'],
      ['System Name', data.systemName || 'N/A'],
      ['Controller Type', data.controllerType || 'N/A'],
      ['PID Gains', data.gains || 'N/A'],
      ['Tuning Method', data.tuningMethod || 'N/A'],
      ['Setpoint', data.setpoint || 'N/A'],
      ['Sample Time', data.sampleTime || 'N/A'],
      [],
      ['Performance Results'],
      [data.performance || 'No performance data recorded.'],
      [],
      ['Notes'],
      [data.notes || 'No additional notes.']
    ];
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 25 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'PID Tuning');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePIDTuningPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(22); pdf.setTextColor(...DocStyles.rgb.navy); pdf.text('PID Tuning Worksheet', 20, y); y += 12;
    pdf.setFontSize(10); pdf.setTextColor(100); pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 15;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue); pdf.text('Controller Configuration', 20, y); y += 10;
    pdf.setFontSize(10);
    var fields = [
      ['System Name', data.systemName], ['Controller Type', data.controllerType],
      ['PID Gains', data.gains], ['Tuning Method', data.tuningMethod],
      ['Setpoint', data.setpoint], ['Sample Time', data.sampleTime]
    ];
    fields.forEach(function(f) {
      pdf.setTextColor(0); pdf.setFont(undefined, 'bold'); pdf.text(f[0] + ':', 20, y);
      pdf.setFont(undefined, 'normal'); pdf.text(f[1] || 'N/A', 75, y); y += 7;
    });
    y += 5;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue); pdf.text('Performance Results', 20, y); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(0);
    var perfLines = pdf.splitTextToSize(data.performance || 'No performance data recorded.', 170);
    pdf.text(perfLines, 20, y); y += perfLines.length * 5 + 8;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue); pdf.text('Notes', 20, y); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(0);
    var noteLines = pdf.splitTextToSize(data.notes || 'No additional notes.', 170);
    pdf.text(noteLines, 20, y);
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // DYNAMICS PARAMETER CALCULATOR
  // ============================================================

  generateDynamicsParamWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Dynamics Parameters', bold: true, size: 48, color: DocStyles.colors.navy })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: DocStyles.colors.gray })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Configuration', bold: true, size: 32, color: DocStyles.colors.blue })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Name: ', bold: true }), new docx_lib.TextRun({ text: data.robotName || 'N/A' })] }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Gravity (m/s²): ', bold: true }), new docx_lib.TextRun({ text: data.gravity || '9.81' })] }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Friction Model: ', bold: true }), new docx_lib.TextRun({ text: data.friction || 'N/A' })] }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Link Parameters', bold: true, size: 32, color: DocStyles.colors.blue })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Table({
            rows: [
              new docx_lib.TableRow({ children: ['Link', 'Mass (kg), Length (m), CoM (m)', 'Inertia (kg·m²)'].map(function(h) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: h, bold: true, color: DocStyles.colors.white, size: 20 })] })], shading: { fill: DocStyles.colors.navy }, width: { size: 33, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Link 1', data.link1 || 'N/A', 'From link params'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 33, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Link 2', data.link2 || 'N/A', 'From link params'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 33, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Link 3', data.link3 || 'N/A', 'From link params'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 33, type: docx_lib.WidthType.PERCENTAGE } }); }) })
            ]
          }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Notes', bold: true, size: 32, color: DocStyles.colors.blue })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'No additional notes.' })] })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateDynamicsParamExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var configData = [
      ['Robot Dynamics Parameters'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Robot Name', data.robotName || 'N/A'],
      ['Gravity (m/s²)', data.gravity || '9.81'],
      ['Friction Model', data.friction || 'N/A'],
      [],
      ['Link Parameters'],
      ['Link', 'Parameters (Mass, Length, CoM)'],
      ['Link 1', data.link1 || 'N/A'],
      ['Link 2', data.link2 || 'N/A'],
      ['Link 3', data.link3 || 'N/A'],
      [],
      ['Notes'],
      [data.notes || 'No additional notes.']
    ];
    var ws = XLSX.utils.aoa_to_sheet(configData);
    ws['!cols'] = [{ wch: 30 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Dynamics Parameters');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDynamicsParamPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(22); pdf.setTextColor(...DocStyles.rgb.navy); pdf.text('Robot Dynamics Parameters', 20, y); y += 12;
    pdf.setFontSize(10); pdf.setTextColor(100); pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 15;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue); pdf.text('Robot Configuration', 20, y); y += 10;
    pdf.setFontSize(11); pdf.setTextColor(0);
    pdf.text('Robot Name: ' + (data.robotName || 'N/A'), 20, y); y += 7;
    pdf.text('Gravity: ' + (data.gravity || '9.81') + ' m/s²', 20, y); y += 7;
    pdf.text('Friction Model: ' + (data.friction || 'N/A'), 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue); pdf.text('Link Parameters', 20, y); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.white);
    pdf.setFillColor(...DocStyles.rgb.navy); pdf.rect(20, y - 5, 170, 8, 'F');
    pdf.text('Link', 25, y); pdf.text('Parameters (Mass, Length, CoM)', 65, y); y += 10;
    pdf.setTextColor(0);
    var links = [['Link 1', data.link1], ['Link 2', data.link2], ['Link 3', data.link3]];
    links.forEach(function(r) {
      if (r[1]) { pdf.text(r[0], 25, y); pdf.text(r[1].substring(0, 80), 65, y); y += 7; }
    });
    y += 8;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue); pdf.text('Notes', 20, y); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(0);
    var noteLines = pdf.splitTextToSize(data.notes || 'No additional notes.', 170);
    pdf.text(noteLines, 20, y);
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // DH PARAMETER WORKSHEET
  // ============================================================

  generateDHWorksheetWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var joints = [];
    for (var i = 1; i <= 6; i++) {
      var jv = data['joint' + i];
      if (jv && jv.trim()) joints.push({ num: i, params: jv.trim() });
    }
    var rows = [new docx_lib.TableRow({ children: ['Joint', 'θ (deg)', 'd (m)', 'a (m)', 'α (deg)'].map(function(h) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: h, bold: true, color: DocStyles.colors.white, size: 20 })] })], shading: { fill: DocStyles.colors.navy } }); }) })];
    joints.forEach(function(j) {
      var parts = j.params.split(',').map(function(s) { return s.trim(); });
      while (parts.length < 4) parts.push('');
      rows.push(new docx_lib.TableRow({ children: [String(j.num)].concat(parts).map(function(v) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: v, size: 20 })] })] }); }) }));
    });
    var doc = new docx_lib.Document({
      sections: [{
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'DH Parameter Worksheet', bold: true, size: 36, color: DocStyles.colors.navy })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot: ' + (data.robotName || ''), bold: true, size: 24, color: DocStyles.colors.blue })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Number of Joints: ' + (data.numJoints || ''), size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'DH Parameter Table', bold: true, size: 26, color: DocStyles.colors.teal })], spacing: { after: 100 } }),
          new docx_lib.Table({ rows: rows }),
          new docx_lib.Paragraph({ text: '', spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Notes: ' + (data.notes || 'N/A'), size: 20, italics: true })], spacing: { after: 100 } }),
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    DocGenerator._downloadFile(blob, filename + '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  },

  generateDHWorksheetExcel: function(filename, data) {
    var header = ['Joint', 'θ (deg)', 'd (m)', 'a (m)', 'α (deg)'];
    var rows = [header];
    for (var i = 1; i <= 6; i++) {
      var jv = data['joint' + i];
      if (jv && jv.trim()) {
        var parts = jv.trim().split(',').map(function(s) { return s.trim(); });
        while (parts.length < 4) parts.push('');
        rows.push([i].concat(parts));
      }
    }
    rows.push([]);
    rows.push(['Robot', data.robotName || '']);
    rows.push(['Joints', data.numJoints || '']);
    rows.push(['Notes', data.notes || '']);
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DH Parameters');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDHWorksheetPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('DH Parameter Worksheet', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Robot: ' + (data.robotName || ''), 20, 38);
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.black);
    pdf.text('Number of Joints: ' + (data.numJoints || ''), 20, 48);
    var y = 62;
    pdf.setFontSize(13);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('DH Parameter Table', 20, y);
    y += 10;
    // Table header
    pdf.setFillColor(...DocStyles.rgb.navy);
    pdf.rect(20, y, 170, 8, 'F');
    pdf.setTextColor(...DocStyles.rgb.white);
    pdf.setFontSize(10);
    var cols = ['Joint', 'θ (deg)', 'd (m)', 'a (m)', 'α (deg)'];
    var cx = [25, 55, 90, 120, 155];
    cols.forEach(function(c, i) { pdf.text(c, cx[i], y + 6); });
    y += 10;
    pdf.setTextColor(...DocStyles.rgb.black);
    for (var i = 1; i <= 6; i++) {
      var jv = data['joint' + i];
      if (jv && jv.trim()) {
        var parts = jv.trim().split(',').map(function(s) { return s.trim(); });
        while (parts.length < 4) parts.push('');
        if (i % 2 === 0) { pdf.setFillColor(...DocStyles.rgb.light); pdf.rect(20, y, 170, 8, 'F'); }
        pdf.text(String(i), cx[0], y + 6);
        parts.forEach(function(p, pi) { pdf.text(p, cx[pi + 1], y + 6); });
        y += 10;
      }
    }
    y += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.gray);
    var notes = data.notes || 'N/A';
    var noteLines = pdf.splitTextToSize('Notes: ' + notes, 170);
    pdf.text(noteLines, 20, y);
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // ACTUATOR SELECTION WORKSHEET
  // ============================================================

  generateActuatorSelectionWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Actuator Selection Worksheet', bold: true, size: 36, color: DocStyles.colors.navy })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project / Joint: ' + (data.projectName || ''), bold: true, size: 24, color: DocStyles.colors.blue })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Actuator Type: ' + (data.actuatorType || ''), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Required Torque: ' + (data.torque || ''), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Required Speed: ' + (data.speed || 'Not specified'), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Gear Ratio & Type: ' + (data.gearRatio || 'Not specified'), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Supply Voltage / Power: ' + (data.voltage || 'Not specified'), size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 26, color: DocStyles.colors.teal })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'None', size: 22 })], spacing: { after: 100 } }),
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    this._downloadFile(blob, filename + '.docx');
  },

  generateActuatorSelectionExcel: function(filename, data) {
    var rows = [
      ['Actuator Selection Worksheet'], [],
      ['Field', 'Value'],
      ['Project / Joint Name', data.projectName || ''],
      ['Actuator Type', data.actuatorType || ''],
      ['Required Torque', data.torque || ''],
      ['Required Speed', data.speed || 'Not specified'],
      ['Gear Ratio & Type', data.gearRatio || 'Not specified'],
      ['Supply Voltage / Power', data.voltage || 'Not specified'],
      [], ['Additional Notes'],
      ['Notes', data.notes || 'None'],
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 50 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Actuator Selection');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateActuatorSelectionPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Actuator Selection Worksheet', 15, y); y += 12;
    pdf.setFontSize(12); pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Project / Joint: ' + (data.projectName || ''), 15, y); y += 8;
    pdf.text('Actuator Type: ' + (data.actuatorType || ''), 15, y); y += 8;
    pdf.text('Required Torque: ' + (data.torque || ''), 15, y); y += 8;
    pdf.text('Required Speed: ' + (data.speed || 'Not specified'), 15, y); y += 8;
    pdf.text('Gear Ratio: ' + (data.gearRatio || 'Not specified'), 15, y); y += 8;
    pdf.text('Supply Voltage: ' + (data.voltage || 'Not specified'), 15, y); y += 14;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Additional Notes', 15, y); y += 8;
    pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.black);
    var noteLines = pdf.splitTextToSize(data.notes || 'None', 175);
    pdf.text(noteLines, 15, y);
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // SENSOR SELECTION WORKSHEET
  // ============================================================

  generateSensorSelectionWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Sensor Selection Worksheet', bold: true, size: 36, color: DocStyles.colors.navy })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || ''), bold: true, size: 24, color: DocStyles.colors.blue })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Type: ' + (data.robotType || ''), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Environment: ' + (data.environment || ''), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Budget: ' + (data.budget || 'Not specified'), size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Proprioceptive Sensors (Internal State)', bold: true, size: 26, color: DocStyles.colors.crimson })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.proprioceptive || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Exteroceptive Sensors (Environment)', bold: true, size: 26, color: DocStyles.colors.crimson })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.exteroceptive || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Fusion Strategy', bold: true, size: 26, color: DocStyles.colors.teal })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.fusionStrategy || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 26, color: DocStyles.colors.blue })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'None', size: 22 })], spacing: { after: 100 } }),
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    this._downloadFile(blob, filename + '.docx');
  },

  generateSensorSelectionExcel: function(filename, data) {
    var rows = [
      ['Sensor Selection Worksheet'],
      [],
      ['Field', 'Value'],
      ['Project Name', data.projectName || ''],
      ['Robot Type', data.robotType || ''],
      ['Environment', data.environment || ''],
      ['Budget', data.budget || 'Not specified'],
      [],
      ['Proprioceptive Sensors'],
      ['Sensors', data.proprioceptive || 'Not specified'],
      [],
      ['Exteroceptive Sensors'],
      ['Sensors', data.exteroceptive || 'Not specified'],
      [],
      ['Fusion Strategy'],
      ['Strategy', data.fusionStrategy || 'Not specified'],
      [],
      ['Additional Notes'],
      ['Notes', data.notes || 'None'],
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sensor Selection');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSensorSelectionPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Sensor Selection Worksheet', 15, y); y += 12;
    pdf.setFontSize(12);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Project: ' + (data.projectName || ''), 15, y); y += 8;
    pdf.text('Robot Type: ' + (data.robotType || ''), 15, y); y += 8;
    pdf.text('Environment: ' + (data.environment || ''), 15, y); y += 8;
    pdf.text('Budget: ' + (data.budget || 'Not specified'), 15, y); y += 14;

    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Proprioceptive Sensors', 15, y); y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.black);
    var propLines = pdf.splitTextToSize(data.proprioceptive || 'Not specified', 175);
    pdf.text(propLines, 15, y); y += propLines.length * 6 + 8;

    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Exteroceptive Sensors', 15, y); y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.black);
    var extLines = pdf.splitTextToSize(data.exteroceptive || 'Not specified', 175);
    pdf.text(extLines, 15, y); y += extLines.length * 6 + 8;

    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Fusion Strategy', 15, y); y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.black);
    var fusionLines = pdf.splitTextToSize(data.fusionStrategy || 'Not specified', 175);
    pdf.text(fusionLines, 15, y); y += fusionLines.length * 6 + 8;

    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Additional Notes', 15, y); y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.black);
    var noteLines = pdf.splitTextToSize(data.notes || 'None', 175);
    pdf.text(noteLines, 15, y);

    pdf.save(filename + '.pdf');
  },

});
