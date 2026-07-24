'use client';

// A minimal full-screen slide deck shown inside the week modal: one slide at a
// time with arrow-key navigation. The modal owns the frame and Escape-to-close;
// this fills the available space and renders the current slide + prev/next.

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Slide } from '@/lib/content';
import Markdown from '@/components/Markdown';

export default function SlideDeck({
  slides,
  initialIndex = 0,
}: {
  slides: Slide[];
  /** 0-based slide to open on (clamped). */
  initialIndex?: number;
}) {
  const count = slides.length;
  const clampedStart =
    count <= 0 ? 0 : Math.min(Math.max(Math.floor(initialIndex), 0), count - 1);
  const [index, setIndex] = useState(clampedStart);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Remount-safe: if the deck is reopened at a different topic jump, sync.
  useEffect(() => {
    setIndex(clampedStart);
  }, [clampedStart]);

  // Always start a new slide scrolled to the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

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
      {/*
        Scroll lives here. Inner min-h-full + justify-center centers short
        slides; when content overflows, the flex column grows past the
        viewport so scroll starts at the top (no clipped heading).
      */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center py-2">
          <Markdown className="w-full max-w-4xl mx-auto prose-lg sm:prose-xl">
            {slide.content}
          </Markdown>
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
