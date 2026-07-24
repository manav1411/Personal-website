'use client';

// A tiny mock-interview aid: pick a random problem and race a countdown. Targets
// the "solve a medium in ~30 minutes" goal. The problem pool is drawn from the
// weekly homework (passed in from /learn), so it always reflects current content.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Shuffle, ExternalLink } from 'lucide-react';
import type { HomeworkProblem, ProblemDifficulty, Week } from '@/lib/content';
import DifficultyBadge from './DifficultyBadge';

const DURATIONS = [15, 30, 45];
const DIFFICULTIES: (ProblemDifficulty | 'Any')[] = ['Any', 'Easy', 'Medium', 'Hard'];

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface MockTimerProps {
  /** Weekly content — the problem pool is derived from its homework. */
  weeks: Week[];
}

export default function MockTimer({ weeks }: MockTimerProps) {
  // The candidate pool is every homework problem across both topics, deduped by
  // slug, so it always mirrors whatever content is live.
  const pool = useMemo<HomeworkProblem[]>(
    () =>
      Array.from(
        new Map(
          weeks
            .flatMap((w) => w.topics.flatMap((t) => t.homework))
            .map((p) => [p.slug, p])
        ).values()
      ),
    [weeks]
  );

  const [minutes, setMinutes] = useState(30);
  const [remaining, setRemaining] = useState(30 * 60);
  const [running, setRunning] = useState(false);
  const [difficulty, setDifficulty] = useState<ProblemDifficulty | 'Any'>('Any');
  const [pick, setPick] = useState<HomeworkProblem | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const setDuration = useCallback((m: number) => {
    setMinutes(m);
    setRemaining(m * 60);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(minutes * 60);
  }, [minutes]);

  const candidates = useMemo(
    () =>
      difficulty === 'Any'
        ? pool
        : pool.filter((p) => p.difficulty === difficulty),
    [difficulty, pool]
  );

  const shuffle = useCallback(() => {
    if (candidates.length === 0) return;
    setPick(candidates[Math.floor(Math.random() * candidates.length)]);
    setRemaining(minutes * 60);
    setRunning(true);
  }, [candidates, minutes]);

  const done = remaining === 0;
  const empty = pool.length === 0;

  const pill = (active: boolean) =>
    `px-2.5 py-1 text-xs rounded-md border transition-colors ${
      active
        ? 'bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100'
        : 'text-neutral-700 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700'
    }`;

  return (
    <div className="h-full flex flex-col dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-5">
      {/* Clock + current problem — grows to fill the card so it matches the
          leaderboard's height with the controls pinned to the bottom. */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-2">
        <span
          className={`text-6xl font-bold tabular-nums leading-none ${
            done ? 'text-rose-500' : 'text-neutral-900 dark:text-neutral-100'
          }`}
        >
          {format(remaining)}
        </span>
        {pick ? (
          <a
            href={`https://leetcode.com/problems/${pick.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <span className="font-medium">{pick.name}</span>
            <DifficultyBadge difficulty={pick.difficulty} />
            <ExternalLink size={12} className="opacity-60" />
          </a>
        ) : (
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {empty
              ? 'Add homework problems to build the pool.'
              : 'Pick a random problem and beat the clock.'}
          </span>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="w-12 shrink-0 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Time
          </span>
          <div className="flex gap-1.5">
            {DURATIONS.map((m) => (
              <button key={m} type="button" onClick={() => setDuration(m)} className={pill(minutes === m)}>
                {m}m
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-12 shrink-0 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Level
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <button key={d} type="button" onClick={() => setDifficulty(d)} className={pill(difficulty === d)}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-neutral-300 dark:border-neutral-700 flex items-center gap-2">
        <button
          type="button"
          onClick={shuffle}
          disabled={candidates.length === 0}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium border rounded-md bg-blue-500 text-white border-blue-500 hover:bg-blue-600 disabled:opacity-40"
        >
          <Shuffle size={15} />
          {pick ? 'New problem' : 'Pick & start'}
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={done}
          aria-label={running ? 'Pause' : 'Start'}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40"
        >
          {running ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset"
          className="inline-flex items-center justify-center px-3 py-2 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}
