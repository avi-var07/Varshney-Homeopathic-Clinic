import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { getPatientSession, checkPublicRateLimit } from "@/lib/auth";
import { notifyClinicNewAppointment } from "@/lib/email";

// POST — book new appointment (public, patient session optional)
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkPublicRateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const {
      fullName, email, mobile, age, gender,
      address, symptoms, type, preferredDate, preferredTime,
    } = body;

    // Validate required fields
    if (!fullName || !email || !mobile || !age || !gender || !symptoms || !type || !preferredDate || !preferredTime) {
      return NextResponse.json({ message: "All required fields must be filled." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Valid email is required." }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      return NextResponse.json({ message: "Valid 10-digit mobile number required." }, { status: 400 });
    }
    if (!["online", "offline"].includes(type)) {
      return NextResponse.json({ message: "Type must be online or offline." }, { status: 400 });
    }

    await connectDB();

    const session = getPatientSession(req);

    // Only set patientId if it's a valid 24-char hex MongoDB ObjectId
    const isValidObjectId = (id: string) =>
      /^[a-f\d]{24}$/i.test(id);

    const appointment = await PatientAppointment.create({
      patientId: (session?.id && isValidObjectId(session.id))
        ? session.id
        : undefined,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      age: age.trim(),
      gender,
      address: address?.trim(),
      symptoms: symptoms.trim(),
      type,
      preferredDate,
      preferredTime,
      status: "payment_pending",
      paymentStatus: "pending_upload",
      deliveryStatus: "not_applicable",
    });

    // Notify clinic (fire-and-forget — works with SMTP or Resend)
    const hasEmail = !!(
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ||
      process.env.RESEND_API_KEY
    );
    if (hasEmail) {
      notifyClinicNewAppointment({
        name: fullName,
        mobile,
        type,
        date: preferredDate,
        time: preferredTime,
        symptoms,
      }).catch(() => {});
    }

    return NextResponse.json(
      { message: "Appointment request received.", appointmentId: appointment._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Book appointment error:", err);
    return NextResponse.json({ message: "Failed to book appointment." }, { status: 500 });
  }
}

// GET — list patient's own appointments
export async function GET(req: NextRequest) {
  try {
    const session = getPatientSession(req);
    if (!session) {
      return NextResponse.json({ message: "Login required." }, { status: 401 });
    }

    await connectDB();

    const appointments = await PatientAppointment.find({ email: session.email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ appointments });
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch appointments." }, { status: 500 });
  }
}
