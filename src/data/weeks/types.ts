// Shared shapes for weekly session content. Each week lives in its own file
// (week01.ts, week02.ts, …) and is registered in ./index.ts — so adding a week
// is just: create the file, add one import.

import type { ProblemDifficulty } from '@/data/patternsData';

export type { ProblemDifficulty };

export interface Slide {
  title: string;
  points?: string[];
  code?: string;
  /** A speaker note, shown under the slide (not on the projector-friendly body). */
  note?: string;
}

export interface HomeworkProblem {
  name: string;
  slug: string; // leetcode.com/problems/<slug>/
  difficulty: ProblemDifficulty;
  patternId?: string; // links to the pattern library on /learn/other
  /** Progressive nudge, hidden behind a "show hint" toggle. */
  hint?: string;
}

export interface Week {
  week: number;
  topic: string;
  summary?: string;
  slides: Slide[];
  homework: HomeworkProblem[];
}
