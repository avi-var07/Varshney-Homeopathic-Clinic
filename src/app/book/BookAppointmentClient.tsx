"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { FiCalendar, FiUser, FiPhone, FiFileText, FiCheck, FiUpload, FiCopy } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { CLINIC_NAME, PHONE, WHATSAPP_LINK, UPI_ID, CONSULTATION_FEE_ONLINE, CONSULTATION_FEE_OFFLINE } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

type Step = 1 | 2 | 3 | 4; // 1=type, 2=details, 3=payment, 4=success

interface FormData {
  fullName: string;
  email: string;
  mobile: string;
  age: string;
  gender: "male" | "female" | "other";
  address: string;
  symptoms: string;
  preferredDate: string;
  preferredTime: string;
}


const timeSlots = [
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM",
  "4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM",
];

export default function BookAppointmentClient() {
  const { user, openLogin } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<"online" | "offline">("offline");
  const [appointmentId, setAppointmentId] = useState<string>("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register, handleSubmit, formState: { errors, isSubmitting }, setValue,
  } = useForm<FormData>();

  // Pre-fill email from logged-in user session
  useEffect(() => {
    if (user?.email) setValue("email", user.email);
    if (user?.name) setValue("fullName", user.name);
  }, [user, setValue]);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Step 2 → API → Step 3
  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type }),
      });
      const result = await res.json();
      if (res.status === 401) {
        toast.error("Session expired. Please log in to continue.");
        openLogin("reauth");
        return;
      }
      if (!res.ok) throw new Error(result.message);
      setAppointmentId(result.appointmentId);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Booking failed. Please try again.");
    }
  };

  // Step 3 — upload payment proof
  const uploadPayment = async () => {
    if (!paymentFile) { toast.error("Please select a payment screenshot."); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("screenshot", paymentFile);
      if (upiTxnId) fd.append("upiTransactionId", upiTxnId);

      const res = await fetch(
        `/api/patient/appointments/${appointmentId}/upload-payment`,
        { method: "POST", body: fd }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success("Payment submitted! Awaiting verification.");
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const fee = type === "online" ? CONSULTATION_FEE_ONLINE : CONSULTATION_FEE_OFFLINE;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-hero-gradient pt-24 pb-20">
        <div className="container-pad max-w-2xl">

          {/* Progress bar */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {["Choose Type", "Your Details", "Make Payment"].map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > i + 1 ? "bg-green-600 text-white"
                      : step === i + 1 ? "bg-green-gradient text-white shadow-glow"
                      : "bg-white border-2 border-green-200 text-green-400"
                    }`}>
                      {step > i + 1 ? <FiCheck className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`hidden sm:block text-xs font-medium ${step === i + 1 ? "text-green-700" : "text-green-400"}`}>
                      {label}
                    </span>
                    {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? "bg-green-500" : "bg-green-200"}`} style={{ width: "40px" }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: Choose type ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="bg-white rounded-4xl shadow-card p-6 md:p-8 border border-green-100">
              <h1 className="text-2xl font-bold text-green-900 mb-2">Book an Appointment</h1>
              <p className="text-green-600 text-sm mb-8">Choose your consultation type to get started.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {(["offline", "online"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-3xl p-6 border-2 text-left transition-all ${
                      type === t
                        ? "border-green-500 bg-green-50 shadow-glow"
                        : "border-green-200 bg-white hover:border-green-300 hover:bg-green-50/50"
                    }`}
                  >
                    <div className="text-4xl mb-3">{t === "offline" ? "🏥" : "💻"}</div>
                    <h3 className="font-bold text-green-900 text-base mb-1">
                      {t === "offline" ? "Visit Clinic" : "Online Consultation"}
                    </h3>
                    <p className="text-green-600 text-xs mb-3">
                      {t === "offline"
                        ? "Come to Varshney Clinic at your preferred time."
                        : "Consult Dr. Aman via Google Meet from home."}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-700">
                        {t === "online" ? CONSULTATION_FEE_ONLINE : CONSULTATION_FEE_OFFLINE}
                      </span>
                      {type === t && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* What to expect */}
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100 mb-6">
                <p className="text-green-800 font-semibold text-sm mb-2">
                  {type === "offline" ? "🏥 Visiting Clinic?" : "💻 Online Consultation?"}
                </p>
                <ul className="space-y-1">
                  {(type === "offline" ? [
                    "Come with your token number on the appointment day",
                    "Doctor will examine you in person",
                    "Medicines available at Reliable Homeo Pharmacy",
                  ] : [
                    "Google Meet link sent after booking confirmation",
                    "Medicines shipped to your address after consultation",
                    "Prescription uploaded to your patient dashboard",
                  ]).map((point) => (
                    <li key={point} className="flex items-start gap-2 text-green-700 text-xs">
                      <FiCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full justify-center">
                Continue <FiCheck className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Patient details form ────────────────────────────── */}
          {step === 2 && (
            <div className="bg-white rounded-4xl shadow-card p-6 md:p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-xl font-bold text-green-900">Your Details</h2>
                  <p className="text-green-500 text-xs">
                    {type === "online" ? "💻 Online Consultation" : "🏥 Clinic Visit"} · {fee}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Logged-in user banner */}
                {user && (
                  <div className="bg-green-50 rounded-2xl p-3 border border-green-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-green-800 font-semibold text-sm leading-none">{user.name}</p>
                      <p className="text-green-500 text-xs mt-0.5 truncate">{user.email}</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full flex-shrink-0">
                      ✓ Signed in
                    </span>
                  </div>
                )}
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input {...register("fullName", { required: "Full name is required" })}
                      placeholder="Your full name" className="input-field pl-10" />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
                  })} type="email" placeholder="you@example.com" className="input-field" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Mobile + Age row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                      <input {...register("mobile", {
                        required: "Mobile required",
                        pattern: { value: /^[6-9]\d{9}$/, message: "Invalid mobile" }
                      })} type="tel" placeholder="10-digit" className="input-field pl-10" />
                    </div>
                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input {...register("age", { required: "Age required" })}
                      placeholder="Your age" className="input-field" />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["male", "female", "other"] as const).map((g) => (
                      <label key={g} className="relative">
                        <input {...register("gender", { required: "Gender required" })}
                          type="radio" value={g} className="sr-only peer" />
                        <div className="peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 border-2 border-green-200 rounded-xl px-3 py-2 text-center text-sm font-medium text-green-600 cursor-pointer hover:border-green-300 transition-all capitalize">
                          {g}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>

                {/* Address (online only) */}
                {type === "online" && (
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea {...register("address", { required: type === "online" ? "Address required for medicine delivery" : false })}
                      placeholder="Full address for medicine delivery..." rows={2}
                      className="input-field resize-none" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                )}

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">
                    Symptoms / Problem <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3 w-4 h-4 text-green-400" />
                    <textarea {...register("symptoms", {
                      required: "Symptoms required",
                      minLength: { value: 5, message: "Please describe in more detail" }
                    })} placeholder="Describe your symptoms..." rows={3}
                      className="input-field pl-10 resize-none" />
                  </div>
                  {errors.symptoms && <p className="text-red-500 text-xs mt-1">{errors.symptoms.message}</p>}
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input {...register("preferredDate", { required: "Date required" })}
                      type="date" min={new Date().toISOString().split("T")[0]} className="input-field" />
                    {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <select {...register("preferredTime", { required: "Time required" })} className="input-field">
                      <option value="">Select</option>
                      {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime.message}</p>}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="btn-primary w-full justify-center disabled:opacity-60">
                  {isSubmitting
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <FiCalendar className="w-4 h-4" />}
                  {isSubmitting ? "Processing…" : "Continue to Payment"}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 3: Payment ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="bg-white rounded-4xl shadow-card p-6 md:p-8 border border-green-100">
              <h2 className="text-xl font-bold text-green-900 mb-1">Make Payment</h2>
              <p className="text-green-500 text-sm mb-6">
                Pay {fee} via UPI and upload the screenshot below.
              </p>

              {/* UPI Details */}
              <div className="bg-green-50 rounded-3xl p-5 border border-green-200 mb-6">
                <p className="text-green-700 font-semibold text-sm mb-3 flex items-center gap-2">
                  💳 UPI Payment Details
                </p>
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-green-200">
                  <div>
                    <p className="text-green-500 text-xs">UPI ID</p>
                    <p className="text-green-900 font-bold text-base">{UPI_ID}</p>
                  </div>
                  <button onClick={copyUpi}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-xs font-medium transition-colors">
                    {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <p className="text-green-600 text-xs">Amount:</p>
                  <p className="text-green-800 font-bold text-lg">{fee}</p>
                </div>
                <p className="text-green-500 text-xs mt-2">
                  Pay via any UPI app: PhonePe, Google Pay, Paytm, etc.
                </p>
              </div>

              {/* Upload screenshot */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Payment Screenshot <span className="text-red-500">*</span>
                </label>
                <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                  paymentFile ? "border-green-500 bg-green-50" : "border-green-300 hover:border-green-400 hover:bg-green-50/50"
                }`}>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} />
                  {paymentFile ? (
                    <>
                      <FiCheck className="w-8 h-8 text-green-600" />
                      <p className="text-green-700 font-medium text-sm text-center">{paymentFile.name}</p>
                      <p className="text-green-500 text-xs">
                        {(paymentFile.size / 1024 / 1024).toFixed(1)} MB · Tap to change
                      </p>
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-8 h-8 text-green-400" />
                      <p className="text-green-600 font-medium text-sm">Tap to upload screenshot</p>
                      <p className="text-green-400 text-xs">JPEG, PNG or WebP · Max 5MB</p>
                    </>
                  )}
                </label>
              </div>

              {/* UPI Transaction ID */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-800 mb-1.5">
                  UPI Transaction ID <span className="text-green-400 text-xs">(optional but helpful)</span>
                </label>
                <input type="text" value={upiTxnId}
                  onChange={(e) => setUpiTxnId(e.target.value)}
                  placeholder="e.g. 123456789012"
                  className="input-field" />
              </div>

              <button onClick={uploadPayment} disabled={uploading || !paymentFile}
                className="btn-primary w-full justify-center disabled:opacity-60 mb-3">
                {uploading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FiUpload className="w-4 h-4" />}
                {uploading ? "Uploading…" : "Submit Payment Proof"}
              </button>

              <p className="text-center text-green-500 text-xs">
                🔒 Your payment is being verified manually by the clinic. No auto-deductions.
              </p>
            </div>
          )}

          {/* ── STEP 4: Success ─────────────────────────────────────────── */}
          {step === 4 && (
            <div className="bg-white rounded-4xl shadow-card p-6 md:p-8 border border-green-100 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                Appointment Requested!
              </h2>
              <p className="text-green-600 text-base leading-relaxed mb-6">
                Your payment is under verification. Once approved, you'll receive your <strong>Token Number</strong> and confirmation on your email.
              </p>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6 text-left">
                <p className="text-amber-800 font-semibold text-sm mb-2">⏳ Payment Status: Verification Pending</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  The clinic will verify your payment within 1–2 hours during working hours. You'll receive a confirmation email with your token number.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="btn-primary justify-center">
                  View My Appointments
                </Link>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp justify-center">
                  <FaWhatsapp className="w-5 h-5" />
                  Follow Up on WhatsApp
                </a>
                <Link href="/" className="text-green-600 text-sm hover:text-green-700 font-medium">
                  ← Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </>
  );
}
