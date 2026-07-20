"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCalendar, FiClock, FiFileText,
  FiLogOut, FiRefreshCw, FiVideo,
  FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_LINK, PERMANENT_MEET_LINK } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import QuestionnaireFlow from "@/components/QuestionnaireFlow";
import { getQuestionText } from "@/lib/questionnaire";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Complaint {
  organ: string;
  symptom: string;
  answers: Record<string, string>;
  submittedAt: string;
}

interface Prescription {
  type: string;
  url: string;
  uploadedAt: string;
}

interface Appointment {
  _id: string;
  type: "online" | "offline";
  fullName: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  tokenNumber?: string;
  status: string;
  paymentStatus: string;
  paymentRejectionReason?: string;
  meetLink?: string;
  prescriptions: Prescription[];
  questionnaireAnswers?: Complaint[];
  questionnaireSubmittedAt?: string;
  createdAt: string;
}

// ─── Status display for patients (plain language, no tech jargon) ─────────────

const STATUS: Record<string, { label: string; detail: string; color: string; icon: string }> = {
  payment_pending: {
    label: "Payment Needed",
    detail: "Upload your payment screenshot to confirm booking.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "💰",
  },
  payment_verification_pending: {
    label: "Payment Under Review",
    detail: "Doctor will verify your payment within 1–2 hours.",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: "⏳",
  },
  confirmed: {
    label: "Booking Confirmed! Fill your health details",
    detail: "Your payment is approved. Please fill the health questionnaire below so the doctor is prepared.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "✅",
  },
  questionnaire_pending: {
    label: "Please Fill Health Questionnaire",
    detail: "Answer a few simple questions so the doctor knows your health situation.",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    icon: "📋",
  },
  questionnaire_submitted: {
    label: "All Set for Consultation",
    detail: "Your health details are with the doctor. See you at your appointment.",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: "🩺",
  },
  consultation_started: {
    label: "Consultation In Progress",
    detail: "Your consultation is currently happening.",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "🟢",
  },
  completed: {
    label: "Consultation Complete",
    detail: "Your consultation is done. Download your prescription below.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "🏁",
  },
  cancelled: {
    label: "Appointment Cancelled",
    detail: "This appointment was cancelled. Book a new one if needed.",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: "❌",
  },
};

export default function PatientDashboardClient() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [questionnaireApptId, setQuestionnaireApptId] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (!d.user) router.replace("/"); })
      .catch(() => router.replace("/"));
  }, [router]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/patient/appointments");
      if (res.status === 401) { router.replace("/"); return; }
      if (res.ok) {
        const data = await res.json();
        const appts: Appointment[] = data.appointments || [];
        setAppointments(appts);
        // Auto-expand the most recent active one
        const active = appts.find((a) => !["completed", "cancelled"].includes(a.status));
        if (active && !expanded) setExpanded(active._id);
      }
    } catch {
      toast.error("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAppointments(); }, []); // eslint-disable-line

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  // Appointments that need questionnaire (confirmed but not yet filled)
  const needsQuestionnaire = appointments.filter(
    (a) =>
      (a.status === "confirmed" || a.status === "questionnaire_pending") &&
      (!a.questionnaireAnswers || a.questionnaireAnswers.length === 0)
  );

  return (
    <main className="min-h-screen bg-hero-gradient">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-green-100 shadow-soft sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-gradient flex items-center justify-center text-white text-lg">🌿</div>
            <div>
              <p className="font-bold text-green-900 text-sm leading-none">My Dashboard</p>
              {user && <p className="text-green-400 text-xs mt-0.5">{user.name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAppointments} title="Refresh"
              className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100">
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link href="/book" className="btn-primary !px-4 !py-2 !text-sm hidden sm:flex">+ Book</Link>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium">
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Questionnaire nudge banner */}
        {needsQuestionnaire.length > 0 && !questionnaireApptId && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div className="flex-1">
              <p className="font-bold text-violet-800">Please fill your health questionnaire</p>
              <p className="text-violet-600 text-sm mt-0.5">
                Answer a few simple questions so Dr. Aman can prepare for your consultation.
              </p>
              <button
                onClick={() => setQuestionnaireApptId(needsQuestionnaire[0]._id)}
                className="mt-3 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors"
              >
                Fill Now →
              </button>
            </div>
          </div>
        )}

        {/* Questionnaire modal */}
        {questionnaireApptId && (
          <QuestionnaireFlow
            appointmentId={questionnaireApptId}
            onComplete={() => {
              setQuestionnaireApptId(null);
              loadAppointments();
              toast.success("Health details saved! Doctor has been notified.");
            }}
            onClose={() => setQuestionnaireApptId(null)}
          />
        )}

        {/* Appointments list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-green-900">My Appointments</h2>
            <Link href="/book" className="text-green-600 text-sm font-medium hover:text-green-700">+ Book New</Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-green-100 p-10 text-center shadow-card">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-green-700 font-semibold mb-1">No appointments yet</p>
              <p className="text-green-400 text-sm mb-5">Book your first consultation with Dr. Aman Varshney</p>
              <Link href="/book" className="btn-primary inline-flex">Book Appointment</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <AppointmentCard
                  key={appt._id}
                  appt={appt}
                  expanded={expanded === appt._id}
                  onToggle={() => setExpanded(expanded === appt._id ? null : appt._id)}
                  onFillQuestionnaire={() => setQuestionnaireApptId(appt._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* WhatsApp help */}
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#1fba59] text-white font-semibold rounded-2xl shadow-soft transition-colors">
          <FaWhatsapp className="w-5 h-5" /> Need help? Chat on WhatsApp
        </a>
      </div>
    </main>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

function AppointmentCard({
  appt, expanded, onToggle, onFillQuestionnaire,
}: {
  appt: Appointment;
  expanded: boolean;
  onToggle: () => void;
  onFillQuestionnaire: () => void;
}) {
  const cfg = STATUS[appt.status] ?? {
    label: appt.status,
    detail: "",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: "•",
  };

  const isOnline = appt.type === "online";
  const needsQuestionnaire =
    (appt.status === "confirmed" || appt.status === "questionnaire_pending") &&
    (!appt.questionnaireAnswers || appt.questionnaireAnswers.length === 0);
  const hasPrescription = (appt.prescriptions || []).length > 0;
  const showMeetLink =
    isOnline &&
    ["questionnaire_submitted", "confirmed", "consultation_started", "completed"].includes(appt.status);
  const complaints: Complaint[] = appt.questionnaireAnswers || [];

  return (
    <div className={`bg-white rounded-2xl border shadow-card overflow-hidden ${expanded ? "border-green-300" : "border-green-100"}`}>
      {/* Card header */}
      <div
        className="p-4 flex items-start gap-3 cursor-pointer hover:bg-green-50/30 transition-colors"
        onClick={onToggle}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isOnline ? "bg-blue-50" : "bg-amber-50"}`}>
          {isOnline ? "💻" : "🏥"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </span>
            {appt.tokenNumber && (
              <span className="px-2.5 py-1 bg-green-900 text-green-100 rounded-full text-xs font-mono font-bold">
                Token: {appt.tokenNumber}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-gray-400 text-xs mt-1">
            <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" />{appt.preferredDate}</span>
            <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{appt.preferredTime}</span>
            <span>{isOnline ? "Online" : "Clinic Visit"}</span>
          </div>
        </div>
        {expanded
          ? <FiChevronUp className="w-5 h-5 text-gray-300 flex-shrink-0" />
          : <FiChevronDown className="w-5 h-5 text-gray-300 flex-shrink-0" />}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">

          {/* Status detail */}
          <div className={`rounded-2xl px-4 py-3 border ${cfg.color}`}>
            <p className="font-bold text-sm">{cfg.icon} {cfg.label}</p>
            <p className="text-xs mt-1 opacity-80">{cfg.detail}</p>
          </div>

          {/* Prescription download (PRIORITY 1) */}
          {hasPrescription && (
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl pointer-events-none">📝</div>
              <p className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2 relative z-10">
                <FiFileText className="w-5 h-5" /> Your Prescription is Ready
              </p>
              {appt.prescriptions.map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all hover:scale-[1.01] shadow-soft mb-2 relative z-10"
                >
                  ⬇ Download Prescription {appt.prescriptions.length > 1 ? `(${i + 1})` : ""}
                </a>
              ))}
              <p className="text-emerald-600 text-xs mt-2 relative z-10">Show this at your local pharmacy to get your medicines.</p>
            </div>
          )}

          {/* Google Meet link */}
          {showMeetLink && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <p className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                <FiVideo className="w-4 h-4" /> Google Meet Link
              </p>
              <a
                href={PERMANENT_MEET_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                🎥 Join Google Meet
              </a>
              <p className="text-blue-500 text-xs mt-2 text-center">
                Join at your scheduled time: {appt.preferredTime}
              </p>
            </div>
          )}

          {/* Questionnaire CTA */}
          {needsQuestionnaire && (
            <div className="bg-violet-50 rounded-2xl p-4 border border-violet-200">
              <p className="font-bold text-violet-800 text-sm mb-1">📋 Fill your health details</p>
              <p className="text-violet-600 text-xs mb-3">
                This helps the doctor understand your problem before the consultation.
              </p>
              <button
                onClick={onFillQuestionnaire}
                className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors"
              >
                Start Questionnaire →
              </button>
            </div>
          )}

          {/* Payment rejected — re-upload */}
          {appt.paymentStatus === "payment_rejected" && (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
              <p className="font-bold text-red-800 text-sm mb-1">❌ Payment Not Verified</p>
              {appt.paymentRejectionReason && (
                <p className="text-red-600 text-xs mb-3">Reason: {appt.paymentRejectionReason}</p>
              )}
              <Link
                href={`/book/reupload/${appt._id}`}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Re-upload Payment Screenshot →
              </Link>
            </div>
          )}

          {/* Saved complaints checklist */}
          {complaints.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-200 opacity-90">
              <p className="font-bold text-green-800 text-sm mb-3">✅ Your Health Complaints (submitted)</p>
              <div className="space-y-3">
                {complaints.map((c, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-green-100">
                    <p className="font-semibold text-green-800 text-sm mb-2">
                      {c.organ} → {c.symptom}
                    </p>
                    <div className="space-y-2">
                      {Object.entries(c.answers || {}).map(([qId, ans]) => (
                        <div key={qId} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center font-bold text-[10px] ${
                            ans === "Yes" ? "bg-green-100 text-green-700" :
                            ans === "No" ? "bg-gray-100 text-gray-500" :
                            "bg-blue-50 text-blue-600"
                          }`}>
                            {ans === "Yes" ? "✓" : ans === "No" ? "✗" : "•"}
                          </span>
                          <div>
                            <span className="text-gray-500 font-semibold block mb-0.5">{getQuestionText(c.organ, c.symptom, qId)}</span>
                            <span className="text-gray-800">{ans}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
