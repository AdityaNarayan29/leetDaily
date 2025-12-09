function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

let blinkInterval = null;
let blinkVisible = true;

function getTimeUntilMidnightUTC() {
  const now = new Date();
  const nextUTC = new Date(now);
  nextUTC.setUTCHours(24, 0, 0, 0);
  return nextUTC - now;
}

function startBlinking() {
  if (blinkInterval) return; // Already blinking

  blinkVisible = true;
  blinkInterval = setInterval(() => {
    blinkVisible = !blinkVisible;
    if (blinkVisible) {
      chrome.action.setBadgeText({ text: " " });
      chrome.action.setBadgeBackgroundColor({ color: "#ff0000" });
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
    // Clear badge text when stopping to ensure clean state
    chrome.action.setBadgeText({ text: "" });
  }
}

function updateBadge() {
  chrome.storage.local.get(["lastVisitedDate"], (result) => {
    if (!result) return;

    const today = getTodayDate();
    const timeLeft = getTimeUntilMidnightUTC();
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    // If already visited today, clear badge and stop blinking
    if (result.lastVisitedDate === today) {
      stopBlinking();
      chrome.action.setBadgeText({ text: "" });
    }
    // If not visited and less than 2 hours left, start blinking
    else if (timeLeft <= twoHoursInMs) {
      startBlinking();
    }
    // If not visited but more than 2 hours left, show normal orange badge
    else {
      stopBlinking();
      chrome.action.setBadgeText({ text: " " });
      chrome.action.setBadgeBackgroundColor({ color: "#ff5511" });
    }
  });
}

updateBadge();
setInterval(updateBadge, 60 * 1000); // Check every minute instead of every hour

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
});
