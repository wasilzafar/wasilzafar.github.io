// ============================================================
// ExamTrackerDocx — Word document exporter
// ============================================================

(function() {
    'use strict';

    var ExamTrackerDocx = {};

    ExamTrackerDocx.generate = function(trackerState, syllabus, plannerResult) {
        var docxLib = window.docx;
        var lib = docxLib.default || docxLib;
        var Document = lib.Document, Packer = lib.Packer, Paragraph = lib.Paragraph,
            TextRun = lib.TextRun, HeadingLevel = lib.HeadingLevel,
            Table = lib.Table, TableRow = lib.TableRow, TableCell = lib.TableCell,
            WidthType = lib.WidthType, BorderStyle = lib.BorderStyle, AlignmentType = lib.AlignmentType;

        var topics = trackerState.getSelectedTopics(syllabus);
        var stats = trackerState.getStats(syllabus);
        var sections = groupBySections(topics);

        var cellBorder = { top: { style: BorderStyle.SINGLE, size: 1, color: '3B9797' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: '3B9797' }, left: { style: BorderStyle.SINGLE, size: 1, color: '3B9797' }, right: { style: BorderStyle.SINGLE, size: 1, color: '3B9797' } };

        var children = [];

        // Title
        children.push(new Paragraph({ children: [new TextRun({ text: syllabus.examName + ' — Syllabus Progress Tracker', bold: true, size: 48, color: '132440' })], heading: HeadingLevel.TITLE }));
        children.push(new Paragraph({ children: [new TextRun({ text: 'Generated: ' + new Date().toLocaleDateString(), size: 20, color: '3B9797' })] }));

        // Candidate info
        if (trackerState.candidateName || trackerState.targetScore || trackerState.examDate) {
            children.push(new Paragraph({}));
            if (trackerState.candidateName) children.push(new Paragraph({ children: [new TextRun({ text: 'Candidate: ', bold: true, size: 22 }), new TextRun({ text: trackerState.candidateName, size: 22 })] }));
            if (trackerState.targetScore) children.push(new Paragraph({ children: [new TextRun({ text: 'Target: ', bold: true, size: 22 }), new TextRun({ text: trackerState.targetScore, size: 22 })] }));
            if (trackerState.examDate) children.push(new Paragraph({ children: [new TextRun({ text: 'Exam Date: ', bold: true, size: 22 }), new TextRun({ text: trackerState.examDate, size: 22 })] }));
        }

        // Summary
        children.push(new Paragraph({}));
        children.push(new Paragraph({ children: [new TextRun({ text: 'Progress Summary', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }));
        children.push(new Paragraph({ children: [new TextRun({ text: 'Total Topics: ' + stats.total + ' | Estimated Hours: ' + stats.totalHours + 'h | Completed: ' + (stats.mastered + stats.confident) + ' (' + (stats.total ? Math.round((stats.mastered + stats.confident) / stats.total * 100) : 0) + '%)', size: 20 })] }));

        // Per-section tables
        sections.forEach(function(sec) {
            children.push(new Paragraph({}));
            children.push(new Paragraph({ children: [new TextRun({ text: sec.name, bold: true, size: 26, color: '16476A' })], heading: HeadingLevel.HEADING_2 }));

            var headerRow = new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Topic', bold: true, color: 'FFFFFF', size: 18 })] })], shading: { fill: '132440' }, borders: cellBorder }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Hours', bold: true, color: 'FFFFFF', size: 18 })], alignment: AlignmentType.CENTER })], shading: { fill: '132440' }, borders: cellBorder, width: { size: 10, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true, color: 'FFFFFF', size: 18 })], alignment: AlignmentType.CENTER })], shading: { fill: '132440' }, borders: cellBorder, width: { size: 18, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Confidence', bold: true, color: 'FFFFFF', size: 18 })], alignment: AlignmentType.CENTER })], shading: { fill: '132440' }, borders: cellBorder, width: { size: 14, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Notes', bold: true, color: 'FFFFFF', size: 18 })] })], shading: { fill: '132440' }, borders: cellBorder, width: { size: 25, type: WidthType.PERCENTAGE } })
                ],
                tableHeader: true
            });

            var dataRows = sec.topics.map(function(t) {
                var statusLabel = t.status.replace('-', ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                return new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t.title, size: 18 })] })], borders: cellBorder }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(t.estimatedHours), size: 18 })], alignment: AlignmentType.CENTER })], borders: cellBorder }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: statusLabel, size: 18 })], alignment: AlignmentType.CENTER })], borders: cellBorder }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t.confidence + '/5', size: 18 })], alignment: AlignmentType.CENTER })], borders: cellBorder }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t.notes || '', size: 18 })] })], borders: cellBorder })
                    ]
                });
            });

            children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow].concat(dataRows) }));
        });

        // ── Study Plan Section ───────────────────────────────────────
        if (plannerResult && !plannerResult.allComplete) {
            children.push(new Paragraph({}));
            children.push(new Paragraph({ children: [new TextRun({ text: 'Personalised Study Plan', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }));

            // Assumptions
            children.push(new Paragraph({ children: [
                new TextRun({ text: 'Plan Assumptions: ', bold: true, size: 20 }),
                new TextRun({ text: plannerResult.assumptions.dailyMinutes + ' min/day \u00b7 ' + plannerResult.assumptions.strategy + ' \u00b7 ' + plannerResult.assumptions.intensity + ' intensity \u00b7 ' + plannerResult.assumptions.bufferPct + ' buffer \u00b7 ' + plannerResult.assumptions.remainingWeeks + ' weeks remaining \u00b7 Generated ' + plannerResult.assumptions.generatedAt, size: 20, color: '3B9797' })
            ] }));

            // Warnings
            if (plannerResult.warnings.length) {
                plannerResult.warnings.forEach(function(w) {
                    children.push(new Paragraph({ children: [new TextRun({ text: '\u26a0 ' + w, size: 20, color: 'BF092F', italics: true })] }));
                });
            }

            // Weak topics
            if (plannerResult.weakTopics.length) {
                children.push(new Paragraph({}));
                children.push(new Paragraph({ children: [new TextRun({ text: 'Priority Weak Topics', bold: true, size: 24, color: 'BF092F' })], heading: HeadingLevel.HEADING_2 }));
                plannerResult.weakTopics.forEach(function(t) {
                    var reasonStr = t.reasons.join(', ');
                    children.push(new Paragraph({ children: [
                        new TextRun({ text: '\u2022 ' + t.title, bold: true, size: 20 }),
                        new TextRun({ text: ' \u2014 ' + reasonStr, size: 18, color: '666666' })
                    ] }));
                });
            }

            // Weekly schedule
            if (plannerResult.weeklyPlan.length) {
                children.push(new Paragraph({}));
                children.push(new Paragraph({ children: [new TextRun({ text: 'Weekly Schedule', bold: true, size: 24, color: '16476A' })], heading: HeadingLevel.HEADING_2 }));

                plannerResult.weeklyPlan.forEach(function(week) {
                    var topicNames = week.topics.map(function(t) { return t.title; }).join(', ');
                    children.push(new Paragraph({ children: [
                        new TextRun({ text: 'Week ' + week.week + ' \u2014 ', bold: true, size: 20, color: '3B9797' }),
                        new TextRun({ text: week.focus, bold: true, size: 20 }),
                        new TextRun({ text: ' (' + week.totalHours + 'h)', size: 20, color: '666666' })
                    ] }));
                    if (topicNames) {
                        children.push(new Paragraph({ children: [new TextRun({ text: topicNames, size: 18, color: '444444' })], indent: { left: 360 } }));
                    }
                });
            }
        } else if (plannerResult && plannerResult.allComplete) {
            children.push(new Paragraph({}));
            children.push(new Paragraph({ children: [new TextRun({ text: '\ud83c\udfc6 All topics mastered! Congratulations!', bold: true, size: 24, color: '3B9797' })] }));
        }

        var doc = new Document({ sections: [{ properties: {}, children: children }] });
        Packer.toBlob(doc).then(function(blob) {
            DocGenerator._downloadFile(blob, (trackerState.candidateName || syllabus.examName).replace(/\s+/g, '-') + '-syllabus-tracker.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        });
    };

    function groupBySections(topics) {
        var map = {};
        var order = [];
        topics.forEach(function(t) {
            if (!map[t.sectionId]) { map[t.sectionId] = { id: t.sectionId, name: t.sectionName, topics: [] }; order.push(t.sectionId); }
            map[t.sectionId].topics.push(t);
        });
        return order.map(function(id) { return map[id]; });
    }

    window.ExamTrackerDocx = ExamTrackerDocx;
})();
