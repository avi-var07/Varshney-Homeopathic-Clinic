import type { Metadata } from "next";
import PatientDashboardClient from "./PatientDashboardClient";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "View your appointments, prescriptions, and consultation history.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <PatientDashboardClient />;
}
