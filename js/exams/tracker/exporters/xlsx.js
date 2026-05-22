// ============================================================
// ExamTrackerXlsx — Excel exporter (SheetJS)
// ============================================================

(function() {
    'use strict';

    var ExamTrackerXlsx = {};

    ExamTrackerXlsx.generate = function(trackerState, syllabus, plannerResult) {
        var topics = trackerState.getSelectedTopics(syllabus);
        var stats = trackerState.getStats(syllabus);
        var sections = groupBySections(topics);
        var wb = XLSX.utils.book_new();

        // ── Sheet 1: Topic Tracker ──────────────────────────────────
        var rows = [
            [syllabus.examName + ' \u2014 Syllabus Progress Tracker'],
            ['Candidate: ' + (trackerState.candidateName || ''), 'Target: ' + (trackerState.targetScore || ''), 'Exam Date: ' + (trackerState.examDate || '')],
            ['Syllabus Version: ' + (trackerState.syllabusVersion || '')],
            [],
            ['Section', 'Topic', 'Difficulty', 'Est. Hours', 'Status', 'Confidence (/5)', 'Notes', 'Last Reviewed', 'Target Date']
        ];

        topics.forEach(function(t) {
            var statusLabel = t.status.replace('-', ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
            rows.push([t.sectionName, t.title, t.difficulty, t.estimatedHours, statusLabel, t.confidence, t.notes || '', t.lastReviewed || '', '']);
        });

        var ws1 = XLSX.utils.aoa_to_sheet(rows);
        ws1['!cols'] = [{ wch: 28 }, { wch: 40 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 30 }, { wch: 14 }, { wch: 14 }];
        XLSX.utils.book_append_sheet(wb, ws1, 'Topic Tracker');

        // ── Sheet 2: Progress Dashboard ─────────────────────────────
        var dashRows = [
            ['Progress Dashboard'],
            [],
            ['Metric', 'Value'],
            ['Total Topics', stats.total],
            ['Mastered', stats.mastered],
            ['Confident', stats.confident],
            ['In Progress', stats.inProgress],
            ['Not Started', stats.notStarted],
            ['Total Hours', stats.totalHours],
            ['Completed Hours', stats.completedHours],
            ['Completion %', stats.total ? Math.round((stats.mastered + stats.confident) / stats.total * 100) + '%' : '0%'],
            [],
            ['Section Breakdown'],
            ['Section', 'Topics', 'Mastered', 'Confident', 'In Progress', 'Not Started', 'Completion %']
        ];

        sections.forEach(function(sec) {
            var m = sec.topics.filter(function(t) { return t.status === 'mastered'; }).length;
            var c = sec.topics.filter(function(t) { return t.status === 'confident'; }).length;
            var ip = sec.topics.filter(function(t) { return t.status === 'in-progress'; }).length;
            var ns = sec.topics.filter(function(t) { return t.status === 'not-started'; }).length;
            var pct = sec.topics.length ? Math.round((m + c) / sec.topics.length * 100) + '%' : '0%';
            dashRows.push([sec.name, sec.topics.length, m, c, ip, ns, pct]);
        });

        var ws2 = XLSX.utils.aoa_to_sheet(dashRows);
        ws2['!cols'] = [{ wch: 32 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
        XLSX.utils.book_append_sheet(wb, ws2, 'Progress Dashboard');

        // ── Sheet 3: Study Plan (dynamic from PlannerEngine) ────────
        var planRows = [
            ['Study Plan \u2014 Generated ' + (plannerResult ? plannerResult.generatedAt : 'N/A')],
            [],
            ['Assumptions'],
            ['Daily Study Time', plannerResult ? plannerResult.assumptions.dailyMinutes + ' min' : ''],
            ['Strategy', plannerResult ? plannerResult.assumptions.strategy : ''],
            ['Intensity', plannerResult ? plannerResult.assumptions.intensity : ''],
            ['Buffer', plannerResult ? plannerResult.assumptions.bufferPct : ''],
            ['Remaining Weeks', plannerResult ? plannerResult.assumptions.remainingWeeks : ''],
            ['Exam Date', plannerResult ? plannerResult.assumptions.examDate : ''],
            [],
            ['Weekly Schedule'],
            ['Week', 'Focus', 'Topics', 'Hours', 'Reasons']
        ];

        if (plannerResult && plannerResult.weeklyPlan.length) {
            plannerResult.weeklyPlan.forEach(function(week) {
                var topicNames = week.topics.map(function(t) { return t.title; }).join(', ');
                var reasons = week.topics.length ? week.topics[0].reasons.join(', ') : '';
                planRows.push(['Week ' + week.week, week.focus, topicNames, week.totalHours, reasons]);
            });
        } else {
            planRows.push(['', '', 'No plan generated yet \u2014 click Generate Study Plan', '', '']);
        }

        if (plannerResult && plannerResult.warnings.length) {
            planRows.push([]);
            planRows.push(['Warnings']);
            plannerResult.warnings.forEach(function(w) { planRows.push([w]); });
        }

        var ws3 = XLSX.utils.aoa_to_sheet(planRows);
        ws3['!cols'] = [{ wch: 10 }, { wch: 24 }, { wch: 60 }, { wch: 8 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, ws3, 'Study Plan');

        // ── Sheet 4: Settings ───────────────────────────────────────
        var settingsRows = [
            ['Settings & Reference'],
            [],
            ['Field', 'Value'],
            ['Candidate', trackerState.candidateName || ''],
            ['Target Score', trackerState.targetScore || ''],
            ['Exam Date', trackerState.examDate || ''],
            ['Daily Minutes', trackerState.planner.dailyMinutes],
            ['Strategy', trackerState.planner.strategy],
            ['Intensity', trackerState.planner.intensity],
            ['Resources', (trackerState.planner.resources || []).join(', ')],
            ['Goals', trackerState.planner.goals || ''],
            ['Generated At', trackerState.planner.generatedAt || '']
        ];

        var ws4 = XLSX.utils.aoa_to_sheet(settingsRows);
        ws4['!cols'] = [{ wch: 16 }, { wch: 50 }];
        XLSX.utils.book_append_sheet(wb, ws4, 'Settings');

        XLSX.writeFile(wb, (trackerState.candidateName || syllabus.examName).replace(/\s+/g, '-') + '-syllabus-tracker.xlsx');
    };

    function groupBySections(topics) {
        var map = {}, order = [];
        topics.forEach(function(t) {
            if (!map[t.sectionId]) { map[t.sectionId] = { id: t.sectionId, name: t.sectionName, topics: [] }; order.push(t.sectionId); }
            map[t.sectionId].topics.push(t);
        });
        return order.map(function(id) { return map[id]; });
    }

    window.ExamTrackerXlsx = ExamTrackerXlsx;
})();
