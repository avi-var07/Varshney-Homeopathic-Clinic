"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiFileText,
  FiUsers,
  FiImage,
  FiLogOut,
  FiCheck,
  FiX,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { CLINIC_NAME, PHONE } from "@/lib/constants";

interface Appointment {
  _id: string;
  fullName: string;
  mobile: string;
  age: string;
  problem: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });

  useEffect(() => {
    // Auth is now validated server-side via httpOnly cookie on each API call.
    // We just attempt to load data — a 401 means the session expired.
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments?limit=50");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
        const appts = data.appointments || [];
        setStats({
          total: appts.length,
          pending: appts.filter((a: Appointment) => a.status === "pending").length,
          confirmed: appts.filter((a: Appointment) => a.status === "confirmed").length,
          completed: appts.filter((a: Appointment) => a.status === "completed").length,
        });
      }
    } catch {
      // Use mock data if API fails
      setAppointments([]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Status updated to ${status}`);
        fetchAppointments();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    toast.success("Logged out successfully");
  };

  const tabs = [
    { id: "appointments", label: "Appointments", icon: FiCalendar },
    { id: "blogs", label: "Blog Posts", icon: FiFileText },
    { id: "testimonials", label: "Testimonials", icon: FiUsers },
    { id: "gallery", label: "Gallery", icon: FiImage },
  ];

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-green-100 shadow-soft sticky top-0 z-50">
        <div className="container-pad">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-gradient flex items-center justify-center">
                <span className="text-lg">🌿</span>
              </div>
              <div>
                <p className="font-bold text-green-900 text-sm">{CLINIC_NAME}</p>
                <p className="text-green-500 text-xs">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-green-600 text-sm hover:text-green-700 font-medium hidden sm:block"
              >
                View Website →
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-pad py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Appointments", value: stats.total, icon: FiCalendar, color: "bg-blue-100 text-blue-600", bg: "bg-blue-50" },
            { label: "Pending", value: stats.pending, icon: FiClock, color: "bg-amber-100 text-amber-600", bg: "bg-amber-50" },
            { label: "Confirmed", value: stats.confirmed, icon: FiCheck, color: "bg-green-100 text-green-600", bg: "bg-green-50" },
            { label: "Completed", value: stats.completed, icon: FiTrendingUp, color: "bg-purple-100 text-purple-600", bg: "bg-purple-50" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-2xl p-5 border border-white shadow-card`}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-green-900">{stat.value}</p>
              <p className="text-green-600 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-card border border-green-100 overflow-hidden">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-green-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-green-700 border-b-2 border-green-600 bg-green-50"
                    : "text-green-500 hover:text-green-700 hover:bg-green-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-green-900 text-lg">
                    Patient Appointments
                  </h2>
                  <button
                    onClick={fetchAppointments}
                    className="text-green-600 text-sm hover:text-green-700 font-medium"
                  >
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton h-20 w-full"></div>
                    ))}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12 text-green-400">
                    <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No appointments yet</p>
                    <p className="text-sm mt-1">Appointments will appear here when patients book</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-green-100">
                          {["Patient", "Mobile", "Age", "Problem", "Date & Time", "Status", "Actions"].map((h) => (
                            <th key={h} className="text-left text-green-600 font-semibold py-3 px-3 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appt) => (
                          <tr key={appt._id} className="border-b border-green-50 hover:bg-green-50 transition-colors">
                            <td className="py-3 px-3 font-medium text-green-900">{appt.fullName}</td>
                            <td className="py-3 px-3">
                              <a
                                href={`https://wa.me/91${appt.mobile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-green-600 hover:text-green-700"
                              >
                                <FaWhatsapp className="w-3.5 h-3.5" />
                                {appt.mobile}
                              </a>
                            </td>
                            <td className="py-3 px-3 text-green-600">{appt.age}</td>
                            <td className="py-3 px-3 text-green-600 max-w-32 truncate">{appt.problem}</td>
                            <td className="py-3 px-3 text-green-600 whitespace-nowrap">
                              {appt.preferredDate} <br />
                              <span className="text-green-400 text-xs">{appt.preferredTime}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[appt.status] || "bg-gray-100 text-gray-600"}`}>
                                {appt.status}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1">
                                {appt.status !== "confirmed" && (
                                  <button
                                    onClick={() => updateStatus(appt._id, "confirmed")}
                                    className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    title="Confirm"
                                  >
                                    <FiCheck className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {appt.status !== "completed" && (
                                  <button
                                    onClick={() => updateStatus(appt._id, "completed")}
                                    className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                    title="Complete"
                                  >
                                    ✓
                                  </button>
                                )}
                                {appt.status !== "cancelled" && (
                                  <button
                                    onClick={() => updateStatus(appt._id, "cancelled")}
                                    className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Cancel"
                                  >
                                    <FiX className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === "blogs" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-green-900 text-lg">Blog Management</h2>
                  <button className="btn-primary !py-2 !px-4 !text-sm">
                    + New Post
                  </button>
                </div>
                <div className="text-center py-12 text-green-400">
                  <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Blog Editor Coming Soon</p>
                  <p className="text-sm mt-1">Rich text blog creation with SEO tools</p>
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === "testimonials" && (
              <div>
                <h2 className="font-bold text-green-900 text-lg mb-5">Testimonials Management</h2>
                <div className="text-center py-12 text-green-400">
                  <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Testimonials Manager</p>
                  <p className="text-sm mt-1">Review and approve patient testimonials</p>
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === "gallery" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-green-900 text-lg">Gallery Management</h2>
                  <button className="btn-primary !py-2 !px-4 !text-sm">
                    + Upload Photos
                  </button>
                </div>
                <div className="text-center py-12 text-green-400">
                  <FiImage className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Photo Gallery Manager</p>
                  <p className="text-sm mt-1">Upload and manage clinic photos</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
