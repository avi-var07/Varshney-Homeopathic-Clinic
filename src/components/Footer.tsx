import Link from "next/link";
import {
  CLINIC_NAME,
  DOCTOR_NAME,
  PHONE,
  LOCATION,
  WHATSAPP_LINK,
  CLINIC_TIMINGS,
  TREATMENT_CATEGORIES,
} from "@/lib/constants";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { FiClock, FiMail } from "react-icons/fi";

export default function Footer() {
  const treatments = TREATMENT_CATEGORIES.slice(0, 6);

  return (
    <footer className="bg-green-950 text-white">
      {/* Main Footer */}
      <div className="container-pad py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-tight">
                  Varshney
                </p>
                <p className="text-green-300 text-sm leading-tight">
                  Homeopathic Clinic
                </p>
              </div>
            </Link>
            <p className="text-green-300 text-sm leading-relaxed mb-6">
              Gentle, safe, and effective homeopathic care for your entire family. Serving Mughalsarai and Chandauli with trust and compassion.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center hover:bg-[#1fba59] transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5 text-white" />
              </a>
              <a
                href={`tel:${PHONE}`}
                className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center hover:bg-green-600 transition-colors"
                aria-label="Call us"
              >
                <FaPhone className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-base mb-5">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/#about", label: "About Doctor" },
                { href: "/treatments", label: "All Treatments" },
                { href: "/book", label: "Book Appointment" },
                { href: "/dashboard", label: "My Dashboard" },
                { href: "/blog", label: "Health Blog" },
                { href: "/#gallery", label: "Gallery" },
                { href: "/#contact", label: "Contact Us" },
                { href: "/admin", label: "Admin Panel" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-green-300 text-sm hover:text-green-200 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-green-500 inline-block"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h3 className="font-bold text-white text-base mb-5">Treatments</h3>
            <ul className="space-y-2">
              {treatments.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/treatments/${t.id}`}
                    className="text-green-300 text-sm hover:text-green-200 transition-colors flex items-center gap-2"
                  >
                    <span className="text-base">{t.icon}</span>
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/treatments"
                  className="text-saffron-400 text-sm hover:text-saffron-300 transition-colors font-medium"
                >
                  View All Treatments →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Timings */}
          <div>
            <h3 className="font-bold text-white text-base mb-5">Contact & Timings</h3>
            <div className="space-y-4">
              <a
                href={`tel:${PHONE}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-700 transition-colors">
                  <FaPhone className="w-3.5 h-3.5 text-green-300" />
                </div>
                <div>
                  <p className="text-green-400 text-xs">Call / WhatsApp</p>
                  <p className="text-white text-sm font-medium">{PHONE}</p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaMapMarkerAlt className="w-3.5 h-3.5 text-green-300" />
                </div>
                <div>
                  <p className="text-green-400 text-xs">Location</p>
                  <p className="text-white text-sm">{LOCATION}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiClock className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 text-xs font-medium uppercase tracking-wide">
                    Clinic Timings
                  </p>
                </div>
                {CLINIC_TIMINGS.map((timing) => (
                  <div key={timing.day} className="mb-1">
                    <p className="text-green-300 text-xs">{timing.day}</p>
                    <p className="text-white text-xs">{timing.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-800">
        <div className="container-pad py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-green-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {CLINIC_NAME}. All rights reserved. |{" "}
              {DOCTOR_NAME}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-green-400 text-xs hover:text-green-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-green-400 text-xs hover:text-green-300 transition-colors"
              >
                Terms of Use
              </Link>
              <p className="text-green-600 text-xs">
                Made with ❤️ in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
