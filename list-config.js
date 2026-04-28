// list-config.js — THE source of truth for all curated DSA lists
// To add a new list: add one entry here + one data/*.json file + manifest.json. That's it.

var CURATED_LISTS = [
  {
    id: 'blind75',
    dataFile: 'blind75.json',
    name: 'Blind 75',
    shortName: 'B75',
    color: '#00b8a3',
    badgeCssClass: 'list-badge-b75',
    totalFallback: 74,
    sequential: false,
    externalUrl: null,
    infoText: null,
    reqCheckboxId: 'req-blind75',
    focusLabel: 'Blind 75',
    defaultEnabled: true
  },
  {
    id: 'neetcode150',
    dataFile: 'neetcode150.json',
    name: 'NeetCode 150',
    shortName: 'NC',
    color: '#ffa116',
    badgeCssClass: 'list-badge-nc',
    totalFallback: 158,
    sequential: false,
    externalUrl: null,
    infoText: null,
    reqCheckboxId: 'req-nc150',
    focusLabel: 'NC 150',
    defaultEnabled: true
  },
  {
    id: 'namastedsa',
    dataFile: 'namastedsa.json',
    name: 'Namaste DSA',
    shortName: 'ND',
    color: '#a78bfa',
    badgeCssClass: 'list-badge-nd',
    totalFallback: 147,
    sequential: true,
    externalUrl: 'https://namastedev.com/namaste-dsa-sheet',
    infoText: '<strong>147 unique LeetCode problems</strong> from the Namaste DSA sheet. 6 problems are on namastedev.com only (not on LeetCode): Sum, Count Negative Numbers, Find Smallest Number, Find Largest Number, Detect Cycle (Undirected), Topological Sort.',
    reqCheckboxId: 'req-namastedsa',
    focusLabel: 'Namaste',
    defaultEnabled: false
  },
  {
    id: 'frazdsa',
    dataFile: 'frazdsa.json',
    name: 'Fraz DSA',
    shortName: 'FZ',
    color: '#f59e0b',
    badgeCssClass: 'list-badge-fz',
    totalFallback: 305,
    sequential: true,
    externalUrl: null,
    infoText: '<strong>305 unique LeetCode problems</strong> from the DSA Sheet by Fraz (LeadCoding). Covers 18 categories including Arrays, DP, Trees, Graphs, Design, and more.',
    reqCheckboxId: 'req-frazdsa',
    focusLabel: 'Fraz',
    defaultEnabled: false
  },
  {
    id: 'striversde',
    dataFile: 'striversde.json',
    name: 'Striver SDE',
    shortName: 'SV',
    color: '#ec4899',
    badgeCssClass: 'list-badge-sv',
    totalFallback: 121,
    sequential: true,
    externalUrl: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
    infoText: '<strong>121 unique LeetCode problems</strong> from the Striver SDE Sheet (TakeUForward). 61 problems are on InterviewBit/TUF only (not on LeetCode). Covers 27 categories across all DSA topics.',
    reqCheckboxId: 'req-striversde',
    focusLabel: 'Striver',
    defaultEnabled: false
  },
  {
    id: 'leetcode75',
    dataFile: 'leetcode75.json',
    name: 'LeetCode 75',
    shortName: 'LC',
    color: '#ff375f',
    badgeCssClass: 'list-badge-lc',
    totalFallback: 75,
    sequential: false,
    externalUrl: null,
    infoText: null,
    reqCheckboxId: 'req-lc75',
    focusLabel: 'LC 75',
    defaultEnabled: true
  }
];

// Convenience lookups (computed once)
var CURATED_LIST_IDS = CURATED_LISTS.map(function(l) { return l.id; });
var CURATED_LIST_MAP = {};
CURATED_LISTS.forEach(function(l) { CURATED_LIST_MAP[l.id] = l; });
