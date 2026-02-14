/**
 * Unified Document Generation Library
 * Provides APIs for generating Word, Excel, PowerPoint, and PDF documents
 * 
 * Dependencies:
 * - docx (NPM via CDN)
 * - SheetJS (via CDN)
 * - PptxGenJS (via CDN)
 * - jsPDF (via CDN)
 */

var DocGenerator = {
  /**
   * Generate a Word document (.docx)
   * @param {string} filename - Output filename (without .docx extension)
   * @param {Object} config - Document configuration
   * @param {string} config.title - Document title
   * @param {string} config.author - Document author
   * @param {Array} config.sections - Array of section objects with heading and content
   */
  generateWord: async function(filename, config) {
    try {
      // Debug logging
      console.log('generateWord called with filename:', filename);
      console.log('window.docx available:', !!window.docx);
      console.log('window.docx content:', window.docx);
      
      if (!window.docx) {
        console.error('docx library not loaded. Make sure to include CDN link.');
        alert('Word document library is loading. Please try again in a moment.');
        return false;
      }

      // Handle both direct export and nested export patterns
      const docxLib = window.docx.default || window.docx;
      const { Document, Packer, Paragraph, HeadingLevel } = docxLib;
      console.log('Extracted:', { Document: !!Document, Packer: !!Packer, Paragraph: !!Paragraph, HeadingLevel: !!HeadingLevel });

      if (!Document || !Packer || !Paragraph) {
        console.error('Failed to extract required docx exports. Available exports:', Object.keys(window.docx));
        alert('Word document library failed to initialize properly.');
        return false;
      }

      const sections = config.sections.map(section => {
        const elements = [
          new Paragraph({
            text: section.heading,
            heading: HeadingLevel.HEADING_1,
            spacing: {
              before: 200,
              after: 200
            }
          })
        ];

        // Handle both string content and array of content
        const content = Array.isArray(section.content) ? section.content : [section.content];
        content.forEach(item => {
          if (typeof item === 'string') {
            elements.push(new Paragraph({
              text: item,
              spacing: {
                after: 100
              }
            }));
          } else if (typeof item === 'object') {
            // Handle objects with type property
            if (item.type === 'heading') {
              elements.push(new Paragraph({
                text: item.text,
                heading: HeadingLevel.HEADING_2,
                spacing: {
                  before: 100,
                  after: 100
                }
              }));
            } else if (item.type === 'table') {
              elements.push(item.data);
            }
          }
        });

        return { children: elements };
      });

      const doc = new Document({
        sections: sections.map(section => ({ ...section })),
        core: {
          title: config.title,
          author: config.author || 'Generated from wasilzafar.com'
        }
      });

      const blob = await Packer.toBlob(doc);
      DocGenerator._downloadFile(blob, `${filename}.docx`);
      return true;
    } catch (error) {
      console.error('Error generating Word document:', error);
      return false;
    }
  },

  /**
   * Generate an Excel spreadsheet (.xlsx)
   * @param {string} filename - Output filename (without .xlsx extension)
   * @param {Object} config - Spreadsheet configuration
   * @param {string} config.sheetName - Name of the sheet
   * @param {Array<Array>} config.data - 2D array of data
   * @param {Array} config.headers - Optional header row
   */
  generateExcel: function(filename, config) {
    try {
      if (!window.XLSX) {
        console.error('SheetJS library not loaded. Make sure to include CDN link.');
        return false;
      }

      const wsData = [];
      
      // Support both old API (headers + data) and new API (rows)
      if (config.rows && config.rows.length > 0) {
        // New API: rows is a flat 2D array including headers
        wsData.push(...config.rows);
      } else {
        // Old API: separate headers and data arrays
        if (config.headers && config.headers.length > 0) {
          wsData.push(config.headers);
        }
        if (config.data && config.data.length > 0) {
          wsData.push(...config.data);
        }
      }

      const ws = window.XLSX.utils.aoa_to_sheet(wsData);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, config.sheetName || 'Sheet1');

      window.XLSX.writeFile(wb, `${filename}.xlsx`);
      return true;
    } catch (error) {
      console.error('Error generating Excel spreadsheet:', error);
      return false;
    }
  },

  /**
   * Generate a PowerPoint presentation (.pptx)
   * @param {string} filename - Output filename (without .pptx extension)
   * @param {Object} config - Presentation configuration
   * @param {string} config.title - Presentation title
   * @param {Array} config.slides - Array of slide objects
   */
  generatePowerPoint: async function(filename, config) {
    try {
      if (!window.PptxGenJS) {
        console.error('PptxGenJS library not loaded. Make sure to include CDN link.');
        return false;
      }

      const pres = new window.PptxGenJS();
      
      // Set presentation properties
      pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
      pres.defineLayout({ name: 'LAYOUT2', width: 10, height: 7.5 });

      // Add title slide
      const titleSlide = pres.addSlide();
      titleSlide.background = { color: '132440' };
      titleSlide.addText(config.title, {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 1,
        fontSize: 54,
        bold: true,
        color: 'FFFFFF',
        align: 'center'
      });

      // Add content slides
      if (config.slides && config.slides.length > 0) {
        config.slides.forEach(slideConfig => {
          const slide = pres.addSlide();
          slide.background = { color: 'FFFFFF' };

          // Add slide title
          if (slideConfig.title) {
            slide.addText(slideConfig.title, {
              x: 0.5,
              y: 0.5,
              w: 9,
              h: 0.8,
              fontSize: 32,
              bold: true,
              color: '132440'
            });
          }

          // Add slide content
          if (slideConfig.content) {
            const contentArray = Array.isArray(slideConfig.content) ? slideConfig.content : [slideConfig.content];
            let yPos = slideConfig.title ? 1.5 : 0.5;

            contentArray.forEach((item, idx) => {
              if (typeof item === 'string') {
                slide.addText(item, {
                  x: 0.75,
                  y: yPos,
                  w: 8.5,
                  h: 0.5,
                  fontSize: 18,
                  color: '333333',
                  wrap: true
                });
                yPos += 0.6;
              }
            });
          }
        });
      }

      pres.save({ fileName: `${filename}.pptx` });
      return true;
    } catch (error) {
      console.error('Error generating PowerPoint presentation:', error);
      return false;
    }
  },

  /**
   * Generate a PDF document
   * @param {string} filename - Output filename (without .pdf extension)
   * @param {Object} config - PDF configuration
   * @param {string} config.title - Document title
   * @param {Array} config.sections - Array of section objects
   */
  generatePDF: function(filename, config) {
    try {
      console.log('generatePDF called with filename:', filename);
      console.log('window.jspdf available:', !!window.jspdf);
      console.log('window.jspdf content:', window.jspdf);

      // jsPDF UMD exports to window.jspdf (lowercase), constructor at window.jspdf.jsPDF
      let JsPDFConstructor = null;
      
      if (window.jspdf && window.jspdf.jsPDF) {
        JsPDFConstructor = window.jspdf.jsPDF;
        console.log('Found jsPDF constructor at window.jspdf.jsPDF');
      } else if (window.jspdf) {
        JsPDFConstructor = window.jspdf;
        console.log('Found jsPDF at window.jspdf');
      } else if (window.jsPDF) {
        JsPDFConstructor = window.jsPDF;
        console.log('Found jsPDF at window.jsPDF (legacy)');
      }

      if (!JsPDFConstructor) {
        console.error('jsPDF library not loaded. Available globals:', Object.keys(window).filter(k => k.toLowerCase().includes('pdf') || k.toLowerCase().includes('jspdf')));
        alert('PDF library is loading. Please try again in a moment.');
        return false;
      }

      const doc = new JsPDFConstructor({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Set font
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(19, 36, 64); // Navy color

      let yPos = 20;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      var lineHeight = 1.3; // multiplier for line spacing

      // Helper: add text with wrapping and automatic page breaks
      function addWrappedText(text, fontSize, isBold) {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        var wrapped = doc.splitTextToSize(String(text || ''), contentWidth);
        var lineSpacing = fontSize * 0.353 * lineHeight; // pt to mm, with line-height multiplier
        for (var i = 0; i < wrapped.length; i++) {
          if (yPos > pageHeight - 15) {
            doc.addPage();
            yPos = 15;
          }
          doc.text(wrapped[i], margin, yPos);
          yPos += lineSpacing;
        }
      }

      // Add title
      if (config.title) {
        doc.setTextColor(19, 36, 64);
        addWrappedText(config.title, 16, true);
        yPos += 5;
      }

      // Support both old API (sections) and new API (lines)
      if (config.lines && config.lines.length > 0) {
        // New API: flat array of {text, size, bold} objects
        config.lines.forEach(function(line) {
          var fontSize = line.size || 11;
          if (line.bold) {
            doc.setTextColor(19, 36, 64);
          } else {
            doc.setTextColor(51, 51, 51);
          }
          addWrappedText(line.text, fontSize, !!line.bold);
          yPos += (fontSize * 0.12); // small gap between items
        });
      } else if (config.sections && config.sections.length > 0) {
        config.sections.forEach(function(section) {
          // Check if we need a new page
          if (yPos > pageHeight - 25) {
            doc.addPage();
            yPos = 15;
          }

          // Add section heading
          doc.setTextColor(19, 36, 64);
          addWrappedText(section.heading, 14, true);
          yPos += 2;

          // Add section content
          doc.setTextColor(51, 51, 51);
          const content = Array.isArray(section.content) ? section.content : [section.content];
          content.forEach(function(item) {
            if (typeof item === 'string') {
              addWrappedText(item, 11, false);
              yPos += 3;
            }
          });

          yPos += 3;
        });
      }

      doc.save(`${filename}.pdf`);
      return true;
    } catch (error) {
      console.error('Error generating PDF document:', error);
      return false;
    }
  },

  /**
   * Create a Word document for Business Model Canvas
   * @param {string} filename - Output filename
   * @param {Object} data - Form data object
   */
  generateBusinessModelCanvasWord: async function(filename, data) {
    const sections = [
      {
        heading: 'Business Model Canvas',
        content: [
          'Company/Product: ' + (data.companyName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
        ]
      }
    ];

    // Add 9 blocks
    const blocks = [
      { key: 'keyPartners', label: 'Key Partners' },
      { key: 'keyActivities', label: 'Key Activities' },
      { key: 'valueProposition', label: 'Value Proposition' },
      { key: 'customerRelationships', label: 'Customer Relationships' },
      { key: 'customerSegments', label: 'Customer Segments' },
      { key: 'keyResources', label: 'Key Resources' },
      { key: 'channels', label: 'Channels' },
      { key: 'costStructure', label: 'Cost Structure' },
      { key: 'revenueStreams', label: 'Revenue Streams' }
    ];

    blocks.forEach(block => {
      sections.push({
        heading: block.label,
        content: data[block.key] || 'Not specified'
      });
    });

    return this.generateWord(filename, {
      title: 'Business Model Canvas',
      author: 'Generated from wasilzafar.com',
      sections: sections
    });
  },

  /**
   * Create a Word document for Lean Canvas
   * @param {string} filename - Output filename
   * @param {Object} data - Form data object
   */
  generateLeanCanvasWord: async function(filename, data) {
    const sections = [
      {
        heading: 'Lean Canvas',
        content: [
          'Product/Idea: ' + (data.productName || 'N/A'),
          'Founder: ' + (data.founderName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
        ]
      }
    ];

    const blocks = [
      { key: 'problem', label: 'Problem' },
      { key: 'solution', label: 'Solution' },
      { key: 'uniqueValueProposition', label: 'Unique Value Proposition' },
      { key: 'unfairAdvantage', label: 'Unfair Advantage' },
      { key: 'customerSegments', label: 'Customer Segments' },
      { key: 'keyMetrics', label: 'Key Metrics' },
      { key: 'channels', label: 'Channels' },
      { key: 'costStructure', label: 'Cost Structure' },
      { key: 'revenueStreams', label: 'Revenue Streams' }
    ];

    blocks.forEach(block => {
      sections.push({
        heading: block.label,
        content: data[block.key] || 'Not specified'
      });
    });

    return this.generateWord(filename, {
      title: 'Lean Canvas',
      author: 'Generated from wasilzafar.com',
      sections: sections
    });
  },

  /**
   * Create an Excel spreadsheet for Business Model Canvas
   * @param {string} filename - Output filename
   * @param {Object} data - Form data object
   */
  generateBusinessModelCanvasExcel: function(filename, data) {
    const headers = ['Block', 'Description'];
    const rows = [
      ['Company/Product Name', data.companyName || ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Key Partners', data.keyPartners || ''],
      ['Key Activities', data.keyActivities || ''],
      ['Value Proposition', data.valueProposition || ''],
      ['Customer Relationships', data.customerRelationships || ''],
      ['Customer Segments', data.customerSegments || ''],
      ['Key Resources', data.keyResources || ''],
      ['Channels', data.channels || ''],
      ['Cost Structure', data.costStructure || ''],
      ['Revenue Streams', data.revenueStreams || '']
    ];

    return this.generateExcel(filename, {
      sheetName: 'Business Model Canvas',
      headers: headers,
      data: rows
    });
  },

  /**
   * Create an Excel spreadsheet for Lean Canvas
   * @param {string} filename - Output filename
   * @param {Object} data - Form data object
   */
  generateLeanCanvasExcel: function(filename, data) {
    const headers = ['Block', 'Description'];
    const rows = [
      ['Product/Idea Name', data.productName || ''],
      ['Founder Name', data.founderName || ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Problem', data.problem || ''],
      ['Solution', data.solution || ''],
      ['Unique Value Proposition', data.uniqueValueProposition || ''],
      ['Unfair Advantage', data.unfairAdvantage || ''],
      ['Customer Segments', data.customerSegments || ''],
      ['Key Metrics', data.keyMetrics || ''],
      ['Channels', data.channels || ''],
      ['Cost Structure', data.costStructure || ''],
      ['Revenue Streams', data.revenueStreams || '']
    ];

    return this.generateExcel(filename, {
      sheetName: 'Lean Canvas',
      headers: headers,
      data: rows
    });
  },

  /**
   * Create a PDF document for Business Model Canvas
   * @param {string} filename - Output filename
   * @param {Object} data - Form data object
   */
  generateBusinessModelCanvasPDF: function(filename, data) {
    const sections = [
      {
        heading: 'BUSINESS MODEL CANVAS',
        content: `Company/Product: ${data.companyName || 'N/A'}\nDate: ${new Date().toLocaleDateString()}`
      },
      { heading: 'Key Partners', content: data.keyPartners || 'Not specified' },
      { heading: 'Key Activities', content: data.keyActivities || 'Not specified' },
      { heading: 'Value Proposition', content: data.valueProposition || 'Not specified' },
      { heading: 'Customer Relationships', content: data.customerRelationships || 'Not specified' },
      { heading: 'Customer Segments', content: data.customerSegments || 'Not specified' },
      { heading: 'Key Resources', content: data.keyResources || 'Not specified' },
      { heading: 'Channels', content: data.channels || 'Not specified' },
      { heading: 'Cost Structure', content: data.costStructure || 'Not specified' },
      { heading: 'Revenue Streams', content: data.revenueStreams || 'Not specified' }
    ];

    return this.generatePDF(filename, {
      title: 'Business Model Canvas',
      sections: sections
    });
  },

  generateBusinessModelCanvasPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }
    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.companyName || 'Company') + ' — Business Model Canvas';
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

    // Title slide
    var s1 = pres.addSlide(); s1.background = { color: C.navy };
    s1.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.teal } });
    s1.addText(data.companyName || 'Company Name', { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    s1.addText('Business Model Canvas', { x: 0.6, y: 2.5, w: 8.8, h: 0.7, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });
    s1.addText(new Date().toLocaleDateString(), { x: 0.6, y: 4.2, w: 8.8, h: 0.5, fontSize: 14, color: C.gray, fontFace: 'Arial', align: 'center' });

    // Helper: content slide with accent bar
    function addSlide(title, bodyText, accent) {
      accent = accent || C.teal;
      var sl = pres.addSlide(); sl.background = { color: C.white };
      sl.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: accent } });
      sl.addText(title, { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
      sl.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.0, w: 2.0, h: 0.04, fill: { color: accent } });
      sl.addText(bodyText || 'Not specified', { x: 0.6, y: 1.3, w: 8.8, h: 3.8, fontSize: 16, color: '333333', fontFace: 'Arial', wrap: true, valign: 'top', lineSpacingMultiple: 1.4 });
      sl.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
      return sl;
    }

    // Canvas blocks across 5 slides (paired logically)
    addSlide('Value Proposition', data.valueProposition, C.crimson);
    addSlide('Customer Segments', data.customerSegments, C.teal);
    addSlide('Channels & Customer Relationships', 'Channels:\n' + (data.channels || 'Not specified') + '\n\nCustomer Relationships:\n' + (data.customerRelationships || 'Not specified'), C.blue);
    addSlide('Key Partners, Activities & Resources', 'Key Partners:\n' + (data.keyPartners || 'Not specified') + '\n\nKey Activities:\n' + (data.keyActivities || 'Not specified') + '\n\nKey Resources:\n' + (data.keyResources || 'Not specified'), C.teal);
    addSlide('Cost Structure & Revenue Streams', 'Cost Structure:\n' + (data.costStructure || 'Not specified') + '\n\nRevenue Streams:\n' + (data.revenueStreams || 'Not specified'), C.crimson);

    // Closing slide
    var end = pres.addSlide(); end.background = { color: C.navy };
    end.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    end.addText(data.companyName || 'Company', { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    end.addText('Business Model Canvas', { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 18, color: C.teal, fontFace: 'Arial', align: 'center' });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  /**
   * Create a PDF document for Lean Canvas
   * @param {string} filename - Output filename
   * @param {Object} data - Form data object
   */
  generateLeanCanvasPDF: function(filename, data) {
    const sections = [
      {
        heading: 'LEAN CANVAS',
        content: `Product/Idea: ${data.productName || 'N/A'}\nFounder: ${data.founderName || 'N/A'}\nDate: ${new Date().toLocaleDateString()}`
      },
      { heading: 'Problem', content: data.problem || 'Not specified' },
      { heading: 'Solution', content: data.solution || 'Not specified' },
      { heading: 'Unique Value Proposition', content: data.uniqueValueProposition || 'Not specified' },
      { heading: 'Unfair Advantage', content: data.unfairAdvantage || 'Not specified' },
      { heading: 'Customer Segments', content: data.customerSegments || 'Not specified' },
      { heading: 'Key Metrics', content: data.keyMetrics || 'Not specified' },
      { heading: 'Channels', content: data.channels || 'Not specified' },
      { heading: 'Cost Structure', content: data.costStructure || 'Not specified' },
      { heading: 'Revenue Streams', content: data.revenueStreams || 'Not specified' }
    ];

    return this.generatePDF(filename, {
      title: 'Lean Canvas',
      sections: sections
    });
  },

  generateLeanCanvasPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }
    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.productName || 'Startup') + ' — Lean Canvas';
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

    // Title slide
    var s1 = pres.addSlide(); s1.background = { color: C.navy };
    s1.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.crimson } });
    s1.addText(data.productName || 'Product Name', { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    s1.addText('Lean Canvas', { x: 0.6, y: 2.5, w: 8.8, h: 0.7, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });
    if (data.founderName) s1.addText('Founder: ' + data.founderName, { x: 0.6, y: 3.5, w: 8.8, h: 0.4, fontSize: 16, color: C.gray, fontFace: 'Arial', align: 'center' });

    function addSlide(title, bodyText, accent) {
      accent = accent || C.teal;
      var sl = pres.addSlide(); sl.background = { color: C.white };
      sl.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: accent } });
      sl.addText(title, { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
      sl.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.0, w: 2.0, h: 0.04, fill: { color: accent } });
      sl.addText(bodyText || 'Not specified', { x: 0.6, y: 1.3, w: 8.8, h: 3.8, fontSize: 16, color: '333333', fontFace: 'Arial', wrap: true, valign: 'top', lineSpacingMultiple: 1.4 });
      sl.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    }

    addSlide('Problem', data.problem, C.crimson);
    addSlide('Solution', data.solution, C.teal);
    addSlide('Unique Value Proposition', data.uniqueValueProposition, C.blue);
    addSlide('Unfair Advantage', data.unfairAdvantage, C.crimson);
    addSlide('Customer Segments & Channels', 'Customer Segments:\n' + (data.customerSegments || 'Not specified') + '\n\nChannels:\n' + (data.channels || 'Not specified'), C.teal);
    addSlide('Key Metrics', data.keyMetrics, C.blue);
    addSlide('Cost Structure & Revenue Streams', 'Cost Structure:\n' + (data.costStructure || 'Not specified') + '\n\nRevenue Streams:\n' + (data.revenueStreams || 'Not specified'), C.crimson);

    var end = pres.addSlide(); end.background = { color: C.navy };
    end.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    end.addText(data.productName || 'Product', { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    end.addText('Lean Canvas', { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 18, color: C.teal, fontFace: 'Arial', align: 'center' });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // TAM/SAM/SOM Calculator
  // ============================================================

  generateTamSamSomWord: async function(filename, data) {
    var tam = parseFloat(data.totalMarketSize) * (parseFloat(data.tamPercent) / 100);
    var sam = tam * (parseFloat(data.samGeoPercent) / 100) * (parseFloat(data.samSegmentPercent) / 100);
    var som = sam * (parseFloat(data.somSharePercent) / 100);
    var sections = [
      { heading: 'TAM/SAM/SOM Market Sizing', content: [
          'Company/Product: ' + (data.companyName || 'N/A'),
          'Industry: ' + (data.industry || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Total Addressable Market (TAM)', content: [
          'Total Industry Size: $' + DocGenerator._fmt(data.totalMarketSize),
          'Addressable %: ' + data.tamPercent + '%',
          'TAM: $' + DocGenerator._fmt(tam)
      ]},
      { heading: 'Serviceable Addressable Market (SAM)', content: [
          'Geographic Focus %: ' + data.samGeoPercent + '%',
          'Segment Focus %: ' + data.samSegmentPercent + '%',
          'SAM: $' + DocGenerator._fmt(sam)
      ]},
      { heading: 'Serviceable Obtainable Market (SOM)', content: [
          'Realistic Market Share %: ' + data.somSharePercent + '%',
          'Timeline: ' + (data.somTimeline || '3 years'),
          'SOM: $' + DocGenerator._fmt(som)
      ]},
      { heading: 'Assumptions & Notes', content: [data.assumptions || 'None specified'] }
    ];
    return this.generateWord(filename, { title: 'TAM/SAM/SOM Market Sizing', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateTamSamSomExcel: function(filename, data) {
    var tam = parseFloat(data.totalMarketSize) * (parseFloat(data.tamPercent) / 100);
    var sam = tam * (parseFloat(data.samGeoPercent) / 100) * (parseFloat(data.samSegmentPercent) / 100);
    var som = sam * (parseFloat(data.somSharePercent) / 100);
    return this.generateExcel(filename, {
      sheetName: 'TAM-SAM-SOM',
      headers: ['Metric', 'Value'],
      data: [
        ['Company/Product', data.companyName || ''],
        ['Industry', data.industry || ''],
        ['Date', new Date().toLocaleDateString()],
        ['', ''],
        ['Total Industry Size ($)', parseFloat(data.totalMarketSize) || 0],
        ['Addressable % of Industry', (parseFloat(data.tamPercent) || 0) + '%'],
        ['TAM ($)', Math.round(tam)],
        ['', ''],
        ['Geographic Focus %', (parseFloat(data.samGeoPercent) || 0) + '%'],
        ['Segment Focus %', (parseFloat(data.samSegmentPercent) || 0) + '%'],
        ['SAM ($)', Math.round(sam)],
        ['', ''],
        ['Realistic Market Share %', (parseFloat(data.somSharePercent) || 0) + '%'],
        ['Timeline', data.somTimeline || '3 years'],
        ['SOM ($)', Math.round(som)],
        ['', ''],
        ['Assumptions', data.assumptions || '']
      ]
    });
  },

  generateTamSamSomPDF: function(filename, data) {
    var tam = parseFloat(data.totalMarketSize) * (parseFloat(data.tamPercent) / 100);
    var sam = tam * (parseFloat(data.samGeoPercent) / 100) * (parseFloat(data.samSegmentPercent) / 100);
    var som = sam * (parseFloat(data.somSharePercent) / 100);
    return this.generatePDF(filename, {
      title: 'TAM/SAM/SOM Market Sizing',
      sections: [
        { heading: 'TAM/SAM/SOM MARKET SIZING', content: 'Company: ' + (data.companyName || 'N/A') + '\nIndustry: ' + (data.industry || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
        { heading: 'Total Addressable Market (TAM)', content: 'Total Industry: $' + DocGenerator._fmt(data.totalMarketSize) + '\nAddressable %: ' + data.tamPercent + '%\nTAM: $' + DocGenerator._fmt(tam) },
        { heading: 'Serviceable Addressable Market (SAM)', content: 'Geographic %: ' + data.samGeoPercent + '%\nSegment %: ' + data.samSegmentPercent + '%\nSAM: $' + DocGenerator._fmt(sam) },
        { heading: 'Serviceable Obtainable Market (SOM)', content: 'Market Share %: ' + data.somSharePercent + '%\nTimeline: ' + (data.somTimeline || '3 years') + '\nSOM: $' + DocGenerator._fmt(som) },
        { heading: 'Assumptions', content: data.assumptions || 'None specified' }
      ]
    });
  },

  // ============================================================
  // SWOT Analysis Canvas
  // ============================================================

  generateSwotAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'SWOT Analysis', content: [
          'Company/Product: ' + (data.companyName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Strengths (Internal)', content: (data.strengths || 'Not specified').split('\n') },
      { heading: 'Weaknesses (Internal)', content: (data.weaknesses || 'Not specified').split('\n') },
      { heading: 'Opportunities (External)', content: (data.opportunities || 'Not specified').split('\n') },
      { heading: 'Threats (External)', content: (data.threats || 'Not specified').split('\n') },
      { heading: 'Strategic Actions', content: [
          'SO Strategies (Strengths → Opportunities): ' + (data.soStrategies || 'Not specified'),
          'WO Strategies (Weaknesses → Opportunities): ' + (data.woStrategies || 'Not specified'),
          'ST Strategies (Strengths → Threats): ' + (data.stStrategies || 'Not specified'),
          'WT Strategies (Weaknesses → Threats): ' + (data.wtStrategies || 'Not specified')
      ]}
    ];
    return this.generateWord(filename, { title: 'SWOT Analysis', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateSwotAnalysisExcel: function(filename, data) {
    return this.generateExcel(filename, {
      sheetName: 'SWOT Analysis',
      headers: ['Category', 'Details'],
      data: [
        ['Company/Product', data.companyName || ''],
        ['Date', new Date().toLocaleDateString()],
        ['', ''],
        ['STRENGTHS (Internal)', data.strengths || ''],
        ['WEAKNESSES (Internal)', data.weaknesses || ''],
        ['OPPORTUNITIES (External)', data.opportunities || ''],
        ['THREATS (External)', data.threats || ''],
        ['', ''],
        ['SO Strategies', data.soStrategies || ''],
        ['WO Strategies', data.woStrategies || ''],
        ['ST Strategies', data.stStrategies || ''],
        ['WT Strategies', data.wtStrategies || '']
      ]
    });
  },

  generateSwotAnalysisPDF: function(filename, data) {
    return this.generatePDF(filename, {
      title: 'SWOT Analysis',
      sections: [
        { heading: 'SWOT ANALYSIS', content: 'Company: ' + (data.companyName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
        { heading: 'Strengths (Internal)', content: data.strengths || 'Not specified' },
        { heading: 'Weaknesses (Internal)', content: data.weaknesses || 'Not specified' },
        { heading: 'Opportunities (External)', content: data.opportunities || 'Not specified' },
        { heading: 'Threats (External)', content: data.threats || 'Not specified' },
        { heading: 'Strategic Actions', content: 'SO: ' + (data.soStrategies || 'N/A') + '\nWO: ' + (data.woStrategies || 'N/A') + '\nST: ' + (data.stStrategies || 'N/A') + '\nWT: ' + (data.wtStrategies || 'N/A') }
      ]
    });
  },

  generateSwotAnalysisPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }
    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.companyName || 'Company') + ' — SWOT Analysis';
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

    // Title slide
    var s1 = pres.addSlide(); s1.background = { color: C.navy };
    s1.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.teal } });
    s1.addText(data.companyName || 'Company Name', { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    s1.addText('SWOT Analysis', { x: 0.6, y: 2.5, w: 8.8, h: 0.7, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });

    // 2x2 SWOT grid on one slide
    var grid = pres.addSlide(); grid.background = { color: C.white };
    grid.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.teal } });
    grid.addText('SWOT Matrix', { x: 0.6, y: 0.2, w: 8.8, h: 0.6, fontSize: 24, bold: true, color: C.navy, fontFace: 'Arial' });
    grid.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    // Strengths (top-left)
    grid.addText('STRENGTHS', { x: 0.4, y: 1.0, w: 4.5, h: 0.4, fontSize: 14, bold: true, color: C.white, fontFace: 'Arial', fill: { color: C.teal }, align: 'center' });
    grid.addText(data.strengths || 'Not specified', { x: 0.4, y: 1.4, w: 4.5, h: 1.7, fontSize: 12, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, line: { color: 'CCCCCC', width: 1 }, margin: [6, 6, 6, 6] });
    // Weaknesses (top-right)
    grid.addText('WEAKNESSES', { x: 5.1, y: 1.0, w: 4.5, h: 0.4, fontSize: 14, bold: true, color: C.white, fontFace: 'Arial', fill: { color: C.crimson }, align: 'center' });
    grid.addText(data.weaknesses || 'Not specified', { x: 5.1, y: 1.4, w: 4.5, h: 1.7, fontSize: 12, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, line: { color: 'CCCCCC', width: 1 }, margin: [6, 6, 6, 6] });
    // Opportunities (bottom-left)
    grid.addText('OPPORTUNITIES', { x: 0.4, y: 3.2, w: 4.5, h: 0.4, fontSize: 14, bold: true, color: C.white, fontFace: 'Arial', fill: { color: C.blue }, align: 'center' });
    grid.addText(data.opportunities || 'Not specified', { x: 0.4, y: 3.6, w: 4.5, h: 1.7, fontSize: 12, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, line: { color: 'CCCCCC', width: 1 }, margin: [6, 6, 6, 6] });
    // Threats (bottom-right)
    grid.addText('THREATS', { x: 5.1, y: 3.2, w: 4.5, h: 0.4, fontSize: 14, bold: true, color: C.white, fontFace: 'Arial', fill: { color: C.navy }, align: 'center' });
    grid.addText(data.threats || 'Not specified', { x: 5.1, y: 3.6, w: 4.5, h: 1.7, fontSize: 12, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, line: { color: 'CCCCCC', width: 1 }, margin: [6, 6, 6, 6] });

    // Strategic Actions slide
    var strat = pres.addSlide(); strat.background = { color: C.white };
    strat.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.blue } });
    strat.addText('Strategic Actions', { x: 0.6, y: 0.3, w: 8.8, h: 0.6, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
    strat.addShape(pres.ShapeType.rect, { x: 0.6, y: 0.95, w: 2.0, h: 0.04, fill: { color: C.blue } });
    strat.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    var strategies = [
      { text: 'SO (Strengths → Opportunities)', options: { fontSize: 14, bold: true, color: C.teal, breakLine: true } },
      { text: data.soStrategies || 'Not specified', options: { fontSize: 13, color: '333333', breakLine: true, lineSpacingMultiple: 1.2 } },
      { text: '', options: { fontSize: 8, breakLine: true } },
      { text: 'WO (Weaknesses → Opportunities)', options: { fontSize: 14, bold: true, color: C.blue, breakLine: true } },
      { text: data.woStrategies || 'Not specified', options: { fontSize: 13, color: '333333', breakLine: true, lineSpacingMultiple: 1.2 } },
      { text: '', options: { fontSize: 8, breakLine: true } },
      { text: 'ST (Strengths → Threats)', options: { fontSize: 14, bold: true, color: C.crimson, breakLine: true } },
      { text: data.stStrategies || 'Not specified', options: { fontSize: 13, color: '333333', breakLine: true, lineSpacingMultiple: 1.2 } },
      { text: '', options: { fontSize: 8, breakLine: true } },
      { text: 'WT (Weaknesses → Threats)', options: { fontSize: 14, bold: true, color: C.navy, breakLine: true } },
      { text: data.wtStrategies || 'Not specified', options: { fontSize: 13, color: '333333', breakLine: true, lineSpacingMultiple: 1.2 } }
    ];
    strat.addText(strategies, { x: 0.6, y: 1.2, w: 8.8, h: 3.9, fontFace: 'Arial', valign: 'top' });

    // Closing
    var end = pres.addSlide(); end.background = { color: C.navy };
    end.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    end.addText(data.companyName || 'Company', { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    end.addText('SWOT Analysis', { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 18, color: C.teal, fontFace: 'Arial', align: 'center' });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  /**
   * Generate ICE Scoring Calculator as Word document
   */
  generateIceScoringWord: async function(filename, data) {
    var ideas = data.ideas || [];
    var scored = ideas.map(function(idea) {
      var score = (parseFloat(idea.impact) * parseFloat(idea.confidence) * parseFloat(idea.ease)) / 10;
      return { name: idea.name, impact: idea.impact, confidence: idea.confidence, ease: idea.ease, score: Math.round(score * 10) / 10 };
    });
    scored.sort(function(a, b) { return b.score - a.score; });
    var sections = [
      { heading: 'ICE Scoring Calculator', content: [
          'Prepared by: ' + (data.evaluatorName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString(),
          'Formula: ICE Score = (Impact × Confidence × Ease) / 10'
      ]}
    ];
    scored.forEach(function(idea, i) {
      sections.push({
        heading: '#' + (i + 1) + ': ' + idea.name + ' (Score: ' + idea.score + ')',
        content: [
          'Impact: ' + idea.impact + '/10',
          'Confidence: ' + idea.confidence + '/10',
          'Ease: ' + idea.ease + '/10',
          'ICE Score: ' + idea.score
        ]
      });
    });
    if (data.notes) sections.push({ heading: 'Notes', content: [data.notes] });
    return this.generateWord(filename, { title: 'ICE Scoring Calculator', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateIceScoringExcel: function(filename, data) {
    var ideas = data.ideas || [];
    var scored = ideas.map(function(idea) {
      var score = (parseFloat(idea.impact) * parseFloat(idea.confidence) * parseFloat(idea.ease)) / 10;
      return { name: idea.name, impact: parseFloat(idea.impact), confidence: parseFloat(idea.confidence), ease: parseFloat(idea.ease), score: Math.round(score * 10) / 10 };
    });
    scored.sort(function(a, b) { return b.score - a.score; });
    var rows = [['Rank', 'Idea', 'Impact (1-10)', 'Confidence (1-10)', 'Ease (1-10)', 'ICE Score', 'Priority']];
    scored.forEach(function(idea, i) {
      var priority = i === 0 ? '★ TOP PRIORITY' : (i < 3 ? 'High' : 'Consider');
      rows.push([i + 1, idea.name, idea.impact, idea.confidence, idea.ease, idea.score, priority]);
    });
    rows.push([]);
    rows.push(['Evaluator', data.evaluatorName || 'N/A']);
    rows.push(['Date', new Date().toLocaleDateString()]);
    rows.push(['Formula', 'ICE Score = (Impact × Confidence × Ease) / 10']);
    if (data.notes) { rows.push([]); rows.push(['Notes', data.notes]); }
    return this.generateExcel(filename, { title: 'ICE Scoring Calculator', rows: rows });
  },

  generateIceScoringPDF: function(filename, data) {
    var ideas = data.ideas || [];
    var scored = ideas.map(function(idea) {
      var score = (parseFloat(idea.impact) * parseFloat(idea.confidence) * parseFloat(idea.ease)) / 10;
      return { name: idea.name, impact: idea.impact, confidence: idea.confidence, ease: idea.ease, score: Math.round(score * 10) / 10 };
    });
    scored.sort(function(a, b) { return b.score - a.score; });
    var lines = [
      { text: 'ICE SCORING CALCULATOR', size: 18, bold: true },
      { text: 'Evaluator: ' + (data.evaluatorName || 'N/A') + '  |  Date: ' + new Date().toLocaleDateString(), size: 10 },
      { text: 'Formula: ICE Score = (Impact × Confidence × Ease) / 10', size: 10 },
      { text: ' ', size: 8 },
      { text: 'RANKED RESULTS', size: 14, bold: true }
    ];
    scored.forEach(function(idea, i) {
      var star = i === 0 ? ' ★' : '';
      lines.push({ text: '#' + (i + 1) + ': ' + idea.name + ' — Score: ' + idea.score + star, size: 12, bold: true });
      lines.push({ text: '    Impact: ' + idea.impact + '  |  Confidence: ' + idea.confidence + '  |  Ease: ' + idea.ease, size: 10 });
    });
    if (data.notes) {
      lines.push({ text: ' ', size: 8 });
      lines.push({ text: 'NOTES', size: 14, bold: true });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'ICE Scoring Calculator', lines: lines });
  },

  /**
   * Generate Problem-Solution Fit Canvas as Word document
   */
  generateProblemSolutionFitWord: async function(filename, data) {
    var sections = [
      { heading: 'Problem-Solution Fit Canvas', content: [
          'Company/Product: ' + (data.companyName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'PROBLEM SIDE', content: [] },
      { heading: 'Customer Segment', content: (data.customerSegment || 'Not defined').split('\n') },
      { heading: 'Customer Jobs', content: (data.customerJobs || 'Not defined').split('\n') },
      { heading: 'Pains', content: (data.pains || 'Not defined').split('\n') },
      { heading: 'SOLUTION SIDE', content: [] },
      { heading: 'Value Proposition', content: (data.valueProposition || 'Not defined').split('\n') },
      { heading: 'Pain Relievers', content: (data.painRelievers || 'Not defined').split('\n') },
      { heading: 'Gain Creators', content: (data.gainCreators || 'Not defined').split('\n') }
    ];
    if (data.evidence) sections.push({ heading: 'Evidence & Validation', content: data.evidence.split('\n') });
    return this.generateWord(filename, { title: 'Problem-Solution Fit Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateProblemSolutionFitExcel: function(filename, data) {
    var rows = [
      ['Problem-Solution Fit Canvas'],
      ['Company/Product', data.companyName || 'N/A'],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['PROBLEM SIDE', '', 'SOLUTION SIDE', ''],
      ['Customer Segment', data.customerSegment || '', 'Value Proposition', data.valueProposition || ''],
      ['Customer Jobs', data.customerJobs || '', 'Gain Creators', data.gainCreators || ''],
      ['Pains', data.pains || '', 'Pain Relievers', data.painRelievers || ''],
      [],
      ['Evidence & Validation'],
      [data.evidence || 'None provided']
    ];
    return this.generateExcel(filename, { title: 'Problem-Solution Fit Canvas', rows: rows });
  },

  generateProblemSolutionFitPDF: function(filename, data) {
    var lines = [
      { text: 'PROBLEM-SOLUTION FIT CANVAS', size: 18, bold: true },
      { text: 'Company: ' + (data.companyName || 'N/A') + '  |  Date: ' + new Date().toLocaleDateString(), size: 10 },
      { text: ' ', size: 8 },
      { text: '── PROBLEM SIDE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'CUSTOMER SEGMENT', size: 12, bold: true },
      { text: data.customerSegment || 'Not defined', size: 10 },
      { text: ' ', size: 4 },
      { text: 'CUSTOMER JOBS', size: 12, bold: true },
      { text: data.customerJobs || 'Not defined', size: 10 },
      { text: ' ', size: 4 },
      { text: 'PAINS', size: 12, bold: true },
      { text: data.pains || 'Not defined', size: 10 },
      { text: ' ', size: 8 },
      { text: '── SOLUTION SIDE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'VALUE PROPOSITION', size: 12, bold: true },
      { text: data.valueProposition || 'Not defined', size: 10 },
      { text: ' ', size: 4 },
      { text: 'PAIN RELIEVERS', size: 12, bold: true },
      { text: data.painRelievers || 'Not defined', size: 10 },
      { text: ' ', size: 4 },
      { text: 'GAIN CREATORS', size: 12, bold: true },
      { text: data.gainCreators || 'Not defined', size: 10 }
    ];
    if (data.evidence) {
      lines.push({ text: ' ', size: 8 });
      lines.push({ text: 'EVIDENCE & VALIDATION', size: 14, bold: true });
      lines.push({ text: data.evidence, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Problem-Solution Fit Canvas', lines: lines });
  },

  generateProblemSolutionFitPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }
    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.companyName || 'Company') + ' — Problem-Solution Fit';
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

    // Title slide
    var s1 = pres.addSlide(); s1.background = { color: C.navy };
    s1.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.crimson } });
    s1.addText(data.companyName || 'Company Name', { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    s1.addText('Problem-Solution Fit Canvas', { x: 0.6, y: 2.5, w: 8.8, h: 0.7, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });

    function addSlide(title, bodyText, accent) {
      accent = accent || C.teal;
      var sl = pres.addSlide(); sl.background = { color: C.white };
      sl.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: accent } });
      sl.addText(title, { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
      sl.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.0, w: 2.0, h: 0.04, fill: { color: accent } });
      sl.addText(bodyText || 'Not specified', { x: 0.6, y: 1.3, w: 8.8, h: 3.8, fontSize: 16, color: '333333', fontFace: 'Arial', wrap: true, valign: 'top', lineSpacingMultiple: 1.4 });
      sl.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    }

    // Problem side
    addSlide('Customer Segment', data.customerSegment, C.crimson);
    addSlide('Customer Jobs & Pains', 'Customer Jobs:\n' + (data.customerJobs || 'Not defined') + '\n\nPains:\n' + (data.pains || 'Not defined'), C.crimson);
    // Solution side
    addSlide('Value Proposition', data.valueProposition, C.teal);
    addSlide('Pain Relievers & Gain Creators', 'Pain Relievers:\n' + (data.painRelievers || 'Not defined') + '\n\nGain Creators:\n' + (data.gainCreators || 'Not defined'), C.teal);
    // Evidence
    if (data.evidence) addSlide('Evidence & Validation', data.evidence, C.blue);

    var end = pres.addSlide(); end.background = { color: C.navy };
    end.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    end.addText(data.companyName || 'Company', { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    end.addText('Problem-Solution Fit', { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 18, color: C.teal, fontFace: 'Arial', align: 'center' });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  /**
   * Generate 12-Month SaaS Financial Model as Word document
   */
  generateFinancialModelWord: async function(filename, data) {
    var months = this._buildFinancialModel(data);
    var sections = [
      { heading: '12-Month SaaS Financial Model', content: [
          'Company: ' + (data.companyName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Assumptions', content: [
          'Starting Customers: ' + (data.startingCustomers || 0),
          'MRR per Customer: $' + (data.mrr || 0),
          'Monthly Growth Rate: ' + (data.growthRate || 0) + '%',
          'Monthly Churn Rate: ' + (data.churnRate || 0) + '%',
          'CAC per Customer: $' + (data.cac || 0),
          'Monthly Fixed Costs: $' + DocGenerator._fmt(data.fixedCosts)
      ]}
    ];
    months.forEach(function(m) {
      sections.push({
        heading: 'Month ' + m.month,
        content: [
          'Starting Customers: ' + m.startCustomers,
          'New Customers: ' + m.newCustomers,
          'Churned: ' + m.churned,
          'Ending Customers: ' + m.endCustomers,
          'MRR: $' + DocGenerator._fmt(m.mrr),
          'Acquisition Cost: $' + DocGenerator._fmt(m.acqCost),
          'Fixed Costs: $' + DocGenerator._fmt(m.fixedCosts),
          'Net P&L: $' + DocGenerator._fmt(m.pnl) + (m.pnl >= 0 ? ' ✓ Profitable' : ' ✗ Loss')
        ]
      });
    });
    var breakEven = months.findIndex(function(m) { return m.pnl >= 0; });
    sections.push({ heading: 'Summary', content: [
      'Break-even Month: ' + (breakEven >= 0 ? 'Month ' + months[breakEven].month : 'Not within 12 months'),
      'Month 12 MRR: $' + DocGenerator._fmt(months[11].mrr),
      'Month 12 Customers: ' + months[11].endCustomers,
      'Total Revenue (12mo): $' + DocGenerator._fmt(months.reduce(function(s,m){return s+m.mrr;},0)),
      'Total Costs (12mo): $' + DocGenerator._fmt(months.reduce(function(s,m){return s+m.acqCost+m.fixedCosts;},0))
    ]});
    if (data.notes) sections.push({ heading: 'Notes', content: [data.notes] });
    return this.generateWord(filename, { title: '12-Month SaaS Financial Model', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateFinancialModelExcel: function(filename, data) {
    var months = this._buildFinancialModel(data);
    var rows = [
      ['12-Month SaaS Financial Model'],
      ['Company', data.companyName || 'N/A'],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['Assumptions'],
      ['Starting Customers', parseFloat(data.startingCustomers) || 0],
      ['MRR per Customer ($)', parseFloat(data.mrr) || 0],
      ['Monthly Growth (%)', parseFloat(data.growthRate) || 0],
      ['Monthly Churn (%)', parseFloat(data.churnRate) || 0],
      ['CAC per Customer ($)', parseFloat(data.cac) || 0],
      ['Fixed Costs/Month ($)', parseFloat(data.fixedCosts) || 0],
      [],
      ['Month', 'Start Cust.', 'New Cust.', 'Churned', 'End Cust.', 'MRR ($)', 'Acq. Cost ($)', 'Fixed Costs ($)', 'Net P&L ($)']
    ];
    months.forEach(function(m) {
      rows.push([m.month, m.startCustomers, m.newCustomers, m.churned, m.endCustomers, Math.round(m.mrr), Math.round(m.acqCost), Math.round(m.fixedCosts), Math.round(m.pnl)]);
    });
    rows.push([]);
    var breakEven = months.findIndex(function(m) { return m.pnl >= 0; });
    rows.push(['Break-even', breakEven >= 0 ? 'Month ' + months[breakEven].month : 'Not within 12 months']);
    rows.push(['Total Revenue', Math.round(months.reduce(function(s,m){return s+m.mrr;},0))]);
    rows.push(['Total Costs', Math.round(months.reduce(function(s,m){return s+m.acqCost+m.fixedCosts;},0))]);
    if (data.notes) { rows.push([]); rows.push(['Notes', data.notes]); }
    return this.generateExcel(filename, { title: '12-Month Financial Model', rows: rows });
  },

  generateFinancialModelPDF: function(filename, data) {
    var months = this._buildFinancialModel(data);
    var lines = [
      { text: '12-MONTH SaaS FINANCIAL MODEL', size: 18, bold: true },
      { text: 'Company: ' + (data.companyName || 'N/A') + '  |  Date: ' + new Date().toLocaleDateString(), size: 10 },
      { text: ' ', size: 6 },
      { text: 'ASSUMPTIONS', size: 14, bold: true },
      { text: 'Starting: ' + data.startingCustomers + ' cust  |  MRR: $' + data.mrr + '  |  Growth: ' + data.growthRate + '%  |  Churn: ' + data.churnRate + '%  |  CAC: $' + data.cac + '  |  Fixed: $' + DocGenerator._fmt(data.fixedCosts), size: 9 },
      { text: ' ', size: 6 },
      { text: 'MONTHLY PROJECTIONS', size: 14, bold: true }
    ];
    months.forEach(function(m) {
      var sign = m.pnl >= 0 ? '+' : '';
      lines.push({ text: 'M' + m.month + ':  ' + m.endCustomers + ' cust  |  MRR $' + DocGenerator._fmt(m.mrr) + '  |  Costs $' + DocGenerator._fmt(m.acqCost + m.fixedCosts) + '  |  P&L ' + sign + '$' + DocGenerator._fmt(m.pnl), size: 9 });
    });
    var breakEven = months.findIndex(function(m) { return m.pnl >= 0; });
    lines.push({ text: ' ', size: 6 });
    lines.push({ text: 'SUMMARY', size: 14, bold: true });
    lines.push({ text: 'Break-even: ' + (breakEven >= 0 ? 'Month ' + months[breakEven].month : 'Not within 12 months'), size: 11 });
    lines.push({ text: 'Month 12 MRR: $' + DocGenerator._fmt(months[11].mrr) + '  |  Month 12 Customers: ' + months[11].endCustomers, size: 11 });
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: 'NOTES', size: 14, bold: true });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: '12-Month Financial Model', lines: lines });
  },

  /** @private Build 12-month model array from inputs */
  _buildFinancialModel: function(data) {
    var customers = parseFloat(data.startingCustomers) || 10;
    var mrr = parseFloat(data.mrr) || 50;
    var growth = (parseFloat(data.growthRate) || 15) / 100;
    var churn = (parseFloat(data.churnRate) || 5) / 100;
    var cac = parseFloat(data.cac) || 200;
    var fixed = parseFloat(data.fixedCosts) || 5000;
    var months = [];
    for (var i = 1; i <= 12; i++) {
      var newCust = Math.round(customers * growth);
      var churned = Math.round(customers * churn);
      var endCust = customers + newCust - churned;
      var monthMrr = endCust * mrr;
      var acqCost = newCust * cac;
      months.push({ month: i, startCustomers: customers, newCustomers: newCust, churned: churned, endCustomers: endCust, mrr: monthMrr, acqCost: acqCost, fixedCosts: fixed, pnl: monthMrr - acqCost - fixed });
      customers = endCust;
    }
    return months;
  },

  /**
   * Generate Cap Table Calculator as Word document
   */
  generateCapTableWord: async function(filename, data) {
    var rows = this._buildCapTable(data);
    var sections = [
      { heading: 'Cap Table Calculator', content: [
          'Company: ' + (data.companyName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Pre-Round Assumptions', content: [
          'Founder A Equity: ' + (data.founderAPercent || 0) + '%',
          'Founder B Equity: ' + (data.founderBPercent || 0) + '%',
          'Option Pool: ' + (data.optionPoolPercent || 0) + '%',
          'Total Shares: ' + DocGenerator._fmt(data.totalShares || 10000000)
      ]},
      { heading: 'Investment Round', content: [
          'Investment Amount: $' + DocGenerator._fmt(data.investmentAmount),
          'Pre-Money Valuation: $' + DocGenerator._fmt(data.preMoneyValuation),
          'Post-Money Valuation: $' + DocGenerator._fmt(parseFloat(data.preMoneyValuation || 0) + parseFloat(data.investmentAmount || 0)),
          'Price Per Share: $' + (this._calcPricePerShare(data) || 'N/A')
      ]},
      { heading: 'Cap Table (Post-Round)', content: rows.map(function(r) { return r.name + ': ' + DocGenerator._fmt(r.shares) + ' shares (' + r.percent.toFixed(1) + '%) — ' + r.class; }) }
    ];
    if (data.notes) sections.push({ heading: 'Notes', content: [data.notes] });
    return this.generateWord(filename, { title: 'Cap Table Calculator', author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateCapTableExcel: function(filename, data) {
    var capRows = this._buildCapTable(data);
    var totalShares = capRows.reduce(function(s,r){return s+r.shares;}, 0);
    var rows = [
      ['Cap Table Calculator'],
      ['Company', data.companyName || 'N/A'],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['Pre-Money Valuation ($)', parseFloat(data.preMoneyValuation) || 0],
      ['Investment ($)', parseFloat(data.investmentAmount) || 0],
      ['Post-Money ($)', (parseFloat(data.preMoneyValuation) || 0) + (parseFloat(data.investmentAmount) || 0)],
      ['Price Per Share ($)', this._calcPricePerShare(data)],
      [],
      ['Shareholder', 'Shares', 'Ownership %', 'Class', 'Value ($)']
    ];
    capRows.forEach(function(r) {
      var value = r.shares * (parseFloat(DocGenerator._calcPricePerShare(data)) || 0);
      rows.push([r.name, r.shares, r.percent.toFixed(1) + '%', r.class, Math.round(value)]);
    });
    rows.push(['Total', totalShares, '100.0%', '', (parseFloat(data.preMoneyValuation) || 0) + (parseFloat(data.investmentAmount) || 0)]);
    if (data.notes) { rows.push([]); rows.push(['Notes', data.notes]); }
    return this.generateExcel(filename, { title: 'Cap Table', rows: rows });
  },

  generateCapTablePDF: function(filename, data) {
    var capRows = this._buildCapTable(data);
    var pps = this._calcPricePerShare(data);
    var postMoney = (parseFloat(data.preMoneyValuation) || 0) + (parseFloat(data.investmentAmount) || 0);
    var lines = [
      { text: 'CAP TABLE CALCULATOR', size: 18, bold: true },
      { text: 'Company: ' + (data.companyName || 'N/A') + '  |  Date: ' + new Date().toLocaleDateString(), size: 10 },
      { text: ' ', size: 6 },
      { text: 'VALUATION', size: 14, bold: true },
      { text: 'Pre-Money: $' + DocGenerator._fmt(data.preMoneyValuation) + '  |  Investment: $' + DocGenerator._fmt(data.investmentAmount) + '  |  Post-Money: $' + DocGenerator._fmt(postMoney), size: 10 },
      { text: 'Price Per Share: $' + pps, size: 10 },
      { text: ' ', size: 6 },
      { text: 'CAP TABLE (POST-ROUND)', size: 14, bold: true }
    ];
    capRows.forEach(function(r) {
      lines.push({ text: r.name + ':  ' + DocGenerator._fmt(r.shares) + ' shares  |  ' + r.percent.toFixed(1) + '%  |  ' + r.class, size: 10 });
    });
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: 'NOTES', size: 14, bold: true });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Cap Table Calculator', lines: lines });
  },

  /** @private Build cap table rows from inputs */
  _buildCapTable: function(data) {
    var totalPre = parseFloat(data.totalShares) || 10000000;
    var fA = (parseFloat(data.founderAPercent) || 50) / 100;
    var fB = (parseFloat(data.founderBPercent) || 30) / 100;
    var pool = (parseFloat(data.optionPoolPercent) || 15) / 100;
    var remaining = 1 - fA - fB - pool;
    var investment = parseFloat(data.investmentAmount) || 500000;
    var preMoney = parseFloat(data.preMoneyValuation) || 4000000;
    var postMoney = preMoney + investment;
    var investorPercent = investment / postMoney;
    var dilution = 1 - investorPercent;
    var rows = [
      { name: 'Founder A', shares: Math.round(totalPre * fA * dilution), percent: fA * dilution * 100, class: 'Common' },
      { name: 'Founder B', shares: Math.round(totalPre * fB * dilution), percent: fB * dilution * 100, class: 'Common' }
    ];
    if (pool > 0) rows.push({ name: 'Option Pool', shares: Math.round(totalPre * pool * dilution), percent: pool * dilution * 100, class: 'Common (Reserved)' });
    if (remaining > 0.001) rows.push({ name: 'Other', shares: Math.round(totalPre * remaining * dilution), percent: remaining * dilution * 100, class: 'Common' });
    var investorShares = Math.round(totalPre * (investorPercent / dilution));
    rows.push({ name: data.investorName || 'Seed Investors', shares: investorShares, percent: investorPercent * 100, class: 'Preferred' });
    return rows;
  },

  /** @private Calculate price per share */
  _calcPricePerShare: function(data) {
    var preMoney = parseFloat(data.preMoneyValuation) || 4000000;
    var totalShares = parseFloat(data.totalShares) || 10000000;
    return (preMoney / totalShares).toFixed(4);
  },

  /**
   * Format a number with commas for display
   * @private
   */
  _fmt: function(n) {
    var num = parseFloat(n) || 0;
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  },

  // ============================================================
  // CAC/LTV Calculator (Part 9 - Marketing)
  // ============================================================
  generateCacLtvWord: async function(filename, data) {
    var cac = (parseFloat(data.totalMarketingSpend) || 0) / (parseFloat(data.newCustomers) || 1);
    var arpu = parseFloat(data.avgRevenuePerUser) || 0;
    var margin = (parseFloat(data.grossMargin) || 70) / 100;
    var churn = (parseFloat(data.churnRate) || 5) / 100;
    var ltv = churn > 0 ? (arpu * margin) / churn : 0;
    var ratio = cac > 0 ? (ltv / cac).toFixed(1) : 'N/A';
    var payback = (arpu * margin) > 0 ? Math.ceil(cac / (arpu * margin)) : 'N/A';
    var health = ratio >= 3 ? 'Healthy (3:1+)' : ratio >= 2 ? 'Warning (2-3:1)' : 'Critical (<2:1)';
    return this.generateWord(filename, { title: 'CAC/LTV Analysis', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Customer Acquisition Cost (CAC)', content: ['Total Marketing Spend: $' + this._fmt(data.totalMarketingSpend), 'New Customers: ' + this._fmt(data.newCustomers), 'CAC: $' + this._fmt(cac)] },
      { heading: 'Customer Lifetime Value (LTV)', content: ['ARPU (Monthly): $' + this._fmt(arpu), 'Gross Margin: ' + data.grossMargin + '%', 'Monthly Churn Rate: ' + data.churnRate + '%', 'LTV: $' + this._fmt(ltv)] },
      { heading: 'Unit Economics Health', content: ['LTV:CAC Ratio: ' + ratio + ':1', 'Payback Period: ' + payback + ' months', 'Health Assessment: ' + health] }
    ]});
  },
  generateCacLtvExcel: function(filename, data) {
    var cac = (parseFloat(data.totalMarketingSpend) || 0) / (parseFloat(data.newCustomers) || 1);
    var arpu = parseFloat(data.avgRevenuePerUser) || 0;
    var margin = (parseFloat(data.grossMargin) || 70) / 100;
    var churn = (parseFloat(data.churnRate) || 5) / 100;
    var ltv = churn > 0 ? (arpu * margin) / churn : 0;
    var ratio = cac > 0 ? (ltv / cac).toFixed(1) : 'N/A';
    var payback = (arpu * margin) > 0 ? Math.ceil(cac / (arpu * margin)) : 'N/A';
    return this.generateExcel(filename, { sheetName: 'CAC-LTV Analysis', rows: [
      ['CAC/LTV Analysis', '', 'Date: ' + new Date().toLocaleDateString()],
      [''], ['Input Metrics', 'Value'],
      ['Total Marketing Spend', '$' + this._fmt(data.totalMarketingSpend)],
      ['New Customers', this._fmt(data.newCustomers)],
      ['ARPU (Monthly)', '$' + this._fmt(arpu)],
      ['Gross Margin', data.grossMargin + '%'],
      ['Monthly Churn Rate', data.churnRate + '%'],
      [''], ['Calculated Metrics', 'Value'],
      ['CAC', '$' + this._fmt(cac)],
      ['LTV', '$' + this._fmt(ltv)],
      ['LTV:CAC Ratio', ratio + ':1'],
      ['Payback Period', payback + ' months'],
      ['Health Assessment', cac > 0 && ltv/cac >= 3 ? 'Healthy' : cac > 0 && ltv/cac >= 2 ? 'Warning' : 'Critical']
    ]});
  },
  generateCacLtvPDF: function(filename, data) {
    var cac = (parseFloat(data.totalMarketingSpend) || 0) / (parseFloat(data.newCustomers) || 1);
    var arpu = parseFloat(data.avgRevenuePerUser) || 0;
    var margin = (parseFloat(data.grossMargin) || 70) / 100;
    var churn = (parseFloat(data.churnRate) || 5) / 100;
    var ltv = churn > 0 ? (arpu * margin) / churn : 0;
    var ratio = cac > 0 ? (ltv / cac).toFixed(1) : 'N/A';
    var payback = (arpu * margin) > 0 ? Math.ceil(cac / (arpu * margin)) : 'N/A';
    return this.generatePDF(filename, { title: 'CAC/LTV Analysis', lines: [
      { text: 'Customer Acquisition Cost (CAC)', size: 14, bold: true },
      { text: 'Total Marketing Spend: $' + this._fmt(data.totalMarketingSpend), size: 11 },
      { text: 'New Customers: ' + this._fmt(data.newCustomers), size: 11 },
      { text: 'CAC: $' + this._fmt(cac), size: 12, bold: true },
      { text: '', size: 8 },
      { text: 'Customer Lifetime Value (LTV)', size: 14, bold: true },
      { text: 'ARPU (Monthly): $' + this._fmt(arpu), size: 11 },
      { text: 'Gross Margin: ' + data.grossMargin + '%', size: 11 },
      { text: 'Monthly Churn Rate: ' + data.churnRate + '%', size: 11 },
      { text: 'LTV: $' + this._fmt(ltv), size: 12, bold: true },
      { text: '', size: 8 },
      { text: 'Unit Economics Health', size: 14, bold: true },
      { text: 'LTV:CAC Ratio: ' + ratio + ':1', size: 12, bold: true },
      { text: 'Payback Period: ' + payback + ' months', size: 11 },
      { text: 'Health: ' + (cac > 0 && ltv/cac >= 3 ? 'Healthy (3:1+)' : cac > 0 && ltv/cac >= 2 ? 'Warning (2-3:1)' : 'Critical (<2:1)'), size: 11 }
    ]});
  },

  // ============================================================
  // Positioning Statement Builder (Part 9 - Marketing)
  // ============================================================
  generatePositioningWord: async function(filename, data) {
    var statement = 'For ' + (data.targetCustomer || '[target customer]') + ' who ' + (data.category || '[need]') + ', ' + (data.productName || '[product]') + ' is a ' + (data.productCategory || '[category]') + ' that ' + (data.keyBenefit || '[key benefit]') + '. Unlike ' + (data.competitor || '[competitor]') + ', we ' + (data.differentiator || '[differentiator]') + '.';
    return this.generateWord(filename, { title: 'Positioning Statement', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Positioning Statement', content: [statement] },
      { heading: 'Components', content: ['Target Customer: ' + (data.targetCustomer || 'N/A'), 'Need/Opportunity: ' + (data.category || 'N/A'), 'Product Name: ' + (data.productName || 'N/A'), 'Product Category: ' + (data.productCategory || 'N/A'), 'Key Benefit: ' + (data.keyBenefit || 'N/A'), 'Competitive Alternative: ' + (data.competitor || 'N/A'), 'Key Differentiator: ' + (data.differentiator || 'N/A')] },
      { heading: 'Elevator Pitch', content: [data.elevatorPitch || 'N/A'] }
    ]});
  },
  generatePositioningExcel: function(filename, data) {
    var statement = 'For ' + (data.targetCustomer || '[target customer]') + ' who ' + (data.category || '[need]') + ', ' + (data.productName || '[product]') + ' is a ' + (data.productCategory || '[category]') + ' that ' + (data.keyBenefit || '[key benefit]') + '. Unlike ' + (data.competitor || '[competitor]') + ', we ' + (data.differentiator || '[differentiator]') + '.';
    return this.generateExcel(filename, { sheetName: 'Positioning', headers: ['Element', 'Content'], data: [
      ['Full Statement', statement], [''], ['Target Customer', data.targetCustomer || ''], ['Need/Opportunity', data.category || ''], ['Product Name', data.productName || ''], ['Product Category', data.productCategory || ''], ['Key Benefit', data.keyBenefit || ''], ['Competitive Alternative', data.competitor || ''], ['Key Differentiator', data.differentiator || ''], [''], ['Elevator Pitch', data.elevatorPitch || '']
    ]});
  },
  generatePositioningPDF: function(filename, data) {
    var statement = 'For ' + (data.targetCustomer || '[target customer]') + ' who ' + (data.category || '[need]') + ', ' + (data.productName || '[product]') + ' is a ' + (data.productCategory || '[category]') + ' that ' + (data.keyBenefit || '[key benefit]') + '. Unlike ' + (data.competitor || '[competitor]') + ', we ' + (data.differentiator || '[differentiator]') + '.';
    return this.generatePDF(filename, { title: 'Positioning Statement', lines: [
      { text: 'Positioning Statement', size: 14, bold: true },
      { text: statement, size: 11 }, { text: '', size: 8 },
      { text: 'Components Breakdown', size: 14, bold: true },
      { text: 'Target Customer: ' + (data.targetCustomer || 'N/A'), size: 11 },
      { text: 'Need/Opportunity: ' + (data.category || 'N/A'), size: 11 },
      { text: 'Product Name: ' + (data.productName || 'N/A'), size: 11 },
      { text: 'Product Category: ' + (data.productCategory || 'N/A'), size: 11 },
      { text: 'Key Benefit: ' + (data.keyBenefit || 'N/A'), size: 11 },
      { text: 'Competitive Alternative: ' + (data.competitor || 'N/A'), size: 11 },
      { text: 'Key Differentiator: ' + (data.differentiator || 'N/A'), size: 11 },
      { text: '', size: 8 },
      { text: 'Elevator Pitch', size: 14, bold: true },
      { text: data.elevatorPitch || 'N/A', size: 11 }
    ]});
  },

  generatePositioningPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }
    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.productName || 'Product') + ' — Positioning Statement';
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };
    var statement = 'For ' + (data.targetCustomer || '[target customer]') + ' who ' + (data.category || '[need]') + ', ' + (data.productName || '[product]') + ' is a ' + (data.productCategory || '[category]') + ' that ' + (data.keyBenefit || '[key benefit]') + '. Unlike ' + (data.competitor || '[competitor]') + ', we ' + (data.differentiator || '[differentiator]') + '.';

    // Title slide
    var s1 = pres.addSlide(); s1.background = { color: C.navy };
    s1.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.teal } });
    s1.addText(data.productName || 'Product', { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    s1.addText('Positioning Statement', { x: 0.6, y: 2.5, w: 8.8, h: 0.7, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });

    // Full statement slide
    var s2 = pres.addSlide(); s2.background = { color: C.white };
    s2.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.crimson } });
    s2.addText('Positioning Statement', { x: 0.6, y: 0.3, w: 8.8, h: 0.6, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
    s2.addShape(pres.ShapeType.rect, { x: 0.6, y: 0.95, w: 2.0, h: 0.04, fill: { color: C.crimson } });
    s2.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    s2.addText(statement, { x: 1.0, y: 1.5, w: 8.0, h: 2.5, fontSize: 22, color: '333333', fontFace: 'Arial', italic: true, valign: 'middle', align: 'center', fill: { color: C.light }, line: { color: C.teal, width: 2 }, rectRadius: 0.15 });

    // Components breakdown slide
    var s3 = pres.addSlide(); s3.background = { color: C.white };
    s3.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.teal } });
    s3.addText('Components', { x: 0.6, y: 0.3, w: 8.8, h: 0.6, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
    s3.addShape(pres.ShapeType.rect, { x: 0.6, y: 0.95, w: 2.0, h: 0.04, fill: { color: C.teal } });
    s3.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    var components = [
      { text: 'Target Customer: ', options: { fontSize: 15, bold: true, color: C.teal } }, { text: (data.targetCustomer || 'N/A') + '\n', options: { fontSize: 15, color: '333333' } },
      { text: 'Need/Opportunity: ', options: { fontSize: 15, bold: true, color: C.blue } }, { text: (data.category || 'N/A') + '\n', options: { fontSize: 15, color: '333333' } },
      { text: 'Product Category: ', options: { fontSize: 15, bold: true, color: C.teal } }, { text: (data.productCategory || 'N/A') + '\n', options: { fontSize: 15, color: '333333' } },
      { text: 'Key Benefit: ', options: { fontSize: 15, bold: true, color: C.crimson } }, { text: (data.keyBenefit || 'N/A') + '\n', options: { fontSize: 15, color: '333333' } },
      { text: 'Competitor: ', options: { fontSize: 15, bold: true, color: C.navy } }, { text: (data.competitor || 'N/A') + '\n', options: { fontSize: 15, color: '333333' } },
      { text: 'Differentiator: ', options: { fontSize: 15, bold: true, color: C.crimson } }, { text: (data.differentiator || 'N/A'), options: { fontSize: 15, color: '333333' } }
    ];
    s3.addText(components, { x: 0.6, y: 1.2, w: 8.8, h: 3.5, fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.5 });

    // Elevator Pitch slide
    if (data.elevatorPitch) {
      var s4 = pres.addSlide(); s4.background = { color: C.light };
      s4.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.blue } });
      s4.addText('Elevator Pitch', { x: 0.6, y: 0.3, w: 8.8, h: 0.6, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
      s4.addShape(pres.ShapeType.rect, { x: 0.6, y: 0.95, w: 2.0, h: 0.04, fill: { color: C.blue } });
      s4.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
      s4.addText(data.elevatorPitch, { x: 1.0, y: 1.5, w: 8.0, h: 2.5, fontSize: 20, color: '333333', fontFace: 'Arial', italic: true, valign: 'middle', align: 'center', fill: { color: C.white }, line: { color: C.blue, width: 2 }, rectRadius: 0.15 });
    }

    // Closing
    var end = pres.addSlide(); end.background = { color: C.navy };
    end.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    end.addText(data.productName || 'Product', { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    end.addText('Positioning Statement', { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 18, color: C.teal, fontFace: 'Arial', align: 'center' });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // Equity Split Calculator (Part 6 - Founding Team)
  // ============================================================
  generateEquitySplitWord: async function(filename, data) {
    var founders = this._calcEquitySplit(data);
    var sections = [{ heading: 'Equity Split Analysis', content: ['Date: ' + new Date().toLocaleDateString()] }];
    founders.forEach(function(f) { sections.push({ heading: f.name, content: ['Weighted Score: ' + f.score.toFixed(1), 'Equity Share: ' + f.pct.toFixed(1) + '%'] }); });
    sections.push({ heading: 'Recommendation', content: ['Standard 4-year vesting with 1-year cliff recommended.', 'Consider re-evaluating equity split at major milestones.'] });
    return this.generateWord(filename, { title: 'Equity Split Analysis', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateEquitySplitExcel: function(filename, data) {
    var founders = this._calcEquitySplit(data);
    var rows = [['Equity Split Analysis', '', 'Date: ' + new Date().toLocaleDateString()], [''], ['Factor', 'Weight']];
    var factors = ['Idea', 'Domain Expertise', 'Full-Time', 'Capital', 'Network', 'Technical', 'Business', 'Opportunity Cost'];
    var weights = [10, 15, 20, 15, 5, 15, 10, 10];
    factors.forEach(function(f, i) { rows.push([f, weights[i] + '%']); });
    rows.push([''], ['Founder', 'Score', 'Equity %']);
    founders.forEach(function(f) { rows.push([f.name, f.score.toFixed(1), f.pct.toFixed(1) + '%']); });
    return this.generateExcel(filename, { sheetName: 'Equity Split', rows: rows });
  },
  generateEquitySplitPDF: function(filename, data) {
    var founders = this._calcEquitySplit(data);
    var lines = [{ text: 'Equity Split Analysis', size: 14, bold: true }, { text: 'Date: ' + new Date().toLocaleDateString(), size: 10 }, { text: '', size: 6 }];
    founders.forEach(function(f) {
      lines.push({ text: f.name, size: 13, bold: true });
      lines.push({ text: 'Weighted Score: ' + f.score.toFixed(1) + '  |  Equity: ' + f.pct.toFixed(1) + '%', size: 11 });
      lines.push({ text: '', size: 4 });
    });
    lines.push({ text: 'Recommendation', size: 13, bold: true });
    lines.push({ text: 'Standard 4-year vesting with 1-year cliff. Re-evaluate at major milestones.', size: 11 });
    return this.generatePDF(filename, { title: 'Equity Split Analysis', lines: lines });
  },
  /** @private Calculate weighted equity split for up to 3 founders */
  _calcEquitySplit: function(data) {
    var weights = [10, 15, 20, 15, 5, 15, 10, 10]; // idea, domain, fulltime, capital, network, tech, biz, opportunity
    var keys = ['idea', 'domain', 'fulltime', 'capital', 'network', 'technical', 'business', 'opportunity'];
    var founders = [];
    for (var i = 1; i <= 3; i++) {
      var name = data['founder' + i + 'Name'];
      if (!name || !name.trim()) continue;
      var score = 0;
      keys.forEach(function(k, idx) { score += (parseFloat(data['f' + i + '_' + k]) || 0) * (weights[idx] / 100); });
      founders.push({ name: name, score: score });
    }
    var totalScore = founders.reduce(function(s, f) { return s + f.score; }, 0);
    founders.forEach(function(f) { f.pct = totalScore > 0 ? (f.score / totalScore) * 100 : 0; });
    return founders;
  },

  // ============================================================
  // Co-Founder Compatibility Scorecard (Part 6)
  // ============================================================
  generateCofounderScorecardWord: async function(filename, data) {
    var dims = ['complementarySkills', 'sharedValues', 'workStyle', 'conflictHandling', 'commitment', 'trustLevel', 'riskTolerance', 'communicationStyle'];
    var labels = ['Complementary Skills', 'Shared Values', 'Work Style', 'Conflict Handling', 'Commitment', 'Trust Level', 'Risk Tolerance', 'Communication'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var avg = total / dims.length;
    var rec = avg >= 8 ? 'Strong Match — Proceed with confidence' : avg >= 6 ? 'Proceed with Caution — Address gaps first' : 'Red Flag — Significant compatibility concerns';
    var content = ['Candidate: ' + (data.candidateName || 'N/A'), 'Overall Score: ' + avg.toFixed(1) + '/10', 'Assessment: ' + rec, ''];
    dims.forEach(function(d, i) { content.push(labels[i] + ': ' + (data[d] || 'N/A') + '/10'); });
    return this.generateWord(filename, { title: 'Co-Founder Compatibility Scorecard', author: 'Generated from wasilzafar.com', sections: [{ heading: 'Co-Founder Compatibility', content: content }] });
  },
  generateCofounderScorecardExcel: function(filename, data) {
    var dims = ['complementarySkills', 'sharedValues', 'workStyle', 'conflictHandling', 'commitment', 'trustLevel', 'riskTolerance', 'communicationStyle'];
    var labels = ['Complementary Skills', 'Shared Values', 'Work Style', 'Conflict Handling', 'Commitment', 'Trust Level', 'Risk Tolerance', 'Communication'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var rows = [['Co-Founder Compatibility Scorecard'], ['Candidate: ' + (data.candidateName || 'N/A')], [''], ['Dimension', 'Score (1-10)']];
    dims.forEach(function(d, i) { rows.push([labels[i], data[d] || '']); });
    rows.push([''], ['Average Score', (total / dims.length).toFixed(1)]);
    return this.generateExcel(filename, { sheetName: 'Compatibility', rows: rows });
  },
  generateCofounderScorecardPDF: function(filename, data) {
    var dims = ['complementarySkills', 'sharedValues', 'workStyle', 'conflictHandling', 'commitment', 'trustLevel', 'riskTolerance', 'communicationStyle'];
    var labels = ['Complementary Skills', 'Shared Values', 'Work Style', 'Conflict Handling', 'Commitment', 'Trust Level', 'Risk Tolerance', 'Communication'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var avg = total / dims.length;
    var lines = [{ text: 'Candidate: ' + (data.candidateName || 'N/A'), size: 13, bold: true }, { text: '', size: 4 }];
    dims.forEach(function(d, i) { lines.push({ text: labels[i] + ': ' + (data[d] || 'N/A') + '/10', size: 11 }); });
    lines.push({ text: '', size: 6 }, { text: 'Overall Score: ' + avg.toFixed(1) + '/10', size: 13, bold: true });
    lines.push({ text: avg >= 8 ? 'Strong Match' : avg >= 6 ? 'Proceed with Caution' : 'Red Flag — Address concerns', size: 12, bold: true });
    return this.generatePDF(filename, { title: 'Co-Founder Compatibility', lines: lines });
  },

  // ============================================================
  // Burn Rate & Runway Calculator (Part 10 - Legal/Financial)
  // ============================================================
  generateBurnRateWord: async function(filename, data) {
    var r = this._calcRunway(data);
    return this.generateWord(filename, { title: 'Burn Rate & Runway Analysis', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Cash Position', content: ['Cash on Hand: $' + this._fmt(data.cashOnHand), 'Monthly Revenue: $' + this._fmt(data.monthlyRevenue), 'Monthly Expenses: $' + this._fmt(data.monthlyExpenses)] },
      { heading: 'Burn Analysis', content: ['Gross Burn Rate: $' + this._fmt(r.grossBurn) + '/mo', 'Net Burn Rate: $' + this._fmt(r.netBurn) + '/mo', 'Runway: ' + r.runway + ' months'] },
      { heading: 'Assessment', content: [r.status, r.runway < 6 ? 'URGENT: Begin fundraising immediately.' : r.runway < 12 ? 'Start fundraising prep — 6+ month process.' : 'Comfortable runway. Focus on growth.'] }
    ]});
  },
  generateBurnRateExcel: function(filename, data) {
    var r = this._calcRunway(data);
    return this.generateExcel(filename, { sheetName: 'Burn Rate', rows: [
      ['Burn Rate & Runway Analysis', '', 'Date: ' + new Date().toLocaleDateString()], [''],
      ['Metric', 'Value'], ['Cash on Hand', '$' + this._fmt(data.cashOnHand)],
      ['Monthly Revenue', '$' + this._fmt(data.monthlyRevenue)], ['Monthly Expenses', '$' + this._fmt(data.monthlyExpenses)],
      ['Revenue Growth', (data.monthlyRevenueGrowth || '0') + '%'], ['Expense Growth', (data.monthlyExpenseGrowth || '0') + '%'],
      [''], ['Gross Burn Rate', '$' + this._fmt(r.grossBurn)], ['Net Burn Rate', '$' + this._fmt(r.netBurn)],
      ['Runway (months)', r.runway], ['Status', r.status]
    ]});
  },
  generateBurnRatePDF: function(filename, data) {
    var r = this._calcRunway(data);
    return this.generatePDF(filename, { title: 'Burn Rate & Runway Analysis', lines: [
      { text: 'Cash Position', size: 14, bold: true },
      { text: 'Cash on Hand: $' + this._fmt(data.cashOnHand), size: 11 },
      { text: 'Monthly Revenue: $' + this._fmt(data.monthlyRevenue), size: 11 },
      { text: 'Monthly Expenses: $' + this._fmt(data.monthlyExpenses), size: 11 },
      { text: '', size: 6 },
      { text: 'Burn Analysis', size: 14, bold: true },
      { text: 'Gross Burn Rate: $' + this._fmt(r.grossBurn) + '/mo', size: 11 },
      { text: 'Net Burn Rate: $' + this._fmt(r.netBurn) + '/mo', size: 11 },
      { text: 'Runway: ' + r.runway + ' months', size: 13, bold: true },
      { text: '', size: 6 },
      { text: r.status, size: 12, bold: true }
    ]});
  },
  /** @private Calculate burn rate metrics */
  _calcRunway: function(data) {
    var expenses = parseFloat(data.monthlyExpenses) || 0;
    var revenue = parseFloat(data.monthlyRevenue) || 0;
    var cash = parseFloat(data.cashOnHand) || 0;
    var netBurn = expenses - revenue;
    var runway = netBurn > 0 ? Math.floor(cash / netBurn) : (revenue >= expenses ? 999 : 0);
    var status = revenue >= expenses ? 'Default Alive — Revenue covers expenses' : 'Default Dead — Burning cash at $' + this._fmt(netBurn) + '/mo';
    return { grossBurn: expenses, netBurn: Math.max(netBurn, 0), runway: Math.min(runway, 999), status: status };
  },

  // ============================================================
  // Business Structure Selector (Part 10 - Legal/Financial)
  // ============================================================
  generateBusinessStructureWord: async function(filename, data) {
    var rec = this._recommendStructure(data);
    return this.generateWord(filename, { title: 'Business Structure Recommendation', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Your Inputs', content: ['Plan to Raise Funding: ' + (data.planToRaiseFunding || 'N/A'), 'Number of Founders: ' + (data.numberOfFounders || 'N/A'), 'Expected Revenue: ' + (data.expectedRevenue || 'N/A'), 'Plan to Hire: ' + (data.planToHireEmployees || 'N/A'), 'Liability Protection: ' + (data.liabilityProtection || 'N/A'), 'Tax Flexibility: ' + (data.taxFlexibility || 'N/A'), 'IP Protection Needed: ' + (data.ipProtection || 'N/A')] },
      { heading: 'Recommendation: ' + rec.type, content: rec.reasons },
      { heading: 'Alternative to Consider', content: [rec.alternative] }
    ]});
  },
  generateBusinessStructureExcel: function(filename, data) {
    var rec = this._recommendStructure(data);
    var rows = [['Business Structure Recommendation'], [''], ['Input', 'Value'],
      ['Raise Funding?', data.planToRaiseFunding || ''], ['# Founders', data.numberOfFounders || ''],
      ['Expected Revenue', data.expectedRevenue || ''], ['Hire Employees?', data.planToHireEmployees || ''],
      ['Liability Protection', data.liabilityProtection || ''], ['Tax Flexibility', data.taxFlexibility || ''],
      ['IP Protection?', data.ipProtection || ''], [''],
      ['Recommended Structure', rec.type], ['Alternative', rec.alternative]];
    rec.reasons.forEach(function(r) { rows.push(['Reason', r]); });
    return this.generateExcel(filename, { sheetName: 'Structure', rows: rows });
  },
  generateBusinessStructurePDF: function(filename, data) {
    var rec = this._recommendStructure(data);
    var lines = [{ text: 'Your Situation', size: 14, bold: true },
      { text: 'Raise Funding: ' + (data.planToRaiseFunding || 'N/A'), size: 11 },
      { text: 'Founders: ' + (data.numberOfFounders || 'N/A'), size: 11 },
      { text: 'Revenue: ' + (data.expectedRevenue || 'N/A'), size: 11 },
      { text: '', size: 6 },
      { text: 'Recommended: ' + rec.type, size: 14, bold: true }];
    rec.reasons.forEach(function(r) { lines.push({ text: '• ' + r, size: 11 }); });
    lines.push({ text: '', size: 6 }, { text: 'Alternative: ' + rec.alternative, size: 11 });
    return this.generatePDF(filename, { title: 'Business Structure Recommendation', lines: lines });
  },
  /** @private Business structure recommendation logic */
  _recommendStructure: function(data) {
    if (data.planToRaiseFunding === 'Yes') return { type: 'C-Corporation (Delaware)', reasons: ['VC/angel investors strongly prefer C-Corps', 'Standard equity structures for fundraising', 'Clear path for stock options and cap table management'], alternative: 'S-Corp if bootstrapping initially' };
    if (data.expectedRevenue === '$1M+' || data.planToHireEmployees === 'Yes') return { type: 'S-Corporation', reasons: ['Tax savings on self-employment taxes above reasonable salary', 'Good for profitable businesses with employees', 'Pass-through taxation avoids double taxation'], alternative: 'C-Corp if you plan to raise VC later' };
    if (data.liabilityProtection === 'Critical' || data.taxFlexibility === 'Critical') return { type: 'LLC', reasons: ['Maximum flexibility in taxation (choose S-Corp or partnership treatment)', 'Strong liability protection with minimal formality', 'Simple to set up and maintain'], alternative: 'S-Corp for higher revenue situations' };
    return { type: 'LLC', reasons: ['Best default choice for most early-stage startups', 'Flexible, simple, and protective', 'Easy to convert to C-Corp later if needed'], alternative: 'Sole Proprietorship if testing an idea with no liability risk' };
  },

  // ============================================================
  // Hypothesis Card Builder (Part 4 - Lean Startup)
  // ============================================================
  generateHypothesisCardWord: async function(filename, data) {
    return this.generateWord(filename, { title: 'Hypothesis Card — ' + (data.hypothesisName || 'Untitled'), author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Hypothesis', content: ['Name: ' + (data.hypothesisName || 'N/A'), 'Type: ' + (data.hypothesisType || 'N/A'), 'We Believe That: ' + (data.weBelieveThat || 'N/A')] },
      { heading: 'Expected Outcome', content: ['For Segment: ' + (data.forSegment || 'N/A'), 'Will Result In: ' + (data.willResultIn || 'N/A')] },
      { heading: 'Validation', content: ['Success Criteria: ' + (data.successCriteria || 'N/A'), 'Test Method: ' + (data.testMethod || 'N/A'), 'Time Box: ' + (data.timeBox || 'N/A')] }
    ]});
  },
  generateHypothesisCardExcel: function(filename, data) {
    return this.generateExcel(filename, { sheetName: 'Hypothesis Card', headers: ['Field', 'Value'], data: [
      ['Hypothesis Name', data.hypothesisName || ''], ['Type', data.hypothesisType || ''], ['We Believe That', data.weBelieveThat || ''],
      ['For Segment', data.forSegment || ''], ['Will Result In', data.willResultIn || ''],
      ['Success Criteria', data.successCriteria || ''], ['Test Method', data.testMethod || ''], ['Time Box', data.timeBox || '']
    ]});
  },
  generateHypothesisCardPDF: function(filename, data) {
    return this.generatePDF(filename, { title: 'Hypothesis Card', lines: [
      { text: data.hypothesisName || 'Untitled Hypothesis', size: 14, bold: true },
      { text: 'Type: ' + (data.hypothesisType || 'N/A'), size: 11 }, { text: '', size: 4 },
      { text: 'We Believe That:', size: 13, bold: true }, { text: data.weBelieveThat || 'N/A', size: 11 }, { text: '', size: 4 },
      { text: 'For Segment: ' + (data.forSegment || 'N/A'), size: 11 },
      { text: 'Will Result In: ' + (data.willResultIn || 'N/A'), size: 11 }, { text: '', size: 6 },
      { text: 'Validation', size: 13, bold: true },
      { text: 'Success Criteria: ' + (data.successCriteria || 'N/A'), size: 11 },
      { text: 'Test Method: ' + (data.testMethod || 'N/A'), size: 11 },
      { text: 'Time Box: ' + (data.timeBox || 'N/A'), size: 11 }
    ]});
  },

  generateHypothesisCardPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }
    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; pres.author = 'Generated from wasilzafar.com';
    pres.title = 'Hypothesis Card — ' + (data.hypothesisName || 'Untitled');
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

    // Title slide
    var s1 = pres.addSlide(); s1.background = { color: C.navy };
    s1.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.teal } });
    s1.addText(data.hypothesisName || 'Hypothesis', { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 38, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    s1.addText('Hypothesis Card', { x: 0.6, y: 2.5, w: 8.8, h: 0.7, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });
    if (data.hypothesisType) s1.addText('Type: ' + data.hypothesisType, { x: 0.6, y: 3.5, w: 8.8, h: 0.4, fontSize: 16, color: C.gray, fontFace: 'Arial', align: 'center' });

    // Hypothesis statement slide
    var s2 = pres.addSlide(); s2.background = { color: C.white };
    s2.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.crimson } });
    s2.addText('We Believe That...', { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
    s2.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.0, w: 2.0, h: 0.04, fill: { color: C.crimson } });
    s2.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    // Statement in a highlight box
    s2.addText(data.weBelieveThat || 'Not defined', { x: 1.0, y: 1.4, w: 8.0, h: 1.5, fontSize: 20, color: '333333', fontFace: 'Arial', italic: true, valign: 'middle', align: 'center', fill: { color: C.light }, line: { color: C.teal, width: 2 }, rectRadius: 0.1 });
    // Segment + outcome
    var details = [
      { text: 'For Segment: ' + (data.forSegment || 'N/A'), options: { fontSize: 16, color: C.blue, bold: true, breakLine: true } },
      { text: '', options: { fontSize: 6, breakLine: true } },
      { text: 'Will Result In: ' + (data.willResultIn || 'N/A'), options: { fontSize: 16, color: '333333', breakLine: true } }
    ];
    s2.addText(details, { x: 0.6, y: 3.2, w: 8.8, h: 1.5, fontFace: 'Arial', valign: 'top' });

    // Validation slide
    var s3 = pres.addSlide(); s3.background = { color: C.white };
    s3.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.teal } });
    s3.addText('Validation Plan', { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 26, bold: true, color: C.navy, fontFace: 'Arial' });
    s3.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.0, w: 2.0, h: 0.04, fill: { color: C.teal } });
    s3.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    var validation = [
      { text: 'Success Criteria', options: { fontSize: 16, bold: true, color: C.teal, breakLine: true } },
      { text: data.successCriteria || 'N/A', options: { fontSize: 15, color: '333333', breakLine: true, lineSpacingMultiple: 1.2 } },
      { text: '', options: { fontSize: 10, breakLine: true } },
      { text: 'Test Method', options: { fontSize: 16, bold: true, color: C.blue, breakLine: true } },
      { text: data.testMethod || 'N/A', options: { fontSize: 15, color: '333333', breakLine: true, lineSpacingMultiple: 1.2 } },
      { text: '', options: { fontSize: 10, breakLine: true } },
      { text: 'Time Box: ' + (data.timeBox || 'N/A'), options: { fontSize: 16, bold: true, color: C.crimson, breakLine: true } }
    ];
    s3.addText(validation, { x: 0.6, y: 1.3, w: 8.8, h: 3.5, fontFace: 'Arial', valign: 'top' });

    // Closing
    var end = pres.addSlide(); end.background = { color: C.navy };
    end.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    end.addText(data.hypothesisName || 'Hypothesis', { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    end.addText('Ready for Validation', { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 18, color: C.teal, fontFace: 'Arial', align: 'center' });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // Experiment Tracker (Part 4 - Lean Startup)
  // ============================================================
  generateExperimentTrackerWord: async function(filename, data) {
    var experiments = this._collectExperiments(data);
    var sections = [{ heading: 'Experiment Log', content: ['Date: ' + new Date().toLocaleDateString(), 'Total Experiments: ' + experiments.length] }];
    experiments.forEach(function(e, i) { sections.push({ heading: 'Experiment ' + (i + 1) + ': ' + e.name, content: ['Hypothesis: ' + e.hypothesis, 'Metric: ' + e.metric, 'Target: ' + e.target, 'Result: ' + e.result, 'Decision: ' + e.decision] }); });
    return this.generateWord(filename, { title: 'Experiment Tracker', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateExperimentTrackerExcel: function(filename, data) {
    var experiments = this._collectExperiments(data);
    var rows = [['Experiment', 'Hypothesis', 'Metric', 'Target', 'Result', 'Decision']];
    experiments.forEach(function(e) { rows.push([e.name, e.hypothesis, e.metric, e.target, e.result, e.decision]); });
    return this.generateExcel(filename, { sheetName: 'Experiments', rows: rows });
  },
  generateExperimentTrackerPDF: function(filename, data) {
    var experiments = this._collectExperiments(data);
    var lines = [{ text: 'Experiment Log — ' + experiments.length + ' Experiments', size: 14, bold: true }, { text: '', size: 6 }];
    experiments.forEach(function(e, i) {
      lines.push({ text: 'Experiment ' + (i + 1) + ': ' + e.name, size: 13, bold: true });
      lines.push({ text: 'Hypothesis: ' + e.hypothesis, size: 10 });
      lines.push({ text: 'Metric: ' + e.metric + '  |  Target: ' + e.target + '  |  Result: ' + e.result, size: 10 });
      lines.push({ text: 'Decision: ' + e.decision, size: 10 });
      lines.push({ text: '', size: 4 });
    });
    return this.generatePDF(filename, { title: 'Experiment Tracker', lines: lines });
  },
  /** @private Collect experiment rows from DOM class-based inputs */
  _collectExperiments: function(data) {
    var experiments = [];
    var rows = document.querySelectorAll('.experiment-row');
    rows.forEach(function(row) {
      var nameEl = row.querySelector('.exp-name');
      var name = nameEl ? nameEl.value.trim() : '';
      if (!name) return;
      experiments.push({
        name: name,
        hypothesis: (row.querySelector('.exp-hypothesis') || {}).value || '',
        metric: (row.querySelector('.exp-metric') || {}).value || '',
        target: (row.querySelector('.exp-target') || {}).value || '',
        result: (row.querySelector('.exp-result') || {}).value || '',
        decision: (row.querySelector('.exp-decision') || {}).value || ''
      });
    });
    return experiments;
  },

  // ============================================================
  // Viral K-Factor Calculator (Part 8 - Scaling)
  // ============================================================
  generateViralKFactorWord: async function(filename, data) {
    var k = this._calcKFactor(data);
    return this.generateWord(filename, { title: 'Viral Growth Analysis', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Input Metrics', content: ['Current Users: ' + this._fmt(data.currentUsers), 'Avg Invites/User: ' + (data.avgInvitesSent || 'N/A'), 'Invite Conversion Rate: ' + (data.inviteConversionRate || 'N/A') + '%', 'Viral Cycles (days): ' + (data.viralCycles || 'N/A')] },
      { heading: 'K-Factor Analysis', content: ['K-Factor: ' + k.kFactor.toFixed(2), 'Status: ' + k.status, 'Projected Users (Month 1): ' + this._fmt(k.m1), 'Projected Users (Month 3): ' + this._fmt(k.m3), 'Projected Users (Month 6): ' + this._fmt(k.m6)] }
    ]});
  },
  generateViralKFactorExcel: function(filename, data) {
    var k = this._calcKFactor(data);
    return this.generateExcel(filename, { sheetName: 'Viral Growth', rows: [
      ['Viral Growth Analysis', '', 'Date: ' + new Date().toLocaleDateString()], [''],
      ['Metric', 'Value'], ['Current Users', this._fmt(data.currentUsers)],
      ['Avg Invites/User', data.avgInvitesSent || ''], ['Conversion Rate', (data.inviteConversionRate || '') + '%'],
      ['Cycle Time (days)', data.viralCycles || ''], [''],
      ['K-Factor', k.kFactor.toFixed(2)], ['Status', k.status],
      ['Month 1 Users', this._fmt(k.m1)], ['Month 3 Users', this._fmt(k.m3)], ['Month 6 Users', this._fmt(k.m6)]
    ]});
  },
  generateViralKFactorPDF: function(filename, data) {
    var k = this._calcKFactor(data);
    return this.generatePDF(filename, { title: 'Viral Growth Analysis', lines: [
      { text: 'Input Metrics', size: 14, bold: true },
      { text: 'Current Users: ' + this._fmt(data.currentUsers), size: 11 },
      { text: 'Avg Invites/User: ' + (data.avgInvitesSent || 'N/A'), size: 11 },
      { text: 'Conversion Rate: ' + (data.inviteConversionRate || 'N/A') + '%', size: 11 },
      { text: 'Cycle Time: ' + (data.viralCycles || 'N/A') + ' days', size: 11 },
      { text: '', size: 6 },
      { text: 'K-Factor: ' + k.kFactor.toFixed(2), size: 14, bold: true },
      { text: 'Status: ' + k.status, size: 12, bold: true },
      { text: '', size: 4 },
      { text: 'Month 1: ' + this._fmt(k.m1) + ' users', size: 11 },
      { text: 'Month 3: ' + this._fmt(k.m3) + ' users', size: 11 },
      { text: 'Month 6: ' + this._fmt(k.m6) + ' users', size: 11 }
    ]});
  },
  /** @private Calculate K-factor and projections */
  _calcKFactor: function(data) {
    var invites = parseFloat(data.avgInvitesSent) || 0;
    var conv = (parseFloat(data.inviteConversionRate) || 0) / 100;
    var kFactor = invites * conv;
    var users = parseFloat(data.currentUsers) || 100;
    var cycle = parseFloat(data.viralCycles) || 14;
    var cyclesPerMonth = 30 / cycle;
    var project = function(months) { var u = users; for (var i = 0; i < months * cyclesPerMonth; i++) u += u * kFactor; return Math.round(u); };
    var status = kFactor >= 1 ? 'Viral! (K ≥ 1) — Exponential growth' : kFactor >= 0.5 ? 'Sub-viral (K 0.5-1) — Amplifies paid growth' : 'Low virality (K < 0.5) — Needs improvement';
    return { kFactor: kFactor, status: status, m1: project(1), m3: project(3), m6: project(6) };
  },

  // ============================================================
  // SaaS Metrics Dashboard (Part 11 - Data-Driven)
  // ============================================================
  generateSaasMetricsWord: async function(filename, data) {
    var m = this._calcSaasMetrics(data);
    return this.generateWord(filename, { title: 'SaaS Metrics Dashboard', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Revenue Metrics', content: ['MRR: $' + this._fmt(m.mrr), 'ARR: $' + this._fmt(m.arr), 'Net New MRR: $' + this._fmt(m.netNewMRR), 'Quick Ratio: ' + m.quickRatio.toFixed(1)] },
      { heading: 'Retention & Churn', content: ['Gross Revenue Churn: ' + m.grossChurn.toFixed(1) + '%', 'Net Revenue Retention: ' + m.nrr.toFixed(0) + '%', 'Logo Churn: ' + m.logoChurn.toFixed(1) + '%'] },
      { heading: 'Efficiency', content: ['CAC: $' + this._fmt(data.cac), 'ARPU: $' + this._fmt(data.arpu), 'Health: ' + m.health] }
    ]});
  },
  generateSaasMetricsExcel: function(filename, data) {
    var m = this._calcSaasMetrics(data);
    return this.generateExcel(filename, { sheetName: 'SaaS Metrics', rows: [
      ['SaaS Metrics Dashboard', '', 'Date: ' + new Date().toLocaleDateString()], [''],
      ['Metric', 'Value', 'Benchmark'],
      ['MRR', '$' + this._fmt(m.mrr), ''], ['ARR', '$' + this._fmt(m.arr), ''],
      ['New MRR', '$' + this._fmt(data.newMRR), ''], ['Expansion MRR', '$' + this._fmt(data.expansionMRR), ''],
      ['Churned MRR', '$' + this._fmt(data.churnedMRR), '<2% of MRR'],
      ['Net New MRR', '$' + this._fmt(m.netNewMRR), ''],
      ['Quick Ratio', m.quickRatio.toFixed(1), '>4 = excellent'],
      ['Gross Revenue Churn', m.grossChurn.toFixed(1) + '%', '<2%'],
      ['Net Revenue Retention', m.nrr.toFixed(0) + '%', '>120%'],
      ['Logo Churn', m.logoChurn.toFixed(1) + '%', '<5%'],
      ['CAC', '$' + this._fmt(data.cac), ''], ['ARPU', '$' + this._fmt(data.arpu), ''],
      ['Health', m.health, '']
    ]});
  },
  generateSaasMetricsPDF: function(filename, data) {
    var m = this._calcSaasMetrics(data);
    return this.generatePDF(filename, { title: 'SaaS Metrics Dashboard', lines: [
      { text: 'Revenue Metrics', size: 14, bold: true },
      { text: 'MRR: $' + this._fmt(m.mrr) + '  |  ARR: $' + this._fmt(m.arr), size: 11 },
      { text: 'Net New MRR: $' + this._fmt(m.netNewMRR) + '  |  Quick Ratio: ' + m.quickRatio.toFixed(1), size: 11 },
      { text: '', size: 6 },
      { text: 'Retention & Churn', size: 14, bold: true },
      { text: 'Gross Revenue Churn: ' + m.grossChurn.toFixed(1) + '%', size: 11 },
      { text: 'Net Revenue Retention: ' + m.nrr.toFixed(0) + '%', size: 11 },
      { text: 'Logo Churn: ' + m.logoChurn.toFixed(1) + '%', size: 11 },
      { text: '', size: 6 },
      { text: 'Efficiency', size: 14, bold: true },
      { text: 'CAC: $' + this._fmt(data.cac) + '  |  ARPU: $' + this._fmt(data.arpu), size: 11 },
      { text: 'Health: ' + m.health, size: 12, bold: true }
    ]});
  },
  /** @private Calculate SaaS metrics */
  _calcSaasMetrics: function(data) {
    var mrr = parseFloat(data.monthlyRecurringRevenue) || 0;
    var newMRR = parseFloat(data.newMRR) || 0;
    var expansion = parseFloat(data.expansionMRR) || 0;
    var churned = parseFloat(data.churnedMRR) || 0;
    var totalCust = parseFloat(data.totalCustomers) || 1;
    var churnedCust = parseFloat(data.churnedCustomers) || 0;
    var netNewMRR = newMRR + expansion - churned;
    var quickRatio = churned > 0 ? (newMRR + expansion) / churned : 99;
    var grossChurn = mrr > 0 ? (churned / mrr) * 100 : 0;
    var nrr = mrr > 0 ? ((mrr - churned + expansion) / mrr) * 100 : 100;
    var logoChurn = totalCust > 0 ? (churnedCust / totalCust) * 100 : 0;
    var health = quickRatio >= 4 ? 'Excellent (Quick Ratio ≥ 4)' : quickRatio >= 2 ? 'Good (Quick Ratio 2-4)' : 'Needs Improvement (Quick Ratio < 2)';
    return { mrr: mrr, arr: mrr * 12, netNewMRR: netNewMRR, quickRatio: quickRatio, grossChurn: grossChurn, nrr: nrr, logoChurn: logoChurn, health: health };
  },

  // ============================================================
  // NPS Calculator (Part 11 - Data-Driven)
  // ============================================================
  generateNpsCalculatorWord: async function(filename, data) {
    var n = this._calcNPS(data);
    return this.generateWord(filename, { title: 'NPS Analysis', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Survey Results', content: ['Promoters (9-10): ' + n.promoters, 'Passives (7-8): ' + n.passives, 'Detractors (0-6): ' + n.detractors, 'Total Responses: ' + n.total] },
      { heading: 'NPS Score: ' + n.nps, content: ['Promoter %: ' + n.promoterPct.toFixed(1) + '%', 'Detractor %: ' + n.detractorPct.toFixed(1) + '%', 'Rating: ' + n.rating] }
    ]});
  },
  generateNpsCalculatorExcel: function(filename, data) {
    var n = this._calcNPS(data);
    return this.generateExcel(filename, { sheetName: 'NPS', rows: [
      ['NPS Analysis', '', 'Date: ' + new Date().toLocaleDateString()], [''],
      ['Category', 'Count', '% of Total'],
      ['Promoters (9-10)', n.promoters, n.promoterPct.toFixed(1) + '%'],
      ['Passives (7-8)', n.passives, n.passivePct.toFixed(1) + '%'],
      ['Detractors (0-6)', n.detractors, n.detractorPct.toFixed(1) + '%'],
      ['Total', n.total, '100%'], [''], ['NPS Score', n.nps, n.rating]
    ]});
  },
  generateNpsCalculatorPDF: function(filename, data) {
    var n = this._calcNPS(data);
    return this.generatePDF(filename, { title: 'NPS Analysis', lines: [
      { text: 'Survey Results', size: 14, bold: true },
      { text: 'Promoters (9-10): ' + n.promoters + ' (' + n.promoterPct.toFixed(1) + '%)', size: 11 },
      { text: 'Passives (7-8): ' + n.passives + ' (' + n.passivePct.toFixed(1) + '%)', size: 11 },
      { text: 'Detractors (0-6): ' + n.detractors + ' (' + n.detractorPct.toFixed(1) + '%)', size: 11 },
      { text: 'Total Responses: ' + n.total, size: 11 },
      { text: '', size: 6 },
      { text: 'NPS Score: ' + n.nps, size: 16, bold: true },
      { text: 'Rating: ' + n.rating, size: 12, bold: true }
    ]});
  },
  /** @private Calculate NPS */
  _calcNPS: function(data) {
    var p = parseInt(data.promoters) || 0, pa = parseInt(data.passives) || 0, d = parseInt(data.detractors) || 0;
    var total = p + pa + d || 1;
    var pPct = (p / total) * 100, dPct = (d / total) * 100, paPct = (pa / total) * 100;
    var nps = Math.round(pPct - dPct);
    var rating = nps >= 70 ? 'World-Class' : nps >= 50 ? 'Excellent' : nps >= 30 ? 'Good' : nps >= 0 ? 'Needs Improvement' : 'Critical — Urgent action needed';
    return { promoters: p, passives: pa, detractors: d, total: total, promoterPct: pPct, passivePct: paPct, detractorPct: dPct, nps: nps, rating: rating };
  },

  // ============================================================
  // Startup Valuation Calculator (Part 14 - Exit Strategies)
  // ============================================================
  generateStartupValuationWord: async function(filename, data) {
    var v = this._calcValuation(data);
    return this.generateWord(filename, { title: 'Startup Valuation Analysis', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Company: ' + (data.companyName || 'N/A'), content: ['Stage: ' + (data.stage || 'N/A'), 'Annual Recurring Revenue: $' + this._fmt(data.annualRecurringRevenue), 'Annual Growth Rate: ' + (data.annualGrowthRate || '0') + '%', 'Revenue Multiple: ' + (data.revenueMultiple || '10') + 'x'] },
      { heading: 'Valuation Estimates', content: ['Revenue Multiple Valuation: $' + this._fmt(v.revenueMultipleVal), 'DCF Valuation (' + v.years + '-year): $' + this._fmt(v.dcfVal)] }
    ]});
  },
  generateStartupValuationExcel: function(filename, data) {
    var v = this._calcValuation(data);
    return this.generateExcel(filename, { sheetName: 'Valuation', rows: [
      ['Startup Valuation Analysis', '', 'Date: ' + new Date().toLocaleDateString()], [''],
      ['Metric', 'Value'], ['Company', data.companyName || ''],
      ['Stage', data.stage || ''], ['ARR', '$' + this._fmt(data.annualRecurringRevenue)],
      ['Growth Rate', (data.annualGrowthRate || '0') + '%'], ['Revenue Multiple', (data.revenueMultiple || '10') + 'x'],
      ['Discount Rate', (data.discountRate || '30') + '%'], ['Projection Years', data.projectionYears || '5'], [''],
      ['Valuation Method', 'Estimate'],
      ['Revenue Multiple', '$' + this._fmt(v.revenueMultipleVal)],
      ['DCF (' + v.years + '-year)', '$' + this._fmt(v.dcfVal)]
    ]});
  },
  generateStartupValuationPDF: function(filename, data) {
    var v = this._calcValuation(data);
    return this.generatePDF(filename, { title: 'Startup Valuation', lines: [
      { text: 'Company: ' + (data.companyName || 'N/A'), size: 14, bold: true },
      { text: 'Stage: ' + (data.stage || 'N/A') + '  |  ARR: $' + this._fmt(data.annualRecurringRevenue), size: 11 },
      { text: 'Growth: ' + (data.annualGrowthRate || '0') + '%  |  Multiple: ' + (data.revenueMultiple || '10') + 'x', size: 11 },
      { text: '', size: 6 },
      { text: 'Revenue Multiple Valuation', size: 14, bold: true },
      { text: '$' + this._fmt(v.revenueMultipleVal), size: 16, bold: true },
      { text: '', size: 4 },
      { text: 'DCF Valuation (' + v.years + '-year)', size: 14, bold: true },
      { text: '$' + this._fmt(v.dcfVal), size: 16, bold: true }
    ]});
  },
  /** @private Calculate valuation using revenue multiple + DCF */
  _calcValuation: function(data) {
    var arr = parseFloat(data.annualRecurringRevenue) || 0;
    var mult = parseFloat(data.revenueMultiple) || 10;
    var growth = (parseFloat(data.annualGrowthRate) || 100) / 100;
    var disc = (parseFloat(data.discountRate) || 30) / 100;
    var years = parseInt(data.projectionYears) || 5;
    var revenueMultipleVal = arr * mult;
    var dcf = 0; for (var i = 1; i <= years; i++) { dcf += arr * Math.pow(1 + growth, i) / Math.pow(1 + disc, i); }
    return { revenueMultipleVal: Math.round(revenueMultipleVal), dcfVal: Math.round(dcf), years: years };
  },

  // ============================================================
  // Pitch Deck Outline Generator (Part 14 - Exit Strategies)
  // ============================================================
  generatePitchDeckWord: async function(filename, data) {
    var slides = [
      { heading: 'Problem', content: [data.problem || 'N/A'] },
      { heading: 'Solution', content: [data.solution || 'N/A'] },
      { heading: 'Market Opportunity', content: [data.marketSize || 'N/A'] },
      { heading: 'Traction', content: [data.traction || 'N/A'] },
      { heading: 'Business Model', content: [data.businessModel || 'N/A'] },
      { heading: 'Competition & Differentiation', content: [data.competitionDiff || 'N/A'] },
      { heading: 'Team', content: [data.teamHighlights || 'N/A'] },
      { heading: 'The Ask', content: [data.theAsk || 'N/A'] }
    ];
    return this.generateWord(filename, { title: 'Pitch Deck — ' + (data.companyName || 'Startup') + (data.tagline ? '\n' + data.tagline : ''), author: 'Generated from wasilzafar.com', sections: slides });
  },
  generatePitchDeckExcel: function(filename, data) {
    return this.generateExcel(filename, { sheetName: 'Pitch Deck', headers: ['Slide', 'Content'], data: [
      ['Company', data.companyName || ''], ['Tagline', data.tagline || ''], ['Problem', data.problem || ''],
      ['Solution', data.solution || ''], ['Market Size', data.marketSize || ''], ['Traction', data.traction || ''],
      ['Business Model', data.businessModel || ''], ['Competition', data.competitionDiff || ''],
      ['Team', data.teamHighlights || ''], ['The Ask', data.theAsk || '']
    ]});
  },
  generatePitchDeckPDF: function(filename, data) {
    var items = [['Problem', data.problem], ['Solution', data.solution], ['Market Size', data.marketSize], ['Traction', data.traction], ['Business Model', data.businessModel], ['Competition', data.competitionDiff], ['Team', data.teamHighlights], ['The Ask', data.theAsk]];
    var lines = [{ text: data.companyName || 'Startup', size: 16, bold: true }];
    if (data.tagline) lines.push({ text: data.tagline, size: 11 });
    lines.push({ text: '', size: 6 });
    items.forEach(function(item) { lines.push({ text: item[0], size: 13, bold: true }); lines.push({ text: item[1] || 'N/A', size: 11 }); lines.push({ text: '', size: 4 }); });
    return this.generatePDF(filename, { title: 'Pitch Deck Outline', lines: lines });
  },

  /**
   * Generate a Pitch Deck PowerPoint presentation (.pptx)
   * Creates a professional multi-slide pitch deck using PptxGenJS.
   * Reusable pattern — can be adapted for other presentation types.
   * @param {string} filename - Output filename (without extension)
   * @param {Object} data - Pitch deck data from form
   */
  generatePitchDeckPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }

    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.companyName || 'Startup') + ' — Pitch Deck';

    // Color palette (matches site CSS variables)
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

    // Helper: add a styled content slide with title bar + body
    function addContentSlide(title, bodyLines, accent) {
      accent = accent || C.teal;
      var slide = pres.addSlide();
      slide.background = { color: C.white };
      // Accent bar at top
      slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: accent } });
      // Slide number
      slide.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
      // Title
      slide.addText(title, { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 28, bold: true, color: C.navy, fontFace: 'Arial' });
      // Underline accent
      slide.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.05, w: 2.0, h: 0.04, fill: { color: accent } });
      // Body content
      if (typeof bodyLines === 'string') {
        slide.addText(bodyLines, { x: 0.6, y: 1.3, w: 8.8, h: 3.8, fontSize: 18, color: '333333', fontFace: 'Arial', wrap: true, valign: 'top', lineSpacingMultiple: 1.3 });
      } else if (Array.isArray(bodyLines)) {
        var textObjs = [];
        bodyLines.forEach(function(line, idx) {
          if (typeof line === 'string') {
            textObjs.push({ text: line, options: { fontSize: 18, color: '333333', bullet: true, breakLine: true, lineSpacingMultiple: 1.3 } });
          } else {
            // Object with {text, bold, fontSize, color, bullet}
            textObjs.push({ text: line.text || '', options: { fontSize: line.fontSize || 18, color: line.color || '333333', bold: !!line.bold, bullet: line.bullet !== false, breakLine: true, lineSpacingMultiple: 1.3 } });
          }
        });
        slide.addText(textObjs, { x: 0.6, y: 1.3, w: 8.8, h: 3.8, fontFace: 'Arial', valign: 'top' });
      }
      return slide;
    }

    // --- Slide 1: Title ---
    var titleSlide = pres.addSlide();
    titleSlide.background = { color: C.navy };
    // Accent stripe
    titleSlide.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.teal } });
    titleSlide.addText(data.companyName || 'Company Name', { x: 0.6, y: 1.0, w: 8.8, h: 1.2, fontSize: 44, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    if (data.tagline) {
      titleSlide.addText(data.tagline, { x: 0.6, y: 2.5, w: 8.8, h: 0.8, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });
    }
    titleSlide.addText('PITCH DECK', { x: 0.6, y: 4.2, w: 8.8, h: 0.5, fontSize: 14, color: C.gray, fontFace: 'Arial', align: 'center', charSpacing: 6 });

    // --- Slide 2: Problem ---
    if (data.problem) {
      addContentSlide('The Problem', data.problem, C.crimson);
    }

    // --- Slide 3: Solution ---
    if (data.solution) {
      addContentSlide('Our Solution', data.solution, C.teal);
    }

    // --- Slide 4: Market Opportunity ---
    if (data.marketSize) {
      addContentSlide('Market Opportunity', [
        { text: data.marketSize, fontSize: 22, bold: true, bullet: false, color: C.navy }
      ], C.blue);
    }

    // --- Slide 5: Traction ---
    if (data.traction) {
      addContentSlide('Traction & Milestones', data.traction, C.teal);
    }

    // --- Slide 6: Business Model ---
    if (data.businessModel) {
      addContentSlide('Business Model', data.businessModel, C.blue);
    }

    // --- Slide 7: Competition ---
    if (data.competitionDiff) {
      addContentSlide('Competition & Differentiation', data.competitionDiff, C.crimson);
    }

    // --- Slide 8: Team ---
    if (data.teamHighlights) {
      addContentSlide('The Team', data.teamHighlights, C.navy);
    }

    // --- Slide 9: The Ask ---
    if (data.theAsk) {
      var askSlide = pres.addSlide();
      askSlide.background = { color: C.light };
      askSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.crimson } });
      askSlide.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
      askSlide.addText('The Ask', { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 28, bold: true, color: C.navy, fontFace: 'Arial' });
      askSlide.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.05, w: 2.0, h: 0.04, fill: { color: C.crimson } });
      // Big ask number/text centered
      askSlide.addText(data.theAsk, { x: 1.0, y: 1.8, w: 8.0, h: 2.0, fontSize: 32, bold: true, color: C.crimson, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: C.white }, line: { color: C.crimson, width: 2 }, rectRadius: 0.15 });
    }

    // --- Slide 10: Thank You ---
    var endSlide = pres.addSlide();
    endSlide.background = { color: C.navy };
    endSlide.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    endSlide.addText('Thank You', { x: 0.6, y: 1.5, w: 8.8, h: 1.0, fontSize: 44, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    endSlide.addText(data.companyName || '', { x: 0.6, y: 3.0, w: 8.8, h: 0.6, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center' });
    if (data.tagline) {
      endSlide.addText(data.tagline, { x: 0.6, y: 3.6, w: 8.8, h: 0.5, fontSize: 16, color: C.gray, fontFace: 'Arial', align: 'center', italic: true });
    }

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // Hiring Scorecard (Part 7 - Hiring & Culture)
  // ============================================================
  generateHiringScorecardWord: async function(filename, data) {
    var dims = ['technicalSkills', 'cultureFit', 'leadership', 'communication', 'problemSolving', 'growthPotential'];
    var labels = ['Technical Skills', 'Culture Fit', 'Leadership', 'Communication', 'Problem Solving', 'Growth Potential'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var content = ['Candidate: ' + (data.candidateName || 'N/A'), 'Role: ' + (data.role || 'N/A'), 'Average Score: ' + (total / dims.length).toFixed(1) + '/5', ''];
    dims.forEach(function(d, i) { content.push(labels[i] + ': ' + (data[d] || 'N/A') + '/5'); });
    if (data.notes) content.push('', 'Notes: ' + data.notes);
    return this.generateWord(filename, { title: 'Hiring Scorecard', author: 'Generated from wasilzafar.com', sections: [{ heading: 'Hiring Scorecard', content: content }] });
  },
  generateHiringScorecardExcel: function(filename, data) {
    var dims = ['technicalSkills', 'cultureFit', 'leadership', 'communication', 'problemSolving', 'growthPotential'];
    var labels = ['Technical Skills', 'Culture Fit', 'Leadership', 'Communication', 'Problem Solving', 'Growth Potential'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var rows = [['Hiring Scorecard'], ['Candidate: ' + (data.candidateName || '')], ['Role: ' + (data.role || '')], [''], ['Dimension', 'Score (1-5)']];
    dims.forEach(function(d, i) { rows.push([labels[i], data[d] || '']); });
    rows.push([''], ['Average', (total / dims.length).toFixed(1)], ['Notes', data.notes || '']);
    return this.generateExcel(filename, { sheetName: 'Scorecard', rows: rows });
  },
  generateHiringScorecardPDF: function(filename, data) {
    var dims = ['technicalSkills', 'cultureFit', 'leadership', 'communication', 'problemSolving', 'growthPotential'];
    var labels = ['Technical Skills', 'Culture Fit', 'Leadership', 'Communication', 'Problem Solving', 'Growth Potential'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var lines = [{ text: 'Candidate: ' + (data.candidateName || 'N/A'), size: 13, bold: true }, { text: 'Role: ' + (data.role || 'N/A'), size: 11 }, { text: '', size: 4 }];
    dims.forEach(function(d, i) { lines.push({ text: labels[i] + ': ' + (data[d] || 'N/A') + '/5', size: 11 }); });
    lines.push({ text: '', size: 6 }, { text: 'Average: ' + (total / dims.length).toFixed(1) + '/5', size: 13, bold: true });
    if (data.notes) lines.push({ text: '', size: 4 }, { text: 'Notes: ' + data.notes, size: 10 });
    return this.generatePDF(filename, { title: 'Hiring Scorecard', lines: lines });
  },

  // ============================================================
  // OKR Goal Planner (Part 7 - Hiring & Culture)
  // ============================================================
  generateOkrPlannerWord: async function(filename, data) {
    var sections = [{ heading: (data.quarter || 'Q1') + ' OKR Plan', content: ['Owner: ' + (data.owner || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    sections.push({ heading: 'Objective: ' + (data.objective || 'N/A'), content: [] });
    for (var i = 1; i <= 3; i++) {
      var kr = data['keyResult' + i]; if (!kr || !kr.trim()) continue;
      var prog = data['kr' + i + 'Progress'] || '0';
      var status = data['kr' + i + 'Status'] || 'Not Started';
      sections[1].content.push('KR ' + i + ': ' + kr + ' — Progress: ' + prog + '% — Status: ' + status);
    }
    if (sections[1].content.length === 0) sections[1].content.push('No key results defined');
    return this.generateWord(filename, { title: 'OKR Plan', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateOkrPlannerExcel: function(filename, data) {
    var rows = [['OKR Plan — ' + (data.quarter || 'Q1')], ['Owner: ' + (data.owner || '')], [''],
      ['Objective', data.objective || ''], [''],
      ['Key Result', 'Progress (%)', 'Status']];
    for (var i = 1; i <= 3; i++) {
      var kr = data['keyResult' + i]; if (!kr || !kr.trim()) continue;
      rows.push([kr, (data['kr' + i + 'Progress'] || '0') + '%', data['kr' + i + 'Status'] || 'Not Started']);
    }
    return this.generateExcel(filename, { sheetName: 'OKR Plan', rows: rows });
  },
  generateOkrPlannerPDF: function(filename, data) {
    var lines = [{ text: (data.quarter || 'Q1') + ' OKR Plan', size: 14, bold: true }, { text: 'Owner: ' + (data.owner || 'N/A'), size: 11 }, { text: '', size: 6 }];
    lines.push({ text: 'Objective: ' + (data.objective || 'N/A'), size: 13, bold: true });
    for (var i = 1; i <= 3; i++) {
      var kr = data['keyResult' + i]; if (!kr || !kr.trim()) continue;
      lines.push({ text: 'KR ' + i + ': ' + kr, size: 11 });
      lines.push({ text: '  Progress: ' + (data['kr' + i + 'Progress'] || '0') + '%  |  Status: ' + (data['kr' + i + 'Status'] || 'Not Started'), size: 10 });
    }
    return this.generatePDF(filename, { title: 'OKR Plan', lines: lines });
  },

  generateOkrPlannerPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }
    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.quarter || 'Q1') + ' OKR Plan';
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

    // Title slide
    var s1 = pres.addSlide(); s1.background = { color: C.navy };
    s1.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.teal } });
    s1.addText((data.quarter || 'Q1') + ' OKR Plan', { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    s1.addText('Objectives & Key Results', { x: 0.6, y: 2.5, w: 8.8, h: 0.7, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });
    if (data.owner) s1.addText('Owner: ' + data.owner, { x: 0.6, y: 3.5, w: 8.8, h: 0.4, fontSize: 16, color: C.gray, fontFace: 'Arial', align: 'center' });

    // Collect KRs
    var krs = [];
    for (var i = 1; i <= 3; i++) {
      var kr = data['keyResult' + i]; if (!kr || !kr.trim()) continue;
      krs.push({ label: kr, progress: parseFloat(data['kr' + i + 'Progress']) || 0, status: data['kr' + i + 'Status'] || 'Not Started' });
    }

    // Objective slide
    var s2 = pres.addSlide(); s2.background = { color: C.white };
    s2.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.teal } });
    s2.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
    s2.addText('OBJECTIVE', { x: 0.6, y: 0.25, w: 8.8, h: 0.35, fontSize: 12, color: C.gray, fontFace: 'Arial', charSpacing: 3 });
    s2.addText(data.objective || 'Not defined', { x: 0.6, y: 0.6, w: 8.8, h: 0.9, fontSize: 20, bold: true, color: C.navy, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4, 4, 4, 4] });
    s2.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.6, w: 2.0, h: 0.04, fill: { color: C.teal } });
    s2.addText('KEY RESULTS', { x: 0.6, y: 1.8, w: 8.8, h: 0.35, fontSize: 12, color: C.gray, fontFace: 'Arial', charSpacing: 3 });

    // Key Results — each gets a roomy card-like block
    var yPos = 2.3;
    for (var j = 0; j < krs.length; j++) {
      var item = krs[j];
      var statusColor = item.status === 'Complete' ? C.teal : item.status === 'On Track' ? C.blue : item.status === 'At Risk' ? 'CC8800' : C.crimson;
      // KR card background
      s2.addShape(pres.ShapeType.rect, { x: 0.5, y: yPos - 0.1, w: 9.1, h: 1.45, fill: { color: C.light }, rectRadius: 0.08 });
      // KR number badge
      s2.addText('KR ' + (j + 1), { x: 0.7, y: yPos, w: 0.65, h: 0.35, fontSize: 11, bold: true, color: C.white, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: statusColor }, rectRadius: 0.06 });
      // KR label text
      s2.addText(item.label, { x: 1.5, y: yPos - 0.05, w: 8.0, h: 0.5, fontSize: 14, bold: true, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [2, 4, 2, 4] });
      // Progress bar row
      var barY = yPos + 0.55;
      // Progress bar background
      s2.addShape(pres.ShapeType.rect, { x: 1.5, y: barY, w: 5.5, h: 0.28, fill: { color: 'E0E0E0' }, rectRadius: 0.05 });
      // Progress bar fill
      if (item.progress > 0) s2.addShape(pres.ShapeType.rect, { x: 1.5, y: barY, w: Math.min(5.5, 5.5 * item.progress / 100), h: 0.28, fill: { color: statusColor }, rectRadius: 0.05 });
      // Progress percentage
      s2.addText(item.progress + '%', { x: 7.2, y: barY - 0.03, w: 0.85, h: 0.35, fontSize: 13, bold: true, color: statusColor, fontFace: 'Arial', valign: 'middle' });
      // Status badge
      s2.addText(item.status, { x: 8.1, y: barY - 0.03, w: 1.4, h: 0.35, fontSize: 11, color: C.white, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: statusColor }, rectRadius: 0.08 });
      yPos += 1.65;
    }

    // If no KRs, show placeholder
    if (krs.length === 0) {
      s2.addText('No key results defined', { x: 0.6, y: 2.5, w: 8.8, h: 0.5, fontSize: 16, color: C.gray, fontFace: 'Arial', italic: true, align: 'center' });
    }

    // Closing slide
    var end = pres.addSlide(); end.background = { color: C.navy };
    end.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    end.addText((data.quarter || 'Q1') + ' OKR Plan', { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    if (data.owner) end.addText('Owner: ' + data.owner, { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 18, color: C.teal, fontFace: 'Arial', align: 'center' });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // Accelerator Fit Assessment (Part 13 - Ecosystem)
  // ============================================================
  generateAcceleratorFitWord: async function(filename, data) {
    var dims = ['stage', 'teamStrength', 'traction', 'marketOpportunity', 'productReadiness', 'scalability', 'coachability', 'networkNeed', 'fundraisingTimeline'];
    var labels = ['Stage Readiness', 'Team Strength', 'Traction', 'Market Opportunity', 'Product Readiness', 'Scalability', 'Coachability', 'Network Need', 'Fundraising Timeline'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var avg = total / dims.length;
    var rec = avg >= 4 ? 'Strong Fit — Apply to accelerators!' : avg >= 3 ? 'Moderate Fit — Strengthen weak areas first' : 'Weak Fit — Build fundamentals before applying';
    var content = ['Company: ' + (data.companyName || 'N/A'), 'Overall Score: ' + avg.toFixed(1) + '/5', 'Recommendation: ' + rec, ''];
    dims.forEach(function(d, i) { content.push(labels[i] + ': ' + (data[d] || 'N/A') + '/5'); });
    return this.generateWord(filename, { title: 'Accelerator Readiness Assessment', author: 'Generated from wasilzafar.com', sections: [{ heading: 'Accelerator Readiness Assessment', content: content }] });
  },
  generateAcceleratorFitExcel: function(filename, data) {
    var dims = ['stage', 'teamStrength', 'traction', 'marketOpportunity', 'productReadiness', 'scalability', 'coachability', 'networkNeed', 'fundraisingTimeline'];
    var labels = ['Stage Readiness', 'Team Strength', 'Traction', 'Market Opportunity', 'Product Readiness', 'Scalability', 'Coachability', 'Network Need', 'Fundraising Timeline'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var rows = [['Accelerator Readiness Assessment'], ['Company: ' + (data.companyName || '')], [''], ['Dimension', 'Score (1-5)']];
    dims.forEach(function(d, i) { rows.push([labels[i], data[d] || '']); });
    rows.push([''], ['Average Score', (total / dims.length).toFixed(1)]);
    return this.generateExcel(filename, { sheetName: 'Readiness', rows: rows });
  },
  generateAcceleratorFitPDF: function(filename, data) {
    var dims = ['stage', 'teamStrength', 'traction', 'marketOpportunity', 'productReadiness', 'scalability', 'coachability', 'networkNeed', 'fundraisingTimeline'];
    var labels = ['Stage Readiness', 'Team Strength', 'Traction', 'Market Opportunity', 'Product Readiness', 'Scalability', 'Coachability', 'Network Need', 'Fundraising Timeline'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var avg = total / dims.length;
    var lines = [{ text: 'Company: ' + (data.companyName || 'N/A'), size: 13, bold: true }, { text: '', size: 4 }];
    dims.forEach(function(d, i) { lines.push({ text: labels[i] + ': ' + (data[d] || 'N/A') + '/5', size: 11 }); });
    lines.push({ text: '', size: 6 }, { text: 'Overall Score: ' + avg.toFixed(1) + '/5', size: 13, bold: true });
    lines.push({ text: avg >= 4 ? 'Strong Fit — Apply!' : avg >= 3 ? 'Moderate — Strengthen first' : 'Weak — Build fundamentals', size: 12, bold: true });
    return this.generatePDF(filename, { title: 'Accelerator Readiness', lines: lines });
  },

  // ============================================================
  // Technology Readiness Assessment (Part 12 - Innovation)
  // ============================================================
  generateTechReadinessWord: async function(filename, data) {
    var dims = ['coreTechnology', 'dataInfrastructure', 'aiMlCapability', 'cloudScalability', 'securityCompliance', 'apiIntegration', 'technicalTeam', 'ipDefensibility', 'devopsAutomation'];
    var labels = ['Core Technology', 'Data Infrastructure', 'AI/ML Capability', 'Cloud Scalability', 'Security & Compliance', 'API Integration', 'Technical Team', 'IP Defensibility', 'DevOps & Automation'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var avg = total / dims.length;
    var rec = avg >= 4 ? 'Strong — Technology stack is mature and scalable' : avg >= 3 ? 'Moderate — Invest in weak areas' : 'Weak — Significant technical debt to address';
    var content = ['Company: ' + (data.companyName || 'N/A'), 'Readiness Score: ' + avg.toFixed(1) + '/5', 'Assessment: ' + rec, ''];
    dims.forEach(function(d, i) { content.push(labels[i] + ': ' + (data[d] || 'N/A') + '/5'); });
    return this.generateWord(filename, { title: 'Technology Readiness Assessment', author: 'Generated from wasilzafar.com', sections: [{ heading: 'Technology Readiness', content: content }] });
  },
  generateTechReadinessExcel: function(filename, data) {
    var dims = ['coreTechnology', 'dataInfrastructure', 'aiMlCapability', 'cloudScalability', 'securityCompliance', 'apiIntegration', 'technicalTeam', 'ipDefensibility', 'devopsAutomation'];
    var labels = ['Core Technology', 'Data Infrastructure', 'AI/ML Capability', 'Cloud Scalability', 'Security & Compliance', 'API Integration', 'Technical Team', 'IP Defensibility', 'DevOps & Automation'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var rows = [['Technology Readiness Assessment'], ['Company: ' + (data.companyName || '')], [''], ['Dimension', 'Score (1-5)']];
    dims.forEach(function(d, i) { rows.push([labels[i], data[d] || '']); });
    rows.push([''], ['Average Score', (total / dims.length).toFixed(1)]);
    return this.generateExcel(filename, { sheetName: 'Tech Readiness', rows: rows });
  },
  generateTechReadinessPDF: function(filename, data) {
    var dims = ['coreTechnology', 'dataInfrastructure', 'aiMlCapability', 'cloudScalability', 'securityCompliance', 'apiIntegration', 'technicalTeam', 'ipDefensibility', 'devopsAutomation'];
    var labels = ['Core Technology', 'Data Infrastructure', 'AI/ML Capability', 'Cloud Scalability', 'Security & Compliance', 'API Integration', 'Technical Team', 'IP Defensibility', 'DevOps & Automation'];
    var total = 0; dims.forEach(function(d) { total += parseFloat(data[d]) || 0; });
    var avg = total / dims.length;
    var lines = [{ text: 'Company: ' + (data.companyName || 'N/A'), size: 13, bold: true }, { text: '', size: 4 }];
    dims.forEach(function(d, i) { lines.push({ text: labels[i] + ': ' + (data[d] || 'N/A') + '/5', size: 11 }); });
    lines.push({ text: '', size: 6 }, { text: 'Readiness Score: ' + avg.toFixed(1) + '/5', size: 13, bold: true });
    lines.push({ text: avg >= 4 ? 'Strong — Mature stack' : avg >= 3 ? 'Moderate — Invest in gaps' : 'Weak — Address tech debt', size: 12, bold: true });
    return this.generatePDF(filename, { title: 'Tech Readiness Assessment', lines: lines });
  },

  // ============================================================
  // SAFE Conversion Calculator (Part 5 - Fundraising, missed)
  // ============================================================
  generateSafeConversionWord: async function(filename, data) {
    var s = this._calcSAFE(data);
    return this.generateWord(filename, { title: 'SAFE Conversion Analysis', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'SAFE Terms', content: ['Investment Amount: $' + this._fmt(data.safeInvestment), 'Valuation Cap: $' + this._fmt(data.valuationCap), 'Discount Rate: ' + (data.discountPercent || '0') + '%'] },
      { heading: 'Series A Terms', content: ['Pre-Money Valuation: $' + this._fmt(data.seriesAPreMoney), 'Series A Investment: $' + this._fmt(data.seriesAInvestment), 'Shares Outstanding: ' + this._fmt(data.sharesOutstanding)] },
      { heading: 'Conversion Results', content: ['SAFE Conversion Price: $' + s.conversionPrice.toFixed(4), 'SAFE Shares Issued: ' + this._fmt(s.safeShares), 'Post-Money Valuation: $' + this._fmt(s.postMoney), 'Founder Ownership: ' + s.founderPct.toFixed(1) + '%', 'SAFE Investor Ownership: ' + s.safePct.toFixed(1) + '%', 'Series A Investor: ' + s.seriesAPct.toFixed(1) + '%'] }
    ]});
  },
  generateSafeConversionExcel: function(filename, data) {
    var s = this._calcSAFE(data);
    return this.generateExcel(filename, { sheetName: 'SAFE Conversion', rows: [
      ['SAFE Conversion Analysis', '', 'Date: ' + new Date().toLocaleDateString()], [''],
      ['SAFE Terms', 'Value'], ['Investment Amount', '$' + this._fmt(data.safeInvestment)],
      ['Valuation Cap', '$' + this._fmt(data.valuationCap)], ['Discount Rate', (data.discountPercent || '0') + '%'], [''],
      ['Series A Terms', 'Value'], ['Pre-Money', '$' + this._fmt(data.seriesAPreMoney)],
      ['Series A Investment', '$' + this._fmt(data.seriesAInvestment)], ['Shares Outstanding', this._fmt(data.sharesOutstanding)], [''],
      ['Results', 'Value'], ['Conversion Price', '$' + s.conversionPrice.toFixed(4)],
      ['SAFE Shares', this._fmt(s.safeShares)], ['Post-Money Valuation', '$' + this._fmt(s.postMoney)],
      ['Founder %', s.founderPct.toFixed(1) + '%'], ['SAFE Investor %', s.safePct.toFixed(1) + '%'],
      ['Series A Investor %', s.seriesAPct.toFixed(1) + '%']
    ]});
  },
  generateSafeConversionPDF: function(filename, data) {
    var s = this._calcSAFE(data);
    return this.generatePDF(filename, { title: 'SAFE Conversion Analysis', lines: [
      { text: 'SAFE Terms', size: 14, bold: true },
      { text: 'Investment: $' + this._fmt(data.safeInvestment) + '  |  Cap: $' + this._fmt(data.valuationCap) + '  |  Discount: ' + (data.discountPercent || '0') + '%', size: 11 },
      { text: '', size: 6 },
      { text: 'Conversion Results', size: 14, bold: true },
      { text: 'Conversion Price: $' + s.conversionPrice.toFixed(4), size: 11 },
      { text: 'SAFE Shares Issued: ' + this._fmt(s.safeShares), size: 11 },
      { text: '', size: 4 },
      { text: 'Ownership Post-Series A', size: 14, bold: true },
      { text: 'Founders: ' + s.founderPct.toFixed(1) + '%', size: 12, bold: true },
      { text: 'SAFE Investor: ' + s.safePct.toFixed(1) + '%', size: 11 },
      { text: 'Series A Investor: ' + s.seriesAPct.toFixed(1) + '%', size: 11 }
    ]});
  },
  /** @private Calculate SAFE conversion */
  _calcSAFE: function(data) {
    var investment = parseFloat(data.safeInvestment) || 0;
    var cap = parseFloat(data.valuationCap) || 5000000;
    var discount = (parseFloat(data.discountPercent) || 20) / 100;
    var preMoney = parseFloat(data.seriesAPreMoney) || 10000000;
    var seriesA = parseFloat(data.seriesAInvestment) || 3000000;
    var shares = parseFloat(data.sharesOutstanding) || 10000000;
    var seriesAPrice = preMoney / shares;
    var capPrice = cap / shares;
    var discountPrice = seriesAPrice * (1 - discount);
    var conversionPrice = Math.min(capPrice, discountPrice);
    var safeShares = conversionPrice > 0 ? Math.round(investment / conversionPrice) : 0;
    var seriesAShares = seriesAPrice > 0 ? Math.round(seriesA / seriesAPrice) : 0;
    var totalShares = shares + safeShares + seriesAShares;
    var postMoney = preMoney + seriesA;
    return { conversionPrice: conversionPrice, safeShares: safeShares, postMoney: postMoney, founderPct: (shares / totalShares) * 100, safePct: (safeShares / totalShares) * 100, seriesAPct: (seriesAShares / totalShares) * 100 };
  },

  // ============================================================
  // Unit Economics Calculator (Part 3 - Business Models, missed)
  // ============================================================
  generateUnitEconomicsWord: async function(filename, data) {
    var u = this._calcUnitEcon(data);
    return this.generateWord(filename, { title: 'Unit Economics Analysis', author: 'Generated from wasilzafar.com', sections: [
      { heading: 'Input Metrics', content: ['ARPU (Monthly): $' + this._fmt(data.avgRevenuePerUser), 'COGS (Monthly): $' + this._fmt(data.costOfGoodsSold), 'Avg Customer Lifespan: ' + (data.avgLifespanMonths || '0') + ' months', 'CAC: $' + this._fmt(data.customerAcquisitionCost)] },
      { heading: 'Unit Economics', content: ['Gross Margin: ' + u.marginPct.toFixed(0) + '%', 'Contribution/User: $' + this._fmt(u.contribution) + '/mo', 'LTV: $' + this._fmt(u.ltv), 'LTV:CAC Ratio: ' + u.ratio + ':1', 'Payback Period: ' + u.payback + ' months', 'Health: ' + u.health] }
    ]});
  },
  generateUnitEconomicsExcel: function(filename, data) {
    var u = this._calcUnitEcon(data);
    return this.generateExcel(filename, { sheetName: 'Unit Economics', rows: [
      ['Unit Economics Analysis', '', 'Date: ' + new Date().toLocaleDateString()], [''],
      ['Input', 'Value'], ['ARPU (Monthly)', '$' + this._fmt(data.avgRevenuePerUser)],
      ['COGS (Monthly)', '$' + this._fmt(data.costOfGoodsSold)], ['Customer Lifespan', (data.avgLifespanMonths || '0') + ' months'],
      ['CAC', '$' + this._fmt(data.customerAcquisitionCost)], [''],
      ['Calculated', 'Value'], ['Gross Margin', u.marginPct.toFixed(0) + '%'],
      ['Contribution/User', '$' + this._fmt(u.contribution) + '/mo'],
      ['LTV', '$' + this._fmt(u.ltv)], ['LTV:CAC', u.ratio + ':1'],
      ['Payback', u.payback + ' months'], ['Health', u.health]
    ]});
  },
  generateUnitEconomicsPDF: function(filename, data) {
    var u = this._calcUnitEcon(data);
    return this.generatePDF(filename, { title: 'Unit Economics', lines: [
      { text: 'Input Metrics', size: 14, bold: true },
      { text: 'ARPU: $' + this._fmt(data.avgRevenuePerUser) + '/mo  |  COGS: $' + this._fmt(data.costOfGoodsSold) + '/mo  |  Lifespan: ' + (data.avgLifespanMonths || '0') + ' months', size: 11 },
      { text: 'CAC: $' + this._fmt(data.customerAcquisitionCost), size: 11 },
      { text: '', size: 6 },
      { text: 'Unit Economics', size: 14, bold: true },
      { text: 'LTV: $' + this._fmt(u.ltv), size: 12, bold: true },
      { text: 'LTV:CAC Ratio: ' + u.ratio + ':1', size: 13, bold: true },
      { text: 'Gross Margin: ' + u.marginPct.toFixed(0) + '%', size: 11 },
      { text: 'Payback Period: ' + u.payback + ' months', size: 11 },
      { text: '', size: 4 },
      { text: 'Health: ' + u.health, size: 12, bold: true }
    ]});
  },
  // ============================================================
  // VC Pitch Deck Generator (Part 5 - Fundraising)
  // ============================================================
  generateVCPitchDeckWord: async function(filename, data) {
    var sections = [
      { heading: '1. Title', content: [(data.companyName || 'Company') + (data.tagline ? ' — ' + data.tagline : '') + (data.founderNames ? '\nPrepared by: ' + data.founderNames : '')] },
      { heading: '2. Problem', content: [data.problem || 'N/A'] },
      { heading: '3. Solution', content: [data.solution || 'N/A'] },
      { heading: '4. Demo / Product', content: [data.demoProduct || 'N/A'] },
      { heading: '5. Traction', content: [data.traction || 'N/A'] },
      { heading: '6. Market (TAM/SAM/SOM)', content: [data.market || 'N/A'] },
      { heading: '7. Business Model', content: [data.businessModel || 'N/A'] },
      { heading: '8. Competition & Differentiation', content: [data.competition || 'N/A'] },
      { heading: '9. Team', content: [data.team || 'N/A'] },
      { heading: '10. Financials', content: [data.financials || 'N/A'] },
      { heading: '11. The Ask', content: [data.theAsk || 'N/A'] },
      { heading: '12. Closing / Vision', content: [data.closing || 'N/A'] }
    ];
    if (data.appendixFinancials || data.appendixTestimonials || data.appendixArchitecture || data.appendixPress) {
      sections.push({ heading: 'Appendix', content: [
        data.appendixFinancials ? 'Detailed Financials:\n' + data.appendixFinancials : '',
        data.appendixTestimonials ? 'Customer Testimonials:\n' + data.appendixTestimonials : '',
        data.appendixArchitecture ? 'Technical Architecture:\n' + data.appendixArchitecture : '',
        data.appendixPress ? 'Press & Awards:\n' + data.appendixPress : ''
      ].filter(Boolean) });
    }
    return this.generateWord(filename, { title: 'VC Pitch Deck — ' + (data.companyName || 'Startup'), author: 'Generated from wasilzafar.com', sections: sections });
  },

  generateVCPitchDeckExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || '', ''],
      ['Tagline', data.tagline || '', ''],
      ['Founder(s)', data.founderNames || '', ''],
      ['Problem', data.problem || '', 'Slide 2'],
      ['Solution', data.solution || '', 'Slide 3'],
      ['Demo / Product', data.demoProduct || '', 'Slide 4'],
      ['Traction', data.traction || '', 'Slide 5'],
      ['Market (TAM/SAM/SOM)', data.market || '', 'Slide 6'],
      ['Business Model', data.businessModel || '', 'Slide 7'],
      ['Competition', data.competition || '', 'Slide 8'],
      ['Team', data.team || '', 'Slide 9'],
      ['Financials', data.financials || '', 'Slide 10'],
      ['The Ask', data.theAsk || '', 'Slide 11'],
      ['Closing / Vision', data.closing || '', 'Slide 12']
    ];
    if (data.appendixFinancials) rows.push(['Appendix: Financials', data.appendixFinancials, 'Appendix']);
    if (data.appendixTestimonials) rows.push(['Appendix: Testimonials', data.appendixTestimonials, 'Appendix']);
    if (data.appendixArchitecture) rows.push(['Appendix: Architecture', data.appendixArchitecture, 'Appendix']);
    if (data.appendixPress) rows.push(['Appendix: Press/Awards', data.appendixPress, 'Appendix']);
    return this.generateExcel(filename, { sheetName: 'VC Pitch Deck', headers: ['Section', 'Content', 'Slide'], data: rows });
  },

  generateVCPitchDeckPDF: function(filename, data) {
    var lines = [
      { text: data.companyName || 'Startup', size: 18, bold: true },
      { text: data.tagline || '', size: 12 },
      { text: data.founderNames ? 'Prepared by: ' + data.founderNames : '', size: 10 },
      { text: 'VC Pitch Deck — 12-Slide Format', size: 13, bold: true },
      { text: '', size: 6 }
    ];
    var slides = [
      ['Slide 2: Problem', data.problem], ['Slide 3: Solution', data.solution],
      ['Slide 4: Demo / Product', data.demoProduct], ['Slide 5: Traction', data.traction],
      ['Slide 6: Market', data.market], ['Slide 7: Business Model', data.businessModel],
      ['Slide 8: Competition', data.competition], ['Slide 9: Team', data.team],
      ['Slide 10: Financials', data.financials], ['Slide 11: The Ask', data.theAsk],
      ['Slide 12: Closing', data.closing]
    ];
    slides.forEach(function(s) {
      lines.push({ text: s[0], size: 13, bold: true });
      lines.push({ text: s[1] || 'N/A', size: 11 });
      lines.push({ text: '', size: 4 });
    });
    // Appendix
    var hasAppendix = data.appendixFinancials || data.appendixTestimonials || data.appendixArchitecture || data.appendixPress;
    if (hasAppendix) {
      lines.push({ text: '', size: 6 });
      lines.push({ text: 'APPENDIX', size: 14, bold: true });
      if (data.appendixFinancials) { lines.push({ text: 'Detailed Financials', size: 12, bold: true }); lines.push({ text: data.appendixFinancials, size: 10 }); lines.push({ text: '', size: 4 }); }
      if (data.appendixTestimonials) { lines.push({ text: 'Customer Testimonials', size: 12, bold: true }); lines.push({ text: data.appendixTestimonials, size: 10 }); lines.push({ text: '', size: 4 }); }
      if (data.appendixArchitecture) { lines.push({ text: 'Technical Architecture', size: 12, bold: true }); lines.push({ text: data.appendixArchitecture, size: 10 }); lines.push({ text: '', size: 4 }); }
      if (data.appendixPress) { lines.push({ text: 'Press & Awards', size: 12, bold: true }); lines.push({ text: data.appendixPress, size: 10 }); }
    }
    return this.generatePDF(filename, { title: 'VC Pitch Deck', lines: lines });
  },

  generateVCPitchDeckPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }

    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.companyName || 'Startup') + ' — VC Pitch Deck';

    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666', darkGray: '333333' };

    // Slide number on all content slides
    function slideNum(slide) { slide.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray }; }

    // Reusable content slide: accent bar + title + body
    function contentSlide(title, body, accent) {
      accent = accent || C.teal;
      var slide = pres.addSlide();
      slide.background = { color: C.white };
      slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: accent } });
      slideNum(slide);
      slide.addText(title, { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 28, bold: true, color: C.navy, fontFace: 'Arial' });
      slide.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.05, w: 2.0, h: 0.04, fill: { color: accent } });
      slide.addText(body || 'N/A', { x: 0.6, y: 1.3, w: 8.8, h: 3.9, fontSize: 18, color: C.darkGray, fontFace: 'Arial', wrap: true, valign: 'top', lineSpacingMultiple: 1.3, fit: 'shrink', margin: [4, 4, 4, 4] });
      return slide;
    }

    // --- Slide 1: Title ---
    var ts = pres.addSlide();
    ts.background = { color: C.navy };
    ts.addShape(pres.ShapeType.rect, { x: 0, y: 2.4, w: '100%', h: 0.06, fill: { color: C.teal } });
    ts.addText(data.companyName || 'Company Name', { x: 0.6, y: 0.6, w: 8.8, h: 1.2, fontSize: 44, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    if (data.tagline) {
      ts.addText(data.tagline, { x: 0.6, y: 1.9, w: 8.8, h: 0.5, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });
    }
    if (data.founderNames) {
      ts.addText(data.founderNames, { x: 0.6, y: 2.7, w: 8.8, h: 0.5, fontSize: 16, color: C.gray, fontFace: 'Arial', align: 'center' });
    }
    ts.addText('INVESTOR PITCH DECK', { x: 0.6, y: 4.2, w: 8.8, h: 0.4, fontSize: 13, color: C.gray, fontFace: 'Arial', align: 'center', charSpacing: 6 });

    // --- Slide 2: Problem ---
    if (data.problem) contentSlide('The Problem', data.problem, C.crimson);

    // --- Slide 3: Solution ---
    if (data.solution) contentSlide('Our Solution', data.solution, C.teal);

    // --- Slide 4: Demo / Product ---
    if (data.demoProduct) contentSlide('Demo / Product', data.demoProduct, C.blue);

    // --- Slide 5: Traction ---
    if (data.traction) {
      var trSlide = contentSlide('Traction & Metrics', data.traction, C.teal);
      trSlide.addShape(pres.ShapeType.rect, { x: 0.4, y: 5.0, w: 9.2, h: 0.03, fill: { color: C.teal } });
    }

    // --- Slide 6: Market ---
    if (data.market) contentSlide('Market Opportunity', data.market, C.blue);

    // --- Slide 7: Business Model ---
    if (data.businessModel) contentSlide('Business Model', data.businessModel, C.teal);

    // --- Slide 8: Competition ---
    if (data.competition) contentSlide('Competition & Differentiation', data.competition, C.crimson);

    // --- Slide 9: Team ---
    if (data.team) contentSlide('The Team', data.team, C.navy);

    // --- Slide 10: Financials ---
    if (data.financials) contentSlide('Financial Projections', data.financials, C.blue);

    // --- Slide 11: The Ask ---
    if (data.theAsk) {
      var askSlide = pres.addSlide();
      askSlide.background = { color: C.light };
      askSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.crimson } });
      slideNum(askSlide);
      askSlide.addText('The Ask', { x: 0.6, y: 0.3, w: 6.5, h: 0.7, fontSize: 28, bold: true, color: C.navy, fontFace: 'Arial' });
      askSlide.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.05, w: 2.0, h: 0.04, fill: { color: C.crimson } });
      askSlide.addText(data.theAsk, { x: 1.0, y: 1.6, w: 8.0, h: 2.4, fontSize: 24, bold: true, color: C.crimson, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: C.white }, line: { color: C.crimson, width: 2 }, rectRadius: 0.15, wrap: true, fit: 'shrink', margin: [6, 6, 6, 6] });
    }

    // --- Slide 12: Closing ---
    if (data.closing) contentSlide('Vision & Next Steps', data.closing, C.teal);

    // --- Appendix slides ---
    var hasAppendix = data.appendixFinancials || data.appendixTestimonials || data.appendixArchitecture || data.appendixPress;
    if (hasAppendix) {
      var apxTitle = pres.addSlide();
      apxTitle.background = { color: C.navy };
      apxTitle.addText('APPENDIX', { x: 0.6, y: 2.0, w: 8.8, h: 1.0, fontSize: 40, bold: true, color: C.white, fontFace: 'Arial', align: 'center', charSpacing: 8 });
      apxTitle.addShape(pres.ShapeType.rect, { x: 3.5, y: 3.2, w: 3.0, h: 0.05, fill: { color: C.teal } });

      if (data.appendixFinancials) contentSlide('Appendix: Detailed Financials', data.appendixFinancials, C.blue);
      if (data.appendixTestimonials) contentSlide('Appendix: Customer Testimonials', data.appendixTestimonials, C.teal);
      if (data.appendixArchitecture) contentSlide('Appendix: Technical Architecture', data.appendixArchitecture, C.navy);
      if (data.appendixPress) contentSlide('Appendix: Press & Awards', data.appendixPress, C.crimson);
    }

    // --- Thank You slide ---
    var endSlide = pres.addSlide();
    endSlide.background = { color: C.navy };
    endSlide.addShape(pres.ShapeType.rect, { x: 0, y: 2.8, w: '100%', h: 0.06, fill: { color: C.teal } });
    endSlide.addText('Thank You', { x: 0.6, y: 1.3, w: 8.8, h: 1.0, fontSize: 44, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    endSlide.addText(data.companyName || '', { x: 0.6, y: 3.2, w: 8.8, h: 0.6, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center' });
    if (data.tagline) {
      endSlide.addText(data.tagline, { x: 0.6, y: 3.8, w: 8.8, h: 0.5, fontSize: 16, color: C.gray, fontFace: 'Arial', align: 'center', italic: true });
    }
    endSlide.addText('Q&A', { x: 0.6, y: 4.5, w: 8.8, h: 0.4, fontSize: 14, color: C.gray, fontFace: 'Arial', align: 'center', charSpacing: 6 });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // Angel Pitch Generator (Part 5 - Fundraising)
  // ============================================================
  generateAngelPitchWord: async function(filename, data) {
    var slides = [
      { heading: 'Hook', content: [data.hook || 'N/A'] },
      { heading: 'Problem', content: [data.problem || 'N/A'] },
      { heading: 'Solution', content: [data.solution || 'N/A'] },
      { heading: 'Traction', content: [data.traction || 'N/A'] },
      { heading: 'Business Model', content: [data.businessModel || 'N/A'] },
      { heading: 'Market Opportunity', content: [data.market || 'N/A'] },
      { heading: 'Team', content: [data.team || 'N/A'] },
      { heading: 'The Ask', content: [data.theAsk || 'N/A'] },
      { heading: 'Why Now', content: [data.whyNow || 'N/A'] }
    ];
    return this.generateWord(filename, { title: 'Angel Pitch — ' + (data.companyName || 'Startup') + (data.tagline ? '\n' + data.tagline : ''), author: 'Generated from wasilzafar.com', sections: slides });
  },

  generateAngelPitchExcel: function(filename, data) {
    return this.generateExcel(filename, { sheetName: 'Angel Pitch', headers: ['Section', 'Content', 'Duration'], data: [
      ['Company', data.companyName || '', ''],
      ['Tagline', data.tagline || '', ''],
      ['Hook', data.hook || '', '30 sec'],
      ['Problem', data.problem || '', '1 min'],
      ['Solution', data.solution || '', '2 min'],
      ['Traction', data.traction || '', '2 min'],
      ['Business Model', data.businessModel || '', '1 min'],
      ['Market (TAM/SAM/SOM)', data.market || '', '1 min'],
      ['Team', data.team || '', '1 min'],
      ['The Ask', data.theAsk || '', '30 sec'],
      ['Why Now / Close', data.whyNow || '', '1 min']
    ]});
  },

  generateAngelPitchPDF: function(filename, data) {
    var items = [
      ['Hook (30s)', data.hook], ['Problem (1 min)', data.problem],
      ['Solution (2 min)', data.solution], ['Traction (2 min)', data.traction],
      ['Business Model (1 min)', data.businessModel], ['Market (1 min)', data.market],
      ['Team (1 min)', data.team], ['The Ask (30s)', data.theAsk],
      ['Why Now (1 min)', data.whyNow]
    ];
    var lines = [{ text: data.companyName || 'Startup', size: 16, bold: true }];
    if (data.tagline) lines.push({ text: data.tagline, size: 11 });
    lines.push({ text: 'Angel Pitch — 10-Minute Format', size: 12, bold: true });
    lines.push({ text: '', size: 6 });
    items.forEach(function(item) {
      lines.push({ text: item[0], size: 13, bold: true });
      lines.push({ text: item[1] || 'N/A', size: 11 });
      lines.push({ text: '', size: 4 });
    });
    return this.generatePDF(filename, { title: 'Angel Pitch Outline', lines: lines });
  },

  generateAngelPitchPPTX: async function(filename, data) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }

    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'Generated from wasilzafar.com';
    pres.title = (data.companyName || 'Startup') + ' — Angel Pitch';

    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

    function addSlide(title, body, accent, timing) {
      accent = accent || C.teal;
      var slide = pres.addSlide();
      slide.background = { color: C.white };
      slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: accent } });
      slide.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
      slide.addText(title, { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 28, bold: true, color: C.navy, fontFace: 'Arial' });
      slide.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.05, w: 2.0, h: 0.04, fill: { color: accent } });
      if (timing) {
        slide.addText(timing, { x: 7.5, y: 0.35, w: 2.2, h: 0.4, fontSize: 11, color: C.white, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: accent }, rectRadius: 0.12 });
      }
      slide.addText(body || 'N/A', { x: 0.6, y: 1.3, w: 8.8, h: 3.8, fontSize: 18, color: '333333', fontFace: 'Arial', wrap: true, valign: 'top', lineSpacingMultiple: 1.3, fit: 'shrink', margin: [4, 4, 4, 4] });
      return slide;
    }

    // Title slide
    var ts = pres.addSlide();
    ts.background = { color: C.navy };
    ts.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.teal } });
    ts.addText(data.companyName || 'Company Name', { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 44, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    if (data.tagline) {
      ts.addText(data.tagline, { x: 0.6, y: 2.5, w: 8.8, h: 0.8, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });
    }
    ts.addText('ANGEL PITCH', { x: 0.6, y: 4.0, w: 8.8, h: 0.5, fontSize: 14, color: C.gray, fontFace: 'Arial', align: 'center', charSpacing: 6 });

    // Hook slide
    if (data.hook) {
      var hookSlide = pres.addSlide();
      hookSlide.background = { color: C.light };
      hookSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.crimson } });
      hookSlide.addText('30 sec', { x: 7.5, y: 0.35, w: 2.2, h: 0.4, fontSize: 11, color: C.white, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: C.crimson }, rectRadius: 0.12 });
      hookSlide.addText(data.hook, { x: 1.0, y: 1.5, w: 8.0, h: 2.5, fontSize: 28, bold: true, color: C.navy, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: C.white }, line: { color: C.teal, width: 2 }, rectRadius: 0.15, wrap: true, fit: 'shrink', margin: [8, 8, 8, 8] });
    }

    // Content slides
    if (data.problem) addSlide('The Problem', data.problem, C.crimson, '1 min');
    if (data.solution) addSlide('Our Solution', data.solution, C.teal, '2 min');
    if (data.traction) addSlide('Traction & Metrics', data.traction, C.blue, '2 min');
    if (data.businessModel) addSlide('Business Model', data.businessModel, C.teal, '1 min');
    if (data.market) addSlide('Market Opportunity', data.market, C.blue, '1 min');
    if (data.team) addSlide('The Team', data.team, C.navy, '1 min');

    // The Ask slide
    if (data.theAsk) {
      var askSlide = pres.addSlide();
      askSlide.background = { color: C.light };
      askSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.crimson } });
      askSlide.addText('30 sec', { x: 7.5, y: 0.35, w: 2.2, h: 0.4, fontSize: 11, color: C.white, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: C.crimson }, rectRadius: 0.12 });
      askSlide.addText('The Ask', { x: 0.6, y: 0.3, w: 6.5, h: 0.7, fontSize: 28, bold: true, color: C.navy, fontFace: 'Arial' });
      askSlide.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.05, w: 2.0, h: 0.04, fill: { color: C.crimson } });
      askSlide.addText(data.theAsk, { x: 1.0, y: 1.8, w: 8.0, h: 2.0, fontSize: 32, bold: true, color: C.crimson, fontFace: 'Arial', align: 'center', valign: 'middle', fill: { color: C.white }, line: { color: C.crimson, width: 2 }, rectRadius: 0.15, wrap: true, fit: 'shrink' });
    }

    // Why Now slide
    if (data.whyNow) addSlide('Why Now', data.whyNow, C.teal, '1 min');

    // Closing slide
    var endSlide = pres.addSlide();
    endSlide.background = { color: C.navy };
    endSlide.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    endSlide.addText('Thank You', { x: 0.6, y: 1.5, w: 8.8, h: 1.0, fontSize: 44, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    endSlide.addText(data.companyName || '', { x: 0.6, y: 3.0, w: 8.8, h: 0.6, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center' });
    if (data.tagline) {
      endSlide.addText(data.tagline, { x: 0.6, y: 3.6, w: 8.8, h: 0.5, fontSize: 16, color: C.gray, fontFace: 'Arial', align: 'center', italic: true });
    }
    endSlide.addText('Q&A — 5-10 minutes', { x: 0.6, y: 4.3, w: 8.8, h: 0.4, fontSize: 13, color: C.gray, fontFace: 'Arial', align: 'center', charSpacing: 3 });

    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  /** @private Calculate unit economics */
  _calcUnitEcon: function(data) {
    var arpu = parseFloat(data.avgRevenuePerUser) || 0;
    var cogs = parseFloat(data.costOfGoodsSold) || 0;
    var lifespan = parseFloat(data.avgLifespanMonths) || 12;
    var cac = parseFloat(data.customerAcquisitionCost) || 0;
    var contribution = arpu - cogs;
    var marginPct = arpu > 0 ? (contribution / arpu) * 100 : 0;
    var ltv = contribution * lifespan;
    var ratio = cac > 0 ? (ltv / cac).toFixed(1) : 'N/A';
    var payback = contribution > 0 ? Math.ceil(cac / contribution) : 'N/A';
    var health = ratio >= 3 ? 'Healthy — Strong unit economics' : ratio >= 2 ? 'Warning — Improve margins or reduce CAC' : 'Critical — Unit economics not sustainable';
    return { contribution: contribution, marginPct: marginPct, ltv: ltv, ratio: ratio, payback: payback, health: health };
  },


  // ============================================================
  // CONSULTING FRAMEWORKS — Porter's Five Forces
  // ============================================================
  generatePorterFiveForcesWord: async function(filename, data) {
    var forces = [
      { key: 'threatNewEntrants', label: 'Threat of New Entrants' },
      { key: 'bargainingBuyers', label: 'Bargaining Power of Buyers' },
      { key: 'bargainingSuppliers', label: 'Bargaining Power of Suppliers' },
      { key: 'threatSubstitutes', label: 'Threat of Substitutes' },
      { key: 'competitiveRivalry', label: 'Competitive Rivalry' }
    ];
    var sections = [{ heading: "Porter's Five Forces Analysis", content: ['Industry: ' + (data.industryName || 'N/A'), 'Analyst: ' + (data.analystName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    forces.forEach(function(f) { sections.push({ heading: f.label, content: (data[f.key] || 'Not specified') + '\nRating: ' + (data[f.key + 'Rating'] || 'N/A') + '/5' }); });
    if (data.overallAssessment) sections.push({ heading: 'Overall Assessment', content: data.overallAssessment });
    if (data.strategicImplications) sections.push({ heading: 'Strategic Implications', content: data.strategicImplications });
    return this.generateWord(filename, { title: "Porter's Five Forces Analysis", author: 'Generated from wasilzafar.com', sections: sections });
  },
  generatePorterFiveForcesExcel: function(filename, data) {
    var rows = [
      ['Industry', data.industryName || ''], ['Analyst', data.analystName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Threat of New Entrants', data.threatNewEntrants || ''], ['  Rating (1-5)', data.threatNewEntrantsRating || ''],
      ['Bargaining Power of Buyers', data.bargainingBuyers || ''], ['  Rating (1-5)', data.bargainingBuyersRating || ''],
      ['Bargaining Power of Suppliers', data.bargainingSuppliers || ''], ['  Rating (1-5)', data.bargainingSuppliersRating || ''],
      ['Threat of Substitutes', data.threatSubstitutes || ''], ['  Rating (1-5)', data.threatSubstitutesRating || ''],
      ['Competitive Rivalry', data.competitiveRivalry || ''], ['  Rating (1-5)', data.competitiveRivalryRating || ''],
      ['', ''], ['Overall Assessment', data.overallAssessment || ''], ['Strategic Implications', data.strategicImplications || '']
    ];
    return this.generateExcel(filename, { sheetName: "Porter's Five Forces", headers: ['Force / Element', 'Analysis'], data: rows });
  },
  generatePorterFiveForcesPDF: function(filename, data) {
    var forces = [
      { key: 'threatNewEntrants', label: 'Threat of New Entrants' },
      { key: 'bargainingBuyers', label: 'Bargaining Power of Buyers' },
      { key: 'bargainingSuppliers', label: 'Bargaining Power of Suppliers' },
      { key: 'threatSubstitutes', label: 'Threat of Substitutes' },
      { key: 'competitiveRivalry', label: 'Competitive Rivalry' }
    ];
    var sections = [{ heading: "PORTER'S FIVE FORCES ANALYSIS", content: 'Industry: ' + (data.industryName || 'N/A') + '\nAnalyst: ' + (data.analystName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    forces.forEach(function(f) { sections.push({ heading: f.label + ' (Rating: ' + (data[f.key + 'Rating'] || 'N/A') + '/5)', content: data[f.key] || 'Not specified' }); });
    if (data.overallAssessment) sections.push({ heading: 'Overall Assessment', content: data.overallAssessment });
    if (data.strategicImplications) sections.push({ heading: 'Strategic Implications', content: data.strategicImplications });
    return this.generatePDF(filename, { title: "Porter's Five Forces Analysis", sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — BCG Growth-Share Matrix
  // ============================================================
  generateBcgMatrixWord: async function(filename, data) {
    var sections = [{ heading: 'BCG Growth-Share Matrix', content: ['Company: ' + (data.companyName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    var quads = [
      { key: 'stars', label: 'Stars (High Growth, High Share)' },
      { key: 'cashCows', label: 'Cash Cows (Low Growth, High Share)' },
      { key: 'questionMarks', label: 'Question Marks (High Growth, Low Share)' },
      { key: 'dogs', label: 'Dogs (Low Growth, Low Share)' }
    ];
    quads.forEach(function(q) { sections.push({ heading: q.label, content: data[q.key] || 'Not specified' }); });
    if (data.portfolioStrategy) sections.push({ heading: 'Portfolio Strategy', content: data.portfolioStrategy });
    return this.generateWord(filename, { title: 'BCG Growth-Share Matrix', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateBcgMatrixExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Stars (High Growth, High Share)', data.stars || ''],
      ['Cash Cows (Low Growth, High Share)', data.cashCows || ''],
      ['Question Marks (High Growth, Low Share)', data.questionMarks || ''],
      ['Dogs (Low Growth, Low Share)', data.dogs || ''],
      ['', ''], ['Portfolio Strategy', data.portfolioStrategy || '']
    ];
    return this.generateExcel(filename, { sheetName: 'BCG Matrix', headers: ['Quadrant', 'Products / Analysis'], data: rows });
  },
  generateBcgMatrixPDF: function(filename, data) {
    var sections = [
      { heading: 'BCG GROWTH-SHARE MATRIX', content: 'Company: ' + (data.companyName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Stars (High Growth, High Share)', content: data.stars || 'Not specified' },
      { heading: 'Cash Cows (Low Growth, High Share)', content: data.cashCows || 'Not specified' },
      { heading: 'Question Marks (High Growth, Low Share)', content: data.questionMarks || 'Not specified' },
      { heading: 'Dogs (Low Growth, Low Share)', content: data.dogs || 'Not specified' },
      { heading: 'Portfolio Strategy', content: data.portfolioStrategy || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'BCG Growth-Share Matrix', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Market Entry Assessment
  // ============================================================
  generateMarketEntryWord: async function(filename, data) {
    var sections = [
      { heading: 'Market Entry Assessment', content: ['Company: ' + (data.companyName || 'N/A'), 'Target Market: ' + (data.targetMarket || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Market Attractiveness', content: data.marketAttractiveness || 'Not specified' },
      { heading: 'Competitive Landscape', content: data.competitiveLandscape || 'Not specified' },
      { heading: 'Entry Mode', content: data.entryMode || 'Not specified' },
      { heading: 'Key Success Factors', content: data.keySuccessFactors || 'Not specified' },
      { heading: 'Risks & Barriers', content: data.risksBarriers || 'Not specified' },
      { heading: 'Financial Projections', content: data.financialProjections || 'Not specified' },
      { heading: 'Go/No-Go Recommendation', content: data.recommendation || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Market Entry Assessment', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateMarketEntryExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Target Market', data.targetMarket || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Market Attractiveness', data.marketAttractiveness || ''],
      ['Competitive Landscape', data.competitiveLandscape || ''],
      ['Entry Mode', data.entryMode || ''],
      ['Key Success Factors', data.keySuccessFactors || ''],
      ['Risks & Barriers', data.risksBarriers || ''],
      ['Financial Projections', data.financialProjections || ''],
      ['Go/No-Go Recommendation', data.recommendation || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Market Entry', headers: ['Element', 'Analysis'], data: rows });
  },
  generateMarketEntryPDF: function(filename, data) {
    var sections = [
      { heading: 'MARKET ENTRY ASSESSMENT', content: 'Company: ' + (data.companyName || 'N/A') + '\nTarget Market: ' + (data.targetMarket || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Market Attractiveness', content: data.marketAttractiveness || 'Not specified' },
      { heading: 'Competitive Landscape', content: data.competitiveLandscape || 'Not specified' },
      { heading: 'Entry Mode', content: data.entryMode || 'Not specified' },
      { heading: 'Key Success Factors', content: data.keySuccessFactors || 'Not specified' },
      { heading: 'Risks & Barriers', content: data.risksBarriers || 'Not specified' },
      { heading: 'Financial Projections', content: data.financialProjections || 'Not specified' },
      { heading: 'Go/No-Go Recommendation', content: data.recommendation || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Market Entry Assessment', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — McKinsey 7S Assessment
  // ============================================================
  generateMcKinsey7SWord: async function(filename, data) {
    var elements = [
      { key: 'strategy', label: 'Strategy' }, { key: 'structure', label: 'Structure' },
      { key: 'systems', label: 'Systems' }, { key: 'sharedValues', label: 'Shared Values' },
      { key: 'style', label: 'Style' }, { key: 'staff', label: 'Staff' }, { key: 'skills', label: 'Skills' }
    ];
    var sections = [{ heading: 'McKinsey 7S Assessment', content: ['Organization: ' + (data.orgName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    elements.forEach(function(e) { sections.push({ heading: e.label, content: data[e.key] || 'Not specified' }); });
    if (data.alignmentGaps) sections.push({ heading: 'Alignment Gaps', content: data.alignmentGaps });
    return this.generateWord(filename, { title: 'McKinsey 7S Assessment', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateMcKinsey7SExcel: function(filename, data) {
    var rows = [
      ['Organization', data.orgName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Strategy', data.strategy || ''], ['Structure', data.structure || ''], ['Systems', data.systems || ''],
      ['Shared Values', data.sharedValues || ''], ['Style', data.style || ''], ['Staff', data.staff || ''], ['Skills', data.skills || ''],
      ['', ''], ['Alignment Gaps', data.alignmentGaps || '']
    ];
    return this.generateExcel(filename, { sheetName: 'McKinsey 7S', headers: ['Element', 'Assessment'], data: rows });
  },
  generateMcKinsey7SPDF: function(filename, data) {
    var elements = ['Strategy', 'Structure', 'Systems', 'Shared Values', 'Style', 'Staff', 'Skills'];
    var keys = ['strategy', 'structure', 'systems', 'sharedValues', 'style', 'staff', 'skills'];
    var sections = [{ heading: 'McKINSEY 7S ASSESSMENT', content: 'Organization: ' + (data.orgName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    elements.forEach(function(e, i) { sections.push({ heading: e, content: data[keys[i]] || 'Not specified' }); });
    if (data.alignmentGaps) sections.push({ heading: 'Alignment Gaps', content: data.alignmentGaps });
    return this.generatePDF(filename, { title: 'McKinsey 7S Assessment', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Change Readiness / ADKAR
  // ============================================================
  generateChangeReadinessWord: async function(filename, data) {
    var adkar = ['awareness', 'desire', 'knowledge', 'ability', 'reinforcement'];
    var labels = ['Awareness', 'Desire', 'Knowledge', 'Ability', 'Reinforcement'];
    var sections = [{ heading: 'Change Readiness Assessment (ADKAR)', content: ['Organization: ' + (data.orgName || 'N/A'), 'Change Initiative: ' + (data.changeInitiative || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    adkar.forEach(function(a, i) { sections.push({ heading: labels[i], content: (data[a] || 'Not specified') + '\nRating: ' + (data[a + 'Rating'] || 'N/A') + '/5' }); });
    if (data.stakeholderImpact) sections.push({ heading: 'Stakeholder Impact', content: data.stakeholderImpact });
    if (data.actionPlan) sections.push({ heading: 'Action Plan', content: data.actionPlan });
    return this.generateWord(filename, { title: 'Change Readiness Assessment', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateChangeReadinessExcel: function(filename, data) {
    var rows = [
      ['Organization', data.orgName || ''], ['Change Initiative', data.changeInitiative || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Awareness', data.awareness || ''], ['  Rating (1-5)', data.awarenessRating || ''],
      ['Desire', data.desire || ''], ['  Rating (1-5)', data.desireRating || ''],
      ['Knowledge', data.knowledge || ''], ['  Rating (1-5)', data.knowledgeRating || ''],
      ['Ability', data.ability || ''], ['  Rating (1-5)', data.abilityRating || ''],
      ['Reinforcement', data.reinforcement || ''], ['  Rating (1-5)', data.reinforcementRating || ''],
      ['', ''], ['Stakeholder Impact', data.stakeholderImpact || ''], ['Action Plan', data.actionPlan || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Change Readiness', headers: ['ADKAR Element', 'Assessment'], data: rows });
  },
  generateChangeReadinessPDF: function(filename, data) {
    var adkar = ['awareness', 'desire', 'knowledge', 'ability', 'reinforcement'];
    var labels = ['Awareness', 'Desire', 'Knowledge', 'Ability', 'Reinforcement'];
    var sections = [{ heading: 'CHANGE READINESS ASSESSMENT (ADKAR)', content: 'Organization: ' + (data.orgName || 'N/A') + '\nChange Initiative: ' + (data.changeInitiative || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    adkar.forEach(function(a, i) { sections.push({ heading: labels[i] + ' (Rating: ' + (data[a + 'Rating'] || 'N/A') + '/5)', content: data[a] || 'Not specified' }); });
    if (data.stakeholderImpact) sections.push({ heading: 'Stakeholder Impact', content: data.stakeholderImpact });
    if (data.actionPlan) sections.push({ heading: 'Action Plan', content: data.actionPlan });
    return this.generatePDF(filename, { title: 'Change Readiness Assessment', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — DCF Valuation Calculator
  // ============================================================
  generateDcfValuationExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Analyst', data.analystName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Revenue Year 1', data.revenueY1 || ''], ['Revenue Year 2', data.revenueY2 || ''], ['Revenue Year 3', data.revenueY3 || ''],
      ['Revenue Year 4', data.revenueY4 || ''], ['Revenue Year 5', data.revenueY5 || ''],
      ['Operating Margin (%)', data.operatingMargin || ''], ['Tax Rate (%)', data.taxRate || ''],
      ['Discount Rate / WACC (%)', data.discountRate || ''], ['Terminal Growth Rate (%)', data.terminalGrowth || ''],
      ['', ''], ['Assumptions & Notes', data.assumptions || '']
    ];
    return this.generateExcel(filename, { sheetName: 'DCF Valuation', headers: ['Parameter', 'Value'], data: rows });
  },
  generateDcfValuationPDF: function(filename, data) {
    var sections = [
      { heading: 'DCF VALUATION MODEL', content: 'Company: ' + (data.companyName || 'N/A') + '\nAnalyst: ' + (data.analystName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Revenue Projections', content: 'Year 1: ' + (data.revenueY1 || 'N/A') + '\nYear 2: ' + (data.revenueY2 || 'N/A') + '\nYear 3: ' + (data.revenueY3 || 'N/A') + '\nYear 4: ' + (data.revenueY4 || 'N/A') + '\nYear 5: ' + (data.revenueY5 || 'N/A') },
      { heading: 'Key Assumptions', content: 'Operating Margin: ' + (data.operatingMargin || 'N/A') + '%\nTax Rate: ' + (data.taxRate || 'N/A') + '%\nDiscount Rate (WACC): ' + (data.discountRate || 'N/A') + '%\nTerminal Growth Rate: ' + (data.terminalGrowth || 'N/A') + '%' },
      { heading: 'Assumptions & Notes', content: data.assumptions || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'DCF Valuation Model', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Due Diligence Checklist
  // ============================================================
  generateDueDiligenceChecklistWord: async function(filename, data) {
    var sections = [
      { heading: 'Due Diligence Checklist', content: ['Target Company: ' + (data.targetCompany || 'N/A'), 'Deal Type: ' + (data.dealType || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Financial Items', content: data.financialItems || 'Not specified' },
      { heading: 'Legal Items', content: data.legalItems || 'Not specified' },
      { heading: 'Operational Items', content: data.operationalItems || 'Not specified' },
      { heading: 'Commercial Items', content: data.commercialItems || 'Not specified' },
      { heading: 'HR Items', content: data.hrItems || 'Not specified' },
      { heading: 'Red Flags', content: data.redFlags || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Due Diligence Checklist', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateDueDiligenceChecklistExcel: function(filename, data) {
    var rows = [
      ['Target Company', data.targetCompany || ''], ['Deal Type', data.dealType || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Financial Items', data.financialItems || ''], ['Legal Items', data.legalItems || ''],
      ['Operational Items', data.operationalItems || ''], ['Commercial Items', data.commercialItems || ''],
      ['HR Items', data.hrItems || ''], ['', ''], ['Red Flags', data.redFlags || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Due Diligence', headers: ['Category', 'Checklist / Notes'], data: rows });
  },
  generateDueDiligenceChecklistPDF: function(filename, data) {
    var sections = [
      { heading: 'DUE DILIGENCE CHECKLIST', content: 'Target Company: ' + (data.targetCompany || 'N/A') + '\nDeal Type: ' + (data.dealType || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Financial Items', content: data.financialItems || 'Not specified' },
      { heading: 'Legal Items', content: data.legalItems || 'Not specified' },
      { heading: 'Operational Items', content: data.operationalItems || 'Not specified' },
      { heading: 'Commercial Items', content: data.commercialItems || 'Not specified' },
      { heading: 'HR Items', content: data.hrItems || 'Not specified' },
      { heading: 'Red Flags', content: data.redFlags || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Due Diligence Checklist', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Problem Definition Canvas
  // ============================================================
  generateProblemDefinitionWord: async function(filename, data) {
    var sections = [
      { heading: 'Problem Definition Canvas', content: ['Problem: ' + (data.problemTitle || 'N/A'), 'Client: ' + (data.clientName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Problem Statement', content: data.problemStatement || 'Not specified' },
      { heading: 'Context & Background', content: data.context || 'Not specified' },
      { heading: 'Scope & Boundaries', content: data.scope || 'Not specified' },
      { heading: 'Stakeholders Affected', content: data.stakeholders || 'Not specified' },
      { heading: 'Constraints', content: data.constraints || 'Not specified' },
      { heading: 'Success Criteria', content: data.successCriteria || 'Not specified' },
      { heading: 'Initial Hypotheses', content: data.initialHypotheses || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Problem Definition Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateProblemDefinitionExcel: function(filename, data) {
    var rows = [
      ['Problem Title', data.problemTitle || ''], ['Client', data.clientName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Problem Statement', data.problemStatement || ''], ['Context & Background', data.context || ''],
      ['Scope & Boundaries', data.scope || ''], ['Stakeholders Affected', data.stakeholders || ''],
      ['Constraints', data.constraints || ''], ['Success Criteria', data.successCriteria || ''],
      ['Initial Hypotheses', data.initialHypotheses || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Problem Definition', headers: ['Element', 'Description'], data: rows });
  },
  generateProblemDefinitionPDF: function(filename, data) {
    var sections = [
      { heading: 'PROBLEM DEFINITION CANVAS', content: 'Problem: ' + (data.problemTitle || 'N/A') + '\nClient: ' + (data.clientName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Problem Statement', content: data.problemStatement || 'Not specified' },
      { heading: 'Context & Background', content: data.context || 'Not specified' },
      { heading: 'Scope & Boundaries', content: data.scope || 'Not specified' },
      { heading: 'Stakeholders Affected', content: data.stakeholders || 'Not specified' },
      { heading: 'Constraints', content: data.constraints || 'Not specified' },
      { heading: 'Success Criteria', content: data.successCriteria || 'Not specified' },
      { heading: 'Initial Hypotheses', content: data.initialHypotheses || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Problem Definition Canvas', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Prioritization Matrix
  // ============================================================
  generatePrioritizationMatrixExcel: function(filename, data) {
    var rows = [
      ['Project', data.projectName || ''], ['Date', new Date().toLocaleDateString()], ['', '']
    ];
    for (var i = 1; i <= 5; i++) {
      var name = data['item' + i + 'Name'];
      if (name && name.trim()) {
        rows.push([name, 'Impact: ' + (data['item' + i + 'Impact'] || '') + ' | Effort: ' + (data['item' + i + 'Effort'] || '')]);
      }
    }
    if (data.notes) { rows.push(['', '']); rows.push(['Notes', data.notes]); }
    return this.generateExcel(filename, { sheetName: 'Prioritization Matrix', headers: ['Initiative', 'Impact & Effort'], data: rows });
  },
  generatePrioritizationMatrixPDF: function(filename, data) {
    var lines = [{ text: 'PRIORITIZATION MATRIX', size: 16, bold: true }, { text: 'Project: ' + (data.projectName || 'N/A') + '  |  Date: ' + new Date().toLocaleDateString(), size: 11 }, { text: '', size: 8 }];
    for (var i = 1; i <= 5; i++) {
      var name = data['item' + i + 'Name'];
      if (name && name.trim()) {
        lines.push({ text: name, size: 13, bold: true });
        lines.push({ text: 'Impact: ' + (data['item' + i + 'Impact'] || 'N/A') + '/5  |  Effort: ' + (data['item' + i + 'Effort'] || 'N/A') + '/5', size: 11 });
        lines.push({ text: '', size: 6 });
      }
    }
    if (data.notes) { lines.push({ text: 'Notes', size: 13, bold: true }); lines.push({ text: data.notes, size: 11 }); }
    return this.generatePDF(filename, { title: 'Prioritization Matrix', lines: lines });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Value Chain Analysis
  // ============================================================
  generateValueChainAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Value Chain Analysis', content: ['Company: ' + (data.companyName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Inbound Logistics', content: data.inboundLogistics || 'Not specified' },
      { heading: 'Operations', content: data.operations || 'Not specified' },
      { heading: 'Outbound Logistics', content: data.outboundLogistics || 'Not specified' },
      { heading: 'Marketing & Sales', content: data.marketingSales || 'Not specified' },
      { heading: 'Service', content: data.service || 'Not specified' },
      { heading: 'Firm Infrastructure (Support)', content: data.firmInfrastructure || 'Not specified' },
      { heading: 'Human Resources (Support)', content: data.humanResources || 'Not specified' },
      { heading: 'Technology Development (Support)', content: data.technologyDev || 'Not specified' },
      { heading: 'Procurement (Support)', content: data.procurement || 'Not specified' },
      { heading: 'Competitive Advantage Sources', content: data.competitiveAdvantage || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Value Chain Analysis', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateValueChainAnalysisExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['--- PRIMARY ACTIVITIES ---', ''],
      ['Inbound Logistics', data.inboundLogistics || ''], ['Operations', data.operations || ''],
      ['Outbound Logistics', data.outboundLogistics || ''], ['Marketing & Sales', data.marketingSales || ''], ['Service', data.service || ''],
      ['', ''], ['--- SUPPORT ACTIVITIES ---', ''],
      ['Firm Infrastructure', data.firmInfrastructure || ''], ['Human Resources', data.humanResources || ''],
      ['Technology Development', data.technologyDev || ''], ['Procurement', data.procurement || ''],
      ['', ''], ['Competitive Advantage Sources', data.competitiveAdvantage || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Value Chain', headers: ['Activity', 'Analysis'], data: rows });
  },
  generateValueChainAnalysisPDF: function(filename, data) {
    var sections = [
      { heading: 'VALUE CHAIN ANALYSIS', content: 'Company: ' + (data.companyName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'PRIMARY ACTIVITIES', content: '' },
      { heading: 'Inbound Logistics', content: data.inboundLogistics || 'Not specified' },
      { heading: 'Operations', content: data.operations || 'Not specified' },
      { heading: 'Outbound Logistics', content: data.outboundLogistics || 'Not specified' },
      { heading: 'Marketing & Sales', content: data.marketingSales || 'Not specified' },
      { heading: 'Service', content: data.service || 'Not specified' },
      { heading: 'SUPPORT ACTIVITIES', content: '' },
      { heading: 'Firm Infrastructure', content: data.firmInfrastructure || 'Not specified' },
      { heading: 'Human Resources', content: data.humanResources || 'Not specified' },
      { heading: 'Technology Development', content: data.technologyDev || 'Not specified' },
      { heading: 'Procurement', content: data.procurement || 'Not specified' },
      { heading: 'Competitive Advantage Sources', content: data.competitiveAdvantage || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Value Chain Analysis', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Blue Ocean Strategy Canvas
  // ============================================================
  generateBlueOceanStrategyWord: async function(filename, data) {
    var sections = [
      { heading: 'Blue Ocean Strategy Canvas', content: ['Company: ' + (data.companyName || 'N/A'), 'Industry: ' + (data.industryName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Eliminate', content: data.eliminate || 'Not specified' },
      { heading: 'Reduce', content: data.reduce || 'Not specified' },
      { heading: 'Raise', content: data.raise || 'Not specified' },
      { heading: 'Create', content: data.create || 'Not specified' },
      { heading: 'New Value Curve', content: data.newValueCurve || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Blue Ocean Strategy Canvas', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateBlueOceanStrategyExcel: function(filename, data) {
    var rows = [
      ['Company', data.companyName || ''], ['Industry', data.industryName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Eliminate', data.eliminate || ''], ['Reduce', data.reduce || ''],
      ['Raise', data.raise || ''], ['Create', data.create || ''],
      ['', ''], ['New Value Curve', data.newValueCurve || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Blue Ocean', headers: ['ERRC Grid', 'Details'], data: rows });
  },
  generateBlueOceanStrategyPDF: function(filename, data) {
    var sections = [
      { heading: 'BLUE OCEAN STRATEGY CANVAS', content: 'Company: ' + (data.companyName || 'N/A') + '\nIndustry: ' + (data.industryName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Eliminate', content: data.eliminate || 'Not specified' },
      { heading: 'Reduce', content: data.reduce || 'Not specified' },
      { heading: 'Raise', content: data.raise || 'Not specified' },
      { heading: 'Create', content: data.create || 'Not specified' },
      { heading: 'New Value Curve', content: data.newValueCurve || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Blue Ocean Strategy Canvas', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Stakeholder Map
  // ============================================================
  generateStakeholderMapWord: async function(filename, data) {
    var sections = [
      { heading: 'Stakeholder Map', content: ['Project: ' + (data.projectName || 'N/A'), 'Analyst: ' + (data.analystName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Manage Closely (High Power, High Interest)', content: data.manageClosely || 'Not specified' },
      { heading: '  Strategy', content: data.manageCloselyStrategy || 'Not specified' },
      { heading: 'Keep Satisfied (High Power, Low Interest)', content: data.keepSatisfied || 'Not specified' },
      { heading: '  Strategy', content: data.keepSatisfiedStrategy || 'Not specified' },
      { heading: 'Keep Informed (Low Power, High Interest)', content: data.keepInformed || 'Not specified' },
      { heading: '  Strategy', content: data.keepInformedStrategy || 'Not specified' },
      { heading: 'Monitor (Low Power, Low Interest)', content: data.monitor || 'Not specified' },
      { heading: '  Strategy', content: data.monitorStrategy || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Stakeholder Map', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateStakeholderMapExcel: function(filename, data) {
    var rows = [
      ['Project', data.projectName || ''], ['Analyst', data.analystName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['--- MANAGE CLOSELY (High Power, High Interest) ---', ''],
      ['Stakeholders', data.manageClosely || ''], ['Strategy', data.manageCloselyStrategy || ''], ['', ''],
      ['--- KEEP SATISFIED (High Power, Low Interest) ---', ''],
      ['Stakeholders', data.keepSatisfied || ''], ['Strategy', data.keepSatisfiedStrategy || ''], ['', ''],
      ['--- KEEP INFORMED (Low Power, High Interest) ---', ''],
      ['Stakeholders', data.keepInformed || ''], ['Strategy', data.keepInformedStrategy || ''], ['', ''],
      ['--- MONITOR (Low Power, Low Interest) ---', ''],
      ['Stakeholders', data.monitor || ''], ['Strategy', data.monitorStrategy || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Stakeholder Map', headers: ['Quadrant / Element', 'Details'], data: rows });
  },
  generateStakeholderMapPDF: function(filename, data) {
    var sections = [
      { heading: 'STAKEHOLDER MAP', content: 'Project: ' + (data.projectName || 'N/A') + '\nAnalyst: ' + (data.analystName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Manage Closely (High Power, High Interest)', content: (data.manageClosely || 'Not specified') + '\nStrategy: ' + (data.manageCloselyStrategy || 'Not specified') },
      { heading: 'Keep Satisfied (High Power, Low Interest)', content: (data.keepSatisfied || 'Not specified') + '\nStrategy: ' + (data.keepSatisfiedStrategy || 'Not specified') },
      { heading: 'Keep Informed (Low Power, High Interest)', content: (data.keepInformed || 'Not specified') + '\nStrategy: ' + (data.keepInformedStrategy || 'Not specified') },
      { heading: 'Monitor (Low Power, Low Interest)', content: (data.monitor || 'Not specified') + '\nStrategy: ' + (data.monitorStrategy || 'Not specified') }
    ];
    return this.generatePDF(filename, { title: 'Stakeholder Map', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Case Interview Framework Builder
  // ============================================================
  generateCaseInterviewFrameworkWord: async function(filename, data) {
    var sections = [
      { heading: 'Case Interview Framework', content: ['Case: ' + (data.caseTitle || 'N/A'), 'Type: ' + (data.caseType || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Client Situation', content: data.clientSituation || 'Not specified' },
      { heading: 'Key Question', content: data.keyQuestion || 'Not specified' }
    ];
    for (var i = 1; i <= 4; i++) { var b = data['frameworkBranch' + i]; if (b && b.trim()) sections.push({ heading: 'Framework Branch ' + i, content: b }); }
    sections.push({ heading: 'Hypothesis', content: data.hypothesis || 'Not specified' });
    sections.push({ heading: 'Recommendation', content: data.recommendation || 'Not specified' });
    return this.generateWord(filename, { title: 'Case Interview Framework', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateCaseInterviewFrameworkExcel: function(filename, data) {
    var rows = [
      ['Case Title', data.caseTitle || ''], ['Case Type', data.caseType || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Client Situation', data.clientSituation || ''], ['Key Question', data.keyQuestion || '']
    ];
    for (var i = 1; i <= 4; i++) { var b = data['frameworkBranch' + i]; if (b && b.trim()) rows.push(['Framework Branch ' + i, b]); }
    rows.push(['', '']); rows.push(['Hypothesis', data.hypothesis || '']); rows.push(['Recommendation', data.recommendation || '']);
    return this.generateExcel(filename, { sheetName: 'Case Framework', headers: ['Element', 'Details'], data: rows });
  },
  generateCaseInterviewFrameworkPDF: function(filename, data) {
    var sections = [
      { heading: 'CASE INTERVIEW FRAMEWORK', content: 'Case: ' + (data.caseTitle || 'N/A') + '\nType: ' + (data.caseType || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Client Situation', content: data.clientSituation || 'Not specified' },
      { heading: 'Key Question', content: data.keyQuestion || 'Not specified' }
    ];
    for (var i = 1; i <= 4; i++) { var b = data['frameworkBranch' + i]; if (b && b.trim()) sections.push({ heading: 'Framework Branch ' + i, content: b }); }
    sections.push({ heading: 'Hypothesis', content: data.hypothesis || 'Not specified' });
    sections.push({ heading: 'Recommendation', content: data.recommendation || 'Not specified' });
    return this.generatePDF(filename, { title: 'Case Interview Framework', sections: sections });
  },

  // ============================================================
  // CONSULTING FRAMEWORKS — Jobs-to-be-Done (JTBD)
  // ============================================================
  generateJobsToBeDoneWord: async function(filename, data) {
    var sections = [
      { heading: 'Jobs-to-be-Done Analysis', content: ['Product: ' + (data.productName || 'N/A'), 'Target Customer: ' + (data.targetCustomer || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Functional Job', content: data.functionalJob || 'Not specified' },
      { heading: 'Emotional Job', content: data.emotionalJob || 'Not specified' },
      { heading: 'Social Job', content: data.socialJob || 'Not specified' },
      { heading: 'Current Solutions', content: data.currentSolutions || 'Not specified' },
      { heading: 'Pain Points', content: data.pains || 'Not specified' },
      { heading: 'Desired Outcomes', content: data.desiredOutcomes || 'Not specified' },
      { heading: 'Innovation Opportunities', content: data.innovationOpp || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Jobs-to-be-Done Analysis', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateJobsToBeDoneExcel: function(filename, data) {
    var rows = [
      ['Product / Service', data.productName || ''], ['Target Customer', data.targetCustomer || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Functional Job', data.functionalJob || ''], ['Emotional Job', data.emotionalJob || ''], ['Social Job', data.socialJob || ''],
      ['', ''], ['Current Solutions', data.currentSolutions || ''], ['Pain Points', data.pains || ''],
      ['Desired Outcomes', data.desiredOutcomes || ''], ['Innovation Opportunities', data.innovationOpp || '']
    ];
    return this.generateExcel(filename, { sheetName: 'JTBD', headers: ['Job Element', 'Description'], data: rows });
  },
  generateJobsToBeDonePDF: function(filename, data) {
    var sections = [
      { heading: 'JOBS-TO-BE-DONE ANALYSIS', content: 'Product: ' + (data.productName || 'N/A') + '\nTarget Customer: ' + (data.targetCustomer || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Functional Job', content: data.functionalJob || 'Not specified' },
      { heading: 'Emotional Job', content: data.emotionalJob || 'Not specified' },
      { heading: 'Social Job', content: data.socialJob || 'Not specified' },
      { heading: 'Current Solutions', content: data.currentSolutions || 'Not specified' },
      { heading: 'Pain Points', content: data.pains || 'Not specified' },
      { heading: 'Desired Outcomes', content: data.desiredOutcomes || 'Not specified' },
      { heading: 'Innovation Opportunities', content: data.innovationOpp || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Jobs-to-be-Done Analysis', sections: sections });
  },

  // ============================================================
  // DDDM — KPI Definition Worksheet
  // ============================================================
  generateKpiWorksheetWord: async function(filename, data) {
    var sections = [
      { heading: 'KPI Definition Worksheet', content: ['Department: ' + (data.department || 'N/A'), 'Owner: ' + (data.ownerName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }
    ];
    for (var i = 1; i <= 4; i++) {
      var name = data['kpi' + i + 'Name'];
      if (name && name.trim()) {
        sections.push({ heading: 'KPI: ' + name, content: 'Definition: ' + (data['kpi' + i + 'Definition'] || 'N/A') + '\nTarget: ' + (data['kpi' + i + 'Target'] || 'N/A') + '\nData Source: ' + (data['kpi' + i + 'Source'] || 'N/A') + '\nFrequency: ' + (data['kpi' + i + 'Frequency'] || 'N/A') });
      }
    }
    if (data.notes) sections.push({ heading: 'Notes', content: data.notes });
    return this.generateWord(filename, { title: 'KPI Definition Worksheet', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateKpiWorksheetExcel: function(filename, data) {
    var rows = [['Department', data.department || ''], ['Owner', data.ownerName || ''], ['Date', new Date().toLocaleDateString()], ['', '']];
    for (var i = 1; i <= 4; i++) {
      var name = data['kpi' + i + 'Name'];
      if (name && name.trim()) {
        rows.push([name, 'Def: ' + (data['kpi' + i + 'Definition'] || '') + ' | Target: ' + (data['kpi' + i + 'Target'] || '') + ' | Source: ' + (data['kpi' + i + 'Source'] || '') + ' | Freq: ' + (data['kpi' + i + 'Frequency'] || '')]);
      }
    }
    if (data.notes) { rows.push(['', '']); rows.push(['Notes', data.notes]); }
    return this.generateExcel(filename, { sheetName: 'KPI Worksheet', headers: ['KPI Name', 'Definition / Target / Source / Frequency'], data: rows });
  },
  generateKpiWorksheetPDF: function(filename, data) {
    var lines = [{ text: 'KPI DEFINITION WORKSHEET', size: 16, bold: true }, { text: 'Department: ' + (data.department || 'N/A') + '  |  Owner: ' + (data.ownerName || 'N/A'), size: 11 }, { text: 'Date: ' + new Date().toLocaleDateString(), size: 11 }, { text: '', size: 8 }];
    for (var i = 1; i <= 4; i++) {
      var name = data['kpi' + i + 'Name'];
      if (name && name.trim()) {
        lines.push({ text: name, size: 13, bold: true });
        lines.push({ text: 'Definition: ' + (data['kpi' + i + 'Definition'] || 'N/A'), size: 11 });
        lines.push({ text: 'Target: ' + (data['kpi' + i + 'Target'] || 'N/A') + '  |  Source: ' + (data['kpi' + i + 'Source'] || 'N/A') + '  |  Frequency: ' + (data['kpi' + i + 'Frequency'] || 'N/A'), size: 11 });
        lines.push({ text: '', size: 6 });
      }
    }
    if (data.notes) { lines.push({ text: 'Notes', size: 13, bold: true }); lines.push({ text: data.notes, size: 11 }); }
    return this.generatePDF(filename, { title: 'KPI Definition Worksheet', lines: lines });
  },

  // ============================================================
  // DDDM — Balanced Scorecard Generator
  // ============================================================
  generateBalancedScorecardWord: async function(filename, data) {
    var perspectives = [
      { key: 'financial', label: 'Financial Perspective' },
      { key: 'customer', label: 'Customer Perspective' },
      { key: 'internal', label: 'Internal Process Perspective' },
      { key: 'learning', label: 'Learning & Growth Perspective' }
    ];
    var sections = [{ heading: 'Balanced Scorecard', content: ['Organization: ' + (data.orgName || 'N/A'), 'Period: ' + (data.period || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    perspectives.forEach(function(p) {
      sections.push({ heading: p.label, content: 'Objective: ' + (data[p.key + 'Objective'] || 'N/A') + '\nMeasure: ' + (data[p.key + 'Measure'] || 'N/A') + '\nTarget: ' + (data[p.key + 'Target'] || 'N/A') + '\nInitiative: ' + (data[p.key + 'Initiative'] || 'N/A') });
    });
    if (data.strategicTheme) sections.push({ heading: 'Strategic Theme', content: data.strategicTheme });
    return this.generateWord(filename, { title: 'Balanced Scorecard', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateBalancedScorecardExcel: function(filename, data) {
    var rows = [['Organization', data.orgName || ''], ['Period', data.period || ''], ['Date', new Date().toLocaleDateString()], ['', '', '', '', '']];
    var perspectives = ['Financial', 'Customer', 'Internal Process', 'Learning & Growth'];
    var keys = ['financial', 'customer', 'internal', 'learning'];
    perspectives.forEach(function(p, i) {
      rows.push([p, data[keys[i] + 'Objective'] || '', data[keys[i] + 'Measure'] || '', data[keys[i] + 'Target'] || '', data[keys[i] + 'Initiative'] || '']);
    });
    if (data.strategicTheme) { rows.push(['', '', '', '', '']); rows.push(['Strategic Theme', data.strategicTheme, '', '', '']); }
    return this.generateExcel(filename, { sheetName: 'Balanced Scorecard', headers: ['Perspective', 'Objective', 'Measure', 'Target', 'Initiative'], data: rows });
  },
  generateBalancedScorecardPDF: function(filename, data) {
    var perspectives = ['Financial', 'Customer', 'Internal Process', 'Learning & Growth'];
    var keys = ['financial', 'customer', 'internal', 'learning'];
    var sections = [{ heading: 'BALANCED SCORECARD', content: 'Organization: ' + (data.orgName || 'N/A') + '\nPeriod: ' + (data.period || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    perspectives.forEach(function(p, i) {
      sections.push({ heading: p + ' Perspective', content: 'Objective: ' + (data[keys[i] + 'Objective'] || 'N/A') + '\nMeasure: ' + (data[keys[i] + 'Measure'] || 'N/A') + '\nTarget: ' + (data[keys[i] + 'Target'] || 'N/A') + '\nInitiative: ' + (data[keys[i] + 'Initiative'] || 'N/A') });
    });
    if (data.strategicTheme) sections.push({ heading: 'Strategic Theme', content: data.strategicTheme });
    return this.generatePDF(filename, { title: 'Balanced Scorecard', sections: sections });
  },

  // ============================================================
  // DDDM — Decision Matrix Generator
  // ============================================================
  generateDecisionMatrixExcel: function(filename, data) {
    var rows = [['Decision', data.decisionName || ''], ['Owner', data.ownerName || ''], ['Date', new Date().toLocaleDateString()], ['', '', '', '']];
    for (var i = 1; i <= 5; i++) {
      var name = data['option' + i + 'Name'];
      if (name && name.trim()) {
        rows.push([name, data['option' + i + 'Pros'] || '', data['option' + i + 'Cons'] || '', data['option' + i + 'Score'] || '']);
      }
    }
    if (data.recommendation) { rows.push(['', '', '', '']); rows.push(['Recommendation', data.recommendation, '', '']); }
    return this.generateExcel(filename, { sheetName: 'Decision Matrix', headers: ['Option', 'Pros', 'Cons', 'Score (1-10)'], data: rows });
  },
  generateDecisionMatrixPDF: function(filename, data) {
    var lines = [{ text: 'DECISION MATRIX', size: 16, bold: true }, { text: 'Decision: ' + (data.decisionName || 'N/A') + '  |  Owner: ' + (data.ownerName || 'N/A'), size: 11 }, { text: '', size: 8 }];
    for (var i = 1; i <= 5; i++) {
      var name = data['option' + i + 'Name'];
      if (name && name.trim()) {
        lines.push({ text: name + ' (Score: ' + (data['option' + i + 'Score'] || 'N/A') + '/10)', size: 13, bold: true });
        lines.push({ text: 'Pros: ' + (data['option' + i + 'Pros'] || 'N/A'), size: 11 });
        lines.push({ text: 'Cons: ' + (data['option' + i + 'Cons'] || 'N/A'), size: 11 });
        lines.push({ text: '', size: 6 });
      }
    }
    if (data.recommendation) { lines.push({ text: 'Recommendation', size: 13, bold: true }); lines.push({ text: data.recommendation, size: 11 }); }
    return this.generatePDF(filename, { title: 'Decision Matrix', lines: lines });
  },

  // ============================================================
  // DDDM — RACI Matrix Generator
  // ============================================================
  generateRaciMatrixWord: async function(filename, data) {
    var sections = [{ heading: 'RACI Matrix', content: ['Project: ' + (data.projectName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    for (var i = 1; i <= 5; i++) {
      var task = data['task' + i + 'Name'];
      if (task && task.trim()) {
        sections.push({ heading: task, content: 'Responsible: ' + (data['task' + i + 'R'] || 'N/A') + '\nAccountable: ' + (data['task' + i + 'A'] || 'N/A') + '\nConsulted: ' + (data['task' + i + 'C'] || 'N/A') + '\nInformed: ' + (data['task' + i + 'I'] || 'N/A') });
      }
    }
    return this.generateWord(filename, { title: 'RACI Matrix', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateRaciMatrixExcel: function(filename, data) {
    var rows = [['Project', data.projectName || ''], ['Date', new Date().toLocaleDateString()], ['', '', '', '', '']];
    for (var i = 1; i <= 5; i++) {
      var task = data['task' + i + 'Name'];
      if (task && task.trim()) {
        rows.push([task, data['task' + i + 'R'] || '', data['task' + i + 'A'] || '', data['task' + i + 'C'] || '', data['task' + i + 'I'] || '']);
      }
    }
    return this.generateExcel(filename, { sheetName: 'RACI Matrix', headers: ['Task / Activity', 'Responsible', 'Accountable', 'Consulted', 'Informed'], data: rows });
  },
  generateRaciMatrixPDF: function(filename, data) {
    var lines = [{ text: 'RACI MATRIX', size: 16, bold: true }, { text: 'Project: ' + (data.projectName || 'N/A') + '  |  Date: ' + new Date().toLocaleDateString(), size: 11 }, { text: '', size: 8 }];
    for (var i = 1; i <= 5; i++) {
      var task = data['task' + i + 'Name'];
      if (task && task.trim()) {
        lines.push({ text: task, size: 13, bold: true });
        lines.push({ text: 'R: ' + (data['task' + i + 'R'] || 'N/A') + '  |  A: ' + (data['task' + i + 'A'] || 'N/A') + '  |  C: ' + (data['task' + i + 'C'] || 'N/A') + '  |  I: ' + (data['task' + i + 'I'] || 'N/A'), size: 11 });
        lines.push({ text: '', size: 6 });
      }
    }
    return this.generatePDF(filename, { title: 'RACI Matrix', lines: lines });
  },

  // ============================================================
  // DDDM — A/B Test Planner
  // ============================================================
  generateAbTestPlannerWord: async function(filename, data) {
    var sections = [
      { heading: 'A/B Test Plan', content: ['Test Name: ' + (data.testName || 'N/A'), 'Owner: ' + (data.ownerName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Hypothesis', content: data.hypothesis || 'Not specified' },
      { heading: 'Primary Metric', content: data.primaryMetric || 'Not specified' },
      { heading: 'Secondary Metrics', content: data.secondaryMetrics || 'Not specified' },
      { heading: 'Control (A)', content: data.controlDescription || 'Not specified' },
      { heading: 'Variant (B)', content: data.variantDescription || 'Not specified' },
      { heading: 'Target Audience', content: data.targetAudience || 'Not specified' },
      { heading: 'Sample Size & Duration', content: 'Sample Size: ' + (data.sampleSize || 'N/A') + '\nDuration: ' + (data.duration || 'N/A') },
      { heading: 'Success Criteria', content: data.successCriteria || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'A/B Test Plan', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateAbTestPlannerExcel: function(filename, data) {
    var rows = [
      ['Test Name', data.testName || ''], ['Owner', data.ownerName || ''], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Hypothesis', data.hypothesis || ''], ['Primary Metric', data.primaryMetric || ''],
      ['Secondary Metrics', data.secondaryMetrics || ''], ['Control (A)', data.controlDescription || ''],
      ['Variant (B)', data.variantDescription || ''], ['Target Audience', data.targetAudience || ''],
      ['Sample Size', data.sampleSize || ''], ['Duration', data.duration || ''],
      ['Success Criteria', data.successCriteria || '']
    ];
    return this.generateExcel(filename, { sheetName: 'AB Test Plan', headers: ['Element', 'Details'], data: rows });
  },
  generateAbTestPlannerPDF: function(filename, data) {
    var sections = [
      { heading: 'A/B TEST PLAN', content: 'Test Name: ' + (data.testName || 'N/A') + '\nOwner: ' + (data.ownerName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Hypothesis', content: data.hypothesis || 'Not specified' },
      { heading: 'Primary Metric', content: data.primaryMetric || 'Not specified' },
      { heading: 'Secondary Metrics', content: data.secondaryMetrics || 'Not specified' },
      { heading: 'Control (A)', content: data.controlDescription || 'Not specified' },
      { heading: 'Variant (B)', content: data.variantDescription || 'Not specified' },
      { heading: 'Target Audience', content: data.targetAudience || 'Not specified' },
      { heading: 'Sample Size & Duration', content: 'Sample Size: ' + (data.sampleSize || 'N/A') + '\nDuration: ' + (data.duration || 'N/A') },
      { heading: 'Success Criteria', content: data.successCriteria || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'A/B Test Plan', sections: sections });
  },

  // ============================================================
  // DDDM — Sample Size Calculator
  // ============================================================
  generateSampleSizeExcel: function(filename, data) {
    var rows = [
      ['Calculator', 'Sample Size Calculator'], ['Date', new Date().toLocaleDateString()], ['', ''],
      ['Baseline Conversion Rate (%)', data.baselineRate || ''],
      ['Minimum Detectable Effect (%)', data.mde || ''],
      ['Statistical Significance (%)', data.significance || '95'],
      ['Statistical Power (%)', data.power || '80'],
      ['Tails', data.tails || 'Two-tailed'],
      ['', ''], ['Notes', data.notes || '']
    ];
    return this.generateExcel(filename, { sheetName: 'Sample Size', headers: ['Parameter', 'Value'], data: rows });
  },
  generateSampleSizePDF: function(filename, data) {
    var sections = [
      { heading: 'SAMPLE SIZE CALCULATOR', content: 'Date: ' + new Date().toLocaleDateString() },
      { heading: 'Parameters', content: 'Baseline Conversion Rate: ' + (data.baselineRate || 'N/A') + '%\nMinimum Detectable Effect: ' + (data.mde || 'N/A') + '%\nStatistical Significance: ' + (data.significance || '95') + '%\nStatistical Power: ' + (data.power || '80') + '%\nTails: ' + (data.tails || 'Two-tailed') },
      { heading: 'Notes', content: data.notes || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Sample Size Calculator', sections: sections });
  },

  // ============================================================
  // DDDM — Data Quality Assessment
  // ============================================================
  generateDataQualityWord: async function(filename, data) {
    var dimensions = [
      { key: 'accuracy', label: 'Accuracy' }, { key: 'completeness', label: 'Completeness' },
      { key: 'consistency', label: 'Consistency' }, { key: 'timeliness', label: 'Timeliness' },
      { key: 'uniqueness', label: 'Uniqueness' }, { key: 'validity', label: 'Validity' }
    ];
    var sections = [{ heading: 'Data Quality Assessment', content: ['Dataset: ' + (data.datasetName || 'N/A'), 'Assessor: ' + (data.assessorName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    dimensions.forEach(function(d) { sections.push({ heading: d.label, content: (data[d.key] || 'Not specified') + '\nRating: ' + (data[d.key + 'Rating'] || 'N/A') + '/5' }); });
    if (data.remediationPlan) sections.push({ heading: 'Remediation Plan', content: data.remediationPlan });
    return this.generateWord(filename, { title: 'Data Quality Assessment', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateDataQualityExcel: function(filename, data) {
    var rows = [
      ['Dataset', data.datasetName || ''], ['Assessor', data.assessorName || ''], ['Date', new Date().toLocaleDateString()], ['', '', ''],
      ['Accuracy', data.accuracy || '', data.accuracyRating || ''],
      ['Completeness', data.completeness || '', data.completenessRating || ''],
      ['Consistency', data.consistency || '', data.consistencyRating || ''],
      ['Timeliness', data.timeliness || '', data.timelinessRating || ''],
      ['Uniqueness', data.uniqueness || '', data.uniquenessRating || ''],
      ['Validity', data.validity || '', data.validityRating || ''],
      ['', '', ''], ['Remediation Plan', data.remediationPlan || '', '']
    ];
    return this.generateExcel(filename, { sheetName: 'Data Quality', headers: ['Dimension', 'Assessment', 'Rating (1-5)'], data: rows });
  },
  generateDataQualityPDF: function(filename, data) {
    var dims = ['Accuracy', 'Completeness', 'Consistency', 'Timeliness', 'Uniqueness', 'Validity'];
    var keys = ['accuracy', 'completeness', 'consistency', 'timeliness', 'uniqueness', 'validity'];
    var sections = [{ heading: 'DATA QUALITY ASSESSMENT', content: 'Dataset: ' + (data.datasetName || 'N/A') + '\nAssessor: ' + (data.assessorName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    dims.forEach(function(d, i) { sections.push({ heading: d + ' (Rating: ' + (data[keys[i] + 'Rating'] || 'N/A') + '/5)', content: data[keys[i]] || 'Not specified' }); });
    if (data.remediationPlan) sections.push({ heading: 'Remediation Plan', content: data.remediationPlan });
    return this.generatePDF(filename, { title: 'Data Quality Assessment', sections: sections });
  },

  // ============================================================
  // DDDM — Dashboard Requirements Document
  // ============================================================
  generateDashboardRequirementsWord: async function(filename, data) {
    var sections = [
      { heading: 'Dashboard Requirements Document', content: ['Dashboard Name: ' + (data.dashboardName || 'N/A'), 'Owner: ' + (data.ownerName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Purpose & Audience', content: data.purposeAudience || 'Not specified' },
      { heading: 'Key Metrics & KPIs', content: data.keyMetrics || 'Not specified' },
      { heading: 'Data Sources', content: data.dataSources || 'Not specified' },
      { heading: 'Visualizations Required', content: data.visualizations || 'Not specified' },
      { heading: 'Filters & Interactivity', content: data.filtersInteractivity || 'Not specified' },
      { heading: 'Refresh Frequency', content: data.refreshFrequency || 'Not specified' },
      { heading: 'Access & Permissions', content: data.accessPermissions || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Dashboard Requirements Document', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateDashboardRequirementsPDF: function(filename, data) {
    var sections = [
      { heading: 'DASHBOARD REQUIREMENTS DOCUMENT', content: 'Dashboard Name: ' + (data.dashboardName || 'N/A') + '\nOwner: ' + (data.ownerName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Purpose & Audience', content: data.purposeAudience || 'Not specified' },
      { heading: 'Key Metrics & KPIs', content: data.keyMetrics || 'Not specified' },
      { heading: 'Data Sources', content: data.dataSources || 'Not specified' },
      { heading: 'Visualizations Required', content: data.visualizations || 'Not specified' },
      { heading: 'Filters & Interactivity', content: data.filtersInteractivity || 'Not specified' },
      { heading: 'Refresh Frequency', content: data.refreshFrequency || 'Not specified' },
      { heading: 'Access & Permissions', content: data.accessPermissions || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Dashboard Requirements Document', sections: sections });
  },

  // ============================================================
  // DDDM — Data Maturity Assessment
  // ============================================================
  generateDataMaturityWord: async function(filename, data) {
    var pillars = [
      { key: 'dataGovernance', label: 'Data Governance' },
      { key: 'dataQuality', label: 'Data Quality' },
      { key: 'analytics', label: 'Analytics Capability' },
      { key: 'dataCulture', label: 'Data Culture' },
      { key: 'technology', label: 'Technology & Tools' }
    ];
    var sections = [{ heading: 'Data Maturity Assessment', content: ['Organization: ' + (data.orgName || 'N/A'), 'Assessor: ' + (data.assessorName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] }];
    pillars.forEach(function(p) { sections.push({ heading: p.label, content: (data[p.key] || 'Not specified') + '\nMaturity Level: ' + (data[p.key + 'Level'] || 'N/A') + '/5' }); });
    if (data.roadmap) sections.push({ heading: 'Improvement Roadmap', content: data.roadmap });
    return this.generateWord(filename, { title: 'Data Maturity Assessment', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateDataMaturityExcel: function(filename, data) {
    var rows = [
      ['Organization', data.orgName || ''], ['Assessor', data.assessorName || ''], ['Date', new Date().toLocaleDateString()], ['', '', ''],
      ['Data Governance', data.dataGovernance || '', data.dataGovernanceLevel || ''],
      ['Data Quality', data.dataQuality || '', data.dataQualityLevel || ''],
      ['Analytics Capability', data.analytics || '', data.analyticsLevel || ''],
      ['Data Culture', data.dataCulture || '', data.dataCultureLevel || ''],
      ['Technology & Tools', data.technology || '', data.technologyLevel || ''],
      ['', '', ''], ['Improvement Roadmap', data.roadmap || '', '']
    ];
    return this.generateExcel(filename, { sheetName: 'Data Maturity', headers: ['Pillar', 'Assessment', 'Level (1-5)'], data: rows });
  },
  generateDataMaturityPDF: function(filename, data) {
    var pillars = ['Data Governance', 'Data Quality', 'Analytics Capability', 'Data Culture', 'Technology & Tools'];
    var keys = ['dataGovernance', 'dataQuality', 'analytics', 'dataCulture', 'technology'];
    var sections = [{ heading: 'DATA MATURITY ASSESSMENT', content: 'Organization: ' + (data.orgName || 'N/A') + '\nAssessor: ' + (data.assessorName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() }];
    pillars.forEach(function(p, i) { sections.push({ heading: p + ' (Level: ' + (data[keys[i] + 'Level'] || 'N/A') + '/5)', content: data[keys[i]] || 'Not specified' }); });
    if (data.roadmap) sections.push({ heading: 'Improvement Roadmap', content: data.roadmap });
    return this.generatePDF(filename, { title: 'Data Maturity Assessment', sections: sections });
  },

  // ============================================================
  // DDDM — Data Story Outline
  // ============================================================
  generateDataStoryWord: async function(filename, data) {
    var sections = [
      { heading: 'Data Story Outline', content: ['Story Title: ' + (data.storyTitle || 'N/A'), 'Author: ' + (data.authorName || 'N/A'), 'Date: ' + new Date().toLocaleDateString()] },
      { heading: 'Audience', content: data.audience || 'Not specified' },
      { heading: 'Key Message / "So What?"', content: data.keyMessage || 'Not specified' },
      { heading: 'Context / Setup', content: data.context || 'Not specified' },
      { heading: 'Key Data Points', content: data.dataPoints || 'Not specified' },
      { heading: 'Visualization Plan', content: data.visualizationPlan || 'Not specified' },
      { heading: 'Call to Action', content: data.callToAction || 'Not specified' }
    ];
    return this.generateWord(filename, { title: 'Data Story Outline', author: 'Generated from wasilzafar.com', sections: sections });
  },
  generateDataStoryPDF: function(filename, data) {
    var sections = [
      { heading: 'DATA STORY OUTLINE', content: 'Story Title: ' + (data.storyTitle || 'N/A') + '\nAuthor: ' + (data.authorName || 'N/A') + '\nDate: ' + new Date().toLocaleDateString() },
      { heading: 'Audience', content: data.audience || 'Not specified' },
      { heading: 'Key Message / "So What?"', content: data.keyMessage || 'Not specified' },
      { heading: 'Context / Setup', content: data.context || 'Not specified' },
      { heading: 'Key Data Points', content: data.dataPoints || 'Not specified' },
      { heading: 'Visualization Plan', content: data.visualizationPlan || 'Not specified' },
      { heading: 'Call to Action', content: data.callToAction || 'Not specified' }
    ];
    return this.generatePDF(filename, { title: 'Data Story Outline', sections: sections });
  },

  // ============================================================
  // PPTX Helper — Generic section-based PowerPoint generator
  // ============================================================
  _generateSectionsPPTX: async function(filename, config) {
    if (!window.PptxGenJS) { alert('PptxGenJS library not loaded.'); return false; }
    var pres = new window.PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; pres.author = 'Generated from wasilzafar.com';
    pres.title = (config.entityName || '') + ' \u2014 ' + config.title;
    var C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };
    // Title slide
    var s1 = pres.addSlide(); s1.background = { color: C.navy };
    s1.addShape(pres.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: 0.06, fill: { color: C.teal } });
    s1.addText(config.entityName || config.title, { x: 0.6, y: 0.8, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    s1.addText(config.title, { x: 0.6, y: 2.5, w: 8.8, h: 0.7, fontSize: 22, color: C.teal, fontFace: 'Arial', align: 'center', italic: true });
    if (config.subtitle) s1.addText(config.subtitle, { x: 0.6, y: 3.3, w: 8.8, h: 0.5, fontSize: 14, color: C.light, fontFace: 'Arial', align: 'center' });
    // Content slides — group sections
    var sections = config.sections || []; var perSlide = config.perSlide || 3;
    for (var i = 0; i < sections.length; i += perSlide) {
      var slide = pres.addSlide(); slide.background = { color: C.white };
      slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: C.teal } });
      slide.slideNumber = { x: 9.2, y: '93%', fontSize: 9, color: C.gray };
      var batch = sections.slice(i, i + perSlide); var sH = batch.length <= 2 ? 2.0 : 1.35; var yP = 0.25;
      for (var j = 0; j < batch.length; j++) {
        var sec = batch[j]; var hc = sec.color || C.navy;
        slide.addText(sec.heading, { x: 0.5, y: yP, w: 9.0, h: 0.4, fontSize: 16, bold: true, color: hc, fontFace: 'Arial' }); yP += 0.45;
        var txt = Array.isArray(sec.content) ? sec.content.join('\n') : (sec.content || 'Not specified');
        slide.addText(txt, { x: 0.5, y: yP, w: 9.0, h: sH, fontSize: 12, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4, 4, 4, 4] }); yP += sH + 0.15;
      }
    }
    // Closing slide
    var end = pres.addSlide(); end.background = { color: C.navy };
    end.addShape(pres.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: 0.06, fill: { color: C.teal } });
    end.addText(config.entityName || config.title, { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: 36, bold: true, color: C.white, fontFace: 'Arial', align: 'center' });
    end.addText(config.title, { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: 18, color: C.teal, fontFace: 'Arial', align: 'center' });
    return pres.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // PPTX — Consulting Frameworks (12 generators)
  // ============================================================
  generatePorterFiveForcesPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: "Porter's Five Forces Analysis", entityName: data.companyName || 'Company', sections: [
      { heading: 'Competitive Rivalry', content: data.rivalry }, { heading: 'Threat of New Entrants', content: data.newEntrants },
      { heading: 'Threat of Substitutes', content: data.substitutes }, { heading: 'Buyer Power', content: data.buyerPower },
      { heading: 'Supplier Power', content: data.supplierPower }, { heading: 'Overall Assessment', content: data.overallAssessment }
    ]});
  },
  generateBcgMatrixPPTX: async function(filename, data) {
    var secs = []; for (var i = 1; i <= 5; i++) { var n = data['product' + i + 'Name']; if (n && n.trim()) secs.push({ heading: n, content: 'Revenue: ' + (data['product' + i + 'Revenue'] || 'N/A') + '\nGrowth: ' + (data['product' + i + 'Growth'] || 'N/A') + '%\nMarket Share: ' + (data['product' + i + 'MarketShare'] || 'N/A') + '%' }); }
    return this._generateSectionsPPTX(filename, { title: 'BCG Growth-Share Matrix', entityName: data.companyName || 'Company', perSlide: 2, sections: secs });
  },
  generateMarketEntryPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Market Entry Strategy', entityName: data.companyName || 'Company', sections: [
      { heading: 'Target Market', content: data.targetMarket }, { heading: 'Entry Mode', content: data.entryMode },
      { heading: 'Market Size', content: data.marketSize }, { heading: 'Competitive Landscape', content: data.competitiveLandscape },
      { heading: 'Regulatory Environment', content: data.regulatoryEnv }, { heading: 'Risks', content: data.risks },
      { heading: 'Timeline', content: data.timeline }
    ]});
  },
  generateMcKinsey7SPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'McKinsey 7-S Framework', entityName: data.orgName || 'Organization', sections: [
      { heading: 'Strategy', content: data.strategy }, { heading: 'Structure', content: data.structure },
      { heading: 'Systems', content: data.systems }, { heading: 'Shared Values', content: data.sharedValues },
      { heading: 'Style', content: data.style }, { heading: 'Staff', content: data.staff },
      { heading: 'Skills', content: data.skills }
    ]});
  },
  generateChangeReadinessPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'ADKAR Change Readiness Assessment', entityName: data.changeInitiative || 'Change Initiative', subtitle: data.orgName || '', sections: [
      { heading: 'Awareness (Rating: ' + (data.awarenessRating || 'N/A') + '/5)', content: 'Understanding of why change is needed' },
      { heading: 'Desire (Rating: ' + (data.desireRating || 'N/A') + '/5)', content: 'Willingness to support and participate' },
      { heading: 'Knowledge (Rating: ' + (data.knowledgeRating || 'N/A') + '/5)', content: 'Information on how to change' },
      { heading: 'Ability (Rating: ' + (data.abilityRating || 'N/A') + '/5)', content: 'Capability to implement required skills' },
      { heading: 'Reinforcement (Rating: ' + (data.reinforcementRating || 'N/A') + '/5)', content: 'Sustaining the change long-term' },
      { heading: 'Key Actions', content: data.keyActions }
    ]});
  },
  generateDueDiligenceChecklistPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Due Diligence Checklist', entityName: data.companyName || 'Company', subtitle: 'Deal Type: ' + (data.dealType || 'N/A'), sections: [
      { heading: 'Financial Items', content: data.financialItems }, { heading: 'Legal Items', content: data.legalItems },
      { heading: 'Operational Items', content: data.operationalItems }, { heading: 'Commercial Items', content: data.commercialItems },
      { heading: 'HR & People Items', content: data.hrItems }, { heading: 'Red Flags / Concerns', content: data.redFlags }
    ]});
  },
  generateProblemDefinitionPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Problem Definition Worksheet', entityName: data.problemTitle || 'Problem', subtitle: 'Client: ' + (data.clientName || 'N/A'), sections: [
      { heading: 'Context', content: data.context }, { heading: 'Scope & Boundaries', content: data.scope },
      { heading: 'Initial Hypotheses', content: data.initialHypotheses }
    ]});
  },
  generateValueChainAnalysisPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Value Chain Analysis', entityName: data.companyName || 'Company', perSlide: 2, sections: [
      { heading: 'Inbound Logistics', content: data.inboundLogistics }, { heading: 'Operations', content: data.operations },
      { heading: 'Outbound Logistics', content: data.outboundLogistics }, { heading: 'Marketing & Sales', content: data.marketingSales },
      { heading: 'Service', content: data.service }, { heading: 'Firm Infrastructure (Support)', content: data.firmInfrastructure },
      { heading: 'Human Resources (Support)', content: data.humanResources }, { heading: 'Technology Development (Support)', content: data.technologyDev },
      { heading: 'Procurement (Support)', content: data.procurement }, { heading: 'Competitive Advantage Sources', content: data.competitiveAdvantage }
    ]});
  },
  generateBlueOceanStrategyPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Blue Ocean Strategy Canvas', entityName: data.companyName || 'Company', subtitle: 'Industry: ' + (data.industryName || 'N/A'), perSlide: 2, sections: [
      { heading: 'Eliminate', content: data.eliminate }, { heading: 'Reduce', content: data.reduce },
      { heading: 'Raise', content: data.raise }, { heading: 'Create', content: data.create },
      { heading: 'New Value Curve', content: data.newValueCurve }
    ]});
  },
  generateJobsToBeDonePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Jobs-to-be-Done Analysis', entityName: data.productName || 'Product', subtitle: 'Target Customer: ' + (data.targetCustomer || 'N/A'), sections: [
      { heading: 'Functional Job', content: data.functionalJob }, { heading: 'Emotional Job', content: data.emotionalJob },
      { heading: 'Social Job', content: data.socialJob }, { heading: 'Current Solutions', content: data.currentSolutions },
      { heading: 'Pain Points', content: data.pains }, { heading: 'Desired Outcomes', content: data.desiredOutcomes },
      { heading: 'Innovation Opportunities', content: data.innovationOpp }
    ]});
  },
  generateStakeholderMapPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Stakeholder Map', entityName: data.projectName || 'Project', subtitle: 'Analyst: ' + (data.analystName || 'N/A'), perSlide: 2, sections: [
      { heading: 'Manage Closely (High Power, High Interest)', content: (data.manageClosely || 'Not specified') + '\nStrategy: ' + (data.manageCloselyStrategy || 'Not specified') },
      { heading: 'Keep Satisfied (High Power, Low Interest)', content: (data.keepSatisfied || 'Not specified') + '\nStrategy: ' + (data.keepSatisfiedStrategy || 'Not specified') },
      { heading: 'Keep Informed (Low Power, High Interest)', content: (data.keepInformed || 'Not specified') + '\nStrategy: ' + (data.keepInformedStrategy || 'Not specified') },
      { heading: 'Monitor (Low Power, Low Interest)', content: (data.monitor || 'Not specified') + '\nStrategy: ' + (data.monitorStrategy || 'Not specified') }
    ]});
  },
  generateCaseInterviewFrameworkPPTX: async function(filename, data) {
    var secs = [{ heading: 'Client Situation', content: data.clientSituation }, { heading: 'Key Question', content: data.keyQuestion }];
    for (var i = 1; i <= 4; i++) { var b = data['frameworkBranch' + i]; if (b && b.trim()) secs.push({ heading: 'Framework Branch ' + i, content: b }); }
    secs.push({ heading: 'Hypothesis', content: data.hypothesis }); secs.push({ heading: 'Recommendation', content: data.recommendation });
    return this._generateSectionsPPTX(filename, { title: 'Case Interview Framework', entityName: data.caseTitle || 'Case', subtitle: 'Type: ' + (data.caseType || 'N/A'), sections: secs });
  },

  // ============================================================
  // PPTX — DDDM (9 generators)
  // ============================================================
  generateKpiWorksheetPPTX: async function(filename, data) {
    var secs = []; for (var i = 1; i <= 4; i++) { var n = data['kpi' + i + 'Name']; if (n && n.trim()) secs.push({ heading: n, content: 'Definition: ' + (data['kpi' + i + 'Definition'] || 'N/A') + '\nTarget: ' + (data['kpi' + i + 'Target'] || 'N/A') + '\nSource: ' + (data['kpi' + i + 'Source'] || 'N/A') + '\nFrequency: ' + (data['kpi' + i + 'Frequency'] || 'N/A') }); }
    if (data.notes) secs.push({ heading: 'Notes', content: data.notes });
    return this._generateSectionsPPTX(filename, { title: 'KPI Definition Worksheet', entityName: data.department || 'Department', subtitle: 'Owner: ' + (data.ownerName || 'N/A'), perSlide: 2, sections: secs });
  },
  generateBalancedScorecardPPTX: async function(filename, data) {
    var ps = [{ k: 'financial', l: 'Financial' }, { k: 'customer', l: 'Customer' }, { k: 'internal', l: 'Internal Process' }, { k: 'learning', l: 'Learning & Growth' }];
    var secs = []; ps.forEach(function(p) { secs.push({ heading: p.l + ' Perspective', content: 'Objective: ' + (data[p.k + 'Objective'] || 'N/A') + '\nMeasure: ' + (data[p.k + 'Measure'] || 'N/A') + '\nTarget: ' + (data[p.k + 'Target'] || 'N/A') + '\nInitiative: ' + (data[p.k + 'Initiative'] || 'N/A') }); });
    if (data.strategicTheme) secs.push({ heading: 'Strategic Theme', content: data.strategicTheme });
    return this._generateSectionsPPTX(filename, { title: 'Balanced Scorecard', entityName: data.orgName || 'Organization', subtitle: 'Period: ' + (data.period || 'N/A'), perSlide: 2, sections: secs });
  },
  generateDecisionMatrixPPTX: async function(filename, data) {
    var secs = []; for (var i = 1; i <= 5; i++) { var n = data['option' + i + 'Name']; if (n && n.trim()) secs.push({ heading: n + ' (Score: ' + (data['option' + i + 'Score'] || 'N/A') + '/10)', content: 'Pros: ' + (data['option' + i + 'Pros'] || 'N/A') + '\nCons: ' + (data['option' + i + 'Cons'] || 'N/A') }); }
    if (data.recommendation) secs.push({ heading: 'Recommendation', content: data.recommendation });
    return this._generateSectionsPPTX(filename, { title: 'Decision Matrix', entityName: data.decisionName || 'Decision', subtitle: 'Owner: ' + (data.ownerName || 'N/A'), perSlide: 2, sections: secs });
  },
  generateRaciMatrixPPTX: async function(filename, data) {
    var secs = []; for (var i = 1; i <= 5; i++) { var t = data['task' + i + 'Name']; if (t && t.trim()) secs.push({ heading: t, content: 'Responsible: ' + (data['task' + i + 'R'] || 'N/A') + '\nAccountable: ' + (data['task' + i + 'A'] || 'N/A') + '\nConsulted: ' + (data['task' + i + 'C'] || 'N/A') + '\nInformed: ' + (data['task' + i + 'I'] || 'N/A') }); }
    return this._generateSectionsPPTX(filename, { title: 'RACI Matrix', entityName: data.projectName || 'Project', perSlide: 2, sections: secs });
  },
  generateAbTestPlannerPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'A/B Test Plan', entityName: data.testName || 'Test', subtitle: 'Owner: ' + (data.ownerName || 'N/A'), sections: [
      { heading: 'Hypothesis', content: data.hypothesis }, { heading: 'Primary Metric', content: data.primaryMetric },
      { heading: 'Secondary Metrics', content: data.secondaryMetrics }, { heading: 'Control (A)', content: data.controlDescription },
      { heading: 'Variant (B)', content: data.variantDescription }, { heading: 'Target Audience', content: data.targetAudience },
      { heading: 'Sample Size & Duration', content: 'Size: ' + (data.sampleSize || 'N/A') + ' | Duration: ' + (data.duration || 'N/A') },
      { heading: 'Success Criteria', content: data.successCriteria }
    ]});
  },
  generateDataQualityPPTX: async function(filename, data) {
    var dims = ['Accuracy', 'Completeness', 'Consistency', 'Timeliness', 'Uniqueness', 'Validity'];
    var keys = ['accuracy', 'completeness', 'consistency', 'timeliness', 'uniqueness', 'validity'];
    var secs = []; dims.forEach(function(d, i) { secs.push({ heading: d + ' (Rating: ' + (data[keys[i] + 'Rating'] || 'N/A') + '/5)', content: data[keys[i]] || 'Not specified' }); });
    if (data.remediationPlan) secs.push({ heading: 'Remediation Plan', content: data.remediationPlan });
    return this._generateSectionsPPTX(filename, { title: 'Data Quality Assessment', entityName: data.datasetName || 'Dataset', subtitle: 'Assessor: ' + (data.assessorName || 'N/A'), perSlide: 2, sections: secs });
  },
  generateDashboardRequirementsPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Dashboard Requirements', entityName: data.dashboardName || 'Dashboard', subtitle: 'Owner: ' + (data.ownerName || 'N/A'), sections: [
      { heading: 'Purpose & Audience', content: data.purposeAudience }, { heading: 'Key Metrics & KPIs', content: data.keyMetrics },
      { heading: 'Data Sources', content: data.dataSources }, { heading: 'Visualizations Required', content: data.visualizations },
      { heading: 'Filters & Interactivity', content: data.filtersInteractivity }, { heading: 'Refresh Frequency', content: data.refreshFrequency },
      { heading: 'Access & Permissions', content: data.accessPermissions }
    ]});
  },
  generateDataMaturityPPTX: async function(filename, data) {
    var ps = ['Data Governance', 'Data Quality', 'Analytics Capability', 'Data Culture', 'Technology & Tools'];
    var ks = ['dataGovernance', 'dataQuality', 'analytics', 'dataCulture', 'technology'];
    var secs = []; ps.forEach(function(p, i) { secs.push({ heading: p + ' (Level: ' + (data[ks[i] + 'Level'] || 'N/A') + '/5)', content: data[ks[i]] || 'Not specified' }); });
    if (data.roadmap) secs.push({ heading: 'Improvement Roadmap', content: data.roadmap });
    return this._generateSectionsPPTX(filename, { title: 'Data Maturity Assessment', entityName: data.orgName || 'Organization', subtitle: 'Assessor: ' + (data.assessorName || 'N/A'), perSlide: 2, sections: secs });
  },
  generateDataStoryPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, { title: 'Data Story Outline', entityName: data.storyTitle || 'Data Story', subtitle: 'Author: ' + (data.authorName || 'N/A'), sections: [
      { heading: 'Audience', content: data.audience }, { heading: 'Key Message / "So What?"', content: data.keyMessage },
      { heading: 'Context / Setup', content: data.context }, { heading: 'Key Data Points', content: data.dataPoints },
      { heading: 'Visualization Plan', content: data.visualizationPlan }, { heading: 'Call to Action', content: data.callToAction }
    ]});
  },

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
      author: 'Generated from wasilzafar.com',
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
      author: 'Generated from wasilzafar.com',
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
      author: 'Generated from wasilzafar.com',
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
      author: 'Generated from wasilzafar.com',
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
    
    var palette = {
      navy: '132440', crimson: 'BF092F', teal: '3B9797',
      blue: '16476A', light: 'F8F9FA', white: 'FFFFFF'
    };
    
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
      slide2.addText(data.knownPains, { x: 0.4, y: 3.3, w: 9.2, h: 2, fontSize: 14, color: '333333', wrap: true, valign: 'top' });
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
          para('Generated from wasilzafar.com'),
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
      ['Generated from wasilzafar.com'],
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
    doc.text('Generated from wasilzafar.com', margin, y);
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

    var palette = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
            children: [new docx.TextRun({ text: 'Objection Handling Playbook', bold: true, size: 48, color: '132440' })],
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.companyName || 'Company', bold: true, size: 28, color: '3B9797' })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Created by: ' + (data.createdBy || ''), size: 22 })],
            spacing: { after: 400 }
          }),

          // Price Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Price Objections', bold: true, size: 28, color: 'BF092F' })],
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
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: '3B9797' })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.priceResponse || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Timing Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Timing Objections', bold: true, size: 28, color: 'BF092F' })],
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
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: '3B9797' })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.timingResponse || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Authority Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Authority Objections', bold: true, size: 28, color: 'BF092F' })],
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
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: '3B9797' })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.authorityResponse || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Competitor Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Competitor Objections', bold: true, size: 28, color: 'BF092F' })],
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
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: '3B9797' })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.competitorResponse || '', size: 22 })],
            spacing: { after: 400 }
          }),

          // Status Quo Objections
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Status Quo Objections', bold: true, size: 28, color: 'BF092F' })],
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
            children: [new docx.TextRun({ text: 'Response Strategy:', bold: true, size: 22, color: '3B9797' })],
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Objection Handling Playbook', margin, y);
    y += 12;

    // Company
    pdf.setFontSize(16);
    pdf.setTextColor(59, 151, 151);
    pdf.text(data.companyName || 'Company', margin, y);
    y += 8;

    // Created by
    pdf.setFontSize(11);
    pdf.setTextColor(100, 100, 100);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(cat.title, margin, y);
      y += 8;

      // Objection
      pdf.setFontSize(11);
      pdf.setTextColor(19, 36, 64);
      pdf.text('Objection:', margin, y);
      y += 5;
      pdf.setTextColor(80, 80, 80);
      var objLines = pdf.splitTextToSize(cat.objection || 'Not specified', pageWidth - 2 * margin);
      pdf.text(objLines, margin, y);
      y += objLines.length * 5 + 5;

      // Response
      pdf.setFontSize(11);
      pdf.setTextColor(59, 151, 151);
      pdf.text('Response Strategy:', margin, y);
      y += 5;
      pdf.setTextColor(80, 80, 80);
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

    var palette = {
      navy: '132440',
      crimson: 'BF092F',
      teal: '3B9797',
      blue: '16476A',
      white: 'FFFFFF',
      light: 'F8F9FA'
    };

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
            children: [new docx.TextRun({ text: 'Negotiation & Closing Strategy', bold: true, size: 48, color: '132440' })],
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: data.companyName || 'Deal', bold: true, size: 28, color: '3B9797' })],
            spacing: { after: 100 }
          }),
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'Deal Value: ' + (data.dealValue || 'TBD'), size: 22 })],
            spacing: { after: 400 }
          }),

          // BATNA Section
          new docx.Paragraph({
            children: [new docx.TextRun({ text: 'BATNA Analysis', bold: true, size: 28, color: 'BF092F' })],
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
            children: [new docx.TextRun({ text: 'Negotiation Strategy', bold: true, size: 28, color: 'BF092F' })],
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
            children: [new docx.TextRun({ text: 'Closing Strategy', bold: true, size: 28, color: 'BF092F' })],
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
            children: [new docx.TextRun({ text: 'Stakeholders & Risks', bold: true, size: 28, color: 'BF092F' })],
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Negotiation & Closing Strategy', margin, y);
    y += 12;

    // Company
    pdf.setFontSize(16);
    pdf.setTextColor(59, 151, 151);
    pdf.text(data.companyName || 'Deal', margin, y);
    y += 8;

    // Deal Value
    pdf.setFontSize(11);
    pdf.setTextColor(100, 100, 100);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(section.title, margin, y);
      y += 6;

      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
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

    var palette = {
      navy: '132440',
      crimson: 'BF092F',
      teal: '3B9797',
      blue: '16476A',
      white: 'FFFFFF',
      light: 'F8F9FA'
    };

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
    doc.setFont('helvetica', 'bold');
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
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
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
    doc.setFont('helvetica', 'normal');
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

    var palette = {
      navy: '132440',
      crimson: 'BF092F',
      teal: '3B9797',
      blue: '16476A',
      light: 'F8F9FA',
      white: 'FFFFFF',
      gray: '666666'
    };

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
    doc.setFont('helvetica', 'bold');
    doc.text('B2C Sales Strategy Canvas', margin, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(data.brandName || 'Untitled Brand', margin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Target Customer: ' + (data.targetCustomer || ''), margin, y);
    y += 10;

    function addSection(title, content) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
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

    var palette = {
      navy: '132440',
      crimson: 'BF092F',
      teal: '3B9797',
      blue: '16476A',
      light: 'F8F9FA',
      white: 'FFFFFF',
      gray: '666666'
    };

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
            children: [new window.docx.TextRun({ text: 'HIGH-TICKET OFFER CANVAS', bold: true, size: 36, color: '132440' })],
            spacing: { after: 200 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.offerName || 'Untitled Offer', bold: true, size: 28, color: 'BF092F' })],
            spacing: { after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'Price Point: ', bold: true }), new window.docx.TextRun({ text: data.pricePoint || '' })],
            spacing: { after: 300 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'IDEAL CLIENT PROFILE', bold: true, size: 24, color: '16476A' })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.idealClient || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'CORE TRANSFORMATION', bold: true, size: 24, color: '16476A' })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.transformation || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'VALUE STACK', bold: true, size: 24, color: '16476A' })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.valueStack || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'AUTHORITY POSITIONING', bold: true, size: 24, color: '16476A' })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.authority || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'SALES PROCESS', bold: true, size: 24, color: '16476A' })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.salesProcess || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'TOP OBJECTIONS & RESPONSES', bold: true, size: 24, color: '16476A' })],
            spacing: { before: 200, after: 100 }
          }),
          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: data.objections || '' })],
            spacing: { after: 200 }
          }),

          new window.docx.Paragraph({
            children: [new window.docx.TextRun({ text: 'Generated by Sales Mastery Series - wasilzafar.com', italics: true, size: 18, color: '666666' })],
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('HIGH-TICKET OFFER CANVAS', margin, y);
    y += 12;

    // Offer Name
    pdf.setFontSize(14);
    pdf.setTextColor(191, 9, 47);
    pdf.text(data.offerName || 'Untitled Offer', margin, y);
    y += 8;

    // Price Point
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Price Point: ' + (data.pricePoint || ''), margin, y);
    y += 12;

    // Helper function for sections
    var addSection = function(title, content) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12);
      pdf.setTextColor(22, 71, 106);
      pdf.text(title, margin, y);
      y += lineHeight;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
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
    pdf.setTextColor(102, 102, 102);
    pdf.text('Generated by Sales Mastery Series - wasilzafar.com', margin, 285);

    pdf.save(filename + '.pdf');
  },

  generateHighTicketOfferPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'High-Ticket Offer Canvas';
    pptx.author = 'Sales Mastery Series';

    var palette = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', white: 'FFFFFF', light: 'F8F9FA' };

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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Pipeline Health Review', margin, y);
    y += 15;

    // Header
    pdf.setFontSize(12);
    pdf.setTextColor(22, 71, 106);
    pdf.text('Team: ' + (data.teamName || '') + '  |  Period: ' + (data.period || ''), margin, y);
    y += 15;

    // Summary Box
    pdf.setFillColor(248, 249, 250);
    pdf.rect(margin, y, contentWidth, 50, 'F');
    pdf.setDrawColor(59, 151, 151);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, y, contentWidth, 50, 'S');
    
    pdf.setFontSize(14);
    pdf.setTextColor(19, 36, 64);
    pdf.text('Pipeline Summary', margin + 5, y + 10);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const summaryY = y + 20;
    pdf.text('Total Pipeline Value: ' + (data.pipelineValue || ''), margin + 5, summaryY);
    pdf.text('Period Quota: ' + (data.quota || ''), margin + 5, summaryY + 8);
    pdf.text('Coverage Ratio: ' + (data.coverage || ''), contentWidth/2 + margin, summaryY);
    pdf.text('Win Rate: ' + (data.winRate || ''), contentWidth/2 + margin, summaryY + 8);
    y += 60;

    // Stage Breakdown
    pdf.setFontSize(14);
    pdf.setTextColor(191, 9, 47);
    pdf.text('Stage Breakdown', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('Pipeline Risks', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
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
    pdf.setTextColor(59, 151, 151);
    pdf.text('Action Items', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const actionLines = pdf.splitTextToSize(data.actions || '', contentWidth);
    pdf.text(actionLines, margin, y);

    pdf.save(filename + '.pdf');
  },

  generatePipelineHealthPPTX: function(filename, data) {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    const palette = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };

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
    slide2.addText(data.stageBreakdown || '', { x: 0.4, y: 4.65, w: 9, h: 0.8, fontSize: 10, wrap: true, valign: 'top', fit: 'shrink', color: '333333' });

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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Sales & Marketing Alignment Strategy', margin, y);
    y += 15;

    // Header
    pdf.setFontSize(12);
    pdf.setTextColor(22, 71, 106);
    pdf.text('Company: ' + (data.company || ''), margin, y);
    y += 8;
    pdf.text('Primary Goal: ' + (data.sharedGoal || ''), margin, y);
    y += 15;

    // MQL/SQL Definitions
    pdf.setFillColor(248, 249, 250);
    pdf.rect(margin, y, contentWidth, 50, 'F');
    pdf.setDrawColor(59, 151, 151);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, y, contentWidth, 50, 'S');
    
    pdf.setFontSize(14);
    pdf.setTextColor(191, 9, 47);
    pdf.text('Lead Qualification', margin + 5, y + 10);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('MQL: ' + (data.mqlCriteria || '').substring(0, 80), margin + 5, y + 22);
    pdf.text('SQL: ' + (data.sqlCriteria || '').substring(0, 80), margin + 5, y + 34);
    y += 60;

    // SLAs
    pdf.setFontSize(14);
    pdf.setTextColor(191, 9, 47);
    pdf.text('Service Level Agreements', margin, y);
    y += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
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
    pdf.setTextColor(59, 151, 151);
    pdf.text('Lead Handoff Process', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const handoffLines = pdf.splitTextToSize(data.handoff || '', contentWidth);
    pdf.text(handoffLines.slice(0, 5), margin, y);
    y += Math.min(handoffLines.length, 5) * 5 + 10;

    // Enablement
    pdf.setFontSize(14);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Key Enablement Assets', margin, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const enableLines = pdf.splitTextToSize(data.enablement || '', contentWidth);
    pdf.text(enableLines.slice(0, 5), margin, y);

    pdf.save(filename + '.pdf');
  },

  generateAlignmentStrategyPPTX: function(filename, data) {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    const palette = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };

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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Sales Leadership Canvas', 20, y); y += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
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
      pdf.setTextColor(22, 71, 106);
      pdf.text(s.title, 20, y); y += 7;

      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
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
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Sales Analytics Canvas', 20, y); y += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
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
      pdf.setTextColor(22, 71, 106);
      pdf.text(s.title, 20, y); y += 7;

      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
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
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Strategic Account Canvas', 105, y, { align: 'center' });
    y += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(59, 151, 151);
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
      pdf.setTextColor(19, 36, 64);
      pdf.text(s.title, 14, y);
      y += 2;
      pdf.setDrawColor(59, 151, 151);
      pdf.line(14, y, 80, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Ethics & Reputation Canvas', 105, y, { align: 'center' });
    y += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(59, 151, 151);
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
      pdf.setTextColor(19, 36, 64);
      pdf.text(s.title, 14, y);
      y += 2;
      pdf.setDrawColor(59, 151, 151);
      pdf.line(14, y, 80, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    var docxLib = window.docx.default || window.docx;
    var doc = new docxLib.Document({
      sections: [{
        properties: {},
        children: [
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Channel Strategy Canvas', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Company: ' + (data.companyName || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 18, color: '666666' })], spacing: { after: 400 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Channel Types & Architecture', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.channelTypes || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Ideal Partner Profile', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.partnerProfile || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Enablement Plan', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.enablementPlan || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Incentive Structure', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.incentives || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Success Metrics', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.metrics || 'Not specified', size: 20 })], spacing: { after: 300 } })
        ]
      }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Channel Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106);
    pdf.text('Company: ' + (data.companyName || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
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
      pdf.setFontSize(13); pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateChannelStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    var docxLib = window.docx.default || window.docx;
    var doc = new docxLib.Document({
      sections: [{
        properties: {},
        children: [
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Capstone Sales Strategy', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: (data.companyName || '') + ' — ' + (data.salesContext || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 18, color: '666666' })], spacing: { after: 400 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Sales Process Summary', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.salesProcess || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Team & Organization', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.teamOrganization || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Key Metrics & Targets', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.metricsTargets || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Risks & Contingencies', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.risksContingencies || 'Not specified', size: 20 })], spacing: { after: 300 } })
        ]
      }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Capstone Sales Strategy', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106);
    pdf.text((data.companyName || '') + ' — ' + (data.salesContext || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 14;

    var sections = [
      { title: 'Sales Process Summary', content: data.salesProcess },
      { title: 'Team & Organization', content: data.teamOrganization },
      { title: 'Key Metrics & Targets', content: data.metricsTargets },
      { title: 'Risks & Contingencies', content: data.risksContingencies }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(13); pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateCapstoneStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
  // MARKETING STRATEGY CANVAS — Word, Excel, PDF, PPTX
  // ============================================================

  generateMarketingStrategyWord: function(filename, data) {
    var docxLib = window.docx.default || window.docx;
    var doc = new docxLib.Document({
      sections: [{
        properties: {},
        children: [
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Marketing Strategy Canvas', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: (data.companyName || '') + ' — ' + (data.industry || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 18, color: '666666' })], spacing: { after: 400 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Target Segment', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.targetSegment || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Customer Pain Points', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.customerPain || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Positioning Statement', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.positioning || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Value Proposition', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.valueProp || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Competitive Landscape', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.competitors || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Marketing Channels', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.channels || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Key Metrics & KPIs', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.metrics || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Growth Strategy', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.growthStrategy || 'Not specified', size: 20 })], spacing: { after: 300 } })
        ]
      }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Marketing Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106);
    pdf.text((data.companyName || '') + ' — ' + (data.industry || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
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
      pdf.setFontSize(13); pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateMarketingStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    var docxLib = window.docx.default || window.docx;
    var doc = new docxLib.Document({
      sections: [{
        properties: {},
        children: [
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Buyer Psychology Audit', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: (data.companyName || '') + ' — ' + (data.targetAudience || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 18, color: '666666' })], spacing: { after: 400 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'System 1 Triggers Used', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.system1Triggers || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'System 2 Content Available', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.system2Content || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Trust Signals Deployed', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.trustSignals || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Cognitive Biases Leveraged', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.cognitiveBiases || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Pricing Psychology Tactics', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.pricingStrategy || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Improvement Opportunities', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.improvements || 'Not specified', size: 20 })], spacing: { after: 300 } })
        ]
      }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Buyer Psychology Audit', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106);
    pdf.text((data.companyName || '') + ' — ' + (data.targetAudience || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
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
      pdf.setFontSize(13); pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateBuyerPsychologyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    var docxLib = window.docx.default || window.docx;
    var doc = new docxLib.Document({
      sections: [{
        properties: {},
        children: [
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Brand Building Canvas', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: (data.brandName || '') + ' — ' + (data.industry || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 18, color: '666666' })], spacing: { after: 400 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Mission Statement', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.mission || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Core Values', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.values || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Brand Personality', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.personality || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Target Audience', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.targetAudience || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Positioning Statement', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.positioning || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Key Differentiators', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.differentiators || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Voice & Tone', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.voiceTone || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Brand Story', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.brandStory || 'Not specified', size: 20 })], spacing: { after: 300 } })
        ]
      }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Brand Building Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106);
    pdf.text((data.brandName || '') + ' — ' + (data.industry || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
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
      pdf.setFontSize(13); pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateBrandCanvasPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    var docxLib = window.docx.default || window.docx;
    var doc = new docxLib.Document({
      sections: [{
        properties: {},
        children: [
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'SEO Audit Canvas', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: (data.siteUrl || '') + ' — ' + (data.industry || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 18, color: '666666' })], spacing: { after: 400 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Target Keywords', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.targetKeywords || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Current Rankings', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.currentRankings || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Technical Issues', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.technicalIssues || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Content Gaps', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.contentGaps || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Backlink Profile', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.backlinkProfile || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Local SEO Presence', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.localPresence || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Top Competitors', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.competitors || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Priority Action Plan', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.actionPlan || 'Not specified', size: 20 })], spacing: { after: 300 } })
        ]
      }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('SEO Audit Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106);
    pdf.text((data.siteUrl || '') + ' — ' + (data.industry || ''), 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
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
      pdf.setFontSize(13); pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateSeoAuditPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    var docxLib = window.docx.default || window.docx;
    var doc = new docxLib.Document({
      sections: [{
        properties: {},
        children: [
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Social Media Strategy Canvas', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.companyName || '', bold: true, size: 24, color: '16476A' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 18, color: '666666' })], spacing: { after: 400 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Target Platforms', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.platforms || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Target Audience', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.audience || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Content Pillars', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.contentPillars || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Posting Cadence', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.postingCadence || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Community Strategy', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.communityStrategy || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Influencer Plan', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.influencerPlan || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Engagement Tactics', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.engagementTactics || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Key Metrics', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.metrics || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: '90-Day Growth Goals', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.growthGoals || 'Not specified', size: 20 })], spacing: { after: 300 } })
        ]
      }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Social Media Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106);
    pdf.text(data.companyName || '', 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
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
      pdf.setFontSize(13); pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateSocialStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
    var docxLib = window.docx.default || window.docx;
    var doc = new docxLib.Document({
      sections: [{
        properties: {},
        children: [
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Content Strategy Canvas', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.companyName || '', bold: true, size: 24, color: '16476A' })], spacing: { after: 200 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 18, color: '666666' })], spacing: { after: 400 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Target Audience', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.audience || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Content Pillars', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.contentPillars || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Content Formats', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.contentFormats || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Distribution Channels', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.distribution || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Editorial Cadence', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.editorialCadence || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Competitor Content Gaps', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.competitorGaps || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Success Metrics', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.successMetrics || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Team & Budget', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.teamResources || 'Not specified', size: 20 })], spacing: { after: 300 } }),

          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: '90-Day Content Goals', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: data.contentGoals || 'Not specified', size: 20 })], spacing: { after: 300 } })
        ]
      }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Content Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106);
    pdf.text(data.companyName || '', 20, y); y += 8;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
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
      pdf.setFontSize(13); pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
      var lines = pdf.splitTextToSize(s.content || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 8;
    });

    pdf.save(filename + '.pdf');
  },

  generateContentStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
        new docxLib.TableCell({ children: [new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: s.label, bold: true, size: 22, color: 'BF092F' })] })], width: { size: 28, type: docxLib.WidthType.PERCENTAGE } }),
        new docxLib.TableCell({ children: [new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: s.value || '', size: 22 })] })], width: { size: 72, type: docxLib.WidthType.PERCENTAGE } })
      ] }));
    });
    var doc = new docxLib.Document({
      sections: [{ children: [
        new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Email Strategy Canvas', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
        new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 24, color: '16476A' })], spacing: { after: 300 } }),
        new docxLib.Table({ rows: rows })
      ] }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Email Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(12); pdf.setTextColor(22, 71, 106);
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
      pdf.setFontSize(12); pdf.setTextColor(191, 9, 47);
      pdf.text(s.label, 20, y); y += 7;
      pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 6;
    });
    pdf.save(filename + '.pdf');
  },

  generateEmailStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
        new docxLib.TableCell({ children: [new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: s.label, bold: true, size: 22, color: 'BF092F' })] })], width: { size: 28, type: docxLib.WidthType.PERCENTAGE } }),
        new docxLib.TableCell({ children: [new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: s.value || '', size: 22 })] })], width: { size: 72, type: docxLib.WidthType.PERCENTAGE } })
      ] }));
    });
    var doc = new docxLib.Document({
      sections: [{ children: [
        new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Ad Campaign Strategy Canvas', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
        new docxLib.Paragraph({ children: [new docxLib.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 24, color: '16476A' })], spacing: { after: 300 } }),
        new docxLib.Table({ rows: rows })
      ] }]
    });
    docxLib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Ad Campaign Strategy Canvas', 20, y); y += 12;
    pdf.setFontSize(12); pdf.setTextColor(22, 71, 106);
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
      pdf.setFontSize(12); pdf.setTextColor(191, 9, 47);
      pdf.text(s.label, 20, y); y += 7;
      pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 6;
    });
    pdf.save(filename + '.pdf');
  },

  generateAdCampaignPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'INTEGRATED MARKETING STRATEGY CAPSTONE', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), bold: true, size: 24 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Business Model', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.businessModel || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Target Audience & Buyer Persona', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.targetAudience || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Channel Strategy', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelStrategy || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Launch / GTM Plan', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.launchPlan || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Engine & Loops', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.growthEngine || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Measurement Framework', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.measurement || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Budget Allocation', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.budget || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Implementation Timeline', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.timeline || 'Not specified' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals & Success Metrics', bold: true, size: 22, color: '16476A' })], spacing: { before: 300, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('INTEGRATED MARKETING STRATEGY CAPSTONE', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
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
      pdf.setTextColor(22, 71, 106);
      pdf.text(s.label, 20, y);
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      var lines = pdf.splitTextToSize(s.value || 'Not specified', 170);
      pdf.text(lines, 20, y + 7);
      y += 7 + lines.length * 6 + 8;
    });
    pdf.save(filename + '.pdf');
  },

  generateIntegratedCapstonePPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };
    pptx.title = 'Integrated Marketing Strategy Capstone';
    pptx.author = 'Marketing Strategy Series';
    // Slide 1 – Title
    var slide1 = pptx.addSlide();
    slide1.background = { color: colors.navy };
    slide1.addText('Integrated Marketing Strategy Capstone', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center', fontFace: 'Arial' });
    slide1.addText(data.companyName || 'Company Name', { x: 0.5, y: 3.0, w: 9, h: 0.8, fontSize: 22, color: colors.teal, align: 'center', fontFace: 'Arial' });
    // Slide 2 – Strategy Overview
    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Strategy Overview', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: 'Arial' });
    slide2.addText('Business Model', { x: 0.4, y: 0.9, w: 4.2, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.businessModel || 'Not specified', { x: 0.4, y: 1.3, w: 4.2, h: 1.5, fontSize: 11, color: colors.gray, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Target Audience', { x: 5.2, y: 0.9, w: 4.4, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.targetAudience || 'Not specified', { x: 5.2, y: 1.3, w: 4.4, h: 1.5, fontSize: 11, color: colors.gray, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Channel Strategy', { x: 0.4, y: 3.0, w: 4.2, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.channelStrategy || 'Not specified', { x: 0.4, y: 3.4, w: 4.2, h: 1.8, fontSize: 11, color: colors.gray, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Launch / GTM Plan', { x: 5.2, y: 3.0, w: 4.4, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.launchPlan || 'Not specified', { x: 5.2, y: 3.4, w: 4.4, h: 1.8, fontSize: 11, color: colors.gray, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 – Growth & Measurement
    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Growth & Measurement', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: 'Arial' });
    slide3.addText('Growth Engine', { x: 0.4, y: 0.9, w: 4.2, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.growthEngine || 'Not specified', { x: 0.4, y: 1.3, w: 4.2, h: 1.5, fontSize: 11, color: colors.gray, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Measurement Framework', { x: 5.2, y: 0.9, w: 4.4, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.measurement || 'Not specified', { x: 5.2, y: 1.3, w: 4.4, h: 1.5, fontSize: 11, color: colors.gray, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Budget Allocation', { x: 0.4, y: 3.0, w: 4.2, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.budget || 'Not specified', { x: 0.4, y: 3.4, w: 4.2, h: 1.5, fontSize: 11, color: colors.gray, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Growth Goals', { x: 5.2, y: 3.0, w: 4.4, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.growthGoals || 'Not specified', { x: 5.2, y: 3.4, w: 4.4, h: 1.5, fontSize: 11, color: colors.gray, fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // SCALING & LEADERSHIP CANVAS
  // ============================================================

  generateScalingLeadershipWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'SCALING & LEADERSHIP CANVAS', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || 'N/A'), size: 24 })], spacing: { after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: '666666' })], spacing: { after: 300 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'GLOBAL STRATEGY', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.globalStrategy || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'LOCALIZATION', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.localization || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'TEAM STRUCTURE', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.teamStructure || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'HIRING PLAN', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.hiringPlan || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'MARKETING OPERATIONS', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.marketingOps || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'LEADERSHIP MODEL', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.leadershipModel || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'BOARD REPORTING', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.boardReporting || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'TRANSFORMATION ROADMAP', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.transformation || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'GROWTH GOALS', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('SCALING & LEADERSHIP CANVAS', 20, 25);
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(s.label, 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      var lines = pdf.splitTextToSize(s.value || 'Not specified', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 8;
    });
    pdf.save(filename + '.pdf');
  },

  generateScalingLeadershipPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Scaling & Leadership Canvas';
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', white: 'FFFFFF', light: 'F8F9FA' };

    var slide1 = pptx.addSlide();
    slide1.background = { fill: colors.navy };
    slide1.addText('Scaling & Leadership Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center', fontFace: 'Arial' });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center', fontFace: 'Arial' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 3.8, w: 9, h: 0.5, fontSize: 14, color: colors.white, align: 'center', fontFace: 'Arial' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Global Strategy & Organization', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: 'Arial' });
    slide2.addText('Global Strategy', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.globalStrategy || 'Not specified', { x: 0.4, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Localization', { x: 5.3, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.localization || 'Not specified', { x: 5.3, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Team Structure', { x: 0.4, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.teamStructure || 'Not specified', { x: 0.4, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Hiring Plan', { x: 5.3, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.hiringPlan || 'Not specified', { x: 5.3, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Leadership & Transformation', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: 'Arial' });
    slide3.addText('Marketing Operations', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.marketingOps || 'Not specified', { x: 0.4, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Leadership Model', { x: 5.3, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.leadershipModel || 'Not specified', { x: 5.3, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Transformation / Board', { x: 0.4, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText((data.transformation || '') + '\n\n' + (data.boardReporting || 'Not specified'), { x: 0.4, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Growth Goals', { x: 5.3, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.growthGoals || 'Not specified', { x: 5.3, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // OFFLINE MARKETING CANVAS
  // ============================================================

  generateOfflineMarketingWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'OFFLINE MARKETING CANVAS', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || 'N/A'), size: 24 })], spacing: { after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: '666666' })], spacing: { after: 300 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'EVENT STRATEGY', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.eventStrategy || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'TRADE SHOWS', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.tradeShows || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PR STRATEGY', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.prStrategy || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'MEDIA RELATIONS', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.mediaRelations || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'BROADCAST & TRADITIONAL', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.broadcast || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'DIRECT MAIL', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.directMail || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'OOH ADVERTISING', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.ooh || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'OMNICHANNEL INTEGRATION', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.omnichannel || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'GROWTH GOALS', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('OFFLINE MARKETING CANVAS', 20, 25);
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(s.label, 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      var lines = pdf.splitTextToSize(s.value || 'Not specified', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 8;
    });
    pdf.save(filename + '.pdf');
  },

  generateOfflineMarketingPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Offline Marketing Canvas';
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', white: 'FFFFFF', light: 'F8F9FA' };

    var slide1 = pptx.addSlide();
    slide1.background = { fill: colors.navy };
    slide1.addText('Offline Marketing Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: colors.white, bold: true, align: 'center', fontFace: 'Arial' });
    slide1.addText(data.companyName || 'Company', { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 20, color: colors.teal, align: 'center', fontFace: 'Arial' });
    slide1.addText(new Date().toLocaleDateString(), { x: 0.5, y: 3.8, w: 9, h: 0.5, fontSize: 14, color: colors.white, align: 'center', fontFace: 'Arial' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide2.addText('Events & PR Strategy', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: 'Arial' });
    slide2.addText('Event Strategy', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.eventStrategy || 'Not specified', { x: 0.4, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Trade Shows', { x: 5.3, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.tradeShows || 'Not specified', { x: 5.3, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('PR Strategy', { x: 0.4, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.prStrategy || 'Not specified', { x: 0.4, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide2.addText('Media Relations', { x: 5.3, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide2.addText(data.mediaRelations || 'Not specified', { x: 5.3, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: colors.teal } });
    slide3.addText('Traditional & Direct Marketing', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: colors.white, bold: true, fontFace: 'Arial' });
    slide3.addText('Broadcast & Traditional', { x: 0.4, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.broadcast || 'Not specified', { x: 0.4, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Direct Mail', { x: 5.3, y: 0.9, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.directMail || 'Not specified', { x: 5.3, y: 1.3, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('OOH Advertising', { x: 0.4, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText(data.ooh || 'Not specified', { x: 0.4, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });
    slide3.addText('Omnichannel / Goals', { x: 5.3, y: 3.1, w: 4.3, h: 0.4, fontSize: 13, color: colors.crimson, bold: true, fontFace: 'Arial' });
    slide3.addText((data.omnichannel || '') + '\n\n' + (data.growthGoals || 'Not specified'), { x: 5.3, y: 3.5, w: 4.3, h: 1.6, fontSize: 10, color: '333333', fontFace: 'Arial', wrap: true, fit: 'shrink', valign: 'top' });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // PERSONAL BRAND CANVAS
  // ============================================================

  generatePersonalBrandWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PERSONAL BRAND CANVAS', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: '16476A' })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Niche & Positioning', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.niche || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Positioning Statement', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.positioning || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Platform Strategy', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.platforms || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Content Pillars', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.contentPillars || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Audience Profile', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.audienceProfile || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Monetization Strategy', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.monetization || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Revenue Model', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.revenueModel || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Scaling Plan', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.scaling || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('PERSONAL BRAND CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(22, 71, 106);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
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
    slide1.background = { color: '132440' };
    slide1.addText('Personal Brand Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: 'FFFFFF', bold: true, align: 'center', fontFace: 'Arial' });
    slide1.addText(data.companyName || filename, { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 20, color: '3B9797', align: 'center', fontFace: 'Arial' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: '3B9797' } });
    slide2.addText('Positioning & Content', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: 'FFFFFF', bold: true, fontFace: 'Arial' });
    slide2.addText('Niche & Positioning', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide2.addText(data.niche || 'Not specified', { x: 0.4, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Platform Strategy', { x: 5.3, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide2.addText(data.platforms || 'Not specified', { x: 5.3, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Content Pillars', { x: 0.4, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide2.addText(data.contentPillars || 'Not specified', { x: 0.4, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Audience Profile', { x: 5.3, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide2.addText(data.audienceProfile || 'Not specified', { x: 5.3, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: '3B9797' } });
    slide3.addText('Monetization & Growth', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: 'FFFFFF', bold: true, fontFace: 'Arial' });
    slide3.addText('Monetization Strategy', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide3.addText(data.monetization || 'Not specified', { x: 0.4, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Revenue Model', { x: 5.3, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide3.addText(data.revenueModel || 'Not specified', { x: 5.3, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Scaling Plan', { x: 0.4, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide3.addText(data.scaling || 'Not specified', { x: 0.4, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Growth Goals', { x: 5.3, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide3.addText(data.growthGoals || 'Not specified', { x: 5.3, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // MARKETING FINANCE CANVAS
  // ============================================================

  generateMarketingFinanceWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'MARKETING FINANCE CANVAS', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: '16476A' })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Annual Budget', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.annualBudget || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Channel Allocation', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelAllocation || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'CAC Metrics', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.cacMetrics || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'LTV Model', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.ltvModel || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Payback Period', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.paybackPeriod || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'ROI Targets', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.roiTargets || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Revenue Forecast', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.forecast || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Scenario Planning', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.scenarios || 'Not specified', size: 20 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 22, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('MARKETING FINANCE CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(22, 71, 106);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(s.title, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
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
    slide1.background = { color: '132440' };
    slide1.addText('Marketing Finance Canvas', { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: 'FFFFFF', bold: true, align: 'center', fontFace: 'Arial' });
    slide1.addText(data.companyName || filename, { x: 0.5, y: 2.8, w: 9, h: 0.8, fontSize: 20, color: '3B9797', align: 'center', fontFace: 'Arial' });

    var slide2 = pptx.addSlide();
    slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: '3B9797' } });
    slide2.addText('Budget & Unit Economics', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: 'FFFFFF', bold: true, fontFace: 'Arial' });
    slide2.addText('Annual Budget', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide2.addText(data.annualBudget || 'Not specified', { x: 0.4, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('Channel Allocation', { x: 5.3, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide2.addText(data.channelAllocation || 'Not specified', { x: 5.3, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('CAC Metrics', { x: 0.4, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide2.addText(data.cacMetrics || 'Not specified', { x: 0.4, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide2.addText('LTV Model', { x: 5.3, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide2.addText(data.ltvModel || 'Not specified', { x: 5.3, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });

    var slide3 = pptx.addSlide();
    slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.6, fill: { color: '3B9797' } });
    slide3.addText('Planning & Forecasting', { x: 0.3, y: 0.05, w: 9, h: 0.5, fontSize: 18, color: 'FFFFFF', bold: true, fontFace: 'Arial' });
    slide3.addText('ROI Targets', { x: 0.4, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide3.addText(data.roiTargets || 'Not specified', { x: 0.4, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Revenue Forecast', { x: 5.3, y: 0.8, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide3.addText(data.forecast || 'Not specified', { x: 5.3, y: 1.2, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Scenario Planning', { x: 0.4, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide3.addText(data.scenarios || 'Not specified', { x: 0.4, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    slide3.addText('Growth Goals', { x: 5.3, y: 2.9, w: 4.3, h: 0.4, fontSize: 13, color: 'BF092F', bold: true, fontFace: 'Arial' });
    slide3.addText(data.growthGoals || 'Not specified', { x: 5.3, y: 3.3, w: 4.3, h: 1.5, fontSize: 10, color: '333333', fontFace: 'Arial', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });

    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // PRODUCT GTM CANVAS
  // ============================================================

  generateProductGtmWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PRODUCT GTM CANVAS', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: '132440' })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Target Market & ICP', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.targetMarket || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Positioning Statement', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.positioning || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Messaging Architecture', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.messaging || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Competitive Battlecards', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.battlecards || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Launch Plan', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.launchPlan || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Sales Enablement', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.salesEnablement || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'GTM Motion & Channels', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelStrategy || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Success Metrics', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.successMetrics || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('PRODUCT GTM CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(19, 36, 64);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(s.label, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateProductGtmPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Product GTM Canvas';
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };
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
    s2.addText(data.targetMarket || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Positioning Statement', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.positioning || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Messaging Architecture', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.messaging || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Competitive Battlecards', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.battlecards || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 — Launch & Enablement
    var s3 = pptx.addSlide();
    s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s3.addText('Launch & Enablement', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s3.addText('Launch Plan', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.launchPlan || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Sales Enablement', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.salesEnablement || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('GTM Motion & Channels', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.channelStrategy || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Growth Goals', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.growthGoals || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // STRATEGIC ANALYSIS CANVAS
  // ============================================================

  generateStrategicAnalysisWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'STRATEGIC ANALYSIS CANVAS', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: '132440' })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: "Porter's Five Forces", bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.porterForces || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Industry Lifecycle', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.industryLifecycle || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PESTLE Factors', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.pestle || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'SWOT / TOWS Strategies', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.swot || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Competitive Positioning', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.competitivePosition || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Blue Ocean Opportunities', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.blueOcean || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Scenario Planning', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.scenarios || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Strategic Initiatives / OKRs', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.strategicInitiatives || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Strategic Goals', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('STRATEGIC ANALYSIS CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(19, 36, 64);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(s.label, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateStrategicAnalysisPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Strategic Analysis Canvas';
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };
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
    s2.addText(data.porterForces || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Industry Lifecycle', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.industryLifecycle || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('PESTLE Factors', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.pestle || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('SWOT / TOWS', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.swot || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 — Competitive & Strategic
    var s3 = pptx.addSlide();
    s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s3.addText('Competitive & Strategic Plan', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s3.addText('Competitive Positioning', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.competitivePosition || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Blue Ocean Opportunities', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.blueOcean || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Scenario Planning', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.scenarios || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Strategic Goals', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.growthGoals || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // DISTRIBUTION STRATEGY CANVAS
  // ============================================================

  generateDistributionStrategyWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'DISTRIBUTION STRATEGY CANVAS', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: '132440' })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Channel Mix', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelMix || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Direct Strategy', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.directStrategy || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Partner Program', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.partnerProgram || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Affiliate Program', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.affiliateDesign || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Marketplace Strategy', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.marketplace || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Integration Strategy', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.integrations || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Co-Marketing Plan', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.coMarketing || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Ecosystem Positioning', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.ecosystem || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Distribution Goals', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('DISTRIBUTION STRATEGY CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(19, 36, 64);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(s.label, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateDistributionStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Distribution Strategy Canvas';
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };
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
    s2.addText(data.channelMix || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Direct Strategy', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.directStrategy || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Partner Program', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.partnerProgram || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Affiliate Program', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.affiliateDesign || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 — Ecosystem & Goals
    var s3 = pptx.addSlide();
    s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s3.addText('Ecosystem & Growth', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s3.addText('Marketplace Strategy', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.marketplace || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Integration Strategy', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.integrations || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Ecosystem Positioning', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.ecosystem || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Distribution Goals', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.growthGoals || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    pptx.writeFile({ fileName: filename + '.pptx' });
  },

  // ============================================================
  // PRICING STRATEGY CANVAS
  // ============================================================

  generatePricingStrategyWord: function(filename, data) {
    var doc = new window.docx.Document({
      sections: [{
        children: [
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'PRICING STRATEGY CANVAS', bold: true, size: 36, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: filename, size: 24, color: '132440' })], spacing: { after: 400 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Value Metric', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.valueMetric || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Pricing Model', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.pricingModel || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Tier / Plan Design', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.tierDesign || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Pricing Psychology', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.psychology || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Bundling Strategy', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.bundling || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Discounting Policy', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.discounting || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'International Pricing', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.international || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Price Testing Plan', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.testingPlan || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Revenue Goals', bold: true, size: 24, color: 'BF092F' })], spacing: { before: 300, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
    pdf.text('PRICING STRATEGY CANVAS', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(19, 36, 64);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(s.label, 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      var lines = pdf.splitTextToSize(s.value || 'N/A', 170);
      pdf.text(lines, 20, y);
      y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generatePricingStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    pptx.title = 'Pricing Strategy Canvas';
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };
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
    s2.addText(data.valueMetric || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Pricing Model', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.pricingModel || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Tier / Plan Design', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.tierDesign || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s2.addText('Pricing Psychology', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s2.addText(data.psychology || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    // Slide 3 — Revenue Optimization
    var s3 = pptx.addSlide();
    s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: colors.teal } });
    s3.addText('Revenue Optimization', { x: 0.4, y: 0.1, w: 9, h: 0.6, fontSize: 22, bold: true, color: colors.white });
    s3.addText('Bundling Strategy', { x: 0.4, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.bundling || 'N/A', { x: 0.4, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Discounting Policy', { x: 5.3, y: 1.1, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.discounting || 'N/A', { x: 5.3, y: 1.5, w: 4.3, h: 1.5, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('International Pricing', { x: 0.4, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.international || 'N/A', { x: 0.4, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
    s3.addText('Revenue Goals', { x: 5.3, y: 3.2, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: colors.crimson });
    s3.addText(data.growthGoals || 'N/A', { x: 5.3, y: 3.6, w: 4.3, h: 1.7, fontSize: 11, color: '333333', valign: 'top', wrap: true, fit: 'shrink', margin: [4,4,4,4] });
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
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'B2B Marketing Strategy Canvas', bold: true, size: 48, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 28, color: '132440' })], spacing: { after: 300 } }),
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
              new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: s.t, bold: true, size: 26, color: '16476A' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setFontSize(22); pdf.setTextColor(191, 9, 47);
    pdf.text('B2B Marketing Strategy Canvas', 20, 25);
    pdf.setFontSize(14); pdf.setTextColor(19, 36, 64);
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
      pdf.setFontSize(13); pdf.setTextColor(22, 71, 106);
      pdf.text(s.t, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
      var lines = pdf.splitTextToSize(s.v || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateB2bStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };

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
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Strategy Canvas', bold: true, size: 48, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 28, color: '132440' })], spacing: { after: 300 } }),
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
              new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: s.t, bold: true, size: 26, color: '16476A' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setFontSize(22); pdf.setTextColor(191, 9, 47);
    pdf.text('Growth Strategy Canvas', 20, 25);
    pdf.setFontSize(14); pdf.setTextColor(19, 36, 64);
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
      pdf.setFontSize(13); pdf.setTextColor(22, 71, 106);
      pdf.text(s.t, 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
      var lines = pdf.splitTextToSize(s.v || 'Not specified', 170);
      pdf.text(lines, 20, y); y += lines.length * 6 + 10;
    });
    pdf.save(filename + '.pdf');
  },

  generateGrowthStrategyPPTX: function(filename, data) {
    var pptx = new PptxGenJS();
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };

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
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'CRO Audit Canvas', bold: true, size: 48, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 28 })], spacing: { after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: '666666' })], spacing: { after: 300 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Current Conversion Rate', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.currentCR || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Landing Page Issues', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.landingPages || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Copy & Messaging Strategy', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.copyStrategy || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Form & Checkout Optimization', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.formDesign || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Testing Roadmap', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.testPlan || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'UX Research Findings', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.uxFindings || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Funnel Gap Analysis', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.funnelGaps || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Test Prioritization (PIE Scores)', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.prioritization || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
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
      pdf.setTextColor(191, 9, 47);
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
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };

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
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Analytics Dashboard Canvas', bold: true, size: 48, color: 'BF092F' })], spacing: { after: 200 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Company: ' + (data.companyName || ''), size: 28 })], spacing: { after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: '666666' })], spacing: { after: 300 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'North Star Metric', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.northStar || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Funnel Metrics', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.funnelMetrics || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Attribution Model', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.attributionModel || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Channel Performance KPIs', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.channelPerformance || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Experiment Priorities', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.experiments || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Data Stack & Tools', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.dataStack || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Reporting Cadence', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.reportingCadence || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Privacy & Compliance', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: data.privacyCompliance || '', size: 24 })], spacing: { after: 200 } }),

          new window.docx.Paragraph({ children: [new window.docx.TextRun({ text: 'Growth Goals', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setTextColor(191, 9, 47);
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
      pdf.setTextColor(191, 9, 47);
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
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF' };

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
    var colors = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Capstone Project Plan', bold: true, size: 48, color: '132440' })], heading: docx_lib.HeadingLevel.TITLE }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'Untitled'), size: 28, color: '3B9797' })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: '666666', italics: true })], spacing: { after: 400 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project Type', bold: true, size: 28, color: '132440' })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { before: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.projectType || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Hardware & Components', bold: true, size: 28, color: '132440' })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { before: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.hardware || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Software Stack & Algorithms', bold: true, size: 28, color: '132440' })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { before: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.software || 'Not specified', size: 22 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Milestones & Timeline', bold: true, size: 28, color: '132440' })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { before: 300 } }),
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
    pdf.setFontSize(22); pdf.setTextColor(19, 36, 64);
    pdf.text('Capstone Project Plan', 105, y, { align: 'center' }); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(59, 151, 151);
    pdf.text(data.projectName || 'Untitled Project', 105, y, { align: 'center' }); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(100, 100, 100);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 105, y, { align: 'center' }); y += 15;

    var sections = [
      { title: 'Project Type', content: data.projectType },
      { title: 'Hardware & Components', content: data.hardware },
      { title: 'Software Stack & Algorithms', content: data.software },
      { title: 'Milestones & Timeline', content: data.milestones }
    ];

    sections.forEach(function(s) {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(14); pdf.setTextColor(19, 36, 64);
      pdf.text(s.title, 14, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robotics Business Strategy', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics Business & Strategy', italics: true, size: 20, color: '3B9797' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Company / Product Name', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.companyName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Target Market & Segment', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.market || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Value Proposition', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.value || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Business Model & Pricing', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.model || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Go-To-Market Plan', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.gtm || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Funding & Milestones', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Robotics Business Strategy', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Generated from wasilzafar.com — Robotics Business & Strategy', 20, 33);
    pdf.setDrawColor(59, 151, 151);
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
      pdf.setTextColor(22, 71, 106);
      pdf.text(f[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Systems Integration Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Systems Integration & Deployment', italics: true, size: 20, color: '3B9797' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'System / Project Name', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Architecture Pattern', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.architecture || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Subsystems & Interfaces', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.subsystems || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Testing Strategy', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.testing || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Deployment & Lifecycle Notes', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Systems Integration Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Generated from wasilzafar.com — Systems Integration & Deployment', 20, 33);
    pdf.setDrawColor(59, 151, 151);
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
      pdf.setTextColor(22, 71, 106);
      pdf.text(f[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Emerging Robotics Research Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Advanced & Emerging Robotics', italics: true, size: 20, color: '3B9797' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project Title', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Focus Domain', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.domain || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Key Technologies', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.technologies || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Research Challenges', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.challenges || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: '16476A' })], spacing: { before: 200, after: 100 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Emerging Robotics Research Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Generated from wasilzafar.com — Advanced & Emerging Robotics', 20, 33);
    pdf.setDrawColor(59, 151, 151);
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
      pdf.setTextColor(22, 71, 106);
      pdf.text(f[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Safety Assessment Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: '3B9797' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Target SIL / PL Level', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.silLevel || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Identified Hazards', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.hazards || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Applicable Standards', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.standards || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Safety Measures & Mitigations', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.measures || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Robot Safety Assessment Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(59, 151, 151);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Mobile Robot Design Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: '3B9797' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Locomotion Type', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.locomotion || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Sensor Suite', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.sensors || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Navigation Strategy', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.navigation || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Environment & Notes', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Mobile Robot Design Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(59, 151, 151);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Industrial Automation Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: '3B9797' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'PLC / Controller', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.plcType || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Communication Protocols', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.comms || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Workcell Design', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.workcell || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Industrial Automation Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(59, 151, 151);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'HRI System Design Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: '3B9797' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Cobot/Robot Type: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.cobotType || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Interaction Modalities', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.interfaces || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Safety Requirements', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.safety || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Deployment Context & Notes', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('HRI System Design Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(59, 151, 151);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'AI System Architecture Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated from wasilzafar.com — Robotics & Automation Series', italics: true, size: 20, color: '3B9797' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.projectName || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Type: ', bold: true, size: 24 }), new docx_lib.TextRun({ text: data.robotType || 'N/A', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Perception Stack', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.perception || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Planning Approach', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.planning || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Decision Architecture', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.decision || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Learning Method', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.learning || 'N/A', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: 'BF092F' })], spacing: { before: 300, after: 200 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('AI System Architecture Plan', 20, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Generated from wasilzafar.com — Robotics & Automation Series', 20, 33);
    pdf.setDrawColor(59, 151, 151);
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
      pdf.setTextColor(191, 9, 47);
      pdf.text(field[0], 20, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Vision Pipeline Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 28, color: '16476A' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: '666666' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Camera Type', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.camera || 'Not specified', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Algorithms', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.algorithms || 'Not specified', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Pipeline Steps', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.pipeline || 'Not specified', size: 24 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Notes & Requirements', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Vision Pipeline Plan', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(22, 71, 106);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 20, 38);
    pdf.setFontSize(10);
    pdf.setTextColor(102, 102, 102);
    pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, 48);
    var y = 65;
    var fields = [['Camera Type', data.camera], ['Algorithms', data.algorithms], ['Pipeline Steps', data.pipeline], ['Notes', data.notes]];
    fields.forEach(function(f) {
      pdf.setFontSize(12); pdf.setTextColor(59, 151, 151); pdf.text(f[0], 20, y); y += 8;
      pdf.setFontSize(11); pdf.setTextColor(50, 50, 50);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'ROS2 Node Architecture Plan', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 28, color: '16476A', font: 'Calibri' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Distribution: ' + (data.distro || 'Not specified'), size: 24, color: '666666' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: '666666' })], spacing: { after: 400 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Nodes', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.nodes || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Topics', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.topics || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Services & Actions', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.services || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Architecture Notes', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('ROS2 Node Architecture Plan', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(22, 71, 106);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 20, 38);
    pdf.setFontSize(11);
    pdf.setTextColor(102, 102, 102);
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
      pdf.setTextColor(59, 151, 151);
      pdf.text(f[0], 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Embedded System Spec Sheet', bold: true, size: 48, color: '132440', font: 'Calibri' })], spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || 'N/A'), size: 28, color: '16476A', font: 'Calibri' })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 22, color: '666666' })], spacing: { after: 400 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'MCU / Board', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.mcu || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Clock Speed', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.clock || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'RTOS / Scheduler', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.rtos || 'Bare-metal (no RTOS)', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Communication Protocols', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.comm || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Peripherals & Sensors', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.peripherals || 'Not specified', size: 24 })], spacing: { after: 200 } }),

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 28, color: '3B9797' })], spacing: { before: 300, after: 200 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Embedded System Spec Sheet', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(22, 71, 106);
    pdf.text('Project: ' + (data.projectName || 'N/A'), 20, 38);
    pdf.setFontSize(10);
    pdf.setTextColor(102, 102, 102);
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
      pdf.setTextColor(59, 151, 151);
      pdf.text(f[0], 20, y);
      y += 8;
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'PID Tuning Worksheet', bold: true, size: 48, color: '132440' })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: '666666' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Controller Configuration', bold: true, size: 32, color: '16476A' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Table({
            rows: [
              new docx_lib.TableRow({ children: ['Parameter', 'Value'].map(function(h) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20 })] })], shading: { fill: '132440' }, width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['System Name', data.systemName || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Controller Type', data.controllerType || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['PID Gains', data.gains || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Tuning Method', data.tuningMethod || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Setpoint', data.setpoint || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Sample Time', data.sampleTime || 'N/A'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 50, type: docx_lib.WidthType.PERCENTAGE } }); }) })
            ]
          }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Performance Results', bold: true, size: 32, color: '16476A' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.performance || 'No performance data recorded.' })] }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Notes', bold: true, size: 32, color: '16476A' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
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
    pdf.setFontSize(22); pdf.setTextColor(19, 36, 64); pdf.text('PID Tuning Worksheet', 20, y); y += 12;
    pdf.setFontSize(10); pdf.setTextColor(100); pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 15;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106); pdf.text('Controller Configuration', 20, y); y += 10;
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
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106); pdf.text('Performance Results', 20, y); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(0);
    var perfLines = pdf.splitTextToSize(data.performance || 'No performance data recorded.', 170);
    pdf.text(perfLines, 20, y); y += perfLines.length * 5 + 8;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106); pdf.text('Notes', 20, y); y += 10;
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Dynamics Parameters', bold: true, size: 48, color: '132440' })], heading: docx_lib.HeadingLevel.HEADING_1, spacing: { after: 300 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: '666666' })], spacing: { after: 400 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Configuration', bold: true, size: 32, color: '16476A' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Name: ', bold: true }), new docx_lib.TextRun({ text: data.robotName || 'N/A' })] }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Gravity (m/s²): ', bold: true }), new docx_lib.TextRun({ text: data.gravity || '9.81' })] }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Friction Model: ', bold: true }), new docx_lib.TextRun({ text: data.friction || 'N/A' })] }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Link Parameters', bold: true, size: 32, color: '16476A' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
          new docx_lib.Table({
            rows: [
              new docx_lib.TableRow({ children: ['Link', 'Mass (kg), Length (m), CoM (m)', 'Inertia (kg·m²)'].map(function(h) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20 })] })], shading: { fill: '132440' }, width: { size: 33, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Link 1', data.link1 || 'N/A', 'From link params'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 33, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Link 2', data.link2 || 'N/A', 'From link params'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 33, type: docx_lib.WidthType.PERCENTAGE } }); }) }),
              new docx_lib.TableRow({ children: ['Link 3', data.link3 || 'N/A', 'From link params'].map(function(c) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: c, size: 20 })] })], width: { size: 33, type: docx_lib.WidthType.PERCENTAGE } }); }) })
            ]
          }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Notes', bold: true, size: 32, color: '16476A' })], heading: docx_lib.HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } }),
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
    pdf.setFontSize(22); pdf.setTextColor(19, 36, 64); pdf.text('Robot Dynamics Parameters', 20, y); y += 12;
    pdf.setFontSize(10); pdf.setTextColor(100); pdf.text('Generated: ' + new Date().toLocaleDateString(), 20, y); y += 15;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106); pdf.text('Robot Configuration', 20, y); y += 10;
    pdf.setFontSize(11); pdf.setTextColor(0);
    pdf.text('Robot Name: ' + (data.robotName || 'N/A'), 20, y); y += 7;
    pdf.text('Gravity: ' + (data.gravity || '9.81') + ' m/s²', 20, y); y += 7;
    pdf.text('Friction Model: ' + (data.friction || 'N/A'), 20, y); y += 12;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106); pdf.text('Link Parameters', 20, y); y += 10;
    pdf.setFontSize(10); pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(19, 36, 64); pdf.rect(20, y - 5, 170, 8, 'F');
    pdf.text('Link', 25, y); pdf.text('Parameters (Mass, Length, CoM)', 65, y); y += 10;
    pdf.setTextColor(0);
    var links = [['Link 1', data.link1], ['Link 2', data.link2], ['Link 3', data.link3]];
    links.forEach(function(r) {
      if (r[1]) { pdf.text(r[0], 25, y); pdf.text(r[1].substring(0, 80), 65, y); y += 7; }
    });
    y += 8;
    pdf.setFontSize(14); pdf.setTextColor(22, 71, 106); pdf.text('Notes', 20, y); y += 10;
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
    var rows = [new docx_lib.TableRow({ children: ['Joint', 'θ (deg)', 'd (m)', 'a (m)', 'α (deg)'].map(function(h) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20 })] })], shading: { fill: '132440' } }); }) })];
    joints.forEach(function(j) {
      var parts = j.params.split(',').map(function(s) { return s.trim(); });
      while (parts.length < 4) parts.push('');
      rows.push(new docx_lib.TableRow({ children: [String(j.num)].concat(parts).map(function(v) { return new docx_lib.TableCell({ children: [new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: v, size: 20 })] })] }); }) }));
    });
    var doc = new docx_lib.Document({
      sections: [{
        children: [
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'DH Parameter Worksheet', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot: ' + (data.robotName || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Number of Joints: ' + (data.numJoints || ''), size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'DH Parameter Table', bold: true, size: 26, color: '3B9797' })], spacing: { after: 100 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('DH Parameter Worksheet', 20, 25);
    pdf.setFontSize(14);
    pdf.setTextColor(22, 71, 106);
    pdf.text('Robot: ' + (data.robotName || ''), 20, 38);
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Number of Joints: ' + (data.numJoints || ''), 20, 48);
    var y = 62;
    pdf.setFontSize(13);
    pdf.setTextColor(59, 151, 151);
    pdf.text('DH Parameter Table', 20, y);
    y += 10;
    // Table header
    pdf.setFillColor(19, 36, 64);
    pdf.rect(20, y, 170, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    var cols = ['Joint', 'θ (deg)', 'd (m)', 'a (m)', 'α (deg)'];
    var cx = [25, 55, 90, 120, 155];
    cols.forEach(function(c, i) { pdf.text(c, cx[i], y + 6); });
    y += 10;
    pdf.setTextColor(0, 0, 0);
    for (var i = 1; i <= 6; i++) {
      var jv = data['joint' + i];
      if (jv && jv.trim()) {
        var parts = jv.trim().split(',').map(function(s) { return s.trim(); });
        while (parts.length < 4) parts.push('');
        if (i % 2 === 0) { pdf.setFillColor(245, 245, 245); pdf.rect(20, y, 170, 8, 'F'); }
        pdf.text(String(i), cx[0], y + 6);
        parts.forEach(function(p, pi) { pdf.text(p, cx[pi + 1], y + 6); });
        y += 10;
      }
    }
    y += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Actuator Selection Worksheet', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project / Joint: ' + (data.projectName || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Actuator Type: ' + (data.actuatorType || ''), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Required Torque: ' + (data.torque || ''), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Required Speed: ' + (data.speed || 'Not specified'), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Gear Ratio & Type: ' + (data.gearRatio || 'Not specified'), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Supply Voltage / Power: ' + (data.voltage || 'Not specified'), size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 26, color: '3B9797' })], spacing: { after: 100 } }),
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
    pdf.setFontSize(20); pdf.setTextColor(19, 36, 64);
    pdf.text('Actuator Selection Worksheet', 15, y); y += 12;
    pdf.setFontSize(12); pdf.setTextColor(59, 151, 151);
    pdf.text('Project / Joint: ' + (data.projectName || ''), 15, y); y += 8;
    pdf.text('Actuator Type: ' + (data.actuatorType || ''), 15, y); y += 8;
    pdf.text('Required Torque: ' + (data.torque || ''), 15, y); y += 8;
    pdf.text('Required Speed: ' + (data.speed || 'Not specified'), 15, y); y += 8;
    pdf.text('Gear Ratio: ' + (data.gearRatio || 'Not specified'), 15, y); y += 8;
    pdf.text('Supply Voltage: ' + (data.voltage || 'Not specified'), 15, y); y += 14;
    pdf.setFontSize(14); pdf.setTextColor(191, 9, 47);
    pdf.text('Additional Notes', 15, y); y += 8;
    pdf.setFontSize(11); pdf.setTextColor(0, 0, 0);
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
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Sensor Selection Worksheet', bold: true, size: 36, color: '132440' })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Project: ' + (data.projectName || ''), bold: true, size: 24, color: '16476A' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Robot Type: ' + (data.robotType || ''), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Environment: ' + (data.environment || ''), size: 22 })], spacing: { after: 50 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Budget: ' + (data.budget || 'Not specified'), size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Proprioceptive Sensors (Internal State)', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.proprioceptive || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Exteroceptive Sensors (Environment)', bold: true, size: 26, color: 'BF092F' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.exteroceptive || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Fusion Strategy', bold: true, size: 26, color: '3B9797' })], spacing: { after: 100 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: data.fusionStrategy || 'Not specified', size: 22 })], spacing: { after: 200 } }),
          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Additional Notes', bold: true, size: 26, color: '16476A' })], spacing: { after: 100 } }),
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
    pdf.setTextColor(19, 36, 64);
    pdf.text('Sensor Selection Worksheet', 15, y); y += 12;
    pdf.setFontSize(12);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Project: ' + (data.projectName || ''), 15, y); y += 8;
    pdf.text('Robot Type: ' + (data.robotType || ''), 15, y); y += 8;
    pdf.text('Environment: ' + (data.environment || ''), 15, y); y += 8;
    pdf.text('Budget: ' + (data.budget || 'Not specified'), 15, y); y += 14;

    pdf.setFontSize(14);
    pdf.setTextColor(191, 9, 47);
    pdf.text('Proprioceptive Sensors', 15, y); y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    var propLines = pdf.splitTextToSize(data.proprioceptive || 'Not specified', 175);
    pdf.text(propLines, 15, y); y += propLines.length * 6 + 8;

    pdf.setFontSize(14);
    pdf.setTextColor(191, 9, 47);
    pdf.text('Exteroceptive Sensors', 15, y); y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    var extLines = pdf.splitTextToSize(data.exteroceptive || 'Not specified', 175);
    pdf.text(extLines, 15, y); y += extLines.length * 6 + 8;

    pdf.setFontSize(14);
    pdf.setTextColor(59, 151, 151);
    pdf.text('Fusion Strategy', 15, y); y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    var fusionLines = pdf.splitTextToSize(data.fusionStrategy || 'Not specified', 175);
    pdf.text(fusionLines, 15, y); y += fusionLines.length * 6 + 8;

    pdf.setFontSize(14);
    pdf.setTextColor(22, 71, 106);
    pdf.text('Additional Notes', 15, y); y += 8;
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    var noteLines = pdf.splitTextToSize(data.notes || 'None', 175);
    pdf.text(noteLines, 15, y);

    pdf.save(filename + '.pdf');
  },

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
      ['Fracture Toughness K_IC (MPa√m)', data.fractureToughness || 'N/A'],
      ['Test Temperature (°C)', data.temperature || 'N/A'],
      ['Strain Rate (s⁻¹)', data.strainRate || 'N/A']
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
      ['Test Temperature', data.temperature || '', '°C'],
      ['Strain Rate', data.strainRate || '', 's⁻¹'],
      ['', '', ''],
      ['Yield Strength', data.yieldStrength || '', 'MPa'],
      ['Ultimate Tensile Strength', data.uts || '', 'MPa'],
      ['Elongation', data.elongation || '', '%'],
      ['Elastic Modulus', data.elasticModulus || '', 'GPa'],
      ['Hardness', data.hardness || '', '(see value)'],
      ['Fracture Toughness K_IC', data.fractureToughness || '', 'MPa√m'],
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
      ['Test Temperature', data.temperature ? data.temperature + ' °C' : ''],
      ['Strain Rate', data.strainRate ? data.strainRate + ' s⁻¹' : ''],
      ['Yield Strength', data.yieldStrength ? data.yieldStrength + ' MPa' : ''],
      ['UTS', data.uts ? data.uts + ' MPa' : ''],
      ['Elongation', data.elongation ? data.elongation + ' %' : ''],
      ['Elastic Modulus', data.elasticModulus ? data.elasticModulus + ' GPa' : ''],
      ['Hardness', data.hardness],
      ['Fracture Toughness K_IC', data.fractureToughness ? data.fractureToughness + ' MPa√m' : '']
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
  // CompSimPlanner — Computational Materials Science Project Planner
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

          new docx_lib.Paragraph({ children: [new docx_lib.TextRun({ text: 'Generated via wasilzafar.com — Materials Science Series', size: 16, color: '999999', italics: true })], spacing: { before: 400 } })
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

  /**
   * Internal helper to download file
   * @private
   */
  _downloadFile: function(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// ============================================================
// FormPersistence — Reusable localStorage auto-save/restore
// ============================================================
// Usage:
//   var persistence = new FormPersistence('myStorageKey', {
//     'fieldId1': 'dataKey1',
//     'fieldId2': 'dataKey2'
//   }, 'badgeElementId');
//   persistence.init();         // restore + attach auto-save
//   persistence.clear();        // clear saved data + hide badge
//   persistence.collectData();  // returns { dataKey1: value, ... }

var FormPersistence = function(storageKey, fieldMap, badgeId) {
  this.storageKey = storageKey;
  this.fieldMap = fieldMap;   // { htmlId: dataKey }
  this.badgeId = badgeId;
};

FormPersistence.prototype = {
  // Debounce helper
  _debounce: function(fn, delay) {
    var timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  },

  // Collect current field values as a data object
  collectData: function() {
    var data = {};
    var self = this;
    Object.keys(this.fieldMap).forEach(function(id) {
      var el = document.getElementById(id);
      if (el) data[self.fieldMap[id]] = el.value;
    });
    return data;
  },

  // Save current field values to localStorage
  save: function() {
    var data = this.collectData();
    var hasContent = Object.values(data).some(function(v) { return v.trim() !== ''; });
    if (hasContent) {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this._showBadge();
    }
  },

  // Restore field values from localStorage
  restore: function() {
    var saved = localStorage.getItem(this.storageKey);
    if (!saved) return false;
    try {
      var data = JSON.parse(saved);
      var restored = false;
      var self = this;
      Object.keys(this.fieldMap).forEach(function(id) {
        var el = document.getElementById(id);
        var key = self.fieldMap[id];
        if (el && data[key] && data[key].trim() !== '') {
          el.value = data[key];
          restored = true;
        }
      });
      if (restored) this._showBadge();
      return restored;
    } catch (e) {
      console.warn('FormPersistence: Could not restore data for', this.storageKey, e);
      return false;
    }
  },

  // Clear saved data and hide badge
  clear: function() {
    localStorage.removeItem(this.storageKey);
    this._hideBadge();
  },

  // Attach debounced auto-save listeners to all fields
  attachAutoSave: function(delay) {
    var self = this;
    var debouncedSave = this._debounce(function() { self.save(); }, delay || 500);
    Object.keys(this.fieldMap).forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', debouncedSave);
    });
  },

  // Convenience: restore + attach auto-save in one call
  init: function(delay) {
    this.restore();
    this.attachAutoSave(delay);
  },

  // Show the auto-save badge with animation
  _showBadge: function() {
    var badge = document.getElementById(this.badgeId);
    if (badge) {
      badge.classList.add('show');
      badge.style.animation = 'none';
      badge.offsetHeight; // trigger reflow
      badge.style.animation = '';
    }
  },

  // Hide the auto-save badge
  _hideBadge: function() {
    var badge = document.getElementById(this.badgeId);
    if (badge) badge.classList.remove('show');
  }
};

// ============================================================
// CanvasFormHandler — Reusable form handler for canvas tools
// ============================================================
// Handles validation, data collection via FormPersistence,
// document generation via DocGenerator, success/reset messaging.
//
// Usage:
//   var handler = new CanvasFormHandler({
//     formId:       'bmoCanvasForm',
//     successId:    'bmoSuccess',
//     successTextId:'bmoSuccessText',
//     persistence:  myFormPersistenceInstance,
//     filenameField:'companyName',
//     filenameSuffix:'-bmc',
//     requiredFields: ['bmoCompanyName', 'bmoValueProposition'],
//     requiredMessage:'Please fill in Company Name and Value Proposition',
//     docType:      'BusinessModelCanvas'  // maps to DocGenerator methods
//   });
//   handler.generateWord();
//   handler.generateExcel();
//   handler.generatePDF();
//   handler.reset();

var CanvasFormHandler = function(config) {
  this.formId = config.formId;
  this.successId = config.successId;
  this.successTextId = config.successTextId;
  this.persistence = config.persistence;            // FormPersistence instance
  this.filenameField = config.filenameField;         // data key for filename
  this.filenameSuffix = config.filenameSuffix || '';
  this.requiredFields = config.requiredFields || []; // HTML element IDs
  this.requiredMessage = config.requiredMessage || 'Please fill in all required fields';
  this.docType = config.docType;                     // e.g. 'BusinessModelCanvas' or 'LeanCanvas'
};

CanvasFormHandler.prototype = {
  // Validate required fields, return true if valid
  _validate: function() {
    for (var i = 0; i < this.requiredFields.length; i++) {
      var el = document.getElementById(this.requiredFields[i]);
      if (!el || !el.value.trim()) {
        alert(this.requiredMessage);
        return false;
      }
    }
    return true;
  },

  // Build filename from data (sanitised, max 60 chars)
  _buildFilename: function(data) {
    var raw = (data[this.filenameField] || 'canvas');
    var name = raw
      .replace(/\s+/g, '-')           // spaces → hyphens
      .replace(/[^a-zA-Z0-9\-]/g, '') // strip non-alphanumeric (keep hyphens)
      .replace(/-{2,}/g, '-')         // collapse consecutive hyphens
      .replace(/^-|-$/g, '')          // trim leading/trailing hyphens
      .toLowerCase();
    if (name.length > 60) name = name.substring(0, 60).replace(/-$/, '');
    return (name || 'canvas') + this.filenameSuffix;
  },

  // Show success notification
  _showSuccess: function(message) {
    var successDiv = document.getElementById(this.successId);
    var textSpan = document.getElementById(this.successTextId);
    if (textSpan) textSpan.textContent = message;
    if (successDiv) {
      successDiv.classList.add('show');
      setTimeout(function() { successDiv.classList.remove('show'); }, 5000);
    }
  },

  // Generate Word document
  generateWord: function() {
    if (!this._validate()) return;
    var data = this.persistence.collectData();
    var filename = this._buildFilename(data);
    var self = this;
    var method = 'generate' + this.docType + 'Word';
    DocGenerator[method](filename, data).then(function() {
      self._showSuccess('Document generated! Your canvas has been downloaded as a Word file.');
    }).catch(function(err) {
      console.error('Error:', err);
      alert('Error generating Word document. Please try another format.');
    });
  },

  // Generate Excel spreadsheet
  generateExcel: function() {
    if (!this._validate()) return;
    var data = this.persistence.collectData();
    var filename = this._buildFilename(data);
    var method = 'generate' + this.docType + 'Excel';
    try {
      DocGenerator[method](filename, data);
      this._showSuccess('Document generated! Your canvas has been downloaded as an Excel file.');
    } catch (err) {
      console.error('Error:', err);
      alert('Error generating Excel file. Please try another format.');
    }
  },

  // Generate PDF
  generatePDF: function() {
    if (!this._validate()) return;
    var data = this.persistence.collectData();
    var filename = this._buildFilename(data);
    var method = 'generate' + this.docType + 'PDF';
    try {
      DocGenerator[method](filename, data);
      this._showSuccess('Document generated! Your canvas has been downloaded as a PDF file.');
    } catch (err) {
      console.error('Error:', err);
      alert('Error generating PDF. Please try another format.');
    }
  },

  // Generate PowerPoint (PPTX) — requires PptxGenJS
  generatePPTX: function() {
    if (!this._validate()) return;
    var data = this.persistence.collectData();
    var filename = this._buildFilename(data);
    var self = this;
    var method = 'generate' + this.docType + 'PPTX';
    if (typeof DocGenerator[method] !== 'function') {
      alert('PowerPoint generation is not available for this tool.');
      return;
    }
    DocGenerator[method](filename, data).then(function() {
      self._showSuccess('Presentation generated! Your pitch deck has been downloaded as a PowerPoint file.');
    }).catch(function(err) {
      console.error('Error:', err);
      alert('Error generating PowerPoint. Please try another format.');
    });
  },

  // Reset form, clear persistence, hide success
  reset: function() {
    var form = document.getElementById(this.formId);
    if (form) form.reset();
    var successDiv = document.getElementById(this.successId);
    if (successDiv) successDiv.classList.remove('show');
    this.persistence.clear();
  }
};

// Export for use in modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocGenerator: DocGenerator, FormPersistence: FormPersistence, CanvasFormHandler: CanvasFormHandler };
}
// Ensure global availability in browser
if (typeof window !== 'undefined') {
  window.DocGenerator = DocGenerator;
  window.FormPersistence = FormPersistence;
  window.CanvasFormHandler = CanvasFormHandler;
}
