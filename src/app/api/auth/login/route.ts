import { NextRequest, NextResponse } from "next/server";

// Rate limiting — simple in-memory store (sufficient for single-instance)
// Includes periodic cleanup to prevent unbounded memory growth
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL = 5 * 60_000; // 5 minutes
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of attempts) {
    if (now > record.resetAt) {
      attempts.delete(key);
    }
  }
}

function getRateLimit(ip: string): boolean {
  cleanupExpiredEntries();

  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true; // allowed
  }

  if (record.count >= MAX_ATTEMPTS) return false; // blocked

  record.count++;
  return true; // allowed
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!getRateLimit(ip)) {
    return NextResponse.json(
      { message: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await req.json();

    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminUser || !adminPass || !adminSecret) {
      console.error("ADMIN_USER, ADMIN_PASS, or ADMIN_SECRET env vars not set");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    if (username === adminUser && password === adminPass) {
      // Create a signed session token
      const token = Buffer.from(
        `${adminUser}:${Date.now()}:${adminSecret}`
      ).toString("base64");

      const response = NextResponse.json({ success: true });

      // Set httpOnly cookie — not accessible by JS
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8, // 8 hours
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

