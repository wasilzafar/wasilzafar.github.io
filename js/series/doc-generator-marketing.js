/**
 * Doc Generator - Marketing Strategy Series
 * Extends DocGenerator with marketing strategy series document generators.
 * Requires: doc-generator-core.js loaded first.
 */
Object.assign(DocGenerator, {
  // MARKETING STRATEGY CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  generateMarketingStrategyWord: function(filename, data) {
    var sections = [
      { heading: 'Marketing Strategy Canvas', content: [
        'Company: ' + (data.companyName || 'N/A'),
        'Industry: ' + (data.industry || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Target Segment', content: data.targetSegment || 'Not specified' },
      { heading: 'Customer Pain Points', content: data.customerPain || 'Not specified' },
      { heading: 'Positioning Statement', content: data.positioning || 'Not specified' },
      { heading: 'Value Proposition', content: data.valueProp || 'Not specified' },
      { heading: 'Competitive Landscape', content: data.competitors || 'Not specified' },
      { heading: 'Marketing Channels', content: data.channels || 'Not specified' },
      { heading: 'Key Metrics & KPIs', content: data.metrics || 'Not specified' },
      { heading: 'Growth Strategy', content: data.growthStrategy || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Marketing Strategy Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateMarketingStrategyExcel: function(filename, data) {
    var rows = [
      ['Marketing Strategy Canvas'],
      ['Company', data.companyName || ''],
      ['Industry', data.industry || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Target Segment', data.targetSegment || ''],
      ['Customer Pain Points', data.customerPain || ''],
      ['Positioning Statement', data.positioning || ''],
      ['Value Proposition', data.valueProp || ''],
      ['Competitive Landscape', data.competitors || ''],
      ['Marketing Channels', data.channels || ''],
      ['Key Metrics & KPIs', data.metrics || ''],
      ['Growth Strategy', data.growthStrategy || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marketing Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMarketingStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Marketing Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text((data.companyName || '') + ' — ' + (data.industry || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'Target Segment', content: data.targetSegment },
      { title: 'Customer Pain Points', content: data.customerPain },
      { title: 'Positioning Statement', content: data.positioning },
      { title: 'Value Proposition', content: data.valueProp },
      { title: 'Competitive Landscape', content: data.competitors },
      { title: 'Marketing Channels', content: data.channels },
      { title: 'Key Metrics & KPIs', content: data.metrics },
      { title: 'Growth Strategy', content: data.growthStrategy }
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

  generateMarketingStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    // Title slide
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Marketing Strategy Canvas', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.6, w: 9, h: 0.6, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addText(data.industry || 'Industry', { x: 0.5, y: 3.3, w: 9, h: 0.5, fontSize: 14, color: colors.gray, align: 'center' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 4.0, w: 9, h: 0.4, fontSize: 12, color: colors.gray, align: 'center' });

    // Targeting & Positioning slide
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Targeting & Positioning', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Target Segment', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.targetSegment || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Customer Pain Points', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.customerPain || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Positioning Statement', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.positioning || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Value Proposition', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.valueProp || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Channels & Competition slide
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Channels & Competition', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Competitive Landscape', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.competitors || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Marketing Channels', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.channels || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Metrics & Growth slide
    var slide4 = pptx.addSlide();
    slide4.background = { color: colors.navy };
    slide4.addText('Metrics & Growth Strategy', { x: 0.5, y: 0.5, w: 9, h: 0.6, fontSize: 24, color: colors.teal, bold: true, align: 'center' });
    slide4.addText('Key Metrics & KPIs', { x: 0.5, y: 1.4, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.metrics || '', { x: 0.5, y: 1.8, w: 4.3, h: 3.2, fontSize: 12, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });
    slide4.addText('Growth Strategy', { x: 5.2, y: 1.4, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.growthStrategy || '', { x: 5.2, y: 1.8, w: 4.3, h: 3.2, fontSize: 12, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // BUYER PSYCHOLOGY AUDIT — Word, Excel, PDF, PPTX
  // ============================================================

  generateBuyerPsychologyWord: function(filename, data) {
    var sections = [
      { heading: 'Buyer Psychology Audit', content: [
        'Company: ' + (data.companyName || 'N/A'),
        'Target Audience: ' + (data.targetAudience || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'System 1 Triggers Used', content: data.system1Triggers || 'Not specified' },
      { heading: 'System 2 Content Available', content: data.system2Content || 'Not specified' },
      { heading: 'Trust Signals Deployed', content: data.trustSignals || 'Not specified' },
      { heading: 'Cognitive Biases Leveraged', content: data.cognitiveBiases || 'Not specified' },
      { heading: 'Pricing Psychology Tactics', content: data.pricingStrategy || 'Not specified' },
      { heading: 'Improvement Opportunities', content: data.improvements || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Buyer Psychology Audit', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateBuyerPsychologyExcel: function(filename, data) {
    var rows = [
      ['Buyer Psychology Audit'],
      ['Company', data.companyName || ''],
      ['Target Audience', data.targetAudience || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['System 1 Triggers Used', data.system1Triggers || ''],
      ['System 2 Content Available', data.system2Content || ''],
      ['Trust Signals Deployed', data.trustSignals || ''],
      ['Cognitive Biases Leveraged', data.cognitiveBiases || ''],
      ['Pricing Psychology Tactics', data.pricingStrategy || ''],
      ['Improvement Opportunities', data.improvements || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Buyer Psychology Audit');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateBuyerPsychologyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Buyer Psychology Audit', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text((data.companyName || '') + ' — ' + (data.targetAudience || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'System 1 Triggers Used', content: data.system1Triggers },
      { title: 'System 2 Content Available', content: data.system2Content },
      { title: 'Trust Signals Deployed', content: data.trustSignals },
      { title: 'Cognitive Biases Leveraged', content: data.cognitiveBiases },
      { title: 'Pricing Psychology Tactics', content: data.pricingStrategy },
      { title: 'Improvement Opportunities', content: data.improvements }
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

  generateBuyerPsychologyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Buyer Psychology Audit', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.6, w: 9, h: 0.6, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addText(data.targetAudience || '', { x: 0.5, y: 3.3, w: 9, h: 0.5, fontSize: 14, color: colors.gray, align: 'center' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 4.0, w: 9, h: 0.4, fontSize: 12, color: colors.gray, align: 'center' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('System 1 & System 2 Analysis', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('System 1 Triggers', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.system1Triggers || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('System 2 Content', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.system2Content || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Trust & Bias Strategy', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Trust Signals', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.trustSignals || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Cognitive Biases', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.cognitiveBiases || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide4 = pptx.addSlide();
    slide4.background = { color: colors.navy };
    slide4.addText('Pricing & Improvement Plan', { x: 0.5, y: 0.5, w: 9, h: 0.6, fontSize: 24, color: colors.teal, bold: true, align: 'center' });
    slide4.addText('Pricing Psychology', { x: 0.5, y: 1.4, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.pricingStrategy || '', { x: 0.5, y: 1.8, w: 4.3, h: 3.2, fontSize: 12, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });
    slide4.addText('Improvements', { x: 5.2, y: 1.4, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.improvements || '', { x: 5.2, y: 1.8, w: 4.3, h: 3.2, fontSize: 12, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // BRAND BUILDING CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  generateBrandCanvasWord: function(filename, data) {
    var sections = [
      { heading: 'Brand Building Canvas', content: [
        'Brand: ' + (data.brandName || 'N/A'),
        'Industry: ' + (data.industry || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Mission Statement', content: data.mission || 'Not specified' },
      { heading: 'Core Values', content: data.values || 'Not specified' },
      { heading: 'Brand Personality', content: data.personality || 'Not specified' },
      { heading: 'Target Audience', content: data.targetAudience || 'Not specified' },
      { heading: 'Positioning Statement', content: data.positioning || 'Not specified' },
      { heading: 'Key Differentiators', content: data.differentiators || 'Not specified' },
      { heading: 'Voice & Tone', content: data.voiceTone || 'Not specified' },
      { heading: 'Brand Story', content: data.brandStory || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Brand Building Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateBrandCanvasExcel: function(filename, data) {
    var rows = [
      ['Brand Building Canvas'],
      ['Brand Name', data.brandName || ''],
      ['Industry', data.industry || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Mission Statement', data.mission || ''],
      ['Core Values', data.values || ''],
      ['Brand Personality', data.personality || ''],
      ['Target Audience', data.targetAudience || ''],
      ['Positioning Statement', data.positioning || ''],
      ['Key Differentiators', data.differentiators || ''],
      ['Voice & Tone', data.voiceTone || ''],
      ['Brand Story', data.brandStory || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Brand Canvas');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateBrandCanvasPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Brand Building Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text((data.brandName || '') + ' — ' + (data.industry || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'Mission Statement', content: data.mission },
      { title: 'Core Values', content: data.values },
      { title: 'Brand Personality', content: data.personality },
      { title: 'Target Audience', content: data.targetAudience },
      { title: 'Positioning Statement', content: data.positioning },
      { title: 'Key Differentiators', content: data.differentiators },
      { title: 'Voice & Tone', content: data.voiceTone },
      { title: 'Brand Story', content: data.brandStory }
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

  generateBrandCanvasPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Brand Building Canvas', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.brandName || 'Brand', { x: 0.5, y: 2.6, w: 9, h: 0.6, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addText(data.industry || '', { x: 0.5, y: 3.3, w: 9, h: 0.5, fontSize: 14, color: colors.gray, align: 'center' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 4.0, w: 9, h: 0.4, fontSize: 12, color: colors.gray, align: 'center' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Brand Identity & Values', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Mission', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.mission || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Core Values', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.values || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Personality', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.personality || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Target Audience', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.targetAudience || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Positioning & Differentiation', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Positioning Statement', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.positioning || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Key Differentiators', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.differentiators || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide4 = pptx.addSlide();
    slide4.background = { color: colors.navy };
    slide4.addText('Voice & Brand Story', { x: 0.5, y: 0.5, w: 9, h: 0.6, fontSize: 24, color: colors.teal, bold: true, align: 'center' });
    slide4.addText('Voice & Tone', { x: 0.5, y: 1.4, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.voiceTone || '', { x: 0.5, y: 1.8, w: 4.3, h: 3.2, fontSize: 12, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });
    slide4.addText('Brand Story', { x: 5.2, y: 1.4, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.brandStory || '', { x: 5.2, y: 1.8, w: 4.3, h: 3.2, fontSize: 12, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // SEO AUDIT CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  generateSeoAuditWord: function(filename, data) {
    var sections = [
      { heading: 'SEO Audit Canvas', content: [
        'Site URL: ' + (data.siteUrl || 'N/A'),
        'Industry: ' + (data.industry || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Target Keywords', content: data.targetKeywords || 'Not specified' },
      { heading: 'Current Rankings', content: data.currentRankings || 'Not specified' },
      { heading: 'Technical Issues', content: data.technicalIssues || 'Not specified' },
      { heading: 'Content Gaps', content: data.contentGaps || 'Not specified' },
      { heading: 'Backlink Profile', content: data.backlinkProfile || 'Not specified' },
      { heading: 'Local SEO Presence', content: data.localPresence || 'Not specified' },
      { heading: 'Top Competitors', content: data.competitors || 'Not specified' },
      { heading: 'Priority Action Plan', content: data.actionPlan || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'SEO Audit Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateSeoAuditExcel: function(filename, data) {
    var rows = [
      ['SEO Audit Canvas'],
      ['Site URL', data.siteUrl || ''],
      ['Industry', data.industry || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Target Keywords', data.targetKeywords || ''],
      ['Current Rankings', data.currentRankings || ''],
      ['Technical Issues', data.technicalIssues || ''],
      ['Content Gaps', data.contentGaps || ''],
      ['Backlink Profile', data.backlinkProfile || ''],
      ['Local SEO Presence', data.localPresence || ''],
      ['Top Competitors', data.competitors || ''],
      ['Priority Action Plan', data.actionPlan || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SEO Audit');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSeoAuditPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('SEO Audit Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text((data.siteUrl || '') + ' — ' + (data.industry || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'Target Keywords', content: data.targetKeywords },
      { title: 'Current Rankings', content: data.currentRankings },
      { title: 'Technical Issues', content: data.technicalIssues },
      { title: 'Content Gaps', content: data.contentGaps },
      { title: 'Backlink Profile', content: data.backlinkProfile },
      { title: 'Local SEO Presence', content: data.localPresence },
      { title: 'Top Competitors', content: data.competitors },
      { title: 'Priority Action Plan', content: data.actionPlan }
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

  generateSeoAuditPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('SEO Audit Canvas', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.siteUrl || 'Website', { x: 0.5, y: 2.6, w: 9, h: 0.6, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addText(data.industry || '', { x: 0.5, y: 3.3, w: 9, h: 0.5, fontSize: 14, color: colors.gray, align: 'center' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Keywords & Rankings', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Target Keywords', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.targetKeywords || '', { x: 0.5, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Current Rankings', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.currentRankings || '', { x: 5.2, y: 1.4, w: 4.3, h: 3.8, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Technical & Content Analysis', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Technical Issues', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.technicalIssues || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Content Gaps', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.contentGaps || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Backlink Profile', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.backlinkProfile || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Local SEO', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.localPresence || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide4 = pptx.addSlide();
    slide4.background = { color: colors.navy };
    slide4.addText('Competitors & Action Plan', { x: 0.5, y: 0.5, w: 9, h: 0.6, fontSize: 24, color: colors.teal, bold: true, align: 'center' });
    slide4.addText('Top Competitors', { x: 0.5, y: 1.4, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.competitors || '', { x: 0.5, y: 1.8, w: 4.3, h: 3.2, fontSize: 12, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });
    slide4.addText('Priority Action Plan', { x: 5.2, y: 1.4, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide4.addText(data.actionPlan || '', { x: 5.2, y: 1.8, w: 4.3, h: 3.2, fontSize: 12, color: colors.white, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // SOCIAL STRATEGY CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  generateSocialStrategyWord: function(filename, data) {
    var sections = [
      { heading: 'Social Media Strategy Canvas', content: [
        'Company: ' + (data.companyName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Target Platforms', content: data.platforms || 'Not specified' },
      { heading: 'Target Audience', content: data.audience || 'Not specified' },
      { heading: 'Content Pillars', content: data.contentPillars || 'Not specified' },
      { heading: 'Posting Cadence', content: data.postingCadence || 'Not specified' },
      { heading: 'Community Strategy', content: data.communityStrategy || 'Not specified' },
      { heading: 'Influencer Plan', content: data.influencerPlan || 'Not specified' },
      { heading: 'Engagement Tactics', content: data.engagementTactics || 'Not specified' },
      { heading: 'Key Metrics', content: data.metrics || 'Not specified' },
      { heading: '90-Day Growth Goals', content: data.growthGoals || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Social Media Strategy Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateSocialStrategyExcel: function(filename, data) {
    var rows = [
      ['Social Media Strategy Canvas'],
      ['Company', data.companyName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Target Platforms', data.platforms || ''],
      ['Target Audience', data.audience || ''],
      ['Content Pillars', data.contentPillars || ''],
      ['Posting Cadence', data.postingCadence || ''],
      ['Community Strategy', data.communityStrategy || ''],
      ['Influencer Plan', data.influencerPlan || ''],
      ['Engagement Tactics', data.engagementTactics || ''],
      ['Key Metrics', data.metrics || ''],
      ['90-Day Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Social Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSocialStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Social Media Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text(data.companyName || '', 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'Target Platforms', content: data.platforms },
      { title: 'Target Audience', content: data.audience },
      { title: 'Content Pillars', content: data.contentPillars },
      { title: 'Posting Cadence', content: data.postingCadence },
      { title: 'Community Strategy', content: data.communityStrategy },
      { title: 'Influencer Plan', content: data.influencerPlan },
      { title: 'Engagement Tactics', content: data.engagementTactics },
      { title: 'Key Metrics', content: data.metrics },
      { title: '90-Day Growth Goals', content: data.growthGoals }
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

  generateSocialStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Social Media Strategy Canvas', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.6, w: 9, h: 0.6, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 12, color: colors.gray, align: 'center' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Platforms & Content', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Target Platforms', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.platforms || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Content Pillars', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.contentPillars || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Posting Cadence', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.postingCadence || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Target Audience', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.audience || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Community & Influencer', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Community Strategy', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.communityStrategy || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Influencer Plan', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.influencerPlan || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Engagement Tactics', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.engagementTactics || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('90-Day Goals & Metrics', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText((data.growthGoals || '') + '\n\nMetrics: ' + (data.metrics || ''), { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // CONTENT STRATEGY CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  generateContentStrategyWord: function(filename, data) {
    var sections = [
      { heading: 'Content Strategy Canvas', content: [
        'Company: ' + (data.companyName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Target Audience', content: data.audience || 'Not specified' },
      { heading: 'Content Pillars', content: data.contentPillars || 'Not specified' },
      { heading: 'Content Formats', content: data.contentFormats || 'Not specified' },
      { heading: 'Distribution Channels', content: data.distribution || 'Not specified' },
      { heading: 'Editorial Cadence', content: data.editorialCadence || 'Not specified' },
      { heading: 'Competitor Content Gaps', content: data.competitorGaps || 'Not specified' },
      { heading: 'Success Metrics', content: data.successMetrics || 'Not specified' },
      { heading: 'Team & Budget', content: data.teamResources || 'Not specified' },
      { heading: '90-Day Content Goals', content: data.contentGoals || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Content Strategy Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateContentStrategyExcel: function(filename, data) {
    var rows = [
      ['Content Strategy Canvas'],
      ['Company', data.companyName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Section', 'Details'],
      ['Target Audience', data.audience || ''],
      ['Content Pillars', data.contentPillars || ''],
      ['Content Formats', data.contentFormats || ''],
      ['Distribution Channels', data.distribution || ''],
      ['Editorial Cadence', data.editorialCadence || ''],
      ['Competitor Content Gaps', data.competitorGaps || ''],
      ['Success Metrics', data.successMetrics || ''],
      ['Team & Budget', data.teamResources || ''],
      ['90-Day Content Goals', data.contentGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Content Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateContentStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Content Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text(data.companyName || '', 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(...DocStyles.rgb.gray);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'Target Audience', content: data.audience },
      { title: 'Content Pillars', content: data.contentPillars },
      { title: 'Content Formats', content: data.contentFormats },
      { title: 'Distribution Channels', content: data.distribution },
      { title: 'Editorial Cadence', content: data.editorialCadence },
      { title: 'Competitor Content Gaps', content: data.competitorGaps },
      { title: 'Success Metrics', content: data.successMetrics },
      { title: 'Team & Budget', content: data.teamResources },
      { title: '90-Day Content Goals', content: data.contentGoals }
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

  generateContentStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Content Strategy Canvas', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.6, w: 9, h: 0.6, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 12, color: colors.gray, align: 'center' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Audience & Pillars', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Target Audience', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.audience || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Content Pillars', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.contentPillars || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Formats & Cadence', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.contentFormats || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Distribution', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.distribution || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Gaps, Metrics & Goals', { x: 0.4, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Competitor Gaps', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.competitorGaps || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Success Metrics', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.successMetrics || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Team & Budget', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.teamResources || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('90-Day Goals', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.contentGoals || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // EMAIL STRATEGY CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  generateEmailStrategyWord: function(filename, data) {
    var docxLib = window.docx.default || window.docx;
    var sections = [
      { label: 'Company / Brand', value: data.companyName },
      { label: 'List Size & Growth', value: data.listSize },
      { label: 'Segments & Personas', value: data.segments },
      { label: 'Welcome Sequence', value: data.welcomeSequence },
      { label: 'Nurture Flows', value: data.nurtureFlows },
      { label: 'Lifecycle Emails', value: data.lifecycleEmails },
      { label: 'Deliverability & Auth', value: data.deliverability },
      { label: 'Tech Stack & CRM', value: data.techStack },
      { label: 'Key Metrics & KPIs', value: data.metrics },
      { label: 'Growth Goals', value: data.growthGoals }
    ];
    var rows = [];
    sections.forEach(function(s) {
      rows.push(new docxLib.TableRow({ children: [
        new docxLib.TableCell({ children: [new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: s.label, bold: true, size: 22, color: DocStyles.colors.crimson })] })], width: { size: 28, type: docxLib.WidthType.PERCENTAGE } }),
        new docxLib.TableCell({ children: [new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: s.value || '', size: 22 })] })], width: { size: 72, type: docxLib.WidthType.PERCENTAGE } })
      ] }));
    });
    var contentChildren = [
      new docxLib.Table({ rows: rows })
    ];
    DocStyles.docxPackage(filename, 'Email Strategy Canvas', 'Generated from wasilzafar.com', contentChildren);
  },

  generateEmailStrategyExcel: function(filename, data) {
    var rows = [
      ['Email Strategy Canvas'],
      ['Company', data.companyName || ''],
      [''],
      ['Field', 'Details'],
      ['List Size & Growth', data.listSize || ''],
      ['Segments & Personas', data.segments || ''],
      ['Welcome Sequence', data.welcomeSequence || ''],
      ['Nurture Flows', data.nurtureFlows || ''],
      ['Lifecycle Emails', data.lifecycleEmails || ''],
      ['Deliverability & Auth', data.deliverability || ''],
      ['Tech Stack & CRM', data.techStack || ''],
      ['Key Metrics & KPIs', data.metrics || ''],
      ['Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Email Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEmailStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Email Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(12); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Company: ' + (data.companyName || ''), 20, y); y += 14;
    var sections = [
      { label: 'List Size & Growth', value: data.listSize },
      { label: 'Segments & Personas', value: data.segments },
      { label: 'Welcome Sequence', value: data.welcomeSequence },
      { label: 'Nurture Flows', value: data.nurtureFlows },
      { label: 'Lifecycle Emails', value: data.lifecycleEmails },
      { label: 'Deliverability & Auth', value: data.deliverability },
      { label: 'Tech Stack & CRM', value: data.techStack },
      { label: 'Key Metrics & KPIs', value: data.metrics },
      { label: 'Growth Goals', value: data.growthGoals }
    ];
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12); pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.label, 20, y); y += 7;
      pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 6;
    });
    pdf.save(filename + '.pdf');
  },

  generateEmailStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    // Slide 1 — Title
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Email Strategy Canvas', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.companyName || 'Company Name', { x: 0.5, y: 2.6, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 3.6, w: 3, h: 0.05, fill: { color: colors.crimson } });

    // Slide 2 — Acquisition & Nurture
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Acquisition & Nurture Strategy', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('List Size & Growth', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.listSize || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Segments & Personas', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.segments || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Welcome Sequence', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.welcomeSequence || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Nurture Flows', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.nurtureFlows || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    // Slide 3 — Operations & Metrics
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Operations & Metrics', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Lifecycle Emails', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.lifecycleEmails || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Deliverability & Auth', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.deliverability || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Tech Stack & CRM', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.techStack || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Growth Goals', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.growthGoals || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // AD CAMPAIGN STRATEGY CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  generateAdCampaignWord: function(filename, data) {
    var docxLib = window.docx.default || window.docx;
    var sections = [
      { label: 'Company / Brand', value: data.companyName },
      { label: 'Advertising Platforms', value: data.platforms },
      { label: 'Monthly Budget & Allocation', value: data.budget },
      { label: 'Target Audience', value: data.targetAudience },
      { label: 'Campaign Objectives', value: data.campaignObjective },
      { label: 'Ad Creative Strategy', value: data.adCreative },
      { label: 'Bidding Strategy', value: data.biddingStrategy },
      { label: 'Retargeting Plan', value: data.retargeting },
      { label: 'Key Metrics & KPIs', value: data.metrics },
      { label: 'Growth Goals', value: data.growthGoals }
    ];
    var rows = [];
    sections.forEach(function(s) {
      rows.push(new docxLib.TableRow({ children: [
        new docxLib.TableCell({ children: [new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: s.label, bold: true, size: 22, color: DocStyles.colors.crimson })] })], width: { size: 28, type: docxLib.WidthType.PERCENTAGE } }),
        new docxLib.TableCell({ children: [new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: s.value || '', size: 22 })] })], width: { size: 72, type: docxLib.WidthType.PERCENTAGE } })
      ] }));
    });
    var contentChildren = [
      new docxLib.Table({ rows: rows })
    ];
    DocStyles.docxPackage(filename, 'Ad Campaign Strategy Canvas', 'Generated from wasilzafar.com', contentChildren);
  },

  generateAdCampaignExcel: function(filename, data) {
    var rows = [
      ['Ad Campaign Strategy Canvas'],
      ['Company', data.companyName || ''],
      [''],
      ['Field', 'Details'],
      ['Advertising Platforms', data.platforms || ''],
      ['Monthly Budget & Allocation', data.budget || ''],
      ['Target Audience', data.targetAudience || ''],
      ['Campaign Objectives', data.campaignObjective || ''],
      ['Ad Creative Strategy', data.adCreative || ''],
      ['Bidding Strategy', data.biddingStrategy || ''],
      ['Retargeting Plan', data.retargeting || ''],
      ['Key Metrics & KPIs', data.metrics || ''],
      ['Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ad Campaign');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAdCampaignPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    var y = 20;
    pdf.setFontSize(20); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Ad Campaign Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(12); pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text('Company: ' + (data.companyName || ''), 20, y); y += 14;
    var sections = [
      { label: 'Advertising Platforms', value: data.platforms },
      { label: 'Monthly Budget & Allocation', value: data.budget },
      { label: 'Target Audience', value: data.targetAudience },
      { label: 'Campaign Objectives', value: data.campaignObjective },
      { label: 'Ad Creative Strategy', value: data.adCreative },
      { label: 'Bidding Strategy', value: data.biddingStrategy },
      { label: 'Retargeting Plan', value: data.retargeting },
      { label: 'Key Metrics & KPIs', value: data.metrics },
      { label: 'Growth Goals', value: data.growthGoals }
    ];
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12); pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.label, 20, y); y += 7;
      pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 6;
    });
    pdf.save(filename + '.pdf');
  },

  generateAdCampaignPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Ad Campaign Strategy Canvas', { x: 0.5, y: 1.3, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center' });
    slide1.addText(data.companyName || 'Company Name', { x: 0.5, y: 2.6, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center' });
    slide1.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 3.6, w: 3, h: 0.05, fill: { color: colors.crimson } });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Targeting & Budget', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Platforms', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.platforms || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Budget & Allocation', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.budget || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Target Audience', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.targetAudience || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Campaign Objectives', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.campaignObjective || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Creative & Optimization', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Ad Creative Strategy', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.adCreative || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Bidding Strategy', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.biddingStrategy || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Retargeting Plan', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.retargeting || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Growth Goals', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.growthGoals || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // INTEGRATED MARKETING CAPSTONE CANVAS
  // ============================================================

  generateIntegratedCapstoneWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'INTEGRATED MARKETING STRATEGY CAPSTONE', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), bold: true, size: 24 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Business Model', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.businessModel || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Target Audience & Buyer Persona', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.targetAudience || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Channel Strategy', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelStrategy || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Launch / GTM Plan', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.launchPlan || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Engine & Loops', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthEngine || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Measurement Framework', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.measurement || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Budget Allocation', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.budget || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Implementation Timeline', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.timeline || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals & Success Metrics', bold: true, size: 22, color: DocStyles.colors.blue })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'Not specified' })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateIntegratedCapstoneExcel: function(filename, data) {
    var rows = [
      ['INTEGRATED MARKETING STRATEGY CAPSTONE', ''],
      ['Company', data.companyName || ''],
      ['', ''],
      ['Business Model', data.businessModel || ''],
      ['Target Audience', data.targetAudience || ''],
      ['Channel Strategy', data.channelStrategy || ''],
      ['Launch / GTM Plan', data.launchPlan || ''],
      ['Growth Engine', data.growthEngine || ''],
      ['Measurement Framework', data.measurement || ''],
      ['Budget Allocation', data.budget || ''],
      ['Implementation Timeline', data.timeline || ''],
      ['Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Integrated Capstone');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateIntegratedCapstonePDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('INTEGRATED MARKETING STRATEGY CAPSTONE', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.black);
    pdf.text('Company: ' + (data.companyName || ''), 20, 38);
    var sections = [
      { label: 'Business Model', value: data.businessModel },
      { label: 'Target Audience', value: data.targetAudience },
      { label: 'Channel Strategy', value: data.channelStrategy },
      { label: 'Launch / GTM Plan', value: data.launchPlan },
      { label: 'Growth Engine', value: data.growthEngine },
      { label: 'Measurement Framework', value: data.measurement },
      { label: 'Budget Allocation', value: data.budget },
      { label: 'Implementation Timeline', value: data.timeline },
      { label: 'Growth Goals', value: data.growthGoals }
    ];
    var y = 52;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(s.label, 20, y);
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.value || 'Not specified', 170);
      pdf.text(lines, 20, y + 7);
      y += 7 + lines.length * 6 + 8;
    });
    pdf.save(filename + '.pdf');
  },

  generateIntegratedCapstonePPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;
    pptx.title = 'Integrated Marketing Strategy Capstone';
    pptx.author = 'Marketing Strategy Series';
    // Slide 1 – Title
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Integrated Marketing Strategy Capstone', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center', fontFace: DocStyles.fonts.secondary });
    slide1.addText(data.companyName || 'Company Name', { x: 0.5, y: 3.0, w: 9, h: 0.8, fontSize: 22, color: colors.teal, align: 'center', fontFace: DocStyles.fonts.secondary });
    // Slide 2 – Strategy Overview
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Strategy Overview', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText('Business Model', { x: 0.4, y: 0.9, w: 4.2, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.businessModel || 'Not specified', { x: 0.4, y: 1.3, w: 4.2, h: 1.5, fontSize: 11, color: colors.gray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Target Audience', { x: 5.2, y: 0.9, w: 4.4, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.targetAudience || 'Not specified', { x: 5.2, y: 1.3, w: 4.4, h: 1.5, fontSize: 11, color: colors.gray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Channel Strategy', { x: 0.4, y: 3.0, w: 4.2, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.channelStrategy || 'Not specified', { x: 0.4, y: 3.4, w: 4.2, h: 1.8, fontSize: 11, color: colors.gray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Launch / GTM Plan', { x: 5.2, y: 3.0, w: 4.4, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.launchPlan || 'Not specified', { x: 5.2, y: 3.4, w: 4.4, h: 1.8, fontSize: 11, color: colors.gray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 – Growth & Measurement
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Growth & Measurement', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText('Growth Engine', { x: 0.4, y: 0.9, w: 4.2, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.growthEngine || 'Not specified', { x: 0.4, y: 1.3, w: 4.2, h: 1.5, fontSize: 11, color: colors.gray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Measurement Framework', { x: 5.2, y: 0.9, w: 4.4, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.measurement || 'Not specified', { x: 5.2, y: 1.3, w: 4.4, h: 1.5, fontSize: 11, color: colors.gray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Budget Allocation', { x: 0.4, y: 3.0, w: 4.2, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.budget || 'Not specified', { x: 0.4, y: 3.4, w: 4.2, h: 1.5, fontSize: 11, color: colors.gray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Growth Goals', { x: 5.2, y: 3.0, w: 4.4, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.growthGoals || 'Not specified', { x: 5.2, y: 3.4, w: 4.4, h: 1.5, fontSize: 11, color: colors.gray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // SCALING & LEADERSHIP CANVAS
  // ============================================================

  generateScalingLeadershipWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'SCALING & LEADERSHIP CANVAS', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || 'N/A'), size: 24 })], spacing: { after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: DocStyles.colors.gray })], spacing: { after: 300 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'GLOBAL STRATEGY', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.globalStrategy || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'LOCALIZATION', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.localization || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'TEAM STRUCTURE', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.teamStructure || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'HIRING PLAN', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.hiringPlan || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'MARKETING OPERATIONS', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.marketingOps || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'LEADERSHIP MODEL', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.leadershipModel || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'BOARD REPORTING', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.boardReporting || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'TRANSFORMATION ROADMAP', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.transformation || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'GROWTH GOALS', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'Not specified', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateScalingLeadershipExcel: function(filename, data) {
    var rows = [
      ['SCALING & LEADERSHIP CANVAS', ''],
      ['Company', data.companyName || 'N/A'],
      ['Generated', new Date().toLocaleDateString()],
      ['', ''],
      ['Global Strategy', data.globalStrategy || 'Not specified'],
      ['Localization', data.localization || 'Not specified'],
      ['Team Structure', data.teamStructure || 'Not specified'],
      ['Hiring Plan', data.hiringPlan || 'Not specified'],
      ['Marketing Operations', data.marketingOps || 'Not specified'],
      ['Leadership Model', data.leadershipModel || 'Not specified'],
      ['Board Reporting', data.boardReporting || 'Not specified'],
      ['Transformation Roadmap', data.transformation || 'Not specified'],
      ['Growth Goals', data.growthGoals || 'Not specified']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scaling Leadership');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateScalingLeadershipPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('SCALING & LEADERSHIP CANVAS', 20, 25);
    pdf.setFontSize(12);
    pdf.setTextColor(...DocStyles.rgb.black);
    pdf.text('Company: ' + (data.companyName || 'N/A'), 20, 35);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 42);
    var sections = [
      { label: 'Global Strategy', value: data.globalStrategy },
      { label: 'Localization', value: data.localization },
      { label: 'Team Structure', value: data.teamStructure },
      { label: 'Hiring Plan', value: data.hiringPlan },
      { label: 'Marketing Operations', value: data.marketingOps },
      { label: 'Leadership Model', value: data.leadershipModel },
      { label: 'Board Reporting', value: data.boardReporting },
      { label: 'Transformation Roadmap', value: data.transformation },
      { label: 'Growth Goals', value: data.growthGoals }
    ];
    var y = 55;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.label, 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.value || 'Not specified', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 8;
    });
    pdf.save(filename + '.pdf');
  },

  generateScalingLeadershipPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Scaling & Leadership Canvas';
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { fill: colors.navy };
    slide1.addText('Scaling & Leadership Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center', fontFace: DocStyles.fonts.secondary });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center', fontFace: DocStyles.fonts.secondary });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 3.8, w: 9, h: 0.5, fontSize: 14, color: colors.white, align: 'center', fontFace: DocStyles.fonts.secondary });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Global Strategy & Organization', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText('Global Strategy', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.globalStrategy || 'Not specified', { x: 0.4, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Localization', { x: 5.3, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.localization || 'Not specified', { x: 5.3, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Team Structure', { x: 0.4, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.teamStructure || 'Not specified', { x: 0.4, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Hiring Plan', { x: 5.3, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.hiringPlan || 'Not specified', { x: 5.3, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Leadership & Transformation', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText('Marketing Operations', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.marketingOps || 'Not specified', { x: 0.4, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Leadership Model', { x: 5.3, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.leadershipModel || 'Not specified', { x: 5.3, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Transformation / Board', { x: 0.4, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText((data.transformation || '') + '\n\n' + (data.boardReporting || 'Not specified'), { x: 0.4, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Growth Goals', { x: 5.3, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.growthGoals || 'Not specified', { x: 5.3, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // OFFLINE MARKETING CANVAS
  // ============================================================

  generateOfflineMarketingWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'OFFLINE MARKETING CANVAS', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || 'N/A'), size: 24 })], spacing: { after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: DocStyles.colors.gray })], spacing: { after: 300 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'EVENT STRATEGY', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.eventStrategy || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'TRADE SHOWS', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.tradeShows || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PR STRATEGY', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.prStrategy || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'MEDIA RELATIONS', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.mediaRelations || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'BROADCAST & TRADITIONAL', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.broadcast || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'DIRECT MAIL', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.directMail || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'OOH ADVERTISING', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.ooh || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'OMNICHANNEL INTEGRATION', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.omnichannel || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'GROWTH GOALS', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'Not specified', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateOfflineMarketingExcel: function(filename, data) {
    var rows = [
      ['OFFLINE MARKETING CANVAS', ''],
      ['Company', data.companyName || 'N/A'],
      ['Generated', new Date().toLocaleDateString()],
      ['', ''],
      ['Event Strategy', data.eventStrategy || 'Not specified'],
      ['Trade Shows', data.tradeShows || 'Not specified'],
      ['PR Strategy', data.prStrategy || 'Not specified'],
      ['Media Relations', data.mediaRelations || 'Not specified'],
      ['Broadcast & Traditional', data.broadcast || 'Not specified'],
      ['Direct Mail', data.directMail || 'Not specified'],
      ['OOH Advertising', data.ooh || 'Not specified'],
      ['Omnichannel Integration', data.omnichannel || 'Not specified'],
      ['Growth Goals', data.growthGoals || 'Not specified']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Offline Marketing');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateOfflineMarketingPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('OFFLINE MARKETING CANVAS', 20, 25);
    pdf.setFontSize(12);
    pdf.setTextColor(...DocStyles.rgb.black);
    pdf.text('Company: ' + (data.companyName || 'N/A'), 20, 35);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 42);
    var sections = [
      { label: 'Event Strategy', value: data.eventStrategy },
      { label: 'Trade Shows', value: data.tradeShows },
      { label: 'PR Strategy', value: data.prStrategy },
      { label: 'Media Relations', value: data.mediaRelations },
      { label: 'Broadcast & Traditional', value: data.broadcast },
      { label: 'Direct Mail', value: data.directMail },
      { label: 'OOH Advertising', value: data.ooh },
      { label: 'Omnichannel Integration', value: data.omnichannel },
      { label: 'Growth Goals', value: data.growthGoals }
    ];
    var y = 55;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.label, 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.value || 'Not specified', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 8;
    });
    pdf.save(filename + '.pdf');
  },

  generateOfflineMarketingPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Offline Marketing Canvas';
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { fill: colors.navy };
    slide1.addText('Offline Marketing Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center', fontFace: DocStyles.fonts.secondary });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center', fontFace: DocStyles.fonts.secondary });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 3.8, w: 9, h: 0.5, fontSize: 14, color: colors.white, align: 'center', fontFace: DocStyles.fonts.secondary });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Events & PR Strategy', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText('Event Strategy', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.eventStrategy || 'Not specified', { x: 0.4, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Trade Shows', { x: 5.3, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.tradeShows || 'Not specified', { x: 5.3, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('PR Strategy', { x: 0.4, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.prStrategy || 'Not specified', { x: 0.4, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Media Relations', { x: 5.3, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.mediaRelations || 'Not specified', { x: 5.3, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Traditional & Direct Marketing', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText('Broadcast & Traditional', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.broadcast || 'Not specified', { x: 0.4, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Direct Mail', { x: 5.3, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.directMail || 'Not specified', { x: 5.3, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('OOH Advertising', { x: 0.4, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.ooh || 'Not specified', { x: 0.4, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Omnichannel / Goals', { x: 5.3, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText((data.omnichannel || '') + '\n\n' + (data.growthGoals || 'Not specified'), { x: 5.3, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, wrap: true, fit: 'shrink', valign: 'top' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // PERSONAL BRAND CANVAS
  // ============================================================

  generatePersonalBrandWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PERSONAL BRAND CANVAS', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: DocStyles.colors.blue })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Niche & Positioning', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.niche || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Positioning Statement', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.positioning || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Platform Strategy', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.platforms || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Content Pillars', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.contentPillars || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Audience Profile', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.audienceProfile || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Monetization Strategy', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.monetization || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Revenue Model', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.revenueModel || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Scaling Plan', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.scaling || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'Not specified', size: 20 })], spacing: { after: 200 } }),
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generatePersonalBrandExcel: function(filename, data) {
    var ws = XLSX.utils.aoa_to_sheet([
      ['PERSONAL BRAND CANVAS', ''],
      ['Name / Brand', data.companyName || ''],
      ['', ''],
      ['Niche & Positioning', data.niche || ''],
      ['Positioning Statement', data.positioning || ''],
      ['Platform Strategy', data.platforms || ''],
      ['Content Pillars', data.contentPillars || ''],
      ['Audience Profile', data.audienceProfile || ''],
      ['Monetization Strategy', data.monetization || ''],
      ['Revenue Model', data.revenueModel || ''],
      ['Scaling Plan', data.scaling || ''],
      ['Growth Goals', data.growthGoals || '']
    ]);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Personal Brand');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePersonalBrandPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('PERSONAL BRAND CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text(filename, 20, 35);
    var sections = [
      { title: 'Niche & Positioning', content: data.niche },
      { title: 'Positioning Statement', content: data.positioning },
      { title: 'Platform Strategy', content: data.platforms },
      { title: 'Content Pillars', content: data.contentPillars },
      { title: 'Audience Profile', content: data.audienceProfile },
      { title: 'Monetization Strategy', content: data.monetization },
      { title: 'Revenue Model', content: data.revenueModel },
      { title: 'Scaling Plan', content: data.scaling },
      { title: 'Growth Goals', content: data.growthGoals }
    ];
    var y = 50;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.title, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generatePersonalBrandPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Personal Brand Canvas';

    var slide1 = pptx.addSlide();
    slide1.background = { color: DocStyles.colors.navy };
    slide1.addText('Personal Brand Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: DocStyles.colors.white, bold: true, align: 'center', fontFace: DocStyles.fonts.secondary });
    slide1.addText(data.companyName || filename, { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 20, color: DocStyles.colors.teal, align: 'center', fontFace: DocStyles.fonts.secondary });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: DocStyles.colors.teal } });
    slide2.addText('Positioning & Content', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: DocStyles.colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText('Niche & Positioning', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.niche || 'Not specified', { x: 0.4, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Platform Strategy', { x: 5.3, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.platforms || 'Not specified', { x: 5.3, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Content Pillars', { x: 0.4, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.contentPillars || 'Not specified', { x: 0.4, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Audience Profile', { x: 5.3, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.audienceProfile || 'Not specified', { x: 5.3, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: DocStyles.colors.teal } });
    slide3.addText('Monetization & Growth', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: DocStyles.colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText('Monetization Strategy', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.monetization || 'Not specified', { x: 0.4, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Revenue Model', { x: 5.3, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.revenueModel || 'Not specified', { x: 5.3, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Scaling Plan', { x: 0.4, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.scaling || 'Not specified', { x: 0.4, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Growth Goals', { x: 5.3, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.growthGoals || 'Not specified', { x: 5.3, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // MARKETING FINANCE CANVAS
  // ============================================================

  generateMarketingFinanceWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'MARKETING FINANCE CANVAS', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: DocStyles.colors.blue })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Annual Budget', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.annualBudget || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Channel Allocation', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelAllocation || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'CAC Metrics', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.cacMetrics || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'LTV Model', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.ltvModel || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Payback Period', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.paybackPeriod || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'ROI Targets', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.roiTargets || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Revenue Forecast', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.forecast || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Scenario Planning', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.scenarios || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 22, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'Not specified', size: 20 })], spacing: { after: 200 } }),
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateMarketingFinanceExcel: function(filename, data) {
    var ws = XLSX.utils.aoa_to_sheet([
      ['MARKETING FINANCE CANVAS', ''],
      ['Company', data.companyName || ''],
      ['', ''],
      ['Annual Budget', data.annualBudget || ''],
      ['Channel Allocation', data.channelAllocation || ''],
      ['CAC Metrics', data.cacMetrics || ''],
      ['LTV Model', data.ltvModel || ''],
      ['Payback Period', data.paybackPeriod || ''],
      ['ROI Targets', data.roiTargets || ''],
      ['Revenue Forecast', data.forecast || ''],
      ['Scenario Planning', data.scenarios || ''],
      ['Growth Goals', data.growthGoals || '']
    ]);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marketing Finance');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMarketingFinancePDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('MARKETING FINANCE CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.blue);
    pdf.text(filename, 20, 35);
    var sections = [
      { title: 'Annual Budget', content: data.annualBudget },
      { title: 'Channel Allocation', content: data.channelAllocation },
      { title: 'CAC Metrics', content: data.cacMetrics },
      { title: 'LTV Model', content: data.ltvModel },
      { title: 'Payback Period', content: data.paybackPeriod },
      { title: 'ROI Targets', content: data.roiTargets },
      { title: 'Revenue Forecast', content: data.forecast },
      { title: 'Scenario Planning', content: data.scenarios },
      { title: 'Growth Goals', content: data.growthGoals }
    ];
    var y = 50;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.title, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateMarketingFinancePPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Marketing Finance Canvas';

    var slide1 = pptx.addSlide();
    slide1.background = { color: DocStyles.colors.navy };
    slide1.addText('Marketing Finance Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: DocStyles.colors.white, bold: true, align: 'center', fontFace: DocStyles.fonts.secondary });
    slide1.addText(data.companyName || filename, { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 20, color: DocStyles.colors.teal, align: 'center', fontFace: DocStyles.fonts.secondary });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: DocStyles.colors.teal } });
    slide2.addText('Budget & Unit Economics', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: DocStyles.colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText('Annual Budget', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.annualBudget || 'Not specified', { x: 0.4, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Channel Allocation', { x: 5.3, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.channelAllocation || 'Not specified', { x: 5.3, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('CAC Metrics', { x: 0.4, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.cacMetrics || 'Not specified', { x: 0.4, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('LTV Model', { x: 5.3, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide2.addText(data.ltvModel || 'Not specified', { x: 5.3, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: DocStyles.colors.teal } });
    slide3.addText('Planning & Forecasting', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: DocStyles.colors.white, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText('ROI Targets', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.roiTargets || 'Not specified', { x: 0.4, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Revenue Forecast', { x: 5.3, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.forecast || 'Not specified', { x: 5.3, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Scenario Planning', { x: 0.4, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.scenarios || 'Not specified', { x: 0.4, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Growth Goals', { x: 5.3, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: DocStyles.colors.crimson, bold: true, fontFace: DocStyles.fonts.secondary });
    slide3.addText(data.growthGoals || 'Not specified', { x: 5.3, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: DocStyles.colors.darkGray, fontFace: DocStyles.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // PRODUCT GTM CANVAS
  // ============================================================

  generateProductGtmWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PRODUCT GTM CANVAS', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: DocStyles.colors.navy })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Target Market & ICP', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.targetMarket || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Positioning Statement', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.positioning || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Messaging Architecture', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.messaging || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Competitive Battlecards', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.battlecards || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Launch Plan', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.launchPlan || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Sales Enablement', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.salesEnablement || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'GTM Motion & Channels', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelStrategy || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Success Metrics', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.successMetrics || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateProductGtmExcel: function(filename, data) {
    var rows = [
      ['PRODUCT GTM CANVAS', ''],
      ['Company / Product', data.companyName || ''],
      ['', ''],
      ['Target Market & ICP', data.targetMarket || ''],
      ['Positioning Statement', data.positioning || ''],
      ['Messaging Architecture', data.messaging || ''],
      ['Competitive Battlecards', data.battlecards || ''],
      ['Launch Plan', data.launchPlan || ''],
      ['Sales Enablement', data.salesEnablement || ''],
      ['GTM Motion & Channels', data.channelStrategy || ''],
      ['Success Metrics', data.successMetrics || ''],
      ['Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Product GTM');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateProductGtmPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('PRODUCT GTM CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text(filename, 20, 35);
    var sections = [
      { label: 'Target Market & ICP', value: data.targetMarket },
      { label: 'Positioning Statement', value: data.positioning },
      { label: 'Messaging Architecture', value: data.messaging },
      { label: 'Competitive Battlecards', value: data.battlecards },
      { label: 'Launch Plan', value: data.launchPlan },
      { label: 'Sales Enablement', value: data.salesEnablement },
      { label: 'GTM Motion & Channels', value: data.channelStrategy },
      { label: 'Success Metrics', value: data.successMetrics },
      { label: 'Growth Goals', value: data.growthGoals }
    ];
    var y = 50;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.label, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateProductGtmPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Product GTM Canvas';
    var colors = DocStyles.colors;
    // Slide 1 — Title
    var s1 = pptx.addSlide();
    s1.background = { color: colors.navy };
    s1.addText('PRODUCT GTM\nCANVAS', { x: 0.5, y: 0.8, w: 9, h: 2, fontSize: 36, bold: true, color: colors.white, align: 'center', lineSpacingMultiple: 1.2 });
    s1.addText(data.companyName || filename, { x: 0.5, y: 3.0, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center' });
    s1.addShape(pptx.ShapeType.rect, { x: 3.5, y: 4.0, w: 3, h: 0.05, fill: { color: colors.crimson } });
    // Slide 2 — Positioning & Messaging
    var s2 = pptx.addSlide();
    s2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s2.addText('Positioning & Messaging', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s2.addText('Target Market & ICP', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.targetMarket || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Positioning Statement', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.positioning || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Messaging Architecture', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.messaging || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Competitive Battlecards', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.battlecards || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 — Launch & Enablement
    var s3 = pptx.addSlide();
    s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s3.addText('Launch & Enablement', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s3.addText('Launch Plan', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.launchPlan || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Sales Enablement', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.salesEnablement || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('GTM Motion & Channels', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.channelStrategy || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Growth Goals', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.growthGoals || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // STRATEGIC ANALYSIS CANVAS
  // ============================================================

  generateStrategicAnalysisWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'STRATEGIC ANALYSIS CANVAS', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: DocStyles.colors.navy })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: "Porter's Five Forces", bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.porterForces || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Industry Lifecycle', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.industryLifecycle || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PESTLE Factors', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.pestle || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'SWOT / TOWS Strategies', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.swot || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Competitive Positioning', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.competitivePosition || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Blue Ocean Opportunities', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.blueOcean || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Scenario Planning', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.scenarios || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Strategic Initiatives / OKRs', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.strategicInitiatives || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Strategic Goals', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateStrategicAnalysisExcel: function(filename, data) {
    var rows = [
      ['STRATEGIC ANALYSIS CANVAS', ''],
      ['Company / Product', data.companyName || ''],
      ['', ''],
      ["Porter's Five Forces", data.porterForces || ''],
      ['Industry Lifecycle', data.industryLifecycle || ''],
      ['PESTLE Factors', data.pestle || ''],
      ['SWOT / TOWS Strategies', data.swot || ''],
      ['Competitive Positioning', data.competitivePosition || ''],
      ['Blue Ocean Opportunities', data.blueOcean || ''],
      ['Scenario Planning', data.scenarios || ''],
      ['Strategic Initiatives / OKRs', data.strategicInitiatives || ''],
      ['Strategic Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Strategic Analysis');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateStrategicAnalysisPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('STRATEGIC ANALYSIS CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text(filename, 20, 35);
    var sections = [
      { label: "Porter's Five Forces", value: data.porterForces },
      { label: 'Industry Lifecycle', value: data.industryLifecycle },
      { label: 'PESTLE Factors', value: data.pestle },
      { label: 'SWOT / TOWS Strategies', value: data.swot },
      { label: 'Competitive Positioning', value: data.competitivePosition },
      { label: 'Blue Ocean Opportunities', value: data.blueOcean },
      { label: 'Scenario Planning', value: data.scenarios },
      { label: 'Strategic Initiatives / OKRs', value: data.strategicInitiatives },
      { label: 'Strategic Goals', value: data.growthGoals }
    ];
    var y = 50;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.label, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateStrategicAnalysisPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Strategic Analysis Canvas';
    var colors = DocStyles.colors;
    // Slide 1 — Title
    var s1 = pptx.addSlide();
    s1.background = { color: colors.navy };
    s1.addText('STRATEGIC ANALYSIS\nCANVAS', { x: 0.5, y: 0.8, w: 9, h: 2, fontSize: 36, bold: true, color: colors.white, align: 'center', lineSpacingMultiple: 1.2 });
    s1.addText(data.companyName || filename, { x: 0.5, y: 3.0, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center' });
    s1.addShape(pptx.ShapeType.rect, { x: 3.5, y: 4.0, w: 3, h: 0.05, fill: { color: colors.crimson } });
    // Slide 2 — Industry & Environment
    var s2 = pptx.addSlide();
    s2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s2.addText('Industry & Environment', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s2.addText("Porter's Five Forces", { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.porterForces || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Industry Lifecycle', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.industryLifecycle || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('PESTLE Factors', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.pestle || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('SWOT / TOWS', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.swot || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 — Competitive & Strategic
    var s3 = pptx.addSlide();
    s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s3.addText('Competitive & Strategic Plan', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s3.addText('Competitive Positioning', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.competitivePosition || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Blue Ocean Opportunities', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.blueOcean || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Scenario Planning', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.scenarios || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Strategic Goals', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.growthGoals || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // DISTRIBUTION STRATEGY CANVAS
  // ============================================================

  generateDistributionStrategyWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'DISTRIBUTION STRATEGY CANVAS', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: DocStyles.colors.navy })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Channel Mix', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelMix || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Direct Strategy', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.directStrategy || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Partner Program', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.partnerProgram || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Affiliate Program', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.affiliateDesign || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Marketplace Strategy', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.marketplace || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Integration Strategy', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.integrations || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Co-Marketing Plan', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.coMarketing || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Ecosystem Positioning', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.ecosystem || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Distribution Goals', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateDistributionStrategyExcel: function(filename, data) {
    var rows = [
      ['DISTRIBUTION STRATEGY CANVAS', ''],
      ['Company / Product', data.companyName || ''],
      ['', ''],
      ['Channel Mix', data.channelMix || ''],
      ['Direct Strategy', data.directStrategy || ''],
      ['Partner Program', data.partnerProgram || ''],
      ['Affiliate Program', data.affiliateDesign || ''],
      ['Marketplace Strategy', data.marketplace || ''],
      ['Integration Strategy', data.integrations || ''],
      ['Co-Marketing Plan', data.coMarketing || ''],
      ['Ecosystem Positioning', data.ecosystem || ''],
      ['Distribution Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Distribution Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDistributionStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('DISTRIBUTION STRATEGY CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text(filename, 20, 35);
    var sections = [
      { label: 'Channel Mix', value: data.channelMix },
      { label: 'Direct Strategy', value: data.directStrategy },
      { label: 'Partner Program', value: data.partnerProgram },
      { label: 'Affiliate Program', value: data.affiliateDesign },
      { label: 'Marketplace Strategy', value: data.marketplace },
      { label: 'Integration Strategy', value: data.integrations },
      { label: 'Co-Marketing Plan', value: data.coMarketing },
      { label: 'Ecosystem Positioning', value: data.ecosystem },
      { label: 'Distribution Goals', value: data.growthGoals }
    ];
    var y = 50;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.label, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateDistributionStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Distribution Strategy Canvas';
    var colors = DocStyles.colors;
    // Slide 1 — Title
    var s1 = pptx.addSlide();
    s1.background = { color: colors.navy };
    s1.addText('DISTRIBUTION STRATEGY\nCANVAS', { x: 0.5, y: 0.8, w: 9, h: 2, fontSize: 36, bold: true, color: colors.white, align: 'center', lineSpacingMultiple: 1.2 });
    s1.addText(data.companyName || filename, { x: 0.5, y: 3.0, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center' });
    s1.addShape(pptx.ShapeType.rect, { x: 3.5, y: 4.0, w: 3, h: 0.05, fill: { color: colors.crimson } });
    // Slide 2 — Channel Mix & Partners
    var s2 = pptx.addSlide();
    s2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s2.addText('Channel Architecture', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s2.addText('Channel Mix', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.channelMix || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Direct Strategy', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.directStrategy || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Partner Program', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.partnerProgram || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Affiliate Program', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.affiliateDesign || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 — Ecosystem & Goals
    var s3 = pptx.addSlide();
    s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s3.addText('Ecosystem & Growth', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s3.addText('Marketplace Strategy', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.marketplace || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Integration Strategy', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.integrations || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Ecosystem Positioning', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.ecosystem || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Distribution Goals', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.growthGoals || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // PRICING STRATEGY CANVAS
  // ============================================================

  generatePricingStrategyWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PRICING STRATEGY CANVAS', bold: true, size: 36, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: DocStyles.colors.navy })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Value Metric', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.valueMetric || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Pricing Model', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.pricingModel || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Tier / Plan Design', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.tierDesign || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Pricing Psychology', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.psychology || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Bundling Strategy', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.bundling || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Discounting Policy', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.discounting || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'International Pricing', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.international || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Price Testing Plan', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.testingPlan || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Revenue Goals', bold: true, size: 24, color: DocStyles.colors.crimson })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || 'N/A', size: 22 })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generatePricingStrategyExcel: function(filename, data) {
    var rows = [
      ['PRICING STRATEGY CANVAS', ''],
      ['Company / Product', data.companyName || ''],
      ['', ''],
      ['Value Metric', data.valueMetric || ''],
      ['Pricing Model', data.pricingModel || ''],
      ['Tier / Plan Design', data.tierDesign || ''],
      ['Pricing Psychology', data.psychology || ''],
      ['Bundling Strategy', data.bundling || ''],
      ['Discounting Policy', data.discounting || ''],
      ['International Pricing', data.international || ''],
      ['Price Testing Plan', data.testingPlan || ''],
      ['Revenue Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pricing Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generatePricingStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(20);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('PRICING STRATEGY CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text(filename, 20, 35);
    var sections = [
      { label: 'Value Metric', value: data.valueMetric },
      { label: 'Pricing Model', value: data.pricingModel },
      { label: 'Tier / Plan Design', value: data.tierDesign },
      { label: 'Pricing Psychology', value: data.psychology },
      { label: 'Bundling Strategy', value: data.bundling },
      { label: 'Discounting Policy', value: data.discounting },
      { label: 'International Pricing', value: data.international },
      { label: 'Price Testing Plan', value: data.testingPlan },
      { label: 'Revenue Goals', value: data.growthGoals }
    ];
    var y = 50;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.label, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(...DocStyles.rgb.black);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generatePricingStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Pricing Strategy Canvas';
    var colors = DocStyles.colors;
    // Slide 1 — Title
    var s1 = pptx.addSlide();
    s1.background = { color: colors.navy };
    s1.addText('PRICING STRATEGY\nCANVAS', { x: 0.5, y: 0.8, w: 9, h: 2, fontSize: 36, bold: true, color: colors.white, align: 'center', lineSpacingMultiple: 1.2 });
    s1.addText(data.companyName || filename, { x: 0.5, y: 3.0, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center' });
    s1.addShape(pptx.ShapeType.rect, { x: 3.5, y: 4.0, w: 3, h: 0.05, fill: { color: colors.crimson } });
    // Slide 2 — Pricing Model & Tiers
    var s2 = pptx.addSlide();
    s2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s2.addText('Pricing Architecture', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s2.addText('Value Metric', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.valueMetric || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Pricing Model', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.pricingModel || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Tier / Plan Design', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.tierDesign || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Pricing Psychology', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.psychology || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 — Revenue Optimization
    var s3 = pptx.addSlide();
    s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s3.addText('Revenue Optimization', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s3.addText('Bundling Strategy', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.bundling || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Discounting Policy', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.discounting || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('International Pricing', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.international || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Revenue Goals', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.growthGoals || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: DocStyles.colors.darkGray, valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // B2B STRATEGY CANVAS
  // ============================================================

  generateB2bStrategyWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        properties: {},
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'B2B Marketing Strategy Canvas', bold: true, size: 48, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 28, color: DocStyles.colors.navy })], spacing: { after: 300 } }),
          ...[ { t: 'Target Industry', v: data.industry },
               { t: 'Ideal Customer Profile (ICP)', v: data.icp },
               { t: 'Buying Committee Map', v: data.buyingCommittee },
               { t: 'ABM Strategy', v: data.abmStrategy },
               { t: 'Demand Generation Plan', v: data.demandGen },
               { t: 'Lead Scoring Model', v: data.leadScoring },
               { t: 'Sales Enablement Content', v: data.salesContent },
               { t: 'RevOps & Tech Stack', v: data.revOps },
               { t: 'Growth Goals', v: data.growthGoals }
          ].flatMap(function(s) {
            return [
              new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: s.t, bold: true, size: 26, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
              new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: s.v || 'Not specified', size: 22 })], spacing: { after: 150 } })
            ];
          })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateB2bStrategyExcel: function(filename, data) {
    var rows = [
      ['B2B Marketing Strategy Canvas', ''],
      ['Company', data.companyName || ''],
      ['', ''],
      ['Section', 'Details'],
      ['Target Industry', data.industry || ''],
      ['Ideal Customer Profile', data.icp || ''],
      ['Buying Committee Map', data.buyingCommittee || ''],
      ['ABM Strategy', data.abmStrategy || ''],
      ['Demand Generation Plan', data.demandGen || ''],
      ['Lead Scoring Model', data.leadScoring || ''],
      ['Sales Enablement Content', data.salesContent || ''],
      ['RevOps & Tech Stack', data.revOps || ''],
      ['Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'B2B Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateB2bStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22); pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('B2B Marketing Strategy Canvas', 20, 25);
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Company: ' + (data.companyName || ''), 20, 38);
    var y = 55;
    var sections = [
      { t: 'Target Industry', v: data.industry },
      { t: 'Ideal Customer Profile', v: data.icp },
      { t: 'Buying Committee Map', v: data.buyingCommittee },
      { t: 'ABM Strategy', v: data.abmStrategy },
      { t: 'Demand Generation Plan', v: data.demandGen },
      { t: 'Lead Scoring Model', v: data.leadScoring },
      { t: 'Sales Enablement Content', v: data.salesContent },
      { t: 'RevOps & Tech Stack', v: data.revOps },
      { t: 'Growth Goals', v: data.growthGoals }
    ];
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 25; }
      pdf.setFontSize(13); pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(s.t, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.v || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateB2bStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { fill: colors.navy };
    slide1.addText('B2B Marketing Strategy', { x: 0.5, y: 1.0, w: 9.0, h: 1.2, fontSize: 32, color: colors.white, bold: true });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.2, w: 9.0, h: 0.8, fontSize: 22, color: colors.teal });
    slide1.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.3, w: 2.0, h: 0.05, fill: { color: colors.crimson } });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Target & Strategy', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('ICP', { x: 0.5, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.icp || '', { x: 0.5, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Buying Committee', { x: 5.2, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.buyingCommittee || '', { x: 5.2, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('ABM Strategy', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.abmStrategy || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Demand Generation', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.demandGen || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Execution & Operations', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Lead Scoring', { x: 0.5, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.leadScoring || '', { x: 0.5, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Sales Content', { x: 5.2, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.salesContent || '', { x: 5.2, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('RevOps', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.revOps || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Growth Goals', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.growthGoals || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // GROWTH STRATEGY CANVAS
  // ============================================================

  generateGrowthStrategyWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        properties: {},
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Strategy Canvas', bold: true, size: 48, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 28, color: DocStyles.colors.navy })], spacing: { after: 300 } }),
          ...[ { t: 'North Star Metric', v: data.northStar },
               { t: 'Growth Loops', v: data.growthLoops },
               { t: 'Viral Mechanics', v: data.viralMechanics },
               { t: 'Referral Program', v: data.referralProgram },
               { t: 'PLG / Freemium Strategy', v: data.plgStrategy },
               { t: 'Activation (Aha Moment)', v: data.activation },
               { t: 'Experiment Backlog', v: data.experimentBacklog },
               { t: 'Team Structure', v: data.teamStructure },
               { t: 'Growth Goals', v: data.growthGoals }
          ].flatMap(function(s) {
            return [
              new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: s.t, bold: true, size: 26, color: DocStyles.colors.blue })], spacing: { before: 200, after: 100 } }),
              new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: s.v || 'Not specified', size: 22 })], spacing: { after: 150 } })
            ];
          })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateGrowthStrategyExcel: function(filename, data) {
    var rows = [
      ['Growth Strategy Canvas', ''],
      ['Company', data.companyName || ''],
      ['', ''],
      ['Section', 'Details'],
      ['North Star Metric', data.northStar || ''],
      ['Growth Loops', data.growthLoops || ''],
      ['Viral Mechanics', data.viralMechanics || ''],
      ['Referral Program', data.referralProgram || ''],
      ['PLG / Freemium Strategy', data.plgStrategy || ''],
      ['Activation (Aha Moment)', data.activation || ''],
      ['Experiment Backlog', data.experimentBacklog || ''],
      ['Team Structure', data.teamStructure || ''],
      ['Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Growth Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateGrowthStrategyPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22); pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Growth Strategy Canvas', 20, 25);
    pdf.setFontSize(14); pdf.setTextColor(...DocStyles.rgb.navy);
    pdf.text('Company: ' + (data.companyName || ''), 20, 38);
    var y = 55;
    var sections = [
      { t: 'North Star Metric', v: data.northStar },
      { t: 'Growth Loops', v: data.growthLoops },
      { t: 'Viral Mechanics', v: data.viralMechanics },
      { t: 'Referral Program', v: data.referralProgram },
      { t: 'PLG / Freemium Strategy', v: data.plgStrategy },
      { t: 'Activation (Aha Moment)', v: data.activation },
      { t: 'Experiment Backlog', v: data.experimentBacklog },
      { t: 'Team Structure', v: data.teamStructure },
      { t: 'Growth Goals', v: data.growthGoals }
    ];
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 25; }
      pdf.setFontSize(13); pdf.setTextColor(...DocStyles.rgb.blue);
      pdf.text(s.t, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(...DocStyles.rgb.darkGray);
      var lines = pdf.splitTextToSize(s.v || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateGrowthStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { fill: colors.navy };
    slide1.addText('Growth Strategy Canvas', { x: 0.5, y: 1.0, w: 9.0, h: 1.2, fontSize: 32, color: colors.white, bold: true });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.2, w: 9.0, h: 0.8, fontSize: 22, color: colors.teal });
    slide1.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.3, w: 2.0, h: 0.05, fill: { color: colors.crimson } });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Growth Engine', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('North Star', { x: 0.5, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.northStar || '', { x: 0.5, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Growth Loops', { x: 5.2, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.growthLoops || '', { x: 5.2, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Viral Mechanics', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.viralMechanics || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Referral Program', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.referralProgram || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Execution & Team', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('PLG Strategy', { x: 0.5, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.plgStrategy || '', { x: 0.5, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Activation', { x: 5.2, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.activation || '', { x: 5.2, y: 1.3, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Experiment Backlog', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.experimentBacklog || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Growth Goals', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.growthGoals || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // CRO AUDIT CANVAS
  // ============================================================

  generateCroAuditWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        properties: {},
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'CRO Audit Canvas', bold: true, size: 48, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 28 })], spacing: { after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: DocStyles.colors.gray })], spacing: { after: 300 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Current Conversion Rate', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.currentCR || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Landing Page Issues', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.landingPages || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Copy & Messaging Strategy', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.copyStrategy || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Form & Checkout Optimization', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.formDesign || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Testing Roadmap', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.testPlan || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'UX Research Findings', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.uxFindings || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Funnel Gap Analysis', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.funnelGaps || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Test Prioritization (PIE Scores)', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.prioritization || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || '', size: 24 })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateCroAuditExcel: function(filename, data) {
    var rows = [
      ['CRO Audit Canvas'],
      ['Company', data.companyName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [''],
      ['Section', 'Details'],
      ['Current Conversion Rate', data.currentCR || ''],
      ['Landing Page Issues', data.landingPages || ''],
      ['Copy & Messaging Strategy', data.copyStrategy || ''],
      ['Form & Checkout Optimization', data.formDesign || ''],
      ['Testing Roadmap', data.testPlan || ''],
      ['UX Research Findings', data.uxFindings || ''],
      ['Funnel Gap Analysis', data.funnelGaps || ''],
      ['Test Prioritization (PIE)', data.prioritization || ''],
      ['Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CRO Audit');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCroAuditPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('CRO Audit Canvas', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text('Company: ' + (data.companyName || ''), 20, 38);
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 46);

    var sections = [
      { title: 'Current Conversion Rate', content: data.currentCR },
      { title: 'Landing Page Issues', content: data.landingPages },
      { title: 'Copy & Messaging Strategy', content: data.copyStrategy },
      { title: 'Form & Checkout Optimization', content: data.formDesign },
      { title: 'Testing Roadmap', content: data.testPlan },
      { title: 'UX Research Findings', content: data.uxFindings },
      { title: 'Funnel Gap Analysis', content: data.funnelGaps },
      { title: 'Test Prioritization (PIE)', content: data.prioritization },
      { title: 'Growth Goals', content: data.growthGoals }
    ];

    var y = 58;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.title, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0);
      var lines = pdf.splitTextToSize(s.content || '', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });

    pdf.save(filename + '.pdf');
  },

  generateCroAuditPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { fill: colors.navy };
    slide1.addText('CRO Audit Canvas', { x: 0.5, y: 1.0, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true });
    slide1.addText(data.companyName || '', { x: 0.5, y: 2.4, w: 9, h: 0.8, fontSize: 22, color: colors.teal });
    slide1.addText('Generated: ' + new Date().toLocaleDateString(), { x: 0.5, y: 3.4, w: 9, h: 0.5, fontSize: 14, color: colors.light });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Current State & Audit', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('Current Conversion Rate', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.currentCR || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Landing Page Issues', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.landingPages || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('UX Research Findings', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.uxFindings || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Funnel Gap Analysis', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.funnelGaps || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Optimization & Testing Plan', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Copy & Messaging Strategy', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.copyStrategy || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Testing Roadmap', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.testPlan || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Test Prioritization (PIE)', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.prioritization || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Growth Goals', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.growthGoals || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },


  // ============================================================
  // ANALYTICS DASHBOARD CANVAS
  // ============================================================

  generateAnalyticsDashboardWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        properties: {},
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Analytics Dashboard Canvas', bold: true, size: 48, color: DocStyles.colors.crimson })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 28 })], spacing: { after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: DocStyles.colors.gray })], spacing: { after: 300 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'North Star Metric', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.northStar || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Funnel Metrics', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.funnelMetrics || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Attribution Model', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.attributionModel || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Channel Performance KPIs', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelPerformance || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Experiment Priorities', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.experiments || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Data Stack & Tools', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.dataStack || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Reporting Cadence', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.reportingCadence || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Privacy & Compliance', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.privacyCompliance || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 28, color: DocStyles.colors.crimson })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthGoals || '', size: 24 })], spacing: { after: 200 } })
        ]
      }]
    });
    window.docx.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  generateAnalyticsDashboardExcel: function(filename, data) {
    var rows = [
      ['Analytics Dashboard Canvas'],
      ['Company', data.companyName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [''],
      ['Section', 'Details'],
      ['North Star Metric', data.northStar || ''],
      ['Funnel Metrics', data.funnelMetrics || ''],
      ['Attribution Model', data.attributionModel || ''],
      ['Channel Performance KPIs', data.channelPerformance || ''],
      ['Experiment Priorities', data.experiments || ''],
      ['Data Stack & Tools', data.dataStack || ''],
      ['Reporting Cadence', data.reportingCadence || ''],
      ['Privacy & Compliance', data.privacyCompliance || ''],
      ['Growth Goals', data.growthGoals || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 65 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics Dashboard');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateAnalyticsDashboardPDF: function(filename, data) {
    var pdf = new jspdf.jsPDF();
    pdf.setFontSize(22);
    pdf.setTextColor(...DocStyles.rgb.crimson);
    pdf.text('Analytics Dashboard Canvas', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text('Company: ' + (data.companyName || ''), 20, 38);
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 46);

    var sections = [
      { title: 'North Star Metric', content: data.northStar },
      { title: 'Funnel Metrics', content: data.funnelMetrics },
      { title: 'Attribution Model', content: data.attributionModel },
      { title: 'Channel Performance KPIs', content: data.channelPerformance },
      { title: 'Experiment Priorities', content: data.experiments },
      { title: 'Data Stack & Tools', content: data.dataStack },
      { title: 'Reporting Cadence', content: data.reportingCadence },
      { title: 'Privacy & Compliance', content: data.privacyCompliance },
      { title: 'Growth Goals', content: data.growthGoals }
    ];

    var y = 58;
    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13);
      pdf.setTextColor(...DocStyles.rgb.crimson);
      pdf.text(s.title, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0);
      var lines = pdf.splitTextToSize(s.content || '', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });

    pdf.save(filename + '.pdf');
  },

  generateAnalyticsDashboardPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = DocStyles.colors;

    var slide1 = pptx.addSlide();
    slide1.background = { fill: colors.navy };
    slide1.addText('Analytics Dashboard Canvas', { x: 0.5, y: 1.0, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true });
    slide1.addText(data.companyName || '', { x: 0.5, y: 2.4, w: 9, h: 0.8, fontSize: 22, color: colors.teal });
    slide1.addText('Generated: ' + new Date().toLocaleDateString(), { x: 0.5, y: 3.4, w: 9, h: 0.5, fontSize: 14, color: colors.light });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Measurement Framework', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide2.addText('North Star Metric', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.northStar || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Funnel Metrics', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.funnelMetrics || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Attribution Model', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.attributionModel || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide2.addText('Channel Performance', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide2.addText(data.channelPerformance || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Data Stack & Operations', { x: 0.5, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true });
    slide3.addText('Data Stack & Tools', { x: 0.5, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.dataStack || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Reporting Cadence', { x: 5.2, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.reportingCadence || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Privacy & Compliance', { x: 0.5, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.privacyCompliance || '', { x: 0.5, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });
    slide3.addText('Growth Goals', { x: 5.2, y: 3.2, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true });
    slide3.addText(data.growthGoals || '', { x: 5.2, y: 3.6, w: 4.3, h: 1.5, fontSize: 11, wrap: true, valign: 'top', fit: 'shrink' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

});
