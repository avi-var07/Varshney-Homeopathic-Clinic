import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";

/**
 * Generate unique token: VHC-YYYY-ONL/OFF-NNN
 * Serial is based on count of appointments for that date + type.
 */
export async function generateAppointmentToken(
  type: "online" | "offline",
  date: string
): Promise<string> {
  await connectDB();

  const year = new Date(date).getFullYear();
  const typeCode = type === "online" ? "ONL" : "OFF";

  // Count existing tokens for this date + type
  const count = await PatientAppointment.countDocuments({
    preferredDate: date,
    type,
    tokenNumber: { $exists: true, $ne: null },
  });

  const serial = String(count + 1).padStart(3, "0");
  const token = `VHC-${year}-${typeCode}-${serial}`;

  return token;
}
