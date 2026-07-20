import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { getPatientSession } from "@/lib/auth";

// POST — submit one complaint entry (can be called multiple times)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getPatientSession(req);
  if (!session) {
    return NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
  }

  const { id } = params;
  if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
    return NextResponse.json({ message: "Invalid appointment ID." }, { status: 400 });
  }

  let body: { organ?: string; symptom?: string; answers?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const { organ, symptom, answers } = body;

  if (!organ || !symptom) {
    return NextResponse.json(
      { message: "Organ and symptom are required." },
      { status: 400 }
    );
  }

  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ message: "Answers are required." }, { status: 400 });
  }

  try {
    await connectDB();

    // Appointment must belong to this patient and be confirmed
    const appt = await PatientAppointment.findOne({
      _id: id,
      email: session.email,
      status: { $in: ["confirmed", "questionnaire_pending", "questionnaire_submitted"] },
    });

    if (!appt) {
      return NextResponse.json(
        {
          message:
            "Appointment not found or not yet confirmed. Please wait for payment approval.",
        },
        { status: 404 }
      );
    }

    // Build complaint entry
    const complaint = {
      organ,
      symptom,
      answers,
      submittedAt: new Date().toISOString(),
    };

    // Append to questionnaireAnswers array (stored as array of complaints)
    const existingAnswers = Array.isArray(appt.questionnaireAnswers)
      ? appt.questionnaireAnswers
      : [];

    await PatientAppointment.findByIdAndUpdate(id, {
      $set: {
        questionnaireAnswers: [...existingAnswers, complaint],
        questionnaireSubmittedAt: new Date(),
        status: "questionnaire_submitted",
      },
    });

    return NextResponse.json({
      message: "Complaint saved successfully.",
    });
  } catch (err) {
    console.error("Submit questionnaire error:", err);
    return NextResponse.json(
      { message: "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}

// GET — return saved complaints for this appointment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getPatientSession(req);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const appt = await PatientAppointment.findOne({
      _id: params.id,
      email: session.email,
    }).select("questionnaireAnswers questionnaireSubmittedAt status");

    if (!appt) {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    return NextResponse.json({
      complaints: appt.questionnaireAnswers ?? [],
      submittedAt: appt.questionnaireSubmittedAt,
      status: appt.status,
    });
  } catch (err) {
    console.error("Get questionnaire error:", err);
    return NextResponse.json({ message: "Failed to load." }, { status: 500 });
  }
}
