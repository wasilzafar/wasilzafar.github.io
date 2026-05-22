// ============================================================
// IOI (International Olympiad in Informatics) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['ioi'] = {
    examName: 'IOI (International Olympiad in Informatics)',
    version: '2026',
    sections: [
        {
            id: 'ioi-algorithms',
            name: 'Algorithms & Data Structures',
            type: 'compulsory',
            topics: [
                { id: 'algo-sorting', title: 'Sorting, Searching & Binary Search', difficulty: 3, estimatedHours: 12, tags: ['algorithms'] },
                { id: 'algo-greedy', title: 'Greedy Algorithms & Exchange Arguments', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['algorithms'] },
                { id: 'algo-dp', title: 'Dynamic Programming (Knapsack, LIS, Bitmask, Tree DP)', difficulty: 5, estimatedHours: 40, weight: 1.3, tags: ['algorithms'] },
                { id: 'algo-divide', title: 'Divide & Conquer (CDQ, Merge Sort Tree)', difficulty: 4, estimatedHours: 14, tags: ['algorithms'] },
                { id: 'ds-segment', title: 'Segment Trees & BITs (Lazy Propagation, Persistent)', difficulty: 5, estimatedHours: 24, weight: 1.3, tags: ['data-structures'] },
                { id: 'ds-advanced', title: 'Advanced DS (Treaps, Splay Trees, Link-Cut Trees)', difficulty: 5, estimatedHours: 20, tags: ['data-structures'] }
            ]
        },
        {
            id: 'ioi-graph',
            name: 'Graph Algorithms',
            type: 'compulsory',
            topics: [
                { id: 'graph-traversal', title: 'BFS, DFS, Topological Sort, SCC', difficulty: 3, estimatedHours: 14, tags: ['graphs'] },
                { id: 'graph-shortest', title: 'Shortest Paths (Dijkstra, Bellman-Ford, Floyd-Warshall)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['graphs'] },
                { id: 'graph-mst', title: 'Minimum Spanning Trees & Network Flow', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['graphs'] },
                { id: 'graph-trees', title: 'Tree Algorithms (LCA, HLD, Euler Tour, Centroid Decomp)', difficulty: 5, estimatedHours: 22, weight: 1.3, tags: ['graphs'] },
                { id: 'graph-matching', title: 'Matching (Bipartite, Hungarian, Hopcroft-Karp)', difficulty: 4, estimatedHours: 14, tags: ['graphs'] }
            ]
        },
        {
            id: 'ioi-math',
            name: 'Mathematics for CP',
            type: 'compulsory',
            topics: [
                { id: 'math-number', title: 'Number Theory (Primes, Modular Arithmetic, CRT, Euler\'s Totient)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['math'] },
                { id: 'math-combinatorics', title: 'Combinatorics (P&C, PIE, Burnside, Catalan)', difficulty: 4, estimatedHours: 16, tags: ['math'] },
                { id: 'math-geometry', title: 'Computational Geometry (Convex Hull, Line Sweep, Half-Plane)', difficulty: 5, estimatedHours: 20, weight: 1.2, tags: ['math'] }
            ]
        },
        {
            id: 'ioi-strings',
            name: 'String Algorithms',
            type: 'compulsory',
            topics: [
                { id: 'str-hashing', title: 'String Hashing & KMP / Z-Function', difficulty: 3, estimatedHours: 12, tags: ['strings'] },
                { id: 'str-suffix', title: 'Suffix Arrays & Suffix Automaton', difficulty: 5, estimatedHours: 18, weight: 1.2, tags: ['strings'] },
                { id: 'str-aho', title: 'Aho-Corasick & Trie Structures', difficulty: 4, estimatedHours: 12, tags: ['strings'] }
            ]
        }
    ]
};
