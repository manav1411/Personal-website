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
  Loader2,
  Circle,
  ExternalLink,
} from 'lucide-react';
import type {
  HomeworkProblem,
  Slide,
  Week,
  WeekTask,
} from '@/lib/content';
import type { LeetCodeProblem } from '@/lib/leetcode';
import Markdown from '@/components/Markdown';
import DifficultyBadge from '@/components/learn/DifficultyBadge';

// Slides are authored as one Markdown document per week; a line containing only
// `---` starts a new slide. These helpers convert between that text and the
// Slide[] we store.
const SLIDE_DIVIDER = /\n[ \t]*---[ \t]*\n/;

function slidesToText(slides: Slide[]): string {
  return slides.map((s) => s.content).join('\n---\n');
}

function textToSlides(text: string): Slide[] {
  return text.split(SLIDE_DIVIDER).map((content) => ({ content }));
}

const inputClass =
  'w-full px-2.5 py-1.5 text-sm rounded-md border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500';
const labelClass =
  'block text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1';
const iconBtnClass =
  'inline-flex items-center justify-center p-1 rounded text-neutral-500 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none';

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
    // `week` is assigned from list order on save; the value here is just a
    // placeholder for the new (last) entry.
    setWeeks((prev) => [
      ...prev,
      { week: prev.length + 1, topic: '', slides: [], homework: [], tasks: [] },
    ]);
    setExpanded((prev) => new Set(prev).add(weeks.length));
  };

  const save = async () => {
    setStatus({ kind: 'saving' });
    try {
      // Week numbers are derived from list order (the first week is 1, the next
      // is 2, …), so stamp them from the current order right before saving.
      const ordered = weeks.map((w, i) => ({ ...w, week: i + 1 }));
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeks: ordered }),
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
      <div className="sticky top-0 z-10 w-full max-w-4xl mt-6 mb-6 flex items-center gap-3 py-3">
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
                  Week {wi + 1}
                </span>
                <span className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
                  {week.topic || 'Untitled week'}
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
                  if (confirm(`Delete Week ${wi + 1}${week.topic ? ` (${week.topic})` : ''}?`)) {
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
                <div>
                  <label className={labelClass}>Topic</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Arrays & Hashing"
                    value={week.topic}
                    onChange={(e) =>
                      mutate((d) => {
                        d[wi].topic = e.target.value;
                      })
                    }
                  />
                </div>

                {/* Slides */}
                <SlidesEditor
                  slides={week.slides}
                  onChange={(next) =>
                    mutate((d) => {
                      d[wi].slides = next;
                    })
                  }
                />

                {/* Tasks (shown above homework on the Learn page) */}
                <TasksEditor
                  tasks={week.tasks ?? []}
                  onChange={(fn) =>
                    mutate((d) => {
                      d[wi].tasks ??= [];
                      fn(d[wi].tasks as WeekTask[]);
                    })
                  }
                />

                {/* Homework */}
                <HomeworkEditor
                  problems={week.homework}
                  onChange={(fn) => mutate((d) => fn(d[wi].homework))}
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
  onChange: (next: Slide[]) => void;
}) {
  const text = slidesToText(slides);
  // Preview each non-empty slide separately so authors see exactly how the deck
  // will paginate. Empty trailing chunks (while typing a divider) are hidden.
  const previewSlides = text.split(SLIDE_DIVIDER);

  return (
    <section>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Slides ({previewSlides.filter((s) => s.trim().length > 0).length})
        </h3>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
        Write slides in Markdown. Put <code>---</code> on its own line to start a
        new slide.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Editor */}
        <div>
          <label className={labelClass}>Markdown</label>
          <textarea
            className={`${inputClass} font-mono min-h-[24rem] leading-relaxed resize-y`}
            placeholder={
              '# Arrays & Hashing\n\nSome intro text.\n\n- point one\n- point two\n\n---\n\n## Example\n\n```py\nprint("hi")\n```'
            }
            value={text}
            onChange={(e) => onChange(textToSlides(e.target.value))}
          />
        </div>
        {/* Live preview */}
        <div>
          <label className={labelClass}>Preview</label>
          <div className="min-h-[24rem] rounded-md border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-3 overflow-y-auto flex flex-col gap-3">
            {previewSlides.every((s) => s.trim().length === 0) ? (
              <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">
                Nothing to preview yet.
              </p>
            ) : (
              previewSlides.map((content, i) =>
                content.trim().length === 0 ? null : (
                  <div
                    key={i}
                    className="border border-neutral-200 dark:border-neutral-700 rounded-md p-3"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-2">
                      Slide {i + 1}
                    </div>
                    <Markdown>{content}</Markdown>
                  </div>
                )
              )
            )}
          </div>
        </div>
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
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<{ loading?: boolean; error?: string }>(
    {}
  );

  // Resolve a slug/URL to its real name + difficulty via LeetCode and append it.
  // Called on paste (as soon as something lands in the box) and on Enter, so the
  // admin never types a name or picks a difficulty by hand.
  const addFromSlug = async (raw: string) => {
    const value = raw.trim();
    if (!value || status.loading) return;
    setStatus({ loading: true });
    try {
      const res = await fetch(
        `/api/admin/leetcode-problem?slug=${encodeURIComponent(value)}`
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus({ error: data.error ?? 'Lookup failed' });
        return;
      }
      const data = (await res.json()) as LeetCodeProblem;
      let duplicate = false;
      onChange((d) => {
        if (d.some((p) => p.slug === data.titleSlug)) {
          duplicate = true;
          return;
        }
        d.push({
          name: data.title,
          slug: data.titleSlug,
          difficulty: data.difficulty,
        });
      });
      setDraft('');
      setStatus(duplicate ? { error: 'Already added' } : {});
    } catch {
      setStatus({ error: 'Network error' });
    }
  };

  return (
    <section>
      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        Homework ({problems.length})
      </h3>

      {/* Preview: rows exactly as they render on the Learn page, plus controls */}
      {problems.length > 0 && (
        <div className="border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden mb-2">
          <ul>
            {problems.map((problem, pi) => (
              <li
                key={problem.slug}
                className="flex items-center gap-2.5 px-3 py-2 border-b border-neutral-300 dark:border-neutral-700 last:border-b-0"
              >
                <Circle
                  size={16}
                  className="text-neutral-300 dark:text-neutral-700 shrink-0"
                />
                <a
                  href={`https://leetcode.com/problems/${problem.slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 min-w-0 flex-1 text-sm text-neutral-800 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <span className="truncate">{problem.name}</span>
                  <ExternalLink size={11} className="shrink-0 opacity-60" />
                </a>
                <DifficultyBadge difficulty={problem.difficulty} />
                <div className="flex items-center shrink-0 pl-1">
                  <button
                    type="button"
                    aria-label="Move problem up"
                    className={iconBtnClass}
                    disabled={pi === 0}
                    onClick={() =>
                      onChange((d) => d.splice(pi - 1, 0, d.splice(pi, 1)[0]))
                    }
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move problem down"
                    className={iconBtnClass}
                    disabled={pi === problems.length - 1}
                    onClick={() =>
                      onChange((d) => d.splice(pi + 1, 0, d.splice(pi, 1)[0]))
                    }
                  >
                    <ChevronDown size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete problem"
                    className={`${iconBtnClass} hover:text-rose-500`}
                    onClick={() => onChange((d) => d.splice(pi, 1))}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add by slug/URL — resolves automatically on paste */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            className={inputClass}
            placeholder="Paste a LeetCode slug or URL to add a problem…"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (status.error) setStatus({});
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData('text');
              if (text.trim()) {
                e.preventDefault();
                setDraft(text);
                addFromSlug(text);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addFromSlug(draft);
              }
            }}
          />
          {status.loading && (
            <Loader2
              size={15}
              className="animate-spin text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2"
            />
          )}
        </div>
      </div>
      {status.error && (
        <p className="mt-1 text-xs text-rose-500">{status.error}</p>
      )}
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
      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        Tasks ({tasks.length})
      </h3>
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
              aria-label="Move task up"
              className={iconBtnClass}
              disabled={ti === 0}
              onClick={() => onChange((d) => d.splice(ti - 1, 0, d.splice(ti, 1)[0]))}
            >
              <ChevronUp size={15} />
            </button>
            <button
              type="button"
              aria-label="Move task down"
              className={iconBtnClass}
              disabled={ti === tasks.length - 1}
              onClick={() => onChange((d) => d.splice(ti + 1, 0, d.splice(ti, 1)[0]))}
            >
              <ChevronDown size={15} />
            </button>
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
      <button
        type="button"
        onClick={() => onChange((d) => d.push({ id: genTaskId(), label: '' }))}
        className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border border-dashed rounded-md text-neutral-700 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <Plus size={16} />
        Add task
      </button>
    </section>
  );
}
