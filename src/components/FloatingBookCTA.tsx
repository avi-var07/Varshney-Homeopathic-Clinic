"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCalendar } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const HIDDEN_PATHS = ["/book", "/doctor", "/admin"];

export default function FloatingBookCTA() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  const isDoctor = user?.role === "doctor";
  const isAdmin  = user?.role === "admin";
  const isHidden = HIDDEN_PATHS.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isHidden || isDoctor || isAdmin) return null;

  return (
    <div
      className={`fixed bottom-24 md:bottom-10 left-4 md:left-6 z-40 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <Link
        href="/book"
        className="flex items-center gap-3 px-4 py-3 bg-green-gradient text-white font-bold rounded-2xl shadow-xl hover:shadow-glow transition-shadow cursor-pointer select-none book-pulse-ring"
        aria-label="Book appointment"
      >
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <FiCalendar className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none whitespace-nowrap">Book Appointment</p>
          <p className="text-green-200 text-[11px] mt-0.5 font-medium whitespace-nowrap">
            Limited slots today!
          </p>
        </div>
      </Link>
    </div>
  );
}
