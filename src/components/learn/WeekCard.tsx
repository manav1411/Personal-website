'use client';

import { useEffect, useState } from 'react';
import { Presentation, ClipboardList } from 'lucide-react';
import type { Week } from '@/lib/content';
import Modal from './Modal';
import SlideDeck from './SlideDeck';
import HomeworkList from './HomeworkList';

interface WeekCardProps {
  week: Week;
  solvedSlugs: Set<string>;
  personalised: boolean;
  taskProgress: Record<string, boolean>;
  onToggleTask: (taskId: string, done: boolean) => void;
}

type ModalKind =
  | null
  | { kind: 'slides'; startIndex: number }
  | { kind: 'homework' };

function requestFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
}

function leaveFullscreen() {
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

export default function WeekCard({
  week,
  solvedSlugs,
  personalised,
  taskProgress,
  onToggleTask,
}: WeekCardProps) {
  const [modal, setModal] = useState<ModalKind>(null);
  const locked = !week.accessible;
  const allHomework = week.topics.flatMap((t) => t.homework);
  const solvedCount = allHomework.filter((h) => solvedSlugs.has(h.slug)).length;

  // Slides present in true browser fullscreen. Exiting fullscreen (Esc, the OS
  // control, etc.) closes the deck so the two states never get out of sync.
  useEffect(() => {
    if (modal?.kind !== 'slides') return;
    const onFsChange = () => {
      if (!document.fullscreenElement) setModal(null);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [modal]);

  const openSlides = (startIndex: number) => {
    if (locked) return;
    setModal({ kind: 'slides', startIndex });
    requestFullscreen();
  };

  const closeSlides = () => {
    leaveFullscreen();
    setModal(null);
  };

  const openHomework = () => {
    if (locked) return;
    setModal({ kind: 'homework' });
  };

  const btnClass =
    'inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:pointer-events-none disabled:hover:bg-transparent';

  return (
    <div
      className={`flex flex-col dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-3 ${
        locked ? 'opacity-45' : ''
      }`}
      aria-disabled={locked || undefined}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
        Week {week.week}
      </span>
      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-tight mt-0.5 mb-2">
        {week.title}
      </h3>

      {personalised && allHomework.length > 0 && (
        <span className="text-[11px] tabular-nums text-emerald-600 dark:text-emerald-400 mb-0.5">
          {solvedCount}/{allHomework.length} solved
        </span>
      )}
      {personalised && week.tasks && week.tasks.length > 0 && (
        <span className="text-[11px] tabular-nums text-blue-600 dark:text-blue-400 mb-2">
          {week.tasks.filter((t) => taskProgress[t.id]).length}/
          {week.tasks.length} tasks
        </span>
      )}

      <div className="mt-auto flex flex-col gap-1.5">
        {/* One Slides control: idle opens topic 1; hover splits into topic jumps. */}
        <div
          className={`group relative overflow-hidden border rounded-md border-neutral-400 dark:border-neutral-500 ${
            locked ? 'pointer-events-none opacity-100' : ''
          }`}
        >
          <button
            type="button"
            onClick={() => openSlides(0)}
            disabled={locked}
            aria-disabled={locked}
            className="flex w-full items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700 group-hover:opacity-0 group-hover:pointer-events-none transition-opacity disabled:pointer-events-none"
          >
            <Presentation size={13} />
            Slides
          </button>
          <div className="absolute inset-0 hidden grid-cols-2 group-hover:grid">
            <button
              type="button"
              onClick={() => openSlides(0)}
              disabled={locked}
              className="min-w-0 px-1 text-[10px] leading-tight font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-200/80 dark:bg-neutral-700/80 hover:bg-neutral-300 dark:hover:bg-neutral-600 truncate border-r border-neutral-400 dark:border-neutral-500"
            >
              Topic 1
            </button>
            <button
              type="button"
              onClick={() => openSlides(week.topic2SlideStart)}
              disabled={locked}
              className="min-w-0 px-1 text-[10px] leading-tight font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-200/80 dark:bg-neutral-700/80 hover:bg-neutral-300 dark:hover:bg-neutral-600 truncate"
            >
              Topic 2
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={openHomework}
          disabled={locked}
          aria-disabled={locked}
          className={btnClass}
        >
          <ClipboardList size={13} />
          Homework
        </button>
      </div>

      <Modal
        open={modal?.kind === 'slides'}
        onClose={closeSlides}
        title={`Week ${week.week}: ${week.title} — Slides`}
        fullscreen
      >
        {modal?.kind === 'slides' && (
          <SlideDeck
            key={modal.startIndex}
            slides={week.slides}
            initialIndex={modal.startIndex}
          />
        )}
      </Modal>

      <Modal
        open={modal?.kind === 'homework'}
        onClose={() => setModal(null)}
        title={`Week ${week.week}: ${week.title} — Homework`}
      >
        <div className="flex flex-col gap-5">
          {week.tasks && week.tasks.length > 0 && (
            <HomeworkList
              problems={[]}
              solvedSlugs={solvedSlugs}
              personalised={personalised}
              tasks={week.tasks}
              taskProgress={taskProgress}
              onToggleTask={onToggleTask}
            />
          )}
          {week.topics.map((topic, ti) => (
            <div key={ti} className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Topic {ti + 1}
              </h4>
              <HomeworkList
                problems={topic.homework}
                solvedSlugs={solvedSlugs}
                personalised={personalised}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
