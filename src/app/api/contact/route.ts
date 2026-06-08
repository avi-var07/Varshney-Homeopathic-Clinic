import { NextRequest, NextResponse } from "next/server";
import { checkPublicRateLimit } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkPublicRateLimit(ip, 5, 60_000)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name, mobile, message } = body;

    if (!name || !mobile || !message) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    if (name.length > 100 || message.length > 1000) {
      return NextResponse.json({ message: "Input too long" }, { status: 400 });
    }

    if (!process.env.FORMSPREE_ENDPOINT) {
      return NextResponse.json(
        { message: "Contact form not configured" },
        { status: 503 }
      );
    }

    const res = await fetch(process.env.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `Contact Form – ${name}`,
        name: name.trim(),
        mobile: mobile.trim(),
        message: message.trim(),
      }),
    });

    if (!res.ok) throw new Error("Formspree request failed");

    return NextResponse.json({ message: "Message sent successfully" });
  } catch {
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
