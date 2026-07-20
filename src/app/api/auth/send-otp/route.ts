import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/email";
import { checkPublicRateLimit, DOCTOR_EMAIL } from "@/lib/auth";
import { setOtp } from "@/lib/otpStore";
import bcrypt from "bcryptjs";

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isDbConfigured(): boolean {
  const uri = process.env.MONGODB_URI || "";
  return !!uri && !uri.includes("username:password") && uri.startsWith("mongodb");
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Strict rate limit: 5 OTP requests per minute per IP
  if (!checkPublicRateLimit(`otp:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { message: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Determine role — doctor email is hardcoded
    const isDoctor =
      normalizedEmail === DOCTOR_EMAIL.toLowerCase().trim();

    const displayName = isDoctor ? "Dr. Aman Varshney" : "Patient";
    const otp = generateOtp();

    // Save to in-memory store (immediate, works without DB)
    setOtp(normalizedEmail, otp, displayName);

    // Persist bcrypt-hashed OTP to MongoDB (async, best-effort)
    if (isDbConfigured()) {
      (async () => {
        try {
          const { default: connectDB } = await import("@/lib/mongodb");
          const { default: User } = await import("@/models/User");
          await connectDB();
          const otpHash = await bcrypt.hash(otp, 10);
          const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

          await User.findOneAndUpdate(
            { email: normalizedEmail },
            {
              $set: { otp: otpHash, otpExpiry },
              $setOnInsert: {
                name: displayName,
                role: isDoctor ? "doctor" : "patient",
              },
            },
            { upsert: true }
          );
        } catch {
          // Memory store is still valid — continue
        }
      })();
    }

    // Send OTP email
    const hasEmail = !!(
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ||
      process.env.RESEND_API_KEY
    );

    if (hasEmail) {
      await sendOtpEmail(normalizedEmail, otp, displayName);
    } else {
      // Dev mode — log to console
      console.log(`\n📧 ===== DEV OTP =====`);
      console.log(`   Email : ${normalizedEmail}`);
      console.log(`   OTP   : ${otp}`);
      console.log(`   Role  : ${isDoctor ? "doctor" : "patient"}`);
      console.log(`   Valid : 5 minutes`);
      console.log(`=====================\n`);
    }

    return NextResponse.json({
      message: hasEmail
        ? "OTP sent to your email. Check your inbox (and spam folder)."
        : "OTP generated (dev mode — check server terminal).",
      // Expose OTP in dev mode only when email isn't configured
      ...(process.env.NODE_ENV === "development" && !hasEmail
        ? { devOtp: otp }
        : {}),
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json(
      { message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
