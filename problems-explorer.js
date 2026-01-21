// Problems Explorer - Main Logic
console.log('problems-explorer.js loaded successfully');

// Update debug status immediately
if (document.getElementById('js-status')) {
  document.getElementById('js-status').textContent = '✅ JavaScript loaded!';
}

let allProblems = [];
let filteredProblems = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 20;

// Filters state
const filters = {
  search: '',
  difficulty: new Set(),
  topics: new Set(),
  companies: new Set(),
  sort: 'frequency-desc'
};

// Load problems data
async function loadProblems() {
  try {
    // Try multiple methods to get the correct URL
    let url;
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      url = chrome.runtime.getURL('data/leetcode-problems.json');
    } else {
      // Fallback for when chrome.runtime is not available
      url = 'data/leetcode-problems.json';
    }

    console.log('Attempting to load from:', url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw data received:', data);

    if (!data || !data.problems || !Array.isArray(data.problems)) {
      throw new Error('Invalid data format: expected { problems: [...] }');
    }

    allProblems = data.problems;
    console.log('Loaded problems:', allProblems.length);
    console.log('First problem sample:', allProblems[0]);
    document.getElementById('total-problems').textContent = allProblems.length;

    // Update debug status
    if (document.getElementById('js-status')) {
      document.getElementById('js-status').innerHTML = `✅ JavaScript loaded!<br>✅ Loaded ${allProblems.length} problems<br>🔄 Rendering...`;
    }

    // Extract unique topics and companies
    extractFilters();

    // Apply initial filters and render
    applyFilters();
    renderProblems();
    hideLoading();

    // Final status update
    if (document.getElementById('js-status')) {
      document.getElementById('js-status').innerHTML = `✅ All systems operational!<br>📊 ${allProblems.length} problems loaded<br>🎯 ${filteredProblems.length} problems displayed`;
    }
  } catch (error) {
    console.error('Failed to load problems:', error);
    console.error('Error details:', error.message, error.stack);

    // Update debug status with error
    if (document.getElementById('js-status')) {
      document.getElementById('js-status').innerHTML = `❌ Error loading data!<br>📛 ${error.message}<br>💡 Check console (F12)`;
    }

    showError();
  }
}

// Extract unique topics and companies for filter chips
function extractFilters() {
  const topicsSet = new Set();
  const companiesMap = new Map(); // Track company frequency

  allProblems.forEach(problem => {
    // Extract topics
    problem.topics?.forEach(topic => topicsSet.add(topic.name));

    // Extract companies
    problem.companies?.forEach(company => {
      const count = companiesMap.get(company) || 0;
      companiesMap.set(company, count + 1);
    });
  });

  // Render topics (sorted alphabetically)
  const topics = Array.from(topicsSet).sort();
  renderTopics(topics);

  // Render companies (sorted by frequency)
  const companies = Array.from(companiesMap.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
    .map(([company]) => company);
  renderCompanies(companies);
}

// Render topic filter chips
let allTopics = [];
let topicsExpanded = false;
const TOPICS_INITIAL_LIMIT = 12;

function renderTopics(topics) {
  allTopics = topics;
  const container = document.getElementById('topics-container');
  const showMoreBtn = document.getElementById('topics-show-more');

  const displayTopics = topicsExpanded ? topics : topics.slice(0, TOPICS_INITIAL_LIMIT);

  container.innerHTML = displayTopics.map(topic => `
    <button class="filter-chip topic-filter" data-topic="${topic}">
      ${topic}
    </button>
  `).join('');

  // Show/hide "Show more" button
  if (topics.length > TOPICS_INITIAL_LIMIT) {
    showMoreBtn.classList.remove('hidden');
    showMoreBtn.textContent = topicsExpanded ? 'Show less' : `Show ${topics.length - TOPICS_INITIAL_LIMIT} more`;
  } else {
    showMoreBtn.classList.add('hidden');
  }

  // Add click listeners
  document.querySelectorAll('.topic-filter').forEach(btn => {
    btn.addEventListener('click', () => toggleTopicFilter(btn.dataset.topic, btn));
  });
}

// Render company filter chips
let allCompanies = [];
let companiesExpanded = false;
let filteredCompanies = [];
const COMPANIES_INITIAL_LIMIT = 15;

function renderCompanies(companies) {
  allCompanies = companies;
  filteredCompanies = companies;
  updateCompanyDisplay();
}

function updateCompanyDisplay() {
  const container = document.getElementById('companies-container');
  const showMoreBtn = document.getElementById('companies-show-more');
  const searchTerm = document.getElementById('company-search')?.value.toLowerCase() || '';

  // Filter by search term
  const filtered = searchTerm
    ? allCompanies.filter(c => c.toLowerCase().includes(searchTerm))
    : allCompanies;

  filteredCompanies = filtered;
  const displayCompanies = companiesExpanded ? filtered : filtered.slice(0, COMPANIES_INITIAL_LIMIT);

  container.innerHTML = displayCompanies.map(company => `
    <button class="filter-chip company-filter" data-company="${company}">
      ${company}
    </button>
  `).join('');

  // Show/hide "Show more" button
  if (filtered.length > COMPANIES_INITIAL_LIMIT && !searchTerm) {
    showMoreBtn.classList.remove('hidden');
    showMoreBtn.textContent = companiesExpanded ? 'Show less' : `Show ${filtered.length - COMPANIES_INITIAL_LIMIT} more`;
  } else {
    showMoreBtn.classList.add('hidden');
  }

  // Add click listeners
  document.querySelectorAll('.company-filter').forEach(btn => {
    btn.addEventListener('click', () => toggleCompanyFilter(btn.dataset.company, btn));
  });

  // Company search functionality
  const companySearch = document.getElementById('company-search');
  companySearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = companies.filter(c => c.toLowerCase().includes(searchTerm));

    container.innerHTML = filtered.slice(0, 100).map(company => `
      <button class="filter-chip company-filter px-2.5 py-1.5 rounded-md bg-white/[0.02] border border-white/5 text-xs font-medium text-white/70 hover:bg-white/10 transition-all ${filters.companies.has(company) ? 'active' : ''}" data-company="${company}">
        ${company}
      </button>
    `).join('');

    // Re-attach listeners
    document.querySelectorAll('.company-filter').forEach(btn => {
      btn.addEventListener('click', () => toggleCompanyFilter(btn.dataset.company, btn));
    });
  });
}

// Toggle difficulty filter
function toggleDifficultyFilter(difficulty, btn) {
  if (filters.difficulty.has(difficulty)) {
    filters.difficulty.delete(difficulty);
    btn.classList.remove('active');
    btn.classList.remove('border-[#ffa116]');
  } else {
    filters.difficulty.add(difficulty);
    btn.classList.add('active');
    btn.classList.add('border-[#ffa116]');
  }
  updateFilterCounts();
  applyFiltersAndRender();
}

// Toggle topic filter
function toggleTopicFilter(topic, btn) {
  if (filters.topics.has(topic)) {
    filters.topics.delete(topic);
    btn.classList.remove('active');
    btn.classList.remove('border-[#ffa116]');
  } else {
    filters.topics.add(topic);
    btn.classList.add('active');
    btn.classList.add('border-[#ffa116]');
  }

  updateFilterCounts();
  applyFiltersAndRender();
}

// Toggle company filter
function toggleCompanyFilter(company, btn) {
  if (filters.companies.has(company)) {
    filters.companies.delete(company);
    btn.classList.remove('active');
    btn.classList.remove('border-[#ffa116]');
  } else {
    filters.companies.add(company);
    btn.classList.add('active');
    btn.classList.add('border-[#ffa116]');
  }

  updateFilterCounts();
  applyFiltersAndRender();
}

// Update filter counts
function updateFilterCounts() {
  const difficultyCount = document.getElementById('difficulty-count');
  const topicsCount = document.getElementById('topics-count');
  const companiesCount = document.getElementById('companies-count');

  if (filters.difficulty.size > 0) {
    difficultyCount.textContent = `${filters.difficulty.size} selected`;
    difficultyCount.classList.remove('hidden');
  } else {
    difficultyCount.classList.add('hidden');
  }

  if (filters.topics.size > 0) {
    topicsCount.textContent = `${filters.topics.size} selected`;
    topicsCount.classList.remove('hidden');
  } else {
    topicsCount.classList.add('hidden');
  }

  if (filters.companies.size > 0) {
    companiesCount.textContent = `${filters.companies.size} selected`;
    companiesCount.classList.remove('hidden');
  } else {
    companiesCount.classList.add('hidden');
  }
}

// Apply all filters
function applyFilters() {
  filteredProblems = allProblems.filter(problem => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = problem.title.toLowerCase().includes(searchLower);
      const matchesId = problem.id.toString().includes(searchLower);
      const matchesTopic = problem.topics?.some(t => t.name.toLowerCase().includes(searchLower));

      if (!matchesTitle && !matchesId && !matchesTopic) return false;
    }

    // Difficulty filter
    if (filters.difficulty.size > 0 && !filters.difficulty.has(problem.difficulty)) {
      return false;
    }

    // Topics filter
    if (filters.topics.size > 0) {
      const problemTopics = problem.topics?.map(t => t.name) || [];
      const hasMatch = Array.from(filters.topics).some(topic => problemTopics.includes(topic));
      if (!hasMatch) return false;
    }

    // Companies filter
    if (filters.companies.size > 0) {
      const problemCompanies = problem.companies || [];
      const hasMatch = Array.from(filters.companies).some(company => problemCompanies.includes(company));
      if (!hasMatch) return false;
    }

    return true;
  });

  // Apply sorting
  sortProblems();

  // Update filtered count
  document.getElementById('filtered-count').textContent = filteredProblems.length;
}

// Sort problems based on selected option
function sortProblems() {
  const sortBy = filters.sort;

  filteredProblems.sort((a, b) => {
    switch (sortBy) {
      case 'frequency-desc':
        return (b.frequency || 0) - (a.frequency || 0);
      case 'frequency-asc':
        return (a.frequency || 0) - (b.frequency || 0);
      case 'id-asc':
        return a.id - b.id;
      case 'id-desc':
        return b.id - a.id;
      case 'acceptance-desc':
        return (b.acRate || 0) - (a.acRate || 0);
      case 'acceptance-asc':
        return (a.acRate || 0) - (b.acRate || 0);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
}

// Render problems table
function renderProblems() {
  console.log('renderProblems called, filteredProblems.length:', filteredProblems.length);
  const tableBody = document.getElementById('problems-table');

  if (!tableBody) {
    console.error('Table body element not found!');
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageProblems = filteredProblems.slice(start, end);

  console.log('Rendering problems from', start, 'to', end, '- count:', pageProblems.length);

  if (filteredProblems.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();

  tableBody.innerHTML = pageProblems.map(problem => {
    const difficultyClass = `difficulty-${problem.difficulty.toLowerCase()}`;
    const badgeClass = `badge-${problem.difficulty.toLowerCase()}`;
    const topics = problem.topics?.slice(0, 2).map(t => t.name) || [];
    const moreTopics = problem.topics?.length > 2 ? problem.topics.length - 2 : 0;

    return `
      <tr class="problem-row cursor-pointer group" data-url="${problem.url}">
        <td class="px-6 py-3">
          <span class="text-xs text-white/40 font-mono">${problem.id}</span>
        </td>
        <td class="px-6 py-3">
          <div class="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">${problem.title}</div>
        </td>
        <td class="px-6 py-3">
          <span class="badge ${badgeClass}">${problem.difficulty}</span>
        </td>
        <td class="px-6 py-3 text-center">
          <span class="text-xs text-white/60 font-medium">${problem.acRate?.toFixed(1)}%</span>
        </td>
        <td class="px-6 py-3">
          <div class="flex items-center gap-2">
            <span class="text-xs text-white/60 font-medium tabular-nums min-w-[28px]">${problem.frequency?.toFixed(1) || '0.0'}</span>
            <div class="w-16 h-1.5 rounded-full bg-white/10">
              <div class="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500" style="width: ${Math.min(problem.frequency || 0, 10) * 10}%"></div>
            </div>
          </div>
        </td>
        <td class="px-6 py-3">
          <div class="flex flex-wrap gap-1.5">
            ${topics.map(topic => `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/60">${topic}</span>`).join('')}
            ${moreTopics > 0 ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white/50">+${moreTopics}</span>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Add click listeners
  document.querySelectorAll('.problem-row').forEach(row => {
    row.addEventListener('click', () => {
      window.open(row.dataset.url, '_blank');
    });
  });

  renderPagination();
}

// Render pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const pagination = document.getElementById('pagination');

  if (totalPages <= 1) {
    pagination.classList.add('hidden');
    return;
  }

  pagination.classList.remove('hidden');

  // Update showing text
  const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredProblems.length);
  document.getElementById('showing-start').textContent = start;
  document.getElementById('showing-end').textContent = end;
  document.getElementById('showing-total').textContent = filteredProblems.length;

  // Update buttons
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Render page numbers (show max 5 pages)
  const pageNumbers = document.getElementById('page-numbers');
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  pageNumbers.innerHTML = pages.map(page => {
    if (page === '...') {
      return '<span class="px-3 py-2 text-[#eff1f699]">...</span>';
    }
    return `
      <button class="page-btn px-3 py-2 rounded-lg text-sm ${page === currentPage ? 'bg-[#ffa116] text-[#1a1a1a]' : 'bg-[#282828] text-[#eff1f6] hover:bg-[#3a3a3a]'} transition-colors" data-page="${page}">
        ${page}
      </button>
    `;
  }).join('');

  // Add click listeners for page buttons
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      renderProblems();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Helper functions
function applyFiltersAndRender() {
  currentPage = 1;
  applyFilters();
  renderProblems();
}

function hideLoading() {
  document.getElementById('loading-state').classList.add('hidden');
}

function showError() {
  document.getElementById('loading-state').innerHTML = `
    <div class="text-center py-12">
      <svg class="mx-auto w-16 h-16 text-[#ff375f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p class="mt-3 text-sm text-[#eff1f699]">Failed to load problems data.</p>
    </div>
  `;
}

function showEmptyState() {
  document.getElementById('problems-table').innerHTML = '';
  document.getElementById('pagination').classList.add('hidden');
  document.getElementById('empty-state').classList.remove('hidden');
}

function hideEmptyState() {
  document.getElementById('empty-state').classList.add('hidden');
}

function resetFilters() {
  filters.search = '';
  filters.difficulty.clear();
  filters.topics.clear();
  filters.companies.clear();
  filters.sort = 'frequency-desc';

  // Reset UI
  document.getElementById('search-input').value = '';
  document.getElementById('sort-select').value = 'frequency-desc';
  document.getElementById('company-search').value = '';

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.remove('active');
    chip.classList.remove('border-[#ffa116]');
  });

  updateFilterCounts();
  applyFiltersAndRender();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  console.log('chrome object:', typeof chrome !== 'undefined' ? 'available' : 'not available');
  console.log('chrome.runtime:', typeof chrome !== 'undefined' && chrome.runtime ? 'available' : 'not available');

  // Update debug status
  if (document.getElementById('js-status')) {
    document.getElementById('js-status').innerHTML = '✅ JavaScript loaded!<br>🔄 Loading problem data...';
  }

  loadProblems();

  // Search
  const searchInput = document.getElementById('search-input');
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filters.search = e.target.value;
      applyFiltersAndRender();
    }, 300);
  });

  // Sort
  document.getElementById('sort-select').addEventListener('change', (e) => {
    filters.sort = e.target.value;
    applyFiltersAndRender();
  });

  // Difficulty filters
  document.querySelectorAll('.difficulty-filter').forEach(btn => {
    btn.addEventListener('click', () => toggleDifficultyFilter(btn.dataset.difficulty, btn));
  });

  // Reset filters
  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  document.getElementById('reset-from-empty').addEventListener('click', resetFilters);

  // Pagination
  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProblems();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderProblems();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Back button
  document.getElementById('back-btn').addEventListener('click', () => {
    window.close();
  });

  // Topics show more/less
  document.getElementById('topics-show-more').addEventListener('click', () => {
    topicsExpanded = !topicsExpanded;
    renderTopics(allTopics);
  });

  // Companies show more/less
  document.getElementById('companies-show-more').addEventListener('click', () => {
    companiesExpanded = !companiesExpanded;
    updateCompanyDisplay();
  });

  // Company search
  document.getElementById('company-search').addEventListener('input', () => {
    companiesExpanded = false; // Reset expansion when searching
    updateCompanyDisplay();
  });
});
