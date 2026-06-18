import Link from "next/link";
import { FiCalendar, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_LINK } from "@/lib/constants";

interface AppointmentCTAProps {
  heading?: string;
  subtext?: string;
  variant?: "green" | "white" | "soft";
  showWhatsApp?: boolean;
}

export default function AppointmentCTA({
  heading = "Start Your Healing Journey Today",
  subtext = "Book a consultation with Dr. Aman Varshney. Safe, natural, and effective homeopathic care.",
  variant = "green",
  showWhatsApp = true,
}: AppointmentCTAProps) {
  const isGreen = variant === "green";
  const isSoft  = variant === "soft";

  return (
    <div className={`rounded-4xl p-8 md:p-10 text-center relative overflow-hidden ${
      isGreen ? "bg-green-gradient text-white"
      : isSoft ? "bg-gradient-to-br from-green-50 to-cream-100 border border-green-100"
      : "bg-white border border-green-100 shadow-card"
    }`}>
      {/* Decorative */}
      {isGreen && (
        <>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </>
      )}

      <div className="relative z-10">
        {/* Pill */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${
          isGreen ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
        }`}>
          <FiCalendar className="w-4 h-4" />
          Book Appointment
        </div>

        <h3 className={`text-2xl md:text-3xl font-bold mb-3 leading-tight ${
          isGreen ? "text-white" : "text-green-900"
        }`}>
          {heading}
        </h3>

        <p className={`text-base mb-6 max-w-xl mx-auto leading-relaxed ${
          isGreen ? "text-green-100" : "text-green-600"
        }`}>
          {subtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/book"
            className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 ${
              isGreen
                ? "bg-white text-green-700 hover:bg-green-50 shadow-soft"
                : "bg-green-gradient text-white shadow-soft hover:shadow-glow"
            }`}
          >
            <FiCalendar className="w-5 h-5" />
            Book Your Consultation
          </Link>

          {showWhatsApp && (
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base bg-[#25D366] text-white hover:bg-[#1fba59] transition-all hover:-translate-y-0.5"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
