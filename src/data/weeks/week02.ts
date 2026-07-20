import type { Week } from './types';

const week02: Week = {
  week: 2,
  topic: 'Two Pointers & Sliding Window',
  summary: 'Collapse nested loops into a single linear pass over arrays and strings.',
  slides: [
    {
      title: 'Coming next week',
      points: [
        'Opposite-direction pointers (sorted two-sum, container with most water).',
        'Same-direction pointers and the sliding-window pattern.',
        'Fixed vs variable windows and what the aggregate tracks.',
      ],
      note: 'Placeholder — flesh out during prep once Week 1 lands.',
    },
  ],
  homework: [
    {
      name: 'Valid Palindrome',
      slug: 'valid-palindrome',
      difficulty: 'Easy',
      patternId: 'two-pointers',
      hint: 'Two pointers from both ends, skip non-alphanumerics.',
    },
    {
      name: 'Longest Substring Without Repeating Characters',
      slug: 'longest-substring-without-repeating-characters',
      difficulty: 'Medium',
      patternId: 'sliding-window',
      hint: 'Grow the window; when a repeat appears, jump left past the previous occurrence.',
    },
  ],
};

export default week02;
