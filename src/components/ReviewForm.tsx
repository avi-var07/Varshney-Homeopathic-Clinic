"use client";

import { useState } from "react";
import { FiStar, FiSend, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function ReviewForm({ appointmentId }: { appointmentId?: string }) {
  const { user, openLogin } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({
    name: user?.name || "", location: "", problem: "", title: "", text: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    if (!form.text.trim() || form.text.trim().length < 10) {
      toast.error("Please write at least 10 characters."); return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name || user?.name || "Anonymous",
          email: user?.email,
          rating,
          appointmentId: appointmentId || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast.success("Review submitted! It will be visible after approval.");
      } else {
        toast.error(data.message || "Submission failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <FiCheck className="w-7 h-7 text-green-600" />
        </div>
        <p className="text-green-800 font-bold text-lg mb-1">Thank you for your review!</p>
        <p className="text-green-600 text-sm">It will be visible after our team reviews it.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-green-800 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((star) => (
            <button key={star} type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110">
              <FiStar className={`w-8 h-8 transition-colors ${
                star <= (hovered || rating)
                  ? "text-saffron-400 fill-current"
                  : "text-gray-300"
              }`} />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-green-600 self-center font-medium">
              {["","Poor","Fair","Good","Very Good","Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1.5">Your Name</label>
          <input type="text" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1.5">Location</label>
          <input type="text" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Mughalsarai" className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1.5">Condition Treated</label>
          <input type="text" value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
            placeholder="e.g. Migraine" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1.5">Review Title</label>
          <input type="text" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Life-changing treatment" className="input-field" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 mb-1.5">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          placeholder="Share your experience with Dr. Aman Varshney and Varshney Homeopathic Clinic..."
          rows={4} className="input-field resize-none" required />
        <p className="text-green-400 text-xs mt-1 text-right">{form.text.length}/1000</p>
      </div>

      {!user && (
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-between">
          <p className="text-amber-700 text-sm">
            <strong>Login</strong> to link your review to your consultation
          </p>
          <button type="button" onClick={() => openLogin("patient")}
            className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-colors">
            Login
          </button>
        </div>
      )}

      <button type="submit" disabled={submitting || rating === 0}
        className="btn-primary w-full justify-center disabled:opacity-60">
        {submitting
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <FiSend className="w-4 h-4" />}
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
