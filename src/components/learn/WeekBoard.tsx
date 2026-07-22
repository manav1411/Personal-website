'use client';

// The curriculum as a left-to-right board of weeks (5 across on wide screens).
// Fetches the selected user's recent solves once and passes them down so each
// week shows the user's progress.

import { useMemo } from 'react';
import type { Week } from '@/lib/content';
import { useLearnUsername } from '@/hooks/useLearnUsername';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { useTaskProgress } from '@/hooks/useTaskProgress';
import { recentlySolvedSlugs } from '@/lib/leetcodeMetrics';
import WeekCard from './WeekCard';

export default function WeekBoard({ weeks }: { weeks: Week[] }) {
  const { username } = useLearnUsername();
  const { stats } = useLeetCodeStats(username || '');
  const { tasks: taskProgress, toggleTask } = useTaskProgress(username || '');

  const solvedSlugs = useMemo(
    () => (stats ? recentlySolvedSlugs(stats.recent) : new Set<string>()),
    [stats]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {weeks.map((week) => (
        <WeekCard
          key={week.week}
          week={week}
          solvedSlugs={solvedSlugs}
          personalised={Boolean(username)}
          taskProgress={taskProgress}
          onToggleTask={toggleTask}
        />
      ))}
    </div>
  );
}
