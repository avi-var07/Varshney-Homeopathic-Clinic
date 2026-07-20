"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiX, FiMail, FiArrowRight, FiCheck, FiUser, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { CLINIC_NAME } from "@/lib/constants";

type Step = "email" | "otp" | "done";

export default function LoginModal() {
  const { closeLogin, setUser, loginMode } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") closeLogin(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [closeLogin]);

  // Reset when loginMode changes
  useEffect(() => {
    setStep("email");
    setOtp(["", "", "", "", "", ""]);
    setDevOtp(null);
  }, [loginMode]);

  const sendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        setCooldown(60);
        if (data.devOtp) {
          setDevOtp(data.devOtp);
          toast("🔧 Dev mode — OTP shown below", { icon: "🔧", duration: 5000 });
        } else {
          toast.success("OTP sent! Check your inbox.");
        }
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) { setOtp(text.split("")); inputRefs.current[5]?.focus(); }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) { toast.error("Enter all 6 digits."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otpValue }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user.role === "doctor") {
          // Doctor should use the dedicated /doctor/login page
          toast.success("Doctor login successful!");
          closeLogin();
          router.push("/doctor");
        } else {
          setUser(data.user);
          setStep("done");
          toast.success(`Welcome${isNewUser ? "" : " back"}, ${data.user.name}! 🌿`);
          setTimeout(closeLogin, 1200);
        }
      } else {
        toast.error(data.message || "Invalid OTP.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeLogin} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-4xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-gradient px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">
              {step === "done" ? "You're in! 🌿" : "Patient Login"}
            </h2>
            <p className="text-green-200 text-xs mt-0.5">
              {step === "email" ? `${CLINIC_NAME}` : step === "otp" ? `OTP sent to ${email}` : "Redirecting…"}
            </p>
          </div>
          <button onClick={closeLogin}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">

          {/* Done */}
          {step === "done" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-800 font-bold text-lg">Logged In!</p>
              <p className="text-green-500 text-sm mt-1">Taking you to your dashboard…</p>
            </div>
          )}

          {/* Email step */}
          {step === "email" && (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-sm text-green-700">
                <p className="font-semibold mb-1">No password needed 🔒</p>
                <p className="text-green-500 text-xs">Enter your email to get a 6-digit OTP. New patients are registered automatically.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {["Returning Patient", "New Patient"].map((label, i) => (
                  <button key={label} onClick={() => setIsNewUser(i === 1)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      isNewUser === (i === 1)
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-green-200 bg-white text-green-400 hover:border-green-300"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              {isNewUser && (
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name" className="input-field pl-10" autoFocus />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    placeholder="you@example.com" className="input-field pl-10"
                    autoFocus={!isNewUser} autoComplete="email" />
                </div>
              </div>

              <button onClick={sendOtp} disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-60">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FiArrowRight className="w-4 h-4" />}
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>

              <p className="text-center text-green-400 text-xs">
                Are you the doctor? <Link href="/doctor/login" onClick={closeLogin} className="text-green-600 font-medium underline underline-offset-2">Doctor Login →</Link>
              </p>
            </div>
          )}

          {/* OTP step */}
          {step === "otp" && (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center">
                <p className="text-green-700 text-sm font-medium">OTP sent to <strong>{email}</strong></p>
                <p className="text-green-400 text-xs mt-1">Valid for 5 minutes · Check inbox and spam</p>
              </div>

              {devOtp && (
                <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl p-4 text-center">
                  <p className="text-amber-700 text-xs font-bold uppercase tracking-wide mb-1">🔧 Dev Mode OTP</p>
                  <p className="text-amber-900 font-mono font-bold text-3xl tracking-[0.5em]">{devOtp}</p>
                  <button onClick={() => { setOtp(devOtp.split("")); inputRefs.current[5]?.focus(); }}
                    className="mt-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
                    Auto-fill
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-3 text-center">Enter the 6-digit code</label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                        ${digit ? "border-green-500 bg-green-50 text-green-900" : "border-green-200 bg-white text-green-900"}
                        focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                    />
                  ))}
                </div>
              </div>

              <button onClick={verifyOtp} disabled={loading || otp.join("").length < 6}
                className="btn-primary w-full justify-center disabled:opacity-60">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FiCheck className="w-4 h-4" />}
                {loading ? "Verifying…" : "Verify & Login"}
              </button>

              <div className="flex items-center justify-between text-xs">
                <button onClick={() => { setStep("email"); setOtp(["","","","","",""]); setDevOtp(null); }}
                  className="text-green-500 hover:text-green-700">← Change email</button>
                <button onClick={sendOtp} disabled={cooldown > 0 || loading}
                  className="text-green-600 hover:text-green-800 disabled:text-green-300 font-medium flex items-center gap-1">
                  <FiRefreshCw className="w-3 h-3" />
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
