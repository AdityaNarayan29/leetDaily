// LeetDaily Preferences Sync
// Syncs user preferences to/from Cloudflare KV, keyed by LeetCode username.
// Offline-first: local storage is always the source of truth.

// TODO: Replace with your deployed Worker URL
const SYNC_API = 'https://leetdaily-prefs.leetdaily.workers.dev';

const SYNC_KEYS = [
  'requirements',
  'orModeRequirements',
  'notificationsEnabled',
  'reminderTime',
  'badgeStreakEnabled',
  'badgeDisplay',
  'theme'
];

// Get the current LeetCode username from local storage
function getSyncUsername() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['leetCodeUsername'], (result) => {
      resolve(result.leetCodeUsername || null);
    });
  });
}

// Push local preferences to remote KV
async function pushPrefs() {
  try {
    const username = await getSyncUsername();
    if (!username) return;

    const data = await new Promise((resolve) => {
      chrome.storage.local.get(SYNC_KEYS, resolve);
    });

    const response = await fetch(`${SYNC_API}/prefs/${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      await chrome.storage.local.set({ prefsUpdatedAt: result.updatedAt });
      console.log('☁️ Prefs pushed to cloud');
    }
  } catch (error) {
    // Silent fail — local storage is the source of truth
    console.log('☁️ Prefs push failed (offline?):', error.message);
  }
}

// Pull remote preferences from KV and merge if newer
async function pullPrefs() {
  try {
    const username = await getSyncUsername();
    if (!username) return false;

    const response = await fetch(`${SYNC_API}/prefs/${encodeURIComponent(username)}`);

    if (response.status === 404) {
      // No remote prefs yet — push current local to seed
      await pushPrefs();
      return false;
    }

    if (!response.ok) return false;

    const remote = await response.json();
    if (!remote.updatedAt) return false;

    // Compare timestamps — only apply remote if it's newer
    const local = await new Promise((resolve) => {
      chrome.storage.local.get(['prefsUpdatedAt'], resolve);
    });

    const localTime = local.prefsUpdatedAt ? new Date(local.prefsUpdatedAt).getTime() : 0;
    const remoteTime = new Date(remote.updatedAt).getTime();

    if (remoteTime > localTime) {
      // Remote is newer — apply to local storage
      const toApply = {};
      for (const key of SYNC_KEYS) {
        if (key in remote) {
          toApply[key] = remote[key];
        }
      }
      toApply.prefsUpdatedAt = remote.updatedAt;

      await chrome.storage.local.set(toApply);
      console.log('☁️ Prefs pulled from cloud (remote was newer)');
      return true; // Signal that prefs changed — caller should refresh UI
    } else {
      // Local is newer or same — push local to remote
      if (localTime > remoteTime) {
        await pushPrefs();
      }
      return false;
    }
  } catch (error) {
    console.log('☁️ Prefs pull failed (offline?):', error.message);
    return false;
  }
}

// Debounced push — batches rapid preference changes
let _pushTimeout = null;
function debouncedPushPrefs() {
  if (_pushTimeout) clearTimeout(_pushTimeout);
  _pushTimeout = setTimeout(() => {
    _pushTimeout = null;
    pushPrefs();
  }, 2000);
}
