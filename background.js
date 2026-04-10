// Import sync utilities for cross-device preference syncing
importScripts('sync.js');

// Set uninstall feedback URL
chrome.runtime.setUninstallURL('https://leetdaily.masst.dev/uninstall');

// Helper for LeetCode GraphQL requests
async function leetcodeFetch(body) {
  return fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body)
  });
}

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
    const [lc75Response, blind75Response, nc150Response, namasteResponse] = await Promise.all([
      fetch(chrome.runtime.getURL('data/leetcode75.json')),
      fetch(chrome.runtime.getURL('data/blind75.json')),
      fetch(chrome.runtime.getURL('data/neetcode150.json')),
      fetch(chrome.runtime.getURL('data/namastedsa.json')),
      fetch(chrome.runtime.getURL('data/frazdsa.json'))
    ]);

    const [lc75Data, blind75Data, nc150Data, namasteData, frazData] = await Promise.all([
      lc75Response.json(),
      blind75Response.json(),
      nc150Response.json(),
      namasteResponse.json(),
      frazResponse.json()
    ]);

    const lc75Ids = new Set();
    const blind75Ids = new Set();
    const nc150Ids = new Set();
    const namasteIds = new Set();
    const frazIds = new Set();

    lc75Data.categories?.forEach(cat => cat.problemIds?.forEach(id => lc75Ids.add(id)));
    blind75Data.categories?.forEach(cat => cat.problemIds?.forEach(id => blind75Ids.add(id)));
    nc150Data.categories?.forEach(cat => cat.problemIds?.forEach(id => nc150Ids.add(id)));
    namasteData.categories?.forEach(cat => cat.problemIds?.forEach(id => namasteIds.add(id)));
    frazData.categories?.forEach(cat => cat.problemIds?.forEach(id => frazIds.add(id)));

    curatedListsCache = { lc75Ids, blind75Ids, nc150Ids, namasteIds, frazIds };
    return curatedListsCache;
  } catch (error) {
    console.error('Failed to load curated lists:', error);
    return { lc75Ids: new Set(), blind75Ids: new Set(), nc150Ids: new Set(), namasteIds: new Set(), frazIds: new Set() };
  }
}

async function getProblemListMembership(problemId) {
  const lists = await loadCuratedLists();
  return {
    leetcode75: lists.lc75Ids.has(problemId),
    blind75: lists.blind75Ids.has(problemId),
    neetcode150: lists.nc150Ids.has(problemId),
    namastedsa: lists.namasteIds.has(problemId),
    frazdsa: lists.frazIds.has(problemId)
  };
}

// Check if a day's solved problems meet the given requirements (OR mode)
function meetsRequirements(problemsOnDay, reqs) {
  if (!reqs) return problemsOnDay.length > 0;

  const hasAnyReq = reqs.anySubmission ||
    reqs.dailyChallenge ||
    reqs.leetcode75 ||
    reqs.blind75 ||
    reqs.neetcode150 ||
    reqs.namastedsa ||
    reqs.frazdsa ||
    (reqs.companyFocus && reqs.selectedCompanies?.length > 0) ||
    (reqs.topicFocus && reqs.selectedTopics?.length > 0);

  if (!hasAnyReq) return problemsOnDay.length > 0;

  if (reqs.anySubmission && problemsOnDay.length > 0) return true;
  if (reqs.dailyChallenge && problemsOnDay.some(p => p.isDailyChallenge)) return true;
  if (reqs.leetcode75 && problemsOnDay.some(p => p.inLists?.leetcode75)) return true;
  if (reqs.blind75 && problemsOnDay.some(p => p.inLists?.blind75)) return true;
  if (reqs.neetcode150 && problemsOnDay.some(p => p.inLists?.neetcode150)) return true;
  if (reqs.namastedsa && problemsOnDay.some(p => p.inLists?.namastedsa)) return true;
  if (reqs.frazdsa && problemsOnDay.some(p => p.inLists?.frazdsa)) return true;

  if (reqs.companyFocus && reqs.selectedCompanies?.length > 0) {
    const companies = reqs.selectedCompanies.map(c => c.toLowerCase());
    if (problemsOnDay.some(p => p.companies?.some(c => companies.includes(c.toLowerCase())))) return true;
  }
  if (reqs.topicFocus && reqs.selectedTopics?.length > 0) {
    const topics = reqs.selectedTopics.map(t => t.toLowerCase());
    if (problemsOnDay.some(p => p.topics?.some(t => topics.includes(t.toLowerCase())))) return true;
  }
  return false;
}

// Calculate focus streak with streak freezes (3 per month)
// frozenDates: array of date strings where freezes were used
function calculateFocusStreak(solvedProblems, requirements, frozenDates = []) {
  if (!solvedProblems || Object.keys(solvedProblems).length === 0) {
    return { focusStreak: 0, focusGoalMetToday: false, newFrozenDates: frozenDates };
  }

  // Group by date
  const solvedByDate = {};
  for (const [, data] of Object.entries(solvedProblems)) {
    if (!data.solvedAt) continue;
    const date = data.solvedAt.slice(0, 10);
    if (!solvedByDate[date]) solvedByDate[date] = [];
    solvedByDate[date].push(data);
  }

  const today = getTodayDate();
  const frozenSet = new Set(frozenDates);
  const newFrozenDates = [...frozenDates];

  // Count freezes used per month
  function freezesUsedInMonth(dateStr) {
    const month = dateStr.slice(0, 7); // "YYYY-MM"
    return newFrozenDates.filter(d => d.slice(0, 7) === month).length;
  }

  let focusStreak = 0;
  let date = new Date();

  while (true) {
    const dateStr = date.toISOString().slice(0, 10);
    const problemsOnDay = solvedByDate[dateStr] || [];
    const met = meetsRequirements(problemsOnDay, requirements);

    if (met) {
      focusStreak++;
    } else if (dateStr === today) {
      // Today not yet met — skip, don't break streak
      date.setDate(date.getDate() - 1);
      continue;
    } else if (frozenSet.has(dateStr)) {
      // Already frozen — streak preserved but not incremented
    } else if (freezesUsedInMonth(dateStr) < 3) {
      // Auto-apply freeze
      frozenSet.add(dateStr);
      newFrozenDates.push(dateStr);
      // Streak preserved but not incremented
    } else {
      // No freeze available — streak breaks
      break;
    }
    date.setDate(date.getDate() - 1);
  }

  // Check if today's goal is met
  const todayProblems = solvedByDate[today] || [];
  const focusGoalMetToday = meetsRequirements(todayProblems, requirements);

  return { focusStreak, focusGoalMetToday, newFrozenDates };
}

// Fetch current streak directly from LeetCode API (source of truth)
async function fetchStreakFromLeetCode() {
  try {
    const response = await leetcodeFetch({
      query: `
        query globalData {
          userStatus {
            isSignedIn
          }
          streakCounter {
            streakCount
          }
        }
      `
    });
    const data = await response.json();
    if (!data?.data?.userStatus?.isSignedIn) return null;
    return data?.data?.streakCounter?.streakCount || 0;
  } catch (e) {
    console.log('Failed to fetch streak from LeetCode:', e.message);
    return null;
  }
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
      'completedProblemIds',
      'requirements',
      'orModeRequirements'
    ], async (result) => {
      const solvedProblems = result.solvedProblems || {};
      const completedProblemIds = result.completedProblemIds || [];
      const reqs = result.requirements || result.orModeRequirements || {};

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

      const solveDate = problemData.solvedAt.slice(0, 10);
      const topicStreaks = calculateTopicStreaks(solvedProblems);
      const companyStreaks = calculateCompanyStreaks(solvedProblems);

      // Fetch streak from LeetCode API (source of truth)
      const apiStreak = await fetchStreakFromLeetCode();
      const currentStreak = apiStreak !== null ? apiStreak : 0;

      // Always mark lastSolvedDate — badge color uses focusGoalMetToday for focus mode
      const storageData = {
        solvedProblems,
        completedProblemIds,
        currentStreak,
        lastSolvedDate: solveDate,
        topicStreaks,
        companyStreaks
      };
      chrome.storage.local.set(storageData, () => {
        console.log('✅ Streaks updated:', { currentStreak });
        resolve({ currentStreak });
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
    // Guard against race: if stopLoadingBlink was called while waiting for storage
    if (!isLoadingBlink) return;

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
    "badgeStreakEnabled",
    "badgeDisplay",
    "solvedProblems",
    "requirements",
    "orModeRequirements",
    "frozenDates"
  ], (result) => {
    if (!result) return;

    const badgeEnabled = result.badgeStreakEnabled !== false;
    const badgeDisplay = result.badgeDisplay || 'leetcode';
    const today = getTodayDate();
    const timeLeft = getTimeUntilMidnightUTC();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const lcStreak = result.currentStreak || 0;
    const lastSolved = result.lastSolvedDate || null;

    // Recalculate focus streak with freezes
    const reqs = result.requirements || result.orModeRequirements || null;
    const { focusStreak, focusGoalMetToday, newFrozenDates } = calculateFocusStreak(
      result.solvedProblems || {}, reqs, result.frozenDates || []
    );

    // Save focus values and updated frozen dates
    chrome.storage.local.set({ focusStreak, focusGoalMetToday, frozenDates: newFrozenDates });

    // Decide which streak to show on badge
    const useFocus = badgeDisplay === 'focus';
    const streak = useFocus ? focusStreak : lcStreak;
    const solvedToday = useFocus ? focusGoalMetToday : (lastSolved === today);

    // Colors
    const darkBg = "#1a1a1a";
    const greenColor = "#00b8a3";
    const orangeColor = "#fbbf24";
    const redColor = "#f87171";

    if (solvedToday) {
      stopBlinking();
      if (badgeEnabled) {
        chrome.action.setBadgeBackgroundColor({ color: darkBg });
        chrome.action.setBadgeTextColor({ color: greenColor });
        chrome.action.setBadgeText({ text: String(streak) });
      } else {
        // No number, just green color indicator
        chrome.action.setBadgeBackgroundColor({ color: greenColor });
        chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
        chrome.action.setBadgeText({ text: " " });
      }
    }
    else if (timeLeft <= twoHoursInMs) {
      if (badgeEnabled) {
        startBlinking(String(streak), redColor, darkBg);
      } else {
        startBlinking(" ", "#FFFFFF", redColor);
      }
    }
    else {
      stopBlinking();
      if (badgeEnabled) {
        chrome.action.setBadgeBackgroundColor({ color: darkBg });
        chrome.action.setBadgeTextColor({ color: orangeColor });
        chrome.action.setBadgeText({ text: String(streak) });
      } else {
        // No number, just orange color indicator
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
    const today = getTodayDate();

    // Always fetch from LeetCode API to keep streak in sync
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

    // Only proceed if user is signed in
    if (!userStatus?.isSignedIn) {
      return;
    }

    const streakData = data?.data?.streakCounter;
    const dailyStatus = data?.data?.activeDailyCodingChallengeQuestion?.userStatus;
    const completedToday = dailyStatus === "Finish";

    const currentStreak = streakData?.streakCount || 0;

    if (completedToday) {
      // Update storage with completion status and streak from LeetCode API
      await chrome.storage.local.set({
        lastVisitedDate: today,
        lastSolvedDate: today,
        currentStreak,
        leetCodeUsername: userStatus.username,
        leetCodeAvatar: userStatus.avatar
      });

      // Immediately update badge
      updateBadge();
    } else {
      // Even if not completed today, update streak from API
      await chrome.storage.local.set({
        currentStreak,
        leetCodeUsername: userStatus.username,
        leetCodeAvatar: userStatus.avatar
      });
      updateBadge();
    }
  } catch (error) {
    // Silently fail - user might not be on leetcode.com or network issues
    console.log("LeetCode API check failed:", error.message);
  }
}

// Sync streak from LeetCode API immediately on service worker startup
checkLeetCodeCompletion();
updateBadge();

// Use chrome.alarms instead of setInterval (MV3 service workers get killed, killing setInterval)
chrome.alarms.create("leetcodeApiPoll", { periodInMinutes: 5 });
chrome.alarms.create("badgeUpdate", { periodInMinutes: 1 });

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
  leetcodeFetch({
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

  // API poll — replaces setInterval which dies when service worker sleeps
  if (alarm.name === "leetcodeApiPoll") {
    checkLeetCodeCompletion();
  }

  // Badge update — replaces setInterval
  if (alarm.name === "badgeUpdate") {
    updateBadge();
    checkUrgentReminder();
  }
});

// Setup reminders on extension load with stored time
chrome.storage.local.get(["reminderTime"], (result) => {
  const time = (result && result.reminderTime) || "10:00";
  setupDailyReminder(time);
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "updateBadge") {
    updateBadge();
    sendResponse({ success: true });
    return true;
  }

  if (request.action === "recalculateStreak") {
    // Fetch streak from LeetCode API (source of truth)
    fetchStreakFromLeetCode().then(apiStreak => {
      const currentStreak = apiStreak !== null ? apiStreak : (request.data?.fallbackStreak || 0);
      chrome.storage.local.set({ currentStreak }, () => {
        sendResponse({ currentStreak });
      });
    });
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
    // Update badge with fresh streak from LeetCode API
    const today = getTodayDate();
    const currentStreak = request.data.streak || 0;

    const storageUpdate = {
      lastVisitedDate: today,
      currentStreak,
      leetCodeUsername: request.data.username,
      leetCodeAvatar: request.data.avatar
    };

    // Only mark lastSolvedDate when daily challenge is completed
    if (request.data.completedToday) {
      storageUpdate.lastSolvedDate = today;
    }

    chrome.storage.local.set(storageUpdate).then(() => {
      stopBlinking();
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
        const response = await leetcodeFetch({
            query: `
              query questionOfToday {
                activeDailyCodingChallengeQuestion {
                  question {
                    titleSlug
                  }
                }
              }
            `
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

// On extension install or update, push existing preferences to cloud
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.storage.local.get(['leetCodeUsername'], (result) => {
      if (result.leetCodeUsername) {
        pushPrefs();
      }
    });
  }
});
