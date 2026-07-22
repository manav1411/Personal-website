import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/server/env';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/server/session';
import {
  ContentValidationError,
  getWeeks,
  saveWeeks,
} from '@/lib/server/contentStore';

// Read/write the editable /learn content. Reads are open (same data the page
// shows); writes require a valid admin session cookie.
export const dynamic = 'force-dynamic';

async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const env = await getEnv();
  return verifySessionToken(token, env.SESSION_SECRET);
}

export async function GET() {
  const weeks = await getWeeks();
  return NextResponse.json({ weeks }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const weeksInput =
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).weeks
      : undefined;

  try {
    const weeks = await saveWeeks(weeksInput);
    return NextResponse.json({ ok: true, weeks });
  } catch (err) {
    if (err instanceof ContentValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}
