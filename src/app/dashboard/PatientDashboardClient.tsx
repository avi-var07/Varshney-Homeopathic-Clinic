"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  FiCalendar, FiClock, FiFileText, FiPackage,
  FiDownload, FiLogOut, FiUser, FiAlertCircle,
  FiExternalLink, FiRefreshCw,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_LINK } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

interface Appointment {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  type: "online" | "offline";
  status: string;
  paymentStatus: string;
  tokenNumber?: string;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  deliveryStatus: string;
  meetLink?: string;
  prescriptions: Array<{ type: string; url: string; uploadedAt: string }>;
  consultationNotes: Array<{
    _id: string;
    advice: string;
    medicines: string[];
    notes?: string;
    followUpDate?: string;
    addedAt: string;
  }>;
  paymentScreenshotUrl?: string;
  paymentRejectionReason?: string;
  createdAt: string;
}

const statusLabel: Record<string, { label: string; color: string }> = {
  payment_pending:                { label: "Awaiting Payment",        color: "bg-amber-100 text-amber-700" },
  payment_verification_pending:  { label: "Payment Under Review",     color: "bg-blue-100 text-blue-700" },
  confirmed:                     { label: "Confirmed ✓",              color: "bg-green-100 text-green-700" },
  completed:                     { label: "Completed",                color: "bg-emerald-100 text-emerald-700" },
  cancelled:                     { label: "Cancelled",                color: "bg-red-100 text-red-700" },
};

const deliveryLabel: Record<string, { label: string; step: number }> = {
  not_applicable:   { label: "N/A",              step: 0 },
  dispatch_pending: { label: "Dispatch Pending", step: 1 },
  packed:           { label: "Packed",           step: 2 },
  shipped:          { label: "Shipped",          step: 3 },
  out_for_delivery: { label: "Out for Delivery", step: 4 },
  delivered:        { label: "Delivered ✓",      step: 5 },
};

function DeliveryTracker({ status }: { status: string }) {
  const steps = ["Pending","Packed","Shipped","Out for Delivery","Delivered"];
  const current = deliveryLabel[status]?.step ?? 0;
  if (status === "not_applicable") return null;
  return (
    <div className="mt-3">
      <p className="text-green-700 text-xs font-semibold mb-2">📦 Medicine Delivery</p>
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              i + 1 <= current ? "bg-green-500" : "bg-green-200"
            }`} />
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 ${i + 1 < current ? "bg-green-400" : "bg-green-200"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="text-green-600 text-xs mt-1 font-medium">
        {deliveryLabel[status]?.label}
      </p>
    </div>
  );
}

export default function PatientDashboardClient() {
  const router = useRouter();
  const { openLogin, user: authUser, setUser: setAuthUser } = useAuth();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "all">("upcoming");
  const [selected, setSelected] = useState<Appointment | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          openLogin("reauth");
          return;
        }
        setUser(data.user);
        // Also sync to global auth context
        setAuthUser(data.user);
        fetchAppointments();
      })
      .catch(() => openLogin("reauth"));
  }, [openLogin, setAuthUser]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/patient/appointments");
      if (res.status === 401) {
        openLogin("reauth");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/patient-logout", { method: "POST" });
    setAuthUser(null);
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const filtered = appointments.filter((a) => {
    if (activeTab === "upcoming") return ["payment_pending","payment_verification_pending","confirmed"].includes(a.status);
    if (activeTab === "completed") return ["completed","cancelled"].includes(a.status);
    return true;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-hero-gradient pt-24 pb-20">
          <div className="container-pad max-w-4xl">
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="skeleton h-32 w-full rounded-3xl" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-hero-gradient pt-24 pb-24">
        <div className="container-pad max-w-4xl">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-2xl bg-green-gradient flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-green-900 font-bold text-lg leading-tight">{user?.name}</p>
                  <p className="text-green-500 text-xs">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={fetchAppointments}
                className="p-2 rounded-xl bg-white border border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                title="Refresh">
                <FiRefreshCw className="w-4 h-4" />
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
                <FiLogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Link href="/book"
              className="flex items-center gap-3 bg-green-gradient text-white rounded-2xl p-4 hover:opacity-90 transition-opacity">
              <FiCalendar className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold text-sm">Book New Appointment</span>
            </Link>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white rounded-2xl p-4 hover:bg-[#1fba59] transition-colors">
              <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold text-sm">WhatsApp Doctor</span>
            </a>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {(["upcoming","completed","all"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? "bg-green-gradient text-white shadow-soft"
                    : "bg-white text-green-700 border border-green-200 hover:bg-green-50"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Appointments list */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-green-100 shadow-card">
              <FiCalendar className="w-12 h-12 text-green-200 mx-auto mb-3" />
              <p className="text-green-700 font-medium">No appointments found</p>
              <p className="text-green-400 text-sm mt-1">
                {activeTab === "upcoming" ? "Book your first appointment below." : "All appointments will appear here."}
              </p>
              <Link href="/book" className="btn-primary mt-4 inline-flex">
                Book Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((appt) => {
                const st = statusLabel[appt.status] || { label: appt.status, color: "bg-gray-100 text-gray-600" };
                return (
                  <div key={appt._id} className="bg-white rounded-3xl border border-green-100 shadow-card overflow-hidden">
                    {/* Card header */}
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.color}`}>
                            {st.label}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            appt.type === "online" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {appt.type === "online" ? "💻 Online" : "🏥 Clinic Visit"}
                          </span>
                          {appt.tokenNumber && (
                            <span className="px-2.5 py-1 bg-green-900 text-green-100 rounded-full text-xs font-mono font-semibold">
                              {appt.tokenNumber}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-green-700">
                          <span className="flex items-center gap-1.5">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {appt.preferredDate}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FiClock className="w-3.5 h-3.5" />
                            {appt.preferredTime}
                          </span>
                        </div>

                        {appt.symptoms && (
                          <p className="text-green-600 text-xs mt-1.5 line-clamp-2">{appt.symptoms}</p>
                        )}

                        {/* Delivery tracker */}
                        {appt.type === "online" && appt.deliveryStatus !== "not_applicable" && (
                          <DeliveryTracker status={appt.deliveryStatus} />
                        )}

                        {/* Payment rejection notice */}
                        {appt.paymentStatus === "payment_rejected" && (
                          <div className="mt-2 flex items-start gap-2 bg-red-50 rounded-xl p-2.5 border border-red-200">
                            <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-xs">
                              Payment rejected: {appt.paymentRejectionReason || "Please resubmit."}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setSelected(selected?._id === appt._id ? null : appt)}
                        className="text-green-600 text-sm font-medium hover:text-green-800 transition-colors flex-shrink-0"
                      >
                        {selected?._id === appt._id ? "Hide" : "Details"}
                      </button>
                    </div>

                    {/* Expanded details */}
                    {selected?._id === appt._id && (
                      <div className="border-t border-green-50 p-5 space-y-5 bg-green-50/30">

                        {/* Meet link */}
                        {appt.meetLink && (
                          <div>
                            <p className="text-green-800 font-semibold text-sm mb-2">🎥 Google Meet</p>
                            <a href={appt.meetLink} target="_blank" rel="noopener noreferrer"
                              className="btn-primary !py-2 !text-sm inline-flex">
                              <FiExternalLink className="w-4 h-4" />
                              Join Consultation
                            </a>
                          </div>
                        )}

                        {/* Prescriptions */}
                        {appt.prescriptions.length > 0 && (
                          <div>
                            <p className="text-green-800 font-semibold text-sm mb-2 flex items-center gap-2">
                              <FiFileText className="w-4 h-4" /> Prescriptions
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {appt.prescriptions.map((p, i) => (
                                <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-green-200 text-green-700 text-xs font-medium hover:bg-green-50 transition-colors">
                                  {p.type === "pdf" ? "📄" : "🖼️"}
                                  Prescription {i + 1}
                                  <FiDownload className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Consultation notes */}
                        {appt.consultationNotes.length > 0 && (
                          <div>
                            <p className="text-green-800 font-semibold text-sm mb-3 flex items-center gap-2">
                              <FiFileText className="w-4 h-4" /> Doctor's Advice
                            </p>
                            <div className="space-y-3">
                              {appt.consultationNotes.map((note) => (
                                <div key={note._id} className="bg-white rounded-2xl p-4 border border-green-100">
                                  <p className="text-green-900 text-sm font-medium mb-2">{note.advice}</p>
                                  {note.medicines.length > 0 && (
                                    <div className="mb-2">
                                      <p className="text-green-600 text-xs font-semibold mb-1">💊 Medicines</p>
                                      <div className="flex flex-wrap gap-1">
                                        {note.medicines.map((m, i) => (
                                          <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                                            {m}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {note.notes && (
                                    <p className="text-green-600 text-xs mt-1">📝 {note.notes}</p>
                                  )}
                                  {note.followUpDate && (
                                    <p className="text-amber-700 text-xs mt-1 font-medium">
                                      📅 Follow-up: {new Date(note.followUpDate).toLocaleDateString("en-IN")}
                                    </p>
                                  )}
                                  <p className="text-green-400 text-xs mt-2">
                                    Added {new Date(note.addedAt).toLocaleDateString("en-IN")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Re-upload payment if rejected */}
                        {appt.paymentStatus === "payment_rejected" && (
                          <Link href={`/book?reupload=${appt._id}`}
                            className="btn-primary inline-flex !py-2 !text-sm">
                            Resubmit Payment
                          </Link>
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
      <Footer />
      <WhatsAppButton />
    </>
  );
}
