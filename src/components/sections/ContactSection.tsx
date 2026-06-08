"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  CLINIC_NAME,
  DOCTOR_NAME,
  PHONE,
  LOCATION,
  WHATSAPP_LINK,
  CLINIC_TIMINGS,
  MAPS_SHARE_URL,
  MAPS_DIRECTIONS_URL,
  MAPS_EMBED_URL,
} from "@/lib/constants";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { FiClock, FiMail, FiSend } from "react-icons/fi";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", mobile: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setForm({ name: "", mobile: "", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast.error("Could not send message. Please WhatsApp us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-pad bg-white">
      <div className="container-pad">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-green mb-3">Get In Touch</span>
          <h2 className="section-title mb-4">
            Visit Us or <span className="text-gradient">Contact Us</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            We're here to answer your questions and help you take the first step toward healing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {/* Phone */}
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-4 bg-green-50 rounded-3xl p-5 border border-green-100 hover:border-green-300 hover:shadow-soft transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-gradient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FaPhone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-green-500 text-xs font-medium uppercase tracking-wide">
                  Call / WhatsApp
                </p>
                <p className="text-green-900 font-bold text-lg">{PHONE}</p>
                <p className="text-green-500 text-xs">Available during clinic hours</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#f0fdf4] rounded-3xl p-5 border border-[#bbf7d0] hover:shadow-soft transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FaWhatsapp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-green-500 text-xs font-medium uppercase tracking-wide">
                  WhatsApp
                </p>
                <p className="text-green-900 font-bold">Chat with Doctor</p>
                <p className="text-green-500 text-xs">Instant consultation available</p>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-start gap-4 bg-saffron-50 rounded-3xl p-5 border border-saffron-100">
              <div className="w-12 h-12 rounded-2xl bg-saffron-500 flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-saffron-600 text-xs font-medium uppercase tracking-wide">
                  Address
                </p>
                <p className="text-green-900 font-bold">{CLINIC_NAME}</p>
                <p className="text-green-600 text-sm leading-relaxed">{LOCATION}</p>
              </div>
            </div>

            {/* Timings */}
            <div className="bg-green-900 rounded-3xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <FiClock className="w-4 h-4 text-green-300" />
                <p className="font-bold text-sm">Clinic Timings</p>
              </div>
              {CLINIC_TIMINGS.map((t) => (
                <div
                  key={t.day}
                  className="flex justify-between text-xs py-1.5 border-b border-green-800 last:border-0"
                >
                  <span className="text-green-300">{t.day}</span>
                  <span className="text-white font-medium">{t.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map & Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map - Google Maps Embed */}
            <div className="rounded-3xl overflow-hidden border border-green-100 shadow-card h-64 relative">
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Varshney Homeopathic Clinic Location - Mughalsarai, Chandauli"
                className="w-full h-full"
              />
              {/* Overlay link */}
              <a
                href={MAPS_SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-white rounded-xl px-3 py-2 text-xs font-semibold text-green-700 shadow-card flex items-center gap-1.5 hover:bg-green-50 transition-colors border border-green-100"
              >
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-green-600" />
                Open in Maps
              </a>
            </div>

            {/* Inquiry Form */}
            <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-card">
              <h3 className="text-lg font-bold text-green-900 mb-5 flex items-center gap-2">
                <FiSend className="w-5 h-5 text-green-600" />
                Send a Quick Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Full name"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="10-digit number"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary flex-1 justify-center disabled:opacity-60"
                  >
                    {sending ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
