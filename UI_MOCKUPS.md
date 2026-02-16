# LeetDaily Extension - UI Mockups

> **Review Document** - All screens and user flows before implementation

---

## 🎨 Design System

**Colors:**
- Background: `#0a0a0a` (dark)
- Card: `#1a1a1a` (slightly lighter)
- Border: `rgba(255,255,255,0.1)` (subtle)
- Primary: `#ffa116` (orange)
- Text: `rgba(255,255,255,0.9)` (white)
- Subtext: `rgba(255,255,255,0.5)` (gray)

**Popup Dimensions:** 400px width × 600px height

---

## 📱 Screen 1: Main Dashboard (Default View)

**Purpose:** Quick overview of user's progress, streak, and quick actions

```
┌────────────────────────────────────────┐
│  LeetDaily              🔍 ⚙️          │ ← Header: Logo + Search + Settings icons
├────────────────────────────────────────┤
│                                        │
│  👋 Hey, AdityaNarayan29!              │
│                                        │
│  ╭── Stats Overview ──────────────────╮│
│  │  473      118     289      66      ││ ← Total stats at top
│  │  Total    Easy    Med      Hard    ││
│  ╰────────────────────────────────────╯│
│                                        │
│  ╭────────────────────────────────────╮│
│  │         🔥 STREAK: 7 DAYS          ││ ← Main Streak Card
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━━  60%  ││
│  │                                    ││
│  │   Next milestone: 14 days (7 left) ││
│  │   🎯 Maintained via: Daily + DP    ││ ← Shows what's maintaining streak
│  ╰────────────────────────────────────╯│
│                                        │
│  ╭── Today's Progress ────────────────╮│
│  │  ✅ Daily Challenge        SOLVED  ││
│  │  ⏳ Blind 75              45/75    ││ ← Quick stats
│  │  ⏳ NeetCode 150          32/150   ││
│  │  ⏳ LeetCode 75           12/75    ││
│  ╰────────────────────────────────────╯│
│                                        │
│  ╭── Quick Actions ────────────────────╮│
│  │  🎯  Solve Daily Challenge          ││ ← Opens daily on LC
│  │  📊  Problems Explorer              ││ ← Opens explorer
│  │  📚  Study Lists                    ││ ← Opens lists view
│  ╰────────────────────────────────────╯│
│                                        │
└────────────────────────────────────────┘
```

**Interactions:**
- 🔍 Icon → Opens Problems Explorer in new window
- ⚙️ Icon → Opens Settings overlay
- Streak Card → Shows detailed breakdown on click
- Quick Action Buttons → Navigate to respective screens
- Stats → Shows detailed analytics on click

---

## 📚 Screen 2: Study Lists View

**Purpose:** Track progress on Blind 75, NeetCode 150, LeetCode 75

```
┌────────────────────────────────────────┐
│  ← Study Lists                    ⚙️   │ ← Back button + Settings
├────────────────────────────────────────┤
│                                        │
│  [All] [In Progress] [Completed]       │ ← Filter tabs
│                                        │
│  ╭─ 📌 Blind 75 ─────────────────────╮ │
│  │  ━━━━━━━━━━━━━━░░░░░░░░░░  60%   │ │ ← Progress bar
│  │  45 / 75 completed                │ │
│  │                                   │ │
│  │  🔥 Counts toward streak          │ │ ← Badge if enabled in settings
│  │                                   │ │
│  │  [📖 View All] [▶ Resume]         │ │ ← Buttons
│  ╰───────────────────────────────────╯ │
│                                        │
│  ╭─ 📌 NeetCode 150 ─────────────────╮ │
│  │  ━━━━━░░░░░░░░░░░░░░░░░░░  30%   │ │
│  │  45 / 150 completed               │ │
│  │                                   │ │
│  │  [📖 View All] [▶ Resume]         │ │
│  ╰───────────────────────────────────╯ │
│                                        │
│  ╭─ 📌 LeetCode 75 ──────────────────╮ │
│  │  ━━━━━━━━━━━━━━━━░░░░  80%       │ │
│  │  60 / 75 completed                │ │
│  │                                   │ │
│  │  [📖 View All] [▶ Resume]         │ │
│  ╰───────────────────────────────────╯ │
│                                        │
│  ╭─ 💡 Tip ───────────────────────────╮│
│  │  Enable lists in Settings to count ││
│  │  them toward your daily streak!    ││
│  ╰────────────────────────────────────╯│
│                                        │
└────────────────────────────────────────┘
```

**Interactions:**
- **← Back** → Returns to Dashboard
- **Filter Tabs** → Show all/in-progress/completed lists
- **📖 View All** → Opens detailed list view (Screen 3)
- **▶ Resume** → Opens next uncompleted problem on LeetCode
- **Card Click** → Expands to show category breakdown

---

## 📋 Screen 3: Detailed List View (Blind 75)

**Purpose:** Show all problems in a list with checkboxes and categories

```
┌────────────────────────────────────────┐
│  ← Blind 75                       ⚙️   │
├────────────────────────────────────────┤
│  ━━━━━━━━━━━━━━░░░░░░░░░░  60%         │
│  45 / 75 completed                     │
│                                        │
│  [All] [Todo] [Done]  🔍 Search...     │ ← Filters + Search
├────────────────────────────────────────┤
│                                        │
│  ▼ 📊 Array & Hashing (9)        6/9   │ ← Category (collapsible)
│  ┌────────────────────────────────────┐│
│  │ ☑ #1   Two Sum              Easy   ││ ← Completed
│  │ ☑ #49  Group Anagrams       Medium ││
│  │ ☐ #217 Contains Duplicate  Easy   ││ ← Not completed
│  │ ☐ #238 Product Except Self  Medium ││
│  │ ☐ #347 Top K Frequent       Medium ││
│  │ ☐ #36  Valid Sudoku         Medium ││
│  │ ☐ #659 Encode/Decode        Medium ││
│  │ ☑ #128 Longest Consecutive  Medium ││
│  │ ☑ #242 Valid Anagram        Easy   ││
│  └────────────────────────────────────┘│
│                                        │
│  ▼ 👉 Two Pointers (5)           2/5   │
│  ┌────────────────────────────────────┐│
│  │ ☐ #125 Valid Palindrome     Easy   ││
│  │ ☑ #15  3Sum                 Medium ││
│  │ ☐ #11  Container Most Water Medium ││
│  │ ☑ #42  Trapping Rain Water  Hard   ││
│  │ ☐ #167 Two Sum II           Medium ││
│  └────────────────────────────────────┘│
│                                        │
│  ▶ 🌳 Trees (11)                 0/11   │ ← Collapsed
│  ▶ 🔄 Dynamic Programming (12)   0/12   │
│                                        │
└────────────────────────────────────────┘
```

**Interactions:**
- **Checkbox** → Toggle problem completion (saves to storage)
- **Problem Row Click** → Opens problem on LeetCode
- **Category Header** → Expand/collapse category
- **Search** → Filter problems by title
- **Filter Tabs** → Show all/todo/completed problems

---

## ⚙️ Screen 4: Settings

**Purpose:** Configure streak rules, reminders, and app preferences

```
┌────────────────────────────────────────┐
│  ← Settings                            │
├────────────────────────────────────────┤
│                                        │
│  ╭─ 🔥 Streak Counting ──────────────╮ │
│  │                                   │ │
│  │  Combination Mode: [OR ▼]      NEW!│ │ ← NEW! Dropdown
│  │  ○ OR  - Any condition (easy)     │ │
│  │  ○ AND - All conditions (strict)  │ │
│  │                                   │ │
│  │  What counts toward your streak?  │ │
│  │  (Select one or more)             │ │
│  │                                   │ │
│  │  ☑ Daily Challenge                │ │ ← Enabled
│  │     Solve the daily challenge     │ │
│  │                                   │ │
│  │  ☑ Blind 75                       │ │ ← Enabled
│  │     Solve any Blind 75 problem    │ │
│  │                                   │ │
│  │  ☐ NeetCode 150                   │ │ ← Disabled
│  │     Solve any NeetCode problem    │ │
│  │                                   │ │
│  │  ☐ LeetCode 75                    │ │
│  │     Solve any LeetCode 75         │ │
│  │                                   │ │
│  │  ☑ Topic Focus                 NEW!│ │ ← NEW FEATURE!
│  │     Focus on specific topics      │ │
│  │     Selected: [Dynamic Programming]│ │
│  │               [Graph]              │ │
│  │     [+ Add Topic ▼]               │ │
│  │                                   │ │
│  │  ☑ Company Focus               NEW!│ │ ← NEW FEATURE!
│  │     Target specific companies     │ │
│  │     Selected: [Google]            │ │
│  │               [Meta]              │ │
│  │     [+ Add Company ▼]             │ │
│  │                                   │ │
│  │  ☐ Any Submission                 │ │
│  │     Any problem on LeetCode       │ │
│  │                                   │ │
│  │  ─────────────────────────────────│ │
│  │  💡 Current Mode: OR              │ │
│  │  Solve ANY of:                    │ │
│  │  • Daily Challenge, OR            │ │
│  │  • Blind 75 problem, OR           │ │
│  │  • DP or Graph problem, OR        │ │
│  │  • Google or Meta problem         │ │
│  ╰───────────────────────────────────╯ │
│                                        │
│  ╭─ 🔔 Reminders ─────────────────────╮│
│  │  ☑ Daily reminder      [9:00 AM]  ││ ← Time picker
│  │  ☑ Streak at risk      [10:00 PM] ││
│  │  ☐ Weekly report       [Sunday]   ││
│  ╰───────────────────────────────────╯ │
│                                        │
│  ╭─ 🎨 Appearance ────────────────────╮│
│  │  ☑ Show streak badge on icon      ││
│  │  ☑ Celebrate milestones           ││
│  │  Theme: [Dark ▼]                  ││
│  ╰───────────────────────────────────╯ │
│                                        │
│  ╭─ 💾 Data ──────────────────────────╮│
│  │  [Export Progress]  [Import]      ││
│  │  [Reset All Data]                 ││
│  ╰───────────────────────────────────╯ │
│                                        │
└────────────────────────────────────────┘
```

**Interactions:**
- **Checkboxes** → Toggle streak counting options
- **Time Pickers** → Set reminder times
- **Export/Import** → Backup/restore progress
- **All changes** → Auto-save to `chrome.storage.sync`

---

## 🔍 Screen 5: Problems Explorer (Existing, Updated)

**Purpose:** Browse and filter all 5500+ LeetCode problems

**Updates to existing explorer:**
- **Auto-apply filters from Settings** (NEW!)
- Show AND/OR mode matching Settings (NEW!)
- Add badges for list membership (B75, NC150, LC75)
- Show completion checkboxes if problem is in any list

```
┌─────────────────────────────────────────────────────┐
│  ← Problems Explorer                      LeetCode   │
├─────────────────────────────────────────────────────┤
│  🔍 Search...                   [Sort ▼] [Reset All]│
│                                                     │
│  ╭─ 🎯 From Your Streak Settings ────────────────╮ │ ← NEW!
│  │  Mode: OR  [Switch to AND]                    │ │
│  │  Active: [DP] [Google] [Blind 75]       [×]   │ │
│  │  💡 Showing problems matching ANY filter      │ │
│  │     (18 problems match ALL filters)           │ │
│  ╰───────────────────────────────────────────────╯ │
│                                                     │
│  🔥 3 filters active from settings    [Customize]  │
│                                                     │
│  ▼ Study Lists                                      │
│  ☑ Blind 75   ☐ NeetCode 150   ☐ LC75        NEW! │ ← Pre-checked
│                                                     │
│  ▼ Topics                                           │
│  [Array] ☑ DP [Graph] ... +show more         NEW! │ ← Pre-checked
│                                                     │
│  ▼ Companies                                        │
│  🔍 Search...                                       │
│  ☑ Google (124)   ☐ Meta (89)  ...           NEW! │ ← Pre-checked
│                                                     │
│  ▼ Difficulty                                       │
│  [Easy] [Medium] [Hard]                            │
├─────────────────────────────────────────────────────┤
│  ID   Title                    Diff   Lists  Freq  │
│  ──────────────────────────────────────────────────│
│  ☑ 1   Two Sum            [B75][G] Easy       ████ │ ← Matches
│  ☐ 70  Climbing Stairs    [DP][G]  Easy       ███░ │
│  ☑ 322 Coin Change        [DP][G]  Medium     ████ │
│  ☐ 416 Partition Equal    [DP][G]  Medium     ███░ │
│  ...                                               │
│                                                     │
│  Showing 1-20 of 145 (OR mode)  [◀ 1 2 3 ... ▶]   │
└─────────────────────────────────────────────────────┘
```

**NEW: AND Mode View**
```
┌─────────────────────────────────────────────────────┐
│  🎯 From Your Streak Settings ────────────────────╮ │
│  │  Mode: AND  [Switch to OR]                 🔒 │ │ ← Strict mode
│  │  Active: [DP] [Google]                     [×]│ │
│  │  💡 Showing ONLY problems matching ALL filters│ │
│  │     18 problems found                         │ │
│  ╰───────────────────────────────────────────────╯ │
│                                                     │
│  🎯 Strict Mode: DP AND Google     [Clear Filters] │
│                                                     │
│  Results: Problems must be BOTH DP AND Google      │
├─────────────────────────────────────────────────────┤
│  ID   Title                    Diff   Lists  Freq  │
│  ──────────────────────────────────────────────────│
│  ☐ 70  Climbing Stairs    [DP][G]  Easy       ███░ │ ← Matches ALL
│  ☐ 322 Coin Change        [DP][G]  Medium     ████ │ ← Matches ALL
│  ☐ 416 Partition Equal    [DP][G]  Medium     ███░ │ ← Matches ALL
│  ☐ 518 Coin Change 2      [DP][G]  Medium     ███░ │ ← Matches ALL
│  ...                                               │
│                                                     │
│  Showing 1-18 of 18 (AND mode - all results)       │
│  🎯 Perfect for your Google DP interview prep!     │
└─────────────────────────────────────────────────────┘
```

**Interactions:**
- **Auto-apply filters** → Reads Settings on open, pre-checks matching filters
- **Mode toggle** → Switch between OR/AND without changing Settings
- **[×] button** → Clear streak-based filters, browse all problems
- **Customize button** → Temporarily modify filters (doesn't save to Settings)
- **Smart hint** → Shows count of problems matching ALL filters even in OR mode
- **Results counter** → "Showing X of Y (OR/AND mode)" for clarity

**Filter Sync Behavior:**
- Opening Explorer from Dashboard → Auto-applies Settings filters
- Opening Explorer from browser → Uses last session's filters
- Changing filters in Explorer → Temporary, doesn't affect Settings
- User can always clear to browse all 5500+ problems

---

## 📊 Screen 6: Streak Detail (Modal/Overlay)

**Purpose:** Show detailed streak breakdown when user clicks streak card

```
┌────────────────────────────────────────┐
│  ╭────────────────────────────────────╮│
│  │  🔥 Your Streak              [×]   ││ ← Close button
│  ├────────────────────────────────────┤│
│  │                                    ││
│  │         🔥 7 DAY STREAK             ││
│  │                                    ││
│  │  Last 7 days:                      ││
│  │  ✅ Feb 16 - Blind 75 (#15)        ││
│  │  ✅ Feb 15 - Daily Challenge       ││
│  │  ✅ Feb 14 - Blind 75 (#49)        ││
│  │  ✅ Feb 13 - Daily Challenge       ││
│  │  ✅ Feb 12 - Daily Challenge       ││
│  │  ✅ Feb 11 - Blind 75 (#1)         ││
│  │  ✅ Feb 10 - Daily Challenge       ││
│  │                                    ││
│  │  ──────────────────────────────    ││
│  │                                    ││
│  │  📅 Next reset: 5h 23m             ││
│  │  🎯 Next milestone: 14 days        ││
│  │  🏆 Longest streak: 15 days        ││
│  │                                    ││
│  │  [Share Streak] [View History]    ││
│  ╰────────────────────────────────────╯│
└────────────────────────────────────────┘
```

---

## 🎯 Screen 7: Topic Streak Manager (Modal/Overlay)

**Purpose:** Select topics to focus on and maintain topic-based streaks

```
┌────────────────────────────────────────┐
│  ╭────────────────────────────────────╮│
│  │  🎯 Topic Focus            [×]    ││ ← Close button
│  ├────────────────────────────────────┤│
│  │                                    ││
│  │  Build streaks for specific topics││
│  │  that you're learning or mastering ││
│  │                                    ││
│  │  Selected Topics:                  ││
│  │  ┌──────────────────────────────┐ ││
│  │  │ ✅ Dynamic Programming       │ ││ ← Selected
│  │  │    🔥 5 day streak           │ ││
│  │  │    [Remove]                  │ ││
│  │  └──────────────────────────────┘ ││
│  │  ┌──────────────────────────────┐ ││
│  │  │ ✅ Graph                     │ ││
│  │  │    🔥 3 day streak           │ ││
│  │  │    [Remove]                  │ ││
│  │  └──────────────────────────────┘ ││
│  │                                    ││
│  │  Available Topics:                 ││
│  │  ┌──────────────────────────────┐ ││
│  │  │ ☐ Array                      │ ││ ← Available
│  │  │ ☐ Tree                       │ ││
│  │  │ ☐ Linked List                │ ││
│  │  │ ☐ Binary Search              │ ││
│  │  │ ☐ Backtracking               │ ││
│  │  │ ☐ Hash Table                 │ ││
│  │  │ ... +12 more                 │ ││
│  │  └──────────────────────────────┘ ││
│  │                                    ││
│  │  💡 Solving any problem in        ││
│  │     selected topics maintains     ││
│  │     your main streak!             ││
│  │                                    ││
│  │  [Save & Close]                   ││
│  ╰────────────────────────────────────╯│
└────────────────────────────────────────┘
```

**Interactions:**
- **Checkbox** → Add/remove topic from streak tracking
- **Remove** → Unselect topic (keeps streak history)
- **Topic Streak Counter** → Shows days solved consecutively in that topic
- **Save** → Updates streak settings

---

## 🏢 Screen 8: Company Streak Manager (Modal/Overlay)

**Purpose:** Select companies to target for interview prep and maintain company-based streaks

```
┌────────────────────────────────────────┐
│  ╭────────────────────────────────────╮│
│  │  🏢 Company Focus          [×]    ││ ← Close button
│  ├────────────────────────────────────┤│
│  │                                    ││
│  │  Prepare for specific companies   ││
│  │  by tracking their interview probs││
│  │                                    ││
│  │  Selected Companies:               ││
│  │  ┌──────────────────────────────┐ ││
│  │  │ ✅ Google                    │ ││ ← Selected
│  │  │    🔥 7 day streak           │ ││
│  │  │    124 problems available    │ ││
│  │  │    [Remove]                  │ ││
│  │  └──────────────────────────────┘ ││
│  │  ┌──────────────────────────────┐ ││
│  │  │ ✅ Meta                      │ ││
│  │  │    🔥 4 day streak           │ ││
│  │  │    89 problems available     │ ││
│  │  │    [Remove]                  │ ││
│  │  └──────────────────────────────┘ ││
│  │                                    ││
│  │  Available Companies:              ││
│  │  🔍 Search companies...            ││
│  │  ┌──────────────────────────────┐ ││
│  │  │ ☐ Amazon (98)                │ ││ ← Available
│  │  │ ☐ Apple (76)                 │ ││
│  │  │ ☐ Microsoft (103)            │ ││
│  │  │ ☐ Netflix (45)               │ ││
│  │  │ ☐ Bloomberg (67)             │ ││
│  │  │ ☐ Uber (54)                  │ ││
│  │  │ ... +150 more                │ ││
│  │  └──────────────────────────────┘ ││
│  │                                    ││
│  │  💡 Solving any problem tagged    ││
│  │     with selected companies       ││
│  │     maintains your main streak!   ││
│  │                                    ││
│  │  [Save & Close]                   ││
│  ╰────────────────────────────────────╯│
└────────────────────────────────────────┘
```

**Interactions:**
- **Checkbox** → Add/remove company from streak tracking
- **Remove** → Unselect company (keeps streak history)
- **Company Streak Counter** → Shows days solved consecutively for that company
- **Problem Count** → Shows how many problems are tagged with that company
- **Search** → Filter companies by name
- **Save** → Updates streak settings

---

## 🎉 Screen 9: Milestone Celebration (Modal)

**Purpose:** Celebrate when user hits streak milestones

```
┌────────────────────────────────────────┐
│  ╭────────────────────────────────────╮│
│  │                                    ││
│  │         🎉 MILESTONE! 🎉           ││
│  │                                    ││
│  │     ━━━━━━━━━━━━━━━━━━━━━━        ││
│  │                                    ││
│  │        14 DAY STREAK!              ││
│  │                                    ││
│  │   You're crushing it! 🔥           ││
│  │   Keep going for 30 days!          ││
│  │                                    ││
│  │   🏆 Badge unlocked: "Two Weeks"   ││
│  │                                    ││
│  │   [Share on Twitter]               ││
│  │   [Share on LinkedIn]              ││
│  │   [Close]                          ││
│  │                                    ││
│  ╰────────────────────────────────────╯│
└────────────────────────────────────────┘
```

---

## 🔄 User Flows

### Flow 1: Starting Fresh
1. Install extension
2. Click extension icon → See Dashboard
3. Dashboard shows 0 streak, empty progress
4. Click "Solve Daily Challenge" → Opens LeetCode
5. Solve problem → Extension auto-detects → Streak = 1

### Flow 2: Customizing Streak Rules
1. Dashboard → Click ⚙️ Settings
2. Settings → Scroll to "Streak Counting"
3. Enable "Blind 75" checkbox
4. Enable "Topic Focus" → Select "Dynamic Programming" and "Graph"
5. Auto-saves
6. Return to Dashboard
7. Solve any DP or Graph problem → Maintains streak
8. Badge shows "🎯 Maintained via: DP"

### Flow 3: Tracking Blind 75
1. Dashboard → Click "Study Lists"
2. Lists → Click "View All" on Blind 75
3. See all 75 problems organized by category
4. Check off problems as you solve them
5. Progress bar updates in real-time
6. Return to Dashboard → See updated progress

### Flow 4: Finding a Problem
1. Dashboard → Click "Problems Explorer"
2. Opens in new window (like current explorer)
3. Filter by "Blind 75" + "Medium"
4. Click problem → Opens on LeetCode
5. Solve → Checkbox auto-checks (if logged in)

### Flow 5: Company-Based Interview Prep (with Auto-Filtered Explorer)
1. User has Google interview in 2 weeks
2. Dashboard → Click ⚙️ Settings
3. Settings → Enable "Company Focus" → Select "Google"
4. Settings → Enable "Topic Focus" → Select "DP"
5. Settings → Set Mode to "AND" (strict)
6. Return to Dashboard
7. Dashboard shows "🎯 STRICT: Google + DP"
8. Click "Problems Explorer" button
9. **Explorer opens with filters AUTO-APPLIED:**
   - Google filter: ✅ Pre-checked
   - DP filter: ✅ Pre-checked
   - Mode: AND (shows only problems matching BOTH)
   - Shows ~18 problems (all Google DP problems)
10. User sees: "🎯 Perfect for your Google DP interview prep!"
11. Clicks a problem → Opens on LeetCode
12. Solves → Maintains streak
13. Next day: Opens Explorer again → Same filters still applied

### Flow 6: Switching Between OR/AND in Explorer
1. User opens Problems Explorer (from Dashboard)
2. Settings were: DP + Graph + Google (OR mode)
3. Explorer shows: "Mode: OR - Showing 145 problems"
4. User clicks "Switch to AND"
5. Explorer instantly updates: "Mode: AND - Showing 18 problems"
6. User sees only problems that are (DP OR Graph) AND Google
7. Can switch back anytime without affecting Settings

---

## 📦 Data Storage Structure

```javascript
// Chrome Storage Schema
{
  // User profile
  "username": "AdityaNarayan29",
  "totalSolved": 473,

  // Streak data
  "currentStreak": 7,
  "longestStreak": 15,
  "lastSolvedDate": "2026-02-16",
  "lastSolvedMethod": "blind75", // or "dailyChallenge", "anySubmission"
  "lastSolvedProblemId": "15",

  // Streak settings
  "streakSettings": {
    "combinationMode": "OR", // NEW! "OR" or "AND"
    "dailyChallenge": true,
    "blind75": true,
    "neetcode150": false,
    "leetcode75": false,
    "topicFocus": true, // NEW!
    "selectedTopics": ["Dynamic Programming", "Graph"], // NEW!
    "companyFocus": true, // NEW!
    "selectedCompanies": ["Google", "Meta"], // NEW!
    "anySubmission": false
  },

  // Lists progress
  "blind75": ["1", "15", "49", "128", "242", ...], // Array of completed IDs
  "neetcode150": ["1", "2", "3", ...],
  "leetcode75": ["1", "2", ...],

  // Topic streaks (NEW!)
  "topicStreaks": {
    "Dynamic Programming": {
      "currentStreak": 5,
      "longestStreak": 12,
      "lastSolvedDate": "2026-02-16",
      "solvedProblems": ["70", "198", "322", ...]
    },
    "Graph": {
      "currentStreak": 3,
      "longestStreak": 7,
      "lastSolvedDate": "2026-02-16",
      "solvedProblems": ["200", "207", ...]
    }
  },

  // Company streaks (NEW!)
  "companyStreaks": {
    "Google": {
      "currentStreak": 7,
      "longestStreak": 15,
      "lastSolvedDate": "2026-02-16",
      "solvedProblems": ["1", "15", "200", ...]
    },
    "Meta": {
      "currentStreak": 4,
      "longestStreak": 8,
      "lastSolvedDate": "2026-02-16",
      "solvedProblems": ["273", "301", ...]
    }
  },

  // Reminder settings
  "reminders": {
    "daily": { enabled: true, time: "09:00" },
    "streakAtRisk": { enabled: true, time: "22:00" },
    "weekly": { enabled: false, day: "sunday" }
  },

  // Appearance
  "appearance": {
    "showBadge": true,
    "celebrateMilestones": true,
    "theme": "dark"
  }
}
```

---

## 🎯 Implementation Priority

### Phase 1: Core (Week 1)
- ✅ Dashboard UI
- ✅ Data files (blind75.json, etc.)
- ✅ Storage layer
- ✅ Basic streak counting

### Phase 2: Lists (Week 2)
- ✅ Lists view
- ✅ Detailed list view with checkboxes
- ✅ Progress tracking
- ✅ Resume functionality

### Phase 3: Settings (Week 3)
- ✅ Settings UI
- ✅ Flexible streak rules (lists + any submission)
- ✅ **Topic-based streaks** (NEW!)
- ✅ Topic selection UI
- ✅ **Company-based streaks** (NEW!)
- ✅ Company selection UI
- ✅ Reminder settings
- ✅ Export/Import

### Phase 4: Polish (Week 4)
- ✅ Milestone celebrations
- ✅ Share functionality
- ✅ Problems Explorer integration
- ✅ Animations

---

## 🌟 NEW FEATURES: Topic & Company-Based Streaks

### Feature 1: Topic-Based Streaks

**Why This is Powerful:**

1. **Focused Learning**
   - Users mastering DP can track DP-only streak
   - Creates accountability for topic-specific practice

2. **Flexible Goals**
   - Combine with lists: "Daily Challenge OR DP problem"
   - Perfect for interview prep: Focus on weak areas

3. **Multiple Topic Tracking**
   - Track progress across 2-3 topics simultaneously
   - E.g., "DP" + "Graph" + "Tree"

4. **Use Cases:**
   - "I'm weak at DP, need to practice daily"
   - "Learning graphs this week"
   - "Strengthening arrays before interview"

5. **SEO Opportunity:**
   - "dynamic programming streak tracker"
   - "leetcode topic tracker"
   - "graph problems daily practice"

**Example User Journey:**
1. User realizes they're weak at Dynamic Programming
2. Opens Settings → Topic Focus
3. Selects "Dynamic Programming"
4. Dashboard shows: "🎯 DP Streak: 5 days"
5. Solves one DP problem daily → Maintains streak
6. After 30 days → Masters DP fundamentals!

---

### Feature 2: Company-Based Streaks

**Why This is Game-Changing:**

1. **Interview-Focused Prep**
   - User has Google interview → Tracks Google-tagged problems
   - Most relevant practice for specific interviews

2. **Company-Specific Patterns**
   - Each company has preferred problem types
   - Google loves graphs, Meta loves trees, Amazon loves DP
   - Targeted practice = better interview performance

3. **Multiple Company Tracking**
   - Preparing for multiple interviews simultaneously
   - E.g., "Google" + "Meta" + "Amazon"

4. **Use Cases:**
   - "Google interview in 2 weeks"
   - "Meta phone screen next month"
   - "Applying to FAANG, track all companies"
   - "Want to work at startups, track Stripe/Airbnb"

5. **SEO Opportunity:**
   - "google leetcode interview prep"
   - "meta coding interview tracker"
   - "faang interview preparation"
   - "company-specific leetcode problems"

6. **Competitive Advantage:**
   - **NO OTHER EXTENSION HAS THIS!**
   - LeetCopilot, LeetHub, BetterLC → None have company streaks
   - Unique value proposition for interview prep market

**Example User Journey:**
1. User gets Google interview scheduled
2. Opens Settings → Company Focus
3. Selects "Google"
4. Dashboard shows: "🎯 Google Streak: 7 days"
5. Opens Problems Explorer → Filters by Google
6. Solves Google-tagged problems daily
7. Interview day → Confident with Google's problem patterns!

---

### Combined Power: Topic + Company Streaks

**Ultimate Interview Prep Scenario (OR Mode - Flexible):**
1. User has Meta interview in 3 weeks
2. Knows Meta loves tree problems
3. Settings:
   - Mode: **OR**
   - ✅ Company Focus: "Meta"
   - ✅ Topic Focus: "Tree", "Graph"
4. Dashboard shows: "🎯 Maintained via: Meta + Tree"
5. Solves ANY Meta problem OR ANY Tree/Graph problem
6. Flexible prep with focus!

**Ultimate Interview Prep Scenario (AND Mode - Laser Focused):**
1. User has Google interview in 1 week (final push!)
2. Knows Google loves graph + DP problems
3. Settings:
   - Mode: **AND**
   - ✅ Company Focus: "Google"
   - ✅ Topic Focus: "Graph"
4. Dashboard shows: "🎯 STRICT: Google + Graph"
5. MUST solve problems that are BOTH Google-tagged AND Graph
6. Most targeted prep possible - only ~15-20 qualifying problems!

---

## 🔀 Combination Mode: OR vs AND

**Users can toggle between two modes for maximum flexibility:**

### OR Mode (Default - Flexible)

**How it works:**
- Solving **ANY** enabled condition maintains your streak
- Most user-friendly and realistic for daily practice

**Example Configuration:**
```
Enabled:
- Daily Challenge
- Blind 75
- Topic Focus: [DP, Graph]
- Company Focus: [Google]
```

**What counts as streak:**
- ✅ Solved Daily Challenge → Streak maintained
- ✅ Solved any Blind 75 problem → Streak maintained
- ✅ Solved any DP problem → Streak maintained
- ✅ Solved any Graph problem → Streak maintained
- ✅ Solved any Google-tagged problem → Streak maintained

**Use case:** "I want flexibility - any practice in my focus areas counts!"

---

### AND Mode (Strict - Targeted)

**How it works:**
- Must satisfy **ALL** enabled conditions in one day
- Ultra-targeted prep, hardcore mode

**Example Configuration:**
```
Enabled:
- Topic Focus: [DP]
- Company Focus: [Google]
```

**What counts as streak:**
- ❌ Solved a DP problem (not Google-tagged) → Streak broken
- ❌ Solved a Google problem (not DP) → Streak broken
- ✅ Solved a problem that is BOTH DP AND Google → Streak maintained

**Use case:** "Google interview in 2 weeks, ONLY want to practice Google DP problems!"

---

### Smart Behavior for Multiple Selections

**Within a category (Topics/Companies): Always OR**
- If you select "DP" + "Graph" topics:
  - OR mode: Solve any DP **OR** any Graph problem
  - AND mode: Solve any DP **OR** any Graph problem (still OR within category)
- Why? Requiring both DP **AND** Graph every day is too strict

**Between categories: Respects mode setting**
- OR mode: Daily Challenge **OR** Blind 75 **OR** Topic **OR** Company
- AND mode: Daily Challenge **AND** Blind 75 **AND** Topic **AND** Company

---

### Real-World Examples

**Example 1: Casual Learner (OR Mode)**
```
Settings:
- Mode: OR
- ☑ Daily Challenge
- ☑ Blind 75

Result: Solve either the daily challenge OR any Blind 75 problem
```

**Example 2: Interview Prep - Flexible (OR Mode)**
```
Settings:
- Mode: OR
- ☑ Topic Focus: [DP, Graph, Tree]
- ☑ Company Focus: [Google, Meta]

Result: Solve any DP/Graph/Tree problem OR any Google/Meta problem
Very flexible, easy to maintain streak
```

**Example 3: Interview Prep - Laser Focused (AND Mode)**
```
Settings:
- Mode: AND
- ☑ Topic Focus: [DP]
- ☑ Company Focus: [Google]

Result: MUST solve a problem that is BOTH DP AND Google-tagged
Very strict, only ~20-30 qualifying problems
Perfect for last 2 weeks before Google interview
```

**Example 4: List Completionist (OR Mode)**
```
Settings:
- Mode: OR
- ☑ Blind 75
- ☑ NeetCode 150
- ☑ LeetCode 75

Result: Solve any problem from any of these lists
Maximum flexibility while staying focused on curated lists
```

---

## ❓ Questions for Review

1. **Dashboard**: Is the layout good? Too much/little info?
2. **Lists View**: Should we show mini-preview of problems in collapsed view?
3. **Detailed List**: Should categories be expanded or collapsed by default?
4. **Settings**: Any other settings needed?
5. **Topic Streaks**: Should we limit to max 3 topics or allow unlimited?
6. **Topic Streaks**: Show separate counter per topic or just in main streak?
7. **Company Streaks**: Should we limit to max 3 companies or allow unlimited?
8. **Company Streaks**: Show company streak counter on dashboard or only in settings?
9. **Combined Streaks**: If both Topic + Company enabled, how to display? "🎯 DP + Google" or separate?
10. **OR/AND Mode**: Should this be a dropdown, toggle switch, or radio buttons?
11. **OR/AND Mode**: Show the explanation dynamically based on current selection?
12. **Celebration**: Too much? Should we make it optional?

---

## 🚀 Ready to Build?

Once you approve these mockups, I'll start with:

**Phase 1 - Data Files (Day 1):**
1. Create `blind75.json` with all 75 problems organized by category
2. Create `neetcode150.json` with all 150 problems
3. Create `leetcode75.json` with all 75 problems
4. Add topic tags and company tags to each problem

**Phase 2 - Dashboard UI (Days 2-3):**
1. Build main dashboard with stats, streak, progress
2. Add tab navigation (Dashboard / Lists / Settings)
3. Implement streak card with "Maintained via" display
4. Add quick action buttons

**Phase 3 - Storage & Logic (Days 4-5):**
1. Implement Chrome Storage schema
2. Build flexible streak counting logic with OR/AND modes
3. Add topic streak tracking
4. Add company streak tracking
5. Implement combination mode toggle
6. Sync with LeetCode profile

**Phase 4 - Lists & Settings (Days 6-7):**
1. Build Study Lists view with progress cards
2. Create detailed list view with checkboxes
3. Build Settings UI with all options
4. Add Topic Streak Manager modal
5. Add Company Streak Manager modal
6. **Update Problems Explorer:**
   - Auto-apply filters from Settings
   - Add OR/AND mode toggle
   - Show smart hints for filter counts
   - Sync behavior between Settings and Explorer

**Total Timeline: ~1 week for full implementation**

Let me know what changes you'd like! 🔥

---

## 💎 Competitive Advantages Summary

**What makes this a MAJOR upgrade:**

1. ✅ **Blind 75 / NeetCode 150 / LeetCode 75 tracking**
   - Only LeetHub has list tracking, but not integrated with streaks

2. ✅ **Flexible streak rules (OR/AND toggle)**
   - Unique! No competitor allows multiple streak conditions
   - OR mode: Flexible practice (any enabled condition)
   - AND mode: Laser-focused prep (all conditions required)

3. ✅ **Topic-based streaks**
   - **FIRST EXTENSION TO HAVE THIS!**
   - Perfect for focused learning

4. ✅ **Company-based streaks**
   - **FIRST EXTENSION TO HAVE THIS!**
   - Game-changer for interview prep

5. ✅ **Dashboard-centric design**
   - Better UX than competitors' separate pages

6. ✅ **Cross-device sync via Chrome Storage**
   - LeetHub requires GitHub, we use native sync

**SEO Keywords We'll Dominate:**
- "leetcode streak tracker"
- "blind 75 tracker extension"
- "leetcode company interview prep"
- "dynamic programming streak"
- "google leetcode problems tracker"
- "faang interview prep extension"
- "leetcode topic practice"

**This positions LeetDaily as THE comprehensive interview prep extension!** 🚀
