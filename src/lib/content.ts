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

/** One of the two topic homework sections inside a week. */
export interface WeekTopic {
  homework: HomeworkProblem[];
}

export interface Week {
  /**
   * 1-based position of the week. This mirrors the ordering in the editor (the
   * first week is 1, the next is 2, …) and is assigned from list order on save.
   */
  week: number;
  /** Card title on the Learn board (e.g. "Python for DSA & Binary Search"). */
  title: string;
  /** When false, the learn card is greyed out and slides/homework are disabled. */
  accessible: boolean;
  /** Single Markdown slideshow for the week. */
  slides: Slide[];
  /**
   * 0-based index where topic 2 begins in `slides`. Topic 1 always starts at 0.
   * Hovering the Slides button lets learners jump to this index for topic 2.
   */
  topic2SlideStart: number;
  /** Left and right topic sections (names + homework). */
  topics: [WeekTopic, WeekTopic];
  tasks?: WeekTask[];
}
