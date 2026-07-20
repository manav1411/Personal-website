'use client';

// Fetches a user's live LeetCode stats via /api/leetcode, with an offline-first
// cache: it paints the last-seen data from localStorage instantly, then
// revalidates in the background and only re-renders when something changed.
// Shared by LeetCodeStats (detailed card) and CohortLeaderboard (per-row).

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LeetCodeStats } from '@/services/leetcode';

export interface UseLeetCodeStats {
  stats: LeetCodeStats | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useLeetCodeStats(username: string): UseLeetCodeStats {
  const cacheKey = `leetcode-stats:${username}`;
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Whether something is already on screen, so a background revalidation never
  // flashes the loading skeleton over already-displayed (cached) data.
  const hasStatsRef = useRef(false);
  useEffect(() => {
    hasStatsRef.current = stats !== null;
  }, [stats]);

  const load = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    if (!hasStatsRef.current) setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/leetcode?username=${encodeURIComponent(username)}`,
        { cache: 'no-store' }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const serialized = JSON.stringify((await res.json()) as LeetCodeStats);
      // Only re-render (and rewrite the cache) when the data actually changed,
      // so an unchanged profile stays visually static after the refetch.
      setStats((prev) => {
        if (prev && JSON.stringify(prev) === serialized) return prev;
        try {
          localStorage.setItem(cacheKey, serialized);
        } catch {
          // ignore unavailable/full storage
        }
        return JSON.parse(serialized) as LeetCodeStats;
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [username, cacheKey]);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }
    // Paint the last fetched stats instantly, then revalidate in the background.
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setStats(JSON.parse(cached) as LeetCodeStats);
        setLoading(false);
        hasStatsRef.current = true;
      }
    } catch {
      // ignore unavailable/corrupt storage
    }
    load();
  }, [cacheKey, load]);

  return { stats, loading, error, reload: load };
}
