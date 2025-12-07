function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
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
    chrome.storage.local.get(["lastVisitedDate", "streak", "previousLastVisitedDate"], (result) => {
      let streak = result.streak || 0;
      let previousLastVisitedDate = result.lastVisitedDate;

      // If already visited today, keep the current streak (no change)
      if (result.lastVisitedDate === today) {
        streak = result.streak || 1;
        previousLastVisitedDate = result.previousLastVisitedDate || null;
      }
      // If visited yesterday, increment the streak
      else if (result.lastVisitedDate === yesterday) {
        streak = streak + 1;
      }
      // If missed a day or first time, reset to 1
      else {
        streak = 1;
      }

      chrome.storage.local.set({
        lastVisitedDate: today,
        streak,
        previousLastVisitedDate
      }, () => {
        stopBlinking();
        chrome.action.setBadgeText({ text: "" });
        sendResponse({ success: true, streak });
      });
    });

    return true;
  }

  if (request.action === "undoVisitToday") {
    chrome.storage.local.get(["lastVisitedDate", "streak", "previousLastVisitedDate"], (result) => {
      if (result.lastVisitedDate !== today) {
        sendResponse({ success: false, message: "No visit recorded for today" });
        return;
      }

      let streak = result.streak || 0;
      const previousDate = result.previousLastVisitedDate;

      // Restore the previous state
      // If previous visit was yesterday, we're undoing a continuation, so decrement streak
      // If previous visit was not yesterday (or null), we're undoing a fresh start, so streak becomes what it was before
      if (previousDate === yesterday) {
        // User had a streak going, decrement it back
        streak = Math.max(0, streak - 1);
      } else {
        // User started fresh today (streak was reset to 1), restore to 0 or previous value
        streak = Math.max(0, streak - 1);
      }

      chrome.storage.local.set({
        lastVisitedDate: previousDate,
        streak,
        previousLastVisitedDate: null
      }, () => {
        // Trigger badge update based on current state
        updateBadge();
        sendResponse({ success: true, streak });
      });
    });

    return true;
  }

  if (request.action === "getStreakInfo") {
    chrome.storage.local.get(["lastVisitedDate", "streak", "leetCodeUsername"], (result) => {
      sendResponse({
        streak: result.streak || 0,
        lastVisitedDate: result.lastVisitedDate || null,
        visitedToday: result.lastVisitedDate === today,
        leetCodeUsername: result.leetCodeUsername || null
      });
    });
    return true;
  }

  if (request.action === "updateBadge") {
    updateBadge();
    sendResponse({ success: true });
    return true;
  }
});
