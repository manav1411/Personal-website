// The people learning together. `leetcodeUsername` drives the live leaderboard
// on /learn (see src/components/learn/CohortLeaderboard.tsx).
//
// To add a grad: append `{ name, leetcodeUsername }`. The username must be their
// public LeetCode handle (leetcode.com/u/<username>/). Rows whose profile can't
// be loaded fail gracefully and drop to the bottom of the board.

export interface CohortMember {
  name: string;
  leetcodeUsername: string;
}

const cohort: CohortMember[] = [
  { name: 'Manav', leetcodeUsername: 'manav141' },
  // Example public profiles so the board isn't lonely — replace these with your
  // grads' real handles as they join.
  { name: 'lee215 (example)', leetcodeUsername: 'lee215' },
  { name: 'votrubac (example)', leetcodeUsername: 'votrubac' },
];

export default cohort;
