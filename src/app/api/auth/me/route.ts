import { NextRequest, NextResponse } from "next/server";
import { getDoctorSession, getPatientSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Check doctor session first
  const doctorSession = getDoctorSession(req);
  if (doctorSession) {
    return NextResponse.json({
      user: {
        email: doctorSession.email,
        name: "Dr. Aman Varshney",
        role: "doctor",
      },
    });
  }

  // Then patient session
  const patientSession = getPatientSession(req);
  if (patientSession) {
    return NextResponse.json({
      user: {
        id: patientSession.id,
        email: patientSession.email,
        name: patientSession.name,
        role: "patient",
      },
    });
  }

  return NextResponse.json({ user: null }, { status: 401 });
}
