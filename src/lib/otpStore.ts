/**
 * Global in-memory OTP store.
 * Used as fallback when MongoDB is not yet configured.
 * Attached to `global` so it persists across Next.js hot-reloads in dev.
 */

interface OtpRecord {
  otp: string;
  expiry: number;
  name?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpRecord> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map<string, OtpRecord>();
}

export const otpStore = global.__otpStore;

export function setOtp(email: string, otp: string, name?: string): void {
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email, { otp, expiry, name });
}

export function getOtp(email: string): OtpRecord | undefined {
  const record = otpStore.get(email);
  if (!record) return undefined;
  if (Date.now() > record.expiry) {
    otpStore.delete(email);
    return undefined;
  }
  return record;
}

export function clearOtp(email: string): void {
  otpStore.delete(email);
}
