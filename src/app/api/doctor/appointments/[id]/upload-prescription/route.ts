import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("prescription") as File | null;

    if (!file) {
      return NextResponse.json({ message: "Prescription file is required." }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg","image/jpg","image/png","image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "Only images or PDF allowed." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "File must be under 10MB." }, { status: 400 });
    }

    await connectDB();

    const appointment = await PatientAppointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found." }, { status: 404 });
    }

    const isPdf = file.type === "application/pdf";
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadToCloudinary(
      buffer,
      "vhc-prescriptions",
      isPdf ? "raw" : "image"
    );

    appointment.prescriptions.push({
      type: isPdf ? "pdf" : "image",
      url,
      publicId,
      uploadedAt: new Date(),
    });

    await appointment.save();

    return NextResponse.json({
      message: "Prescription uploaded successfully.",
      prescription: { type: isPdf ? "pdf" : "image", url },
    });
  } catch (err) {
    console.error("Upload prescription error:", err);
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}
