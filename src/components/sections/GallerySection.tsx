"use client";

import { useState } from "react";

const galleryItems = [
  {
    id: 1,
    image: "/images/outside.webp",
    emoji: "🏥",
    label: "Clinic Exterior",
    category: "Clinic",
    bg: "from-green-100 to-green-200",
  },
  {
    id: 2,
    image: "/images/inside.webp",
    emoji: "💊",
    label: "Inside Clinic",
    category: "Clinic",
    bg: "from-blue-100 to-blue-200",
  },
  {
    id: 3,
    image: "/images/Dr Aman.png",
    emoji: "👨‍⚕️",
    label: "Dr. Aman Varshney",
    category: "Consultation",
    bg: "from-saffron-100 to-saffron-200",
  },
  {
    id: 4,
    image: "/images/medicines.webp",
    emoji: "🌿",
    label: "Homeopathic Medicines",
    category: "Pharmacy",
    bg: "from-emerald-100 to-emerald-200",
  },
  {
    id: 5,
    image: "/images/prescription.webp",
    emoji: "📋",
    label: "Patient Consultation",
    category: "Consultation",
    bg: "from-rose-100 to-rose-200",
  },
  {
    id: 6,
    image: "/images/about.webp",
    emoji: "🏕️",
    label: "About the Clinic",
    category: "Clinic",
    bg: "from-amber-100 to-amber-200",
  },
  {
    id: 7,
    image: "",
    emoji: "💉",
    label: "Medicines Collection",
    category: "Pharmacy",
    bg: "from-purple-100 to-purple-200",
  },
  {
    id: 8,
    image: "",
    emoji: "🤝",
    label: "Community Service",
    category: "Community",
    bg: "from-teal-100 to-teal-200",
  },
];

const categories = ["All", "Clinic", "Consultation", "Pharmacy", "Community"];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="section-pad bg-cream-50">
      <div className="container-pad">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="badge-saffron mb-3">Gallery</span>
          <h2 className="section-title mb-4">
            Our Clinic & <span className="text-gradient">Community</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            A warm, welcoming environment where healing begins. See our clinic, team, and community activities.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-green-gradient text-white shadow-soft"
                  : "bg-white text-green-700 border border-green-200 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`group bg-gradient-to-br ${item.bg} rounded-3xl aspect-square flex flex-col items-center justify-center border border-white/50 overflow-hidden hover:shadow-soft transition-all duration-300 hover:-translate-y-1 cursor-pointer relative`}
            >
              {item.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <span className="relative z-10 text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full self-end mb-3 mr-3 ml-auto">
                    {item.label}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </span>
                  <span className="text-xs font-medium text-green-800 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    {item.label}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Upload note */}
        <p className="text-center text-green-500 text-sm mt-6">
          📸 Gallery photos will be uploaded by clinic admin.{" "}
          <a
            href="/#contact"
            className="text-green-700 font-medium hover:underline"
          >
            Contact us
          </a>{" "}
          to share your story.
        </p>
      </div>
    </section>
  );
}
