function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
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
  chrome.storage.local.get(["streak"], (result) => {
    const streak = String(result.streak || 0);
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
  chrome.storage.local.get(["lastVisitedDate", "streak", "badgeStreakEnabled"], (result) => {
    if (!result) return;

    const badgeEnabled = result.badgeStreakEnabled !== false; // Default to true
    const today = getTodayDate();
    const timeLeft = getTimeUntilMidnightUTC();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const streak = result.streak || 0;

    // Colors - bright text on dark bg
    const darkBg = "#1a1a1a"; // Dark background matching extension
    const greenColor = "#4ade80"; // Bright green
    const orangeColor = "#fbbf24"; // Bright amber/orange
    const redColor = "#f87171"; // Bright red

    // If already visited today, show green (solved)
    if (result.lastVisitedDate === today) {
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
    // If not visited and less than 2 hours left, BLINK red
    else if (timeLeft <= twoHoursInMs) {
      if (badgeEnabled) {
        // Dark bg with red text, blinking
        startBlinking(String(streak), redColor, darkBg);
      } else {
        // Colored bg with space, blinking
        startBlinking(" ", "#FFFFFF", redColor);
      }
    }
    // If not visited but more than 2 hours left, show orange (pending)
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
    chrome.storage.local.get(["lastVisitedDate", "lastUrgentNotification", "leetCodeUsername", "streak"], (result) => {
      const today = getTodayDate();
      // Only show if not visited today and haven't shown urgent notification today
      if (result.lastVisitedDate !== today && result.lastUrgentNotification !== today) {
        const firstName = result.leetCodeUsername
          ? result.leetCodeUsername.split(/[^a-zA-Z]/)[0]
          : null;
        const streak = result.streak || 0;
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
    chrome.notifications.create(notificationId, {
      type: "basic",
      iconUrl: "icon.png",
      title,
      message,
      priority: type === "urgent" ? 2 : 1
    });
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
    chrome.storage.local.get(["lastVisitedDate", "leetCodeUsername"], (result) => {
      const today = getTodayDate();
      if (result.lastVisitedDate !== today) {
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
});
