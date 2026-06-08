"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiMessageCircle } from "react-icons/fi";
import { WHATSAPP_LINK, DOCTOR_NAME, PHONE } from "@/lib/constants";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3">
      {/* Chat popup */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 w-72 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl">🌿</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{DOCTOR_NAME}</p>
                <p className="text-green-100 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-200 inline-block animate-pulse"></span>
                  Typically replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-green-100 mb-4">
              <p className="text-green-900 text-sm leading-relaxed">
                👋 Namaste! I am <strong>Dr. Aman Varshney</strong>.
              </p>
              <p className="text-green-700 text-sm mt-1 leading-relaxed">
                How can I help you today? You can ask me about treatments, book an appointment, or get a free consultation.
              </p>
              <p className="text-green-400 text-xs mt-1">Just now</p>
            </div>

            <div className="space-y-2 mb-4">
              {[
                "Book an appointment",
                "Ask about treatment",
                "Get consultation",
              ].map((msg) => (
                <a
                  key={msg}
                  href={`https://wa.me/917388333991?text=${encodeURIComponent(msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm rounded-xl border border-green-200 transition-colors"
                >
                  {msg}
                </a>
              ))}
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center"
            >
              <FaWhatsapp className="w-5 h-5" />
              Open WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="whatsapp-pulse w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:bg-[#1fba59] transition-all duration-300 hover:scale-110"
        aria-label="Open WhatsApp chat"
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-white" />
        ) : (
          <FaWhatsapp className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
}
