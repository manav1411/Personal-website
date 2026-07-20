'use client';

import { useEffect, useState } from 'react';
import { Presentation, ClipboardList } from 'lucide-react';
import type { Week } from '@/data/weeks';
import Modal from './Modal';
import SlideDeck from './SlideDeck';
import HomeworkList from './HomeworkList';

interface WeekCardProps {
  week: Week;
  solvedSlugs: Set<string>;
  personalised: boolean;
}

function requestFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
}

function leaveFullscreen() {
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

export default function WeekCard({ week, solvedSlugs, personalised }: WeekCardProps) {
  const [modal, setModal] = useState<null | 'slides' | 'homework'>(null);
  const solvedCount = week.homework.filter((h) => solvedSlugs.has(h.slug)).length;

  // Slides present in true browser fullscreen. Exiting fullscreen (Esc, the OS
  // control, etc.) closes the deck so the two states never get out of sync.
  useEffect(() => {
    if (modal !== 'slides') return;
    const onFsChange = () => {
      if (!document.fullscreenElement) setModal(null);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [modal]);

  const openSlides = () => {
    setModal('slides');
    requestFullscreen();
  };

  const closeSlides = () => {
    leaveFullscreen();
    setModal(null);
  };

  return (
    <div className="flex flex-col dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-3">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
        Week {week.week}
      </span>
      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-tight mt-0.5 mb-2">
        {week.topic}
      </h3>

      {personalised && week.homework.length > 0 && (
        <span className="text-[11px] tabular-nums text-emerald-600 dark:text-emerald-400 mb-2">
          {solvedCount}/{week.homework.length} solved
        </span>
      )}

      <div className="mt-auto flex flex-col gap-1.5">
        <button
          type="button"
          onClick={openSlides}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
        >
          <Presentation size={13} />
          Slides
        </button>
        <button
          type="button"
          onClick={() => setModal('homework')}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
        >
          <ClipboardList size={13} />
          Homework
        </button>
      </div>

      <Modal
        open={modal === 'slides'}
        onClose={closeSlides}
        title={`Week ${week.week}: ${week.topic} — Slides`}
        fullscreen
      >
        <SlideDeck slides={week.slides} />
      </Modal>

      <Modal
        open={modal === 'homework'}
        onClose={() => setModal(null)}
        title={`Week ${week.week}: ${week.topic} — Homework`}
      >
        <HomeworkList
          problems={week.homework}
          solvedSlugs={solvedSlugs}
          personalised={personalised}
        />
      </Modal>
    </div>
  );
}
