// The pattern library: the reusable core of the program. Each entry answers
// "when do I reach for this, what does the skeleton look like, and where do I
// practise it?" — useful for teaching and for fast recall in interviews.

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface PatternProblem {
  name: string;
  slug: string; // leetcode.com/problems/<slug>/
  difficulty: ProblemDifficulty;
}

export interface Pattern {
  id: string;
  name: string;
  category: string;
  /** One-line "why it exists". */
  idea: string;
  /** Recognition cues: "when you see X, reach for this". */
  triggers: string[];
  /** Python skeleton you can adapt on a whiteboard. */
  template: string;
  complexity: string;
  problems: PatternProblem[];
}

export const patternCategories = [
  'Searching',
  'Arrays & Strings',
  'Graphs',
  'Recursion',
  'Heaps',
  'Stacks',
  'Dynamic Programming',
] as const;

const patterns: Pattern[] = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    idea: 'Halve the search space each step by exploiting monotonic structure.',
    triggers: [
      'Input is sorted, or an answer space is monotonic (feasible past some threshold).',
      'Phrasing like "minimum/maximum value such that ..." (binary search on the answer).',
      'Target complexity looks like O(log n) or O(n log n).',
    ],
    template: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2          # no overflow risk in Python
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# "Search on the answer" variant: find the smallest x where feasible(x) is True.
def lower_bound(lo, hi, feasible):
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    complexity: 'O(log n) time, O(1) space',
    problems: [
      { name: 'Binary Search', slug: 'binary-search', difficulty: 'Easy' },
      { name: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium' },
      { name: 'Koko Eating Bananas', slug: 'koko-eating-bananas', difficulty: 'Medium' },
    ],
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'Arrays & Strings',
    idea: 'Walk two indices toward each other (or in tandem) to avoid a nested loop.',
    triggers: [
      'A sorted array where you need a pair/triple meeting a condition.',
      'In-place work: partitioning, dedup, reversing, merging.',
      'You want to drop O(n^2) brute force to O(n).',
    ],
    template: `def two_sum_sorted(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return [lo, hi]
        if s < target:
            lo += 1                    # need a bigger sum
        else:
            hi -= 1                    # need a smaller sum
    return []`,
    complexity: 'O(n) time (after any sort), O(1) space',
    problems: [
      { name: 'Two Sum II', slug: 'two-sum-ii-input-array-is-sorted', difficulty: 'Medium' },
      { name: '3Sum', slug: '3sum', difficulty: 'Medium' },
      { name: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium' },
    ],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'Arrays & Strings',
    idea: 'Maintain a moving range and update an aggregate instead of recomputing it.',
    triggers: [
      'Contiguous subarray/substring with a constraint ("longest/shortest/at most k").',
      'You catch yourself re-summing overlapping ranges.',
      'Answer is a window length or a count of valid windows.',
    ],
    template: `def longest_unique(s):
    last_seen = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1   # shrink past the duplicate
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
    complexity: 'O(n) time, O(k) space for the window contents',
    problems: [
      { name: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium' },
      { name: 'Minimum Size Subarray Sum', slug: 'minimum-size-subarray-sum', difficulty: 'Medium' },
      { name: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy' },
    ],
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'Graphs',
    idea: 'Explore level by level with a queue — the first time you reach a node is via a shortest path.',
    triggers: [
      'Shortest path / fewest steps in an unweighted graph or grid.',
      '"Levels", "minimum number of moves", or spreading/flood behaviour.',
    ],
    template: `from collections import deque

def bfs(start, neighbours):
    q = deque([start])
    seen = {start}
    dist = 0
    while q:
        for _ in range(len(q)):        # process one level at a time
            node = q.popleft()
            for nxt in neighbours(node):
                if nxt not in seen:
                    seen.add(nxt)
                    q.append(nxt)
        dist += 1
    return seen`,
    complexity: 'O(V + E) time, O(V) space',
    problems: [
      { name: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium' },
      { name: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'Medium' },
      { name: 'Word Ladder', slug: 'word-ladder', difficulty: 'Hard' },
    ],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'Graphs',
    idea: 'Go deep before wide via recursion (or an explicit stack); great for connectivity and structure.',
    triggers: [
      'Count/explore connected components, flood fill, or reachability.',
      'You need to fully traverse a tree/graph and combine child results.',
    ],
    template: `def dfs(node, neighbours, seen):
    seen.add(node)
    for nxt in neighbours(node):
        if nxt not in seen:
            dfs(nxt, neighbours, seen)
    return seen

# Grids: raise the recursion limit or convert to an explicit stack for large inputs.
import sys
sys.setrecursionlimit(10**6)`,
    complexity: 'O(V + E) time, O(V) recursion depth',
    problems: [
      { name: 'Max Area of Island', slug: 'max-area-of-island', difficulty: 'Medium' },
      { name: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium' },
      { name: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', difficulty: 'Medium' },
    ],
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    category: 'Recursion',
    idea: 'Build a candidate incrementally; undo the last choice when a branch dead-ends.',
    triggers: [
      'Generate all subsets / permutations / combinations.',
      'Constraint-satisfaction puzzles (N-Queens, Sudoku, word search).',
      'Small n but exponential answer space.',
    ],
    template: `def permute(nums):
    res, path, used = [], [], [False] * len(nums)
    def backtrack():
        if len(path) == len(nums):
            res.append(path[:])         # copy: path is mutated in place
            return
        for i, n in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(n)
            backtrack()
            path.pop()                  # undo the choice
            used[i] = False
    backtrack()
    return res`,
    complexity: 'Exponential (e.g. O(n * n!) for permutations)',
    problems: [
      { name: 'Subsets', slug: 'subsets', difficulty: 'Medium' },
      { name: 'Permutations', slug: 'permutations', difficulty: 'Medium' },
      { name: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium' },
    ],
  },
  {
    id: 'heap-top-k',
    name: 'Heaps / Top-K',
    category: 'Heaps',
    idea: 'Keep only the k most relevant elements using a size-k heap instead of sorting everything.',
    triggers: [
      '"Top / smallest / kth" something, or a running median.',
      'Merging k sorted lists, or repeatedly pulling the current min/max.',
    ],
    template: `import heapq
from collections import Counter

def top_k_frequent(nums, k):
    counts = Counter(nums)
    # nlargest builds a size-k heap under the hood.
    return heapq.nlargest(k, counts.keys(), key=counts.get)

def kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)                 # min-heap of the k biggest seen so far
    for n in nums[k:]:
        if n > heap[0]:
            heapq.heapreplace(heap, n)
    return heap[0]`,
    complexity: 'O(n log k) time, O(k) space',
    problems: [
      { name: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium' },
      { name: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium' },
      { name: 'Find Median from Data Stream', slug: 'find-median-from-data-stream', difficulty: 'Hard' },
    ],
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    category: 'Stacks',
    idea: 'Keep a stack in sorted order so the "next greater/smaller" element pops out in O(1) amortised.',
    triggers: [
      '"Next/previous greater or smaller element" for every index.',
      'Spans, temperatures, histogram areas, stock-style problems.',
    ],
    template: `def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                          # holds indices, values decreasing
    for i, n in enumerate(nums):
        while stack and nums[stack[-1]] < n:
            res[stack.pop()] = n        # n is the next greater for that index
        stack.append(i)
    return res`,
    complexity: 'O(n) time (each index pushed/popped once), O(n) space',
    problems: [
      { name: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'Medium' },
      { name: 'Next Greater Element I', slug: 'next-greater-element-i', difficulty: 'Easy' },
      { name: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'Hard' },
    ],
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'Graphs',
    idea: 'Order the nodes of a DAG so every edge points forward; detects cycles for free.',
    triggers: [
      'Dependencies / prerequisites / build order.',
      '"Is there a valid ordering?" or "can everything be completed?"',
    ],
    template: `from collections import deque

def topo_sort(n, edges):               # edges: list of (u -> v)
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for u, v in edges:
        graph[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else []   # [] means a cycle exists`,
    complexity: 'O(V + E) time, O(V + E) space',
    problems: [
      { name: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium' },
      { name: 'Course Schedule II', slug: 'course-schedule-ii', difficulty: 'Medium' },
      { name: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'Hard' },
    ],
  },
  {
    id: 'union-find',
    name: 'Union-Find (DSU)',
    category: 'Graphs',
    idea: 'Track connectivity of a growing set of elements with near-constant-time merges and lookups.',
    triggers: [
      'Grouping / connectivity as edges arrive incrementally.',
      'Detecting cycles in an undirected graph; counting components.',
    ],
    template: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False               # already connected -> cycle edge
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True`,
    complexity: 'Near O(1) amortised per op (inverse-Ackermann)',
    problems: [
      { name: 'Number of Connected Components', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'Medium' },
      { name: 'Redundant Connection', slug: 'redundant-connection', difficulty: 'Medium' },
      { name: 'Accounts Merge', slug: 'accounts-merge', difficulty: 'Medium' },
    ],
  },
  {
    id: 'dp-1d',
    name: '1D Dynamic Programming',
    category: 'Dynamic Programming',
    idea: 'Define state as an index and reuse subproblem answers along a single axis.',
    triggers: [
      'Count ways / min cost / max value along a sequence.',
      'Each choice depends on a few previous results ("take vs skip").',
    ],
    template: `def rob(nums):
    # state: best loot considering houses up to i
    prev, curr = 0, 0
    for n in nums:
        prev, curr = curr, max(curr, prev + n)   # skip vs rob-this
    return curr`,
    complexity: 'O(n) time, O(1) space with rolling variables',
    problems: [
      { name: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy' },
      { name: 'House Robber', slug: 'house-robber', difficulty: 'Medium' },
      { name: 'Coin Change', slug: 'coin-change', difficulty: 'Medium' },
    ],
  },
  {
    id: 'dp-2d',
    name: '2D Dynamic Programming',
    category: 'Dynamic Programming',
    idea: 'State spans two axes (two strings, a grid, or index + capacity).',
    triggers: [
      'Comparing/aligning two sequences (subsequence, edit distance).',
      'Grid paths, or "index + remaining budget" style knapsacks.',
    ],
    template: `def longest_common_subsequence(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
    complexity: 'O(m*n) time, O(m*n) space (often reducible to O(n))',
    problems: [
      { name: 'Unique Paths', slug: 'unique-paths', difficulty: 'Medium' },
      { name: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium' },
      { name: 'Edit Distance', slug: 'edit-distance', difficulty: 'Medium' },
    ],
  },
];

export function getPattern(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id);
}

export default patterns;
