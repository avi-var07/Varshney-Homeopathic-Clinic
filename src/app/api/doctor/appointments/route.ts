import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const date = searchParams.get("date");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (date) query.preferredDate = date;

    const [appointments, total] = await Promise.all([
      PatientAppointment.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      PatientAppointment.countDocuments(query),
    ]);

    // Summary stats
    const [pending, todayCount, pendingPayment] = await Promise.all([
      PatientAppointment.countDocuments({ status: "confirmed" }),
      PatientAppointment.countDocuments({
        preferredDate: new Date().toISOString().split("T")[0],
      }),
      PatientAppointment.countDocuments({ paymentStatus: "payment_verification_pending" }),
    ]);

    return NextResponse.json({
      appointments,
      pagination: { total, page, pages: Math.ceil(total / limit) },
      stats: { pending, todayCount, pendingPayment, total },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch." }, { status: 500 });
  }
}
