/**
 * Centralized site configuration for SEO and metadata.
 *
 * The production URL is resolved in this order:
 *   1. NEXT_PUBLIC_SITE_URL environment variable (if set)
 *   2. Vercel production URL (auto-set by Vercel)
 *   3. Hardcoded fallback
 *
 * TODO: Once you set a custom domain in Vercel (or elsewhere),
 *       add NEXT_PUBLIC_SITE_URL=https://yourdomain.com to your
 *       environment variables so every SEO reference picks it up.
 */

function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // Fallback — update this if your production domain changes
  return "https://varshneyhomeopathicclinic.vercel.app";
}

/** Canonical production base URL (no trailing slash). */
export const BASE_URL = resolveBaseUrl();
