import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { isAdminAuthenticated, checkPublicRateLimit } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Rate-limit public submissions: 5 per minute per IP
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
    const { fullName, mobile, age, problem, preferredDate, preferredTime } = body;

    // Validation
    if (!fullName || !mobile || !age || !problem || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Sanitise lengths
    if (fullName.trim().length > 100 || problem.trim().length > 500) {
      return NextResponse.json({ message: "Input too long" }, { status: 400 });
    }

    // Validate mobile
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      return NextResponse.json(
        { message: "Please provide a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    const appointmentData = {
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      age: age.trim(),
      problem: problem.trim(),
      preferredDate,
      preferredTime,
      status: "pending" as const,
    };

    // Try DB first, fall through to Formspree if not configured
    try {
      await connectDB();
      const appointment = await Appointment.create(appointmentData);

      if (process.env.FORMSPREE_ENDPOINT) {
        // Fire-and-forget — don't block response on email
        fetch(process.env.FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `New Appointment – ${fullName}`,
            ...appointmentData,
          }),
        }).catch(() => {}); // swallow email errors
      }

      return NextResponse.json(
        { message: "Appointment booked successfully", id: appointment._id },
        { status: 201 }
      );
    } catch {
      // DB not configured — fall through to Formspree-only mode
      if (process.env.FORMSPREE_ENDPOINT) {
        const res = await fetch(process.env.FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `New Appointment – ${fullName}`,
            ...appointmentData,
          }),
        });
        if (!res.ok) throw new Error("Formspree failed");
        return NextResponse.json(
          { message: "Appointment request sent successfully" },
          { status: 201 }
        );
      }
      throw new Error("No storage or notification method configured");
    }
  } catch (error) {
    console.error("Appointment booking error:", error);
    return NextResponse.json(
      { message: "Failed to book appointment. Please call us directly." },
      { status: 500 }
    );
  }
}

// Protected — admin only
export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status) query.status = status;

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(query),
    ]);

    return NextResponse.json({
      appointments,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
