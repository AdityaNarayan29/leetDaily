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
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
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
      })
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

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  const data = await response.json();
  const challenge = data.data.activeDailyCodingChallengeQuestion;
  return { ...challenge.question, date: challenge.date };
}

async function getYesterdayQuestion(todayDateString) {
  // Calculate yesterday based on today's daily challenge date (UTC-based from LeetCode)
  const todayDate = new Date(todayDateString + 'T00:00:00Z');
  const yesterday = new Date(todayDate);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const year = yesterday.getUTCFullYear();
  const month = yesterday.getUTCMonth() + 1;
  const day = yesterday.getUTCDate();
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const query = {
    query: `
      query dailyCodingQuestionRecords($year: Int!, $month: Int!) {
        dailyCodingChallengeV2(year: $year, month: $month) {
          challenges {
            date
            link
            question {
              titleSlug
              title
              questionFrontendId
            }
          }
        }
      }
    `,
    variables: { year, month }
  };

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(query),
    });

    const data = await response.json();
    const challenges = data?.data?.dailyCodingChallengeV2?.challenges || [];
    return challenges.find(c => c.date === dateString) || null;
  } catch (error) {
    console.error("Failed to fetch yesterday's question:", error);
    return null;
  }
}

async function fetchUserSolvedStats(username) {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
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
      })
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
      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
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
        })
      });
      const data = await response.json();
      return data?.data?.dailyCodingChallengeV2?.challenges || [];
    };

    // Fetch submission calendar (problems solved per day)
    const fetchSubmissionCalendar = async () => {
      if (!username) return {};
      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
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
        })
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

function renderQuestion(question, companyData = null) {
  // LeetCode's exact difficulty colors
  const difficultyColors = {
    Easy: "text-[#00b8a3]",
    Medium: "text-[#ffc01e]",
    Hard: "text-[#ff375f]",
  };

  const difficultyColor = difficultyColors[question.difficulty] || "text-[#eff1f699]";
  const chipHTML = `<span class="text-[12px] font-medium ${difficultyColor}">${question.difficulty}</span>`;

  let acceptanceRate = "N/A";
  try {
    const stats = JSON.parse(question.stats || "{}");
    acceptanceRate = stats.acRate ? parseFloat(stats.acRate).toFixed(2) : "N/A";
  } catch {
    acceptanceRate = "N/A";
  }

  const topicChipClass =
    "inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#ffffff0d] text-[#eff1f699] cursor-pointer hover:bg-[#ffffff1a] hover:text-[#eff1f6] transition-colors";

  const companyChipClass =
    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#ffa1161a] text-[#ffa116] border border-[#ffa11633]";

  const topicsArray = question.topicTags || [];
  const topicsHTML = topicsArray.length
    ? topicsArray.map(tag => {
      const tagSlug = encodeURIComponent(
        tag.name.toLowerCase()
          .replace(/[ ()]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      );
      return `<span class="${topicChipClass} mr-1 mb-1" data-tag="${tagSlug}">${tag.name}</span>`;
    }).join("")
    : '<span class="text-[#eff1f666]">N/A</span>';

  // Build company tags HTML (show top 5 companies with frequency, expandable)
  let companiesHTML = '';
  if (companyData && companyData.companies && companyData.companies.length > 0) {
    const allCompanies = companyData.companies;
    const topCompanies = allCompanies.slice(0, 5);
    const remainingCompanies = allCompanies.slice(5);

    const makeChip = (company) => {
      const freq = companyData.companyFrequency[company] || 0;
      const freqLabel = freq > 0 ? ` (${freq})` : '';
      return `<span class="${companyChipClass}">${company}${freqLabel}</span>`;
    };

    const topChips = topCompanies.map(makeChip).join('');
    const remainingChips = remainingCompanies.map(makeChip).join('');
    const moreCount = remainingCompanies.length;

    const moreLabel = moreCount > 0
      ? `<button id="toggle-companies" class="text-[10px] text-[#ffa116] hover:text-[#ffb84d] cursor-pointer transition-colors">+${moreCount} more</button>`
      : '';
    const showLessLabel = moreCount > 0
      ? `<button id="show-less-companies" class="text-[10px] text-[#ffa116] hover:text-[#ffb84d] cursor-pointer transition-colors hidden">Show less</button>`
      : '';

    companiesHTML = `
      <div id="companies-section" class="mt-2 pt-2 border-t border-[#ffffff0d]">
        <div class="flex items-center gap-1.5 mb-1.5">
          <svg class="w-3 h-3 text-[#ffa116]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"></path>
            <path d="M9 8h1"></path>
            <path d="M9 12h1"></path>
            <path d="M9 16h1"></path>
            <path d="M14 8h1"></path>
            <path d="M14 12h1"></path>
            <path d="M14 16h1"></path>
            <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
          </svg>
          <span class="text-[11px] text-[#eff1f699]">Asked by companies</span>
        </div>
        <div class="flex flex-wrap gap-1.5 items-center">
          ${topChips}
          <span id="remaining-companies" class="hidden">${remainingChips}</span>
          ${moreLabel}
          ${showLessLabel}
        </div>
      </div>
    `;
  } else {
    // No company data available - show placeholder
    companiesHTML = `
      <div id="companies-section" class="mt-2 pt-2 border-t border-[#ffffff0d]">
        <div class="flex items-center gap-1.5 mb-1.5">
          <svg class="w-3 h-3 text-[#eff1f666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"></path>
            <path d="M9 8h1"></path>
            <path d="M9 12h1"></path>
            <path d="M9 16h1"></path>
            <path d="M14 8h1"></path>
            <path d="M14 12h1"></path>
            <path d="M14 16h1"></path>
            <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
          </svg>
          <span class="text-[11px] text-[#eff1f666]">No company data available</span>
        </div>
      </div>
    `;
  }

  const problemUrl = `https://leetcode.com/problems/${question.titleSlug}`;

  document.getElementById("question").innerHTML = `
    <div class="flex items-start gap-2 mb-2">
      <div class="flex-1 min-w-0">
        <h2 class="text-[14px] font-medium text-[#eff1f6] leading-snug">
          <span class="text-[#eff1f699]">${question.questionFrontendId}.</span> ${question.title}
        </h2>
      </div>
      <button id="copy-link" class="flex-shrink-0 text-[#eff1f666] hover:text-[#ffa116] cursor-pointer transition-colors p-1 -m-1" title="Copy problem link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
    <div class="flex items-center justify-between">
      <button id="toggle-topics" class="text-[12px] text-[#eff1f699] hover:text-[#ffa116] cursor-pointer transition-colors focus:outline-none flex items-center gap-1">
        <svg id="toggle-icon" class="w-3 h-3 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        <span id="toggle-text">Topics</span>
      </button>
      <div class="flex items-center gap-2 text-[12px]">
        ${chipHTML}
        <span class="text-[#eff1f699]">${acceptanceRate}% acceptance</span>
      </div>
    </div>
    <div id="topics-list" class="mt-2 flex-wrap gap-1.5 hidden">
      ${topicsHTML}
    </div>
    ${companiesHTML}
  `;

  // Copy link button
  const copyBtn = document.getElementById("copy-link");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(problemUrl);
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2cbb5d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      setTimeout(() => {
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });

  // Attach topic chip click listener (event delegation)
  const topicsListEl = document.getElementById("topics-list");
  if (topicsListEl) {
    topicsListEl.addEventListener("click", (event) => {
      const target = event.target;
      if (target && target.dataset && target.dataset.tag) {
        const tagSlug = target.dataset.tag;
        window.open(`https://leetcode.com/tag/${tagSlug}/`, "_blank");
      }
    });
  }

  // Toggle companies expand/collapse
  const toggleCompaniesBtn = document.getElementById("toggle-companies");
  const showLessBtn = document.getElementById("show-less-companies");
  const remainingCompanies = document.getElementById("remaining-companies");

  if (toggleCompaniesBtn && remainingCompanies) {
    toggleCompaniesBtn.addEventListener("click", () => {
      remainingCompanies.classList.remove("hidden");
      toggleCompaniesBtn.classList.add("hidden");
      if (showLessBtn) showLessBtn.classList.remove("hidden");
    });
  }

  if (showLessBtn && remainingCompanies) {
    showLessBtn.addEventListener("click", () => {
      remainingCompanies.classList.add("hidden");
      showLessBtn.classList.add("hidden");
      if (toggleCompaniesBtn) toggleCompaniesBtn.classList.remove("hidden");
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const question = await getDailyQuestionSlug();

  // Fetch company data from local JSON and render question with it
  const companyData = await getProblemCompanyData(question.titleSlug);
  renderQuestion(question, companyData);

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
    chrome.storage.local.get(["streak", "lastVisitedDate", "leetCodeUsername"], (result) => {
      const streak = result.streak || 0;
      const today = getTodayDate();
      const streakDisplay = document.getElementById("streakDisplay");
      const username = result.leetCodeUsername;
      const milestone = getStreakMilestone(streak);

      if (result.lastVisitedDate === today) {
        // Visited today - show active streak
        const milestoneEmoji = milestone ? ` ${milestone.emoji}` : "";
        streakDisplay.textContent = `🔥 ${streak}${milestoneEmoji}`;
        streakDisplay.title = milestone
          ? `${milestone.message} ${username ? `(${username})` : ""}`
          : (username ? `Streak active! Synced with LeetCode (${username})` : "Streak active! You've completed today's problem.");
      } else {
        // Not visited today - show pending streak
        streakDisplay.textContent = `🔥 ${streak}`;
        streakDisplay.title = streak > 0
          ? `Streak at risk! Complete today's problem to continue your ${streak}-day streak.`
          : "Start your streak by solving today's problem!";
      }

      // Show milestone celebration banner if applicable
      const milestoneEl = document.getElementById("milestone-banner");
      if (milestoneEl && milestone && result.lastVisitedDate === today) {
        milestoneEl.textContent = `${milestone.emoji} ${milestone.message}`;
        milestoneEl.classList.remove("hidden");
      } else if (milestoneEl) {
        milestoneEl.classList.add("hidden");
      }
    });
  }

  // Update button state based on completion
  function updateButtonState(completedToday) {
    const btn = document.getElementById("open");
    if (completedToday) {
      btn.innerHTML = `<svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Solved`;
      btn.classList.remove("bg-[#ffa116]", "hover:bg-[#ffb84d]");
      btn.classList.add("bg-[#2cbb5d]", "hover:bg-[#34d668]");
    } else {
      btn.textContent = "Solve Challenge";
      btn.classList.remove("bg-[#2cbb5d]", "hover:bg-[#34d668]");
      btn.classList.add("bg-[#ffa116]", "hover:bg-[#ffb84d]");
    }
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
      updateButtonState(userData.completedToday);

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

  // Initialize all data
  syncFromLeetCode();
  updateStreakDisplay();

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

  // Load yesterday's problem
  async function loadYesterdayProblem() {
    const yesterdayData = await getYesterdayQuestion(question.date);
    if (yesterdayData) {
      const section = document.getElementById("yesterday-section");
      const link = document.getElementById("yesterday-link");
      const numSpan = document.getElementById("yesterday-num");
      const titleSpan = document.getElementById("yesterday-title");
      link.href = `https://leetcode.com${yesterdayData.link}`;
      numSpan.textContent = `${yesterdayData.question.questionFrontendId}. `;
      titleSpan.textContent = yesterdayData.question.title;
      section.classList.remove("hidden");
    }
  }

  loadYesterdayProblem();


  document.getElementById("toggle-topics").addEventListener("click", () => {
    const topicsList = document.getElementById("topics-list");
    const toggleIcon = document.getElementById("toggle-icon");
    const toggleText = document.getElementById("toggle-text");
    const isHidden = topicsList.classList.contains("hidden");

    if (isHidden) {
      topicsList.classList.remove("hidden");
      topicsList.classList.add("flex");
      toggleIcon.classList.add("rotate-180");
      toggleText.textContent = "Hide Topics";
    } else {
      topicsList.classList.add("hidden");
      topicsList.classList.remove("flex");
      toggleIcon.classList.remove("rotate-180");
      toggleText.textContent = "Show Topics";
    }
  });

  document.getElementById("open").addEventListener("click", () => {
    chrome.tabs.create({
      url: `https://leetcode.com/problems/${question.titleSlug}`,
    });
  });

  // Settings accordion
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsContent = document.getElementById("settings-content");
  const settingsIcon = document.getElementById("settings-icon");

  settingsToggle.addEventListener("click", () => {
    const isHidden = settingsContent.classList.contains("hidden");
    if (isHidden) {
      settingsContent.classList.remove("hidden");
      settingsIcon.classList.add("rotate-180");
    } else {
      settingsContent.classList.add("hidden");
      settingsIcon.classList.remove("rotate-180");
    }
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
  chrome.storage.local.get(["notificationsEnabled", "reminderTime"], (result) => {
    const enabled = result.notificationsEnabled !== false;
    updateNotificationToggleUI(enabled);

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
});
