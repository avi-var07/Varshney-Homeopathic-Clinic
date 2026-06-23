"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCalendar, FiClock, FiCheck, FiX, FiUpload,
  FiFileText, FiLogOut, FiRefreshCw, FiVideo,
  FiPackage, FiUser, FiMessageSquare, FiSend,
  FiChevronDown, FiChevronUp, FiStar, FiSearch,
  FiMail, FiActivity
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function DoctorDashboardClient() {
  const router = useRouter();
  
  // Tabs: appointments, patients, reviews
  const [activeTab, setActiveTab] = useState<"appointments" | "patients" | "reviews">("appointments");
  
  // Data
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    todayTotal: 0, todayOnline: 0, todayOffline: 0,
    pendingPaymentVerifications: 0, todayConfirmed: 0,
    todayCompleted: 0, totalActivePatients: 0, totalConsultations: 0
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAppt, setExpandedAppt] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Forms
  const [meetLink, setMeetLink] = useState<Record<string, string>>({});
  const [advice, setAdvice] = useState("");
  const [medicines, setMedicines] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [doctorNote, setDoctorNote] = useState("");
  
  // Modals
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  // Loaders
  useEffect(() => {
    if (activeTab === "appointments") loadAppointments();
    else if (activeTab === "patients") loadPatients();
    else if (activeTab === "reviews") loadReviews();
  }, [activeTab, filter, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (filter !== "all") params.set("filter", filter);
      if (searchQuery) params.set("search", searchQuery);
      
      const res = await fetch(`/api/doctor/appointments?${params}`);
      if (res.status === 401) { router.push("/admin"); return; }
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
        if (data.stats) setStats(data.stats);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (searchQuery) params.set("search", searchQuery);
      
      const res = await fetch(`/api/doctor/patients?${params}`);
      if (res.status === 401) { router.push("/admin"); return; }
      if (res.ok) {
        const data = await res.json();
        setPatients(data.patients || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews?limit=50");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPatientDetails = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/patients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPatientDetails(data);
        setSelectedPatientId(id);
      }
    } finally {
      setLoading(false);
    }
  };

  // Actions
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

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id + status);
    try {
      await patchAppointment(id, { status });
      toast.success("Status updated.");
      loadAppointments();
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(null); }
  };

  const verifyPayment = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`/api/doctor/appointments/${id}/verify-payment`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      loadAppointments();
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(null); }
  };

  const saveMeetLink = async (id: string) => {
    if (!meetLink[id]?.trim()) { toast.error("Enter Google Meet URL."); return; }
    setActionLoading(id + "meet");
    try {
      await patchAppointment(id, { meetLink: meetLink[id].trim() });
      toast.success("Meet link saved!");
      loadAppointments();
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(null); }
  };

  const sendEmail = async (id: string, type: string) => {
    setActionLoading(id + "email" + type);
    try {
      const res = await fetch(`/api/doctor/appointments/${id}/send-email`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(null); }
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
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(null); }
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
    } catch (err: any) { toast.error(err.message); }
    finally { setUploadingFor(null); }
  };

  const updateMedicalHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientDetails) return;
    setActionLoading("updateMedical");
    try {
      const res = await fetch(`/api/doctor/patients/${patientDetails.profile._id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allergies: patientDetails.profile.allergies,
          existingDiseases: patientDetails.profile.existingDiseases,
          medicalHistoryNotes: patientDetails.profile.medicalHistoryNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Medical history updated.");
    } catch (err: any) { toast.error(err.message); }
    finally { setActionLoading(null); }
  };

  const statusColor: Record<string, string> = {
    payment_pending: "bg-amber-50 text-amber-700 border-amber-200",
    payment_verification_pending: "bg-blue-50 text-blue-700 border-blue-200",
    confirmed: "bg-indigo-50 text-indigo-700 border-indigo-200",
    consultation_started: "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-green-100 shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-gradient flex items-center justify-center text-white text-lg">🌿</div>
            <div>
              <p className="font-bold text-green-900 text-sm">Doctor Workspace</p>
              <p className="text-green-400 text-xs">Varshney Homeopathic Clinic</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-green-600 text-sm hover:text-green-700 font-medium hidden sm:block">Website →</Link>
            <button
              onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
            >
              <FiLogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {[
            { label: "Today's Appts", value: stats.todayTotal, icon: FiCalendar, bg: "bg-blue-50 text-blue-600" },
            { label: "Online Today", value: stats.todayOnline, icon: FiVideo, bg: "bg-indigo-50 text-indigo-600" },
            { label: "Offline Today", value: stats.todayOffline, icon: FiUser, bg: "bg-purple-50 text-purple-600" },
            { label: "Pending Pay", value: stats.pendingPaymentVerifications, icon: FiCheck, bg: "bg-amber-50 text-amber-600" },
            { label: "Confirmed", value: stats.todayConfirmed, icon: FiCalendar, bg: "bg-green-50 text-green-600" },
            { label: "Completed", value: stats.todayCompleted, icon: FiCheck, bg: "bg-emerald-50 text-emerald-600" },
            { label: "Active Patients", value: stats.totalActivePatients, icon: FiUser, bg: "bg-teal-50 text-teal-600" },
            { label: "Total Consults", value: stats.totalConsultations, icon: FiActivity, bg: "bg-cyan-50 text-cyan-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-3 border border-green-50 shadow-card text-center flex flex-col items-center justify-center">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-1`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("appointments")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "appointments" ? "bg-green-gradient text-white shadow-soft" : "bg-white text-green-700 border border-green-200"
              }`}>
              <FiCalendar className="w-4 h-4" /> Appointments
            </button>
            <button onClick={() => setActiveTab("patients")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "patients" ? "bg-green-gradient text-white shadow-soft" : "bg-white text-green-700 border border-green-200"
              }`}>
              <FiUser className="w-4 h-4" /> Patient Profiles
            </button>
          </div>
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input 
              type="text" 
              placeholder="Search by name, mobile, token..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <>
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { v: "all", l: "All" },
                { v: "today", l: "Today" },
                { v: "upcoming", l: "Upcoming" },
                { v: "online", l: "Online" },
                { v: "offline", l: "Offline" },
                { v: "payment_verification_pending", l: "⏳ Verify Payment" },
                { v: "confirmed", l: "Confirmed" },
                { v: "completed", l: "Completed" },
              ].map((f) => (
                <button key={f.v} onClick={() => setFilter(f.v)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === f.v ? "bg-green-100 text-green-800 border border-green-300" : "bg-white text-green-600 border border-green-100"
                  }`}>
                  {f.l}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => <div key={i} className="skeleton h-24 w-full rounded-2xl" />)}
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-green-100">
                <FiCalendar className="w-10 h-10 text-green-200 mx-auto mb-3" />
                <p className="text-green-600">No appointments found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => {
                  const isExpanded = expandedAppt === appt._id;
                  const sc = statusColor[appt.status] || "bg-gray-50 text-gray-600";

                  return (
                    <div key={appt._id} className="bg-white rounded-2xl border border-green-100 shadow-card overflow-hidden">
                      <div className="p-4 flex items-start gap-4 cursor-pointer hover:bg-green-50/30 transition-colors"
                        onClick={() => setExpandedAppt(isExpanded ? null : appt._id)}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`border px-2.5 py-1 rounded-full text-xs font-bold ${sc}`}>
                              {appt.status.replace(/_/g, " ").toUpperCase()}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${appt.type === "online" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                              {appt.type === "online" ? "💻 Online" : "🏥 Offline"}
                            </span>
                            {appt.tokenNumber && <span className="px-2.5 py-1 bg-green-900 text-green-100 rounded-full text-xs font-mono">{appt.tokenNumber}</span>}
                          </div>
                          <p className="font-bold text-gray-900 text-lg leading-tight">{appt.fullName}</p>
                          <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
                            <span>{appt.preferredDate} · {appt.preferredTime}</span>
                            <span>{appt.mobile}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); loadPatientDetails(appt.patientProfileId || appt._id); }}
                              className="text-green-600 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <FiUser /> View Full Profile
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isExpanded ? <FiChevronUp className="w-5 h-5 text-gray-400" /> : <FiChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-6">
                          
                          {/* Payment Verification Flow */}
                          {appt.paymentStatus === "payment_verification_pending" && (
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                              <p className="text-amber-800 font-semibold text-sm mb-3">⏳ Payment Screenshot Submitted</p>
                              {appt.paymentScreenshotUrl && (
                                <a href={appt.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-amber-700 text-sm font-medium hover:underline mb-3">
                                  View Screenshot →
                                </a>
                              )}
                              <div className="flex gap-3">
                                <button onClick={() => verifyPayment(appt._id, "approve")} disabled={!!actionLoading}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                                  <FiCheck /> Approve & Generate Token
                                </button>
                                <button onClick={() => verifyPayment(appt._id, "reject")} disabled={!!actionLoading}
                                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                                  <FiX /> Reject Payment
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Email Actions */}
                          {appt.status !== "cancelled" && (
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => sendEmail(appt._id, "confirmation")} className="btn-secondary !py-1.5 !text-xs !rounded-lg flex items-center gap-1.5">
                                <FiMail /> Send Confirmation
                              </button>
                              <button onClick={() => sendEmail(appt._id, "reminder")} className="btn-secondary !py-1.5 !text-xs !rounded-lg flex items-center gap-1.5">
                                <FiClock /> Send Reminder
                              </button>
                              <button onClick={() => sendEmail(appt._id, "follow_up")} className="btn-secondary !py-1.5 !text-xs !rounded-lg flex items-center gap-1.5">
                                <FiActivity /> Notify Follow-up
                              </button>
                            </div>
                          )}

                          {/* Meet Link Flow (Online) */}
                          {appt.type === "online" && (
                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                              <p className="text-blue-800 font-semibold text-sm mb-2 flex items-center gap-2"><FiVideo /> Google Meet Link</p>
                              {appt.meetLink && <p className="text-blue-700 text-xs mb-2 break-all">Current: {appt.meetLink}</p>}
                              <div className="flex gap-2">
                                <input type="url" placeholder="https://meet.google.com/..." value={meetLink[appt._id] || ""} onChange={(e) => setMeetLink({ ...meetLink, [appt._id]: e.target.value })} className="input-field flex-1 text-sm bg-white" />
                                <button onClick={() => saveMeetLink(appt._id)} disabled={actionLoading === appt._id + "meet"} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5">
                                  <FiSend /> Save
                                </button>
                                {appt.meetLink && (
                                  <button onClick={() => sendEmail(appt._id, "meet_link")} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold flex items-center gap-1.5">
                                    <FiMail /> Send to Patient
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Status Management */}
                          <div>
                            <p className="text-gray-700 text-sm font-bold mb-2">Workflow Status</p>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { v: "confirmed", l: "Confirmed" },
                                { v: "consultation_started", l: "Consultation Started" },
                                { v: "completed", l: "Completed" },
                                { v: "cancelled", l: "Cancelled" }
                              ].map((opt) => (
                                <button key={opt.v} onClick={() => updateStatus(appt._id, opt.v)}
                                  disabled={appt.status === opt.v || !!actionLoading}
                                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                    appt.status === opt.v ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                  }`}>
                                  {opt.l}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Doctor Consultation Inputs */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Consultation Notes & Advice */}
                            <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                              <p className="text-green-800 font-semibold text-sm mb-3 flex items-center gap-2"><FiMessageSquare /> Doctor's Consultation Notes</p>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs font-bold text-green-700 block mb-1">Advice (Visible to doctor only)</label>
                                  <textarea placeholder="Diagnosis, diet, general advice..." value={advice} onChange={(e) => setAdvice(e.target.value)} rows={2} className="input-field text-sm" />
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-green-700 block mb-1">Medicines</label>
                                  <input type="text" placeholder="e.g. Sulphur 30, Nux Vomica 200" value={medicines} onChange={(e) => setMedicines(e.target.value)} className="input-field text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs font-bold text-green-700 block mb-1">Next Follow-up</label>
                                    <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="input-field text-sm" />
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-green-700 block mb-1">Private Internal Notes</label>
                                    <input type="text" placeholder="Not visible to patient" value={doctorNote} onChange={(e) => setDoctorNote(e.target.value)} className="input-field text-sm" />
                                  </div>
                                </div>
                                <button onClick={() => addNote(appt._id)} disabled={!advice.trim() || actionLoading === appt._id + "note"} className="w-full bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                                  <FiCheck /> Save Notes & Advice
                                </button>
                              </div>
                            </div>

                            {/* Prescription Upload */}
                            <div className="bg-white rounded-2xl p-4 border border-green-200">
                              <p className="text-gray-800 font-semibold text-sm mb-3 flex items-center gap-2"><FiFileText /> Official Prescription</p>
                              <p className="text-xs text-gray-500 mb-4">Upload the official prescription here. This is the ONLY document visible to the patient on their dashboard for download.</p>
                              <input type="file" ref={fileRef} accept="image/*,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPrescription(appt._id, f); }} />
                              <button onClick={() => fileRef.current?.click()} disabled={uploadingFor === appt._id} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border-2 border-dashed border-green-300 hover:border-green-500 text-green-700 rounded-xl text-sm font-bold transition-all">
                                <FiUpload /> Upload PDF or Image
                              </button>
                              {(appt.prescriptions || []).length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-xs font-bold text-gray-500">Uploaded Prescriptions:</p>
                                  {(appt.prescriptions || []).map((p: any, idx: number) => (
                                    <a key={idx} href={p.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline">View Document {idx + 1}</a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Existing notes history */}
                          {(appt.consultationNotes || []).length > 0 && (
                            <div>
                              <p className="text-gray-700 text-sm font-bold mb-2">Consultation History for this session</p>
                              <div className="space-y-2">
                                {(appt.consultationNotes || []).map((note: any) => (
                                  <div key={note._id} className="bg-white rounded-xl p-3 border border-gray-200">
                                    <p className="text-gray-800 text-sm font-medium">{note.advice}</p>
                                    {note.medicines.length > 0 && <p className="text-gray-600 text-xs mt-1">💊 {note.medicines.join(", ")}</p>}
                                    {note.notes && <p className="text-red-500 text-xs mt-1 bg-red-50 p-1 rounded inline-block">Private: {note.notes}</p>}
                                    <p className="text-gray-400 text-xs mt-2">{new Date(note.addedAt).toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* PATIENTS TAB */}
        {activeTab === "patients" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-bold">Patient Name</th>
                    <th className="px-6 py-4 font-bold">Contact</th>
                    <th className="px-6 py-4 font-bold">Age/Gender</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {patients.map((p) => (
                    <tr key={p._id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{p.fullName}</td>
                      <td className="px-6 py-4">{p.mobile}<br/><span className="text-xs text-gray-400">{p.email}</span></td>
                      <td className="px-6 py-4">{p.age} / {p.gender}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => loadPatientDetails(p._id)} className="text-green-600 hover:text-green-800 font-semibold px-3 py-1.5 bg-green-50 rounded-lg">View Full Record</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {patients.length === 0 && !loading && (
              <div className="p-10 text-center text-gray-500">No patients found.</div>
            )}
          </div>
        )}

      </div>

      {/* Patient Details Modal */}
      {selectedPatientId && patientDetails && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col relative">
            <button onClick={() => { setSelectedPatientId(null); setPatientDetails(null); }} className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full transition-colors z-10">
              <FiX className="w-6 h-6" />
            </button>

            <div className="p-8 border-b border-gray-100 bg-green-gradient text-white rounded-t-3xl">
              <h2 className="text-3xl font-bold mb-2">{patientDetails.profile.fullName}</h2>
              <p className="text-green-100">{patientDetails.profile.age} years • {patientDetails.profile.gender} • {patientDetails.profile.mobile}</p>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-50 flex-1">
              {/* Left Column - Medical History */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiFileText className="text-green-600"/> Patient Profile & Medical History</h3>
                  <form onSubmit={updateMedicalHistory} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Known Allergies</label>
                      <textarea value={patientDetails.profile.allergies || ""} onChange={(e) => setPatientDetails({...patientDetails, profile: {...patientDetails.profile, allergies: e.target.value}})} className="input-field text-sm" rows={2} placeholder="e.g. Peanuts, Penicillin"/>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Existing Diseases</label>
                      <textarea value={patientDetails.profile.existingDiseases || ""} onChange={(e) => setPatientDetails({...patientDetails, profile: {...patientDetails.profile, existingDiseases: e.target.value}})} className="input-field text-sm" rows={2} placeholder="e.g. Diabetes, Hypertension"/>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Permanent Internal Notes (Doctor Only)</label>
                      <textarea value={patientDetails.profile.medicalHistoryNotes || ""} onChange={(e) => setPatientDetails({...patientDetails, profile: {...patientDetails.profile, medicalHistoryNotes: e.target.value}})} className="input-field text-sm border-amber-200 bg-amber-50 focus:ring-amber-400" rows={4} placeholder="Private notes about the patient's behavior, adherence to medicine, etc."/>
                    </div>
                    <button type="submit" disabled={actionLoading === "updateMedical"} className="w-full btn-primary !py-2 !text-sm flex justify-center items-center gap-2">
                      {actionLoading === "updateMedical" ? "Saving..." : "Save Medical History"}
                    </button>
                  </form>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3">Contact Details</h3>
                  <div className="text-sm space-y-2 text-gray-600">
                    <p><strong>Email:</strong> {patientDetails.profile.email}</p>
                    <p><strong>Mobile:</strong> {patientDetails.profile.mobile}</p>
                    <p><strong>Address:</strong> {patientDetails.profile.address || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Consultation Timeline */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-gray-900 text-xl">Consultation Timeline</h3>
                {patientDetails.appointments.length === 0 ? (
                  <p className="text-gray-500">No previous consultations.</p>
                ) : (
                  <div className="space-y-4">
                    {patientDetails.appointments.map((appt: any) => (
                      <div key={appt._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative">
                        <div className="absolute top-5 right-5 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor[appt.status] || "bg-gray-100"}`}>{appt.status.replace(/_/g," ").toUpperCase()}</span>
                        </div>
                        <p className="font-bold text-green-800 mb-1">{new Date(appt.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-sm text-gray-500 mb-4">{appt.type === "online" ? "Online Consultation" : "Clinic Visit"} • Token: {appt.tokenNumber || "N/A"}</p>
                        
                        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm text-gray-700">
                          <p className="font-semibold text-gray-900 mb-1">Symptoms Reported:</p>
                          <p>{appt.symptoms}</p>
                        </div>

                        {appt.consultationNotes && appt.consultationNotes.length > 0 && (
                          <div className="mb-4">
                            <p className="font-semibold text-gray-900 text-sm mb-2">Doctor's Advice & Notes:</p>
                            <div className="space-y-2">
                              {appt.consultationNotes.map((note: any, i: number) => (
                                <div key={i} className="pl-3 border-l-2 border-green-400 text-sm">
                                  <p className="text-gray-800">{note.advice}</p>
                                  {note.medicines?.length > 0 && <p className="text-green-600 mt-1 text-xs font-medium">Medicines: {note.medicines.join(", ")}</p>}
                                  {note.notes && <p className="text-amber-700 mt-1 text-xs bg-amber-50 inline-block px-2 py-0.5 rounded">Private: {note.notes}</p>}
                                  {note.followUpDate && <p className="text-blue-600 mt-1 text-xs">Follow-up: {new Date(note.followUpDate).toLocaleDateString()}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {appt.prescriptions && appt.prescriptions.length > 0 && (
                          <div>
                            <p className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1"><FiFileText/> Official Prescriptions:</p>
                            <div className="flex gap-3">
                              {appt.prescriptions.map((p: any, i: number) => (
                                <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">Download File {i+1}</a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
