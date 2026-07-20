import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { isDoctorAuthenticated, checkPublicRateLimit } from "@/lib/auth";

// GET — admin only (for doctor/admin dashboard)
export async function GET(req: NextRequest) {
  if (!isDoctorAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));

    const [reviews, total] = await Promise.all([
      Review.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Review.countDocuments({}),
    ]);
    return NextResponse.json({ reviews, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ message: "Failed to fetch reviews." }, { status: 500 });
  }
}

// POST — any visitor can submit (no login required)
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkPublicRateLimit(ip, 3, 60_000)) {
    return NextResponse.json({ message: "Too many submissions. Please wait." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, location, problem, rating, text, appointmentId } = body;

    if (!name?.trim()) {
      return NextResponse.json({ message: "Name is required." }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Valid rating (1–5) is required." }, { status: 400 });
    }

    // Save to DB
    try {
      await connectDB();
      await Review.create({
        name: name.trim(),
        location: location?.trim() || undefined,
        problem: problem?.trim() || undefined,
        rating,
        text: text.trim(),
        appointmentId: appointmentId || undefined,
        approved: true, // auto-approve; only visible in doctor dashboard
      });
    } catch {
      // DB save failed — continue to email notification
    }

    // Send email notification to clinic
    try {
      const { notifyClinicNewReview } = await import("@/lib/email");
      await notifyClinicNewReview({ name: name.trim(), location, problem, rating, text: text.trim() });
    } catch {
      // Email failure doesn't block the review submission
    }

    return NextResponse.json({ message: "Review submitted. Thank you!" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to submit review." }, { status: 500 });
  }
}
