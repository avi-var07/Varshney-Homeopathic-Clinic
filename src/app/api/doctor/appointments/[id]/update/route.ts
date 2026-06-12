import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { isAdminAuthenticated } from "@/lib/auth";
import { sendMeetLinkEmail } from "@/lib/email";

// Doctor can: add meet link, add consultation note, update delivery, complete, cancel
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const appointment = await PatientAppointment.findById(params.id);
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found." }, { status: 404 });
    }

    // ── Meet link ──────────────────────────────────────────────────────────
    if (body.meetLink !== undefined) {
      appointment.meetLink = body.meetLink?.trim() || undefined;

      // Send email with meet link
      if (body.meetLink && process.env.RESEND_API_KEY) {
        sendMeetLinkEmail({
          name: appointment.fullName,
          email: appointment.email,
          tokenNumber: appointment.tokenNumber || "",
          date: appointment.preferredDate,
          time: appointment.preferredTime,
          meetLink: body.meetLink,
        }).catch(() => {});
      }
    }

    // ── Add consultation note ──────────────────────────────────────────────
    if (body.consultationNote) {
      const { advice, medicines, followUpDate, notes } = body.consultationNote;
      if (!advice) {
        return NextResponse.json({ message: "Advice is required." }, { status: 400 });
      }
      appointment.consultationNotes.push({
        advice: advice.trim(),
        medicines: Array.isArray(medicines)
          ? medicines.map((m: string) => m.trim()).filter(Boolean)
          : [],
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        notes: notes?.trim() || undefined,
        meetLink: appointment.meetLink,
        addedAt: new Date(),
      });
    }

    // ── Delivery status ────────────────────────────────────────────────────
    if (body.deliveryStatus !== undefined) {
      const valid = [
        "not_applicable","dispatch_pending","packed",
        "shipped","out_for_delivery","delivered",
      ];
      if (!valid.includes(body.deliveryStatus)) {
        return NextResponse.json({ message: "Invalid delivery status." }, { status: 400 });
      }
      appointment.deliveryStatus = body.deliveryStatus;
      if (body.deliveryNotes) appointment.deliveryNotes = body.deliveryNotes.trim();
      if (body.trackingNumber) appointment.trackingNumber = body.trackingNumber.trim();
    }

    // ── Appointment status ─────────────────────────────────────────────────
    if (body.status !== undefined) {
      const validStatuses = ["confirmed","cancelled","completed","payment_pending","payment_verification_pending"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ message: "Invalid status." }, { status: 400 });
      }
      appointment.status = body.status;
    }

    // ── Doctor notes ───────────────────────────────────────────────────────
    if (body.doctorNotes !== undefined) {
      appointment.doctorNotes = body.doctorNotes?.trim() || undefined;
    }

    await appointment.save();
    return NextResponse.json({ message: "Updated successfully.", appointment });
  } catch (err) {
    console.error("Update appointment error:", err);
    return NextResponse.json({ message: "Update failed." }, { status: 500 });
  }
}
