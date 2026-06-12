import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateAppointmentToken } from "@/lib/token";
import {
  sendAppointmentConfirmation,
  sendPaymentRejectionEmail,
} from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, reason } = await req.json(); // action: "approve" | "reject"

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ message: "Action must be approve or reject." }, { status: 400 });
    }

    await connectDB();

    const appointment = await PatientAppointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found." }, { status: 404 });
    }

    if (action === "approve") {
      // Generate token
      const token = await generateAppointmentToken(
        appointment.type,
        appointment.preferredDate
      );

      appointment.tokenNumber = token;
      appointment.paymentStatus = "payment_approved";
      appointment.status = "confirmed";
      await appointment.save();

      // Send confirmation email (fire-and-forget)
      if (process.env.RESEND_API_KEY) {
        sendAppointmentConfirmation({
          name: appointment.fullName,
          email: appointment.email,
          tokenNumber: token,
          type: appointment.type,
          date: appointment.preferredDate,
          time: appointment.preferredTime,
          meetLink: appointment.meetLink,
        }).catch(() => {});
      }

      return NextResponse.json({
        message: "Payment approved. Appointment confirmed.",
        tokenNumber: token,
      });
    } else {
      appointment.paymentStatus = "payment_rejected";
      appointment.status = "payment_pending";
      appointment.paymentRejectionReason = reason?.trim() || "Payment could not be verified.";
      // Clear screenshot so patient can re-upload
      appointment.paymentScreenshotUrl = undefined;
      appointment.paymentScreenshotPublicId = undefined;
      await appointment.save();

      if (process.env.RESEND_API_KEY) {
        sendPaymentRejectionEmail({
          name: appointment.fullName,
          email: appointment.email,
          reason: appointment.paymentRejectionReason,
        }).catch(() => {});
      }

      return NextResponse.json({ message: "Payment rejected. Patient notified." });
    }
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ message: "Action failed." }, { status: 500 });
  }
}
