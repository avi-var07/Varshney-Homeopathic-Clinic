"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import {
  FiCheck, FiUpload, FiCopy, FiChevronRight,
  FiUser, FiPhone, FiCalendar, FiLock
} from "react-icons/fi";
import {
  CLINIC_NAME, PHONE, WHATSAPP_LINK, UPI_ID,
  CONSULTATION_FEE_ONLINE, CONSULTATION_FEE_OFFLINE
} from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import type { PatientComplaint } from "@/lib/questionnaire";

// ─── Steps ───────────────────────────────────────────────────────────────────
// 1 → Choose type (Online / Offline)
// 2 → Pay & upload screenshot
// 3 → Enter patient details + schedule
// 4 → Health questionnaire
// 5 → Success

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = ["Type", "Payment", "Details", "Health Info"];

interface PatientForm {
  fullName: string;
  email: string;
  mobile: string;
  age: string;
  gender: "male" | "female" | "other";
  address: string;
  preferredDate: string;
  preferredTime: string;
}

const TIME_SLOTS = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
];

// ─── Progress Stepper ─────────────────────────────────────────────────────────
function Stepper({ step }: { step: Step }) {
  if (step === 5) return null;
  return (
    <div className="flex items-center justify-center mb-8">
      {STEP_LABELS.map((label, i) => {
        const num = (i + 1) as Step;
        const done = step > num;
        const active = step === num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                done ? "bg-green-600 text-white" :
                active ? "bg-green-gradient text-white shadow-glow" :
                "bg-white border-2 border-green-200 text-green-300"
              }`}>
                {done ? <FiCheck className="w-4 h-4" /> : num}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide hidden sm:block ${
                active ? "text-green-700" : done ? "text-green-500" : "text-green-300"
              }`}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-8 sm:w-14 h-0.5 mb-4 mx-1 ${step > num ? "bg-green-500" : "bg-green-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BookAppointmentClient() {
  const { user, openLogin } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<"online" | "offline">("offline");

  // Step 2 — payment
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [copied, setCopied] = useState(false);
  const [tempPaymentData, setTempPaymentData] = useState<{ file: File; txnId: string } | null>(null);

  // Step 3 — patient details
  const {
    register, handleSubmit, formState: { errors }, setValue, getValues, trigger,
  } = useForm<PatientForm>();

  // Step 4 — questionnaire data
  const [complaints, setComplaints] = useState<PatientComplaint[]>([]);

  // Final submission
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fee = type === "online" ? CONSULTATION_FEE_ONLINE : CONSULTATION_FEE_OFFLINE;

  // ── Step 1 → 2: Require login ────────────────────────────────────────────
  const proceedToPayment = () => {
    if (!user) {
      openLogin("patient");
      toast("Please sign in first to book an appointment.", { icon: "🔒" });
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 → 3: hold payment data locally, move to details
  const proceedWithPayment = () => {
    if (!paymentFile) { toast.error("Please upload your payment screenshot."); return; }
    setTempPaymentData({ file: paymentFile, txnId: upiTxnId });
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 3 → 4: validate form, move to questionnaire
  const proceedToQuestionnaire = async () => {
    const valid = await trigger();
    if (!valid) return;
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 4 → 5: questionnaire complete, submit everything
  const onQuestionnaireComplete = async (complaintData?: PatientComplaint[]) => {
    if (complaintData) setComplaints(complaintData);
    await submitEverything(complaintData || complaints);
  };

  // ── Final submit: create appointment + upload payment + questionnaire ────
  const submitEverything = async (finalComplaints: PatientComplaint[]) => {
    if (!tempPaymentData) { toast.error("Payment data missing. Please go back."); return; }
    setIsSubmitting(true);

    try {
      const data = getValues();

      // 1. Create appointment with questionnaire data
      const symptomSummary = finalComplaints.length > 0
        ? finalComplaints.map(c => `${c.organ}: ${c.symptom}`).join("; ")
        : "General consultation";

      const res = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          mobile: data.mobile,
          age: data.age,
          gender: data.gender,
          address: data.address,
          symptoms: symptomSummary,
          type,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          questionnaireAnswers: finalComplaints,
        }),
      });
      const result = await res.json();
      if (res.status === 401) { openLogin("reauth"); return; }
      if (!res.ok) throw new Error(result.message);

      const apptId = result.appointmentId;

      // 2. Upload payment screenshot
      const fd = new FormData();
      fd.append("screenshot", tempPaymentData.file);
      if (tempPaymentData.txnId) fd.append("upiTransactionId", tempPaymentData.txnId);
      const payRes = await fetch(`/api/patient/appointments/${apptId}/upload-payment`, {
        method: "POST",
        body: fd,
      });
      if (!payRes.ok) {
        const payData = await payRes.json();
        throw new Error(payData.message);
      }

      setStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-hero-gradient pt-24 pb-24">
        <div className="container-pad max-w-xl">
          <Stepper step={step} />

          {/* ── STEP 1: Choose Type ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="bg-white rounded-4xl shadow-card border border-green-100 p-6 md:p-8">
              <h1 className="text-2xl font-bold text-green-900 mb-1">Book Appointment</h1>
              <p className="text-green-500 text-sm mb-8">Choose how you'd like to consult Dr. Aman.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {(["offline", "online"] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`rounded-3xl p-6 border-2 text-left transition-all ${
                      type === t
                        ? "border-green-500 bg-green-50 shadow-glow"
                        : "border-green-200 bg-white hover:border-green-300"
                    }`}>
                    <div className="text-4xl mb-3">{t === "offline" ? "🏥" : "💻"}</div>
                    <h3 className="font-bold text-green-900 text-base mb-1">
                      {t === "offline" ? "Visit Clinic" : "Online Consultation"}
                    </h3>
                    <p className="text-green-500 text-xs mb-3">
                      {t === "offline"
                        ? "Come in person to the clinic."
                        : "Consult via Google Meet from home."}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-700 text-lg">
                        {t === "online" ? "₹200" : "₹20"}
                      </span>
                      {t === "offline" && <span className="text-[10px] text-green-400">booking fee</span>}
                      {type === t && (
                        <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center ml-auto">
                          <FiCheck className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* What to expect */}
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100 mb-6 text-sm text-green-700">
                <p className="font-semibold text-green-800 mb-2">{type === "online" ? "💻" : "🏥"} How it works:</p>
                <ul className="space-y-1.5">
                  {(type === "online" ? [
                    "Pay ₹200 consultation fee via UPI",
                    "Upload your payment screenshot",
                    "Fill in your personal details",
                    "Answer a short health questionnaire",
                    "Doctor verifies & sends Google Meet link",
                    "Join at your scheduled time",
                  ] : [
                    "Pay ₹20 non-refundable booking fee via UPI",
                    "Upload your payment screenshot",
                    "Fill in your personal details",
                    "Answer a short health questionnaire",
                    "Doctor verifies & assigns your token number",
                    "Visit clinic on your chosen date",
                  ]).map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <FiCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Login notice */}
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
                  <FiLock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-semibold text-sm">Sign in required</p>
                    <p className="text-blue-600 text-xs mt-0.5">
                      You&apos;ll need to sign in with your email (a simple OTP will be sent) so we can track your appointment and send updates.
                    </p>
                  </div>
                </div>
              )}

              {user && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-200 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-gradient flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-green-800 font-semibold text-sm">{user.name}</p>
                    <p className="text-green-400 text-xs truncate">{user.email}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Signed in</span>
                </div>
              )}

              <button onClick={proceedToPayment}
                className="btn-primary w-full justify-center text-base py-4">
                {user ? (
                  <>Pay {fee} & Continue <FiChevronRight className="w-5 h-5" /></>
                ) : (
                  <>Sign In & Continue <FiChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 2: Payment ─────────────────────────────────────────── */}
          {step === 2 && (
            <div className="bg-white rounded-4xl shadow-card border border-green-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(1)}
                  className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-700 hover:bg-green-100 text-lg">←</button>
                <div>
                  <h2 className="text-xl font-bold text-green-900">Make Payment</h2>
                  <p className="text-green-400 text-xs">{type === "online" ? "💻 Online · ₹200" : "🏥 Clinic Visit · ₹20 booking"}</p>
                </div>
              </div>

              {/* UPI Details */}
              <div className="bg-green-50 rounded-3xl p-5 border border-green-200 mb-5">
                <p className="text-green-700 font-semibold text-sm mb-3">💳 Pay via UPI</p>
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-green-200 mb-3">
                  <div>
                    <p className="text-green-400 text-xs">UPI ID</p>
                    <p className="text-green-900 font-bold text-lg">{UPI_ID}</p>
                  </div>
                  <button onClick={copyUpi}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl text-xs font-semibold">
                    {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-green-500 text-sm">Amount to pay:</p>
                  <p className="text-green-900 font-bold text-2xl">{fee}</p>
                </div>
                <p className="text-green-400 text-xs mt-2">Use PhonePe, Google Pay, Paytm or any UPI app.</p>
              </div>

              {/* Screenshot upload */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  Payment Screenshot <span className="text-red-500">*</span>
                </label>
                <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                  paymentFile ? "border-green-500 bg-green-50" : "border-green-300 hover:border-green-400 hover:bg-green-50/50"
                }`}>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} />
                  {paymentFile ? (
                    <>
                      <FiCheck className="w-10 h-10 text-green-600" />
                      <p className="text-green-700 font-semibold text-sm text-center">{paymentFile.name}</p>
                      <p className="text-green-400 text-xs">{(paymentFile.size / 1024 / 1024).toFixed(1)} MB · Tap to change</p>
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-10 h-10 text-green-300" />
                      <p className="text-green-600 font-semibold text-sm">Tap to upload payment screenshot</p>
                      <p className="text-green-400 text-xs">JPEG / PNG · Max 5MB</p>
                    </>
                  )}
                </label>
              </div>

              {/* Optional txn ID */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-green-800 mb-1.5">
                  UPI Transaction ID <span className="text-green-400 font-normal text-xs">(optional but helpful)</span>
                </label>
                <input type="text" value={upiTxnId} onChange={(e) => setUpiTxnId(e.target.value)}
                  placeholder="e.g. 123456789012" className="input-field" />
              </div>

              <button onClick={proceedWithPayment} disabled={!paymentFile}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50">
                <FiChevronRight className="w-5 h-5" /> Continue to Your Details
              </button>
              <p className="text-center text-green-400 text-xs mt-3">
                🔒 Doctor verifies payment manually. No auto-deduction.
              </p>
            </div>
          )}

          {/* ── STEP 3: Patient Details + Schedule ──────────────────────── */}
          {step === 3 && (
            <div className="bg-white rounded-4xl shadow-card border border-green-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => setStep(2)}
                  className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-700 hover:bg-green-100 text-lg">←</button>
                <div>
                  <h2 className="text-xl font-bold text-green-900">Your Details</h2>
                  <p className="text-green-400 text-xs">Tell us a little about yourself</p>
                </div>
              </div>

              {/* Signed-in banner */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-200 mb-5">
                  <div className="w-8 h-8 rounded-full bg-green-gradient flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-green-800 font-semibold text-sm">{user.name}</p>
                    <p className="text-green-400 text-xs truncate">{user.email}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Signed in</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input {...register("fullName", { required: "Full name is required" })}
                      placeholder="Your full name" className="input-field pl-10" />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-1.5">Email <span className="text-red-500">*</span></label>
                  <input {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                  })} type="email" placeholder="your@email.com" className="input-field" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  <p className="text-green-400 text-xs mt-1">Token number & confirmation will be sent here</p>
                </div>

                {/* Mobile + Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-green-800 mb-1.5">Mobile <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                      <input {...register("mobile", {
                        required: "Mobile required",
                        pattern: { value: /^[6-9]\d{9}$/, message: "Invalid number" },
                      })} type="tel" placeholder="10-digit" className="input-field pl-10" />
                    </div>
                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-800 mb-1.5">Age <span className="text-red-500">*</span></label>
                    <input {...register("age", { required: "Age required" })}
                      placeholder="Your age" className="input-field" />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-1.5">Gender <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["male", "female", "other"] as const).map((g) => (
                      <label key={g} className="relative cursor-pointer">
                        <input {...register("gender", { required: "Gender required" })} type="radio" value={g} className="sr-only peer" />
                        <div className="peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 border-2 border-green-200 rounded-xl px-3 py-2.5 text-center text-sm font-medium text-green-500 hover:border-green-300 transition-all capitalize">
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
                    <label className="block text-sm font-semibold text-green-800 mb-1.5">
                      Delivery Address <span className="text-red-500">*</span>
                      <span className="text-green-400 font-normal ml-1">(for medicine delivery)</span>
                    </label>
                    <textarea {...register("address", { required: type === "online" ? "Address required for medicine delivery" : false })}
                      placeholder="Full address..." rows={2} className="input-field resize-none" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                )}

                {/* Date + Time */}
                <div className="pt-2 border-t border-green-100">
                  <p className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" /> Choose Date & Time
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-green-600 mb-1.5">Date <span className="text-red-500">*</span></label>
                      <input {...register("preferredDate", { required: "Date required" })}
                        type="date" min={new Date().toISOString().split("T")[0]} className="input-field" />
                      {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-green-600 mb-1.5">Time <span className="text-red-500">*</span></label>
                      <select {...register("preferredTime", { required: "Time required" })} className="input-field">
                        <option value="">Select time</option>
                        {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button type="button" onClick={proceedToQuestionnaire}
                  className="btn-primary w-full justify-center text-base py-4">
                  <FiChevronRight className="w-5 h-5" /> Next: Health Questionnaire
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Health Questionnaire (Inline) ───────────────────── */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStep(3)}
                  className="w-9 h-9 rounded-xl bg-white shadow-card flex items-center justify-center text-green-700 hover:bg-green-50 text-lg border border-green-100">←</button>
                <div>
                  <p className="font-bold text-green-900">Step 4 of 4</p>
                  <p className="text-green-500 text-xs">Tell us about your health concerns</p>
                </div>
              </div>

              {/* Helpful note */}
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <p className="text-violet-800 font-semibold text-sm">Why are we asking this?</p>
                  <p className="text-violet-600 text-xs mt-0.5">
                    These questions help Dr. Aman understand your health before the consultation — so he can prepare the best treatment for you.
                  </p>
                </div>
              </div>

              <QuestionnaireFlow
                mode="inline"
                onComplete={onQuestionnaireComplete}
              />

              {/* Loading overlay */}
              {isSubmitting && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-xs">
                    <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-green-800 font-bold">Submitting your booking...</p>
                    <p className="text-green-500 text-xs mt-1">Please wait, this may take a moment.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 5: Success ─────────────────────────────────────────── */}
          {step === 5 && (
            <div className="bg-white rounded-4xl shadow-card border border-green-100 p-6 md:p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-5xl">✅</div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Booking Submitted!</h2>
              <p className="text-green-600 text-base mb-6 leading-relaxed">
                Your payment screenshot and health details have been sent to Dr. Aman for verification.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5 text-left">
                <p className="font-bold text-blue-800 text-sm mb-2">📋 What happens next?</p>
                <div className="space-y-2 text-blue-700 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-bold flex-shrink-0">1.</span>
                    <span>Doctor verifies your payment (within 1–2 hours)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold flex-shrink-0">2.</span>
                    <span>You&apos;ll get your token number by email</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold flex-shrink-0">3.</span>
                    {type === "online"
                      ? <span>Google Meet link will be emailed to you</span>
                      : <span>Visit clinic on your chosen date with your token</span>}
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold flex-shrink-0">4.</span>
                    <span>After consultation, your prescription will appear in your dashboard</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="btn-primary justify-center">
                  Go to My Dashboard →
                </Link>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp justify-center">
                  <span className="text-xl">💬</span> Follow up on WhatsApp
                </a>
                <Link href="/" className="text-green-400 text-sm hover:text-green-600">← Back to Home</Link>
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
