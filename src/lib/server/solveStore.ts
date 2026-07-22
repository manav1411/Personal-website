// Accumulated per-user solve history in KV. LeetCode's public API only returns
// a user's 20 most recent accepted submissions, so a single fetch can't look
// further back. By merging that feed into a durable per-day calendar on every
// fetch — and via a periodic background refresh (see /api/leetcode/refresh) —
// we build up an accurate solve history that survives past the 20-item cap.
//
// Keyed by lowercased username under `solves:<username>`. A separate
// `solves:_index` lists every username we've seen so the background refresh
// can poll them even when nobody's visiting the site.

import { getEnv, type AppEnv } from './env';
import { getLeetCodeStats, type RecentSubmission, type SolvedProblem } from '@/lib/leetcode';
import { DAY_SECONDS, dayKeyForTimestamp, todayUtcMidnight } from '@/lib/leetcodeMetrics';

const KEY_PREFIX = 'solves:';
const INDEX_KEY = 'solves:_index';
// Retain a little over a year — enough for the heatmap and any realistic streak
// while keeping each record small.
const RETENTION_DAYS = 400;
const MAX_TRACKED_USERS = 500;

export type SolvedDays = Record<string, SolvedProblem[]>;

interface StoredSolves {
  days: SolvedDays;
}

function keyFor(username: string): string {
  return `${KEY_PREFIX}${username.toLowerCase()}`;
}

async function readSolves(env: AppEnv, username: string): Promise<StoredSolves> {
  const raw = await env.LEARN_KV.get(keyFor(username));
  if (!raw) return { days: {} };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.days && typeof parsed.days === 'object') {
      return parsed as StoredSolves;
    }
  } catch {
    // fall through to empty on malformed JSON
  }
  return { days: {} };
}

/** Merge a recent-AC feed into the stored days. Returns true if anything changed. */
function mergeRecent(days: SolvedDays, recent: RecentSubmission[]): boolean {
  let changed = false;
  for (const submission of recent) {
    const ts = Number(submission.timestamp);
    if (!Number.isFinite(ts)) continue;
    const key = dayKeyForTimestamp(ts);
    const list = (days[key] ??= []);
    if (!list.some((p) => p.titleSlug === submission.titleSlug)) {
      list.push({ title: submission.title, titleSlug: submission.titleSlug });
      changed = true;
    }
  }
  return changed;
}

/** Drop days older than the retention window. Returns true if anything changed. */
function prune(days: SolvedDays): boolean {
  const cutoff = todayUtcMidnight() - RETENTION_DAYS * DAY_SECONDS;
  let pruned = false;
  for (const key of Object.keys(days)) {
    if (Number(key) < cutoff) {
      delete days[key];
      pruned = true;
    }
  }
  return pruned;
}

/** Best-effort: record the username so the background refresh can poll it. */
async function registerUsername(env: AppEnv, username: string): Promise<void> {
  const lower = username.toLowerCase();
  try {
    const raw = await env.LEARN_KV.get(INDEX_KEY);
    let list: string[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    if (list.includes(lower) || list.length >= MAX_TRACKED_USERS) return;
    list.push(lower);
    await env.LEARN_KV.put(INDEX_KEY, JSON.stringify(list));
  } catch {
    // index is best-effort; never block the request on it
  }
}

/**
 * Merge the given recent-AC feed into the user's stored history and return the
 * accumulated day -> solves map. Only writes when something actually changed.
 */
export async function accumulateSolves(
  username: string,
  recent: RecentSubmission[]
): Promise<SolvedDays> {
  const env = await getEnv();
  const store = await readSolves(env, username);
  const changed = mergeRecent(store.days, recent);
  const pruned = prune(store.days);
  if (changed || pruned) {
    await env.LEARN_KV.put(keyFor(username), JSON.stringify(store));
  }
  await registerUsername(env, username);
  return store.days;
}

/**
 * Poll every tracked user's live feed and merge it into their stored history.
 * Meant to be called on a schedule so solves are captured even when a user
 * isn't visiting the site. Per-user failures are skipped, not fatal.
 */
export async function refreshAll(): Promise<{ tracked: number; updated: number }> {
  const env = await getEnv();
  const raw = await env.LEARN_KV.get(INDEX_KEY);
  let list: string[] = [];
  try {
    list = raw ? JSON.parse(raw) : [];
  } catch {
    list = [];
  }
  if (!Array.isArray(list)) list = [];

  let updated = 0;
  for (const username of list.slice(0, MAX_TRACKED_USERS)) {
    try {
      const stats = await getLeetCodeStats(username);
      const store = await readSolves(env, username);
      const changed = mergeRecent(store.days, stats.recent);
      const pruned = prune(store.days);
      if (changed || pruned) {
        await env.LEARN_KV.put(keyFor(username), JSON.stringify(store));
        updated += 1;
      }
    } catch {
      // Skip users whose profile can't be loaded this round.
    }
  }
  return { tracked: list.length, updated };
}
