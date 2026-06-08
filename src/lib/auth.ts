import { NextRequest } from "next/server";

export function isAdminAuthenticated(req: NextRequest): boolean {
  const session = req.cookies.get("admin_session")?.value;
  if (!session) return false;

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    // Refuse to validate if ADMIN_SECRET is not configured
    return false;
  }

  try {
    const decoded = Buffer.from(session, "base64").toString("utf-8");
    const [user, , secret] = decoded.split(":");
    return (
      user === process.env.ADMIN_USER &&
      secret === adminSecret
    );
  } catch {
    return false;
  }
}

// Rate limiting for public API routes
// Includes periodic cleanup to prevent unbounded memory growth
const publicRateLimits = new Map<string, { count: number; resetAt: number }>();
const CLEANUP_INTERVAL = 5 * 60_000; // 5 minutes
let lastCleanup = Date.now();

function cleanupExpiredEntries(map: Map<string, { count: number; resetAt: number }>) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of map) {
    if (now > record.resetAt) {
      map.delete(key);
    }
  }
}

export function checkPublicRateLimit(
  ip: string,
  max = 10,
  windowMs = 60_000
): boolean {
  cleanupExpiredEntries(publicRateLimits);

  const now = Date.now();
  const record = publicRateLimits.get(ip);

  if (!record || now > record.resetAt) {
    publicRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= max) return false;
  record.count++;
  return true;
}
