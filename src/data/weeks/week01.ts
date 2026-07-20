import type { Week } from './types';

const week01: Week = {
  week: 1,
  topic: 'Binary Search',
  summary:
    'Trading a linear scan for a logarithmic one, and the mental model that unlocks "binary search on the answer".',
  slides: [
    {
      title: 'By the end you can…',
      points: [
        'Write a bug-free binary search from memory (boundaries and termination).',
        'Explain why the loop is O(log n) and when it applies.',
        'Recognise a monotonic answer space and binary-search over it.',
        "Use Python's bisect module instead of hand-rolling when appropriate.",
      ],
    },
    {
      title: 'Why binary search?',
      points: [
        'Linear scan checks every element: O(n).',
        'If the data is sorted, each comparison eliminates half the remaining space.',
        'log2(1,000,000) is about 20 — twenty steps instead of a million.',
      ],
      note: 'Anchor the intuition with a phone-book / guess-the-number analogy before any code.',
    },
    {
      title: 'The invariant',
      points: [
        'Maintain a range [lo, hi] that must contain the answer if it exists.',
        'Each step shrinks the range while preserving that promise.',
        'Terminate when the range is empty (lo > hi).',
      ],
    },
    {
      title: 'The classic template',
      code: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      note: 'Walk the two bug sources live: the <= vs < in the loop, and mid +/- 1.',
    },
    {
      title: 'The real superpower: search on the answer',
      points: [
        'You do not need a sorted array — you need a monotonic yes/no test.',
        'If feasible(x) is False for small x and True for large x, binary-search the boundary.',
        'Turns "minimum/maximum such that …" problems into O(n log range).',
      ],
      code: `def lower_bound(lo, hi, feasible):
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    },
    {
      title: 'Pythonic shortcut: bisect',
      code: `import bisect
i = bisect.bisect_left(nums, target)   # leftmost insertion point
found = i < len(nums) and nums[i] == target`,
      note: 'Great once they can write it by hand — shows language fluency.',
    },
    {
      title: 'Worked example: Search in Rotated Sorted Array',
      points: [
        'Even rotated, at any mid one half [lo..mid] or [mid..hi] is still sorted.',
        'Check which half is sorted by comparing nums[lo] with nums[mid].',
        "If the target is inside the sorted half's range, search there; else the other half.",
        'The halving property holds, so it stays O(log n).',
      ],
    },
    {
      title: 'Worked example: Koko Eating Bananas',
      points: [
        'Brute force tries every speed from 1 to max(piles): too slow.',
        'If speed k works, any speed > k also works — feasibility is monotonic.',
        'Binary-search k over [1, max(piles)] with feasible(k) = sum(ceil(pile/k)) <= h.',
        'O(n log(max pile)) — the constraints basically demand a log approach.',
      ],
    },
  ],
  homework: [
    {
      name: 'Binary Search',
      slug: 'binary-search',
      difficulty: 'Easy',
      patternId: 'binary-search',
      hint: 'Warm-up: write the template from memory, no peeking. Test on [], [5], [1,3].',
    },
    {
      name: 'First Bad Version',
      slug: 'first-bad-version',
      difficulty: 'Easy',
      patternId: 'binary-search',
      hint: 'Feasibility is "is this version bad?" — find the leftmost True.',
    },
    {
      name: 'Search a 2D Matrix',
      slug: 'search-a-2d-matrix',
      difficulty: 'Medium',
      patternId: 'binary-search',
      hint: 'Treat the matrix as one flat sorted array of length m*n and map an index back to (row, col).',
    },
    {
      name: 'Find Minimum in Rotated Sorted Array',
      slug: 'find-minimum-in-rotated-sorted-array',
      difficulty: 'Medium',
      patternId: 'binary-search',
      hint: 'Compare nums[mid] to nums[hi] to decide which side the minimum is on.',
    },
    {
      name: 'Koko Eating Bananas',
      slug: 'koko-eating-bananas',
      difficulty: 'Medium',
      patternId: 'binary-search',
      hint: 'Binary-search the speed, not an index. feasible(k) sums ceil(pile/k).',
    },
  ],
};

export default week01;
