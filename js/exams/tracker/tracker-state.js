// ============================================================
// TrackerState — Normalized model + localStorage persistence
// ============================================================

(function() {
    'use strict';

    var STORAGE_PREFIX = 'exam-tracker-';

    function TrackerState(examId) {
        this.examId = examId;
        this.syllabusVersion = '';
        this.candidateName = '';
        this.targetScore = '';
        this.examDate = '';
        this.selectedSectionIds = [];
        this.progress = {};
        this.planner = {
            dailyMinutes: 90,
            resources: [],
            goals: '',
            strategy: 'weakest-first',   // weakest-first | balanced | score-maximizing
            intensity: 'balanced',        // relaxed | balanced | intensive
            generatedAt: '',
            lockedPlan: false,
            plannerVersion: '1.0'
        };
    }

    TrackerState.prototype.loadFromSyllabus = function(syllabus) {
        this.syllabusVersion = syllabus.version || '1.0';
        // Auto-select all compulsory sections
        this.selectedSectionIds = syllabus.sections
            .filter(function(s) { return s.type === 'compulsory'; })
            .map(function(s) { return s.id; });
    };

    TrackerState.prototype.selectElective = function(sectionId, syllabus) {
        var section = syllabus.sections.find(function(s) { return s.id === sectionId; });
        if (!section || section.type !== 'elective') return;

        var group = section.group;
        var selection = section.selection || { mode: 'single', min: 1, max: 1 };

        if (selection.mode === 'single' && group) {
            // Remove other sections in same group
            var groupSections = syllabus.sections
                .filter(function(s) { return s.group === group; })
                .map(function(s) { return s.id; });
            this.selectedSectionIds = this.selectedSectionIds.filter(function(id) {
                return groupSections.indexOf(id) === -1;
            });
        }

        if (this.selectedSectionIds.indexOf(sectionId) === -1) {
            this.selectedSectionIds.push(sectionId);
        }
    };

    TrackerState.prototype.deselectElective = function(sectionId) {
        this.selectedSectionIds = this.selectedSectionIds.filter(function(id) {
            return id !== sectionId;
        });
    };

    TrackerState.prototype.setTopicStatus = function(topicId, status, confidence, notes) {
        if (!this.progress[topicId]) {
            this.progress[topicId] = { status: 'not-started', confidence: 0, notes: '', lastReviewed: '' };
        }
        if (status !== undefined) this.progress[topicId].status = status;
        if (confidence !== undefined) this.progress[topicId].confidence = confidence;
        if (notes !== undefined) this.progress[topicId].notes = notes;
        this.progress[topicId].lastReviewed = new Date().toISOString().split('T')[0];
    };

    TrackerState.prototype.getSelectedTopics = function(syllabus) {
        var self = this;
        var topics = [];
        syllabus.sections.forEach(function(section) {
            if (self.selectedSectionIds.indexOf(section.id) === -1) return;
            section.topics.forEach(function(topic) {
                var prog = self.progress[topic.id] || { status: 'not-started', confidence: 0, notes: '', lastReviewed: '' };
                topics.push({
                    sectionId: section.id,
                    sectionName: section.name,
                    id: topic.id,
                    title: topic.title,
                    difficulty: topic.difficulty || 1,
                    estimatedHours: topic.estimatedHours || 0,
                    weight: topic.weight || 1,
                    tags: topic.tags || [],
                    status: prog.status,
                    confidence: prog.confidence,
                    notes: prog.notes,
                    lastReviewed: prog.lastReviewed
                });
            });
        });
        return topics;
    };

    TrackerState.prototype.getStats = function(syllabus) {
        var topics = this.getSelectedTopics(syllabus);
        var total = topics.length;
        var mastered = topics.filter(function(t) { return t.status === 'mastered'; }).length;
        var confident = topics.filter(function(t) { return t.status === 'confident'; }).length;
        var inProgress = topics.filter(function(t) { return t.status === 'in-progress'; }).length;
        var notStarted = topics.filter(function(t) { return t.status === 'not-started'; }).length;
        var totalHours = topics.reduce(function(s, t) { return s + t.estimatedHours; }, 0);
        var completedHours = topics.filter(function(t) { return t.status === 'mastered' || t.status === 'confident'; })
            .reduce(function(s, t) { return s + t.estimatedHours; }, 0);
        return { total: total, mastered: mastered, confident: confident, inProgress: inProgress, notStarted: notStarted, totalHours: totalHours, completedHours: completedHours };
    };

    // Persistence
    TrackerState.prototype.save = function() {
        var data = {
            examId: this.examId,
            syllabusVersion: this.syllabusVersion,
            candidateName: this.candidateName,
            targetScore: this.targetScore,
            examDate: this.examDate,
            selectedSectionIds: this.selectedSectionIds,
            progress: this.progress,
            planner: this.planner
        };
        try {
            localStorage.setItem(STORAGE_PREFIX + this.examId, JSON.stringify(data));
        } catch (e) { /* quota exceeded — silent */ }
    };

    TrackerState.prototype.load = function() {
        try {
            var raw = localStorage.getItem(STORAGE_PREFIX + this.examId);
            if (!raw) return false;
            var data = JSON.parse(raw);
            this.syllabusVersion = data.syllabusVersion || '';
            this.candidateName = data.candidateName || '';
            this.targetScore = data.targetScore || '';
            this.examDate = data.examDate || '';
            this.selectedSectionIds = data.selectedSectionIds || [];
            this.progress = data.progress || {};
            // Merge planner (backwards-compat: old data may lack this)
            if (data.planner) {
                this.planner.dailyMinutes = data.planner.dailyMinutes || 90;
                this.planner.resources = data.planner.resources || [];
                this.planner.goals = data.planner.goals || '';
                this.planner.strategy = data.planner.strategy || 'weakest-first';
                this.planner.intensity = data.planner.intensity || 'balanced';
                this.planner.generatedAt = data.planner.generatedAt || '';
                this.planner.lockedPlan = data.planner.lockedPlan || false;
                this.planner.plannerVersion = data.planner.plannerVersion || '1.0';
            }
            return true;
        } catch (e) { return false; }
    };

    TrackerState.prototype.reset = function() {
        this.candidateName = '';
        this.targetScore = '';
        this.examDate = '';
        this.progress = {};
        this.planner = {
            dailyMinutes: 90, resources: [], goals: '',
            strategy: 'weakest-first', intensity: 'balanced',
            generatedAt: '', lockedPlan: false, plannerVersion: '1.0'
        };
        localStorage.removeItem(STORAGE_PREFIX + this.examId);
    };

    window.TrackerState = TrackerState;
})();
