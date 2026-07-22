import { cookies } from 'next/headers';
import { getEnv } from '@/lib/server/env';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/server/session';
import { getWeeks } from '@/lib/server/contentStore';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminEditor from '@/components/admin/AdminEditor';

// Reads the session cookie + secrets, so this must run per-request.
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const env = await getEnv();
  const authed = await verifySessionToken(token, env.SESSION_SECRET);

  if (!authed) {
    return <AdminLogin />;
  }

  const weeks = await getWeeks();
  return <AdminEditor initialWeeks={weeks} />;
}
