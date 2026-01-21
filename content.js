// Content script that runs on LeetCode pages to detect problem completion

// Debounce to avoid multiple rapid checks
let lastCheck = 0;
const CHECK_COOLDOWN = 5000; // 5 seconds between checks

// Notify background to start loading blink
function notifyLoading() {
  chrome.runtime.sendMessage({ action: "startLoadingBlink" });
}

// Notify background to stop loading blink
function notifyLoadingDone() {
  chrome.runtime.sendMessage({ action: "stopLoadingBlink" });
}

// isLoadingActive tracks if we started a loading blink that needs cleanup
let isLoadingActive = false;

async function checkAndNotifyCompletion() {
  const now = Date.now();
  if (now - lastCheck < CHECK_COOLDOWN) return;
  lastCheck = now;

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

    if (!userStatus?.isSignedIn) {
      if (isLoadingActive) {
        notifyLoadingDone();
        isLoadingActive = false;
      }
      return;
    }

    const streakData = data?.data?.streakCounter;
    const dailyStatus = data?.data?.activeDailyCodingChallengeQuestion?.userStatus;
    const completedToday = dailyStatus === "Finish";

    if (completedToday) {
      // Send message to background script to update badge (this also stops loading)
      chrome.runtime.sendMessage({
        action: "problemSolved",
        data: {
          streak: streakData?.streakCount || 0,
          username: userStatus.username,
          avatar: userStatus.avatar
        }
      });
      isLoadingActive = false;
    } else if (isLoadingActive) {
      // API didn't confirm yet, stop the loading blink
      notifyLoadingDone();
      isLoadingActive = false;
    }
  } catch (error) {
    // Silently fail, but stop loading if it was started
    if (isLoadingActive) {
      notifyLoadingDone();
      isLoadingActive = false;
    }
  }
}

// Listen for submission results by watching for success indicators
function observeSubmissionResults() {
  let hasTriggered = false;

  // Watch for DOM changes that indicate submission success
  const observer = new MutationObserver((mutations) => {
    // Prevent multiple triggers from the same submission
    if (hasTriggered) return;

    for (const mutation of mutations) {
      // Check for "Accepted" text appearing in the DOM
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          // Only check text nodes and element nodes
          if (node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE) {
            continue;
          }

          const text = node.textContent || '';

          // Look for "Accepted" in submission result context
          // LeetCode shows this in the result panel after submission
          if (text.includes('Accepted') &&
              (text.includes('Runtime') || text.includes('Memory') || text.includes('testcase'))) {
            hasTriggered = true;

            // Start loading blink immediately, then check API after delay
            isLoadingActive = true;
            notifyLoading();

            // Small delay to let LeetCode's backend update
            setTimeout(() => {
              checkAndNotifyCompletion();
              // Reset trigger after 10 seconds to allow for next submission
              setTimeout(() => { hasTriggered = false; }, 10000);
            }, 2000);

            break;
          }
        }
      }
    }
  });

  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Start observing for submission results
if (document.body) {
  observeSubmissionResults();
} else {
  document.addEventListener("DOMContentLoaded", observeSubmissionResults);
}
