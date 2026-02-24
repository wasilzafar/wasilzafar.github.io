/**
 * Doc Generator - Evolutionary Biology Series
 * Extends DocGenerator with evolutionary biology series document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * Generators:
 *  1. DarwinNaturalSelection  — Natural selection analysis worksheet (10 fields)
 *  2. GeneticsEvolution       — Population genetics & evolution worksheet (8 fields)
 *  3. SpeciationRadiation     — Speciation & adaptive radiation worksheet (8 fields)
 *  4. PhylogeneticsTaxonomy   — Phylogenetics & taxonomy worksheet (8 fields)
 *  5. HumanEvolution          — Human evolution & migration worksheet (8 fields)
 *  6. CoevolutionSymbiosis    — Coevolution & symbiosis worksheet (7 fields)
 *  7. MassExtinctions         — Mass extinctions & biodiversity worksheet (7 fields)
 *  8. EvoDevo                 — Evo-devo worksheet (7 fields)
 *  9. BehavioralEvolution     — Behavioral & social evolution worksheet (7 fields)
 * 10. MathematicalEvolution   — Mathematical & theoretical evolution worksheet (7 fields)
 * 11. Paleontology            — Paleontology & fossil interpretation worksheet (7 fields)
 * 12. EvolutionaryGenomics    — Evolutionary genomics worksheet (7 fields)
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. DARWIN & NATURAL SELECTION
  // ============================================================

  generateDarwinNaturalSelectionWord: async function(filename, data) {
    var sections = [
      { heading: 'Natural Selection Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Organism: ' + (data.organismName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Selection Type & Environment', content: [
          'Selection Type: ' + (data.selectionType || 'N/A'),
          'Environment: ' + (data.environment || 'N/A')
      ]},
      { heading: 'Variation & Fitness', content: [
          'Heritable Variation: ' + (data.variation || 'N/A'),
          'Fitness Trait: ' + (data.fitnessTrait || 'N/A')
      ]},
      { heading: 'Adaptation & Trade-Offs', content: [
          'Observed Adaptation: ' + (data.adaptation || 'N/A'),
          'Trade-Offs: ' + (data.tradeOffs || 'N/A')
      ]},
      { heading: 'Modern Application', content: (data.modernApplication || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Natural Selection Analysis — ' + (data.organismName || ''), author: data.studentName || '', sections: sections });
  },

  generateDarwinNaturalSelectionExcel: function(filename, data) {
    var rows = [
      ['Natural Selection Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Organism', data.organismName || ''],
      [],
      ['SELECTION'],
      ['Selection Type', data.selectionType || ''],
      ['Environment', data.environment || ''],
      [],
      ['VARIATION & FITNESS'],
      ['Heritable Variation', data.variation || ''],
      ['Fitness Trait', data.fitnessTrait || ''],
      [],
      ['ADAPTATION'],
      ['Observed Adaptation', data.adaptation || ''],
      ['Trade-Offs', data.tradeOffs || ''],
      [],
      ['MODERN APPLICATION'],
      [data.modernApplication || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Natural Selection Analysis', rows: rows });
  },

  generateDarwinNaturalSelectionPDF: function(filename, data) {
    var lines = [
      { text: 'NATURAL SELECTION ANALYSIS', size: 18, bold: true },
      { text: (data.organismName || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SELECTION TYPE & ENVIRONMENT ──', size: 14, bold: true },
      { text: 'Type: ' + (data.selectionType || 'N/A'), size: 10 },
      { text: 'Environment: ' + (data.environment || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── VARIATION & FITNESS ──', size: 14, bold: true },
      { text: 'Heritable Variation: ' + (data.variation || 'N/A'), size: 10 },
      { text: 'Fitness Trait: ' + (data.fitnessTrait || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADAPTATION & TRADE-OFFS ──', size: 14, bold: true },
      { text: 'Adaptation: ' + (data.adaptation || 'N/A'), size: 10 },
      { text: 'Trade-Offs: ' + (data.tradeOffs || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── MODERN APPLICATION ──', size: 14, bold: true },
      { text: data.modernApplication || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Natural Selection Analysis', lines: lines });
  },

  // ============================================================
  // 2. GENETICS OF EVOLUTION
  // ============================================================

  generateGeneticsEvolutionWord: async function(filename, data) {
    var sections = [
      { heading: 'Population Genetics Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Population: ' + (data.population || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Allele Frequencies', content: (data.alleleFreqs || 'Not specified').split('\n') },
      { heading: 'Hardy-Weinberg Testing', content: (data.hwTest || 'Not specified').split('\n') },
      { heading: 'Genetic Drift Observations', content: (data.driftObs || 'Not specified').split('\n') },
      { heading: 'Gene Flow', content: (data.geneFlow || 'Not specified').split('\n') },
      { heading: 'Molecular Evolution', content: (data.molEvolution || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Population Genetics — ' + (data.population || ''), author: data.studentName || '', sections: sections });
  },

  generateGeneticsEvolutionExcel: function(filename, data) {
    var rows = [
      ['Population Genetics Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Population', data.population || ''],
      [],
      ['ALLELE FREQUENCIES'],
      [data.alleleFreqs || 'Not specified'],
      [],
      ['HARDY-WEINBERG TESTING'],
      [data.hwTest || 'Not specified'],
      [],
      ['GENETIC DRIFT'],
      [data.driftObs || 'Not specified'],
      [],
      ['GENE FLOW'],
      [data.geneFlow || 'Not specified'],
      [],
      ['MOLECULAR EVOLUTION'],
      [data.molEvolution || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Population Genetics', rows: rows });
  },

  generateGeneticsEvolutionPDF: function(filename, data) {
    var lines = [
      { text: 'POPULATION GENETICS ANALYSIS', size: 18, bold: true },
      { text: (data.population || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ALLELE FREQUENCIES ──', size: 14, bold: true },
      { text: data.alleleFreqs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HARDY-WEINBERG TESTING ──', size: 14, bold: true },
      { text: data.hwTest || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GENETIC DRIFT ──', size: 14, bold: true },
      { text: data.driftObs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GENE FLOW ──', size: 14, bold: true },
      { text: data.geneFlow || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MOLECULAR EVOLUTION ──', size: 14, bold: true },
      { text: data.molEvolution || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Population Genetics', lines: lines });
  },

  // ============================================================
  // 3. SPECIATION & ADAPTIVE RADIATION
  // ============================================================

  generateSpeciationRadiationWord: async function(filename, data) {
    var sections = [
      { heading: 'Speciation & Radiation Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Taxon: ' + (data.taxon || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Species Concept', content: (data.speciesConcept || 'Not specified').split('\n') },
      { heading: 'Speciation Mode', content: (data.speciationMode || 'Not specified').split('\n') },
      { heading: 'Reproductive Isolation', content: (data.isolation || 'Not specified').split('\n') },
      { heading: 'Adaptive Radiation', content: (data.radiation || 'Not specified').split('\n') },
      { heading: 'Convergent Evolution', content: (data.convergence || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Speciation & Radiation — ' + (data.taxon || ''), author: data.studentName || '', sections: sections });
  },

  generateSpeciationRadiationExcel: function(filename, data) {
    var rows = [
      ['Speciation & Adaptive Radiation Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Taxon', data.taxon || ''],
      [],
      ['SPECIES CONCEPT'],
      [data.speciesConcept || 'Not specified'],
      [],
      ['SPECIATION MODE'],
      [data.speciationMode || 'Not specified'],
      [],
      ['REPRODUCTIVE ISOLATION'],
      [data.isolation || 'Not specified'],
      [],
      ['ADAPTIVE RADIATION'],
      [data.radiation || 'Not specified'],
      [],
      ['CONVERGENT EVOLUTION'],
      [data.convergence || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Speciation & Radiation', rows: rows });
  },

  generateSpeciationRadiationPDF: function(filename, data) {
    var lines = [
      { text: 'SPECIATION & ADAPTIVE RADIATION', size: 18, bold: true },
      { text: (data.taxon || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SPECIES CONCEPT ──', size: 14, bold: true },
      { text: data.speciesConcept || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SPECIATION MODE ──', size: 14, bold: true },
      { text: data.speciationMode || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── REPRODUCTIVE ISOLATION ──', size: 14, bold: true },
      { text: data.isolation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADAPTIVE RADIATION ──', size: 14, bold: true },
      { text: data.radiation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONVERGENT EVOLUTION ──', size: 14, bold: true },
      { text: data.convergence || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Speciation & Radiation', lines: lines });
  },

  // ============================================================
  // 4. PHYLOGENETICS & TAXONOMY
  // ============================================================

  generatePhylogeneticsTaxonomyWord: async function(filename, data) {
    var sections = [
      { heading: 'Phylogenetics & Taxonomy Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Taxon Group: ' + (data.taxonGroup || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Data Type & Method', content: [
          'Data Type: ' + (data.dataType || 'N/A'),
          'Phylogenetic Method: ' + (data.method || 'N/A')
      ]},
      { heading: 'Tree Findings', content: (data.treeFindings || 'Not specified').split('\n') },
      { heading: 'Classification', content: (data.classification || 'Not specified').split('\n') },
      { heading: 'Homology Assessment', content: (data.homology || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Phylogenetics — ' + (data.taxonGroup || ''), author: data.studentName || '', sections: sections });
  },

  generatePhylogeneticsTaxonomyExcel: function(filename, data) {
    var rows = [
      ['Phylogenetics & Taxonomy Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Taxon Group', data.taxonGroup || ''],
      [],
      ['METHOD'],
      ['Data Type', data.dataType || ''],
      ['Phylogenetic Method', data.method || ''],
      [],
      ['TREE FINDINGS'],
      [data.treeFindings || 'Not specified'],
      [],
      ['CLASSIFICATION'],
      [data.classification || 'Not specified'],
      [],
      ['HOMOLOGY'],
      [data.homology || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Phylogenetics & Taxonomy', rows: rows });
  },

  generatePhylogeneticsTaxonomyPDF: function(filename, data) {
    var lines = [
      { text: 'PHYLOGENETICS & TAXONOMY ANALYSIS', size: 18, bold: true },
      { text: (data.taxonGroup || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DATA & METHOD ──', size: 14, bold: true },
      { text: 'Data Type: ' + (data.dataType || 'N/A'), size: 10 },
      { text: 'Method: ' + (data.method || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── TREE FINDINGS ──', size: 14, bold: true },
      { text: data.treeFindings || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLASSIFICATION ──', size: 14, bold: true },
      { text: data.classification || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HOMOLOGY ──', size: 14, bold: true },
      { text: data.homology || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Phylogenetics & Taxonomy', lines: lines });
  },

  // ============================================================
  // 5. HUMAN EVOLUTION & MIGRATION
  // ============================================================

  generateHumanEvolutionWord: async function(filename, data) {
    var sections = [
      { heading: 'Human Evolution & Migration Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Hominin Species: ' + (data.homininSpecies || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Fossil Evidence', content: (data.fossilEvidence || 'Not specified').split('\n') },
      { heading: 'Genetic Evidence', content: (data.geneticEvidence || 'Not specified').split('\n') },
      { heading: 'Migration Patterns', content: (data.migration || 'Not specified').split('\n') },
      { heading: 'Admixture Events', content: (data.admixture || 'Not specified').split('\n') },
      { heading: 'Cultural Evolution', content: (data.culturalEvolution || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Human Evolution — ' + (data.homininSpecies || ''), author: data.studentName || '', sections: sections });
  },

  generateHumanEvolutionExcel: function(filename, data) {
    var rows = [
      ['Human Evolution & Migration Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Hominin Species', data.homininSpecies || ''],
      [],
      ['FOSSIL EVIDENCE'],
      [data.fossilEvidence || 'Not specified'],
      [],
      ['GENETIC EVIDENCE'],
      [data.geneticEvidence || 'Not specified'],
      [],
      ['MIGRATION PATTERNS'],
      [data.migration || 'Not specified'],
      [],
      ['ADMIXTURE EVENTS'],
      [data.admixture || 'Not specified'],
      [],
      ['CULTURAL EVOLUTION'],
      [data.culturalEvolution || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Human Evolution & Migration', rows: rows });
  },

  generateHumanEvolutionPDF: function(filename, data) {
    var lines = [
      { text: 'HUMAN EVOLUTION & MIGRATION', size: 18, bold: true },
      { text: (data.homininSpecies || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FOSSIL EVIDENCE ──', size: 14, bold: true },
      { text: data.fossilEvidence || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GENETIC EVIDENCE ──', size: 14, bold: true },
      { text: data.geneticEvidence || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MIGRATION PATTERNS ──', size: 14, bold: true },
      { text: data.migration || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ADMIXTURE EVENTS ──', size: 14, bold: true },
      { text: data.admixture || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CULTURAL EVOLUTION ──', size: 14, bold: true },
      { text: data.culturalEvolution || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Human Evolution & Migration', lines: lines });
  },

  // ============================================================
  // 6. COEVOLUTION & SYMBIOSIS
  // ============================================================

  generateCoevolutionSymbiosisWord: async function(filename, data) {
    var sections = [
      { heading: 'Coevolution & Symbiosis Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Interaction Pair: ' + (data.interactionPair || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Interaction Type', content: (data.interactionType || 'Not specified').split('\n') },
      { heading: 'Coevolutionary Evidence', content: (data.coevoEvidence || 'Not specified').split('\n') },
      { heading: 'Symbiosis Analysis', content: (data.symbiosis || 'Not specified').split('\n') },
      { heading: 'Holobiont Perspective', content: (data.holobiont || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Coevolution — ' + (data.interactionPair || ''), author: data.studentName || '', sections: sections });
  },

  generateCoevolutionSymbiosisExcel: function(filename, data) {
    var rows = [
      ['Coevolution & Symbiosis Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Interaction Pair', data.interactionPair || ''],
      [],
      ['INTERACTION TYPE'],
      [data.interactionType || 'Not specified'],
      [],
      ['COEVOLUTIONARY EVIDENCE'],
      [data.coevoEvidence || 'Not specified'],
      [],
      ['SYMBIOSIS'],
      [data.symbiosis || 'Not specified'],
      [],
      ['HOLOBIONT'],
      [data.holobiont || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Coevolution & Symbiosis', rows: rows });
  },

  generateCoevolutionSymbiosisPDF: function(filename, data) {
    var lines = [
      { text: 'COEVOLUTION & SYMBIOSIS ANALYSIS', size: 18, bold: true },
      { text: (data.interactionPair || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── INTERACTION TYPE ──', size: 14, bold: true },
      { text: data.interactionType || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COEVOLUTIONARY EVIDENCE ──', size: 14, bold: true },
      { text: data.coevoEvidence || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SYMBIOSIS ──', size: 14, bold: true },
      { text: data.symbiosis || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HOLOBIONT PERSPECTIVE ──', size: 14, bold: true },
      { text: data.holobiont || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Coevolution & Symbiosis', lines: lines });
  },

  // ============================================================
  // 7. MASS EXTINCTIONS & BIODIVERSITY
  // ============================================================

  generateMassExtinctionsWord: async function(filename, data) {
    var sections = [
      { heading: 'Mass Extinctions & Biodiversity Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Extinction Event: ' + (data.extinctionEvent || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Causes', content: (data.causes || 'Not specified').split('\n') },
      { heading: 'Biodiversity Impact', content: (data.biodiversityImpact || 'Not specified').split('\n') },
      { heading: 'Patterns & Recovery', content: (data.patterns || 'Not specified').split('\n') },
      { heading: 'Conservation Implications', content: (data.conservation || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Mass Extinctions — ' + (data.extinctionEvent || ''), author: data.studentName || '', sections: sections });
  },

  generateMassExtinctionsExcel: function(filename, data) {
    var rows = [
      ['Mass Extinctions & Biodiversity Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Extinction Event', data.extinctionEvent || ''],
      [],
      ['CAUSES'],
      [data.causes || 'Not specified'],
      [],
      ['BIODIVERSITY IMPACT'],
      [data.biodiversityImpact || 'Not specified'],
      [],
      ['PATTERNS & RECOVERY'],
      [data.patterns || 'Not specified'],
      [],
      ['CONSERVATION'],
      [data.conservation || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Mass Extinctions & Biodiversity', rows: rows });
  },

  generateMassExtinctionsPDF: function(filename, data) {
    var lines = [
      { text: 'MASS EXTINCTIONS & BIODIVERSITY', size: 18, bold: true },
      { text: (data.extinctionEvent || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CAUSES ──', size: 14, bold: true },
      { text: data.causes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BIODIVERSITY IMPACT ──', size: 14, bold: true },
      { text: data.biodiversityImpact || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── PATTERNS & RECOVERY ──', size: 14, bold: true },
      { text: data.patterns || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONSERVATION ──', size: 14, bold: true },
      { text: data.conservation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Mass Extinctions & Biodiversity', lines: lines });
  },

  // ============================================================
  // 8. EVO-DEVO
  // ============================================================

  generateEvoDevWord: async function(filename, data) {
    var sections = [
      { heading: 'Evolutionary Developmental Biology Worksheet', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Organism: ' + (data.organism || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Toolkit Genes', content: (data.toolkitGenes || 'Not specified').split('\n') },
      { heading: 'Morphological Innovation', content: (data.morphInnovation || 'Not specified').split('\n') },
      { heading: 'Heterochrony', content: (data.heterochrony || 'Not specified').split('\n') },
      { heading: 'Developmental Constraints', content: (data.constraints || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Evo-Devo — ' + (data.organism || ''), author: data.studentName || '', sections: sections });
  },

  generateEvoDevExcel: function(filename, data) {
    var rows = [
      ['Evo-Devo Worksheet'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Organism', data.organism || ''],
      [],
      ['TOOLKIT GENES'],
      [data.toolkitGenes || 'Not specified'],
      [],
      ['MORPHOLOGICAL INNOVATION'],
      [data.morphInnovation || 'Not specified'],
      [],
      ['HETEROCHRONY'],
      [data.heterochrony || 'Not specified'],
      [],
      ['DEVELOPMENTAL CONSTRAINTS'],
      [data.constraints || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Evo-Devo Worksheet', rows: rows });
  },

  generateEvoDevPDF: function(filename, data) {
    var lines = [
      { text: 'EVO-DEVO WORKSHEET', size: 18, bold: true },
      { text: (data.organism || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TOOLKIT GENES ──', size: 14, bold: true },
      { text: data.toolkitGenes || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MORPHOLOGICAL INNOVATION ──', size: 14, bold: true },
      { text: data.morphInnovation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HETEROCHRONY ──', size: 14, bold: true },
      { text: data.heterochrony || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEVELOPMENTAL CONSTRAINTS ──', size: 14, bold: true },
      { text: data.constraints || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Evo-Devo Worksheet', lines: lines });
  },

  // ============================================================
  // 9. BEHAVIORAL & SOCIAL EVOLUTION
  // ============================================================

  generateBehavioralEvolutionWord: async function(filename, data) {
    var sections = [
      { heading: 'Behavioral & Social Evolution Worksheet', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Species: ' + (data.species || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Cooperation & Altruism', content: (data.cooperation || 'Not specified').split('\n') },
      { heading: 'Game Theory Analysis', content: (data.gameTheory || 'Not specified').split('\n') },
      { heading: 'Sexual Selection', content: (data.sexualSelection || 'Not specified').split('\n') },
      { heading: 'Social Structure', content: (data.socialStructure || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Behavioral Evolution — ' + (data.species || ''), author: data.studentName || '', sections: sections });
  },

  generateBehavioralEvolutionExcel: function(filename, data) {
    var rows = [
      ['Behavioral & Social Evolution Worksheet'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Species', data.species || ''],
      [],
      ['COOPERATION & ALTRUISM'],
      [data.cooperation || 'Not specified'],
      [],
      ['GAME THEORY'],
      [data.gameTheory || 'Not specified'],
      [],
      ['SEXUAL SELECTION'],
      [data.sexualSelection || 'Not specified'],
      [],
      ['SOCIAL STRUCTURE'],
      [data.socialStructure || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Behavioral & Social Evolution', rows: rows });
  },

  generateBehavioralEvolutionPDF: function(filename, data) {
    var lines = [
      { text: 'BEHAVIORAL & SOCIAL EVOLUTION', size: 18, bold: true },
      { text: (data.species || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── COOPERATION & ALTRUISM ──', size: 14, bold: true },
      { text: data.cooperation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GAME THEORY ANALYSIS ──', size: 14, bold: true },
      { text: data.gameTheory || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SEXUAL SELECTION ──', size: 14, bold: true },
      { text: data.sexualSelection || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SOCIAL STRUCTURE ──', size: 14, bold: true },
      { text: data.socialStructure || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Behavioral & Social Evolution', lines: lines });
  },

  // ============================================================
  // 10. MATHEMATICAL & THEORETICAL EVOLUTION
  // ============================================================

  generateMathematicalEvolutionWord: async function(filename, data) {
    var sections = [
      { heading: 'Mathematical & Theoretical Evolution Worksheet', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Model Type: ' + (data.modelType || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Model Parameters', content: (data.parameters || 'Not specified').split('\n') },
      { heading: 'Fitness Landscape', content: (data.fitnessLandscape || 'Not specified').split('\n') },
      { heading: 'Selection Model', content: (data.selectionModel || 'Not specified').split('\n') },
      { heading: 'Simulation Results', content: (data.simulationResults || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Mathematical Evolution — ' + (data.modelType || ''), author: data.studentName || '', sections: sections });
  },

  generateMathematicalEvolutionExcel: function(filename, data) {
    var rows = [
      ['Mathematical & Theoretical Evolution Worksheet'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Model Type', data.modelType || ''],
      [],
      ['MODEL PARAMETERS'],
      [data.parameters || 'Not specified'],
      [],
      ['FITNESS LANDSCAPE'],
      [data.fitnessLandscape || 'Not specified'],
      [],
      ['SELECTION MODEL'],
      [data.selectionModel || 'Not specified'],
      [],
      ['SIMULATION RESULTS'],
      [data.simulationResults || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Mathematical Evolution', rows: rows });
  },

  generateMathematicalEvolutionPDF: function(filename, data) {
    var lines = [
      { text: 'MATHEMATICAL & THEORETICAL EVOLUTION', size: 18, bold: true },
      { text: (data.modelType || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── MODEL PARAMETERS ──', size: 14, bold: true },
      { text: data.parameters || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FITNESS LANDSCAPE ──', size: 14, bold: true },
      { text: data.fitnessLandscape || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SELECTION MODEL ──', size: 14, bold: true },
      { text: data.selectionModel || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SIMULATION RESULTS ──', size: 14, bold: true },
      { text: data.simulationResults || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Mathematical Evolution', lines: lines });
  },

  // ============================================================
  // 11. PALEONTOLOGY & FOSSIL INTERPRETATION
  // ============================================================

  generatePaleontologyWord: async function(filename, data) {
    var sections = [
      { heading: 'Paleontology & Fossil Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Fossil Specimen: ' + (data.fossilSpecimen || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Dating Method', content: (data.datingMethod || 'Not specified').split('\n') },
      { heading: 'Taphonomy', content: (data.taphonomy || 'Not specified').split('\n') },
      { heading: 'Transitional Features', content: (data.transitionalFeatures || 'Not specified').split('\n') },
      { heading: 'Evolutionary Significance', content: (data.evolutionarySignificance || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Paleontology — ' + (data.fossilSpecimen || ''), author: data.studentName || '', sections: sections });
  },

  generatePaleontologyExcel: function(filename, data) {
    var rows = [
      ['Paleontology & Fossil Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Fossil Specimen', data.fossilSpecimen || ''],
      [],
      ['DATING METHOD'],
      [data.datingMethod || 'Not specified'],
      [],
      ['TAPHONOMY'],
      [data.taphonomy || 'Not specified'],
      [],
      ['TRANSITIONAL FEATURES'],
      [data.transitionalFeatures || 'Not specified'],
      [],
      ['EVOLUTIONARY SIGNIFICANCE'],
      [data.evolutionarySignificance || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Paleontology & Fossil Analysis', rows: rows });
  },

  generatePaleontologyPDF: function(filename, data) {
    var lines = [
      { text: 'PALEONTOLOGY & FOSSIL ANALYSIS', size: 18, bold: true },
      { text: (data.fossilSpecimen || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DATING METHOD ──', size: 14, bold: true },
      { text: data.datingMethod || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TAPHONOMY ──', size: 14, bold: true },
      { text: data.taphonomy || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRANSITIONAL FEATURES ──', size: 14, bold: true },
      { text: data.transitionalFeatures || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVOLUTIONARY SIGNIFICANCE ──', size: 14, bold: true },
      { text: data.evolutionarySignificance || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Paleontology & Fossil Analysis', lines: lines });
  },

  // ============================================================
  // 12. EVOLUTIONARY GENOMICS
  // ============================================================

  generateEvolutionaryGenomicsWord: async function(filename, data) {
    var sections = [
      { heading: 'Evolutionary Genomics Analysis', content: [
          'Student: ' + (data.studentName || 'N/A'),
          'Organism / Group: ' + (data.organismGroup || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Genomic Features', content: (data.genomicFeatures || 'Not specified').split('\n') },
      { heading: 'Duplication & HGT Events', content: (data.duplicationEvents || 'Not specified').split('\n') },
      { heading: 'Epigenetic Findings', content: (data.epigeneticFindings || 'Not specified').split('\n') },
      { heading: 'Evolutionary Implications', content: (data.evolutionaryImplications || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Evolutionary Genomics — ' + (data.organismGroup || ''), author: data.studentName || '', sections: sections });
  },

  generateEvolutionaryGenomicsExcel: function(filename, data) {
    var rows = [
      ['Evolutionary Genomics Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['IDENTIFICATION'],
      ['Student', data.studentName || ''],
      ['Organism / Group', data.organismGroup || ''],
      [],
      ['GENOMIC FEATURES'],
      [data.genomicFeatures || 'Not specified'],
      [],
      ['DUPLICATION & HGT EVENTS'],
      [data.duplicationEvents || 'Not specified'],
      [],
      ['EPIGENETIC FINDINGS'],
      [data.epigeneticFindings || 'Not specified'],
      [],
      ['EVOLUTIONARY IMPLICATIONS'],
      [data.evolutionaryImplications || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Evolutionary Genomics', rows: rows });
  },

  generateEvolutionaryGenomicsPDF: function(filename, data) {
    var lines = [
      { text: 'EVOLUTIONARY GENOMICS ANALYSIS', size: 18, bold: true },
      { text: (data.organismGroup || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── GENOMIC FEATURES ──', size: 14, bold: true },
      { text: data.genomicFeatures || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DUPLICATION & HGT EVENTS ──', size: 14, bold: true },
      { text: data.duplicationEvents || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EPIGENETIC FINDINGS ──', size: 14, bold: true },
      { text: data.epigeneticFindings || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── EVOLUTIONARY IMPLICATIONS ──', size: 14, bold: true },
      { text: data.evolutionaryImplications || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NOTES ──', size: 14, bold: true },
      { text: data.notes || 'None', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Evolutionary Genomics', lines: lines });
  }

});
