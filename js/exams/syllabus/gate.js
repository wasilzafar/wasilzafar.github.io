// ============================================================
// GATE (Graduate Aptitude Test in Engineering) — CS/IT Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['gate'] = {
    examName: 'GATE — Computer Science & IT',
    version: '2026',
    sections: [
        {
            id: 'gate-engineering-math',
            name: 'Engineering Mathematics',
            type: 'compulsory',
            topics: [
                { id: 'math-discrete', title: 'Discrete Mathematics (Sets, Relations, Graph Theory, Combinatorics)', difficulty: 3, estimatedHours: 20, weight: 1.2, tags: ['math'] },
                { id: 'math-linear-algebra', title: 'Linear Algebra (Matrices, Eigenvalues, Vector Spaces)', difficulty: 3, estimatedHours: 14, tags: ['math'] },
                { id: 'math-calculus', title: 'Calculus (Limits, Integration, Differential Equations)', difficulty: 3, estimatedHours: 12, tags: ['math'] },
                { id: 'math-probability', title: 'Probability & Statistics', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['math'] }
            ]
        },
        {
            id: 'gate-digital-logic',
            name: 'Digital Logic & Computer Organization',
            type: 'compulsory',
            topics: [
                { id: 'dl-boolean', title: 'Boolean Algebra & Logic Gates', difficulty: 2, estimatedHours: 8, tags: ['digital'] },
                { id: 'dl-combinational', title: 'Combinational & Sequential Circuits', difficulty: 3, estimatedHours: 12, tags: ['digital'] },
                { id: 'co-architecture', title: 'Computer Architecture (Pipelining, Cache, Memory)', difficulty: 3, estimatedHours: 18, weight: 1.2, tags: ['architecture'] },
                { id: 'co-io', title: 'I/O Systems & Interfacing', difficulty: 2, estimatedHours: 8, tags: ['architecture'] }
            ]
        },
        {
            id: 'gate-programming',
            name: 'Programming & Data Structures',
            type: 'compulsory',
            topics: [
                { id: 'prog-c', title: 'C Programming (Pointers, Recursion, Structures)', difficulty: 3, estimatedHours: 16, tags: ['programming'] },
                { id: 'ds-arrays', title: 'Arrays, Linked Lists, Stacks, Queues', difficulty: 2, estimatedHours: 14, tags: ['data-structures'] },
                { id: 'ds-trees', title: 'Trees, BST, Heaps, Hashing', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['data-structures'] },
                { id: 'ds-graphs', title: 'Graphs (BFS, DFS, Shortest Path, MST)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['data-structures'] }
            ]
        },
        {
            id: 'gate-algorithms',
            name: 'Algorithms',
            type: 'compulsory',
            topics: [
                { id: 'algo-analysis', title: 'Asymptotic Analysis & Recurrences', difficulty: 3, estimatedHours: 12, tags: ['algorithms'] },
                { id: 'algo-sorting', title: 'Sorting & Searching Algorithms', difficulty: 2, estimatedHours: 10, tags: ['algorithms'] },
                { id: 'algo-greedy-dp', title: 'Greedy Algorithms & Dynamic Programming', difficulty: 4, estimatedHours: 20, weight: 1.3, tags: ['algorithms'] },
                { id: 'algo-np', title: 'NP-Completeness & Complexity Classes', difficulty: 4, estimatedHours: 12, tags: ['algorithms'] }
            ]
        },
        {
            id: 'gate-toc',
            name: 'Theory of Computation',
            type: 'compulsory',
            topics: [
                { id: 'toc-automata', title: 'Finite Automata & Regular Languages', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['theory'] },
                { id: 'toc-cfg', title: 'Context-Free Grammars & Pushdown Automata', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['theory'] },
                { id: 'toc-turing', title: 'Turing Machines & Decidability', difficulty: 4, estimatedHours: 12, tags: ['theory'] }
            ]
        },
        {
            id: 'gate-os',
            name: 'Operating Systems',
            type: 'compulsory',
            topics: [
                { id: 'os-process', title: 'Process Management & Scheduling', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['os'] },
                { id: 'os-sync', title: 'Synchronization & Deadlocks', difficulty: 3, estimatedHours: 12, weight: 1.2, tags: ['os'] },
                { id: 'os-memory', title: 'Memory Management (Paging, Segmentation, Virtual Memory)', difficulty: 3, estimatedHours: 14, weight: 1.3, tags: ['os'] },
                { id: 'os-file-io', title: 'File Systems & I/O Management', difficulty: 2, estimatedHours: 8, tags: ['os'] }
            ]
        },
        {
            id: 'gate-dbms',
            name: 'Databases',
            type: 'compulsory',
            topics: [
                { id: 'db-relational', title: 'Relational Model & SQL', difficulty: 2, estimatedHours: 12, weight: 1.2, tags: ['dbms'] },
                { id: 'db-normalization', title: 'Normalization & Functional Dependencies', difficulty: 3, estimatedHours: 14, weight: 1.3, tags: ['dbms'] },
                { id: 'db-transactions', title: 'Transactions, Concurrency Control, Recovery', difficulty: 3, estimatedHours: 12, tags: ['dbms'] },
                { id: 'db-indexing', title: 'Indexing & File Organization', difficulty: 3, estimatedHours: 10, tags: ['dbms'] }
            ]
        },
        {
            id: 'gate-networks',
            name: 'Computer Networks',
            type: 'compulsory',
            topics: [
                { id: 'net-layers', title: 'OSI/TCP-IP Model & Application Layer', difficulty: 2, estimatedHours: 10, tags: ['networks'] },
                { id: 'net-transport', title: 'Transport Layer (TCP, UDP, Congestion Control)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['networks'] },
                { id: 'net-network', title: 'Network Layer (IP, Routing, Subnetting)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['networks'] },
                { id: 'net-datalink', title: 'Data Link Layer & MAC Protocols', difficulty: 3, estimatedHours: 10, tags: ['networks'] }
            ]
        },
        {
            id: 'gate-compiler',
            name: 'Compiler Design',
            type: 'compulsory',
            topics: [
                { id: 'comp-lexical', title: 'Lexical Analysis & Parsing (LL, LR)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['compiler'] },
                { id: 'comp-syntax', title: 'Syntax-Directed Translation & Intermediate Code', difficulty: 3, estimatedHours: 12, tags: ['compiler'] },
                { id: 'comp-optimization', title: 'Code Optimization & Generation', difficulty: 3, estimatedHours: 10, tags: ['compiler'] }
            ]
        },
        {
            id: 'gate-aptitude',
            name: 'General Aptitude',
            type: 'compulsory',
            topics: [
                { id: 'apt-verbal', title: 'Verbal Ability (Grammar, Comprehension, Vocabulary)', difficulty: 2, estimatedHours: 8, weight: 0.8, tags: ['aptitude'] },
                { id: 'apt-quant', title: 'Quantitative Aptitude (Numbers, Geometry, Data Interpretation)', difficulty: 2, estimatedHours: 10, weight: 0.8, tags: ['aptitude'] }
            ]
        }
    ]
};
