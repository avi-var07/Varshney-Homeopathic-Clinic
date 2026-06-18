"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, PHONE, WHATSAPP_LINK, CLINIC_NAME } from "@/lib/constants";
import { FiMenu, FiX, FiPhone, FiUser, FiLogOut, FiCalendar, FiChevronDown } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const LOGO_URL = "https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270570/vhc-site/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, openLogin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setIsOpen(false);
    router.push("/");
  };

  const isDoctor = user?.role === "doctor";
  const isAdmin  = user?.role === "admin";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-white/98 backdrop-blur-lg shadow-soft border-b border-green-100"
            : "bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="w-full px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-[60px] md:h-[68px]">

            {/* ── LOGO ── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0 min-w-0"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={LOGO_URL}
                  alt={`${CLINIC_NAME} Logo`}
                  fill
                  className="object-contain"
                  priority
                  sizes="48px"
                />
              </div>
              <div className="hidden sm:block leading-tight min-w-0">
                <p className="text-base md:text-[17px] font-extrabold text-green-800 leading-none tracking-tight">
                  Varshney Homeopathic
                </p>
                <p className="text-[11px] md:text-xs text-green-600 leading-tight mt-0.5 font-medium">
                  Clinic · Since 1992
                </p>
              </div>
            </Link>

            {/* ── DESKTOP NAV ── */}
            <div className="hidden lg:flex items-center gap-0 flex-1 justify-center mx-3 xl:mx-6">
              {NAV_LINKS.slice(0, -1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2.5 xl:px-3.5 py-2 text-[13px] xl:text-sm font-medium text-green-800 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-150 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
              {/* Dashboard Link directly in Nav for logged in users */}
              {user && (
                <Link
                  href={isDoctor ? "/doctor" : isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="px-2.5 xl:px-3.5 py-2 text-[13px] xl:text-sm font-medium text-green-800 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-150 whitespace-nowrap"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* ── DESKTOP RIGHT CTAs ── */}
            <div className="hidden md:flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
              {/* Phone — icon only on md, full on xl */}
              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-1.5 px-2.5 xl:px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 rounded-xl transition-colors whitespace-nowrap"
                aria-label="Call clinic"
              >
                <FiPhone className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xl:inline text-[13px]">{PHONE}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 xl:px-3 py-2 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#1fba59] transition-colors whitespace-nowrap"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:hidden xl:inline text-[13px]">WhatsApp</span>
              </a>

              {/* Auth */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-1.5 px-2.5 xl:px-3 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-xl border border-green-200 hover:bg-green-100 transition-colors whitespace-nowrap"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline max-w-[90px] truncate text-[13px]">
                      {user.name.split(" ")[0]}
                    </span>
                    <FiChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-green-50 border-b border-green-100">
                        <p className="font-bold text-green-900 text-sm truncate">{user.name}</p>
                        <p className="text-green-500 text-xs truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                          {user.role}
                        </span>
                      </div>
                      {isDoctor ? (
                        <Link href="/doctor" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors">
                          🩺 Doctor Dashboard
                        </Link>
                      ) : isAdmin ? (
                        <Link href="/admin/dashboard" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors">
                          ⚙️ Admin Dashboard
                        </Link>
                      ) : (
                        <>
                          <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors">
                            <FiUser className="w-4 h-4" /> My Dashboard
                          </Link>
                          <Link href="/book" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors">
                            <FiCalendar className="w-4 h-4" /> Book Appointment
                          </Link>
                        </>
                      )}
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-green-100">
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openLogin("patient")}
                  className="flex items-center gap-1.5 px-2.5 xl:px-3 py-2 text-green-700 text-[13px] font-semibold rounded-xl border border-green-200 hover:bg-green-50 transition-colors whitespace-nowrap"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="hidden xl:inline">Login</span>
                </button>
              )}

              {/* Book CTA — always visible on desktop */}
              {!isDoctor && !isAdmin && (
                <Link
                  href="/book"
                  className="flex items-center gap-1.5 px-3 xl:px-4 py-2 bg-green-gradient text-white text-[13px] font-bold rounded-xl shadow-soft hover:shadow-glow transition-all whitespace-nowrap book-pulse-ring"
                >
                  <FiCalendar className="w-4 h-4 flex-shrink-0" />
                  <span>Book Now</span>
                </Link>
              )}
            </div>

            {/* ── MOBILE: Compact right actions + hamburger ── */}
            <div className="flex md:hidden items-center gap-1.5">
              {!user && (
                <button
                  onClick={() => openLogin("patient")}
                  className="p-2 rounded-xl text-green-700 bg-green-50 border border-green-200"
                  aria-label="Login"
                >
                  <FiUser className="w-5 h-5" />
                </button>
              )}
              {user && !isDoctor && !isAdmin && (
                <Link href="/book"
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-gradient text-white text-xs font-bold rounded-xl"
                >
                  <FiCalendar className="w-3.5 h-3.5" />
                  Book
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-green-800 hover:bg-green-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[100vh]" : "max-h-0"}`}>
          <div className="bg-white border-t border-green-100 shadow-soft">
            <div className="w-full px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">

              {/* Logged-in user card */}
              {user && (
                <div className="mb-3 p-3 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-gradient flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-green-900 text-sm leading-none truncate">{user.name}</p>
                    <p className="text-green-500 text-xs mt-0.5 truncate">{user.email}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium capitalize">
                    {user.role}
                  </span>
                </div>
              )}

              {/* Nav links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-green-800 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="pt-3 border-t border-green-100 space-y-2">
                <a href={`tel:${PHONE}`}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-green-700 bg-green-50 rounded-xl">
                  <FiPhone className="w-4 h-4" />
                  {PHONE}
                </a>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1fba59] transition-colors">
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp Consultation
                </a>

                {user ? (
                  <>
                    {isDoctor ? (
                      <Link href="/doctor" onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-green-50 text-green-700 font-semibold rounded-xl border border-green-200">
                        🩺 Doctor Dashboard
                      </Link>
                    ) : isAdmin ? (
                      <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-green-50 text-green-700 font-semibold rounded-xl border border-green-200">
                        ⚙️ Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-3 bg-green-50 text-green-700 font-semibold rounded-xl border border-green-200">
                          <FiUser className="w-4 h-4" />
                          My Dashboard
                        </Link>
                        <Link href="/book" onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-3 bg-green-gradient text-white font-bold rounded-xl book-pulse-ring"
                        >
                          <FiCalendar className="w-5 h-5" />
                          Book Appointment
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200">
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { openLogin("patient"); setIsOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-semibold rounded-xl border-2 border-green-300">
                      <FiUser className="w-4 h-4" />
                      Login / Sign Up
                    </button>
                    <Link href="/book" onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-green-gradient text-white font-bold rounded-xl book-pulse-ring"
                    >
                      <FiCalendar className="w-5 h-5" />
                      Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
