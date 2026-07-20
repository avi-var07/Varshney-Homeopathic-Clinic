import { Metadata } from "next";
import DoctorLoginClient from "./DoctorLoginClient";

export const metadata: Metadata = {
  title: "Doctor Login | Varshney Homeopathic Clinic",
  robots: "noindex, nofollow",
};

export default function DoctorLoginPage() {
  return <DoctorLoginClient />;
}
