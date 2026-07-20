"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiCalendar, FiClock, FiCheck, FiX, FiUpload,
  FiFileText, FiLogOut, FiRefreshCw, FiVideo,
  FiUser, FiMessageSquare, FiSend, FiMail,
  FiChevronDown, FiChevronUp, FiSearch, FiEye,
  FiAlertCircle, FiBell
} from "react-icons/fi";
import { PERMANENT_MEET_LINK } from "@/lib/constants";
import { getQuestionText } from "@/lib/questionnaire";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Appointment {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  age: string;
  gender: string;
  address?: string;
  symptoms: string;
  type: "online" | "offline";
  preferredDate: string;
  preferredTime: string;
  tokenNumber?: string;
  status: string;
  paymentStatus: string;
  paymentScreenshotUrl?: string;
  meetLink?: string;
  consultationNotes: ConsultationNote[];
  prescriptions: Prescription[];
  doctorNotes?: string;
  questionnaireDisease?: string;
  questionnaireAnswers?: Record<string, unknown>;
  questionnaireSubmittedAt?: string;
  createdAt: string;
}

interface ConsultationNote {
  _id: string;
  advice: string;
  medicines: string[];
  followUpDate?: string;
  notes?: string;
  addedAt: string;
}

interface Prescription {
  type: string;
  url: string;
  uploadedAt: string;
}

interface Stats {
  todayTotal: number;
  todayOnline: number;
  todayOffline: number;
  pendingPaymentVerifications: number;
  todayConfirmed: number;
  todayCompleted: number;
  totalActivePatients: number;
  totalConsultations: number;
}

// ─── Action Button ────────────────────────────────────────────────────────────

function ActionButton({
  onClick,
  loading,
  loadingText,
  doneText,
  children,
  variant = "primary",
  disabled,
  className = "",
}: {
  onClick: () => void;
  loading: boolean;
  loadingText: string;
  doneText?: string;
  children: React.ReactNode;
  variant?: "primary" | "danger" | "secondary" | "success";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    secondary: "bg-white border-2 border-green-200 hover:border-green-400 text-green-700",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: string }> = {
  payment_pending:               { label: "Payment Pending",      className: "bg-amber-50 text-amber-700 border-amber-200",    icon: "⏳" },
  payment_verification_pending:  { label: "Verify Payment",       className: "bg-orange-50 text-orange-700 border-orange-200", icon: "👁" },
  confirmed:                     { label: "Confirmed",            className: "bg-blue-50 text-blue-700 border-blue-200",       icon: "✅" },
  questionnaire_pending:         { label: "Questionnaire Due",    className: "bg-violet-50 text-violet-700 border-violet-200", icon: "📋" },
  questionnaire_submitted:       { label: "Ready for Consult",    className: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: "🩺" },
  consultation_started:          { label: "In Consultation",      className: "bg-purple-50 text-purple-700 border-purple-200", icon: "🟢" },
  completed:                     { label: "Completed",            className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "🏁" },
  cancelled:                     { label: "Cancelled",            className: "bg-red-50 text-red-700 border-red-200",          icon: "❌" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-600 border-gray-200", icon: "•" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DoctorDashboardClient() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({
    todayTotal: 0, todayOnline: 0, todayOffline: 0,
    pendingPaymentVerifications: 0, todayConfirmed: 0,
    todayCompleted: 0, totalActivePatients: 0, totalConsultations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Rejection modal state
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [rejectCustom, setRejectCustom] = useState<string>("");

  // Per-appointment action loading states
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const setAction = (key: string, val: boolean) =>
    setActionLoading((p) => ({ ...p, [key]: val }));

  // Doctor notes + consultation form state
  const [doctorNotes, setDoctorNotes] = useState<Record<string, string>>({});
  const [advice, setAdvice] = useState<Record<string, string>>({});
  const [medicines, setMedicines] = useState<Record<string, string>>({});
  const [followUp, setFollowUp] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "doctor") {
          router.replace("/doctor/login");
        }
      })
      .catch(() => router.replace("/doctor/login"));
  }, [router]);

  // ── Load appointments ───────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "60" });
      if (filter !== "all") params.set("filter", filter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/doctor/appointments?${params}`);
      if (res.status === 401) { router.replace("/doctor/login"); return; }
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
        if (data.stats) setStats(data.stats);
      }
    } catch {
      toast.error("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery, router]);

  useEffect(() => { load(); }, [load]);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/doctor/login");
  };

  // ── Verify payment ──────────────────────────────────────────────────────────
  const verifyPayment = async (id: string, action: "approve" | "reject", reason?: string) => {
    const key = `${id}-verify-${action}`;
    setAction(key, true);
    try {
      const res = await fetch(`/api/doctor/appointments/${id}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      if (action === "reject") {
        setRejectId(null);
        setRejectReason("");
        setRejectCustom("");
      }
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setAction(key, false);
    }
  };

  // ── Update appointment status ───────────────────────────────────────────────
  const updateStatus = async (id: string, status: string) => {
    const key = `${id}-status-${status}`;
    setAction(key, true);
    try {
      const res = await fetch(`/api/doctor/appointments/${id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Status updated.");
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setAction(key, false);
    }
  };

  // ── Save doctor notes ───────────────────────────────────────────────────────
  const saveDoctorNotes = async (id: string) => {
    const key = `${id}-notes`;
    setAction(key, true);
    try {
      const res = await fetch(`/api/doctor/appointments/${id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorNotes: doctorNotes[id] || "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Notes saved.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setAction(key, false);
    }
  };

  // ── Add consultation note ───────────────────────────────────────────────────
  const addConsultationNote = async (id: string) => {
    if (!advice[id]?.trim()) { toast.error("Advice is required."); return; }
    const key = `${id}-consult`;
    setAction(key, true);
    try {
      const res = await fetch(`/api/doctor/appointments/${id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationNote: {
            advice: advice[id].trim(),
            medicines: (medicines[id] || "").split(",").map((m) => m.trim()).filter(Boolean),
            followUpDate: followUp[id] || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Consultation note saved.");
      setAdvice((p) => ({ ...p, [id]: "" }));
      setMedicines((p) => ({ ...p, [id]: "" }));
      setFollowUp((p) => ({ ...p, [id]: "" }));
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setAction(key, false);
    }
  };

  // ── Upload prescription ─────────────────────────────────────────────────────
  const uploadPrescription = async (id: string, file: File) => {
    setUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("prescription", file);
      const res = await fetch(`/api/doctor/appointments/${id}/upload-prescription`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Prescription uploaded.");
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingFor(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Send email ──────────────────────────────────────────────────────────────
  const sendEmail = async (id: string, type: string, label: string) => {
    const key = `${id}-email-${type}`;
    setAction(key, true);
    try {
      const res = await fetch(`/api/doctor/appointments/${id}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : `Failed to send ${label}.`);
    } finally {
      setAction(key, false);
    }
  };

  // ── Complete consultation ───────────────────────────────────────────────────
  const completeConsultation = async (appt: Appointment) => {
    const key = `${appt._id}-complete`;
    setAction(key, true);
    try {
      const res = await fetch(`/api/doctor/appointments/${appt._id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Consultation completed.");
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally {
      setAction(key, false);
    }
  };

  // ── Today's priority highlight ──────────────────────────────────────────────
  const urgentCount = stats.pendingPaymentVerifications;
  const todayStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const FILTERS = [
    { v: "today",                       l: "Today" },
    { v: "payment_verification_pending", l: `⏳ Verify Payment${urgentCount > 0 ? ` (${urgentCount})` : ""}` },
    { v: "confirmed",                   l: "Confirmed" },
    { v: "questionnaire_submitted",     l: "Ready to Consult" },
    { v: "upcoming",                    l: "Upcoming" },
    { v: "online",                      l: "💻 Online" },
    { v: "offline",                     l: "🏥 Offline" },
    { v: "completed",                   l: "Completed" },
    { v: "all",                         l: "All" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-green-100 shadow-soft sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-gradient flex items-center justify-center text-white text-xl shadow-soft">🌿</div>
            <div>
              <p className="font-bold text-green-900 text-sm leading-none">Doctor Dashboard</p>
              <p className="text-green-400 text-xs mt-0.5">{todayStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} title="Refresh" className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors">
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <a href="/" className="text-green-600 text-sm hover:text-green-700 font-medium hidden sm:block px-3 py-2 rounded-xl hover:bg-green-50">Website →</a>
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium">
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Stats grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Today", value: stats.todayTotal, icon: "📅", color: "text-blue-600 bg-blue-50" },
            { label: "Verify Payment", value: stats.pendingPaymentVerifications, icon: "⚡", color: urgentCount > 0 ? "text-orange-600 bg-orange-50" : "text-gray-500 bg-gray-50" },
            { label: "Confirmed", value: stats.todayConfirmed, icon: "✅", color: "text-green-600 bg-green-50" },
            { label: "Completed", value: stats.todayCompleted, icon: "🏁", color: "text-emerald-600 bg-emerald-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-green-50 shadow-card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-800 leading-none">{s.value}</p>
                <p className="text-gray-400 text-xs font-medium mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Urgent banner ───────────────────────────────────────────────── */}
        {urgentCount > 0 && (
          <div
            className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-orange-100 transition-colors"
            onClick={() => setFilter("payment_verification_pending")}
          >
            <FiAlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-orange-800 text-sm">{urgentCount} payment{urgentCount > 1 ? "s" : ""} waiting for your verification</p>
              <p className="text-orange-600 text-xs mt-0.5">Tap here to review and approve →</p>
            </div>
          </div>
        )}

        {/* ── Filters + Search ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.v}
                onClick={() => setFilter(f.v)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f.v
                    ? "bg-green-700 text-white shadow-soft"
                    : "bg-white text-green-700 border border-green-200 hover:border-green-400"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name, mobile, token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
            />
          </div>
        </div>

        {/* ── Appointments list ────────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-green-100 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-green-700 font-semibold">No appointments found</p>
            <p className="text-green-400 text-sm mt-1">Try a different filter or check back later</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appt={appt}
                expanded={expanded === appt._id}
                onToggle={() => setExpanded(expanded === appt._id ? null : appt._id)}
                actionLoading={actionLoading}
                doctorNote={doctorNotes[appt._id] ?? appt.doctorNotes ?? ""}
                onDoctorNoteChange={(v) => setDoctorNotes((p) => ({ ...p, [appt._id]: v }))}
                adviceVal={advice[appt._id] ?? ""}
                onAdviceChange={(v) => setAdvice((p) => ({ ...p, [appt._id]: v }))}
                medicinesVal={medicines[appt._id] ?? ""}
                onMedicinesChange={(v) => setMedicines((p) => ({ ...p, [appt._id]: v }))}
                followUpVal={followUp[appt._id] ?? ""}
                onFollowUpChange={(v) => setFollowUp((p) => ({ ...p, [appt._id]: v }))}
                onVerifyPayment={verifyPayment}
                onRejectClick={(id) => setRejectId(id)}
                onUpdateStatus={updateStatus}
                onSaveNotes={saveDoctorNotes}
                onAddNote={addConsultationNote}
                onUploadPrescription={(file) => uploadPrescription(appt._id, file)}
                uploadingFor={uploadingFor}
                fileInputRef={fileInputRef}
                onSendEmail={sendEmail}
                onComplete={() => completeConsultation(appt)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadingFor) uploadPrescription(uploadingFor, file);
        }}
      />

      {/* ── Rejection Modal ─────────────────────────────────────────────────── */}
      {rejectId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Payment</h3>
            <p className="text-gray-500 text-sm mb-5">Please select a reason for rejecting this payment. The patient will be notified and asked to re-upload.</p>
            
            <div className="space-y-2.5 mb-5">
              {[
                "Screenshot is unclear or blurry",
                "Payment amount is incorrect",
                "Transaction could not be verified",
                "Other (please specify below)"
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="radio" 
                    name="rejectReason" 
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            {rejectReason === "Other (please specify below)" && (
              <div className="mb-5">
                <textarea
                  value={rejectCustom}
                  onChange={(e) => setRejectCustom(e.target.value)}
                  placeholder="Type your specific reason here..."
                  rows={3}
                  className="input-field text-sm resize-none"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => { setRejectId(null); setRejectReason(""); setRejectCustom(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <ActionButton
                onClick={() => {
                  const finalReason = rejectReason === "Other (please specify below)" ? rejectCustom : rejectReason;
                  verifyPayment(rejectId, "reject", finalReason);
                }}
                loading={!!actionLoading[`${rejectId}-verify-reject`]}
                loadingText="Rejecting..."
                variant="danger"
                className="flex-1"
                disabled={!rejectReason || (rejectReason === "Other (please specify below)" && !rejectCustom.trim())}
              >
                Confirm Rejection
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

function AppointmentCard({
  appt, expanded, onToggle,
  actionLoading, doctorNote, onDoctorNoteChange,
  adviceVal, onAdviceChange, medicinesVal, onMedicinesChange,
  followUpVal, onFollowUpChange,
  onVerifyPayment, onRejectClick, onUpdateStatus, onSaveNotes,
  onAddNote, onUploadPrescription, uploadingFor, fileInputRef,
  onSendEmail, onComplete,
}: {
  appt: Appointment;
  expanded: boolean;
  onToggle: () => void;
  actionLoading: Record<string, boolean>;
  doctorNote: string;
  onDoctorNoteChange: (v: string) => void;
  adviceVal: string; onAdviceChange: (v: string) => void;
  medicinesVal: string; onMedicinesChange: (v: string) => void;
  followUpVal: string; onFollowUpChange: (v: string) => void;
  onVerifyPayment: (id: string, action: "approve" | "reject") => void;
  onRejectClick: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onSaveNotes: (id: string) => void;
  onAddNote: (id: string) => void;
  onUploadPrescription: (file: File) => void;
  uploadingFor: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSendEmail: (id: string, type: string, label: string) => void;
  onComplete: () => void;
}) {
  const isOnline = appt.type === "online";
  const isPendingPayment = appt.paymentStatus === "payment_verification_pending";
  const isConfirmed = appt.status === "confirmed";
  const isQuestionnaireReady = appt.status === "questionnaire_submitted";
  const isInProgress = appt.status === "consultation_started";
  const isCompleted = appt.status === "completed";

  // What is the NEXT action for this appointment?
  const nextAction = isPendingPayment ? "verify-payment"
    : isConfirmed ? "start-consult"
    : isQuestionnaireReady ? "start-consult"
    : isInProgress ? "complete-consult"
    : null;

  return (
    <div className={`bg-white rounded-2xl border shadow-card overflow-hidden transition-all ${
      isPendingPayment ? "border-orange-200" : expanded ? "border-green-300" : "border-green-100"
    }`}>
      {/* Card Header */}
      <div
        className="p-4 flex items-start gap-3 cursor-pointer hover:bg-green-50/30 transition-colors"
        onClick={onToggle}
      >
        {/* Type icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
          isOnline ? "bg-blue-50" : "bg-amber-50"
        }`}>
          {isOnline ? "💻" : "🏥"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <StatusBadge status={appt.status} />
            {appt.tokenNumber && (
              <span className="px-2.5 py-1 bg-green-900 text-green-100 rounded-full text-xs font-mono font-bold">
                {appt.tokenNumber}
              </span>
            )}
          </div>
          <p className="font-bold text-gray-900 text-lg leading-tight">{appt.fullName}</p>
          <div className="flex flex-wrap items-center gap-3 text-gray-400 text-xs mt-1">
            <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" />{appt.preferredDate}</span>
            <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />{appt.preferredTime}</span>
            <span>{appt.mobile}</span>
            <span>{appt.age}y · {appt.gender}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {nextAction === "verify-payment" && (
            <span className="hidden sm:block text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
              Action needed
            </span>
          )}
          {expanded ? <FiChevronUp className="w-5 h-5 text-gray-400" /> : <FiChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-50">

          {/* ─ Patient Info ─────────────────────────────────────────────── */}
          <div className="p-4 bg-gray-50/50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Patient Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={<FiUser />} label="Name" value={appt.fullName} />
              <InfoRow icon={<FiMail />} label="Email" value={appt.email} />
              <InfoRow label="Mobile" value={appt.mobile} />
              <InfoRow label="Age / Gender" value={`${appt.age} years · ${appt.gender}`} />
              {appt.address && <InfoRow label="Address" value={appt.address} className="sm:col-span-2" />}
            </div>
            <div className="mt-3 p-3 bg-white rounded-xl border border-green-100">
              <p className="text-xs font-bold text-green-700 mb-1">Reported Symptoms</p>
              <p className="text-gray-700 text-sm">{appt.symptoms}</p>
            </div>
          </div>

          {/* ─ Questionnaire Answers ────────────────────────────────────── */}
          {appt.questionnaireAnswers && Array.isArray(appt.questionnaireAnswers) && appt.questionnaireAnswers.length > 0 && (
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                📋 Patient Complaints Checklist
              </p>
              <div className="space-y-3">
                {(appt.questionnaireAnswers as Array<{organ: string; symptom: string; answers: Record<string,string>; submittedAt: string}>).map((complaint, ci) => (
                  <div key={ci} className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                    <p className="font-bold text-violet-900 text-sm mb-2">
                      {complaint.organ} → {complaint.symptom}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {Object.entries(complaint.answers || {}).map(([qId, ans]) => (
                        <div key={qId} className="flex items-start gap-2 text-xs">
                          <span className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center font-bold ${
                            ans === "Yes" ? "bg-green-100 text-green-700" :
                            ans === "No" ? "bg-gray-100 text-gray-500" :
                            "bg-blue-50 text-blue-700"
                          }`}>
                            {ans === "Yes" ? "✓" : ans === "No" ? "✗" : "•"}
                          </span>
                          <div>
                            <span className="text-gray-500 font-semibold block mb-0.5">{getQuestionText(complaint.organ, complaint.symptom, qId)}</span>
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

          {/* ─ Payment Verification ──────────────────────────────────────── */}
          {isPendingPayment && (
            <div className="p-4 bg-orange-50/50">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-3">⚡ Payment Verification Required</p>
              {appt.paymentScreenshotUrl && (
                <a
                  href={appt.paymentScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mb-4 px-4 py-2.5 bg-white border-2 border-orange-200 rounded-xl text-orange-700 text-sm font-semibold hover:bg-orange-50 transition-colors"
                >
                  <FiEye className="w-4 h-4" /> View Payment Screenshot →
                </a>
              )}
              <div className="flex gap-3">
                <ActionButton
                  onClick={() => onVerifyPayment(appt._id, "approve")}
                  loading={!!actionLoading[`${appt._id}-verify-approve`]}
                  loadingText="Approving..."
                  variant="success"
                  className="flex-1"
                >
                  <FiCheck className="w-4 h-4" /> Approve & Generate Token
                </ActionButton>
                <button
                  onClick={() => onRejectClick(appt._id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all bg-red-500 hover:bg-red-600 text-white"
                >
                  <FiX className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          )}

          {/* ─ Online Meet Link ──────────────────────────────────────────── */}
          {isOnline && appt.status !== "payment_pending" && appt.status !== "payment_verification_pending" && (
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                <FiVideo className="inline w-3 h-3 mr-1" />Google Meet (Permanent Room)
              </p>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-lg">🎥</span>
                <div className="flex-1 min-w-0">
                  <p className="text-blue-800 font-semibold text-sm truncate">{PERMANENT_MEET_LINK}</p>
                  <p className="text-blue-500 text-xs">This link was automatically sent to the patient</p>
                </div>
                <a href={PERMANENT_MEET_LINK} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex-shrink-0">
                  Join →
                </a>
              </div>
              <ActionButton
                onClick={() => onSendEmail(appt._id, "meet_link", "Meet link")}
                loading={!!actionLoading[`${appt._id}-email-meet_link`]}
                loadingText="Sending..."
                variant="secondary"
                className="mt-2 text-xs !py-2"
              >
                <FiMail className="w-3.5 h-3.5" /> Resend Meet Link to Patient
              </ActionButton>
            </div>
          )}

          {/* ─ Workflow Actions ──────────────────────────────────────────── */}
          {!isPendingPayment && !isCompleted && appt.status !== "cancelled" && (
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Next Step</p>
              <div className="flex flex-wrap gap-2">
                {(isConfirmed || isQuestionnaireReady) && (
                  <ActionButton
                    onClick={() => onUpdateStatus(appt._id, "consultation_started")}
                    loading={!!actionLoading[`${appt._id}-status-consultation_started`]}
                    loadingText="Starting..."
                    variant="primary"
                    className="text-base px-6 py-3"
                  >
                    🩺 Start Consultation
                  </ActionButton>
                )}
                {isInProgress && (
                  <ActionButton
                    onClick={onComplete}
                    loading={!!actionLoading[`${appt._id}-complete`]}
                    loadingText="Completing..."
                    variant="success"
                    className="text-base px-6 py-3"
                  >
                    🏁 Complete Consultation
                  </ActionButton>
                )}
                {(isConfirmed || isQuestionnaireReady || isInProgress) && (
                  <ActionButton
                    onClick={() => onUpdateStatus(appt._id, "cancelled")}
                    loading={!!actionLoading[`${appt._id}-status-cancelled`]}
                    loadingText="Cancelling..."
                    variant="danger"
                  >
                    Cancel
                  </ActionButton>
                )}
              </div>
            </div>
          )}

          {/* ─ Doctor's Private Notes ────────────────────────────────────── */}
          {appt.status !== "payment_pending" && appt.status !== "payment_verification_pending" && (
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                🔒 Private Notes (Never visible to patient)
              </p>
              <textarea
                value={doctorNote}
                onChange={(e) => onDoctorNoteChange(e.target.value)}
                placeholder="Clinical observations, treatment plan, internal notes..."
                rows={3}
                className="input-field text-sm resize-none mb-2"
              />
              <ActionButton
                onClick={() => onSaveNotes(appt._id)}
                loading={!!actionLoading[`${appt._id}-notes`]}
                loadingText="Saving..."
                variant="secondary"
                className="text-xs !py-2"
              >
                <FiFileText className="w-3.5 h-3.5" /> Save Notes
              </ActionButton>
            </div>
          )}

          {/* ─ Consultation Note ─────────────────────────────────────────── */}
          {(isInProgress || isCompleted) && (
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                <FiMessageSquare className="inline w-3 h-3 mr-1" />Add Consultation Note
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1">Advice / Diagnosis</label>
                  <textarea
                    value={adviceVal}
                    onChange={(e) => onAdviceChange(e.target.value)}
                    placeholder="Diagnosis, diet advice, lifestyle changes..."
                    rows={2}
                    className="input-field text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-green-700 mb-1">Medicines (comma separated)</label>
                    <input
                      type="text"
                      value={medicinesVal}
                      onChange={(e) => onMedicinesChange(e.target.value)}
                      placeholder="e.g. Sulphur 30, Nux Vomica 200"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-green-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={followUpVal}
                      onChange={(e) => onFollowUpChange(e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
                <ActionButton
                  onClick={() => onAddNote(appt._id)}
                  loading={!!actionLoading[`${appt._id}-consult`]}
                  loadingText="Saving..."
                  variant="primary"
                  disabled={!adviceVal.trim()}
                >
                  <FiCheck className="w-4 h-4" /> Save Consultation Note
                </ActionButton>
              </div>

              {/* Previous notes */}
              {appt.consultationNotes?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-gray-400">Previous Notes</p>
                  {appt.consultationNotes.map((n) => (
                    <div key={n._id} className="bg-white rounded-xl p-3 border border-gray-100 text-sm">
                      <p className="text-gray-800 font-medium">{n.advice}</p>
                      {n.medicines.length > 0 && <p className="text-green-600 text-xs mt-1">💊 {n.medicines.join(", ")}</p>}
                      {n.followUpDate && <p className="text-blue-600 text-xs mt-1">📅 Follow-up: {new Date(n.followUpDate).toLocaleDateString("en-IN")}</p>}
                      <p className="text-gray-300 text-xs mt-1.5">{new Date(n.addedAt).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─ Prescription Upload ───────────────────────────────────────── */}
          {(isInProgress || isCompleted) && (
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                <FiUpload className="inline w-3 h-3 mr-1" />Upload Prescription (Visible to Patient)
              </p>
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    (fileInputRef.current as HTMLInputElement & { _apptId?: string })._apptId = appt._id;
                    fileInputRef.current.click();
                  }
                }}
                disabled={uploadingFor === appt._id}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-green-300 hover:border-green-500 rounded-xl text-green-700 font-semibold text-sm transition-all hover:bg-green-50 disabled:opacity-60"
              >
                {uploadingFor === appt._id ? (
                  <><span className="w-4 h-4 border-2 border-green-300 border-t-green-700 rounded-full animate-spin" /> Uploading...</>
                ) : (
                  <><FiUpload className="w-4 h-4" /> Upload PDF or Image</>
                )}
              </button>

              {appt.prescriptions?.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs font-bold text-gray-400">Uploaded Prescriptions</p>
                  {appt.prescriptions.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                      <FiFileText className="w-3.5 h-3.5" /> Prescription {i + 1}
                      <span className="text-gray-400 text-xs">({p.type})</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─ Email Actions ─────────────────────────────────────────────── */}
          {appt.status !== "payment_pending" && appt.status !== "cancelled" && (
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                <FiBell className="inline w-3 h-3 mr-1" />Email Patient
              </p>
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  onClick={() => onSendEmail(appt._id, "confirmation", "confirmation")}
                  loading={!!actionLoading[`${appt._id}-email-confirmation`]}
                  loadingText="Sending..."
                  variant="secondary"
                  className="text-xs !py-2"
                >
                  <FiMail className="w-3.5 h-3.5" /> Confirmation
                </ActionButton>
                <ActionButton
                  onClick={() => onSendEmail(appt._id, "reminder", "reminder")}
                  loading={!!actionLoading[`${appt._id}-email-reminder`]}
                  loadingText="Sending..."
                  variant="secondary"
                  className="text-xs !py-2"
                >
                  <FiClock className="w-3.5 h-3.5" /> Reminder
                </ActionButton>
                {appt.consultationNotes?.some((n) => n.followUpDate) && (
                  <ActionButton
                    onClick={() => onSendEmail(appt._id, "follow_up", "follow-up")}
                    loading={!!actionLoading[`${appt._id}-email-follow_up`]}
                    loadingText="Sending..."
                    variant="secondary"
                    className="text-xs !py-2"
                  >
                    <FiSend className="w-3.5 h-3.5" /> Follow-up Reminder
                  </ActionButton>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, className = "" }: {
  icon?: React.ReactNode; label: string; value: string; className?: string;
}) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {icon && <span className="text-green-400 mt-0.5 flex-shrink-0">{icon}</span>}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}
