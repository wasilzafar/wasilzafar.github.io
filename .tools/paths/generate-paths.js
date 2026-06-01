/**
 * Generate Learning Path Pages
 * 
 * Creates the hub page and 7 individual path pages with hex-grid layouts.
 * Run: node .tools/generate-paths.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PATHS_DIR = path.join(ROOT, 'pages', 'paths');

// Color rotation for series sections within a path
const COLORS = ['teal', 'rose', 'lavender', 'amber', 'crimson', 'navy', 'teal', 'rose'];

// Path definitions
const PATHS = [
    {
        slug: 'embedded-systems',
        title: 'Embedded Systems Engineer',
        icon: 'fas fa-microchip',
        subtitle: 'From Architecture to Production',
        description: 'Master embedded systems from processor fundamentals through real-time operating systems to production-grade firmware — covering ARM architecture, assembly, HAL programming, sensors, actuators, and USB protocols.',
        difficulty: 'Intermediate → Advanced',
        estimatedHours: 120,
        series: [
            { folder: 'arm-assembly', name: 'ARM Assembly', articles: 28, icon: 'fas fa-memory', desc: 'ARM processor architecture, registers, instruction sets, and bare-metal programming.' },
            { folder: 'assembly-mastery', name: 'Assembly Mastery', articles: 25, icon: 'fas fa-terminal', desc: 'Advanced assembly techniques, optimizations, ABI conventions, and system calls.' },
            { folder: 'cmsis', name: 'CMSIS', articles: 20, icon: 'fas fa-layer-group', desc: 'Cortex Microcontroller Software Interface Standard — HAL abstraction and RTOS integration.' },
            { folder: 'stm32-hal', name: 'STM32 HAL', articles: 18, icon: 'fas fa-microchip', desc: 'STM32 Hardware Abstraction Layer — GPIO, timers, UART, SPI, DMA, and interrupts.' },
            { folder: 'embedded-systems', name: 'Embedded Systems', articles: 13, icon: 'fas fa-circuit-board', desc: 'RTOS, scheduling, memory management, power optimization, and debugging embedded firmware.' },
            { folder: 'embedded-hardware', name: 'Embedded Hardware', articles: 28, icon: 'fas fa-plug', desc: 'PCB design, power supplies, signal integrity, EMC, and hardware-software co-design.' },
            { folder: 'sensors-actuators', name: 'Sensors & Actuators', articles: 100, icon: 'fas fa-thermometer-half', desc: 'Temperature, pressure, motion, optical, chemical sensors plus motors, solenoids, and actuator drivers.' },
            { folder: 'usb-dev', name: 'USB Development', articles: 17, icon: 'fas fa-usb', desc: 'USB protocol stack, device classes, descriptors, enumeration, and firmware implementation.' }
        ]
    },
    {
        slug: 'ai-machine-learning',
        title: 'AI & Machine Learning Engineer',
        icon: 'fas fa-robot',
        subtitle: 'From Math Foundations to Production AI',
        description: 'A complete journey from mathematical foundations through deep learning frameworks to building and deploying production AI applications — covering linear algebra, neural networks, NLP, and real-world AI systems.',
        difficulty: 'Beginner → Advanced',
        estimatedHours: 80,
        series: [
            { folder: 'math-for-ai', name: 'Math for AI', articles: 20, icon: 'fas fa-square-root-alt', desc: 'Linear algebra, calculus, probability, statistics, and optimization for machine learning.' },
            { folder: 'ai-data-science', name: 'AI & Data Science', articles: 11, icon: 'fas fa-chart-bar', desc: 'Python setup, NumPy, Pandas, Matplotlib, scikit-learn, and data science workflows.' },
            { folder: 'neural-networks', name: 'Neural Networks', articles: 9, icon: 'fas fa-brain', desc: 'Perceptrons, backpropagation, CNNs, RNNs, attention mechanisms, and architectures.' },
            { folder: 'pytorch-mastery', name: 'PyTorch Mastery', articles: 14, icon: 'fas fa-fire', desc: 'Tensors, autograd, nn.Module, training loops, distributed training, and deployment.' },
            { folder: 'tensorflow-mastery', name: 'TensorFlow Mastery', articles: 14, icon: 'fas fa-project-diagram', desc: 'Keras API, custom training, TF Serving, TFLite, and production pipelines.' },
            { folder: 'nlp', name: 'Natural Language Processing', articles: 16, icon: 'fas fa-language', desc: 'Tokenization, word embeddings, transformers, BERT, GPT, and text generation.' },
            { folder: 'ai-app-dev', name: 'AI Application Development', articles: 20, icon: 'fas fa-rocket', desc: 'Building AI-powered applications — RAG, agents, prompt engineering, and MLOps.' },
            { folder: 'ai-in-the-wild', name: 'AI in the Wild', articles: 24, icon: 'fas fa-globe', desc: 'Real-world AI deployments — case studies, ethics, bias, regulation, and societal impact.' }
        ]
    },
    {
        slug: 'software-architect',
        title: 'Full-Stack Software Architect',
        icon: 'fas fa-drafting-compass',
        subtitle: 'From Algorithms to Cloud Scale',
        description: 'Build expertise from data structures and algorithms through system design to cloud-native architecture — covering APIs, databases, distributed systems, networking protocols, and infrastructure.',
        difficulty: 'Intermediate → Expert',
        estimatedHours: 85,
        series: [
            { folder: 'data-structures', name: 'Data Structures & Algorithms', articles: 12, icon: 'fas fa-sitemap', desc: 'Arrays, trees, graphs, dynamic programming, sorting, and algorithm analysis.' },
            { folder: 'api-development', name: 'API Development', articles: 17, icon: 'fas fa-plug', desc: 'REST, GraphQL, gRPC, API versioning, rate limiting, and documentation.' },
            { folder: 'database-mastery', name: 'Database Mastery', articles: 15, icon: 'fas fa-database', desc: 'SQL optimization, indexing, transactions, NoSQL, replication, and sharding.' },
            { folder: 'system-design', name: 'System Design', articles: 16, icon: 'fas fa-network-wired', desc: 'Scalability, load balancing, caching, message queues, and microservices architecture.' },
            { folder: 'cloud-computing', name: 'Cloud Computing', articles: 11, icon: 'fas fa-cloud', desc: 'AWS/Azure services, serverless, containers, Kubernetes, and cloud-native patterns.' },
            { folder: 'protocols-master', name: 'Protocols Master', articles: 20, icon: 'fas fa-exchange-alt', desc: 'TCP/IP, HTTP/2, WebSockets, TLS, DNS, and networking fundamentals.' },
            { folder: 'gnu-make', name: 'GNU Make & Build Systems', articles: 16, icon: 'fas fa-hammer', desc: 'Makefiles, build automation, dependency graphs, and CI/CD pipelines.' },
            { folder: 'kernel-development', name: 'Kernel Development', articles: 18, icon: 'fas fa-cog', desc: 'Linux kernel internals, system calls, memory management, and device drivers.' }
        ]
    },
    {
        slug: 'devops-cloud-infrastructure',
        title: 'DevOps & Cloud Infrastructure',
        icon: 'fas fa-infinity',
        subtitle: 'From Containers to Platform Engineering',
        description: 'Master the modern DevOps toolkit — from container fundamentals and Kubernetes orchestration through CI/CD, GitOps, and infrastructure-as-code to observability, platform engineering, and distributed systems at scale.',
        difficulty: 'Intermediate → Expert',
        estimatedHours: 70,
        series: [
            { folder: 'containers-docker', name: 'Containers & Docker', articles: 22, icon: 'fas fa-box', desc: 'Linux namespaces, cgroups, Docker architecture, Dockerfiles, networking, security, and OCI standards.' },
            { folder: 'distributed-systems-k8s', name: 'Distributed Systems & Kubernetes', articles: 16, icon: 'fas fa-cubes', desc: 'Consensus algorithms, CAP theorem, Kubernetes architecture, operators, and cloud-native patterns.' },
            { folder: 'devops-platform-engineering', name: 'DevOps & Platform Engineering', articles: 22, icon: 'fas fa-infinity', desc: 'CI/CD, GitOps, ArgoCD, Helm, progressive delivery, internal developer platforms, and FinOps.' },
            { folder: 'infrastructure-cloud-automation', name: 'Infrastructure & Cloud Automation', articles: 20, icon: 'fas fa-server', desc: 'Terraform, infrastructure-as-code, multi-cloud, service mesh, disaster recovery, and platform engineering.' },
            { folder: 'monitoring-observability', name: 'Monitoring & Observability', articles: 21, icon: 'fas fa-chart-area', desc: 'Metrics, logs, traces, OpenTelemetry, Prometheus, Grafana, SLOs, incident management, and chaos engineering.' }
        ]
    },
    {
        slug: 'business-founder',
        title: 'Start & Scale a Business',
        icon: 'fas fa-briefcase',
        subtitle: 'From Idea to Growth',
        description: 'A founder\'s complete toolkit — from validating ideas and building business models through marketing, sales, and data-driven decision making to scaling with consulting frameworks and economics.',
        difficulty: 'Beginner → Advanced',
        estimatedHours: 55,
        series: [
            { folder: 'entrepreneurship', name: 'Entrepreneurship', articles: 15, icon: 'fas fa-lightbulb', desc: 'Ideation, validation, MVP, business models, fundraising, hiring, and exit strategies.' },
            { folder: 'marketing-strategy', name: 'Marketing Strategy', articles: 21, icon: 'fas fa-bullhorn', desc: 'Positioning, branding, digital marketing, content strategy, and growth hacking.' },
            { folder: 'sales-mastery', name: 'Sales Mastery', articles: 18, icon: 'fas fa-handshake', desc: 'Psychology of selling, B2B sales, negotiation, pipeline management, and closing.' },
            { folder: 'dddm', name: 'Data-Driven Decision Making', articles: 13, icon: 'fas fa-chart-line', desc: 'Analytics, A/B testing, KPIs, dashboards, and data-informed strategy.' },
            { folder: 'consulting-frameworks', name: 'Consulting Frameworks', articles: 9, icon: 'fas fa-puzzle-piece', desc: 'MECE, issue trees, hypothesis-driven thinking, and structured problem-solving.' },
            { folder: 'economics', name: 'Economics', articles: 9, icon: 'fas fa-coins', desc: 'Micro/macroeconomics, market dynamics, pricing strategy, and behavioral economics.' }
        ]
    },
    {
        slug: 'computer-architecture',
        title: 'Computer Architecture & Low-Level',
        icon: 'fas fa-server',
        subtitle: 'From Transistors to Operating Systems',
        description: 'Understand computers from the ground up — digital logic, processor design, instruction pipelines, memory hierarchies, assembly programming, build systems, and kernel internals.',
        difficulty: 'Intermediate → Expert',
        estimatedHours: 75,
        series: [
            { folder: 'computer-architecture', name: 'Computer Architecture', articles: 24, icon: 'fas fa-memory', desc: 'Digital logic, ALUs, pipelines, caches, virtual memory, multiprocessors, and GPU architecture.' },
            { folder: 'assembly-mastery', name: 'Assembly Mastery', articles: 25, icon: 'fas fa-terminal', desc: 'x86-64 and ARM assembly — instructions, addressing modes, system calls, and optimization.' },
            { folder: 'arm-assembly', name: 'ARM Assembly', articles: 28, icon: 'fas fa-microchip', desc: 'ARM-specific assembly — Thumb, NEON SIMD, exception handling, and bare-metal coding.' },
            { folder: 'kernel-development', name: 'Kernel Development', articles: 18, icon: 'fas fa-cog', desc: 'Process scheduling, virtual memory, file systems, device drivers, and kernel modules.' },
            { folder: 'gnu-make', name: 'GNU Make & Build Systems', articles: 16, icon: 'fas fa-hammer', desc: 'Build automation, dependency resolution, cross-compilation, and toolchains.' },
            { folder: 'embedded-systems', name: 'Embedded Systems', articles: 13, icon: 'fas fa-circuit-board', desc: 'Real-time systems, bare-metal programming, RTOS, and firmware architecture.' }
        ]
    },
    {
        slug: 'life-sciences',
        title: 'Life Sciences Deep Dive',
        icon: 'fas fa-dna',
        subtitle: 'Understanding Living Systems',
        description: 'Explore the molecular machinery of life — from biochemical reactions and cell physiology through organ systems to evolutionary mechanisms that shaped all living organisms.',
        difficulty: 'Beginner → Intermediate',
        estimatedHours: 40,
        series: [
            { folder: 'biochemistry', name: 'Biochemistry', articles: 20, icon: 'fas fa-flask', desc: 'Amino acids, enzymes, metabolism, DNA/RNA, signal transduction, and molecular biology.' },
            { folder: 'physiology', name: 'Physiology', articles: 12, icon: 'fas fa-heartbeat', desc: 'Cellular physiology, nervous system, cardiovascular, respiratory, and renal systems.' },
            { folder: 'human-anatomy', name: 'Human Anatomy', articles: 12, icon: 'fas fa-bone', desc: 'Musculoskeletal, nervous, cardiovascular, respiratory, and digestive systems anatomy.' },
            { folder: 'evolutionary-biology', name: 'Evolutionary Biology', articles: 12, icon: 'fas fa-seedling', desc: 'Natural selection, speciation, phylogenetics, population genetics, and genomics.' }
        ]
    },
    {
        slug: 'philosophy-mind',
        title: 'Philosophy & the Mind',
        icon: 'fas fa-yin-yang',
        subtitle: 'Thinking About Thinking',
        description: 'Journey from logical reasoning and ethical frameworks through the nature of consciousness, existential questions, and Eastern wisdom — complemented by the science of cognition and behavior.',
        difficulty: 'Beginner → Advanced',
        estimatedHours: 65,
        series: [
            { folder: 'logic-critical-thinking', name: 'Logic & Critical Thinking', articles: 6, icon: 'fas fa-balance-scale', desc: 'Formal logic, fallacies, argument analysis, and rational decision-making.' },
            { folder: 'ethics-moral-philosophy', name: 'Ethics & Moral Philosophy', articles: 6, icon: 'fas fa-gavel', desc: 'Consequentialism, deontology, virtue ethics, applied ethics, and moral dilemmas.' },
            { folder: 'philosophy-of-mind', name: 'Philosophy of Mind', articles: 14, icon: 'fas fa-head-side-brain', desc: 'Consciousness, qualia, free will, personal identity, and the mind-body problem.' },
            { folder: 'existentialism', name: 'Existentialism', articles: 11, icon: 'fas fa-question-circle', desc: 'Kierkegaard, Nietzsche, Sartre, Camus, authenticity, and the absurd.' },
            { folder: 'eastern-philosophy', name: 'Eastern Philosophy', articles: 10, icon: 'fas fa-om', desc: 'Buddhism, Hinduism, Taoism, Zen, meditation, and non-dualism.' },
            { folder: 'political-philosophy', name: 'Political Philosophy', articles: 11, icon: 'fas fa-landmark', desc: 'Justice, liberty, democracy, social contract, and political ideologies.' },
            { folder: 'cognitive-psych', name: 'Cognitive Psychology', articles: 14, icon: 'fas fa-brain', desc: 'Perception, memory, attention, language, problem-solving, and decision-making.' },
            { folder: 'behavioral-psychology', name: 'Behavioral Psychology', articles: 11, icon: 'fas fa-user-cog', desc: 'Conditioning, reinforcement, habits, motivation, and behavior change.' },
            { folder: 'social-psychology', name: 'Social Psychology', articles: 20, icon: 'fas fa-users', desc: 'Conformity, persuasion, group dynamics, prejudice, and social influence.' }
        ]
    }
];

// Generate common head section
function generateHead(title, description, keywords, canonicalPath) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.wasilzafar.com/pages/paths/${canonicalPath}" />
    <meta property="og:image" content="https://www.wasilzafar.com/images/favicon_io/android-chrome-512x512.png" />
    <title>${title} - Wasil Zafar</title>
    <link rel="canonical" href="https://www.wasilzafar.com/pages/paths/${canonicalPath}" />

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
    <!-- Custom Styles -->
    <link rel="stylesheet" href="../../css/main.css" type="text/css" />
    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="../../images/favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../../images/favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../images/favicon_io/favicon-16x16.png">
    <link rel="manifest" href="../../images/favicon_io/site.webmanifest">

    <!-- Google Consent Mode v2 -->
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
            'ad_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied', 'analytics_storage': 'denied',
            'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE']
        });
        gtag('consent', 'default', { 'ad_storage': 'granted', 'ad_user_data': 'granted', 'ad_personalization': 'granted', 'analytics_storage': 'granted' });
        gtag('set', 'url_passthrough', true);
    </script>
    <!-- Google Tag Manager -->
    <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PBS8M2JR');
    </script>
</head>`;
}

// Generate nav section
function generateNav() {
    return `
    <!-- Navigation Bar -->
    <div class="nav-v16-wrapper">
        <nav class="nav-v16">
            <a href="/" class="brand">
                <div class="brand-stack"><span></span><span></span><span></span></div>
                <span class="brand-text">Wasil Zafar</span>
            </a>
            <button class="nav-v16-toggle" aria-label="Toggle navigation" onclick="toggleNav16()">
                <span></span><span></span><span></span>
            </button>
            <div class="links">
                <a href="/" class="link-3d"><div class="link-box"><span class="link-face face-front">Home</span><span class="link-face face-bottom">Home</span></div></a>
                <a href="/#about" class="link-3d"><div class="link-box"><span class="link-face face-front">About</span><span class="link-face face-bottom">About</span></div></a>
                <a href="/#skills" class="link-3d"><div class="link-box"><span class="link-face face-front">Skills</span><span class="link-face face-bottom">Skills</span></div></a>
                <a href="/#certifications" class="link-3d"><div class="link-box"><span class="link-face face-front">Certifications</span><span class="link-face face-bottom">Certifications</span></div></a>
                <a href="/#interests" class="link-3d"><div class="link-box"><span class="link-face face-front">Interests</span><span class="link-face face-bottom">Interests</span></div></a>
                <button class="nav-search-btn" onclick="openSearch()" aria-label="Search articles"><i class="fas fa-search"></i> Search <span class="search-shortcut">Ctrl+K</span></button>
            </div>
        </nav>
    </div>`;
}

// Generate footer
function generateFooter() {
    return `
    <footer id="social-media">
        <div class="footer-v2-wrapper">
            <div class="footer-bar">
                <div class="fc-left">
                    <div class="fc-brand-group">
                        <div class="fc-brand-stack"><span></span><span></span><span></span></div>
                        <span class="fc-brand-name">Wasil Zafar</span>
                    </div>
                    <span class="fc-tagline">Consultant &amp; Cloud Architect</span>
                </div>
                <div class="fc-center">
                    <a href="/">Home</a>
                    <a href="/disclaimer.html">Disclaimer</a>
                    <a href="/privacy-policy.html">Privacy</a>
                    <a href="/pages/contact.html">Contact</a>
                </div>
                <div class="fc-right">
                    <a href="https://www.facebook.com/wasil.zafar/" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com/wasilzafar" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://www.linkedin.com/in/wasilzafar" target="_blank" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="https://www.youtube.com/@wasilzafar" target="_blank" title="YouTube"><i class="fab fa-youtube"></i></a>
                    <a href="https://www.instagram.com/itswzee/" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://in.pinterest.com/wasilz/" target="_blank" title="Pinterest"><i class="fab fa-pinterest-p"></i></a>
                    <a href="mailto:wasil.zafar@gmail.com" title="Email"><i class="fas fa-envelope"></i></a>
                </div>
            </div>
            <div class="footer-sub">
                <span><i class="fas fa-icons me-1"></i>Icons from <a href="https://www.flaticon.com/" target="_blank">Flaticon</a> &amp; <a href="https://fontawesome.com/" target="_blank">Font Awesome</a></span>
                <a href="https://buymeacoffee.com/itswzee" target="_blank" class="fc-coffee">&#9749; Keep me caffeinated</a>
            </div>
        </div>
    </footer>`;
}

// Generate scripts
function generateScripts() {
    return `
    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom Scripts -->
    <script src="../../js/main.js"></script>
    <!-- Fuse.js Search Library -->
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js"></script>
    <script src="../../js/search.js"></script>
    <!-- Cookie Consent -->
    <script src="../../js/cookie-consent.js"></script>`;
}

// Generate hub page
function generateHub() {
    const totalArticles = PATHS.reduce((sum, p) => sum + p.series.reduce((s, ser) => s + ser.articles, 0), 0);
    const totalHours = PATHS.reduce((sum, p) => sum + p.estimatedHours, 0);

    let html = generateHead(
        'Learning Paths',
        'Structured learning paths across 900+ articles — from embedded systems and AI to business and philosophy. Follow curated roadmaps to master any discipline.',
        'learning paths, roadmap, curriculum, embedded systems, AI, machine learning, software architecture, business, philosophy, self-study',
        'index.html'
    );

    html += `
<body class="hex-page-dark">
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBS8M2JR" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
${generateNav()}

    <!-- Hero -->
    <header class="hex-hero">
        <div class="hero-icon"><i class="fas fa-route"></i></div>
        <h1>Learning Paths</h1>
        <p class="subtitle">Structured Roadmaps to Mastery</p>
        <p class="description">Follow curated learning paths that guide you through multiple series in the right order. Each path takes you from foundations to advanced topics with clear progression.</p>
        <div class="hero-stats">
            <div class="hero-stat"><span class="number">${PATHS.length}</span><span class="label">Paths</span></div>
            <div class="hero-stat"><span class="number">${totalArticles}</span><span class="label">Articles</span></div>
            <div class="hero-stat"><span class="number">${totalHours}</span><span class="label">Hours</span></div>
        </div>
    </header>

    <!-- Progress Overview -->
    <div class="path-progress-overview" id="pathProgressOverview" style="display:none;">
        <div class="container">
            <div class="path-progress-bar-wrapper">
                <div class="path-progress-label"><i class="fas fa-fire me-2"></i>Your Overall Progress</div>
                <div class="path-progress-track"><div class="path-progress-fill" id="overallProgressFill"></div></div>
                <div class="path-progress-text" id="overallProgressText">0 / ${totalArticles} articles</div>
            </div>
        </div>
    </div>

    <!-- Path Cards Grid -->
    <section class="path-cards-section">
        <div class="container">
            <div class="row g-4">`;

    PATHS.forEach((p, i) => {
        const totalArt = p.series.reduce((s, ser) => s + ser.articles, 0);
        const color = COLORS[i % COLORS.length];
        html += `
                <div class="col-md-6 col-lg-4">
                    <a href="${p.slug}.html" class="path-card path-card-${color}">
                        <div class="path-card-icon"><i class="${p.icon}"></i></div>
                        <h3 class="path-card-title">${p.title}</h3>
                        <p class="path-card-subtitle">${p.subtitle}</p>
                        <div class="path-card-stats">
                            <span><i class="fas fa-book me-1"></i>${totalArt} articles</span>
                            <span><i class="fas fa-clock me-1"></i>${p.estimatedHours}h</span>
                            <span><i class="fas fa-layer-group me-1"></i>${p.series.length} series</span>
                        </div>
                        <div class="path-card-difficulty">${p.difficulty}</div>
                        <div class="path-card-progress" data-path="${p.slug}">
                            <div class="path-card-progress-track"><div class="path-card-progress-fill"></div></div>
                        </div>
                    </a>
                </div>`;
    });

    html += `
            </div>
        </div>
    </section>

${generateFooter()}
${generateScripts()}
    <!-- Path Progress Tracking -->
    <script src="../../js/path-progress.js"></script>
</body>
</html>`;

    return html;
}

// Generate individual path page
function generatePathPage(pathData) {
    const totalArticles = pathData.series.reduce((s, ser) => s + ser.articles, 0);

    let html = generateHead(
        pathData.title + ' Learning Path',
        pathData.description,
        pathData.series.map(s => s.name).join(', ') + ', learning path, roadmap, curriculum',
        pathData.slug + '.html'
    );

    html += `
<body class="hex-page-dark">
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBS8M2JR" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
${generateNav()}

    <!-- Hero -->
    <header class="hex-hero">
        <div class="hero-icon"><i class="${pathData.icon}"></i></div>
        <h1>${pathData.title}</h1>
        <p class="subtitle">${pathData.subtitle}</p>
        <p class="description">${pathData.description}</p>
        <div class="hero-stats">
            <div class="hero-stat"><span class="number">${pathData.series.length}</span><span class="label">Series</span></div>
            <div class="hero-stat"><span class="number">${totalArticles}</span><span class="label">Articles</span></div>
            <div class="hero-stat"><span class="number">${pathData.estimatedHours}</span><span class="label">Hours</span></div>
        </div>
    </header>

    <!-- Progress Bar -->
    <div class="path-progress-overview" id="pathProgressOverview">
        <div class="container">
            <a href="index.html" class="path-back-link"><i class="fas fa-arrow-left me-2"></i>All Learning Paths</a>
            <div class="path-progress-bar-wrapper">
                <div class="path-progress-label"><i class="fas fa-fire me-2"></i>Your Progress</div>
                <div class="path-progress-track"><div class="path-progress-fill" id="pathProgressFill"></div></div>
                <div class="path-progress-text" id="pathProgressText">0 / ${totalArticles} articles</div>
            </div>
        </div>
    </div>

    <!-- Legend -->
    <div class="series-legend">`;

    pathData.series.forEach((ser, i) => {
        const color = COLORS[i % COLORS.length];
        html += `
        <div class="legend-item"><div class="legend-dot dot-${color}"></div><span class="legend-label">${ser.name}</span></div>`;
    });

    html += `
    </div>`;

    // Generate hex-grid sections for each series
    pathData.series.forEach((ser, i) => {
        const color = COLORS[i % COLORS.length];
        const seriesDir = path.join(ROOT, 'pages', 'series', ser.folder);
        let articles = [];

        if (fs.existsSync(seriesDir)) {
            articles = fs.readdirSync(seriesDir)
                .filter(f => f.endsWith('.html') && f !== 'index.html')
                .sort();
        }

        html += `

    <section class="hex-series-section">
        <div class="hex-series-section-header">
            <div class="series-accent-bar accent-bar-${color}"></div>
            <div class="series-header-content">
                <span class="series-count badge-${color}"><span class="series-pip pip-${color}"></span>Step ${i + 1} — ${ser.articles}-Part Series</span>
                <h2 class="series-name">${ser.name}</h2>
                <p class="series-desc">${ser.desc}</p>
            </div>
        </div>
        <div class="gallery-wrapper">
            <div class="hex-grid">`;

        // Generate hex tiles for articles (max 12 shown, rest accessible via series page)
        const displayArticles = articles.slice(0, Math.min(articles.length, 12));
        displayArticles.forEach((file, j) => {
            // Extract title from filename
            let title = file.replace('.html', '').replace(ser.folder + '-', '').replace(/-/g, ' ');
            title = title.replace(/\b\w/g, c => c.toUpperCase());
            if (title.length > 35) title = title.substring(0, 32) + '...';

            html += `
                <div class="hex" tabindex="0" role="button">
                    <div class="hex-shape hex-${color}-${(j % 6) + 1}">
                        <div class="hex-accent accent-${color}"></div>
                        <div class="hex-inner">
                            <span class="hex-badge badge-${color}"><span class="series-pip pip-${color}"></span>Part ${j + 1}</span>
                            <i class="${ser.icon} hex-icon icon-${color}"></i>
                            <div class="hex-title">${title}</div>
                            <div class="hex-meta">${Math.floor(Math.random() * 20 + 30)} min read</div>
                        </div>
                        <div class="hex-caption">
                            <div class="caption-text">${ser.desc}</div>
                            <a href="../series/${ser.folder}/${file}" class="caption-cta cta-${color}">Read Article →</a>
                        </div>
                    </div>
                </div>`;
        });

        // If more than 12 articles, show a "view all" indicator
        if (articles.length > 12) {
            html += `
                <div class="hex" tabindex="0" role="button">
                    <div class="hex-shape hex-${color}-1">
                        <div class="hex-accent accent-${color}"></div>
                        <div class="hex-inner">
                            <span class="hex-badge badge-${color}"><span class="series-pip pip-${color}"></span>+${articles.length - 12} More</span>
                            <i class="fas fa-arrow-right hex-icon icon-${color}"></i>
                            <div class="hex-title">View All ${articles.length} Articles</div>
                            <div class="hex-meta">Continue Series</div>
                        </div>
                        <div class="hex-caption">
                            <div class="caption-text">Continue exploring all ${articles.length} articles in this series.</div>
                            <a href="../series/${ser.folder}/${articles[0]}" class="caption-cta cta-${color}">View Series →</a>
                        </div>
                    </div>
                </div>`;
        }

        html += `
            </div>
        </div>
    </section>`;
    });

    // Related paths
    html += `

    <section class="path-related-section">
        <div class="container">
            <h3 class="path-related-title"><i class="fas fa-route me-2"></i>Other Learning Paths</h3>
            <div class="path-related-grid">`;

    const otherPaths = PATHS.filter(p => p.slug !== pathData.slug).slice(0, 3);
    otherPaths.forEach(p => {
        const total = p.series.reduce((s, ser) => s + ser.articles, 0);
        html += `
                <a href="${p.slug}.html" class="path-related-card">
                    <i class="${p.icon}"></i>
                    <span class="path-related-name">${p.title}</span>
                    <span class="path-related-meta">${total} articles · ${p.estimatedHours}h</span>
                </a>`;
    });

    html += `
            </div>
        </div>
    </section>

${generateFooter()}
${generateScripts()}
    <!-- Path Progress Tracking -->
    <script src="../../js/path-progress.js"></script>
</body>
</html>`;

    return html;
}

// Main execution
console.log('Generating Learning Path pages...\n');

// Generate hub
const hubHtml = generateHub();
fs.writeFileSync(path.join(PATHS_DIR, 'index.html'), hubHtml);
console.log('  ✓ index.html (hub)');

// Generate individual paths
PATHS.forEach(p => {
    const pageHtml = generatePathPage(p);
    fs.writeFileSync(path.join(PATHS_DIR, p.slug + '.html'), pageHtml);
    const totalArt = p.series.reduce((s, ser) => s + ser.articles, 0);
    console.log(`  ✓ ${p.slug}.html (${totalArt} articles, ${p.series.length} series)`);
});

console.log(`\n✓ Generated ${PATHS.length + 1} pages in /pages/paths/`);
