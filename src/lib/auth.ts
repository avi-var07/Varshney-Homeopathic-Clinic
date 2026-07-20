import { NextRequest } from "next/server";
import crypto from "crypto";

// ─── Constants ────────────────────────────────────────────────────────────────

// The one fixed doctor email — hardcoded as per requirements
export const DOCTOR_EMAIL = "thehomeobytes@gmail.com";

// ─── Doctor Session (OTP-based) ───────────────────────────────────────────────
// Session is HMAC-signed JSON to prevent tampering.

export interface DoctorSession {
  email: string;
  role: "doctor";
  iat: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is required");
  return secret;
}

export function createDoctorSessionToken(email: string): string {
  const payload = JSON.stringify({ email, role: "doctor", iat: Date.now() });
  const b64 = Buffer.from(payload).toString("base64url");
  const secret = getSessionSecret();
  const sig = crypto
    .createHmac("sha256", secret)
    .update(b64)
    .digest("base64url");
  return `${b64}.${sig}`;
}

export function verifyDoctorSessionToken(token: string): DoctorSession | null {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return null;

    const secret = getSessionSecret();
    const expected = crypto
      .createHmac("sha256", secret)
      .update(b64)
      .digest("base64url");

    // Constant-time comparison
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf-8")) as DoctorSession;

    // 7-day expiry
    if (Date.now() - payload.iat > 7 * 24 * 60 * 60 * 1000) return null;

    return payload;
  } catch {
    return null;
  }
}

export function isDoctorAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get("doctor_session")?.value;
  if (!token) return false;
  const session = verifyDoctorSessionToken(token);
  return session !== null && session.role === "doctor";
}

export function getDoctorSession(req: NextRequest): DoctorSession | null {
  const token = req.cookies.get("doctor_session")?.value;
  if (!token) return null;
  return verifyDoctorSessionToken(token);
}

// ─── Patient Session ─────────────────────────────────────────────────────────

export interface PatientSession {
  id: string;
  email: string;
  name: string;
  role: "patient";
  iat: number;
}

export function createPatientSessionToken(data: Omit<PatientSession, "iat">): string {
  const payload = JSON.stringify({ ...data, iat: Date.now() });
  const b64 = Buffer.from(payload).toString("base64url");
  const secret = getSessionSecret();
  const sig = crypto
    .createHmac("sha256", secret)
    .update(b64)
    .digest("base64url");
  return `${b64}.${sig}`;
}

export function verifyPatientSessionToken(token: string): PatientSession | null {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return null;

    const secret = getSessionSecret();
    const expected = crypto
      .createHmac("sha256", secret)
      .update(b64)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf-8")) as PatientSession;

    // 7-day expiry
    if (Date.now() - payload.iat > 7 * 24 * 60 * 60 * 1000) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getPatientSession(req: NextRequest): PatientSession | null {
  const token = req.cookies.get("patient_session")?.value;
  if (!token) return null;
  return verifyPatientSessionToken(token);
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────

interface RateRecord {
  count: number;
  resetAt: number;
}

const publicRateLimits = new Map<string, RateRecord>();
let lastCleanup = Date.now();

function cleanupExpired(map: Map<string, RateRecord>) {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60_000) return;
  lastCleanup = now;
  for (const [key, record] of map) {
    if (now > record.resetAt) map.delete(key);
  }
}

export function checkPublicRateLimit(
  key: string,
  max = 10,
  windowMs = 60_000
): boolean {
  cleanupExpired(publicRateLimits);
  const now = Date.now();
  const record = publicRateLimits.get(key);
  if (!record || now > record.resetAt) {
    publicRateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= max) return false;
  record.count++;
  return true;
}
