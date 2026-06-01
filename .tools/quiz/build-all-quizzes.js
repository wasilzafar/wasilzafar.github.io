/**
 * Batch Quiz Generator — produces quiz.json for multiple series.
 * Run: node .tools/build-all-quizzes.js
 */
const fs = require('fs');
const path = require('path');

function encode(answer, salt) {
    const json = JSON.stringify(answer);
    let shifted = '';
    for (let i = 0; i < json.length; i++) {
        shifted += String.fromCharCode(json.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
    }
    return Buffer.from(shifted, 'binary').toString('base64');
}

function buildQuiz(config) {
    const { series, title, salt, totalParts, questions } = config;
    return {
        series,
        title,
        version: 1,
        totalParts,
        security: { method: "xor-b64", salt },
        questions: questions.map(q => {
            q.answer = encode(q._answer, salt);
            delete q._answer;
            return q;
        })
    };
}

function writeQuiz(quiz) {
    const outDir = path.join(__dirname, '..', 'pages', 'series', quiz.series);
    if (!fs.existsSync(outDir)) { console.warn('  ⚠ Directory missing:', outDir); return false; }
    fs.writeFileSync(path.join(outDir, 'quiz.json'), JSON.stringify(quiz, null, 2));
    return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM DESIGN
// ═══════════════════════════════════════════════════════════════════════════════
const systemDesign = buildQuiz({
    series: "system-design",
    title: "System Design",
    salt: "sys-design-2026",
    totalParts: 16,
    questions: [
        {
            id: "sd-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What is the primary goal of horizontal scaling?",
            options: ["Adding more RAM to a single server", "Adding more servers to distribute load", "Upgrading the CPU", "Using faster storage"],
            _answer: 1,
            explanation: "Horizontal scaling (scaling out) adds more machines to handle increased load, distributing requests across multiple servers.",
            articleSlug: "system-design-introduction", tags: ["scaling", "fundamentals"]
        },
        {
            id: "sd-q002", part: 2, difficulty: "beginner", type: "true-false",
            question: "A load balancer can only use round-robin as its routing algorithm.",
            _answer: false,
            explanation: "Load balancers support many algorithms: round-robin, weighted round-robin, least connections, IP hash, consistent hashing, and more.",
            articleSlug: "system-design-load-balancing", tags: ["load balancer"]
        },
        {
            id: "sd-q003", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "The CAP theorem states that a distributed system cannot simultaneously guarantee Consistency, Availability, and ___.",
            _answer: "Partition Tolerance",
            acceptAlso: ["partition tolerance", "P", "network partition tolerance"],
            explanation: "CAP theorem (Brewer's theorem): in the presence of a network partition, you must choose between Consistency and Availability.",
            articleSlug: "system-design-cap-theorem", tags: ["CAP", "distributed systems"]
        },
        {
            id: "sd-q004", part: 4, difficulty: "intermediate", type: "mcq",
            question: "Which caching strategy writes data to cache AND database simultaneously?",
            options: ["Cache-aside (Lazy loading)", "Write-through", "Write-behind (Write-back)", "Read-through"],
            _answer: 1,
            explanation: "Write-through writes to both cache and database on every write. It guarantees consistency but adds latency. Write-behind batches DB writes for better performance.",
            articleSlug: "system-design-caching", tags: ["caching", "strategies"]
        },
        {
            id: "sd-q005", part: 5, difficulty: "advanced", type: "calculation",
            question: "A system handles 10,000 requests/second with 99th percentile latency of 200ms. If you add a cache with 85% hit rate and 5ms response time, what's the new average latency?",
            formula: "avg = (hit_rate × cache_latency) + ((1 - hit_rate) × origin_latency)",
            _answer: 34,
            unit: "ms",
            tolerance: 2,
            explanation: "avg = (0.85 × 5ms) + (0.15 × 200ms) = 4.25 + 30 = 34.25ms ≈ 34ms. The cache dramatically reduces average latency.",
            articleSlug: "system-design-caching", tags: ["caching", "performance", "math"]
        },
        {
            id: "sd-q006", part: 6, difficulty: "intermediate", type: "ordering",
            question: "Arrange the steps of consistent hashing when adding a new node:",
            items: ["Hash the new node to find its position on the ring", "Identify the successor node", "Transfer keys from successor that now map to the new node", "Update routing tables", "New node begins serving requests"],
            _answer: ["Hash the new node to find its position on the ring", "Identify the successor node", "Transfer keys from successor that now map to the new node", "Update routing tables", "New node begins serving requests"],
            explanation: "Consistent hashing minimizes key redistribution. Only keys between the new node and its predecessor need to move — approximately 1/N of total keys.",
            articleSlug: "system-design-consistent-hashing", tags: ["consistent hashing", "distributed"]
        },
        {
            id: "sd-q007", part: 7, difficulty: "advanced", type: "scenario",
            question: "Your e-commerce platform sees 50× traffic spikes during flash sales. The database becomes the bottleneck. What's your first architectural change?",
            scenario: {
                context: "Monolithic app with PostgreSQL. Reads are 90% of traffic. Average flash sale lasts 2 hours.",
                metrics: { "Normal RPS": "500", "Flash sale RPS": "25,000", "DB connections": "100 max", "Read:Write ratio": "9:1" },
                constraints: ["Budget for 2 additional servers", "Must maintain ACID for orders", "30 min implementation window before next sale"]
            },
            options: [
                "Add read replicas — route 90% read traffic to replicas",
                "Shard the database by user ID",
                "Switch to NoSQL (MongoDB) for all data",
                "Add application-level caching (Redis) for product data"
            ],
            _answer: 3,
            explanation: "Redis caching is the fastest win: product data (read-heavy, rarely changes during sale) can be cached with minutes to implement. Read replicas are the next step but take longer to set up. Sharding is overkill for this scenario.",
            articleSlug: "system-design-databases", tags: ["scaling", "caching", "database"]
        },
        {
            id: "sd-q008", part: 8, difficulty: "advanced", type: "architecture",
            question: "You're designing a chat application that needs to support 10M concurrent users with <100ms message delivery. Which architecture?",
            scenario: "Global chat platform. Users send text messages, images, and read receipts. Must support group chats of up to 500 members.",
            options: [
                { label: "WebSocket connections with pub/sub (Redis) backend", tradeoffs: ["Real-time delivery", "Connection state management", "Horizontal scaling via consistent hashing"] },
                { label: "Long polling with message queue (Kafka)", tradeoffs: ["Simpler infrastructure", "Higher latency (100-500ms)", "Stateless servers"] },
                { label: "Server-Sent Events with REST for sends", tradeoffs: ["Unidirectional real-time", "Simple client implementation", "Cannot push from client"] },
                { label: "gRPC bidirectional streaming", tradeoffs: ["Low latency", "Binary protocol efficiency", "Limited browser support"] }
            ],
            _answer: 0,
            explanation: "WebSockets + pub/sub is the industry standard (used by WhatsApp, Slack, Discord). WebSockets provide full-duplex communication; Redis pub/sub handles cross-server message routing.",
            articleSlug: "system-design-messaging", tags: ["WebSocket", "real-time", "pub/sub"]
        },
        {
            id: "sd-q009", part: 9, difficulty: "intermediate", type: "matching",
            question: "Match each database type to its ideal use case:",
            pairs: {
                left: ["PostgreSQL (Relational)", "MongoDB (Document)", "Redis (Key-Value)", "Neo4j (Graph)"],
                right: ["Financial transactions with complex joins", "Flexible schema content management", "Session storage and caching", "Social network friend recommendations"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "Each database type excels at different patterns: relational for ACID + joins, document for flexible schemas, key-value for speed + simplicity, graph for relationship traversal.",
            articleSlug: "system-design-database-types", tags: ["databases", "NoSQL"]
        },
        {
            id: "sd-q010", part: 10, difficulty: "advanced", type: "debug",
            question: "This rate limiter has a bug that allows burst traffic to bypass the limit. Find it:",
            code: "class RateLimiter:\n    def __init__(self, max_requests, window_sec):\n        self.max = max_requests\n        self.window = window_sec\n        self.requests = []\n\n    def allow(self):\n        now = time.time()\n        # Remove old requests\n        self.requests = [t for t in self.requests if t > now - self.window]\n        if len(self.requests) < self.max:\n            self.requests.append(now)\n            return True\n        return False",
            options: [
                "No thread safety — concurrent requests can all pass the length check simultaneously",
                "Using a list is O(n) — should use a deque for performance",
                "The time window should use >= instead of >",
                "Missing a return statement for the else branch"
            ],
            _answer: 0,
            explanation: "Without a lock/mutex, multiple threads can read len(self.requests) < self.max as True simultaneously before any append. A threading.Lock or atomic operation is needed for correctness under concurrency.",
            articleSlug: "system-design-rate-limiting", tags: ["rate limiting", "concurrency", "bug"]
        },
        {
            id: "sd-q011", part: 11, difficulty: "intermediate", type: "code-output",
            question: "Given a consistent hash ring with positions 0-359 and nodes at positions [30, 120, 240], which node handles a key that hashes to position 280?",
            code: "nodes = [30, 120, 240]\nkey_hash = 280\n# Walk clockwise from key_hash to find first node",
            _answer: "30",
            acceptAlso: ["Node at 30", "node 30"],
            explanation: "Walking clockwise from 280: next positions are 281...359, 0...30. The first node encountered is at position 30 (wrapping around). This is the fundamental consistent hashing lookup.",
            articleSlug: "system-design-consistent-hashing", tags: ["consistent hashing"]
        },
        {
            id: "sd-q012", part: 12, difficulty: "advanced", type: "diagnosis",
            question: "Your microservices system experiences cascading failures whenever the payment service goes down. Diagnose the architectural flaw:",
            presentation: {
                context: "Order service synchronously calls Payment service, which calls Bank API. All services have 30s default timeout.",
                findings: [
                    "Payment service: 30s timeout to Bank API",
                    "Order service: 30s timeout to Payment service",
                    "Thread pool: 200 threads, all consumed waiting on Payment",
                    "Health check: passes (service is running, just slow)",
                    "No circuit breaker configured"
                ]
            },
            options: [
                "Missing circuit breaker — Order service keeps sending requests to a failing Payment service",
                "Timeout too long — 30s holds threads hostage, exhausting the pool",
                "Synchronous coupling — should use async messaging for payment processing",
                "All of the above — multiple resilience patterns are missing"
            ],
            _answer: 3,
            explanation: "This is a textbook cascade failure: long timeouts + no circuit breaker + synchronous coupling. Fix with: circuit breaker (fail fast), shorter timeouts (5s), bulkhead pattern (isolate thread pools), and async processing where possible.",
            articleSlug: "system-design-resilience", tags: ["circuit breaker", "resilience", "microservices"]
        },
        {
            id: "sd-q013", part: 13, difficulty: "beginner", type: "true-false",
            question: "In a microservices architecture, each service should share a single database to ensure data consistency.",
            _answer: false,
            explanation: "Microservices best practice is 'database per service' — each service owns its data. Sharing a DB creates tight coupling, schema change conflicts, and scaling bottlenecks. Use events/APIs for cross-service data access.",
            articleSlug: "system-design-microservices", tags: ["microservices", "database"]
        },
        {
            id: "sd-q014", part: 14, difficulty: "advanced", type: "ethical",
            question: "Should system architects prioritize consistency over availability for social media 'like' counts?",
            scenario: "A social media platform has 500M daily active users. Displaying like counts with strict consistency requires cross-datacenter consensus (adding 100-200ms latency). Eventual consistency shows possibly stale counts but responds in <10ms.",
            options: [
                { label: "Strict consistency — users deserve accurate counts always", framework: "Deontological — accuracy is a moral duty" },
                { label: "Eventual consistency — likes aren't critical data; speed matters more", framework: "Pragmatic — optimize for user experience" },
                { label: "Configurable per user — let users choose their preference", framework: "Autonomy — respect individual choice" },
                { label: "Strict for the author, eventual for viewers", framework: "Hybrid — accuracy where it matters most" }
            ],
            _answer: 1,
            explanation: "Industry practice (Facebook, Twitter, YouTube) uses eventual consistency for counters. The UX cost of 200ms extra latency on every page load far outweighs showing a count that's off by a few for a few seconds.",
            articleSlug: "system-design-tradeoffs", tags: ["consistency", "availability", "tradeoffs"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUD COMPUTING
// ═══════════════════════════════════════════════════════════════════════════════
const cloudComputing = buildQuiz({
    series: "cloud-computing",
    title: "Cloud Computing",
    salt: "cloud-comp-2026",
    totalParts: 11,
    questions: [
        {
            id: "cc-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "Which cloud service model provides virtual machines, storage, and networking?",
            options: ["SaaS (Software as a Service)", "PaaS (Platform as a Service)", "IaaS (Infrastructure as a Service)", "FaaS (Function as a Service)"],
            _answer: 2,
            explanation: "IaaS provides the fundamental compute, storage, and networking infrastructure. You manage the OS and everything above it. Examples: AWS EC2, Azure VMs, GCP Compute Engine.",
            articleSlug: "cloud-computing-fundamentals-architecture", tags: ["IaaS", "service models"]
        },
        {
            id: "cc-q002", part: 1, difficulty: "beginner", type: "true-false",
            question: "In cloud computing, 'elasticity' and 'scalability' mean exactly the same thing.",
            _answer: false,
            explanation: "Scalability is the ability to handle increased load (manual or planned). Elasticity is automatic scaling in response to demand — scaling out when busy, scaling in when idle. Elasticity implies scalability, but not vice versa.",
            articleSlug: "cloud-computing-fundamentals-architecture", tags: ["elasticity", "scalability"]
        },
        {
            id: "cc-q003", part: 2, difficulty: "intermediate", type: "matching",
            question: "Match each AWS service to its Azure equivalent:",
            pairs: {
                left: ["AWS Lambda", "Amazon S3", "Amazon RDS", "AWS CloudFormation"],
                right: ["Azure Functions", "Azure Blob Storage", "Azure SQL Database", "Azure Resource Manager (Bicep)"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "These are functional equivalents: Lambda↔Functions (serverless compute), S3↔Blob (object storage), RDS↔Azure SQL (managed relational DB), CloudFormation↔ARM/Bicep (IaC).",
            articleSlug: "cloud-computing-providers-comparison", tags: ["AWS", "Azure", "comparison"]
        },
        {
            id: "cc-q004", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "A cloud region typically contains multiple isolated ___ for high availability.",
            _answer: "availability zones",
            acceptAlso: ["AZs", "availability zone", "zones", "data centers"],
            explanation: "Availability Zones (AZs) are physically separate data centers within a region, connected by low-latency links. Distributing across AZs protects against single-facility failures.",
            articleSlug: "cloud-computing-regions-availability", tags: ["availability zones", "HA"]
        },
        {
            id: "cc-q005", part: 4, difficulty: "advanced", type: "scenario",
            question: "Your startup's AWS bill jumped from $3K to $18K/month after launching a new feature. The feature uses Lambda + DynamoDB. What's your first investigation?",
            scenario: {
                context: "New feature: real-time analytics dashboard that queries DynamoDB on every page refresh (polling every 5 seconds per user).",
                metrics: { "Active users": "2,000", "Lambda invocations": "24M/month", "DynamoDB reads": "720M/month", "Average Lambda duration": "200ms" },
                constraints: ["Cannot remove the feature", "Users expect real-time data", "Budget cap is $5K/month"]
            },
            options: [
                "Switch to provisioned DynamoDB capacity with auto-scaling",
                "Add DynamoDB Accelerator (DAX) cache + reduce polling to 30-second intervals",
                "Replace Lambda with an always-running ECS container",
                "Move to a self-managed database on EC2"
            ],
            _answer: 1,
            explanation: "DAX cache eliminates most DynamoDB reads (microsecond response). Reducing poll interval from 5s to 30s cuts invocations by 6×. Combined savings: ~80% reduction. Provisioned capacity alone won't help if the read volume is the issue.",
            articleSlug: "cloud-computing-cost-optimization", tags: ["cost", "DynamoDB", "Lambda"]
        },
        {
            id: "cc-q006", part: 5, difficulty: "intermediate", type: "mcq",
            question: "What is the maximum duration a single AWS Lambda function invocation can run?",
            options: ["5 minutes", "15 minutes", "30 minutes", "60 minutes"],
            _answer: 1,
            explanation: "AWS Lambda has a maximum timeout of 15 minutes (900 seconds). For longer-running tasks, use Step Functions, ECS/Fargate, or EC2.",
            articleSlug: "cloud-computing-serverless", tags: ["Lambda", "serverless", "limits"]
        },
        {
            id: "cc-q007", part: 6, difficulty: "advanced", type: "calculation",
            question: "An S3 bucket serves 1 TB of data monthly with 10 million GET requests. At $0.023/GB storage + $0.0004/1000 GETs + $0.09/GB transfer, what's the monthly cost?",
            formula: "Total = Storage + Requests + Transfer = (1024 × $0.023) + (10,000 × $0.0004) + (1024 × $0.09)",
            _answer: 119,
            unit: "$",
            tolerance: 5,
            explanation: "Storage: 1024GB × $0.023 = $23.55. Requests: 10,000,000/1000 × $0.0004 = $4.00. Transfer: 1024GB × $0.09 = $92.16. Total ≈ $119.71.",
            articleSlug: "cloud-computing-storage", tags: ["S3", "cost", "storage"]
        },
        {
            id: "cc-q008", part: 7, difficulty: "advanced", type: "architecture",
            question: "You're designing a disaster recovery strategy for a critical banking application. Which approach gives RTO < 1 minute?",
            scenario: "Core banking platform processing $2B daily. Current single-region deployment. Regulatory requirement: < 1 minute recovery.",
            options: [
                { label: "Backup & Restore — periodic backups to another region", tradeoffs: ["Cheapest", "RTO: hours", "Data loss: up to backup interval"] },
                { label: "Pilot Light — minimal standby in DR region", tradeoffs: ["Low cost", "RTO: 10-30 minutes", "Need to scale up on failover"] },
                { label: "Warm Standby — scaled-down copy running in DR region", tradeoffs: ["Moderate cost", "RTO: 5-10 minutes", "Some data lag"] },
                { label: "Multi-site Active/Active — full deployment in both regions", tradeoffs: ["Most expensive", "RTO: seconds", "Zero data loss possible", "Complex consistency"] }
            ],
            _answer: 3,
            explanation: "Only Active/Active meets < 1 minute RTO. Traffic routes to both regions; if one fails, the other absorbs load instantly. For $2B/day banking, the cost is justified.",
            articleSlug: "cloud-computing-disaster-recovery", tags: ["DR", "RTO", "active-active"]
        },
        {
            id: "cc-q009", part: 8, difficulty: "intermediate", type: "ordering",
            question: "Arrange the cloud migration strategies (6 Rs) from least to most cloud-native:",
            items: ["Rehost (Lift & Shift)", "Replatform (Lift & Reshape)", "Refactor (Re-architect)", "Retain (Keep on-premises)", "Retire (Decommission)"],
            _answer: ["Retain (Keep on-premises)", "Retire (Decommission)", "Rehost (Lift & Shift)", "Replatform (Lift & Reshape)", "Refactor (Re-architect)"],
            explanation: "Retain = no cloud. Retire = remove. Rehost = move as-is. Replatform = minor modifications. Refactor = fully cloud-native redesign. Each step increases cloud benefit but also effort.",
            articleSlug: "cloud-computing-migration", tags: ["migration", "6Rs"]
        },
        {
            id: "cc-q010", part: 9, difficulty: "intermediate", type: "code-output",
            question: "What does this Terraform resource create?",
            code: "resource \"aws_instance\" \"web\" {\n  ami           = \"ami-0c55b159cbfafe1f0\"\n  instance_type = \"t3.micro\"\n  count         = 3\n  tags = { Name = \"web-${count.index}\" }\n}",
            _answer: "3",
            acceptAlso: ["three", "3 EC2 instances", "3 instances"],
            explanation: "The count = 3 parameter creates 3 identical EC2 instances named web-0, web-1, web-2. Each is a t3.micro instance using the specified AMI.",
            articleSlug: "cloud-computing-iac", tags: ["Terraform", "IaC", "EC2"]
        },
        {
            id: "cc-q011", part: 10, difficulty: "advanced", type: "debug",
            question: "This CloudFormation template fails to create the RDS instance. Find the issue:",
            code: "Resources:\n  MyDB:\n    Type: AWS::RDS::DBInstance\n    Properties:\n      DBInstanceClass: db.t3.micro\n      Engine: mysql\n      MasterUsername: admin\n      MasterUserPassword: !Ref DBPassword\n      DBSubnetGroupName: !Ref SubnetGroup\n      VPCSecurityGroups:\n        - !Ref DBSecurityGroup\n  SubnetGroup:\n    Type: AWS::RDS::DBSubnetGroup\n    Properties:\n      SubnetIds:\n        - !Ref PrivateSubnet1",
            options: [
                "DBSubnetGroup requires at least 2 subnets in different AZs",
                "MasterUserPassword should use !GetAtt instead of !Ref",
                "Missing AllocatedStorage property (required for MySQL)",
                "VPCSecurityGroups should be a string, not a list"
            ],
            _answer: 2,
            explanation: "AllocatedStorage is a required property for RDS MySQL instances. Without it, CloudFormation fails validation. The SubnetGroup with 1 subnet would also fail (needs 2 AZs), but AllocatedStorage is the first validation error.",
            articleSlug: "cloud-computing-iac", tags: ["CloudFormation", "RDS", "debugging"]
        },
        {
            id: "cc-q012", part: 11, difficulty: "beginner", type: "mcq",
            question: "Which cloud pricing model offers the largest discount for predictable workloads?",
            options: ["On-Demand (pay-as-you-go)", "Reserved Instances (1-3 year commitment)", "Spot Instances (unused capacity)", "Savings Plans"],
            _answer: 2,
            explanation: "Spot instances offer up to 90% discount over On-Demand pricing. However, they can be interrupted with 2-minute notice. Reserved Instances offer up to 72% discount with guaranteed availability.",
            articleSlug: "cloud-computing-pricing", tags: ["pricing", "cost"]
        },
        {
            id: "cc-q013", part: 11, difficulty: "advanced", type: "diagnosis",
            question: "Your cloud application's latency spikes to 5s every day at 2 AM UTC. Diagnose the cause:",
            presentation: {
                context: "Node.js API on AWS ECS Fargate, backed by Aurora PostgreSQL. Auto-scaling configured. No deployments at that time.",
                findings: [
                    "CloudWatch: CPU spike to 95% at 2:00 AM UTC lasting 3 minutes",
                    "RDS metrics: Read IOPS spike 10× normal",
                    "Application logs: no errors, just slow responses",
                    "Aurora: automated backup window set to 2:00-2:30 AM UTC",
                    "No cron jobs or scheduled tasks in application"
                ]
            },
            options: [
                "Aurora automated backup causes I/O contention during snapshot",
                "ECS task recycling — Fargate replaces tasks on a schedule",
                "SSL certificate renewal check causing DNS delays",
                "CloudWatch log rotation consuming resources"
            ],
            _answer: 0,
            explanation: "Aurora backups create storage-level snapshots that can cause brief I/O spikes. The 2 AM timing matches the backup window exactly. Fix: move backup window to lowest-traffic period or use Aurora cloning for zero-impact backups.",
            articleSlug: "cloud-computing-monitoring", tags: ["Aurora", "backup", "diagnosis"]
        },
        {
            id: "cc-q014", part: 5, difficulty: "intermediate", type: "ethical",
            question: "Should cloud providers lock customers into proprietary services that have no equivalent elsewhere?",
            scenario: "AWS offers DynamoDB (no direct equivalent), Azure offers Cosmos DB (multi-model, no exact match), GCP offers Spanner (globally distributed, unique). Using these creates vendor lock-in but provides superior capabilities.",
            options: [
                { label: "Always use portable open-source alternatives (PostgreSQL, Redis)", framework: "Risk aversion — maximize portability" },
                { label: "Use proprietary services when the technical advantage justifies lock-in", framework: "Pragmatic — best tool for the job" },
                { label: "Cloud providers should be required to support standard APIs", framework: "Regulatory — enforce interoperability" },
                { label: "Abstract behind interfaces — use proprietary now, swap later if needed", framework: "Engineering — decouple via abstraction" }
            ],
            _answer: 3,
            explanation: "The hexagonal architecture approach: use cloud-native services for their advantages but abstract behind domain interfaces. If you need to migrate later, only the adapter layer changes.",
            articleSlug: "cloud-computing-serverless", tags: ["vendor lock-in", "architecture"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// DATA STRUCTURES & ALGORITHMS
// ═══════════════════════════════════════════════════════════════════════════════
const dataStructures = buildQuiz({
    series: "data-structures",
    title: "Data Structures & Algorithms",
    salt: "dsa-algo-2026",
    totalParts: 12,
    questions: [
        {
            id: "ds-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What is the time complexity of accessing an element by index in an array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            _answer: 0,
            explanation: "Arrays provide O(1) random access because elements are stored in contiguous memory. The address is calculated as: base + (index × element_size).",
            articleSlug: "data-structures-arrays-strings", tags: ["arrays", "time complexity"]
        },
        {
            id: "ds-q002", part: 1, difficulty: "beginner", type: "true-false",
            question: "A linked list provides O(1) access to any element by index.",
            _answer: false,
            explanation: "Linked lists require O(n) traversal to reach an arbitrary element since nodes aren't contiguous in memory. Only head (and tail in doubly-linked) access is O(1).",
            articleSlug: "data-structures-linked-lists", tags: ["linked list", "complexity"]
        },
        {
            id: "ds-q003", part: 2, difficulty: "intermediate", type: "code-output",
            question: "What does this function return for input [3, 1, 4, 1, 5, 9]?",
            code: "def mystery(arr):\n    stack = []\n    for x in arr:\n        while stack and stack[-1] < x:\n            stack.pop()\n        stack.append(x)\n    return stack",
            _answer: "[9]",
            acceptAlso: ["[9]", "9"],
            explanation: "This builds a monotonic decreasing stack. Each element pops all smaller elements before it. After processing all elements: 3→[3], 1→[3,1], 4 pops 1,3→[4], 1→[4,1], 5 pops 1,4→[5], 9 pops 5→[9].",
            articleSlug: "data-structures-stacks-queues", tags: ["stack", "monotonic"]
        },
        {
            id: "ds-q004", part: 3, difficulty: "intermediate", type: "matching",
            question: "Match each data structure to its best use case:",
            pairs: {
                left: ["Hash Map", "Min-Heap", "Trie", "Disjoint Set (Union-Find)"],
                right: ["O(1) key-value lookups", "Priority queue / top-K problems", "Autocomplete / prefix matching", "Connected components / cycle detection"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "Each structure excels at specific operations: HashMap for O(1) lookup, Heap for min/max extraction, Trie for prefix operations, Union-Find for connectivity queries.",
            articleSlug: "data-structures-trees-heaps", tags: ["data structures", "use cases"]
        },
        {
            id: "ds-q005", part: 4, difficulty: "intermediate", type: "fill-blank",
            question: "A balanced BST guarantees ___ time complexity for search, insert, and delete operations.",
            _answer: "O(log n)",
            acceptAlso: ["log n", "O(logn)", "logarithmic"],
            explanation: "Balanced BSTs (AVL, Red-Black) maintain height ≈ log₂(n), ensuring all operations traverse at most log(n) levels. Unbalanced BSTs can degrade to O(n) in the worst case.",
            articleSlug: "data-structures-binary-search-trees", tags: ["BST", "complexity"]
        },
        {
            id: "ds-q006", part: 5, difficulty: "advanced", type: "ordering",
            question: "Sort these algorithms by average-case time complexity (fastest to slowest):",
            items: ["Merge Sort — O(n log n)", "Bubble Sort — O(n²)", "Binary Search — O(log n)", "Hash Table Lookup — O(1)", "Linear Search — O(n)"],
            _answer: ["Hash Table Lookup — O(1)", "Binary Search — O(log n)", "Linear Search — O(n)", "Merge Sort — O(n log n)", "Bubble Sort — O(n²)"],
            explanation: "O(1) < O(log n) < O(n) < O(n log n) < O(n²). Note that these compare different operation types — search vs sort — but the complexity ordering holds.",
            articleSlug: "data-structures-sorting", tags: ["complexity", "sorting", "comparison"]
        },
        {
            id: "ds-q007", part: 6, difficulty: "advanced", type: "debug",
            question: "This binary search implementation has a subtle bug. Find it:",
            code: "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
            options: [
                "Integer overflow: (left + right) can overflow for large arrays",
                "Off-by-one: should be while left < right (not <=)",
                "Missing check: arr might not be sorted",
                "The logic is actually correct — no bug exists"
            ],
            _answer: 0,
            explanation: "In languages with fixed-size integers (Java, C), (left + right) can overflow when both are large. Fix: mid = left + (right - left) // 2. In Python this isn't an issue due to arbitrary-precision integers, but it's a classic bug in other languages.",
            articleSlug: "data-structures-binary-search", tags: ["binary search", "overflow", "bug"]
        },
        {
            id: "ds-q008", part: 7, difficulty: "advanced", type: "scenario",
            question: "You need to find the K closest points to origin from 10 million points. Memory is limited to holding 1000 points. What approach?",
            scenario: {
                context: "Geographic data processing. K=1000. Points stream from a file that can't fit in memory.",
                constraints: ["Only 1000 points can be in memory at once", "Must process in a single pass", "K = 1000"]
            },
            options: [
                "Sort all points by distance (requires loading all into memory)",
                "Max-heap of size K — maintain K closest seen so far",
                "QuickSelect algorithm for O(n) average selection",
                "Binary search on distance threshold"
            ],
            _answer: 1,
            explanation: "A max-heap of size K keeps the K smallest distances. For each new point: if distance < heap max, pop max and insert new point. O(n log K) time, O(K) space — perfect for streaming with limited memory.",
            articleSlug: "data-structures-heaps", tags: ["heap", "streaming", "top-K"]
        },
        {
            id: "ds-q009", part: 8, difficulty: "intermediate", type: "mcq",
            question: "What is the worst-case time complexity of quicksort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
            _answer: 2,
            explanation: "Quicksort degrades to O(n²) when the pivot is always the smallest or largest element (already sorted input with naive pivot selection). Randomized pivot selection makes this extremely unlikely in practice.",
            articleSlug: "data-structures-sorting", tags: ["quicksort", "complexity"]
        },
        {
            id: "ds-q010", part: 9, difficulty: "advanced", type: "calculation",
            question: "A hash table has 1000 slots and 750 entries. Using the birthday paradox approximation, what's the expected number of collisions?",
            formula: "Expected collisions ≈ n - m × (1 - (1 - 1/m)^n) where n=entries, m=slots",
            _answer: 236,
            unit: "collisions",
            tolerance: 15,
            explanation: "With load factor 0.75: expected occupied slots ≈ 1000 × (1 - (1-1/1000)^750) ≈ 1000 × 0.528 ≈ 528. Collisions = 750 - 528 ≈ 222-240. The exact formula gives ~236.",
            articleSlug: "data-structures-hash-tables", tags: ["hash table", "collisions", "probability"]
        },
        {
            id: "ds-q011", part: 10, difficulty: "advanced", type: "architecture",
            question: "You're building a real-time leaderboard for 50M users that updates every second. Which data structure?",
            scenario: "Mobile game leaderboard. Need: top-100 query in <10ms, rank lookup for any user in <10ms, score updates at 100K/second.",
            options: [
                { label: "Sorted Array with binary search", tradeoffs: ["O(log n) lookup", "O(n) insert/update", "Simple implementation"] },
                { label: "Redis Sorted Set (Skip List)", tradeoffs: ["O(log n) all operations", "Built-in ZRANK/ZRANGE", "In-memory, single-threaded"] },
                { label: "B-Tree in PostgreSQL with index", tradeoffs: ["ACID guarantees", "O(log n) operations", "Disk I/O latency"] },
                { label: "Segment Tree with lazy propagation", tradeoffs: ["O(log n) range queries", "Complex implementation", "Good for range aggregations"] }
            ],
            _answer: 1,
            explanation: "Redis Sorted Sets are the industry standard for real-time leaderboards. ZADD for O(log n) updates, ZRANK for rank lookup, ZRANGE for top-K — all in-memory with <1ms latency at 50M entries.",
            articleSlug: "data-structures-advanced", tags: ["Redis", "skip list", "leaderboard"]
        },
        {
            id: "ds-q012", part: 11, difficulty: "intermediate", type: "true-false",
            question: "Breadth-First Search (BFS) always finds the shortest path in an unweighted graph.",
            _answer: true,
            explanation: "BFS explores all nodes at distance d before any at distance d+1. In unweighted graphs (all edges cost 1), the first time BFS reaches a node is guaranteed to be via the shortest path.",
            articleSlug: "data-structures-graphs", tags: ["BFS", "shortest path", "graphs"]
        },
        {
            id: "ds-q013", part: 12, difficulty: "advanced", type: "ethical",
            question: "Should tech companies use algorithm complexity as a primary hiring filter?",
            scenario: "FAANG companies reject ~95% of candidates based on DSA interviews. Critics argue this filters for 'puzzle ability' not engineering skill. Proponents say it tests foundational CS thinking.",
            options: [
                { label: "Yes — DSA knowledge correlates with ability to write efficient production code", framework: "Meritocratic — test fundamental skills" },
                { label: "No — real engineering is about systems, collaboration, and domain knowledge", framework: "Pragmatic — test what the job actually requires" },
                { label: "Use as one signal among many (system design, past work, cultural fit)", framework: "Holistic — multiple evaluation dimensions" },
                { label: "Replace with paid trial periods that evaluate real work output", framework: "Empirical — judge by actual results" }
            ],
            _answer: 2,
            explanation: "Most industry leaders now advocate multi-dimensional evaluation. DSA tests pattern recognition but not software engineering judgment. The best hiring processes combine algorithmic thinking, system design, code review, and behavioral assessment.",
            articleSlug: "data-structures-conclusion", tags: ["interviews", "ethics", "hiring"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// ENTREPRENEURSHIP
// ═══════════════════════════════════════════════════════════════════════════════
const entrepreneurship = buildQuiz({
    series: "entrepreneurship",
    title: "Entrepreneurship",
    salt: "entrep-biz-2026",
    totalParts: 15,
    questions: [
        {
            id: "ep-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What does 'Problem-Solution Fit' validate?",
            options: ["That customers will pay for your solution", "That a real problem exists and your solution addresses it", "That your product can scale to millions", "That investors will fund your startup"],
            _answer: 1,
            explanation: "Problem-Solution Fit is the first validation stage: confirming that a genuine problem exists for a target audience AND that your proposed solution logically addresses it. It precedes Product-Market Fit.",
            articleSlug: "entrepreneurship-ideation-opportunity", tags: ["validation", "PSF"]
        },
        {
            id: "ep-q002", part: 2, difficulty: "intermediate", type: "fill-blank",
            question: "TAM stands for Total ___ Market.",
            _answer: "Addressable",
            acceptAlso: ["addressable", "Available", "available"],
            explanation: "TAM (Total Addressable Market) represents the total revenue opportunity if you captured 100% of the market. SAM (Serviceable Addressable) and SOM (Serviceable Obtainable) narrow it down realistically.",
            articleSlug: "entrepreneurship-validation-mvp", tags: ["TAM", "market sizing"]
        },
        {
            id: "ep-q003", part: 3, difficulty: "intermediate", type: "mcq",
            question: "In the Business Model Canvas, which block answers 'How do we reach customers?'",
            options: ["Key Resources", "Value Propositions", "Channels", "Customer Relationships"],
            _answer: 2,
            explanation: "Channels describe how a company communicates with and reaches its customer segments to deliver its value proposition. Examples: direct sales, web, retail stores, partner channels.",
            articleSlug: "entrepreneurship-business-models", tags: ["BMC", "channels"]
        },
        {
            id: "ep-q004", part: 4, difficulty: "intermediate", type: "true-false",
            question: "In lean startup methodology, a 'pivot' means completely abandoning your original idea and starting from scratch.",
            _answer: false,
            explanation: "A pivot is a structured course correction — changing ONE element of the business model while keeping what's working. Types include: customer segment pivot, value capture pivot, channel pivot, technology pivot.",
            articleSlug: "entrepreneurship-lean-startup", tags: ["lean startup", "pivot"]
        },
        {
            id: "ep-q005", part: 5, difficulty: "advanced", type: "calculation",
            question: "A startup raises $2M on a $8M pre-money valuation. What percentage of the company do the investors own?",
            formula: "Investor ownership = Investment / Post-money valuation = Investment / (Pre-money + Investment)",
            _answer: 20,
            unit: "%",
            tolerance: 0,
            explanation: "Post-money = $8M + $2M = $10M. Investor ownership = $2M / $10M = 20%. The founders retain 80% (before any option pool).",
            articleSlug: "entrepreneurship-fundraising", tags: ["fundraising", "valuation", "equity"]
        },
        {
            id: "ep-q006", part: 5, difficulty: "advanced", type: "scenario",
            question: "Your SaaS startup has $50K MRR and 18 months of runway. Two VCs offer term sheets. Which do you choose?",
            scenario: {
                context: "B2B SaaS, 40% MoM growth, $50K MRR. Need capital to hire sales team.",
                metrics: { "MRR": "$50K", "Growth": "40% MoM", "Runway": "18 months", "Burn": "$80K/month" }
            },
            options: [
                "VC A: $3M at $12M pre-money, board seat, pro-rata rights, 1× liquidation preference",
                "VC B: $5M at $10M pre-money, 2 board seats, 2× participating liquidation preference",
                "Neither — use revenue growth to self-fund and avoid dilution",
                "Take both using a SAFE note to avoid choosing"
            ],
            _answer: 0,
            explanation: "VC A offers better terms: higher valuation ($12M vs $10M), less dilution (20% vs 33%), standard 1× non-participating preference, and only 1 board seat. VC B's 2× participating preference could significantly reduce founder payoff at exit.",
            articleSlug: "entrepreneurship-fundraising", tags: ["term sheets", "fundraising"]
        },
        {
            id: "ep-q007", part: 6, difficulty: "intermediate", type: "ordering",
            question: "Arrange the typical startup funding stages in chronological order:",
            items: ["Series A ($2-15M)", "Pre-seed ($50K-500K)", "Seed ($500K-2M)", "Series B ($15-50M)", "Series C+ ($50M+)"],
            _answer: ["Pre-seed ($50K-500K)", "Seed ($500K-2M)", "Series A ($2-15M)", "Series B ($15-50M)", "Series C+ ($50M+)"],
            explanation: "Each round is progressively larger as the company de-risks: Pre-seed (idea stage) → Seed (MVP/early traction) → A (product-market fit) → B (scaling) → C+ (market dominance/IPO prep).",
            articleSlug: "entrepreneurship-founding-team", tags: ["funding stages", "fundraising"]
        },
        {
            id: "ep-q008", part: 7, difficulty: "intermediate", type: "mcq",
            question: "What does the acronym OKR stand for?",
            options: ["Operational Key Requirements", "Objectives and Key Results", "Organizational Knowledge Review", "Outcome-based Key Ratios"],
            _answer: 1,
            explanation: "OKRs (Objectives and Key Results) is a goal-setting framework. The Objective is qualitative and inspirational; Key Results are 3-5 quantitative metrics that measure progress toward the objective.",
            articleSlug: "entrepreneurship-hiring-culture", tags: ["OKR", "management"]
        },
        {
            id: "ep-q009", part: 8, difficulty: "advanced", type: "code-output",
            question: "A product has a viral coefficient K=1.3 and cycle time of 5 days. Starting with 100 users, how many total users after 3 cycles?",
            code: "users = 100\nK = 1.3\nfor cycle in range(3):\n    new_users = int(users * K) - users\n    users += new_users\nprint(users)",
            _answer: "219",
            acceptAlso: ["220", "219.7"],
            explanation: "Cycle 1: 100 × 1.3 = 130 (30 new). Cycle 2: 130 × 1.3 = 169. Cycle 3: 169 × 1.3 = 219. With K > 1, each user brings more than one new user, creating exponential growth.",
            articleSlug: "entrepreneurship-scaling-growth", tags: ["viral growth", "K-factor"]
        },
        {
            id: "ep-q010", part: 9, difficulty: "intermediate", type: "matching",
            question: "Match each marketing metric to its definition:",
            pairs: {
                left: ["CAC", "LTV", "Churn Rate", "NPS"],
                right: ["Cost to acquire one customer", "Total revenue from a customer over their lifetime", "Percentage of customers who leave per period", "Customer satisfaction score (-100 to +100)"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "CAC (Customer Acquisition Cost), LTV (Lifetime Value), Churn Rate (attrition), and NPS (Net Promoter Score) are the four pillars of SaaS/subscription business health.",
            articleSlug: "entrepreneurship-marketing-digital", tags: ["metrics", "SaaS"]
        },
        {
            id: "ep-q011", part: 10, difficulty: "advanced", type: "debug",
            question: "This burn rate calculation has a logical error. Find the mistake:",
            code: "monthly_revenue = 50000\nmonthly_expenses = 120000\nbank_balance = 900000\n\nnet_burn = monthly_expenses  # Monthly burn rate\nrunway_months = bank_balance / net_burn\nprint(f'Runway: {runway_months:.1f} months')  # Shows 7.5 months",
            options: [
                "Net burn should subtract revenue: net_burn = expenses - revenue (gross vs net burn)",
                "Should use weekly burn rate for more accuracy",
                "Bank balance should exclude accounts receivable",
                "Runway should account for expense growth rate"
            ],
            _answer: 0,
            explanation: "Net burn = expenses - revenue = $120K - $50K = $70K/month. True runway = $900K / $70K = 12.9 months. The code uses gross burn ($120K), overstating urgency. Net burn accounts for incoming revenue.",
            articleSlug: "entrepreneurship-legal-financial", tags: ["burn rate", "runway", "finance"]
        },
        {
            id: "ep-q012", part: 11, difficulty: "intermediate", type: "mcq",
            question: "What is a 'vanity metric' in startup analytics?",
            options: [
                "Any metric that makes the company look good but doesn't drive decisions",
                "Customer satisfaction scores",
                "Revenue growth rate",
                "Monthly active users for a social app"
            ],
            _answer: 0,
            explanation: "Vanity metrics (total signups, page views, downloads) look impressive but don't correlate with business health. Actionable metrics (activation rate, revenue per user, retention) drive real decisions.",
            articleSlug: "entrepreneurship-data-driven", tags: ["metrics", "analytics"]
        },
        {
            id: "ep-q013", part: 14, difficulty: "advanced", type: "architecture",
            question: "Your startup reached $5M ARR and you're considering exit options. A PE firm offers 8× revenue ($40M). What factors determine if you should sell?",
            scenario: "SaaS platform, 30% growth rate slowing, you own 45% after dilution. Team of 30. Offer is $40M acquisition (mix of cash and earnout).",
            options: [
                { label: "Accept — $18M personal payout is life-changing and growth is slowing", tradeoffs: ["Immediate liquidity", "Founder burnout risk eliminated", "Team may face layoffs"] },
                { label: "Reject — continue growing to $20M ARR for a $200M+ exit", tradeoffs: ["4× potential upside", "2-3 more years of work", "Market risk", "Further dilution from new rounds"] },
                { label: "Counter with higher multiple and no earnout", tradeoffs: ["Negotiate better terms", "Risk losing the offer", "Earnout often has unachievable targets"] },
                { label: "Pursue secondary sale — sell some personal shares, keep growing company", tradeoffs: ["Partial liquidity now", "Keep upside potential", "Complex cap table"] }
            ],
            _answer: 3,
            explanation: "Secondary sales let founders de-risk personally while maintaining company upside. Selling $5-8M in secondary gives financial security without giving up the potential 10× exit. Common at Series B+ companies.",
            articleSlug: "entrepreneurship-exit-strategies", tags: ["exit", "secondary", "strategy"]
        },
        {
            id: "ep-q014", part: 12, difficulty: "beginner", type: "true-false",
            question: "A startup must be a technology company to qualify for venture capital funding.",
            _answer: false,
            explanation: "While tech startups dominate VC, venture capital funds any high-growth scalable business. VC has funded biotech, fintech, consumer brands (Warby Parker, Dollar Shave Club), food delivery, and more.",
            articleSlug: "entrepreneurship-innovation-trends", tags: ["VC", "funding"]
        },
        {
            id: "ep-q015", part: 13, difficulty: "intermediate", type: "ethical",
            question: "Should startup accelerators take equity from companies that may never benefit from the program?",
            scenario: "Top accelerators (YC, Techstars) take 6-7% equity from all accepted companies. Some founders report the program added little value beyond the brand name. The acceptance rate is <2%.",
            options: [
                { label: "Yes — the brand signal alone is worth 7% to investors and hiring", framework: "Market value — equity reflects brand premium" },
                { label: "No — programs should prove value before taking equity", framework: "Fairness — compensation should match contribution" },
                { label: "Offer tiered equity based on how much support each company actually uses", framework: "Proportional — pay for what you consume" },
                { label: "Replace equity with a revenue share that only applies if the company succeeds", framework: "Aligned incentives — share in outcomes, not ownership" }
            ],
            _answer: 3,
            explanation: "Revenue-based or success-based models align incentives. If the accelerator adds value, they earn more. Some newer programs (Earnest Capital, Indie.vc) already use revenue-share models instead of equity.",
            articleSlug: "entrepreneurship-ecosystem", tags: ["accelerators", "equity", "ethics"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE MASTERY
// ═══════════════════════════════════════════════════════════════════════════════
const databaseMastery = buildQuiz({
    series: "database-mastery",
    title: "Database Mastery",
    salt: "db-master-2026",
    totalParts: 15,
    questions: [
        {
            id: "db-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What does ACID stand for in database transactions?",
            options: ["Asynchronous, Concurrent, Isolated, Durable", "Atomicity, Consistency, Isolation, Durability", "Available, Consistent, Independent, Distributed", "Atomic, Cached, Indexed, Distributed"],
            _answer: 1,
            explanation: "ACID guarantees: Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions don't interfere), Durability (committed data survives crashes).",
            articleSlug: "database-mastery-fundamentals", tags: ["ACID", "transactions"]
        },
        {
            id: "db-q002", part: 2, difficulty: "intermediate", type: "code-output",
            question: "What does this SQL query return?",
            code: "SELECT COUNT(*) FROM orders\nWHERE total > 100\nGROUP BY customer_id\nHAVING COUNT(*) >= 3;",
            _answer: "counts",
            acceptAlso: ["count of orders per customer", "number of rows per group", "rows where customer has 3+ orders over $100"],
            explanation: "This returns the count of orders > $100 for each customer who has at least 3 such orders. HAVING filters groups (like WHERE filters rows).",
            articleSlug: "database-mastery-sql-advanced", tags: ["SQL", "GROUP BY", "HAVING"]
        },
        {
            id: "db-q003", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "Database normalization to 3NF eliminates ___ dependencies between non-key columns.",
            _answer: "transitive",
            acceptAlso: ["transitive functional", "indirect"],
            explanation: "Third Normal Form (3NF) eliminates transitive dependencies: no non-key column should depend on another non-key column. Example: zip_code → city is transitive if the table has (id, zip_code, city).",
            articleSlug: "database-mastery-normalization", tags: ["normalization", "3NF"]
        },
        {
            id: "db-q004", part: 4, difficulty: "intermediate", type: "true-false",
            question: "A B-tree index makes all queries faster, regardless of the query pattern.",
            _answer: false,
            explanation: "B-tree indexes speed up equality and range lookups but slow down writes (index maintenance on INSERT/UPDATE/DELETE). They're also useless for LIKE '%pattern' queries or when the optimizer chooses a full scan.",
            articleSlug: "database-mastery-indexing", tags: ["indexing", "B-tree"]
        },
        {
            id: "db-q005", part: 5, difficulty: "advanced", type: "debug",
            question: "This query is extremely slow on a table with 10M rows. Find the performance issue:",
            code: "SELECT * FROM users\nWHERE YEAR(created_at) = 2025\n  AND status = 'active'\nORDER BY last_login DESC\nLIMIT 10;",
            options: [
                "YEAR(created_at) prevents index usage — wrapping a column in a function kills the index",
                "SELECT * fetches unnecessary columns",
                "ORDER BY on a non-indexed column causes filesort",
                "All of the above"
            ],
            _answer: 3,
            explanation: "All three are issues. The function on created_at prevents index use (fix: WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01'). SELECT * wastes I/O. Missing index on last_login causes expensive sort.",
            articleSlug: "database-mastery-query-optimization", tags: ["performance", "indexing"]
        },
        {
            id: "db-q006", part: 6, difficulty: "advanced", type: "scenario",
            question: "Your PostgreSQL database handles 50K transactions/second but replication lag to read replicas reaches 30 seconds during peak hours. Users see stale data. What's your primary fix?",
            scenario: {
                context: "E-commerce platform. Write-heavy during sales (inventory updates). 3 read replicas, asynchronous replication.",
                metrics: { "Write TPS": "50,000", "Replication lag": "30s peak", "Read replicas": "3", "WAL generation": "2GB/min" },
                constraints: ["Cannot reduce write throughput", "Users expect immediate consistency after purchase", "Budget for 1 additional server"]
            },
            options: [
                "Switch to synchronous replication for all transactions",
                "Add read-your-writes consistency — route user reads to primary after their writes",
                "Increase replica hardware (more IOPS) to process WAL faster",
                "Partition writes across multiple primary servers (multi-master)"
            ],
            _answer: 1,
            explanation: "Read-your-writes routes each user's reads to the primary for a short window after they write. This gives perception of consistency without the performance penalty of synchronous replication for all traffic.",
            articleSlug: "database-mastery-replication", tags: ["replication", "consistency"]
        },
        {
            id: "db-q007", part: 7, difficulty: "intermediate", type: "ordering",
            question: "Arrange the SQL query execution order (logical processing order):",
            items: ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "LIMIT"],
            _answer: ["FROM", "WHERE", "GROUP BY", "SELECT", "ORDER BY", "LIMIT"],
            explanation: "SQL logical execution: FROM (identify tables) → WHERE (filter rows) → GROUP BY (aggregate) → SELECT (choose columns) → ORDER BY (sort) → LIMIT (truncate). This is why you can't use a SELECT alias in WHERE.",
            articleSlug: "database-mastery-sql-execution", tags: ["SQL", "execution order"]
        },
        {
            id: "db-q008", part: 8, difficulty: "advanced", type: "matching",
            question: "Match each isolation level to the anomaly it ALLOWS:",
            pairs: {
                left: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
                right: ["Dirty reads, non-repeatable reads, phantoms", "Non-repeatable reads and phantoms", "Phantom reads only", "No anomalies (full isolation)"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "Each higher isolation level prevents more anomalies but reduces concurrency. Read Uncommitted is fastest but riskiest; Serializable is safest but slowest.",
            articleSlug: "database-mastery-isolation", tags: ["isolation levels", "ACID"]
        },
        {
            id: "db-q009", part: 9, difficulty: "advanced", type: "calculation",
            question: "A table has 10 million rows averaging 200 bytes each. With an 8KB page size and 70% fill factor, how many pages does the table occupy?",
            formula: "Pages = Total_bytes / (Page_size × Fill_factor) = (Rows × Row_size) / (8192 × 0.7)",
            _answer: 348837,
            unit: "pages",
            tolerance: 5000,
            explanation: "Total data = 10M × 200B = 2GB. Usable space per page = 8192 × 0.7 = 5734 bytes. Pages needed = 2,000,000,000 / 5,734 ≈ 348,837 pages (≈ 2.7 GB on disk).",
            articleSlug: "database-mastery-storage", tags: ["storage", "pages", "sizing"]
        },
        {
            id: "db-q010", part: 10, difficulty: "beginner", type: "mcq",
            question: "What type of database is MongoDB?",
            options: ["Relational (RDBMS)", "Document-oriented (NoSQL)", "Graph database", "Time-series database"],
            _answer: 1,
            explanation: "MongoDB is a document-oriented NoSQL database that stores data as BSON (binary JSON) documents. It's schema-flexible, supports nested documents, and scales horizontally via sharding.",
            articleSlug: "database-mastery-nosql", tags: ["MongoDB", "NoSQL"]
        },
        {
            id: "db-q011", part: 11, difficulty: "advanced", type: "diagnosis",
            question: "A production database suddenly shows 10× increase in deadlocks. Diagnose the root cause:",
            presentation: {
                context: "PostgreSQL 15, e-commerce checkout flow. Deadlocks started after a deployment that added a new 'apply coupon' feature.",
                findings: [
                    "Deadlock log: Transaction A locks row in orders, waits for coupons table",
                    "Deadlock log: Transaction B locks row in coupons, waits for orders table",
                    "New coupon feature: reads coupon → updates coupon usage → updates order total",
                    "Existing checkout: updates order → then reads coupon for validation",
                    "Both operations run in SERIALIZABLE isolation"
                ]
            },
            options: [
                "Lock ordering violation — checkout and coupon features acquire locks in opposite order",
                "Missing index on coupons table causing full table lock",
                "SERIALIZABLE isolation is too strict for this workload",
                "Connection pool exhaustion causing timeout-based deadlocks"
            ],
            _answer: 0,
            explanation: "Classic lock ordering violation: Feature A locks orders→coupons, Feature B locks coupons→orders. Fix: establish a global lock ordering (always acquire coupons lock before orders) or use advisory locks.",
            articleSlug: "database-mastery-concurrency", tags: ["deadlock", "concurrency", "locking"]
        },
        {
            id: "db-q012", part: 12, difficulty: "intermediate", type: "ethical",
            question: "Should database vendors charge based on CPU cores, making scaling prohibitively expensive?",
            scenario: "Oracle charges per-core licensing ($47,500/core). A 32-core server costs $1.5M in licenses alone. Open-source alternatives (PostgreSQL) are free but lack some enterprise features.",
            options: [
                { label: "Per-core pricing reflects the value delivered at scale", framework: "Market pricing — charge what the market bears" },
                { label: "It creates perverse incentives to under-provision, harming users", framework: "Utilitarian — pricing shouldn't cause technical harm" },
                { label: "Open source is the ethical alternative — companies should contribute upstream", framework: "Commons — shared infrastructure benefits all" },
                { label: "Tiered pricing (free tier → enterprise) balances access and sustainability", framework: "Accessibility — remove barriers for small players" }
            ],
            _answer: 3,
            explanation: "Tiered models (used by most modern databases) balance sustainability with access. Free tiers enable startups; enterprise tiers fund development. Per-core pricing primarily persists in legacy vendors.",
            articleSlug: "database-mastery-administration", tags: ["licensing", "ethics", "open source"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOCOLS MASTER
// ═══════════════════════════════════════════════════════════════════════════════
const protocolsMaster = buildQuiz({
    series: "protocols-master",
    title: "Network Protocols",
    salt: "proto-net-2026",
    totalParts: 20,
    questions: [
        {
            id: "pm-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "Which OSI layer is responsible for routing packets between networks?",
            options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 5 (Session)"],
            _answer: 1,
            explanation: "Layer 3 (Network) handles logical addressing (IP) and routing decisions. Routers operate at this layer, forwarding packets based on destination IP addresses.",
            articleSlug: "protocols-master-osi-foundations", tags: ["OSI", "routing", "Layer 3"]
        },
        {
            id: "pm-q002", part: 2, difficulty: "intermediate", type: "ordering",
            question: "Arrange the TCP three-way handshake in correct order:",
            items: ["Server sends SYN-ACK", "Client sends ACK", "Client sends SYN", "Connection established"],
            _answer: ["Client sends SYN", "Server sends SYN-ACK", "Client sends ACK", "Connection established"],
            explanation: "TCP handshake: Client sends SYN (seq=x) → Server replies SYN-ACK (seq=y, ack=x+1) → Client sends ACK (ack=y+1). Both sides now have synchronized sequence numbers.",
            articleSlug: "protocols-master-tcp-deep-dive", tags: ["TCP", "handshake"]
        },
        {
            id: "pm-q003", part: 3, difficulty: "intermediate", type: "true-false",
            question: "UDP guarantees that packets arrive in the same order they were sent.",
            _answer: false,
            explanation: "UDP is connectionless and provides no ordering guarantees. Packets may arrive out of order, duplicated, or not at all. Applications (DNS, gaming, VoIP) that use UDP handle ordering themselves if needed.",
            articleSlug: "protocols-master-udp", tags: ["UDP", "transport"]
        },
        {
            id: "pm-q004", part: 4, difficulty: "intermediate", type: "fill-blank",
            question: "HTTP/2 uses a single TCP connection with multiple ___ to avoid head-of-line blocking.",
            _answer: "streams",
            acceptAlso: ["multiplexed streams", "stream", "virtual streams"],
            explanation: "HTTP/2 multiplexes multiple request/response pairs as independent streams over one TCP connection. Each stream has an ID, enabling concurrent transfers without opening multiple connections.",
            articleSlug: "protocols-master-http2", tags: ["HTTP/2", "multiplexing"]
        },
        {
            id: "pm-q005", part: 5, difficulty: "advanced", type: "code-output",
            question: "What is the subnet mask in CIDR notation for a network that needs exactly 30 usable host addresses?",
            code: "# Need: 30 hosts\n# Formula: 2^n - 2 >= 30 (subtract network and broadcast)\n# n = 5 gives 30 usable hosts (2^5 - 2 = 30)\n# Subnet bits = 32 - 5 = 27",
            _answer: "/27",
            acceptAlso: ["27", "255.255.255.224"],
            explanation: "2^5 = 32 addresses, minus 2 (network + broadcast) = 30 usable hosts. 32 - 5 = /27 subnet mask (255.255.255.224).",
            articleSlug: "protocols-master-ip-subnetting", tags: ["subnetting", "CIDR"]
        },
        {
            id: "pm-q006", part: 6, difficulty: "advanced", type: "debug",
            question: "A client can't resolve 'api.example.com' but 'example.com' works fine. The DNS zone file has an issue:",
            code: "example.com.    IN  A      93.184.216.34\nwww             IN  CNAME  example.com.\napi             IN  CNAME  api-lb.us-east.elb.amazonaws.com",
            options: [
                "Missing trailing dot on the CNAME target — 'api-lb.us-east.elb.amazonaws.com' becomes 'api-lb.us-east.elb.amazonaws.com.example.com.'",
                "CNAME records can't point to external domains",
                "Missing SOA record for the api subdomain",
                "Need an A record, not CNAME, for api subdomain"
            ],
            _answer: 0,
            explanation: "In DNS zone files, names without a trailing dot are relative (appended to the zone origin). The CNAME target needs a trailing dot: 'api-lb.us-east.elb.amazonaws.com.' to be treated as absolute.",
            articleSlug: "protocols-master-dns", tags: ["DNS", "CNAME", "debugging"]
        },
        {
            id: "pm-q007", part: 7, difficulty: "advanced", type: "scenario",
            question: "Your application experiences intermittent 'connection reset' errors to a third-party API. Packet captures show RST packets after ~60 seconds of idle connections. What's the fix?",
            scenario: {
                context: "Microservice calling external payment API. Uses HTTP/1.1 keep-alive connections via a connection pool.",
                metrics: { "Error rate": "2% of requests", "Pattern": "Only after idle periods > 60s", "TCP keepalive": "Not configured" },
                constraints: ["Cannot modify the third-party API", "Using nginx as reverse proxy", "Connection pool size: 50"]
            },
            options: [
                "Enable TCP keepalive with interval < 60s to prevent NAT/firewall timeout",
                "Disable connection pooling — open a new connection per request",
                "Increase connection pool size to 200",
                "Add retry logic with exponential backoff"
            ],
            _answer: 0,
            explanation: "The RST comes from an intermediate NAT/firewall that times out idle connections at 60s. TCP keepalive probes (e.g., every 30s) keep the connection alive through stateful middleboxes. Retry logic is a band-aid, not a fix.",
            articleSlug: "protocols-master-tcp-troubleshooting", tags: ["TCP", "keepalive", "NAT"]
        },
        {
            id: "pm-q008", part: 8, difficulty: "beginner", type: "mcq",
            question: "What port does HTTPS use by default?",
            options: ["80", "443", "8080", "8443"],
            _answer: 1,
            explanation: "HTTPS (HTTP over TLS) uses port 443 by default. HTTP uses port 80. 8080 and 8443 are common alternative/development ports.",
            articleSlug: "protocols-master-tls", tags: ["HTTPS", "TLS", "ports"]
        },
        {
            id: "pm-q009", part: 9, difficulty: "advanced", type: "matching",
            question: "Match each protocol to its primary layer and function:",
            pairs: {
                left: ["ARP", "BGP", "TLS", "ICMP"],
                right: ["Layer 2 — resolves IP to MAC address", "Layer 3 — inter-AS routing (Internet backbone)", "Layer 5-6 — encryption and authentication", "Layer 3 — error reporting and diagnostics (ping)"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "ARP operates between L2/L3 (IP→MAC). BGP is the Internet's routing protocol (L3). TLS provides security above transport (L5-6). ICMP is IP's error/diagnostic protocol (L3).",
            articleSlug: "protocols-master-supporting-protocols", tags: ["ARP", "BGP", "TLS", "ICMP"]
        },
        {
            id: "pm-q010", part: 10, difficulty: "advanced", type: "calculation",
            question: "A TCP connection has 100ms RTT and 64KB window size. What's the maximum theoretical throughput?",
            formula: "Throughput = Window_size / RTT",
            _answer: 5,
            unit: "Mbps",
            tolerance: 1,
            explanation: "Throughput = 64KB / 100ms = 65,536 bytes / 0.1s = 655,360 bytes/s = ~5.24 Mbps. This is the bandwidth-delay product limit — the window can't keep the pipe full beyond this.",
            articleSlug: "protocols-master-tcp-performance", tags: ["TCP", "throughput", "BDP"]
        },
        {
            id: "pm-q011", part: 11, difficulty: "intermediate", type: "mcq",
            question: "Which HTTP method is idempotent?",
            options: ["POST", "PUT", "PATCH (without If-Match)", "None of the above"],
            _answer: 1,
            explanation: "PUT is idempotent — sending the same PUT request multiple times produces the same result. POST creates new resources (not idempotent). GET, PUT, DELETE are idempotent; POST and PATCH generally are not.",
            articleSlug: "protocols-master-http-methods", tags: ["HTTP", "idempotent", "REST"]
        },
        {
            id: "pm-q012", part: 12, difficulty: "advanced", type: "diagnosis",
            question: "Users report that your website loads slowly from Asia but is fast in Europe. CDN is configured. Diagnose:",
            presentation: {
                context: "Global SaaS app. Cloudflare CDN configured. Origin server in Frankfurt, Germany.",
                findings: [
                    "Europe: TTFB 50ms, page load 1.2s",
                    "Asia (Singapore): TTFB 800ms, page load 4.5s",
                    "CDN cache hit ratio: 12% (very low)",
                    "Most pages require authentication (Cookie header)",
                    "Cache-Control: private, no-store on all API responses"
                ]
            },
            options: [
                "CDN can't cache authenticated content — 'private, no-store' headers bypass CDN",
                "Missing PoP (Point of Presence) in Asia",
                "DNS resolution is slow for Asian users",
                "TCP congestion window too small for high-latency connections"
            ],
            _answer: 0,
            explanation: "Cache-Control: private, no-store tells the CDN to never cache these responses. With only 12% hit ratio, almost everything goes to origin (Frankfurt). Fix: separate cacheable static assets, use 'stale-while-revalidate', or add an origin in Asia.",
            articleSlug: "protocols-master-http-caching", tags: ["CDN", "caching", "headers"]
        },
        {
            id: "pm-q013", part: 13, difficulty: "intermediate", type: "ethical",
            question: "Should ISPs be allowed to perform deep packet inspection (DPI) to prioritize traffic types?",
            scenario: "ISPs argue DPI helps manage network congestion (prioritizing VoIP over torrents). Critics say it violates net neutrality and user privacy by inspecting encrypted traffic metadata.",
            options: [
                { label: "Yes — network management requires visibility into traffic patterns", framework: "Pragmatic — operational necessity" },
                { label: "No — all packets should be treated equally regardless of content", framework: "Net neutrality — equal access principle" },
                { label: "Only for anonymized/aggregated traffic management, never per-user", framework: "Privacy-preserving — aggregate is acceptable" },
                { label: "Users should opt-in to prioritization in exchange for lower latency", framework: "Consent-based — user choice" }
            ],
            _answer: 2,
            explanation: "Aggregate traffic management (e.g., prioritizing real-time protocols generally) can improve QoS without violating individual privacy. Per-user DPI raises serious privacy concerns and enables discriminatory practices.",
            articleSlug: "protocols-master-network-security", tags: ["DPI", "net neutrality", "privacy"]
        },
        {
            id: "pm-q014", part: 14, difficulty: "advanced", type: "architecture",
            question: "You're designing a real-time multiplayer game protocol. Which transport approach?",
            scenario: "Fast-paced FPS game. 64 players per server. Need position updates 60 times/second. Acceptable packet loss: 5%. Latency budget: <50ms.",
            options: [
                { label: "TCP — reliable, ordered delivery", tradeoffs: ["No packet loss", "Head-of-line blocking", "Retransmission delays"] },
                { label: "UDP with custom reliability layer for critical packets only", tradeoffs: ["Low latency", "Selective reliability", "Complex implementation"] },
                { label: "WebSocket over TCP", tradeoffs: ["Browser compatible", "TCP overhead", "Easy implementation"] },
                { label: "QUIC (HTTP/3)", tradeoffs: ["Stream multiplexing", "Built-in encryption", "No HOL blocking between streams"] }
            ],
            _answer: 1,
            explanation: "FPS games universally use UDP with custom reliability. Position updates are fire-and-forget (old positions are irrelevant). Critical events (kills, pickups) get application-level acknowledgment. TCP's retransmission adds unacceptable latency.",
            articleSlug: "protocols-master-game-networking", tags: ["UDP", "gaming", "real-time"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// COGNITIVE PSYCHOLOGY
// ═══════════════════════════════════════════════════════════════════════════════
const cognitivePsych = buildQuiz({
    series: "cognitive-psych",
    title: "Cognitive Psychology",
    salt: "cog-psych-2026",
    totalParts: 14,
    questions: [
        {
            id: "cp-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What is the approximate capacity of short-term (working) memory?",
            options: ["3 ± 1 items", "7 ± 2 items", "12 ± 3 items", "Unlimited items"],
            _answer: 1,
            explanation: "George Miller's (1956) classic finding: working memory holds approximately 7 ± 2 items (chunks). This has been refined to 4 ± 1 by modern research (Cowan, 2001).",
            articleSlug: "cognitive-psych-memory-attention", tags: ["working memory", "Miller"]
        },
        {
            id: "cp-q002", part: 1, difficulty: "beginner", type: "true-false",
            question: "Multitasking with complex tasks is as efficient as doing them sequentially.",
            _answer: false,
            explanation: "Research consistently shows that 'multitasking' with complex tasks is actually rapid task-switching, which incurs a cognitive cost (10-40% time penalty). True parallel processing only works for highly automatic tasks.",
            articleSlug: "cognitive-psych-memory-attention", tags: ["attention", "multitasking"]
        },
        {
            id: "cp-q003", part: 2, difficulty: "intermediate", type: "matching",
            question: "Match each cognitive bias to its description:",
            pairs: {
                left: ["Confirmation bias", "Anchoring effect", "Dunning-Kruger effect", "Availability heuristic"],
                right: ["Seeking info that confirms existing beliefs", "Over-relying on first piece of information", "Overestimating ability when unskilled", "Judging likelihood by ease of recall"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "These biases represent systematic errors in thinking: confirmation bias (selective evidence), anchoring (first number sticks), Dunning-Kruger (incompetent don't know they're incompetent), availability (vivid = common).",
            articleSlug: "cognitive-psych-biases-heuristics", tags: ["biases", "heuristics"]
        },
        {
            id: "cp-q004", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "The ___ effect describes how the way information is presented (gain vs. loss framing) changes decisions.",
            _answer: "framing",
            acceptAlso: ["framing effect", "Framing"],
            explanation: "The framing effect (Tversky & Kahneman, 1981): people choose differently when the same outcome is framed as a gain ('90% survival rate') vs. a loss ('10% mortality rate'). Same data, different decisions.",
            articleSlug: "cognitive-psych-decision-making", tags: ["framing", "decision making"]
        },
        {
            id: "cp-q005", part: 4, difficulty: "intermediate", type: "mcq",
            question: "According to Dual Process Theory, System 1 thinking is characterized by being:",
            options: ["Slow, deliberate, and analytical", "Fast, automatic, and intuitive", "Used only for mathematical problems", "Active only during sleep"],
            _answer: 1,
            explanation: "Kahneman's Dual Process Theory: System 1 is fast, automatic, intuitive (driving, face recognition). System 2 is slow, effortful, deliberate (complex math, logical reasoning). Most daily decisions use System 1.",
            articleSlug: "cognitive-psych-dual-process", tags: ["System 1", "dual process"]
        },
        {
            id: "cp-q006", part: 5, difficulty: "advanced", type: "scenario",
            question: "A UX designer wants to increase organ donor registration. Currently 15% opt-in rate. Which cognitive principle would be most effective?",
            scenario: {
                context: "Government website for driver's license renewal. Users must actively check a box to become organ donors.",
                metrics: { "Current opt-in rate": "15%", "Countries with opt-out default": "85-99% donor rate", "Users who read the organ donor section": "30%" }
            },
            options: [
                "Make the form more visually appealing with emotional imagery",
                "Switch from opt-in to opt-out default (pre-checked box)",
                "Add social proof ('80% of your neighbors are donors')",
                "Provide more educational information about donation"
            ],
            _answer: 1,
            explanation: "Default effect: people overwhelmingly stick with the pre-selected option (status quo bias). Countries that switched from opt-in to opt-out saw donation rates jump from ~15% to 85-99%. The default is the most powerful nudge.",
            articleSlug: "cognitive-psych-nudge-theory", tags: ["defaults", "nudge", "choice architecture"]
        },
        {
            id: "cp-q007", part: 6, difficulty: "advanced", type: "ordering",
            question: "Arrange Maslow's hierarchy of needs from base (most fundamental) to peak:",
            items: ["Self-actualization", "Safety needs", "Physiological needs", "Esteem needs", "Love/belonging"],
            _answer: ["Physiological needs", "Safety needs", "Love/belonging", "Esteem needs", "Self-actualization"],
            explanation: "Maslow's hierarchy (1943): Physiological (food, water) → Safety (security, stability) → Love/Belonging (relationships) → Esteem (respect, achievement) → Self-actualization (reaching potential).",
            articleSlug: "cognitive-psych-motivation", tags: ["Maslow", "motivation"]
        },
        {
            id: "cp-q008", part: 7, difficulty: "intermediate", type: "mcq",
            question: "The 'cocktail party effect' demonstrates our ability to:",
            options: ["Remember conversations perfectly", "Selectively attend to one voice among many", "Process all conversations simultaneously", "Forget unimportant information"],
            _answer: 1,
            explanation: "The cocktail party effect (Cherry, 1953) shows selective attention: we can focus on one conversation in a noisy room while filtering others. We also detect our name in unattended channels (breakthrough).",
            articleSlug: "cognitive-psych-selective-attention", tags: ["attention", "cocktail party"]
        },
        {
            id: "cp-q009", part: 8, difficulty: "advanced", type: "diagnosis",
            question: "A student studies for 6 hours straight but performs poorly on the exam. Diagnose the cognitive issue:",
            presentation: {
                context: "University student, re-reads textbook chapters repeatedly for 6 hours before exam.",
                findings: [
                    "Study method: passive re-reading of highlighted text",
                    "No practice questions attempted",
                    "Reports 'feeling confident' after study session",
                    "Exam requires applying concepts to novel problems",
                    "Performance: 45% (below class average of 72%)"
                ]
            },
            options: [
                "Illusion of fluency — re-reading creates false sense of knowing without deep processing",
                "Insufficient study time — 6 hours isn't enough",
                "Test anxiety causing retrieval failure",
                "The exam was unfairly difficult"
            ],
            _answer: 0,
            explanation: "Illusion of fluency: passive re-reading makes material feel familiar (recognition) without building retrieval strength (recall). Active recall, spaced repetition, and practice testing are far more effective despite feeling harder.",
            articleSlug: "cognitive-psych-learning", tags: ["metacognition", "study strategies"]
        },
        {
            id: "cp-q010", part: 9, difficulty: "advanced", type: "calculation",
            question: "If the forgetting curve shows 50% retention after 1 day without review, and each review doubles the retention interval, after how many reviews will the material last 16 days?",
            formula: "Days retained = 1 × 2^(number of reviews)",
            _answer: 4,
            unit: "reviews",
            tolerance: 0,
            explanation: "Starting interval: 1 day. After 1 review: 2 days. After 2: 4 days. After 3: 8 days. After 4: 16 days. This is the principle behind spaced repetition systems (Anki, SuperMemo).",
            articleSlug: "cognitive-psych-memory-retention", tags: ["spaced repetition", "forgetting curve"]
        },
        {
            id: "cp-q011", part: 10, difficulty: "intermediate", type: "true-false",
            question: "The 'planning fallacy' causes people to consistently overestimate how long tasks will take.",
            _answer: false,
            explanation: "The planning fallacy (Kahneman & Tversky, 1979) causes people to UNDERESTIMATE time, costs, and risks while OVERESTIMATING benefits. We're optimistic planners — projects almost always take longer than predicted.",
            articleSlug: "cognitive-psych-time-perception", tags: ["planning fallacy", "time"]
        },
        {
            id: "cp-q012", part: 11, difficulty: "advanced", type: "ethical",
            question: "Should social media platforms use cognitive biases (variable rewards, social proof) to maximize engagement?",
            scenario: "Platforms like Instagram use intermittent reinforcement (variable reward schedule), social validation (likes), and loss aversion (streaks) — the same mechanisms as slot machines — to keep users scrolling.",
            options: [
                { label: "Yes — users choose to engage; it's entertainment like any other", framework: "Libertarian — individual freedom of choice" },
                { label: "No — exploiting cognitive vulnerabilities is inherently manipulative", framework: "Kantian — treat users as ends, not means" },
                { label: "Regulate with mandatory 'time spent' notifications and opt-out defaults", framework: "Paternalistic — protect from known harms" },
                { label: "Require ethical review boards for engagement features, like medical IRBs", framework: "Procedural — independent oversight" }
            ],
            _answer: 3,
            explanation: "Ethics review boards would apply existing bioethics principles to technology. When a design deliberately exploits cognitive vulnerabilities at scale, it parallels research ethics concerns — informed consent, harm prevention, and beneficence.",
            articleSlug: "cognitive-psych-persuasion-ethics", tags: ["dark patterns", "ethics", "persuasion"]
        },
        {
            id: "cp-q013", part: 12, difficulty: "intermediate", type: "code-output",
            question: "A psychology experiment shows participants 20 words. After a distraction task, they recall words. Which positions have highest recall?",
            code: "# Serial Position Effect\npositions = list(range(1, 21))\n# Primacy: first ~4 words remembered well\n# Recency: last ~4 words remembered well\n# Middle: poorest recall\n# What shape does the recall curve form?",
            _answer: "U-shape",
            acceptAlso: ["U shape", "U-shaped", "U shaped curve", "serial position curve"],
            explanation: "The serial position effect produces a U-shaped recall curve: high recall for first items (primacy effect — rehearsed into LTM) and last items (recency effect — still in STM), with a dip in the middle.",
            articleSlug: "cognitive-psych-memory-models", tags: ["serial position", "primacy", "recency"]
        },
        {
            id: "cp-q014", part: 13, difficulty: "advanced", type: "debug",
            question: "A researcher claims to have 'proven' that listening to Mozart makes you smarter. Find the flaw in their experimental design:",
            code: "Experiment:\n- Group A: Listen to Mozart for 10 min, then take IQ test\n- Group B: Sit in silence for 10 min, then take IQ test\n- Result: Group A scores 5 points higher\n- Conclusion: 'Mozart music increases intelligence'",
            options: [
                "Confound: arousal/mood — any stimulating activity would boost performance vs. boredom",
                "Sample size isn't mentioned — could be too small for significance",
                "IQ tests can't be affected by 10-minute interventions",
                "The researcher should have used a double-blind design"
            ],
            _answer: 0,
            explanation: "The 'Mozart Effect' confounds music with arousal. Controls should include other music, podcasts, or any engaging activity. The effect disappeared when studies used proper active controls — it's arousal, not Mozart specifically.",
            articleSlug: "cognitive-psych-research-methods", tags: ["confounds", "Mozart effect", "methodology"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// WRITE ALL QUIZZES
// ═══════════════════════════════════════════════════════════════════════════════
const allQuizzes = [systemDesign, cloudComputing, dataStructures, entrepreneurship, databaseMastery, protocolsMaster, cognitivePsych];

let success = 0;
allQuizzes.forEach(function(quiz) {
    if (writeQuiz(quiz)) {
        const types = [...new Set(quiz.questions.map(q => q.type))];
        console.log(`✓ ${quiz.series} — ${quiz.questions.length} questions (${types.length} types)`);
        success++;
    }
});

console.log(`\n═══ Generated ${success}/${allQuizzes.length} quizzes ═══`);
