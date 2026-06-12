"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCalendar, FiFileText, FiUsers, FiImage,
  FiLogOut, FiCheck, FiX, FiClock, FiTrendingUp,
  FiStar, FiEdit, FiTrash2, FiPlus, FiEye,
  FiRefreshCw, FiVideo,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { CLINIC_NAME } from "@/lib/constants";

/* ─────────────────────── types ─────────────────────── */
interface Appointment {
  _id: string;
  fullName: string;
  mobile: string;
  age: string;
  problem?: string;
  symptoms?: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface Review {
  _id: string;
  name: string;
  location?: string;
  problem?: string;
  rating: number;
  text: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
}

interface Blog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  readTime?: string;
}

const statusColors: Record<string, string> = {
  pending:                       "bg-amber-100 text-amber-700",
  payment_pending:               "bg-amber-100 text-amber-700",
  payment_verification_pending:  "bg-blue-100 text-blue-700",
  confirmed:                     "bg-blue-100 text-blue-700",
  completed:                     "bg-green-100 text-green-700",
  cancelled:                     "bg-red-100 text-red-700",
};

const BLOG_CATEGORIES = [
  "Skin Problems","Hair Care","Migraine","Acidity","Child Health",
  "Women's Health","Seasonal Health","Lifestyle Tips","Homeopathy Education",
];

const emptyBlog: Blog = {
  title: "", slug: "", excerpt: "", content: "",
  category: "Homeopathy Education", tags: [], published: false, readTime: "",
};

/* ─────────────────────── component ─────────────────── */
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("appointments");

  /* appointments */
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });

  /* reviews */
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  /* blogs */
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogForm, setBlogForm] = useState<Blog>(emptyBlog);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [blogModalOpen, setBlogModalOpen] = useState(false);

  /* auth check */
  useEffect(() => {
    const check = async () => {
      const res = await fetch("/api/appointments?limit=1");
      if (res.status === 401) { router.push("/admin"); }
    };
    check();
    fetchAppointments();
  }, []);

  /* ── appointments ── */
  const fetchAppointments = async () => {
    setApptLoading(true);
    try {
      const res = await fetch("/api/appointments?limit=50");
      if (res.status === 401) { router.push("/admin"); return; }
      if (res.ok) {
        const data = await res.json();
        const appts: Appointment[] = data.appointments || [];
        setAppointments(appts);
        setStats({
          total:     appts.length,
          pending:   appts.filter((a) => ["pending","payment_pending","payment_verification_pending"].includes(a.status)).length,
          confirmed: appts.filter((a) => a.status === "confirmed").length,
          completed: appts.filter((a) => a.status === "completed").length,
        });
      }
    } finally {
      setApptLoading(false);
    }
  };

  const updateApptStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) { toast.success(`Status → ${status}`); fetchAppointments(); }
    } catch { toast.error("Update failed"); }
  };

  /* ── reviews ── */
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch("/api/reviews?limit=50");
      if (res.ok) setReviews((await res.json()).reviews || []);
    } finally { setReviewsLoading(false); }
  };

  const updateReview = async (id: string, patch: Partial<Review>) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) { toast.success("Review updated"); fetchReviews(); }
    } catch { toast.error("Failed"); }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchReviews(); }
  };

  /* ── blogs ── */
  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch("/api/blogs?limit=50");
      if (res.ok) setBlogs((await res.json()).blogs || []);
    } finally { setBlogsLoading(false); }
  };

  const saveBlog = async () => {
    if (!blogForm.title || !blogForm.slug || !blogForm.content || !blogForm.excerpt) {
      toast.error("Title, slug, excerpt and content are required."); return;
    }
    try {
      let res: Response;
      if (editingSlug) {
        res = await fetch(`/api/blogs/${editingSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogForm),
        });
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...blogForm, author: "Dr. Aman Varshney" }),
        });
      }
      const data = await res.json();
      if (res.ok) {
        toast.success(editingSlug ? "Blog updated!" : "Blog created!");
        setBlogModalOpen(false);
        setBlogForm(emptyBlog);
        setEditingSlug(null);
        fetchBlogs();
      } else {
        toast.error(data.message || "Save failed.");
      }
    } catch { toast.error("Save failed."); }
  };

  const deleteBlog = async (slug: string) => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchBlogs(); }
  };

  const openEdit = (blog: Blog) => {
    setBlogForm({ ...blog, tags: blog.tags || [] });
    setEditingSlug(blog.slug);
    setBlogModalOpen(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "reviews" && reviews.length === 0) fetchReviews();
    if (tab === "blogs" && blogs.length === 0) fetchBlogs();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    toast.success("Logged out");
  };

  const tabs = [
    { id: "appointments", label: "Appointments",  icon: FiCalendar },
    { id: "blogs",        label: "Blog Posts",     icon: FiFileText },
    { id: "reviews",      label: "Reviews",        icon: FiStar },
    { id: "gallery",      label: "Gallery",        icon: FiImage },
  ];

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-green-100 shadow-soft sticky top-0 z-50">
        <div className="container-pad flex items-center justify-between h-16">
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
            <Link href="/doctor" className="text-blue-600 text-sm hover:text-blue-700 font-medium hidden sm:block">
              Doctor Panel →
            </Link>
            <Link href="/" className="text-green-600 text-sm hover:text-green-700 font-medium hidden sm:block">
              Website →
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium">
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container-pad py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Appointments", value: stats.total,     icon: FiCalendar,   color: "bg-blue-100 text-blue-600",   bg: "bg-blue-50" },
            { label: "Pending",            value: stats.pending,   icon: FiClock,      color: "bg-amber-100 text-amber-600", bg: "bg-amber-50" },
            { label: "Confirmed",          value: stats.confirmed, icon: FiCheck,      color: "bg-green-100 text-green-600", bg: "bg-green-50" },
            { label: "Completed",          value: stats.completed, icon: FiTrendingUp, color: "bg-purple-100 text-purple-600",bg: "bg-purple-50" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-white shadow-card`}>
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-green-900">{s.value}</p>
              <p className="text-green-600 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-card border border-green-100 overflow-hidden">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-green-100">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-green-700 border-b-2 border-green-600 bg-green-50"
                    : "text-green-500 hover:text-green-700 hover:bg-green-50"
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── Appointments ── */}
            {activeTab === "appointments" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-green-900 text-lg">Patient Appointments</h2>
                  <div className="flex items-center gap-2">
                    <Link href="/doctor"
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                      <FiVideo className="w-3.5 h-3.5" />
                      Doctor Panel
                    </Link>
                    <button onClick={fetchAppointments}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
                      <FiRefreshCw className="w-3.5 h-3.5" />
                      Refresh
                    </button>
                  </div>
                </div>

                {apptLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map((i) => <div key={i} className="skeleton h-16 w-full rounded-2xl" />)}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12 text-green-400">
                    <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No appointments yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-green-100">
                          {["Patient","Mobile","Age","Problem","Date & Time","Status","Actions"].map((h) => (
                            <th key={h} className="text-left text-green-600 font-semibold py-3 px-3 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appt) => (
                          <tr key={appt._id} className="border-b border-green-50 hover:bg-green-50 transition-colors">
                            <td className="py-3 px-3 font-medium text-green-900">{appt.fullName}</td>
                            <td className="py-3 px-3">
                              <a href={`https://wa.me/91${appt.mobile}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-green-600 hover:text-green-700">
                                <FaWhatsapp className="w-3.5 h-3.5" />
                                {appt.mobile}
                              </a>
                            </td>
                            <td className="py-3 px-3 text-green-600">{appt.age}</td>
                            <td className="py-3 px-3 text-green-600 max-w-[140px] truncate">
                              {appt.symptoms || appt.problem || "—"}
                            </td>
                            <td className="py-3 px-3 text-green-600 whitespace-nowrap">
                              {appt.preferredDate}<br/>
                              <span className="text-green-400 text-xs">{appt.preferredTime}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[appt.status] || "bg-gray-100 text-gray-600"}`}>
                                {appt.status.replace(/_/g," ")}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1">
                                {appt.status !== "confirmed" && (
                                  <button onClick={() => updateApptStatus(appt._id,"confirmed")}
                                    className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Confirm">
                                    <FiCheck className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {appt.status !== "completed" && (
                                  <button onClick={() => updateApptStatus(appt._id,"completed")}
                                    className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Complete">
                                    <FiTrendingUp className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {appt.status !== "cancelled" && (
                                  <button onClick={() => updateApptStatus(appt._id,"cancelled")}
                                    className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Cancel">
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

            {/* ── Blogs ── */}
            {activeTab === "blogs" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-green-900 text-lg">Blog Management</h2>
                  <div className="flex gap-2">
                    <button onClick={fetchBlogs}
                      className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                      <FiRefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setBlogForm(emptyBlog); setEditingSlug(null); setBlogModalOpen(true); }}
                      className="btn-primary !py-2 !px-4 !text-sm">
                      <FiPlus className="w-4 h-4" />
                      New Post
                    </button>
                  </div>
                </div>

                {blogsLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map((i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="text-center py-12 text-green-400">
                    <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No blog posts yet</p>
                    <button onClick={() => { setBlogForm(emptyBlog); setEditingSlug(null); setBlogModalOpen(true); }}
                      className="btn-primary mt-4">
                      Write Your First Post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blogs.map((blog) => (
                      <div key={blog.slug} className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className="font-semibold text-green-900 text-sm truncate">{blog.title}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              blog.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {blog.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p className="text-green-500 text-xs">{blog.category} · /{blog.slug}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                            className="p-2 bg-white text-green-600 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
                            <FiEye className="w-3.5 h-3.5" />
                          </a>
                          <button onClick={() => openEdit(blog)}
                            className="p-2 bg-white text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteBlog(blog.slug)}
                            className="p-2 bg-white text-red-600 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Reviews ── */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-green-900 text-lg">Patient Reviews</h2>
                  <button onClick={fetchReviews}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
                    <FiRefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                </div>

                {reviewsLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 text-green-400">
                    <FiStar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id}
                        className={`p-4 rounded-2xl border ${review.approved ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-semibold text-green-900 text-sm">{review.name}</p>
                              {review.location && <span className="text-green-500 text-xs">{review.location}</span>}
                              {review.problem && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                  {review.problem}
                                </span>
                              )}
                              <div className="flex">
                                {[...Array(5)].map((_,i) => (
                                  <FiStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-saffron-400 fill-current" : "text-gray-300"}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-green-700 text-sm leading-relaxed">"{review.text}"</p>
                            <p className="text-green-400 text-xs mt-1">
                              {new Date(review.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => updateReview(review._id, { approved: !review.approved })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                                review.approved
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              }`}>
                              {review.approved ? "✓ Approved" : "Approve"}
                            </button>
                            <button
                              onClick={() => updateReview(review._id, { featured: !review.featured })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                                review.featured
                                  ? "bg-saffron-100 text-saffron-700 hover:bg-saffron-200"
                                  : "bg-white text-green-600 border border-green-200 hover:bg-green-50"
                              }`}>
                              {review.featured ? "★ Featured" : "Feature"}
                            </button>
                            <button onClick={() => deleteReview(review._id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Gallery ── */}
            {activeTab === "gallery" && (
              <div>
                <h2 className="font-bold text-green-900 text-lg mb-5">Gallery Management</h2>
                <div className="text-center py-12 text-green-400">
                  <FiImage className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Upload photos via the public/images folder</p>
                  <p className="text-sm mt-1">Gallery is managed through the codebase. Add images to /public/images/</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Blog Editor Modal ── */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBlogModalOpen(false)} />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-green-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h3 className="font-bold text-green-900 text-lg">
                {editingSlug ? "Edit Blog Post" : "New Blog Post"}
              </h3>
              <button onClick={() => setBlogModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">Title *</label>
                <input value={blogForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
                    setBlogForm({ ...blogForm, title, slug: editingSlug ? blogForm.slug : slug });
                  }}
                  placeholder="Blog post title" className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">Slug *</label>
                  <input value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="url-friendly-slug" className="input-field font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">Category *</label>
                  <select value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="input-field">
                    {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">Read Time</label>
                  <input value={blogForm.readTime || ""}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="5 min read" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">Tags (comma-separated)</label>
                  <input
                    value={blogForm.tags.join(", ")}
                    onChange={(e) => setBlogForm({
                      ...blogForm,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })}
                    placeholder="migraine, homeopathy, natural" className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">Excerpt *</label>
                <textarea value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Brief summary (shown in blog listings)..." rows={2}
                  className="input-field resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">
                  Content * <span className="text-green-400 text-xs">(Markdown supported)</span>
                </label>
                <textarea value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="## Introduction&#10;&#10;Write your blog content here using Markdown...&#10;&#10;## Section 2&#10;&#10;More content..."
                  rows={14} className="input-field resize-none font-mono text-sm" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${blogForm.published ? "bg-green-500" : "bg-gray-300"}`}
                    onClick={() => setBlogForm({ ...blogForm, published: !blogForm.published })}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${blogForm.published ? "left-5" : "left-1"}`} />
                  </div>
                  <span className="text-sm font-medium text-green-800">
                    {blogForm.published ? "Published" : "Save as Draft"}
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={saveBlog} className="btn-primary flex-1 justify-center">
                  <FiCheck className="w-4 h-4" />
                  {editingSlug ? "Update Post" : "Publish Post"}
                </button>
                <button onClick={() => setBlogModalOpen(false)} className="btn-secondary px-6">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
