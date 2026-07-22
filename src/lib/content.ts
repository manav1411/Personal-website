// The /learn content model — weeks, slides, homework, and tasks. The actual
// content is authored through the /admin editor and stored in Cloudflare KV
// (src/lib/server/contentStore.ts); these types describe that shape across both
// the client components and the server store.

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

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
}

/**
 * A manual, checkmark-able task for a week (e.g. "Sign up for a LeetCode
 * account"). Completion is stored per-user (by LeetCode username) so it syncs
 * across devices. `id` must be stable — it's the key we persist against.
 */
export interface WeekTask {
  id: string;
  label: string;
}

export interface Week {
  week: number;
  topic: string;
  summary?: string;
  slides: Slide[];
  homework: HomeworkProblem[];
  tasks?: WeekTask[];
}
