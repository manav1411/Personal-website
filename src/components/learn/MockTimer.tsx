'use client';

// A tiny mock-interview aid: pick a random problem and race a countdown. Targets
// the "solve a medium in ~30 minutes" goal.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Shuffle, ExternalLink } from 'lucide-react';
import patterns from '@/data/patternsData';
import type { ProblemDifficulty } from '@/data/patternsData';
import DifficultyBadge from './DifficultyBadge';

interface PoolProblem {
  name: string;
  slug: string;
  difficulty: ProblemDifficulty;
}

const DURATIONS = [15, 30, 45];
const DIFFICULTIES: (ProblemDifficulty | 'Any')[] = ['Any', 'Easy', 'Medium', 'Hard'];

function buildPool(): PoolProblem[] {
  const seen = new Set<string>();
  const pool: PoolProblem[] = [];
  for (const p of patterns) {
    for (const problem of p.problems) {
      if (seen.has(problem.slug)) continue;
      seen.add(problem.slug);
      pool.push(problem);
    }
  }
  return pool;
}

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MockTimer() {
  const pool = useMemo(buildPool, []);
  const [minutes, setMinutes] = useState(30);
  const [remaining, setRemaining] = useState(30 * 60);
  const [running, setRunning] = useState(false);
  const [difficulty, setDifficulty] = useState<ProblemDifficulty | 'Any'>('Any');
  const [pick, setPick] = useState<PoolProblem | null>(null);
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

  const shuffle = useCallback(() => {
    const candidates =
      difficulty === 'Any'
        ? pool
        : pool.filter((p) => p.difficulty === difficulty);
    if (candidates.length === 0) return;
    setPick(candidates[Math.floor(Math.random() * candidates.length)]);
    setRemaining(minutes * 60);
    setRunning(true);
  }, [difficulty, pool, minutes]);

  const done = remaining === 0;

  return (
    <div className="dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-5">
      <div className="flex flex-col gap-4">
        {/* Timer readout */}
        <div className="flex items-center gap-4">
          <span
            className={`text-5xl font-bold tabular-nums ${
              done
                ? 'text-rose-500'
                : 'text-neutral-900 dark:text-neutral-100'
            }`}
          >
            {format(remaining)}
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              disabled={done}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40"
            >
              {running ? <Pause size={14} /> : <Play size={14} />}
              {running ? 'Pause' : 'Start'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Duration + difficulty */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {DURATIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDuration(m)}
                className={`px-2.5 py-1 text-xs rounded-md border ${
                  minutes === m
                    ? 'bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100'
                    : 'text-neutral-700 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-2.5 py-1 text-xs rounded-md border ${
                  difficulty === d
                    ? 'bg-neutral-300 text-neutral-900 border-black dark:border-white dark:bg-neutral-700 dark:text-neutral-100'
                    : 'text-neutral-700 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problem picker */}
      <div className="mt-4 pt-4 border-t border-neutral-300 dark:border-neutral-700 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={shuffle}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-md bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
        >
          <Shuffle size={15} />
          {pick ? 'New problem' : 'Pick & start'}
        </button>
        {pick && (
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
        )}
      </div>
    </div>
  );
}
