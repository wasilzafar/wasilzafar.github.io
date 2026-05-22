// ============================================================
// AWS Solutions Architect Professional — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['sa-pro'] = {
    examName: 'AWS Solutions Architect Professional (SAP-C02)',
    version: '2026',
    sections: [
        {
            id: 'aws-complexity',
            name: 'Design for Organizational Complexity',
            type: 'compulsory',
            topics: [
                { id: 'org-multi-account', title: 'Multi-Account Strategies (AWS Organizations, SCPs, Control Tower)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['organization'] },
                { id: 'org-networking', title: 'Cross-Account & Hybrid Networking (Transit Gateway, Direct Connect, VPN)', difficulty: 5, estimatedHours: 22, weight: 1.3, tags: ['networking'] },
                { id: 'org-identity', title: 'Identity Federation & IAM Advanced (SSO, STS, Resource Policies)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['security'] }
            ]
        },
        {
            id: 'aws-new-solutions',
            name: 'Design for New Solutions',
            type: 'compulsory',
            topics: [
                { id: 'new-compute', title: 'Compute (EC2 Advanced, ECS/EKS, Lambda, Batch, Outposts)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['compute'] },
                { id: 'new-storage', title: 'Storage (S3 Advanced, EFS, FSx, Storage Gateway, DataSync)', difficulty: 3, estimatedHours: 14, tags: ['storage'] },
                { id: 'new-databases', title: 'Databases (Aurora Global, DynamoDB Global Tables, ElastiCache, Neptune)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['databases'] },
                { id: 'new-serverless', title: 'Serverless Architectures (Step Functions, EventBridge, AppSync)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['serverless'] },
                { id: 'new-analytics', title: 'Analytics & ML (Kinesis, Redshift, Athena, SageMaker, OpenSearch)', difficulty: 3, estimatedHours: 14, tags: ['analytics'] }
            ]
        },
        {
            id: 'aws-migration',
            name: 'Migration Planning',
            type: 'compulsory',
            topics: [
                { id: 'mig-strategies', title: 'Migration Strategies (6 Rs, MAP, Cloud Adoption Framework)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['migration'] },
                { id: 'mig-tools', title: 'Migration Tools (MGN, DMS, SMS, Transfer Family, Snow Family)', difficulty: 3, estimatedHours: 14, tags: ['migration'] },
                { id: 'mig-cutover', title: 'Cutover Planning & Hybrid Architectures', difficulty: 4, estimatedHours: 12, tags: ['migration'] }
            ]
        },
        {
            id: 'aws-cost',
            name: 'Cost Control',
            type: 'compulsory',
            topics: [
                { id: 'cost-optimization', title: 'Cost Optimization (Reserved, Savings Plans, Spot, Right-Sizing)', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['cost'] },
                { id: 'cost-monitoring', title: 'Cost Monitoring (Cost Explorer, Budgets, CUR, Trusted Advisor)', difficulty: 2, estimatedHours: 8, tags: ['cost'] }
            ]
        },
        {
            id: 'aws-continuity',
            name: 'Continuous Improvement & Reliability',
            type: 'compulsory',
            topics: [
                { id: 'rel-ha', title: 'High Availability & Fault Tolerance (Multi-AZ, Multi-Region)', difficulty: 4, estimatedHours: 18, weight: 1.3, tags: ['reliability'] },
                { id: 'rel-dr', title: 'Disaster Recovery (Pilot Light, Warm Standby, Active-Active)', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['reliability'] },
                { id: 'rel-observability', title: 'Observability (CloudWatch, X-Ray, CloudTrail, Config)', difficulty: 3, estimatedHours: 12, tags: ['observability'] },
                { id: 'rel-cicd', title: 'CI/CD & Deployment Strategies (Blue-Green, Canary, Rolling)', difficulty: 3, estimatedHours: 14, tags: ['devops'] },
                { id: 'rel-security', title: 'Security (KMS, Secrets Manager, WAF, Shield, GuardDuty, Macie)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['security'] }
            ]
        }
    ]
};
