import { NextRequest, NextResponse } from 'next/server';
import {
  TASK_ID_PATTERN,
  USERNAME_PATTERN,
  getProgress,
  setTask,
} from '@/lib/server/progressStore';

// Per-user task completion. Identity is the LeetCode username (no auth), so the
// same handle sees the same tasks on any device.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') ?? '';

  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  const tasks = await getProgress(username);
  return NextResponse.json({ tasks }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const username = typeof raw.username === 'string' ? raw.username : '';
  const taskId = typeof raw.taskId === 'string' ? raw.taskId : '';
  const done = raw.done === true;

  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }
  if (!TASK_ID_PATTERN.test(taskId)) {
    return NextResponse.json({ error: 'Invalid task id' }, { status: 400 });
  }

  try {
    const tasks = await setTask(username, taskId, done);
    return NextResponse.json({ ok: true, tasks });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
