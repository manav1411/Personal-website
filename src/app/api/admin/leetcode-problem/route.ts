import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/server/env';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/server/session';
import {
  extractProblemSlug,
  getLeetCodeProblem,
  LeetCodeError,
} from '@/lib/leetcode';

// Resolves a LeetCode problem's real title + difficulty from its slug, used by
// the admin editor to auto-fill homework entries. Admin-only: it hits an
// upstream API, so we don't expose it to anonymous callers.
export const dynamic = 'force-dynamic';

async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const env = await getEnv();
  return verifySessionToken(token, env.SESSION_SECRET);
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = extractProblemSlug(searchParams.get('slug') ?? '');

  if (!/^[a-z0-9-]{1,200}$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  try {
    const problem = await getLeetCodeProblem(slug);
    return NextResponse.json(problem, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    if (err instanceof LeetCodeError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: 'Unexpected error fetching problem' },
      { status: 500 }
    );
  }
}
