/**
 * Document Generation Library — Core
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

// ============================================================
// DocStyles — Centralized design tokens and helper factories
// ============================================================
// All series generators MUST use DocStyles for colors, fonts,
// sizes, and element creation to ensure visual consistency.
// ============================================================
var DocStyles = {
  // ── Color palette (hex without # prefix) ──────────────────
  colors: {
    navy:     '132440',
    crimson:  'BF092F',
    teal:     '3B9797',
    blue:     '16476A',
    light:    'F8F9FA',
    white:    'FFFFFF',
    gray:     '666666',
    darkGray: '333333',
    altRow:     'F0F8F8',   // light teal for alternating table rows
    mediumGray: '999999',   // medium gray for footers / subtle text
    black:      '000000',
    amber:      'CC8800'    // warning / at-risk status
  },

  // RGB equivalents for jsPDF setTextColor(r, g, b)
  rgb: {
    navy:       [19, 36, 64],
    crimson:    [191, 9, 47],
    teal:       [59, 151, 151],
    blue:       [22, 71, 106],
    gray:       [102, 102, 102],
    darkGray:   [51, 51, 51],
    white:      [255, 255, 255],
    altRow:     [240, 248, 248],
    mediumGray: [153, 153, 153],
    black:      [0, 0, 0],
    light:      [248, 249, 250]
  },

  // ── Typography ────────────────────────────────────────────
  fonts: {
    primary:   'Calibri',    // DOCX primary font
    secondary: 'Arial',      // PPTX font + DOCX fallback
    pdf:       'helvetica'   // jsPDF built-in
  },

  // ── DOCX sizes (in half-points — docx.js convention) ──────
  docx: {
    titleSize:        48,    // 24pt
    subtitleSize:     28,    // 14pt
    sectionSize:      28,    // 14pt
    subsectionSize:   24,    // 12pt
    bodySize:         22,    // 11pt
    smallSize:        18,    // 9pt
    titleColor:       '132440',
    subtitleColor:    '3B9797',
    sectionColor:     'BF092F',
    subsectionColor:  '16476A',
    bodyColor:        '333333',
    dateColor:        '666666',
    spacing: {
      afterTitle:     400,
      afterSubtitle:  200,
      beforeSection:  300,
      afterSection:   200,
      afterBody:      120,
      afterSmall:     100
    }
  },

  // ── PDF sizes (in pt) ─────────────────────────────────────
  pdf: {
    titleSize:       20,
    subtitleSize:    14,
    sectionSize:     13,
    subsectionSize:  12,
    bodySize:        11,
    smallSize:       10,
    margin:          20,     // mm from left
    contentWidth:    170,    // mm wrapping width
    lineHeight:      1.3,   // multiplier
    pageBreakMargin: 25      // mm from bottom before new page
  },

  // ── PPTX sizes (in pt) & layout constants ─────────────────
  pptx: {
    layout:           'LAYOUT_16x9',
    titleFontSize:     36,
    subtitleFontSize:  20,
    slideTitleSize:    20,
    sectionLabelSize:  14,
    subLabelSize:      12,
    bodyFontSize:      11,
    smallFontSize:      9,
    // Standard positions (inches)
    margin:            0.5,
    contentWidth:      9.0,
    halfWidth:         4.3,
    rightColumnX:      5.2,
    accentBarHeight:   0.6,
    thinBarHeight:     0.06,
    // Slide number position
    slideNumX:         9.2,
    slideNumY:         '93%'
  },

  // ── Excel column width presets ─────────────────────────────
  excel: {
    colWidths: {
      narrow:  14,
      medium:  25,
      wide:    40,
      xwide:   60
    }
  },

  // ============================================================
  // DOCX Helper Methods
  // ============================================================

  /** Get the docx library reference, with compatibility handling */
  _getDocxLib: function() {
    if (!window.docx) {
      alert('Word document library is loading. Please try again in a moment.');
      return null;
    }
    return window.docx.default || window.docx;
  },

  /** Create a styled DOCX document with document-level default styles */
  createStyledDoc: function(config) {
    var lib = this._getDocxLib();
    if (!lib) return null;
    var S = this;
    return new lib.Document({
      creator: config.author || 'Generated from wasilzafar.com',
      title: config.title || '',
      description: config.description || '',
      features: { updateFields: true },
      styles: {
        default: {
          document: {
            run:       { size: S.docx.bodySize, font: S.fonts.primary, color: S.docx.bodyColor },
            paragraph: { spacing: { after: S.docx.spacing.afterBody } }
          },
          heading1: {
            run:       { size: S.docx.sectionSize, bold: true, color: S.docx.sectionColor, font: S.fonts.primary },
            paragraph: { spacing: { before: S.docx.spacing.beforeSection, after: S.docx.spacing.afterSection } }
          },
          heading2: {
            run:       { size: S.docx.subsectionSize, bold: true, color: S.docx.subtitleColor, font: S.fonts.primary },
            paragraph: { spacing: { before: 200, after: 120 } }
          },
          heading3: {
            run:       { size: S.docx.bodySize, bold: true, color: S.docx.titleColor, font: S.fonts.primary },
            paragraph: { spacing: { before: 120, after: 100 } }
          }
        }
      },
      sections: config.sections || []
    });
  },

  // ── Standardized DOCX paragraph builders ──────────────────

  /** Document title paragraph (24pt navy bold) */
  docxTitle: function(text) {
    var lib = this._getDocxLib(); if (!lib) return null;
    return new lib.Paragraph({
      children: [new lib.TextRun({ text: text, bold: true, size: this.docx.titleSize, color: this.docx.titleColor, font: this.fonts.primary })],
      spacing: { after: this.docx.spacing.afterTitle }
    });
  },

  /** Document subtitle paragraph (14pt teal bold) */
  docxSubtitle: function(text) {
    var lib = this._getDocxLib(); if (!lib) return null;
    return new lib.Paragraph({
      children: [new lib.TextRun({ text: text, bold: true, size: this.docx.subtitleSize, color: this.docx.subtitleColor, font: this.fonts.primary })],
      spacing: { after: this.docx.spacing.afterSubtitle }
    });
  },

  /** Date line paragraph (9pt gray) */
  docxDate: function(dateStr) {
    var lib = this._getDocxLib(); if (!lib) return null;
    var d = dateStr || new Date().toLocaleDateString();
    return new lib.Paragraph({
      children: [new lib.TextRun({ text: 'Generated: ' + d, size: this.docx.smallSize, color: this.docx.dateColor, font: this.fonts.primary })],
      spacing: { after: this.docx.spacing.afterTitle }
    });
  },

  /** Section heading paragraph (level 1=crimson, 2=blue, 3=navy) — uses HeadingLevel for TOC */
  docxHeading: function(text, level) {
    var lib = this._getDocxLib(); if (!lib) return null;
    var colorMap = { 1: this.docx.sectionColor, 2: this.docx.subtitleColor, 3: this.docx.titleColor };
    var sizeMap  = { 1: this.docx.sectionSize,  2: this.docx.subsectionSize, 3: this.docx.bodySize };
    var HL = lib.HeadingLevel;
    var headingMap = HL ? { 1: HL.HEADING_1, 2: HL.HEADING_2, 3: HL.HEADING_3 } : {};
    var lvl = level || 1;
    return new lib.Paragraph({
      children: [new lib.TextRun({ text: text, bold: true, size: sizeMap[lvl] || sizeMap[1], color: colorMap[lvl] || colorMap[1], font: this.fonts.primary })],
      heading: headingMap[lvl],
      spacing: { before: this.docx.spacing.beforeSection, after: this.docx.spacing.afterSection }
    });
  },

  // ── Title Page & Table of Contents helpers ─────────────────

  /**
   * Generate title page section children — centered title, decorative lines, author, date.
   * Returns an array of Paragraph objects for use as a document section.
   */
  docxTitlePageChildren: function(title, subtitle, author, date) {
    var lib = this._getDocxLib(); if (!lib) return [];
    var S = this;
    var align = lib.AlignmentType ? lib.AlignmentType.CENTER : 'center';
    var dateStr = date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var authorStr = author || 'Generated from wasilzafar.com';

    var children = [
      // Vertical spacer to push content toward center
      new lib.Paragraph({ text: '', spacing: { before: 5000 } }),
      // Decorative top line
      new lib.Paragraph({
        children: [new lib.TextRun({ text: '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501', size: 16, color: S.colors.teal })],
        alignment: align,
        spacing: { after: 400 }
      }),
      // Main title
      new lib.Paragraph({
        children: [new lib.TextRun({ text: title || 'Document', bold: true, size: 52, color: S.docx.titleColor, font: S.fonts.primary })],
        alignment: align,
        spacing: { after: 200 }
      })
    ];

    // Optional subtitle
    if (subtitle) {
      children.push(new lib.Paragraph({
        children: [new lib.TextRun({ text: subtitle, bold: true, size: S.docx.subtitleSize, color: S.colors.blue, font: S.fonts.primary })],
        alignment: align,
        spacing: { after: 200 }
      }));
    }

    // Decorative bottom line + author + date
    children.push(
      new lib.Paragraph({
        children: [new lib.TextRun({ text: '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501', size: 16, color: S.colors.teal })],
        alignment: align,
        spacing: { after: 600 }
      }),
      new lib.Paragraph({
        children: [new lib.TextRun({ text: authorStr, size: 24, color: S.colors.blue, font: S.fonts.primary })],
        alignment: align,
        spacing: { after: 200 }
      }),
      new lib.Paragraph({
        children: [new lib.TextRun({ text: dateStr, size: 20, color: S.colors.gray, font: S.fonts.primary })],
        alignment: align
      })
    );

    return children;
  },

  /**
   * Generate Table of Contents section children.
   * Returns an array with a heading + TOC field for use as a document section.
   * Requires features: { updateFields: true } on the Document for auto-population.
   */
  docxTocChildren: function() {
    var lib = this._getDocxLib(); if (!lib) return [];
    var S = this;
    var children = [
      new lib.Paragraph({
        children: [new lib.TextRun({ text: 'Table of Contents', bold: true, size: S.docx.titleSize, color: S.docx.titleColor, font: S.fonts.primary })],
        spacing: { after: 400 }
      })
    ];
    // Add TOC field if supported by docx library version
    if (lib.TableOfContents) {
      children.push(
        new lib.TableOfContents('Table of Contents', {
          hyperlink: true,
          headingStyleRange: '1-3'
        })
      );
    }
    return children;
  },

  /**
   * Build a complete Word document from raw content paragraphs.
   * Wraps content with Title Page + TOC, applies heading styles, packs and downloads.
   * Use this for custom-built paragraph arrays that bypass generateWord.
   * @param {string} filename - Output filename (without .docx extension)
   * @param {string} title - Document title for cover page
   * @param {string} author - Author / source attribution
   * @param {Array} contentChildren - Array of docx Paragraph/Table objects
   */
  docxPackage: function(filename, title, author, contentChildren) {
    var lib = this._getDocxLib(); if (!lib) return;
    var S = this;
    var docSections = [
      { children: S.docxTitlePageChildren(title, null, author) },
      { children: S.docxTocChildren() },
      { children: contentChildren }
    ];
    var doc = S.createStyledDoc({
      title: title,
      author: author,
      sections: docSections
    });
    lib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },

  /** Body text paragraph (11pt dark gray) */
  docxBody: function(text) {
    var lib = this._getDocxLib(); if (!lib) return null;
    return new lib.Paragraph({
      children: [new lib.TextRun({ text: text || 'Not specified', size: this.docx.bodySize, color: this.docx.bodyColor, font: this.fonts.primary })],
      spacing: { after: this.docx.spacing.afterBody }
    });
  },

  /** Label-value pair paragraph (bold blue label + normal body value) */
  docxLabel: function(label, value) {
    var lib = this._getDocxLib(); if (!lib) return null;
    return new lib.Paragraph({
      children: [
        new lib.TextRun({ text: label + ': ', bold: true, size: this.docx.bodySize, color: this.docx.subtitleColor, font: this.fonts.primary }),
        new lib.TextRun({ text: value || 'Not specified', size: this.docx.bodySize, color: this.docx.bodyColor, font: this.fonts.primary })
      ],
      spacing: { after: this.docx.spacing.afterBody }
    });
  },

  /** Standardized DOCX table with teal header row + alternating row shading */
  docxTable: function(headers, rows) {
    var lib = this._getDocxLib(); if (!lib) return null;
    var S = this;
    var headerCells = headers.map(function(h) {
      return new lib.TableCell({
        children: [new lib.Paragraph({ children: [new lib.TextRun({ text: h, bold: true, size: S.docx.bodySize, color: 'FFFFFF', font: S.fonts.primary })] })],
        shading: { fill: S.colors.teal, type: lib.ShadingType ? lib.ShadingType.SOLID : 'solid' }
      });
    });
    var dataRows = rows.map(function(row, ri) {
      var cells = row.map(function(cell) {
        return new lib.TableCell({
          children: [new lib.Paragraph({ children: [new lib.TextRun({ text: String(cell || ''), size: S.docx.bodySize, color: S.docx.bodyColor, font: S.fonts.primary })] })],
          shading: ri % 2 === 1 ? { fill: S.colors.altRow } : {}
        });
      });
      return new lib.TableRow({ children: cells });
    });
    return new lib.Table({
      rows: [new lib.TableRow({ children: headerCells })].concat(dataRows),
      width: { size: 100, type: lib.WidthType ? lib.WidthType.PERCENTAGE : 'pct' }
    });
  },

  /**
   * Build a full children array for a doc section from declarative field list.
   * Field types: 'heading' (+ level), 'label' (+ label, value), 'table' (+ headers, rows),
   *              'body' (+ text), plain string, or { raw: Paragraph } for custom passthrough.
   */
  docxSectionChildren: function(title, subtitle, date, fields) {
    var children = [];
    if (title) children.push(this.docxTitle(title));
    if (subtitle) children.push(this.docxSubtitle(subtitle));
    if (date !== false) children.push(this.docxDate(date));
    var S = this;
    if (fields && fields.length) {
      fields.forEach(function(f) {
        if (f.type === 'heading')      children.push(S.docxHeading(f.text, f.level));
        else if (f.type === 'label')   children.push(S.docxLabel(f.label, f.value));
        else if (f.type === 'table')   children.push(S.docxTable(f.headers, f.rows));
        else if (f.type === 'body')    children.push(S.docxBody(f.text));
        else if (typeof f === 'string') children.push(S.docxBody(f));
        else if (f.raw)                children.push(f.raw);
      });
    }
    return children;
  },

  /** Full DOCX generation shorthand — builds, packs, and downloads.
   *  Automatically prepends a Title Page and Table of Contents. */
  buildDocx: function(filename, config) {
    var lib = this._getDocxLib(); if (!lib) return;
    var S = this;
    // Content fields only (title/subtitle/date are on the title page)
    var contentChildren = this.docxSectionChildren(null, null, false, config.fields);
    // Assemble: Title Page → TOC → Content
    var docSections = [
      { children: S.docxTitlePageChildren(config.title, config.subtitle, config.author, config.date) },
      { children: S.docxTocChildren() },
      { children: contentChildren }
    ];
    var doc = this.createStyledDoc({
      title: config.title,
      author: config.author,
      sections: docSections
    });
    lib.Packer.toBlob(doc).then(function(blob) { DocGenerator._downloadFile(blob, filename + '.docx'); });
  },


  // ============================================================
  // Excel Helper Methods
  // ============================================================

  /** Get the SheetJS library reference */
  _getXLSX: function() {
    if (!window.XLSX) { alert('Excel library is loading. Please try again.'); return null; }
    return window.XLSX;
  },

  /** Build a worksheet from 2D array with optional column widths */
  excelSheet: function(rows, colWidths) {
    var XLSX = this._getXLSX(); if (!XLSX) return null;
    var ws = XLSX.utils.aoa_to_sheet(rows);
    if (colWidths) {
      ws['!cols'] = colWidths.map(function(w) { return { wch: w }; });
    }
    return ws;
  },

  /** Auto-calculate column widths from data (max cell length + padding, capped at 60) */
  excelAutoWidths: function(rows) {
    if (!rows || !rows.length) return [];
    var colCount = rows[0].length;
    var widths = [];
    for (var c = 0; c < colCount; c++) {
      var maxLen = 10;
      for (var r = 0; r < rows.length; r++) {
        var cell = rows[r] && rows[r][c] ? String(rows[r][c]) : '';
        if (cell.length > maxLen) maxLen = cell.length;
      }
      widths.push(Math.min(maxLen + 4, 60));
    }
    return widths;
  },

  /** Full Excel single-sheet generation shorthand */
  buildExcel: function(filename, sheetName, rows, colWidths) {
    var XLSX = this._getXLSX(); if (!XLSX) return;
    var ws = this.excelSheet(rows, colWidths || this.excelAutoWidths(rows));
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  /** Multi-sheet Excel generation. sheets: [{name, rows, colWidths?}] */
  buildExcelMulti: function(filename, sheets) {
    var XLSX = this._getXLSX(); if (!XLSX) return;
    var wb = XLSX.utils.book_new();
    var S = this;
    sheets.forEach(function(sh) {
      var ws = S.excelSheet(sh.rows, sh.colWidths || S.excelAutoWidths(sh.rows));
      XLSX.utils.book_append_sheet(wb, ws, sh.name || 'Sheet1');
    });
    XLSX.writeFile(wb, filename + '.xlsx');
  },


  // ============================================================
  // PDF Helper Methods
  // ============================================================

  /** Get jsPDF constructor with compatibility handling */
  _getJsPDF: function() {
    var C = null;
    if (window.jspdf && window.jspdf.jsPDF) C = window.jspdf.jsPDF;
    else if (window.jspdf) C = window.jspdf;
    else if (window.jsPDF) C = window.jsPDF;
    if (!C) { alert('PDF library is loading. Please try again.'); return null; }
    return C;
  },

  /** Create a standardized jsPDF instance with tracking properties */
  createPDF: function(orientation) {
    var C = this._getJsPDF(); if (!C) return null;
    var pdf = new C({ orientation: orientation || 'portrait', unit: 'mm', format: 'a4' });
    var S = this;
    pdf._S = S;
    pdf._y = S.pdf.margin;
    pdf._margin = S.pdf.margin;
    pdf._contentWidth = S.pdf.contentWidth;
    pdf._pageH = pdf.internal.pageSize.height;
    pdf._lineH = S.pdf.lineHeight;
    return pdf;
  },

  /** Write text to PDF with wrapping and auto page breaks */
  pdfText: function(pdf, text, fontSize, isBold, colorRGB) {
    var S = this;
    var color = colorRGB || S.rgb.darkGray;
    pdf.setFontSize(fontSize);
    pdf.setFont(S.fonts.pdf, isBold ? 'bold' : 'normal');
    pdf.setTextColor(color[0], color[1], color[2]);
    var wrapped = pdf.splitTextToSize(String(text || ''), pdf._contentWidth);
    var lineSpacing = fontSize * 0.353 * pdf._lineH;
    for (var i = 0; i < wrapped.length; i++) {
      if (pdf._y > pdf._pageH - 15) { pdf.addPage(); pdf._y = pdf._margin; }
      pdf.text(wrapped[i], pdf._margin, pdf._y);
      pdf._y += lineSpacing;
    }
  },

  // ── Compound PDF elements ─────────────────────────────────

  /** PDF title (20pt bold navy) */
  pdfTitle: function(pdf, text) {
    this.pdfText(pdf, text, this.pdf.titleSize, true, this.rgb.navy);
    pdf._y += 4;
  },

  /** PDF subtitle (14pt bold blue) */
  pdfSubtitle: function(pdf, text) {
    this.pdfText(pdf, text, this.pdf.subtitleSize, true, this.rgb.blue);
    pdf._y += 3;
  },

  /** PDF date line (10pt gray) */
  pdfDate: function(pdf, dateStr) {
    var d = dateStr || new Date().toLocaleDateString();
    this.pdfText(pdf, 'Generated: ' + d, this.pdf.smallSize, false, this.rgb.gray);
    pdf._y += 6;
  },

  /** PDF section heading (13pt bold crimson) */
  pdfHeading: function(pdf, text) {
    if (pdf._y > pdf._pageH - this.pdf.pageBreakMargin) { pdf.addPage(); pdf._y = pdf._margin; }
    this.pdfText(pdf, text, this.pdf.sectionSize, true, this.rgb.crimson);
    pdf._y += 2;
  },

  /** PDF subheading (12pt bold blue) */
  pdfSubheading: function(pdf, text) {
    this.pdfText(pdf, text, this.pdf.subsectionSize, true, this.rgb.blue);
    pdf._y += 1;
  },

  /** PDF body text (11pt dark gray) */
  pdfBody: function(pdf, text) {
    this.pdfText(pdf, text || 'Not specified', this.pdf.bodySize, false, this.rgb.darkGray);
    pdf._y += 3;
  },

  /** PDF label-value pair (bold blue label + normal value) */
  pdfLabel: function(pdf, label, value) {
    var S = this;
    pdf.setFontSize(S.pdf.bodySize);
    pdf.setFont(S.fonts.pdf, 'bold');
    pdf.setTextColor(S.rgb.blue[0], S.rgb.blue[1], S.rgb.blue[2]);
    if (pdf._y > pdf._pageH - 15) { pdf.addPage(); pdf._y = pdf._margin; }
    pdf.text(label + ': ', pdf._margin, pdf._y);
    var labelW = pdf.getTextWidth(label + ': ');
    pdf.setFont(S.fonts.pdf, 'normal');
    pdf.setTextColor(S.rgb.darkGray[0], S.rgb.darkGray[1], S.rgb.darkGray[2]);
    var remaining = pdf._contentWidth - labelW;
    if (remaining < 30) {
      pdf._y += S.pdf.bodySize * 0.353 * pdf._lineH;
      S.pdfBody(pdf, value);
    } else {
      var wrapped = pdf.splitTextToSize(String(value || 'Not specified'), remaining);
      pdf.text(wrapped[0], pdf._margin + labelW, pdf._y);
      pdf._y += S.pdf.bodySize * 0.353 * pdf._lineH;
      for (var i = 1; i < wrapped.length; i++) {
        if (pdf._y > pdf._pageH - 15) { pdf.addPage(); pdf._y = pdf._margin; }
        pdf.text(wrapped[i], pdf._margin, pdf._y);
        pdf._y += S.pdf.bodySize * 0.353 * pdf._lineH;
      }
      pdf._y += 3;
    }
  },

  /** Draw a horizontal teal divider line */
  pdfDivider: function(pdf) {
    pdf.setDrawColor(this.rgb.teal[0], this.rgb.teal[1], this.rgb.teal[2]);
    pdf.setLineWidth(0.5);
    pdf.line(pdf._margin, pdf._y, pdf._margin + pdf._contentWidth, pdf._y);
    pdf._y += 5;
  },

  /** Navy header bar with white text (for distinct section breaks) */
  pdfHeaderBar: function(pdf, text) {
    var S = this;
    if (pdf._y > pdf._pageH - 20) { pdf.addPage(); pdf._y = pdf._margin; }
    pdf.setFillColor(S.rgb.navy[0], S.rgb.navy[1], S.rgb.navy[2]);
    pdf.rect(pdf._margin, pdf._y - 5, pdf._contentWidth, 10, 'F');
    pdf.setFontSize(S.pdf.subtitleSize);
    pdf.setFont(S.fonts.pdf, 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(text, pdf._margin + 4, pdf._y + 1);
    pdf._y += 12;
  },

  /** Full PDF generation shorthand — builds from declarative config */
  buildPDF: function(filename, config) {
    var pdf = this.createPDF(config.orientation);
    if (!pdf) return;
    if (config.title)    this.pdfTitle(pdf, config.title);
    if (config.subtitle) this.pdfSubtitle(pdf, config.subtitle);
    if (config.date !== false) this.pdfDate(pdf, config.date);
    var S = this;
    if (config.fields) {
      config.fields.forEach(function(f) {
        if (f.type === 'heading')        S.pdfHeading(pdf, f.text);
        else if (f.type === 'subheading') S.pdfSubheading(pdf, f.text);
        else if (f.type === 'label')     S.pdfLabel(pdf, f.label, f.value);
        else if (f.type === 'body')      S.pdfBody(pdf, f.text);
        else if (f.type === 'divider')   S.pdfDivider(pdf);
        else if (f.type === 'headerBar') S.pdfHeaderBar(pdf, f.text);
        else if (typeof f === 'string')  S.pdfBody(pdf, f);
      });
    }
    pdf.save(filename + '.pdf');
  },


  // ============================================================
  // PPTX Helper Methods
  // ============================================================

  /** Create a new PptxGenJS instance */
  _getPptx: function() {
    if (!window.PptxGenJS) { alert('PowerPoint library is loading. Please try again.'); return null; }
    return new window.PptxGenJS();
  },

  /** Initialize a presentation with standard layout and metadata */
  createPres: function(title, author) {
    var pptx = this._getPptx(); if (!pptx) return null;
    pptx.layout = this.pptx.layout;
    pptx.author = author || 'Generated from wasilzafar.com';
    pptx.title = title || '';
    return pptx;
  },

  /** Standard title slide (navy bg, teal divider, centered text) */
  pptxTitleSlide: function(pptx, title, subtitle, meta) {
    var C = this.colors; var P = this.pptx;
    var slide = pptx.addSlide();
    slide.background = { color: C.navy };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 2.2, w: '100%', h: P.thinBarHeight, fill: { color: C.teal } });
    slide.addText(title || '', { x: P.margin, y: 0.8, w: P.contentWidth, h: 1.2, fontSize: P.titleFontSize, bold: true, color: C.white, fontFace: this.fonts.secondary, align: 'center' });
    if (subtitle) {
      slide.addText(subtitle, { x: P.margin, y: 2.5, w: P.contentWidth, h: 0.7, fontSize: P.subtitleFontSize, color: C.teal, fontFace: this.fonts.secondary, align: 'center', italic: true });
    }
    if (meta) {
      slide.addText(meta, { x: P.margin, y: 3.4, w: P.contentWidth, h: 0.5, fontSize: P.smallFontSize + 3, color: C.light, fontFace: this.fonts.secondary, align: 'center' });
    }
    return slide;
  },

  /** Standard closing slide (navy bg, teal divider, centered text) */
  pptxClosingSlide: function(pptx, title, subtitle) {
    var C = this.colors; var P = this.pptx;
    var slide = pptx.addSlide();
    slide.background = { color: C.navy };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 2.6, w: '100%', h: P.thinBarHeight, fill: { color: C.teal } });
    slide.addText(title || '', { x: 0.6, y: 1.8, w: 8.8, h: 1.0, fontSize: P.titleFontSize, bold: true, color: C.white, fontFace: this.fonts.secondary, align: 'center' });
    if (subtitle) {
      slide.addText(subtitle, { x: 0.6, y: 3.0, w: 8.8, h: 0.5, fontSize: P.subtitleFontSize - 2, color: C.teal, fontFace: this.fonts.secondary, align: 'center' });
    }
    return slide;
  },

  /** Standard content slide with teal accent bar header and slide number */
  pptxContentSlide: function(pptx, slideTitle) {
    var C = this.colors; var P = this.pptx;
    var slide = pptx.addSlide();
    slide.background = { color: C.white };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: P.accentBarHeight, fill: { color: C.teal } });
    if (slideTitle) {
      slide.addText(slideTitle, { x: 0.4, y: 0.05, w: P.contentWidth, h: P.accentBarHeight - 0.1, fontSize: P.slideTitleSize, color: C.white, bold: true, fontFace: this.fonts.secondary });
    }
    slide.slideNumber = { x: P.slideNumX, y: P.slideNumY, fontSize: P.smallFontSize, color: C.gray };
    return slide;
  },

  /** Add a section label to a slide (14pt crimson bold) */
  pptxSectionLabel: function(slide, text, x, y, w) {
    var C = this.colors; var P = this.pptx;
    slide.addText(text, {
      x: x || P.margin, y: y, w: w || P.contentWidth,
      h: 0.35, fontSize: P.sectionLabelSize, color: C.crimson, bold: true, fontFace: this.fonts.secondary
    });
  },

  /** Add body text to a slide (11pt dark gray, shrink-to-fit) */
  pptxBodyText: function(slide, text, x, y, w, h) {
    var C = this.colors; var P = this.pptx;
    slide.addText(text || 'Not specified', {
      x: x || P.margin, y: y, w: w || P.contentWidth, h: h || 1.5,
      fontSize: P.bodyFontSize, color: C.darkGray, fontFace: this.fonts.secondary,
      valign: 'top', wrap: true, fit: 'shrink', margin: [4, 4, 4, 4]
    });
  },

  /** Add a sub-label (e.g., "Response:", "Notes:") to a slide (12pt teal bold) */
  pptxSubLabel: function(slide, text, x, y, w) {
    var P = this.pptx;
    slide.addText(text, {
      x: x || P.margin, y: y, w: w || P.contentWidth,
      h: 0.3, fontSize: P.subLabelSize, color: this.colors.teal, bold: true, fontFace: this.fonts.secondary
    });
  },

  /**
   * Standard 2-column content layout helper.
   * fields: [{ label, value, h? }, ...]  — renders in pairs (left, right).
   * Returns the final y position for further content.
   */
  pptxTwoColumnLayout: function(slide, startY, fields) {
    var S = this; var P = S.pptx;
    var y = startY;
    for (var i = 0; i < fields.length; i += 2) {
      var left = fields[i];
      var right = fields[i + 1];
      var rowH = left.h || 1.5;
      // Left column
      S.pptxSectionLabel(slide, left.label, P.margin, y, P.halfWidth);
      S.pptxBodyText(slide, left.value, P.margin, y + 0.38, P.halfWidth, rowH);
      // Right column
      if (right) {
        S.pptxSectionLabel(slide, right.label, P.rightColumnX, y, P.halfWidth);
        S.pptxBodyText(slide, right.value, P.rightColumnX, y + 0.38, P.halfWidth, rowH);
      }
      y += rowH + 0.55;
    }
    return y;
  },

  /** Full PPTX generation from config (section-based with auto-pagination) */
  buildPPTX: function(filename, config) {
    var pptx = this.createPres((config.entityName || '') + ' \u2014 ' + config.title, config.author);
    if (!pptx) return;
    var S = this; var P = S.pptx; var C = S.colors;
    // Title slide
    S.pptxTitleSlide(pptx, config.entityName || config.title, config.title !== config.entityName ? config.title : null, config.subtitle);
    // Content slides — group sections
    var sections = config.sections || [];
    var perSlide = config.perSlide || 3;
    for (var i = 0; i < sections.length; i += perSlide) {
      var slide = S.pptxContentSlide(pptx, null);
      var batch = sections.slice(i, i + perSlide);
      var sH = batch.length <= 2 ? 2.0 : 1.35;
      var yP = 0.25;
      for (var j = 0; j < batch.length; j++) {
        var sec = batch[j];
        slide.addText(sec.heading, { x: P.margin, y: yP, w: P.contentWidth, h: 0.4, fontSize: 16, bold: true, color: sec.color || C.navy, fontFace: S.fonts.secondary });
        yP += 0.45;
        var txt = Array.isArray(sec.content) ? sec.content.join('\n') : (sec.content || 'Not specified');
        slide.addText(txt, { x: P.margin, y: yP, w: P.contentWidth, h: sH, fontSize: P.subLabelSize, color: C.darkGray, fontFace: S.fonts.secondary, valign: 'top', wrap: true, fit: 'shrink', margin: [4, 4, 4, 4] });
        yP += sH + 0.15;
      }
    }
    // Closing slide
    S.pptxClosingSlide(pptx, config.entityName || config.title, config.title);
    return pptx.writeFile({ fileName: filename + '.pptx' });
  }
};

// Make DocStyles globally available
if (typeof window !== 'undefined') { window.DocStyles = DocStyles; }


// ============================================================
// DocGenerator — Main document generation interface
// ============================================================
// Provides generateWord, generateExcel, generatePDF,
// generatePowerPoint for backward-compatible core delegation,
// plus _generateSectionsPPTX for section-based presentations.
// ============================================================
var DocGenerator = {
  /**
   * Generate a Word document (.docx) — core delegation method.
   * Automatically prepends a Title Page and Table of Contents.
   * Section headings use HeadingLevel so Word can build the TOC.
   * @param {string} filename - Output filename (without .docx extension)
   * @param {Object} config - {title, author, sections: [{heading, content}]}
   */
  generateWord: async function(filename, config) {
    try {
      if (!window.docx) {
        alert('Word document library is loading. Please try again in a moment.');
        return false;
      }

      var docxLib = window.docx.default || window.docx;
      var Document = docxLib.Document, Packer = docxLib.Packer, Paragraph = docxLib.Paragraph, TextRun = docxLib.TextRun;
      var HL = docxLib.HeadingLevel;

      if (!Document || !Packer || !Paragraph) {
        alert('Word document library failed to initialize properly.');
        return false;
      }
      var DS = DocStyles;

      // Build all content paragraphs merged into one continuous section
      var contentChildren = [];
      config.sections.forEach(function(section) {
        // Section heading — with HeadingLevel for TOC discovery
        contentChildren.push(new Paragraph({
          children: [new TextRun({ text: section.heading, bold: true, size: DS.docx.sectionSize, color: DS.docx.sectionColor, font: DS.fonts.primary })],
          heading: HL ? HL.HEADING_1 : undefined,
          spacing: { before: DS.docx.spacing.beforeSection, after: DS.docx.spacing.afterSection }
        }));

        var content = Array.isArray(section.content) ? section.content : [section.content];
        content.forEach(function(item) {
          if (typeof item === 'string') {
            contentChildren.push(new Paragraph({
              children: [new TextRun({ text: item, size: DS.docx.bodySize, color: DS.docx.bodyColor, font: DS.fonts.primary })],
              spacing: { after: DS.docx.spacing.afterBody }
            }));
          } else if (typeof item === 'object') {
            if (item.type === 'heading') {
              contentChildren.push(new Paragraph({
                children: [new TextRun({ text: item.text, bold: true, size: DS.docx.subsectionSize, color: DS.docx.subtitleColor, font: DS.fonts.primary })],
                heading: HL ? HL.HEADING_2 : undefined,
                spacing: { before: 200, after: DS.docx.spacing.afterSmall }
              }));
            } else if (item.type === 'table') {
              contentChildren.push(item.data);
            }
          }
        });
      });

      // Assemble document sections: Title Page → TOC → Content
      var docSections = [
        { children: DS.docxTitlePageChildren(config.title, null, config.author) },
        { children: DS.docxTocChildren() },
        { children: contentChildren }
      ];

      var doc = new Document({
        creator: config.author || 'Generated from wasilzafar.com',
        title: config.title,
        features: { updateFields: true },
        styles: {
          default: {
            document: { run: { size: DS.docx.bodySize, font: DS.fonts.primary, color: DS.docx.bodyColor } },
            heading1: {
              run:       { size: DS.docx.sectionSize, bold: true, color: DS.docx.sectionColor, font: DS.fonts.primary },
              paragraph: { spacing: { before: DS.docx.spacing.beforeSection, after: DS.docx.spacing.afterSection } }
            },
            heading2: {
              run:       { size: DS.docx.subsectionSize, bold: true, color: DS.docx.subtitleColor, font: DS.fonts.primary },
              paragraph: { spacing: { before: 200, after: 120 } }
            },
            heading3: {
              run:       { size: DS.docx.bodySize, bold: true, color: DS.docx.titleColor, font: DS.fonts.primary },
              paragraph: { spacing: { before: 120, after: 100 } }
            }
          }
        },
        sections: docSections
      });

      var blob = await Packer.toBlob(doc);
      DocGenerator._downloadFile(blob, filename + '.docx');
      return true;
    } catch (error) {
      console.error('Error generating Word document:', error);
      return false;
    }
  },

  /**
   * Generate an Excel spreadsheet (.xlsx) — core delegation method
   * @param {string} filename - Output filename (without .xlsx extension)
   * @param {Object} config - {sheetName, headers?, data?, rows?}
   */
  generateExcel: function(filename, config) {
    try {
      if (!window.XLSX) {
        alert('Excel library is loading. Please try again.');
        return false;
      }

      var wsData = [];

      if (config.rows && config.rows.length > 0) {
        wsData.push.apply(wsData, config.rows);
      } else {
        if (config.headers && config.headers.length > 0) {
          wsData.push(config.headers);
        }
        if (config.data && config.data.length > 0) {
          wsData.push.apply(wsData, config.data);
        }
      }

      var ws = window.XLSX.utils.aoa_to_sheet(wsData);
      // Auto-calculate column widths
      ws['!cols'] = DocStyles.excelAutoWidths(wsData).map(function(w) { return { wch: w }; });
      var wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, config.sheetName || 'Sheet1');

      window.XLSX.writeFile(wb, filename + '.xlsx');
      return true;
    } catch (error) {
      console.error('Error generating Excel spreadsheet:', error);
      return false;
    }
  },

  /**
   * Generate a PowerPoint presentation (.pptx) — core delegation method
   * @param {string} filename - Output filename (without .pptx extension)
   * @param {Object} config - {title, slides: [{title, content}]}
   */
  generatePowerPoint: async function(filename, config) {
    try {
      var pres = DocStyles.createPres(config.title);
      if (!pres) return false;
      var P = DocStyles.pptx;

      // Title slide
      DocStyles.pptxTitleSlide(pres, config.title);

      // Content slides
      if (config.slides && config.slides.length > 0) {
        config.slides.forEach(function(slideConfig) {
          var slide = DocStyles.pptxContentSlide(pres, slideConfig.title);
          if (slideConfig.content) {
            var contentArray = Array.isArray(slideConfig.content) ? slideConfig.content : [slideConfig.content];
            var yPos = slideConfig.title ? P.accentBarHeight + 0.4 : P.margin;
            contentArray.forEach(function(item) {
              if (typeof item === 'string') {
                DocStyles.pptxBodyText(slide, item, P.margin, yPos, P.contentWidth, 0.5);
                yPos += 0.6;
              }
            });
          }
        });
      }

      pres.writeFile({ fileName: filename + '.pptx' });
      return true;
    } catch (error) {
      console.error('Error generating PowerPoint presentation:', error);
      return false;
    }
  },

  /**
   * Generate a PDF document — core delegation method
   * @param {string} filename - Output filename (without .pdf extension)
   * @param {Object} config - {title, sections?, lines?}
   */
  generatePDF: function(filename, config) {
    try {
      var pdf = DocStyles.createPDF();
      if (!pdf) return false;
      var DS = DocStyles;

      if (config.title) {
        DS.pdfTitle(pdf, config.title);
      }

      // Support both old API (sections) and new API (lines)
      if (config.lines && config.lines.length > 0) {
        var isFirstLine = true;
        config.lines.forEach(function(line) {
          var text = line.text;
          var fontSize = line.size || DS.pdf.bodySize;
          var isBold = !!line.bold;
          var isSpacer = (String(text).trim() === '');

          // Skip spacer lines — just add vertical gap
          if (isSpacer) { pdf._y += 4; return; }

          // Determine line role by size + bold + pattern
          var isSectionHeader = isBold && fontSize >= 14 && /^──/.test(text);
          var isSectionTitle = isBold && fontSize >= 14 && !isSectionHeader;
          var isDocTitle = isBold && fontSize >= 18 && isFirstLine;
          var isSubtitle = !isBold && fontSize >= 12 && fontSize <= 14;
          var isDateLine = fontSize <= 9 && /generated|date/i.test(text);
          var isSubItem = !isBold && fontSize <= 9;
          if (isFirstLine && (isDocTitle || (isBold && fontSize >= 16))) isFirstLine = false;
          else if (isFirstLine && !isDocTitle) isFirstLine = false;

          // Page break check before section headers
          if ((isSectionHeader || isSectionTitle) && pdf._y > pdf._pageH - DS.pdf.pageBreakMargin) {
            pdf.addPage(); pdf._y = DS.pdf.margin;
          }

          // Apply role-based formatting
          if (isDocTitle) {
            // Skip — already rendered by config.title above
            // But if config.title was not set, render as title
            if (!config.title) { DS.pdfTitle(pdf, text); }
            return;
          } else if (isSectionHeader) {
            // Section header with ── delimiters → teal divider line + crimson heading text
            var headerText = text.replace(/^──\s*/, '').replace(/\s*──$/, '');
            DS.pdfDivider(pdf);
            DS.pdfHeading(pdf, headerText);
          } else if (isSectionTitle) {
            // Section title without ── delimiters → crimson heading
            pdf._y += 2;
            DS.pdfHeading(pdf, text);
          } else if (isSubtitle) {
            DS.pdfSubtitle(pdf, text);
          } else if (isDateLine) {
            DS.pdfText(pdf, text, DS.pdf.smallSize, false, DS.rgb.gray);
            pdf._y += 4;
          } else if (isBold && fontSize >= 11) {
            // Bold sub-heading items (entity names, class names, etc.)
            DS.pdfSubheading(pdf, text);
          } else if (isSubItem) {
            // Detail / sub-item lines → indented gray
            var color = line.color ? DS.rgb[line.color] || DS.rgb.gray : DS.rgb.gray;
            DS.pdfText(pdf, '  ' + text, fontSize, false, color);
            pdf._y += 1;
          } else {
            // Standard body line
            var bodyColor = isBold ? DS.rgb.blue : DS.rgb.darkGray;
            if (line.color && DS.rgb[line.color]) bodyColor = DS.rgb[line.color];
            DS.pdfText(pdf, text, fontSize, isBold, bodyColor);
            pdf._y += 2;
          }
        });
      } else if (config.sections && config.sections.length > 0) {
        config.sections.forEach(function(section) {
          if (pdf._y > pdf._pageH - DS.pdf.pageBreakMargin) {
            pdf.addPage();
            pdf._y = DS.pdf.margin;
          }
          DS.pdfHeading(pdf, section.heading);
          var content = Array.isArray(section.content) ? section.content : [section.content];
          content.forEach(function(item) {
            if (typeof item === 'string') {
              DS.pdfBody(pdf, item);
            }
          });
          pdf._y += 3;
        });
      }

      pdf.save(filename + '.pdf');
      return true;
    } catch (error) {
      console.error('Error generating PDF document:', error);
      return false;
    }
  },

  // ============================================================
  // PPTX Helper — Generic section-based PowerPoint generator
  // ============================================================
  _generateSectionsPPTX: async function(filename, config) {
    return DocStyles.buildPPTX(filename, config);
  },


  /**
   * Internal helper to download file
   * @private
   */
  _downloadFile: function(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};


// ============================================================
// DynamicGroupManager — Repeatable field group add/remove
// ============================================================
// Creates a container with add/remove controls for repeatable
// form field groups. Each entry is a set of fields rendered
// from a template function.  Collected as an array of objects.
//
// Usage:
//   var entityMgr = new DynamicGroupManager({
//     containerId: 'dbEntitiesContainer',
//     groupLabel: 'Entity',
//     icon: 'fa-table',
//     maxEntries: 20,
//     fields: [
//       { key: 'name', label: 'Entity / Table Name *', type: 'input', placeholder: 'e.g., Users' },
//       { key: 'columns', label: 'Columns / Fields', type: 'textarea', rows: 3, placeholder: 'id (PK), name, email' },
//       { key: 'accessPatterns', label: 'Access Patterns', type: 'textarea', rows: 2, placeholder: 'Get by ID (indexed)' }
//     ],
//     minEntries: 1
//   });
//   entityMgr.init();                // render initial entry
//   entityMgr.collectAll();          // returns [{name:'Users', columns:'...', ...}, ...]
//   entityMgr.saveToStorage(key);    // persist to localStorage
//   entityMgr.restoreFromStorage(key); // restore from localStorage

var DynamicGroupManager = function(config) {
  this.containerId = config.containerId;
  this.groupLabel = config.groupLabel || 'Item';
  this.icon = config.icon || 'fa-plus';
  this.maxEntries = config.maxEntries || 20;
  this.minEntries = config.minEntries || 1;
  this.fields = config.fields || [];
  this.entryCount = 0;
  this.prefix = config.containerId + '_';
};

DynamicGroupManager.prototype = {
  // Initialize: render header + initial entries
  init: function(initialCount) {
    var container = document.getElementById(this.containerId);
    if (!container) return;
    var count = initialCount || this.minEntries;
    // Render header with add button
    var header = document.createElement('div');
    header.className = 'dynamic-group-header';
    header.innerHTML = '<h5><i class="fas ' + this.icon + ' me-2"></i>' + this.groupLabel + 's</h5>' +
      '<button type="button" class="btn-add-group" data-mgr-id="' + this.containerId + '">' +
      '<i class="fas fa-plus"></i> Add ' + this.groupLabel + '</button>';
    container.appendChild(header);
    // Entry list container
    var list = document.createElement('div');
    list.id = this.prefix + 'list';
    container.appendChild(list);
    // Bind add button
    var self = this;
    header.querySelector('.btn-add-group').addEventListener('click', function() { self.addEntry(); });
    // Add initial entries
    for (var i = 0; i < count; i++) this.addEntry();
  },

  // Add a new entry to the group
  addEntry: function(values) {
    if (this.entryCount >= this.maxEntries) {
      alert('Maximum ' + this.maxEntries + ' ' + this.groupLabel.toLowerCase() + 's allowed.');
      return null;
    }
    this.entryCount++;
    var idx = this.entryCount;
    var list = document.getElementById(this.prefix + 'list');
    if (!list) return null;
    var entry = document.createElement('div');
    entry.className = 'dynamic-group-entry';
    entry.setAttribute('data-entry-idx', idx);
    // Build header
    var headerHtml = '<div class="dynamic-group-entry-header">' +
      '<span class="entry-label"><i class="fas ' + this.icon + ' me-1"></i>' + this.groupLabel + ' #' + idx + '</span>';
    if (this.entryCount > this.minEntries) {
      headerHtml += '<button type="button" class="btn-remove-entry" data-idx="' + idx + '">' +
        '<i class="fas fa-times"></i> Remove</button>';
    }
    headerHtml += '</div>';
    // Build fields
    var fieldsHtml = '<div class="form-row">';
    var self = this;
    this.fields.forEach(function(f, fi) {
      var fieldId = self.prefix + 'e' + idx + '_' + f.key;
      var val = (values && values[f.key]) ? values[f.key] : '';
      var escapedVal = val.replace(/"/g, '&quot;');
      fieldsHtml += '<div class="form-group">';
      fieldsHtml += '<label for="' + fieldId + '">' + f.label + '</label>';
      if (f.type === 'textarea') {
        fieldsHtml += '<textarea id="' + fieldId + '" rows="' + (f.rows || 3) + '" placeholder="' + (f.placeholder || '') + '">' + val + '</textarea>';
      } else if (f.type === 'select') {
        fieldsHtml += '<select id="' + fieldId + '">';
        (f.options || []).forEach(function(opt) {
          var sel = (val === opt.value) ? ' selected' : '';
          fieldsHtml += '<option value="' + opt.value + '"' + sel + '>' + opt.label + '</option>';
        });
        fieldsHtml += '</select>';
      } else {
        fieldsHtml += '<input type="text" id="' + fieldId + '" value="' + escapedVal + '" placeholder="' + (f.placeholder || '') + '">';
      }
      fieldsHtml += '</div>';
      // Close form-row every 2 fields and open new one (except last)
      if ((fi + 1) % 2 === 0 && fi < self.fields.length - 1) {
        fieldsHtml += '</div><div class="form-row">';
      }
    });
    fieldsHtml += '</div>';
    entry.innerHTML = headerHtml + fieldsHtml;
    list.appendChild(entry);
    // Bind remove button
    var removeBtn = entry.querySelector('.btn-remove-entry');
    if (removeBtn) {
      removeBtn.addEventListener('click', function() { self.removeEntry(entry); });
    }
    return entry;
  },

  // Remove an entry, re-number remaining
  removeEntry: function(entryEl) {
    var list = document.getElementById(this.prefix + 'list');
    if (!list) return;
    var entries = list.querySelectorAll('.dynamic-group-entry');
    if (entries.length <= this.minEntries) {
      alert('At least ' + this.minEntries + ' ' + this.groupLabel.toLowerCase() + ' is required.');
      return;
    }
    entryEl.remove();
    this.entryCount = 0;
    // Re-number remaining entries
    var self = this;
    var remaining = list.querySelectorAll('.dynamic-group-entry');
    remaining.forEach(function(el, i) {
      self.entryCount = i + 1;
      var label = el.querySelector('.entry-label');
      if (label) label.innerHTML = '<i class="fas ' + self.icon + ' me-1"></i>' + self.groupLabel + ' #' + (i + 1);
      // Add remove button if missing and count > min
      if (!el.querySelector('.btn-remove-entry') && remaining.length > self.minEntries) {
        var header = el.querySelector('.dynamic-group-entry-header');
        if (header) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn-remove-entry';
          btn.innerHTML = '<i class="fas fa-times"></i> Remove';
          btn.addEventListener('click', function() { self.removeEntry(el); });
          header.appendChild(btn);
        }
      }
      // Remove the remove button if at minEntries
      if (remaining.length <= self.minEntries) {
        var rmBtn = el.querySelector('.btn-remove-entry');
        if (rmBtn) rmBtn.remove();
      }
    });
  },

  // Collect all entries as array of objects
  collectAll: function() {
    var list = document.getElementById(this.prefix + 'list');
    if (!list) return [];
    var entries = list.querySelectorAll('.dynamic-group-entry');
    var result = [];
    var self = this;
    entries.forEach(function(el, i) {
      var obj = {};
      self.fields.forEach(function(f) {
        var fieldId = self.prefix + 'e' + el.getAttribute('data-entry-idx') + '_' + f.key;
        var field = document.getElementById(fieldId);
        obj[f.key] = field ? field.value : '';
      });
      result.push(obj);
    });
    return result;
  },

  // Check if at least one entry has a required field filled
  hasRequiredFilled: function(requiredKey) {
    var all = this.collectAll();
    return all.some(function(entry) { return entry[requiredKey] && entry[requiredKey].trim() !== ''; });
  },

  // Save to localStorage
  saveToStorage: function(storageKey) {
    var data = this.collectAll();
    localStorage.setItem(storageKey, JSON.stringify(data));
  },

  // Restore from localStorage
  restoreFromStorage: function(storageKey) {
    var saved = localStorage.getItem(storageKey);
    if (!saved) return false;
    try {
      var data = JSON.parse(saved);
      if (!Array.isArray(data) || data.length === 0) return false;
      // Clear existing entries and rebuild
      var list = document.getElementById(this.prefix + 'list');
      if (list) list.innerHTML = '';
      this.entryCount = 0;
      var self = this;
      data.forEach(function(values) { self.addEntry(values); });
      return true;
    } catch (e) {
      console.warn('DynamicGroupManager: restore failed for', storageKey, e);
      return false;
    }
  },

  // Clear all entries and reset to initial state
  reset: function(storageKey) {
    if (storageKey) localStorage.removeItem(storageKey);
    var list = document.getElementById(this.prefix + 'list');
    if (list) list.innerHTML = '';
    this.entryCount = 0;
    for (var i = 0; i < this.minEntries; i++) this.addEntry();
  },

  // Attach auto-save on input events (debounced)
  attachAutoSave: function(storageKey, delay) {
    var container = document.getElementById(this.containerId);
    if (!container) return;
    var self = this;
    var timer;
    container.addEventListener('input', function() {
      clearTimeout(timer);
      timer = setTimeout(function() { self.saveToStorage(storageKey); }, delay || 500);
    });
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
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-]/g, '')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '')
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
  module.exports = { DocGenerator: DocGenerator, DocStyles: DocStyles, FormPersistence: FormPersistence, CanvasFormHandler: CanvasFormHandler };
}
// Ensure global availability in browser
if (typeof window !== 'undefined') {
  window.DocGenerator = DocGenerator;
  window.DocStyles = DocStyles;
  window.FormPersistence = FormPersistence;
  window.CanvasFormHandler = CanvasFormHandler;
  window.DynamicGroupManager = DynamicGroupManager;
}
