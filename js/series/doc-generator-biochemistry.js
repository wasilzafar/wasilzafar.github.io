/**
 * Doc Generator - Biochemistry Series
 * Extends DocGenerator with biochemistry series document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * Generators:
 *  1. BiologicalChemistry     — Biological chemistry fundamentals worksheet
 *  2. WaterPhBuffers          — Water, pH & biological buffers worksheet
 *  3. ProteinStructure        — Protein structure & function worksheet
 *  4. EnzymeCatalysis         — Enzyme catalysis & kinetics worksheet
 *  5. CarbohydrateLipid       — Carbohydrate & lipid analysis worksheet
 *  6. MetabolismBioenergetics — Metabolism & bioenergetics pathway worksheet
 *  7. OxPhosAnalysis          — Oxidative phosphorylation analysis worksheet
 *  8. SignalTransduction      — Signal transduction pathway worksheet
 *  9. GeneExpression          — Gene expression & regulation worksheet
 * 10. NeuroBiochem            — Neurochemistry analysis worksheet
 * 11. HeartMuscle             — Heart & muscle biochemistry worksheet
 * 12. LiverBiochem            — Liver metabolic center worksheet
 * 13. KidneyBiochem           — Kidney & acid-base control worksheet
 * 14. EndocrineBiochem        — Endocrine system biochemistry worksheet
 * 15. DigestiveBiochem        — Digestive system biochemistry worksheet
 * 16. ImmuneBiochem           — Immune system biochemistry worksheet
 * 17. AdiposeBiochem          — Adipose tissue & energy balance worksheet
 * 18. TissueMetabolism        — Tissue-specific metabolism worksheet
 * 19. DiseaseBiochem          — Molecular basis of disease worksheet
 * 20. ClinicalDiagnostics     — Clinical diagnostics & biomarkers worksheet
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. BIOLOGICAL CHEMISTRY FUNDAMENTALS
  // ============================================================

  generateBiologicalChemistryWord: async function(filename, data) {
    var sections = [
      { heading: 'Biological Chemistry Fundamentals', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Molecule: ' + (data.molecule || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Molecular Identity', content: [
          'Molecular Formula: ' + (data.molecularFormula || 'N/A'),
          'Molecular Weight: ' + (data.molecularWeight || 'N/A'),
          'Polarity: ' + (data.polarity || 'N/A'),
          'Geometry: ' + (data.geometry || 'N/A')
      ]},
      { heading: 'Chemical Bonds & Functional Groups', content: [
          'Bond Types: ' + (data.bondTypes || 'N/A'),
          'Functional Groups: ' + (data.functionalGroups || 'N/A')
      ]},
      { heading: 'Thermodynamics & Energetics', content: (data.thermodynamics || 'Not specified').split('\n') },
      { heading: 'Biological Role', content: (data.biologicalRole || 'Not specified').split('\n') },
      { heading: 'Clinical Notes', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Biological Chemistry — ' + (data.molecule || ''), author: data.studentName || '', sections: sections });
  },

  generateBiologicalChemistryExcel: function(filename, data) {
    var rows = [
      ['Biological Chemistry Fundamentals'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['STUDENT INFORMATION'],
      ['Student Name', data.studentName || ''],
      ['Molecule', data.molecule || ''],
      [],
      ['MOLECULAR IDENTITY'],
      ['Molecular Formula', data.molecularFormula || ''],
      ['Molecular Weight', data.molecularWeight || ''],
      ['Polarity', data.polarity || ''],
      ['Geometry', data.geometry || ''],
      [],
      ['CHEMICAL BONDS & FUNCTIONAL GROUPS'],
      ['Bond Types', data.bondTypes || ''],
      ['Functional Groups', data.functionalGroups || ''],
      [],
      ['THERMODYNAMICS'],
      [data.thermodynamics || 'Not specified'],
      [],
      ['BIOLOGICAL ROLE'],
      [data.biologicalRole || 'Not specified'],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || 'Not specified'],
      [],
      ['ADDITIONAL NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Biological Chemistry', rows: rows });
  },

  generateBiologicalChemistryPDF: function(filename, data) {
    var lines = [
      { text: 'BIOLOGICAL CHEMISTRY FUNDAMENTALS', size: 18, bold: true },
      { text: (data.molecule || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── MOLECULAR IDENTITY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Formula: ' + (data.molecularFormula || 'N/A'), size: 10 },
      { text: 'Weight: ' + (data.molecularWeight || 'N/A'), size: 10 },
      { text: 'Polarity: ' + (data.polarity || 'N/A'), size: 10 },
      { text: 'Geometry: ' + (data.geometry || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── BONDS & FUNCTIONAL GROUPS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Bond Types: ' + (data.bondTypes || 'N/A'), size: 10 },
      { text: 'Functional Groups: ' + (data.functionalGroups || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── THERMODYNAMICS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.thermodynamics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BIOLOGICAL ROLE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.biologicalRole || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── ADDITIONAL NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Biological Chemistry Fundamentals', lines: lines });
  },

  // ============================================================
  // 2. WATER, pH & BIOLOGICAL BUFFERS
  // ============================================================

  generateWaterPhBuffersWord: async function(filename, data) {
    var sections = [
      { heading: 'Water, pH & Biological Buffers', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Date: ' + (data.date || new Date().toLocaleDateString())
      ]},
      { heading: 'Water Properties & Polarity', content: (data.waterPolarity || 'Not specified').split('\n') },
      { heading: 'Hydrogen Bonding', content: (data.hydrogenBonds || 'Not specified').split('\n') },
      { heading: 'Solvent Classifications', content: (data.solventTypes || 'Not specified').split('\n') },
      { heading: 'pH Calculations', content: (data.phCalc || 'Not specified').split('\n') },
      { heading: 'Henderson-Hasselbalch Equation', content: (data.hendersonHasselbalch || 'Not specified').split('\n') },
      { heading: 'Biological Buffer Systems', content: (data.bufferSystems || 'Not specified').split('\n') },
      { heading: 'ABG Interpretation', content: (data.abgInterpretation || 'Not specified').split('\n') },
      { heading: 'Clinical Connections', content: (data.clinicalConnections || 'Not specified').split('\n') }
    ];
    if (data.keyTakeaways) sections.push({ heading: 'Key Takeaways', content: data.keyTakeaways.split('\n') });
    return this.generateWord(filename, { title: 'Water, pH & Biological Buffers', author: data.studentName || '', sections: sections });
  },

  generateWaterPhBuffersExcel: function(filename, data) {
    var rows = [
      ['Water, pH & Biological Buffers'],
      ['Student', data.studentName || ''],
      ['Date', data.date || new Date().toLocaleDateString()],
      [],
      ['WATER PROPERTIES & POLARITY'],
      [data.waterPolarity || 'Not specified'],
      [],
      ['HYDROGEN BONDING'],
      [data.hydrogenBonds || 'Not specified'],
      [],
      ['SOLVENT CLASSIFICATIONS'],
      [data.solventTypes || 'Not specified'],
      [],
      ['pH CALCULATIONS'],
      [data.phCalc || 'Not specified'],
      [],
      ['HENDERSON-HASSELBALCH EQUATION'],
      [data.hendersonHasselbalch || 'Not specified'],
      [],
      ['BIOLOGICAL BUFFER SYSTEMS'],
      [data.bufferSystems || 'Not specified'],
      [],
      ['ABG INTERPRETATION'],
      [data.abgInterpretation || 'Not specified'],
      [],
      ['CLINICAL CONNECTIONS'],
      [data.clinicalConnections || 'Not specified'],
      [],
      ['KEY TAKEAWAYS'],
      [data.keyTakeaways || 'None']
    ];
    return this.generateExcel(filename, { title: 'Water pH Buffers', rows: rows });
  },

  generateWaterPhBuffersPDF: function(filename, data) {
    var lines = [
      { text: 'WATER, pH & BIOLOGICAL BUFFERS', size: 18, bold: true },
      { text: 'Student: ' + (data.studentName || 'N/A'), size: 12 },
      { text: 'Date: ' + (data.date || new Date().toLocaleDateString()), size: 9 },
      { text: ' ', size: 6 },
      { text: '── WATER PROPERTIES & POLARITY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.waterPolarity || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HYDROGEN BONDING ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.hydrogenBonds || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SOLVENT CLASSIFICATIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.solventTypes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── pH CALCULATIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.phCalc || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HENDERSON-HASSELBALCH ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.hendersonHasselbalch || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BUFFER SYSTEMS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.bufferSystems || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ABG INTERPRETATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.abgInterpretation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CONNECTIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalConnections || 'Not specified', size: 10 }
    ];
    if (data.keyTakeaways) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── KEY TAKEAWAYS ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.keyTakeaways, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Water, pH & Biological Buffers', lines: lines });
  },

  // ============================================================
  // 3. PROTEIN STRUCTURE & FUNCTION
  // ============================================================

  generateProteinStructureWord: async function(filename, data) {
    var sections = [
      { heading: 'Protein Structure & Function Worksheet', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Protein: ' + (data.proteinName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Amino Acid Sequence', content: (data.sequence || 'Not specified').split('\n') },
      { heading: 'Subunit Composition', content: (data.subunits || 'Not specified').split('\n') },
      { heading: 'Secondary Structure', content: (data.secondaryStructure || 'Not specified').split('\n') },
      { heading: 'Tertiary Features', content: (data.tertiaryFeatures || 'Not specified').split('\n') },
      { heading: 'Folding Requirements', content: (data.foldingReqs || 'Not specified').split('\n') },
      { heading: 'Post-Translational Modifications', content: (data.ptms || 'Not specified').split('\n') },
      { heading: 'Misfolding & Disease', content: (data.misfolding || 'Not specified').split('\n') },
      { heading: 'Clinical Relevance', content: (data.clinicalRelevance || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Protein Structure — ' + (data.proteinName || ''), author: data.studentName || '', sections: sections });
  },

  generateProteinStructureExcel: function(filename, data) {
    var rows = [
      ['Protein Structure & Function Worksheet'],
      ['Student', data.studentName || ''],
      ['Protein', data.proteinName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['AMINO ACID SEQUENCE'],
      [data.sequence || 'Not specified'],
      [],
      ['SUBUNIT COMPOSITION'],
      [data.subunits || 'Not specified'],
      [],
      ['SECONDARY STRUCTURE'],
      [data.secondaryStructure || 'Not specified'],
      [],
      ['TERTIARY FEATURES'],
      [data.tertiaryFeatures || 'Not specified'],
      [],
      ['FOLDING REQUIREMENTS'],
      [data.foldingReqs || 'Not specified'],
      [],
      ['POST-TRANSLATIONAL MODIFICATIONS'],
      [data.ptms || 'Not specified'],
      [],
      ['MISFOLDING & DISEASE'],
      [data.misfolding || 'Not specified'],
      [],
      ['CLINICAL RELEVANCE'],
      [data.clinicalRelevance || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Protein Structure', rows: rows });
  },

  generateProteinStructurePDF: function(filename, data) {
    var lines = [
      { text: 'PROTEIN STRUCTURE & FUNCTION', size: 18, bold: true },
      { text: (data.proteinName || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── AMINO ACID SEQUENCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.sequence || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SUBUNIT COMPOSITION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.subunits || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SECONDARY STRUCTURE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.secondaryStructure || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TERTIARY FEATURES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.tertiaryFeatures || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FOLDING REQUIREMENTS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.foldingReqs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── POST-TRANSLATIONAL MODIFICATIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.ptms || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MISFOLDING & DISEASE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.misfolding || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL RELEVANCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalRelevance || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Protein Structure & Function', lines: lines });
  },

  // ============================================================
  // 4. ENZYME CATALYSIS & KINETICS
  // ============================================================

  generateEnzymeCatalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Enzyme Catalysis & Kinetics', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Enzyme: ' + (data.enzymeName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Substrate & Product', content: [
          'Substrate: ' + (data.substrate || 'N/A'),
          'Product: ' + (data.product || 'N/A')
      ]},
      { heading: 'Classification', content: (data.classification || 'Not specified').split('\n') },
      { heading: 'Cofactors & Coenzymes', content: (data.cofactors || 'Not specified').split('\n') },
      { heading: 'Kinetics (Km, Vmax, kcat)', content: (data.kinetics || 'Not specified').split('\n') },
      { heading: 'Catalytic Mechanism', content: (data.mechanism || 'Not specified').split('\n') },
      { heading: 'Inhibitors', content: (data.inhibitors || 'Not specified').split('\n') },
      { heading: 'Regulation', content: (data.regulation || 'Not specified').split('\n') },
      { heading: 'Clinical Applications', content: (data.clinical || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Enzyme Catalysis — ' + (data.enzymeName || ''), author: data.studentName || '', sections: sections });
  },

  generateEnzymeCatalysisExcel: function(filename, data) {
    var rows = [
      ['Enzyme Catalysis & Kinetics'],
      ['Student', data.studentName || ''],
      ['Enzyme', data.enzymeName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['SUBSTRATE & PRODUCT'],
      ['Substrate', data.substrate || ''],
      ['Product', data.product || ''],
      [],
      ['CLASSIFICATION'],
      [data.classification || 'Not specified'],
      [],
      ['COFACTORS & COENZYMES'],
      [data.cofactors || 'Not specified'],
      [],
      ['KINETICS (Km, Vmax, kcat)'],
      [data.kinetics || 'Not specified'],
      [],
      ['CATALYTIC MECHANISM'],
      [data.mechanism || 'Not specified'],
      [],
      ['INHIBITORS'],
      [data.inhibitors || 'Not specified'],
      [],
      ['REGULATION'],
      [data.regulation || 'Not specified'],
      [],
      ['CLINICAL APPLICATIONS'],
      [data.clinical || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Enzyme Catalysis', rows: rows });
  },

  generateEnzymeCatalysisPDF: function(filename, data) {
    var lines = [
      { text: 'ENZYME CATALYSIS & KINETICS', size: 18, bold: true },
      { text: (data.enzymeName || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SUBSTRATE & PRODUCT ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Substrate: ' + (data.substrate || 'N/A'), size: 10 },
      { text: 'Product: ' + (data.product || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLASSIFICATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.classification || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COFACTORS & COENZYMES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.cofactors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KINETICS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.kinetics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CATALYTIC MECHANISM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.mechanism || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INHIBITORS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.inhibitors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REGULATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.regulation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL APPLICATIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Enzyme Catalysis & Kinetics', lines: lines });
  },

  // ============================================================
  // 5. CARBOHYDRATES & LIPIDS
  // ============================================================

  generateCarbohydrateLipidWord: async function(filename, data) {
    var sections = [
      { heading: 'Carbohydrate & Lipid Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Molecule: ' + (data.moleculeName || 'N/A'),
          'Type: ' + (data.moleculeType || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Molecular Formula & Structure', content: [
          'Formula: ' + (data.formula || 'N/A'),
          'Structure: ' + (data.structure || 'N/A')
      ]},
      { heading: 'Biological Function', content: (data.biologicalFunction || 'Not specified').split('\n') },
      { heading: 'Metabolism', content: (data.metabolism || 'Not specified').split('\n') },
      { heading: 'Clinical Relevance', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Carbohydrate & Lipid — ' + (data.moleculeName || ''), author: data.studentName || '', sections: sections });
  },

  generateCarbohydrateLipidExcel: function(filename, data) {
    var rows = [
      ['Carbohydrate & Lipid Analysis'],
      ['Student', data.studentName || ''],
      ['Molecule', data.moleculeName || ''],
      ['Type', data.moleculeType || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['MOLECULAR DETAILS'],
      ['Formula', data.formula || ''],
      ['Structure', data.structure || ''],
      [],
      ['BIOLOGICAL FUNCTION'],
      [data.biologicalFunction || 'Not specified'],
      [],
      ['METABOLISM'],
      [data.metabolism || 'Not specified'],
      [],
      ['CLINICAL RELEVANCE'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Carbohydrate Lipid', rows: rows });
  },

  generateCarbohydrateLipidPDF: function(filename, data) {
    var lines = [
      { text: 'CARBOHYDRATE & LIPID ANALYSIS', size: 18, bold: true },
      { text: (data.moleculeName || '') + ' (' + (data.moleculeType || '') + ')', size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── MOLECULAR DETAILS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Formula: ' + (data.formula || 'N/A'), size: 10 },
      { text: 'Structure: ' + (data.structure || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── BIOLOGICAL FUNCTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.biologicalFunction || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── METABOLISM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.metabolism || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL RELEVANCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Carbohydrate & Lipid Analysis', lines: lines });
  },

  // ============================================================
  // 6. METABOLISM & BIOENERGETICS
  // ============================================================

  generateMetabolismBioenergeticsWord: async function(filename, data) {
    var sections = [
      { heading: 'Metabolism & Bioenergetics Pathway', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Pathway: ' + (data.pathwayName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Cellular Location', content: (data.location || 'Not specified').split('\n') },
      { heading: 'Substrate & Product', content: [
          'Substrate: ' + (data.substrate || 'N/A'),
          'Product: ' + (data.product || 'N/A')
      ]},
      { heading: 'Energetics (ΔG, ATP Yield)', content: (data.energetics || 'Not specified').split('\n') },
      { heading: 'Key Enzymes', content: (data.keyEnzymes || 'Not specified').split('\n') },
      { heading: 'Regulation', content: (data.regulation || 'Not specified').split('\n') },
      { heading: 'Clinical Significance', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Metabolism — ' + (data.pathwayName || ''), author: data.studentName || '', sections: sections });
  },

  generateMetabolismBioenergeticsExcel: function(filename, data) {
    var rows = [
      ['Metabolism & Bioenergetics Pathway'],
      ['Student', data.studentName || ''],
      ['Pathway', data.pathwayName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['CELLULAR LOCATION'],
      [data.location || 'Not specified'],
      [],
      ['SUBSTRATE & PRODUCT'],
      ['Substrate', data.substrate || ''],
      ['Product', data.product || ''],
      [],
      ['ENERGETICS (ΔG, ATP Yield)'],
      [data.energetics || 'Not specified'],
      [],
      ['KEY ENZYMES'],
      [data.keyEnzymes || 'Not specified'],
      [],
      ['REGULATION'],
      [data.regulation || 'Not specified'],
      [],
      ['CLINICAL SIGNIFICANCE'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Metabolism Bioenergetics', rows: rows });
  },

  generateMetabolismBioenergeticsPDF: function(filename, data) {
    var lines = [
      { text: 'METABOLISM & BIOENERGETICS', size: 18, bold: true },
      { text: 'Pathway: ' + (data.pathwayName || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CELLULAR LOCATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.location || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SUBSTRATE & PRODUCT ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Substrate: ' + (data.substrate || 'N/A'), size: 10 },
      { text: 'Product: ' + (data.product || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── ENERGETICS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.energetics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY ENZYMES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.keyEnzymes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REGULATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.regulation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL SIGNIFICANCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Metabolism & Bioenergetics', lines: lines });
  },

  // ============================================================
  // 7. OXIDATIVE PHOSPHORYLATION ANALYSIS
  // ============================================================

  generateOxPhosAnalysisWord: async function(filename, data) {
    var sections = [
      { heading: 'Oxidative Phosphorylation Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'ETC Complex Details', content: [
          'Complex: ' + (data.complex || 'N/A'),
          'Function: ' + (data.function || 'N/A')
      ]},
      { heading: 'Proton Pumping & Gradient', content: (data.protonPumping || 'Not specified').split('\n') },
      { heading: 'Prosthetic Groups', content: (data.prosthetic || 'Not specified').split('\n') },
      { heading: 'Inhibitors & Uncouplers', content: (data.inhibitors || 'Not specified').split('\n') },
      { heading: 'Regulation', content: (data.regulation || 'Not specified').split('\n') },
      { heading: 'Clinical Connections', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'OxPhos Analysis — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateOxPhosAnalysisExcel: function(filename, data) {
    var rows = [
      ['Oxidative Phosphorylation Analysis'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['ETC COMPLEX DETAILS'],
      ['Complex', data.complex || ''],
      ['Function', data.function || ''],
      [],
      ['PROTON PUMPING & GRADIENT'],
      [data.protonPumping || 'Not specified'],
      [],
      ['PROSTHETIC GROUPS'],
      [data.prosthetic || 'Not specified'],
      [],
      ['INHIBITORS & UNCOUPLERS'],
      [data.inhibitors || 'Not specified'],
      [],
      ['REGULATION'],
      [data.regulation || 'Not specified'],
      [],
      ['CLINICAL CONNECTIONS'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'OxPhos Analysis', rows: rows });
  },

  generateOxPhosAnalysisPDF: function(filename, data) {
    var lines = [
      { text: 'OXIDATIVE PHOSPHORYLATION ANALYSIS', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ETC COMPLEX DETAILS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Complex: ' + (data.complex || 'N/A'), size: 10 },
      { text: 'Function: ' + (data.function || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROTON PUMPING & GRADIENT ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.protonPumping || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROSTHETIC GROUPS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.prosthetic || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INHIBITORS & UNCOUPLERS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.inhibitors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REGULATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.regulation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CONNECTIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Oxidative Phosphorylation Analysis', lines: lines });
  },

  // ============================================================
  // 8. SIGNAL TRANSDUCTION
  // ============================================================

  generateSignalTransductionWord: async function(filename, data) {
    var sections = [
      { heading: 'Signal Transduction Pathway', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Pathway: ' + (data.pathwayName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Ligand & Receptor', content: [
          'Ligand: ' + (data.ligand || 'N/A'),
          'Receptor Type: ' + (data.receptorType || 'N/A')
      ]},
      { heading: 'Second Messenger System', content: (data.secondMessenger || 'Not specified').split('\n') },
      { heading: 'Signalling Cascade Steps', content: (data.cascadeSteps || 'Not specified').split('\n') },
      { heading: 'Signal Termination', content: (data.termination || 'Not specified').split('\n') },
      { heading: 'Clinical Relevance', content: (data.clinical || 'Not specified').split('\n') },
      { heading: 'Drug Targets', content: (data.drugs || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Signal Transduction — ' + (data.pathwayName || ''), author: data.studentName || '', sections: sections });
  },

  generateSignalTransductionExcel: function(filename, data) {
    var rows = [
      ['Signal Transduction Pathway'],
      ['Student', data.studentName || ''],
      ['Pathway', data.pathwayName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['LIGAND & RECEPTOR'],
      ['Ligand', data.ligand || ''],
      ['Receptor Type', data.receptorType || ''],
      [],
      ['SECOND MESSENGER SYSTEM'],
      [data.secondMessenger || 'Not specified'],
      [],
      ['SIGNALLING CASCADE STEPS'],
      [data.cascadeSteps || 'Not specified'],
      [],
      ['SIGNAL TERMINATION'],
      [data.termination || 'Not specified'],
      [],
      ['CLINICAL RELEVANCE'],
      [data.clinical || 'Not specified'],
      [],
      ['DRUG TARGETS'],
      [data.drugs || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Signal Transduction', rows: rows });
  },

  generateSignalTransductionPDF: function(filename, data) {
    var lines = [
      { text: 'SIGNAL TRANSDUCTION PATHWAY', size: 18, bold: true },
      { text: 'Pathway: ' + (data.pathwayName || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── LIGAND & RECEPTOR ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Ligand: ' + (data.ligand || 'N/A'), size: 10 },
      { text: 'Receptor: ' + (data.receptorType || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── SECOND MESSENGER ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.secondMessenger || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SIGNALLING CASCADE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.cascadeSteps || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SIGNAL TERMINATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.termination || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL RELEVANCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DRUG TARGETS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.drugs || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Signal Transduction Pathway', lines: lines });
  },

  // ============================================================
  // 9. GENE EXPRESSION & REGULATION
  // ============================================================

  generateGeneExpressionWord: async function(filename, data) {
    var sections = [
      { heading: 'Gene Expression & Regulation', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Gene: ' + (data.geneName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'DNA Structure', content: (data.dnaStructure || 'Not specified').split('\n') },
      { heading: 'Replication', content: (data.replication || 'Not specified').split('\n') },
      { heading: 'Transcription', content: (data.transcription || 'Not specified').split('\n') },
      { heading: 'RNA Splicing & Processing', content: (data.splicing || 'Not specified').split('\n') },
      { heading: 'Translation', content: (data.translation || 'Not specified').split('\n') },
      { heading: 'Epigenetic Regulation', content: (data.epigenetics || 'Not specified').split('\n') },
      { heading: 'Clinical Relevance', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Gene Expression — ' + (data.geneName || ''), author: data.studentName || '', sections: sections });
  },

  generateGeneExpressionExcel: function(filename, data) {
    var rows = [
      ['Gene Expression & Regulation'],
      ['Student', data.studentName || ''],
      ['Gene', data.geneName || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['DNA STRUCTURE'],
      [data.dnaStructure || 'Not specified'],
      [],
      ['REPLICATION'],
      [data.replication || 'Not specified'],
      [],
      ['TRANSCRIPTION'],
      [data.transcription || 'Not specified'],
      [],
      ['RNA SPLICING & PROCESSING'],
      [data.splicing || 'Not specified'],
      [],
      ['TRANSLATION'],
      [data.translation || 'Not specified'],
      [],
      ['EPIGENETIC REGULATION'],
      [data.epigenetics || 'Not specified'],
      [],
      ['CLINICAL RELEVANCE'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Gene Expression', rows: rows });
  },

  generateGeneExpressionPDF: function(filename, data) {
    var lines = [
      { text: 'GENE EXPRESSION & REGULATION', size: 18, bold: true },
      { text: 'Gene: ' + (data.geneName || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DNA STRUCTURE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.dnaStructure || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REPLICATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.replication || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRANSCRIPTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.transcription || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RNA SPLICING ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.splicing || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRANSLATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.translation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EPIGENETIC REGULATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.epigenetics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL RELEVANCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Gene Expression & Regulation', lines: lines });
  },

  // ============================================================
  // 10. NEUROCHEMISTRY
  // ============================================================

  generateNeuroBiochemWord: async function(filename, data) {
    var sections = [
      { heading: 'Neurochemistry Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Neurotransmitter Profile', content: (data.neurotransmitter || 'Not specified').split('\n') },
      { heading: 'Metabolic Pathway', content: (data.pathway || 'Not specified').split('\n') },
      { heading: 'Receptor Types & Mechanisms', content: (data.receptors || 'Not specified').split('\n') },
      { heading: 'Signal Termination', content: (data.termination || 'Not specified').split('\n') },
      { heading: 'Associated Diseases', content: (data.disease || 'Not specified').split('\n') },
      { heading: 'Pharmacology', content: (data.pharmacology || 'Not specified').split('\n') },
      { heading: 'Blood-Brain Barrier', content: (data.bbb || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Neurochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateNeuroBiochemExcel: function(filename, data) {
    var rows = [
      ['Neurochemistry Analysis'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['NEUROTRANSMITTER PROFILE'],
      [data.neurotransmitter || 'Not specified'],
      [],
      ['METABOLIC PATHWAY'],
      [data.pathway || 'Not specified'],
      [],
      ['RECEPTOR TYPES & MECHANISMS'],
      [data.receptors || 'Not specified'],
      [],
      ['SIGNAL TERMINATION'],
      [data.termination || 'Not specified'],
      [],
      ['ASSOCIATED DISEASES'],
      [data.disease || 'Not specified'],
      [],
      ['PHARMACOLOGY'],
      [data.pharmacology || 'Not specified'],
      [],
      ['BLOOD-BRAIN BARRIER'],
      [data.bbb || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Neurochemistry', rows: rows });
  },

  generateNeuroBiochemPDF: function(filename, data) {
    var lines = [
      { text: 'NEUROCHEMISTRY ANALYSIS', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── NEUROTRANSMITTER PROFILE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.neurotransmitter || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── METABOLIC PATHWAY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.pathway || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RECEPTORS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.receptors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SIGNAL TERMINATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.termination || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ASSOCIATED DISEASES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.disease || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PHARMACOLOGY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.pharmacology || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BLOOD-BRAIN BARRIER ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.bbb || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Neurochemistry Analysis', lines: lines });
  },

  // ============================================================
  // 11. HEART & MUSCLE BIOCHEMISTRY
  // ============================================================

  generateHeartMuscleWord: async function(filename, data) {
    var sections = [
      { heading: 'Heart & Muscle Biochemistry', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Cardiac Fuel Preferences', content: (data.cardiacFuels || 'Not specified').split('\n') },
      { heading: 'Energy Systems (PCr, Glycolysis, OxPhos)', content: (data.energySystems || 'Not specified').split('\n') },
      { heading: 'Cross-Bridge Cycling', content: (data.crossBridge || 'Not specified').split('\n') },
      { heading: 'Calcium Handling & Excitation-Contraction', content: (data.calcium || 'Not specified').split('\n') },
      { heading: 'Ischaemia & Reperfusion', content: (data.ischemia || 'Not specified').split('\n') },
      { heading: 'Exercise Adaptations', content: (data.exercise || 'Not specified').split('\n') },
      { heading: 'Clinical Connections', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Heart & Muscle Biochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateHeartMuscleExcel: function(filename, data) {
    var rows = [
      ['Heart & Muscle Biochemistry'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['CARDIAC FUEL PREFERENCES'],
      [data.cardiacFuels || 'Not specified'],
      [],
      ['ENERGY SYSTEMS'],
      [data.energySystems || 'Not specified'],
      [],
      ['CROSS-BRIDGE CYCLING'],
      [data.crossBridge || 'Not specified'],
      [],
      ['CALCIUM HANDLING'],
      [data.calcium || 'Not specified'],
      [],
      ['ISCHAEMIA & REPERFUSION'],
      [data.ischemia || 'Not specified'],
      [],
      ['EXERCISE ADAPTATIONS'],
      [data.exercise || 'Not specified'],
      [],
      ['CLINICAL CONNECTIONS'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Heart Muscle Biochem', rows: rows });
  },

  generateHeartMusclePDF: function(filename, data) {
    var lines = [
      { text: 'HEART & MUSCLE BIOCHEMISTRY', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CARDIAC FUEL PREFERENCES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.cardiacFuels || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ENERGY SYSTEMS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.energySystems || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CROSS-BRIDGE CYCLING ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.crossBridge || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CALCIUM HANDLING ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.calcium || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ISCHAEMIA & REPERFUSION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.ischemia || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EXERCISE ADAPTATIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.exercise || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CONNECTIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Heart & Muscle Biochemistry', lines: lines });
  },

  // ============================================================
  // 12. LIVER METABOLIC CENTER
  // ============================================================

  generateLiverBiochemWord: async function(filename, data) {
    var sections = [
      { heading: 'Liver Metabolic Center', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Hepatic Zonation', content: (data.zonation || 'Not specified').split('\n') },
      { heading: 'Glucose Homeostasis', content: (data.glucose || 'Not specified').split('\n') },
      { heading: 'Lipid Metabolism', content: (data.lipid || 'Not specified').split('\n') },
      { heading: 'Urea Cycle & Nitrogen Disposal', content: (data.urea || 'Not specified').split('\n') },
      { heading: 'Bile Acid Synthesis', content: (data.bile || 'Not specified').split('\n') },
      { heading: 'Detoxification (Phase I/II)', content: (data.detox || 'Not specified').split('\n') },
      { heading: 'Bilirubin Metabolism', content: (data.bilirubin || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Liver Biochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateLiverBiochemExcel: function(filename, data) {
    var rows = [
      ['Liver Metabolic Center Worksheet'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['HEPATIC ZONATION'],
      [data.zonation || 'Not specified'],
      [],
      ['GLUCOSE HOMEOSTASIS'],
      [data.glucose || 'Not specified'],
      [],
      ['LIPID METABOLISM'],
      [data.lipid || 'Not specified'],
      [],
      ['UREA CYCLE'],
      [data.urea || 'Not specified'],
      [],
      ['BILE ACID SYNTHESIS'],
      [data.bile || 'Not specified'],
      [],
      ['DETOXIFICATION (PHASE I/II)'],
      [data.detox || 'Not specified'],
      [],
      ['BILIRUBIN METABOLISM'],
      [data.bilirubin || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Liver Biochemistry', rows: rows });
  },

  generateLiverBiochemPDF: function(filename, data) {
    var lines = [
      { text: 'LIVER METABOLIC CENTER', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── HEPATIC ZONATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.zonation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GLUCOSE HOMEOSTASIS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.glucose || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LIPID METABOLISM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.lipid || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── UREA CYCLE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.urea || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BILE ACID SYNTHESIS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.bile || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DETOXIFICATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.detox || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BILIRUBIN METABOLISM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.bilirubin || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Liver Metabolic Center', lines: lines });
  },

  // ============================================================
  // 13. KIDNEY & ACID-BASE CONTROL
  // ============================================================

  generateKidneyBiochemWord: async function(filename, data) {
    var sections = [
      { heading: 'Kidney & Acid-Base Control', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Nephron Function', content: (data.nephronFunction || 'Not specified').split('\n') },
      { heading: 'Glomerular Filtration Rate', content: (data.gfr || 'Not specified').split('\n') },
      { heading: 'Electrolyte Balance', content: (data.electrolytes || 'Not specified').split('\n') },
      { heading: 'Acid-Base Regulation', content: (data.acidBase || 'Not specified').split('\n') },
      { heading: 'Hormonal Control (RAAS, ADH, ANP)', content: (data.hormones || 'Not specified').split('\n') },
      { heading: 'Renal Biomarkers', content: (data.biomarkers || 'Not specified').split('\n') },
      { heading: 'Clinical Connections', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Kidney Biochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateKidneyBiochemExcel: function(filename, data) {
    var rows = [
      ['Kidney & Acid-Base Control Worksheet'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['NEPHRON FUNCTION'],
      [data.nephronFunction || 'Not specified'],
      [],
      ['GFR'],
      [data.gfr || 'Not specified'],
      [],
      ['ELECTROLYTE BALANCE'],
      [data.electrolytes || 'Not specified'],
      [],
      ['ACID-BASE REGULATION'],
      [data.acidBase || 'Not specified'],
      [],
      ['HORMONAL CONTROL'],
      [data.hormones || 'Not specified'],
      [],
      ['RENAL BIOMARKERS'],
      [data.biomarkers || 'Not specified'],
      [],
      ['CLINICAL CONNECTIONS'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Kidney Biochemistry', rows: rows });
  },

  generateKidneyBiochemPDF: function(filename, data) {
    var lines = [
      { text: 'KIDNEY & ACID-BASE CONTROL', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── NEPHRON FUNCTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.nephronFunction || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GLOMERULAR FILTRATION RATE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.gfr || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ELECTROLYTE BALANCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.electrolytes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ACID-BASE REGULATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.acidBase || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HORMONAL CONTROL ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.hormones || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RENAL BIOMARKERS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.biomarkers || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CONNECTIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Kidney & Acid-Base Control', lines: lines });
  },

  // ============================================================
  // 14. ENDOCRINE SYSTEM BIOCHEMISTRY
  // ============================================================

  generateEndocrineBiochemWord: async function(filename, data) {
    var sections = [
      { heading: 'Endocrine System Biochemistry', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Hormone Classes & Synthesis', content: (data.hormoneClasses || 'Not specified').split('\n') },
      { heading: 'Receptor Types & Mechanisms', content: (data.receptors || 'Not specified').split('\n') },
      { heading: 'Insulin & Glucagon Axis', content: (data.insulinGlucagon || 'Not specified').split('\n') },
      { heading: 'Thyroid Hormones', content: (data.thyroid || 'Not specified').split('\n') },
      { heading: 'Cortisol & HPA Axis', content: (data.cortisol || 'Not specified').split('\n') },
      { heading: 'Reproductive Hormones', content: (data.reproductive || 'Not specified').split('\n') },
      { heading: 'Endocrine Disorders', content: (data.disorders || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Endocrine Biochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateEndocrineBiochemExcel: function(filename, data) {
    var rows = [
      ['Endocrine System Biochemistry'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['HORMONE CLASSES & SYNTHESIS'],
      [data.hormoneClasses || 'Not specified'],
      [],
      ['RECEPTOR TYPES & MECHANISMS'],
      [data.receptors || 'Not specified'],
      [],
      ['INSULIN & GLUCAGON AXIS'],
      [data.insulinGlucagon || 'Not specified'],
      [],
      ['THYROID HORMONES'],
      [data.thyroid || 'Not specified'],
      [],
      ['CORTISOL & HPA AXIS'],
      [data.cortisol || 'Not specified'],
      [],
      ['REPRODUCTIVE HORMONES'],
      [data.reproductive || 'Not specified'],
      [],
      ['ENDOCRINE DISORDERS'],
      [data.disorders || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Endocrine Biochemistry', rows: rows });
  },

  generateEndocrineBiochemPDF: function(filename, data) {
    var lines = [
      { text: 'ENDOCRINE SYSTEM BIOCHEMISTRY', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── HORMONE CLASSES & SYNTHESIS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.hormoneClasses || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── RECEPTOR TYPES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.receptors || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INSULIN & GLUCAGON ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.insulinGlucagon || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── THYROID HORMONES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.thyroid || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CORTISOL & HPA AXIS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.cortisol || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REPRODUCTIVE HORMONES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.reproductive || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ENDOCRINE DISORDERS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.disorders || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Endocrine System Biochemistry', lines: lines });
  },

  // ============================================================
  // 15. DIGESTIVE SYSTEM BIOCHEMISTRY
  // ============================================================

  generateDigestiveBiochemWord: async function(filename, data) {
    var sections = [
      { heading: 'Digestive System Biochemistry', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Gastric Acid Secretion', content: (data.gastricAcid || 'Not specified').split('\n') },
      { heading: 'Pancreatic Enzymes', content: (data.pancreatic || 'Not specified').split('\n') },
      { heading: 'Bile Salt Metabolism', content: (data.bileSalts || 'Not specified').split('\n') },
      { heading: 'Carbohydrate Digestion & Absorption', content: (data.carbDigestion || 'Not specified').split('\n') },
      { heading: 'Protein Digestion & Absorption', content: (data.proteinDigestion || 'Not specified').split('\n') },
      { heading: 'Lipid Digestion & Absorption', content: (data.lipidDigestion || 'Not specified').split('\n') },
      { heading: 'Gut Microbiome Biochemistry', content: (data.microbiome || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Digestive Biochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateDigestiveBiochemExcel: function(filename, data) {
    var rows = [
      ['Digestive System Biochemistry'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['GASTRIC ACID SECRETION'],
      [data.gastricAcid || 'Not specified'],
      [],
      ['PANCREATIC ENZYMES'],
      [data.pancreatic || 'Not specified'],
      [],
      ['BILE SALT METABOLISM'],
      [data.bileSalts || 'Not specified'],
      [],
      ['CARBOHYDRATE DIGESTION'],
      [data.carbDigestion || 'Not specified'],
      [],
      ['PROTEIN DIGESTION'],
      [data.proteinDigestion || 'Not specified'],
      [],
      ['LIPID DIGESTION'],
      [data.lipidDigestion || 'Not specified'],
      [],
      ['GUT MICROBIOME'],
      [data.microbiome || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Digestive Biochemistry', rows: rows });
  },

  generateDigestiveBiochemPDF: function(filename, data) {
    var lines = [
      { text: 'DIGESTIVE SYSTEM BIOCHEMISTRY', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── GASTRIC ACID SECRETION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.gastricAcid || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PANCREATIC ENZYMES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.pancreatic || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BILE SALT METABOLISM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.bileSalts || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CARBOHYDRATE DIGESTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.carbDigestion || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROTEIN DIGESTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.proteinDigestion || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LIPID DIGESTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.lipidDigestion || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GUT MICROBIOME ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.microbiome || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Digestive System Biochemistry', lines: lines });
  },

  // ============================================================
  // 16. IMMUNE SYSTEM BIOCHEMISTRY
  // ============================================================

  generateImmuneBiochemWord: async function(filename, data) {
    var sections = [
      { heading: 'Immune System Biochemistry', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Innate vs Adaptive Immunity', content: (data.innateAdaptive || 'Not specified').split('\n') },
      { heading: 'Antibody Structure & Function', content: (data.antibodies || 'Not specified').split('\n') },
      { heading: 'Cytokine Networks', content: (data.cytokines || 'Not specified').split('\n') },
      { heading: 'Complement System', content: (data.complement || 'Not specified').split('\n') },
      { heading: 'Oxidative Burst & ROS', content: (data.oxidativeBurst || 'Not specified').split('\n') },
      { heading: 'Immunodeficiency & Autoimmunity', content: (data.immunodeficiency || 'Not specified').split('\n') },
      { heading: 'Clinical Connections', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Immune Biochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateImmuneBiochemExcel: function(filename, data) {
    var rows = [
      ['Immune System Biochemistry'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['INNATE vs ADAPTIVE IMMUNITY'],
      [data.innateAdaptive || 'Not specified'],
      [],
      ['ANTIBODY STRUCTURE & FUNCTION'],
      [data.antibodies || 'Not specified'],
      [],
      ['CYTOKINE NETWORKS'],
      [data.cytokines || 'Not specified'],
      [],
      ['COMPLEMENT SYSTEM'],
      [data.complement || 'Not specified'],
      [],
      ['OXIDATIVE BURST & ROS'],
      [data.oxidativeBurst || 'Not specified'],
      [],
      ['IMMUNODEFICIENCY & AUTOIMMUNITY'],
      [data.immunodeficiency || 'Not specified'],
      [],
      ['CLINICAL CONNECTIONS'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Immune Biochemistry', rows: rows });
  },

  generateImmuneBiochemPDF: function(filename, data) {
    var lines = [
      { text: 'IMMUNE SYSTEM BIOCHEMISTRY', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── INNATE vs ADAPTIVE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.innateAdaptive || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ANTIBODIES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.antibodies || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CYTOKINE NETWORKS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.cytokines || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPLEMENT SYSTEM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.complement || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OXIDATIVE BURST ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.oxidativeBurst || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── IMMUNODEFICIENCY & AUTOIMMUNITY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.immunodeficiency || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CONNECTIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Immune System Biochemistry', lines: lines });
  },

  // ============================================================
  // 17. ADIPOSE TISSUE & ENERGY BALANCE
  // ============================================================

  generateAdiposeBiochemWord: async function(filename, data) {
    var sections = [
      { heading: 'Adipose Tissue & Energy Balance', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Adipose Tissue Types (WAT, BAT, Beige)', content: (data.adiposeTypes || 'Not specified').split('\n') },
      { heading: 'Lipolysis & Lipogenesis', content: (data.lipolysis || 'Not specified').split('\n') },
      { heading: 'Leptin Signalling', content: (data.leptin || 'Not specified').split('\n') },
      { heading: 'Adiponectin & Insulin Sensitivity', content: (data.adiponectin || 'Not specified').split('\n') },
      { heading: 'Adipose Inflammation', content: (data.inflammation || 'Not specified').split('\n') },
      { heading: 'Obesity & Metabolic Syndrome', content: (data.obesity || 'Not specified').split('\n') },
      { heading: 'Energy Balance Regulation', content: (data.energyBalance || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Adipose Biochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateAdiposeBiochemExcel: function(filename, data) {
    var rows = [
      ['Adipose Tissue & Energy Balance'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['ADIPOSE TISSUE TYPES'],
      [data.adiposeTypes || 'Not specified'],
      [],
      ['LIPOLYSIS & LIPOGENESIS'],
      [data.lipolysis || 'Not specified'],
      [],
      ['LEPTIN SIGNALLING'],
      [data.leptin || 'Not specified'],
      [],
      ['ADIPONECTIN'],
      [data.adiponectin || 'Not specified'],
      [],
      ['ADIPOSE INFLAMMATION'],
      [data.inflammation || 'Not specified'],
      [],
      ['OBESITY & METABOLIC SYNDROME'],
      [data.obesity || 'Not specified'],
      [],
      ['ENERGY BALANCE REGULATION'],
      [data.energyBalance || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Adipose Biochemistry', rows: rows });
  },

  generateAdiposeBiochemPDF: function(filename, data) {
    var lines = [
      { text: 'ADIPOSE TISSUE & ENERGY BALANCE', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ADIPOSE TISSUE TYPES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.adiposeTypes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LIPOLYSIS & LIPOGENESIS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.lipolysis || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LEPTIN SIGNALLING ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.leptin || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADIPONECTIN ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.adiponectin || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADIPOSE INFLAMMATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.inflammation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OBESITY & METABOLIC SYNDROME ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.obesity || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ENERGY BALANCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.energyBalance || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Adipose Tissue & Energy Balance', lines: lines });
  },

  // ============================================================
  // 18. TISSUE-SPECIFIC METABOLISM
  // ============================================================

  generateTissueMetabolismWord: async function(filename, data) {
    var sections = [
      { heading: 'Tissue-Specific Metabolism', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Fed State Metabolism', content: (data.fedState || 'Not specified').split('\n') },
      { heading: 'Fasting State Metabolism', content: (data.fastingState || 'Not specified').split('\n') },
      { heading: 'Organ-Specific Fuel Preferences', content: (data.organFuels || 'Not specified').split('\n') },
      { heading: 'Ketogenesis & Ketone Utilisation', content: (data.ketogenesis || 'Not specified').split('\n') },
      { heading: 'Inter-Organ Metabolic Cycles', content: (data.interOrgan || 'Not specified').split('\n') },
      { heading: 'Exercise Metabolism', content: (data.exercise || 'Not specified').split('\n') },
      { heading: 'Clinical Connections', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Tissue Metabolism — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateTissueMetabolismExcel: function(filename, data) {
    var rows = [
      ['Tissue-Specific Metabolism'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['FED STATE METABOLISM'],
      [data.fedState || 'Not specified'],
      [],
      ['FASTING STATE METABOLISM'],
      [data.fastingState || 'Not specified'],
      [],
      ['ORGAN-SPECIFIC FUELS'],
      [data.organFuels || 'Not specified'],
      [],
      ['KETOGENESIS'],
      [data.ketogenesis || 'Not specified'],
      [],
      ['INTER-ORGAN CYCLES'],
      [data.interOrgan || 'Not specified'],
      [],
      ['EXERCISE METABOLISM'],
      [data.exercise || 'Not specified'],
      [],
      ['CLINICAL CONNECTIONS'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Tissue Metabolism', rows: rows });
  },

  generateTissueMetabolismPDF: function(filename, data) {
    var lines = [
      { text: 'TISSUE-SPECIFIC METABOLISM', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FED STATE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.fedState || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FASTING STATE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.fastingState || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ORGAN-SPECIFIC FUELS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.organFuels || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KETOGENESIS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.ketogenesis || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTER-ORGAN CYCLES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.interOrgan || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EXERCISE METABOLISM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.exercise || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CONNECTIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Tissue-Specific Metabolism', lines: lines });
  },

  // ============================================================
  // 19. MOLECULAR BASIS OF DISEASE
  // ============================================================

  generateDiseaseBiochemWord: async function(filename, data) {
    var sections = [
      { heading: 'Molecular Basis of Disease', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Diabetes Mellitus (T1D & T2D)', content: (data.diabetes || 'Not specified').split('\n') },
      { heading: 'Cancer Metabolism', content: (data.cancer || 'Not specified').split('\n') },
      { heading: 'Neurodegenerative Diseases', content: (data.neuro || 'Not specified').split('\n') },
      { heading: 'Genetic Metabolic Disorders', content: (data.genetic || 'Not specified').split('\n') },
      { heading: 'Inborn Errors of Metabolism', content: (data.inborn || 'Not specified').split('\n') },
      { heading: 'Pharmacogenomics', content: (data.pharmacogenomics || 'Not specified').split('\n') },
      { heading: 'Clinical Connections', content: (data.clinical || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Disease Biochemistry — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateDiseaseBiochemExcel: function(filename, data) {
    var rows = [
      ['Molecular Basis of Disease'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['DIABETES MELLITUS'],
      [data.diabetes || 'Not specified'],
      [],
      ['CANCER METABOLISM'],
      [data.cancer || 'Not specified'],
      [],
      ['NEURODEGENERATIVE DISEASES'],
      [data.neuro || 'Not specified'],
      [],
      ['GENETIC METABOLIC DISORDERS'],
      [data.genetic || 'Not specified'],
      [],
      ['INBORN ERRORS OF METABOLISM'],
      [data.inborn || 'Not specified'],
      [],
      ['PHARMACOGENOMICS'],
      [data.pharmacogenomics || 'Not specified'],
      [],
      ['CLINICAL CONNECTIONS'],
      [data.clinical || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Disease Biochemistry', rows: rows });
  },

  generateDiseaseBiochemPDF: function(filename, data) {
    var lines = [
      { text: 'MOLECULAR BASIS OF DISEASE', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DIABETES MELLITUS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.diabetes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CANCER METABOLISM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.cancer || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NEURODEGENERATIVE DISEASES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.neuro || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GENETIC DISORDERS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.genetic || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INBORN ERRORS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.inborn || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PHARMACOGENOMICS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.pharmacogenomics || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CONNECTIONS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinical || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Molecular Basis of Disease', lines: lines });
  },

  // ============================================================
  // 20. CLINICAL DIAGNOSTICS & BIOMARKERS
  // ============================================================

  generateClinicalDiagnosticsWord: async function(filename, data) {
    var sections = [
      { heading: 'Clinical Diagnostics & Biomarkers', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Topic Focus: ' + (data.topicFocus || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Blood Glucose & HbA1c', content: (data.glucose || 'Not specified').split('\n') },
      { heading: 'Liver Function Tests', content: (data.liver || 'Not specified').split('\n') },
      { heading: 'Kidney Function Markers', content: (data.kidney || 'Not specified').split('\n') },
      { heading: 'Lipid Panel & Cardiovascular Risk', content: (data.lipid || 'Not specified').split('\n') },
      { heading: 'Cardiac Biomarkers', content: (data.cardiac || 'Not specified').split('\n') },
      { heading: 'Thyroid Function Tests', content: (data.thyroid || 'Not specified').split('\n') },
      { heading: 'Point-of-Care Testing', content: (data.poct || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Clinical Diagnostics — ' + (data.topicFocus || ''), author: data.studentName || '', sections: sections });
  },

  generateClinicalDiagnosticsExcel: function(filename, data) {
    var rows = [
      ['Clinical Diagnostics & Biomarkers'],
      ['Student', data.studentName || ''],
      ['Topic Focus', data.topicFocus || ''],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['BLOOD GLUCOSE & HbA1c'],
      [data.glucose || 'Not specified'],
      [],
      ['LIVER FUNCTION TESTS'],
      [data.liver || 'Not specified'],
      [],
      ['KIDNEY FUNCTION MARKERS'],
      [data.kidney || 'Not specified'],
      [],
      ['LIPID PANEL'],
      [data.lipid || 'Not specified'],
      [],
      ['CARDIAC BIOMARKERS'],
      [data.cardiac || 'Not specified'],
      [],
      ['THYROID FUNCTION TESTS'],
      [data.thyroid || 'Not specified'],
      [],
      ['POINT-OF-CARE TESTING'],
      [data.poct || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Clinical Diagnostics', rows: rows });
  },

  generateClinicalDiagnosticsPDF: function(filename, data) {
    var lines = [
      { text: 'CLINICAL DIAGNOSTICS & BIOMARKERS', size: 18, bold: true },
      { text: 'Topic: ' + (data.topicFocus || 'N/A'), size: 12 },
      { text: 'Student: ' + (data.studentName || 'N/A') + '  |  ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BLOOD GLUCOSE & HbA1c ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.glucose || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LIVER FUNCTION TESTS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.liver || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KIDNEY FUNCTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.kidney || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LIPID PANEL ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.lipid || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CARDIAC BIOMARKERS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.cardiac || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── THYROID FUNCTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.thyroid || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── POINT-OF-CARE TESTING ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.poct || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Clinical Diagnostics & Biomarkers', lines: lines });
  }

});
