/**
 * Doc Generator - Materials Science Series
 * Extends DocGenerator with materials science series document generators.
 * Requires: doc-generator-core.js loaded first.
 */
Object.assign(DocGenerator, {
  // ============================================================
  // MECHANICAL PROPERTIES REPORT
  // ============================================================

  generateMechPropsWord: async function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var rows = [
      ['Property', 'Value'],
      ['Material', data.materialName || 'N/A'],
      ['Test Type', data.testType || 'N/A'],
      ['Specimen Dimensions', data.specimenDims || 'N/A'],
      ['Test Standard', data.testStandard || 'N/A'],
      ['Yield Strength (MPa)', data.yieldStrength || 'N/A'],
      ['Ultimate Tensile Strength (MPa)', data.uts || 'N/A'],
      ['Elongation (%)', data.elongation || 'N/A'],
      ['Hardness', data.hardness || 'N/A'],
      ['Elastic Modulus (GPa)', data.elasticModulus || 'N/A'],
      ['Fracture Toughness K_IC (MPaâˆšm)', data.fractureToughness || 'N/A'],
      ['Test Temperature (Â°C)', data.temperature || 'N/A'],
      ['Strain Rate (sâ»Â¹)', data.strainRate || 'N/A']
    ];
    var tableRows = rows.map(function(r, idx) {
      return new docx_lib.TableRow({
        children: [
          new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: r[0], bold: idx === 0, size: 22, color: idx === 0 ? 'FFFFFF' : '132440', font: 'Calibri' })], alignment: docx_lib.AlignmentType.LEFT })], shading: idx === 0 ? { fill: '3B9797' } : (idx % 2 === 0 ? { fill: 'F0F8F8' } : {}), width: { size: 4000, type: docx_lib.WidthType.DXA } }),
          new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: r[1], bold: idx === 0, size: 22, color: idx === 0 ? 'FFFFFF' : '333333', font: 'Calibri' })], alignment: docx_lib.AlignmentType.LEFT })], shading: idx === 0 ? { fill: '3B9797' } : (idx % 2 === 0 ? { fill: 'F0F8F8' } : {}), width: { size: 5000, type: docx_lib.WidthType.DXA } })
        ]
      });
    });
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Mechanical Properties Test Report', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Material: ' + (data.materialName || 'N/A'), size: 28, color: '16476A' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Test Type: ' + (data.testType || 'N/A'), size: 24, color: '3B9797' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: '666666' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Test Results', bold: true, size: 32, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Table({ rows: tableRows, width: { size: 100, type: docx_lib.WidthType.PERCENTAGE } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Notes & Observations', bold: true, size: 28, color: '3B9797' })], spacing: { before: 400, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'None', size: 22, font: 'Calibri' })], spacing: { after: 200 } })
        ]
      }]
    });
    var blob = await docx_lib.Packer.toBlob(doc);
    this._downloadFile(blob, filename + '.docx');
  },

  generateMechPropsExcel: function(filename, data) {
    var header = ['Property', 'Value', 'Unit'];
    var rows = [
      header,
      ['Material', data.materialName || '', ''],
      ['Test Type', data.testType || '', ''],
      ['Test Standard', data.testStandard || '', ''],
      ['Specimen Dimensions', data.specimenDims || '', ''],
      ['Test Temperature', data.temperature || '', 'Â°C'],
      ['Strain Rate', data.strainRate || '', 'sâ»Â¹'],
      ['', '', ''],
      ['Yield Strength', data.yieldStrength || '', 'MPa'],
      ['Ultimate Tensile Strength', data.uts || '', 'MPa'],
      ['Elongation', data.elongation || '', '%'],
      ['Elastic Modulus', data.elasticModulus || '', 'GPa'],
      ['Hardness', data.hardness || '', '(see value)'],
      ['Fracture Toughness K_IC', data.fractureToughness || '', 'MPaâˆšm'],
      ['', '', ''],
      ['Notes', data.notes || '', '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 30 }, { wch: 14 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mech Props Report');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMechPropsPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFillColor(19, 36, 64);
    pdf.rect(0, 0, 210, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text('Mechanical Properties Test Report', 15, 20);
    pdf.setFontSize(12);
    pdf.text('Material: ' + (data.materialName || 'N/A') + '  |  Test: ' + (data.testType || 'N/A'), 15, 32);

    pdf.setTextColor(59, 151, 151);
    pdf.setFontSize(14);
    pdf.text('Test Results', 15, 55);

    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(11);
    var y = 65;
    var props = [
      ['Specimen Dimensions', data.specimenDims],
      ['Test Standard', data.testStandard],
      ['Test Temperature', data.temperature ? data.temperature + ' Â°C' : ''],
      ['Strain Rate', data.strainRate ? data.strainRate + ' sâ»Â¹' : ''],
      ['Yield Strength', data.yieldStrength ? data.yieldStrength + ' MPa' : ''],
      ['UTS', data.uts ? data.uts + ' MPa' : ''],
      ['Elongation', data.elongation ? data.elongation + ' %' : ''],
      ['Elastic Modulus', data.elasticModulus ? data.elasticModulus + ' GPa' : ''],
      ['Hardness', data.hardness],
      ['Fracture Toughness K_IC', data.fractureToughness ? data.fractureToughness + ' MPaâˆšm' : '']
    ];
    props.forEach(function(p) {
      if (p[1]) {
        pdf.setFont(undefined, 'bold');
        pdf.text(p[0] + ':', 15, y);
        pdf.setFont(undefined, 'normal');
        pdf.text(String(p[1]), 80, y);
        y += 8;
      }
    });

    y += 5;
    pdf.setTextColor(59, 151, 151);
    pdf.setFontSize(14);
    pdf.text('Notes & Observations', 15, y);
    y += 10;
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(10);
    var noteLines = pdf.splitTextToSize(data.notes || 'None', 175);
    pdf.text(noteLines, 15, y);

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated: ' + new Date().toLocaleDateString() + '  |  wasilzafar.com', 15, 285);

    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // CompSimPlanner â€” Computational Materials Science Project Planner
  // ============================================================

  generateCompSimPlannerWord: function(filename, data) {
    var docx_lib = window.docx.default || window.docx;
    var doc = new docx_lib.Document({
      sections: [{
        properties: {},
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Computational Materials Science Project Planner', bold: true, size: 36, color: '132440' })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 24, color: '16476A' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: '666666', italics: true })], spacing: { after: 300 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Simulation Method', bold: true, size: 24, color: '3B9797' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.simMethod || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Material System', bold: true, size: 24, color: '3B9797' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.materialSystem || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Software / Codes', bold: true, size: 24, color: '3B9797' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.software || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Research Objective', bold: true, size: 24, color: '3B9797' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.objective || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Computational Resources', bold: true, size: 24, color: '3B9797' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.resources || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Workflow Steps', bold: true, size: 24, color: '3B9797' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.workflow || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Expected Deliverables', bold: true, size: 24, color: '3B9797' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.deliverables || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 24, color: '3B9797' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.notes || 'None', size: 22 })], spacing: { after: 300 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated via wasilzafar.com â€” Materials Science Series', size: 16, color: '999999', italics: true })], spacing: { before: 400 } })
        ]
      }]
    });

    docx_lib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateCompSimPlannerExcel: function(filename, data) {
    var rows = [
      ['Computational Materials Science Project Planner'],
      ['Project', data.projectName || 'N/A'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Simulation Method', data.simMethod || 'Not specified'],
      ['Material System', data.materialSystem || 'Not specified'],
      ['Software / Codes', data.software || 'Not specified'],
      ['Research Objective', data.objective || 'Not specified'],
      ['Computational Resources', data.resources || 'Not specified'],
      ['Workflow Steps', data.workflow || 'Not specified'],
      ['Expected Deliverables', data.deliverables || 'Not specified'],
      ['Additional Notes', data.notes || 'None']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Project Planner');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCompSimPlannerPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();

    pdf.setFontSize(22);
    pdf.setTextColor(19, 36, 64);
    pdf.text('Computational Materials Science', 20, 25);
    pdf.text('Project Planner', 20, 35);

    pdf.setFontSize(14);
    pdf.setTextColor(22, 71, 106);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 20, 50);

    pdf.setFontSize(11);
    pdf.setTextColor(102, 102, 102);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 58);

    var y = 75;
    var fields = [
      ['Simulation Method', data.simMethod],
      ['Material System', data.materialSystem],
      ['Software / Codes', data.software],
      ['Research Objective', data.objective],
      ['Computational Resources', data.resources],
      ['Workflow Steps', data.workflow],
      ['Expected Deliverables', data.deliverables],
      ['Additional Notes', data.notes]
    ];

    fields.forEach(function(field) {
      if (y > 260) { pdf.addPage(); y = 25; }
      pdf.setFontSize(12);
      pdf.setTextColor(59, 151, 151);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      var text = field[1] || 'Not specified';
      var lines = pdf.splitTextToSize(text, 165);
      pdf.text(lines, 20, y);
      y += lines.length * 5 + 8;
    });

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated via wasilzafar.com  |  Materials Science Series', 20, 285);

    pdf.save(filename + '.pdf');
  },

});
