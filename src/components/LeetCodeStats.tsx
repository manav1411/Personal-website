'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Flame, CheckCircle2, Trophy, ExternalLink, AlertTriangle } from 'lucide-react';
import type { Difficulty } from '@/lib/leetcode';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { AEST_OFFSET_SECONDS, DAY_SECONDS, buildSolvedByDay, countByDifficulty, solvedLast30, streakFromSolves, todayAestMidnight, type SolvedByDay } from '@/lib/leetcodeMetrics';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DIFFICULTY_META: Record<
  Exclude<Difficulty, 'All'>,
  { text: string; dot: string }
> = {
  Easy: {
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  Medium: {
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  Hard: {
    text: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

function dayBackground(solved: boolean, isToday: boolean): string {
  if (solved) return 'bg-emerald-500 dark:bg-emerald-600';
  return isToday
    ? 'bg-amber-400 dark:bg-amber-400'
    : 'bg-neutral-300 dark:bg-neutral-700/60';
}

function formatDay(ts: number): string {
  // ts is an AEST day-start expressed in UTC epoch seconds; shift by the offset
  // so the UTC getters read the intended AEST calendar date.
  const date = new Date((ts + AEST_OFFSET_SECONDS) * 1000);
  return `${WEEKDAYS[date.getUTCDay()]}, ${
    MONTHS[date.getUTCMonth()]
  } ${date.getUTCDate()}`;
}

interface SubmissionHeatmapProps {
  solvedByDay: SolvedByDay;
}

function SubmissionHeatmap({ solvedByDay }: SubmissionHeatmapProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  // 30 cells, oldest (index 0) -> today (index 29). Rendered row-major in a
  // 10-column grid, so the bottom row holds the most recent 10 days and today
  // lands in the bottom-right corner.
  const cells = useMemo(() => {
    const today = todayAestMidnight();
    const arr: { key: string; ts: number; isToday: boolean }[] = [];
    for (let i = 29; i >= 0; i -= 1) {
      const ts = today - i * DAY_SECONDS;
      arr.push({ key: String(ts), ts, isToday: ts === today });
    }
    return arr;
  }, []);

  return (
    <div
      className="relative flex flex-col gap-[3px] w-fit"
      onMouseLeave={() => setHovered(null)}
    >
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex gap-[3px]">
          {cells.slice(row * 10, row * 10 + 10).map((cell, col) => {
            const index = row * 10 + col;
            const problems = solvedByDay[cell.key] ?? [];
            const solved = problems.length > 0;
            const anchor = col >= 5 ? 'right-0' : 'left-0';
            return (
              <div key={cell.key} className="relative">
                <button
                  type="button"
                  aria-label={`${problems.length} solved on ${formatDay(
                    cell.ts
                  )}`}
                  onMouseEnter={() => setHovered(index)}
                  onFocus={() => setHovered(index)}
                  className={`block w-3 h-3 rounded-[2px] transition-transform ${dayBackground(
                    solved,
                    cell.isToday
                  )} ${
                    hovered === index
                      ? 'relative z-10 scale-125 outline outline-1 outline-blue-500'
                      : 'hover:scale-110'
                  }`}
                />
                {hovered === index && (
                  <div
                    className={`absolute top-full ${anchor} z-30 mt-1.5 w-52 pointer-events-none`}
                  >
                    <div className="p-2.5 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 shadow-lg">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          {formatDay(cell.ts)}
                        </span>
                        {problems.length > 0 && (
                          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                            {problems.length} solved
                          </span>
                        )}
                      </div>
                      {problems.length > 0 ? (
                        <ul className="space-y-0.5">
                          {problems.slice(0, 6).map((submission, index) => (
                            <li
                              key={`${submission.titleSlug}-${index}`}
                              className="text-xs text-neutral-700 dark:text-neutral-300 truncate"
                            >
                              {submission.title}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {cell.isToday
                            ? 'No solve yet today — keep your streak alive!'
                            : 'No solves on record.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex items-center gap-1.5">
        {icon}
        <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums leading-none">
          {value}
        </span>
      </span>
      <span className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mt-1.5">
        {label}
      </span>
    </div>
  );
}

const cardClass =
  'dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50';

interface LeetCodeStatsProps {
  username: string;
  squareTopRight?: boolean;
}

export default function LeetCodeStats({
  username,
  squareTopRight = false,
}: LeetCodeStatsProps) {
  const profileUrl = `https://leetcode.com/u/${username}/`;
  const corner = squareTopRight ? 'rounded-tr-none' : '';
  const { stats, loading, error, reload } = useLeetCodeStats(username);

  const derived = useMemo(() => {
    if (!stats) return null;

    // One source of truth (accumulated KV history when available, else the live
    // feed) so the heatmap, streak, and 30-day count always agree.
    const solvedByDay = buildSolvedByDay(stats);
    const streak = streakFromSolves(solvedByDay);
    const { count: solvedLastMonth, capped: monthCapped } = solvedLast30(
      solvedByDay,
      Boolean(stats.solvedDays)
    );

    return { streak, solvedByDay, solvedLastMonth, monthCapped };
  }, [stats]);

  return (
    <section className="w-full max-w-4xl">
      {!stats && loading && (
        <div
          className={`${cardClass} ${corner} h-[4.5rem] animate-pulse bg-neutral-200 dark:bg-neutral-800`}
        />
      )}

      {!stats && !loading && error && (
        <div className={`${cardClass} ${corner} p-4 flex items-center gap-3`}>
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Couldn&apos;t load LeetCode data — {error}
          </p>
          <button
            onClick={() => reload()}
            className="ml-auto shrink-0 px-3 py-1.5 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >
            Retry
          </button>
        </div>
      )}

      {stats && derived && (
        <div className={`${cardClass} ${corner} px-4 py-3`}>
          <div className="flex items-center justify-between gap-x-6 gap-y-4 flex-wrap">
            {/* Profile */}
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 shrink-0"
            >
              {stats.profile.userAvatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={stats.profile.userAvatar}
                  alt={`${stats.username} avatar`}
                  className="w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-600"
                />
              )}
              <div className="min-w-0 leading-tight">
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 inline-flex items-center gap-1">
                  @{stats.username}
                  <ExternalLink size={11} />
                </span>
                {stats.profile.ranking != null && (
                  <span className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <Trophy size={10} />
                    Rank #{stats.profile.ranking.toLocaleString()}
                  </span>
                )}
              </div>
            </a>

            {/* Heatmap (centre) */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <SubmissionHeatmap solvedByDay={derived.solvedByDay} />
              <span className="text-[10px] tracking-wide text-neutral-400 dark:text-neutral-500">
                Last 30 days
              </span>
            </div>

            {/* Streak + completed */}
            <div className="flex items-center gap-5 shrink-0">
              <Stat
                icon={<Flame size={16} className="text-orange-500" />}
                value={derived.streak}
                label="day streak"
              />
              <Stat
                icon={<CheckCircle2 size={16} className="text-blue-500" />}
                value={`${derived.solvedLastMonth}${
                  derived.monthCapped ? '+' : ''
                }`}
                label="solved · 30d"
              />
            </div>

            {/* Total solved + difficulty */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right leading-tight">
                <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {countByDifficulty(stats.solved, 'All')}
                  <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500">
                    {' '}
                    /{' '}
                    {countByDifficulty(
                      stats.totalQuestions,
                      'All'
                    ).toLocaleString()}
                  </span>
                </p>
                <p className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  solved
                </p>
              </div>
              <div className="flex flex-col gap-0.5 text-xs tabular-nums w-[5.5rem]">
                {(['Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
                  <span
                    key={difficulty}
                    className="flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${DIFFICULTY_META[difficulty].dot}`}
                    />
                    <span className={DIFFICULTY_META[difficulty].text}>
                      {difficulty}
                    </span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 ml-auto">
                      {countByDifficulty(stats.solved, difficulty)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
