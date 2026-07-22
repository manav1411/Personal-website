// Editable /learn content, stored globally in KV under `content:weeks`. Content
// is authored entirely through the /admin editor — when the key is unset the
// page is simply empty. All writes go through normalizeWeeks, which validates +
// sanitises the payload (strips unknown fields, coerces types, caps lengths)
// before it touches KV.

import { getEnv } from './env';
import type {
  HomeworkProblem,
  ProblemDifficulty,
  Slide,
  Week,
  WeekTask,
} from '@/lib/content';

const KEY_WEEKS = 'content:weeks';

const DIFFICULTIES: ProblemDifficulty[] = ['Easy', 'Medium', 'Hard'];
const MAX_STR = 4000;
const MAX_CODE = 20000;
const MAX_ARRAY = 200;

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentValidationError';
  }
}

function str(value: unknown, max = MAX_STR): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.slice(0, max);
  return trimmed;
}

function nonEmpty(value: unknown, max = MAX_STR): string | null {
  const s = str(value, max);
  return s && s.trim().length > 0 ? s : null;
}

/**
 * Convert a legacy slide ({ title, points, code, note }) into a Markdown string
 * so content authored before the Markdown editor isn't lost on the first save.
 */
function legacySlideToMarkdown(raw: Record<string, unknown>): string {
  const parts: string[] = [];

  const title = nonEmpty(raw.title);
  if (title) parts.push(`## ${title}`);

  if (Array.isArray(raw.points)) {
    const points = raw.points
      .slice(0, MAX_ARRAY)
      .map((p) => nonEmpty(p))
      .filter((p): p is string => p !== null);
    if (points.length) parts.push(points.map((p) => `- ${p}`).join('\n'));
  }

  const code = str(raw.code, MAX_CODE);
  if (code && code.trim().length) parts.push('```\n' + code + '\n```');

  const note = nonEmpty(raw.note);
  if (note) parts.push(`> ${note}`);

  return parts.join('\n\n');
}

function normalizeSlide(input: unknown): Slide | null {
  // New format: a plain Markdown string, or an object with a `content` field.
  if (typeof input === 'string') {
    return input.trim().length ? { content: str(input, MAX_CODE) as string } : null;
  }
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  const content = str(raw.content, MAX_CODE);
  if (content && content.trim().length) return { content };

  // Legacy format: rebuild the Markdown body from the old structured fields.
  const legacy = legacySlideToMarkdown(raw);
  return legacy.trim().length ? { content: legacy } : null;
}

function normalizeHomework(input: unknown): HomeworkProblem | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  const name = nonEmpty(raw.name);
  const slug = nonEmpty(raw.slug, 200);
  if (!name || !slug) return null;

  const difficulty = DIFFICULTIES.includes(raw.difficulty as ProblemDifficulty)
    ? (raw.difficulty as ProblemDifficulty)
    : 'Easy';

  return { name, slug, difficulty };
}

function normalizeTask(input: unknown, weekNumber: number, index: number): WeekTask | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  const label = nonEmpty(raw.label);
  if (!label) return null;
  // Keep an existing id if valid, otherwise derive a stable one.
  const providedId = str(raw.id, 100);
  const id =
    providedId && /^[A-Za-z0-9_-]{1,100}$/.test(providedId)
      ? providedId
      : `w${weekNumber}-task-${index + 1}`;
  return { id, label };
}

function normalizeWeek(input: unknown): Week | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  // `week` only determines ordering here — normalizeWeeks renumbers the final
  // list sequentially — so a missing/invalid value just sorts the week last.
  const parsedWeek = Number(raw.week);
  const weekNumber = Number.isFinite(parsedWeek) ? parsedWeek : Number.MAX_SAFE_INTEGER;
  const topic = nonEmpty(raw.topic) ?? 'Untitled week';

  const slides = Array.isArray(raw.slides)
    ? raw.slides
        .slice(0, MAX_ARRAY)
        .map(normalizeSlide)
        .filter((s): s is Slide => s !== null)
    : [];

  const homework = Array.isArray(raw.homework)
    ? raw.homework
        .slice(0, MAX_ARRAY)
        .map(normalizeHomework)
        .filter((h): h is HomeworkProblem => h !== null)
    : [];

  const tasks = Array.isArray(raw.tasks)
    ? raw.tasks
        .slice(0, MAX_ARRAY)
        .map((t, i) => normalizeTask(t, weekNumber, i))
        .filter((t): t is WeekTask => t !== null)
    : [];

  const week: Week = {
    week: weekNumber,
    topic,
    slides,
    homework,
  };

  if (tasks.length) week.tasks = tasks;

  return week;
}

/** Validate + sanitise an arbitrary payload into a clean Week[] (or null). */
export function normalizeWeeks(input: unknown): Week[] | null {
  if (!Array.isArray(input)) return null;
  const weeks = input
    .slice(0, MAX_ARRAY)
    .map(normalizeWeek)
    .filter((w): w is Week => w !== null)
    .sort((a, b) => a.week - b.week)
    // Weeks are iterative: renumber sequentially from list order (1, 2, 3, …).
    .map((week, i) => ({ ...week, week: i + 1 }));
  return weeks;
}

export async function getWeeks(): Promise<Week[]> {
  try {
    const env = await getEnv();
    const raw = await env.LEARN_KV.get(KEY_WEEKS);
    if (!raw) return [];
    return normalizeWeeks(JSON.parse(raw)) ?? [];
  } catch {
    // KV unavailable or malformed — never break the page.
    return [];
  }
}

export async function saveWeeks(input: unknown): Promise<Week[]> {
  const weeks = normalizeWeeks(input);
  if (!weeks) {
    throw new ContentValidationError('Payload must be an array of weeks');
  }
  const env = await getEnv();
  await env.LEARN_KV.put(KEY_WEEKS, JSON.stringify(weeks));
  return weeks;
}
