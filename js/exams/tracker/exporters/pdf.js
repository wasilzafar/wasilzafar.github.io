// ============================================================
// ExamTrackerPdf — PDF exporter (jsPDF)
// ============================================================

(function() {
    'use strict';

    var ExamTrackerPdf = {};

    ExamTrackerPdf.generate = function(trackerState, syllabus, plannerResult) {
        var jsPDF = window.jspdf.jsPDF;
        var pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        var navy = [19, 36, 64], teal = [59, 151, 151], white = [255, 255, 255], light = [248, 249, 250];
        var topics = trackerState.getSelectedTopics(syllabus);
        var stats = trackerState.getStats(syllabus);
        var sections = groupBySections(topics);
        var pct = stats.total ? Math.round((stats.mastered + stats.confident) / stats.total * 100) : 0;

        // Page 1: Header
        pdf.setFillColor.apply(pdf, navy);
        pdf.rect(0, 0, 297, 28, 'F');
        pdf.setTextColor.apply(pdf, white);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(syllabus.examName + ' \u2014 Syllabus Progress Tracker', 10, 12);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        var info = [];
        if (trackerState.candidateName) info.push('Candidate: ' + trackerState.candidateName);
        if (trackerState.targetScore) info.push('Target: ' + trackerState.targetScore);
        if (trackerState.examDate) info.push('Date: ' + trackerState.examDate);
        info.push(stats.total + ' topics \u00b7 ' + stats.totalHours + 'h \u00b7 ' + pct + '% complete');
        pdf.text(info.join('  |  '), 10, 22);

        var y = 36;
        var pageH = 200; // usable height in landscape A4 (210 total)
        var colW = [100, 16, 32, 20, 110]; // topic, hours, status, conf, notes
        var tableW = colW.reduce(function(a, b) { return a + b; }, 0);

        sections.forEach(function(sec) {
            // Section header
            if (y > pageH - 20) { pdf.addPage(); y = 15; }
            pdf.setFillColor.apply(pdf, teal);
            pdf.rect(10, y, tableW, 8, 'F');
            pdf.setTextColor.apply(pdf, white);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text(sec.name + ' (' + sec.topics.length + ' topics)', 12, y + 5.5);
            y += 8;

            // Column headers
            pdf.setFillColor.apply(pdf, navy);
            pdf.rect(10, y, tableW, 7, 'F');
            pdf.setTextColor.apply(pdf, white);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            var headers = ['Topic', 'Hours', 'Status', 'Conf.', 'Notes'];
            var cx = 12;
            headers.forEach(function(h, i) { pdf.text(h, cx, y + 5); cx += colW[i]; });
            y += 7;

            // Rows
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            sec.topics.forEach(function(t) {
                if (y > pageH) { pdf.addPage(); y = 15; }
                var rowIdx = sec.topics.indexOf(t);
                pdf.setFillColor(rowIdx % 2 === 0 ? 248 : 255, rowIdx % 2 === 0 ? 249 : 255, rowIdx % 2 === 0 ? 250 : 255);
                pdf.rect(10, y, tableW, 7, 'F');
                pdf.setTextColor(50, 50, 50);
                cx = 12;
                var statusLabel = t.status.replace('-', ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                var row = [t.title.substring(0, 50), String(t.estimatedHours), statusLabel, t.confidence + '/5', (t.notes || '').substring(0, 55)];
                row.forEach(function(cell, i) { pdf.text(cell, cx, y + 5, { maxWidth: colW[i] - 4 }); cx += colW[i]; });
                y += 7;
            });

            y += 4;
        });

        // ── Study Plan Pages ──────────────────────────────────────
        if (plannerResult && !plannerResult.allComplete && plannerResult.weeklyPlan.length) {
            pdf.addPage();
            y = 15;

            // Plan header
            pdf.setFillColor.apply(pdf, navy);
            pdf.rect(0, 0, 297, 22, 'F');
            pdf.setTextColor.apply(pdf, white);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Study Plan \u2014 ' + plannerResult.assumptions.remainingWeeks + ' Weeks', 10, 10);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(
                plannerResult.assumptions.dailyMinutes + ' min/day \u00b7 ' +
                plannerResult.assumptions.strategy + ' \u00b7 ' +
                plannerResult.assumptions.intensity + ' \u00b7 ' +
                plannerResult.assumptions.bufferPct + ' buffer \u00b7 ' +
                'Generated ' + plannerResult.assumptions.generatedAt,
                10, 17
            );
            y = 28;

            // Warnings
            if (plannerResult.warnings.length) {
                pdf.setTextColor(191, 9, 47);
                pdf.setFontSize(8);
                plannerResult.warnings.forEach(function(w) {
                    pdf.text('\u26a0 ' + w, 10, y);
                    y += 5;
                });
                y += 3;
            }

            // Weekly schedule rows
            plannerResult.weeklyPlan.forEach(function(week) {
                if (y > pageH - 10) { pdf.addPage(); y = 15; }
                // Week header bar
                pdf.setFillColor.apply(pdf, teal);
                pdf.rect(10, y, 270, 7, 'F');
                pdf.setTextColor.apply(pdf, white);
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Week ' + week.week + ' \u2014 ' + week.focus + ' (' + week.totalHours + 'h)', 12, y + 5);
                y += 7;

                // Topic list
                pdf.setTextColor(50, 50, 50);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'normal');
                week.topics.forEach(function(t) {
                    if (y > pageH) { pdf.addPage(); y = 15; }
                    pdf.text('\u2022 ' + t.title + ' (' + t.hours + 'h)', 14, y + 4);
                    y += 5;
                });
                if (week.topics.length === 0) {
                    pdf.text('Review, mock exams & consolidation', 14, y + 4);
                    y += 5;
                }
                y += 3;
            });

            // Weak topics summary
            if (plannerResult.weakTopics.length) {
                if (y > pageH - 30) { pdf.addPage(); y = 15; }
                y += 5;
                pdf.setFillColor(191, 9, 47);
                pdf.rect(10, y, 270, 7, 'F');
                pdf.setTextColor.apply(pdf, white);
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Priority Weak Topics', 12, y + 5);
                y += 7;

                pdf.setTextColor(50, 50, 50);
                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'normal');
                plannerResult.weakTopics.forEach(function(t) {
                    if (y > pageH) { pdf.addPage(); y = 15; }
                    pdf.text('\u2022 ' + t.title + ' \u2014 ' + t.reasons.join(', '), 14, y + 4);
                    y += 5;
                });
            }
        }

        pdf.save((trackerState.candidateName || syllabus.examName).replace(/\s+/g, '-') + '-syllabus-tracker.pdf');
    };

    function groupBySections(topics) {
        var map = {}, order = [];
        topics.forEach(function(t) {
            if (!map[t.sectionId]) { map[t.sectionId] = { id: t.sectionId, name: t.sectionName, topics: [] }; order.push(t.sectionId); }
            map[t.sectionId].topics.push(t);
        });
        return order.map(function(id) { return map[id]; });
    }

    window.ExamTrackerPdf = ExamTrackerPdf;
})();
