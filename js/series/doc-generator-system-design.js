/**
 * Doc Generator – System Design Series
 * Extends DocGenerator with 15 system design document generators.
 * Requires: doc-generator-core.js loaded first.
 *
 * DocTypes (15):
 *  1. SystemDesignHLD           – High-Level Design Document
 *  2. ScalabilityPlan           – Scalability Assessment & Capacity Plan
 *  3. CachingStrategy           – Caching & Load Balancing Strategy
 *  4. DatabaseDesign            – Database Schema & Sharding Design
 *  5. MicroservicesPlan         – Microservices Decomposition Plan
 *  6. ApiDesignSpec             – API Design Specification
 *  7. EventDrivenDesign         – Event-Driven Architecture Design
 *  8. ArchitectureDecision      – Architecture Decision Record (ADR)
 *  9. RateLimitPolicy           – Rate Limiting & API Protection Policy
 * 10. ObservabilityPlan         – Observability & Monitoring Plan
 * 11. DesignCaseStudy           – System Design Case Study
 * 12. LowLevelDesign            – Low-Level Design Document
 * 13. DistributedDesign         – Distributed Architecture Design
 * 14. SecurityArchitecture      – Security Architecture & Compliance
 * 15. InterviewWorksheet        – System Design Interview Worksheet
 */
Object.assign(DocGenerator, {

  // ============================================================
  // 1. SYSTEM DESIGN HLD (High-Level Design Document)
  // ============================================================

  generateSystemDesignHLDWord: async function(filename, data) {
    var sections = [
      { heading: 'High-Level Design Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Author / Team: ' + (data.author || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Problem Statement', content: (data.problemStatement || 'Not specified').split('\n') },
      { heading: '2. Functional Requirements', content: (data.functionalReqs || 'Not specified').split('\n') },
      { heading: '3. Non-Functional Requirements', content: (data.nonFunctionalReqs || 'Not specified').split('\n') },
      { heading: '4. Architecture Pattern', content: ['Selected Pattern: ' + (data.archPattern || 'N/A')] },
      { heading: '5. Key Components', content: (data.keyComponents || 'Not specified').split('\n') },
      { heading: '6. Technology Stack', content: (data.techStack || 'Not specified').split('\n') },
      { heading: '7. Estimated Scale', content: (data.estimatedScale || 'Not specified').split('\n') },
      { heading: '8. Constraints & Assumptions', content: (data.constraints || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'High-Level Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateSystemDesignHLDExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    // Overview sheet
    var overview = [
      ['HIGH-LEVEL DESIGN DOCUMENT'],
      ['System', data.systemName || ''],
      ['Author / Team', data.author || ''],
      ['Date', new Date().toLocaleDateString()],
      ['Architecture Pattern', data.archPattern || ''],
      [],
      ['PROBLEM STATEMENT'],
      [data.problemStatement || ''],
      [],
      ['FUNCTIONAL REQUIREMENTS'],
      [data.functionalReqs || ''],
      [],
      ['NON-FUNCTIONAL REQUIREMENTS'],
      [data.nonFunctionalReqs || ''],
      [],
      ['KEY COMPONENTS'],
      [data.keyComponents || ''],
      [],
      ['TECHNOLOGY STACK'],
      [data.techStack || ''],
      [],
      ['ESTIMATED SCALE'],
      [data.estimatedScale || ''],
      [],
      ['CONSTRAINTS & ASSUMPTIONS'],
      [data.constraints || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Components sheet
    var compRows = [['Component', 'Description']];
    (data.keyComponents || '').split('\n').forEach(function(c) {
      if (c.trim()) compRows.push([c.trim(), '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(compRows);
    ws2['!cols'] = [{ wch: 30 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Components');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSystemDesignHLDPDF: function(filename, data) {
    var lines = [
      { text: 'HIGH-LEVEL DESIGN DOCUMENT', size: 18, bold: true },
      { text: (data.systemName || '') + '  |  ' + (data.author || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── PROBLEM STATEMENT ──', size: 14, bold: true },
      { text: data.problemStatement || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── FUNCTIONAL REQUIREMENTS ──', size: 14, bold: true },
      { text: data.functionalReqs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NON-FUNCTIONAL REQUIREMENTS ──', size: 14, bold: true },
      { text: data.nonFunctionalReqs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ARCHITECTURE PATTERN ──', size: 14, bold: true },
      { text: data.archPattern || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY COMPONENTS ──', size: 14, bold: true },
      { text: data.keyComponents || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── TECHNOLOGY STACK ──', size: 14, bold: true },
      { text: data.techStack || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ESTIMATED SCALE ──', size: 14, bold: true },
      { text: data.estimatedScale || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONSTRAINTS & ASSUMPTIONS ──', size: 14, bold: true },
      { text: data.constraints || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'High-Level Design Document', lines: lines });
  },

  generateSystemDesignHLDPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'High-Level Design Document',
      subtitle: (data.author || '') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Problem Statement', content: data.problemStatement || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Functional Requirements', content: data.functionalReqs || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Non-Functional Requirements', content: data.nonFunctionalReqs || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Architecture Pattern', content: data.archPattern || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Key Components', content: data.keyComponents || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Technology Stack', content: data.techStack || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Estimated Scale', content: data.estimatedScale || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Constraints & Assumptions', content: data.constraints || 'Not specified', color: DocStyles.colors.navy }
      ]
    });
  },


  // ============================================================
  // 2. SCALABILITY ASSESSMENT & CAPACITY PLAN
  // ============================================================

  generateScalabilityPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'Scalability Assessment & Capacity Plan', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Current Scale', content: [
        'Current Users / Requests per second: ' + (data.currentScale || 'N/A')
      ]},
      { heading: '2. Target Scale', content: [
        'Target Users / Requests per second: ' + (data.targetScale || 'N/A')
      ]},
      { heading: '3. Scaling Strategy', content: ['Strategy: ' + (data.scalingStrategy || 'N/A')] },
      { heading: '4. Stateful Components', content: (data.statefulComponents || 'Not specified').split('\n') },
      { heading: '5. Redundancy Model', content: ['Model: ' + (data.redundancyModel || 'N/A')] },
      { heading: '6. Recovery Targets', content: [
        'RTO: ' + (data.rto || 'N/A'),
        'RPO: ' + (data.rpo || 'N/A')
      ]},
      { heading: '7. Single Points of Failure', content: (data.spof || 'Not specified').split('\n') },
      { heading: '8. Disaster Recovery Strategy', content: (data.drStrategy || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Scalability Plan – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateScalabilityPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['SCALABILITY ASSESSMENT & CAPACITY PLAN'],
      ['System', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CURRENT vs TARGET SCALE'],
      ['Metric', 'Current', 'Target'],
      ['Users / RPS', data.currentScale || '', data.targetScale || ''],
      [],
      ['SCALING CONFIGURATION'],
      ['Scaling Strategy', data.scalingStrategy || ''],
      ['Redundancy Model', data.redundancyModel || ''],
      ['RTO', data.rto || ''],
      ['RPO', data.rpo || ''],
      [],
      ['STATEFUL COMPONENTS'],
      [data.statefulComponents || 'None identified'],
      [],
      ['SINGLE POINTS OF FAILURE'],
      [data.spof || 'None identified'],
      [],
      ['DISASTER RECOVERY STRATEGY'],
      [data.drStrategy || 'Not specified']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Scalability Plan');
    // Capacity matrix sheet
    var cap = [
      ['CAPACITY PLANNING MATRIX'],
      ['Component', 'Current Capacity', 'Target Capacity', 'Scale Method', 'Notes'],
      ['Web Servers', '', '', '', ''],
      ['Application Servers', '', '', '', ''],
      ['Database', '', '', '', ''],
      ['Cache Layer', '', '', '', ''],
      ['Message Queue', '', '', '', ''],
      ['CDN / Static', '', '', '', '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(cap);
    ws2['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Capacity Matrix');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateScalabilityPlanPDF: function(filename, data) {
    var lines = [
      { text: 'SCALABILITY ASSESSMENT & CAPACITY PLAN', size: 18, bold: true },
      { text: (data.systemName || ''), size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CURRENT & TARGET SCALE ──', size: 14, bold: true },
      { text: 'Current: ' + (data.currentScale || 'N/A'), size: 10 },
      { text: 'Target: ' + (data.targetScale || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── SCALING STRATEGY ──', size: 14, bold: true },
      { text: 'Strategy: ' + (data.scalingStrategy || 'N/A'), size: 10 },
      { text: 'Redundancy: ' + (data.redundancyModel || 'N/A'), size: 10 },
      { text: 'RTO: ' + (data.rto || 'N/A') + '  |  RPO: ' + (data.rpo || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── STATEFUL COMPONENTS ──', size: 14, bold: true },
      { text: data.statefulComponents || 'None identified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SINGLE POINTS OF FAILURE ──', size: 14, bold: true },
      { text: data.spof || 'None identified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DISASTER RECOVERY STRATEGY ──', size: 14, bold: true },
      { text: data.drStrategy || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Scalability Plan', lines: lines });
  },


  // ============================================================
  // 3. CACHING & LOAD BALANCING STRATEGY
  // ============================================================

  generateCachingStrategyWord: async function(filename, data) {
    var sections = [
      { heading: 'Caching & Load Balancing Strategy', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Load Balancer Configuration', content: [
        'LB Type: ' + (data.lbType || 'N/A'),
        'Algorithm: ' + (data.lbAlgorithm || 'N/A'),
        'Health Check Endpoint: ' + (data.healthCheck || 'N/A')
      ]},
      { heading: '2. Cache Configuration', content: [
        'Technology: ' + (data.cacheTech || 'N/A'),
        'Pattern: ' + (data.cachePattern || 'N/A'),
        'Eviction Policy: ' + (data.evictionPolicy || 'N/A'),
        'TTL Settings: ' + (data.ttl || 'N/A')
      ]},
      { heading: '3. Cache Invalidation Strategy', content: (data.invalidation || 'Not specified').split('\n') },
      { heading: '4. CDN Configuration', content: [
        'CDN Provider / Regions: ' + (data.cdnProvider || 'N/A')
      ]},
      { heading: '5. Target Cache Hit Ratio', content: [
        'Target: ' + (data.hitRatio || 'N/A')
      ]}
    ];
    return this.generateWord(filename, { title: 'Caching Strategy – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateCachingStrategyExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    // LB sheet
    var lb = [
      ['LOAD BALANCER CONFIGURATION'],
      ['System', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['Parameter', 'Value'],
      ['LB Type', data.lbType || ''],
      ['Algorithm', data.lbAlgorithm || ''],
      ['Health Check Endpoint', data.healthCheck || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(lb);
    ws1['!cols'] = [{ wch: 30 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Load Balancer');
    // Cache sheet
    var cache = [
      ['CACHE CONFIGURATION'],
      [],
      ['Parameter', 'Value'],
      ['Technology', data.cacheTech || ''],
      ['Pattern', data.cachePattern || ''],
      ['Eviction Policy', data.evictionPolicy || ''],
      ['TTL Settings', data.ttl || ''],
      ['Target Hit Ratio', data.hitRatio || ''],
      [],
      ['INVALIDATION STRATEGY'],
      [data.invalidation || ''],
      [],
      ['CDN PROVIDER'],
      [data.cdnProvider || '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(cache);
    ws2['!cols'] = [{ wch: 30 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Cache Strategy');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateCachingStrategyPDF: function(filename, data) {
    var lines = [
      { text: 'CACHING & LOAD BALANCING STRATEGY', size: 18, bold: true },
      { text: (data.systemName || ''), size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── LOAD BALANCER ──', size: 14, bold: true },
      { text: 'Type: ' + (data.lbType || 'N/A'), size: 10 },
      { text: 'Algorithm: ' + (data.lbAlgorithm || 'N/A'), size: 10 },
      { text: 'Health Check: ' + (data.healthCheck || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CACHE CONFIGURATION ──', size: 14, bold: true },
      { text: 'Technology: ' + (data.cacheTech || 'N/A'), size: 10 },
      { text: 'Pattern: ' + (data.cachePattern || 'N/A'), size: 10 },
      { text: 'Eviction Policy: ' + (data.evictionPolicy || 'N/A'), size: 10 },
      { text: 'TTL: ' + (data.ttl || 'N/A'), size: 10 },
      { text: 'Target Hit Ratio: ' + (data.hitRatio || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── INVALIDATION STRATEGY ──', size: 14, bold: true },
      { text: data.invalidation || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CDN ──', size: 14, bold: true },
      { text: data.cdnProvider || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Caching & Load Balancing Strategy', lines: lines });
  },


  // ============================================================
  // 4. DATABASE SCHEMA & SHARDING DESIGN
  // ============================================================

  generateDatabaseDesignWord: async function(filename, data) {
    var entities = data.entities || [];
    var entitySections = [];
    entities.forEach(function(e, i) {
      if (!e.name) return;
      entitySections.push({
        heading: 'Entity ' + (i + 1) + ': ' + e.name,
        content: [
          'Primary Key: ' + (e.primaryKey || 'N/A'),
          'Estimated Rows: ' + (e.estimatedRows || 'N/A'),
          '',
          'Columns / Fields:',
          e.columns || 'Not specified',
          '',
          'Relationships:',
          e.relationships || 'None',
          '',
          'Access Patterns:',
          e.accessPatterns || 'Not specified',
          '',
          'Indexes:',
          e.indexes || 'Not specified',
          '',
          'Notes:',
          e.notes || 'None'
        ]
      });
    });
    var sections = [
      { heading: 'Database Schema & Sharding Design', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Database Selection', content: [
        'Type: ' + (data.dbType || 'N/A'),
        'Engine: ' + (data.dbEngine || 'N/A'),
        'Consistency Requirement: ' + (data.consistency || 'N/A')
      ]},
      { heading: '2. Sharding Configuration', content: [
        'Strategy: ' + (data.shardStrategy || 'N/A'),
        'Shard Key: ' + (data.shardKey || 'N/A')
      ]},
      { heading: '3. Replication', content: [
        'Strategy: ' + (data.replication || 'N/A'),
        'Read Replicas: ' + (data.readReplicas || 'N/A')
      ]},
      { heading: '4. Storage & Growth', content: [
        'Estimated Data Size: ' + (data.dataSize || 'N/A')
      ]},
      { heading: '5. Global Indexing Notes', content: (data.indexing || 'Not specified').split('\n') },
      { heading: '6. Entity Schemas', content: ['Total Entities: ' + entities.length] }
    ].concat(entitySections);
    return this.generateWord(filename, { title: 'Database Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateDatabaseDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var entities = data.entities || [];
    // Overview sheet
    var overview = [
      ['DATABASE SCHEMA & SHARDING DESIGN'],
      ['System', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['DATABASE SELECTION'],
      ['Parameter', 'Value'],
      ['Type', data.dbType || ''],
      ['Engine', data.dbEngine || ''],
      ['Consistency', data.consistency || ''],
      [],
      ['SHARDING'],
      ['Strategy', data.shardStrategy || ''],
      ['Shard Key', data.shardKey || ''],
      [],
      ['REPLICATION'],
      ['Strategy', data.replication || ''],
      ['Read Replicas', data.readReplicas || ''],
      [],
      ['Data Size', data.dataSize || ''],
      [],
      ['GLOBAL INDEXING NOTES'],
      [data.indexing || 'Not specified'],
      [],
      ['ENTITIES SUMMARY'],
      ['#', 'Entity Name', 'Primary Key', 'Estimated Rows']
    ];
    entities.forEach(function(e, i) {
      if (e.name) overview.push([i + 1, e.name, e.primaryKey || '', e.estimatedRows || '']);
    });
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 8 }, { wch: 30 }, { wch: 30 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Per-entity sheets
    entities.forEach(function(e, i) {
      if (!e.name) return;
      var safeName = e.name.replace(/[^a-zA-Z0-9 _-]/g, '').substring(0, 28);
      var sheetName = (i + 1) + '. ' + safeName;
      var rows = [
        ['ENTITY: ' + e.name.toUpperCase()],
        [],
        ['PRIMARY KEY', e.primaryKey || 'N/A'],
        ['ESTIMATED ROWS', e.estimatedRows || 'N/A'],
        [],
        ['COLUMNS / FIELDS']
      ];
      (e.columns || '').split('\n').forEach(function(c) {
        if (c.trim()) rows.push([c.trim()]);
      });
      rows.push([], ['RELATIONSHIPS']);
      (e.relationships || '').split('\n').forEach(function(r) {
        if (r.trim()) rows.push([r.trim()]);
      });
      rows.push([], ['ACCESS PATTERNS']);
      (e.accessPatterns || '').split('\n').forEach(function(a) {
        if (a.trim()) rows.push([a.trim()]);
      });
      rows.push([], ['INDEXES']);
      (e.indexes || '').split('\n').forEach(function(x) {
        if (x.trim()) rows.push([x.trim()]);
      });
      rows.push([], ['ADDITIONAL NOTES']);
      rows.push([e.notes || 'None']);
      var ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [{ wch: 35 }, { wch: 45 }];
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDatabaseDesignPDF: function(filename, data) {
    var entities = data.entities || [];
    var lines = [
      { text: 'DATABASE SCHEMA & SHARDING DESIGN', size: 18, bold: true },
      { text: (data.systemName || ''), size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DATABASE SELECTION ──', size: 14, bold: true },
      { text: 'Type: ' + (data.dbType || 'N/A') + '  |  Engine: ' + (data.dbEngine || 'N/A'), size: 10 },
      { text: 'Consistency: ' + (data.consistency || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── SHARDING ──', size: 14, bold: true },
      { text: 'Strategy: ' + (data.shardStrategy || 'N/A') + '  |  Shard Key: ' + (data.shardKey || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── REPLICATION ──', size: 14, bold: true },
      { text: 'Strategy: ' + (data.replication || 'N/A') + '  |  Read Replicas: ' + (data.readReplicas || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── STORAGE ──', size: 14, bold: true },
      { text: 'Estimated Data Size: ' + (data.dataSize || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── GLOBAL INDEXING NOTES ──', size: 14, bold: true },
      { text: data.indexing || 'Not specified', size: 10 }
    ];
    entities.forEach(function(e, i) {
      if (!e.name) return;
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── ENTITY ' + (i + 1) + ': ' + e.name.toUpperCase() + ' ──', size: 14, bold: true });
      lines.push({ text: 'Primary Key: ' + (e.primaryKey || 'N/A') + '  |  Est. Rows: ' + (e.estimatedRows || 'N/A'), size: 10 });
      if (e.columns) { lines.push({ text: 'Columns: ' + e.columns.replace(/\n/g, ', '), size: 9 }); }
      if (e.relationships) { lines.push({ text: 'Relationships: ' + e.relationships.replace(/\n/g, ', '), size: 9 }); }
      if (e.accessPatterns) { lines.push({ text: 'Access Patterns: ' + e.accessPatterns.replace(/\n/g, ', '), size: 9 }); }
      if (e.indexes) { lines.push({ text: 'Indexes: ' + e.indexes.replace(/\n/g, ', '), size: 9 }); }
      if (e.notes) { lines.push({ text: 'Notes: ' + e.notes.replace(/\n/g, ', '), size: 9 }); }
    });
    return this.generatePDF(filename, { title: 'Database Design Document', lines: lines });
  },


  // ============================================================
  // 5. MICROSERVICES DECOMPOSITION PLAN
  // ============================================================

  generateMicroservicesPlanWord: async function(filename, data) {
    var sections = [
      { heading: 'Microservices Decomposition Plan', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Current Architecture: ' + (data.currentArch || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Domain & Bounded Contexts', content: (data.boundedContexts || 'Not specified').split('\n') },
      { heading: '2. Service Inventory', content: (data.serviceList || 'Not specified').split('\n') },
      { heading: '3. Communication Pattern', content: ['Pattern: ' + (data.commPattern || 'N/A')] },
      { heading: '4. API Gateway', content: ['Gateway: ' + (data.apiGateway || 'N/A')] },
      { heading: '5. Service Mesh', content: ['Mesh: ' + (data.serviceMesh || 'N/A')] },
      { heading: '6. Deployment Strategy', content: ['Platform: ' + (data.deployment || 'N/A')] },
      { heading: '7. Data Strategy', content: ['Strategy: ' + (data.dataStrategy || 'N/A')] },
      { heading: '8. Cross-Cutting Concerns', content: (data.crossCutting || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Microservices Plan – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateMicroservicesPlanExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['MICROSERVICES DECOMPOSITION PLAN'],
      ['System', data.systemName || ''],
      ['Current Architecture', data.currentArch || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['Communication Pattern', data.commPattern || ''],
      ['API Gateway', data.apiGateway || ''],
      ['Service Mesh', data.serviceMesh || ''],
      ['Deployment Platform', data.deployment || ''],
      ['Data Strategy', data.dataStrategy || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 28 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Services sheet
    var svcRows = [['Service Name', 'Responsibility', 'Data Owned', 'Communication']];
    (data.serviceList || '').split('\n').forEach(function(s) {
      if (s.trim()) svcRows.push([s.trim(), '', '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(svcRows);
    ws2['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Service Inventory');
    // Bounded contexts
    var bcRows = [['BOUNDED CONTEXT', 'SERVICES', 'AGGREGATE ROOTS']];
    (data.boundedContexts || '').split('\n').forEach(function(bc) {
      if (bc.trim()) bcRows.push([bc.trim(), '', '']);
    });
    var ws3 = XLSX.utils.aoa_to_sheet(bcRows);
    ws3['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Bounded Contexts');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateMicroservicesPlanPDF: function(filename, data) {
    var lines = [
      { text: 'MICROSERVICES DECOMPOSITION PLAN', size: 18, bold: true },
      { text: (data.systemName || ''), size: 13 },
      { text: 'Current Architecture: ' + (data.currentArch || 'N/A'), size: 10 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── BOUNDED CONTEXTS ──', size: 14, bold: true },
      { text: data.boundedContexts || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SERVICE INVENTORY ──', size: 14, bold: true },
      { text: data.serviceList || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── INFRASTRUCTURE ──', size: 14, bold: true },
      { text: 'Communication: ' + (data.commPattern || 'N/A'), size: 10 },
      { text: 'API Gateway: ' + (data.apiGateway || 'N/A'), size: 10 },
      { text: 'Service Mesh: ' + (data.serviceMesh || 'N/A'), size: 10 },
      { text: 'Deployment: ' + (data.deployment || 'N/A'), size: 10 },
      { text: 'Data Strategy: ' + (data.dataStrategy || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CROSS-CUTTING CONCERNS ──', size: 14, bold: true },
      { text: data.crossCutting || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Microservices Decomposition Plan', lines: lines });
  },

  generateMicroservicesPlanPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Microservices Decomposition Plan',
      subtitle: 'Current: ' + (data.currentArch || 'N/A') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Bounded Contexts', content: data.boundedContexts || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Service Inventory', content: data.serviceList || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Communication & Gateway', content: 'Pattern: ' + (data.commPattern || 'N/A') + '\nAPI Gateway: ' + (data.apiGateway || 'N/A') + '\nService Mesh: ' + (data.serviceMesh || 'N/A'), color: DocStyles.colors.teal },
        { heading: 'Deployment & Data', content: 'Platform: ' + (data.deployment || 'N/A') + '\nData Strategy: ' + (data.dataStrategy || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Cross-Cutting Concerns', content: data.crossCutting || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 6. API DESIGN SPECIFICATION
  // ============================================================

  generateApiDesignSpecWord: async function(filename, data) {
    var endpoints = data.endpoints || [];
    // Group endpoints by resource
    var resourceMap = {};
    var resourceOrder = [];
    endpoints.forEach(function(ep) {
      if (!ep.resource) return;
      var key = ep.resource.trim();
      if (!resourceMap[key]) { resourceMap[key] = []; resourceOrder.push(key); }
      resourceMap[key].push(ep);
    });
    // Build per-resource endpoint sections
    var endpointSections = [];
    resourceOrder.forEach(function(res, i) {
      var eps = resourceMap[res];
      var content = [];
      eps.forEach(function(ep) {
        content.push((ep.method || '???') + ' ' + (ep.path || '/'));
        if (ep.description) content.push('  Description: ' + ep.description);
        if (ep.requestBody) content.push('  Request Body: ' + ep.requestBody.replace(/\n/g, ' '));
        if (ep.response) content.push('  Response: ' + ep.response.replace(/\n/g, ' '));
        content.push('  Auth: ' + (ep.authRequired || 'Yes'));
        if (ep.notes) content.push('  Notes: ' + ep.notes);
        content.push('');
      });
      endpointSections.push({ heading: 'Resource ' + (i + 1) + ': ' + res, content: content });
    });
    var sections = [
      { heading: 'API Design Specification', content: [
        'API Name: ' + (data.apiName || 'N/A'),
        'Base URL: ' + (data.baseUrl || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. API Configuration', content: [
        'API Type: ' + (data.apiType || 'N/A'),
        'Version Strategy: ' + (data.versionStrategy || 'N/A'),
        'Authentication: ' + (data.authMethod || 'N/A'),
        'Content Type: ' + (data.contentType || 'N/A')
      ]},
      { heading: '2. Rate Limiting', content: [
        'Policy: ' + (data.rateLimit || 'N/A')
      ]},
      { heading: '3. Pagination Strategy', content: ['Strategy: ' + (data.pagination || 'N/A')] },
      { heading: '4. Error Response Format', content: (data.errorFormat || 'Not specified').split('\n') },
      { heading: '5. API Endpoints', content: ['Total Resources: ' + resourceOrder.length + '  |  Total Endpoints: ' + endpoints.length] }
    ].concat(endpointSections);
    return this.generateWord(filename, { title: 'API Design – ' + (data.apiName || ''), author: data.authorName || '', sections: sections });
  },

  generateApiDesignSpecExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var endpoints = data.endpoints || [];
    // API Overview
    var overview = [
      ['API DESIGN SPECIFICATION'],
      ['API Name', data.apiName || ''],
      ['Base URL', data.baseUrl || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CONFIGURATION'],
      ['Parameter', 'Value'],
      ['API Type', data.apiType || ''],
      ['Version Strategy', data.versionStrategy || ''],
      ['Authentication', data.authMethod || ''],
      ['Content Type', data.contentType || ''],
      ['Rate Limit', data.rateLimit || ''],
      ['Pagination', data.pagination || ''],
      [],
      ['ERROR RESPONSE FORMAT'],
      [data.errorFormat || 'Not specified'],
      [],
      ['ENDPOINTS SUMMARY'],
      ['#', 'Resource', 'Method', 'Path', 'Auth']
    ];
    endpoints.forEach(function(ep, i) {
      if (ep.resource || ep.path) {
        overview.push([i + 1, ep.resource || '', ep.method || '', ep.path || '', ep.authRequired || 'Yes']);
      }
    });
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 8 }, { wch: 22 }, { wch: 10 }, { wch: 35 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'API Overview');
    // Endpoints detail sheet
    var epRows = [['Resource', 'Method', 'Path', 'Description', 'Request Body', 'Response', 'Auth', 'Notes']];
    endpoints.forEach(function(ep) {
      if (ep.resource || ep.path) {
        epRows.push([
          ep.resource || '', ep.method || '', ep.path || '',
          ep.description || '', ep.requestBody || '', ep.response || '',
          ep.authRequired || 'Yes', ep.notes || ''
        ]);
      }
    });
    var ws2 = XLSX.utils.aoa_to_sheet(epRows);
    ws2['!cols'] = [{ wch: 18 }, { wch: 8 }, { wch: 28 }, { wch: 28 }, { wch: 30 }, { wch: 30 }, { wch: 8 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Endpoints');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateApiDesignSpecPDF: function(filename, data) {
    var endpoints = data.endpoints || [];
    var lines = [
      { text: 'API DESIGN SPECIFICATION', size: 18, bold: true },
      { text: (data.apiName || '') + '  |  ' + (data.baseUrl || ''), size: 12 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CONFIGURATION ──', size: 14, bold: true },
      { text: 'Type: ' + (data.apiType || 'N/A') + '  |  Version: ' + (data.versionStrategy || 'N/A'), size: 10 },
      { text: 'Auth: ' + (data.authMethod || 'N/A') + '  |  Content: ' + (data.contentType || 'N/A'), size: 10 },
      { text: 'Rate Limit: ' + (data.rateLimit || 'N/A') + '  |  Pagination: ' + (data.pagination || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── ERROR RESPONSE FORMAT ──', size: 14, bold: true },
      { text: data.errorFormat || 'Not specified', size: 10 }
    ];
    // Group endpoints by resource
    var resourceMap = {};
    var resourceOrder = [];
    endpoints.forEach(function(ep) {
      if (!ep.resource) return;
      var key = ep.resource.trim();
      if (!resourceMap[key]) { resourceMap[key] = []; resourceOrder.push(key); }
      resourceMap[key].push(ep);
    });
    resourceOrder.forEach(function(res, i) {
      lines.push({ text: ' ', size: 6 });
      lines.push({ text: '── RESOURCE ' + (i + 1) + ': ' + res.toUpperCase() + ' ──', size: 14, bold: true });
      resourceMap[res].forEach(function(ep) {
        lines.push({ text: (ep.method || '???') + ' ' + (ep.path || '/') + (ep.description ? ' — ' + ep.description : ''), size: 10 });
        if (ep.requestBody) lines.push({ text: '  Request: ' + ep.requestBody.replace(/\n/g, ' '), size: 9 });
        if (ep.response) lines.push({ text: '  Response: ' + ep.response.replace(/\n/g, ' '), size: 9 });
        lines.push({ text: '  Auth: ' + (ep.authRequired || 'Yes') + (ep.notes ? '  |  ' + ep.notes : ''), size: 9 });
      });
    });
    return this.generatePDF(filename, { title: 'API Design Specification', lines: lines });
  },


  // ============================================================
  // 7. EVENT-DRIVEN ARCHITECTURE DESIGN
  // ============================================================

  generateEventDrivenDesignWord: async function(filename, data) {
    var events = (data.events || []).filter(function(e) { return e.eventName && e.eventName.trim(); });
    var services = (data.services || []).filter(function(s) { return s.serviceName && s.serviceName.trim(); });

    var sections = [
      { heading: 'Event-Driven Architecture Design', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Messaging Infrastructure', content: [
        'Message Broker: ' + (data.broker || 'N/A'),
        'Messaging Pattern: ' + (data.pattern || 'N/A'),
        'Delivery Guarantee: ' + (data.delivery || 'N/A'),
        'Message Ordering: ' + (data.ordering || 'N/A'),
        'Retention Period: ' + (data.retention || 'N/A'),
        'Idempotency Strategy: ' + (data.idempotency || 'N/A'),
        'Expected Throughput: ' + (data.throughput || 'N/A')
      ]},
      { heading: '2. Dead Letter Queue Policy', content: [
        'Policy: ' + (data.dlqPolicy || 'N/A'),
        'Notes: ' + (data.dlqNotes || 'N/A')
      ]}
    ];

    // Event Types section
    if (events.length) {
      var eventContent = [];
      events.forEach(function(e, i) {
        eventContent.push('');
        eventContent.push('Event ' + (i + 1) + ': ' + e.eventName);
        if (e.topic) eventContent.push('  Topic/Queue: ' + e.topic);
        if (e.serialization) eventContent.push('  Serialization: ' + e.serialization);
        if (e.partitionKey) eventContent.push('  Partition Key: ' + e.partitionKey);
        if (e.priority) eventContent.push('  Priority: ' + e.priority);
        if (e.schema) eventContent.push('  Schema: ' + e.schema);
        if (e.notes) eventContent.push('  Notes: ' + e.notes);
      });
      sections.push({ heading: '3. Event Types & Schemas (' + events.length + ')', content: eventContent });
    } else {
      sections.push({ heading: '3. Event Types & Schemas', content: ['No events defined'] });
    }

    // Services section
    if (services.length) {
      var svcContent = [];
      services.forEach(function(s, i) {
        svcContent.push('');
        svcContent.push('Service ' + (i + 1) + ': ' + s.serviceName + (s.role ? ' [' + s.role + ']' : ''));
        if (s.publishes) svcContent.push('  Publishes: ' + s.publishes);
        if (s.subscribes) svcContent.push('  Subscribes: ' + s.subscribes);
        if (s.consumerGroup) svcContent.push('  Consumer Group: ' + s.consumerGroup);
        if (s.processing) svcContent.push('  Processing: ' + s.processing);
        if (s.notes) svcContent.push('  Notes: ' + s.notes);
      });
      sections.push({ heading: '4. Services – Producers & Consumers (' + services.length + ')', content: svcContent });
    } else {
      sections.push({ heading: '4. Services – Producers & Consumers', content: ['No services defined'] });
    }

    return this.generateWord(filename, { title: 'Event-Driven Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateEventDrivenDesignExcel: function(filename, data) {
    var events = (data.events || []).filter(function(e) { return e.eventName && e.eventName.trim(); });
    var services = (data.services || []).filter(function(s) { return s.serviceName && s.serviceName.trim(); });
    var wb = XLSX.utils.book_new();

    // Overview sheet
    var overview = [
      ['EVENT-DRIVEN ARCHITECTURE DESIGN'],
      ['System', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['MESSAGING INFRASTRUCTURE'],
      ['Parameter', 'Value'],
      ['Message Broker', data.broker || ''],
      ['Messaging Pattern', data.pattern || ''],
      ['Delivery Guarantee', data.delivery || ''],
      ['Message Ordering', data.ordering || ''],
      ['Retention Period', data.retention || ''],
      ['Idempotency Strategy', data.idempotency || ''],
      ['Expected Throughput', data.throughput || ''],
      [],
      ['DEAD LETTER QUEUE'],
      ['Policy', data.dlqPolicy || ''],
      ['Notes', data.dlqNotes || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 25 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');

    // Events sheet
    var evtRows = [['#', 'Event Name', 'Topic / Queue', 'Serialization', 'Partition Key', 'Priority', 'Schema / Payload', 'Notes']];
    events.forEach(function(e, i) {
      evtRows.push([i + 1, e.eventName || '', e.topic || '', e.serialization || '', e.partitionKey || '', e.priority || '', e.schema || '', e.notes || '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(evtRows);
    ws2['!cols'] = [{ wch: 4 }, { wch: 22 }, { wch: 25 }, { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 40 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Event Types');

    // Services sheet
    var svcRows = [['#', 'Service Name', 'Role', 'Publishes', 'Subscribes To', 'Consumer Group', 'Processing', 'Notes']];
    services.forEach(function(s, i) {
      svcRows.push([i + 1, s.serviceName || '', s.role || '', s.publishes || '', s.subscribes || '', s.consumerGroup || '', s.processing || '', s.notes || '']);
    });
    var ws3 = XLSX.utils.aoa_to_sheet(svcRows);
    ws3['!cols'] = [{ wch: 4 }, { wch: 22 }, { wch: 12 }, { wch: 28 }, { wch: 28 }, { wch: 20 }, { wch: 12 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Services');

    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateEventDrivenDesignPDF: function(filename, data) {
    var events = (data.events || []).filter(function(e) { return e.eventName && e.eventName.trim(); });
    var services = (data.services || []).filter(function(s) { return s.serviceName && s.serviceName.trim(); });

    var lines = [
      { text: 'EVENT-DRIVEN ARCHITECTURE DESIGN', size: 18, bold: true },
      { text: (data.systemName || ''), size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '\u2500\u2500 MESSAGING INFRASTRUCTURE \u2500\u2500', size: 14, bold: true },
      { text: 'Broker: ' + (data.broker || 'N/A'), size: 10 },
      { text: 'Pattern: ' + (data.pattern || 'N/A') + '  |  Delivery: ' + (data.delivery || 'N/A'), size: 10 },
      { text: 'Ordering: ' + (data.ordering || 'N/A') + '  |  Retention: ' + (data.retention || 'N/A'), size: 10 },
      { text: 'Idempotency: ' + (data.idempotency || 'N/A'), size: 10 },
      { text: 'Throughput: ' + (data.throughput || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '\u2500\u2500 DEAD LETTER QUEUE \u2500\u2500', size: 14, bold: true },
      { text: 'Policy: ' + (data.dlqPolicy || 'N/A'), size: 10 },
      { text: (data.dlqNotes || ''), size: 10 },
      { text: ' ', size: 6 },
      { text: '\u2500\u2500 EVENT TYPES & SCHEMAS (' + events.length + ') \u2500\u2500', size: 14, bold: true }
    ];

    events.forEach(function(e, i) {
      lines.push({ text: (i + 1) + '. ' + e.eventName + (e.priority ? '  [' + e.priority + ']' : ''), size: 11, bold: true });
      if (e.topic) lines.push({ text: '   Topic: ' + e.topic + (e.serialization ? '  |  Format: ' + e.serialization : ''), size: 10 });
      if (e.partitionKey) lines.push({ text: '   Partition: ' + e.partitionKey, size: 10 });
      if (e.schema) lines.push({ text: '   Schema: ' + e.schema, size: 9 });
      if (e.notes) lines.push({ text: '   Notes: ' + e.notes, size: 9 });
    });

    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '\u2500\u2500 SERVICES \u2013 PRODUCERS & CONSUMERS (' + services.length + ') \u2500\u2500', size: 14, bold: true });

    services.forEach(function(s, i) {
      lines.push({ text: (i + 1) + '. ' + s.serviceName + (s.role ? '  [' + s.role + ']' : ''), size: 11, bold: true });
      if (s.publishes) lines.push({ text: '   Publishes: ' + s.publishes, size: 10 });
      if (s.subscribes) lines.push({ text: '   Subscribes: ' + s.subscribes, size: 10 });
      if (s.consumerGroup) lines.push({ text: '   Consumer Group: ' + s.consumerGroup + (s.processing ? '  |  ' + s.processing : ''), size: 10 });
      if (s.notes) lines.push({ text: '   Notes: ' + s.notes, size: 9 });
    });

    return this.generatePDF(filename, { title: 'Event-Driven Architecture Design', lines: lines });
  },


  // ============================================================
  // 8. ARCHITECTURE DECISION RECORD (ADR)
  // ============================================================

  generateArchitectureDecisionWord: async function(filename, data) {
    var sections = [
      { heading: 'Architecture Decision Record', content: [
        'Decision: ' + (data.decisionTitle || 'N/A'),
        'Date: ' + (data.decisionDate || new Date().toLocaleDateString()),
        'Status: ' + (data.status || 'N/A')
      ]},
      { heading: '1. Context', content: (data.context || 'Not specified').split('\n') },
      { heading: '2. CAP Trade-off', content: [
        'CAP Choice: ' + (data.capChoice || 'N/A'),
        'Consistency Model: ' + (data.consistencyModel || 'N/A')
      ]},
      { heading: '3. Problem Statement', content: (data.problemStatement || 'Not specified').split('\n') },
      { heading: '4. Options Considered', content: (data.options || 'Not specified').split('\n') },
      { heading: '5. Decision & Rationale', content: (data.decision || 'Not specified').split('\n') },
      { heading: '6. Consequences', content: (data.consequences || 'Not specified').split('\n') },
      { heading: '7. Affected Services', content: [(data.affectedServices || 'Not specified')] }
    ];
    return this.generateWord(filename, { title: 'ADR – ' + (data.decisionTitle || ''), author: data.authorName || '', sections: sections });
  },

  generateArchitectureDecisionExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['ARCHITECTURE DECISION RECORD (ADR)'],
      ['Decision Title', data.decisionTitle || ''],
      ['Date', data.decisionDate || new Date().toLocaleDateString()],
      ['Status', data.status || ''],
      [],
      ['CAP Choice', data.capChoice || ''],
      ['Consistency Model', data.consistencyModel || ''],
      ['Affected Services', data.affectedServices || ''],
      [],
      ['CONTEXT'],
      [data.context || ''],
      [],
      ['PROBLEM STATEMENT'],
      [data.problemStatement || ''],
      [],
      ['OPTIONS CONSIDERED'],
      [data.options || ''],
      [],
      ['DECISION & RATIONALE'],
      [data.decision || ''],
      [],
      ['CONSEQUENCES'],
      [data.consequences || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'ADR');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateArchitectureDecisionPDF: function(filename, data) {
    var lines = [
      { text: 'ARCHITECTURE DECISION RECORD', size: 18, bold: true },
      { text: (data.decisionTitle || ''), size: 14 },
      { text: 'Date: ' + (data.decisionDate || new Date().toLocaleDateString()) + '  |  Status: ' + (data.status || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONTEXT ──', size: 14, bold: true },
      { text: data.context || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CAP TRADE-OFF ──', size: 14, bold: true },
      { text: 'CAP Choice: ' + (data.capChoice || 'N/A') + '  |  Consistency: ' + (data.consistencyModel || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── PROBLEM STATEMENT ──', size: 14, bold: true },
      { text: data.problemStatement || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── OPTIONS CONSIDERED ──', size: 14, bold: true },
      { text: data.options || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DECISION & RATIONALE ──', size: 14, bold: true },
      { text: data.decision || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CONSEQUENCES ──', size: 14, bold: true },
      { text: data.consequences || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── AFFECTED SERVICES ──', size: 14, bold: true },
      { text: data.affectedServices || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Architecture Decision Record', lines: lines });
  },

  generateArchitectureDecisionPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.decisionTitle || 'ADR',
      title: 'Architecture Decision Record',
      subtitle: 'Status: ' + (data.status || 'N/A') + '  |  ' + (data.decisionDate || new Date().toLocaleDateString()),
      perSlide: 2,
      sections: [
        { heading: 'Context', content: data.context || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'CAP Trade-off', content: 'Choice: ' + (data.capChoice || 'N/A') + '\nConsistency Model: ' + (data.consistencyModel || 'N/A'), color: DocStyles.colors.crimson },
        { heading: 'Problem Statement', content: data.problemStatement || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Options Considered', content: data.options || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Decision & Rationale', content: data.decision || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Consequences', content: data.consequences || 'Not specified', color: DocStyles.colors.crimson },
        { heading: 'Affected Services', content: data.affectedServices || 'Not specified', color: DocStyles.colors.blue }
      ]
    });
  },


  // ============================================================
  // 9. RATE LIMITING & API PROTECTION POLICY
  // ============================================================

  generateRateLimitPolicyWord: async function(filename, data) {
    var sections = [
      { heading: 'Rate Limiting & API Protection Policy', content: [
        'Service: ' + (data.serviceName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Algorithm', content: ['Algorithm: ' + (data.algorithm || 'N/A')] },
      { heading: '2. Rate Limit Tiers', content: (data.tiers || 'Not specified').split('\n') },
      { heading: '3. Scope & Key Identifier', content: [
        'Scope: ' + (data.scope || 'N/A')
      ]},
      { heading: '4. Response on Limit', content: ['Behavior: ' + (data.responseOnLimit || 'N/A')] },
      { heading: '5. Burst Allowance', content: [(data.burst || 'Not specified')] },
      { heading: '6. DDoS Mitigation', content: (data.ddos || 'Not specified').split('\n') },
      { heading: '7. Monitoring & Alerting', content: (data.monitoring || 'Not specified').split('\n') },
      { heading: '8. Whitelist / Bypass Rules', content: (data.whitelist || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Rate Limit Policy – ' + (data.serviceName || ''), author: data.authorName || '', sections: sections });
  },

  generateRateLimitPolicyExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['RATE LIMITING & API PROTECTION POLICY'],
      ['Service', data.serviceName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['ALGORITHM & SCOPE'],
      ['Parameter', 'Value'],
      ['Algorithm', data.algorithm || ''],
      ['Scope', data.scope || ''],
      ['Response on Limit', data.responseOnLimit || ''],
      ['Burst Allowance', data.burst || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 25 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Policy Overview');
    // Tiers sheet
    var tierRows = [['Tier Name', 'Rate Limit', 'Window', 'Notes']];
    (data.tiers || '').split('\n').forEach(function(t) {
      if (t.trim()) tierRows.push([t.trim(), '', '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(tierRows);
    ws2['!cols'] = [{ wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Rate Limit Tiers');
    // Security sheet
    var sec = [
      ['DDoS MITIGATION'],
      [data.ddos || 'Not specified'],
      [],
      ['MONITORING & ALERTING'],
      [data.monitoring || 'Not specified'],
      [],
      ['WHITELIST / BYPASS RULES'],
      [data.whitelist || 'Not specified']
    ];
    var ws3 = XLSX.utils.aoa_to_sheet(sec);
    ws3['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Security & Monitoring');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateRateLimitPolicyPDF: function(filename, data) {
    var lines = [
      { text: 'RATE LIMITING & API PROTECTION POLICY', size: 18, bold: true },
      { text: (data.serviceName || ''), size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── ALGORITHM & SCOPE ──', size: 14, bold: true },
      { text: 'Algorithm: ' + (data.algorithm || 'N/A'), size: 10 },
      { text: 'Scope: ' + (data.scope || 'N/A'), size: 10 },
      { text: 'Response on Limit: ' + (data.responseOnLimit || 'N/A'), size: 10 },
      { text: 'Burst Allowance: ' + (data.burst || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── RATE LIMIT TIERS ──', size: 14, bold: true },
      { text: data.tiers || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DDoS MITIGATION ──', size: 14, bold: true },
      { text: data.ddos || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── MONITORING ──', size: 14, bold: true },
      { text: data.monitoring || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── WHITELIST / BYPASS ──', size: 14, bold: true },
      { text: data.whitelist || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Rate Limiting Policy', lines: lines });
  },


  // ============================================================
  // 10. OBSERVABILITY & MONITORING PLAN
  // ============================================================

  generateObservabilityPlanWord: async function(filename, data) {
    var metrics = (data.metrics || []).filter(function(m) { return m.metricName && m.metricName.trim(); });
    var logs = (data.logs || []).filter(function(l) { return l.source && l.source.trim(); });
    var slos = (data.slos || []).filter(function(s) { return s.sliName && s.sliName.trim(); });
    var alerts = (data.alerts || []).filter(function(a) { return a.alertName && a.alertName.trim(); });
    var dashboards = (data.dashboards || []).filter(function(d) { return d.dashName && d.dashName.trim(); });

    var sections = [
      { heading: 'Observability & Monitoring Plan', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Monitoring Stack: ' + (data.stack || 'N/A'),
        'Distributed Tracing: ' + (data.tracing || 'N/A'),
        'Default Log Format: ' + (data.logFormat || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]}
    ];

    // Key Metrics
    var metricContent = [];
    metrics.forEach(function(m, i) {
      metricContent.push('');
      metricContent.push('Metric ' + (i + 1) + ': ' + m.metricName + (m.metricType ? ' [' + m.metricType + ']' : ''));
      if (m.unit) metricContent.push('  Unit: ' + m.unit);
      if (m.threshold) metricContent.push('  Threshold: ' + m.threshold);
      if (m.notes) metricContent.push('  Notes: ' + m.notes);
    });
    sections.push({ heading: '1. Key Metrics (' + metrics.length + ')', content: metricContent.length ? metricContent : ['No metrics defined'] });

    // Log Sources
    var logContent = [];
    logs.forEach(function(l, i) {
      logContent.push('');
      logContent.push('Source ' + (i + 1) + ': ' + l.source + (l.level ? ' [' + l.level + ']' : ''));
      if (l.retention) logContent.push('  Retention: ' + l.retention);
      if (l.destination) logContent.push('  Destination: ' + l.destination);
      if (l.notes) logContent.push('  Notes: ' + l.notes);
    });
    sections.push({ heading: '2. Logging Strategy (' + logs.length + ')', content: logContent.length ? logContent : ['No log sources defined'] });

    // SLO Targets
    var sloContent = [];
    slos.forEach(function(s, i) {
      sloContent.push('');
      sloContent.push('SLO ' + (i + 1) + ': ' + s.sliName + (s.target ? ' → ' + s.target : ''));
      if (s.window) sloContent.push('  Window: ' + s.window);
      if (s.errorBudget) sloContent.push('  Error Budget: ' + s.errorBudget);
      if (s.notes) sloContent.push('  Notes: ' + s.notes);
    });
    sections.push({ heading: '3. SLO Targets (' + slos.length + ')', content: sloContent.length ? sloContent : ['No SLOs defined'] });

    // Alert Rules
    var alertContent = [];
    alerts.forEach(function(a, i) {
      alertContent.push('');
      alertContent.push('Alert ' + (i + 1) + ': ' + a.alertName + (a.severity ? ' [' + a.severity + ']' : ''));
      if (a.condition) alertContent.push('  Condition: ' + a.condition);
      if (a.channel) alertContent.push('  Channel: ' + a.channel);
      if (a.runbook) alertContent.push('  Runbook: ' + a.runbook);
      if (a.notes) alertContent.push('  Notes: ' + a.notes);
    });
    sections.push({ heading: '4. Alerting Rules (' + alerts.length + ')', content: alertContent.length ? alertContent : ['No alerts defined'] });

    // Dashboards
    var dashContent = [];
    dashboards.forEach(function(d, i) {
      dashContent.push('');
      dashContent.push('Dashboard ' + (i + 1) + ': ' + d.dashName + (d.dashType ? ' [' + d.dashType + ']' : ''));
      if (d.audience) dashContent.push('  Audience: ' + d.audience);
      if (d.refresh) dashContent.push('  Refresh: ' + d.refresh);
      if (d.panels) dashContent.push('  Panels: ' + d.panels);
      if (d.notes) dashContent.push('  Notes: ' + d.notes);
    });
    sections.push({ heading: '5. Dashboard Design (' + dashboards.length + ')', content: dashContent.length ? dashContent : ['No dashboards defined'] });

    return this.generateWord(filename, { title: 'Observability Plan – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateObservabilityPlanExcel: function(filename, data) {
    var metrics = (data.metrics || []).filter(function(m) { return m.metricName && m.metricName.trim(); });
    var logs = (data.logs || []).filter(function(l) { return l.source && l.source.trim(); });
    var slos = (data.slos || []).filter(function(s) { return s.sliName && s.sliName.trim(); });
    var alerts = (data.alerts || []).filter(function(a) { return a.alertName && a.alertName.trim(); });
    var dashboards = (data.dashboards || []).filter(function(d) { return d.dashName && d.dashName.trim(); });
    var wb = XLSX.utils.book_new();

    // Overview sheet
    var overview = [
      ['OBSERVABILITY & MONITORING PLAN'],
      ['System', data.systemName || ''],
      ['Monitoring Stack', data.stack || ''],
      ['Distributed Tracing', data.tracing || ''],
      ['Default Log Format', data.logFormat || ''],
      ['Date', new Date().toLocaleDateString()]
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 22 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');

    // Metrics sheet
    var metricRows = [['#', 'Metric Name', 'Type', 'Unit / Quantile', 'Threshold / Target', 'Notes']];
    metrics.forEach(function(m, i) {
      metricRows.push([i + 1, m.metricName || '', m.metricType || '', m.unit || '', m.threshold || '', m.notes || '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(metricRows);
    ws2['!cols'] = [{ wch: 4 }, { wch: 25 }, { wch: 12 }, { wch: 20 }, { wch: 22 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Key Metrics');

    // Logs sheet
    var logRows = [['#', 'Source / Service', 'Min Level', 'Retention', 'Destination', 'Notes']];
    logs.forEach(function(l, i) {
      logRows.push([i + 1, l.source || '', l.level || '', l.retention || '', l.destination || '', l.notes || '']);
    });
    var ws3 = XLSX.utils.aoa_to_sheet(logRows);
    ws3['!cols'] = [{ wch: 4 }, { wch: 22 }, { wch: 10 }, { wch: 22 }, { wch: 22 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Log Sources');

    // SLOs sheet
    var sloRows = [['#', 'SLI Name', 'Target', 'Window', 'Error Budget', 'Notes']];
    slos.forEach(function(s, i) {
      sloRows.push([i + 1, s.sliName || '', s.target || '', s.window || '', s.errorBudget || '', s.notes || '']);
    });
    var ws4 = XLSX.utils.aoa_to_sheet(sloRows);
    ws4['!cols'] = [{ wch: 4 }, { wch: 25 }, { wch: 15 }, { wch: 16 }, { wch: 22 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'SLO Targets');

    // Alerts sheet
    var alertRows = [['#', 'Alert Name', 'Condition', 'Severity', 'Channel', 'Runbook', 'Notes']];
    alerts.forEach(function(a, i) {
      alertRows.push([i + 1, a.alertName || '', a.condition || '', a.severity || '', a.channel || '', a.runbook || '', a.notes || '']);
    });
    var ws5 = XLSX.utils.aoa_to_sheet(alertRows);
    ws5['!cols'] = [{ wch: 4 }, { wch: 22 }, { wch: 28 }, { wch: 14 }, { wch: 16 }, { wch: 35 }, { wch: 28 }];
    XLSX.utils.book_append_sheet(wb, ws5, 'Alert Rules');

    // Dashboards sheet
    var dashRows = [['#', 'Dashboard Name', 'Type', 'Key Panels', 'Audience', 'Refresh', 'Notes']];
    dashboards.forEach(function(d, i) {
      dashRows.push([i + 1, d.dashName || '', d.dashType || '', d.panels || '', d.audience || '', d.refresh || '', d.notes || '']);
    });
    var ws6 = XLSX.utils.aoa_to_sheet(dashRows);
    ws6['!cols'] = [{ wch: 4 }, { wch: 25 }, { wch: 18 }, { wch: 35 }, { wch: 16 }, { wch: 14 }, { wch: 28 }];
    XLSX.utils.book_append_sheet(wb, ws6, 'Dashboards');

    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateObservabilityPlanPDF: function(filename, data) {
    var metrics = (data.metrics || []).filter(function(m) { return m.metricName && m.metricName.trim(); });
    var logs = (data.logs || []).filter(function(l) { return l.source && l.source.trim(); });
    var slos = (data.slos || []).filter(function(s) { return s.sliName && s.sliName.trim(); });
    var alerts = (data.alerts || []).filter(function(a) { return a.alertName && a.alertName.trim(); });
    var dashboards = (data.dashboards || []).filter(function(d) { return d.dashName && d.dashName.trim(); });

    var lines = [
      { text: 'OBSERVABILITY & MONITORING PLAN', size: 18, bold: true },
      { text: (data.systemName || ''), size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── MONITORING STACK ──', size: 14, bold: true },
      { text: 'Stack: ' + (data.stack || 'N/A') + '  |  Tracing: ' + (data.tracing || 'N/A'), size: 10 },
      { text: 'Log Format: ' + (data.logFormat || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY METRICS (' + metrics.length + ') ──', size: 14, bold: true }
    ];

    metrics.forEach(function(m, i) {
      lines.push({ text: (i + 1) + '. ' + m.metricName + (m.metricType ? '  [' + m.metricType + ']' : ''), size: 11, bold: true });
      if (m.unit || m.threshold) lines.push({ text: '   ' + (m.unit ? 'Unit: ' + m.unit : '') + (m.unit && m.threshold ? '  |  ' : '') + (m.threshold ? 'Threshold: ' + m.threshold : ''), size: 10 });
      if (m.notes) lines.push({ text: '   ' + m.notes, size: 9 });
    });

    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '── LOG SOURCES (' + logs.length + ') ──', size: 14, bold: true });

    logs.forEach(function(l, i) {
      lines.push({ text: (i + 1) + '. ' + l.source + (l.level ? '  [' + l.level + ']' : ''), size: 11, bold: true });
      if (l.retention || l.destination) lines.push({ text: '   ' + (l.retention ? 'Retention: ' + l.retention : '') + (l.retention && l.destination ? '  |  ' : '') + (l.destination ? 'Dest: ' + l.destination : ''), size: 10 });
      if (l.notes) lines.push({ text: '   ' + l.notes, size: 9 });
    });

    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '── SLO TARGETS (' + slos.length + ') ──', size: 14, bold: true });

    slos.forEach(function(s, i) {
      lines.push({ text: (i + 1) + '. ' + s.sliName + (s.target ? ' → ' + s.target : ''), size: 11, bold: true });
      if (s.window || s.errorBudget) lines.push({ text: '   ' + (s.window ? 'Window: ' + s.window : '') + (s.window && s.errorBudget ? '  |  ' : '') + (s.errorBudget ? 'Budget: ' + s.errorBudget : ''), size: 10 });
      if (s.notes) lines.push({ text: '   ' + s.notes, size: 9 });
    });

    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '── ALERT RULES (' + alerts.length + ') ──', size: 14, bold: true });

    alerts.forEach(function(a, i) {
      lines.push({ text: (i + 1) + '. ' + a.alertName + (a.severity ? '  [' + a.severity + ']' : ''), size: 11, bold: true });
      if (a.condition) lines.push({ text: '   Condition: ' + a.condition, size: 10 });
      if (a.channel || a.runbook) lines.push({ text: '   ' + (a.channel ? 'Channel: ' + a.channel : '') + (a.channel && a.runbook ? '  |  ' : '') + (a.runbook ? 'Runbook: ' + a.runbook : ''), size: 10 });
      if (a.notes) lines.push({ text: '   ' + a.notes, size: 9 });
    });

    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '── DASHBOARDS (' + dashboards.length + ') ──', size: 14, bold: true });

    dashboards.forEach(function(d, i) {
      lines.push({ text: (i + 1) + '. ' + d.dashName + (d.dashType ? '  [' + d.dashType + ']' : ''), size: 11, bold: true });
      if (d.audience || d.refresh) lines.push({ text: '   ' + (d.audience ? 'Audience: ' + d.audience : '') + (d.audience && d.refresh ? '  |  ' : '') + (d.refresh ? 'Refresh: ' + d.refresh : ''), size: 10 });
      if (d.panels) lines.push({ text: '   Panels: ' + d.panels, size: 10 });
      if (d.notes) lines.push({ text: '   ' + d.notes, size: 9 });
    });

    return this.generatePDF(filename, { title: 'Observability & Monitoring Plan', lines: lines });
  },


  // ============================================================
  // 11. SYSTEM DESIGN CASE STUDY
  // ============================================================

  generateDesignCaseStudyWord: async function(filename, data) {
    var sections = [
      { heading: 'System Design Case Study', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Type: ' + (data.systemType || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Functional Requirements', content: (data.functionalReqs || 'Not specified').split('\n') },
      { heading: '2. Non-Functional Requirements', content: (data.nonFunctionalReqs || 'Not specified').split('\n') },
      { heading: '3. Scale Estimates', content: (data.scaleEstimates || 'Not specified').split('\n') },
      { heading: '4. Core Components', content: (data.coreComponents || 'Not specified').split('\n') },
      { heading: '5. Database Choice & Rationale', content: (data.dbChoice || 'Not specified').split('\n') },
      { heading: '6. Key Trade-offs', content: (data.tradeoffs || 'Not specified').split('\n') },
      { heading: '7. Bottlenecks & Mitigation', content: (data.bottlenecks || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Case Study – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateDesignCaseStudyExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var overview = [
      ['SYSTEM DESIGN CASE STUDY'],
      ['System', data.systemName || ''],
      ['Type', data.systemType || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['FUNCTIONAL REQUIREMENTS'],
      [data.functionalReqs || ''],
      [],
      ['NON-FUNCTIONAL REQUIREMENTS'],
      [data.nonFunctionalReqs || ''],
      [],
      ['SCALE ESTIMATES'],
      [data.scaleEstimates || ''],
      [],
      ['CORE COMPONENTS'],
      [data.coreComponents || ''],
      [],
      ['DATABASE CHOICE & RATIONALE'],
      [data.dbChoice || ''],
      [],
      ['KEY TRADE-OFFS'],
      [data.tradeoffs || ''],
      [],
      ['BOTTLENECKS & MITIGATION'],
      [data.bottlenecks || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(overview);
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Case Study');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDesignCaseStudyPDF: function(filename, data) {
    var lines = [
      { text: 'SYSTEM DESIGN CASE STUDY', size: 18, bold: true },
      { text: (data.systemName || '') + '  (' + (data.systemType || '') + ')', size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FUNCTIONAL REQUIREMENTS ──', size: 14, bold: true },
      { text: data.functionalReqs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NON-FUNCTIONAL REQUIREMENTS ──', size: 14, bold: true },
      { text: data.nonFunctionalReqs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── SCALE ESTIMATES ──', size: 14, bold: true },
      { text: data.scaleEstimates || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CORE COMPONENTS ──', size: 14, bold: true },
      { text: data.coreComponents || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DATABASE CHOICE ──', size: 14, bold: true },
      { text: data.dbChoice || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY TRADE-OFFS ──', size: 14, bold: true },
      { text: data.tradeoffs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BOTTLENECKS & MITIGATION ──', size: 14, bold: true },
      { text: data.bottlenecks || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'System Design Case Study', lines: lines });
  },

  generateDesignCaseStudyPPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'System Design Case Study',
      subtitle: 'Type: ' + (data.systemType || 'N/A') + '  |  ' + new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Functional Requirements', content: data.functionalReqs || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Non-Functional Requirements', content: data.nonFunctionalReqs || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Scale Estimates', content: data.scaleEstimates || 'Not specified', color: DocStyles.colors.teal },
        { heading: 'Core Components', content: data.coreComponents || 'Not specified', color: DocStyles.colors.navy },
        { heading: 'Database Choice & Rationale', content: data.dbChoice || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Key Trade-offs', content: data.tradeoffs || 'Not specified', color: DocStyles.colors.crimson },
        { heading: 'Bottlenecks & Mitigation', content: data.bottlenecks || 'Not specified', color: DocStyles.colors.navy }
      ]
    });
  },


  // ============================================================
  // 12. LOW-LEVEL DESIGN DOCUMENT
  // ============================================================

  generateLowLevelDesignWord: async function(filename, data) {
    var dataModels = data.dataModels || [];
    var classes = data.classes || [];
    var apis = data.apis || [];
    var solid = data.solidPrinciples || [];

    // Build data model sections
    var modelSections = [];
    dataModels.forEach(function(m, i) {
      if (!m.entityName) return;
      modelSections.push({
        heading: 'Data Model ' + (i + 1) + ': ' + m.entityName,
        content: [
          'Fields: ' + (m.fields || 'N/A'),
          'Relationships: ' + (m.relationships || 'N/A'),
          'Constraints: ' + (m.constraints || 'N/A')
        ]
      });
    });
    // Build class sections
    var classSections = [];
    classes.forEach(function(c, i) {
      if (!c.className) return;
      classSections.push({
        heading: 'Class ' + (i + 1) + ': ' + c.className + (c.type ? ' (' + c.type + ')' : ''),
        content: [
          'Responsibility: ' + (c.responsibility || 'N/A'),
          'Methods:',
          c.methods || 'N/A',
          'Dependencies: ' + (c.dependencies || 'N/A'),
          'Design Pattern: ' + (c.pattern || 'N/A')
        ]
      });
    });
    // Build API sections
    var apiSections = [];
    apis.forEach(function(a, i) {
      if (!a.endpoint) return;
      apiSections.push({
        heading: 'API ' + (i + 1) + ': ' + (a.method || 'GET') + ' ' + a.endpoint,
        content: [
          'Request: ' + (a.requestBody || 'N/A'),
          'Response: ' + (a.responseBody || 'N/A'),
          'Error Codes: ' + (a.errorCodes || 'N/A'),
          'Notes: ' + (a.notes || 'N/A')
        ]
      });
    });
    // Build SOLID section
    var solidContent = [];
    solid.forEach(function(s) {
      if (!s.principle) return;
      solidContent.push(s.principle + ': ' + (s.application || 'N/A'));
      if (s.example) solidContent.push('  Example: ' + s.example);
    });

    var sections = [
      { heading: 'Low-Level Design Document', content: [
        'Component: ' + (data.componentName || 'N/A'),
        'Language: ' + (data.language || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Design Patterns Overview', content: (data.patterns || 'Not specified').split('\n') },
      { heading: '2. Data Models (' + dataModels.length + ')', content: ['See sub-sections below'] }
    ].concat(modelSections).concat([
      { heading: '3. Classes & Interfaces (' + classes.length + ')', content: ['See sub-sections below'] }
    ]).concat(classSections).concat([
      { heading: '4. Internal API Contracts (' + apis.length + ')', content: ['See sub-sections below'] }
    ]).concat(apiSections).concat([
      { heading: '5. SOLID Principles Applied', content: solidContent.length > 0 ? solidContent : ['Not specified'] },
      { heading: '6. Concurrency / Thread Safety', content: (data.concurrency || 'Not specified').split('\n') }
    ]);
    return this.generateWord(filename, { title: 'LLD – ' + (data.componentName || ''), author: data.authorName || '', sections: sections });
  },

  generateLowLevelDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var dataModels = data.dataModels || [];
    var classes = data.classes || [];
    var apis = data.apis || [];
    var solid = data.solidPrinciples || [];

    // Overview sheet
    var overview = [
      ['LOW-LEVEL DESIGN DOCUMENT'],
      ['Component', data.componentName || ''],
      ['Language', data.language || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['DESIGN PATTERNS OVERVIEW'],
      [data.patterns || 'Not specified'],
      [],
      ['CONCURRENCY / THREAD SAFETY'],
      [data.concurrency || 'Not specified'],
      [],
      ['SUMMARY'],
      ['Data Models', dataModels.length],
      ['Classes / Interfaces', classes.length],
      ['API Contracts', apis.length],
      ['SOLID Principles', solid.length]
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 30 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');

    // Data Models sheet
    var dmRows = [['#', 'Entity Name', 'Fields', 'Relationships', 'Constraints']];
    dataModels.forEach(function(m, i) {
      if (m.entityName) dmRows.push([i + 1, m.entityName, m.fields || '', m.relationships || '', m.constraints || '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(dmRows);
    ws2['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 40 }, { wch: 30 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Data Models');

    // Classes & Interfaces sheet
    var clsRows = [['#', 'Name', 'Type', 'Responsibility', 'Methods', 'Dependencies', 'Pattern']];
    classes.forEach(function(c, i) {
      if (c.className) clsRows.push([i + 1, c.className, c.type || '', c.responsibility || '', c.methods || '', c.dependencies || '', c.pattern || '']);
    });
    var ws3 = XLSX.utils.aoa_to_sheet(clsRows);
    ws3['!cols'] = [{ wch: 5 }, { wch: 22 }, { wch: 15 }, { wch: 30 }, { wch: 35 }, { wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Classes & Interfaces');

    // API Contracts sheet
    var apiRows = [['#', 'Method', 'Endpoint', 'Request', 'Response', 'Error Codes', 'Notes']];
    apis.forEach(function(a, i) {
      if (a.endpoint) apiRows.push([i + 1, a.method || 'GET', a.endpoint, a.requestBody || '', a.responseBody || '', a.errorCodes || '', a.notes || '']);
    });
    var ws4 = XLSX.utils.aoa_to_sheet(apiRows);
    ws4['!cols'] = [{ wch: 5 }, { wch: 10 }, { wch: 25 }, { wch: 30 }, { wch: 35 }, { wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'API Contracts');

    // SOLID Principles sheet
    var solidRows = [['Principle', 'How Applied', 'Example / Reference']];
    solid.forEach(function(s) {
      if (s.principle) solidRows.push([s.principle, s.application || '', s.example || '']);
    });
    var ws5 = XLSX.utils.aoa_to_sheet(solidRows);
    ws5['!cols'] = [{ wch: 15 }, { wch: 50 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws5, 'SOLID Principles');

    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateLowLevelDesignPDF: function(filename, data) {
    var dataModels = data.dataModels || [];
    var classes = data.classes || [];
    var apis = data.apis || [];
    var solid = data.solidPrinciples || [];

    var lines = [
      { text: 'LOW-LEVEL DESIGN DOCUMENT', size: 18, bold: true },
      { text: (data.componentName || ''), size: 13 },
      { text: 'Language: ' + (data.language || 'N/A') + '  |  Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── DESIGN PATTERNS ──', size: 14, bold: true },
      { text: data.patterns || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DATA MODELS (' + dataModels.length + ') ──', size: 14, bold: true }
    ];
    dataModels.forEach(function(m, i) {
      if (!m.entityName) return;
      lines.push({ text: (i + 1) + '. ' + m.entityName, size: 11, bold: true });
      if (m.fields) lines.push({ text: '  Fields: ' + m.fields.replace(/\n/g, ', '), size: 9 });
      if (m.relationships) lines.push({ text: '  Relations: ' + m.relationships, size: 9 });
      if (m.constraints) lines.push({ text: '  Constraints: ' + m.constraints.replace(/\n/g, ', '), size: 9 });
    });
    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '── CLASSES & INTERFACES (' + classes.length + ') ──', size: 14, bold: true });
    classes.forEach(function(c, i) {
      if (!c.className) return;
      lines.push({ text: (i + 1) + '. ' + c.className + (c.type ? ' (' + c.type + ')' : ''), size: 11, bold: true });
      if (c.responsibility) lines.push({ text: '  Responsibility: ' + c.responsibility, size: 9 });
      if (c.methods) lines.push({ text: '  Methods: ' + c.methods.replace(/\n/g, ', '), size: 9 });
      if (c.dependencies) lines.push({ text: '  Dependencies: ' + c.dependencies, size: 9 });
      if (c.pattern) lines.push({ text: '  Pattern: ' + c.pattern, size: 9 });
    });
    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '── API CONTRACTS (' + apis.length + ') ──', size: 14, bold: true });
    apis.forEach(function(a, i) {
      if (!a.endpoint) return;
      lines.push({ text: (i + 1) + '. ' + (a.method || 'GET') + ' ' + a.endpoint, size: 11, bold: true });
      if (a.requestBody) lines.push({ text: '  Request: ' + a.requestBody.replace(/\n/g, ', '), size: 9 });
      if (a.responseBody) lines.push({ text: '  Response: ' + a.responseBody.replace(/\n/g, ', '), size: 9 });
      if (a.errorCodes) lines.push({ text: '  Errors: ' + a.errorCodes, size: 9 });
      if (a.notes) lines.push({ text: '  Notes: ' + a.notes, size: 9 });
    });
    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '── SOLID PRINCIPLES ──', size: 14, bold: true });
    solid.forEach(function(s) {
      if (!s.principle) return;
      lines.push({ text: s.principle + ': ' + (s.application || 'N/A'), size: 10 });
      if (s.example) lines.push({ text: '  Ref: ' + s.example, size: 9 });
    });
    lines.push({ text: ' ', size: 6 });
    lines.push({ text: '── CONCURRENCY / THREAD SAFETY ──', size: 14, bold: true });
    lines.push({ text: data.concurrency || 'Not specified', size: 10 });
    return this.generatePDF(filename, { title: 'Low-Level Design Document', lines: lines });
  },


  // ============================================================
  // 13. DISTRIBUTED ARCHITECTURE DESIGN
  // ============================================================

  generateDistributedDesignWord: async function(filename, data) {
    var sections = [
      { heading: 'Distributed Architecture Design', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Cluster Configuration', content: [
        'Nodes / Clusters: ' + (data.nodes || 'N/A'),
        'Replication Factor: ' + (data.replicationFactor || 'N/A'),
        'Fault Tolerance Target: ' + (data.faultTolerance || 'N/A')
      ]},
      { heading: '2. Consensus Algorithm', content: ['Algorithm: ' + (data.consensus || 'N/A')] },
      { heading: '3. Coordination Service', content: ['Service: ' + (data.coordination || 'N/A')] },
      { heading: '4. Leader Election', content: ['Strategy: ' + (data.leaderElection || 'N/A')] },
      { heading: '5. Clock Synchronization', content: ['Method: ' + (data.clockSync || 'N/A')] },
      { heading: '6. Data Partitioning', content: (data.partitioning || 'Not specified').split('\n') },
      { heading: '7. Network Assumptions', content: (data.networkAssumptions || 'Not specified').split('\n') },
      { heading: '8. Storage Architecture', content: ['Architecture: ' + (data.storage || 'N/A')] }
    ];
    return this.generateWord(filename, { title: 'Distributed Design – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateDistributedDesignExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    var rows = [
      ['DISTRIBUTED ARCHITECTURE DESIGN'],
      ['System', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['CLUSTER CONFIGURATION'],
      ['Parameter', 'Value'],
      ['Nodes / Clusters', data.nodes || ''],
      ['Replication Factor', data.replicationFactor || ''],
      ['Fault Tolerance', data.faultTolerance || ''],
      [],
      ['DISTRIBUTED ALGORITHMS'],
      ['Consensus', data.consensus || ''],
      ['Coordination Service', data.coordination || ''],
      ['Leader Election', data.leaderElection || ''],
      ['Clock Synchronization', data.clockSync || ''],
      ['Storage Architecture', data.storage || ''],
      [],
      ['DATA PARTITIONING'],
      [data.partitioning || ''],
      [],
      ['NETWORK ASSUMPTIONS'],
      [data.networkAssumptions || '']
    ];
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 28 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Distributed Design');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateDistributedDesignPDF: function(filename, data) {
    var lines = [
      { text: 'DISTRIBUTED ARCHITECTURE DESIGN', size: 18, bold: true },
      { text: (data.systemName || ''), size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── CLUSTER CONFIGURATION ──', size: 14, bold: true },
      { text: 'Nodes: ' + (data.nodes || 'N/A') + '  |  Replication Factor: ' + (data.replicationFactor || 'N/A'), size: 10 },
      { text: 'Fault Tolerance: ' + (data.faultTolerance || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── DISTRIBUTED ALGORITHMS ──', size: 14, bold: true },
      { text: 'Consensus: ' + (data.consensus || 'N/A'), size: 10 },
      { text: 'Coordination: ' + (data.coordination || 'N/A'), size: 10 },
      { text: 'Leader Election: ' + (data.leaderElection || 'N/A'), size: 10 },
      { text: 'Clock Sync: ' + (data.clockSync || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── DATA PARTITIONING ──', size: 14, bold: true },
      { text: data.partitioning || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NETWORK ASSUMPTIONS ──', size: 14, bold: true },
      { text: data.networkAssumptions || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── STORAGE ARCHITECTURE ──', size: 14, bold: true },
      { text: data.storage || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Distributed Architecture Design', lines: lines });
  },


  // ============================================================
  // 14. SECURITY ARCHITECTURE & COMPLIANCE
  // ============================================================

  generateSecurityArchitectureWord: async function(filename, data) {
    var sections = [
      { heading: 'Security Architecture & Compliance Document', content: [
        'System: ' + (data.systemName || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Authentication', content: [
        'Method: ' + (data.authMethod || 'N/A')
      ]},
      { heading: '2. Authorization', content: [
        'Model: ' + (data.authzModel || 'N/A'),
        'User Roles: ' + (data.roles || 'N/A')
      ]},
      { heading: '3. Encryption', content: [
        'At Rest: ' + (data.encryptionRest || 'N/A'),
        'In Transit: ' + (data.encryptionTransit || 'N/A')
      ]},
      { heading: '4. Key & Secrets Management', content: [
        'Key Management: ' + (data.keyMgmt || 'N/A'),
        'Secrets Management: ' + (data.secretsMgmt || 'N/A')
      ]},
      { heading: '5. Compliance Requirements', content: [(data.compliance || 'Not specified')] },
      { heading: '6. Threat Model Summary', content: (data.threatModel || 'Not specified').split('\n') },
      { heading: '7. Zero Trust Considerations', content: (data.zeroTrust || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Security Architecture – ' + (data.systemName || ''), author: data.authorName || '', sections: sections });
  },

  generateSecurityArchitectureExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    // Overview
    var overview = [
      ['SECURITY ARCHITECTURE & COMPLIANCE'],
      ['System', data.systemName || ''],
      ['Date', new Date().toLocaleDateString()],
      [],
      ['AUTHENTICATION & AUTHORIZATION'],
      ['Parameter', 'Value'],
      ['Auth Method', data.authMethod || ''],
      ['Authz Model', data.authzModel || ''],
      [],
      ['ENCRYPTION'],
      ['At Rest', data.encryptionRest || ''],
      ['In Transit', data.encryptionTransit || ''],
      [],
      ['KEY & SECRETS'],
      ['Key Management', data.keyMgmt || ''],
      ['Secrets Management', data.secretsMgmt || ''],
      [],
      ['COMPLIANCE'],
      [data.compliance || '']
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 25 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Security Overview');
    // Roles sheet
    var roleRows = [['Role', 'Permissions', 'Access Level']];
    (data.roles || '').split('\n').forEach(function(r) {
      if (r.trim()) roleRows.push([r.trim(), '', '']);
    });
    var ws2 = XLSX.utils.aoa_to_sheet(roleRows);
    ws2['!cols'] = [{ wch: 20 }, { wch: 35 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'RBAC Roles');
    // Threats sheet
    var threats = [
      ['THREAT MODEL SUMMARY'],
      [data.threatModel || ''],
      [],
      ['ZERO TRUST CONSIDERATIONS'],
      [data.zeroTrust || '']
    ];
    var ws3 = XLSX.utils.aoa_to_sheet(threats);
    ws3['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Threats & Zero Trust');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateSecurityArchitecturePDF: function(filename, data) {
    var lines = [
      { text: 'SECURITY ARCHITECTURE & COMPLIANCE', size: 18, bold: true },
      { text: (data.systemName || ''), size: 13 },
      { text: 'Generated: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── AUTHENTICATION ──', size: 14, bold: true },
      { text: 'Method: ' + (data.authMethod || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── AUTHORIZATION ──', size: 14, bold: true },
      { text: 'Model: ' + (data.authzModel || 'N/A'), size: 10 },
      { text: 'Roles: ' + (data.roles || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── ENCRYPTION ──', size: 14, bold: true },
      { text: 'At Rest: ' + (data.encryptionRest || 'N/A') + '  |  In Transit: ' + (data.encryptionTransit || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY & SECRETS MANAGEMENT ──', size: 14, bold: true },
      { text: 'Keys: ' + (data.keyMgmt || 'N/A') + '  |  Secrets: ' + (data.secretsMgmt || 'N/A'), size: 10 },
      { text: ' ', size: 6 },
      { text: '── COMPLIANCE ──', size: 14, bold: true },
      { text: data.compliance || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── THREAT MODEL ──', size: 14, bold: true },
      { text: data.threatModel || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── ZERO TRUST ──', size: 14, bold: true },
      { text: data.zeroTrust || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'Security Architecture Document', lines: lines });
  },

  generateSecurityArchitecturePPTX: async function(filename, data) {
    return this._generateSectionsPPTX(filename, {
      entityName: data.systemName || 'System',
      title: 'Security Architecture & Compliance',
      subtitle: new Date().toLocaleDateString(),
      perSlide: 2,
      sections: [
        { heading: 'Authentication', content: 'Method: ' + (data.authMethod || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Authorization', content: 'Model: ' + (data.authzModel || 'N/A') + '\n\nRoles:\n' + (data.roles || 'N/A'), color: DocStyles.colors.blue },
        { heading: 'Encryption', content: 'At Rest: ' + (data.encryptionRest || 'N/A') + '\nIn Transit: ' + (data.encryptionTransit || 'N/A'), color: DocStyles.colors.teal },
        { heading: 'Key & Secrets', content: 'Key Mgmt: ' + (data.keyMgmt || 'N/A') + '\nSecrets: ' + (data.secretsMgmt || 'N/A'), color: DocStyles.colors.navy },
        { heading: 'Compliance', content: data.compliance || 'Not specified', color: DocStyles.colors.crimson },
        { heading: 'Threat Model', content: data.threatModel || 'Not specified', color: DocStyles.colors.blue },
        { heading: 'Zero Trust', content: data.zeroTrust || 'Not specified', color: DocStyles.colors.teal }
      ]
    });
  },


  // ============================================================
  // 15. SYSTEM DESIGN INTERVIEW WORKSHEET
  // ============================================================

  generateInterviewWorksheetWord: async function(filename, data) {
    var sections = [
      { heading: 'System Design Interview Worksheet', content: [
        'Problem: ' + (data.problem || 'N/A'),
        'Candidate: ' + (data.candidate || 'N/A'),
        'Target Level: ' + (data.targetLevel || 'N/A'),
        'Date: ' + new Date().toLocaleDateString()
      ]},
      { heading: '1. Functional Requirements (Clarified)', content: (data.functionalReqs || 'Not specified').split('\n') },
      { heading: '2. Non-Functional Requirements', content: (data.nonFunctionalReqs || 'Not specified').split('\n') },
      { heading: '3. Capacity Estimates', content: (data.capacityEstimates || 'Not specified').split('\n') },
      { heading: '4. High-Level Components', content: (data.hlComponents || 'Not specified').split('\n') },
      { heading: '5. API Design', content: (data.apiDesign || 'Not specified').split('\n') },
      { heading: '6. Database Schema', content: (data.dbSchema || 'Not specified').split('\n') },
      { heading: '7. Key Trade-offs', content: (data.tradeoffs || 'Not specified').split('\n') },
      { heading: '8. Deep Dive Topics', content: (data.deepDive || 'Not specified').split('\n') },
      { heading: '9. Bottlenecks & Solutions', content: (data.bottlenecks || 'Not specified').split('\n') }
    ];
    return this.generateWord(filename, { title: 'Interview Worksheet – ' + (data.problem || ''), author: data.authorName || '', sections: sections });
  },

  generateInterviewWorksheetExcel: function(filename, data) {
    var wb = XLSX.utils.book_new();
    // Overview
    var overview = [
      ['SYSTEM DESIGN INTERVIEW WORKSHEET'],
      ['Problem / Design Question', data.problem || ''],
      ['Candidate', data.candidate || ''],
      ['Target Level', data.targetLevel || ''],
      ['Date', new Date().toLocaleDateString()]
    ];
    var ws1 = XLSX.utils.aoa_to_sheet(overview);
    ws1['!cols'] = [{ wch: 28 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    // Requirements
    var reqs = [
      ['REQUIREMENTS'],
      [],
      ['FUNCTIONAL REQUIREMENTS'],
      [data.functionalReqs || ''],
      [],
      ['NON-FUNCTIONAL REQUIREMENTS'],
      [data.nonFunctionalReqs || ''],
      [],
      ['CAPACITY ESTIMATES'],
      [data.capacityEstimates || '']
    ];
    var ws2 = XLSX.utils.aoa_to_sheet(reqs);
    ws2['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Requirements');
    // Design
    var design = [
      ['DESIGN'],
      [],
      ['HIGH-LEVEL COMPONENTS'],
      [data.hlComponents || ''],
      [],
      ['API DESIGN'],
      [data.apiDesign || ''],
      [],
      ['DATABASE SCHEMA'],
      [data.dbSchema || '']
    ];
    var ws3 = XLSX.utils.aoa_to_sheet(design);
    ws3['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Design');
    // Trade-offs
    var tradeoff = [
      ['ANALYSIS'],
      [],
      ['KEY TRADE-OFFS'],
      [data.tradeoffs || ''],
      [],
      ['DEEP DIVE TOPICS'],
      [data.deepDive || ''],
      [],
      ['BOTTLENECKS & SOLUTIONS'],
      [data.bottlenecks || '']
    ];
    var ws4 = XLSX.utils.aoa_to_sheet(tradeoff);
    ws4['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, ws4, 'Analysis');
    XLSX.writeFile(wb, filename + '.xlsx');
  },

  generateInterviewWorksheetPDF: function(filename, data) {
    var lines = [
      { text: 'SYSTEM DESIGN INTERVIEW WORKSHEET', size: 18, bold: true },
      { text: 'Problem: ' + (data.problem || ''), size: 13 },
      { text: 'Candidate: ' + (data.candidate || '') + '  |  Level: ' + (data.targetLevel || 'N/A'), size: 10 },
      { text: 'Date: ' + new Date().toLocaleDateString(), size: 9 },
      { text: ' ', size: 6 },
      { text: '── FUNCTIONAL REQUIREMENTS ──', size: 14, bold: true },
      { text: data.functionalReqs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── NON-FUNCTIONAL REQUIREMENTS ──', size: 14, bold: true },
      { text: data.nonFunctionalReqs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── CAPACITY ESTIMATES ──', size: 14, bold: true },
      { text: data.capacityEstimates || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── HIGH-LEVEL COMPONENTS ──', size: 14, bold: true },
      { text: data.hlComponents || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── API DESIGN ──', size: 14, bold: true },
      { text: data.apiDesign || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DATABASE SCHEMA ──', size: 14, bold: true },
      { text: data.dbSchema || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── KEY TRADE-OFFS ──', size: 14, bold: true },
      { text: data.tradeoffs || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── DEEP DIVE TOPICS ──', size: 14, bold: true },
      { text: data.deepDive || 'Not specified', size: 10 },
      { text: ' ', size: 6 },
      { text: '── BOTTLENECKS & SOLUTIONS ──', size: 14, bold: true },
      { text: data.bottlenecks || 'Not specified', size: 10 }
    ];
    return this.generatePDF(filename, { title: 'System Design Interview Worksheet', lines: lines });
  }

});
