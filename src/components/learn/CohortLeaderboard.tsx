'use client';

// A live leaderboard for the cohort. Each row independently fetches its member's
// LeetCode stats (reusing the shared hook + per-user localStorage cache), and the
// board re-sorts by total solved as data arrives. Rows that fail to load drop to
// the bottom rather than breaking the board.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flame, Trophy, ExternalLink, AlertTriangle } from 'lucide-react';
import type { CohortMember } from '@/data/cohortData';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { useLearnUsername } from '@/hooks/useLearnUsername';
import {
  buildSolvedByDay,
  countByDifficulty,
  streakFromSolves,
} from '@/lib/leetcodeMetrics';

const cardClass =
  'dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50';

const DIFFICULTY_META = {
  Easy: 'text-emerald-600 dark:text-emerald-400',
  Medium: 'text-amber-600 dark:text-amber-400',
  Hard: 'text-rose-600 dark:text-rose-400',
} as const;

const RANK_ACCENT: Record<number, string> = {
  1: 'text-amber-500',
  2: 'text-neutral-400',
  3: 'text-amber-700 dark:text-amber-600',
};

interface RowProps {
  member: CohortMember;
  rank: number;
  isSelf: boolean;
  onTotal: (username: string, total: number) => void;
}

function LeaderboardRow({ member, rank, isSelf, onTotal }: RowProps) {
  const { stats, loading, error } = useLeetCodeStats(member.leetcodeUsername);

  const total = stats ? countByDifficulty(stats.solved, 'All') : null;

  useEffect(() => {
    // Report -1 on error so the row sinks to the bottom of the board.
    onTotal(member.leetcodeUsername, total ?? (error ? -1 : Number.NaN));
  }, [member.leetcodeUsername, total, error, onTotal]);

  const derived = useMemo(() => {
    if (!stats) return null;
    return {
      streak: streakFromSolves(buildSolvedByDay(stats)),
    };
  }, [stats]);

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 border-b border-neutral-300 dark:border-neutral-700 last:border-b-0 ${
        isSelf ? 'bg-blue-500/[0.07]' : ''
      }`}
    >
      <span
        className={`w-6 text-center text-sm font-bold tabular-nums shrink-0 ${
          RANK_ACCENT[rank] ?? 'text-neutral-400 dark:text-neutral-500'
        }`}
      >
        {total != null ? rank : '·'}
      </span>

      <a
        href={`https://leetcode.com/u/${member.leetcodeUsername}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 min-w-0 flex-1"
      >
        {stats?.profile.userAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stats.profile.userAvatar}
            alt=""
            className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-600 shrink-0"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />
        )}
        <span className="min-w-0 leading-tight">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-500 dark:group-hover:text-blue-400">
            <span className="truncate">{member.name}</span>
            {isSelf && (
              <span className="shrink-0 text-[10px] uppercase tracking-wide font-medium text-blue-600 dark:text-blue-400 border border-blue-400/50 rounded px-1 py-px">
                you
              </span>
            )}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            @{member.leetcodeUsername}
            <ExternalLink size={10} className="shrink-0" />
          </span>
        </span>
      </a>

      {error && !stats ? (
        <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
          <AlertTriangle size={13} className="text-amber-500" />
          Couldn&apos;t load
        </span>
      ) : !stats && loading ? (
        <span className="w-40 h-4 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse shrink-0" />
      ) : stats && derived ? (
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {/* Difficulty split */}
          <div className="hidden sm:flex items-center gap-2.5 text-xs tabular-nums">
            {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
              <span key={d} className={DIFFICULTY_META[d]} title={d}>
                {countByDifficulty(stats.solved, d)}
              </span>
            ))}
          </div>
          {/* Streak */}
          <span
            className="flex items-center gap-1 text-xs tabular-nums text-neutral-600 dark:text-neutral-300"
            title="Current day streak"
          >
            <Flame size={13} className="text-orange-500" />
            {derived.streak}
          </span>
          {/* Total solved */}
          <span className="text-lg font-bold tabular-nums text-neutral-900 dark:text-neutral-100 w-10 text-right">
            {total}
          </span>
        </div>
      ) : null}
    </div>
  );
}

interface CohortLeaderboardProps {
  members: CohortMember[];
}

export default function CohortLeaderboard({ members }: CohortLeaderboardProps) {
  const [totals, setTotals] = useState<Record<string, number>>({});
  const { username } = useLearnUsername();

  const handleTotal = useCallback((username: string, total: number) => {
    setTotals((prev) => (prev[username] === total ? prev : { ...prev, [username]: total }));
  }, []);

  // The current user always appears on the board — if their handle isn't already
  // one of the cohort members, add it on the fly.
  const roster = useMemo(() => {
    const handle = username.trim();
    if (!handle) return members;
    const known = members.some(
      (m) => m.leetcodeUsername.toLowerCase() === handle.toLowerCase()
    );
    return known
      ? members
      : [...members, { name: handle, leetcodeUsername: handle }];
  }, [members, username]);

  const ordered = useMemo(() => {
    return [...roster].sort((a, b) => {
      const ta = totals[a.leetcodeUsername];
      const tb = totals[b.leetcodeUsername];
      // Unknown totals sort last but keep original relative order.
      const va = ta === undefined || Number.isNaN(ta) ? -Infinity : ta;
      const vb = tb === undefined || Number.isNaN(tb) ? -Infinity : tb;
      return vb - va;
    });
  }, [roster, totals]);

  return (
    <div className={`${cardClass} overflow-hidden`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/40">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          <Trophy size={13} className="text-amber-500" />
          Leaderboard
        </span>
        <span className="hidden sm:block text-[11px] text-neutral-400 dark:text-neutral-500">
          Easy · Med · Hard&nbsp;&nbsp;·&nbsp;&nbsp;streak&nbsp;&nbsp;·&nbsp;&nbsp;solved
        </span>
      </div>
      {ordered.map((member, i) => (
        <LeaderboardRow
          key={member.leetcodeUsername}
          member={member}
          rank={i + 1}
          isSelf={
            username.length > 0 &&
            member.leetcodeUsername.toLowerCase() === username.toLowerCase()
          }
          onTotal={handleTotal}
        />
      ))}
    </div>
  );
}
