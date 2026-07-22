// Per-user task completion, stored in KV under `progress:<username>` (username
// lowercased). Identity is just the LeetCode username the user typed in, so the
// same handle on any device sees the same checked-off tasks.

import { getEnv } from './env';

export const USERNAME_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;
export const TASK_ID_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;

const MAX_TASKS_PER_USER = 500;

export type TaskProgress = Record<string, boolean>;

function keyFor(username: string): string {
  return `progress:${username.toLowerCase()}`;
}

export async function getProgress(username: string): Promise<TaskProgress> {
  if (!USERNAME_PATTERN.test(username)) return {};
  try {
    const env = await getEnv();
    const raw = await env.LEARN_KV.get(keyFor(username));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: TaskProgress = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === true && TASK_ID_PATTERN.test(key)) out[key] = true;
    }
    return out;
  } catch {
    return {};
  }
}

export async function setTask(
  username: string,
  taskId: string,
  done: boolean
): Promise<TaskProgress> {
  if (!USERNAME_PATTERN.test(username)) {
    throw new Error('Invalid username');
  }
  if (!TASK_ID_PATTERN.test(taskId)) {
    throw new Error('Invalid task id');
  }

  const current = await getProgress(username);
  if (done) {
    current[taskId] = true;
  } else {
    delete current[taskId];
  }

  // Guard against unbounded growth from a malicious client.
  if (Object.keys(current).length > MAX_TASKS_PER_USER) {
    throw new Error('Too many tasks');
  }

  const env = await getEnv();
  await env.LEARN_KV.put(keyFor(username), JSON.stringify(current));
  return current;
}
