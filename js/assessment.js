/**
 * Assessment Engine — Full series assessment page
 * 
 * Loads all questions from quiz.json, presents them one-at-a-time with
 * progress bar, timer, and final results with breakdown by difficulty/type.
 * Stores results in localStorage for path-progress integration.
 */
(function() {
    'use strict';

    var PROGRESS_KEY = 'quiz-progress';
    var ASSESSMENT_KEY = 'assessment-results';

    // ─── Security ────────────────────────────────────────────────────────────────

    function decode(encoded, salt) {
        try {
            var shifted = atob(encoded);
            var json = '';
            for (var i = 0; i < shifted.length; i++) {
                json += String.fromCharCode(shifted.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
            }
            return JSON.parse(json);
        } catch (e) { return null; }
    }

    // ─── Utilities ───────────────────────────────────────────────────────────────

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function detectSeries() {
        var match = window.location.pathname.match(/\/series\/([^/]+)\//);
        return match ? match[1] : null;
    }

    function formatTime(seconds) {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // ─── State ───────────────────────────────────────────────────────────────────

    var state = {
        series: '',
        salt: '',
        title: '',
        questions: [],
        current: 0,
        answers: [],       // { qid, correct, difficulty, type }
        startTime: 0,
        elapsed: 0,
        timerInterval: null,
        started: false
    };

    // ─── DOM References ──────────────────────────────────────────────────────────

    var els = {};

    function cacheDom() {
        els.startScreen = document.getElementById('assessStart');
        els.questionScreen = document.getElementById('assessQuestion');
        els.resultScreen = document.getElementById('assessResult');
        els.startBtn = document.getElementById('assessStartBtn');
        els.questionCount = document.getElementById('assessQCount');
        els.timer = document.getElementById('assessTimer');
        els.progressBar = document.getElementById('assessProgressBar');
        els.progressText = document.getElementById('assessProgressText');
        els.qNumber = document.getElementById('assessQNum');
        els.qDifficulty = document.getElementById('assessQDiff');
        els.qType = document.getElementById('assessQType');
        els.qText = document.getElementById('assessQText');
        els.qInput = document.getElementById('assessQInput');
        els.qFeedback = document.getElementById('assessQFeedback');
        els.qNext = document.getElementById('assessNextBtn');
        els.resultScore = document.getElementById('assessScore');
        els.resultTime = document.getElementById('assessTime');
        els.resultBreakdown = document.getElementById('assessBreakdown');
        els.retryBtn = document.getElementById('assessRetryBtn');
    }

    // ─── Init ────────────────────────────────────────────────────────────────────

    function init() {
        var series = detectSeries();
        if (!series) return;
        state.series = series;

        cacheDom();

        fetch('quiz.json')
            .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(function(data) {
                state.salt = data.security && data.security.salt || '';
                state.title = data.title || series;
                state.questions = data.questions || [];
                if (els.questionCount) els.questionCount.textContent = state.questions.length;
                setupStart();
            })
            .catch(function(err) {
                if (els.startScreen) {
                    els.startScreen.innerHTML = '<div class="assess-error"><i class="fas fa-exclamation-triangle me-2"></i>Could not load assessment data.</div>';
                }
            });
    }

    function setupStart() {
        if (els.startBtn) {
            els.startBtn.addEventListener('click', startAssessment);
        }
        if (els.retryBtn) {
            els.retryBtn.addEventListener('click', function() {
                resetState();
                startAssessment();
            });
        }
        if (els.qNext) {
            els.qNext.addEventListener('click', nextQuestion);
        }
    }

    function resetState() {
        state.current = 0;
        state.answers = [];
        state.elapsed = 0;
        state.started = false;
        if (state.timerInterval) clearInterval(state.timerInterval);
    }

    // ─── Assessment Flow ─────────────────────────────────────────────────────────

    function startAssessment() {
        state.questions = shuffle(state.questions);
        state.current = 0;
        state.answers = [];
        state.started = true;
        state.startTime = Date.now();

        els.startScreen.classList.add('d-none');
        els.resultScreen.classList.add('d-none');
        els.questionScreen.classList.remove('d-none');

        // Start timer
        state.timerInterval = setInterval(function() {
            state.elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            if (els.timer) els.timer.textContent = formatTime(state.elapsed);
        }, 1000);

        showCurrentQuestion();
    }

    function showCurrentQuestion() {
        var q = state.questions[state.current];
        var total = state.questions.length;

        // Progress
        var pct = Math.round(((state.current) / total) * 100);
        els.progressBar.style.width = pct + '%';
        els.progressText.textContent = (state.current + 1) + ' / ' + total;

        // Header
        els.qNumber.textContent = 'Question ' + (state.current + 1);
        els.qDifficulty.className = 'assess-diff assess-d-' + q.difficulty;
        els.qDifficulty.textContent = q.difficulty;
        els.qType.textContent = formatType(q.type);

        // Question text
        els.qText.textContent = q.question;

        // Input area
        els.qInput.innerHTML = renderInput(q);
        bindInput(q);

        // Reset feedback & next
        els.qFeedback.innerHTML = '';
        els.qFeedback.className = 'assess-feedback';
        els.qNext.classList.add('d-none');
        els.qNext.disabled = false;
    }

    function formatType(type) {
        var map = { mcq: 'Multiple Choice', 'true-false': 'True/False', 'fill-blank': 'Fill in the Blank',
            'code-output': 'Code Output', ordering: 'Ordering', matching: 'Matching',
            scenario: 'Scenario', diagnosis: 'Diagnosis', debug: 'Debug',
            architecture: 'Architecture', calculation: 'Calculation', ethical: 'Ethical Reasoning' };
        return map[type] || type;
    }

    function nextQuestion() {
        state.current++;
        if (state.current >= state.questions.length) {
            finishAssessment();
        } else {
            showCurrentQuestion();
        }
    }

    // ─── Renderers ───────────────────────────────────────────────────────────────

    function renderInput(q) {
        switch (q.type) {
            case 'mcq': case 'scenario': case 'diagnosis': case 'debug': case 'architecture':
                return renderMCQ(q);
            case 'true-false': return renderTF();
            case 'fill-blank': case 'code-output': return renderText(q);
            case 'ordering': return renderOrdering(q);
            case 'matching': return renderMatching(q);
            case 'calculation': return renderCalc(q);
            case 'ethical': return renderEthical(q);
            default: return renderMCQ(q);
        }
    }

    function renderMCQ(q) {
        var h = '';
        if (q.type === 'scenario' && q.scenario) h += renderScenarioBox(q.scenario);
        if (q.type === 'diagnosis' && q.presentation) h += renderDiagnosisBox(q.presentation);
        if ((q.type === 'debug' || q.type === 'code-output') && q.code) h += '<pre class="assess-code"><code>' + escapeHtml(q.code) + '</code></pre>';
        if (q.type === 'architecture' && q.scenario) {
            var t = typeof q.scenario === 'string' ? q.scenario : (q.scenario.context || '');
            h += '<div class="assess-scene">' + escapeHtml(t) + '</div>';
        }
        if (q.question_followup) h += '<p class="assess-followup">' + escapeHtml(q.question_followup) + '</p>';

        h += '<div class="assess-opts">';
        q.options.forEach(function(opt, i) {
            var label = typeof opt === 'string' ? opt : opt.label;
            h += '<label class="assess-opt" data-v="' + i + '"><input type="radio" name="assess-r" value="' + i + '"><span class="assess-opt-text">' + escapeHtml(label) + '</span></label>';
        });
        h += '</div>';
        return h;
    }

    function renderTF() {
        return '<div class="assess-tf">' +
            '<button class="assess-tf-btn" data-v="true"><i class="fas fa-check me-2"></i>True</button>' +
            '<button class="assess-tf-btn" data-v="false"><i class="fas fa-times me-2"></i>False</button></div>';
    }

    function renderText(q) {
        var h = '';
        if (q.code) h += '<pre class="assess-code"><code>' + escapeHtml(q.code) + '</code></pre>';
        h += '<div class="assess-text-input"><input type="text" class="assess-tinput" placeholder="Type your answer...">' +
            '<button class="assess-submit-btn"><i class="fas fa-paper-plane me-1"></i>Submit</button></div>';
        return h;
    }

    function renderCalc(q) {
        var h = '';
        if (q.formula) h += '<div class="assess-formula"><code>' + escapeHtml(q.formula) + '</code></div>';
        h += '<div class="assess-text-input"><input type="number" step="any" class="assess-tinput" placeholder="Enter value...">' +
            (q.unit ? '<span class="assess-unit">' + escapeHtml(q.unit) + '</span>' : '') +
            '<button class="assess-submit-btn"><i class="fas fa-paper-plane me-1"></i>Submit</button></div>';
        return h;
    }

    function renderOrdering(q) {
        var items = shuffle(q.items.slice());
        var h = '<div class="assess-ordering"><p class="assess-hint">Arrange items in the correct order using the arrows.</p><ol class="assess-sortlist">';
        items.forEach(function(item) {
            h += '<li class="assess-sortitem" data-t="' + escapeHtml(item) + '">' +
                '<i class="fas fa-grip-vertical assess-grip"></i><span class="assess-sorttext">' + escapeHtml(item) + '</span>' +
                '<span class="assess-arrows"><button class="assess-up" title="Move up"><i class="fas fa-chevron-up"></i></button>' +
                '<button class="assess-dn" title="Move down"><i class="fas fa-chevron-down"></i></button></span></li>';
        });
        h += '</ol><button class="assess-submit-btn assess-submit-full"><i class="fas fa-check me-1"></i>Submit Order</button></div>';
        return h;
    }

    function renderMatching(q) {
        var right = shuffle(q.pairs.right.slice());
        var h = '<div class="assess-matching"><p class="assess-hint">Click a left item, then click its matching right item.</p><div class="assess-match-grid">';
        h += '<div class="assess-match-col">';
        q.pairs.left.forEach(function(item, i) {
            h += '<div class="assess-match-item assess-match-left" data-i="' + i + '">' + escapeHtml(item) + '</div>';
        });
        h += '</div><div class="assess-match-col">';
        right.forEach(function(item) {
            h += '<div class="assess-match-item assess-match-right" data-t="' + escapeHtml(item) + '">' + escapeHtml(item) + '</div>';
        });
        h += '</div></div><button class="assess-submit-btn assess-submit-full"><i class="fas fa-check me-1"></i>Submit Matches</button></div>';
        return h;
    }

    function renderEthical(q) {
        var h = '';
        if (typeof q.scenario === 'string') h += '<div class="assess-scene">' + escapeHtml(q.scenario) + '</div>';
        h += '<div class="assess-opts">';
        q.options.forEach(function(opt, i) {
            var label = typeof opt === 'string' ? opt : opt.label;
            var fw = (typeof opt === 'object' && opt.framework) ? ' <em class="assess-fw">' + escapeHtml(opt.framework) + '</em>' : '';
            h += '<label class="assess-opt" data-v="' + i + '"><input type="radio" name="assess-r" value="' + i + '"><span class="assess-opt-text">' + escapeHtml(label) + fw + '</span></label>';
        });
        h += '</div>';
        return h;
    }

    function renderScenarioBox(scenario) {
        var h = '<div class="assess-scene">';
        if (typeof scenario === 'string') { h += escapeHtml(scenario); }
        else {
            if (scenario.context) h += escapeHtml(scenario.context);
            if (scenario.metrics) {
                h += '<div class="assess-metrics">';
                Object.keys(scenario.metrics).forEach(function(k) {
                    h += '<span class="assess-met"><strong>' + escapeHtml(k) + ':</strong> ' + escapeHtml(String(scenario.metrics[k])) + '</span>';
                });
                h += '</div>';
            }
        }
        h += '</div>';
        return h;
    }

    function renderDiagnosisBox(pres) {
        var h = '<div class="assess-scene">';
        if (pres.context) h += '<p>' + escapeHtml(pres.context) + '</p>';
        if (pres.findings) {
            h += '<ul class="assess-findings">';
            pres.findings.forEach(function(f) { h += '<li><code>' + escapeHtml(f) + '</code></li>'; });
            h += '</ul>';
        }
        h += '</div>';
        return h;
    }

    // ─── Input Binding ───────────────────────────────────────────────────────────

    function bindInput(q) {
        var container = els.qInput;

        // MCQ / Ethical radio
        container.querySelectorAll('input[type="radio"]').forEach(function(r) {
            r.addEventListener('change', function() {
                container.querySelectorAll('.assess-opt').forEach(function(o) { o.classList.remove('selected'); });
                this.closest('.assess-opt').classList.add('selected');
                submitAnswer(this.value, q);
            });
        });

        // True/False buttons
        container.querySelectorAll('.assess-tf-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                container.querySelectorAll('.assess-tf-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                submitAnswer(this.getAttribute('data-v'), q);
            });
        });

        // Text/Calc submit
        var submitBtn = container.querySelector('.assess-submit-btn:not(.assess-submit-full)');
        var tinput = container.querySelector('.assess-tinput');
        if (submitBtn && tinput) {
            submitBtn.addEventListener('click', function() {
                if (tinput.value.trim()) submitAnswer(tinput.value, q);
            });
            tinput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim()) submitAnswer(this.value, q);
            });
        }

        // Ordering arrows
        container.querySelectorAll('.assess-up').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var li = this.closest('.assess-sortitem');
                if (li.previousElementSibling) li.parentNode.insertBefore(li, li.previousElementSibling);
            });
        });
        container.querySelectorAll('.assess-dn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var li = this.closest('.assess-sortitem');
                if (li.nextElementSibling) li.parentNode.insertBefore(li.nextElementSibling, li);
            });
        });
        var orderSubmit = container.querySelector('.assess-ordering .assess-submit-full');
        if (orderSubmit) {
            orderSubmit.addEventListener('click', function() {
                var items = container.querySelectorAll('.assess-sortitem');
                var arr = []; items.forEach(function(li) { arr.push(li.getAttribute('data-t')); });
                var correct = decode(q.answer, state.salt);
                var ok = JSON.stringify(arr) === JSON.stringify(correct);
                recordAnswer(ok, q);
            });
        }

        // Matching
        var mState = { left: null, pairs: {} };
        container.querySelectorAll('.assess-match-left').forEach(function(el) {
            el.addEventListener('click', function() {
                container.querySelectorAll('.assess-match-left').forEach(function(e) { e.classList.remove('selected'); });
                this.classList.add('selected');
                mState.left = parseInt(this.getAttribute('data-i'));
            });
        });
        container.querySelectorAll('.assess-match-right').forEach(function(el) {
            el.addEventListener('click', function() {
                if (mState.left === null) return;
                this.classList.add('paired');
                container.querySelector('.assess-match-left[data-i="' + mState.left + '"]').classList.add('paired');
                mState.pairs[mState.left] = this.getAttribute('data-t');
                mState.left = null;
                container.querySelectorAll('.assess-match-left').forEach(function(e) { e.classList.remove('selected'); });
            });
        });
        var matchSubmit = container.querySelector('.assess-matching .assess-submit-full');
        if (matchSubmit) {
            matchSubmit.addEventListener('click', function() {
                var correctMap = decode(q.answer, state.salt);
                var ok = q.pairs.left.every(function(_, i) {
                    if (Array.isArray(correctMap)) {
                        var ci = Array.isArray(correctMap[i]) ? correctMap[i][1] : correctMap[i];
                        return mState.pairs[i] === q.pairs.right[ci];
                    }
                    return mState.pairs[i] === q.pairs.right[i];
                });
                recordAnswer(ok, q);
            });
        }
    }

    // ─── Answer Checking ─────────────────────────────────────────────────────────

    function submitAnswer(ans, q) {
        var correct = decode(q.answer, state.salt);
        var ok = false;

        switch (q.type) {
            case 'mcq': case 'scenario': case 'diagnosis': case 'debug': case 'architecture':
                ok = parseInt(ans) === correct; break;
            case 'true-false':
                ok = (ans === 'true') === correct; break;
            case 'fill-blank': case 'code-output':
                var n = ans.trim().toLowerCase();
                ok = n === String(correct).toLowerCase();
                if (!ok && q.acceptAlso) ok = q.acceptAlso.some(function(a) { return n === a.toLowerCase(); });
                break;
            case 'calculation':
                var num = parseFloat(ans);
                ok = !isNaN(num) && Math.abs(num - correct) <= (q.tolerance || 0); break;
            case 'ethical': ok = true; break;
            default: ok = parseInt(ans) === correct;
        }

        recordAnswer(ok, q);
    }

    function recordAnswer(ok, q) {
        state.answers.push({
            qid: q.id,
            correct: ok,
            difficulty: q.difficulty,
            type: q.type
        });

        // Show feedback
        var isEthical = q.type === 'ethical';
        els.qFeedback.className = 'assess-feedback ' + (ok ? 'assess-fb-correct' : 'assess-fb-wrong');
        els.qFeedback.innerHTML =
            '<div class="assess-fb-header">' +
                '<i class="fas ' + (ok ? 'fa-check-circle' : 'fa-times-circle') + ' me-2"></i>' +
                '<strong>' + (isEthical ? 'Thoughtful response!' : (ok ? 'Correct!' : 'Incorrect')) + '</strong>' +
            '</div>' +
            (q.explanation ? '<p class="assess-fb-exp">' + q.explanation + '</p>' : '');

        // Disable inputs
        els.qInput.querySelectorAll('input, button, .assess-opt, .assess-tf-btn').forEach(function(el) {
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.7';
        });

        // Show next button
        els.qNext.classList.remove('d-none');
        els.qNext.textContent = (state.current + 1 >= state.questions.length) ? 'See Results' : 'Next Question';
    }

    // ─── Finish & Results ────────────────────────────────────────────────────────

    function finishAssessment() {
        clearInterval(state.timerInterval);

        els.questionScreen.classList.add('d-none');
        els.resultScreen.classList.remove('d-none');

        var total = state.answers.length;
        var correct = state.answers.filter(function(a) { return a.correct; }).length;
        var pct = Math.round((correct / total) * 100);

        // Score
        els.resultScore.innerHTML =
            '<div class="assess-score-circle assess-grade-' + getGrade(pct) + '">' +
                '<span class="assess-score-pct">' + pct + '%</span>' +
                '<span class="assess-score-label">' + correct + '/' + total + '</span>' +
            '</div>' +
            '<div class="assess-grade-text">' + getGradeLabel(pct) + '</div>';

        // Time
        els.resultTime.innerHTML = '<i class="fas fa-clock me-2"></i>Completed in ' + formatTime(state.elapsed);

        // Breakdown
        els.resultBreakdown.innerHTML = buildBreakdown();

        // Save results
        saveResults(pct, correct, total);
    }

    function getGrade(pct) {
        if (pct >= 90) return 'a';
        if (pct >= 75) return 'b';
        if (pct >= 60) return 'c';
        return 'd';
    }

    function getGradeLabel(pct) {
        if (pct >= 90) return 'Excellent!';
        if (pct >= 75) return 'Great Job!';
        if (pct >= 60) return 'Good Effort';
        return 'Keep Practicing';
    }

    function buildBreakdown() {
        var h = '';

        // By difficulty
        var byDiff = {};
        state.answers.forEach(function(a) {
            if (!byDiff[a.difficulty]) byDiff[a.difficulty] = { total: 0, correct: 0 };
            byDiff[a.difficulty].total++;
            if (a.correct) byDiff[a.difficulty].correct++;
        });

        h += '<div class="assess-breakdown-section">';
        h += '<h4><i class="fas fa-layer-group me-2"></i>By Difficulty</h4>';
        h += '<div class="assess-breakdown-grid">';
        ['beginner', 'intermediate', 'advanced'].forEach(function(diff) {
            if (byDiff[diff]) {
                var p = Math.round((byDiff[diff].correct / byDiff[diff].total) * 100);
                h += '<div class="assess-breakdown-card">' +
                    '<span class="assess-bd-label assess-d-' + diff + '">' + diff + '</span>' +
                    '<span class="assess-bd-score">' + byDiff[diff].correct + '/' + byDiff[diff].total + '</span>' +
                    '<div class="assess-bd-bar"><div class="assess-bd-fill assess-bd-fill-' + diff + '" style="width:' + p + '%"></div></div>' +
                    '</div>';
            }
        });
        h += '</div></div>';

        // By type
        var byType = {};
        state.answers.forEach(function(a) {
            if (!byType[a.type]) byType[a.type] = { total: 0, correct: 0 };
            byType[a.type].total++;
            if (a.correct) byType[a.type].correct++;
        });

        h += '<div class="assess-breakdown-section">';
        h += '<h4><i class="fas fa-th-list me-2"></i>By Question Type</h4>';
        h += '<div class="assess-breakdown-grid">';
        Object.keys(byType).forEach(function(type) {
            var p = Math.round((byType[type].correct / byType[type].total) * 100);
            h += '<div class="assess-breakdown-card">' +
                '<span class="assess-bd-label">' + formatType(type) + '</span>' +
                '<span class="assess-bd-score">' + byType[type].correct + '/' + byType[type].total + '</span>' +
                '<div class="assess-bd-bar"><div class="assess-bd-fill" style="width:' + p + '%"></div></div>' +
                '</div>';
        });
        h += '</div></div>';

        return h;
    }

    function saveResults(pct, correct, total) {
        try {
            var d = JSON.parse(localStorage.getItem(ASSESSMENT_KEY) || '{}');
            if (!d[state.series]) d[state.series] = [];
            d[state.series].push({
                date: new Date().toISOString(),
                score: pct,
                correct: correct,
                total: total,
                time: state.elapsed
            });
            // Keep last 10 attempts per series
            if (d[state.series].length > 10) d[state.series] = d[state.series].slice(-10);
            localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(d));
        } catch (e) {}
    }

    // ─── Boot ────────────────────────────────────────────────────────────────────

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();
