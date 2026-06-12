import { NextRequest } from "next/server";

// ─── Admin Auth ──────────────────────────────────────────────────────────────

export function isAdminAuthenticated(req: NextRequest): boolean {
  const session = req.cookies.get("admin_session")?.value;
  if (!session) return false;

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;

  try {
    const decoded = Buffer.from(session, "base64").toString("utf-8");
    const [user, , secret] = decoded.split(":");
    return user === process.env.ADMIN_USER && secret === adminSecret;
  } catch {
    return false;
  }
}

// ─── Patient Auth ────────────────────────────────────────────────────────────

export interface PatientSession {
  id: string;
  email: string;
  name: string;
  role: string;
  iat: number;
}

export function getPatientSession(req: NextRequest): PatientSession | null {
  const token = req.cookies.get("patient_session")?.value;
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const session = JSON.parse(decoded) as PatientSession;
    // Token valid for 7 days
    if (Date.now() - session.iat > 7 * 24 * 60 * 60 * 1000) return null;
    return session;
  } catch {
    return null;
  }
}

export function requirePatientSession(req: NextRequest): PatientSession {
  const session = getPatientSession(req);
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────

const publicRateLimits = new Map<string, { count: number; resetAt: number }>();
const CLEANUP_INTERVAL = 5 * 60_000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(map: Map<string, { count: number; resetAt: number }>) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, record] of map) {
    if (now > record.resetAt) map.delete(key);
  }
}

export function checkPublicRateLimit(ip: string, max = 10, windowMs = 60_000): boolean {
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
