import Link from "next/link";
import Image from "next/image";
import { FiCheckCircle, FiAward, FiHeart, FiUsers } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import {
  DOCTOR_NAME,
  WHATSAPP_LINK,
  DOCTOR_QUALIFICATIONS,
  DOCTOR_PHOTO,
} from "@/lib/constants";

const values = [
  {
    icon: FiHeart,
    title: "Patient-First Approach",
    desc: "Every patient is treated as family. We listen completely before prescribing.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: FiCheckCircle,
    title: "Safe & Natural",
    desc: "Only the purest homeopathic medicines — zero side effects, safe for all ages.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: FiAward,
    title: "Evidence-Based Care",
    desc: "Traditional homeopathy combined with modern diagnostic understanding.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FiUsers,
    title: "Family Wellness",
    desc: "From newborns to elderly — we care for your entire family under one roof.",
    color: "bg-saffron-50 text-saffron-600",
  },
];

const specializations = [
  "Skin Disorders",
  "Women's Health (PCOD, Thyroid)",
  "Chronic Diseases",
  "Child Health",
  "Mental Wellness",
  "Joint & Bone Health",
  "Digestive Disorders",
  "Hair & Scalp Issues",
  "Respiratory Allergies",
  "Lifestyle Diseases",
  "Diabetes Management",
  "Thyroid Disorders",
];

export default function AboutSection() {
  return (
    <section id="about" className="section-pad bg-white">
      <div className="container-pad">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="badge-green mb-3">About the Doctor</span>
          <h2 className="section-title mb-4">
            Meet <span className="text-gradient">{DOCTOR_NAME}</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Serving patients through family practice since 1992 — backed by internationally
            recognized qualifications and a deep commitment to compassionate, natural healing
            for families across Mughalsarai, Chandauli, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Doctor profile */}
          <div>
            {/* Doctor Photo Card */}
            <div className="bg-gradient-to-br from-green-50 to-cream-100 rounded-4xl p-6 mb-8 relative overflow-hidden border border-green-100">
              <div className="absolute top-4 right-4 text-5xl opacity-10">🌿</div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Photo */}
                <div className="relative w-36 h-44 rounded-3xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                  <Image
                    src={DOCTOR_PHOTO}
                    alt={`${DOCTOR_NAME} - Homeopathic Doctor Mughalsarai`}
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="144px"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-900 mb-0.5">
                    {DOCTOR_NAME}
                  </h3>
                  <p className="text-green-600 font-medium text-sm mb-4">
                    Homeopathic Physician · Mughalsarai, UP
                  </p>

                  {/* Qualifications */}
                  <div className="space-y-2.5">
                    {DOCTOR_QUALIFICATIONS.map((q) => (
                      <div key={q.degree} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiCheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="text-green-900 text-sm font-semibold leading-tight">
                            {q.degree}
                          </p>
                          <p className="text-green-500 text-xs leading-tight">
                            {q.institution}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Credential badges */}
              <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-green-200/50">
                <span className="badge-green text-xs">🏅 B.H.M.S (Bhopal)</span>
                <span className="badge-saffron text-xs">🏆 University Rank Holder</span>
                <span className="badge-green text-xs">🌎 Yoga University, America</span>
                <span className="badge-green text-xs">🚑 EMT Advanced (NSDC)</span>
              </div>
            </div>

            {/* Doctor's quote */}
            <div className="bg-green-50 rounded-3xl p-6 border border-green-100 mb-6 relative">
              <div className="absolute top-4 right-4 text-green-200 text-5xl font-serif leading-none">
                "
              </div>
              <p className="text-green-800 text-base leading-relaxed italic mb-3">
                I believe that every individual deserves gentle, personalized care. Homeopathy treats the whole person — not just the disease. My goal is to help your body heal naturally and restore balance from within.
              </p>
              <p className="text-green-700 font-semibold text-sm">— {DOCTOR_NAME}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/#appointment" className="btn-primary flex-1 justify-center">
                📅 Book Consultation
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1 justify-center"
              >
                <FaWhatsapp className="w-5 h-5" />
                Chat with Doctor
              </a>
            </div>
          </div>

          {/* Right: Values & Specializations */}
          <div>
            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-3xl p-5 border border-green-100 shadow-card hover:shadow-soft transition-all hover:-translate-y-0.5"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${v.color}`}
                  >
                    <v.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-green-900 text-sm mb-1">{v.title}</h4>
                  <p className="text-green-600 text-xs leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>

            {/* Specializations */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-3xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>⚕️</span> Areas of Specialization
              </h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-green-100 rounded-full text-sm border border-white/10 transition-colors cursor-default"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                {[
                  { n: "1992", l: "Est. Year" },
                  { n: "40000+", l: "Patients" },
                  { n: "100%", l: "Natural" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-2xl font-bold text-saffron-300">{s.n}</p>
                    <p className="text-green-300 text-xs">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
