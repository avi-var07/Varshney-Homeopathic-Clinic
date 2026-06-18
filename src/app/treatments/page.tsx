import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Image from "next/image";
import { TREATMENT_CATEGORIES, CLINIC_NAME } from "@/lib/constants";
import { FiArrowRight } from "react-icons/fi";

export const metadata: Metadata = {
  title: "All Homeopathic Treatments",
  description:
    "Explore all homeopathic treatments at Varshney Homeopathic Clinic - migraine, skin allergy, PCOD, joint pain, hair fall, child health and more in Mughalsarai, Chandauli.",
  keywords: [
    "homeopathic treatments mughalsarai",
    "homeopathy chandauli",
    "migraine homeopathy",
    "skin allergy treatment",
    "PCOD treatment homeopathy",
  ],
};

export default function TreatmentsPage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-14 bg-hero-gradient">
        <div className="container-pad text-center">
          <span className="badge-green mb-4">All Treatments</span>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Gentle Homeopathic{" "}
            <span className="text-gradient">Treatments</span>
          </h1>
          <p className="text-lg text-green-700/70 max-w-2xl mx-auto">
            Safe, natural, and highly effective homeopathic treatments for a wide range of acute and chronic health conditions. No side effects.
          </p>
        </div>
      </section>

      {/* Treatments Grid */}
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {TREATMENT_CATEGORIES.map((treatment) => (
              <Link
                key={treatment.id}
                href={`/treatments/${treatment.id}`}
                className="group bg-white rounded-3xl border border-green-100 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full h-40 mb-5 rounded-2xl overflow-hidden border border-green-100 group-hover:shadow-md transition-all duration-300">
                  <Image
                    src={treatment.image}
                    alt={treatment.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${treatment.color} opacity-40 mix-blend-multiply`}></div>
                </div>

                {/* Content */}
                <h2 className="font-bold text-green-900 text-lg mb-2 group-hover:text-green-700 transition-colors">
                  {treatment.name}
                </h2>
                <p className="text-green-600 text-sm leading-relaxed mb-4 flex-1">
                  {treatment.description}
                </p>

                {/* Symptoms */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {treatment.symptoms.map((s) => (
                    <span
                      key={s}
                      className={`text-xs px-2.5 py-1 rounded-full ${treatment.tagColor}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold group-hover:gap-2 transition-all mt-auto">
                  Learn More & Book
                  <FiArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center bg-green-gradient rounded-4xl p-10 text-white">
            <h2 className="text-3xl font-bold mb-3">
              Can't Find Your Condition?
            </h2>
            <p className="text-green-100 text-lg mb-6">
              Homeopathy treats hundreds of conditions. Contact Dr. Aman Varshney for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/#appointment" className="btn-secondary">
                📅 Book Appointment
              </Link>
              <a
                href="https://wa.me/917388333991?text=Hello%20Doctor%2C%20I%20need%20consultation%20for%20my%20health%20problem."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                💬 WhatsApp Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </main>
  );
}
