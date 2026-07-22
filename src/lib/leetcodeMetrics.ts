// Shared, presentation-agnostic helpers for turning raw LeetCode stats into the
// numbers we show (streaks, difficulty counts, recent-solve rollups). Used by
// both the detailed LeetCodeStats card and the compact CohortLeaderboard rows.

import type {
  Difficulty,
  DifficultyCount,
  LeetCodeStats,
  RecentSubmission,
  SolvedProblem,
} from '@/lib/leetcode';

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

export type SolvedByDay = Record<string, SolvedProblem[]>;

/**
 * Day -> solves map. Prefers the accumulated KV history (stats.solvedDays, built
 * up past LeetCode's 20-item cap) and falls back to deriving days from the live
 * recent-AC feed when it's absent. This is the single source of truth for the
 * heatmap, streak, and 30-day count so they always agree.
 */
export function buildSolvedByDay(
  stats: Pick<LeetCodeStats, 'solvedDays' | 'recent'>
): SolvedByDay {
  if (stats.solvedDays) return stats.solvedDays;
  const map: SolvedByDay = {};
  for (const submission of stats.recent) {
    const key = dayKeyForTimestamp(Number(submission.timestamp));
    (map[key] ??= []).push({
      title: submission.title,
      titleSlug: submission.titleSlug,
    });
  }
  return map;
}

/** Current day-streak of solves, from a day -> solves map. */
export function streakFromSolves(solvedByDay: SolvedByDay): number {
  return currentStreak(new Set(Object.keys(solvedByDay)));
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
 * Distinct problems solved in the last 30 days, from a day -> solves map. With
 * the accumulated KV history the count is authoritative; when we've fallen back
 * to the raw 20-item feed (`accurate = false`) it may still be undercounting, so
 * `capped` is reported.
 */
export function solvedLast30(
  solvedByDay: SolvedByDay,
  accurate: boolean
): { count: number; capped: boolean } {
  const cutoff = todayUtcMidnight() - 29 * DAY_SECONDS;
  const slugs = new Set<string>();
  for (const [key, list] of Object.entries(solvedByDay)) {
    if (Number(key) < cutoff) continue;
    for (const problem of list) slugs.add(problem.titleSlug);
  }
  const count = slugs.size;
  return { count, capped: !accurate && count >= 20 };
}

/** Slugs of problems in the recent-AC feed, for "recently solved" homework badges. */
export function recentlySolvedSlugs(recent: RecentSubmission[]): Set<string> {
  return new Set(recent.map((submission) => submission.titleSlug));
}
