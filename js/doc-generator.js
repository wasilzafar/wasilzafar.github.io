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

      const doc = new JsPDFConstructor();
      console.log('jsPDF instance created:', doc);

      // Set font
      doc.setFontSize(16);
      doc.setTextColor(19, 36, 64); // Navy color

      let yPos = 20;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // Add title
      if (config.title) {
        doc.text(config.title, margin, yPos);
        yPos += 15;
      }

      // Support both old API (sections) and new API (lines)
      if (config.lines && config.lines.length > 0) {
        // New API: flat array of {text, size, bold} objects
        config.lines.forEach(line => {
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
          }
          var fontSize = line.size || 11;
          doc.setFontSize(fontSize);
          if (line.bold) {
            doc.setFont(undefined, 'bold');
            doc.setTextColor(19, 36, 64);
          } else {
            doc.setFont(undefined, 'normal');
            doc.setTextColor(51, 51, 51);
          }
          var splitLines = doc.splitTextToSize(line.text || '', contentWidth);
          doc.text(splitLines, margin, yPos);
          yPos += splitLines.length * (fontSize * 0.4) + (fontSize * 0.3);
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
          }
        });
      } else if (config.sections && config.sections.length > 0) {
        config.sections.forEach(section => {
          // Check if we need a new page
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
          }

          // Add section heading
          doc.setFontSize(14);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(19, 36, 64);
          doc.text(section.heading, margin, yPos);
          yPos += 10;

          // Add section content
          doc.setFontSize(11);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(51, 51, 51);

          const content = Array.isArray(section.content) ? section.content : [section.content];
          content.forEach(item => {
            if (typeof item === 'string') {
              const textLines = doc.splitTextToSize(item, contentWidth);
              doc.text(textLines, margin, yPos);
              yPos += textLines.length * 5 + 5;

              // Check page break
              if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
              }
            }
          });

          yPos += 5;
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
