import type { Week } from './types';

const week01: Week = {
  week: 1,
  topic: 'Binary Search',
  summary:
    'Trading a linear scan for a logarithmic one, and getting back into hand-coding mode.',
  slides: [
    {
      title: 'Binary Search',
      points: [
        'Week 1 — write the algorithm, rebuild the habit, and see if this course fits.',
      ],
    },
    {
      title: 'By the end you can…',
      points: [
        'Understand and write the binary search algorithm.',
        'Restore your hand-coding muscles a bit.',
        'Re-familiarise yourself with Python.',
        'Know if this content is useful for you.',
      ],
    },
    {
      title: 'Why this course?',
      points: [
        'AI can already do what juniors do — great as a senior accelerator, risky as a junior crutch.',
        'If we lean on it too hard, we stop building skills beyond QA.',
        'Going back to DSA puts us in "thinking" mode again.',
        'You may never ship a greedy algorithm at work — the payoff is the problem-solving muscle.',
      ],
      note:
        "There are quite a few reasons. In the world of AI coding, AI can do everything we as juniors can do. As a senior — this is fantastic and acts as an accelerator. But as juniors, we have to be careful — we're still developing our fundamental skills and if we rely too heavily on AI as a crutch we won't end up developing skills besides quality assurance. So I think going back to our roots, re-learning DSA is a good way to get back into that 'thinking' mode. Of course, you probably won't encounter a situation as a dev where you need to implement a greedy algorithm — but it's all about developing the muscles to problem solve better — that will set you apart.",
    },
    {
      title: 'Prerequisites',
      points: [
        'Some Python knowledge (you can pick it up along the way).',
        'A LeetCode account.',
        'Consistency.',
      ],
    },
    {
      title: 'Intuition and pseudocode',
      points: [
        'Sorted input (or a monotonic answer space) lets each comparison discard half the range.',
        'Keep a window [lo, hi] that still might contain the answer.',
        'Probe the middle; move lo or hi past mid; repeat until the window is empty.',
        'log₂(1,000,000) ≈ 20 — twenty checks instead of a million.',
      ],
      code: `# find target in a sorted array, or -1
lo, hi = 0, n - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if nums[mid] == target: return mid
    if nums[mid] < target:  lo = mid + 1
    else:                    hi = mid - 1
return -1`,
      note: 'Phone-book / guess-the-number analogy before diving into code.',
    },
    {
      title: 'Worked example: 704. Binary Search',
      points: [
        'Given a sorted array of distinct ints, return the index of target, or -1.',
        'Classic closed interval: loop while lo <= hi; always step mid ± 1.',
        'Bug magnets: off-by-one on the loop condition, and forgetting to move past mid.',
        'Trace live on [], [5], and a mid-sized array before coding on LeetCode.',
      ],
      code: `def search(nums, target):
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
      note: 'Live-code this from a blank file; only reveal the template if someone gets stuck.',
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
