function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

// PHASE 3: Enhanced Storage & Streak Logic

// Cache for curated lists
let curatedListsCache = null;

// Load curated lists (LeetCode 75, Blind 75, NeetCode 150)
async function loadCuratedLists() {
  if (curatedListsCache) return curatedListsCache;

  try {
    const [lc75Response, blind75Response, nc150Response] = await Promise.all([
      fetch(chrome.runtime.getURL('data/leetcode75.json')),
      fetch(chrome.runtime.getURL('data/blind75.json')),
      fetch(chrome.runtime.getURL('data/neetcode150.json'))
    ]);

    const [lc75Data, blind75Data, nc150Data] = await Promise.all([
      lc75Response.json(),
      blind75Response.json(),
      nc150Response.json()
    ]);

    // Extract all problem IDs from each list
    const lc75Ids = new Set();
    const blind75Ids = new Set();
    const nc150Ids = new Set();

    lc75Data.categories?.forEach(cat => cat.problemIds?.forEach(id => lc75Ids.add(id)));
    blind75Data.categories?.forEach(cat => cat.problemIds?.forEach(id => blind75Ids.add(id)));
    nc150Data.categories?.forEach(cat => cat.problemIds?.forEach(id => nc150Ids.add(id)));

    curatedListsCache = { lc75Ids, blind75Ids, nc150Ids };
    return curatedListsCache;
  } catch (error) {
    console.error('Failed to load curated lists:', error);
    return { lc75Ids: new Set(), blind75Ids: new Set(), nc150Ids: new Set() };
  }
}

// Check which lists a problem belongs to
async function getProblemListMembership(problemId) {
  const lists = await loadCuratedLists();
  return {
    leetcode75: lists.lc75Ids.has(problemId),
    blind75: lists.blind75Ids.has(problemId),
    neetcode150: lists.nc150Ids.has(problemId)
  };
}

// Calculate streak based on requirements (any selected requirement counts)
function calculateStreak(solvedProblems, requirements = null) {
  if (!solvedProblems || Object.keys(solvedProblems).length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Group problems by date
  const solvedByDate = {};
  for (const [problemId, data] of Object.entries(solvedProblems)) {
    const date = data.solvedAt.slice(0, 10); // YYYY-MM-DD
    if (!solvedByDate[date]) {
      solvedByDate[date] = [];
    }
    solvedByDate[date].push(data);
  }

  // Check if a day meets requirements (any selected requirement counts)
  function meetsRequirements(problemsOnDay) {
    if (!requirements) {
      return problemsOnDay.length > 0;
    }

    if (requirements.anySubmission && problemsOnDay.length > 0) return true;
    if (requirements.dailyChallenge && problemsOnDay.some(p => p.isDailyChallenge)) return true;
    if (requirements.leetcode75 && problemsOnDay.some(p => p.inLists?.leetcode75)) return true;
    if (requirements.blind75 && problemsOnDay.some(p => p.inLists?.blind75)) return true;
    if (requirements.neetcode150 && problemsOnDay.some(p => p.inLists?.neetcode150)) return true;

    if (requirements.companyFocus && requirements.selectedCompanies?.length > 0) {
      const companies = requirements.selectedCompanies.map(c => c.toLowerCase());
      if (problemsOnDay.some(p => p.companies?.some(c => companies.includes(c.toLowerCase())))) return true;
    }

    if (requirements.topicFocus && requirements.selectedTopics?.length > 0) {
      const topics = requirements.selectedTopics.map(t => t.toLowerCase());
      if (problemsOnDay.some(p => p.topics?.some(t => topics.includes(t.toLowerCase())))) return true;
    }

    return false;
  }

  // Calculate current streak (going backwards from today)
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let date = new Date();

  // Check today and go backwards
  while (true) {
    const dateStr = date.toISOString().slice(0, 10);
    const solvedToday = solvedByDate[dateStr] || [];
    const countsForStreak = meetsRequirements(solvedToday);

    if (countsForStreak) {
      currentStreak++;
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      // If it's today and nothing solved yet, don't break the streak
      if (dateStr === getTodayDate()) {
        date.setDate(date.getDate() - 1);
        continue;
      }
      // Streak broken
      break;
    }

    date.setDate(date.getDate() - 1);
  }

  // Calculate longest streak from all historical data
  const allDates = Object.keys(solvedByDate).sort();
  tempStreak = 0;

  for (let i = 0; i < allDates.length; i++) {
    const currentDate = allDates[i];
    const solved = solvedByDate[currentDate];

    if (meetsRequirements(solved)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);

      // Check if next day is consecutive
      if (i < allDates.length - 1) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = nextDate.toISOString().slice(0, 10);
        if (allDates[i + 1] !== nextDateStr) {
          tempStreak = 0;
        }
      }
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

// Calculate topic-specific streaks
function calculateTopicStreaks(solvedProblems) {
  const topicStreaks = {};

  for (const [problemId, data] of Object.entries(solvedProblems)) {
    const topics = data.topics || [];

    for (const topic of topics) {
      if (!topicStreaks[topic]) {
        topicStreaks[topic] = {
          count: 0,
          lastSolved: null,
          problems: []
        };
      }

      topicStreaks[topic].count++;
      topicStreaks[topic].problems.push(problemId);

      if (!topicStreaks[topic].lastSolved || data.solvedAt > topicStreaks[topic].lastSolved) {
        topicStreaks[topic].lastSolved = data.solvedAt;
      }
    }
  }

  return topicStreaks;
}

// Calculate company-specific streaks
function calculateCompanyStreaks(solvedProblems) {
  const companyStreaks = {};

  for (const [problemId, data] of Object.entries(solvedProblems)) {
    const companies = data.companies || [];

    for (const company of companies) {
      if (!companyStreaks[company]) {
        companyStreaks[company] = {
          count: 0,
          lastSolved: null,
          problems: []
        };
      }

      companyStreaks[company].count++;
      companyStreaks[company].problems.push(problemId);

      if (!companyStreaks[company].lastSolved || data.solvedAt > companyStreaks[company].lastSolved) {
        companyStreaks[company].lastSolved = data.solvedAt;
      }
    }
  }

  return companyStreaks;
}

// Update all streaks and storage
async function updateStreaksAndStorage(problemData) {
  // Get list membership for this problem
  const inLists = await getProblemListMembership(problemData.problemId);

  return new Promise((resolve) => {
    chrome.storage.local.get([
      'solvedProblems',
      'requirements',
      'orModeRequirements',
      'completedProblemIds'
    ], (result) => {
      const solvedProblems = result.solvedProblems || {};
      const requirements = result.requirements || result.orModeRequirements || {
        dailyChallenge: true,
        leetcode75: true,
        blind75: true,
        neetcode150: true,
        companyFocus: false,
        selectedCompanies: [],
        topicFocus: false,
        selectedTopics: []
      };
      const completedProblemIds = result.completedProblemIds || [];

      // Add new problem to solved problems
      solvedProblems[problemData.problemId] = {
        solvedAt: problemData.solvedAt,
        difficulty: problemData.difficulty,
        topics: problemData.topics,
        companies: problemData.companies,
        companyFrequency: problemData.companyFrequency,
        isDailyChallenge: problemData.isDailyChallenge || false,
        inLists: inLists,
        titleSlug: problemData.titleSlug,
        title: problemData.title
      };

      // Add to completedProblemIds if not already there
      if (!completedProblemIds.includes(problemData.problemId)) {
        completedProblemIds.push(problemData.problemId);
      }

      // Calculate streaks with current requirements
      const { currentStreak, longestStreak } = calculateStreak(
        solvedProblems,
        requirements
      );
      const topicStreaks = calculateTopicStreaks(solvedProblems);
      const companyStreaks = calculateCompanyStreaks(solvedProblems);

      // Get last solved date
      const lastSolvedDate = problemData.solvedAt.slice(0, 10);

      // Update storage
      chrome.storage.local.set({
        solvedProblems,
        completedProblemIds,
        currentStreak,
        longestStreak,
        lastSolvedDate,
        topicStreaks,
        companyStreaks
      }, () => {
        console.log('✅ Streaks updated:', { currentStreak, longestStreak });
        resolve({ currentStreak, longestStreak });
      });
    });
  });
}

let blinkInterval = null;
let blinkVisible = true;
let currentBlinkText = "";
let isLoadingBlink = false;

function getTimeUntilMidnightUTC() {
  const now = new Date();
  const nextUTC = new Date(now);
  nextUTC.setUTCHours(24, 0, 0, 0);
  return nextUTC - now;
}

function startBlinking(badgeText, textColor, bgColor) {
  // If already blinking with same text, skip
  if (blinkInterval && currentBlinkText === badgeText) return;

  // Stop any existing blink first
  if (blinkInterval) {
    clearInterval(blinkInterval);
  }

  currentBlinkText = badgeText;
  blinkVisible = true;
  chrome.action.setBadgeTextColor({ color: textColor });
  chrome.action.setBadgeBackgroundColor({ color: bgColor });

  blinkInterval = setInterval(() => {
    blinkVisible = !blinkVisible;
    if (blinkVisible) {
      chrome.action.setBadgeText({ text: badgeText });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  }, 500); // Blink every 500ms
}

function stopBlinking() {
  if (blinkInterval) {
    clearInterval(blinkInterval);
    blinkInterval = null;
    blinkVisible = true;
    currentBlinkText = "";
  }
  isLoadingBlink = false;
}

// Loading blink - orange color (LeetCode theme) with streak number
function startLoadingBlink() {
  isLoadingBlink = true;
  const loadingColor = "#fbbf24"; // Orange (LeetCode theme)
  const darkBg = "#1a1a1a";

  // Stop any existing blink first
  if (blinkInterval) {
    clearInterval(blinkInterval);
  }

  // Get current streak to display
  chrome.storage.local.get(["currentStreak"], (result) => {
    const streak = String(result.currentStreak || 0);
    currentBlinkText = streak;
    blinkVisible = true;
    chrome.action.setBadgeTextColor({ color: loadingColor });
    chrome.action.setBadgeBackgroundColor({ color: darkBg });

    blinkInterval = setInterval(() => {
      blinkVisible = !blinkVisible;
      if (blinkVisible) {
        chrome.action.setBadgeText({ text: streak });
      } else {
        chrome.action.setBadgeText({ text: "" });
      }
    }, 300); // Faster blink for loading
  });
}

function stopLoadingBlink() {
  isLoadingBlink = false;
  stopBlinking();
  updateBadge();
}

function updateBadge() {
  chrome.storage.local.get([
    "lastSolvedDate",
    "currentStreak",
    "badgeStreakEnabled"
  ], (result) => {
    if (!result) return;

    const badgeEnabled = result.badgeStreakEnabled !== false; // Default to true
    const today = getTodayDate();
    const timeLeft = getTimeUntilMidnightUTC();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const streak = result.currentStreak || 0;
    const lastSolved = result.lastSolvedDate || null;

    // Colors - bright text on dark bg
    const darkBg = "#1a1a1a"; // Dark background matching extension
    const greenColor = "#4ade80"; // Bright green
    const orangeColor = "#fbbf24"; // Bright amber/orange
    const redColor = "#f87171"; // Bright red

    // If solved today, show green (solved)
    if (lastSolved === today) {
      stopBlinking();
      if (badgeEnabled) {
        // Dark bg with green text
        chrome.action.setBadgeBackgroundColor({ color: darkBg });
        chrome.action.setBadgeTextColor({ color: greenColor });
        chrome.action.setBadgeText({ text: String(streak) });
      } else {
        chrome.action.setBadgeText({ text: "" }); // Hide when solved
      }
    }
    // If not solved and less than 2 hours left, BLINK red
    else if (timeLeft <= twoHoursInMs) {
      if (badgeEnabled) {
        // Dark bg with red text, blinking
        startBlinking(String(streak), redColor, darkBg);
      } else {
        // Colored bg with space, blinking
        startBlinking(" ", "#FFFFFF", redColor);
      }
    }
    // If not solved but more than 2 hours left, show orange (pending)
    else {
      stopBlinking();
      if (badgeEnabled) {
        // Dark bg with orange text
        chrome.action.setBadgeBackgroundColor({ color: darkBg });
        chrome.action.setBadgeTextColor({ color: orangeColor });
        chrome.action.setBadgeText({ text: String(streak) });
      } else {
        // Colored bg with space
        chrome.action.setBadgeBackgroundColor({ color: orangeColor });
        chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
        chrome.action.setBadgeText({ text: " " });
      }
    }
  });
}

// Check LeetCode API for completion status and update storage/badge
async function checkLeetCodeCompletion() {
  try {
    // First check if we already know it's completed today
    const stored = await chrome.storage.local.get(["lastVisitedDate"]);
    const today = getTodayDate();

    // If already marked as completed today, no need to check API
    if (stored.lastVisitedDate === today) {
      return;
    }

    // Fetch from LeetCode API
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

    // Only proceed if user is signed in
    if (!userStatus?.isSignedIn) {
      return;
    }

    const streakData = data?.data?.streakCounter;
    const dailyStatus = data?.data?.activeDailyCodingChallengeQuestion?.userStatus;
    const completedToday = dailyStatus === "Finish";

    if (completedToday) {
      // Update storage with completion status
      await chrome.storage.local.set({
        lastVisitedDate: today,
        streak: streakData?.streakCount || 0,
        leetCodeUsername: userStatus.username,
        leetCodeAvatar: userStatus.avatar
      });

      // Immediately update badge
      updateBadge();
    }
  } catch (error) {
    // Silently fail - user might not be on leetcode.com or network issues
    console.log("LeetCode API check failed:", error.message);
  }
}

updateBadge();
// Check LeetCode API every 5 minutes as fallback (content script handles instant updates)
setInterval(checkLeetCodeCompletion, 5 * 60 * 1000);
// Update badge display every minute (doesn't call API, just updates badge state)
setInterval(updateBadge, 60 * 1000);

// Notification system
function setupDailyReminder(time = "10:00") {
  // Clear existing alarms
  chrome.alarms.clear("dailyReminder");
  chrome.alarms.clear("urgentReminder");

  // Parse time string (HH:MM)
  const [hour, minute] = time.split(":").map(Number);

  // Set up daily reminder at specified time local time
  const now = new Date();
  const reminderTime = new Date(now);
  reminderTime.setHours(hour, minute, 0, 0);

  // If it's past the reminder time, schedule for tomorrow
  if (now > reminderTime) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const delayInMinutes = (reminderTime - now) / (1000 * 60);
  chrome.alarms.create("dailyReminder", {
    delayInMinutes,
    periodInMinutes: 24 * 60 // Repeat daily
  });

  // Set up urgent reminder (2 hours before midnight UTC)
  checkUrgentReminder();
}

function checkUrgentReminder() {
  const timeLeft = getTimeUntilMidnightUTC();
  const twoHoursInMs = 2 * 60 * 60 * 1000;

  if (timeLeft <= twoHoursInMs && timeLeft > 0) {
    chrome.storage.local.get(["lastSolvedDate", "lastUrgentNotification", "leetCodeUsername", "currentStreak"], (result) => {
      const today = getTodayDate();
      // Only show if not solved today and haven't shown urgent notification today
      if (result.lastSolvedDate !== today && result.lastUrgentNotification !== today) {
        const firstName = result.leetCodeUsername
          ? result.leetCodeUsername.split(/[^a-zA-Z]/)[0]
          : null;
        const streak = result.currentStreak || 0;
        const streakText = streak > 0 ? ` Don't lose your ${streak}-day streak!` : "";
        const greeting = firstName ? `${firstName}, ` : "";

        showNotification(
          "LeetDaily - Streak at Risk!",
          `${greeting}Less than 2 hours left!${streakText}`,
          "urgent"
        );
        chrome.storage.local.set({ lastUrgentNotification: today });
      }
    });
  }
}

function showNotification(title, message, type = "reminder") {
  chrome.storage.local.get(["notificationsEnabled"], (result) => {
    // Default to enabled if not set
    if (result.notificationsEnabled === false) return;

    const notificationId = `leetdaily-${type}-${Date.now()}`;
    try {
      chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "icon.png",
        title,
        message,
        priority: type === "urgent" ? 2 : 1
      });
    } catch (err) {
      console.warn('Failed to create notification:', err.message);
    }
  });
}

// Handle notification click - open today's problem
chrome.notifications.onClicked.addListener((notificationId) => {
  // Clear the notification immediately
  chrome.notifications.clear(notificationId);
  // Fetch today's problem and open it
  fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            question {
              titleSlug
            }
          }
        }
      `
    })
  })
    .then(response => response.json())
    .then(data => {
      const slug = data?.data?.activeDailyCodingChallengeQuestion?.question?.titleSlug;
      if (slug) {
        chrome.tabs.create({ url: `https://leetcode.com/problems/${slug}` });
      } else {
        chrome.tabs.create({ url: "https://leetcode.com/problemset/" });
      }
    })
    .catch(() => {
      chrome.tabs.create({ url: "https://leetcode.com/problemset/" });
    });
});

// Handle alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyReminder") {
    chrome.storage.local.get(["lastSolvedDate", "leetCodeUsername"], (result) => {
      const today = getTodayDate();
      if (result.lastSolvedDate !== today) {
        const firstName = result.leetCodeUsername
          ? result.leetCodeUsername.split(/[^a-zA-Z]/)[0]
          : null;
        const greeting = firstName ? `Hey ${firstName}! ` : "";

        showNotification(
          "LeetDaily - Daily Challenge",
          `${greeting}Today's problem is waiting. Keep your streak alive!`
        );
      }
    });
  }
});

// Check urgent reminder every 30 minutes
setInterval(checkUrgentReminder, 30 * 60 * 1000);

// Setup reminders on extension load with stored time
chrome.storage.local.get(["reminderTime"], (result) => {
  const time = result.reminderTime || "10:00";
  setupDailyReminder(time);
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "updateBadge") {
    updateBadge();
    sendResponse({ success: true });
    return true;
  }

  if (request.action === "updateReminderTime") {
    setupDailyReminder(request.time);
    sendResponse({ success: true });
    return true;
  }

  if (request.action === "startLoadingBlink") {
    startLoadingBlink();
    sendResponse({ success: true });
    return true;
  }

  if (request.action === "stopLoadingBlink") {
    stopLoadingBlink();
    sendResponse({ success: true });
    return true;
  }

  if (request.action === "problemSolved") {
    // Instant badge update when content script detects completion
    const today = getTodayDate();
    chrome.storage.local.set({
      lastVisitedDate: today,
      streak: request.data.streak,
      leetCodeUsername: request.data.username,
      leetCodeAvatar: request.data.avatar
    }).then(() => {
      stopBlinking(); // Stop loading blink first
      updateBadge();
    });
    sendResponse({ success: true });
    return true;
  }

  // PHASE 3: Handle individual problem solution
  if (request.action === "individualProblemSolved") {
    (async () => {
      try {
        const problemData = request.data;
        console.log('📝 Individual problem solved:', problemData.title);

        // Check if this is today's daily challenge
        const response = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query questionOfToday {
                activeDailyCodingChallengeQuestion {
                  question {
                    titleSlug
                  }
                }
              }
            `
          })
        });

        const data = await response.json();
        const dailySlug = data?.data?.activeDailyCodingChallengeQuestion?.question?.titleSlug;
        problemData.isDailyChallenge = (problemData.titleSlug === dailySlug);

        // Update streaks and storage
        await updateStreaksAndStorage(problemData);

        // Update badge
        updateBadge();

        console.log('✅ Problem tracked successfully');
        sendResponse({ success: true });
      } catch (error) {
        console.error('❌ Failed to track problem:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Will respond asynchronously
  }

});
