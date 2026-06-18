"use client";

import { useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { TESTIMONIALS } from "@/lib/constants";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-saffron-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="testimonials" className="section-pad bg-white">
      <div className="container-pad">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="badge-green mb-3">Patient Stories</span>
          <h2 className="section-title mb-4">
            What Our Patients <span className="text-gradient">Say About Us</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Real stories from real patients who found relief through homeopathic treatment at Varshney Clinic.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: "⭐", value: "4.9/5", label: "Average Rating" },
            { icon: "👥", value: "50+", label: "Reviews" },
            { icon: "❤️", value: "40000+", label: "Happy Patients" },
            { icon: "🏅", value: "Since '92", label: "Family Practice" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-5 py-3 bg-green-50 rounded-2xl border border-green-100"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-green-800 font-bold text-lg leading-tight">{item.value}</p>
                <p className="text-green-500 text-xs">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-3xl p-6 border border-green-100 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Quote icon */}
              <FaQuoteLeft className="w-7 h-7 text-green-200 mb-3 flex-shrink-0" />

              {/* Problem badge */}
              <span className="badge-green text-xs mb-3 self-start">
                {testimonial.problem}
              </span>

              {/* Text */}
              <p className="text-green-700 text-sm leading-relaxed mb-4 flex-1">
                "{testimonial.text}"
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-gradient flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-green-900 font-semibold text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-green-500 text-xs">{testimonial.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={testimonial.rating} />
                  <p className="text-green-400 text-xs mt-0.5">{testimonial.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA + Share */}
        <div className="bg-gradient-to-br from-green-50 to-cream-100 rounded-4xl p-8 border border-green-100">
          <p className="text-green-600 text-base mb-2 text-center">🌿 Ready to start your healing journey?</p>
          <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">
            Join Thousands of Happy Patients
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/book" className="btn-primary book-pulse-ring">
              📅 Book Appointment Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
