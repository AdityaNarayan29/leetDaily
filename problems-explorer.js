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
let selectedList = null; // 'blind75', 'neetcode150', 'leetcode75', or null
let listProblemIds = []; // Problem IDs from the selected list
let listMembership = {};    // { problemId: Set<'B75','NC','LC'> }
let completedProblemIds = new Set();

// Filters state
const filters = {
  search: '',
  difficulty: new Set(),
  topics: new Set(),
  companies: new Set(),
  sortColumn: 'frequency',
  sortDirection: 'desc',
  list: null, // Selected list filter
  listBadges: new Set() // B75, NC, LC badge filters from navbar
};

// Check URL parameters for list filter
function getListFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const list = urlParams.get('list');
  if (list && ['blind75', 'neetcode150', 'leetcode75'].includes(list)) {
    return list;
  }
  return null;
}

// Pre-populate topic/company filters from URL params (?topics=Hash Table&companies=Airbnb)
function applyFiltersFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const topicsParam = urlParams.get('topics');
  const companiesParam = urlParams.get('companies');
  if (topicsParam) {
    topicsParam.split(',').map(t => t.trim()).filter(Boolean).forEach(t => filters.topics.add(t));
  }
  if (companiesParam) {
    companiesParam.split(',').map(c => c.trim()).filter(Boolean).forEach(c => filters.companies.add(c));
  }
}

// Load list data (Blind 75, NeetCode 150, or LeetCode 75)
async function loadListData(listName) {
  try {
    let url;
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      url = chrome.runtime.getURL(`data/${listName}.json`);
    } else {
      url = `data/${listName}.json`;
    }

    console.log(`Loading list data from: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Loaded ${listName} data:`, data);

    // Extract all problem IDs from all categories (deduplicate)
    const problemIds = [];
    if (data.categories && Array.isArray(data.categories)) {
      data.categories.forEach(category => {
        if (category.problemIds && Array.isArray(category.problemIds)) {
          problemIds.push(...category.problemIds);
        }
      });
    }

    // Remove duplicates (some problems appear in multiple categories)
    const uniqueProblemIds = [...new Set(problemIds)];

    return {
      name: data.name,
      description: data.description,
      problemIds: uniqueProblemIds
    };
  } catch (error) {
    console.error(`Failed to load ${listName} data:`, error);
    return null;
  }
}

// Load list membership for all 3 curated lists
async function loadListMembership() {
  const lists = [
    { name: 'blind75', badge: 'B75' },
    { name: 'neetcode150', badge: 'NC' },
    { name: 'leetcode75', badge: 'LC' }
  ];
  for (const { name, badge } of lists) {
    const data = await loadListData(name);
    if (data) {
      for (const id of data.problemIds) {
        if (!listMembership[id]) listMembership[id] = new Set();
        listMembership[id].add(badge);
      }
    }
  }
}

// Load completed problem IDs from storage
async function loadCompletedIds() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise(resolve => {
      chrome.storage.local.get(['completedProblemIds'], result => {
        completedProblemIds = new Set((result.completedProblemIds || []).map(Number));
        resolve();
      });
    });
  }
}

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

    // Check if a list filter is specified in URL
    selectedList = getListFromURL();
    if (selectedList) {
      console.log(`📋 List filter detected: ${selectedList}`);
      const listData = await loadListData(selectedList);
      if (listData) {
        listProblemIds = listData.problemIds;
        filters.list = selectedList;
        console.log(`✅ Loaded ${listData.name}: ${listProblemIds.length} problems`);

        // Update header to show list name and add badge
        const headerTitle = document.querySelector('h1');
        if (headerTitle) {
          headerTitle.innerHTML = `
            ${listData.name}
            <span style="display: inline-block; margin-left: 8px; padding: 2px 8px; font-size: 11px; font-weight: 500; background: rgba(255, 161, 22, 0.15); color: #ffa116; border-radius: 4px; vertical-align: middle;">
              CURATED LIST
            </span>
          `;
        }

        // Update subtitle to show description
        const headerSubtitle = document.querySelector('.header-subtitle');
        if (headerSubtitle && listData.description) {
          const descriptionDiv = document.createElement('div');
          descriptionDiv.style.cssText = 'font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 6px; margin-bottom: 4px; max-width: 600px; line-height: 1.5;';
          descriptionDiv.textContent = listData.description;
          headerSubtitle.parentNode.insertBefore(descriptionDiv, headerSubtitle);
        }

        // Update total problems count to show list size
        document.getElementById('total-problems').textContent = listProblemIds.length;
      }
    } else {
      document.getElementById('total-problems').textContent = allProblems.length;
    }

    // Update debug status
    if (document.getElementById('js-status')) {
      const listInfo = selectedList ? `<br>📋 Filtering: ${selectedList}` : '';
      document.getElementById('js-status').innerHTML = `✅ JavaScript loaded!<br>✅ Loaded ${allProblems.length} problems${listInfo}<br>🔄 Rendering...`;
    }

    // Load list membership and solved status
    await loadListMembership();
    await loadCompletedIds();

    // Apply topic/company filters from URL params before rendering chips
    applyFiltersFromURL();

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
const TOPICS_INITIAL_LIMIT = 20;

function renderTopics(topics) {
  allTopics = topics;
  updateTopicDisplay();
}

function updateTopicDisplay() {
  const container = document.getElementById('topics-container');
  const showMoreBtn = document.getElementById('topics-show-more');
  const searchTerm = document.getElementById('topic-search')?.value.toLowerCase() || '';
  const clearAllBtn = document.getElementById('topics-clear-all');

  // Filter by search term
  let filtered = searchTerm
    ? allTopics.filter(t => t.toLowerCase().includes(searchTerm))
    : allTopics;

  // Separate selected and unselected topics
  const selected = filtered.filter(topic => filters.topics.has(topic));
  const unselected = filtered.filter(topic => !filters.topics.has(topic));

  // Combine: selected first, then unselected
  const sortedTopics = [...selected, ...unselected];

  // Limit display if not expanded
  const displayTopics = (topicsExpanded || searchTerm) ? sortedTopics : sortedTopics.slice(0, TOPICS_INITIAL_LIMIT);

  // Render chips with selected styling (orange like LeetCode)
  container.innerHTML = displayTopics.map(topic => {
    const isSelected = filters.topics.has(topic);
    const chipClass = isSelected ? 'chip topic-filter active' : 'chip topic-filter';
    const style = isSelected ? 'background: rgba(255, 161, 22, 0.15); border-color: rgba(255, 161, 22, 0.5); color: #ffa116;' : '';
    return `
      <button class="${chipClass}" data-topic="${topic}" style="${style}">
        ${topic}${isSelected ? ' ×' : ''}
      </button>
    `;
  }).join('');

  // Show/hide "Show more" button
  if (!searchTerm && sortedTopics.length > TOPICS_INITIAL_LIMIT) {
    showMoreBtn.classList.remove('hidden');
    showMoreBtn.textContent = topicsExpanded ? 'Show less' : `Show ${sortedTopics.length - TOPICS_INITIAL_LIMIT} more`;
  } else {
    showMoreBtn.classList.add('hidden');
  }

  // Show/hide "Clear all" button
  if (selected.length > 0) {
    clearAllBtn.classList.remove('hidden');
  } else {
    clearAllBtn.classList.add('hidden');
  }

  // Add click listeners
  document.querySelectorAll('.topic-filter').forEach(btn => {
    btn.addEventListener('click', () => toggleTopicFilter(btn.dataset.topic));
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
  const clearAllBtn = document.getElementById('companies-clear-all');

  // Filter by search term
  let filtered = searchTerm
    ? allCompanies.filter(c => c.toLowerCase().includes(searchTerm))
    : allCompanies;

  // Separate selected and unselected companies
  const selected = filtered.filter(company => filters.companies.has(company));
  const unselected = filtered.filter(company => !filters.companies.has(company));

  // Combine: selected first, then unselected
  const sortedCompanies = [...selected, ...unselected];

  // Limit display if not expanded
  filteredCompanies = sortedCompanies;
  const displayCompanies = (companiesExpanded || searchTerm) ? sortedCompanies : sortedCompanies.slice(0, COMPANIES_INITIAL_LIMIT);

  // Render chips with selected styling (orange like LeetCode)
  container.innerHTML = displayCompanies.map(company => {
    const isSelected = filters.companies.has(company);
    const chipClass = isSelected ? 'chip company-filter active' : 'chip company-filter';
    const style = isSelected ? 'background: rgba(255, 161, 22, 0.15); border-color: rgba(255, 161, 22, 0.5); color: #ffa116;' : '';
    return `
      <button class="${chipClass}" data-company="${company}" style="${style}">
        ${company}${isSelected ? ' ×' : ''}
      </button>
    `;
  }).join('');

  // Show/hide "Show more" button
  if (!searchTerm && sortedCompanies.length > COMPANIES_INITIAL_LIMIT) {
    showMoreBtn.classList.remove('hidden');
    showMoreBtn.textContent = companiesExpanded ? 'Show less' : `Show ${sortedCompanies.length - COMPANIES_INITIAL_LIMIT} more`;
  } else {
    showMoreBtn.classList.add('hidden');
  }

  // Show/hide "Clear all" button
  if (selected.length > 0) {
    clearAllBtn.classList.remove('hidden');
  } else {
    clearAllBtn.classList.add('hidden');
  }

  // Add click listeners
  document.querySelectorAll('.company-filter').forEach(btn => {
    btn.addEventListener('click', () => toggleCompanyFilter(btn.dataset.company));
  });
}

// Toggle difficulty filter
function toggleDifficultyFilter(difficulty, checkbox) {
  if (checkbox.checked) {
    filters.difficulty.add(difficulty);
  } else {
    filters.difficulty.delete(difficulty);
  }

  // Update filter toggle button appearance
  const toggleBtn = document.getElementById('difficulty-filter-toggle');
  if (toggleBtn) {
    if (filters.difficulty.size > 0) {
      toggleBtn.classList.add('active');
    } else {
      toggleBtn.classList.remove('active');
    }
  }

  updateFilterCounts();
  renderSelectedChips();
  applyFiltersAndRender();
}

// Toggle topic filter
function toggleTopicFilter(topic) {
  if (filters.topics.has(topic)) {
    filters.topics.delete(topic);
  } else {
    filters.topics.add(topic);
  }

  updateTopicDisplay(); // Re-render with selected topics at top
  updateFilterCounts();
  applyFiltersAndRender();
}

// Toggle company filter
function toggleCompanyFilter(company) {
  if (filters.companies.has(company)) {
    filters.companies.delete(company);
  } else {
    filters.companies.add(company);
  }

  updateCompanyDisplay(); // Re-render with selected companies at top
  updateFilterCounts();
  applyFiltersAndRender();
}

// Update filter counts
function updateFilterCounts() {
  const topicsCount = document.getElementById('topics-count');
  const companiesCount = document.getElementById('companies-count');

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

// Render selected filter chips in their respective sections
function renderSelectedChips() {
  // Difficulty section - now handled in column header dropdown, no separate UI needed

  // Topics section - Now handled inline with search, so hide this
  const topicsContainer = document.getElementById('selected-topics');
  if (topicsContainer) {
    topicsContainer.classList.add('hidden');
    topicsContainer.innerHTML = '';
  }

  // Companies section - Now handled inline with search, so hide this
  const companiesContainer = document.getElementById('selected-companies');
  if (companiesContainer) {
    companiesContainer.classList.add('hidden');
    companiesContainer.innerHTML = '';
  }

  // Add click handlers for remove buttons
  document.querySelectorAll('.selected-chip-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;

      if (type === 'difficulty') {
        filters.difficulty.delete(value);
        document.querySelector(`.difficulty-filter[data-difficulty="${value}"]`)?.classList.remove('active');
      } else if (type === 'topic') {
        filters.topics.delete(value);
        document.querySelector(`.topic-filter[data-topic="${value}"]`)?.classList.remove('active');
      } else if (type === 'company') {
        filters.companies.delete(value);
        document.querySelector(`.company-filter[data-company="${value}"]`)?.classList.remove('active');
      }

      updateFilterCounts();
      renderSelectedChips();
      applyFiltersAndRender();
    });
  });

  // Add click handlers for clear category buttons
  document.querySelectorAll('.clear-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      clearCategory(category);
    });
  });
}

// Clear a specific filter category
function clearCategory(category) {
  if (category === 'difficulty') {
    filters.difficulty.clear();
    document.querySelectorAll('.difficulty-filter').forEach(chip => chip.classList.remove('active'));
  } else if (category === 'topics') {
    filters.topics.clear();
    document.querySelectorAll('.topic-filter').forEach(chip => chip.classList.remove('active'));
  } else if (category === 'companies') {
    filters.companies.clear();
    document.querySelectorAll('.company-filter').forEach(chip => chip.classList.remove('active'));
  }

  updateFilterCounts();
  renderSelectedChips();
  applyFiltersAndRender();
}

// Apply all filters
function applyFilters() {
  filteredProblems = allProblems.filter(problem => {
    // List filter (Blind 75, NeetCode 150, LeetCode 75)
    if (filters.list && listProblemIds.length > 0) {
      if (!listProblemIds.includes(problem.id)) {
        return false;
      }
    }

    // List badge filter (B75, NC, LC from navbar)
    if (filters.listBadges.size > 0) {
      const membership = listMembership[problem.id];
      if (!membership) return false;
      const hasMatch = Array.from(filters.listBadges).some(b => membership.has(b));
      if (!hasMatch) return false;
    }

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

  // Update filtered count display
  const filteredCountEl = document.getElementById('filtered-count');
  const countSeparatorEl = document.getElementById('count-separator');
  const totalProblemsEl = document.getElementById('total-problems');

  const totalCount = parseInt(totalProblemsEl.textContent);
  const filteredCount = filteredProblems.length;

  filteredCountEl.textContent = filteredCount;

  // Hide filtered count and separator when showing all problems (no additional filters)
  if (filteredCount === totalCount) {
    filteredCountEl.style.display = 'none';
    countSeparatorEl.style.display = 'none';
  } else {
    filteredCountEl.style.display = 'inline';
    countSeparatorEl.style.display = 'inline';
  }
}

// Sort problems based on selected column and direction
function sortProblems() {
  const { sortColumn, sortDirection } = filters;
  const isAsc = sortDirection === 'asc';

  filteredProblems.sort((a, b) => {
    let comparison = 0;

    switch (sortColumn) {
      case 'id':
        comparison = a.id - b.id;
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'difficulty':
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        comparison = (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
        break;
      case 'acceptance':
        comparison = (a.acRate || 0) - (b.acRate || 0);
        break;
      case 'frequency':
        comparison = (a.frequency || 0) - (b.frequency || 0);
        break;
      default:
        return 0;
    }

    return isAsc ? comparison : -comparison;
  });
}

// Expand topics inline
function expandTopics(moreBtn) {
  const allTopics = JSON.parse(moreBtn.dataset.topics.replace(/&quot;/g, '"'));
  const container = moreBtn.closest('.topic-tags');

  // Replace content with all topics
  container.innerHTML = allTopics.map(topic =>
    `<span class="topic-tag">${topic}</span>`
  ).join('');
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

  tableBody.innerHTML = pageProblems.map((problem, index) => {
    const difficultyClass = `difficulty-${problem.difficulty.toLowerCase()}`;
    const topics = problem.topics?.slice(0, 2).map(t => t.name) || [];
    const moreTopics = problem.topics?.length > 2 ? problem.topics.length - 2 : 0;
    const allTopicsJson = JSON.stringify((problem.topics || []).map(t => t.name)).replace(/"/g, '&quot;');
    const isSolved = completedProblemIds.has(problem.id);
    const badges = listMembership[problem.id];
    const badgeHtml = badges ? `<span class="list-badges">${badges.has('B75') ? '<span class="list-badge list-badge-b75">B75</span>' : ''}${badges.has('NC') ? '<span class="list-badge list-badge-nc">NC</span>' : ''}${badges.has('LC') ? '<span class="list-badge list-badge-lc">LC</span>' : ''}</span>` : '';

    return `
      <tr data-url="${problem.url}" style="cursor: pointer;"${isSolved ? ' class="solved"' : ''}>
        <td class="col-id">${problem.id}${isSolved ? ' <span class="solved-check">✓</span>' : ''}</td>
        <td class="col-title">
          <a href="${problem.url}" target="_blank" class="problem-link">${problem.title}</a>${badgeHtml}
        </td>
        <td class="col-difficulty">
          <span class="difficulty ${difficultyClass}">${problem.difficulty}</span>
        </td>
        <td class="col-acceptance">${problem.acRate?.toFixed(1)}%</td>
        <td class="col-frequency">
          <div class="frequency-bar">
            <div class="frequency-fill" style="width: ${Math.min(problem.frequency || 0, 10) * 10}%"></div>
          </div>
        </td>
        <td class="col-topics">
          <div class="topic-tags">
            ${topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
            ${moreTopics > 0 ? `<span class="topic-more" data-topics="${allTopicsJson}">+${moreTopics}</span>` : ''}
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

  // Add click listeners for "+N" topics
  document.querySelectorAll('.topic-more').forEach(moreBtn => {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent row click
      expandTopics(moreBtn);
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

  // Show total count if filtered
  const totalAllProblems = document.getElementById('total-all-problems');
  const fromTotalSeparator = document.getElementById('from-total-separator');

  // Use list total if viewing a curated list, otherwise use all problems
  const actualTotal = filters.list && listProblemIds.length > 0
    ? listProblemIds.length
    : allProblems.length;

  if (filteredProblems.length < actualTotal) {
    totalAllProblems.textContent = actualTotal;
    totalAllProblems.classList.remove('hidden');
    fromTotalSeparator.classList.remove('hidden');
  } else {
    totalAllProblems.classList.add('hidden');
    fromTotalSeparator.classList.add('hidden');
  }

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
      return '<span class="page-ellipsis">...</span>';
    }
    return `
      <button class="page-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">
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
  filters.listBadges.clear();
  filters.sortColumn = 'frequency';
  filters.sortDirection = 'desc';

  // Reset UI
  document.getElementById('search-input').value = '';
  document.getElementById('company-search').value = '';

  // Reset difficulty checkboxes
  document.querySelectorAll('.difficulty-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });
  document.getElementById('difficulty-filter-toggle').classList.remove('active');

  // Reset column headers
  document.querySelectorAll('.sortable').forEach(th => {
    th.classList.remove('active');
    th.removeAttribute('data-sort-direction');
  });

  // Set default sort (frequency desc)
  const frequencyHeader = document.querySelector('.sortable[data-sort="frequency"]');
  if (frequencyHeader) {
    frequencyHeader.classList.add('active');
    frequencyHeader.setAttribute('data-sort-direction', 'desc');
  }

  document.querySelectorAll('.chip').forEach(chip => {
    chip.classList.remove('active');
  });
  document.querySelectorAll('.legend-filter').forEach(item => {
    item.classList.remove('active');
  });

  updateFilterCounts();
  renderSelectedChips();
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

  // Initialize default sort column (frequency desc)
  setTimeout(() => {
    const frequencyHeader = document.querySelector('.sortable[data-sort="frequency"]');
    if (frequencyHeader) {
      frequencyHeader.classList.add('active');
      frequencyHeader.setAttribute('data-sort-direction', 'desc');
    }
  }, 100);

  // Search
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  let searchTimeout;

  searchInput.addEventListener('input', (e) => {
    const value = e.target.value;

    // Show/hide clear button
    if (value) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filters.search = value;
      applyFiltersAndRender();
    }, 300);
  });

  // Clear search
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filters.search = '';
    clearSearchBtn.classList.add('hidden');
    applyFiltersAndRender();
  });

  // Sortable column headers
  document.querySelectorAll('.sortable .header-content').forEach(headerContent => {
    headerContent.addEventListener('click', () => {
      const th = headerContent.closest('.sortable');
      const column = th.dataset.sort;
      const currentDirection = th.getAttribute('data-sort-direction');

      // If clicking the same column, toggle direction
      if (filters.sortColumn === column) {
        filters.sortDirection = currentDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // New column, default to desc (except for id and title which default to asc)
        filters.sortColumn = column;
        filters.sortDirection = (column === 'id' || column === 'title') ? 'asc' : 'desc';
      }

      // Update UI
      document.querySelectorAll('.sortable').forEach(header => {
        header.classList.remove('active');
        header.removeAttribute('data-sort-direction');
      });
      th.classList.add('active');
      th.setAttribute('data-sort-direction', filters.sortDirection);

      applyFiltersAndRender();
    });
  });

  // Difficulty filter dropdown
  const difficultyToggle = document.getElementById('difficulty-filter-toggle');
  const difficultyDropdown = document.getElementById('difficulty-dropdown');

  if (difficultyToggle && difficultyDropdown) {
    difficultyToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      difficultyDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const isClickInside = difficultyDropdown.contains(e.target) ||
                           difficultyToggle.contains(e.target) ||
                           e.target === difficultyToggle;

      if (!isClickInside) {
        difficultyDropdown.classList.add('hidden');
      }
    });
  }

  // Difficulty checkboxes
  document.querySelectorAll('.difficulty-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      toggleDifficultyFilter(checkbox.value, checkbox);
    });
  });

  // Reset filters (from empty state)
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
  // Topics show more/less
  document.getElementById('topics-show-more').addEventListener('click', () => {
    topicsExpanded = !topicsExpanded;
    updateTopicDisplay();
  });

  // Topic search
  document.getElementById('topic-search').addEventListener('input', () => {
    topicsExpanded = false; // Reset expansion when searching
    updateTopicDisplay();
  });

  // Topics clear all
  document.getElementById('topics-clear-all').addEventListener('click', () => {
    filters.topics.clear();
    updateTopicDisplay();
    updateFilterCounts();
    applyFiltersAndRender();
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

  // Companies clear all
  document.getElementById('companies-clear-all').addEventListener('click', () => {
    filters.companies.clear();
    updateCompanyDisplay();
    updateFilterCounts();
    applyFiltersAndRender();
  });

  // List badge filters in navbar
  document.querySelectorAll('.legend-filter').forEach(item => {
    item.addEventListener('click', () => {
      const list = item.dataset.list;
      if (filters.listBadges.has(list)) {
        filters.listBadges.delete(list);
        item.classList.remove('active');
      } else {
        filters.listBadges.add(list);
        item.classList.add('active');
      }
      applyFiltersAndRender();
    });
  });

});
