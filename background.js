function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
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

setInterval(updateBadge, 1000 * 60 * 60);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "visitedToday") {
    const today = getTodayDate();
    chrome.storage.local.set({ lastVisitedDate: today }, () => {
      chrome.action.setBadgeText({ text: "" });
      sendResponse({ success: true });
    });
    return true;
  }
});
