/**
 * TechDiagrams — Technical Education Animation Framework
 * 
 * A generic animated diagram library for interactive step-through
 * visualizations across any technical topic: distributed systems,
 * operating systems, networking, logic, physics, embedded systems.
 *
 * Public API:
 *   TechDiagrams.createDemo(config)   — Create an interactive demo
 *   TechDiagrams.ready()              — Promise resolving when motion.dev loaded
 *   TechDiagrams.registerDomain(name, helpers) — Add domain helper pack
 *
 * Architecture:
 *   Elements → Renderer → Animations → Timeline → SceneContext → Controller
 */
var TechDiagrams = (function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // Section 1: Loader — Dynamic import of motion.dev + ready() promise
    // ════════════════════════════════════════════════════════════════════════

    var _motionModule = null;
    var _readyPromise = null;
    var _animate = null;

    function loadMotion() {
        if (_readyPromise) return _readyPromise;
        _readyPromise = import('https://cdn.jsdelivr.net/npm/motion@12/+esm')
            .then(function(mod) {
                _motionModule = mod;
                _animate = mod.animate;
                return mod;
            });
        return _readyPromise;
    }

    function ready() {
        return loadMotion();
    }

    function getAnimate() {
        return _animate;
    }

    // ════════════════════════════════════════════════════════════════════════
    // Section 2: Themes — Site color palette + configurable state mapping
    // ════════════════════════════════════════════════════════════════════════

    var DEFAULT_THEME = {
        // Site palette
        navy: '#132440',
        blue: '#16476A',
        teal: '#3B9797',
        crimson: '#BF092F',
        amber: '#c4873b',
        slate: '#5a6e82',
        light: '#f8f9fa',
        white: '#ffffff',
        gray: '#64748b',
        link: '#cbd5e1',

        // Semantic (override per-demo)
        primary: '#3B9797',
        secondary: '#16476A',
        accent: '#c4873b',
        danger: '#BF092F',
        muted: '#94a3b8',

        // Font
        fontFamily: 'DM Sans, sans-serif'
    };

    function mergeTheme(custom) {
        if (!custom) return DEFAULT_THEME;
        var merged = {};
        for (var k in DEFAULT_THEME) merged[k] = DEFAULT_THEME[k];
        for (var k2 in custom) merged[k2] = custom[k2];
        return merged;
    }

    // ════════════════════════════════════════════════════════════════════════
    // Section 3: Renderer — Pure SVG factories (no animation, sync)
    // ════════════════════════════════════════════════════════════════════════

    var SVG_NS = 'http://www.w3.org/2000/svg';

    function svgEl(tag, attrs) {
        var el = document.createElementNS(SVG_NS, tag);
        if (attrs) {
            for (var k in attrs) {
                el.setAttribute(k, attrs[k]);
            }
        }
        return el;
    }

    /**
     * Build the root SVG element inside a container.
     */
    function buildSVG(container, viewBox) {
        var svg = svgEl('svg', {
            viewBox: viewBox || '0 0 600 460',
            id: 'td-svg-' + Date.now()
        });
        svg.innerHTML = '<defs>' +
            '<filter id="td-glow"><feGaussianBlur stdDeviation="3" result="blur"/>' +
            '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
            '</defs>' +
            '<g class="td-layer-connectors"></g>' +
            '<g class="td-layer-shapes"></g>' +
            '<g class="td-layer-annotations"></g>' +
            '<g class="td-layer-fx"></g>';
        container.appendChild(svg);
        return svg;
    }

    /**
     * Render a single element definition into SVG.
     * Returns the SVG element (or group).
     */
    function renderElement(el, theme) {
        switch (el.type) {
            case 'circle': return renderCircle(el, theme);
            case 'rect': return renderRect(el, theme);
            case 'diamond': return renderDiamond(el, theme);
            case 'group': return renderGroup(el, theme);
            case 'line': return renderLine(el, theme);
            case 'arrow': return renderArrow(el, theme);
            case 'curve': return renderCurve(el, theme);
            case 'label': return renderLabel(el, theme);
            case 'badge': return renderBadge(el, theme);
            case 'value': return renderValue(el, theme);
            case 'callout': return renderCallout(el, theme);
            default: return null;
        }
    }

    function renderCircle(el, theme) {
        var g = svgEl('g', { id: 'td-' + el.id, transform: 'translate(' + el.x + ',' + el.y + ')' });

        var ring = svgEl('circle', { r: el.r ? el.r + 6 : 32, fill: 'none', stroke: theme.muted, 'stroke-width': 3, opacity: 0.35 });
        ring.id = 'td-ring-' + el.id;

        var circle = svgEl('circle', { r: el.r || 26, fill: el.fill || theme.muted });
        circle.id = 'td-shape-' + el.id;

        var text = svgEl('text', { 'text-anchor': 'middle', dy: '0.35em', fill: '#fff', 'font-weight': 700, 'font-size': el.fontSize || 16, 'font-family': theme.fontFamily });
        text.textContent = el.label || el.id;

        g.append(ring, circle, text);

        // Role label below
        if (el.sublabel !== false) {
            var sub = svgEl('text', { 'text-anchor': 'middle', dy: 48, fill: theme.muted, 'font-size': 10, 'font-weight': 600, 'font-family': theme.fontFamily });
            sub.id = 'td-sub-' + el.id;
            sub.textContent = el.sublabel || '';
            g.appendChild(sub);
        }

        return g;
    }

    function renderRect(el, theme) {
        var g = svgEl('g', { id: 'td-' + el.id, transform: 'translate(' + el.x + ',' + el.y + ')' });
        var w = el.width || 80, h = el.height || 40;

        var rect = svgEl('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: el.rx || 6, fill: el.fill || theme.secondary, opacity: el.opacity || 1 });
        rect.id = 'td-shape-' + el.id;

        var text = svgEl('text', { 'text-anchor': 'middle', dy: '0.35em', fill: '#fff', 'font-size': el.fontSize || 13, 'font-weight': 600, 'font-family': theme.fontFamily });
        text.textContent = el.label || el.id;

        g.append(rect, text);
        return g;
    }

    function renderDiamond(el, theme) {
        var g = svgEl('g', { id: 'td-' + el.id, transform: 'translate(' + el.x + ',' + el.y + ')' });
        var s = el.size || 30;
        var points = '0,' + (-s) + ' ' + s + ',0 0,' + s + ' ' + (-s) + ',0';

        var poly = svgEl('polygon', { points: points, fill: el.fill || theme.accent, stroke: 'none' });
        poly.id = 'td-shape-' + el.id;

        var text = svgEl('text', { 'text-anchor': 'middle', dy: '0.35em', fill: '#fff', 'font-size': 11, 'font-weight': 700, 'font-family': theme.fontFamily });
        text.textContent = el.label || '?';

        g.append(poly, text);
        return g;
    }

    function renderGroup(el, theme) {
        var g = svgEl('g', { id: 'td-' + el.id });
        var w = el.width || 160, h = el.height || 120;

        var rect = svgEl('rect', { x: el.x, y: el.y, width: w, height: h, rx: 10, fill: 'none', stroke: el.stroke || theme.muted, 'stroke-width': 2, 'stroke-dasharray': '6 4', opacity: 0.6 });
        rect.id = 'td-shape-' + el.id;

        g.appendChild(rect);

        if (el.label) {
            var lbl = svgEl('text', { x: el.x + 10, y: el.y + 18, fill: theme.gray, 'font-size': 11, 'font-weight': 600, 'font-family': theme.fontFamily });
            lbl.textContent = el.label;
            g.appendChild(lbl);
        }
        return g;
    }

    function renderLine(el, theme) {
        var line = svgEl('line', {
            x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2,
            stroke: el.stroke || theme.link, 'stroke-width': el.strokeWidth || 1.5,
            'stroke-dasharray': el.dash || '4 3', opacity: el.opacity || 0.5
        });
        line.id = 'td-' + el.id;
        return line;
    }

    function renderArrow(el, theme) {
        var g = svgEl('g', { id: 'td-' + el.id });
        var dx = el.x2 - el.x1, dy = el.y2 - el.y1;
        var len = Math.sqrt(dx * dx + dy * dy);
        var ux = dx / len, uy = dy / len;
        var headLen = 8;
        // Shorten line by arrowhead
        var lx2 = el.x2 - ux * headLen, ly2 = el.y2 - uy * headLen;

        var line = svgEl('line', { x1: el.x1, y1: el.y1, x2: lx2, y2: ly2, stroke: el.stroke || theme.primary, 'stroke-width': 2 });
        // Arrowhead
        var ax = el.x2, ay = el.y2;
        var p1x = ax - ux * headLen - uy * 4, p1y = ay - uy * headLen + ux * 4;
        var p2x = ax - ux * headLen + uy * 4, p2y = ay - uy * headLen - ux * 4;
        var head = svgEl('polygon', { points: ax + ',' + ay + ' ' + p1x + ',' + p1y + ' ' + p2x + ',' + p2y, fill: el.stroke || theme.primary });

        g.append(line, head);
        return g;
    }

    function renderCurve(el, theme) {
        var d = 'M' + el.x1 + ',' + el.y1 + ' Q' + (el.cx || (el.x1 + el.x2) / 2) + ',' + (el.cy || el.y1 - 40) + ' ' + el.x2 + ',' + el.y2;
        var path = svgEl('path', { d: d, fill: 'none', stroke: el.stroke || theme.primary, 'stroke-width': 2 });
        path.id = 'td-' + el.id;
        return path;
    }

    function renderLabel(el, theme) {
        var text = svgEl('text', { x: el.x, y: el.y, 'text-anchor': el.anchor || 'middle', fill: el.fill || theme.navy, 'font-size': el.fontSize || 12, 'font-weight': el.fontWeight || 500, 'font-family': theme.fontFamily });
        text.id = 'td-' + el.id;
        text.textContent = el.text || '';
        return text;
    }

    function renderBadge(el, theme) {
        var g = svgEl('g', { id: 'td-' + el.id, transform: 'translate(' + el.x + ',' + el.y + ')' });
        var w = el.width || 28, h = el.height || 16;
        var bg = svgEl('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: el.fill || theme.navy, opacity: 0.8 });
        var text = svgEl('text', { 'text-anchor': 'middle', dy: '0.35em', fill: '#fff', 'font-size': 10, 'font-family': theme.fontFamily });
        text.id = 'td-badge-text-' + el.id;
        text.textContent = el.text || '';
        g.append(bg, text);
        return g;
    }

    function renderValue(el, theme) {
        var g = svgEl('g', { id: 'td-' + el.id, transform: 'translate(' + el.x + ',' + el.y + ')' });
        var w = el.width || 120, h = el.height || 12;

        // Background
        var bg = svgEl('rect', { x: 0, y: 0, width: w, height: h, rx: h / 2, fill: '#e2e8f0' });
        // Fill
        var fill = svgEl('rect', { x: 0, y: 0, width: 0, height: h, rx: h / 2, fill: el.fill || theme.primary });
        fill.id = 'td-value-fill-' + el.id;
        // Threshold marker
        if (el.threshold) {
            var tx = (el.threshold / (el.total || 5)) * w;
            var marker = svgEl('line', { x1: tx, y1: -2, x2: tx, y2: h + 2, stroke: theme.navy, 'stroke-width': 2 });
            g.append(bg, fill, marker);
        } else {
            g.append(bg, fill);
        }
        // Label
        if (el.showLabel !== false) {
            var lbl = svgEl('text', { x: w / 2, y: -6, 'text-anchor': 'middle', fill: theme.gray, 'font-size': 10, 'font-family': theme.fontFamily });
            lbl.id = 'td-value-label-' + el.id;
            lbl.textContent = el.label || '';
            g.appendChild(lbl);
        }
        return g;
    }

    function renderCallout(el, theme) {
        var g = svgEl('g', { id: 'td-' + el.id, transform: 'translate(' + el.x + ',' + el.y + ')', opacity: 0 });
        var text = svgEl('text', { 'text-anchor': 'middle', dy: '0.35em', fill: el.fill || theme.accent, 'font-size': el.fontSize || 11, 'font-weight': 600, 'font-family': theme.fontFamily, 'font-style': 'italic' });
        text.textContent = el.text || '';
        g.appendChild(text);
        return g;
    }

    /**
     * Full render pass: places all elements into the SVG layers.
     */
    function renderAll(svg, elements, theme) {
        var connectors = svg.querySelector('.td-layer-connectors');
        var shapes = svg.querySelector('.td-layer-shapes');
        var annotations = svg.querySelector('.td-layer-annotations');

        connectors.innerHTML = '';
        shapes.innerHTML = '';
        annotations.innerHTML = '';

        elements.forEach(function(el) {
            var svgNode = renderElement(el, theme);
            if (!svgNode) return;

            if (el.type === 'line' || el.type === 'arrow' || el.type === 'curve') {
                connectors.appendChild(svgNode);
            } else if (el.type === 'label' || el.type === 'badge' || el.type === 'value' || el.type === 'callout') {
                annotations.appendChild(svgNode);
            } else {
                shapes.appendChild(svgNode);
            }
        });
    }

    /**
     * Apply a snapshot to elements: update fills, labels, sublabels, opacity.
     * Does NOT animate — just sets state immediately.
     */
    function applySnapshot(svg, elements, snapshot, theme) {
        if (!snapshot) return;
        for (var id in snapshot) {
            var s = snapshot[id];
            var shape = svg.querySelector('#td-shape-' + id);
            var ring = svg.querySelector('#td-ring-' + id);
            var sub = svg.querySelector('#td-sub-' + id);

            if (shape && s.fill) shape.setAttribute('fill', s.fill);
            if (shape && s.color && theme[s.color]) shape.setAttribute('fill', theme[s.color]);
            if (ring && s.fill) ring.setAttribute('stroke', s.fill);
            if (ring && s.color && theme[s.color]) ring.setAttribute('stroke', theme[s.color]);
            if (ring && s.ringOpacity != null) ring.setAttribute('opacity', s.ringOpacity);
            if (sub && s.sublabel != null) sub.textContent = s.sublabel;
            if (sub && s.fill) sub.setAttribute('fill', s.fill);
            if (sub && s.color && theme[s.color]) sub.setAttribute('fill', theme[s.color]);

            // Badge text + opacity
            var badgeText = svg.querySelector('#td-badge-text-' + id);
            if (badgeText && s.text != null) badgeText.textContent = s.text;
            // Badge group opacity (hide when empty)
            var badgeGroup = svg.querySelector('#td-' + id);
            if (badgeGroup && badgeGroup.tagName === 'g' && s.opacity != null) {
                badgeGroup.setAttribute('opacity', s.opacity);
            }
            // Badge fill override
            if (badgeGroup && badgeGroup.tagName === 'g' && s.fill) {
                var bgRect = badgeGroup.querySelector('rect');
                if (bgRect) bgRect.setAttribute('fill', theme[s.fill] || s.fill);
            }

            // Value fill
            var valueFill = svg.querySelector('#td-value-fill-' + id);
            if (valueFill && s.value != null) {
                var el = elements.find(function(e) { return e.id === id; });
                var w = (el && el.width) || 120;
                var total = (el && el.total) || 5;
                valueFill.setAttribute('width', (s.value / total) * w);
                if (s.valueFill) valueFill.setAttribute('fill', s.valueFill);
            }

            // Value label
            var valueLabel = svg.querySelector('#td-value-label-' + id);
            if (valueLabel && s.label != null) valueLabel.textContent = s.label;

            // Line/connector state
            var connector = svg.querySelector('#td-' + id);
            if (connector && connector.tagName === 'line') {
                if (s.stroke) connector.setAttribute('stroke', s.stroke);
                if (s.opacity != null) connector.setAttribute('opacity', s.opacity);
                if (s.dash) connector.setAttribute('stroke-dasharray', s.dash);
            }

            // Callout visibility
            if (connector && s.opacity != null && connector.closest('.td-layer-annotations')) {
                connector.setAttribute('opacity', s.opacity);
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // Section 4: Animations — Generic primitives (async, motion-powered)
    // ════════════════════════════════════════════════════════════════════════

    function createAnimationContext(svg, elements, theme) {
        var animate = getAnimate();

        var ctx = {};

        /**
         * Animate any SVG element's attributes.
         */
        ctx.element = function(id, props, options) {
            var el = svg.querySelector('#td-' + id) || svg.querySelector('#td-shape-' + id);
            if (!el || !animate) return Promise.resolve();
            return animate(el, props, options || { duration: 0.4 }).finished;
        };

        /**
         * State change with spring-bounce (for shapes).
         */
        ctx.stateChange = function(id, fill, opts) {
            var shape = svg.querySelector('#td-shape-' + id);
            var ring = svg.querySelector('#td-ring-' + id);
            var sub = svg.querySelector('#td-sub-' + id);
            if (!shape || !animate) return Promise.resolve();

            var color = theme[fill] || fill;
            var promises = [];

            promises.push(animate(shape, { fill: color, r: shape.tagName === 'circle' ? [shape.getAttribute('r'), parseInt(shape.getAttribute('r')) + 4, shape.getAttribute('r')] : undefined }, { duration: 0.5, easing: [0.34, 1.56, 0.64, 1] }).finished);

            if (ring) {
                promises.push(animate(ring, { stroke: color }, { duration: 0.3 }).finished);
            }
            if (sub && opts && opts.sublabel != null) {
                sub.textContent = opts.sublabel;
                sub.setAttribute('fill', color);
            }
            return Promise.all(promises);
        };

        /**
         * Moving dot from one element to another.
         */
        ctx.path = function(fromId, toId, color, duration) {
            var fromEl = elements.find(function(e) { return e.id === fromId; });
            var toEl = elements.find(function(e) { return e.id === toId; });
            if (!fromEl || !toEl || !animate) return Promise.resolve();

            var fx = svg.querySelector('.td-layer-fx');
            var dot = svgEl('circle', { r: 5, fill: theme[color] || color || theme.primary, cx: fromEl.x, cy: fromEl.y, filter: 'url(#td-glow)' });
            fx.appendChild(dot);

            return animate(dot, { cx: [fromEl.x, toEl.x], cy: [fromEl.y, toEl.y], opacity: [1, 0.6] }, { duration: duration || 0.5, easing: 'ease-out' }).finished.then(function() { dot.remove(); });
        };

        /**
         * Broadcast: fan-out from one to many.
         */
        ctx.broadcast = function(fromId, toIds, color, stagger) {
            var stg = stagger || 0.06;
            var promises = toIds.map(function(toId, i) {
                return new Promise(function(resolve) {
                    setTimeout(function() { ctx.path(fromId, toId, color).then(resolve); }, i * stg * 1000);
                });
            });
            return Promise.all(promises);
        };

        /**
         * Highlight elements (dim everything else).
         */
        ctx.highlight = function(ids) {
            var targets = Array.isArray(ids) ? ids : [ids];
            var allShapes = svg.querySelectorAll('[id^="td-shape-"], [id^="td-ring-"]');
            allShapes.forEach(function(el) {
                var elId = el.id.replace('td-shape-', '').replace('td-ring-', '');
                var isTarget = targets.indexOf(elId) !== -1;
                if (animate) animate(el, { opacity: isTarget ? 1 : 0.2 }, { duration: 0.3 });
            });
            return new Promise(function(r) { setTimeout(r, 300); });
        };

        /**
         * Restore all elements from highlight.
         */
        ctx.unhighlight = function() {
            var allShapes = svg.querySelectorAll('[id^="td-shape-"], [id^="td-ring-"]');
            allShapes.forEach(function(el) {
                if (animate) animate(el, { opacity: 1 }, { duration: 0.3 });
            });
            return new Promise(function(r) { setTimeout(r, 300); });
        };

        /**
         * Pulse ring effect on a shape.
         */
        ctx.pulse = function(id) {
            var ring = svg.querySelector('#td-ring-' + id);
            if (!ring || !animate) return Promise.resolve();
            return animate(ring, { r: [ring.getAttribute('r'), parseInt(ring.getAttribute('r')) + 10, ring.getAttribute('r')], opacity: [0.7, 1, 0.7] }, { duration: 0.7, easing: 'ease-in-out' }).finished;
        };

        /**
         * Animate a value bar fill.
         */
        ctx.value = function(id, target, total, opts) {
            var fill = svg.querySelector('#td-value-fill-' + id);
            var label = svg.querySelector('#td-value-label-' + id);
            var el = elements.find(function(e) { return e.id === id; });
            if (!fill || !animate) return Promise.resolve();

            var w = (el && el.width) || 120;
            var t = total || (el && el.total) || 5;
            var targetW = (target / t) * w;

            if (label && opts && opts.label) label.textContent = opts.label;
            if (opts && opts.fill) fill.setAttribute('fill', theme[opts.fill] || opts.fill);

            return animate(fill, { width: [0, targetW] }, { duration: 0.4, easing: 'ease-out' }).finished;
        };

        /**
         * Animate label text change with fade.
         */
        ctx.label = function(id, text) {
            var el = svg.querySelector('#td-' + id) || svg.querySelector('#td-badge-text-' + id) || svg.querySelector('#td-sub-' + id);
            if (!el || !animate) return Promise.resolve();
            el.textContent = text;
            return animate(el, { opacity: [0.2, 1] }, { duration: 0.3 }).finished;
        };

        /**
         * Show/hide/dim a group.
         */
        ctx.group = function(groupId, state) {
            var g = svg.querySelector('#td-' + groupId);
            if (!g || !animate) return Promise.resolve();
            var op = state === 'hidden' ? 0 : state === 'dim' ? 0.3 : 1;
            return animate(g, { opacity: op }, { duration: 0.4 }).finished;
        };

        /**
         * Timeout ring countdown around a shape.
         */
        ctx.timeoutRing = function(id, duration) {
            var el = elements.find(function(e) { return e.id === id; });
            if (!el || !animate) return Promise.resolve();

            var fx = svg.querySelector('.td-layer-fx');
            var r = (el.r || 26) + 12;
            var circumference = 2 * Math.PI * r;

            var ring = svgEl('circle', { cx: el.x, cy: el.y, r: r, fill: 'none', stroke: theme.accent, 'stroke-width': 3, 'stroke-dasharray': circumference, 'stroke-dashoffset': circumference, transform: 'rotate(-90 ' + el.x + ' ' + el.y + ')' });
            fx.appendChild(ring);

            return animate(ring, { strokeDashoffset: [circumference, 0] }, { duration: duration || 1.0, easing: 'linear' }).finished
                .then(function() { return animate(ring, { opacity: [1, 0] }, { duration: 0.2 }).finished; })
                .then(function() { ring.remove(); });
        };

        /**
         * Animate link/connector state change.
         */
        ctx.linkState = function(ids, state) {
            var targets = Array.isArray(ids) ? ids : [ids];
            var promises = targets.map(function(id) {
                var el = svg.querySelector('#td-' + id);
                if (!el || !animate) return Promise.resolve();
                if (state === 'broken') {
                    return animate(el, { stroke: theme.danger, opacity: 0.2 }, { duration: 0.5 }).finished;
                } else {
                    return animate(el, { stroke: theme.link, opacity: 0.5 }, { duration: 0.5 }).finished;
                }
            });
            return Promise.all(promises);
        };

        /**
         * Show a callout briefly then fade out.
         */
        ctx.callout = function(id, text, duration) {
            var el = svg.querySelector('#td-' + id);
            if (!el || !animate) return Promise.resolve();
            if (text) {
                var t = el.querySelector('text');
                if (t) t.textContent = text;
            }
            return animate(el, { opacity: [0, 1] }, { duration: 0.3 }).finished
                .then(function() { return new Promise(function(r) { setTimeout(r, (duration || 1.5) * 1000); }); })
                .then(function() { return animate(el, { opacity: [1, 0] }, { duration: 0.3 }).finished; });
        };

        return ctx;
    }

    // ════════════════════════════════════════════════════════════════════════
    // Section 5: Timeline — Sequential/parallel/delay sequencer
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Execute a timeline of animation steps.
     * Each step is one of:
     *   { do: fn }                — Execute fn(), await result
     *   { do: fn, delay: ms }     — Wait delay ms, then execute
     *   { parallel: [fn, fn] }    — Execute all in parallel, await all
     *
     * Returns a Promise that resolves when all steps complete.
     */
    function runTimeline(steps) {
        return steps.reduce(function(chain, step) {
            return chain.then(function() {
                if (step.parallel) {
                    return Promise.all(step.parallel.map(function(fn) { return fn(); }));
                }
                if (step.delay) {
                    return new Promise(function(r) { setTimeout(r, step.delay); }).then(function() { return step.do ? step.do() : undefined; });
                }
                return step.do ? step.do() : Promise.resolve();
            });
        }, Promise.resolve());
    }

    // ════════════════════════════════════════════════════════════════════════
    // Section 6: Controller — StepController (UI, keyboard, scene mgmt)
    // ════════════════════════════════════════════════════════════════════════

    function StepController(config) {
        var self = this;
        self.container = config.container;
        self.scenes = config.scenes;
        self.elements = config.elements;
        self.theme = config.theme;
        self.svg = config.svg;
        self.currentStep = 0;
        self.animating = false;

        // DOM references
        self.prevBtn = self.container.querySelector('[data-td-prev]');
        self.nextBtn = self.container.querySelector('[data-td-next]');
        self.resetBtn = self.container.querySelector('[data-td-reset]');
        self.stepNum = self.container.querySelector('[data-td-step]');
        self.timeEl = self.container.querySelector('[data-td-time]');
        self.infoEl = self.container.querySelector('[data-td-info]');

        // Event handlers
        if (self.prevBtn) self.prevBtn.addEventListener('click', function() { self.goTo(self.currentStep - 1); });
        if (self.nextBtn) self.nextBtn.addEventListener('click', function() { self.goTo(self.currentStep + 1); });
        if (self.resetBtn) self.resetBtn.addEventListener('click', function() { self.goTo(0); });

        // Keyboard
        document.addEventListener('keydown', function(e) {
            if (!self.container.matches(':hover')) return;
            if (e.key === 'ArrowRight') self.goTo(self.currentStep + 1);
            if (e.key === 'ArrowLeft') self.goTo(self.currentStep - 1);
        });

        self.updateUI();
    }

    StepController.prototype.updateUI = function() {
        var scene = this.scenes[this.currentStep];
        if (this.infoEl) {
            this.infoEl.innerHTML = '<div class="tech-demo-step-title">' + scene.title + '</div><p class="tech-demo-step-desc">' + scene.desc + '</p>';
        }
        if (this.stepNum) this.stepNum.textContent = 'Step ' + (this.currentStep + 1) + ' / ' + this.scenes.length;
        if (this.timeEl && scene.time) this.timeEl.textContent = scene.time;
        if (this.prevBtn) this.prevBtn.disabled = this.currentStep === 0 || this.animating;
        if (this.nextBtn) this.nextBtn.disabled = this.currentStep === this.scenes.length - 1 || this.animating;
    };

    StepController.prototype.goTo = async function(index) {
        if (this.animating || index < 0 || index >= this.scenes.length) return;
        this.animating = true;
        this.currentStep = index;
        this.updateUI();

        var scene = this.scenes[index];

        // Render from snapshot
        renderAll(this.svg, this.elements, this.theme);
        if (scene.snapshot) {
            applySnapshot(this.svg, this.elements, scene.snapshot, this.theme);
        }

        // Run play() if defined
        if (scene.play) {
            var animCtx = createAnimationContext(this.svg, this.elements, this.theme);
            animCtx.timeline = runTimeline;
            await scene.play(animCtx);
        }

        this.animating = false;
        this.updateUI();
    };

    // ════════════════════════════════════════════════════════════════════════
    // Section 7: SceneContext — Binds renderer + animations + timeline
    // ════════════════════════════════════════════════════════════════════════

    // SceneContext is created per goTo() call above — see createAnimationContext()
    // plus timeline bound as ctx.timeline. The ctx object passed to scene.play()
    // is the unified scene context.

    // ════════════════════════════════════════════════════════════════════════
    // Section 8: Public API
    // ════════════════════════════════════════════════════════════════════════

    var _domains = {};

    /**
     * TechDiagrams.createDemo(config)
     *
     * config: {
     *   container: "#id" or HTMLElement,
     *   elements: [...],
     *   scenes: [...],
     *   theme: { ... },
     *   viewBox: "0 0 600 460"
     * }
     */
    function createDemo(config) {
        var container = typeof config.container === 'string'
            ? document.querySelector(config.container)
            : config.container;

        if (!container) {
            console.warn('[TechDiagrams] Container not found:', config.container);
            return;
        }

        var theme = mergeTheme(config.theme);
        var elements = config.elements || [];
        var scenes = config.scenes || [];

        // Find or create SVG wrapper
        var svgWrap = container.querySelector('.tech-demo-svg-wrap') || container.querySelector('.raft-svg-wrap');
        if (!svgWrap) {
            svgWrap = document.createElement('div');
            svgWrap.className = 'tech-demo-svg-wrap';
            container.insertBefore(svgWrap, container.firstChild);
        }

        // Build SVG
        var svg = buildSVG(svgWrap, config.viewBox);

        // Initial render
        renderAll(svg, elements, theme);
        if (scenes.length > 0 && scenes[0].snapshot) {
            applySnapshot(svg, elements, scenes[0].snapshot, theme);
        }

        // Init controller after motion loads
        loadMotion().then(function() {
            var ctrl = new StepController({
                container: container,
                scenes: scenes,
                elements: elements,
                theme: theme,
                svg: svg
            });

            // Expose domain helpers on the demo instance if needed
            container._techDiagram = ctrl;
        });
    }

    /**
     * Register a domain helper pack.
     */
    function registerDomain(name, helpers) {
        _domains[name] = helpers;
    }

    /**
     * Get a registered domain.
     */
    function getDomain(name) {
        return _domains[name] || null;
    }

    // ════════════════════════════════════════════════════════════════════════
    // Public Interface
    // ════════════════════════════════════════════════════════════════════════

    return {
        createDemo: createDemo,
        ready: ready,
        registerDomain: registerDomain,
        getDomain: getDomain,
        // Exposed for domain helpers to use
        _internal: {
            runTimeline: runTimeline,
            renderAll: renderAll,
            applySnapshot: applySnapshot
        }
    };

})();
