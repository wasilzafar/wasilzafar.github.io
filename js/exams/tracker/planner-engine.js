// ============================================================
// PlannerEngine — Smart scheduling from tracker state
// Computes a plannerResult consumed by UI preview + exporters
// ============================================================

(function() {
    'use strict';

    var DEFAULT_HORIZON_WEEKS = 8;
    var URGENCY_MIN = 0.8;
    var URGENCY_MAX = 2.0;
    var STALE_DAYS_THRESHOLD = 14;

    // Buffer multipliers by intensity
    var BUFFER = {
        'relaxed': 0.65,
        'balanced': 0.80,
        'intensive': 0.92
    };

    var PlannerEngine = {};

    // ── Main compute function ────────────────────────────────
    PlannerEngine.compute = function(trackerState, syllabus) {
        var planner = trackerState.planner;
        var topics = trackerState.getSelectedTopics(syllabus);
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        // Parse exam date
        var examDate = parseDate(trackerState.examDate);
        var remainingWeeks = DEFAULT_HORIZON_WEEKS;
        var dateWarning = null;

        if (examDate) {
            var diffMs = examDate.getTime() - today.getTime();
            var diffWeeks = diffMs / (7 * 24 * 60 * 60 * 1000);
            if (diffWeeks <= 0) {
                dateWarning = 'Exam date is in the past. Planning from today with ' + DEFAULT_HORIZON_WEEKS + '-week horizon.';
                remainingWeeks = DEFAULT_HORIZON_WEEKS;
            } else {
                remainingWeeks = Math.max(1, Math.ceil(diffWeeks));
            }
        } else {
            dateWarning = 'No exam date set \u2014 using ' + DEFAULT_HORIZON_WEEKS + '-week planning horizon.';
        }

        // Filter remaining topics (not mastered/confident)
        var remaining = topics.filter(function(t) {
            return t.status !== 'mastered' && t.status !== 'confident';
        });

        // If nothing remaining, return success
        if (remaining.length === 0) {
            return buildResult({
                weeklyPlan: [],
                weakTopics: [],
                warnings: [],
                assumptions: buildAssumptions(trackerState, remainingWeeks, today),
                allComplete: true
            });
        }

        // Compute priority for each remaining topic
        var urgencyMultiplier = computeUrgency(remainingWeeks);
        var scored = remaining.map(function(t) {
            var confidenceGap = 5 - t.confidence;
            var priority = t.difficulty * confidenceGap * t.weight * urgencyMultiplier;
            var reasons = buildReasons(t, today);
            return {
                id: t.id,
                title: t.title,
                sectionName: t.sectionName,
                hours: t.estimatedHours,
                difficulty: t.difficulty,
                confidence: t.confidence,
                weight: t.weight,
                priority: priority,
                reasons: reasons,
                lastReviewed: t.lastReviewed
            };
        });

        // Sort by strategy
        scored = sortByStrategy(scored, planner.strategy);

        // Detect weak topics (top N by priority)
        var weakTopics = scored.slice(0, Math.min(10, scored.length)).map(function(t) {
            return {
                id: t.id,
                title: t.title,
                sectionName: t.sectionName,
                priority: Math.round(t.priority * 10) / 10,
                confidence: t.confidence,
                difficulty: t.difficulty,
                weight: t.weight,
                lastReviewed: t.lastReviewed,
                reasons: t.reasons
            };
        });

        // Distribute into weekly buckets
        var bufferMultiplier = BUFFER[planner.intensity] || BUFFER['balanced'];
        var weeklyCapacityMinutes = planner.dailyMinutes * 7 * bufferMultiplier;
        var weeklyCapacityHours = weeklyCapacityMinutes / 60;

        var weeklyPlan = distributeTopics(scored, remainingWeeks, weeklyCapacityHours);

        // Check for warnings
        var warnings = [];
        if (dateWarning) warnings.push(dateWarning);

        var totalRemainingHours = remaining.reduce(function(s, t) { return s + t.estimatedHours; }, 0);
        var totalAvailableHours = weeklyCapacityHours * remainingWeeks;

        if (totalRemainingHours > totalAvailableHours) {
            var requiredDaily = Math.ceil(totalRemainingHours / (remainingWeeks * 7) * 60);
            warnings.push(
                'Current schedule requires ~' + requiredDaily + ' min/day. ' +
                'You have ' + planner.dailyMinutes + ' min/day budgeted. ' +
                'Consider extending timeline or increasing study time.'
            );
        }

        return buildResult({
            weeklyPlan: weeklyPlan,
            weakTopics: weakTopics,
            warnings: warnings,
            assumptions: buildAssumptions(trackerState, remainingWeeks, today),
            allComplete: false
        });
    };

    // ── Priority sorting by strategy ─────────────────────────
    function sortByStrategy(scored, strategy) {
        switch (strategy) {
            case 'balanced':
                // Spread by section — round-robin within priority tiers
                return balancedSort(scored);
            case 'score-maximizing':
                // Prioritize high-weight topics first
                scored.sort(function(a, b) {
                    var wDiff = b.weight - a.weight;
                    if (Math.abs(wDiff) > 0.1) return wDiff;
                    return b.priority - a.priority;
                });
                return scored;
            case 'weakest-first':
            default:
                // Pure priority sort (default)
                scored.sort(function(a, b) { return b.priority - a.priority; });
                return scored;
        }
    }

    function balancedSort(scored) {
        // Group by section, sort within each group, then interleave
        var groups = {};
        scored.forEach(function(t) {
            if (!groups[t.sectionName]) groups[t.sectionName] = [];
            groups[t.sectionName].push(t);
        });
        var keys = Object.keys(groups);
        keys.forEach(function(k) {
            groups[k].sort(function(a, b) { return b.priority - a.priority; });
        });
        var result = [];
        var maxLen = Math.max.apply(null, keys.map(function(k) { return groups[k].length; }));
        for (var i = 0; i < maxLen; i++) {
            for (var j = 0; j < keys.length; j++) {
                if (groups[keys[j]][i]) result.push(groups[keys[j]][i]);
            }
        }
        return result;
    }

    // ── Distribute topics into weekly buckets ────────────────
    function distributeTopics(scored, totalWeeks, weeklyCapacity) {
        var plan = [];
        var idx = 0;

        // Reserve last week for review if enough weeks
        var studyWeeks = totalWeeks > 3 ? totalWeeks - 1 : totalWeeks;

        for (var w = 0; w < studyWeeks && idx < scored.length; w++) {
            var weekTopics = [];
            var weekHours = 0;

            while (idx < scored.length && weekHours + scored[idx].hours <= weeklyCapacity * 1.1) {
                weekTopics.push({
                    id: scored[idx].id,
                    title: scored[idx].title,
                    hours: scored[idx].hours,
                    reasons: scored[idx].reasons
                });
                weekHours += scored[idx].hours;
                idx++;
                // Break if at capacity
                if (weekHours >= weeklyCapacity) break;
            }

            // Force at least one topic per week even if over capacity
            if (weekTopics.length === 0 && idx < scored.length) {
                weekTopics.push({
                    id: scored[idx].id,
                    title: scored[idx].title,
                    hours: scored[idx].hours,
                    reasons: scored[idx].reasons
                });
                weekHours += scored[idx].hours;
                idx++;
            }

            var focus = determineFocus(weekTopics, scored, w, studyWeeks);
            plan.push({
                week: w + 1,
                topics: weekTopics,
                totalHours: Math.round(weekHours * 10) / 10,
                focus: focus
            });
        }

        // Any overflow goes into last study week
        if (idx < scored.length && plan.length > 0) {
            var lastWeek = plan[plan.length - 1];
            while (idx < scored.length) {
                lastWeek.topics.push({
                    id: scored[idx].id,
                    title: scored[idx].title,
                    hours: scored[idx].hours,
                    reasons: scored[idx].reasons
                });
                lastWeek.totalHours += scored[idx].hours;
                idx++;
            }
            lastWeek.totalHours = Math.round(lastWeek.totalHours * 10) / 10;
        }

        // Add review week if applicable
        if (totalWeeks > 3) {
            plan.push({
                week: totalWeeks,
                topics: [],
                totalHours: 0,
                focus: 'Review & mock practice'
            });
        }

        return plan;
    }

    // ── Determine week focus label ───────────────────────────
    function determineFocus(weekTopics, allScored, weekIdx, totalWeeks) {
        if (weekTopics.length === 0) return 'Buffer';
        // Check if topics are mostly from one section
        var sections = {};
        weekTopics.forEach(function(t) {
            var full = allScored.find(function(s) { return s.id === t.id; });
            if (full) {
                sections[full.sectionName] = (sections[full.sectionName] || 0) + 1;
            }
        });
        var dominant = Object.keys(sections).sort(function(a, b) { return sections[b] - sections[a]; })[0];
        if (sections[dominant] >= weekTopics.length * 0.6) {
            return dominant;
        }
        if (weekIdx < totalWeeks * 0.3) return 'Foundation & weak areas';
        if (weekIdx < totalWeeks * 0.7) return 'Core content';
        return 'Practice & consolidation';
    }

    // ── Compute urgency multiplier (clamped) ─────────────────
    function computeUrgency(remainingWeeks) {
        // More urgent = higher multiplier. Scale inversely with weeks.
        // 4 weeks → 1.6, 8 weeks → 1.0, 16 weeks → 0.8
        var raw = 8 / remainingWeeks;
        return Math.max(URGENCY_MIN, Math.min(URGENCY_MAX, raw));
    }

    // ── Build typed reasons for a topic ──────────────────────
    function buildReasons(topic, today) {
        var reasons = [];
        if (topic.difficulty >= 3) reasons.push('high-difficulty');
        if (topic.confidence <= 1) reasons.push('low-confidence');
        if (topic.weight > 1.2) reasons.push('high-weight');
        if (topic.status === 'not-started') reasons.push('not-started');
        if (topic.lastReviewed) {
            var last = parseDate(topic.lastReviewed);
            if (last) {
                var daysSince = Math.floor((today.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
                if (daysSince >= STALE_DAYS_THRESHOLD) reasons.push('stale-review');
            }
        } else {
            reasons.push('stale-review');
        }
        return reasons;
    }

    // ── Build assumptions snapshot ───────────────────────────
    function buildAssumptions(state, remainingWeeks, today) {
        return {
            examDate: state.examDate || '(not set)',
            dailyMinutes: state.planner.dailyMinutes,
            strategy: state.planner.strategy,
            intensity: state.planner.intensity,
            remainingWeeks: remainingWeeks,
            bufferPct: Math.round((1 - (BUFFER[state.planner.intensity] || 0.8)) * 100) + '%',
            generatedAt: today.toISOString().split('T')[0]
        };
    }

    // ── Build final result object ────────────────────────────
    function buildResult(data) {
        return {
            version: '1.0',
            generatedAt: new Date().toISOString().split('T')[0],
            weeklyPlan: data.weeklyPlan,
            weakTopics: data.weakTopics,
            warnings: data.warnings,
            assumptions: data.assumptions,
            allComplete: data.allComplete || false
        };
    }

    // ── Date parser (handles ISO yyyy-mm-dd and common formats) ──
    function parseDate(str) {
        if (!str) return null;
        // Try ISO format first
        var parts = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (parts) return new Date(+parts[1], +parts[2] - 1, +parts[3]);
        // Try Date constructor as fallback
        var d = new Date(str);
        if (!isNaN(d.getTime())) return d;
        return null;
    }

    window.PlannerEngine = PlannerEngine;
})();
