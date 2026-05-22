// ============================================================
// AZ-305 (Azure Solutions Architect Expert) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['az-305'] = {
    examName: 'AZ-305: Azure Solutions Architect Expert',
    version: '2026',
    sections: [
        {
            id: 'az-governance',
            name: 'Design Identity, Governance & Monitoring',
            type: 'compulsory',
            topics: [
                { id: 'gov-identity', title: 'Identity (Entra ID, Conditional Access, PIM, B2B/B2C)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['identity'] },
                { id: 'gov-governance', title: 'Governance (Management Groups, Policy, Blueprints, RBAC)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['governance'] },
                { id: 'gov-monitoring', title: 'Monitoring (Azure Monitor, Log Analytics, Alerts, App Insights)', difficulty: 3, estimatedHours: 12, tags: ['monitoring'] }
            ]
        },
        {
            id: 'az-storage',
            name: 'Design Data Storage Solutions',
            type: 'compulsory',
            topics: [
                { id: 'stor-relational', title: 'Relational Databases (Azure SQL, Managed Instance, PostgreSQL)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['data'] },
                { id: 'stor-nonrelational', title: 'Non-Relational (Cosmos DB, Table, Blob, Data Lake)', difficulty: 4, estimatedHours: 18, weight: 1.3, tags: ['data'] },
                { id: 'stor-integration', title: 'Data Integration (Data Factory, Synapse, Event Hubs, Stream Analytics)', difficulty: 3, estimatedHours: 14, tags: ['data'] }
            ]
        },
        {
            id: 'az-business-continuity',
            name: 'Design Business Continuity',
            type: 'compulsory',
            topics: [
                { id: 'bc-ha', title: 'High Availability (Availability Zones, Scale Sets, Load Balancer)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['reliability'] },
                { id: 'bc-backup', title: 'Backup & Recovery (Azure Backup, Site Recovery, Geo-Replication)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['reliability'] }
            ]
        },
        {
            id: 'az-infrastructure',
            name: 'Design Infrastructure Solutions',
            type: 'compulsory',
            topics: [
                { id: 'infra-compute', title: 'Compute (VMs, App Service, Functions, AKS, Container Apps)', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['compute'] },
                { id: 'infra-networking', title: 'Networking (VNet, Peering, VPN, ExpressRoute, Front Door, Private Link)', difficulty: 4, estimatedHours: 22, weight: 1.3, tags: ['networking'] },
                { id: 'infra-app-arch', title: 'Application Architecture (Microservices, Event-Driven, Messaging)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['architecture'] },
                { id: 'infra-migration', title: 'Migration (Azure Migrate, Database Migration Service)', difficulty: 3, estimatedHours: 12, tags: ['migration'] }
            ]
        },
        {
            id: 'az-security',
            name: 'Design Security Solutions',
            type: 'compulsory',
            topics: [
                { id: 'sec-keyvault', title: 'Secrets & Keys (Key Vault, Managed Identity, Encryption)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['security'] },
                { id: 'sec-network', title: 'Network Security (NSG, Firewall, DDoS, WAF, Bastion)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['security'] },
                { id: 'sec-defender', title: 'Security Posture (Defender for Cloud, Sentinel, Compliance)', difficulty: 3, estimatedHours: 12, tags: ['security'] }
            ]
        }
    ]
};
