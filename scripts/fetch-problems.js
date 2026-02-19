#!/usr/bin/env node

/**
 * Fetch latest LeetCode problems data
 *
 * Usage:
 *   node scripts/fetch-problems.js
 *   node scripts/fetch-problems.js --with-companies   (includes company data, slower)
 *
 * Fetches all problems from LeetCode's GraphQL API and writes to data/leetcode-problems.json
 * Company data requires a LeetCode session cookie — set LEETCODE_SESSION env var.
 */

const fs = require('fs');
const path = require('path');

const GRAPHQL_URL = 'https://leetcode.com/graphql';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'leetcode-problems.json');
const BATCH_SIZE = 100;
const DELAY_MS = 300; // delay between requests to avoid rate limiting

const WITH_COMPANIES = process.argv.includes('--with-companies');
const LEETCODE_SESSION = process.env.LEETCODE_SESSION || '';

// Top companies to track (same list as existing data)
const TOP_COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Bloomberg', 'Apple', 'Oracle', 'Adobe',
  'Goldman Sachs', 'Uber', 'TikTok', 'LinkedIn', 'Salesforce', 'Walmart Labs',
  'Nvidia', 'Snowflake', 'DE Shaw', 'Infosys', 'tcs', 'Zoho', 'PayPal',
  'J.P. Morgan', 'Morgan Stanley', 'Yandex', 'Cisco', 'Airbnb', 'Wix',
  'ServiceNow', 'Nutanix', 'X', 'Roblox', 'Coupang', 'EPAM Systems',
  'Pinterest', 'Anduril', 'Meesho', 'Turing', 'Palo Alto Networks',
  'Media.net', 'Databricks', 'SAP', 'Yelp', 'Palantir Technologies',
  'Samsung', 'IBM', 'Intel', 'Flipkart', 'VMware', 'eBay', 'Intuit',
  'DoorDash', 'Spotify', 'Visa', 'American Express', 'Yahoo', 'Qualcomm',
  'Deutsche Bank', 'Dell', 'Tesla', 'Atlassian', 'Swiggy', 'Grab',
  'Epic Systems', 'Wipro', 'Capgemini', 'Cognizant', 'HCL', 'Accenture',
  'PhonePe', 'jio', 'Deloitte', 'Comcast', 'NetApp', 'Hubspot',
  'Karat', 'Siemens', 'Splunk', 'Toast', 'Dropbox', 'SoFi', 'KLA'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function graphqlRequest(query, variables = {}, needsAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com',
    'Origin': 'https://leetcode.com',
  };

  if (needsAuth && LEETCODE_SESSION) {
    headers['Cookie'] = `LEETCODE_SESSION=${LEETCODE_SESSION}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

// Fetch all problems in batches
async function fetchAllProblems() {
  console.log('Fetching problem count...');

  const countData = await graphqlRequest(`
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
        totalNum
      }
    }
  `, { categorySlug: '', limit: 1, skip: 0, filters: {} });

  const total = countData.problemsetQuestionList.totalNum;
  console.log(`Total problems on LeetCode: ${total}`);

  const allProblems = [];
  const batches = Math.ceil(total / BATCH_SIZE);

  for (let i = 0; i < batches; i++) {
    const skip = i * BATCH_SIZE;
    console.log(`Fetching batch ${i + 1}/${batches} (problems ${skip + 1}-${Math.min(skip + BATCH_SIZE, total)})...`);

    const data = await graphqlRequest(`
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
          totalNum
          data {
            questionFrontendId
            title
            titleSlug
            difficulty
            isPaidOnly
            acRate
            freqBar
            topicTags {
              name
              slug
            }
            hasSolution
            hasVideoSolution
            likes
            dislikes
            hints
            stats
          }
        }
      }
    `, { categorySlug: '', limit: BATCH_SIZE, skip, filters: {} });

    const questions = data.problemsetQuestionList.data;
    allProblems.push(...questions);

    if (i < batches - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`Fetched ${allProblems.length} problems.`);
  return allProblems;
}

// Fetch company tags for a single problem (requires Premium auth)
// Uses companyTagStatsV2 which returns JSON grouped by time period
async function fetchCompanyTags(titleSlug) {
  try {
    const data = await graphqlRequest(`
      query questionCompanyTags($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          companyTagStatsV2
        }
      }
    `, { titleSlug }, true);

    const raw = data.question?.companyTagStatsV2;
    if (!raw) return [];

    // companyTagStatsV2 is a JSON string: { "1": [...], "2": [...], "3": [...] }
    // Keys: "1" = 0-6 months, "2" = 6-12 months, "3" = 1-2 years
    const parsed = JSON.parse(raw);
    const companyMap = {};

    for (const [period, companies] of Object.entries(parsed)) {
      for (const c of companies) {
        if (!companyMap[c.name]) {
          companyMap[c.name] = { name: c.name, slug: c.slug, count: 0 };
        }
        companyMap[c.name].count += (c.timesEncountered || 0);
      }
    }

    return Object.values(companyMap);
  } catch (err) {
    // Log first error for debugging, then stay silent
    if (!fetchCompanyTags._logged) {
      console.warn(`  ⚠ Company fetch failed: ${err.message}`);
      fetchCompanyTags._logged = true;
    }
    return [];
  }
}

// Load existing data to preserve company info for unchanged problems
function loadExistingData() {
  try {
    const raw = fs.readFileSync(OUTPUT_PATH, 'utf-8');
    const data = JSON.parse(raw);
    const map = {};
    for (const p of data.problems) {
      map[p.id] = p;
    }
    return map;
  } catch {
    return {};
  }
}

async function main() {
  console.log('=== LeetCode Problems Fetcher ===\n');

  if (WITH_COMPANIES && !LEETCODE_SESSION) {
    console.warn('⚠  --with-companies requires LEETCODE_SESSION env var for company data.');
    console.warn('   Set it with: LEETCODE_SESSION=your_session_cookie node scripts/fetch-problems.js --with-companies\n');
    console.warn('   Continuing without company data...\n');
  }

  const existingData = loadExistingData();
  const existingCount = Object.keys(existingData).length;
  console.log(`Existing data: ${existingCount} problems\n`);

  // Fetch all problems
  const rawProblems = await fetchAllProblems();

  // Transform to our format
  const problems = [];
  let newCount = 0;

  for (const q of rawProblems) {
    const id = parseInt(q.questionFrontendId);
    if (isNaN(id)) continue;

    const stats = q.stats ? JSON.parse(q.stats) : {};
    const existing = existingData[id];

    const problem = {
      id,
      title: q.title,
      titleSlug: q.titleSlug,
      difficulty: q.difficulty,
      isPaidOnly: q.isPaidOnly,
      acRate: parseFloat((q.acRate || 0).toFixed(2)),
      frequency: q.freqBar || existing?.frequency || 0,
      url: `https://leetcode.com/problems/${q.titleSlug}/`,
      topics: (q.topicTags || []).map(t => ({ name: t.name, slug: t.slug })),
      hasSolution: q.hasSolution || false,
      hasVideoSolution: q.hasVideoSolution || false,
      companies: existing?.companies || [],
      companyFrequency: existing?.companyFrequency || {},
      likes: q.likes || 0,
      dislikes: q.dislikes || 0,
      hints: q.hints || [],
      totalAccepted: stats.totalAcceptedRaw || (existing?.totalAccepted || 0),
      totalSubmissions: stats.totalSubmissionRaw || (existing?.totalSubmissions || 0),
    };

    if (q.similarQuestions) {
      try {
        problem.similarQuestions = JSON.parse(q.similarQuestions);
      } catch {
        problem.similarQuestions = existing?.similarQuestions || [];
      }
    } else if (existing?.similarQuestions) {
      problem.similarQuestions = existing.similarQuestions;
    }

    if (!existing) newCount++;
    problems.push(problem);
  }

  // Fetch company data if session is available
  // Goes newest→oldest so recent problems get updated first
  // Saves incrementally so progress is preserved if cancelled
  if (WITH_COMPANIES && LEETCODE_SESSION) {
    const problemsNeedingCompanies = problems
      .filter(p => p.companies.length === 0)
      .sort((a, b) => b.id - a.id); // newest first

    console.log(`\nFetching company tags for ${problemsNeedingCompanies.length} problems (newest first)...`);

    let fetched = 0;
    for (const p of problemsNeedingCompanies) {
      fetched++;
      if (fetched % 25 === 1 || fetched === problemsNeedingCompanies.length) {
        console.log(`  Company data: ${fetched}/${problemsNeedingCompanies.length} (problem #${p.id})...`);
      }

      const tags = await fetchCompanyTags(p.titleSlug);
      if (tags.length > 0) {
        const filtered = tags.filter(t =>
          TOP_COMPANIES.some(c => c.toLowerCase() === t.name.toLowerCase())
        );
        p.companies = filtered.map(t => t.name);
        p.companyFrequency = {};
        for (const t of filtered) {
          p.companyFrequency[t.name] = t.count || 0;
        }
      }

      // Save incrementally every 10 problems
      if (fetched % 10 === 0) {
        saveOutput(problems, newCount);
        console.log(`  (saved progress — ${fetched} done)`);
      }

      await sleep(200);
    }
  }

  saveOutput(problems, newCount);

  function saveOutput(problems, newCount) {
    problems.sort((a, b) => a.id - b.id);

    const output = {
      lastUpdated: new Date().toISOString(),
      totalProblems: problems.length,
      problems,
      companiesIncluded: TOP_COMPANIES.length,
      premiumDataFetched: WITH_COMPANIES && !!LEETCODE_SESSION,
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  }

  const fileSize = (fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(1);

  console.log('\n=== Done ===');
  console.log(`Total problems: ${problems.length}`);
  console.log(`New problems:   ${newCount}`);
  console.log(`File size:      ${fileSize} MB`);
  console.log(`Written to:     ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
