"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCalendar, FiClock, FiCheck, FiX, FiUpload,
  FiFileText, FiLogOut, FiRefreshCw, FiVideo,
  FiPackage, FiUser, FiMessageSquare, FiSend,
  FiChevronDown, FiChevronUp, FiStar,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

interface Appointment {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  age: string;
  gender: string;
  type: "online" | "offline";
  status: string;
  paymentStatus: string;
  tokenNumber?: string;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  address?: string;
  deliveryStatus: string;
  meetLink?: string;
  prescriptions: Array<{ type: string; url: string }>;
  consultationNotes: Array<{
    _id: string; advice: string; medicines: string[];
    notes?: string; followUpDate?: string; addedAt: string;
  }>;
  paymentScreenshotUrl?: string;
  doctorNotes?: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "confirmed",  label: "Confirm" },
  { value: "completed",  label: "Mark Complete" },
  { value: "cancelled",  label: "Cancel" },
];

const DELIVERY_OPTIONS = [
  { value: "dispatch_pending", label: "Dispatch Pending" },
  { value: "packed",           label: "Packed" },
  { value: "shipped",          label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered",        label: "Delivered" },
];

const statusColor: Record<string, string> = {
  payment_pending:               "bg-amber-50 text-amber-700 border-amber-200",
  payment_verification_pending:  "bg-blue-50 text-blue-700 border-blue-200",
  confirmed:                     "bg-green-50 text-green-700 border-green-200",
  completed:                     "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:                     "bg-red-50 text-red-700 border-red-200",
};

export default function DoctorDashboardClient() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, todayCount: 0, pendingPayment: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<Record<string, string>>({});
  const [advice, setAdvice] = useState("");
  const [medicines, setMedicines] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [doctorNote, setDoctorNote] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"appointments" | "reviews">("appointments");

  // Reviews
  const [reviews, setReviews] = useState<Array<{
    _id: string; name: string; location?: string; problem?: string;
    rating: number; text: string; createdAt: string;
  }>>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    // Verify the user has doctor or admin role
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        // Patient sessions can also have doctor role if they logged in via OTP with DOCTOR_EMAIL
        // Admin sessions are validated via cookie by the appointments API
        // If no session at all, we still let the appointments API enforce auth (returns 401)
      });
    loadAppointments();
  }, [filter, dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch("/api/reviews?limit=50");
      if (res.status === 401) { router.push("/admin"); return; }
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (filter !== "all") params.set("status", filter);
      if (dateFilter) params.set("date", dateFilter);
      const res = await fetch(`/api/doctor/appointments?${params}`);
      if (res.status === 401) { router.push("/admin"); return; }
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
        setStats(data.stats || {});
      }
    } finally {
      setLoading(false);
    }
  };

  const apiCall = async (url: string, body: object) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed.");
    return data;
  };

  const patchAppointment = async (id: string, body: object) => {
    const res = await fetch(`/api/doctor/appointments/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed.");
    return data;
  };

  const verifyPayment = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id + action);
    try {
      const data = await apiCall(`/api/doctor/appointments/${id}/verify-payment`, { action });
      toast.success(data.message);
      loadAppointments();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id + status);
    try {
      await patchAppointment(id, { status });
      toast.success("Status updated.");
      loadAppointments();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const saveMeetLink = async (id: string) => {
    if (!meetLink[id]?.trim()) { toast.error("Enter Google Meet URL."); return; }
    setActionLoading(id + "meet");
    try {
      await patchAppointment(id, { meetLink: meetLink[id].trim() });
      toast.success("Meet link saved & emailed to patient!");
      loadAppointments();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const addNote = async (id: string) => {
    if (!advice.trim()) { toast.error("Advice is required."); return; }
    setActionLoading(id + "note");
    try {
      await patchAppointment(id, {
        consultationNote: {
          advice: advice.trim(),
          medicines: medicines.split(",").map((m) => m.trim()).filter(Boolean),
          followUpDate: followUp || undefined,
          notes: doctorNote.trim() || undefined,
        },
      });
      toast.success("Consultation note added!");
      setAdvice(""); setMedicines(""); setFollowUp(""); setDoctorNote("");
      loadAppointments();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const updateDelivery = async (id: string, deliveryStatus: string) => {
    setActionLoading(id + "delivery");
    try {
      await patchAppointment(id, { deliveryStatus });
      toast.success("Delivery status updated.");
      loadAppointments();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const uploadPrescription = async (id: string, file: File) => {
    setUploadingFor(id);
    try {
      const fd = new FormData();
      fd.append("prescription", file);
      const res = await fetch(`/api/doctor/appointments/${id}/upload-prescription`, {
        method: "POST", body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Prescription uploaded!");
      loadAppointments();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingFor(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-green-100 shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-gradient flex items-center justify-center">
              <span className="text-lg">🌿</span>
            </div>
            <div>
              <p className="font-bold text-green-900 text-sm">Doctor Dashboard</p>
              <p className="text-green-400 text-xs">Varshney Homeopathic Clinic</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-green-600 text-sm hover:text-green-700 font-medium hidden sm:block">
              Website →
            </Link>
            <button
              onClick={() => { activeTab === "appointments" ? loadAppointments() : loadReviews(); }}
              className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
              <FiRefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total",         value: stats.total,          icon: FiCalendar, bg: "bg-blue-50",   text: "text-blue-600" },
            { label: "Today",         value: stats.todayCount,     icon: FiClock,    bg: "bg-green-50",  text: "text-green-600" },
            { label: "Pending Pay",   value: stats.pendingPayment, icon: FiCheck,    bg: "bg-amber-50",  text: "text-amber-600" },
            { label: "Confirmed",     value: stats.pending,        icon: FiUser,     bg: "bg-purple-50", text: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white shadow-card`}>
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-2`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-green-900">{s.value}</p>
              <p className="text-green-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-5">
          <button onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "appointments" ? "bg-green-gradient text-white shadow-soft" : "bg-white text-green-700 border border-green-200 hover:bg-green-50"
            }`}>
            <FiCalendar className="w-4 h-4" />
            Appointments
          </button>
          <button onClick={() => { setActiveTab("reviews"); loadReviews(); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "reviews" ? "bg-green-gradient text-white shadow-soft" : "bg-white text-green-700 border border-green-200 hover:bg-green-50"
            }`}>
            <FiStar className="w-4 h-4" />
            Patient Reviews
          </button>
        </div>

        {/* Reviews panel */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl border border-green-100 shadow-card p-6">
            <h2 className="font-bold text-green-900 text-lg mb-5 flex items-center gap-2">
              <FiStar className="w-5 h-5 text-saffron-500" />
              Patient Reviews
            </h2>
            {reviewsLoading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-green-400">
                <FiStar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-bold text-green-900 text-sm">{review.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {review.location && <span className="text-green-500 text-xs">{review.location}</span>}
                          {review.problem && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{review.problem}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[...Array(5)].map((_,i) => (
                          <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? "text-saffron-400 fill-current" : "text-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-green-700 text-sm leading-relaxed">"{review.text}"</p>
                    <p className="text-green-400 text-xs mt-2">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments panel */}
        {activeTab === "appointments" && (
          <>
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { v: "all", l: "All" },
            { v: "payment_verification_pending", l: "⏳ Verify Payment" },
            { v: "confirmed", l: "✓ Confirmed" },
            { v: "completed", l: "Done" },
          ].map((f) => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.v
                  ? "bg-green-gradient text-white shadow-soft"
                  : "bg-white text-green-700 border border-green-200 hover:bg-green-50"
              }`}>
              {f.l}
            </button>
          ))}
          <input type="date" value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm border border-green-200 bg-white text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400" />
          {dateFilter && (
            <button onClick={() => setDateFilter("")}
              className="px-3 py-2 rounded-xl text-sm bg-white border border-green-200 text-green-600 hover:bg-green-50">
              Clear
            </button>
          )}
        </div>

        {/* Appointment cards */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-24 w-full rounded-2xl" />)}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-green-100">
            <FiCalendar className="w-10 h-10 text-green-200 mx-auto mb-3" />
            <p className="text-green-600">No appointments found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => {
              const isExpanded = expanded === appt._id;
              const sc = statusColor[appt.status] || "bg-gray-50 text-gray-600 border-gray-200";

              return (
                <div key={appt._id} className="bg-white rounded-2xl border border-green-100 shadow-card overflow-hidden">
                  {/* Row */}
                  <div
                    className="p-4 flex items-start gap-4 cursor-pointer hover:bg-green-50/30 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : appt._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`border px-2.5 py-1 rounded-full text-xs font-semibold ${sc}`}>
                          {appt.status.replace(/_/g, " ")}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          appt.type === "online" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {appt.type === "online" ? "💻 Online" : "🏥 Offline"}
                        </span>
                        {appt.tokenNumber && (
                          <span className="px-2.5 py-1 bg-green-900 text-green-100 rounded-full text-xs font-mono">
                            {appt.tokenNumber}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-green-900 text-base leading-tight">{appt.fullName}</p>
                      <div className="flex items-center gap-3 text-green-500 text-xs mt-0.5">
                        <span>{appt.preferredDate} · {appt.preferredTime}</span>
                        <span>Age {appt.age} · {appt.gender}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quick WhatsApp */}
                      <a href={`https://wa.me/91${appt.mobile}`} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center hover:bg-[#bbf7d0] transition-colors">
                        <FaWhatsapp className="w-4 h-4" />
                      </a>
                      {isExpanded
                        ? <FiChevronUp className="w-5 h-5 text-green-400" />
                        : <FiChevronDown className="w-5 h-5 text-green-400" />}
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-green-50 bg-gray-50/50 p-5 space-y-5">

                      {/* Patient info */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        {[
                          ["📱 Mobile", appt.mobile],
                          ["📧 Email", appt.email],
                          ["🤒 Symptoms", appt.symptoms],
                          ...(appt.address ? [["📍 Address", appt.address]] : []),
                        ].map(([label, val]) => (
                          <div key={label} className="bg-white rounded-xl p-3 border border-green-100">
                            <p className="text-green-400 text-xs mb-0.5">{label}</p>
                            <p className="text-green-800 font-medium text-xs leading-relaxed">{val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Payment verification */}
                      {appt.paymentStatus === "payment_verification_pending" && (
                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                          <p className="text-amber-800 font-semibold text-sm mb-3">⏳ Payment Screenshot</p>
                          {appt.paymentScreenshotUrl && (
                            <a href={appt.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-amber-700 text-sm font-medium hover:underline mb-3 block">
                              View Payment Screenshot →
                            </a>
                          )}
                          <div className="flex gap-3">
                            <button
                              onClick={() => verifyPayment(appt._id, "approve")}
                              disabled={!!actionLoading}
                              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm">
                              {actionLoading === appt._id + "approve"
                                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <FiCheck className="w-4 h-4" />}
                              ✅ Approve Payment
                            </button>
                            <button
                              onClick={() => verifyPayment(appt._id, "reject")}
                              disabled={!!actionLoading}
                              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm">
                              <FiX className="w-4 h-4" />
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Status update */}
                      <div>
                        <p className="text-green-700 text-sm font-semibold mb-2">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((opt) => (
                            <button key={opt.value}
                              onClick={() => updateStatus(appt._id, opt.value)}
                              disabled={appt.status === opt.value || !!actionLoading}
                              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all disabled:opacity-40 ${
                                appt.status === opt.value
                                  ? "bg-green-100 text-green-700 border-green-300"
                                  : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                              }`}>
                              {actionLoading === appt._id + opt.value
                                ? "…" : opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Meet link (online only) */}
                      {appt.type === "online" && (
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                          <p className="text-blue-800 font-semibold text-sm mb-2 flex items-center gap-2">
                            <FiVideo className="w-4 h-4" /> Google Meet Link
                          </p>
                          {appt.meetLink && (
                            <p className="text-blue-700 text-xs mb-2 break-all">
                              Current: {appt.meetLink}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://meet.google.com/..."
                              value={meetLink[appt._id] || ""}
                              onChange={(e) => setMeetLink({ ...meetLink, [appt._id]: e.target.value })}
                              className="input-field flex-1 text-sm"
                            />
                            <button
                              onClick={() => saveMeetLink(appt._id)}
                              disabled={actionLoading === appt._id + "meet"}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-1.5">
                              {actionLoading === appt._id + "meet"
                                ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <FiSend className="w-3.5 h-3.5" />}
                              Send
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Upload prescription */}
                      <div>
                        <p className="text-green-700 text-sm font-semibold mb-2 flex items-center gap-2">
                          <FiFileText className="w-4 h-4" /> Upload Prescription
                        </p>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            ref={fileRef}
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadPrescription(appt._id, file);
                            }}
                          />
                          <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploadingFor === appt._id}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-green-300 hover:border-green-500 text-green-700 rounded-xl text-sm font-medium transition-all disabled:opacity-60">
                            {uploadingFor === appt._id
                              ? <span className="w-4 h-4 border-2 border-green-400/30 border-t-green-600 rounded-full animate-spin" />
                              : <FiUpload className="w-4 h-4" />}
                            {uploadingFor === appt._id ? "Uploading…" : "Upload Image or PDF"}
                          </button>
                          {appt.prescriptions.length > 0 && (
                            <span className="text-green-500 text-xs">
                              {appt.prescriptions.length} file(s) uploaded
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add consultation note */}
                      <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                        <p className="text-green-800 font-semibold text-sm mb-3 flex items-center gap-2">
                          <FiMessageSquare className="w-4 h-4" /> Add Consultation Note
                        </p>
                        <div className="space-y-3">
                          <textarea
                            placeholder="Doctor's advice to patient..."
                            value={advice}
                            onChange={(e) => setAdvice(e.target.value)}
                            rows={2}
                            className="input-field resize-none text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Medicines (comma-separated, e.g. Sulphur 30, Nux Vomica 200)"
                            value={medicines}
                            onChange={(e) => setMedicines(e.target.value)}
                            className="input-field text-sm"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-green-600 text-xs mb-1 block">Follow-up Date</label>
                              <input type="date" value={followUp}
                                onChange={(e) => setFollowUp(e.target.value)}
                                className="input-field text-sm" />
                            </div>
                            <div>
                              <label className="text-green-600 text-xs mb-1 block">Internal Notes</label>
                              <input type="text" placeholder="Doctor's private notes"
                                value={doctorNote}
                                onChange={(e) => setDoctorNote(e.target.value)}
                                className="input-field text-sm" />
                            </div>
                          </div>
                          <button
                            onClick={() => addNote(appt._id)}
                            disabled={!advice.trim() || actionLoading === appt._id + "note"}
                            className="btn-primary !py-2.5 !text-sm disabled:opacity-60">
                            {actionLoading === appt._id + "note"
                              ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              : <FiCheck className="w-3.5 h-3.5" />}
                            Save Note
                          </button>
                        </div>
                      </div>

                      {/* Delivery (online only) */}
                      {appt.type === "online" && (
                        <div>
                          <p className="text-green-700 text-sm font-semibold mb-2 flex items-center gap-2">
                            <FiPackage className="w-4 h-4" /> Medicine Delivery Status
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {DELIVERY_OPTIONS.map((opt) => (
                              <button key={opt.value}
                                onClick={() => updateDelivery(appt._id, opt.value)}
                                disabled={appt.deliveryStatus === opt.value || !!actionLoading}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all disabled:opacity-40 ${
                                  appt.deliveryStatus === opt.value
                                    ? "bg-green-600 text-white border-green-600"
                                    : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                                }`}>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Existing notes */}
                      {appt.consultationNotes.length > 0 && (
                        <div>
                          <p className="text-green-700 text-sm font-semibold mb-2">Previous Notes</p>
                          {appt.consultationNotes.map((note) => (
                            <div key={note._id} className="bg-white rounded-xl p-3 border border-green-100 mb-2">
                              <p className="text-green-800 text-sm">{note.advice}</p>
                              {note.medicines.length > 0 && (
                                <p className="text-green-500 text-xs mt-1">💊 {note.medicines.join(", ")}</p>
                              )}
                              <p className="text-green-400 text-xs mt-1">
                                {new Date(note.addedAt).toLocaleString("en-IN")}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
