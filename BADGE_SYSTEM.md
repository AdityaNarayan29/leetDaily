# Badge / Streak Update System — Rules & Invariants

**Read this before editing anything in `background.js` that touches the toolbar badge, streak, or alarms.**

This part of the code has broken before (badge only updated when the popup was opened, not in the background). It is now structured to be self-healing. The rules below are what keep it working. Follow them and the badge stays reliable; break them and it silently goes stale or blank.

---

## What the badge is

The number/color on the extension's toolbar icon (`chrome.action.setBadgeText` / `setBadgeBackgroundColor` / `setBadgeTextColor`). It shows either the LeetCode streak or the focus streak, depending on the `badgeDisplay` setting.

---

## The core functions (do not rewire these without reading the invariants)

| Function | Location | Role |
|---|---|---|
| `updateBadge()` | `background.js` (~L405) | **Renders the badge from storage.** Never fetches. Must always render. |
| `checkLeetCodeCompletion()` | `background.js` (~L483) | Fetches streak from the API, writes it to storage, then calls `updateBadge()`. |
| `refreshBadgeIfStale()` | `background.js` (~L560) | Called by the 1-min alarm. Re-fetches if data is stale, else just re-renders. Always ends in a render. |
| `ensureAlarms()` | `background.js` (~L571) | Idempotently (re)creates the `leetcodeApiPoll` and `badgeUpdate` alarms. |
| `fetchStreakFromLeetCode()` | `background.js` (~L183) | Lightweight streak-only fetch, used by the `recalculateStreak` message. |

---

## THE INVARIANTS (breaking any of these is what causes regressions)

### 1. `updateBadge()` MUST stay network-independent
It reads only from `chrome.storage.local` and always renders. **Never** gate `updateBadge()` on a successful fetch, a network response, or an `await fetch(...)`. Its entire safety guarantee is: even with no network, the badge shows the last-known streak from storage. If you couple it to a fetch, a failed/slow network makes the badge go blank or stale forever.

### 2. Every badge-update path MUST end in a render
`refreshBadgeIfStale()` renders in **both** branches (stale → `checkLeetCodeCompletion()` → `updateBadge()`; fresh → `updateBadge()`). If you add a new branch or trigger, it must also call `updateBadge()` on **every** path, including the error/early-return paths. There must be no code path where the alarm fires and the badge is not rendered.

### 3. Alarms are the ONLY reliable background heartbeat (MV3)
The service worker sleeps. `setInterval`/`setTimeout` do **not** survive sleep — do not use them for periodic badge work. Use `chrome.alarms` only. The two alarms are:
- `leetcodeApiPoll` — every 5 min → `checkLeetCodeCompletion()` (fetch + write + render)
- `badgeUpdate` — every 1 min → `refreshBadgeIfStale()` (self-heal + render)

### 4. Alarms MUST be (re)created on both startup paths
`ensureAlarms()` is called at top level **and** in `chrome.runtime.onStartup`. Both are required:
- Top-level runs on install/update and event-driven wakes.
- `onStartup` runs on browser restart, which top-level code alone does not reliably cover.
`chrome.alarms.create` with the same name replaces the existing alarm, so calling `ensureAlarms()` repeatedly is safe. Do not remove either call.

### 5. Event listeners MUST be registered synchronously at the top level
`chrome.alarms.onAlarm.addListener`, `chrome.runtime.onMessage.addListener`, `chrome.runtime.onStartup.addListener`, `chrome.runtime.onInstalled.addListener` must all be reached synchronously during module evaluation — **not** inside an `async` function, not after an `await`, not inside a callback. MV3 re-runs the top-level script to revive the worker and re-attach listeners; if a listener is registered behind an `await`, it may miss the event that woke the worker. (The `await` inside `leetcodeFetch`/`getDomainOrder` is fine because it only runs when those functions are *called*, not at module top level.)

### 6. The staleness gate prevents a fetch storm
`refreshBadgeIfStale()` only re-fetches when `Date.now() - lastStreakSync > STREAK_STALE_MS` (5 min). `lastStreakSync` is written by `checkLeetCodeCompletion()` on every successful sync. If you change the streak-write logic, keep writing `lastStreakSync`, or the 1-min alarm will fetch every single minute (or, if you remove the write entirely, never treat data as fresh).

### 7. `checkLeetCodeCompletion()` must keep writing `currentStreak` + `lastStreakSync` + calling `updateBadge()` on success
Both success branches (completed-today and not-completed) must write `currentStreak` and `lastStreakSync` and then call `updateBadge()`. The only legitimate early return is when the user is signed out.

---

## Shared logic / side-effects you must not accidentally break

- **`updateBadge()` also writes focus-streak state.** Each call recalculates and writes `focusStreak`, `focusGoalMetToday`, and `frozenDates` (via `calculateFocusStreak`). The badge render is coupled to the focus-streak / streak-freeze system. If you change `updateBadge()`, preserve this write, or focus streaks + freezes stop updating.
- **The 1-min `badgeUpdate` alarm also runs `checkUrgentReminder()`** (the "streak at risk" notification). It shares the alarm handler block but is independent of the badge. Don't remove it when touching the badge branch.
- **`checkLeetCodeCompletion()` is reachable from two triggers** (5-min poll and the 1-min stale-check). It is idempotent — safe to run from both. Keep it idempotent (same keys written, safe to repeat).

---

## Region (leetcode.com / leetcode.cn) interaction

The badge fetch goes through `leetcodeFetch()`, which is domain-aware: it tries the preferred region first (from the `preferredDomain` setting) and falls back to the other on network error or signed-out. This means:
- Do not hardcode `leetcode.com` in any badge/streak fetch. Use `leetcodeFetch()`.
- `leetcodeFetch()` returns **parsed JSON**, not a `Response`. Do not call `.json()` on its result.
- If the user is signed out of *both* regions, `checkLeetCodeCompletion()` early-returns (signed-out) and the badge keeps showing the last-known streak — which is correct.

---

## All badge update triggers (reference)

| Trigger | Mechanism | Fetches? |
|---|---|---|
| Service worker startup | top-level `checkLeetCodeCompletion()` + `updateBadge()` | yes |
| Browser restart | `chrome.runtime.onStartup` → `ensureAlarms()` + `checkLeetCodeCompletion()` | yes |
| Every 5 min | `leetcodeApiPoll` alarm → `checkLeetCodeCompletion()` | yes |
| Every 1 min | `badgeUpdate` alarm → `refreshBadgeIfStale()` | only if stale (>5 min) |
| Popup opened / badge setting toggled | `updateBadge` message | no (render only) |
| Content script detects a solve | `problemSolved` / `individualProblemSolved` message | `individualProblemSolved` fetches daily slug |
| Loading blink ends | `stopLoadingBlink()` | no |
| Manual recalc | `recalculateStreak` message → `fetchStreakFromLeetCode()` | yes |

---

## Checklist before you ship a change near this code

- [ ] `updateBadge()` still reads only from storage and always renders (no fetch dependency).
- [ ] Every new trigger/branch calls `updateBadge()` on **all** paths, including errors.
- [ ] No `setInterval`/`setTimeout` used for periodic badge work — alarms only.
- [ ] `ensureAlarms()` still called at top level **and** in `onStartup`.
- [ ] All `addListener` calls are still top-level and synchronous (not behind `await`).
- [ ] `checkLeetCodeCompletion()` still writes `currentStreak` + `lastStreakSync` and renders on success.
- [ ] Badge/streak fetches still go through `leetcodeFetch()` (no hardcoded domain, no `.json()` on its result).
- [ ] `updateBadge()` still writes `focusStreak` / `focusGoalMetToday` / `frozenDates`.
- [ ] Manual test: reload extension, run `chrome.alarms.getAll(console.log)` in the SW console → both `leetcodeApiPoll` and `badgeUpdate` present. Leave browser idle (do **not** open popup), solve the daily, confirm the badge updates on its own within ~1–5 min.

---

## Manual verification (the real test — can't be done in code)

1. `chrome://extensions` → reload LeetDaily → open the **service worker** console.
2. Run `chrome.alarms.getAll(console.log)` — expect `leetcodeApiPoll` (5 min) and `badgeUpdate` (1 min).
3. Idle test: leave the browser alone **without opening the popup**, solve the daily on your preferred region, and confirm the badge refreshes on its own within ~1–5 minutes.
4. If it only updates when the popup opens, check the SW console for `LeetCode API check failed:` lines — that points at a fetch/auth problem, not the alarm wiring.
