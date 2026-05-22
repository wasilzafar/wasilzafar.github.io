// ============================================================
// IMO (International Mathematical Olympiad) — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['imo'] = {
    examName: 'IMO (International Mathematical Olympiad)',
    version: '2026',
    sections: [
        {
            id: 'imo-algebra',
            name: 'Algebra',
            type: 'compulsory',
            topics: [
                { id: 'alg-inequalities', title: 'Inequalities (AM-GM, Cauchy-Schwarz, Schur, SOS)', difficulty: 5, estimatedHours: 30, weight: 1.3, tags: ['algebra'] },
                { id: 'alg-functional', title: 'Functional Equations', difficulty: 5, estimatedHours: 24, weight: 1.3, tags: ['algebra'] },
                { id: 'alg-polynomials', title: 'Polynomials (Roots, Vieta\'s, Factorization)', difficulty: 4, estimatedHours: 18, tags: ['algebra'] },
                { id: 'alg-sequences', title: 'Sequences & Series (Recurrences, Generating Functions)', difficulty: 4, estimatedHours: 16, tags: ['algebra'] }
            ]
        },
        {
            id: 'imo-combinatorics',
            name: 'Combinatorics',
            type: 'compulsory',
            topics: [
                { id: 'comb-counting', title: 'Counting (Bijections, PIE, Double Counting)', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['combinatorics'] },
                { id: 'comb-graph', title: 'Graph Theory (Coloring, Ramsey, Extremal, Algorithms)', difficulty: 5, estimatedHours: 22, weight: 1.3, tags: ['combinatorics'] },
                { id: 'comb-games', title: 'Combinatorial Games & Strategy', difficulty: 4, estimatedHours: 14, tags: ['combinatorics'] },
                { id: 'comb-pigeonhole', title: 'Pigeonhole Principle & Extremal Principle', difficulty: 4, estimatedHours: 14, weight: 1.2, tags: ['combinatorics'] }
            ]
        },
        {
            id: 'imo-geometry',
            name: 'Geometry',
            type: 'compulsory',
            topics: [
                { id: 'geo-euclidean', title: 'Euclidean Geometry (Angles, Cyclic Quads, Power of a Point)', difficulty: 5, estimatedHours: 28, weight: 1.3, tags: ['geometry'] },
                { id: 'geo-transformations', title: 'Transformations (Inversion, Projective, Spiral Similarities)', difficulty: 5, estimatedHours: 22, weight: 1.2, tags: ['geometry'] },
                { id: 'geo-trigonometric', title: 'Trigonometric & Coordinate Methods', difficulty: 4, estimatedHours: 16, tags: ['geometry'] },
                { id: 'geo-constructions', title: 'Constructions & Locus Problems', difficulty: 4, estimatedHours: 12, tags: ['geometry'] }
            ]
        },
        {
            id: 'imo-number-theory',
            name: 'Number Theory',
            type: 'compulsory',
            topics: [
                { id: 'nt-divisibility', title: 'Divisibility & Modular Arithmetic', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['number-theory'] },
                { id: 'nt-primes', title: 'Prime Factorization & GCD/LCM', difficulty: 3, estimatedHours: 12, tags: ['number-theory'] },
                { id: 'nt-diophantine', title: 'Diophantine Equations', difficulty: 5, estimatedHours: 22, weight: 1.3, tags: ['number-theory'] },
                { id: 'nt-orders', title: 'Orders, Primitive Roots & Quadratic Residues', difficulty: 5, estimatedHours: 18, tags: ['number-theory'] },
                { id: 'nt-p-adic', title: 'p-adic Valuations & Lifting the Exponent', difficulty: 5, estimatedHours: 14, tags: ['number-theory'] }
            ]
        }
    ]
};
