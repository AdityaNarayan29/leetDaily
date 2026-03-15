// Exhaustive production test suite for LeetDaily streak logic
// Tests meetsRequirementsForDay and calculateStreak

// === Extract production functions ===

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function meetsRequirementsForDay(problemsOnDay, reqs) {
  if (!reqs) {
    return problemsOnDay.length > 0;
  }
  const hasAnyRequirement = reqs.anySubmission ||
    reqs.dailyChallenge ||
    reqs.leetcode75 ||
    reqs.blind75 ||
    reqs.neetcode150 ||
    (reqs.companyFocus && reqs.selectedCompanies?.length > 0) ||
    (reqs.topicFocus && reqs.selectedTopics?.length > 0);
  if (!hasAnyRequirement) {
    return problemsOnDay.length > 0;
  }
  if (reqs.anySubmission && problemsOnDay.length > 0) return true;
  if (reqs.dailyChallenge && problemsOnDay.some(p => p.isDailyChallenge)) return true;
  if (reqs.leetcode75 && problemsOnDay.some(p => p.inLists?.leetcode75)) return true;
  if (reqs.blind75 && problemsOnDay.some(p => p.inLists?.blind75)) return true;
  if (reqs.neetcode150 && problemsOnDay.some(p => p.inLists?.neetcode150)) return true;
  if (reqs.companyFocus && reqs.selectedCompanies?.length > 0) {
    const companies = reqs.selectedCompanies.map(c => c.toLowerCase());
    if (problemsOnDay.some(p => p.companies?.some(c => companies.includes(c.toLowerCase())))) return true;
  }
  if (reqs.topicFocus && reqs.selectedTopics?.length > 0) {
    const topics = reqs.selectedTopics.map(t => t.toLowerCase());
    if (problemsOnDay.some(p => p.topics?.some(t => topics.includes(t.toLowerCase())))) return true;
  }
  return false;
}

function calculateStreak(solvedProblems, currentRequirements = null, requirementsByDate = {}) {
  if (!solvedProblems || Object.keys(solvedProblems).length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  const solvedByDate = {};
  for (const [problemId, data] of Object.entries(solvedProblems)) {
    if (!data.solvedAt) continue;
    const date = data.solvedAt.slice(0, 10);
    if (!solvedByDate[date]) solvedByDate[date] = [];
    solvedByDate[date].push(data);
  }
  function getRequirementsForDate(dateStr) {
    if (requirementsByDate[dateStr]) return requirementsByDate[dateStr];
    return null;
  }
  function dayMeetsRequirements(dateStr) {
    const problemsOnDay = solvedByDate[dateStr] || [];
    const reqs = getRequirementsForDate(dateStr);
    return meetsRequirementsForDay(problemsOnDay, reqs);
  }
  let currentStreak = 0, longestStreak = 0, tempStreak = 0;
  let date = new Date();
  while (true) {
    const dateStr = date.toISOString().slice(0, 10);
    const countsForStreak = dayMeetsRequirements(dateStr);
    if (countsForStreak) {
      currentStreak++;
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      if (dateStr === getTodayDate()) { date.setDate(date.getDate() - 1); continue; }
      break;
    }
    date.setDate(date.getDate() - 1);
  }
  const allDates = Object.keys(solvedByDate).sort();
  tempStreak = 0;
  for (let i = 0; i < allDates.length; i++) {
    const currentDate = allDates[i];
    if (dayMeetsRequirements(currentDate)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
      if (i < allDates.length - 1) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = nextDate.toISOString().slice(0, 10);
        if (allDates[i + 1] !== nextDateStr) tempStreak = 0;
      }
    } else { tempStreak = 0; }
  }
  return { currentStreak, longestStreak };
}

// === Test helpers ===
let passed = 0, failed = 0, total = 0;

function assert(condition, name) {
  total++;
  if (condition) {
    passed++;
  } else {
    failed++;
    console.log("FAIL: " + name);
  }
}

function assertEqual(actual, expected, name) {
  total++;
  if (actual === expected) {
    passed++;
  } else {
    failed++;
    console.log("FAIL: " + name + " — expected " + expected + " got " + actual);
  }
}

// Helper: date string N days ago from today
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Helper: build solvedProblems from an array of { daysAgo, props }
function buildSolved(entries) {
  const sp = {};
  entries.forEach((e, i) => {
    const dateStr = daysAgo(e.daysAgo);
    sp["prob_" + i] = {
      solvedAt: dateStr + "T12:00:00Z",
      ...(e.props || {})
    };
  });
  return sp;
}

// Helper: build requirementsByDate from an array of { daysAgo, reqs }
function buildReqsByDate(entries) {
  const rbd = {};
  entries.forEach(e => {
    rbd[daysAgo(e.daysAgo)] = e.reqs;
  });
  return rbd;
}

// ============================================================
// SECTION 1: meetsRequirementsForDay unit tests
// ============================================================

console.log("\n=== meetsRequirementsForDay ===");

// 1. null reqs — any solve counts
assert(meetsRequirementsForDay([{ solvedAt: "2025-01-01" }], null) === true, "null reqs + solve = true");
assert(meetsRequirementsForDay([], null) === false, "null reqs + no solve = false");

// 2. empty/all-false reqs — fallback to any solve
const emptyReqs = { anySubmission: false, dailyChallenge: false, leetcode75: false, blind75: false, neetcode150: false };
assert(meetsRequirementsForDay([{ solvedAt: "2025-01-01" }], emptyReqs) === true, "all-false reqs + solve = true");
assert(meetsRequirementsForDay([], emptyReqs) === false, "all-false reqs + no solve = false");

// 3. anySubmission
assert(meetsRequirementsForDay([{}], { anySubmission: true }) === true, "anySubmission + solve = true");
assert(meetsRequirementsForDay([], { anySubmission: true }) === false, "anySubmission + no solve = false");

// 4. dailyChallenge
assert(meetsRequirementsForDay([{ isDailyChallenge: true }], { dailyChallenge: true }) === true, "dailyChallenge met");
assert(meetsRequirementsForDay([{ isDailyChallenge: false }], { dailyChallenge: true }) === false, "dailyChallenge not met");
assert(meetsRequirementsForDay([{}], { dailyChallenge: true }) === false, "dailyChallenge missing field");

// 5. leetcode75
assert(meetsRequirementsForDay([{ inLists: { leetcode75: true } }], { leetcode75: true }) === true, "lc75 met");
assert(meetsRequirementsForDay([{ inLists: { leetcode75: false } }], { leetcode75: true }) === false, "lc75 not met");

// 6. blind75
assert(meetsRequirementsForDay([{ inLists: { blind75: true } }], { blind75: true }) === true, "blind75 met");
assert(meetsRequirementsForDay([{ inLists: {} }], { blind75: true }) === false, "blind75 not met");

// 7. neetcode150
assert(meetsRequirementsForDay([{ inLists: { neetcode150: true } }], { neetcode150: true }) === true, "nc150 met");

// 8. companyFocus
assert(meetsRequirementsForDay(
  [{ companies: ["Google", "Meta"] }],
  { companyFocus: true, selectedCompanies: ["google"] }
) === true, "companyFocus case-insensitive match");
assert(meetsRequirementsForDay(
  [{ companies: ["Amazon"] }],
  { companyFocus: true, selectedCompanies: ["Google"] }
) === false, "companyFocus no match");
// companyFocus=true but no companies selected — falls back to "any solve counts" (correct: don't break streak)
assert(meetsRequirementsForDay(
  [{ companies: ["Google"] }],
  { companyFocus: true, selectedCompanies: [] }
) === true, "companyFocus empty selectedCompanies — fallback to any solve");
assert(meetsRequirementsForDay(
  [{}],
  { companyFocus: true, selectedCompanies: ["Google"] }
) === false, "companyFocus no companies on problem");

// 9. topicFocus
assert(meetsRequirementsForDay(
  [{ topics: ["Array", "Hash Table"] }],
  { topicFocus: true, selectedTopics: ["array"] }
) === true, "topicFocus case-insensitive match");
assert(meetsRequirementsForDay(
  [{ topics: ["Tree"] }],
  { topicFocus: true, selectedTopics: ["Array"] }
) === false, "topicFocus no match");
// topicFocus=true but no topics selected — falls back to "any solve counts" (correct: don't break streak)
assert(meetsRequirementsForDay(
  [{ topics: ["Array"] }],
  { topicFocus: true, selectedTopics: [] }
) === true, "topicFocus empty selectedTopics — fallback to any solve");

// 10. OR mode — multiple requirements, any one met
assert(meetsRequirementsForDay(
  [{ isDailyChallenge: true }],
  { dailyChallenge: true, blind75: true }
) === true, "OR mode: dailyChallenge met, blind75 not");
assert(meetsRequirementsForDay(
  [{ inLists: { blind75: true } }],
  { dailyChallenge: true, blind75: true }
) === true, "OR mode: blind75 met, dailyChallenge not");
assert(meetsRequirementsForDay(
  [{ isDailyChallenge: false, inLists: { blind75: false } }],
  { dailyChallenge: true, blind75: true }
) === false, "OR mode: neither met");

// 11. Edge: problem with no properties vs requirements
assert(meetsRequirementsForDay([{}], { leetcode75: true }) === false, "bare problem vs lc75 req");

// 12. Multiple problems, one meets
assert(meetsRequirementsForDay(
  [{ isDailyChallenge: false }, { isDailyChallenge: true }],
  { dailyChallenge: true }
) === true, "multiple problems, second meets dailyChallenge");

// ============================================================
// SECTION 2: calculateStreak basic tests
// ============================================================

console.log("\n=== calculateStreak basics ===");

// 13. Empty/null
assertEqual(calculateStreak(null).currentStreak, 0, "null solvedProblems");
assertEqual(calculateStreak({}).currentStreak, 0, "empty solvedProblems");
assertEqual(calculateStreak(undefined).currentStreak, 0, "undefined solvedProblems");

// 14. Single day (today)
let sp = buildSolved([{ daysAgo: 0 }]);
let result = calculateStreak(sp);
assertEqual(result.currentStreak, 1, "single day today: current=1");
assertEqual(result.longestStreak, 1, "single day today: longest=1");

// 15. Single day (yesterday)
sp = buildSolved([{ daysAgo: 1 }]);
result = calculateStreak(sp);
assertEqual(result.currentStreak, 1, "single day yesterday: current=1");
assertEqual(result.longestStreak, 1, "single day yesterday: longest=1");

// 16. Consecutive 5 days ending today
sp = buildSolved([0,1,2,3,4].map(d => ({ daysAgo: d })));
result = calculateStreak(sp);
assertEqual(result.currentStreak, 5, "5 consecutive ending today: current=5");
assertEqual(result.longestStreak, 5, "5 consecutive ending today: longest=5");

// 17. Gap breaks streak
sp = buildSolved([{ daysAgo: 0 }, { daysAgo: 1 }, { daysAgo: 3 }, { daysAgo: 4 }]);
result = calculateStreak(sp);
assertEqual(result.currentStreak, 2, "gap at day 2: current=2");
assertEqual(result.longestStreak, 2, "gap at day 2: longest=2");

// 18. Today not solved — streak from yesterday
sp = buildSolved([{ daysAgo: 1 }, { daysAgo: 2 }, { daysAgo: 3 }]);
result = calculateStreak(sp);
assertEqual(result.currentStreak, 3, "today not solved, 3 days ending yesterday: current=3");

// 19. Missing solvedAt field — problem should be skipped
sp = { "p1": { solvedAt: daysAgo(0) + "T12:00:00Z" }, "p2": { title: "no date" } };
result = calculateStreak(sp);
assertEqual(result.currentStreak, 1, "missing solvedAt skipped: current=1");

// 20. Multiple problems same day
sp = buildSolved([{ daysAgo: 0 }, { daysAgo: 0 }, { daysAgo: 0 }]);
result = calculateStreak(sp);
assertEqual(result.currentStreak, 1, "3 problems same day: current=1");

// ============================================================
// SECTION 3: Cumulative streaks across requirement changes
// ============================================================

console.log("\n=== Cumulative streaks ===");

// 21. The 45+7=52 scenario
// 45 days with topicFocus=Array, then 7 days with topicFocus=Hash Table, all consecutive ending today
sp = {};
const reqsByDate21 = {};
for (let i = 51; i >= 7; i--) {
  const dateStr = daysAgo(i);
  sp["p_old_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Array"] };
  reqsByDate21[dateStr] = { topicFocus: true, selectedTopics: ["Array"] };
}
for (let i = 6; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["p_new_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Hash Table"] };
  reqsByDate21[dateStr] = { topicFocus: true, selectedTopics: ["Hash Table"] };
}
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Hash Table"] }, reqsByDate21);
assertEqual(result.currentStreak, 52, "45+7=52 cumulative streak");
assertEqual(result.longestStreak, 52, "45+7=52 longest");

// 22. Triple switch: 10 days Array -> 10 days DP -> 10 days Graph, all consecutive ending today
sp = {};
const reqsByDate22 = {};
for (let i = 29; i >= 20; i--) {
  const dateStr = daysAgo(i);
  sp["pa_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Array"] };
  reqsByDate22[dateStr] = { topicFocus: true, selectedTopics: ["Array"] };
}
for (let i = 19; i >= 10; i--) {
  const dateStr = daysAgo(i);
  sp["pb_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Dynamic Programming"] };
  reqsByDate22[dateStr] = { topicFocus: true, selectedTopics: ["Dynamic Programming"] };
}
for (let i = 9; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["pc_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Graph"] };
  reqsByDate22[dateStr] = { topicFocus: true, selectedTopics: ["Graph"] };
}
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Graph"] }, reqsByDate22);
assertEqual(result.currentStreak, 30, "triple switch 10+10+10=30");

// 23. Switch from dailyChallenge to blind75
sp = {};
const reqsByDate23 = {};
for (let i = 9; i >= 5; i--) {
  const dateStr = daysAgo(i);
  sp["pdc_" + i] = { solvedAt: dateStr + "T12:00:00Z", isDailyChallenge: true };
  reqsByDate23[dateStr] = { dailyChallenge: true };
}
for (let i = 4; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["pb75_" + i] = { solvedAt: dateStr + "T12:00:00Z", inLists: { blind75: true } };
  reqsByDate23[dateStr] = { blind75: true };
}
result = calculateStreak(sp, { blind75: true }, reqsByDate23);
assertEqual(result.currentStreak, 10, "dailyChallenge->blind75: 5+5=10");

// 24. Gap still breaks even with different requirements
sp = {};
const reqsByDate24 = {};
for (let i = 5; i >= 3; i--) {
  const dateStr = daysAgo(i);
  sp["px_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Array"] };
  reqsByDate24[dateStr] = { topicFocus: true, selectedTopics: ["Array"] };
}
// Day 2 is a gap (no solve)
for (let i = 1; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["py_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Tree"] };
  reqsByDate24[dateStr] = { topicFocus: true, selectedTopics: ["Tree"] };
}
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Tree"] }, reqsByDate24);
assertEqual(result.currentStreak, 2, "gap breaks cumulative: current=2");
assertEqual(result.longestStreak, 3, "gap breaks cumulative: longest=3");

// 25. Solved but WRONG topic for that day's requirement — breaks streak
sp = {};
const reqsByDate25 = {};
for (let i = 4; i >= 2; i--) {
  const dateStr = daysAgo(i);
  sp["pz_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Array"] };
  reqsByDate25[dateStr] = { topicFocus: true, selectedTopics: ["Array"] };
}
// Day 1: solved Tree but requirement was Array — should NOT count
const d1 = daysAgo(1);
sp["pz_1"] = { solvedAt: d1 + "T12:00:00Z", topics: ["Tree"] };
reqsByDate25[d1] = { topicFocus: true, selectedTopics: ["Array"] };
// Day 0: solved Array
const d0 = daysAgo(0);
sp["pz_0"] = { solvedAt: d0 + "T12:00:00Z", topics: ["Array"] };
reqsByDate25[d0] = { topicFocus: true, selectedTopics: ["Array"] };
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Array"] }, reqsByDate25);
assertEqual(result.currentStreak, 1, "wrong topic breaks: current=1");
assertEqual(result.longestStreak, 3, "wrong topic breaks: longest=3");

// ============================================================
// SECTION 4: Upgrade path (existing users without requirementsByDate)
// ============================================================

console.log("\n=== Upgrade path ===");

// 26. No requirementsByDate at all — pre-feature user, any solve counts
sp = buildSolved([0,1,2,3,4].map(d => ({ daysAgo: d })));
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Array"] }, {});
assertEqual(result.currentStreak, 5, "no reqsByDate: all days count as any-solve");

// 27. Partial requirementsByDate — some days have snapshots, older don't
sp = {};
const reqsByDate27 = {};
// Days 4-3: no snapshot (pre-feature)
for (let i = 4; i >= 3; i--) {
  sp["po_" + i] = { solvedAt: daysAgo(i) + "T12:00:00Z", topics: ["Tree"] };
}
// Days 2-0: have snapshots
for (let i = 2; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["pn_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Array"] };
  reqsByDate27[dateStr] = { topicFocus: true, selectedTopics: ["Array"] };
}
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Array"] }, reqsByDate27);
assertEqual(result.currentStreak, 5, "partial reqsByDate: old days generous");

// ============================================================
// SECTION 5: Company focus switches
// ============================================================

console.log("\n=== Company switches ===");

// 28. Google -> Meta company switch
sp = {};
const reqsByDate28 = {};
for (let i = 9; i >= 5; i--) {
  const dateStr = daysAgo(i);
  sp["cg_" + i] = { solvedAt: dateStr + "T12:00:00Z", companies: ["Google"] };
  reqsByDate28[dateStr] = { companyFocus: true, selectedCompanies: ["Google"] };
}
for (let i = 4; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["cm_" + i] = { solvedAt: dateStr + "T12:00:00Z", companies: ["Meta"] };
  reqsByDate28[dateStr] = { companyFocus: true, selectedCompanies: ["Meta"] };
}
result = calculateStreak(sp, { companyFocus: true, selectedCompanies: ["Meta"] }, reqsByDate28);
assertEqual(result.currentStreak, 10, "Google->Meta company switch: 5+5=10");

// ============================================================
// SECTION 6: Edge cases
// ============================================================

console.log("\n=== Edge cases ===");

// 29. Only today, not solved yet (no problems at all)
result = calculateStreak({});
assertEqual(result.currentStreak, 0, "no problems: current=0");

// 30. Very old single solve (30 days ago), nothing recent
sp = buildSolved([{ daysAgo: 30 }]);
result = calculateStreak(sp);
assertEqual(result.currentStreak, 0, "old single solve: current=0");
assertEqual(result.longestStreak, 1, "old single solve: longest=1");

// 31. 365-day unbroken streak
sp = {};
for (let i = 0; i < 365; i++) {
  sp["stress_" + i] = { solvedAt: daysAgo(i) + "T10:00:00Z" };
}
result = calculateStreak(sp);
assertEqual(result.currentStreak, 365, "365-day streak: current=365");
assertEqual(result.longestStreak, 365, "365-day streak: longest=365");

// 32. Two separate streaks, older one longer
sp = {};
// Older streak: days 20-10 (11 days)
for (let i = 20; i >= 10; i--) {
  sp["old_" + i] = { solvedAt: daysAgo(i) + "T12:00:00Z" };
}
// Current streak: days 2-0 (3 days)
for (let i = 2; i >= 0; i--) {
  sp["cur_" + i] = { solvedAt: daysAgo(i) + "T12:00:00Z" };
}
result = calculateStreak(sp);
assertEqual(result.currentStreak, 3, "two streaks: current=3");
assertEqual(result.longestStreak, 11, "two streaks: longest=11");

// 33. All requirements false but problems solved — should count (fallback)
sp = buildSolved([{ daysAgo: 0 }]);
const allFalse = { anySubmission: false, dailyChallenge: false, leetcode75: false, blind75: false, neetcode150: false, topicFocus: false, companyFocus: false };
const rbdAllFalse = {};
rbdAllFalse[daysAgo(0)] = allFalse;
result = calculateStreak(sp, allFalse, rbdAllFalse);
assertEqual(result.currentStreak, 1, "all-false reqs fallback: current=1");

// 34. User unchecks all mid-streak — should NOT break
sp = {};
const reqsByDate34 = {};
// Days 5-3: had topicFocus
for (let i = 5; i >= 3; i--) {
  const dateStr = daysAgo(i);
  sp["uc_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Array"] };
  reqsByDate34[dateStr] = { topicFocus: true, selectedTopics: ["Array"] };
}
// Days 2-0: unchecked everything (all false), still solved
for (let i = 2; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["uc2_" + i] = { solvedAt: dateStr + "T12:00:00Z" };
  reqsByDate34[dateStr] = { anySubmission: false, dailyChallenge: false, leetcode75: false, blind75: false, neetcode150: false, topicFocus: false, companyFocus: false };
}
result = calculateStreak(sp, allFalse, reqsByDate34);
assertEqual(result.currentStreak, 6, "uncheck all mid-streak: 3+3=6");

// 35. Switch from anySubmission to specific topic
sp = {};
const reqsByDate35 = {};
for (let i = 7; i >= 4; i--) {
  const dateStr = daysAgo(i);
  sp["as_" + i] = { solvedAt: dateStr + "T12:00:00Z" };
  reqsByDate35[dateStr] = { anySubmission: true };
}
for (let i = 3; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["ts_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Graph"] };
  reqsByDate35[dateStr] = { topicFocus: true, selectedTopics: ["Graph"] };
}
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Graph"] }, reqsByDate35);
assertEqual(result.currentStreak, 8, "anySubmission->topicFocus: 4+4=8");

// 36. Switch from specific topic to anySubmission
sp = {};
const reqsByDate36 = {};
for (let i = 5; i >= 3; i--) {
  const dateStr = daysAgo(i);
  sp["tf_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["DP"] };
  reqsByDate36[dateStr] = { topicFocus: true, selectedTopics: ["DP"] };
}
for (let i = 2; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["af_" + i] = { solvedAt: dateStr + "T12:00:00Z" };
  reqsByDate36[dateStr] = { anySubmission: true };
}
result = calculateStreak(sp, { anySubmission: true }, reqsByDate36);
assertEqual(result.currentStreak, 6, "topicFocus->anySubmission: 3+3=6");

// ============================================================
// SECTION 7: Longest streak correctness
// ============================================================

console.log("\n=== Longest streak ===");

// 37. Longest streak in the past, not current
sp = {};
const reqsByDate37 = {};
// Past streak: 20 days (days 30-11)
for (let i = 30; i >= 11; i--) {
  const dateStr = daysAgo(i);
  sp["ls_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Array"] };
  reqsByDate37[dateStr] = { topicFocus: true, selectedTopics: ["Array"] };
}
// Current: 3 days
for (let i = 2; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["lc_" + i] = { solvedAt: dateStr + "T12:00:00Z", topics: ["Tree"] };
  reqsByDate37[dateStr] = { topicFocus: true, selectedTopics: ["Tree"] };
}
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Tree"] }, reqsByDate37);
assertEqual(result.currentStreak, 3, "past longest: current=3");
assertEqual(result.longestStreak, 20, "past longest: longest=20");

// 38. Current streak IS the longest
sp = {};
for (let i = 14; i >= 0; i--) {
  sp["cl_" + i] = { solvedAt: daysAgo(i) + "T12:00:00Z" };
}
result = calculateStreak(sp);
assertEqual(result.currentStreak, 15, "current is longest: current=15");
assertEqual(result.longestStreak, 15, "current is longest: longest=15");

// ============================================================
// SECTION 8: Real customer scenarios
// ============================================================

console.log("\n=== Real customer scenarios ===");

// 39. New install — no data at all
result = calculateStreak({}, null, {});
assertEqual(result.currentStreak, 0, "new install: current=0");
assertEqual(result.longestStreak, 0, "new install: longest=0");

// 40. User solves first ever problem today
sp = { "first": { solvedAt: daysAgo(0) + "T09:00:00Z", topics: ["Array"], inLists: { leetcode75: true } } };
result = calculateStreak(sp, { leetcode75: true }, {});
assertEqual(result.currentStreak, 1, "first ever solve today: current=1");

// 41. User changes requirements same day multiple times — last snapshot wins
sp = {};
const reqsByDate41 = {};
const today41 = daysAgo(0);
sp["multi_0"] = { solvedAt: today41 + "T12:00:00Z", topics: ["Array"] };
// Simulate: last save was topicFocus=Array
reqsByDate41[today41] = { topicFocus: true, selectedTopics: ["Array"] };
result = calculateStreak(sp, { topicFocus: true, selectedTopics: ["Array"] }, reqsByDate41);
assertEqual(result.currentStreak, 1, "same-day req change: current=1");

// 42. 200-day stress test with alternating requirements
sp = {};
const reqsByDate42 = {};
for (let i = 199; i >= 0; i--) {
  const dateStr = daysAgo(i);
  const isEven = i % 2 === 0;
  sp["s200_" + i] = {
    solvedAt: dateStr + "T12:00:00Z",
    topics: isEven ? ["Array"] : ["Tree"],
    isDailyChallenge: !isEven
  };
  reqsByDate42[dateStr] = isEven
    ? { topicFocus: true, selectedTopics: ["Array"] }
    : { dailyChallenge: true };
}
result = calculateStreak(sp, { dailyChallenge: true }, reqsByDate42);
assertEqual(result.currentStreak, 200, "200-day alternating reqs: current=200");
assertEqual(result.longestStreak, 200, "200-day alternating reqs: longest=200");

// 43. Export/import scenario — requirementsByDate preserved
// Just verify calculateStreak works with the same data
const exportedReqsByDate = JSON.parse(JSON.stringify(reqsByDate42));
result = calculateStreak(sp, { dailyChallenge: true }, exportedReqsByDate);
assertEqual(result.currentStreak, 200, "export/import preserved: current=200");

// 44. User had streak, took a break, started again
sp = {};
// Old streak: days 20-15 (6 days)
for (let i = 20; i >= 15; i--) {
  sp["break_old_" + i] = { solvedAt: daysAgo(i) + "T12:00:00Z" };
}
// Break: days 14-4 (11 days off)
// New streak: days 3-0 (4 days)
for (let i = 3; i >= 0; i--) {
  sp["break_new_" + i] = { solvedAt: daysAgo(i) + "T12:00:00Z" };
}
result = calculateStreak(sp);
assertEqual(result.currentStreak, 4, "break then restart: current=4");
assertEqual(result.longestStreak, 6, "break then restart: longest=6");

// 45. User solved with company focus, problem has multiple companies
sp = {};
const reqsByDate45 = {};
const today45 = daysAgo(0);
sp["mc_0"] = { solvedAt: today45 + "T12:00:00Z", companies: ["Google", "Meta", "Amazon"] };
reqsByDate45[today45] = { companyFocus: true, selectedCompanies: ["Meta"] };
result = calculateStreak(sp, { companyFocus: true, selectedCompanies: ["Meta"] }, reqsByDate45);
assertEqual(result.currentStreak, 1, "multi-company problem: current=1");

// 46. neetcode150 -> leetcode75 switch
sp = {};
const reqsByDate46 = {};
for (let i = 7; i >= 4; i--) {
  const dateStr = daysAgo(i);
  sp["nc_" + i] = { solvedAt: dateStr + "T12:00:00Z", inLists: { neetcode150: true } };
  reqsByDate46[dateStr] = { neetcode150: true };
}
for (let i = 3; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["lc_" + i] = { solvedAt: dateStr + "T12:00:00Z", inLists: { leetcode75: true } };
  reqsByDate46[dateStr] = { leetcode75: true };
}
result = calculateStreak(sp, { leetcode75: true }, reqsByDate46);
assertEqual(result.currentStreak, 8, "nc150->lc75: 4+4=8");

// 47. Day with solve but wrong list — breaks current streak
sp = {};
const reqsByDate47 = {};
for (let i = 4; i >= 2; i--) {
  const dateStr = daysAgo(i);
  sp["wl_" + i] = { solvedAt: dateStr + "T12:00:00Z", inLists: { blind75: true } };
  reqsByDate47[dateStr] = { blind75: true };
}
// Day 1: solved lc75 but requirement was blind75
const d1_47 = daysAgo(1);
sp["wl_1"] = { solvedAt: d1_47 + "T12:00:00Z", inLists: { leetcode75: true, blind75: false } };
reqsByDate47[d1_47] = { blind75: true };
// Day 0: solved blind75
const d0_47 = daysAgo(0);
sp["wl_0"] = { solvedAt: d0_47 + "T12:00:00Z", inLists: { blind75: true } };
reqsByDate47[d0_47] = { blind75: true };
result = calculateStreak(sp, { blind75: true }, reqsByDate47);
assertEqual(result.currentStreak, 1, "wrong list breaks: current=1");
assertEqual(result.longestStreak, 3, "wrong list breaks: longest=3");

// 48. Extremely rapid requirement changes — every day different
sp = {};
const reqsByDate48 = {};
const reqTypes = [
  { anySubmission: true },
  { dailyChallenge: true },
  { leetcode75: true },
  { blind75: true },
  { neetcode150: true },
  { topicFocus: true, selectedTopics: ["Array"] },
  { companyFocus: true, selectedCompanies: ["Google"] }
];
for (let i = 6; i >= 0; i--) {
  const dateStr = daysAgo(i);
  const reqIdx = 6 - i;
  const req = reqTypes[reqIdx];
  reqsByDate48[dateStr] = req;
  const props = {};
  if (req.anySubmission) props.topics = ["Any"];
  if (req.dailyChallenge) props.isDailyChallenge = true;
  if (req.leetcode75) props.inLists = { leetcode75: true };
  if (req.blind75) props.inLists = { blind75: true };
  if (req.neetcode150) props.inLists = { neetcode150: true };
  if (req.topicFocus) props.topics = ["Array"];
  if (req.companyFocus) props.companies = ["Google"];
  sp["rapid_" + i] = { solvedAt: dateStr + "T12:00:00Z", ...props };
}
result = calculateStreak(sp, reqTypes[6], reqsByDate48);
assertEqual(result.currentStreak, 7, "7 different req types, each day matches its own: current=7");

// ============================================================
// SECTION 9: Pruning logic
// ============================================================

console.log("\n=== Pruning verification ===");

// 49. Verify old requirementsByDate entries don't affect streak calculation
// (Pruning happens in updateStreaksAndStorage, not calculateStreak, but verify behavior)
sp = {};
const reqsByDate49 = {};
// 500 days ago entry (would be pruned in production)
const veryOld = daysAgo(500);
reqsByDate49[veryOld] = { topicFocus: true, selectedTopics: ["Array"] };
sp["ancient"] = { solvedAt: veryOld + "T12:00:00Z", topics: ["Array"] };
// Current: 3 days
for (let i = 2; i >= 0; i--) {
  const dateStr = daysAgo(i);
  sp["prune_" + i] = { solvedAt: dateStr + "T12:00:00Z" };
}
result = calculateStreak(sp);
assertEqual(result.currentStreak, 3, "ancient entry doesn't affect current: current=3");
// Ancient entry counted as longest=1 separately (not consecutive with current)
assert(result.longestStreak >= 3, "pruning: longest >= 3");

// 50. Simulate pruning — entries >400 days old removed
const reqsByDatePrune = {};
const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - 400);
const cutoffStr = cutoff.toISOString().slice(0, 10);
reqsByDatePrune[daysAgo(500)] = { anySubmission: true };
reqsByDatePrune[daysAgo(401)] = { anySubmission: true };
reqsByDatePrune[daysAgo(399)] = { anySubmission: true };
reqsByDatePrune[daysAgo(0)] = { anySubmission: true };
// Prune
for (const dateKey of Object.keys(reqsByDatePrune)) {
  if (dateKey < cutoffStr) delete reqsByDatePrune[dateKey];
}
assertEqual(Object.keys(reqsByDatePrune).length, 2, "pruning removes >400 day entries");
assert(reqsByDatePrune[daysAgo(399)] !== undefined, "399 days ago kept");
assert(reqsByDatePrune[daysAgo(0)] !== undefined, "today kept");

// ============================================================
// FINAL REPORT
// ============================================================

console.log("\n========================================");
console.log("RESULTS: " + passed + "/" + total + " passed, " + failed + " failed");
console.log("========================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED");
}
