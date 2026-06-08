"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiUser, FiPhone, FiFileText } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_LINK, CLINIC_TIMINGS } from "@/lib/constants";

interface AppointmentFormData {
  fullName: string;
  mobile: string;
  age: string;
  problem: string;
  preferredDate: string;
  preferredTime: string;
}

const timeSlots = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
];

export default function AppointmentSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>();

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        reset();
        toast.success(
          "Appointment request sent! We will contact you shortly to confirm.",
          { duration: 5000 }
        );
      } else {
        throw new Error(result.message || "Failed to book appointment");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try WhatsApp.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="appointment" className="section-pad bg-green-gradient relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>

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
              Simple, quick, and hassle-free. Fill the form and we'll confirm your appointment within minutes.
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

            {/* WhatsApp alternative */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20">
              <p className="text-green-100 text-sm mb-3">
                Prefer instant booking?
              </p>
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

          {/* Right: Form */}
          <div className="bg-white rounded-4xl shadow-xl p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Appointment Requested!
                </h3>
                <p className="text-green-600 leading-relaxed mb-6">
                  Thank you! We have received your appointment request. Dr. Aman Varshney's team will call you within 1 hour to confirm.
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center mb-3"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Confirm via WhatsApp
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-green-600 text-sm hover:text-green-700 font-medium"
                >
                  Book another appointment
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-green-600" />
                  Quick Appointment Form
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                      <input
                        {...register("fullName", {
                          required: "Full name is required",
                          minLength: { value: 2, message: "Name too short" },
                        })}
                        type="text"
                        placeholder="Your full name"
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Mobile & Age */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-green-800 mb-1.5">
                        Mobile <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                        <input
                          {...register("mobile", {
                            required: "Mobile required",
                            pattern: {
                              value: /^[6-9]\d{9}$/,
                              message: "Invalid mobile",
                            },
                          })}
                          type="tel"
                          placeholder="10-digit number"
                          className="input-field pl-10"
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-green-800 mb-1.5">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("age", { required: "Age required" })}
                        type="text"
                        placeholder="Your age"
                        className="input-field"
                      />
                      {errors.age && (
                        <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Problem */}
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Problem / Symptoms <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiFileText className="absolute left-3 top-3 w-4 h-4 text-green-400" />
                      <textarea
                        {...register("problem", {
                          required: "Please describe your problem",
                          minLength: { value: 5, message: "Please provide more detail" },
                        })}
                        placeholder="Briefly describe your health problem or symptoms..."
                        rows={3}
                        className="input-field pl-10 resize-none"
                      />
                    </div>
                    {errors.problem && (
                      <p className="text-red-500 text-xs mt-1">{errors.problem.message}</p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-green-800 mb-1.5">
                        Preferred Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("preferredDate", { required: "Date required" })}
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="input-field"
                      />
                      {errors.preferredDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-green-800 mb-1.5">
                        Preferred Time <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("preferredTime", { required: "Time required" })}
                        className="input-field"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.preferredTime && (
                        <p className="text-red-500 text-xs mt-1">{errors.preferredTime.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Booking...
                      </>
                    ) : (
                      <>
                        <FiCalendar className="w-5 h-5" />
                        Book Appointment
                      </>
                    )}
                  </button>

                  <p className="text-center text-green-500 text-xs">
                    🔒 Your information is safe with us. No spam ever.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
