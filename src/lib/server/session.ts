// Admin auth primitives: a constant-time password compare and an HMAC-signed
// session token (Web Crypto, runs on the Workers runtime). The real password
// never leaves the server, and the cookie can't be forged without SESSION_SECRET.

export const ADMIN_COOKIE = 'admin_session';
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const encoder = new TextEncoder();

/** Constant-time string comparison to avoid leaking the password via timing. */
export function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // Compare against a fixed length so we always do the same work.
  const length = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return base64url(new Uint8Array(mac));
}

/** Create a signed `admin.<expiry>.<signature>` token. */
export async function createSessionToken(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin.${exp}`;
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

/** Verify signature, role, and expiry of a session token. */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string | undefined
): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [role, expStr, signature] = parts;
  if (role !== 'admin') return false;

  const expected = await sign(`${role}.${expStr}`, secret);
  if (!timingSafeEqual(signature, expected)) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;

  return true;
}
