/**
 * Doc Generator - Human Anatomy Series
 * Extends DocGenerator with human anatomy series document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * Generators:
 *  1.  AnatomicalTerminology  — Body orientation & directional terms worksheet
 *  2.  BoneInventory          — Skeletal system bone identification tracker
 *  3.  MuscleMapping          — Muscle origin/insertion/action worksheet
 *  4.  CardiacAnatomy         — Heart & vascular anatomy assessment
 *  5.  NeuroanatomyMap        — Cranial nerves & pathway mapper
 *  6.  VisceralOrganChart     — Organ location & function worksheet
 *  7.  HeadNeckExam           — Head, neck & special senses assessment
 *  8.  SurfaceLandmark        — Surface anatomy landmark identifier
 *  9.  HistologyReport        — Tissue identification & microscopic report
 * 10.  EmbryologyTracker      — Developmental stages & germ layer tracker
 * 11.  FunctionalAssessment   — Biomechanics & posture assessment
 * 12.  DissectionChecklist    — Regional dissection progress checklist
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. ANATOMICAL TERMINOLOGY WORKSHEET
  // ============================================================

  generateAnatomicalTerminologyWord: async function(filename, data) {
    var sections = [
      { heading: 'Anatomical Terminology Worksheet', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Body Region Focus: ' + (data.bodyRegion || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Directional Terms', content: [
          'Anterior Structure: ' + (data.anteriorStructure || 'N/A'),
          'Posterior Structure: ' + (data.posteriorStructure || 'N/A'),
          'Medial Landmark: ' + (data.medialLandmark || 'N/A'),
          'Lateral Landmark: ' + (data.lateralLandmark || 'N/A'),
          'Proximal Reference: ' + (data.proximalRef || 'N/A'),
          'Distal Reference: ' + (data.distalRef || 'N/A'),
          'Superior Structure: ' + (data.superiorStructure || 'N/A'),
          'Inferior Structure: ' + (data.inferiorStructure || 'N/A')
      ]},
      { heading: 'Body Planes & Sections', content: [
          'Sagittal Plane Observation: ' + (data.sagittalObs || 'N/A'),
          'Coronal Plane Observation: ' + (data.coronalObs || 'N/A'),
          'Transverse Plane Observation: ' + (data.transverseObs || 'N/A')
      ]},
      { heading: 'Body Cavities', content: [
          'Dorsal Cavity Contents: ' + (data.dorsalCavity || 'N/A'),
          'Ventral Cavity Contents: ' + (data.ventralCavity || 'N/A'),
          'Serous Membranes Noted: ' + (data.serousMembranes || 'N/A')
      ]},
      { heading: 'Clinical Orientation Notes', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Anatomical Terminology — ' + (data.bodyRegion || ''), author: data.authorName || '', sections: sections });
  },

  generateAnatomicalTerminologyExcel: function(filename, data) {
    var rows = [
      ['Anatomical Terminology Worksheet'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['DIRECTIONAL TERMS'],
      ['Direction', 'Structure / Landmark'],
      ['Anterior', data.anteriorStructure || ''],
      ['Posterior', data.posteriorStructure || ''],
      ['Medial', data.medialLandmark || ''],
      ['Lateral', data.lateralLandmark || ''],
      ['Proximal', data.proximalRef || ''],
      ['Distal', data.distalRef || ''],
      ['Superior', data.superiorStructure || ''],
      ['Inferior', data.inferiorStructure || ''],
      [],
      ['BODY PLANES'],
      ['Plane', 'Observation'],
      ['Sagittal', data.sagittalObs || ''],
      ['Coronal', data.coronalObs || ''],
      ['Transverse', data.transverseObs || ''],
      [],
      ['BODY CAVITIES'],
      ['Dorsal Cavity', data.dorsalCavity || ''],
      ['Ventral Cavity', data.ventralCavity || ''],
      ['Serous Membranes', data.serousMembranes || ''],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || ''],
      [],
      ['ADDITIONAL NOTES'],
      [data.notes || '']
    ];
    return this.generateExcel(filename, { title: 'Anatomical Terminology', rows: rows });
  },

  generateAnatomicalTerminologyPDF: function(filename, data) {
    var lines = [
      { text: 'ANATOMICAL TERMINOLOGY WORKSHEET', size: 18, bold: true },
      { text: (data.bodyRegion || 'General') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DIRECTIONAL TERMS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Anterior: ' + (data.anteriorStructure || 'N/A'), size: 10 },
      { text: 'Posterior: ' + (data.posteriorStructure || 'N/A'), size: 10 },
      { text: 'Medial: ' + (data.medialLandmark || 'N/A'), size: 10 },
      { text: 'Lateral: ' + (data.lateralLandmark || 'N/A'), size: 10 },
      { text: 'Proximal: ' + (data.proximalRef || 'N/A'), size: 10 },
      { text: 'Distal: ' + (data.distalRef || 'N/A'), size: 10 },
      { text: 'Superior: ' + (data.superiorStructure || 'N/A'), size: 10 },
      { text: 'Inferior: ' + (data.inferiorStructure || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── BODY PLANES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Sagittal: ' + (data.sagittalObs || 'N/A'), size: 10 },
      { text: 'Coronal: ' + (data.coronalObs || 'N/A'), size: 10 },
      { text: 'Transverse: ' + (data.transverseObs || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── BODY CAVITIES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Dorsal: ' + (data.dorsalCavity || 'N/A'), size: 10 },
      { text: 'Ventral: ' + (data.ventralCavity || 'N/A'), size: 10 },
      { text: 'Serous Membranes: ' + (data.serousMembranes || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── ADDITIONAL NOTES ──', size: 14, bold: true });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Anatomical Terminology Worksheet', lines: lines });
  },

  // ============================================================
  // 2. BONE INVENTORY TRACKER
  // ============================================================

  generateBoneInventoryWord: async function(filename, data) {
    var sections = [
      { heading: 'Bone Inventory Tracker', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Skeleton Region: ' + (data.skeletonRegion || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Bone Identification', content: [
          'Bone Name: ' + (data.boneName || 'N/A'),
          'Classification: ' + (data.boneClass || 'N/A'),
          'Region: ' + (data.boneRegion || 'N/A'),
          'Articulations: ' + (data.articulations || 'N/A')
      ]},
      { heading: 'Bone Markings & Features', content: [
          'Processes: ' + (data.processes || 'N/A'),
          'Foramina: ' + (data.foramina || 'N/A'),
          'Fossae: ' + (data.fossae || 'N/A'),
          'Tuberosities / Tubercles: ' + (data.tuberosities || 'N/A')
      ]},
      { heading: 'Blood Supply & Innervation', content: [
          'Arterial Supply: ' + (data.arterialSupply || 'N/A'),
          'Nerve Association: ' + (data.nerveAssoc || 'N/A')
      ]},
      { heading: 'Clinical Relevance', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Bone Inventory — ' + (data.boneName || ''), author: data.authorName || '', sections: sections });
  },

  generateBoneInventoryExcel: function(filename, data) {
    var rows = [
      ['Bone Inventory Tracker'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['BONE IDENTIFICATION'],
      ['Bone Name', data.boneName || ''],
      ['Classification', data.boneClass || ''],
      ['Region', data.boneRegion || ''],
      ['Articulations', data.articulations || ''],
      [],
      ['BONE MARKINGS & FEATURES'],
      ['Processes', data.processes || ''],
      ['Foramina', data.foramina || ''],
      ['Fossae', data.fossae || ''],
      ['Tuberosities', data.tuberosities || ''],
      [],
      ['BLOOD SUPPLY & INNERVATION'],
      ['Arterial Supply', data.arterialSupply || ''],
      ['Nerve Association', data.nerveAssoc || ''],
      [],
      ['CLINICAL RELEVANCE'],
      [data.clinicalNotes || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    return this.generateExcel(filename, { title: 'Bone Inventory', rows: rows });
  },

  generateBoneInventoryPDF: function(filename, data) {
    var lines = [
      { text: 'BONE INVENTORY TRACKER', size: 18, bold: true },
      { text: (data.boneName || '') + '  |  ' + (data.skeletonRegion || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── IDENTIFICATION ──', size: 14, bold: true },
      { text: 'Name: ' + (data.boneName || 'N/A'), size: 10 },
      { text: 'Classification: ' + (data.boneClass || 'N/A'), size: 10 },
      { text: 'Region: ' + (data.boneRegion || 'N/A'), size: 10 },
      { text: 'Articulations: ' + (data.articulations || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── MARKINGS & FEATURES ──', size: 14, bold: true },
      { text: 'Processes: ' + (data.processes || 'N/A'), size: 10 },
      { text: 'Foramina: ' + (data.foramina || 'N/A'), size: 10 },
      { text: 'Fossae: ' + (data.fossae || 'N/A'), size: 10 },
      { text: 'Tuberosities: ' + (data.tuberosities || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL RELEVANCE ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Bone Inventory Tracker', lines: lines });
  },

  // ============================================================
  // 3. MUSCLE MAPPING WORKSHEET
  // ============================================================

  generateMuscleMappingWord: async function(filename, data) {
    var sections = [
      { heading: 'Muscle Mapping Worksheet', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Muscle Name: ' + (data.muscleName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Muscle Identification', content: [
          'Muscle Name: ' + (data.muscleName || 'N/A'),
          'Muscle Group / Compartment: ' + (data.muscleGroup || 'N/A'),
          'Body Region: ' + (data.bodyRegion || 'N/A')
      ]},
      { heading: 'Origin, Insertion & Action', content: [
          'Origin: ' + (data.origin || 'N/A'),
          'Insertion: ' + (data.insertion || 'N/A'),
          'Primary Action: ' + (data.primaryAction || 'N/A'),
          'Secondary Action(s): ' + (data.secondaryAction || 'N/A')
      ]},
      { heading: 'Innervation & Blood Supply', content: [
          'Motor Nerve: ' + (data.motorNerve || 'N/A'),
          'Spinal Segment: ' + (data.spinalSegment || 'N/A'),
          'Arterial Supply: ' + (data.arterialSupply || 'N/A')
      ]},
      { heading: 'Functional Role', content: [
          'Agonist / Antagonist / Synergist: ' + (data.functionalRole || 'N/A'),
          'Movement Type: ' + (data.movementType || 'N/A')
      ]},
      { heading: 'Clinical Relevance', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Muscle Mapping — ' + (data.muscleName || ''), author: data.authorName || '', sections: sections });
  },

  generateMuscleMappingExcel: function(filename, data) {
    var rows = [
      ['Muscle Mapping Worksheet'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['MUSCLE IDENTIFICATION'],
      ['Muscle Name', data.muscleName || ''],
      ['Muscle Group', data.muscleGroup || ''],
      ['Body Region', data.bodyRegion || ''],
      [],
      ['ORIGIN, INSERTION & ACTION'],
      ['Origin', data.origin || ''],
      ['Insertion', data.insertion || ''],
      ['Primary Action', data.primaryAction || ''],
      ['Secondary Action', data.secondaryAction || ''],
      [],
      ['INNERVATION & BLOOD SUPPLY'],
      ['Motor Nerve', data.motorNerve || ''],
      ['Spinal Segment', data.spinalSegment || ''],
      ['Arterial Supply', data.arterialSupply || ''],
      [],
      ['FUNCTIONAL ROLE'],
      ['Role', data.functionalRole || ''],
      ['Movement Type', data.movementType || ''],
      [],
      ['CLINICAL RELEVANCE'],
      [data.clinicalNotes || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    return this.generateExcel(filename, { title: 'Muscle Mapping', rows: rows });
  },

  generateMuscleMappingPDF: function(filename, data) {
    var lines = [
      { text: 'MUSCLE MAPPING WORKSHEET', size: 18, bold: true },
      { text: (data.muscleName || '') + '  |  ' + (data.muscleGroup || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ORIGIN, INSERTION & ACTION ──', size: 14, bold: true },
      { text: 'Origin: ' + (data.origin || 'N/A'), size: 10 },
      { text: 'Insertion: ' + (data.insertion || 'N/A'), size: 10 },
      { text: 'Primary Action: ' + (data.primaryAction || 'N/A'), size: 10 },
      { text: 'Secondary Action: ' + (data.secondaryAction || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── INNERVATION & BLOOD SUPPLY ──', size: 14, bold: true },
      { text: 'Motor Nerve: ' + (data.motorNerve || 'N/A'), size: 10 },
      { text: 'Spinal Segment: ' + (data.spinalSegment || 'N/A'), size: 10 },
      { text: 'Arterial Supply: ' + (data.arterialSupply || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── FUNCTIONAL ROLE ──', size: 14, bold: true },
      { text: 'Role: ' + (data.functionalRole || 'N/A'), size: 10 },
      { text: 'Movement Type: ' + (data.movementType || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL RELEVANCE ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Muscle Mapping Worksheet', lines: lines });
  },

  // ============================================================
  // 4. CARDIAC ANATOMY ASSESSMENT
  // ============================================================

  generateCardiacAnatomyWord: async function(filename, data) {
    var sections = [
      { heading: 'Cardiac & Vascular Anatomy Assessment', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Focus Area: ' + (data.focusArea || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Heart Anatomy', content: [
          'Chambers Identified: ' + (data.chambers || 'N/A'),
          'Valves Identified: ' + (data.valves || 'N/A'),
          'Coronary Arteries: ' + (data.coronaryArteries || 'N/A'),
          'Conduction System: ' + (data.conductionSystem || 'N/A')
      ]},
      { heading: 'Vascular System', content: [
          'Major Arteries: ' + (data.majorArteries || 'N/A'),
          'Major Veins: ' + (data.majorVeins || 'N/A'),
          'Portal Systems: ' + (data.portalSystems || 'N/A')
      ]},
      { heading: 'Lymphatic System', content: [
          'Lymph Node Groups: ' + (data.lymphNodes || 'N/A'),
          'Lymphoid Organs: ' + (data.lymphoidOrgans || 'N/A')
      ]},
      { heading: 'Clinical Connections', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Cardiac Anatomy — ' + (data.focusArea || ''), author: data.authorName || '', sections: sections });
  },

  generateCardiacAnatomyExcel: function(filename, data) {
    var rows = [
      ['Cardiac & Vascular Anatomy Assessment'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['HEART ANATOMY'],
      ['Chambers', data.chambers || ''],
      ['Valves', data.valves || ''],
      ['Coronary Arteries', data.coronaryArteries || ''],
      ['Conduction System', data.conductionSystem || ''],
      [],
      ['VASCULAR SYSTEM'],
      ['Major Arteries', data.majorArteries || ''],
      ['Major Veins', data.majorVeins || ''],
      ['Portal Systems', data.portalSystems || ''],
      [],
      ['LYMPHATIC SYSTEM'],
      ['Lymph Node Groups', data.lymphNodes || ''],
      ['Lymphoid Organs', data.lymphoidOrgans || ''],
      [],
      ['CLINICAL CONNECTIONS'],
      [data.clinicalNotes || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    return this.generateExcel(filename, { title: 'Cardiac Anatomy', rows: rows });
  },

  generateCardiacAnatomyPDF: function(filename, data) {
    var lines = [
      { text: 'CARDIAC & VASCULAR ANATOMY ASSESSMENT', size: 18, bold: true },
      { text: (data.focusArea || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── HEART ANATOMY ──', size: 14, bold: true },
      { text: 'Chambers: ' + (data.chambers || 'N/A'), size: 10 },
      { text: 'Valves: ' + (data.valves || 'N/A'), size: 10 },
      { text: 'Coronary Arteries: ' + (data.coronaryArteries || 'N/A'), size: 10 },
      { text: 'Conduction: ' + (data.conductionSystem || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── VASCULAR SYSTEM ──', size: 14, bold: true },
      { text: 'Arteries: ' + (data.majorArteries || 'N/A'), size: 10 },
      { text: 'Veins: ' + (data.majorVeins || 'N/A'), size: 10 },
      { text: 'Portal Systems: ' + (data.portalSystems || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── LYMPHATIC SYSTEM ──', size: 14, bold: true },
      { text: 'Lymph Nodes: ' + (data.lymphNodes || 'N/A'), size: 10 },
      { text: 'Lymphoid Organs: ' + (data.lymphoidOrgans || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CONNECTIONS ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Cardiac Anatomy Assessment', lines: lines });
  },

  // ============================================================
  // 5. NEUROANATOMY PATHWAY MAPPER
  // ============================================================

  generateNeuroanatomyMapWord: async function(filename, data) {
    var sections = [
      { heading: 'Neuroanatomy Pathway Mapper', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Pathway / Structure: ' + (data.pathwayName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Neural Structure', content: [
          'Brain Region / Nerve: ' + (data.brainRegion || 'N/A'),
          'Origin Nucleus: ' + (data.originNucleus || 'N/A'),
          'Termination: ' + (data.termination || 'N/A'),
          'Pathway Type: ' + (data.pathwayType || 'N/A')
      ]},
      { heading: 'Functional Details', content: [
          'Modality: ' + (data.modality || 'N/A'),
          'Target Organ / Region: ' + (data.targetOrgan || 'N/A'),
          'Clinical Test: ' + (data.clinicalTest || 'N/A')
      ]},
      { heading: 'Cranial Nerve Details', content: [
          'Cranial Nerve Number: ' + (data.cnNumber || 'N/A'),
          'Cranial Nerve Name: ' + (data.cnName || 'N/A'),
          'Foramen of Exit: ' + (data.foramen || 'N/A'),
          'Function(s): ' + (data.cnFunction || 'N/A')
      ]},
      { heading: 'Clinical Correlations', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Neuroanatomy — ' + (data.pathwayName || ''), author: data.authorName || '', sections: sections });
  },

  generateNeuroanatomyMapExcel: function(filename, data) {
    var rows = [
      ['Neuroanatomy Pathway Mapper'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['NEURAL STRUCTURE'],
      ['Brain Region / Nerve', data.brainRegion || ''],
      ['Origin Nucleus', data.originNucleus || ''],
      ['Termination', data.termination || ''],
      ['Pathway Type', data.pathwayType || ''],
      [],
      ['FUNCTIONAL DETAILS'],
      ['Modality', data.modality || ''],
      ['Target Organ', data.targetOrgan || ''],
      ['Clinical Test', data.clinicalTest || ''],
      [],
      ['CRANIAL NERVE DETAILS'],
      ['CN Number', data.cnNumber || ''],
      ['CN Name', data.cnName || ''],
      ['Foramen', data.foramen || ''],
      ['Function(s)', data.cnFunction || ''],
      [],
      ['CLINICAL CORRELATIONS'],
      [data.clinicalNotes || ''],
      [],
      ['NOTES'],
      [data.notes || '']
    ];
    return this.generateExcel(filename, { title: 'Neuroanatomy Mapper', rows: rows });
  },

  generateNeuroanatomyMapPDF: function(filename, data) {
    var lines = [
      { text: 'NEUROANATOMY PATHWAY MAPPER', size: 18, bold: true },
      { text: (data.pathwayName || '') + '  |  ' + (data.brainRegion || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── NEURAL STRUCTURE ──', size: 14, bold: true },
      { text: 'Region: ' + (data.brainRegion || 'N/A'), size: 10 },
      { text: 'Origin: ' + (data.originNucleus || 'N/A'), size: 10 },
      { text: 'Termination: ' + (data.termination || 'N/A'), size: 10 },
      { text: 'Type: ' + (data.pathwayType || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CRANIAL NERVE ──', size: 14, bold: true },
      { text: 'CN ' + (data.cnNumber || '?') + ': ' + (data.cnName || 'N/A'), size: 10 },
      { text: 'Foramen: ' + (data.foramen || 'N/A'), size: 10 },
      { text: 'Function: ' + (data.cnFunction || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CORRELATIONS ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Neuroanatomy Pathway Mapper', lines: lines });
  },

  // ============================================================
  // 6. VISCERAL ORGAN CHART
  // ============================================================

  generateVisceralOrganChartWord: async function(filename, data) {
    var sections = [
      { heading: 'Visceral Organ Chart', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Organ: ' + (data.organName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Organ Identification', content: [
          'Organ Name: ' + (data.organName || 'N/A'),
          'Body Cavity: ' + (data.bodyCavity || 'N/A'),
          'Peritoneal Status: ' + (data.peritonealStatus || 'N/A'),
          'Quadrant / Region: ' + (data.quadrant || 'N/A')
      ]},
      { heading: 'Anatomical Relations', content: [
          'Anterior Relations: ' + (data.anteriorRelations || 'N/A'),
          'Posterior Relations: ' + (data.posteriorRelations || 'N/A'),
          'Superior Relations: ' + (data.superiorRelations || 'N/A'),
          'Inferior Relations: ' + (data.inferiorRelations || 'N/A')
      ]},
      { heading: 'Blood & Nerve Supply', content: [
          'Arterial Supply: ' + (data.arterialSupply || 'N/A'),
          'Venous Drainage: ' + (data.venousDrainage || 'N/A'),
          'Nerve Supply: ' + (data.nerveSupply || 'N/A'),
          'Lymph Drainage: ' + (data.lymphDrainage || 'N/A')
      ]},
      { heading: 'Function & Clinical Notes', content: [
          'Primary Function: ' + (data.primaryFunction || 'N/A'),
          'Clinical Relevance: ' + (data.clinicalNotes || 'N/A')
      ]}
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Visceral Organ — ' + (data.organName || ''), author: data.authorName || '', sections: sections });
  },

  generateVisceralOrganChartExcel: function(filename, data) {
    var rows = [
      ['Visceral Organ Chart'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['ORGAN IDENTIFICATION'],
      ['Organ Name', data.organName || ''],
      ['Body Cavity', data.bodyCavity || ''],
      ['Peritoneal Status', data.peritonealStatus || ''],
      ['Quadrant / Region', data.quadrant || ''],
      [],
      ['ANATOMICAL RELATIONS'],
      ['Anterior', data.anteriorRelations || ''],
      ['Posterior', data.posteriorRelations || ''],
      ['Superior', data.superiorRelations || ''],
      ['Inferior', data.inferiorRelations || ''],
      [],
      ['SUPPLY & DRAINAGE'],
      ['Arterial', data.arterialSupply || ''],
      ['Venous', data.venousDrainage || ''],
      ['Nerve', data.nerveSupply || ''],
      ['Lymph', data.lymphDrainage || ''],
      [],
      ['FUNCTION'],
      [data.primaryFunction || ''],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || '']
    ];
    return this.generateExcel(filename, { title: 'Visceral Organ Chart', rows: rows });
  },

  generateVisceralOrganChartPDF: function(filename, data) {
    var lines = [
      { text: 'VISCERAL ORGAN CHART', size: 18, bold: true },
      { text: (data.organName || '') + '  |  ' + (data.bodyCavity || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── IDENTIFICATION ──', size: 14, bold: true },
      { text: 'Organ: ' + (data.organName || 'N/A'), size: 10 },
      { text: 'Cavity: ' + (data.bodyCavity || 'N/A'), size: 10 },
      { text: 'Peritoneal: ' + (data.peritonealStatus || 'N/A'), size: 10 },
      { text: 'Quadrant: ' + (data.quadrant || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── RELATIONS ──', size: 14, bold: true },
      { text: 'Anterior: ' + (data.anteriorRelations || 'N/A'), size: 10 },
      { text: 'Posterior: ' + (data.posteriorRelations || 'N/A'), size: 10 },
      { text: 'Superior: ' + (data.superiorRelations || 'N/A'), size: 10 },
      { text: 'Inferior: ' + (data.inferiorRelations || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── SUPPLY & DRAINAGE ──', size: 14, bold: true },
      { text: 'Arterial: ' + (data.arterialSupply || 'N/A'), size: 10 },
      { text: 'Venous: ' + (data.venousDrainage || 'N/A'), size: 10 },
      { text: 'Nerve: ' + (data.nerveSupply || 'N/A'), size: 10 },
      { text: 'Lymph: ' + (data.lymphDrainage || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Visceral Organ Chart', lines: lines });
  },

  // ============================================================
  // 7. HEAD & NECK EXAM WORKSHEET
  // ============================================================

  generateHeadNeckExamWord: async function(filename, data) {
    var sections = [
      { heading: 'Head & Neck Examination Worksheet', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Focus Structure: ' + (data.focusStructure || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Skull & Foramina', content: [
          'Skull Bones Identified: ' + (data.skullBones || 'N/A'),
          'Key Foramina: ' + (data.keyForamina || 'N/A'),
          'Structures Traversing: ' + (data.foraminalContents || 'N/A')
      ]},
      { heading: 'Neck Triangles', content: [
          'Anterior Triangle Contents: ' + (data.anteriorTriangle || 'N/A'),
          'Posterior Triangle Contents: ' + (data.posteriorTriangle || 'N/A')
      ]},
      { heading: 'Special Senses', content: [
          'Eye Structures: ' + (data.eyeStructures || 'N/A'),
          'Ear Structures: ' + (data.earStructures || 'N/A'),
          'Olfactory Notes: ' + (data.olfactoryNotes || 'N/A'),
          'Taste Notes: ' + (data.tasteNotes || 'N/A')
      ]},
      { heading: 'Clinical Correlations', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Head & Neck — ' + (data.focusStructure || ''), author: data.authorName || '', sections: sections });
  },

  generateHeadNeckExamExcel: function(filename, data) {
    var rows = [
      ['Head & Neck Examination Worksheet'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['SKULL & FORAMINA'],
      ['Skull Bones', data.skullBones || ''],
      ['Key Foramina', data.keyForamina || ''],
      ['Foraminal Contents', data.foraminalContents || ''],
      [],
      ['NECK TRIANGLES'],
      ['Anterior Triangle', data.anteriorTriangle || ''],
      ['Posterior Triangle', data.posteriorTriangle || ''],
      [],
      ['SPECIAL SENSES'],
      ['Eye Structures', data.eyeStructures || ''],
      ['Ear Structures', data.earStructures || ''],
      ['Olfactory', data.olfactoryNotes || ''],
      ['Taste', data.tasteNotes || ''],
      [],
      ['CLINICAL CORRELATIONS'],
      [data.clinicalNotes || '']
    ];
    return this.generateExcel(filename, { title: 'Head & Neck Exam', rows: rows });
  },

  generateHeadNeckExamPDF: function(filename, data) {
    var lines = [
      { text: 'HEAD & NECK EXAMINATION WORKSHEET', size: 18, bold: true },
      { text: (data.focusStructure || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SKULL & FORAMINA ──', size: 14, bold: true },
      { text: 'Bones: ' + (data.skullBones || 'N/A'), size: 10 },
      { text: 'Foramina: ' + (data.keyForamina || 'N/A'), size: 10 },
      { text: 'Contents: ' + (data.foraminalContents || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── NECK TRIANGLES ──', size: 14, bold: true },
      { text: 'Anterior: ' + (data.anteriorTriangle || 'N/A'), size: 10 },
      { text: 'Posterior: ' + (data.posteriorTriangle || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── SPECIAL SENSES ──', size: 14, bold: true },
      { text: 'Eye: ' + (data.eyeStructures || 'N/A'), size: 10 },
      { text: 'Ear: ' + (data.earStructures || 'N/A'), size: 10 },
      { text: 'Olfactory: ' + (data.olfactoryNotes || 'N/A'), size: 10 },
      { text: 'Taste: ' + (data.tasteNotes || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CORRELATIONS ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Head & Neck Examination', lines: lines });
  },

  // ============================================================
  // 8. SURFACE LANDMARK IDENTIFIER
  // ============================================================

  generateSurfaceLandmarkWord: async function(filename, data) {
    var sections = [
      { heading: 'Surface Anatomy Landmark Identifier', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Body Region: ' + (data.bodyRegion || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Palpable Landmarks', content: [
          'Bony Landmarks: ' + (data.bonyLandmarks || 'N/A'),
          'Pulse Points: ' + (data.pulsePoints || 'N/A'),
          'Muscle Landmarks: ' + (data.muscleLandmarks || 'N/A')
      ]},
      { heading: 'Organ Projection Zones', content: [
          'Heart Borders: ' + (data.heartBorders || 'N/A'),
          'Lung Fields: ' + (data.lungFields || 'N/A'),
          'Abdominal Organs: ' + (data.abdominalOrgans || 'N/A')
      ]},
      { heading: 'Imaging Correlation', content: [
          'Imaging Modality: ' + (data.imagingModality || 'N/A'),
          'Key Findings: ' + (data.keyFindings || 'N/A'),
          'Anatomical Plane: ' + (data.anatomicalPlane || 'N/A')
      ]},
      { heading: 'Procedural Landmarks', content: [
          'Injection Sites: ' + (data.injectionSites || 'N/A'),
          'Emergency Landmarks: ' + (data.emergencyLandmarks || 'N/A')
      ]},
      { heading: 'Clinical Notes', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Surface Anatomy — ' + (data.bodyRegion || ''), author: data.authorName || '', sections: sections });
  },

  generateSurfaceLandmarkExcel: function(filename, data) {
    var rows = [
      ['Surface Anatomy Landmark Identifier'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      ['Body Region', data.bodyRegion || ''],
      [],
      ['PALPABLE LANDMARKS'],
      ['Bony Landmarks', data.bonyLandmarks || ''],
      ['Pulse Points', data.pulsePoints || ''],
      ['Muscle Landmarks', data.muscleLandmarks || ''],
      [],
      ['ORGAN PROJECTION ZONES'],
      ['Heart Borders', data.heartBorders || ''],
      ['Lung Fields', data.lungFields || ''],
      ['Abdominal Organs', data.abdominalOrgans || ''],
      [],
      ['IMAGING CORRELATION'],
      ['Modality', data.imagingModality || ''],
      ['Key Findings', data.keyFindings || ''],
      ['Anatomical Plane', data.anatomicalPlane || ''],
      [],
      ['PROCEDURAL LANDMARKS'],
      ['Injection Sites', data.injectionSites || ''],
      ['Emergency Landmarks', data.emergencyLandmarks || ''],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || '']
    ];
    return this.generateExcel(filename, { title: 'Surface Landmarks', rows: rows });
  },

  generateSurfaceLandmarkPDF: function(filename, data) {
    var lines = [
      { text: 'SURFACE ANATOMY LANDMARK IDENTIFIER', size: 18, bold: true },
      { text: (data.bodyRegion || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PALPABLE LANDMARKS ──', size: 14, bold: true },
      { text: 'Bony: ' + (data.bonyLandmarks || 'N/A'), size: 10 },
      { text: 'Pulse Points: ' + (data.pulsePoints || 'N/A'), size: 10 },
      { text: 'Muscles: ' + (data.muscleLandmarks || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── ORGAN PROJECTIONS ──', size: 14, bold: true },
      { text: 'Heart: ' + (data.heartBorders || 'N/A'), size: 10 },
      { text: 'Lungs: ' + (data.lungFields || 'N/A'), size: 10 },
      { text: 'Abdomen: ' + (data.abdominalOrgans || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── IMAGING ──', size: 14, bold: true },
      { text: 'Modality: ' + (data.imagingModality || 'N/A'), size: 10 },
      { text: 'Findings: ' + (data.keyFindings || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Surface Anatomy Landmarks', lines: lines });
  },

  // ============================================================
  // 9. HISTOLOGY REPORT
  // ============================================================

  generateHistologyReportWord: async function(filename, data) {
    var sections = [
      { heading: 'Histology & Microscopic Anatomy Report', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Tissue / Organ: ' + (data.tissueName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Tissue Classification', content: [
          'Primary Tissue Type: ' + (data.tissueType || 'N/A'),
          'Subtype: ' + (data.tissueSubtype || 'N/A'),
          'Location in Body: ' + (data.location || 'N/A')
      ]},
      { heading: 'Microscopic Features', content: [
          'Cell Shape: ' + (data.cellShape || 'N/A'),
          'Cell Arrangement: ' + (data.cellArrangement || 'N/A'),
          'Special Features: ' + (data.specialFeatures || 'N/A'),
          'Staining Characteristics: ' + (data.staining || 'N/A')
      ]},
      { heading: 'Organ Histology', content: [
          'Organ Name: ' + (data.organName || 'N/A'),
          'Parenchyma: ' + (data.parenchyma || 'N/A'),
          'Stroma: ' + (data.stroma || 'N/A'),
          'Unique Structures: ' + (data.uniqueStructures || 'N/A')
      ]},
      { heading: 'Clinical Correlations', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Histology — ' + (data.tissueName || ''), author: data.authorName || '', sections: sections });
  },

  generateHistologyReportExcel: function(filename, data) {
    var rows = [
      ['Histology & Microscopic Anatomy Report'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['TISSUE CLASSIFICATION'],
      ['Primary Type', data.tissueType || ''],
      ['Subtype', data.tissueSubtype || ''],
      ['Location', data.location || ''],
      [],
      ['MICROSCOPIC FEATURES'],
      ['Cell Shape', data.cellShape || ''],
      ['Cell Arrangement', data.cellArrangement || ''],
      ['Special Features', data.specialFeatures || ''],
      ['Staining', data.staining || ''],
      [],
      ['ORGAN HISTOLOGY'],
      ['Organ', data.organName || ''],
      ['Parenchyma', data.parenchyma || ''],
      ['Stroma', data.stroma || ''],
      ['Unique Structures', data.uniqueStructures || ''],
      [],
      ['CLINICAL CORRELATIONS'],
      [data.clinicalNotes || '']
    ];
    return this.generateExcel(filename, { title: 'Histology Report', rows: rows });
  },

  generateHistologyReportPDF: function(filename, data) {
    var lines = [
      { text: 'HISTOLOGY & MICROSCOPIC ANATOMY REPORT', size: 18, bold: true },
      { text: (data.tissueName || '') + '  |  ' + (data.tissueType || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── TISSUE CLASSIFICATION ──', size: 14, bold: true },
      { text: 'Type: ' + (data.tissueType || 'N/A'), size: 10 },
      { text: 'Subtype: ' + (data.tissueSubtype || 'N/A'), size: 10 },
      { text: 'Location: ' + (data.location || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── MICROSCOPIC FEATURES ──', size: 14, bold: true },
      { text: 'Cell Shape: ' + (data.cellShape || 'N/A'), size: 10 },
      { text: 'Arrangement: ' + (data.cellArrangement || 'N/A'), size: 10 },
      { text: 'Special Features: ' + (data.specialFeatures || 'N/A'), size: 10 },
      { text: 'Staining: ' + (data.staining || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── ORGAN HISTOLOGY ──', size: 14, bold: true },
      { text: 'Organ: ' + (data.organName || 'N/A'), size: 10 },
      { text: 'Parenchyma: ' + (data.parenchyma || 'N/A'), size: 10 },
      { text: 'Stroma: ' + (data.stroma || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL CORRELATIONS ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Histology Report', lines: lines });
  },

  // ============================================================
  // 10. EMBRYOLOGY TRACKER
  // ============================================================

  generateEmbryologyTrackerWord: async function(filename, data) {
    var sections = [
      { heading: 'Embryology & Developmental Tracker', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Organ / System: ' + (data.organSystem || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Germ Layer Origin', content: [
          'Primary Germ Layer: ' + (data.germLayer || 'N/A'),
          'Embryonic Structure: ' + (data.embryonicStructure || 'N/A'),
          'Week of Development: ' + (data.weekOfDev || 'N/A')
      ]},
      { heading: 'Developmental Stages', content: [
          'Stage 1 (Early): ' + (data.stage1 || 'N/A'),
          'Stage 2 (Intermediate): ' + (data.stage2 || 'N/A'),
          'Stage 3 (Late): ' + (data.stage3 || 'N/A'),
          'Adult Derivative: ' + (data.adultDerivative || 'N/A')
      ]},
      { heading: 'Congenital Malformations', content: [
          'Common Defect: ' + (data.commonDefect || 'N/A'),
          'Mechanism: ' + (data.mechanism || 'N/A'),
          'Incidence: ' + (data.incidence || 'N/A'),
          'Clinical Presentation: ' + (data.presentation || 'N/A')
      ]},
      { heading: 'Clinical Notes', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Embryology — ' + (data.organSystem || ''), author: data.authorName || '', sections: sections });
  },

  generateEmbryologyTrackerExcel: function(filename, data) {
    var rows = [
      ['Embryology & Developmental Tracker'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      [],
      ['GERM LAYER ORIGIN'],
      ['Germ Layer', data.germLayer || ''],
      ['Embryonic Structure', data.embryonicStructure || ''],
      ['Week of Development', data.weekOfDev || ''],
      [],
      ['DEVELOPMENTAL STAGES'],
      ['Stage 1 (Early)', data.stage1 || ''],
      ['Stage 2 (Intermediate)', data.stage2 || ''],
      ['Stage 3 (Late)', data.stage3 || ''],
      ['Adult Derivative', data.adultDerivative || ''],
      [],
      ['CONGENITAL MALFORMATIONS'],
      ['Common Defect', data.commonDefect || ''],
      ['Mechanism', data.mechanism || ''],
      ['Incidence', data.incidence || ''],
      ['Presentation', data.presentation || ''],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || '']
    ];
    return this.generateExcel(filename, { title: 'Embryology Tracker', rows: rows });
  },

  generateEmbryologyTrackerPDF: function(filename, data) {
    var lines = [
      { text: 'EMBRYOLOGY & DEVELOPMENTAL TRACKER', size: 18, bold: true },
      { text: (data.organSystem || '') + '  |  ' + (data.germLayer || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── GERM LAYER ORIGIN ──', size: 14, bold: true },
      { text: 'Germ Layer: ' + (data.germLayer || 'N/A'), size: 10 },
      { text: 'Embryonic Structure: ' + (data.embryonicStructure || 'N/A'), size: 10 },
      { text: 'Week: ' + (data.weekOfDev || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEVELOPMENTAL STAGES ──', size: 14, bold: true },
      { text: 'Early: ' + (data.stage1 || 'N/A'), size: 10 },
      { text: 'Intermediate: ' + (data.stage2 || 'N/A'), size: 10 },
      { text: 'Late: ' + (data.stage3 || 'N/A'), size: 10 },
      { text: 'Adult: ' + (data.adultDerivative || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONGENITAL MALFORMATIONS ──', size: 14, bold: true },
      { text: 'Defect: ' + (data.commonDefect || 'N/A'), size: 10 },
      { text: 'Mechanism: ' + (data.mechanism || 'N/A'), size: 10 },
      { text: 'Incidence: ' + (data.incidence || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Embryology Tracker', lines: lines });
  },

  // ============================================================
  // 11. FUNCTIONAL & BIOMECHANICS ASSESSMENT
  // ============================================================

  generateFunctionalAssessmentWord: async function(filename, data) {
    var sections = [
      { heading: 'Functional & Biomechanics Assessment', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Patient / Subject: ' + (data.patientName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Posture Assessment', content: [
          'Standing Posture: ' + (data.standingPosture || 'N/A'),
          'Spinal Alignment: ' + (data.spinalAlignment || 'N/A'),
          'Pelvic Tilt: ' + (data.pelvicTilt || 'N/A'),
          'Shoulder Level: ' + (data.shoulderLevel || 'N/A')
      ]},
      { heading: 'Gait Analysis', content: [
          'Gait Pattern: ' + (data.gaitPattern || 'N/A'),
          'Stride Length: ' + (data.strideLength || 'N/A'),
          'Cadence: ' + (data.cadence || 'N/A'),
          'Abnormalities: ' + (data.gaitAbnormalities || 'N/A')
      ]},
      { heading: 'Range of Motion', content: [
          'Joint Tested: ' + (data.jointTested || 'N/A'),
          'Active ROM: ' + (data.activeROM || 'N/A'),
          'Passive ROM: ' + (data.passiveROM || 'N/A'),
          'Limiting Factors: ' + (data.limitingFactors || 'N/A')
      ]},
      { heading: 'System Integration', content: [
          'Musculoskeletal: ' + (data.musculoskeletal || 'N/A'),
          'Neuromuscular: ' + (data.neuromuscular || 'N/A'),
          'Cardiovascular Response: ' + (data.cardiovascularResp || 'N/A')
      ]},
      { heading: 'Clinical Notes', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Functional Assessment — ' + (data.patientName || ''), author: data.authorName || '', sections: sections });
  },

  generateFunctionalAssessmentExcel: function(filename, data) {
    var rows = [
      ['Functional & Biomechanics Assessment'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      ['Patient', data.patientName || ''],
      [],
      ['POSTURE ASSESSMENT'],
      ['Standing Posture', data.standingPosture || ''],
      ['Spinal Alignment', data.spinalAlignment || ''],
      ['Pelvic Tilt', data.pelvicTilt || ''],
      ['Shoulder Level', data.shoulderLevel || ''],
      [],
      ['GAIT ANALYSIS'],
      ['Gait Pattern', data.gaitPattern || ''],
      ['Stride Length', data.strideLength || ''],
      ['Cadence', data.cadence || ''],
      ['Abnormalities', data.gaitAbnormalities || ''],
      [],
      ['RANGE OF MOTION'],
      ['Joint', data.jointTested || ''],
      ['Active ROM', data.activeROM || ''],
      ['Passive ROM', data.passiveROM || ''],
      ['Limiting Factors', data.limitingFactors || ''],
      [],
      ['SYSTEM INTEGRATION'],
      ['Musculoskeletal', data.musculoskeletal || ''],
      ['Neuromuscular', data.neuromuscular || ''],
      ['Cardiovascular', data.cardiovascularResp || ''],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || '']
    ];
    return this.generateExcel(filename, { title: 'Functional Assessment', rows: rows });
  },

  generateFunctionalAssessmentPDF: function(filename, data) {
    var lines = [
      { text: 'FUNCTIONAL & BIOMECHANICS ASSESSMENT', size: 18, bold: true },
      { text: (data.patientName || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── POSTURE ──', size: 14, bold: true },
      { text: 'Standing: ' + (data.standingPosture || 'N/A'), size: 10 },
      { text: 'Spine: ' + (data.spinalAlignment || 'N/A'), size: 10 },
      { text: 'Pelvis: ' + (data.pelvicTilt || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── GAIT ──', size: 14, bold: true },
      { text: 'Pattern: ' + (data.gaitPattern || 'N/A'), size: 10 },
      { text: 'Stride: ' + (data.strideLength || 'N/A'), size: 10 },
      { text: 'Abnormalities: ' + (data.gaitAbnormalities || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── RANGE OF MOTION ──', size: 14, bold: true },
      { text: 'Joint: ' + (data.jointTested || 'N/A'), size: 10 },
      { text: 'Active ROM: ' + (data.activeROM || 'N/A'), size: 10 },
      { text: 'Passive ROM: ' + (data.passiveROM || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Functional Assessment', lines: lines });
  },

  // ============================================================
  // 12. DISSECTION CHECKLIST
  // ============================================================

  generateDissectionChecklistWord: async function(filename, data) {
    var sections = [
      { heading: 'Regional Dissection Checklist', content: [
          'Student / Clinician: ' + (data.studentName || 'N/A'),
          'Body Region: ' + (data.bodyRegion || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Structures Identified', content: [
          'Muscles: ' + (data.muscles || 'N/A'),
          'Bones & Joints: ' + (data.bonesJoints || 'N/A'),
          'Arteries: ' + (data.arteries || 'N/A'),
          'Veins: ' + (data.veins || 'N/A'),
          'Nerves: ' + (data.nerves || 'N/A'),
          'Organs (if applicable): ' + (data.organs || 'N/A')
      ]},
      { heading: 'Dissection Layers', content: [
          'Skin & Superficial Fascia: ' + (data.skinLayer || 'N/A'),
          'Deep Fascia: ' + (data.deepFascia || 'N/A'),
          'Muscular Layer: ' + (data.muscularLayer || 'N/A'),
          'Neurovascular Bundle: ' + (data.nvBundle || 'N/A'),
          'Deep Structures: ' + (data.deepStructures || 'N/A')
      ]},
      { heading: 'Clinical Applications', content: [
          'Surgical Approaches: ' + (data.surgicalApproaches || 'N/A'),
          'Danger Zones: ' + (data.dangerZones || 'N/A'),
          'Clinical Relevance: ' + (data.clinicalNotes || 'N/A')
      ]}
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Dissection — ' + (data.bodyRegion || ''), author: data.authorName || '', sections: sections });
  },

  generateDissectionChecklistExcel: function(filename, data) {
    var rows = [
      ['Regional Dissection Checklist'],
      ['Generated', new Date().toLocaleDateString()],
      ['Student', data.studentName || ''],
      ['Body Region', data.bodyRegion || ''],
      [],
      ['STRUCTURES IDENTIFIED'],
      ['Muscles', data.muscles || ''],
      ['Bones & Joints', data.bonesJoints || ''],
      ['Arteries', data.arteries || ''],
      ['Veins', data.veins || ''],
      ['Nerves', data.nerves || ''],
      ['Organs', data.organs || ''],
      [],
      ['DISSECTION LAYERS'],
      ['Skin & Superficial Fascia', data.skinLayer || ''],
      ['Deep Fascia', data.deepFascia || ''],
      ['Muscular Layer', data.muscularLayer || ''],
      ['Neurovascular Bundle', data.nvBundle || ''],
      ['Deep Structures', data.deepStructures || ''],
      [],
      ['CLINICAL APPLICATIONS'],
      ['Surgical Approaches', data.surgicalApproaches || ''],
      ['Danger Zones', data.dangerZones || ''],
      ['Clinical Relevance', data.clinicalNotes || '']
    ];
    return this.generateExcel(filename, { title: 'Dissection Checklist', rows: rows });
  },

  generateDissectionChecklistPDF: function(filename, data) {
    var lines = [
      { text: 'REGIONAL DISSECTION CHECKLIST', size: 18, bold: true },
      { text: (data.bodyRegion || '') + '  |  ' + (data.studentName || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── STRUCTURES IDENTIFIED ──', size: 14, bold: true },
      { text: 'Muscles: ' + (data.muscles || 'N/A'), size: 10 },
      { text: 'Bones: ' + (data.bonesJoints || 'N/A'), size: 10 },
      { text: 'Arteries: ' + (data.arteries || 'N/A'), size: 10 },
      { text: 'Veins: ' + (data.veins || 'N/A'), size: 10 },
      { text: 'Nerves: ' + (data.nerves || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── DISSECTION LAYERS ──', size: 14, bold: true },
      { text: 'Skin: ' + (data.skinLayer || 'N/A'), size: 10 },
      { text: 'Deep Fascia: ' + (data.deepFascia || 'N/A'), size: 10 },
      { text: 'Muscle Layer: ' + (data.muscularLayer || 'N/A'), size: 10 },
      { text: 'NV Bundle: ' + (data.nvBundle || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL APPLICATIONS ──', size: 14, bold: true },
      { text: 'Surgical: ' + (data.surgicalApproaches || 'N/A'), size: 10 },
      { text: 'Danger Zones: ' + (data.dangerZones || 'N/A'), size: 10 },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Regional Dissection Checklist', lines: lines });
  }

});
