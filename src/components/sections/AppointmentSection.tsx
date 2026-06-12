import { FiCalendar, FiClock } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_LINK, CLINIC_TIMINGS } from "@/lib/constants";

export default function AppointmentSection() {
  return (
    <section
      id="appointment"
      className="section-pad bg-green-gradient relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />

      <div className="container-pad relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: Info */}
          <div className="text-white">
            <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
              📅 Easy Appointment
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Book Your{" "}
              <span className="text-saffron-300">Appointment</span>{" "}
              Today
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              Online consultation or clinic visit — choose what suits you. Pay via UPI and get your token number instantly after verification.
            </p>

            {/* Clinic Timings */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-8">
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <FiClock className="w-5 h-5" />
                Clinic Timings
              </h3>
              <div className="space-y-2">
                {CLINIC_TIMINGS.map((t) => (
                  <div
                    key={t.day}
                    className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0"
                  >
                    <span className="text-green-200 text-sm">{t.day}</span>
                    <span className="text-white text-sm font-medium">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20">
              <p className="text-green-100 text-sm mb-3">Prefer instant booking?</p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white font-semibold hover:text-green-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">WhatsApp Us Directly</p>
                  <p className="text-green-200 text-xs font-normal">Quick reply, instant confirmation</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="bg-white rounded-4xl shadow-xl p-6 md:p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Book Your Appointment
              </h3>
              <p className="text-green-600 text-sm leading-relaxed mb-6">
                Choose online or clinic visit, fill your details, and pay via UPI. Your unique token number is generated after payment verification.
              </p>

              {/* How it works */}
              <div className="bg-green-50 rounded-2xl p-4 mb-6 text-left border border-green-100">
                <p className="text-green-700 text-xs font-bold uppercase tracking-wide mb-3">
                  How it works
                </p>
                <div className="space-y-2">
                  {[
                    { step: "1", text: "Choose Online or Clinic Visit" },
                    { step: "2", text: "Fill your details & symptoms" },
                    { step: "3", text: "Pay via UPI & upload screenshot" },
                    { step: "4", text: "Get Token Number after verification" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {s.step}
                      </div>
                      <span className="text-green-700 text-sm">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="/book"
                  className="btn-primary w-full justify-center text-base"
                >
                  <FiCalendar className="w-5 h-5" />
                  Book Appointment Now
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center text-base"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp Booking
                </a>
              </div>
              <p className="text-green-400 text-xs mt-4">
                🔒 Secure · No password needed · Token via email
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
