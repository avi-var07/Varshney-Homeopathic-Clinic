"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DOCTOR_NAME, CLINIC_NAME } from "@/lib/constants";

// The doctor email is fixed — no password, no input for email
const DOCTOR_EMAIL = "thehomeobytes@gmail.com";

type Stage = "email" | "otp";

export default function DoctorLoginClient() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if already logged in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role === "doctor") router.replace("/doctor");
      })
      .catch(() => {});
  }, [router]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const sendOtp = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: DOCTOR_EMAIL }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to send OTP.");
        return;
      }
      toast.success("OTP sent to your email.");
      setStage("otp");
      setResendCooldown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: DOCTOR_EMAIL, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid OTP.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }
      toast.success("Welcome back, Doctor!");
      router.replace("/doctor");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-green-gradient shadow-glow flex items-center justify-center mx-auto mb-4 text-4xl">
            🌿
          </div>
          <h1 className="text-2xl font-bold text-green-900">{CLINIC_NAME}</h1>
          <p className="text-green-600 text-sm mt-1">Doctor Workspace</p>
        </div>

        <div className="bg-white rounded-4xl shadow-card border border-green-100 p-8">

          {stage === "email" && (
            <>
              <h2 className="text-xl font-bold text-green-900 mb-1">Good morning, Doctor 👋</h2>
              <p className="text-green-600 text-sm mb-8">We'll send a login code to your registered email.</p>

              {/* Fixed email display */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-800 mb-2">Your Email</label>
                <div className="flex items-center gap-3 px-4 py-3.5 bg-green-50 border-2 border-green-200 rounded-xl">
                  <span className="text-lg">📧</span>
                  <div>
                    <p className="text-green-900 font-semibold text-sm">{DOCTOR_EMAIL}</p>
                    <p className="text-green-500 text-xs">Read-only — permanently registered</p>
                  </div>
                </div>
              </div>

              <button
                onClick={sendOtp}
                disabled={sending}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="text-center text-green-500 text-xs mt-4">
                OTP expires in 5 minutes · Secure login
              </p>
            </>
          )}

          {stage === "otp" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => { setStage("email"); setOtp(["", "", "", "", "", ""]); }}
                  className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors flex-shrink-0 text-lg"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-xl font-bold text-green-900">Enter OTP</h2>
                  <p className="text-green-600 text-sm">Sent to {DOCTOR_EMAIL}</p>
                </div>
              </div>

              {/* OTP Input */}
              <div className="flex gap-3 justify-center mb-8" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all
                      ${digit
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-green-200 bg-white text-green-900"
                      }
                      focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={verifying || otp.join("").length < 6}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 mb-4"
              >
                {verifying ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Login →"
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                {resendCooldown > 0 ? (
                  <p className="text-green-500 text-sm">
                    Resend in <span className="font-bold text-green-700">{resendCooldown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={sendOtp}
                    disabled={sending}
                    className="text-green-600 hover:text-green-700 text-sm font-medium underline underline-offset-2"
                  >
                    {sending ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <p className="text-center text-green-400 text-xs mt-6">
          {DOCTOR_NAME} · {CLINIC_NAME}
        </p>
      </div>
    </main>
  );
}
