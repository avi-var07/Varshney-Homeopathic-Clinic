"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, PHONE, WHATSAPP_LINK } from "@/lib/constants";
import { FiMenu, FiX, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Varshney Homeopathic Clinic Logo"
                fill
                className="object-contain"
                priority
                sizes="40px"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-bold text-green-800 leading-none">
                Varshney Homeopathic
              </p>
              <p className="text-xs text-green-600 leading-tight mt-0.5">Clinic</p>
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
            <Link
              href="/#appointment"
              className="flex items-center gap-1.5 px-3 py-2 bg-green-gradient text-white text-sm font-semibold rounded-xl shadow-soft hover:shadow-glow transition-all whitespace-nowrap"
            >
              Book Appointment
            </Link>
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
              <Link
                href="/#appointment"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-gradient text-white font-semibold rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
