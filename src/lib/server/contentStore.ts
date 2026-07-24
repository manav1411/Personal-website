// Editable /learn content, stored globally in KV under `content:weeks`. Content
// is authored through the /admin editor; when the key is unset (or legacy), we
// seed/pad to the fixed 12-week curriculum. All writes go through
// normalizeWeeks + ensureCurriculumWeeks, which validate + sanitise the payload
// before it touches KV.

import {
  CURRICULUM_WEEK_COUNT,
  CURRICULUM_WEEKS,
} from '@/data/curriculumWeeks';
import { getEnv } from './env';
import type {
  HomeworkProblem,
  ProblemDifficulty,
  Slide,
  Week,
  WeekTask,
  WeekTopic,
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

function normalizeSlides(input: unknown): Slide[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, MAX_ARRAY)
    .map(normalizeSlide)
    .filter((s): s is Slide => s !== null);
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

function normalizeHomeworkList(input: unknown): HomeworkProblem[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, MAX_ARRAY)
    .map(normalizeHomework)
    .filter((h): h is HomeworkProblem => h !== null);
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

function emptyTopic(): WeekTopic {
  return { homework: [] };
}

function normalizeTopic(input: unknown): WeekTopic {
  if (!input || typeof input !== 'object') return emptyTopic();
  const raw = input as Record<string, unknown>;
  return { homework: normalizeHomeworkList(raw.homework) };
}

function looksLikeBinarySearch(topic: string): boolean {
  return /binary\s*search/i.test(topic);
}

function clampTopic2Start(start: number, slideCount: number): number {
  if (slideCount <= 0) return 0;
  if (!Number.isFinite(start) || start < 0) return 0;
  return Math.min(Math.floor(start), slideCount - 1);
}

/**
 * Collect week-level slides + topic2 start. Prefer top-level `slides`; if missing,
 * concatenate per-topic slides from an earlier dual-deck shape.
 */
function resolveSlides(
  raw: Record<string, unknown>,
  topicsRaw: unknown[] | null
): { slides: Slide[]; topic2SlideStart: number } {
  if (Array.isArray(raw.slides)) {
    const slides = normalizeSlides(raw.slides);
    const parsed = Number(raw.topic2SlideStart);
    return {
      slides,
      topic2SlideStart: clampTopic2Start(
        Number.isFinite(parsed) ? parsed : 0,
        slides.length
      ),
    };
  }

  // Dual-deck migration: left slides then right slides.
  if (topicsRaw && topicsRaw.length >= 2) {
    const leftRaw =
      topicsRaw[0] && typeof topicsRaw[0] === 'object'
        ? (topicsRaw[0] as Record<string, unknown>)
        : {};
    const rightRaw =
      topicsRaw[1] && typeof topicsRaw[1] === 'object'
        ? (topicsRaw[1] as Record<string, unknown>)
        : {};
    const leftSlides = normalizeSlides(leftRaw.slides);
    const rightSlides = normalizeSlides(rightRaw.slides);
    const slides = [...leftSlides, ...rightSlides].slice(0, MAX_ARRAY);
    const topic2SlideStart = clampTopic2Start(leftSlides.length, slides.length);
    return { slides, topic2SlideStart };
  }

  return { slides: [], topic2SlideStart: 0 };
}

/**
 * Legacy weeks stored a single `topic` + top-level `slides`/`homework`. Map
 * homework into dual topics; slides stay week-level.
 */
function migrateLegacyTopics(
  raw: Record<string, unknown>,
  weekNumber: number
): {
  topics: [WeekTopic, WeekTopic];
  slides: Slide[];
  topic2SlideStart: number;
} {
  const legacyTopic = nonEmpty(raw.topic) ?? '';

  const slides = normalizeSlides(raw.slides);
  const homework = normalizeHomeworkList(raw.homework);

  const left = emptyTopic();
  const right = emptyTopic();

  const hasHomework = homework.length > 0;
  const placeOnRight =
    looksLikeBinarySearch(legacyTopic) || (weekNumber === 1 && hasHomework);

  if (hasHomework) {
    if (placeOnRight) {
      right.homework = homework;
    } else {
      left.homework = homework;
    }
  }

  return { topics: [left, right], slides, topic2SlideStart: 0 };
}

function seedTitleForWeek(weekNumber: number): string {
  const seed = CURRICULUM_WEEKS.find((w) => w.week === weekNumber);
  return seed?.title ?? `Week ${weekNumber}`;
}

function normalizeWeek(input: unknown): Week | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;

  // `week` only determines ordering here — normalizeWeeks renumbers the final
  // list sequentially — so a missing/invalid value just sorts the week last.
  const parsedWeek = Number(raw.week);
  const weekNumber = Number.isFinite(parsedWeek) ? parsedWeek : Number.MAX_SAFE_INTEGER;
  const resolvedWeek = Number.isFinite(parsedWeek) ? parsedWeek : 1;

  const isLegacy = !(Array.isArray(raw.topics) && raw.topics.length >= 2);
  let topics: [WeekTopic, WeekTopic];
  let slides: Slide[];
  let topic2SlideStart: number;

  if (!isLegacy) {
    const topicList = raw.topics as unknown[];
    topics = [normalizeTopic(topicList[0]), normalizeTopic(topicList[1])];
    ({ slides, topic2SlideStart } = resolveSlides(raw, topicList));
  } else {
    ({ topics, slides, topic2SlideStart } = migrateLegacyTopics(raw, resolvedWeek));
  }

  const tasks = Array.isArray(raw.tasks)
    ? raw.tasks
        .slice(0, MAX_ARRAY)
        .map((t, i) => normalizeTask(t, weekNumber, i))
        .filter((t): t is WeekTask => t !== null)
    : [];

  // Dual-topic payloads honour the stored flag. Legacy weeks have no flag —
  // unlock week 1 (seed default), keep the rest locked.
  const accessible = isLegacy
    ? weekNumber === 1 || raw.accessible === true
    : raw.accessible === true;

  const title = nonEmpty(raw.title) ?? seedTitleForWeek(resolvedWeek);

  const week: Week = {
    week: weekNumber,
    title,
    accessible,
    slides,
    topic2SlideStart,
    topics,
  };

  if (tasks.length) week.tasks = tasks;

  return week;
}

function seedWeek(weekNumber: number): Week {
  const seed =
    CURRICULUM_WEEKS.find((w) => w.week === weekNumber) ??
    CURRICULUM_WEEKS[0];
  return {
    week: weekNumber,
    title: seed.title,
    accessible: seed.accessible,
    slides: [],
    topic2SlideStart: 0,
    topics: [emptyTopic(), emptyTopic()],
  };
}

/**
 * Pad / merge to exactly 12 curriculum weeks. Preserves slides, homework,
 * tasks, and accessible when a week already exists; fills missing slots from
 * the static seed.
 */
export function ensureCurriculumWeeks(weeks: Week[]): Week[] {
  const byNumber = new Map(weeks.map((w) => [w.week, w]));
  const ensured: Week[] = [];

  for (let n = 1; n <= CURRICULUM_WEEK_COUNT; n++) {
    const seed = CURRICULUM_WEEKS[n - 1];
    const existing = byNumber.get(n);
    if (!existing) {
      ensured.push(seedWeek(n));
      continue;
    }

    const slides = existing.slides ?? [];
    const topics: [WeekTopic, WeekTopic] = [
      { homework: existing.topics[0]?.homework ?? [] },
      { homework: existing.topics[1]?.homework ?? [] },
    ];

    const week: Week = {
      week: n,
      title: nonEmpty(existing.title) ?? seed.title,
      accessible: existing.accessible,
      slides,
      topic2SlideStart: clampTopic2Start(existing.topic2SlideStart ?? 0, slides.length),
      topics,
    };
    if (existing.tasks?.length) week.tasks = existing.tasks;
    ensured.push(week);
  }

  return ensured;
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
  return ensureCurriculumWeeks(weeks);
}

function looksLegacyPayload(raw: unknown): boolean {
  if (!Array.isArray(raw) || raw.length === 0) return true;
  const first = raw[0];
  if (!first || typeof first !== 'object') return true;
  const obj = first as Record<string, unknown>;
  if (!Array.isArray(obj.topics)) return true;
  // Dual-deck shape (slides nested under topics) also needs write-back.
  if (!Array.isArray(obj.slides) && Array.isArray(obj.topics)) {
    const t0 = obj.topics[0];
    if (t0 && typeof t0 === 'object' && Array.isArray((t0 as Record<string, unknown>).slides)) {
      return true;
    }
  }
  return false;
}

export async function getWeeks(): Promise<Week[]> {
  try {
    const env = await getEnv();
    const raw = await env.LEARN_KV.get(KEY_WEEKS);
    if (!raw) {
      const seeded = ensureCurriculumWeeks([]);
      await env.LEARN_KV.put(KEY_WEEKS, JSON.stringify(seeded));
      return seeded;
    }
    const parsed: unknown = JSON.parse(raw);
    const weeks = normalizeWeeks(parsed) ?? ensureCurriculumWeeks([]);
    // Persist when migrating legacy shape or padding up to 12 curriculum weeks.
    const storedCount = Array.isArray(parsed) ? parsed.length : 0;
    if (looksLegacyPayload(parsed) || storedCount !== weeks.length) {
      await env.LEARN_KV.put(KEY_WEEKS, JSON.stringify(weeks));
    }
    return weeks;
  } catch {
    // KV unavailable or malformed — never break the page.
    return ensureCurriculumWeeks([]);
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
