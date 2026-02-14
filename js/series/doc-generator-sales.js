/**
 * Doc Generator - Sales Mastery Series
 * Extends DocGenerator with sales mastery series document generators.
 * Requires: doc-generator-core.js loaded first.
 */
Object.assign(DocGenerator, {
  // ============================================================
  // Trust Building Scorecard — Sales Psychology Tool
  // ============================================================
  generateTrustScorecardWord: async function(filename, data) {
    var c = parseInt(data.credibility) || 0;
    var r = parseInt(data.reliability) || 0;
    var i = parseInt(data.intimacy) || 0;
    var s = parseInt(data.selfOrientation) || 1;
    var tq = ((c + r + i) / s).toFixed(2);
    
    var sections = [
      {
        heading: 'Trust Building Scorecard',
        content: [
          'Client: ' + (data.clientName || 'N/A'),
          'Assessed By: ' + (data.yourName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
        ]
      },
      {
        heading: 'Trust Equation Components',
        content: [
          'Credibility: ' + c + '/10',
          'Reliability: ' + r + '/10',
          'Intimacy: ' + i + '/10',
          'Self-Orientation: ' + s + '/10'
        ]
      },
      {
        heading: 'Trust Quotient',
        content: 'TQ = (C + R + I) / S = (' + c + ' + ' + r + ' + ' + i + ') / ' + s + ' = ' + tq
      },
      {
        heading: 'Strengths',
        content: data.strengths || 'Not specified'
      },
      {
        heading: 'Areas for Improvement',
        content: data.improvements || 'Not specified'
      },
      {
        heading: 'Action Plan',
        content: data.actionPlan || 'Not specified'
      }
    ];
    
    return this.generateWord(filename, {
      title: 'Trust Building Scorecard',
      author: data.authorName || '',
      sections: sections
    });
  },
  generateTrustScorecardExcel: function(filename, data) {
    var c = parseInt(data.credibility) || 0;
    var r = parseInt(data.reliability) || 0;
    var i = parseInt(data.intimacy) || 0;
    var s = parseInt(data.selfOrientation) || 1;
    var tq = ((c + r + i) / s).toFixed(2);
    var rows = [
      ['Trust Building Scorecard'],
      ['Client', data.clientName || 'N/A'],
      ['Assessed By', data.yourName || 'N/A'],
      [''],
      ['Component', 'Score', 'Max'],
      ['Credibility', c, 10],
      ['Reliability', r, 10],
      ['Intimacy', i, 10],
      ['Self-Orientation', s, 10],
      [''],
      ['Trust Quotient (TQ)', tq, ''],
      ['Formula', '(C + R + I) / S', ''],
      [''],
      ['Strengths', data.strengths || '', ''],
      ['Areas for Improvement', data.improvements || '', ''],
      ['Action Plan', data.actionPlan || '', '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 40 }, { wch: 10 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trust Scorecard');
    XLSX.writeFile(wb, filename + '.xlsx');
  },
  generateTrustScorecardPDF: function(filename, data) {
    var c = parseInt(data.credibility) || 0;
    var r = parseInt(data.reliability) || 0;
    var i = parseInt(data.intimacy) || 0;
    var s = parseInt(data.selfOrientation) || 1;
    var tq = ((c + r + i) / s).toFixed(2);
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(18);
    pdf.text('Trust Building Scorecard', 20, 25);
    pdf.setFontSize(12);
    pdf.text('Client: ' + (data.clientName || 'N/A'), 20, 35);
    pdf.text('Assessed By: ' + (data.yourName || 'N/A'), 20, 42);
    var y = 55;
    pdf.setFontSize(14);
    pdf.text('Trust Equation Components', 20, y);
    pdf.setFontSize(11);
    y += 10;
    pdf.text('Credibility: ' + c + '/10', 25, y);
    pdf.text('Reliability: ' + r + '/10', 25, y + 7);
    pdf.text('Intimacy: ' + i + '/10', 25, y + 14);
    pdf.text('Self-Orientation: ' + s + '/10', 25, y + 21);
    y += 35;
    pdf.setFontSize(14);
    pdf.text('Trust Quotient: ' + tq, 20, y);
    pdf.setFontSize(10);
    pdf.text('Formula: (C + R + I) / S = (' + c + ' + ' + r + ' + ' + i + ') / ' + s, 20, y + 8);
    y += 20;
    if (data.strengths) {
      pdf.setFontSize(14);
      pdf.text('Strengths', 20, y);
      pdf.setFontSize(10);
      var lines = pdf.splitTextToSize(data.strengths, 170);
      pdf.text(lines, 20, y + 8);
      y += 8 + lines.length * 5;
    }
    if (data.improvements) {
      y += 5;
      pdf.setFontSize(14);
      pdf.text('Areas for Improvement', 20, y);
      pdf.setFontSize(10);
      var lines2 = pdf.splitTextToSize(data.improvements, 170);
      pdf.text(lines2, 20, y + 8);
      y += 8 + lines2.length * 5;
    }
    if (data.actionPlan) {
      y += 5;
      pdf.setFontSize(14);
      pdf.text('Action Plan', 20, y);
      pdf.setFontSize(10);
      var lines3 = pdf.splitTextToSize(data.actionPlan, 170);
      pdf.text(lines3, 20, y + 8);
    }
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // Sales Mindset Assessment — Sales Psychology Tool
  // ============================================================
  generateMindsetAssessmentWord: async function(filename, data) {
    var dims = [
      { label: 'Confidence', key: 'confidence' },
      { label: 'Resilience', key: 'resilience' },
      { label: 'Curiosity', key: 'curiosity' },
      { label: 'Empathy', key: 'empathy' },
      { label: 'Discipline', key: 'discipline' },
      { label: 'Growth Orientation', key: 'growth' }
    ];
    var scores = dims.map(function(d) { return d.label + ': ' + (data[d.key] || 'N/A') + '/10'; });
    var total = dims.reduce(function(sum, d) { return sum + (parseInt(data[d.key]) || 0); }, 0);
    var avg = (total / 6).toFixed(1);
    
    var sections = [
      {
        heading: 'Sales Psychology Self-Assessment',
        content: [
          'Name: ' + (data.name || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
        ]
      },
      {
        heading: 'Mindset Dimensions',
        content: scores
      },
      {
        heading: 'Overall Score',
        content: total + '/60 (Average: ' + avg + '/10)'
      },
      {
        heading: 'Top Strengths',
        content: data.strengths || 'Not specified'
      },
      {
        heading: 'Development Areas',
        content: data.development || 'Not specified'
      },
      {
        heading: '90-Day Goals',
        content: data.goals || 'Not specified'
      }
    ];
    
    return this.generateWord(filename, {
      title: 'Sales Psychology Self-Assessment',
      author: data.authorName || '',
      sections: sections
    });
  },
  generateMindsetAssessmentExcel: function(filename, data) {
    var dims = ['Confidence', 'Resilience', 'Curiosity', 'Empathy', 'Discipline', 'Growth Orientation'];
    var keys = ['confidence', 'resilience', 'curiosity', 'empathy', 'discipline', 'growth'];
    var total = keys.reduce(function(sum, k) { return sum + (parseInt(data[k]) || 0); }, 0);
    var avg = (total / 6).toFixed(1);
    var rows = [
      ['Sales Psychology Self-Assessment'],
      ['Name', data.name || 'N/A'],
      [''],
      ['Dimension', 'Score', 'Max'],
    ];
    dims.forEach(function(d, i) { rows.push([d, parseInt(data[keys[i]]) || 0, 10]); });
    rows.push([''], ['Total', total, 60], ['Average', avg, 10], ['']);
    rows.push(['Top Strengths', data.strengths || '', '']);
    rows.push(['Development Areas', data.development || '', '']);
    rows.push(['90-Day Goals', data.goals || '', '']);
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 40 }, { wch: 10 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mindset Assessment');
    XLSX.writeFile(wb, filename + '.xlsx');
  },
  generateMindsetAssessmentPDF: function(filename, data) {
    var dims = ['Confidence', 'Resilience', 'Curiosity', 'Empathy', 'Discipline', 'Growth Orientation'];
    var keys = ['confidence', 'resilience', 'curiosity', 'empathy', 'discipline', 'growth'];
    var total = keys.reduce(function(sum, k) { return sum + (parseInt(data[k]) || 0); }, 0);
    var avg = (total / 6).toFixed(1);
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(18);
    pdf.text('Sales Psychology Self-Assessment', 20, 25);
    pdf.setFontSize(12);
    pdf.text('Name: ' + (data.name || 'N/A'), 20, 35);
    var y = 50;
    pdf.setFontSize(14);
    pdf.text('Mindset Dimensions', 20, y);
    pdf.setFontSize(11);
    y += 10;
    dims.forEach(function(d, i) {
      pdf.text(d + ': ' + (data[keys[i]] || 'N/A') + '/10', 25, y);
      y += 7;
    });
    y += 5;
    pdf.setFontSize(14);
    pdf.text('Overall Score: ' + total + '/60 (Avg: ' + avg + '/10)', 20, y);
    y += 15;
    if (data.strengths) {
      pdf.text('Top Strengths', 20, y);
      pdf.setFontSize(10);
      var lines = pdf.splitTextToSize(data.strengths, 170);
      pdf.text(lines, 20, y + 8);
      y += 8 + lines.length * 5 + 5;
    }
    if (data.development) {
      pdf.setFontSize(14);
      pdf.text('Development Areas', 20, y);
      pdf.setFontSize(10);
      var lines2 = pdf.splitTextToSize(data.development, 170);
      pdf.text(lines2, 20, y + 8);
      y += 8 + lines2.length * 5 + 5;
    }
    if (data.goals) {
      pdf.setFontSize(14);
      pdf.text('90-Day Goals', 20, y);
      pdf.setFontSize(10);
      var lines3 = pdf.splitTextToSize(data.goals, 170);
      pdf.text(lines3, 20, y + 8);
    }
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // ICP Builder Canvas — Sales Prospecting Tool
  // ============================================================
  generateICPBuilderWord: async function(filename, data) {
    var sections = [
      {
        heading: 'Ideal Customer Profile (ICP)',
        content: [
          'Company: ' + (data.companyName || 'N/A'),
          'Product/Service: ' + (data.productName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
        ]
      },
      {
        heading: 'Firmographic Criteria',
        content: [
          'Target Industry: ' + (data.industry || 'Not specified'),
          'Company Size: ' + (data.companySize || 'Not specified'),
          'Geography: ' + (data.geography || 'Not specified'),
          'Technology Stack: ' + (data.technology || 'Not specified')
        ]
      },
      {
        heading: 'Buyer Persona',
        content: [
          'Primary Buyer Title(s): ' + (data.buyerTitle || 'Not specified'),
          'Decision Level: ' + (data.buyerLevel || 'Not specified')
        ]
      },
      {
        heading: 'Pain Points',
        content: data.painPoints || 'Not specified'
      },
      {
        heading: 'Trigger Events (Buying Signals)',
        content: data.triggerEvents || 'Not specified'
      },
      {
        heading: 'Disqualifying Criteria',
        content: data.disqualifiers || 'Not specified'
      }
    ];
    
    return this.generateWord(filename, {
      title: 'Ideal Customer Profile (ICP)',
      author: data.authorName || '',
      sections: sections
    });
  },
  generateICPBuilderExcel: function(filename, data) {
    var rows = [
      ['Ideal Customer Profile (ICP)'],
      ['Company', data.companyName || 'N/A'],
      ['Product/Service', data.productName || 'N/A'],
      ['Date', new Date().toLocaleDateString()],
      [''],
      ['FIRMOGRAPHIC CRITERIA'],
      ['Target Industry', data.industry || ''],
      ['Company Size', data.companySize || ''],
      ['Geography', data.geography || ''],
      ['Technology Stack', data.technology || ''],
      [''],
      ['BUYER PERSONA'],
      ['Primary Buyer Title(s)', data.buyerTitle || ''],
      ['Decision Level', data.buyerLevel || ''],
      [''],
      ['PAIN POINTS'],
      [data.painPoints || ''],
      [''],
      ['TRIGGER EVENTS'],
      [data.triggerEvents || ''],
      [''],
      ['DISQUALIFYING CRITERIA'],
      [data.disqualifiers || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 50 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ICP');
    XLSX.writeFile(wb, filename + '.xlsx');
  },
  generateICPBuilderPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(18);
    pdf.text('Ideal Customer Profile (ICP)', 20, 25);
    pdf.setFontSize(12);
    pdf.text('Company: ' + (data.companyName || 'N/A'), 20, 35);
    pdf.text('Product/Service: ' + (data.productName || 'N/A'), 20, 42);
    pdf.text('Date: ' + new Date().toLocaleDateString(), 20, 49);
    
    var y = 62;
    pdf.setFontSize(14);
    pdf.text('Firmographic Criteria', 20, y);
    pdf.setFontSize(11);
    y += 10;
    pdf.text('Industry: ' + (data.industry || 'N/A'), 25, y);
    pdf.text('Company Size: ' + (data.companySize || 'N/A'), 25, y + 7);
    pdf.text('Geography: ' + (data.geography || 'N/A'), 25, y + 14);
    pdf.text('Technology: ' + (data.technology || 'N/A'), 25, y + 21);
    
    y += 35;
    pdf.setFontSize(14);
    pdf.text('Buyer Persona', 20, y);
    pdf.setFontSize(11);
    y += 10;
    pdf.text('Title(s): ' + (data.buyerTitle || 'N/A'), 25, y);
    pdf.text('Decision Level: ' + (data.buyerLevel || 'N/A'), 25, y + 7);
    
    y += 22;
    if (data.painPoints) {
      pdf.setFontSize(14);
      pdf.text('Pain Points', 20, y);
      pdf.setFontSize(10);
      var lines = pdf.splitTextToSize(data.painPoints, 170);
      pdf.text(lines, 20, y + 8);
      y += 8 + lines.length * 5 + 8;
    }
    if (data.triggerEvents) {
      pdf.setFontSize(14);
      pdf.text('Trigger Events', 20, y);
      pdf.setFontSize(10);
      var lines2 = pdf.splitTextToSize(data.triggerEvents, 170);
      pdf.text(lines2, 20, y + 8);
      y += 8 + lines2.length * 5 + 8;
    }
    if (data.disqualifiers) {
      pdf.setFontSize(14);
      pdf.text('Disqualifying Criteria', 20, y);
      pdf.setFontSize(10);
      var lines3 = pdf.splitTextToSize(data.disqualifiers, 170);
      pdf.text(lines3, 20, y + 8);
    }
    pdf.save(filename + '.pdf');
  },

  // ============================================================
  // MEDDIC Scorecard — Sales Qualification Tool
  // ============================================================
  generateMeddicScorecardWord: async function(filename, data) {
    var totalScore = (parseInt(data.metrics) || 0) + 
                     (parseInt(data.economicBuyer) || 0) + 
                     (parseInt(data.decisionCriteria) || 0) + 
                     (parseInt(data.decisionProcess) || 0) + 
                     (parseInt(data.pain) || 0) + 
                     (parseInt(data.champion) || 0);
    var healthStatus = totalScore >= 25 ? 'High Probability' : 
                       (totalScore >= 18 ? 'Good with Gaps' : 
                       (totalScore >= 12 ? 'At Risk' : 'Unqualified'));
    var sections = [
      {
        heading: 'MEDDIC Deal Scorecard',
        content: [
          'Company: ' + (data.company || 'N/A'),
          'Opportunity: ' + (data.opportunity || 'N/A'),
          'Deal Value: ' + (data.dealValue || 'N/A'),
          'Expected Close: ' + (data.closeDate || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
        ]
      },
      {
        heading: 'MEDDIC Scores',
        content: [
          'Metrics: ' + (data.metrics || 0) + '/5',
          'Economic Buyer: ' + (data.economicBuyer || 0) + '/5',
          'Decision Criteria: ' + (data.decisionCriteria || 0) + '/5',
          'Decision Process: ' + (data.decisionProcess || 0) + '/5',
          'Identify Pain: ' + (data.pain || 0) + '/5',
          'Champion: ' + (data.champion || 0) + '/5',
          '',
          'TOTAL SCORE: ' + totalScore + '/30',
          'Deal Health: ' + healthStatus
        ]
      },
      {
        heading: 'Notes & Next Steps',
        content: data.notes || 'No notes provided.'
      }
    ];
    
    return this.generateWord(filename, {
      title: 'MEDDIC Deal Scorecard',
      author: data.authorName || '',
      sections: sections
    });
  },
  generateMeddicScorecardExcel: function(filename, data) {
    var totalScore = (parseInt(data.metrics) || 0) + 
                     (parseInt(data.economicBuyer) || 0) + 
                     (parseInt(data.decisionCriteria) || 0) + 
                     (parseInt(data.decisionProcess) || 0) + 
                     (parseInt(data.pain) || 0) + 
                     (parseInt(data.champion) || 0);
    var healthStatus = totalScore >= 25 ? 'High Probability' : 
                       (totalScore >= 18 ? 'Good with Gaps' : 
                       (totalScore >= 12 ? 'At Risk' : 'Unqualified'));
    var rows = [
      ['MEDDIC Deal Scorecard'],
      ['Company', data.company || 'N/A'],
      ['Opportunity', data.opportunity || 'N/A'],
      ['Deal Value', data.dealValue || ''],
      ['Expected Close', data.closeDate || ''],
      ['Date', new Date().toLocaleDateString()],
      [''],
      ['MEDDIC SCORES', 'Score (1-5)'],
      ['Metrics', data.metrics || 0],
      ['Economic Buyer', data.economicBuyer || 0],
      ['Decision Criteria', data.decisionCriteria || 0],
      ['Decision Process', data.decisionProcess || 0],
      ['Identify Pain', data.pain || 0],
      ['Champion', data.champion || 0],
      [''],
      ['TOTAL SCORE', totalScore + '/30'],
      ['Deal Health', healthStatus],
      [''],
      ['Notes & Next Steps'],
      [data.notes || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 40 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MEDDIC Scorecard');
    XLSX.writeFile(wb, filename + '.xlsx');
  },
  generateMeddicScorecardPDF: function(filename, data) {
    var totalScore = (parseInt(data.metrics) || 0) + 
                     (parseInt(data.economicBuyer) || 0) + 
                     (parseInt(data.decisionCriteria) || 0) + 
                     (parseInt(data.decisionProcess) || 0) + 
                     (parseInt(data.pain) || 0) + 
                     (parseInt(data.champion) || 0);
    var healthStatus = totalScore >= 25 ? 'High Probability' : 
                       (totalScore >= 18 ? 'Good with Gaps' : 
                       (totalScore >= 12 ? 'At Risk' : 'Unqualified'));
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(18);
    pdf.text('MEDDIC Deal Scorecard', 20, 25);
    pdf.setFontSize(12);
    pdf.text('Company: ' + (data.company || 'N/A'), 20, 38);
    pdf.text('Opportunity: ' + (data.opportunity || 'N/A'), 20, 46);
    pdf.text('Deal Value: ' + (data.dealValue || 'N/A'), 20, 54);
    pdf.text('Expected Close: ' + (data.closeDate || 'N/A'), 20, 62);
    pdf.text('Date: ' + new Date().toLocaleDateString(), 20, 70);
    
    var y = 88;
    pdf.setFontSize(14);
    pdf.text('MEDDIC Scores', 20, y);
    pdf.setFontSize(11);
    y += 12;
    pdf.text('Metrics: ' + (data.metrics || 0) + '/5', 25, y);
    pdf.text('Economic Buyer: ' + (data.economicBuyer || 0) + '/5', 25, y + 8);
    pdf.text('Decision Criteria: ' + (data.decisionCriteria || 0) + '/5', 25, y + 16);
    pdf.text('Decision Process: ' + (data.decisionProcess || 0) + '/5', 25, y + 24);
    pdf.text('Identify Pain: ' + (data.pain || 0) + '/5', 25, y + 32);
    pdf.text('Champion: ' + (data.champion || 0) + '/5', 25, y + 40);
    
    y += 56;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('TOTAL SCORE: ' + totalScore + '/30', 20, y);
    pdf.text('Deal Health: ' + healthStatus, 20, y + 10);
    pdf.setFont(undefined, 'normal');
    
    y += 28;
    if (data.notes) {
      pdf.setFontSize(14);
      pdf.text('Notes & Next Steps', 20, y);
      pdf.setFontSize(10);
      var lines = pdf.splitTextToSize(data.notes, 170);
      pdf.text(lines, 20, y + 10);
    }
    pdf.save(filename + '.pdf');
  },


  // ============================================================
  // Discovery Call Planner — Word, Excel, PDF, PPTX
  // ============================================================

  generateDiscoveryCallPlannerWord: async function(filename, data) {
    const docx = window.docx;
    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: [
          new docx.Paragraph({
            text: 'Discovery Call Planner',
            heading: docx.HeadingLevel.HEADING_1,
          }),
          new docx.Paragraph({
            text: 'Prepared for: ' + (data.companyName || 'Unknown Company'),
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            text: 'Contact: ' + (data.contactName || ''),
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            text: 'Industry: ' + (data.industry || '') + ' | Size: ' + (data.companySize || ''),
            spacing: { after: 400 }
          }),
          new docx.Paragraph({
            text: 'Call Objective',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: data.callObjective || '',
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            text: 'Known Pain Points (Pre-Call Research)',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: data.knownPains || '',
            spacing: { after: 400 }
          }),
          new docx.Paragraph({
            text: 'SPIN Questions',
            heading: docx.HeadingLevel.HEADING_1,
          }),
          new docx.Paragraph({
            text: 'Situation Questions',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: data.situationQs || '',
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            text: 'Problem Questions',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: data.problemQs || '',
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            text: 'Implication Questions',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: data.implicationQs || '',
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            text: 'Need-Payoff Questions',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: data.needPayoffQs || '',
            spacing: { after: 400 }
          }),
          new docx.Paragraph({
            text: 'Stakeholder Mapping',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: data.stakeholders || '',
            spacing: { after: 400 }
          }),
          new docx.Paragraph({
            text: 'Planned Next Steps',
            heading: docx.HeadingLevel.HEADING_2,
          }),
          new docx.Paragraph({
            text: data.nextSteps || '',
            spacing: { after: 200 }
          }),
        ]
      }]
    });
    const blob = await docx.Packer.toBlob(doc);
    this._downloadFile(blob, filename + '.docx');
  },

  generateDiscoveryCallPlannerExcel: function(filename, data) {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Discovery Call Planner'],
      [''],
      ['Account Information'],
      ['Company Name', data.companyName || ''],
      ['Primary Contact', data.contactName || ''],
      ['Industry', data.industry || ''],
      ['Company Size', data.companySize || ''],
      [''],
      ['Call Objective'],
      ['Objective', data.callObjective || ''],
      ['Known Pain Points', data.knownPains || ''],
      [''],
      ['SPIN Questions'],
      ['Situation Questions', data.situationQs || ''],
      ['Problem Questions', data.problemQs || ''],
      ['Implication Questions', data.implicationQs || ''],
      ['Need-Payoff Questions', data.needPayoffQs || ''],
      [''],
      ['Stakeholder Mapping'],
      ['Key Stakeholders', data.stakeholders || ''],
      [''],
      ['Next Steps'],
      ['Planned Actions', data.nextSteps || '']
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Call Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDiscoveryCallPlannerPDF: function(filename, data) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let y = 20;
    pdf.setFontSize(18);
    pdf.text('Discovery Call Planner', 20, y);
    y += 12;
    pdf.setFontSize(12);
    pdf.text('Company: ' + (data.companyName || ''), 20, y);
    y += 8;
    pdf.text('Contact: ' + (data.contactName || ''), 20, y);
    y += 8;
    pdf.text('Industry: ' + (data.industry || '') + ' | Size: ' + (data.companySize || ''), 20, y);
    y += 14;
    
    pdf.setFontSize(14);
    pdf.text('Call Objective', 20, y);
    pdf.setFontSize(10);
    y += 8;
    var objLines = pdf.splitTextToSize(data.callObjective || '', 170);
    pdf.text(objLines, 20, y);
    y += objLines.length * 5 + 8;
    
    if (data.knownPains) {
      pdf.setFontSize(12);
      pdf.text('Known Pain Points:', 20, y);
      y += 6;
      pdf.setFontSize(10);
      var painLines = pdf.splitTextToSize(data.knownPains, 170);
      pdf.text(painLines, 20, y);
      y += painLines.length * 5 + 8;
    }
    
    pdf.setFontSize(14);
    pdf.text('SPIN Questions', 20, y);
    y += 10;
    
    var sections = [
      { title: 'Situation:', content: data.situationQs },
      { title: 'Problem:', content: data.problemQs },
      { title: 'Implication:', content: data.implicationQs },
      { title: 'Need-Payoff:', content: data.needPayoffQs }
    ];
    
    sections.forEach(function(s) {
      if (y > 260) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.text(s.title, 20, y);
      pdf.setFont(undefined, 'normal');
      y += 6;
      pdf.setFontSize(10);
      var lines = pdf.splitTextToSize(s.content || '', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 5 + 6;
    });
    
    if (data.stakeholders) {
      if (y > 240) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFontSize(12);
      pdf.text('Stakeholder Mapping:', 20, y);
      y += 6;
      pdf.setFontSize(10);
      var stakeLines = pdf.splitTextToSize(data.stakeholders, 170);
      pdf.text(stakeLines, 20, y);
      y += stakeLines.length * 5 + 8;
    }
    
    if (data.nextSteps) {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFontSize(12);
      pdf.text('Planned Next Steps:', 20, y);
      y += 6;
      pdf.setFontSize(10);
      var nextLines = pdf.splitTextToSize(data.nextSteps, 170);
      pdf.text(nextLines, 20, y);
    }
    
    pdf.save(filename + '.pdf');
  },

  generateDiscoveryCallPlannerPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'Discovery Call Planner - ' + (data.companyName || '');
    
    var palette = DocStyles.colors;
    
    // Title slide
    var slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 5.63, fill: { color: palette.navy } });
    slide1.addText('Discovery Call Planner', { x: 0.5, y: 1.8, w: 9, h: 1, fontSize: 36, bold: true, color: palette.white });
    slide1.addText(data.companyName || '', { x: 0.5, y: 2.8, w: 9, h: 0.6, fontSize: 24, color: palette.teal });
    slide1.addText('Contact: ' + (data.contactName || ''), { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 14, color: palette.light });
    slide1.addText((data.industry || '') + ' | ' + (data.companySize || ''), { x: 0.5, y: 3.9, w: 9, h: 0.4, fontSize: 14, color: palette.light });
    
    // Call Objective slide
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 5.63, fill: { color: palette.teal } });
    slide2.addText('Call Objective', { x: 0.4, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: palette.navy });
    slide2.addText(data.callObjective || '', { x: 0.4, y: 1.0, w: 9.2, h: 1.5, fontSize: 18, color: palette.blue, wrap: true, valign: 'top' });
    if (data.knownPains) {
      slide2.addText('Known Pain Points:', { x: 0.4, y: 2.8, w: 9, h: 0.4, fontSize: 16, bold: true, color: palette.crimson });
      slide2.addText(data.knownPains, { x: 0.4, y: 3.3, w: 9.2, h: 2, fontSize: 14, color: DocStyles.colors.darkGray, wrap: true, valign: 'top' });
    }
    
    // SPIN Questions - 2 per slide
    var spinSections = [
      { title: 'Situation Questions', content: data.situationQs, color: palette.blue },
      { title: 'Problem Questions', content: data.problemQs, color: palette.crimson },
      { title: 'Implication Questions', content: data.implicationQs, color: palette.teal },
      { title: 'Need-Payoff Questions', content: data.needPayoffQs, color: palette.navy }
    ];
    
    // Slide 3: Situation + Problem
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 5.63, fill: { color: palette.teal } });
    slide3.addText('SPIN Questions', { x: 0.4, y: 0.2, w: 9, h: 0.5, fontSize: 24, bold: true, color: palette.navy });
    slide3.addText('Situation Questions', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: spinSections[0].color });
    slide3.addText(spinSections[0].content || '', { x: 0.4, y: 1.3, w: 4.3, h: 2, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Problem Questions', { x: 5.1, y: 0.8, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: spinSections[1].color });
    slide3.addText(spinSections[1].content || '', { x: 5.1, y: 1.3, w: 4.3, h: 2, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    // Slide 4: Implication + Need-Payoff
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 5.63, fill: { color: palette.teal } });
    slide4.addText('SPIN Questions (continued)', { x: 0.4, y: 0.2, w: 9, h: 0.5, fontSize: 24, bold: true, color: palette.navy });
    slide4.addText('Implication Questions', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: spinSections[2].color });
    slide4.addText(spinSections[2].content || '', { x: 0.4, y: 1.3, w: 4.3, h: 2, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide4.addText('Need-Payoff Questions', { x: 5.1, y: 0.8, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: spinSections[3].color });
    slide4.addText(spinSections[3].content || '', { x: 5.1, y: 1.3, w: 4.3, h: 2, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    // Stakeholders + Next Steps slide
    var slide5 = pptx.addSlide();
    slide5.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 5.63, fill: { color: palette.teal } });
    slide5.addText('Stakeholders & Next Steps', { x: 0.4, y: 0.3, w: 9, h: 0.5, fontSize: 24, bold: true, color: palette.navy });
    slide5.addText('Key Stakeholders', { x: 0.4, y: 1.0, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: palette.blue });
    slide5.addText(data.stakeholders || '', { x: 0.4, y: 1.5, w: 4.3, h: 2.5, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });
    slide5.addText('Planned Next Steps', { x: 5.1, y: 1.0, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: palette.crimson });
    slide5.addText(data.nextSteps || '', { x: 5.1, y: 1.5, w: 4.3, h: 2.5, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });
    
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // Sales Presentation Planner Canvas Generators
  // ============================================================

  generateSalesPresentationPlannerWord: async function(filename, data) {
    var docx = window.docx;
    var Document = docx.Document, Packer = docx.Packer, Paragraph = docx.Paragraph, HeadingLevel = docx.HeadingLevel, Table = docx.Table, TableRow = docx.TableRow, TableCell = docx.TableCell, WidthType = docx.WidthType, BorderStyle = docx.BorderStyle;
    function text(str) { return new docx.TextRun(str); }
    function bold(str) { return new docx.TextRun({ text: str, bold: true }); }
    function para(content, options) { return new Paragraph(Object.assign({ children: Array.isArray(content) ? content : [text(content)] }, options || {})); }

    var doc = new Document({
      sections: [{
        properties: {},
        children: [
          para([bold('Sales Presentation Planner Canvas')], { heading: HeadingLevel.HEADING_1 }),
          para((data.authorName || '')),
          para(''),
          para([bold('Company/Prospect: '), text(data.companyName || '')]),
          para([bold('Presenter: '), text(data.presenterName || '')]),
          para([bold('Presentation Type: '), text(data.presentationType || '')]),
          para([bold('Primary Audience: '), text(data.primaryAudience || '')]),
          para([bold('Audience Size: '), text(data.audienceSize || '')]),
          para([bold('Duration: '), text(data.duration || '')]),
          para(''),
          para([bold('Opening Hook / Attention Grabber')], { heading: HeadingLevel.HEADING_2 }),
          para(data.hook || ''),
          para(''),
          para([bold('Problem Statement (Their Pain)')], { heading: HeadingLevel.HEADING_2 }),
          para(data.problemStatement || ''),
          para(''),
          para([bold('Core Value Proposition')], { heading: HeadingLevel.HEADING_2 }),
          para(data.valueProp || ''),
          para(''),
          para([bold('Key Messages (3-5 Points)')], { heading: HeadingLevel.HEADING_2 }),
          para(data.keyMessages || ''),
          para(''),
          para([bold('Proof Points / Evidence')], { heading: HeadingLevel.HEADING_2 }),
          para(data.proofPoints || ''),
          para(''),
          para([bold('Anticipated Objections')], { heading: HeadingLevel.HEADING_2 }),
          para(data.objections || ''),
          para(''),
          para([bold('Call to Action')], { heading: HeadingLevel.HEADING_2 }),
          para(data.callToAction || ''),
          para(''),
          para([bold('Success Metrics for This Meeting')], { heading: HeadingLevel.HEADING_2 }),
          para(data.successMetrics || ''),
          para(''),
          para([bold('Follow-Up Plan')], { heading: HeadingLevel.HEADING_2 }),
          para(data.followUp || '')
        ]
      }]
    });

    var blob = await Packer.toBlob(doc);
    this._downloadFile(blob, filename + '.docx');
  },

  generateSalesPresentationPlannerExcel: function(filename, data) {
    var ws_data = [
      ['Sales Presentation Planner Canvas'],
      [(data.authorName || '')],
      [],
      ['Field', 'Value'],
      ['Company/Prospect', data.companyName || ''],
      ['Presenter', data.presenterName || ''],
      ['Presentation Type', data.presentationType || ''],
      ['Primary Audience', data.primaryAudience || ''],
      ['Audience Size', data.audienceSize || ''],
      ['Duration', data.duration || ''],
      [],
      ['Opening Hook', data.hook || ''],
      ['Problem Statement', data.problemStatement || ''],
      ['Value Proposition', data.valueProp || ''],
      ['Key Messages', data.keyMessages || ''],
      ['Proof Points', data.proofPoints || ''],
      ['Anticipated Objections', data.objections || ''],
      ['Call to Action', data.callToAction || ''],
      ['Success Metrics', data.successMetrics || ''],
      ['Follow-Up Plan', data.followUp || '']
    ];

    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Presentation Plan');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSalesPresentationPlannerPDF: function(filename, data) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var y = 20;
    var margin = 15;
    var lineHeight = 7;
    var pageHeight = doc.internal.pageSize.height;

    function checkPage() {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
    }

    function addSection(title, content) {
      checkPage();
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin, y);
      y += lineHeight;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      if (content) {
        var lines = doc.splitTextToSize(content, 180);
        lines.forEach(function(line) {
          checkPage();
          doc.text(line, margin, y);
          y += lineHeight - 1;
        });
      }
      y += 4;
    }

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Sales Presentation Planner Canvas', margin, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text((data.authorName || ''), margin, y);
    y += 12;

    // Overview
    doc.setFontSize(11);
    doc.text('Company: ' + (data.companyName || ''), margin, y); y += lineHeight;
    doc.text('Presenter: ' + (data.presenterName || ''), margin, y); y += lineHeight;
    doc.text('Type: ' + (data.presentationType || ''), margin, y); y += lineHeight;
    doc.text('Audience: ' + (data.primaryAudience || ''), margin, y); y += lineHeight;
    doc.text('Size: ' + (data.audienceSize || '') + '  |  Duration: ' + (data.duration || ''), margin, y);
    y += 12;

    // Sections
    addSection('Opening Hook', data.hook);
    addSection('Problem Statement', data.problemStatement);
    addSection('Value Proposition', data.valueProp);
    addSection('Key Messages', data.keyMessages);
    addSection('Proof Points', data.proofPoints);
    addSection('Anticipated Objections', data.objections);
    addSection('Call to Action', data.callToAction);
    addSection('Success Metrics', data.successMetrics);
    addSection('Follow-Up Plan', data.followUp);

    doc.save(filename + '.pdf');
  },

  generateSalesPresentationPlannerPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'Sales Presentation Planner - ' + (data.companyName || 'Presentation');
    pptx.author = data.presenterName || 'Sales Professional';

    var palette = DocStyles.colors;

    // Slide 1: Title
    var slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: palette.navy } });
    slide1.addText('Sales Presentation Planner', { x: 0.5, y: 1.8, w: 9, h: 0.8, fontSize: 36, bold: true, color: palette.white });
    slide1.addText(data.companyName || '', { x: 0.5, y: 2.7, w: 9, h: 0.5, fontSize: 24, color: palette.teal });
    slide1.addText('Presented by: ' + (data.presenterName || ''), { x: 0.5, y: 3.4, w: 9, h: 0.4, fontSize: 16, color: palette.white });
    slide1.addText((data.presentationType || '') + ' | ' + (data.duration || ''), { x: 0.5, y: 3.9, w: 9, h: 0.4, fontSize: 14, color: palette.gray });

    // Slide 2: Problem & Hook
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide2.addText('Opening & Problem', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    slide2.addText('Attention Grabber', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: palette.crimson });
    slide2.addText(data.hook || '', { x: 0.4, y: 1.4, w: 4.3, h: 1.8, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Problem Statement', { x: 5.1, y: 0.9, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: palette.crimson });
    slide2.addText(data.problemStatement || '', { x: 5.1, y: 1.4, w: 4.3, h: 1.8, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Primary Audience: ' + (data.primaryAudience || ''), { x: 0.4, y: 3.5, w: 9, h: 0.3, fontSize: 11, color: palette.gray });

    // Slide 3: Value & Messages
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide3.addText('Value Proposition & Key Messages', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    slide3.addText('Core Value Proposition', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: palette.blue });
    slide3.addText(data.valueProp || '', { x: 0.4, y: 1.4, w: 4.3, h: 2.0, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Key Messages', { x: 5.1, y: 0.9, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: palette.blue });
    slide3.addText(data.keyMessages || '', { x: 5.1, y: 1.4, w: 4.3, h: 2.0, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 4: Evidence & Objections
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide4.addText('Proof & Objection Handling', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    slide4.addText('Proof Points / Evidence', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: palette.navy });
    slide4.addText(data.proofPoints || '', { x: 0.4, y: 1.4, w: 4.3, h: 2.0, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });
    slide4.addText('Anticipated Objections', { x: 5.1, y: 0.9, w: 4.3, h: 0.4, fontSize: 16, bold: true, color: palette.navy });
    slide4.addText(data.objections || '', { x: 5.1, y: 1.4, w: 4.3, h: 2.0, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 5: CTA & Next Steps
    var slide5 = pptx.addSlide();
    slide5.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.crimson } });
    slide5.addText('Call to Action & Follow-Up', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    slide5.addText('Call to Action', { x: 0.4, y: 0.9, w: 9, h: 0.4, fontSize: 16, bold: true, color: palette.crimson });
    slide5.addText(data.callToAction || '', { x: 0.4, y: 1.4, w: 9, h: 1.0, fontSize: 14, wrap: true, valign: 'top', fit: 'shrink' });
    slide5.addText('Success Metrics', { x: 0.4, y: 2.6, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: palette.blue });
    slide5.addText(data.successMetrics || '', { x: 0.4, y: 3.0, w: 4.3, h: 1.0, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });
    slide5.addText('Follow-Up Plan', { x: 5.1, y: 2.6, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: palette.blue });
    slide5.addText(data.followUp || '', { x: 5.1, y: 3.0, w: 4.3, h: 1.0, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // Objection Handling Playbook
  // ============================================================

  generateObjectionPlaybookWord: function(filename, data) {
    var docx = window.docx;
    var doc = new docx.Document({
      sections: [{
        properties: {},
        children: [
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Objection Handling Playbook', bold: true, size: 48, color: DocStyles.colors.navy })],
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.companyName || 'Company', bold: true, size: 28, color: DocStyles.colors.teal })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Created by: ' + (data.createdBy || ''), size: 22 })],
            spacing: { after: 400 }
          }),

          // Price Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Price Objections', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Common Objection:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.priceObjection || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: DocStyles.colors.teal })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.priceResponse || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Timing Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Timing Objections', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Common Objection:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.timingObjection || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: DocStyles.colors.teal })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.timingResponse || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Authority Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Authority Objections', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Common Objection:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.authorityObjection || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: DocStyles.colors.teal })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.authorityResponse || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Competitor Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Competitor Objections', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Common Objection:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.competitorObjection || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: DocStyles.colors.teal })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.competitorResponse || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Status Quo Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Status Quo Objections', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Common Objection:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.statusQuoObjection || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: DocStyles.colors.teal })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.statusQuoResponse || '', size: 22 })],
            spacing: { after: 400 }
          })
        ]
      }]
    });

    docx.Packer.toBlob(doc).then(function(blob) {
      DocGenerator._downloadFile(blob, filename + '.docx');
    });
  },

  generateObjectionPlaybookExcel: function(filename, data) {
    var headers = ['Category', 'Common Objection', 'Response Strategy'];
    var rows = [
      ['Price', data.priceObjection || '', data.priceResponse || ''],
      ['Timing', data.timingObjection || '', data.timingResponse || ''],
      ['Authority', data.authorityObjection || '', data.authorityResponse || ''],
      ['Competitor', data.competitorObjection || '', data.competitorResponse || ''],
      ['Status Quo', data.statusQuoObjection || '', data.statusQuoResponse || '']
    ];

    var wsData = [
      ['Objection Handling Playbook'],
      [data.companyName || 'Company'],
      ['Created by: ' + (data.createdBy || '')],
      [],
      headers
    ].concat(rows);

    var ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 15 },
      { wch: 40 },
      { wch: 50 }
    ];
    
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Objection Playbook');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateObjectionPlaybookPDF: function(filename, data) {
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF('p', 'mm', 'a4');
    var pageWidth = pdf.internal.pageSize.getWidth();
    var margin = 20;
    var y = 25;

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Objection Handling Playbook', margin, y);
    y += 12;

    // Company
    pdf.setFontSize(16);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text(data.companyName || 'Company', margin, y);
    y += 8;

    // Created by
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Created by: ' + (data.createdBy || ''), margin, y);
    y += 15;

    var categories = [
      { title: 'Price Objections', objection: data.priceObjection, response: data.priceResponse },
      { title: 'Timing Objections', objection: data.timingObjection, response: data.timingResponse },
      { title: 'Authority Objections', objection: data.authorityObjection, response: data.authorityResponse },
      { title: 'Competitor Objections', objection: data.competitorObjection, response: data.competitorResponse },
      { title: 'Status Quo Objections', objection: data.statusQuoObjection, response: data.statusQuoResponse }
    ];

    categories.forEach(function(cat) {
      // Check for page break
      if (y > 250) {
        pdf.addPage();
        y = 25;
      }

      // Category title
      pdf.setFontSize(14);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(cat.title, margin, y);
      y += 8;

      // Objection
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.navy);
      pdf.text('Objection:', margin, y);
      y += 5;
      pdf.setTextColor(...DocStyles.rgb.gray);
      var objLines = pdf.splitTextToSize(cat.objection || 'Not specified', pageWidth - 2 * margin);
      pdf.text(objLines, margin, y);
      y += objLines.length * 5 + 5;

      // Response
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.teal);
      pdf.text('Response Strategy:', margin, y);
      y += 5;
      pdf.setTextColor(...DocStyles.rgb.gray);
      var respLines = pdf.splitTextToSize(cat.response || 'Not specified', pageWidth - 2 * margin);
      pdf.text(respLines, margin, y);
      y += respLines.length * 5 + 12;
    });

    pdf.save(filename + '.pdf');
  },

  generateObjectionPlaybookPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'Objection Handling Playbook';
    pptx.author = data.createdBy || '';

    var palette = DocStyles.colors;

    // Slide 1: Title
    var slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: palette.navy } });
    slide1.addText('Objection Handling Playbook', { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 36, bold: true, color: palette.white });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 24, color: palette.teal });
    slide1.addText('Created by: ' + (data.createdBy || ''), { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 14, color: palette.white });

    // Slide 2: Price & Timing
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide2.addText('Price & Timing Objections', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide2.addText('Price Objection', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.priceObjection || '', { x: 0.4, y: 1.3, w: 4.3, h: 0.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Response:', { x: 0.4, y: 2.2, w: 4.3, h: 0.25, fontSize: 11, bold: true, color: palette.teal });
    slide2.addText(data.priceResponse || '', { x: 0.4, y: 2.5, w: 4.3, h: 0.9, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    slide2.addText('Timing Objection', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.timingObjection || '', { x: 5.1, y: 1.3, w: 4.3, h: 0.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Response:', { x: 5.1, y: 2.2, w: 4.3, h: 0.25, fontSize: 11, bold: true, color: palette.teal });
    slide2.addText(data.timingResponse || '', { x: 5.1, y: 2.5, w: 4.3, h: 0.9, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 3: Authority & Competitor
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide3.addText('Authority & Competitor Objections', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide3.addText('Authority Objection', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.authorityObjection || '', { x: 0.4, y: 1.3, w: 4.3, h: 0.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Response:', { x: 0.4, y: 2.2, w: 4.3, h: 0.25, fontSize: 11, bold: true, color: palette.teal });
    slide3.addText(data.authorityResponse || '', { x: 0.4, y: 2.5, w: 4.3, h: 0.9, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    slide3.addText('Competitor Objection', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.competitorObjection || '', { x: 5.1, y: 1.3, w: 4.3, h: 0.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Response:', { x: 5.1, y: 2.2, w: 4.3, h: 0.25, fontSize: 11, bold: true, color: palette.teal });
    slide3.addText(data.competitorResponse || '', { x: 5.1, y: 2.5, w: 4.3, h: 0.9, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 4: Status Quo
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide4.addText('Status Quo Objections', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide4.addText('Common Objection', { x: 0.4, y: 0.9, w: 9, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.statusQuoObjection || '', { x: 0.4, y: 1.3, w: 9, h: 1.0, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide4.addText('Response Strategy', { x: 0.4, y: 2.5, w: 9, h: 0.3, fontSize: 14, bold: true, color: palette.teal });
    slide4.addText(data.statusQuoResponse || '', { x: 0.4, y: 2.9, w: 9, h: 1.2, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // Negotiation & Closing Strategy Canvas
  // ============================================================

  generateNegotiationClosingWord: function(filename, data) {
    var docx = window.docx;
    var doc = new docx.Document({
      sections: [{
        properties: {},
        children: [
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Negotiation & Closing Strategy', bold: true, size: 48, color: DocStyles.colors.navy })],
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.companyName || 'Deal', bold: true, size: 28, color: DocStyles.colors.teal })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Deal Value: ' + (data.dealValue || 'TBD'), size: 22 })],
            spacing: { after: 400 }
          }),

          // BATNA Section
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'BATNA Analysis', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Your BATNA:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.yourBATNA || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Their BATNA:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.theirBATNA || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Negotiation Strategy
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Negotiation Strategy', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Anchoring Strategy:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.anchorStrategy || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Planned Concessions:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.concessions || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Closing Strategy
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Closing Strategy', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Closing Approach:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.closingApproach || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Urgency Driver:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.urgencyDriver || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Stakeholders & Blockers
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Stakeholders & Risks', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { before: 300, after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Key Stakeholders:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.keyStakeholders || '', size: 22 })],
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Potential Blockers:', bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.potentialBlockers || '', size: 22 })],
            spacing: { after: 400 }
          })
        ]
      }]
    });

    docx.Packer.toBlob(doc).then(function(blob) {
      DocGenerator._downloadFile(blob, filename + '.docx');
    });
  },

  generateNegotiationClosingExcel: function(filename, data) {
    var wsData = [
      ['Negotiation & Closing Strategy'],
      [data.companyName || 'Deal'],
      ['Deal Value: ' + (data.dealValue || 'TBD')],
      [],
      ['Section', 'Details'],
      ['Your BATNA', data.yourBATNA || ''],
      ['Their BATNA', data.theirBATNA || ''],
      ['Anchoring Strategy', data.anchorStrategy || ''],
      ['Planned Concessions', data.concessions || ''],
      ['Closing Approach', data.closingApproach || ''],
      ['Urgency Driver', data.urgencyDriver || ''],
      ['Key Stakeholders', data.keyStakeholders || ''],
      ['Potential Blockers', data.potentialBlockers || '']
    ];

    var ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Negotiation Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateNegotiationClosingPDF: function(filename, data) {
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF('p', 'mm', 'a4');
    var pageWidth = pdf.internal.pageSize.getWidth();
    var margin = 20;
    var y = 25;

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Negotiation & Closing Strategy', margin, y);
    y += 12;

    // Company
    pdf.setFontSize(16);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text(data.companyName || 'Deal', margin, y);
    y += 8;

    // Deal Value
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Deal Value: ' + (data.dealValue || 'TBD'), margin, y);
    y += 15;

    var sections = [
      { title: 'Your BATNA', content: data.yourBATNA },
      { title: 'Their BATNA', content: data.theirBATNA },
      { title: 'Anchoring Strategy', content: data.anchorStrategy },
      { title: 'Planned Concessions', content: data.concessions },
      { title: 'Closing Approach', content: data.closingApproach },
      { title: 'Urgency Driver', content: data.urgencyDriver },
      { title: 'Key Stakeholders', content: data.keyStakeholders },
      { title: 'Potential Blockers', content: data.potentialBlockers }
    ];

    sections.forEach(function(section) {
      if (y > 260) {
        pdf.addPage();
        y = 25;
      }

      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(section.title, margin, y);
      y += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(...DocStyles.rgb.gray);
      var lines = pdf.splitTextToSize(section.content || 'Not specified', pageWidth - 2 * margin);
      pdf.text(lines, margin, y);
      y += lines.length * 5 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateNegotiationClosingPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'Negotiation & Closing Strategy';

    var palette = DocStyles.colors;

    // Slide 1: Title
    var slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: palette.navy } });
    slide1.addText('Negotiation & Closing Strategy', { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 36, bold: true, color: palette.white });
    slide1.addText(data.companyName || 'Deal', { x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 24, color: palette.teal });
    slide1.addText('Deal Value: ' + (data.dealValue || 'TBD'), { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 14, color: palette.white });

    // Slide 2: BATNA Analysis
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide2.addText('BATNA Analysis', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide2.addText('Your BATNA', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.yourBATNA || '', { x: 0.4, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide2.addText('Their BATNA', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.theirBATNA || '', { x: 5.1, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 3: Negotiation Strategy
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide3.addText('Negotiation Strategy', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide3.addText('Anchoring Strategy', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.anchorStrategy || '', { x: 0.4, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide3.addText('Planned Concessions', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.concessions || '', { x: 5.1, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 4: Closing Strategy
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide4.addText('Closing Strategy', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide4.addText('Closing Approach', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.closingApproach || '', { x: 0.4, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide4.addText('Urgency Driver', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.urgencyDriver || '', { x: 5.1, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 5: Stakeholders & Risks
    var slide5 = pptx.addSlide();
    slide5.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide5.addText('Stakeholders & Risks', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide5.addText('Key Stakeholders', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide5.addText(data.keyStakeholders || '', { x: 0.4, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide5.addText('Potential Blockers', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide5.addText(data.potentialBlockers || '', { x: 5.1, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // ENTERPRISE ACCOUNT STRATEGY CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  /**
   * Generate Enterprise Account Strategy Canvas Word document
   */
  generateEnterpriseAccountWord: function(filename, data) {
    var docxLib = window.docx.default || window.docx;
    var Document = docxLib.Document;
    var Packer = docxLib.Packer;
    var Paragraph = docxLib.Paragraph;
    var TextRun = docxLib.TextRun;
    var HeadingLevel = docxLib.HeadingLevel;
    var Table = docxLib.Table;
    var TableRow = docxLib.TableRow;
    var TableCell = docxLib.TableCell;
    var WidthType = docxLib.WidthType;

    var cellWidth = 4500;

    function makeRow(label, value) {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: cellWidth, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })]
          }),
          new TableCell({
            width: { size: cellWidth, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: value || '' })] })]
          })
        ]
      });
    }

    var doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: 'Enterprise Account Strategy Canvas',
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            text: data.accountName || 'Untitled Account',
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({ text: '' }),
          new Table({
            rows: [
              makeRow('Account Tier', data.accountTier),
              makeRow('Current ARR', data.currentARR),
              makeRow('Expansion Potential', data.expansionPotential)
            ]
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Key Stakeholders',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.keyStakeholders || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Strategic Priorities',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.strategicPriorities || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Value Delivered (ROI)',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.valueDelivered || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Expansion Opportunities',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.expansionOpportunities || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Risks & Threats',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.risksThreats || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '90-Day Action Plan',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.actionPlan || '' })
        ]
      }]
    });

    var self = this;
    Packer.toBlob(doc).then(function(blob) {
      self._downloadFile(blob, filename + '.docx');
    });
  },

  /**
   * Generate Enterprise Account Strategy Canvas Excel spreadsheet
   */
  generateEnterpriseAccountExcel: function(filename, data) {
    var wsData = [
      ['Enterprise Account Strategy Canvas'],
      [''],
      ['Account Overview'],
      ['Account Name', data.accountName || ''],
      ['Account Tier', data.accountTier || ''],
      ['Current ARR', data.currentARR || ''],
      ['Expansion Potential', data.expansionPotential || ''],
      [''],
      ['Key Stakeholders'],
      [data.keyStakeholders || ''],
      [''],
      ['Strategic Priorities'],
      [data.strategicPriorities || ''],
      [''],
      ['Value Delivered (ROI)'],
      [data.valueDelivered || ''],
      [''],
      ['Expansion Opportunities'],
      [data.expansionOpportunities || ''],
      [''],
      ['Risks & Threats'],
      [data.risksThreats || ''],
      [''],
      ['90-Day Action Plan'],
      [data.actionPlan || '']
    ];

    var ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Account Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  /**
   * Generate Enterprise Account Strategy Canvas PDF
   */
  generateEnterpriseAccountPDF: function(filename, data) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var y = 20;
    var lineHeight = 7;
    var margin = 20;
    var maxWidth = 170;

    doc.setFontSize(18);
    doc.setFont(DocStyles.fonts.pdf, 'bold');
    doc.text('Enterprise Account Strategy Canvas', margin, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(data.accountName || 'Untitled Account', margin, y);
    y += 12;

    function addSection(title, content) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.setFont(DocStyles.fonts.pdf, 'bold');
      doc.text(title, margin, y);
      y += lineHeight;
      doc.setFont(DocStyles.fonts.pdf, 'normal');
      doc.setFontSize(10);
      var lines = doc.splitTextToSize(content || '', maxWidth);
      lines.forEach(function(line) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 5;
      });
      y += 5;
    }

    doc.setFontSize(11);
    doc.setFont(DocStyles.fonts.pdf, 'normal');
    doc.text('Account Tier: ' + (data.accountTier || ''), margin, y);
    y += lineHeight;
    doc.text('Current ARR: ' + (data.currentARR || ''), margin, y);
    y += lineHeight;
    doc.text('Expansion Potential: ' + (data.expansionPotential || ''), margin, y);
    y += 10;

    addSection('Key Stakeholders', data.keyStakeholders);
    addSection('Strategic Priorities', data.strategicPriorities);
    addSection('Value Delivered (ROI)', data.valueDelivered);
    addSection('Expansion Opportunities', data.expansionOpportunities);
    addSection('Risks & Threats', data.risksThreats);
    addSection('90-Day Action Plan', data.actionPlan);

    doc.save(filename + '.pdf');
  },

  /**
   * Generate Enterprise Account Strategy Canvas PowerPoint
   */
  generateEnterpriseAccountPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'Enterprise Account Strategy Canvas';

    var palette = DocStyles.colors;

    // Slide 1: Title
    var slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: palette.navy } });
    slide1.addText('Enterprise Account Strategy Canvas', { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 32, bold: true, color: palette.white });
    slide1.addText(data.accountName || 'Account Strategy', { x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 20, color: palette.teal });
    slide1.addText('Account Tier: ' + (data.accountTier || 'Strategic'), { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 14, color: palette.light });

    // Slide 2: Account Overview
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide2.addText('Account Overview', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide2.addText('Current ARR', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.currentARR || '', { x: 0.4, y: 1.3, w: 4.3, h: 0.8, fontSize: 18, bold: true, color: palette.navy });
    
    slide2.addText('Expansion Potential', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.expansionPotential || '', { x: 5.1, y: 1.3, w: 4.3, h: 0.8, fontSize: 18, bold: true, color: palette.navy });
    
    slide2.addText('Key Stakeholders', { x: 0.4, y: 2.4, w: 9, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.keyStakeholders || '', { x: 0.4, y: 2.8, w: 9, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 3: Strategic Context
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide3.addText('Strategic Context', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide3.addText('Account Strategic Priorities', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.strategicPriorities || '', { x: 0.4, y: 1.3, w: 4.3, h: 1.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide3.addText('Value Delivered (ROI)', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.valueDelivered || '', { x: 5.1, y: 1.3, w: 4.3, h: 1.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 4: Growth Strategy
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide4.addText('Growth Strategy', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide4.addText('Expansion Opportunities', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.expansionOpportunities || '', { x: 0.4, y: 1.3, w: 4.3, h: 1.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide4.addText('Risks & Threats', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.risksThreats || '', { x: 5.1, y: 1.3, w: 4.3, h: 1.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 5: Action Plan
    var slide5 = pptx.addSlide();
    slide5.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide5.addText('90-Day Action Plan', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide5.addText(data.actionPlan || '', { x: 0.4, y: 0.9, w: 9, h: 3.5, fontSize: 12, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // B2C SALES STRATEGY CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  /**
   * Generate B2C Sales Strategy Canvas Word document
   */
  generateB2CStrategyWord: function(filename, data) {
    var docxLib = window.docx.default || window.docx;
    var Document = docxLib.Document;
    var Packer = docxLib.Packer;
    var Paragraph = docxLib.Paragraph;
    var TextRun = docxLib.TextRun;
    var HeadingLevel = docxLib.HeadingLevel;

    var doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: 'B2C Sales Strategy Canvas',
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            text: data.brandName || 'Untitled Brand',
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Target Customer: ', bold: true }),
              new TextRun({ text: data.targetCustomer || '' })
            ]
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Value Proposition',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.valueProposition || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Sales Channels',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.channels || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Emotional Triggers',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.emotionalTriggers || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Upsell/Cross-Sell Strategy',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.upsellStrategy || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Retention Tactics',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.retentionTactics || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Key Metrics to Track',
            heading: HeadingLevel.HEADING_3
          }),
          new Paragraph({ text: data.keyMetrics || '' })
        ]
      }]
    });

    var self = this;
    Packer.toBlob(doc).then(function(blob) {
      self._downloadFile(blob, filename + '.docx');
    });
  },

  /**
   * Generate B2C Sales Strategy Canvas Excel spreadsheet
   */
  generateB2CStrategyExcel: function(filename, data) {
    var wsData = [
      ['B2C Sales Strategy Canvas'],
      [''],
      ['Brand Overview'],
      ['Brand Name', data.brandName || ''],
      ['Target Customer', data.targetCustomer || ''],
      [''],
      ['Value Proposition'],
      [data.valueProposition || ''],
      [''],
      ['Sales Channels'],
      [data.channels || ''],
      [''],
      ['Emotional Triggers'],
      [data.emotionalTriggers || ''],
      [''],
      ['Upsell/Cross-Sell Strategy'],
      [data.upsellStrategy || ''],
      [''],
      ['Retention Tactics'],
      [data.retentionTactics || ''],
      [''],
      ['Key Metrics to Track'],
      [data.keyMetrics || '']
    ];

    var ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'B2C Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  /**
   * Generate B2C Sales Strategy Canvas PDF
   */
  generateB2CStrategyPDF: function(filename, data) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var y = 20;
    var lineHeight = 7;
    var margin = 20;
    var maxWidth = 170;

    doc.setFontSize(18);
    doc.setFont(DocStyles.fonts.pdf, 'bold');
    doc.text('B2C Sales Strategy Canvas', margin, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(data.brandName || 'Untitled Brand', margin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont(DocStyles.fonts.pdf, 'normal');
    doc.text('Target Customer: ' + (data.targetCustomer || ''), margin, y);
    y += 10;

    function addSection(title, content) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.setFont(DocStyles.fonts.pdf, 'bold');
      doc.text(title, margin, y);
      y += lineHeight;
      doc.setFont(DocStyles.fonts.pdf, 'normal');
      doc.setFontSize(10);
      var lines = doc.splitTextToSize(content || '', maxWidth);
      lines.forEach(function(line) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 5;
      });
      y += 5;
    }

    addSection('Value Proposition', data.valueProposition);
    addSection('Sales Channels', data.channels);
    addSection('Emotional Triggers', data.emotionalTriggers);
    addSection('Upsell/Cross-Sell Strategy', data.upsellStrategy);
    addSection('Retention Tactics', data.retentionTactics);
    addSection('Key Metrics to Track', data.keyMetrics);

    doc.save(filename + '.pdf');
  },

  /**
   * Generate B2C Sales Strategy Canvas PowerPoint
   */
  generateB2CStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'B2C Sales Strategy Canvas';

    var palette = DocStyles.colors;

    // Slide 1: Title
    var slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: palette.navy } });
    slide1.addText('B2C Sales Strategy Canvas', { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 32, bold: true, color: palette.white });
    slide1.addText(data.brandName || 'Brand Strategy', { x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 20, color: palette.teal });
    slide1.addText('Target: ' + (data.targetCustomer || ''), { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 14, color: palette.light });

    // Slide 2: Value & Channels
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide2.addText('Value Proposition & Channels', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide2.addText('Value Proposition', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.valueProposition || '', { x: 0.4, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide2.addText('Sales Channels', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.channels || '', { x: 5.1, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 3: Emotional & Upsell
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide3.addText('Emotional Selling & Revenue Growth', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide3.addText('Emotional Triggers', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.emotionalTriggers || '', { x: 0.4, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide3.addText('Upsell/Cross-Sell Strategy', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.upsellStrategy || '', { x: 5.1, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 4: Retention & Metrics
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide4.addText('Retention & Success Metrics', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide4.addText('Retention Tactics', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.retentionTactics || '', { x: 0.4, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide4.addText('Key Metrics', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.keyMetrics || '', { x: 5.1, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // HIGH-TICKET OFFER CANVAS GENERATORS
  // ============================================================

  generateHighTicketOfferWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        properties: {},
        children: [
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'HIGH-TICKET OFFER CANVAS', bold: true, size: 36, color: DocStyles.colors.navy })],
            spacing: { after: 200 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.offerName || 'Untitled Offer', bold: true, size: 28, color: DocStyles.colors.crimson })],
            spacing: { after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'Price Point: ', bold: true }), new window.docx.TextRun({ text: data.pricePoint || '' })],
            spacing: { after: 300 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'IDEAL CLIENT PROFILE', bold: true, size: 24, color: DocStyles.colors.blue })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.idealClient || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'CORE TRANSFORMATION', bold: true, size: 24, color: DocStyles.colors.blue })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.transformation || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'VALUE STACK', bold: true, size: 24, color: DocStyles.colors.blue })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.valueStack || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'AUTHORITY POSITIONING', bold: true, size: 24, color: DocStyles.colors.blue })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.authority || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'SALES PROCESS', bold: true, size: 24, color: DocStyles.colors.blue })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.salesProcess || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'TOP OBJECTIONS & RESPONSES', bold: true, size: 24, color: DocStyles.colors.blue })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.objections || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'Generated by Sales Mastery Series - wasilzafar.com', italics: true, size: 18, color: DocStyles.colors.gray })],
            spacing: { before: 400 }
          })
        ]
      }]
    });

    window.docx.Packer.toBlob(doc).then(function(blob) {
      DocGenerator._downloadFile(blob, filename + '.docx');
    });
  },

  generateHighTicketOfferExcel: function(filename, data) {
    var wsData = [
      ['HIGH-TICKET OFFER CANVAS'],
      [''],
      ['Offer Name', data.offerName || ''],
      ['Price Point', data.pricePoint || ''],
      [''],
      ['IDEAL CLIENT PROFILE'],
      [data.idealClient || ''],
      [''],
      ['CORE TRANSFORMATION'],
      [data.transformation || ''],
      [''],
      ['VALUE STACK'],
      [data.valueStack || ''],
      [''],
      ['AUTHORITY POSITIONING'],
      [data.authority || ''],
      [''],
      ['SALES PROCESS'],
      [data.salesProcess || ''],
      [''],
      ['TOP OBJECTIONS & RESPONSES'],
      [data.objections || ''],
      [''],
      ['Generated by Sales Mastery Series - wasilzafar.com']
    ];

    var ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'High-Ticket Offer');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateHighTicketOfferPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    var lineHeight = 7;
    var margin = 20;
    var maxWidth = 170;

    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('HIGH-TICKET OFFER CANVAS', margin, y);
    y += 12;

    // Offer Name
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text(data.offerName || 'Untitled Offer', margin, y);
    y += 8;

    // Price Point
    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.black);
    pdf.text('Price Point: ' + (data.pricePoint || ''), margin, y);
    y += 12;

    // Helper function for sections
    var addSection = function(title, content) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(title, margin, y);
      y += lineHeight;
      
      pdf.setFontSize(10);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(content || '', maxWidth);
      lines.forEach(function(line) {
        if (y > 280) { pdf.addPage(); y = 20; }
        pdf.text(line, margin, y);
        y += lineHeight - 1;
      });
      y += 5;
    };

    addSection('IDEAL CLIENT PROFILE', data.idealClient);
    addSection('CORE TRANSFORMATION', data.transformation);
    addSection('VALUE STACK', data.valueStack);
    addSection('AUTHORITY POSITIONING', data.authority);
    addSection('SALES PROCESS', data.salesProcess);
    addSection('TOP OBJECTIONS & RESPONSES', data.objections);

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated by Sales Mastery Series - wasilzafar.com', margin, 285);

    pdf.save(filename + '.pdf');
  },

  generateHighTicketOfferPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'High-Ticket Offer Canvas';
    pptx.author = 'Sales Mastery Series';

    var palette = DocStyles.colors;

    // Slide 1: Title
    var slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: palette.navy } });
    slide1.addText('HIGH-TICKET OFFER CANVAS', { x: 0.5, y: 1.8, w: 9, h: 0.8, fontSize: 32, bold: true, color: palette.white });
    slide1.addText(data.offerName || 'Untitled Offer', { x: 0.5, y: 2.7, w: 9, h: 0.5, fontSize: 24, color: palette.teal });
    slide1.addText('Price Point: ' + (data.pricePoint || ''), { x: 0.5, y: 3.3, w: 9, h: 0.4, fontSize: 18, color: palette.white });
    slide1.addText('Sales Mastery Series', { x: 0.5, y: 4.8, w: 9, h: 0.3, fontSize: 12, color: palette.light });

    // Slide 2: Client & Transformation
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide2.addText('Ideal Client & Transformation', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide2.addText('Ideal Client Profile', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.idealClient || '', { x: 0.4, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide2.addText('Core Transformation', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.transformation || '', { x: 5.1, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 3: Value & Authority
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide3.addText('Value Stack & Authority', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide3.addText('Value Stack', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.valueStack || '', { x: 0.4, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide3.addText('Authority Positioning', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.authority || '', { x: 5.1, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 4: Sales Process & Objections
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: palette.teal } });
    slide4.addText('Sales Process & Objection Handling', { x: 0.4, y: 0.1, w: 9, h: 0.4, fontSize: 20, bold: true, color: palette.white });
    
    slide4.addText('Sales Process', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.salesProcess || '', { x: 0.4, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    
    slide4.addText('Top Objections & Responses', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.objections || '', { x: 5.1, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // Pipeline Health Canvas
  // ============================================================

  generatePipelineHealthWord: function(filename, data) {
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel } = window.docx.default || window.docx;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'Pipeline Health Review',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Team: ', bold: true }),
              new TextRun(data.teamName || ''),
              new TextRun({ text: '  |  Period: ', bold: true }),
              new TextRun(data.period || '')
            ],
            spacing: { after: 200 }
          }),

          // Summary Table
          new Paragraph({ text: 'Pipeline Summary', heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Metric', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Value', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Pipeline Value')] }),
                  new TableCell({ children: [new Paragraph(data.pipelineValue || '')] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Period Quota')] }),
                  new TableCell({ children: [new Paragraph(data.quota || '')] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Coverage Ratio')] }),
                  new TableCell({ children: [new Paragraph(data.coverage || '')] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Win Rate')] }),
                  new TableCell({ children: [new Paragraph(data.winRate || '')] })
                ]
              })
            ]
          }),

          // Stage Breakdown
          new Paragraph({ text: 'Stage Breakdown', heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
          new Paragraph({ text: data.stageBreakdown || '', spacing: { after: 200 } }),

          // Risks
          new Paragraph({ text: 'Pipeline Risks', heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
          new Paragraph({ text: data.risks || '', spacing: { after: 200 } }),

          // Actions
          new Paragraph({ text: 'Action Items', heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
          new Paragraph({ text: data.actions || '' })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      this._downloadFile(blob, filename + '.docx');
    });
  },

  generatePipelineHealthExcel: function(filename, data) {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Pipeline Health Review'],
      [''],
      ['Team', data.teamName || ''],
      ['Period', data.period || ''],
      [''],
      ['Metric', 'Value'],
      ['Total Pipeline Value', data.pipelineValue || ''],
      ['Period Quota', data.quota || ''],
      ['Coverage Ratio', data.coverage || ''],
      ['Win Rate', data.winRate || '']
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    // Stage Breakdown Sheet
    const stageData = [
      ['Stage Breakdown'],
      [''],
      [data.stageBreakdown || '']
    ];
    const stageSheet = XLSX.utils.aoa_to_sheet(stageData);
    stageSheet['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, stageSheet, 'Stage Breakdown');

    // Risks & Actions Sheet
    const risksActionsData = [
      ['Pipeline Risks'],
      [''],
      [data.risks || ''],
      [''],
      ['Action Items'],
      [''],
      [data.actions || '']
    ];
    const risksSheet = XLSX.utils.aoa_to_sheet(risksActionsData);
    risksSheet['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, risksSheet, 'Risks & Actions');

    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePipelineHealthPDF: function(filename, data) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let y = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Pipeline Health Review', margin, y);
    y += 15;

    // Header
    pdf.setFontSize(12);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Team: ' + (data.teamName || '') + '  |  Period: ' + (data.period || ''), margin, y);
    y += 15;

    // Summary Box
    pdf.setFillColor(...DocStyles.rgb.light);
    pdf.rect(margin, y, contentWidth, 50, 'F');
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, y, contentWidth, 50, 'S');
    
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Pipeline Summary', margin + 5, y + 10);
    
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.black);
    const summaryY = y + 20;
    pdf.text('Total Pipeline Value: ' + (data.pipelineValue || ''), margin + 5, summaryY);
    pdf.text('Period Quota: ' + (data.quota || ''), margin + 5, summaryY + 8);
    pdf.text('Coverage Ratio: ' + (data.coverage || ''), contentWidth/2 + margin, summaryY);
    pdf.text('Win Rate: ' + (data.winRate || ''), contentWidth/2 + margin, summaryY + 8);
    y += 60;

    // Stage Breakdown
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Stage Breakdown', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.black);
    const stageLines = pdf.splitTextToSize(data.stageBreakdown || '', contentWidth);
    pdf.text(stageLines, margin, y);
    y += stageLines.length * 5 + 10;

    // Check page break
    if (y > 240) {
      pdf.addPage();
      y = 20;
    }

    // Risks
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Pipeline Risks', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.black);
    const riskLines = pdf.splitTextToSize(data.risks || '', contentWidth);
    pdf.text(riskLines, margin, y);
    y += riskLines.length * 5 + 10;

    // Check page break
    if (y > 240) {
      pdf.addPage();
      y = 20;
    }

    // Actions
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Action Items', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.black);
    const actionLines = pdf.splitTextToSize(data.actions || '', contentWidth);
    pdf.text(actionLines, margin, y);

    pdf.save(filename + '.pdf');
  },

  generatePipelineHealthPPTX: function(filename, data) {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    var palette = DocStyles.colors;

    // Slide 1: Title
    const slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: palette.navy } });
    slide1.addText('Pipeline Health Review', { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 36, bold: true, color: palette.white });
    slide1.addText((data.teamName || 'Sales Team') + ' | ' + (data.period || 'Current Period'), { x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 20, color: palette.teal });

    // Slide 2: Pipeline Summary
    const slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: palette.teal } });
    slide2.addText('Pipeline Summary', { x: 0.4, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: palette.navy });

    // Metrics Grid
    const metrics = [
      { label: 'Total Pipeline Value', value: data.pipelineValue || 'N/A' },
      { label: 'Period Quota', value: data.quota || 'N/A' },
      { label: 'Coverage Ratio', value: data.coverage || 'N/A' },
      { label: 'Win Rate', value: data.winRate || 'N/A' }
    ];
    metrics.forEach(function(m, i) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.5 + col * 4.5;
      const y = 1.2 + row * 1.5;
      slide2.addShape(pptx.ShapeType.rect, { x: x, y: y, w: 4.2, h: 1.2, fill: { color: palette.light }, line: { color: palette.teal, pt: 1 } });
      slide2.addText(m.label, { x: x + 0.1, y: y + 0.1, w: 4, h: 0.4, fontSize: 12, color: palette.blue });
      slide2.addText(m.value, { x: x + 0.1, y: y + 0.5, w: 4, h: 0.5, fontSize: 20, bold: true, color: palette.navy });
    });

    // Stage Breakdown
    slide2.addText('Stage Breakdown', { x: 0.4, y: 4.2, w: 4, h: 0.4, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.stageBreakdown || '', { x: 0.4, y: 4.65, w: 9, h: 0.8, fontSize: 10, wrap: true, valign: 'top', fit: 'shrink', color: DocStyles.colors.darkGray });

    // Slide 3: Risks & Actions
    const slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: palette.teal } });
    slide3.addText('Risks & Actions', { x: 0.4, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: palette.navy });

    // Risks
    slide3.addShape(pptx.ShapeType.rect, { x: 0.4, y: 1.0, w: 4.3, h: 3.8, fill: { color: palette.light }, line: { color: palette.crimson, pt: 1 } });
    slide3.addText('Pipeline Risks', { x: 0.5, y: 1.1, w: 4.1, h: 0.4, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.risks || '', { x: 0.5, y: 1.5, w: 4.1, h: 3.1, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Actions
    slide3.addShape(pptx.ShapeType.rect, { x: 5, y: 1.0, w: 4.3, h: 3.8, fill: { color: palette.light }, line: { color: palette.teal, pt: 1 } });
    slide3.addText('Action Items', { x: 5.1, y: 1.1, w: 4.1, h: 0.4, fontSize: 14, bold: true, color: palette.teal });
    slide3.addText(data.actions || '', { x: 5.1, y: 1.5, w: 4.1, h: 3.1, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // Alignment Strategy Canvas
  // ============================================================

  generateAlignmentStrategyWord: function(filename, data) {
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel } = window.docx.default || window.docx;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'Sales & Marketing Alignment Strategy',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Company: ', bold: true }),
              new TextRun(data.company || '')
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Primary Shared Goal: ', bold: true }),
              new TextRun(data.sharedGoal || '')
            ],
            spacing: { after: 300 }
          }),

          // Lead Definitions
          new Paragraph({ text: 'Lead Qualification Definitions', heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'MQL Criteria', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'SQL Criteria', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(data.mqlCriteria || '')] }),
                  new TableCell({ children: [new Paragraph(data.sqlCriteria || '')] })
                ]
              })
            ]
          }),

          // SLA Commitments
          new Paragraph({ text: 'Service Level Agreements', heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Marketing SLA', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sales SLA', bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(data.marketingSla || '')] }),
                  new TableCell({ children: [new Paragraph(data.salesSla || '')] })
                ]
              })
            ]
          }),

          // Handoff Process
          new Paragraph({ text: 'Lead Handoff Process', heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
          new Paragraph({ text: data.handoff || '', spacing: { after: 200 } }),

          // Enablement
          new Paragraph({ text: 'Key Enablement Assets', heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
          new Paragraph({ text: data.enablement || '' })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      this._downloadFile(blob, filename + '.docx');
    });
  },

  generateAlignmentStrategyExcel: function(filename, data) {
    const wb = XLSX.utils.book_new();

    // Overview Sheet
    const overviewData = [
      ['Sales & Marketing Alignment Strategy'],
      [''],
      ['Company', data.company || ''],
      ['Primary Shared Goal', data.sharedGoal || ''],
      [''],
      ['Lead Qualification'],
      ['MQL Criteria', data.mqlCriteria || ''],
      ['SQL Criteria', data.sqlCriteria || '']
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    overviewSheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, overviewSheet, 'Overview');

    // SLAs Sheet
    const slaData = [
      ['Service Level Agreements'],
      [''],
      ['Marketing SLA'],
      [data.marketingSla || ''],
      [''],
      ['Sales SLA'],
      [data.salesSla || '']
    ];
    const slaSheet = XLSX.utils.aoa_to_sheet(slaData);
    slaSheet['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, slaSheet, 'SLAs');

    // Process Sheet
    const processData = [
      ['Lead Handoff Process'],
      [''],
      [data.handoff || ''],
      [''],
      ['Key Enablement Assets'],
      [''],
      [data.enablement || '']
    ];
    const processSheet = XLSX.utils.aoa_to_sheet(processData);
    processSheet['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, processSheet, 'Process');

    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAlignmentStrategyPDF: function(filename, data) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let y = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Sales & Marketing Alignment Strategy', margin, y);
    y += 15;

    // Header
    pdf.setFontSize(12);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Company: ' + (data.company || ''), margin, y);
    y += 8;
    pdf.text('Primary Goal: ' + (data.sharedGoal || ''), margin, y);
    y += 15;

    // MQL/SQL Definitions
    pdf.setFillColor(...DocStyles.rgb.light);
    pdf.rect(margin, y, contentWidth, 50, 'F');
    pdf.setDrawColor(...DocStyles.rgb.teal);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, y, contentWidth, 50, 'S');
    
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Lead Qualification', margin + 5, y + 10);
    
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.black);
    pdf.text('MQL: ' + (data.mqlCriteria || '').substring(0, 80), margin + 5, y + 22);
    pdf.text('SQL: ' + (data.sqlCriteria || '').substring(0, 80), margin + 5, y + 34);
    y += 60;

    // SLAs
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Service Level Agreements', margin, y);
    y += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.black);
    pdf.text('Marketing SLA:', margin, y);
    y += 6;
    const mktgLines = pdf.splitTextToSize(data.marketingSla || '', contentWidth - 5);
    pdf.text(mktgLines.slice(0, 3), margin + 5, y);
    y += Math.min(mktgLines.length, 3) * 5 + 6;
    pdf.text('Sales SLA:', margin, y);
    y += 6;
    const salesLines = pdf.splitTextToSize(data.salesSla || '', contentWidth - 5);
    pdf.text(salesLines.slice(0, 3), margin + 5, y);
    y += Math.min(salesLines.length, 3) * 5 + 10;

    // Check page break
    if (y > 240) {
      pdf.addPage();
      y = 20;
    }

    // Handoff
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Lead Handoff Process', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.black);
    const handoffLines = pdf.splitTextToSize(data.handoff || '', contentWidth);
    pdf.text(handoffLines.slice(0, 5), margin, y);
    y += Math.min(handoffLines.length, 5) * 5 + 10;

    // Enablement
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text('Key Enablement Assets', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(...DocStyles.rgb.black);
    const enableLines = pdf.splitTextToSize(data.enablement || '', contentWidth);
    pdf.text(enableLines.slice(0, 5), margin, y);

    pdf.save(filename + '.pdf');
  },

  generateAlignmentStrategyPPTX: function(filename, data) {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    var palette = DocStyles.colors;

    // Slide 1: Title
    const slide1 = pptx.addSlide();
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: palette.navy } });
    slide1.addText('Sales & Marketing Alignment', { x: 0.5, y: 2.0, w: 9, h: 0.8, fontSize: 36, bold: true, color: palette.white });
    slide1.addText(data.company || 'Strategy', { x: 0.5, y: 2.9, w: 9, h: 0.5, fontSize: 20, color: palette.teal });
    slide1.addText('Shared Goal: ' + (data.sharedGoal || ''), { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 14, color: palette.white });

    // Slide 2: Lead Qualification
    const slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: palette.teal } });
    slide2.addText('Lead Qualification', { x: 0.4, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: palette.navy });

    // MQL Box
    slide2.addShape(pptx.ShapeType.rect, { x: 0.4, y: 1.0, w: 4.3, h: 3.8, fill: { color: palette.light }, line: { color: palette.blue, pt: 1 } });
    slide2.addText('MQL Criteria', { x: 0.5, y: 1.1, w: 4.1, h: 0.4, fontSize: 14, bold: true, color: palette.blue });
    slide2.addText(data.mqlCriteria || '', { x: 0.5, y: 1.5, w: 4.1, h: 3.1, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // SQL Box
    slide2.addShape(pptx.ShapeType.rect, { x: 5, y: 1.0, w: 4.3, h: 3.8, fill: { color: palette.light }, line: { color: palette.crimson, pt: 1 } });
    slide2.addText('SQL Criteria', { x: 5.1, y: 1.1, w: 4.1, h: 0.4, fontSize: 14, bold: true, color: palette.crimson });
    slide2.addText(data.sqlCriteria || '', { x: 5.1, y: 1.5, w: 4.1, h: 3.1, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 3: SLAs
    const slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: palette.teal } });
    slide3.addText('Service Level Agreements', { x: 0.4, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: palette.navy });

    // Marketing SLA
    slide3.addShape(pptx.ShapeType.rect, { x: 0.4, y: 1.0, w: 4.3, h: 3.8, fill: { color: palette.light }, line: { color: palette.teal, pt: 1 } });
    slide3.addText('Marketing Commits', { x: 0.5, y: 1.1, w: 4.1, h: 0.4, fontSize: 14, bold: true, color: palette.teal });
    slide3.addText(data.marketingSla || '', { x: 0.5, y: 1.5, w: 4.1, h: 3.1, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Sales SLA
    slide3.addShape(pptx.ShapeType.rect, { x: 5, y: 1.0, w: 4.3, h: 3.8, fill: { color: palette.light }, line: { color: palette.crimson, pt: 1 } });
    slide3.addText('Sales Commits', { x: 5.1, y: 1.1, w: 4.1, h: 0.4, fontSize: 14, bold: true, color: palette.crimson });
    slide3.addText(data.salesSla || '', { x: 5.1, y: 1.5, w: 4.1, h: 3.1, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 4: Process & Enablement
    const slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: palette.teal } });
    slide4.addText('Process & Enablement', { x: 0.4, y: 0.3, w: 9, h: 0.6, fontSize: 28, bold: true, color: palette.navy });

    slide4.addText('Lead Handoff Process', { x: 0.4, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.blue });
    slide4.addText(data.handoff || '', { x: 0.4, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    slide4.addText('Key Enablement Assets', { x: 5.1, y: 0.9, w: 4.3, h: 0.3, fontSize: 14, bold: true, color: palette.crimson });
    slide4.addText(data.enablement || '', { x: 5.1, y: 1.3, w: 4.3, h: 2.0, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // Sales Leadership Canvas — Word / Excel / PDF / PPTX
  // ============================================================

  generateSalesLeadershipWord: function(filename, data) {
    var docx = window.docx.default || window.docx;
    var children = [];

    children.push(new docx.Paragraph({ text: 'Sales Leadership Canvas', heading: docx.HeadingLevel.HEADING_1 }));
    children.push(new docx.Paragraph({ text: 'Team: ' + (data.teamName || 'N/A'), spacing: { after: 100 } }));
    children.push(new docx.Paragraph({ text: 'Vision: ' + (data.vision || 'N/A'), spacing: { after: 200 } }));

    var sections = [
      { title: 'Culture Pillars', value: data.culture },
      { title: 'Hiring Priorities', value: data.hiring },
      { title: 'Coaching Cadence', value: data.coaching },
      { title: 'Compensation Structure', value: data.compensation },
      { title: 'Development Plan', value: data.development },
      { title: 'Scaling Priorities', value: data.scaling }
    ];

    sections.forEach(function(s) {
      children.push(new docx.Paragraph({ text: s.title, heading: docx.HeadingLevel.HEADING_2, spacing: { before: 300 } }));
      var lines = (s.value || 'N/A').split('\n');
      lines.forEach(function(line) {
        children.push(new docx.Paragraph({ text: line, spacing: { after: 80 } }));
      });
    });

    var doc = new docx.Document({
      sections: [{ properties: {}, children: children }]
    });

    docx.Packer.toBlob(doc).then(function(blob) {
      DocGenerator._downloadFile(blob, filename + '.docx');
    });
  },

  generateSalesLeadershipExcel: function(filename, data) {
    var rows = [
      ['Sales Leadership Canvas'],
      ['Team', data.teamName || ''],
      ['Vision', data.vision || ''],
      [],
      ['Section', 'Details'],
      ['Culture Pillars', data.culture || ''],
      ['Hiring Priorities', data.hiring || ''],
      ['Coaching Cadence', data.coaching || ''],
      ['Compensation Structure', data.compensation || ''],
      ['Development Plan', data.development || ''],
      ['Scaling Priorities', data.scaling || '']
    ];

    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Leadership');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSalesLeadershipPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    var maxW = 170;

    pdf.setFontSize(18);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Sales Leadership Canvas', 20, y); y += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Team: ' + (data.teamName || 'N/A'), 20, y); y += 6;
    pdf.text('Vision: ' + (data.vision || 'N/A'), 20, y); y += 10;

    var sections = [
      { title: 'Culture Pillars', value: data.culture },
      { title: 'Hiring Priorities', value: data.hiring },
      { title: 'Coaching Cadence', value: data.coaching },
      { title: 'Compensation Structure', value: data.compensation },
      { title: 'Development Plan', value: data.development },
      { title: 'Scaling Priorities', value: data.scaling }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(s.title, 20, y); y += 7;

      pdf.setFontSize(10);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.value || 'N/A', maxW);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 20, y); y += 5;
      });
      y += 5;
    });

    pdf.save(filename + '.pdf');
  },

  generateSalesLeadershipPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    // Title slide
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Sales Leadership Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText((data.teamName || '') + ' — ' + (data.vision || ''), { x: 0.5, y: 2.8, w: 9, h: 0.6, fontSize: 16, color: colors.teal, align: 'center' });

    // Culture & Hiring
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide2.addText('Culture & Hiring', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide2.addText('Culture Pillars', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.culture || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Hiring Priorities', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.hiring || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Coaching & Compensation
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide3.addText('Coaching & Compensation', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide3.addText('Coaching Cadence', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.coaching || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Compensation Structure', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.compensation || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Development & Scaling
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide4.addText('Development & Scaling', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide4.addText('Development Plan', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.development || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide4.addText('Scaling Priorities', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.scaling || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // Sales Analytics Canvas — Word / Excel / PDF / PPTX
  // ============================================================

  generateSalesAnalyticsWord: function(filename, data) {
    var docx = window.docx.default || window.docx;
    var children = [];

    children.push(new docx.Paragraph({ text: 'Sales Analytics Canvas', heading: docx.HeadingLevel.HEADING_1 }));
    children.push(new docx.Paragraph({ text: 'Team: ' + (data.teamName || 'N/A'), spacing: { after: 100 } }));
    children.push(new docx.Paragraph({ text: 'Period: ' + (data.period || 'N/A'), spacing: { after: 200 } }));

    var sections = [
      { title: 'Key Metrics (Top 5-7)', value: data.keyMetrics },
      { title: 'Dashboard Structure', value: data.dashboards },
      { title: 'Pipeline Health Assessment', value: data.pipelineHealth },
      { title: 'Conversion Rates by Stage', value: data.conversionRates },
      { title: 'Win/Loss Insights', value: data.winLoss },
      { title: 'Optimization Priorities', value: data.optimizations }
    ];

    sections.forEach(function(s) {
      children.push(new docx.Paragraph({ text: s.title, heading: docx.HeadingLevel.HEADING_2, spacing: { before: 300 } }));
      var lines = (s.value || 'N/A').split('\n');
      lines.forEach(function(line) {
        children.push(new docx.Paragraph({ text: line, spacing: { after: 80 } }));
      });
    });

    var doc = new docx.Document({
      sections: [{ properties: {}, children: children }]
    });

    docx.Packer.toBlob(doc).then(function(blob) {
      DocGenerator._downloadFile(blob, filename + '.docx');
    });
  },

  generateSalesAnalyticsExcel: function(filename, data) {
    var rows = [
      ['Sales Analytics Canvas'],
      ['Team', data.teamName || ''],
      ['Period', data.period || ''],
      [],
      ['Section', 'Details'],
      ['Key Metrics', data.keyMetrics || ''],
      ['Dashboard Structure', data.dashboards || ''],
      ['Pipeline Health', data.pipelineHealth || ''],
      ['Conversion Rates', data.conversionRates || ''],
      ['Win/Loss Insights', data.winLoss || ''],
      ['Optimization Priorities', data.optimizations || '']
    ];

    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Analytics');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSalesAnalyticsPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    var maxW = 170;

    pdf.setFontSize(18);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Sales Analytics Canvas', 20, y); y += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Team: ' + (data.teamName || 'N/A'), 20, y); y += 6;
    pdf.text('Period: ' + (data.period || 'N/A'), 20, y); y += 10;

    var sections = [
      { title: 'Key Metrics (Top 5-7)', value: data.keyMetrics },
      { title: 'Dashboard Structure', value: data.dashboards },
      { title: 'Pipeline Health Assessment', value: data.pipelineHealth },
      { title: 'Conversion Rates by Stage', value: data.conversionRates },
      { title: 'Win/Loss Insights', value: data.winLoss },
      { title: 'Optimization Priorities', value: data.optimizations }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(s.title, 20, y); y += 7;

      pdf.setFontSize(10);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.value || 'N/A', maxW);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 20, y); y += 5;
      });
      y += 5;
    });

    pdf.save(filename + '.pdf');
  },

  generateSalesAnalyticsPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    // Title slide
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Sales Analytics Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText((data.teamName || '') + ' — ' + (data.period || ''), { x: 0.5, y: 2.8, w: 9, h: 0.6, fontSize: 16, color: colors.teal, align: 'center' });

    // Key Metrics & Dashboards
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide2.addText('Key Metrics & Dashboards', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide2.addText('Key Metrics', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.keyMetrics || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Dashboard Structure', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.dashboards || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Pipeline Health & Conversion
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide3.addText('Pipeline Health & Conversion', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide3.addText('Pipeline Health', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.pipelineHealth || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Conversion Rates', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.conversionRates || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Win/Loss & Optimization
    var slide4 = pptx.addSlide();
    slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide4.addText('Win/Loss Insights & Optimization', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide4.addText('Win/Loss Insights', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.winLoss || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide4.addText('Optimization Priorities', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.optimizations || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // Strategic Account Canvas — Word / Excel / PDF / PPTX
  // ============================================================

  generateStrategicAccountWord: function(filename, data) {
    var children = [];
    children.push(new docx.Paragraph({ text: 'Strategic Account Canvas', heading: docx.HeadingLevel.TITLE }));
    children.push(new docx.Paragraph({ text: 'Account: ' + (data.accountName || '') + ' — Tier: ' + (data.accountTier || ''), spacing: { after: 200 } }));

    var sections = [
      { title: 'Current Footprint', value: data.currentFootprint },
      { title: 'Whitespace Opportunities', value: data.whitespace },
      { title: 'Key Stakeholders', value: data.stakeholders },
      { title: '90-Day Action Plan', value: data.actionPlan }
    ];

    sections.forEach(function(s) {
      children.push(new docx.Paragraph({ text: s.title, heading: docx.HeadingLevel.HEADING_2, spacing: { before: 300 } }));
      var lines = (s.value || 'N/A').split('\n');
      lines.forEach(function(line) {
        children.push(new docx.Paragraph({ text: line, spacing: { after: 80 } }));
      });
    });

    var doc = new docx.Document({
      sections: [{ properties: {}, children: children }]
    });

    docx.Packer.toBlob(doc).then(function(blob) {
      DocGenerator._downloadFile(blob, filename + '.docx');
    });
  },

  generateStrategicAccountExcel: function(filename, data) {
    var rows = [
      ['Strategic Account Canvas'],
      ['Account', data.accountName || ''],
      ['Tier', data.accountTier || ''],
      [],
      ['Section', 'Details'],
      ['Current Footprint', data.currentFootprint || ''],
      ['Whitespace Opportunities', data.whitespace || ''],
      ['Key Stakeholders', data.stakeholders || ''],
      ['90-Day Action Plan', data.actionPlan || '']
    ];

    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Strategic Account');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateStrategicAccountPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Strategic Account Canvas', 105, y, { align: 'center' });
    y += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text((data.accountName || '') + ' — ' + (data.accountTier || ''), 105, y, { align: 'center' });
    y += 15;

    var sections = [
      { title: 'Current Footprint', value: data.currentFootprint },
      { title: 'Whitespace Opportunities', value: data.whitespace },
      { title: 'Key Stakeholders', value: data.stakeholders },
      { title: '90-Day Action Plan', value: data.actionPlan }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(14);
      pdf.setTextColor(...DocStyles.rgb.navy);
      pdf.text(s.title, 14, y);
      y += 2;
      pdf.setDrawColor(...DocStyles.rgb.teal);
      pdf.line(14, y, 80, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 180);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 14, y);
        y += 6;
      });
      y += 6;
    });

    pdf.save(filename + '.pdf');
  },

  generateStrategicAccountPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    // Title slide
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Strategic Account Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText((data.accountName || '') + ' — ' + (data.accountTier || ''), { x: 0.5, y: 2.8, w: 9, h: 0.6, fontSize: 16, color: colors.teal, align: 'center' });

    // Footprint & Whitespace
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide2.addText('Footprint & Expansion', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide2.addText('Current Footprint', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.currentFootprint || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Whitespace Opportunities', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.whitespace || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Stakeholders & Actions
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide3.addText('Stakeholders & Action Plan', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide3.addText('Key Stakeholders', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.stakeholders || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('90-Day Action Plan', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.actionPlan || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // Ethics & Reputation Canvas — Word / Excel / PDF / PPTX
  // ============================================================

  generateEthicsReputationWord: function(filename, data) {
    var children = [];
    children.push(new docx.Paragraph({ text: 'Ethics & Reputation Canvas', heading: docx.HeadingLevel.TITLE }));
    children.push(new docx.Paragraph({ text: data.teamName || '', spacing: { after: 200 } }));

    var sections = [
      { title: 'Core Ethical Principles', value: data.principles },
      { title: 'Trust-Building Commitments', value: data.trustCommitments },
      { title: 'Reputation Strategy', value: data.reputationStrategy },
      { title: 'Ethical Boundaries', value: data.boundaries },
      { title: 'Legacy Goals', value: data.legacyGoals }
    ];

    sections.forEach(function(s) {
      children.push(new docx.Paragraph({ text: s.title, heading: docx.HeadingLevel.HEADING_2, spacing: { before: 300 } }));
      var lines = (s.value || 'N/A').split('\n');
      lines.forEach(function(line) {
        children.push(new docx.Paragraph({ text: line, spacing: { after: 80 } }));
      });
    });

    var doc = new docx.Document({
      sections: [{ properties: {}, children: children }]
    });

    docx.Packer.toBlob(doc).then(function(blob) {
      DocGenerator._downloadFile(blob, filename + '.docx');
    });
  },

  generateEthicsReputationExcel: function(filename, data) {
    var rows = [
      ['Ethics & Reputation Canvas'],
      ['Name / Team', data.teamName || ''],
      [],
      ['Section', 'Details'],
      ['Core Ethical Principles', data.principles || ''],
      ['Trust-Building Commitments', data.trustCommitments || ''],
      ['Reputation Strategy', data.reputationStrategy || ''],
      ['Ethical Boundaries', data.boundaries || ''],
      ['Legacy Goals', data.legacyGoals || '']
    ];

    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ethics Reputation');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEthicsReputationPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Ethics & Reputation Canvas', 105, y, { align: 'center' });
    y += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(...DocStyles.rgb.teal);
    pdf.text(data.teamName || '', 105, y, { align: 'center' });
    y += 15;

    var sections = [
      { title: 'Core Ethical Principles', value: data.principles },
      { title: 'Trust-Building Commitments', value: data.trustCommitments },
      { title: 'Reputation Strategy', value: data.reputationStrategy },
      { title: 'Ethical Boundaries', value: data.boundaries },
      { title: 'Legacy Goals', value: data.legacyGoals }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(14);
      pdf.setTextColor(...DocStyles.rgb.navy);
      pdf.text(s.title, 14, y);
      y += 2;
      pdf.setDrawColor(...DocStyles.rgb.teal);
      pdf.line(14, y, 80, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 180);
      lines.forEach(function(line) {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.text(line, 14, y);
        y += 6;
      });
      y += 6;
    });

    pdf.save(filename + '.pdf');
  },

  generateEthicsReputationPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    // Title slide
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Ethics & Reputation Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.teamName || '', { x: 0.5, y: 2.8, w: 9, h: 0.6, fontSize: 16, color: colors.teal, align: 'center' });

    // Principles & Trust
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide2.addText('Principles & Trust', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide2.addText('Core Ethical Principles', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.principles || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Trust-Building Commitments', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.trustCommitments || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Reputation & Boundaries
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: colors.teal } });
    slide3.addText('Reputation & Boundaries', { x: 0.4, y: 0.6, w: 9, h: 0.5, fontSize: 20, color: colors.navy, bold: true });
    slide3.addText('Reputation Strategy', { x: 0.4, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.reputationStrategy || '', { x: 0.4, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Ethical Boundaries', { x: 5.1, y: 1.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.boundaries || '', { x: 5.1, y: 1.6, w: 4.3, h: 3.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // CHANNEL STRATEGY — Word, Excel, PDF, PPTX
  // ============================================================

  generateChannelStrategyWord: function(filename, data) {
    var sections = [
      { heading: 'Channel Strategy Canvas', content: [
        'Company: ' + (data.companyName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Channel Types & Architecture', content: data.channelTypes || 'Not specified' },
      { heading: 'Ideal Partner Profile', content: data.partnerProfile || 'Not specified' },
      { heading: 'Enablement Plan', content: data.enablementPlan || 'Not specified' },
      { heading: 'Incentive Structure', content: data.incentives || 'Not specified' },
      { heading: 'Success Metrics', content: data.metrics || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Channel Strategy Canvas', author: data.authorName || '', sections: sections });
  },

  generateChannelStrategyExcel: function(filename, data) {
    var rows = [
      ['Channel Strategy Canvas'],
      ['Company', data.companyName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Channel Types & Architecture', data.channelTypes || ''],
      ['Ideal Partner Profile', data.partnerProfile || ''],
      ['Enablement Plan', data.enablementPlan || ''],
      ['Incentive Structure', data.incentives || ''],
      ['Success Metrics', data.metrics || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Channel Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateChannelStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Channel Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Company: ' + (data.companyName || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'Channel Types & Architecture', content: data.channelTypes },
      { title: 'Ideal Partner Profile', content: data.partnerProfile },
      { title: 'Enablement Plan', content: data.enablementPlan },
      { title: 'Incentive Structure', content: data.incentives },
      { title: 'Success Metrics', content: data.metrics }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13); pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateChannelStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    // Title slide
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Channel Strategy Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.8, w: 9, h: 0.6, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 3.6, w: 9, h: 0.4, fontSize: 12, color: colors.gray, align: 'center' });

    // Channel Architecture slide
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Channel Architecture & Partners', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Channel Types', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.channelTypes || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Ideal Partner Profile', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.partnerProfile || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Enablement & Incentives slide
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Enablement & Incentives', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Enablement Plan', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.enablementPlan || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Incentive Structure', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.incentives || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Metrics slide
    var slide4 = pptx.addSlide();
    slide4.background = { color: colors.navy };
    slide4.addText('Success Metrics', { x: 0.5, y: 0.8, w: 9, h: 0.6, fontSize: 24, color: colors.teal, bold: true, align: 'center' });
    slide4.addText(data.metrics || '', { x: 0.8, y: 1.6, w: 8.4, h: 3.5, fontSize: 14, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // CAPSTONE STRATEGY — Word, Excel, PDF, PPTX
  // ============================================================

  generateCapstoneStrategyWord: function(filename, data) {
    var sections = [
      { heading: 'Capstone Sales Strategy', content: [
        'Company: ' + (data.companyName || 'N/A'),
        'Sales Context: ' + (data.salesContext || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Sales Process Summary', content: data.salesProcess || 'Not specified' },
      { heading: 'Team & Organization', content: data.teamOrganization || 'Not specified' },
      { heading: 'Key Metrics & Targets', content: data.metricsTargets || 'Not specified' },
      { heading: 'Risks & Contingencies', content: data.risksContingencies || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Capstone Sales Strategy', author: data.authorName || '', sections: sections });
  },

  generateCapstoneStrategyExcel: function(filename, data) {
    var rows = [
      ['Capstone Sales Strategy'],
      ['Company', data.companyName || ''],
      ['Sales Context', data.salesContext || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Sales Process Summary', data.salesProcess || ''],
      ['Team & Organization', data.teamOrganization || ''],
      ['Key Metrics & Targets', data.metricsTargets || ''],
      ['Risks & Contingencies', data.risksContingencies || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Capstone Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCapstoneStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Capstone Sales Strategy', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text((data.companyName || '') + ' — ' + (data.salesContext || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'Sales Process Summary', content: data.salesProcess },
      { title: 'Team & Organization', content: data.teamOrganization },
      { title: 'Key Metrics & Targets', content: data.metricsTargets },
      { title: 'Risks & Contingencies', content: data.risksContingencies }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13); pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateCapstoneStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    // Title slide
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Capstone Sales Strategy', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.6, w: 9, h: 0.6, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addText(data.salesContext || 'Sales Context', { x: 0.5, y: 3.3, w: 9, h: 0.5, fontSize: 14, color: colors.gray, align: 'center' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 4.0, w: 9, h: 0.4, fontSize: 12, color: colors.gray, align: 'center' });

    // Process & Team slide
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Sales Process & Team', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Sales Process', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.salesProcess || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Team & Organization', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.teamOrganization || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Metrics & Risks slide
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Metrics & Risk Mitigation', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Key Metrics & Targets', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.metricsTargets || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Risks & Contingencies', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.risksContingencies || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
});
