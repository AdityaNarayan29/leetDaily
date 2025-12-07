function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
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
              checkedInToday
            }
            streakCounter {
              streakCount
              daysSkipped
              currentDayCompleted
            }
            activeDailyCodingChallengeQuestion {
              userStatus
            }
          }
        `
      })
    });

    const data = await response.json();
    console.log("LeetCode API response:", data);

    const userStatus = data?.data?.userStatus;
    if (!userStatus?.isSignedIn) {
      return null;
    }

    const streakData = data?.data?.streakCounter;
    const dailyStatus = data?.data?.activeDailyCodingChallengeQuestion?.userStatus;

    // Check if today's daily challenge is completed
    const completedToday = dailyStatus === "Finish" ||
                           streakData?.currentDayCompleted === true ||
                           userStatus?.checkedInToday === true;

    return {
      username: userStatus.username,
      streak: streakData?.streakCount || 0,
      completedToday
    };
  } catch (error) {
    console.error("Failed to fetch LeetCode user data:", error);
    return null;
  }
}

async function fetchDailyChallengeHistory() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

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
        variables: { year, month }
      })
    });

    const data = await response.json();
    const challenges = data?.data?.dailyCodingChallengeV2?.challenges || [];

    // Return dates where userStatus is "Finish"
    const completedDates = challenges
      .filter(c => c.userStatus === "Finish")
      .map(c => c.date);

    // If we're in the first week of the month, also fetch last month's data
    if (now.getDate() <= 7) {
      const lastMonth = month === 1 ? 12 : month - 1;
      const lastYear = month === 1 ? year - 1 : year;

      const lastMonthResponse = await fetch("https://leetcode.com/graphql", {
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
          variables: { year: lastYear, month: lastMonth }
        })
      });

      const lastMonthData = await lastMonthResponse.json();
      const lastMonthChallenges = lastMonthData?.data?.dailyCodingChallengeV2?.challenges || [];

      const lastMonthCompleted = lastMonthChallenges
        .filter(c => c.userStatus === "Finish")
        .map(c => c.date);

      completedDates.push(...lastMonthCompleted);
    }

    return completedDates;
  } catch (error) {
    console.error("Failed to fetch daily challenge history:", error);
    return [];
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
  return data.data.activeDailyCodingChallengeQuestion.question;
}

async function getYesterdayQuestion() {
  // Get yesterday's date in YYYY-MM-DD format
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

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
            }
          }
        }
      }
    `,
    variables: { year, month: yesterday.getMonth() + 1 }
  };

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

async function getTotalSolvedCount() {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: `
          query userProblemsSolved {
            matchedUser(username: "") {
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `
      })
    });

    const data = await response.json();
    const stats = data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const total = stats.find(s => s.difficulty === "All");
    return total?.count || null;
  } catch (error) {
    console.error("Failed to fetch solved count:", error);
    return null;
  }
}

function renderQuestion(question) {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  const chipClass = difficultyColors[question.difficulty] || "";
  const chipHTML = `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${chipClass} ml-2">${question.difficulty}</span>`;

  let acceptanceRate = "N/A";
  try {
    const stats = JSON.parse(question.stats || "{}");
    acceptanceRate = stats.acRate ? parseFloat(stats.acRate).toFixed(2) : "N/A";
  } catch {
    acceptanceRate = "N/A";
  }

  const topicChipClass =
    "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border border-neutral-600 bg-neutral-800 text-neutral-300 cursor-pointer hover:bg-neutral-700 hover:text-white transition-colors";

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
    : '<span class="text-gray-500 dark:text-gray-400">N/A</span>';

  const problemUrl = `https://leetcode.com/problems/${question.titleSlug}`;

  document.getElementById("question").innerHTML = `
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-medium text-neutral-500 uppercase tracking-wide">Problem #${question.questionFrontendId}</span>
      <button id="copy-link" class="text-xs font-medium text-neutral-500 hover:text-white cursor-pointer flex items-center gap-1.5 transition-colors" title="Copy problem link">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span id="copy-text">Copy</span>
      </button>
    </div>
    <h2 class="text-base font-semibold text-white leading-snug">
      ${question.title}${chipHTML}
    </h2>
    <div class="flex items-center justify-between mt-3 text-xs">
      <button id="toggle-topics" class="font-medium text-neutral-400 hover:text-white cursor-pointer transition-colors focus:outline-none">
        Show Topics
      </button>
      <span class="text-neutral-400">
        <span class="font-semibold text-neutral-300">${acceptanceRate}%</span> acceptance
      </span>
    </div>
    <div id="topics-list" class="mt-3 flex-wrap gap-1.5 hidden">
      ${topicsHTML}
    </div>
  `;

  // Copy link button
  document.getElementById("copy-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(problemUrl);
      const copyText = document.getElementById("copy-text");
      copyText.textContent = "Copied!";
      setTimeout(() => {
        copyText.textContent = "Copy";
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
}

document.addEventListener("DOMContentLoaded", async () => {
  const question = await getDailyQuestionSlug();
  renderQuestion(question);

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
        // Visited today - show active streak with checkmark
        const milestoneEmoji = milestone ? ` ${milestone.emoji}` : "";
        streakDisplay.textContent = `🔥 ${streak}${milestoneEmoji} ✓`;
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

  // Sync streak from LeetCode on popup open (fetch from popup since it has cookie access)
  async function syncFromLeetCode() {
    const userData = await fetchLeetCodeUserData();
    if (userData) {
      const today = getTodayDate();
      chrome.storage.local.set({
        streak: userData.streak,
        leetCodeUsername: userData.username,
        lastVisitedDate: userData.completedToday ? today : null,
        lastSyncedAt: Date.now()
      }, () => {
        updateStreakDisplay();
        renderWeeklyCalendar();
        // Notify background to update badge
        chrome.runtime.sendMessage({ action: "updateBadge" });
      });
    }
  }

  syncFromLeetCode();
  updateStreakDisplay();

  // Render weekly calendar from LeetCode API
  async function renderWeeklyCalendar() {
    const calendarEl = document.getElementById("weekly-calendar");
    const today = new Date();

    // Fetch completed dates from LeetCode API
    const completedDatesArray = await fetchDailyChallengeHistory();
    const completedDates = new Set(completedDatesArray);

    const days = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
      const isCompleted = completedDates.has(dateStr);
      const isToday = i === 0;

      days.push(`
        <div class="flex flex-col items-center gap-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wide ${isToday ? 'text-white' : 'text-neutral-500'}">${dayName}</span>
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            isCompleted
              ? 'bg-green-500/20 text-green-400 ring-2 ring-green-500/40'
              : isToday
                ? 'bg-neutral-700 text-white ring-2 ring-neutral-500'
                : 'bg-neutral-800 text-neutral-500'
          }">
            ${isCompleted ? '✓' : date.getDate()}
          </div>
        </div>
      `);
    }

    calendarEl.innerHTML = days.join('');
  }

  renderWeeklyCalendar();

  // Load yesterday's problem
  async function loadYesterdayProblem() {
    const yesterdayData = await getYesterdayQuestion();
    if (yesterdayData) {
      const section = document.getElementById("yesterday-section");
      const link = document.getElementById("yesterday-link");
      link.href = `https://leetcode.com${yesterdayData.link}`;
      link.textContent = yesterdayData.question.title;
      section.classList.remove("hidden");
    }
  }

  loadYesterdayProblem();


  document.getElementById("toggle-topics").addEventListener("click", () => {
    const topicsList = document.getElementById("topics-list");
    const button = document.getElementById("toggle-topics");
    const isHidden = topicsList.classList.contains("hidden");

    if (isHidden) {
      topicsList.classList.remove("hidden");
      topicsList.classList.add("flex");
    } else {
      topicsList.classList.add("hidden");
      topicsList.classList.remove("flex");
    }
    button.textContent = isHidden ? "Hide Topics" : "Show Topics";
  });

  document.getElementById("open").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "visitedToday" }, (response) => {
      chrome.tabs.create({
        url: `https://leetcode.com/problems/${question.titleSlug}`,
      });
      // Update the streak display immediately after visiting
      if (response && response.success) {
        updateStreakDisplay();
      }
    });
  });

  // Uncomment to test undo
  // document.getElementById("resetVisit").addEventListener("click", () => {
  //   chrome.runtime.sendMessage({ action: "undoVisitToday" }, () => location.reload());
  // });
});
