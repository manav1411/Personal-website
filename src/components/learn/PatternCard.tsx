import { ExternalLink, Zap } from 'lucide-react';
import type { Pattern } from '@/data/patternsData';
import DifficultyBadge from './DifficultyBadge';

export default function PatternCard({ pattern }: { pattern: Pattern }) {
  return (
    <article
      id={pattern.id}
      className="scroll-mt-20 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {pattern.name}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            {pattern.idea}
          </p>
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-wide font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-400/50 rounded px-1.5 py-0.5">
          {pattern.category}
        </span>
      </div>

      {/* Triggers */}
      <div className="mt-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1.5">
          <Zap size={13} />
          Reach for it when
        </p>
        <ul className="space-y-1 pl-1">
          {pattern.triggers.map((trigger, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
            >
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              {trigger}
            </li>
          ))}
        </ul>
      </div>

      {/* Template */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Python template
          </p>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            {pattern.complexity}
          </span>
        </div>
        <pre className="p-4 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 overflow-x-auto text-sm font-mono text-neutral-800 dark:text-neutral-200">
          <code>{pattern.template}</code>
        </pre>
      </div>

      {/* Problems */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1.5">
          Practise
        </p>
        <div className="flex flex-wrap gap-2">
          {pattern.problems.map((problem) => (
            <a
              key={problem.slug}
              href={`https://leetcode.com/problems/${problem.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-neutral-400 dark:border-neutral-600 text-sm text-neutral-700 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {problem.name}
              <DifficultyBadge difficulty={problem.difficulty} />
              <ExternalLink size={11} className="opacity-60" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
