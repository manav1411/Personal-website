import type { ProblemDifficulty } from '@/lib/content';

const META: Record<ProblemDifficulty, string> = {
  Easy: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  Medium: 'text-amber-700 dark:text-amber-400 border-amber-500/40 bg-amber-500/10',
  Hard: 'text-rose-700 dark:text-rose-400 border-rose-500/40 bg-rose-500/10',
};

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: ProblemDifficulty;
}) {
  return (
    <span
      className={`text-[10px] uppercase tracking-wide font-medium border rounded px-1.5 py-px shrink-0 ${META[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
