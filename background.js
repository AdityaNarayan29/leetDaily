function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

let blinkInterval = null;

function getTimeUntilMidnightUTC() {
  const now = new Date();
  const nextUTC = new Date(now);
  nextUTC.setUTCHours(24, 0, 0, 0);
  return nextUTC - now;
}

function startBlinking() {
  if (blinkInterval) return; // Already blinking

  let isVisible = true;
  blinkInterval = setInterval(() => {
    isVisible = !isVisible;
    if (isVisible) {
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
  }
}

function updateBadge() {
  chrome.storage.local.get(["lastVisitedDate"], (result) => {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  if (request.action === "visitedToday") {
    chrome.storage.local.get(["lastVisitedDate", "streak"], (result) => {
      let streak = 0;

      // If already visited today, keep the current streak
      if (result.lastVisitedDate === today) {
        streak = result.streak || 1;
      }
      // If visited yesterday, increment the streak
      else if (result.lastVisitedDate === yesterday) {
        streak = (result.streak || 0) + 1;
      }
      // If missed a day or first time, reset to 1
      else {
        streak = 1;
      }

      chrome.storage.local.set({ lastVisitedDate: today, streak }, () => {
        chrome.action.setBadgeText({ text: "" });
        sendResponse({ success: true, streak });
      });
    });

    return true;
  }

  if (request.action === "undoVisitToday") {
    chrome.storage.local.get(["lastVisitedDate", "streak"], (result) => {
      let streak = result.streak || 0;
      if (result.lastVisitedDate === today && streak > 0) {
        streak = Math.max(0, streak - 1);
        chrome.storage.local.set({ lastVisitedDate: null, streak }, () => {
          chrome.action.setBadgeText({ text: " " });
          chrome.action.setBadgeBackgroundColor({ color: "#ff5511" });
          sendResponse({ success: true, streak });
        });
      } else {
        sendResponse({ success: false, message: "No visit recorded for today" });
      }
    });

    return true;
  }
});
