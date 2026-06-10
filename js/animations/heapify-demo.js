/**
 * heapify-demo.js
 * TechDiagrams step-through: Min-Heap Extract-Min + Heapify-Down
 *
 * 7-node min-heap: [1, 3, 5, 7, 9, 8, 6]
 * Layout (array indices → tree positions):
 *         1 (0)
 *        / \
 *       3(1) 5(2)
 *      / \ / \
 *    7(3)9(4)8(5)6(6)
 *
 * Steps:
 * 0. Initial heap — root is 1 (minimum)
 * 1. Extract root (1) — root removed, 6 moved to root from last position
 * 2. Heap property violated — 6 is > left child 3; compare children
 * 3. Swap 6 with 3 (smaller child) — continue sifting down
 * 4. 6 > left child 7? No. Heap property restored.
 */

(function () {

    // ─── Theme ────────────────────────────────────────────────────────────────
    var THEME = {
        normal:    '#5a6e82',   // unaffected node
        highlight: '#c4873b',   // actively compared / moved
        swapped:   '#BF092F',   // just swapped
        settled:   '#3B9797',   // correctly placed
        extracted: '#94a3b8'    // removed node (greyed out)
    };

    // ─── Node layout (circle elements) ────────────────────────────────────────
    // viewBox: 0 0 600 360
    // Tree layout: level 0 at y=60, level 1 at y=150, level 2 at y=240
    var ALL_ELEMENTS = [
        // Tree nodes
        { id: 'n0', type: 'circle', x: 300, y: 60,  r: 26, label: '1',  sublabel: 'root' },
        { id: 'n1', type: 'circle', x: 180, y: 160, r: 26, label: '3',  sublabel: 'i=1' },
        { id: 'n2', type: 'circle', x: 420, y: 160, r: 26, label: '5',  sublabel: 'i=2' },
        { id: 'n3', type: 'circle', x: 110, y: 265, r: 26, label: '7',  sublabel: 'i=3' },
        { id: 'n4', type: 'circle', x: 248, y: 265, r: 26, label: '9',  sublabel: 'i=4' },
        { id: 'n5', type: 'circle', x: 352, y: 265, r: 26, label: '8',  sublabel: 'i=5' },
        { id: 'n6', type: 'circle', x: 490, y: 265, r: 26, label: '6',  sublabel: 'i=6' },

        // Tree edges (arrows from parent to child)
        { id: 'e01',  type: 'arrow', x1: 280, y1: 77,  x2: 200, y2: 143, stroke: '#cbd5e1' },
        { id: 'e02',  type: 'arrow', x1: 320, y1: 77,  x2: 400, y2: 143, stroke: '#cbd5e1' },
        { id: 'e13',  type: 'arrow', x1: 162, y1: 177, x2: 126, y2: 248, stroke: '#cbd5e1' },
        { id: 'e14',  type: 'arrow', x1: 196, y1: 177, x2: 232, y2: 248, stroke: '#cbd5e1' },
        { id: 'e25',  type: 'arrow', x1: 404, y1: 177, x2: 368, y2: 248, stroke: '#cbd5e1' },
        { id: 'e26',  type: 'arrow', x1: 438, y1: 177, x2: 474, y2: 248, stroke: '#cbd5e1' },

        // Array representation below tree
        { id: 'a0',  type: 'rect', x: 50,  y: 325, width: 60, height: 26, rx: 3, label: '1',  sublabel: false },
        { id: 'a1',  type: 'rect', x: 120, y: 325, width: 60, height: 26, rx: 3, label: '3',  sublabel: false },
        { id: 'a2',  type: 'rect', x: 190, y: 325, width: 60, height: 26, rx: 3, label: '5',  sublabel: false },
        { id: 'a3',  type: 'rect', x: 260, y: 325, width: 60, height: 26, rx: 3, label: '7',  sublabel: false },
        { id: 'a4',  type: 'rect', x: 330, y: 325, width: 60, height: 26, rx: 3, label: '9',  sublabel: false },
        { id: 'a5',  type: 'rect', x: 400, y: 325, width: 60, height: 26, rx: 3, label: '8',  sublabel: false },
        { id: 'a6',  type: 'rect', x: 470, y: 325, width: 60, height: 26, rx: 3, label: '6',  sublabel: false },

        // Array index labels
        { id: 'li0', type: 'label', x: 80,  y: 360, text: '[0]', fontSize: 10, fill: '#94a3b8' },
        { id: 'li1', type: 'label', x: 150, y: 360, text: '[1]', fontSize: 10, fill: '#94a3b8' },
        { id: 'li2', type: 'label', x: 220, y: 360, text: '[2]', fontSize: 10, fill: '#94a3b8' },
        { id: 'li3', type: 'label', x: 290, y: 360, text: '[3]', fontSize: 10, fill: '#94a3b8' },
        { id: 'li4', type: 'label', x: 360, y: 360, text: '[4]', fontSize: 10, fill: '#94a3b8' },
        { id: 'li5', type: 'label', x: 430, y: 360, text: '[5]', fontSize: 10, fill: '#94a3b8' },
        { id: 'li6', type: 'label', x: 500, y: 360, text: '[6]', fontSize: 10, fill: '#94a3b8' },

        // Status callout label
        { id: 'status', type: 'label', x: 300, y: 20, text: 'Min-Heap: [1, 3, 5, 7, 9, 8, 6]', fontSize: 12, fontWeight: 700, fill: '#132440' }
    ];

    // ─── Snapshot helpers ─────────────────────────────────────────────────────
    function snap(nodeColors, arrayColors, statusText) {
        var s = {};
        // node colors
        Object.keys(nodeColors).forEach(function(id) {
            s[id] = { fill: nodeColors[id] };
        });
        // array cell colors
        Object.keys(arrayColors).forEach(function(id) {
            s[id] = { fill: arrayColors[id] };
        });
        if (statusText) {
            s['status'] = { text: statusText };
        }
        return s;
    }

    var N = THEME.normal;
    var H = THEME.highlight;
    var SW = THEME.swapped;
    var OK = THEME.settled;
    var EX = THEME.extracted;

    // ─── Scenes ───────────────────────────────────────────────────────────────
    var scenes = [
        {
            title: 'Initial Min-Heap',
            desc: 'A valid min-heap: every parent is smaller than its children. Root = 1 is the minimum. Array representation: [1, 3, 5, 7, 9, 8, 6].',
            time: 'heap size = 7',
            snapshot: snap(
                { n0: OK, n1: N, n2: N, n3: N, n4: N, n5: N, n6: N },
                { a0: OK, a1: N, a2: N, a3: N, a4: N, a5: N, a6: N },
                'Min-Heap: [1, 3, 5, 7, 9, 8, 6]'
            )
        },
        {
            title: 'Step 1: Extract Root (min = 1)',
            desc: 'Remove root (1) — the minimum. Move the <strong>last element (6)</strong> to the root position to maintain completeness. Heap size shrinks to 6.',
            time: 'heap size = 6',
            snapshot: snap(
                { n0: H, n1: N, n2: N, n3: N, n4: N, n5: N, n6: EX },
                { a0: H, a1: N, a2: N, a3: N, a4: N, a5: N, a6: EX },
                'Extract 1 \u2192 move 6 to root'
            )
        },
        {
            title: 'Step 2: 6 Placed at Root — Heap Violated',
            desc: 'Root is now 6. Its children are 3 (left, i=1) and 5 (right, i=2). Since 6 > 3, the min-heap property is violated. Find the smaller child to swap with.',
            time: 'compare children',
            snapshot: snap(
                { n0: SW, n1: H, n2: H, n3: N, n4: N, n5: N, n6: EX },
                { a0: SW, a1: H, a2: H, a3: N, a4: N, a5: N, a6: EX },
                'Root=6 > smaller child=3 \u2192 must swap'
            )
        },
        {
            title: 'Step 3: Swap 6 with Smaller Child (3)',
            desc: '6 swaps with 3. Now 3 is at root, 6 is at i=1. Continue checking: 6\'s new children are 7 (i=3) and 9 (i=4). Since 6 < 7, heap property is satisfied.',
            time: 'sift continues',
            snapshot: snap(
                { n0: OK, n1: SW, n2: N, n3: H, n4: H, n5: N, n6: EX },
                { a0: OK, a1: SW, a2: N, a3: H, a4: H, a5: N, a6: EX },
                'Swap: 3\u2191 root, 6\u2193 i=1 \u2014 check 6 vs children'
            )
        },
        {
            title: 'Step 4: Heap Property Restored',
            desc: '6 < 7 and 6 < 9. No further swap needed. Heapify-down complete. New heap: [3, 6, 5, 7, 9, 8] \u2014 valid min-heap in O(log n) = 3 comparisons.',
            time: 'O(log 7) = 3 steps',
            snapshot: snap(
                { n0: OK, n1: OK, n2: OK, n3: OK, n4: OK, n5: OK, n6: EX },
                { a0: OK, a1: OK, a2: OK, a3: OK, a4: OK, a5: OK, a6: EX },
                'Done: [3, 6, 5, 7, 9, 8] \u2014 O(log n) heapify-down'
            )
        }
    ];

    // ─── Init ─────────────────────────────────────────────────────────────────
    function init() {
        if (typeof TechDiagrams === 'undefined') return;

        TechDiagrams.createDemo({
            container: '#heapifyDemo',
            elements: ALL_ELEMENTS,
            scenes: scenes,
            viewBox: '0 0 600 375',
            theme: THEME
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
