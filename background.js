function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function updateBadge() {
  chrome.storage.local.get(["lastVisitedDate"], (result) => {
    const today = getTodayDate();

    if (result.lastVisitedDate !== today) {
      chrome.action.setBadgeText({ text: " " });
      chrome.action.setBadgeBackgroundColor({ color: "#ff5511" });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  });
}

updateBadge();
setInterval(updateBadge, 60 * 60 * 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  if (request.action === "visitedToday") {
    chrome.storage.local.get(["lastVisitedDate", "streak"], (result) => {
      let streak = 0;

      if (result.lastVisitedDate === yesterday) {
        streak = (result.streak || 0) + 1;
      } else if (result.lastVisitedDate === today) {
        streak = result.streak || 0;
      } else {
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
