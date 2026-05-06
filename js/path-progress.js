/* ============================================
   Learning Path Progress Tracking
   ============================================
   Tracks articles read per series in localStorage.
   Shows progress bars on path pages.
   ============================================ */

(function () {
    'use strict';

    var STORAGE_KEY = 'wz_reading_progress';

    // Get reading progress from localStorage
    function getProgress() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    // Save progress
    function saveProgress(progress) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (e) { /* quota exceeded — fail silently */ }
    }

    // Mark current article as read (called on article pages)
    function markArticleRead() {
        var url = window.location.pathname;
        // Only track series articles
        var match = url.match(/\/pages\/series\/([^/]+)\/([^/]+\.html)/);
        if (!match) return;

        var series = match[1];
        var article = match[2];
        var progress = getProgress();

        if (!progress[series]) progress[series] = [];
        if (progress[series].indexOf(article) === -1) {
            progress[series].push(article);
            saveProgress(progress);
        }
    }

    // Get count of articles read for a series
    function getSeriesReadCount(seriesFolder) {
        var progress = getProgress();
        return progress[seriesFolder] ? progress[seriesFolder].length : 0;
    }

    // Get total articles read across all series
    function getTotalRead() {
        var progress = getProgress();
        var total = 0;
        for (var key in progress) {
            if (progress.hasOwnProperty(key)) {
                total += progress[key].length;
            }
        }
        return total;
    }

    // Update progress bars on path pages
    function updatePathProgress() {
        var progress = getProgress();

        // Update individual path page progress bar
        var pathFill = document.getElementById('pathProgressFill');
        var pathText = document.getElementById('pathProgressText');
        if (pathFill && pathText) {
            // Count articles in this path's series
            var sections = document.querySelectorAll('.hex-series-section');
            var totalInPath = 0;
            var readInPath = 0;

            sections.forEach(function (section) {
                var links = section.querySelectorAll('.caption-cta');
                links.forEach(function (link) {
                    var href = link.getAttribute('href');
                    if (!href) return;
                    var m = href.match(/\/series\/([^/]+)\/([^/]+\.html)/);
                    if (!m) m = href.match(/\.\.\/series\/([^/]+)\/([^/]+\.html)/);
                    if (m) {
                        totalInPath++;
                        if (progress[m[1]] && progress[m[1]].indexOf(m[2]) !== -1) {
                            readInPath++;
                        }
                    }
                });
            });

            // Also count from hex-badge "View All" tiles total
            var badges = document.querySelectorAll('.hex-badge');
            badges.forEach(function (badge) {
                var text = badge.textContent;
                var moreMatch = text.match(/\+(\d+) More/);
                if (moreMatch) {
                    totalInPath += parseInt(moreMatch[1]);
                }
            });

            var pct = totalInPath > 0 ? Math.round((readInPath / totalInPath) * 100) : 0;
            pathFill.style.width = pct + '%';
            pathText.textContent = readInPath + ' / ' + totalInPath + ' articles (' + pct + '%)';

            // Show overview if there's progress
            var overview = document.getElementById('pathProgressOverview');
            if (overview && readInPath > 0) {
                overview.style.display = '';
            }
        }

        // Update overall progress on hub page
        var overallFill = document.getElementById('overallProgressFill');
        var overallText = document.getElementById('overallProgressText');
        if (overallFill && overallText) {
            var totalRead = getTotalRead();
            if (totalRead > 0) {
                var overview = document.getElementById('pathProgressOverview');
                if (overview) overview.style.display = '';
                overallFill.style.width = Math.min((totalRead / 870) * 100, 100) + '%';
                overallText.textContent = totalRead + ' articles read';
            }
        }

        // Update path card progress bars on hub page
        var pathCards = document.querySelectorAll('.path-card-progress');
        pathCards.forEach(function (card) {
            var pathSlug = card.getAttribute('data-path');
            if (!pathSlug) return;

            // Map path slugs to their series
            var pathSeries = getPathSeries(pathSlug);
            var read = 0;
            var total = 0;
            pathSeries.forEach(function (s) {
                total += s.count;
                read += getSeriesReadCount(s.folder);
            });

            var fill = card.querySelector('.path-card-progress-fill');
            if (fill && total > 0) {
                var pct = Math.round((read / total) * 100);
                fill.style.width = pct + '%';
                if (read > 0) {
                    card.style.display = 'block';
                }
            }
        });
    }

    // Path slug to series mapping
    function getPathSeries(slug) {
        var map = {
            'embedded-systems': [
                {folder:'arm-assembly',count:28},{folder:'assembly-mastery',count:25},{folder:'cmsis',count:20},
                {folder:'stm32-hal',count:18},{folder:'embedded-systems',count:13},{folder:'embedded-hardware',count:28},
                {folder:'sensors-actuators',count:100},{folder:'usb-dev',count:17}
            ],
            'ai-machine-learning': [
                {folder:'math-for-ai',count:20},{folder:'ai-data-science',count:11},{folder:'neural-networks',count:9},
                {folder:'pytorch-mastery',count:14},{folder:'tensorflow-mastery',count:14},{folder:'nlp',count:16},
                {folder:'ai-app-dev',count:20},{folder:'ai-in-the-wild',count:24}
            ],
            'software-architect': [
                {folder:'data-structures',count:12},{folder:'api-development',count:17},{folder:'database-mastery',count:15},
                {folder:'system-design',count:16},{folder:'cloud-computing',count:11},{folder:'protocols-master',count:20},
                {folder:'gnu-make',count:16},{folder:'kernel-development',count:18}
            ],
            'business-founder': [
                {folder:'entrepreneurship',count:15},{folder:'marketing-strategy',count:21},{folder:'sales-mastery',count:18},
                {folder:'dddm',count:13},{folder:'consulting-frameworks',count:9},{folder:'economics',count:9}
            ],
            'computer-architecture': [
                {folder:'computer-architecture',count:24},{folder:'assembly-mastery',count:25},{folder:'arm-assembly',count:28},
                {folder:'kernel-development',count:18},{folder:'gnu-make',count:16},{folder:'embedded-systems',count:13}
            ],
            'life-sciences': [
                {folder:'biochemistry',count:20},{folder:'physiology',count:12},{folder:'human-anatomy',count:12},
                {folder:'evolutionary-biology',count:12}
            ],
            'philosophy-mind': [
                {folder:'logic-critical-thinking',count:6},{folder:'ethics-moral-philosophy',count:6},{folder:'philosophy-of-mind',count:14},
                {folder:'existentialism',count:11},{folder:'eastern-philosophy',count:10},{folder:'political-philosophy',count:11},
                {folder:'cognitive-psych',count:14},{folder:'behavioral-psychology',count:11},{folder:'social-psychology',count:20}
            ]
        };
        return map[slug] || [];
    }

    // Auto-mark article as read after 30 seconds on page
    function initAutoTrack() {
        if (!window.location.pathname.match(/\/pages\/series\//)) return;

        setTimeout(function () {
            markArticleRead();
        }, 30000); // 30 seconds = likely actually reading
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            updatePathProgress();
            initAutoTrack();
        });
    } else {
        updatePathProgress();
        initAutoTrack();
    }

    // Expose for manual tracking
    window.wzReadingProgress = {
        markRead: markArticleRead,
        getProgress: getProgress,
        getSeriesCount: getSeriesReadCount,
        getTotalRead: getTotalRead
    };

})();
