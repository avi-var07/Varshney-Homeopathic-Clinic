"use client";

import Link from "next/link";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { PHONE, WHATSAPP_LINK } from "@/lib/constants";

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-green-100 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center divide-x divide-green-100">
        <a
          href={`tel:${PHONE}`}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-green-700 hover:bg-green-50 transition-colors"
          aria-label="Call clinic"
        >
          <FaPhone className="w-5 h-5" />
          <span className="text-xs font-medium">Call Now</span>
        </a>
        <Link
          href="/book"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 bg-green-gradient text-white hover:opacity-90 transition-opacity"
          aria-label="Book appointment"
        >
          <FiCalendar className="w-5 h-5" />
          <span className="text-xs font-medium">Book Now</span>
        </Link>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[#25D366] hover:bg-green-50 transition-colors"
          aria-label="WhatsApp consultation"
        >
          <FaWhatsapp className="w-5 h-5" />
          <span className="text-xs font-medium">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
