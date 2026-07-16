// Content script that runs on LeetCode pages to detect problem completion

// Debounce to avoid multiple rapid checks
let lastCheck = 0;
const CHECK_COOLDOWN = 5000; // 5 seconds between checks

// The GraphQL endpoint for the domain this page is served from (leetcode.com or
// leetcode.cn). Using the page's own host guarantees we query the account the
// user is actually logged into for this tab.
function leetcodeGraphqlEndpoint() {
  const host = window.location.hostname.endsWith('leetcode.cn')
    ? 'leetcode.cn'
    : 'leetcode.com';
  return `https://${host}/graphql`;
}

// Safe sendMessage wrapper (extension context may be invalidated on update)
function safeSendMessage(msg) {
  try {
    chrome.runtime.sendMessage(msg);
  } catch (err) {
    // Extension context invalidated (e.g. after update) - silently ignore
  }
}

// Notify background to start loading blink
function notifyLoading() {
  safeSendMessage({ action: "startLoadingBlink" });
}

// Notify background to stop loading blink
function notifyLoadingDone() {
  safeSendMessage({ action: "stopLoadingBlink" });
}

// isLoadingActive tracks if we started a loading blink that needs cleanup
let isLoadingActive = false;

// Extract problem titleSlug from current URL
function getProblemSlugFromURL() {
  const match = window.location.href.match(/leetcode\.(?:com|cn)\/problems\/([^/?]+)/);
  return match ? match[1] : null;
}

// Cached problem data map (loaded once, reused)
let _problemDataMap = null;

// Load problem metadata from local JSON (with cache)
async function getProblemMetadata(titleSlug) {
  try {
    if (!_problemDataMap) {
      const response = await fetch(chrome.runtime.getURL('data/leetcode-problems.json'));
      const data = await response.json();
      _problemDataMap = new Map();
      for (const p of data.problems) {
        _problemDataMap.set(p.titleSlug, p);
      }
    }

    const problem = _problemDataMap.get(titleSlug);
    if (!problem) {
      console.log(`Problem not found in local data: ${titleSlug}`);
      return null;
    }

    return {
      id: problem.id,
      titleSlug: problem.titleSlug,
      title: problem.title,
      difficulty: problem.difficulty,
      topics: (problem.topics || []).map(t => typeof t === 'string' ? t : t.name),
      companies: problem.companies || [],
      companyFrequency: problem.companyFrequency || {}
    };
  } catch (error) {
    console.error('Failed to load problem metadata:', error);
    return null;
  }
}

async function checkAndNotifyCompletion() {
  const now = Date.now();
  if (now - lastCheck < CHECK_COOLDOWN) return;
  lastCheck = now;

  try {
    const response = await fetch(leetcodeGraphqlEndpoint(), {
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

    // Check if "Any submission" is enabled
    const stored = await new Promise(resolve => {
      chrome.storage.local.get(['requirements', 'orModeRequirements'], resolve);
    });
    const reqs = stored.requirements || stored.orModeRequirements || {};
    const anySubmissionEnabled = reqs.anySubmission === true;

    // Update streak and user info from API
    safeSendMessage({
      action: "problemSolved",
      data: {
        streak: streakData?.streakCount || 0,
        username: userStatus.username,
        avatar: userStatus.avatar,
        completedToday: completedToday || anySubmissionEnabled
      }
    });
    isLoadingActive = false;
  } catch (error) {
    // Silently fail, but stop loading if it was started
    if (isLoadingActive) {
      notifyLoadingDone();
      isLoadingActive = false;
    }
  }
}

// Notify individual problem solution to background
async function notifyIndividualProblemSolved() {
  const titleSlug = getProblemSlugFromURL();
  if (!titleSlug) {
    console.log('No problem slug found in URL');
    return;
  }

  // Get problem metadata from local JSON
  const metadata = await getProblemMetadata(titleSlug);
  if (!metadata) {
    console.log('No metadata found for problem');
    return;
  }

  // Send to background script
  safeSendMessage({
    action: "individualProblemSolved",
    data: {
      problemId: metadata.id,
      titleSlug: metadata.titleSlug,
      title: metadata.title,
      difficulty: metadata.difficulty,
      topics: metadata.topics,
      companies: metadata.companies,
      companyFrequency: metadata.companyFrequency,
      solvedAt: new Date().toISOString()
    }
  });

  console.log('✅ Individual problem solved notification sent:', metadata.title);
}

// Always trigger badge update on accepted submission
// The background script handles checking if it matches focus areas.
// delayMs: how long to wait before hitting the API (longer for the raw
// submit-click fallback, which fires before LeetCode has judged the run).
async function checkIfDailyAndUpdate(delayMs = 2000) {
  const titleSlug = getProblemSlugFromURL();
  if (!titleSlug) return;

  // Always start loading blink — gives immediate "something happened" feedback;
  // background will resolve the badge to the correct value.
  if (!isLoadingActive) {
    isLoadingActive = true;
    notifyLoading();
  }
  // Small delay to let LeetCode's backend update
  setTimeout(() => checkAndNotifyCompletion(), delayMs);
}

// Shared trigger guard so the DOM observer and the submit-click fallback don't
// double-fire for the same submission.
let solveHandled = false;
function handleAcceptedSubmission() {
  if (solveHandled) return;
  solveHandled = true;

  // Record the problem solve (silent, no badge blink)
  notifyIndividualProblemSolved();
  // Check if this is the daily challenge — blink badge + refresh streak
  checkIfDailyAndUpdate();

  // Reset trigger after 10 seconds to allow for the next submission
  setTimeout(() => { solveHandled = false; }, 10000);
}

// Detect an "Accepted" result in a chunk of text. Deliberately loose: LeetCode
// renders the result panel differently across redesigns and locales, and the
// "Accepted" label may land in a different DOM node than "Runtime"/"Memory".
// We match "Accepted" plus ANY nearby result-panel signal, and also accept the
// localized 通过 used on leetcode.cn.
function looksAccepted(text) {
  if (!text) return false;
  // leetcode.cn localized "Accepted"
  if (text.includes('通过') && !text.includes('未通过') && !text.includes('不通过')) return true;
  if (!text.includes('Accepted')) return false;
  // Guard against "Wrong Answer"/editorial text that merely contains the word:
  // require a result-panel companion signal somewhere in the same text.
  return /Runtime|Memory|testcase|test case|ms\b|MB\b|beats|通过/.test(text);
}

// Listen for submission results by watching for success indicators
function observeSubmissionResults() {
  // Watch for DOM changes that indicate submission success
  const observer = new MutationObserver((mutations) => {
    if (solveHandled) return;

    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE) {
            continue;
          }
          if (looksAccepted(node.textContent || '')) {
            handleAcceptedSubmission();
            break;
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// FALLBACK: if the DOM text-scrape ever misses (LeetCode redesign, localized
// panel, result rendered in a way our matcher doesn't catch), a click on the
// Submit button still kicks off a background re-check. This does NOT assume the
// submission was accepted — checkAndNotifyCompletion() asks the API for the
// real streak/completion status, so a wrong answer simply results in no change.
function watchSubmitButton() {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    // LeetCode's submit control: a button whose text is "Submit", or
    // data-e2e-locator="console-submit-button" across their variants.
    const btn = target.closest('button, a');
    if (!btn) return;
    const label = (btn.textContent || '').trim().toLowerCase();
    const locator = btn.getAttribute('data-e2e-locator') || '';
    const isSubmit = locator.includes('submit') ||
      (label === 'submit' || label === '提交');
    if (!isSubmit) return;

    // Start the pulsate immediately for feedback, then (after LeetCode has had
    // time to judge the run) let the API tell us the real streak/completion.
    // Safe on a wrong answer: checkAndNotifyCompletion reads authoritative
    // status from the API and changes nothing if the solve didn't count.
    checkIfDailyAndUpdate(6000);
  }, true); // capture phase — fires even if LeetCode stops propagation
}

// Start observing for submission results
if (document.body) {
  observeSubmissionResults();
  watchSubmitButton();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    observeSubmissionResults();
    watchSubmitButton();
  });
}
