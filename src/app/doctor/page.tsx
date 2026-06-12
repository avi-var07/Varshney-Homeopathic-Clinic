import type { Metadata } from "next";
import DoctorDashboardClient from "./DoctorDashboardClient";

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  description: "Manage appointments, prescriptions, and patient records.",
  robots: { index: false, follow: false },
};

export default function DoctorPage() {
  return <DoctorDashboardClient />;
}
