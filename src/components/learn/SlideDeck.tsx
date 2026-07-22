'use client';

// A minimal full-screen slide deck shown inside the week modal: one slide at a
// time with arrow-key navigation. The modal owns the frame and Escape-to-close;
// this fills the available space and renders the current slide + prev/next.

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Slide } from '@/lib/content';

export default function SlideDeck({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  const count = slides.length;
  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(Math.max(i + delta, 0), count - 1)),
    [count]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (count === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
        Slides for this week are still in prep.
      </p>
    );
  }

  const slide = slides[index];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Slide body — centered and large for presenting */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-center">
        <div className="w-full max-w-4xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            {slide.title}
          </h3>

          {slide.points && slide.points.length > 0 && (
            <ul className="list-disc pl-6 space-y-3 text-lg sm:text-xl text-neutral-700 dark:text-neutral-300">
              {slide.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          )}

          {slide.code && (
            <pre className="mt-6 p-4 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 overflow-x-auto font-mono text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
              <code>{slide.code}</code>
            </pre>
          )}

          {slide.note && (
            <p className="mt-6 text-base text-neutral-500 dark:text-neutral-400 italic border-l-2 border-neutral-300 dark:border-neutral-600 pl-3">
              Speaker note: {slide.note}
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-300 dark:border-neutral-700 shrink-0">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft size={15} />
          Prev
        </button>

        <span className="text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
          {index + 1} / {count}
        </span>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === count - 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:pointer-events-none"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
