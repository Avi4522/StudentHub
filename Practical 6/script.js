/**
 * StudentHub - Practical 6: Rendering External JSON Data using Fetch API, Search and Filter
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // State Store
    // --------------------------------------------------------------------------
    const state = {
        activeDataset: 'events', // 'events' | 'students' | 'faqs'
        data: {
            events: [],
            students: [],
            faqs: []
        },
        filtered: [],
        currentPage: 1,
        pageSize: 6,
        searchQuery: '',
        selectedCategory: 'ALL',
        sortOrder: 'default'
    };

    // --------------------------------------------------------------------------
    // DOM Elements
    // --------------------------------------------------------------------------
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const filterLabel = document.getElementById('filterLabel');
    const sortSelect = document.getElementById('sortSelect');
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    const btnRefresh = document.getElementById('btnRefresh');
    const cacheBadge = document.getElementById('cacheBadge');

    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const emptyState = document.getElementById('emptyState');
    const btnRetryFetch = document.getElementById('btnRetryFetch');
    const btnResetFilters = document.getElementById('btnResetFilters');

    const dataGrid = document.getElementById('dataGrid');
    const resultsCountText = document.getElementById('resultsCountText');
    const paginationNav = document.getElementById('paginationNav');
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    const pageNumbersContainer = document.getElementById('pageNumbersContainer');

    // Dependent dropdown elements
    const deptSelect = document.getElementById('deptSelect');
    const specSelect = document.getElementById('specSelect');
    const dependentResult = document.getElementById('dependentResult');

    // --------------------------------------------------------------------------
    // 1. Fetch API Data Loader with LocalStorage Caching
    // --------------------------------------------------------------------------
    /**
     * Load JSON dataset via Fetch API
     * @param {'events' | 'students' | 'faqs'} datasetName 
     * @param {boolean} forceRefresh 
     */
    async function fetchDataset(datasetName, forceRefresh = false) {
        showLoadingState();

        const cacheKey = `studenthub_cache_${datasetName}`;
        const filePath = `${datasetName}.json`;

        try {
            // Check cache if not forcing refresh
            if (!forceRefresh && state.data[datasetName].length > 0) {
                renderLoadedData(datasetName, false);
                return;
            }

            // Fetch from local JSON file
            const response = await fetch(filePath, { cache: forceRefresh ? 'no-cache' : 'default' });

            if (!response.ok) {
                throw new Error(`HTTP Error: Failed to fetch ${filePath} (Status ${response.status} ${response.statusText})`);
            }

            const jsonData = await response.json();

            if (!Array.isArray(jsonData)) {
                throw new Error(`Malformed JSON: Expected array of records in ${filePath}`);
            }

            state.data[datasetName] = jsonData;

            // Cache in localStorage for offline resilience
            try {
                localStorage.setItem(cacheKey, JSON.stringify(jsonData));
            } catch (e) {
                console.warn('LocalStorage quota exceeded or unavailable for caching.');
            }

            renderLoadedData(datasetName, false);

        } catch (err) {
            console.error('Fetch error:', err);

            // Attempt offline fallback from localStorage
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    state.data[datasetName] = JSON.parse(cached);
                    renderLoadedData(datasetName, true);
                    return;
                } catch (parseErr) {
                    // Fall through to error
                }
            }

            showErrorState(err.message || 'Network error encountered while fetching dataset.');
        }
    }

    function renderLoadedData(datasetName, isFromOfflineCache) {
        cacheBadge.innerHTML = isFromOfflineCache ? '&#128190; Cached Offline' : '&#9889; Live Fetch';
        cacheBadge.style.backgroundColor = isFromOfflineCache ? '#fef3c7' : '#ecfdf5';
        cacheBadge.style.color = isFromOfflineCache ? '#92400e' : '#065f46';

        populateCategoryDropdown(datasetName);
        applyFiltersAndRender(true);
    }

    // --------------------------------------------------------------------------
    // 2. UI State Switchers
    // --------------------------------------------------------------------------
    function showLoadingState() {
        loadingState.hidden = false;
        errorState.hidden = true;
        emptyState.hidden = true;
        dataGrid.style.display = 'none';
        paginationNav.hidden = true;
        resultsCountText.textContent = 'Fetching data...';
    }

    function showErrorState(msg) {
        loadingState.hidden = true;
        errorState.hidden = false;
        emptyState.hidden = true;
        dataGrid.style.display = 'none';
        paginationNav.hidden = true;
        errorMessage.textContent = msg;
        resultsCountText.textContent = 'Error loading records';
    }

    function showEmptyState() {
        loadingState.hidden = true;
        errorState.hidden = true;
        emptyState.hidden = false;
        dataGrid.style.display = 'none';
        paginationNav.hidden = true;
        resultsCountText.textContent = 'Showing 0 records';
    }

    function showResultsView() {
        loadingState.hidden = true;
        errorState.hidden = true;
        emptyState.hidden = true;
        dataGrid.style.display = 'grid';
    }

    // --------------------------------------------------------------------------
    // 3. Dynamic Category Filter Setup
    // --------------------------------------------------------------------------
    function populateCategoryDropdown(datasetName) {
        const rawList = state.data[datasetName] || [];
        categoryFilter.innerHTML = '<option value="ALL">All Categories</option>';

        let uniqueCategories = [];
        if (datasetName === 'events') {
            filterLabel.textContent = 'Event Category Filter';
            uniqueCategories = Array.from(new Set(rawList.map(item => item.category))).filter(Boolean);
        } else if (datasetName === 'students') {
            filterLabel.textContent = 'Department Filter';
            uniqueCategories = Array.from(new Set(rawList.map(item => item.department))).filter(Boolean);
        } else if (datasetName === 'faqs') {
            filterLabel.textContent = 'FAQ Category Filter';
            uniqueCategories = Array.from(new Set(rawList.map(item => item.category))).filter(Boolean);
        }

        uniqueCategories.sort().forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            categoryFilter.appendChild(opt);
        });

        // Restore selected category if valid in new dataset, otherwise reset
        if (uniqueCategories.includes(state.selectedCategory)) {
            categoryFilter.value = state.selectedCategory;
        } else {
            state.selectedCategory = 'ALL';
            categoryFilter.value = 'ALL';
        }
    }

    // --------------------------------------------------------------------------
    // 4. Filtering, Searching, and Sorting Algorithms
    // --------------------------------------------------------------------------
    function applyFiltersAndRender(resetPageToOne = false) {
        if (resetPageToOne) {
            state.currentPage = 1;
        }

        const rawList = state.data[state.activeDataset] || [];
        const query = state.searchQuery.trim().toLowerCase();

        // 1. Search Filter
        let results = rawList.filter(item => {
            if (!query) return true;

            if (state.activeDataset === 'events') {
                return (
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.venue.toLowerCase().includes(query) ||
                    item.organizer.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
                );
            } else if (state.activeDataset === 'students') {
                return (
                    item.fullName.toLowerCase().includes(query) ||
                    item.enrollmentNo.toLowerCase().includes(query) ||
                    item.email.toLowerCase().includes(query) ||
                    item.course.toLowerCase().includes(query) ||
                    item.department.toLowerCase().includes(query)
                );
            } else if (state.activeDataset === 'faqs') {
                const inTags = Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(query));
                return (
                    item.question.toLowerCase().includes(query) ||
                    item.answer.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query) ||
                    inTags
                );
            }
            return true;
        });

        // 2. Category Filter
        if (state.selectedCategory !== 'ALL') {
            results = results.filter(item => {
                if (state.activeDataset === 'events') return item.category === state.selectedCategory;
                if (state.activeDataset === 'students') return item.department === state.selectedCategory;
                if (state.activeDataset === 'faqs') return item.category === state.selectedCategory;
                return true;
            });
        }

        // 3. Sorting Logic
        if (state.sortOrder === 'title-asc') {
            results.sort((a, b) => getTitleOrName(a).localeCompare(getTitleOrName(b)));
        } else if (state.sortOrder === 'title-desc') {
            results.sort((a, b) => getTitleOrName(b).localeCompare(getTitleOrName(a)));
        } else if (state.sortOrder === 'metric-desc') {
            results.sort((a, b) => getMetric(b) - getMetric(a));
        } else if (state.sortOrder === 'metric-asc') {
            results.sort((a, b) => getMetric(a) - getMetric(b));
        }

        state.filtered = results;

        if (results.length === 0) {
            showEmptyState();
            return;
        }

        showResultsView();
        renderPagination();
        renderGrid();
    }

    function getTitleOrName(item) {
        return item.title || item.fullName || item.question || '';
    }

    function getMetric(item) {
        if (item.date) return new Date(item.date).getTime();
        if (item.cgpa) return parseFloat(item.cgpa) || 0;
        return item.id || 0;
    }

    // --------------------------------------------------------------------------
    // 5. Pagination Logic
    // --------------------------------------------------------------------------
    function renderPagination() {
        const totalItems = state.filtered.length;
        const totalPages = Math.ceil(totalItems / state.pageSize);

        if (totalPages <= 1) {
            paginationNav.hidden = true;
            return;
        }

        paginationNav.hidden = false;
        pageNumbersContainer.innerHTML = '';

        btnPrevPage.disabled = state.currentPage === 1;
        btnNextPage.disabled = state.currentPage === totalPages;

        for (let i = 1; i <= totalPages; i++) {
            const pageNumBtn = document.createElement('button');
            pageNumBtn.type = 'button';
            pageNumBtn.className = `page-num ${i === state.currentPage ? 'active' : ''}`;
            pageNumBtn.textContent = String(i);
            pageNumBtn.setAttribute('aria-label', `Page ${i}`);
            pageNumBtn.addEventListener('click', () => {
                state.currentPage = i;
                renderPagination();
                renderGrid();
                dataGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
            pageNumbersContainer.appendChild(pageNumBtn);
        }
    }

    // --------------------------------------------------------------------------
    // 6. Dynamic Card Template Renderers
    // --------------------------------------------------------------------------
    function renderGrid() {
        dataGrid.innerHTML = '';

        const totalItems = state.filtered.length;
        const startIndex = (state.currentPage - 1) * state.pageSize;
        const endIndex = Math.min(startIndex + state.pageSize, totalItems);
        const pageItems = state.filtered.slice(startIndex, endIndex);

        resultsCountText.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalItems} records`;

        pageItems.forEach(item => {
            let cardHtml = '';
            if (state.activeDataset === 'events') {
                cardHtml = createEventCard(item);
            } else if (state.activeDataset === 'students') {
                cardHtml = createStudentCard(item);
            } else if (state.activeDataset === 'faqs') {
                cardHtml = createFaqCard(item);
            }
            dataGrid.insertAdjacentHTML('beforeend', cardHtml);
        });
    }

    function createEventCard(ev) {
        const statusClass = ev.status ? `status-${ev.status.toLowerCase()}` : '';
        return `
            <article class="card-item event-card">
                <div>
                    <div class="card-header-top">
                        <span class="category-tag">${escapeHtml(ev.category)}</span>
                        <span class="status-tag ${statusClass}">${escapeHtml(ev.status || 'Active')}</span>
                    </div>
                    <h3 class="card-title">${escapeHtml(ev.title)}</h3>
                    <p class="card-desc">${escapeHtml(ev.description)}</p>
                </div>
                <ul class="card-meta-list">
                    <li class="meta-row">&#128197; <strong>Date:</strong> ${escapeHtml(ev.date)}</li>
                    <li class="meta-row">&#128205; <strong>Venue:</strong> ${escapeHtml(ev.venue)}</li>
                    <li class="meta-row">&#128101; <strong>Organizer:</strong> ${escapeHtml(ev.organizer)} &bull; Cap: ${ev.capacity}</li>
                </ul>
            </article>
        `;
    }

    function createStudentCard(st) {
        const initials = st.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        return `
            <article class="card-item student-card">
                <div>
                    <div class="student-header">
                        <div class="student-avatar" aria-hidden="true">${initials}</div>
                        <div class="student-info">
                            <h3>${escapeHtml(st.fullName)}</h3>
                            <span class="enrollment-code">${escapeHtml(st.enrollmentNo)}</span>
                        </div>
                    </div>
                    <p class="card-desc">
                        <strong>Program:</strong> ${escapeHtml(st.course)}<br>
                        <strong>Year / Sem:</strong> ${escapeHtml(st.academicYear)} (Semester ${st.semester})<br>
                        <strong>Email:</strong> ${escapeHtml(st.email)}
                    </p>
                </div>
                <div class="card-meta-list" style="flex-direction: row; justify-content: space-between; align-items: center;">
                    <span class="cgpa-pill">&#11088; CGPA: ${st.cgpa.toFixed(2)}</span>
                    <span class="category-tag">${escapeHtml(st.department)}</span>
                </div>
            </article>
        `;
    }

    function createFaqCard(faq) {
        const tagBadges = Array.isArray(faq.tags)
            ? faq.tags.map(t => `<span class="tag-chip">#${escapeHtml(t)}</span>`).join('')
            : '';
        return `
            <article class="card-item faq-card">
                <div>
                    <div class="card-header-top">
                        <span class="category-tag">${escapeHtml(faq.category)}</span>
                        <span class="enrollment-code">FAQ #${faq.id}</span>
                    </div>
                    <h3 class="card-title">${escapeHtml(faq.question)}</h3>
                    <p class="card-desc">${escapeHtml(faq.answer)}</p>
                </div>
                <div class="tag-cloud">
                    ${tagBadges}
                </div>
            </article>
        `;
    }

    // --------------------------------------------------------------------------
    // 7. Event Listeners & Controls
    // --------------------------------------------------------------------------
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            state.activeDataset = tab.getAttribute('data-dataset');
            state.searchQuery = '';
            searchInput.value = '';
            clearSearchBtn.hidden = true;
            fetchDataset(state.activeDataset);
        });
    });

    // Debounced search input
    let searchDebounceTimer = null;
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        clearSearchBtn.hidden = query.length === 0;

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            state.searchQuery = query;
            applyFiltersAndRender(true);
        }, 250);
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.searchQuery = '';
        clearSearchBtn.hidden = true;
        applyFiltersAndRender(true);
        searchInput.focus();
    });

    // Category filter change
    categoryFilter.addEventListener('change', (e) => {
        state.selectedCategory = e.target.value;
        applyFiltersAndRender(true);
    });

    // Sort order change
    sortSelect.addEventListener('change', (e) => {
        state.sortOrder = e.target.value;
        applyFiltersAndRender(false);
    });

    // Page size change
    pageSizeSelect.addEventListener('change', (e) => {
        state.pageSize = parseInt(e.target.value, 10);
        applyFiltersAndRender(true);
    });

    // Refresh button
    btnRefresh.addEventListener('click', () => {
        fetchDataset(state.activeDataset, true);
    });

    // Retry button on error
    btnRetryFetch.addEventListener('click', () => {
        fetchDataset(state.activeDataset, true);
    });

    // Reset filters button on empty state
    btnResetFilters.addEventListener('click', () => {
        state.searchQuery = '';
        searchInput.value = '';
        clearSearchBtn.hidden = true;
        state.selectedCategory = 'ALL';
        categoryFilter.value = 'ALL';
        state.sortOrder = 'default';
        sortSelect.value = 'default';
        applyFiltersAndRender(true);
    });

    // Pagination next / prev buttons
    btnPrevPage.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderPagination();
            renderGrid();
            dataGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    btnNextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(state.filtered.length / state.pageSize);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderPagination();
            renderGrid();
            dataGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    // --------------------------------------------------------------------------
    // 8. Dependent Dropdown Extension Logic
    // --------------------------------------------------------------------------
    const SPECIALIZATIONS = {
        CE: [
            'Software Engineering & Cloud Architectures',
            'Artificial Intelligence & Machine Learning',
            'Cybersecurity & Threat Intelligence',
            'IoT & Embedded Robotics'
        ],
        IT: [
            'DevOps & Continuous Integration',
            'Mobile & Web Application Development',
            'Big Data Analytics & BI',
            'Information Security & Auditing'
        ],
        AI: [
            'Natural Language Processing (NLP)',
            'Computer Vision & Autonomous Systems',
            'Deep Learning & Neural Networks',
            'Predictive Analytics & Statistics'
        ],
        EC: [
            'VLSI System Design',
            'Wireless 5G/6G Sensor Networks',
            'Signal Processing & Telemetry',
            'Embedded Firmware Development'
        ]
    };

    if (deptSelect && specSelect) {
        deptSelect.addEventListener('change', (e) => {
            const chosenDept = e.target.value;
            specSelect.innerHTML = '';

            if (!chosenDept || !SPECIALIZATIONS[chosenDept]) {
                specSelect.disabled = true;
                specSelect.innerHTML = '<option value="">-- Select department first --</option>';
                if (dependentResult) dependentResult.hidden = true;
                return;
            }

            specSelect.disabled = false;
            specSelect.innerHTML = '<option value="">-- Select Specialization Track --</option>';
            SPECIALIZATIONS[chosenDept].forEach(track => {
                const opt = document.createElement('option');
                opt.value = track;
                opt.textContent = track;
                specSelect.appendChild(opt);
            });
        });

        specSelect.addEventListener('change', (e) => {
            const track = e.target.value;
            if (track && dependentResult) {
                dependentResult.hidden = false;
                dependentResult.innerHTML = `&#10004; <strong>Selected Academic Pathway:</strong> ${deptSelect.options[deptSelect.selectedIndex].text} &rarr; <em>${track}</em>`;
            } else if (dependentResult) {
                dependentResult.hidden = true;
            }
        });
    }

    // Helper: Escape HTML to prevent injection
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    // --------------------------------------------------------------------------
    // Initial Load
    // --------------------------------------------------------------------------
    fetchDataset('events');
});
