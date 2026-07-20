// Shared, presentation-agnostic helpers for turning raw LeetCode stats into the
// numbers we show (streaks, difficulty counts, recent-solve rollups). Used by
// both the detailed LeetCodeStats card and the compact CohortLeaderboard rows.

import type { Difficulty, DifficultyCount, RecentSubmission } from '@/services/leetcode';

export const DAY_SECONDS = 86400;

export function countByDifficulty(
  list: DifficultyCount[] | undefined,
  difficulty: Difficulty
): number {
  return list?.find((d) => d.difficulty === difficulty)?.count ?? 0;
}

/** Unix seconds for today at UTC midnight. */
export function todayUtcMidnight(): number {
  const now = new Date();
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000
  );
}

/** Floor a timestamp to its UTC-midnight day key (as used in the calendar map). */
export function dayKeyForTimestamp(ts: number): string {
  return String(Math.floor(ts / DAY_SECONDS) * DAY_SECONDS);
}

/** Set of UTC-midnight day keys that had at least one submission. */
export function activeDaySet(submissions: Record<string, number>): Set<string> {
  return new Set(
    Object.entries(submissions)
      .filter(([, value]) => value > 0)
      .map(([key]) => key)
  );
}

/** Consecutive days of activity ending today or yesterday; 0 if broken. */
export function currentStreak(active: Set<string>): number {
  if (active.size === 0) return 0;
  let cursor = todayUtcMidnight();
  if (!active.has(String(cursor)) && active.has(String(cursor - DAY_SECONDS))) {
    cursor -= DAY_SECONDS;
  } else if (!active.has(String(cursor))) {
    return 0;
  }
  let streak = 0;
  while (active.has(String(cursor))) {
    streak += 1;
    cursor -= DAY_SECONDS;
  }
  return streak;
}

/**
 * Distinct problems solved in the last 30 days, from the recent-AC feed.
 * `capped` is true when the feed (max 20 entries) is likely hiding more solves.
 */
export function solvedLast30(recent: RecentSubmission[]): {
  count: number;
  capped: boolean;
} {
  const cutoff = Math.floor(Date.now() / 1000) - 30 * DAY_SECONDS;
  const count = new Set(
    recent
      .filter((submission) => Number(submission.timestamp) >= cutoff)
      .map((submission) => submission.titleSlug)
  ).size;
  const capped = recent.length >= 20 && count >= 20;
  return { count, capped };
}

/** Slugs of problems in the recent-AC feed, for "recently solved" homework badges. */
export function recentlySolvedSlugs(recent: RecentSubmission[]): Set<string> {
  return new Set(recent.map((submission) => submission.titleSlug));
}
