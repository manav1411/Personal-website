'use client';

// The curriculum as a left-to-right board of weeks (5 across on wide screens).
// Fetches the selected user's solves once and passes them down so each week
// shows the user's progress.

import { useMemo } from 'react';
import type { Week } from '@/lib/content';
import { useLearnUsername } from '@/hooks/useLearnUsername';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { useTaskProgress } from '@/hooks/useTaskProgress';
import { buildSolvedByDay, solvedSlugs } from '@/lib/leetcodeMetrics';
import WeekCard from './WeekCard';

export default function WeekBoard({ weeks }: { weeks: Week[] }) {
  const { username } = useLearnUsername();
  const { stats } = useLeetCodeStats(username || '');
  const { tasks: taskProgress, toggleTask } = useTaskProgress(username || '');

  // Solved detection uses the accumulated solve history (falling back to the
  // live feed), so it isn't capped at the last ~20 accepted submissions.
  const solved = useMemo(
    () => (stats ? solvedSlugs(buildSolvedByDay(stats)) : new Set<string>()),
    [stats]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {weeks.map((week) => (
        <WeekCard
          key={week.week}
          week={week}
          solvedSlugs={solved}
          personalised={Boolean(username)}
          taskProgress={taskProgress}
          onToggleTask={toggleTask}
        />
      ))}
    </div>
  );
}
