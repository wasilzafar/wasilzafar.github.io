// ============================================================
// ExamTrackerUI — Renders topic selector + form for any exam
// ============================================================

(function() {
    'use strict';

    var ExamTrackerUI = {};

    /**
     * Render the full tracker form into a container
     * @param {string} examKey - key into window.ExamSyllabus
     * @param {string} containerId - DOM element ID to render into
     */
    ExamTrackerUI.render = function(examKey, containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var syllabus = (window.ExamSyllabus || {})[examKey];
        if (!syllabus) { container.innerHTML = '<p>Syllabus data not loaded.</p>'; return; }

        var state = new TrackerState(examKey);
        var loaded = state.load();
        if (!loaded) state.loadFromSyllabus(syllabus);

        container.innerHTML = '';
        container._state = state;
        container._syllabus = syllabus;

        // Candidate info row
        container.appendChild(buildInfoFields(state));

        // Compulsory sections
        var compulsory = syllabus.sections.filter(function(s) { return s.type === 'compulsory'; });
        if (compulsory.length) {
            container.appendChild(buildSectionHeader('Compulsory Sections', 'Included automatically — these are required for all candidates.', 'teal'));
            compulsory.forEach(function(section) {
                container.appendChild(buildSectionBlock(section, true, state));
            });
        }

        // Elective sections grouped
        var elective = syllabus.sections.filter(function(s) { return s.type === 'elective'; });
        if (elective.length) {
            var groups = {};
            elective.forEach(function(s) {
                var g = s.group || 'elective';
                if (!groups[g]) groups[g] = { selection: s.selection || { mode: 'multiple', min: 0, max: 99 }, sections: [] };
                groups[g].sections = groups[g].sections || [];
                groups[g].sections.push(s);
            });

            Object.keys(groups).forEach(function(groupKey) {
                var group = groups[groupKey];
                var label = groupKey.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                var desc = group.selection.mode === 'single'
                    ? 'Choose exactly one from the list below.'
                    : 'Select ' + group.selection.min + '–' + group.selection.max + ' subjects.';

                container.appendChild(buildSectionHeader('Elective — ' + label, desc, 'crimson'));
                container.appendChild(buildElectiveSelector(group, syllabus, state, container));
            });
        }

        // Stats bar
        container.appendChild(buildStatsBar(state, syllabus));

        // Planner settings section
        container.appendChild(buildPlannerSettings(state));

        // Plan preview area (populated on generate)
        var previewArea = document.createElement('div');
        previewArea.className = 'exam-planner-preview';
        previewArea.id = containerId + '-preview';
        container.appendChild(previewArea);

        // Auto-save on any interaction
        container.addEventListener('change', function() {
            syncStateFromDOM(container, state, syllabus);
            state.save();
            updateStatsBar(container, state, syllabus);
            // Invalidate locked plan on change
            if (state.planner.lockedPlan) {
                state.planner.lockedPlan = false;
                state.save();
            }
        });
    };

    /**
     * Get current TrackerState from a rendered container
     */
    ExamTrackerUI.getState = function(containerId) {
        var container = document.getElementById(containerId);
        if (!container || !container._state) return null;
        syncStateFromDOM(container, container._state, container._syllabus);
        return container._state;
    };

    // ── Builders ─────────────────────────────────────────────────

    function buildInfoFields(state) {
        var div = document.createElement('div');
        div.className = 'exam-tracker-info form-row';
        div.innerHTML =
            '<div class="form-group"><label>Your Name</label><input type="text" class="et-candidate" value="' + escAttr(state.candidateName) + '" placeholder="e.g. John Doe"></div>' +
            '<div class="form-group"><label>Target Score</label><input type="text" class="et-target" value="' + escAttr(state.targetScore) + '" placeholder="e.g. 1500, IAS Top 100"></div>' +
            '<div class="form-group"><label>Exam Date</label><input type="date" class="et-date" value="' + escAttr(state.examDate) + '"></div>';
        return div;
    }

    function buildSectionHeader(title, desc, color) {
        var div = document.createElement('div');
        div.className = 'exam-tracker-section-header';
        div.innerHTML = '<div class="series-accent-bar accent-bar-' + color + '"></div>' +
            '<div class="series-header-content"><h4 class="series-name">' + title + '</h4>' +
            '<p class="series-desc">' + desc + '</p></div>';
        return div;
    }

    function buildSectionBlock(section, locked, state) {
        var div = document.createElement('div');
        div.className = 'exam-tracker-section' + (locked ? ' exam-tracker-compulsory' : '');
        div.dataset.sectionId = section.id;

        var totalH = section.topics.reduce(function(s, t) { return s + (t.estimatedHours || 0); }, 0);
        var header = '<div class="exam-section-title"><i class="fas fa-check-circle me-2"></i>' +
            section.name + ' <span class="exam-section-meta">(' + section.topics.length + ' topics · ' + totalH + 'h)</span></div>';

        var topicRows = section.topics.map(function(topic) {
            var prog = state.progress[topic.id] || { status: 'not-started', confidence: 0 };
            var dots = '';
            for (var d = 0; d < 5; d++) dots += '<span class="diff-dot' + (d < topic.difficulty ? ' active' : '') + '"></span>';
            return '<div class="exam-topic-item" data-topic-id="' + topic.id + '">' +
                '<div class="exam-topic-title">' + topic.title + '</div>' +
                '<div class="exam-topic-meta"><span class="exam-topic-hours">' + (topic.estimatedHours || '?') + 'h</span>' + dots + '</div>' +
                '<select class="exam-topic-status"><option value="not-started"' + sel(prog.status, 'not-started') + '>Not Started</option>' +
                '<option value="in-progress"' + sel(prog.status, 'in-progress') + '>In Progress</option>' +
                '<option value="confident"' + sel(prog.status, 'confident') + '>Confident</option>' +
                '<option value="mastered"' + sel(prog.status, 'mastered') + '>Mastered</option></select>' +
                '</div>';
        }).join('');

        div.innerHTML = header + '<div class="exam-topic-list">' + topicRows + '</div>';
        return div;
    }

    function buildElectiveSelector(group, syllabus, state, container) {
        var wrapper = document.createElement('div');
        wrapper.className = 'exam-tracker-elective-group';

        // Search box if many options
        if (group.sections.length > 6) {
            var search = document.createElement('input');
            search.type = 'text';
            search.className = 'exam-search-input';
            search.placeholder = 'Search subjects...';
            search.addEventListener('input', function() {
                var q = this.value.toLowerCase();
                var items = wrapper.querySelectorAll('.exam-elective-option');
                items.forEach(function(el) {
                    el.style.display = el.dataset.name.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
                });
            });
            wrapper.appendChild(search);
        }

        var isSingle = group.selection.mode === 'single';
        var inputType = isSingle ? 'radio' : 'checkbox';
        var groupName = 'et-elective-' + (group.sections[0].group || 'default');

        group.sections.forEach(function(section) {
            var isSelected = state.selectedSectionIds.indexOf(section.id) !== -1;
            var opt = document.createElement('div');
            opt.className = 'exam-elective-option' + (isSelected ? ' selected' : '');
            opt.dataset.name = section.name;
            opt.dataset.sectionId = section.id;

            var totalH = section.topics.reduce(function(s, t) { return s + (t.estimatedHours || 0); }, 0);
            opt.innerHTML = '<label class="exam-elective-label">' +
                '<input type="' + inputType + '" name="' + groupName + '" value="' + section.id + '"' + (isSelected ? ' checked' : '') + '>' +
                '<span class="exam-elective-name">' + section.name + '</span>' +
                '<span class="exam-elective-meta">' + section.topics.length + ' topics · ' + totalH + 'h</span></label>';

            opt.querySelector('input').addEventListener('change', function() {
                if (this.checked) {
                    state.selectElective(section.id, syllabus);
                } else {
                    state.deselectElective(section.id);
                }
                state.save();
                // Re-render topic blocks for selected electives
                refreshElectiveTopics(container, syllabus, state);
                updateStatsBar(container, state, syllabus);
            });

            wrapper.appendChild(opt);
        });

        // Topic blocks for currently selected electives
        var topicContainer = document.createElement('div');
        topicContainer.className = 'exam-elective-topics';
        group.sections.forEach(function(section) {
            if (state.selectedSectionIds.indexOf(section.id) !== -1) {
                topicContainer.appendChild(buildSectionBlock(section, false, state));
            }
        });
        wrapper.appendChild(topicContainer);

        return wrapper;
    }

    function refreshElectiveTopics(container, syllabus, state) {
        var groups = container.querySelectorAll('.exam-elective-topics');
        groups.forEach(function(topicContainer) {
            var wrapper = topicContainer.parentElement;
            var options = wrapper.querySelectorAll('.exam-elective-option');
            topicContainer.innerHTML = '';
            options.forEach(function(opt) {
                var secId = opt.dataset.sectionId;
                if (state.selectedSectionIds.indexOf(secId) !== -1) {
                    var section = syllabus.sections.find(function(s) { return s.id === secId; });
                    if (section) topicContainer.appendChild(buildSectionBlock(section, false, state));
                }
                opt.classList.toggle('selected', state.selectedSectionIds.indexOf(secId) !== -1);
            });
        });
    }

    function buildStatsBar(state, syllabus) {
        var div = document.createElement('div');
        div.className = 'exam-tracker-stats';
        updateStatsContent(div, state, syllabus);
        return div;
    }

    function updateStatsBar(container, state, syllabus) {
        var bar = container.querySelector('.exam-tracker-stats');
        if (bar) updateStatsContent(bar, state, syllabus);
    }

    function updateStatsContent(el, state, syllabus) {
        var s = state.getStats(syllabus);
        var pct = s.total ? Math.round(((s.mastered + s.confident) / s.total) * 100) : 0;
        el.innerHTML = '<div class="exam-stats-row">' +
            '<span class="exam-stat"><i class="fas fa-book me-1"></i>' + s.total + ' topics</span>' +
            '<span class="exam-stat"><i class="fas fa-clock me-1"></i>' + s.totalHours + 'h total</span>' +
            '<span class="exam-stat text-teal"><i class="fas fa-check me-1"></i>' + (s.mastered + s.confident) + ' done (' + pct + '%)</span>' +
            '<span class="exam-stat"><i class="fas fa-spinner me-1"></i>' + s.inProgress + ' in progress</span>' +
            '</div>' +
            '<div class="exam-stats-progress"><div class="exam-stats-fill" style="width:' + pct + '%"></div></div>';
    }

    // ── Helpers ──────────────────────────────────────────────────

    function syncStateFromDOM(container, state, syllabus) {
        var nameEl = container.querySelector('.et-candidate');
        var targetEl = container.querySelector('.et-target');
        var dateEl = container.querySelector('.et-date');
        if (nameEl) state.candidateName = nameEl.value;
        if (targetEl) state.targetScore = targetEl.value;
        if (dateEl) state.examDate = dateEl.value;

        // Sync planner settings
        var minEl = container.querySelector('.et-planner-minutes');
        var resEl = container.querySelector('.et-planner-resources');
        var goalEl = container.querySelector('.et-planner-goals');
        var stratEl = container.querySelector('input[name="et-strategy"]:checked');
        var intEl = container.querySelector('input[name="et-intensity"]:checked');
        if (minEl) state.planner.dailyMinutes = parseInt(minEl.value, 10) || 90;
        if (resEl) state.planner.resources = resEl.value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
        if (goalEl) state.planner.goals = goalEl.value;
        if (stratEl) state.planner.strategy = stratEl.value;
        if (intEl) state.planner.intensity = intEl.value;

        // Sync topic statuses
        container.querySelectorAll('.exam-topic-item').forEach(function(el) {
            var topicId = el.dataset.topicId;
            var statusEl = el.querySelector('.exam-topic-status');
            if (topicId && statusEl) {
                if (!state.progress[topicId]) state.progress[topicId] = { status: 'not-started', confidence: 0, notes: '', lastReviewed: '' };
                state.progress[topicId].status = statusEl.value;
                if (statusEl.value !== 'not-started') {
                    state.progress[topicId].lastReviewed = new Date().toISOString().split('T')[0];
                }
            }
        });
    }

    function sel(current, value) { return current === value ? ' selected' : ''; }
    function escAttr(s) { return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    function chk(current, value) { return current === value ? ' checked' : ''; }

    // ── Planner Settings Builder ─────────────────────────────────

    function buildPlannerSettings(state) {
        var p = state.planner;
        var div = document.createElement('div');
        div.className = 'exam-planner-settings';
        div.innerHTML =
            '<div class="exam-planner-header"><i class="fas fa-calendar-alt me-2"></i>Study Plan Settings</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Daily Study Time (minutes)</label>' +
                '<input type="number" class="et-planner-minutes" min="15" max="600" step="15" value="' + (p.dailyMinutes || 90) + '"></div>' +
                '<div class="form-group"><label>Resources</label>' +
                '<input type="text" class="et-planner-resources" value="' + escAttr((p.resources || []).join(', ')) + '" placeholder="e.g. Khan Academy, Official Tests"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group" style="flex:1;"><label>Goal</label>' +
                '<textarea class="et-planner-goals" placeholder="e.g. Score 1500+ for merit scholarship">' + escAttr(p.goals) + '</textarea></div>' +
            '</div>' +
            '<div class="exam-planner-options">' +
                '<div class="exam-planner-option-group">' +
                    '<span class="exam-planner-option-label">Strategy</span>' +
                    '<label><input type="radio" name="et-strategy" value="weakest-first"' + chk(p.strategy, 'weakest-first') + '> Weakest-first</label>' +
                    '<label><input type="radio" name="et-strategy" value="balanced"' + chk(p.strategy, 'balanced') + '> Balanced</label>' +
                    '<label><input type="radio" name="et-strategy" value="score-maximizing"' + chk(p.strategy, 'score-maximizing') + '> Score-maximizing</label>' +
                '</div>' +
                '<div class="exam-planner-option-group">' +
                    '<span class="exam-planner-option-label">Intensity</span>' +
                    '<label><input type="radio" name="et-intensity" value="relaxed"' + chk(p.intensity, 'relaxed') + '> Relaxed</label>' +
                    '<label><input type="radio" name="et-intensity" value="balanced"' + chk(p.intensity, 'balanced') + '> Balanced</label>' +
                    '<label><input type="radio" name="et-intensity" value="intensive"' + chk(p.intensity, 'intensive') + '> Intensive</label>' +
                '</div>' +
            '</div>' +
            '<div class="exam-planner-actions">' +
                '<button type="button" class="btn-generate et-generate-plan"><i class="fas fa-magic me-1"></i>Generate Study Plan</button>' +
            '</div>';

        // Wire generate button
        setTimeout(function() {
            var btn = div.querySelector('.et-generate-plan');
            if (btn) btn.addEventListener('click', function() {
                var container = div.closest('[id]');
                if (container && container._state && container._syllabus) {
                    syncStateFromDOM(container, container._state, container._syllabus);
                    container._state.save();
                    var result = PlannerEngine.compute(container._state, container._syllabus);
                    container._plannerResult = result;
                    container._state.planner.generatedAt = result.generatedAt;
                    container._state.planner.lockedPlan = true;
                    container._state.save();
                    renderPlanPreview(container, result);
                }
            });
        }, 0);

        return div;
    }

    // ── Plan Preview Renderer ────────────────────────────────────

    function renderPlanPreview(container, result) {
        var preview = container.querySelector('.exam-planner-preview');
        if (!preview) return;

        var html = '';

        // Warnings
        if (result.warnings.length) {
            html += '<div class="exam-planner-warnings">';
            result.warnings.forEach(function(w) {
                html += '<div class="exam-planner-warning"><i class="fas fa-exclamation-triangle me-2"></i>' + w + '</div>';
            });
            html += '</div>';
        }

        // All complete
        if (result.allComplete) {
            html += '<div class="exam-planner-success"><i class="fas fa-trophy me-2"></i>All topics mastered! No study plan needed.</div>';
            preview.innerHTML = html;
            return;
        }

        // Weak topics
        if (result.weakTopics.length) {
            html += '<div class="exam-planner-weak">' +
                '<div class="exam-planner-weak-header"><i class="fas fa-crosshairs me-2"></i>Detected Weak Topics</div>';
            result.weakTopics.slice(0, 6).forEach(function(t) {
                var reasonLabels = t.reasons.map(function(r) {
                    switch (r) {
                        case 'high-difficulty': return 'difficulty ' + t.difficulty + '/5';
                        case 'low-confidence': return 'confidence ' + t.confidence + '/5';
                        case 'high-weight': return 'high exam importance';
                        case 'not-started': return 'not started';
                        case 'stale-review': return t.lastReviewed ? (daysSince(t.lastReviewed) + ' days since review') : 'never reviewed';
                        default: return r;
                    }
                });
                html += '<div class="exam-planner-weak-item">' +
                    '<span class="exam-planner-weak-title">' + t.title + '</span>' +
                    '<span class="exam-planner-weak-reasons">' + reasonLabels.join(' · ') + '</span>' +
                    '</div>';
            });
            html += '</div>';
        }

        // Weekly plan
        if (result.weeklyPlan.length) {
            html += '<div class="exam-planner-schedule">' +
                '<div class="exam-planner-schedule-header"><i class="fas fa-calendar-week me-2"></i>Study Schedule (' + result.assumptions.remainingWeeks + ' weeks)</div>';
            result.weeklyPlan.forEach(function(week) {
                var topicList = week.topics.length
                    ? week.topics.map(function(t) { return t.title; }).join(', ')
                    : 'Review & practice';
                if (topicList.length > 80) topicList = topicList.substring(0, 77) + '...';
                html += '<div class="exam-planner-week">' +
                    '<span class="exam-planner-week-num">Week ' + week.week + '</span>' +
                    '<span class="exam-planner-week-focus">' + week.focus + '</span>' +
                    '<span class="exam-planner-week-hours">' + week.totalHours + 'h</span>' +
                    '<div class="exam-planner-week-topics">' + topicList + '</div>' +
                    '</div>';
            });
            html += '</div>';
        }

        // Assumptions footer
        html += '<div class="exam-planner-assumptions">' +
            '<strong>Plan assumptions:</strong> ' +
            result.assumptions.dailyMinutes + ' min/day · ' +
            result.assumptions.strategy.replace(/-/g, ' ') + ' · ' +
            result.assumptions.intensity + ' intensity · ' +
            result.assumptions.bufferPct + ' buffer · ' +
            'Generated ' + result.assumptions.generatedAt +
            '</div>';

        preview.innerHTML = html;
    }

    function daysSince(dateStr) {
        if (!dateStr) return '?';
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return '?';
        return Math.floor((Date.now() - d.getTime()) / (24 * 60 * 60 * 1000));
    }

    /**
     * Get the last computed plannerResult
     */
    ExamTrackerUI.getPlannerResult = function(containerId) {
        var container = document.getElementById(containerId);
        return container ? container._plannerResult || null : null;
    };

    window.ExamTrackerUI = ExamTrackerUI;
})();
