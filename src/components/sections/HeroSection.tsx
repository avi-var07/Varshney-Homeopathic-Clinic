"use client";

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaStar } from "react-icons/fa";
import { FiCalendar, FiShield, FiHeart } from "react-icons/fi";
import {
  DOCTOR_NAME,
  PHONE,
  WHATSAPP_LINK,
  LOCATION_SHORT,
  DOCTOR_PHOTO,
} from "@/lib/constants";

const trustBadges = [
  { icon: "🏅", text: "Family Practice Since 1992" },
  { icon: "👨‍👩‍👧‍👦", text: "40000+ Patients Treated" },
  { icon: "🌿", text: "100% Natural Medicines" },
  { icon: "✅", text: "No Side Effects" },
  { icon: "💊", text: "Reliable Homeo Pharmacy" },
  { icon: "🏥", text: "Trusted Family Clinic" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden flex items-center pt-20">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full hero-blob" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-saffron-200 rounded-full hero-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-200 rounded-full hero-blob" style={{ animationDelay: "4s" }} />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23166534' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-pad relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12">

          {/* Left: Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6">
              <span>📍</span>
              <span>{LOCATION_SHORT} · Near Varanasi</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-950 leading-[1.1] mb-4">
              Gentle Care for{" "}
              <span className="text-gradient">Your Family's</span>{" "}
              Health
            </h1>

            {/* Tagline */}
            <p className="text-xl text-green-800/80 font-medium mb-3">
              "Healing with Care, Trust & Experience"
            </p>

            <p className="text-base md:text-lg text-green-700/70 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Welcome to <strong className="text-green-800">Varshney Homeopathic Clinic</strong>.{" "}
              <strong>Dr. Aman Varshney</strong> brings compassionate homeopathic healing
              for all ages — safe, natural, and deeply effective.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link href="/#appointment" className="btn-primary text-base px-8 py-4">
                <FiCalendar className="w-5 h-5" />
                Book Appointment
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-base px-8 py-4"
              >
                <FaWhatsapp className="w-5 h-5" />
                WhatsApp Consult
              </a>
              <a href={`tel:${PHONE}`} className="btn-secondary text-base px-8 py-4">
                📞 {PHONE}
              </a>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0">
              {[
                { number: "Since 1992", label: "Family Practice" },
                { number: "40000+", label: "Patients Healed" },
                { number: "100%", label: "Natural Medicines" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 text-center border border-green-100"
                >
                  <p className="text-lg font-bold text-green-700 leading-tight">{stat.number}</p>
                  <p className="text-xs text-green-600 leading-tight mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Doctor Card — self-contained, no overflow badges */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-80 sm:w-96 bg-white rounded-4xl shadow-xl border border-green-100 overflow-hidden">

              {/* Doctor image */}
              <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
                <Image
                  src={DOCTOR_PHOTO}
                  alt={`${DOCTOR_NAME} - Homeopathic Doctor Mughalsarai Chandauli`}
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 640px) 320px, 384px"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 text-4xl opacity-20 pointer-events-none">🌿</div>
              </div>

              {/* Card body */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-saffron-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-green-800">4.9/5</span>
                  <span className="text-xs text-green-500">(500+ reviews)</span>
                </div>

                {/* Qualification pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {["B.H.M.S (Bhopal)", "Thyroid & Diabetes", "Classical Homeopathy", "EMT Advanced"].map(
                    (spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200"
                      >
                        {spec}
                      </span>
                    )
                  )}
                </div>

                {/* Inline trust badges — replaces the overlapping floating ones */}
                <div className="flex gap-2 pt-3 border-t border-green-50">
                  <div className="flex-1 flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FiShield className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-500 leading-none">Certified</p>
                      <p className="text-xs font-bold text-green-800 leading-tight">BHMS Doctor</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-saffron-50 rounded-xl px-3 py-2">
                    <div className="w-7 h-7 rounded-lg bg-saffron-100 flex items-center justify-center flex-shrink-0">
                      <FiHeart className="w-3.5 h-3.5 text-saffron-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-500 leading-none">Since 1992</p>
                      <p className="text-xs font-bold text-green-800 leading-tight">Family Practice</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Marquee */}
        <div className="pb-8 pt-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-green-100 py-4 overflow-hidden">
            <div className="flex animate-marquee" suppressHydrationWarning>
              {[...trustBadges, ...trustBadges].map((badge, i) => (
                <div
                  key={`badge-${i}`}
                  className="flex items-center gap-2 px-8 py-1 border-r border-green-100 flex-shrink-0"
                >
                  <span aria-hidden="true">{badge.icon}</span>
                  <span className="text-sm font-medium text-green-700 whitespace-nowrap">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Treatment Highlights */}
        <div className="pb-12">
          <p className="text-center text-green-600 text-sm font-medium mb-4 uppercase tracking-wide">
            We treat
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Migraine", "Hair Fall", "Skin Allergy", "PCOD/PCOS",
              "Joint Pain", "Thyroid", "Anxiety", "Acidity", "Child Health",
            ].map((t) => (
              <Link
                key={t}
                href={`/treatments/${t.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-")}`}
                className="px-4 py-2 bg-white/80 hover:bg-green-50 text-green-700 rounded-full text-sm border border-green-200 transition-all hover:border-green-400 hover:-translate-y-0.5"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
