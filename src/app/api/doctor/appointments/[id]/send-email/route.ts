import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  sendAppointmentConfirmation,
  sendMeetLinkEmail,
  sendAppointmentReminder,
  sendFollowUpReminder,
} from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { type } = await req.json(); // "confirmation" | "meet_link" | "reminder" | "follow_up"

    const appointment = await PatientAppointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    switch (type) {
      case "confirmation":
        await sendAppointmentConfirmation({
          name: appointment.fullName,
          email: appointment.email,
          tokenNumber: appointment.tokenNumber || "",
          type: appointment.type,
          date: appointment.preferredDate,
          time: appointment.preferredTime,
          meetLink: appointment.meetLink,
        });
        return NextResponse.json({ message: "Confirmation email sent to patient." });

      case "meet_link":
        if (!appointment.meetLink) {
          return NextResponse.json({ message: "No meet link set for this appointment." }, { status: 400 });
        }
        await sendMeetLinkEmail({
          name: appointment.fullName,
          email: appointment.email,
          tokenNumber: appointment.tokenNumber || "",
          date: appointment.preferredDate,
          time: appointment.preferredTime,
          meetLink: appointment.meetLink,
        });
        return NextResponse.json({ message: "Google Meet link sent to patient." });

      case "reminder":
        await sendAppointmentReminder({
          name: appointment.fullName,
          email: appointment.email,
          tokenNumber: appointment.tokenNumber || "",
          date: appointment.preferredDate,
          time: appointment.preferredTime,
          type: appointment.type,
        });
        return NextResponse.json({ message: "Appointment reminder sent to patient." });

      case "follow_up": {
        // Find the latest follow-up date from consultation notes
        const notes = appointment.consultationNotes || [];
        const latestFollowUp = notes
          .filter((n: any) => n.followUpDate)
          .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())[0];

        const followUpDate = latestFollowUp?.followUpDate
          ? new Date(latestFollowUp.followUpDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
          : "as advised";

        await sendFollowUpReminder({
          name: appointment.fullName,
          email: appointment.email,
          followUpDate,
        });
        return NextResponse.json({ message: "Follow-up reminder sent to patient." });
      }

      default:
        return NextResponse.json({ message: "Invalid email type." }, { status: 400 });
    }
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json({ message: "Failed to send email." }, { status: 500 });
  }
}
