"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FiAward,
  FiHeart,
  FiShield,
  FiUsers,
  FiStar,
  FiActivity,
} from "react-icons/fi";
import { FaLeaf, FaHandHoldingHeart, FaUserMd, FaMedal } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

function AnimatedBlock({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline milestones                                                */
/* ------------------------------------------------------------------ */

const milestones = [
  { year: "1992", label: "Established in 1992" },
  { year: "40+", label: "40+ Years of Family Practice" },
  { year: "🏠", label: "Serving Generations of Families" },
  { year: "✨", label: "Legacy Continued Today" },
];

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function DoctorsSection() {
  return (
    <section
      id="our-doctors"
      className="legacy-gradient relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-green-200 rounded-full opacity-10 blur-[100px]" />
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-gold-200 rounded-full opacity-10 blur-[100px]" />

      <div className="container-pad section-pad">
        {/* ============================================================ */}
        {/*  Section Header                                              */}
        {/* ============================================================ */}
        <AnimatedBlock className="text-center mb-16 md:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-5">
            <FaUserMd className="w-4 h-4" />
            Our Doctors
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-950 leading-tight mb-6">
            Two Generations of{" "}
            <span className="text-gradient">Trusted Homeopathic Care</span>
          </h2>
          <p className="section-subtitle mx-auto text-center max-w-3xl">
            Since 1992, the Varshney family has been dedicated to providing
            compassionate and personalized homeopathic treatment. What began with
            Dr.&nbsp;Ravi Prakash Varshney continues today through Dr.&nbsp;Aman
            Varshney, combining decades of trusted experience with modern
            patient-centric healthcare.
          </p>
        </AnimatedBlock>

        {/* ============================================================ */}
        {/*  Legacy Timeline                                             */}
        {/* ============================================================ */}
        <AnimatedBlock className="mb-16 md:mb-24" delay={0.1}>
          <div className="relative flex flex-col items-center">
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-green-300 via-gold-400 to-green-300" />

            <div className="flex flex-col gap-6 sm:gap-8">
              {milestones.map((m, i) => (
                <AnimatedBlock key={m.label} delay={0.15 + i * 0.12}>
                  <div className="flex items-center gap-4 relative">
                    {/* Dot */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 border-white shadow-lg ${
                        i === 0
                          ? "bg-green-600 text-white timeline-dot-pulse"
                          : i === milestones.length - 1
                          ? "bg-gold-500 text-white timeline-dot-pulse"
                          : "bg-white text-green-700 border-green-200"
                      }`}
                    >
                      {m.year}
                    </div>
                    {/* Label */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 border border-green-100 shadow-soft">
                      <p className="text-green-800 font-semibold text-sm sm:text-base">
                        {m.label}
                      </p>
                    </div>
                  </div>
                </AnimatedBlock>
              ))}
            </div>
          </div>
        </AnimatedBlock>

        {/* ============================================================ */}
        {/*  Doctor Card #1 — Dr. Ravi Prakash Varshney (Founder)        */}
        {/* ============================================================ */}
        <AnimatedBlock className="mb-12 md:mb-16" delay={0.15}>
          <div className="bg-white rounded-[2rem] shadow-card border border-green-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Photo */}
              <div className="lg:col-span-2 relative min-h-[320px] sm:min-h-[400px] lg:min-h-0 bg-gradient-to-br from-green-100 to-green-200">
                <Image
                  src="https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270553/vhc-site/Dr-Ravi.jpg"
                  alt="Dr. Ravi Prakash Varshney - Founder, Varshney Homeopathic Clinic"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                {/* Founder badge overlay */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-800/90 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    <FiAward className="w-4 h-4 text-gold-400" />
                    Founder
                  </div>
                </div>
                {/* Experience badge overlay */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gold-500/90 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    <FiStar className="w-4 h-4" />
                    40+ Years Experience
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                {/* Name & Title */}
                <div className="mb-5">
                  <h3 className="text-2xl sm:text-3xl font-bold text-green-950 mb-1">
                    Dr. Ravi Prakash Varshney
                  </h3>
                  <p className="text-green-600 font-medium text-sm sm:text-base">
                    Founder &amp; Senior Homeopathic Physician
                  </p>
                </div>

                {/* Qualifications */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium border border-green-200">
                    🎓 D.H.M.S.
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium border border-green-200">
                    🎓 B.H.M.S.
                  </span>
                </div>

                {/* Description */}
                <p className="text-green-700/80 leading-relaxed text-sm sm:text-base mb-6">
                  For over four decades, Dr.&nbsp;Ravi Prakash Varshney has
                  dedicated his life to holistic healing and individualized
                  patient care. His commitment to homeopathy and compassionate
                  treatment established the foundation of Varshney Homeopathic
                  Clinic. Generations of families have trusted his expertise and
                  guidance.
                </p>

                {/* Professional Contributions */}
                <div className="bg-green-50/70 rounded-2xl p-5 border border-green-100">
                  <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                    <FaMedal className="w-4 h-4 text-gold-500" />
                    Professional Contributions
                  </h4>
                  <ul className="space-y-2.5">
                    {[
                      "Assistant General Secretary, Indian Homeopathic Organisation",
                      "Medical Officer, Gaudiya Math Charitable Dispensary",
                      "Medical Officer, Life Insurance Corporation (LIC)",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-green-700 text-xs sm:text-sm"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiShield className="w-3 h-3 text-white" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </AnimatedBlock>

        {/* ============================================================ */}
        {/*  Legacy Transition                                           */}
        {/* ============================================================ */}
        <AnimatedBlock className="mb-12 md:mb-16" delay={0.1}>
          <div className="flex flex-col items-center text-center">
            {/* Connecting line top */}
            <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-green-200 to-gold-400" />

            {/* Circle node */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-glow mb-5">
              <FaHandHoldingHeart className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-green-950 mb-3">
              A Legacy{" "}
              <span className="text-gradient">Continued</span>
            </h3>
            <p className="section-subtitle mx-auto text-center max-w-2xl text-sm sm:text-base">
              Built on decades of trust, compassion, and patient care, the next
              generation carries forward the same values while embracing modern
              technology and accessible healthcare.
            </p>

            {/* Connecting line bottom */}
            <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-gold-400 to-green-200 mt-5" />
          </div>
        </AnimatedBlock>

        {/* ============================================================ */}
        {/*  Doctor Card #2 — Dr. Aman Varshney (Next Generation)       */}
        {/* ============================================================ */}
        <AnimatedBlock className="mb-16 md:mb-24" delay={0.15}>
          <div className="bg-white rounded-[2rem] shadow-card border border-green-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Content (left on desktop) */}
              <div className="order-2 lg:order-1 lg:col-span-3 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                {/* Name & Title */}
                <div className="mb-5">
                  <h3 className="text-2xl sm:text-3xl font-bold text-green-950 mb-1">
                    Dr. Aman Varshney
                  </h3>
                  <p className="text-green-600 font-medium text-sm sm:text-base">
                    Homeopathic Physician
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-50 text-gold-700 rounded-full text-xs sm:text-sm font-semibold border border-gold-200">
                    ✨ Second Generation Practitioner
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 text-saffron-700 rounded-full text-xs sm:text-sm font-semibold border border-saffron-200">
                    🏆 University Rank Holder
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium border border-green-200">
                    🎓 B.H.M.S. (Bhopal)
                  </span>
                </div>

                {/* Description */}
                <p className="text-green-700/80 leading-relaxed text-sm sm:text-base mb-6">
                  Carrying forward a family legacy established in 1992,
                  Dr.&nbsp;Aman Varshney combines traditional homeopathic
                  principles with modern healthcare practices. His focus is on
                  providing personalized treatment, digital accessibility, and
                  long-term patient care while preserving the values and trust
                  built over generations.
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      icon: FiActivity,
                      label: "Modern Approach",
                      color: "bg-blue-50 text-blue-600",
                    },
                    {
                      icon: FiHeart,
                      label: "Patient-Centric",
                      color: "bg-rose-50 text-rose-600",
                    },
                    {
                      icon: FaLeaf,
                      label: "Natural Healing",
                      color: "bg-green-50 text-green-600",
                    },
                  ].map((h) => (
                    <div
                      key={h.label}
                      className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-green-100 shadow-sm"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${h.color}`}
                      >
                        <h.icon className="w-4 h-4" />
                      </div>
                      <span className="text-green-800 text-xs sm:text-sm font-medium">
                        {h.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo (right on desktop, top on mobile) */}
              <div className="order-1 lg:order-2 lg:col-span-2 relative min-h-[320px] sm:min-h-[400px] lg:min-h-0 bg-gradient-to-br from-green-100 to-green-200">
                <Image
                  src="https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270551/vhc-site/Dr-Aman.jpg"
                  alt="Dr. Aman Varshney - Homeopathic Physician, Varshney Homeopathic Clinic"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                {/* Badge overlay */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-800/90 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    <FiUsers className="w-4 h-4 text-gold-300" />
                    2nd Generation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedBlock>

        {/* ============================================================ */}
        {/*  Trust Banner                                                */}
        {/* ============================================================ */}
        <AnimatedBlock delay={0.1}>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-8 sm:p-10 md:p-14 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full opacity-5 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-400 rounded-full opacity-10 blur-[60px]" />
            <div className="absolute top-6 left-6 text-6xl opacity-5">🌿</div>
            <div className="absolute bottom-6 right-6 text-6xl opacity-5">⚕️</div>

            <div className="relative z-10">
              {/* Gold accent line */}
              <div className="w-16 h-1 bg-gold-400 rounded-full mx-auto mb-6" />

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Trusted Homeopathic Care{" "}
                <span className="text-gold-400">Since 1992</span>
              </h3>
              <p className="text-green-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                More than a clinic, a family tradition of healing — serving
                patients across generations with dedication, compassion, and
                personalized care.
              </p>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  {
                    icon: FiAward,
                    label: "Family Legacy",
                    value: "Since 1992",
                  },
                  {
                    icon: FaUserMd,
                    label: "Experienced Doctors",
                    value: "2 Generations",
                  },
                  {
                    icon: FaLeaf,
                    label: "Natural Medicines",
                    value: "100% Safe",
                  },
                  {
                    icon: FiHeart,
                    label: "Patient Trust",
                    value: "40,000+",
                  },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center mx-auto mb-3">
                      <t.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <p className="text-white font-bold text-sm sm:text-base">
                      {t.value}
                    </p>
                    <p className="text-green-300 text-xs mt-0.5">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedBlock>
      </div>
    </section>
  );
}
