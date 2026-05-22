// ============================================================
// ExamTracker — Main engine wiring UI ↔ State ↔ Exporters
// ============================================================

(function() {
    'use strict';

    var ExamTracker = {};

    /**
     * Initialize tracker for an exam page
     * @param {string} examKey — key into window.ExamSyllabus
     * @param {string} containerId — DOM ID for the topic selector UI
     */
    ExamTracker.init = function(examKey, containerId) {
        if (!window.ExamSyllabus || !window.ExamSyllabus[examKey]) {
            console.warn('[ExamTracker] Syllabus not found for: ' + examKey);
            return;
        }
        ExamTrackerUI.render(examKey, containerId);
    };

    /**
     * Generate Word document
     */
    ExamTracker.generateWord = function(containerId) {
        var result = getStateAndSyllabus(containerId);
        if (!result) return;
        var plannerResult = getOrComputePlan(containerId, result);
        ExamTrackerDocx.generate(result.state, result.syllabus, plannerResult);
    };

    /**
     * Generate PDF document
     */
    ExamTracker.generatePDF = function(containerId) {
        var result = getStateAndSyllabus(containerId);
        if (!result) return;
        var plannerResult = getOrComputePlan(containerId, result);
        ExamTrackerPdf.generate(result.state, result.syllabus, plannerResult);
    };

    /**
     * Generate Excel document
     */
    ExamTracker.generateExcel = function(containerId) {
        var result = getStateAndSyllabus(containerId);
        if (!result) return;
        var plannerResult = getOrComputePlan(containerId, result);
        ExamTrackerXlsx.generate(result.state, result.syllabus, plannerResult);
    };

    /**
     * Reset tracker state
     */
    ExamTracker.reset = function(examKey, containerId) {
        var container = document.getElementById(containerId);
        if (!container || !container._state) return;
        container._state.reset();
        var syllabus = (window.ExamSyllabus || {})[examKey];
        if (syllabus) {
            container._state.loadFromSyllabus(syllabus);
            ExamTrackerUI.render(examKey, containerId);
        }
    };

    // ── Internal ─────────────────────────────────────────────────

    function getStateAndSyllabus(containerId) {
        var state = ExamTrackerUI.getState(containerId);
        if (!state) { alert('Please wait for the tracker to load.'); return null; }
        var syllabus = (window.ExamSyllabus || {})[state.examId];
        if (!syllabus) { alert('Syllabus data not available.'); return null; }
        state.save();
        return { state: state, syllabus: syllabus };
    }

    function getOrComputePlan(containerId, result) {
        // Use cached plannerResult from UI if available, otherwise compute fresh
        var container = document.getElementById(containerId);
        if (container && container._plannerResult) return container._plannerResult;
        if (window.PlannerEngine) return PlannerEngine.compute(result.state, result.syllabus);
        return null;
    }

    window.ExamTracker = ExamTracker;
})();
