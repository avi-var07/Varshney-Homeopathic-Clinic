"use client";

import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";

const STORE_ADDRESS = "74JC+VM, Pandit Deen Dayal Upadhyaya Nagar, Uttar Pradesh";
const MAPS_URL = "https://maps.google.com/?q=74JC%2BVM+Pandit+Deen+Dayal+Upadhyaya+Nagar+Uttar+Pradesh";

export default function OurStoreSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(STORE_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="our-store" className="section-pad bg-white">
      <div className="container-pad">
        <div className="text-center mb-10">
          <span className="badge-green mb-3">Our Store</span>
          <h2 className="section-title mb-3">
            Trusted Healthcare &{" "}
            <span className="text-gradient">Pharmacy Services</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Visit our pharmacy for authentic homeopathic medicines and healthcare products.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-cream-100 rounded-4xl border border-green-100 shadow-card overflow-hidden hover:shadow-soft transition-all duration-300">

            {/* Store visual header */}
            <div className="bg-green-gradient px-6 py-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-3">
                  <span className="text-3xl">💊</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-0.5">
                  Reliable Homeo Pharmacy
                </h3>
                <p className="text-green-200 text-sm font-medium">
                  Varshney Enterprises
                </p>
              </div>
            </div>

            {/* Store details */}
            <div className="p-6 space-y-4">
              {/* Description */}
              <p className="text-green-700 text-sm leading-relaxed text-center">
                Your trusted source for authentic, high-quality homeopathic medicines.
                Stocked with remedies prescribed by Dr. Aman Varshney for all chronic
                and acute conditions.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "✅", text: "Authentic Medicines" },
                  { icon: "🌿", text: "Natural Remedies" },
                  { icon: "🚚", text: "Home Delivery" },
                ].map((item) => (
                  <div key={item.text}
                    className="bg-white rounded-2xl p-3 text-center border border-green-100 shadow-sm">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-green-700 text-xs font-medium mt-1 leading-tight">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-saffron-100 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4 text-saffron-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-green-500 text-xs font-semibold uppercase tracking-wide mb-0.5">
                      Store Address
                    </p>
                    <p className="text-green-800 text-sm font-medium leading-relaxed">
                      {STORE_ADDRESS}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-xl transition-colors flex-shrink-0"
                    aria-label="Copy address"
                  >
                    {copied ? (
                      <><FiCheck className="w-3.5 h-3.5 text-green-600" /> Copied!</>
                    ) : (
                      <><FiCopy className="w-3.5 h-3.5" /> Copy</>
                    )}
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-2xl transition-colors text-sm"
                >
                  <FaMapMarkerAlt className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href="https://wa.me/917388333991?text=Hello%2C%20I%20want%20to%20order%20medicines%20from%20Reliable%20Homeo%20Pharmacy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1fba59] text-white font-semibold rounded-2xl transition-colors text-sm"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Order via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
