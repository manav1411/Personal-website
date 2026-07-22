import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/server/env';
import { timingSafeEqual } from '@/lib/server/session';
import { refreshAll } from '@/lib/server/solveStore';

// Background job endpoint: polls every tracked user's LeetCode feed and merges
// new solves into the durable KV history. Hit it on a schedule (e.g. an
// external cron every few hours) so solves are captured even when nobody is
// visiting the site — bounded only by "no more than 20 solves per interval".
//
//   curl "https://<site>/api/leetcode/refresh?key=$REFRESH_TOKEN"
//
// Authorised by REFRESH_TOKEN (query `key` or `x-refresh-token` header).
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let expected: string | undefined;
  try {
    ({ REFRESH_TOKEN: expected } = await getEnv());
  } catch {
    return NextResponse.json({ error: 'Environment unavailable' }, { status: 500 });
  }

  if (!expected) {
    return NextResponse.json({ error: 'Refresh not configured' }, { status: 503 });
  }

  const provided =
    new URL(request.url).searchParams.get('key') ??
    request.headers.get('x-refresh-token') ??
    '';
  if (!timingSafeEqual(provided, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await refreshAll();
    return NextResponse.json(
      { ok: true, ...result },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
