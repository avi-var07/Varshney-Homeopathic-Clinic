import type { Metadata } from "next";
import BookAppointmentClient from "./BookAppointmentClient";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book an online or offline homeopathic consultation at Varshney Homeopathic Clinic, Mughalsarai. Choose your preferred date, time and pay securely via UPI.",
};

export default function BookPage() {
  return <BookAppointmentClient />;
}
