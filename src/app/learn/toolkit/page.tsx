import { FC } from 'react';
import { ListChecks, Gauge, Layers } from 'lucide-react';
import LearnNav from '@/components/learn/LearnNav';

const framework: { step: string; detail: string }[] = [
  {
    step: 'Understand',
    detail:
      'Restate the problem in your own words. Clarify inputs, outputs, ranges, and edge cases (empty, one element, duplicates, negatives).',
  },
  {
    step: 'Examples',
    detail:
      'Work a small example by hand. Invent a tricky one. This is where the real structure of the problem reveals itself.',
  },
  {
    step: 'Brute force',
    detail:
      'State the obvious O(n^2)/exponential solution out loud. It proves you understand the problem and gives a correctness baseline.',
  },
  {
    step: 'Spot the pattern',
    detail:
      'What is the repeated work? Sorted input, overlapping subproblems, "next greater", shortest path… map it to a known pattern.',
  },
  {
    step: 'Optimise',
    detail:
      'Pick the data structure that removes the repeated work (hashmap, heap, monotonic stack, memo). Re-check the target complexity.',
  },
  {
    step: 'Code',
    detail:
      'Write it in small, testable pieces. Name things clearly. Handle the edge cases you listed in step 1.',
  },
  {
    step: 'Test & analyse',
    detail:
      'Dry-run your examples, then state final time/space complexity. Mention trade-offs you would make with different constraints.',
  },
];

const constraints: { constraint: string; implies: string; note: string }[] = [
  { constraint: 'n ≤ 10–12', implies: 'O(n!) / O(2^n)', note: 'Permutations, subsets, brute-force backtracking are fine.' },
  { constraint: 'n ≤ 20–25', implies: 'O(2^n)', note: 'Bitmask DP over subsets.' },
  { constraint: 'n ≤ 500', implies: 'O(n^3)', note: 'Triple loops / Floyd–Warshall.' },
  { constraint: 'n ≤ 5,000', implies: 'O(n^2)', note: 'Nested loops, most 2D DP.' },
  { constraint: 'n ≤ 10^5–10^6', implies: 'O(n log n) or O(n)', note: 'Sort, heap, two pointers, sliding window, binary search.' },
  { constraint: 'n ≥ 10^7', implies: 'O(n) or O(log n)', note: 'Single pass, math, or binary search on the answer.' },
];

const bigO: { structure: string; ops: { label: string; cost: string }[] }[] = [
  {
    structure: 'Dynamic array (list)',
    ops: [
      { label: 'index / append', cost: 'O(1)*' },
      { label: 'insert / pop front', cost: 'O(n)' },
      { label: 'search (unsorted)', cost: 'O(n)' },
    ],
  },
  {
    structure: 'Hashmap / set (dict, set)',
    ops: [
      { label: 'insert / lookup / delete', cost: 'O(1)*' },
      { label: 'iterate', cost: 'O(n)' },
    ],
  },
  {
    structure: 'Heap (heapq)',
    ops: [
      { label: 'push / pop', cost: 'O(log n)' },
      { label: 'peek min', cost: 'O(1)' },
      { label: 'heapify', cost: 'O(n)' },
    ],
  },
  {
    structure: 'Deque',
    ops: [
      { label: 'append / pop either end', cost: 'O(1)' },
      { label: 'index middle', cost: 'O(n)' },
    ],
  },
  {
    structure: 'Balanced BST / sorted list',
    ops: [
      { label: 'insert / delete / search', cost: 'O(log n)' },
      { label: 'range / order queries', cost: 'O(log n)' },
    ],
  },
  {
    structure: 'Union-Find',
    ops: [
      { label: 'union / find', cost: '~O(1)' },
      { label: 'build', cost: 'O(n)' },
    ],
  },
];

const ToolkitPage: FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="w-full max-w-4xl mt-16">
        <h1 className="text-5xl font-bold mb-3">Problem-solving toolkit</h1>
        <p className="text-lg text-neutral-700 dark:text-neutral-300">
          A repeatable method for unfamiliar problems, the constraint-reading
          instinct that points at the right complexity, and a timer to build
          speed.
        </p>
      </header>

      <div className="w-full max-w-4xl mt-6">
        <LearnNav />
      </div>

      {/* Framework */}
      <section className="w-full max-w-4xl mt-10">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          <ListChecks size={20} className="text-blue-500" />
          The method
        </h2>
        <ol className="space-y-3">
          {framework.map((item, i) => (
            <li
              key={item.step}
              className="flex items-start gap-3 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-4"
            >
              <span className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.step}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Constraints -> complexity */}
      <section className="w-full max-w-4xl mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          <Gauge size={20} className="text-blue-500" />
          Constraints → target complexity
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          The input size is a huge hint about the intended approach. Read it first.
        </p>
        <div className="dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 overflow-hidden">
          {constraints.map((row, i) => (
            <div
              key={row.constraint}
              className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 ${
                i !== constraints.length - 1
                  ? 'border-b border-neutral-300 dark:border-neutral-700'
                  : ''
              }`}
            >
              <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100 w-32 shrink-0">
                {row.constraint}
              </span>
              <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 w-32 shrink-0">
                {row.implies}
              </span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {row.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Big-O reference */}
      <section className="w-full max-w-4xl mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          <Layers size={20} className="text-blue-500" />
          Data-structure cheat sheet
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Typical costs. <span className="font-mono">*</span> denotes amortised /
          average case.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bigO.map((entry) => (
            <div
              key={entry.structure}
              className="dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-4"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {entry.structure}
              </h3>
              <ul className="space-y-1">
                {entry.ops.map((op) => (
                  <li
                    key={op.label}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {op.label}
                    </span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100">
                      {op.cost}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-20 mb-5">
        <p className="text-sm text-neutral-500 text-center">
          Made with ✨, powered by ☕
          <br />
          by Manav Dodia
        </p>
      </footer>
    </main>
  );
};

export default ToolkitPage;
