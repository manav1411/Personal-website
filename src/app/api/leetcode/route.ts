import { NextRequest, NextResponse } from 'next/server';
import { getLeetCodeStats, LeetCodeError } from '@/services/leetcode';

// Always run per-request (no static caching) so the response reflects live
// LeetCode data. Runs on the Cloudflare Workers Node.js runtime via OpenNext.
export const dynamic = 'force-dynamic';

const USERNAME_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') ?? '';

  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json(
      { error: 'Invalid username' },
      { status: 400 }
    );
  }

  try {
    const stats = await getLeetCodeStats(username);
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    if (err instanceof LeetCodeError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: 'Unexpected error fetching LeetCode data' },
      { status: 500 }
    );
  }
}
