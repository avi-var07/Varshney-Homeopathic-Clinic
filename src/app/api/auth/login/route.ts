/**
 * Legacy admin login endpoint — kept for backward compatibility.
 * The primary doctor auth is now OTP-based via /api/auth/send-otp + /api/auth/verify-otp.
 *
 * This endpoint is intentionally disabled in new flow.
 * Doctor should use /doctor/login (OTP only).
 */
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Password login is disabled. Please use the Doctor Login page with OTP authentication.",
    },
    { status: 410 } // 410 Gone
  );
}
