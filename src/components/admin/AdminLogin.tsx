'use client';

// Password gate for /admin. The value is POSTed to the server, which compares it
// against a secret and sets a signed cookie — nothing sensitive is stored here.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPassword('');
        router.refresh();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? 'Login failed');
      }
    } catch {
      setError('Network error — try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-sm mt-32">
        <div className="flex items-center gap-2 mb-6">
          <Lock size={22} className="text-blue-500" />
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="text-sm text-neutral-600 dark:text-neutral-400">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="px-3 py-2 text-sm rounded-md border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-500"
          />
          {error && (
            <p className="text-sm text-rose-500" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm border rounded-md bg-blue-500 text-white border-blue-500 hover:bg-blue-600 disabled:opacity-40"
          >
            {loading ? 'Checking…' : 'Unlock'}
          </button>
        </form>
      </div>
    </main>
  );
}
