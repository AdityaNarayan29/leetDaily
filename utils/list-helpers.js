/**
 * Helper utilities for working with problem list data
 * (Blind 75, NeetCode 150, LeetCode 75)
 *
 * Data architecture:
 * - leetcode-problems.json = single source of truth with all problem details
 * - list files (blind75.json, etc.) = only contain problemIds organized by category
 * - This helper merges them together on demand
 */

// Cache for loaded data files
const dataCache = {};

/**
 * Load the master LeetCode problems list (single source of truth)
 * @returns {Promise<Object>} The problems data with lookup map
 */
async function loadMasterProblems() {
  if (dataCache['master']) {
    return dataCache['master'];
  }

  try {
    const response = await fetch(chrome.runtime.getURL('data/leetcode-problems.json'));
    const data = await response.json();

    // Create a lookup map by problem ID for fast access
    const problemMap = {};
    for (const problem of data.problems) {
      problemMap[problem.id] = problem;
    }

    const masterData = {
      ...data,
      problemMap
    };

    dataCache['master'] = masterData;
    return masterData;
  } catch (error) {
    console.error('Error loading master problems data:', error);
    return null;
  }
}

/**
 * Load a problem list from JSON file (contains only IDs and categories)
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @returns {Promise<Object>} The list data with problemIds
 */
async function loadListData(listName) {
  // Return from cache if already loaded
  if (dataCache[listName]) {
    return dataCache[listName];
  }

  try {
    const response = await fetch(chrome.runtime.getURL(`data/${listName}.json`));
    const data = await response.json();
    dataCache[listName] = data;
    return data;
  } catch (error) {
    console.error(`Error loading ${listName} data:`, error);
    return null;
  }
}

/**
 * Get full problem details by ID from master list
 * @param {number} problemId - LeetCode problem ID
 * @returns {Promise<Object|null>} Full problem details or null
 */
async function getProblemDetails(problemId) {
  const master = await loadMasterProblems();
  if (!master || !master.problemMap) return null;
  return master.problemMap[problemId] || null;
}

/**
 * Get all problems from a specific list with full details
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @returns {Promise<Array>} Array of all problems with full details
 */
async function getAllProblems(listName) {
  const listData = await loadListData(listName);
  const master = await loadMasterProblems();

  if (!listData || !master || !listData.categories) return [];

  const allProblems = [];
  for (const category of listData.categories) {
    if (!category.problemIds) continue;

    for (const problemId of category.problemIds) {
      const problemDetails = master.problemMap[problemId];
      if (problemDetails) {
        // Include category information with the problem
        allProblems.push({
          ...problemDetails,
          category: category.name
        });
      }
    }
  }

  return allProblems;
}

/**
 * Get a specific problem by ID from a list
 * @param {number} problemId - LeetCode problem ID
 * @param {string} listName - Which list to search in
 * @returns {Promise<Object|null>} The problem object or null if not found
 */
async function getProblemById(problemId, listName) {
  const problems = await getAllProblems(listName);
  return problems.find(p => p.id === problemId) || null;
}

/**
 * Get all categories for a list with full problem details
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @returns {Promise<Array>} Array of category objects with full problems
 */
async function getCategoriesForList(listName) {
  const listData = await loadListData(listName);
  const master = await loadMasterProblems();

  if (!listData || !master || !listData.categories) return [];

  return listData.categories.map(category => {
    const problems = (category.problemIds || [])
      .map(id => master.problemMap[id])
      .filter(p => p !== undefined);

    return {
      name: category.name,
      problems
    };
  });
}

/**
 * Get problems in a specific category with full details
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @param {string} categoryName - Name of the category
 * @returns {Promise<Array>} Array of problems in that category with full details
 */
async function getProblemsInCategory(listName, categoryName) {
  const categories = await getCategoriesForList(listName);
  const category = categories.find(c => c.name === categoryName);
  return category?.problems || [];
}

/**
 * Check if a problem is in a specific list
 * @param {number} problemId - LeetCode problem ID
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @returns {Promise<boolean>} True if problem is in the list
 */
async function isProblemInList(problemId, listName) {
  const listData = await loadListData(listName);
  if (!listData || !listData.categories) return false;

  for (const category of listData.categories) {
    if (category.problemIds && category.problemIds.includes(problemId)) {
      return true;
    }
  }

  return false;
}

/**
 * Check which lists a problem belongs to
 * @param {number} problemId - LeetCode problem ID
 * @returns {Promise<Array>} Array of list names the problem belongs to
 */
async function getListsForProblem(problemId) {
  const lists = ['blind75', 'neetcode150', 'leetcode75'];
  const belongsTo = [];

  for (const listName of lists) {
    if (await isProblemInList(problemId, listName)) {
      belongsTo.push(listName);
    }
  }

  return belongsTo;
}

/**
 * Get problem statistics for a list
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @param {Array} completedIds - Array of completed problem IDs
 * @returns {Promise<Object>} Statistics object with counts
 */
async function getListStats(listName, completedIds = []) {
  const problems = await getAllProblems(listName);
  const completedSet = new Set(completedIds.map(String));

  const total = problems.length;
  const completed = problems.filter(p => completedSet.has(String(p.id))).length;
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byDifficulty = {
    Easy: 0,
    Medium: 0,
    Hard: 0
  };

  const completedByDifficulty = {
    Easy: 0,
    Medium: 0,
    Hard: 0
  };

  for (const problem of problems) {
    const diff = problem.difficulty;
    if (byDifficulty[diff] !== undefined) {
      byDifficulty[diff]++;
    }

    if (completedSet.has(String(problem.id))) {
      if (completedByDifficulty[diff] !== undefined) {
        completedByDifficulty[diff]++;
      }
    }
  }

  return {
    total,
    completed,
    remaining,
    percentage,
    byDifficulty,
    completedByDifficulty
  };
}

/**
 * Get category statistics for a list
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @param {Array} completedIds - Array of completed problem IDs
 * @returns {Promise<Array>} Array of category stats
 */
async function getCategoryStats(listName, completedIds = []) {
  const categories = await getCategoriesForList(listName);
  const completedSet = new Set(completedIds.map(String));

  return categories.map(category => {
    const total = category.problems.length;
    const completed = category.problems.filter(p => completedSet.has(String(p.id))).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      name: category.name,
      total,
      completed,
      remaining: total - completed,
      percentage
    };
  });
}

/**
 * Get next unsolved problem in a list
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @param {Array} completedIds - Array of completed problem IDs
 * @returns {Promise<Object|null>} Next unsolved problem or null
 */
async function getNextUnsolvedProblem(listName, completedIds = []) {
  const problems = await getAllProblems(listName);
  const completedSet = new Set(completedIds.map(String));
  return problems.find(p => !completedSet.has(String(p.id))) || null;
}

/**
 * Filter problems by topic
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @param {Array} topics - Array of topic slugs to filter by
 * @returns {Promise<Array>} Array of problems matching any of the topics
 */
async function filterByTopics(listName, topics) {
  const problems = await getAllProblems(listName);
  return problems.filter(p =>
    p.topics && p.topics.some(topic =>
      topics.includes(topic.slug) || topics.includes(topic.name)
    )
  );
}

/**
 * Filter problems by company
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @param {Array} companies - Array of company names to filter by
 * @returns {Promise<Array>} Array of problems from those companies
 */
async function filterByCompanies(listName, companies) {
  const problems = await getAllProblems(listName);
  return problems.filter(p =>
    p.companies && p.companies.some(company => companies.includes(company))
  );
}

/**
 * Filter problems by difficulty
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @param {Array} difficulties - Array of difficulties: ['Easy', 'Medium', 'Hard']
 * @returns {Promise<Array>} Array of problems matching the difficulties
 */
async function filterByDifficulty(listName, difficulties) {
  const problems = await getAllProblems(listName);
  return problems.filter(p => difficulties.includes(p.difficulty));
}

/**
 * Search problems by title
 * @param {string} listName - 'blind75', 'neetcode150', or 'leetcode75'
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of problems matching the query
 */
async function searchProblems(listName, query) {
  const problems = await getAllProblems(listName);
  const lowerQuery = query.toLowerCase();

  return problems.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.titleSlug.includes(lowerQuery) ||
    p.id.toString().includes(query)
  );
}

// Export all functions
export {
  loadMasterProblems,
  loadListData,
  getProblemDetails,
  getAllProblems,
  getProblemById,
  getCategoriesForList,
  getProblemsInCategory,
  isProblemInList,
  getListsForProblem,
  getListStats,
  getCategoryStats,
  getNextUnsolvedProblem,
  filterByTopics,
  filterByCompanies,
  filterByDifficulty,
  searchProblems
};
