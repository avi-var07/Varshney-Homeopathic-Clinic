import { NextRequest, NextResponse } from "next/server";
import { checkPublicRateLimit } from "@/lib/auth";
import { getOtp, clearOtp } from "@/lib/otpStore";
import bcrypt from "bcryptjs";

function isDbConfigured(): boolean {
  const uri = process.env.MONGODB_URI || "";
  return !!uri && !uri.includes("username:password") && uri.startsWith("mongodb");
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkPublicRateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ message: "Too many attempts. Please wait." }, { status: 429 });
  }

  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpInput = otp.trim();

    let userId = "";
    let userName = "";
    let userRole = "patient";
    let verified = false;

    // ── 1. Prefer DB verification (hash compare) when DB is configured ──────
    if (isDbConfigured()) {
      try {
        const { default: connectDB } = await import("@/lib/mongodb");
        const { default: User } = await import("@/models/User");
        await connectDB();

        const user = await User.findOne({ email: normalizedEmail }).select("+otp +otpExpiry");

        if (user && user.otp && user.otpExpiry) {
          if (new Date() > user.otpExpiry) {
            clearOtp(normalizedEmail);
            // Clear expired hash from DB too
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            return NextResponse.json(
              { message: "OTP has expired. Please request a new one." },
              { status: 400 }
            );
          }

          // bcrypt compare — user.otp is a hash, otpInput is the plain 6-digit code
          const isValid = await bcrypt.compare(otpInput, user.otp);
          if (!isValid) {
            return NextResponse.json({ message: "Invalid OTP. Please try again." }, { status: 400 });
          }

          // Valid — clear hash from DB immediately
          user.otp = undefined;
          user.otpExpiry = undefined;
          user.emailVerified = new Date();
          await user.save();

          clearOtp(normalizedEmail); // also clear memory store
          userId = (user._id as { toString(): string }).toString();
          userName = user.name;
          userRole = user.role;
          verified = true;
        }
      } catch (dbErr) {
        console.warn("DB OTP check failed, falling back to memory store:", (dbErr as Error).message);
      }
    }

    // ── 2. Memory fallback (no DB, or DB didn't have the OTP yet) ───────────
    if (!verified) {
      const memRecord = getOtp(normalizedEmail);
      if (!memRecord) {
        return NextResponse.json(
          { message: "No OTP found. Please request a new one." },
          { status: 400 }
        );
      }
      // Memory store holds plain OTP (only lives in process memory, never written to disk)
      if (memRecord.otp !== otpInput) {
        return NextResponse.json({ message: "Invalid OTP. Please try again." }, { status: 400 });
      }
      clearOtp(normalizedEmail);

      userId = "";  // no real ObjectId yet — safe, handled in appointments
      userName = memRecord.name || normalizedEmail.split("@")[0];
      userRole = "patient";
      verified = true;
    }

    // ── 3. Build session cookie ──────────────────────────────────────────────
    const sessionPayload = JSON.stringify({
      id: userId,
      email: normalizedEmail,
      name: userName,
      role: userRole,
      iat: Date.now(),
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: userId, name: userName, email: normalizedEmail, role: userRole },
    });

    response.cookies.set(
      "patient_session",
      Buffer.from(sessionPayload).toString("base64"),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      }
    );

    return response;
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ message: "Verification failed. Please try again." }, { status: 500 });
  }
}
