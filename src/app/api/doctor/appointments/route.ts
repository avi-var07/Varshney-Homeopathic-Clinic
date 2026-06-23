import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";
import PatientProfile from "@/models/PatientProfile";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";
    const date = searchParams.get("date");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    const todayStr = new Date().toISOString().split("T")[0];

    // Filter Logic
    if (filter === "today") {
      query.preferredDate = todayStr;
    } else if (filter === "upcoming") {
      query.preferredDate = { $gt: todayStr };
      query.status = { $ne: "cancelled" };
    } else if (filter === "completed") {
      query.status = "completed";
    } else if (filter === "cancelled") {
      query.status = "cancelled";
    } else if (filter === "online") {
      query.type = "online";
    } else if (filter === "offline") {
      query.type = "offline";
    } else if (filter === "payment_verification_pending") {
      query.paymentStatus = "payment_verification_pending";
    } else if (filter === "confirmed") {
      query.status = "confirmed";
    }

    if (date) query.preferredDate = date;

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { tokenNumber: { $regex: search, $options: "i" } },
      ];
    }

    const [appointments, total] = await Promise.all([
      PatientAppointment.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      PatientAppointment.countDocuments(query),
    ]);

    // Statistics queries
    const [
      todayTotal,
      todayOnline,
      todayOffline,
      pendingPaymentVerifications,
      todayConfirmed,
      todayCompleted,
      totalActivePatients,
      totalConsultations,
    ] = await Promise.all([
      PatientAppointment.countDocuments({ preferredDate: todayStr }),
      PatientAppointment.countDocuments({ preferredDate: todayStr, type: "online" }),
      PatientAppointment.countDocuments({ preferredDate: todayStr, type: "offline" }),
      PatientAppointment.countDocuments({ paymentStatus: "payment_verification_pending" }),
      PatientAppointment.countDocuments({ preferredDate: todayStr, status: "confirmed" }),
      PatientAppointment.countDocuments({ preferredDate: todayStr, status: "completed" }),
      PatientProfile.countDocuments(),
      PatientAppointment.countDocuments({ status: { $ne: "cancelled" } }),
    ]);

    return NextResponse.json({
      appointments,
      pagination: { total, page, pages: Math.ceil(total / limit) },
      stats: {
        todayTotal,
        todayOnline,
        todayOffline,
        pendingPaymentVerifications,
        todayConfirmed,
        todayCompleted,
        totalActivePatients,
        totalConsultations,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch." }, { status: 500 });
  }
}
