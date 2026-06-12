"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, PHONE, WHATSAPP_LINK } from "@/lib/constants";
import { FiMenu, FiX, FiPhone, FiUser, FiLogOut } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, openLogin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-green-100"
          : "bg-transparent"
      }`}
    >
      {/* Full-width inner — no horizontal padding on the wrapper, padding inside */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
              <Image
                src="https://res.cloudinary.com/dqunwksxz/image/upload/f_auto,q_auto/v1781270570/vhc-site/logo.png"
                alt="Varshney Homeopathic Clinic Logo"
                fill
                className="object-contain"
                priority
                sizes="56px"
              />
            </div>
            <div className="leading-tight">
              <p className="text-[15px] sm:text-lg font-bold text-green-800 leading-none">
                Varshney Homeopathic
              </p>
              <p className="text-[13px] sm:text-sm text-green-600 leading-tight mt-0.5">Clinic</p>
            </div>
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center mx-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-green-800 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs — right side */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-green-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors whitespace-nowrap"
            >
              <FiPhone className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xl:inline">{PHONE}</span>
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#1fba59] transition-colors whitespace-nowrap"
            >
              <FaWhatsapp className="w-4 h-4 flex-shrink-0" />
              <span>WhatsApp</span>
            </a>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-xl border border-green-200 hover:bg-green-100 transition-colors whitespace-nowrap"
                >
                  <FiUser className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden xl:inline max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-2 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors whitespace-nowrap"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openLogin("patient")}
                  className="flex items-center gap-1.5 px-3 py-2 text-green-700 text-sm font-semibold rounded-xl border border-green-200 hover:bg-green-50 transition-colors whitespace-nowrap"
                >
                  <FiUser className="w-4 h-4" />
                  Login
                </button>
                <Link
                  href="/book"
                  className="flex items-center gap-1.5 px-3 py-2 bg-green-gradient text-white text-sm font-semibold rounded-xl shadow-soft hover:shadow-glow transition-all whitespace-nowrap"
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-green-800 hover:bg-green-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-green-100 shadow-soft">
          <div className="w-full px-4 sm:px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-green-800 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-green-100 flex flex-col gap-2">
              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-green-700 bg-green-50 rounded-xl"
              >
                <FiPhone className="w-4 h-4" />
                {PHONE}
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1fba59] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FaWhatsapp className="w-5 h-5" />
                WhatsApp Consultation
              </a>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-50 text-green-700 font-semibold rounded-xl border border-green-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    My Dashboard ({user.name.split(" ")[0]})
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { openLogin(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-semibold rounded-xl border-2 border-green-300"
                  >
                    <FiUser className="w-4 h-4" />
                    Login / Sign Up
                  </button>
                  <Link
                    href="/book"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-gradient text-white font-semibold rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Appointment
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
