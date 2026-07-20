import { NextRequest, NextResponse } from "next/server";
import { checkPublicRateLimit, DOCTOR_EMAIL, createDoctorSessionToken, createPatientSessionToken } from "@/lib/auth";
import { getOtp, clearOtp } from "@/lib/otpStore";
import bcrypt from "bcryptjs";

function isDbConfigured(): boolean {
  const uri = process.env.MONGODB_URI || "";
  return !!uri && !uri.includes("username:password") && uri.startsWith("mongodb");
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // 10 attempts per minute
  if (!checkPublicRateLimit(`verify:${ip}`, 10, 60_000)) {
    return NextResponse.json(
      { message: "Too many attempts. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpInput = String(otp).trim();
    const isDoctor = normalizedEmail === DOCTOR_EMAIL.toLowerCase().trim();

    let userId = "";
    let userName = isDoctor ? "Dr. Aman Varshney" : "Patient";
    let verified = false;

    // ── 1. DB verification (hash compare) ────────────────────────────────────
    if (isDbConfigured()) {
      try {
        const { default: connectDB } = await import("@/lib/mongodb");
        const { default: User } = await import("@/models/User");
        await connectDB();

        const user = await User.findOne({ email: normalizedEmail }).select(
          "+otp +otpExpiry"
        );

        if (user && user.otp && user.otpExpiry) {
          if (new Date() > user.otpExpiry) {
            // Clear expired OTP
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            clearOtp(normalizedEmail);
            return NextResponse.json(
              { message: "OTP has expired. Please request a new one." },
              { status: 400 }
            );
          }

          const isValid = await bcrypt.compare(otpInput, user.otp);
          if (!isValid) {
            return NextResponse.json(
              { message: "Incorrect OTP. Please try again." },
              { status: 400 }
            );
          }

          // Clear OTP immediately after use
          user.otp = undefined;
          user.otpExpiry = undefined;
          user.emailVerified = new Date();
          await user.save();

          clearOtp(normalizedEmail);
          userId = (user._id as { toString(): string }).toString();
          userName = user.name || userName;
          verified = true;
        }
      } catch (dbErr) {
        console.warn("DB OTP check failed, falling back to memory:", dbErr);
      }
    }

    // ── 2. Memory fallback ────────────────────────────────────────────────────
    if (!verified) {
      const memRecord = getOtp(normalizedEmail);
      if (!memRecord) {
        return NextResponse.json(
          { message: "No OTP found. Please request a new one." },
          { status: 400 }
        );
      }
      if (memRecord.otp !== otpInput) {
        return NextResponse.json(
          { message: "Incorrect OTP. Please try again." },
          { status: 400 }
        );
      }
      clearOtp(normalizedEmail);
      userName = memRecord.name || userName;
      verified = true;
    }

    // ── 3. Issue the right session cookie ─────────────────────────────────────
    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: userId,
        name: userName,
        email: normalizedEmail,
        role: isDoctor ? "doctor" : "patient",
      },
      redirect: isDoctor ? "/doctor" : "/dashboard",
    });

    if (isDoctor) {
      // Doctor gets a dedicated, strongly-signed session
      const token = createDoctorSessionToken(normalizedEmail);
      response.cookies.set("doctor_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      // Clear any stale patient session
      response.cookies.delete("patient_session");
    } else {
      // Patient session
      const token = createPatientSessionToken({
        id: userId,
        email: normalizedEmail,
        name: userName,
        role: "patient",
      });
      response.cookies.set("patient_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
