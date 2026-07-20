/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Enables Cloudflare bindings (and workerd parity) during `next dev`.
// Added by the @opennextjs/cloudflare adapter.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
