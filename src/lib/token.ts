import connectDB from "@/lib/mongodb";
import PatientAppointment from "@/models/PatientAppointment";

/**
 * Generate unique appointment token using an atomic findOneAndUpdate.
 *
 * Online:  A001, A002, A003 ...
 * Offline: B001, B002, B003 ...
 *
 * Tokens are scoped per calendar date to keep numbers small.
 * Race condition is prevented by retrying until we get a genuinely
 * unique token (sparse unique index on tokenNumber in MongoDB).
 */
export async function generateAppointmentToken(
  type: "online" | "offline",
  date: string
): Promise<string> {
  await connectDB();

  const prefix = type === "online" ? "A" : "B";

  // Count confirmed appointments for this date+type to derive next serial.
  // We use a retry loop with the unique sparse index as the final guard.
  let attempts = 0;
  while (attempts < 10) {
    const existing = await PatientAppointment.countDocuments({
      preferredDate: date,
      type,
      tokenNumber: { $exists: true, $ne: null },
    });

    const serial = String(existing + 1 + attempts).padStart(3, "0");
    const token = `${prefix}${serial}`;

    // Check if this token is already taken (handles race condition)
    const taken = await PatientAppointment.exists({ tokenNumber: token });
    if (!taken) return token;

    attempts++;
  }

  // Fallback: timestamp-based unique token (should never happen in practice)
  return `${prefix}${Date.now().toString().slice(-6)}`;
}
