import { Metadata } from "next";
import DoctorDashboardClient from "./DoctorDashboardClient";

export const metadata: Metadata = {
  title: "Doctor Dashboard | Varshney Homeopathic Clinic",
  robots: "noindex, nofollow",
};

export default function DoctorPage() {
  return <DoctorDashboardClient />;
}
