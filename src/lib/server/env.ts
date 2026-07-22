// Access to Cloudflare bindings (KV + secrets) from server code. Types are
// declared here so we don't depend on the generated cloudflare-env.d.ts.

import { getCloudflareContext } from '@opennextjs/cloudflare';

/** Minimal subset of the Workers KV API that we use. */
export interface LearnKVNamespace {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface AppEnv {
  LEARN_KV: LearnKVNamespace;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
  // Bearer token that authorises the background solve-refresh endpoint
  // (/api/leetcode/refresh). Set as a Cloudflare secret in production.
  REFRESH_TOKEN?: string;
}

// Async form works both in request handlers and during static contexts.
export async function getEnv(): Promise<AppEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env as unknown as AppEnv;
}
