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

function normalizeSlide(input: unknown): Slide | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  const title = nonEmpty(raw.title);
  if (!title) return null;

  const slide: Slide = { title };

  if (Array.isArray(raw.points)) {
    const points = raw.points
      .slice(0, MAX_ARRAY)
      .map((p) => nonEmpty(p))
      .filter((p): p is string => p !== null);
    if (points.length) slide.points = points;
  }
  const code = str(raw.code, MAX_CODE);
  if (code && code.trim().length) slide.code = code;

  const note = nonEmpty(raw.note);
  if (note) slide.note = note;

  return slide;
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

  const weekNumber = Number(raw.week);
  if (!Number.isFinite(weekNumber)) return null;
  const topic = nonEmpty(raw.topic) ?? `Week ${weekNumber}`;

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

  const summary = nonEmpty(raw.summary);
  if (summary) week.summary = summary;
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
    .sort((a, b) => a.week - b.week);
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
