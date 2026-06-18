import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ReviewForm from "@/components/ReviewForm";
import { CLINIC_NAME, DOCTOR_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Share Your Experience",
  description: `Treated by ${DOCTOR_NAME} at ${CLINIC_NAME}? Share your experience and help other patients.`,
  robots: { index: true, follow: true },
};

export default function SubmitReviewPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-hero-gradient pt-24 pb-20">
        <div className="container-pad max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⭐</span>
            </div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              Share Your Experience
            </h1>
            <p className="text-green-600 leading-relaxed">
              Treated at {CLINIC_NAME}? Share your experience securely with the doctor.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-4xl shadow-card border border-green-100 p-6 md:p-8">
            <ReviewForm />
          </div>

          <p className="text-center text-green-400 text-sm mt-6">
            🔒 Your review is private and shared only with the clinic team.
          </p>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
