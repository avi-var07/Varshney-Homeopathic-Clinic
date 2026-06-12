"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiX, FiMail, FiArrowRight, FiCheck,
  FiUser, FiLock, FiRefreshCw, FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { CLINIC_NAME, DOCTOR_NAME } from "@/lib/constants";

type Mode = "patient" | "doctor" | "reauth";
type Step = "email" | "otp" | "done";

export default function LoginModal() {
  const { closeLogin, setUser, loginMode } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>(loginMode);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail]     = useState("");
  const [name, setName]       = useState("");
  const [otp, setOtp]         = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [devOtp, setDevOtp]   = useState<string | null>(null);

  // Admin login form (doctor mode)
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") closeLogin(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [closeLogin]);

  // Sync mode when context loginMode changes (e.g. openLogin("reauth") called externally)
  useEffect(() => {
    setMode(loginMode);
    setStep("email");
    setOtp("");
    setDevOtp(null);
  }, [loginMode]);

  // Reset step when mode changes locally
  useEffect(() => {
    setStep("email");
    setOtp("");
    setDevOtp(null);
  }, [mode]);

  // ── OTP send ────────────────────────────────────────────────────────────
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
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP verify ──────────────────────────────────────────────────────────
  const verifyOtp = async () => {
    if (otp.trim().length !== 6) {
      toast.error("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setStep("done");
        setDevOtp(null);

        // Redirect doctor to /doctor dashboard
        if (data.user.role === "doctor") {
          toast.success(`Welcome, ${DOCTOR_NAME}! 🌿`);
          setTimeout(() => { closeLogin(); router.push("/doctor"); }, 1200);
        } else {
          toast.success(`Welcome${isNewUser ? "" : " back"}, ${data.user.name}! 🌿`);
          setTimeout(closeLogin, 1500);
        }
      } else {
        toast.error(data.message || "Invalid OTP.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Admin (doctor) login via username/password ───────────────────────────
  const adminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser || !adminPass) { toast.error("Enter username and password."); return; }
    setAdminLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUser, password: adminPass }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Doctor login successful! Redirecting…");
        closeLogin();
        router.push("/doctor");
      } else {
        toast.error(data.message || "Invalid credentials.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setAdminLoading(false);
    }
  };

  // ── Header text ─────────────────────────────────────────────────────────
  const headerTitle = {
    patient: step === "done" ? "Welcome!" : "Sign In / Sign Up",
    doctor:  "Doctor Login",
    reauth:  "Re-authenticate",
  }[mode];

  const headerSub = {
    patient: step === "email"
      ? `Patient portal · ${CLINIC_NAME}`
      : step === "otp"
      ? `OTP sent to ${email}`
      : "You're logged in",
    doctor: "Restricted — Doctor only",
    reauth: "Your session expired. Verify again.",
  }[mode];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeLogin} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-4xl shadow-2xl overflow-hidden animate-slide-up">

        {/* Header */}
        <div className={`px-6 py-5 flex items-center justify-between ${
          mode === "doctor" ? "bg-gradient-to-r from-green-900 to-green-800"
          : "bg-green-gradient"
        }`}>
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              {mode === "doctor" && <FiShield className="w-5 h-5 text-saffron-300" />}
              {headerTitle}
            </h2>
            <p className="text-green-200 text-xs mt-0.5">{headerSub}</p>
          </div>
          <button onClick={closeLogin}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Mode switcher tabs — shown only on email step */}
        {(step === "email" || mode === "doctor") && mode !== "reauth" && (
          <div className="flex border-b border-green-100">
            <button
              onClick={() => setMode("patient")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                mode === "patient"
                  ? "text-green-700 border-b-2 border-green-600 bg-green-50"
                  : "text-green-400 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <FiUser className="w-4 h-4" />
              Patient
            </button>
            <button
              onClick={() => setMode("doctor")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                mode === "doctor"
                  ? "text-green-900 border-b-2 border-green-900 bg-green-50"
                  : "text-green-400 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <FiShield className="w-4 h-4" />
              Doctor
            </button>
          </div>
        )}

        <div className="p-6">

          {/* ── SUCCESS ── */}
          {step === "done" && mode !== "doctor" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-800 font-bold text-lg">Logged In!</p>
              <p className="text-green-500 text-sm mt-1">Redirecting you…</p>
            </div>
          )}

          {/* ── DOCTOR LOGIN ── */}
          {mode === "doctor" && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-amber-800 text-sm font-semibold flex items-center gap-2">
                  <FiShield className="w-4 h-4" />
                  Restricted Access
                </p>
                <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                  This login is for <strong>{DOCTOR_NAME}</strong> only. Unauthorised access is prohibited.
                </p>
              </div>

              <form onSubmit={adminLogin} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">Username</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input
                      type="text"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="Doctor username"
                      className="input-field pl-10"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="Doctor password"
                      className="input-field pl-10 pr-10"
                      autoComplete="current-password"
                      required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-600 transition-colors">
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={adminLoading}
                  className="btn-primary w-full justify-center disabled:opacity-60 !bg-gradient-to-r !from-green-900 !to-green-800">
                  {adminLoading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <FiShield className="w-4 h-4" />}
                  {adminLoading ? "Signing in…" : "Doctor Sign In"}
                </button>
              </form>

              <div className="relative flex items-center gap-3 pt-2">
                <div className="flex-1 h-px bg-green-100" />
                <span className="text-green-400 text-xs">or use OTP</span>
                <div className="flex-1 h-px bg-green-100" />
              </div>

              {/* Doctor can also log in via OTP to their registered email */}
              <button
                onClick={() => { setMode("patient"); setIsNewUser(false); }}
                className="w-full text-center text-green-600 text-sm hover:text-green-800 font-medium transition-colors"
              >
                Sign in with Email OTP instead →
              </button>
            </div>
          )}

          {/* ── PATIENT EMAIL STEP ── */}
          {(mode === "patient" || mode === "reauth") && step === "email" && (
            <div className="space-y-4">
              {mode === "reauth" ? (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-sm text-amber-800 flex items-start gap-2">
                  <FiRefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Session Expired</p>
                    <p className="text-xs text-amber-700 mt-0.5">Enter your email to receive a new OTP and sign in again.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-sm text-green-700">
                  <p className="font-semibold mb-1">No password needed 🔒</p>
                  <p className="text-green-600 text-xs leading-relaxed">
                    Enter your email to receive a 6-digit OTP. New patients are registered automatically on first login.
                  </p>
                </div>
              )}

              {mode === "patient" && (
                <div className="grid grid-cols-2 gap-2">
                  {(["Returning Patient", "New Patient"] as const).map((label, i) => (
                    <button key={label}
                      onClick={() => setIsNewUser(i === 1)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        isNewUser === (i === 1)
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-green-200 bg-white text-green-500 hover:border-green-300"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {isNewUser && mode === "patient" && (
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input type="text" value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="input-field pl-10" autoFocus />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                  <input type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                    autoFocus={!isNewUser}
                    autoComplete="email" />
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
                Your data is used only for appointment management.
              </p>
            </div>
          )}

          {/* ── OTP STEP ── */}
          {(mode === "patient" || mode === "reauth") && step === "otp" && (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center">
                <p className="text-green-700 text-sm font-medium">
                  OTP sent to <strong>{email}</strong>
                </p>
                <p className="text-green-500 text-xs mt-1">
                  Check your inbox (and spam folder) · Valid for 10 minutes
                </p>
              </div>

              {/* Dev mode OTP display */}
              {devOtp && (
                <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl p-4 text-center">
                  <p className="text-amber-700 text-xs font-bold uppercase tracking-wide mb-1">
                    🔧 Dev Mode — Your OTP
                  </p>
                  <p className="text-amber-900 font-mono font-bold text-3xl tracking-[0.5em]">
                    {devOtp}
                  </p>
                  <button onClick={() => setOtp(devOtp)}
                    className="mt-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-semibold transition-colors">
                    Auto-fill OTP
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">
                  Enter 6-digit OTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" inputMode="numeric" maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                  placeholder="• • • • • •"
                  className="input-field text-center text-2xl font-bold tracking-[0.5em]"
                  autoFocus
                />
              </div>

              <button onClick={verifyOtp} disabled={loading || otp.length < 6}
                className="btn-primary w-full justify-center disabled:opacity-60">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FiCheck className="w-4 h-4" />}
                {loading ? "Verifying…" : "Verify & Login"}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button onClick={() => { setStep("email"); setOtp(""); setDevOtp(null); }}
                  className="text-green-500 hover:text-green-700 transition-colors flex items-center gap-1">
                  ← Change email
                </button>
                <button onClick={sendOtp} disabled={cooldown > 0 || loading}
                  className="text-green-600 hover:text-green-800 disabled:text-green-300 font-medium transition-colors flex items-center gap-1">
                  <FiRefreshCw className="w-3 h-3" />
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          )}

          {/* ── Doctor footer note ── */}
          {mode === "patient" && step === "email" && (
            <div className="mt-4 pt-4 border-t border-green-100 text-center">
              <p className="text-green-400 text-xs">
                Are you{" "}
                <button
                  onClick={() => setMode("doctor")}
                  className="text-green-600 font-semibold hover:text-green-800 transition-colors underline"
                >
                  {DOCTOR_NAME}?
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
