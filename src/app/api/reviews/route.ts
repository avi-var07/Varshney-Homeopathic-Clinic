import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { getPatientSession, isAdminAuthenticated, checkPublicRateLimit } from "@/lib/auth";

// GET — public approved reviews
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "9"));
    const featured = searchParams.get("featured") === "true";
    const adminView = isAdminAuthenticated(req);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = adminView ? {} : { approved: true };
    if (featured && !adminView) query.featured = true;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    return NextResponse.json({
      reviews,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch reviews." }, { status: 500 });
  }
}

// POST — submit a review (patient login optional but encouraged)
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkPublicRateLimit(ip, 3, 60_000)) {
    return NextResponse.json({ message: "Too many submissions." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, email, location, problem, rating, title, text, appointmentId } = body;

    if (!name || !rating || !text) {
      return NextResponse.json({ message: "Name, rating and review text are required." }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5." }, { status: 400 });
    }
    if (text.trim().length < 10) {
      return NextResponse.json({ message: "Review must be at least 10 characters." }, { status: 400 });
    }

    await connectDB();
    const session = getPatientSession(req);

    const review = await Review.create({
      patientId: session?.id || undefined,
      appointmentId: appointmentId || undefined,
      name: name.trim(),
      email: email?.toLowerCase().trim() || undefined,
      location: location?.trim() || undefined,
      problem: problem?.trim() || undefined,
      rating,
      title: title?.trim() || undefined,
      text: text.trim(),
      approved: false,
    });

    return NextResponse.json(
      { message: "Review submitted! It will be visible after approval.", id: review._id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Failed to submit review." }, { status: 500 });
  }
}
