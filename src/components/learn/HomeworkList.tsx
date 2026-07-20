'use client';

// A week's homework, personalised: problems the current user has recently solved
// show a green tick, the rest are "to do". Solved detection comes from the user's
// recent-AC feed, so it reflects their most recent ~20 accepted submissions.

import { useState } from 'react';
import { ExternalLink, Lightbulb, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import type { HomeworkProblem } from '@/data/weeks';
import { getPattern } from '@/data/patternsData';
import DifficultyBadge from './DifficultyBadge';

interface HomeworkListProps {
  problems: HomeworkProblem[];
  /** Slugs the current user has recently solved. */
  solvedSlugs: Set<string>;
  /** Whether a user is currently selected (drives the solved/to-do styling). */
  personalised: boolean;
}

function HomeworkRow({
  problem,
  solved,
  personalised,
}: {
  problem: HomeworkProblem;
  solved: boolean;
  personalised: boolean;
}) {
  const [showHint, setShowHint] = useState(false);
  const pattern = problem.patternId ? getPattern(problem.patternId) : undefined;

  return (
    <li className="px-3 py-2.5 border-b border-neutral-300 dark:border-neutral-700 last:border-b-0">
      <div className="flex items-center gap-2.5">
        {personalised ? (
          solved ? (
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          ) : (
            <Circle size={16} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
          )
        ) : (
          <Circle size={16} className="text-neutral-300 dark:text-neutral-700 shrink-0" />
        )}

        <a
          href={`https://leetcode.com/problems/${problem.slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center gap-1.5 min-w-0 flex-1 text-sm hover:text-blue-500 dark:hover:text-blue-400 ${
            solved && personalised
              ? 'text-neutral-500 dark:text-neutral-400'
              : 'text-neutral-800 dark:text-neutral-200'
          }`}
        >
          <span className="truncate">{problem.name}</span>
          <ExternalLink size={11} className="shrink-0 opacity-60" />
        </a>

        {pattern && (
          <Link
            href={`/learn/patterns#${pattern.id}`}
            className="hidden sm:inline text-[11px] px-1.5 py-0.5 rounded border border-neutral-400 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-500 shrink-0"
          >
            {pattern.name}
          </Link>
        )}

        <DifficultyBadge difficulty={problem.difficulty} />

        {problem.hint && (
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className={`inline-flex items-center justify-center p-1 rounded shrink-0 ${
              showHint
                ? 'text-amber-500'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-amber-500'
            }`}
            aria-label={showHint ? 'Hide hint' : 'Show hint'}
            aria-expanded={showHint}
            title="Hint"
          >
            <Lightbulb size={15} />
          </button>
        )}
      </div>

      {problem.hint && showHint && (
        <p className="mt-2 ml-7 text-sm text-neutral-600 dark:text-neutral-400 border-l-2 border-amber-400/60 pl-3">
          {problem.hint}
        </p>
      )}
    </li>
  );
}

export default function HomeworkList({
  problems,
  solvedSlugs,
  personalised,
}: HomeworkListProps) {
  if (problems.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
        Homework for this week is still being chosen.
      </p>
    );
  }

  const solvedCount = problems.filter((p) => solvedSlugs.has(p.slug)).length;

  return (
    <div className="border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {problems.length} problems · aim for ~3 hours
        </span>
        {personalised && (
          <span className="text-xs tabular-nums text-emerald-600 dark:text-emerald-400">
            {solvedCount}/{problems.length} solved
          </span>
        )}
      </div>
      <ul>
        {problems.map((problem) => (
          <HomeworkRow
            key={problem.slug}
            problem={problem}
            solved={solvedSlugs.has(problem.slug)}
            personalised={personalised}
          />
        ))}
      </ul>
    </div>
  );
}
