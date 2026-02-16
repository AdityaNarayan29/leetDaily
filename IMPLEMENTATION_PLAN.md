# LeetDaily Extension - Phase-Wise Implementation Plan

> **Total Timeline:** ~7-10 days for full implementation
> **Estimated Effort:** 40-50 hours

---

## 📊 Phase 1: Data Files & Foundation (Day 1)

**Goal:** Create all problem list data files with categorization

### Tasks:

#### 1.1 Create Blind 75 Data File
- [ ] **File:** `data/blind75.json`
- [ ] Structure: Array of 75 problems with categories
- [ ] Fields per problem:
  - `id` (LeetCode problem number)
  - `title` (problem name)
  - `difficulty` ("Easy", "Medium", "Hard")
  - `category` ("Array & Hashing", "Two Pointers", "Stack", etc.)
  - `url` (leetcode.com link)
  - `topics` (array: ["Array", "Hash Table", etc.])
  - `companies` (array: ["Google", "Amazon", etc.])
- [ ] Organize into 9 categories:
  - Array & Hashing (9 problems)
  - Two Pointers (5 problems)
  - Sliding Window (6 problems)
  - Stack (7 problems)
  - Binary Search (7 problems)
  - Linked List (6 problems)
  - Trees (11 problems)
  - Tries (3 problems)
  - Heap/Priority Queue (3 problems)
  - Backtracking (9 problems)
  - Graphs (9 problems)
  - Dynamic Programming (12 problems)

#### 1.2 Create NeetCode 150 Data File
- [ ] **File:** `data/neetcode150.json`
- [ ] Same structure as Blind 75
- [ ] All 150 problems with categories
- [ ] Includes all Blind 75 problems + 75 more

#### 1.3 Create LeetCode 75 Data File
- [ ] **File:** `data/leetcode75.json`
- [ ] Same structure as above
- [ ] All 75 problems from LeetCode study plan
- [ ] Official LeetCode 75 categorization

#### 1.4 Create Helper Utilities
- [ ] **File:** `utils/list-helpers.js`
- [ ] Functions:
  - `getListProblems(listName)` - Load problems from JSON
  - `getProblemById(id)` - Get problem details
  - `getCategoriesForList(listName)` - Get all categories
  - `getProblemsInCategory(listName, category)` - Filter by category
  - `isProblemInList(problemId, listName)` - Check membership

**Deliverables:**
- ✅ 3 JSON data files with all problems
- ✅ Helper functions for data access
- ✅ Manual testing with sample queries

---

## 🎨 Phase 2: Dashboard UI (Days 2-3)

**Goal:** Build the main popup UI with dashboard view

### Tasks:

#### 2.1 Restructure Popup HTML
- [ ] **File:** `popup.html`
- [ ] Update structure:
  ```html
  <div id="app">
    <div id="navbar"><!-- Logo, Search, Settings --></div>
    <div id="content">
      <div id="dashboard" class="tab-content active">
        <!-- Dashboard content -->
      </div>
      <div id="lists" class="tab-content">
        <!-- Study lists -->
      </div>
      <div id="settings" class="tab-content">
        <!-- Settings -->
      </div>
    </div>
  </div>
  ```

#### 2.2 Build Dashboard Components
- [ ] **File:** `components/dashboard.js`
- [ ] User greeting section
- [ ] Stats overview card (Total, Easy, Medium, Hard)
- [ ] Streak card with:
  - Current streak number
  - Progress bar to next milestone
  - "Maintained via" indicator
  - Click → Opens streak detail modal
- [ ] Today's Progress section:
  - Daily Challenge status
  - Blind 75 progress (X/75)
  - NeetCode 150 progress (X/150)
  - LeetCode 75 progress (X/75)
- [ ] Quick Actions buttons:
  - Solve Daily Challenge
  - Problems Explorer
  - Study Lists

#### 2.3 Build Stats Component
- [ ] **File:** `components/stats.js`
- [ ] Fetch from LeetCode profile (existing code)
- [ ] Display: Total, Easy, Medium, Hard
- [ ] Style: 4-column grid with numbers + labels

#### 2.4 Build Streak Card Component
- [ ] **File:** `components/streak-card.js`
- [ ] Display current streak
- [ ] Calculate next milestone (7, 14, 30, 60, 90, 180, 365 days)
- [ ] Progress bar with percentage
- [ ] "Maintained via" text from settings
  - OR mode: "Daily + DP" (shows active conditions)
  - AND mode: "STRICT: Google + DP"
- [ ] Click handler → Open streak detail modal

#### 2.5 Build Today's Progress Component
- [ ] **File:** `components/todays-progress.js`
- [ ] Daily Challenge: Check if solved today
- [ ] List progress: Read from storage
- [ ] Format: "✅ Solved" or "⏳ X/75"

#### 2.6 Tab Navigation
- [ ] **File:** `components/tabs.js`
- [ ] Tab switching logic
- [ ] Active tab highlighting
- [ ] Hide/show content sections
- [ ] Smooth transitions

#### 2.7 Update Styles
- [ ] **File:** `styles/dashboard.css`
- [ ] Dark theme (#0a0a0a background)
- [ ] Card styles (#1a1a1a with border)
- [ ] Orange accent (#ffa116)
- [ ] Responsive for 400px width

**Deliverables:**
- ✅ Fully functional Dashboard tab
- ✅ All components render correctly
- ✅ Tab navigation works
- ✅ Matches mockup design

---

## 💾 Phase 3: Storage & Streak Logic (Days 4-5)

**Goal:** Implement data persistence and streak counting logic

### Tasks:

#### 3.1 Setup Chrome Storage Schema
- [ ] **File:** `storage/schema.js`
- [ ] Define storage structure:
  ```javascript
  {
    username: string,
    totalSolved: number,
    currentStreak: number,
    longestStreak: number,
    lastSolvedDate: string,
    lastSolvedProblemId: string,
    streakSettings: {
      combinationMode: "OR" | "AND",
      dailyChallenge: boolean,
      blind75: boolean,
      neetcode150: boolean,
      leetcode75: boolean,
      topicFocus: boolean,
      selectedTopics: string[],
      companyFocus: boolean,
      selectedCompanies: string[],
      anySubmission: boolean
    },
    blind75: string[], // completed problem IDs
    neetcode150: string[],
    leetcode75: string[],
    topicStreaks: {
      [topicName]: {
        currentStreak: number,
        longestStreak: number,
        lastSolvedDate: string,
        solvedProblems: string[]
      }
    },
    companyStreaks: {
      [companyName]: { /* same structure */ }
    },
    reminders: { /* reminder settings */ },
    appearance: { /* appearance settings */ }
  }
  ```

#### 3.2 Storage Helper Functions
- [ ] **File:** `storage/helpers.js`
- [ ] `getStorage(key)` - Read from chrome.storage.sync
- [ ] `setStorage(key, value)` - Write to storage
- [ ] `updateStorage(updates)` - Batch update
- [ ] `clearStorage()` - Reset all data
- [ ] `exportData()` - Export as JSON
- [ ] `importData(json)` - Import from JSON

#### 3.3 Streak Detection Logic
- [ ] **File:** `logic/streak-detector.js`
- [ ] `detectProblemSolved(problemId, problemData)` - Main entry point
- [ ] `checkDailyChallenge(problemId)` - Is this today's daily?
- [ ] `checkListMembership(problemId)` - Which lists contain this?
- [ ] `checkTopicMatch(problemId, topics)` - Does it match selected topics?
- [ ] `checkCompanyMatch(problemId, companies)` - Does it match companies?
- [ ] Return: Which conditions were satisfied

#### 3.4 Streak Counting Logic (OR Mode)
- [ ] **File:** `logic/streak-counter-or.js`
- [ ] `shouldMaintainStreak(satisfiedConditions, settings)` - OR logic
- [ ] Check if ANY enabled condition was satisfied
- [ ] Return: true if streak maintained

#### 3.5 Streak Counting Logic (AND Mode)
- [ ] **File:** `logic/streak-counter-and.js`
- [ ] `shouldMaintainStreak(satisfiedConditions, settings)` - AND logic
- [ ] Check if ALL enabled conditions were satisfied
- [ ] Within-category OR: DP OR Graph (if both selected)
- [ ] Between-category AND: Topic AND Company
- [ ] Return: true if streak maintained

#### 3.6 Streak Update Logic
- [ ] **File:** `logic/streak-updater.js`
- [ ] `updateStreak(maintained)` - Update streak count
- [ ] If maintained:
  - Increment currentStreak
  - Update longestStreak if needed
  - Update lastSolvedDate
- [ ] If broken (yesterday skipped):
  - Reset currentStreak to 1
  - Update lastSolvedDate

#### 3.7 Topic Streak Tracking
- [ ] **File:** `logic/topic-streaks.js`
- [ ] `updateTopicStreak(topic, problemId)` - Update individual topic
- [ ] Track per-topic current/longest streaks
- [ ] Store solved problems per topic

#### 3.8 Company Streak Tracking
- [ ] **File:** `logic/company-streaks.js`
- [ ] `updateCompanyStreak(company, problemId)` - Update individual company
- [ ] Track per-company current/longest streaks
- [ ] Store solved problems per company

#### 3.9 Content Script Integration
- [ ] **File:** `content.js` (Update existing)
- [ ] Detect when user submits a solution
- [ ] Detect when solution is accepted
- [ ] Send message to background script with problem ID
- [ ] Extract problem data (title, difficulty, topics, companies)

#### 3.10 Background Script Logic
- [ ] **File:** `background.js` (Update existing)
- [ ] Listen for messages from content script
- [ ] When problem solved:
  - Run streak detection
  - Run streak counting (OR/AND based on settings)
  - Update storage
  - Update topic/company streaks
  - Show notification if milestone hit
  - Update badge icon

**Deliverables:**
- ✅ Complete storage layer
- ✅ Streak detection working
- ✅ OR and AND modes implemented
- ✅ Topic/company streaks tracking
- ✅ Content script detects submissions
- ✅ Background script updates data

---

## 📚 Phase 4: Lists & Settings UI (Days 6-7)

**Goal:** Build Study Lists view and Settings panel

### Tasks:

#### 4.1 Study Lists View
- [ ] **File:** `components/lists.js`
- [ ] Filter tabs: [All] [In Progress] [Completed]
- [ ] List cards for each (Blind 75, NC150, LC75):
  - Progress bar with percentage
  - Completed count (X/75)
  - "Counts toward streak" badge (if enabled in settings)
  - [View All] button
  - [Resume] button (opens next unsolved problem)
- [ ] Tip box: "Enable lists in Settings..."

#### 4.2 Detailed List View
- [ ] **File:** `components/list-detail.js`
- [ ] Header with list name and overall progress
- [ ] Filter tabs: [All] [Todo] [Done]
- [ ] Search bar
- [ ] Collapsible categories (from data files)
- [ ] Problem rows:
  - Checkbox (checked if completed)
  - Problem ID
  - Problem title
  - Difficulty badge
  - Click → Opens on LeetCode
- [ ] Checkbox handler → Save to storage

#### 4.3 Settings Panel
- [ ] **File:** `components/settings.js`
- [ ] **Streak Counting Section:**
  - Combination Mode dropdown: [OR ▼] / [AND ▼]
  - Checkboxes for each option:
    - Daily Challenge
    - Blind 75
    - NeetCode 150
    - LeetCode 75
    - Topic Focus (with [+ Add Topic] button)
    - Company Focus (with [+ Add Company] button)
    - Any Submission
  - Dynamic explanation based on mode
  - Save → chrome.storage.sync

- [ ] **Reminders Section:**
  - Daily reminder toggle + time picker
  - Streak at risk toggle + time picker
  - Weekly report toggle + day picker

- [ ] **Appearance Section:**
  - Show streak badge on icon
  - Celebrate milestones
  - Theme dropdown (Dark only for now)

- [ ] **Data Section:**
  - [Export Progress] button
  - [Import] button (with file picker)
  - [Reset All Data] button (with confirmation)

#### 4.4 Topic Streak Manager Modal
- [ ] **File:** `components/topic-manager.js`
- [ ] Modal overlay with close button
- [ ] **Selected Topics section:**
  - Cards for each selected topic
  - Show current streak
  - [Remove] button
- [ ] **Available Topics section:**
  - Checkboxes for all LeetCode topics
  - Common topics: DP, Graph, Tree, Array, etc.
  - [+ show more] to expand full list
- [ ] [Save & Close] button
- [ ] Save to storage

#### 4.5 Company Streak Manager Modal
- [ ] **File:** `components/company-manager.js`
- [ ] Modal overlay with close button
- [ ] **Selected Companies section:**
  - Cards for each selected company
  - Show current streak
  - Show problem count available
  - [Remove] button
- [ ] **Available Companies section:**
  - Search bar
  - Checkboxes for top companies
  - Problem count per company
  - [+ show more] for full list (150+ companies)
- [ ] [Save & Close] button
- [ ] Save to storage

#### 4.6 Streak Detail Modal
- [ ] **File:** `components/streak-detail.js`
- [ ] Modal showing:
  - Large streak number
  - Last 7 days history with checkmarks
  - What maintained streak each day
  - Next reset countdown
  - Next milestone
  - Longest streak
  - [Share Streak] button
  - [View History] button

#### 4.7 Milestone Celebration Modal
- [ ] **File:** `components/celebration.js`
- [ ] Modal that appears when milestone hit
- [ ] Show:
  - 🎉 MILESTONE! 🎉
  - Streak number (14 days, 30 days, etc.)
  - Encouragement message
  - Badge unlocked message
  - [Share on Twitter] button
  - [Share on LinkedIn] button
  - [Close] button

**Deliverables:**
- ✅ Study Lists tab functional
- ✅ Detailed list view with checkboxes
- ✅ Settings panel with all options
- ✅ Topic and Company managers
- ✅ All modals implemented
- ✅ Settings persist to storage

---

## 🔍 Phase 5: Problems Explorer Updates (Day 8)

**Goal:** Update existing Problems Explorer with auto-filters and OR/AND mode

### Tasks:

#### 5.1 Auto-Apply Filters from Settings
- [ ] **File:** `problems-explorer.js` (Update existing)
- [ ] On page load:
  - Read streak settings from storage
  - Pre-check matching filters:
    - Study Lists (if enabled in settings)
    - Topics (if Topic Focus enabled)
    - Companies (if Company Focus enabled)
  - Set mode to match settings (OR/AND)
  - Apply filters automatically

#### 5.2 Add OR/AND Mode Toggle
- [ ] Add banner at top: "From Your Streak Settings"
- [ ] Show current mode: OR or AND
- [ ] [Switch to AND] / [Switch to OR] button
- [ ] [×] button to clear streak-based filters
- [ ] Dynamic explanation text based on mode

#### 5.3 Smart Hints
- [ ] In OR mode:
  - Show count of problems matching ALL filters
  - "(18 problems match ALL filters)"
- [ ] In AND mode:
  - Show total count
  - "18 problems found"
  - "🎯 Perfect for your Google DP interview prep!"

#### 5.4 Filter Sync Behavior
- [ ] Opening from Dashboard → Auto-apply settings
- [ ] Opening from browser → Use last session
- [ ] Changing filters → Temporary, doesn't save to Settings
- [ ] [Clear Filters] → Browse all problems
- [ ] [Customize] → Modify without affecting Settings

#### 5.5 Add List Badges
- [ ] For each problem row, show badges:
  - [B75] - Blind 75
  - [NC] - NeetCode 150
  - [LC] - LeetCode 75
  - [G] - Google
  - [M] - Meta
  - etc.

#### 5.6 Add Checkboxes
- [ ] If problem is in any tracked list, show checkbox
- [ ] Pre-check if already solved
- [ ] Click → Toggle completion, save to storage

**Deliverables:**
- ✅ Explorer auto-applies filters
- ✅ OR/AND toggle works
- ✅ Smart hints display
- ✅ Badges show on problems
- ✅ Checkboxes functional

---

## 🎨 Phase 6: Polish & Testing (Day 9-10)

**Goal:** Bug fixes, animations, and final polish

### Tasks:

#### 6.1 Add Animations
- [ ] Tab switching transitions
- [ ] Modal fade-in/fade-out
- [ ] Streak card pulse on update
- [ ] Milestone celebration confetti
- [ ] Progress bar fill animations

#### 6.2 Responsive Design
- [ ] Test all views at 400px width
- [ ] Ensure all text is readable
- [ ] No horizontal scroll
- [ ] Touch-friendly buttons (44px min)

#### 6.3 Error Handling
- [ ] Storage read/write failures
- [ ] LeetCode API failures
- [ ] Invalid data imports
- [ ] Network errors
- [ ] Show user-friendly error messages

#### 6.4 Performance Optimization
- [ ] Lazy load list data
- [ ] Debounce search inputs
- [ ] Throttle storage writes
- [ ] Cache LeetCode profile data

#### 6.5 Manual Testing
- [ ] Test all user flows from mockups
- [ ] Test OR mode streak detection
- [ ] Test AND mode streak detection
- [ ] Test topic streaks
- [ ] Test company streaks
- [ ] Test filter sync in Explorer
- [ ] Test export/import
- [ ] Test reminders
- [ ] Test milestone celebrations

#### 6.6 Cross-Browser Testing
- [ ] Chrome (primary)
- [ ] Edge (Chromium)
- [ ] Brave (Chromium)

#### 6.7 Documentation
- [ ] Update README with new features
- [ ] Add screenshots to README
- [ ] Document streak counting logic
- [ ] Add troubleshooting guide

#### 6.8 Package for Chrome Web Store
- [ ] Update manifest version
- [ ] Run zip.sh to create package
- [ ] Test installed extension
- [ ] Prepare store listing:
  - Screenshots (Dashboard, Lists, Settings, Explorer)
  - Description highlighting new features
  - Update promotional images
- [ ] Submit to Chrome Web Store

**Deliverables:**
- ✅ All animations working
- ✅ No bugs found in testing
- ✅ Extension performs well
- ✅ Documentation updated
- ✅ Ready for Chrome Web Store submission

---

## 📋 Testing Checklist

### Streak Detection Tests
- [ ] Daily Challenge solved → Streak maintained (OR mode)
- [ ] Blind 75 problem solved → Streak maintained (OR mode)
- [ ] DP problem solved → Topic streak updated
- [ ] Google problem solved → Company streak updated
- [ ] AND mode: DP + Google solved → Streak maintained
- [ ] AND mode: Only DP solved → Streak broken
- [ ] Skipped a day → Streak resets to 0
- [ ] Multiple problems in one day → Only counts as 1 day

### UI Tests
- [ ] Dashboard renders correctly
- [ ] Stats update when syncing profile
- [ ] Streak card shows correct info
- [ ] Tab navigation works
- [ ] Lists show correct progress
- [ ] Checkboxes persist on reload
- [ ] Settings save correctly
- [ ] Modals open/close smoothly

### Storage Tests
- [ ] Data persists across browser restarts
- [ ] Export downloads correct JSON
- [ ] Import restores data correctly
- [ ] Reset clears all data
- [ ] Cross-device sync works (Chrome Sync)

### Explorer Tests
- [ ] Filters auto-apply from settings
- [ ] OR/AND toggle works
- [ ] Badges show correctly
- [ ] Checkboxes update
- [ ] Search filters problems
- [ ] Pagination works

---

## 🚀 Success Metrics

After launch, track:
- ✅ Active users (target: 1000 in first month)
- ✅ Streak retention (% of users with 7+ day streak)
- ✅ Feature adoption:
  - % using Topic Focus
  - % using Company Focus
  - % using AND mode
  - % tracking Blind 75/NC150/LC75
- ✅ Chrome Web Store rating (target: 4.5+ stars)
- ✅ User feedback and feature requests

---

## 🔧 Maintenance Plan

Post-launch:
- Weekly: Check for bugs reported by users
- Monthly: Review analytics and usage patterns
- Quarterly: Add new features based on feedback
- As needed: Update problem lists if LeetCode changes them

---

**Total Phases:** 6
**Total Days:** 9-10 days
**Estimated Hours:** 40-50 hours

Ready to start Phase 1? 🔥
