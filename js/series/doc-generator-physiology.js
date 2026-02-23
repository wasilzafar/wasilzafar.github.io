/**
 * Doc Generator - Physiology Series
 * Extends DocGenerator with physiology series document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * Generators:
 *  1. HomeostasisFeedback    — Feedback loop analysis worksheet
 *  2. NernstCalculator       — Nernst/GHK equilibrium potential calculator
 *  3. CardiacCycle           — Cardiac cycle & hemodynamics report
 *  4. PulmonaryFunction      — Pulmonary function test interpretation
 *  5. NephronFunction        — Nephron filtration/reabsorption worksheet
 *  6. GiMotility             — GI motility & secretion assessment
 *  7. EndocrineAxis          — Endocrine axis mapping worksheet
 *  8. ExercisePrescription   — Exercise prescription & VO2 max report
 *  9. CellSignaling          — Cell signaling pathway mapper
 * 10. BloodPanel             — Complete blood count interpretation
 * 11. ReproductiveCycle      — Reproductive hormone cycle tracker
 * 12. ClinicalIntegration    — Clinical case integration report
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. HOMEOSTASIS FEEDBACK LOOP ANALYSIS
  // ============================================================

  generateHomeostasisFeedbackWord: async function(filename, data) {
    var sections = [
      { heading: 'Homeostasis Feedback Loop Analysis', content: [
          'System Name: ' + (data.systemName || 'N/A'),
          'Physiological Variable: ' + (data.variable || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Set Point & Normal Range', content: [
          'Set Point Value: ' + (data.setPoint || 'N/A'),
          'Normal Range: ' + (data.normalRange || 'N/A'),
          'Measurement Units: ' + (data.units || 'N/A')
      ]},
      { heading: 'Control System Components', content: [
          'Sensor/Receptor: ' + (data.sensor || 'N/A'),
          'Afferent Pathway: ' + (data.afferent || 'N/A'),
          'Integration Center: ' + (data.integrator || 'N/A'),
          'Efferent Pathway: ' + (data.efferent || 'N/A'),
          'Effector(s): ' + (data.effector || 'N/A')
      ]},
      { heading: 'Feedback Type & Mechanism', content: [
          'Feedback Type: ' + (data.feedbackType || 'N/A'),
          'Response to Increase: ' + (data.responseIncrease || 'N/A'),
          'Response to Decrease: ' + (data.responseDecrease || 'N/A')
      ]},
      { heading: 'Clinical Relevance', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    if (data.notes) sections.push({ heading: 'Additional Notes', content: data.notes.split('\n') });
    return this.generateWord(filename, { title: 'Homeostasis Feedback Loop — ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateHomeostasisFeedbackExcel: function(filename, data) {
    var rows = [
      ['Homeostasis Feedback Loop Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['SYSTEM IDENTIFICATION'],
      ['System Name', data.systemName || ''],
      ['Physiological Variable', data.variable || ''],
      ['Set Point', data.setPoint || ''],
      ['Normal Range', data.normalRange || ''],
      ['Units', data.units || ''],
      [],
      ['CONTROL COMPONENTS'],
      ['Sensor / Receptor', data.sensor || ''],
      ['Afferent Pathway', data.afferent || ''],
      ['Integration Center', data.integrator || ''],
      ['Efferent Pathway', data.efferent || ''],
      ['Effector(s)', data.effector || ''],
      [],
      ['FEEDBACK MECHANISM'],
      ['Feedback Type', data.feedbackType || ''],
      ['Response to Increase', data.responseIncrease || ''],
      ['Response to Decrease', data.responseDecrease || ''],
      [],
      ['CLINICAL RELEVANCE'],
      [data.clinicalNotes || 'Not specified'],
      [],
      ['NOTES'],
      [data.notes || 'None']
    ];
    return this.generateExcel(filename, { title: 'Homeostasis Feedback Loop', rows: rows });
  },

  generateHomeostasisFeedbackPDF: function(filename, data) {
    var lines = [
      { text: 'HOMEOSTASIS FEEDBACK LOOP ANALYSIS', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.variable || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SET POINT & RANGE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Set Point: ' + (data.setPoint || 'N/A') + ' ' + (data.units || ''), size: 10 },
      { text: 'Normal Range: ' + (data.normalRange || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONTROL COMPONENTS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Sensor: ' + (data.sensor || 'N/A'), size: 10 },
      { text: 'Afferent: ' + (data.afferent || 'N/A'), size: 10 },
      { text: 'Integrator: ' + (data.integrator || 'N/A'), size: 10 },
      { text: 'Efferent: ' + (data.efferent || 'N/A'), size: 10 },
      { text: 'Effector: ' + (data.effector || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── FEEDBACK MECHANISM ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Type: ' + (data.feedbackType || 'N/A'), size: 10 },
      { text: 'Response to ↑: ' + (data.responseIncrease || 'N/A'), size: 10 },
      { text: 'Response to ↓: ' + (data.responseDecrease || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL RELEVANCE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    if (data.notes) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── NOTES ──', size: 14, bold: true });
      lines.push({ text: ' ', size: 4 });
      lines.push({ text: data.notes, size: 10 });
    }
    return this.generatePDF(filename, { title: 'Homeostasis Feedback Loop', lines: lines });
  },

  // ============================================================
  // 2. NERNST / GHK EQUILIBRIUM POTENTIAL CALCULATOR
  // ============================================================

  generateNernstCalculatorWord: async function(filename, data) {
    var sections = [
      { heading: 'Membrane Potential Calculator Report', content: [
          'Cell Type: ' + (data.cellType || 'N/A'),
          'Temperature: ' + (data.temperature || '37') + ' °C',
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Ion Concentrations (mM)', content: [
          'Na⁺ Extracellular: ' + (data.naOut || 'N/A') + ' mM',
          'Na⁺ Intracellular: ' + (data.naIn || 'N/A') + ' mM',
          'K⁺ Extracellular: ' + (data.kOut || 'N/A') + ' mM',
          'K⁺ Intracellular: ' + (data.kIn || 'N/A') + ' mM',
          'Cl⁻ Extracellular: ' + (data.clOut || 'N/A') + ' mM',
          'Cl⁻ Intracellular: ' + (data.clIn || 'N/A') + ' mM'
      ]},
      { heading: 'Relative Permeabilities', content: [
          'P(Na⁺): ' + (data.pNa || 'N/A'),
          'P(K⁺): ' + (data.pK || 'N/A'),
          'P(Cl⁻): ' + (data.pCl || 'N/A')
      ]},
      { heading: 'Calculated Results', content: [
          'Nernst E(Na⁺): ' + (data.eNa || 'N/A') + ' mV',
          'Nernst E(K⁺): ' + (data.eK || 'N/A') + ' mV',
          'Nernst E(Cl⁻): ' + (data.eCl || 'N/A') + ' mV',
          'GHK Resting Potential: ' + (data.vRest || 'N/A') + ' mV'
      ]},
      { heading: 'Clinical Interpretation', content: (data.interpretation || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Membrane Potential Calculator — ' + (data.cellType || ''), author: data.authorName || '', sections: sections });
  },

  generateNernstCalculatorExcel: function(filename, data) {
    var rows = [
      ['Membrane Potential Calculator'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['CELL INFORMATION'],
      ['Cell Type', data.cellType || ''],
      ['Temperature (°C)', data.temperature || '37'],
      [],
      ['ION CONCENTRATIONS (mM)'],
      ['Ion', 'Extracellular', 'Intracellular'],
      ['Na⁺', data.naOut || '', data.naIn || ''],
      ['K⁺', data.kOut || '', data.kIn || ''],
      ['Cl⁻', data.clOut || '', data.clIn || ''],
      [],
      ['RELATIVE PERMEABILITIES'],
      ['P(Na⁺)', data.pNa || ''],
      ['P(K⁺)', data.pK || ''],
      ['P(Cl⁻)', data.pCl || ''],
      [],
      ['CALCULATED EQUILIBRIUM POTENTIALS'],
      ['E(Na⁺) (mV)', data.eNa || ''],
      ['E(K⁺) (mV)', data.eK || ''],
      ['E(Cl⁻) (mV)', data.eCl || ''],
      ['GHK Vm (mV)', data.vRest || ''],
      [],
      ['INTERPRETATION'],
      [data.interpretation || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Membrane Potential Calculator', rows: rows });
  },

  generateNernstCalculatorPDF: function(filename, data) {
    var lines = [
      { text: 'MEMBRANE POTENTIAL CALCULATOR', size: 18, bold: true },
      { text: 'Cell Type: ' + (data.cellType || 'N/A') + '  |  T = ' + (data.temperature || '37') + '°C', size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ION CONCENTRATIONS (mM) ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Na⁺  Out: ' + (data.naOut || 'N/A') + '  |  In: ' + (data.naIn || 'N/A'), size: 10 },
      { text: 'K⁺   Out: ' + (data.kOut || 'N/A') + '  |  In: ' + (data.kIn || 'N/A'), size: 10 },
      { text: 'Cl⁻  Out: ' + (data.clOut || 'N/A') + '  |  In: ' + (data.clIn || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PERMEABILITIES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'P(Na⁺): ' + (data.pNa || 'N/A') + '  |  P(K⁺): ' + (data.pK || 'N/A') + '  |  P(Cl⁻): ' + (data.pCl || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── EQUILIBRIUM POTENTIALS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'E(Na⁺) = ' + (data.eNa || 'N/A') + ' mV', size: 10 },
      { text: 'E(K⁺) = ' + (data.eK || 'N/A') + ' mV', size: 10 },
      { text: 'E(Cl⁻) = ' + (data.eCl || 'N/A') + ' mV', size: 10 },
      { text: 'GHK Vm = ' + (data.vRest || 'N/A') + ' mV', size: 11, bold: true },
      { text: ' ', size: 6 },
      { text: '── INTERPRETATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.interpretation || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Membrane Potential Calculator', lines: lines });
  },

  // ============================================================
  // 3. CARDIAC CYCLE & HEMODYNAMICS REPORT
  // ============================================================

  generateCardiacCycleWord: async function(filename, data) {
    var sections = [
      { heading: 'Cardiac Cycle & Hemodynamics Report', content: [
          'Patient / Subject: ' + (data.patientName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Cardiac Parameters', content: [
          'Heart Rate (HR): ' + (data.heartRate || 'N/A') + ' bpm',
          'Stroke Volume (SV): ' + (data.strokeVolume || 'N/A') + ' mL',
          'Cardiac Output (CO): ' + (data.cardiacOutput || 'N/A') + ' L/min',
          'Ejection Fraction (EF): ' + (data.ejectionFraction || 'N/A') + '%',
          'End-Diastolic Volume: ' + (data.edv || 'N/A') + ' mL',
          'End-Systolic Volume: ' + (data.esv || 'N/A') + ' mL'
      ]},
      { heading: 'Blood Pressure & Resistance', content: [
          'Systolic BP: ' + (data.systolicBP || 'N/A') + ' mmHg',
          'Diastolic BP: ' + (data.diastolicBP || 'N/A') + ' mmHg',
          'Mean Arterial Pressure: ' + (data.map || 'N/A') + ' mmHg',
          'Total Peripheral Resistance: ' + (data.tpr || 'N/A') + ' mmHg·min/L',
          'Pulse Pressure: ' + (data.pulsePressure || 'N/A') + ' mmHg'
      ]},
      { heading: 'ECG Findings', content: (data.ecgFindings || 'Not specified').split('\n') },
      { heading: 'Clinical Notes', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Cardiac Cycle Report — ' + (data.patientName || ''), author: data.authorName || '', sections: sections });
  },

  generateCardiacCycleExcel: function(filename, data) {
    var rows = [
      ['Cardiac Cycle & Hemodynamics Report'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['PATIENT'],
      ['Name / Subject', data.patientName || ''],
      [],
      ['CARDIAC PARAMETERS'],
      ['Heart Rate (bpm)', data.heartRate || ''],
      ['Stroke Volume (mL)', data.strokeVolume || ''],
      ['Cardiac Output (L/min)', data.cardiacOutput || ''],
      ['Ejection Fraction (%)', data.ejectionFraction || ''],
      ['End-Diastolic Volume (mL)', data.edv || ''],
      ['End-Systolic Volume (mL)', data.esv || ''],
      [],
      ['BLOOD PRESSURE & RESISTANCE'],
      ['Systolic BP (mmHg)', data.systolicBP || ''],
      ['Diastolic BP (mmHg)', data.diastolicBP || ''],
      ['Mean Arterial Pressure (mmHg)', data.map || ''],
      ['Total Peripheral Resistance', data.tpr || ''],
      ['Pulse Pressure (mmHg)', data.pulsePressure || ''],
      [],
      ['ECG FINDINGS'],
      [data.ecgFindings || 'Not specified'],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Cardiac Cycle Report', rows: rows });
  },

  generateCardiacCyclePDF: function(filename, data) {
    var lines = [
      { text: 'CARDIAC CYCLE & HEMODYNAMICS REPORT', size: 18, bold: true },
      { text: 'Patient: ' + (data.patientName || 'N/A'), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CARDIAC PARAMETERS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'HR: ' + (data.heartRate || 'N/A') + ' bpm  |  SV: ' + (data.strokeVolume || 'N/A') + ' mL', size: 10 },
      { text: 'CO: ' + (data.cardiacOutput || 'N/A') + ' L/min  |  EF: ' + (data.ejectionFraction || 'N/A') + '%', size: 10 },
      { text: 'EDV: ' + (data.edv || 'N/A') + ' mL  |  ESV: ' + (data.esv || 'N/A') + ' mL', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BLOOD PRESSURE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'BP: ' + (data.systolicBP || 'N/A') + '/' + (data.diastolicBP || 'N/A') + ' mmHg', size: 10 },
      { text: 'MAP: ' + (data.map || 'N/A') + ' mmHg  |  PP: ' + (data.pulsePressure || 'N/A') + ' mmHg', size: 10 },
      { text: 'TPR: ' + (data.tpr || 'N/A') + ' mmHg·min/L', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ECG FINDINGS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.ecgFindings || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Cardiac Cycle Report', lines: lines });
  },

  // ============================================================
  // 4. PULMONARY FUNCTION TEST INTERPRETATION
  // ============================================================

  generatePulmonaryFunctionWord: async function(filename, data) {
    var sections = [
      { heading: 'Pulmonary Function Test Report', content: [
          'Patient / Subject: ' + (data.patientName || 'N/A'),
          'Age: ' + (data.age || 'N/A') + '  |  Height: ' + (data.height || 'N/A') + ' cm',
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Spirometry Results', content: [
          'Tidal Volume (TV): ' + (data.tidalVolume || 'N/A') + ' mL',
          'Inspiratory Reserve (IRV): ' + (data.irv || 'N/A') + ' mL',
          'Expiratory Reserve (ERV): ' + (data.erv || 'N/A') + ' mL',
          'Residual Volume (RV): ' + (data.residualVolume || 'N/A') + ' mL',
          'Vital Capacity (VC): ' + (data.vitalCapacity || 'N/A') + ' mL',
          'Total Lung Capacity (TLC): ' + (data.tlc || 'N/A') + ' mL',
          'FEV1: ' + (data.fev1 || 'N/A') + ' L',
          'FVC: ' + (data.fvc || 'N/A') + ' L',
          'FEV1/FVC Ratio: ' + (data.fev1Fvc || 'N/A') + '%'
      ]},
      { heading: 'Gas Exchange', content: [
          'DLCO: ' + (data.dlco || 'N/A'),
          'PaO2: ' + (data.paO2 || 'N/A') + ' mmHg',
          'PaCO2: ' + (data.paCO2 || 'N/A') + ' mmHg',
          'SpO2: ' + (data.spO2 || 'N/A') + '%'
      ]},
      { heading: 'Interpretation', content: (data.interpretation || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Pulmonary Function Report — ' + (data.patientName || ''), author: data.authorName || '', sections: sections });
  },

  generatePulmonaryFunctionExcel: function(filename, data) {
    var rows = [
      ['Pulmonary Function Test Report'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['PATIENT'],
      ['Name', data.patientName || ''],
      ['Age', data.age || ''],
      ['Height (cm)', data.height || ''],
      [],
      ['SPIROMETRY'],
      ['Measurement', 'Value', 'Units'],
      ['Tidal Volume (TV)', data.tidalVolume || '', 'mL'],
      ['Inspiratory Reserve (IRV)', data.irv || '', 'mL'],
      ['Expiratory Reserve (ERV)', data.erv || '', 'mL'],
      ['Residual Volume (RV)', data.residualVolume || '', 'mL'],
      ['Vital Capacity (VC)', data.vitalCapacity || '', 'mL'],
      ['Total Lung Capacity (TLC)', data.tlc || '', 'mL'],
      ['FEV1', data.fev1 || '', 'L'],
      ['FVC', data.fvc || '', 'L'],
      ['FEV1/FVC Ratio', data.fev1Fvc || '', '%'],
      [],
      ['GAS EXCHANGE'],
      ['DLCO', data.dlco || ''],
      ['PaO2 (mmHg)', data.paO2 || ''],
      ['PaCO2 (mmHg)', data.paCO2 || ''],
      ['SpO2 (%)', data.spO2 || ''],
      [],
      ['INTERPRETATION'],
      [data.interpretation || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Pulmonary Function Report', rows: rows });
  },

  generatePulmonaryFunctionPDF: function(filename, data) {
    var lines = [
      { text: 'PULMONARY FUNCTION TEST REPORT', size: 18, bold: true },
      { text: 'Patient: ' + (data.patientName || 'N/A') + '  |  Age: ' + (data.age || 'N/A') + '  |  Height: ' + (data.height || 'N/A') + ' cm', size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SPIROMETRY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'TV: ' + (data.tidalVolume || 'N/A') + ' mL  |  IRV: ' + (data.irv || 'N/A') + ' mL  |  ERV: ' + (data.erv || 'N/A') + ' mL', size: 10 },
      { text: 'RV: ' + (data.residualVolume || 'N/A') + ' mL  |  VC: ' + (data.vitalCapacity || 'N/A') + ' mL  |  TLC: ' + (data.tlc || 'N/A') + ' mL', size: 10 },
      { text: 'FEV1: ' + (data.fev1 || 'N/A') + ' L  |  FVC: ' + (data.fvc || 'N/A') + ' L  |  FEV1/FVC: ' + (data.fev1Fvc || 'N/A') + '%', size: 10 },
      { text: ' ', size: 6 },
      { text: '── GAS EXCHANGE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'DLCO: ' + (data.dlco || 'N/A'), size: 10 },
      { text: 'PaO2: ' + (data.paO2 || 'N/A') + ' mmHg  |  PaCO2: ' + (data.paCO2 || 'N/A') + ' mmHg  |  SpO2: ' + (data.spO2 || 'N/A') + '%', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERPRETATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.interpretation || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Pulmonary Function Report', lines: lines });
  },

  // ============================================================
  // 5. NEPHRON FUNCTION WORKSHEET
  // ============================================================

  generateNephronFunctionWord: async function(filename, data) {
    var sections = [
      { heading: 'Nephron Function Analysis', content: [
          'Patient / Subject: ' + (data.patientName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Glomerular Filtration', content: [
          'GFR: ' + (data.gfr || 'N/A') + ' mL/min',
          'Renal Plasma Flow: ' + (data.rpf || 'N/A') + ' mL/min',
          'Filtration Fraction: ' + (data.filtrationFraction || 'N/A'),
          'Serum Creatinine: ' + (data.creatinine || 'N/A') + ' mg/dL',
          'BUN: ' + (data.bun || 'N/A') + ' mg/dL'
      ]},
      { heading: 'Tubular Function', content: [
          'Na⁺ Reabsorption (%): ' + (data.naReabsorption || 'N/A'),
          'Glucose Threshold: ' + (data.glucoseThreshold || 'N/A') + ' mg/dL',
          'Urine Osmolality: ' + (data.urineOsm || 'N/A') + ' mOsm/kg',
          'Plasma Osmolality: ' + (data.plasmaOsm || 'N/A') + ' mOsm/kg'
      ]},
      { heading: 'Acid-Base Status', content: [
          'Arterial pH: ' + (data.pH || 'N/A'),
          'HCO3⁻: ' + (data.bicarb || 'N/A') + ' mEq/L',
          'Anion Gap: ' + (data.anionGap || 'N/A') + ' mEq/L'
      ]},
      { heading: 'Clinical Notes', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Nephron Function Analysis — ' + (data.patientName || ''), author: data.authorName || '', sections: sections });
  },

  generateNephronFunctionExcel: function(filename, data) {
    var rows = [
      ['Nephron Function Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['PATIENT'],
      ['Name', data.patientName || ''],
      [],
      ['GLOMERULAR FILTRATION'],
      ['GFR (mL/min)', data.gfr || ''],
      ['Renal Plasma Flow (mL/min)', data.rpf || ''],
      ['Filtration Fraction', data.filtrationFraction || ''],
      ['Serum Creatinine (mg/dL)', data.creatinine || ''],
      ['BUN (mg/dL)', data.bun || ''],
      [],
      ['TUBULAR FUNCTION'],
      ['Na⁺ Reabsorption (%)', data.naReabsorption || ''],
      ['Glucose Threshold (mg/dL)', data.glucoseThreshold || ''],
      ['Urine Osmolality (mOsm/kg)', data.urineOsm || ''],
      ['Plasma Osmolality (mOsm/kg)', data.plasmaOsm || ''],
      [],
      ['ACID-BASE STATUS'],
      ['Arterial pH', data.pH || ''],
      ['HCO3⁻ (mEq/L)', data.bicarb || ''],
      ['Anion Gap (mEq/L)', data.anionGap || ''],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Nephron Function Analysis', rows: rows });
  },

  generateNephronFunctionPDF: function(filename, data) {
    var lines = [
      { text: 'NEPHRON FUNCTION ANALYSIS', size: 18, bold: true },
      { text: 'Patient: ' + (data.patientName || 'N/A'), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── GLOMERULAR FILTRATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'GFR: ' + (data.gfr || 'N/A') + ' mL/min  |  RPF: ' + (data.rpf || 'N/A') + ' mL/min', size: 10 },
      { text: 'FF: ' + (data.filtrationFraction || 'N/A') + '  |  Cr: ' + (data.creatinine || 'N/A') + ' mg/dL  |  BUN: ' + (data.bun || 'N/A') + ' mg/dL', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TUBULAR FUNCTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Na⁺ Reabsorption: ' + (data.naReabsorption || 'N/A') + '%', size: 10 },
      { text: 'Glucose Threshold: ' + (data.glucoseThreshold || 'N/A') + ' mg/dL', size: 10 },
      { text: 'Urine Osm: ' + (data.urineOsm || 'N/A') + '  |  Plasma Osm: ' + (data.plasmaOsm || 'N/A') + ' mOsm/kg', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ACID-BASE STATUS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'pH: ' + (data.pH || 'N/A') + '  |  HCO3⁻: ' + (data.bicarb || 'N/A') + ' mEq/L  |  AG: ' + (data.anionGap || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Nephron Function Analysis', lines: lines });
  },

  // ============================================================
  // 6. GI MOTILITY & SECRETION ASSESSMENT
  // ============================================================

  generateGiMotilityWord: async function(filename, data) {
    var sections = [
      { heading: 'GI Motility & Secretion Assessment', content: [
          'Patient / Subject: ' + (data.patientName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Motility Assessment', content: [
          'Region: ' + (data.giRegion || 'N/A'),
          'Motility Pattern: ' + (data.motilityPattern || 'N/A'),
          'Contraction Frequency: ' + (data.frequency || 'N/A'),
          'Transit Time: ' + (data.transitTime || 'N/A')
      ]},
      { heading: 'Secretory Function', content: [
          'Gastric pH: ' + (data.gastricPH || 'N/A'),
          'HCl Output: ' + (data.hclOutput || 'N/A'),
          'Pancreatic Enzymes: ' + (data.pancreaticEnzymes || 'N/A'),
          'Bile Flow: ' + (data.bileFlow || 'N/A')
      ]},
      { heading: 'Hormonal Regulators', content: [
          'Gastrin Level: ' + (data.gastrin || 'N/A'),
          'CCK Level: ' + (data.cck || 'N/A'),
          'Secretin Level: ' + (data.secretin || 'N/A'),
          'GIP Level: ' + (data.gip || 'N/A')
      ]},
      { heading: 'Clinical Findings', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'GI Assessment — ' + (data.patientName || ''), author: data.authorName || '', sections: sections });
  },

  generateGiMotilityExcel: function(filename, data) {
    var rows = [
      ['GI Motility & Secretion Assessment'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['PATIENT'],
      ['Name', data.patientName || ''],
      [],
      ['MOTILITY'],
      ['Region', data.giRegion || ''],
      ['Pattern', data.motilityPattern || ''],
      ['Contraction Frequency', data.frequency || ''],
      ['Transit Time', data.transitTime || ''],
      [],
      ['SECRETION'],
      ['Gastric pH', data.gastricPH || ''],
      ['HCl Output', data.hclOutput || ''],
      ['Pancreatic Enzymes', data.pancreaticEnzymes || ''],
      ['Bile Flow', data.bileFlow || ''],
      [],
      ['HORMONES'],
      ['Gastrin', data.gastrin || ''],
      ['CCK', data.cck || ''],
      ['Secretin', data.secretin || ''],
      ['GIP', data.gip || ''],
      [],
      ['CLINICAL FINDINGS'],
      [data.clinicalNotes || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'GI Assessment', rows: rows });
  },

  generateGiMotilityPDF: function(filename, data) {
    var lines = [
      { text: 'GI MOTILITY & SECRETION ASSESSMENT', size: 18, bold: true },
      { text: 'Patient: ' + (data.patientName || 'N/A'), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── MOTILITY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Region: ' + (data.giRegion || 'N/A') + '  |  Pattern: ' + (data.motilityPattern || 'N/A'), size: 10 },
      { text: 'Frequency: ' + (data.frequency || 'N/A') + '  |  Transit: ' + (data.transitTime || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── SECRETION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Gastric pH: ' + (data.gastricPH || 'N/A') + '  |  HCl: ' + (data.hclOutput || 'N/A'), size: 10 },
      { text: 'Pancreatic: ' + (data.pancreaticEnzymes || 'N/A') + '  |  Bile: ' + (data.bileFlow || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── HORMONES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Gastrin: ' + (data.gastrin || 'N/A') + '  |  CCK: ' + (data.cck || 'N/A'), size: 10 },
      { text: 'Secretin: ' + (data.secretin || 'N/A') + '  |  GIP: ' + (data.gip || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL FINDINGS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'GI Assessment', lines: lines });
  },

  // ============================================================
  // 7. ENDOCRINE AXIS MAPPING WORKSHEET
  // ============================================================

  generateEndocrineAxisWord: async function(filename, data) {
    var sections = [
      { heading: 'Endocrine Axis Mapping', content: [
          'Axis Name: ' + (data.axisName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Hypothalamic Level', content: [
          'Releasing Hormone: ' + (data.releasingHormone || 'N/A'),
          'Inhibiting Hormone: ' + (data.inhibitingHormone || 'N/A'),
          'Stimulus: ' + (data.stimulus || 'N/A')
      ]},
      { heading: 'Anterior Pituitary', content: [
          'Tropic Hormone: ' + (data.tropicHormone || 'N/A'),
          'Receptor Type: ' + (data.receptorType || 'N/A')
      ]},
      { heading: 'Target Gland / Organ', content: [
          'Target: ' + (data.targetGland || 'N/A'),
          'End Hormone: ' + (data.endHormone || 'N/A'),
          'Normal Range: ' + (data.normalRange || 'N/A')
      ]},
      { heading: 'Feedback Regulation', content: [
          'Negative Feedback: ' + (data.negativeFeedback || 'N/A'),
          'Positive Feedback (if any): ' + (data.positiveFeedback || 'N/A'),
          'Ultra-short Feedback: ' + (data.ultraShort || 'N/A')
      ]},
      { heading: 'Clinical Disorders', content: (data.disorders || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Endocrine Axis — ' + (data.axisName || ''), author: data.authorName || '', sections: sections });
  },

  generateEndocrineAxisExcel: function(filename, data) {
    var rows = [
      ['Endocrine Axis Mapping'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['AXIS'],
      ['Axis Name', data.axisName || ''],
      [],
      ['HYPOTHALAMIC LEVEL'],
      ['Releasing Hormone', data.releasingHormone || ''],
      ['Inhibiting Hormone', data.inhibitingHormone || ''],
      ['Stimulus', data.stimulus || ''],
      [],
      ['ANTERIOR PITUITARY'],
      ['Tropic Hormone', data.tropicHormone || ''],
      ['Receptor Type', data.receptorType || ''],
      [],
      ['TARGET GLAND'],
      ['Target', data.targetGland || ''],
      ['End Hormone', data.endHormone || ''],
      ['Normal Range', data.normalRange || ''],
      [],
      ['FEEDBACK'],
      ['Negative Feedback', data.negativeFeedback || ''],
      ['Positive Feedback', data.positiveFeedback || ''],
      ['Ultra-short Loop', data.ultraShort || ''],
      [],
      ['CLINICAL DISORDERS'],
      [data.disorders || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Endocrine Axis Mapping', rows: rows });
  },

  generateEndocrineAxisPDF: function(filename, data) {
    var lines = [
      { text: 'ENDOCRINE AXIS MAPPING', size: 18, bold: true },
      { text: 'Axis: ' + (data.axisName || 'N/A'), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── HYPOTHALAMIC LEVEL ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Releasing: ' + (data.releasingHormone || 'N/A'), size: 10 },
      { text: 'Inhibiting: ' + (data.inhibitingHormone || 'N/A'), size: 10 },
      { text: 'Stimulus: ' + (data.stimulus || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── ANTERIOR PITUITARY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Tropic Hormone: ' + (data.tropicHormone || 'N/A'), size: 10 },
      { text: 'Receptor: ' + (data.receptorType || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── TARGET GLAND ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Target: ' + (data.targetGland || 'N/A'), size: 10 },
      { text: 'End Hormone: ' + (data.endHormone || 'N/A') + '  |  Range: ' + (data.normalRange || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── FEEDBACK REGULATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Negative: ' + (data.negativeFeedback || 'N/A'), size: 10 },
      { text: 'Positive: ' + (data.positiveFeedback || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL DISORDERS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.disorders || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Endocrine Axis Mapping', lines: lines });
  },

  // ============================================================
  // 8. EXERCISE PRESCRIPTION & VO2 MAX REPORT
  // ============================================================

  generateExercisePrescriptionWord: async function(filename, data) {
    var sections = [
      { heading: 'Exercise Prescription & VO₂ Max Report', content: [
          'Subject: ' + (data.subjectName || 'N/A'),
          'Age: ' + (data.age || 'N/A') + '  |  Weight: ' + (data.weight || 'N/A') + ' kg',
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Baseline Fitness', content: [
          'Resting HR: ' + (data.restingHR || 'N/A') + ' bpm',
          'Max HR (measured/predicted): ' + (data.maxHR || 'N/A') + ' bpm',
          'VO₂ Max: ' + (data.vo2Max || 'N/A') + ' mL/kg/min',
          'Lactate Threshold HR: ' + (data.lactateThresholdHR || 'N/A') + ' bpm',
          'Resting Blood Pressure: ' + (data.restingBP || 'N/A') + ' mmHg'
      ]},
      { heading: 'Training Zones', content: [
          'Zone 1 (Recovery): ' + (data.zone1 || 'N/A'),
          'Zone 2 (Aerobic): ' + (data.zone2 || 'N/A'),
          'Zone 3 (Tempo): ' + (data.zone3 || 'N/A'),
          'Zone 4 (Threshold): ' + (data.zone4 || 'N/A'),
          'Zone 5 (VO₂ Max): ' + (data.zone5 || 'N/A')
      ]},
      { heading: 'Exercise Prescription', content: [
          'Modality: ' + (data.modality || 'N/A'),
          'Frequency: ' + (data.frequency || 'N/A') + ' sessions/week',
          'Intensity: ' + (data.intensity || 'N/A'),
          'Duration: ' + (data.duration || 'N/A') + ' min/session',
          'Progression: ' + (data.progression || 'N/A')
      ]},
      { heading: 'Goals & Notes', content: (data.goals || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Exercise Prescription — ' + (data.subjectName || ''), author: data.authorName || '', sections: sections });
  },

  generateExercisePrescriptionExcel: function(filename, data) {
    var rows = [
      ['Exercise Prescription & VO₂ Max Report'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['SUBJECT'],
      ['Name', data.subjectName || ''],
      ['Age', data.age || ''],
      ['Weight (kg)', data.weight || ''],
      [],
      ['BASELINE FITNESS'],
      ['Resting HR (bpm)', data.restingHR || ''],
      ['Max HR (bpm)', data.maxHR || ''],
      ['VO₂ Max (mL/kg/min)', data.vo2Max || ''],
      ['Lactate Threshold HR', data.lactateThresholdHR || ''],
      ['Resting BP (mmHg)', data.restingBP || ''],
      [],
      ['TRAINING ZONES'],
      ['Zone', 'Heart Rate Range'],
      ['Zone 1 (Recovery)', data.zone1 || ''],
      ['Zone 2 (Aerobic)', data.zone2 || ''],
      ['Zone 3 (Tempo)', data.zone3 || ''],
      ['Zone 4 (Threshold)', data.zone4 || ''],
      ['Zone 5 (VO₂ Max)', data.zone5 || ''],
      [],
      ['PRESCRIPTION'],
      ['Modality', data.modality || ''],
      ['Frequency', data.frequency || ''],
      ['Intensity', data.intensity || ''],
      ['Duration (min)', data.duration || ''],
      ['Progression', data.progression || ''],
      [],
      ['GOALS'],
      [data.goals || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Exercise Prescription', rows: rows });
  },

  generateExercisePrescriptionPDF: function(filename, data) {
    var lines = [
      { text: 'EXERCISE PRESCRIPTION & VO₂ MAX REPORT', size: 18, bold: true },
      { text: 'Subject: ' + (data.subjectName || 'N/A') + '  |  Age: ' + (data.age || 'N/A') + '  |  Weight: ' + (data.weight || 'N/A') + ' kg', size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BASELINE FITNESS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Resting HR: ' + (data.restingHR || 'N/A') + ' bpm  |  Max HR: ' + (data.maxHR || 'N/A') + ' bpm', size: 10 },
      { text: 'VO₂ Max: ' + (data.vo2Max || 'N/A') + ' mL/kg/min  |  LT HR: ' + (data.lactateThresholdHR || 'N/A') + ' bpm', size: 10 },
      { text: 'Resting BP: ' + (data.restingBP || 'N/A') + ' mmHg', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRAINING ZONES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Z1 Recovery: ' + (data.zone1 || 'N/A'), size: 10 },
      { text: 'Z2 Aerobic: ' + (data.zone2 || 'N/A'), size: 10 },
      { text: 'Z3 Tempo: ' + (data.zone3 || 'N/A'), size: 10 },
      { text: 'Z4 Threshold: ' + (data.zone4 || 'N/A'), size: 10 },
      { text: 'Z5 VO₂ Max: ' + (data.zone5 || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PRESCRIPTION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Modality: ' + (data.modality || 'N/A') + '  |  Frequency: ' + (data.frequency || 'N/A') + '/wk', size: 10 },
      { text: 'Intensity: ' + (data.intensity || 'N/A') + '  |  Duration: ' + (data.duration || 'N/A') + ' min', size: 10 },
      { text: 'Progression: ' + (data.progression || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── GOALS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.goals || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Exercise Prescription', lines: lines });
  },

  // ============================================================
  // 9. CELL SIGNALING PATHWAY MAPPER
  // ============================================================

  generateCellSignalingWord: async function(filename, data) {
    var sections = [
      { heading: 'Cell Signaling Pathway Map', content: [
          'Pathway Name: ' + (data.pathwayName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Signal Initiation', content: [
          'Ligand / First Messenger: ' + (data.ligand || 'N/A'),
          'Receptor Type: ' + (data.receptorType || 'N/A'),
          'Cell Type: ' + (data.cellType || 'N/A')
      ]},
      { heading: 'Transduction Cascade', content: [
          'G-Protein / Adaptor: ' + (data.gProtein || 'N/A'),
          'Second Messenger: ' + (data.secondMessenger || 'N/A'),
          'Kinase Cascade: ' + (data.kinaseCascade || 'N/A'),
          'Amplification Factor: ' + (data.amplification || 'N/A')
      ]},
      { heading: 'Cellular Response', content: [
          'Primary Effect: ' + (data.primaryEffect || 'N/A'),
          'Gene Expression Changes: ' + (data.geneExpression || 'N/A'),
          'Time Course: ' + (data.timeCourse || 'N/A')
      ]},
      { heading: 'Termination & Clinical', content: [
          'Signal Termination: ' + (data.termination || 'N/A'),
          'Pharmacological Targets: ' + (data.pharmTargets || 'N/A'),
          'Disease Relevance: ' + (data.diseaseRelevance || 'N/A')
      ]}
    ];
    return this.generateWord(filename, { title: 'Signaling Pathway — ' + (data.pathwayName || ''), author: data.authorName || '', sections: sections });
  },

  generateCellSignalingExcel: function(filename, data) {
    var rows = [
      ['Cell Signaling Pathway Map'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['PATHWAY'],
      ['Pathway Name', data.pathwayName || ''],
      [],
      ['SIGNAL INITIATION'],
      ['Ligand', data.ligand || ''],
      ['Receptor Type', data.receptorType || ''],
      ['Cell Type', data.cellType || ''],
      [],
      ['TRANSDUCTION'],
      ['G-Protein / Adaptor', data.gProtein || ''],
      ['Second Messenger', data.secondMessenger || ''],
      ['Kinase Cascade', data.kinaseCascade || ''],
      ['Amplification', data.amplification || ''],
      [],
      ['RESPONSE'],
      ['Primary Effect', data.primaryEffect || ''],
      ['Gene Expression', data.geneExpression || ''],
      ['Time Course', data.timeCourse || ''],
      [],
      ['TERMINATION & CLINICAL'],
      ['Signal Termination', data.termination || ''],
      ['Pharm Targets', data.pharmTargets || ''],
      ['Disease Relevance', data.diseaseRelevance || '']
    ];
    return this.generateExcel(filename, { title: 'Cell Signaling Pathway', rows: rows });
  },

  generateCellSignalingPDF: function(filename, data) {
    var lines = [
      { text: 'CELL SIGNALING PATHWAY MAP', size: 18, bold: true },
      { text: 'Pathway: ' + (data.pathwayName || 'N/A'), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── SIGNAL INITIATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Ligand: ' + (data.ligand || 'N/A') + '  →  Receptor: ' + (data.receptorType || 'N/A'), size: 10 },
      { text: 'Cell Type: ' + (data.cellType || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── TRANSDUCTION CASCADE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'G-Protein: ' + (data.gProtein || 'N/A') + '  →  2nd Messenger: ' + (data.secondMessenger || 'N/A'), size: 10 },
      { text: 'Kinase: ' + (data.kinaseCascade || 'N/A') + '  |  Amplification: ' + (data.amplification || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CELLULAR RESPONSE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Effect: ' + (data.primaryEffect || 'N/A'), size: 10 },
      { text: 'Genes: ' + (data.geneExpression || 'N/A') + '  |  Time: ' + (data.timeCourse || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── TERMINATION & CLINICAL ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Termination: ' + (data.termination || 'N/A'), size: 10 },
      { text: 'Pharm Targets: ' + (data.pharmTargets || 'N/A'), size: 10 },
      { text: 'Disease: ' + (data.diseaseRelevance || 'N/A'), size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Cell Signaling Pathway', lines: lines });
  },

  // ============================================================
  // 10. COMPLETE BLOOD COUNT INTERPRETATION
  // ============================================================

  generateBloodPanelWord: async function(filename, data) {
    var sections = [
      { heading: 'Complete Blood Count Interpretation', content: [
          'Patient: ' + (data.patientName || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Red Blood Cells', content: [
          'RBC Count: ' + (data.rbcCount || 'N/A') + ' × 10⁶/µL',
          'Hemoglobin: ' + (data.hemoglobin || 'N/A') + ' g/dL',
          'Hematocrit: ' + (data.hematocrit || 'N/A') + '%',
          'MCV: ' + (data.mcv || 'N/A') + ' fL',
          'MCH: ' + (data.mch || 'N/A') + ' pg',
          'MCHC: ' + (data.mchc || 'N/A') + ' g/dL',
          'Reticulocyte Count: ' + (data.reticulocytes || 'N/A') + '%'
      ]},
      { heading: 'White Blood Cells', content: [
          'WBC Count: ' + (data.wbcCount || 'N/A') + ' × 10³/µL',
          'Neutrophils: ' + (data.neutrophils || 'N/A') + '%',
          'Lymphocytes: ' + (data.lymphocytes || 'N/A') + '%',
          'Monocytes: ' + (data.monocytes || 'N/A') + '%',
          'Eosinophils: ' + (data.eosinophils || 'N/A') + '%',
          'Basophils: ' + (data.basophils || 'N/A') + '%'
      ]},
      { heading: 'Coagulation', content: [
          'Platelet Count: ' + (data.platelets || 'N/A') + ' × 10³/µL',
          'PT/INR: ' + (data.ptInr || 'N/A'),
          'aPTT: ' + (data.aptt || 'N/A') + ' seconds'
      ]},
      { heading: 'Interpretation', content: (data.interpretation || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'CBC Interpretation — ' + (data.patientName || ''), author: data.authorName || '', sections: sections });
  },

  generateBloodPanelExcel: function(filename, data) {
    var rows = [
      ['Complete Blood Count Interpretation'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['PATIENT'],
      ['Name', data.patientName || ''],
      [],
      ['RED BLOOD CELLS'],
      ['Parameter', 'Value', 'Units'],
      ['RBC Count', data.rbcCount || '', '× 10⁶/µL'],
      ['Hemoglobin', data.hemoglobin || '', 'g/dL'],
      ['Hematocrit', data.hematocrit || '', '%'],
      ['MCV', data.mcv || '', 'fL'],
      ['MCH', data.mch || '', 'pg'],
      ['MCHC', data.mchc || '', 'g/dL'],
      ['Reticulocytes', data.reticulocytes || '', '%'],
      [],
      ['WHITE BLOOD CELLS'],
      ['WBC Count', data.wbcCount || '', '× 10³/µL'],
      ['Neutrophils', data.neutrophils || '', '%'],
      ['Lymphocytes', data.lymphocytes || '', '%'],
      ['Monocytes', data.monocytes || '', '%'],
      ['Eosinophils', data.eosinophils || '', '%'],
      ['Basophils', data.basophils || '', '%'],
      [],
      ['COAGULATION'],
      ['Platelets', data.platelets || '', '× 10³/µL'],
      ['PT/INR', data.ptInr || ''],
      ['aPTT (sec)', data.aptt || ''],
      [],
      ['INTERPRETATION'],
      [data.interpretation || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'CBC Interpretation', rows: rows });
  },

  generateBloodPanelPDF: function(filename, data) {
    var lines = [
      { text: 'COMPLETE BLOOD COUNT INTERPRETATION', size: 18, bold: true },
      { text: 'Patient: ' + (data.patientName || 'N/A'), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── RED BLOOD CELLS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'RBC: ' + (data.rbcCount || 'N/A') + ' × 10⁶/µL  |  Hb: ' + (data.hemoglobin || 'N/A') + ' g/dL  |  Hct: ' + (data.hematocrit || 'N/A') + '%', size: 10 },
      { text: 'MCV: ' + (data.mcv || 'N/A') + ' fL  |  MCH: ' + (data.mch || 'N/A') + ' pg  |  MCHC: ' + (data.mchc || 'N/A') + ' g/dL', size: 10 },
      { text: 'Reticulocytes: ' + (data.reticulocytes || 'N/A') + '%', size: 10 },
      { text: ' ', size: 6 },
      { text: '── WHITE BLOOD CELLS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'WBC: ' + (data.wbcCount || 'N/A') + ' × 10³/µL', size: 10 },
      { text: 'Neutro: ' + (data.neutrophils || 'N/A') + '%  |  Lymph: ' + (data.lymphocytes || 'N/A') + '%  |  Mono: ' + (data.monocytes || 'N/A') + '%', size: 10 },
      { text: 'Eos: ' + (data.eosinophils || 'N/A') + '%  |  Baso: ' + (data.basophils || 'N/A') + '%', size: 10 },
      { text: ' ', size: 6 },
      { text: '── COAGULATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Platelets: ' + (data.platelets || 'N/A') + ' × 10³/µL  |  PT/INR: ' + (data.ptInr || 'N/A') + '  |  aPTT: ' + (data.aptt || 'N/A') + ' sec', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INTERPRETATION ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.interpretation || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'CBC Interpretation', lines: lines });
  },

  // ============================================================
  // 11. REPRODUCTIVE HORMONE CYCLE TRACKER
  // ============================================================

  generateReproductiveCycleWord: async function(filename, data) {
    var sections = [
      { heading: 'Reproductive Hormone Cycle Analysis', content: [
          'Subject: ' + (data.subjectName || 'N/A'),
          'Cycle Day: ' + (data.cycleDay || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Hormone Levels', content: [
          'FSH: ' + (data.fsh || 'N/A') + ' mIU/mL',
          'LH: ' + (data.lh || 'N/A') + ' mIU/mL',
          'Estradiol (E2): ' + (data.estradiol || 'N/A') + ' pg/mL',
          'Progesterone: ' + (data.progesterone || 'N/A') + ' ng/mL',
          'Testosterone: ' + (data.testosterone || 'N/A') + ' ng/dL',
          'Inhibin B: ' + (data.inhibinB || 'N/A') + ' pg/mL'
      ]},
      { heading: 'Cycle Phase Assessment', content: [
          'Current Phase: ' + (data.cyclePhase || 'N/A'),
          'Dominant Follicle Size: ' + (data.follicleSize || 'N/A') + ' mm',
          'Endometrial Thickness: ' + (data.endometrial || 'N/A') + ' mm',
          'Ovulation Status: ' + (data.ovulationStatus || 'N/A')
      ]},
      { heading: 'Clinical Notes', content: (data.clinicalNotes || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Reproductive Cycle — ' + (data.subjectName || ''), author: data.authorName || '', sections: sections });
  },

  generateReproductiveCycleExcel: function(filename, data) {
    var rows = [
      ['Reproductive Hormone Cycle Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['SUBJECT'],
      ['Name', data.subjectName || ''],
      ['Cycle Day', data.cycleDay || ''],
      [],
      ['HORMONE LEVELS'],
      ['Hormone', 'Value', 'Units'],
      ['FSH', data.fsh || '', 'mIU/mL'],
      ['LH', data.lh || '', 'mIU/mL'],
      ['Estradiol (E2)', data.estradiol || '', 'pg/mL'],
      ['Progesterone', data.progesterone || '', 'ng/mL'],
      ['Testosterone', data.testosterone || '', 'ng/dL'],
      ['Inhibin B', data.inhibinB || '', 'pg/mL'],
      [],
      ['CYCLE ASSESSMENT'],
      ['Current Phase', data.cyclePhase || ''],
      ['Follicle Size (mm)', data.follicleSize || ''],
      ['Endometrial Thickness (mm)', data.endometrial || ''],
      ['Ovulation Status', data.ovulationStatus || ''],
      [],
      ['CLINICAL NOTES'],
      [data.clinicalNotes || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Reproductive Cycle', rows: rows });
  },

  generateReproductiveCyclePDF: function(filename, data) {
    var lines = [
      { text: 'REPRODUCTIVE HORMONE CYCLE ANALYSIS', size: 18, bold: true },
      { text: 'Subject: ' + (data.subjectName || 'N/A') + '  |  Cycle Day: ' + (data.cycleDay || 'N/A'), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── HORMONE LEVELS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'FSH: ' + (data.fsh || 'N/A') + ' mIU/mL  |  LH: ' + (data.lh || 'N/A') + ' mIU/mL', size: 10 },
      { text: 'E2: ' + (data.estradiol || 'N/A') + ' pg/mL  |  Progesterone: ' + (data.progesterone || 'N/A') + ' ng/mL', size: 10 },
      { text: 'Testosterone: ' + (data.testosterone || 'N/A') + ' ng/dL  |  Inhibin B: ' + (data.inhibinB || 'N/A') + ' pg/mL', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CYCLE PHASE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Phase: ' + (data.cyclePhase || 'N/A') + '  |  Ovulation: ' + (data.ovulationStatus || 'N/A'), size: 10 },
      { text: 'Follicle: ' + (data.follicleSize || 'N/A') + ' mm  |  Endometrium: ' + (data.endometrial || 'N/A') + ' mm', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CLINICAL NOTES ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.clinicalNotes || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Reproductive Cycle', lines: lines });
  },

  // ============================================================
  // 12. CLINICAL CASE INTEGRATION REPORT
  // ============================================================

  generateClinicalIntegrationWord: async function(filename, data) {
    var sections = [
      { heading: 'Clinical Case Integration Report', content: [
          'Case Title: ' + (data.caseTitle || 'N/A'),
          'Patient Profile: ' + (data.patientProfile || 'N/A'),
          'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: 'Presenting Complaint', content: (data.presentingComplaint || 'Not specified').split('\n') },
      { heading: 'Systems Affected', content: [
          'Primary System: ' + (data.primarySystem || 'N/A'),
          'Secondary Systems: ' + (data.secondarySystems || 'N/A'),
          'Compensatory Mechanisms: ' + (data.compensatory || 'N/A')
      ]},
      { heading: 'Pathophysiology', content: (data.pathophysiology || 'Not specified').split('\n') },
      { heading: 'Vital Signs & Labs', content: [
          'HR: ' + (data.hr || 'N/A') + '  |  BP: ' + (data.bp || 'N/A') + '  |  RR: ' + (data.rr || 'N/A'),
          'Temp: ' + (data.temp || 'N/A') + '  |  SpO2: ' + (data.spo2 || 'N/A'),
          'Key Labs: ' + (data.keyLabs || 'N/A')
      ]},
      { heading: 'Treatment Rationale', content: (data.treatment || 'Not specified').split('\n') },
      { heading: 'Learning Points', content: (data.learningPoints || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Clinical Case — ' + (data.caseTitle || ''), author: data.authorName || '', sections: sections });
  },

  generateClinicalIntegrationExcel: function(filename, data) {
    var rows = [
      ['Clinical Case Integration Report'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['CASE DETAILS'],
      ['Case Title', data.caseTitle || ''],
      ['Patient Profile', data.patientProfile || ''],
      [],
      ['PRESENTING COMPLAINT'],
      [data.presentingComplaint || 'Not specified'],
      [],
      ['SYSTEMS AFFECTED'],
      ['Primary System', data.primarySystem || ''],
      ['Secondary Systems', data.secondarySystems || ''],
      ['Compensatory Mechanisms', data.compensatory || ''],
      [],
      ['PATHOPHYSIOLOGY'],
      [data.pathophysiology || 'Not specified'],
      [],
      ['VITAL SIGNS'],
      ['HR', data.hr || ''],
      ['BP', data.bp || ''],
      ['RR', data.rr || ''],
      ['Temp', data.temp || ''],
      ['SpO2', data.spo2 || ''],
      ['Key Labs', data.keyLabs || ''],
      [],
      ['TREATMENT'],
      [data.treatment || 'Not specified'],
      [],
      ['LEARNING POINTS'],
      [data.learningPoints || 'Not specified']
    ];
    return this.generateExcel(filename, { title: 'Clinical Case Integration', rows: rows });
  },

  generateClinicalIntegrationPDF: function(filename, data) {
    var lines = [
      { text: 'CLINICAL CASE INTEGRATION REPORT', size: 18, bold: true },
      { text: 'Case: ' + (data.caseTitle || 'N/A'), size: 12 },
      { text: 'Patient: ' + (data.patientProfile || 'N/A'), size: 11 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PRESENTING COMPLAINT ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.presentingComplaint || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SYSTEMS AFFECTED ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'Primary: ' + (data.primarySystem || 'N/A'), size: 10 },
      { text: 'Secondary: ' + (data.secondarySystems || 'N/A'), size: 10 },
      { text: 'Compensatory: ' + (data.compensatory || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PATHOPHYSIOLOGY ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.pathophysiology || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── VITALS & LABS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: 'HR: ' + (data.hr || 'N/A') + '  |  BP: ' + (data.bp || 'N/A') + '  |  RR: ' + (data.rr || 'N/A'), size: 10 },
      { text: 'Temp: ' + (data.temp || 'N/A') + '  |  SpO2: ' + (data.spo2 || 'N/A'), size: 10 },
      { text: 'Key Labs: ' + (data.keyLabs || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── TREATMENT RATIONALE ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.treatment || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── LEARNING POINTS ──', size: 14, bold: true },
      { text: ' ', size: 4 },
      { text: data.learningPoints || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Clinical Case Integration', lines: lines });
  }

});
