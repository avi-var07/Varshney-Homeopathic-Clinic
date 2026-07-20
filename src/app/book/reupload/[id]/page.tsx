import { Metadata } from "next";
import ReuploadClient from "./ReuploadClient";

export const metadata: Metadata = {
  title: "Resubmit Payment | Varshney Homeopathic Clinic",
  robots: "noindex",
};

export default function ReuploadPage({ params }: { params: { id: string } }) {
  return <ReuploadClient appointmentId={params.id} />;
}
