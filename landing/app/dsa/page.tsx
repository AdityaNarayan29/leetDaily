import { Metadata } from "next";
import "./dsa.css";

export const metadata: Metadata = {
  title: "DSA Master Reference — Decision Tree + Complete Patterns | LeetDaily",
  description: "Visual decision trees, complete pattern library, frameworks, and cheat sheet for DSA interview preparation.",
  keywords: ["DSA cheat sheet", "DSA decision tree", "leetcode patterns", "coding interview patterns", "algorithm patterns"],
};

function Node({ type, children }: { type: string; children: React.ReactNode }) {
  return <span className={`node ${type}`}>{children}</span>;
}

function Card({ color, tag, title, desc }: { color: string; tag: string; title: string; desc: string }) {
  return (
    <div className={`card ${color}`}>
      <span className="tag">{tag}</span>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

export default function DSAReference() {
  return (
    <div className="dsa-container">
      <a href="/" className="back-link">← Back to LeetDaily</a>

      <header>
        <h1>DSA Master Reference</h1>
        <p className="subtitle">Visual decision trees + complete pattern library + frameworks + cheat sheet. <a href="/">By LeetDaily</a></p>
      </header>

      <nav className="toc">
        <h3>Contents</h3>
        <ol>
          <li><a href="#workflow">The 5-step workflow</a></li>
          <li><a href="#constraints">Constraints → complexity</a></li>
          <li><a href="#master-tree">Master decision tree</a></li>
          <li><a href="#tree-array">Tree 1 — Array / string</a></li>
          <li><a href="#tree-linked">Tree 2 — Linked list</a></li>
          <li><a href="#tree-tree">Tree 3 — Tree</a></li>
          <li><a href="#tree-graph">Tree 4 — Graph</a></li>
          <li><a href="#tree-intervals">Tree 5 — Intervals</a></li>
          <li><a href="#tree-dp">DP decision tree</a></li>
          <li><a href="#advanced">Advanced patterns</a></li>
          <li><a href="#meta">Meta-strategy when stuck</a></li>
          <li><a href="#cheatsheet">Pattern cheat sheet</a></li>
          <li><a href="#complexity-ref">Complexity reference</a></li>
        </ol>
      </nav>

      <div className="intro">
        <strong>How to use this page:</strong> For pattern recognition, start with the master tree and trace down. For deep dives, read the detail sections. For quick recall, use the cheat sheet at the bottom.
      </div>

      {/* ── SECTION 1: WORKFLOW ── */}
      <h2 id="workflow">The 5-step workflow</h2>
      <p>Every DSA problem follows the same process. Internalize this order.</p>
      <div className="flow">
        <span className="step">1. Read constraints</span><span className="arrow">→</span>
        <span className="step">2. Classify input</span><span className="arrow">→</span>
        <span className="step">3. Match pattern</span><span className="arrow">→</span>
        <span className="step">4. DP fallback</span><span className="arrow">→</span>
        <span className="step">5. Code it</span>
      </div>
      <ul className="clean">
        <li><strong>Read constraints first</strong> — they reveal target complexity before you understand the problem.</li>
        <li><strong>Classify input</strong> — array, linked list, tree, graph, intervals. Each has its own sub-tree.</li>
        <li><strong>Match pattern</strong> — trace the sub-tree until you hit a leaf.</li>
        <li><strong>DP fallback</strong> — if no pattern fits and problem asks for count / max / min / optimal, it&#39;s DP.</li>
        <li><strong>Code it</strong> — state brute force out loud, then optimal pattern, then implement.</li>
      </ul>

      {/* ── SECTION 2: CONSTRAINTS ── */}
      <h2 id="constraints">Step 1 — Constraints → complexity</h2>
      <p>The constraint tells you what complexity is allowed, which narrows the pattern space dramatically.</p>
      <table>
        <thead><tr><th>Constraint</th><th>Target</th><th>Likely pattern</th></tr></thead>
        <tbody>
          <tr><td><code>n ≤ 10</code></td><td>O(n!)</td><td>Backtracking, brute force</td></tr>
          <tr><td><code>n ≤ 20</code></td><td>O(2ⁿ)</td><td>Bitmask DP, meet in the middle</td></tr>
          <tr><td><code>n ≤ 100</code></td><td>O(n³)</td><td>Floyd-Warshall, interval DP</td></tr>
          <tr><td><code>n ≤ 1,000</code></td><td>O(n²)</td><td>DP, nested loops, 2D grid</td></tr>
          <tr><td><code>n ≤ 10⁵</code></td><td>O(n log n)</td><td>Sorting, heap, binary search, segment tree</td></tr>
          <tr><td><code>n ≤ 10⁶</code></td><td>O(n)</td><td>Two pointers, sliding window, hashing</td></tr>
          <tr><td><code>n ≤ 10⁹</code></td><td>O(log n)</td><td>Binary search on answer, math formula</td></tr>
        </tbody>
      </table>

      {/* ── SECTION 3: MASTER TREE ── */}
      <h2 id="master-tree">Master decision tree</h2>
      <p className="section-sub">Start here for every problem. The input type routes you to the right sub-tree.</p>
      <div className="legend">
        <div className="legend-item"><span className="legend-swatch sw-root" />Start</div>
        <div className="legend-item"><span className="legend-swatch sw-q" />Question</div>
        <div className="legend-item"><span className="legend-swatch sw-p" />Pattern</div>
        <div className="legend-item"><span className="legend-swatch sw-a" />Category</div>
        <div className="legend-item"><span className="legend-swatch sw-d" />DP</div>
      </div>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <Node type="root">Read the problem<small>Note constraints</small></Node>
          <ul><li>
            <Node type="question">What is the input?</Node>
            <ul>
              <li><Node type="answer">Array / string</Node><ul><li><Node type="pattern">→ Tree 1</Node></li></ul></li>
              <li><Node type="answer">Linked list</Node><ul><li><Node type="pattern">→ Tree 2</Node></li></ul></li>
              <li><Node type="answer">Tree</Node><ul><li><Node type="pattern">→ Tree 3</Node></li></ul></li>
              <li><Node type="answer">Graph / grid</Node><ul><li><Node type="pattern">→ Tree 4</Node></li></ul></li>
              <li><Node type="answer">Intervals</Node><ul><li><Node type="pattern">→ Tree 5</Node></li></ul></li>
              <li><Node type="answer">None fits</Node><ul><li><Node type="dp">→ DP tree</Node></li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      {/* ── TREE 1: ARRAY/STRING ── */}
      <h2 id="tree-array">Tree 1 — Array / string</h2>
      <p className="section-sub">First question: is it sorted? Sorted unlocks two pointers + binary search.</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <Node type="root">Array / string</Node>
          <ul><li>
            <Node type="question">Is it sorted?</Node>
            <ul>
              <li><Node type="answer">YES</Node><ul><li>
                <Node type="question">What&#39;s asked?</Node>
                <ul>
                  <li><Node type="pattern">Binary search<small>find target / boundary</small></Node></li>
                  <li><Node type="pattern">Two pointers<small>pair with sum</small></Node></li>
                  <li><Node type="pattern">Heap<small>Kth smallest / largest</small></Node></li>
                  <li><Node type="pattern">BS on answer<small>monotonic answer</small></Node></li>
                </ul>
              </li></ul></li>
              <li><Node type="answer">NO</Node><ul><li>
                <Node type="question">Contiguous range?</Node>
                <ul>
                  <li><Node type="answer">YES</Node><ul>
                    <li><Node type="pattern">Sliding window<small>fixed or variable</small></Node></li>
                    <li><Node type="pattern">Prefix sum + map<small>sum equals K</small></Node></li>
                    <li><Node type="pattern">Monotonic deque<small>max/min in window</small></Node></li>
                  </ul></li>
                  <li><Node type="answer">NO</Node><ul>
                    <li><Node type="pattern">Monotonic stack<small>next greater/smaller</small></Node></li>
                    <li><Node type="pattern">HashMap<small>frequency / anagrams</small></Node></li>
                    <li><Node type="pattern">Cyclic sort<small>values in 1..n</small></Node></li>
                    <li><Node type="dp">DP<small>LIS / LCS / edit dist</small></Node></li>
                  </ul></li>
                </ul>
              </li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <h3>Array / string patterns</h3>
      <div className="card-grid">
        <Card color="teal" tag="Sliding window" title="Fixed window size" desc="Size K given. Slide across, maintain running sum/count in O(1) per step." />
        <Card color="teal" tag="Sliding window" title="Variable window" desc="Expand right, contract left when constraint breaks. Longest/shortest subarray." />
        <Card color="teal" tag="Prefix sum" title="Prefix sum + HashMap" desc="Subarray sum equals K. Store prefix sums in map, check complements in O(1)." />
        <Card color="teal" tag="Two pointers" title="Opposite ends" desc="Sorted array + pair with target. Start both ends, move based on comparison." />
        <Card color="teal" tag="Two pointers" title="Fast / slow" desc="In-place modification: remove duplicates, move zeros, partition." />
        <Card color="teal" tag="Monotonic stack" title="Next greater / smaller" desc="Stack of indices with monotonic values. Pop when new element breaks monotonicity." />
        <Card color="teal" tag="HashMap" title="Frequency / anagrams" desc="Count occurrences, detect duplicates, group anagrams." />
        <Card color="teal" tag="Cyclic sort" title="Values in 1..n" desc="Place each at correct index. Find missing, find duplicate, first missing positive." />
        <Card color="teal" tag="Binary search" title="On answer space" desc="Monotonic property on answer. Koko eating bananas, split array, ship packages." />
      </div>

      {/* ── TREE 2: LINKED LIST ── */}
      <h2 id="tree-linked">Tree 2 — Linked list</h2>
      <p className="section-sub">Only five patterns exist.</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <Node type="root">Linked list</Node>
          <ul><li>
            <Node type="question">What do you need?</Node>
            <ul>
              <li><Node type="answer">Find position</Node><ul><li><Node type="pattern">Fast &amp; slow<small>cycle, middle, nth from end</small></Node></li></ul></li>
              <li><Node type="answer">Change structure</Node><ul>
                <li><Node type="pattern">Iterative reverse<small>whole / partial / k-group</small></Node></li>
                <li><Node type="pattern">Two-pointer merge<small>merge sorted</small></Node></li>
                <li><Node type="pattern">Min-heap<small>merge K sorted</small></Node></li>
              </ul></li>
              <li><Node type="answer">Composite</Node><ul>
                <li><Node type="pattern">Find mid + reverse + merge<small>reorder / palindrome</small></Node></li>
              </ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <div className="card-grid">
        <Card color="coral" tag="Fast & slow" title="Floyd's tortoise and hare" desc="Slow 1 step, fast 2. Meet = cycle. Fast at end = slow at middle." />
        <Card color="coral" tag="Reversal" title="In-place pointer flip" desc="prev = null, curr = head. Save next, point curr to prev, advance." />
        <Card color="coral" tag="Merge" title="Two sorted lists" desc="Dummy head + tail. Pick smaller, advance. O(m+n)." />
        <Card color="coral" tag="Merge K" title="Min-heap of heads" desc="Push all heads. Pop smallest, push its next. O(N log K)." />
      </div>

      {/* ── TREE 3: TREE ── */}
      <h2 id="tree-tree">Tree 3 — Tree</h2>
      <p className="section-sub">BST or not? Then match the answer shape.</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <Node type="root">Tree</Node>
          <ul><li>
            <Node type="question">Is it a BST?</Node>
            <ul>
              <li><Node type="answer">YES</Node><ul>
                <li><Node type="pattern">Inorder<small>Kth smallest, validate</small></Node></li>
                <li><Node type="pattern">BST recursion<small>search / insert / delete</small></Node></li>
              </ul></li>
              <li><Node type="answer">NO</Node><ul><li>
                <Node type="question">Answer shape?</Node>
                <ul>
                  <li><Node type="pattern">BFS<small>level order, right view</small></Node></li>
                  <li><Node type="pattern">DFS + backtrack<small>root-to-leaf paths</small></Node></li>
                  <li><Node type="pattern">Post-order<small>height, diameter, max path</small></Node></li>
                  <li><Node type="pattern">LCA recursion<small>common ancestor</small></Node></li>
                  <li><Node type="dp">Tree DP<small>house robber III</small></Node></li>
                </ul>
              </li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <div className="card-grid">
        <Card color="blue" tag="BFS" title="Level order traversal" desc="Queue-based. Process level-by-level. Right view, zigzag, min depth." />
        <Card color="blue" tag="DFS" title="Post-order" desc="Process children first. Height, diameter, max path sum." />
        <Card color="blue" tag="LCA" title="Lowest common ancestor" desc="If node is p or q, return it. Both non-null from children = current is LCA." />
        <Card color="blue" tag="Path sum" title="Root-to-leaf paths" desc="DFS with running sum. Backtrack on return." />
      </div>

      {/* ── TREE 4: GRAPH ── */}
      <h2 id="tree-graph">Tree 4 — Graph / grid</h2>
      <p className="section-sub">Build adjacency list first. Then branch on what you&#39;re computing.</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <Node type="root">Graph</Node>
          <ul><li>
            <Node type="question">What do you need?</Node>
            <ul>
              <li><Node type="answer">Shortest path</Node><ul>
                <li><Node type="pattern">BFS<small>unweighted</small></Node></li>
                <li><Node type="pattern">Dijkstra<small>non-negative</small></Node></li>
                <li><Node type="pattern">Bellman-Ford<small>negatives</small></Node></li>
              </ul></li>
              <li><Node type="answer">Connectivity</Node><ul>
                <li><Node type="pattern">DFS / BFS<small>count components</small></Node></li>
                <li><Node type="pattern">Union-Find<small>dynamic edges</small></Node></li>
              </ul></li>
              <li><Node type="answer">Ordering</Node><ul><li><Node type="pattern">Topo sort<small>Kahn&#39;s / DFS</small></Node></li></ul></li>
              <li><Node type="answer">Cycles</Node><ul>
                <li><Node type="pattern">Union-Find / DFS<small>undirected</small></Node></li>
                <li><Node type="pattern">DFS 3-color<small>directed</small></Node></li>
              </ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <div className="card-grid">
        <Card color="pink" tag="BFS" title="Unweighted shortest path" desc="Queue + visited. First reach = shortest. O(V + E)." />
        <Card color="pink" tag="Dijkstra" title="Non-negative weights" desc="Min-heap of (distance, node). O((V+E) log V)." />
        <Card color="pink" tag="Union-Find" title="Dynamic connectivity" desc="find + union with path compression and rank. Near O(1)." />
        <Card color="pink" tag="Topo sort" title="Kahn's (BFS)" desc="Count in-degrees. Queue zero-degree nodes. Pop, add, decrement." />
        <Card color="pink" tag="Grid BFS" title="Multi-source BFS" desc="Push all sources at start. Rotting oranges, nearest 0." />
        <Card color="pink" tag="Grid DFS" title="Flood fill" desc="Count islands, max area, surrounded regions." />
      </div>

      {/* ── TREE 5: INTERVALS ── */}
      <h2 id="tree-intervals">Tree 5 — Intervals</h2>
      <p className="section-sub">Always starts with a sort.</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <Node type="root">Intervals</Node>
          <ul><li>
            <Node type="question">What&#39;s the goal?</Node>
            <ul>
              <li><Node type="answer">Combine</Node><ul><li><Node type="pattern">Sort by start<small>merge overlapping</small></Node></li></ul></li>
              <li><Node type="answer">Count resources</Node><ul>
                <li><Node type="pattern">Min-heap of ends<small>meeting rooms</small></Node></li>
                <li><Node type="pattern">Sweep line<small>max concurrent</small></Node></li>
              </ul></li>
              <li><Node type="answer">Maximize</Node><ul><li><Node type="pattern">Sort by END, greedy<small>max non-overlapping</small></Node></li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <div className="card-grid">
        <Card color="green" tag="Merge" title="Merge overlapping" desc="Sort by start. If overlap, extend end. Else push. O(n log n)." />
        <Card color="green" tag="Heap" title="Minimum meeting rooms" desc="Sort by start. Min-heap of end times. Heap size = answer." />
        <Card color="green" tag="Sweep line" title="Events on timeline" desc="(time, +1/-1) events sorted. Running sum = concurrent count." />
        <Card color="green" tag="Greedy" title="Max non-overlapping" desc="Sort by END. Greedily pick earliest-ending." />
      </div>

      {/* ── DP TREE ── */}
      <h2 id="tree-dp">DP decision tree</h2>
      <p className="section-sub">When no pattern fits and problem asks for count/max/min/optimal.</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <Node type="dp">Dynamic programming</Node>
          <ul><li>
            <Node type="question">State shape?</Node>
            <ul>
              <li><Node type="answer">Single index</Node><ul><li><Node type="pattern">1D DP<small>robber, LIS, stairs</small></Node></li></ul></li>
              <li><Node type="answer">Two sequences</Node><ul><li><Node type="pattern">2D DP<small>LCS, edit distance</small></Node></li></ul></li>
              <li><Node type="answer">Grid</Node><ul><li><Node type="pattern">Grid DP<small>unique paths</small></Node></li></ul></li>
              <li><Node type="answer">Items + capacity</Node><ul><li><Node type="pattern">Knapsack<small>0/1, unbounded</small></Node></li></ul></li>
              <li><Node type="answer">Range [i..j]</Node><ul><li><Node type="pattern">Interval DP<small>burst balloons</small></Node></li></ul></li>
              <li><Node type="answer">Set visited</Node><ul><li><Node type="pattern">Bitmask DP<small>TSP, n ≤ 20</small></Node></li></ul></li>
              <li><Node type="answer">Has states</Node><ul><li><Node type="pattern">State machine<small>stock problems</small></Node></li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <div className="framework">
        <strong>The DP framework:</strong>
        <ol>
          <li><strong>Define state.</strong> What does dp[i] mean? Write in English first.</li>
          <li><strong>Write recurrence.</strong> How does dp[i] relate to smaller subproblems?</li>
          <li><strong>Base cases.</strong> Smallest subproblems.</li>
          <li><strong>Order of computation.</strong> Bottom-up or top-down memoization.</li>
          <li><strong>Space optimization.</strong> Often only last 1-2 rows matter.</li>
        </ol>
      </div>

      <div className="card-grid">
        <Card color="amber" tag="1D DP" title="Single index" desc="Climb stairs, house robber, decode ways, LIS, word break." />
        <Card color="amber" tag="2D DP" title="Two strings" desc="LCS, edit distance, regex matching, distinct subsequences." />
        <Card color="amber" tag="Grid DP" title="2D grid paths" desc="Unique paths, min path sum, maximal square." />
        <Card color="amber" tag="0/1 Knapsack" title="Each item once" desc="Subset sum, partition equal subset, target sum." />
        <Card color="amber" tag="Unbounded" title="Items reusable" desc="Coin change, combination sum IV, perfect squares." />
        <Card color="amber" tag="Interval DP" title="Solve on ranges" desc="Burst balloons, matrix chain, palindrome partitioning." />
        <Card color="amber" tag="Bitmask DP" title="n ≤ 20 visited set" desc="TSP, assignment, visit all nodes, partition to K equal subsets." />
        <Card color="amber" tag="State machine" title="Stock problems" desc="Buy/sell with cooldown, transaction limits. Draw state diagram first." />
      </div>

      {/* ── ADVANCED ── */}
      <h2 id="advanced">Advanced patterns</h2>
      <div className="card-grid">
        <Card color="blue" tag="Segment tree" title="Range queries" desc="Point update + range query. O(log n) per op." />
        <Card color="blue" tag="Trie" title="Prefix tree" desc="Autocomplete, word search II, max XOR, longest common prefix." />
        <Card color="blue" tag="Two heaps" title="Median from stream" desc="Max-heap lower half, min-heap upper half. Balance sizes." />
        <Card color="blue" tag="Design" title="LRU cache" desc="HashMap + doubly linked list. O(1) get and put." />
        <Card color="blue" tag="KMP" title="String matching" desc="Pattern in text in O(n+m). Failure function." />
        <Card color="blue" tag="Palindromes" title="Expand around center" desc="O(n²). Try every index, expand while chars match." />
      </div>

      {/* ── META STRATEGY ── */}
      <h2 id="meta">Meta-strategy when stuck</h2>
      <ol className="clean">
        <li><strong>State the brute force out loud.</strong> Clarifies the problem. Gives baseline complexity.</li>
        <li><strong>Look for redundant work.</strong> Repeated computation → memoization. Repeated sort → precompute.</li>
        <li><strong>Reverse the problem.</strong> Iterate from end. Think what answer isn&#39;t.</li>
        <li><strong>Sort if order doesn&#39;t matter.</strong> Unlocks two pointers, greedy, binary search.</li>
        <li><strong>Think about invariants.</strong> Key for monotonic stack, deque, greedy proofs.</li>
        <li><strong>Draw it.</strong> Trees, graphs, DP tables. Visual cortex spots patterns.</li>
        <li><strong>Work small examples.</strong> n=1, n=2, n=3. Patterns emerge.</li>
        <li><strong>Ask what gives O(1) for the bottleneck.</strong> Min → heap. Key lookup → hashmap. Next greater → monotonic stack.</li>
        <li><strong>Binary search on answer.</strong> If monotonic property exists, reduce to feasibility check.</li>
      </ol>

      {/* ── CHEAT SHEET ── */}
      <h2 id="cheatsheet">Pattern cheat sheet</h2>
      <p>When you see the signal on the left, try the pattern on the right first.</p>
      <table>
        <thead><tr><th>Signal / problem phrase</th><th>Pattern to try</th></tr></thead>
        <tbody>
          <tr><td>Contiguous subarray + sum or length</td><td>Sliding window or prefix sum</td></tr>
          <tr><td>Sorted array + pair with target</td><td>Two pointers</td></tr>
          <tr><td>Kth largest / smallest</td><td>Heap of size K or Quickselect</td></tr>
          <tr><td>Next greater / smaller element</td><td>Monotonic stack</td></tr>
          <tr><td>Max / min in sliding window</td><td>Monotonic deque</td></tr>
          <tr><td>Shortest path (unweighted)</td><td>BFS</td></tr>
          <tr><td>Shortest path (weighted)</td><td>Dijkstra</td></tr>
          <tr><td>Course schedule / dependencies</td><td>Topological sort</td></tr>
          <tr><td>Connected components</td><td>Union-Find or DFS</td></tr>
          <tr><td>Count number of ways</td><td>DP</td></tr>
          <tr><td>Maximum / minimum + optimal</td><td>DP</td></tr>
          <tr><td>All permutations / subsets</td><td>Backtracking</td></tr>
          <tr><td>Prefix matching / autocomplete</td><td>Trie</td></tr>
          <tr><td>Cycle in linked list / find middle</td><td>Fast and slow pointers</td></tr>
          <tr><td>Reverse linked list</td><td>Iterative pointer reversal</td></tr>
          <tr><td>Values in 1..n, find missing</td><td>Cyclic sort</td></tr>
          <tr><td>Merge k sorted</td><td>Min-heap of heads</td></tr>
          <tr><td>Median of data stream</td><td>Two heaps</td></tr>
          <tr><td>LRU cache</td><td>HashMap + doubly linked list</td></tr>
          <tr><td>Interval overlap / merge</td><td>Sort by start, sweep</td></tr>
          <tr><td>Max non-overlapping intervals</td><td>Sort by end, greedy</td></tr>
          <tr><td>Edit distance / LCS</td><td>2D DP</td></tr>
          <tr><td>House robber / jump game</td><td>1D DP</td></tr>
          <tr><td>Buy / sell stock</td><td>State machine DP</td></tr>
          <tr><td>Coin change / ways to make amount</td><td>Unbounded knapsack DP</td></tr>
          <tr><td>Subset sum / equal partition</td><td>0/1 knapsack DP</td></tr>
          <tr><td>Grid islands / regions</td><td>DFS / BFS flood fill</td></tr>
          <tr><td>n ≤ 20 with visit all</td><td>Bitmask DP</td></tr>
          <tr><td>Monotonic answer space</td><td>Binary search on answer</td></tr>
        </tbody>
      </table>

      {/* ── COMPLEXITY REF ── */}
      <h2 id="complexity-ref">Complexity reference</h2>
      <h3>Data structures</h3>
      <table>
        <thead><tr><th>Structure</th><th>Access</th><th>Search</th><th>Insert</th><th>Delete</th></tr></thead>
        <tbody>
          <tr><td>Array</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
          <tr><td>Hash table</td><td>—</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
          <tr><td>BST (balanced)</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td></tr>
          <tr><td>Heap</td><td>—</td><td>O(n)</td><td>O(log n)</td><td>O(log n)</td></tr>
          <tr><td>Trie</td><td>O(k)</td><td>O(k)</td><td>O(k)</td><td>O(k)</td></tr>
          <tr><td>Union-Find</td><td>—</td><td>~O(1)</td><td>~O(1)</td><td>—</td></tr>
        </tbody>
      </table>

      <h3>Graph algorithms</h3>
      <table>
        <thead><tr><th>Algorithm</th><th>Time</th><th>Use case</th></tr></thead>
        <tbody>
          <tr><td>BFS / DFS</td><td>O(V + E)</td><td>Traversal, unweighted shortest path</td></tr>
          <tr><td>Dijkstra</td><td>O((V+E) log V)</td><td>Non-negative weighted shortest path</td></tr>
          <tr><td>Bellman-Ford</td><td>O(VE)</td><td>Negative edges, cycle detection</td></tr>
          <tr><td>Floyd-Warshall</td><td>O(V³)</td><td>All-pairs shortest path</td></tr>
          <tr><td>Topological sort</td><td>O(V + E)</td><td>DAG ordering</td></tr>
          <tr><td>Kruskal&#39;s MST</td><td>O(E log E)</td><td>Minimum spanning tree</td></tr>
        </tbody>
      </table>

      <div className="intro" style={{ marginTop: 48 }}>
        <strong>Final advice:</strong> Don&#39;t memorize this page. Use decision trees for pattern recognition, drill specific sub-trees as you encounter problems. After ~50 problems, the master tree becomes automatic. After ~150, you see patterns before finishing the problem statement. Speed comes from deliberate repetition — not re-reading.
      </div>

      <footer style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
        <a href="/" style={{ color: "var(--root)" }}>LeetDaily</a> — Free LeetCode interview prep extension.
        <a href="https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf" style={{ color: "var(--root)", marginLeft: 12 }}>Install →</a>
      </footer>
    </div>
  );
}
