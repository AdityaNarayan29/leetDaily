// Valid options for combobox inputs
const VALID_TOPICS = ['Array','Backtracking','Biconnected Component','Binary Indexed Tree','Binary Search','Binary Search Tree','Binary Tree','Bit Manipulation','Bitmask','Brainteaser','Breadth-First Search','Bucket Sort','Combinatorics','Concurrency','Counting','Counting Sort','Data Stream','Database','Depth-First Search','Design','Divide and Conquer','Doubly-Linked List','Dynamic Programming','Enumeration','Eulerian Circuit','Game Theory','Geometry','Graph','Greedy','Hash Function','Hash Table','Heap (Priority Queue)','Interactive','Iterator','Line Sweep','Linked List','Math','Matrix','Memoization','Merge Sort','Minimum Spanning Tree','Monotonic Queue','Monotonic Stack','Number Theory','Ordered Set','Prefix Sum','Probability and Statistics','Queue','Quickselect','Radix Sort','Randomized','Recursion','Rejection Sampling','Reservoir Sampling','Rolling Hash','Segment Tree','Shell','Shortest Path','Simulation','Sliding Window','Sort','Sorting','Stack','String','String Matching','Strongly Connected Component','Suffix Array','Topological Sort','Tree','Trie','Two Pointers','Union Find'];

const VALID_COMPANIES = ['1Kosmos','23&me','6sense','AMD','APT Portfolio','AQR Capital Management','ASUS','AT&T','Accelya','Accenture','Accolite','Acko','Activevideo','Activision','Addepar','Adobe','Aetion','Affinity','Affirm','Agoda','Airbnb','Airbus SE','Airtel','Ajira','Akamai','Akuna','Akuna Capital','Alibaba','AllinCall','Alphonso','Altimetrik','Amazon','Amadeus','American Express','Amplitude','Anaplan','Ancestry','Anduril','Angi','Ant Group','Apple','Applied Intuition','Arcesium','Arclight','Ares Management','Arista Networks','Asana','Ascend Learning','Atlassian','Aurora','Autodesk','Avalara','Avito','Axon','Baidu','Barclays','Benchling','BitGo','Bloomberg','Bolt','Box','Brex','Bristol-Myers Squibb','Broadcom','C3.AI','Cadence','Capital One','Careem','Carta','Cashfree','Chime','Citadel','Citrix','Cisco','Cloudera','Cloudflare','Clover Health','Codenation','Coinbase','Comcast','Coupang','Cruise','Databricks','Datadog','Dataminr','De Shaw','Dell','Deutsche Bank','DoorDash','Dropbox','DRW','Duolingo','eBay','Electronic Arts','Expedia','Expensify','Facebook','Fidelity','Figma','FlipKart','Flipkart','Foursquare','GE Healthcare','GoDaddy','Goldman Sachs','Google','Grab','Groupon','HRT','HackerRank','HashiCorp','Hims & Hers','Houzz','Huawei','IBM','IIT','IXL','Indeed','Infosys','Instagram','Instacart','Intel','Intuit','Jio','JP Morgan','Jane Street','Johnson & Johnson','Jpmorgan','Kakao','Karat','Kargo','Klarna','Kustomer','LinkedIn','Loft','Looker','Lyft','MakeMyTrip','Mathworks','Media.net','Meta','Microsoft','Mindtickle','Miro','Morgan Stanley','Myntra','Nagarro','NCR','Netflix','Niantic','Nvidia','Nykaa','OKX','Oracle','Oyo','Paytm','Paypal','Palo Alto Networks','Palantir Technologies','Pinterest','Pocket Gems','Pony.ai','Postmates','PwC','Qualcomm','Qualtrics','Quora','Razorpay','Redfin','Roblox','Robinhood','Salesforce','Samsung','SAP','Seagate','ServiceNow','Shopee','Shopify','Siemens','Slack','Snapchat','Snowflake','SpaceX','Splunk','Spotify','Square','Stripe','Swiggy','Synopsys','TCS','TikTok','Twitter','Two Sigma','Twitch','Twilio','Uber','Unity','Veritas','VMware','Visa','Walmart','Wayfair','Waymo','Wells Fargo','Wish','Wolfe Research','Workday','Yahoo','Yandex','Yelp','Zenefits','Zendesk','Zillow','Zomato','Zoom','Zscaler','eBay','FactSet','Groupon','Hulu','Kaspersky','NerdWallet','Okta','Plaid','Ramp','Scale AI','Sentry','Squarespace','Stitch Fix','Taboola','TaskUs','ThoughtWorks','Twitch','Yatra','Zuora'];

// Helper for LeetCode GraphQL requests
async function leetcodeFetch(body) {
  return fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body)
  });
}

// List helpers - inlined for Chrome extension compatibility
const listDataCache = {};

async function loadListData(listName) {
  if (listDataCache[listName]) {
    return listDataCache[listName];
  }

  try {
    const response = await fetch(chrome.runtime.getURL(`data/${listName}.json`));
    const data = await response.json();
    listDataCache[listName] = data;
    return data;
  } catch (error) {
    console.error(`Error loading ${listName} data:`, error);
    return null;
  }
}

async function loadMasterProblems() {
  if (listDataCache['master']) {
    return listDataCache['master'];
  }

  try {
    const response = await fetch(chrome.runtime.getURL('data/leetcode-problems.json'));
    const data = await response.json();

    const problemMap = {};
    for (const problem of data.problems) {
      problemMap[problem.id] = problem;
    }

    const masterData = { ...data, problemMap };
    listDataCache['master'] = masterData;
    return masterData;
  } catch (error) {
    console.error('Error loading master problems:', error);
    return null;
  }
}

async function getListStats(listName, completedIds = []) {
  const listData = await loadListData(listName);
  const master = await loadMasterProblems();

  if (!listData || !master || !listData.categories) {
    return { total: 0, completed: 0, remaining: 0, percentage: 0 };
  }

  const completedSet = new Set(completedIds.map(String));
  let total = 0;
  let completed = 0;

  for (const category of listData.categories) {
    if (!category.problemIds) continue;

    for (const problemId of category.problemIds) {
      total++;
      if (completedSet.has(String(problemId))) {
        completed++;
      }
    }
  }

  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, remaining, percentage };
}

// Pick a random element from an array
function pickRandom(arr) {
  return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;
}

async function getNextUnsolvedForList(listName) {
  const [listData, master] = await Promise.all([loadListData(listName), loadMasterProblems()]);
  if (!listData || !master) return null;
  return new Promise(resolve => {
    chrome.storage.local.get(['completedProblemIds'], (result) => {
      const done = new Set((result.completedProblemIds || []).map(String));
      const seen = new Set();
      const candidates = [];
      for (const cat of listData.categories || []) {
        for (const id of cat.problemIds || []) {
          if (seen.has(id)) continue;
          seen.add(id);
          if (!done.has(String(id))) {
            const p = master.problemMap[id];
            if (p && !p.isPaidOnly) candidates.push(p.url);
          }
        }
      }
      resolve(pickRandom(candidates));
    });
  });
}

async function getNextUnsolvedForTag(name, type) {
  const master = await loadMasterProblems();
  if (!master) return null;
  return new Promise(resolve => {
    chrome.storage.local.get(['completedProblemIds'], (result) => {
      const done = new Set((result.completedProblemIds || []).map(String));
      const candidates = [];
      for (const p of master.problems) {
        if (done.has(String(p.id)) || p.isPaidOnly) continue;
        if (type === 'topic') {
          const topics = (p.topics || []).map(t => typeof t === 'string' ? t : t.name);
          if (topics.some(t => t.toLowerCase() === name.toLowerCase())) candidates.push(p.url);
        } else {
          if ((p.companies || []).some(c => c.toLowerCase() === name.toLowerCase())) candidates.push(p.url);
        }
      }
      resolve(pickRandom(candidates));
    });
  });
}

async function getNextUnsolvedForIntersection(topics, companies) {
  const master = await loadMasterProblems();
  if (!master) return null;
  return new Promise(resolve => {
    chrome.storage.local.get(['completedProblemIds'], (result) => {
      const done = new Set((result.completedProblemIds || []).map(String));
      const candidates = [];
      for (const p of master.problems) {
        if (done.has(String(p.id)) || p.isPaidOnly) continue;
        const pt = (p.topics || []).map(t => typeof t === 'string' ? t : t.name);
        const pc = p.companies || [];
        const matchT = topics.some(t => pt.some(x => x.toLowerCase() === t.toLowerCase()));
        const matchC = companies.some(c => pc.some(x => x.toLowerCase() === c.toLowerCase()));
        if (matchT && matchC) candidates.push(p.url);
      }
      resolve(pickRandom(candidates));
    });
  });
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

// Cache for problem data from JSON file
let problemDataCache = null;

async function loadProblemData() {
  if (problemDataCache) return problemDataCache;

  try {
    const url = chrome.runtime.getURL('data/leetcode-problems.json');
    const response = await fetch(url);
    const data = await response.json();

    // Create a map for quick lookup by titleSlug
    problemDataCache = new Map();
    data.problems.forEach(p => {
      problemDataCache.set(p.titleSlug, p);
    });

    return problemDataCache;
  } catch (error) {
    console.error("Failed to load problem data:", error);
    return null;
  }
}

async function getProblemCompanyData(titleSlug) {
  const cache = await loadProblemData();
  if (!cache) return null;

  const problem = cache.get(titleSlug);
  if (!problem) return null;

  return {
    companies: problem.companies || [],
    companyFrequency: problem.companyFrequency || {},
    likes: problem.likes || 0,
    dislikes: problem.dislikes || 0,
    hints: problem.hints || [],
    similarQuestions: problem.similarQuestions || []
  };
}

async function fetchLeetCodeUserData() {
  try {
    const response = await leetcodeFetch({
        query: `
          query globalData {
            userStatus {
              username
              isSignedIn
              avatar
            }
            streakCounter {
              streakCount
            }
            activeDailyCodingChallengeQuestion {
              userStatus
            }
          }
        `
    });

    const data = await response.json();
    const userStatus = data?.data?.userStatus;
    if (!userStatus?.isSignedIn) {
      return null;
    }

    const streakData = data?.data?.streakCounter;
    const dailyStatus = data?.data?.activeDailyCodingChallengeQuestion?.userStatus;

    // Check if today's daily challenge is completed
    // Only use dailyStatus === "Finish" as the definitive check
    const completedToday = dailyStatus === "Finish";

    return {
      username: userStatus.username,
      avatar: userStatus.avatar,
      streak: streakData?.streakCount || 0,
      completedToday
    };
  } catch (error) {
    console.error("Failed to fetch LeetCode user data:", error);
    return null;
  }
}

function updateTimerDisplay() {
  const now = new Date();
  const nextUTC = new Date(now);
  nextUTC.setUTCHours(0, 0, 0, 0);
  nextUTC.setUTCDate(nextUTC.getUTCDate() + 1);

  const diff = nextUTC - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  document.getElementById("timer").textContent = `New in: ${hours}h ${minutes}m`;
}

async function getDailyQuestionSlug() {
  const query = {
    query: `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          question {
            titleSlug
            title
            difficulty
            questionFrontendId
            stats
            topicTags { name }
          }
        }
      }
    `
  };

  const response = await leetcodeFetch(query);

  const data = await response.json();
  const challenge = data.data.activeDailyCodingChallengeQuestion;
  return { ...challenge.question, date: challenge.date };
}


// Fetch all solved problem IDs from LeetCode and merge into chrome.storage
async function syncCompletedProblemIds() {
  try {
    // Get existing IDs first
    const existing = await new Promise(resolve => {
      chrome.storage.local.get(['completedProblemIds'], r => resolve(r.completedProblemIds || []));
    });

    const response = await leetcodeFetch({
        query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
            totalNum
            data { questionFrontendId status }
          }
        }`,
        variables: { categorySlug: "", limit: 3000, skip: 0, filters: {} }
    });

    const data = await response.json();
    const questions = data?.data?.problemsetQuestionList?.data || [];
    const apiIds = questions
      .filter(q => q.status === "ac")
      .map(q => parseInt(q.questionFrontendId))
      .filter(id => !isNaN(id));

    // Synced completed IDs from LeetCode

    if (apiIds.length > 0) {
      // Merge: union of existing + API results
      const merged = [...new Set([...existing.map(Number), ...apiIds])];
      await new Promise(resolve => {
        chrome.storage.local.set({ completedProblemIds: merged }, resolve);
      });
      return merged;
    }

    return existing;
  } catch (err) {
    console.error("Failed to sync completed problem IDs:", err);
    return [];
  }
}

async function fetchUserSolvedStats(username) {
  try {
    const response = await leetcodeFetch({
        query: `
          query userProblemsSolved($username: String!) {
            matchedUser(username: $username) {
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `,
        variables: { username }
    });

    const data = await response.json();
    const stats = data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];

    return {
      easy: stats.find(s => s.difficulty === "Easy")?.count || 0,
      medium: stats.find(s => s.difficulty === "Medium")?.count || 0,
      hard: stats.find(s => s.difficulty === "Hard")?.count || 0,
      total: stats.find(s => s.difficulty === "All")?.count || 0
    };
  } catch (error) {
    console.error("Failed to fetch solved stats:", error);
    return null;
  }
}

async function fetchLast30DaysHistory(username) {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Fetch daily challenge status for current and last month
    const fetchDailyChallenges = async (y, m) => {
      const response = await leetcodeFetch({
          query: `
            query dailyCodingQuestionRecords($year: Int!, $month: Int!) {
              dailyCodingChallengeV2(year: $year, month: $month) {
                challenges {
                  date
                  userStatus
                }
              }
            }
          `,
          variables: { year: y, month: m }
      });
      const data = await response.json();
      return data?.data?.dailyCodingChallengeV2?.challenges || [];
    };

    // Fetch submission calendar (problems solved per day)
    const fetchSubmissionCalendar = async () => {
      if (!username) return {};
      const response = await leetcodeFetch({
          query: `
            query userProfileCalendar($username: String!) {
              matchedUser(username: $username) {
                userCalendar {
                  submissionCalendar
                }
              }
            }
          `,
          variables: { username }
      });
      const data = await response.json();
      const calendarStr = data?.data?.matchedUser?.userCalendar?.submissionCalendar;
      return calendarStr ? JSON.parse(calendarStr) : {};
    };

    // Fetch all data in parallel
    const [currentMonth, lastMonthData, submissionCalendar] = await Promise.all([
      fetchDailyChallenges(year, month),
      fetchDailyChallenges(month === 1 ? year - 1 : year, month === 1 ? 12 : month - 1),
      fetchSubmissionCalendar()
    ]);

    const allChallenges = [...currentMonth, ...lastMonthData];

    // Build daily challenge map
    const dailyChallengeMap = new Map();
    allChallenges.forEach(c => {
      dailyChallengeMap.set(c.date, c.userStatus === "Finish");
    });

    // Convert submission calendar (unix timestamps) to date -> count map
    const submissionMap = new Map();
    for (const [timestamp, count] of Object.entries(submissionCalendar)) {
      const date = new Date(parseInt(timestamp) * 1000);
      const dateStr = date.toISOString().slice(0, 10);
      submissionMap.set(dateStr, count);
    }

    return { dailyChallengeMap, submissionMap };
  } catch (error) {
    console.error("Failed to fetch 30-day history:", error);
    return { dailyChallengeMap: new Map(), submissionMap: new Map() };
  }
}

// Renders chips inline with "+X more" that expands on click
function renderChipsWithOverflow(container, items, chipClass, moreClass, isTopics) {
  container.innerHTML = '';
  const containerWidth = container.offsetWidth;
  let usedWidth = 0;
  let visibleCount = 0;
  const gap = 6; // gap-1.5 = 6px
  const moreButtonWidth = 60; // approximate width for "+X more"

  // Create all chips first to measure
  const chips = items.map((item) => {
    const chip = document.createElement('span');
    chip.className = chipClass;

    if (isTopics) {
      // Topics: item is { name, slug } or has .name
      const tagName = item.name || item;
      const tagSlug = encodeURIComponent(
        tagName.toLowerCase()
          .replace(/[ ()]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      );
      chip.textContent = tagName;
      chip.dataset.tag = tagSlug;
      chip.style.cursor = 'pointer';
    } else {
      // Companies: item is { name, freq }
      const freqLabel = item.freq > 0 ? ` (${item.freq})` : '';
      chip.textContent = `${item.name}${freqLabel}`;
      chip.dataset.company = item.name;
      chip.style.cursor = 'pointer';
    }

    return chip;
  });

  // Measure and add visible chips
  const tempContainer = document.createElement('div');
  tempContainer.style.cssText = 'position:absolute;visibility:hidden;display:flex;gap:6px;';
  document.body.appendChild(tempContainer);

  for (let i = 0; i < chips.length; i++) {
    tempContainer.appendChild(chips[i].cloneNode(true));
    const chipWidth = tempContainer.lastChild.offsetWidth;

    const remainingItems = chips.length - (i + 1);
    const needsMore = remainingItems > 0;
    const requiredWidth = usedWidth + chipWidth + (needsMore ? moreButtonWidth + gap : 0);

    if (requiredWidth <= containerWidth || i === 0) {
      usedWidth += chipWidth + gap;
      visibleCount++;
    } else {
      break;
    }
  }

  document.body.removeChild(tempContainer);

  // Add visible chips
  const visibleChips = chips.slice(0, visibleCount);
  visibleChips.forEach(chip => container.appendChild(chip));

  // Add "+X more" button if needed
  const hiddenCount = chips.length - visibleCount;
  if (hiddenCount > 0) {
    const moreBtn = document.createElement('span');
    moreBtn.className = moreClass;
    moreBtn.textContent = `+${hiddenCount} more`;
    moreBtn.style.cursor = 'pointer';
    moreBtn.dataset.expanded = 'false';

    moreBtn.addEventListener('click', () => {
      const isExpanded = moreBtn.dataset.expanded === 'true';

      if (isExpanded) {
        // Collapse: remove hidden chips and reset button
        container.querySelectorAll('[data-hidden="true"]').forEach(el => el.remove());
        container.classList.remove('flex-wrap');
        container.classList.add('overflow-hidden');
        moreBtn.textContent = `+${hiddenCount} more`;
        moreBtn.dataset.expanded = 'false';
      } else {
        // Expand: add hidden chips before the button and allow wrapping
        container.classList.add('flex-wrap');
        container.classList.remove('overflow-hidden');
        const hiddenChips = chips.slice(visibleCount);
        hiddenChips.forEach(chip => {
          chip.dataset.hidden = 'true';
          container.insertBefore(chip, moreBtn);
        });
        moreBtn.textContent = 'less';
        moreBtn.dataset.expanded = 'true';
      }
    });

    container.appendChild(moreBtn);
  }

  // Add click handlers for chips → open explorer with filter
  container.addEventListener('click', (event) => {
    const target = event.target;
    if (isTopics && target.dataset.tag) {
      const topicName = target.textContent.trim();
      chrome.tabs.create({ url: getExplorerUrl([topicName], []) });
    } else if (!isTopics && target.dataset.company) {
      chrome.tabs.create({ url: getExplorerUrl([], [target.dataset.company]) });
    }
  });
}

function renderQuestion(question, companyData = null) {
  // LeetCode's exact difficulty colors
  const difficultyColors = {
    Easy: "text-[#00b8a3]",
    Medium: "text-[#ffa116]",
    Hard: "text-[#ff375f]",
  };

  const difficultyColor = difficultyColors[question.difficulty] || "text-[#eff1f699]";

  let acceptanceRate = "N/A";
  try {
    const stats = JSON.parse(question.stats || "{}");
    acceptanceRate = stats.acRate ? parseFloat(stats.acRate).toFixed(2) : "N/A";
  } catch {
    acceptanceRate = "N/A";
  }

  // Consistent chip styling - same size/padding, different colors
  const baseChipClass = "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap";
  const topicChipClass = `${baseChipClass} bg-[#ffffff0d] text-[#eff1f699] hover:bg-[#ffffff1a] hover:text-[#eff1f6] cursor-pointer`;
  const companyChipClass = `${baseChipClass} bg-[#ffa1161a] text-[#ffa116] hover:bg-[#ffa11633] cursor-pointer`;
  const moreChipClass = `${baseChipClass} bg-[#ffffff0d] text-[#eff1f699] hover:bg-[#ffffff1a] hover:text-[#eff1f6] cursor-pointer`;

  const topicsArray = question.topicTags || [];
  const hasCompanyData = companyData && companyData.companies && companyData.companies.length > 0;
  const companiesArray = hasCompanyData ? companyData.companies : [];

  const problemUrl = `https://leetcode.com/problems/${question.titleSlug}`;

  // Book icon for topics
  const bookIcon = `<svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
  // Building icon for companies
  const buildingIcon = `<svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>`;

  document.getElementById("question").innerHTML = `
    <div class="mb-3 flex items-start gap-2">
      <div class="flex-1 text-[14px] leading-snug"><span class="text-[#eff1f699]">${question.questionFrontendId}.</span> <span class="font-medium text-[#eff1f6]">${question.title}</span> <span style="white-space: nowrap; font-size: 11px; float: right;"><span class="font-medium ${difficultyColor}">${question.difficulty}</span><span style="color: #eff1f699;">&nbsp;·&nbsp;</span><span id="acceptance-rate" style="color: #eff1f699; cursor: help;">${acceptanceRate}%</span></span></div>
      <button id="open-problem" class="text-[#eff1f6] hover:text-[#ffa116] cursor-pointer transition-colors flex-shrink-0 mt-0.5" title="Open problem">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </button>
    </div>
    <div>
      <!-- Topics row -->
      <div class="flex items-start gap-2 text-[#eff1f699] px-2.5 py-2 border border-[#ffffff1a]" style="border-radius: 8px 8px 0 0; border-bottom: none;">
        <div class="flex items-center gap-1.5 flex-shrink-0">
          ${bookIcon}
          <span class="text-[11px] font-medium">Topics</span>
          <span class="text-[#ffffff33]">›</span>
        </div>
        <div id="topics-row" class="flex-1 flex items-center gap-1.5 overflow-hidden min-w-0">
          <!-- Chips injected by JS -->
        </div>
      </div>
      <!-- Companies row -->
      <div class="flex items-start gap-2 text-[#eff1f699] px-2.5 py-2 border border-[#ffffff1a] border-t-0" style="border-radius: 0 0 8px 8px;">
        <div class="flex items-center gap-1.5 flex-shrink-0">
          ${buildingIcon}
          <span class="text-[11px] font-medium">Companies</span>
          <span class="text-[#ffffff33]">›</span>
        </div>
        <div id="companies-row" class="flex-1 flex items-center gap-1.5 overflow-hidden min-w-0">
          ${hasCompanyData ? '<!-- Chips injected by JS -->' : '<span class="text-[11px] text-[#eff1f666]">Premium data shows no company tags</span>'}
        </div>
      </div>
    </div>
  `;

  // Render topic chips with "+X more" logic
  const topicsRowEl = document.getElementById("topics-row");
  if (topicsRowEl && topicsArray.length > 0) {
    renderChipsWithOverflow(topicsRowEl, topicsArray, topicChipClass, moreChipClass, true);
  } else if (topicsRowEl) {
    topicsRowEl.innerHTML = '<span class="text-[11px] text-[#eff1f666]">N/A</span>';
  }

  // Render company chips with "+X more" logic (only if there's data)
  const companiesRowEl = document.getElementById("companies-row");
  if (companiesRowEl && hasCompanyData && companiesArray.length > 0) {
    const companyItems = companiesArray.map(company => {
      const freq = companyData.companyFrequency[company] || 0;
      return { name: company, freq };
    });
    renderChipsWithOverflow(companiesRowEl, companyItems, companyChipClass, moreChipClass, false);
  }

  // Open problem button
  document.getElementById("open-problem").addEventListener("click", () => {
    chrome.tabs.create({ url: problemUrl });
  });

  // Acceptance rate tooltip
  const acceptanceEl = document.getElementById("acceptance-rate");
  if (acceptanceEl) {
    let tooltip = null;
    acceptanceEl.addEventListener("mouseenter", () => {
      tooltip = document.createElement("div");
      tooltip.textContent = `${acceptanceRate}% Acceptance Rate`;
      tooltip.style.cssText = "position:absolute;background:#333;color:#fff;padding:4px 8px;border-radius:4px;font-size:10px;white-space:nowrap;z-index:1000;";
      const rect = acceptanceEl.getBoundingClientRect();
      tooltip.style.left = rect.left + "px";
      tooltip.style.top = (rect.top - 28) + "px";
      document.body.appendChild(tooltip);
    });
    acceptanceEl.addEventListener("mouseleave", () => {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });
  }

}

document.addEventListener("DOMContentLoaded", async () => {
  let question;
  try {
    question = await getDailyQuestionSlug();
    const companyData = await getProblemCompanyData(question.titleSlug);
    renderQuestion(question, companyData);
  } catch (err) {
    console.error('Failed to load daily challenge:', err);
    const questionEl = document.getElementById("question");
    if (questionEl) {
      questionEl.innerHTML = `<div class="text-[12px] text-[#eff1f699]">Could not load daily challenge. <a href="https://leetcode.com/problemset/" target="_blank" class="text-[#ffa116] hover:underline">Open LeetCode</a></div>`;
    }
  }

  updateTimerDisplay();
  setInterval(updateTimerDisplay, 60 * 1000);

  function getStreakMilestone(streak) {
    const milestones = [
      { days: 365, emoji: "👑", message: "Legendary! 1 year streak!" },
      { days: 100, emoji: "💯", message: "Amazing! 100 day streak!" },
      { days: 50, emoji: "⭐", message: "Fantastic! 50 day streak!" },
      { days: 30, emoji: "🏆", message: "Incredible! 30 day streak!" },
      { days: 14, emoji: "🎯", message: "Two weeks strong!" },
      { days: 7, emoji: "🌟", message: "One week streak!" },
    ];
    return milestones.find(m => streak >= m.days) || null;
  }

  function updateStreakDisplay() {
    chrome.storage.local.get([
      "currentStreak",
      "longestStreak",
      "lastSolvedDate",
      "leetCodeUsername"
    ], (result) => {
      const streak = result.currentStreak || 0;
      const longestStreak = result.longestStreak || 0;
      const today = getTodayDate();
      const lastSolved = result.lastSolvedDate || null;
      const streakDisplay = document.getElementById("streakDisplay");
      const username = result.leetCodeUsername;
      const milestone = getStreakMilestone(streak);

      const solvedToday = lastSolved === today;

      if (solvedToday) {
        // Solved today - show active streak
        const milestoneEmoji = milestone ? ` ${milestone.emoji}` : "";
        const prev = streakDisplay.textContent;
        streakDisplay.textContent = `🔥 ${streak}${milestoneEmoji}`;
        streakDisplay.title = milestone
          ? `${milestone.message} ${username ? `(${username})` : ""}`
          : `Streak active! ${streak} day${streak !== 1 ? 's' : ''}`;
        // Pulse animation when streak value changes
        if (prev && prev !== streakDisplay.textContent) {
          streakDisplay.classList.add('streak-pulse');
          setTimeout(() => streakDisplay.classList.remove('streak-pulse'), 300);
        }
      } else {
        // Not solved today - show pending streak
        streakDisplay.textContent = `🔥 ${streak}`;
        streakDisplay.title = streak > 0
          ? `Streak at risk! Keep solving to continue your ${streak}-day streak.`
          : `Start your streak by solving a problem!`;
      }

      // Show milestone celebration banner if applicable
      const milestoneEl = document.getElementById("milestone-banner");
      if (milestoneEl && milestone && solvedToday) {
        milestoneEl.textContent = `${milestone.emoji} ${milestone.message}`;
        milestoneEl.classList.remove("hidden");
      } else if (milestoneEl) {
        milestoneEl.classList.add("hidden");
      }
    });
  }


  // Show/hide login prompt and stats panel based on login state
  function updateLoginState(isLoggedIn, userData = null) {
    const loginPrompt = document.getElementById("login-prompt");
    const statsPanel = document.getElementById("stats-panel");
    const avatar = document.getElementById("user-avatar");
    const logo = document.getElementById("lc-logo");
    const headerTitle = document.getElementById("header-title");
    const headerSubtitle = document.getElementById("header-subtitle");

    if (isLoggedIn && userData) {
      loginPrompt.classList.add("hidden");
      statsPanel.classList.remove("hidden");

      // Show avatar, hide logo
      if (userData.avatar) {
        avatar.src = userData.avatar;
        avatar.alt = userData.username;
        avatar.classList.remove("hidden");
        logo.classList.add("hidden");
      }

      // Update header text
      headerTitle.textContent = userData.username;
      headerSubtitle.textContent = "Daily LeetCode Kro";
    } else {
      loginPrompt.classList.remove("hidden");
      statsPanel.classList.add("hidden");

      // Show logo, hide avatar
      avatar.classList.add("hidden");
      logo.classList.remove("hidden");

      // Reset header text
      headerTitle.textContent = "LeetDaily";
      headerSubtitle.textContent = "Daily LeetCode Kro";
    }
  }

  // Sync streak from LeetCode on popup open (fetch from popup since it has cookie access)
  async function syncFromLeetCode() {
    const userData = await fetchLeetCodeUserData();

    if (userData) {
      const today = getTodayDate();
      updateLoginState(true, userData);

      // Sync all solved problem IDs from LeetCode, then re-render list progress
      syncCompletedProblemIds().then(() => {
        renderListProgress();
        // Tag progress already rendered from storage load; list progress
        // updates in-place (no flash), but tag progress rebuilds DOM so skip it
      });

      chrome.storage.local.set({
        streak: userData.streak,
        leetCodeUsername: userData.username,
        leetCodeAvatar: userData.avatar,
        lastVisitedDate: userData.completedToday ? today : null,
        lastSyncedAt: Date.now()
      }, () => {
        updateStreakDisplay();
        renderStatsPanel(userData.username);
        render30DayHeatmap(userData.username);
        // Notify background to update badge
        chrome.runtime.sendMessage({ action: "updateBadge" });
      });
    } else {
      // Not logged in
      updateLoginState(false);
      render30DayHeatmap(null);
    }
  }

  // Render stats panel
  async function renderStatsPanel(username) {
    if (!username) return;

    const stats = await fetchUserSolvedStats(username);
    if (stats) {
      document.getElementById("easy-count").textContent = stats.easy;
      document.getElementById("medium-count").textContent = stats.medium;
      document.getElementById("hard-count").textContent = stats.hard;
      document.getElementById("total-count").textContent = stats.total;
      // Swap skeleton for real content
      const skeleton = document.getElementById("stats-skeleton");
      const content = document.getElementById("stats-content");
      if (skeleton) skeleton.classList.add("hidden");
      if (content) content.classList.remove("hidden");
    }
  }

  // Render 30-day heatmap with color intensity based on problems solved
  async function render30DayHeatmap(username) {
    const heatmapEl = document.getElementById("heatmap");
    const countEl = document.getElementById("heatmap-count");
    const datesEl = document.getElementById("heatmap-dates");

    // Guard against null elements
    if (!heatmapEl || !countEl || !datesEl) return;

    const { dailyChallengeMap, submissionMap } = await fetchLast30DaysHistory(username);

    const today = new Date();
    let dailyChallengeCount = 0;

    // Get color class based on submission count
    function getIntensityClass(count) {
      if (count === 0) return "bg-[#ffffff0d]";
      if (count <= 2) return "bg-[#2cbb5d40]";
      if (count <= 5) return "bg-[#2cbb5d80]";
      return "bg-[#2cbb5d]";
    }

    // Build grid: 30 cells for last 30 days
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);

      const dailyCompleted = dailyChallengeMap.get(dateStr) === true;
      const submissionCount = submissionMap.get(dateStr) || 0;
      const isToday = i === 0;

      if (dailyCompleted) dailyChallengeCount++;

      // Color intensity based on submission count
      let cellClass = getIntensityClass(submissionCount);

      // Add today's ring indicator
      if (isToday && submissionCount === 0) {
        cellClass = "bg-[#ffa11640] ring-1 ring-[#ffa116]";
      } else if (isToday) {
        cellClass += " ring-1 ring-[#ffa116]";
      }

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const submissionsText = submissionCount === 1 ? "1 submission" : `${submissionCount} submissions`;
      const tooltip = `${dayName}, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${submissionsText}`;

      // Show checkmark for daily challenge completion
      const checkmark = dailyCompleted
        ? `<svg class="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 6 5 9 10 3"></polyline></svg>`
        : '';

      days.push(`
        <div class="heatmap-cell w-full aspect-square rounded-sm ${cellClass} transition-all hover:scale-110 cursor-default flex items-center justify-center" data-tooltip="${tooltip}">${checkmark}</div>
      `);
    }

    heatmapEl.innerHTML = days.join('');

    // Setup custom tooltip for heatmap cells
    const tooltipEl = document.getElementById("custom-tooltip");
    const popupWidth = 400; // Extension popup width

    heatmapEl.querySelectorAll(".heatmap-cell").forEach(cell => {
      cell.addEventListener("mouseenter", () => {
        const text = cell.dataset.tooltip;
        if (text) {
          tooltipEl.textContent = text;
          tooltipEl.classList.remove("opacity-0");
          tooltipEl.classList.add("opacity-100");

          const rect = cell.getBoundingClientRect();
          const tooltipWidth = tooltipEl.offsetWidth;

          // Calculate centered position
          let left = rect.left + rect.width / 2 - tooltipWidth / 2;

          // Clamp to prevent overflow on left/right edges
          const padding = 8;
          left = Math.max(padding, Math.min(left, popupWidth - tooltipWidth - padding));

          tooltipEl.style.left = `${left}px`;
          tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 6}px`;
        }
      });

      cell.addEventListener("mouseleave", () => {
        tooltipEl.classList.remove("opacity-100");
        tooltipEl.classList.add("opacity-0");
      });
    });

    // Update count display
    countEl.textContent = `${dailyChallengeCount}/30 daily`;

    // Add date labels
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 29);
    datesEl.innerHTML = `
      <span>${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      <span>Today</span>
    `;
  }

  // Render list progress cards
  async function renderListProgress() {
    try {
      // Get list of completed problem IDs from user's LeetCode history
      const { completedProblemIds = [] } = await new Promise(resolve => {
        chrome.storage.local.get(['completedProblemIds'], resolve);
      });

      // Get stats for each list
      const [blind75Stats, neetcode150Stats, leetcode75Stats] = await Promise.all([
        getListStats('blind75', completedProblemIds),
        getListStats('neetcode150', completedProblemIds),
        getListStats('leetcode75', completedProblemIds)
      ]);

      updateProgressCard('blind75', blind75Stats.completed, blind75Stats.total, blind75Stats.percentage);
      updateProgressCard('neetcode150', neetcode150Stats.completed, neetcode150Stats.total, neetcode150Stats.percentage);
      updateProgressCard('leetcode75', leetcode75Stats.completed, leetcode75Stats.total, leetcode75Stats.percentage);

    } catch (error) {
      console.error('❌ Failed to render list progress:', error);
      console.error(error.stack);
      // Show 0% progress on error
      updateProgressCard('blind75', 0, 74, 0);
      updateProgressCard('neetcode150', 0, 158, 0);
      updateProgressCard('leetcode75', 0, 75, 0);
    }
  }

  // Update a single progress card (horizontal bar)
  function updateProgressCard(listName, completed, total, percentage) {
    const progressBar = document.getElementById(`${listName}-progress`);
    const percentageText = document.getElementById(`${listName}-percentage`);
    const countText = document.getElementById(`${listName}-count`);

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      progressBar.classList.add('progress-animate');
    }
    if (percentageText) percentageText.textContent = `${percentage}%`;
    if (countText) countText.textContent = `${completed}/${total}`;
  }

  // Add click handlers for list labels
  [['blind75-label', 'blind75'], ['neetcode150-label', 'neetcode150'], ['leetcode75-label', 'leetcode75']].forEach(([labelId, listName]) => {
    const label = document.getElementById(labelId);
    if (label) {
      label.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL(`problems-explorer.html?list=${listName}`) });
      });
    }
  });

  // Next unsolved buttons for list cards
  [['blind75-next', 'blind75'], ['neetcode150-next', 'neetcode150'], ['leetcode75-next', 'leetcode75']].forEach(([btnId, listName]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const url = await getNextUnsolvedForList(listName);
        if (url) chrome.tabs.create({ url });
      });
    }
  });

  // Initialize in proper order
  async function initialize() {
    await renderListProgress();
    syncFromLeetCode();
    updateStreakDisplay();
    // refreshTagProgress is called by the storage load callback below
    // and again after syncCompletedProblemIds resolves with fresh data
  }

  // Start initialization
  initialize();

  // Load stats and heatmap from storage initially (will be updated by syncFromLeetCode)
  chrome.storage.local.get(["leetCodeUsername", "leetCodeAvatar"], (result) => {
    if (result.leetCodeUsername) {
      // Show cached user info immediately
      updateLoginState(true, {
        username: result.leetCodeUsername,
        avatar: result.leetCodeAvatar
      });
      renderStatsPanel(result.leetCodeUsername);
      render30DayHeatmap(result.leetCodeUsername);
    } else {
      // Still render heatmap without username (will only show daily challenges)
      render30DayHeatmap(null);
    }
  });

  // Problems Explorer button
  document.getElementById("explorer-btn").addEventListener("click", () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('problems-explorer.html'),
    });
  });

  // Settings page navigation
  const mainView = document.getElementById("main-view");
  const settingsView = document.getElementById("settings-view");

  document.getElementById("settings-btn").addEventListener("click", () => {
    mainView.style.display = 'none';
    mainView.classList.add("hidden");
    settingsView.classList.remove("hidden");
    settingsView.style.display = '';
  });

  document.getElementById("settings-back-btn").addEventListener("click", () => {
    settingsView.style.display = 'none';
    settingsView.classList.add("hidden");
    mainView.classList.remove("hidden");
    mainView.style.display = '';
  });

  // Notification toggle
  const notifToggle = document.getElementById("toggle-notifications");
  const notifDot = document.getElementById("notif-toggle-dot");
  const reminderTimeSection = document.getElementById("reminder-time-section");

  function updateNotificationToggleUI(enabled) {
    if (enabled) {
      notifToggle.classList.remove("bg-[#ffffff1a]");
      notifToggle.classList.add("bg-[#2cbb5d]");
      notifDot.classList.add("translate-x-4");
      reminderTimeSection.classList.remove("opacity-50", "pointer-events-none");
    } else {
      notifToggle.classList.add("bg-[#ffffff1a]");
      notifToggle.classList.remove("bg-[#2cbb5d]");
      notifDot.classList.remove("translate-x-4");
      reminderTimeSection.classList.add("opacity-50", "pointer-events-none");
    }
  }

  notifToggle.addEventListener("click", () => {
    chrome.storage.local.get(["notificationsEnabled"], (result) => {
      const currentState = result.notificationsEnabled !== false;
      const newState = !currentState;

      chrome.storage.local.set({ notificationsEnabled: newState }, () => {
        updateNotificationToggleUI(newState);
      });
    });
  });

  // Badge streak toggle
  const badgeToggle = document.getElementById("toggle-badge-streak");
  const badgeDot = document.getElementById("badge-toggle-dot");

  function updateBadgeToggleUI(enabled) {
    if (enabled) {
      badgeToggle.classList.remove("bg-[#ffffff1a]");
      badgeToggle.classList.add("bg-[#2cbb5d]");
      badgeDot.classList.add("translate-x-4");
    } else {
      badgeToggle.classList.add("bg-[#ffffff1a]");
      badgeToggle.classList.remove("bg-[#2cbb5d]");
      badgeDot.classList.remove("translate-x-4");
    }
  }

  badgeToggle.addEventListener("click", () => {
    chrome.storage.local.get(["badgeStreakEnabled"], (result) => {
      const currentState = result.badgeStreakEnabled !== false; // Default to true
      const newState = !currentState;

      chrome.storage.local.set({ badgeStreakEnabled: newState }, () => {
        updateBadgeToggleUI(newState);
        // Notify background to update badge
        chrome.runtime.sendMessage({ action: "updateBadge" });
      });
    });
  });

  // Custom Time Picker
  const hourSelect = document.getElementById("hour-select");
  const minuteSelect = document.getElementById("minute-select");
  const ampmBtn = document.getElementById("ampm-btn");
  const timeSavedCheck = document.getElementById("time-saved-check");
  let saveTimeout = null;

  let selectedAmPm = "AM";

  function get24HourTime() {
    const hour = parseInt(hourSelect.value);
    const minute = parseInt(minuteSelect.value);
    let hour24 = hour;
    if (selectedAmPm === "PM" && hour !== 12) {
      hour24 = hour + 12;
    } else if (selectedAmPm === "AM" && hour === 12) {
      hour24 = 0;
    }
    return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  function saveTime() {
    const time = get24HourTime();
    chrome.storage.local.set({ reminderTime: time }, () => {
      chrome.runtime.sendMessage({ action: "updateReminderTime", time });

      timeSavedCheck.classList.remove("opacity-0");
      timeSavedCheck.classList.add("opacity-100");

      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        timeSavedCheck.classList.remove("opacity-100");
        timeSavedCheck.classList.add("opacity-0");
      }, 1500);
    });
  }

  // Event handlers
  hourSelect.addEventListener('change', saveTime);
  minuteSelect.addEventListener('change', saveTime);

  ampmBtn.addEventListener('click', () => {
    selectedAmPm = selectedAmPm === "AM" ? "PM" : "AM";
    ampmBtn.textContent = selectedAmPm;
    saveTime();
  });

  // Load initial settings state
  chrome.storage.local.get(["notificationsEnabled", "reminderTime", "badgeStreakEnabled"], (result) => {
    const enabled = result.notificationsEnabled !== false;
    updateNotificationToggleUI(enabled);

    // Badge streak toggle (default to true)
    const badgeEnabled = result.badgeStreakEnabled !== false;
    updateBadgeToggleUI(badgeEnabled);

    // Parse stored time (24h format like "10:00" or "14:30")
    const time = result.reminderTime || "10:00";
    const [hour24, minute] = time.split(':').map(Number);

    // Convert 24h to 12h format
    let hour12;
    if (hour24 === 0) {
      hour12 = 12;
      selectedAmPm = "AM";
    } else if (hour24 === 12) {
      hour12 = 12;
      selectedAmPm = "PM";
    } else if (hour24 > 12) {
      hour12 = hour24 - 12;
      selectedAmPm = "PM";
    } else {
      hour12 = hour24;
      selectedAmPm = "AM";
    }

    // Set select values
    hourSelect.value = hour12;
    minuteSelect.value = minute;
    ampmBtn.textContent = selectedAmPm;
  });

  // Streak requirement checkboxes
  const reqDaily = document.getElementById("req-daily");
  const reqLc75 = document.getElementById("req-lc75");
  const reqBlind75 = document.getElementById("req-blind75");
  const reqNc150 = document.getElementById("req-nc150");
  const reqAny = document.getElementById("req-any");

  // Tag input state (initialized after setupTagInput is defined)
  let companyTags = null;
  let topicTags = null;

  let _saveReqTimer = null;
  function saveRequirements() {
    const req = {
      dailyChallenge: reqDaily.checked,
      leetcode75: reqLc75.checked,
      blind75: reqBlind75.checked,
      neetcode150: reqNc150.checked,
      anySubmission: reqAny ? reqAny.checked : false,
      companyFocus: companyTags ? companyTags.isEnabled() : false,
      selectedCompanies: companyTags ? companyTags.getTags() : [],
      topicFocus: topicTags ? topicTags.isEnabled() : false,
      selectedTopics: topicTags ? topicTags.getTags() : []
    };
    // Throttle storage writes (150ms)
    clearTimeout(_saveReqTimer);
    _saveReqTimer = setTimeout(() => {
      chrome.storage.local.set({ requirements: req });
    }, 150);
    // UI updates are immediate
    updateProgressCardVisibility();
    refreshTagProgress(req);
  }

  function updateProgressCardVisibility() {
    const reqs = {
      dailyChallenge: reqDaily.checked,
      blind75: reqBlind75.checked,
      neetcode150: reqNc150.checked,
      leetcode75: reqLc75.checked
    };

    const blind75Card = document.getElementById('blind75-card');
    const neetcode150Card = document.getElementById('neetcode150-card');
    const leetcode75Card = document.getElementById('leetcode75-card');
    const progressSection = document.getElementById('list-progress-section');
    const dailyChallengeSection = document.getElementById('daily-challenge-section');

    if (blind75Card) blind75Card.classList.toggle('hidden', !reqs.blind75);
    if (neetcode150Card) neetcode150Card.classList.toggle('hidden', !reqs.neetcode150);
    if (leetcode75Card) leetcode75Card.classList.toggle('hidden', !reqs.leetcode75);

    // Hide the entire progress section if no list is selected
    if (progressSection) {
      progressSection.classList.toggle('hidden', !reqs.blind75 && !reqs.neetcode150 && !reqs.leetcode75);
    }

    // Show/hide daily challenge section based on checkbox
    if (dailyChallengeSection) {
      dailyChallengeSection.classList.toggle('hidden', !reqs.dailyChallenge);
    }
  }

  // Render tag progress bars for selected topics/companies in main view
  let _tagProgressGen = 0;
  async function refreshTagProgress(reqOverride) {
    const gen = ++_tagProgressGen;
    const tagProgressSection = document.getElementById('tag-progress-section');
    const tagProgressList = document.getElementById('tag-progress-list');
    if (!tagProgressSection || !tagProgressList) return;

    let req;
    let completedProblemIds;
    if (reqOverride) {
      req = reqOverride;
      const result = await new Promise(resolve => {
        chrome.storage.local.get(['completedProblemIds'], resolve);
      });
      if (gen !== _tagProgressGen) return;
      completedProblemIds = result.completedProblemIds || [];
    } else {
      const result = await new Promise(resolve => {
        chrome.storage.local.get(['requirements', 'orModeRequirements', 'completedProblemIds'], resolve);
      });
      if (gen !== _tagProgressGen) return;
      req = result.requirements || result.orModeRequirements || {};
      completedProblemIds = result.completedProblemIds || [];
    }

    const selectedTopics = req.topicFocus && req.selectedTopics?.length ? req.selectedTopics : [];
    const selectedCompanies = req.companyFocus && req.selectedCompanies?.length ? req.selectedCompanies : [];

    if (selectedTopics.length === 0 && selectedCompanies.length === 0) {
      tagProgressSection.classList.add('hidden');
      return;
    }

    tagProgressSection.classList.remove('hidden');
    tagProgressSection.classList.add('section-fadein');

    const master = await loadMasterProblems();
    if (gen !== _tagProgressGen) return;

    if (!master || !master.problems) {
      tagProgressList.innerHTML = '';
      return;
    }

    // Compute solved/total for each selected tag + AND intersection
    const allTags = [
      ...selectedTopics.map(t => ({ name: t, type: 'topic' })),
      ...selectedCompanies.map(c => ({ name: c, type: 'company' }))
    ];

    const stats = {};
    allTags.forEach(({ name }) => { stats[name] = { solved: 0, total: 0 }; });

    const intersection = { solved: 0, total: 0 };
    const showIntersection = selectedTopics.length > 0 && selectedCompanies.length > 0;

    for (const problem of master.problems) {
      const id = String(problem.id);
      const solved = completedProblemIds.some(pid => String(pid) === id);

      const problemTopics = (problem.topics || []).map(t => typeof t === 'string' ? t : t.name);
      for (const tag of selectedTopics) {
        if (problemTopics.some(t => t.toLowerCase() === tag.toLowerCase())) {
          stats[tag].total++;
          if (solved) stats[tag].solved++;
        }
      }

      const problemCompanies = problem.companies || [];
      for (const tag of selectedCompanies) {
        if (problemCompanies.some(c => c.toLowerCase() === tag.toLowerCase())) {
          stats[tag].total++;
          if (solved) stats[tag].solved++;
        }
      }

      // Intersection: problem matches any selected topic AND any selected company
      if (showIntersection) {
        const matchesTopic = selectedTopics.some(tag => problemTopics.some(t => t.toLowerCase() === tag.toLowerCase()));
        const matchesCompany = selectedCompanies.some(tag => problemCompanies.some(c => c.toLowerCase() === tag.toLowerCase()));
        if (matchesTopic && matchesCompany) {
          intersection.total++;
          if (solved) intersection.solved++;
        }
      }
    }

    // Build intersection label: "Array and Google, Amazon"
    function buildIntersectionLabel(topics, companies) {
      const topicPart = topics.length === 1 ? topics[0] : `${topics.slice(0, 2).join(', ')}${topics.length > 2 ? ` +${topics.length - 2}` : ''}`;
      const companyPart = companies.length === 1 ? companies[0] : `${companies.slice(0, 2).join(', ')}${companies.length > 2 ? ` +${companies.length - 2}` : ''}`;
      return `${topicPart} and ${companyPart}`;
    }

    function getExplorerUrl(topics, companies) {
      const base = chrome.runtime.getURL('problems-explorer.html');
      const params = new URLSearchParams();
      if (topics.length > 0) params.set('topics', topics.join(','));
      if (companies.length > 0) params.set('companies', companies.join(','));
      const qs = params.toString();
      return qs ? `${base}?${qs}` : base;
    }

    function getTagUrl(name, type) {
      return type === 'topic' ? getExplorerUrl([name], []) : getExplorerUrl([], [name]);
    }

    function getIntersectionUrl(topics, companies) {
      return getExplorerUrl(topics, companies);
    }

    const CODE_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

    function makeProgressRow(label, solved, total, color, url, nextFn) {
      const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
      const el = document.createElement('div');
      const labelEl = url
        ? `<span class="text-[13px] font-semibold text-[#eff1f6] cursor-pointer hover:text-[#ffa116] transition-colors" data-url="${url}">${label}</span>`
        : `<span class="text-[13px] font-semibold text-[#eff1f6]">${label}</span>`;
      const nextBtn = nextFn
        ? `<button class="next-unsolved-btn cursor-pointer flex-shrink-0 flex items-center justify-center w-5 h-5 rounded text-[#eff1f644] hover:text-[#ffa116] hover:bg-[#ffa1161a] transition-all focus:outline-none" title="Next unsolved">${CODE_ICON}</button>`
        : '';
      el.innerHTML = `
        <div class="flex items-center justify-between mb-2.5">
          ${labelEl}
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] text-[#eff1f699]"><span class="text-[#eff1f6]">${solved}/${total}</span> <span class="font-semibold" style="color:${color}">${pct}%</span></span>
            ${nextBtn}
          </div>
        </div>
        <div class="w-full h-2 bg-[#ffffff1a] rounded-full overflow-hidden">
          <div class="h-2 rounded-full transition-all duration-300 progress-animate" style="width:${pct}%;background-color:${color};"></div>
        </div>
      `;
      if (url) {
        el.querySelector('[data-url]').addEventListener('click', () => {
          chrome.tabs.create({ url });
        });
      }
      if (nextFn) {
        el.querySelector('.next-unsolved-btn').addEventListener('click', async (e) => {
          e.stopPropagation();
          const nextUrl = await nextFn();
          if (nextUrl) chrome.tabs.create({ url: nextUrl });
        });
      }
      return el;
    }

    // Render
    tagProgressList.innerHTML = '';

    if (showIntersection) {
      // Primary: intersection row (the actionable number)
      tagProgressList.appendChild(makeProgressRow(
        buildIntersectionLabel(selectedTopics, selectedCompanies),
        intersection.solved, intersection.total,
        '#eff1f6',
        getIntersectionUrl(selectedTopics, selectedCompanies),
        () => getNextUnsolvedForIntersection(selectedTopics, selectedCompanies)
      ));

      // Accordion toggle
      const totalTags = allTags.length;
      const toggle = document.createElement('button');
      toggle.className = 'tag-accordion-toggle';
      toggle.innerHTML = `<span class="tag-accordion-chevron">▾</span><span>${totalTags} individual tag${totalTags !== 1 ? 's' : ''}</span>`;

      // Accordion body with individual rows (inner wrapper for grid animation)
      const body = document.createElement('div');
      body.className = 'tag-accordion-body';
      const bodyInner = document.createElement('div');
      allTags.forEach(({ name, type }, i) => {
        const indRow = makeProgressRow(name, stats[name].solved, stats[name].total, type === 'topic' ? '#ffa116' : '#00b8a3', getTagUrl(name, type), () => getNextUnsolvedForTag(name, type));
        if (i < allTags.length - 1) indRow.style.marginBottom = '10px';
        bodyInner.appendChild(indRow);
      });
      body.appendChild(bodyInner);

      toggle.addEventListener('click', () => {
        const isOpen = body.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
      });

      tagProgressList.appendChild(toggle);
      tagProgressList.appendChild(body);
    } else {
      // No intersection — just show individual rows
      allTags.forEach(({ name, type }) => {
        tagProgressList.appendChild(
          makeProgressRow(name, stats[name].solved, stats[name].total, type === 'topic' ? '#ffa116' : '#00b8a3', getTagUrl(name, type), () => getNextUnsolvedForTag(name, type))
        );
      });
    }
  }

  // Combobox tag input utility (only valid options can be added)
  function setupTagInput(checkboxEl, sectionEl, tagsContainerEl, textInputEl, dropdownEl, color, saveCallback, validOptions) {
    let tags = [];
    let activeIndex = -1;

    function renderTags() {
      tagsContainerEl.innerHTML = '';
      tags.forEach(tag => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.style.cssText = `background:${color}22; color:${color}; border:1px solid ${color}44;`;
        const text = document.createElement('span');
        text.textContent = tag;
        const btn = document.createElement('button');
        btn.className = 'tag-chip-x';
        btn.textContent = '×';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          tags = tags.filter(t => t !== tag);
          renderTags();
          saveCallback();
        });
        chip.appendChild(text);
        chip.appendChild(btn);
        tagsContainerEl.appendChild(chip);
      });
    }

    function addTag(val) {
      const trimmed = val.trim();
      if (!trimmed) return;
      const match = validOptions.find(o => o.toLowerCase() === trimmed.toLowerCase());
      if (match && !tags.includes(match)) {
        tags.push(match);
        renderTags();
        saveCallback();
      }
      textInputEl.value = '';
      closeDropdown();
    }

    function closeDropdown() {
      dropdownEl.classList.add('hidden');
      dropdownEl.innerHTML = '';
      activeIndex = -1;
    }

    function openDropdown(filtered) {
      dropdownEl.innerHTML = '';
      activeIndex = -1;
      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'combobox-empty';
        empty.textContent = 'No matches';
        dropdownEl.appendChild(empty);
      } else {
        filtered.forEach((opt, i) => {
          const item = document.createElement('div');
          item.className = 'combobox-item';
          item.textContent = opt;
          item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            addTag(opt);
          });
          dropdownEl.appendChild(item);
        });
      }
      dropdownEl.classList.remove('hidden');
    }

    textInputEl.addEventListener('input', () => {
      const q = textInputEl.value.trim().toLowerCase();
      if (!q) { closeDropdown(); return; }
      const filtered = validOptions.filter(o => o.toLowerCase().includes(q) && !tags.includes(o));
      openDropdown(filtered.slice(0, 20));
    });

    textInputEl.addEventListener('keydown', (e) => {
      const items = dropdownEl.querySelectorAll('.combobox-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        items.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
        if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        items.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
        if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          addTag(items[activeIndex].textContent);
        } else if (items.length === 1) {
          addTag(items[0].textContent);
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    textInputEl.addEventListener('blur', () => {
      // Small delay so mousedown on item fires first
      setTimeout(closeDropdown, 150);
    });

    checkboxEl.addEventListener('change', () => {
      sectionEl.classList.toggle('hidden', !checkboxEl.checked);
      saveCallback();
    });

    return {
      getTags: () => [...tags],
      setTags: (newTags) => { tags = Array.isArray(newTags) ? [...newTags] : []; renderTags(); },
      isEnabled: () => checkboxEl.checked,
      setEnabled: (val) => {
        checkboxEl.checked = val;
        sectionEl.classList.toggle('hidden', !val);
      }
    };
  }

  // Initialize tag inputs
  companyTags = setupTagInput(
    document.getElementById('req-company'),
    document.getElementById('company-section'),
    document.getElementById('company-tags'),
    document.getElementById('company-text'),
    document.getElementById('company-dropdown'),
    '#ffa116',
    saveRequirements,
    VALID_COMPANIES
  );
  topicTags = setupTagInput(
    document.getElementById('req-topic'),
    document.getElementById('topic-section'),
    document.getElementById('topic-tags'),
    document.getElementById('topic-text'),
    document.getElementById('topic-dropdown'),
    '#ffa116',
    saveRequirements,
    VALID_TOPICS
  );

  // Save requirements when checkboxes change
  [reqDaily, reqLc75, reqBlind75, reqNc150, reqAny].filter(Boolean).forEach(checkbox => {
    checkbox.addEventListener("change", saveRequirements);
  });

  // Load initial requirements
  chrome.storage.local.get(["requirements", "orModeRequirements"], (result) => {
    const defaults = { dailyChallenge: true, leetcode75: true, blind75: true, neetcode150: true };
    const req = result.requirements || result.orModeRequirements || defaults;

    reqDaily.checked = req.dailyChallenge ?? true;
    reqLc75.checked = req.leetcode75 ?? true;
    reqBlind75.checked = req.blind75 ?? true;
    reqNc150.checked = req.neetcode150 ?? true;
    if (reqAny) reqAny.checked = req.anySubmission || false;

    if (req.companyFocus) companyTags.setEnabled(true);
    if (req.selectedCompanies?.length) companyTags.setTags(req.selectedCompanies);
    if (req.topicFocus) topicTags.setEnabled(true);
    if (req.selectedTopics?.length) topicTags.setTags(req.selectedTopics);

    updateProgressCardVisibility();
    refreshTagProgress();
  });

  // ── Export / Import ────────────────────────────────────────────
  const EXPORT_KEYS = [
    'currentStreak', 'longestStreak', 'lastSolvedDate', 'solvedProblems',
    'completedProblemIds', 'requirements',
    'notificationsEnabled', 'reminderTime', 'badgeStreakEnabled'
  ];

  document.getElementById('export-btn').addEventListener('click', () => {
    chrome.storage.local.get(EXPORT_KEYS, (data) => {
      const json = JSON.stringify({ _leetdaily: true, exportedAt: new Date().toISOString(), ...data }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leetdaily-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  const importFileInput = document.getElementById('import-file');
  document.getElementById('import-btn').addEventListener('click', () => importFileInput.click());

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      alert('Please select a .json file.');
      importFileInput.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum 10 MB.');
      importFileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
      importFileInput.value = '';
    };
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data._leetdaily) { alert('Invalid LeetDaily backup file. Missing _leetdaily marker.'); return; }
        // Validate expected keys
        const { _leetdaily, exportedAt, ...toRestore } = data;
        const validKeys = new Set(EXPORT_KEYS);
        const unknownKeys = Object.keys(toRestore).filter(k => !validKeys.has(k));
        if (unknownKeys.length > 0) {
          console.warn('Import: ignoring unknown keys:', unknownKeys);
          unknownKeys.forEach(k => delete toRestore[k]);
        }
        chrome.storage.local.set(toRestore, () => {
          if (chrome.runtime.lastError) {
            alert('Failed to save imported data: ' + chrome.runtime.lastError.message);
            return;
          }
          alert('Data imported! Reloading…');
          location.reload();
        });
      } catch (err) {
        alert('Could not parse file. Make sure it is a valid LeetDaily JSON export.');
      }
    };
    reader.readAsText(file);
    importFileInput.value = '';
  });

  // ── Streak Detail Modal ─────────────────────────────────────────
  const streakModal = document.getElementById('streak-modal');
  const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365];

  async function openStreakModal() {
    streakModal.classList.remove('hidden');

    const result = await new Promise(resolve =>
      chrome.storage.local.get(['currentStreak', 'longestStreak', 'leetCodeUsername'], resolve)
    );

    const streak = result.currentStreak || 0;
    const longest = result.longestStreak || 0;
    const nextMilestone = STREAK_MILESTONES.find(m => m > streak) || null;

    document.getElementById('modal-streak-num').textContent = streak;
    document.getElementById('modal-longest').textContent = longest;
    document.getElementById('modal-next-milestone').textContent = nextMilestone ? `${nextMilestone} days` : '🏆';

    // Milestone progress bar
    const prevMilestone = [...STREAK_MILESTONES].reverse().find(m => m <= streak) || 0;
    const pct = nextMilestone
      ? Math.round(((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
      : 100;
    document.getElementById('modal-milestone-bar').style.width = `${pct}%`;
    document.getElementById('modal-milestone-pct').textContent = `${pct}%`;
    document.getElementById('modal-milestone-label').textContent = nextMilestone
      ? `${streak} / ${nextMilestone} days`
      : 'All milestones reached!';

    // Last 7 days
    const last7El = document.getElementById('modal-last7');
    last7El.innerHTML = '<span class="text-[11px] text-[#eff1f666]">Loading…</span>';

    const { submissionMap } = await fetchLast30DaysHistory(result.leetCodeUsername || null);
    last7El.innerHTML = '';

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const count = submissionMap.get(dateStr) || 0;
      const isToday = i === 0;
      const dayLabel = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });

      const col = document.createElement('div');
      col.className = 'flex flex-col items-center gap-1';

      const dot = document.createElement('div');
      dot.className = `w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold`;
      if (count > 0) {
        dot.style.cssText = 'background:#2cbb5d22; color:#2cbb5d; border:1px solid #2cbb5d44;';
        dot.textContent = count;
      } else {
        dot.style.cssText = 'background:rgba(255,255,255,0.05); color:rgba(239,241,246,0.2); border:1px solid rgba(255,255,255,0.07);';
        dot.textContent = '–';
      }
      if (isToday) dot.style.outline = '2px solid #ffa116';

      const label = document.createElement('span');
      label.className = 'text-[10px] text-[#eff1f666]';
      label.textContent = dayLabel;

      col.appendChild(dot);
      col.appendChild(label);
      last7El.appendChild(col);
    }
  }

  document.getElementById('streakDisplay').addEventListener('click', openStreakModal);
  document.getElementById('streak-modal-close').addEventListener('click', () => streakModal.classList.add('hidden'));
  streakModal.addEventListener('click', (e) => { if (e.target === streakModal) streakModal.classList.add('hidden'); });
});
