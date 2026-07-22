'use client';

// A week's homework, personalised: problems the current user has recently solved
// show a green tick, the rest are "to do". Solved detection comes from the user's
// recent-AC feed, so it reflects their most recent ~20 accepted submissions.

import { ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import type { HomeworkProblem, WeekTask } from '@/lib/content';
import DifficultyBadge from './DifficultyBadge';

interface HomeworkListProps {
  problems: HomeworkProblem[];
  /** Slugs the current user has recently solved. */
  solvedSlugs: Set<string>;
  /** Whether a user is currently selected (drives the solved/to-do styling). */
  personalised: boolean;
  /** Manual, checkmark-able tasks for the week. */
  tasks?: WeekTask[];
  /** Per-user completion map for tasks (by task id). */
  taskProgress?: Record<string, boolean>;
  onToggleTask?: (taskId: string, done: boolean) => void;
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

        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </li>
  );
}

function TaskRow({
  task,
  done,
  personalised,
  onToggle,
}: {
  task: WeekTask;
  done: boolean;
  personalised: boolean;
  onToggle?: (taskId: string, done: boolean) => void;
}) {
  return (
    <li className="px-3 py-2.5 border-b border-neutral-300 dark:border-neutral-700 last:border-b-0">
      <button
        type="button"
        disabled={!personalised}
        onClick={() => onToggle?.(task.id, !done)}
        className="flex items-center gap-2.5 w-full text-left disabled:cursor-default"
      >
        {personalised ? (
          done ? (
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          ) : (
            <Circle size={16} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
          )
        ) : (
          <Circle size={16} className="text-neutral-300 dark:text-neutral-700 shrink-0" />
        )}
        <span
          className={`text-sm ${
            done && personalised
              ? 'text-neutral-500 dark:text-neutral-400 line-through'
              : 'text-neutral-800 dark:text-neutral-200'
          }`}
        >
          {task.label}
        </span>
      </button>
    </li>
  );
}

export default function HomeworkList({
  problems,
  solvedSlugs,
  personalised,
  tasks = [],
  taskProgress = {},
  onToggleTask,
}: HomeworkListProps) {
  if (problems.length === 0 && tasks.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
        Homework for this week is still being chosen.
      </p>
    );
  }

  const solvedCount = problems.filter((p) => solvedSlugs.has(p.slug)).length;
  const doneTasks = tasks.filter((t) => taskProgress[t.id]).length;

  return (
    <div className="flex flex-col gap-4">
      {tasks.length > 0 && (
        <div className="border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-200/60 dark:bg-neutral-800/60">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Tasks
            </span>
            {personalised && (
              <span className="text-xs tabular-nums text-blue-600 dark:text-blue-400">
                {doneTasks}/{tasks.length} done
              </span>
            )}
          </div>
          <ul>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                done={Boolean(taskProgress[task.id])}
                personalised={personalised}
                onToggle={onToggleTask}
              />
            ))}
          </ul>
          {!personalised && (
            <p className="px-3 py-2 text-[11px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-300 dark:border-neutral-700">
              Enter your LeetCode username on the Learn page to check off tasks.
            </p>
          )}
        </div>
      )}

      {problems.length > 0 && (
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
      )}
    </div>
  );
}
