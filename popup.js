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
              avatar
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

function renderQuestion(question) {
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
      headerSubtitle.textContent = "LeetCode Daily";
    } else {
      loginPrompt.classList.remove("hidden");
      statsPanel.classList.add("hidden");

      // Show logo, hide avatar
      avatar.classList.add("hidden");
      logo.classList.remove("hidden");

      // Reset header text
      headerTitle.textContent = "LeetCode Daily";
      headerSubtitle.textContent = "Daily Challenge Tracker";
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

  // Notification toggle
  const notifToggle = document.getElementById("toggle-notifications");
  const notifDot = document.getElementById("notif-toggle-dot");

  function updateNotificationToggleUI(enabled) {
    if (enabled) {
      notifToggle.classList.remove("bg-[#ffffff1a]");
      notifToggle.classList.add("bg-[#2cbb5d]");
      notifDot.classList.add("translate-x-4");
    } else {
      notifToggle.classList.add("bg-[#ffffff1a]");
      notifToggle.classList.remove("bg-[#2cbb5d]");
      notifDot.classList.remove("translate-x-4");
    }
  }

  // Load initial notification state
  chrome.storage.local.get(["notificationsEnabled"], (result) => {
    // Default to enabled if not set
    const enabled = result.notificationsEnabled !== false;
    updateNotificationToggleUI(enabled);
  });

  notifToggle.addEventListener("click", () => {
    chrome.storage.local.get(["notificationsEnabled"], (result) => {
      const currentState = result.notificationsEnabled !== false;
      const newState = !currentState;

      chrome.storage.local.set({ notificationsEnabled: newState }, () => {
        updateNotificationToggleUI(newState);
      });
    });
  });

  // Uncomment to test undo
  // document.getElementById("resetVisit").addEventListener("click", () => {
  //   chrome.runtime.sendMessage({ action: "undoVisitToday" }, () => location.reload());
  // });
});
