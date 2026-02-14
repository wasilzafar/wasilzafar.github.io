/**
 * Document Generation Library  Core
 * Base document generation methods (Word, Excel, PowerPoint, PDF)
 * and reusable FormPersistence / CanvasFormHandler classes.
 *
 * Series-specific generators are loaded separately via doc-generator-[series].js files.
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

  // ============================================================
  // PPTX Helper â€” Generic section-based PowerPoint generator
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
    // Content slides â€” group sections
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
// FormPersistence â€” Reusable localStorage auto-save/restore
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
// CanvasFormHandler â€” Reusable form handler for canvas tools
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
      .replace(/\s+/g, '-')           // spaces â†’ hyphens
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

  // Generate PowerPoint (PPTX) â€” requires PptxGenJS
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
