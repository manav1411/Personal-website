'use client';

// Structured editor for the /learn content. Edits a local copy of the weeks and
// POSTs the whole set to /api/admin/content on Save. The server re-validates, so
// this UI only needs to be convenient, not authoritative.

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  LogOut,
  GripVertical,
} from 'lucide-react';
import type {
  HomeworkProblem,
  ProblemDifficulty,
  Slide,
  Week,
  WeekTask,
} from '@/lib/content';

const DIFFICULTIES: ProblemDifficulty[] = ['Easy', 'Medium', 'Hard'];

const inputClass =
  'w-full px-2.5 py-1.5 text-sm rounded-md border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500';
const labelClass =
  'block text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1';
const iconBtnClass =
  'inline-flex items-center justify-center p-1 rounded text-neutral-500 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none';
const sectionBtnClass =
  'inline-flex items-center gap-1 px-2.5 py-1 text-xs border rounded-md text-neutral-800 dark:text-neutral-200 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700';

function genTaskId(): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `task-${rand}`.slice(0, 100);
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function AdminEditor({ initialWeeks }: { initialWeeks: Week[] }) {
  const router = useRouter();
  const [weeks, setWeeks] = useState<Week[]>(() =>
    structuredClone(initialWeeks)
  );
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set([0]));
  const [status, setStatus] = useState<
    { kind: 'idle' | 'saving' | 'saved' | 'error'; message?: string }
  >({ kind: 'idle' });

  const mutate = useCallback((fn: (draft: Week[]) => void) => {
    setWeeks((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setStatus({ kind: 'idle' });
  }, []);

  const toggleExpanded = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const addWeek = () => {
    const nextNumber = weeks.reduce((max, w) => Math.max(max, w.week), 0) + 1;
    setWeeks((prev) => [
      ...prev,
      { week: nextNumber, topic: `Week ${nextNumber}`, slides: [], homework: [], tasks: [] },
    ]);
    setExpanded((prev) => new Set(prev).add(weeks.length));
  };

  const save = async () => {
    setStatus({ kind: 'saving' });
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeks }),
      });
      if (res.ok) {
        const data = (await res.json()) as { weeks: Week[] };
        setWeeks(structuredClone(data.weeks));
        setStatus({ kind: 'saved', message: 'Saved' });
      } else if (res.status === 401) {
        setStatus({ kind: 'error', message: 'Session expired — reloading…' });
        router.refresh();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus({ kind: 'error', message: data.error ?? 'Save failed' });
      }
    } catch {
      setStatus({ kind: 'error', message: 'Network error' });
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    router.refresh();
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 w-full max-w-4xl mt-6 mb-6 flex items-center gap-3 py-3 bg-zinc-100/90 dark:bg-neutral-950/90 backdrop-blur">
        <h1 className="text-3xl font-bold">Admin</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Editing the Learn page
        </span>
        <div className="ml-auto flex items-center gap-2">
          {status.message && (
            <span
              className={`text-sm ${
                status.kind === 'error'
                  ? 'text-rose-500'
                  : status.kind === 'saved'
                  ? 'text-emerald-500'
                  : 'text-neutral-500'
              }`}
            >
              {status.message}
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={status.kind === 'saving'}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-md bg-blue-500 text-white border-blue-500 hover:bg-blue-600 disabled:opacity-40"
          >
            <Save size={15} />
            {status.kind === 'saving' ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border rounded-md text-neutral-800 dark:text-neutral-200 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-4 pb-24">
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50"
          >
            {/* Week header */}
            <div className="flex items-center gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => toggleExpanded(wi)}
                className="flex items-center gap-2 min-w-0 flex-1 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 shrink-0">
                  Week {week.week}
                </span>
                <span className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
                  {week.topic}
                </span>
              </button>
              <button
                type="button"
                aria-label="Move week up"
                className={iconBtnClass}
                disabled={wi === 0}
                onClick={() => setWeeks((prev) => move(prev, wi, wi - 1))}
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                aria-label="Move week down"
                className={iconBtnClass}
                disabled={wi === weeks.length - 1}
                onClick={() => setWeeks((prev) => move(prev, wi, wi + 1))}
              >
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                aria-label="Delete week"
                className={`${iconBtnClass} hover:text-rose-500`}
                onClick={() => {
                  if (confirm(`Delete Week ${week.week} (${week.topic})?`)) {
                    setWeeks((prev) => prev.filter((_, i) => i !== wi));
                  }
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {expanded.has(wi) && (
              <div className="px-4 pb-4 border-t border-neutral-300 dark:border-neutral-700 pt-4 flex flex-col gap-5">
                {/* Week meta */}
                <div className="grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-3">
                  <div>
                    <label className={labelClass}>Week #</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={week.week}
                      onChange={(e) =>
                        mutate((d) => {
                          d[wi].week = Number(e.target.value);
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Topic</label>
                    <input
                      className={inputClass}
                      value={week.topic}
                      onChange={(e) =>
                        mutate((d) => {
                          d[wi].topic = e.target.value;
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Summary</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={week.summary ?? ''}
                    onChange={(e) =>
                      mutate((d) => {
                        d[wi].summary = e.target.value;
                      })
                    }
                  />
                </div>

                {/* Slides */}
                <SlidesEditor
                  slides={week.slides}
                  onChange={(fn) => mutate((d) => fn(d[wi].slides))}
                />

                {/* Homework */}
                <HomeworkEditor
                  problems={week.homework}
                  onChange={(fn) => mutate((d) => fn(d[wi].homework))}
                />

                {/* Tasks */}
                <TasksEditor
                  tasks={week.tasks ?? []}
                  onChange={(fn) =>
                    mutate((d) => {
                      d[wi].tasks ??= [];
                      fn(d[wi].tasks as WeekTask[]);
                    })
                  }
                />
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addWeek}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm border border-dashed rounded-md text-neutral-700 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <Plus size={16} />
          Add week
        </button>
      </div>
    </main>
  );
}

/* ------------------------------- Slides -------------------------------- */

function SlidesEditor({
  slides,
  onChange,
}: {
  slides: Slide[];
  onChange: (fn: (draft: Slide[]) => void) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Slides ({slides.length})
        </h3>
        <button
          type="button"
          className={sectionBtnClass}
          onClick={() => onChange((d) => d.push({ title: 'New slide' }))}
        >
          <Plus size={13} />
          Add slide
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {slides.map((slide, si) => (
          <div
            key={si}
            className="border border-neutral-300 dark:border-neutral-700 rounded-md p-3 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <GripVertical size={14} className="text-neutral-400 shrink-0" />
              <input
                className={inputClass}
                placeholder="Slide title"
                value={slide.title}
                onChange={(e) =>
                  onChange((d) => {
                    d[si].title = e.target.value;
                  })
                }
              />
              <button
                type="button"
                aria-label="Move slide up"
                className={iconBtnClass}
                disabled={si === 0}
                onClick={() => onChange((d) => d.splice(si - 1, 0, d.splice(si, 1)[0]))}
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                aria-label="Move slide down"
                className={iconBtnClass}
                disabled={si === slides.length - 1}
                onClick={() => onChange((d) => d.splice(si + 1, 0, d.splice(si, 1)[0]))}
              >
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                aria-label="Delete slide"
                className={`${iconBtnClass} hover:text-rose-500`}
                onClick={() => onChange((d) => d.splice(si, 1))}
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div>
              <label className={labelClass}>Bullet points (one per line)</label>
              <textarea
                className={inputClass}
                rows={3}
                value={(slide.points ?? []).join('\n')}
                onChange={(e) =>
                  onChange((d) => {
                    d[si].points = e.target.value.split('\n');
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Code (optional)</label>
              <textarea
                className={`${inputClass} font-mono`}
                rows={slide.code ? 6 : 2}
                value={slide.code ?? ''}
                onChange={(e) =>
                  onChange((d) => {
                    d[si].code = e.target.value;
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Speaker note (optional)</label>
              <input
                className={inputClass}
                value={slide.note ?? ''}
                onChange={(e) =>
                  onChange((d) => {
                    d[si].note = e.target.value;
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Homework ------------------------------- */

function HomeworkEditor({
  problems,
  onChange,
}: {
  problems: HomeworkProblem[];
  onChange: (fn: (draft: HomeworkProblem[]) => void) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Homework ({problems.length})
        </h3>
        <button
          type="button"
          className={sectionBtnClass}
          onClick={() =>
            onChange((d) =>
              d.push({ name: '', slug: '', difficulty: 'Easy' })
            )
          }
        >
          <Plus size={13} />
          Add problem
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {problems.map((problem, pi) => (
          <div
            key={pi}
            className="border border-neutral-300 dark:border-neutral-700 rounded-md p-3 flex flex-col gap-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  className={inputClass}
                  value={problem.name}
                  onChange={(e) =>
                    onChange((d) => {
                      d[pi].name = e.target.value;
                    })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Slug (leetcode.com/problems/…)</label>
                <input
                  className={inputClass}
                  value={problem.slug}
                  onChange={(e) =>
                    onChange((d) => {
                      d[pi].slug = e.target.value;
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <div className="w-32">
                <label className={labelClass}>Difficulty</label>
                <select
                  className={inputClass}
                  value={problem.difficulty}
                  onChange={(e) =>
                    onChange((d) => {
                      d[pi].difficulty = e.target.value as ProblemDifficulty;
                    })
                  }
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                aria-label="Delete problem"
                className={`${iconBtnClass} hover:text-rose-500 mb-1 ml-auto`}
                onClick={() => onChange((d) => d.splice(pi, 1))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- Tasks -------------------------------- */

function TasksEditor({
  tasks,
  onChange,
}: {
  tasks: WeekTask[];
  onChange: (fn: (draft: WeekTask[]) => void) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Tasks ({tasks.length})
        </h3>
        <button
          type="button"
          className={sectionBtnClass}
          onClick={() => onChange((d) => d.push({ id: genTaskId(), label: '' }))}
        >
          <Plus size={13} />
          Add task
        </button>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
        Checkmark-able items (e.g. &quot;Sign up for a LeetCode account&quot;),
        tracked per user.
      </p>
      <div className="flex flex-col gap-2">
        {tasks.map((task, ti) => (
          <div key={task.id} className="flex items-center gap-2">
            <input
              className={inputClass}
              placeholder="Task description"
              value={task.label}
              onChange={(e) =>
                onChange((d) => {
                  d[ti].label = e.target.value;
                })
              }
            />
            <button
              type="button"
              aria-label="Delete task"
              className={`${iconBtnClass} hover:text-rose-500`}
              onClick={() => onChange((d) => d.splice(ti, 1))}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
