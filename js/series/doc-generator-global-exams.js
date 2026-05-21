// ============================================================
// Doc Generator — Global Exam Guide
// Series: Global Exam Guide (/pages/series/global-exams/)
// Tools:
//   1. StudyPlan      — Personalised study plan (Word/Excel/PDF/PPTX)
//   2. ScoreTracker   — Practice score tracking sheet (Excel/PDF)
//   3. ExamChecklist  — Topic revision checklist (Word/PDF)
// ============================================================

Object.assign(DocGenerator, {

    // ============================================================
    // TOOL 1: PERSONALISED STUDY PLAN GENERATOR
    // ============================================================

    generateStudyPlanWord: function(data) {
        const docxLib = window.docx;
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
                TableRow, TableCell, Table, WidthType, BorderStyle } = docxLib.default || docxLib;

        const cellBorder = {
            top:    { style: BorderStyle.SINGLE, size: 1, color: '3B9797' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: '3B9797' },
            left:   { style: BorderStyle.SINGLE, size: 1, color: '3B9797' },
            right:  { style: BorderStyle.SINGLE, size: 1, color: '3B9797' }
        };

        const headerCell = (text) => new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20 })], alignment: AlignmentType.CENTER })],
            shading: { fill: '132440' },
            borders: cellBorder
        });
        const dataCell = (text) => new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text, size: 18 })] })],
            borders: cellBorder
        });

        const examName    = data.examName    || 'My Exam';
        const targetScore = data.targetScore || 'Target Score';
        const examDate    = data.examDate    || 'TBD';
        const studyHours  = data.studyHours  || '2 hours/day';
        const weakTopics  = data.weakTopics  || 'Not specified';
        const resources   = data.resources   || 'Official prep materials';
        const goals       = data.goals       || 'Pass the exam';

        // Build 12-week plan rows
        const weeks = [
            ['Week 1–2',  'Diagnostic & Foundation', 'Take full-length diagnostic test. Review syllabus. Order/access all study materials. Identify weak areas. Set up study schedule.'],
            ['Week 3–4',  'Core Concepts — Section A', `Study core topics in ${examName} — focus on foundational theory. Complete practice exercises. Review errors daily.`],
            ['Week 5–6',  'Core Concepts — Section B', 'Advance to intermediate topics. Begin timed section drills. Focus on identified weak areas: ' + weakTopics + '.'],
            ['Week 7–8',  'Deep Practice', 'Full section practice under timed conditions. Analyse all mistakes. Use resources: ' + resources + '. Revisit weak areas.'],
            ['Week 9',    'Mock Exam 1', 'Take first full-length mock under exam conditions. Score and analyse performance. Prioritise remaining weak areas.'],
            ['Week 10',   'Targeted Review', 'Intensive review of weakest topics. Focus on question types you missed most. Practice with official materials.'],
            ['Week 11',   'Mock Exam 2', 'Second full-length mock. Compare performance to Mock 1. Identify persistent gaps. Refine timing strategy.'],
            ['Week 12',   'Final Review & Readiness', 'Light review of key formulas/concepts. No new material. Rest, logistics confirmation, mental preparation. Target: ' + targetScore + '.']
        ];

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ children: [new TextRun({ text: `Study Plan: ${examName}`, bold: true, size: 52, color: '132440' })], heading: HeadingLevel.TITLE }),
                    new Paragraph({ children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString()}`, size: 20, color: '3B9797' })] }),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: 'Plan Summary', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }),
                    new Paragraph({ children: [new TextRun({ text: `Exam: `, bold: true, size: 22 }), new TextRun({ text: examName, size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Target Score: `, bold: true, size: 22 }), new TextRun({ text: targetScore, size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Exam Date: `, bold: true, size: 22 }), new TextRun({ text: examDate, size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Daily Study: `, bold: true, size: 22 }), new TextRun({ text: studyHours, size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Goals: `, bold: true, size: 22 }), new TextRun({ text: goals, size: 22 })] }),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: '12-Week Study Schedule', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({ children: [headerCell('Period'), headerCell('Phase'), headerCell('Key Activities')], tableHeader: true }),
                            ...weeks.map(([period, phase, activities]) =>
                                new TableRow({ children: [dataCell(period), dataCell(phase), dataCell(activities)] })
                            )
                        ]
                    }),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: 'Weak Areas to Focus On', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }),
                    new Paragraph({ children: [new TextRun({ text: weakTopics, size: 22 })] }),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: 'Study Resources', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }),
                    new Paragraph({ children: [new TextRun({ text: resources, size: 22 })] }),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: 'Daily Habits for Exam Success', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }),
                    ...[
                        'Review the previous day\'s errors before starting new material',
                        'Use the Pomodoro technique: 25 minutes study, 5 minutes break',
                        'Practice under timed conditions from Week 3 onwards',
                        'Track your practice scores in a log to monitor progress',
                        'Sleep 7–8 hours — consolidation of learning happens during sleep',
                        'Exercise at least 3x per week — improves focus and retention',
                        'One full rest day per week — prevents burnout'
                    ].map(tip => new Paragraph({ children: [new TextRun({ text: `\u2713 ${tip}`, size: 20 })], bullet: { level: 0 } })),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: `Good luck with your ${examName} preparation!`, size: 18, color: '666666', italics: true })] })
                ]
            }]
        });

        Packer.toBlob(doc).then(blob => {
            this._downloadFile(blob, `${examName.replace(/\s+/g, '-')}-study-plan.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        });
    },

    generateStudyPlanExcel: function(data) {
        const examName    = data.examName    || 'My Exam';
        const targetScore = data.targetScore || '';
        const examDate    = data.examDate    || '';
        const studyHours  = data.studyHours  || '';
        const weakTopics  = data.weakTopics  || '';
        const resources   = data.resources   || '';

        const wb = XLSX.utils.book_new();

        // Sheet 1: Study Plan
        const planRows = [
            [`Study Plan: ${examName}`, '', '', ''],
            [`Generated: ${new Date().toLocaleDateString()}`, '', '', ''],
            [''],
            ['PLAN SUMMARY', '', '', ''],
            ['Exam', examName, '', ''],
            ['Target Score', targetScore, '', ''],
            ['Exam Date', examDate, '', ''],
            ['Daily Study Hours', studyHours, '', ''],
            ['Weak Topics', weakTopics, '', ''],
            ['Resources', resources, '', ''],
            [''],
            ['WEEK-BY-WEEK SCHEDULE', '', '', ''],
            ['Week', 'Phase', 'Focus Areas', 'Practice Target'],
            ['1–2', 'Diagnostic & Foundation', 'Diagnostic test, syllabus review, study setup', 'Complete 1 full diagnostic test'],
            ['3–4', 'Core Concepts A', 'Foundational topics, theory, basic exercises', '50 practice questions/day'],
            ['5–6', 'Core Concepts B', 'Intermediate topics, weak areas: ' + weakTopics, '75 practice questions/day'],
            ['7–8', 'Deep Practice', 'Timed section drills, error analysis', '1 full section per day, timed'],
            ['9',   'Mock Exam 1', 'Full mock exam + deep analysis', '1 full-length mock exam'],
            ['10',  'Targeted Review', 'Weak area intensive, official materials', '2 hours targeted weak topic review'],
            ['11',  'Mock Exam 2', 'Second mock exam, compare to Mock 1', '1 full-length mock exam'],
            ['12',  'Final Review', 'Light review, rest, logistics', 'Review key formulas only — rest!']
        ];

        const wsPlan = XLSX.utils.aoa_to_sheet(planRows);
        wsPlan['!cols'] = [{ wch: 12 }, { wch: 24 }, { wch: 40 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, wsPlan, 'Study Plan');

        // Sheet 2: Score Tracker
        const trackerRows = [
            ['PRACTICE SCORE TRACKER', '', '', '', '', ''],
            ['Exam:', examName, 'Target Score:', targetScore, '', ''],
            [''],
            ['Date', 'Practice Type', 'Section', 'Score', 'Max Score', 'Notes / Errors to Review'],
            ...Array.from({length: 20}, () => ['', '', '', '', '', ''])
        ];
        const wsTracker = XLSX.utils.aoa_to_sheet(trackerRows);
        wsTracker['!cols'] = [{ wch: 14 }, { wch: 20 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 35 }];
        XLSX.utils.book_append_sheet(wb, wsTracker, 'Score Tracker');

        // Sheet 3: Daily Log
        const logRows = [
            ['DAILY STUDY LOG', '', '', ''],
            ['Date', 'Topics Studied', 'Hours', 'Notes / Questions for Review'],
            ...Array.from({length: 90}, () => ['', '', '', ''])
        ];
        const wsLog = XLSX.utils.aoa_to_sheet(logRows);
        wsLog['!cols'] = [{ wch: 14 }, { wch: 35 }, { wch: 8 }, { wch: 40 }];
        XLSX.utils.book_append_sheet(wb, wsLog, 'Daily Log');

        XLSX.writeFile(wb, `${examName.replace(/\s+/g, '-')}-study-plan.xlsx`);
    },

    generateStudyPlanPDF: function(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const examName    = data.examName    || 'My Exam';
        const targetScore = data.targetScore || 'N/A';
        const examDate    = data.examDate    || 'TBD';
        const studyHours  = data.studyHours  || '2 hours/day';
        const weakTopics  = data.weakTopics  || 'See notes';
        const resources   = data.resources   || 'Official materials';
        const goals       = data.goals       || 'Pass the exam';

        const navy   = [19, 36, 64];
        const teal   = [59, 151, 151];
        const white  = [255, 255, 255];
        const light  = [248, 249, 250];

        // Header
        pdf.setFillColor(...navy);
        pdf.rect(0, 0, 210, 38, 'F');
        pdf.setTextColor(...white);
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Study Plan: ${examName}`, 14, 16);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);

        let y = 48;

        // Summary box
        pdf.setFillColor(...light);
        pdf.rect(10, y, 190, 44, 'F');
        pdf.setDrawColor(...teal);
        pdf.setLineWidth(0.5);
        pdf.rect(10, y, 4, 44, 'F');
        pdf.setTextColor(...navy);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Plan Summary', 18, y + 8);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const summaryItems = [
            [`Exam: ${examName}`, `Target Score: ${targetScore}`],
            [`Exam Date: ${examDate}`, `Daily Study: ${studyHours}`],
            [`Goals: ${goals}`, `Weak Topics: ${weakTopics.substring(0, 50)}`]
        ];
        summaryItems.forEach((row, i) => {
            pdf.text(row[0], 18, y + 16 + i * 9);
            pdf.text(row[1], 108, y + 16 + i * 9);
        });
        y += 52;

        // 12-week table
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...navy);
        pdf.text('12-Week Study Schedule', 14, y);
        y += 7;

        const tableHeader = ['Period', 'Phase', 'Key Activities'];
        const colWidths = [24, 38, 120];
        pdf.setFillColor(...navy);
        pdf.rect(10, y, 190, 8, 'F');
        pdf.setTextColor(...white);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        let x = 12;
        tableHeader.forEach((h, i) => { pdf.text(h, x, y + 5.5); x += colWidths[i]; });
        y += 8;

        const rows = [
            ['Wk 1–2', 'Diagnostic', 'Full diagnostic test, syllabus review, study materials setup, identify weak areas'],
            ['Wk 3–4', 'Core A', 'Foundational theory, basic exercises, daily error review'],
            ['Wk 5–6', 'Core B', `Intermediate topics, timed drills, focus on: ${weakTopics.substring(0,40)}`],
            ['Wk 7–8', 'Deep Practice', 'Full timed sections, error analysis, official resources'],
            ['Wk 9', 'Mock Exam 1', 'Full-length mock under exam conditions, deep analysis'],
            ['Wk 10', 'Targeted Review', 'Intensive weak-topic review, question-type focus'],
            ['Wk 11', 'Mock Exam 2', 'Second full mock, compare to Mock 1, refine timing'],
            ['Wk 12', 'Final Review', `Light review, logistics, rest. Target: ${targetScore}`]
        ];

        rows.forEach((row, idx) => {
            pdf.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 249 : 255, idx % 2 === 0 ? 250 : 255);
            pdf.rect(10, y, 190, 9, 'F');
            pdf.setTextColor(60, 60, 60);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);
            let cx = 12;
            row.forEach((cell, i) => {
                pdf.text(cell, cx, y + 6, { maxWidth: colWidths[i] - 3 });
                cx += colWidths[i];
            });
            y += 9;
        });

        y += 8;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...navy);
        pdf.text('Daily Success Habits', 14, y);
        y += 7;

        const habits = [
            'Review previous day\'s errors before studying new material',
            'Use Pomodoro technique: 25 min study, 5 min break',
            'Practice under timed conditions from Week 3 onwards',
            'Track all practice scores to monitor progress',
            'Sleep 7–8 hours nightly — memory consolidation happens in sleep',
            'Exercise regularly — improves focus and retention by up to 20%'
        ];
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        habits.forEach(h => {
            pdf.setTextColor(...teal);
            pdf.text('\u2713', 14, y);
            pdf.setTextColor(60, 60, 60);
            pdf.text(h, 20, y);
            y += 7;
        });

        y += 5;
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Good luck with your ${examName} preparation!`, 14, y);

        pdf.save(`${examName.replace(/\s+/g, '-')}-study-plan.pdf`);
    },

    generateStudyPlanPPTX: function(data) {
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        const examName    = data.examName    || 'My Exam';
        const targetScore = data.targetScore || 'Target';
        const examDate    = data.examDate    || 'TBD';
        const studyHours  = data.studyHours  || '2 hrs/day';
        const weakTopics  = data.weakTopics  || 'See plan';
        const goals       = data.goals       || 'Pass the exam';

        const C = { navy: '132440', crimson: 'BF092F', teal: '3B9797', blue: '16476A', light: 'F8F9FA', white: 'FFFFFF', gray: '666666' };

        // Slide 1: Title
        const s1 = pptx.addSlide();
        s1.background = { color: C.navy };
        s1.addText(`Study Plan`, { x: 0.5, y: 1.0, w: 9, h: 0.7, fontSize: 20, color: C.teal, bold: false, fontFace: 'Calibri' });
        s1.addText(examName, { x: 0.5, y: 1.6, w: 9, h: 1.1, fontSize: 40, color: C.white, bold: true, fontFace: 'Calibri', fit: 'shrink' });
        s1.addText(`Target: ${targetScore}  |  Date: ${examDate}  |  Daily: ${studyHours}`, { x: 0.5, y: 3.0, w: 9, h: 0.5, fontSize: 14, color: C.teal, fontFace: 'Calibri' });
        s1.addText(`Generated: ${new Date().toLocaleDateString()}`, { x: 0.5, y: 5.1, w: 9, h: 0.4, fontSize: 11, color: C.gray, fontFace: 'Calibri' });

        // Slide 2: 12-Week Overview
        const s2 = pptx.addSlide();
        s2.background = { color: C.white };
        s2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.55, fill: { color: C.navy } });
        s2.addText('12-Week Study Schedule', { x: 0.3, y: 0.08, w: 9, h: 0.4, fontSize: 16, color: C.white, bold: true, fontFace: 'Calibri' });

        const rows = [
            [{ text: 'Period', options: { bold: true, color: C.white, fill: C.navy } }, { text: 'Phase', options: { bold: true, color: C.white, fill: C.navy } }, { text: 'Key Focus', options: { bold: true, color: C.white, fill: C.navy } }],
            ['Weeks 1–2', 'Diagnostic & Foundation', 'Full diagnostic test, syllabus review, material setup'],
            ['Weeks 3–4', 'Core Concepts A', 'Foundational theory, basic exercises, daily review'],
            ['Weeks 5–6', 'Core Concepts B', 'Intermediate topics, timed drills, weak areas'],
            ['Weeks 7–8', 'Deep Practice', 'Timed sections, error analysis, official resources'],
            ['Week 9', 'Mock Exam 1', 'Full-length mock + deep performance analysis'],
            ['Week 10', 'Targeted Review', 'Intensive weak-topic focus, question types'],
            ['Week 11', 'Mock Exam 2', 'Second full mock, compare progress'],
            ['Week 12', 'Final Review', `Light review, rest. Target: ${targetScore}`]
        ];
        s2.addTable(rows, { x: 0.3, y: 0.65, w: 9.4, h: 4.7, fontSize: 10, fontFace: 'Calibri', colW: [1.4, 1.8, 6.2], border: { type: 'solid', color: 'E0E0E0' } });

        // Slide 3: Goals & Weak Areas
        const s3 = pptx.addSlide();
        s3.background = { color: C.white };
        s3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.55, fill: { color: C.navy } });
        s3.addText('Goals & Focus Areas', { x: 0.3, y: 0.08, w: 9, h: 0.4, fontSize: 16, color: C.white, bold: true, fontFace: 'Calibri' });
        s3.addShape(pptx.shapes.RECTANGLE, { x: 0.3, y: 0.7, w: 4.4, h: 4.6, fill: { color: 'EBF5F5' }, line: { color: C.teal, width: 1 } });
        s3.addText('Your Goals', { x: 0.5, y: 0.85, w: 4.0, h: 0.5, fontSize: 14, color: C.navy, bold: true, fontFace: 'Calibri' });
        s3.addText(goals, { x: 0.5, y: 1.4, w: 4.0, h: 3.7, fontSize: 11, color: C.navy, wrap: true, valign: 'top', fontFace: 'Calibri' });
        s3.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 0.7, w: 4.4, h: 4.6, fill: { color: 'FDECEA' }, line: { color: C.crimson, width: 1 } });
        s3.addText('Weak Areas to Fix', { x: 5.5, y: 0.85, w: 4.0, h: 0.5, fontSize: 14, color: C.crimson, bold: true, fontFace: 'Calibri' });
        s3.addText(weakTopics, { x: 5.5, y: 1.4, w: 4.0, h: 3.7, fontSize: 11, color: C.navy, wrap: true, valign: 'top', fontFace: 'Calibri' });

        // Slide 4: Daily Habits
        const s4 = pptx.addSlide();
        s4.background = { color: C.white };
        s4.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.55, fill: { color: C.teal } });
        s4.addText('Daily Habits for Exam Success', { x: 0.3, y: 0.08, w: 9.4, h: 0.4, fontSize: 16, color: C.white, bold: true, fontFace: 'Calibri' });
        const habits = [
            'Review previous day\'s errors before starting new material',
            'Pomodoro technique: 25 min study + 5 min break',
            'Practice under timed conditions from Week 3 onwards',
            'Track every practice score — monitor your progress curve',
            'Sleep 7–8 hours nightly — memory consolidation requires sleep',
            'Exercise 3x per week — improves focus and retention significantly',
            'One full rest day per week — prevents burnout and sustains quality'
        ];
        habits.forEach((h, i) => {
            s4.addShape(pptx.shapes.RECTANGLE, { x: 0.3, y: 0.65 + i * 0.67, w: 0.4, h: 0.4, fill: { color: C.teal } });
            s4.addText('\u2713', { x: 0.3, y: 0.65 + i * 0.67, w: 0.4, h: 0.4, fontSize: 12, color: C.white, bold: true, align: 'center', valign: 'middle', fontFace: 'Calibri' });
            s4.addText(h, { x: 0.8, y: 0.68 + i * 0.67, w: 9.0, h: 0.4, fontSize: 12, color: C.navy, valign: 'middle', fontFace: 'Calibri' });
        });

        pptx.writeFile({ fileName: `${examName.replace(/\s+/g, '-')}-study-plan.pptx` });
    },

    // ============================================================
    // TOOL 2: PRACTICE SCORE TRACKER
    // ============================================================

    generateScoreTrackerExcel: function(data) {
        const examName    = data.examName    || 'My Exam';
        const targetScore = data.targetScore || '';
        const examDate    = data.examDate    || '';

        const wb = XLSX.utils.book_new();

        // Score Log sheet
        const logRows = [
            [`PRACTICE SCORE TRACKER — ${examName}`, '', '', '', '', '', ''],
            [`Target Score: ${targetScore}`, `Exam Date: ${examDate}`, '', '', '', '', ''],
            [''],
            ['#', 'Date', 'Test Type', 'Section', 'Raw Score', 'Max Possible', '% Score', 'Notes'],
            ...Array.from({length: 30}, (_, i) => [`${i + 1}`, '', '', '', '', '', '', ''])
        ];
        const wsLog = XLSX.utils.aoa_to_sheet(logRows);
        wsLog['!cols'] = [{ wch: 4 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 35 }];
        XLSX.utils.book_append_sheet(wb, wsLog, 'Score Log');

        // Section Breakdown sheet
        const breakdownRows = [
            ['SECTION BREAKDOWN TRACKER', '', '', '', ''],
            [`Exam: ${examName}`, '', '', '', ''],
            [''],
            ['Date', 'Mock #', 'Section Name', 'Score', 'Max', '% Correct', 'Time Taken (min)', 'Avg per Q (sec)'],
            ...Array.from({length: 50}, () => ['', '', '', '', '', '', '', ''])
        ];
        const wsBreakdown = XLSX.utils.aoa_to_sheet(breakdownRows);
        wsBreakdown['!cols'] = [{ wch: 14 }, { wch: 8 }, { wch: 22 }, { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 18 }, { wch: 18 }];
        XLSX.utils.book_append_sheet(wb, wsBreakdown, 'Section Breakdown');

        // Error Log sheet
        const errorRows = [
            ['ERROR LOG & REVIEW TRACKER', '', '', '', ''],
            [`Exam: ${examName}`, '', '', '', ''],
            [''],
            ['Date', 'Topic / Section', 'Question Description', 'Why I Got It Wrong', 'Correct Answer / Rule', 'Reviewed?'],
            ...Array.from({length: 50}, () => ['', '', '', '', '', ''])
        ];
        const wsErrors = XLSX.utils.aoa_to_sheet(errorRows);
        wsErrors['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 10 }];
        XLSX.utils.book_append_sheet(wb, wsErrors, 'Error Log');

        XLSX.writeFile(wb, `${examName.replace(/\s+/g, '-')}-score-tracker.xlsx`);
    },

    generateScoreTrackerPDF: function(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const examName    = data.examName    || 'My Exam';
        const targetScore = data.targetScore || 'N/A';
        const examDate    = data.examDate    || 'TBD';

        const navy  = [19, 36, 64];
        const teal  = [59, 151, 151];
        const white = [255, 255, 255];

        // Header
        pdf.setFillColor(...navy);
        pdf.rect(0, 0, 297, 22, 'F');
        pdf.setTextColor(...white);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Practice Score Tracker: ${examName}`, 10, 10);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Target: ${targetScore}  |  Exam Date: ${examDate}`, 10, 18);

        let y = 30;

        // Table header
        const cols = ['#', 'Date', 'Test Type', 'Section', 'Score', 'Max', '%', 'Notes / Errors to Review'];
        const colW = [10, 26, 36, 36, 16, 16, 14, 127];
        pdf.setFillColor(...teal);
        pdf.rect(10, y, 277, 8, 'F');
        pdf.setTextColor(...white);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        let cx = 12;
        cols.forEach((col, i) => { pdf.text(col, cx, y + 5.5); cx += colW[i]; });
        y += 8;

        for (let i = 0; i < 20; i++) {
            pdf.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255);
            pdf.rect(10, y, 277, 8, 'F');
            pdf.setTextColor(180, 180, 180);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            let dx = 12;
            ['', '', '', '', '', '', '', ''].forEach((_, j) => {
                pdf.text(j === 0 ? `${i + 1}` : '', dx, y + 5.5);
                dx += colW[j];
            });
            y += 8;
        }

        pdf.save(`${examName.replace(/\s+/g, '-')}-score-tracker.pdf`);
    },

    // ============================================================
    // TOOL 3: EXAM TOPIC CHECKLIST
    // ============================================================

    generateExamChecklistWord: function(data) {
        const docxLib = window.docx;
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docxLib.default || docxLib;

        const examName    = data.examName    || 'My Exam';
        const targetScore = data.targetScore || '';
        const topics      = data.topics      || '';
        const examDate    = data.examDate    || '';

        const topicList = topics.split('\n').map(t => t.trim()).filter(Boolean);

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ children: [new TextRun({ text: `Revision Checklist: ${examName}`, bold: true, size: 48, color: '132440' })], heading: HeadingLevel.TITLE }),
                    new Paragraph({ children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString()}`, size: 20, color: '3B9797' })] }),
                    new Paragraph({ children: [new TextRun({ text: `Exam Date: ${examDate}  |  Target Score: ${targetScore}`, size: 20 })] }),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: 'How to Use This Checklist', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }),
                    new Paragraph({ children: [new TextRun({ text: 'Rate each topic: \u2717 Not started  |  \u26A0 In progress  |  \u2713 Confident  |  \u2605 Mastered', size: 20 })] }),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: 'Topics to Master', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }),
                    ...(topicList.length > 0 ? topicList.map(topic =>
                        new Paragraph({ children: [new TextRun({ text: `\u2717 ${topic}`, size: 22 })], indent: { left: 360 } })
                    ) : [
                        new Paragraph({ children: [new TextRun({ text: 'Add your topics above and regenerate.', size: 20, italics: true, color: '999999' })] })
                    ]),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: 'Review Notes', bold: true, size: 28, color: '132440' })], heading: HeadingLevel.HEADING_1 }),
                    ...Array.from({length: 12}, () => new Paragraph({ children: [new TextRun({ text: '_________________________________________________________', size: 20, color: 'CCCCCC' })] })),
                    new Paragraph({}),
                    new Paragraph({ children: [new TextRun({ text: `Good luck with your ${examName} preparation!`, size: 18, italics: true, color: '666666' })] })
                ]
            }]
        });

        Packer.toBlob(doc).then(blob => {
            this._downloadFile(blob, `${examName.replace(/\s+/g, '-')}-checklist.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        });
    },

    generateExamChecklistPDF: function(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const examName    = data.examName    || 'My Exam';
        const targetScore = data.targetScore || 'N/A';
        const topics      = data.topics      || '';
        const examDate    = data.examDate    || 'TBD';

        const navy  = [19, 36, 64];
        const teal  = [59, 151, 151];
        const white = [255, 255, 255];

        pdf.setFillColor(...navy);
        pdf.rect(0, 0, 210, 36, 'F');
        pdf.setTextColor(...white);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Revision Checklist: ${examName}`, 14, 14);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Exam Date: ${examDate}  |  Target Score: ${targetScore}`, 14, 26);
        pdf.setFontSize(9);
        pdf.text('Rate each topic: \u2717 Not started  |\u26A0 In progress  |\u2713 Confident  |\u2605 Mastered', 14, 33);

        let y = 44;
        const topicList = topics.split('\n').map(t => t.trim()).filter(Boolean);

        if (topicList.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...navy);
            pdf.text('Topics to Master', 14, y);
            y += 8;

            topicList.forEach((topic) => {
                if (y > 270) { pdf.addPage(); y = 20; }
                pdf.setDrawColor(...teal);
                pdf.setLineWidth(0.3);
                pdf.rect(14, y - 4, 5, 5);
                pdf.setTextColor(60, 60, 60);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);
                pdf.text(topic, 22, y);
                y += 9;
            });
        } else {
            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text('Add your topics in the form and regenerate.', 14, y);
            y += 9;
        }

        y += 5;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...navy);
        pdf.text('Review Notes', 14, y);
        y += 7;
        for (let i = 0; i < 8; i++) {
            if (y > 270) break;
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.3);
            pdf.line(14, y, 196, y);
            y += 9;
        }

        pdf.save(`${examName.replace(/\s+/g, '-')}-checklist.pdf`);
    }

});
