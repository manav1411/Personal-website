'use client';

// The NeetCode 150 roadmap: a directed topic graph (Arrays & Hashing at the top,
// arrows flowing down through the recommended learning order) where clicking a
// topic reveals its problems. Solved detection reuses the same accumulated
// solve history that powers the homework ticks, so a linked LeetCode account
// automatically shows progress.

import type { CSSProperties } from 'react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  ExternalLink,
  X,
} from 'lucide-react';
import { useLearnUsername } from '@/hooks/useLearnUsername';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { buildSolvedByDay, solvedSlugs } from '@/lib/leetcodeMetrics';
import {
  roadmapEdges,
  roadmapTopics,
  roadmapTotalProblems,
  type RoadmapTopic,
} from '@/data/roadmapData';
import DifficultyBadge from './DifficultyBadge';

const GRID_COLS = 5;
const POPOVER_WIDTH = 288; // w-72
const POPOVER_GAP = 12;
const EDGE_MARGIN = 8;

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface NodeSharedProps {
  solved: Set<string>;
  solvedByTopic: Record<string, number>;
  personalised: boolean;
  selected: string | null;
  onToggle: (id: string) => void;
}

function countLabel(
  topic: RoadmapTopic,
  solvedByTopic: Record<string, number>,
  personalised: boolean
): string {
  return personalised
    ? `${solvedByTopic[topic.id]}/${topic.problems.length}`
    : `${topic.problems.length} problems`;
}

/* ---------------------------- Compact problem list ---------------------------- */

function TopicProblems({
  topic,
  solved,
  personalised,
}: {
  topic: RoadmapTopic;
  solved: Set<string>;
  personalised: boolean;
}) {
  return (
    <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
      {topic.problems.map((problem) => {
        const done = solved.has(problem.slug);
        return (
          <li
            key={problem.slug}
            className="flex items-center gap-2 px-3 py-1.5"
          >
            {personalised ? (
              done ? (
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              ) : (
                <Circle
                  size={14}
                  className="text-neutral-400 dark:text-neutral-600 shrink-0"
                />
              )
            ) : (
              <Circle
                size={14}
                className="text-neutral-300 dark:text-neutral-700 shrink-0"
              />
            )}
            <a
              href={`https://leetcode.com/problems/${problem.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex min-w-0 flex-1 items-center gap-1 text-xs hover:text-blue-500 dark:hover:text-blue-400 ${
                done && personalised
                  ? 'text-neutral-500 dark:text-neutral-400'
                  : 'text-neutral-800 dark:text-neutral-200'
              }`}
            >
              <span className="truncate">{problem.name}</span>
              <ExternalLink size={10} className="shrink-0 opacity-60" />
            </a>
            <DifficultyBadge difficulty={problem.difficulty} />
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------- Topic popover ------------------------------- */

function TopicPopover({
  topic,
  style,
  solved,
  solvedByTopic,
  personalised,
  onClose,
  popRef,
}: {
  topic: RoadmapTopic;
  style: CSSProperties;
  solved: Set<string>;
  solvedByTopic: Record<string, number>;
  personalised: boolean;
  onClose: () => void;
  popRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={popRef}
      style={style}
      className="absolute z-30 overflow-hidden rounded-md border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 shadow-xl"
    >
      <div className="flex items-center justify-between gap-2 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/80 px-3 py-2">
        <span className="truncate text-xs font-bold text-neutral-900 dark:text-neutral-100">
          {topic.label}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {personalised && (
            <span className="text-[11px] tabular-nums text-emerald-600 dark:text-emerald-400">
              {solvedByTopic[topic.id]}/{topic.problems.length}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Collapse"
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <TopicProblems
          topic={topic}
          solved={solved}
          personalised={personalised}
        />
      </div>
    </div>
  );
}

/* -------------------------- Desktop positioned graph -------------------------- */

function RoadmapGraph({
  solved,
  solvedByTopic,
  personalised,
  selected,
  onToggle,
}: NodeSharedProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const popRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [popHeight, setPopHeight] = useState(0);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    setSize({ w: wrap.clientWidth, h: wrap.clientHeight });

    const nextRects: Record<string, Rect> = {};
    for (const topic of roadmapTopics) {
      const el = nodeRefs.current[topic.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      nextRects[topic.id] = {
        left: r.left - wrapRect.left,
        top: r.top - wrapRect.top,
        right: r.right - wrapRect.left,
        bottom: r.bottom - wrapRect.top,
        width: r.width,
        height: r.height,
      };
    }
    setRects(nextRects);

    const next: Line[] = [];
    for (const [from, to] of roadmapEdges) {
      const a = nextRects[from];
      const b = nextRects[to];
      if (!a || !b) continue;
      next.push({
        id: `${from}-${to}`,
        x1: a.left + a.width / 2,
        y1: a.bottom,
        x2: b.left + b.width / 2,
        y2: b.top,
      });
    }
    setLines(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrap);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const selectedTopic = roadmapTopics.find((t) => t.id === selected) ?? null;
  const selectedRect = selected ? rects[selected] : null;

  useLayoutEffect(() => {
    setPopHeight(popRef.current?.offsetHeight ?? 0);
  }, [selected, rects]);

  // Anchor the popover beside the selected node: open on whichever side has
  // room, and clamp inside the graph so it never spills off the edges.
  const popStyle = useMemo<CSSProperties | undefined>(() => {
    if (!selectedRect) return undefined;
    const roomRight = size.w - selectedRect.right;
    const openRight = roomRight >= POPOVER_WIDTH + POPOVER_GAP;
    const left = openRight
      ? Math.min(
          selectedRect.right + POPOVER_GAP,
          size.w - POPOVER_WIDTH - EDGE_MARGIN
        )
      : Math.max(EDGE_MARGIN, selectedRect.left - POPOVER_GAP - POPOVER_WIDTH);
    const top = Math.max(
      EDGE_MARGIN,
      Math.min(selectedRect.top, Math.max(EDGE_MARGIN, size.h - popHeight - EDGE_MARGIN))
    );
    return { width: POPOVER_WIDTH, left, top };
  }, [selectedRect, size.w, size.h, popHeight]);

  return (
    <div ref={wrapRef} className="relative">
      <svg
        className="absolute inset-0 pointer-events-none"
        width={size.w}
        height={size.h}
        aria-hidden="true"
      >
        <defs>
          <marker
            id="rm-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 1 L 9 5 L 0 9 z"
              className="fill-neutral-400 dark:fill-neutral-500"
            />
          </marker>
        </defs>
        {lines.map((l) => {
          const midY = (l.y1 + l.y2) / 2;
          const d = `M ${l.x1} ${l.y1} C ${l.x1} ${midY}, ${l.x2} ${midY}, ${l.x2} ${l.y2}`;
          return (
            <path
              key={l.id}
              d={d}
              fill="none"
              strokeWidth={1.5}
              markerEnd="url(#rm-arrow)"
              className="stroke-neutral-400 dark:stroke-neutral-500"
            />
          );
        })}
      </svg>

      <div
        className="grid gap-x-3 gap-y-9"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
      >
        {roadmapTopics.map((topic) => {
          const isSelected = selected === topic.id;
          const fullySolved =
            personalised && solvedByTopic[topic.id] === topic.problems.length;
          return (
            <button
              key={topic.id}
              ref={(el) => {
                nodeRefs.current[topic.id] = el;
              }}
              type="button"
              onClick={() => onToggle(topic.id)}
              style={{ gridColumn: topic.col, gridRow: topic.row }}
              className={`relative z-10 flex flex-col items-center justify-center gap-1 rounded-md border px-2 py-2.5 text-center shadow-sm transition-colors ${
                isSelected
                  ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50 dark:bg-blue-950/40'
                  : 'border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <span className="text-xs font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
                {topic.label}
              </span>
              <span
                className={`text-[10px] tabular-nums ${
                  personalised
                    ? fullySolved
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-emerald-600 dark:text-emerald-400'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {countLabel(topic, solvedByTopic, personalised)}
              </span>
            </button>
          );
        })}
      </div>

      {selectedTopic && popStyle && (
        <TopicPopover
          topic={selectedTopic}
          style={popStyle}
          solved={solved}
          solvedByTopic={solvedByTopic}
          personalised={personalised}
          onClose={() => onToggle(selectedTopic.id)}
          popRef={popRef}
        />
      )}
    </div>
  );
}

/* ---------------------------- Mobile vertical list ---------------------------- */

function RoadmapList({
  solved,
  solvedByTopic,
  personalised,
  selected,
  onToggle,
}: NodeSharedProps) {
  const ordered = useMemo(
    () => [...roadmapTopics].sort((a, b) => a.row - b.row || a.col - b.col),
    []
  );

  return (
    <div className="flex flex-col gap-2">
      {ordered.map((topic) => {
        const isSelected = selected === topic.id;
        return (
          <div key={topic.id}>
            <button
              type="button"
              onClick={() => onToggle(topic.id)}
              className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-left transition-colors ${
                isSelected
                  ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50 dark:bg-blue-950/40'
                  : 'border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {topic.label}
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[11px] tabular-nums ${
                    personalised
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {countLabel(topic, solvedByTopic, personalised)}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-neutral-400 transition-transform ${
                    isSelected ? 'rotate-180' : ''
                  }`}
                />
              </span>
            </button>
            {isSelected && (
              <div className="mt-1.5 overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700">
                <TopicProblems
                  topic={topic}
                  solved={solved}
                  personalised={personalised}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------- Roadmap --------------------------------- */

export default function Roadmap() {
  const { username } = useLearnUsername();
  const { stats } = useLeetCodeStats(username || '');
  const personalised = Boolean(username);

  const solved = useMemo(
    () => (stats ? solvedSlugs(buildSolvedByDay(stats)) : new Set<string>()),
    [stats]
  );

  const solvedByTopic = useMemo(() => {
    const map: Record<string, number> = {};
    for (const topic of roadmapTopics) {
      map[topic.id] = topic.problems.filter((p) => solved.has(p.slug)).length;
    }
    return map;
  }, [solved]);

  const totalSolved = useMemo(
    () => Object.values(solvedByTopic).reduce((a, b) => a + b, 0),
    [solvedByTopic]
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Escape collapses the open topic.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const toggle = useCallback((id: string) => {
    setSelected((cur) => (cur === id ? null : id));
  }, []);

  const toggleOpen = () => {
    setOpen((cur) => {
      if (cur) setSelected(null);
      return !cur;
    });
  };

  return (
    <div className="w-full dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-500 rounded-md shadow-md dark:shadow-neutral-800/50 p-4">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 text-left ${
          open ? 'mb-4' : ''
        }`}
      >
        <span className="flex items-center gap-2">
          <ChevronDown
            size={16}
            className={`text-neutral-400 transition-transform ${
              open ? '' : '-rotate-90'
            }`}
          />
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            NeetCode 150 Roadmap
          </span>
        </span>
        {personalised && (
          <span className="text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {totalSolved}
            </span>{' '}
            / {roadmapTotalProblems} solved
          </span>
        )}
      </button>

      {open && (
        <>
          {isDesktop ? (
            <RoadmapGraph
              solved={solved}
              solvedByTopic={solvedByTopic}
              personalised={personalised}
              selected={selected}
              onToggle={toggle}
            />
          ) : (
            <RoadmapList
              solved={solved}
              solvedByTopic={solvedByTopic}
              personalised={personalised}
              selected={selected}
              onToggle={toggle}
            />
          )}

          {!personalised && (
            <p className="mt-4 text-[11px] text-neutral-400 dark:text-neutral-500">
              Enter your LeetCode username above to track your roadmap progress.
            </p>
          )}
        </>
      )}
    </div>
  );
}
