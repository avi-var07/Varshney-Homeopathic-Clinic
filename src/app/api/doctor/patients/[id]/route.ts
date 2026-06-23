import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientProfile from "@/models/PatientProfile";
import PatientAppointment from "@/models/PatientAppointment";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const profile = await PatientProfile.findById(params.id).lean();
    if (!profile) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    // Fetch all appointments for this patient
    const appointments = await PatientAppointment.find({ patientProfileId: params.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ profile, appointments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch patient details." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    
    // Only allow updating medical history fields
    const updateData = {
      allergies: body.allergies,
      existingDiseases: body.existingDiseases,
      medicalHistoryNotes: body.medicalHistoryNotes,
    };

    const profile = await PatientProfile.findByIdAndUpdate(params.id, { $set: updateData }, { new: true }).lean();
    if (!profile) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Patient profile updated successfully", profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update patient profile." }, { status: 500 });
  }
}
