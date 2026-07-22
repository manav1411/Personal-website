'use client';

// Per-user task completion, synced with the server (/api/progress) so it follows
// the user across devices. Identity is the LeetCode username. Toggles are
// optimistic and revert if the request fails.

import { useCallback, useEffect, useState } from 'react';

export interface UseTaskProgress {
  tasks: Record<string, boolean>;
  toggleTask: (taskId: string, done: boolean) => void;
  ready: boolean;
}

export function useTaskProgress(username: string): UseTaskProgress {
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!username) {
      setTasks({});
      setReady(true);
      return;
    }

    setReady(false);
    fetch(`/api/progress?username=${encodeURIComponent(username)}`)
      .then((r) => (r.ok ? r.json() : { tasks: {} }))
      .then((data: { tasks?: Record<string, boolean> }) => {
        if (!cancelled) {
          setTasks(data.tasks ?? {});
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTasks({});
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const toggleTask = useCallback(
    (taskId: string, done: boolean) => {
      if (!username) return;
      // Optimistic update.
      setTasks((prev) => ({ ...prev, [taskId]: done }));

      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, taskId, done }),
      })
        .then((r) => {
          if (!r.ok) throw new Error('failed');
        })
        .catch(() => {
          // Revert on failure.
          setTasks((prev) => ({ ...prev, [taskId]: !done }));
        });
    },
    [username]
  );

  return { tasks, toggleTask, ready };
}
