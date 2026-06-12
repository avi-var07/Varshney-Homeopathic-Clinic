/**
 * Environment variable validation — imported by server-side code.
 * Fails fast with a clear error if required env vars are missing.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${name}\n` +
        `   See .env.example for the full list of required variables.`
    );
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

// ── Required variables ───────────────────────────────────
export const MONGODB_URI = requireEnv("MONGODB_URI");
export const ADMIN_USER = requireEnv("ADMIN_USER");
export const ADMIN_PASS = requireEnv("ADMIN_PASS");
export const ADMIN_SECRET = requireEnv("ADMIN_SECRET");

// ── Optional variables ───────────────────────────────────
export const FORMSPREE_ENDPOINT = optionalEnv("FORMSPREE_ENDPOINT", "");
export const RESEND_API_KEY = optionalEnv("RESEND_API_KEY", "");
export const RESEND_FROM_EMAIL = optionalEnv("RESEND_FROM_EMAIL", "noreply@varshneyhomoeopathy.com");
export const CLINIC_EMAIL = optionalEnv("CLINIC_EMAIL", "");
export const CLOUDINARY_CLOUD_NAME = optionalEnv("CLOUDINARY_CLOUD_NAME", "");
export const CLOUDINARY_API_KEY = optionalEnv("CLOUDINARY_API_KEY", "");
export const CLOUDINARY_API_SECRET = optionalEnv("CLOUDINARY_API_SECRET", "");
export const APP_URL = optionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
