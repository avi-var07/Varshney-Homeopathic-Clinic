import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { isDoctorAuthenticated } from "@/lib/auth";
import { generateAppointmentToken } from "@/lib/token";
import {
  sendAppointmentConfirmation,
  sendPaymentRejectionEmail,
} from "@/lib/email";
import { PERMANENT_MEET_LINK } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isDoctorAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
    return NextResponse.json({ message: "Invalid appointment ID." }, { status: 400 });
  }

  let body: { action?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const { action, reason } = body;

  if (!["approve", "reject"].includes(action ?? "")) {
    return NextResponse.json(
      { message: "Action must be 'approve' or 'reject'." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const appointment = await PatientAppointment.findById(id);
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found." }, { status: 404 });
    }

    // Guard: only approve if actually pending verification
    if (action === "approve" && appointment.paymentStatus === "payment_approved") {
      return NextResponse.json(
        { message: "Payment already approved.", tokenNumber: appointment.tokenNumber },
        { status: 200 }
      );
    }

    if (action === "approve") {
      // Generate token (race-condition safe)
      const token = await generateAppointmentToken(
        appointment.type as "online" | "offline",
        appointment.preferredDate
      );

      // Atomic update — everything or nothing
      const updated = await PatientAppointment.findOneAndUpdate(
        {
          _id: id,
          paymentStatus: { $in: ["payment_verification_pending", "payment_rejected"] },
        },
        {
          $set: {
            tokenNumber: token,
            paymentStatus: "payment_approved",
            status: "confirmed",
            approvedAt: new Date(),
            // For online consultations, attach the permanent Meet link automatically
            ...(appointment.type === "online" ? { meetLink: PERMANENT_MEET_LINK } : {}),
          },
        },
        { new: true }
      );

      if (!updated) {
        // Another request already approved — return success idempotently
        const existing = await PatientAppointment.findById(id);
        return NextResponse.json({
          message: "Payment approved.",
          tokenNumber: existing?.tokenNumber,
        });
      }

      // Await email so serverless environment doesn't kill the background task
      try {
        await sendAppointmentConfirmation({
          name: updated.fullName,
          email: updated.email,
          tokenNumber: token,
          type: updated.type,
          date: updated.preferredDate,
          time: updated.preferredTime,
          meetLink: updated.type === "online" ? PERMANENT_MEET_LINK : undefined,
        });
      } catch (err) {
        console.error("Failed to send confirmation email:", err);
      }

      return NextResponse.json({
        message: "Payment approved. Confirmation email sent to patient.",
        tokenNumber: token,
      });
    }

    // ── Reject ────────────────────────────────────────────────────────────────
    await PatientAppointment.findByIdAndUpdate(id, {
      $set: {
        paymentStatus: "payment_rejected",
        status: "payment_pending",
        paymentRejectionReason:
          reason?.trim() || "Payment could not be verified.",
        paymentScreenshotUrl: undefined,
        paymentScreenshotPublicId: undefined,
      },
    });

    try {
      await sendPaymentRejectionEmail({
        name: appointment.fullName,
        email: appointment.email,
        reason: reason?.trim() || "Payment could not be verified.",
      });
    } catch (err) {
      console.error("Failed to send rejection email:", err);
    }

    return NextResponse.json({
      message: "Payment rejected. Patient has been notified.",
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json(
      { message: "Action failed. Please try again." },
      { status: 500 }
    );
  }
}
