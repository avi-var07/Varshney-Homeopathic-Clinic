"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { WHATSAPP_LINK } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";
import { FiMail, FiBell, FiUsers } from "react-icons/fi";

const healthTips = [
  {
    emoji: "💧",
    tip: "Drink warm water with a pinch of turmeric every morning to boost immunity.",
    category: "Daily Wellness",
  },
  {
    emoji: "🌿",
    tip: "Neem leaves chewed on an empty stomach help purify blood and prevent skin issues.",
    category: "Natural Remedies",
  },
  {
    emoji: "🧘",
    tip: "10 minutes of deep breathing daily reduces anxiety and improves lung health.",
    category: "Mental Wellness",
  },
  {
    emoji: "🍋",
    tip: "Warm lemon water in the morning aids digestion and prevents acidity.",
    category: "Digestive Health",
  },
];

export default function CommunitySection() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !mobile) {
      toast.error("Please enter your email or mobile number");
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("🎉 You've subscribed to health tips!");
    setEmail("");
    setMobile("");
    setSubmitting(false);
  };

  return (
    <section id="community" className="section-pad bg-gradient-to-br from-green-900 to-green-800">
      <div className="container-pad">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Community & Tips */}
          <div className="text-white">
            <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
              🌱 Wellness Community
            </span>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Stay Connected,{" "}
              <span className="text-saffron-300">Stay Healthy</span>
            </h2>
            <p className="text-green-200 text-lg leading-relaxed mb-8">
              Join our growing community of health-conscious families. Get free weekly health tips, seasonal health alerts, and health camp notifications.
            </p>

            {/* Daily Health Tips */}
            <div className="space-y-3 mb-8">
              <p className="text-green-300 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                <FiBell className="w-4 h-4" />
                Today's Health Tips
              </p>
              {healthTips.slice(0, 3).map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                  <div>
                    <span className="text-green-300 text-xs font-medium">{tip.category}</span>
                    <p className="text-white text-sm leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Community */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#25D366] hover:bg-[#1fba59] rounded-3xl p-5 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <FaWhatsapp className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Join Our WhatsApp Community</p>
                <p className="text-green-100 text-sm">
                  Free health tips, camp announcements & instant doctor access
                </p>
              </div>
              <span className="text-white text-xl group-hover:translate-x-1 transition-transform ml-auto">
                →
              </span>
            </a>
          </div>

          {/* Right: Newsletter & Events */}
          <div className="space-y-6">
            {/* Newsletter */}
            <div className="bg-white rounded-4xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-green-900 font-bold text-lg">Free Health Newsletter</h3>
                  <p className="text-green-500 text-sm">Weekly tips, NO spam</p>
                </div>
              </div>

              <form onSubmit={handleNewsletter} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="input-field"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-green-100"></div>
                  <span className="text-green-400 text-xs px-2">OR</span>
                  <div className="flex-1 h-px bg-green-100"></div>
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile for SMS health tips"
                  className="input-field"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <FiBell className="w-4 h-4" />
                  )}
                  Subscribe to Health Tips
                </button>
              </form>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <FiUsers className="w-5 h-5 text-green-300" />
                Upcoming Health Camps
              </h3>
              {[
                {
                  icon: "🏕️",
                  title: "Free Homeopathy Camp",
                  date: "Every Sunday",
                  location: "Mughalsarai",
                  type: "Free",
                },
                {
                  icon: "👶",
                  title: "Child Health Checkup Camp",
                  date: "Monthly",
                  location: "Clinic",
                  type: "Free",
                },
              ].map((event) => (
                <div
                  key={event.title}
                  className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0"
                >
                  <span className="text-2xl">{event.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{event.title}</p>
                    <p className="text-green-300 text-xs">
                      {event.date} · {event.location}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded-full text-xs font-medium">
                    {event.type}
                  </span>
                </div>
              ))}

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center text-green-300 hover:text-white text-sm font-medium transition-colors"
              >
                Get camp notifications via WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
