/**
 * AVL Tree Rotation — Interactive Step-Through Demo
 * Uses TechDiagrams framework for animated visualization.
 * Embedded in data-structures/dsa-bst-avl-redblack.html
 */
(function() {
    'use strict';

    // ─── Element Definitions ────────────────────────────────────────────────
    // Positions for a 3-node subtree demonstration
    var NODES = [
        { id: 'Z', type: 'circle', x: 300, y: 80, r: 24, label: 'Z', sublabel: 'BF: -2' },
        { id: 'Y', type: 'circle', x: 420, y: 200, r: 24, label: 'Y', sublabel: 'BF: -1' },
        { id: 'X', type: 'circle', x: 500, y: 320, r: 24, label: 'X', sublabel: 'BF: 0' },
        { id: 'T1', type: 'rect', x: 200, y: 200, width: 50, height: 28, label: 'T1' },
        { id: 'T2', type: 'rect', x: 340, y: 320, width: 50, height: 28, label: 'T2' },
        { id: 'T3', type: 'rect', x: 420, y: 400, width: 50, height: 28, label: 'T3' },
        { id: 'T4', type: 'rect', x: 560, y: 400, width: 50, height: 28, label: 'T4' }
    ];

    var EDGES = [
        { id: 'e-Z-T1', type: 'line', x1: 300, y1: 104, x2: 200, y2: 186 },
        { id: 'e-Z-Y', type: 'line', x1: 300, y1: 104, x2: 420, y2: 176 },
        { id: 'e-Y-T2', type: 'line', x1: 420, y1: 224, x2: 340, y2: 306 },
        { id: 'e-Y-X', type: 'line', x1: 420, y1: 224, x2: 500, y2: 296 },
        { id: 'e-X-T3', type: 'line', x1: 500, y1: 344, x2: 420, y2: 386 },
        { id: 'e-X-T4', type: 'line', x1: 500, y1: 344, x2: 560, y2: 386 }
    ];

    var ALL_ELEMENTS = EDGES.concat(NODES);

    // ─── Theme ──────────────────────────────────────────────────────────────
    var THEME = {
        normal: '#5a6e82',
        unbalanced: '#BF092F',
        rotating: '#c4873b',
        balanced: '#3B9797',
        subtree: '#16476A'
    };

    // ─── Scenes ─────────────────────────────────────────────────────────────
    var scenes = [
        {
            title: 'Unbalanced Tree (RR Case)',
            desc: 'After inserting node X, the tree is <strong>right-heavy</strong>. Node Z has balance factor <strong>-2</strong> (right subtree is 2 levels deeper than left). Node Y has BF = -1. This is the <strong>RR case</strong> — violation is on the right child\'s right subtree.',
            time: 'Before rotation',
            snapshot: {
                'Z': { fill: THEME.unbalanced, sublabel: 'BF: -2' },
                'Y': { fill: THEME.rotating, sublabel: 'BF: -1' },
                'X': { fill: THEME.normal, sublabel: 'BF: 0' },
                'T1': { fill: THEME.subtree }, 'T2': { fill: THEME.subtree },
                'T3': { fill: THEME.subtree }, 'T4': { fill: THEME.subtree }
            }
        },
        {
            title: 'Identify Rotation: Left Rotate at Z',
            desc: 'Since BF(Z) = -2 and BF(Y) ≤ 0, we need a <strong>single left rotation</strong> at node Z. Y will become the new root of this subtree. Z moves down to become Y\'s left child. T2 (Y\'s left subtree) will be reassigned to Z\'s right.',
            time: 'Planning rotation',
            snapshot: {
                'Z': { fill: THEME.unbalanced, sublabel: '← will move down' },
                'Y': { fill: THEME.rotating, sublabel: '← new root' },
                'X': { fill: THEME.normal, sublabel: 'stays' },
                'T1': { fill: THEME.subtree }, 'T2': { fill: THEME.rotating },
                'T3': { fill: THEME.subtree }, 'T4': { fill: THEME.subtree }
            }
        },
        {
            title: 'Perform Left Rotation',
            desc: '<strong>Step 1:</strong> Y becomes the new subtree root.<br><strong>Step 2:</strong> Z becomes Y\'s left child.<br><strong>Step 3:</strong> T2 (previously Y\'s left) becomes Z\'s right child.<br>This maintains BST ordering: T1 < Z < T2 < Y < T3 < X < T4.',
            time: 'After rotation',
            snapshot: {
                'Z': { fill: THEME.balanced, sublabel: 'BF: 0' },
                'Y': { fill: THEME.balanced, sublabel: 'BF: 0 ✓' },
                'X': { fill: THEME.balanced, sublabel: 'BF: 0' },
                'T1': { fill: THEME.subtree }, 'T2': { fill: THEME.subtree },
                'T3': { fill: THEME.subtree }, 'T4': { fill: THEME.subtree }
            }
        },
        {
            title: 'Tree Balanced — O(1) Rotation Cost',
            desc: 'After one left rotation, all nodes have balance factors in {-1, 0, +1}. The tree height decreased by 1, restoring the <strong>O(log n) guarantee</strong> for search, insert, and delete. A single rotation takes <strong>O(1)</strong> time — only pointer reassignments.',
            time: 'Balanced ✓',
            snapshot: {
                'Z': { fill: THEME.balanced, sublabel: 'BF: 0 ✓' },
                'Y': { fill: THEME.balanced, sublabel: 'BF: 0 ✓' },
                'X': { fill: THEME.balanced, sublabel: 'BF: 0 ✓' },
                'T1': { fill: THEME.subtree }, 'T2': { fill: THEME.subtree },
                'T3': { fill: THEME.subtree }, 'T4': { fill: THEME.subtree }
            }
        }
    ];

    // ─── Init ───────────────────────────────────────────────────────────────
    function init() {
        if (typeof TechDiagrams === 'undefined') return;

        TechDiagrams.createDemo({
            container: '#avlRotationDemo',
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
