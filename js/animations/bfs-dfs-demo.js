/**
 * BFS vs DFS Graph Traversal — Interactive Step-Through Demo
 * Uses TechDiagrams framework for animated visualization.
 * Embedded in data-structures/dsa-graphs-dp-greedy-backtracking.html
 */
(function() {
    'use strict';

    // ─── Graph Layout (6 nodes, undirected) ─────────────────────────────────
    var NODES = [
        { id: 'A', type: 'circle', x: 300, y: 60, r: 22, label: 'A', sublabel: '' },
        { id: 'B', type: 'circle', x: 160, y: 170, r: 22, label: 'B', sublabel: '' },
        { id: 'C', type: 'circle', x: 440, y: 170, r: 22, label: 'C', sublabel: '' },
        { id: 'D', type: 'circle', x: 100, y: 320, r: 22, label: 'D', sublabel: '' },
        { id: 'E', type: 'circle', x: 300, y: 320, r: 22, label: 'E', sublabel: '' },
        { id: 'F', type: 'circle', x: 500, y: 320, r: 22, label: 'F', sublabel: '' }
    ];

    var EDGES = [
        { id: 'e-AB', type: 'line', x1: 300, y1: 82, x2: 160, y2: 148 },
        { id: 'e-AC', type: 'line', x1: 300, y1: 82, x2: 440, y2: 148 },
        { id: 'e-BD', type: 'line', x1: 160, y1: 192, x2: 100, y2: 298 },
        { id: 'e-BE', type: 'line', x1: 160, y1: 192, x2: 300, y2: 298 },
        { id: 'e-CE', type: 'line', x1: 440, y1: 192, x2: 300, y2: 298 },
        { id: 'e-CF', type: 'line', x1: 440, y1: 192, x2: 500, y2: 298 }
    ];

    // Queue/Stack display
    var QUEUE_LABEL = { id: 'queueLabel', type: 'badge', x: 300, y: 420, width: 200, height: 20, text: '' };

    var ALL_ELEMENTS = EDGES.concat(NODES).concat([QUEUE_LABEL]);

    // ─── Theme ──────────────────────────────────────────────────────────────
    var THEME = {
        unvisited: '#5a6e82',
        current: '#c4873b',
        visited: '#3B9797',
        queued: '#16476A'
    };

    // ─── Helper ─────────────────────────────────────────────────────────────
    function snap(states, queueText) {
        var s = {};
        ['A', 'B', 'C', 'D', 'E', 'F'].forEach(function(id) {
            var st = (states && states[id]) || 'unvisited';
            s[id] = { fill: THEME[st], sublabel: st === 'current' ? '← current' : (st === 'visited' ? '✓' : '') };
        });
        s.queueLabel = { text: queueText || '', opacity: queueText ? 1 : 0 };
        return s;
    }

    // ─── BFS Scenes ─────────────────────────────────────────────────────────
    var scenes = [
        {
            title: 'BFS: Start at Node A',
            desc: 'Breadth-First Search starts by enqueueing the source node <strong>A</strong> and marking it as visited. BFS uses a <strong>queue</strong> (FIFO) — it explores all neighbors at the current depth before moving deeper.',
            time: 'Queue: [A]',
            snapshot: snap({ A: 'current' }, 'Queue: [A]')
        },
        {
            title: 'BFS: Visit A → Enqueue B, C',
            desc: 'Dequeue <strong>A</strong>, visit it. Enqueue all unvisited neighbors: <strong>B</strong> and <strong>C</strong>. BFS guarantees we visit nodes in order of their distance from the source.',
            time: 'Queue: [B, C]',
            snapshot: snap({ A: 'visited', B: 'queued', C: 'queued' }, 'Queue: [B, C]')
        },
        {
            title: 'BFS: Visit B → Enqueue D, E',
            desc: 'Dequeue <strong>B</strong> (front of queue). Visit it and enqueue its unvisited neighbors: <strong>D</strong> and <strong>E</strong>. C is already queued so we skip it.',
            time: 'Queue: [C, D, E]',
            snapshot: snap({ A: 'visited', B: 'visited', C: 'queued', D: 'queued', E: 'queued' }, 'Queue: [C, D, E]')
        },
        {
            title: 'BFS: Visit C → Enqueue F',
            desc: 'Dequeue <strong>C</strong>. Visit it and enqueue <strong>F</strong>. E is already queued. Notice: all distance-1 nodes (B, C) are visited before any distance-2 nodes.',
            time: 'Queue: [D, E, F]',
            snapshot: snap({ A: 'visited', B: 'visited', C: 'visited', D: 'queued', E: 'queued', F: 'queued' }, 'Queue: [D, E, F]')
        },
        {
            title: 'BFS: Visit D, E, F',
            desc: 'Dequeue and visit <strong>D</strong>, <strong>E</strong>, <strong>F</strong> in order. No new neighbors to enqueue. Queue is empty — BFS complete!<br><strong>Visit order: A → B → C → D → E → F</strong> (level by level).',
            time: 'Queue: [] — Done!',
            snapshot: snap({ A: 'visited', B: 'visited', C: 'visited', D: 'visited', E: 'visited', F: 'visited' }, 'BFS Order: A → B → C → D → E → F')
        },
        {
            title: 'DFS: Start at Node A',
            desc: 'Now let\'s compare with Depth-First Search. DFS uses a <strong>stack</strong> (LIFO) — it goes as deep as possible before backtracking. Starting at <strong>A</strong>.',
            time: 'Stack: [A]',
            snapshot: snap({ A: 'current' }, 'Stack: [A]')
        },
        {
            title: 'DFS: Visit A → Push C, B',
            desc: 'Pop <strong>A</strong>, visit it. Push neighbors onto stack: <strong>C</strong> then <strong>B</strong> (B on top). DFS will visit B next because stacks are LIFO.',
            time: 'Stack: [C, B]',
            snapshot: snap({ A: 'visited', B: 'queued', C: 'queued' }, 'Stack: [C, B] ← B on top')
        },
        {
            title: 'DFS: Visit B → Push E, D',
            desc: 'Pop <strong>B</strong> (top of stack), visit it. Push its unvisited neighbors: <strong>E</strong>, <strong>D</strong>. DFS dives deeper — it will visit D next.',
            time: 'Stack: [C, E, D]',
            snapshot: snap({ A: 'visited', B: 'visited', C: 'queued', D: 'queued', E: 'queued' }, 'Stack: [C, E, D] ← D on top')
        },
        {
            title: 'DFS: Visit D → No new neighbors',
            desc: 'Pop <strong>D</strong>, visit it. D has no unvisited neighbors. DFS backtracks — next pop will be <strong>E</strong>.',
            time: 'Stack: [C, E]',
            snapshot: snap({ A: 'visited', B: 'visited', D: 'visited', C: 'queued', E: 'queued' }, 'Stack: [C, E] ← E on top')
        },
        {
            title: 'DFS: Visit E, C, F',
            desc: 'Pop and visit <strong>E</strong> (its neighbor C already queued). Pop and visit <strong>C</strong>. Push <strong>F</strong>, pop and visit it. Stack empty — DFS complete!<br><strong>Visit order: A → B → D → E → C → F</strong> (depth first).',
            time: 'Stack: [] — Done!',
            snapshot: snap({ A: 'visited', B: 'visited', C: 'visited', D: 'visited', E: 'visited', F: 'visited' }, 'DFS Order: A → B → D → E → C → F')
        }
    ];

    // ─── Init ───────────────────────────────────────────────────────────────
    function init() {
        if (typeof TechDiagrams === 'undefined') return;

        TechDiagrams.createDemo({
            container: '#bfsDfsDemo',
            elements: ALL_ELEMENTS,
            scenes: scenes,
            viewBox: '0 0 600 460',
            theme: THEME
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
