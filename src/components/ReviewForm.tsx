"use client";

import { useState } from "react";
import { FiStar, FiSend, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ReviewForm({ appointmentId }: { appointmentId?: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({
    name: "", location: "", problem: "", text: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    if (!form.name.trim()) { toast.error("Please enter your name."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          location: form.location.trim() || undefined,
          problem: form.problem.trim() || undefined,
          rating,
          text: form.text.trim(),
          appointmentId: appointmentId || undefined,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success("Thank you for your review!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Could not submit. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <FiCheck className="w-7 h-7 text-green-600" />
        </div>
        <p className="text-green-800 font-bold text-base mb-1">Thank you for your feedback!</p>
        <p className="text-green-500 text-sm">Your review has been sent to the clinic.</p>
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
        <div className="flex gap-1 items-center">
          {[1,2,3,4,5].map((star) => (
            <button key={star} type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <FiStar className={`w-8 h-8 transition-colors ${
                star <= (hovered || rating) ? "text-saffron-400 fill-current" : "text-gray-200"
              }`} />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-green-600 font-medium">
              {["","Poor","Fair","Good","Very Good","Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1.5">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name" className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1.5">Location</label>
          <input type="text" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Mughalsarai" className="input-field" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 mb-1.5">Condition Treated</label>
        <input type="text" value={form.problem}
          onChange={(e) => setForm({ ...form, problem: e.target.value })}
          placeholder="e.g. Migraine, PCOD, Hair Fall" className="input-field" />
      </div>

      <div>
        <label className="block text-sm font-medium text-green-800 mb-1.5">
          Your Experience
        </label>
        <textarea value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          placeholder="Share your experience with Dr. Aman Varshney and Varshney Homeopathic Clinic..."
          rows={4} className="input-field resize-none" maxLength={1000} />
        <p className="text-green-400 text-xs mt-1 text-right">{form.text.length}/1000</p>
      </div>

      <button type="submit" disabled={submitting || rating === 0}
        className="btn-primary w-full justify-center disabled:opacity-60">
        {submitting
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <FiSend className="w-4 h-4" />}
        {submitting ? "Submitting…" : "Share Your Experience"}
      </button>
    </form>
  );
}
