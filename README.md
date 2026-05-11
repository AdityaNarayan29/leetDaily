# LeetDaily

**The all-in-one Chrome extension for LeetCode interview prep.**

Track 6 curated DSA sheets, daily challenges, FAANG company tags, dual streaks, and browse 3800+ problems — all one click from your browser toolbar.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kpmmlpoonleloofchbbfnmicchmhehcf?style=flat-square)](https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**[Install](https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf)** · **[Landing Page](https://leetdaily.masst.dev)** · **[DSA Reference](https://leetdaily.masst.dev/dsa)** · **[Blog](https://leetdaily.masst.dev/blog)**

---

## Highlights

- **6 Curated DSA Sheets** — Blind 75, NeetCode 150, Namaste DSA (147), Fraz DSA (305), Striver SDE (121), LeetCode 75 — with live progress bars and sequential next-unsolved
- **Dual Streak Tracking** — 🎯 Focus streak (days on your prep plan) + 🔥 LeetCode streak (official, from API)
- **Streak Freezes** — 3 per month, auto-applied when you miss a day
- **3800+ Problems Explorer** — Browse, filter by difficulty/topics/companies/lists, sort, 6 list badges
- **Daily Challenge Card** — ✓ Solved badge, countdown timer, topic & company tags
- **Smart Reminders** — Daily reminder + urgent alert 2 hours before midnight reset
- **Cross-Device Settings Sync** — Preferences sync via Cloudflare Workers + KV
- **Light/Dark Theme** — Toggle in settings
- **Privacy-First** — Solve history stays local. No tracking, no ads.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Chrome Extension                         │
│                                                              │
│  content.js ──► background.js (service worker) ◄── popup.js │
│  (detect        (streaks, badge,    (UI, settings,           │
│   submissions)   alarms, API)        progress, theme)        │
│                      │                     │                 │
│              list-config.js ◄──────────────┘                 │
│              (single source of truth for 6 DSA sheets)       │
└──────────────────┬───────────────┬───────────────────────────┘
                   │               │
          LeetCode GraphQL    Cloudflare KV
          (streaks, stats,    (settings sync)
           daily challenge)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for full diagrams including feature map, data flow, and user flows.

---

## Features

### Dashboard
- **Daily Challenge** — Today's problem with difficulty, acceptance rate, topic & company tags, ✓ Solved badge, countdown timer
- **Your Stats** — Total solved with Easy/Medium/Hard breakdown, synced from LeetCode
- **30-Day Heatmap** — Activity visualization with color-coded intensity and daily challenge checkmarks
- **Dual Streak Display** — 🎯 Focus streak + 🔥 LeetCode streak in the header
- **Streak Detail Modal** — Longest streak (calculated from full history, all years), milestones, last 7 days
- **Profile Link** — Click avatar/username to open your LeetCode profile

### 6 Curated DSA Sheets

| Sheet | Problems | Color | Badge | Source |
|-------|----------|-------|-------|--------|
| Blind 75 | 74 | Teal | B75 | Yangshun Tay |
| NeetCode 150 | 158 | Orange | NC | NeetCode |
| Namaste DSA | 147 | Purple | ND | NamasteDev |
| Fraz DSA | 305 | Amber | FZ | LeadCoding |
| Striver SDE | 121 | Pink | SV | TakeUForward |
| LeetCode 75 | 75 | Red | LC | LeetCode |

Each sheet has: live progress bar, percentage, sequential next-unsolved, click-to-explore, external sheet link (where applicable).

### Problems Explorer
- Browse and search 3800+ LeetCode problems in a full-page view
- Filter by difficulty, topics, companies, and 6 curated lists
- Sort by ID, title, difficulty, acceptance rate, or frequency
- 6 list badges (B75, NC, ND, FZ, SV, LC) on every problem row
- Solved checkmarks synced from your LeetCode account

### Streak System
- **🔥 LeetCode Streak** — From LeetCode's API (daily challenge streak)
- **🎯 Focus Streak** — Consecutive days solving from your selected focus areas
- **❄️ Streak Freezes** — 3 per month, auto-applied. Frozen days preserve streak without incrementing
- **Badge Display** — Choose which streak appears on the toolbar icon
- **Badge Colors** — Green (goal met), orange (pending), red blink (<2hrs to midnight)
- **Longest Streak** — Calculated from full submission history (fetches all years)

### Focus Areas
Set your prep focus in settings — any combination of:
- Curated lists (Blind 75, NeetCode 150, Striver SDE, etc.)
- Company tags (Google, Meta, Amazon, etc.)
- Topic tags (Arrays, DP, Graphs, etc.)
- Daily Challenge
- Any submission

Your focus streak (🎯) tracks consecutive days meeting your selected requirements (OR mode — any one match counts).

### Smart Reminders
- Daily reminder at your chosen time (12h format, AM/PM)
- Urgent streak-at-risk notification 2 hours before midnight UTC
- Uses `chrome.alarms` for reliability (survives service worker suspension)

### Cross-Device Sync
- Preferences sync via Cloudflare Workers + KV, keyed by LeetCode username
- Synced: requirements, reminder time, badge settings, theme
- NOT synced: solve history, progress, streaks (stays local)
- Offline-first: local storage is always source of truth

### Data & Settings
- Export all progress as JSON backup
- Import from backup (validates structure)
- Light/dark theme toggle
- Feedback links (GitHub Issues + email)

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Extension | Chrome Manifest V3, vanilla JavaScript |
| Service Worker | `chrome.alarms`, `chrome.storage.local`, `chrome.notifications` |
| Content Script | DOM mutation observer for submission detection |
| Popup | HTML + Tailwind CSS + vanilla JS |
| Cloud Sync | Cloudflare Workers + KV |
| Landing Page | Next.js 15, TypeScript, Tailwind CSS |
| Blog | MDX with custom rendering |
| Deployment | Vercel (landing), Cloudflare (worker) |

---

## Project Structure

```
leetDaily/
├── list-config.js               # ★ Single source of truth for all 6 curated DSA lists
├── data/                        # Problem metadata (JSON)
│   ├── leetcode-problems.json   # 3846 problems with company tags (5.5MB)
│   ├── blind75.json             # Blind 75 — 74 problems, 15 categories
│   ├── neetcode150.json         # NeetCode 150 — 158 problems, 18 categories
│   ├── namastedsa.json          # Namaste DSA — 147 problems, 14 categories
│   ├── frazdsa.json             # Fraz DSA — 305 problems, 18 categories
│   ├── striversde.json          # Striver SDE — 121 problems, 27 categories
│   └── leetcode75.json          # LeetCode 75 — 75 problems, 17 categories
├── background.js                # Service worker — streaks, badge, alarms, notifications, API
├── content.js                   # Content script — submission detection on leetcode.com
├── popup.html / popup.js        # Extension popup UI and logic
├── problems-explorer.html/.js   # Full-page problem browser with filters and badges
├── sync.js                      # Cross-device settings sync (Cloudflare KV)
├── theme-init.js                # Apply saved theme before first paint (prevents flash)
├── manifest.json                # Chrome extension manifest (MV3)
├── icon.png                     # Extension icon
├── styles/                      # Tailwind CSS (input + compiled output)
├── worker/                      # Cloudflare Worker for preferences sync
│   └── src/index.js             # GET/PUT /prefs/:username API
├── landing/                     # Next.js landing site
│   └── app/
│       ├── page.tsx             # Homepage with JSON-LD structured data
│       ├── dsa/                 # DSA Master Reference (decision trees + patterns)
│       ├── privacy/             # Privacy policy
│       └── blog/                # Blog with MDX posts
├── ARCHITECTURE.md              # Feature map, system architecture, user flow diagrams
└── test_streak.js               # Streak logic test suite (85 tests)
```

---

## Adding a New Curated List

The codebase uses a data-driven config. Adding a new DSA sheet:

1. Create `data/newlist.json` with standard format: `{ name, totalProblems, categories: [{ name, problemIds }] }`
2. Add one entry to `CURATED_LISTS` in `list-config.js` (id, name, color, badge, etc.)
3. Add `data/newlist.json` to `manifest.json` web_accessible_resources
4. Add badge CSS class in `problems-explorer.html`
5. Add progress card HTML block in `popup.html`

No changes needed in `background.js`, `popup.js`, `problems-explorer.js`, `content.js`, or `sync.js`.

---

## Installation

### Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store listing](https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf)
2. Click "Add to Chrome"
3. Pin the extension to your toolbar

### Manual / Development
```bash
git clone https://github.com/AdityaNarayan29/leetDaily.git
cd leetDaily
```
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the project folder

### Landing Page (local dev)
```bash
cd landing
npm install
npm run dev
```

### Cloudflare Worker
```bash
cd worker
npx wrangler deploy
```

---

## Privacy

- **Solve history, progress, and streaks** — stored locally on your device, never sent to any server
- **Only settings/preferences** — synced to Cloudflare KV, keyed by LeetCode username
- No passwords, personal data, or solve history is transmitted
- No tracking, no ads, no analytics

See our full [Privacy Policy](https://leetdaily.masst.dev/privacy).

---

## Contributing

Contributions welcome! Please open an issue first for major changes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push and open a Pull Request

**Report bugs or suggest features:** [GitHub Issues](https://github.com/AdityaNarayan29/leetDaily/issues)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Built by [Aditya Narayan](https://adityanarayan.co.in/) for developers preparing for coding interviews.**
