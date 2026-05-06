/* ============================================
   Site Search - Fuse.js Client-Side Search
   ============================================ */

(function () {
    'use strict';

    var searchIndex = null;
    var fuse = null;
    var searchModal = null;
    var searchInput = null;
    var searchResults = null;
    var searchCount = null;
    var isLoading = false;

    // Determine base path to root (detect depth from URL)
    function getBasePath() {
        var path = window.location.pathname;
        // Count directory depth from root
        if (path.match(/\/pages\/series\/[^/]+\//)) return '../../../';
        if (path.match(/\/pages\/\d{4}\/\d{2}\//)) return '../../../';
        if (path.match(/\/pages\/categories\//)) return '../../';
        if (path.match(/\/pages\//)) return '../';
        return '';
    }

    // Load search index (lazy, on first open)
    function loadSearchIndex(callback) {
        if (searchIndex) { callback(); return; }
        if (isLoading) return;
        isLoading = true;

        var basePath = getBasePath();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', basePath + 'search-index.json', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                isLoading = false;
                if (xhr.status === 200) {
                    try {
                        searchIndex = JSON.parse(xhr.responseText);
                        initFuse();
                        callback();
                    } catch (e) {
                        showError('Failed to parse search index.');
                    }
                } else {
                    showError('Failed to load search index.');
                }
            }
        };
        xhr.send();
    }

    // Initialize Fuse.js with search options
    function initFuse() {
        if (typeof Fuse === 'undefined') {
            showError('Search library not loaded.');
            return;
        }
        fuse = new Fuse(searchIndex, {
            keys: [
                { name: 'title', weight: 0.35 },
                { name: 'description', weight: 0.25 },
                { name: 'keywords', weight: 0.2 },
                { name: 'headings', weight: 0.1 },
                { name: 'excerpt', weight: 0.1 }
            ],
            threshold: 0.35,
            distance: 200,
            includeScore: true,
            includeMatches: true,
            minMatchCharLength: 2,
            limit: 30
        });
    }

    // Format category name for display
    function formatCategory(cat) {
        if (!cat) return '';
        return cat.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    // Highlight matched text
    function highlightMatch(text, indices) {
        if (!indices || !indices.length || !text) return escapeHtml(text || '');
        var result = '';
        var lastIndex = 0;
        // Sort indices and merge overlapping
        var sorted = indices.slice().sort(function (a, b) { return a[0] - b[0]; });
        for (var i = 0; i < sorted.length; i++) {
            var start = sorted[i][0];
            var end = sorted[i][1] + 1;
            result += escapeHtml(text.substring(lastIndex, start));
            result += '<mark>' + escapeHtml(text.substring(start, end)) + '</mark>';
            lastIndex = end;
        }
        result += escapeHtml(text.substring(lastIndex));
        return result;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Perform search
    function performSearch(query) {
        if (!fuse || !query || query.length < 2) {
            searchResults.innerHTML = query && query.length < 2
                ? '<div class="search-empty">Type at least 2 characters to search...</div>'
                : '<div class="search-empty"><i class="fas fa-search"></i><p>Search across 929 articles</p></div>';
            searchCount.textContent = '';
            return;
        }

        var results = fuse.search(query);
        searchCount.textContent = results.length + ' result' + (results.length !== 1 ? 's' : '');

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-empty"><i class="fas fa-search-minus"></i><p>No results found for "' + escapeHtml(query) + '"</p><span>Try different keywords or check spelling</span></div>';
            return;
        }

        var html = '';
        var basePath = getBasePath();
        for (var i = 0; i < results.length; i++) {
            var item = results[i].item;
            var matches = results[i].matches || [];

            // Find title match for highlighting
            var titleHtml = escapeHtml(item.title);
            for (var m = 0; m < matches.length; m++) {
                if (matches[m].key === 'title') {
                    titleHtml = highlightMatch(item.title, matches[m].indices);
                    break;
                }
            }

            var description = item.description || item.excerpt || '';
            if (description.length > 150) description = description.substring(0, 150) + '...';

            // Build URL - adjust relative path
            var url = item.url;
            if (url.startsWith('/')) {
                url = basePath + url.substring(1);
            }

            html += '<div class="search-result-item">';
            html += '<a href="' + url + '" class="search-result-link">';
            html += '<div class="search-result-category">' + formatCategory(item.category) + '</div>';
            html += '<div class="search-result-title">' + titleHtml + '</div>';
            html += '<div class="search-result-desc">' + escapeHtml(description) + '</div>';
            if (item.date) {
                html += '<div class="search-result-meta"><i class="fas fa-calendar-alt"></i> ' + item.date + '</div>';
            }
            html += '</a>';
            html += '<a href="' + url + '" target="_blank" rel="noopener" class="search-result-newtab" title="Open in new tab"><i class="fas fa-external-link-alt"></i></a>';
            html += '</div>';
        }

        searchResults.innerHTML = html;
    }

    function showError(msg) {
        if (searchResults) {
            searchResults.innerHTML = '<div class="search-empty"><i class="fas fa-exclamation-triangle"></i><p>' + msg + '</p></div>';
        }
    }

    // Open search modal
    function openSearch() {
        if (!searchModal) createSearchModal();
        searchModal.classList.add('search-open');
        document.body.style.overflow = 'hidden';
        searchInput.value = '';
        searchResults.innerHTML = '<div class="search-empty"><i class="fas fa-search"></i><p>Search across 929 articles</p></div>';
        searchCount.textContent = '';

        // Focus after animation
        setTimeout(function () { searchInput.focus(); }, 100);

        // Load index if not already loaded
        loadSearchIndex(function () {
            if (searchInput.value.length >= 2) {
                performSearch(searchInput.value);
            }
        });
    }

    // Close search modal
    function closeSearch() {
        if (searchModal) {
            searchModal.classList.remove('search-open');
            document.body.style.overflow = '';
        }
    }

    // Create search modal DOM
    function createSearchModal() {
        searchModal = document.createElement('div');
        searchModal.id = 'searchModal';
        searchModal.className = 'search-modal';
        searchModal.innerHTML =
            '<div class="search-backdrop" onclick="window.closeSearch()"></div>' +
            '<div class="search-container">' +
            '  <div class="search-header">' +
            '    <div class="search-input-wrap">' +
            '      <i class="fas fa-search search-icon"></i>' +
            '      <input type="text" id="searchInput" class="search-input" placeholder="Search articles, topics, series..." autocomplete="off" />' +
            '      <kbd class="search-kbd">ESC</kbd>' +
            '    </div>' +
            '    <button class="search-close" onclick="window.closeSearch()" aria-label="Close search">&times;</button>' +
            '  </div>' +
            '  <div class="search-count" id="searchCount"></div>' +
            '  <div class="search-results" id="searchResults">' +
            '    <div class="search-empty"><i class="fas fa-search"></i><p>Search across 929 articles</p></div>' +
            '  </div>' +
            '  <div class="search-footer">' +
            '    <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>' +
            '    <span><kbd>Enter</kbd> Open</span>' +
            '    <span><kbd>Esc</kbd> Close</span>' +
            '  </div>' +
            '</div>';

        document.body.appendChild(searchModal);

        searchInput = document.getElementById('searchInput');
        searchResults = document.getElementById('searchResults');
        searchCount = document.getElementById('searchCount');

        // Debounced search
        var debounceTimer;
        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            var query = searchInput.value.trim();
            debounceTimer = setTimeout(function () {
                performSearch(query);
            }, 150);
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeSearch();
                return;
            }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                navigateResults(e.key === 'ArrowDown' ? 1 : -1);
            }
            if (e.key === 'Enter') {
                var active = searchResults.querySelector('.search-result-item.active');
                if (active) {
                    var link = active.querySelector('.search-result-link');
                    if (link) link.click();
                }
            }
        });
    }

    // Keyboard navigation through results
    function navigateResults(direction) {
        var items = searchResults.querySelectorAll('.search-result-item');
        if (!items.length) return;

        var current = searchResults.querySelector('.search-result-item.active');
        var index = -1;
        if (current) {
            current.classList.remove('active');
            for (var i = 0; i < items.length; i++) {
                if (items[i] === current) { index = i; break; }
            }
        }

        index += direction;
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;

        items[index].classList.add('active');
        items[index].scrollIntoView({ block: 'nearest' });
    }

    // Global keyboard shortcut: Ctrl+K or Cmd+K
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('search-open')) {
            closeSearch();
        }
    });

    // Expose globally
    window.openSearch = openSearch;
    window.closeSearch = closeSearch;

})();
