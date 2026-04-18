/**
 * Doc Generator - Embedded Systems Hardware Engineering Series
 * Extends DocGenerator with embedded hardware series document generators.
 * Requires: doc-generator-core.js loaded first.
 */
Object.assign(DocGenerator, {
  // ============================================================
  // COMPONENT CALCULATOR (Part 1: Foundations)
  // ============================================================

  generateComponentCalcWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var rows = [
      ['Parameter', 'Value'],
      ['Project', data.projectName || 'N/A'],
      ['Voltage (V)', data.voltage || 'N/A'],
      ['Current (mA)', data.current || 'N/A'],
      ['Resistance (Ω)', data.resistance || 'N/A'],
      ['Power (mW)', data.power || 'N/A'],
      ['Components', data.components || 'N/A'],
      ['Notes', data.notes || 'N/A']
    ];
    var tableRows = rows.map(function(r, idx) {
      return new docx_lib.TableRow({
        children: [
          new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: r[0], bold: idx === 0, size: 22, color: idx === 0 ? DocStyles.colors.white : DocStyles.colors.navy, font: DocStyles.fonts.primary })], alignment: docx_lib.AlignmentType.LEFT })], shading: idx === 0 ? { fill: DocStyles.colors.teal } : (idx % 2 === 0 ? { fill: DocStyles.colors.altRow } : {}), width: { size: 4000, type: docx_lib.WidthType.DXA } }),
          new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: r[1], bold: idx === 0, size: 22, color: idx === 0 ? DocStyles.colors.white : DocStyles.colors.darkGray, font: DocStyles.fonts.primary })], alignment: docx_lib.AlignmentType.LEFT })], shading: idx === 0 ? { fill: DocStyles.colors.teal } : (idx % 2 === 0 ? { fill: DocStyles.colors.altRow } : {}), width: { size: 5000, type: docx_lib.WidthType.DXA } })
        ]
      });
    });
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Component Calculator Report', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 28, color: DocStyles.colors.blue })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: DocStyles.colors.gray })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Calculation Results', bold: true, size: 32, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Table({ rows: tableRows, width: { size: 100, type: docx_lib.WidthType.PERCENTAGE } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    this._downloadFile(blob, filename + '.docx');
  },

  generateComponentCalcExcel: function(filename, data) {
    var rows = [
      ['Parameter', 'Value', 'Unit'],
      ['Project', data.projectName || '', ''],
      ['Voltage', data.voltage || '', 'V'],
      ['Current', data.current || '', 'mA'],
      ['Resistance', data.resistance || '', 'Ω'],
      ['Power', data.power || '', 'mW'],
      ['Components', data.components || '', ''],
      ['Notes', data.notes || '', '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 10 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Component Calc');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateComponentCalcPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFillColor(...DocStyles.rgb.navy);
    pdf.rect(0, 0, 210, 40, 'F');
    pdf.setTextColor(...DocStyles.rgb.white);
    pdf.setFontSize(22);
    pdf.text('Component Calculator Report', 15, 20);
    pdf.setFontSize(12);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 15, 32);

    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.setFontSize(14);
    pdf.text('Calculation Results', 15, 55);

    pdf.setTextColor(...DocStyles.rgb.darkGray);
    pdf.setFontSize(11);
    var y = 65;
    var props = [
      ['Voltage', data.voltage ? data.voltage + ' V' : ''],
      ['Current', data.current ? data.current + ' mA' : ''],
      ['Resistance', data.resistance ? data.resistance + ' Ω' : ''],
      ['Power', data.power ? data.power + ' mW' : ''],
      ['Components', data.components],
      ['Notes', data.notes]
    ];
    props.forEach(function(p) {
      if (p[1]) {
        pdf.setFont(undefined, 'bold');
        pdf.text(p[0] + ':', 15, y);
        pdf.setFont(undefined, 'normal');
        var lines = pdf.splitTextToSize(String(p[1]), 120);
        pdf.text(lines, 70, y);
        y += lines.length * 7 + 3;
      }
    });

    pdf.setFontSize(8);
    pdf.setTextColor(...DocStyles.rgb.mediumGray);
    pdf.text('Generated: ' + new Date().toLocaleDateString() + '  |  wasilzafar.com', 15, 285);
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // BOM BUILDER (Part 2: Prototyping & Proof of Concept)
  // ============================================================

  generatePrototypeBomWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var sections = [
      ['Project Name', data.projectName || 'N/A'],
      ['Development Board', data.devBoard || 'N/A'],
      ['Sensors & ICs', data.sensors || 'N/A'],
      ['Passive Components', data.passives || 'N/A'],
      ['Connectors & Cables', data.connectors || 'N/A'],
      ['Notes', data.notes || 'N/A']
    ];
    var tableRows = [['Category', 'Details']].concat(sections).map(function(r, idx) {
      return new docx_lib.TableRow({
        children: [
          new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: r[0], bold: idx === 0, size: 22, color: idx === 0 ? DocStyles.colors.white : DocStyles.colors.navy, font: DocStyles.fonts.primary })], alignment: docx_lib.AlignmentType.LEFT })], shading: idx === 0 ? { fill: DocStyles.colors.teal } : (idx % 2 === 0 ? { fill: DocStyles.colors.altRow } : {}), width: { size: 3500, type: docx_lib.WidthType.DXA } }),
          new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: r[1], bold: idx === 0, size: 22, color: idx === 0 ? DocStyles.colors.white : DocStyles.colors.darkGray, font: DocStyles.fonts.primary })], alignment: docx_lib.AlignmentType.LEFT })], shading: idx === 0 ? { fill: DocStyles.colors.teal } : (idx % 2 === 0 ? { fill: DocStyles.colors.altRow } : {}), width: { size: 5500, type: docx_lib.WidthType.DXA } })
        ]
      });
    });
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Prototype Bill of Materials', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 28, color: DocStyles.colors.blue })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: DocStyles.colors.gray })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'BOM Summary', bold: true, size: 32, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Table({ rows: tableRows, width: { size: 100, type: docx_lib.WidthType.PERCENTAGE } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    this._downloadFile(blob, filename + '.docx');
  },

  generatePrototypeBomExcel: function(filename, data) {
    var rows = [
      ['Category', 'Details'],
      ['Project Name', data.projectName || ''],
      ['Development Board', data.devBoard || ''],
      ['Sensors & ICs', data.sensors || ''],
      ['Passive Components', data.passives || ''],
      ['Connectors & Cables', data.connectors || ''],
      ['Notes', data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 24 }, { wch: 50 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Prototype BOM');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePrototypeBomPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFillColor(...DocStyles.rgb.navy);
    pdf.rect(0, 0, 210, 40, 'F');
    pdf.setTextColor(...DocStyles.rgb.white);
    pdf.setFontSize(22);
    pdf.text('Prototype Bill of Materials', 15, 20);
    pdf.setFontSize(12);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 15, 32);

    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.setFontSize(14);
    pdf.text('BOM Details', 15, 55);

    pdf.setTextColor(...DocStyles.rgb.darkGray);
    pdf.setFontSize(11);
    var y = 65;
    var items = [
      ['Development Board', data.devBoard],
      ['Sensors & ICs', data.sensors],
      ['Passive Components', data.passives],
      ['Connectors & Cables', data.connectors],
      ['Notes', data.notes]
    ];
    items.forEach(function(p) {
      if (p[1]) {
        pdf.setFont(undefined, 'bold');
        pdf.text(p[0] + ':', 15, y);
        y += 7;
        pdf.setFont(undefined, 'normal');
        var lines = pdf.splitTextToSize(String(p[1]), 175);
        pdf.text(lines, 15, y);
        y += lines.length * 6 + 5;
      }
    });

    pdf.setFontSize(8);
    pdf.setTextColor(...DocStyles.rgb.mediumGray);
    pdf.text('Generated: ' + new Date().toLocaleDateString() + '  |  wasilzafar.com', 15, 285);
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // DESIGN REVIEW CHECKLIST (Part 3: MCU & System Architecture)
  // ============================================================

  generateDesignReviewWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var checklistItems = [
      '☐ Clock configuration verified (HSE/HSI, PLL)',
      '☐ All GPIO pins assigned (no floating inputs)',
      '☐ ADC channels configured (resolution, sampling time)',
      '☐ Timer prescaler/ARR values calculated',
      '☐ Interrupt priorities assigned (no conflicts)',
      '☐ Communication protocols configured (baud rate, addresses)',
      '☐ Power budget calculated (total current < supply capacity)',
      '☐ Decoupling capacitors placed (100nF per VDD pin)',
      '☐ Pull-up resistors on I2C lines (4.7kΩ)',
      '☐ Reset circuit verified (100nF cap, optional external reset)',
      '☐ Watchdog timer configured',
      '☐ Debug interface accessible (SWD/JTAG)',
      '☐ Sleep mode entry/exit tested',
      '☐ Pin conflict check completed (alternate functions)'
    ];
    var children = [
      new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'MCU Design Review Checklist', bold: true, size: 48, color: DocStyles.colors.navy, font: DocStyles.fonts.primary })], spacing: { after: 200 } }),
      new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A') + '  |  MCU: ' + (data.mcu || 'N/A'), size: 28, color: DocStyles.colors.blue })], spacing: { after: 100 } }),
      new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: DocStyles.colors.gray })], spacing: { after: 400 } })
    ];
    if (data.peripherals) {
      children.push(new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Peripherals Used', bold: true, size: 32, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }));
      data.peripherals.split('\n').forEach(function(line) {
        if (line.trim()) children.push(new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: '• ' + line.trim(), size: 22, font: DocStyles.fonts.primary })], spacing: { after: 60 } }));
      });
    }
    if (data.power) {
      children.push(new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Power Requirements', bold: true, size: 32, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }));
      data.power.split('\n').forEach(function(line) {
        if (line.trim()) children.push(new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: '• ' + line.trim(), size: 22, font: DocStyles.fonts.primary })], spacing: { after: 60 } }));
      });
    }
    children.push(new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Design Review Checklist', bold: true, size: 32, color: DocStyles.colors.teal })], spacing: { before: 300, after: 200 } }));
    checklistItems.forEach(function(item) {
      children.push(new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: item, size: 22, font: DocStyles.fonts.primary })], spacing: { after: 80 } }));
    });
    if (data.notes) {
      children.push(new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: DocStyles.colors.teal })], spacing: { before: 400, after: 200 } }));
      children.push(new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes, size: 22, font: DocStyles.fonts.primary })], spacing: { after: 200 } }));
    }
    var doc = new docx_lib.Document({ sections: [{ properties: {}, children: children }] });
    var blob = await docx_lib.Packer.toBlob(doc);
    this._downloadFile(blob, filename + '.docx');
  },

  generateDesignReviewExcel: function(filename, data) {
    var rows = [
      ['MCU Design Review Checklist'],
      ['Project', data.projectName || ''],
      ['Target MCU', data.mcu || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Peripherals Used'],
    ];
    if (data.peripherals) {
      data.peripherals.split('\n').forEach(function(line) {
        if (line.trim()) rows.push(['', line.trim()]);
      });
    }
    rows.push([]);
    rows.push(['Power Requirements']);
    if (data.power) {
      data.power.split('\n').forEach(function(line) {
        if (line.trim()) rows.push(['', line.trim()]);
      });
    }
    rows.push([]);
    rows.push(['Design Review Checklist', 'Status']);
    var checks = [
      'Clock configuration verified', 'All GPIO pins assigned', 'ADC channels configured',
      'Timer prescaler/ARR values calculated', 'Interrupt priorities assigned',
      'Communication protocols configured', 'Power budget calculated',
      'Decoupling capacitors placed', 'Pull-up resistors on I2C lines',
      'Reset circuit verified', 'Watchdog timer configured',
      'Debug interface accessible', 'Sleep mode entry/exit tested', 'Pin conflict check completed'
    ];
    checks.forEach(function(c) { rows.push([c, '☐']); });
    rows.push([]);
    rows.push(['Notes', data.notes || '']);

    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 40 }, { wch: 40 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Design Review');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDesignReviewPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFillColor(...DocStyles.rgb.navy);
    pdf.rect(0, 0, 210, 40, 'F');
    pdf.setTextColor(...DocStyles.rgb.white);
    pdf.setFontSize(22);
    pdf.text('MCU Design Review Checklist', 15, 20);
    pdf.setFontSize(12);
    pdf.text('Project: ' + (data.projectName || 'N/A') + '  |  MCU: ' + (data.mcu || 'N/A'), 15, 32);

    var y = 50;
    if (data.peripherals) {
      pdf.setTextColor(...DocStyles.rgb.teal);
      pdf.setFontSize(14);
      pdf.text('Peripherals Used', 15, y);
      y += 8;
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      pdf.setFontSize(10);
      data.peripherals.split('\n').forEach(function(line) {
        if (line.trim()) { pdf.text('• ' + line.trim(), 20, y); y += 6; }
      });
      y += 4;
    }

    if (data.power) {
      pdf.setTextColor(...DocStyles.rgb.teal);
      pdf.setFontSize(14);
      pdf.text('Power Requirements', 15, y);
      y += 8;
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      pdf.setFontSize(10);
      data.power.split('\n').forEach(function(line) {
        if (line.trim()) { pdf.text('• ' + line.trim(), 20, y); y += 6; }
      });
      y += 4;
    }

    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.setFontSize(14);
    pdf.text('Design Review Checklist', 15, y);
    y += 8;
    pdf.setTextColor(...DocStyles.rgb.darkGray);
    pdf.setFontSize(10);
    var checks = [
      'Clock configuration verified', 'All GPIO pins assigned', 'ADC channels configured',
      'Timer prescaler/ARR calculated', 'Interrupt priorities assigned',
      'Communication protocols configured', 'Power budget calculated',
      'Decoupling caps placed (100nF/VDD)', 'I2C pull-ups (4.7kΩ)',
      'Reset circuit verified', 'Watchdog configured',
      'Debug interface accessible (SWD)', 'Sleep mode tested', 'Pin conflict check done'
    ];
    checks.forEach(function(c) {
      pdf.text('☐  ' + c, 20, y);
      y += 6;
      if (y > 270) { pdf.addPage(); y = 20; }
    });

    if (data.notes) {
      y += 5;
      pdf.setTextColor(...DocStyles.rgb.teal);
      pdf.setFontSize(14);
      pdf.text('Additional Notes', 15, y);
      y += 8;
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      pdf.setFontSize(10);
      var noteLines = pdf.splitTextToSize(data.notes, 175);
      pdf.text(noteLines, 15, y);
    }

    pdf.setFontSize(8);
    pdf.setTextColor(...DocStyles.rgb.mediumGray);
    pdf.text('Generated: ' + new Date().toLocaleDateString() + '  |  wasilzafar.com', 15, 285);
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // SCHEMATIC REVIEW (Part 4: Schematic Design)
  // ============================================================

  generateSchematicReviewWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Status','Notes'],['Project',data.projectName||'N/A',''],['Schematic Tool',data.edaTool||'N/A',''],['Review Date',new Date().toLocaleDateString(),'Auto'],['Power Nets Checked',data.powerNets||'N/A',''],['Bypass Caps Verified',data.bypassCaps||'N/A',''],['ERC Clean',data.ercClean||'N/A',''],['Checklist Notes',data.notes||'N/A','']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Schematic Review Checklist',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateSchematicReviewExcel: function(filename, data) {
    var rows = [['Item','Value'],['Project',data.projectName||''],['EDA Tool',data.edaTool||''],['Power Nets',data.powerNets||''],['Bypass Caps',data.bypassCaps||''],['ERC Clean',data.ercClean||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Schematic Review');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateSchematicReviewPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Schematic Review Checklist',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['EDA Tool',data.edaTool],['Power Nets',data.powerNets],['Bypass Caps',data.bypassCaps],['ERC Clean',data.ercClean],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // PCB STACKUP (Part 5: PCB Layout)
  // ============================================================

  generatePcbStackupWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['Layer Count',data.layerCount||'N/A'],['Board Size',data.boardSize||'N/A'],['Stackup Type',data.stackupType||'N/A'],['Impedance Target',data.impedance||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'PCB Stackup Report',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generatePcbStackupExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['Layer Count',data.layerCount||''],['Board Size',data.boardSize||''],['Stackup',data.stackupType||''],['Impedance',data.impedance||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'PCB Stackup');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generatePcbStackupPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('PCB Stackup Report',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Layers',data.layerCount],['Size',data.boardSize],['Stackup',data.stackupType],['Impedance',data.impedance],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // SIM REPORT (Part 6: Simulation)
  // ============================================================

  generateSimReportWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['Simulation Type',data.simType||'N/A'],['Tool',data.simTool||'N/A'],['Results',data.results||'N/A'],['Pass/Fail',data.verdict||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Simulation Report',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateSimReportExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['Sim Type',data.simType||''],['Tool',data.simTool||''],['Results',data.results||''],['Verdict',data.verdict||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Simulation');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateSimReportPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Simulation Report',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Type',data.simType],['Tool',data.simTool],['Results',data.results],['Verdict',data.verdict],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // DFX CHECKLIST (Part 7: DFx)
  // ============================================================

  generateDfxChecklistWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Category','Status'],['Project',data.projectName||'N/A'],['DFM Score',data.dfmScore||'N/A'],['DFA Score',data.dfaScore||'N/A'],['DFT Score',data.dftScore||'N/A'],['Issues Found',data.issues||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'DFx Checklist',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateDfxChecklistExcel: function(filename, data) {
    var rows = [['Category','Value'],['Project',data.projectName||''],['DFM',data.dfmScore||''],['DFA',data.dfaScore||''],['DFT',data.dftScore||''],['Issues',data.issues||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'DFx Checklist');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateDfxChecklistPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('DFx Checklist',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['DFM Score',data.dfmScore],['DFA Score',data.dfaScore],['DFT Score',data.dftScore],['Issues',data.issues],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // MFG PACKAGE (Part 8: Manufacturing)
  // ============================================================

  generateMfgPackageWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Detail'],['Project',data.projectName||'N/A'],['Manufacturer',data.manufacturer||'N/A'],['Quantity',data.quantity||'N/A'],['Gerber Rev',data.gerberRev||'N/A'],['BOM Rev',data.bomRev||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Manufacturing Package',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateMfgPackageExcel: function(filename, data) {
    var rows = [['Item','Value'],['Project',data.projectName||''],['Manufacturer',data.manufacturer||''],['Quantity',data.quantity||''],['Gerber Rev',data.gerberRev||''],['BOM Rev',data.bomRev||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Mfg Package');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateMfgPackagePDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Manufacturing Package',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Manufacturer',data.manufacturer],['Quantity',data.quantity],['Gerber Rev',data.gerberRev],['BOM Rev',data.bomRev],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // BRINGUP LOG (Part 9: Bring-Up & Debugging)
  // ============================================================

  generateBringupLogWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Step','Result'],['Board Rev',data.boardRev||'N/A'],['Power-On Test',data.powerTest||'N/A'],['Clock Verify',data.clockTest||'N/A'],['Debug Port',data.debugPort||'N/A'],['Peripheral Test',data.peripheralTest||'N/A'],['Issues',data.issues||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Board Bring-Up Log',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateBringupLogExcel: function(filename, data) {
    var rows = [['Step','Result'],['Board Rev',data.boardRev||''],['Power-On',data.powerTest||''],['Clock',data.clockTest||''],['Debug',data.debugPort||''],['Peripherals',data.peripheralTest||''],['Issues',data.issues||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Bring-Up Log');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateBringupLogPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Board Bring-Up Log',15,20);p.setFontSize(12);p.text('Board: '+(data.boardRev||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Power-On',data.powerTest],['Clock',data.clockTest],['Debug Port',data.debugPort],['Peripherals',data.peripheralTest],['Issues',data.issues],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // FW CONFIG (Part 10: Firmware)
  // ============================================================

  generateFwConfigWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['MCU',data.mcu||'N/A'],['RTOS',data.rtos||'N/A'],['Clock Config',data.clockConfig||'N/A'],['Peripherals',data.peripherals||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Firmware Configuration',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateFwConfigExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['MCU',data.mcu||''],['RTOS',data.rtos||''],['Clock',data.clockConfig||''],['Peripherals',data.peripherals||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'FW Config');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateFwConfigPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Firmware Configuration',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['MCU',data.mcu],['RTOS',data.rtos],['Clock',data.clockConfig],['Peripherals',data.peripherals],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // POWER BUDGET (Part 11: Advanced Power)
  // ============================================================

  generatePowerBudgetWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Rail','Current'],['Project',data.projectName||'N/A'],['Input Voltage',data.inputVoltage||'N/A'],['3.3V Rail',data.rail3v3||'N/A'],['1.8V Rail',data.rail1v8||'N/A'],['Total Power',data.totalPower||'N/A'],['Battery Life',data.batteryLife||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Power Budget Analysis',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generatePowerBudgetExcel: function(filename, data) {
    var rows = [['Parameter','Value','Unit'],['Project',data.projectName||'',''],['Input Voltage',data.inputVoltage||'','V'],['3.3V Rail',data.rail3v3||'','mA'],['1.8V Rail',data.rail1v8||'','mA'],['Total Power',data.totalPower||'','mW'],['Battery Life',data.batteryLife||'','hrs'],['Notes',data.notes||'','']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:25},{wch:10}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Power Budget');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generatePowerBudgetPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Power Budget Analysis',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Input',data.inputVoltage],['3.3V Rail',data.rail3v3],['1.8V Rail',data.rail1v8],['Total Power',data.totalPower],['Battery Life',data.batteryLife],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // TEST PLAN (Part 12: Testing & Validation)
  // ============================================================

  generateTestPlanWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Test','Criteria'],['Project',data.projectName||'N/A'],['Test Scope',data.testScope||'N/A'],['Equipment',data.equipment||'N/A'],['Pass Criteria',data.passCriteria||'N/A'],['Results',data.results||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Hardware Test Plan',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateTestPlanExcel: function(filename, data) {
    var rows = [['Item','Value'],['Project',data.projectName||''],['Scope',data.testScope||''],['Equipment',data.equipment||''],['Pass Criteria',data.passCriteria||''],['Results',data.results||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Test Plan');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateTestPlanPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Hardware Test Plan',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Scope',data.testScope],['Equipment',data.equipment],['Pass Criteria',data.passCriteria],['Results',data.results],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // COMPLIANCE CHECKLIST (Part 13: Certification)
  // ============================================================

  generateComplianceChecklistWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Certification','Status'],['Product',data.productName||'N/A'],['FCC',data.fccStatus||'N/A'],['CE',data.ceStatus||'N/A'],['UL',data.ulStatus||'N/A'],['RoHS',data.rohsStatus||'N/A'],['Lab',data.testLab||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Compliance Checklist',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateComplianceChecklistExcel: function(filename, data) {
    var rows = [['Certification','Status'],['Product',data.productName||''],['FCC',data.fccStatus||''],['CE',data.ceStatus||''],['UL',data.ulStatus||''],['RoHS',data.rohsStatus||''],['Lab',data.testLab||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Compliance');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateComplianceChecklistPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Compliance Checklist',15,20);p.setFontSize(12);p.text('Product: '+(data.productName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['FCC',data.fccStatus],['CE',data.ceStatus],['UL',data.ulStatus],['RoHS',data.rohsStatus],['Test Lab',data.testLab],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // PRODUCTION COST (Part 14: Production Scaling)
  // ============================================================

  generateProductionCostWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Cost'],['Product',data.productName||'N/A'],['BOM Cost',data.bomCost||'N/A'],['Assembly',data.assemblyCost||'N/A'],['Testing',data.testCost||'N/A'],['Volume',data.volume||'N/A'],['Total Unit Cost',data.totalCost||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Production Cost Analysis',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateProductionCostExcel: function(filename, data) {
    var rows = [['Item','Value'],['Product',data.productName||''],['BOM',data.bomCost||''],['Assembly',data.assemblyCost||''],['Testing',data.testCost||''],['Volume',data.volume||''],['Total',data.totalCost||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:30}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Production Cost');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateProductionCostPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Production Cost Analysis',15,20);p.setFontSize(12);p.text('Product: '+(data.productName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['BOM',data.bomCost],['Assembly',data.assemblyCost],['Testing',data.testCost],['Volume',data.volume],['Total',data.totalCost],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // ECO TRACKER (Part 15: Engineering Change Orders)
  // ============================================================

  generateEcoTrackerWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Field','Detail'],['ECO Number',data.ecoNumber||'N/A'],['Description',data.description||'N/A'],['Affected Parts',data.affectedParts||'N/A'],['Reason',data.reason||'N/A'],['Impact',data.impact||'N/A'],['Approval Status',data.approvalStatus||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'ECO Tracker',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateEcoTrackerExcel: function(filename, data) {
    var rows = [['Field','Value'],['ECO #',data.ecoNumber||''],['Description',data.description||''],['Affected Parts',data.affectedParts||''],['Reason',data.reason||''],['Impact',data.impact||''],['Approval',data.approvalStatus||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'ECO Tracker');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateEcoTrackerPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('ECO Tracker',15,20);p.setFontSize(12);p.text('ECO: '+(data.ecoNumber||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Description',data.description],['Affected Parts',data.affectedParts],['Reason',data.reason],['Impact',data.impact],['Approval',data.approvalStatus],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // THERMAL BUDGET (Part 16: Thermal Management)
  // ============================================================

  generateThermalBudgetWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['Max Ambient',data.maxAmbient||'N/A'],['Total Dissipation',data.totalDissipation||'N/A'],['Thermal Resistance',data.thermalResistance||'N/A'],['Junction Temp',data.junctionTemp||'N/A'],['Cooling Method',data.coolingMethod||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Thermal Budget Analysis',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateThermalBudgetExcel: function(filename, data) {
    var rows = [['Parameter','Value','Unit'],['Project',data.projectName||'',''],['Max Ambient',data.maxAmbient||'','°C'],['Total Dissipation',data.totalDissipation||'','W'],['Theta JA',data.thermalResistance||'','°C/W'],['Tj',data.junctionTemp||'','°C'],['Cooling',data.coolingMethod||'',''],['Notes',data.notes||'','']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:22},{wch:25},{wch:10}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Thermal Budget');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateThermalBudgetPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Thermal Budget Analysis',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Max Ambient',data.maxAmbient],['Dissipation',data.totalDissipation],['Theta JA',data.thermalResistance],['Junction Temp',data.junctionTemp],['Cooling',data.coolingMethod],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // INTERFACE SPEC (Part 17: Communication Interfaces)
  // ============================================================

  generateInterfaceSpecWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Detail'],['Project',data.projectName||'N/A'],['Interface',data.interfaceType||'N/A'],['Speed',data.speed||'N/A'],['Protocol',data.protocol||'N/A'],['Pin Count',data.pinCount||'N/A'],['Voltage Levels',data.voltageLevels||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Interface Specification',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateInterfaceSpecExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['Interface',data.interfaceType||''],['Speed',data.speed||''],['Protocol',data.protocol||''],['Pins',data.pinCount||''],['Voltage',data.voltageLevels||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Interface Spec');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateInterfaceSpecPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Interface Specification',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Interface',data.interfaceType],['Speed',data.speed],['Protocol',data.protocol],['Pins',data.pinCount],['Voltage',data.voltageLevels],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // ENV MONITOR BOM (Capstone 1: Environmental Monitor)
  // ============================================================

  generateEnvMonitorBomWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Component','Specification'],['Project',data.projectName||'N/A'],['MCU',data.mcu||'N/A'],['Sensors',data.sensors||'N/A'],['Power Source',data.powerSource||'N/A'],['Communication',data.comms||'N/A'],['Enclosure',data.enclosure||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Environmental Monitor BOM',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateEnvMonitorBomExcel: function(filename, data) {
    var rows = [['Component','Value'],['Project',data.projectName||''],['MCU',data.mcu||''],['Sensors',data.sensors||''],['Power',data.powerSource||''],['Comms',data.comms||''],['Enclosure',data.enclosure||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Env Monitor BOM');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateEnvMonitorBomPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Environmental Monitor BOM',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['MCU',data.mcu],['Sensors',data.sensors],['Power',data.powerSource],['Comms',data.comms],['Enclosure',data.enclosure],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // PSU SPEC (Capstone 2: Smart Power Supply)
  // ============================================================

  generatePsuSpecWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['Input Range',data.inputRange||'N/A'],['Output Channels',data.outputChannels||'N/A'],['Max Power',data.maxPower||'N/A'],['Protection',data.protection||'N/A'],['Interface',data.interface||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Power Supply Specification',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generatePsuSpecExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['Input',data.inputRange||''],['Outputs',data.outputChannels||''],['Max Power',data.maxPower||''],['Protection',data.protection||''],['Interface',data.interface||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'PSU Spec');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generatePsuSpecPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Power Supply Specification',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Input',data.inputRange],['Outputs',data.outputChannels],['Max Power',data.maxPower],['Protection',data.protection],['Interface',data.interface],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // AI CAMERA PERF (Capstone 3: Edge AI Camera)
  // ============================================================

  generateAiCameraPerfWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Metric','Value'],['Project',data.projectName||'N/A'],['Processor',data.processor||'N/A'],['Camera Module',data.camera||'N/A'],['Model',data.aiModel||'N/A'],['FPS',data.fps||'N/A'],['Accuracy',data.accuracy||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'AI Camera Performance Report',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateAiCameraPerfExcel: function(filename, data) {
    var rows = [['Metric','Value'],['Project',data.projectName||''],['Processor',data.processor||''],['Camera',data.camera||''],['Model',data.aiModel||''],['FPS',data.fps||''],['Accuracy',data.accuracy||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'AI Camera Perf');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateAiCameraPerfPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('AI Camera Performance',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Processor',data.processor],['Camera',data.camera],['Model',data.aiModel],['FPS',data.fps],['Accuracy',data.accuracy],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // HUB DEVICE PLAN (Capstone 4: Home Automation Hub)
  // ============================================================

  generateHubDevicePlanWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Feature','Detail'],['Project',data.projectName||'N/A'],['Processor',data.processor||'N/A'],['Radios',data.radios||'N/A'],['Protocols',data.protocols||'N/A'],['Storage',data.storage||'N/A'],['Max Devices',data.maxDevices||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Home Automation Hub Plan',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateHubDevicePlanExcel: function(filename, data) {
    var rows = [['Feature','Value'],['Project',data.projectName||''],['Processor',data.processor||''],['Radios',data.radios||''],['Protocols',data.protocols||''],['Storage',data.storage||''],['Max Devices',data.maxDevices||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Hub Plan');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateHubDevicePlanPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Home Automation Hub Plan',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Processor',data.processor],['Radios',data.radios],['Protocols',data.protocols],['Storage',data.storage],['Max Devices',data.maxDevices],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // INDUSTRIAL CHANNEL (Capstone 5: Industrial Monitor)
  // ============================================================

  generateIndustrialChannelWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['System',data.systemName||'N/A'],['Channels',data.channels||'N/A'],['Sample Rate',data.sampleRate||'N/A'],['Interface',data.interface||'N/A'],['Environment',data.environment||'N/A'],['Standards',data.standards||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Industrial Monitoring Spec',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateIndustrialChannelExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['System',data.systemName||''],['Channels',data.channels||''],['Sample Rate',data.sampleRate||''],['Interface',data.interface||''],['Environment',data.environment||''],['Standards',data.standards||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Industrial Monitor');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateIndustrialChannelPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Industrial Monitoring Spec',15,20);p.setFontSize(12);p.text('System: '+(data.systemName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Channels',data.channels],['Sample Rate',data.sampleRate],['Interface',data.interface],['Environment',data.environment],['Standards',data.standards],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // DEBUG SESSION (Capstone 6: Debugging Assistant)
  // ============================================================

  generateDebugSessionWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Field','Detail'],['Board',data.boardName||'N/A'],['Issue',data.issueDescription||'N/A'],['Symptoms',data.symptoms||'N/A'],['Root Cause',data.rootCause||'N/A'],['Fix Applied',data.fix||'N/A'],['Verified',data.verified||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Debug Session Log',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateDebugSessionExcel: function(filename, data) {
    var rows = [['Field','Detail'],['Board',data.boardName||''],['Issue',data.issueDescription||''],['Symptoms',data.symptoms||''],['Root Cause',data.rootCause||''],['Fix',data.fix||''],['Verified',data.verified||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Debug Session');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateDebugSessionPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Debug Session Log',15,20);p.setFontSize(12);p.text('Board: '+(data.boardName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Issue',data.issueDescription],['Symptoms',data.symptoms],['Root Cause',data.rootCause],['Fix',data.fix],['Verified',data.verified],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // WEARABLE SENSOR (Capstone 7: Wearable Health)
  // ============================================================

  generateWearableSensorWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Feature','Specification'],['Device',data.deviceName||'N/A'],['Sensors',data.sensors||'N/A'],['MCU',data.mcu||'N/A'],['Battery',data.battery||'N/A'],['BLE Profile',data.bleProfile||'N/A'],['Form Factor',data.formFactor||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Wearable Sensor Specification',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateWearableSensorExcel: function(filename, data) {
    var rows = [['Feature','Value'],['Device',data.deviceName||''],['Sensors',data.sensors||''],['MCU',data.mcu||''],['Battery',data.battery||''],['BLE Profile',data.bleProfile||''],['Form Factor',data.formFactor||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Wearable Spec');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateWearableSensorPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Wearable Sensor Specification',15,20);p.setFontSize(12);p.text('Device: '+(data.deviceName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Sensors',data.sensors],['MCU',data.mcu],['Battery',data.battery],['BLE Profile',data.bleProfile],['Form Factor',data.formFactor],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // ROBOT PLATFORM (Capstone 8: Autonomous Robot)
  // ============================================================

  generateRobotPlatformWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Subsystem','Detail'],['Robot Name',data.robotName||'N/A'],['Drive System',data.driveSystem||'N/A'],['Sensors',data.sensors||'N/A'],['Compute',data.compute||'N/A'],['Power',data.power||'N/A'],['Autonomy',data.autonomyLevel||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Robot Platform Specification',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateRobotPlatformExcel: function(filename, data) {
    var rows = [['Subsystem','Value'],['Robot',data.robotName||''],['Drive',data.driveSystem||''],['Sensors',data.sensors||''],['Compute',data.compute||''],['Power',data.power||''],['Autonomy',data.autonomyLevel||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Robot Platform');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateRobotPlatformPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Robot Platform Specification',15,20);p.setFontSize(12);p.text('Robot: '+(data.robotName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Drive',data.driveSystem],['Sensors',data.sensors],['Compute',data.compute],['Power',data.power],['Autonomy',data.autonomyLevel],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // PCB CHECKLIST (Template 1: STM32 Custom PCB)
  // ============================================================

  generatePcbChecklistWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Detail'],['PCB Project',data.pcbProject||'N/A'],['Layer Count',data.pcbLayers||'N/A'],['Checklist Notes',data.pcbNotes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'PCB Design Checklist',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generatePcbChecklistExcel: function(filename, data) {
    var rows = [['Item','Detail'],['PCB Project',data.pcbProject||''],['Layers',data.pcbLayers||''],['Notes',data.pcbNotes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:50}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'PCB Checklist');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generatePcbChecklistPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('PCB Design Checklist',15,20);p.setFontSize(12);p.text('Project: '+(data.pcbProject||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Layers',data.pcbLayers],['Notes',data.pcbNotes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');var lines=p.splitTextToSize(String(r[1]),120);p.text(lines,70,y);y+=lines.length*7+3;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // EDA CONFIG (Template 2: KiCad/Altium)
  // ============================================================

  generateEdaConfigWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Setting','Value'],['Project',data.edaProject||'N/A'],['EDA Tool',data.edaTool||'N/A'],['Design Rules',data.edaRules||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'EDA Configuration Report',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateEdaConfigExcel: function(filename, data) {
    var rows = [['Setting','Value'],['Project',data.edaProject||''],['Tool',data.edaTool||''],['Rules',data.edaRules||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:50}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'EDA Config');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateEdaConfigPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('EDA Configuration Report',15,20);p.setFontSize(12);p.text('Project: '+(data.edaProject||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Tool',data.edaTool],['Rules',data.edaRules]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');var lines=p.splitTextToSize(String(r[1]),120);p.text(lines,70,y);y+=lines.length*7+3;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // IOT PRODUCT PLAN (Template 3: Complete IoT Product)
  // ============================================================

  generateIotProductPlanWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Detail'],['Product',data.productName||'N/A'],['Target Volume',data.targetVolume||'N/A'],['Specifications',data.productSpecs||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'IoT Product Build Plan',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateIotProductPlanExcel: function(filename, data) {
    var rows = [['Item','Detail'],['Product',data.productName||''],['Volume',data.targetVolume||''],['Specs',data.productSpecs||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:15},{wch:50}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'IoT Product');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateIotProductPlanPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('IoT Product Build Plan',15,20);p.setFontSize(12);p.text('Product: '+(data.productName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Volume',data.targetVolume],['Specs',data.productSpecs]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');var lines=p.splitTextToSize(String(r[1]),120);p.text(lines,70,y);y+=lines.length*7+3;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // SCHEMATIC REVIEW (Part 4: Schematic Design)
  // ============================================================

  generateSchematicReviewWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Status','Notes'],['Project',data.projectName||'N/A',''],['Schematic Tool',data.edaTool||'N/A',''],['Review Date',new Date().toLocaleDateString(),'Auto'],['Power Nets Checked',data.powerNets||'N/A',''],['Bypass Caps Verified',data.bypassCaps||'N/A',''],['ERC Clean',data.ercClean||'N/A',''],['Checklist Notes',data.notes||'N/A','']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Schematic Review Checklist',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateSchematicReviewExcel: function(filename, data) {
    var rows = [['Item','Value'],['Project',data.projectName||''],['EDA Tool',data.edaTool||''],['Power Nets',data.powerNets||''],['Bypass Caps',data.bypassCaps||''],['ERC Clean',data.ercClean||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Schematic Review');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateSchematicReviewPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Schematic Review Checklist',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['EDA Tool',data.edaTool],['Power Nets',data.powerNets],['Bypass Caps',data.bypassCaps],['ERC Clean',data.ercClean],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // PCB STACKUP (Part 5: PCB Layout)
  // ============================================================

  generatePcbStackupWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['Layer Count',data.layerCount||'N/A'],['Board Size',data.boardSize||'N/A'],['Stackup Type',data.stackupType||'N/A'],['Impedance Target',data.impedance||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'PCB Stackup Report',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generatePcbStackupExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['Layer Count',data.layerCount||''],['Board Size',data.boardSize||''],['Stackup',data.stackupType||''],['Impedance',data.impedance||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'PCB Stackup');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generatePcbStackupPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('PCB Stackup Report',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Layers',data.layerCount],['Size',data.boardSize],['Stackup',data.stackupType],['Impedance',data.impedance],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // SIM REPORT (Part 6: Simulation)
  // ============================================================

  generateSimReportWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['Simulation Type',data.simType||'N/A'],['Tool',data.simTool||'N/A'],['Results',data.results||'N/A'],['Pass/Fail',data.verdict||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Simulation Report',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateSimReportExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['Sim Type',data.simType||''],['Tool',data.simTool||''],['Results',data.results||''],['Verdict',data.verdict||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Simulation');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateSimReportPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Simulation Report',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Type',data.simType],['Tool',data.simTool],['Results',data.results],['Verdict',data.verdict],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // DFX CHECKLIST (Part 7: DFx)
  // ============================================================

  generateDfxChecklistWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Category','Status'],['Project',data.projectName||'N/A'],['DFM Score',data.dfmScore||'N/A'],['DFA Score',data.dfaScore||'N/A'],['DFT Score',data.dftScore||'N/A'],['Issues Found',data.issues||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'DFx Checklist',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateDfxChecklistExcel: function(filename, data) {
    var rows = [['Category','Value'],['Project',data.projectName||''],['DFM',data.dfmScore||''],['DFA',data.dfaScore||''],['DFT',data.dftScore||''],['Issues',data.issues||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'DFx Checklist');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateDfxChecklistPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('DFx Checklist',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['DFM Score',data.dfmScore],['DFA Score',data.dfaScore],['DFT Score',data.dftScore],['Issues',data.issues],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // MFG PACKAGE (Part 8: Manufacturing)
  // ============================================================

  generateMfgPackageWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Detail'],['Project',data.projectName||'N/A'],['Manufacturer',data.manufacturer||'N/A'],['Quantity',data.quantity||'N/A'],['Gerber Rev',data.gerberRev||'N/A'],['BOM Rev',data.bomRev||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Manufacturing Package',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateMfgPackageExcel: function(filename, data) {
    var rows = [['Item','Value'],['Project',data.projectName||''],['Manufacturer',data.manufacturer||''],['Quantity',data.quantity||''],['Gerber Rev',data.gerberRev||''],['BOM Rev',data.bomRev||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Mfg Package');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateMfgPackagePDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Manufacturing Package',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Manufacturer',data.manufacturer],['Quantity',data.quantity],['Gerber Rev',data.gerberRev],['BOM Rev',data.bomRev],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // BRINGUP LOG (Part 9: Bring-Up & Debugging)
  // ============================================================

  generateBringupLogWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Step','Result'],['Board Rev',data.boardRev||'N/A'],['Power-On Test',data.powerTest||'N/A'],['Clock Verify',data.clockTest||'N/A'],['Debug Port',data.debugPort||'N/A'],['Peripheral Test',data.peripheralTest||'N/A'],['Issues',data.issues||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Board Bring-Up Log',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateBringupLogExcel: function(filename, data) {
    var rows = [['Step','Result'],['Board Rev',data.boardRev||''],['Power-On',data.powerTest||''],['Clock',data.clockTest||''],['Debug',data.debugPort||''],['Peripherals',data.peripheralTest||''],['Issues',data.issues||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Bring-Up Log');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateBringupLogPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Board Bring-Up Log',15,20);p.setFontSize(12);p.text('Board: '+(data.boardRev||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Power-On',data.powerTest],['Clock',data.clockTest],['Debug Port',data.debugPort],['Peripherals',data.peripheralTest],['Issues',data.issues],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // FW CONFIG (Part 10: Firmware)
  // ============================================================

  generateFwConfigWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['MCU',data.mcu||'N/A'],['RTOS',data.rtos||'N/A'],['Clock Config',data.clockConfig||'N/A'],['Peripherals',data.peripherals||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Firmware Configuration',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateFwConfigExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['MCU',data.mcu||''],['RTOS',data.rtos||''],['Clock',data.clockConfig||''],['Peripherals',data.peripherals||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'FW Config');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateFwConfigPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Firmware Configuration',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['MCU',data.mcu],['RTOS',data.rtos],['Clock',data.clockConfig],['Peripherals',data.peripherals],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // POWER BUDGET (Part 11: Advanced Power)
  // ============================================================

  generatePowerBudgetWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Rail','Current'],['Project',data.projectName||'N/A'],['Input Voltage',data.inputVoltage||'N/A'],['3.3V Rail',data.rail3v3||'N/A'],['1.8V Rail',data.rail1v8||'N/A'],['Total Power',data.totalPower||'N/A'],['Battery Life',data.batteryLife||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Power Budget Analysis',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generatePowerBudgetExcel: function(filename, data) {
    var rows = [['Parameter','Value','Unit'],['Project',data.projectName||'',''],['Input Voltage',data.inputVoltage||'','V'],['3.3V Rail',data.rail3v3||'','mA'],['1.8V Rail',data.rail1v8||'','mA'],['Total Power',data.totalPower||'','mW'],['Battery Life',data.batteryLife||'','hrs'],['Notes',data.notes||'','']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:25},{wch:10}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Power Budget');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generatePowerBudgetPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Power Budget Analysis',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Input',data.inputVoltage],['3.3V Rail',data.rail3v3],['1.8V Rail',data.rail1v8],['Total Power',data.totalPower],['Battery Life',data.batteryLife],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // TEST PLAN (Part 12: Testing & Validation)
  // ============================================================

  generateTestPlanWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Test','Criteria'],['Project',data.projectName||'N/A'],['Test Scope',data.testScope||'N/A'],['Equipment',data.equipment||'N/A'],['Pass Criteria',data.passCriteria||'N/A'],['Results',data.results||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Hardware Test Plan',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateTestPlanExcel: function(filename, data) {
    var rows = [['Item','Value'],['Project',data.projectName||''],['Scope',data.testScope||''],['Equipment',data.equipment||''],['Pass Criteria',data.passCriteria||''],['Results',data.results||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Test Plan');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateTestPlanPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Hardware Test Plan',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Scope',data.testScope],['Equipment',data.equipment],['Pass Criteria',data.passCriteria],['Results',data.results],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // COMPLIANCE CHECKLIST (Part 13: Certification)
  // ============================================================

  generateComplianceChecklistWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Certification','Status'],['Product',data.productName||'N/A'],['FCC',data.fccStatus||'N/A'],['CE',data.ceStatus||'N/A'],['UL',data.ulStatus||'N/A'],['RoHS',data.rohsStatus||'N/A'],['Lab',data.testLab||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Compliance Checklist',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateComplianceChecklistExcel: function(filename, data) {
    var rows = [['Certification','Status'],['Product',data.productName||''],['FCC',data.fccStatus||''],['CE',data.ceStatus||''],['UL',data.ulStatus||''],['RoHS',data.rohsStatus||''],['Lab',data.testLab||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Compliance');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateComplianceChecklistPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Compliance Checklist',15,20);p.setFontSize(12);p.text('Product: '+(data.productName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['FCC',data.fccStatus],['CE',data.ceStatus],['UL',data.ulStatus],['RoHS',data.rohsStatus],['Test Lab',data.testLab],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // PRODUCTION COST (Part 14: Production Scaling)
  // ============================================================

  generateProductionCostWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Cost'],['Product',data.productName||'N/A'],['BOM Cost',data.bomCost||'N/A'],['Assembly',data.assemblyCost||'N/A'],['Testing',data.testCost||'N/A'],['Volume',data.volume||'N/A'],['Total Unit Cost',data.totalCost||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Production Cost Analysis',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateProductionCostExcel: function(filename, data) {
    var rows = [['Item','Value'],['Product',data.productName||''],['BOM',data.bomCost||''],['Assembly',data.assemblyCost||''],['Testing',data.testCost||''],['Volume',data.volume||''],['Total',data.totalCost||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:30}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Production Cost');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateProductionCostPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Production Cost Analysis',15,20);p.setFontSize(12);p.text('Product: '+(data.productName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['BOM',data.bomCost],['Assembly',data.assemblyCost],['Testing',data.testCost],['Volume',data.volume],['Total',data.totalCost],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // ECO TRACKER (Part 15: Engineering Change Orders)
  // ============================================================

  generateEcoTrackerWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Field','Detail'],['ECO Number',data.ecoNumber||'N/A'],['Description',data.description||'N/A'],['Affected Parts',data.affectedParts||'N/A'],['Reason',data.reason||'N/A'],['Impact',data.impact||'N/A'],['Approval Status',data.approvalStatus||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'ECO Tracker',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateEcoTrackerExcel: function(filename, data) {
    var rows = [['Field','Value'],['ECO #',data.ecoNumber||''],['Description',data.description||''],['Affected Parts',data.affectedParts||''],['Reason',data.reason||''],['Impact',data.impact||''],['Approval',data.approvalStatus||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'ECO Tracker');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateEcoTrackerPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('ECO Tracker',15,20);p.setFontSize(12);p.text('ECO: '+(data.ecoNumber||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Description',data.description],['Affected Parts',data.affectedParts],['Reason',data.reason],['Impact',data.impact],['Approval',data.approvalStatus],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // THERMAL BUDGET (Part 16: Thermal Management)
  // ============================================================

  generateThermalBudgetWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['Max Ambient',data.maxAmbient||'N/A'],['Total Dissipation',data.totalDissipation||'N/A'],['Thermal Resistance',data.thermalResistance||'N/A'],['Junction Temp',data.junctionTemp||'N/A'],['Cooling Method',data.coolingMethod||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Thermal Budget Analysis',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateThermalBudgetExcel: function(filename, data) {
    var rows = [['Parameter','Value','Unit'],['Project',data.projectName||'',''],['Max Ambient',data.maxAmbient||'','°C'],['Total Dissipation',data.totalDissipation||'','W'],['Theta JA',data.thermalResistance||'','°C/W'],['Tj',data.junctionTemp||'','°C'],['Cooling',data.coolingMethod||'',''],['Notes',data.notes||'','']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:22},{wch:25},{wch:10}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Thermal Budget');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateThermalBudgetPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Thermal Budget Analysis',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Max Ambient',data.maxAmbient],['Dissipation',data.totalDissipation],['Theta JA',data.thermalResistance],['Junction Temp',data.junctionTemp],['Cooling',data.coolingMethod],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // INTERFACE SPEC (Part 17: Communication Interfaces)
  // ============================================================

  generateInterfaceSpecWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Detail'],['Project',data.projectName||'N/A'],['Interface',data.interfaceType||'N/A'],['Speed',data.speed||'N/A'],['Protocol',data.protocol||'N/A'],['Pin Count',data.pinCount||'N/A'],['Voltage Levels',data.voltageLevels||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Interface Specification',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateInterfaceSpecExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['Interface',data.interfaceType||''],['Speed',data.speed||''],['Protocol',data.protocol||''],['Pins',data.pinCount||''],['Voltage',data.voltageLevels||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Interface Spec');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateInterfaceSpecPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Interface Specification',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Interface',data.interfaceType],['Speed',data.speed],['Protocol',data.protocol],['Pins',data.pinCount],['Voltage',data.voltageLevels],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // ENV MONITOR BOM (Capstone 1: Environmental Monitor)
  // ============================================================

  generateEnvMonitorBomWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Component','Specification'],['Project',data.projectName||'N/A'],['MCU',data.mcu||'N/A'],['Sensors',data.sensors||'N/A'],['Power Source',data.powerSource||'N/A'],['Communication',data.comms||'N/A'],['Enclosure',data.enclosure||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Environmental Monitor BOM',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateEnvMonitorBomExcel: function(filename, data) {
    var rows = [['Component','Value'],['Project',data.projectName||''],['MCU',data.mcu||''],['Sensors',data.sensors||''],['Power',data.powerSource||''],['Comms',data.comms||''],['Enclosure',data.enclosure||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Env Monitor BOM');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateEnvMonitorBomPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Environmental Monitor BOM',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['MCU',data.mcu],['Sensors',data.sensors],['Power',data.powerSource],['Comms',data.comms],['Enclosure',data.enclosure],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // PSU SPEC (Capstone 2: Smart Power Supply)
  // ============================================================

  generatePsuSpecWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['Project',data.projectName||'N/A'],['Input Range',data.inputRange||'N/A'],['Output Channels',data.outputChannels||'N/A'],['Max Power',data.maxPower||'N/A'],['Protection',data.protection||'N/A'],['Interface',data.interface||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Power Supply Specification',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generatePsuSpecExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['Project',data.projectName||''],['Input',data.inputRange||''],['Outputs',data.outputChannels||''],['Max Power',data.maxPower||''],['Protection',data.protection||''],['Interface',data.interface||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'PSU Spec');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generatePsuSpecPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Power Supply Specification',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Input',data.inputRange],['Outputs',data.outputChannels],['Max Power',data.maxPower],['Protection',data.protection],['Interface',data.interface],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // AI CAMERA PERF (Capstone 3: Edge AI Camera)
  // ============================================================

  generateAiCameraPerfWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Metric','Value'],['Project',data.projectName||'N/A'],['Processor',data.processor||'N/A'],['Camera Module',data.camera||'N/A'],['Model',data.aiModel||'N/A'],['FPS',data.fps||'N/A'],['Accuracy',data.accuracy||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'AI Camera Performance Report',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateAiCameraPerfExcel: function(filename, data) {
    var rows = [['Metric','Value'],['Project',data.projectName||''],['Processor',data.processor||''],['Camera',data.camera||''],['Model',data.aiModel||''],['FPS',data.fps||''],['Accuracy',data.accuracy||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'AI Camera Perf');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateAiCameraPerfPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('AI Camera Performance',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Processor',data.processor],['Camera',data.camera],['Model',data.aiModel],['FPS',data.fps],['Accuracy',data.accuracy],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // HUB DEVICE PLAN (Capstone 4: Home Automation Hub)
  // ============================================================

  generateHubDevicePlanWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Feature','Detail'],['Project',data.projectName||'N/A'],['Processor',data.processor||'N/A'],['Radios',data.radios||'N/A'],['Protocols',data.protocols||'N/A'],['Storage',data.storage||'N/A'],['Max Devices',data.maxDevices||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Home Automation Hub Plan',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateHubDevicePlanExcel: function(filename, data) {
    var rows = [['Feature','Value'],['Project',data.projectName||''],['Processor',data.processor||''],['Radios',data.radios||''],['Protocols',data.protocols||''],['Storage',data.storage||''],['Max Devices',data.maxDevices||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Hub Plan');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateHubDevicePlanPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Home Automation Hub Plan',15,20);p.setFontSize(12);p.text('Project: '+(data.projectName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Processor',data.processor],['Radios',data.radios],['Protocols',data.protocols],['Storage',data.storage],['Max Devices',data.maxDevices],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // INDUSTRIAL CHANNEL (Capstone 5: Industrial Monitor)
  // ============================================================

  generateIndustrialChannelWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Parameter','Value'],['System',data.systemName||'N/A'],['Channels',data.channels||'N/A'],['Sample Rate',data.sampleRate||'N/A'],['Interface',data.interface||'N/A'],['Environment',data.environment||'N/A'],['Standards',data.standards||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Industrial Monitoring Spec',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateIndustrialChannelExcel: function(filename, data) {
    var rows = [['Parameter','Value'],['System',data.systemName||''],['Channels',data.channels||''],['Sample Rate',data.sampleRate||''],['Interface',data.interface||''],['Environment',data.environment||''],['Standards',data.standards||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Industrial Monitor');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateIndustrialChannelPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Industrial Monitoring Spec',15,20);p.setFontSize(12);p.text('System: '+(data.systemName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Channels',data.channels],['Sample Rate',data.sampleRate],['Interface',data.interface],['Environment',data.environment],['Standards',data.standards],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // DEBUG SESSION (Capstone 6: Debugging Assistant)
  // ============================================================

  generateDebugSessionWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Field','Detail'],['Board',data.boardName||'N/A'],['Issue',data.issueDescription||'N/A'],['Symptoms',data.symptoms||'N/A'],['Root Cause',data.rootCause||'N/A'],['Fix Applied',data.fix||'N/A'],['Verified',data.verified||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Debug Session Log',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateDebugSessionExcel: function(filename, data) {
    var rows = [['Field','Detail'],['Board',data.boardName||''],['Issue',data.issueDescription||''],['Symptoms',data.symptoms||''],['Root Cause',data.rootCause||''],['Fix',data.fix||''],['Verified',data.verified||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Debug Session');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateDebugSessionPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Debug Session Log',15,20);p.setFontSize(12);p.text('Board: '+(data.boardName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Issue',data.issueDescription],['Symptoms',data.symptoms],['Root Cause',data.rootCause],['Fix',data.fix],['Verified',data.verified],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // WEARABLE SENSOR (Capstone 7: Wearable Health)
  // ============================================================

  generateWearableSensorWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Feature','Specification'],['Device',data.deviceName||'N/A'],['Sensors',data.sensors||'N/A'],['MCU',data.mcu||'N/A'],['Battery',data.battery||'N/A'],['BLE Profile',data.bleProfile||'N/A'],['Form Factor',data.formFactor||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Wearable Sensor Specification',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateWearableSensorExcel: function(filename, data) {
    var rows = [['Feature','Value'],['Device',data.deviceName||''],['Sensors',data.sensors||''],['MCU',data.mcu||''],['Battery',data.battery||''],['BLE Profile',data.bleProfile||''],['Form Factor',data.formFactor||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Wearable Spec');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateWearableSensorPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Wearable Sensor Specification',15,20);p.setFontSize(12);p.text('Device: '+(data.deviceName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Sensors',data.sensors],['MCU',data.mcu],['Battery',data.battery],['BLE Profile',data.bleProfile],['Form Factor',data.formFactor],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // ROBOT PLATFORM (Capstone 8: Autonomous Robot)
  // ============================================================

  generateRobotPlatformWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Subsystem','Detail'],['Robot Name',data.robotName||'N/A'],['Drive System',data.driveSystem||'N/A'],['Sensors',data.sensors||'N/A'],['Compute',data.compute||'N/A'],['Power',data.power||'N/A'],['Autonomy',data.autonomyLevel||'N/A'],['Notes',data.notes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'Robot Platform Specification',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateRobotPlatformExcel: function(filename, data) {
    var rows = [['Subsystem','Value'],['Robot',data.robotName||''],['Drive',data.driveSystem||''],['Sensors',data.sensors||''],['Compute',data.compute||''],['Power',data.power||''],['Autonomy',data.autonomyLevel||''],['Notes',data.notes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:40}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Robot Platform');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateRobotPlatformPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('Robot Platform Specification',15,20);p.setFontSize(12);p.text('Robot: '+(data.robotName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Drive',data.driveSystem],['Sensors',data.sensors],['Compute',data.compute],['Power',data.power],['Autonomy',data.autonomyLevel],['Notes',data.notes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');p.text(String(r[1]).substring(0,80),70,y);y+=8;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // PCB CHECKLIST (Template 1: STM32 Custom PCB)
  // ============================================================

  generatePcbChecklistWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Detail'],['PCB Project',data.pcbProject||'N/A'],['Layer Count',data.pcbLayers||'N/A'],['Checklist Notes',data.pcbNotes||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'PCB Design Checklist',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generatePcbChecklistExcel: function(filename, data) {
    var rows = [['Item','Detail'],['PCB Project',data.pcbProject||''],['Layers',data.pcbLayers||''],['Notes',data.pcbNotes||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:50}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'PCB Checklist');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generatePcbChecklistPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('PCB Design Checklist',15,20);p.setFontSize(12);p.text('Project: '+(data.pcbProject||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Layers',data.pcbLayers],['Notes',data.pcbNotes]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');var lines=p.splitTextToSize(String(r[1]),120);p.text(lines,70,y);y+=lines.length*7+3;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // EDA CONFIG (Template 2: KiCad/Altium)
  // ============================================================

  generateEdaConfigWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Setting','Value'],['Project',data.edaProject||'N/A'],['EDA Tool',data.edaTool||'N/A'],['Design Rules',data.edaRules||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'EDA Configuration Report',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateEdaConfigExcel: function(filename, data) {
    var rows = [['Setting','Value'],['Project',data.edaProject||''],['Tool',data.edaTool||''],['Rules',data.edaRules||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:50}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'EDA Config');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateEdaConfigPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('EDA Configuration Report',15,20);p.setFontSize(12);p.text('Project: '+(data.edaProject||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Tool',data.edaTool],['Rules',data.edaRules]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');var lines=p.splitTextToSize(String(r[1]),120);p.text(lines,70,y);y+=lines.length*7+3;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  },

  // ============================================================
  // IOT PRODUCT PLAN (Template 3: Complete IoT Product)
  // ============================================================

  generateIotProductPlanWord: async function(filename, data) {
    var d = window.docx.default || window.docx;
    var rows = [['Item','Detail'],['Product',data.productName||'N/A'],['Target Volume',data.targetVolume||'N/A'],['Specifications',data.productSpecs||'N/A']];
    var tRows = rows.map(function(r,i){return new d.TableRow({children:r.map(function(c){return new d.TableCell({children:[new d.Paragraph({children:[new d.TextRun({text:c,bold:i===0,size:22,color:i===0?DocStyles.colors.white:DocStyles.colors.navy,font:DocStyles.fonts.primary})]})],shading:i===0?{fill:DocStyles.colors.teal}:i%2===0?{fill:DocStyles.colors.altRow}:{}});})});});
    var doc = new d.Document({sections:[{children:[new d.Paragraph({children:[new d.TextRun({text:'IoT Product Build Plan',bold:true,size:48,color:DocStyles.colors.navy,font:DocStyles.fonts.primary})],spacing:{after:400}}),new d.Table({rows:tRows,width:{size:100,type:d.WidthType.PERCENTAGE}})]}]});
    var blob = await d.Packer.toBlob(doc);this._downloadFile(blob,filename+'.docx');
  },
  generateIotProductPlanExcel: function(filename, data) {
    var rows = [['Item','Detail'],['Product',data.productName||''],['Volume',data.targetVolume||''],['Specs',data.productSpecs||'']];
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:15},{wch:50}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'IoT Product');XLSX.writeFile(wb,filename+'.xlsx');
  },
  generateIotProductPlanPDF: function(filename, data) {
    var p=new jspdf.jsPDF();p.setFillColor(...DocStyles.rgb.navy);p.rect(0,0,210,40,'F');p.setTextColor(...DocStyles.rgb.white);p.setFontSize(22);p.text('IoT Product Build Plan',15,20);p.setFontSize(12);p.text('Product: '+(data.productName||'N/A'),15,32);p.setTextColor(...DocStyles.rgb.darkGray);p.setFontSize(11);var y=55;
    [['Volume',data.targetVolume],['Specs',data.productSpecs]].forEach(function(r){if(r[1]){p.setFont(undefined,'bold');p.text(r[0]+':',15,y);p.setFont(undefined,'normal');var lines=p.splitTextToSize(String(r[1]),120);p.text(lines,70,y);y+=lines.length*7+3;}});
    p.setFontSize(8);p.setTextColor(...DocStyles.rgb.mediumGray);p.text('Generated: '+new Date().toLocaleDateString()+'  |  wasilzafar.com',15,285);p.save(filename+'.pdf');
  }
});
