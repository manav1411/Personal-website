// The /learn content model — weeks, slides, homework, and tasks. The actual
// content is authored through the /admin editor and stored in Cloudflare KV
// (src/lib/server/contentStore.ts); these types describe that shape across both
// the client components and the server store.

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Slide {
  /**
   * The full body of a single slide, authored as Markdown. Slides are separated
   * in the editor by a line containing only `---`; each resulting chunk becomes
   * one slide's `content`.
   */
  content: string;
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
  /**
   * 1-based position of the week. This mirrors the ordering in the editor (the
   * first week is 1, the next is 2, …) and is assigned from list order on save.
   */
  week: number;
  topic: string;
  slides: Slide[];
  homework: HomeworkProblem[];
  tasks?: WeekTask[];
}
