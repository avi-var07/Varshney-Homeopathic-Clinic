import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/email";
import { checkPublicRateLimit } from "@/lib/auth";
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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkPublicRateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ message: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  try {
    const { email, name } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const displayName = name?.trim() || normalizedEmail.split("@")[0];
    const otp = generateOtp();

    // Always save plain OTP to in-memory store for immediate same-process verification
    setOtp(normalizedEmail, otp, displayName);

    // Persist HASHED OTP to MongoDB — never store plain OTP in DB
    if (isDbConfigured()) {
      try {
        const { default: connectDB } = await import("@/lib/mongodb");
        const { default: User } = await import("@/models/User");
        await connectDB();
        const otpHash = await bcrypt.hash(otp, 10);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const isDoctorEmail =
          process.env.DOCTOR_EMAIL &&
          normalizedEmail === process.env.DOCTOR_EMAIL.toLowerCase().trim();

        await User.findOneAndUpdate(
          { email: normalizedEmail },
          {
            $set: { otp: otpHash, otpExpiry },
            $setOnInsert: {
              name: isDoctorEmail ? "Dr. Aman Varshney" : displayName,
              role: isDoctorEmail ? "doctor" : "patient",
            },
          },
          { upsert: true, returnDocument: "after" }
        );
      } catch {
        // DB save failed — memory store still valid, continue
      }
    }

    // Send OTP email (plain OTP sent to user via email — not stored anywhere plain)
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    const hasResend = !!process.env.RESEND_API_KEY;

    if (hasSmtp || hasResend) {
      await sendOtpEmail(normalizedEmail, otp, displayName);
    } else {
      console.log(`\n📧 ===== DEV MODE OTP =====`);
      console.log(`   Email : ${normalizedEmail}`);
      console.log(`   OTP   : ${otp}`);
      console.log(`   Valid for 10 minutes`);
      console.log(`   (Configure SMTP_* to send real emails)`);
      console.log(`==========================\n`);
    }

    return NextResponse.json({
      message: hasSmtp || hasResend
        ? "OTP sent to your email. Check your inbox."
        : "OTP generated (dev mode — check server terminal).",
      ...(process.env.NODE_ENV === "development" && !hasSmtp && !hasResend
        ? { devOtp: otp }
        : {}),
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ message: "Failed to generate OTP. Please try again." }, { status: 500 });
  }
}
