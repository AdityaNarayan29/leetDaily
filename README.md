# LeetDaily

**The all-in-one Chrome extension for LeetCode interview prep.**

LeetDaily brings your daily LeetCode challenge, curated study lists, company tags, streak tracking, and a full problems explorer — all one click from your browser toolbar.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kpmmlpoonleloofchbbfnmicchmhehcf?style=flat-square)](https://chromewebstore.google.com/detail/leetcode-daily-challenge/kpmmlpoonleloofchbbfnmicchmhehcf)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## What's New in v2.0

- **Curated List Tracking** — Blind 75, NeetCode 150, and LeetCode 75 with live progress bars and next-unsolved shortcuts
- **Tag & Company Progress** — Track solved/total for selected topics and companies with intersection view
- **Problems Explorer** — Full-page browser for 2000+ problems with filters, sorting, list badges, and solved indicators
- **Configurable Streak Rules** — Choose what counts toward your streak: daily challenge, curated lists, topic/company tags, or any submission
- **30-Day Activity Heatmap** — Color-coded daily activity with submission counts and daily challenge checkmarks
- **Streak Detail Modal** — Click your streak to see 7-day history, longest streak, and milestone progress
- **Data Export/Import** — Backup and restore all your progress as JSON
- **Smooth Animations** — View transitions, accordion expand/collapse, progress bar fills, and milestone celebrations
- **2000+ Problems with Company Data** — Problem database with company frequency tags fetched from LeetCode

---

## Features

### Dashboard
- **Daily Challenge** — Today's problem with difficulty, acceptance rate, topic tags, and company tags
- **Your Stats** — Total solved with Easy/Medium/Hard breakdown, synced from your LeetCode account
- **30-Day Heatmap** — Activity visualization with color intensity showing daily solve counts
- **Streak Tracking** — Current streak with fire badge on the extension icon, milestone celebrations at 7, 14, 30, 50, 100, and 365 days
- **Streak Detail Modal** — Click your streak to see last 7 days history, longest streak, and progress to next milestone

### Curated Study Lists
- **Blind 75** — Track progress across the classic 75 interview problems
- **NeetCode 150** — Follow the NeetCode 150 roadmap with live progress bars
- **LeetCode 75** — LeetCode's own curated 75-problem study plan
- **Next Unsolved** — One-click jump to the next unsolved problem in any list

### Tag & Company Progress
- **Topic Progress** — Track solved/total for selected topics (Arrays, DP, Graphs, etc.)
- **Company Progress** — Track solved/total for target companies (Google, Meta, Amazon, etc.)
- **Intersection View** — See problems that match both your selected topics AND companies
- **Accordion Breakdown** — Expand to see individual tag progress with color-coded bars

### Problems Explorer
- **Full Problem Database** — Browse and search all 2000+ LeetCode problems
- **Advanced Filters** — Filter by difficulty, topics, companies, and curated lists
- **Sortable Columns** — Sort by ID, title, difficulty, acceptance rate, or frequency
- **Company Frequency** — See how often each company asks a specific problem
- **Clickable Chips** — Click any topic or company tag to jump straight to the explorer with that filter

### Smart Reminders
- **Daily Reminder** — Configurable notification at your chosen time
- **Streak at Risk** — Urgent alert 2 hours before midnight reset
- **Badge Counter** — Extension icon shows your current streak number

### Settings & Data
- **Flexible Streak Rules** — Choose what counts toward your streak: Daily Challenge, curated lists, topic/company problems, or any submission
- **Topic & Company Selection** — Combobox inputs to pick which topics and companies to track
- **Data Export/Import** — Backup and restore all your progress as JSON
- **Privacy-First** — All data stored locally in your browser, no external tracking

---

## Installation

### Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store listing](https://chromewebstore.google.com/detail/leetcode-daily-challenge/kpmmlpoonleloofchbbfnmicchmhehcf)
2. Click "Add to Chrome"
3. Pin the extension to your toolbar for quick access

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/adityanarayan/leetdaily.git
   cd leetdaily
   ```
2. Install dependencies and build:
   ```bash
   npm install
   npm run build:css
   ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked" and select the project folder

---

## Usage

1. Click the LeetDaily icon in your browser toolbar
2. View today's daily challenge with topic tags and company tags
3. Track your progress across Blind 75, NeetCode 150, and LeetCode 75
4. Use the Problems Explorer to browse, filter, and find problems by company or topic
5. Configure streak rules and reminders in Settings
6. Maintain your streak and hit milestones

---

## Project Structure

```
leetDaily/
├── data/                  # Problem metadata
│   ├── leetcode-problems.json   # 2000+ problems with company tags
│   ├── blind75.json             # Blind 75 list by category
│   ├── neetcode150.json         # NeetCode 150 list by category
│   └── leetcode75.json          # LeetCode 75 list by category
├── scripts/               # Dev tooling
│   └── fetch-problems.js  # Fetch/update problem data from LeetCode API
├── styles/                # Tailwind CSS
│   ├── input.css
│   └── output.css
├── utils/                 # Shared utilities
│   └── list-helpers.js
├── landing/               # Landing page (Next.js + TypeScript)
├── popup.html             # Extension popup UI
├── popup.js               # Extension popup logic
├── background.js          # Service worker (streak calc, alarms, notifications)
├── content.js             # Content script (LeetCode page integration)
├── problems-explorer.html # Full-page problems browser
├── problems-explorer.js   # Problems explorer logic
├── manifest.json          # Chrome extension manifest (MV3)
└── tailwind.config.js     # Tailwind configuration
```

### Running the Landing Page

```bash
cd landing
npm install
npm run dev      # Start dev server
npm run build    # Build for production
```

### Building the Extension

```bash
npm install
npm run build:css    # Compile Tailwind CSS
```

### Updating Problem Data

The problem database can be refreshed from the LeetCode API:

```bash
npm run fetch-problems          # Fetch all problems (basic data)
npm run fetch-problems:full     # Fetch with company frequency tags (slower, rate-limited)
```

This updates `data/leetcode-problems.json` with the latest problems, difficulty, topics, acceptance rates, and company tags.

---

## Privacy

LeetDaily respects your privacy:
- No personal data is collected or transmitted
- All data is stored locally in your browser
- Only connects to LeetCode to fetch problem data and sync your solved status

See our full [Privacy Policy](privacy.html) for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support

- **Issues**: [GitHub Issues](https://github.com/adityanarayan/leetdaily/issues)
- **Email**: masst.dev@gmail.com

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built for developers who grind LeetCode daily.**
