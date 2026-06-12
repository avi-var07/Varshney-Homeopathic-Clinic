import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { checkPublicRateLimit } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkPublicRateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("screenshot") as File | null;
    const upiTxnId = formData.get("upiTransactionId") as string | null;

    if (!file) {
      return NextResponse.json({ message: "Payment screenshot is required." }, { status: 400 });
    }

    // Validate file type and size (max 5MB)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "Only JPEG, PNG, or WebP images are allowed." }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "File size must be under 5MB." }, { status: 400 });
    }

    await connectDB();

    const appointment = await PatientAppointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found." }, { status: 404 });
    }
    if (appointment.paymentStatus === "payment_approved") {
      return NextResponse.json({ message: "Payment already verified." }, { status: 400 });
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadToCloudinary(buffer, "vhc-payments");

    appointment.paymentScreenshotUrl = url;
    appointment.paymentScreenshotPublicId = publicId;
    appointment.upiTransactionId = upiTxnId?.trim() || undefined;
    appointment.paymentStatus = "payment_verification_pending";
    appointment.status = "payment_verification_pending";
    await appointment.save();

    return NextResponse.json({
      message: "Payment screenshot uploaded. Awaiting doctor verification.",
      paymentStatus: "payment_verification_pending",
    });
  } catch (err) {
    console.error("Upload payment error:", err);
    return NextResponse.json({ message: "Upload failed. Please try again." }, { status: 500 });
  }
}
