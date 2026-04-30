/**
 * Physics Diagrams — Reusable helpers for interactive physics visualizations
 * Used across Physical Sciences series (Theory of Relativity, etc.)
 * 
 * Integrates:
 *  - Diagramatics (SVG diagrams with sliders/locators)
 *  - Matter.js (real-time physics simulations)
 * 
 * Provides standardized wrappers, theme colors, and responsive sizing.
 */

var PhysicsDiagrams = (function() {
    'use strict';

    // ============================================================
    // Theme colors matching site CSS variables
    // ============================================================
    var colors = {
        navy: '#132440',
        crimson: '#BF092F',
        teal: '#3B9797',
        blue: '#16476A',
        light: '#f8f9fa',
        white: '#ffffff',
        gray: '#6c757d',
        lightTeal: '#e8f4f4',
        lightBlue: '#f0f4f8',
        gold: '#d4a843'
    };

    // ============================================================
    // Diagramatics Helpers
    // ============================================================

    /**
     * Initialize a Diagramatics diagram in a container
     * @param {string} containerId - ID of the .physics-diagram container
     * @param {Function} drawFn - Function receiving (dg, svg, controlDiv, draw) 
     */
    function initDiagramatics(containerId, drawFn) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var svg = container.querySelector('svg');
        var controlDiv = container.querySelector('.diagram-controls');
        if (!svg) return;

        // Dynamic import for Diagramatics (ES module)
        import('https://cdn.jsdelivr.net/npm/diagramatics@1.5/dist/diagramatics.min.js').then(function(dg) {
            // Make a draw helper
            var draw = function() {
                var args = Array.from(arguments);
                dg.draw_to_svg(svg, dg.diagram_combine.apply(null, args));
            };

            // Create interactive object if control div exists
            var int = null;
            if (controlDiv) {
                int = new dg.Interactive(controlDiv, svg);
            }

            drawFn(dg, svg, int, draw);
        }).catch(function(err) {
            console.warn('Diagramatics failed to load:', err);
        });
    }

    // ============================================================
    // Matter.js Helpers
    // ============================================================

    /**
     * Initialize a Matter.js simulation in a container
     * @param {string} containerId - ID of the .physics-diagram container
     * @param {Function} setupFn - Function receiving (Matter, engine, render, container)
     * @param {Object} [options] - Optional config: {gravity, wireframes, background}
     */
    function initMatterSimulation(containerId, setupFn, options) {
        if (typeof Matter === 'undefined') {
            console.warn('Matter.js not loaded');
            return;
        }

        var container = document.getElementById(containerId);
        if (!container) return;

        var canvas = container.querySelector('canvas');
        if (!canvas) return;

        var opts = options || {};
        var width = canvas.width || container.offsetWidth || 600;
        var height = canvas.height || 400;

        var Engine = Matter.Engine;
        var Render = Matter.Render;
        var Runner = Matter.Runner;
        var Bodies = Matter.Bodies;
        var Composite = Matter.Composite;
        var Constraint = Matter.Constraint;
        var Mouse = Matter.Mouse;
        var MouseConstraint = Matter.MouseConstraint;
        var Events = Matter.Events;
        var Body = Matter.Body;
        var Vector = Matter.Vector;

        // Create engine
        var engine = Engine.create();
        if (opts.gravity !== undefined) {
            engine.gravity.y = opts.gravity.y !== undefined ? opts.gravity.y : 1;
            engine.gravity.x = opts.gravity.x !== undefined ? opts.gravity.x : 0;
        }

        // Create renderer
        var render = Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                width: width,
                height: height,
                wireframes: opts.wireframes !== undefined ? opts.wireframes : false,
                background: opts.background || colors.light,
                pixelRatio: window.devicePixelRatio || 1
            }
        });

        Render.run(render);

        // Create runner
        var runner = Runner.create();
        Runner.run(runner, engine);

        // Pass everything to setup function
        setupFn(Matter, engine, render, {
            container: container,
            canvas: canvas,
            width: width,
            height: height,
            runner: runner,
            colors: colors
        });

        // Pause/resume on visibility (performance)
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    Runner.run(runner, engine);
                    Render.run(render);
                } else {
                    Runner.stop(runner);
                    Render.stop(render);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(container);

        // Store references for cleanup
        container._matterEngine = engine;
        container._matterRender = render;
        container._matterRunner = runner;

        return { engine: engine, render: render, runner: runner };
    }

    /**
     * Create a custom Canvas-based animation (for simpler diagrams without full physics)
     * @param {string} containerId - ID of the .physics-diagram container
     * @param {Function} drawFn - Function(ctx, width, height, time, controls)
     * @param {Object} [options] - {fps, controls: [{id, min, max, value, step, label}]}
     */
    function initCanvasAnimation(containerId, drawFn, options) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var canvas = container.querySelector('canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var opts = options || {};
        var fps = opts.fps || 60;
        var interval = 1000 / fps;
        var lastTime = 0;
        var animId = null;
        var paused = false;

        // Gather control values
        var controls = {};
        var sliders = container.querySelectorAll('input[type="range"]');
        sliders.forEach(function(slider) {
            controls[slider.id] = parseFloat(slider.value);
            slider.addEventListener('input', function() {
                controls[slider.id] = parseFloat(this.value);
                var display = container.querySelector('[data-display="' + slider.id + '"]');
                if (display) display.textContent = this.value;
            });
        });

        // Animation loop
        function animate(timestamp) {
            animId = requestAnimationFrame(animate);
            if (paused) return;
            var delta = timestamp - lastTime;
            if (delta >= interval) {
                lastTime = timestamp - (delta % interval);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawFn(ctx, canvas.width, canvas.height, timestamp / 1000, controls);
            }
        }

        // Pause/resume on visibility
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                paused = !entry.isIntersecting;
            });
        }, { threshold: 0.1 });
        observer.observe(container);

        // Play/pause button
        var playBtn = container.querySelector('.diagram-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                paused = !paused;
                this.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
            });
        }

        // Reset button
        var resetBtn = container.querySelector('.diagram-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                sliders.forEach(function(slider) {
                    slider.value = slider.defaultValue;
                    controls[slider.id] = parseFloat(slider.defaultValue);
                    var display = container.querySelector('[data-display="' + slider.id + '"]');
                    if (display) display.textContent = slider.defaultValue;
                });
            });
        }

        animId = requestAnimationFrame(animate);
        return { ctx: ctx, controls: controls, canvas: canvas };
    }

    // ============================================================
    // Public API
    // ============================================================
    return {
        colors: colors,
        initDiagramatics: initDiagramatics,
        initMatterSimulation: initMatterSimulation,
        initCanvasAnimation: initCanvasAnimation
    };
})();
