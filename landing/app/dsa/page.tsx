import { Metadata } from "next";
import "./dsa.css";

export const metadata: Metadata = {
  title: "DSA Master Reference — Decision Tree + Complete Patterns | LeetDaily",
  description: "Visual decision trees, complete pattern library, frameworks, and cheat sheet for DSA interview preparation. Free resource by LeetDaily.",
  keywords: ["DSA cheat sheet", "DSA decision tree", "leetcode patterns", "coding interview patterns", "algorithm patterns", "data structures cheat sheet", "DSA reference"],
};

function N({ t, children }: { t: string; children: React.ReactNode }) {
  return <span className={`node ${t}`}>{children}</span>;
}

function C({ color, tag, title, desc }: { color: string; tag: string; title: string; desc: string }) {
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
          <li><a href="#array-detail">Array patterns in depth</a></li>
          <li><a href="#tree-linked">Tree 2 — Linked list</a></li>
          <li><a href="#linked-detail">Linked list patterns</a></li>
          <li><a href="#tree-tree">Tree 3 — Tree</a></li>
          <li><a href="#tree-detail">Tree patterns + recursion template</a></li>
          <li><a href="#tree-graph">Tree 4 — Graph</a></li>
          <li><a href="#graph-detail">Graph patterns in depth</a></li>
          <li><a href="#tree-intervals">Tree 5 — Intervals</a></li>
          <li><a href="#tree-dp">DP decision tree</a></li>
          <li><a href="#dp-detail">DP framework + all types</a></li>
          <li><a href="#advanced">Advanced patterns</a></li>
          <li><a href="#meta">Meta-strategy when stuck</a></li>
          <li><a href="#cheatsheet">Pattern cheat sheet</a></li>
          <li><a href="#complexity-ref">Complexity reference</a></li>
        </ol>
      </nav>

      <div className="intro">
        <strong>How to use this page:</strong> For pattern recognition, start with the master tree and trace down. For deep dives, read the detail sections below each tree. For quick recall during practice, use the cheat sheet at the bottom. Every section is independent — jump around freely.
      </div>

      {/* ══════ WORKFLOW ══════ */}
      <h2 id="workflow">The 5-step workflow</h2>
      <p>Every DSA problem follows the same process. Internalize this order and you&#39;ll never stare blankly at a problem again.</p>
      <div className="flow">
        <span className="step">1. Read constraints</span><span className="arrow">→</span>
        <span className="step">2. Classify input</span><span className="arrow">→</span>
        <span className="step">3. Match pattern</span><span className="arrow">→</span>
        <span className="step">4. DP fallback</span><span className="arrow">→</span>
        <span className="step">5. Code it</span>
      </div>
      <ul className="clean">
        <li><strong>Read constraints first</strong> — they reveal the target complexity before you even understand the problem. See the table below.</li>
        <li><strong>Classify input</strong> — array, linked list, tree, graph, intervals. Each has its own sub-tree.</li>
        <li><strong>Match pattern</strong> — trace the sub-tree until you hit a leaf.</li>
        <li><strong>DP fallback</strong> — if no pattern fits and the problem asks for count / max / min / optimal, it&#39;s DP.</li>
        <li><strong>Code it</strong> — state brute force out loud, then the optimal pattern, then implement.</li>
      </ul>

      {/* ══════ CONSTRAINTS ══════ */}
      <h2 id="constraints">Step 1 — Constraints → complexity</h2>
      <p>Modern judges do roughly 10⁸ simple operations per second. Use this table in reverse: the constraint tells you what complexity is allowed, which narrows the pattern space dramatically.</p>
      <table>
        <thead><tr><th>Constraint</th><th>Target complexity</th><th>Ops</th><th>Likely pattern</th></tr></thead>
        <tbody>
          <tr><td><code>n ≤ 10</code></td><td>O(n!) / O(2ⁿ·n)</td><td>~3.6M</td><td>Backtracking, permutations, brute force</td></tr>
          <tr><td><code>n ≤ 20</code></td><td>O(2ⁿ)</td><td>~1M</td><td>Bitmask DP, meet in the middle</td></tr>
          <tr><td><code>n ≤ 100</code></td><td>O(n³) / O(n⁴)</td><td>~1M–100M</td><td>Floyd-Warshall, interval DP, matrix DP</td></tr>
          <tr><td><code>n ≤ 400</code></td><td>O(n³)</td><td>~64M</td><td>Floyd-Warshall, 3D DP</td></tr>
          <tr><td><code>n ≤ 1,000</code></td><td>O(n²)</td><td>~1M</td><td>DP, nested loops, 2D grid problems</td></tr>
          <tr><td><code>n ≤ 10,000</code></td><td>O(n² / log n)</td><td>~10M</td><td>Light nested loops, n log n sorting</td></tr>
          <tr><td><code>n ≤ 10⁵</code></td><td>O(n log n)</td><td>~1.7M</td><td>Sorting, heap, binary search, segment tree</td></tr>
          <tr><td><code>n ≤ 10⁶</code></td><td>O(n) / O(n log n)</td><td>~1M–20M</td><td>Two pointers, sliding window, hashing</td></tr>
          <tr><td><code>n ≤ 10⁸</code></td><td>O(n) tight / O(√n)</td><td>~10⁸</td><td>Linear scan only, no hidden constants</td></tr>
          <tr><td><code>n ≤ 10⁹</code></td><td>O(log n) / O(√n)</td><td>~30</td><td>Binary search on answer, math formula</td></tr>
          <tr><td><code>n ≤ 10¹⁸</code></td><td>O(log n)</td><td>~60</td><td>Matrix exponentiation, number theory</td></tr>
        </tbody>
      </table>

      {/* ══════ MASTER TREE ══════ */}
      <h2 id="master-tree">Master decision tree</h2>
      <p className="section-sub">Start here for every problem. The input type routes you to the right sub-tree.</p>
      <div className="legend">
        <div className="legend-item"><span className="legend-swatch sw-root" />Start here</div>
        <div className="legend-item"><span className="legend-swatch sw-q" />Question to ask</div>
        <div className="legend-item"><span className="legend-swatch sw-p" />Pattern to use</div>
        <div className="legend-item"><span className="legend-swatch sw-a" />Sub-category</div>
        <div className="legend-item"><span className="legend-swatch sw-d" />DP fallback</div>
      </div>
      <p className="scroll-hint">← scroll horizontally if needed →</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <N t="root">Read the problem<small>Note constraints</small></N>
          <ul><li>
            <N t="question">What is the input?</N>
            <ul>
              <li><N t="answer">Array / string</N><ul><li><N t="pattern">→ Tree 1</N></li></ul></li>
              <li><N t="answer">Linked list</N><ul><li><N t="pattern">→ Tree 2</N></li></ul></li>
              <li><N t="answer">Tree</N><ul><li><N t="pattern">→ Tree 3</N></li></ul></li>
              <li><N t="answer">Graph / grid</N><ul><li><N t="pattern">→ Tree 4</N></li></ul></li>
              <li><N t="answer">Intervals</N><ul><li><N t="pattern">→ Tree 5</N></li></ul></li>
              <li><N t="answer">None fits</N><ul><li><N t="dp">→ DP tree</N></li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      {/* ══════ TREE 1: ARRAY ══════ */}
      <h2 id="tree-array">Tree 1 — Array / string</h2>
      <p className="section-sub">First question: is it sorted? Sorted unlocks two pointers + binary search.</p>
      <p className="scroll-hint">← scroll horizontally if needed →</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <N t="root">Array / string</N>
          <ul><li>
            <N t="question">Is it sorted?<small>or can be sorted</small></N>
            <ul>
              <li><N t="answer">YES</N><ul><li>
                <N t="question">What&#39;s asked?</N>
                <ul>
                  <li><N t="pattern">Binary search<small>find target / boundary</small></N></li>
                  <li><N t="pattern">Two pointers<small>pair with sum / diff</small></N></li>
                  <li><N t="pattern">Heap / Quickselect<small>Kth smallest / largest</small></N></li>
                  <li><N t="pattern">BS on answer<small>monotonic answer space</small></N></li>
                </ul>
              </li></ul></li>
              <li><N t="answer">NO</N><ul><li>
                <N t="question">Contiguous range?</N>
                <ul>
                  <li><N t="answer">YES</N><ul>
                    <li><N t="pattern">Sliding window<small>fixed or variable</small></N></li>
                    <li><N t="pattern">Prefix sum + map<small>sum equals K</small></N></li>
                    <li><N t="pattern">Monotonic deque<small>max / min in window</small></N></li>
                  </ul></li>
                  <li><N t="answer">NO</N><ul>
                    <li><N t="pattern">Monotonic stack<small>next greater / smaller</small></N></li>
                    <li><N t="pattern">HashMap<small>frequency / anagrams</small></N></li>
                    <li><N t="pattern">Cyclic sort<small>values in 1..n</small></N></li>
                    <li><N t="dp">DP<small>LIS / LCS / edit distance</small></N></li>
                  </ul></li>
                </ul>
              </li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <h3 id="array-detail">Array / string patterns in depth</h3>
      <div className="card-grid">
        <C color="teal" tag="Sliding window" title="Fixed window size" desc="Size K given upfront. Slide across, maintain running quantity (sum, max, count) in O(1) per step. Example: max sum subarray of size K." />
        <C color="teal" tag="Sliding window" title="Variable window" desc="'Longest / shortest subarray with ≤ K distinct' or 'sum ≥ X'. Expand right, contract left when constraint breaks. Example: longest substring without repeating chars." />
        <C color="teal" tag="Prefix sum" title="Prefix sum + HashMap" desc="'Subarray sum equals K' or 'divisible by K' or 'count subarrays with property'. Store prefix sums in map; check for complements in O(1)." />
        <C color="teal" tag="Two pointers" title="Opposite ends" desc="Sorted array + pair/triplet with target sum. Start at both ends, move based on comparison. Example: two-sum sorted, 3-sum, container with most water." />
        <C color="teal" tag="Two pointers" title="Same direction (fast/slow)" desc="In-place array modification: remove duplicates, move zeros, partition. Slow = write position, fast = read position." />
        <C color="teal" tag="Monotonic stack" title="Next greater / smaller" desc="Maintain stack of indices with monotonic values. Pop when new element breaks monotonicity. Example: daily temperatures, largest rectangle in histogram." />
        <C color="teal" tag="Monotonic deque" title="Max / min in sliding window" desc="Deque of indices in decreasing (for max) or increasing (for min) order. Front is always the answer. O(n) total." />
        <C color="teal" tag="HashMap" title="Frequency / anagrams" desc="Count occurrences, detect duplicates, group anagrams. Character counter as key for anagram problems." />
        <C color="teal" tag="Cyclic sort" title="Values in 1..n" desc="When array contains integers in bounded range, place each at its 'correct' index. Used for: find missing, find duplicate, first missing positive. O(n) time, O(1) space." />
        <C color="teal" tag="Top K" title="Heap of size K" desc="Min-heap of size K for top K largest, max-heap for top K smallest. O(n log K). Quickselect gives O(n) average." />
        <C color="teal" tag="Binary search" title="On sorted array" desc="Classic target find, or variant: first/last occurrence, leftmost/rightmost, rotated array search. Always check loop invariant." />
        <C color="teal" tag="Binary search" title="On answer space" desc="When answer has monotonic property ('can we do X with budget B?'). Example: koko eating bananas, split array largest sum, capacity to ship packages." />
      </div>

      {/* ══════ TREE 2: LINKED LIST ══════ */}
      <h2 id="tree-linked">Tree 2 — Linked list</h2>
      <p className="section-sub">Only five patterns exist. Match by what you need to find or change.</p>
      <p className="scroll-hint">← scroll horizontally if needed →</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <N t="root">Linked list</N>
          <ul><li>
            <N t="question">What do you need?</N>
            <ul>
              <li><N t="answer">Find a position</N><ul><li><N t="pattern">Fast &amp; slow<small>cycle, middle, nth from end</small></N></li></ul></li>
              <li><N t="answer">Change structure</N><ul>
                <li><N t="pattern">Iterative reverse<small>whole / partial / k-group</small></N></li>
                <li><N t="pattern">Two-pointer merge<small>merge sorted</small></N></li>
                <li><N t="pattern">Min-heap<small>merge K sorted</small></N></li>
              </ul></li>
              <li><N t="answer">Composite</N><ul>
                <li><N t="pattern">Find mid + reverse + merge<small>reorder / palindrome</small></N></li>
                <li><N t="pattern">HashMap / interleave<small>deep copy with random</small></N></li>
              </ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <h3 id="linked-detail">Linked list patterns in depth</h3>
      <div className="card-grid">
        <C color="coral" tag="Fast & slow" title="Floyd's tortoise and hare" desc="Slow moves 1 step, fast moves 2. If they meet, cycle exists. When fast reaches end, slow is at middle. For nth from end: move fast n steps first, then both together." />
        <C color="coral" tag="Cycle start" title="Find cycle start node" desc="After detection, reset slow to head. Move both 1 step at a time. They meet at cycle start. (Floyd's second phase.)" />
        <C color="coral" tag="Reversal" title="In-place pointer flip" desc="prev = null, curr = head. Loop: save next, point curr to prev, advance prev and curr. Return prev. For k-group: reverse k at a time, connect." />
        <C color="coral" tag="Merge" title="Two sorted lists" desc="Dummy head + tail pointer. Pick smaller, advance, repeat. Attach remainder. O(m+n)." />
        <C color="coral" tag="Merge K" title="Min-heap of heads" desc="Push all heads into min-heap. Pop smallest, push its next. O(N log K) where N = total nodes." />
        <C color="coral" tag="Composite" title="Reorder / palindrome check" desc="Find middle with fast/slow → reverse second half → merge/compare with first half. Three primitives combined." />
        <C color="coral" tag="Deep copy" title="Random pointer clone" desc="Method 1: HashMap old→new, two passes. Method 2: interleave clones (A→A'→B→B'→...), fix randoms, separate. O(n) time, O(1) extra space." />
      </div>

      {/* ══════ TREE 3: TREE ══════ */}
      <h2 id="tree-tree">Tree 3 — Tree</h2>
      <p className="section-sub">First check: BST or not? Then match the answer shape.</p>
      <p className="scroll-hint">← scroll horizontally if needed →</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <N t="root">Tree</N>
          <ul><li>
            <N t="question">Is it a BST?</N>
            <ul>
              <li><N t="answer">YES</N><ul>
                <li><N t="pattern">Inorder<small>Kth smallest, validate</small></N></li>
                <li><N t="pattern">BST recursion<small>search / insert / delete</small></N></li>
              </ul></li>
              <li><N t="answer">NO</N><ul><li>
                <N t="question">Answer shape?</N>
                <ul>
                  <li><N t="pattern">BFS<small>level order, right view</small></N></li>
                  <li><N t="pattern">DFS + backtrack<small>root-to-leaf paths</small></N></li>
                  <li><N t="pattern">Post-order<small>height, diameter, max path</small></N></li>
                  <li><N t="pattern">LCA recursion<small>common ancestor</small></N></li>
                  <li><N t="pattern">Pre-order + null<small>serialize / deserialize</small></N></li>
                  <li><N t="dp">Tree DP<small>house robber III</small></N></li>
                </ul>
              </li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <h3 id="tree-detail">Tree patterns + recursion template</h3>
      <div className="framework">
        <strong>Tree recursion template — three shapes</strong>
        <p style={{margin:"8px 0 0"}}>Every tree problem fits one of these:</p>
        <ol>
          <li><strong>Return a scalar</strong> (height, count, sum) — post-order, combine children&#39;s returns. Example: <code>return 1 + max(left, right)</code>.</li>
          <li><strong>Return a tuple</strong> — e.g. <code>(with_node, without_node)</code> for house robber on tree, <code>(is_balanced, height)</code> for balanced check.</li>
          <li><strong>Pass state down, update global</strong> — recursion returns single-branch contribution; a closure variable tracks global best. Used for: max path sum, diameter.</li>
        </ol>
      </div>
      <div className="card-grid">
        <C color="blue" tag="BFS" title="Level order traversal" desc="Queue-based. Process level-by-level: record size at each level, process that many nodes. Used for: level order, right view, zigzag, minimum depth." />
        <C color="blue" tag="DFS" title="Pre-order (root, left, right)" desc="Process node before children. Used for: serialize tree, path from root, copy tree." />
        <C color="blue" tag="DFS" title="In-order (left, root, right)" desc="For BST, visits in sorted order. Used for: validate BST, Kth smallest in BST, BST to sorted list." />
        <C color="blue" tag="DFS" title="Post-order (left, right, root)" desc="Process children first. Used for: height, diameter, max path sum, delete tree, bottom-up problems." />
        <C color="blue" tag="Path sum" title="Root-to-leaf paths" desc="DFS with running sum parameter. Backtrack on return. Variations: exists, collect all, count with prefix sum map (for 'any node to any descendant')." />
        <C color="blue" tag="LCA" title="Lowest common ancestor" desc="If node is p or q, return it. Else recurse left and right. If both non-null, current is LCA. Else return whichever is non-null." />
        <C color="blue" tag="Diameter" title="Longest path through tree" desc="Post-order: return max depth of subtree. Update global answer with left_depth + right_depth at each node." />
        <C color="blue" tag="Serialize" title="Tree to string and back" desc="Pre-order with null markers. Split by delimiter for deserialization, use iterator/queue to rebuild." />
      </div>

      {/* ══════ TREE 4: GRAPH ══════ */}
      <h2 id="tree-graph">Tree 4 — Graph / grid</h2>
      <p className="section-sub">Build adjacency list first. Then branch on what you&#39;re computing.</p>
      <p className="scroll-hint">← scroll horizontally if needed →</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <N t="root">Graph</N>
          <ul><li>
            <N t="question">What do you need?</N>
            <ul>
              <li><N t="answer">Shortest path</N><ul><li>
                <N t="question">Edge weights?</N>
                <ul>
                  <li><N t="pattern">BFS<small>unweighted</small></N></li>
                  <li><N t="pattern">Dijkstra<small>non-negative</small></N></li>
                  <li><N t="pattern">Bellman-Ford<small>negatives</small></N></li>
                  <li><N t="pattern">Floyd-Warshall<small>all pairs, n ≤ 400</small></N></li>
                  <li><N t="pattern">0-1 BFS<small>weights 0 or 1</small></N></li>
                </ul>
              </li></ul></li>
              <li><N t="answer">Connectivity</N><ul>
                <li><N t="pattern">DFS / BFS<small>count components</small></N></li>
                <li><N t="pattern">Union-Find<small>dynamic edges</small></N></li>
                <li><N t="pattern">Tarjan / Kosaraju<small>SCCs</small></N></li>
              </ul></li>
              <li><N t="answer">Ordering</N><ul><li><N t="pattern">Topo sort<small>Kahn&#39;s / DFS</small></N></li></ul></li>
              <li><N t="answer">Cycles</N><ul>
                <li><N t="pattern">Union-Find / DFS<small>undirected</small></N></li>
                <li><N t="pattern">DFS 3-color<small>directed</small></N></li>
              </ul></li>
              <li><N t="answer">Other</N><ul>
                <li><N t="pattern">Kruskal / Prim<small>MST</small></N></li>
                <li><N t="pattern">BFS 2-color<small>bipartite</small></N></li>
                <li><N t="pattern">Flood fill<small>grid islands</small></N></li>
              </ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <h3 id="graph-detail">Graph patterns in depth</h3>
      <div className="card-grid">
        <C color="pink" tag="BFS" title="Unweighted shortest path" desc="Queue + visited set. First time you reach target = shortest. O(V + E). Works for grids too (4/8 directions)." />
        <C color="pink" tag="Dijkstra" title="Non-negative weights" desc="Min-heap of (distance, node). Pop smallest, relax neighbors, push updated. O((V + E) log V). Does NOT work with negative edges." />
        <C color="pink" tag="Bellman-Ford" title="Negative edges allowed" desc="Relax all edges V-1 times. O(VE). Also detects negative cycles (one more iteration changes anything = cycle)." />
        <C color="pink" tag="Floyd-Warshall" title="All pairs shortest path" desc="3 nested loops: intermediate k, source i, dest j. dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]). O(V³), only for n ≤ 400." />
        <C color="pink" tag="0-1 BFS" title="Weights 0 or 1 only" desc="Deque. Push front for weight-0 edges, push back for weight-1. O(V + E). Faster than Dijkstra for this case." />
        <C color="pink" tag="Union-Find" title="Dynamic connectivity" desc="Two ops: find(x) with path compression, union(x,y) by rank/size. Near-O(1) amortized. Used for: Kruskal's MST, redundant connection, accounts merge." />
        <C color="pink" tag="Topo sort" title="Kahn's algorithm (BFS)" desc="Count in-degrees. Queue all zero-in-degree nodes. Pop, add to result, decrement neighbors. If result length < V, there's a cycle." />
        <C color="pink" tag="Topo sort" title="DFS-based" desc="DFS, push to stack on exit. Reverse stack = topo order. Also detects cycles via 3-color marking." />
        <C color="pink" tag="DFS 3-color" title="Directed cycle detection" desc="WHITE = unvisited, GRAY = in current path, BLACK = done. Hitting a GRAY node = cycle. Used for course schedule." />
        <C color="pink" tag="MST" title="Kruskal (sort edges + DSU)" desc="Sort edges by weight. For each edge, if endpoints in different components, add to MST and union. O(E log E)." />
        <C color="pink" tag="MST" title="Prim (heap from vertex)" desc="Grow tree from start vertex. Min-heap of edges crossing the cut. Similar to Dijkstra. O((V + E) log V)." />
        <C color="pink" tag="Bipartite" title="2-coloring" desc="BFS/DFS coloring neighbors with opposite color. Conflict = not bipartite. Used for: graph coloring, possible bipartition." />
        <C color="pink" tag="Grid BFS" title="Multi-source BFS" desc="Push all sources into queue at start. Used for: rotting oranges, walls and gates, nearest 0 in binary matrix." />
        <C color="pink" tag="Grid DFS" title="Flood fill" desc="Count islands, max area, surrounded regions. Mark visited by overwriting or using visited set." />
      </div>

      {/* ══════ TREE 5: INTERVALS ══════ */}
      <h2 id="tree-intervals">Tree 5 — Intervals</h2>
      <p className="section-sub">Always starts with a sort. Sort by start for merging, by end for greedy selection.</p>
      <p className="scroll-hint">← scroll horizontally if needed →</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <N t="root">Intervals</N>
          <ul><li>
            <N t="question">What&#39;s the goal?</N>
            <ul>
              <li><N t="answer">Combine</N><ul>
                <li><N t="pattern">Sort by start<small>merge overlapping</small></N></li>
                <li><N t="pattern">3-phase scan<small>insert interval</small></N></li>
              </ul></li>
              <li><N t="answer">Count resources</N><ul>
                <li><N t="pattern">Min-heap of ends<small>meeting rooms</small></N></li>
                <li><N t="pattern">Sweep line<small>max concurrent</small></N></li>
              </ul></li>
              <li><N t="answer">Maximize</N><ul><li><N t="pattern">Sort by END, greedy<small>max non-overlapping</small></N></li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <div className="card-grid">
        <C color="green" tag="Merge" title="Merge overlapping" desc="Sort by start. For each next interval, if it overlaps with current merged, extend end. Else push current, start new. O(n log n)." />
        <C color="green" tag="Insert" title="Insert new interval" desc="Three phases: (1) add all ending before new starts, (2) merge all overlapping with new, (3) add all starting after new ends. O(n)." />
        <C color="green" tag="Heap" title="Minimum meeting rooms" desc="Sort by start. Min-heap of end times. For each interval, if smallest end ≤ current start, pop (reuse room). Push current end. Heap size = answer." />
        <C color="green" tag="Sweep line" title="Events on timeline" desc="Create (time, +1/-1) events, sort by time. Running sum = concurrent count. Max running sum = answer. Also: employee free time, car pooling." />
        <C color="green" tag="Greedy" title="Maximum non-overlapping" desc="Sort by END time. Greedily pick earliest-ending non-conflicting interval. Used for: max activities, min arrows, non-overlapping intervals." />
      </div>

      {/* ══════ DP TREE ══════ */}
      <h2 id="tree-dp">DP decision tree</h2>
      <p className="section-sub">When no pattern fits and problem asks for count/max/min/optimal, it&#39;s DP. Branch on state shape.</p>
      <p>Signal phrases: <em>&quot;count the number of ways&quot;</em>, <em>&quot;maximum / minimum&quot;</em>, <em>&quot;is it possible&quot;</em>, <em>&quot;longest / shortest&quot;</em>, <em>&quot;optimal&quot;</em>, <em>&quot;partition into&quot;</em>.</p>
      <p className="scroll-hint">← scroll horizontally if needed →</p>
      <div className="tree-wrap"><div className="tree">
        <ul><li>
          <N t="dp">Dynamic programming</N>
          <ul><li>
            <N t="question">State shape?</N>
            <ul>
              <li><N t="answer">Single index</N><ul><li><N t="pattern">1D DP<small>robber, LIS, stairs</small></N></li></ul></li>
              <li><N t="answer">Two sequences</N><ul><li><N t="pattern">2D DP<small>LCS, edit distance</small></N></li></ul></li>
              <li><N t="answer">Grid position</N><ul><li><N t="pattern">Grid DP<small>unique paths</small></N></li></ul></li>
              <li><N t="answer">Items + capacity</N><ul><li><N t="pattern">Knapsack DP<small>0/1, unbounded</small></N></li></ul></li>
              <li><N t="answer">Range [i..j]</N><ul><li><N t="pattern">Interval DP<small>burst balloons</small></N></li></ul></li>
              <li><N t="answer">Set of visited</N><ul><li><N t="pattern">Bitmask DP<small>TSP, n ≤ 20</small></N></li></ul></li>
              <li><N t="answer">Tree nodes</N><ul><li><N t="pattern">Tree DP<small>post-order tuples</small></N></li></ul></li>
              <li><N t="answer">Has states</N><ul><li><N t="pattern">State machine<small>stock problems</small></N></li></ul></li>
            </ul>
          </li></ul>
        </li></ul>
      </div></div>

      <h3 id="dp-detail">DP framework + all types</h3>
      <div className="framework">
        <strong>The DP framework — apply to every DP problem:</strong>
        <ol>
          <li><strong>Define the state.</strong> What does <code>dp[i]</code> or <code>dp[i][j]</code> actually mean? Write it in English before coding.</li>
          <li><strong>Write the recurrence.</strong> How does <code>dp[i]</code> relate to smaller subproblems? What choices exist at step i?</li>
          <li><strong>Base cases.</strong> Smallest subproblems.</li>
          <li><strong>Order of computation.</strong> Bottom-up (dependencies first) or top-down memoization.</li>
          <li><strong>Space optimization.</strong> Often only last 1-2 rows matter. Do this AFTER basic version works.</li>
        </ol>
      </div>
      <div className="card-grid">
        <C color="amber" tag="1D DP" title="State = single index" desc="Climb stairs, house robber, decode ways, LIS, word break. dp[i] depends on a few previous cells. Usually space-optimizable to O(1)." />
        <C color="amber" tag="2D DP" title="Two strings / sequences" desc="LCS, edit distance, regex matching, distinct subsequences, interleaving strings. dp[i][j] = answer for prefixes of length i and j." />
        <C color="amber" tag="Grid DP" title="2D grid paths" desc="Unique paths, min path sum, maximal square, dungeon game. dp[i][j] usually depends on top and left neighbors." />
        <C color="amber" tag="0/1 Knapsack" title="Each item once" desc="Subset sum, partition equal subset sum, target sum, last stone weight II. dp[i][w] = best using first i items with capacity w. Iterate capacity backwards for 1D." />
        <C color="amber" tag="Unbounded knapsack" title="Items reusable" desc="Coin change, combination sum IV, perfect squares. Iterate capacity forwards. Items-outside = combinations, capacity-outside = permutations." />
        <C color="amber" tag="Interval DP" title="Solve on ranges" desc="Burst balloons, matrix chain, palindrome partitioning, min cost to merge stones. dp[i][j] = best for subarray i..j. Iterate by length then start." />
        <C color="amber" tag="Tree DP" title="Post-order with tuples" desc="House robber III, diameter, binary tree cameras, max independent set. Return tuple of (take, skip) states from each child." />
        <C color="amber" tag="Bitmask DP" title="n ≤ 20 visited set" desc="TSP, assignment problems, 'visit all nodes', partition to K equal subsets. dp[mask] or dp[mask][i] where mask = set of visited items." />
        <C color="amber" tag="Digit DP" title="Count numbers with property" desc="'How many numbers in [L, R] have property X?' dp[pos][tight][state]. Common in contests, rare in interviews." />
        <C color="amber" tag="State machine" title="Stock / cooldown problems" desc="Buy/sell with cooldown, transaction limits. dp[i][holding][transactions]. Draw the state diagram first." />
      </div>

      {/* ══════ ADVANCED ══════ */}
      <h2 id="advanced">Advanced patterns</h2>
      <p>These show up less often but are instantly recognizable when they do.</p>
      <div className="card-grid">
        <C color="blue" tag="Range queries" title="Segment tree / Fenwick (BIT)" desc="Point update + range query → Fenwick (simpler). Range update + range query → segment tree with lazy propagation. O(log n) per op." />
        <C color="blue" tag="String matching" title="KMP / Z-algorithm" desc="Find pattern in text in O(n+m). KMP uses failure function. Z-algorithm is conceptually simpler." />
        <C color="blue" tag="String hashing" title="Rabin-Karp" desc="Rolling hash for O(1) substring comparison. Used for: multiple pattern matching, longest duplicate substring (with binary search)." />
        <C color="blue" tag="Trie" title="Prefix tree" desc="Autocomplete, word search II, maximum XOR pair, longest common prefix. Each node has ~26 children." />
        <C color="blue" tag="Palindromes" title="Expand around center" desc="O(n²). Try every index (odd and even length), expand outwards while chars match. Simple and usually fast enough." />
        <C color="blue" tag="Palindromes" title="Manacher's algorithm" desc="O(n) longest palindromic substring. Only needed for tight constraints. Uses symmetry of previously found palindromes." />
        <C color="blue" tag="Two heaps" title="Median from data stream" desc="Max-heap for lower half, min-heap for upper half. Balance sizes after each insert. Median = top of one heap or average." />
        <C color="blue" tag="Design" title="LRU cache" desc="HashMap of key → doubly linked list node. O(1) get and put. On access, move to front. On capacity exceeded, evict tail." />
        <C color="blue" tag="Design" title="LFU cache" desc="HashMap + frequency buckets (each bucket = DLL). Track min frequency. More complex than LRU but same O(1)." />
        <C color="blue" tag="Game theory" title="Minimax DP" desc="'Can player 1 win with optimal play?' Memoized minimax. State includes whose turn. Used for: stone game, predict the winner." />
        <C color="blue" tag="Math" title="GCD / LCM" desc="Euclidean: gcd(a, b) = gcd(b, a % b). LCM = a*b/gcd. Used in: fraction simplification, coprime checks." />
        <C color="blue" tag="Math" title="Sieve of Eratosthenes" desc="Find all primes up to n in O(n log log n). Mark multiples as composite." />
        <C color="blue" tag="Math" title="Fast exponentiation" desc="pow(x, n) in O(log n) via repeated squaring. Combined with matrix exponentiation for Fibonacci in O(log n)." />
        <C color="blue" tag="Random" title="Reservoir sampling" desc="Pick k random items from stream of unknown length. For item i (1-indexed), keep with probability k/i. O(n) time, O(k) space." />
        <C color="blue" tag="Random" title="Fisher-Yates shuffle" desc="In-place random shuffle. For i from n-1 down to 1: swap a[i] with a[random(0, i)]. Uniform distribution, O(n)." />
        <C color="blue" tag="Flow" title="Max flow (rare)" desc="Ford-Fulkerson, Edmonds-Karp, Dinic's. Min-cut = max-flow. Shows up in hard problems disguised as bipartite matching." />
      </div>

      {/* ══════ META STRATEGY ══════ */}
      <h2 id="meta">Meta-strategy when stuck</h2>
      <p>If you can&#39;t place the problem after going through the trees, these heuristics often break the deadlock. Apply them in order.</p>
      <ol className="clean">
        <li style={{margin:"10px 0"}}><strong>State the brute force out loud.</strong> Even if you won&#39;t code it, saying it clarifies the problem. It also gives you a baseline complexity to improve from.</li>
        <li style={{margin:"10px 0"}}><strong>Look for redundant work in the brute force.</strong> Repeated computation → memoization. Repeated sort → precompute once. Repeated lookup → hashmap.</li>
        <li style={{margin:"10px 0"}}><strong>Reverse the problem.</strong> Iterate from the end. Think about what the answer <em>isn&#39;t</em>. Swap source and target. Sometimes the reverse is trivial.</li>
        <li style={{margin:"10px 0"}}><strong>Sort if order doesn&#39;t matter.</strong> Sorting unlocks two pointers, greedy, binary search. Almost always worth the O(n log n) cost.</li>
        <li style={{margin:"10px 0"}}><strong>Think about invariants.</strong> What stays true as you iterate? Key insight for monotonic stack, deque, and most greedy proofs.</li>
        <li style={{margin:"10px 0"}}><strong>Draw it.</strong> Trees, graphs, DP tables. Your visual cortex spots patterns your verbal reasoning misses.</li>
        <li style={{margin:"10px 0"}}><strong>Work small examples by hand.</strong> n=1, n=2, n=3. Patterns emerge.</li>
        <li style={{margin:"10px 0"}}><strong>Ask what data structure gives O(1) for the bottleneck.</strong> &quot;Find min&quot; → heap. &quot;Find by key&quot; → hashmap. &quot;Next greater&quot; → monotonic stack.</li>
        <li style={{margin:"10px 0"}}><strong>Consider the complement.</strong> Instead of counting what satisfies, count what doesn&#39;t and subtract from total.</li>
        <li style={{margin:"10px 0"}}><strong>Look for a monotonic property.</strong> If you can binary search on the answer, the problem reduces to a feasibility check.</li>
      </ol>

      {/* ══════ CHEAT SHEET ══════ */}
      <h2 id="cheatsheet">Pattern cheat sheet</h2>
      <p>When you see the signal phrase on the left, reach for the pattern on the right first.</p>
      <table>
        <thead><tr><th>Signal / problem phrase</th><th>First thing to try</th></tr></thead>
        <tbody>
          <tr><td>&quot;Contiguous subarray / substring&quot; + sum or length</td><td>Sliding window or prefix sum</td></tr>
          <tr><td>Sorted array + pair or triplet with target</td><td>Two pointers</td></tr>
          <tr><td>&quot;Kth largest / smallest&quot;</td><td>Heap of size K, or Quickselect</td></tr>
          <tr><td>&quot;Top K frequent&quot;</td><td>HashMap + heap, or bucket sort</td></tr>
          <tr><td>&quot;Next greater / smaller element&quot;</td><td>Monotonic stack</td></tr>
          <tr><td>&quot;Max / min in sliding window&quot;</td><td>Monotonic deque</td></tr>
          <tr><td>&quot;Shortest path&quot; (unweighted)</td><td>BFS</td></tr>
          <tr><td>&quot;Shortest path&quot; (weighted, non-negative)</td><td>Dijkstra</td></tr>
          <tr><td>&quot;Shortest path&quot; (negative edges)</td><td>Bellman-Ford</td></tr>
          <tr><td>&quot;All pairs shortest path&quot;</td><td>Floyd-Warshall (n ≤ 400)</td></tr>
          <tr><td>&quot;Course schedule&quot; / dependencies / ordering</td><td>Topological sort</td></tr>
          <tr><td>Connected components / union operations</td><td>Union-Find (DSU) or DFS</td></tr>
          <tr><td>&quot;Minimum spanning tree&quot;</td><td>Kruskal or Prim</td></tr>
          <tr><td>&quot;Count the number of ways&quot;</td><td>DP</td></tr>
          <tr><td>&quot;Maximum / minimum&quot; + optimal substructure</td><td>DP</td></tr>
          <tr><td>&quot;Is it possible to…&quot;</td><td>DP (decision variant) or BFS</td></tr>
          <tr><td>&quot;All permutations / combinations / subsets&quot;</td><td>Backtracking</td></tr>
          <tr><td>&quot;N queens&quot; / constraint satisfaction</td><td>Backtracking with pruning</td></tr>
          <tr><td>&quot;Longest palindromic substring&quot;</td><td>Expand around center or DP</td></tr>
          <tr><td>Prefix matching / autocomplete / word search</td><td>Trie</td></tr>
          <tr><td>Range query on mutable array</td><td>Segment tree or Fenwick tree</td></tr>
          <tr><td>Range query on immutable array</td><td>Prefix sum</td></tr>
          <tr><td>&quot;Cycle in linked list&quot; / &quot;find middle&quot;</td><td>Fast and slow pointers</td></tr>
          <tr><td>Reverse linked list (whole or part)</td><td>Iterative pointer reversal</td></tr>
          <tr><td>In-place with values in 1..n</td><td>Cyclic sort</td></tr>
          <tr><td>&quot;Merge k sorted…&quot;</td><td>Min-heap of heads</td></tr>
          <tr><td>&quot;Median of data stream&quot;</td><td>Two heaps (max-heap + min-heap)</td></tr>
          <tr><td>&quot;LRU cache&quot; / O(1) get and put</td><td>HashMap + doubly linked list</td></tr>
          <tr><td>Interval overlap / merge</td><td>Sort by start, sweep</td></tr>
          <tr><td>&quot;Maximum non-overlapping intervals&quot;</td><td>Sort by end, greedy</td></tr>
          <tr><td>&quot;Minimum meeting rooms&quot;</td><td>Heap of end times, or sweep line</td></tr>
          <tr><td>n ≤ 20 with &quot;visit all&quot; or assignment</td><td>Bitmask DP</td></tr>
          <tr><td>Search space has monotonic property</td><td>Binary search on answer</td></tr>
          <tr><td>&quot;Edit distance&quot; / LCS / two strings</td><td>2D DP</td></tr>
          <tr><td>&quot;Robber&quot; / &quot;paint houses&quot; / &quot;jump game&quot;</td><td>1D DP</td></tr>
          <tr><td>&quot;Buy / sell stock&quot; with constraints</td><td>State machine DP</td></tr>
          <tr><td>&quot;Burst balloons&quot; / &quot;matrix chain&quot;</td><td>Interval DP</td></tr>
          <tr><td>&quot;Partition array into K equal subsets&quot;</td><td>Bitmask DP or backtracking</td></tr>
          <tr><td>&quot;Coin change&quot; / &quot;ways to make amount&quot;</td><td>Unbounded knapsack DP</td></tr>
          <tr><td>&quot;Subset sum&quot; / &quot;equal partition&quot;</td><td>0/1 knapsack DP</td></tr>
          <tr><td>Grid with &quot;islands&quot; / &quot;regions&quot;</td><td>DFS / BFS flood fill</td></tr>
          <tr><td>Grid with &quot;rotting&quot; / &quot;fire spreading&quot;</td><td>Multi-source BFS</td></tr>
          <tr><td>Matrix with &quot;transform in place&quot;</td><td>Two-pointer / layer-by-layer</td></tr>
          <tr><td>&quot;Clone graph&quot; / &quot;deep copy&quot;</td><td>HashMap + DFS/BFS</td></tr>
          <tr><td>&quot;Find all anagrams&quot; / &quot;character match&quot;</td><td>Sliding window + counter</td></tr>
          <tr><td>&quot;XOR&quot; tricks / &quot;single number&quot;</td><td>Bit manipulation</td></tr>
          <tr><td>&quot;Power of 2/3/4&quot; / bit checks</td><td>Bit manipulation</td></tr>
          <tr><td>&quot;Serialize&quot; a data structure</td><td>Pre-order with null markers</td></tr>
        </tbody>
      </table>

      {/* ══════ COMPLEXITY ══════ */}
      <h2 id="complexity-ref">Complexity reference</h2>

      <h3>Data structures</h3>
      <table>
        <thead><tr><th>Structure</th><th>Access</th><th>Search</th><th>Insert</th><th>Delete</th></tr></thead>
        <tbody>
          <tr><td>Array</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
          <tr><td>Sorted array</td><td>O(1)</td><td>O(log n)</td><td>O(n)</td><td>O(n)</td></tr>
          <tr><td>Linked list</td><td>O(n)</td><td>O(n)</td><td>O(1)*</td><td>O(1)*</td></tr>
          <tr><td>Hash table</td><td>—</td><td>O(1) avg</td><td>O(1) avg</td><td>O(1) avg</td></tr>
          <tr><td>BST (balanced)</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td></tr>
          <tr><td>Heap (binary)</td><td>—</td><td>O(n)</td><td>O(log n)</td><td>O(log n)</td></tr>
          <tr><td>Trie</td><td>O(k)</td><td>O(k)</td><td>O(k)</td><td>O(k)</td></tr>
          <tr><td>Union-Find</td><td>—</td><td>~O(1)</td><td>~O(1)</td><td>—</td></tr>
          <tr><td>Segment tree</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td></tr>
          <tr><td>Fenwick tree (BIT)</td><td>O(log n)</td><td>—</td><td>O(log n)</td><td>—</td></tr>
        </tbody>
      </table>
      <p style={{fontSize:12,color:"var(--muted)"}}>* Given pointer to node. k = key length for trie.</p>

      <h3>Sorting algorithms</h3>
      <table>
        <thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead>
        <tbody>
          <tr><td>Quicksort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n)</td><td>No</td></tr>
          <tr><td>Mergesort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>Yes</td></tr>
          <tr><td>Heapsort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>No</td></tr>
          <tr><td>Timsort</td><td>O(n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>Yes</td></tr>
          <tr><td>Insertion sort</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>Yes</td></tr>
          <tr><td>Counting sort</td><td>O(n+k)</td><td>O(n+k)</td><td>O(n+k)</td><td>O(k)</td><td>Yes</td></tr>
          <tr><td>Radix sort</td><td>O(nk)</td><td>O(nk)</td><td>O(nk)</td><td>O(n+k)</td><td>Yes</td></tr>
        </tbody>
      </table>

      <h3>Graph algorithms</h3>
      <table>
        <thead><tr><th>Algorithm</th><th>Time</th><th>Space</th><th>Use case</th></tr></thead>
        <tbody>
          <tr><td>BFS / DFS</td><td>O(V + E)</td><td>O(V)</td><td>Traversal, unweighted shortest path</td></tr>
          <tr><td>Dijkstra (binary heap)</td><td>O((V+E) log V)</td><td>O(V)</td><td>Non-negative weighted shortest path</td></tr>
          <tr><td>Bellman-Ford</td><td>O(VE)</td><td>O(V)</td><td>Negative edges, cycle detection</td></tr>
          <tr><td>Floyd-Warshall</td><td>O(V³)</td><td>O(V²)</td><td>All-pairs shortest path</td></tr>
          <tr><td>Topological sort</td><td>O(V + E)</td><td>O(V)</td><td>DAG ordering</td></tr>
          <tr><td>Kruskal&#39;s MST</td><td>O(E log E)</td><td>O(V)</td><td>MST with edge list</td></tr>
          <tr><td>Prim&#39;s MST</td><td>O((V+E) log V)</td><td>O(V)</td><td>MST with adjacency list</td></tr>
          <tr><td>Tarjan&#39;s SCC</td><td>O(V + E)</td><td>O(V)</td><td>Strongly connected components</td></tr>
        </tbody>
      </table>

      <div className="intro" style={{marginTop:48}}>
        <strong>Final advice:</strong> Don&#39;t try to memorize this entire page. Use the decision trees for pattern recognition, then drill specific sub-trees as you encounter those problems in practice. After ~50 problems, the master tree becomes automatic. After ~150, you see the pattern before finishing the problem statement. After ~300, you start recognizing which DP variant applies just from constraints alone. Speed comes from deliberate repetition against this framework — not from re-reading it.
      </div>

      <footer style={{marginTop:48,paddingTop:24,borderTop:"1px solid var(--border)",fontSize:13,color:"var(--muted)",textAlign:"center"}}>
        <a href="/" style={{color:"var(--root)"}}>LeetDaily</a> — Free LeetCode interview prep extension with 6 curated DSA sheets.{" "}
        <a href="https://chromewebstore.google.com/detail/leetdaily/kpmmlpoonleloofchbbfnmicchmhehcf" style={{color:"var(--root)"}}>Install →</a>
      </footer>
    </div>
  );
}
