/**
 * Quiz Widget — Compact floating teaser (one question at a time)
 * 
 * Shows a small pill/card in bottom-right with a single question.
 * User answers → next question slides in. Minimize or dismiss anytime.
 * Auto-detects series from URL. No HTML needed — just load the script.
 */
(function() {
    'use strict';

    var TRIGGER_DELAY = 3000;
    var DISMISS_KEY = 'quiz-widget-dismissed';
    var PROGRESS_KEY = 'quiz-progress';
    var QUESTION_COUNT = 3;
    var FEEDBACK_DELAY_CORRECT = 3000;
    var FEEDBACK_DELAY_INCORRECT = 4000;

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

    function encode(answer, salt) {
        var json = JSON.stringify(answer);
        var shifted = '';
        for (var i = 0; i < json.length; i++) {
            shifted += String.fromCharCode(json.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
        }
        return btoa(shifted);
    }

    window.QuizEncode = encode;

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

    function isDismissed(series) {
        try { return JSON.parse(sessionStorage.getItem(DISMISS_KEY) || '{}')[series] === true; }
        catch (e) { return false; }
    }

    function setDismissed(series) {
        try {
            var d = JSON.parse(sessionStorage.getItem(DISMISS_KEY) || '{}');
            d[series] = true;
            sessionStorage.setItem(DISMISS_KEY, JSON.stringify(d));
        } catch (e) {}
    }

    function trackAnswer(qid, correct, series) {
        try {
            var d = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
            if (!d[series]) d[series] = { answered: {}, score: 0, total: 0 };
            d[series].answered[qid] = correct;
            if (correct) d[series].score++;
            d[series].total++;
            d[series].lastActive = new Date().toISOString();
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(d));
        } catch (e) {}
    }

    // ─── Renderers (one question at a time, compact) ─────────────────────────────

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
        // Scenario/diagnosis/debug preamble
        if (q.type === 'scenario' && q.scenario) h += renderScenarioBox(q.scenario);
        if (q.type === 'diagnosis' && q.presentation) h += renderDiagnosisBox(q.presentation);
        if ((q.type === 'debug' || q.type === 'code-output') && q.code) h += '<pre class="qw-code"><code>' + escapeHtml(q.code) + '</code></pre>';
        if (q.type === 'architecture' && q.scenario) {
            var t = typeof q.scenario === 'string' ? q.scenario : (q.scenario.context || '');
            h += '<div class="qw-scene">' + escapeHtml(t) + '</div>';
        }
        if (q.question_followup) h += '<p class="qw-q-sub">' + escapeHtml(q.question_followup) + '</p>';

        h += '<div class="qw-opts">';
        q.options.forEach(function(opt, i) {
            var label = typeof opt === 'string' ? opt : opt.label;
            h += '<label class="qw-opt" data-v="' + i + '"><input type="radio" name="qw-r" value="' + i + '"><span>' + escapeHtml(label) + '</span></label>';
        });
        h += '</div>';
        return h;
    }

    function renderTF() {
        return '<div class="qw-tf">' +
            '<button class="qw-tf-b" data-v="true"><i class="fas fa-check"></i> True</button>' +
            '<button class="qw-tf-b" data-v="false"><i class="fas fa-times"></i> False</button></div>';
    }

    function renderText(q) {
        var h = '';
        if (q.code) h += '<pre class="qw-code"><code>' + escapeHtml(q.code) + '</code></pre>';
        h += '<div class="qw-inp"><input type="' + (q.type === 'calculation' ? 'number' : 'text') + '" class="qw-tinput" placeholder="Your answer...">' +
            '<button class="qw-go"><i class="fas fa-arrow-right"></i></button></div>';
        return h;
    }

    function renderCalc(q) {
        var h = '';
        if (q.formula) h += '<div class="qw-formula"><code>' + escapeHtml(q.formula) + '</code></div>';
        h += '<div class="qw-inp"><input type="number" class="qw-tinput" placeholder="Value" step="any">' +
            (q.unit ? '<span class="qw-unit">' + escapeHtml(q.unit) + '</span>' : '') +
            '<button class="qw-go"><i class="fas fa-arrow-right"></i></button></div>';
        return h;
    }

    function renderOrdering(q) {
        var items = shuffle(q.items.slice());
        var h = '<div class="qw-order"><ol class="qw-slist">';
        items.forEach(function(item) {
            h += '<li class="qw-sli" data-t="' + escapeHtml(item) + '">' +
                '<i class="fas fa-grip-vertical qw-grip"></i><span>' + escapeHtml(item) + '</span>' +
                '<span class="qw-arrows"><button class="qw-up"><i class="fas fa-chevron-up"></i></button>' +
                '<button class="qw-dn"><i class="fas fa-chevron-down"></i></button></span></li>';
        });
        h += '</ol><button class="qw-go qw-go-full"><i class="fas fa-check me-1"></i>Submit</button></div>';
        return h;
    }

    function renderMatching(q) {
        var right = shuffle(q.pairs.right.slice());
        var h = '<div class="qw-match"><p class="qw-mhint">Tap left → tap matching right</p><div class="qw-mgrid">';
        h += '<div class="qw-mcol">';
        q.pairs.left.forEach(function(item, i) {
            h += '<div class="qw-mi qw-ml" data-i="' + i + '">' + escapeHtml(item) + '</div>';
        });
        h += '</div><div class="qw-mcol">';
        right.forEach(function(item) {
            h += '<div class="qw-mi qw-mr" data-t="' + escapeHtml(item) + '">' + escapeHtml(item) + '</div>';
        });
        h += '</div></div><button class="qw-go qw-go-full"><i class="fas fa-check me-1"></i>Submit</button></div>';
        return h;
    }

    function renderEthical(q) {
        var h = '';
        if (typeof q.scenario === 'string') h += '<div class="qw-scene">' + escapeHtml(q.scenario) + '</div>';
        h += '<div class="qw-opts">';
        q.options.forEach(function(opt, i) {
            var label = typeof opt === 'string' ? opt : opt.label;
            var fw = (typeof opt === 'object' && opt.framework) ? ' <em class="qw-fw">' + escapeHtml(opt.framework) + '</em>' : '';
            h += '<label class="qw-opt" data-v="' + i + '"><input type="radio" name="qw-r" value="' + i + '"><span>' + escapeHtml(label) + fw + '</span></label>';
        });
        h += '</div>';
        return h;
    }

    function renderScenarioBox(scenario) {
        var h = '<div class="qw-scene">';
        if (typeof scenario === 'string') { h += escapeHtml(scenario); }
        else {
            if (scenario.context) h += escapeHtml(scenario.context);
            if (scenario.metrics) {
                h += '<div class="qw-metrics">';
                Object.keys(scenario.metrics).forEach(function(k) {
                    h += '<span class="qw-met"><b>' + escapeHtml(k) + ':</b> ' + escapeHtml(String(scenario.metrics[k])) + '</span>';
                });
                h += '</div>';
            }
        }
        h += '</div>';
        return h;
    }

    function renderDiagnosisBox(pres) {
        var h = '<div class="qw-scene">';
        if (pres.context) h += '<p>' + escapeHtml(pres.context) + '</p>';
        if (pres.findings) {
            h += '<ul class="qw-findings">';
            pres.findings.forEach(function(f) { h += '<li><code>' + escapeHtml(f) + '</code></li>'; });
            h += '</ul>';
        }
        h += '</div>';
        return h;
    }

    // ─── Answer Checking ─────────────────────────────────────────────────────────

    function check(q, ans, salt) {
        var correct = decode(q.answer, salt);
        switch (q.type) {
            case 'mcq': case 'scenario': case 'diagnosis': case 'debug': case 'architecture':
                return parseInt(ans) === correct;
            case 'true-false':
                return (ans === 'true') === correct;
            case 'fill-blank': case 'code-output':
                var n = ans.trim().toLowerCase();
                if (n === String(correct).toLowerCase()) return true;
                return q.acceptAlso ? q.acceptAlso.some(function(a) { return n === a.toLowerCase(); }) : false;
            case 'calculation':
                var num = parseFloat(ans);
                return !isNaN(num) && Math.abs(num - correct) <= (q.tolerance || 0);
            case 'ethical': return true;
            default: return parseInt(ans) === correct;
        }
    }

    // ─── Widget State ────────────────────────────────────────────────────────────

    var widget = null;
    var state = { questions: [], current: 0, score: 0, salt: '', series: '', answered: false, minimized: false };

    function createWidget(data, series) {
        state.salt = data.security && data.security.salt || '';
        state.series = series;
        state.questions = shuffle(data.questions).slice(0, QUESTION_COUNT);
        state.current = 0;
        state.score = 0;

        widget = document.createElement('div');
        widget.className = 'qw';
        widget.setAttribute('role', 'dialog');
        widget.setAttribute('aria-label', 'Quick Quiz');

        widget.innerHTML =
            '<div class="qw-bar">' +
                '<span class="qw-label"><i class="fas fa-brain me-1"></i>' + escapeHtml(data.title) + '</span>' +
                '<span class="qw-dots"></span>' +
                '<button class="qw-min" title="Minimize"><i class="fas fa-minus"></i></button>' +
                '<button class="qw-x" title="Dismiss"><i class="fas fa-times"></i></button>' +
            '</div>' +
            '<div class="qw-body"></div>';

        widget.querySelector('.qw-x').addEventListener('click', function() { dismiss(); });
        widget.querySelector('.qw-min').addEventListener('click', function() { toggleMinimize(); });

        document.body.appendChild(widget);
        renderDots();
        showQuestion();

        requestAnimationFrame(function() { widget.classList.add('qw-show'); });
    }

    function renderDots() {
        var dots = widget.querySelector('.qw-dots');
        var h = '';
        for (var i = 0; i < state.questions.length; i++) {
            h += '<span class="qw-dot' + (i === state.current ? ' qw-dot-active' : '') + '"></span>';
        }
        dots.innerHTML = h;
    }

    function showQuestion() {
        if (state.current >= state.questions.length) { showFinish(); return; }

        state.answered = false;
        var q = state.questions[state.current];
        var body = widget.querySelector('.qw-body');

        var typeIcon = { mcq:'fa-list-ul', 'true-false':'fa-toggle-on', 'fill-blank':'fa-pencil-alt',
            'code-output':'fa-terminal', ordering:'fa-sort-amount-down', matching:'fa-link',
            scenario:'fa-briefcase', diagnosis:'fa-stethoscope', debug:'fa-bug',
            architecture:'fa-sitemap', calculation:'fa-calculator', ethical:'fa-balance-scale' };

        body.style.opacity = '0';
        body.style.transform = 'translateX(12px)';

        setTimeout(function() {
            body.innerHTML =
                '<div class="qw-qhead">' +
                    '<span class="qw-qn">' + (state.current + 1) + '/' + state.questions.length + '</span>' +
                    '<span class="qw-qt"><i class="fas ' + (typeIcon[q.type] || 'fa-question') + '"></i></span>' +
                    '<span class="qw-diff qw-d-' + q.difficulty + '">' + q.difficulty + '</span>' +
                '</div>' +
                '<p class="qw-qtxt">' + escapeHtml(q.question) + '</p>' +
                renderInput(q) +
                '<div class="qw-fb"></div>';

            bindQuestion(body, q);
            body.style.opacity = '1';
            body.style.transform = 'translateX(0)';
        }, 150);

        renderDots();
    }

    function bindQuestion(body, q) {
        // Radio
        body.querySelectorAll('input[type="radio"]').forEach(function(r) {
            r.addEventListener('change', function() {
                if (state.answered) return;
                body.querySelectorAll('.qw-opt').forEach(function(o) { o.classList.remove('sel'); });
                this.closest('.qw-opt').classList.add('sel');
                submitAnswer(this.value, q);
            });
        });

        // True/False
        body.querySelectorAll('.qw-tf-b').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (state.answered) return;
                body.querySelectorAll('.qw-tf-b').forEach(function(b) { b.classList.remove('act'); });
                this.classList.add('act');
                submitAnswer(this.getAttribute('data-v'), q);
            });
        });

        // Text input
        var goBtn = body.querySelector('.qw-go:not(.qw-go-full)');
        var tinput = body.querySelector('.qw-tinput');
        if (goBtn && tinput) {
            goBtn.addEventListener('click', function() { if (tinput.value.trim()) submitAnswer(tinput.value, q); });
            tinput.addEventListener('keypress', function(e) { if (e.key === 'Enter' && this.value.trim()) submitAnswer(this.value, q); });
        }

        // Ordering
        body.querySelectorAll('.qw-up').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var li = this.closest('.qw-sli');
                if (li.previousElementSibling) li.parentNode.insertBefore(li, li.previousElementSibling);
            });
        });
        body.querySelectorAll('.qw-dn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var li = this.closest('.qw-sli');
                if (li.nextElementSibling) li.parentNode.insertBefore(li.nextElementSibling, li);
            });
        });
        var orderGo = body.querySelector('.qw-order .qw-go-full');
        if (orderGo) {
            orderGo.addEventListener('click', function() {
                if (state.answered) return;
                var items = body.querySelectorAll('.qw-sli');
                var arr = []; items.forEach(function(li) { arr.push(li.getAttribute('data-t')); });
                var correct = decode(q.answer, state.salt);
                var ok = JSON.stringify(arr) === JSON.stringify(correct);
                submitResult(ok, q);
            });
        }

        // Matching
        var mState = { left: null, pairs: {} };
        body.querySelectorAll('.qw-ml').forEach(function(el) {
            el.addEventListener('click', function() {
                body.querySelectorAll('.qw-ml').forEach(function(e) { e.classList.remove('qw-sel'); });
                this.classList.add('qw-sel');
                mState.left = parseInt(this.getAttribute('data-i'));
            });
        });
        body.querySelectorAll('.qw-mr').forEach(function(el) {
            el.addEventListener('click', function() {
                if (mState.left === null) return;
                this.classList.add('qw-paired');
                body.querySelector('.qw-ml[data-i="' + mState.left + '"]').classList.add('qw-paired');
                mState.pairs[mState.left] = this.getAttribute('data-t');
                mState.left = null;
                body.querySelectorAll('.qw-ml').forEach(function(e) { e.classList.remove('qw-sel'); });
            });
        });
        var matchGo = body.querySelector('.qw-match .qw-go-full');
        if (matchGo) {
            matchGo.addEventListener('click', function() {
                if (state.answered) return;
                var correctMap = decode(q.answer, state.salt);
                var ok = q.pairs.left.every(function(_, i) {
                    if (Array.isArray(correctMap)) {
                        var ci = Array.isArray(correctMap[i]) ? correctMap[i][1] : correctMap[i];
                        return mState.pairs[i] === q.pairs.right[ci];
                    }
                    return mState.pairs[i] === q.pairs.right[i];
                });
                submitResult(ok, q);
            });
        }
    }

    function submitAnswer(ans, q) {
        var ok = check(q, ans, state.salt);
        submitResult(ok, q);
    }

    function submitResult(ok, q) {
        if (state.answered) return;
        state.answered = true;
        if (ok) state.score++;
        trackAnswer(q.id, ok, state.series);

        var fb = widget.querySelector('.qw-fb');
        var isEthical = q.type === 'ethical';
        fb.className = 'qw-fb ' + (ok ? 'qw-fb-ok' : 'qw-fb-no');
        fb.innerHTML = '<span class="qw-fb-icon"><i class="fas ' + (ok ? 'fa-check-circle' : 'fa-times-circle') + '"></i></span>' +
            '<span class="qw-fb-msg">' + (isEthical ? 'Thoughtful!' : (ok ? 'Correct!' : 'Not quite.')) +
            (q.explanation ? ' <span class="qw-fb-exp">' + q.explanation + '</span>' : '') + '</span>';

        // Auto-advance after delay
        setTimeout(function() {
            state.current++;
            showQuestion();
        }, ok ? FEEDBACK_DELAY_CORRECT : FEEDBACK_DELAY_INCORRECT);
    }

    function showFinish() {
        var body = widget.querySelector('.qw-body');
        var pct = Math.round((state.score / state.questions.length) * 100);
        body.style.opacity = '0';
        setTimeout(function() {
            body.innerHTML =
                '<div class="qw-done">' +
                    '<div class="qw-done-score">' + pct + '%</div>' +
                    '<p class="qw-done-msg">' + state.score + '/' + state.questions.length + ' correct</p>' +
                    '<a href="/pages/series/' + encodeURIComponent(state.series) + '/assessment.html" class="qw-done-cta">' +
                    '<i class="fas fa-clipboard-check me-1"></i>Full Assessment</a>' +
                '</div>';
            body.style.opacity = '1';
            body.style.transform = 'translateX(0)';
        }, 150);
        renderDots();
    }

    function toggleMinimize() {
        state.minimized = !state.minimized;
        widget.classList.toggle('qw-min-state', state.minimized);
        var btn = widget.querySelector('.qw-min');
        var icon = btn.querySelector('i');
        icon.className = state.minimized ? 'fas fa-expand' : 'fas fa-minus';
        btn.title = state.minimized ? 'Maximize' : 'Minimize';
    }

    function dismiss() {
        widget.classList.remove('qw-show');
        widget.classList.add('qw-hide');
        setTimeout(function() {
            if (widget && widget.parentNode) widget.parentNode.removeChild(widget);
            widget = null;
        }, 300);
        setDismissed(state.series);
        showReopenPill(state.series);
    }

    // ─── Re-open pill (after dismiss) ────────────────────────────────────────────

    var reopenPill = null;

    function showReopenPill(series) {
        if (reopenPill) return;
        reopenPill = document.createElement('button');
        reopenPill.className = 'qw-reopen';
        reopenPill.innerHTML = '<i class="fas fa-brain"></i> Quiz';
        reopenPill.title = 'Reopen quiz';
        reopenPill.addEventListener('click', function() {
            clearDismissed(series);
            hideReopenPill();
            init();
        });
        document.body.appendChild(reopenPill);
        requestAnimationFrame(function() {
            requestAnimationFrame(function() { reopenPill.classList.add('qw-reopen-show'); });
        });
    }

    function hideReopenPill() {
        if (!reopenPill) return;
        reopenPill.classList.remove('qw-reopen-show');
        var pill = reopenPill;
        reopenPill = null;
        setTimeout(function() { if (pill.parentNode) pill.parentNode.removeChild(pill); }, 300);
    }

    function clearDismissed(series) {
        try {
            var d = JSON.parse(sessionStorage.getItem(DISMISS_KEY) || '{}');
            delete d[series];
            sessionStorage.setItem(DISMISS_KEY, JSON.stringify(d));
        } catch (e) {}
    }

    // ─── Init ────────────────────────────────────────────────────────────────────

    function init() {
        var series = detectSeries();
        if (!series) return;
        if (isDismissed(series)) { showReopenPill(series); return; }

        setTimeout(function() {
            if (document.hidden) return;
            fetch('quiz.json')
                .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
                .then(function(data) {
                    if (data.questions && data.questions.length > 0) createWidget(data, series);
                })
                .catch(function() {});
        }, TRIGGER_DELAY);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();
