import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/server/env';
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  timingSafeEqual,
} from '@/lib/server/session';

// Verify the admin password server-side against a secret env var, then hand back
// an HMAC-signed httpOnly cookie. The password itself never reaches the client.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const password =
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).password
      : undefined;

  if (typeof password !== 'string' || password.length === 0) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  const env = await getEnv();
  const expected = env.ADMIN_PASSWORD;
  const secret = env.SESSION_SECRET;

  if (!expected || !secret) {
    return NextResponse.json(
      { error: 'Admin auth is not configured' },
      { status: 500 }
    );
  }

  if (!timingSafeEqual(password, expected)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
